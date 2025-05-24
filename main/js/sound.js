const sound = new class {
	constructor() {
		this.sounds = {};
		this.isReady = true;
		this.soundNames = {};
		this.volume = 100;
		this.bytes = 0;
	}
	load(filename, required) {
		/*return new Promise((res=> {
			res();
		}))*/
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
			let sounds = [];
			let soundInits = {};
			//for (let o in a.)

			for (let b in a.sounds) {
				let mref = a.sounds[b];
				let reference = a.sources.main[mref.src];
				sounds.push({
					name: b,
					src: `/assets/sounds/game/${filename}/${reference}`,
					loop: mref.loop
				});
				loadLength++;
				////console.log(reference);
				//storage[b] = await load(`/assets/sounds/game/${filename}/${reference}`, "blob");
			}
			for (let b = 1; b <= a.sources.chain.count; b++) {

				let reference = a.sources.chain.src;
				let directory = `/assets/sounds/game/${filename}/${reference}${b}.${a.sources.chain.filetype}`;
				sounds.push({
					name: a.sources.chain.name + b,
					src: directory,
					loop: false
				});
				////console.log(reference);
				loadLength++;
			}

			if ("swapcombo" in a.sources)
				for (let b = 1; b <= a.sources.swapcombo.count; b++) {
					let reference = a.sources.swapcombo.src;
					let directory = `/assets/sounds/game/${filename}/${reference}${b}.${a.sources.swapcombo.filetype}`;
					sounds.push({
						name: a.sources.swapcombo.name + b,
						src: directory,
						loop: false
					});
					////console.log(reference);
					loadLength++;

				}

			for (let b of sounds) {
				//let reference = sounds[b];
				//this.bytes += storage[reference.src].size;
				memoryManager.syncLoad(b.src, "blob", (blyad) => {
					let blob = URL.createObjectURL(blyad);
					this.sounds[b.name] = new MainHowler.Howl({
						src: blob,
						format: "ogg",
						loop: b.loop,
						preload: false
					});
					this.sounds[b.name].load();
					this.sounds[b.name].once("load", () => {
						URL.revokeObjectURL(blob);
					});
					
					loaded++;
					if (loaded >= loadLength) {
	this.isReady = true;
	this.volumeSet(this.volume);
	//console.log(this.bytes / (1024*1024))
	res();
}
				});

			}



			


		});
	}

	stop(str) {
		if (str in this.sounds) {
			this.sounds[str].stop();

		}
	}

	getSound(str) {
		return this.sounds[str] || new GTRISNoSoundObject();
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
	stereo() {
		
	}
}
class GTRISNoSoundObject {
	constructor(obj) {
		this.doc = 0;
		this._volume = obj.volume || 0;
		this._loop = obj.loop || false;
		this._src = obj.src || "";
		this.doc.src = this._src;
		this.doc.volume = this._volume;
		this.doc.loop = this._loop;
	}
	load() {
		
	}
	play(seek) {
		
	};
	stop() {
		
	}
	once(evt, func) {
		
	}
	volume(v) {
		
	}
	rate(e) {}
	stereo() {
		
	}
}

__private.sound = sound;