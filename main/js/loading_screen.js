const loadingScreen = new class {
	constructor() {
		this.element = id("GTRIS-LOAD-SCREEN");
		this.canvas = id("LOAD-TRIVIA-CANVAS");
		this.ctx = getCanvasCtx(this.canvas);
		this.canvas.width = 480;
		this.canvas.height = 270;
		this.width = 480;
		this.height = 270;
		this.images = {};

		this.frame = {
			closing: -9,
			opening: -9
		};
		this.drawnGapWidth = 1;
		this.on = false;
		this.isOpenable = false; //false to continue opening, true to keep the gate closed
		//this
	}

	run() {
		if (!this.on) return;
		
		if (this.frame.closing > 0) {
			this.frame.closing--;
			this.drawnGapWidth = (40 - this.frame.closing) / 40;

		} else if (this.frame.opening >= 0 && this.isOpenable) {
			this.frame.opening--;
			this.drawnGapWidth = (this.frame.opening) / 40;
			if (this.frame.opening == 0) {
				this.on = false;
				styleelem(this.element, "display", "none");
			}
		}

		//this.drawnGapWidth = (Math max(60, this.frame.closing - this.frame.opening, 0)) / 60
		this.draw();
	}

	draw() {
		this.ctx.clearRect(0,0,480,270);
		let lm = bezier(this.drawnGapWidth, 0, 1, 0,0,0,1);
		this.ctx.drawImage(this.images.gate1,
			0, 0, 480, 270,
			(lm - 1) * 480,
			0,
			480,
			270
		);
		this.ctx.drawImage(this.images.gate2,
			0, 0, 480, 270,
			(1 - lm) * 480,
			0,
			480,
			270
		);
	}

	toggleOn() {
		this.on = true;
		this.frame.opening = 40;
		this.frame.closing = 40;
		
		styleelem(this.element, "display", "flex");
	}
}();