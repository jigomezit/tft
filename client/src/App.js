import { useState, useEffect, useRef, useCallback } from "react";

// ── Detecta si estamos en prod (Render) o dev local ──────────────────────────
const API_BASE = process.env.NODE_ENV === "production" ? "" : "http://localhost:3001";

const REGIONS = [
  { id: "la2",  label: "LAS", host: "la2.api.riotgames.com",  regional: "americas" },
  { id: "la1",  label: "LAN", host: "la1.api.riotgames.com",  regional: "americas" },
  { id: "na1",  label: "NA",  host: "na1.api.riotgames.com",  regional: "americas" },
  { id: "br1",  label: "BR",  host: "br1.api.riotgames.com",  regional: "americas" },
  { id: "euw1", label: "EUW", host: "euw1.api.riotgames.com", regional: "europe"   },
  { id: "kr",   label: "KR",  host: "kr.api.riotgames.com",   regional: "asia"     },
];

// ── Traducciones LATAM ────────────────────────────────────────────────────────
const CHAMP_ES = {
  Ahri:"Ahri", Akali:"Akali", Amumu:"Amumu", Annie:"Annie", Aphelios:"Aphelios",
  Ashe:"Ashe", Bard:"Bardo", Blitzcrank:"Blitzcrank", Braum:"Braum", Caitlyn:"Caitlyn",
  Camille:"Camille", Cassiopeia:"Casiopea", Darius:"Darius", Diana:"Diana",
  DrMundo:"Dr. Mundo", Draven:"Draven", Ekko:"Ekko", Evelynn:"Evelynn", Ezreal:"Ezreal",
  Fiddlesticks:"Espantapájaros", Fiora:"Fiora", Galio:"Galio", Garen:"Garen",
  Gangplank:"Gangplank", Heimerdinger:"Heimerdinger", Illaoi:"Illaoi", Janna:"Janna",
  Jarvan:"Jarvan IV", Jax:"Jax", Jayce:"Jayce", Jinx:"Jinx", Kaisa:"Kai'Sa",
  Karma:"Karma", Kassadin:"Kassadin", Katarina:"Katarina", Kayle:"Kayle",
  Kha:"Kha'Zix", Kindred:"Kindred", Leblanc:"LeBlanc", Lee:"Lee Sin", Lillia:"Lillia",
  Lucian:"Lucian", Lulu:"Lulu", Lux:"Lux", Malzahar:"Malzahar", Maokai:"Maokai",
  MissFortune:"Miss Fortune", Mordekaiser:"Mordekaiser", Morgana:"Morgana",
  Nami:"Nami", Nautilus:"Náutilus", Nidalee:"Nidalee", Nilah:"Nilah",
  Nocturne:"Nocturno", Nunu:"Nunu", Olaf:"Olaf", Pantheon:"Panteón", Poppy:"Poppy",
  Qiyana:"Qiyana", Quinn:"Quinn", Riven:"Riven", Rumble:"Rumble", Ryze:"Ryze",
  Samira:"Samira", Sejuani:"Sejuani", Senna:"Senna", Seraphine:"Seraphine",
  Singed:"Singed", Sivir:"Sivir", Sona:"Sona", Soraka:"Soraka", Swain:"Swain",
  Syndra:"Syndra", Tahm:"Tahm Kench", Taliyah:"Taliyah", Taric:"Taric",
  Thresh:"Thresh", TwistedFate:"Destino Torcido", Twitch:"Twitch", Urgot:"Urgot",
  Vex:"Vex", Vi:"Vi", Viego:"Viego", Viktor:"Viktor", Vladimir:"Vladímir",
  Volibear:"Volibear", Warwick:"Warwick", Wukong:"Wukong", Xayah:"Xayah",
  Yasuo:"Yasuo", Yone:"Yone", Yorick:"Yorick", Yuumi:"Yuumi", Zac:"Zac", Zed:"Zed",
  Ziggs:"Ziggs", Zilean:"Zilean", Zoe:"Zoe", Zyra:"Zyra",
  // Set 14 Arcane
  Ambessa:"Ambessa", Aurora:"Aurora", Briar:"Briar", Gwen:"Gwen", Hwei:"Hwei",
  Kalista:"Kalista", Lissandra:"Lissandra", Mel:"Mel", Norra:"Norra", Smolder:"Smolder",
  Tristana:"Tristana", Zeri:"Zeri", Powder:"Powder", Renata:"Renata", Elise:"Elise",
  Silco:"Silco", Cho:"Cho'Gath", Sevika:"Sevika", Jinxlittle:"Powder",
};

