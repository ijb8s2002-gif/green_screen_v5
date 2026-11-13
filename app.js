/* Green Screen v5 — round 1: data & sync, sidebar & themes, New project, Projects, Project page */
const APP_VERSION = '5.4.2';

/* ============================================================
   CONSTANTS & DEFAULTS
   ============================================================ */
const STAGES = ['Appointment', 'Initial Design & Proposal', 'Ready to Present', 'Revise', 'Finalize & Process', 'Project Install', 'Backorders', 'Warranty Replacements'];
const SHORT = ['APPOINTMENT', 'INITIAL DESIGN', 'READY TO PRESENT', 'REVISE', 'FINALIZE & PROCESS', 'PROJECT INSTALL', 'BACKORDERS', 'WARRANTY'];
const STATUSES = ['Not Started', 'In Progress', 'Delayed', 'Assigned', 'Done', 'N/A'];
const SK = { 'Not Started': 'ns', 'In Progress': 'ip', 'Delayed': 'dl', 'Assigned': 'as', 'Done': 'dn', 'N/A': 'na' };
const LEVELS = ['LOW', 'MEDIUM', 'URGENT'];
const PL = { LOW: 'Low', MEDIUM: 'Medium', URGENT: 'Urgent' };
const COLORS = [['sage', 'Sage'], ['pine', 'Pine'], ['wheat', 'Wheat'], ['slate', 'Slate'], ['ochre', 'Ochre'], ['clay', 'Clay']];

const T = [[0, "Schedule Consult", ""], [0, "Create SharePoint Folder", "Link to existing Pipedrive deal and save to My Files"], [0, "Aerial Drawing", "Use measurements/contours from IA County Assessor or Beacon"], [0, "Initial Consult", "Meet client, take measurements & elevations on site"], [1, "Make Layout", ""], [1, "Sketch Prelim Options", "Design w/ client program, nursery list, and applicable site observations"], [1, "CAD Drawing", ""], [1, "CAD Redline Updates", "See notes on B&W copy in SharePoint"], [1, "Estimating Notes", "Highlight design regions on latest B&W plan"], [1, "Pipedrive: Estimating Task", "Clarify materials and existing site conditions w/ Estimating Team"], [1, "Pipedrive: Rendering Task", "Build in SketchUp; talk through view details w/ Graphics Team"], [2, "Schedule Present", ""], [2, "Review Plan & Proposal", "Make necessary edits to review sheet or B&W plan"], [2, "Color Rendering", ""], [2, "Plant Photo Sheet", "Build in Canva based off current perennial schedule"], [2, "Print Present Docs", "Includes proposal, sales review sheet, warranty info, nursery price list"], [2, "Customer Materials", "Paver samples & relevant past project pictures"], [2, "Design Present", ""], [3, "Client Follow-Up", "Check in with customer on plan revisions, sales progress, install timing"], [3, "Revision Meeting", "Finalize plan details, material specs, and pricing for approved project scope"], [3, "Update Plan & Proposal", ""], [3, "Finalize Sold Project", "Receive signed proposal + 25% deposit"], [3, "File Paperwork & Deposit", "Scan proposal into SharePoint & hand off deposit to business office"], [3, "Make Placeholder", "Pending updates and processed operations"], [4, "Prep Crewplan & Crewpics", ""], [4, "Send Ops Email", "Includes locates, relevant timing, manhours, most current review sheet"], [4, "Confirm Install Timing", "Reach out to client once project is added to tentative crew schedule"], [4, "Coordinate w/ Crew Leader", "Determine upcoming crew schedule w/ Group Leader and follow up w/ client"], [4, "Check Hardscape Materials", "Talk to Purchasing/Estimating Team"], [4, "Check Plant Availability", "Talk to Ames Tagging"], [4, "Request Utility Locates", ""], [4, "Special Order Perennials", "Talk to Nursery/Procurement Team about delivery timing prior to installation"], [4, "Confirm Tagged Plants", "Check at West Site and Retail locations to compare w/ current Tagging Sheet before project start"], [5, "Meet Crew Onsite", "Walk through installation details, best access, or flagged plantings"], [5, "Site Visit", "Monitor installation progress, address issues, layout perennial plantings, or meet w/ homeowner"], [5, "Process Completed Work Order", "Compare w/ onsite installation notes and edit subbed perennials for Nursery inventory"], [5, "Client Watering Instructions", ""], [5, "Take Finished Project Photos", ""], [6, "Pipedrive: Warranty Task", "Double-check any changes to warranty plant cultivars or original size"], [6, "Process Warranty Paperwork", ""]];
const DEFAULT_OPTIONAL = ['w11', 'w20', 'w32'];
/* Stage indexes: 0–5 as before, 6 = Backorders (custom, added v5.2.0), 7 = Warranty Replacements.
   T lists Warranty as 6 (its original index); it's moved to 7 here. Backorder steps get their own permanent ids. */
const ST_INSTALL = 5, ST_BACK = 6, ST_WARR = 7;
const CUSTOM_STAGES = [ST_INSTALL, ST_BACK];
const OPS_STAGES = [4, 5, ST_BACK, ST_WARR];
const BACKORDER_STEPS = [
  { id: 'wb1', stage: ST_BACK, title: 'Pipedrive: Backorder Task', detail: 'Double-check any changes to warranty plant cultivars or original size', optional: true },
  { id: 'wb2', stage: ST_BACK, title: 'Process Backorder Paperwork', detail: '', optional: true }];
const DEFAULT_WORKFLOW = (() => {
  const wf = T.map(([stage, title, detail], i) => ({ id: 'w' + (i + 1), stage: stage === 6 ? ST_WARR : stage, title, detail, optional: stage === 6 || DEFAULT_OPTIONAL.includes('w' + (i + 1)) }));
  const at = wf.findIndex(w => w.stage === ST_WARR);
  wf.splice(at < 0 ? wf.length : at, 0, ...BACKORDER_STEPS.map(b => Object.assign({}, b)));
  return wf;
})();
const DEFAULT_SETTINGS = {
  designers: [{ id: 'isaiah', name: 'Isaiah Bates', color: 'sage' }, { id: 'dan', name: 'Dan Van Weelden', color: 'pine' }, { id: 'justin', name: 'Justin Wigdahl', color: 'wheat' }],
  crews: ['Ken Small', 'Brad Oxley', 'Chuck Johnson', 'Jon Goodknight', 'Curtis Carlson', 'Michael Schreck', 'Kaleb Ross', 'Marcelo Montero', 'Evan Erichsen', 'Vaughn Gibson', 'Martin Huber', 'Peter Boman', 'Rob Lechnir', 'Rick Johnson', 'Nick Breuning'],
  retention: 14,
  opsEmailDefaults: {},
  tags: ['pool', 'meadow', 'planting', 'screening', 'patio', 'pergola', 'retaining-wall', 'firepit', 'walkway', 'steps', 'irrigation', 'lighting', 'water-feature', 'sod', 'drainage', 'grading', 'natives', 'trees', 'outdoor-kitchen', 'deck']
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
  leaf: (w = 28) => `<svg width="${w}" height="${w}" viewBox="0 0 120 120" aria-hidden="true"><g fill="var(--accentInk)"><path transform="translate(59 80) rotate(36)" d="M0 0C34 -15 30 -59 0 -76C-30 -59 -34 -15 0 0Z"></path><path transform="translate(59 80) rotate(-52)" d="M0 0C25 -11 22 -45 0 -58C-22 -45 -25 -11 0 0Z"></path></g><path d="M59 78L60 108" stroke="var(--accentInk)" stroke-width="7.5" stroke-linecap="round"></path><path d="M35 58.4L59 76L88.7 37.5" fill="none" stroke="var(--accent)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`,
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
  activity: (mirror && mirror.activity) || { days: {} },   // tally of auto-deleted projects' activity (stats)
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
  busy: false,
  tleave: {}, tback: {}, tgroups: {}, dgroups: {}, dsel: lsGet('gs5:dsel', 'all'), tsort: lsGet('gs5:tsort', 'due'), tsearch: '', dueDay: null,
  dash: lsGet('gs5:dash', {}), wopen: {}, wdrag: null,
  oleave: {}, oback: {}, aleave: {}, stats: lsGet('gs5:stats', false), pstats: lsGet('gs5:pstats', false), pstatsFresh: false, pstatsClosing: false, tagQ: '', tagHi: 0, tagSel: null, asearch: '', statsFresh: false, statsClosing: false, statRange: lsGet('gs5:statRange', 'month'), odrop: null, odrag: null, email: null, asort: lsGet('gs5:asort', 'recent')
};
const LOCAL_ONLY = location.protocol === 'file:' || /[?&]local\b/.test(location.search);

/* ============================================================
   DATA LAYER — one Firestore doc per project, live, offline-safe
   ============================================================ */
const cloud = { ready: false, db: null, fs: null, inflight: 0, outbox: lsGet(LS.outbox, []), seeded: {}, firstSnap: false };

