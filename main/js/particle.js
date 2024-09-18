class ObjectParticle {
 constructor(duration, imgRef, spriteRow, spriteCol, startX, startY, endX, endY, size, color, bezier, isOpaqueTrail, trailOptions, rotateOptions) {
  this.x = startX;
  this.y = startY;
  this.startX = startX;
  this.startY = startY;
  this.spriteCell = spriteCol;
  this.spriteRow = spriteRow;
  this.endX = endX;
  this.endY = endY;
  this.duration = duration;
  this.rotate = {
  	speed: 0,
  	pos: 0,
  	type: "free",
  	
  };
  if (typeof rotateOptions === "object") {
  	for (let y in rotateOptions) {
  		if (y in this.rotate) {
  			this.rotate[y] = rotateOptions[y];
  		}
  	}
  }
  this.size = size;
  this.maxDuration = duration;
  this.elapsed = 0;
  this.type = "none";
  this.color = {
   r: color.r,
   g: color.g,
   b: color.b
  };
  this.color.isRandom = color == "random";
  this.bezier = bezier;
  this.isOpaqueTrail = isOpaqueTrail || false;
  this.isBasic = false;
  if (this.type === "randomEase") {
   this.random1 = (Math.random() * 2);
   this.random2 = (Math.random() * 2);
  }
  this.trailArr = 0;
  this.trailFrame = 30;
  this.trailColor = {
   r: 255,
   g: 255,
   b: 255
  };
  if (isOpaqueTrail) {
   this.trailArr = [];
   this.trailFrame = ("frame" in trailOptions) ? trailOptions.frame : 30;

   this.trailColor.r = ("r" in trailOptions) ? trailOptions.r : 255;
   this.trailColor.g = ("g" in trailOptions) ? trailOptions.g : 255;
   this.trailColor.b = ("b" in trailOptions) ? trailOptions.b : 255;
   ////console.log(this.trailColor)
  }
  
  this.imgRef = imgRef;

 };
 update() {
  this.duration--;
  this.elapsed++;
  
  
  let fromX = this.x;
  let fromY = this.y;
  this.x = this.startX + ((this.endX - this.startX) * this.bezierFunc(this.duration / this.maxDuration,
   this.bezier.x1,
   this.bezier.x2,
   this.bezier.x3,
   this.bezier.x4));
  this.y = this.startY + ((this.endY - this.startY) * this.bezierFunc(this.duration / this.maxDuration,
   this.bezier.y1,
   this.bezier.y2,
   this.bezier.y3,
   this.bezier.y4));
  let toX = this.x;
  let toY = this.y;

  if (this.isOpaqueTrail) {


   ////console.log("trail")
   let len = this.trailArr.length;

   for (let h = 0; h < len; h++) {
    let ref = this.trailArr[h];


    //ref.frame--;
    if (ref.frame > 0) {
     ref.frame -= particle.refreshRate * 2;
     if (ref.frame <= 0) ref.frame = 0;
    } else {
     this.trailArr.splice(h, 1);
     len--;
     h--;

    }
   }

   if (this.duration >= 0) this.trailArr.push(new ObjectTrail({
    x1: fromX + (this.size / 2),
    y1: fromY + (this.size / 2),
    x2: toX + (this.size / 2),
    y2: toY + (this.size / 2)
   }, this.trailFrame))
  }
  this.rotate.pos += this.rotate.speed; 
  /*
  if (this.type == "linear") {
   this.x = this.startX + ((this.endX - this.startX) * (this.duration / this.maxDuration));
   this.y = this.startY + ((this.endY - this.startY) * (this.duration / this.maxDuration));
  } else if (this.type == "ease") {
   this.y = (this.bezier(
    this.duration / this.maxDuration,
    this.startY,
    this.startY * 1.2,
    this.endY * 1.9,
    this.endY
   ));
   this.x = this.startX + ((this.endX - this.startX) * (this.duration / this.maxDuration));
  } else if (this.type == "ease2") {
   this.x = this.startX + ((this.endX - this.startX) * this.bezier(this.duration / this.maxDuration,
    0,
    0.8,
    1,
    1));
   this.y = this.startY + ((this.endY - this.startY) * this.bezier(this.duration / this.maxDuration,
    0,
    1,
    1,
    1));
  } else if (this.type == "hardDrop") {
   this.x = this.startX + ((this.endX - this.startX) * this.bezier(this.duration / this.maxDuration,
    0,
    0,
    0,
    1));
   this.y = this.startY + ((this.endY - this.startY) * this.bezier(this.duration / this.maxDuration,
    0,
    0,
    0,
    1));
  } else if (this.type == "randomEase") {
   this.x = this.startX + ((this.endX - this.startX) * this.bezier(this.duration / this.maxDuration,
    0,
    this.random1,
    this.random2,
    1));
   this.y = this.startY + ((this.endY - this.startY) * this.bezier(this.duration / this.maxDuration,
    0,
    1,
    1,
    1));
  } else if (this.type == "fall") {
   this.x = this.startX + ((this.endX - this.startX) * this.duration / this.maxDuration);
   this.y = this.startY + ((this.endY - this.startY) * this.bezier(this.duration / this.maxDuration,
    0,
    0,
    1,
    1));
  }
  */
 };
 getX() {
  return this.x;
 };
 getY() {
  return this.y;
 }
 opacityFade() {
  return (Math.min(1, (this.duration * 2.5) / this.maxDuration));
 }
 basicParticle(ctx) {
  let size = this.size * game.cellSize * 0.2;
  let color = !this.color.isRandom ? this.color : {
   r: ~~(Math.random() * 255),
   g: ~~(Math.random() * 255),
   b: ~~(Math.random() * 255)
  };
  ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${Math.floor(Math.min(100, (this.duration * 250) / this.maxDuration))}%`;
  //ctx.arc(this.x, this.y, size, 0, 2 * Math.PI, 0);
  //ctx.fill();
  ctx.fillRect(this.x, this.y, size, size);
 }
 bezierFunc(t, initial, p1, p2, final) {
  return (1 - t) * (1 - t) * (1 - t) * initial +
   3 * (1 - t) * (1 - t) * t * p1 +
   3 * (1 - t) * t * t * p2 +
   t * t * t * final;
 }
}

class ObjectTrail {
 constructor(param, frame) {
  this.x1 = param.x1 || 0,
   this.y1 = param.y1 || 0,
   this.x2 = param.x2 || 0,
   this.y2 = param.y2 || 0;

  this.distanceX = this.x1 - this.x2;
  ////console.log(this.x1)
  this.distanceY = this.y1 - this.y2;

  this.angle = Math.atan(this.distanceY / (this.distanceX || 0.000001)); // to prevent div by 0
  //this.angleY = Math.atan(this.distanceX/(this.distanceY || 0.000001))); // to prevent div by 0

  this.frame = frame || 30;
  this.frameMax = this.frame;
  this.width = (param.width / 2) || 3;
  this.maxWidth = this.width;


 }
 static changePos(x, y) {
  let x1 = this.x2;
  let y1 = this.y2;

  this.x1 = x1 || 0,
   this.y1 = y1 || 0,
   this.x2 = x || 0,
   this.y2 = y || 0;

  this.distanceX = this.x2 - this.x1;
  this.distanceY = this.y2 - this.y1;

  this.angleX = Math.tan(Math.arctan(this.distanceY / (this.distanceX || 0.000001))); // to prevent div by 0
  this.angleY = Math.tan(Math.arctan(this.distanceX / (this.distanceY || 0.000001))); // to prevent div by 0

 }
}

class ParticleImage {
	constructor (imgRef, cw, ch) {
		this.a = imgRef;
		this.cw = cw;
		this.ch = ch;
	}
}

const particle = new class {
 constructor() {
  this.refreshRate = 1;
  this.canvas = id("PARTICLE-PARTICLE-CANVAS");
  this.ctx = this.canvas.getContext("2d");
  this.canvas2;
  this.canvas3;
  elem("CANVAS", (e) => {
   this.canvas2 = e;
  });
  elem("CANVAS", (e) => {
   this.canvas3 = e;
  });
  this.ctx2 = this.canvas2.getContext("2d");
  this.ctx3 = this.canvas3.getContext("2d");
  this.intrv = 10;
  this.images = {};
  this.particles = [];
  this.isClear = false;
  
 }

 refresh() {
  if (this.intrv < 0) {
   this.clear(this.ctx);
   
   animatedLayers.run();
   
   for (let dh = 0; dh < this.refreshRate; dh++) {
    this.intrv = -1;
    //this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    if (this.particles.length > 0) {



     for (let i = 0, len = this.particles.length; i < len; i++) {
      if (typeof this.particles[i] !== "undefined") {
       this.particles[i].update();
       let reference = this.particles[i];
       if (!this.particles[i].isBasic) {
        if (reference.isOpaqueTrail) {
         let path = this.ctx.beginPath();

         let len = reference.trailArr.length;


         for (let h = 0; h < len; h++) {
          let ref = reference.trailArr[h];

          //ref.x2 + (Math.sin(ref.angle) * (ref.width * (quot)));

          ////console.log()//ref.y2 + (ref.angleY * (ref.width * (quot))))
          let quot = Math.min((ref.frame / ref.frameMax) * 2, 1);
          
          if (h == 0) this.ctx.moveTo(ref.x2 + (Math.sin(ref.angle) * (ref.width * (quot))), ref.y2 + (Math.cos(ref.angle) * (-ref.width * (quot))));

          else this.ctx.lineTo(ref.x2 + (Math.sin(ref.angle) * (ref.width * (quot))), ref.y2 + (Math.cos(ref.angle) * (-ref.width * (quot))));

         }
         for (let h = len - 1; h >= 0; h--) {
          let ref = reference.trailArr[h];
          let quot = Math.min((ref.frame / ref.frameMax) * 2, 1);

          this.ctx.lineTo(ref.x2 + (Math.sin(ref.angle) * (-ref.width * (quot))), ref.y2 + (Math.cos(ref.angle) * (ref.width * (quot))));

         }
         this.ctx.closePath();
         this.ctx.fillStyle = `rgb(${reference.trailColor.r},${reference.trailColor.g},${reference.trailColor.b})`;
         //let path = new Path2D(string);
         this.ctx.fill();
        }


        this.dynamicDraw(
        	game.cellSize,
        	this.particles[i].imgRef,
         this.particles[i].getX(),
         this.particles[i].getY(),
         this.particles[i].spriteRow,
         this.particles[i].spriteCell,
         this.particles[i].duration > 0 ? this.particles[i].size : 0,
         this.particles[i].rotate.pos
        );
       } else {
        this.particles[i].basicParticle(this.ctx);
       }
       if (this.particles[i].duration < -30) {
        this.particles.splice(i, 1);
        len--;
        i--
       }
      }
      this.isClear = false;
     }

     //this.ctx.drawImage(this.canvas2, 0, 0, this.canvas.width, this.canvas.height);

    } else {
     if (!this.isClear) {
      //this.clear(this.ctx);
      this.clear(this.ctx2);
      this.isClear = true;
     }
    }
   }

   /*let mhn = this.ctx3.getImageData(0,0,this.canvas3.width, this.canvas3.height);
   for (let p = 3; p < mhn.data.length; p += 4) {
     if (mhn.data[p] < 50) mhn.data[p] = 0;
    }
    this.ctx3.putImageData(mhn, 0, 0);*/
   
  } else {
   this.intrv--;
  }

 }
 
 addImage(name, image, w, h) {
 	this.images[name] = new ParticleImage(image, w, h);
 }

 addParticle(cellSize, imgRef, spriteRow, spriteCell, startX, startY, endX, endY, duration, size, clr, bez, isTrail, trailOptions, rotateOptions) {
  let color = clr ? clr : {
   r: 255,
   g: 255,
   b: 255
  };

  this.particles.push(new ObjectParticle(
  	duration * this.refreshRate, 
  	imgRef,
  spriteRow, 
  spriteCell, 
  endX - ((size * cellSize) / 2),
  endY - ((size * cellSize) / 2), 
  startX - ((size * cellSize) / 2), 
  startY - ((size * cellSize) / 2),
  size * cellSize,
  color,
  bez, 
  isTrail, 
  trailOptions,
  rotateOptions));
 };

 customDraw(img, sx, sy, sw, sh, x, y, w, h) {
  this.ctx2.drawImage(img, sx, sy, sw, sh, x, y, w, h);
 }

 dynamicDraw(cs, _img, x, y, r, cell, size, deg) {
  x = ~~x;
  let row;
  //let cs = game.cellSize
  let img = this.images[_img];
  let type = img.a;

  if (r == 1 || true) {
   type = img.a;
   row = r;
  }/*
  this.ctx.drawImage(
   type,
   cell * img.cw,
   row * img.ch,
   img.cw,
   img.ch,
   x,
   y,
   size,
   size,
  );*/
  /*let m = this.ctx2.getImageData(0, 0, this.canvas2.width,
    this.canvas2.height);
  
  for (let a = 3, length = m.length; a < length; a += 4) {
   if (m[a] < 100 && m[a] !== 0) m[a] = 0;
  }
  this.ctx2.putImageData(m,0,0)*/
  
  this.ctx.save();
this.ctx.translate(x + size / 2, y + size / 2);
this.ctx.rotate((Math.PI / 2) * (deg / 360));
this.ctx.drawImage(type,
	cell * img.cw,
   row * img.ch,
   img.cw,
   img.ch, -size / 2, -size / 2, size, size);
this.ctx.restore();
 };

 size(w, h) {
  this.canvas.width = w;
  this.canvas.height = h;
  this.canvas2.width = w;
  this.canvas2.height = h;
  this.canvas3.width = w;
  this.canvas3.height = h;

 }

 clear(context) {
  context.clearRect(
   0,
   0,
   context.canvas.width,
   context.canvas.height
  )
 }


}();

const animatedLayers = new class {
 #Image = class {
  constructor(w, h) {
   this.a = new OffscreenCanvas(w, h);
   this.w = w;
   this.h = h;
   this.ctx = this.a.getContext("2d");
  }
  load(img) {
   this.ctx.drawImage(img, 0, 0, this.w, this.h);
  }
 }
 #ObjectLayer = class {
  constructor(frame, posX, posY, imgX, imgY, frameW, frameH, boundX, speed, img, centerPos, lp, paused, opacity) {
   this.pos = {
    x: posX,
    y: posY
   };
   this.offsetPos = {
    frame: 0,
    frameMax: 0,
    x: posX,
    y: posY
   };
   this.img = {
    w: imgX,
    h: imgY
   };
   
   this.opacity = {
    fromValue: 1,
    toValue: 1,
    max: -1,
    time: -1
   };

   this.frame = {
    w: frameW,
    h: frameH,
    int: frame,
    bound: boundX,
    elapsed: 0,
    max: frame,
    rate: speed
   };
   this.a = img;
   this.sizeMult = 1;
   //this.fixedSize = sizeFixed;
   this.centerPos = {
    y: 0,
    x: 0
   };
   this.isSizeCustom = false;
   this.controllable = {

    on: false
   };
   this.loop = {};
   this.isPaused = paused;
   let loop = lp || {};
   this.loop.isOn = loop.isOn || false;
   this.loop.targetFrame = ("targetFrame" in loop) ? loop.targetFrame : frame;
   this.loop.resetFrame = loop.resetFrame || 0;
   //this.fixedSizeMult = 
   if (typeof centerPos === "object") {
    this.centerPos.x = centerPos.x;
    this.centerPos.y = centerPos.y;
    this.isSizeCustom = ("sizecustom" in centerPos) ? centerPos.sizecustom : 1;
    this.sizeMult = ("mult" in centerPos) ? centerPos.mult : 1;
   }
  }

  moveOffset(x0, y0, x1, y1, frame) {
   this.offsetPos.x = x0; //- (animatedLayers.cellSize * this.img.w / 2);
   this.offsetPos.y = y0; //- (animatedLayers.cellSize * this.img.h / 2);
   this.pos.x = x1; //- (animatedLayers.cellSize * this.img.w / 2);
   this.pos.y = y1; //- (animatedLayers.cellSize * this.img.h / 2);

   //this.pos.x
   this.offsetPos.frame = this.offsetPos.frameMax = frame || 0;
  }
  setFrame(frame) {
   let el = this;
   let decimal = el.frame.elapsed - ~~(el.frame.elapsed);
     
   el.frame.int = el.frame.max - (frame + decimal);
   el.frame.elapsed = frame + decimal;
  }
 };
 constructor(ctx) {
  this.cellSize = 0;
  this.ctx = ctx;
  this.images = [];
  this.main = new ObjectFunctionIterator((ob) => {
   let g = Object.keys(ob);
   let l = g.length;
   for (let h = 0; h < l; h++) {
    let el = ob[g[h]];
    
    let opacityDifference = 0;
    
    if (el.opacity.time <= 1 + el.opacity.max) {
     el.opacity.time++;
     if (el.opacity.max < el.opacity.time) el.opacity.time = el.opacity.max;
     opacityDifference = (el.opacity.toValue - el.opacity.fromValue) * ((el.opacity.max - el.opacity.time) / el.opacity.max);
    } else opacityDifference = 0;

    this.ctx.globalAlpha = el.opacity.toValue - opacityDifference;


    let mnx = el.pos.x;
    let mny = el.pos.y;
    if (el.offsetPos.frame >= 0) {
     el.offsetPos.frame--;
     mnx = el.pos.x + ((el.offsetPos.x - el.pos.x) * (el.offsetPos.frame / el.offsetPos.frameMax));
     mny = el.pos.y + ((el.offsetPos.y - el.pos.y) * (el.offsetPos.frame / el.offsetPos.frameMax));

    }
    
    let sizeMult = el.isSizeCustom ? el.sizeMult : this.cellSize * el.sizeMult;
    //this.ctx.fillStyle = "#835";
    
    this.ctx.drawImage(
     this.images[el.a].a,
    
     ~~(Math.floor(el.frame.elapsed) % el.frame.bound) * el.frame.w,
     ~~(~~(el.frame.elapsed) / el.frame.bound) * el.frame.h,
     el.frame.w,
     el.frame.h,
     ((mnx * sizeMult) + el.centerPos.x - ((sizeMult) * (el.img.w / 2))),
     ((mny * sizeMult) + el.centerPos.y - ((sizeMult) * (el.img.h / 2))),
     el.img.w * sizeMult,
     el.img.h * sizeMult
    );
    

    
        this.ctx.globalAlpha = 1;


    //this.ctx.drawImage(this.images[el.a].a, 0, 0)
    if (!el.isPaused) {

     el.frame.int -= el.frame.rate;
     el.frame.elapsed += el.frame.rate;
    }

    if (el.loop.isOn && ((el.loop.targetFrame <= ~~(el.frame.elapsed)) || (el.frame.int <= 0 - el.frame.rate))) {
    	//console.log(el)
     let decimal = el.frame.elapsed - ~~(el.frame.elapsed);
     
     el.frame.int = el.frame.max - (el.loop.resetFrame + decimal);
     el.frame.elapsed = el.loop.resetFrame + decimal;
    }

    if ((el.frame.int <= 0 - el.frame.rate) && !el.loop.isOn && !el.isPaused) {

     delete ob[g[h]];
     g.splice(h, 1);
     h--;
     l--;

    }
   }
  });
 }

 getObject(name) {
  return this.main.obj[name];
 }

 checkObject(boolName) {
  return boolName in this.main.obj;
 }
 create(id, frame, centerX, centerY, posX, posY, frameW, frameH, w, h, speed, img, boundX, sizeMult, loop, paused, isSizeCustom) {
  ////console.log(frameW, frameH, w, h, sizeMult)
  this.main.addItem(
  	id || Math.random() * 2147483647,
  	new this.#ObjectLayer(frame, posX - (0 * this.cellSize * w / 2),
  	posY - (0 * this.cellSize * h / 2), 
  	w, h, frameW, frameH, boundX || 10, speed, img, {
   x: centerX || 0,
   y: centerY || 0,
   mult: sizeMult !== void 0 ? sizeMult : 1,
   sizecustom: isSizeCustom
  }, loop, paused, 1));
  return this.main.obj[name];
 }
 setOpacity(name, value, time) {
  this.main.obj[name].opacity.fromValue = this.main.obj[name].opacity.toValue;
  this.main.obj[name].opacity.toValue = value;
  this.main.obj[name].opacity.max = time || -88;
  this.main.obj[name].opacity.time = 0;
 }
 remove(id) {
  if (this.checkObject(id))
   this.main.remove(id);
 }
 loadOffline(id, img, w, h) {
  this.images[id] = new this.#Image(w, h);
  this.images[id].load(img);
 ////console.log(this.images)
 }
 loadOfflineArr(arr) {
  for (let a of arr) {
   let m = a.dir;
   this.images[a.name] = new this.#Image(m.width, m.height);
   this.images[a.name].load(m);
  }
 }
 load(arr) {
  return new Promise(async res => {
   for (let a of arr) {
    let m = await loadImage(a.dir);
    this.images[a.name] = new this.#Image(m.width, m.height);
    this.images[a.name].load(m);
   }
   res();
  });

 }
 run() {
  this.main.update();
 }

}(particle.ctx);