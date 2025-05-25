

class FullscreenWindow {
	Page = class {
		constructor(parent) {
			this.parent = parent;
			this.elements = {};
			this.dpadBehavior = {
				type: "branch", //branch, smooth_vertical, smooth_horizontal, two-way
				vertical: null,
				horizontal: null,
				sped: 1
				
			}
			this.json = {
				string: "",
				elements: {},
				definedElementIds: {},
				selectables: [],
				horizontalSelectables: [],
				verticalSelectables: [],
				eventListeners: {},
				lastSelectableX: 0,
				lastSelectableY: 0,
				maxSelectables: 0
			}
			
			this.core = document.createElement("temporary");
			//this.definedElementIds = {};
			this.coreTemp = document.createElement("temporary");
			this.selectableIndex = {
				x: 0,
				y: 0,
				vertical: 0,
				horizontal: 0
			};
			this.scrollableIds = {
				horizontal: "",
				vertical: ""
			};
			this.headerTitle = "";
		}
		loadJSON(jsonString, isNextPage) {
			//console.log(jsonString)
			let json = JSON.parse(jsonString);
			let core = document.createElement("gtris-temporary-core");
			core.innerHTML = "";
			let parents = {};
			let onSelection = () => {
				this.hoverSelectable();
			};
			let defaultSelectable = {
				x: 0,
				y: 0,
				horizontal: 0,
				vertical: 0
			};
			this.dpadBehavior.type = json?.dpad_behavior || "branch";
			let vertical = json?.scroll_vertical_id || "";
			let horizontal = json?.scroll_horizontal_id || "";
			this.scrollableIds.horizontal = horizontal;
			this.scrollableIds.vertical = vertical;
			if (json?.title_lang) this.parent.header.titleValue.innerHTML = (language.translate(json.title_lang, [appinfo.version], ""));
			//let elementUUIDs = {};
			this.jsonRecursion(json.element, (element, parent) => {
				
				let uuid = generateUUID();
				
				let a = document.createElement(element.tag);
				this.elements[uuid] = a;
				this.json.elements[uuid] = element;
				let innerhtml = "";
				async function func(_innerhtml) {
					//let innerhtml = JSON.stringify(_innerhtml);
					let innerhtml = _innerhtml;
					if (element?.markdown) {
						//console.log(innerhtml);
						let arr = _innerhtml.split("\n");
						//console.log(arr)
						let jsa = "";
						for (let ar of arr) {
							let ks = document.createElement("gtris-subdiv");
							ks.style.width = "100%";
							ks.style.height = "auto";
							ks.style.position = "relative";
							ks.style.display = "flex";
							ks.style.flexDirection = "column";
							//ks.style.background = `rgba(${Math.random() * 255}${Math.random() * 255}${Math.random() * 255})`
							
							let indent = 0;
							while (true) {
								if (ar[indent] !== " ") break;
								indent++;
							}
							let trim = ar.trim(); //this deletes leading and trailing spaces 
							
							if (indent > 0) {
								let kksa = document.createElement("gtris-subdiv");
								kksa.style.fontSize = "2.75em";
								kksa.style.width = `${indent * 0.5}em`;
								kksa.style.height = "100%";
								ks.append(kksa);
							}
							
							
							let kksa = document.createElement("gtris-subdiv");
							kksa.style.fontSize = "1em";
							kksa.style.width = `calc(100% - ${indent * 0.5}em)`;
							kksa.style.height = "100%";
							ks.append(kksa);
							
							if (trim.startsWith("=# ")) {
								let mnt = trim.replace("=#", "");
								kksa.style.fontSize = "2.75em";
								//console.log(mnt)
								kksa.innerHTML = mnt;
							} else if (trim.startsWith("## ")) {
								let mnt = trim.replace("## ", "");
								//console.log(mnt)
								kksa.style.fontSize = "1.75em";
								kksa.innerHTML = mnt;
							} else if (trim.startsWith("# ")) {
								let mnt = trim.replace("#\u0020", "");
								kksa.style.fontSize = "2.25em";
								kksa.innerHTML = mnt;
							} else if (trim.startsWith("- ")) {
								let mnt = trim.replace("- ", "");
								kksa.style.fontSize = "1em";
								let svg = "<svg style=\"animation:board-fallrot-finisher-chain 2500ms infinite linear;width:0.75em;height:0.75em;margin-left:0.1em;margin-right:0.1em\" viewBox=\"0 0 60 60\" xmlns='http://www.w3.org/2000/svg' width=60 height=60><polygon style=\"stroke-width:0.1em;stroke:#000;fill:#fff\" points=\"0,20 20,20 20,0 40,0 40,20 60,20 60,40 0,40\"/></svg>"
								kksa.innerHTML = svg + mnt;
							} else {
								kksa.innerHTML = ar;
								if (ar.length == 0) ks.style.height = "0.8em"
							}
							
							
							jsa += ks.outerHTML;
						}
						
						innerhtml = jsa;
					}
					a.innerHTML = innerhtml;
					//console.log(innerhtml)
				}
				
				if ("text_lang" in element) innerhtml = func(language.translate(element.text_lang, [], "no langname"));
				else if ("load_text_lang" in element) {
					try {
						load(language.getLocalizationPath(element.load_text_lang)).then(mm => {
							func(mm);
							//console.log(mm)
						});
						
					} catch (e) {
						
					}
					
					
				} else innerhtml = func(element?.text_raw || "");
				
				
				
				
				let hk = this.json.elements[uuid];
				hk.fontSize = 1;
				hk.width = null;
				hk.height = null;
				hk.typeWidth = -1; //0 = cell, 1: percent of content size
				hk.typeHeight = -1;
				hk.focus_horizontal = "";
				hk.focus_vertical = "";
				hk.selectable = {
					type: "none",
					x: 0,
					y: 0,
					vertical: 0,
					horizontal: 0
				};
				hk.maxSelectable = 0
				hk.functions = {};
				//hk.scrollByUpDown = false;
				
				for (let attrName in hk.attributes) {
					let attr = element.attributes[attrName];
					switch (attrName) {
						case "id": {
							this.json.definedElementIds[attr] = uuid;
							a.setAttribute("ids", attr)
							break;
						}
						case "font_size": {
							hk.fontSize = attr;
							break;
						}
						case "width": {
							hk.width = attr;
							break;
						}
						case "height": {
							hk.height = attr;
							break;
						}
						
						case "width_type": {
							hk.typeWidth = attr;
							break;
						}
						case "height_type": {
							hk.typeHeight = attr;
							break;
						}
						case "scroll_vertical": {
							//let ls = attr.split("default")[0];
							this.dpadBehavior.vertical = a;
							break;
						}
						case "selectable": {
							let ls = attr.split("default")[0];
							let lg = ls.split("|");
							hk.selectable.x = ~~lg[1];
							hk.selectable.y = ~~lg[0];
							hk.selectable.type = "branch";
							
							
							if (attr.includes("default")) {
								
								defaultSelectable.x = ~~lg[1];
								defaultSelectable.y = ~~lg[0];
							}
							break;
						}
						case "selectable_vertical": {
							let ls = attr.split("default")[0];
							hk.selectable.type = "vertical";
							hk.selectable.vertical = ~~ls
							if (attr.includes("default")) {
								defaultSelectable.vertical = ~~ls;
							}
							break;
						}
						case "selectable_horizontal": {
							let ls = attr.split("default")[0];
							hk.selectable.type = "horizontal";
							hk.selectable.horizontal = ~~ls
							if (attr.includes("default")) {
								defaultSelectable.horizontal = ~~ls;
							}
							break;
						}
						case "target_scroll_y": {
							//let ls = at;
							hk.focus_vertical = attr;
						}
						case "target_scroll_x": {
							//let ls = at;
							hk.focus_horizontal = attr;
						}
						case "style": {
							for (let k in attr) {
								let style = attr[k];
								//console.log(a)
								a.style.setProperty(k, style);
							}
							break;
						}
						case "event_functions": {
							for (let k in attr) {
								let str = "";
								
								let el = attr[k];
								let fun = new Function(["__this", "local", "__fsw", "__hover"], el);
								hk.functions[k] = ((event, type) => {
									fun(a, __private, this.parent, () => {
										//console.log(hk.selectable)
										if (hk.selectable.type == "branch") this.hoverSelectable(hk.selectable.y, hk.selectable.x);
										if (hk.selectable.type == "horizontal") this.hoverSelectableX(hk.selectable.horizontal);
										if (hk.selectable.type == "vertical") this.hoverSelectableY(hk.selectable.vertical);
									});
									
									
								});
							}
							break;
						}
						
						case "event_listeners": {
							for (let k in attr) {
								let el = attr[k];
								//this.json.eventListeners[];
								a.addEventListener(k, (ev) => {
									hk.functions[el](ev, k);
								});
							}
							break;
						}
						
					}
				}
				element.uuid = uuid;
				//console.log(a)why
				
			}, {});
			this.jsonRecursion(json.element, (element, parent) => {
				
				
				let parentStr = "core";
				if ("uuid" in parent) {
					parentStr = parent.uuid;
				}
				
				parents[element.uuid] = parentStr
				
			}, {});
			
			for (let elemn in parents) {
				let parent = parents[elemn];
				if (parent == "core") core.appendChild(this.elements[elemn]);
				else this.elements[parent].appendChild(this.elements[elemn]);
				
			}
			//	console.log(core.outerHTML);
			for (let elemn in this.json.elements) {
				let m = this.json.elements[elemn];
				if (m.selectable.type == "branch" && m.selectable.x >= 0 && m.selectable.y >= 0) {
					let selectionYIndex = m.selectable.y;
					if (!this.json.selectables[selectionYIndex]) this.json.selectables[selectionYIndex] = [];
					this.json.selectables[selectionYIndex].push(elemn);
					
				}
				if ((m.selectable.type == "vertical") && m.selectable.vertical >= 0) {
					this.json.verticalSelectables.push(elemn);
				}
				if ((m.selectable.type == "horizontal") && m.selectable.vertical >= 0) {
					this.json.horizontalSelectables.push(elemn);
					
				}
			}
			//console.log(core.outerHTML);
			this.core = core;
			
			switch (this.dpadBehavior.type) {
				case "branch": {
					this.hoverSelectable(defaultSelectable.y, defaultSelectable.x);
					break;
				}
				case "smooth_vertical": {
					this.hoverSelectableX(defaultSelectable.horizontal);
					break;
				}
				case "smooth_horizontal": {
					this.hoverSelectableY(defaultSelectable.vertical);
					break;
				}
				case "horizontal": {
					this.hoverSelectableX(defaultSelectable.horizontal);
					break;
				}
				case "vertical": {
					this.hoverSelectableY(defaultSelectable.vertical);
					break;
				}
			}
			//console.log(core.outerHTML);
			
			//core.innerText=""
			
			
		}
		jsonRecursion(elem, func, parent) {
			func(elem, parent);
			if ("children" in elem)
				for (let k of elem.children) {
					this.jsonRecursion(k, func, elem);
				}
		}
		getElementById(id) {
			return this.json.definedElementIds[id];
		}
		hoverSelectable(indexY, indexX, isSelect) {
			//console.log(this.json.selectables, indexY, indexX)
			//console.log(this.json.selectables);
			if (indexX == -1) {
				let j = 0;
				while (this.json.selectables[indexY][j]) {
					j++;
				}
				indexX = j;
			}
			if (!(this.json.selectables[indexY][indexX])) indexX = 0;
			if (this.json.selectables[indexY] && (this.json.selectables[indexY][indexX])) {
				let lastSelectable = this.json.selectables[this.selectableIndex.y][this.selectableIndex.x];
				//console.log(this.json.elements[lastSelectable])
				this.selectableIndex.x = indexX;
				this.selectableIndex.y = indexY
				
				
				//let lastElem = this.json.selectables[lastSelectable];
				let newElem = this.json.selectables[indexY][indexX];
				let cur = this.elements[newElem];
				let jsoncur = this.json.elements[newElem];
				if ((jsoncur.focus_horizontal !== "") || (jsoncur.focus_vertical !== "")) {
					if (jsoncur.focus_horizontal !== "") {
						let sivArgs = {
							block: "center",
							inline: "nearest",
							behavior: "smooth",
						};
						
						sivArgs.scrollable = this.elements[this.json.definedElementIds[jsoncur.focus_horizontal]];
						cur.scrollIntoView(sivArgs);
					}
					if (jsoncur.focus_vertical !== "") {
						let sivArgs = {
							block: "center",
							inline: "nearest",
							behavior: "smooth",
						};
						
						sivArgs.scrollable = this.elements[this.json.definedElementIds[jsoncur.focus_vertical]];
						
						cur.scrollIntoView(sivArgs);
					}
				}
				if (isSelect) {
					this.json.elements[newElem].functions.select();
					return;
				}
				if ("hoverout" in this.json.elements[lastSelectable]?.functions) this.json.elements[lastSelectable].functions.hoverout();
				this.json.elements[newElem].functions.hoverin();
				//console.log("blyad", newElem)
			}
		}
		hoverSelectableX(index, isSelect) {
			//console.log(this.json.selectables)
			let selSet = this.json.horizontalSelectables;
			if (this.json.horizontalSelectables[index]) {
				let lastSelectable = selSet[this.selectableIndex.horizontal];
				this.selectableIndex.horizontal = index;
				
				
				//let lastElem = this.json.selectables[lastSelectable];
				let newElem = selSet[index];
				let cur = this.elements[newElem];
				let jsoncur = this.json.elements[newElem];
				if ((jsoncur.focus_horizontal !== "") || this.scrollableIds.horizontal) {
					let sivArgs = {
						block: "center",
						inline: "nearest",
						behavior: "smooth",
					};
					if (jsoncur.focus_horizontal !== "") {
						sivArgs.scrollable = this.elements[this.json.definedElementIds[jsoncur.focus_horizontal]];
					} else
					if (this.scrollableIds.horizontal !== "") {
						
						sivArgs.scrollable = this.elements[this.json.definedElementIds[this.scrollableIds.horizontal]];
						
					}
					cur.scrollIntoView(sivArgs);
					
				}
				if (isSelect) {
					this.json.elements[newElem].functions.select();
					return;
				}
				if ("hoverout" in this.json.elements[lastSelectable]?.functions) this.json.elements[lastSelectable].functions.hoverout();
				this.json.elements[newElem].functions.hoverin();
				//console.log("blyad", newElem)
			}
		}
		hoverSelectableY(index, isSelect) {
			//console.log(this.json.selectables)
			let selSet = this.json.verticalSelectables;
			if (this.json.verticalSelectables[index]) {
				let lastSelectable = selSet[this.selectableIndex.vertical];
				this.selectableIndex.vertical = index;
				
				
				//let lastElem = this.json.selectables[lastSelectable];
				let newElem = selSet[index];
				let cur = this.elements[newElem];
				let jsoncur = this.json.elements[newElem];
				if ((jsoncur.focus_vertical !== "") || this.scrollableIds.vertical) {
					let sivArgs = {
						block: "center",
						inline: "nearest",
						behavior: "smooth",
					};
					if (jsoncur.focus_vertical !== "") {
						sivArgs.scrollable = this.elements[this.json.definedElementIds[jsoncur.focus_vertical]];
					} else
					if (this.scrollableIds.vertical !== "") {
						
						sivArgs.scrollable = this.elements[this.json.definedElementIds[this.scrollableIds.vertical]];
						
					}
					cur.scrollIntoView(sivArgs);
					
				}
				
				
				//this.parent.content.innerHTML = this.parent.content.innerHTML.replace("[object Object]", "")
				//console.log(this.parent.content.innerHTML)
				if (isSelect) {
					this.json.elements[newElem].functions.select();
					return;
				}
				if ("hoverout" in this.json.elements[lastSelectable]?.functions) this.json.elements[lastSelectable].functions.hoverout();
				this.json.elements[newElem].functions.hoverin();
				//console.log("blyad", newElem)
			}
		}
		upOrDown(num) {
			//let add = num;
			if (num == 0) return;
			let u = this.dpadBehavior.type;
			if (u === "vertical") {
				u = "smooth_horizontal";
			} else if (u === "horizontal") {
				u = "smooth_vertical";
			}
			switch (u) {
				case "branch": {
					let value = this.selectableIndex.y + num;
					this.hoverSelectable(value, this.selectableIndex.x);
					break;
				}
				
				case "smooth_horizontal": {
					let value = this.selectableIndex.vertical + num;
					this.hoverSelectableY(value);
					break;
					
				}
				case "smooth_vertical": {
					let value = this.selectableIndex.herizontal + num;
					this.hoverSelectableX(value);
					break;
					
				}
				case "vertical": {
					let value = this.selectableIndex.vertical + num;
					this.hoverSelectableY(value);
					break;
					
				}
				case "horizontal": {
					let value = this.selectableIndex.herizontal + num;
					this.hoverSelectableX(value);
					break;
					
				}
			}
		}
		leftOrRight(num) {
			//let add = num;
			if (num == 0) return;
			let u = this.dpadBehavior.type;
			if (u === "vertical") {
				u = "horizontal";
			} else if (u === "horizontal") {
				u = "vertical";
			}
			switch (u) {
				case "branch": {
					let value = this.selectableIndex.x + num;
					this.hoverSelectable(this.selectableIndex.y, value);
					break;
				}
				case "smooth_vertical": {
					let value = this.selectableIndex.horizontal + num;
					this.hoverSelectableX(value);
					break;
					
				}
				
			}
		}
		selectOrBack(num) {
			let u = this.dpadBehavior.type;
			if (u === "vertical") {
				u = "smooth_horizontal";
			} else if (u === "horizontal") {
				u = "smooth_vertical";
			}
			//console.log("select")
			if (num == 1)
				switch (u) {
					case "branch": {
						let value = this.selectableIndex.x;
						this.hoverSelectable(this.selectableIndex.y, value, true);
						break;
					}
					case "smooth_vertical": {
						let value = this.selectableIndex.horizontal;
						this.hoverSelectableX(value, true);
						break;
						
					}
					case "smooth_horizontal": {
						let value = this.selectableIndex.vertical;
						this.hoverSelectableY(value, true);
						break;
						
					}
				}
			else if (num === -1) {
				this.parent.back();
			}
		}
		listen(oneBitkey, type) {
			let v = 0,
				h = 0,
				ab = 0;
			//let oneBitkey = flag;
			if (oneBitkey & this.parent.flags.down) v = 1;
			if (oneBitkey & this.parent.flags.up) v = -1;
			if (oneBitkey & this.parent.flags.left) h = -1;
			if (oneBitkey & this.parent.flags.right) h = 1;
			if (oneBitkey & this.parent.flags.a) ab = 1;
			if (oneBitkey & this.parent.flags.b) ab = -1;
			if (type === "keydown") {
				//console.log(v, h, ab);
				this.upOrDown(v);
				this.leftOrRight(h);
			}
			if (type === "keyup") this.selectOrBack(ab);
		}
		
		update() {
			let u = this.dpadBehavior.type;
			//if (u === "vertical") u = ""
			//console.log(this.core.outerHTML)
			switch (u) {
				case "smooth_horizontal": {
					if (!this.dpadBehavior.horizontal) return;
					let v = 0;
					let oneBitkey = this.parent.bitkey;
					// TODO simulate SOCD controls   lol jk XD
					if (oneBitkey | this.parent.flags.left) v = 1;
					if (oneBitkey | this.parent.flags.right) v = -1;
					
					this.dpadBehavior.horizontal.scrollTop = Math.max(this.dpadBehavior.horizontal.scrollTop + v, 0)
					break;
				}
				case "smooth_vertical": {
					if (!this.dpadBehavior.vertical) return;
					let v = 0;
					let oneBitkey = this.parent.bitkey;
					// TODO simulate SOCD controls   lol jk XD
					if (oneBitkey | this.parent.flags.down) v = 1;
					if (oneBitkey | this.parent.flags.up) v = -1;
					
					this.dpadBehavior.horizontal.scrollTop = Math.max(this.dpadBehavior.vertical.scrollTop + v, 0)
					break;
					
				}
				case "vertical": {
					//if (!this.dpadBehavior.vertical) return;
					let v = 0;
					let oneBitkey = this.parent.bitkey;
					// TODO simulate SOCD controls   lol jk XD
					if (oneBitkey | this.parent.flags.left) v = 1;
					if (oneBitkey | this.parent.flags.right) v = -1;
					
					//this.dpadBehavior.horizontal.scrollTop = Math.max(this.dpadBehavior.horizontal.scrollTop + v, 0)
					break;
				}
				case "horizontal": {
					//if (!this.dpadBehavior.horizontal) return;
					let v = 0;
					let oneBitkey = this.parent.bitkey;
					// TODO simulate SOCD controls   lol jk XD
					if (oneBitkey | this.parent.flags.down) v = 1;
					if (oneBitkey | this.parent.flags.up) v = -1;
					
					//this.dpadBehavior.horizontal.scrollTop = Math.max(this.dpadBehavior.vertical.scrollTop + v, 0)
					break;
					
				}
				
			}
		}
		
		resizeElements(w, h, fs, cs) {
			for (let uuid in this.json.elements) {
				let ref = this.json.elements[uuid];
				let element = this.elements[uuid];
				//console.log(ref)
				
				if (ref.width !== null && ref.typeWidth !== -1) {
					let width = [cs, w / 100][ref.typeWidth] * ref.width;
					element.style.width = width + "px";
				}
				if (ref.height !== null && ref.typeHeight !== -1) {
					let height = [cs, h / 100][ref.typeHeight] * ref.height;
					element.style.height = height + "px";
				}
				
				element.style.fontSize = fs * ref.fontSize + "px";
				//console.log(element.style.width, element.attributes.ids?.value, element.style)
			}
		}
	}
	
