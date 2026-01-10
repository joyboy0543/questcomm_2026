
const CACHE_NAME = 'qr-hunt-v1';
const ASSETS = [
  './', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k))))); });
self.addEventListener('fetch', (e) => { const { request } = e; e.respondWith(caches.match(request).then(cached => cached || fetch(request))); });