const ITEM_ES = {
  TFT_Item_BFSword:"Espada BF", TFT_Item_ChainVest:"Chaleco de Malla",
  TFT_Item_NeedlesslyLargeRod:"Vara Enorme", TFT_Item_RecurveBow:"Arco Recurvado",
  TFT_Item_GiantsBelt:"Cinturón de Gigante", TFT_Item_SparringGloves:"Guantes de Entrenamiento",
  TFT_Item_Spatula:"Espátula", TFT_Item_TearOfTheGoddess:"Lágrima de la Diosa",
  TFT_Item_InfinityEdge:"Filo Infinito", TFT_Item_RabadonsDeathcap:"Caperuza Mortal",
  TFT_Item_Morellonomicon:"Morelonomicón", TFT_Item_JeweledGauntlet:"Guantelete Enjoyado",
  TFT_Item_GuardianAngel:"Ángel de la Guardia", TFT_Item_Warmogs:"Armadura de Warmog",
  TFT_Item_ThiefsGloves:"Guantes de Ladrón", TFT_Item_DragonsClaw:"Garra de Dragón",
  TFT_Item_IonicSpark:"Chispa Iónica", TFT_Item_Deathblade:"Hoja de la Muerte",
  TFT_Item_StatikkShiv:"Cuchilla Statikk", TFT_Item_GargoyleStoneplate:"Piedra de Gárgola",
  TFT_Item_SunfireCape:"Capa Solar", TFT_Item_BlueBuff:"Amuleto Azul",
  TFT_Item_RedBuff:"Amuleto Rojo", TFT_Item_BrambleVest:"Chaleco de Zarza",
  TFT_Item_FrozenHeart:"Corazón Helado", TFT_Item_Redemption:"Redención",
  TFT_Item_LocketOfTheIronSolari:"Medallón Solari", TFT_Item_Quicksilver:"Mercurio Veloz",
  TFT_Item_RunaansHurricane:"Huracán de Runaán", TFT_Item_SpearOfShojin:"Lanza de Shojin",
  TFT_Item_TitanicHydra:"Hidra Titánica", TFT_Item_KrakenSlayer:"Asesino de Kraken",
  TFT_Item_LastWhisper:"Último Susurro", TFT_Item_Bloodthirster:"Sanguinario",
  TFT_Item_HandOfJustice:"Mano de la Justicia", TFT_Item_SteraksGage:"Escudo de Sterak",
  TFT_Item_ZekesHerald:"Heraldo de Zeke", TFT_Item_ZzRotPortal:"Portal ZZ'Rot",
  TFT_Item_NegativeEdge:"Hoja Negativa",
};

const TIER_ES = {
  IRON:"Hierro", BRONZE:"Bronce", SILVER:"Plata", GOLD:"Oro",
  PLATINUM:"Platino", EMERALD:"Esmeralda", DIAMOND:"Diamante",
  MASTER:"Maestro", GRANDMASTER:"Gran Maestro", CHALLENGER:"Aspirante",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function champName(charId = "") {
  const base = charId.replace(/TFT\d+_/i, "").replace(/TFT_/i, "");
  return CHAMP_ES[base] || base.replace(/([A-Z])/g, " $1").trim() || "?";
}
function itemName(id = "") {
  const s = String(id);
  if (ITEM_ES[s]) return ITEM_ES[s];
  return s.replace(/TFT\d*_Item_/gi, "").replace(/TFT_/gi, "").replace(/([A-Z])/g, " $1").trim();
}
function traitDisplay(t = "") {
  return t.replace(/Set\d+_/gi, "").replace(/TFT\d*_/gi, "").replace(/([A-Z])/g, " $1").trim();
}
function rankStr(tier = "", rank = "", lp = 0) {
  const t = TIER_ES[tier?.toUpperCase()] || tier;
  const noRank = ["MASTER", "GRANDMASTER", "CHALLENGER"].includes(tier?.toUpperCase());
  return `${t}${!noRank && rank ? " " + rank : ""} ${lp}PL`;
}
function rankCol(tier = "") {
  const t = tier?.toUpperCase() || "";
  if (t === "CHALLENGER")   return "#ffd700";
  if (t === "GRANDMASTER")  return "#ff6b35";
  if (t === "MASTER")       return "#c084fc";
  if (t === "DIAMOND")      return "#38bdf8";
  if (t === "EMERALD")      return "#34d399";
  if (t === "PLATINUM")     return "#2dd4bf";
  if (t === "GOLD")         return "#fbbf24";
  if (t === "SILVER")       return "#94a3b8";
  return "#6b7280";
}
function fmtTime(s = 0) {
  return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}

const COST_COL = { 1:"#9e9e9e", 2:"#4caf50", 3:"#2196f3", 4:"#9c27b0", 5:"#ffd700" };

// ── API calls (sin CORS, van al backend propio) ───────────────────────────────
async function riotFetch(path, params = {}) {
  const qs = new URLSearchParams(params).toString();
  const url = `${API_BASE}/api/riot/${path}${qs ? "?" + qs : ""}`;
  const r = await fetch(url);
  const data = await r.json();
  if (!r.ok) throw new Error(data?.status?.message || `Error ${r.status}`);
  return data;
}

const api = {
  account: (name, tag) =>
    riotFetch(`americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`),
  summoner: (puuid, host) =>
    riotFetch(`${host}/tft/summoner/v1/summoners/by-puuid/${puuid}`),
  league: (sumId, host) =>
    riotFetch(`${host}/tft/league/v1/entries/by-summoner/${sumId}`),
  liveGame: (sumId, host) =>
    riotFetch(`${host}/lol/spectator/tft/v5/active-games/by-summoner/${sumId}`),
  matchIds: (puuid, regional, count = 5) =>
    riotFetch(`${regional}.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids`, { count }),
  match: (id, regional) =>
    riotFetch(`${regional}.api.riotgames.com/tft/match/v1/matches/${id}`),
};

// ── Claude AI ─────────────────────────────────────────────────────────────────
async function askClaude(ctx, question) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 900,
      system: `Eres un experto coach de TFT para LATAM. Das consejos CONCISOS y ACCIONABLES en español LATAM.
Máximo 4 párrafos cortos o una lista de bullets. Di exactamente qué hacer.
Usa nombres en español: Bardo (Bard), Panteón (Pantheon), Nocturno (Nocturne), etc.`,
      messages: [{ role: "user", content: `DATOS DEL JUGADOR:\n${ctx}\n\nPREGUNTA: ${question}` }],
    }),
  });
  const d = await r.json();
  return d.content?.[0]?.text || "Sin respuesta.";
}

