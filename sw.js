const CACHE_NAME = 'adnan-site-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/common/styles.css',
    '/common/index.js',
    '/common/navbar.js',
    '/about/index.html',
    '/about/style.css',
    '/about/src/music.css',
    '/about/src/music.js',
    '/about/src/movie.js',
    '/about/src/avatar.js',
    '/polynomial-solver/index.html',
    '/polynomial-solver/style.css',
    '/polynomial-solver/src/index.js',
    '/polynomial-solver/src/mathField.js',
    '/polynomial-solver/src/solver.js',
    '/encrypt-decrypt/index.html',
    '/encrypt-decrypt/style.css',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch event - network first for HTML, cache first for assets
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Only handle same-origin requests and GET requests
    if (request.method !== 'GET') return;

    // For HTML pages: network first, fallback to cache
    if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clone and cache the fresh response
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(request);
                })
        );
        return;
    }

    // For static assets (CSS, JS, images): cache first, fallback to network
    if (url.origin === location.origin) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    // Return cache but also update in background (stale-while-revalidate)
                    fetch(request).then((response) => {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, response);
                        });
                    }).catch(() => {});
                    return cachedResponse;
                }
                return fetch(request).then((response) => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                });
            })
        );
        return;
    }

    // For third-party assets (CDN): cache first with network fallback
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            return cachedResponse || fetch(request).then((response) => {
                // Only cache successful responses
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            });
        })
    );
});
