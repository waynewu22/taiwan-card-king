# Vercel 部署說明

## 重要設置

### 1. 項目根目錄設置
由於項目在 `cardking` 子目錄中，在 Vercel 部署時需要設置：

**在 Vercel 項目設置中：**
- 進入項目設置 (Settings)
- 找到 "Root Directory" 選項
- 設置為：`cardking`

或者，如果 Vercel 自動檢測失敗，可以手動指定：
- Framework Preset: `Next.js`
- Root Directory: `cardking`
- Build Command: `npm run build` (在 cardking 目錄中執行)
- Output Directory: `.next`

### 2. Node.js 版本
項目已配置為使用 Node.js >= 20.9.0
- `package.json` 中已添加 `engines` 字段
- `.nvmrc` 文件已創建，指定版本為 20.19.6

### 3. 環境變數設置
在 Vercel 項目設置中添加以下環境變數（如果需要）：

```
SMTP_HOST=msr.hinet.net
SMTP_PORT=587
SMTP_USER=yunseng.design@msa.hinet.net
SMTP_PASSWORD=您的郵件密碼
```

**設置位置：**
- Vercel Dashboard → 項目 → Settings → Environment Variables

### 4. 部署檢查清單
- [ ] 確認 Root Directory 設置為 `cardking`
- [ ] 確認 Node.js 版本 >= 20.9.0
- [ ] 確認環境變數已設置（如果需要郵件功能）
- [ ] 確認構建命令可以成功執行
- [ ] 檢查部署日誌中的錯誤訊息

### 5. 常見問題

**問題：構建失敗 - Node.js 版本不匹配**
- 解決：確保 Vercel 使用 Node.js 20.x 或更高版本
- 檢查：Vercel 設置 → General → Node.js Version

**問題：找不到模組或文件**
- 解決：確認 Root Directory 設置正確
- 檢查：構建日誌中的路徑是否正確

**問題：API 路由無法訪問**
- 解決：確認 API 路由在 `app/api` 目錄中
- 檢查：Vercel 函數日誌

**問題：靜態資源無法加載**
- 解決：確認 `public` 目錄在正確位置
- 檢查：資源路徑是否使用絕對路徑（以 `/` 開頭）

**問題：404 NOT_FOUND 錯誤**
- **這是因為 Vercel 沒有正確識別項目根目錄**
- **解決步驟（最重要）：**
  1. 進入 Vercel Dashboard → 您的項目
  2. 點擊 "Settings"（設置）
  3. 在左側選單中找到 "General"（一般設置）
  4. 找到 "Root Directory"（根目錄）選項
  5. 點擊 "Edit"（編輯）
  6. 輸入：`cardking`（不要包含斜線）
  7. 點擊 "Save"（保存）
  8. 重新部署項目（Redeploy）
- **如果沒有 "Root Directory" 選項：**
  - 在項目設置的 "Build & Development Settings" 中
  - 找到 "Override" 選項
  - 設置 "Root Directory" 為 `cardking`

## 部署步驟

1. 在 Vercel 中導入 GitHub 倉庫
2. 設置 Root Directory 為 `cardking`
3. 添加環境變數（如需要）
4. 點擊 Deploy
5. 檢查部署日誌
6. 訪問部署的網站進行測試
