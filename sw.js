const CACHE='roundkaki-pwa-v2.4.0';
const CORE=['./','./index.html','./manifest.webmanifest?v=2.4','./privacy.html','./terms.html','./roundkaki-icon-v24-192.png','./roundkaki-icon-v24-512.png','./roundkaki-maskable-v24-192.png','./roundkaki-maskable-v24-512.png','./roundkaki-apple-v24.png','./brand-mark.png','./logo-roundkaki.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{
      const copy=response.clone(); caches.open(CACHE).then(c=>c.put('./index.html',copy)); return response;
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  event.respondWith(fetch(event.request).then(response=>{
    if(response && response.ok){const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));}
    return response;
  }).catch(()=>caches.match(event.request)));
});