	functions = {
		Keybinds: class {
			constructor(p) {
				this.a = p
			}
			static checkKeybindSimilarities(main, keytest, type) {
				let zl = ["general"];
				if (type !== "general") {
					zl.push(type);
				}
				for (let km of zl)
					for (let mk of keypressManager.BIND_NAMES[km]) {
						let lc = main[km][mk].split(keypressManager.STRING_SEPARATOR);
						//console.log(lc)
						for (let sj = 0; sj < lc.length; sj++) {
							let hl = lc[sj];
							if (!(hl in keytest)) keytest[hl] = 1;
							else keytest[hl]++;
						}
					}
				
			}
			static openSettings(type, isReturn) {
				
				//join all keyd first:
				let ja = fsw;
				let b = ja.functions.Keybinds;
				
				let main = menu.storage.getItem('keyboard');
				let data = main[type];
				//console.log(data)
				//EricLenovo
				//detect duplicate keys in one (self) or more (grouped) key flags.
				// multiple keys of the same kind in a single key flag may be possible if either a user data in the database
				// gets edited or the game has a bug. In case this happens, I put an extra code for it.
				
				let keytest = {};
				
				b.checkKeybindSimilarities(main, keytest, type);
				
				let a = fsw;
				let mo = "general";
				if (type !== "general") mo = ["gtris", "blob"][type];
				let test = {};
				let json = {
					"title_lang": "fsw_kb_ig_" + mo,
					"prevent_default": true,
					"dpad_behavior": "vertical",
					"scroll_vertical_id": "scroll_y",
					"element": {}
				};
				json.element = {
					"tag": "gtris-div",
					"attributes": {
						"id": "scroll_y",
						"font_size": 2,
						"width": 100,
						"height": 100,
						"width_type": 1,
						"height_type": 1,
						"style": {
							"display": "block",
							"position": "relative",
							"overflow": "hidden scroll"
						}
					},
					"children": []
				}
				let listIndex = 0;
				for (let y of keypressManager.BIND_NAMES[type]) {
					let _mk = [];
					let lc = data[y].split(keypressManager.STRING_SEPARATOR);
					for (let u of lc) {
						if (u == " ") _mk.push("[SPACE BAR]");
						else _mk.push(u);
					}
					
					
					
					let mk = "";
					let isError = false;
					for (let sj = 0; sj < lc.length; sj++) {
						let hl = lc[sj];
						if ((hl in keytest) && keytest[hl] > 1) isError = true;
						mk += `<span style="padding: 0.4em; margin: 0.6em; background: #646">${_mk[sj]}</span>`;
						if (_mk.length - 1 !== sj) mk += ", ";
					}
					let bg = isError ? "#d66" : "#ddd"
					
					let mjson = {
						
						"tag": "gtris-button",
						"attributes": {
							"font_size": 1,
							"width": 90,
							
							"width_type": 1,
							
							"selectable_vertical": `${listIndex}${listIndex == 0 ? "default":""}`,
							"style": {
								"height": "3em",
								"display": "flex",
								"justify-content": "center",
								"align-items": "center",
								"flex-direction": "column",
								"position": "relative",
								"margin-left": "auto",
								"margin-right": "auto",
								"border": "3px solid #000",
								"background": bg,
								"padding": "0.2em 0.2em 0.2em 0.2em",
								
							},
							"event_functions": {
								"hoverin": "__this.style.background = \"#a3a\";",
								"hoverout": `__this.style.background = \"${bg}\";`,
								"mouseover": "__hover();",
								"select": `__fsw.functions.Keybinds.openFlag(\"${type}\", ${listIndex});`
							},
							
							"event_listeners": {
								"mouseover": "mouseover",
								"click": "select"
							}
						},
						"children": [
						{
							"tag": "gtris-button-text",
							"text_lang": `fsw_kb_ig_${mo}_${y}`,
							"attributes": {
								"font_size": 1.3,
								"style": {
									"width": "auto",
									"height": "calc(100% - 0.9em)",
									"text_align": "center",
									"position": "relative",
									"display": "blcok"
								}
							}
						}]
						
					};
					mjson.children.push(
					{
						"tag": "gtris-button-text",
						"text_raw": mk,
						"attributes": {
							"font_size": 0.9,
							"style": {
								"width": "auto",
								"height": "0.9em",
								"position": "relative"
								
							}
						}
					})
					json.element.children.push(mjson);
					
					listIndex++;
				};
				
				
				if (isReturn) return JSON.stringify(json);
				a.loadPageSync(JSON.stringify(json), void 0);
			}
			
			static openFlag(type, flag, isReturn) {
				
				//join all keyd first:
				let ja = fsw;
				let b = ja.functions.Keybinds;
				
				let main = menu.storage.getItem('keyboard');
				let data = main[type][keypressManager.BIND_NAMES[type][flag]].split(keypressManager.STRING_SEPARATOR);
				//console.log(flag, main, data)
				//EricLenovo
				//detect duplicate keys in one (self) or more (grouped) key flags.
				// multiple keys of the same kind in a single key flag may be possible if either a user data in the database
				// gets edited or the game has a bug. In case this happens, I put an extra code for it.
				
				let keytest = {};
				b.checkKeybindSimilarities(main, keytest, type);
				
				let a = fsw;
				let mo = "general";
				if (type !== "general") mo = ["gtris", "blob"][type];
				
				let mq = keypressManager.BIND_NAMES[type][flag];
				let test = {};
				let json = {
					"title_lang": "fsw_kb_ig_" + mo,
					"prevent_default": true,
					"dpad_behavior": "branch",
					"element": {}
				};
				json.element = {
					"tag": "gtris-div",
					"attributes": {
						"id": "scroll_y",
						"font_size": 2,
						"width": 100,
						"height": 100,
						"width_type": 1,
						"height_type": 1,
						"style": {
							"display": "block",
							"position": "relative",
							"overflow": "hidden scroll"
						}
					},
					"children": []
				};
				//EricLenovo: my stupid SPCK editor had a bug when pretty-printing this
				//so to make this one look neat, I decided to do this.
				//title and description 
				
				//{
				json.element.children.push({
					"tag": "gtris-div",
					"attributes": {
						"font_size": 2,
						"width": 100,
						"width_type": 1,
						"style": {
							"display": "flex",
							"flex-direction": "row",
							"position": "relative",
							height: "auto",
							"justify-content": "center",
							"align-items": "center",
							"overflow": "hidden"
						}
					},
					"children": []
				});
				json.element.children[0].children.push(
				{
					"tag": "gtris-div",
					"attributes": {
						"font_size": 4,
						"style": {
							"display": "flex",
							"flex-direction": "column",
							"position": "relative",
							height: "auto",
							"justify-content": "center",
							"align-items": "center",
						}
					},
					"children": [{
						"tag": "gtris-button-text",
						"text_lang": `fsw_kb_ig_${mo}_${mq}`,
						"attributes": {
							"font_size": 1.215,
							"style": {
								"text_align": "center",
								"position": "relative",
								"text-align": "center",
								"vertical-align": "center",
								"display": "block"
							}
						}
					},
					{
						"tag": "gtris-button-text",
						"text_lang": `fsw_kb_ig_${mo}_${mq}_desc`,
						"attributes": {
							"font_size": 0.9,
							"style": {
								"text_align": "center",
								"position": "relative",
								"text-align": "center",
								"vertical-align": "center",
								"display": "block"
							}
						}
					}]
				})
				//}
				//add button div [1]
				json.element.children.push({
					"tag": "gtris-div",
					"attributes": {
						"font_size": 2,
						"width": 100,
						"width_type": 1,
						"style": {
							"display": "flex",
							"position": "relative",
							height: "auto",
							"justify-content": "center",
							"align-items": "center",
							"overflow": "hidden hidden"
						}
					},
					"children": []
				});
				
				//text for buttons list[2]
				json.element.children.push(
				{
					"tag": "gtris-div",
					"attributes": {
						"font_size": 4,
						"style": {
							"display": "flex",
							"flex-direction": "column",
							"position": "relative",
							height: "auto",
							"justify-content": "center",
							"align-items": "center",
						}
					},
					"children": [{
						"tag": "gtris-button-text",
						"text_lang": `fsw_kb_buttonslist_text`,
						"attributes": {
							"font_size": 1.215,
							"style": {
								"text_align": "center",
								"position": "relative",
								"text-align": "center",
								"vertical-align": "center",
								"display": "block"
							}
						}
					}]
				})
				
				//button list [3]
				json.element.children.push({
					"tag": "gtris-div",
					"attributes": {
						id: "scroll_x",
						"font_size": 2,
						"width": 100,
						"width_type": 1,
						"style": {
							"display": "flex",
							"position": "relative",
							height: "auto",
							"justify-content": "flex-start",
							"align-items": "center",
							"overflow": "scroll hidden"
						}
					},
					"children": []
				});
				//remove button div [4]
				json.element.children.push({
					"tag": "gtris-div",
					"attributes": {
						"font_size": 2,
						"width": 100,
						"width_type": 1,
						"style": {
							"display": "flex",
							"position": "relative",
							height: "auto",
							"justify-content": "center",
							"align-items": "center",
							"overflow": "hidden hidden"
						}
					},
					"children": []
				});
				
				//add button
				json.element.children[1].children.push({
					"tag": "gtris-button",
					"attributes": {
						"font_size": 1,
						"width": 7,
						"height": 2,
						"width_type": 0,
						"height_type": 0,
						"selectable": `0|0default`,
						"style": {
							"display": "flex",
							"justify-content": "center",
							"align-items": "center",
							"flex-direction": "column",
							"position": "relative",
							"margin-left": "auto",
							"margin-right": "auto",
							"border": "3px solid #000",
							"background": "#ddd",
							"padding": "0.2em 0.2em 0.2em 0.2em",
							
						},
						"event_functions": {
							"hoverin": "__this.style.background = \"#a3a\";",
							"hoverout": "__this.style.background = \"#ddd\";",
							"mouseover": "__hover();",
							"select": `__fsw.functions.Keybinds.addButton(${type}, ${flag});`
						},
						
						"event_listeners": {
							"mouseover": "mouseover",
							"click": "select"
						}
					},
					"children": [
					{
						"tag": "gtris-button-text",
						"text_lang": `fsw_kb_ig_add`,
						"attributes": {
							"font_size": 1.215,
							"style": {
								"text_align": "center",
								"position": "relative",
								"display": "blcok"
							}
						}
					}]
					
				});
				let listIndex = 0;
				
				
				for (let u of data) {
					let mk = u;
					if (u == " ") mk = ("[SPACE BAR]")
					
					
					
					let isError = (u in keytest) && keytest[u] > 1;
					
					
					//if () isError = true;
					let bg = isError ? "#d66" : "#ddd";
					
					json.element.children[3].children.push(
					{
						
						"tag": "gtris-button",
						"attributes": {
							"font_size": 1,
							"width": 7,
							"height": 2,
							"width_type": 0,
							"height_type": 0,
							"selectable": `1|${listIndex}`,
							"style": {
								"display": "flex",
								"justify-content": "center",
								"align-items": "center",
								"flex-direction": "column",
								"position": "relative",
								"margin-left": "auto",
								"margin-right": "auto",
								"border": "3px solid #000",
								"background": bg,
								"padding": "0.2em 0.2em 0.2em 0.2em",
								
							},
							"event_functions": {
								"hoverin": "__this.style.background = \"#f3a\";",
								"hoverout": `__this.style.background = \"${bg}\";`,
								"mouseover": "__hover();",
								"select": `__fsw.functions.Keybinds.changeButton(${type}, ${flag}, ${listIndex});`
							},
							
							"event_listeners": {
								"mouseover": "mouseover",
								"click": "select"
							}
						},
						"children": [
						{
							"tag": "gtris-button-text",
							"text_raw": mk,
							"attributes": {
								"font_size": 1.215,
								"style": {
									"text_align": "center",
									"position": "relative",
									"display": "blcok"
								}
							}
						}]
						
					});
					
					listIndex++;
				};
				
				
				if (isReturn) return JSON.stringify(json);
				a.loadPageSync(JSON.stringify(json), void 0);
			}
			
			static addButton(type, flag) {
				let a = fsw;
				let b = a.functions.Keybinds;
				alertWindow.showhide(true);
				let flagname = keypressManager.BIND_NAMES[type][flag];
				
				let _str = language.translate("fsw_kb_adding_text_you", [language.translate(`fsw_kb_ig_${["gtris", "blob"][type]}_${flagname}`)]).split("[nl]").join("<br />");
				
				let str = _str;
				let isUnique = true;
				let started = false;
				let del = 0;
				let saveTime = -1;
				let isKeyDown = false;
				let isKeyUp = false;
				let isDone = false;
				let isAllGood = false;
				let keycode = "";
				let startable = true; //this may be unnecessary
				let kk = menu.storage.getItem("keyboard");
				let data = kk[type][flagname].split(keypressManager.STRING_SEPARATOR);
				function mmm() {
					isDone = true;
					isKeyUp = 1;
					del = 10;
					window.removeEventListener("mousedown", mmm);
				}
				window.addEventListener("mousedown", mmm);
				keypressManager.isKeyBindingMode = true;
				alertWindow.editText(str);
				keypressManager.addListener("adding", (_keycode, type) => {
					if (type == "keydown" && !started) {
						isKeyDown = true;
						started = true;
						keycode = _keycode;
						for (let j of data) {
							if (keycode == j) {
								isUnique = false;
								break;
							}
						}
					}
					if (type == "keyup") {
						if (!started || keycode !== _keycode) {
							
							return;
						}
						isKeyUp = true;
					}
				});
				if (startable) {
					startable = false;
					game.addLoop("addingbind", () => {
						let mstr = "";
						if (!isKeyUp && isKeyDown) {
							del++;
							mstr = language.translate("fsw_kb_adding_binding_you", [keycode]);
							mstr += `<br /><gs style="display: inline-block; position: relative; border: 2px solid #fff; width: ${fsw.width * 0.8}px; height: 1em; text-align: left"><gs style="position: relative; background:#fff; width: ${100 * (del/60)}%; display: inline-block; height: 100%"></gs></gs>`;
							alertWindow.editText(str);
							if (del == 1) {
								menu.playSound("keybindready1");
							}
							if (del == 30) {
								menu.playSound("keybindready2");
							}
							if (del == 60) {
								isDone = true;
								//let isUnique = true;
								if (isUnique) {
									menu.playSound("keybindready3");
									isAllGood = true;
									saveTime = 10;
									data.push(keycode);
									kk[type][flagname] = data.join(keypressManager.STRING_SEPARATOR);
									menu.storage.setItem("keyboard", kk);
									//console.log(kk)
								} else {
									log.error(
										language.translate("error_kb_duplicate", [keycode]),
										language.translate("error_kb_duplicate_desc")
									)
								}
								menu.saveFrame = 10;
							}
						}
						if (isKeyUp) {
							isDone = true;
						}
						if (isDone) {
							do {
								keypressManager.isKeyBindingMode = false;
								if (del >= 60) {
									
									mstr = language.translate("fsw_kb_setting_saving_you", [keycode]);
								} else {
									menu.playSound("keybindcancel");
								}
								
								if (isAllGood) {
									if (saveTime > 0) {
										saveTime--;
										if (saveTime <= 0) {
											
											a.loadPageSync(b.openSettings(type, true), a.pageIndex - 1, true);
											a.loadPageSync(b.openFlag(type, flag, true), a.pageIndex, false);
										}
										else {
											break;
										}
									}
								}
								
								game.removeLoop("addingbind");
								keypressManager.removeListener("adding");
								window.setTimeout(() => {
									
									alertWindow.showhide(false);
								}, 10);
							} while (false);
						}
						
						alertWindow.editText(str + "<br /><br />" + mstr);
					});
				}
			}
			static changeButton(type, flag, index) {
				let a = fsw;
				let b = a.functions.Keybinds;
				alertWindow.showhide(true);
				let flagname = keypressManager.BIND_NAMES[type][flag];
				let kk = menu.storage.getItem("keyboard");
				let data = kk[type][flagname].split(keypressManager.STRING_SEPARATOR);
				let activeKeycode = data[index];
				
				let _str = language.translate("fsw_kb_changing_text_you", [language.translate(`fsw_kb_ig_${["gtris", "blob"][type]}_${flagname}`), activeKeycode]).split("[nl]").join("<br />");
				
				let str = _str;
				let isUnique = true;
				let started = false;
				let del = 0;
				let saveTime = -1;
				let isKeyDown = false;
				let isKeyUp = false;
				let isNothing = false;
				let isDone = false;
				let isAllGood = false;
				let keycode = "";
				let startable = true; //this may be unnecessary
				let isRemove = false;
				let removeIndex = -1;
				keypressManager.isKeyBindingMode = true;
				alertWindow.editText(str);
				function mmm() {
					isDone = true;
					isKeyUp = 1;
					del = 10;
					window.removeEventListener("mousedown", mmm);
				}
				window.addEventListener("mousedown", mmm);
				keypressManager.addListener("changing", (_keycode, type) => {
					if (type == "keydown" && !started) {
						isKeyDown = true;
						started = true;
						keycode = _keycode;
						let i = 0;
						if (activeKeycode == keycode) {
							isRemove = true;
							
						}
						for (let j of data) {
							if (keycode == j) {
								isUnique = false;
								break;
								
								
								
								removeIndex++;
							}
						}
					}
					if (type == "keyup") {
						if (!started || keycode !== _keycode) {
							
							return;
						}
						isKeyUp = true;
					}
				});
				if (startable) {
					startable = false;
					game.addLoop("changingbind", () => {
						let mstr = "";
						if (!isKeyUp && isKeyDown) {
							del++;
							if (isNothing) mstr = language.translate("fsw_kb_changing_nothing_you", [keycode]);
							else if (isRemove) mstr = language.translate("fsw_kb_changing_removing_you", [keycode]);
							else mstr = language.translate("fsw_kb_changing_binding_you", [keycode]);
							mstr += `<br /><gs style="display: inline-block; position: relative; border: 2px solid #fff; width: ${fsw.width * 0.8}px; height: 1em; text-align: left"><gs style="position: relative; background:#fff; width: ${100 * (del/60)}%; display: inline-block; height: 100%"></gs></gs>`;
							alertWindow.editText(str);
							if (del == 1) {
								menu.playSound("keybindready1");
							}
							if (del == 30) {
								menu.playSound("keybindready2");
							}
							if (del == 60) {
								isDone = true;
								//let isUnique = true;
								if (isUnique) {
									menu.playSound("keybindready3");
									isAllGood = true;
									saveTime = 10;
									data[index] = (keycode);
									kk[type][flagname] = data.join(keypressManager.STRING_SEPARATOR);
									menu.storage.setItem("keyboard", kk);
									//console.log(kk)
									menu.saveFrame = 10;
								} else if (!isRemove) {
									log.error(
										language.translate("error_kb_duplicate", [keycode]),
										language.translate("error_kb_duplicate_desc")
									);
								}
								if (isRemove)
									do {
										menu.playSound("keybindready3");
										
										//data = data.splice(index, 1);
										let newData = [];
										for (let i = 0; i < data.length; i++) {
											if (index != i) {
												newData.push(data[i])
											}
										}
										if (newData.length == 0) break;
										isAllGood = true;
										saveTime = 10;
										kk[type][flagname] = newData.join(keypressManager.STRING_SEPARATOR);
										menu.storage.setItem("keyboard", kk);
										menu.saveFrame = 10;
									} while (false);
								
							}
						}
						if (isKeyUp) {
							isDone = true;
						}
						if (isDone) {
							do {
								keypressManager.isKeyBindingMode = false;
								if (del >= 60) {
									
									mstr = language.translate("fsw_kb_setting_saving_you", [keycode]);
								} else {
									menu.playSound("keybindcancel");
								}
								
								if (isAllGood) {
									if (saveTime > 0) {
										saveTime--;
										if (saveTime <= 0) {
											
											a.loadPageSync(b.openSettings(type, true), a.pageIndex - 1, true);
											a.loadPageSync(b.openFlag(type, flag, true), a.pageIndex, false);
										}
										else {
											break;
										}
									}
								}
								
								game.removeLoop("changingbind");
								keypressManager.removeListener("changing");
								window.setTimeout(() => {
									
									alertWindow.showhide(false);
								}, 10);
							} while (false);
						}
						
						alertWindow.editText(str + "<br /><br />" + mstr);
					});
				}
			}
		},
		Changelog: class {
			static start() {
				if (menu.storage.getItem("patchnote_is_seen") === 0) {
					fsw.functions.Changelog.open();
					menu.storage.setItem("patchnote_is_seen", 1);
					menu.saveFrame = 5;
				}
			}
			static open () {
				fsw.loadPage("fsw/changelog.json");
			}
			static full() {
				log.notification(language.translate("fsw_patch_notes_coming_soon"), language.translate("fsw_patch_notes_coming_soon_desc"))
			}
			static close() {
				fsw.close();
				menu.storage.setItem("patchnote_is_seen", 1);
				menu.saveFrame = 5;
			}
		}
		
	};
	
