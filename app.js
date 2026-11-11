/* Green Screen v5 — round 1: data & sync, sidebar & themes, New project, Projects, Project page */
const APP_VERSION = '5.0.1-r1';

/* ============================================================
   CONSTANTS & DEFAULTS
   ============================================================ */
const STAGES = ['Appointment', 'Initial Design & Proposal', 'Ready to Present', 'Revise', 'Finalize & Process', 'Project Install', 'Warranty Replacements'];
const SHORT = ['APPOINTMENT', 'INITIAL DESIGN', 'READY TO PRESENT', 'REVISE', 'FINALIZE & PROCESS', 'PROJECT INSTALL', 'WARRANTY'];
const STATUSES = ['Not Started', 'In Progress', 'Delayed', 'Assigned', 'Done', 'N/A'];
const SK = { 'Not Started': 'ns', 'In Progress': 'ip', 'Delayed': 'dl', 'Assigned': 'as', 'Done': 'dn', 'N/A': 'na' };
const LEVELS = ['LOW', 'MEDIUM', 'URGENT'];
const PL = { LOW: 'Low', MEDIUM: 'Medium', URGENT: 'Urgent' };
const COLORS = [['sage', 'Sage'], ['pine', 'Pine'], ['wheat', 'Wheat'], ['slate', 'Slate'], ['ochre', 'Ochre'], ['clay', 'Clay']];

const T = [[0, "Schedule Consult", ""], [0, "Create SharePoint Folder", "Link to existing Pipedrive deal and save to My Files"], [0, "Aerial Drawing", "Use measurements/contours from IA County Assessor or Beacon"], [0, "Initial Consult", "Meet client, take measurements & elevations on site"], [1, "Make Layout", ""], [1, "Sketch Prelim Options", "Design w/ client program, nursery list, and applicable site observations"], [1, "CAD Drawing", ""], [1, "CAD Redline Updates", "See notes on B&W copy in SharePoint"], [1, "Estimating Notes", "Highlight design regions on latest B&W plan"], [1, "Pipedrive: Estimating Task", "Clarify materials and existing site conditions w/ Estimating Team"], [1, "Pipedrive: Rendering Task", "Build in SketchUp; talk through view details w/ Graphics Team"], [2, "Schedule Present", ""], [2, "Review Plan & Proposal", "Make necessary edits to review sheet or B&W plan"], [2, "Color Rendering", ""], [2, "Plant Photo Sheet", "Build in Canva based off current perennial schedule"], [2, "Print Present Docs", "Includes proposal, sales review sheet, warranty info, nursery price list"], [2, "Customer Materials", "Paver samples & relevant past project pictures"], [2, "Design Present", ""], [3, "Client Follow-Up", "Check in with customer on plan revisions, sales progress, install timing"], [3, "Revision Meeting", "Finalize plan details, material specs, and pricing for approved project scope"], [3, "Update Plan & Proposal", ""], [3, "Finalize Sold Project", "Receive signed proposal + 25% deposit"], [3, "File Paperwork & Deposit", "Scan proposal into SharePoint & hand off deposit to business office"], [3, "Make Placeholder", "Pending updates and processed operations"], [4, "Prep Crewplan & Crewpics", ""], [4, "Send Ops Email", "Includes locates, relevant timing, manhours, most current review sheet"], [4, "Confirm Install Timing", "Reach out to client once project is added to tentative crew schedule"], [4, "Coordinate w/ Crew Leader", "Determine upcoming crew schedule w/ Group Leader and follow up w/ client"], [4, "Check Hardscape Materials", "Talk to Purchasing/Estimating Team"], [4, "Check Plant Availability", "Talk to Ames Tagging"], [4, "Request Utility Locates", ""], [4, "Special Order Perennials", "Talk to Nursery/Procurement Team about delivery timing prior to installation"], [4, "Confirm Tagged Plants", "Check at West Site and Retail locations to compare w/ current Tagging Sheet before project start"], [5, "Meet Crew Onsite", "Walk through installation details, best access, or flagged plantings"], [5, "Site Visit", "Monitor installation progress, address issues, layout perennial plantings, or meet w/ homeowner"], [5, "Process Completed Work Order", "Compare w/ onsite installation notes and edit subbed perennials for Nursery inventory"], [5, "Client Watering Instructions", ""], [5, "Take Finished Project Photos", ""], [6, "Pipedrive: Warranty Task", "Double-check any changes to warranty plant cultivars or original size"], [6, "Process Warranty Paperwork", ""]];
const DEFAULT_WORKFLOW = T.map(([stage, title, detail], i) => ({ id: 'w' + (i + 1), stage, title, detail, optional: stage === 6 }));
const DEFAULT_SETTINGS = {
  designers: [{ id: 'isaiah', name: 'Isaiah Bates', color: 'sage' }, { id: 'dan', name: 'Dan Van Weelden', color: 'pine' }, { id: 'justin', name: 'Justin Wigdahl', color: 'wheat' }],
  crews: ['Ken Small', 'Brad Oxley', 'Chuck Johnson', 'Jon Goodknight', 'Curtis Carlson', 'Michael Schreck', 'Kaleb Ross', 'Marcelo Montero', 'Evan Erichsen', 'Vaughn Gibson', 'Martin Huber', 'Peter Boman', 'Rob Lechnir', 'Rick Johnson', 'Nick Breuning'],
  retention: 14,
  opsEmailDefaults: {}
};

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDvBE7CvnnlunBppqIqJwHjwr7RqYbTaJ8',
  authDomain: 'green-screen-app-1a582.firebaseapp.com',
  projectId: 'green-screen-app-1a582',
  storageBucket: 'green-screen-app-1a582.firebasestorage.app',
  messagingSenderId: '114982936011',
  appId: '1:114982936011:web:17ddc2ec52e7c2243caa4e'
};
const FB = 'https://www.gstatic.com/firebasejs/10.13.0/';
const COL_PROJECTS = 'gs5_projects';
const COL_META = 'gs5_meta';
const LS = { mirror: 'gs5:mirror', outbox: 'gs5:outbox', theme: 'gs5:theme', motion: 'gs5:motion', side: 'gs5:sidebarCollapsed', lastDesigner: 'gs5:lastDesigner', drawers: 'gs5:drawers', sort: 'gs5:projectSort' };

/* ============================================================
   UTILITIES
   ============================================================ */
