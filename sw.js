/* Service worker: guarda la app para abrirla con conexión débil o sin conexión. */
var CACHE = "pluviatech-v2";
var ARCHIVOS = ["./", "./index.html", "./styles.css", "./app.js", "./data.js", "./manifest.json", "./icons/icon.svg", "./icons/icon-192.png"];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ARCHIVOS); }));
  self.skipWaiting();
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});
// Red primero (datos frescos); si no hay conexión, usa la copia guardada.
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(function (r) {
      var copia = r.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copia); });
      return r;
    }).catch(function () { return caches.match(e.request).then(function (m) { return m || caches.match("./index.html"); }); })
  );
});
