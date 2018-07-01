let db;
let ccurrencies;
const url = 'https://free.currencyconverterapi.com/api/v5/currencies';

let openRequest = indexedDB.open('currencies', 1);

openRequest.onupgradeneeded = e => {
  var db = e.target.result;
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
    let request = indexedDB.open('curr', 3);
    request.onupgradeneeded = event => {

    var db = event.target.result;

    // Create an object store called "currency"    
    var objStore = db.createObjectStore("currency", { keyPath: 'id' });
    }
    if (request) {
      request.onsuccess = e => {
      var currStore = e.target.result.transaction('currency', "readwrite");
      var tbl = currStore.objectStore('currency');
      var from = document.getElementById('from').value;
      var to = document.getElementById('to').value;
      var cur = `'https://free.currencyconverterapi.com/api/v5/convert?q=${from}_${to}&compact=ultra'`;
      var convrate = document.getElementById('convrate').value;
      var saveOperation = tbl.add({
       "currency": cur,
        "convrate":convrate
       });
       saveOperation.onsuccess = function (e) {
        var res = document.getElementById("idbsav");
        res.value = "Saved to indexDB: " + e.target.result;
       };
       saveOperation.onerror = function (e) {
        var res = document.getElementById("idbsav");
        res.value = "Error Occured" + e.value;
       };
       
       return currStore.complete;
      };
    }
    }