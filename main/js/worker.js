const multithread = new class {

 #importScripts = `
importScripts("<{IMPORT_URL}>");

onmessage = (d) => {
 let result = _eval(d.data);
 postMessage(result);
}
 `;

 #workers = {};

 #$BTOBASE64(blob, call) {
  var reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = function() {
   var base64 = reader.result;
   call(base64);
  }
 }

 constructor() {}
 engageWorker(name, impscrtext, on) {
  if (this.#workers?.[name]) {
   if (this.#workers[name].worker instanceof Worker) {
    this.#workers[name].worker.terminate();
   }
  }
  this.#workers[name] = {
   worker: {
    postMessage: () => {},
   },
   base64: ""
  };

  let f = new Blob([impscrtext], { type: 'text/plain' });
  this.#$BTOBASE64(f, blobA => {
   ////console.log(blobA);
   let blobABlob = new Blob([blobA], { type: 'text/plain' });
   let blobAURL = URL.createObjectURL(f);
   let blobAText = this.#importScripts.replace("<{IMPORT_URL}>", blobAURL);

   let fw = new Blob([blobAText], { type: 'text/plain' });
   let fwe = URL.createObjectURL(fw);
   this.#workers[name].base64 = blobA;
   this.#workers[name].worker = new Worker(fwe);
   this.#workers[name].worker.onerror = (e) => {
   	//console.log(name, e.message, arguments);
   }
   on(this.#workers[name]);
  });
  return this.#workers[name];
 }


 stopAll() {
  for (let w in this.#workers) {
   this.#workers[w].worker.terminate();
  }
 }
}

