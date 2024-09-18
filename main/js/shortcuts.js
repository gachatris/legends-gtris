function $(gid) {
 ////console.log(gid, document.getElementById(gid))
 return document.getElementById(gid);
}

const id = $;


const elem = function(el, func) {
 let a = document.createElement(el);
 func(a);
};

const style = function(i, prop, val) {
 let a = $(i).style;
 if (a[prop] !== val) a[prop] = val;
};

const ih = function(i, val) {
 let a = $(i).innerHTML;
 if (a !== val) $(i).innerHTML = val;
};

const iha = function(i, val) {
 $(i).innerHTML += val;
};

const ihelem = function(i, val) {
 let a = i.innerHTML;
 if (a !== val) i.innerHTML = val;
};

const createSVG = function (width, height, innerhtml) {
  let a = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  a.setAttribute("width", width);
  a.setAttribute("height", height);
 
  //a.innerHTML = innerhtml;
  a.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  return a;
}

const ihaelem = function(i, val) {
 i.innerHTML += val;
};
const styleelem = function(i, prop, val) {
 let a = i.style;
 if (a[prop] !== val) a[prop] = val;
};
const stylepropelem = function(i, prop, val) {
 i.style.setProperty(prop, val);
 
};

class ParkMillerPRNG {
 constructor() {
  this.seed = 1;
 }
 next() {
  return this.gen() / 2147483647;
 }
 gen() {
  return (this.seed = (this.seed * 16807) % 2147483647);
 }
}

const grid = function(x, y, val) {
 let a = [];
  for (let e = 0; e < x; e++) {
   a.push([]);
   for (var f = 0; f < y; f++) {
    a[e][f] = (val);
   }
  }
 return a;
}

const getCanvasCtx = function(canvas) {
	return canvas.getContext("2d");
}
const clientRect = function(f, type) {
 return $(f).getBoundingClientRect()[type];
}
const asyncPromise = function(func) {
 return new Promise((res, rej) => {
  func(res, rej);
 });
};

const arrayModifyBatch = function(arr, func) {
  let j = arr;
  for (let h = 0, b = j.length; h < b; h++) {
   func(j[h]);
  }
 };
 
function bezier(t, start, end, initial, p1, p2, final) {
  return start + ((end - start) * ((1 - t) * (1 - t) * (1 - t) * initial +
   3 * (1 - t) * (1 - t) * t * p1 +
   3 * (1 - t) * t * t * p2 +
   t * t * t * final));
}

function sortRandomInt(array, randint) {
	for (var i = 0; i < array.length - 1; i++)
{
	var temp = array[i];
	var rand = ~~((array.length - i) * randint()) + i;
	array[i] = array[rand];
	array[rand] = temp;
};
}

function step(x, ratio, min) {
 let m = ~~(x / (1/ratio))
 
 return min + (m / ratio);
}

function radians(deg) {
 return deg * (Math.PI/180);
}

function degrees(rad) {
 return rad * (Math.PI/180);
}

function hexToRGB(hex) {
	let b = hex % 0x000100;
	let g = ~~((hex % 0x010000) / 0x000100);
	let r = ~~((hex % 0x01000000) / 0x010000);
	return {
		r: r,
		g: g,
		b: b,
	}
}

////console.log((0xffFFffffffffffffffffff), Number.MAX_SAFE_INTEGER)

class ArrayFunctionIterator {
 constructor(func) {
  this.arr = [];
  this.func = func;
 }
 update() {
  this.func(this.arr);
 }
 addItem(item) {
  this.arr.push(item);
 }
 getItem(index) {
 	return this.arr[index];
 }
 reset() {
  this.arr = [];
 }
}

class ObjectFunctionIterator {
 constructor(func) {
  this.obj = {};
  this.func = func;
 }
 update() {
  this.func(this.obj);
 }
 addItem(key, item) {
  this.obj[key] = item;;
 }
 getItem(key) {
 	return this.obj[key];
 }
 
