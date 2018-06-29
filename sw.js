
    const urlsToCache_ = [
      '/',
      '/css/bootstrap.css',
      '/js/currencyconverter.js',
      '/js/idb.js',
      '/css/font-awesome/css/font-awesome.min.css'
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
    
    self.addEventListener('fetch', function(event) {
      const requestUrl = new URL(event.request.url);
  
    if (requestUrl.origin === location.origin) {
      if (requestUrl.pathname === '/') {
        event.respondWith(caches.match('/'));
        return;
      }
      
    }
  
      event.respondWith(
        //loadCur(),
        caches.match(event.request).then(function(response) {
          return response || fetch(event.request);
        })
      );
    });
  
    const loadCur = () =>{
      var cur = indexedDB.open("currencies");
      cur.onsuccess = function (conn){
      var trans = cur.result.transaction(["store"]);
      var obj = trans.objectStore("store");
      var cursor = obj.openCursor();
      cursor.onsuccess = function (e) {
              if (!cursor.result) {
                 var from = document.getElementById("from"); 
                 var to = document.getElementById("to"); 
                 var option = document.createElement("option");
                 var option2 = document.createElement("option");
                 option.value = cursor.result.value;
                 option2.value = cursor.result.value;                
                 var optionText = document.createTextNode(cursor.result.value);                
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
  
    
    self.addEventListener('activate', function(event) {
    
      let cacheWhitelist = [version];
    
      event.waitUntil(
        loadCur(),
        caches.keys().then(function(cacheNames) {
          return Promise.all(
            cacheNames.map(function(cacheName) {
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
    self.addEventListener('message', function(event) {
      if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
      }
    });
     // Ensure refresh is only called once.
    // This works around a bug in "force update on reload".
    let refreshing;
    self.addEventListener('controllerchange', function() {
      if (refreshing) return;
      window.location.reload();
      refreshing = true;
    });