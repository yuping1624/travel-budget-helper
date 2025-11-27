# 本地測試指南

## 方法 1: 使用 Python HTTP 服務器（推薦）

這是最簡單的方法，適合測試 PWA 功能：

```bash
# 在專案目錄下執行
cd /Users/yuping/coding/travel-budget-helper
python3 -m http.server 8000
```

然後在瀏覽器打開：
- **http://localhost:8000**

要停止服務器，按 `Ctrl + C`

## 方法 2: 使用 VS Code Live Server

1. 在 VS Code 中安裝 "Live Server" 擴展
2. 右鍵點擊 `index.html`
3. 選擇 "Open with Live Server"

## 方法 3: 使用 Node.js http-server

如果你有 Node.js：

```bash
# 安裝 http-server（只需安裝一次）
npm install -g http-server

# 在專案目錄下執行
cd /Users/yuping/coding/travel-budget-helper
http-server -p 8000
```

## 方法 4: 直接打開 HTML 文件

⚠️ **注意**：直接雙擊打開 `index.html` 可能會遇到以下問題：
- PWA 功能可能無法正常工作
- Service Worker 可能無法註冊
- 某些 API（如匯率 API）可能因為 CORS 限制無法使用

**建議使用 HTTP 服務器方法（方法 1）**

## 測試要點

### 1. 基本功能測試
- ✅ 輸入旅行資訊（日期、預算、貨幣）
- ✅ 設定匯率（即時/手動）
- ✅ 添加購物車項目
- ✅ 直接記帳
- ✅ 查看統計資料

### 2. Modal 定位測試
- ✅ 點擊「更新匯率」按鈕，確認 modal 出現在按鈕附近
- ✅ 點擊「加入購物車」按鈕，確認 modal 出現在按鈕附近
- ✅ 確認不需要滾動就能看到確定按鈕

### 3. 響應式設計測試
- ✅ 在瀏覽器中調整視窗大小
- ✅ 使用開發者工具的設備模擬器（F12 → Toggle device toolbar）
- ✅ 測試手機、平板、桌面視圖

### 4. PWA 功能測試
- ✅ 打開 Chrome DevTools → Application → Service Workers
- ✅ 檢查 manifest.json 是否正確載入
- ✅ 測試「加入主畫面」功能

### 5. 數據持久化測試
- ✅ 添加一些數據
- ✅ 刷新頁面，確認數據還在
- ✅ 清除瀏覽器緩存，確認數據消失（這是預期行為）

## 開發者工具快捷鍵

- **Chrome/Edge**: `Cmd + Option + I` (Mac) 或 `F12` (Windows)
- **Safari**: `Cmd + Option + I`（需先啟用開發者選單）
- **Firefox**: `Cmd + Option + I` (Mac) 或 `F12` (Windows)

## 常見問題

### Q: 匯率 API 無法使用？
A: 檢查網路連線，或切換到手動輸入模式

### Q: 數據消失了？
A: 檢查瀏覽器是否清除了 LocalStorage，或使用了無痕模式

### Q: Modal 位置不對？
A: 清除瀏覽器緩存並重新載入頁面


