<template>
  <section class="transcription-panel">
    <div v-if="transcriptions.length === 0">
      <p>Transcriptions will appear here.</p>
    </div>
    <ul v-else>
      <li v-for="(seg, index) in transcriptions" :key="index">
        [{{ formatTime(seg.start) }} - {{ formatTime(seg.end) }}] {{ seg.text }}
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  props: {
    transcriptions: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formatTime(seconds) {
      // 將秒數轉換為 HH:mm:ss 格式
      const totalSeconds = Math.floor(seconds);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const secs = String(totalSeconds % 60).padStart(2, '0');
      return `${hours}:${minutes}:${secs}`;
    }
  }
}
</script>

<style scoped>
.transcription-panel {
  flex: 1;
  padding: 1rem;
  background: #fff;
  overflow-y: auto;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;
}
</style>