/* Ringco admin dashboard — Firebase email/password auth + live leads.
   ------------------------------------------------------------------
   What this shows once Firebase is connected:
     • KPI cards (total, new, last-7-days, top requested service)
     • A live, searchable, filterable list of every enquiry submitted
       through the website contact form (the `leads` collection)
     • One-click status tracking: New → Contacted → Closed
     • (Optional) an embedded Google Analytics / Looker Studio report

   SETUP
   1) FIREBASE_CONFIG is generated at deploy by build-config.js from the
      project's NEXT_PUBLIC_FIREBASE_* Vercel env vars. Locally (no build)
      the import fails and the page shows the setup guide.
   2) Firebase console → Authentication → enable Email/Password + Add user.
   3) Firestore → Rules: publish /firestore.rules.
   4) LOOKER_EMBED_URL (optional) — Looker Studio → Share → Embed report →
      copy the iframe src. Leave "" to hide the analytics panel entirely.
   Access is granted only when the signed-in account also has a /users doc
   with role == "admin" and status == "active".
   ------------------------------------------------------------------ */

let FIREBASE_CONFIG = {};
try {
  const mod = await import("/js/firebase-config.js");
  FIREBASE_CONFIG = (mod && mod.FIREBASE_CONFIG) || {};
} catch (_) { /* not generated yet (e.g. local preview) */ }

const LOOKER_EMBED_URL = ""; // optional: paste your Looker Studio embed URL
const GOOGLE_CLIENT_ID = ""; // optional: OAuth client ID for the Google-reviews tab
                             // (Google Cloud → Credentials → OAuth client ID, type "Web application")

const SDK = "https://www.gstatic.com/firebasejs/10.12.0";
const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const el = (id) => document.getElementById(id);
const gate = el("admin-gate"), dash = el("admin-dash"),
  live = el("admin-live"), setup = el("admin-setup"),
  gaPanel = el("ga-panel"), frame = el("looker-frame"),
  form = el("gate-form"), emailInput = el("gate-email"), passInput = el("gate-pass"),
  err = el("gate-err"), signout = el("admin-signout"),
  listEl = el("lead-list"), loadingEl = el("lead-loading"),
  emptyEl = el("lead-empty"), noneEl = el("lead-none"),
  searchEl = el("lead-search"), filterEl = el("lead-filter"),
  serviceSel = el("lead-service-filter"),
  fromEl = el("lead-from"), toEl = el("lead-to"), dateClearEl = el("lead-date-clear");

/* ---------- dark mode ---------- */
(function theme() {
  const btn = el("theme-toggle"), ico = el("tt-ico");
  if (!btn) return;
  const apply = (t) => {
    document.documentElement.dataset.theme = t === "dark" ? "dark" : "";
    if (ico) ico.textContent = t === "dark" ? "☀️" : "🌙";
    try { localStorage.setItem("ringco-theme", t); } catch (_) {}
  };
  if (ico && document.documentElement.dataset.theme === "dark") ico.textContent = "☀️";
  btn.addEventListener("click", () =>
    apply(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
})();

/* ---------- dashboard tabs ---------- */
const tabsNav = el("dash-tabs");
function switchTab(name) {
  if (!tabsNav) return;
  tabsNav.querySelectorAll("button[data-tab]").forEach((b) => {
    const on = b.dataset.tab === name;
    b.classList.toggle("on", on);
    b.setAttribute("aria-selected", on ? "true" : "false");
  });
  document.querySelectorAll(".dash-tab").forEach((p) =>
    p.classList.toggle("on", p.id === "tab-" + name));
}
if (tabsNav) {
  tabsNav.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-tab]");
    if (b) switchTab(b.dataset.tab);
  });
}

/* modules (storm center) can subscribe to lead-snapshot changes */
const leadsChangedHooks = [];
/* fired once a signed-in admin's dashboard is shown — lets the storm
   center reconcile the public banner with its restored toggle state */
const adminReadyHooks = [];

/* ---------- screen switching ---------- */
function showGate() {
  dash.hidden = true; live.hidden = true; signout.hidden = true; gate.hidden = false;
}
function showSetupOnly() {
  // Firebase not configured — reveal the setup guide, no auth possible.
  gate.hidden = true; dash.hidden = false; live.hidden = true;
  setup.hidden = false; signout.hidden = true;
}
function showDashboard() {
  gate.hidden = true; dash.hidden = false;
  setup.hidden = true; live.hidden = false; signout.hidden = false;
  if (LOOKER_EMBED_URL && frame && gaPanel) {
    frame.src = LOOKER_EMBED_URL;
    gaPanel.hidden = false;
  }
}

function friendly(code) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found": return "Wrong email or password.";
    case "auth/invalid-email": return "Enter a valid email address.";
    case "auth/too-many-requests": return "Too many attempts — try again in a few minutes.";
    case "auth/network-request-failed": return "Network error — check your connection.";
    default: return "Sign-in failed. Please try again.";
  }
}

/* ---------- leads rendering ---------- */
const STATUSES = ["new", "contacted", "closed"];
const STATUS_LABEL = { new: "New", contacted: "Contacted", closed: "Closed" };
const NEXT_STATUS = { new: "contacted", contacted: "closed", closed: "new" };

let allLeads = [];        // full snapshot (newest first)
let curFilter = "all";
let curSearch = "";
let curService = "all";
let curFrom = null;       // Date | null — calendar range filter
let curTo = null;
let updateStatusFn = null;  // set once Firestore is wired
let publishBannerFn = null; // set once Firestore is wired — syncs the public storm banner

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function fmtDate(d) {
  if (!d) return "Just now";
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (sameDay) return "Today · " + time;
  const yest = new Date(now); yest.setDate(now.getDate() - 1);
  if (d.toDateString() === yest.toDateString()) return "Yesterday · " + time;
  return d.toLocaleDateString([], { month: "short", day: "numeric" }) + " · " + time;
}

