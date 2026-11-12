/* Green Screen v5 service worker — bump VERSION on every upload */
const VERSION = '5.3.5';
const CACHE = 'gs5-shell-' + VERSION;
const RUNTIME = 'gs5-runtime';
const SHELL = ['./', './index.html', './styles.css?v=5.3.5', './app.js?v=5.3.5', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png', './icons/favicon.svg'];
const FB = 'https://www.gstatic.com/firebasejs/10.13.0/';
const FIREBASE = [FB + 'firebase-app.js', FB + 'firebase-firestore.js', FB + 'firebase-auth.js'];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(SHELL);
    const r = await caches.open(RUNTIME);
    await Promise.all(FIREBASE.map(u => fetch(u, { mode: 'cors' }).then(res => res.ok && r.put(u, res)).catch(() => {})));
  })());
});
self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting(); });
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('gs5-shell-') && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Firebase SDK files and Google Fonts: cache-first so the app opens offline
  if (url.href.startsWith(FB) || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(RUNTIME).then(async (c) => {
      const hit = await c.match(req);
      const net = fetch(req).then(res => { if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (url.origin !== self.location.origin) return; // Firestore traffic etc. goes straight to the network
  // App files: network first (always newest when online), cache when offline
  e.respondWith(fetch(req, { cache: 'no-cache' }).then(res => {
    if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  }).catch(async () => (await caches.match(req)) || (req.mode === 'navigate' ? caches.match('./index.html') : undefined)));
});
