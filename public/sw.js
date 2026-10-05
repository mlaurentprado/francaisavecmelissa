// CACHE_NAME versionado: ao subir uma versão nova, os caches antigos são apagados
// no "activate", garantindo que o app no celular receba os arquivos atualizados.
const CACHE_NAME = 'fam-cache-v2';

// Apenas arquivos estáticos que não mudam de nome entre versões.
// Não pré-cacheamos '/' nem '/index.html' para não servir HTML antigo.
const PRECACHE_ASSETS = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/hero.png',
  '/debutant.jpg',
  '/intermediaire.jpg',
  '/perfil.jpg',
  '/sobre.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-caching partial failure:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// A página pede a ativação imediata quando o usuário toca em "Atualizar".
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  // Apenas requisições GET do próprio app (fontes/CDNs seguem direto para a rede).
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Rede primeiro: com conexão, o app sempre carrega a versão mais recente.
  // O cache fica apenas como reserva para uso offline.
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() =>
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') return caches.match('/');
          return Response.error();
        })
      )
  );
});
