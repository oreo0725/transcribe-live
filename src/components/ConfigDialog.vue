<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h2>API 設定</h2>
        <button class="close-btn" @click="$emit('close')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.89a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" fill="currentColor" />
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label for="apiUrl">API URL</label>
          <input type="text" id="apiUrl" v-model="apiUrl" placeholder="https://api.openai.com/v1/audio/transcriptions" />
        </div>
        
        <div class="form-group">
          <label for="apiKey">API Key</label>
          <input type="text" id="apiKey" v-model="apiKey" placeholder="sk-..." />
        </div>
        
        <div class="form-group">
          <label for="model">模型名稱</label>
          <input type="text" id="model" v-model="model" placeholder="whisper-1" />
        </div>
        
        <div class="form-group">
          <label for="language">語言</label>
          <input type="text" id="language" v-model="language" placeholder="zh" />
          <div class="input-hint">輸入 ISO 語言代碼，例如：zh（中文）、en（英文）</div>
        </div>
        
        <div class="form-group">
          <label for="prompt">提示詞</label>
          <textarea
            id="prompt"
            rows="3"
            v-model="prompt"
            placeholder="always transcribe into zh-tw text when the output language is chinese"
          ></textarea>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn-outlined" @click="$emit('close')">取消</button>
        <button class="btn-primary" @click="saveConfig">儲存設定</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      apiUrl: '',
      apiKey: '',
      model: '',
      prompt: '',
      language: ''
    };
  },
  mounted() {
    const saved = JSON.parse(localStorage.getItem('whisper_api_config') || '{}');
    this.apiUrl = saved.apiUrl || '';
    this.apiKey = saved.apiKey || '';
    this.model = saved.model || '';
    this.prompt = saved.prompt || '';
    this.language = saved.language || '';
  },
  methods: {
    saveConfig() {
      const config = {
        apiUrl: this.apiUrl,
        apiKey: this.apiKey,
        model: this.model,
        prompt: this.prompt,
        language: this.language
      };
      localStorage.setItem('whisper_api_config', JSON.stringify(config));
      if (window.__app__) {
        window.__app__.config.globalProperties.$apiConfig = config;
      }
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn var(--transition-normal) ease-out;
}

.modal {
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  width: 90%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-elevated);
  animation: slideIn var(--transition-normal) ease-out;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-divider);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs);
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-circle);
  transition: all var(--transition-fast) ease;
  box-shadow: none;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--color-text-primary);
  transform: none;
}

.modal-body {
  padding: var(--spacing-lg);
  max-height: 60vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
  font-size: 0.95rem;
  color: var(--color-text-primary);
}

.input-hint {
  margin-top: var(--spacing-xs);
  font-size: 0.8rem;
  color: var(--color-text-tertiary);
  line-height: 1.4;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--color-divider);
  background-color: rgba(0, 0, 0, 0.02);
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-weight: 500;
  transition: background-color var(--transition-fast) ease;
}

.btn-primary:hover {
  background-color: var(--color-primary-light);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>