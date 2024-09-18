const sound = new class {
 constructor() {
  this.sounds = {};
  this.isReady = false;
  this.soundNames = {};
  this.volume = 100;
  this.bytes = 0;
 }
 load(filename, required) {
  let direct = `/assets/sounds/game/${filename}/init.json`;
  this.isReady = false;
  return new Promise(async (res, rej) => {
   if (direct in this.soundNames) {
    res();
    this.isReady = true;
    return;
   }
   let loaded = 0;
   let loadLength = 0;
   let a = JSON.parse(await load(direct, "text"));
   this.soundNames[direct] = a;
   let storage = {};

   for (let b in a.sources.main) {
    let reference = a.sources.main[b];
    ////console.log(reference);
    storage[b] = await load(`/assets/sounds/game/${filename}/${reference}`, "blob");
   }
   for (let b = 1; b <= a.sources.chain.count; b++) {
    let reference = a.sources.chain.src;
    let name = `${a.sources.chain.name}${b}`;
    ////console.log(reference);
    let directory = `/assets/sounds/game/${filename}/${reference}${b}.${a.sources.chain.filetype}`;


    storage[name] = await load(directory, "blob");
    let blob = URL.createObjectURL(storage[name]);
    ////console.log(storage[name])
    this.sounds[name] = new MainHowler.Howl({
     src: blob,
     format: "ogg",
     loop: false,
     preload: false
    });
    loadLength++;
   }
   
   if ("swapcombo" in a.sources) for (let b = 1; b <= a.sources.swapcombo.count; b++) {
    let reference = a.sources.swapcombo.src;
    let name = `${a.sources.swapcombo.name}${b}`;
    ////console.log(reference);
    let directory = `/assets/sounds/game/${filename}/${reference}${b}.${a.sources.swapcombo.filetype}`;


    storage[name] = await load(directory, "blob");
    let blob = URL.createObjectURL(storage[name]);
    ////console.log(storage[name])
    this.sounds[name] = new MainHowler.Howl({
     src: blob,
     format: "ogg",
     loop: false,
     preload: false
    });
    loadLength++;
   }

   for (let b in a.sounds) {
    let reference = a.sounds[b];
    //this.bytes += storage[reference.src].size;
    let blob = URL.createObjectURL(storage[reference.src]);
    this.sounds[b] = new MainHowler.Howl({
     src: blob,
     format: "ogg",
     loop: reference.loop,
     preload: false
    });
    loadLength++;
   }
   
   

   for (let m in this.sounds) {
    this.sounds[m].load();
    /*for (let r of ["load", "loaderror"]) this.sounds[m].once(r, () => {
     loaded++;
     ////console.log(r)
     if (loaded >= loadLength) { 
     	this.isReady = true;
    	this.volumeSet(this.volume);
      res();
      }
    });*/
    loaded++;
     ////console.log(r)
     if (loaded >= loadLength) { 
     	this.isReady = true;
    	this.volumeSet(this.volume);	
    	//console.log(this.bytes / (1024*1024))
      res();
      }
   }


  });
 }
 
 stop(str) {
  if (str in this.sounds) {
   this.sounds[str].stop();
   
  }
 }
 
 getSound(str) {
 	return this.sounds[str];
 }
 
 play(str) {
 	let id = 0;
  if (str in this.sounds) {
   //this.sounds[str].stop();
   //console.log(this.sounds[str]._sounds.length)
   	id = (this.sounds[str].play());
   	
  }
  return id;
 }
 
 rate(str, value) {
  if (str in this.sounds) {
   //this.sounds[str].stop();
   
   this.sounds[str].rate(value !== void 0 ? value : 1);
   ////console.log(this.sounds[str])
  }
 }
 
 volumeSet(value) {
 	this.volume = value;
  for (let str in this.sounds) {
   //this.sounds[str].stop();
   
   this.sounds[str].volume(value / 100);
   ////console.log(this.sounds[str])
  }
 }
}();


class GTRISSoundObject {
 constructor(obj) {
  this.doc = document.createElement("audio");
  this._volume = obj.volume || 0;
  this._loop = obj.loop || false;
  this._src = obj.src || "";
  this.doc.src = this._src;
  this.doc.volume = this._volume;
  this.doc.loop = this._loop;
  if (obj.preload) this.doc.load();
 }
 load() {
  this.doc.load();
 }
 play(seek) {
  this.doc.currentTime = seek || 0;
  this.doc.play()
   .catch(e => {
    console.error(`GTRISSoundObject object with the source destination "${this._src}" cannot play a non-existent sound file.`);
   });
 };
 stop() {
  this.doc.pause();
 }
 once(evt, func) {
  this.doc.addEventListener(evt, func, { once: true });
 }
 volume(v) {
  this._volume = v;
  this.doc.volume = v;
 }
 rate(e) {}
}