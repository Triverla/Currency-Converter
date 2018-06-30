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
  loadCur();
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

    // Create an object store called "currency"    
    var objStore = db.createObjectStore("currency", { keyPath: 'currency' });
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
      var cur = `${from}_${to}`;
      //var amount = document.getElementById('amount').value;
      //var toamount = document.getElementById('toamount').value;
      var convrate = document.getElementById('convrate').value;
      //var toamount = parseInt(document.getElementById('to').value) * parseInt(document.getElementById('txtqty').value);
      //S4: Add the values against each keypath on object store
      var saveOperation = tbl.add({
       "currency": cur,
        //"amount":amount,
        //"toamount":toamount,
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
       
       return currStore.complete;
      };
    }
    }

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