 remove(key) {
  delete this.obj[key];
 }
 
 reset() {
  for (let h in this.obj) {
   delete this.obj[h];
  }
 }
}

class NumberChangeFuncExec {
 constructor(a, func) {
  this.a = a;
  this.last = a;
  this.func = (m, arg) => {
   func(m, arg);
  };
  
 }
 add(num, arg) {
  this.a += num;
  if (this.a !== this.last) {
   this.last = this.a;
   this.func(this.a, arg);
  }
 }
 assign(val, arg) {
  if (val !== this.a) {
   this.a = val;
   this.last = this.a;
   this.func(this.a, arg);
  }
 }
 execute(arg) {
  this.func(this.a, arg);
 }
 getNumber () {
  return this.a;
 }
}

class ChangeFuncExec {
 constructor(a, func) {
  this.a = a;
  this.last = a;
  this.func = (m, arg) => {
   func(m, arg);
  };
  
 }
 assign(val, arg) {
  if (val !== this.a) {
   this.a = val;
   this.last = this.a;
   this.func(this.a, arg);
  }
 }
 execute(arg) {
  this.func(this.a, arg);
 }
 getA () {
  return this.a;
 }
}

class MeterBar extends NumberChangeFuncExec {
 #bar;
 #meter;
 constructor() {
  super(0, (a) => {
   for (let m of this.#bar) styleelem(m, `height`, `${Math.max(0, (this.height * (1 - a)))}px`);
  });
  this.cellSize = 0;
  this.isEnable = false;
 }
 resize(cellSize, w, h) {
  this.cellSize = cellSize;
  this.width = this.cellSize * w;
  this.height = this.cellSize * h;
  for (let a of [this.#meter]) {
   styleelem(a, "width", `${this.width}px`);
   styleelem(a, "height", `${this.height}px`);
  }
  for (let m of this.#bar) styleelem(m, `height`, `${Math.max(0, (this.height * (1 - this.a)))}px`);
 }

 toggle(bool) {
  this.isEnable = bool;
  styleelem(this.#meter, `opacity`, this.isEnable ? "100%": "0%");
 }


 initialize(meter, bar) {
  this.#meter = meter;
  this.#bar = bar;
 }
}

class MultipleMeterBar {
 #bars;
 #meter;
 #ClusteredBar = class {
  constructor(parent) {
   this.parent = parent;
   this.bar = document.createElement("GTRIS-NONR");
  this.base = new NumberChangeFuncExec(0, (a) => {
   styleelem(this.bar, `height`, `${Math.max(0, (this.parent.height * (1 - a)))}px`);
  });

  }
 }
 constructor(num) {
  this.cellSize = 0;
  this.#bars = [];
  
  this.width = this.cellSize * 1;
  this.height = this.cellSize * 1;  
  this.isEnable = false;
  for (let h = 0; h < num; h++) {
   this.#bars[h] = new this.#ClusteredBar(this);
  }  
 }
 toggle(bool) {
  this.isEnable = bool;
  styleelem(this.#meter, `opacity`, this.isEnable ? "100%": "0%");
 }
 resize(cellSize, w, h) {
  this.cellSize = cellSize;
  this.width = this.cellSize * w;
  this.height = this.cellSize * h;
  for (let a of [this.#meter]) {
   styleelem(a, "width", `${this.width}px`);
   styleelem(a, "height", `${this.height}px`);
  }
  for (let m of this.#bars) styleelem(m.bar, `height`, `${Math.max(0, (this.height * (1 - m.base.a)))}px`);
 }

 initialize(meter, bar) {
  this.#meter = meter;
  //this.#bars = bar;
  let i = 0;
  for (let h of bar) {
   this.#bars[i].bar = h;
   i++;
  }
 }
 assign(am) {
  
  for (let h = 0; h < am.length; h++) {
   this.#bars[h].base.assign(am[h]);
  }  
  
 }
}

class GIFRenderer {
 #canvas;
 #ctx;
 #target;
 constructor(width, height, frameWidth, frameHeight, fps, func, updateFunc, isLoop) {
  //this.#canvas = new OffscreenCanvas(width, height);
  //this.#ctx = this.#canvas.getContext("2d");
  this.images = [];
  this.frame = {
   x: 0,
   y: 0,
   w: frameWidth,
   h: frameHeight,
  };
  this.dim = {
   w: width,
   h: height
  };
  this.origDim = {
   w: width,
   h: height
  };
  this.frameCount = 0;
  this.actualFrames = 0;
  this.func = func;
  this.func2 = updateFunc;
  this.fps = fps;
  this.frameDelay = fps;
  this.enabled = false;
  this.isLoop = isLoop;
  
  /*this.#canvas.convertToBlob().then(res => {
   let a = document.createElement("a");
   a.download = Date.now() + "rawlead.png";
   a.href = URL.createObjectURL(res);
   a.click();
  })*/
  
 }
 initialize(target) {
  this.#target = target;
 }
 loadImages(arr) {
  let len = arr.length;
  this.dim.h = this.origDim.h * len;
  //this.#canvas.width = this.dim.w;
  //this.#canvas.height = this.dim.h;
  let count = 0;
  for (let e of arr) {
   //this.#ctx.drawImage(e, 0, 0, this.origDim.w, this.origDim.h, 0, this.origDim.h * count, this.origDim.w, this.origDim.h);
   this.images.push(e);
   count++;
  }
  
  
  /*let test = new OffscreenCanvas(this.frame.w, this.frame.h);
  let testCtx = test.getContext("2d");
  testCtx.drawImage(this.#canvas, 0, 0, this.frame.w, this.frame.h);*/
  
  /*this.#canvas.convertToBlob().then(res => {
   let a = document.createElement("a");
   a.download = Date.now() + "rawlead.png";
   a.href = URL.createObjectURL(res);
   a.click();
  })*/
 }
 
 getCanvas() {
  return this.#canvas;
 }

 run() {
  if (!this.enabled) return;
  this.actualFrames++;
  if (this.frameDelay > 0) {
   this.frameDelay--;
  } else {
   this.frameDelay = this.fps;
   this.func(this.#target, this.images[this.frame.y], this.frame.x, 0, this.frame.w, this.frame.h, this.frameCount, this);
  }
  if (this.func2 !== void 0) this.func2(this.actualFrames);
  if (this.isLoop) {
   this.actualFrames = 0;
  }
 }

 exec(y, x) {
  this.enabled = true;
  this.frame.x = x || 0;
  this.frame.y = y;
  this.frameDelay = this.fps;
  this.frameCount = 0;
  this.actualFrames = 0;
 }
 immediateExec(y) {
  this.enabled = true;
  this.frame.x = 0;
  this.frame.y = y;
  this.frameDelay = this.fps;
  this.frameCount = 0;
  this.actualFrames = 0;
  this.run();
 }
}

class FrameRenderer {
 constructor(initial, max, func, addFunc, loop) {
  this.inititalFrame = initial;
  this.frame = initial;
  this.maxFrame = max;
  this.func = func;
  this.enabled = false;
  this.addFunc = addFunc;
  this.isLoop = loop|| false;
 }
 run() {
  if (!this.enabled) return;

  this.func(this.frame, this.maxFrame, this);
  if (typeof this.addFunc !== "undefined") this.addFunc();
  this.frame++;
  if (this.frame >= this.maxFrame) {
   if (this.isLoop) {
    this.frame = 0;
   } else {
   this.enabled = false;
   }
  }

 }
 
 setFrame(max) {
 	this.maxFrame = max;
 }
 reset(initial) {
  this.frame = initial !== void 0 ? initial : this.inititalFrame;
  this.enabled = true;
 }
 toggleEnable(bool) {
  this.enabled = bool;
 }
}

class EndlessFrameRenderer {
 constructor(initial, max, func, addFunc, loop) {
  this.inititalFrame = initial;
  this.frame = initial;
  this.maxFrame = max;
  this.func = func;
  this.enabled = false;
  this.addFunc = addFunc;
  this.isLoop = loop|| false;
 }
 run() {
  if (!this.enabled) return;

  this.func(this.frame, this.maxFrame, this);
  if (typeof this.addFunc !== "undefined") this.addFunc();
  this.frame++;
  if (this.frame >= this.maxFrame) {
   if (this.isLoop) {
    this.frame = 0;
   } else {
   this.enabled = false;
   }
  }

 }
 
 setFrame(max) {
 	this.maxFrame = max;
 }
 reset(initial) {
  this.frame = initial !== void 0 ? initial : this.inititalFrame;
  this.enabled = true;
 }
 toggleEnable(bool) {
  this.enabled = bool;
 }
}

class AnimationFrameRenderer {
 constructor(element, initial, max, fps, param, addFunc) {
  this.param = param || {};
  let paramDel = "delay" in param ? param.delay : 0;
  this.a = new FrameRenderer(initial, max + paramDel, (frame, maxFrame) => {
   let tminus = maxFrame - Math.max(0,frame - paramDel);
   ////console.log("played pi")
   
   if (tminus >= 0) 
    styleelem(this.element, "animation-delay", `${~~((1000 / (60 * (-1))) * Math.min(maxFrame,Math.max(frame + 1 - paramDel, 1)))}ms`);
   
   
  }, addFunc,  "loop" in param ? param.loop : false);
  this.element = element;
  this.fps = fps;
  this.max = max;
  this.isLoop = "loop" in param ? param.loop : false;
  this.delay = paramDel;
  //styleelem(this.element, "opacity", `${this.param.opacity||0}%`);
  }
  
  play() {
   this.element.offsetHeight;
   styleelem(this.element, "animation-name", this.param.name);
   styleelem(this.element, "animation-duration", `${~~((this.fps) * (this.max))}ms`);
   styleelem(this.element, "animation-timing-function", this.param.timing);
   styleelem(this.element, "animation-iteration-count", this.isLoop ? "infinite" : "1");
   styleelem(this.element, "animation-play-state", "paused");
   this.a.reset();
   
  }
  run() {
   this.a.run();
  }
  setFrame(max) {
  	this.max = max;
  	this.a.setFrame(max + this.delay);
  }
  reset() {
   styleelem(this.element, "animation-name", "none");
   this.a.toggleEnable(false);
   
  }
}

class FrameRendererSet {
 constructor(arr, playName, stopName, runName) {
  this.obj = {};
  this.length = 0;
  this.names = [];
  for (let k = 0; k < arr.length; k++) {
   let ref = arr[k];
   this.length++;
   this.obj[ref.name] = ref.a;
   this.names.push(ref.name);
   
  }
  this.function = playName;
  this.malfunction = stopName;
  this.runfunction = runName;
 }
 play(name) {
  this.obj[name][this.function]();
 }
 stop(name) {
  this.obj[name][this.malfunction]();
 }
 stopAll() {
  for (let me = 0; me < this.length; me++) {
   let name = this.names[me];
   this.obj[name][this.malfunction]();
  }
 }
 
 run() {
  for (let me = 0; me < this.length; me++) {
   let name = this.names[me];
   this.obj[name][this.runfunction]();
  }
 }
}

class TextToHTMLLetterSeparator {
 constructor() {
  this.a = [];
  this.text = "";
 }
 
 setSeparatedText(element, text) {
  if (this.text === text) return null;
  if (!(element instanceof HTMLElement)) throw new DOMException("What the heck? Argument 'element' is not an HTMLElement.");
  this.a.length = 0;
  let a = text.split("");
  let em = element;
  let b = a.length;
  
  ihelem(em, "");
  
  for (let i = 0; i < b; i++) {
   let m = document.createElement("GTRIS-TS-LETTER");
   m.innerHTML = a[i] === " " ? "&nbsp" : a[i];
   styleelem(m, "display", "inline-block");
   //styleelem(m, "fontSize", `${Math.random()*38}px`);
   let am = `TTHTMLELEMENT-${btoa(Math.random() * Math.random() * 9)}`;
   m.id = am;
   //ihaelem(em, m.outerHTML);
  // this.a.push(document.getElementById(am));
   this.a.push(m);
  element.append(m);
  }
 }
}

class DateSynchronizedLoopHandler {
 constructor(fps, func) {
  this.actualFrames = 0;
  this.isRunning = false;
  this.fps = fps;
  this.startTime = 0;
  this.run = func;
  
  this.speed = 1;
  this.c = 0;
  
  this.isAsynchronous = false;
  this.confirmIsAsync = false;
 }
 
 #asyncRun() {
  if (!this.isRunning) return;
  this.c += this.speed;
  while (this.c >= 1) {
   try {
   this.run();
   }catch(e) {
    console.error(e, e.stack);
   }
   this.c--;
  }
  if (this.confirmIsAsync !== this.isAsynchronous) {
   this.isAsynchronous = this.confirmIsAsync;
   if (!this.isAsynchronous) this.startSyncLoop(true);
  }
  
  if (this.isAsynchronous) {
   window.requestAnimationFrame(() => {
    this.#asyncRun();
   });
  }
 }
 
 startSyncLoop(t) {
  if (this.isRunning && !t) return;
  this.startTime = Date.now();
  this.actualFrames = 0;
   
   this.interval = setInterval(() => {
    let syncTime = Math.floor((Date.now() - this.startTime)) / (1000 / this.fps);
    let syncFrames = syncTime - this.actualFrames;
    for (let i = 0; i < syncFrames && this.isRunning; i++, this.actualFrames++) {
     
     if (this.confirmIsAsync !== this.isAsynchronous) {
      this.isAsynchronous = this.confirmIsAsync;
      
      if (this.isAsynchronous) {
       clearInterval(this.interval);
       this.#asyncRun();
      }
     }
     this.c += this.speed;
     while (this.c >= 1) {
      this.run();
      this.c--;
     }
    }
   }, 1000 / this.fps);
 }
 
 start() {
  if (!this.isRunning) {
   
   if (this.isAsynchronous) {
    this.isRunning = true;
    this.#asyncRun();
    return;
   }
   
   this.startSyncLoop();
   this.isRunning = true;
  };
 }
 
 stop() {
  if (this.isRunning) {
   
   clearInterval(this.interval);
   this.isRunning = false;
   
  }
 }
 
 replaceRun(func) {
  this.run = func;
 }
}

class FunctionTimer {
 #NumberFunc = class{
 constructor(a, func) {
  this.a = a;
  this.last = a;
  this.func = (m, arg) => {
   func(m, arg);
  };
  
 }
 add(num, arg) {
  this.a += num;
  if (this.a !== this.last) {
   this.last = this.a;
   this.func(this.a, arg);
  }
 }
 assign(val, arg) {
  if (val !== this.a) {
   this.a = val;
   this.last = this.a;
   this.func(this.a, arg);
  }
 }
 execute(arg) {
  this.func(this.a, arg);
 }
}
 constructor(parent, func) {
  this.parent = parent;
  this.time = -9;
  this.max = 10 * 60;
  this.enabled = 0;
  this.func = new this.#NumberFunc(-99, (x) => {
   func(x, this.max);
  });
 }
 
 set(time) {
  this.time = time;
  if (this.enabled && this.time >= -1) this.func.assign(time);
 }
 setMax(max) {
  this.max = max;
  if (this.enabled && this.time >= -1) this.func.execute();
 }
 
 
 increment(add) {
  this.time += add;
 }
 
 update() {
  if (this.enabled && this.time >= -1) this.func.assign(this.time);
 }
 
}

class DOMTouchInteractivity {
 constructor(reference, func) {
  this.reference = reference;
  
  this.isActive = true;
  this.lastTouch = null;
  
  this.touchArr = {};
  this.func = (event) => {
   func(event);
  }
 }
 

 

 initialize() {
  var event = (e) => {
   if (((e.type == "touchstart") || (e.type == "touchmove") || (e.type == "touchend")) && (this.isActive)) {
    let length = e.touches.length;
    if (e.type === "touchstart") this.lastTouch = e.touches[length - 1];
    let existing = {};
    for (var touches = 0; touches < length; touches++) {
     let tX = e.touches[touches].pageX,
      tY = e.touches[touches].pageY;
     let name = e.touches[touches].identifier; //`x${tX}y${tY}`;
     existing[name] = true;
     if (!(name in this.touchArr)) {
      this.func({
       pageX: tX,
       pageY: tY,
       identifier: name,
       type: e.type,
       //preventDefault: e.preventDefault
      });

     }
    };

    for (let m in this.touchArr) {
     if (!(m in existing)) {
      if ("a" in this.touchArr[m] && this.touchArr[m].a.isPressed) {
       this.touchArr[m].a.func("touchend");
       this.touchArr[m].a.isPressed = false;
      }
      delete this.touchArr[m];
     } else {
      if ("a" in this.touchArr[m] && !this.touchArr[m].a.isPressed) {
       this.touchArr[m].a.func("touchstart");
       this.touchArr[m].a.isPressed = true;
      }
     }
    }




    //if (!game.isReplay) game.touchesPressed = 0;
    /*for (var touches = 0; touches <= length; touches++) {
    let count = 0;
     var tX = 0;
     var tY = 0;
     if (length !== 0 && e.touches[touches]) {
      tX = e.touches[touches].pageX;
      tY = e.touches[touches].pageY;
     } else {
      tX = this.lastTouch.pageX;
      tY = this.lastTouch.pageY;
     }
     for (var i in this.buttons) {
      var button = id(this.buttons[i].id),
       buttonClass = this.buttons[i];
      var buttonOffsetTop = clientRect(this.buttons[i].id, "y");
      var buttonOffsetLeft = clientRect(this.buttons[i].id, "x");
      var buttonOffsetHeight = clientRect(this.buttons[i].id, "height");
      var buttonOffsetWidth = clientRect(this.buttons[i].id, "width");
      ////console.log(tX, tY, e.type)
      if (
       tX >= buttonOffsetLeft && tX < buttonOffsetWidth + buttonOffsetLeft &&
       tY >= buttonOffsetTop && tY < buttonOffsetHeight + buttonOffsetTop &&
       buttonClass.active && buttonClass.isWholeActive && buttonClass.isControllerActive &&
       buttonClass.isNotReplayToShow
      ) {
       if (e.type == "touchstart") style(buttonClass.id, "opacity", "100%");
       if (e.type == "touchend") style(buttonClass.id, "opacity", "75%");
       if (((e.type == "touchstart") || e.type == "touchend") || (buttonClass.dragTap && e.type == "touchmove")) {
        if (e.type === "touchstart" && !buttonClass.isPressed) {
         buttonClass.isPressed = true;
         buttonClass.func(e.type);
        }
        
       }
      } else {
       style(buttonClass.id, "opacity", "75%");
        if ( buttonClass.isPressed) {
         buttonClass.isPressed = false;
         buttonClass.func(e.type);
        }
      }
     }
    }/**/
   }
  };
  
  
  for (let p of ["start", "end"]) this.reference.addEventListener(`touch${p}`, e => event(e), false);
  //console.log(this.reference)
 }
};
/*let hshsh = new TextToHTMLLetterSeparator();
hshsh.setSeparatedText(document.documentElement, "WTF LOL");
//console.log(hshsh)*/ 