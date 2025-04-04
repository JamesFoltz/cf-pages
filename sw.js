// Automatically updated version (replace with dynamic versioning logic)
const cacheVersion = "4404036"; // Replace this dynamically during build or commit
const cacheName = `offline-cache-${cacheVersion}`;
const cacheUrls = ["index.html", "cat.jpeg", "styles.css", "app.js"];

// Installing the Service Worker
self.addEventListener("install", async (event) => {
  console.log(`Service Worker installing. Cache version: ${cacheVersion}`);
  event.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      await cache.addAll(cacheUrls);
    })()
  );
  self.skipWaiting(); // Activate immediately
});

// Activating the Service Worker
self.addEventListener("activate", (event) => {
  console.log(`Service Worker activating. Cache version: ${cacheVersion}`);
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys();
      // Delete old caches not matching the current version
      await Promise.all(
        cacheKeys.map((key) => {
          if (key !== cacheName) {
            console.log(`Deleting old cache: ${key}`);
            return caches.delete(key);
          }
        })
      );
    })()
  );
  self.clients.claim(); // Take control of all pages immediately
});

// Fetching resources
self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(cacheName);
      try {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          console.log(`Serving from cache: ${event.request.url}`);
          return cachedResponse;
        }

        const fetchResponse = await fetch(event.request);
        if (fetchResponse) {
          console.log(`Fetching and caching: ${event.request.url}`);
          await cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        }
      } catch (error) {
        console.error(`Fetch failed: ${error}`);
        // Fallback to cached index.html for offline support
        return await cache.match("index.html");
      }
    })()
  );
});
