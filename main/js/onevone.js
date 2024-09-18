const game1v1 = new class {
	#AnimatedImage = class {
		constructor(image, frame, w, h, bound) {
			this.a = image || new Image();
			//this.frame = 0;
			this.max = frame,
			this.dims = {
				w:w || 100,
				h: h || 100
			}
			
			this.bound = bound || 10;
			
			
		}
	};
	
	constructor() {
		this.on = false;
		this.dim = {
			w: 1000,
			h: 1000
		}
		
		this.animatedImages = {};
		this.loaded = false;

		this.overhead = new class {
			constructor(p) {
				this.parent = p;
				this.div = id("OVERLAY-1V1-OVERHEAD");
				this.container = id("OVERLAY-1V1-OVERHEAD-DIV")
				this.canvas = id("O-1V1-OH-CANVAS");
				this.ctx = getCanvasCtx(this.canvas);
				this.width = 100;
				this.height = 10;
				this.aspectRatio = (100 / 1280);
				this.pixelPerCell = 20;
				this.canvasSize = 1280;
				this.canvas.width = this.canvasSize;
				this.canvas.height = this.canvasSize * this.aspectRatio;
				this.isActive = false;
				this.on = false;
				this.maxGarbage = 0;
				this.garbage = 0;
				this.position = 0;
				this.offsetPosition = 0;
				this.supposedPosition = 0.2;
				this.isPlayerTargeted = 0;
				this.timers = [-1, 0, 0];
				this.images = {};
				this.loaded = true
				this.playerImages = {
					left: "f",
					right: "r"
				};
				
				this.playerColors = {};

				this.spriteDims = {
					w: 1280,
					h: 140
				};
				
				this.spriteCenterRatio = {
					w: 27,
					h: 200
				};
				
				this.frame = 0;
			}

			resize(w, h) {
				this.width = w;
				this.height = w * this.aspectRatio;
				styleelem(this.container, "width", `${w}px`);
				styleelem(this.container, "height", `${h}px`);
				let cw = this.width * this.pixelPerCell,
					ch = this.height * this.pixelPerCell;
				for (let mh of [this.div, this.canvas]) {
					styleelem(mh, "width", `${this.width}px`);
					styleelem(mh, "height", `${this.height}px`);
				}


				////console.log(1280 * (120/1280))

			}

			run() {
				this.ctx.clearRect(0, 0, 1280, 100);

				if (this.on) {
					let position = this.position + (0.005 * (Math.random())) - (0.005 * (Math.random()));
					let gap = 0;
					let fade = 1;
					
					this.frame++;
					
					if (this.frame >= 120) this.frame = 0;
					
					for (let h = 0; h < 3; h++) {
						let r = this.timers[h];
						if (r > -1) this.timers[h]--;
					}
					
					if (this.timers[2] >= 0) {
						let mm = Math.max(this.timers[2] - 10, 0) / 15;
						//gap = mm * 1;
						//let off = this.position - this.supposedPosition;
						fade = mm;
						if (this.timers[2] == 0) {
						this.on = false;
						this.isActive = false;
						return;
						}
					}
					

					if (this.timers[1] >= 0) {
						let mm = Math.max(this.timers[1], 0) / 5;
						//gap = mm * 1;
						//let off = this.position - this.supposedPosition;
						position = this.position + (this.offsetPosition * mm);
					}

					if (this.timers[0] >= 0) {
						let mm = Math.max(this.timers[0] - 5, 0) / 12;
						gap = mm * 1;
						if (this.timers[0] == 0) {
							this.movePos(this.supposedPosition);
							//this.timers[0] = 25;
						}
						position = 0.5;
					}

					this.drawChars((~~this.isPlayerTargeted == 1) ? (1 - position) : position, gap, 5 * Math.random() + 10, fade);
					
				
				}

			}

			drawChars(position, gap, y, fade) {
				let ratio = this.spriteCenterRatio.w / this.spriteCenterRatio.h;
				let center = this.parent.getAnimatedImage("overhead_center");
				this.ctx.globalAlpha = fade;
				if (this.playerImages.left in this.images)
					if (this.images[this.playerImages.left].loaded) {
						let img = this.images[this.playerImages.left].a;
						
						{
							let col = this.playerColors.left;
							this.ctx.fillStyle = `rgb(${col.r},${col.g},${col.b})`;
							
							this.ctx.fillRect(
								0,
								0,
								~~((position * this.canvasSize) - (gap * this.spriteDims.w)),
								this.canvasSize * this.aspectRatio
							);
						}
						
						this.ctx.drawImage(img,
							0, y + 10, 1280, 1280 * this.aspectRatio,
							~~((position * this.canvasSize) - (this.spriteDims.w * (gap)) - (this.spriteDims.w)),
							(0),
							this.canvasSize,
							this.canvasSize * this.aspectRatio
						);
					}

				if (this.playerImages.right in this.images)
					if (this.images[this.playerImages.right].loaded) {
						let img = this.images[this.playerImages.right].a;
						
						{
							let col = this.playerColors.right;
							this.ctx.fillStyle = `rgb(${col.r},${col.g},${col.b})`;
							
							this.ctx.fillRect(
								
								~~((position * this.canvasSize) + (gap * this.spriteDims.w)),
								0,
								this.canvasSize - ~~((position * this.canvasSize) + (gap * this.spriteDims.w)),
								this.canvasSize * this.aspectRatio
							);
						}

						this.ctx.drawImage(img,
							0, (1280 * (this.spriteDims.h / 1280)) + y + 10, 1280, 1280 * this.aspectRatio,
							~~((position * this.canvasSize) + (this.spriteDims.w * (gap))),
							(0),
							this.canvasSize,
							this.canvasSize * this.aspectRatio
						);
					}
					
				if (gap == 0) {
					this.ctx.drawImage(center.a,
					this.spriteCenterRatio.w * (this.frame % center.bound),
					this.spriteCenterRatio.h * ~~(this.frame / center.bound),
					this.spriteCenterRatio.w,
					this.spriteCenterRatio.h,
					((position * this.canvasSize) - ((ratio * this.canvasSize * this.aspectRatio) * (0)) - (ratio * this.canvasSize * this.aspectRatio)),
					0,
					this.canvasSize * ratio * this.aspectRatio,
					this.canvasSize * this.aspectRatio
					)
					
					this.ctx.fillStyle = `#fff`;
							let mcx = 0.05;
							this.ctx.fillRect(
								0,
								(this.canvasSize * this.aspectRatio) - (this.canvasSize * this.aspectRatio * mcx),
								this.canvasSize,
								this.canvasSize * this.aspectRatio * mcx
							);
				}
				
				this.ctx.globalAlpha = 1;
				
				
			}

			openClose(number, player, garbage, lastGarbage) {
				this.isActive = false;
				switch (number) {
					case 1: {

						this.timers[0] = 25;
						this.timers[1] = 0;
						this.timers[2] = -1;
						this.on = true;
						this.isActive = true;
						this.isPlayerTargeted = player;
						//console.warn(this.isPlayerTargeted + " OPEN")
						this.checkGarbage(player, garbage, lastGarbage);
						//this.supposedPosition = 0.5;

						this.position = 0.5;
						//this.isActive= true;
						break;
					}
					case 2: {

						this.movePos(1.5);
						this.timers[2] = 25;
						break;
					}
					case 3: {

						this.movePos(-0.5);
						this.timers[2] = 25;
						break;
					}
					case 4: {


						this.timers[2] = 25;
						break;
					}

					case 5: {

						this.on = false;

						break;
					}
				}
			}

			async loadImg(arr) {
				let length = arr.length;
				let count = 0;
				for (let h of arr) {
					if (!(h.name in this.images)) {
						this.images[h.name] = {
							a: new Image(),
							loaded: false
						}
						this.loaded = false;
					}
				}

				for (let h of arr) {
					if ((h.name in this.images)) {
						//console.log(h)
						this.images[h.name].a = await loadImage(h.dir);
						this.images[h.name].loaded = true;
					}
				}
				this.loaded = true;
			}


			movePos(position) {
				let lastPos = this.position;
				this.supposedPosition = position;
				this.offsetPosition = lastPos - position;
				this.position = position;
				this.timers[1] = 5;
			}

			checkGarbage(player, garbage, lastGarbage) {
				if (this.on && this.isActive && ~~this.isPlayerTargeted == ~~player) {
					this.garbage = garbage;
					if (this.garbage > this.maxGarbage) this.maxGarbage = this.garbage;
					if (lastGarbage !== void 0 && lastGarbage > 0) this.maxGarbage = lastGarbage;
					let margin = 2;
					let whole = 14;
					let p = this.garbage / this.maxGarbage;


					this.movePos((((1 - (p)) * 10) + 2) / 14);
				}
			}

			loadPlayer(l, n) {
				this.playerImages[l] = n.image;
				this.playerColors[l] = {
					r: n.red,
					g: n.green,
					b: n.blue
				};
				//console.log(this.playerColors[l])
			}
			
			

		}(this);
		this.winstat = new class {
			constructor(p) {
				this.parent = p;
				this.container = id("WINSBAR-BAR");
				this.players = {};
				this.layers = {};
				this.stars = {};
				this.texts = {};
				this.maxWins = 2;
				{
					let h = [
						{
							name: "star1_l",
							id: "STAR1-LEFT",
							type: "star"
						},
						{
							name: "starnumber_l",
							id: "TEXT-LEFT",
							type: "text"
						},
						{
							name: "star2_l",
							id: "STAR2-LEFT",
							type: "star"
						},
						{
							name: "star_c",
							id: "STAR-CENTER",
							type: "star"
						},
						{
							name: "objective_text",
							id: "TEXT-CENTER",
							type: "text"
						},
						{
							name: "star2_r",
							id: "STAR2-RIGHT",
							type: "star"
						},
						{
							name: "starnumber_r",
							id: "TEXT-RIGHT",
							type: "text"
						},
						{
							name: "star1_r",
							id: "STAR1-RIGHT",
							type: "star"
						}
					];
					
					for (let g of h) elem("GTRIS-WINSTAT-LAYER", (a) => {
						//let m;
						if (g.type == "text") {
							let m = document.createElement("gtris-text");
							this.texts[g.name] = m;
							//m.innerText = "fuck"
							a.appendChild(m);
						}
						if (g.type == "star") {
						let m = createSVG("100%", "100%");
						m.setAttribute("xml:space", "preserve");
						m.setAttribute("viewBox", "0 0 47.94 47.94");
						let f = document.createElementNS("http://www.w3.org/2000/svg", "path");
						f.style.stroke = "#000";
						f.style.setProperty("stroke-width", "2px");
						f.setAttribute("d", "M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757	c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042	c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685	c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528	c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956	C22.602,0.567,25.338,0.567,26.285,2.486z");
						f.style.setProperty("fill", "#ffffffaa");
						m.appendChild(f);
						a.appendChild(m);
						
						m.style.width = m.style.height = "100%";
						this.stars[g.name] = f;
						}
						
						a.style.display = "flex";
							a.style.position = "relative";
							styleelem(a, "justify-content", "center");
							styleelem(a, "align-items", "center");

						//m.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
						a.style.width = "20px";
						a.style.height = "20px";
						//a.style.background = "#4884";
						a.style.position = 'relative';
						this.container.appendChild(a);
						//if (g.type === "star") 
						this.layers[g.name] = a;
						//a.style.width = a.style.height = "10px";
						
						//console.log(m, a.innerHTML);
					});
					//for (const u of Object.entries(this.texts)) for (const y of u) console.log(y)
				}
			}
			
			getLayer(layername) {
				
			}

			resize(w) {
				this.cellSize = w;
				
				styleelem(this.container, "width", `${w * 12}px`);
				styleelem(this.container, "height", `${w * 2}px`);
				
				styleelem(this.container, "bottom", `${w * 2}px`);
				
				for (let h = 1; h <= 2; h++) {
					styleelem(this.layers[`star${h}_l`], "width", `${w * 1.75}px`);
					styleelem(this.layers[`star${h}_l`], "height", `${w * 1.75}px`);
					styleelem(this.layers[`star${h}_r`], "width", `${w * 1.75}px`);
					styleelem(this.layers[`star${h}_r`], "height", `${w * 1.75}px`);
					
				}
				for (let j of ["l", "r"]) {
					styleelem(this.layers[`starnumber_${j}`], "width", `${w * 1.55}px`);
					styleelem(this.layers[`starnumber_${j}`], "height", `${w * 1.55}px`);
					styleelem(this.texts[`starnumber_${j}`], "font-size", `${w * 1.55}px`);
				}
				
				styleelem(this.layers.objective_text, "width", `${w * 4}px`);
				styleelem(this.layers.objective_text, "height", `${w * 2}px`);
				styleelem(this.texts.objective_text, "font-size", `${w * 2}px`);
				////console.log(1280 * (120/1280))
				styleelem(this.layers.star_c, "width", `${w * 2.2}px`);
				styleelem(this.layers.star_c, "height", `${w * 2.2}px`);
				styleelem(this.layers.star_c, "margin-left", `${w * 0.5}px`);
				styleelem(this.layers.star_c, "margin-right", `${w * 0.5}px`);

			}

			run() {
				this.ctx.clearRect(0, 0, 1280, 100);

				if (this.on) {
					let position = this.position + (0.005 * (Math.random())) - (0.005 * (Math.random()));
					let gap = 0;
					let fade = 1;
					
					this.frame++;
					
					if (this.frame >= 120) this.frame = 0;
					
					for (let h = 0; h < 3; h++) {
						let r = this.timers[h];
						if (r > -1) this.timers[h]--;
					}
					
					if (this.timers[2] >= 0) {
						let mm = Math.max(this.timers[2] - 10, 0) / 15;
						//gap = mm * 1;
						//let off = this.position - this.supposedPosition;
						fade = mm;
						if (this.timers[2] == 0) {
						this.on = false;
						this.isActive = false;
						return;
						}
					}
					

					if (this.timers[1] >= 0) {
						let mm = Math.max(this.timers[1], 0) / 5;
						//gap = mm * 1;
						//let off = this.position - this.supposedPosition;
						position = this.position + (this.offsetPosition * mm);
					}

					if (this.timers[0] >= 0) {
						let mm = Math.max(this.timers[0] - 5, 0) / 12;
						gap = mm * 1;
						if (this.timers[0] == 0) {
							this.movePos(this.supposedPosition);
							//this.timers[0] = 25;
						}
						position = 0.5;
					}

					this.drawChars((~~this.isPlayerTargeted == 1) ? (1 - position) : position, gap, 5 * Math.random() + 10, fade);
					
				
				}

			}

			openClose(bool) {
				this.isActive = bool;
				styleelem(this.container, "display", (bool) ? "flex": "none");
			}
			

			loadPlayer(l, n) {
				if (!(l in this.players)) this.players[l] = {};
				this.players[l] = {
					r: n.red,
					g: n.green,
					b: n.blue,
					wins: 0
				};
				//console.log(this.playerColors[l])
			}
			
			setWins(l, num, isShine) {
				if (!this.isActive) return;
				let a = this.players[l];
				a.wins = num;
				styleelem(this.stars.star_c, "fill", `#555`);
				if (this.maxWins > 3) {
					if (l == "left") {
					//console.log(this.texts.starnumber_l, this.stars.star1_l)
						styleelem(this.stars.star1_l, "fill", `rgb(${a.r},${a.g},${a.b})`);
						
					styleelem(this.texts.starnumber_l, "color", `rgb(${a.r},${a.g},${a.b})`);
					
					ihelem(this.texts.starnumber_l, a.wins);
					
				}
				if (l == "right") {
					
						styleelem(this.stars.star1_r, "fill",`rgb(${a.r},${a.g},${a.b})`);
					
					styleelem(this.texts.starnumber_r, "color", `rgb(${a.r},${a.g},${a.b})`);
					ihelem(this.texts.starnumber_r, a.wins);
				}
					
				} else {
				if (l == "left") {
					for (let h = 1; h < this.maxWins; h++) {
						styleelem(this.stars[`star${h}_l`], "fill", (h <= a.wins) ? `rgb(${a.r},${a.g},${a.b})` : "#333");
					}
					if (a.wins === this.maxWins) styleelem(this.stars[`star_c`], "fill", `rgb(${a.r},${a.g},${a.b})`);
				}
				if (l == "right") {
					for (let h = 1; h < this.maxWins; h++) {
						styleelem(this.stars[`star${h}_r`], "fill", (h <= a.wins) ? `rgb(${a.r},${a.g},${a.b})` : "#333");
					}
					if (a.wins === this.maxWins) styleelem(this.stars.star_c, "fill", `rgb(${a.r},${a.g},${a.b})`);
				}
				}
			}
			
			setMaxWins(num) {
				this.maxWins = num;
				if (!this.isActive) return;
				
				if (num > 3) {
					styleelem(this.layers.star_c, "display", "none");
					
						//console.log(h)
						for (let h = 1; h < 3; h++) {
						//console.log(h)
						styleelem(this.layers[`star${h}_l`], "display", (h < 2) ? "flex": "none");
						styleelem(this.layers[`star${h}_r`], "display", (h < 2) ? "flex": "none");
						}
						ihelem(this.texts.objective_text, language.translate("first_to", [this.maxWins]));
						
						//ihelem(this.texts.obj, a.wins);
					for (let j of ["l", "r"]) {
						styleelem(this.layers[`starnumber_${j}`], "display", "flex");
					}
					styleelem(this.layers.objective_text, "display", "flex");
				} else {
					styleelem(this.layers.star_c, "display", "flex");
					for (let h = 1; h < 3; h++) {
						//console.log(h)
						styleelem(this.layers[`star${h}_l`], "display", (h < num) ? "flex": "none");
						styleelem(this.layers[`star${h}_r`], "display", (h < num) ? "flex": "none");
					}
					
					for (let j of ["l", "r"]) {
						styleelem(this.layers[`starnumber_${j}`], "display", "none");
					}
					styleelem(this.layers.objective_text, "display", "none");
					
				}
			}
			
			

		}(this);
	}

	resize(w, h) {
		this.dim.w = w;
		this.dim.h = h;
		this.overhead.resize(w, h);
	}

	run() {
		if (!this.on) return;
		this.overhead.run()
	}
	
	async loadAImg(arr) {
		let loadable = [];
		for (let g of arr) {
			if (!(g.name in this.animatedImages)) loadable.push(g);
		}
		if (loadable.length > 0) {
			this.loaded = false;
			for (let h of loadable) {
				let l = await loadImage(h.dir);
				this.animatedImages[h.name] = new this.#AnimatedImage(l, h.frame, h.w, h.h, h.bound);
			}
			this.loaded = true;
		}
	}
	
	loadAImgOffline(arr) {
		let loadable = [];
for (let g of arr) {
	if (!(g.name in this.animatedImages)) loadable.push(g);
}
////console.log(g)
if (loadable.length > 0) {
//	this.loaded = false;
	for (let h of loadable) {
		let l = h.image;
		this.animatedImages[h.name] = new this.#AnimatedImage(l, h.frame, h.w, h.h, h.bound);
	}
	this.loaded = true;
}
}
	getAnimatedImage(image) {
		return this.animatedImages[image];
	}
	

}();