function saveMirror() { lsSet(LS.mirror, { projects: S.projects, workflow: S.workflow, settings: S.settings, activity: S.activity, at: S.sync.at }); }
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
function runMigrations() {
  const done = S.settings.migrations || [];
  const add = [];
  let wf = null;
  if (!done.includes('opt-11-20-32')) {
    wf = clone(S.workflow); wf.forEach(w => { if (DEFAULT_OPTIONAL.includes(w.id)) w.optional = true; });
    add.push('opt-11-20-32');
  }
  if (!done.includes('backorders-stage')) {
    /* v5.2.0: insert the Backorders stage before Warranty Replacements. Workflow steps and
       project-only steps store their stage as an index, so Warranty moves from 6 to 7. */
    wf = wf || clone(S.workflow);
    if (!wf.some(w => w.id === 'wb1')) {
      wf.forEach(w => { if (w.stage >= ST_BACK) w.stage += 1; });
      const at = wf.findIndex(w => w.stage === ST_WARR);
      wf.splice(at < 0 ? wf.length : at, 0, ...BACKORDER_STEPS.map(b => Object.assign({}, b)));
      Object.values(S.projects).forEach(p => {
        if (!(p.custom || []).some(c => c.stage >= ST_BACK)) return;
        const q = clone(p); q.custom.forEach(c => { if (c.stage >= ST_BACK) c.stage += 1; });
        putProject(q, { keepTime: true });
      });
    }
    add.push('backorders-stage');
  }
  if (!add.length) return;
  if (wf) putMeta('workflow', wf);
  const st = clone(S.settings); st.migrations = done.concat(add); putMeta('settings', st);
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
    if (!snap.metadata.fromCache && !cloud.firstSnap) { cloud.firstSnap = true; setTimeout(purgeArchive, 1500); }
    saveMirror(); computeSync(); render();
  }, (e) => { console.error('Sync error', e); setSync('error', e.message || 'Sync error'); });
  ['workflow', 'settings', 'activity'].forEach((key) => {
    fs.onSnapshot(fs.doc(cloud.db, COL_META, key), { includeMetadataChanges: true }, (snap) => {
      if (snap.exists()) {
        const v = snap.data().v;
        S[key] = key === 'settings' ? Object.assign(clone(DEFAULT_SETTINGS), v || {}) : key === 'activity' ? (v && v.days ? v : { days: {} }) : (v || clone(DEFAULT_WORKFLOW));
        if (!snap.metadata.fromCache) { cloud.metaLive = cloud.metaLive || {}; cloud.metaLive[key] = true; if (cloud.metaLive.workflow && cloud.metaLive.settings && !cloud.migrated) { cloud.migrated = true; setTimeout(runMigrations, 300); } }
        saveMirror(); render();
      } else if (!snap.metadata.fromCache && !cloud.seeded[key]) {
        cloud.seeded[key] = true;
        putMeta(key, key === 'settings' ? clone(DEFAULT_SETTINGS) : key === 'activity' ? { days: {} } : clone(DEFAULT_WORKFLOW));
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
const shortName = (n) => String(n || '').replace(/\s+residence\s*$/i, '').trim() || String(n || '');
const DEF_ST = { s: 'Not Started', p: 'LOW', due: '', note: '', dis: false };
const isClosed = (s) => s === 'Done' || s === 'N/A';

function projItems(p) {
  const out = [];
  S.workflow.forEach((w, i) => {
    const st0 = (p.steps || {})[w.id] || {};
    out.push({ key: w.id, kind: 't', n: i + 1, title: w.title, detail: w.detail, stage: w.stage, tplOptional: !!w.optional, optional: !!w.optional && !st0.req, st: Object.assign({}, DEF_ST, (p.steps || {})[w.id]) });
  });
  (p.custom || []).forEach((c) => {
    out.push({ key: c.id, kind: 'c', n: 0, title: c.title, detail: '', stage: c.stage, optional: false, st: Object.assign({}, DEF_ST, c) });
  });
  return out;
}
function stageItems(p, si, items) { return (items || projItems(p)).filter(x => x.stage === si); }
function curStage(p, items) {
  items = items || projItems(p);
  for (let si = 0; si < STAGES.length; si++) if (items.some(x => x.stage === si && !x.optional && !isClosed(x.st.s))) return si;
  /* Install is complete: the current stage is the first after-install stage (Backorders, Warranty)
     that still has anything open, optional steps included; the last stage once everything is closed. */
  for (let si = ST_BACK; si < STAGES.length; si++) if (items.some(x => x.stage === si && !isClosed(x.st.s))) return si;
  return STAGES.length - 1;
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
/* Priority suggestions (business days, tiered):
   overdue → Urgent · due within 2 business days → Urgent · within 5 business days → Medium.
   Shown only when that level is above the step's current priority. Dismiss hides it until the
   suggestion moves up a level (e.g. dismissing "Medium" brings it back when "Urgent" is due). */
function bizDays(iso) {
  const d = parseISO(iso); if (!d) return null;
  const t = today0();
  if (d < t) return -1;
  let n = 0; const c = new Date(t);
  while (c < d) { c.setDate(c.getDate() + 1); const w = c.getDay(); if (w !== 0 && w !== 6) n++; }
  return n;
}
function suggestion(x) {
  if (!x.st.due || isClosed(x.st.s)) return null;
  const bd = bizDays(x.st.due); if (bd === null) return null;
  const overdue = bd < 0;
  const target = overdue || bd <= 2 ? 'URGENT' : bd <= 5 ? 'MEDIUM' : null;
  if (!target || LEVELS.indexOf(target) <= LEVELS.indexOf(x.st.p)) return null;
  const dis = x.st.dis === true ? 'URGENT' : x.st.dis;
  if (dis && LEVELS.indexOf(dis) >= LEVELS.indexOf(target)) return null;
  const when = overdue ? dueLabel(x.st.due) : bd === 0 ? 'Due today' : 'Due ' + dueLabel(x.st.due) + ' · ' + bd + (bd === 1 ? ' business day away' : ' business days away');
  return { target, overdue, when };
}
function suggest(x) { return !!suggestion(x); }
function activeProjects() { return Object.values(S.projects).filter(p => !p.archived); }
function stageCounts(p, items) {
  items = items || projItems(p); const cs = curStage(p, items);
  const open = items.filter(x => x.stage === cs && !isClosed(x.st.s));
  return { cs, open: open.length, urgent: open.filter(x => x.st.p === 'URGENT').length, medium: open.filter(x => x.st.p === 'MEDIUM').length };
}
function dueBadgeCount() {
  let n = 0; activeProjects().forEach(p => projItems(p).forEach(x => { if (!isClosed(x.st.s) && !x.optional && x.st.due && daysFrom(x.st.due) <= 0) n++; })); return n;
}
function newProject({ name, address, po, designerId, stage }) {
  const p = { id: uid('p'), name, address: address || '', po: po || '', designer: designerId, createdAt: Date.now(), updatedAt: Date.now(), seedFlagged: true, archived: false, archivedAt: null, pinned: false, steps: {}, custom: [], crew: '', installDate: '', noArchivePrompt: false };
  S.workflow.forEach(w => { if (w.stage < stage) p.steps[w.id] = Object.assign({}, DEF_ST, { s: 'Done', doneAt: todayISO(), seed: true }); });
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
  /* Finishing Project Install from anywhere but the Project page asks what's next (archive, or keep
     it open for backorders and warranty) instead of quietly moving the job on. */
  if (U.route.page !== 'project' && !p.archived && !installDone(before, projItems(before)) && installDone(p, projItems(p))) archivePrompt(pid, label);
}
function archivePrompt(pid, label) {
  const p = S.projects[pid]; if (!p) return;
  U.toast = { id: Date.now() + Math.random(), text: label || '', canUndo: !!label, prompt: pid };
  renderToast();
}
function archiveById(pid) {
  const p = S.projects[pid]; if (!p) return;
  const before = clone(p); const q = clone(p); q.archived = true; q.archivedAt = Date.now(); q.pinned = false;
  putProject(q);
  pushUndo(p.name + ' archived', () => putProject(before, { keepTime: true }));
}

/* ============================================================
   ROUTER
   ============================================================ */
function parseRoute() {
  const h = location.hash.replace(/^#\/?/, '');
  const [page, id] = h.split('/');
  const pages = ['dashboard', 'tasklist', 'due', 'projects', 'operations', 'workflow', 'archived', 'settings', 'project'];
  return { page: pages.includes(page) ? page : 'dashboard', id: id || null };
}
function go(hash, opts = {}) {
  if (opts.exit && motionOK()) {
    const m = $('.main'); if (m) m.classList.add('page-exit');
    setTimeout(() => { location.hash = hash; }, 230);
  } else location.hash = hash;
}
window.addEventListener('hashchange', () => { U.route = parseRoute(); U.menu = null; U.enter = true; U.gone = null; window.scrollTo(0, 0); render(); maybeOpenEmailFromRoute(); });
function maybeOpenEmailFromRoute() { if (U.route.page === 'operations' && U.route.id && S.projects[U.route.id]) { const id = U.route.id; history.replaceState(null, '', '#/operations'); U.route.id = null; openEmail(id); } }

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
  const oldRow = document.getElementById('segrow');
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
  if (U.route.page === 'dashboard') fitRecentRow();
  layoutOpenBoxes();
  if (U.email) { if (U.route.page !== 'operations') U.email = null; else renderEmail(!!U.emailFresh); }
  settleFolds();
  keepStageBar(oldRow);
  POPPED.clear(); POPPED_NOW.forEach(k => POPPED.add(k)); POPPED_NOW = new Set();
  if (keep) {
    const el = document.getElementById(keep.id);
    if (el) { el.value = keep.v; el.focus(); try { el.setSelectionRange(keep.s, keep.e); } catch (e) {} }
  }
  renderSync();
  fitSideProjects();
  const m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', getComputedStyle(r).getPropertyValue('--bg').trim() || '#F2ECE1');
}
/* Stage bar: the same bar elements are kept between renders and only their classes change,
   so every segment (any number of stages) fills or empties with the same quick transition,
   and a second render in the same moment can't cut a fill short. */
function keepStageBar(oldRow) {
  const row = document.getElementById('segrow');
  if (!row || !oldRow || oldRow === row || oldRow.dataset.pid !== row.dataset.pid || oldRow.children.length !== row.children.length) return;
  const fresh = [...row.children].map(nb => ({ cls: nb.className.replace(/\bpv\b/g, '').trim(), attrs: [...nb.attributes].filter(at => at.name !== 'class').map(at => [at.name, at.value]), html: nb.innerHTML }));
  row.replaceWith(oldRow);
  [...oldRow.children].forEach(ob => { const i = ob.querySelector('.segtrack i'); if (i) getComputedStyle(i).transform; });
  void oldRow.offsetWidth; // lock in the current look, then switch to the new state
  fresh.forEach((f, j) => {
    const ob = oldRow.children[j];
    if (ob.innerHTML !== f.html) ob.innerHTML = f.html;
    f.attrs.forEach(([k, v]) => { if (ob.getAttribute(k) !== v) ob.setAttribute(k, v); });
    ob.className = f.cls;
  });
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
  const projs = activeProjects().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 30);
  const projHtml = projs.length ? projs.map(p => {
    const it = projItems(p); const pr = progress(p, it); const cs = curStage(p, it);
    return `<a class="proj nav" href="#/project/${p.id}" aria-label="${esc(p.name)}"><span class="prow"><span class="dot" style="background:${dColor(p.designer)}"></span><span class="lbl">${esc(p.name)}</span></span>
      <span class="pop" aria-hidden="true"><span style="display:flex;justify-content:space-between;gap:8px;align-items:baseline"><span style="font-size:13px;font-weight:600;color:var(--ink)">${esc(p.name)}</span><span class="mono" style="font-size:11px;color:var(--muted)">${pr.done}/${pr.total}</span></span><span class="pbar" style="height:4px"><i style="width:${pr.pct}%;background:${dColor(p.designer)}"></i></span><span style="font-size:11.5px;color:var(--muted)">${STAGES[cs]}</span></span>
      <span class="pbar"><i style="width:${pr.pct}%;background:${dColor(p.designer)}"></i></span></a>`;
  }).join('') : `<div class="lbl" style="font-size:12.5px;color:var(--muted);padding:2px 10px;white-space:normal">No open projects yet</div>`;
  return `<aside class="side${U.collapsed ? ' collapsed' : ''}">
    <a class="brand" href="#/dashboard" title="Green Screen"><span class="logo">${I.leaf(28)}</span><span class="lbl" style="font-weight:600;font-size:16px;letter-spacing:-.01em;color:var(--ink)">Green Screen</span></a>
    <nav class="navlist" aria-label="Main">${navHtml}</nav>
    <div class="sideprojwrap">
      <div class="sidehead"><span class="lbl">Open projects</span></div>
      <div class="sideprojs">${projHtml}</div>
    </div>
    <a href="#/settings" class="syncind" id="syncind"></a>
    ${installEvt && !isStandalone() ? `<button class="toggle press installbtn" data-act="install" title="Install Green Screen as an app" style="margin-top:-18px">${I.download}<span class="lbl">Install app</span></button>` : ''}
    <button class="toggle press" data-act="toggleSide" aria-label="${U.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}" title="${U.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}">${I.collapse}<span class="lbl">Collapse</span></button>
  </aside>`;
}
/* Sidebar open projects: show as many of the most recently edited as fit in the space above the
   sync status, so the list never needs scrolling, on any screen. Re-measured on resize and collapse. */
function fitSideProjects() {
  const box = document.querySelector('.sideprojs'); if (!box) return;
  const wrap = box.parentElement; const items = [...box.querySelectorAll(':scope > .proj')];
  items.forEach(el => el.classList.remove('cut'));
  const limit = wrap.getBoundingClientRect().bottom;
  let cut = false;
  items.forEach(el => { if (!cut && el.getBoundingClientRect().bottom > limit + 0.5) cut = true; if (cut) el.classList.add('cut'); });
}
let fitSideT = null;
window.addEventListener('resize', () => { clearTimeout(fitSideT); fitSideT = setTimeout(fitSideProjects, 80); });
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
  if (t && t.prompt) {
    const p = S.projects[t.prompt];
    box.innerHTML = p ? `<div class="toast tprompt" role="alertdialog" aria-live="assertive" aria-label="Project Install complete">
      <span class="tpico">${I.tick(12)}</span>
      <span class="tt"><b>${esc(shortName(p.name))}</b> · Project Install is complete.${t.text ? `<span class="tpsub">${esc(t.text)}</span>` : ''}</span>
      <button class="toastbtn pri press" data-act="promptArchive" data-pid="${p.id}">${I.box(13)}Archive project</button>
      <button class="toastbtn press" data-act="promptOpen" data-pid="${p.id}" title="Keep it open and go to its Backorders stage">Backorders ›</button>
      ${t.canUndo ? `<button class="toastbtn ghost press" data-act="undo" title="Undo (Ctrl/⌘ Z)">Undo</button>` : ''}
      <button class="toastx press" data-act="toastClose" aria-label="Dismiss">${I.x(13)}</button></div>` : '';
    box.className = 'gs-' + U.theme;
    return;
  }
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
    case 'dashboard': return pageDashboard();
    case 'tasklist': return pageTasklist();
    case 'due': return pageDue();
    case 'workflow': return pageWorkflow();
    case 'operations': return pageOperations();
    case 'archived': return pageArchived();
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
  const list = all.filter(p => projMatch(p, q));
  const sorts = [['stage', 'Furthest stage'], ['recent', 'Recently edited'], ['urgent', 'Most urgent'], ['open', 'Most open steps'], ['az', 'Client A–Z']];
  const head = `<div class="phead"><div><div class="eyebrow">${all.length} active ${all.length === 1 ? 'project' : 'projects'}</div><h1>Projects</h1></div>
    <div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px">
      <label><span class="sr">Search projects</span><input id="f-search" class="search" placeholder="Search client, address, PO or #tag" value="${esc(U.search)}" data-input="search" autocomplete="off"></label>
      ${sortPicker('sort', U.sort, sorts)}<button class="sel selbtn press statbtn${U.pstats ? ' on' : ''}" data-act="pstats" aria-expanded="${!!U.pstats}" title="Projects by tag">${svg(14, '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"></path>', 2)}Stats</button>
      <button class="btn pri press" data-act="newProject">${I.plus}New project</button>
    </div></div>${U.pstats || U.pstatsClosing ? pstatsHtml() : ''}`;
  if (!all.length) {
    return head + `<div class="empty rise"><h2>No projects yet</h2><p>Start your first project and it’ll be filed here by designer, like drawers in a cabinet.</p><button class="btn pri press" data-act="newProject">${I.plus}New project</button></div>`;
  }
  const sorter = (a, b) => {
    const A = stageCounts(a), B = stageCounts(b);
    if (U.sort === 'recent') return (b.updatedAt || 0) - (a.updatedAt || 0);
    if (U.sort === 'az') return a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true });
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
function folderHtml(p, opts = {}) {
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
        <span class="fmeta"><label class="mono" style="font-size:11px;display:inline-flex;align-items:center;gap:5px" data-stop="1">PO<input class="fpo" id="po-${opts.noActs ? 'r' : 'f'}-${p.id}" value="${esc(p.po)}" placeholder="Add PO#" data-commit="po" data-id="${p.id}" aria-label="PO number for ${esc(p.name)}" autocomplete="off"></label><span class="${hot ? 'hot' : ''}">${esc(meta)}</span></span>
        <span style="display:flex;align-items:center;gap:8px"><span style="flex:1;display:flex;gap:2px">${STAGES.map((_, i) => `<span class="mseg${i < cs ? ' on' : i === cs ? ' now' : ''}"></span>`).join('')}</span><span class="mono" style="font-size:11px;color:var(--muted)">${pr.pct}%</span></span>
      </span>
    </div>
    ${opts.noActs ? '' : `<div class="facts"><button class="ibtn press" data-act="archiveFolder" data-id="${p.id}" title="Archive" aria-label="Archive ${esc(p.name)}">${I.box(14)}</button><button class="ibtn del press" data-act="deleteFolder" data-id="${p.id}" title="Delete" aria-label="Delete ${esc(p.name)}">${I.trash()}</button></div>`}
  </div>`;
}

/* ============================================================
   PAGE — Project
   ============================================================ */
/* true only the first render a banner appears, so it doesn't replay its pop-in on every click */
const POPPED = new Set(); let POPPED_NOW = new Set();
function popOnce(key) { POPPED_NOW.add(key); return !POPPED.has(key); }
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
  const dsMenu = m && m.kind === 'ds' ? `<div class="smenu left${U.menuFresh ? ' pop-in' : ''}" role="menu">${designers().map(x => `<button class="mi${x.id === p.designer ? ' cur' : ''}" role="menuitemradio" aria-checked="${x.id === p.designer}" data-act="setDesigner" data-v="${x.id}"><span class="dot" style="background:var(--c-${x.color})"></span>${esc(x.name)}</button>`).join('')}</div>` : '';
  const head = `<div class="phead" style="align-items:flex-start;margin-bottom:20px">
    <div style="flex:1;min-width:280px">
      <div class="crumb"><a href="#/${p.archived ? 'archived' : 'projects'}">${p.archived ? 'Archived' : 'Projects'}</a> <span>/</span> ${esc(p.name)}</div>
      <label><span class="sr">Client name</span><input id="h-name" class="hedit hname" value="${esc(p.name)}" data-commit="name" data-id="${p.id}" autocomplete="off"></label>
      <div class="hmeta">
        <span style="position:relative"><button class="hedit press" data-act="menu" data-kind="ds" data-key="ds" aria-haspopup="menu" aria-expanded="${!!dsMenu}" title="Change designer" style="display:flex;align-items:center;gap:6px;cursor:pointer"><span class="dot" style="background:${dColor(p.designer)}"></span>${esc(d.name)}<span style="opacity:.6;display:flex">${I.down}</span></button>${dsMenu}</span>
        <label style="display:flex"><span class="sr">Address</span><input id="h-addr" class="hedit" value="${esc(p.address)}" placeholder="Add address" data-commit="address" data-id="${p.id}" style="width:${Math.max(14, (p.address || '').length + 2)}ch" autocomplete="off"></label>
        <label style="display:flex;align-items:center;gap:2px"><span class="mono" style="font-size:12px">PO</span><input id="h-po" class="hedit mono" value="${esc(p.po)}" placeholder="Add PO#" data-commit="po" data-id="${p.id}" style="width:${Math.max(9, (p.po || '').length + 2)}ch;font-size:13px" autocomplete="off" aria-label="PO number"></label>
      </div>
      ${tagLine(p)}
    </div>
    <div style="display:flex;align-items:center;gap:8px;padding-top:20px">
      ${p.archived ? '' : `<button class="btn press" data-act="archiveProject" title="Archive project">${I.box(14)}Archive</button>`}
      <button class="btn del press" data-act="deleteProject" title="Delete project">${I.trash()}Delete</button>
    </div></div>`;
  const askArchive = cs >= ST_BACK && !p.noArchivePrompt && !U.gone && !p.archived;
  const archNote = p.archived ? `<div class="archbar${popOnce('arch:' + p.id) ? ' pop-in' : ''}" role="status" style="background:var(--kraft)"><span class="dico" style="background:var(--muted)">${I.box(12)}</span><span><span style="color:var(--ink);font-weight:500">This project is archived.</span> ${p.pinned ? 'It’s pinned, so it’s kept.' : daysLeft(p) === null ? '' : 'It deletes in ' + Math.max(0, daysLeft(p)) + (daysLeft(p) === 1 ? ' day' : ' days') + ' unless you pin or restore it.'}</span><span style="margin-left:auto"><button class="btn pri press" data-act="restoreHere" style="font-size:13px;padding:7px 12px">Restore to Projects</button></span></div>` : '';
  /* Archive prompt: a quiet line inside the stage card header (same height as the step count it sits beside),
     so nothing on the page moves when it appears. It fades in gently the first time only. */
  const archAsk = askArchive ? `<span class="archask${popOnce('ask:' + p.id) ? ' fadein' : ''}" role="status" title="Backorder and warranty steps stay open if you keep it"><span class="dico">${I.tick(10)}</span><span><span style="color:var(--ink);font-weight:500">Install complete.</span> Archive this project?</span><button class="btn pri press sm" data-act="archiveProject">${I.box(13)}Archive</button><button class="btn press sm" data-act="notNow">Not now</button></span>` : '';
  const archBar = '';
  // stage bar
  const hold = U.segHold && U.segHold.pid === p.id ? U.segHold.i : null;
  const vcs = hold !== null ? hold : cs;
  const segs = STAGES.map((name, i) => {
    const cls = i < vcs ? 'seg-on' : i === vcs ? 'seg-now' : '';
    const anim = '';
    const title = i === cs ? name + ' — current stage' : 'Open to ' + name + (i > cs ? ' (marks earlier stages done)' : ' (reopens it and later stages)');
    return `<button class="segbtn ${cls}${anim}" data-act="seg" data-i="${i}" data-seg="${i}" title="${esc(title)}" aria-label="${esc(title)}"><span class="segtrack"><i></i></span><span class="segname">${name}</span></button>`;
  }).join('');
  const stageCard = `<div class="card stagecard rise" data-cs="${cs}"><div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;min-height:28px;margin-bottom:8px"><span style="font-size:13px;color:var(--muted)">Stage · <span style="color:var(--ink);font-weight:500">${STAGES[cs]}</span></span><span style="display:flex;align-items:center;gap:14px">${archAsk}<span class="mono" style="font-size:12px;color:var(--muted)">${pr.done} of ${pr.total} steps</span></span></div><div class="segrow" id="segrow" data-pid="${p.id}">${segs}</div></div>`;
  // completed bar
  let doneBar = '';
  if (cs > 0) {
    const showDone = !!U.showDone[p.id];
    doneBar = `<div class="donebar rise"><button class="ibtn press" data-act="toggleDone" aria-expanded="${showDone}" title="${showDone ? 'Hide' : 'Show'} completed stages" style="width:28px;height:28px">${I.chev()}</button><span style="font-size:13px;font-weight:500">Completed stages</span>${STAGES.slice(0, cs).map((n, i) => `<button class="dchip press" data-act="reopen" data-i="${i}" title="Reopen ${esc(n)}"><span class="ck"><span class="tk" style="display:flex">${I.tick(8)}</span><span class="re" style="display:flex">${I.reopen}</span></span>${esc(n)}</button>`).join('')}</div>`;
    if (showDone) doneBar = doneBar.replace('class="ibtn press" data-act="toggleDone"', 'class="ibtn press" style="transform:rotate(90deg)" data-act="toggleDone"');
  }
  const stagesToShow = [];
  for (let si = 0; si < STAGES.length; si++) { if (si < cs && !U.showDone[p.id]) continue; stagesToShow.push(si); }
  const cards = stagesToShow.map(si => stageHtml(p, si, cs, items)).join('');
  return head + archNote + archBar + stageCard + `<div style="display:flex;flex-direction:column;gap:10px">${doneBar}${cards}</div>`;
}
function stageHtml(p, si, cs, items) {
  const list = stageItems(p, si, items);
  const key = p.id + ':' + si;
  const open = U.open[key] !== undefined ? U.open[key] : si === cs;
  const counted = list.filter(x => x.st.s !== 'N/A' && !x.optional);
  const done = counted.filter(x => x.st.s === 'Done').length;
  const optN = list.filter(x => x.optional && x.st.s !== 'N/A').length;
  const badge = si < cs ? '' : si === cs ? '<span class="badge cur">CURRENT</span>' : '<span class="badge up">UPCOMING</span>';
  const src = CUSTOM_STAGES.includes(si) ? '<span class="badge custom">CUSTOM STAGE</span>' : '';
  const opsBtn = OPS_STAGES.includes(si) ? `<button class="opslink press" data-act="goOps" title="See this stage across all jobs">${I.truck(13)}Operations ›</button>` : '';
  const pending = list.some(x => !isClosed(x.st.s));
  const actBtn = si < cs ? `<button class="btn press" data-act="reopen" data-i="${si}" style="font-size:12px;padding:5px 10px">${I.reopen}Reopen stage</button>`
    : pending ? `<button class="btn press" data-act="complete" data-i="${si}" style="font-size:12px;padding:5px 10px">${I.tick(12, 'currentColor')}Complete stage</button>` : '';
  const head = `<div class="shead" data-act="stage" data-i="${si}" role="button" tabindex="0" aria-expanded="${open}">${I.chev()}<span class="sname">${STAGES[si]}</span>${badge}${src}<span class="mono" style="font-size:12px;color:var(--muted)">${done}/${counted.length}${optN ? ' · +' + optN + ' optional' : ''}</span><span style="margin-left:auto;display:flex;gap:8px;align-items:center" data-stop="1">${opsBtn}${actBtn}</span></div>`;
  if (!open) return `<section class="stage${si < cs ? ' isdone' : ''}">${head}</section>`;
  const cur = si === cs;
  const rows = list.map(x => rowHtml(p, x, cur)).join('');
  const colh = `<div class="colhead prow-grid"><span></span><span>#</span><span>Step</span><span></span><span>Target date</span><span></span><span>Status</span></div>`;
  return `<section class="stage open${si < cs ? ' isdone' : ''}">${head}<div class="sbody">${colh}${cur ? `<div class="obwrap" data-ob="${p.id}:${si}"><div class="oboxes" aria-hidden="true"></div>${rows}</div>` : rows}
    <div style="display:flex;align-items:center;gap:10px;padding:6px 10px 2px;border-top:1px solid var(--line)"><span style="width:22px;display:grid;place-items:center;color:var(--muted)">${I.plus}</span><label style="flex:1;display:flex"><span class="sr">Add a step to ${STAGES[si]}</span><input id="add-${si}" class="addin" placeholder="Add step to this project — press Enter" data-add="${si}" autocomplete="off"></label></div>
  </div></section>`;
}
function stepCells(p, x) {
  const k = x.key, m = U.menu, mk = p.id + ':' + k;
  const st = x.st;
  const c = U.casc && U.casc.pid === p.id && U.casc.ids[k] !== undefined ? U.casc.ids[k] : null;
  // due
  const hasDue = !!st.due;
  const dOpen = m && m.kind === 'due' && m.key === mk;
  const dueMenu = dOpen ? `<div class="smenu${U.menuFresh ? ' pop-in' : ''}" role="menu" style="min-width:210px"><div class="mhead">Target date</div>${quickDates().map(q => `<button class="mi" role="menuitem" data-act="setDue" data-pid="${p.id}" data-k="${k}" data-v="${q.iso}">${q.label}<span class="hint">${q.hint}</span></button>`).join('')}<label class="mpick">Pick a date<input type="date" value="${st.due}" data-change="pickDue" data-pid="${p.id}" data-k="${k}"></label>${hasDue ? `<button class="mi danger" role="menuitem" data-act="setDue" data-pid="${p.id}" data-k="${k}" data-v="">Clear date</button>` : ''}</div>` : '';
  const due = `<div style="position:relative;min-width:0"><button class="duebtn press tone-${dueTone(st.due)}${hasDue ? '' : ' empty'}" data-act="menu" data-kind="due" data-key="${mk}" aria-haspopup="menu" aria-expanded="${dOpen}" title="Set target date">${I.cal}${hasDue ? esc(dueLabel(st.due)) : 'Set date'}</button>${dueMenu}</div>`;
  // priority
  const sg = suggestion(x); const sug = !!sg;
  const pOpen = m && m.kind === 'pri' && m.key === mk;
  const nextLv = LEVELS[Math.min(LEVELS.indexOf(st.p) + 1, 2)];
  const bars = (lv) => `<span class="bars lv-${lv}"><i class="on"></i><i class="${lv !== 'LOW' ? 'on' : ''}"></i><i class="${lv === 'URGENT' ? 'on' : ''}"></i></span>`;
  const priMenu = pOpen ? `<div class="smenu${U.menuFresh ? ' pop-in' : ''}" role="menu" style="min-width:190px">${sug ? `<div class="sugbox${sg.overdue ? ' late' : ''}">${esc(sg.when)}<span style="display:flex;gap:6px"><button class="sugbtn press" data-act="raise" data-pid="${p.id}" data-k="${k}">${I.arrowUp}Raise to ${PL[sg.target]}</button><button class="sugbtn plain press" data-act="dismiss" data-pid="${p.id}" data-k="${k}">Dismiss</button></span></div>` : ''}${LEVELS.map(lv => `<button class="mi${lv === st.p ? ' cur' : ''}" role="menuitemradio" aria-checked="${lv === st.p}" data-act="setPri" data-pid="${p.id}" data-k="${k}" data-v="${lv}">${bars(lv)}${PL[lv]}</button>`).join('')}</div>` : '';
  const pri = `<div style="position:relative"><button class="pbtn press tile-${st.p}" data-act="menu" data-kind="pri" data-key="${mk}" aria-haspopup="menu" aria-expanded="${pOpen}" title="Priority: ${PL[st.p]}${sug ? ' — ' + (sg.overdue ? 'overdue' : 'due soon') + ', consider raising to ' + PL[sg.target] : ''}" aria-label="Priority: ${PL[st.p]}">${bars(st.p)}${sug ? `<span class="sugdot${sg.overdue ? ' late' : ''}" aria-hidden="true">${I.arrowUp}</span>` : ''}</button>${priMenu}</div>`;
  // status
  const sOpen = m && m.kind === 'st' && m.key === mk;
  const shown = c !== null ? 'Done' : st.s;
  const stMenu = sOpen ? `<div class="smenu${U.menuFresh ? ' pop-in' : ''}" role="menu" style="min-width:150px">${STATUSES.map(s => `<button class="mi${s === st.s ? ' cur' : ''}" role="menuitemradio" aria-checked="${s === st.s}" data-act="setStatus" data-pid="${p.id}" data-k="${k}" data-v="${s}"><span class="chip chip-${SK[s]}"><span class="ico ico-${SK[s]}"></span>${s}</span></button>`).join('')}</div>` : '';
  const status = `<div style="position:relative"><button class="chip chipbtn press chip-${SK[shown]}" data-act="menu" data-kind="st" data-key="${mk}" aria-haspopup="menu" aria-expanded="${sOpen}" aria-label="Status: ${shown}"><span class="ico ico-${SK[shown]}"></span>${shown}</button>${stMenu}</div>`;
  return { due, pri, status };
}
function rowHtml(p, x, cur) {
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
  if (cur && !isClosed(st.s) && c === null && !x.optional) cls += ' isopen';
  const delay = c !== null ? c * 55 : un !== null ? un * 45 : 0;
  const { due, pri, status } = stepCells(p, x);
  // title cell
  const isProc = x.key === 'w25' || x.key === 'w26';
  const procBtn = isProc ? `<button class="opslink sm press" data-act="goOps"${x.key === 'w26' ? ` data-email="${p.id}"` : ''} title=""${x.key === 'w26' ? 'Write the ops email on Operations' : 'Processing step · open Operations'}">${x.key === 'w26' ? 'EMAIL ›' : 'OPS ›'}</button>` : '';
  const noteIc = st.note ? `<span class="noteic" title="Has a note">${I.note}</span>` : '';
  const tag = x.kind === 'c' ? '<span class="ptag">THIS PROJECT</span>'
    : x.tplOptional ? (x.optional
      ? `<button class="ptag opt press" data-act="reqToggle" data-pid="${p.id}" data-k="${k}" title="Optional: hidden from the Tasklist and not counted in progress. Click to make it required for this project.">OPTIONAL</button>`
      : `<button class="ptag req press" data-act="reqToggle" data-pid="${p.id}" data-k="${k}" title="Required for this project only. Click to make it optional again.">REQUIRED HERE</button>`) : '';
  const grip = x.kind === 'c' ? `<span class="grip cgrip" title="Drag to reorder" aria-hidden="true">${svg(14, '<circle cx="9" cy="6" r="1"></circle><circle cx="15" cy="6" r="1"></circle><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="9" cy="18" r="1"></circle><circle cx="15" cy="18" r="1"></circle>', 2.4)}</span>` : '';
  const titleCell = `<span style="display:flex;align-items:center;gap:8px;min-width:0">${grip}<span class="stitle" data-act="expand" data-pid="${p.id}" data-k="${k}" title="${esc(x.title)}">${esc(x.title)}</span>${tag}${noteIc}</span>`;
  // tools
  let tools = '';
  if (x.kind === 'c') {
    const cs = (p.custom || []).filter(cc => cc.stage === x.stage); const idx = cs.findIndex(cc => cc.id === k);
    tools = `<button class="ibtn press" data-act="moveCustom" data-pid="${p.id}" data-k="${k}" data-v="-1" title="Move up" ${idx <= 0 ? 'disabled' : ''}>${I.up}</button><button class="ibtn press" data-act="moveCustom" data-pid="${p.id}" data-k="${k}" data-v="1" title="Move down" ${idx >= cs.length - 1 ? 'disabled' : ''}>${I.dn}</button><button class="ibtn press" data-act="toTemplate" data-pid="${p.id}" data-k="${k}" title="Add to template (every project)">${svg(14, '<rect x="3" y="3" width="6" height="6" rx="1.5"></rect><rect x="15" y="15" width="6" height="6" rx="1.5"></rect><path d="M6 9v4a2 2 0 0 0 2 2h7"></path>')}</button><button class="ibtn del press" data-act="deleteCustom" data-pid="${p.id}" data-k="${k}" title="Delete step">${I.trash()}</button>`;
  }
  const toolsCell = `<span class="toolcell" style="display:flex;align-items:center;gap:4px;justify-content:flex-end">${procBtn}<span class="tools">${tools}</span></span>`;
  const exp = U.expanded[mk] ? `<div class="sexp">${x.detail ? `<span>${esc(x.detail)}</span>` : ''}<label style="display:block"><span class="sr">Note</span><textarea id="note-${k}" class="note" rows="2" placeholder="Add a note for this project…" data-commit="note" data-pid="${p.id}" data-k="${k}">${esc(st.note)}</textarea></label></div>` : '';
  return `<div class="${cls}" style="--d:${delay}ms" data-pid="${p.id}" data-k="${k}"${x.kind === 'c' ? ` data-cid="${k}" data-stage="${x.stage}" draggable="true"` : ''}><button class="check press" data-act="toggle" data-pid="${p.id}" data-k="${k}" aria-label="${st.s === 'Done' ? 'Mark not done' : 'Mark done'}">${I.tick()}</button><span class="snum">${x.n || ''}</span>${titleCell}${toolsCell}${due}${pri}${status}${exp}</div>`;
}

/* ============================================================
   SHARED — task rows (Tasklist, Due Soon, Dashboard)
   ============================================================ */
/* ============================================================
   TAGS — #hashtags on projects. One word each; spaces become dashes ("retaining wall" → retaining-wall).
   The library lives in settings.tags; projects keep their own list in p.tags.
   ============================================================ */
function tagSlug(v) { return String(v || '').toLowerCase().replace(/^#+/, '').trim().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, ''); }
function tagLib() { return S.settings.tags || []; }
function tagCount(t) { return Object.values(S.projects).filter(p => (p.tags || []).includes(t)).length; }
/* search: "#pat" matches tags starting with "pat"; plain words also match tags */
function tagHit(p, q) {
  const tags = p.tags || [];
  if (q.startsWith('#')) { const s2 = tagSlug(q); return !s2 || tags.some(t => t.startsWith(s2)); }
  const s2 = tagSlug(q); return !!s2 && tags.some(t => t.includes(s2));
}
function projMatch(p, q, extra = '') {
  if (!q) return true;
  if (q.startsWith('#')) return tagHit(p, q);
  return (p.name + ' ' + (p.address || '') + ' ' + (p.po || '') + ' ' + extra).toLowerCase().includes(q) || tagHit(p, q);
}
function tagOptions(p) {
  const q = tagSlug(U.tagQ || ''); const lib = tagLib(); const have = p.tags || [];
  const opts = lib.filter(t => !have.includes(t) && (!q || t.includes(q)))
    .sort((a, b) => (q ? (b.startsWith(q) ? 1 : 0) - (a.startsWith(q) ? 1 : 0) : 0) || tagCount(b) - tagCount(a) || a.localeCompare(b))
    .map(t => ({ t, n: tagCount(t) }));
  if (q && !lib.includes(q)) opts.push({ t: q, create: true });
  return opts;
}
function tagLine(p) {
  const open = U.menu && U.menu.kind === 'tag' && U.menu.key === p.id;
  let menu = '';
  if (open) {
    const opts = tagOptions(p); const hi = Math.min(U.tagHi || 0, Math.max(0, opts.length - 1));
    const q = tagSlug(U.tagQ || '');
    menu = `<div class="smenu tagmenu${U.menuFresh ? ' pop-in' : ''}" role="menu">
      <input id="tag-in" class="tagin" placeholder="Find or create a tag" value="${esc(U.tagQ || '')}" data-input="tagq" data-tagin="${p.id}" autocomplete="off" spellcheck="false" aria-label="Find or create a tag">
      <div class="tagopts" id="tagopts">${opts.map((o, i) => `<button class="mi${i === hi ? ' hi' : ''}" data-act="tagAdd" data-v="${esc(o.t)}" role="menuitem">${o.create ? `<span>Create <b>#${esc(o.t)}</b></span>` : `<span><span class="hash">#</span>${esc(o.t)}</span><span class="hint mono">${o.n}</span>`}</button>`).join('')}</div>
      ${!opts.length ? `<div class="tagnone">${q && (p.tags || []).includes(q) ? 'Already tagged #' + esc(q) : 'Type to find or create a tag'}</div>` : ''}
    </div>`;
  }
  return `<div class="ptags">${(p.tags || []).map(t => `<span class="ptag"><button class="ptagb" data-act="tagGo" data-v="${esc(t)}" title="Show every #${esc(t)} project"><span class="hash">#</span>${esc(t)}</button><button class="ptagx" data-act="tagDel" data-v="${esc(t)}" aria-label="Remove #${esc(t)}" title="Remove">×</button></span>`).join('')}<span style="position:relative"><button class="ptagadd press" data-act="menu" data-kind="tag" data-key="${p.id}" aria-haspopup="menu" aria-expanded="${open}">+ Tag</button>${menu}</span></div>`;
}
function tagAdd(pid, t) {
  const p = S.projects[pid]; t = tagSlug(t); if (!p || !t) return;
  U.tagQ = ''; U.tagHi = 0; U.menu = null;
  if ((p.tags || []).includes(t)) { render(); return; }
  if (!tagLib().includes(t)) { const s2 = clone(S.settings); s2.tags = (s2.tags || []).concat([t]); putMeta('settings', s2); }
  mutate(pid, q => { q.tags = (q.tags || []).concat([t]); }, '#' + t + ' added to ' + shortName(p.name));
}
function tagDel(pid, t) {
  const p = S.projects[pid]; if (!p) return;
  mutate(pid, q => { q.tags = (q.tags || []).filter(x => x !== t); }, '#' + t + ' removed from ' + shortName(p.name));
}
/* rename or merge a tag everywhere (library, projects, stats history), with Undo */
function tagRename(old, v) {
  v = tagSlug(v); if (!v || v === old) return false;
  const beforeS = clone(S.settings), beforeA = clone(S.activity);
  const touched = Object.values(S.projects).filter(p => (p.tags || []).includes(old)).map(p => clone(p));
  const merge = tagLib().includes(v);
  const s2 = clone(S.settings); s2.tags = merge ? s2.tags.filter(t => t !== old) : s2.tags.map(t => t === old ? v : t); putMeta('settings', s2);
  touched.forEach(p => { const q = clone(p); q.tags = [...new Set(q.tags.map(t => t === old ? v : t))]; putProject(q, { keepTime: true }); });
  const a2 = clone(S.activity); let ach = false;
  Object.values(a2.days || {}).forEach(d => { if (d.g && d.g[old]) { const o = d.g[old]; const n = d.g[v] || (d.g[v] = { t: 0, new: 0, sold: 0, inst: 0 }); ['t', 'new', 'sold', 'inst'].forEach(k => { n[k] += o[k] || 0; }); delete d.g[old]; ach = true; } });
  if (ach) putMeta('activity', a2);
  pushUndo((merge ? '#' + old + ' merged into #' + v : 'Renamed to #' + v) + (touched.length ? ' · ' + touched.length + (touched.length === 1 ? ' project' : ' projects') + ' updated' : ''), () => { putMeta('settings', beforeS); if (ach) putMeta('activity', beforeA); touched.forEach(p => putProject(p, { keepTime: true })); });
  return true;
}
function tagRemove(t) {
  const beforeS = clone(S.settings);
  const touched = Object.values(S.projects).filter(p => (p.tags || []).includes(t)).map(p => clone(p));
  const s2 = clone(S.settings); s2.tags = s2.tags.filter(x => x !== t); putMeta('settings', s2);
  touched.forEach(p => { const q = clone(p); q.tags = q.tags.filter(x => x !== t); putProject(q, { keepTime: true }); });
  pushUndo('#' + t + ' removed' + (touched.length ? ' from ' + touched.length + (touched.length === 1 ? ' project' : ' projects') : ''), () => { putMeta('settings', beforeS); touched.forEach(p => putProject(p, { keepTime: true })); });
}

/* App-style dropdown used everywhere instead of the browser's native dropdown.
   It carries a hidden input with the same data-* attributes the old dropdown had, and fires a
   'change' event on it, so the existing change handlers keep working. It opens and closes by
   itself (no full re-render), so it also works inside the email panel. */
function dpick(cur, opts, attrs, o = {}) {
  cur = cur == null ? '' : String(cur);
  const hit = opts.find(([v]) => String(v) === cur);
  const lbl = hit && (String(hit[0]) !== '' || !o.placeholder) ? hit[1] : (o.placeholder || '');
  return `<div class="dpick${o.cls ? ' ' + o.cls : ''}"${o.placeholder ? ` data-ph="${esc(o.placeholder)}"` : ''}><input type="hidden" value="${esc(cur)}" ${attrs}><button type="button" class="${o.btn || 'sel selbtn'} dpbtn${hit && String(hit[0]) !== '' ? '' : ' empty'}" aria-haspopup="menu" aria-expanded="false"${o.label ? ` aria-label="${esc(o.label)}"` : ''}><span class="dplbl">${esc(lbl)}</span></button><div class="smenu dpmenu${o.left ? ' left' : ''}" role="menu">${o.head ? `<div class="mhead">${esc(o.head)}</div>` : ''}${opts.map(([v, l]) => `<button type="button" class="mi${String(v) === cur ? ' cur' : ''}" role="menuitemradio" aria-checked="${String(v) === cur}" data-dv="${esc(String(v))}"><span class="dpl">${esc(l)}</span><span class="hint dpck">${I.tick(11, 'currentColor')}</span></button>`).join('')}</div></div>`;
}
document.addEventListener('click', (e) => {
  const t = e.target;
  document.querySelectorAll('.dpick.open').forEach(d => { if (!d.contains(t)) { d.classList.remove('open'); d.querySelector('.dpbtn').setAttribute('aria-expanded', 'false'); } });
  const btn = t.closest && t.closest('.dpbtn');
  if (btn) { e.stopPropagation(); if (U.menu) { U.menu = null; render(); return; } const d = btn.closest('.dpick'); const on = !d.classList.contains('open'); d.classList.toggle('open', on); btn.setAttribute('aria-expanded', String(on)); return; }
  const item = t.closest && t.closest('.dpmenu .mi');
  if (item) {
    e.stopPropagation();
    const d = item.closest('.dpick'); const inp = d.querySelector('input');
    d.classList.remove('open'); d.querySelector('.dpbtn').setAttribute('aria-expanded', 'false');
    if (inp.value !== item.dataset.dv) {
      inp.value = item.dataset.dv;
      d.querySelector('.dplbl').textContent = item.dataset.dv === '' && d.dataset.ph ? d.dataset.ph : item.querySelector('.dpl').textContent;
      d.querySelector('.dpbtn').classList.toggle('empty', item.dataset.dv === '');
      d.querySelectorAll('.dpmenu .mi').forEach(m => { const c = m === item; m.classList.toggle('cur', c); m.setAttribute('aria-checked', String(c)); });
      inp.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
}, true);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll('.dpick.open').forEach(d => d.classList.remove('open')); });
/* Sort picker: the app's own pop-up menu (same as the date, priority and status menus) instead of the browser's list */
function sortPicker(key, cur, opts) {
  const m = U.menu; const open = m && m.kind === 'sort' && m.key === key;
  const curL = (opts.find(o => o[0] === cur) || opts[0])[1];
  const menu = open ? `<div class="smenu${U.menuFresh ? ' pop-in' : ''}" role="menu" style="min-width:190px;right:0;left:auto"><div class="mhead">Sort by</div>${opts.map(([v, l]) => `<button class="mi${v === cur ? ' cur' : ''}" role="menuitemradio" aria-checked="${v === cur}" data-act="setSort" data-k="${key}" data-v="${v}">${l}${v === cur ? `<span class="hint" style="display:flex">${I.tick(11, 'currentColor')}</span>` : ''}</button>`).join('')}</div>` : '';
  return `<div style="position:relative"><button class="sel selbtn press" data-act="menu" data-kind="sort" data-key="${key}" aria-haspopup="menu" aria-expanded="${!!open}"><span style="color:var(--muted)">Sort:</span> ${curL}</button>${menu}</div>`;
}
function designerPills() {
  const ds = U.dsel || 'all';
  const pills = [{ id: 'all', name: 'All designers', color: '' }].concat(designers());
  return `<div role="group" aria-label="Designer" style="display:flex;gap:6px;flex-wrap:wrap">${pills.map(d => `<button class="fpill press${ds === d.id ? ' on' : ''}" aria-pressed="${ds === d.id}" data-act="dsel" data-v="${d.id}">${d.color ? `<span class="dot" style="background:var(--c-${d.color})"></span>` : ''}${esc(d.id === 'all' ? d.name : firstName(d.name))}</button>`).join('')}</div>`;
}
function dselOK(p) { return !U.dsel || U.dsel === 'all' || p.designer === U.dsel; }
/* every unfinished step with its project, plus handy facts */
function openSteps(filter) {
  const out = [];
  activeProjects().forEach(p => {
    const items = projItems(p); const cs = curStage(p, items);
    items.forEach(x => { if (!isClosed(x.st.s) && !x.optional) { const r = { p, x, cs, upcoming: x.stage > cs }; if (!filter || filter(r)) out.push(r); } });
  });
  return out;
}
const byDue = (a, b) => { const A = a.x.st.due ? daysFrom(a.x.st.due) : 9999, B = b.x.st.due ? daysFrom(b.x.st.due) : 9999; return (A - B) || (LEVELS.indexOf(b.x.st.p) - LEVELS.indexOf(a.x.st.p)) || a.p.name.localeCompare(b.p.name); };
const TROW_COLS = 'trow-grid';
function taskHead() { return `<div class="colhead ${TROW_COLS}"><span></span><span></span><span>Project · Task</span><span>Status</span><span>Stage</span><span>Designer</span><span>PO#</span><span>Due</span></div>`; }
function taskRow(r, opts = {}) {
  const { p } = r; let x = r.x; const k = x.key; const mk = p.id + ':' + k;
  const leaving = U.tleave[mk];
  if (leaving === 'N/A') x = Object.assign({}, x, { st: Object.assign({}, x.st, { s: 'N/A' }) });
  const { due, pri, status } = stepCells(p, x);
  const cls = 'step trow ' + TROW_COLS + (leaving ? ' leaving' + (leaving === 'N/A' ? ' na-out' : '') : '') + (U.tback[mk] ? ' back' : '');
  const isProc = x.key === 'w25' || x.key === 'w26';
  const procTag = isProc ? `<button class="opslink sm press" data-act="goOps"${x.key === 'w26' ? ` data-email="${p.id}"` : ''} title=""${x.key === 'w26' ? 'Write the ops email on Operations' : 'Processing step · open Operations'}">${x.key === 'w26' ? 'OPS EMAIL ›' : 'PROCESSING ›'}</button>` : '';
  const tags = (x.kind === 'c' ? '<span class="ptag">THIS PROJECT</span>' : '') + (r.upcoming && opts.showUpcoming ? '<span class="ptag up" title="Here because of its date · joins the Tasklist when its stage becomes current">UPCOMING STAGE</span>' : '') + procTag;
  const isOpsStage = OPS_STAGES.includes(x.stage);
  const stageCell = isOpsStage ? `<span style="min-width:0;display:flex"><button class="opslink press" data-act="goOps" title="Open Operations" style="padding:2px 9px;max-width:100%;overflow:hidden;text-overflow:ellipsis">${I.truck(13)}${STAGES[x.stage]}</button></span>` : `<span class="tcell">${STAGES[x.stage]}</span>`;
  const d = designer(p.designer);
  return `<div class="${cls}" data-mk="${mk}">
    <button class="check press" data-act="tcheck" data-pid="${p.id}" data-k="${k}" aria-label="Mark done">${I.tick()}</button>
    ${pri}
    <span class="pathcell"><a href="#/project/${p.id}" class="clink" title="Open ${esc(p.name)}">${esc(shortName(p.name))}</a><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" style="flex:none;color:var(--muted)"><path d="M9 6l6 6-6 6"></path></svg><span class="stitle" title="${esc(x.title)}">${esc(x.title)}</span>${tags}</span>
    <span style="display:flex;align-items:center">${status}</span>
    ${stageCell}
    <span class="tcell" style="display:flex;align-items:center;gap:6px"><span class="dot" style="width:7px;height:7px;background:var(--c-${d.color})"></span><span style="overflow:hidden;text-overflow:ellipsis">${esc(d.name)}</span></span>
    <label style="min-width:0"><span class="sr">PO number for ${esc(p.name)}</span><input class="poedit" id="tpo-${opts.idp || 't'}-${p.id}-${k}" value="${esc(p.po)}" placeholder="Add PO#" data-commit="po" data-id="${p.id}" title="PO# · applies to the whole project" autocomplete="off"></label>
    ${due}
  </div>`;
}
/* checking a step off from a list: it vanishes, with Undo */
function listComplete(pid, k, status = 'Done') {
  const p = S.projects[pid]; if (!p) return; const x = getItem(p, k); if (!x) return;
  const mk = pid + ':' + k; if (U.tleave[mk]) return;
  const finish = () => {
    delete U.tleave[mk];
    mutate(pid, q => setItem(q, k, { s: status, doneAt: status === 'Done' ? todayISO() : '' }), '“' + x.title + '” ' + (status === 'Done' ? 'marked done' : 'marked N/A'), { onUndo: () => { U.tback[mk] = true; setTimeout(() => { delete U.tback[mk]; }, 500); } });
  };
  if (!motionOK()) return finish();
  U.tleave[mk] = status; U.menu = null; render();
  setTimeout(finish, 620);
}

/* ============================================================
   PAGE — Tasklist
   ============================================================ */
function pageTasklist() {
  const q = (U.tsearch || '').trim().toLowerCase();
  const rows = openSteps(r => !r.upcoming && dselOK(r.p) && (!q || (q.startsWith('#') ? tagHit(r.p, q) : (r.p.name + ' ' + r.x.title + ' ' + STAGES[r.x.stage] + ' ' + (r.p.po || '')).toLowerCase().includes(q) || tagHit(r.p, q))))
    .concat(Object.keys(U.tleave).map(mk => { const [pid, k] = mk.split(':'); const p = S.projects[pid]; const x = p && getItem(p, k); return p && x && isClosed(x.st.s) ? { p, x, cs: curStage(p), upcoming: false } : null; }).filter(Boolean));
  const sorts = { due: byDue, project: (a, b) => a.p.name.localeCompare(b.p.name) || byDue(a, b), stage: (a, b) => (a.x.stage - b.x.stage) || byDue(a, b), recent: (a, b) => (b.p.updatedAt || 0) - (a.p.updatedAt || 0) || byDue(a, b) };
  const sorter = sorts[U.tsort] || byDue;
  const total = rows.filter(r => !U.tleave[r.p.id + ':' + r.x.key]).length;
  const head = `<div class="phead"><div><div class="eyebrow">${total} open · current stages only</div><h1>Tasklist</h1></div>
    <div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px">
      <label><span class="sr">Search tasks</span><input id="t-search" class="search" placeholder="Search tasks, projects or #tag" value="${esc(U.tsearch || '')}" data-input="tsearch" autocomplete="off"></label>
      ${sortPicker('tsort', U.tsort || 'due', [['due', 'Due date'], ['project', 'Project A–Z'], ['stage', 'Stage'], ['recent', 'Recently edited']])}
      <button class="sel selbtn press statbtn${U.stats ? ' on' : ''}" data-act="stats" aria-expanded="${!!U.stats}" title="Recent activity">${svg(14, '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"></path>', 2)}Stats</button>
    </div></div>
    ${U.stats || U.statsClosing ? statsHtml() : ''}
    <div style="margin:-8px 0 18px">${designerPills()}</div>`;
  if (!activeProjects().length) return head + `<div class="empty rise"><h2>Nothing here yet</h2><p>Open steps from each project’s current stage will show up here.</p><button class="btn pri press" data-act="newProject">${I.plus}New project</button></div>`;
  const groups = LEVELS.slice().reverse().map((lv, gi) => {
    const list = rows.filter(r => r.x.st.p === lv).sort(sorter);
    const open = U.tgroups[lv] !== undefined ? U.tgroups[lv] : lv !== 'LOW';
    const cnt = list.filter(r => !U.tleave[r.p.id + ':' + r.x.key]).length;
    const body = !open ? '' : list.length ? `<div class="hscroll"><div class="tbody">${taskHead()}${list.map(r => taskRow(r)).join('')}</div></div>` : `<div class="gempty">Nothing ${PL[lv].toLowerCase()} right now.</div>`;
    return `<section class="tgroup rise${open ? ' open' : ''}" style="animation-delay:${gi * 50}ms"><button class="dhead" data-act="tgroup" data-v="${lv}" aria-expanded="${open}">${I.chev()}<span class="pbtn tile-${lv}" style="pointer-events:none"><span class="bars lv-${lv}"><i class="on"></i><i class="${lv !== 'LOW' ? 'on' : ''}"></i><i class="${lv === 'URGENT' ? 'on' : ''}"></i></span></span><span style="font-size:15px;font-weight:600">${PL[lv]}</span><span class="mono" style="font-size:12px;color:var(--muted)">${cnt}</span></button>${body}</section>`;
  }).join('');
  return head + groups + (q && !rows.length ? `<div class="empty">No open tasks match “${esc(U.tsearch)}”.</div>` : '');
}

/* ============================================================
   PAGE — Due Soon
   ============================================================ */
function pageDue() {
  const days = Array.from({ length: 14 }, (_, i) => addDays(i));
  const installs = activeProjects().filter(p => p.installDate && days.includes(p.installDate) && dselOK(p));
  const all = openSteps(r => !!r.x.st.due && daysFrom(r.x.st.due) <= 13 && dselOK(r.p));
  const leavingRows = Object.keys(U.tleave).map(mk => { const [pid, k] = mk.split(':'); const p = S.projects[pid]; const x = p && getItem(p, k); return p && x && x.st.due ? { p, x, cs: curStage(p), upcoming: x.stage > curStage(p) } : null; }).filter(Boolean).filter(r => !all.some(a => a.p.id === r.p.id && a.x.key === r.x.key));
  const rows = all.concat(leavingRows);
  const sel = U.dueDay && days.includes(U.dueDay) ? U.dueDay : null;
  const strip = `<div class="strip rise" role="group" aria-label="Next 14 days">${days.map((iso, i) => {
    const d = parseISO(iso); const here = rows.filter(r => r.x.st.due === iso && !U.tleave[r.p.id + ':' + r.x.key]);
    const inst = installs.filter(p => p.installDate === iso);
    const wk = d.getDay() === 0 || d.getDay() === 6;
    const all = inst.map(p => `<i class="sdi" style="background:${dColor(p.designer)}"></i>`).concat(here.map(() => '<i></i>'));
    const dots = all.length > 6 ? all.slice(0, 3).join('') + `<span class="sdmore">+${all.length - 3}</span>` : all.join('');
    const tip = [here.length ? here.length + (here.length === 1 ? ' step' : ' steps') + ' due' : '', inst.length ? 'Install: ' + inst.map(p => shortName(p.name)).join(', ') : ''].filter(Boolean).join(' · ') || 'Nothing due';
    return `<button class="scell press${i === 0 ? ' today' : ''}${wk ? ' wk' : ''}${sel === iso ? ' on' : ''}" data-act="dueDay" data-v="${iso}" aria-pressed="${sel === iso}" title="${fmtDay(iso)} · ${esc(tip)}" aria-label="${fmtDay(iso)}, ${esc(tip)}"><span class="sw">${i === 0 ? 'Today' : WK[d.getDay()]}</span><span class="sn">${d.getDate()}</span><span class="sdots">${dots}</span></button>`;
  }).join('')}</div>`;
  const visible = sel ? rows.filter(r => r.x.st.due === sel) : rows;
  const legend = `<div class="slegend"><span><i></i>Steps due</span><span><i class="sdi" style="background:var(--muted)"></i><i class="sdi" style="background:var(--c-sage);margin-left:-3px"></i>Install date · designer’s color</span></div>`;
  const selInst = sel ? installs.filter(p => p.installDate === sel) : [];
  const instLine = selInst.length ? `<div class="instline">${I.truck(14)}<span>Installing ${esc(fmtDay(sel))}:</span>${selInst.map(p => `<button class="instchip press" data-act="goOps" title="Open Operations"><span class="dot" style="width:8px;height:8px;background:${dColor(p.designer)}"></span>${esc(shortName(p.name))}${p.crew ? `<span class="muted">· ${esc(p.crew)}</span>` : ''}</button>`).join('')}</div>` : '';
  const overdueN = rows.filter(r => daysFrom(r.x.st.due) < 0 && !U.tleave[r.p.id + ':' + r.x.key]).length;
  const head = `<div class="phead"><div><div class="eyebrow">${overdueN ? overdueN + ' overdue · ' : ''}next 2 weeks</div><h1>Due Soon</h1></div>${sel ? `<button class="btn press" data-act="dueDay" data-v="">Show all</button>` : ''}</div>
    <div style="margin:-8px 0 16px">${designerPills()}</div>`;
  const G = [['over', 'Overdue', r => daysFrom(r.x.st.due) < 0, true], ['today', 'Today', r => daysFrom(r.x.st.due) === 0, true], ['tom', 'Tomorrow', r => daysFrom(r.x.st.due) === 1, true], ['week', 'This week', r => { const n = daysFrom(r.x.st.due); return n >= 2 && n <= 6; }, true], ['later', 'Later', r => daysFrom(r.x.st.due) >= 7, false]];
  const sortD = (a, b) => (daysFrom(a.x.st.due) - daysFrom(b.x.st.due)) || (LEVELS.indexOf(b.x.st.p) - LEVELS.indexOf(a.x.st.p)) || a.p.name.localeCompare(b.p.name);
  const groups = G.map(([id, label, f, defOpen], gi) => {
    const list = visible.filter(f).sort(sortD);
    if (!list.length && (id === 'over' || sel)) return '';
    const open = U.dgroups[id] !== undefined ? U.dgroups[id] : defOpen;
    const cnt = list.filter(r => !U.tleave[r.p.id + ':' + r.x.key]).length;
    const body = !open ? '' : list.length ? `<div class="hscroll"><div class="tbody">${taskHead()}${list.map(r => taskRow(r, { showUpcoming: true, idp: 'd' })).join('')}</div></div>` : `<div class="gempty">Nothing due ${label.toLowerCase()}.</div>`;
    return `<section class="tgroup rise${open ? ' open' : ''}${id === 'over' ? ' late' : ''}" style="animation-delay:${gi * 50}ms"><button class="dhead" data-act="dgroup" data-v="${id}" aria-expanded="${open}">${I.chev()}<span style="font-size:15px;font-weight:600${id === 'over' ? ';color:var(--urgent)' : ''}">${label}</span><span class="mono" style="font-size:12px;color:var(--muted)">${cnt}</span></button>${body}</section>`;
  }).join('');
  const empty = !rows.length ? `<div class="empty rise"><h2>Nothing due in the next two weeks</h2><p>Give a step a target date and it’ll show up here, whatever stage it’s in.</p></div>` : '';
  return head + strip + legend + instLine + (empty || groups);
}

/* ============================================================
   PAGE — Dashboard
   ============================================================ */
function opsJobs() {
  return activeProjects().filter(p => {
    const items = projItems(p); const cs = curStage(p, items);
    if (cs !== 4 && cs !== 5) return false;
    const s25 = (p.steps || {}).w25, s26 = (p.steps || {}).w26;
    return !((s25 && s25.s === 'N/A') || (s26 && s26.s === 'N/A'));
  });
}
function pageDashboard() {
  const h = new Date().getHours();
  const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const dateLbl = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const first = firstName((designers()[0] || {}).name || 'Isaiah');
  const dc = U.dash;
  const head = `<div class="phead"><div><div class="eyebrow">${esc(dateLbl)}</div><h1>${greet}, ${esc(first)}.</h1></div>
    <div style="display:flex;flex-wrap:wrap;align-items:center;gap:10px"><label><span class="sr">Search projects</span><input id="d-search" class="search" placeholder="Search projects" data-dsearch="1" autocomplete="off"></label><button class="btn pri press" data-act="newProject">${I.plus}New project</button></div></div>`;
  if (!activeProjects().length) return head + `<div class="empty rise"><h2>Welcome to the new Green Screen</h2><p>Start your first project. Urgent steps, Operations and your recent projects will gather here.</p><button class="btn pri press" data-act="newProject">${I.plus}New project</button></div>`;
  // urgent
  const urg = openSteps(r => !r.upcoming && r.x.st.p === 'URGENT').concat(Object.keys(U.tleave).map(mk => { const [pid, k] = mk.split(':'); const p = S.projects[pid]; const x = p && getItem(p, k); return p && x && x.st.p === 'URGENT' && isClosed(x.st.s) ? { p, x, cs: curStage(p), upcoming: false } : null; }).filter(Boolean)).sort(byDue);
  const urgN = urg.filter(r => !U.tleave[r.p.id + ':' + r.x.key]).length;
  const tog = (id, label, extra) => `<button class="ctog press" data-act="dashToggle" data-v="${id}" aria-expanded="${!dc[id]}">${I.chev()}${extra || ''}<h2>${label}</h2></button>`;
  const urgCard = `<section class="card dcard rise"><div class="dhd">${tog('u', 'Urgent', `<span class="pbtn tile-URGENT" style="pointer-events:none"><span class="bars lv-URGENT"><i class="on"></i><i class="on"></i><i class="on"></i></span></span>`)}<span class="mono" style="font-size:12px;color:var(--muted)">${urgN}</span><span style="font-size:12px;color:var(--muted)">· current stages only</span><button class="dlink press" data-act="navx" data-v="#/tasklist">Tasklist ›</button></div>
    ${dc.u ? '' : `<div class="cbody">${urg.length ? `<div class="hscroll" style="padding:0 10px 8px"><div class="tbody">${taskHead()}${urg.map(r => taskRow(r, { idp: 'u' })).join('')}</div></div>` : `<div class="gempty" style="padding:4px 18px 18px">Nothing urgent right now.</div>`}</div>`}</section>`;
  // operations snapshot
  const jobs = opsJobs();
  const { proc, now: installing, upcoming: scheduled } = opsParts();
  const sums = [[proc.length, 'to process', proc.length ? ' hot' : ''], [installing.length, 'installing now', ''], [scheduled.filter(p => p.installDate).length, 'scheduled', ''], [scheduled.filter(p => !p.installDate).length, 'not scheduled', ''], [afterJobs(ST_BACK).length, 'backorders', ''], [afterJobs(ST_WARR).length, 'warranty', '']];
  const procRows = proc.length ? proc.map(p => {
    const s = p.steps || {}; const d25 = (s.w25 || {}).s === 'Done', d26 = (s.w26 || {}).s === 'Done';
    const soldAt = (s.w22 || {}).doneAt; const age = soldAt ? Math.max(0, -daysFrom(soldAt)) : null;
    return `<div class="orow"><button class="ock press${d25 !== d26 ? ' half' : ''}" data-act="procBoth" data-pid="${p.id}" title="Mark steps 25 & 26 done" aria-label="Mark ${esc(p.name)} processed">${I.tick()}</button>
      <span style="display:flex;flex-direction:column;gap:4px;min-width:0"><span style="display:flex;align-items:center;gap:7px;min-width:0"><span class="dot" style="width:7px;height:7px;background:${dColor(p.designer)}"></span><a href="#/project/${p.id}" class="clink" style="font-size:13px" title="${esc(p.name)}">${esc(shortName(p.name))}</a></span>
      <span style="display:flex;gap:5px;flex-wrap:wrap"><button class="proc press${d25 ? ' on' : ''}" data-act="procOne" data-pid="${p.id}" data-k="w25" aria-pressed="${d25}"><span class="pk"></span>Crewplan &amp; pics</button><button class="proc press${d26 ? ' on' : ''}" data-act="procOne" data-pid="${p.id}" data-k="w26" aria-pressed="${d26}"><span class="pk"></span>Ops email</button></span></span>
      <span class="mono ${age !== null && age >= 5 ? 'hot' : ''}" style="font-size:11.5px;align-self:start;padding-top:2px;color:${age !== null && age >= 5 ? 'var(--urgent)' : 'var(--muted)'}" title="${age === null ? 'Sold date not recorded' : 'Sold ' + age + ' days ago'}">${age === null ? '—' : age + 'd'}</span></div>`;
  }).join('') : `<div class="gempty" style="padding:8px 16px 12px">All sold jobs are processed.</div>`;
  const instList = installing.concat(scheduled);
  const instRows = instList.length ? instList.map(p => {
    const now = p.opsBucket === 'now'; const ids = opsItems(p, now ? 5 : 4);
    const done = ids.filter(x => isClosed(x.st.s)).length;
    const date = p.installDate ? installLabel(p.installDate) : (now ? 'Now' : 'Not set');
    const warn = !now && p.installDate && daysFrom(p.installDate) <= 3 && done < ids.length;
    return `<button class="irow" data-act="goOps" title="Open in Operations"><span style="display:flex;flex-direction:column;gap:1px;min-width:0"><span style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(shortName(p.name))}${now ? '<span class="nowtag">NOW</span>' : ''}</span><span style="font-size:11.5px;color:var(--muted)">${esc(p.crew || 'No crew leader yet')}</span></span><span class="mono" style="font-size:11.5px;white-space:nowrap;color:var(--${warn ? 'urgent' : now ? 'prog' : 'muted'})">${date}</span><span class="progbtn${done === ids.length ? ' done' : warn ? ' warn' : ''}"><span class="pbar2"><i style="width:${Math.round(done / ids.length * 100)}%"></i></span><span class="pnum">${done}/${ids.length}</span><span>${now ? 'Install' : 'Pre-install'}</span></span></button>`;
  }).join('') : `<div class="gempty" style="padding:8px 16px 12px">No jobs past processing yet.</div>`;
  const opsCard = `<section class="card dcard rise" style="animation-delay:70ms"><div class="dhd">${tog('o', 'Operations', `<span style="color:var(--muted);display:flex">${I.truck(15)}</span>`)}<span class="sums">${sums.map(([n, l, c]) => `<span class="sum${c}"><b>${n}</b>${l}</span>`).join('')}</span><button class="dlink press" data-act="goOps">Big board ›</button></div>
    ${dc.o ? '' : `<div class="cbody opsgrid"><div class="opscol"><div class="olabel">Needs processing</div>${procRows}</div><div class="opscol"><div class="olabel">Installs</div>${instRows}</div></div><div class="opsgrid after"><div class="opscol"><div class="olabel">Backorders</div>${afterMini(ST_BACK)}</div><div class="opscol"><div class="olabel">Warranty replacements</div>${afterMini(ST_WARR)}</div></div>`}</section>`;
  // recently edited (one row)
  const recent = activeProjects().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 16);
  const recCard = `<section class="drawer rise" style="animation-delay:140ms;margin-top:18px"><div class="dhd" style="padding:12px 16px">${tog('r', 'Recently edited')}<button class="dlink press" data-act="navx" data-v="#/projects">All projects ›</button></div>
    ${dc.r ? '' : `<div class="fgrid onerow" id="recent-row">${recent.map(p => folderHtml(p, { noActs: true })).join('')}</div>`}</section>`;
  return head + `<div style="display:flex;flex-direction:column;gap:18px">${urgCard}${opsCard}</div>` + recCard;
}
/* Project page: light green boxes around runs of open steps in the current stage.
   They grow, shrink, split and merge between renders by remembering the last geometry. */
let OB = { key: null, boxes: [] };
function layoutOpenBoxes(instant) {
  const wrap = document.querySelector('.obwrap');
  if (!wrap) { OB = { key: null, boxes: [] }; return; }
  const layer = wrap.querySelector('.oboxes');
  const key = wrap.dataset.ob;
  const rows = [...wrap.querySelectorAll(':scope > .step')];
  const runs = []; let cur = null;
  rows.forEach(r => { if (r.classList.contains('isopen')) { if (!cur) { cur = [r, r]; runs.push(cur); } else cur[1] = r; } else cur = null; });
  const next = runs.map(([a, b]) => ({ top: a.offsetTop - 2, h: b.offsetTop + b.offsetHeight - a.offsetTop + 4 }));
  const old = OB.key === key ? OB.boxes : [];
  const anim = !instant && motionOK();
  const ov = (a, b) => Math.max(0, Math.min(a.top + a.h, b.top + b.h) - Math.max(a.top, b.top));
  const mk = (g, o) => { const el = document.createElement('div'); el.className = 'obox'; el.style.transition = 'none'; el.style.top = g.top + 'px'; el.style.height = Math.max(0, g.h) + 'px'; el.style.opacity = o; layer.appendChild(el); return el; };
  const go = (el, g, o) => { el.style.transition = ''; el.style.top = g.top + 'px'; el.style.height = Math.max(0, g.h) + 'px'; el.style.opacity = o; };
  const used = new Set(); const moves = [];
  next.forEach(g => {
    if (!anim) { mk(g, 1); return; }
    let best = -1, bv = 0; old.forEach((o, i) => { if (used.has(i)) return; const v = ov(o, g); if (v > bv) { bv = v; best = i; } });
    if (best >= 0) { used.add(best); moves.push([mk(old[best], 1), g, 1]); return; }
    let src = null, sv = 0; old.forEach(o => { const v = ov(o, g); if (v > sv) { sv = v; src = o; } });
    moves.push([src ? mk(src, 1) : mk({ top: g.top + g.h / 2, h: 0 }, 0), g, 1]);
  });
  if (anim) old.forEach((o, i) => {
    if (used.has(i)) return;
    let t = null, tv = 0; next.forEach(g => { const v = ov(o, g); if (v > tv) { tv = v; t = g; } });
    const el = mk(o, 1); moves.push([el, t || { top: o.top + o.h / 2, h: 0 }, t ? 1 : 0]);
    setTimeout(() => el.remove(), 420);
  });
  if (moves.length) { void layer.offsetHeight; moves.forEach(([el, g, o]) => go(el, g, o)); }
  OB = { key, boxes: next };
}
window.addEventListener('resize', () => { if (U.route.page === 'project') { const l = document.querySelector('.oboxes'); if (l) { l.innerHTML = ''; layoutOpenBoxes(true); } } });
function fitRecentRow() {
  const row = document.getElementById('recent-row'); if (!row) return;
  const kids = [...row.children]; if (!kids.length) return;
  kids.forEach(k => { k.style.display = ''; });
  const w = row.clientWidth - 28; const cols = Math.max(1, Math.floor((w + 12) / (196 + 12)));
  row.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  kids.forEach((k, i) => { k.style.display = i < cols ? '' : 'none'; });
}
window.addEventListener('resize', () => { if (U.route.page === 'dashboard') fitRecentRow(); });
function procSet(pid, patch, label) {
  const p = S.projects[pid]; if (!p) return;
  mutate(pid, q => { Object.entries(patch).forEach(([k, v]) => setItem(q, k, { s: v ? 'Done' : 'Not Started', doneAt: v ? todayISO() : '' })); }, label);
}

/* ============================================================
   PAGE — Workflow (template editor)
   ============================================================ */
function pageWorkflow() {
  const wf = S.workflow;
  const head = `<div class="phead"><div><div class="eyebrow">${wf.length} steps · 7 stages · changes apply to every project</div><h1>Workflow</h1></div></div>`;
  const stages = STAGES.map((name, si) => {
    const list = wf.map((w, i) => ({ w, n: i + 1 })).filter(r => r.w.stage === si);
    const open = U.wopen[si] !== undefined ? U.wopen[si] : true;
    const src = CUSTOM_STAGES.includes(si) ? '<span class="badge custom">CUSTOM STAGE · NOT IN PIPEDRIVE</span>' : '<span style="font-size:12px;color:var(--muted)">Pipedrive stage</span>';
    const rows = list.map(({ w, n }, j) => `<div class="step wrow-grid${U.wdrag === w.id ? ' dragging' : ''}" data-wid="${w.id}" data-stage="${si}" draggable="true">
      <span class="grip" title="Drag to reorder" aria-hidden="true">${svg(14, '<circle cx="9" cy="6" r="1"></circle><circle cx="15" cy="6" r="1"></circle><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="9" cy="18" r="1"></circle><circle cx="15" cy="18" r="1"></circle>', 2.4)}</span>
      <span class="snum">${n}</span>
      <label style="min-width:0"><span class="sr">Step title</span><input class="wedit wtitle" id="wt-${w.id}" value="${esc(w.title)}" data-wcommit="title" data-wid="${w.id}" autocomplete="off"></label>
      <label style="min-width:0"><span class="sr">Detail</span><input class="wedit" id="wd-${w.id}" value="${esc(w.detail)}" placeholder="Add detail" data-wcommit="detail" data-wid="${w.id}" autocomplete="off"></label>
      <button class="opt press${w.optional ? ' on' : ''}" data-act="wopt" data-wid="${w.id}" aria-pressed="${!!w.optional}" title="Optional steps don’t count toward progress">Optional</button>
      <span class="tools"><button class="ibtn press" data-act="wmove" data-wid="${w.id}" data-v="-1" title="Move up" ${j === 0 ? 'disabled' : ''}>${I.up}</button><button class="ibtn press" data-act="wmove" data-wid="${w.id}" data-v="1" title="Move down" ${j === list.length - 1 ? 'disabled' : ''}>${I.dn}</button><button class="ibtn del press" data-act="wdel" data-wid="${w.id}" title="Delete from every project">${I.trash()}</button></span>
    </div>`).join('');
    return `<section class="stage rise${open ? ' open' : ''}" style="animation-delay:${si * 40}ms"><div class="shead" data-act="wstage" data-i="${si}" role="button" tabindex="0" aria-expanded="${open}">${I.chev()}<span class="sname">${name}</span>${src}<span class="mono" style="font-size:12px;color:var(--muted);margin-left:auto">${list.length} steps</span></div>
      ${open ? `<div class="sbody"><div class="colhead wrow-grid"><span></span><span>#</span><span>Title</span><span>Detail</span><span></span><span></span></div><div data-dropstage="${si}">${rows}</div>
      <div style="display:flex;align-items:center;gap:10px;padding:6px 10px 2px;border-top:1px solid var(--line)"><span style="width:22px;display:grid;place-items:center;color:var(--muted)">${I.plus}</span><label style="flex:1;display:flex"><span class="sr">Add a step to ${name}</span><input id="wadd-${si}" class="addin" placeholder="Add step to ${name} — press Enter" data-wadd="${si}" autocomplete="off"></label></div></div>` : ''}</section>`;
  }).join('');
  return head + `<div style="display:flex;flex-direction:column;gap:10px">${stages}</div>`;
}
/* workflow edits — snapshot workflow (+ any projects touched) for Undo */
function wfChange(fn, label, touchProjects) {
  const beforeWf = clone(S.workflow);
  const beforeP = {};
  const wf = clone(S.workflow);
  const changed = fn(wf) || [];
  putMeta('workflow', wf);
  (touchProjects ? changed : []).forEach(({ before, after }) => { beforeP[before.id] = before; putProject(after, { keepTime: true }); });
  if (label) pushUndo(label, () => { putMeta('workflow', beforeWf); Object.values(beforeP).forEach(p => putProject(p, { keepTime: true })); });
}
function wfAdd(si, title, fromCustom) {
  const id = 'w' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  wfChange(wf => {
    let at = -1; wf.forEach((w, i) => { if (w.stage === si) at = i; });
    if (at < 0) at = wf.findIndex(w => w.stage > si) - 1;
    wf.splice(at + 1, 0, { id, stage: si, title, detail: '', optional: false });
    const out = [];
    Object.values(S.projects).forEach(p => {
      const cs = curStage(p);
      if (fromCustom && p.id === fromCustom.pid) {
        const before = clone(p); const after = clone(p); const c = (after.custom || []).find(c => c.id === fromCustom.cid);
        after.custom = (after.custom || []).filter(x => x.id !== fromCustom.cid);
        if (c) { after.steps = after.steps || {}; after.steps[id] = { s: c.s, p: c.p, due: c.due, note: c.note, dis: c.dis || false, doneAt: c.doneAt || '' }; }
        out.push({ before, after });
      } else if (cs > si) {
        const before = clone(p); const after = clone(p); after.steps = after.steps || {}; after.steps[id] = Object.assign({}, DEF_ST, { s: 'Done', doneAt: todayISO() });
        out.push({ before, after });
      }
    });
    return out;
  }, fromCustom ? '“' + title + '” added to the template' : '“' + title + '” added to ' + STAGES[si], true);
}
function wfCommit(el) {
  const id = el.dataset.wid, f = el.dataset.wcommit; const w = S.workflow.find(x => x.id === id); if (!w) return;
  const v = el.value.trim();
  if (f === 'title' && !v) { el.value = w.title; return; }
  if ((w[f] || '') === v) return;
  wfChange(wf => { wf.find(x => x.id === id)[f] = v; }, f === 'title' ? 'Step renamed to “' + v + '”' : 'Detail updated');
}

/* ============================================================
   PAGE — Operations
   ============================================================ */
/* Operations steps are matched by their permanent IDs, so editing the Workflow never breaks them:
   w22 sold · w25 crewplan · w26 ops email · pre-install = the rest of Finalize & Process · install = Project Install */
const opsItems = (p, stage) => projItems(p).filter(x => x.stage === stage && !x.optional && x.key !== 'w25' && x.key !== 'w26');
const stepS = (p, n) => (((p.steps || {})['w' + n]) || {}).s || 'Not Started';
const stepDone = (p, n) => { const s = stepS(p, n); return s === 'Done' || s === 'N/A'; };
function wfIdForN(n) { return 'w' + n; }
function opsParts() {
  const jobs = opsJobs();
  const proc = jobs.filter(p => curStage(p) === 4 && !(stepS(p, 25) === 'Done' && stepS(p, 26) === 'Done'));
  /* The two schedule sections are just for organizing: which bucket a job is in is its own setting
     (p.opsBucket) and never checks or unchecks steps. New jobs start in Upcoming. */
  const sched = jobs.filter(p => !proc.includes(p));
  const now = sched.filter(p => p.opsBucket === 'now');
  const upcoming = sched.filter(p => p.opsBucket !== 'now');
  return { jobs, proc, now, upcoming };
}
function soldAge(p) { const d = ((p.steps || {}).w22 || {}).doneAt; return d ? Math.max(0, -daysFrom(d)) : null; }
function installLabel(iso) { if (!iso) return ''; const n = daysFrom(iso); if (n === 0) return 'Today'; if (n === 1) return 'Tomorrow'; const d = parseISO(iso); return WK[d.getDay()] + ', ' + MO[d.getMonth()] + ' ' + d.getDate(); }
function pageOperations() {
  const { proc, now, upcoming } = opsParts();
  const procAll = proc.concat(Object.keys(U.oleave).map(id => S.projects[id]).filter(p => p && !proc.includes(p)));
  const sched = upcoming.filter(p => p.installDate).length;
  const head = `<div class="phead"><div><div class="eyebrow">Finalize &amp; Process · Project Install · Backorders · Warranty</div><h1>Operations</h1></div>
    <div class="sums" style="margin:0">${[[proc.length, 'to process', proc.length ? ' hot' : ''], [now.length, 'installing now', ''], [sched, 'scheduled', ''], [upcoming.length - sched, 'not scheduled', ''], [afterJobs(ST_BACK).length, 'backorders', ''], [afterJobs(ST_WARR).length, 'warranty', '']].map(([n, l, c]) => `<span class="sum${c}"><b>${n}</b>${l}</span>`).join('')}</div></div>`;
  if (!opsJobs().length && !Object.keys(U.oleave).length && !afterJobs(ST_BACK).length && !afterJobs(ST_WARR).length && !Object.keys(U.aleave).length) {
    return head + `<div id="emslot"></div><div class="empty rise"><h2>No jobs in Finalize &amp; Process yet</h2><p>Jobs show up here once their Revise stage is complete, and stay through Backorders and Warranty Replacements. Jobs with Crewplan or Ops Email marked N/A are left off.</p></div>`;
  }
  // needs processing
  const procRows = procAll.length ? procAll.map(p => {
    const d25 = stepS(p, 25) === 'Done', d26 = stepS(p, 26) === 'Done'; const age = soldAge(p);
    const hasDraft = p.emailDraft && p.emailDraft.touched;
    return `<div class="orow2${U.oleave[p.id] ? ' leaving' : ''}${U.oback[p.id] ? ' back' : ''}">
      <button class="ock press${d25 !== d26 ? ' half' : ''}" data-act="procBothAnim" data-pid="${p.id}" title="Mark steps 25 &amp; 26 done" aria-label="Mark ${esc(p.name)} processed">${I.tick()}</button>
      <span style="display:flex;align-items:center;gap:8px;min-width:0"><span class="dot" style="width:7px;height:7px;background:${dColor(p.designer)}"></span><a href="#/project/${p.id}" class="clink" title="${esc(p.name)}">${esc(shortName(p.name))}</a></span>
      <span style="display:flex;gap:6px;flex-wrap:wrap;align-items:center"><button class="proc press${d25 ? ' on' : ''}" data-act="procOne" data-pid="${p.id}" data-k="${wfIdForN(25)}" aria-pressed="${d25}"><span class="pk"></span>Crewplan &amp; pics</button><button class="proc press${d26 ? ' on' : ''}" data-act="procOne" data-pid="${p.id}" data-k="${wfIdForN(26)}" aria-pressed="${d26}"><span class="pk"></span>Ops email</button><button class="ewrite press${hasDraft ? ' draft' : ''}" data-act="openEmail" data-pid="${p.id}">${svg(11, '<path d="M4 20h4L19 9l-4-4L4 16v4z"></path>', 2)}${hasDraft ? 'Edit draft' : 'Write email'}</button></span>
      <span class="mono" style="font-size:12px;color:${age !== null && age >= 5 ? 'var(--urgent)' : 'var(--muted)'};text-align:right" title="${age === null ? 'Sold date not recorded (step 22)' : 'Sold ' + age + ' days ago'}">${age === null ? '—' : 'Sold ' + age + 'd'}</span>
    </div>`;
  }).join('') : `<div class="gempty" style="padding:6px 18px 16px">All sold jobs are processed.</div>`;
  const procCard = `<section class="card dcard rise"><div class="dhd"><h2>Needs processing</h2><span class="mono" style="font-size:12px;color:var(--muted)">${proc.length}</span></div>
    ${procAll.length ? `<div class="colhead ohead"><span></span><span>Job</span><span>Steps</span><span style="text-align:right">Sold</span></div>` : ''}${procRows}</section>`;
  // install schedule
  const byDate = (a, b) => (a.installDate ? daysFrom(a.installDate) : 9999) - (b.installDate ? daysFrom(b.installDate) : 9999) || a.name.localeCompare(b.name);
  const sec = (id, title, list, sub) => `<section class="card dcard rise sched${U.odrop === id ? ' dropping' : ''}" data-dropzone="${id}" style="animation-delay:${id === 'now' ? 60 : 110}ms"><div class="dhd"><h2>${title}</h2><span class="mono" style="font-size:12px;color:var(--muted)">${list.length}</span></div>
    ${list.length ? `<div class="colhead srow-grid"><span></span><span>Job</span><span>Install date</span><span>Crew leader</span><span>Progress</span><span></span></div>${list.slice().sort(byDate).map(p => schedRow(p, id)).join('')}` : `<div class="gempty dropzone-empty" style="padding:6px 18px 16px">${id === 'now' ? 'Nothing installing right now. Drag a job here when the crew starts.' : 'No processed jobs waiting. Jobs land here once steps 25 and 26 are done.'}</div>`}</section>`;
  return head + `<div id="emslot"></div><div style="display:flex;flex-direction:column;gap:18px">${procCard}${sec('now', 'Installing now', now, 'crew is on site')}${sec('up', 'Upcoming', upcoming, 'drag between sections to organize · doesn’t change any steps')}${afterCard(ST_BACK, 160)}${afterCard(ST_WARR, 210)}</div>`;
}
function schedRow(p, zone) {
  const isNow = zone === 'now'; const ids = opsItems(p, isNow ? 5 : 4);
  const done = ids.filter(x => isClosed(x.st.s)).length;
  const warn = !isNow && p.installDate && daysFrom(p.installDate) <= 3 && done < ids.length;
  const m = U.menu;
  const dOpen = m && m.kind === 'idate' && m.key === p.id;
  const dow = today0().getDay(); const fri = ((5 - dow + 7) % 7) || 7; const mon = ((1 - dow + 7) % 7) || 7;
  const quick = [['Today', 0], ['Tomorrow', 1], ['By Friday', fri], ['Next Monday', mon], ['Monday after', mon + 7]];
  const dMenu = dOpen ? `<div class="smenu${U.menuFresh ? ' pop-in' : ''}" role="menu" style="min-width:210px;left:0;right:auto"><div class="mhead">Install date</div>${quick.map(([l, n]) => { const iso = addDays(n); const d = parseISO(iso); return `<button class="mi" data-act="setInstall" data-pid="${p.id}" data-v="${iso}">${l}<span class="hint">${MO[d.getMonth()]} ${d.getDate()}</span></button>`; }).join('')}<label class="mpick">Pick a date<input type="date" value="${p.installDate || ''}" data-change="pickInstall" data-pid="${p.id}"></label>${p.installDate ? `<button class="mi danger" data-act="setInstall" data-pid="${p.id}" data-v="">Clear date</button>` : ''}</div>` : '';
  const crews = (S.settings.crews || []).slice().sort((a, b) => a.localeCompare(b));
  const pOpen = m && m.kind === 'prog' && m.key === p.id;
  const pop = pOpen ? `<div class="smenu progpop${U.menuFresh ? ' pop-in' : ''}" role="dialog" aria-label="${isNow ? 'Install' : 'Pre-install'} checklist"><div class="mhead">${isNow ? 'Install' : 'Pre-install'} · ${esc(shortName(p.name))}</div>${ids.map(x => { const s = x.st.s; const ok = isClosed(s); return `<button class="mi pchk${ok ? ' on' : ''}" data-act="progStep" data-pid="${p.id}" data-k="${x.key}"><span class="bx">${I.tick(9)}</span><span style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis${s === 'N/A' ? ';opacity:.6' : ''}">${esc(x.title)}</span><span class="hint">${s === 'N/A' ? 'N/A' : (x.n || '')}</span></button>`; }).join('')}<a class="mi" href="#/project/${p.id}" style="text-decoration:none;color:var(--accent);font-weight:500;border-top:1px solid var(--line);margin-top:4px;border-radius:0 0 7px 7px">Open project ›</a></div>` : '';
  return `<div class="step srow srow-grid${U.odrag === p.id ? ' dragging' : ''}" data-opid="${p.id}" data-zone="${zone}" draggable="true">
    <span class="grip" title="Drag to the other section" aria-hidden="true">${svg(14, '<circle cx="9" cy="6" r="1"></circle><circle cx="15" cy="6" r="1"></circle><circle cx="9" cy="12" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="9" cy="18" r="1"></circle><circle cx="15" cy="18" r="1"></circle>', 2.4)}</span>
    <span style="display:flex;align-items:center;gap:8px;min-width:0"><span class="dot" style="width:7px;height:7px;background:${dColor(p.designer)}"></span><a href="#/project/${p.id}" class="clink" title="${esc(p.name)}">${esc(shortName(p.name))}</a>${isNow ? '<span class="nowtag">NOW</span>' : ''}</span>
    <div style="position:relative;min-width:0"><button class="duebtn press tone-${warn ? 'urgent' : p.installDate ? 'ink' : 'muted'}" data-act="menu" data-kind="idate" data-key="${p.id}" aria-haspopup="menu" aria-expanded="${dOpen}">${I.cal}${p.installDate ? esc(installLabel(p.installDate)) : 'Set date'}</button>${dMenu}</div>
    ${dpick(p.crew || '', [['', 'No crew leader']].concat(crews.map(c => [c, c])).concat(p.crew && !crews.includes(p.crew) ? [[p.crew, p.crew]] : []), `data-change="crew" data-pid="${p.id}"`, { cls: 'crewpick', btn: 'sel crewsel', placeholder: 'Assign crew leader…', label: 'Crew leader for ' + p.name, left: true })}
    <div style="position:relative"><button class="progbtn press${done === ids.length ? ' done' : warn ? ' warn' : ''}" data-act="menu" data-kind="prog" data-key="${p.id}" aria-haspopup="dialog" aria-expanded="${pOpen}" title="${warn ? 'Install is within 3 days and pre-install isn’t finished' : 'Open checklist'}"><span class="pbar2"><i style="width:${Math.round(done / ids.length * 100)}%"></i></span><span class="pnum">${done}/${ids.length}</span><span>${isNow ? 'Install' : 'Pre-install'}</span></button>${pop}</div>
    <button class="ibtn press" data-act="${isNow ? 'pauseInstall' : 'startInstall'}" data-pid="${p.id}" title="${isNow ? 'Move back to Upcoming' : 'Move to Installing now'}" aria-label="${isNow ? 'Move back to Upcoming' : 'Start install'}">${isNow ? svg(14, '<path d="M12 5v14M6 13l6 6 6-6"></path>', 2) : svg(14, '<path d="M12 19V5M6 11l6-6 6 6"></path>', 2)}</button>
  </div>`;
}
function startInstall(pid) {
  const p = S.projects[pid]; if (!p) return;
  mutate(pid, q => { q.opsBucket = 'now'; if (!q.installDate) q.installDate = todayISO(); }, shortName(p.name) + ' moved to Installing now');
}
function pauseInstall(pid) {
  const p = S.projects[pid]; if (!p) return;
  mutate(pid, q => { q.opsBucket = 'up'; }, shortName(p.name) + ' moved back to Upcoming');
}
function procBothAnim(pid) {
  const p = S.projects[pid]; if (!p || U.oleave[pid]) return;
  const finish = () => { delete U.oleave[pid]; mutate(pid, q => { [25, 26].forEach(n => setItem(q, wfIdForN(n), { s: 'Done', doneAt: todayISO() })); }, shortName(p.name) + ' processed · steps 25–26 checked', { onUndo: () => { U.oback[pid] = true; setTimeout(() => { delete U.oback[pid]; }, 500); } }); };
  if (!motionOK()) return finish();
  U.oleave[pid] = true; render(); setTimeout(finish, 620);
}

/* After-install tracking: Backorders (stage 6) and Warranty Replacements (stage 7).
   A job is listed once Project Install is complete, until every step in that stage is Done or N/A.
   Same exclusions as the rest of Operations (steps 25/26 N/A); archived jobs drop off. */
function installDone(p, items) { return !items.some(x => x.stage <= ST_INSTALL && !x.optional && !isClosed(x.st.s)); }
function installedAge(p) {
  let last = ''; S.workflow.forEach(w => { if (w.stage === ST_INSTALL) { const d = ((p.steps || {})[w.id] || {}).doneAt || ''; if (d > last) last = d; } });
  return last ? Math.max(0, -daysFrom(last)) : null;
}
function afterJobs(si) {
  return activeProjects().filter(p => {
    if (stepS(p, 25) === 'N/A' || stepS(p, 26) === 'N/A') return false;
    const items = projItems(p);
    return installDone(p, items) && items.some(x => x.stage === si && !isClosed(x.st.s));
  }).sort((a, b) => (installedAge(b) ?? -1) - (installedAge(a) ?? -1) || a.name.localeCompare(b.name));
}
const afterLabel = (t) => /^pipedrive:/i.test(t) ? 'Pipedrive task' : /paperwork/i.test(t) ? 'Paperwork' : t;
function afterPills(p, si) {
  return stageItems(p, si).map(x => { const s = x.st.s; const on = s === 'Done', na = s === 'N/A';
    return `<button class="proc press${on ? ' on' : ''}${na ? ' na' : ''}" data-act="afterStep" data-pid="${p.id}" data-k="${x.key}" aria-pressed="${on}" title="${esc(x.title)}${na ? ' · N/A (click to reopen)' : on ? ' · done (click to reopen)' : ' · click to mark done'}"><span class="pk"></span>${esc(afterLabel(x.title))}${na ? ' · N/A' : ''}</button>`; }).join('');
}
function afterHalf(p, si) { const l = stageItems(p, si); const c = l.filter(x => isClosed(x.st.s)).length; return c > 0 && c < l.length; }
function afterSet(pid, si, status, anim) {
  const p = S.projects[pid]; if (!p) return; const lk = pid + ':' + si;
  if (U.aleave[lk]) return;
  const keys = stageItems(p, si).filter(x => !isClosed(x.st.s)).map(x => x.key);
  if (!keys.length) return;
  const label = shortName(p.name) + ' · ' + STAGES[si] + (status === 'Done' ? ' done' : ' marked N/A');
  const finish = () => { delete U.aleave[lk]; mutate(pid, q => { keys.forEach(k => setItem(q, k, { s: status, doneAt: status === 'Done' ? todayISO() : '' })); }, label, { onUndo: () => { U.oback[lk] = true; setTimeout(() => { delete U.oback[lk]; }, 500); } }); };
  if (!anim || !motionOK()) return finish();
  U.aleave[lk] = true; render(); setTimeout(finish, 620);
}
function afterStep(pid, k) {
  const p = S.projects[pid]; if (!p) return; const x = getItem(p, k); if (!x) return;
  const next = isClosed(x.st.s) ? 'Not Started' : 'Done';
  mutate(pid, q => setItem(q, k, { s: next, doneAt: next === 'Done' ? todayISO() : '' }), '“' + x.title + '” ' + (next === 'Done' ? 'checked' : 'reopened') + ' · ' + shortName(p.name));
}
function afterCard(si, delay) {
  const list = afterJobs(si);
  const all = list.concat(Object.keys(U.aleave).filter(k => k.endsWith(':' + si)).map(k => S.projects[k.split(':')[0]]).filter(p => p && !list.includes(p)));
  const rows = all.map(p => { const lk = p.id + ':' + si; const age = installedAge(p);
    return `<div class="orow2${U.aleave[lk] ? ' leaving' : ''}${U.oback[lk] ? ' back' : ''}">
      <button class="ock press${afterHalf(p, si) ? ' half' : ''}" data-act="afterDone" data-pid="${p.id}" data-i="${si}" title="Mark every ${esc(STAGES[si])} step done" aria-label="Mark ${esc(p.name)} ${esc(STAGES[si])} done">${I.tick()}</button>
      <span style="display:flex;align-items:center;gap:8px;min-width:0"><span class="dot" style="width:7px;height:7px;background:${dColor(p.designer)}"></span><a href="#/project/${p.id}" class="clink" title="${esc(p.name)}">${esc(shortName(p.name))}</a></span>
      <span style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">${afterPills(p, si)}<button class="ewrite press" data-act="afterNA" data-pid="${p.id}" data-i="${si}" title="Mark the open ${esc(STAGES[si])} steps N/A">None needed</button></span>
      <span class="mono" style="font-size:12px;color:var(--muted);text-align:right" title="${age === null ? 'Install finish date not recorded' : 'Install finished ' + age + ' days ago'}">${age === null ? '—' : age + 'd ago'}</span>
    </div>`; }).join('');
  const empty = si === ST_BACK ? 'No open backorders.' : 'No open warranty replacements.';
  return `<section class="card dcard rise" style="animation-delay:${delay}ms"><div class="dhd"><h2>${STAGES[si]}</h2><span class="mono" style="font-size:12px;color:var(--muted)">${list.length}</span></div>
    ${all.length ? `<div class="colhead ohead"><span></span><span>Job</span><span>Steps</span><span style="text-align:right">Installed</span></div>${rows}` : `<div class="gempty" style="padding:6px 18px 16px">${empty} Jobs show up here once Project Install is complete, until both steps are Done or N/A.</div>`}</section>`;
}
function afterMini(si) {
  const list = afterJobs(si);
  return list.length ? list.map(p => { const age = installedAge(p);
    return `<div class="orow"><button class="ock press${afterHalf(p, si) ? ' half' : ''}" data-act="afterDone" data-pid="${p.id}" data-i="${si}" title="Mark every ${esc(STAGES[si])} step done" aria-label="Mark ${esc(p.name)} ${esc(STAGES[si])} done">${I.tick()}</button>
      <span style="display:flex;flex-direction:column;gap:4px;min-width:0"><span style="display:flex;align-items:center;gap:7px;min-width:0"><span class="dot" style="width:7px;height:7px;background:${dColor(p.designer)}"></span><a href="#/project/${p.id}" class="clink" style="font-size:13px" title="${esc(p.name)}">${esc(shortName(p.name))}</a></span>
      <span style="display:flex;gap:5px;flex-wrap:wrap">${afterPills(p, si)}</span></span>
      <span class="mono" style="font-size:11.5px;align-self:start;padding-top:2px;color:var(--muted)" title="${age === null ? 'Install finish date not recorded' : 'Install finished ' + age + ' days ago'}">${age === null ? '—' : age + 'd'}</span></div>`; }).join('')
    : `<div class="gempty" style="padding:8px 16px 12px">${si === ST_BACK ? 'No open backorders.' : 'No open warranty replacements.'}</div>`;
}

/* ============================================================
   OPS EMAIL BUILDER (step 26) — side panel over Operations
   ============================================================ */
const EM_BOOL = ['greetOn', 'relatedOn', 'planOn', 'crewOn', 'placeholderOn', 'hardReq', 'accessOn', 'weatherOn', 'locatesOn', 'reviewOn', 'poOn'];
const EM_DEFAULT_KEYS = ['notifyTags', 'locatesTags', 'locatesPhrase', 'locatesScope', 'reviewTags', 'poTags', 'poMaterials', 'planYear', 'senderName'];
const EM_POS = [['greeting', 'After greeting'], ['intro', 'After intro / MH line'], ['related', 'After related project note'], ['includes', 'After includes list'], ['extraScope', 'After additional scope note'], ['plan', 'After plans & pics'], ['crew', 'After crew & scheduling'], ['access', 'After access note'], ['weather', 'After weather note'], ['locates', 'After locates'], ['review', 'After review sheet'], ['po', 'After material PO'], ['closing', 'After closing line'], ['end', 'At the very end (before sign-off)']];
function emNewDraft(p) {
  const hr = new Date().getHours();
  let timeframe = '';
  if (p.installDate) { const x = parseISO(p.installDate); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); timeframe = 'the week of ' + MO[x.getMonth()] + ' ' + x.getDate(); }
  const d = { greetOn: true, timeOfDay: hr < 12 ? 'Morning' : hr < 17 ? 'Afternoon' : 'Evening', customerName: '', pronoun: 'he', scopeSummary: '', city: '', mh: '', mhScope: '', includesList: '', extraScopeNote: '',
    relatedOn: false, relatedNote: '', planOn: true, planYear: String(new Date().getFullYear()), crewOn: true, notifyTags: '', placeholderOn: true, crewLead: p.crew ? p.crew.split(' ')[0] : '', timeframe, hardReq: false, schedulingNote: '',
    accessOn: false, accessNote: '', weatherOn: false, weatherNote: '', locatesOn: true, locatesTags: '', locatesPhrase: 'locates will be needed for', locatesScope: '', reviewOn: true, reviewTags: '', poOn: true, poTags: '', poMaterials: '',
    extras: [], closingNote: 'Reach out if you have any questions.', signOff: 'Thanks,', senderName: '', seq: 0, touched: false };
  const def = S.settings.opsEmailDefaults || {};
  EM_DEFAULT_KEYS.forEach(k => { if (def[k]) d[k] = def[k]; });
  return d;
}
function emBuild(d) {
  const P = d.pronoun === 'she' ? { subj: 'she', poss: 'her', verb: 'wants', be: 'is' } : d.pronoun === 'they' ? { subj: 'they', poss: 'their', verb: 'want', be: 'are' } : { subj: 'he', poss: 'his', verb: 'wants', be: 'is' };
  const tv = (x) => String(x || '').trim();
  const V = (x, ph) => tv(x) ? { t: tv(x) } : { t: '[' + ph + ']', miss: true };
  const T = (t) => ({ t });
  const joinList = (items) => { const l = String(items || '').split('\n').map(x => x.trim()).filter(Boolean); if (!l.length) return ''; if (l.length === 1) return l[0] + '.'; if (l.length === 2) return l[0] + ' and ' + l[1] + '.'; return l.slice(0, -1).join(', ') + ', and ' + l[l.length - 1] + '.'; };
  const extras = {}; (d.extras || []).forEach(x => { if (tv(x.text)) (extras[x.pos] = extras[x.pos] || []).push(tv(x.text)); });
  const paras = [];
  const push = (key, segs) => { paras.push(segs); (extras[key] || []).forEach(t => paras.push([T(t)])); };
  if (d.greetOn) push('greeting', [T(d.timeOfDay + ' everybody.')]);
  push('intro', [V(d.customerName, 'Customer name'), T(' ' + P.be + ' all signed up and ready to go - ' + P.subj + ' ' + P.verb + ' us to '), V(d.scopeSummary, 'scope summary'), T(' at ' + P.poss + ' home '), V(d.city, 'location'), T(', estimated at '), V(d.mh, 'MH'), T(' MH of work' + (tv(d.mhScope) ? ' ' + tv(d.mhScope) : '') + '.')]);
  if (d.relatedOn && tv(d.relatedNote)) push('related', [T(tv(d.relatedNote))]);
  const inc = joinList(d.includesList); if (inc) push('includes', [T('Project includes ' + inc)]);
  if (tv(d.extraScopeNote)) push('extraScope', [T(tv(d.extraScopeNote))]);
  if (d.planOn) push('plan', [T('Plan and pics are attached to this email and in the '), V(d.planYear, 'year'), T(' CREW folder in OneDrive.')]);
  if (d.crewOn) {
    const segs = [];
    if (tv(d.notifyTags)) segs.push(T(tv(d.notifyTags) + ' '));
    if (d.placeholderOn) { segs.push(T("there's already a placeholder for this project under "), V(d.crewLead, 'crew lead'), T("'s column for "), V(d.timeframe, 'timeframe'), T('.')); if (d.hardReq) segs.push(T(' Needs to be '), V(d.crewLead, 'crew lead'), T("'s crew that works on this one.")); }
    if (tv(d.schedulingNote)) segs.push(T((segs.length ? ' ' : '') + tv(d.schedulingNote)));
    if (segs.length) push('crew', segs);
  }
  if (d.accessOn && tv(d.accessNote)) push('access', [T(tv(d.accessNote))]);
  if (d.weatherOn && tv(d.weatherNote)) push('weather', [T(tv(d.weatherNote))]);
  if (d.locatesOn) push('locates', [V(d.locatesTags, 'tag'), T(' ' + (tv(d.locatesPhrase) || 'locates will be needed for') + ' '), V(d.locatesScope, 'scope'), T('.')]);
  if (d.reviewOn) push('review', [V(d.reviewTags, 'tag'), T(' please look over the attached review sheet and get with me if you have any concerns about availability prior to install.')]);
  if (d.poOn) push('po', [V(d.poTags, 'tag'), T(' please note that a Material PO# is required for this one ('), V(d.poMaterials, 'materials'), T(').')]);
  if (tv(d.closingNote)) push('closing', [T(tv(d.closingNote))]);
  (extras.end || []).forEach(t => paras.push([T(t)]));
  paras.push([T((tv(d.signOff) || 'Thanks,') + (tv(d.senderName) ? '\n' + tv(d.senderName) : ''))]);
  return { paras, text: paras.map(p => p.map(x => x.t).join('')).join('\n\n'), miss: paras.reduce((n, p) => n + p.filter(x => x.miss).length, 0) };
}
function openEmail(pid) {
  const p = S.projects[pid]; if (!p) return;
  U.email = { pid, d: p.emailDraft ? Object.assign(emNewDraft(p), clone(p.emailDraft)) : emNewDraft(p), copied: false, note: '' };
  U.emailFresh = true; render(); U.emailFresh = false;
  const slot = document.getElementById('emslot'); if (slot) slot.scrollIntoView({ behavior: motionOK() ? 'smooth' : 'auto', block: 'start' });
}
let emSaveTimer = null;
function emSave() {
  clearTimeout(emSaveTimer);
  emSaveTimer = setTimeout(() => { const e = U.email; if (!e) return; const p = S.projects[e.pid]; if (!p) return; const q = clone(p); q.emailDraft = clone(e.d); putProject(q, { keepTime: true }); }, 700);
}
function emPreview() {
  const e = U.email; if (!e) return;
  const b = emBuild(e.d);
  const box = document.getElementById('em-text'); if (box) box.innerHTML = b.paras.map(p => `<p>${p.map(x => x.miss ? `<span class="miss">${esc(x.t)}</span>` : esc(x.t)).join('')}</p>`).join('');
  const n = document.getElementById('em-miss'); if (n) n.textContent = b.miss ? b.miss + (b.miss === 1 ? ' blank to fill' : ' blanks to fill') : 'Ready to copy';
}
/* The email builder folds open at the top of Operations (like Stats on the Tasklist).
   It fills its own slot, so typing never re-renders the page. */
function renderEmail(first) {
  const box = document.getElementById('emslot'); if (!box) return;
  const e = U.email;
  if (!e) { box.innerHTML = ''; return; }
  const p = S.projects[e.pid]; if (!p) { U.email = null; box.innerHTML = ''; return; }
  const d = e.d;
  const body = box.querySelector('.epbody'); const keepScroll = body ? body.scrollTop : 0;
  const ae = document.activeElement; const keepId = ae && box.contains(ae) ? ae.id : null;
  const f = (k, label, ph = '', kind = 'text', rows = 2, opts = null) => {
    let ctl;
    if (kind === 'select') ctl = dpick(d[k], opts, `id="em-${k}" data-em="${k}"`, { btn: 'ein selbtn', cls: 'emsel', left: true, label });
    else if (kind === 'textarea') ctl = `<textarea class="ein" id="em-${k}" rows="${rows}" placeholder="${esc(ph)}" data-em="${k}">${esc(d[k])}</textarea>`;
    else ctl = `<input class="ein" id="em-${k}" ${kind === 'number' ? 'type="number" inputmode="numeric"' : 'type="text"'} placeholder="${esc(ph)}" value="${esc(d[k])}" data-em="${k}" autocomplete="off">`;
    return `<label class="ef"><span>${esc(label)}</span>${ctl}</label>`;
  };
  const row = (cols, ...items) => `<div class="esrow" style="grid-template-columns:${cols}">${items.join('')}</div>`;
  const tog = (k, label) => `<span class="esinc">${label || 'include'}<button class="etog${d[k] ? ' on' : ''}" data-act="emTog" data-v="${k}" aria-pressed="${!!d[k]}" aria-label="${label || 'Include'}"></button></span>`;
  const chk = (k, label) => `<button class="echk${d[k] ? ' on' : ''}" data-act="emTog" data-v="${k}" aria-pressed="${!!d[k]}"><span class="bx">${I.tick(10)}</span>${esc(label)}</button>`;
  const sec = (label, inner, k, extra) => `<div class="esec"><div class="eshead"><span class="eslabel">${esc(label)}</span>${extra || ''}${k ? tog(k) : ''}</div><div class="esbody${k && !d[k] ? ' off' : ''}">${inner}</div></div>`;
  const hint = (t) => `<span class="ehint">${esc(t)}</span>`;
  const form = [
    sec('Greeting & scope', `<div class="esbody${d.greetOn ? '' : ' off'}">${f('timeOfDay', 'Greeting', '', 'select', 0, [['Morning', 'Morning everybody.'], ['Afternoon', 'Afternoon everybody.'], ['Evening', 'Evening everybody.']])}</div>`
      + row('minmax(0,1fr) 130px', f('customerName', 'Customer name', 'John Ringelestein'), f('pronoun', 'Pronoun', '', 'select', 0, [['he', 'He / his'], ['she', 'She / her'], ['they', 'They / their']]))
      + f('scopeSummary', 'Short scope summary — goes right after “wants us to”', 'install some foundation plantings and a retaining wall')
      + row('minmax(0,1fr) 90px minmax(0,1fr)', f('city', 'Home ___ (location phrase)', 'here in Ames'), f('mh', 'Estimated MH', '124', 'number'), f('mhScope', 'MH qualifier (optional)', 'on the landscape side'))
      + f('includesList', 'Project includes — one item per line', 'removing several large existing shrubs\nreplacing the river gravel in the beds with mulch\ninstalling several additional plantings\nbuilding a paver walkway in the back yard', 'textarea', 4)
      + f('extraScopeNote', 'Additional scope note (optional, own line after the list)', 'There’s some time built in for grading, sod repair, and redoing the edging.'), null, tog('greetOn', 'greeting')),
    sec('Related project / other scope', f('relatedNote', 'Note', 'The paperwork for the separate Structures scope is in the Operations folder, along with POs for the deck and pergola. There’s 270 MH estimated for that portion.', 'textarea', 3) + hint('For multi-scope jobs where another department has its own folder, PO or MH estimate. Lands right after the intro line.'), 'relatedOn'),
    sec('Plans & pics', row('120px', f('planYear', 'CREW folder year', '2026')), 'planOn'),
    sec('Crew & scheduling', f('notifyTags', 'Who to notify — exactly as it should appear', '@Ward Wester / @Soren Faaborg') + chk('placeholderOn', 'Mention an existing placeholder on the schedule')
      + `<div class="esbody${d.placeholderOn ? '' : ' off'}">${row('minmax(0,1fr) minmax(0,1fr)', f('crewLead', 'Crew leader / column', 'Kaleb'), f('timeframe', 'Timeframe', 'early July'))}${chk('hardReq', 'Needs to be this specific crew')}</div>`
      + f('schedulingNote', 'Additional scheduling note', 'Good to stay where it’s at on the schedule, and it can go as soon as we have all the plants and pavers in.', 'textarea', 2), 'crewOn'),
    sec('Access / site notes', f('accessNote', 'Note', 'Access to the back yard is narrow, but the crew got a ditch witch back there last fall.', 'textarea', 2), 'accessOn'),
    sec('Weather / other constraint', f('weatherNote', 'Note', 'Can’t go on a rainy day.'), 'weatherOn'),
    sec('Locates', row('minmax(0,1fr) minmax(0,1fr)', f('locatesTags', 'Who to tag', '@Sally Gorenz'), f('locatesPhrase', 'Phrasing', 'locates will be needed for')) + f('locatesScope', 'Scope', 'the entire property'), 'locatesOn'),
    sec('Review sheet', f('reviewTags', 'Who to tag', '@Ames Tagging / @Renee Spratt'), 'reviewOn'),
    sec('Material PO', row('minmax(0,1fr) minmax(0,1fr)', f('poTags', 'Who to tag', '@Chad Andersen / @Mike Entner'), f('poMaterials', 'Materials', 'pavers, etc.')), 'poOn'),
    `<div class="esec"><div class="eshead"><span class="eslabel">Extra paragraphs</span><button class="elink press" data-act="emAddPara" style="margin-left:auto">+ Add paragraph</button></div><div class="esbody">${hint('Drop a one-off paragraph anywhere in the email: pick where it lands, then write it.')}${(d.extras || []).map(x => `<div class="expara"><div style="display:flex;gap:6px;align-items:center">${dpick(x.pos, EM_POS, `data-empara="pos" data-x="${x.id}"`, { btn: 'ein selbtn', cls: 'emsel', left: true, label: 'Where it goes' })}<button class="ibtn press" data-act="emDelPara" data-x="${x.id}" aria-label="Remove paragraph" style="width:28px;height:28px">${I.x(14)}</button></div><textarea class="ein" id="em-x-${x.id}" rows="2" placeholder="Type the paragraph…" data-empara="text" data-x="${x.id}">${esc(x.text)}</textarea></div>`).join('')}</div></div>`,
    sec('Closing', f('closingNote', 'Closing line', 'Reach out if you have any questions.') + row('minmax(0,1fr) minmax(0,1fr)', f('signOff', 'Sign-off', 'Thanks,'), f('senderName', 'Your name (optional)', ''))
      + `<span style="display:flex;align-items:center;gap:8px"><button class="elink press" data-act="emDefaults" style="margin-left:-6px">Save the names &amp; tags as my defaults</button><span class="ehint" id="em-note">${esc(e.note || '')}</span></span>`)
  ].join('');
  const b = emBuild(d);
  box.innerHTML = `<div class="fold${first ? ' opening' : ''}${e.closing ? ' closing' : ''}"><div class="foldin">
  <div class="epanel inline" role="region" aria-label="Ops email for ${esc(p.name)}">
    <div class="ephead"><span style="color:var(--muted);display:flex">${svg(15, '<rect x="3" y="5" width="18" height="14" rx="2"></rect><path d="M3 7l9 6 9-6"></path>')}</span><span style="display:flex;flex-direction:column;min-width:0"><span style="font-size:16px;font-weight:600;letter-spacing:-.01em">Ops email</span><span style="font-size:12.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(shortName(p.name))} · step 26 · ${p.crew ? 'Crew leader ' + esc(p.crew) : 'No crew leader yet'}</span></span><span style="margin-left:auto;font-size:12px;color:var(--muted)">${d.touched ? 'Draft saved with the project' : 'Filled in from the project'}</span><button class="ibtn press" data-act="emClose" aria-label="Close" title="Close (Esc)" style="width:32px;height:32px">${I.x(16)}</button></div>
    <div class="epbody"><div>${form}</div>
      <div class="eprev"><div class="esheet"><div class="eshd"><span class="eslabel">Email</span><span class="ehint" id="em-miss">${b.miss ? b.miss + (b.miss === 1 ? ' blank to fill' : ' blanks to fill') : 'Ready to copy'}</span><button class="ecopy press${e.copied ? ' copied' : ''}" data-act="emCopy" style="margin-left:auto">${svg(13, '<rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15V5a2 2 0 0 1 2-2h10"></path>', 2)}${e.copied ? 'Copied' : 'Copy email'}</button></div><div class="etext" id="em-text"></div></div></div>
    </div></div></div></div>`;
  emPreview();
  settleFolds();
  if (keepId) { const el = document.getElementById(keepId); if (el) el.focus(); }
}
function emCopy() {
  const e = U.email; if (!e) return;
  const text = emBuild(e.d).text;
  const done = () => { e.copied = true; renderEmail(); setTimeout(() => { if (U.email === e) { e.copied = false; renderEmail(); } }, 1600); };
  const fallback = () => { try { const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); } catch (x) {} };
  try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, () => { fallback(); done(); }); return; } } catch (x) {}
  fallback(); done();
}

