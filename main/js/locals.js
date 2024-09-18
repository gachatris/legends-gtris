const language = new class {

	#languages = {};
	#charLanguages = {};
	#settingLanguages = {};
	#images = {};
	#isLoadActive = true;
	#imgPathArrStr = "";
	#current = "en-US";

	load(file) {
		this.#current = file;
		this.coun
		let km = file.toLowerCase().replace(/\-/gm, "_");
		return new Promise(async (res, rej) => {
			this.loadLanguage(await load(`./assets/lang/${km}/main.json`, "text"));
			this.loadCharLanguage(await load(`./assets/lang/${km}/characters.json`, "text"));
			this.loadSettingLanguage(await load(`./assets/lang/${km}/settings.json`, "text"));
			res();
		})
	}

	loadCharLanguage(file) {
		let a = JSON.parse(file);
		this.#charLanguages[this.#current] = {};
		this.#charLanguages[this.#current] = a;
		//console.log(a)
	}
	
	loadLanguage(file) {
		let a = JSON.parse(file);
		this.#languages[this.#current] = {};
		this.#languages[this.#current] = a;
		//console.log(a)
	}
	loadSettingLanguage(file) {
	let a = JSON.parse(file);
	this.#settingLanguages[this.#current] = {};
	this.#settingLanguages[this.#current] = a;
	//console.log(a)
	}

	getLocalizationPath(file) {
		return `assets/lang/${"en_us"}/${file}`;
	}

	loadLangImage(arr) {
		let isBool = true;
		let tarr = [];
		for (let hh of arr) {
			let h = this.getLocalizationPath(hh);
			if (!(h in this.#images)) {
				isBool = false;
				tarr.push([hh, h]);
			} else if (!this.#images[h].active) {
				isBool = false;

			}
		}



		if (!isBool) {
			this.#isLoadActive = false;
			let count = 0;
			for (let a of tarr) {
				this.#images[a[0]] = {
					a: new Image(),
					active: false
				};
				////console.log(a);
				loadImage(a[1]).then((ue) => {
					this.#images[a[0]].a = ue;
					this.#images[a[0]].active = true;
					////console.log(a[1], ue)
					count++;
					if (count >= arr.length) {
						this.#isLoadActive = true;
					}
				});


			}
		}
	}

	getImage(src) {
		////console.log(this.#images[src].a);
		return this.#images[src].a;
	}

	loadImgsByJson(u) {
		/*if (this.##imgPathArrStr !== "") {
			return;
		}
		load(this.getLocalizationPath("images_init.json"), "text").then(u => {
			//console.log(this.getLocalizationPath("images_init.json"));
			
		});*/
		this.loadLangImage(JSON.parse(u));
	}

	translate(query, input, fallback) {
		let _input = (typeof input !== 'object' || !(input instanceof Array) ? [input] : (input)),
			language = this.#languages[this.#current],
			result = language[query] || fallback || "    ";
		for (let v = 0; v < _input.length; v++) {
			let varInstance = _input[v];
			let placeholder = `var\=${v}`;
			let regExp = new RegExp(placeholder, "gm");
			result = result.replace(regExp, varInstance);
		}
		return result;
	}
	
	settingTranslate(query, fallback) {
		//let _input = (typeof input !== 'object' || !(input instanceof Array) ? [input] : (input)),
			let language = this.#settingLanguages[this.#current],
			result = (language[query.split("||")[0]] || fallback || "    ").split("||");
		//let k = JSON.parse(JSON.stringify(result));
		while (result.length < 2) {
			result.push(fallback || "    ");
		}
		return result; //0: name, 1: footer
	}

	charTranslate(query, fallback) {
		//let _input = (typeof input !== 'object' || !(input instanceof Array) ? [input] : (input)),
		let querySplit = query.split(">"),
			base = this.#charLanguages[this.#current][querySplit[0]],
			language = this.#charLanguages[this.#current];


		for (let v = 0; v < querySplit.length; v++) {
			let langTemp = this.#charLanguages[this.#current];
			if (v === 0) language = langTemp;
			else language = base;
			base = language[querySplit[v]];

		}
		let result = base || fallback || "    ";



		return result;

	}
}();