	constructor() {
		this.width = 0;
		this.height = 0;
		this.fontSize = 0;
		this.cellSize = 0;
		this.background = id("GTRIS-SECONDARY-WINDOW-BACKGROUND");
		this.window = id("GTRIS-SECONDARY-WINDOW");
		this.header = {
			main: id("SW-HEADER"),
			logo: id("SW-LOGO-DIV"),
			logoValue: id("SW-LOGO"),
			back: id("SW-BACK-DIV"),
			backValue: id("SW-BACK"),
			title: id("SW-TITLE-DIV"),
			titleValue: id("SW-TITLE"),
		};
		this.content = id("SW-CONTENT");
		this.isShown = false;
		this.isActive = false;
		this.frame = {
			start: -1,
			end: -1,
			"switch": -1,
		};
		this.pages = [];
		this.pageIndex = -1;
		this.bitkey = 0b000000; //baleftrightupdown
		this.lastBitkey = 0;
		this.bindsKeyboard = {
			arrowleft: "left",
			arrowright: "right",
			arrowup: "up",
			arrowdown: "down",
			enter: "a",
			backspace: "b"
		};
		
		this.flags = {
			left: 0b001000,
			right: 0b000100,
			up: 0b000010,
			down: 0b000001,
			a: 0b010000,
			b: 0b100000
		};
		
		this.animations = {
			"switch": new AnimationFrameRenderer(this.content, 0, 30, 1000 / 60, {
				name: "blur-out-in",
				timing: "ease-in-out",
			})
		}
		this.loadList = [];
		this.header.back.addEventListener("click", () => {
			this.back();
		});
		/*
		{
			str: "",
			page: index,
			isOpen: bool
		}
		*/
	}
	