const $ = (sel, root = document) => root.querySelector(sel);
const clone = (o) => JSON.parse(JSON.stringify(o));
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = (p = 'p') => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const WK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = (n) => String(n).padStart(2, '0');
const isoOf = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const today0 = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
const todayISO = () => isoOf(today0());
const parseISO = (s) => { if (!s) return null; const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const daysFrom = (iso) => { const d = parseISO(iso); if (!d) return null; return Math.round((d - today0()) / 86400000); };
const addDays = (n) => { const d = today0(); d.setDate(d.getDate() + n); return isoOf(d); };
const fmtDay = (iso) => { const d = parseISO(iso); return d ? WK[d.getDay()] + ', ' + MO[d.getMonth()] + ' ' + d.getDate() : ''; };
const dueLabel = (iso) => { const n = daysFrom(iso); if (n === null) return ''; if (n < 0) return (-n) + (n === -1 ? ' day late' : ' days late'); if (n === 0) return 'Today'; if (n === 1) return 'Tomorrow'; return fmtDay(iso); };
const dueTone = (iso) => { const n = daysFrom(iso); if (n === null) return 'muted'; if (n < 0) return 'urgent'; if (n === 0) return 'ink'; return 'muted'; };
const quickDates = () => { const dow = today0().getDay(); const fri = ((5 - dow + 7) % 7) || 7; const mon = ((1 - dow + 7) % 7) || 7; return [['Today', 0], ['Tomorrow', 1], ['By Friday', fri], ['Next Monday', mon]].map(([l, n]) => ({ label: l, iso: addDays(n), hint: MO[parseISO(addDays(n)).getMonth()] + ' ' + parseISO(addDays(n)).getDate() })); };
const ago = (ts) => { if (!ts) return 'never'; const s = Math.max(0, (Date.now() - ts) / 1000); if (s < 45) return 'just now'; const m = s / 60; if (m < 60) return Math.round(m) + 'm ago'; const h = m / 60; if (h < 24) return Math.round(h) + 'h ago'; const d = h / 24; return Math.round(d) + 'd ago'; };
const motionOK = () => U.motion && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

/* ============================================================
   ICONS
   ============================================================ */
const svg = (w, body, sw = 1.8) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const I = {
  leaf: (w = 16, c = 'var(--accentInk)') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 21V9"></path><path d="M12 13c-4 0-6-3-6-7 4 0 6 3 6 7z"></path><path d="M12 10c0-4 2-6 6-6 0 4-2 6-6 6z"></path></svg>`,
  dash: svg(16, '<rect x="3" y="3" width="7" height="7" rx="1.5"></rect><rect x="14" y="3" width="7" height="7" rx="1.5"></rect><rect x="3" y="14" width="7" height="7" rx="1.5"></rect><rect x="14" y="14" width="7" height="7" rx="1.5"></rect>'),
  list: svg(16, '<path d="M9 6h11M9 12h11M9 18h11"></path><path d="M4 6h.01M4 12h.01M4 18h.01"></path>'),
  clock: svg(16, '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>'),
  folder: svg(16, '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>'),
  truck: (w = 16) => svg(w, '<path d="M3 6h11v9H3zM14 9h4l3 3v3h-7"></path><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle>'),
  flow: svg(16, '<rect x="3" y="3" width="6" height="6" rx="1.5"></rect><rect x="15" y="15" width="6" height="6" rx="1.5"></rect><path d="M6 9v4a2 2 0 0 0 2 2h7"></path>'),
  box: (w = 16) => svg(w, '<rect x="3" y="4" width="18" height="5" rx="1.5"></rect><path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M10 13h4"></path>'),
  gear: svg(16, '<path d="M4 7h10M18 7h2M4 17h4M12 17h8"></path><circle cx="16" cy="7" r="2"></circle><circle cx="10" cy="17" r="2"></circle>'),
  collapse: svg(16, '<path d="M11 7l-5 5 5 5M18 7l-5 5 5 5"></path>'),
  chev: (w = 14) => `<svg class="chev" width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"></path></svg>`,
  down: svg(10, '<path d="M6 9l6 6 6-6"></path>', 2.2),
  plus: svg(14, '<path d="M12 5v14M5 12h14"></path>', 2.2),
  x: (w = 14) => svg(w, '<path d="M6 6l12 12M18 6L6 18"></path>', 2),
  trash: (w = 14) => svg(w, '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"></path>'),
  up: svg(14, '<path d="M12 19V5M6 11l6-6 6 6"></path>', 2),
  dn: svg(14, '<path d="M12 5v14M6 13l6 6 6-6"></path>', 2),
  cal: svg(12, '<rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M3 10h18M8 3v4M16 3v4"></path>', 2),
  note: svg(13, '<path d="M5 4h10l4 4v12H5z"></path><path d="M9 12h6M9 16h4"></path>'),
  tick: (w = 12, c = 'var(--accentInk)') => `<svg class="tick" width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"></path></svg>`,
  reopen: svg(10, '<path d="M4 12a8 8 0 1 0 3-6.2"></path><path d="M4 4v4h4"></path>', 2.6),
  arrowUp: svg(9, '<path d="M12 19V5M6 11l6-6 6 6"></path>', 3),
  download: svg(14, '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"></path>', 2),
  search: svg(14, '<circle cx="11" cy="11" r="7"></circle><path d="M20 20l-3.5-3.5"></path>', 2)
};

/* ============================================================
   STATE
   ============================================================ */
const mirror = lsGet(LS.mirror, null);
const S = {
  projects: (mirror && mirror.projects) || {},
  workflow: (mirror && mirror.workflow) || clone(DEFAULT_WORKFLOW),
  settings: Object.assign(clone(DEFAULT_SETTINGS), (mirror && mirror.settings) || {}),
  sync: { state: 'saving', at: (mirror && mirror.at) || 0, msg: '' }
};
const U = {
  route: { page: 'projects', id: null },
  theme: lsGet(LS.theme, 'sand'),
  motion: lsGet(LS.motion, true),
  collapsed: lsGet(LS.side, false),
  enter: true,
  menu: null,               // { kind, key }
  open: {},                 // `${pid}:${si}` -> bool
  showDone: {},             // pid -> bool
  expanded: {},             // `${pid}:${key}` -> bool
  casc: null,               // { pid, ids: {key: delayIdx} }
  unc: null,                // { pid, ids: {key: delayIdx} }
  sweep: null,              // { pid, segs: {si: delayIdx}, kind: 'sweep'|'drain' }
  justDone: null,           // `${pid}:${key}`
  drawers: lsGet(LS.drawers, {}),
  showAll: {},
  sort: lsGet(LS.sort, 'stage'),
  search: '',
  leaving: {},              // pid -> 'arch'|'gone'
  back: {},                 // pid -> true
  toast: null,
  undo: [],
  np: null,
  exiting: false,
  gone: null,
  busy: false
};
const LOCAL_ONLY = location.protocol === 'file:' || /[?&]local\b/.test(location.search);

/* ============================================================
   DATA LAYER — one Firestore doc per project, live, offline-safe
   ============================================================ */
const cloud = { ready: false, db: null, fs: null, inflight: 0, outbox: lsGet(LS.outbox, []), seeded: {}, firstSnap: false };

function saveMirror() { lsSet(LS.mirror, { projects: S.projects, workflow: S.workflow, settings: S.settings, at: S.sync.at }); }
function setSync(state, msg) { S.sync.state = state; if (msg !== undefined) S.sync.msg = msg; if (state === 'saved') S.sync.at = Date.now(); renderSync(); }
function computeSync() {
  if (LOCAL_ONLY) return setSync('local');
  if (!navigator.onLine) return setSync('offline');
  if (S.sync.state === 'error' && !cloud.ready) return renderSync();
  if (!cloud.ready || cloud.inflight > 0 || cloud.outbox.length) return setSync('saving');
  setSync('saved');
}
function enqueue(op) {
  saveMirror();
  if (LOCAL_ONLY) { S.sync.at = Date.now(); return computeSync(); }
  if (cloud.ready) runOp(op); else { cloud.outbox.push(op); lsSet(LS.outbox, cloud.outbox); computeSync(); }
}
function runOp(op) {
  const { doc, setDoc, deleteDoc } = cloud.fs;
  const ref = doc(cloud.db, op.col, op.id);
  cloud.inflight++; computeSync();
  const p = op.t === 'del' ? deleteDoc(ref) : setDoc(ref, op.data);
  p.then(() => { cloud.inflight--; S.sync.msg = ''; computeSync(); saveMirror(); })
    .catch((e) => { cloud.inflight--; console.error('Save failed', e); setSync('error', (e && e.message) || 'Save failed'); });
}
function putProject(p, opts = {}) {
  if (!opts.keepTime) p.updatedAt = Date.now();
  S.projects[p.id] = p;
  enqueue({ t: 'set', col: COL_PROJECTS, id: p.id, data: clone(p) });
  render();
}
function removeProject(id) {
  delete S.projects[id];
  enqueue({ t: 'del', col: COL_PROJECTS, id });
  render();
}
function putMeta(key, val) {
  S[key] = val;
  enqueue({ t: 'set', col: COL_META, id: key, data: { v: clone(val), updatedAt: Date.now() } });
  render();
}

async function initCloud() {
  if (LOCAL_ONLY) { computeSync(); return; }
  let appMod, fs, authMod;
  try {
    [appMod, fs, authMod] = await Promise.all([import(FB + 'firebase-app.js'), import(FB + 'firebase-firestore.js'), import(FB + 'firebase-auth.js')]);
  } catch (e) {
    console.error('Firebase failed to load', e);
    setSync(navigator.onLine ? 'error' : 'offline', "Couldn't reach the cloud. Changes are kept on this device and will sync when it connects.");
    return;
  }
  cloud.fs = fs;
  const app = appMod.initializeApp(FIREBASE_CONFIG);
  try { cloud.db = fs.initializeFirestore(app, { localCache: fs.persistentLocalCache({ tabManager: fs.persistentMultipleTabManager() }) }); }
  catch (e) { console.warn('Offline cache unavailable, using memory cache', e); cloud.db = fs.getFirestore(app); }
  const auth = authMod.getAuth(app);
  authMod.onAuthStateChanged(auth, (user) => { if (user && !cloud.ready) onAuthed(); });
  authMod.signInAnonymously(auth).catch((e) => { console.error('Sign-in failed', e); if (!cloud.ready) setSync(navigator.onLine ? 'error' : 'offline', 'Could not sign in to the cloud yet.'); });
}
function onAuthed() {
  const fs = cloud.fs;
  cloud.ready = true;
  const queued = cloud.outbox.splice(0); lsSet(LS.outbox, []);
  queued.forEach(runOp);
  fs.onSnapshot(fs.collection(cloud.db, COL_PROJECTS), { includeMetadataChanges: true }, (snap) => {
    const next = {};
    snap.forEach((d) => { next[d.id] = d.data(); });
    S.projects = next;
    if (!snap.metadata.fromCache && !cloud.firstSnap) { cloud.firstSnap = true; }
    saveMirror(); computeSync(); render();
  }, (e) => { console.error('Sync error', e); setSync('error', e.message || 'Sync error'); });
  ['workflow', 'settings'].forEach((key) => {
    fs.onSnapshot(fs.doc(cloud.db, COL_META, key), { includeMetadataChanges: true }, (snap) => {
      if (snap.exists()) {
        const v = snap.data().v;
        S[key] = key === 'settings' ? Object.assign(clone(DEFAULT_SETTINGS), v || {}) : (v || clone(DEFAULT_WORKFLOW));
        saveMirror(); render();
      } else if (!snap.metadata.fromCache && !cloud.seeded[key]) {
        cloud.seeded[key] = true;
        putMeta(key, key === 'settings' ? clone(DEFAULT_SETTINGS) : clone(DEFAULT_WORKFLOW));
      }
    }, (e) => { console.error('Sync error', e); setSync('error', e.message || 'Sync error'); });
  });
  computeSync();
}
window.addEventListener('online', computeSync);
window.addEventListener('offline', computeSync);
setInterval(renderSync, 30000);

/* ============================================================
   DOMAIN HELPERS
   ============================================================ */
const designers = () => S.settings.designers || [];
const designer = (id) => designers().find(d => d.id === id) || { id, name: 'Unassigned', color: 'slate' };
const dColor = (id) => 'var(--c-' + designer(id).color + ')';
const firstName = (n) => String(n || '').split(' ')[0];
const DEF_ST = { s: 'Not Started', p: 'LOW', due: '', note: '', dis: false };
const isClosed = (s) => s === 'Done' || s === 'N/A';

function projItems(p) {
  const out = [];
  S.workflow.forEach((w, i) => {
    out.push({ key: w.id, kind: 't', n: i + 1, title: w.title, detail: w.detail, stage: w.stage, optional: !!w.optional, st: Object.assign({}, DEF_ST, (p.steps || {})[w.id]) });
  });
  (p.custom || []).forEach((c) => {
    out.push({ key: c.id, kind: 'c', n: 0, title: c.title, detail: '', stage: c.stage, optional: false, st: Object.assign({}, DEF_ST, c) });
  });
  return out;
}
function stageItems(p, si, items) { return (items || projItems(p)).filter(x => x.stage === si); }
function curStage(p, items) {
  items = items || projItems(p);
  for (let si = 0; si < 7; si++) if (items.some(x => x.stage === si && !x.optional && !isClosed(x.st.s))) return si;
  return 6;
}
function progress(p, items) {
  items = items || projItems(p);
  const counted = items.filter(x => !x.optional && x.st.s !== 'N/A');
  const done = counted.filter(x => x.st.s === 'Done').length;
  return { done, total: counted.length, pct: counted.length ? Math.round(done / counted.length * 100) : 0 };
}
function setItem(p, key, patch) {
  if (S.workflow.some(w => w.id === key)) { p.steps = p.steps || {}; p.steps[key] = Object.assign({}, DEF_ST, p.steps[key], patch); }
  else { const c = (p.custom || []).find(x => x.id === key); if (c) Object.assign(c, patch); }
}
function getItem(p, key) { return projItems(p).find(x => x.key === key); }
function suggest(x) { return !!x.st.due && daysFrom(x.st.due) <= 3 && x.st.p !== 'URGENT' && !isClosed(x.st.s) && !x.st.dis; }
function activeProjects() { return Object.values(S.projects).filter(p => !p.archived); }
function stageCounts(p, items) {
  items = items || projItems(p); const cs = curStage(p, items);
  const open = items.filter(x => x.stage === cs && !isClosed(x.st.s));
  return { cs, open: open.length, urgent: open.filter(x => x.st.p === 'URGENT').length, medium: open.filter(x => x.st.p === 'MEDIUM').length };
}
function dueBadgeCount() {
  let n = 0; activeProjects().forEach(p => projItems(p).forEach(x => { if (!isClosed(x.st.s) && x.st.due && daysFrom(x.st.due) <= 0) n++; })); return n;
}
function newProject({ name, address, po, designerId, stage }) {
  const p = { id: uid('p'), name, address: address || '', po: po || '', designer: designerId, createdAt: Date.now(), updatedAt: Date.now(), archived: false, archivedAt: null, pinned: false, steps: {}, custom: [], crew: '', installDate: '', noArchivePrompt: false };
  S.workflow.forEach(w => { if (w.stage < stage) p.steps[w.id] = Object.assign({}, DEF_ST, { s: 'Done', doneAt: todayISO() }); });
  return p;
}

/* ============================================================
   UNDO & TOAST
   ============================================================ */
function pushUndo(label, fn) {
  U.undo.push({ label, fn });
  if (U.undo.length > 40) U.undo.shift();
  showToast(label, true);
}
function showToast(text, canUndo) {
  const id = Date.now() + Math.random();
  U.toast = { id, text, canUndo };
  renderToast();
  setTimeout(() => { if (U.toast && U.toast.id === id) { U.toast = null; renderToast(); } }, canUndo ? 6000 : 3000);
}
function doUndo() {
  const u = U.undo.pop(); if (!u) return;
  U.toast = null; renderToast();
  u.fn();
}
function mutate(pid, fn, label, opts = {}) {
  const before = S.projects[pid] ? clone(S.projects[pid]) : null; if (!before) return;
  const p = clone(before); fn(p); putProject(p, opts);
  if (label) pushUndo(label, () => { putProject(before, { keepTime: true }); if (opts.onUndo) opts.onUndo(before); });
}

/* ============================================================
   ROUTER
   ============================================================ */
function parseRoute() {
  const h = location.hash.replace(/^#\/?/, '');
  const [page, id] = h.split('/');
  const pages = ['dashboard', 'tasklist', 'due', 'projects', 'operations', 'workflow', 'archived', 'settings', 'project'];
  return { page: pages.includes(page) ? page : 'projects', id: id || null };
}
function go(hash, opts = {}) {
  if (opts.exit && motionOK()) {
    const m = $('.main'); if (m) m.classList.add('page-exit');
    setTimeout(() => { location.hash = hash; }, 230);
  } else location.hash = hash;
}
window.addEventListener('hashchange', () => { U.route = parseRoute(); U.menu = null; U.enter = true; U.gone = null; window.scrollTo(0, 0); render(); });

/* ============================================================
   RENDER — shell
   ============================================================ */
const app = document.getElementById('app');
let pendingRender = false;
function render() {
  if (U.busy) { pendingRender = true; return; }
  // keep whatever is being typed in a text field across re-renders
  const a = document.activeElement;
  let keep = null;
  if (a && a.id && /^(INPUT|TEXTAREA)$/.test(a.tagName) && app.contains(a)) keep = { id: a.id, v: a.value, s: a.selectionStart, e: a.selectionEnd };
  const root = app.firstElementChild;
  if (!root || !root.classList.contains('gs-root')) {
    app.innerHTML = `<div class="gs-root"><aside class="side"></aside><main class="main"></main></div><div id="overlay"></div><div id="toastbox"></div><div id="updbox"></div>`;
  }
  const r = app.firstElementChild;
  r.className = 'gs-root gs-' + U.theme + (U.motion ? '' : ' nomotion');
  document.body.style.background = getComputedStyle(r).getPropertyValue('--bg') || '';
  $('aside', r).outerHTML = renderSide();
  const main = $('main', r);
  const html = renderPage();
  main.className = 'main' + (U.route.page === 'project' ? ' narrow' : '') + (U.enter ? ' enter' : '') + (U.gone ? ' gone' : '');
  main.innerHTML = html;
  U.enter = false;
  if (keep) {
    const el = document.getElementById(keep.id);
    if (el) { el.value = keep.v; el.focus(); try { el.setSelectionRange(keep.s, keep.e); } catch (e) {} }
  }
  renderSync();
  const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', getComputedStyle(r).getPropertyValue('--bg').trim() || '#F2ECE1');
}
function renderSide() {
  const pg = U.route.page;
  const nav = [['dashboard', 'Dashboard', I.dash], ['tasklist', 'Tasklist', I.list], ['due', 'Due Soon', I.clock], ['projects', 'Projects', I.folder], ['operations', 'Operations', I.truck()], ['workflow', 'Workflow', I.flow], ['archived', 'Archived', I.box()], ['settings', 'Settings', I.gear]];
  const due = dueBadgeCount();
  const navHtml = nav.map(([id, label, ic]) => {
    const on = pg === id || (id === 'projects' && pg === 'project');
    const badge = id === 'due' && due ? `<span class="navbadge" title="${due} overdue or due today">${due}</span>` : '';
    return `<a class="nav press${on ? ' on' : ''}" href="#/${id}" title="${label}">${ic}<span class="lbl">${label}</span>${badge}</a>`;
  }).join('');
  const projs = activeProjects().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 8);
  const projHtml = projs.length ? projs.map(p => {
    const it = projItems(p); const pr = progress(p, it); const cs = curStage(p, it);
    return `<a class="proj nav" href="#/project/${p.id}" aria-label="${esc(p.name)}"><span class="prow"><span class="dot" style="background:${dColor(p.designer)}"></span><span class="lbl">${esc(p.name)}</span></span>
      <span class="pop" aria-hidden="true"><span style="display:flex;justify-content:space-between;gap:8px;align-items:baseline"><span style="font-size:13px;font-weight:600;color:var(--ink)">${esc(p.name)}</span><span class="mono" style="font-size:11px;color:var(--muted)">${pr.done}/${pr.total}</span></span><span class="pbar" style="height:4px"><i style="width:${pr.pct}%;background:${dColor(p.designer)}"></i></span><span style="font-size:11.5px;color:var(--muted)">${STAGES[cs]}</span></span>
      <span class="pbar"><i style="width:${pr.pct}%;background:${dColor(p.designer)}"></i></span></a>`;
  }).join('') : `<div class="lbl" style="font-size:12.5px;color:var(--muted);padding:2px 10px;white-space:normal">No open projects yet</div>`;
  return `<aside class="side${U.collapsed ? ' collapsed' : ''}">
    <a class="brand" href="#/projects" title="Green Screen"><span class="logo">${I.leaf()}</span><span class="lbl" style="font-weight:600;font-size:16px;letter-spacing:-.01em;color:var(--ink)">Green Screen</span></a>
    <nav class="navlist" aria-label="Main">${navHtml}</nav>
    <div style="display:flex;flex-direction:column;gap:6px;min-height:0">
      <div class="sidehead"><span class="lbl">Open projects</span></div>
      <div class="sideprojs">${projHtml}</div>
    </div>
    <a href="#/settings" class="syncind" id="syncind"></a>
    <button class="toggle press" data-act="toggleSide" aria-label="${U.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}" title="${U.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}">${I.collapse}<span class="lbl">Collapse</span></button>
  </aside>`;
}
function syncText() {
  const s = S.sync.state;
  if (s === 'saved') return ['Saved', ago(S.sync.at), 'All changes saved · synced across your devices'];
  if (s === 'saving') return ['Saving…', '', 'Sending your latest changes to the cloud'];
  if (s === 'offline') return ['Offline', '', "You're offline · changes are kept on this device and will sync when you're back"];
  if (s === 'local') return ['This device', '', 'Local test mode · changes are saved in this browser only'];
  return ['Sync problem', '', S.sync.msg || 'Something went wrong while saving'];
}
function renderSync() {
  const el = document.getElementById('syncind'); if (!el) return;
  const [a, b, title] = syncText();
  el.className = 'syncind sync-' + S.sync.state;
  el.title = title; el.setAttribute('aria-label', 'Sync status: ' + a);
  el.innerHTML = `<span class="sdot" aria-hidden="true"></span><span class="lbl">${esc(a)}</span>${b ? `<span class="stime lbl">${esc(b)}</span>` : ''}`;
}
function renderToast() {
  const box = document.getElementById('toastbox'); if (!box) return;
  const t = U.toast;
  box.innerHTML = t ? `<div class="toast" role="status" aria-live="polite">${I.tick(14, 'currentColor')}<span class="tt">${esc(t.text)}</span>${t.canUndo ? `<button id="gs-undo" class="toastbtn press" data-act="undo">Undo <span class="kbd">Ctrl/⌘ Z</span></button>` : ''}</div>` : '';
  if (t && t.canUndo) setTimeout(() => { const b = document.getElementById('gs-undo'); if (b && !/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '')) b.focus({ preventScroll: true }); }, 30);
  if (box.firstElementChild) box.firstElementChild.closest('#toastbox').style.cssText = '';
  // themed even though outside gs-root
  box.className = 'gs-' + U.theme;
}
function renderPage() {
  switch (U.route.page) {
    case 'projects': return pageProjects();
    case 'project': return pageProject();
    case 'settings': return pageSettings();
    case 'dashboard': return pageSoon('Dashboard', 'Round 2', 'Urgent tasks, an Operations snapshot and your recently edited projects.');
    case 'tasklist': return pageSoon('Tasklist', 'Round 2', 'Every open step from each project’s current stage, grouped by priority.');
    case 'due': return pageSoon('Due Soon', 'Round 2', 'Overdue and upcoming target dates for the next two weeks.');
    case 'workflow': return pageSoon('Workflow', 'Round 2', 'Edit the 40-step template: titles, details, order and optional steps.');
    case 'operations': return pageSoon('Operations', 'Round 3', 'Needs processing, the install schedule, crew leaders and the ops email builder.');
    case 'archived': return pageSoon('Archived', 'Round 3', 'Archived projects with the 14-day cleanout, pinning and restore.');
    default: return pageProjects();
  }
}
function pageSoon(title, round, text) {
  return `<div class="phead"><div><div class="eyebrow">Coming in ${round}</div><h1>${title}</h1></div></div>
    <div class="soon rise"><span class="tag">${round.toUpperCase()}</span><h2 style="margin-bottom:6px">${title} is on its way</h2><p class="muted" style="margin:0 0 16px">${esc(text)} Everything you enter now on Projects and the project pages will show up here automatically once it’s built.</p><a class="btn" href="#/projects">${I.folder}Go to Projects</a></div>`;
}

