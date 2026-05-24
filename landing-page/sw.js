/* Service worker for Jakub Benjamin Jankovič — Digital Contact Hub.
 * Strategy: stale-while-revalidate for same-origin GET requests (instant repeat
 * loads + offline), with a cached-index fallback for navigations when offline.
 * Cross-origin requests (Google Fonts) pass through to the network.
 * Bump CACHE on each release to drop stale entries.
 */
var CACHE = 'jbj-connect-v8';
var CORE = ['./', './index.html'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(CORE).catch(function () {});
    }),
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (k) {
          if (k !== CACHE) return caches.delete(k);
        }),
      );
    }).then(function () {
      return self.clients.claim();
    }),
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  // Only handle same-origin requests; let fonts/analytics hit the network.
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(req).then(function (cached) {
        var network = fetch(req)
          .then(function (res) {
            if (res && res.status === 200 && res.type === 'basic') {
              cache.put(req, res.clone());
            }
            return res;
          })
          .catch(function () {
            // Offline: for navigations, fall back to the cached card.
            if (req.mode === 'navigate') {
              return cache.match('./index.html') || cache.match('./');
            }
            return cached;
          });
        return cached || network;
      });
    }),
  );
});
