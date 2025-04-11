import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

const savedConfig = JSON.parse(localStorage.getItem('whisper_api_config') || '{}');

const app = createApp(App);

// 將設定掛載到全域
app.config.globalProperties.$apiConfig = savedConfig;

// 方便API模組存取Vue app實例
window.__app__ = app;

app.mount('#app');