/* ============================================================
   PAGE — Projects (file cabinet)
   ============================================================ */
function pageProjects() {
  const q = U.search.trim().toLowerCase();
  const all = activeProjects();
  const list = all.filter(p => !q || (p.name + ' ' + p.address + ' ' + p.po).toLowerCase().includes(q));
  const sorts = [['stage', 'Furthest stage'], ['recent', 'Recently edited'], ['urgent', 'Most urgent'], ['open', 'Most open steps']];
  const head = `<div class="phead"><div><div class="eyebrow">${all.length} active ${all.length === 1 ? 'project' : 'projects'}</div><h1>Projects</h1></div>
    <div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px">
      <label><span class="sr">Search projects</span><input id="f-search" class="search" placeholder="Search client, address or PO" value="${esc(U.search)}" data-input="search" autocomplete="off"></label>
      <label><span class="sr">Sort</span><select class="sel" data-change="sort">${sorts.map(([v, l]) => `<option value="${v}"${U.sort === v ? ' selected' : ''}>${l}</option>`).join('')}</select></label>
      <button class="btn pri press" data-act="newProject">${I.plus}New project</button>
    </div></div>`;
  if (!all.length) {
    return head + `<div class="empty rise"><h2>No projects yet</h2><p>Start your first project and it’ll be filed here by designer, like drawers in a cabinet.</p><button class="btn pri press" data-act="newProject">${I.plus}New project</button></div>`;
  }
  const sorter = (a, b) => {
    const A = stageCounts(a), B = stageCounts(b);
    if (U.sort === 'recent') return (b.updatedAt || 0) - (a.updatedAt || 0);
    if (U.sort === 'urgent') return (B.urgent - A.urgent) || (B.medium - A.medium) || ((b.updatedAt || 0) - (a.updatedAt || 0));
    if (U.sort === 'open') return (B.open - A.open) || ((b.updatedAt || 0) - (a.updatedAt || 0));
    return (B.cs - A.cs) || ((b.updatedAt || 0) - (a.updatedAt || 0));
  };
  const groups = designers().map(d => ({ d, rows: list.filter(p => p.designer === d.id) }));
  const known = new Set(designers().map(d => d.id));
  const orphans = list.filter(p => !known.has(p.designer));
  if (orphans.length) groups.push({ d: { id: '_none', name: 'Unassigned', color: 'slate' }, rows: orphans });
  const drawers = groups.filter(g => g.rows.length || !q).map((g, gi) => {
    const open = U.drawers[g.d.id] !== false;
    const rows = g.rows.slice().sort(sorter);
    const showAll = U.showAll[g.d.id];
    const vis = showAll ? rows : rows.slice(0, 10);
    const body = !open ? '' : rows.length ? `<div class="fgrid">${vis.map(folderHtml).join('')}</div>${rows.length > 10 ? `<div class="more"><button class="btn press" data-act="showAll" data-id="${g.d.id}">${showAll ? 'Show fewer' : 'Show all ' + rows.length}</button></div>` : ''}`
      : `<div style="padding:4px 16px 16px;font-size:13px;color:var(--muted)">No projects in this drawer yet.</div>`;
    return `<section class="drawer rise${open ? ' open' : ''}" style="animation-delay:${gi * 60}ms">
      <button class="dhead" data-act="drawer" data-id="${g.d.id}" aria-expanded="${open}">${I.chev()}<span class="dot" style="width:9px;height:9px;background:var(--c-${g.d.color})"></span><span style="font-size:15px;font-weight:600">${esc(g.d.name)}</span><span class="mono" style="font-size:12px;color:var(--muted)">${g.rows.length}</span></button>${body}</section>`;
  }).join('');
  const none = q && !list.length ? `<div class="empty">No projects match “${esc(U.search)}”.</div>` : '';
  return head + drawers + none;
}
function folderHtml(p) {
  const it = projItems(p); const cs = curStage(p, it); const pr = progress(p, it); const sc = stageCounts(p, it);
  let meta = 'Edited ' + ago(p.updatedAt), hot = false;
  if (U.sort === 'urgent') { meta = sc.urgent || sc.medium ? [sc.urgent ? sc.urgent + ' urgent' : '', sc.medium ? sc.medium + ' medium' : ''].filter(Boolean).join(' · ') : 'Nothing urgent'; hot = sc.urgent > 0; }
  if (U.sort === 'open') meta = sc.open + ' open in stage';
  const cls = 'fwrap' + (U.leaving[p.id] ? ' ' + U.leaving[p.id] : '') + (U.back[p.id] ? ' back' : '');
  return `<div class="${cls}" data-pid="${p.id}">
    <div class="folder press" role="button" tabindex="0" data-act="openProject" data-id="${p.id}" aria-label="Open ${esc(p.name)}">
      <span class="ftab"><span class="tabdot"></span>${SHORT[cs]}</span>
      <span class="fpaper" aria-hidden="true"></span>
      <span class="fcover">
        <span style="display:flex;flex-direction:column;gap:1px;min-width:0"><span style="display:flex;align-items:center;gap:6px;min-width:0"><span class="dot" style="width:7px;height:7px;background:${dColor(p.designer)}"></span><span class="fname">${esc(p.name)}</span></span><span class="faddr">${esc(p.address) || '<span style="opacity:.6">No address</span>'}</span></span>
        <span class="fmeta"><label class="mono" style="font-size:11px;display:inline-flex;align-items:center;gap:5px" data-stop="1">PO<input class="fpo" id="po-${p.id}" value="${esc(p.po)}" placeholder="Add PO#" data-commit="po" data-id="${p.id}" aria-label="PO number for ${esc(p.name)}" autocomplete="off"></label><span class="${hot ? 'hot' : ''}">${esc(meta)}</span></span>
        <span style="display:flex;align-items:center;gap:8px"><span style="flex:1;display:flex;gap:2px">${STAGES.map((_, i) => `<span class="mseg${i < cs ? ' on' : i === cs ? ' now' : ''}"></span>`).join('')}</span><span class="mono" style="font-size:11px;color:var(--muted)">${pr.pct}%</span></span>
      </span>
    </div>
    <div class="facts"><button class="ibtn press" data-act="archiveFolder" data-id="${p.id}" title="Archive" aria-label="Archive ${esc(p.name)}">${I.box(14)}</button><button class="ibtn del press" data-act="deleteFolder" data-id="${p.id}" title="Delete" aria-label="Delete ${esc(p.name)}">${I.trash()}</button></div>
  </div>`;
}

