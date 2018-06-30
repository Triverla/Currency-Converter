
let loadCurrencies = () => {
    //From dropdown button
    let dropdown = document.getElementById('from');
    dropdown.length = 0;
    
    let defaultOption = document.createElement('option');
    defaultOption.text = 'Convert From';
    
    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;
//To dropdown button
    let dropdown2 = document.getElementById('to');
    dropdown2.length = 0;
    
    let defaultOption2 = document.createElement('option');
    defaultOption2.text = 'Convert To';
    
    dropdown2.add(defaultOption2);
    dropdown2.selectedIndex = 0;
    
    const url = 'https://free.currencyconverterapi.com/api/v5/currencies';
    
    fetch(url)  
      .then(  
        (response) => {  
          if (response.status !== 200) {  
            console.log('Looks like there was a problem. Status Code: ' + 
              response.status);  
            return;  
          }
    
          // Examine the text in the response  
          response.json().then((results) => {  
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
          });  
        }  
      )  
      .catch((err) => {  
        console.error('Fetch Error -', err);  
      });
    }

    const convertCurrency = () => {
      let from            =   document.getElementById("from").value;
      let to              =   document.getElementById("to").value;
      let amount      =   document.getElementById("amount").value;
      let toamount        =   document.getElementById("toamount");
      let amountVal = document.getElementById('amount');
      let convrate = document.getElementById('convrate');
     
      fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${from}_${to}&compact=ultra`).then((response)=> {
         return response.json();
         }).then((rates) => {
            for(let rate in rates){
              console.log(rates[rate]); //rate of currency to be converted to
              let calc = rates[rate]; //rate being pass back to object to get the value
              convrate.value = calc.toFixed(2); //to dispay conversion rate
              let total = (calc * amount); 
              console.log(total);//display calculated result
              toamount.value = total.toFixed(2);
              amountVal.value = amount;
            }
         });
     }

     const getRate = () =>{
      let request = indexedDB.open('currency-rate', 1);
      request.onupgradeneeded = (event) => {

      var db = event.target.result;

      // Create an object store called "currency"    
      var store = db.createObjectStore("currency", { keyPath: 'from' });
      }
      if (request) {
        request.onsuccess = function (e) {
          //var objectStore = e.target.result.createObjectStore("name", { keyPath: "myKey" });
        //S1: Get the Transaction for the ObjectStore, here in this case it is for readwrite 
        var currStore = e.target.result.transaction('currency', "readwrite");
        //S2: Get the object store object
        var tbl = currStore.objectStore('currency');

      let from            =   document.getElementById("from").value;
      let to              =   document.getElementById("to").value;
      fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${from}_${to}&compact=ultra`).then((response)=> {
         return response.json();
         }).then((rates) => {
            for(let rate in rates){
              console.log(rates[rate]); //rate of currency to be converted to
              let calc = rates[rate]; //rate being pass back to object to get the value
              let saveOperation = tbl.add({
              "currrency": from ,
              "rate": calc,
              });
              saveOperation.onsuccess = e => {
               console.log('Save to indexDb: ',e.target.result)
               };
               saveOperation.onerror = e => {
                console.log('Save to indexDb: ',e.value)
               };
               
               return currStore.complete;
              };
              });
              
             }
             
                  
                }
     }
    
