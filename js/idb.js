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
    request.onupgradeneeded = (event) => {

    var db = event.target.result;

    // Create another object store called "names" with the autoIncrement flag set as true.    
    var objStore = db.createObjectStore("currency", { keyPath: 'from' });
    }
    if (request) {
      request.onsuccess = function (e) {
        //var objectStore = e.target.result.createObjectStore("name", { keyPath: "myKey" });
      //S1: Get the Transaction for the ObjectStore, here in this case it is for readwrite 
      var currStore = e.target.result.transaction('currency', "readwrite");
      //S2: Get the object store object
      var tbl = currStore.objectStore('currency');
      //S3: Read values entered in each textbox and also the selected date 
      var from = document.getElementById('from').value;
      var to = document.getElementById('to').value;
      var amount = document.getElementById('amount').value;
      var toamount = document.getElementById('toamount').value;
      var convrate = document.getElementById('convrate').value;
      //var toamount = parseInt(document.getElementById('to').value) * parseInt(document.getElementById('txtqty').value);
      //S4: Add the values against each keypath on object store
      var saveOperation = tbl.add({
        "to": to ,
        "from":from,
        "amount":amount,
        "toamount":toamount,
        //TODO Save Exchange Rate
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
       //document.getElementById('txtprice').value = totalPrice;
       return currStore.complete;
      };
    //loadOrder(); //Load Orders if Table is already Available
    }
    }