/* animated count-up — eases a KPI from its previous value to the new one */
function setNum(id, val) {
  const e = el(id);
  if (!e) return;
  const prev = Number(e.dataset.v || 0);
  e.dataset.v = val;
  // rAF doesn't fire in hidden tabs — set directly so values never go stale
  if (REDUCE || document.hidden || val === prev || val == null) { e.textContent = val; return; }
  const t0 = performance.now(), dur = 650, delta = val - prev;
  const step = (t) => {
    const p = Math.min((t - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    e.textContent = Math.round(prev + delta * eased);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function renderKPIs() {
  const now = Date.now();
  const weekAgo = now - 7 * 864e5;
  const total = allLeads.length;
  const news = allLeads.filter((l) => l.status === "new").length;
  const week = allLeads.filter((l) => l.ts && l.ts.getTime() >= weekAgo).length;

  const counts = {};
  allLeads.forEach((l) => { if (l.service) counts[l.service] = (counts[l.service] || 0) + 1; });
  let top = "—";
  let max = 0;
  Object.keys(counts).forEach((k) => { if (counts[k] > max) { max = counts[k]; top = k; } });
  // trim long service labels for the card
  if (top.length > 22) top = top.slice(0, 21) + "…";

  setNum("kpi-total", total);
  setNum("kpi-new", news);
  setNum("kpi-week", week);
  el("kpi-service").textContent = total ? top : "—";
}

/* keep the service dropdown in sync with the services actually seen in leads */
function syncServiceOptions() {
  if (!serviceSel) return;
  const seen = [...new Set(allLeads.map((l) => l.service).filter(Boolean))].sort();
  const want = "all," + seen.join(",");
  if (serviceSel.dataset.opts === want) return; // unchanged — don't rebuild
  serviceSel.dataset.opts = want;
  const keep = curService;
  serviceSel.innerHTML = '<option value="all">All services</option>' +
    seen.map((s) => '<option value="' + esc(s) + '">' + esc(s) + "</option>").join("");
  serviceSel.value = seen.includes(keep) ? keep : "all";
  curService = serviceSel.value;
}

function visibleLeads() {
  const q = curSearch.trim().toLowerCase();
  return allLeads.filter((l) => {
    if (curFilter !== "all" && l.status !== curFilter) return false;
    if (curService !== "all" && l.service !== curService) return false;
    if (curFrom && (!l.ts || l.ts < curFrom)) return false;
    if (curTo && (!l.ts || l.ts > curTo)) return false;
    if (!q) return true;
    return (l.name + " " + l.phone + " " + l.email + " " + l.city + " " + l.service + " " + l.message)
      .toLowerCase().includes(q);
  });
}

function leadRow(l) {
  const row = document.createElement("article");
  row.className = "lead-row";
  row.dataset.status = l.status;

  const tel = l.phone ? '<a href="tel:' + esc(l.phone.replace(/[^\d+]/g, "")) + '">' + esc(l.phone) + "</a>" : "";
  const mail = l.email ? '<a href="mailto:' + esc(l.email) + '">' + esc(l.email) + "</a>" : "";
  const contacts = [tel, mail].filter(Boolean).join('<span class="dot">·</span>');

  row.innerHTML =
    '<div class="lead-when">' + esc(fmtDate(l.ts)) + "</div>" +
    '<div class="lead-body">' +
      '<div class="lead-name">' + esc(l.name || "(no name)") +
        ' <span class="lead-badge ' + l.status + '">' + STATUS_LABEL[l.status] + "</span></div>" +
      (contacts ? '<div class="lead-contacts">' + contacts + "</div>" : "") +
      ((l.service || l.city)
        ? '<div class="lead-tags">' +
          (l.service ? '<span class="lead-service">' + esc(l.service) + "</span>" : "") +
          (l.city ? '<span class="lead-city">📍 ' + esc(l.city) + "</span>" : "") +
          "</div>"
        : "") +
      (l.message ? '<p class="lead-msg">' + esc(l.message) + "</p>" : "") +
    "</div>" +
    '<div class="lead-actions">' +
      '<button type="button" class="lead-advance" data-id="' + esc(l.id) + '">' +
        "Mark " + STATUS_LABEL[NEXT_STATUS[l.status]] +
      "</button>" +
    "</div>";

  return row;
}

function renderList(animate = true) {
  renderKPIs();
  syncServiceOptions();
  const rows = visibleLeads();
  listEl.innerHTML = "";

  loadingEl.hidden = true;
  const noLeadsAtAll = allLeads.length === 0;
  emptyEl.hidden = !noLeadsAtAll;
  noneEl.hidden = noLeadsAtAll || rows.length > 0;

  const frag = document.createDocumentFragment();
  rows.forEach((l, i) => {
    const r = leadRow(l);
    if (animate && !REDUCE && i < 12) { // stagger the first screenful in
      r.classList.add("anim");
      r.style.animationDelay = (i * 0.045) + "s";
    }
    frag.appendChild(r);
  });
  listEl.appendChild(frag);

  leadsChangedHooks.forEach((f) => { try { f(); } catch (_) {} });
}

/* ---------- boot ---------- */
const configured = FIREBASE_CONFIG && FIREBASE_CONFIG.apiKey;

if (!configured) {
  showSetupOnly();
} else {
  (async function () {
    const [{ initializeApp }, authMod, fsMod] = await Promise.all([
      import(SDK + "/firebase-app.js"),
      import(SDK + "/firebase-auth.js"),
      import(SDK + "/firebase-firestore.js"),
    ]);
    const { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } = authMod;
    const {
      getFirestore, collection, query, where, orderBy, onSnapshot,
      getDocs, doc, updateDoc, setDoc, serverTimestamp,
    } = fsMod;

    const app = initializeApp(FIREBASE_CONFIG);
    const auth = getAuth(app);
    const db = getFirestore(app);

    let leadsUnsub = null;

    // throws on Firestore errors (e.g. rules) so the caller can explain
    async function isActiveAdmin(user) {
      const q = query(collection(db, "users"), where("email", "==", user.email));
      const snap = await getDocs(q);
      let ok = false;
      snap.forEach((d) => {
        const u = d.data();
        if (u.role === "admin" && (u.status === "active" || u.status === undefined)) ok = true;
      });
      return ok;
    }

    // live subscription to the leads collection (newest first)
    function startLeads() {
      if (leadsUnsub) return;
      const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      leadsUnsub = onSnapshot(q, (snap) => {
        allLeads = snap.docs.map((d) => {
          const v = d.data() || {};
          const ts = v.createdAt && v.createdAt.toDate ? v.createdAt.toDate() : null;
          return {
            id: d.id,
            name: v.name || "", phone: v.phone || "", email: v.email || "",
            city: v.city || "", service: v.service || "", message: v.message || "",
            status: STATUSES.includes(v.status) ? v.status : "new",
            ts,
          };
        });
        renderList();
      }, (e) => {
        loadingEl.textContent = "Couldn't load leads — check the Firestore rules are published.";
        loadingEl.hidden = false;
      });
    }
    function stopLeads() { if (leadsUnsub) { leadsUnsub(); leadsUnsub = null; } allLeads = []; }

    updateStatusFn = async function (id, status) {
      try {
        await updateDoc(doc(db, "leads", id), { status, updatedAt: serverTimestamp() });
      } catch (_) { /* onSnapshot will resync; ignore transient errors */ }
    };

    // Publishes (or clears) the public-site "recent storm" banner.
    // Called from the Storm center when "Match leads" toggles change.
    // Returns true on success so the caller can confirm / warn the admin.
    publishBannerFn = async function (storm) {
      try {
        await setDoc(doc(db, "settings", "stormBanner"), storm ? {
          enabled: true,
          event: storm.event || "Severe storm",
          onset: storm.onset || "",
          areas: storm.areas || "",
          updatedAt: serverTimestamp(),
        } : { enabled: false, updatedAt: serverTimestamp() });
        return true;
      } catch (_) {
        return false; // signed out, or /settings rules not published yet
      }
    };

    onAuthStateChanged(auth, async (user) => {
      if (!user) { stopLeads(); showGate(); return; }
      try {
        if (await isActiveAdmin(user)) {
          showDashboard(); startLeads();
          // now signed in — let the storm center push its restored toggle
          // state to the public banner (self-heals a failed earlier write)
          adminReadyHooks.forEach((f) => { try { f(); } catch (_) {} });
        }
        else { err.textContent = "This account isn't an authorized admin."; await signOut(auth); showGate(); }
      } catch (e) {
        err.textContent = "Couldn't verify admin access — check the Firestore rules.";
        await signOut(auth); showGate();
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      err.textContent = "";
      const email = emailInput.value.trim(), pass = passInput.value;
      if (!email || !pass) return;
      const btn = form.querySelector("button[type=submit]");
      btn.disabled = true;
      try {
        await signInWithEmailAndPassword(auth, email, pass);
        // onAuthStateChanged completes the flow (role check → dashboard)
      } catch (e2) {
        err.textContent = friendly(e2 && e2.code);
      } finally {
        btn.disabled = false;
      }
    });

    signout.addEventListener("click", () => signOut(auth));
  })().catch(() => {
    err.textContent = "Couldn't load sign-in. Check your Firebase config.";
    showGate();
  });
}

/* ---------- dashboard interactions (work regardless of Firestore load order) ---------- */
if (filterEl) {
  filterEl.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-f]");
    if (!b) return;
    curFilter = b.dataset.f;
    filterEl.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
    renderList();
  });
}
if (searchEl) {
  // no re-animation while typing — it would flicker on every keystroke
  searchEl.addEventListener("input", () => { curSearch = searchEl.value; renderList(false); });
}
if (serviceSel) {
  serviceSel.addEventListener("change", () => { curService = serviceSel.value; renderList(); });
}
function syncDateFilter() {
  curFrom = fromEl && fromEl.value ? new Date(fromEl.value + "T00:00:00") : null;
  curTo = toEl && toEl.value ? new Date(toEl.value + "T23:59:59.999") : null;
  if (dateClearEl) dateClearEl.hidden = !(curFrom || curTo);
  renderList();
}
if (fromEl) fromEl.addEventListener("change", syncDateFilter);
if (toEl) toEl.addEventListener("change", syncDateFilter);
if (dateClearEl) {
  dateClearEl.addEventListener("click", () => {
    if (fromEl) fromEl.value = "";
    if (toEl) toEl.value = "";
    syncDateFilter();
  });
}
if (listEl) {
  listEl.addEventListener("click", (e) => {
    const b = e.target.closest(".lead-advance");
    if (!b) return;
    const id = b.dataset.id;
    const lead = allLeads.find((l) => l.id === id);
    if (!lead || !updateStatusFn) return;
    const next = NEXT_STATUS[lead.status];
    // optimistic UI; snapshot will confirm
    lead.status = next;
    renderList(false);
    updateStatusFn(id, next);
  });
}

/* ============================================================
   STORM CENTER — live + historical NWS severe weather for the
   OKC metro, CSV/print report extraction, and lead matching
   (which clients sit inside an active alert area).
   api.weather.gov is public, CORS-enabled, no key needed.
   ============================================================ */
(function stormCenter() {
  const $list = el("storm-list"), $loading = el("storm-loading"),
    $empty = el("storm-empty"), $error = el("storm-error"),
    $areas = el("storm-areas"), $range = el("storm-range"),
    $badge = el("storm-badge"), $ribbon = el("admin-storm"),
    $leadsPanel = el("storm-leads-panel"), $leadsList = el("storm-leads-list"),
    $cardActive = el("storm-card-active");
  if (!$list || !$range) return;

  const NWS = "https://api.weather.gov";
  const RELEVANT = /(Tornado|Severe Thunderstorm|High Wind|Wind Advisory|Extreme Wind|Hail|Flash Flood|Flood Warning|Winter Storm|Ice Storm|Blizzard)/i;
  const METRO_COUNTIES = ["Oklahoma", "Cleveland", "Canadian", "Pottawatomie", "McClain", "Logan", "Grady", "Lincoln", "Kingfisher"];
  const METRO = new RegExp("\\b(" + METRO_COUNTIES.join("|") + ")\\b", "i");

  // city/suburb → county, so leads can be matched to alert areas
  const CITY_COUNTY = {
    "oklahoma city": "Oklahoma", "okc": "Oklahoma", "edmond": "Oklahoma",
    "midwest city": "Oklahoma", "del city": "Oklahoma", "bethany": "Oklahoma",
    "warr acres": "Oklahoma", "choctaw": "Oklahoma", "harrah": "Oklahoma",
    "jones": "Oklahoma", "luther": "Oklahoma", "nichols hills": "Oklahoma",
    "the village": "Oklahoma", "spencer": "Oklahoma", "arcadia": "Oklahoma",
    "moore": "Cleveland", "norman": "Cleveland", "noble": "Cleveland", "lexington": "Cleveland",
    "yukon": "Canadian", "mustang": "Canadian", "el reno": "Canadian", "piedmont": "Canadian",
    "shawnee": "Pottawatomie", "tecumseh": "Pottawatomie", "mcloud": "Pottawatomie",
    "guthrie": "Logan", "langston": "Logan",
    "purcell": "McClain", "blanchard": "McClain", "newcastle": "McClain", "goldsby": "McClain",
    "chickasha": "Grady", "tuttle": "Grady", "minco": "Grady",
    "chandler": "Lincoln", "prague": "Lincoln",
    "kingfisher": "Kingfisher", "okarche": "Kingfisher",
  };

  let alerts = [];   // alerts for the selected range (drives the list + report)
  let active = [];   // active alerts (drives badge, ribbon, lead matching)
  let inPath = [];   // [{lead, storm, live}] — leads matched to active OR tracked storms

  /* tracked storms — previous alerts the user toggled ON so their areas
     keep matching leads (post-storm canvassing). Persisted across sessions. */
  const tracked = new Map();
  try {
    JSON.parse(localStorage.getItem("ringco-storm-tracked") || "[]")
      .forEach((a) => a && a.id && tracked.set(a.id, a));
  } catch (_) {}
  function saveTracked() {
    try {
      localStorage.setItem("ringco-storm-tracked",
        JSON.stringify([...tracked.values()].slice(-20))); // keep it bounded
    } catch (_) {}
  }
  const isLive = (id) => active.some((a) => a.id === id);
  /* everything currently feeding the lead matcher: live alerts + tracked ones */
  function matchSources() {
    const m = new Map();
    active.forEach((a) => m.set(a.id, a));
    tracked.forEach((a, id) => { if (!m.has(id)) m.set(id, a); });
    return [...m.values()];
  }

  /* ---------- data ---------- */
  const iso = (d) => d ? new Date(d).toISOString().replace(/\.\d{3}Z$/, "Z") : "";
  function normalize(f) {
    const p = f.properties || {};
    return {
      id: f.id || p.id || p.event,
      event: p.event || "Weather alert",
      severity: (p.severity || "Unknown"),
      onset: p.onset || p.effective || p.sent,
      ends: p.ends || p.expires,
      areas: p.areaDesc || "",
      headline: p.headline || "",
      status: p.status || "Actual",
    };
  }
  const keep = (a) => a.status === "Actual" && RELEVANT.test(a.event) && METRO.test(a.areas);
  function dedupe(arr) {
    // NWS emits an entry per update; collapse to one per event+area+day
    const seen = new Set();
    return arr.filter((a) => {
      const k = a.event + "|" + a.areas + "|" + String(a.onset).slice(0, 10);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }
  async function fetchJSON(url) {
    const r = await fetch(url, { headers: { Accept: "application/geo+json" } });
    if (!r.ok) throw new Error("nws " + r.status);
    return r.json();
  }
  const fetchActive = async () =>
    dedupe(((await fetchJSON(NWS + "/alerts/active?area=OK")).features || []).map(normalize).filter(keep));
  const fetchRange = async (days) => {
    const end = new Date(), start = new Date(Date.now() - days * 864e5);
    const j = await fetchJSON(NWS + "/alerts?area=OK&start=" + iso(start) + "&end=" + iso(end) + "&limit=500");
    return dedupe((j.features || []).map(normalize).filter(keep));
  };

  /* ---------- lead matching ---------- */
  function leadCounty(l) {
    const c = ((l.city || "") + " " + (l.message || "")).toLowerCase();
    if (!c.trim()) return null;
    for (const town in CITY_COUNTY) if (c.includes(town)) return CITY_COUNTY[town];
    for (const county of METRO_COUNTIES) if (c.includes(county.toLowerCase())) return county;
    return null;
  }
  function matchLeads() {
    const sources = matchSources();
    if (!sources.length) { inPath = []; return; }
    inPath = [];
    allLeads.forEach((l) => {
      const c = leadCounty(l);
      if (!c) return;
      const storm = sources.find((s) => new RegExp("\\b" + c + "\\b", "i").test(s.areas));
      if (storm) inPath.push({ lead: l, storm, live: isLive(storm.id) });
    });
  }
  const fmtDay = (d) => d ? new Date(d).toLocaleDateString([], { month: "short", day: "numeric" }) : "recently";
  // active storm → safety check-in; tracked past storm → inspection offer
  const SAFE_MSG = (name, event) =>
    "Hi " + (name || "there") + ", it's Ringco Roofing & Construction. A " + event +
    " has been issued for your area — just checking in. If your roof takes any damage, " +
    "we offer free inspections and 24/7 emergency tarping: (405) 470-7696. Stay safe!";
  const PAST_MSG = (name, event, day) =>
    "Hi " + (name || "there") + ", it's Ringco Roofing & Construction. Your area was hit by a " + event +
    " on " + day + " — hail and wind damage often isn't visible from the ground. " +
    "We're doing free roof inspections nearby: (405) 470-7696.";

  /* ---------- rendering ---------- */
  const fmtDT = (d) => d ? new Date(d).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "—";

  function alertRow(a, i) {
    const row = document.createElement("article");
    row.className = "lead-row storm-row" + (tracked.has(a.id) ? " tracked" : "");
    if (!REDUCE && i < 12) { row.classList.add("anim"); row.style.animationDelay = (i * 0.045) + "s"; }
    const sev = (a.severity || "unknown").toLowerCase();
    // live alerts always feed the matcher; past ones get a Track toggle
    const action = isLive(a.id)
      ? '<span class="storm-auto" title="Active alerts always match leads">🔴 Auto-matched</span>'
      : '<button type="button" class="storm-track' + (tracked.has(a.id) ? " on" : "") +
        '" data-id="' + esc(a.id) + '" aria-pressed="' + (tracked.has(a.id) ? "true" : "false") +
        '" title="Match leads in this storm\'s area (post-storm outreach)">' +
        '<span class="st-knob" aria-hidden="true"></span><span class="st-label">' +
        (tracked.has(a.id) ? "Matching leads" : "Match leads") + "</span></button>";
    row.innerHTML =
      '<div class="lead-when">' + esc(fmtDT(a.onset)) +
        (a.ends ? '<span class="sr-until">until ' + esc(fmtDT(a.ends)) + "</span>" : "") + "</div>" +
      '<div class="lead-body">' +
        '<div class="lead-name">' + esc(a.event) +
          ' <span class="sev-badge sev-' + esc(sev) + '">' + esc(a.severity) + "</span></div>" +
        (a.headline ? '<div class="lead-contacts">' + esc(a.headline) + "</div>" : "") +
        '<p class="lead-msg storm-areas-txt">📍 ' + esc(a.areas) + "</p>" +
      "</div>" +
      '<div class="lead-actions">' + action + "</div>";
    return row;
  }

  function renderAreas() {
    const counts = {};
    alerts.forEach((a) => a.areas.split(";").forEach((t) => {
      t = t.trim().replace(/,\s*OK$/i, "");
      if (t && METRO.test(t)) counts[t] = (counts[t] || 0) + 1;
    }));
    const top = Object.entries(counts).sort((x, y) => y[1] - x[1]).slice(0, 12);
    $areas.innerHTML = top.map(([n, c]) =>
      '<span class="area-chip">' + esc(n) + " <b>" + c + "</b></span>").join("");
    $areas.hidden = !top.length;
    return top.length ? top[0][0] : "";
  }

  function renderLeadsPanel() {
    matchLeads();
    setNum("storm-kpi-leads", inPath.length);
    $leadsPanel.hidden = !inPath.length;
    if (!inPath.length) { $leadsList.innerHTML = ""; return; }
    const anyLive = inPath.some((e) => e.live);
    el("storm-leads-title").textContent = anyLive
      ? "⚠️ Clients possibly in the path — check in & offer help"
      : "🏠 Clients in storm-hit areas — offer a free inspection";
    $leadsList.innerHTML = "";
    inPath.forEach(({ lead: l, storm, live }) => {
      const digits = (l.phone || "").replace(/[^\d+]/g, "");
      const first = (l.name || "").split(" ")[0];
      const msg = live ? SAFE_MSG(first, storm.event) : PAST_MSG(first, storm.event, fmtDay(storm.onset));
      const body = encodeURIComponent(msg);
      const subject = encodeURIComponent(live
        ? "Storm heads-up from Ringco Roofing"
        : "Free roof inspection after the " + storm.event);
      const row = document.createElement("article");
      row.className = "lead-row storm-lead";
      row.innerHTML =
        '<div class="lead-when">' + esc(l.city || "OKC metro") + "</div>" +
        '<div class="lead-body"><div class="lead-name">' + esc(l.name || "(no name)") + "</div>" +
          (l.phone ? '<div class="lead-contacts">' + esc(l.phone) + "</div>" : "") +
          '<div class="lead-tags"><span class="storm-hit-tag' + (live ? " live" : "") + '">' +
            (live ? "🔴 " : "⛈️ ") + esc(storm.event) + (live ? " · active now" : " · " + esc(fmtDay(storm.onset))) +
          "</span></div></div>" +
        '<div class="lead-actions storm-lead-actions">' +
          (digits ? '<a class="tool-btn" href="sms:' + esc(digits) + "?&body=" + body + '">💬 Text</a>' +
                    '<a class="tool-btn" href="tel:' + esc(digits) + '">📞 Call</a>' : "") +
          (l.email ? '<a class="tool-btn" href="mailto:' + esc(l.email) +
            "?subject=" + subject + "&body=" + body + '">✉️ Email</a>' : "") +
        "</div>";
      $leadsList.appendChild(row);
    });
  }

  function maybeToast() {
    const liveHits = inPath.filter((e) => e.live).length;
    if (!active.length || !liveHits) return; // toast only for real, live danger
    const sig = active.map((a) => a.id).join("|") + "#" + liveHits;
    try {
      if (sessionStorage.getItem("ringco-storm-toast") === sig) return;
      sessionStorage.setItem("ringco-storm-toast", sig);
    } catch (_) {}
    const t = document.createElement("div");
    t.className = "storm-toast";
    t.setAttribute("role", "status");
    const liveCount = inPath.filter((e) => e.live).length;
    t.innerHTML = "⚠️ <b>" + liveCount + " client" + (liveCount > 1 ? "s" : "") +
      "</b> may be in the path of the " + esc(active[0].event) +
      '. <button type="button">Open Storm center</button>';
    document.body.appendChild(t);
    setTimeout(() => t.classList.add("show"), 30); // setTimeout: fires even in hidden tabs

    const close = () => { t.classList.remove("show"); setTimeout(() => t.remove(), 400); };
    t.querySelector("button").addEventListener("click", () => { switchTab("storm"); close(); });
    setTimeout(close, 10000);
  }

  function paint() {
    setNum("storm-kpi-active", active.length);
    if ($cardActive) $cardActive.classList.toggle("alert-on", active.length > 0);
    setNum("storm-kpi-range", alerts.length);
    const v = $range.value;
    el("storm-kpi-range-label").textContent = v === "active" ? "Alerts shown (active)" : "Alerts · last " + v + " days";
    const topArea = renderAreas();
    const areaEl = el("storm-kpi-area");
    areaEl.textContent = topArea || "—";
    areaEl.title = topArea;

    if ($badge) { $badge.textContent = active.length; $badge.hidden = !active.length; }
    if ($ribbon) {
      if (active.length) {
        $ribbon.innerHTML = '<span class="sa-dot" aria-hidden="true"></span>🚨 <b>' + esc(active[0].event) + "</b> active for the OKC metro" +
          (active.length > 1 ? " (+" + (active.length - 1) + " more)" : "") +
          ' — open Storm center <span class="arr">→</span>';
        $ribbon.hidden = false;
      } else $ribbon.hidden = true;
    }

    renderLeadsPanel();

    $list.innerHTML = "";
    alerts.forEach((a, i) => $list.appendChild(alertRow(a, i)));
    $loading.hidden = true;
    $error.hidden = true;
    $empty.hidden = alerts.length > 0;
    maybeToast();
  }

  /* ---------- report extraction ---------- */
  const stamp = () => new Date().toISOString().slice(0, 10);
  const rangeLabel = () => $range.value === "active" ? "active" : "last-" + $range.value + "-days";

  function downloadCSV() {
    const head = ["Event", "Severity", "Starts", "Ends", "Areas affected", "Headline"];
    const rows = [head].concat(alerts.map((a) =>
      [a.event, a.severity, fmtDT(a.onset), fmtDT(a.ends), a.areas, a.headline]));
    const csv = "﻿" + rows.map((r) => // BOM so Excel opens UTF-8 correctly
      r.map((c) => '"' + String(c == null ? "" : c).replace(/"/g, '""') + '"').join(",")).join("\r\n");
    const aEl = document.createElement("a");
    aEl.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    aEl.download = "ringco-storm-report-" + rangeLabel() + "-" + stamp() + ".csv";
    aEl.click();
    URL.revokeObjectURL(aEl.href);
  }

  function printReport() {
    const areaRows = $areas.hidden ? "" : $areas.innerHTML
      .replace(/<span class="area-chip">/g, "<li>").replace(/<\/span>/g, "</li>");
    const w = window.open("", "_blank");
    if (!w) { alert("Allow pop-ups to open the printable report."); return; }
    w.document.write(
      "<!DOCTYPE html><html><head><title>Ringco storm report — " + rangeLabel() + "</title>" +
      "<style>body{font:14px/1.55 'Segoe UI',Arial,sans-serif;color:#092849;margin:36px;max-width:900px}" +
      "h1{font-size:22px;margin:0}h2{font-size:15px;margin:26px 0 8px}.sub{color:#51606F;margin:4px 0 20px}" +
      "table{border-collapse:collapse;width:100%;font-size:12.5px}th,td{border:1px solid #cfd9e4;padding:7px 9px;text-align:left;vertical-align:top}" +
      "th{background:#eaf2f9}ul{margin:0;padding-left:18px}.kpi{display:inline-block;margin-right:26px}" +
      ".kpi b{font-size:20px;display:block}@media print{button{display:none}}</style></head><body>" +
      "<h1>⛈️ Ringco Roofing — OKC metro storm report</h1>" +
      '<p class="sub">Range: ' + rangeLabel().replace(/-/g, " ") + " · Generated " + new Date().toLocaleString() +
      " · Source: National Weather Service</p>" +
      '<div><span class="kpi"><b>' + active.length + "</b>Active alerts now</span>" +
      '<span class="kpi"><b>' + alerts.length + "</b>Alerts in range</span>" +
      '<span class="kpi"><b>' + inPath.length + "</b>Leads in storm path</span></div>" +
      (areaRows ? "<h2>Areas affected (alert count)</h2><ul>" + areaRows + "</ul>" : "") +
      "<h2>Alerts</h2><table><tr><th>Event</th><th>Severity</th><th>Starts</th><th>Ends</th><th>Areas affected</th></tr>" +
      alerts.map((a) => "<tr><td>" + esc(a.event) + "</td><td>" + esc(a.severity) + "</td><td>" +
        esc(fmtDT(a.onset)) + "</td><td>" + esc(fmtDT(a.ends)) + "</td><td>" + esc(a.areas) + "</td></tr>").join("") +
      "</table>" +
      (inPath.length
        ? "<h2>Clients in matched storm areas (active + tracked)</h2><table><tr><th>Name</th><th>City</th><th>Phone</th><th>Email</th><th>Storm</th></tr>" +
          inPath.map((e) => "<tr><td>" + esc(e.lead.name) + "</td><td>" + esc(e.lead.city) + "</td><td>" +
            esc(e.lead.phone) + "</td><td>" + esc(e.lead.email) + "</td><td>" +
            esc(e.storm.event) + (e.live ? " (active)" : " · " + esc(fmtDay(e.storm.onset))) + "</td></tr>").join("") + "</table>"
        : "") +
      "<p class='sub' style='margin-top:26px'>Ringco Roofing &amp; Construction · (405) 470-7696 · Oklahoma County &amp; surrounding areas</p>" +
      "</body></html>");
    w.document.close();
    w.focus();
    setTimeout(() => { try { w.print(); } catch (_) {} }, 450);
  }

  /* ---------- load & events ---------- */
  let seq = 0;
  async function load() {
    const my = ++seq;
    $loading.hidden = false; $empty.hidden = true; $error.hidden = true;
    $list.innerHTML = ""; $areas.hidden = true;
    try {
      const act = await fetchActive();
      if (my !== seq) return;
      active = act;
      const v = $range.value;
      alerts = v === "active" ? act : await fetchRange(Number(v));
      if (my !== seq) return;
      paint();
    } catch (_) {
      if (my !== seq) return;
      $loading.hidden = true; $error.hidden = false;
    }
  }

  /* Push the current toggle state to the public site. The banner shows the
     newest tracked storm (or clears when none remain). `feedback` = show a
     confirmation/warning toast (only when the admin actually clicks). */
  const newestTracked = () => [...tracked.values()]
    .sort((x, y) => new Date(y.onset || 0) - new Date(x.onset || 0))[0] || null;

  async function syncBanner(feedback) {
    const storm = newestTracked();
    if (!publishBannerFn) {
      if (feedback) bannerToast(false, storm, true);
      return;
    }
    const ok = await publishBannerFn(storm);
    if (feedback) bannerToast(ok, storm, false);
  }

  function bannerToast(ok, storm, signedOut) {
    const prev = document.querySelector(".banner-toast");
    if (prev) prev.remove();
    const t = document.createElement("div");
    t.className = "storm-toast banner-toast" + (ok ? " ok" : " warn");
    t.setAttribute("role", "status");
    t.innerHTML = ok
      ? (storm
          ? "✅ <b>Public site updated</b> — visitors now see the “" + esc(storm.event) + "” storm banner."
          : "✅ <b>Public banner removed</b> — no storm is showing on the site now.")
      : signedOut
        ? "⚠️ <b>Saved locally only.</b> Sign in to the dashboard to show this on the public site."
        : "⚠️ <b>Couldn’t update the public site.</b> Re-publish the Firestore rules (settings) — this is saved locally meanwhile.";
    document.body.appendChild(t);
    setTimeout(() => t.classList.add("show"), 30);
    const close = () => { t.classList.remove("show"); setTimeout(() => t.remove(), 400); };
    setTimeout(close, 6000);
    t.addEventListener("click", close);
  }

  // toggle "Match leads" on a previous storm — joins/leaves the matching pool
  $list.addEventListener("click", (e) => {
    const b = e.target.closest(".storm-track");
    if (!b) return;
    const id = b.dataset.id;
    const a = alerts.find((x) => x.id === id) || tracked.get(id);
    if (!a) return;
    const on = !tracked.has(id);
    if (on) tracked.set(id, a); else tracked.delete(id);
    saveTracked();
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.querySelector(".st-label").textContent = on ? "Matching leads" : "Match leads";
    b.closest(".storm-row").classList.toggle("tracked", on);
    renderLeadsPanel();
    syncBanner(true); // publish to the public site + confirm to the admin
  });

  // when a signed-in admin's dashboard loads, re-publish whatever is toggled
  // (heals a write that failed before rules were published / before sign-in)
  adminReadyHooks.push(() => { if (tracked.size) syncBanner(false); });

  $range.addEventListener("change", load);
  el("storm-refresh").addEventListener("click", load);
  el("storm-csv").addEventListener("click", downloadCSV);
  el("storm-print").addEventListener("click", printReport);
  if ($ribbon) $ribbon.addEventListener("click", () => switchTab("storm"));

  // re-match leads whenever the Firestore snapshot changes
  leadsChangedHooks.push(() => { if (!$loading.hidden) return; renderLeadsPanel(); maybeToast(); });

  load();
  // keep the "active" picture fresh — every 5 min while the tab is visible
  setInterval(() => { if (!document.hidden) load(); }, 5 * 60 * 1000);
})();

/* ============================================================
   GOOGLE REVIEWS — Business Profile integration.
   Reads reviews + posts replies straight from the dashboard.
   Needs: GOOGLE_CLIENT_ID above + Google's (free) Business
   Profile API access approval on the same Cloud project.
   ============================================================ */
(function googleReviews() {
  const $setup = el("rev-setup"), $connect = el("rev-connect"), $btn = el("rev-connect-btn"),
    $err = el("rev-err"), $main = el("rev-main"), $list = el("rev-list"),
    $loading = el("rev-loading"), $empty = el("rev-empty"),
    $loc = el("rev-location"), $refresh = el("rev-refresh");
  if (!$list) return;

  if (!GOOGLE_CLIENT_ID) { $setup.hidden = false; return; }
  $connect.hidden = false;

  const SCOPE = "https://www.googleapis.com/auth/business.manage";
  const STARS = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
  let token = null, tokenClient = null, locations = [], curLoc = null, reviews = [];

  // resume a still-valid token from this browser session
  try {
    const s = JSON.parse(sessionStorage.getItem("ringco-gbp-token") || "null");
    if (s && s.exp > Date.now()) token = s.t;
  } catch (_) {}

  function gisReady() {
    return new Promise((res, rej) => {
      if (window.google && window.google.accounts) return res();
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  async function connect() {
    $err.textContent = "";
    try { await gisReady(); } catch (_) { $err.textContent = "Couldn't load Google sign-in — check your connection."; return; }
    tokenClient = tokenClient || window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: SCOPE,
      callback: (resp) => {
        if (!resp || resp.error) { $err.textContent = "Google sign-in was cancelled."; return; }
        token = resp.access_token;
        try {
          sessionStorage.setItem("ringco-gbp-token",
            JSON.stringify({ t: token, exp: Date.now() + (Number(resp.expires_in || 3600) - 60) * 1000 }));
        } catch (_) {}
        boot();
      },
    });
    tokenClient.requestAccessToken();
  }

  async function api(url) {
    const r = await fetch(url, { headers: { Authorization: "Bearer " + token } });
    if (r.status === 401) { token = null; try { sessionStorage.removeItem("ringco-gbp-token"); } catch (_) {} throw { auth: true }; }
    if (r.status === 403) throw { denied: true };
    if (!r.ok) throw {};
    return r.json();
  }

  function fail(e) {
    $loading.hidden = true; $main.hidden = true; $connect.hidden = false;
    $err.textContent = e && e.denied
      ? "Google denied the request — make sure the Business Profile APIs are enabled and your API access request is approved (developers.google.com/my-business/content/prereqs)."
      : e && e.auth
        ? "Google session expired — connect again."
        : "Couldn't load reviews — try connecting again.";
  }

  async function boot() {
    $connect.hidden = true; $main.hidden = false;
    $loading.hidden = false; $empty.hidden = true; $list.innerHTML = "";
    try {
      const acc = await api("https://mybusinessaccountmanagement.googleapis.com/v1/accounts");
      const account = (acc.accounts || [])[0];
      if (!account) throw {};
      const locs = await api("https://mybusinessbusinessinformation.googleapis.com/v1/" +
        account.name + "/locations?readMask=name,title&pageSize=100");
      locations = (locs.locations || []).map((L) => ({ id: account.name + "/" + L.name, title: L.title || "Location" }));
      if (!locations.length) throw {};
      if (locations.length > 1) {
        $loc.hidden = false;
        $loc.innerHTML = locations.map((L, i) => '<option value="' + i + '">' + esc(L.title) + "</option>").join("");
      }
      $refresh.hidden = false;
      curLoc = locations[0];
      await loadReviews();
    } catch (e) { fail(e); }
  }

  async function loadReviews() {
    $loading.hidden = false; $list.innerHTML = ""; $empty.hidden = true;
    try {
      const j = await api("https://mybusiness.googleapis.com/v4/" + curLoc.id + "/reviews?pageSize=50");
      reviews = j.reviews || [];
      el("rev-kpi-avg").textContent = j.averageRating ? j.averageRating.toFixed(1) + " ★" : "—";
      setNum("rev-kpi-total", j.totalReviewCount || reviews.length);
      setNum("rev-kpi-unreplied", reviews.filter((r) => !r.reviewReply).length);
      $loading.hidden = true;
      $empty.hidden = reviews.length > 0;
      render();
    } catch (e) { fail(e); }
  }

  const starsHTML = (n) =>
    '<span class="rev-stars" aria-label="' + n + ' out of 5 stars">' +
    "★".repeat(n) + '<span class="dim">' + "★".repeat(5 - n) + "</span></span>";

  function render() {
    $list.innerHTML = "";
    reviews.forEach((r, i) => {
      const n = STARS[r.starRating] || 0;
      const who = (r.reviewer && r.reviewer.displayName) || "Google user";
      const pic = r.reviewer && r.reviewer.profilePhotoUrl;
      const when = r.createTime
        ? new Date(r.createTime).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) : "";
      const row = document.createElement("article");
      row.className = "rev-row";
      if (!REDUCE && i < 12) { row.classList.add("anim"); row.style.animationDelay = (i * 0.045) + "s"; }
      row.innerHTML =
        '<div class="rev-head">' +
          (pic ? '<img class="rev-ava" src="' + esc(pic) + '" alt="" loading="lazy">'
               : '<span class="rev-ava rev-ava-txt">' + esc(who.charAt(0).toUpperCase()) + "</span>") +
          '<div><div class="rev-who">' + esc(who) + "</div>" +
          '<div class="rev-meta">' + starsHTML(n) + " · " + esc(when) + "</div></div></div>" +
        (r.comment ? '<p class="rev-comment">' + esc(r.comment) + "</p>" : "") +
        (r.reviewReply
          ? '<div class="rev-reply"><b>Your reply</b><p>' + esc(r.reviewReply.comment || "") + "</p></div>" : "") +
        '<div class="rev-replybox">' +
          '<textarea rows="2" placeholder="' + (r.reviewReply ? "Update your public reply…" : "Write a public reply…") + '"></textarea>' +
          '<button type="button" class="btn btn-primary rev-send" data-id="' + esc(r.reviewId) + '">' +
            (r.reviewReply ? "Update reply" : "Post reply") + "</button></div>";
      $list.appendChild(row);
    });
  }

  $list.addEventListener("click", async (e) => {
    const b = e.target.closest(".rev-send");
    if (!b || !curLoc) return;
    const txt = b.closest(".rev-replybox").querySelector("textarea").value.trim();
    if (!txt) return;
    b.disabled = true;
    const was = b.textContent;
    b.textContent = "Posting…";
    try {
      const r = await fetch("https://mybusiness.googleapis.com/v4/" + curLoc.id + "/reviews/" + b.dataset.id + "/reply", {
        method: "PUT",
        headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
        body: JSON.stringify({ comment: txt }),
      });
      if (!r.ok) throw 0;
      await loadReviews(); // re-pull so the published reply shows
    } catch (_) {
      b.disabled = false;
      b.textContent = was + " (failed — retry)";
    }
  });

  $btn.addEventListener("click", connect);
  $refresh.addEventListener("click", loadReviews);
  $loc.addEventListener("change", () => { curLoc = locations[Number($loc.value)]; loadReviews(); });

  if (token) boot(); // token still valid from earlier this session
})();
