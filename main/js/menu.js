const menu = new class {
	#charselectCreateSelector(name, isAi) {
		return {
			version: 0,
			selection: 0,
			mode: 0,
			activeControl: 0,
			isOK: 0,
			lastSelection: 0,
			name: name,
			isAi: isAi,
			canOK: false
		};
	}

	#SelectionGroup = class {
		constructor(parent, parameters) {
			this.parent = parent;
			this.selectedIndex = 0;
			this.isActive = false;
			this.entities = [];
			this.selectables = [];
			this.mainElememt = parameters.element;
		}

		changeSelectables(a) {
			this.selectables.length = 0;
			for (let h of a.selectables) {
				this.selectables.push(this.entities[h]);
			}
			this.selectedIndex = a.default || 0;
		}

		showHide(bool) {

		}

	};

	#Selectable = class {
		constructor(parent, parameters) {
			this.parent = parent;
			this.parameters = parameters;
			this.string = "[No Name]";
			if ("string" in parameters) {
				this.string = language.translate(parameters.string);
			}
			if ("raw_string" in parameters) {
				this.string = parameters.raw_string;
			}
			this.descProps = [];
			this.items = [];
			this.current = 0;
			if ("property" in parameters) {
				this.current = parent.storage.getItem(parameters.property, 0);
				if (this.parameters.type.indexOf("session") !== -1) {
					this.current = parent.sessionStorage.getItem(parameters.property, 0);
				}
			}
			if (parameters.type === "range_list_specific") {
				//console.log("specific" + JSON.stringify(parameters));

				for (let j of this.parent.storage.getList(parameters.property).choices) {
					//console.log(j, language.settingTranslate(j)[0])
					this.items.push(language.settingTranslate(j)[0]);
				}
			}
			this.description = "";
			if ("desc" in parameters) {
				let k = language.translate(parameters.desc);
				let mm = k.split("$<");
				for (let j = 0; j < mm.length; j++) {
					let r = mm[j].split(">")[0];
					if (this.descProps.indexOf(r) === -1) this.descProps.push(r);
				}

				for (let g of this.descProps) {
					let temp = k.replace(new RegExp(`\\$\\<${g}\\>`, "gm"), this.parent.storage.getItem(g));
					k = temp;
				}
				this.description = k;
			}
			if ("raw_desc" in parameters) {
				this.description = parameters.raw_desc;
			}
		}
		select() {
			let a = this.parameters;
			if (a.type === "button") switch (a.action) {
				case "submenu": {
					this.parent.changeMenuAsync(a.submenu, a.backable);
					break;
				}

				case "submenu_sync": {
					this.parent.changeMenu(a.submenu, a.backable, false);
					break;
				}

				case "unpause": {
					this.parent.game.unpauseGame();

					break;
				}

				case "restart": {
					this.parent.game.startGameSet("restart");

					break;
				}

				case "end": {
					game.endGame(true);
					break;
				}

				case "mainmenu": {
					this.goToMainMenu();
					break;
				}

				case "init": {
					let param = JSON.parse(JSON.stringify(a.charselect_param));
					this.parent.characterMenu.setParameters(param);
					this.parent.characterMenu.showHide(1);
					this.parent.setInit(a.init);
					this.parent.characterMenu.parameters.modeparams.length = 0;
					for (let z of a.mode_param) this.parent.characterMenu.parameters.modeparams.push(z);
					//m.event_listeners.click.func = loo; //menu_global.game.initialize(${g.init})
					break;
				}

				case "actualinit": {
					game.startGameSet("actual");
					break;
				}
				case "function": {
					let result = a.function;
					if ("args" in a) {
						let args = JSON.parse(JSON.stringify(g.args));
						let ii = Object.keys(args)
						for (let v = 0; v < ii.length; v++) {
							let varInstance = args[ii[v]];
							let placeholder = `#par\=${ii[v]}`;
							let regExp = new RegExp(placeholder, "gm");
							result = result.replace(regExp, varInstance);
						}
					}

					let ne = new Function(["menu_global", "evt"], result);
					//j.__event_functions[ats] = (event) => {
					ne(__private.menu, event);
					//	}
					break;
				}

				case "nameplate": {
					let m = this.parent.storage.getItem("playername");
					let a = prompt(language.translate("nameplate_note", [m]), m);
					if (a === null) {
						break;
					}
					this.parent.storage.setItem("playername", a);
					this.parent.refreshMenu();
					this.parent.saveFrame = 22;
					break;
				}
				case "choiceselect": {
					this.parent.storage.setItem(a.select_property, a.select_choice);
					let ay = this.parent.submenuSequence.pop();
					this.parent.changeMenu(ay, false, true);
					this.parent.switchSelectionNumber(a.parent_order);
					this.parent.saveFrame = 60;
					break;
				}

				case "replaycenter": {
					this.parent.openReplayCenter();
					break;
				}

				case "replaycurrent": {
					this.parent.loadReplayData(game.replayDataToString(), false);
					break;
				}
				case "replayreload": {
					this.parent.loadReplayData(this.parent.replayDataString, false);
					break;
				}
				case "replaydownload": {
					this.parent.downloadReplayData();
					break;
				}
				
				case "replayreplay": {
					game.startReplay();

					break;
				}
				case "replayupload": {
					let y = document.createElement("input");
					y.setAttribute("type", "file");
					y.onchange = (event) => {
						let h = event.target.files[0];
						//console.log(h);
						if (h.name.endsWith('.gtlrx')) {
							let reader = new FileReader();
							reader.readAsText(h, 'UTF-8');
							reader.onload = (read) => {
								var ctx = read.target.result;
								try {
									let test = atob(ctx);
									this.parent.loadReplayData(test, false);
								} catch (e) {
									this.parent.playSound("error");

								}
							}
						} else {
							this.parent.playSound("error");
						}
					};
					y.click();

					break;
				}

				case "replayminmax": {
					let lam = JSON.parse(this.parent.replayDataString);
					let replays = lam.replays;
					let selectedReplays = [];
					let min = this.parent.sessionStorage.getItem("replay_start_round");
					let max = this.parent.sessionStorage.getItem("replay_end_round");
					if (max > min) {
						for (let i = min; i <= max; i++) {
							selectedReplays.push(replays[i]);
						}
					} else
						for (let i = min; i >= max; i--) {
							selectedReplays.push(replays[i]);
						}

					lam.replays = selectedReplays;
					////console.log(lam);


					game.parseReplayFile(JSON.stringify(lam), 0, 9999, this.parameters.is_file);
					break;
				}
				case "replayallstart": {
					//game.replay.replaysIndex = 0;
					game.parseReplayFile(this.parent.replayDataString, 0, 9999, a.is_file);
					break;
				}
			}
			if (a.type === "range_list_specific") {
				this.parent.openChoices(language.translate(a.string, void 0), a.property, a.list, this.current, a.order)
			}

			if (a.type === "switch") {
				let prop = a.property;
				//let temp = a.templist;
				let b = this.parent.storage.getItem(prop);
				//let preset = this.parent.storage.getList(prop);
				b = [1, 0][this.parent.storage.getItem(prop)];


				this.parent.storage.setItem(prop, b);
				this.current = b;

				this.parent.saveFrame = 60;
			}

		}

		goToMainMenu() {
			this.parent.changeMenu(JSON.stringify(this.parent.mainMenu), false);
		}

		hover() {
			if (this.description !== "") {
				ih("MMC-FOOTER-TEXT", this.description);
			}
		}
		adjust(number) {
			let a = this.parameters;
			if (a.type === "range_minmax") {
				let prop = a.property;
				let setting = a.list;
				let b = this.parent.storage.getItem(prop);
				let preset = this.parent.presetSettings[setting];
				b += number;

				if (b > preset.max) {
					b = preset.max;

				}
				if (b < preset.min) {
					b = preset.min;

				}
				this.parent.storage.setItem(prop, b);
				this.current = b;

				this.parent.saveFrame = 60;
			}
			if (a.type === "session_range_minmax") {
				let prop = a.property;
				let temp = a.templist;
				let b = this.parent.sessionStorage.getItem(prop);
				let preset = this.parent.sessionStorage.getTempList(temp);
				b += number;

				if (b > preset.max) {
					b = preset.max;

				}
				if (b < preset.min) {
					b = preset.min;

				}
				this.parent.sessionStorage.setItem(prop, b);
				this.current = b;

				//this.parent.saveFrame = 60;
			}
			if (a.type === "range_list_specific") {
				let prop = a.property;
				let setting = a.list;
				let b = this.parent.storage.getItem(prop);
				let preset = this.parent.storage.getList(setting);
				b += number;

				if (b > preset.max) {
					b = preset.max;

				}
				if (b < preset.min) {
					b = preset.min;
				}
				this.parent.storage.setItem(prop, b);
				this.current = b;

				this.parent.saveFrame = 60;
			}
		}
	};
	storage = new class {
		constructor() {
			this.fixedData = {
				playername: "Player 1",
				lang: "en-US"
			};
			//this.userDataStr= "";
			this.data = JSON.parse(JSON.stringify(this.fixedData));
			this.stringFetchData = "";
			this.lists = {};
		}

		setItem(prop, val) {
			this.data[prop] = val;
			////console.log(val);

		}

		loadData(jsonString) {
			let evaluator = JSON.parse(jsonString);
			let func = (base, check) => {
				if (typeof check !== "undefined")
					for (let a in base) {
						if (typeof base[a] !== "object") {
							if (typeof check[a] !== "object") base[a] = check[a];
						} else func(base[a], check[a]);
					}
			}
			func(this.data, evaluator);
			////console.log("LOAF",this.data, evaluator)
		}

		loadUserData(lo) {
			this.stringFetchData = lo;
		}

		createList(name, obj) {
			this.lists[name] = obj;
		}

		getList(a) {
			return this.lists[a];
		}


		getItem(prop, substitute) {
			if (prop in this.data) return this.data[prop];
			if (substitute !== void 0) return substitute;
			return null;
		}


		getValueFromRangeListSpecific(prop) {
			return this.getList(prop).choices[this.getItem(prop, 0)].split("||")[1];
		}

		save() {
			database.write("local_data", "userdata", JSON.stringify(this.data));
		}

	}();
	sessionStorage = new class {
		constructor() {
			this.data = {
				replayfrom: 0,
				replayto: 0,
				replayselections: "0,1,2,3,4,5,6"
			};
			this.tempLists = {};
		}
		createTempList(name, obj) {
			this.tempLists[name] = obj;
		}

		getTempList(a) {
			return this.tempLists[a];
		}
		setItem(prop, val) {
			this.data[prop] = val;
			////console.log(val);

		}

		getItem(prop, substitute) {
			if (prop in this.data) return this.data[prop];
			if (substitute !== void 0) return substitute;
			return null;
		}

	}();

	constructor() {
		this.canvas = {};

		this.game = game;

		this.pauseSels = {
			def: 0,
			name: "pause",
			title: "pause_title",
			sel: [
				{
					"string": "pause_resume",
					"type": "button",
					"action": "unpause",
					"onstate": "#ffff",
					"offstate": "#fff2",
					"desc": "pause_resume_desc"
    			},
				{
					"string": "pause_restart",
					"type": "button",
					"action": "restart",
					"onstate": "#ffff",
					"offstate": "#fff2",
					"desc": "pause_restart_desc"
    			},
				{
					"string": "pause_end",
					"type": "button",
					"action": "end",
					"onstate": "#f00f",
					"offstate": "#f002",
					"desc": "pause_end_desc"
			}
			],
			"background": {
				"type": "rgba",
				"color": "#222F"
			}
		};

		this.pauseReplaySels = {
			def: 0,
			name: "pause",
			title: "pause_replay_title",
			sel: [
				{
					"string": "pause_resume",
					"type": "button",
					"action": "unpause",
					"onstate": "#ffff",
					"offstate": "#fff2",
					"desc": "pause_replay_resume_desc"
    			},

				{
					"string": "pause_restart",
					"type": "button",
					"action": "replayreplay",
					"onstate": "#ffff",
					"offstate": "#fff2",
					"desc": "pause_replay_restart_desc"
    			},
				{
					"string": "pause_replay_end",
					"type": "button",
					"action": "end",
					"onstate": "#f00f",
					"offstate": "#f002",
					"desc": "pause_replay_end_desc"
			}
			],
			"background": {
				"type": "rgba",
				"color": "#222F"
			}
		};

		


		let main = [
			{
				"string": "menu_start",
				"desc": "menu_start_desc",
				"type": "button",
				"action": "submenu",
				"onstate": "#ffff",
				"offstate": "#fff2",
				"backable": true,
				"submenu": "start/start.json"
	},
			{
				"string": "menu_replaycenter",
				"desc": "menu_replaycenter_desc",
				"type": "button",
				"action": "replaycenter",
				"onstate": "#ffff",
				"offstate": "#fff2",
				"backable": true,
	},
			{
				"string": "menu_settings",
				"desc": "menu_settings_desc",
				"type": "button",
				"action": "submenu",
				"init": 4,
				"onstate": "#ffff",
				"offstate": "#fff2",
				"backable": true,
				"submenu": "settings/list.json"
	},

				];

		let gson = {
			def: 0,
			sel: main,
			title: "menu_main",
			name: "main",
			"background": {
				"type": "rgba",
				"color": "#222F"
			}
		};

		this.mainMenu = JSON.parse(JSON.stringify(gson));

		this.sounds = {};

		this.saveFrame = -1;

		elem("canvas", canvas => {
			canvas.width = 1280;
			canvas.height = 720;
			this.canvas = canvas;
			this.ctx = canvas.getContext("2d");
		});

		this.presetSettings = {};
		this.center = {
			x: 1280 / 2,
			y: 720 / 2
		};

		//this.cellSize = 6;
		this.landscape = {
			w: 0,
			h: 0,
		};

		this.cellSize = 0;

		this.layout = {

		};

		this.isMenu = false;
		this.isControllable = true;
		this.transitionFrame = 0;

		this.submenuSequence = [];

		this.menus = {};

		this.hold = {
			frame: 0,
			on: false,
			press: "",
		};

		this.touchArea = {
			x: 0,
			y: 0,
			isPress: false
		};

		this.touchSensitivity = {
			x: 3,
			y: 30,
			difference: {
				x: 0,
				y: 0
			},
			direction: 0
		};

		this.temporaryElements = {
			elements: {},

			elementObjects: {},

			resizeObjects: {},
		}

		this.menuList = {

		};

		this.elementObjects = {};

		this.resizeObjects = {};

		this.mainElement = document.createElement("GTRIS-MENU-SCREEN");

		this.mainElement.style = "display: flex; justify-content: center; align-items: center; flex-direction: column;";

		this.container = id("MENU-MAIN-CONTENT");

		this.pauseContainer = id("MENU-PAUSE-DIV");

		this.headerContainer = id("MENU-HEADER");

		this.characterContainer = id("MENU-CHARSELECT-DIV");

		this.core = id("GTRIS-MENU-DIV");

		this.canvas = id("MM-CONTENT-CANVAS");

		this.ctx = getCanvasCtx(this.canvas);

		this.canvasDims = {
			ar: 16 / 9,
			w: 1280,
			h: 720,
			c: 1280 / 30
		};

		this.canvas.width = this.canvasDims.w;
		this.canvas.height = this.canvasDims.h;

		this.elements = {};

		this.selectables = [];

		this.selectionGroupName = "";

		this.selectableActive = 0;

		this.selectedJson = "";
		//this.lastSelectionGroupNumber = 0;

		this.scroll = {
			y: 0
		}

		this.isLoading = false
		this.replayDataString = "";

		this.characterMenu.showHide(0);
	}

	loadReplayData(dataString, isFile) {

		let a = JSON.parse(dataString);
		this.replayDataString = dataString;
		//console.log(a);
		let replays = a.replays;
		let max = replays.length - 1;


		let sel = [
			{
				string: "replayload_playall",
				type: "button",
				action: "replayallstart",
				onstate: "#ffff",
				offstate: "#fff2",
				is_file: isFile,
				desc: "replayload_playall_desc"
		}
		/*{ for future versions
			"string": "replayload_details",
			type: "submenu_sync",
			action: "unpause",
			onstate: "#ffff",
			offstate: "#fff2",
			desc: "replayload_playall_desc"
		}*/
		];



		if (max > 0) {
			this.sessionStorage.setItem("replay_start_round", 0);
			this.sessionStorage.setItem("replay_end_round", max);
			this.sessionStorage.createTempList("replay_start_round", {
				"type": "range_minmax",
				"min": 0,
				"max": max,
				"text": "text_limit_of",
				"offset": 1
			});
			this.sessionStorage.createTempList("replay_end_round", {
				"type": "range_minmax",
				"min": 0,
				"max": max,
				"text": "text_limit_of",
				"offset": 1
			});
			let h = [{
					"string": "replayloadmm_range_start_slider",
					"type": "session_range_minmax",
					"action": "unpause",
					"onstate": "#ffff",
					"offstate": "#fff2",
					"property": "replay_start_round",
					"templist": "replay_start_round",
					"desc": "replayload_range_start_slider_desc"
			},
				{
					"string": "replayloadmm_range_end_slider",
					"type": "session_range_minmax",
					"action": "unpause",
					"onstate": "#ffff",
					"offstate": "#fff2",
					"property": "replay_end_round",
					"templist": "replay_end_round",
					"desc": "replayload_range_end_slider_desc"
			}, {

					string: "replayloadmm_play",
					type: "button",
					action: "replayminmax",
					onstate: "#ffff",
					offstate: "#fff2",
					is_file: isFile,
					desc: "replayload_playall_desc"

			}];
			let shel = {
				def: 0,
				name: "replaymenu",
				title_raw: `${a.title}`,
				sel: h,
				background: {
					"type": "rgba",
					"color": "#225F"
				}
			};

			sel.push({
				string: "replayload_minmax",
				type: "button",
				action: "submenu_sync",
				onstate: "#ffff",
				offstate: "#fff2",
				submenu: JSON.stringify(shel),
				desc: "replayload_minmax_desc",
				backable: true
			});

		}

		let mel = {
			def: 0,
			name: "replaymenu",
			title_raw: a.title,
			sel: sel,
			background: {
				"type": "rgba",
				"color": "#222F"
			}
		};


		this.changeMenu(JSON.stringify(mel), true);

	}

	openChoices(title, prop, current, setting, order) {

		let a = this.storage.getList(prop);
		//console.log(a);
		let j = a.choices;
		let max = a.max;


		let sel = [];



		for (let y = 0; y < j.length; y++) {
			let p = j[y];
			let h = language.settingTranslate(p);
			sel.push({
				raw_string: h[0],
				type: "button",
				action: "choiceselect",
				select_property: prop,
				onstate: "#ffff",
				offstate: "#fff2",
				select_choice: y,
				parent_order: order,
				raw_desc: h[1]
			});
		}

		let mel = {
			def: this.storage.getItem(prop, 0),
			name: "selector",
			title_raw: title,
			sel: sel,
			background: {
				"type": "rgba",
				"color": "#222F"
			}
		};


		this.changeMenu(JSON.stringify(mel), true);

	}

	openReplayCenter() {



		let sel = [
			{
				string: "replaycenter_upload",
				type: "button",
				action: "replayupload",
				onstate: "#ffff",
				offstate: "#fff2",
				desc: "replaycenter_upload_desc",
				backable: true
		}
		];

		if (this.replayDataString !== "") {

			sel.push({
				string: "replaycenter_current",
				type: "button",
				action: "replayreload",
				onstate: "#ffff",
				offstate: "#fff2",
				desc: "replaycenter_current_desc",
				backable: true
			});

		}

		let mel = {
			def: 0,
			name: "replaycenter",
			title: "replaycenter_title",
			sel: sel,
			background: {
				"type": "rgba",
				"color": "#222F"
			}
		};


		this.changeMenu(JSON.stringify(mel), true);

	}

	downloadReplayData() {
		let u = game.replayDataToString();
		let a = document.createElement("a");
		let blob = new Blob([u]);
		a.setAttribute("href", URL.createObjectURL(blob), { type: 'application/octet-stream' });
		a.setAttribute("download", `gtrislegends-${Date.now()}.gtlrx`);
		a.click();
	}

	MenuElementFrameAnimationRenderer = class {
		constructor(element, initial, max, fps, param, addFunc) {
			this.param = param || {};
			let paramDel = "delay" in param ? param.delay : 0;
			this.a = new FrameRenderer(initial, max + paramDel, (frame, maxFrame) => {
				let tminus = maxFrame - Math.max(0, frame - paramDel);
				////console.log("played pi")

				if (tminus >= 0)
					styleelem(this.element, "animation-delay", `${~~((1000 / (60 * (-1))) * Math.min(maxFrame,Math.max(frame + 1 - paramDel, 1)))}ms`);


			}, addFunc, "loop" in param ? param.loop : false);
			this.element = element;
			this.fps = fps;
			this.max = max;
			this.isLoop = "loop" in param ? param.loop : false;
			//styleelem(this.element, "opacity", `${this.param.opacity||0}%`);
		}

		play() {
			this.element.offsetHeight;
			styleelem(this.element, "animation-name", this.param.name);
			styleelem(this.element, "animation-duration", `${~~((this.fps) * (this.max))}ms`);
			styleelem(this.element, "animation-timing-function", this.param.timing);
			styleelem(this.element, "animation-iteration-count", this.isLoop ? "infinite" : "1");
			styleelem(this.element, "animation-play-state", "paused");
			this.a.reset();

		}
		run() {
			this.a.run();
		}
		reset() {
			styleelem(this.element, "animation-name", "none");
			this.a.toggleEnable(false);

		}
	};

	load() {
		return new Promise(async res => {
			/*let a = await load("./assets/menu/this.json", "text");
			let json = JSON.parse(a);

			this.layout = json;

			for (let g in json.main) this.recursionElement(g, json.main, false, this.mainElement);

			this.menuList = JSON.parse(JSON.stringify(json.menulists));


			////console.log(json);
			////console.log(this.elements);
			/**/

			//let gson = this.convertJSONSimpleToJSONComplex();

			//for (let h in gson) //this.recursionElement(h, gson, false, this.getID("MENU-LIST0-DIV"))
			let a = await load("./assets/menu/menu.json", "text");
			let json = JSON.parse(a);






			//this.container.appendChild(this.mainElement);

			this.changeMenu(JSON.stringify(this.mainMenu), false);

			id("HEADER-BACK").addEventListener("click", () => {
				this.backButton();
			}, false);

			for (let g in json.sounds) {
				let a = await load(`/assets/menu/${json.sounds[g]}`, "blob");
				let blob = URL.createObjectURL(a);

				this.sounds[g] = new MainHowler.Howl({
					src: blob,
					format: "ogg",
					loop: false,
					preload: false
				});
				this.sounds[g].load();
			}



			res();
		});
	}

	saveData() {
		this.storage.save();
		this.checkData();
	}
	checkData() {
		let mfxvol = this.storage.getItem("set_global_mfx", 0);
		if (mfxvol !== music.volume) {
			music.volumeSet(mfxvol);
		}

		let sfxvol = this.storage.getItem("set_global_sfx", 0);
		if (sfxvol !== sound.volume) {
			sound.volumeSet(sfxvol);
		}
	}

	checkStorageSettings() {
		//console.log(this.storage.stringFetchData)
		if (this.storage.stringFetchData === "") return;
		let data = JSON.parse(this.storage.stringFetchData);
		for (let b in this.presetSettings) {
			let c = this.presetSettings[b];
			//console.log(b,c)


			if (c.type === "range_list_specific") {
				c.min = 0;
				c.max = c.choices.length - 1;

			}
			if (c.type === "switch") {
				c.min = 0;
				c.max = 1;

			}
			this.storage.setItem(b, (b in data) ? data[b] : c.default);

			for (let h in c.default_obj) {
				let t = `${b}(${h})`;

				this.storage.setItem(t, (t in data) ? data[t] : c.default_obj[h]);
			}

			this.storage.createList(b, c);
			//console.log(c);
		}
		//console.log(this.presetSettings)
	}

	changeSelectables(_json) {
		this.selectables.length = 0;
		let json = JSON.parse(JSON.stringify(_json));
		for (let u = 0; u < json.sel.length; u++) {
			let ref = json.sel[u];
			ref.size = 1;
			ref.order = u;
		}
		for (let g of json.sel) {


			this.selectables.push(new this.#Selectable(this, g));

		}

		for (let u = 0; u < this.selectables.length; u++) {
			let ref = this.selectables[u];
			ref.size = 1;

		}
		let def = json.def || 0;
		if (this.selectables[json.def]) {
			this.switchSelectionNumber(json.def);

		}

		this.checkSelectables();


	}
	changeMenu(_json, backable, isBack) {
		////console.log(_json)
		let json = JSON.parse(_json);
		if (backable) {
			this.submenuSequence.push(this.selectedJson);
			//console.
		} else {
			if (!isBack) this.submenuSequence.length = 0;
		}

		if ("title" in json) {
			ih("HEADER-TITLE-TEXT", language.translate(json.title))
		}

		if ("title_raw" in json) {
			ih("HEADER-TITLE-TEXT", json.title_raw);
		}

		this.selectedJson = _json;

		this.changeSelectables(json);
	}

	refreshMenu() {
		let sel = this.selectableActive;
		this.changeSelectables(JSON.parse(this.selectedJson));
		this.selectableActive = sel;
		this.selectables[this.selectableActive].hover();
	}

	changeMenuAsync(url, backable) {
		this.isLoading = true;
		load(`assets/menu/sections/${url}`, "text").then((m) => {
			this.isLoading = false;
			this.changeMenu(m, backable);
		});
	}
	switchSelectionNumber(number) {
		this.selectableActive = number;
	}

	refreshSelectionGroup() {
		this.selectionGroup = {};
		//let ht = {};
		for (let h in this.elementObjects) {
			let a = this.elementObjects[h];
			if ("default_attributes" in a) {
				if (("id_selectable" in a.default_attributes) && ("number_selectable" in a.default_attributes)) {

					if (!(a.default_attributes.id_selectable in this.selectionGroup)) {
						this.selectionGroup[a.default_attributes.id_selectable] = {
							def: 0,
							elem: {},
							number: 0
						};
					}
					this.selectionGroup[a.default_attributes.id_selectable].elem[a.default_attributes.number_selectable] = ({
						a: a,
						name: h,
						hoverIn: a.__event_functions.mouseover,
						hoverOut: a.__event_functions.mouseout,
						click: a.__event_functions.click
					});
					if (("is_default_select" in a.default_attributes) && a.default_attributes.is_default_select) {
						this.selectionGroup[a.default_attributes.id_selectable].def = this.selectionGroup[a.default_attributes.id_selectable].number = a.default_attributes.number_selectable;
					}
				}
			}
		}
		////console.log(this.selectionGroup);
	}

	recursionElement(n, l, isTemp, isBrothers) {
		let j = l[n];

		let hha = isTemp ? this.temporaryElements.elements : this.elements;
		let hhb = isTemp ? this.temporaryElements.elementObjects : this.elementObjects;
		let hhc = isTemp ? this.temporaryElements.resizeObjects : this.resizeObjects;
		elem(j?.tag || "GTRIS-MENU-OBJECT-DIV", a => {
			a.id = j.id;
			hha[j.id] = a;
			hhb[j.id] = j;
			hhc[j.id] = {

			};
			////console.log(j)
			if ("style" in j) {
				for (let g in j.style) {
					a.style.setProperty(g, j.style[g]);
				}
			}

			if ("attributes" in j)
				for (let ats in j.attributes) {
					let m = j.attributes[ats];
					////console.log(m)

					if (ats == "font_size") {
						a.style["font-size"] = `${m}em`;
					}

					a.setAttribute(ats, m);
				}



			if ("inner_html" in j) a.innerHTML = j.inner_html;
			if ("size" in j) {
				let lx = this.cellSize;
				let ly = this.cellSize;
				if (j.size.type == "whole") {
					lx = this.landscape.w;
					ly = this.landscape.h;
				}
				if (j.size.type == "free") {
					lx = 1;
					ly = 1;
				}

				if ("width" in j.size) a.style.width = (j.size.width * lx) + "px";
				if ("height" in j.size) a.style.height = (j.size.height * ly) + "px";
			}
			if ("event_listeners" in j) {
				j.__event_functions = {};
				for (let ats in j.event_listeners) {
					let m = j.event_listeners[ats];
					m.func += ";"
					let ne = new Function(["menu_global", "evt"], m.func);
					j.__event_functions[ats] = (event) => {
						ne(__private.menu, event);
					}
					a.addEventListener(ats, (event) => {
						j.__event_functions[ats](event);
					}, {
						once: m.once
					});
				}
			}
			//this.elements[n] = a;


			if ("children" in j)
				for (let h in j.children) {

					//recursion time

					this.recursionElement(h, j.children, isTemp, a);

					//a.append(this.elements[h]);

				}
			isBrothers.appendChild(a);
		});

		hhb[j.id] = j;

		// this code looks pretty dirty lolwut - EricLenovo 

		if ("size" in j)
			if (("width" in j.size) || ("height" in j.size)) {
				hhc[j.id] = {
					t: j.size.type,
				};

				if ("width" in j.size) hhc[j.id].w = j.size.width;
				if ("height" in j.size) hhc[j.id].h = j.size.height;

			}
		//recursion
		////console.log(j)
	}

	playSound(name) {
		this.sounds[name].stop();
		this.sounds[name].play();
	}

	run() {
		this.draw();
	}

	runInBackground() {
		if (this.hold.on) {
			this.hold.frame--;
			if (this.hold.frame == 0) {
				this.controlsListen(this.hold.press, "hold");
			}
		}

		if (this.saveFrame >= 0) {
			this.saveFrame--;
			if (this.saveFrame == 0) {
				this.saveData();
			}
		}
	}

	draw() {
		this.characterMenu.draw();
		let my = 0;
		let gy = 0;
		this.ctx.clearRect(0, 0, 1280, 720);

		for (let g = 0; g < this.selectables.length; g++) {
			let mm = this.selectables[g];
			let reference = mm.parameters;


			let le = "#fff6";

			if (g == this.selectableActive) {
				gy = -my;
				le = "#ffff";
				this.scroll.y += 0.1 * ((this.canvasDims.h / 2) - this.scroll.y + gy);
			}

			if (reference.type === "button") {
				this.ctx.font = `${reference.size * this.canvasDims.c}px default-ttf`;
				this.ctx.strokeStyle = "#000";

				this.ctx.lineWidth = 10;
				this.ctx.strokeText(mm.string, this.canvasDims.w * 0.15, this.scroll.y + (my));


				this.ctx.fillStyle = le;
				this.ctx.fillText(mm.string, this.canvasDims.w * 0.15, this.scroll.y + (my));
				my += reference.size * this.canvasDims.c;
			}

			if (reference.type === "range_minmax") {
				let prop = this.presetSettings[reference.list];

				this.ctx.font = `${reference.size * this.canvasDims.c * 0.8}px default-ttf`;
				this.ctx.strokeStyle = "#000";
				let lo = `${mm.string}: ${language.translate(prop.text, [mm.current])}`;


				this.ctx.lineWidth = 10;
				this.ctx.strokeText(lo, this.canvasDims.w * 0.15, this.scroll.y + (my));


				this.ctx.fillStyle = le;
				this.ctx.fillText(lo, this.canvasDims.w * 0.15, this.scroll.y + (my));

				my += reference.size * this.canvasDims.c * 0.6;

				let lsd = this.canvasDims.w - ((this.canvasDims.w * 0.1) * 2);
				this.ctx.fillRect(this.canvasDims.w * 0.1,
					my + this.scroll.y,
					lsd,
					reference.size * this.canvasDims.c * 1);

				let pad = (0.1) * this.canvasDims.c * reference.size;

				this.ctx.clearRect(
					(this.canvasDims.w * 0.1) + (pad / 2),
					this.scroll.y + my + (pad / 2),
					(lsd) - pad,
					reference.size * this.canvasDims.c * 1 * (0.9)
				);
				this.ctx.fillRect(
					(this.canvasDims.w * 0.1) + (pad / 2),
					this.scroll.y + my + (pad / 2),
					((mm.current - prop.min) / (prop.max - prop.min)) * (lsd - pad),
					reference.size * this.canvasDims.c * 1 * (0.9)
				);

				my += reference.size * this.canvasDims.c * 1 * 2;
			}


			if (reference.type === "session_range_minmax") {
				let prop = this.sessionStorage.getTempList(reference.templist);

				this.ctx.font = `${reference.size * this.canvasDims.c * 0.8}px default-ttf`;
				this.ctx.strokeStyle = "#000";
				let off = ("offset" in prop) ? prop.offset : 0;

				let lo = `${mm.string}: ${language.translate(prop.text, [mm.current + off, prop.max + off])}`;


				this.ctx.lineWidth = 10;
				this.ctx.strokeText(lo, this.canvasDims.w * 0.15, this.scroll.y + (my));


				this.ctx.fillStyle = le;
				this.ctx.fillText(lo, this.canvasDims.w * 0.15, this.scroll.y + (my));

				my += reference.size * this.canvasDims.c * 0.6;

				let lsd = this.canvasDims.w - ((this.canvasDims.w * 0.1) * 2);
				this.ctx.fillRect(this.canvasDims.w * 0.1,
					my + this.scroll.y,
					lsd,
					reference.size * this.canvasDims.c * 1);

				let pad = (0.1) * this.canvasDims.c * reference.size;

				this.ctx.clearRect(
					(this.canvasDims.w * 0.1) + (pad / 2),
					this.scroll.y + my + (pad / 2),
					(lsd) - pad,
					reference.size * this.canvasDims.c * 1 * (0.9)
				);
				this.ctx.fillRect(
					(this.canvasDims.w * 0.1) + (pad / 2),
					this.scroll.y + my + (pad / 2),
					((mm.current - prop.min) / (prop.max - prop.min)) * (lsd - pad),
					reference.size * this.canvasDims.c * 1 * (0.9)
				);

				my += reference.size * this.canvasDims.c * 1 * 2;
			}

			if (reference.type === "range_list_specific") {
				let prop = this.presetSettings[reference.property];

				this.ctx.font = `${reference.size * this.canvasDims.c * 0.8}px default-ttf`;
				this.ctx.strokeStyle = "#000";
				let lo = `${mm.string}: ${mm.items[mm.current]}`;


				this.ctx.lineWidth = 10;
				this.ctx.strokeText(lo, this.canvasDims.w * 0.15, this.scroll.y + (my));


				this.ctx.fillStyle = le;
				this.ctx.fillText(lo, this.canvasDims.w * 0.15, this.scroll.y + (my));

				my += reference.size * this.canvasDims.c * 0.6;

				let lsd = this.canvasDims.w - ((this.canvasDims.w * 0.1) * 2);
				this.ctx.fillRect(this.canvasDims.w * 0.1,
					my + this.scroll.y,
					lsd,
					reference.size * this.canvasDims.c * 1);

				let pad = (0.1) * this.canvasDims.c * reference.size;

				this.ctx.clearRect(
					(this.canvasDims.w * 0.1) + (pad / 2),
					this.scroll.y + my + (pad / 2),
					(lsd) - pad,
					reference.size * this.canvasDims.c * 1 * (0.9)
				);
				this.ctx.fillRect(
					(this.canvasDims.w * 0.1) + (pad / 2),
					this.scroll.y + my + (pad / 2),
					((mm.current - prop.min) / (prop.max - prop.min)) * (lsd - pad),
					reference.size * this.canvasDims.c * 1 * (0.9)
				);

				my += reference.size * this.canvasDims.c * 1 * 2;
			}
			if (reference.type === "switch") {
				let prop = this.presetSettings[reference.property];

				this.ctx.font = `${reference.size * this.canvasDims.c * 0.8}px default-ttf`;
				this.ctx.strokeStyle = "#000";
				let lo = `${mm.string}: ${(mm.current == 1 ? prop.on : prop.off)}`;
				let lc = reference.size * this.canvasDims.c * 1.4;

				this.ctx.drawImage(game.misc[mm.current == 1 ? "menu_switch_on" : "menu_switch_off"],
					this.canvasDims.w * 0.15, this.scroll.y + (my) - (lc / 1.6),
					lc, lc
				)

				this.ctx.lineWidth = 10;
				this.ctx.strokeText(lo, this.canvasDims.w * 0.16 + lc, this.scroll.y + (my));


				this.ctx.fillStyle = le;
				this.ctx.fillText(lo, this.canvasDims.w * 0.16 + lc, this.scroll.y + (my));

				my += reference.size * this.canvasDims.c * 2;
			}
		}
	}

	moveUp() {
		if (this.characterMenu.isActive) {
			this.characterMenu.controlsListen(("arrowup"));
			return
		}
		if (!this.isControllable) return;

		if (this.selectables.length === 0) return;
		this.selectableActive--;
		if (this.selectableActive < 0) {
			this.selectableActive = 0;
			return;
		}

		this.checkSelectables();

		this.playSound("move");

	}
	moveDown() {
		if (this.characterMenu.isActive) {
			this.characterMenu.controlsListen(("arrowdown"));
			return
		}
		if (!this.isControllable) return;
		this.selectableActive++;
		if (this.selectableActive > this.selectables.length - 1) {
			this.selectableActive = this.selectables.length - 1;
			return;
		}
		this.checkSelectables();
		this.playSound("move");
	}

	checkSelectables() {
		let reference = this.selectables[this.selectableActive];
		reference.hover();
	}

	moveLeft() {
		if (this.characterMenu.isActive) {
			this.characterMenu.controlsListen(("arrowleft"));
			return
		}
		if (!this.isControllable) return;

		if (this.selectables.length === 0) return;

		let reference = this.selectables[this.selectableActive];
		reference.adjust(-1);

		this.playSound("move");

	}

	moveRight() {
		if (this.characterMenu.isActive) {
			this.characterMenu.controlsListen(("arrowright"));
			return;
		}
		if (!this.isControllable) return;

		if (this.selectables.length === 0) return;

		let reference = this.selectables[this.selectableActive];
		reference.adjust(1);
		this.playSound("move");

	}


	pressAButton() {
		if (this.characterMenu.isActive) {
			this.characterMenu.controlsListen(("enter"));
			return
		}
		if (this.selectables.length === 0 || !this.isControllable) return;
		if (this.selectables.length < 0) return;
		if (this.isControllable) {
			let reference = this.selectables[this.selectableActive];
			reference.select();
			this.playSound("select");
		}
	}

	pressBButton() {
		if (!this.isControllable) return;
		this.backButton();
	}

	controlsListen(name, k) {
		if (!this.isLoading && !splash.isActive && game.startGameParameters.frame <= 0) {
			let preventHold = false;
			switch (name) {
				case "up": {
					if (k !== "up") {
						this.moveUp();

					}
					break;
				}
				case "down": {
					if (k !== "up") {
						this.moveDown();

					}
					break;
				}
				case "left": {
					if (k !== "up") {
						this.moveLeft();

					}
					break;
				}
				case "right": {
					if (k !== "up") {
						this.moveRight();

					}
					break;
				}
				case "a": {
					if (k !== "up") {
						this.pressAButton();
						preventHold = true;
					}
					break;
				}
				case "b": {
					if (k !== "up") {
						this.pressBButton();
						preventHold = true;
					}
					break;
				}
			}

			if (!preventHold) {
				this.hold.press = name;
				if (k == "down") {
					this.hold.frame = 25;
					this.hold.on = true;
				}
				if (k == "hold" && this.hold.on) {
					this.hold.frame = 2;
				}
				if (k == "up") {
					this.hold.on = false;
				}
			}
		}
	}

	getID(elementID) {
		let h = 0;
		if (elementID in this.elements) h = this.elements[elementID];
		return h;
	}

	isExistingElement(elementID) {
		return elementID in this.elements;
	}

	isExistingObj(elementID) {
		return elementID in this.elementObjects;
	}


	getIDTemp(elementID) {
		let h = 0;
		if (elementID in this.temporaryElements.elements) h = this.temporaryElements.elements[elementID];
		return h;
	}

	isExistingElementTemp(elementID) {
		return elementID in this.temporaryElements.elements;
	}

	resize(cellSize, w, h) {
		this.cellSize = cellSize;

		this.landscape.w = w;
		this.landscape.h = h;

		let header = id("MENU-HEADER");
		let charselect = id("MENU-HEADER");

		styleelem(this.container, "width", `${w}px`);
		styleelem(this.container, "height", `${h}px`);

		styleelem(this.pauseContainer, "width", `${w}px`);
		styleelem(this.pauseContainer, "height", `${h}px`);

		styleelem(this.characterContainer, "width", `${w}px`);
		styleelem(this.characterContainer, "height", `${h}px`);

		styleelem(this.core, "width", `${w}px`);
		styleelem(this.core, "height", `${h}px`);

		styleelem(this.canvas, "width", `${w}px`);
		styleelem(this.canvas, "height", `${h}px`);

		styleelem(header, "width", `${w}px`);
		styleelem(header, "height", `${this.cellSize * 2}px`);

		styleelem(this.mainElement, "width", `${w}px`);
		styleelem(this.mainElement, "height", `${h}px`);

		styleelem(this.core, "fontSize", `${this.cellSize}px`);

		style("HEADER-BACK", "width", `${this.cellSize * 2}px`);
		style("HEADER-BACK", "height", `${this.cellSize * 2}px`);

		style("HEADER-TITLE-DIV", "padding-left", `${this.cellSize * 0.5}px`);

		style("HEADER-TITLE-TEXT", "font-size", `${this.cellSize * 1.5}px`);

		style("MM-CONTENT-FOOTER", "width", `${w}px`);
		style("MM-CONTENT-FOOTER", "height", `${this.cellSize * 5}px`);
		style("MM-CONTENT-FOOTER", "font-size", `${this.cellSize * 1.2}px`);
		style("MMC-FOOTER-TEXT", "width", `${w * 0.9}px`);


		//styleelem(this.mainElement, "background", "#fff5");

		for (let _w in this.resizeObjects) {
			let gh = this.resizeObjects[_w];

			if (gh.t === "whole") {
				if ("w" in gh) styleelem(this.elements[_w], "width", `${w * gh.w}px`);
				if ("h" in gh) styleelem(this.elements[_w], "height", `${h * gh.h}px`);
			}

			if (gh.t === "cell") {
				if ("w" in gh) styleelem(this.elements[_w], "width", `${this.cellSize * gh.w}px`);
				if ("h" in gh) styleelem(this.elements[_w], "height", `${this.cellSize * gh.h}px`);
			}

			////console.log()
		}

		for (let _w in this.elementObjects) {
			let gh = this.elementObjects[_w];


			if ("font_size" in gh) styleelem(this.elements[_w], "fontSize", `${gh.font_size * this.cellSize}px`);
			else styleelem(this.elements[_w], "fontSize", `${this.cellSize}px`);


		}

		{
			let thisTemp = this.temporaryElements;
			for (let _w in thisTemp.resizeObjects) {
				let gh = thisTemp.resizeObjects[_w];

				if (gh.t === "whole") {
					if ("w" in gh) styleelem(thisTemp.elements[_w], "width", `${w * gh.w}px`);
					if ("h" in gh) styleelem(thisTemp.elements[_w], "height", `${h * gh.h}px`);
				}

				if (gh.t === "cell") {
					if ("w" in gh) styleelem(thisTemp.elements[_w], "width", `${this.cellSize * gh.w}px`);
					if ("h" in gh) styleelem(thisTemp.elements[_w], "height", `${this.cellSize * gh.h}px`);
				}

				////console.log()
			}

			for (let _w in thisTemp.elementObjects) {
				let gh = thisTemp.elementObjects[_w];


				if ("font_size" in gh) styleelem(thisTemp.elements[_w], "fontSize", `${gh.font_size * this.cellSize}px`);
				else styleelem(thisTemp.elements[_w], "fontSize", `${this.cellSize}px`);


			}
		}

		this.characterMenu.resize();
	}

	convertJSONSimpleToJSONComplex(simple) {
		let complex = [];
		let n = 0;
		for (let g of simple) {
			let mfunc = "";
			let lo = g.name || Math.random() * 9999;
			complex[n] = {
				"type": "none",
				"size": {
					"type": "cell",
					"width": 10,
					"height": 2
				},
				"id": lo,

				"tag": "menu-object",
				"inner_html": "",
				"default_attributes": {
					"mouseout_color": "#0000",
					"mouseover_color": "#0000"
				},
				"style": { "display": "flex", "justify-content": "center", "align-items": "center" },

				"attributes": {

				},

				"event_listeners": {

				},

				"children": {

				}
			};
			let m = complex[n];
			if (g.type == "textbox") {

				m.children[0] = {
					"type": "none",
					"font_size": 1,
					"id": "HELL-BOX",
					"tag": "menu-object",
					"inner_html": g.string,
					"tag": "textarea",
					"default_attributes": {
						"id_selectable": false,
						"is_default_select": false
					},
					style: {
						width: "100%",
						height: "100%",
					},
					"attributes": {

					},
					"event_listeners": {
						change: {
							func: "",
							once: false
						}
					}
				};


				m.children[0].event_listeners.change.func = `let __value__ = evt.target.value; ${g.change};`
			}
			if (g.type == "button") {

				m.children[0] = {
					"type": "none",
					"font_size": 1,
					"id": lo + "-_-TEXT",
					"tag": "menu-object",
					"inner_html": g.string,
					"default_attributes": {

					},
					"attributes": {
						"style": "pointer-events: none; position: absolute"
					},
				};

				m.style["justify-content"] = "left";
				m.style["flex-direction"] = "column"
				m.event_listeners = {
					"mouseover": {
						"once": false,
						"func": `menu_global.hoverButton(${lo}, \"${g.onstate}\");`
					},
					"mouseout": {
						"once": false,
						"func": `menu_global.hoverButton(${lo},\"${g.offstate}\");`
					},
					"click": {
						"once": false,
						"func": mfunc
					}
				};
				m.default_attributes.id_selectable = g.selectname;
				m.default_attributes.number_selectable = g.selectnumber;
				m.default_attributes.is_default_select = g.is_default;


				m.style.background = g.offstate;

				if ("init" in g) {
					let param = JSON.parse(JSON.stringify(g.charselect_param));
					let loo = `menu_global.characterMenu.setParameters(${JSON.stringify(param)});`;
					loo += `menu_global.characterMenu.showHide(1);menu_global.setInit(${g.init});`;

					m.event_listeners.click.func = loo; //menu_global.game.initialize(${g.init})
				}



			}
			if (g.type == "button2") {

				m.size.type = "whole";
				m.size.width = 1;
				m.size.height = 0.14;


				m.style["clip-path"] = "polygon(0 0, 92% 0, 86% 97%, 0% 97%)";
				m.style["align-items"] = "left";
				m.style["padding-left"] = "1.3em";
				m.style["flex-direction"] = "column";
				m.default_attributes.id_selectable = g.selectname;
				m.default_attributes.number_selectable = g.selectnumber;
				m.default_attributes.is_default_select = g.is_default;
				m.children[0] = {
					"type": "none",
					"font_size": 2,
					"id": lo + "-_-TEXT",
					"tag": "menu-object",
					"inner_html": g.string,
					"default_attributes": {

					},
					"attributes": {
						"style": "pointer-events: none; position: relative; display: inline-block",
					},
				};

				m.children[1] = {
					"type": "none",
					"font_size": 1,
					"id": lo + "-_-TEXT2",
					"tag": "menu-object",
					"inner_html": g.hint || "  ",
					"default_attributes": {


					},
					"attributes": {
						"style": "pointer-events: none; position: relative; display: inline-block",
					},
				};
				m.event_listeners = {
					"mouseover": {
						"once": false,
						"func": `menu_global.hoverButton(${lo}, \"${g.onstate}\");`
					},
					"mouseout": {
						"once": false,
						"func": `menu_global.hoverButton(${lo},\"${g.offstate}\");`
					},
					"click": {
						"once": false,
						"func": mfunc
					}
				};

				m.style.background = g.offstate;

				if ("init" in g) {
					let param = JSON.parse(JSON.stringify(g.charselect_param));
					let loo = `menu_global.characterMenu.setParameters(${JSON.stringify(param)});`;
					loo += `menu_global.characterMenu.showHide(1);menu_global.setInit(${g.init});`;

					m.event_listeners.click.func = loo; //menu_global.game.initialize(${g.init})
				}

				if ("function" in g) {


					let result = g.function;
					if ("args" in g) {
						let args = JSON.parse(JSON.stringify(g.args));
						let ii = Object.keys(args)
						for (let v = 0; v < ii.length; v++) {
							let varInstance = args[ii[v]];
							let placeholder = `#par\=${ii[v]}`;
							let regExp = new RegExp(placeholder, "gm");
							result = result.replace(regExp, varInstance);
						}
					}

					m.event_listeners.click.func = result; //menu_global.game.initialize(${g.init})
				}

			}


			n++;
		}

		return complex;
	}

	setInit(g) {
		game.actualParameters.mode = g;

	}

	resetTemp() {
		for (let j in this.temporaryElements.elements) {
			delete this.temporaryElements.elements[j];
		}
		for (let j in this.temporaryElements.elementObjects) {
			delete this.temporaryElements.elementObjects[j];
		}
		for (let j in this.temporaryElements.resizeObjects) {
			delete this.temporaryElements.resizeObjects[j];
		}
	}

	showMenu(bool) {
		this.isMenu = bool;
		this.isControllable = bool;
		styleelem(this.container, "display", bool ? "flex" : "none");
		styleelem(this.headerContainer, "display", bool ? "flex" : "none");
	}

	hoverButton(id, on) {
		let j = {};
		let exist = false;
		if (this.isExistingElement(id)) {
			j = this.getID(id);
			exist = true;
		}
		if (this.isExistingElementTemp(id)) {
			j = this.getIDTemp(id);
			exist = true;
		}
		////console.log(exist, j, id)
		if (exist) {
			j.style.background = on;
		}
	}

	backButton() {
		if (this.characterMenu.isActive) {
			let a = this.characterMenu;
			let isSelActive = false;
			for (let g = a.activeSelection.length - 1; g >= 0; g--) {
				let hh = a.activeSelection[g];
				if (hh.isOK) {
					isSelActive = true;
					hh.isOK = 0;
				}


				if (isSelActive) break;
				else if (a.parameters.ai == !(g - 1 < 0)) a.selectUnderControl = g - 1;
				////console.log(g);

			}
			if (!isSelActive) {
				a.showHide(0);
			}
			this.playSound("cancel");
			return;
		}
		if (this.submenuSequence.length > 0) {
			let a = this.submenuSequence.pop();
			this.changeMenu(a, false, true);
		}
		this.playSound("cancel");
	}

	jsonMenuManager = new class {
		constructor() {
			this.loadedJson = {};
			/*this.loop = new DateSynchronizedLoopHandler(60, (l) => {
			 
			});*/

			this.isLoaded = false;


		}
	}();


	characterMenu = new class {

		constructor(a, b) {
			this.parents = {
				main: a,
				char: b
			};

			this.isActive = 0;

			this.touchPanelSystem = new DOMTouchInteractivity(id("CSFRONT-PANEL"), (event) => {
				this.panelInteractListen(event);
			})

			this.animations = {

			}

			this.animNames = [];
			//for (let aa in this.animations) this.animNames.push(aa);
			this.charNames = {

			};

			this.charSidesSelector = {};

			for (let kl of ["left", "right"]) {
				let ll = {
					left: 1,
					right: 2
				} [kl];
				this.charSidesSelector[kl] = ll - 1;
				this.charNames[kl] = new ChangeFuncExec("-1|-1", (ev) => {
					let split = ev.split("|");
					let isNegative = ~~split[0] < 0;
					style(`CSBEHIND-P${ll}-CHARNAME`, "display", (isNegative) ? "nome" : "block");
					style(`CSBEHIND-P${ll}-VERSIONNAME`, "display", (isNegative) ? "nome" : "block");

					if (split[0] > -1) {
						//this.versionNames[kl].execute();
						if (~~(split[0]) > this.parents.char.characters.length - 1) return;
						let reference = this.parents.char.characters[~~split[0]];
						ih(`CSBEHIND-P${ll}-CHARNAME`, language.charTranslate(`${reference.core.name}`));
						let ver = reference.versions[~~split[1]];
						ih(`CSBEHIND-P${ll}-VERSIONNAME`, language.charTranslate(`${ver.lang_path}>${ver.name}`));

					} else {

					}
				});
			}

			/*this.versionNames = {
			 
			};
			
			
			for (let kl of ["left", "right"]) {
			 let ll = {
			  left: 1,
			  right: 2
			 }[kl];
			 
			 this.versionNames[kl] = new NumberChangeFuncExec(-2, (ev) => {
			  let isNegative = ev < 0;
			  style(`CSBEHIND-P${ll}-VERSIONNAME`, "display", (isNegative) ? "nome" : "block");
			  
			  if (ev > -1) {
			   let selected = -1;
			   
			   if (selected === -1) return;
			   let reference = this.parents.char.characters[this.activeSelection[this.charSidesSelector[kl]].selection];
			   let ver = reference.versions[ev];
			   ih(`CSBEHIND-P${ll}-VERSIONNAME`, language.charTranslate(`${ver.lang_path}>${ver.name}`));
			  } else {
			   
			  }
			 });
			}*/

			this.canvasDims = {
				panel: [20 * 35, 20 * 20],
				background: [1280, 720],
			};

			this.panelSize = {
				x: 0,
				y: 0,
				w: 0,
				h: 0
			};

			this.panelInteraction = {
				x: 0,
				y: 0
			};

			this.panelInteractionDown = {
				x: 0,
				y: 0
			};

			this.selSqSzMrg = {
				w: 20 * 3 * 1.2,
				h: 20 * 2 * 1.2,
				m: 20 * 0.14
			};

			this.modeSqSzMrg = {
				w: 20 * 5 * 1.2,
				h: 20 * 5 * 1.2,
				m: 20 * 0.14
			};

			this.checkSqSzMrg = {
				w: 20 * 3 * 1.2,
				h: 20 * 3 * 1.2,
				m: 20 * 0.14
			};

			this.canvasses = {};
			this.canvassesCtx = {};

			this.selectUnderControl = 0;

			this.isPanelPressed = 0;

			this.isPanelPressedDown = 0;

			this.activeSelection = [];

			for (let st = 0; st < 2; st++) {
				this.activeSelection[st] = this.parents.main.#charselectCreateSelector();
			}

			this.parameters = {
				dual: 1,
				ai: 1,
				modePick: true,
				players: 2,
				modeparams: []
			};

			this.page = 0;
			this.isOkaySelection = {};

			this.characterSelectBoxes = {};
			for (let h = 0; h < 8 * 4; h++) {
				this.characterSelectBoxes[h] = ({
					character: h,
					version: 0,
					x: h % 8,
					y: ~~(h / 8),
					selected: {},
					canOK: false,
					poscent: {
						x: 0,
						y: 0,
						w: 0,
						h: 0
					}
				});
			}

			this.modeSelectBoxes = {};

			for (let h = 0; h < 2; h++) {
				this.modeSelectBoxes[h] = ({
					mode: h,
					x: h,

					selected: {},
					poscent: {
						x: 0,
						y: 0,
						w: 0,
						h: 0
					}
				});
			}

			this.selectImages = {};
			this.introductionSounds = {};

			this.canvasTemp = {
				background: "CSBEHIND-BG-CANVAS",
				panel: "CSFRONT-PANEL-CANVAS"
			};

			for (let g in this.canvasTemp) {
				let h = this.canvasTemp[g];
				let cid = id(h);
				this.canvasses[g] = cid;
				this.canvassesCtx[g] = cid.getContext("2d");
				cid.width = this.canvasDims[g][0];
				cid.height = this.canvasDims[g][1];
			}
		}

		setupAnims() {
			////console.log(this.parents.main.characterContainer);

			this.animations = {
				csShow: new AnimationFrameRenderer(this.parents.main.characterContainer, 0, 25, 1000 / 60, {
					name: "menu-layer-in",
					timing: "cubic-bezier(0,0,0,1)",
				}),
				csHide: new AnimationFrameRenderer(this.parents.main.characterContainer, 0, 25, 1000 / 60, {
					name: "menu-layer-out",
					timing: "cubic-bezier(0,0,0,1)",
				}),

			}

			this.animNames = [];
			for (let aa in this.animations) this.animNames.push(aa);

		}

		playAnimation(name) {
			if (name in this.animations) this.animations[name].play();
		}

		showHide(toggle) {
			this.isPanelPressed = false;
			this.isActive = toggle ? 1 : 0;
			this.playAnimation("cs" + (this.isActive ? "Show" : "Hide"));
			styleelem(this.parents.main.characterContainer, "display", this.isActive ? "flex" : "none");
		}

		setParameters(param) {
			if ("is_dual" in param) {
				this.parameters.dual = param.is_dual;
			}
			if ("is_ai" in param) {
				this.parameters.ai = param.is_ai;
			}
			if ("is_pick_mode" in param) {
				this.parameters.modePick = param.is_pick_mode;
			}
			if ("playerpos" in param) {
				this.parameters.activepos = param.playerpos;
			}

			this.activeSelection.length = 0;
			let pos = 0;
			if (this.parameters.activepos == "first") pos = 0;
			game.actualParameters.active = pos;
			this.parameters.players = param.players;
			this.selectUnderControl = 0;
			for (let h = 0; h < param.players; h++) {
				let name = "Computer " + h;

				let ai = this.parameters.ai;

				if (pos == h) name = this.parents.main.storage.getItem("playername", "Player 1")
				this.activeSelection.push(this.parents.main.#charselectCreateSelector(name, pos == h ? 0 : ai));

				if (this.parameters.dual) ih(`CSBEHIND-P${h + 1}-PLAYERNAME`, name);


			}
			style("CSBEHIND-DET-P2-DIV", "display", this.parameters.dual ? "flex" : "none")
			
		}


		async loadImages() {
			for (let char of this.parents.char.characters) {
				for (let ver in char.versions) {

					let version = char.versions[ver];
					let base = `${char.core.path}/${version.path}`;
					let selectSrc = `${base}/${version.select_image}`;
					////console.log(selectSrc)
					try {
						let img = await loadImage(`assets/characters/${selectSrc}`);

						this.selectImages[`${char.core.path}||${version.path}`] = img;



						////console.log(selectSrc, img);
					} catch (e) {
						//console.log(e)

						let version = char.versions[ver];
						let base = `${char.core.path}/${version.path}`;
						let selectSrc = `${base}/${version.select_image}`;
						this.selectImages[`${char.core.path}||${version.path}`] = new Image();
					}
				}
			}
		}
		#clearCanvas(canvas) {
			let c = this.canvasses[canvas];
			let ctx = this.canvassesCtx[canvas];
			ctx.clearRect(0, 0, c.width, c.height);
		}

		setupPlayerGame() {
			try {
			let a = game.actualParameters,
				b = this.activeSelection;
			a.players.length = 0;
			let main = this.parents.main;
			let isPlayer = {};
			let isOccupied = {};
			let order = {};
			if (b.length == 2) {
				game.activePlayer = ~~menu.storage.getValueFromRangeListSpecific("set_session_boardpos_2p");
				//console.log(game.activePlayer);
			} else game.activePlayer = 0;
			let count = 0;

			for (let u = 0; u < b.length; u++) {
				let h = b[u];
				if (!h.isAi) {
					let g = game.activePlayer;
					order[g] = (u);
					isPlayer[u] = g;
					isOccupied[g] = 1;
				} else count++;

				//order[g] = (u);
			}
			//console.log(order)

			let i = 0; // board
			let t = 0; // player
			while (count >= t) {
				if (!(t in isPlayer)) {
					if (i in isOccupied) {
						i++;
					} else {
						order[i] = t;
						t++;
						i++
					}
				} else t++;

			}

			//console.log(b, order)
			for (let u = 0; u < b.length; u++) {
				let h = b[order[u]];
				a.players.push(game.createPlayerParam(h.name, h.selection, h.version, h.mode, h.ai));
			}

			//setTimeout(() => game.initialize("actualparameter", false), 500);

			//let a = JSON.parse(dataString);

			let sel = [
				{
					string: "gameprep_start",
					type: "button",
					action: "actualinit",
					onstate: "#ffff",
					offstate: "#fff2",
					desc: "replaycenter_loadexternal_desc",
					backable: true
		}
		];

			for (let g of this.parameters.modeparams) {
				let w = g.split("|");
				let setting = main.storage.getList(`set_prep_${w[0]}`);
				//console.log(setting, w);
				sel.push({
					"string": `gameprepset_${w[2]}`,
					"type": setting.type,
					"onstate": "#ffff",
					"offstate": "#fff2",
					"property": `set_prep_${w[1]}`,
					"list": `set_prep_${w[0]}`,
					"desc": `gameprepset_${w[2]}_desc`
				});
			}

			let mel = {
				def: 0,
				name: "gameprep_start",
				title_raw: language.translate("gameprep_title"),
				sel: sel,
				background: {
					"type": "rgba",
					"color": "#222F"
				}
			};




			main.changeMenu(JSON.stringify(mel), true);



			//game.startGameSet("actual");
			this.showHide(0);
			this.activeSelection.length = 0;
		}catch(e) {
			alert(e.stack);
		}
		}

		checkButton(select) {
			let g = this.characterSelectBoxes[select.selection];
			if (!g.canOK) {
				this.parents.main.playSound("error");
				return;
			}
			select.isOK = 1;
			this.parents.main.playSound("select");
			if (this.selectUnderControl < this.activeSelection.length - 1) {

				////console.log(select);
				this.selectUnderControl++;
				//if (this.selectUnderControl >= this.activeSelection.length) this.selectUnderControl--;
			} else {
				this.setupPlayerGame();
			}
			//this.parents.main.playSound("select");
		}

		draw() {
			if (!this.isActive) return;
			for (let h = 0, m = this.animNames.length; h < m; h++)
				this.animations[this.animNames[h]].run();

			////console.log(this.activeSelection);


			this.#clearCanvas("background");
			this.#clearCanvas("panel");


			for (let g = 0; g < (8 * 4); g++) {

				let gw = g % 8;

				let boxref = this.characterSelectBoxes[g];

				let lx = ((this.canvasDims.panel[0] / 2) - (((this.selSqSzMrg.w * 8) + (this.selSqSzMrg.m * 7)) / 2) + ((this.selSqSzMrg.w * (gw)) + (this.selSqSzMrg.m * (gw + 1)))),
					ly = ((this.selSqSzMrg.h + this.selSqSzMrg.m) * (~~(g / 8)) + this.selSqSzMrg.m * 3),
					lw = this.selSqSzMrg.w,
					lh = this.selSqSzMrg.h;
				this.canvassesCtx.panel.fillStyle = "#f833";

				this.canvassesCtx.panel.fillRect(lx, ly, lw, lh);
				

				let charref = this.parents.char.characters[boxref.character];
				boxref.canOK = false;
				if (!charref) continue;
				if (!(`${charref.core.path}||${charref.versions[boxref.version].path}` in this.selectImages)) {
					continue;
				}
				boxref.canOK = true;


				let reference = this.selectImages[`${charref.core.path}||${charref.versions[boxref.version].path}`];

				this.canvassesCtx.panel.drawImage(reference, 600, 0, 140, 140 * (2 / 3), lx, ly, lw, lh);

				boxref.poscent.x = lx / this.canvasDims.panel[0];
				boxref.poscent.y = ly / this.canvasDims.panel[1];
				boxref.poscent.w = (lw + lx) / this.canvasDims.panel[0];
				boxref.poscent.h = (lh + ly) / this.canvasDims.panel[1];
				let hover = game.misc.menu_cs_border_black;
				if (boxref.poscent.x <= this.panelInteraction.x && (boxref.poscent.w) >= this.panelInteraction.x &&
					boxref.poscent.y <= this.panelInteraction.y && (boxref.poscent.h) >= this.panelInteraction.y) {
					hover = game.misc.menu_cs_border_yellow;

					////console.log(g);
				}

				this.canvassesCtx.panel.drawImage(hover, 0, 0, 150, 100, lx, ly, lw, lh);


				if (this.isPanelPressedDown > 0) {

					////console.log(this.panelInteraction.x, boxref.poscent.x, this.panelInteraction.y, boxref.poscent.y)
					if (boxref.poscent.x <= this.panelInteractionDown.x && (boxref.poscent.w) >= this.panelInteractionDown.x &&
						boxref.poscent.y <= this.panelInteractionDown.y && (boxref.poscent.h) >= this.panelInteractionDown.y) {
						let select = this.activeSelection[this.selectUnderControl];
						this.changeSelectionChar(select, boxref.character);
						////console.log(g);
					}
				}




				////console.log(boxref.poscent.x)

			}



			if (this.parameters.modePick) {
				let selected1 = 0,
					selected0 = 0;
				if (!this.parameters.ai) {
					for (let g = 0; g < (this.parameters.players); g++) {
						let boxref = this.activeSelection[g];
						if (boxref.mode == 0) selected0++;
						if (boxref.mode == 1) selected1++;
					}
				} else {
					let boxref = this.activeSelection[this.selectUnderControl];
					if (boxref.mode == 0) selected0++;
					if (boxref.mode == 1) selected1++;
				}


				for (let g = 0; g < (2); g++) {

					let gw = g % 8;

					let boxref = this.modeSelectBoxes[g];


					let lx = ((0.05 * this.canvasDims.panel[0]) + ((this.modeSqSzMrg.w * (gw)) + (this.modeSqSzMrg.m * (gw + 1)))),
						ly = (0.535 * this.canvasDims.panel[1]),
						lw = this.modeSqSzMrg.w,
						lh = this.modeSqSzMrg.h;
					/*this.canvassesCtx.panel.fillStyle = "#f83";
					
					this.canvassesCtx.panel.fillRect(lx,ly,lw,lh);*/



					//this.canvassesCtx.panel.drawImage(game.misc.menu_cs_border_black, 0, 0, 150, 100, lx,ly,lw,lh);


					boxref.poscent.x = lx / this.canvasDims.panel[0];
					boxref.poscent.y = ly / this.canvasDims.panel[1];
					boxref.poscent.w = (lw + lx) / this.canvasDims.panel[0];
					boxref.poscent.h = (lh + ly) / this.canvasDims.panel[1];

					let hover = 0;

					if (boxref.poscent.x <= this.panelInteraction.x && (boxref.poscent.w) >= this.panelInteraction.x &&
						boxref.poscent.y <= this.panelInteraction.y && (boxref.poscent.h) >= this.panelInteraction.y) {
						hover = 1;
						if (this.isPanelPressing) hover = 2;
						////console.log(g);
					}

					this.canvassesCtx.panel.drawImage(game.misc.menu_cs_mode_pick, (100 * ((hover > 0) ? hover : ((selected0 && g == 0) || (selected1 && g == 1)) ? 3 : 0)), 100 + (g * 100), 100, 100, lx, ly, lw, lh);

					if (this.isPanelPressedDown > 0) {



						////console.log(this.panelInteraction.x, boxref.poscent.x, this.panelInteraction.y, boxref.poscent.y)
						if (boxref.poscent.x <= this.panelInteractionDown.x && (boxref.poscent.w) >= this.panelInteractionDown.x &&
							boxref.poscent.y <= this.panelInteractionDown.y && (boxref.poscent.h) >= this.panelInteractionDown.y) {
							let select = this.activeSelection[this.selectUnderControl];
							select.mode = g;
							////console.log(g);
						}
					}




					////console.log(boxref.poscent.x)

				}
			}


			{
				let lx = ((this.canvasDims.panel[0] / 2) - (this.checkSqSzMrg.w / 2)),
					ly = (0.8 * this.canvasDims.panel[1]),
					lw = this.checkSqSzMrg.w,
					lh = this.checkSqSzMrg.h;
				/*this.canvassesCtx.panel.fillStyle = "#f83";
				
				this.canvassesCtx.panel.fillRect(lx,ly,lw,lh);*/
				//this.canvassesCtx.panel.drawImage(game.misc.menu_cs_border_black, 0, 0, 150, 100, lx,ly,lw,lh);
				let bx = lx / this.canvasDims.panel[0];
				let by = ly / this.canvasDims.panel[1];
				let bw = (lw + lx) / this.canvasDims.panel[0];
				let bh = (lh + ly) / this.canvasDims.panel[1];

				let hover = 0;

				if (bx <= this.panelInteraction.x && (bw) >= this.panelInteraction.x &&
					by <= this.panelInteraction.y && (bh) >= this.panelInteraction.y) {
					hover = 1;
					if (this.isPanelPressing) hover = 2;
					////console.log(g);
				}

				this.canvassesCtx.panel.drawImage(game.misc.menu_cs_mode_pick, (100 * ((hover > 0) ? hover : (0) ? 3 : 0)), 0, 100, 100, lx, ly, lw, lh);

				if (this.isPanelPressedDown > 0) {



					////console.log(this.panelInteraction.x, boxref.poscent.x, this.panelInteraction.y, boxref.poscent.y)
					if (bx <= this.panelInteractionDown.x && (bw) >= this.panelInteractionDown.x &&
						by <= this.panelInteractionDown.y && (bh) >= this.panelInteractionDown.y) {
						let select = this.activeSelection[this.selectUnderControl];
						//select.mode = g;
						//this.changeSelectionChar(select, boxref.character);
						////console.log(g);
						this.checkButton(select);
					}
				}




				////console.log(boxref.poscent.x)

			}

			if (typeof this.activeSelection[this.charSidesSelector.left] !== "undefined") {
				let select = this.activeSelection[this.charSidesSelector.left];
				let g = select.selection,
					gw = g % 8;
				//game.frames += 0.1;
				let lx = ((this.canvasDims.panel[0] / 2) - (((this.selSqSzMrg.w * 8) + (this.selSqSzMrg.m * 7)) / 2) + ((this.selSqSzMrg.w * (gw)) + (this.selSqSzMrg.m * (gw + 1)))),
					ly = ((this.selSqSzMrg.h + this.selSqSzMrg.m) * (~~(g / 8)) + this.selSqSzMrg.m * 3),
					lw = this.selSqSzMrg.w,
					lh = this.selSqSzMrg.h;




				this.canvassesCtx.panel.drawImage(game.misc.menu_cs_border_green, 0, 0, 150, 100, lx, ly, lw, lh);
				//let boxref = this.characterSelectBoxes[g];
				let charref = this.parents.char.characters[g];


				if ((charref?.core) && (`${charref.core.path}||${charref.versions[select.version].path}` in this.selectImages)) {
					let reference = this.selectImages[`${charref.core.path}||${charref.versions[select.version].path}`];

					this.canvassesCtx.background.drawImage(reference, 0, 0, 600, 600, -140, 0, 720, 720);


				}
				if (this.parameters.modePick) this.canvassesCtx.background.drawImage(game.misc.menu_cs_mode_pick, (100 * ((select.isOK) ? 3 : 0)), (100 + (100 * select.mode)), 100, 100, 20, 420, 120, 120);
				else if (select.isOK) this.canvassesCtx.background.drawImage(game.misc.menu_cs_mode_pick, (100 * 3), (0), 100, 100, 20, 420, 120, 120);
				this.charNames.left.assign(`${select.selection}|${select.version}`);
				////console.log(`${select.selection}|${select.version}`)
			}

			if (typeof this.activeSelection[this.charSidesSelector.right] !== "undefined" && this.parameters.dual) {
				let select = this.activeSelection[this.charSidesSelector.right];
				let g = select.selection,
					gw = g % 8;
				//game.frames += 0.1;
				let lx = ((this.canvasDims.panel[0] / 2) - (((this.selSqSzMrg.w * 8) + (this.selSqSzMrg.m * 7)) / 2) + ((this.selSqSzMrg.w * (gw)) + (this.selSqSzMrg.m * (gw + 1)))),
					ly = ((this.selSqSzMrg.h + this.selSqSzMrg.m) * (~~(g / 8)) + this.selSqSzMrg.m * 3),
					lw = this.selSqSzMrg.w,
					lh = this.selSqSzMrg.h;
				this.canvassesCtx.panel.drawImage(game.misc.menu_cs_border_green, 0, 0, 150, 100, lx, ly, lw, lh);
				//let boxref = this.characterSelectBoxes[g];
				let charref = this.parents.char.characters[g];


				if ((charref?.core) && (`${charref.core.path}||${charref.versions[select.version].path}` in this.selectImages)) {
					let reference = this.selectImages[`${charref.core.path}||${charref.versions[select.version].path}`];

					this.canvassesCtx.background.drawImage(reference, 0, 600, 600, 600, 1280 - 580, 0, 720, 720);
				}
				if (this.parameters.modePick) this.canvassesCtx.background.drawImage(game.misc.menu_cs_mode_pick, (100 * ((select.isOK) ? 3 : 0)), (100 + (100 * select.mode)), 100, 100, 1280 - 140, 420, 120, 120);
				else if (select.isOK) this.canvassesCtx.background.drawImage(game.misc.menu_cs_mode_pick, (100 * (3)), 0, 100, 100, 1280 - 140, 420, 120, 120);
				this.charNames.right.assign(`${select.selection}|${select.version}`);

			}
			if (this.isPanelPressed > 0) this.isPanelPressed--;
			if (this.isPanelPressedDown > 0) this.isPanelPressedDown--;

		}
		changeSelectionChar(select, n) {
			if (select.lastSelection !== n) {
				select.selection = n;
				select.lastSelection = n;
				select.version = 0;
			}

		}
		resize() {
			let size = this.parents.main.cellSize;
			let ls = this.parents.main.landscape;
			let bg = this.canvasses.background;
			let pn = id("CSFRONT-PANEL");
			let pnc = this.canvasses.panel;

			styleelem(bg, "width", `${ls.w}px`);
			styleelem(bg, "height", `${ls.h}px`);
			for (let ll of ["FRONT", "BEHIND"]) {
				style(`CHARSELECT-${ll}-DIV`, "width", `${ls.w}px`);
				style(`CHARSELECT-${ll}-DIV`, "height", `${ls.h}px`);
			}

			style(`CSBEHIND-DETAILS-DIV`, "width", `${ls.w}px`);
			style(`CSBEHIND-DETAILS-DIV`, "height", `${ls.h}px`);

			for (let ll of [1, 2]) {
				style(`CSBEHIND-DET-P${ll}-DIV`, "width", `${ls.w}px`);
				style(`CSBEHIND-DET-P${ll}-DIV`, "height", `${size * 5.6}px`);

				//for (let hh of [])

				style(`CSBEHIND-P${ll}-VERSIONNAME`, "font-size", `${~~(size * 1.3)}px`);
				style(`CSBEHIND-P${ll}-CHARNAME`, "font-size", `${~~(size * 2.7)}px`);
				style(`CSBEHIND-P${ll}-PLAYERNAME`, "font-size", `${~~(size * 1.6)}px`);

				style(`CSBEHIND-P${ll}-VERSIONNAME`, "width", `${ls.w}px`);
				style(`CSBEHIND-P${ll}-VERSIONNAME`, "height", `${~~(size * 1.3)}px`);

				style(`CSBEHIND-P${ll}-CHARNAME`, "width", `${ls.w}px`);
				style(`CSBEHIND-P${ll}-CHARNAME`, "height", `${~~(size * 2.6)}px`);

				style(`CSBEHIND-P${ll}-PLAYERNAME`, "width", `${ls.w}px`);
				style(`CSBEHIND-P${ll}-PLAYERNAME`, "height", `${~~(size * 1.7)}px`);

				style(`CSBEHIND-P${ll}-CHARNAME`, "font-family", "josefinsans");

				for (let hh of ["VERSIONNAME", "PLAYERNAME", "CHARNAME"]) {
					style(`CSBEHIND-P${ll}-${hh}`, "text-align", ["left", "right"][ll - 1]);
					style(`CSBEHIND-P${ll}-${hh}`, "vertical-align", "center");
					style(`CSBEHIND-P${ll}-${hh}`, "position", "relative");

					style(`CSBEHIND-P${ll}-${hh}`, "bottom", "0");
					style(`CSBEHIND-P${ll}-${hh}`, ["left", "right"][ll - 1], `${size * 1}px`);


				}

			}

			styleelem(pn, "width", `${size * 35}px`);
			styleelem(pn, "height", `${size * 20}px`);
			styleelem(pn, "top", `${size * 2}px`);

			this.panelSize.w = size * 35;
			this.panelSize.h = size * 20;

			styleelem(pnc, "width", `${size * 35}px`);
			styleelem(pnc, "height", `${size * 20}px`);

			let rect = pn.getBoundingClientRect();
			this.panelSize.x = rect.x;
			this.panelSize.y = rect.y;
		}

		panelInteractListen(evt) {

			//evt.preventDefault();
			if (!this.isActive) return;
			let rect = id("CSFRONT-PANEL").getBoundingClientRect();
			this.panelSize.x = rect.x;
			this.panelSize.y = rect.y;
			if (evt.type == "mousemove" || evt.type == "touchstart") {

				let x = (evt.pageX - this.panelSize.x) / this.panelSize.w;
				let y = (evt.pageY - this.panelSize.y) / this.panelSize.h;
				////console.log(this.panelSize.x, this.panelSize.y)

				this.panelInteraction.x = x;
				this.panelInteraction.y = y;

				//ih("MENU-HEADER-TITLE", `${x} ${y}`);

				this.isPanelPressed = 1;
			}
			if (evt.type == "mousedown") {

				this.isPanelPressedDown = 1;
				this.isPanelPressing = 1;

				let x = (evt.pageX - this.panelSize.x) / this.panelSize.w;
				let y = (evt.pageY - this.panelSize.y) / this.panelSize.h;
				////console.log(this.panelSize.x, this.panelSize.y)

				this.panelInteractionDown.x = x;
				this.panelInteractionDown.y = y;
			}

			if (evt.type == "mouseup") {
				this.isPanelPressing = 0;
			}

			if (evt.type == "laf&& " || evt.type == "hdjdj") {
				this.showHide(0);
			}
			if (this.isPanelPressed || true) {



				////console.log(evt.type, x, y, evt.pageX - this.panelSize.x, evt.pageY - this.panelSize.y, this.panelSize.w, this.panelSize.h);
			}

		}

		setupPanelIntListener() {
			for (let pp of [ /*"touchstart", "touchmove", "touchend", */ "mouseover", "contextmenu", "mousedown", "mouseup", "mousemove"]) id("CSFRONT-PANEL").addEventListener(pp, (ee) => {
				ee.preventDefault();
				this.panelInteractListen(ee);
			}, true);

			//this.touchPanelSystem.initialize();
		}



		controlsListen(key) {

			let addition = 0;
			let select = this.activeSelection[this.selectUnderControl];
			let change = select.selection;
			if (key === "arrowleft") {
				addition = -1;
				if ((((~~(change / 8)) - ~~(((change + addition)) / 8))) == 1) {
					addition += 8;
				}
			}
			if (key === "arrowright") {
				addition = 1;
				if (((~~(change / 8)) - ~~((change + addition) / 8)) == -1) {
					addition -= 8;
				}
			}
			if (key === "arrowup") {
				addition = -8;
			}
			if (key === "arrowdown") {
				addition = 8;
			}
			if (key === "enter") {
				//let select = this.activeSelection[this.selectUnderControl];
				this.checkButton(select);
				
			}
			if (key === "m") {
				//let select = this.activeSelection[this.selectUnderControl];
				select.mode = [1, 0][select.mode];
			}
			if (key === "backspace") {
				this.parents.main.backButton();
			}
			
			//if ()

			change += addition;

			if (change >= (8 * 4)) {
				change -= 8;
			}
			if (change < (0)) {
				change += 8;
			}
			
			if (change !== -1) {
				this.changeSelectionChar(select, change);
				if (addition !== 0) this.parents.main.playSound("move");
			}
			
			
		}

	}(this, gtcharacter);




}();






__private.menu = menu;
if (appinfo.android) {
	accessible.menu = menu;
}
////console.log(__private)