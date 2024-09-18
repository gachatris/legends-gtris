const music = new class {
	constructor() {
		this.songs = {};
		this.isReady = false;
		this.active = "";
		this.volume = 100;
		this.sources = {};
	}
	async load(filenames) {
		let loaded = 0;
		let loadLength = 0;
		let notExist = [];
		for (let mmm = 0; mmm < filenames.length; mmm++) {
			let filename = filenames[mmm];
			if (!(filename.path in this.sources)) {
				notExist.push(filename);
			}
		}
		if (notExist.lemgth > 0) {
			this.isReady = false;
			this.stopAll();
		}
		for (let filename of notExist) {
			this.isReady = false;
			let storage = {};
			let sources = {};
			let blob = {};
			let f = filename.path;
			this.sources[f] = {};
			//this.sources[filename.path] = filename.name;
			let mm = {
				start: "start",
				loop: "loop",
			};

			for (let b in mm) {
				let reference = mm[b];
				////console.log(reference);
				let ml = `/assets/music/${filename.path}/${reference}.ogg`;
				sources[b] = ml;
				storage[b] = await load(ml, "blob");
			}
			loadLength++;

			for (let b in mm) {
				let reference = mm[b];
				blob[b] = URL.createObjectURL(storage[reference]);

			}
			

			this.sources[f] = new MusicObject(f, filename.continuable);



			////console.log(sources);
			this.sources[f].load(blob.start, blob.loop, () => {
				loaded++;
				if (loadLength <= loaded) {
					this.isReady = true;
					this.volumeSet(this.volume);
					//console.log(this.songs)
				}
			});
		}
		for (let mmm = 0; mmm < filenames.length; mmm++) {
			let filename = filenames[mmm];
			this.songs[filename.name] = this.sources[filename.path];
		}
	}
	stopAll() {
		for (let st in this.sources) {
			if ("stopMusic" in this.sources[st]) this.sources[st].stopMusic();
		}
		this.active = "";
	}

	play(str, isContinuable) {
		if (str in this.songs && this.volume > 0) {
			//this.songs[str].stop();
			for (let st in this.songs) {
				if (st === str) continue;
				this.songs[st].stopMusic();
			}
			this.active = str;

			this.songs[str].start(!isContinuable);
			////console.log(this.songs[str])
		}
	}

	resetAllSeek(str) {
		if (!(str in this.songs)) return;
		for (let i in this.songs) {
			this.songs[i].reset();
		}
	}
	volumeSet(n) {
		this.volume = n;
		
		 for (let st in this.songs) {
			this.songs[st].volume(n / 100);
		}
	}
}();

class MusicObject {
	constructor(name, continuable) {
		this.isContinuable = continuable;
		this.name = name; //for debugging
		this.stopTime = 0;
		this.stopType = "start";
		this.source = {
			start: null,
			loop: null
		};
		this.isPlaying = false;
	}
	load(startSrc, loopSrc, func) {
		this.source.start = new MainHowler.Howl({
			src: startSrc,
			format: "ogg",
			preload: false,
			onend: () => {
				this.stop("start");
				this.play("loop", true);

			}
		});
		this.source.loop = new MainHowler.Howl({
			src: loopSrc,
			format: "ogg",
			preload: false,
			loop: true
		});
		let loaded = 0;
		for (let source of ["start", "loop"]) {
			this.source[source].load();
			for (let r of ["load", "loaderror"]) {
				this.source[source].on(r, () => {
					loaded++;
					//	//console.log("loaf")
					if (loaded >= 2) {
						func();
					}
				});
			}
		}

	}
	
	

	getPos() {
		let num = 0;
		if (this.stopType == "start") {
			num = this.source.start.seek();
		}
		if (this.stopType == "loop") {
			num = this.source.loop.seek();
		}
		////console.log(num, this.isContinuable)
		return num;
	}
	setPos(num) {

		if (this.stopType == "start") {
			this.source.start.seek(num);
		}
		if (this.stopType == "loop") {
			this.source.loop.seek(num);
		}
	}
	play(source, isStop) {
		////console.log(isStop, this.stopTime, this.isContinuable)
		if (!(source in this.source)) return;
		this.source[source].play();
		if (isStop) {
			this.stopTime = 0;
		} else this.setPos(this.stopTime);
		this.stopType = this.isContinuable ? source : "start";
		this.isPlaying = true;
	}
	start(isStop) {
		if (isStop || !this.isContinuable) {
			this.stopTime = 0;
			this.stopType = "start";
		}
		this.play(this.stopType, isStop);
	}

	stop(source) {
		if (!(source in this.source)) return;

		this.source[source].stop();
		
	}
	stopMusic() {
		this.stopType = this.isContinuable ? (this.stopType) : "start";
		this.stopTime = this.isContinuable ? this.getPos() : 0;
		//console.log(this.name, this.stopTime, this.isContinuable);
		this.stop("start");
		this.stop("loop");
		this.isPlaying = false;
	}
	volume(vol) {
		for (let source of ["start", "loop"]) {
			this.source[source].volume(vol);
		}
	}
	rate(multiplier) {
		for (let source of ["start", "loop"]) {
			this.source[source].rate(multiplier);
		}
	}
	reset() {
		
		if (this.isPlaying) {
			this.stop("loop");
			this.stop("start")
			this.play("start");
		}
		this.stopTime = 0;
		this.stopType = "start";
	}
}