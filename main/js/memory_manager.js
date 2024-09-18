let memoryManager = new class {
	//next update
	constructor() {
		this.mem = {};
		this.loadMax = 0;
		this.loaded = 0;
		this.ready = true;
		this.waitingQueue = {};
	}
	
	#checkLoad(count, max) {
		
	}

	loadBatch(arr) {

	}
	

	async _fetch(path, type, func) {
		this.mem[path] = {
			a: null,
			isLoaded: false
		};
		let a = null;
		if (type == "image") {
			a = await loadImage(path);
		}
		else a = await load(path, type);
		let g = this.mem[path];
		g.a = a;
		g.isLoaded = true;
		for (let h of this.waitingQueue[path]) {
			h();
		}
		delete this.waitingQueue[path];
	}

	syncLoad(path, type, func) {
		//this line is important to prevent executing this method that is not handled by a code.
		if (!func) throw "The load method of Memory Manager needs the func argument provided.";

		if (path in this.mem) {
			if (path in this.waitingQueue) {
				this.waitingQueue[path].push(() => {
					func(this.mem[path].a);
				});
			} else if (this.mem[path].isLoaded) {

				func(this.mem[path].a);

			} else {
				this.waitingQueue[path] = [() => {
					func(this.mem[path].a);
				}];
			}
		} else {
			this._fetch(path, type, func);
		}
	}
	
	asyncLoad(path, type) {
	//this line is important to prevent executing this method that is not handled by a code.
	//if (!func) throw "The load method of Memory Manager needs the func argument provided.";

	return new Promise((res, rej) => {
		if (path in this.mem) {
		if (path in this.waitingQueue) {
			this.waitingQueue[path].push(() => {
				rew(this.mem[path].a);
			});
		} else if (this.mem[path].isLoaded) {

			res(this.mem[path].a);

		} else {
			this.waitingQueue[path] = [() => {
				res(this.mem[path].a);
				}];
		}
	} else {
		this._fetch(path, type, () => {
			res(this.mem[path].a);
		});
	}
	})


}
}