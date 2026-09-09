const CACHE_NAME = "villa-kids-v62-offline";
const APP_SHELL = [
  "./", "./index.html", "./app.html",
  "./configurar-equipe.html", "./convidados-festa.html", "./documentos-festa.html",
  "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png",
  "./villa-kids-logo-placeholder.png", "./villa-kids-logo-redonda.png",
  "./villa-kids-logo-transparente.png", "./villa-kids-logo.jpg",
  "./recreamor-logo-original.jpg", "./logo-recreamor-transparente.png", "./nova-logo-recreamor.png"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === "navigate") {
    event.respondWith(fetch(req).then(response => {
      const copy=response.clone();
      caches.open(CACHE_NAME).then(c=>c.put(req,copy)).catch(()=>{});
      return response;
    }).catch(() => caches.match(req).then(r => r || caches.match("./index.html"))));
    return;
  }
  event.respondWith(caches.match(req).then(cached => {
    const net=fetch(req).then(response => {
      if(response && response.ok){const copy=response.clone(); caches.open(CACHE_NAME).then(c=>c.put(req,copy)).catch(()=>{});}
      return response;
    }).catch(()=>cached);
    return cached || net;
  }));
});
