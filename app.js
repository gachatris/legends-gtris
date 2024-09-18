/**
 * Gachatris Legends
 * 1:03am Aug 8, 2023
 */

"use-strict";



(function(global) {

	window.onerror = (event, source, lineno, colno, error) => {
		if (error instanceof SyntaxError) {
			try {
				console.log(`FATAL ERROR!!! At ${source}, ${lineno}:${colno}, ${event.indexOf('Strict mode code')!==-1||event.indexOf('Identifier \'')!==-1?'':"there is"} ${['a','e','i','o','u'].indexOf(event.toLowerCase().replace('uncaught syntaxerror: ', '').charAt(0)) !== -1?'an':'a'} ${event.replace('Uncaught SyntaxError: ','').toLowerCase()}. Please contact the Gachatris developer and he will fix a discovered bug to recover the game.`)
				document.body.style = "background:#000;color:#fff;";
			} catch (e) {}
		} else {
			console.warn(event, source, lineno, colno, error);
			//alert(`At ${source}, ${lineno}:${colno}, there is ${[`a`,`e`,`i`,`o`,`u`].indexOf(event.toLowerCase().charAt(0)) !== -1?'an':'a'} ${event}. If you see this error mesage, contact the Gachatris developer.`)
		}
	}

	const accessible = {};

	/*	if ("AndroidIO" in window) {
			
		}/**/

	/*//console.log = (...args) => {
			//accessible.log(args)
		}*/
	const BASE_DIRECTORY = "./main";

	function dataURIToBinary(dataURI) {
		const BASE64_MARK = ";base64,"
		var base64Index = dataURI.indexOf(BASE64_MARK) + BASE64_MARK.length;
		var base64 = dataURI.substring(base64Index);
		var raw = window.atob(base64);
		var rawLength = raw.length;
		var array = new Uint8Array(new ArrayBuffer(rawLength));

		for (i = 0; i < rawLength; i++) {
			array[i] = raw.charCodeAt(i);
		}
		return array;
	}


	class NativeLDBManager {
		#isBlocked = false;
		#isError = false;

		/**
		 *EricLenovo's Natuve Local IndexedDB Manager
		 */

		constructor() {
			this.database;
			this.backup = [];
			this.dbname = window.location + "::IndexedDB_native";
			this.version = 3;
			this.listeners = {};
			this.dataVersion = 1.0;
			this.categories = [];
		}
		/**
		 * Backs up data from an old version upon upgrading beforehand.
		 */
		backupAndUpdate(lis) {
			this.backup = [];
			let requestBackup = this.database.transaction("Main", "readonly").objectStore("Main");

			let test = requestBackup.getAll();
			test.onsuccess = () => {
				let arr = test.result;
				for (let w of arr) {
					this.backup.push(w);
				}
				this.database.close();
				this.initialize(this.categories, lis || this.listeners, this.version, true);
				//console.log("index missing, upgrading database");
			}
		}

		/**
		 * Initializes EricLenovo Native Local IndexedDB Manager
		 */
		initialize(indices, listener, version, isBackup) {
			let on = listener || {
				update: null,
				open: null
			};
			this.listeners.open = on.open || function() {};
			this.listeners.update = on.update || function() {};

			let a = indexedDB.open(this.dbname, version || void 0);
			this.categories = indices || [];
			a.onerror = (e) => {
				console.error(e.target.error);
				this.#isError = true;
			}
			a.onblocked = (qe) => {
				this.#isBlocked = true;
			};
			a.onclose = (ue) => {
				console.error("database closed");
			}
			a.onsuccess = (qe) => {
				this.database = qe.target.result;
				this.version = this.database.version;
				let test = this.database.transaction("Main", "readwrite").objectStore("Main");
				let pq = [];
				for (let ii = 0; ii < Object.keys(test.indexNames).length; ii++) {
					pq.push(test.indexNames[ii]);
					pq.push(`${test.indexNames[ii]}_unique`);
				}
				let isExist = true;
				for (let w of this.categories) {
					if (pq.indexOf(w) == -1) {
						isExist = false;
					}
				};

				if (!isExist) {
					this.version++;
					//this.database.close();
					this.backupAndUpdate();
					this.listeners.update();
					return;
				}
				if (isBackup) {
					for (let ww of this.backup) {
						test.put(ww);
					}
				}
				////////console.log("database is ready");
				let proptest = test.getAll();
				proptest.onsuccess = () => {
					////////console.log(proptest.result)
				}
				this.listeners.open();
			};

			a.onupgradeneeded = async (e) => {
				let aa = e.target.result;
				let ab, ac;
				////////console.log("upgrading...");

				try {
					let te = a.result.objectStoreNames,
						isExist = false;

					for (let tew = 0; tew < Object.keys(te).length; tew++) {
						if (te[tew] == "Main") isExist = true;
					}

					if (isBackup && isExist) await aa.deleteObjectStore("Main");

					ab = await aa.createObjectStore("Main", { keyPath: "index" });
					////////console.log(te)
				} catch (e) {
					////////console.log(e);
					// ab = await aa.transaction("Main").objectStore("Main");
				}


				try {
					let o = ab.indexNames;
					////////console.log(o, "INDEX")/**/

					let wIsExist = false;

					for (let tew = 0; tew < Object.keys(o).length; tew++) {
						if (te[tew] == "main") wIsExist = true;
						if (te[tew] == "main_unique") wIsExist = true;
					}
					ac = await ab.createIndex("main", "category", { unique: false });
					await ab.createIndex("main_unique", ["index", "category"], { unique: false });
				} catch (e) {
					////////console.log("error" + e)
				}

				for (let y of this.categories) {
					try {
						ab.createIndex(y, `category`, { unique: false });
						ab.createIndex(`${y}_unique`, ["index", "category"], { unique: false });
					} catch (e) {
						////////console.log(e, "TRANSACTION")
					}
				}


			}
		}

		/**
		 * Checks if IndexedDB fails to initialize or is blocked on your browser.
		 */

		checkError() {
			return this.#isBlocked || this.#isError;
		}
		/**
		 * Reads and returns an element inside a specific category.
		 */
		read(category, ind, func) {
			let _category = "main";
			if (category) _category = category;
			////////console.log(this.database.transaction)
			let a = this.database.transaction("Main", "readonly");
			let b = a.objectStore("Main").index(`${_category}_unique`);
			let c;
			try {
				c = b.get([_category + "===" + ind, _category]);
				c.onsuccess = () => {
					func(c.result);
				}
				c.onerror = (e) => {
					//////console.log("error");
					func(undefined);
				}
			} catch (e) {
				//////console.log("error");
				func(undefined);
			}
		}

		/**
		 * Returns an array of all elemets in a specific category.
		 */

		readAll(category, func) {
			let _category = "main";

			if (category) _category = category;
			let a = this.database.transaction("Main", "readonly");
			let b = a.objectStore("Main").index(_category);
			let c;
			try {
				c = b.getAll(_category);
				c.onsuccess = () => {
					func(c.result)
				}

			} catch (e) {
				////////console.log("error" + e)
				func(undefined);
			}
		}

		readBulk(bulk, func) {
			let a = {};
			let max = bulk.length;
			let c = 0;
			for (let h = 0; h < max; h++) {
				let r = bulk[h];
				////console.log(r)
				this.read(r.category, r.index, (ev) => {
					////console.log(eve)
					c++;
					a[r.index] = ev;
					if (c == max) {
						func(a);
					}
				});
			}
		}


		/**
		 * Writes data to an element that then is added to a specific category.
		 */
		write(category, nind, val, func) {
			//if (this.categories.indexOf(d) === -1) throw new Error(`Category ${category} not found for index ${ind}`);
			try {
				let index = "main";
				if (category) index = category;
				let a = this.database.transaction("Main", "readwrite");
				let b = a.objectStore("Main");

				let ind = index + "===" + nind;

				let c = {
					index: ind,
					value: val,
					timestamp: Date.now(),
					category: "",
					version: this.dataVersion,
					searchable: {}
				};


				c.category = index;
				c.searchable[index] = ind;

				b.put(c);

				a.oncomplete = () => {
					if (func) func();
				}
			} catch (e) {
				//console.log(e)
				this.backupAndUpdate({
					open: () => {
						this.write(category, nind, val, func);
					}
				});
			}
		}

		/**
		 * Removes an element from a specific category.
		 */

		delete(category, nind, isPreventPrefix, func) {
			let _func = func || function() {}
			let index = "main";
			let ind = (isPreventPrefix ? (index + "===") : "") + nind;
			if (category) index = category;
			let a = this.database.transaction("Main", "readwrite");
			let b = a.objectStore("Main");

			try {
				let find = b.get(ind);
				find.onsuccess = () => {
					let r = find.result;
					if (!r) return;
					//  ////////console.log(r)
					if (index === r.category) {
						let wq = b.delete(ind);
						_func(true);
					}
				}
			} catch (e) {
				//throw e
				////////console.log(e)
				_func(false);
			};
		}

	};
	//In case Gachatris Legends runs on Android (Java), this has to be used.
	class AndroidStorageManager {
		#isBlocked = false;
		#isError = false;

		/**
		 *EricLenovo's Natuve Local IndexedDB Manager
		 */

		constructor() {

		}
		/**
		 * Backs up data from an old version upon upgrading beforehand.
		 */


		/**
		 * Initializes EricLenovo Native Local AndroidStorage Manager
		 */
		initialize(indices, listener, version, isBackup) {
			listener.open();

		}

		/**
		 * Checks if IndexedDB fails to initialize or is blocked on your browser.
		 */

		checkError() {
			return this.#isBlocked || this.#isError;
		}

		#toUnicodeString(stringToEncode) {
			//let a = stringToEncode.split("");
			let str = "";
			for (let h = 0; h < stringToEncode.length; h++) {
				str += stringToEncode.codePointAt(h);
				if (h < stringToEncode.length) str += ",";
			}
			return str;
		}

		#fromUnicodeString(utfToDecode) {
			let str = "";
			let spl = utfToDecode.split(",");
			for (let h = 0; h < spl.length; h++) {
				str += String.fromCodePoint(spl[h]);
				//if (h < utfToDecode.length) str += ",";
			}
			return str;
		}


		/**
		 * Reads and returns an element inside a specific category.
		 */
		async read(category, ind, func) {
			let _category = "main";
			if (category) _category = category;
			try {
				let obj = undefined;
				accessible.log(ind);
				let hb = await accessible.callAsyncJava("callback_databaseLoad", async (name, ad) => {
					ad.getData(name, `${_category/*.replace(new RegExp("/", "gm"), "_")*/}/${ind}.gtrisutf`);
				});

				//accessible.log(hb.length);

				if (hb.length !== 0) obj = {
					index: ind,
					value: this.#fromUnicodeString(hb),
					timestamp: Date.now(),
					category: "",
					version: 1,
					searchable: {}
				}
				accessible.log(`${hb.length}, ${JSON.stringify(obj)}`);
				func(obj);

			} catch (e) {
				func(undefined);
				accessible.log("no file for " + ind + "; reason:: " + e.stack);
			}

		}

		/**
		 * Returns an array of all elemets in a specific category.
		 */

		async readAll(category, func) {
			let _category = "main";
			if (category) _category = category;
			let li = [];
			try {

				let hb = await accessible.callAsyncJava("callback_databaseLoad", async (name, ad) => {
					ad.getDataFromDir(name, _category.replace(new RegExp("/", "gm"), "_"));
				});
				let yw = hb.split("|");
				for (let y of yw) {
					let obj = {
						index: "",
						value: this.#fromUnicodeString(y),
						timestamp: Date.now(),
						category: "",
						version: 1,
						searchable: {}
					}
					li.push(obj);
				}
			} catch (e) {
				func([]);
			}
		}

		readBulk(bulk, func) {
			let a = {};
			let max = bulk.length;
			let c = 0;
			for (let h = 0; h < max; h++) {
				let r = bulk[h];
				////console.log(r)
				this.read(r.category, r.index, (ev) => {
					////console.log(eve)
					c++;
					a[r.index] = ev;
					if (c == max) {
						func(a);
					}
				});
			}
		}

		/**
		 * Writes data to an element that then is added to a specific category.
		 */
		async write(category, nind, val, func) {
			//if (this.categories.indexOf(d) === -1) throw new Error(`Category ${category} not found for index ${ind}`);
			let index = "main";
			if (category) index = category;
			let _func = func || function() {}


			//let ind = index + "===" + nind;

			/*let c = {
				index: ind,
				value: val,
				timestamp: Date.now(),
				category: "",
				version: this.dataVersion,
				searchable: {}
			};*/

			let utf16IntString = this.#toUnicodeString(val);
			let u = await accessible.callAsyncJava("callback_database", (name, android) => {
				android.writeData(name, `${category.replace(new RegExp("/", "gm"), "_")}/${nind.replace(new RegExp("/", "gm"), "_")}.gtrisutf`, utf16IntString);
			});



			_func(u == "1");
		}

		/**
		 * Removes an element from a specific category.
		 */

		async delete(category, nind, isPreventPrefix, func) {
			let _func = func || function() {}
			let index = "main";

			let u = await accessible.callAsyncJava("callback_databshe", (name, android) => {
				android.deleteData(name, `${category.replace(new RegExp("/", "gm"), "_")}/${nind.replace(new RegExp("/", "gm"), "_")}.gtrisutf`);
			});



			_func(u == "1");

		}

	};
	const DATABASE = (("AndroidIO" in window) ? AndroidStorageManager : NativeLDBManager);
	const databaseManager = new DATABASE();
	const fetchedStorage = {};
	const CONTENT_TYPES = {
		"css": "application/css",
		"xml": "application/xml",
		"js": "application/octet-stream",
		"png": "image/png",
		"html": "application/html",
		"ogg": "application/x-ogg",
		/**ttf: "font/ttf",
		otf: "font/otf",*/
	};



	function dataURIToBinary(dataURI) {
		const BASE64_MARK = ";base64,"
		var base64Index = dataURI.indexOf(BASE64_MARK) + BASE64_MARK.length;
		var base64 = dataURI.substring(base64Index);
		var raw = window.atob(base64);
		var rawLength = raw.length;
		var array = new Uint8Array(new ArrayBuffer(rawLength));

		for (i = 0; i < rawLength; i++) {
			array[i] = raw.charCodeAt(i);
		}
		return array;
	}

	function base64func(blob, call) {
		var reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onloadend = function() {
			var base64 = reader.result;
			call(base64);
		}
	}
	/**
	 * Loads a file by XMLHttpRequest() to the window. 
	 * @param {String} directory
	 * @param {"String"} Response Type
	 * @return {'Response Body'} response
	 */
	const __fetch = (("AndroidIO" in window)) ? ((dir, resptype) => {
		return new Promise(async res => {

			////console.log(dir)
			/*let h = await fetch(BASE_DIRECTORY + "/" + dir);
			let h2 = await h[resptype || "text"]();
			res(h2);*/
			try {
				let dot = dir.split(".");
				let extIndex = dot.length - 1;
				let ext = dot[extIndex];
				let ld = dir.split("./");
				let fullDir = (`${BASE_DIRECTORY.replace("./", "html/")}/${ld[ld.length - 1]}`);
				////console.log((fullDir.replace(new RegExp("//", "gm"), "/")));
				//accessible.log((`${BASE_DIRECTORY.replace("./", "html/")}/${dir.replace("./", "")}`));
				let ba = await accessible.callAsyncJava("callback_getAsset", (_name, android) => {
					try {
						android.getAssetData(_name, fullDir.replace(new RegExp("//", "gm"), "/"));
					} catch (e) {
						//console.log(e.stack);
						accessible.log(e.stack);
					}
				});
				let mimetype = (ext in CONTENT_TYPES) ? CONTENT_TYPES[ext] : "application/octet-stream";
				let str = `data:${mimetype};base64,${ba}`;
				let array = dataURIToBinary(str);
				let blob = new Blob([array], { type: mimetype });


				if (resptype === "blob") {

					res(blob);
				} else if (resptype === "base64") {
					base64func(blob, bsixfour => {
						res(bsixfour);
					})


				} else {
					let text = await blob.text();
					let lml = "";
					for (let k = 0; k < 15; k++) lml += text[k];
					res(text);
				}
			} catch (e) {

			}


		});
	}) : ((_directory, respType) => {
		////console.log(_directory)
		let dir = _directory;
		/*
  let dot = dir.split(".");
 		let extIndex = dot.length - 1;
 		let ext = dot[extIndex];
 		let ld = dir.split("./");
 		let fullDir = (`${BASE_DIRECTORY.replace("./", "html/")}/${ld[ld.length - 1]}`);
 		//console.log((fullDir.replace(new RegExp("//", "gm"), "/")));
 		*/


		let _d = _directory.split("./");

		////console.log(ext)

		////console.log(`${BASE_DIRECTORY.replace("./", "html/")}/${_d[_d.length - 1]}`);


		let directory = (`${BASE_DIRECTORY}/${_d[_d.length - 1]}`).replace(new RegExp("//", "gm"), "/");
		return new Promise((res, rej) => {
			let xhr = new XMLHttpRequest();
			xhr.timeout = 20000;
			xhr.responseType = "arraybuffer";

			xhr.onreadystatechange = async (event) => {
				
				if (event.target.readyState === 4 && event.target.status === 403) {
					//console.error("403: EricLenovo System does not find a file: forbidden or there's an error encountered during the loading of a file.")
					//rej("403: EricLenovo System does not find a file: forbidden or there's an error encountered during the loading of a file.");
					let retry = await __fetch(_directory, respType);
					res(retry);
					return;
				};

				if (event.target.readyState === 4 && event.target.status === 200) {
					////console.log(xhr.response)
					var uint8Array = new Uint8Array(xhr.response);
					var i = uint8Array.length;
					let binaryString = new TextDecoder().decode(uint8Array);

					var base64 = binaryString; //.join('');/**/
					/*let binaryString = xhr.response
					let uint8Array = new Uint8Array(xhr.response.length);
					for (let o = 0; o < xhr.response.length; o++) {
						uint8Array[o] = xhr.response.charCodeAt(o);
					}/**/


					//var base64 = data;
					////console.log(uint8Array, binaryString.substring(0, 27));



					fetchedStorage[directory] = binaryString;

					let type = {
						text: () => binaryString,
						blob: () => new Blob([uint8Array]),
						base64: () => binaryString

					} [respType || "text"];
					////console.log(type())

					res(type());
				};
				if (event.target.readyState === 4 && event.target.status === 404) {

					rej("404: EricLenovo System does not find a file: no such file or directory.");
				};

				

				if (event.target.status !== 0 && event.target.status === 0) {

					//console.log(directory, event.target.readyState, event.target.status, "0: EricLenovo System does not find a file: the static webserver has been shut down.");
				};


			}
			xhr.open('GET', directory, true);
			xhr.send();
		})
	});

	const __initScript = __fetch;

	const _private = {};

	let appInfo = {
		version: "0",
		isUpdated: false,
		isUpdateShow: false,
		agent: window.navigator.userAgent,
		android: "AndroidIO" in window,
		dependencies: {}
	};

	if (appInfo.android) try {
		window.__ANDROID_ACCESSIBLE = accessible;
		accessible.log = (m) => {
			try {
				AndroidIO.showToast(m);
			} catch (e) {

			}
		}
		accessible.classes = {};
		accessible.promises = {};
		accessible.executeResolvePromise = (base, output) => {
			accessible.promises[base].resolve(output);

		};

		accessible.executeRejectPromise = (base, output) => {
			accessible.promises[base].reject(output);
		};

		accessible.callAsyncJava = (name, promise) => {

			return new Promise((res, rej) => {
				let base = `${name}_${~~(Math.random() * 100000)}`;
				accessible.promises[base] = {
					resolve: (l) => {
						res(l);
						delete accessible.promises[base];
					},
					reject: (l) => {
						rej(l);
						delete accessible.promises[base];
					}
				}
				promise(base, AndroidIO || {});


			});
		};

		accessible.callSyncJava = (promise) => {
			promise(AndroidIO || {});
		};

	} catch (e) {
		try {
			
		} catch (e) {};
	}


	/*global.addEventListener("DOMContentLoaded", (event) => {

	});*/

	function launchDatabaseMain(addcats) {
		let categories = ["global"];
		for (let h of addcats) {
			categories.push(h);
		}
		databaseManager.initialize(categories, {
			open: () => {
				//console.error("Database Ready");
				//	console.error(databaseManager.categories);
				launch();
			},
			update: () => {
				//console.log("Database Upgrade");
			}
		});
	}

	function readMetaJSON(json) {
		////console.log(json.database.categories)
		let categories = json.database.categories;
		appInfo.version = json.version;

		////console.log(json);
		let dson = {};



		databaseManager.read("global", "dependencies", async result => {
			try {
				//console.log(result);
				if (typeof result === "undefined") {
					let jsonString = await __fetch("dependencies.json");
					dson = JSON.parse(jsonString);
				} else {
					dson = JSON.parse(result.dependencies.value);
				}

				appInfo.dependencies = dson;
				//console.log(dson);
				launchDatabaseMain(categories);
			} catch (e) {

			}

		});

	}

	function startLaunchInitializer() {

		let isOnline = true || ("AndroidIO" in window) ? true : window.navigator.onLine;

		let json = {};
		if ("AndroidIO" in window) {

		}


		databaseManager.initialize(["global"], {
			open: () => {

				databaseManager.read("global", "metadata", async result => {
					if ("AndroidIO" in window) {

					}
					if (!isOnline) {
						if (typeof result === "undefined") {
							//alert("Internet is OFFLINE. System cannot find app metadata. Failed to load game.");

						} else {
							json = JSON.parse(result.value);
							readMetaJSON(json);
						}
					} else {
						try {
							let jsonString = await __fetch("./metadata.json");
							json = JSON.parse(jsonString);
							let m = "{}";
							//console.log(result, json);
							if (typeof result !== "undefined") {
								m = (result.value);
							}
							let l = JSON.parse(m);

							//let jsonCompare = {};
							if (l.version !== json.version) {
								appInfo.isUpdated = true;
								//console.log("APP UPDATE");
								databaseManager.write("global", "metadata", jsonString);
								/*for (let categ of databaseManager.categories)/**/ databaseManager.readAll("assets", (dele) => {
									for (let k of dele) {
										let h = k.index;
										//console.log(h);
										databaseManager.delete("assets", h);
									}
								})
							}
							readMetaJSON(json);
						} catch (e) {
							//console.log(e.stack)
						}
					}
				});


				//console.log(json, isOnline);
			},
			update: () => {
				//console.log("Database Upgrade");
			}
		});


	}




	/**
	 *Loads an array of scripts containing code, with scoped functions and
	 * variables.
	 */

	function loadScripts(categ, base, files, on) {
		const fileLayer = [];

		let loaded = 0;
		const loadMax = files.length;

		/*databaseManager.readAll(categ, (dele) => {
			for (let shie of dele) {
				let h = shie.index;
				console.log(h);
				databaseManager.delete(categ, h);
			}
		})/**/

		//let handle = {};

		for (let h = 0; h < files.length; h++) {
			let dir = `${base}${base !== "" ? "/"  : ""}${files[h]}.js`;
			databaseManager.read(categ, dir, async (result) => {
				////console.log(result, dir);
				let request = {};
				if (typeof result === "undefined") {
					request = await __fetch(dir);


					databaseManager.write(categ, dir, request);
					////console.log(request);
				} else {
					request = result.value;
				}


				fileLayer[h] = request;
				loaded++;
				if (loaded === loadMax) {
					let str = "";
					for (let b = 0; b < fileLayer.length; b++) {
						//console.log(files[b], fileLayer[b].split("\n").length)
						str += `${fileLayer[b]};;;`;
					}



					let handle = {};

					handle.__checkDependency = (f) => {
						f();
					};
					handle.__BASE_DIRECTORY = BASE_DIRECTORY;

					// //console.log(str);
					//document.body.innerHTML = str.replace(new RegExp("\\n", "gm"), "<br>");
					/*let a = document.createElement("a");
					a.href = URL.createObjectURL(new Blob([str]));
					a.download = "resolve.js";
					a.click();*/
					try {
						let func = new Function(["__private", "database", "xhrFetch", "__initScript", "handle", "appinfo", 'android', 'accessible'], str);
						////console.log(func);
						let exec = func(_private, databaseManager, __fetch, (_base, _files, _on) => loadScripts(`${base}/${_base}`, _files, _on), handle, appInfo, appInfo.android ? AndroidIO : {}, accessible);
						// //console.log(handle)

						on(handle.__setHandle);
					} catch (ee) {
						console.log(ee.stack);
					}
				}


			});
		}
	}
	/**
	 * Specifiable function, launches the main files: index.xml, css, and js.
	 */



	async function launch() {
		//const files = ["main"];
		let query = appInfo.dependencies.start;
		let category = query.category;
		let xml = query.xml,
			css = query.css,
			js = query.js,
			jsfolder = query.script_folder,
			fontfolder = query.font_folder;
		////console.log(query)


		let cnt = 0;
		max = 2, h = {};

		function ons() {
			document.body.innerHTML = h[xml];
			let style = document.createElement("STYLE");
			style.innerHTML = h[css];
			document.head.appendChild(style);
			ems();
		}
		for (let lo of [xml, css]) databaseManager.read(category, lo, (rs) => {
			if (typeof rs !== "undefined") {

			} else {
				__fetch(lo).then(s => {
					h[lo] = s;
					cnt++;
					if (cnt >= max) {
						ons();
					}
				});
			}
		});



		let ems = () => {
			loadScripts(category, jsfolder, js, (init) => {
				//accessible.log("loaded javascript")


				/**/
				const fonts = query.fonts;

				let loaded = 0;
				let loadMax = fonts.length;
				let styles = document.createElement("style");
				for (let g = 0; g < fonts.length; g++) {
					__fetch(`${fontfolder}/${fonts[g].src}`, "blob").then(rl => {
						var reader = new FileReader();
						reader.readAsDataURL(rl);
						////console.log(reader)
						reader.onloadend = rt => {
							////console.log(re);
							let re = reader.result;
							////console.log(re.substring(0,90));
							styles.innerHTML += `
    @font-face {
     font-family: ${fonts[g].name};
     src: url('${re}') format('${fonts[g].type}');
     font-weight: 600;
    }`;

							loaded++;
							if (loaded === loadMax) {
								document.head.appendChild(styles);
								init();
							}
						};
					});
				}

			});
		};



	}

	startLaunchInitializer();

})(window);