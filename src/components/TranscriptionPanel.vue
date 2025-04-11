<template>
  <section class="transcription-panel card">
    <h2 class="panel-title">實時轉錄</h2>
    
    <div class="transcription-content">
      <div v-if="transcriptions.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C12.5523 15 13 14.5523 13 14C13 13.4477 12.5523 13 12 13C11.4477 13 11 13.4477 11 14C11 14.5523 11.4477 15 12 15Z" fill="currentColor" />
            <path d="M12 12C12.5523 12 13 11.5523 13 11V7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7V11C11 11.5523 11.4477 12 12 12Z" fill="currentColor" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12Z" fill="currentColor" />
          </svg>
        </div>
        <p>開始錄音後，轉錄內容將顯示在此處</p>
      </div>
      
      <transition-group name="fade" tag="ul" v-else class="transcription-list">
        <li v-for="(seg, index) in transcriptions" :key="index" class="transcription-item">
          <div class="transcription-row">
            <div class="timestamp">{{ formatTime(seg.start) }} - {{ formatTime(seg.end) }}</div>
            <div class="content">{{ seg.text }}</div>
          </div>
        </li>
      </transition-group>
    </div>
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
  margin-bottom: var(--spacing-lg);
  position: relative;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.panel-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--color-divider);
}

.transcription-content {
  flex: 1;
  position: relative;
  overflow-y: auto;
  max-height: 400px;
  padding-right: var(--spacing-sm);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--color-text-tertiary);
  text-align: center;
}

.empty-icon {
  margin-bottom: var(--spacing-md);
  color: var(--color-text-tertiary);
  opacity: 0.7;
}

.transcription-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.transcription-item {
  padding: var(--spacing-xs) 0;
  border-bottom: 1px solid var(--color-divider);
  margin-bottom: var(--spacing-xs);
  transition: all var(--transition-fast) ease-out;
}

.transcription-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.transcription-row {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.timestamp {
  font-size: 0.8rem;
  color: var(--color-text-tertiary);
  font-family: 'Inter', monospace;
  font-weight: 500;
  min-width: 125px;
  flex-shrink: 0;
  padding-top: 2px;
}

.content {
  font-size: 1rem;
  line-height: 1.5;
  color: var(--color-text-primary);
  flex-grow: 1;
}

/* 淡入淡出動畫 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 滾動條樣式 */
.transcription-content::-webkit-scrollbar {
  width: 6px;
}

.transcription-content::-webkit-scrollbar-track {
  background: var(--color-divider);
  border-radius: 3px;
}

.transcription-content::-webkit-scrollbar-thumb {
  background: var(--color-primary-light);
  border-radius: 3px;
}

.transcription-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

@media (max-width: 768px) {
  .transcription-panel {
    min-height: 200px;
  }
  
  .transcription-content {
    max-height: 300px;
  }
  
  .transcription-row {
    flex-direction: row;
    align-items: baseline;
    gap: var(--spacing-sm);
  }
  
  .timestamp {
    min-width: 110px;
    font-size: 0.75rem;
  }
  
  .content {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .transcription-row {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .timestamp {
    margin-bottom: 0;
    opacity: 0.7;
  }
}
</style>