/* ============================================================
   PAGE — Project
   ============================================================ */
function pageProject() {
  const p = S.projects[U.route.id];
  if (!p) {
    return `<div class="phead"><div><div class="crumb"><a href="#/projects">Projects</a></div><h1>Project not found</h1></div></div><div class="empty">This project may have been deleted or is still syncing. <a href="#/projects">Back to Projects</a></div>`;
  }
  const items = projItems(p);
  const cs = curStage(p, items);
  const pr = progress(p, items);
  const d = designer(p.designer);
  const m = U.menu;
  // header
  const dsMenu = m && m.kind === 'ds' ? `<div class="smenu left pop-in" role="menu">${designers().map(x => `<button class="mi${x.id === p.designer ? ' cur' : ''}" role="menuitemradio" aria-checked="${x.id === p.designer}" data-act="setDesigner" data-v="${x.id}"><span class="dot" style="background:var(--c-${x.color})"></span>${esc(x.name)}</button>`).join('')}</div>` : '';
  const head = `<div class="phead" style="align-items:flex-start;margin-bottom:20px">
    <div style="flex:1;min-width:280px">
      <div class="crumb"><a href="#/projects">Projects</a> <span>/</span> ${esc(p.name)}</div>
      <label><span class="sr">Client name</span><input id="h-name" class="hedit hname" value="${esc(p.name)}" data-commit="name" data-id="${p.id}" autocomplete="off"></label>
      <div class="hmeta">
        <span style="position:relative"><button class="hedit press" data-act="menu" data-kind="ds" data-key="ds" aria-haspopup="menu" aria-expanded="${!!dsMenu}" title="Change designer" style="display:flex;align-items:center;gap:6px;cursor:pointer"><span class="dot" style="background:${dColor(p.designer)}"></span>${esc(d.name)}<span style="opacity:.6;display:flex">${I.down}</span></button>${dsMenu}</span>
        <label style="display:flex"><span class="sr">Address</span><input id="h-addr" class="hedit" value="${esc(p.address)}" placeholder="Add address" data-commit="address" data-id="${p.id}" style="width:${Math.max(14, (p.address || '').length + 2)}ch" autocomplete="off"></label>
        <label style="display:flex;align-items:center;gap:2px"><span class="mono" style="font-size:12px">PO</span><input id="h-po" class="hedit mono" value="${esc(p.po)}" placeholder="Add PO#" data-commit="po" data-id="${p.id}" style="width:${Math.max(9, (p.po || '').length + 2)}ch;font-size:13px" autocomplete="off" aria-label="PO number"></label>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:8px;padding-top:20px">
      <button class="btn press" data-act="archiveProject" title="Archive project">${I.box(14)}Archive</button>
      <button class="btn del press" data-act="deleteProject" title="Delete project">${I.trash()}Delete</button>
    </div></div>`;
  const askArchive = cs === 6 && !p.noArchivePrompt && !U.gone;
  const archBar = askArchive ? `<div class="archbar pop-in" role="status"><span class="dico">${I.tick(12)}</span><span><span style="color:var(--ink);font-weight:500">Project Install is complete.</span> Archive this project? Warranty steps stay open if you keep it.</span><span style="margin-left:auto;display:flex;gap:6px"><button class="btn pri press" data-act="archiveProject" style="font-size:13px;padding:7px 12px">${I.box(14)}Archive project</button><button class="btn press" data-act="notNow">Not now</button></span></div>` : '';
  // stage bar
  const sw = U.sweep && U.sweep.pid === p.id ? U.sweep : null;
  const segs = STAGES.map((name, i) => {
    const cls = i < cs ? 'seg-on' : i === cs ? 'seg-now' : '';
    const anim = sw && sw.segs[i] !== undefined ? ` ${sw.kind}` : '';
    const title = i === cs ? name + ' — current stage' : 'Open to ' + name + (i > cs ? ' (marks earlier stages done)' : ' (reopens it and later stages)');
    return `<button class="segbtn ${cls}${anim}" data-act="seg" data-i="${i}" data-seg="${i}" title="${esc(title)}" aria-label="${esc(title)}" style="--d:${sw && sw.segs[i] !== undefined ? sw.segs[i] * 110 : 0}ms"><span class="segtrack"><i></i></span><span class="segname">${name}</span></button>`;
  }).join('');
  const stageCard = `<div class="card stagecard rise" data-cs="${cs}"><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px"><span style="font-size:13px;color:var(--muted)">Stage · <span style="color:var(--ink);font-weight:500">${STAGES[cs]}</span></span><span class="mono" style="font-size:12px;color:var(--muted)">${pr.done} of ${pr.total} steps</span></div><div class="segrow" id="segrow">${segs}</div></div>`;
  // completed bar
  let doneBar = '';
  if (cs > 0) {
    const showDone = !!U.showDone[p.id];
    doneBar = `<div class="donebar rise"><button class="ibtn press" data-act="toggleDone" aria-expanded="${showDone}" title="${showDone ? 'Hide' : 'Show'} completed stages" style="width:28px;height:28px">${I.chev()}</button><span style="font-size:13px;font-weight:500">Completed stages</span>${STAGES.slice(0, cs).map((n, i) => `<button class="dchip press" data-act="reopen" data-i="${i}" title="Reopen ${esc(n)}"><span class="ck"><span class="tk" style="display:flex">${I.tick(8)}</span><span class="re" style="display:flex">${I.reopen}</span></span>${esc(n)}</button>`).join('')}</div>`;
    if (showDone) doneBar = doneBar.replace('class="ibtn press" data-act="toggleDone"', 'class="ibtn press" style="transform:rotate(90deg)" data-act="toggleDone"');
  }
  const stagesToShow = [];
  for (let si = 0; si < 7; si++) { if (si < cs && !U.showDone[p.id]) continue; stagesToShow.push(si); }
  const cards = stagesToShow.map(si => stageHtml(p, si, cs, items)).join('');
  return head + archBar + stageCard + `<div style="display:flex;flex-direction:column;gap:10px">${doneBar}${cards}</div>`;
}
function stageHtml(p, si, cs, items) {
  const list = stageItems(p, si, items);
  const key = p.id + ':' + si;
  const open = U.open[key] !== undefined ? U.open[key] : si === cs;
  const counted = list.filter(x => x.st.s !== 'N/A');
  const done = counted.filter(x => x.st.s === 'Done').length;
  const badge = si < cs ? '' : si === cs ? '<span class="badge cur">CURRENT</span>' : '<span class="badge up">UPCOMING</span>';
  const src = si === 5 ? '<span class="badge custom">CUSTOM STAGE</span>' : '';
  const opsBtn = (si === 4 || si === 5) ? `<button class="opslink press" data-act="goOps" title="See this stage across all jobs">${I.truck(13)}Operations ›</button>` : '';
  const pending = list.some(x => !isClosed(x.st.s));
  const actBtn = si < cs ? `<button class="btn press" data-act="reopen" data-i="${si}" style="font-size:12px;padding:5px 10px">${I.reopen}Reopen stage</button>`
    : pending ? `<button class="btn press" data-act="complete" data-i="${si}" style="font-size:12px;padding:5px 10px">${I.tick(12, 'currentColor')}Complete stage</button>` : '';
  const head = `<div class="shead" data-act="stage" data-i="${si}" role="button" tabindex="0" aria-expanded="${open}">${I.chev()}<span class="sname">${STAGES[si]}</span>${badge}${src}<span class="mono" style="font-size:12px;color:var(--muted)">${done}/${counted.length}</span><span style="margin-left:auto;display:flex;gap:8px;align-items:center" data-stop="1">${opsBtn}${actBtn}</span></div>`;
  if (!open) return `<section class="stage${si < cs ? ' isdone' : ''}">${head}</section>`;
  const rows = list.map(x => rowHtml(p, x)).join('');
  const colh = `<div class="colhead prow-grid"><span></span><span>#</span><span>Step</span><span></span><span>Target date</span><span></span><span>Status</span></div>`;
  return `<section class="stage open${si < cs ? ' isdone' : ''}">${head}<div class="sbody">${colh}${rows}
    <div style="display:flex;align-items:center;gap:10px;padding:6px 10px 2px;border-top:1px solid var(--line)"><span style="width:22px;display:grid;place-items:center;color:var(--muted)">${I.plus}</span><label style="flex:1;display:flex"><span class="sr">Add a step to ${STAGES[si]}</span><input id="add-${si}" class="addin" placeholder="Add step to this project — press Enter" data-add="${si}" autocomplete="off"></label></div>
  </div></section>`;
}
function rowHtml(p, x) {
  const k = x.key, m = U.menu, mk = p.id + ':' + k;
  const st = x.st;
  const c = U.casc && U.casc.pid === p.id && U.casc.ids[k] !== undefined ? U.casc.ids[k] : null;
  const un = U.unc && U.unc.pid === p.id && U.unc.ids[k] !== undefined ? U.unc.ids[k] : null;
  let cls = 'step prow-grid';
  if (st.s === 'Done' || c !== null) cls += ' done';
  if (st.s === 'N/A') cls += ' na';
  if (c !== null) cls += ' casc';
  if (un !== null) cls += ' unc';
  if (U.justDone === mk) cls += ' justdone';
  const delay = c !== null ? c * 55 : un !== null ? un * 45 : 0;
  // due
  const hasDue = !!st.due;
  const dOpen = m && m.kind === 'due' && m.key === mk;
  const dueMenu = dOpen ? `<div class="smenu pop-in" role="menu" style="min-width:210px"><div class="mhead">Target date</div>${quickDates().map(q => `<button class="mi" role="menuitem" data-act="setDue" data-k="${k}" data-v="${q.iso}">${q.label}<span class="hint">${q.hint}</span></button>`).join('')}<label class="mpick">Pick a date<input type="date" value="${st.due}" data-change="pickDue" data-k="${k}"></label>${hasDue ? `<button class="mi danger" role="menuitem" data-act="setDue" data-k="${k}" data-v="">Clear date</button>` : ''}</div>` : '';
  const due = `<div style="position:relative;min-width:0"><button class="duebtn press tone-${dueTone(st.due)}${hasDue ? '' : ' empty'}" data-act="menu" data-kind="due" data-key="${mk}" aria-haspopup="menu" aria-expanded="${dOpen}" title="Set target date">${I.cal}${hasDue ? esc(dueLabel(st.due)) : 'Set date'}</button>${dueMenu}</div>`;
  // priority
  const sug = suggest(x);
  const pOpen = m && m.kind === 'pri' && m.key === mk;
  const nextLv = LEVELS[Math.min(LEVELS.indexOf(st.p) + 1, 2)];
  const bars = (lv) => `<span class="bars lv-${lv}"><i class="on"></i><i class="${lv !== 'LOW' ? 'on' : ''}"></i><i class="${lv === 'URGENT' ? 'on' : ''}"></i></span>`;
  const priMenu = pOpen ? `<div class="smenu pop-in" role="menu" style="min-width:190px">${sug ? `<div class="sugbox">Due ${esc(dueLabel(st.due))} · within 3 days<span style="display:flex;gap:6px"><button class="sugbtn press" data-act="raise" data-k="${k}">${I.arrowUp}Raise to ${PL[nextLv]}</button><button class="sugbtn plain press" data-act="dismiss" data-k="${k}">Dismiss</button></span></div>` : ''}${LEVELS.map(lv => `<button class="mi${lv === st.p ? ' cur' : ''}" role="menuitemradio" aria-checked="${lv === st.p}" data-act="setPri" data-k="${k}" data-v="${lv}">${bars(lv)}${PL[lv]}</button>`).join('')}</div>` : '';
  const pri = `<div style="position:relative"><button class="pbtn press tile-${st.p}" data-act="menu" data-kind="pri" data-key="${mk}" aria-haspopup="menu" aria-expanded="${pOpen}" title="Priority: ${PL[st.p]}${sug ? ' — due soon, consider raising' : ''}" aria-label="Priority: ${PL[st.p]}">${bars(st.p)}${sug ? `<span class="sugdot" aria-hidden="true">${I.arrowUp}</span>` : ''}</button>${priMenu}</div>`;
  // status
  const sOpen = m && m.kind === 'st' && m.key === mk;
  const shown = c !== null ? 'Done' : st.s;
  const stMenu = sOpen ? `<div class="smenu pop-in" role="menu" style="min-width:150px">${STATUSES.map(s => `<button class="mi${s === st.s ? ' cur' : ''}" role="menuitemradio" aria-checked="${s === st.s}" data-act="setStatus" data-k="${k}" data-v="${s}"><span class="chip chip-${SK[s]}"><span class="ico ico-${SK[s]}"></span>${s}</span></button>`).join('')}</div>` : '';
  const status = `<div style="position:relative"><button class="chip chipbtn press chip-${SK[shown]}" data-act="menu" data-kind="st" data-key="${mk}" aria-haspopup="menu" aria-expanded="${sOpen}" aria-label="Status: ${shown}"><span class="ico ico-${SK[shown]}"></span>${shown}</button>${stMenu}</div>`;
  // title cell
  const isProc = x.kind === 't' && (x.n === 25 || x.n === 26);
  const procBtn = isProc ? `<button class="opslink sm press" data-act="goOps" title="${x.n === 26 ? 'Write the ops email on Operations' : 'Processing step · open Operations'}">${x.n === 26 ? 'EMAIL ›' : 'OPS ›'}</button>` : '';
  const noteIc = st.note ? `<span class="noteic" title="Has a note">${I.note}</span>` : '';
  const tag = x.kind === 'c' ? '<span class="ptag">THIS PROJECT</span>' : '';
  const titleCell = `<span style="display:flex;align-items:center;gap:8px;min-width:0"><span class="stitle" data-act="expand" data-k="${k}" title="${esc(x.title)}">${esc(x.title)}</span>${tag}${noteIc}</span>`;
  // tools
  let tools = '';
  if (x.kind === 'c') {
    const cs = (p.custom || []).filter(cc => cc.stage === x.stage); const idx = cs.findIndex(cc => cc.id === k);
    tools = `<button class="ibtn press" data-act="moveCustom" data-k="${k}" data-v="-1" title="Move up" ${idx <= 0 ? 'disabled' : ''}>${I.up}</button><button class="ibtn press" data-act="moveCustom" data-k="${k}" data-v="1" title="Move down" ${idx >= cs.length - 1 ? 'disabled' : ''}>${I.dn}</button><button class="ibtn del press" data-act="deleteCustom" data-k="${k}" title="Delete step">${I.trash()}</button>`;
  }
  const toolsCell = `<span class="toolcell" style="display:flex;align-items:center;gap:4px;justify-content:flex-end">${procBtn}<span class="tools">${tools}</span></span>`;
  const exp = U.expanded[mk] ? `<div class="sexp">${x.detail ? `<span>${esc(x.detail)}</span>` : ''}<label style="display:block"><span class="sr">Note</span><textarea id="note-${k}" class="note" rows="2" placeholder="Add a note for this project…" data-commit="note" data-k="${k}">${esc(st.note)}</textarea></label></div>` : '';
  return `<div class="${cls}" style="--d:${delay}ms" data-k="${k}"><button class="check press" data-act="toggle" data-k="${k}" aria-label="${st.s === 'Done' ? 'Mark not done' : 'Mark done'}">${I.tick()}</button><span class="snum">${x.n || ''}</span>${titleCell}${toolsCell}${due}${pri}${status}${exp}</div>`;
}

