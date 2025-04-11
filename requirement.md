create a web application to process live recording transcription

# requirement
- [x] 即時錄音轉譯功能，當user按下錄音按鈕後，開始錄音。user可以從ui上看到錄音的進度條、duration
- [x] 在錄音時，可以隨時按下停止錄音按鈕來停止錄音。
- [x] user 可以在介面上指定要轉譯的語言。
- [x] 即時轉譯功能是透過whisper API來實現的，user 可以在介面上設定一組 openai 相容的 LLM API，包括API URL、Model、API Key、 prompt 等參數。存檔在local storage中，並在應用程式啟動時載入。
- [x] user按下開始錄音後，即時在背景執行轉譯：錄音收集適當的長度，至少5秒以上作為一個片段，將片段上傳到LLM API進行轉譯。
- [x] 轉譯api回應完成後，將轉譯結果顯示在畫面上，並附上時間戳記。
- [x] 當使用者按下停止錄音按鈕後，停止錄音並將最後一個片段上傳到LLM API進行轉譯。
- [x] 介面上有一個匯出.srt檔案的按鈕，將轉譯結果匯出成.srt檔案。當 user 按下匯出按鈕後，將轉譯結果轉換成.srt格式並下載到使用者的電腦上。

## dev stacks
- Node.js
- can build to run on both Mac
- Vue.js
- Webpack
- any other libraries or frameworks that you think are necessary for the project.

## ui

- [x] The application must have a modern and visually appealing UI.
- [x] The UI must be responsive and work on different screen sizes.
- [x] The page layout is separated into 4 sections:
    - header: the product brand, TranscribeLive
    - the transcription display section (currently placeholder)
    - the control section with record/stop button and config button opening a modal
    - the footer section: copyright

## the whisper api

- The API request must be formatted as multipart/form-data.
- The API request must include the audio file and any other required parameters.
- default value for parameters:
    - response_format: "verbose_json"
- the API response looks like:
```json
{
    "task": "transcribe",
    "language": "Chinese",
    "duration": 12.3,
    "text": "测试一下测试一下看看你会得到什么样的结果我们来测试看看这个debug的效果好不好",
    "segments": [
        {
            "id": 0,
            "seek": 0,
            "start": 0,
            "end": 2.4,
            "text": "测试一下测试一下",
            "tokens": [
                50365,
                11038,
                233,
                5233,
                243,
                8861,
                11038,
                233,
                5233,
                243,
                8861,
                50485
            ],
            "temperature": 0,
            "avg_logprob": -0.2367102,
            "compression_ratio": 1.0784314,
            "no_speech_prob": 7.181372e-12
        },
        {
            "id": 1,
            "seek": 0,
            "start": 2.4,
            "end": 5.8,
            "text": "看看你会得到什么样的结果",
            "tokens": [
                50485,
                22884,
                2166,
                12949,
                5916,
                4511,
                10440,
                14496,
                1546,
                45641,
                9319,
                50655
            ],
            "temperature": 0,
            "avg_logprob": -0.2367102,
            "compression_ratio": 1.0784314,
            "no_speech_prob": 7.181372e-12
        }],
    "x_groq": {
        "id": "req_01jrfa27s6ebpt919cmmak1sqa"
    }
}
```

## Error Handling:

The application must handle API errors and display user-friendly error messages.

# Agent's memories

## implementation report

- Initialized Vue 3 project scaffolded with Webpack and Babel.
- Implemented basic UI layout with Header, TranscriptionPanel, Controls, ConfigDialog, and Footer components.
- UI is modern, responsive, and visually appealing.
- No API integration or localStorage logic implemented yet.
- Implemented audio recording using MediaRecorder API.
- Recording supports start/stop, and automatically segments audio into 5-second blobs stored in memory.
- UI displays a recording progress bar and elapsed duration in hh:mm:ss format.
- Whisper API integration implemented:
  - Audio segments are uploaded every 5 seconds using multipart/form-data.
  - Default prompt and response_format applied.
  - API response parsed, segment text with timestamps displayed in real-time.
  - Last segment uploaded upon stop.
