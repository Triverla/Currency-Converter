
    const urlsToCache_ = [
      'https://triverla.github.io/Currency-Converter/',
      'css/bootstrap.css',
      'js/currencyconverter.js',
      'js/idb.js',
      'css/font-awesome/css/font-awesome.min.css'
    ];
    
    const version = 'v1.0';
    
    self.addEventListener('install', event => {
      console.log('ServiceWorker Installed: version', version);
      event.waitUntil(
        caches.open(version)
          .then(cache => {
          console.log("cache opened");
          return cache.addAll(urlsToCache_);
        })
      );
    });
    
    self.addEventListener('fetch', event => {
      const requestUrl = new URL(event.request.url);
  
    if (requestUrl.origin === location.origin) {
      if (requestUrl.pathname === '/Currency-Converter') {
        event.respondWith(caches.match('Currency-Converter/'));
        return;
      } 
    }
    if(requestUrl.url === 'https://free.currencyconverterapi.com/api/v5/currencies'){
      console.log("IndexDB Reqrd");
      let openRequest = indexedDB.open('currencies', 1);
      openRequest.onupgradeneeded = e => {
      var db = e.target.result;
       let ob = db.transaction('store');
       let data = ob.objectStore('store');
       let results = data.getAll();
      };
      openRequest.onsuccess = e => {
      console.log('running onsuccess for currencies');
        results = e.target.result;
        for (const result in results){
          for (const id in results[result]){
            const option1 = document.createElement('option');
            const option2 = document.createElement('option');
            option1.value = results[result][id]['id'];
            option2.value = results[result][id]['id'];
            option1.appendChild(document.createTextNode(results[result][id]['id']));
            option2.appendChild(document.createTextNode(results[result][id]['id']));
            from.appendChild(option1);
            to.appendChild(option2);
          }
        }
}
    }
  
      event.respondWith(
        //loadCur(),
        caches.match(event.request).then(response => {
          return response || fetch(event.request);
        })
      );
    });
  
    const loadCur = () =>{
      let cur = indexedDB.open("currencies");
      cur.onsuccess = function (conn){
      let trans = cur.result.transaction(["store"]);
      let obj = trans.objectStore("store");
      let cursor = obj.openCursor();
      cursor.onsuccess = e => {
              if (!cursor.result) {
                 let from = document.getElementById("from"); 
                 let to = document.getElementById("to"); 
                 let option = document.createElement("option");
                 let option2 = document.createElement("option");
                 option.value = cursor.result.value;
                 option2.value = cursor.result.value;                
                 let optionText = document.createTextNode(cursor.result.value);                
                 option.appendChild(optionText);
                 option2.appendChild(optionText);
                 from.appendChild(option); 
                 to.appendChild(option);
                 cursor["continue"]()
              } else {
                 // cursor ended
              }
      }
    }
  }
  
    
    self.addEventListener('activate', event => {
    
      let cacheWhitelist = [version];
    
      event.waitUntil(
        //loadCur(),
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              if (version && cacheWhitelist.indexOf(cacheName) === -1) {
                console.log('Deleted old cache');
                return caches.delete(cacheName);
              }
            })
          );
        })
      );
    });
    //skipWaiting
    self.addEventListener('message', event => {
      if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
      }
    });
     // Ensure refresh is only called once.
    // This works around a bug in "force update on reload".
    let refreshing;
    self.addEventListener('controllerchange', () => {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });
