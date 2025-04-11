<template>
  <section class="controls">
    <button class="record-btn" @click="toggleRecording">{{ isRecording ? 'Stop' : 'Record' }}</button>
    <button class="config-btn" @click="$emit('open-config')">Config</button>
    <button class="export-btn" @click="$emit('export-srt')">匯出字幕</button>
    <div class="recording-info" v-if="isRecording">
      <progress :value="progressValue" max="100"></progress>
      <span>{{ formattedDuration }}</span>
    </div>
  </section>
</template>

<script>
import { transcribeAudioSegment } from '../api/whisper.js';

// 核心配置參數 - 調整以提高敏感度並確保按時間強制分段
const MAX_SEGMENT_DURATION_MS = 10000; // 最大片段時長 (10秒)
const OPTIMAL_SEGMENT_DURATION_MS = 8000; // 理想分段時間 (8秒，連續說話時)
const SILENCE_THRESHOLD_MS = 2000; // 語音結束後的靜音閾值 (2秒)
const LONG_SILENCE_THRESHOLD_MS = 5000; // 持續靜音閾值 (5秒)
const MIN_SEGMENT_DURATION_MS = 2000; // 最小有效片段時長 (2秒)
const VOLUME_THRESHOLD = 4; // 音量閾值 (0-100)，降低以捕捉一般音量說話
const VOLUME_HISTORY_SIZE = 5; // 減少歷史記錄長度，提高靈敏度
const MIN_CONTINUOUS_SPEECH_MS = 500; // 最小連續說話時間 (0.5秒)
const BRIEF_PAUSE_THRESHOLD_MS = 800; // 短暫停頓閾值 (0.8秒)，低於此值不視為真正停頓
const PAUSE_TOLERANCE_COUNT = 3; // 允許的短暫停頓次數，超過才視為真正的句子結束