/* ============================================================
   PAGE — Settings (round 1: appearance + data)
   ============================================================ */
function pageSettings() {
  const TH = { sand: ['#F2ECE1', '#EAE2D3', '#FBF8F2', '#2A2924', '#3E5940', 'Default'], moss: ['#121613', '#151915', '#1A1F1B', '#E6E2D6', '#A8C096', 'Dark'], stone: ['#ECECE8', '#E3E3DE', '#F9F9F7', '#25272A', '#44574B', 'Neutral'] };
  const tcards = Object.entries(TH).map(([id, [bg, side, panel, ink, acc, note]]) => `<button class="tcard press${U.theme === id ? ' on' : ''}" data-act="theme" data-v="${id}" aria-pressed="${U.theme === id}"><span class="tprev" style="background:${bg}"><span style="width:28%;background:${side}"></span><span style="flex:1;padding:8px;display:flex;flex-direction:column;gap:6px"><span style="height:8px;width:60%;border-radius:3px;background:${ink};opacity:.8"></span><span style="flex:1;border-radius:5px;background:${panel};display:flex;align-items:flex-end;padding:5px"><span style="height:4px;width:70%;border-radius:2px;background:${acc}"></span></span></span></span><span style="display:flex;justify-content:space-between"><span style="font-weight:500">${id[0].toUpperCase() + id.slice(1)}</span><span class="muted" style="font-size:12px">${note}</span></span></button>`).join('');
  const [a, b] = syncText();
  const np = activeProjects().length, na = Object.values(S.projects).filter(p => p.archived).length;
  return `<div class="phead"><div><div class="eyebrow">Version ${APP_VERSION}</div><h1>Settings</h1></div></div>
  <section class="card scard rise"><h2>Appearance</h2><p class="sub">Saved on this device.</p><div class="tcards">${tcards}</div>
    <div class="rowline"><span><span style="display:block;font-size:13.5px;font-weight:500">Motion</span><span style="font-size:12.5px;color:var(--muted)">Animations for completing steps, stages and opening folders. Off keeps everything instant.</span></span><button class="tog${U.motion ? ' on' : ''}" data-act="motion" aria-pressed="${U.motion}" aria-label="Animations"></button></div></section>
  <section class="card scard rise" style="animation-delay:60ms"><h2>Data &amp; backup</h2><p class="sub">Everything saves automatically and stays in sync across your devices.</p>
    <div class="rowline"><span style="display:flex;align-items:center;gap:10px"><span class="syncind sync-${S.sync.state}" style="margin:0;padding:0;pointer-events:none"><span class="sdot"></span></span><span><span style="display:block;font-size:13.5px;font-weight:500">${esc(a)}${b ? ' · ' + esc(b) : ''}</span><span style="font-size:12.5px;color:var(--muted)">${esc(syncText()[2])}</span></span></span></div>
    <div class="rowline"><span><span style="display:block;font-size:13.5px;font-weight:500">Works offline</span><span style="font-size:12.5px;color:var(--muted)">Changes made without a connection are kept on this device and sent as soon as you’re back online. Other devices update live.</span></span><span class="mono" style="font-size:12px;color:var(--muted);flex:none">${np} ${np === 1 ? 'project' : 'projects'} · ${na} archived</span></div>
    <div class="rowline"><span><span style="display:block;font-size:13.5px;font-weight:500">Backup</span><span style="font-size:12.5px;color:var(--muted)">Download a copy of all projects, the workflow and settings to keep somewhere safe.</span></span><button class="btn press" data-act="backup">${I.download}Download backup</button></div></section>
  <section class="card scard rise" style="animation-delay:120ms"><h2>More settings</h2><p class="sub" style="margin:0">Designers, crew leaders, the Workflow shortcut, archive cleanout and Restore arrive in round 3.</p></section>`;
}

