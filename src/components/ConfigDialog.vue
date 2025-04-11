<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal">
      <h2>Configuration</h2>
      <label>API URL: <input type="text" v-model="apiUrl" /></label>
      <label>API Key: <input type="text" v-model="apiKey" /></label>
      <label>Model: <input type="text" v-model="model" /></label>
      <label>Prompt: <textarea rows="3" v-model="prompt"></textarea></label>
      <label>Language: <input type="text" v-model="language" placeholder="e.g., zh" /></label>
      <div style="display: flex; justify-content: flex-end; gap: 0.5rem;">
        <button @click="saveConfig">Save</button>
        <button @click="$emit('close')">Close</button>
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
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.modal label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
}
.modal button {
  align-self: flex-end;
  padding: 0.5rem 1rem;
}
</style>