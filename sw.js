/* Lo mínimo para que el móvil la trate como app instalable. Red primero (siempre la versión nueva) y, sin red,
   la última copia de la página. Las fotos y avisos nunca se guardan aquí: van a Google. */
var C = 'fotos-paquetes-v1';
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;   // Google y el CDN, sin tocar
  e.respondWith(fetch(e.request).then(function (r) {
    var copia = r.clone();
    caches.open(C).then(function (c) { c.put(e.request, copia); });
    return r;
  }).catch(function () { return caches.match(e.request); }));
});