/* ============================================================
   NEW PROJECT MODAL
   ============================================================ */
const NPEND = [4, 11, 18, 24, 33, 38, 40];
function openNewProject() {
  U.np = { name: '', address: '', po: '', d: lsGet(LS.lastDesigner, (designers()[0] || {}).id || 'isaiah'), stage: 0, err: false, go: false };
  if (!designers().some(d => d.id === U.np.d)) U.np.d = (designers()[0] || {}).id;
  renderModal();
  setTimeout(() => { const el = document.getElementById('np-name'); if (el) el.focus(); }, 30);
}
function npDup() { const n = (U.np.name || '').trim().toLowerCase(); if (!n) return null; return activeProjects().find(p => p.name.trim().toLowerCase() === n) || null; }
function npStageNote() { const s = U.np.stage; return s === 0 ? 'nothing marked done yet' : 'steps 1–' + NPEND[s - 1] + ' will be marked done'; }
function renderModal() {
  const box = document.getElementById('overlay'); if (!box) return;
  box.className = 'gs-' + U.theme;
  const np = U.np;
  if (!np) { box.innerHTML = ''; return; }
  const dup = npDup();
  const first = !np.shown; np.shown = true;
  box.innerHTML = `<div class="scrim${first ? ' first' : ''}" data-act="npClose"></div>
  <div class="npcard${np.go ? ' go' : ''}${first ? ' first' : ''}" role="dialog" aria-modal="true" aria-label="New project" style="font-family:'Geist',ui-sans-serif,system-ui,sans-serif;color:var(--ink)">
    <div style="display:flex;align-items:center;gap:10px"><span style="font-size:17px;font-weight:600;letter-spacing:-.01em">New project</span><button class="ibtn press" data-act="npClose" aria-label="Cancel" title="Cancel (Esc)" style="margin-left:auto;width:30px;height:30px">${I.x(16)}</button></div>
    <label class="npf"><span>Client name</span><input id="np-name" class="npin big${np.err && !np.name.trim() ? ' err' : ''}" placeholder="e.g. Hendricks Residence" value="${esc(np.name)}" data-np="name" autocomplete="off"></label>
    <div id="np-dup">${dup ? `<div class="npdup pop-in">There’s already a project called ${esc(dup.name)}.<a data-act="npOpenDup" data-id="${dup.id}">Open it ›</a></div>` : ''}</div>
    <label class="npf"><span>Address</span><input id="np-addr" class="npin" placeholder="Street address" value="${esc(np.address)}" data-np="address" autocomplete="off"></label>
    <div style="display:grid;grid-template-columns:minmax(0,1fr) 150px;gap:12px;align-items:end">
      <div class="npf"><span>Designer</span><span role="radiogroup" aria-label="Designer" style="display:flex;gap:6px;flex-wrap:wrap">${designers().map(d => `<button class="npdz press${d.id === np.d ? ' on' : ''}" role="radio" aria-checked="${d.id === np.d}" data-act="npDesigner" data-v="${d.id}"><span class="dot" style="background:var(--c-${d.color})"></span>${esc(firstName(d.name))}</button>`).join('')}</span></div>
      <label class="npf"><span>PO# (optional)</span><input id="np-po" class="npin mono" placeholder="Add later" value="${esc(np.po)}" data-np="po" autocomplete="off" style="font-size:13px"></label>
    </div>
    <div class="npf"><span>Starting stage</span>
      <div style="display:flex;gap:4px" role="radiogroup" aria-label="Starting stage">${STAGES.map((n, i) => `<button class="npseg${i < np.stage ? ' on' : i === np.stage ? ' now' : ''}" role="radio" aria-checked="${i === np.stage}" data-act="npStage" data-v="${i}" title="Start at ${n}" aria-label="Start at ${n}"><i></i></button>`).join('')}</div>
      <div class="npnote"><span style="color:var(--ink);font-weight:500">${STAGES[np.stage]}</span> · ${npStageNote()}${np.stage === 4 || np.stage === 5 ? `<span class="npops">${I.truck(11)} Shows on Operations</span>` : ''}</div>
    </div>
    <div style="display:flex;align-items:center;gap:8px;border-top:1px solid var(--line);padding-top:12px;margin-top:2px"><span style="font-size:12px;color:var(--muted)">Enter to create · Esc to cancel</span><button class="btn ghost press" data-act="npClose" style="margin-left:auto;font-size:14px;padding:8px 14px">Cancel</button><button id="np-create" class="btn pri press" data-act="npCreate" ${np.name.trim() ? '' : 'disabled style="opacity:.45;cursor:default"'}>Create project</button></div>
  </div>`;
}
function npCreate() {
  const np = U.np; if (!np || np.go) return;
  if (!np.name.trim()) { np.err = true; renderModal(); const el = document.getElementById('np-name'); if (el) el.focus(); return; }
  lsSet(LS.lastDesigner, np.d);
  const p = newProject({ name: np.name.trim(), address: np.address.trim(), po: np.po.trim(), designerId: np.d, stage: np.stage });
  const finish = () => {
    U.np = null; renderModal();
    putProject(p);
    pushUndo(p.name + ' created', () => removeProject(p.id));
    location.hash = '#/project/' + p.id;
  };
  if (!motionOK()) return finish();
  np.go = true; renderModal();
  setTimeout(finish, 260);
}

