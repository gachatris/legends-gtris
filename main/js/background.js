const background = new class {
	constructor() {
		this.backgroundElem = document.createElement("video");
		this.backgroundSrc = document.createElement("source");
		this.backgroundElem.append(this.backgroundSrc);
		this.backgroundFG = id("BACKGROUND-FOREGROUND-LAYER");
		//this.backgroundElem.preload = "auto";
		this.canvas = id("BG-BG-CANVAS");
		this.ctx = getCanvasCtx(this.canvas);
		this.sizeMult = 540/1280;
		this.width = 1280 * this.sizeMult;
		this.height = 720 * this.sizeMult;
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.aspectRatio = 16 / 9;

	}
	resize(w, h) {
		this.width = w * this.sizeMult;
		this.height = w * this.aspectRatio * this.sizeMult;
		styleelem(this.canvas, "width", `${w}px`);
		styleelem(this.canvas, "height", `${h}px`);
	}
	drawImage(input, sx, sy, sw, sh, x, y, w, h, isFlipped) {
		let ctx = this.ctx;
		let sm = this.sizeMult;

		if (isFlipped) {
			ctx.save();
			ctx.translate(x * sm, y * sm);
			ctx.scale(-1, 1);
			ctx.drawImage(input, sx, sy, sw, sh, -w * sm, 0, w * sm, h * sm);
			ctx.restore();
		} else {
			ctx.drawImage(input, sx, sy, sw, sh, x * sm, y * sm, w * sm, h * sm);
		}

	}
	loadBg(blob) {
		return new Promise(async res => {
			try {
				let blob = await load("./assets/background/video.mp4", "blob");
				this.backgroundSrc.src = URL.createObjectURL(blob);

				
				this.backgroundElem.playbackRate = 1;
				
				this.backgroundElem.loop = true;

				this.backgroundElem.addEventListener("loadeddata", () => {
					let duration = this.backgroundElem.duration - 1;
				
					//this.backgroundElem.currentTime = duration;
					this.backgroundElem.play();
					res();
				});
				this.backgroundElem.load(); 
				res();
			} catch (e) {
				console.dir(e, {
					depth: null
				})
			}/**/
			res();
		})

		//this.backgroundElem.load();
	}
	drawVideo() {
		this.ctx.drawImage(this.backgroundElem, 0, 0, 1280 * this.sizeMult, 720 * this.sizeMult);
	}
	setFGColor(r, g, b, a) {
		styleelem(this.backgroundFG, "background", `rgba(${r},${g},${b},${a})`);
	}
}();