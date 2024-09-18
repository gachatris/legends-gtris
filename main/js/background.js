const background = new class {
	constructor() {
		this.backgroundElem = id("BACKGROUND-VIDEO-FRAME");
		this.backgroundSrc = id("BACKGROUND-VIDEO-SRC");
		this.backgroundFG = id("BACKGROUND-FOREGROUND-LAYER");
	}
	loadBg(blob) {
		return new Promise(async res => {
			let blob = await load("./assets/background/video.mp4", "blob");
			this.backgroundSrc.src = URL.createObjectURL(blob);
			this.backgroundElem.load();
			//this.backgroundElem.play();
			res();
		})
		
		//this.backgroundElem.load();
	}
	setFGColor(r, g, b, a) {
		styleelem(this.backgroundFG, "background", `rgba(${r},${g},${b},${a})`);
	}
}();