/* ============================================================
   PAGE — Archived (14-day cleanout by default)
   ============================================================ */
function retentionDays() { const r = Number(S.settings.retention); return isNaN(r) ? 14 : r; }
function daysLeft(p) { const r = retentionDays(); if (!r || p.pinned) return null; const left = r - Math.floor((Date.now() - (p.archivedAt || Date.now())) / 86400000); return left; }
let purgedOnce = false;
/* ============================================================
   STATS — fold-open panel on the Tasklist
   ============================================================ */
const STAT_RANGES = [['week', 'Week', 'Last 7 days, by day'], ['month', 'Month', 'Last 30 days, by day'], ['half', '6 months', 'Last 6 months, by week'], ['year', 'Year', 'Last 12 months, by month']];
function statBuckets(range, tag) {
  const days = activityDays(); const t0 = today0(); const out = [];
  const day = (n) => { const d = new Date(t0); d.setDate(d.getDate() - n); return d; };
  const blank = () => ({ t: {}, new: 0, sold: 0, inst: 0 });
  const addDay = (b, iso) => { let x = days[iso]; if (!x) return;
    if (tag) { const g = (x.g || {})[tag]; if (!g) return; b.t[tag] = (b.t[tag] || 0) + (g.t || 0); b.new += g.new || 0; b.sold += g.sold || 0; b.inst += g.inst || 0; return; }
    Object.entries(x.t || {}).forEach(([k, v]) => { b.t[k] = (b.t[k] || 0) + v; }); b.new += x.new || 0; b.sold += x.sold || 0; b.inst += x.inst || 0; };
  if (range === 'week' || range === 'month') {
    const n = range === 'week' ? 7 : 30;
    for (let i = n - 1; i >= 0; i--) { const d = day(i); const b = blank(); addDay(b, isoOf(d)); b.tip = WK[d.getDay()] + ', ' + MO[d.getMonth()] + ' ' + d.getDate(); b.lbl = range === 'week' ? WK[d.getDay()] : ((n - 1 - i) % 5 === 0 ? MO[d.getMonth()] + ' ' + d.getDate() : ''); out.push(b); }
  } else if (range === 'half') {
    for (let w = 25; w >= 0; w--) { const b = blank(); const start = day(w * 7 + 6); for (let k = 0; k < 7; k++) { const d = new Date(start); d.setDate(d.getDate() + k); addDay(b, isoOf(d)); } b.tip = 'Week of ' + MO[start.getMonth()] + ' ' + start.getDate(); b.lbl = start.getDate() <= 7 ? MO[start.getMonth()] : ''; out.push(b); }
  } else {
    for (let m = 11; m >= 0; m--) { const ref = new Date(t0.getFullYear(), t0.getMonth() - m, 1); const b = blank(); const pre = ref.getFullYear() + '-' + pad(ref.getMonth() + 1) + '-'; Object.keys(days).forEach(k => { if (k.startsWith(pre)) addDay(b, k); }); b.tip = MO[ref.getMonth()] + ' ' + ref.getFullYear(); b.lbl = MO[ref.getMonth()]; out.push(b); }
  }
  out.forEach(b => { b.tasks = Object.values(b.t).reduce((a, v) => a + v, 0); });
  return out;
}
function statsHtml() {
  const range = U.statRange || 'month';
  const B = statBuckets(range);
  const ds = designers();
  const keys = ds.map(d => d.id); const extra = [...new Set(B.flatMap(b => Object.keys(b.t)))].filter(k => !keys.includes(k));
  const order = keys.concat(extra);
  const colorOf = (k) => keys.includes(k) ? dColor(k) : 'var(--muted)';
  const W = 900, H = 190, L = 34, base = H - 22, top = 12;
  const max = Math.max(1, ...B.map(b => b.tasks));
  const nice = (() => { if (max <= 4) return max; const p10 = Math.pow(10, Math.floor(Math.log10(max))); for (const m of [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (m * p10 >= max) return Math.round(m * p10); return max; })();
  const bw = (W - L) / B.length, gap = Math.min(8, bw * 0.28);
  let bars = `<line x1="${L}" x2="${W}" y1="${base}" y2="${base}" stroke="var(--line)"></line>`;
  [0.5, 1].forEach(f => { const y = base - (base - top) * f; bars += `<line x1="${L}" x2="${W}" y1="${y}" y2="${y}" stroke="var(--line)" stroke-dasharray="2 4"></line><text x="${L - 8}" y="${y + 4}" text-anchor="end" class="stx">${Math.round(nice * f)}</text>`; });
  B.forEach((b, i) => {
    let y = base; const x = L + i * bw + gap / 2;
    order.forEach(k => { const v = b.t[k] || 0; if (!v) return; const h = (base - top) * v / nice; y -= h; bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(bw - gap).toFixed(1)}" height="${h.toFixed(1)}" rx="${Math.min(2.5, bw / 6).toFixed(1)}" fill="${colorOf(k)}"><title>${esc(b.tip)} · ${b.tasks} task${b.tasks === 1 ? '' : 's'} completed</title></rect>`; });
    if (!b.tasks) bars += `<rect x="${x.toFixed(1)}" y="${top}" width="${(bw - gap).toFixed(1)}" height="${base - top}" fill="transparent"><title>${esc(b.tip)} · no tasks completed</title></rect>`;
    if (b.lbl) bars += `<text x="${x.toFixed(1)}" y="${H - 5}" class="stx">${b.lbl}</text>`;
  });
  const H2 = 120, base2 = H2 - 16, top2 = 10;
  const max2 = Math.max(1, ...B.map(b => Math.max(b.new, b.sold, b.inst)));
  let lines = `<line x1="${L}" x2="${W}" y1="${base2}" y2="${base2}" stroke="var(--line)"></line><text x="${L - 8}" y="${top2 + 4}" text-anchor="end" class="stx">${max2}</text>`;
  [['new', 'var(--waiting)', 'new projects'], ['sold', 'var(--medium)', 'sold'], ['inst', 'var(--prog)', 'installations']].forEach(([k, c, nm]) => {
    const pts = B.map((b, i) => [L + i * bw + bw / 2, base2 - (base2 - top2) * b[k] / max2]);
    lines += `<polyline points="${pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ')}" fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></polyline>`;
    if (B.length <= 30) pts.forEach((p, i) => { lines += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2.6" fill="${c}"><title>${esc(B[i].tip)} · ${B[i][k]} ${nm}</title></circle>`; });
  });
  const sum = (k) => B.reduce((a, b) => a + b[k], 0);
  const totalTasks = sum('tasks');
  const busiest = B.reduce((a, b) => (b.tasks > a.tasks ? b : a), B[0]);
  const sub = STAT_RANGES.find(r => r[0] === range)[2];
  const legend = ds.map(d => `<span class="slg"><i style="background:${dColor(d.id)}"></i>${esc(firstName(d.name))}</span>`).join('');
  const fold = U.statsClosing ? ' closing' : U.statsFresh ? ' opening' : '';
  return `<div class="fold${fold}" id="statsfold"><div class="foldin"><section class="card statcard" aria-label="Activity stats">
    <div class="sthead"><h2>Activity</h2><span class="stsub">${sub}</span><span style="flex:1"></span>
      <div class="segctl" role="group" aria-label="Time range">${STAT_RANGES.map(([v, l]) => `<button class="press${v === range ? ' on' : ''}" data-act="statRange" data-v="${v}" aria-pressed="${v === range}">${l}</button>`).join('')}</div>
      <button class="ibtn press" data-act="stats" aria-label="Close stats" title="Close" style="width:30px;height:30px">${I.x(15)}</button></div>
    <div class="stnums">${[[totalTasks, 'Tasks completed'], [sum('new'), 'New projects'], [sum('sold'), 'Sold'], [sum('inst'), 'Installations']].map(([n, l]) => `<div class="stnum"><b>${n}</b><span>${l}</span></div>`).join('')}</div>
    <div class="stcap">Tasks completed ${legend}${busiest && busiest.tasks ? `<span class="stbusy">Busiest: ${esc(busiest.tip)} · ${busiest.tasks} task${busiest.tasks === 1 ? '' : 's'}</span>` : ''}</div>
    <svg class="stchart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tasks completed, ${esc(sub.toLowerCase())}, stacked by designer">${bars}</svg>
    <div class="stcap">Milestones <span class="slg"><i style="background:var(--waiting)"></i>New projects</span><span class="slg"><i style="background:var(--medium)"></i>Sold</span><span class="slg"><i style="background:var(--prog)"></i>Installations</span></div>
    <svg class="stchart" viewBox="0 0 ${W} ${H2}" role="img" aria-label="New projects, sold and installations, ${esc(sub.toLowerCase())}">${lines}</svg>
    ${totalTasks + sum('new') + sum('sold') + sum('inst') === 0 ? `<div class="stempty">Activity shows up here as you check off tasks, add projects, sell and install. Steps filled in automatically when a project is entered at a later stage don’t count.</div>` : ''}
  </section></div></div>`;
}
/* fold panels clip their content only while folding, so sticky columns and menus work once open */
function settleFolds() { setTimeout(() => document.querySelectorAll('.fold.opening').forEach(f => f.classList.remove('opening')), 380); }
function toggleFold(key) {
  if (U[key]) {
    if (!motionOK()) { U[key] = false; lsSet('gs5:' + key, false); return render(); }
    U[key] = false; U[key + 'Closing'] = true; render();
    setTimeout(() => { U[key + 'Closing'] = false; render(); }, 300);
  } else { U[key] = true; U[key + 'Fresh'] = true; render(); U[key + 'Fresh'] = false; }
  lsSet('gs5:' + key, U[key]);
}
/* Projects page: which kinds of work (tags) keep you busy, and when */
function rangeStart(range) { const t0 = today0(); const d = new Date(t0); if (range === 'week') d.setDate(d.getDate() - 6); else if (range === 'month') d.setDate(d.getDate() - 29); else if (range === 'half') d.setDate(d.getDate() - 181); else return isoOf(new Date(t0.getFullYear(), t0.getMonth() - 11, 1)); return isoOf(d); }
function tagTotals(range) {
  const days = activityDays(); const from = rangeStart(range); const lib = tagLib(); const tot = {};
  Object.entries(days).forEach(([d, x]) => { if (d < from || !x.g) return; Object.entries(x.g).forEach(([tg, g]) => { if (!lib.includes(tg)) return; const o = tot[tg] || (tot[tg] = { t: 0, new: 0, sold: 0, inst: 0 }); ['t', 'new', 'sold', 'inst'].forEach(k => { o[k] += g[k] || 0; }); }); });
  return Object.entries(tot).map(([tg, o]) => Object.assign({ tag: tg }, o)).filter(o => o.t + o.new + o.sold + o.inst > 0)
    .sort((a, b) => b.t - a.t || (b.sold + b.inst) - (a.sold + a.inst) || a.tag.localeCompare(b.tag));
}
function pstatsHtml() {
  const range = U.statRange || 'month';
  const sub = STAT_RANGES.find(r => r[0] === range)[2];
  const rows = tagTotals(range);
  const sel = rows.find(r => r.tag === U.tagSel) ? U.tagSel : (rows[0] && rows[0].tag);
  const maxT = Math.max(1, ...rows.map(r => r.t));
  const list = rows.slice(0, 12).map(r => `<button class="tgrow press${r.tag === sel ? ' on' : ''}" data-act="tagSel" data-v="${esc(r.tag)}" aria-pressed="${r.tag === sel}">
      <span class="tgname"><span class="hash">#</span>${esc(r.tag)}</span>
      <span class="tgbar"><i style="width:${Math.max(2, Math.round(100 * r.t / maxT))}%"></i></span>
      <span class="tgnums mono">${r.t} task${r.t === 1 ? '' : 's'}${r.sold ? ' · ' + r.sold + ' sold' : ''}${r.inst ? ' · ' + r.inst + ' installed' : ''}</span></button>`).join('');
  let chart = '';
  if (sel) {
    const B = statBuckets(range, sel);
    const W = 900, H = 150, L = 34, base = H - 22, top = 10;
    const max = Math.max(1, ...B.map(b => b.tasks));
    const bw = (W - L) / B.length, gap = Math.min(8, bw * 0.28);
    let svgc = `<line x1="${L}" x2="${W}" y1="${base}" y2="${base}" stroke="var(--line)"></line><text x="${L - 8}" y="${top + 4}" text-anchor="end" class="stx">${max}</text>`;
    B.forEach((b, i) => { const x = L + i * bw + gap / 2; const h = (base - top) * b.tasks / max;
      if (b.tasks) svgc += `<rect x="${x.toFixed(1)}" y="${(base - h).toFixed(1)}" width="${(bw - gap).toFixed(1)}" height="${h.toFixed(1)}" rx="${Math.min(2.5, bw / 6).toFixed(1)}" fill="var(--accent)"><title>${esc(b.tip)} · ${b.tasks} task${b.tasks === 1 ? '' : 's'} on #${esc(sel)} jobs</title></rect>`;
      [['sold', 'var(--medium)'], ['inst', 'var(--prog)']].forEach(([k, c], j) => { if (b[k]) svgc += `<circle cx="${(x + (bw - gap) / 2 + (j ? 4 : -4)).toFixed(1)}" cy="${(base - h - 8).toFixed(1)}" r="3.4" fill="${c}"><title>${esc(b.tip)} · ${b[k]} ${k === 'sold' ? 'sold' : 'installed'}</title></circle>`; });
      if (b.lbl) svgc += `<text x="${x.toFixed(1)}" y="${H - 5}" class="stx">${b.lbl}</text>`; });
    chart = `<div class="stcap">#${esc(sel)} through ${range === 'year' ? 'the year' : 'this period'} <span class="slg"><i style="background:var(--accent)"></i>Tasks completed</span><span class="slg"><i style="background:var(--medium);border-radius:9px"></i>Sold</span><span class="slg"><i style="background:var(--prog);border-radius:9px"></i>Installed</span></div>
      <svg class="stchart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Activity on #${esc(sel)} projects, ${esc(sub.toLowerCase())}">${svgc}</svg>`;
  }
  const fold = U.pstatsClosing ? ' closing' : U.pstatsFresh ? ' opening' : '';
  return `<div class="fold${fold}" id="pstatsfold"><div class="foldin"><section class="card statcard" aria-label="Projects by tag">
    <div class="sthead"><h2>Projects by tag</h2><span class="stsub">${sub}</span><span style="flex:1"></span>
      <div class="segctl" role="group" aria-label="Time range">${STAT_RANGES.map(([v, l]) => `<button class="press${v === range ? ' on' : ''}" data-act="statRange" data-v="${v}" aria-pressed="${v === range}">${l}</button>`).join('')}</div>
      <button class="ibtn press" data-act="pstats" aria-label="Close stats" title="Close" style="width:30px;height:30px">${I.x(15)}</button></div>
    ${rows.length ? `<div class="stcap">Tasks completed on tagged jobs · click a tag to see when</div><div class="tglist">${list}</div>${chart}` : `<div class="stempty" style="margin-top:14px">${tagLib().length && Object.values(S.projects).some(p => (p.tags || []).length) ? 'No activity on tagged projects in this period.' : 'Tag projects (+ Tag on a project page) to see which kinds of work keep you busiest, and when.'}</div>`}
    <div class="stempty">A job with several tags counts toward each one.</div>
  </section></div></div>`;
}
function toggleStats() {
  if (U.stats) {
    if (!motionOK()) { U.stats = false; return render(); }
    U.stats = false; U.statsClosing = true; render();
    setTimeout(() => { U.statsClosing = false; render(); }, 300);
  } else { U.stats = true; U.statsFresh = true; render(); U.statsFresh = false; }
  lsSet('gs5:stats', U.stats);
}

/* ============================================================
   STATS — activity events
   Events come from each project's own dates: steps checked Done (doneAt), the project's creation,
   step 22 (sold) and the last Project Install step (installation). Steps filled in automatically
   when a project is entered at a later stage are left out (flagged seed; for projects entered before
   v5.3.0, steps done on the day the project was created). Auto-deleted projects live on in S.activity.
   ============================================================ */
const isoDay = (ms) => isoOf(new Date(ms));
function isSeed(p, st) { return !!st.seed || (!p.seedFlagged && !!st.doneAt && st.doneAt === isoDay(p.createdAt || 0)); }
function projEvents(p) {
  const ev = [];
  const steps = p.steps || {};
  let seeded = false;
  Object.values(steps).forEach(st => { if (st && st.s === 'Done' && st.doneAt) { if (isSeed(p, st)) seeded = true; else ev.push({ d: st.doneAt, t: 'task', who: p.designer }); } });
  (p.custom || []).forEach(c => { if (c.s === 'Done' && c.doneAt) ev.push({ d: c.doneAt, t: 'task', who: p.designer }); });
  if (p.createdAt && !seeded) ev.push({ d: isoDay(p.createdAt), t: 'new' });
  const sold = steps.w22; if (sold && sold.s === 'Done' && sold.doneAt && !isSeed(p, sold)) ev.push({ d: sold.doneAt, t: 'sold' });
  const inst = S.workflow.filter(w => w.stage === ST_INSTALL && !w.optional).map(w => steps[w.id]);
  if (inst.length && inst.every(st => st && isClosed(st.s)) && !inst.some(st => st.s === 'Done' && isSeed(p, st))) {
    const last = inst.map(st => st.doneAt || '').sort().pop(); if (last) ev.push({ d: last, t: 'inst' });
  }
  if ((p.tags || []).length) ev.forEach(e => { e.tags = p.tags; });
  return ev;
}
function addEvent(days, ev) {
  const x = days[ev.d] || (days[ev.d] = { t: {}, new: 0, sold: 0, inst: 0 });
  if (ev.t === 'task') { const k = ev.who || '_'; x.t[k] = (x.t[k] || 0) + 1; } else x[ev.t] = (x[ev.t] || 0) + 1;
  (ev.tags || []).forEach(tg => { const g = (x.g || (x.g = {}))[tg] || (x.g[tg] = { t: 0, new: 0, sold: 0, inst: 0 }); g[ev.t === 'task' ? 't' : ev.t] += 1; });
}
/* every day with activity: the tally of deleted projects plus every project still in the app */
function activityDays() {
  const days = clone((S.activity && S.activity.days) || {});
  Object.values(S.projects).forEach(p => projEvents(p).forEach(ev => addEvent(days, ev)));
  return days;
}
/* The tally keeps one year of history; older days are dropped (Stats never looks back further). */
function activityCutoff() { const d = today0(); d.setFullYear(d.getFullYear() - 1); return isoOf(d); }
function trimActivity() {
  const days = (S.activity && S.activity.days) || {}; const cut = activityCutoff();
  const old = Object.keys(days).filter(k => k < cut); if (!old.length) return;
  const act = clone(S.activity); old.forEach(k => { delete act.days[k]; }); putMeta('activity', act);
}
function purgeArchive() {
  if (purgedOnce) return; if (!LOCAL_ONLY && !cloud.firstSnap) return;
  purgedOnce = true;
  trimActivity();
  const r = retentionDays(); if (!r) return;
  const gone = Object.values(S.projects).filter(p => p.archived && !p.pinned && daysLeft(p) !== null && daysLeft(p) <= 0);
  if (!gone.length) return;
  /* keep their activity for Stats before they're deleted */
  const act = clone(S.activity && S.activity.days ? S.activity : { days: {} });
  const cut = activityCutoff();
  gone.forEach(p => projEvents(p).forEach(ev => { if (ev.d >= cut) addEvent(act.days, ev); }));
  putMeta('activity', act);
  gone.forEach(p => removeProject(p.id));
}
function pageArchived() {
  const all = Object.values(S.projects).filter(p => p.archived);
  const aq = (U.asearch || '').trim().toLowerCase();
  const list = all.filter(dselOK).filter(p => projMatch(p, aq));
  const r = retentionDays();
  const sorts = { recent: (a, b) => (b.archivedAt || 0) - (a.archivedAt || 0), added: (a, b) => (a.archivedAt || 0) - (b.archivedAt || 0), az: (a, b) => a.name.localeCompare(b.name) };
  const rows = list.slice().sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || (sorts[U.asort] || sorts.recent)(a, b));
  const note = r ? `Kept for ${r} days after archiving, then deleted automatically. Pinned projects are kept until you unpin them.` : 'Archived projects are kept until you delete them (auto-delete is off in Settings).';
  const head = `<div class="phead"><div><div class="eyebrow">${all.length} archived</div><h1>Archived</h1></div>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><label><span class="sr">Search archived projects</span><input id="a-search" class="search" placeholder="Search client, address, PO or #tag" value="${esc(U.asearch || '')}" data-input="asearch" autocomplete="off"></label>${sortPicker('asort', U.asort || 'recent', [['recent', 'Recently archived'], ['added', 'Date added'], ['az', 'Client A–Z']])}</div></div>
    <div style="margin:-8px 0 16px">${designerPills()}</div>`;
  if (!all.length) return head + `<div class="empty rise"><h2>Nothing archived</h2><p>${esc(note)}</p></div>`;
  return head + `<section class="drawer kraft rise"><div style="padding:12px 16px 0;font-size:12.5px;color:var(--muted)">${esc(note)}</div><div class="fgrid">${rows.map(archFolder).join('') || (aq ? `<div class="gempty">No archived projects match “${esc(U.asearch)}”.</div>` : '<div class="gempty">No archived projects for this designer.</div>')}</div></section>`;
}
function archFolder(p) {
  const left = daysLeft(p);
  const tab = p.pinned ? `${svg(10, '<path d="M9 4h6l-1 6 3 3v2H7v-2l3-3z"></path><path d="M12 15v5"></path>', 2.2)}Pinned · kept` : left === null ? 'Kept' : left <= 0 ? 'Deletes today' : left === 1 ? 'Deletes tomorrow' : 'Deletes in ' + left + ' days';
  const tabCls = p.pinned ? ' pinned' : left !== null && left <= 3 ? ' warn' : '';
  const d = parseISO(isoOf(new Date(p.archivedAt || Date.now())));
  const cls = 'fwrap' + (U.leaving[p.id] ? ' ' + U.leaving[p.id] : '') + (U.back[p.id] ? ' back' : '');
  return `<div class="${cls}" data-pid="${p.id}">
    <div class="folder press" role="button" tabindex="0" data-act="openProject" data-id="${p.id}" aria-label="Open ${esc(p.name)}">
      <span class="ftab${tabCls}">${p.pinned ? '' : '<span class="tabdot" style="background:currentColor"></span>'}${tab}</span>
      <span class="fpaper" aria-hidden="true"></span>
      <span class="fcover">
        <span style="display:flex;flex-direction:column;gap:1px;min-width:0"><span style="display:flex;align-items:center;gap:6px;min-width:0"><span class="dot" style="width:7px;height:7px;background:${dColor(p.designer)}"></span><span class="fname">${esc(p.name)}</span></span><span class="faddr">${esc(p.address) || '<span style="opacity:.6">No address</span>'}</span></span>
        <span class="fmeta"><span class="mono" style="font-size:11px">PO ${esc(p.po) || '—'}</span><span>Archived ${MO[d.getMonth()]} ${d.getDate()}</span></span>
        <span class="fmeta"><span>${esc(designer(p.designer).name)}</span></span>
      </span>
    </div>
    <div class="facts"><button class="ibtn press" data-act="restore" data-id="${p.id}" title="Restore to Projects" aria-label="Restore ${esc(p.name)}">${svg(14, '<rect x="3" y="4" width="18" height="5" rx="1.5"></rect><path d="M5 9v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9"></path><path d="M12 18v-6M9.5 14.5 12 12l2.5 2.5"></path>')}</button><button class="ibtn del press" data-act="deleteArch" data-id="${p.id}" title="Delete now" aria-label="Delete ${esc(p.name)}">${I.trash()}</button><button class="ibtn press${p.pinned ? ' on' : ''}" data-act="pin" data-id="${p.id}" aria-pressed="${!!p.pinned}" title="${p.pinned ? 'Unpin (restarts the countdown)' : 'Pin to keep'}" aria-label="${p.pinned ? 'Unpin' : 'Pin'} ${esc(p.name)}">${svg(14, '<path d="M9 4h6l-1 6 3 3v2H7v-2l3-3z"></path><path d="M12 15v5"></path>')}</button></div>
  </div>`;
}
function restoreArch(id) {
  const p = S.projects[id]; if (!p || U.leaving[id]) return;
  const before = clone(p);
  const done = () => { delete U.leaving[id]; const q = clone(p); q.archived = false; q.archivedAt = null; q.pinned = false; putProject(q); pushUndo(p.name + ' restored to Projects', () => { U.back[id] = true; putProject(before, { keepTime: true }); setTimeout(() => { delete U.back[id]; }, 500); }); };
  if (!motionOK()) return done();
  U.leaving[id] = 'lift'; render(); setTimeout(done, 460);
}

/* ============================================================
   PAGE — Settings (full)
   ============================================================ */
function pageSettings() {
  const TH = { sand: ['#F2ECE1', '#EAE2D3', '#FBF8F2', '#2A2924', '#3E5940', 'Default'], moss: ['#121613', '#151915', '#1A1F1B', '#E6E2D6', '#A8C096', 'Dark'], stone: ['#ECECE8', '#E3E3DE', '#F9F9F7', '#25272A', '#44574B', 'Neutral'] };
  const tcards = Object.entries(TH).map(([id, [bg, side, panel, ink, acc, note]]) => `<button class="tcard press${U.theme === id ? ' on' : ''}" data-act="theme" data-v="${id}" aria-pressed="${U.theme === id}"><span class="tprev" style="background:${bg}"><span style="width:28%;background:${side}"></span><span style="flex:1;padding:8px;display:flex;flex-direction:column;gap:6px"><span style="height:8px;width:60%;border-radius:3px;background:${ink};opacity:.8"></span><span style="flex:1;border-radius:5px;background:${panel};display:flex;align-items:flex-end;padding:5px"><span style="height:4px;width:70%;border-radius:2px;background:${acc}"></span></span></span></span><span style="display:flex;justify-content:space-between"><span style="font-weight:500">${id[0].toUpperCase() + id.slice(1)}</span><span class="muted" style="font-size:12px">${note}</span></span></button>`).join('');
  const [a, b] = syncText();
  const np = activeProjects().length, na = Object.values(S.projects).filter(p => p.archived).length;
  const scr = Math.round(window.innerWidth) + ' × ' + Math.round(window.innerHeight) + (window.devicePixelRatio && window.devicePixelRatio !== 1 ? ' · ' + Math.round(window.devicePixelRatio * 100) + '% scaling' : '');
  // designers
  const dCount = (id) => Object.values(S.projects).filter(p => p.designer === id).length;
  const m = U.menu;
  const drows = designers().map(d => {
    const n = dCount(d.id); const open = m && m.kind === 'dcolor' && m.key === d.id;
    return `<div class="drow2"><div style="position:relative"><button class="swbtn press" data-act="menu" data-kind="dcolor" data-key="${d.id}" title="Change color" aria-haspopup="menu" aria-expanded="${open}" style="background:var(--c-${d.color})"></button>${open ? `<div class="smenu left${U.menuFresh ? ' pop-in' : ''}" role="menu" style="min-width:160px">${COLORS.map(([c, l]) => `<button class="mi${c === d.color ? ' cur' : ''}" data-act="dsetColor" data-id="${d.id}" data-v="${c}"><span class="dot" style="width:12px;height:12px;background:var(--c-${c})"></span>${l}</button>`).join('')}</div>` : ''}</div>
      <label style="min-width:0"><span class="sr">Designer name</span><input class="tin" id="dn-${d.id}" value="${esc(d.name)}" data-scommit="dname" data-id="${d.id}" autocomplete="off"></label>
      <span class="mono" style="font-size:12px;color:var(--muted);text-align:right">${n} ${n === 1 ? 'project' : 'projects'}</span>
      <button class="ibtn del press" data-act="ddel" data-id="${d.id}" ${n ? 'disabled' : ''} title="${n ? 'Reassign their projects before removing' : 'Remove ' + esc(d.name)}" aria-label="Remove ${esc(d.name)}">${I.x(14)}</button></div>`;
  }).join('');
  // crews
  const cCount = (c) => Object.values(S.projects).filter(p => !p.archived && p.crew === c).length;
  const crows = (S.settings.crews || []).map((c, i) => { const n = cCount(c); return `<div class="crow2"><label style="min-width:0"><span class="sr">Crew leader</span><input class="tin" id="cr-${i}" value="${esc(c)}" data-scommit="crew" data-i="${i}" autocomplete="off"></label><span class="mono" style="font-size:11.5px;color:var(--muted);text-align:right">${n ? n + (n === 1 ? ' job' : ' jobs') : ''}</span><button class="ibtn del press" data-act="cdel" data-i="${i}" ${n ? 'disabled' : ''} title="${n ? 'Reassign their jobs on Operations before removing' : 'Remove ' + esc(c)}" aria-label="Remove ${esc(c)}">${I.x(14)}</button></div>`; }).join('');
  const ret = retentionDays();
  return `<div class="phead"><div><div class="eyebrow">Version ${APP_VERSION} · window ${scr}</div><h1>Settings</h1></div></div>
  ${installCard()}
  <section class="card scard rise"><h2>Appearance</h2><p class="sub">Saved on this device.</p><div class="tcards">${tcards}</div>
    <div class="rowline"><span><span style="display:block;font-size:13.5px;font-weight:500">Motion</span><span style="font-size:12.5px;color:var(--muted)">Animations for completing steps, stages and opening folders. Off keeps everything instant.</span></span><button class="tog${U.motion ? ' on' : ''}" data-act="motion" aria-pressed="${U.motion}" aria-label="Animations"></button></div></section>
  <section class="card scard rise" style="animation-delay:40ms"><h2>Designers</h2><p class="sub">Rename in place and pick each designer’s color. A designer can be removed once they have no projects.</p>${drows}
    <label style="display:flex;align-items:center;gap:10px;padding-top:10px;border-top:1px solid var(--line);color:var(--muted)"><span style="width:22px;display:grid;place-items:center">${I.plus}</span><span class="sr">Add a designer</span><input class="addin" id="add-designer" placeholder="Add designer — press Enter" data-sadd="designer" autocomplete="off"></label></section>
  <section class="card scard rise" style="animation-delay:80ms"><h2>Crew leaders</h2><p class="sub">Used by the Crew leader dropdown on Operations. ${(S.settings.crews || []).length} crew leaders · sorted A–Z there. Renaming updates every install.</p><div class="crgrid">${crows}</div>
    <label style="display:flex;align-items:center;gap:10px;padding-top:10px;border-top:1px solid var(--line);color:var(--muted)"><span style="width:22px;display:grid;place-items:center">${I.plus}</span><span class="sr">Add a crew leader</span><input class="addin" id="add-crew" placeholder="Add crew leader — press Enter" data-sadd="crew" autocomplete="off"></label></section>
  <section class="card scard rise" style="animation-delay:100ms"><h2>Tags</h2><p class="sub">Tag projects from their page with + Tag. ${tagLib().length} tags · one word each, spaces become dashes. Renaming updates every project; renaming to an existing tag merges the two.</p><div class="crgrid">${tagLib().map((t, i) => { const n = tagCount(t); return `<div class="crow2"><label style="min-width:0;display:flex;align-items:center"><span style="color:var(--muted);margin-right:1px">#</span><span class="sr">Tag</span><input class="tin" id="tg-${i}" value="${esc(t)}" data-scommit="tag" data-i="${i}" autocomplete="off" spellcheck="false"></label><span class="mono" style="font-size:11.5px;color:var(--muted);text-align:right">${n ? n + (n === 1 ? ' project' : ' projects') : '—'}</span><button class="ibtn press" data-act="tagRemove" data-v="${esc(t)}" aria-label="Remove #${esc(t)}" title="${n ? 'Remove from the list and from ' + n + (n === 1 ? ' project' : ' projects') : 'Remove'}">${I.x(13)}</button></div>`; }).join('')}</div>
    <label style="display:flex;align-items:center;gap:10px;padding-top:10px;border-top:1px solid var(--line);color:var(--muted)"><span style="width:22px;display:grid;place-items:center">${I.plus}</span><span class="sr">Add a tag</span><input class="addin" id="add-tag" placeholder="Add tag — press Enter" data-sadd="tag" autocomplete="off" spellcheck="false"></label></section>
  <section class="card scard rise" style="animation-delay:120ms"><h2>Workflow &amp; archive</h2><p class="sub">The step template every project uses, and how long archived projects are kept.</p>
    <div class="rowline"><span><span style="display:block;font-size:13.5px;font-weight:500">Workflow template</span><span style="font-size:12.5px;color:var(--muted)">${S.workflow.length} steps across 7 stages.</span></span><button class="btn press" data-act="navx" data-v="#/workflow">${I.flow}Edit workflow ›</button></div>
    <div class="rowline"><span><span style="display:block;font-size:13.5px;font-weight:500">Auto-delete archived projects</span><span style="font-size:12.5px;color:var(--muted)">Keeps the archive tidy. Pinned projects are always kept.</span></span>${dpick(ret, [[7, 'After 7 days'], [14, 'After 14 days'], [30, 'After 30 days'], [0, 'Never']], 'data-change="retention"', { label: 'Auto-delete archived projects' })}</div></section>
  <section class="card scard rise" style="animation-delay:160ms"><h2>Data &amp; backup</h2><p class="sub">Everything saves automatically and stays in sync across your devices.</p>
    <div class="rowline"><span style="display:flex;align-items:center;gap:10px"><span class="syncind sync-${S.sync.state}" style="margin:0;padding:0;pointer-events:none"><span class="sdot"></span></span><span><span style="display:block;font-size:13.5px;font-weight:500">${esc(a)}${b ? ' · ' + esc(b) : ''}</span><span style="font-size:12.5px;color:var(--muted)">${esc(syncText()[2])}</span></span></span></div>
    <div class="rowline"><span><span style="display:block;font-size:13.5px;font-weight:500">Works offline</span><span style="font-size:12.5px;color:var(--muted)">Changes made without a connection are kept on this device and sent as soon as you’re back online. Other devices update live.</span></span><span class="mono" style="font-size:12px;color:var(--muted);flex:none">${np} ${np === 1 ? 'project' : 'projects'} · ${na} archived</span></div>
    <div class="rowline"><span><span style="display:block;font-size:13.5px;font-weight:500">Backup</span><span style="font-size:12.5px;color:var(--muted)">Download a copy of all projects, the workflow and settings${S.settings.lastBackup ? ' · last downloaded ' + ago(S.settings.lastBackup) : ''}. Restore loads a backup file back in (with Undo).</span></span><span style="display:flex;gap:8px;flex:none"><button class="btn press" data-act="backup">${I.download}Download backup</button><label class="btn press" style="cursor:pointer">Restore…<input type="file" accept="application/json,.json" data-change="restore" style="display:none"></label></span></div></section>`;
}
function restoreBackup(file) {
  const rd = new FileReader();
  rd.onload = () => {
    let data; try { data = JSON.parse(rd.result); } catch (e) { showToast('That file isn’t a Green Screen backup', false); return; }
    if (!data || typeof data.projects !== 'object') { showToast('That file isn’t a Green Screen backup', false); return; }
    const before = { projects: clone(S.projects), workflow: clone(S.workflow), settings: clone(S.settings) };
    const incoming = data.projects;
    Object.values(incoming).forEach(p => { if (p && p.id) putProject(clone(p), { keepTime: true }); });
    if (Array.isArray(data.workflow)) putMeta('workflow', data.workflow);
    if (data.settings) putMeta('settings', Object.assign(clone(DEFAULT_SETTINGS), data.settings));
    if (data.activity && data.activity.days) putMeta('activity', data.activity);
    pushUndo('Backup restored · ' + Object.keys(incoming).length + ' projects', () => {
      Object.keys(incoming).forEach(id => { if (before.projects[id]) putProject(before.projects[id], { keepTime: true }); else removeProject(id); });
      putMeta('workflow', before.workflow); putMeta('settings', before.settings);
    });
  };
  rd.readAsText(file);
}
function settingsChange(fn, label) {
  const before = clone(S.settings); const s2 = clone(S.settings); fn(s2); putMeta('settings', s2);
  if (label) pushUndo(label, () => putMeta('settings', before));
}

/* ============================================================
   NEW PROJECT MODAL
   ============================================================ */
function openNewProject() {
  U.np = { name: '', address: '', po: '', d: lsGet(LS.lastDesigner, (designers()[0] || {}).id || 'isaiah'), stage: 0, err: false, go: false };
  if (!designers().some(d => d.id === U.np.d)) U.np.d = (designers()[0] || {}).id;
  renderModal();
  setTimeout(() => { const el = document.getElementById('np-name'); if (el) el.focus(); }, 30);
}
function npDup() { const n = (U.np.name || '').trim().toLowerCase(); if (!n) return null; return activeProjects().find(p => p.name.trim().toLowerCase() === n) || null; }
function npStageNote() { const s = U.np.stage; let last = 0; S.workflow.forEach((w, i) => { if (w.stage < s) last = i + 1; }); return s === 0 || !last ? 'nothing marked done yet' : 'steps 1–' + last + ' will be marked done'; }
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
      <div class="npnote"><span style="color:var(--ink);font-weight:500">${STAGES[np.stage]}</span> · ${npStageNote()}${OPS_STAGES.includes(np.stage) ? `<span class="npops">${I.truck(11)} Shows on Operations</span>` : ''}</div>
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
function toggleStep(k, p) {
  p = p || curP(); if (!p) return;
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
    U.casc = null; U.segHold = null;
    for (let k = 0; k <= idx; k++) delete U.open[p.id + ':' + k];
    const segs = {}; for (let k = cs, n = 0; k <= idx; k++, n++) segs[k] = n;
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
  /* "Open to this stage" must make it current: if every step that would hold it open is N/A
     (e.g. Backorders marked "None needed"), reopen those N/A steps too. */
  const holds = (x) => x.stage === idx && (idx >= ST_BACK || !x.optional);
  if (!items.some(x => holds(x) && (!isClosed(x.st.s) || x.st.s === 'Done'))) toReset.push(...items.filter(x => holds(x) && x.st.s === 'N/A'));
  const inStage = toReset.filter(x => x.stage === idx);
  const ids = {}; inStage.forEach((x, i) => { ids[x.key] = inStage.length - 1 - i; });
  Object.keys(U.open).forEach(k => { if (k.startsWith(p.id + ':')) delete U.open[k]; });
  U.open[p.id + ':' + idx] = true; U.showDone[p.id] = false;
  const segs = {}; for (let k = Math.max(cs, idx), n = 0; k >= idx; k--, n++) segs[k] = n;
  if (motionOK()) U.unc = { pid: p.id, ids };
  mutate(p.id, q => { toReset.forEach(x => setItem(q, x.key, { s: 'Not Started', doneAt: '' })); q.noArchivePrompt = false; }, 'Back to ' + STAGES[idx] + (idx < STAGES.length - 1 ? ' · later stages reopened' : ''));
  setTimeout(() => { U.unc = null; U.sweep = null; }, Math.max(1100, inStage.length * 45 + 800));
}
function segPick(i) {
  const p = curP(); if (!p || U.casc) return; const cs = curStage(p);
  if (i === cs) return;
  U.segHold = { pid: p.id, i };
  if (i < cs) reopenFrom(i); else completeThrough(i - 1);
  if (!U.casc) U.segHold = null;
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
  if (el.dataset && el.dataset.wcommit) { U.busy = false; wfCommit(el); }
  if (el.dataset && el.dataset.scommit) { U.busy = false; settingsCommit(el); }
  const ae = document.activeElement; if (pendingRender && !(ae && ae.dataset && (ae.dataset.commit || ae.dataset.wcommit || ae.dataset.scommit))) { pendingRender = false; render(); }
});
app.addEventListener('focusin', (e) => { if (e.target.dataset && e.target.dataset.commit) U.busy = false; });

document.addEventListener('keydown', (e) => {
  const t = e.target;
  const inField = /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || '');
  if (U.np) {
    if (e.key === 'Escape') { e.preventDefault(); U.np = null; renderModal(); return; }
    if (e.key === 'Enter' && !(t.dataset && t.dataset.act === 'npClose') && (t === document.body || document.getElementById('overlay').contains(t))) { e.preventDefault(); npCreate(); return; }
  }
  if (U.email && e.key === 'Escape') { e.preventDefault(); document.querySelector('[data-act="emClose"]').click(); return; }
  if (e.key === 'Escape' && U.menu) { U.menu = null; render(); return; }
  if (t.dataset && t.dataset.scommit && (e.key === 'Enter' || e.key === 'Escape')) { if (e.key === 'Escape') { t.value = t.dataset.scommit === 'tag' ? tagLib()[Number(t.dataset.i)] : t.dataset.scommit === 'crew' ? S.settings.crews[Number(t.dataset.i)] : designer(t.dataset.id).name; } e.preventDefault(); t.blur(); return; }
  if (t.dataset && t.dataset.tagin) {
    const p = S.projects[t.dataset.tagin]; const opts = p ? tagOptions(p) : [];
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); U.tagHi = Math.max(0, Math.min(opts.length - 1, (U.tagHi || 0) + (e.key === 'ArrowDown' ? 1 : -1))); const box = document.getElementById('tagopts'); const keep = box ? box.scrollTop : 0; render(); const nb = document.getElementById('tagopts'); if (nb) { nb.scrollTop = keep; const h = nb.querySelector('.mi.hi'); if (h) h.scrollIntoView({ block: 'nearest' }); } return; }
    if (e.key === 'Enter') { e.preventDefault(); const o = opts[Math.min(U.tagHi || 0, opts.length - 1)]; if (o) tagAdd(p.id, o.t); return; }
    if (e.key === 'Escape') { e.preventDefault(); U.tagQ = ''; closeMenu(); return; }
  }
  if (t.dataset && t.dataset.sadd === 'tag' && e.key === 'Enter') {
    e.preventDefault(); const v = tagSlug(t.value); if (!v) return;
    if (tagLib().includes(v)) { showToast('#' + v + ' is already on the list', false); return; }
    settingsChange(st => { st.tags = (st.tags || []).concat([v]); }, '#' + v + ' added');
    setTimeout(() => { const el = document.getElementById('add-tag'); if (el) { el.value = ''; el.focus(); } }, 0); return;
  }
  if (t.dataset && t.dataset.sadd && e.key === 'Enter') {
    e.preventDefault(); const v = t.value.trim(); if (!v) return; const kind = t.dataset.sadd;
    if (kind === 'crew') { if ((S.settings.crews || []).some(c => c.toLowerCase() === v.toLowerCase())) { showToast(v + ' is already on the list', false); return; } settingsChange(st => { st.crews = (st.crews || []).concat([v]); }, v + ' added'); }
    else { const id = v.toLowerCase().replace(/[^a-z0-9]+/g, '') + Math.random().toString(36).slice(2, 5); const used = designers().map(d => d.color); const color = (COLORS.find(([c]) => !used.includes(c)) || COLORS[0])[0]; settingsChange(st => { st.designers = st.designers.concat([{ id, name: v, color }]); }, v + ' added'); }
    setTimeout(() => { const el = document.getElementById(kind === 'crew' ? 'add-crew' : 'add-designer'); if (el) { el.value = ''; el.focus(); } }, 0); return;
  }
  if (t.dataset && t.dataset.commit && t.tagName === 'INPUT' && (e.key === 'Enter' || e.key === 'Escape')) {
    if (e.key === 'Escape') { const p = S.projects[t.dataset.id || U.route.id]; if (p) t.value = p[t.dataset.commit] || ''; }
    e.preventDefault(); t.blur(); return;
  }
  if (t.dataset && t.dataset.dsearch && e.key === 'Enter') { e.preventDefault(); U.search = t.value; location.hash = '#/projects'; return; }
  if (t.dataset && t.dataset.wcommit && (e.key === 'Enter' || e.key === 'Escape')) { if (e.key === 'Escape') { const w = S.workflow.find(x => x.id === t.dataset.wid); if (w) t.value = w[t.dataset.wcommit] || ''; } e.preventDefault(); t.blur(); return; }
  if (t.dataset && t.dataset.wadd !== undefined && e.key === 'Enter') { e.preventDefault(); const v = t.value.trim(); if (!v) return; const si = Number(t.dataset.wadd); wfAdd(si, v); setTimeout(() => { const el = document.getElementById('wadd-' + si); if (el) { el.value = ''; el.focus(); } }, 0); return; }
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
  if (t.classList && t.classList.contains('shead') && (e.key === 'Enter' || e.key === ' ') && t === e.target) { e.preventDefault(); if (t.dataset.act === 'wstage') t.click(); else toggleStage(Number(t.dataset.i)); return; }
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
  if (t.dataset && t.dataset.em && U.email && t.tagName !== 'SELECT') { U.email.d[t.dataset.em] = t.value; U.email.d.touched = true; emPreview(); emSave(); return; }
  if (t.dataset && t.dataset.empara === 'text' && U.email) { const x = U.email.d.extras.find(y => y.id === t.dataset.x); if (x) { x.text = t.value; U.email.d.touched = true; emPreview(); emSave(); } return; }
  if (t.dataset && t.dataset.scommit) U.busy = true;
  if (t.dataset && t.dataset.input === 'search') { U.search = t.value; render(); }
  if (t.dataset && t.dataset.input === 'tsearch') { U.tsearch = t.value; render(); }
  if (t.dataset && t.dataset.input === 'asearch') { U.asearch = t.value; render(); }
  if (t.dataset && t.dataset.input === 'tagq') { U.tagQ = t.value; U.tagHi = 0; render(); }
  if (t.dataset && t.dataset.wcommit) U.busy = true;
  if (t.dataset && t.dataset.commit) U.busy = true;
});
document.addEventListener('change', (e) => {
  const t = e.target;
  if (t.dataset && t.dataset.change === 'sort') { U.sort = t.value; lsSet(LS.sort, U.sort); render(); }
  if (t.dataset && t.dataset.change === 'pickInstall' && t.value) { const p = S.projects[t.dataset.pid]; U.menu = null; if (p) mutate(p.id, q => { q.installDate = t.value; }, shortName(p.name) + ' · install ' + installLabel(t.value)); }
  if (t.dataset && t.dataset.change === 'crew') { const p = S.projects[t.dataset.pid]; if (p) mutate(p.id, q => { q.crew = t.value; }, t.value ? shortName(p.name) + ' · crew leader ' + t.value : shortName(p.name) + ' · crew leader cleared'); }
  if (t.dataset && t.dataset.change === 'asort') { U.asort = t.value; lsSet('gs5:asort', t.value); render(); }
  if (t.dataset && t.dataset.change === 'retention') { const v = Number(t.value); settingsChange(st => { st.retention = v; }, v ? 'Archived projects now delete after ' + v + ' days' : 'Auto-delete turned off'); }
  if (t.dataset && t.dataset.change === 'restore' && t.files && t.files[0]) { restoreBackup(t.files[0]); t.value = ''; }
  if (t.dataset && t.dataset.em && U.email && (t.tagName === 'SELECT' || t.type === 'hidden')) { U.email.d[t.dataset.em] = t.value; U.email.d.touched = true; emPreview(); emSave(); }
  if (t.dataset && t.dataset.empara === 'pos' && U.email) { const x = U.email.d.extras.find(y => y.id === t.dataset.x); if (x) { x.pos = t.value; U.email.d.touched = true; emPreview(); emSave(); } }
  if (t.dataset && t.dataset.change === 'tsort') { U.tsort = t.value; lsSet('gs5:tsort', U.tsort); render(); }
  if (t.dataset && t.dataset.change === 'pickDue' && t.value) { const p = (t.dataset.pid && S.projects[t.dataset.pid]) || curP(); const k = t.dataset.k; const x = p && getItem(p, k); U.menu = null; if (x) mutate(p.id, q => setItem(q, k, { due: t.value }), 'Target date set to ' + fmtDay(t.value)); }
});
/* Stage bar hover: only the hovered segment thickens (CSS), exactly like the New project picker. No fill preview. */

app.addEventListener('dragstart', (e) => {
  const crow = e.target.closest && e.target.closest('[data-cid][draggable]');
  if (crow) { if (/^(INPUT|BUTTON|TEXTAREA)$/.test(e.target.tagName)) { e.preventDefault(); return; } U.cdrag = { pid: crow.dataset.pid, id: crow.dataset.cid, stage: crow.dataset.stage }; crow.classList.add('dragging'); try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', U.cdrag.id); } catch (x) {} return; }
  const row = e.target.closest && e.target.closest('[data-wid][draggable]'); if (!row) return;
  if (/^(INPUT|BUTTON)$/.test(e.target.tagName)) { e.preventDefault(); return; }
  U.wdrag = row.dataset.wid; row.classList.add('dragging');
  try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', U.wdrag); } catch (x) {}
});
app.addEventListener('dragover', (e) => {
  if (U.cdrag) {
    const row = e.target.closest && e.target.closest('[data-cid]'); if (!row || row.dataset.pid !== U.cdrag.pid || row.dataset.stage !== U.cdrag.stage) return;
    e.preventDefault(); document.querySelectorAll('.dropabove,.dropbelow').forEach(n => n.classList.remove('dropabove', 'dropbelow'));
    if (row.dataset.cid === U.cdrag.id) return;
    const r = row.getBoundingClientRect(); row.classList.add(e.clientY < r.top + r.height / 2 ? 'dropabove' : 'dropbelow'); return;
  }
  if (!U.wdrag) return; const row = e.target.closest && e.target.closest('[data-wid]'); if (!row) return;
  const src = S.workflow.find(w => w.id === U.wdrag); if (!src || Number(row.dataset.stage) !== src.stage) return;
  e.preventDefault();
  document.querySelectorAll('.dropabove,.dropbelow').forEach(n => n.classList.remove('dropabove', 'dropbelow'));
  if (row.dataset.wid === U.wdrag) return;
  const r = row.getBoundingClientRect(); row.classList.add(e.clientY < r.top + r.height / 2 ? 'dropabove' : 'dropbelow');
});
app.addEventListener('drop', (e) => {
  if (U.cdrag) {
    const row = e.target.closest && e.target.closest('[data-cid]'); e.preventDefault(); const from = U.cdrag; U.cdrag = null;
    document.querySelectorAll('.dropabove,.dropbelow,.dragging').forEach(n => n.classList.remove('dropabove', 'dropbelow', 'dragging'));
    if (!row || row.dataset.cid === from.id || row.dataset.pid !== from.pid) return;
    const r = row.getBoundingClientRect(); const after = e.clientY >= r.top + r.height / 2; const to = row.dataset.cid;
    mutate(from.pid, q => { const list = q.custom || []; const i = list.findIndex(c => c.id === from.id); const item = list.splice(i, 1)[0]; let j = list.findIndex(c => c.id === to); if (after) j++; list.splice(j, 0, item); }, '“' + ((getItem(S.projects[from.pid], from.id) || {}).title || 'Step') + '” moved');
    return;
  }
  if (!U.wdrag) return; const row = e.target.closest && e.target.closest('[data-wid]'); e.preventDefault();
  const from = U.wdrag; U.wdrag = null;
  document.querySelectorAll('.dropabove,.dropbelow,.dragging').forEach(n => n.classList.remove('dropabove', 'dropbelow', 'dragging'));
  if (!row || row.dataset.wid === from) return;
  const r = row.getBoundingClientRect(); const after = e.clientY >= r.top + r.height / 2; const to = row.dataset.wid;
  const w = S.workflow.find(x => x.id === from);
  wfChange(wf => { const i = wf.findIndex(x => x.id === from); const item = wf.splice(i, 1)[0]; let j = wf.findIndex(x => x.id === to); if (after) j++; wf.splice(j, 0, item); }, '“' + w.title + '” moved');
});
app.addEventListener('dragend', () => { U.wdrag = null; U.cdrag = null; document.querySelectorAll('.dropabove,.dropbelow,.dragging').forEach(n => n.classList.remove('dropabove', 'dropbelow', 'dragging')); });

function settingsCommit(el) {
  const v = el.value.trim();
  if (el.dataset.scommit === 'dname') { const d = designer(el.dataset.id); if (!v) { el.value = d.name; return; } if (v === d.name) return; settingsChange(st => { st.designers.find(x => x.id === d.id).name = v; }, 'Renamed to ' + v); }
  if (el.dataset.scommit === 'tag') { const old = tagLib()[Number(el.dataset.i)]; if (!tagRename(old, v)) el.value = old; return; }
  if (el.dataset.scommit === 'crew') {
    const i = Number(el.dataset.i); const old = S.settings.crews[i]; if (!v) { el.value = old; return; } if (v === old) return;
    const beforeS = clone(S.settings); const touched = Object.values(S.projects).filter(p => p.crew === old).map(p => clone(p));
    const s2 = clone(S.settings); s2.crews[i] = v; putMeta('settings', s2);
    touched.forEach(p => { const q = clone(p); q.crew = v; putProject(q, { keepTime: true }); });
    pushUndo('Renamed to ' + v + (touched.length ? ' · ' + touched.length + (touched.length === 1 ? ' install' : ' installs') + ' updated' : ''), () => { putMeta('settings', beforeS); touched.forEach(p => putProject(p, { keepTime: true })); });
  }
}
/* Operations: drag a job between Installing now and Upcoming */
app.addEventListener('dragstart', (e) => {
  const row = e.target.closest && e.target.closest('[data-opid][draggable]'); if (!row) return;
  if (/^(INPUT|BUTTON|SELECT|A)$/.test(e.target.tagName)) { e.preventDefault(); return; }
  U.odrag = row.dataset.opid; U.ofrom = row.dataset.zone; row.classList.add('dragging');
  try { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', U.odrag); } catch (x) {}
});
app.addEventListener('dragover', (e) => {
  if (!U.odrag) return; const z = e.target.closest && e.target.closest('[data-dropzone]'); if (!z) return;
  e.preventDefault(); document.querySelectorAll('[data-dropzone]').forEach(n => n.classList.toggle('dropping', n === z && z.dataset.dropzone !== U.ofrom));
});
app.addEventListener('drop', (e) => {
  if (!U.odrag) return; const z = e.target.closest && e.target.closest('[data-dropzone]'); e.preventDefault();
  const id = U.odrag, from = U.ofrom; U.odrag = null; U.ofrom = null;
  document.querySelectorAll('.dropping,.dragging').forEach(n => n.classList.remove('dropping', 'dragging'));
  if (!z || z.dataset.dropzone === from) return;
  if (z.dataset.dropzone === 'now') startInstall(id); else pauseInstall(id);
});
app.addEventListener('dragend', () => { U.odrag = null; document.querySelectorAll('.dropping').forEach(n => n.classList.remove('dropping')); });

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
  const p = (a.dataset.pid && S.projects[a.dataset.pid]) || curP();
  const closeMenu = () => { U.menu = null; };
  switch (act) {
    case 'undo': doUndo(); break;
    case 'toastClose': U.toast = null; renderToast(); break;
    case 'promptArchive': { const pid = a.dataset.pid; U.toast = null; archiveById(pid); render(); break; }
    case 'promptOpen': { const pid = a.dataset.pid; U.toast = null; renderToast(); const pp = S.projects[pid]; if (pp && !pp.noArchivePrompt) { const q = clone(pp); q.noArchivePrompt = true; putProject(q, { keepTime: true }); } go('#/project/' + pid, { exit: true }); break; }
    case 'toggleSide': U.collapsed = !U.collapsed; lsSet(LS.side, U.collapsed); render(); setTimeout(fitSideProjects, 360); break;
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
    case 'stats': toggleStats(); break;
    case 'pstats': toggleFold('pstats'); break;
    case 'tagSel': U.tagSel = v; render(); break;
    case 'tagAdd': { const pid = (U.menu && U.menu.kind === 'tag' && U.menu.key) || U.route.id; tagAdd(pid, v); break; }
    case 'tagDel': if (p || U.route.id) tagDel((p && p.id) || U.route.id, v); break;
    case 'tagGo': U.search = '#' + v; U.menu = null; location.hash = '#/projects'; break;
    case 'tagRemove': tagRemove(v); break;
    case 'statRange': U.statRange = v; lsSet('gs5:statRange', v); render(); break;
    case 'setSort': { closeMenu(); const key = k; if (key === 'sort') { U.sort = v; lsSet(LS.sort, v); } else if (key === 'tsort') { U.tsort = v; lsSet('gs5:tsort', v); } else if (key === 'asort') { U.asort = v; lsSet('gs5:asort', v); } render(); break; }
    case 'menu': { const m = { kind: a.dataset.kind, key: a.dataset.key }; U.menu = U.menu && U.menu.kind === m.kind && U.menu.key === m.key ? null : m; if (m.kind === 'tag') { U.tagQ = ''; U.tagHi = 0; } U.menuFresh = !!U.menu; render(); U.menuFresh = false; if (U.menu && U.menu.kind === 'tag') { const ti = document.getElementById('tag-in'); if (ti) ti.focus(); } break; }
    case 'setDesigner': closeMenu(); if (p && p.designer !== v) mutate(p.id, q => { q.designer = v; }, 'Designer changed to ' + designer(v).name); else render(); break;
    case 'toggle': toggleStep(k, p); break;
    case 'setStatus': closeMenu(); if (p && (v === 'Done' || v === 'N/A') && U.route.page !== 'project') { listComplete(p.id, k, v); break; } if (p) { const x = getItem(p, k); const before = curStage(p); if (x && x.st.s !== v) { mutate(p.id, q => setItem(q, k, { s: v, doneAt: v === 'Done' ? todayISO() : '' }), '“' + x.title + '” · ' + v); const after = curStage(S.projects[p.id]); if (after !== before) { U.open[p.id + ':' + after] = true; render(); } } else render(); } break;
    case 'setPri': closeMenu(); if (p) { const x = getItem(p, k); if (x && x.st.p !== v) mutate(p.id, q => setItem(q, k, { p: v }), '“' + x.title + '” · ' + PL[v] + ' priority'); else render(); } break;
    case 'raise': closeMenu(); if (p) { const x = getItem(p, k); const sgx = suggestion(x); const nv = sgx ? sgx.target : LEVELS[Math.min(LEVELS.indexOf(x.st.p) + 1, 2)]; mutate(p.id, q => setItem(q, k, { p: nv }), '“' + x.title + '” raised to ' + PL[nv]); } break;
    case 'dismiss': closeMenu(); if (p) { const sgx = suggestion(getItem(p, k)); mutate(p.id, q => setItem(q, k, { dis: sgx ? sgx.target : 'URGENT' })); } break;
    case 'setDue': closeMenu(); if (p) { const x = getItem(p, k); mutate(p.id, q => setItem(q, k, { due: v, dis: false }), v ? 'Target date set to ' + fmtDay(v) : 'Target date cleared'); } break;
    case 'expand': if (p) { const key = p.id + ':' + k; U.expanded[key] = !U.expanded[key]; render(); if (U.expanded[key]) setTimeout(() => { const el = document.getElementById('note-' + k); if (el && !el.value) el.focus(); }, 0); } break;
    case 'moveCustom': if (p) mutate(p.id, q => { const list = q.custom; const i = list.findIndex(c => c.id === k); const st = list[i].stage; const same = list.map((c, j) => [c, j]).filter(([c]) => c.stage === st); const pos = same.findIndex(([c]) => c.id === k); const tgt = same[pos + Number(v)]; if (!tgt) return; const j = tgt[1]; [list[i], list[j]] = [list[j], list[i]]; }); break;
    case 'deleteCustom': if (p) { const x = getItem(p, k); mutate(p.id, q => { q.custom = q.custom.filter(c => c.id !== k); }, '“' + x.title + '” deleted'); } break;
    case 'stage': if (!t.closest('[data-stop]')) toggleStage(Number(a.dataset.i)); break;
    case 'complete': completeThrough(Number(a.dataset.i)); break;
    case 'reopen': reopenFrom(Number(a.dataset.i)); break;
    case 'toggleDone': if (p) { U.showDone[p.id] = !U.showDone[p.id]; render(); } break;
    case 'seg': segPick(Number(a.dataset.i)); break;
    case 'notNow': if (p) mutate(p.id, q => { q.noArchivePrompt = true; }); break;
    case 'archiveProject': archiveCurrent(); break;
    case 'deleteProject': deleteCurrent(); break;
    case 'goOps': go(a.dataset.email ? '#/operations/' + a.dataset.email : '#/operations', { exit: true }); break;
    case 'navx': go(v, { exit: true }); break;
    case 'reqToggle': if (p) { const x = getItem(p, k); if (x) { const makeReq = x.optional; mutate(p.id, q => setItem(q, k, { req: makeReq }), '“' + x.title + '” ' + (makeReq ? 'is now required for ' + shortName(p.name) + ' · shows on the Tasklist' : 'is optional again for ' + shortName(p.name))); } } break;
    case 'procBothAnim': procBothAnim(a.dataset.pid); break;
    case 'openEmail': openEmail(a.dataset.pid); break;
    case 'setInstall': closeMenu(); if (p) mutate(p.id, q => { q.installDate = v; }, v ? shortName(p.name) + ' · install ' + installLabel(v) : shortName(p.name) + ' · install date cleared'); break;
    case 'startInstall': startInstall(a.dataset.pid); break;
    case 'pauseInstall': pauseInstall(a.dataset.pid); break;
    case 'progStep': if (p) { const x = getItem(p, k); const nv = isClosed(x.st.s) ? 'Not Started' : 'Done'; if (x.st.s === 'N/A') break; mutate(p.id, q => setItem(q, k, { s: nv, doneAt: nv === 'Done' ? todayISO() : '' }), '“' + x.title + '” ' + (nv === 'Done' ? 'checked' : 'unchecked') + ' · ' + shortName(p.name)); } break;
    case 'emClose': clearTimeout(emSaveTimer); if (U.email && !U.email.closing) { const e = U.email; const pp = S.projects[e.pid]; if (pp && e.d.touched) { const q = clone(pp); q.emailDraft = clone(e.d); putProject(q, { keepTime: true }); } if (!motionOK()) { U.email = null; render(); break; } e.closing = true; renderEmail(); setTimeout(() => { if (U.email === e) { U.email = null; render(); } }, 290); } break;
    case 'emTog': if (U.email) { U.email.d[v] = !U.email.d[v]; U.email.d.touched = true; renderEmail(); emSave(); } break;
    case 'emAddPara': if (U.email) { const d = U.email.d; d.seq = (d.seq || 0) + 1; d.extras = (d.extras || []).concat([{ id: 'x' + d.seq, pos: 'end', text: '' }]); d.touched = true; renderEmail(); emSave(); setTimeout(() => { const el = document.getElementById('em-x-x' + d.seq); if (el) el.focus(); }, 0); } break;
    case 'emDelPara': if (U.email) { U.email.d.extras = U.email.d.extras.filter(x => x.id !== a.dataset.x); U.email.d.touched = true; renderEmail(); emSave(); } break;
    case 'emDefaults': if (U.email) { const d = U.email.d; const out = {}; EM_DEFAULT_KEYS.forEach(kk => { out[kk] = d[kk]; }); settingsChange(st => { st.opsEmailDefaults = out; }); U.email.note = 'Saved · new emails start with these'; const n = document.getElementById('em-note'); if (n) n.textContent = U.email.note; } break;
    case 'emCopy': emCopy(); break;
    case 'restore': restoreArch(a.dataset.id); break;
    case 'restoreHere': if (p) { const before = clone(p); mutate(p.id, q => { q.archived = false; q.archivedAt = null; q.pinned = false; }, p.name + ' restored to Projects'); } break;
    case 'deleteArch': removeFolder(a.dataset.id, 'gone'); break;
    case 'pin': { const pp = S.projects[a.dataset.id]; if (pp) mutate(pp.id, q => { q.pinned = !q.pinned; if (!q.pinned) q.archivedAt = Date.now(); }, pp.pinned ? pp.name + ' unpinned · countdown restarted' : pp.name + ' pinned · kept'); break; }
    case 'dsetColor': closeMenu(); settingsChange(st => { st.designers.find(d => d.id === a.dataset.id).color = v; }, designer(a.dataset.id).name + ' · ' + v); break;
    case 'ddel': { const d = designer(a.dataset.id); settingsChange(st => { st.designers = st.designers.filter(x => x.id !== d.id); }, d.name + ' removed'); break; }
    case 'cdel': { const i = Number(a.dataset.i); const c = S.settings.crews[i]; settingsChange(st => { st.crews.splice(i, 1); }, c + ' removed'); break; }
    case 'theme': U.theme = v; lsSet(LS.theme, v); render(); renderToast(); break;
    case 'motion': U.motion = !U.motion; lsSet(LS.motion, U.motion); render(); break;
    case 'backup': downloadBackup(); break;
    case 'install': doInstall(); break;
    case 'dsel': U.dsel = v; lsSet('gs5:dsel', v); render(); break;
    case 'tgroup': { const o = U.tgroups[v] !== undefined ? U.tgroups[v] : v !== 'LOW'; U.tgroups[v] = !o; render(); break; }
    case 'dgroup': { const o = U.dgroups[v] !== undefined ? U.dgroups[v] : v !== 'later'; U.dgroups[v] = !o; render(); break; }
    case 'dueDay': U.dueDay = !v || U.dueDay === v ? null : v; render(); break;
    case 'tcheck': listComplete(a.dataset.pid, k); break;
    case 'afterDone': if (p) afterSet(p.id, Number(a.dataset.i), 'Done', U.route.page === 'operations'); break;
    case 'afterNA': if (p) afterSet(p.id, Number(a.dataset.i), 'N/A', U.route.page === 'operations'); break;
    case 'afterStep': if (p) afterStep(p.id, k); break;
    case 'procBoth': if (p) procSet(p.id, { w25: true, w26: true }, p.name + ' processed · steps 25–26 checked'); break;
    case 'procOne': if (p) { const cur = ((p.steps || {})[k] || {}).s === 'Done'; procSet(p.id, { [k]: !cur }, (k === 'w25' ? 'Crewplan & pics' : 'Ops email') + (cur ? ' unchecked' : ' checked') + ' · ' + p.name); } break;
    case 'dashToggle': U.dash[v] = !U.dash[v]; lsSet('gs5:dash', U.dash); render(); break;
    case 'wstage': { const si = Number(a.dataset.i); const o = U.wopen[si] !== undefined ? U.wopen[si] : true; U.wopen[si] = !o; render(); break; }
    case 'wopt': { const id = a.dataset.wid; const w = S.workflow.find(x => x.id === id); wfChange(wf => { const t = wf.find(x => x.id === id); t.optional = !t.optional; }, '“' + w.title + '” ' + (w.optional ? 'now counts toward progress' : 'marked optional')); break; }
    case 'wmove': { const id = a.dataset.wid; wfChange(wf => { const i = wf.findIndex(x => x.id === id); const st = wf[i].stage; const dir = Number(v); let j = i + dir; while (j >= 0 && j < wf.length && wf[j].stage !== st) j += dir; if (j < 0 || j >= wf.length) return; [wf[i], wf[j]] = [wf[j], wf[i]]; }, null); break; }
    case 'wdel': { const id = a.dataset.wid; const w = S.workflow.find(x => x.id === id); wfChange(wf => { const i = wf.findIndex(x => x.id === id); wf.splice(i, 1); }, '“' + w.title + '” removed from the template'); break; }
    case 'toTemplate': if (p) { const x = getItem(p, k); if (x) wfAdd(x.stage, x.title, { pid: p.id, cid: k }); } break;
  }
});

/* ---------- install as an app (PWA) ---------- */
let installEvt = null;
const isStandalone = () => (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEvt = e; render(); });
window.addEventListener('appinstalled', () => { installEvt = null; showToast('Green Screen installed', false); render(); });
function doInstall() {
  if (!installEvt) { location.hash = '#/settings'; return; }
  const ev = installEvt; installEvt = null;
  ev.prompt();
  (ev.userChoice || Promise.resolve({})).then((r) => { if (r && r.outcome !== 'accepted') installEvt = ev; render(); }).catch(() => render());
}
function installCard() {
  if (isStandalone()) return '';
  const ua = navigator.userAgent || '';
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const how = ios
    ? 'In Safari, tap the Share button, then <b>Add to Home Screen</b>.'
    : installEvt ? 'Opens in its own window with the Green Screen icon, like any other app.'
    : 'In Chrome, click the install icon at the right end of the address bar, or open the ⋮ menu → <b>Cast, save and share</b> → <b>Install page as app</b>. If you don’t see it, the app may already be installed: check your apps or desktop.';
  return `<section class="card scard rise"><div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap"><span style="width:40px;height:40px;border-radius:10px;background:var(--accent);display:grid;place-items:center;flex:none">${I.leaf(40)}</span><span style="flex:1;min-width:220px"><h2 style="margin-bottom:2px">Install Green Screen</h2><span style="font-size:12.5px;color:var(--muted)">${how}</span></span>${installEvt && !ios ? `<button class="btn pri press" data-act="install">${I.download}Install app</button>` : ''}</div></section>`;
}
function downloadBackup() {
  const data = { app: 'Green Screen', version: APP_VERSION, exportedAt: new Date().toISOString(), projects: S.projects, workflow: S.workflow, settings: S.settings, activity: S.activity };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'green-screen-backup-' + todayISO() + '.json';
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  settingsChange(st => { st.lastBackup = Date.now(); });
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
if (!location.hash) history.replaceState(null, '', '#/dashboard');
U.route = parseRoute();
render();
renderToast();
initCloud();
if (LOCAL_ONLY) { setTimeout(purgeArchive, 800); setTimeout(runMigrations, 400); }
maybeOpenEmailFromRoute();
window.GS = { S, U, render, putProject, version: APP_VERSION };