	showhide(bool) {
		this.isShown = bool;
		this.frame.start = -1;
		this.frame.end = -1;
		//this.background.style.display = bool ? "flex" : "flex";
		if (bool) {
			this.background.style.display = "flex"; //completely forgetting the existence of styleelem() wrapper- O^O
			this.frame.start = 25;
		} else {
			this.frame.end = 25;
			this.pages.length = 0;
		}
	}
	
	close() {
		this.showhide(false);
		this.pages.length = 0;
		this.pageIndex = -1;
		this.content.innerHTML = "";
	}
	
	back() {
		if (this.frame.switch > 14) return;
		this.pageIndex--;
		this.pages.pop();
		if (this.pageIndex <= -1) {
			this.showhide(false);
			return;
		}
		this.frame.switch = 30;
		this.animations.switch.play();
	}
	
	startReload(arr) {
		
		let isPage = false;
		for (let m of arr) {
			if (m.isOpen) isPage = true;
		}
		if (!isPage) return;
		this.loadList = arr;
		this.frame.reload = 30;
	}
	
	loadBatch() {
		let currentPage = this.pageIndex;
		for (let m of this.loadList) {
			let a = new this.Page(this);
			a.loadJSON((m.str));
			this.pages[m.page] = a;
		}
		for (let m of this.loadList) {
			if (m.isOpen) {
				currentPage = m.page;
				break;
			}
		}
		this.loadList.length = 0;
		this.pageIndex = currentPage;
		//console.log(this.pages);
	}
	
	loadPage(url, isLoadOnly) {
		load("assets/menu/" + url).then((u) => {
			this.loadPageSync(u, this.pages.length, isLoadOnly);
		});
	}
	
	loadPageSync(jsonString, page, isLoadOnly) {
		this.loadList.push({
			str: jsonString,
			page: page !== void 0 ? page : (this.pages.length + this.loadList.length),
			isOpen: !isLoadOnly
		});
		if (!isLoadOnly) {
			this.frame.switch = 30;
			this.animations.switch.play();
			if (this.loadList.length >= 1 && !this.isShown) this.showhide(true);
		}
	}
	
	keyInput(c, updown) {
		if (!(c in this.bindsKeyboard) || keypressManager.isKeyBindingMode) return;
		let bind = this.bindsKeyboard[c];
		let flag = this.flags[bind];
		
		let currentPage = this.pages[this.pageIndex];
		if (updown === "down") this.bitkey |= flag;
		if (updown === "up") this.bitkey ^= flag;
		let a = this.pages[this?.pageIndex || 0];
		if (!a) return;
		a.listen(flag, updown);
		//console.log(updown, bind, flag)
		if (updown == "keydown") {
			
			
		}
	}
	
	update() {
		if (this.frame.start > 0) {
			this.frame.start--;
			if (this.frame.start == 0) {
				this.isActive = true;
			}
			this.window.style.setProperty("--cb", bezier(this.frame.start / 25, 1, 0, 0, 0, 0, 1));
		}
		if (this.frame.end > 0) {
			this.frame.end--;
			if (this.frame.end == 0) {
				this.isActive = false;
				this.background.style.display = "none";
			}
			//this.window.style.setProperty("--cb", ((25 - this.frame.start) / 25));
			this.window.style.setProperty("--cb", bezier(this.frame.end / 25, 0, 1, 0, 0, 0, 1));
		}
		if (this.frame.switch > 0) {
			this.frame.switch--;
			if (this.frame.switch == 15) {
				if (this.loadList.length) this.loadBatch();
				this.switchPage(this.pageIndex);
			}
			//this.window.style.setProperty("--cb", ((25 - this.frame.start) / 25));
			this.window.style.setProperty("--cb", bezier(this.frame.start / 25, 1, 0, 0, 0, 0, 1));
		}
		this.animations.switch.run();
		if (!this.isActive || this.pageIndex < 0) return;
		this.pages[this?.pageIndex || 0].update();
		this.lastBitkey = this.bitkey;
	}
	
	switchPage(number) {
		let lastPage = this.pageIndex;
		this.pageIndex = number;
		this.content.innerHTML = "";
		if (this.pages?.[lastPage]) {
			//console.log(this.pages[lastPage].core)
			//this.pages[lastPage].core.append(this.content.firstElementChild)
			
		}
		this.content.appendChild((this.pages[number].core));
		//console.log((this.pages[number].elements[Object.keys(this.pages[number].elements)[0]]))
		//console.log(JSON.stringify(this.pages[number].core));
		this.resize(this.width, this.height, this.fontSize, this.cellSize);
		
	}
	
	createElement(json) {
		let a = {};
		a.children = [];
		return a;
	}
	
	resize(fwidth, fheight, fontSize, cellSize) {
		//this.sizes = [fwidth, fheight, fontSize, cellSize];
		this.width = fwidth;
		this.height = fheight;
		this.fontSize = fontSize;
		this.cellSize = cellSize;
		this.background.style.width = ~~fwidth + "px";
		this.background.style.height = ~~fheight + "px";
		let windowWidth = fwidth - cellSize;
		let windowHeight = fheight - cellSize;
		this.window.style.width = "calc(var(--cb) * " + ~~(windowWidth) + "px)";
		this.window.style.height = "calc(var(--cb) * " + ~~(windowHeight) + "px)";
		
		let headerHeight = cellSize * 2.25;
		
		this.header.main.style.width = (~~(windowWidth)) + "px";
		this.header.main.style.height = ~~headerHeight + "px";
		let mwidth = 0;
		for (let hh of ["logo", "back"]) {
			this.header[hh].style.width = ~~headerHeight + "px";
			this.header[hh].style.height = ~~headerHeight + "px";
			mwidth += ~~headerHeight;
		}
		this.header.title.style.width = ~~(windowWidth - mwidth) + "px";
		this.header.title.style.height = ~~headerHeight + "px";
		this.header.titleValue.style.fontSize = ~~(0.8 * fontSize) + "px";
		
		this.content.style.width = ~~(windowWidth) + "px";
		this.content.style.height = ~~(windowHeight - headerHeight) + "px";
		
		for (let h of this.pages) {
			h.resizeElements(windowWidth, windowHeight - headerHeight, fontSize, cellSize);
		}
	}
	
}

