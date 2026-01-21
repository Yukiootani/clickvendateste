importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');
const CACHE_NAME = 'clickvenda-cms-v1';
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((k) => { if(k !== CACHE_NAME) return caches.delete(k); }))));
    return self.clients.claim();
});
self.addEventListener('fetch', (e) => e.respondWith(fetch(e.request).catch(() => caches.match(e.request))));
firebase.initializeApp({ messagingSenderId: "100515126742" });
const messaging = firebase.messaging();
messaging.onBackgroundMessage((p) => {
    return self.registration.showNotification(p.notification.title, { body: p.notification.body, icon: '/icon.png' });
});