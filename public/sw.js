const CACHE_NAME = "kumpra-stock-v1";

self.addEventListener("install", (event) => {
  console.log("Service Worker installing");

  self.skipWaiting();
});


self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");

  event.waitUntil(self.clients.claim());
});


self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cached) => {

        if (cached) {
          return cached;
        }

        return fetch(event.request)
          .then((response) => {

            const clone = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, clone);
              });

            return response;
          })
          .catch(() => {
            return caches.match("/");
          });

      })
  );
});