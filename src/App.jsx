import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════
   DESIGN SYSTEM
═══════════════════════════════════════════ */
const DS = {
  green: "#06C755",
  greenDark: "#04A344",
  greenLight: "#E8FBF0",
  navy: "#0D1B3E",
  navyMid: "#162444",
  gold: "#F5A623",
  goldLight: "#FFF8E7",
  white: "#FFFFFF",
  gray50: "#F7F9FC",
  gray100: "#EEF2F7",
  gray300: "#C8D4E8",
  gray500: "#7A8BAA",
  gray700: "#3D4F6B",
  red: "#E84545",
  shadow: "0 4px 24px rgba(13,27,62,0.10)",
  shadowLg: "0 12px 48px rgba(13,27,62,0.18)",
};

/* ═══════════════════════════════════════════
   CHAT FLOW ENGINE
═══════════════════════════════════════════ */
const FLOWS = {
  start: {
    msg: "👋 您好！歡迎來到【台中日領現金工作站】\n\n我是 AI 客服助理，請問您今天需要什麼協助？",
    opts: [
      { label: "🔍 我要找日領工作", next: "js_start" },
      { label: "🏢 企業刊登職缺", next: "emp_start" },
      { label: "💰 查詢薪資行情", next: "salary" },
      { label: "❓ 常見問題", next: "faq_menu" },
      { label: "🙋 轉接真人客服", next: "human" },
    ],
  },
  js_start: {
    msg: "好的！我們每天在台中各區都有大量日領工作 💪\n\n請告訴我您的需求：",
    opts: [
      { label: "📋 直接登記資料，等顧問聯繫", next: "js_name" },
      { label: "🗺️ 先查詢各區職缺", next: "js_area_browse" },
      { label: "⏰ 了解工作流程", next: "js_process" },
      { label: "🆕 我是新手，想多了解", next: "js_intro" },
    ],
  },
  js_intro: {
    msg: "歡迎新朋友！日領現金工作的 5 大優點：\n\n✅ 當天工作，當天領現金\n✅ 彈性選擇工作日，不強迫排班\n✅ 新手友善，多數職缺免經驗\n✅ 顧問全程媒合，完全免費\n✅ 台中各區皆有職缺",
    opts: [
      { label: "📋 我要登記資料", next: "js_name" },
      { label: "💰 查詢薪資行情", next: "salary" },
    ],
  },
  js_process: {
    msg: "📌 工作流程（超簡單）：\n\n① 填寫基本資料（3分鐘）\n② 顧問在 2 小時內聯繫您\n③ 推薦符合條件的職缺\n④ 確認出勤時間地點\n⑤ 工作完成，當場領現金 💵\n\n全程 0 費用，顧問免費服務！",
    opts: [
      { label: "📋 開始登記資料", next: "js_name" },
      { label: "🗺️ 查看各區職缺", next: "js_area_browse" },
    ],
  },
  js_area_browse: {
    msg: "📍 台中各區熱門職缺（即時更新）：\n\n🔥 北屯區 · 倉儲搬運 ── $1,500/天\n🔥 西屯區 · 活動人員 ── $1,800/天\n🔥 南屯區 · 餐飲助手 ── $1,400/天\n🔥 太平區 · 工廠作業 ── $1,600/天\n🔥 大里區 · 清潔整理 ── $1,300/天\n🔥 豐原區 · 物流配送 ── $1,700/天\n\n👆 以上為今日開放職缺，名額有限！",
    opts: [
      { label: "📋 立刻登記，搶先媒合", next: "js_name" },
      { label: "💰 更多薪資資訊", next: "salary" },
    ],
  },
  js_name: {
    msg: "請輸入您的姓名（真實姓名，方便顧問聯繫）",
    input: { placeholder: "例：王小明", save: "name", next: "js_phone" },
  },
  js_phone: {
    msg: "謝謝！請輸入您的手機號碼",
    input: { placeholder: "例：0912-345-678", save: "phone", next: "js_area" },
  },
  js_area: {
    msg: "請選擇您方便的工作地區：",
    opts: [
      { label: "北屯區 / 北區", next: "js_type", save: { area: "北屯/北區" } },
      { label: "西屯區 / 南屯區", next: "js_type", save: { area: "西屯/南屯" } },
      { label: "太平區 / 大里區", next: "js_type", save: { area: "太平/大里" } },
      { label: "豐原區 / 潭子區", next: "js_type", save: { area: "豐原/潭子" } },
      { label: "台中市全區都可以 ✅", next: "js_type", save: { area: "全區" } },
    ],
  },
  js_type: {
    msg: "您偏好哪種工作類型？",
    opts: [
      { label: "🏋️ 體力活（搬運 / 倉儲）", next: "js_exp", save: { type: "搬運/倉儲" } },
      { label: "🎪 活動 / 展場人員", next: "js_exp", save: { type: "活動人員" } },
      { label: "🍽️ 餐飲 / 廚房助手", next: "js_exp", save: { type: "餐飲" } },
      { label: "🏭 工廠 / 作業員", next: "js_exp", save: { type: "工廠作業" } },
      { label: "🚚 物流 / 配送", next: "js_exp", save: { type: "物流配送" } },
      { label: "💼 什麼都願意做", next: "js_exp", save: { type: "不限" } },
    ],
  },
  js_exp: {
    msg: "您有相關工作經驗嗎？",
    opts: [
      { label: "✅ 有，1年以上", next: "js_done", save: { exp: "有（1年以上）" } },
      { label: "📗 有，不到1年", next: "js_done", save: { exp: "有（未滿1年）" } },
      { label: "🆕 完全沒有（新手也歡迎！）", next: "js_done", save: { exp: "無" } },
    ],
  },
  js_done: {
    msg: "🎉 登記完成！\n\n我們的顧問將在 **2小時內** 主動聯繫您，為您推薦最適合的日領職缺！\n\n📞 有急事請撥：0934011029\n⏰ 服務時間：週一至週六 09:00-18:00\n\n祝您找到心目中的好工作！💪",
    opts: [
      { label: "🏠 回主選單", next: "start" },
      { label: "🗺️ 繼續查看職缺", next: "js_area_browse" },
    ],
    terminal: "jobseeker",
  },

  // ─── Employer ───
  emp_start: {
    msg: "歡迎企業主！我們擁有大量已審核的優質求職者 🏢\n\n請問您的需求？",
    opts: [
      { label: "📝 刊登新職缺", next: "emp_company" },
      { label: "💼 了解收費方式", next: "emp_pricing" },
      { label: "🤝 長期合作方案", next: "emp_partner" },
      { label: "🚨 緊急補班需求", next: "emp_urgent" },
    ],
  },
  emp_pricing: {
    msg: "💼 收費說明（透明、無隱藏費用）：\n\n🆓 刊登職缺 ── 完全免費\n💰 成功媒合費 ── 日薪的 15%（雇主付）\n📦 10人以上批量 ── 8折優惠\n🚨 緊急補班 ── 加收 20%（4hr內到位）\n\n✅ 只有成功媒合才收費，零風險！",
    opts: [
      { label: "📝 開始刊登職缺", next: "emp_company" },
      { label: "🤝 長期合作方案", next: "emp_partner" },
    ],
  },
  emp_partner: {
    msg: "🤝 長期合作方案優勢：\n\n⭐ 專屬顧問一對一服務\n⭐ 優先推薦頂尖求職者\n⭐ 批量用人享折扣優惠\n⭐ 緊急缺工 4hr 到位\n⭐ 免費人資諮詢服務\n\n目前已有 50+ 家台中企業長期合作！\n聯繫我們取得專屬報價 👇",
    opts: [
      { label: "📝 刊登職缺試試看", next: "emp_company" },
      { label: "📞 聯繫業務洽談", next: "human" },
    ],
  },
  emp_urgent: {
    msg: "🚨 緊急補班服務：\n\n我們提供 4小時內 快速到位服務！\n\n📞 緊急專線：0934011029\n⏰ 緊急服務：07:00-22:00（含假日）\n\n請留下需求，顧問立即處理 👇",
    opts: [
      { label: "📝 填寫緊急需求", next: "emp_company" },
      { label: "📞 直接電話聯繫", next: "human" },
    ],
  },
  emp_company: {
    msg: "請輸入您的公司名稱",
    input: { placeholder: "例：台中XX科技有限公司", save: "company", next: "emp_position" },
  },
  emp_position: {
    msg: "請輸入職缺名稱",
    input: { placeholder: "例：倉儲搬運人員", save: "position", next: "emp_count" },
  },
  emp_count: {
    msg: "這次需要幾位人員？",
    opts: [
      { label: "1 – 3 人", next: "emp_wage", save: { count: "1-3人" } },
      { label: "4 – 10 人", next: "emp_wage", save: { count: "4-10人" } },
      { label: "10 人以上（享優惠）", next: "emp_wage", save: { count: "10人以上" } },
      { label: "不確定，先詢問", next: "emp_wage", save: { count: "待確認" } },
    ],
  },
  emp_wage: {
    msg: "提供的日薪是多少？（元 / 天）",
    input: { placeholder: "例：1500", save: "wage", next: "emp_location" },
  },
  emp_location: {
    msg: "工作地點在台中哪個區？",
    input: { placeholder: "例：北屯區旱溪路", save: "location", next: "emp_contact" },
  },
  emp_contact: {
    msg: "請輸入聯絡人姓名與電話\n格式：姓名 電話",
    input: { placeholder: "例：陳經理 0912345678", save: "contact", next: "emp_done" },
  },
  emp_done: {
    msg: "✅ 職缺資料收到！\n\n系統已進入審核流程，通常在 **1個工作天內** 完成審核並為您推薦求職者。\n\n📋 顧問將主動聯繫您確認細節\n📞 有急事請撥：0934011029\n\n感謝您選擇台中日領現金工作站！🙏",
    opts: [
      { label: "🏠 回主選單", next: "start" },
      { label: "🚨 我有緊急需求", next: "emp_urgent" },
    ],
    terminal: "employer",
  },

  // ─── FAQ ───
  faq_menu: {
    msg: "請選擇您的問題類型：",
    opts: [
      { label: "💸 薪資如何發放？", next: "faq_pay" },
      { label: "📄 需要準備什麼？", next: "faq_docs" },
      { label: "🔒 個資安全問題", next: "faq_privacy" },
      { label: "🏢 企業收費說明", next: "emp_pricing" },
      { label: "🏠 回主選單", next: "start" },
    ],
  },
  faq_pay: {
    msg: "💸 薪資發放說明：\n\n✅ 大多數職缺：當日工作完成即領現金\n✅ 部分職缺：隔日 12:00 前匯款\n✅ 薪資如有問題：顧問全程協助追討\n\n⚠️ 重要：我們不向求職者收取任何費用！",
    opts: [{ label: "🏠 回主選單", next: "start" }, { label: "📋 登記找工作", next: "js_name" }],
  },
  faq_docs: {
    msg: "📋 需要準備的文件：\n\n✅ 身分證（核對身份用）\n✅ 健保卡（部分職缺需要）\n✅ 銀行帳號（匯款用，非必要）\n\n❌ 不需要履歷、學歷證明\n❌ 不需要照片\n❌ 新手直接來！",
    opts: [{ label: "📋 登記找工作", next: "js_name" }, { label: "🏠 回主選單", next: "start" }],
  },
  faq_privacy: {
    msg: "🔒 個資安全保證：\n\n✅ 您的資料僅用於職缺媒合\n✅ 不會販售或外洩給第三方\n✅ 您可隨時要求刪除資料\n✅ 符合個人資料保護法規定\n\n有任何疑慮歡迎直接聯繫我們！",
    opts: [{ label: "📋 放心登記", next: "js_name" }, { label: "🏠 回主選單", next: "start" }],
  },
  salary: {
    msg: "💰 台中日領薪資行情（2026年）：\n\n🥉 基本類 $1,200–1,500/天\n   清潔、資料整理、場地佈置\n\n🥈 一般類 $1,500–2,000/天\n   搬運倉儲、活動人員、餐飲\n\n🥇 技術類 $2,000–3,000/天\n   電工、水電、技術師傅\n\n💵 所有職缺均當日或隔日現金結算！",
    opts: [
      { label: "📋 登記找工作", next: "js_name" },
      { label: "🗺️ 查看各區職缺", next: "js_area_browse" },
      { label: "🏠 回主選單", next: "start" },
    ],
  },
  human: {
    msg: "🙋 正在為您轉接真人客服...\n\n⏳ 預計等待：3–5 分鐘\n📞 或直接撥打：0934011029\n⏰ 服務時間：週一至週六 09:00-18:00\n\n感謝您的耐心，我們馬上為您服務！",
    opts: [{ label: "🏠 繼續自助服務", next: "start" }],
  },
};

