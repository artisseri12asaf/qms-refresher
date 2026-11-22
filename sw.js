const CACHE="qms-handbook-v100";
const ASSETS=["./","./index.html","./manifest.json","./icon-192.png","./icon-512.png","./icon-180.png","./qraft-icon-192.png","./qraft-icon-512.png","./qraft-icon-180.png"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS.map(u=>new Request(u,{cache:"reload"}))))); self.skipWaiting(); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  const isPage=e.request.mode==="navigate"||e.request.destination==="document";
  const req=isPage?new Request(e.request.url,{cache:"no-store"}):e.request;
  e.respondWith(fetch(req).then(r=>{ const copy=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{}); return r; }).catch(()=>caches.match(e.request).then(m=>m||caches.match("./index.html"))));
});