/* ============================================================
   ACTIONS — project page
   ============================================================ */
function curP() { return S.projects[U.route.id]; }
function toggleStep(k) {
  const p = curP(); if (!p) return;
  const x = getItem(p, k); if (!x) return;
  const done = x.st.s === 'Done';
  const before = curStage(p);
  const q0 = clone(p); setItem(q0, k, done ? { s: 'Not Started' } : { s: 'Done' }); const after = curStage(q0);
  if (after !== before) U.open[p.id + ':' + after] = true;
  if (!done && motionOK()) { U.justDone = p.id + ':' + k; setTimeout(() => { U.justDone = null; }, 500); }
  mutate(p.id, q => setItem(q, k, done ? { s: 'Not Started', doneAt: '' } : { s: 'Done', doneAt: todayISO() }), '“' + x.title + '” ' + (done ? 'unchecked' : 'marked done'));
}
function completeThrough(idx) {
  const p = curP(); if (!p || U.casc) return;
  const items = projItems(p); const cs = curStage(p, items);
  const targets = items.filter(x => x.stage <= idx && !isClosed(x.st.s));
  if (!targets.length) return;
  for (let k = cs; k <= idx; k++) U.open[p.id + ':' + k] = true;
  const ids = {}; targets.filter(x => x.stage >= cs).forEach((x, i) => { ids[x.key] = i; });
  const label = idx > cs ? STAGES[cs] + ' – ' + STAGES[idx] + ' marked complete' : STAGES[idx] + ' marked complete';
  const commit = () => {
    U.casc = null;
    for (let k = 0; k <= idx; k++) delete U.open[p.id + ':' + k];
    const segs = {}; for (let k = cs, n = 0; k <= idx; k++, n++) segs[k] = n;
    U.sweep = motionOK() ? { pid: p.id, segs, kind: 'sweep' } : null;
    mutate(p.id, q => { targets.forEach(x => setItem(q, x.key, { s: 'Done', doneAt: todayISO() })); }, label);
    setTimeout(() => { U.sweep = null; }, 1300);
  };
  if (!motionOK()) return commit();
  U.casc = { pid: p.id, ids }; render();
  setTimeout(commit, Math.min(Object.keys(ids).length, 14) * 55 + 420);
}
function reopenFrom(idx) {
  const p = curP(); if (!p || U.casc) return;
  const items = projItems(p); const cs = curStage(p, items);
  const toReset = items.filter(x => x.stage >= idx && x.st.s === 'Done');
  const inStage = toReset.filter(x => x.stage === idx);
  const ids = {}; inStage.forEach((x, i) => { ids[x.key] = inStage.length - 1 - i; });
  Object.keys(U.open).forEach(k => { if (k.startsWith(p.id + ':')) delete U.open[k]; });
  U.open[p.id + ':' + idx] = true; U.showDone[p.id] = false;
  const segs = {}; for (let k = Math.max(cs, idx), n = 0; k >= idx; k--, n++) segs[k] = n;
  if (motionOK()) { U.unc = { pid: p.id, ids }; U.sweep = { pid: p.id, segs, kind: 'drain' }; }
  mutate(p.id, q => { toReset.forEach(x => setItem(q, x.key, { s: 'Not Started', doneAt: '' })); q.noArchivePrompt = false; }, 'Back to ' + STAGES[idx] + (idx < 6 ? ' · later stages reopened' : ''));
  setTimeout(() => { U.unc = null; U.sweep = null; }, Math.max(1100, inStage.length * 45 + 800));
}
function segPick(i) {
  const p = curP(); if (!p) return; const cs = curStage(p);
  if (i < cs) reopenFrom(i); else if (i > cs) completeThrough(i - 1);
}
function previewSeg(i) {
  const row = document.getElementById('segrow'); if (!row) return;
  const cs = Number(row.closest('[data-cs]').dataset.cs);
  [...row.children].forEach((b, j) => {
    b.classList.remove('seg-on', 'seg-now', 'seg-ghost', 'pv');
    if (i === null || i === cs) { b.classList.add(j < cs ? 'seg-on' : j === cs ? 'seg-now' : 'x'); }
    else { b.classList.add('pv', j < i ? 'seg-on' : j === i ? 'seg-now' : 'seg-ghost'); }
  });
}
function archiveCurrent() {
  const p = curP(); if (!p) return;
  const before = clone(p);
  const q = clone(p); q.archived = true; q.archivedAt = Date.now(); q.pinned = false;
  putProject(q);
  pushUndo(p.name + ' archived', () => putProject(before, { keepTime: true }));
  go('#/projects', { exit: true });
}
function deleteCurrent() {
  const p = curP(); if (!p) return;
  const before = clone(p);
  go('#/projects', { exit: true });
  setTimeout(() => { removeProject(p.id); pushUndo(p.name + ' deleted', () => putProject(before, { keepTime: true })); }, motionOK() ? 240 : 0);
}

/* ============================================================
   EVENTS
   ============================================================ */
function commitField(el) {
  const f = el.dataset.commit;
  const id = el.dataset.id || U.route.id;
  const p = S.projects[id]; if (!p) return;
  const v = el.value.trim();
  if (f === 'note') {
    const k = el.dataset.k; const x = getItem(p, k); if (!x || (x.st.note || '') === el.value) return;
    mutate(p.id, q => setItem(q, k, { note: el.value }), 'Note saved');
    return;
  }
  if (f === 'name' && !v) { el.value = p.name; return; }
  if ((p[f] || '') === v) return;
  const labels = { name: 'Renamed to ' + v, address: 'Address updated', po: v ? p.name + ' · PO# set to ' + v : p.name + ' · PO# cleared' };
  mutate(p.id, q => { q[f] = v; }, labels[f]);
}

app.addEventListener('focusout', (e) => {
  const el = e.target;
  if (el.dataset && el.dataset.commit) { U.busy = false; commitField(el); }
  if (pendingRender && !(document.activeElement && document.activeElement.dataset && document.activeElement.dataset.commit)) { pendingRender = false; render(); }
});
app.addEventListener('focusin', (e) => { if (e.target.dataset && e.target.dataset.commit) U.busy = false; });

document.addEventListener('keydown', (e) => {
  const t = e.target;
  const inField = /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || '');
  if (U.np) {
    if (e.key === 'Escape') { e.preventDefault(); U.np = null; renderModal(); return; }
    if (e.key === 'Enter' && !(t.dataset && t.dataset.act === 'npClose') && (t === document.body || document.getElementById('overlay').contains(t))) { e.preventDefault(); npCreate(); return; }
  }
  if (e.key === 'Escape' && U.menu) { U.menu = null; render(); return; }
  if (t.dataset && t.dataset.commit && t.tagName === 'INPUT' && (e.key === 'Enter' || e.key === 'Escape')) {
    if (e.key === 'Escape') { const p = S.projects[t.dataset.id || U.route.id]; if (p) t.value = p[t.dataset.commit] || ''; }
    e.preventDefault(); t.blur(); return;
  }
  if (t.dataset && t.dataset.add !== undefined && e.key === 'Enter') {
    e.preventDefault();
    const v = t.value.trim(); if (!v) return;
    const si = Number(t.dataset.add); const p = curP(); if (!p) return;
    const id = uid('c');
    mutate(p.id, q => { q.custom = q.custom || []; q.custom.push(Object.assign({ id, stage: si, title: v }, DEF_ST)); }, '“' + v + '” added');
    setTimeout(() => { const el = document.getElementById('add-' + si); if (el) { el.value = ''; el.focus(); } }, 0);
    return;
  }
  if (t.classList && t.classList.contains('folder') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openFolder(t); return; }
  if (t.classList && t.classList.contains('shead') && (e.key === 'Enter' || e.key === ' ') && t === e.target) { e.preventDefault(); toggleStage(Number(t.dataset.i)); return; }
  if (!inField && (e.metaKey || e.ctrlKey) && !e.shiftKey && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); doUndo(); }
});