- Implemented API configuration persistence:
  - Users can input API URL, API Key, Model, and Prompt in the ConfigDialog.
  - Settings are saved to localStorage under key `whisper_api_config`.
  - On app startup, settings are loaded and applied globally.
  - Whisper API calls now dynamically use these saved settings.
  - API errors handled with user-friendly alerts.
- 2025-04-10 完成：
  - 錄音UI顯示整段錄音總時長
  - 逐字稿累積顯示所有片段
  - Whisper API 新增 language 參數
  - ConfigDialog 新增語言欄位，存入 localStorage，API呼叫帶入
- 2025-04-10 錄音分段問題修正：
  - 修復了僅第一段能成功轉譯的問題
  - 重構分段錄音機制，由自動 timeslice 改為手動停止/開始的方式
  - 每5秒停止當前錄音並立即創建新錄音，確保每段都是完整的 WebM 音訊
  - 增加詳細記錄，改進錯誤處理
  - 解決了 Whisper API "could not process file - is it a valid media file?" 的錯誤
- 2025-04-11 新增功能完成：
  - 修正時間戳顯示：調整每個片段的時間戳以反映在整體錄音中的位置，而非僅顯示相對於片段開始的時間
  - 實現音量檢測與靜音過濾：
    - 使用 Web Audio API 分析音量
    - 檢測並記錄低音量/靜音片段
    - 對持續超過2秒的靜音段標記並提供跳過選項
    - 減少無意義轉譯內容
  - 優化資源管理：確保所有音訊相關資源在停止錄音時正確釋放
- 2025-04-11 修正：
  - 新增匯出字幕功能，將所有逐字稿轉換成 SRT 格式並下載
  - 優化靜音片段跳過邏輯，偵測到靜音時自動跳過，不再彈出確認對話框
- 2025-04-11 最終整合：
  - 修復匯出字幕功能中的語法錯誤，確保按鈕點擊時能正確下載SRT文件
  - 重構錄音邏輯，從固定5秒間隔改為基於語音活動的智能分段：
    - 使用音量閾值和時長判斷檢測語音開始與結束
    - 在三種情境下提交音訊片段：語音結束、最大片段時長、靜音持續過長
    - 提高轉錄效率，避免多餘的API呼叫
    - 精確計算時間戳，確保轉錄結果正確
- 2025-04-11 功能優化與修正：
  - 完全重構智能分段錄音邏輯：
    - 採用音量歷史記錄進行穩定判斷，防止短暫波動
    - 優化FFT頻譜分析參數，更準確捕捉人聲頻率
    - 實現三層判斷：有語音結束後的短靜音、達到最大片段時長、靜音持續過長
    - 丟棄無意義的靜音片段，只轉譯有價值的內容
  - 完善匯出SRT功能：
    - 修復下載觸發問題與錯誤處理
    - 增強排序與文件命名
    - 提供成功匯出反饋
- 2025-04-11 最終調校：
  - 解決用戶實際測試中發現的連續語音問題：
    - 音量閾值從12降低到4，提高普通說話音量的語音活動檢測靈敏度
    - 採用加權平均計算音量，更重視最新樣本，迅速反應音量變化
    - 強化連續說話的強制分段機制，確保每3-6秒至少有一次轉譯更新
    - 實施更頻繁的檢查，即使連續講話也能保證適時分段
  - 改進轉譯判斷標準：
    - 採用更寬鬆的轉譯條件，確保有語音的片段都能被轉譯
    - 降低檔案大小閾值，避免有價值的短片段被誤判為靜音
    - 完整修復語法結構，確保代碼穩定運行
- 2025-04-11 嚴格靜音處理修正：
  - 徹底修復「無語音片段仍被轉譯」問題：
    - 更改轉譯條件判斷邏輯，嚴格要求只有檢測到語音的片段才進行轉譯
    - 完全移除之前「檔案大小超過閾值即轉譯」的寬鬆條件
    - 添加詳細的診斷日誌，清晰顯示轉譯決策依據
    - 確保系統能正確識別並丟棄完全靜音的片段，避免浪費API呼叫