export default {
  data() {
    return {
      mediaRecorder: null,
      isRecording: false,
      stream: null,
      startTime: null,
      duration: 0,
      timerInterval: null,
      progressValue: 0,
      audioContext: null,
      analyser: null,
      dataArray: null,
      isSpeaking: false,
      silenceStart: 0,
      segmentStartTime: 0, // 當前片段開始時間 (相對於錄音開始) 秒
      totalElapsedTime: 0, // 總錄音時間 (秒)
      audioChunks: [], // 暫存音訊塊
      volumeCheckInterval: null,
      forceSubmitInterval: null,
      speechStartTime: 0,
      volumeHistory: [], // 用於存儲最近的音量歷史，提高判斷穩定性
      hasSpokenInSegment: false, // 當前片段是否檢測到過語音
      lastSubmissionTime: 0, // 上次提交片段的時間，避免過於頻繁提交
      briefPauseCount: 0, // 記錄短暫停頓次數
      inPauseState: false, // 當前是否處於短暫停頓狀態
      pauseStartTime: 0, // 當前停頓開始時間
      humanVoiceConfidence: 0 // 人聲可信度 (0-100)
    };
  },
  computed: {
    formattedDuration() {
      const totalSeconds = Math.floor(this.duration / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    }
  },
  methods: {
    async toggleRecording() {
      if (this.isRecording) {
        this.stopRecording();
      } else {
        await this.startRecording();
      }
    },
    
    async startRecording() {
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.isRecording = true;
        this.startTime = Date.now();
        this.duration = 0;
        this.totalElapsedTime = 0;
        this.segmentStartTime = 0;
        this.isSpeaking = false;
        this.silenceStart = 0;
        this.audioChunks = [];
        
        // 重置狀態
        this.volumeHistory = [];
        this.hasSpokenInSegment = false;
        this.lastSubmissionTime = 0;
        
        // 重置短暫停頓相關狀態
        this.briefPauseCount = 0;
        this.inPauseState = false;
        this.pauseStartTime = 0;
        this.humanVoiceConfidence = 0;
        
        // 初始化音訊分析器
        this.setupAudioAnalyser();

        // 開始第一個錄音片段
        this.startNewSegmentRecorder();

        // 更新UI計時器 (每50ms更新一次UI)
        this.timerInterval = setInterval(() => {
          // 更新總錄音時間
          this.duration = Date.now() - this.startTime;
          // 進度條顯示當前片段錄製進度相對於最大片段時間
          const currentSegmentDuration = this.getCurrentSegmentDuration();
          this.progressValue = (currentSegmentDuration % MAX_SEGMENT_DURATION_MS) / (MAX_SEGMENT_DURATION_MS / 100);
        }, 50);

        // 開始音量檢測 (每50ms檢測一次音量，提高靈敏度)
        this.volumeCheckInterval = setInterval(this.checkAudioVolume, 50);
        
        // 啟動強制定時器，確保每隔一段時間至少有一次分段
        this.forceSubmitInterval = setInterval(() => {
          // 只有在有語音內容時才觸發強制提交
          if (this.hasSpokenInSegment && this.getCurrentSegmentDuration() >= OPTIMAL_SEGMENT_DURATION_MS) {
            console.log(`強制分段: 已錄製 ${OPTIMAL_SEGMENT_DURATION_MS/1000}秒 (避免片段過長)`);
            this.submitSegment();
          }
        }, OPTIMAL_SEGMENT_DURATION_MS / 2); // 更頻繁地檢查，確保不會延遲太多
        
        console.log('錄音開始: 啟用智能分段 (音量閾值:', VOLUME_THRESHOLD, ')');
      } catch (err) {
        console.error('Error accessing microphone:', err);
        this.isRecording = false; // 確保狀態正確
      }
    },

    setupAudioAnalyser() {
      if (!this.stream) return;
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        
        // 配置音訊分析器參數以獲得更好的語音分析
        const microphone = this.audioContext.createMediaStreamSource(this.stream);
        microphone.connect(this.analyser);
        
        // 設置 FFT 大小
        this.analyser.fftSize = 512; // 平衡頻率分析精度和性能
        const bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(bufferLength);
        
        // 配置分析器以更好地專注於語音頻率範圍
        this.analyser.minDecibels = -90; // 設置最小分貝數（降低以捕獲更多低音量語音）
        this.analyser.maxDecibels = -10; // 設置最大分貝數
        this.analyser.smoothingTimeConstant = 0.4; // 平滑處理 (0-1，越高越平滑)
        
        console.log('音訊分析器設置完成 (提高靈敏度)');
      } catch (err) {
        console.error('音訊分析器設置失敗:', err);
      }
    },
    
    /**
     * 計算當前片段的持續時間（毫秒）
     */
    getCurrentSegmentDuration() {
      return Date.now() - (this.startTime + this.segmentStartTime * 1000);
    },
    
    /**
     * 檢測音量並判斷語音/靜音狀態
     * 結合音量歷史進行穩定判斷
     */
    checkAudioVolume() {
      if (!this.isRecording || !this.analyser || !this.dataArray) return;

      try {
        // 獲取頻率數據
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // 計算平均音量
        let sum = 0;
        let humanVoiceSum = 0;
        let humanVoiceCount = 0;
        
        // 計算總體音量和人聲頻段音量 (85-255 Hz 範圍)
        // 對於 fftSize=512, 對應的頻率範圍計算:
        // 對於 48kHz 採樣率, 每個頻段大約是 48000/512 ≈ 93.75 Hz
        // 人聲範圍大約在 1-3 個頻段內
        const sampleRate = this.audioContext?.sampleRate || 48000;
        const binSize = sampleRate / (this.analyser?.fftSize || 512);
        
        for (let i = 0; i < this.dataArray.length; i++) {
          sum += this.dataArray[i];
          
          // 計算當前頻段的頻率
          const frequency = i * binSize;
          
          // 如果是人聲頻段 (85-255 Hz) 則額外計算
          if (frequency >= 85 && frequency <= 255) {
            humanVoiceSum += this.dataArray[i];
            humanVoiceCount++;
          }
        }
        
        const currentVolume = sum / this.dataArray.length * (100 / 256);
        
        // 計算人聲頻段的平均能量
        let humanVoiceEnergy = 0;
        if (humanVoiceCount > 0) {
          humanVoiceEnergy = humanVoiceSum / humanVoiceCount * (100 / 256);
        }
        
        // 更新人聲可信度 (比較人聲頻段能量與總體能量)
        // 如果人聲頻段能量佔比高，則提高可信度
        this.humanVoiceConfidence = humanVoiceCount > 0 ?
          Math.min(100, (humanVoiceEnergy / (currentVolume || 1)) * 100) : 0;
          
        // 更新音量歷史 - 使用短隊列提高靈敏度
        this.volumeHistory.push(currentVolume);
        if (this.volumeHistory.length > VOLUME_HISTORY_SIZE) {
          this.volumeHistory.shift();
        }
        
        // 計算穩定音量值，但更重視最新音量 (加權平均)
        let weightedSum = 0;
        let totalWeight = 0;
        for (let i = 0; i < this.volumeHistory.length; i++) {
          const weight = (i + 1); // 較新的樣本權重更高
          weightedSum += this.volumeHistory[i] * weight;
          totalWeight += weight;
        }
        const averageVolume = weightedSum / totalWeight;
        
        // 動態調整的音量檢測 - 判斷是否正在說話
        // 結合人聲可信度進行判斷，提高對真實人聲的敏感度
        const humanVoiceModifier = this.humanVoiceConfidence > 60 ? 0.8 : 1.0;
        const effectiveThreshold = VOLUME_THRESHOLD * humanVoiceModifier;
        const speakingNow = averageVolume >= effectiveThreshold;
        
        // 顯示當前音量資訊 (每秒一次，避免日誌過多)
        if (Date.now() % 1000 < 50) {
          console.log(`目前音量: ${averageVolume.toFixed(1)}, 人聲可信度: ${this.humanVoiceConfidence.toFixed(1)}%, 閾值: ${effectiveThreshold.toFixed(1)}, 說話中: ${speakingNow}`);
        }
  
        // === 短暫停頓處理邏輯 ===
        // 檢測語音開始
        if (speakingNow && !this.isSpeaking) {
          console.log(`語音開始 (音量: ${averageVolume.toFixed(1)}, 人聲可信度: ${this.humanVoiceConfidence.toFixed(1)}%)`);
          
          // 如果在短暫停頓狀態下恢復說話，取消停頓狀態
          if (this.inPauseState) {
            const pauseDuration = Date.now() - this.pauseStartTime;
            console.log(`短暫停頓結束 (持續: ${(pauseDuration/1000).toFixed(1)}秒), 恢復說話`);
            this.inPauseState = false;
            this.pauseStartTime = 0;
          }
          
          this.isSpeaking = true;
          this.hasSpokenInSegment = true;
          this.speechStartTime = Date.now();
          this.silenceStart = 0;
        }
        // 檢測語音結束
        else if (!speakingNow && this.isSpeaking) {
          const speechDuration = Date.now() - (this.speechStartTime || 0);
          
          // 只有說話時間超過最小閾值才算是有效說話
          if (speechDuration >= MIN_CONTINUOUS_SPEECH_MS) {
            console.log(`語音暫停 (持續: ${(speechDuration/1000).toFixed(1)}秒, 音量: ${averageVolume.toFixed(1)})`);
            
            // 標記為短暫停頓狀態，而不是直接轉為靜音
            this.inPauseState = true;
            this.pauseStartTime = Date.now();
            this.briefPauseCount++;
            
            console.log(`進入短暫停頓狀態 #${this.briefPauseCount} (容忍閾值: ${BRIEF_PAUSE_THRESHOLD_MS}ms, 最大次數: ${PAUSE_TOLERANCE_COUNT}次)`);
          } else {
            console.log(`忽略短暫噪音 (${(speechDuration/1000).toFixed(1)}秒)`);
          }
          
          this.isSpeaking = false;
        }
        
        // 檢查短暫停頓是否轉變為真正的靜音
        if (this.inPauseState) {
          const pauseDuration = Date.now() - this.pauseStartTime;
          
          // 如果短暫停頓持續時間超過閾值，判斷為真正停頓
          if (pauseDuration >= BRIEF_PAUSE_THRESHOLD_MS) {
            const exceededPauseTolerance = this.briefPauseCount >= PAUSE_TOLERANCE_COUNT;
            
            // 如果超過容忍次數或停頓時間已達到靜音閾值，標記為真正的靜音
            if (exceededPauseTolerance || pauseDuration >= SILENCE_THRESHOLD_MS) {
              console.log(`短暫停頓持續時間超過${pauseDuration >= SILENCE_THRESHOLD_MS ? '靜音閾值' : '容忍次數'}, 轉為真正靜音`);
              this.silenceStart = this.pauseStartTime; // 使用停頓開始時間作為靜音開始時間
              this.inPauseState = false;
            }
          }
        }
  
        // 檢查是否需要提交片段
        this.checkSegmentSubmission();
      } catch (err) {
        console.error('音量檢測發生錯誤:', err);
      }
    },

    /**
     * 檢查是否應該提交當前錄音片段
     * 三種條件：最大片段長度、語音後靜音、長時間靜音
     */
    checkSegmentSubmission() {
      const now = Date.now();
      const currentSegmentDuration = this.getCurrentSegmentDuration();

      // 強制最小間隔 (750ms)，避免過於頻繁提交
      if (now - this.lastSubmissionTime < 750) {
        return;
      }

      // 條件1: 達到最大片段時長 (20秒)
      if (currentSegmentDuration >= MAX_SEGMENT_DURATION_MS) {
        console.log(`達到最大長度 (${MAX_SEGMENT_DURATION_MS/1000}秒)，提交片段`);
        this.submitSegment();
        return;
      }

      // 條件2: 語音結束後短暫靜音 (2秒) - 典型的句子間停頓
      if (this.hasSpokenInSegment && !this.isSpeaking && this.silenceStart > 0 && (now - this.silenceStart >= SILENCE_THRESHOLD_MS)) {
        // 檢查是否處於短暫停頓狀態 - 如果是，且未達到最大容忍次數，則不直接分段
        if (this.inPauseState && this.briefPauseCount < PAUSE_TOLERANCE_COUNT) {
          console.log(`偵測到靜音但處於短暫停頓期間 (${this.briefPauseCount}/${PAUSE_TOLERANCE_COUNT})，暫不分段`);
          return;
        }
        
        // 確保片段至少有最小有效長度
        if (currentSegmentDuration >= MIN_SEGMENT_DURATION_MS) {
          console.log(`語音後靜音達 ${SILENCE_THRESHOLD_MS/1000} 秒，提交片段 (人聲可信度: ${this.humanVoiceConfidence.toFixed(1)}%)`);
          this.submitSegment();
          
          // 重置短暫停頓計數
          this.briefPauseCount = 0;
          this.inPauseState = false;
        } else {
          console.log(`片段過短 (${(currentSegmentDuration/1000).toFixed(1)}秒)，等待...`);
          this.silenceStart = now; // 重置靜音計時，避免連續觸發
        }
        return;
      }

      // 條件2.5: 持續說話且達到理想長度 (6秒)
      if (this.hasSpokenInSegment && this.isSpeaking && currentSegmentDuration >= OPTIMAL_SEGMENT_DURATION_MS) {
        console.log(`持續說話達 ${OPTIMAL_SEGMENT_DURATION_MS/1000} 秒，建議提交`);
        // 不直接提交，由強制計時器負責，這裡僅記錄
      }

      // 條件3: 長時間靜音 (5秒)
      if (!this.hasSpokenInSegment && currentSegmentDuration >= LONG_SILENCE_THRESHOLD_MS) {
        console.log(`長時間靜音 (${LONG_SILENCE_THRESHOLD_MS/1000}秒)，丟棄片段`);
        // 丟棄並重新開始
        this.restartSegment();
        return;
      }
    },

    /**
     * 重新開始一個新的片段，丟棄當前片段
     * 用於長時間靜音的情況
     */
    restartSegment() {
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.stop();
        
        // 更新下一個片段的開始時間
        this.totalElapsedTime = (Date.now() - this.startTime) / 1000;
        this.segmentStartTime = this.totalElapsedTime;
        this.hasSpokenInSegment = false; // 重置語音檢測狀態
        
        // 立即開始新的錄音片段
        setTimeout(() => {
          if (this.isRecording) {
            this.startNewSegmentRecorder();
          }
        }, 100);
      }
    },

    /**
     * 開始一個新的錄音片段
     */
    startNewSegmentRecorder() {
      if (!this.stream || this.mediaRecorder?.state === 'recording') return;

      console.log(`【開始新片段】時間點: ${this.totalElapsedTime.toFixed(1)}秒`);
      this.audioChunks = []; // 清空之前的塊
      this.hasSpokenInSegment = false; // 重置語音檢測標記
      this.speechStartTime = 0; // 重置說話開始時間
      
      // 重置短暫停頓相關狀態
      this.briefPauseCount = 0;
      this.inPauseState = false;
      this.pauseStartTime = 0;
      this.humanVoiceConfidence = 0;
      
      try {
        this.mediaRecorder = new MediaRecorder(this.stream, {
          mimeType: 'audio/webm;codecs=opus',
          audioBitsPerSecond: 128000 // 設置較高的音質
        });

        this.mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            this.audioChunks.push(e.data);
          }
        };

        this.mediaRecorder.onstop = async () => {
          if (this.audioChunks.length > 0) {
            const blob = new Blob(this.audioChunks, { type: 'audio/webm;codecs=opus' });
            const segDuration = (this.getCurrentSegmentDuration()/1000).toFixed(1);
            console.log(`【片段完成】大小: ${Math.round(blob.size / 1024)}KB, 時長: ${segDuration}秒, 包含語音: ${this.hasSpokenInSegment}`);

            // 記錄提交時的總時間 (用於時間戳校正)
            const submissionTime = this.totalElapsedTime;
            const segmentDuration = (Date.now() - (this.startTime + this.segmentStartTime * 1000)) / 1000;

            // 判斷片段是否需要轉譯
            const hasMinimumSize = blob.size > 8192; // 檔案大小檢查，僅用於日誌輸出
            const hasValidDuration = segmentDuration > 1.5; // 時長檢查，僅用於日誌輸出
            
            // 只轉譯有語音內容的片段，忽略只有靜音的片段
            const isWorthTranscribing = this.hasSpokenInSegment;
            
            console.log(`轉譯判斷: 有語音=${this.hasSpokenInSegment}, 大小足夠=${hasMinimumSize}, 時長足夠=${hasValidDuration}, 結果=${isWorthTranscribing}`);

            // 轉譯片段（嚴格僅轉譯有語音內容的片段）
            if (isWorthTranscribing) {
              try {
                const lang = window.__app__?.config.globalProperties.$apiConfig?.language || '';
                const result = await transcribeAudioSegment(blob, { language: lang });
                if (result.success && result.segments && result.segments.length > 0) {
                  console.log(`【轉譯成功】${result.segments.length} 個片段`);
                  
                  // 校正時間戳，確保準確反映全局時間
                  const segmentsWithCorrectTimestamps = result.segments.map(seg => ({
                    ...seg,
                    // 校正時間戳：段落開始時間 + API返回的相對時間
                    start: Math.max(0, this.segmentStartTime + seg.start),
                    end: this.segmentStartTime + seg.end
                  }));
                  
                  this.$emit('segment-transcribed', segmentsWithCorrectTimestamps);
                } else {
                  console.log('【轉譯結果為空】API返回無內容');
                }
              } catch (error) {
                console.error('轉譯錯誤:', error);
                this.$emit('transcription-error', error.message || '未知轉譯錯誤');
              }
            } else {
              const reason = !this.hasSpokenInSegment ? '無語音內容' : 
                            !hasMinimumSize ? '檔案過小' : '不符合轉譯條件';
              console.log(`【跳過轉譯】原因: ${reason}`);
            }

            // 更新記錄
            this.lastSubmissionTime = Date.now();
            
            // 更新下一個片段的開始時間 (確保連續)
            this.segmentStartTime = submissionTime;
            
            // 如果還在錄音，立即開始新的錄音器
            if (this.isRecording) {
              this.startNewSegmentRecorder();
            }
          } else {
            console.log('片段無音訊數據');
            
            // 更新時間並重新開始
            this.totalElapsedTime = (Date.now() - this.startTime) / 1000;
            this.segmentStartTime = this.totalElapsedTime;
            
            // 如果還在錄音，立即開始新的錄音器
            if (this.isRecording) {
              this.startNewSegmentRecorder();
            }
          }
        };
        
        this.mediaRecorder.onerror = (event) => {
          console.error('MediaRecorder error:', event);
          // 嘗試重新開始錄音
          if (this.isRecording) {
            setTimeout(() => this.startNewSegmentRecorder(), 500);
          }
        };

        // 開始錄音
        this.mediaRecorder.start();
      } catch (error) {
        console.error('Error starting MediaRecorder:', error);
        // 嘗試重新啟動
        setTimeout(() => {
          if (this.isRecording) {
            this.startNewSegmentRecorder();
          }
        }, 1000);
      }
    },

    /**
     * 提交當前錄音片段進行處理
     */
    submitSegment() {
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        const segmentDuration = this.getCurrentSegmentDuration() / 1000;
        const hasVoice = this.hasSpokenInSegment ? '是' : '否';
        console.log(`【提交片段】時長: ${segmentDuration.toFixed(1)}秒, 有語音: ${hasVoice}, 人聲可信度: ${this.humanVoiceConfidence.toFixed(1)}%`);
        
        // 更新總時間
        this.totalElapsedTime = (Date.now() - this.startTime) / 1000;
        
        // 重置短暫停頓相關狀態
        this.briefPauseCount = 0;
        this.inPauseState = false;
        this.pauseStartTime = 0;
        
        // 停止錄音會觸發 onstop 事件處理
        try {
          this.mediaRecorder.stop();
        } catch (error) {
          console.error('Error stopping MediaRecorder:', error);
          // 錯誤恢復機制
          this.startNewSegmentRecorder();
        }
      }
    },

    stopRecording() {
      if (this.isRecording) {
        clearInterval(this.forceSubmitInterval);
        clearInterval(this.timerInterval);
        clearInterval(this.volumeCheckInterval);
        this.isRecording = false; // 先設置狀態，避免 volume check 繼續

        // 提交最後一個片段
        this.submitSegment();

        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }

        if (this.audioContext) {
          this.audioContext.close().catch(err => console.error('Error closing audio context:', err));
          this.audioContext = null;
          this.analyser = null;
          this.dataArray = null;
        }

        this.progressValue = 0;
        console.log('Recording stopped.');
      }
    }
  },
  beforeUnmount() {
    // 組件銷毀前確保停止錄音和清理資源
    this.stopRecording();
  }
};
</script>

<style scoped>
.controls {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
}
.record-btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}
.recording-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}
progress {
  width: 200px;
  height: 20px;
}
.config-btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}
.export-btn {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}
</style>