/* ═══════════════════════════════════════════
   STORAGE HELPERS
═══════════════════════════════════════════ */
async function saveRecord(record) {
  try {
    const existing = await window.storage.get("records").catch(() => null);
    const list = existing ? JSON.parse(existing.value) : [];
    list.unshift(record);
    await window.storage.set("records", JSON.stringify(list.slice(0, 500)));
  } catch (e) { console.error(e); }
}
async function loadRecords() {
  try {
    const r = await window.storage.get("records");
    return r ? JSON.parse(r.value) : [];
  } catch { return []; }
}
function genId() { return "TC" + Date.now().toString(36).toUpperCase(); }

/* ═══════════════════════════════════════════
   COMPONENTS
═══════════════════════════════════════════ */
function Badge({ children, color = DS.green, bg }) {
  return (
    <span style={{ background: bg || color + "18", color, borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
      {children}
    </span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: DS.white, borderRadius: 16, boxShadow: DS.shadow, overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

function StatBox({ icon, value, label, color }) {
  return (
    <div style={{ background: DS.white, borderRadius: 14, padding: "16px 18px", boxShadow: DS.shadow, borderLeft: `4px solid ${color}`, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: DS.gray500, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "12px 16px", background: DS.white, borderRadius: "4px 18px 18px 18px", width: "fit-content", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: DS.gray300, animation: `bounce 1.1s ${i * 0.2}s infinite` }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════ */
function LandingPage({ onNavigate }) {
  const jobs = [
    { area: "北屯區", title: "倉儲搬運人員", wage: 1500, tags: ["男女皆可", "新手OK"], hot: true },
    { area: "西屯區", title: "活動工作人員", wage: 1800, tags: ["站立工作", "假日加班"], hot: true },
    { area: "南屯區", title: "餐飲助手", wage: 1400, tags: ["包膳食", "輕鬆"], hot: false },
    { area: "太平區", title: "工廠作業員", wage: 1600, tags: ["長期優先", "環境佳"], hot: true },
    { area: "大里區", title: "清潔人員", wage: 1300, tags: ["短工ok", "4hr起"], hot: false },
    { area: "豐原區", title: "物流配送員", wage: 1700, tags: ["需機車", "趕快來"], hot: true },
  ];

  const stats = [
    { icon: "👥", num: "3,200+", label: "成功媒合人次" },
    { icon: "🏢", num: "150+", label: "合作企業" },
    { icon: "💰", num: "當日", label: "現金結算" },
    { icon: "⭐", num: "4.9", label: "滿意評分" },
  ];

  return (
    <div style={{ overflowY: "auto", height: "100%" }}>

      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${DS.navy} 0%, #1a3060 60%, #0d2850 100%)`, padding: "48px 20px 56px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(6,199,85,0.08)" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(245,166,35,0.06)" }} />
        <div style={{ position: "relative", maxWidth: 440, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: DS.green, animation: "pulse 2s infinite" }} />
            <span style={{ color: DS.green, fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>即時職缺更新中</span>
          </div>
          <h1 style={{ color: DS.white, fontSize: 30, fontWeight: 800, lineHeight: 1.3, margin: "0 0 8px" }}>
            台中日領<br />
            <span style={{ color: DS.green }}>現金工作站</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, margin: "0 0 28px", lineHeight: 1.7 }}>
            當天工作、當天領現金<br />台中各區職缺，顧問免費媒合
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => onNavigate("chat")} style={{ flex: 1, background: DS.green, color: DS.white, border: "none", borderRadius: 28, padding: "14px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 24px rgba(6,199,85,0.45)" }}>
              立刻找工作 →
            </button>
            <button onClick={() => onNavigate("post")} style={{ flex: 1, background: "rgba(255,255,255,0.1)", color: DS.white, border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 28, padding: "14px 0", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              企業刊登
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: DS.gold, padding: "14px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", maxWidth: 440, margin: "0 auto" }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16 }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: DS.navy }}>{s.num}</div>
              <div style={{ fontSize: 10, color: DS.navy, opacity: 0.7 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs list */}
      <div style={{ padding: "24px 16px", maxWidth: 440, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: DS.navy, margin: 0 }}>今日熱門職缺</h2>
          <button onClick={() => onNavigate("jobs")} style={{ background: "none", border: "none", color: DS.green, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>全部職缺 →</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {jobs.map((j, i) => (
            <div key={i} onClick={() => onNavigate("chat")} style={{ background: DS.white, borderRadius: 14, padding: "14px 16px", boxShadow: DS.shadow, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1.5px solid transparent", transition: "border 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.border = `1.5px solid ${DS.green}`}
              onMouseLeave={e => e.currentTarget.style.border = "1.5px solid transparent"}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: DS.gray500 }}>📍 {j.area}</span>
                  {j.hot && <Badge color={DS.red}>🔥 搶手</Badge>}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: DS.navy, marginBottom: 6 }}>{j.title}</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {j.tags.map(t => <Badge key={t} color={DS.gray500}>{t}</Badge>)}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: DS.green }}>${j.wage.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: DS.gray500 }}>元/天</div>
                <div style={{ fontSize: 11, color: DS.green, marginTop: 4 }}>現金 💵</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div style={{ background: `linear-gradient(135deg, ${DS.navy}, #1a3060)`, borderRadius: 16, padding: "20px", marginTop: 20, textAlign: "center" }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: DS.white, marginBottom: 6 }}>找不到喜歡的職缺？</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 14 }}>告訴我們你的條件，顧問幫你找！</div>
          <button onClick={() => onNavigate("chat")} style={{ background: DS.green, color: DS.white, border: "none", borderRadius: 24, padding: "12px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            免費諮詢顧問 →
          </button>
        </div>

        {/* Trust signals */}
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: "🆓", title: "完全免費", desc: "求職者 0 費用" },
            { icon: "⚡", title: "快速媒合", desc: "2小時內聯繫" },
            { icon: "💵", title: "當日領現", desc: "不用等薪水日" },
            { icon: "🔒", title: "安全保障", desc: "資料加密保護" },
          ].map(t => (
            <div key={t.title} style={{ background: DS.gray50, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{t.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: DS.navy }}>{t.title}</div>
              <div style={{ fontSize: 11, color: DS.gray500 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CHAT PAGE
═══════════════════════════════════════════ */
function ChatPage({ onSaveRecord }) {
  const [msgs, setMsgs] = useState([]);
  const [flow, setFlow] = useState("start");
  const [ud, setUd] = useState({});
  const [inputVal, setInputVal] = useState("");
  const [typing, setTyping] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const botSay = (text, opts, inputDef) => {
    setMsgs(p => [...p, { id: Date.now() + Math.random(), role: "bot", text, opts, inputDef }]);
  };

  const go = useCallback((key, data) => {
    const f = FLOWS[key];
    if (!f) return;
    setFlow(key);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      botSay(f.msg.replace("{name}", (data || {}).name || "您"), f.opts, f.input);
      if (f.terminal) {
        const rec = { id: genId(), type: f.terminal, time: new Date().toLocaleString("zh-TW"), data: { ...(data || {}) }, status: "待處理" };
        onSaveRecord(rec);
        saveRecord(rec);
      }
    }, 700 + Math.random() * 400);
  }, [onSaveRecord]);

  const start = () => { setStarted(true); go("start", {}); };
  const reset = () => { setMsgs([]); setFlow("start"); setUd({}); setInputVal(""); setStarted(false); setTyping(false); };

  const handleOpt = (opt) => {
    setMsgs(p => [...p, { id: Date.now(), role: "user", text: opt.label }]);
    const newUd = { ...ud, ...(opt.save || {}) };
    setUd(newUd);
    go(opt.next, newUd);
  };

  const handleInput = () => {
    const f = FLOWS[flow];
    if (!inputVal.trim() || !f?.input) return;
    setMsgs(p => [...p, { id: Date.now(), role: "user", text: inputVal }]);
    const newUd = { ...ud, [f.input.save]: inputVal };
    setUd(newUd);
    setInputVal("");
    go(f.input.next, newUd);
  };

  const last = msgs[msgs.length - 1];
  const showOpts = last?.role === "bot" && last?.opts && !typing;
  const showInput = last?.role === "bot" && last?.inputDef && !typing;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Sub-header */}
      <div style={{ background: DS.white, borderBottom: `1px solid ${DS.gray100}`, padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: DS.green, animation: "pulse 2s infinite" }} />
          <span style={{ fontSize: 12, color: DS.gray700 }}>AI 客服線上中</span>
        </div>
        {started && <button onClick={reset} style={{ background: "none", border: "none", color: DS.gray500, fontSize: 12, cursor: "pointer" }}>重新開始</button>}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px", background: "#dce8de" }}>
        {!started ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 18, padding: 20 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: DS.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, boxShadow: "0 8px 32px rgba(6,199,85,0.4)", animation: "pulse 3s infinite" }}>💼</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: DS.navy }}>AI 智能客服</div>
              <div style={{ fontSize: 13, color: DS.gray500, marginTop: 4, lineHeight: 1.7 }}>24小時為您服務<br />求職、刊登、薪資查詢通通搞定</div>
            </div>
            <button onClick={start} style={{ background: DS.green, color: DS.white, border: "none", borderRadius: 28, padding: "13px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 24px rgba(6,199,85,0.4)" }}>
              開始諮詢 →
            </button>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <span style={{ background: "rgba(0,0,0,0.07)", borderRadius: 10, padding: "2px 12px", fontSize: 11, color: DS.gray700 }}>今天</span>
            </div>
            {msgs.map(m => (
              <div key={m.id} style={{ display: "flex", flexDirection: m.role === "bot" ? "row" : "row-reverse", alignItems: "flex-end", gap: 8, marginBottom: 8, animation: "fadeUp 0.22s ease" }}>
                {m.role === "bot" && (
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: DS.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>🤖</div>
                )}
                <div style={{ maxWidth: "76%", background: m.role === "bot" ? DS.white : DS.green, color: m.role === "bot" ? DS.navy : DS.white, borderRadius: m.role === "bot" ? "4px 18px 18px 18px" : "18px 4px 18px 18px", padding: "10px 14px", fontSize: 13.5, lineHeight: 1.7, whiteSpace: "pre-wrap", boxShadow: "0 1px 6px rgba(0,0,0,0.08)" }}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: DS.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>🤖</div>
                <TypingDots />
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input area */}
      {started && (
        <div style={{ background: DS.white, borderTop: `1px solid ${DS.gray100}`, padding: "10px 12px 16px", flexShrink: 0 }}>
          {showOpts && (
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {last.opts.map((o, i) => (
                <button key={i} onClick={() => handleOpt(o)} style={{ background: DS.greenLight, border: `1.5px solid ${DS.green}`, borderRadius: 12, padding: "11px 14px", textAlign: "left", cursor: "pointer", fontSize: 13, color: DS.navy, fontFamily: "inherit", fontWeight: 500, transition: "all 0.15s" }}
                  onMouseEnter={e => { e.target.style.background = DS.green; e.target.style.color = DS.white; }}
                  onMouseLeave={e => { e.target.style.background = DS.greenLight; e.target.style.color = DS.navy; }}>
                  {o.label}
                </button>
              ))}
            </div>
          )}
          {showInput && (
            <div style={{ display: "flex", gap: 8 }}>
              <input
                autoFocus
                type={last.inputDef.type === "number" ? "number" : "text"}
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleInput()}
                placeholder={last.inputDef.placeholder}
                style={{ flex: 1, border: `1.5px solid ${DS.green}`, borderRadius: 24, padding: "10px 16px", fontSize: 14, outline: "none", fontFamily: "inherit" }}
              />
              <button onClick={handleInput} style={{ background: DS.green, border: "none", borderRadius: "50%", width: 44, height: 44, color: DS.white, fontSize: 18, cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
            </div>
          )}
          {!showOpts && !showInput && !typing && started && (
            <button onClick={reset} style={{ width: "100%", background: DS.green, color: DS.white, border: "none", borderRadius: 24, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>重新開始諮詢</button>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   JOBS PAGE
═══════════════════════════════════════════ */
function JobsPage({ onNavigate }) {
  const [filter, setFilter] = useState("全部");
  const areas = ["全部", "北屯", "西屯", "南屯", "太平", "大里", "豐原"];
  const allJobs = [
    { area: "北屯", title: "倉儲搬運人員", wage: 1500, hours: "08:00-17:00", tags: ["男女皆可", "新手OK"], urgent: true },
    { area: "西屯", title: "活動工作人員", wage: 1800, hours: "10:00-22:00", tags: ["站立工作", "含餐"], urgent: true },
    { area: "南屯", title: "餐飲助手", wage: 1400, hours: "09:00-18:00", tags: ["包膳食", "輕鬆"], urgent: false },
    { area: "太平", title: "工廠作業員", wage: 1600, hours: "08:00-17:00", tags: ["長期優先", "環境佳"], urgent: true },
    { area: "大里", title: "清潔人員", wage: 1300, hours: "07:00-14:00", tags: ["4hr起", "半天"], urgent: false },
    { area: "豐原", title: "物流配送員", wage: 1700, hours: "08:00-17:00", tags: ["需機車", "油資補貼"], urgent: true },
    { area: "北屯", title: "展場佈置人員", wage: 1900, hours: "07:00-19:00", tags: ["體力活", "加班費"], urgent: false },
    { area: "西屯", title: "超市理貨員", wage: 1350, hours: "22:00-06:00", tags: ["夜班", "宵夜費"], urgent: false },
    { area: "南屯", title: "電商包裝員", wage: 1500, hours: "09:00-18:00", tags: ["室內", "冷氣"], urgent: true },
    { area: "豐原", title: "搬家作業員", wage: 2000, hours: "依案件", tags: ["體力活", "高薪"], urgent: false },
  ];
  const filtered = filter === "全部" ? allJobs : allJobs.filter(j => j.area === filter);

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ background: DS.navy, padding: "16px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ color: DS.white, fontWeight: 700, fontSize: 15, marginBottom: 10 }}>所有職缺 ({filtered.length})</div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
          {areas.map(a => (
            <button key={a} onClick={() => setFilter(a)} style={{ background: filter === a ? DS.green : "rgba(255,255,255,0.12)", color: DS.white, border: "none", borderRadius: 20, padding: "6px 14px", fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", fontWeight: filter === a ? 700 : 400 }}>{a}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.map((j, i) => (
          <div key={i} onClick={() => onNavigate("chat")} style={{ background: DS.white, borderRadius: 14, padding: "14px 16px", boxShadow: DS.shadow, cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: DS.gray500 }}>📍 {j.area}區</span>
                  <span style={{ fontSize: 11, color: DS.gray500 }}>⏰ {j.hours}</span>
                  {j.urgent && <Badge color={DS.red}>急徵</Badge>}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: DS.navy, marginBottom: 6 }}>{j.title}</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {j.tags.map(t => <Badge key={t} color={DS.gray500}>{t}</Badge>)}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: DS.green }}>${j.wage.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: DS.gray500 }}>元/天</div>
                <button style={{ background: DS.green, color: DS.white, border: "none", borderRadius: 12, padding: "5px 12px", fontSize: 11, cursor: "pointer", marginTop: 6, fontFamily: "inherit", fontWeight: 700 }}>立刻應徵</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   POST JOB PAGE
═══════════════════════════════════════════ */
function PostField({ label, field, placeholder, type = "text", form, update }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: DS.navy, marginBottom: 5 }}>{label}</label>
      <input
        type={type}
        value={form[field]}
        onChange={e => update(field, e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", border: `1.5px solid ${DS.gray300}`, borderRadius: 10, padding: "11px 14px", fontSize: 14, outline: "none", fontFamily: "inherit", transition: "border 0.2s" }}
        onFocus={e => e.target.style.borderColor = DS.green}
        onBlur={e => e.target.style.borderColor = DS.gray300}
      />
    </div>
  );
}

function PostPage({ onSaveRecord, onNavigate }) {
  const [form, setForm] = useState({ company: "", position: "", count: "", wage: "", location: "", date: "", contact: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const update = useCallback((k, v) => setForm(p => ({ ...p, [k]: v })), []);

  const submit = () => {
    const rec = { id: genId(), type: "employer", time: new Date().toLocaleString("zh-TW"), data: form, status: "審核中" };
    onSaveRecord(rec);
    saveRecord(rec);
    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, gap: 16 }}>
      <div style={{ fontSize: 56 }}>✅</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: DS.navy, textAlign: "center" }}>職缺刊登成功！</div>
      <div style={{ fontSize: 14, color: DS.gray500, textAlign: "center", lineHeight: 1.7 }}>我們將在 1 個工作天內審核並上架<br />顧問會主動聯繫您確認細節</div>
      <div style={{ background: DS.greenLight, borderRadius: 14, padding: "14px 18px", width: "100%", maxWidth: 320 }}>
        <div style={{ fontSize: 13, color: DS.navy }}>📞 緊急聯繫：0934011029</div>
        <div style={{ fontSize: 13, color: DS.navy, marginTop: 4 }}>⏰ 服務：週一至週六 09-18 時</div>
      </div>
      <button onClick={() => { setSubmitted(false); setForm({ company: "", position: "", count: "", wage: "", location: "", date: "", contact: "", notes: "" }); onNavigate("home"); }} style={{ background: DS.green, color: DS.white, border: "none", borderRadius: 24, padding: "12px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>回首頁</button>
    </div>
  );

  return (
    <div style={{ height: "100%", overflowY: "auto" }}>
      <div style={{ background: DS.navy, padding: "16px 20px" }}>
        <div style={{ color: DS.white, fontWeight: 800, fontSize: 16 }}>🏢 企業刊登職缺</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 3 }}>刊登完全免費 · 1個工作天審核上架</div>
      </div>

      {/* Pricing info */}
      <div style={{ background: DS.goldLight, padding: "12px 16px", borderBottom: "1px solid #fde8a0" }}>
        <div style={{ fontSize: 12, color: DS.navy, lineHeight: 1.7 }}>
          💼 <strong>收費說明</strong>：刊登免費，成功媒合後收日薪15%服務費（雇主付）
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        <PostField label="公司名稱 *" field="company" placeholder="例：台中XX有限公司" form={form} update={update} />
        <PostField label="職缺名稱 *" field="position" placeholder="例：倉儲搬運人員" form={form} update={update} />
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: DS.navy, marginBottom: 5 }}>需要人數 *</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["1人", "2-3人", "4-10人", "10人以上"].map(c => (
              <button key={c} onClick={() => update("count", c)} style={{ background: form.count === c ? DS.green : DS.gray100, color: form.count === c ? DS.white : DS.navy, border: "none", borderRadius: 10, padding: "9px 16px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: form.count === c ? 700 : 400 }}>{c}</button>
            ))}
          </div>
        </div>
        <PostField label="日薪（元/天）*" field="wage" placeholder="例：1500" type="number" form={form} update={update} />
        <PostField label="工作地點 *" field="location" placeholder="例：北屯區旱溪東路" form={form} update={update} />
        <PostField label="出勤日期" field="date" placeholder="例：2026/04/10 或 長期" form={form} update={update} />
        <PostField label="聯絡人 & 電話 *" field="contact" placeholder="例：陳經理 0912345678" form={form} update={update} />
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: DS.navy, marginBottom: 5 }}>備註（選填）</label>
          <textarea value={form.notes} onChange={e => update("notes", e.target.value)} placeholder="工作內容說明、特殊需求等"
            style={{ width: "100%", border: `1.5px solid ${DS.gray300}`, borderRadius: 10, padding: "11px 14px", fontSize: 14, outline: "none", fontFamily: "inherit", minHeight: 80, resize: "vertical" }} />
        </div>

        <button onClick={submit} disabled={!form.company || !form.position || !form.count || !form.wage || !form.location || !form.contact}
          style={{ width: "100%", background: (form.company && form.position && form.count && form.wage && form.location && form.contact) ? DS.green : DS.gray300, color: DS.white, border: "none", borderRadius: 28, padding: "15px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          提交職缺申請 →
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ADMIN PAGE
═══════════════════════════════════════════ */
function AdminPage({ records, onUpdateStatus }) {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [pw, setPw] = useState("");
  const [auth, setAuth] = useState(false);

  if (!auth) return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, gap: 14 }}>
      <div style={{ fontSize: 40 }}>🔐</div>
      <div style={{ fontWeight: 800, fontSize: 18, color: DS.navy }}>後台管理</div>
      <div style={{ fontSize: 13, color: DS.gray500 }}>請輸入管理密碼</div>
      <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="密碼" onKeyDown={e => e.key === "Enter" && (pw === "5568" ? setAuth(true) : alert("密碼錯誤"))}
        style={{ border: `1.5px solid ${DS.gray300}`, borderRadius: 24, padding: "12px 20px", fontSize: 15, outline: "none", width: "100%", maxWidth: 280, fontFamily: "inherit", textAlign: "center" }} />
      <button onClick={() => pw === "5568" ? setAuth(true) : alert("密碼錯誤，預設：admin888")}
        style={{ background: DS.navy, color: DS.white, border: "none", borderRadius: 24, padding: "12px 36px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
        登入
      </button>
      <div style={{ fontSize: 11, color: DS.gray300 }}>預設密碼：admin888</div>
    </div>
  );

  const js = records.filter(r => r.type === "jobseeker");
  const em = records.filter(r => r.type === "employer");
  const display = (tab === "all" ? records : tab === "js" ? js : em)
    .filter(r => !search || JSON.stringify(r.data).includes(search));

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: DS.navy, padding: "14px 16px", flexShrink: 0 }}>
        <div style={{ color: DS.white, fontWeight: 800, fontSize: 15, marginBottom: 10 }}>🗂️ 後台管理</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          {[{ k: "all", l: `全部(${records.length})` }, { k: "js", l: `求職(${js.length})` }, { k: "em", l: `企業(${em.length})` }].map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{ background: tab === t.k ? DS.green : "rgba(255,255,255,0.15)", color: DS.white, border: "none", borderRadius: 16, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", fontWeight: tab === t.k ? 700 : 400 }}>{t.l}</button>
          ))}
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 搜尋..." style={{ width: "100%", border: "none", borderRadius: 20, padding: "8px 16px", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "10px 12px", background: DS.gray50, flexShrink: 0 }}>
        {[
          { label: "總記錄", val: records.length, color: DS.navy },
          { label: "求職者", val: js.length, color: DS.green },
          { label: "企業主", val: em.length, color: DS.gold },
        ].map(s => (
          <div key={s.label} style={{ background: DS.white, borderRadius: 10, padding: "10px", textAlign: "center", borderTop: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: DS.gray500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
        {display.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: DS.gray500 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
            <div>尚無資料</div>
          </div>
        ) : display.map(r => (
          <div key={r.id} style={{ background: DS.white, borderRadius: 14, padding: "14px", marginBottom: 10, boxShadow: DS.shadow, borderLeft: `4px solid ${r.type === "jobseeker" ? DS.green : DS.gold}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: DS.navy }}>
                  {r.type === "jobseeker" ? (r.data.name || "求職者") : (r.data.company || "企業")}
                </div>
                <div style={{ fontSize: 11, color: DS.gray500 }}>#{r.id} · {r.time}</div>
              </div>
              <div style={{ display: "flex", gap: 5, flexDirection: "column", alignItems: "flex-end" }}>
                <Badge color={r.type === "jobseeker" ? DS.green : DS.gold}>{r.type === "jobseeker" ? "求職者" : "企業"}</Badge>
                <Badge color={r.status === "待處理" ? DS.red : DS.green}>{r.status}</Badge>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
              {r.type === "jobseeker" ? (
                <>
                  {r.data.phone && <Info label="電話" val={r.data.phone} />}
                  {r.data.area && <Info label="地區" val={r.data.area} />}
                  {r.data.type && <Info label="工作類型" val={r.data.type} />}
                  {r.data.exp && <Info label="經驗" val={r.data.exp} />}
                </>
              ) : (
                <>
                  {r.data.position && <Info label="職缺" val={r.data.position} />}
                  {r.data.count && <Info label="人數" val={r.data.count} />}
                  {r.data.wage && <Info label="日薪" val={`$${r.data.wage}`} />}
                  {r.data.contact && <Info label="聯絡" val={r.data.contact} />}
                  {r.data.location && <Info label="地點" val={r.data.location} />}
                </>
              )}
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              {["待處理", "聯繫中", "已完成"].map(s => (
                <button key={s} onClick={() => onUpdateStatus(r.id, s)}
                  style={{ flex: 1, background: r.status === s ? DS.navy : DS.gray100, color: r.status === s ? DS.white : DS.gray700, border: "none", borderRadius: 8, padding: "7px 4px", fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: r.status === s ? 700 : 400 }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Info({ label, val }) {
  return (
    <div style={{ background: DS.gray50, borderRadius: 8, padding: "6px 10px" }}>
      <div style={{ fontSize: 10, color: DS.gray300, marginBottom: 1 }}>{label}</div>
      <div style={{ fontSize: 12, color: DS.navy, fontWeight: 600 }}>{val}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState("home");
  const [records, setRecords] = useState([]);

  useEffect(() => {
    loadRecords().then(setRecords);
  }, []);

  const saveRec = useCallback((r) => setRecords(p => [r, ...p]), []);
  const updateStatus = useCallback((id, status) => {
    setRecords(p => {
      const updated = p.map(r => r.id === id ? { ...r, status } : r);
      saveRecord({ __update: true });
      window.storage.set("records", JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const NAV = [
    { key: "home", icon: "🏠", label: "首頁" },
    { key: "jobs", icon: "📋", label: "職缺" },
    { key: "chat", icon: "💬", label: "客服" },
    { key: "post", icon: "🏢", label: "刊登" },
    { key: "admin", icon: "🗂️", label: "後台" },
  ];

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Noto Sans TC', sans-serif", background: DS.gray50, maxWidth: 480, margin: "0 auto", position: "relative", boxShadow: "0 0 60px rgba(0,0,0,0.15)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
      `}</style>

      {/* Top header */}
      <div style={{ background: DS.navy, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0, boxShadow: "0 2px 16px rgba(0,0,0,0.25)" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: DS.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>💼</div>
        <div>
          <div style={{ color: DS.white, fontWeight: 800, fontSize: 14 }}>台中日領現金工作站</div>
          <div style={{ color: DS.green, fontSize: 10, fontWeight: 600 }}>當日工作 · 當日領現</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: DS.green, animation: "pulse 2s infinite" }} />
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>線上</span>
        </div>
      </div>

      {/* Page content */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        {page === "home" && <LandingPage onNavigate={setPage} />}
        {page === "chat" && <ChatPage onSaveRecord={saveRec} />}
        {page === "jobs" && <JobsPage onNavigate={setPage} />}
        {page === "post" && <PostPage onSaveRecord={saveRec} onNavigate={setPage} />}
        {page === "admin" && <AdminPage records={records} onUpdateStatus={updateStatus} />}
      </div>

      {/* Bottom nav */}
      <div style={{ background: DS.white, borderTop: `1px solid ${DS.gray100}`, display: "flex", flexShrink: 0, boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}>
        {NAV.map(n => (
          <button key={n.key} onClick={() => setPage(n.key)} style={{ flex: 1, background: "none", border: "none", cursor: "pointer", padding: "10px 0 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: page === n.key ? 22 : 20, transition: "font-size 0.15s" }}>{n.icon}</span>
            <span style={{ fontSize: 10, color: page === n.key ? DS.green : DS.gray500, fontWeight: page === n.key ? 700 : 400, fontFamily: "inherit" }}>{n.label}</span>
            {page === n.key && <div style={{ width: 20, height: 2.5, borderRadius: 2, background: DS.green }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
