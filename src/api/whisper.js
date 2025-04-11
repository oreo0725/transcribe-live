export async function transcribeAudioSegment(blob, params = {}) {
  const config = window.__app__?.config.globalProperties.$apiConfig || {};

  const formData = new FormData();
  formData.append('file', blob, 'audio.webm');
  formData.append('response_format', 'verbose_json');

  // 使用設定中的prompt，否則預設
  formData.append(
    'prompt',
    config.prompt || 'always transcribe into zh-tw text when the output language is chinese'
  );

  if (params.language) formData.append('language', params.language);
  if (params.temperature) formData.append('temperature', params.temperature);

  // 使用設定中的model優先，否則params.model
  if (config.model) {
    formData.append('model', config.model);
  } else if (params.model) {
    formData.append('model', params.model);
  }

  const headers = {};

  // 如果有API Key，加入header
  if (config.apiKey) {
    headers['Authorization'] = `Bearer ${config.apiKey}`;
  }

  try {
    const response = await fetch(config.apiUrl || 'https://api.whisper.mock/whisper', {
      method: 'POST',
      headers,
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${errorText}`);
    }

    const result = await response.json();

    if (result.segments && Array.isArray(result.segments)) {
      return {
        success: true,
        segments: result.segments.map(seg => ({
          text: seg.text,
          start: seg.start,
          end: seg.end
        }))
      };
    } else {
      throw new Error('Unexpected API response format');
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}