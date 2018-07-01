
    const urlsToCache_ = [
      'https://triverla.github.io/Currency-Converter/',
      'css/bootstrap.css',
      'js/currencyconverter.js',
      'js/idb.js',
      'css/font-awesome/css/font-awesome.min.css',
      'https://free.currencyconverterapi.com/api/v5/currencies',
      'https://free.currencyconverterapi.com/api/v5/convert?q=USD_NGN&compact=ultra'
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
      console.log("Added to cache");
      event.respondWith(caches.match('https://free.currencyconverterapi.com/api/v5/currencies'));
      return;
    }

    if(requestUrl.url === 'https://free.currencyconverterapi.com/api/v5/convert?q=USD_NGN&compact=ultra'){
      console.log("Added to cache");
      event.respondWith(caches.match('https://free.currencyconverterapi.com/api/v5/convert?q=USD_NGN&compact=ultra'));
      return;
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
