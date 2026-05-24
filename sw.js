const CACHE_NAME = 'presupuestopro-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './styles.css',
  './app.js',
  './icon-192x192.png',
  './icon-512x512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(function(error) {
      console.log('Cache installation failed:', error);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Siempre obtener app.js desde la red para recibir actualizaciones
  if (url.pathname.endsWith('/app.js') || url.pathname.endsWith('/app.js')) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        if (!response || response.status !== 200 || response.type === 'error') return response;
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(function() {
        return caches.match(event.request).then(function(response) {
          return response || new Response('', { status: 503 });
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request).then(function(response) {
        if (!response || response.status !== 200 || response.type === 'error') return response;
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(function() {
        return caches.match('./index.html').then(function(response) {
          return response || new Response('Sin conexión', { status: 503 });
        });
      });
    })
  );
});
