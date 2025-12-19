// serviceWorker.js
const CACHE_NAME = "V2.5";
const CACHE_ASSETS = [
  "./",
  "./game.js",
  "./firebaseinit.js",
  "./service-worker.js",
  "./manifest.json",
  "./images/icon1.png"
];

// Kurulum (Install)
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_ASSETS);
    })
  );
   self.skipWaiting();
});

// Aktifleştirme (Activate)
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch
self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // başarılıysa cache’i güncelle
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // offline ise cache'ten ver
        return caches.match(e.request);
      })
  );
});

