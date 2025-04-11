<template>
  <section class="controls-container">
    <div class="controls-actions">
      <button
        class="record-btn"
        :class="{ 'recording': isRecording }"
        @click="toggleRecording"
      >
        <span class="btn-icon">
          <span v-if="isRecording" class="stop-icon"></span>
          <span v-else class="record-icon"></span>
        </span>
        <span class="btn-text">{{ isRecording ? '停止' : '錄音' }}</span>
      </button>
      
      <div class="secondary-actions">
        <button class="config-btn btn-outlined" @click="$emit('open-config')">
          <span class="btn-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5 2C10.9477 2 10.5 2.44772 10.5 3V3.17071C10.5 3.58254 10.1822 3.90036 9.77119 3.98236C9.39837 4.05705 9.03003 4.15459 8.67085 4.27267C8.27531 4.4036 7.83615 4.27448 7.57113 3.96109L7.45711 3.82322C7.07711 3.36741 6.40435 3.31259 5.96194 3.70521L5.2539 4.34215C4.81189 4.73435 4.75648 5.4071 5.14634 5.85355L5.2775 6.00791C5.54276 6.32155 5.41386 6.76129 5.0182 6.89247C4.66239 7.01024 4.31701 7.15805 3.98639 7.32959C3.61417 7.52248 3.15624 7.41589 2.92935 7.08136C2.86096 6.97686 2.78704 6.87687 2.70711 6.78249C2.31658 6.32668 1.64382 6.27186 1.20141 6.66448L0.49337 7.30142C0.0513671 7.69363 -0.00404496 8.36637 0.385815 8.81282L0.516967 8.96718C0.782225 9.28082 0.653332 9.72056 0.257675 9.85174C0.0878519 9.9243 0 10.0989 0 10.2929V11.7071C0 11.9011 0.0878519 12.0757 0.257675 12.1483C0.653332 12.2794 0.782225 12.7192 0.516967 13.0328L0.385815 13.1872C-0.00404496 13.6336 0.0513671 14.3064 0.49337 14.6986L1.20141 15.3355C1.64383 15.7281 2.31658 15.6733 2.70711 15.2175C2.78704 15.1231 2.86096 15.0231 2.92935 14.9186C3.15624 14.5841 3.61417 14.4775 3.98639 14.6704C4.31701 14.842 4.66239 14.9898 5.0182 15.1075C5.41386 15.2387 5.54276 15.6785 5.2775 15.9921L5.14634 16.1464C4.75648 16.5929 4.81189 17.2657 5.2539 17.6578L5.96194 18.2948C6.40435 18.6874 7.07711 18.6326 7.45711 18.1768L7.57113 18.0389C7.83615 17.7255 8.27531 17.5964 8.67085 17.7273C9.03003 17.8454 9.39837 17.943 9.77119 18.0176C10.1822 18.0996 10.5 18.4175 10.5 18.8293V19C10.5 19.5523 10.9477 20 11.5 20H12.5C13.0523 20 13.5 19.5523 13.5 19V18.8293C13.5 18.4175 13.8178 18.0996 14.2288 18.0176C14.6016 17.943 14.97 17.8454 15.3292 17.7273C15.7247 17.5964 16.1639 17.7255 16.4289 18.0389L16.5429 18.1768C16.9229 18.6326 17.5957 18.6874 18.0381 18.2948L18.7461 17.6578C19.1881 17.2657 19.2435 16.5929 18.8537 16.1464L18.7225 15.9921C18.4572 15.6785 18.5861 15.2387 18.9818 15.1075C19.3376 14.9898 19.683 14.842 20.0136 14.6704C20.3858 14.4775 20.8438 14.5841 21.0706 14.9186C21.139 15.0231 21.213 15.1231 21.2929 15.2175C21.6834 15.6733 22.3562 15.7281 22.7986 15.3355L23.5066 14.6986C23.9486 14.3064 24.004 13.6336 23.6142 13.1872L23.483 13.0328C23.2178 12.7192 23.3467 12.2794 23.7423 12.1483C23.9121 12.0757 24 11.9011 24 11.7071V10.2929C24 10.0989 23.9121 9.9243 23.7423 9.85174C23.3467 9.72056 23.2178 9.28082 23.483 8.96718L23.6142 8.81282C24.004 8.36637 23.9486 7.69363 23.5066 7.30142L22.7986 6.66448C22.3562 6.27186 21.6834 6.32668 21.2929 6.78249C21.213 6.87687 21.139 6.97686 21.0706 7.08136C20.8438 7.41589 20.3858 7.52248 20.0136 7.32959C19.683 7.15805 19.3376 7.01024 18.9818 6.89247C18.5861 6.76129 18.4572 6.32155 18.7225 6.00791L18.8537 5.85355C19.2435 5.4071 19.1881 4.73435 18.7461 4.34215L18.0381 3.70521C17.5957 3.31259 16.9229 3.36741 16.5429 3.82322L16.4289 3.96109C16.1639 4.27448 15.7247 4.4036 15.3292 4.27267C14.97 4.15459 14.6016 4.05705 14.2288 3.98236C13.8178 3.90036 13.5 3.58254 13.5 3.17071V3C13.5 2.44772 13.0523 2 12.5 2H11.5Z" fill="currentColor" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12Z" fill="currentColor" />
            </svg>
          </span>
          <span class="btn-text">設定</span>
        </button>
        
        <button class="export-btn btn-outlined" @click="$emit('export-srt')">
          <span class="btn-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 5C11 4.44772 11.4477 4 12 4C12.5523 4 13 4.44772 13 5V15C13 15.5523 12.5523 16 12 16C11.4477 16 11 15.5523 11 15V5Z" fill="currentColor" />
              <path d="M7.70711 9.70711C7.31658 9.31658 6.68342 9.31658 6.29289 9.70711C5.90237 10.0976 5.90237 10.7308 6.29289 11.1213L12 16.8284L17.7071 11.1213C18.0976 10.7308 18.0976 10.0976 17.7071 9.70711C17.3166 9.31658 16.6834 9.31658 16.2929 9.70711L12 13.9999L7.70711 9.70711Z" fill="currentColor" />
              <path d="M4 14C4.55228 14 5 14.4477 5 15V17C5 17.5523 5.44772 18 6 18H18C18.5523 18 19 17.5523 19 17V15C19 14.4477 19.4477 14 20 14C20.5523 14 21 14.4477 21 15V17C21 18.6569 19.6569 20 18 20H6C4.34315 20 3 18.6569 3 17V15C3 14.4477 3.44772 14 4 14Z" fill="currentColor" />
            </svg>
          </span>
          <span class="btn-text">匯出字幕</span>
        </button>
      </div>
    </div>
    
    <div class="recording-info" v-if="isRecording">
      <div class="recording-duration">
        <div class="recording-indicator"></div>
        <span class="duration-text">{{ formattedDuration }}</span>
      </div>
      <progress :value="progressValue" max="100"></progress>
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
                // 獲取語言設定，確保只傳遞非空值
                const lang = window.__app__?.config.globalProperties.$apiConfig?.language || '';
                
                // 構建參數對象，只在語言非空時才添加
                const params = {};
                if (lang.trim() !== '') {
                  params.language = lang;
                }
                
                const result = await transcribeAudioSegment(blob, params);
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
.controls-container {
  margin-bottom: var(--spacing-xl);
}

.controls-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.secondary-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: var(--spacing-xs);
}

.record-btn {
  position: relative;
  font-weight: 500;
  min-width: 110px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
}

.record-btn.recording {
  background: linear-gradient(135deg, var(--color-recording), #d43f32);
}

.record-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-elevated);
}

.record-icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: currentColor;
}

.stop-icon {
  display: inline-block;
  width: 10px;
  height: 10px;
  background-color: currentColor;
}

.recording-info {
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--color-surface);
  border: 1px solid var(--color-divider);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-subtle);
}

.recording-duration {
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-sm);
  font-family: 'Inter', monospace;
  font-weight: 500;
}

.recording-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--color-recording);
  margin-right: var(--spacing-sm);
  animation: pulse 1.5s infinite;
}

.duration-text {
  color: var(--color-text-primary);
  font-size: 0.95rem;
}

progress {
  width: 100%;
  margin-top: var(--spacing-xs);
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .controls-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .record-btn {
    margin-bottom: var(--spacing-sm);
    order: -1;
  }
  
  .secondary-actions {
    justify-content: space-between;
  }
  
  .config-btn,
  .export-btn {
    flex: 1;
  }
}
</style>
