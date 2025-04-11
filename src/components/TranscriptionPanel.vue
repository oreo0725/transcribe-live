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
      return seconds.toFixed(2) + 's';
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