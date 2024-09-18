const splash = new class {
 constructor() {
  this.video;
  this.res = {
   w: 0,
   h: 0,
   size: 0
  };
  this.isActive = false;
  this.container = id("SPLASH-MAIN-CONTAINER");

  this.frame = 0;
  this.#showHideComponent("MAIN-CANVAS", 0);
  this.splashImage;
  this.isNext = false;
  this.isRunning = false;
  
  this.slides = [
   {
    2:() => {
     this.#showHideComponent("TEXT-TEXT", 0);
     this.renderer.play("text-show-out");
     this.ctx.drawImage(this.splashImage, 0, 0, 1280, 720);
    },
    17: () => {
     this.#showHideComponent("MAIN-CANVAS", 100);
     this.renderer.play("canvas-show-in");
     ////console.log(this.frame);
    },
   },
   {
    2:() => {
     this.#showHideComponent("MAIN-CANVAS", 0);
     this.renderer.play("canvas-show-out");
     //this.ctx.drawImage(this.splashImage, 0, 0, 1280, 720);
    },
    17: () => {
     game.synchroLoop.start();
     background.backgroundElem.play();
     this.showHide(0);
     this.toggleRunner(false);
     touchButtons.initiateButtons();
     ////console.log(this.frame);
    },
   }
  ];
  this.slideNumber = 0;
  this.canvas = id("SPLASH-MAIN-CANVAS");
  this.ctx = this.canvas.getContext("2d");
  
  
  this.canvasDim = [1280, 720];
  
  this.canvas.width = this.canvasDim[0];
  this.canvas.height = this.canvasDim[1];
  this.runner = new DateSynchronizedLoopHandler(60, () => {
   
   this.frame++;
   let a = this.slides[this.slideNumber];
   
   if (this.frame in a) {
    a[this.frame]();
   }
   
   this.renderer.run();
  });

  let mm = [];
  for (let i of ["in", "out"]) {
   mm.push({
    name: `text-show-${i}`,
    a: new AnimationFrameRenderer(id("SPLASH-TEXT-TEXT"), 0, 20, 1000/60, {
     name: `fade-${i}`,
     timing: "cubic-bezier(0,0,1,1)",
    }),
   });
   mm.push({
    name: `canvas-show-${i}`,
    a: new AnimationFrameRenderer(this.canvas, 0, 15, 1000/60, {
     name: `fade-${i}`,
     timing: "cubic-bezier(0,0,1,1)",
    }),
   });
  }
  this.runner.isAsynchronous = true;
  this.renderer = new FrameRendererSet(mm, "play", "stop", "run");
  ////console.log(JSON.stringify(mm));
  this.canvas.addEventListener("click", () => {
   this.nextSlide();
  });
 }
 
 switchSlide(number) {
  this.frame = -1;
  this.slideNumber = number;
 }
 
 nextSlide() {
 	if (this.isRunning) {
		if (this.slideNumber == 0) this.switchSlide(1);
	}
 }
 
 toggleRunner(toggle) {
  this.isRunning = toggle;
  if (toggle) this.runner.start();
  else this.runner.stop();
  
 }
 
 

 showHide(bool) {
  this.isActive = bool;
  styleelem(id("GTRIS-SPLASH-DIV"), "display", bool ? "flex" : "none");
 }
 
 #showHideComponent(id, bool) {
  style(`SPLASH-${id}`, "opacity", bool + "%");
 }
 
 

 resize(w, h, size) {
  this.res.w = w;
  this.res.h = h;
  this.res.size = size;
  styleelem(this.container, "width", `${w}px`);
  styleelem(this.container, "height", `${h}px`);
  
  styleelem(this.canvas, "width", `${w}px`);
  styleelem(this.canvas, "height", `${h}px`);

  styleelem(this.container, "font-size", `${size}px`);

  //style("SPLASH-TEXT-TEXT", wid)

 }
}();