document.addEventListener('input', (e) => {
  const t = e.target;
  if (t.dataset && t.dataset.np && U.np) {
    U.np[t.dataset.np] = t.value;
    if (t.dataset.np === 'name') {
      U.np.err = false; t.classList.remove('err');
      const dup = npDup(); const box = document.getElementById('np-dup');
      if (box) box.innerHTML = dup ? `<div class="npdup pop-in">There’s already a project called ${esc(dup.name)}.<a data-act="npOpenDup" data-id="${dup.id}">Open it ›</a></div>` : '';
      const btn = document.getElementById('np-create');
      if (btn) { if (t.value.trim()) { btn.disabled = false; btn.style.opacity = ''; btn.style.cursor = ''; } else { btn.disabled = true; btn.style.opacity = '.45'; btn.style.cursor = 'default'; } }
    }
    return;
  }
  if (t.dataset && t.dataset.input === 'search') { U.search = t.value; render(); }
  if (t.dataset && t.dataset.commit) U.busy = true;
});
document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.dataset && t.dataset.change === 'sort') { U.sort = t.value; lsSet(LS.sort, U.sort); render(); }
  if (t.dataset && t.dataset.change === 'pickDue' && t.value) { const p = curP(); const k = t.dataset.k; const x = p && getItem(p, k); U.menu = null; if (x) mutate(p.id, q => setItem(q, k, { due: t.value }), 'Target date set to ' + fmtDay(t.value)); }
});
app.addEventListener('mouseover', (e) => { const b = e.target.closest('[data-seg]'); if (b) previewSeg(Number(b.dataset.seg)); });
app.addEventListener('mouseout', (e) => { const b = e.target.closest('[data-seg]'); if (b && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('#segrow'))) previewSeg(null); });

function toggleStage(si) {
  const p = curP(); if (!p) return; const key = p.id + ':' + si; const cs = curStage(p);
  const open = U.open[key] !== undefined ? U.open[key] : si === cs; U.open[key] = !open; render();
}
function openFolder(el) {
  const id = el.dataset.id;
  if (!motionOK()) { location.hash = '#/project/' + id; return; }
  el.classList.add('opening');
  setTimeout(() => { location.hash = '#/project/' + id; }, 380);
}
function removeFolder(id, kind) {
  const p = S.projects[id]; if (!p || U.leaving[id]) return;
  const before = clone(p);
  const done = () => {
    delete U.leaving[id];
    if (kind === 'arch') { const q = clone(p); q.archived = true; q.archivedAt = Date.now(); q.pinned = false; putProject(q); }
    else removeProject(id);
    pushUndo(p.name + (kind === 'arch' ? ' archived' : ' deleted'), () => { U.back[id] = true; putProject(before, { keepTime: true }); setTimeout(() => { delete U.back[id]; }, 500); });
  };
  if (!motionOK()) return done();
  U.leaving[id] = kind; render();
  setTimeout(done, kind === 'arch' ? 480 : 260);
}

document.addEventListener('click', (e) => {
  const t = e.target;
  if (t.closest('.fpo')) return;
  const a = t.closest('[data-act]');
  const stop = t.closest('[data-stop]');
  if (stop && (!a || a.contains(stop))) return;
  if (!a) { if (U.menu && !t.closest('.smenu')) { U.menu = null; render(); } return; }
  const act = a.dataset.act, k = a.dataset.k, v = a.dataset.v;
  const p = curP();
  const closeMenu = () => { U.menu = null; };
  switch (act) {
    case 'undo': doUndo(); break;
    case 'toggleSide': U.collapsed = !U.collapsed; lsSet(LS.side, U.collapsed); render(); break;
    case 'newProject': openNewProject(); break;
    case 'npClose': if (U.np && !U.np.go) { U.np = null; renderModal(); } break;
    case 'npDesigner': U.np.d = v; renderModal(); break;
    case 'npStage': U.np.stage = Number(v); renderModal(); break;
    case 'npCreate': npCreate(); break;
    case 'npOpenDup': U.np = null; renderModal(); location.hash = '#/project/' + a.dataset.id; break;
    case 'drawer': U.drawers[a.dataset.id] = U.drawers[a.dataset.id] === false; lsSet(LS.drawers, U.drawers); render(); break;
    case 'showAll': U.showAll[a.dataset.id] = !U.showAll[a.dataset.id]; render(); break;
    case 'openProject': openFolder(a); break;
    case 'archiveFolder': removeFolder(a.dataset.id, 'arch'); break;
    case 'deleteFolder': removeFolder(a.dataset.id, 'gone'); break;
    case 'menu': { const m = { kind: a.dataset.kind, key: a.dataset.key }; U.menu = U.menu && U.menu.kind === m.kind && U.menu.key === m.key ? null : m; render(); break; }
    case 'setDesigner': closeMenu(); if (p && p.designer !== v) mutate(p.id, q => { q.designer = v; }, 'Designer changed to ' + designer(v).name); else render(); break;
    case 'toggle': toggleStep(k); break;
    case 'setStatus': closeMenu(); if (p) { const x = getItem(p, k); const before = curStage(p); if (x && x.st.s !== v) { mutate(p.id, q => setItem(q, k, { s: v, doneAt: v === 'Done' ? todayISO() : '' }), '“' + x.title + '” · ' + v); const after = curStage(S.projects[p.id]); if (after !== before) { U.open[p.id + ':' + after] = true; render(); } } else render(); } break;
    case 'setPri': closeMenu(); if (p) { const x = getItem(p, k); if (x && x.st.p !== v) mutate(p.id, q => setItem(q, k, { p: v }), '“' + x.title + '” · ' + PL[v] + ' priority'); else render(); } break;
    case 'raise': closeMenu(); if (p) { const x = getItem(p, k); const nv = LEVELS[Math.min(LEVELS.indexOf(x.st.p) + 1, 2)]; mutate(p.id, q => setItem(q, k, { p: nv }), '“' + x.title + '” raised to ' + PL[nv]); } break;
    case 'dismiss': closeMenu(); if (p) mutate(p.id, q => setItem(q, k, { dis: true })); break;
    case 'setDue': closeMenu(); if (p) { const x = getItem(p, k); mutate(p.id, q => setItem(q, k, { due: v, dis: false }), v ? 'Target date set to ' + fmtDay(v) : 'Target date cleared'); } break;
    case 'expand': if (p) { const key = p.id + ':' + k; U.expanded[key] = !U.expanded[key]; render(); if (U.expanded[key]) setTimeout(() => { const el = document.getElementById('note-' + k); if (el && !el.value) el.focus(); }, 0); } break;
    case 'moveCustom': if (p) mutate(p.id, q => { const list = q.custom; const i = list.findIndex(c => c.id === k); const st = list[i].stage; const same = list.map((c, j) => [c, j]).filter(([c]) => c.stage === st); const pos = same.findIndex(([c]) => c.id === k); const tgt = same[pos + Number(v)]; if (!tgt) return; const j = tgt[1]; [list[i], list[j]] = [list[j], list[i]]; }); break;
    case 'deleteCustom': if (p) { const x = getItem(p, k); mutate(p.id, q => { q.custom = q.custom.filter(c => c.id !== k); }, '“' + x.title + '” deleted'); } break;
    case 'stage': if (!t.closest('[data-stop]')) toggleStage(Number(a.dataset.i)); break;
    case 'complete': completeThrough(Number(a.dataset.i)); break;
    case 'reopen': reopenFrom(Number(a.dataset.i)); break;
    case 'toggleDone': if (p) { U.showDone[p.id] = !U.showDone[p.id]; render(); } break;
    case 'seg': previewSeg(null); segPick(Number(a.dataset.i)); break;
    case 'notNow': if (p) mutate(p.id, q => { q.noArchivePrompt = true; }); break;
    case 'archiveProject': archiveCurrent(); break;
    case 'deleteProject': deleteCurrent(); break;
    case 'goOps': go('#/operations', { exit: true }); break;
    case 'theme': U.theme = v; lsSet(LS.theme, v); render(); renderToast(); break;
    case 'motion': U.motion = !U.motion; lsSet(LS.motion, U.motion); render(); break;
    case 'backup': downloadBackup(); break;
  }
});

function downloadBackup() {
  const data = { app: 'Green Screen', version: APP_VERSION, exportedAt: new Date().toISOString(), projects: S.projects, workflow: S.workflow, settings: S.settings };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'green-screen-backup-' + todayISO() + '.json';
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  showToast('Backup downloaded', false);
}

/* ============================================================
   APP UPDATES (service worker)
   ============================================================ */
function showUpdate(reg) {
  const box = document.getElementById('updbox'); if (!box) return;
  box.className = 'gs-' + U.theme;
  box.innerHTML = `<div class="upd" style="font-family:'Geist',ui-sans-serif,system-ui,sans-serif;color:var(--ink)"><span>New version available</span><button class="btn pri press" id="upd-go" style="font-size:13px;padding:6px 12px">Reload</button></div>`;
  document.getElementById('upd-go').onclick = () => { if (reg.waiting) reg.waiting.postMessage('skipWaiting'); else location.reload(); };
}
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  let reloading = false; const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController && !reloading) { reloading = true; location.reload(); } });
  navigator.serviceWorker.register('./sw.js').then((reg) => {
    if (reg.waiting && navigator.serviceWorker.controller) showUpdate(reg);
    reg.addEventListener('updatefound', () => {
      const w = reg.installing; if (!w) return;
      w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) showUpdate(reg); });
    });
    setInterval(() => reg.update().catch(() => {}), 30 * 60 * 1000);
  }).catch((e) => console.warn('Service worker not registered', e));
}

/* ============================================================
   BOOT
   ============================================================ */
if (!location.hash) history.replaceState(null, '', '#/projects');
U.route = parseRoute();
render();
renderToast();
initCloud();
window.GS = { S, U, render, version: APP_VERSION };
