# 台中日領現金工作站 — 部署指南

## 🚀 最快上線方式（免費，15分鐘）

### 方法一：Vercel 一鍵部署（推薦）

1. **建立 GitHub 帳號**
   - 前往 https://github.com 免費註冊

2. **建立新專案**
   - 點右上角「+」→「New repository」
   - 名稱：`taichung-jobs`
   - 選 Public → 點「Create repository」

3. **上傳所有檔案**
   - 把這個資料夾的所有檔案拖曳上傳到 GitHub

4. **連接 Vercel**
   - 前往 https://vercel.com 用 GitHub 帳號登入
   - 點「Add New Project」→ 選你的 `taichung-jobs`
   - Framework Preset 選「Vite」
   - 點「Deploy」→ 等待約 1 分鐘

5. **完成！**
   - 你的網站網址：`taichung-jobs.vercel.app`

---

### 方法二：Netlify 部署

1. 前往 https://netlify.com 免費註冊
2. 把這個資料夾直接拖曳到 Netlify 的部署區域
3. 等待部署完成
4. 免費網址：`random-name.netlify.app`

---

## 🔑 後台管理

- 進入網站後點底部「🗂️ 後台」
- 預設密碼：`admin888`
- **上線前請務必修改密碼！**
  - 在 `src/App.jsx` 搜尋 `admin888`，改成你自己的密碼

---

## 📱 自訂設定

在 `src/App.jsx` 中可以修改：

| 搜尋這個 | 改成 |
|---------|------|
| `04-2345-6789` | 你的真實電話 |
| `admin888` | 你的後台密碼 |
| `台中日領現金工作站` | 你的公司名稱 |

---

## 💰 升級到自訂域名（可選）

1. 在 GoDaddy / Namecheap 購買域名（約 $500-800/年）
   - 推薦：`tcjobs.tw` 或 `taichingjobs.com`
2. 在 Vercel 設定中新增自訂域名
3. 照指示修改 DNS 設定（約 24小時生效）

---

## 📞 需要協助？

如有任何部署問題，可以回到 Claude 繼續詢問！
