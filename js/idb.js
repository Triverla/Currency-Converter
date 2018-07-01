let db;
let ccurrencies;
const url = 'https://free.currencyconverterapi.com/api/v5/currencies';

let openRequest = indexedDB.open('currencies', 1);

openRequest.onupgradeneeded = e => {
  let db = e.target.result;
  console.log('running onupgradeneeded');
  if (!db.objectStoreNames.contains('store')) {
    let storeOS = db.createObjectStore('store',
      {keyPath: 'id'});
  //The column metadata 
  }
};
openRequest.onsuccess = e => {
  console.log('running onsuccess');
  db = e.target.result;
  addCurrencies();
  saveCurrencies();
};
openRequest.onerror = e => {
  console.log('onerror!');
  console.dir(e);
};

const addCurrencies = () => {
  fetch(url).then(response => {
    return response.json();
}).then(currencies => {
ccurrencies = [currencies.results];
  let transaction = db.transaction(['store'], 'readwrite');
  let store = transaction.objectStore('store');
        ccurrencies.forEach( currency => {
            for(let value in currency){
                store.add(currency[value]);
            }
        });
 return transaction.complete;

 request.onerror = e => {
    console.log('Error', e.target.error.name);
  };
  request.onsuccess = e => {
    console.log('Woot! Did it');
  };
})
}

const saveCurrencies = () => {  
      let from = document.getElementById('from').value;
      let to = document.getElementById('to').value;
      let cur = `${from}_${to}`;
      fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${cur}&compact=ultra`).then((response)=> {
         return response.json();
         }).then((rates) => {
            for(let rate in rates){
              console.log(rates[rate]); //rate of currency to be converted to
              let calc = rates[rate]; //rate being pass back to object to get the value
              let crate = calc.toFixed(2); //to dispay conversion rate
            let request = indexedDB.open('curr', 3);
            request.onupgradeneeded = event => {
        
            let db = event.target.result;
        
            // Create an object store called "currency"    
            let objStore = db.createObjectStore("conversions");
              //objStore.createIndex('key', 'value');
            }
            if (request) {
              request.onsuccess = e => {
              let currStore = e.target.result.transaction('conversions', "readwrite");
              let tbl = currStore.objectStore('conversions');
            let saveOperation = tbl.put(cur,crate);
              saveOperation.onsuccess = e => {
                console.log("Saved to indexDB: " + e.target.result);
              };
              saveOperation.onerror = e => {
                console.log("Error occured: " + e.value);
              };
              return currStore.complete;
            }
         }
      };
    }
  );
    }
