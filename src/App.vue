<template>
  <div class="app-container">
    <HeaderComponent />

    <TranscriptionPanel :transcriptions="transcriptions" />

    <Controls
      @open-config="showConfig = true"
      @segment-transcribed="handleSegment"
      @transcription-error="handleError"
      @export-srt="downloadSRT"
    />

    <ConfigDialog v-if="showConfig" @close="showConfig = false" />

    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from './components/Header.vue';
import TranscriptionPanel from './components/TranscriptionPanel.vue';
import Controls from './components/Controls.vue';
import ConfigDialog from './components/ConfigDialog.vue';
import FooterComponent from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    HeaderComponent,
    TranscriptionPanel,
    Controls,
    ConfigDialog,
    FooterComponent
  },
  data() {
    return {
      showConfig: false,
      transcriptions: []
    };
  },
  methods: {
    handleSegment(segments) {
      segments.forEach(seg => {
        this.transcriptions.push(seg);
      });
    },
    handleError(error) {
      console.error('Transcription error:', error);
      alert('Transcription failed: ' + error);
    },
    downloadSRT() {
      console.log('Exporting SRT file...');
      try {
        function secondsToSRTTime(seconds) {
          // 確保 seconds 是有效數字
          if (isNaN(seconds)) {
            console.warn(`Invalid seconds value: ${seconds}, using 0 instead`);
            seconds = 0;
          }
          
          const date = new Date(0);
          date.setSeconds(seconds);
          const iso = date.toISOString();
          const [h, m, sMs] = iso.substr(11, 12).split(':');
          const [s, ms] = sMs.split('.');
          return `${h}:${m}:${s},${ms.padEnd(3, '0')}`;
        }

        if (!this.transcriptions || this.transcriptions.length === 0) {
          alert('沒有轉譯內容可匯出！');
          return;
        }

        console.log(`Preparing SRT content for ${this.transcriptions.length} segments...`);
        
        // 確保所有片段都有有效的開始和結束時間
        const validTranscriptions = this.transcriptions.filter(seg => {
          if (!seg || typeof seg.start === 'undefined' || typeof seg.end === 'undefined' || !seg.text) {
            console.warn('Invalid segment found:', JSON.stringify(seg));
            return false;
          }
          return true;
        });

        if (validTranscriptions.length === 0) {
          alert('沒有有效的轉譯內容可匯出！');
          return;
        }

        // 排序片段，確保順序正確
        validTranscriptions.sort((a, b) => a.start - b.start);
        
        const srtContent = validTranscriptions.map((seg, idx) => {
          const start = secondsToSRTTime(seg.start);
          const end = secondsToSRTTime(seg.end);
          return `${idx + 1}
${start} --> ${end}
${seg.text}`;
        }).join('\n\n');

        console.log('SRT content created:', srtContent.substring(0, 100) + '...');

        // 使用更可靠的下載機制
        // 直接使用 Blob
        const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
        
        // 使用 FileSaver 模式創建下載
        const filename = `transcription_${new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '')}.srt`;
        
        // 創建一個 <a> 元素並強制下載
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        
        // 必須添加到 DOM 中才能在某些瀏覽器工作
        document.body.appendChild(a);
        
        // 模擬點擊
        console.log('Triggering download click...');
        a.click();
        
        // 延遲清理資源，確保下載開始
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          console.log('SRT download resources cleaned up');
        }, 100);
        
        console.log('SRT download initiated for file:', filename);
        alert('SRT 匯出成功！');
      } catch (error) {
        console.error('Error exporting SRT:', error);
        alert('匯出 SRT 失敗：' + error.message);
      }
    }
  }
};
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  background: #f9f9f9;
  color: #333;
}
</style>