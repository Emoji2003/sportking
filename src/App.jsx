import { useState, useEffect, useRef } from "react";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
// Dark navy/blue + white only — inspired by 1xBet/ESPN clean look
const C = {
  bg0: "#070d1a",       // deepest background
  bg1: "#0d1626",       // page background
  bg2: "#111f35",       // card background
  bg3: "#162840",       // elevated card
  blue: "#1a56db",      // primary action blue
  blueHover: "#1e429f", // hover state
  blueSoft: "#1e3a5f",  // soft border/accent
  blueGlow: "rgba(26,86,219,0.15)",
  white: "#ffffff",
  grey1: "#94a3b8",     // secondary text
  grey2: "#4a6080",     // muted text
  border: "#1e3358",
  live: "#ef4444",
  win: "#22c55e",
  ad: "#0a1428",        // ad zone background
};

// ── DATA ──────────────────────────────────────────────────────────────────────
const SPORTS = [
  { id: "football", label: "Football", icon: "⚽" },
  { id: "basketball", label: "NBA", icon: "🏀" },
  { id: "nfl", label: "NFL", icon: "🏈" },
  { id: "cricket", label: "Cricket", icon: "🏏" },
];

const MATCHES = {
  football: [
    { id: 1, home: "Arsenal", homeFlag: "🔴", away: "Chelsea", awayFlag: "🔵", date: "Today", time: "20:00", league: "Premier League", live: true, hScore: 2, aScore: 1, min: "67'" },
    { id: 2, home: "Man City", homeFlag: "🔵", away: "Liverpool", awayFlag: "🔴", date: "Today", time: "22:30", league: "Premier League", live: false },
    { id: 3, home: "Real Madrid", homeFlag: "⚪", away: "Barcelona", awayFlag: "🔵", date: "Tomorrow", time: "21:00", league: "La Liga", live: false },
    { id: 4, home: "Super Eagles", homeFlag: "🇳🇬", away: "Ghana", awayFlag: "🇬🇭", date: "Sat", time: "17:00", league: "AFCON Qualifier", live: false },
    { id: 5, home: "PSG", homeFlag: "🔵", away: "Bayern", awayFlag: "🔴", date: "Tue", time: "20:00", league: "Champions League", live: false },
  ],
  basketball: [
    { id: 6, home: "Lakers", homeFlag: "🟣", away: "Celtics", awayFlag: "🟢", date: "Today", time: "01:30", league: "NBA", live: true, hScore: 87, aScore: 91, min: "Q3" },
    { id: 7, home: "Warriors", homeFlag: "🟡", away: "Bulls", awayFlag: "🔴", date: "Tomorrow", time: "02:00", league: "NBA", live: false },
  ],
  nfl: [
    { id: 8, home: "Chiefs", homeFlag: "🔴", away: "Eagles", awayFlag: "🟢", date: "Sun", time: "18:25", league: "NFL Week 12", live: false },
    { id: 9, home: "Cowboys", homeFlag: "🔵", away: "Giants", awayFlag: "🔵", date: "Sun", time: "21:20", league: "NFL Week 12", live: false },
  ],
  cricket: [
    { id: 10, home: "India", homeFlag: "🇮🇳", away: "England", awayFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", date: "Today", time: "09:30", league: "ICC Test", live: true, hScore: "234/6", aScore: "189 all out", min: "Day 2" },
    { id: 11, home: "Australia", homeFlag: "🇦🇺", away: "Pakistan", awayFlag: "🇵🇰", date: "Thu", time: "05:00", league: "ICC ODI", live: false },
  ],
};

const BLOG_POSTS = [
  { id: 1, title: "Arsenal vs Chelsea Preview: Predicted Lineups, Form Guide and Betting Tips", category: "Football", date: "Aug 4, 2026", readTime: "4 min", icon: "⚽", excerpt: "The North London side head into this clash in scintillating form having won their last 5 Premier League games. Here is everything you need to know before kick-off tonight.", hot: true },
  { id: 2, title: "Super Eagles AFCON 2027 Qualifier: Nigeria Must Win — Full Preview", category: "Football", date: "Aug 3, 2026", readTime: "5 min", icon: "🇳🇬", excerpt: "Nigeria face a must-win clash in the AFCON 2027 qualifiers. We break down the squad, tactical setup and what Nigerians can expect from this crucial match.", hot: true },
  { id: 3, title: "NBA 2026/27 Season Preview — Which Teams Will Win the Championship?", category: "Basketball", date: "Aug 2, 2026", readTime: "6 min", icon: "🏀", excerpt: "The new NBA season is approaching. SportKing analyses every conference contender and gives you our championship prediction before tip-off." },
  { id: 4, title: "Champions League Group Stage Draw — Complete Breakdown and Predictions", category: "Football", date: "Aug 1, 2026", readTime: "5 min", icon: "⭐", excerpt: "The Champions League group stage draw has been made. We analyse every group, identify the group of death and predict who advances to the knockout rounds." },
  { id: 5, title: "NFL 2026 Season — Super Bowl Prediction and Team Rankings", category: "NFL", date: "Jul 30, 2026", readTime: "5 min", icon: "🏈", excerpt: "The NFL season is here. SportKing ranks all 32 teams and gives our Super Bowl prediction with full reasoning from our analysts." },
  { id: 6, title: "IPL 2027 Auction Preview — Which Players Will Break the Bank?", category: "Cricket", date: "Jul 28, 2026", readTime: "4 min", icon: "🏏", excerpt: "The IPL 2027 mega auction is approaching. We identify the top players likely to command record bids and predict which franchises will emerge stronger." },
];

const LEADERBOARD = [
  { rank: 1, name: "Chidi_Naija", country: "🇳🇬", pts: 2847, prize: "₦25,000", tier: "gold" },
  { rank: 2, name: "FootballKing_UK", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", pts: 2634, prize: "₦15,000", tier: "silver" },
  { rank: 3, name: "BrazilFan2026", country: "🇧🇷", pts: 2501, prize: "₦10,000", tier: "bronze" },
  { rank: 4, name: "Seun_Predict", country: "🇳🇬", pts: 2389, prize: "₦4,000", tier: "blue" },
  { rank: 5, name: "SportKingUS", country: "🇺🇸", pts: 2201, prize: "₦4,000", tier: "blue" },
  { rank: 6, name: "AyoWins", country: "🇳🇬", pts: 2098, prize: "₦4,000", tier: "blue" },
  { rank: 7, name: "IndiaPredict11", country: "🇮🇳", pts: 1987, prize: "₦4,000", tier: "blue" },
  { rank: 8, name: "Emeka_Boss", country: "🇳🇬", pts: 1876, prize: "₦4,000", tier: "blue" },
];

const PRIZE_TIERS = [
  { pos: "🥇 1st", prize: "₦25,000", count: 1 },
  { pos: "🥈 2nd", prize: "₦15,000", count: 1 },
  { pos: "🥉 3rd", prize: "₦10,000", count: 1 },
  { pos: "4th – 10th", prize: "₦4,000 each", count: 7 },
  { pos: "11th – 50th", prize: "₦3,000 each", count: 40 },
  { pos: "51st – 100th", prize: "₦2,000 each", count: 50 },
];

// ── SHARED UI ─────────────────────────────────────────────────────────────────

// Clean ad zone matching 1xBet style
function AdBanner({ size = "leaderboard", label = "Advertisement" }) {
  const sizes = {
    leaderboard: { h: 90, w: "100%" },
    rectangle: { h: 250, w: "100%", maxW: 336 },
    strip: { h: 60, w: "100%" },
  };
  const s = sizes[size];
  return (
    <div style={{ width: s.w, maxWidth: s.maxW, height: s.h, background: C.ad, border: `1px solid ${C.blueSoft}`, borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "12px auto", flexShrink: 0 }}>
      <span style={{ color: C.grey2, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{label}</span>
      <span style={{ color: C.grey2, fontSize: 11 }}>Your Ad Here · Reach 500K+ Sports Fans</span>
    </div>
  );
}

function LivePill() {
  const [on, setOn] = useState(true);
  useEffect(() => { const t = setInterval(() => setOn(v => !v), 800); return () => clearInterval(t); }, []);
  return <span style={{ background: C.live, color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 4, opacity: on ? 1 : 0.5, transition: "opacity 0.4s" }}>● LIVE</span>;
}

function SportTab({ sport, active, onClick }) {
  return (
    <button onClick={onClick} style={{ background: active ? C.blue : C.bg2, color: active ? "#fff" : C.grey1, border: `1px solid ${active ? C.blue : C.border}`, borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap", transition: "all .15s" }}>
      <span>{sport.icon}</span> {sport.label}
    </button>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ width: 3, height: 18, background: C.blue, borderRadius: 2 }} />
      <span style={{ color: C.white, fontWeight: 700, fontSize: 16 }}>{children}</span>
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────────
function Nav({ active, setActive }) {
  const [open, setOpen] = useState(false);
  const tabs = ["Home", "Predictions", "Live Scores", "Blog", "Leaderboard", "Account"];

  return (
    <>
      <nav style={{ background: C.bg0, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 200 }}>
        {/* Top bar */}
        <div style={{ background: C.bg2, borderBottom: `1px solid ${C.border}`, padding: "4px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: C.grey1, fontSize: 11 }}>🇳🇬 Nigeria's #1 Free Sports Prediction Platform</span>
          <span style={{ color: C.grey1, fontSize: 11 }}>Next payout: <span style={{ color: C.win }}>Monday · ₦298,000 pool</span></span>
        </div>
        {/* Main nav */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div onClick={() => setActive("Home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 34, height: 34, background: C.blue, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#fff" }}>SK</div>
            <span style={{ color: C.white, fontWeight: 800, fontSize: 20, letterSpacing: -.5 }}>Sport<span style={{ color: C.blue }}>King</span></span>
          </div>

          {/* Desktop tabs */}
          <div style={{ display: "flex", gap: 2 }} className="sk-desk">
            {tabs.map(t => (
              <button key={t} onClick={() => setActive(t)} style={{ background: "none", color: active === t ? C.white : C.grey1, border: "none", borderBottom: active === t ? `2px solid ${C.blue}` : "2px solid transparent", padding: "18px 14px", fontSize: 13, fontWeight: active === t ? 700 : 500, cursor: "pointer", transition: "all .15s" }}>{t}</button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }} className="sk-desk">
            <button onClick={() => setActive("Account")} style={{ background: "none", color: C.grey1, border: `1px solid ${C.border}`, borderRadius: 6, padding: "7px 14px", fontSize: 13, cursor: "pointer" }}>Log In</button>
            <button onClick={() => setActive("Account")} style={{ background: C.blue, color: "#fff", border: "none", borderRadius: 6, padding: "7px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Join Free</button>
          </div>

          <button onClick={() => setOpen(!open)} style={{ display: "none", background: "none", border: "none", color: C.white, fontSize: 22, cursor: "pointer" }} className="sk-mob">☰</button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{ background: C.bg1, borderTop: `1px solid ${C.border}` }}>
            {tabs.map(t => (
              <button key={t} onClick={() => { setActive(t); setOpen(false); }} style={{ display: "block", width: "100%", background: active === t ? C.blueGlow : "none", color: active === t ? C.white : C.grey1, border: "none", borderLeft: active === t ? `3px solid ${C.blue}` : "3px solid transparent", padding: "13px 20px", textAlign: "left", fontSize: 14, fontWeight: active === t ? 700 : 400, cursor: "pointer" }}>{t}</button>
            ))}
            <div style={{ padding: "12px 16px", display: "flex", gap: 8 }}>
              <button style={{ flex: 1, background: "none", color: C.grey1, border: `1px solid ${C.border}`, borderRadius: 6, padding: 10, fontSize: 13, cursor: "pointer" }}>Log In</button>
              <button style={{ flex: 1, background: C.blue, color: "#fff", border: "none", borderRadius: 6, padding: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Join Free</button>
            </div>
          </div>
        )}
      </nav>
      <style>{`
        @media(max-width:768px){.sk-desk{display:none!important}.sk-mob{display:block!important}}
        @media(min-width:769px){.sk-mob{display:none!important}}
        *{box-sizing:border-box;margin:0;padding:0}
        html{overflow-x:hidden;max-width:100vw}
        body{background:${C.bg1};overflow-x:hidden;max-width:100vw;width:100%}
        #root{overflow-x:hidden;max-width:100vw;width:100%}
        input,select{outline:none;max-width:100%}
        button{font-family:inherit}
        img{max-width:100%}
        table{width:100%;table-layout:fixed}
        .sk-hero-grid{grid-template-columns:1fr!important}
        .sk-content-grid{grid-template-columns:1fr!important}
        @media(max-width:768px){
          .sk-hero-prize{display:none!important}
          .sk-sidebar{display:none!important}
          .sk-hero-grid{grid-template-columns:1fr!important}
          .sk-content-grid{grid-template-columns:1fr!important}
        }
        @media(min-width:769px){
          .sk-hero-grid{grid-template-columns:1fr 360px!important}
          .sk-content-grid{grid-template-columns:1fr 300px!important}
        }
      `}</style>
    </>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage({ setActive }) {
  const [activeSport, setActiveSport] = useState("football");
  const liveMatches = Object.values(MATCHES).flat().filter(m => m.live);

  return (
    <div style={{ background: C.bg1, minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ background: `linear-gradient(180deg, ${C.bg0} 0%, ${C.bg1} 100%)`, borderBottom: `1px solid ${C.border}`, padding: "40px 16px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr", gap: 40, alignItems: "center", width: "100%" }} className="sk-hero-grid">
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.blueGlow, border: `1px solid ${C.blueSoft}`, borderRadius: 4, padding: "5px 12px", marginBottom: 20 }}>
              <LivePill />
              <span style={{ color: C.grey1, fontSize: 12 }}>{liveMatches.length} matches live now</span>
            </div>
            <h1 style={{ color: C.white, fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 16, letterSpacing: -1 }}>
              Nigeria's Home of<br />
              <span style={{ color: C.blue }}>Free Sports Predictions</span>
            </h1>
            <p style={{ color: C.grey1, fontSize: 16, lineHeight: 1.7, marginBottom: 28, maxWidth: 520 }}>
              Predict football, NBA, NFL and cricket results for free. Climb the leaderboard and win real Naira prizes every week — no money required, ever.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => setActive("Predictions")} style={{ background: C.blue, color: "#fff", border: "none", borderRadius: 7, padding: "13px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Start Predicting Free →</button>
              <button onClick={() => setActive("Leaderboard")} style={{ background: "none", color: C.white, border: `1px solid ${C.border}`, borderRadius: 7, padding: "13px 24px", fontSize: 15, cursor: "pointer" }}>View Leaderboard</button>
            </div>
          </div>

          {/* Prize snapshot */}
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }} className="sk-hero-prize">
            <div style={{ background: C.blue, padding: "12px 16px" }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>🏆 Weekly Prize Pool</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>100 winners every Monday</div>
            </div>
            <div style={{ padding: "16px" }}>
              {PRIZE_TIERS.slice(0, 4).map(t => (
                <div key={t.pos} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ color: C.grey1, fontSize: 13 }}>{t.pos}</span>
                  <span style={{ color: C.white, fontWeight: 700, fontSize: 13 }}>{t.prize}</span>
                </div>
              ))}
              <div style={{ marginTop: 12, background: C.blueGlow, border: `1px solid ${C.blueSoft}`, borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
                <div style={{ color: C.white, fontWeight: 800, fontSize: 18 }}>₦298,000</div>
                <div style={{ color: C.grey1, fontSize: 12 }}>Total weekly payout</div>
              </div>
              <button onClick={() => setActive("Predictions")} style={{ marginTop: 12, width: "100%", background: C.blue, color: "#fff", border: "none", borderRadius: 7, padding: "11px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Join Free — No Deposit</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(min-width:769px){
          .sk-hero-grid{grid-template-columns:1fr 360px!important}
          .sk-content-grid{grid-template-columns:1fr 300px!important}
          .sk-hero-prize{display:block!important}
          .sk-sidebar{display:block!important}
        }
        @media(max-width:768px){
          .sk-hero-prize{display:none!important}
          .sk-sidebar{display:none!important}
        }
      `}</style>

      {/* Ad banner below hero */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px" }}>
        <AdBanner size="leaderboard" label="Advertisement — Bet9ja" />
      </div>

      {/* Live scores ticker */}
      <div style={{ background: C.bg0, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "10px 0", overflow: "hidden" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 16px", display: "flex", gap: 32, alignItems: "center", overflowX: "auto", scrollbarWidth: "none" }}>
          <span style={{ color: C.blue, fontWeight: 800, fontSize: 12, whiteSpace: "nowrap", flexShrink: 0 }}>● LIVE</span>
          {liveMatches.map(m => (
            <div key={m.id} style={{ display: "flex", gap: 8, alignItems: "center", whiteSpace: "nowrap", flexShrink: 0, fontSize: 13 }}>
              <span style={{ color: C.grey1 }}>{m.home}</span>
              <span style={{ color: C.live, fontWeight: 800 }}>{m.hScore} – {m.aScore}</span>
              <span style={{ color: C.grey1 }}>{m.away}</span>
              <span style={{ color: C.grey2, fontSize: 11 }}>{m.min}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 16px", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, width: "100%" }} className="sk-content-grid">

          {/* Main content */}
          <div>
            {/* Today's matches */}
            <SectionLabel>Today's Matches</SectionLabel>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16, paddingBottom: 4, scrollbarWidth: "none" }}>
              {SPORTS.map(s => <SportTab key={s.id} sport={s} active={activeSport === s.id} onClick={() => setActiveSport(s.id)} />)}
            </div>

            {MATCHES[activeSport].slice(0, 3).map(m => (
              <div key={m.id} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ color: C.grey2, fontSize: 11, fontWeight: 600 }}>{m.league}</span>
                  {m.live ? <LivePill /> : <span style={{ color: C.grey2, fontSize: 11 }}>{m.date} · {m.time}</span>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 22 }}>{m.homeFlag}</span>
                    <span style={{ color: C.white, fontWeight: 600, fontSize: 14 }}>{m.home}</span>
                  </div>
                  <div style={{ textAlign: "center", minWidth: 80 }}>
                    {m.live ? (
                      <div style={{ color: C.live, fontWeight: 900, fontSize: 22 }}>{m.hScore} – {m.aScore}</div>
                    ) : (
                      <div style={{ color: C.grey2, fontWeight: 700, fontSize: 15 }}>vs</div>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                    <span style={{ color: C.white, fontWeight: 600, fontSize: 14 }}>{m.away}</span>
                    <span style={{ fontSize: 22 }}>{m.awayFlag}</span>
                  </div>
                </div>
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  <button onClick={() => setActive("Predictions")} style={{ flex: 1, background: C.blueGlow, color: C.blue, border: `1px solid ${C.blueSoft}`, borderRadius: 6, padding: "7px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Predict Score</button>
                  <button style={{ padding: "7px 14px", background: "none", color: C.grey1, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Preview →</button>
                </div>
              </div>
            ))}

            <button onClick={() => setActive("Live Scores")} style={{ width: "100%", background: "none", color: C.blue, border: `1px solid ${C.border}`, borderRadius: 8, padding: 11, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 28 }}>View All Matches →</button>

            {/* Ad between sections */}
            <AdBanner size="leaderboard" label="Advertisement — SportyBet" />

            {/* Latest blog */}
            <div style={{ marginTop: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <SectionLabel>Latest Articles</SectionLabel>
                <button onClick={() => setActive("Blog")} style={{ background: "none", color: C.blue, border: "none", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>View All →</button>
              </div>
              {BLOG_POSTS.slice(0, 4).map(p => (
                <div key={p.id} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 10, display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ fontSize: 32, flexShrink: 0 }}>{p.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "center" }}>
                      <span style={{ background: C.blueGlow, color: C.blue, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 3, border: `1px solid ${C.blueSoft}` }}>{p.category}</span>
                      {p.hot && <span style={{ background: "rgba(239,68,68,0.15)", color: C.live, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 3 }}>🔥 HOT</span>}
                      <span style={{ color: C.grey2, fontSize: 11 }}>{p.readTime}</span>
                    </div>
                    <h3 style={{ color: C.white, fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 4 }}>{p.title}</h3>
                    <span style={{ color: C.grey2, fontSize: 11 }}>{p.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="sk-sidebar">
            {/* Mini leaderboard */}
            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
              <div style={{ background: C.blue, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>🏆 Top Predictors</span>
                <button onClick={() => setActive("Leaderboard")} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", borderRadius: 4, padding: "3px 8px", fontSize: 11, cursor: "pointer" }}>Full List →</button>
              </div>
              <div style={{ padding: "8px" }}>
                {LEADERBOARD.slice(0, 5).map((u, i) => (
                  <div key={u.rank} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 7, background: i === 0 ? "rgba(26,86,219,0.1)" : "transparent", marginBottom: 2 }}>
                    <span style={{ color: i === 0 ? "#fbbf24" : i === 1 ? "#9ca3af" : i === 2 ? "#cd7f32" : C.grey2, fontWeight: 800, fontSize: 13, width: 18, textAlign: "center" }}>{u.rank}</span>
                    <span style={{ fontSize: 14 }}>{u.country}</span>
                    <span style={{ color: C.white, fontSize: 13, fontWeight: 600, flex: 1 }}>{u.name}</span>
                    <span style={{ color: C.blue, fontSize: 12, fontWeight: 700 }}>{u.pts.toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ padding: "10px", borderTop: `1px solid ${C.border}`, textAlign: "center" }}>
                  <button onClick={() => setActive("Predictions")} style={{ background: C.blue, color: "#fff", border: "none", borderRadius: 6, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", width: "100%" }}>Join & Compete Free</button>
                </div>
              </div>
            </div>

            {/* Sidebar ad */}
            <AdBanner size="rectangle" label="Advertisement" />

            {/* Points tip */}
            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginTop: 20 }}>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>⚡ Earn Points Faster</div>
              {[["📖", "Read articles", "+1 pt each"], ["📊", "Check live scores", "+2 pts/day"], ["🔮", "Predict matches", "+3 pts"], ["👥", "Refer a friend", "+50 pts"], ["📤", "Share leaderboard", "+5 pts"]].map(([icon, action, pts]) => (
                <div key={action} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 16 }}>{icon}</span>
                  <span style={{ color: C.grey1, fontSize: 13, flex: 1 }}>{action}</span>
                  <span style={{ color: C.win, fontSize: 12, fontWeight: 700 }}>{pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){.sk-content-grid{grid-template-columns:1fr!important}.sk-sidebar{display:none}}`}</style>
    </div>
  );
}

// ── PREDICTIONS PAGE ──────────────────────────────────────────────────────────
function PredictionsPage() {
  const [sport, setSport] = useState("football");
  const [preds, setPreds] = useState({});
  const [step, setStep] = useState("predict"); // predict | register | done
  const [form, setForm] = useState({ name: "", email: "", country: "Nigeria", phone: "" });

  const matches = MATCHES[sport];

  function handleSubmit() {
    if (Object.keys(preds).length === 0) return alert("Please enter at least one prediction");
    setStep("register");
  }

  function handleRegister() {
    if (!form.name || !form.email) return alert("Please fill in name and email");
    setStep("done");
  }

  return (
    <div style={{ background: C.bg1, minHeight: "100vh", padding: "24px 16px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ color: C.white, fontSize: 28, fontWeight: 900, marginBottom: 6 }}>Free Prediction League</h1>
          <p style={{ color: C.grey1, fontSize: 14 }}>Predict results across all sports. Earn points. Win ₦298,000 weekly — completely free.</p>
        </div>

        {/* Prize bar */}
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 20, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {PRIZE_TIERS.map(t => (
            <div key={t.pos} style={{ textAlign: "center", padding: "6px 4px" }}>
              <div style={{ color: C.grey1, fontSize: 10, marginBottom: 3 }}>{t.pos}</div>
              <div style={{ color: C.white, fontWeight: 800, fontSize: 12 }}>{t.prize}</div>
            </div>
          ))}
        </div>

        <AdBanner size="leaderboard" label="Advertisement — BetKing" />

        {step === "predict" && (
          <div style={{ marginTop: 20 }}>
            {/* Sport selector */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 20, paddingBottom: 4, scrollbarWidth: "none" }}>
              {SPORTS.map(s => <SportTab key={s.id} sport={s} active={sport === s.id} onClick={() => setSport(s.id)} />)}
            </div>

            {/* Points reminder */}
            <div style={{ background: C.blueGlow, border: `1px solid ${C.blueSoft}`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, display: "flex", gap: 20, flexWrap: "wrap" }}>
              <span style={{ color: C.grey1, fontSize: 12 }}>⚽ Exact score = <b style={{ color: C.white }}>3 pts</b></span>
              <span style={{ color: C.grey1, fontSize: 12 }}>✅ Correct result = <b style={{ color: C.white }}>1 pt</b></span>
              <span style={{ color: C.grey1, fontSize: 12 }}>🔥 Perfect matchday = <b style={{ color: C.white }}>+5 bonus</b></span>
              <span style={{ color: C.grey1, fontSize: 12 }}>👥 Refer friend = <b style={{ color: C.white }}>+50 pts</b></span>
            </div>

            {matches.map(m => (
              <div key={m.id} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px", marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ color: C.grey2, fontSize: 12, fontWeight: 600 }}>{m.league}</span>
                  {m.live ? <LivePill /> : <span style={{ color: C.grey2, fontSize: 12 }}>{m.date} · {m.time}</span>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 16 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 4 }}>{m.homeFlag}</div>
                    <div style={{ color: C.white, fontWeight: 700, fontSize: 14 }}>{m.home}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="number" min="0" max="50" placeholder="0" value={preds[`${m.id}_h`] || ""} onChange={e => setPreds(p => ({ ...p, [`${m.id}_h`]: e.target.value }))} disabled={m.live}
                      style={{ width: 52, height: 52, background: C.bg0, border: `2px solid ${C.border}`, borderRadius: 8, color: C.blue, fontSize: 22, fontWeight: 900, textAlign: "center", opacity: m.live ? 0.4 : 1 }} />
                    <span style={{ color: C.grey2, fontWeight: 700, fontSize: 18 }}>–</span>
                    <input type="number" min="0" max="50" placeholder="0" value={preds[`${m.id}_a`] || ""} onChange={e => setPreds(p => ({ ...p, [`${m.id}_a`]: e.target.value }))} disabled={m.live}
                      style={{ width: 52, height: 52, background: C.bg0, border: `2px solid ${C.border}`, borderRadius: 8, color: C.blue, fontSize: 22, fontWeight: 900, textAlign: "center", opacity: m.live ? 0.4 : 1 }} />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 4 }}>{m.awayFlag}</div>
                    <div style={{ color: C.white, fontWeight: 700, fontSize: 14 }}>{m.away}</div>
                  </div>
                </div>
                {m.live && <div style={{ marginTop: 10, textAlign: "center", color: C.live, fontSize: 12, fontWeight: 700 }}>● Match is live — predictions closed</div>}
              </div>
            ))}

            <button onClick={handleSubmit} style={{ width: "100%", background: C.blue, color: "#fff", border: "none", borderRadius: 10, padding: "15px", fontSize: 16, fontWeight: 800, cursor: "pointer", marginTop: 8 }}>Submit Predictions →</button>
          </div>
        )}

        {step === "register" && (
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28, marginTop: 20 }}>
            <h2 style={{ color: C.white, fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Almost there!</h2>
            <p style={{ color: C.grey1, fontSize: 14, marginBottom: 24 }}>Create your free account to save your predictions and appear on the leaderboard.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ color: C.grey1, fontSize: 12, display: "block", marginBottom: 6 }}>Display Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. ChidiWins" style={{ width: "100%", background: C.bg0, border: `1px solid ${C.border}`, color: C.white, borderRadius: 8, padding: "11px 14px", fontSize: 14 }} />
              </div>
              <div>
                <label style={{ color: C.grey1, fontSize: 12, display: "block", marginBottom: 6 }}>Email Address *</label>
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" type="email" style={{ width: "100%", background: C.bg0, border: `1px solid ${C.border}`, color: C.white, borderRadius: 8, padding: "11px 14px", fontSize: 14 }} />
              </div>
              <div>
                <label style={{ color: C.grey1, fontSize: 12, display: "block", marginBottom: 6 }}>Country</label>
                <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} style={{ width: "100%", background: C.bg0, border: `1px solid ${C.border}`, color: C.white, borderRadius: 8, padding: "11px 14px", fontSize: 14 }}>
                  {["Nigeria", "Ghana", "Kenya", "South Africa", "England", "USA", "India", "Brazil", "Other"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: C.grey1, fontSize: 12, display: "block", marginBottom: 6 }}>Phone (for prize payout)</label>
                <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+234 xxx xxx xxxx" style={{ width: "100%", background: C.bg0, border: `1px solid ${C.border}`, color: C.white, borderRadius: 8, padding: "11px 14px", fontSize: 14 }} />
              </div>
            </div>
            <div style={{ background: C.blueGlow, border: `1px solid ${C.blueSoft}`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: C.grey1 }}>
              🔒 Your details are safe. We only contact you if you win a prize. No spam ever.
            </div>
            <button onClick={handleRegister} style={{ width: "100%", background: C.blue, color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>Confirm & Save Predictions</button>
          </div>
        )}

        {step === "done" && (
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 40, textAlign: "center", marginTop: 20 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 style={{ color: C.white, fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Predictions Saved!</h2>
            <p style={{ color: C.grey1, marginBottom: 24, fontSize: 15 }}>Good luck {form.name}! Check the leaderboard every matchday to track your points.</p>
            <div style={{ background: C.bg0, borderRadius: 10, padding: "16px 20px", marginBottom: 24, display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
              <div><div style={{ color: C.grey1, fontSize: 12 }}>Your Points</div><div style={{ color: C.white, fontWeight: 900, fontSize: 22 }}>+10</div><div style={{ color: C.win, fontSize: 11 }}>Welcome bonus</div></div>
              <div><div style={{ color: C.grey1, fontSize: 12 }}>Next Payout</div><div style={{ color: C.white, fontWeight: 900, fontSize: 16 }}>Monday</div><div style={{ color: C.grey1, fontSize: 11 }}>Weekly cycle</div></div>
              <div><div style={{ color: C.grey1, fontSize: 12 }}>Prize Pool</div><div style={{ color: C.white, fontWeight: 900, fontSize: 18 }}>₦298K</div><div style={{ color: C.grey1, fontSize: 11 }}>This week</div></div>
            </div>
            <div style={{ background: C.blueGlow, border: `1px solid ${C.blueSoft}`, borderRadius: 10, padding: "16px 20px", marginBottom: 16 }}>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>👥 Earn 50 points for every friend you refer!</div>
              <div style={{ background: C.bg0, borderRadius: 6, padding: "8px 14px", fontSize: 13, color: C.blue, fontWeight: 600, wordBreak: "break-all" }}>
                sportking.com/ref/{form.name || "yourname"}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setStep("predict"); setPreds({}); }} style={{ flex: 1, background: "none", color: C.grey1, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, fontSize: 14, cursor: "pointer" }}>Predict More Matches</button>
              <button style={{ flex: 1, background: C.blue, color: "#fff", border: "none", borderRadius: 8, padding: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>📤 Share Referral Link</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── LIVE SCORES PAGE ──────────────────────────────────────────────────────────
function LiveScoresPage() {
  const [sport, setSport] = useState("football");
  const allMatches = MATCHES[sport];
  const live = allMatches.filter(m => m.live);
  const upcoming = allMatches.filter(m => !m.live);

  return (
    <div style={{ background: C.bg1, minHeight: "100vh", padding: "24px 16px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h1 style={{ color: C.white, fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Live Scores</h1>
            <p style={{ color: C.grey1, fontSize: 13 }}>Real-time scores · +2 points for visiting daily</p>
          </div>
          <div style={{ background: C.blueGlow, border: `1px solid ${C.blueSoft}`, borderRadius: 8, padding: "8px 14px", textAlign: "center" }}>
            <div style={{ color: C.win, fontWeight: 800, fontSize: 14 }}>+2 pts</div>
            <div style={{ color: C.grey1, fontSize: 11 }}>earned today</div>
          </div>
        </div>

        {/* Top ad — above scores */}
        <AdBanner size="leaderboard" label="Advertisement — 1xBet Nigeria" />

        {/* Sport tabs */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", margin: "20px 0 16px", paddingBottom: 4, scrollbarWidth: "none" }}>
          {SPORTS.map(s => <SportTab key={s.id} sport={s} active={sport === s.id} onClick={() => setSport(s.id)} />)}
        </div>

        {/* Live matches */}
        {live.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <LivePill />
              <span style={{ color: C.grey1, fontSize: 13 }}>{live.length} match{live.length > 1 ? "es" : ""} live</span>
            </div>
            {live.map(m => (
              <div key={m.id} style={{ background: C.bg2, border: `1px solid ${C.live}`, borderRadius: 10, padding: "16px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ color: C.grey2, fontSize: 12, fontWeight: 600 }}>{m.league}</span>
                  <span style={{ color: C.live, fontSize: 12, fontWeight: 700 }}>{m.min}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 24 }}>{m.homeFlag}</span>
                    <span style={{ color: C.white, fontWeight: 700 }}>{m.home}</span>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ color: C.white, fontWeight: 900, fontSize: 28 }}>{m.hScore} – {m.aScore}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                    <span style={{ color: C.white, fontWeight: 700 }}>{m.away}</span>
                    <span style={{ fontSize: 24 }}>{m.awayFlag}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Ad between live and upcoming */}
            <AdBanner size="strip" label="Advertisement" />
          </>
        )}

        {/* Upcoming */}
        <SectionLabel>Upcoming Matches</SectionLabel>
        {upcoming.map((m, idx) => (
          <>
            <div key={m.id} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: C.grey2, fontSize: 12, fontWeight: 600 }}>{m.league}</span>
                <span style={{ color: C.grey1, fontSize: 12 }}>{m.date} · {m.time}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 24 }}>{m.homeFlag}</span>
                  <span style={{ color: C.white, fontWeight: 600 }}>{m.home}</span>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ color: C.grey2, fontWeight: 700, fontSize: 15 }}>vs</div>
                  <div style={{ color: C.grey2, fontSize: 11 }}>{m.time}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                  <span style={{ color: C.white, fontWeight: 600 }}>{m.away}</span>
                  <span style={{ fontSize: 24 }}>{m.awayFlag}</span>
                </div>
              </div>
              <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                <button style={{ flex: 1, background: C.blueGlow, color: C.blue, border: `1px solid ${C.blueSoft}`, borderRadius: 6, padding: 7, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Predict This Match</button>
                <button style={{ padding: "7px 14px", background: "none", color: C.grey1, border: `1px solid ${C.border}`, borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Bet9ja Odds →</button>
              </div>
            </div>
            {/* Ad after every 3rd match */}
            {(idx + 1) % 3 === 0 && <AdBanner key={`ad-${idx}`} size="strip" label="Advertisement — SportyBet" />}
          </>
        ))}
      </div>
    </div>
  );
}

// ── BLOG PAGE ─────────────────────────────────────────────────────────────────
function BlogPage() {
  const [filter, setFilter] = useState("All");
  const [reading, setReading] = useState(null);
  const cats = ["All", "Football", "Basketball", "NFL", "Cricket"];
  const filtered = filter === "All" ? BLOG_POSTS : BLOG_POSTS.filter(p => p.category === filter);

  if (reading) return (
    <div style={{ background: C.bg1, minHeight: "100vh", padding: "24px 16px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <button onClick={() => setReading(null)} style={{ background: "none", color: C.blue, border: "none", fontSize: 14, cursor: "pointer", marginBottom: 20 }}>← Back to Blog</button>
        <AdBanner size="leaderboard" label="Advertisement" />
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: "28px 24px", marginTop: 16 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <span style={{ background: C.blueGlow, color: C.blue, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 3 }}>{reading.category}</span>
            <span style={{ color: C.grey2, fontSize: 12 }}>{reading.date} · {reading.readTime}</span>
          </div>
          <h1 style={{ color: C.white, fontSize: "clamp(18px,4vw,26px)", fontWeight: 900, lineHeight: 1.3, marginBottom: 20 }}>{reading.title}</h1>
          <div style={{ fontSize: 48, textAlign: "center", margin: "20px 0" }}>{reading.icon}</div>
          <AdBanner size="leaderboard" label="Advertisement — Bet9ja" />
          <p style={{ color: C.grey1, fontSize: 15, lineHeight: 1.8, marginTop: 20 }}>{reading.excerpt}</p>
          <p style={{ color: C.grey1, fontSize: 15, lineHeight: 1.8, marginTop: 16 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p style={{ color: C.grey1, fontSize: 15, lineHeight: 1.8, marginTop: 16 }}>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <AdBanner size="leaderboard" label="Advertisement — SportyBet" />
          <div style={{ marginTop: 20, background: C.blueGlow, border: `1px solid ${C.blueSoft}`, borderRadius: 10, padding: 16, textAlign: "center" }}>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 15, marginBottom: 8 }}>🏆 Predict this match and win prizes!</div>
            <p style={{ color: C.grey1, fontSize: 13, marginBottom: 12 }}>Join SportKing's free prediction league — ₦298,000 in weekly prizes.</p>
            <button style={{ background: C.blue, color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Join Free →</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: C.bg1, minHeight: "100vh", padding: "24px 16px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ color: C.white, fontSize: 26, fontWeight: 900, marginBottom: 6 }}>Sports Blog</h1>
          <p style={{ color: C.grey1, fontSize: 13 }}>Match previews, analysis and news · +1 point per article you read</p>
        </div>

        <AdBanner size="leaderboard" label="Advertisement" />

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "20px 0" }}>
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{ background: filter === c ? C.blue : C.bg2, color: filter === c ? "#fff" : C.grey1, border: `1px solid ${filter === c ? C.blue : C.border}`, borderRadius: 20, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{c}</button>
          ))}
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          {filtered.map((p, idx) => (
            <>
              <div key={p.id} onClick={() => setReading(p)} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px", cursor: "pointer", display: "flex", gap: 16, alignItems: "flex-start", transition: "border-color .15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.blue}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                <div style={{ fontSize: 36, flexShrink: 0 }}>{p.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ background: C.blueGlow, color: C.blue, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 3, border: `1px solid ${C.blueSoft}` }}>{p.category}</span>
                    {p.hot && <span style={{ background: "rgba(239,68,68,0.15)", color: C.live, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 3 }}>🔥 HOT</span>}
                    <span style={{ color: C.grey2, fontSize: 11 }}>{p.readTime}</span>
                    <span style={{ color: C.win, fontSize: 11, fontWeight: 600 }}>+1 pt</span>
                  </div>
                  <h3 style={{ color: C.white, fontSize: 15, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>{p.title}</h3>
                  <p style={{ color: C.grey1, fontSize: 13, lineHeight: 1.5, marginBottom: 8 }}>{p.excerpt.slice(0, 100)}...</p>
                  <span style={{ color: C.grey2, fontSize: 11 }}>{p.date}</span>
                </div>
              </div>
              {(idx + 1) % 3 === 0 && <AdBanner key={`ad-${idx}`} size="strip" label="Advertisement" />}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── LEADERBOARD PAGE ──────────────────────────────────────────────────────────
function LeaderboardPage() {
  const [tab, setTab] = useState("nigeria");

  return (
    <div style={{ background: C.bg1, minHeight: "100vh", padding: "24px 16px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ color: C.white, fontSize: 26, fontWeight: 900, marginBottom: 6 }}>Leaderboard</h1>
          <p style={{ color: C.grey1, fontSize: 13 }}>Updated after every match · Next payout Monday</p>
        </div>

        {/* Prize summary */}
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <div style={{ color: C.white, fontWeight: 800, fontSize: 16, marginBottom: 16 }}>🏆 This Week's Prize Pool — ₦298,000</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 10 }}>
            {PRIZE_TIERS.map(t => (
              <div key={t.pos} style={{ background: C.bg0, borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ color: C.grey1, fontSize: 11, marginBottom: 4 }}>{t.pos}</div>
                <div style={{ color: C.white, fontWeight: 800, fontSize: 13 }}>{t.prize}</div>
              </div>
            ))}
          </div>
        </div>

        <AdBanner size="leaderboard" label="Advertisement — Bet9ja" />

        {/* Tab */}
        <div style={{ display: "flex", gap: 8, margin: "20px 0 16px" }}>
          {[["nigeria", "🇳🇬 Nigeria"], ["global", "🌍 Global"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ background: tab === id ? C.blue : C.bg2, color: tab === id ? "#fff" : C.grey1, border: `1px solid ${tab === id ? C.blue : C.border}`, borderRadius: 8, padding: "9px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{label}</button>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 70px 80px", padding: "10px 12px", borderBottom: `1px solid ${C.border}`, background: C.bg0 }}>
            {["#", "Player", "Pts", "Prize"].map(h => <span key={h} style={{ color: C.grey2, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{h}</span>)}
          </div>
          {LEADERBOARD.map((u, i) => (
            <>
              <div key={u.rank} style={{ display: "grid", gridTemplateColumns: "36px 1fr 70px 80px", padding: "12px 12px", borderBottom: `1px solid ${C.border}`, background: u.rank <= 3 ? "rgba(26,86,219,0.06)" : "transparent", alignItems: "center" }}>
                <span style={{ color: u.rank === 1 ? "#fbbf24" : u.rank === 2 ? "#9ca3af" : u.rank === 3 ? "#cd7f32" : C.grey2, fontWeight: 800, fontSize: 13 }}>{u.rank}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{u.country}</span>
                  <span style={{ color: C.white, fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</span>
                </div>
                <span style={{ color: C.blue, fontWeight: 800, fontSize: 13 }}>{u.pts.toLocaleString()}</span>
                <span style={{ color: C.win, fontWeight: 700, fontSize: 12 }}>{u.prize}</span>
              </div>
              {(i + 1) % 5 === 0 && <AdBanner key={`ad-${i}`} size="strip" label="Advertisement" />}
            </>
          ))}
        </div>

        <div style={{ marginTop: 20, background: C.blueGlow, border: `1px solid ${C.blueSoft}`, borderRadius: 10, padding: 16, textAlign: "center" }}>
          <div style={{ color: C.white, fontWeight: 700, fontSize: 14, marginBottom: 6 }}>👥 Refer friends — earn 50 points each!</div>
          <p style={{ color: C.grey1, fontSize: 13, marginBottom: 12 }}>Top referrer this week wins an extra ₦5,000 bonus prize</p>
          <button style={{ background: C.blue, color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>📤 Share Your Referral Link</button>
        </div>
      </div>
    </div>
  );
}

// ── ACCOUNT PAGE ──────────────────────────────────────────────────────────────
function AccountPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", country: "Nigeria" });

  return (
    <div style={{ background: C.bg1, minHeight: "100vh", padding: "40px 16px", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: C.white, marginBottom: 6 }}>Sport<span style={{ color: C.blue }}>King</span></div>
          <p style={{ color: C.grey1, fontSize: 14 }}>{mode === "login" ? "Welcome back!" : "Join 500,000+ sports fans"}</p>
        </div>

        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28 }}>
          <div style={{ display: "flex", marginBottom: 24, background: C.bg0, borderRadius: 8, padding: 4 }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ flex: 1, background: mode === m ? C.blue : "none", color: mode === m ? "#fff" : C.grey1, border: "none", borderRadius: 6, padding: "9px", fontSize: 14, fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>{m === "login" ? "Log In" : "Register Free"}</button>
            ))}
          </div>

          {mode === "register" && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: C.grey1, fontSize: 12, display: "block", marginBottom: 6 }}>Display Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. NaijaKing" style={{ width: "100%", background: C.bg0, border: `1px solid ${C.border}`, color: C.white, borderRadius: 8, padding: "11px 14px", fontSize: 14 }} />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: C.grey1, fontSize: 12, display: "block", marginBottom: 6 }}>Email Address</label>
            <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" type="email" style={{ width: "100%", background: C.bg0, border: `1px solid ${C.border}`, color: C.white, borderRadius: 8, padding: "11px 14px", fontSize: 14 }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ color: C.grey1, fontSize: 12, display: "block", marginBottom: 6 }}>Password</label>
            <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" type="password" style={{ width: "100%", background: C.bg0, border: `1px solid ${C.border}`, color: C.white, borderRadius: 8, padding: "11px 14px", fontSize: 14 }} />
          </div>

          {mode === "register" && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: C.grey1, fontSize: 12, display: "block", marginBottom: 6 }}>Country</label>
              <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} style={{ width: "100%", background: C.bg0, border: `1px solid ${C.border}`, color: C.white, borderRadius: 8, padding: "11px 14px", fontSize: 14 }}>
                {["Nigeria", "Ghana", "Kenya", "South Africa", "England", "USA", "India", "Brazil", "Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          )}

          <button style={{ width: "100%", background: C.blue, color: "#fff", border: "none", borderRadius: 8, padding: "13px", fontSize: 15, fontWeight: 800, cursor: "pointer", marginBottom: 16 }}>
            {mode === "login" ? "Log In →" : "Create Free Account →"}
          </button>

          {mode === "register" && (
            <div style={{ background: C.blueGlow, border: `1px solid ${C.blueSoft}`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.grey1, textAlign: "center" }}>
              🎁 Get <b style={{ color: C.white }}>10 welcome points</b> + <b style={{ color: C.white }}>₦298,000 prize pool</b> access on signup
            </div>
          )}
        </div>

        {mode === "register" && (
          <div style={{ marginTop: 20, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Why join SportKing?</div>
            {[["🏆", "Win ₦298,000 weekly — completely free"], ["⚽", "Predict football, NBA, NFL and cricket"], ["📊", "Earn points for reading and live scores"], ["👥", "Earn 50 pts per friend you refer"], ["🔒", "No deposit, no betting, just knowledge"]].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", gap: 10, alignItems: "center", padding: "7px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <span style={{ color: C.grey1, fontSize: 13 }}>{text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer({ setActive }) {
  return (
    <footer style={{ background: C.bg0, borderTop: `1px solid ${C.border}`, padding: "32px 16px 20px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 20, marginBottom: 28 }}>
          <div>
            <div style={{ color: C.white, fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Sport<span style={{ color: C.blue }}>King</span></div>
            <p style={{ color: C.grey2, fontSize: 13, lineHeight: 1.7 }}>Nigeria's #1 free sports prediction platform. Predict, earn points and win real prizes every week.</p>
          </div>
          <div>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Platform</div>
            {["Home", "Predictions", "Live Scores", "Blog", "Leaderboard"].map(l => (
              <div key={l} onClick={() => setActive(l)} style={{ color: C.grey2, fontSize: 13, marginBottom: 8, cursor: "pointer" }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Sports</div>
            {["Football", "Basketball (NBA)", "American Football (NFL)", "Cricket (IPL/ICC)"].map(l => (
              <div key={l} style={{ color: C.grey2, fontSize: 13, marginBottom: 8 }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ color: C.white, fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Legal</div>
            {["About SportKing", "Privacy Policy", "Terms of Service", "Contact Us"].map(l => (
              <div key={l} style={{ color: C.grey2, fontSize: 13, marginBottom: 8, cursor: "pointer" }}>{l}</div>
            ))}
          </div>
        </div>
        <AdBanner size="leaderboard" label="Advertisement" />
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <span style={{ color: C.grey2, fontSize: 12 }}>© 2026 SportKing · thesportking.com</span>
          <span style={{ color: C.grey2, fontSize: 12 }}>SportKing is a free skill-based prediction platform. Not a betting site.</span>
        </div>
      </div>
    </footer>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("Home");

  const pages = {
    Home: <HomePage setActive={setActive} />,
    Predictions: <PredictionsPage />,
    "Live Scores": <LiveScoresPage />,
    Blog: <BlogPage />,
    Leaderboard: <LeaderboardPage />,
    Account: <AccountPage />,
  };

  return (
    <div style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif", background: C.bg1, minHeight: "100vh" }}>
      <Nav active={active} setActive={setActive} />
      {pages[active] || <HomePage setActive={setActive} />}
      <Footer setActive={setActive} />
    </div>
  );
}