const fsw = new FullscreenWindow();

__private.fsw = fsw;tical: ""
			};
			this.headerTitle = "";
		}
		loadJSON(jsonString, isNextPage) {
			//console.log(jsonString)
			let json = JSON.parse(jsonString);
			let core = document.createElement("gtris-temporary-core");
			core.innerHTML = "";
			let parents = {};
			let onSelection = () => {
				this.hoverSelectable();
			};
			let defaultSelectable = {
				x: 0,
				y: 0,
				horizontal: 0,
				vertical: 0
			};
			this.dpadBehavior.type = json?.dpad_behavior || "branch";
			let vertical = json?.scroll_vertical_id || "";
			let horizontal = json?.scroll_horizontal_id || "";
			this.scrollableIds.horizontal = horizontal;
			this.scrollableIds.vertical = vertical;
			if (json?.title_lang) this.parent.header.titleValue.innerHTML = (language.translate(json.title_lang, [appinfo.version], ""));
			//let elementUUIDs = {};
			this.jsonRecursion(json.element, (element, parent) => {
				
				let uuid = generateUUID();
				
				let a = document.createElement(element.tag);
				this.elements[uuid] = a;
				this.json.elements[uuid] = element;
				let innerhtml = "";
				async function func(_innerhtml) {
					//let innerhtml = JSON.stringify(_innerhtml);
					let innerhtml = _innerhtml;
					if (element?.markdown) {
						//console.log(innerhtml);
						let arr = _innerhtml.split("\n");
						//console.log(arr)
						let jsa = "";
						for (let ar of arr) {
							let ks = document.createElement("gtris-subdiv");
							ks.style.width = "100%";
							ks.style.height = "auto";
							ks.style.position = "relative";
							ks.style.display = "flex";
							ks.style.flexDirection = "column";
							//ks.style.background = `rgba(${Math.random() * 255}${Math.random() * 255}${Math.random() * 255})`
							
							let indent = 0;
							while (true) {
								if (ar[indent] !== " ") break;
								indent++;
							}
							let trim = ar.trim(); //this deletes leading and trailing spaces 
							
							if (indent > 0) {
								let kksa = document.createElement("gtris-subdiv");
								kksa.style.fontSize = "2.75em";
								kksa.style.width = `${indent * 0.5}em`;
								kksa.style.height = "100%";
								ks.append(kksa);
							}
							
							
							let kksa = document.createElement("gtris-subdiv");
							kksa.style.fontSize = "1em";
							kksa.style.width = `calc(100% - ${indent * 0.5}em)`;
							kksa.style.height = "100%";
							ks.append(kksa);
							
							if (trim.startsWith("=# ")) {
								let mnt = trim.replace("=#", "");
								kksa.style.fontSize = "2.75em";
								//console.log(mnt)
								kksa.innerHTML = mnt;
							} else if (trim.startsWith("## ")) {
								let mnt = trim.replace("## ", "");
								//console.log(mnt)
								kksa.style.fontSize = "1.75em";
								kksa.innerHTML = mnt;
							} else if (trim.startsWith("# ")) {
								let mnt = trim.replace("#\u0020", "");
								kksa.style.fontSize = "2.25em";
								kksa.innerHTML = mnt;
							} else if (trim.startsWith("- ")) {
								let mnt = trim.replace("- ", "");
								kksa.style.fontSize = "1em";
								let svg = "<svg style=\"animation:board-fallrot-finisher-chain 2500ms infinite linear;width:0.75em;height:0.75em;margin-left:0.1em;margin-right:0.1em\" viewBox=\"0 0 60 60\" xmlns='http://www.w3.org/2000/svg' width=60 height=60><polygon style=\"stroke-width:0.1em;stroke:#000;fill:#fff\" points=\"0,20 20,20 20,0 40,0 40,20 60,20 60,40 0,40\"/></svg>"
								kksa.innerHTML = svg + mnt;
							} else {
								kksa.innerHTML = ar;
								if (ar.length == 0) ks.style.height = "0.8em"
							}
							
							
							jsa += ks.outerHTML;
						}
						
						innerhtml = jsa;
					}
					a.innerHTML = innerhtml;
					//console.log(innerhtml)
				}
				
				if ("text_lang" in element) innerhtml = func(language.translate(element.text_lang, [], "no langname"));
				else if ("load_text_lang" in element) {
					try {
						load(language.getLocalizationPath(element.load_text_lang)).then(mm => {
							func(mm);
							//console.log(mm)
						});
						
					} catch (e) {
						
					}
					
					
				} else innerhtml = func(element?.text_raw || "");
				
				
				
				
				let hk = this.json.elements[uuid];
				hk.fontSize = 1;
				hk.width = null;
				hk.height = null;
				hk.typeWidth = -1; //0 = cell, 1: percent of content size
				hk.typeHeight = -1;
				hk.focus_horizontal = "";
				hk.focus_vertical = "";
				hk.selectable = {
					type: "none",
					x: 0,
					y: 0,
					vertical: 0,
					horizontal: 0
				};
				hk.maxSelectable = 0
				hk.functions = {};
				//hk.scrollByUpDown = false;
				
				for (let attrName in hk.attributes) {
					let attr = element.attributes[attrName];
					switch (attrName) {
						case "id": {
							this.json.definedElementIds[attr] = uuid;
							a.setAttribute("ids", attr)
							break;
						}
						case "font_size": {
							hk.fontSize = attr;
							break;
						}
						case "width": {
							hk.width = attr;
							break;
						}
						case "height": {
							hk.height = attr;
							break;
						}
						
						case "width_type": {
							hk.typeWidth = attr;
							break;
						}
						case "height_type": {
							hk.typeHeight = attr;
							break;
						}
						case "scroll_vertical": {
							//let ls = attr.split("default")[0];
							this.dpadBehavior.vertical = a;
							break;
						}
						case "selectable": {
							let ls = attr.split("default")[0];
							let lg = ls.split("|");
							hk.selectable.x = ~~lg[1];
							hk.selectable.y = ~~lg[0];
							hk.selectable.type = "branch";
							
							
							if (attr.includes("default")) {
								
								defaultSelectable.x = ~~lg[1];
								defaultSelectable.y = ~~lg[0];
							}
							break;
						}
						case "selectable_vertical": {
							let ls = attr.split("default")[0];
							hk.selectable.type = "vertical";
							hk.selectable.vertical = ~~ls
							if (attr.includes("default")) {
								defaultSelectable.vertical = ~~ls;
							}
							break;
						}
						case "selectable_horizontal": {
							let ls = attr.split("default")[0];
							hk.selectable.type = "horizontal";
							hk.selectable.horizontal = ~~ls
							if (attr.includes("default")) {
								defaultSelectable.horizontal = ~~ls;
							}
							break;
						}
						case "target_scroll_y": {
							//let ls = at;
							hk.focus_vertical = attr;
						}
						case "target_scroll_x": {
							//let ls = at;
							hk.focus_horizontal = attr;
						}
						case "style": {
							for (let k in attr) {
								let style = attr[k];
								//console.log(a)
								a.style.setProperty(k, style);
							}
							break;
						}
						case "event_functions": {
							for (let k in attr) {
								let str = "";
								
								let el = attr[k];
								let fun = new Function(["__this", "local", "__fsw", "__hover"], el);
								hk.functions[k] = ((event, type) => {
									fun(a, __private, this.parent, () => {
										//console.log(hk.selectable)
										if (hk.selectable.type == "branch") this.hoverSelectable(hk.selectable.y, hk.selectable.x);
										if (hk.selectable.type == "horizontal") this.hoverSelectableX(hk.selectable.horizontal);
										if (hk.selectable.type == "vertical") this.hoverSelectableY(hk.selectable.vertical);
									});
									
									
								});
							}
							break;
						}
						
						case "event_listeners": {
							for (let k in attr) {
								let el = attr[k];
								//this.json.eventListeners[];
								a.addEventListener(k, (ev) => {
									hk.functions[el](ev, k);
								});
							}
							break;
						}
						
					}
				}
				element.uuid = uuid;
				//console.log(a)why
				
			}, {});
			this.jsonRecursion(json.element, (element, parent) => {
				
				
				let parentStr = "core";
				if ("uuid" in parent) {
					parentStr = parent.uuid;
				}
				
				parents[element.uuid] = parentStr
				
			}, {});
			
			for (let elemn in parents) {
				let parent = parents[elemn];
				if (parent == "core") core.appendChild(this.elements[elemn]);
				else this.elements[parent].appendChild(this.elements[elemn]);
				
			}
			//	console.log(core.outerHTML);
			for (let elemn in this.json.elements) {
				let m = this.json.elements[elemn];
				if (m.selectable.type == "branch" && m.selectable.x >= 0 && m.selectable.y >= 0) {
					let selectionYIndex = m.selectable.y;
					if (!this.json.selectables[selectionYIndex]) this.json.selectables[selectionYIndex] = [];
					this.json.selectables[selectionYIndex].push(elemn);
					
				}
				if ((m.selectable.type == "vertical") && m.selectable.vertical >= 0) {
					this.json.verticalSelectables.push(elemn);
				}
				if ((m.selectable.type == "horizontal") && m.selectable.vertical >= 0) {
					this.json.horizontalSelectables.push(elemn);
					
				}
			}
			//console.log(core.outerHTML);
			this.core = core;
			
			switch (this.dpadBehavior.type) {
				case "branch": {
					this.hoverSelectable(defaultSelectable.y, defaultSelectable.x);
					break;
				}
				case "smooth_vertical": {
					this.hoverSelectableX(defaultSelectable.horizontal);
					break;
				}
				case "smooth_horizontal": {
					this.hoverSelectableY(defaultSelectable.vertical);
					break;
				}
				case "horizontal": {
					this.hoverSelectableX(defaultSelectable.horizontal);
					break;
				}
				case "vertical": {
					this.hoverSelectableY(defaultSelectable.vertical);
					break;
				}
			}
			//console.log(core.outerHTML);
			
			//core.innerText=""
			
			
		}
		jsonRecursion(elem, func, parent) {
			func(elem, parent);
			if ("children" in elem)
				for (let k of elem.children) {
					this.jsonRecursion(k, func, elem);
				}
		}
		getElementById(id) {
			return this.json.definedElementIds[id];
		}
		hoverSelectable(indexY, indexX, isSelect) {
			//console.log(this.json.selectables, indexY, indexX)
			//console.log(this.json.selectables);
			if (indexX == -1) {
				let j = 0;
				while (this.json.selectables[indexY][j]) {
					j++;
				}
				indexX = j;
			}
			if (!(this.json.selectables[indexY][indexX])) indexX = 0;
			if (this.json.selectables[indexY] && (this.json.selectables[indexY][indexX])) {
				let lastSelectable = this.json.selectables[this.selectableIndex.y][this.selectableIndex.x];
				//console.log(this.json.elements[lastSelectable])
				this.selectableIndex.x = indexX;
				this.selectableIndex.y = indexY
				
				
				//let lastElem = this.json.selectables[lastSelectable];
				let newElem = this.json.selectables[indexY][indexX];
				let cur = this.elements[newElem];
				let jsoncur = this.json.elements[newElem];
				if ((jsoncur.focus_horizontal !== "") || (jsoncur.focus_vertical !== "")) {
					if (jsoncur.focus_horizontal !== "") {
						let sivArgs = {
							block: "center",
							inline: "nearest",
							behavior: "smooth",
						};
						
						sivArgs.scrollable = this.elements[this.json.definedElementIds[jsoncur.focus_horizontal]];
						cur.scrollIntoView(sivArgs);
					}
					if (jsoncur.focus_vertical !== "") {
						let sivArgs = {
							block: "center",
							inline: "nearest",
							behavior: "smooth",
						};
						
						sivArgs.scrollable = this.elements[this.json.definedElementIds[jsoncur.focus_vertical]];
						
						cur.scrollIntoView(sivArgs);
					}
				}
				if (isSelect) {
					this.json.elements[newElem].functions.select();
					return;
				}
				if ("hoverout" in this.json.elements[lastSelectable]?.functions) this.json.elements[lastSelectable].functions.hoverout();
				this.json.elements[newElem].functions.hoverin();
				//console.log("blyad", newElem)
			}
		}
		hoverSelectableX(index, isSelect) {
			//console.log(this.json.selectables)
			let selSet = this.json.horizontalSelectables;
			if (this.json.horizontalSelectables[index]) {
				let lastSelectable = selSet[this.selectableIndex.horizontal];
				this.selectableIndex.horizontal = index;
				
				
				//let lastElem = this.json.selectables[lastSelectable];
				let newElem = selSet[index];
				let cur = this.elements[newElem];
				let jsoncur = this.json.elements[newElem];
				if ((jsoncur.focus_horizontal !== "") || this.scrollableIds.horizontal) {
					let sivArgs = {
						block: "center",
						inline: "nearest",
						behavior: "smooth",
					};
					if (jsoncur.focus_horizontal !== "") {
						sivArgs.scrollable = this.elements[this.json.definedElementIds[jsoncur.focus_horizontal]];
					} else
					if (this.scrollableIds.horizontal !== "") {
						
						sivArgs.scrollable = this.elements[this.json.definedElementIds[this.scrollableIds.horizontal]];
						
					}
					cur.scrollIntoView(sivArgs);
					
				}
				if (isSelect) {
					this.json.elements[newElem].functions.select();
					return;
				}
				if ("hoverout" in this.json.elements[lastSelectable]?.functions) this.json.elements[lastSelectable].functions.hoverout();
				this.json.elements[newElem].functions.hoverin();
				//console.log("blyad", newElem)
			}
		}
		hoverSelectableY(index, isSelect) {
			//console.log(this.json.selectables)
			let selSet = this.json.verticalSelectables;
			if (this.json.verticalSelectables[index]) {
				let lastSelectable = selSet[this.selectableIndex.vertical];
				this.selectableIndex.vertical = index;
				
				
				//let lastElem = this.json.selectables[lastSelectable];
				let newElem = selSet[index];
				let cur = this.elements[newElem];
				let jsoncur = this.json.elements[newElem];
				if ((jsoncur.focus_vertical !== "") || this.scrollableIds.vertical) {
					let sivArgs = {
						block: "center",
						inline: "nearest",
						behavior: "smooth",
					};
					if (jsoncur.focus_vertical !== "") {
						sivArgs.scrollable = this.elements[this.json.definedElementIds[jsoncur.focus_vertical]];
					} else
					if (this.scrollableIds.vertical !== "") {
						
						sivArgs.scrollable = this.elements[this.json.definedElementIds[this.scrollableIds.vertical]];
						
					}
					cur.scrollIntoView(sivArgs);
					
				}
				
				
				//this.parent.content.innerHTML = this.parent.content.innerHTML.replace("[object Object]", "")
				//console.log(this.parent.content.innerHTML)
				if (isSelect) {
					this.json.elements[newElem].functions.select();
					return;
				}
				if ("hoverout" in this.json.elements[lastSelectable]?.functions) this.json.elements[lastSelectable].functions.hoverout();
				this.json.elements[newElem].functions.hoverin();
				//console.log("blyad", newElem)
			}
		}
		upOrDown(num) {
			//let add = num;
			if (num == 0) return;
			let u = this.dpadBehavior.type;
			if (u === "vertical") {
				u = "smooth_horizontal";
			} else if (u === "horizontal") {
				u = "smooth_vertical";
			}
			switch (u) {
				case "branch": {
					let value = this.selectableIndex.y + num;
					this.hoverSelectable(value, this.selectableIndex.x);
					break;
				}
				
				case "smooth_horizontal": {
					let value = this.selectableIndex.vertical + num;
					this.hoverSelectableY(value);
					break;
					
				}
				case "smooth_vertical": {
					let value = this.selectableIndex.herizontal + num;
					this.hoverSelectableX(value);
					break;
					
				}
				case "vertical": {
					let value = this.selectableIndex.vertical + num;
					this.hoverSelectableY(value);
					break;
					
				}
				case "horizontal": {
					let value = this.selectableIndex.herizontal + num;
					this.hoverSelectableX(value);
					break;
					
				}
			}
		}
		leftOrRight(num) {
			//let add = num;
			if (num == 0) return;
			let u = this.dpadBehavior.type;
			if (u === "vertical") {
				u = "horizontal";
			} else if (u === "horizontal") {
				u = "vertical";
			}
			switch (u) {
				case "branch": {
					let value = this.selectableIndex.x + num;
					this.hoverSelectable(this.selectableIndex.y, value);
					break;
				}
				case "smooth_vertical": {
					let value = this.selectableIndex.horizontal + num;
					this.hoverSelectableX(value);
					break;
					
				}
				
			}
		}
		selectOrBack(num) {
			let u = this.dpadBehavior.type;
			if (u === "vertical") {
				u = "smooth_horizontal";
			} else if (u === "horizontal") {
				u = "smooth_vertical";
			}
			//console.log("select")
			if (num == 1)
				switch (u) {
					case "branch": {
						let value = this.selectableIndex.x;
						this.hoverSelectable(this.selectableIndex.y, value, true);
						break;
					}
					case "smooth_vertical": {
						let value = this.selectableIndex.horizontal;
						this.hoverSelectableX(value, true);
						break;
						
					}
					case "smooth_horizontal": {
						let value = this.selectableIndex.vertical;
						this.hoverSelectableY(value, true);
						break;
						
					}
				}
			else if (num === -1) {
				this.parent.back();
			}
		}
		listen(oneBitkey, type) {
			let v = 0,
				h = 0,
				ab = 0;
			//let oneBitkey = flag;
			if (oneBitkey & this.parent.flags.down) v = 1;
			if (oneBitkey & this.parent.flags.up) v = -1;
			if (oneBitkey & this.parent.flags.left) h = -1;
			if (oneBitkey & this.parent.flags.right) h = 1;
			if (oneBitkey & this.parent.flags.a) ab = 1;
			if (oneBitkey & this.parent.flags.b) ab = -1;
			if (type === "keydown") {
				//console.log(v, h, ab);
				this.upOrDown(v);
				this.leftOrRight(h);
			}
			if (type === "keyup") this.selectOrBack(ab);
		}
		
		update() {
			let u = this.dpadBehavior.type;
			//if (u === "vertical") u = ""
			//console.log(this.core.outerHTML)
			switch (u) {
				case "smooth_horizontal": {
					if (!this.dpadBehavior.horizontal) return;
					let v = 0;
					let oneBitkey = this.parent.bitkey;
					// TODO simulate SOCD controls   lol jk XD
					if (oneBitkey | this.parent.flags.left) v = 1;
					if (oneBitkey | this.parent.flags.right) v = -1;
					
					this.dpadBehavior.horizontal.scrollTop = Math.max(this.dpadBehavior.horizontal.scrollTop + v, 0)
					break;
				}
				case "smooth_vertical": {
					if (!this.dpadBehavior.vertical) return;
					let v = 0;
					let oneBitkey = this.parent.bitkey;
					// TODO simulate SOCD controls   lol jk XD
					if (oneBitkey | this.parent.flags.down) v = 1;
					if (oneBitkey | this.parent.flags.up) v = -1;
					
					this.dpadBehavior.horizontal.scrollTop = Math.max(this.dpadBehavior.vertical.scrollTop + v, 0)
					break;
					
				}
				case "vertical": {
					//if (!this.dpadBehavior.vertical) return;
					let v = 0;
					let oneBitkey = this.parent.bitkey;
					// TODO simulate SOCD controls   lol jk XD
					if (oneBitkey | this.parent.flags.left) v = 1;
					if (oneBitkey | this.parent.flags.right) v = -1;
					
					//this.dpadBehavior.horizontal.scrollTop = Math.max(this.dpadBehavior.horizontal.scrollTop + v, 0)
					break;
				}
				case "horizontal": {
					//if (!this.dpadBehavior.horizontal) return;
					let v = 0;
					let oneBitkey = this.parent.bitkey;
					// TODO simulate SOCD controls   lol jk XD
					if (oneBitkey | this.parent.flags.down) v = 1;
					if (oneBitkey | this.parent.flags.up) v = -1;
					
					//this.dpadBehavior.horizontal.scrollTop = Math.max(this.dpadBehavior.vertical.scrollTop + v, 0)
					break;
					
				}
				
			}
		}
		
		resizeElements(w, h, fs, cs) {
			for (let uuid in this.json.elements) {
				let ref = this.json.elements[uuid];
				let element = this.elements[uuid];
				//console.log(ref)
				
				if (ref.width !== null && ref.typeWidth !== -1) {
					let width = [cs, w / 100][ref.typeWidth] * ref.width;
					element.style.width = width + "px";
				}
				if (ref.height !== null && ref.typeHeight !== -1) {
					let height = [cs, h / 100][ref.typeHeight] * ref.height;
					element.style.height = height + "px";
				}
				
				element.style.fontSize = fs * ref.fontSize + "px";
				//console.log(element.style.width, element.attributes.ids?.value, element.style)
			}
		}
	}
	
	functions = {
		Keybinds: class {
			constructor(p) {
				this.a = p
			}
			static checkKeybindSimilarities(main, keytest, type) {
				let zl = ["general"];
				if (type !== "general") {
					zl.push(type);
				}
				for (let km of zl)
					for (let mk of keypressManager.BIND_NAMES[km]) {
						let lc = main[km][mk].split(keypressManager.STRING_SEPARATOR);
						//console.log(lc)
						for (let sj = 0; sj < lc.length; sj++) {
							let hl = lc[sj];
							if (!(hl in keytest)) keytest[hl] = 1;
							else keytest[hl]++;
						}
					}
				
			}
			static openSettings(type, isReturn) {
				
				//join all keyd first:
				let ja = fsw;
				let b = ja.functions.Keybinds;
				
				let main = menu.storage.getItem('keyboard');
				let data = main[type];
				//console.log(data)
				//EricLenovo
				//detect duplicate keys in one (self) or more (grouped) key flags.
				// multiple keys of the same kind in a single key flag may be possible if either a user data in the database
				// gets edited or the game has a bug. In case this happens, I put an extra code for it.
				
				let keytest = {};
				
				b.checkKeybindSimilarities(main, keytest, type);
				
				let a = fsw;
				let mo = "general";
				if (type !== "general") mo = ["gtris", "blob"][type];
				let test = {};
				let json = {
					"title_lang": "fsw_kb_ig_" + mo,
					"prevent_default": true,
					"dpad_behavior": "vertical",
					"scroll_vertical_id": "scroll_y",
					"element": {}
				};
				json.element = {
					"tag": "gtris-div",
					"attributes": {
						"id": "scroll_y",
						"font_size": 2,
						"width": 100,
						"height": 100,
						"width_type": 1,
						"height_type": 1,
						"style": {
							"display": "block",
							"position": "relative",
							"overflow": "hidden scroll"
						}
					},
					"children": []
				}
				let listIndex = 0;
				for (let y of keypressManager.BIND_NAMES[type]) {
					let _mk = [];
					let lc = data[y].split(keypressManager.STRING_SEPARATOR);
					for (let u of lc) {
						if (u == " ") _mk.push("[SPACE BAR]");
						else _mk.push(u);
					}
					
					
					
					let mk = "";
					let isError = false;
					for (let sj = 0; sj < lc.length; sj++) {
						let hl = lc[sj];
						if ((hl in keytest) && keytest[hl] > 1) isError = true;
						mk += `<span style="padding: 0.4em; margin: 0.6em; background: #646">${_mk[sj]}</span>`;
						if (_mk.length - 1 !== sj) mk += ", ";
					}
					let bg = isError ? "#d66" : "#ddd"
					
					let mjson = {
						
						"tag": "gtris-button",
						"attributes": {
							"font_size": 1,
							"width": 90,
							
							"width_type": 1,
							
							"selectable_vertical": `${listIndex}${listIndex == 0 ? "default":""}`,
							"style": {
								"height": "3em",
								"display": "flex",
								"justify-content": "center",
								"align-items": "center",
								"flex-direction": "column",
								"position": "relative",
								"margin-left": "auto",
								"margin-right": "auto",
								"border": "3px solid #000",
								"background": bg,
								"padding": "0.2em 0.2em 0.2em 0.2em",
								
							},
							"event_functions": {
								"hoverin": "__this.style.background = \"#a3a\";",
								"hoverout": `__this.style.background = \"${bg}\";`,
								"mouseover": "__hover();",
								"select": `__fsw.functions.Keybinds.openFlag(\"${type}\", ${listIndex});`
							},
							
							"event_listeners": {
								"mouseover": "mouseover",
								"click": "select"
							}
						},
						"children": [
						{
							"tag": "gtris-button-text",
							"text_lang": `fsw_kb_ig_${mo}_${y}`,
							"attributes": {
								"font_size": 1.3,
								"style": {
									"width": "auto",
									"height": "calc(100% - 0.9em)",
									"text_align": "center",
									"position": "relative",
									"display": "blcok"
								}
							}
						}]
						
					};
					mjson.children.push(
					{
						"tag": "gtris-button-text",
						"text_raw": mk,
						"attributes": {
							"font_size": 0.9,
							"style": {
								"width": "auto",
								"height": "0.9em",
								"position": "relative"
								
							}
						}
					})
					json.element.children.push(mjson);
					
					listIndex++;
				};
				
				
				if (isReturn) return JSON.stringify(json);
				a.loadPageSync(JSON.stringify(json), void 0);
			}
			
			static openFlag(type, flag, isReturn) {
				
				//join all keyd first:
				let ja = fsw;
				let b = ja.functions.Keybinds;
				
				let main = menu.storage.getItem('keyboard');
				let data = main[type][keypressManager.BIND_NAMES[type][flag]].split(keypressManager.STRING_SEPARATOR);
				//console.log(flag, main, data)
				//EricLenovo
				//detect duplicate keys in one (self) or more (grouped) key flags.
				// multiple keys of the same kind in a single key flag may be possible if either a user data in the database
				// gets edited or the game has a bug. In case this happens, I put an extra code for it.
				
				let keytest = {};
				b.checkKeybindSimilarities(main, keytest, type);
				
				let a = fsw;
				let mo = "general";
				if (type !== "general") mo = ["gtris", "blob"][type];
				
				let mq = keypressManager.BIND_NAMES[type][flag];
				let test = {};
				let json = {
					"title_lang": "fsw_kb_ig_" + mo,
					"prevent_default": true,
					"dpad_behavior": "branch",
					"element": {}
				};
				json.element = {
					"tag": "gtris-div",
					"attributes": {
						"id": "scroll_y",
						"font_size": 2,
						"width": 100,
						"height": 100,
						"width_type": 1,
						"height_type": 1,
						"style": {
							"display": "block",
							"position": "relative",
							"overflow": "hidden scroll"
						}
					},
					"children": []
				};
				//EricLenovo: my stupid SPCK editor had a bug when pretty-printing this
				//so to make this one look neat, I decided to do this.
				//title and description 
				
				//{
				json.element.children.push({
					"tag": "gtris-div",
					"attributes": {
						"font_size": 2,
						"width": 100,
						"width_type": 1,
						"style": {
							"display": "flex",
							"flex-direction": "row",
							"position": "relative",
							height: "auto",
							"justify-content": "center",
							"align-items": "center",
							"overflow": "hidden"
						}
					},
					"children": []
				});
				json.element.children[0].children.push(
				{
					"tag": "gtris-div",
					"attributes": {
						"font_size": 4,
						"style": {
							"display": "flex",
							"flex-direction": "column",
							"position": "relative",
							height: "auto",
							"justify-content": "center",
							"align-items": "center",
						}
					},
					"children": [{
						"tag": "gtris-button-text",
						"text_lang": `fsw_kb_ig_${mo}_${mq}`,
						"attributes": {
							"font_size": 1.215,
							"style": {
								"text_align": "center",
								"position": "relative",
								"text-align": "center",
								"vertical-align": "center",
								"display": "block"
							}
						}
					},
					{
						"tag": "gtris-button-text",
						"text_lang": `fsw_kb_ig_${mo}_${mq}_desc`,
						"attributes": {
							"font_size": 0.9,
							"style": {
								"text_align": "center",
								"position": "relative",
								"text-align": "center",
								"vertical-align": "center",
								"display": "block"
							}
						}
					}]
				})
				//}
				//add button div [1]
				json.element.children.push({
					"tag": "gtris-div",
					"attributes": {
						"font_size": 2,
						"width": 100,
						"width_type": 1,
						"style": {
							"display": "flex",
							"position": "relative",
							height: "auto",
							"justify-content": "center",
							"align-items": "center",
							"overflow": "hidden hidden"
						}
					},
					"children": []
				});
				
				//text for buttons list[2]
				json.element.children.push(
				{
					"tag": "gtris-div",
					"attributes": {
						"font_size": 4,
						"style": {
							"display": "flex",
							"flex-direction": "column",
							"position": "relative",
							height: "auto",
							"justify-content": "center",
							"align-items": "center",
						}
					},
					"children": [{
						"tag": "gtris-button-text",
						"text_lang": `fsw_kb_buttonslist_text`,
						"attributes": {
							"font_size": 1.215,
							"style": {
								"text_align": "center",
								"position": "relative",
								"text-align": "center",
								"vertical-align": "center",
								"display": "block"
							}
						}
					}]
				})
				
				//button list [3]
				json.element.children.push({
					"tag": "gtris-div",
					"attributes": {
						id: "scroll_x",
						"font_size": 2,
						"width": 100,
						"width_type": 1,
						"style": {
							"display": "flex",
							"position": "relative",
							height: "auto",
							"justify-content": "flex-start",
							"align-items": "center",
							"overflow": "scroll hidden"
						}
					},
					"children": []
				});
				//remove button div [4]
				json.element.children.push({
					"tag": "gtris-div",
					"attributes": {
						"font_size": 2,
						"width": 100,
						"width_type": 1,
						"style": {
							"display": "flex",
							"position": "relative",
							height: "auto",
							"justify-content": "center",
							"align-items": "center",
							"overflow": "hidden hidden"
						}
					},
					"children": []
				});
				
				//add button
				json.element.children[1].children.push({
					"tag": "gtris-button",
					"attributes": {
						"font_size": 1,
						"width": 7,
						"height": 2,
						"width_type": 0,
						"height_type": 0,
						"selectable": `0|0default`,
						"style": {
							"display": "flex",
							"justify-content": "center",
							"align-items": "center",
							"flex-direction": "column",
							"position": "relative",
							"margin-left": "auto",
							"margin-right": "auto",
							"border": "3px solid #000",
							"background": "#ddd",
							"padding": "0.2em 0.2em 0.2em 0.2em",
							
						},
						"event_functions": {
							"hoverin": "__this.style.background = \"#a3a\";",
							"hoverout": "__this.style.background = \"#ddd\";",
							"mouseover": "__hover();",
							"select": `__fsw.functions.Keybinds.addButton(${type}, ${flag});`
						},
						
						"event_listeners": {
							"mouseover": "mouseover",
							"click": "select"
						}
					},
					"children": [
					{
						"tag": "gtris-button-text",
						"text_lang": `fsw_kb_ig_add`,
						"attributes": {
							"font_size": 1.215,
							"style": {
								"text_align": "center",
								"position": "relative",
								"display": "blcok"
							}
						}
					}]
					
				});
				let listIndex = 0;
				
				
				for (let u of data) {
					let mk = u;
					if (u == " ") mk = ("[SPACE BAR]")
					
					
					
					let isError = (u in keytest) && keytest[u] > 1;
					
					
					//if () isError = true;
					let bg = isError ? "#d66" : "#ddd";
					
					json.element.children[3].children.push(
					{
						
						"tag": "gtris-button",
						"attributes": {
							"font_size": 1,
							"width": 7,
							"height": 2,
							"width_type": 0,
							"height_type": 0,
							"selectable": `1|${listIndex}`,
							"style": {
								"display": "flex",
								"justify-content": "center",
								"align-items": "center",
								"flex-direction": "column",
								"position": "relative",
								"margin-left": "auto",
								"margin-right": "auto",
								"border": "3px solid #000",
								"background": bg,
								"padding": "0.2em 0.2em 0.2em 0.2em",
								
							},
							"event_functions": {
								"hoverin": "__this.style.background = \"#f3a\";",
								"hoverout": `__this.style.background = \"${bg}\";`,
								"mouseover": "__hover();",
								"select": `__fsw.functions.Keybinds.changeButton(${type}, ${flag}, ${listIndex});`
							},
							
							"event_listeners": {
								"mouseover": "mouseover",
								"click": "select"
							}
						},
						"children": [
						{
							"tag": "gtris-button-text",
							"text_raw": mk,
							"attributes": {
								"font_size": 1.215,
								"style": {
									"text_align": "center",
									"position": "relative",
									"display": "blcok"
								}
							}
						}]
						
					});
					
					listIndex++;
				};
				
				
				if (isReturn) return JSON.stringify(json);
				a.loadPageSync(JSON.stringify(json), void 0);
			}
			
			static addButton(type, flag) {
				let a = fsw;
				let b = a.functions.Keybinds;
				alertWindow.showhide(true);
				let flagname = keypressManager.BIND_NAMES[type][flag];
				
				let _str = language.translate("fsw_kb_adding_text_you", [language.translate(`fsw_kb_ig_${["gtris", "blob"][type]}_${flagname}`)]).split("[nl]").join("<br />");
				
				let str = _str;
				let isUnique = true;
				let started = false;
				let del = 0;
				let saveTime = -1;
				let isKeyDown = false;
				let isKeyUp = false;
				let isDone = false;
				let isAllGood = false;
				let keycode = "";
				let startable = true; //this may be unnecessary
				let kk = menu.storage.getItem("keyboard");
				let data = kk[type][flagname].split(keypressManager.STRING_SEPARATOR);
				function mmm() {
					isDone = true;
					isKeyUp = 1;
					del = 10;
					window.removeEventListener("click", mmm);
				}
				window.addEventListener("mousedown", mmm);
				keypressManager.isKeyBindingMode = true;
				alertWindow.editText(str);
				keypressManager.addListener("adding", (_keycode, type) => {
					if (type == "keydown" && !started) {
						isKeyDown = true;
						started = true;
						keycode = _keycode;
						for (let j of data) {
							if (keycode == j) {
								isUnique = false;
								break;
							}
						}
					}
					if (type == "keyup") {
						if (!started || keycode !== _keycode) {
							
							return;
						}
						isKeyUp = true;
					}
				});
				if (startable) {
					startable = false;
					game.addLoop("addingbind", () => {
						let mstr = "";
						if (!isKeyUp && isKeyDown) {
							del++;
							mstr = language.translate("fsw_kb_adding_binding_you", [keycode]);
							mstr += `<br /><gs style="display: inline-block; position: relative; border: 2px solid #fff; width: ${fsw.width * 0.8}px; height: 1em; text-align: left"><gs style="position: relative; background:#fff; width: ${100 * (del/60)}%; display: inline-block; height: 100%"></gs></gs>`;
							alertWindow.editText(str);
							if (del == 1) {
								menu.playSound("keybindready1");
							}
							if (del == 30) {
								menu.playSound("keybindready2");
							}
							if (del == 60) {
								isDone = true;
								//let isUnique = true;
								if (isUnique) {
									menu.playSound("keybindready3");
									isAllGood = true;
									saveTime = 10;
									data.push(keycode);
									kk[type][flagname] = data.join(keypressManager.STRING_SEPARATOR);
									menu.storage.setItem("keyboard", kk);
									//console.log(kk)
								} else {
									log.error(
										language.translate("error_kb_duplicate", [keycode]),
										language.translate("error_kb_duplicate_desc")
									)
								}
								menu.saveFrame = 10;
							}
						}
						if (isKeyUp) {
							isDone = true;
						}
						if (isDone) {
							do {
								keypressManager.isKeyBindingMode = false;
								if (del >= 60) {
									
									mstr = language.translate("fsw_kb_setting_saving_you", [keycode]);
								} else {
									menu.playSound("keybindcancel");
								}
								
								if (isAllGood) {
									if (saveTime > 0) {
										saveTime--;
										if (saveTime <= 0) {
											
											a.loadPageSync(b.openSettings(type, true), a.pageIndex - 1, true);
											a.loadPageSync(b.openFlag(type, flag, true), a.pageIndex, false);
										}
										else {
											break;
										}
									}
								}
								
								game.removeLoop("addingbind");
								keypressManager.removeListener("adding");
								window.setTimeout(() => {
									
									alertWindow.showhide(false);
								}, 10);
							} while (false);
						}
						
						alertWindow.editText(str + "<br /><br />" + mstr);
					});
				}
			}
			static changeButton(type, flag, index) {
				let a = fsw;
				let b = a.functions.Keybinds;
				alertWindow.showhide(true);
				let flagname = keypressManager.BIND_NAMES[type][flag];
				let kk = menu.storage.getItem("keyboard");
				let data = kk[type][flagname].split(keypressManager.STRING_SEPARATOR);
				let activeKeycode = data[index];
				
				let _str = language.translate("fsw_kb_changing_text_you", [language.translate(`fsw_kb_ig_${["gtris", "blob"][type]}_${flagname}`), activeKeycode]).split("[nl]").join("<br />");
				
				let str = _str;
				let isUnique = true;
				let started = false;
				let del = 0;
				let saveTime = -1;
				let isKeyDown = false;
				let isKeyUp = false;
				let isNothing = false;
				let isDone = false;
				let isAllGood = false;
				let keycode = "";
				let startable = true; //this may be unnecessary
				let isRemove = false;
				let removeIndex = -1;
				keypressManager.isKeyBindingMode = true;
				alertWindow.editText(str);
				function mmm() {
					isDone = true;
					isKeyUp = 1;
					del = 10;
					window.removeEventListener("mousedown", mmm);
				}
				window.addEventListener("click", mmm);
				keypressManager.addListener("changing", (_keycode, type) => {
					if (type == "keydown" && !started) {
						isKeyDown = true;
						started = true;
						keycode = _keycode;
						let i = 0;
						if (activeKeycode == keycode) {
							isRemove = true;
							
						}
						for (let j of data) {
							if (keycode == j) {
								isUnique = false;
								break;
								
								
								
								removeIndex++;
							}
						}
					}
					if (type == "keyup") {
						if (!started || keycode !== _keycode) {
							
							return;
						}
						isKeyUp = true;
					}
				});
				if (startable) {
					startable = false;
					game.addLoop("changingbind", () => {
						let mstr = "";
						if (!isKeyUp && isKeyDown) {
							del++;
							if (isNothing) mstr = language.translate("fsw_kb_changing_nothing_you", [keycode]);
							else if (isRemove) mstr = language.translate("fsw_kb_changing_removing_you", [keycode]);
							else mstr = language.translate("fsw_kb_changing_binding_you", [keycode]);
							mstr += `<br /><gs style="display: inline-block; position: relative; border: 2px solid #fff; width: ${fsw.width * 0.8}px; height: 1em; text-align: left"><gs style="position: relative; background:#fff; width: ${100 * (del/60)}%; display: inline-block; height: 100%"></gs></gs>`;
							alertWindow.editText(str);
							if (del == 1) {
								menu.playSound("keybindready1");
							}
							if (del == 30) {
								menu.playSound("keybindready2");
							}
							if (del == 60) {
								isDone = true;
								//let isUnique = true;
								if (isUnique) {
									menu.playSound("keybindready3");
									isAllGood = true;
									saveTime = 10;
									data[index] = (keycode);
									kk[type][flagname] = data.join(keypressManager.STRING_SEPARATOR);
									menu.storage.setItem("keyboard", kk);
									//console.log(kk)
									menu.saveFrame = 10;
								} else if (!isRemove) {
									log.error(
										language.translate("error_kb_duplicate", [keycode]),
										language.translate("error_kb_duplicate_desc")
									);
								}
								if (isRemove)
									do {
										menu.playSound("keybindready3");
										
										//data = data.splice(index, 1);
										let newData = [];
										for (let i = 0; i < data.length; i++) {
											if (index != i) {
												newData.push(data[i])
											}
										}
										if (newData.length == 0) break;
										isAllGood = true;
										saveTime = 10;
										kk[type][flagname] = newData.join(keypressManager.STRING_SEPARATOR);
										menu.storage.setItem("keyboard", kk);
										menu.saveFrame = 10;
									} while (false);
								
							}
						}
						if (isKeyUp) {
							isDone = true;
						}
						if (isDone) {
							do {
								keypressManager.isKeyBindingMode = false;
								if (del >= 60) {
									
									mstr = language.translate("fsw_kb_setting_saving_you", [keycode]);
								} else {
									menu.playSound("keybindcancel");
								}
								
								if (isAllGood) {
									if (saveTime > 0) {
										saveTime--;
										if (saveTime <= 0) {
											
											a.loadPageSync(b.openSettings(type, true), a.pageIndex - 1, true);
											a.loadPageSync(b.openFlag(type, flag, true), a.pageIndex, false);
										}
										else {
											break;
										}
									}
								}
								
								game.removeLoop("changingbind");
								keypressManager.removeListener("changing");
								window.setTimeout(() => {
									
									alertWindow.showhide(false);
								}, 10);
							} while (false);
						}
						
						alertWindow.editText(str + "<br /><br />" + mstr);
					});
				}
			}
		},
		Changelog: class {
			static start() {
				if (menu.storage.getItem("patchnote_is_seen") === 0) {
					fsw.functions.Changelog.open();
					menu.storage.setItem("patchnote_is_seen", 1);
					menu.saveFrame = 5;
				}
			}
			static open () {
				fsw.loadPage("fsw/changelog.json");
			}
			static full() {
				log.notification(language.translate("fsw_patch_notes_coming_soon"), language.translate("fsw_patch_notes_coming_soon_desc"))
			}
			static close() {
				fsw.close();
				menu.storage.setItem("patchnote_is_seen", 1);
				menu.saveFrame = 5;
			}
		}
		
	};
	
	constructor() {
		this.width = 0;
		this.height = 0;
		this.fontSize = 0;
		this.cellSize = 0;
		this.background = id("GTRIS-SECONDARY-WINDOW-BACKGROUND");
		this.window = id("GTRIS-SECONDARY-WINDOW");
		this.header = {
			main: id("SW-HEADER"),
			logo: id("SW-LOGO-DIV"),
			logoValue: id("SW-LOGO"),
			back: id("SW-BACK-DIV"),
			backValue: id("SW-BACK"),
			title: id("SW-TITLE-DIV"),
			titleValue: id("SW-TITLE"),
		};
		this.content = id("SW-CONTENT");
		this.isShown = false;
		this.isActive = false;
		this.frame = {
			start: -1,
			end: -1,
			"switch": -1,
		};
		this.pages = [];
		this.pageIndex = -1;
		this.bitkey = 0b000000; //baleftrightupdown
		this.lastBitkey = 0;
		this.bindsKeyboard = {
			arrowleft: "left",
			arrowright: "right",
			arrowup: "up",
			arrowdown: "down",
			enter: "a",
			backspace: "b"
		};
		
		this.flags = {
			left: 0b001000,
			right: 0b000100,
			up: 0b000010,
			down: 0b000001,
			a: 0b010000,
			b: 0b100000
		};
		
		this.animations = {
			"switch": new AnimationFrameRenderer(this.content, 0, 30, 1000 / 60, {
				name: "blur-out-in",
				timing: "ease-in-out",
			})
		}
		this.loadList = [];
		this.header.back.addEventListener("click", () => {
			this.back();
		});
		/*
		{
			str: "",
			page: index,
			isOpen: bool
		}
		*/
	}
	
	showhide(bool) {
		this.isShown = bool;
		this.frame.start = -1;
		this.frame.end = -1;
		//this.background.style.display = bool ? "flex" : "flex";
		if (bool) {
			this.background.style.display = "flex"; //completely forgetting the existence of styleelem() wrapper- O^O
			this.frame.start = 25;
		} else {
			this.frame.end = 25;
			this.pages.length = 0;
		}
	}
	
	close() {
		this.showhide(false);
		this.pages.length = 0;
		this.pageIndex = -1;
		this.content.innerHTML = "";
	}
	
	back() {
		if (this.frame.switch > 14) return;
		this.pageIndex--;
		this.pages.pop();
		if (this.pageIndex <= -1) {
			this.showhide(false);
			return;
		}
		this.frame.switch = 30;
		this.animations.switch.play();
	}
	
	startReload(arr) {
		
		let isPage = false;
		for (let m of arr) {
			if (m.isOpen) isPage = true;
		}
		if (!isPage) return;
		this.loadList = arr;
		this.frame.reload = 30;
	}
	
	loadBatch() {
		let currentPage = this.pageIndex;
		for (let m of this.loadList) {
			let a = new this.Page(this);
			a.loadJSON((m.str));
			this.pages[m.page] = a;
		}
		for (let m of this.loadList) {
			if (m.isOpen) {
				currentPage = m.page;
				break;
			}
		}
		this.loadList.length = 0;
		this.pageIndex = currentPage;
		//console.log(this.pages);
	}
	
	loadPage(url, isLoadOnly) {
		load("assets/menu/" + url).then((u) => {
			this.loadPageSync(u, this.pages.length, isLoadOnly);
		});
	}
	
	loadPageSync(jsonString, page, isLoadOnly) {
		this.loadList.push({
			str: jsonString,
			page: page !== void 0 ? page : (this.pages.length + this.loadList.length),
			isOpen: !isLoadOnly
		});
		if (!isLoadOnly) {
			this.frame.switch = 30;
			this.animations.switch.play();
			if (this.loadList.length >= 1 && !this.isShown) this.showhide(true);
		}
	}
	
	keyInput(c, updown) {
		if (!(c in this.bindsKeyboard) || keypressManager.isKeyBindingMode) return;
		let bind = this.bindsKeyboard[c];
		let flag = this.flags[bind];
		
		let currentPage = this.pages[this.pageIndex];
		if (updown === "down") this.bitkey |= flag;
		if (updown === "up") this.bitkey ^= flag;
		let a = this.pages[this?.pageIndex || 0];
		if (!a) return;
		a.listen(flag, updown);
		//console.log(updown, bind, flag)
		if (updown == "keydown") {
			
			
		}
	}
	
	update() {
		if (this.frame.start > 0) {
			this.frame.start--;
			if (this.frame.start == 0) {
				this.isActive = true;
			}
			this.window.style.setProperty("--cb", bezier(this.frame.start / 25, 1, 0, 0, 0, 0, 1));
		}
		if (this.frame.end > 0) {
			this.frame.end--;
			if (this.frame.end == 0) {
				this.isActive = false;
				this.background.style.display = "none";
			}
			//this.window.style.setProperty("--cb", ((25 - this.frame.start) / 25));
			this.window.style.setProperty("--cb", bezier(this.frame.end / 25, 0, 1, 0, 0, 0, 1));
		}
		if (this.frame.switch > 0) {
			this.frame.switch--;
			if (this.frame.switch == 15) {
				if (this.loadList.length) this.loadBatch();
				this.switchPage(this.pageIndex);
			}
			//this.window.style.setProperty("--cb", ((25 - this.frame.start) / 25));
			this.window.style.setProperty("--cb", bezier(this.frame.start / 25, 1, 0, 0, 0, 0, 1));
		}
		this.animations.switch.run();
		if (!this.isActive || this.pageIndex < 0) return;
		this.pages[this?.pageIndex || 0].update();
		this.lastBitkey = this.bitkey;
	}
	
	switchPage(number) {
		let lastPage = this.pageIndex;
		this.pageIndex = number;
		this.content.innerHTML = "";
		if (this.pages?.[lastPage]) {
			//console.log(this.pages[lastPage].core)
			//this.pages[lastPage].core.append(this.content.firstElementChild)
			
		}
		this.content.appendChild((this.pages[number].core));
		//console.log((this.pages[number].elements[Object.keys(this.pages[number].elements)[0]]))
		//console.log(JSON.stringify(this.pages[number].core));
		this.resize(this.width, this.height, this.fontSize, this.cellSize);
		
	}
	
	createElement(json) {
		let a = {};
		a.children = [];
		return a;
	}
	
	resize(fwidth, fheight, fontSize, cellSize) {
		//this.sizes = [fwidth, fheight, fontSize, cellSize];
		this.width = fwidth;
		this.height = fheight;
		this.fontSize = fontSize;
		this.cellSize = cellSize;
		this.background.style.width = ~~fwidth + "px";
		this.background.style.height = ~~fheight + "px";
		let windowWidth = fwidth - cellSize;
		let windowHeight = fheight - cellSize;
		this.window.style.width = "calc(var(--cb) * " + ~~(windowWidth) + "px)";
		this.window.style.height = "calc(var(--cb) * " + ~~(windowHeight) + "px)";
		
		let headerHeight = cellSize * 2.25;
		
		this.header.main.style.width = (~~(windowWidth)) + "px";
		this.header.main.style.height = ~~headerHeight + "px";
		let mwidth = 0;
		for (let hh of ["logo", "back"]) {
			this.header[hh].style.width = ~~headerHeight + "px";
			this.header[hh].style.height = ~~headerHeight + "px";
			mwidth += ~~headerHeight;
		}
		this.header.title.style.width = ~~(windowWidth - mwidth) + "px";
		this.header.title.style.height = ~~headerHeight + "px";
		this.header.titleValue.style.fontSize = ~~(0.8 * fontSize) + "px";
		
		this.content.style.width = ~~(windowWidth) + "px";
		this.content.style.height = ~~(windowHeight - headerHeight) + "px";
		
		for (let h of this.pages) {
			h.resizeElements(windowWidth, windowHeight - headerHeight, fontSize, cellSize);
		}
	}
	
}

const fsw = new FullscreenWindow();

__private.fsw = fsw;