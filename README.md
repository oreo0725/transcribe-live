# TranscribeLive

A modern, real-time speech transcription web application that converts spoken language into text with high accuracy and minimal delay.

![TranscribeLive Screenshot](screenshot.png)

## 🌟 Features

- **Real-time transcription** of speech using advanced AI models
- **Smart segmentation** that intelligently detects speech patterns, pauses, and silence
- **Noise filtering** to ensure accurate transcription in different environments
- **Multiple language support** using ISO language codes
- **SRT subtitle export** for easy integration with video editing tools
- **Customizable API configuration** compatible with OpenAI and other Whisper API implementations
- **Elegant, responsive UI** that works on both desktop and mobile devices

## 🔧 Technology Stack

- **Frontend Framework**: Vue.js 3 (Composition API)
- **Build Tool**: Webpack 5
- **Audio Processing**: Web Audio API & MediaRecorder API
- **Styling**: Custom CSS with CSS variables for theming
- **Transcription**: OpenAI Whisper API (or compatible alternatives)

## 📋 Requirements

- Node.js (v14 or later)
- Modern web browser with support for MediaRecorder API and Web Audio API
- OpenAI API key or compatible Whisper API endpoint

## 🚀 Getting Started

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. For production build:
   ```bash
   npm run build
   ```

### API Configuration

TranscribeLive requires access to a Whisper API endpoint for speech-to-text transcription. You can use OpenAI's API or any compatible implementation.

1. Click the "Config" button in the application
2. Enter your API details:
   - **API URL**: Your Whisper API endpoint URL
   - **API Key**: Your API authentication key
   - **Model**: The model name (e.g., "whisper-1")
   - **Language**: ISO language code (e.g., "zh" for Chinese, "en" for English)
   - **Prompt**: Optional prompt to guide the transcription model

## 🎯 How to Use

1. **Configure your API settings** by clicking the "Config" button
2. **Start recording** by clicking the "Record" button
3. **Speak clearly** into your microphone
4. **Watch real-time transcription** appear in the transcription panel
5. **Stop recording** when finished
6. **Export subtitles** as SRT files by clicking the "Export Subtitles" button

## 🏗️ Project Structure

```
TranscribeLive/
├── dist/               # Compiled files
├── src/                # Source files
│   ├── api/            # API integration
│   │   └── whisper.js  # Whisper API client
│   ├── components/     # Vue components
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   ├── Controls.vue
│   │   ├── TranscriptionPanel.vue
│   │   └── ConfigDialog.vue
│   ├── App.vue         # Main application component
│   ├── main.js         # Application entry point
│   ├── index.html      # HTML template
│   └── style.css       # Global styles
├── webpack.config.js   # Webpack configuration
└── package.json        # Project metadata and dependencies
```

## 🧠 Technical Details

### Audio Processing

TranscribeLive uses the Web Audio API for volume detection and audio analysis, combined with the MediaRecorder API for capturing audio streams. Key features include:

- **Intelligent speech detection** with configurable thresholds
- **Dynamic pause detection** that adapts to speaker patterns
- **Human voice frequency analysis** (85-255Hz range) to distinguish speech from background noise
- **Smart segmentation** based on natural speech patterns

### Transcription Process

1. Audio is recorded in manageable segments based on speech patterns
2. Silent or noise-only segments are automatically filtered out
3. Speech segments are uploaded to the Whisper API
4. Transcription results are displayed with precise timestamps
5. Full session transcription is accumulated for export

## 🔒 Privacy Considerations

- All audio processing for silence/speech detection happens locally in the browser
- Audio is only sent to the configured API endpoint when speech is detected
- No audio or transcription data is stored on any server unless your configured API does so
- Configuration settings are stored only in your browser's localStorage

## 🔜 Future Enhancements

- Noise reduction preprocessing for improved accuracy
- Speaker identification and labeling
- Real-time translation capabilities
- Offline mode with local models
- Theme customization options

## 📄 License

MIT License

## 🙏 Acknowledgements

- [OpenAI Whisper](https://openai.com/research/whisper) for the speech recognition technology
- [Vue.js](https://vuejs.org/) for the reactive UI framework
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) for audio processing capabilities