const CACHE='duru-ogretmenim-v6520-turkish-school-daily-details';
const APP_SHELL=['./','./index.html','./veli-ilerleme-v6513.js?v=20261106-6520','./fenomen-content-v6520.js?v=20261106-6520','./daily-study-v6519.js?v=20261106-6520','./turkish-content-v6520.js?v=20261106-6520','./turkish-upgrade-v6520.js?v=20261106-6520','./din-kulturu-yazili-2026.js?v=20261102-511','./manifest.webmanifest'];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)));
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;

  const isPage=event.request.mode==='navigate'||url.pathname.endsWith('/index.html');
  if(isPage){
    event.respondWith(
      fetch(event.request,{cache:'no-store'})
        .then(response=>{
          if(response.ok){
            const copy=response.clone();
            caches.open(CACHE).then(cache=>cache.put(event.request,copy));
          }
          return response;
        })
        .catch(()=>caches.match(event.request).then(hit=>hit||caches.match('./')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(hit=>hit||fetch(event.request).then(response=>{
      if(response.ok){
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy));
      }
      return response;
    }))
  );
});
