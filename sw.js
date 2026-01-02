// Service Worker - Auto-cleanup
// Remove Service Worker antigo e limpa cache

self.addEventListener('install', function(event) {
  // Força ativação imediata
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    // Limpa todos os caches
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
    // Auto-desregistra
    .then(function() {
      return self.registration.unregister();
    })
    .then(function() {
      return self.clients.matchAll();
    })
    .then(function(clients) {
      // Recarrega todas as páginas abertas
      clients.forEach(client => client.navigate(client.url));
    })
  );
});

// Não intercepta nenhuma requisição
self.addEventListener('fetch', function(event) {
  return;
});