- 2025-04-11 轉譯品質平衡優化：
  - 解決「句中切斷」問題：
    - 將強制分段時間從6秒延長至12秒，減少連續說話時被中斷的頻率
    - 保持「只有檢測到語音」的轉譯條件，繼續過濾靜音片段
    - 在長句子與即時更新之間取得平衡，避免過長等待轉譯結果
    - 保留語音結束後的自然分段機制，優先在自然停頓處切分
- 2025-04-11 專案完善：
  - 修正轉譯面板時間戳格式：
    - 將時間顯示從秒數格式（例如 "90.04s"）改為標準時間格式（"HH:mm:ss"）
    - 提高時間戳的可讀性和專業性
  - 建立完整的 .gitignore 檔案：
    - 包含 Node.js、Vue.js 和 Webpack 專案的標準忽略項
    - 排除 node_modules、構建產物、環境檔案和敏感資訊
    - 加入專案特定的配置檔案排除

## to be corrected

ui
- [x] for the recording ui, should display the whole duration of the recording, not just the last segment
- [x] for the transcription display, should display the whole transcription, not just the last segment
- [x] display panel上顯示的timestamp 格式應為 `HH:mm:ss`，而不是 `90.04s`

the whisper api
- [x] add `language` parameter to the API request

the live transcription
- [x] only the first segment transcription is successful, the rest are not and got error message by the whisper api `could not process file - is it a valid media file?`
- [x] the display timestamp of the transcription is not correct, it should be the time of the segment, not the time of the recording

audio input fine tuning
- [x] during the recording, even I don't speak, the audio input is still recording, and the whisper api still returns the transcription, which resulting in absolutely misleading transcription content. Need to find a way to filter out the silence or noise.
- [x] the confirm dialog for canceling transcription is too annoying, should skip the confirmation dialog and just cancel the transcription directly when it detected silence or noise.
- [x] 重新檢視音量檢測與靜音過濾的邏輯，確保在錄音過程中能夠準確識別靜音片段並自動跳過，避免不必要的轉譯請求。但在累積要submit的片段時，仍然需要確保每個片段都是完整的WebM音訊，並且避免太頻繁的API請求。
- [x] 即使在完全靜音的情況下錄音，應用程式仍然錯誤地將音訊片段發送到轉譯 API
- [x] 在連續說話時，系統有時會在句子中間切斷並提交片段，影響轉譯品質

project management
- [x] 建立適合此專案的 .gitignore 檔案

## 即時轉譯的理想效果
1. 系統應按照停頓來切割segment，一旦得到一個segment，便即可進行轉譯
2. 承1，停頓的偵測不能太靈敏，代表著要有一定程度的tolerance，避免只是因為speaker的語速不夠快而造成過早的斷句，但其實speaker還沒講完
3. 承2，停頓也有可能因為非語音的干擾而被判斷為偽陰性，例如speaker明明已經停頓了，但因為周遭有雜音而被判斷為有聲音，這樣的情況下，系統應要filter掉這些雜音，知道speaker已經停頓了，可以進行轉譯
4. 一個segment的長度不應過短，否則會造成過多的API請求，增加系統負擔，至少要有2秒以上的長度
5. 一個segment的長度不應過長，否則會造成轉譯的延遲，影響使用者體驗，最多不應超過10秒

## enhancement and future development

- 可考慮加入音訊處理前的降噪功能，進一步提高語音識別準確率
- 可針對不同語言優化音量閾值和分段參數，例如英文和中文的語音特性不同
- 增加批量轉譯功能，允許用戶上傳音訊檔案進行離線轉譯
- 加入自動翻譯功能，支援多語言轉換
- 提供更豐富的轉譯結果格式，如 txt, docx 等
- 開發自動識別講者功能，區分不同說話者的轉譯內容
- 增加訂閱服務，集成更多高級功能例如摘要生成、整理重點等
- 考慮應用機器學習來學習用戶說話模式，進一步優化分段策略
- 提供更多影片/音訊剪輯相關功能，例如基於轉譯結果的自動剪輯、生成關鍵詞摘要等