// ── Componentes UI ────────────────────────────────────────────────────────────
function Pill({ c = "#6c63ff", children }) {
  return (
    <span style={{
      background: c + "1a", border: `1px solid ${c}44`, color: c,
      padding: "2px 7px", borderRadius: 4, fontSize: 9,
      fontFamily: "'Orbitron',monospace", letterSpacing: 0.5, whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function Stat({ label, value, accent = "#6c63ff", sub }) {
  return (
    <div style={{
      flex: 1, background: "#060619", border: `1px solid ${accent}22`,
      borderRadius: 8, padding: "7px 10px", textAlign: "center", minWidth: 0,
    }}>
      <div style={{ fontSize: 17, fontFamily: "'Orbitron',monospace", fontWeight: 700, color: accent, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
      <div style={{ fontSize: 7, color: "#303060", letterSpacing: 2, marginTop: 1 }}>{label}</div>
      {sub && <div style={{ fontSize: 7, color: accent + "99", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub}</div>}
    </div>
  );
}

function Champ({ charId = "", rarity, tier, itemNames = [], size = 46 }) {
  const name = champName(charId);
  const cost = rarity != null ? rarity + 1 : 1;
  const stars = tier || 1;
  const col = COST_COL[Math.min(cost, 5)] || "#fff";
  const items = (itemNames || []).map(i => itemName(i));
  return (
    <div title={`${name}\n${"★".repeat(stars)}\n${items.join(", ") || "Sin items"}`}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <div style={{
        width: size, height: size, borderRadius: 6,
        background: `linear-gradient(135deg,${col}33,${col}0a)`,
        border: `2px solid ${col}`, position: "relative",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `0 0 8px ${col}44`,
      }}>
        <span style={{ fontSize: Math.max(7, size * 0.16), color: "#fff", fontFamily: "'Orbitron',monospace", textAlign: "center", lineHeight: 1.1 }}>
          {name.slice(0, 4).toUpperCase()}
        </span>
        <span style={{ position: "absolute", bottom: 1, right: 2, fontSize: 6, color: "#ffd700" }}>{"★".repeat(Math.min(stars, 3))}</span>
        {items.length > 0 && <span style={{ position: "absolute", top: 1, left: 2, fontSize: 5, color: "#fffa" }}>{"⬡".repeat(Math.min(items.length, 3))}</span>}
      </div>
      <span style={{ fontSize: 6, color: col, fontFamily: "'Orbitron',monospace", maxWidth: size, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {name.slice(0, 7)}
      </span>
    </div>
  );
}

// ── App Principal ─────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]   = useState("setup");
  const [iName, setIName]     = useState("SpiderJuan");
  const [iTag, setITag]       = useState("LAS");
  const [regId, setRegId]     = useState("la2");
  const [status, setStatus]   = useState("");
  const [err, setErr]         = useState("");

  const [acct, setAcct]       = useState(null);
  const [league, setLeague]   = useState(null);
  const [live, setLive]       = useState(null);
  const [inGame, setInGame]   = useState(false);
  const [hist, setHist]       = useState([]);
  const [lastUp, setLastUp]   = useState(null);
  const [secAgo, setSecAgo]   = useState(0);
  const [pollN, setPollN]     = useState(0);

  const [tab, setTab]         = useState("coach");
  const [msgs, setMsgs]       = useState([]);
  const [inp, setInp]         = useState("");
  const [aiLoad, setAiLoad]   = useState(false);

  const pollRef   = useRef(null);
  const sumRef    = useRef(null);
  const regRef    = useRef(null);
  const acctRef   = useRef(null);
  const chatRef   = useRef(null);
  const leagueRef = useRef(null);
  const histRef   = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, aiLoad]);

  useEffect(() => {
    const t = setInterval(() => {
      if (lastUp) setSecAgo(Math.floor((Date.now() - lastUp) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, [lastUp]);

  const addMsg = useCallback((role, text) => setMsgs(p => [...p, { role, text, ts: Date.now() }]), []);

  const doLivePoll = useCallback(async () => {
    const s = sumRef.current, rd = regRef.current;
    if (!s || !rd) return;
    try {
      const g = await api.liveGame(s.id, rd.host);
      setLive(g);
      setInGame(true);
    } catch {
      setInGame(false);
      setLive(null);
    }
    setLastUp(Date.now());
    setSecAgo(0);
    setPollN(p => p + 1);
  }, []);

  const connect = async () => {
    if (!iName.trim()) return;
    setErr(""); setStatus("🔍 Buscando cuenta...");
    try {
      const a = await api.account(iName.trim(), iTag.trim() || "LAS");
      setAcct(a); acctRef.current = a;

      const rd = REGIONS.find(r => r.id === regId) || REGIONS[0];
      regRef.current = rd;
      setStatus("📋 Cargando invocador...");

      const s = await api.summoner(a.puuid, rd.host);
      sumRef.current = s;
      setStatus("🏆 Cargando rango...");

      let lg = null;
      try { const arr = await api.league(s.id, rd.host); lg = arr[0] || null; } catch {}
      setLeague(lg); leagueRef.current = lg;
      setStatus("📊 Cargando historial...");

      let h = [];
      try {
        const ids = await api.matchIds(a.puuid, rd.regional, 5);
        const res = await Promise.allSettled(ids.map(id => api.match(id, rd.regional)));
        h = res
          .filter(r => r.status === "fulfilled" && r.value)
          .map(r => {
            const p = r.value.info?.participants?.find(x => x.puuid === a.puuid);
            if (!p) return null;
            return {
              placement: p.placement, level: p.level, gold_left: p.gold_left,
              augments: (p.augments || []).map(x =>
                x.replace(/TFT\d*_Augment_/gi, "").replace(/([A-Z])/g, " $1").trim()
              ),
              traits: (p.traits || [])
                .filter(t => t.num_units >= (t.min_units || 1))
                .map(t => ({ name: traitDisplay(t.name), u: t.num_units })),
              units: (p.units || []).map(u => ({
                charId: u.character_id,
                name: champName(u.character_id),
                stars: u.tier,
                items: (u.itemNames || []).map(itemName),
              })),
            };
          })
          .filter(Boolean);
      } catch (he) { console.warn("historial:", he.message); }
      setHist(h); histRef.current = h;
      setStatus("🎮 Verificando partida activa...");

      let g = null, ig = false;
      try { g = await api.liveGame(s.id, rd.host); ig = true; } catch {}
      setLive(g); setInGame(ig); setLastUp(Date.now());

      clearInterval(pollRef.current);
      pollRef.current = setInterval(doLivePoll, 1000);

      setScreen("game"); setMsgs([]); setStatus("");

      const rk  = lg ? rankStr(lg.tier, lg.rank, lg.leaguePoints) : "Sin clasificar";
      const wr  = lg ? Math.round(lg.wins / (lg.wins + lg.losses) * 100) : 0;
      const avg = h.length ? (h.reduce((s, m) => s + m.placement, 0) / h.length).toFixed(1) : "?";

      setTimeout(() => addMsg("coach",
        `¡Bienvenido, **${a.gameName}#${a.tagLine}**! 🕷️\n\n` +
        `🏆 **Rango:** ${rk}  |  🎯 **WR:** ${wr}%\n` +
        `📊 **Promedio últimas ${h.length} partidas:** ${avg}° lugar\n\n` +
        `${ig
          ? "🟢 **¡Estás en partida!** Monitoreo activo cada segundo ⚡"
          : "⏳ Sin partida activa — la detectaré automáticamente en cuanto entres al TFT."
        }\n\n` +
        `Pregúntame lo que necesites para ganar.`
      ), 300);

    } catch (e) {
      setErr(`❌ ${e.message}`);
      setStatus("");
    }
  };

  const disconnect = () => {
    clearInterval(pollRef.current);
    setScreen("setup"); setAcct(null); setLeague(null);
    setLive(null); setInGame(false); setMsgs([]); setHist([]);
    sumRef.current = null; acctRef.current = null;
  };

  const send = async (q = inp.trim()) => {
    if (!q || aiLoad) return;
    setInp(""); addMsg("user", q); setAiLoad(true);
    const lg = leagueRef.current;
    const h  = histRef.current || [];
    const ctx = [
      `Jugador: ${acctRef.current?.gameName}#${acctRef.current?.tagLine}`,
      `Rango TFT: ${lg ? rankStr(lg.tier, lg.rank, lg.leaguePoints) : "Sin clasificar"}`,
      lg ? `W/L: ${lg.wins}V/${lg.losses}D (${Math.round(lg.wins / (lg.wins + lg.losses) * 100)}% WR)` : "",
      inGame && live
        ? `Partida activa: ${fmtTime(live.gameLength || 0)} jugados, ${live.participants?.length || "?"} jugadores`
        : "Sin partida activa",
      h.length ? `Últimas ${h.length} partidas: ${h.map(m => `${m.placement}°(Nv${m.level})`).join(", ")}` : "",
    ].filter(Boolean).join("\n");
    try {
      const r = await askClaude(ctx, q);
      addMsg("coach", r);
    } catch {
      addMsg("coach", "⚠️ Error al conectar con el coach. Revisa tu conexión.");
    }
    setAiLoad(false);
  };

  const QUICK = [
    "¿Hacer roll-down ahora?", "¿Qué vender?", "¿Subir nivel o guardar?",
    "¿Mi win condition?", "¿Qué items hacer?", "Consejo de posicionamiento",
  ];
  const BTNS = [
    { e:"🔄", l:"Analizar tablero",    q:"Analiza mi situación y dame los cambios más urgentes" },
    { e:"💰", l:"Gestión de oro",       q:"¿Cómo manejo el oro en este momento?" },
    { e:"📈", l:"¿Subir nivel?",        q:"¿Cuándo debo subir nivel dado mi economía?" },
    { e:"🎯", l:"Comp óptima",          q:"¿A qué composición debo apuntar con mis campeones?" },
    { e:"⚠️", l:"Estoy perdiendo",      q:"Tengo racha negativa y bajo HP. ¿Qué hago?" },
    { e:"🏆", l:"Top 4 → 1°",           q:"Estoy en top 4. ¿Cómo cierro en primer lugar?" },
    { e:"🔃", l:"¿Hacer reroll?",       q:"¿Vale la pena gastar oro en reroll ahora?" },
    { e:"⚔️", l:"Posicionamiento",      q:"Consejo de posicionamiento para mi comp actual" },
    { e:"🎒", l:"Items a construir",    q:"¿Qué items debo construir ahora mismo?" },
    { e:"📉", l:"Mejorar ranking",       q:"¿Qué debo mejorar para subir de rango según mi historial?" },
  ];

  // ── CSS global ──────────────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; }
    body { background: #03030e; }
    input, select, button { font-family: 'Rajdhani', sans-serif; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-thumb { background: #191940; border-radius: 3px; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.2} }
    @keyframes up { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    @keyframes mi { from{opacity:0;transform:translateY(3px)} to{opacity:1;transform:translateY(0)} }
    .card { animation: up .5s ease both; }
    .pl { animation: pulse 2s ease-in-out infinite; }
    .mi { animation: mi .2s ease both; }
    .dt { animation: pulse var(--d,1s) ease-in-out var(--dl,0s) infinite; }
    .cta { transition: all .2s; cursor: pointer; }
    .cta:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 0 28px #6c63ff55 !important; }
    .fi:focus { border-color: #6c63ff !important; }
    .tab { cursor:pointer; transition:color .15s; border:none; padding:10px 13px; background:none;
           font-family:'Orbitron',monospace; font-size:8px; letter-spacing:2px; white-space:nowrap; }
    .tab:hover { color: #8080ff !important; }
    .qb { transition:all .12s; cursor:pointer; background:#07071a; border:1px solid #111128;
          border-radius:18px; padding:4px 9px; color:#383878; font-size:11px; white-space:nowrap; }
    .qb:hover { border-color:#6c63ff !important; color:#b0b0ff !important; background:#6c63ff11 !important; }
    .sb { transition:all .15s; cursor:pointer; border:none; border-radius:9px; padding:10px 15px;
          font-family:'Orbitron',monospace; font-size:8px; font-weight:700; letter-spacing:2px; }
    .sb:hover:not(:disabled) { filter: brightness(1.2); }
    .pb { transition:all .12s; width:100%; background:#07071a; border:1px solid #0e0e26; border-radius:7px;
          padding:6px 8px; color:#383868; font-size:9px; cursor:pointer; text-align:left;
          display:flex; align-items:center; gap:6px; margin-bottom:4px; font-family:'Rajdhani',sans-serif; }
    .pb:hover { border-color:#6c63ff !important; color:#a0a0e8 !important; background:#6c63ff0c !important; }
  `;

  // ── SETUP ───────────────────────────────────────────────────────────────────
  if (screen === "setup") return (
    <div style={{ minHeight:"100vh", background:"#03030e", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <style>{css}</style>
      <div className="card" style={{
        width:"100%", maxWidth:420,
        background:"linear-gradient(145deg,#0b0b22,#060614)",
        border:"1px solid #151535", borderRadius:16, padding:30,
        boxShadow:"0 0 50px #6c63ff12, 0 20px 50px #00000099",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:-50, right:-50, width:200, height:200, background:"radial-gradient(circle,#6c63ff16,transparent 70%)", pointerEvents:"none" }}/>

        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontFamily:"'Orbitron',monospace", fontSize:22, fontWeight:900, background:"linear-gradient(90deg,#6c63ff,#00d4ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:4 }}>TFT COACH</div>
          <div style={{ color:"#202050", fontSize:8, letterSpacing:4, fontFamily:"'Orbitron',monospace", marginTop:4 }}>ASISTENTE EN TIEMPO REAL · LATAM</div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
          <div>
            <div style={{ color:"#282860", fontSize:8, letterSpacing:3, fontFamily:"'Orbitron',monospace", marginBottom:4 }}>RIOT ID</div>
            <div style={{ display:"flex", gap:6 }}>
              <input className="fi" value={iName} onChange={e => setIName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && connect()} placeholder="NombreJugador"
                style={{ flex:1, background:"#07071c", border:"1px solid #131330", borderRadius:8, padding:"10px 11px", color:"#c0c0ff", fontSize:14, outline:"none", transition:"border-color .2s" }}/>
              <input className="fi" value={iTag} onChange={e => setITag(e.target.value)} placeholder="LAS"
                style={{ width:60, background:"#07071c", border:"1px solid #131330", borderRadius:8, padding:"10px 8px", color:"#c0c0ff", fontSize:13, textAlign:"center", outline:"none", transition:"border-color .2s" }}/>
            </div>
          </div>

          <div>
            <div style={{ color:"#282860", fontSize:8, letterSpacing:3, fontFamily:"'Orbitron',monospace", marginBottom:4 }}>REGIÓN</div>
            <select value={regId} onChange={e => setRegId(e.target.value)}
              style={{ width:"100%", background:"#07071c", border:"1px solid #131330", borderRadius:8, padding:"10px 11px", color:"#c0c0ff", fontSize:13, outline:"none" }}>
              {REGIONS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </div>

          {status && !err && (
            <div style={{ textAlign:"center", color:"#4040a0", fontSize:10, fontFamily:"'Orbitron',monospace", letterSpacing:1 }}>{status}</div>
          )}
          {err && (
            <div style={{ background:"#1a0808", border:"1px solid #ff444430", borderRadius:8, padding:"9px 11px", color:"#ff8080", fontSize:11, lineHeight:1.5 }}>{err}</div>
          )}

          <button className="cta" onClick={connect} disabled={!iName.trim() || !!status}
            style={{
              background: iName.trim() && !status ? "linear-gradient(135deg,#6c63ff,#00d4ff)" : "#0f0f28",
              border:"none", borderRadius:10, padding:13,
              color: iName.trim() && !status ? "#fff" : "#202048",
              fontSize:10, fontFamily:"'Orbitron',monospace", fontWeight:700, letterSpacing:3,
              boxShadow: iName.trim() ? "0 0 16px #6c63ff2a" : "none",
              cursor: iName.trim() && !status ? "pointer" : "default", marginTop:2,
            }}>
            {status || "CONECTAR CON RIOT"}
          </button>
        </div>
      </div>
    </div>
  );

  // ── GAME ────────────────────────────────────────────────────────────────────
  const rc   = rankCol(league?.tier || "");
  const parts = live?.participants || [];

  return (
    <div style={{ height:"100vh", background:"#03030e", display:"flex", flexDirection:"column", fontFamily:"'Rajdhani',sans-serif", color:"#e0e0ff", overflow:"hidden" }}>
      <style>{css}</style>

      {/* TOPBAR */}
      <div style={{ background:"#050513", borderBottom:"1px solid #0c0c25", padding:"6px 13px", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
        <span style={{ fontFamily:"'Orbitron',monospace", fontSize:11, fontWeight:900, background:"linear-gradient(90deg,#6c63ff,#00d4ff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:3 }}>TFT COACH</span>
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <div className={inGame ? "pl" : ""} style={{ width:6, height:6, borderRadius:"50%", background: inGame ? "#00ff88" : "#2a2a55" }}/>
          <span style={{ fontSize:7, color: inGame ? "#00ff88" : "#2a2a55", fontFamily:"'Orbitron',monospace", letterSpacing:1 }}>
            {inGame ? "EN PARTIDA" : "SIN PARTIDA"}
          </span>
        </div>
        {lastUp && <span style={{ fontSize:7, color:"#181840", fontFamily:"'Orbitron',monospace" }}>hace {secAgo}s · #{pollN}</span>}
        <div style={{ flex:1 }}/>
        {league && <Pill c={rc}>{rankStr(league.tier, league.rank, league.leaguePoints)}</Pill>}
        <span style={{ fontSize:10, color:"#38387a", fontFamily:"'Orbitron',monospace" }}>{acct?.gameName}#{acct?.tagLine}</span>
        <button onClick={disconnect} style={{ background:"none", border:"1px solid #141435", borderRadius:5, color:"#252560", fontSize:7, fontFamily:"'Orbitron',monospace", padding:"3px 7px", cursor:"pointer", letterSpacing:1 }}>SALIR</button>
      </div>

      <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

        {/* PANEL IZQUIERDO */}
        <div style={{ width:200, background:"#040411", borderRight:"1px solid #0c0c24", overflow:"auto", padding:9, flexShrink:0, display:"flex", flexDirection:"column", gap:9 }}>
          <div style={{ fontSize:7, color:"#1c1c48", fontFamily:"'Orbitron',monospace", letterSpacing:2, borderBottom:"1px solid #0a0a20", paddingBottom:5 }}>JUGADOR</div>
          <div style={{ display:"flex", gap:5 }}>
            <Stat label="RANGO" value={TIER_ES[league?.tier?.toUpperCase()]?.slice(0,3)||"—"} accent={rc} sub={league ? `${league.leaguePoints}PL` : ""}/>
            <Stat label="WIN%" value={league ? `${Math.round(league.wins/(league.wins+league.losses)*100)}%` : "—"} accent="#34d399"/>
          </div>
          <div style={{ display:"flex", gap:5 }}>
            <Stat label="GANADAS"  value={league?.wins   ?? "—"} accent="#6c63ff"/>
            <Stat label="PERDIDAS" value={league?.losses  ?? "—"} accent="#f87171"/>
          </div>

          {inGame && live && (<>
            <div style={{ fontSize:7, color:"#1c1c48", fontFamily:"'Orbitron',monospace", letterSpacing:2, borderBottom:"1px solid #0a0a20", paddingBottom:5, marginTop:3 }}>PARTIDA EN VIVO</div>
            <div style={{ display:"flex", gap:5 }}>
              <Stat label="TIEMPO"    value={fmtTime(live.gameLength || 0)} accent="#38bdf8"/>
              <Stat label="JUGADORES" value={parts.length}                  accent="#fbbf24"/>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
              {parts.slice(0, 8).map((p, i) => {
                const me = p.puuid === acct?.puuid;
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:5, padding:"3px 6px", background: me?"#6c63ff0a":"transparent", border: me?"1px solid #6c63ff1a":"1px solid transparent", borderRadius:4 }}>
                    <span style={{ width:9, fontSize:7, color:"#1e1e50", fontFamily:"'Orbitron',monospace" }}>{i+1}</span>
                    <span style={{ flex:1, fontSize:9, color: me?"#8080e0":"#383868", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                      {(p.riotId || p.summonerName || `J${i+1}`).split("#")[0]}{me && " ◀"}
                    </span>
                  </div>
                );
              })}
            </div>
          </>)}

          {!inGame && (
            <div style={{ background:"#05051a", borderRadius:7, border:"1px solid #0c0c26", padding:9, textAlign:"center" }}>
              <div style={{ fontSize:8, color:"#1c1c48", fontFamily:"'Orbitron',monospace", lineHeight:1.9 }}>
                Sin partida activa<br/><span style={{ color:"#141440", fontSize:7 }}>Se detectará automáticamente</span>
              </div>
            </div>
          )}

          {hist.length > 0 && (<>
            <div style={{ fontSize:7, color:"#1c1c48", fontFamily:"'Orbitron',monospace", letterSpacing:2, borderBottom:"1px solid #0a0a20", paddingBottom:5, marginTop:3 }}>ÚLTIMAS PARTIDAS</div>
            {hist.slice(0, 5).map((m, i) => {
              const c = m.placement<=2?"#34d399":m.placement<=4?"#fbbf24":m.placement<=6?"#f97316":"#f87171";
              return (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:6, padding:"3px 0", borderBottom:"1px solid #08081e" }}>
                  <div style={{ width:20, height:20, borderRadius:4, background:c+"22", border:`1px solid ${c}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:c, fontFamily:"'Orbitron',monospace", flexShrink:0 }}>{m.placement}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:8, color:"#383870" }}>Nv.{m.level}</div>
                    <div style={{ fontSize:7, color:"#202050", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{m.units.slice(0,3).map(u=>u.name).join(", ")}</div>
                  </div>
                </div>
              );
            })}
          </>)}
        </div>

        {/* CENTRO */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0 }}>
          {/* Tabs */}
          <div style={{ background:"#040411", borderBottom:"1px solid #0c0c24", display:"flex", padding:"0 10px", flexShrink:0 }}>
            {[{id:"coach",l:"⚡ COACH IA"},{id:"partida",l:"🗺 PARTIDA"},{id:"historial",l:"📊 HISTORIAL"}].map(t => (
              <button key={t.id} className="tab" onClick={() => setTab(t.id)}
                style={{ color: tab===t.id?"#7070f0":"#282860", borderBottom: tab===t.id?"2px solid #6c63ff":"2px solid transparent", marginBottom:-1 }}>
                {t.l}
              </button>
            ))}
          </div>

          {/* COACH */}
          {tab === "coach" && (
            <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
              <div ref={chatRef} style={{ flex:1, overflow:"auto", padding:"12px 14px 6px" }}>
                {msgs.map((m, i) => (
                  <div key={i} className="mi" style={{ marginBottom:10, display:"flex", flexDirection:m.role==="user"?"row-reverse":"row", gap:6, alignItems:"flex-start" }}>
                    {m.role !== "user" && (
                      <div style={{ width:26, height:26, borderRadius:6, background:"linear-gradient(135deg,#6c63ff,#00d4ff)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0 }}>⚡</div>
                    )}
                    <div style={{
                      maxWidth:"78%", background:m.role==="user"?"#0e0e2c":"#08101e",
                      border:`1px solid ${m.role==="user"?"#1a1a42":"#6c63ff18"}`,
                      borderRadius:m.role==="user"?"9px 9px 2px 9px":"2px 9px 9px 9px",
                      padding:"8px 11px", fontSize:13, lineHeight:1.65, color:"#c0c0f0", whiteSpace:"pre-wrap",
                    }}>
                      {m.role==="coach" && <div style={{ fontSize:6, color:"#6c63ff", fontFamily:"'Orbitron',monospace", letterSpacing:2, marginBottom:4 }}>COACH IA</div>}
                      {m.text}
                    </div>
                  </div>
                ))}
                {aiLoad && (
                  <div style={{ display:"flex", gap:6, alignItems:"flex-start", marginBottom:10 }}>
                    <div style={{ width:26, height:26, borderRadius:6, background:"linear-gradient(135deg,#6c63ff,#00d4ff)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12 }}>⚡</div>
                    <div style={{ background:"#08101e", border:"1px solid #6c63ff18", borderRadius:"2px 9px 9px 9px", padding:"10px 13px", display:"flex", gap:4 }}>
                      {[0,1,2].map(d => <div key={d} className="dt" style={{"--dl":`${d*0.2}s`, width:5, height:5, borderRadius:"50%", background:"#6c63ff"}}/>)}
                    </div>
                  </div>
                )}
              </div>
              <div style={{ padding:"4px 10px", borderTop:"1px solid #090920", display:"flex", gap:4, flexWrap:"wrap" }}>
                {QUICK.map(q => <button key={q} className="qb" onClick={() => send(q)}>{q}</button>)}
              </div>
              <div style={{ padding:"7px 10px 10px", display:"flex", gap:6 }}>
                <input value={inp} onChange={e => setInp(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && !e.shiftKey && send()}
                  placeholder="Pregunta al coach..."
                  style={{ flex:1, background:"#05051a", border:"1px solid #0e0e2c", borderRadius:8, padding:"9px 11px", color:"#c0c0ff", fontSize:13, outline:"none", transition:"border-color .2s" }}
                  onFocus={e => e.target.style.borderColor="#6c63ff"}
                  onBlur={e  => e.target.style.borderColor="#0e0e2c"}/>
                <button className="sb" onClick={() => send()} disabled={!inp.trim() || aiLoad}
                  style={{ background:inp.trim()?"linear-gradient(135deg,#6c63ff,#00d4ff)":"#0a0a20", color:inp.trim()?"#fff":"#1a1a48" }}>
                  ENVIAR
                </button>
              </div>
            </div>
          )}

          {/* PARTIDA */}
          {tab === "partida" && (
            <div style={{ flex:1, overflow:"auto", padding:14 }}>
              {inGame && live ? (<>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:14 }}>
                  <div className="pl" style={{ width:7, height:7, borderRadius:"50%", background:"#00ff88" }}/>
                  <span style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:"#00ff88", letterSpacing:2 }}>EN PARTIDA — {fmtTime(live.gameLength || 0)}</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:7 }}>
                  {parts.map((p, i) => {
                    const me = p.puuid === acct?.puuid;
                    return (
                      <div key={i} style={{ background:me?"#6c63ff09":"#06061a", border:`1px solid ${me?"#6c63ff2a":"#0d0d26"}`, borderRadius:8, padding:"9px 11px" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <span style={{ fontSize:11, color:me?"#8888e8":"#40406a", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:110 }}>
                            {(p.riotId || p.summonerName || `J${i+1}`).split("#")[0]}{me && " 🎯"}
                          </span>
                          <span style={{ fontSize:7, color:"#202055", fontFamily:"'Orbitron',monospace" }}>#{i+1}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>) : (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100%", gap:10 }}>
                  <div style={{ fontSize:32, opacity:.15 }}>🎮</div>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:9, color:"#1c1c48", letterSpacing:2, textAlign:"center" }}>
                    SIN PARTIDA ACTIVA<br/><span style={{ fontSize:7, color:"#141440" }}>Polling cada 1 segundo</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HISTORIAL */}
          {tab === "historial" && (
            <div style={{ flex:1, overflow:"auto", padding:14 }}>
              {hist.length > 0 ? (
                <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:7, color:"#202055", letterSpacing:2, marginBottom:2 }}>ÚLTIMAS {hist.length} PARTIDAS RANKED TFT</div>
                  {hist.map((m, i) => {
                    const c = m.placement<=2?"#34d399":m.placement<=4?"#fbbf24":m.placement<=6?"#f97316":"#f87171";
                    return (
                      <div key={i} style={{ background:"#06061a", border:`1px solid ${c}18`, borderRadius:9, padding:"11px 13px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:9 }}>
                          <div style={{ width:36, height:36, borderRadius:7, background:c+"1a", border:`2px solid ${c}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:900, color:c, fontFamily:"'Orbitron',monospace", flexShrink:0 }}>{m.placement}</div>
                          <div>
                            <div style={{ fontSize:10, color:"#505090" }}>Nivel {m.level}{m.gold_left > 0 ? ` · ${m.gold_left}💰` : ""}</div>
                            {m.augments?.length > 0 && (
                              <div style={{ display:"flex", gap:3, flexWrap:"wrap", marginTop:3 }}>
                                {m.augments.slice(0,3).map((a, j) => <Pill key={j} c="#fbbf24">{a.slice(0,18)}</Pill>)}
                              </div>
                            )}
                          </div>
                        </div>
                        {m.traits?.length > 0 && (
                          <div style={{ display:"flex", gap:3, flexWrap:"wrap", marginBottom:7 }}>
                            {m.traits.slice(0,5).map((t, j) => (
                              <div key={j} style={{ background:"#6c63ff12", border:"1px solid #6c63ff20", borderRadius:4, padding:"1px 5px", fontSize:7, color:"#606098", fontFamily:"'Orbitron',monospace" }}>
                                {t.name} {t.u}
                              </div>
                            ))}
                          </div>
                        )}
                        {m.units?.length > 0 && (
                          <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
                            {m.units.slice(0,8).map((u, j) => <Champ key={j} charId={u.charId} tier={u.stars} itemNames={[]} size={38}/>)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100%", color:"#1a1a48", fontFamily:"'Orbitron',monospace", fontSize:9, letterSpacing:2 }}>SIN HISTORIAL DISPONIBLE</div>
              )}
            </div>
          )}
        </div>

        {/* PANEL DERECHO */}
        <div style={{ width:168, background:"#040411", borderLeft:"1px solid #0c0c24", overflow:"auto", padding:9, flexShrink:0 }}>
          <div style={{ fontSize:7, color:"#1c1c48", fontFamily:"'Orbitron',monospace", letterSpacing:2, borderBottom:"1px solid #0a0a20", paddingBottom:6, marginBottom:8 }}>PREGUNTAS RÁPIDAS</div>
          {BTNS.map(({ e, l, q }) => (
            <button key={l} className="pb" onClick={() => { setTab("coach"); send(q); }}>
              <span style={{ fontSize:11 }}>{e}</span>
              <span style={{ lineHeight:1.3 }}>{l}</span>
            </button>
          ))}
          <div style={{ marginTop:10, background:"#05051a", borderRadius:7, border:"1px solid #0b0b24", padding:8 }}>
            <div style={{ fontSize:7, color:"#181848", fontFamily:"'Orbitron',monospace", letterSpacing:1, marginBottom:4 }}>ESTADO API</div>
            <div style={{ fontSize:7, color: inGame?"#34d399":"#282868", lineHeight:2 }}>
              {inGame ? "🟢 Partida detectada" : "⭕ Sin partida"}<br/>
              <span style={{ color:"#181848" }}>Polling: 1s</span><br/>
              <span style={{ color:"#181848" }}>spectator-tft-v5</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
