// Don Pepe - Service Worker. Si cambias archivos de la app, sube la versión (v1 -> v2).
const PREFIJO = 'donpepe-';
const CACHE = PREFIJO + 'v7';
const ASSETS = ['./', './index.html', './script.js', './manifest.json', './logo.svg', './icon-192.png', './icon-512.png', './icon-maskable-512.png',
  'https://code.jquery.com/jquery-3.7.1.min.js', 'https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.min.js',
  'https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Caveat:wght@600;700&family=Nunito+Sans:wght@400;600;800&display=swap'];
const CDN = ['code.jquery.com', 'cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => Promise.allSettled(ASSETS.map((f) => c.add(f.startsWith('http') ? f : new Request(f, { cache: 'reload' }))))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((ks) => Promise.all(ks.filter((k) => k.startsWith(PREFIJO) && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.mode === 'navigate') {   // páginas: red primero, copia guardada si no hay internet
    e.respondWith(fetch(req)
      .then((res) => { if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put('./', cp)); } return res; })
      .catch(() => caches.match('./').then((r) => r || caches.match('./index.html'))));
    return;
  }
  if (url.origin === self.location.origin) {   // archivos de la app: red primero (siempre la versión nueva), caché solo sin internet
    e.respondWith(fetch(req, { cache: 'no-cache' })
      .then((res) => { if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); } return res; })
      .catch(() => caches.match(req)));
    return;
  }
  if (!CDN.includes(url.hostname)) return;
  e.respondWith(caches.match(req).then((cached) => {   // librerías y fuentes: caché primero, se actualiza en segundo plano
    const red = fetch(req).then((res) => {
      if (res && (res.status === 200 || res.type === 'opaque')) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); }
      return res;
    }).catch(() => cached);
    return cached || red;
  }));
});
