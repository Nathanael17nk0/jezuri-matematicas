// Service Worker for Perrito Math PWA - 100% Offline First Engine
const CACHE_NAME = 'perrito-math-offline-v3.2';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './xlsx.full.min.js',
  './Tablas_Dinamicas_MCD.xlsx',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon.png',
  './icons/perrito-avatar.png',
  './icons/qr-code.png'
];

// Install Event - Pre-cache all essential shell assets individually to ensure 100% success
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[Perrito Math SW] Pre-caching offline assets...');
      const cachePromises = PRECACHE_ASSETS.map(async (asset) => {
        try {
          const response = await fetch(asset, { cache: 'no-cache' });
          if (response && response.ok) {
            // Cache with relative path and fully resolved scope URL
            await cache.put(asset, response.clone());
            const absoluteUrl = new URL(asset, self.registration.scope).href;
            await cache.put(absoluteUrl, response);
          }
        } catch (err) {
          console.warn('[Perrito Math SW] Advertencia precaching recurso:', asset, err);
        }
      });
      await Promise.all(cachePromises);
      console.log('[Perrito Math SW] Todos los recursos offline precacheados con éxito.');
    })
  );
});

// Activate Event - Clean old caches and claim all open clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Perrito Math SW] Limpiando caché anterior:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper to find navigation fallback
async function getCachedIndex() {
  const cache = await caches.open(CACHE_NAME);
  const possibleKeys = [
    './index.html',
    'index.html',
    './',
    self.registration.scope,
    new URL('index.html', self.registration.scope).href
  ];
  for (const key of possibleKeys) {
    const match = await cache.match(key, { ignoreSearch: true });
    if (match) return match;
  }
  return null;
}

// Fetch Event - Offline First Strategy with instant local cache response
self.addEventListener('fetch', (event) => {
  // Only process HTTP GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. Navigation requests (opening or refreshing the page / PWA app)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        // Fast response: Check cache first for instant launch (offline or online)
        const cached = await caches.match(event.request, { ignoreSearch: true }) ||
                       await getCachedIndex();

        // If in cache, return immediately! Then fetch update in background
        if (cached) {
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
          }).catch(() => {/* Offline: silent */});
          return cached;
        }

        // If not in cache yet, fetch from network and cache
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            const cache = await caches.open(CACHE_NAME);
            cache.put(event.request, clone);
          }
          return networkResponse;
        } catch (err) {
          const fallback = await getCachedIndex();
          if (fallback) return fallback;
          return new Response('Perrito Math está listo para usarse sin conexión.', {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        }
      })()
    );
    return;
  }

  // 2. Local app assets (CSS, JS, SheetJS, Images, Icons, Manifest)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version immediately! Update in background if online
          fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
          }).catch(() => {/* Offline: keep serving cached asset */});

          return cachedResponse;
        }

        // If not in cache, fetch from network and cache
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        }).catch((err) => {
          console.warn('[Perrito Math SW] Recurso local no disponible offline:', event.request.url);
        });
      })
    );
    return;
  }

  // 3. External assets (e.g. Google Fonts)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => {
        // External network failed offline: fallback gracefully to system fonts
      });
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
