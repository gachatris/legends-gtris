const manager = new class {
	#DelayHandler = class {
		constructor(delay, func) {
			this.func = func;
			this.delay = delay;
			this.id = btoa(Math.random() * 2147483647);
		}
		run() {
			this.delay--;
			if (this.delay == 0) this.func();
		}
	};
	constructor() {
		this.FPS = 60;

		this.synchroLoop = new DateSynchronizedLoopHandler(this.FPS, () => {
			this.frameLoop();
		})

		this.presets = {
			block: {},
			blobNormal: {},
			blobMicro: {}
		}

		this.resQualityMult = 2;

		this.isRunning = false;

		this.pause = {
			on: true,
			frame: 0
		};

		this.matchEndHandler = {
			frame: -9,
			on: false,
			endable: false,
			isFinishActual: false,
			hasEnded: false
		};



		Object.freeze(this.FPS);
		this.frames = 0;
		this.countdown = 120;
		this.waitCountdown = 50;
		this.isFreezeHandlers = false;
		this.assetHTML = "";
		this.assetStyle = "";
		this.resolution = {
			w: 1280,
			h: 720
		};
		this.aspectResolution = {
			w: 1289,
			h: 720
		};
		this.portrait = {
			x: 720,
			y: 1289
		}
		this.landscape = {
			x: 720,
			y: 1289
		};
		this.aspectRatio = 16 / 9;
		this.orientation = null;
		this.cellSize = null;
		this.playerAreaSizeMult = 0.36; //0.56;

		this.activePlayer = 0;
		this.playerCount = null;
		this.players = {};

		this.isSolo = false;

		this.skinTemp = {
			canvas: void 0,
			ctx: void 0,
		};

		this.skin = {
			canvas: void 0,
			ctx: void 0,
		};

		this.skinBlob = {
			canvas: void 0,
			ctx: void 0,
		};

		this.skinBlobTemp = {
			canvas: void 0,
			ctx: void 0,
		};

		this.skinGarbTemp = {
			canvas: void 0,
			ctx: void 0,
		};

		this.skinParticle = {
			canvas: void 0,
			ctx: void 0,
		};

		this.skinParticleTemp = {
			canvas: void 0,
			ctx: void 0,
		};

		this.skinGarb = {
			canvas: void 0,
			ctx: void 0,
		};

		this.skinAppear = {
			canvas: new OffscreenCanvas(70 * 10, 70 * 4),
			ctx: void 0,
		};
		this.skinAppear.ctx = this.skinAppear.canvas.getContext("2d");

		this.skinClear = {
			canvas: new OffscreenCanvas(70 * 10, 70 * 6),
			ctx: void 0,
		};
		this.skinClear.ctx = this.skinClear.canvas.getContext("2d");


		this.loadCanvas = {
			canvas: void 0,
			ctx: void 0,
		};

		this.loadCanvas.canvas = id("LOAD-TRIVIA-CANVAS");
		this.loadCanvas.ctx = this.loadCanvas.canvas.getContext("2d");

		this.loadDiv = {
			main: id("GTRIS-LOAD-SCREEN"),
		};

		this.seeds = {
			preview: new ParkMillerPRNG(),
			main: new ParkMillerPRNG(),
		};

		elem("CANVAS", canvas => {
			canvas.width = 250 * 16;
			canvas.height = 250 * 16;
			this.skinBlob.canvas = canvas;
			let ctx = canvas.getContext("2d");
			this.skinBlob.ctx = ctx;
		});

		elem("CANVAS", canvas => {
			canvas.width = 250 * 16;
			canvas.height = 250 * 16;
			this.skinBlobTemp.canvas = canvas;
			let ctx = canvas.getContext("2d");
			this.skinBlobTemp.ctx = ctx;
		});


		elem("CANVAS", canvas => {
			canvas.width = 130 * 4;
			canvas.height = 130 * 12;
			this.skin.canvas = canvas;
			let ctx = canvas.getContext("2d");
			this.skin.ctx = ctx;
		});


		elem("CANVAS", canvas => {
			canvas.width = 130 * 4;
			canvas.height = 130 * 12;
			this.skinTemp.canvas = canvas;
			let ctx = canvas.getContext("2d");
			this.skinTemp.ctx = ctx;
		});

		elem("CANVAS", canvas => {
			canvas.width = 1100;
			canvas.height = 100;
			this.skinParticle.canvas = canvas;
			let ctx = canvas.getContext("2d");
			this.skinParticle.ctx = ctx;
		});

		elem("CANVAS", canvas => {
			canvas.width = 1100;
			canvas.height = 100;
			this.skinParticleTemp.canvas = canvas;
			let ctx = canvas.getContext("2d");
			this.skinParticleTemp.ctx = ctx;
		});

		elem("CANVAS", canvas => {
			canvas.width = 130 * 6;
			canvas.height = 130 * 4;
			this.skinGarb.canvas = canvas;
			let ctx = canvas.getContext("2d");
			this.skinGarb.ctx = ctx;
		});

		elem("CANVAS", canvas => {
			canvas.width = 1600;
			canvas.height = 400;
			this.skinGarbTemp.canvas = canvas;
			let ctx = canvas.getContext("2d");
			this.skinGarbTemp.ctx = ctx;
		});

		this.henshinBg = {};
		this.feverBg = {};

		this.wormholeBg = {};

		this.insaneEye = {
			canvas: new OffscreenCanvas(200, 200),
			ctx: void 0
		};
		this.insaneEye.ctx = this.insaneEye.canvas.getContext("2d");

		this.pressStr = "";

		this.isRoundNext = false;

		this.isRoundActive = false;
		this.roundNextTime = -20;

		this.pressFlagInput = {

		};

		this.misc = {};

		//this.inGameParameters.mode = null;
		let earlyStart = 30;
		this.matchSignal = {
			html: {
				ready: id("OVERLAY-MS-READY"),
				start: id("OVERLAY-MS-START"),
			},
			separator: {
				ready: new TextToHTMLLetterSeparator(),
				/*start: new TextToHTMLLetterSeparator(),*/
			},
			main: new FrameRenderer(0, 210 - earlyStart, (frame, max) => {
				if (frame <= 150 - earlyStart) {
					let array = this.matchSignal.separator.ready.a;
					let length = array.length;
					//let mframe = frame - Math.min(0, Math.max(frame - 30, 10));

					if (frame < 140 - earlyStart) styleelem(this.matchSignal.html.ready, "animation-delay", `${~~((1000 / (-1 * 60)) * Math.max(0, frame - (30)))}ms`);
					if (frame == 30) sound.play("ready");
					////console.log(~~((1000 / (-1 * 60)) * (91)), ~~((1000 / (-1 * 60)) * (frame)), frame)
					////console.log(frame);
					for (let h = 0; h < length; h++) {
						let o = frame;
						if (frame === 150 - earlyStart) {
							o = -1;
							styleelem(array[h], "opacity", "0%");
						}
						styleelem(array[h], "animation-delay", `${~~((1000 / (-1 * 60)) * Math.max(0, o))}ms`);
					}
				}
				if (frame <= (210 - earlyStart) && frame > (89 - earlyStart)) {
					let o = frame - (150 - earlyStart);

					if (o == 7) sound.play("start");
					styleelem(this.matchSignal.html.start, "animation-delay", `${~~((1000 / (-1 * 60)) * Math.max(0, o))}ms`);
					////console.log(~~((1000 / (-1 * 60)) * (91)), ~~((1000 / (-1 * 60)) * (frame)), frame)
					////console.log(frame);

				}
			}),

		};

		this.replay = {
			data: {},
			isOn: false,
			isFile: false,
			replays: [],
			replaysIndex: 0
		};

		this.animations = {
			fade: new AnimationFrameRenderer(id("GTRIS-FADE"), 0, 14, 1000 / 60, {
				name: "blackfade-inout",
				timing: "linear",
			}),
			mswhready: new AnimationFrameRenderer(this.matchSignal.html.start, 0, 180, 1000 / 60, {
				name: "matchsignal-wormhole-ready",
				timing: "linear",
			}),
			mswhstart: new AnimationFrameRenderer(this.matchSignal.html.start, 0, 180, 1000 / 60, {
				name: "matchsignal-wormhole-start",
				timing: "linear",
			}),

		};

		this.animationNames = Object.keys(this.animations);

		this.delayHandlers = [];

		this.isGameLoaded = true;

		this.isPlayerJsonLoaded = true;

		this.targetPointSystem = {
			initial: 70,
			previous: 70,
			iteration: 0,
			iterIncDel: 16 * this.FPS,
			marginTime: 1 * this.FPS,
			targetPoint: 90,

			prep: {
				marginTime: 1 * this.FPS,
				initial: 70,
			}

		}

		this.numberExecHandlers = {
			insaneMFX: new NumberChangeFuncExec(-1, (am) => {
				//music.stopAll();
				background.setFGColor(0, 0, 0, 0);
				if (am == 1) {
					music.play("insane", true);
					background.setFGColor(0, 0, 0, 0.5);

				}
				if (am == 3) {
					music.play("wmw_eval");

				} //else music.stopAll();
				if (am == 2) {
					music.play("insane_transform");
				}
				if (am == 4) {
					music.play("warning");
				}
				if (am == 5) {
					music.play("game_match", true);
				}
				if (am == 0) {
					music.stopAll();
				}
			}),
			wormholeLoop: new NumberChangeFuncExec(-1, (am) => {
				//music.stopAll();
				if (am == 1) {
					sound.play("wormhole_loop");

				}
				if (am == 0) {
					sound.stop("wormhole_loop");

				} //else music.stopAll();

			}),
		}

		this.isFinish = false;


		this.swapMode = {
			on: false,
			pickDel: 120,
			blockOrBlob: 0,
			time: 0,
			decidedBlockOrBlob: 0,
			maxTime: 30 * this.FPS,
			swapDel: -90
		}

		this.woiMode = {
			isEvaluation: false,
			shoot: 0,
			time: 0,
			restart: -9,
			timeDelay: -9,
			maxTime: 80 * this.FPS,

			loopRate: -1,
		}

		this.timer = new FunctionTimer(this, (q, p) => {
			switch (this.inGameParameters.mode) {
				case 3: {
					this.timerDisplay.display(q);
					////console.log(q);
					if (q <= 0) this.forEachPlayer(player => {
						player.block.insane.isCommandedEnd = true;
						player.blob.insane.isCommandedEnd = true;
					});

					if (q <= 10 * this.FPS && q >= 0) {
						if ((q % this.FPS) == 0 && q > 0) {
							if (q >= 4 * this.FPS) sound.play("timer2_1");
							else if (q <= 3 * this.FPS) sound.play("timer2_2");
						}
						if (q == 0) {
							sound.play("timer_zero");
						}
					}
					break;
				}
			}
		});

		this.timerDisplay = new class {
			constructor(w) {
				this.parent = w;
				this.timer = id("OVERLAY-TIMER-TEXT");
				this.container = id("OVERLAY-TIMER-DIV");
				this.isActive = false;
			}
			showHide(toggle) {
				this.isActive = toggle;
				styleelem(this.container, "display", this.isActive ? "flex" : "none")
			}

			display(frame) {
				let seconds = Math.ceil((frame / game.FPS));
				let minutes = ~~(seconds / 60);

				ihelem(this.timer, `${minutes}:${~~(seconds/10) % 6}${seconds%10}`);
			}

		}(this);

		this.timerDisplay.showHide(false);

		this.actualParameters = {
			mode: 0,
			active: 0,
			players: [],
			data: {

			},
			maxWins: 5
		};

		this.inGameParameters = {
			mode: null,
			active: 0,
			players: {},
			data: {},
			round: 0,
			maxWins: 5
		};

		this.round = 0;

		this.startGameParameters = {
			frame: -28,
			type: "",
		};

		this.enableWarning = false;


	}

	setupPlayers() {

	}

	createPlayerParam(name, char, ver, mode, isAi, params) {
		let a = {
			character: char,
			version: ver,
			name: name,
			isAi: isAi,
			mode: mode,
			other: params
		};
		return a;
	}

	setupAnimationElement(e, opacity, name, duration, timing) {
		styleelem(e, "opacity", opacity);
		styleelem(e, "animation-name", name);
		styleelem(e, "animation-duration", `${~~((1000 / 60) * (duration))}ms`);
		styleelem(e, "animation-timing-function", timing);
		styleelem(e, "animation-play-state", "paused");
	}

	resetReadyMatchSignal(state) {

		let element = "OVERLAY-MS-READY";
		let f = id(element);
		let l = id("OVERLAY-MS-START");
		for (let e of this.matchSignal.separator.ready.a) {
			styleelem(e, "animation", "none");
			e.offsetHeight;
		}

		styleelem(f, "animation", "none");

		f.offsetHeight;
		styleelem(f, "animation-play-state", "paused");

		styleelem(l, "animation", "none");

		l.offsetHeight;
		styleelem(l, "animation-play-state", "paused");

		if (state == 1) {
			/*styleelem(f, "opacity", "100%");
			styleelem(f, "animation-name", "matchSignal-body-anim-spacing");
			styleelem(f, "animation-duration", `${~~((1000 / 60) * (91))}ms`);
			styleelem(f, "animation-timing-function", "cubic-bezier(0,1,1,1)");*/
			this.setupAnimationElement(f, "100%", "matchsignal-body-anim-spacing", 90, "cubic-bezier(0,1,0,1)")
			for (let o = 0, q = this.matchSignal.separator.ready.a, e = q[o]; o < q.length; o++, e = q[o]) {
				if (o == 0) {
					this.setupAnimationElement(e, "100%", "matchsignal-let-anim-first", 150 - 30, "linear");
					styleelem(e, "font-family", "copd-bold");
				}
				else this.setupAnimationElement(e, "100%", "matchsignal-let-anim", 150 - 30, "linear");

			}
			this.setupAnimationElement(l, "0%", "matchsignal-body-anim-start", 50, "linear")


			this.matchSignal.main.reset(0);
		} else if (state == 2) {
			styleelem(f, "opacity", "0%");
			styleelem(l, "opacity", "0%");
			this.matchSignal.main.toggleEnable(false);
		} else if (state == 0) {
			this.matchSignal.main.toggleEnable(false);
			styleelem(f, "opacity", "0%");
			styleelem(l, "opacity", "0%");

		}
	}

	addDelayHandler(delay, func) {
		this.delayHandlers.push(new this.#DelayHandler(delay, func));
	}

	runDelayHandler() {
		let a = this.delayHandlers;
		let b = a.length;
		//let c = 0;

		for (let c = 0; c < b; c++) {
			a[c].delay--;
			if (a[c].delay == 0) {
				a[c].func();
				a.splice(c, 1);
				b--;
				c--;
				////console.log(JSON.stringify(a))
			}
		}

	}

	#fetchLoaded = {};

	#fetchLoad(directory, type) {
		return this.#fetchLoaded[directory];
	}

	initGame() {
		//await language.loadLanguage("assets/lang/en_us/main.json");

		splash.showHide(true);

		database.read("local_data", "userdata", async (ev) => {
			if (typeof ev !== "undefined") {
				//console.log(ev)
				menu.storage.loadUserData(ev.value);
				menu.storage.loadData(ev.value);
			}

			if (appinfo.android) {
				accessible.callSyncJava(k => {
					k.switchLanguage(menu.storage.getItem("lang", ""));
				});
				let h = await accessible.callAsyncJava("callback_promise", (l, k) => {
					k.getData(l, "user_data");
				});
				accessible.callSyncJava(k => {
					k.crash(h);
				});

			}

			this.loadAssets();





		});
	}

	endGame(isForce) {
		if (this.replay.isOn) {
			touchButtons.enableControllers(true);
		} else {
			this.replay.replays.push(JSON.stringify(this.replay.data));
			menu.replayDataString = this.replayDataToString();
		}
		this.isRunning = false;
		this.synchroLoop.confirmIsAsync = true;
		this.isRoundActive = false;
		this.matchEndHandler.hasEnded = true;
		if (isForce) {
			this.pause.on = true;
		}
		this.showEndGameMenu();
	}

	showEndGameMenu() {
		let selectors = [];

		if (!this.replay.isOn) {
			for (let lo of [{
						string: "gameend_startover",
						type: "button",
						action: "restart",
						onstate: "#ffff",
						offstate: "#fff2",
						desc: "gameend_startover_desc"
			},
					{
						string: "gameend_watchreplay",
						type: "button",
						action: "replayreload",
						onstate: "#ffff",
						offstate: "#fff2",
						desc: "gameend_watchreplay_desc"
			},
					{
						string: "gameend_replaycenter",
						type: "button",
						action: "replaycenter",
						onstate: "#ffff",
						offstate: "#fff2",
						backable: true,
						desc: "gameend_replaycenter_desc"
},

			]) selectors.push(lo);
			if (!this.replay.isFile) {
				selectors.push({
					string: "gameend_downloadreplay",
					type: "button",
					action: "replaydownload",
					onstate: "#ffff",
					offstate: "#fff2",
					desc: "gameend_downloadreplay_desc"
				});
			}
		} else {
			if (!this.replay.isFile) selectors.push({

				string: "gameend_startover",
				type: "button",
				action: "restart",
				onstate: "#ffff",
				offstate: "#fff2",
				desc: "gameend_startover_desc"

			});
			for (let lo of [
					{

						string: "gameend_replay_again",
						type: "button",
						action: "replayreload",
						onstate: "#ffff",
						offstate: "#fff2",
						desc: "gameend_replay_again_desc"

				},
					{
						string: "gameend_replaycenter",
						type: "button",
						action: "replaycenter",
						onstate: "#ffff",
						offstate: "#fff2",
						backable: true,
						desc: "gameend_replaycenter_desc"
			},

			]) selectors.push(lo);
			if (!this.replay.isFile) {
				selectors.push({
					string: "gameend_downloadreplay",
					type: "button",
					action: "replaydownload",
					onstate: "#ffff",
					offstate: "#fff2",
					desc: "gameend_dowmloadreplay_desc"
				});
			}
		}

		selectors.push({
			string: "gameend_mainmenu",
			type: "button",
			action: "mainmenu",
			onstate: "#ffff",
			offstate: "#fff2",

			desc: "gameend_mainmenu_desc"
		});

		let gson = {
			def: 0,
			sel: selectors,
			title: (this.replay.isOn ? "gameend_replay_title" : "gameend_title"),
			name: "main",
			"background": {
				"type": "rgba",
				"color": "#0004"
			}
		};
		menu.changeMenu(JSON.stringify(gson), false);
		menu.showMenu(true);

	}

	async loadAssets() {
		try {
			////console.log(this)
			menu.characterMenu.setupAnims();
			//IS_LOAD_LISTER = true;


			await language.load("en-US");

			let h = await load("./assets/init/init.json", "text");
			let hh = JSON.parse(h);
			let count = 0;
			let evt = (max, path) => {
				count++;
				let p = language.translate("loading_init", [path]);
				if (count == max) p = language.translate("loading_init_other");
				ih("SPLASH-TEXT-TEXT", `<gtris-plextext style="width:100%">${language.translate("loading_note")}<br />${p}</gtris-plextext><gtris-bar style="width: ${this.aspectResolution.w}px; background: #fff2; height: 1em; display: inline-block; bottom: 0"> <gtris-bar style="width: ${~~(this.aspectResolution.w * (count / max))}px; background: #fff; height: 1em; display: inline-block"> ${~~(100 * (count / max))}%</gtris-bar> </gtris-bar>`);
				this.checkGameLoad(count, max);
			};
			let files = Object.keys(hh);
			let fmax = files.length;
			////console.log(fmax)
			for (let ge = 0; ge < fmax; ge++) {
				let g = hh[files[ge]];
				//console.log(g)
				if (g.type == "image") {
					loadImage(g.path).then(img => {
						this.#fetchLoaded[g.path] = img;
						evt(fmax, g.path);
					});

				} else {
					load(g.path, g.type).then(o => {
						this.#fetchLoaded[g.path] = o;
						evt(fmax, g.path);
					});

				}
				////console.log((100 * (count / hh.length)).toFixed(2));

			}
		} catch (e) {
			//console.log(e.stack)
		}
	}

	async checkGameLoad(count, max) {
		if (count >= max) {

			menu.presetSettings = JSON.parse(this.#fetchLoad("./assets/settings/settings.json"));
			alert(this.#fetchLoad("./assets/settings/settings.json"))
			menu.checkStorageSettings();
			menu.checkData();

			this.assetHTML = this.#fetchLoad("./assets/field/main2.xml", "text");
			this.assetStyle = this.#fetchLoad("./assets/field/main2.css", "text");
			let bpres = this.#fetchLoad("./assets/field/blobs_preset.json", "text");
			let mbpres = this.#fetchLoad("./assets/field/microblob_preset.json", "text");
			let gpres = this.#fetchLoad("./assets/field/blocks_preset.json", "text");
			let jpres = this.#fetchLoad("./assets/field/blocks_preset_javascriptus.json", "text");

			this.presets.blobNormal = JSON.parse(bpres);
			this.presets.blobMicro = JSON.parse(mbpres);
			this.presets.blockNormal = JSON.parse(gpres);
			this.presets.blockJavaScriptus = JSON.parse(jpres);
			////console.log(this.presets.blobNormal)
			this.misc.ai = this.#fetchLoad("./assets/ai_script/ai_sapphirus_core.js", "text");
			this.misc.ai_original = this.#fetchLoad("./assets/ai_script/ai_neoplex.js", "text");
			this.misc.ai_blob_original = this.#fetchLoad("./assets/ai_script/ai_neoplex_blob_core.js", "text");
			this.misc.ai_blob_functions = this.#fetchLoad("./assets/ai_script/ai_neoplex_blob_funcs.js", "text");
			this.misc.ai_blob_sapphirus = this.#fetchLoad("./assets/ai_script/ai_sapphirus_blob.js", "text");
			this.misc.blob_target = this.#fetchLoad("./assets/field/blob_target.png", "image");
			let tspinImg = this.#fetchLoad("./assets/field/tspin.png");
			////console.log("tspin load")
			let tspinminiImg = this.#fetchLoad("./assets/field/mini.png");
			let henshinImg = this.#fetchLoad("./assets/field/henshin.png");
			let insaneEyeImg = this.#fetchLoad("./assets/field/insane_eye.png");
			let feverImg = this.#fetchLoad("./assets/field/fever.png");
			let frenzyImg = this.#fetchLoad("./assets/field/frenzy.png");
			let wormholeImg = this.#fetchLoad("./assets/field/wormhole.png");


			this.misc.menu_cs_border_black = this.#fetchLoad("./assets/menu/images/cs_border_black.png");
			this.misc.menu_cs_border_yellow = this.#fetchLoad("./assets/menu/images/cs_border_yellow.png");
			this.misc.menu_cs_border_green = this.#fetchLoad("./assets/menu/images/cs_border_green.png");

			this.misc.menu_cs_mode_pick = this.#fetchLoad("./assets/menu/images/cs_mode_pick.png");
			this.misc.menu_switch_on = this.#fetchLoad("./assets/menu/images/switch_on.png");
			this.misc.menu_switch_off = this.#fetchLoad("./assets/menu/images/switch_off.png");

			let image = this.#fetchLoad("./assets/skins/default/block.png");
			this.skinTemp.ctx.drawImage(image, 0, 0, 130 * 4, 130 * 12, 0, 0, 130 * 4, 130 * 12);

			let imageBlob = this.#fetchLoad("./assets/skins/default/blob.png");
			this.skinBlobTemp.ctx.drawImage(imageBlob, 0, 0, 250 * 16, 250 * 16, 0, 0, 250 * 16, 250 * 16);

			let imageGarb = this.#fetchLoad("./assets/skins/default/garbage_block.png");
			this.skinGarbTemp.ctx.drawImage(imageGarb, 0, 0, 1600, 200, 0, 0, 1600, 200);

			this.skinGarbTemp.ctx.drawImage(this.#fetchLoad("./assets/skins/default/garbage_blob.png"), 0, 0, 1600, 200, 0, 200, 1600, 200);


			let imageParticle = this.#fetchLoad("./assets/skins/default/particle.png");
			//console.log(imageParticle.width, imageParticle.height)
			particle.addImage("attack", imageParticle, 100, 100);
			//this.skinParticleTemp.ctx.drawImage(imageParticle, 0, 0, 1100, 100, 0, 0, 1100, 100);

			let imageAppear = this.#fetchLoad("./assets/field/appear_block.png");
			this.skinAppear.ctx.drawImage(imageAppear, 0, 0, 70 * 10, 70 * 4, 0, 0, 70 * 10, 70 * 4);

			let imageClear = this.#fetchLoad("./assets/field/clear_block.png");
			this.skinClear.ctx.drawImage(imageClear, 0, 0, 70 * 10, 70 * 6, 0, 0, 70 * 10, 70 * 6);

			elem("CANVAS", n => {
				let particleBlobCtx = getCanvasCtx(n);
				n.width = 100 * 11;
				n.height = 100 * 2;

				for (let y = 0; y < 5; y++) {
					particleBlobCtx.drawImage(
						imageBlob,
						0, 250 * y, 250, 250, 100 * y, 0, 100, 100
					);
				}

				for (let y = 0; y < 11; y++) {
					particleBlobCtx.drawImage(
						image,
						0, 130 * (y), 130, 130, 100 * y, 100, 100, 100
					);
				}
				// TODO lol
				particleBlobCtx.drawImage(
					imageBlob,
					0, 250 * 5, 250, 250, 100 * 5, 0, 100, 100
				);

				particle.addImage("blobblock", n, 100, 100);

			});



			this.henshinBg = henshinImg; //.ctx.drawImage(henshinImg, 0, 0, 1800, 2160, 0, 0, 1800, 2160);
			////console.log(this.assetHTML)
			this.feverBg = feverImg;

			this.frenzyBg = frenzyImg;
			this.wormholeBg = wormholeImg;

			this.misc.tspin = tspinImg;
			this.misc.tspinmini = tspinminiImg;

			this.misc.menu_cs_border_black = this.#fetchLoad("./assets/menu/images/cs_border_black.png");


			//this.insaneEye.ctx.drawImage(insaneEyeImg, 0, 0, 200, 200);

			loadingScreen.images.gate1 = this.#fetchLoad("./assets/menu/loading/images/gate1.png");
			loadingScreen.images.gate2 = this.#fetchLoad("./assets/menu/loading/images/gate2.png");

			language.loadImgsByJson(this.#fetchLoad("./assets/init/lang_images.json"));
			
			let faviconURL = URL.createObjectURL(this.#fetchLoad("./assets/favicon/favicon.png"));
			elem("LINK", (ma) => {
				ma.setAttribute("rel", "icon");
				ma.setAttribute("href", faviconURL);
				document.head.append(ma);
			})


			//language.loadCharLanguage(this.#fetchLoad("./assets/lang/en_us/characters.json"));
			//IS_LOAD_LISTER = true;

			////console.log(JSON.stringify(loadLister));

			let mmm = [

				{
					dir: this.#fetchLoad("./assets/field/blob_hit.png"),
					name: "blob_hit"
   },
				{
					dir: this.#fetchLoad("./assets/field/block_hit.png"),
					name: "block_hit"
   },
				{

					dir: this.#fetchLoad("./assets/field/wormhole_explosion.png"),
					name: "wormhole_explosion"

   },
				{

					dir: this.#fetchLoad("./assets/field/wormhole.png"),
					name: "wormhole"

   },
				{

					dir: this.#fetchLoad("./assets/field/fever_shine.png"),
					name: "fever_shine"

   },
				{

					dir: this.#fetchLoad("./assets/field/swap_roulette.png"),
					name: "swap_roulette"

   },
				{

					dir: this.#fetchLoad("./assets/field/perfect_clear.png"),
					name: "perfect_clear"

   }


  ];
			for (let ll = 0; ll < 5; ll++) {
				mmm.push({


					dir: this.#fetchLoad(`./assets/skins/default/blob_pop${ll + 1}.png`),
					name: `blob_pop${ll + 1}`


				})
			}
			animatedLayers.loadOfflineArr(mmm);


			await feverGaugeStorage.load("./assets/field/fever_gauge.png", "./assets/field/fever_timer.png");
			//IS_LOAD_LISTER = false;
			////console.log(JSON.stringify(loadLister))
			await background.loadBg();

			game1v1.loadAImgOffline([
				{
					name: "overhead_center",
					image: this.#fetchLoad("./assets/field/overhead_1v1_center.png"),
					w: 27,
					h: 200,
					frame: 120,
					bound: 30
				}
			]);


			await menu.load();
			menu.characterMenu.loadImages();

			splash.splashImage = this.#fetchLoad("./assets/splash/controls.png");

			this.resize();

			menu.characterMenu.setupPanelIntListener();

			menu.showMenu(true);
			//this.initialize(3);
			this.synchroLoop.confirmIsAsync = true;


			splash.toggleRunner(true);



		}
	}

	startReplay(isFile) {
		this.replay.isFile = isFile;
		this.startGameSet("replay");
	}

	downloadReplayData() {
		let data = btoa(this.replayDataToString());
		//console.log(data);

	}

	parseReplayFile(jsonString, index, round, isFile) {
		//let jsonString = atob(b64String);
		try {

			let json = JSON.parse(jsonString);
			//this.replay.isFile = false;
			this.replay.replays.length = 0;
			if ("replays" in json) {
				for (let h = index; h < json.replays.length && h < round; h++) {
					this.replay.replays.push((json.replays[h]));
				}
			} else {

			}

			this.startReplay(isFile);

		} catch (e) {
			//console.log(e.message)
		}
	}

	setActualParameters() {
		let a = menu.storage;
		let b = {};
		switch (this.actualParameters.mode) {
			case 0: {
				b.insaneStart = a.getValueFromRangeListSpecific("set_prep_insane_start");
				break;
			}
			case 1: {
				this.actualParameters.maxWins = a.getItem("set_prep_wins(vs)");
				break;
			}
			case 2: {
				this.actualParameters.maxWins = a.getItem("set_prep_wins(swap)");
				break;
			}
			case 3: {
				this.actualParameters.maxWins = a.getItem("set_prep_wins(wmw)");
				break;
			}
			case 4: {
				this.actualParameters.maxWins = a.getItem("set_prep_wins(fever)");
				break;
			}
			case 5: {
				this.actualParameters.maxWins = a.getItem("set_prep_wins(vs)");
				break;
			}


		}
		this.actualParameters.data = b;
	}

	setModeParameters(mode) {

		sound.stop("wormhole_loop");
		sound.stop("wormhole_ready");
		this.woiMode.timeDelay = -9;
		this.timer.enabled = 0;
		this.timer.set(-9);
		this.timer.setMax(10 * game.FPS);
		this.timerDisplay.showHide(false);
		this.isRoundActive = false;
		this.isProfessional = false;
		this.misc.zenkeshi = language.getImage("images/zenkeshi.png");

		this.targetPointSystem.prep.initial = 70;
		this.targetPointSystem.prep.marginTime = 96 * 60;
		////console.log(this.misc.zenkeshi)
		////console.log(mode);
		let blobColors = [1, 2, 3, 4, 5];
		let defaultBlobColors = [1, 2, 3, 4, 5];
		sortRandomInt(blobColors, () => this.seeds.main.next());
		this.forEachPlayer(player => {
			//player.blob.insane.delay.ready = player.block.insane.delay.ready = 6;
			player.initialGarbage = 0;

			if (!(player.player in this.inGameParameters.players)) this.inGameParameters.players[player.player] = {};
			this.inGameParameters.players[player.player].wins = this.replay.data.players[player.player].wins;

			let blub = player.blob;
			let block = player.block;

			block.piece.is180able = false

			player.blob.colorSet = blobColors;

			block.insane.isCommandedEnd = false;
			blub.insane.isCommandedEnd = false;

			blub.garbageOrder.on = false;

			blub.isChainOffsetting = false;
			player.blob.insane.isUnlimited = player.block.insane.isUnlimited = 0;
			player.feverStat.isUseTimer = false;

			blub.insane.timeAdditions.timeAddMult = block.insane.timeAdditions.timeAddMult = 0;
			blub.insane.timeAdditions.fixedTimeAdd = block.insane.timeAdditions.fixedTimeAdd = 0;
			blub.insane.timeAdditions.allClear = block.insane.timeAdditions.allClear = 0;
			player.controlsBitwise.on = true;
			
			blub.insane.initialStart = false;
			block.insane.initialStart = false;
			
			blub.insane.initialStartHenshin = false;
			block.insane.initialStartHenshin = false;
			block.isAllSpin = false;
		});
		switch (mode) {
			case 0: {
				this.isSolo = true;
				let p = this.getRDDataKey("insaneStart").split("-");
				this.forEachPlayer(player => {
					let isInsane = false;
					if (~~p[0] > 0) {
						player.block.insane.initialStart = player.activeType == 0;
						player.blob.insane.initialStart = player.activeType == 1;
						player.block.insane.initialStartHenshin = player.activeType == 0;
						player.blob.insane.initialStartHenshin = player.activeType == 1;
					}
					player.blob.insane.delay.readyHenshin = (player.activeType == 1 && p[0] == 3) ? 6 : -9;
					player.block.insane.delay.ready = (player.activeType == 0 && p[0] == 1) ? 6 : -9;
					player.blob.insane.delay.ready = (player.activeType == 1 && p[0] == 2) ? 6 : -9;;
					player.blob.insane.timeAdditions.timeAddMult = 1.5;
					//player.blob.settings.gravity = 0;
					//	player.block.insane.delay.ready = 10;
					player.blob.insane.fixedHenshinType = player.activeType == 1 ? ~~p[1] : 0;
					//player.blob.isSpecialDropset = true;

				});
				break;
			}
			//VERSUS
			case 1: {
				/*this.targetPointSystem.prep.initial = 120;
				this.targetPointSystem.prep.marginTime = 192 * 60;
				this.forEachPlayer(player => {

						//player.blob.insane.delay.readyHenshin = 2;
					// player.initialGarbage = 1 * 200;
					if (player.player > 0) {
						let blob= player.blob;
						blob.isFever = true;
					blob.isSpecialDropset = true;
					player.garbageBlocking = "full";
					player.feverStat.enable(true);
					player.blob.insane.isUnlimited = player.block.insane.isUnlimited = false;
					blob.dropsetReset(player.character.blob.dropset);
					player.feverStat.isUseTimer = true;
					
					blob.insane.timeAdditions.timeAddMult = 1;
					blob.insane.timeAdditions.fixedTimeAdd = 0;
					blob.insane.timeAdditions.allClear = 5;
					blob.insane.timeMax = 99;
					
					blob.garbageOrder.on = true;

player.blob.insane.isExtra = true;
blob.colorSet = defaultBlobColors;
					} else player.blob.fixedAtkHandicap = (120 / 70)

				});*/

				this.forEachPlayer(player => {
					if (player.activeType == 1) {
						//player.blob.insane.delay.readyHenshin = 3
					}
				});
				break;
			}
			//SWAP
			case 2: {
				this.swapMode.on = true;
				this.forEachPlayer(player => {
					player.blob.insane.delay.ready = player.block.insane.delay.ready = 0;
					player.switchModeType(0);
					player.swapMode.isOn = true;
					player.enableAuxField(true);
					player.block.meteredGarbageWaitMode = false;
					player.block.attackType = "scorebasedSwap";
					player.garbageBlocking = "full";
					player.initialGarbage = 0;
					///player.refreshBorderField(0);
					player.setStyle("HOLD", "display", player.activeType == 0 ? "block" : "none");
					player.adjustBlobBlockBG(0);
					player.block.garbageLimit = 8;
					player.blob.isChainOffsetting = true;
				});
				this.swapMode.decidedBlockOrBlob = ~~(this.seeds.main.next() * 2);
				this.swapMode.blockOrBlob = this.swapMode.decidedBlockOrBlob;

				this.swapMode.pickDel = 220;

				this.timerDisplay.showHide(true);


				break;
			}
			//WAR OF INSANITY
			case 3: {
				this.woiMode.on = true;
				this.woiMode.timeDelay = 1.5 * this.FPS;
				this.timer.enabled = 1;
				this.timer.set(80 * this.FPS);
				this.timer.setMax(80 * this.FPS);
				this.forEachPlayer(player => {
					player.blob.insane.delay.ready = player.block.insane.delay.ready = 3;
					player.blob.insane.isUnlimited = player.block.insane.isUnlimited = true;
					player.block.insane.initialStart = player.activeType == 0;
					player.blob.insane.initialStart = player.activeType == 1;
					//     player.blob.insane.isUnlimited = 0
					player.blob.insane.maxTime = player.block.insane.maxTime = this.woiMode.maxTime = 80 * 60;
					player.blob.colors = 4;
					player.isGarbageCollectionMode = true;
					player.blob.insane.isExtra = false;
					player.woi.isOn = true;
					player.isInsaneModeOnly = true;
					player.rpgAttr.openClose(true);
					player.rpgAttr.setMaxHP(1000);
					player.rpgAttr.reset();
					player.rpgAttr.isWOIHPMode = true;
					player.block.attackType = "scorebased";
					//player.feverStat.isUseTimer = true;
				});
				this.timerDisplay.showHide(true);
				
				break;
			}

			case 4: {
				this.targetPointSystem.prep.initial = 120;
				this.targetPointSystem.prep.marginTime = 192 * 60;

				this.forEachPlayer(player => {
					player.switchModeType(1);

					let blob = player.blob;
					blob.isFever = true;
					blob.isSpecialDropset = true;
					player.garbageBlocking = "full";
					player.feverStat.enable(true);
					player.blob.insane.isUnlimited = player.block.insane.isUnlimited = false;
					blob.dropsetReset(player.character.blob.dropset);

					blob.insane.timeAdditions.timeAddMult = 1;
					blob.insane.timeAdditions.fixedTimeAdd = 0.0;
					blob.insane.timeAdditions.allClear = 5;
					blob.insane.timeMax = 99;

					player.feverStat.isUseTimer = true;

					/*player.rpgAttr.openClose(true);
					player.rpgAttr.setMaxHP(1000000);
					player.rpgAttr.reset();/**/

					blob.garbageOrder.on = true;

					player.blob.insane.isExtra = true;
					blob.colorSet = defaultBlobColors;



				});
				break;
			}

			case 5: {
				this.isProfessional = true;
				this.forEachPlayer(player => {
					player.block.isProfessional = true;
					player.block.isAllSpin = true;
					player.block.piece.is180able = true;
				});

				this.forEachPlayer(player => {
					if (player.activeType == 1) {
						//player.blob.insane.delay.readyHenshin = 3
					}
				});
				break;
			}

			//PARTY

			//RPG ATTRIBUTES 
		}
	}

	setRDDataKey(key, value) {
		this.replay.data.data[key] = value;
	}
	getRDDataKey(key, value) {
		return this.replay.data.data[key];
	}

	startGameSet(m) {
		this.startGameParameters.frame = 43;
		loadingScreen.toggleOn();
		loadingScreen.isOpenable = false;
		this.startGameParameters.type = m;
	}

	initialize(mode, replay, parameters, isNext) {
		if (replay) {
			this.replay.isOn = true;
			this.replay.replaysIndex = 0;
			//this.replay.replays.push(JSON.stringify(this.replay.data));

			this.parseReplayData(this.replay.replays[this.replay.replaysIndex]);
			//console.log(this.replay.data);
		} else {
			this.replay.isOn = false;
			this.replay.isFile = false;
			let _mode = mode;
			if (mode === "actualparameter") {
				_mode = this.actualParameters.mode;
			}

			this.replay.replays.length = 0;

			//this.round = 0;

			this.setActualParameters();
			this.createReplayData(true, _mode, 0);

		}

		this.matchEndHandler.endable = false;
		this.matchEndHandler.frame = -9;
		this.matchEndHandler.on = false;
		this.matchEndHandler.isFinishActual = false;
		this.matchEndHandler.hasEnded = false;

		this.replay.replaysIndex = 0;

		//music.stopAll();


		sound.load("default");

		this.enableWarning = menu.storage.getItem("set_session_fieldwarning", 0);


		////console.log(this.woiMode.on, "ON OR OFF")
		
		if (!isNext) music.resetAllSeek();
		this.prepareInRoundAssets();
		this.unpauseGame();
	}

	initializeNext(replay) {
		if (replay) {
			if (this.replay.replays.length > this.replay.replaysIndex) {
				this.replay.replaysIndex++;
				this.parseReplayData(this.replay.replays[this.replay.replaysIndex]);
				this.prepareInRoundAssets();
			} else {

			}

		} else {
			this.inGameParameters.round++;
			this.replay.replays.push(JSON.stringify(this.replay.data));
			this.createReplayData(false, this.inGameParameters.mode, this.inGameParameters.round);
			this.prepareInRoundAssets();
		}
	}
	createRandomSeed() {
		return ~~(Math.random() * 2147483647);
	}

	createReplayData(reset, _mode, round) {
		if (reset) {
			this.inGameParameters.round = 0;
		}
		let m = _mode !== void 0 ? _mode : this.inGameParameters.mode;
		let title = "NO TITLE";
		title = `Round ${this.inGameParameters.round + 1}`;
		this.replay.data = {
			players: {},
			data: {
				mode: m,
				seed: this.createRandomSeed(),
				round: this.inGameParameters.round,
				maxWins: this.actualParameters.maxWins,
				title: title
			},

		};

		for (let h in this.actualParameters.data) {
			this.replay.data.data[h] = this.actualParameters.data[h];

		}

		for (let i = 0; i < this.actualParameters.players.length; i++) {
			if (reset) {
				this.inGameParameters.players[i] = {
					wins: 0
				}
			}
			this.replay.data.players[i] = {
				keyData: {},
				seed: this.createRandomSeed(),
				name: this.actualParameters.players[i].name || "No Name",
				character: this.actualParameters.players[i].character,
				version: this.actualParameters.players[i].version,
				mode: this.actualParameters.players[i].mode,
				wins: this.inGameParameters.players[i].wins,
				color: ["55BBFF", "FF5555"][i]
			};
		}
	}

	parseReplayData(replayData) {
		let json = JSON.parse(replayData);
		{
			this.replay.data = json;
			//this.prepareInRoundAssets();
			//console.log(json)
		}
		//this.initialize(void 0, true);
	}
	
	loadMusic() {
		let lm = ([{
				name: "insane",
				path: "insane2",
				continuable: this.woiMode.on
		},
			{
				name: "insane_transform",
				path: "insane_transform",
				continuable: false
		},
			{
				name: "game_match",
				path: menu.storage.getValueFromRangeListSpecific("set_global_musicbank"),
				continuable: true
		},

		]);
		if (this.woiMode.on) {
			lm.push({
				name: "wmw_eval",
				path: "wmw_eval",
				continuable: false
		})
		}
		if (this.enableWarning) {
			lm.push({
				name: "warning",
				path: "warning",
				continuable: false
			});
		}
		music.load(lm);
	}
	prepareInRoundAssets() {
		this.isRunning = false;
		game1v1.overhead.openClose(5);
		this.forEachPlayer(player => {
			player.resetEmAnimation();
		})

		let isChange = this.createPlayer(Object.keys(this.replay.data.players).length);

		this.pause.frame = -9;
		this.pause.on = false;

		touchButtons.enableControllers(!this.replay.isOn);

		game1v1.on = Object.keys(this.players).length == 2;


		menu.showMenu(false);

		this.inGameParameters.mode = this.replay.data.data.mode;

		this.inGameParameters.round = this.replay.data.round;

		this.isFreezeHandlers = false;

		let isChangeChars = {};

		this.forEachPlayer(async player => {
			//let char = ["epicman", /*"epicman", /**/ "elisha", "flotalendy", "elisha", "dylan_huff"][(player.player + 0 /*=== 2 ? 1 : 0/**/ ) % 52];
			////console.log(`/assets/characters/${char}`);
			let c = gtcharacter.characters[this.replay.data.players[player.player].character],
				v = c.versions[this.replay.data.players[player.player].version];
			let char = `${c.core.path}/${v.path}`;



			////console.log(this.replay.data.players[player.player].mode)
			//if (player.player === 0) player.switchModeType(0b0);
			player.team = ~~(player.player == 2 && this.playerCount > 2 ? 1 : Math.random() * 21583328828283882);


			let change = player.loadCharacter(c.core.path, v.path);

			if (change) {
				isChangeChars[`${player.character.char}/${player.character.ver}`] = 1;
			}
			if (isChange) await player.clearText.tspin.loadImages([this.misc.tspin, this.misc.tspinmini]);
			player.changeBodyColorHex(`0x${this.replay.data.players[player.player].color}`);
		});

		if (Object.keys(isChangeChars).length) {
			//let chars = [];
			playerVoiceSystem.unloadAll(isChangeChars);
		}


		let seed = this.replay.data.data.seed;

		this.isFinish = false;

		this.swapMode.on = false;
		this.swapMode.swapDel = -8;
		this.swapMode.blockOrBlob = 0;
		this.swapMode.decidedBlockOrBlob = 0;
		this.woiMode.isEvaluation = false;
		this.woiMode.time = -19;
		this.woiMode.restart = -19;
		//this.woiMode.on = true;
		this.swapMode.time = 30 * this.FPS;
		this.frames = 0;
		this.delayHandlers.length = 0;
		this.isSolo = false;


		this.pause.on = false;

		this.woiMode.loopRate = -1;

		this.isRoundNext = false;
		this.roundNextTime = -20;

		this.countdown = 210 - 30;
		this.waitCountdown = 50;
		
		


		this.matchSignal.separator.ready.setSeparatedText(id("OVERLAY-MS-READY"), "Ready?");

		this.seeds.preview.seed = seed;
		this.seeds.main.seed = seed;

		//this.matchSignal.separator.start.setSeparatedText(id("OVERLAY-MS-START"), "Start");
		ihelem(id("OVERLAY-MS-START"), `START`);

		this.resetReadyMatchSignal(0);

		let blobVsBlock = {};
		let isTwo = 0;
		this.forEachPlayer(player => {
			let jm = this.replay.data.players[player.player];
			player.wins = jm.wins;
			player.blob.dropsetReset([]);
			player.switchModeType(Math.min(1, this.replay.data.players[player.player].mode));
			player.swapMode.isOn = false;
			player.block.dasCancellation.on = true;
			player.block.rngPreview.seed = jm.seed;
			player.seeds.field.seed = jm.seed;
			player.block.insane.rng.seed = jm.seed;
			player.blob.insane.rng.seed = jm.seed;
			player.blob.rngPreview.seed = seed;
			player.block.attackType = "normal";
			player.blob.isSpecialDropset = false;
			player.feverStat.enable(false);
			/**/
			player.ai.active = this.activePlayer !== player.player;
			if (!(player.activeType in blobVsBlock)) blobVsBlock[player.activeType] = 1;
			player.setStyle("HOLD", "display", player.activeType == 0 ? "block" : "none");
			player.enableAuxField(false);
			player.rpgAttr.openClose(false);
			player.setPlayerName(jm.name);
			player.block.isDelayEnabled = false;
			player.blob.isDelayEnabled = false;
			player.blob.targetPoint = this.targetPointSystem.initial;
			player.isGarbageCollectionMode = false;
			player.isInsaneModeOnly = false;
			player.woi.isOn = false;
			player.block.garbageLimit = 0;
			player.blob.isFever = false;
			player.woi.reset();



		});

		this.inGameParameters.maxWins = this.replay.data.data.maxWins;

		if (1 in blobVsBlock && 0 in blobVsBlock) isTwo = 1;
		////console.log(blobVsBlock)



		animatedLayers.remove("swap_roulette_object");

		this.forEachPlayer(player => {
			player.meterBar.garbwait.toggle(false);
			player.meterBar.right.toggle(false);
			player.block.isProfessional = false;
			player.block.meteredGarbageWaitMode = false;
			player.garbageBlocking = "limited";


		});



		this.setModeParameters(this.inGameParameters.mode);
		
		this.loadMusic();

		//this.resetPlayers();
		this.targetPointSystem.marginTime = this.targetPointSystem.prep.marginTime;;

		this.targetPointSystem.iterIncDel = 16 * this.FPS;

		this.targetPointSystem.initial = this.targetPointSystem.prep.initial;
		this.targetPointSystem.targetPoint = this.targetPointSystem.initial;
		this.targetPointSystem.previous = this.targetPointSystem.initial;

		this.forEachPlayer(player => {
			player.block.isAux = false;
			player.blob.isAux = false;
			player.garbageType = player.activeType;

			if (isTwo) {
				if (player.activeType === 0) {
					player.meterBar.garbwait.toggle(true);
					player.garbageType = 1;
				} else {
					player.garbageType = 0;
				}
				player.block.isProfessional = false;
				player.block.meteredGarbageWaitMode = true;
				player.block.attackType = "scorebased";
				player.block.garbageLimit = 8;
			}

			if (player.block.isProfessional) {
				player.controlsBitwise.on = false;
				player.block.attackType = "multiplier";
				player.garbageBlocking = "full";
			}
		});
		
		music.volumeSet(menu.storage.getItem("set_global_mfx", 0));

		game1v1.winstat.openClose(game1v1.on);

		if (game1v1.on) {
			game1v1.winstat.setMaxWins(this.inGameParameters.maxWins);
		}


		this.startLoadLoop();

	}

	resetPlayers() {
		this.forEachPlayer(player => {
			/*if (player.player == 0)/**/ //player.blob.insane.delay.ready = 3;
			let tempBlock = player.block.insane.delay.ready;
			let tempBlob = player.blob.insane.delay.ready;
			let tempHenBlock = player.block.insane.delay.readyHenshin;
			let tempHenBlob = player.blob.insane.delay.readyHenshin;
			
			if (!player.block.insane.initialStart) tempBlock = -99;
				
				if (!player.block.insane.initialStartHenshin) tempHenBlock = -99;
			if (!player.blob.insane.initialStart) tempBlob = -99;
			if (!player.blob.insane.initialStartHenshin) tempBlob = -99;
			/*for (let b = 0; b < 16; b++) {
				player.blob.piece.dropset[b] = player.character.blob.dropset[b];
			}*/

			player.blob.dropsetReset(player.character.blob.dropset);
			player.reset();

			player.block.insane.delay.ready = tempBlock;
			player.blob.insane.delay.ready = tempBlob;
			player.block.insane.delay.readyHenshin = tempHenBlock;
			player.blob.insane.delay.readyHenshin = tempHenBlob;

			player.addGarbage("system", [player.initialGarbage]);
			// player.block.insane.delay.ready = tempBlock;
			/*if (player.player == 1) /**/ //player.blob.insane.delay.ready = tempBlob;
			/*else /**/ //player.blob.insane.delay.readyHenshin = tempBlob;
			player.garbageLastForTray.assign(player.garbageLength);
		});
	}
	resetCountdown() {
		this.resetReadyMatchSignal(0);
		this.countdown = 210 - 30;
		this.waitCountdown = 40;
	}

	startLoadLoop() {
		if (this.isGameLoaded) this.loadLoop();
	}

	loadLoop() {
		let loaded = true;
		let jsonLoaded = true;

		if (!sound.isReady || !music.isReady) loaded = false;
		this.forEachPlayer(player => {
			if (!player.character.load) loaded = false;
			if (!player.character.loadedJson) {
				loaded = false;
				jsonLoaded = false;
			}
		});

		if (loaded) {
			if (!this.isGameLoaded) {
				this.synchroLoop.confirmIsAsync = false;
				//styleelem(this.loadDiv.main, "display", "none");
				//this.resize();

			}
			this.isGameLoaded = true;
			loadingScreen.isOpenable = true;

			this.resize();
			this.resetPlayers();

			if (game1v1.on) {
				this.forEachPlayer(player => {

					if (player.player == 0) {
						game1v1.winstat.loadPlayer("left", {
							red: player.color.r,
							green: player.color.g,
							blue: player.color.b
						});
						game1v1.winstat.setWins("left", player.wins);
					}
					if (player.player == 1) {
						game1v1.winstat.loadPlayer("right", {
							red: player.color.r,
							green: player.color.g,
							blue: player.color.b
						});
						game1v1.winstat.setWins("right", player.wins);
					}
				});
			}

			this.forEachPlayer(player => {
				player.block.drawStack();
				player.block.drawActivePiece();
				//player.block.previewInitialize();
				player.blob.targetPoint = this.targetPointSystem.initial;
				player.block.holdDraw();
			});

			//music.volume(1);
		} else {
			let l = "";
			Object.keys(this.players).forEach((a) => {
				l += `${a}: ${this.players[a].character.loadedJson}, `

			})
			//console.log(`${sound.isReady}, ${music.isReady}, players: ${l}`);
			if (this.isGameLoaded) {

				this.resize();
			}
			loadingScreen.isOpenable = false;
			this.isGameLoaded = false;
			if (jsonLoaded !== this.isPlayerJsonLoaded) {
				this.isPlayerJsonLoaded = jsonLoaded;
				if (jsonLoaded) {
					this.loadPlayerAssets();
				}
			}
			window.requestAnimationFrame(() => {
				this.loadLoop();
			})
		}
	}

	loadPlayerAssets() {
		let storage = {};
		let is1v1 = game1v1.on;

		////console.log("load player assets")

		let overheadSrcs = {};
		this.forEachPlayer((player) => {
			player.loadAssets();
			//alert("load")

			let json = player.character.json;

			let imageURLs = json.sources.image;

			let mainDir = `/assets/characters/${player.character.char}/${player.character.ver}`;


			//let i = player.character.json;

			for (let file in imageURLs) {
				let ref = `${mainDir}/${imageURLs[file]}`;
				storage[`${player.character.char}/${player.character.ver}/${file}`] = ref;
			}

		});

		this.forEachPlayer(player => {
			let i = player.character.json;

			let a = `${player.character.char}/${player.character.ver}`
			if ("ca_overhead" in i.init) {
				let h = i.init.ca_overhead;
				let sh = i.sources.image[h.image];
				if ("image" in h) {
					overheadSrcs[a] = storage[`${a}/${h.image}`];
				}
			}
		});

		if (is1v1) {
			let left = this.players[0];
			let right = this.players[1];

			let ma = `${left.character.char}/${left.character.ver}`
			let mb = `${right.character.char}/${right.character.ver}`
			let n = [];

			for (let j in overheadSrcs) {
				n.push({
					name: j,
					dir: overheadSrcs[j]
				});
			}

			game1v1.overhead.loadImg(n);

			game1v1.overhead.loadPlayer("left", {
				image: ma,
				red: left.color.r,
				green: left.color.g,
				blue: left.color.b
			});
			game1v1.overhead.loadPlayer("right", {

				image: mb,
				red: right.color.r,
				green: right.color.g,
				blue: right.color.b

			});
		}
		////console.log(overheadSrcs)




	}

	resize() {
		this.resolution.w = window.innerWidth;
		this.resolution.h = window.innerHeight;

		style("CORE", "width", `${this.resolution.w}px`);
		style("CORE", "height", `${this.resolution.h}px`);

		let screenWidth = this.resolution.w,
			screenHeight = this.resolution.h;
		let ratioWidth = screenWidth,
			ratioHeight = screenHeight;
		let aspectRatio = this.aspectRatio;
		this.landscape.x = this.portrait.x = screenWidth;
		this.landscape.y = this.portrait.y = screenHeight;
		if (screenWidth <= screenHeight) {
			this.orientation = "portrait";
			ratioHeight = (Math.round(Math.min(screenWidth * aspectRatio, screenHeight)));
			if (screenWidth * aspectRatio >= screenHeight) {
				ratioWidth = screenWidth - (((screenWidth * aspectRatio) - screenHeight) / 2);
				//interfaceSound.playSound("error")
			}
			this.portrait.y = ratioHeight;
			this.portrait.x = ratioWidth;
			this.landscape.x = ratioWidth;
			this.landscape.y = Math.round(ratioWidth / aspectRatio);
		} else {
			this.orientation = "landscape";
			ratioWidth = (Math.round(screenHeight * aspectRatio));
			this.landscape.y = ratioHeight;
			this.landscape.x = ratioWidth;
			this.portrait.x = ratioHeight
			this.portrait.y = Math.round(ratioHeight / aspectRatio);
		}
		let aspectRatioResolution = Math.max(ratioWidth, ratioHeight);
		let uhd = 0.8;
		this.cellSize = Math.round(aspectRatioResolution / 50);
		if (this.orientation == "landscape") {
			this.playerAreaSizeMult = uhd; //0.56;
			this.aspectResolution.w = this.landscape.x;
			this.aspectResolution.h = this.landscape.y;
		}

		if (this.orientation == "portrait") {
			this.playerAreaSizeMult = (1 / this.aspectRatio) * uhd; //0.56;
			this.aspectResolution.w = this.portrait.x;
			this.aspectResolution.h = this.portrait.y;
		}
		document.body.style["font-size"] = this.cellSize + "px";
		for (let m of ["SCREEN", "GTRIS-AREA"]) {
			style(m, "width", `${this.aspectResolution.w}px`);
			style(m, "height", `${this.aspectResolution.h}px`);
		}

		animatedLayers.cellSize = this.cellSize * this.playerAreaSizeMult;

		this.skinBlob.canvas.width = this.cellSize * 16 * this.resQualityMult;
		this.skinBlob.canvas.height = this.cellSize * 16 * this.resQualityMult;
		this.skinBlob.ctx.drawImage(this.skinBlobTemp.canvas, 0, 0, this.cellSize * 16 * this.resQualityMult, this.cellSize * 16 * this.resQualityMult);

		touchButtons.resize(this.orientation, this.resolution.w, this.resolution.h, this.aspectResolution.w, this.aspectResolution.h, this.cellSize);

		this.skin.canvas.width = this.cellSize * 4 * this.resQualityMult;
		this.skin.canvas.height = this.cellSize * 11 * this.resQualityMult;



		this.skin.ctx.drawImage(this.skinTemp.canvas, 0, 0, this.cellSize * 4 * this.resQualityMult, this.cellSize * 12 * this.resQualityMult);

		this.skinGarb.canvas.width = 1600;
		this.skinGarb.canvas.height = 400;

		this.skinGarb.ctx.drawImage(this.skinGarbTemp.canvas, 0, 0, 1600, 400, 0, 0, 1600, 400);

		this.skinParticle.canvas.width = this.cellSize * 11;
		this.skinParticle.canvas.height = this.cellSize * 1;

		this.skinParticle.ctx.drawImage(this.skinParticleTemp.canvas, 0, 0, this.cellSize * 11, this.cellSize * 1);

		style(`BEHIND-OVERLAY-BACKGROUND`, `width`, `${this.resolution.w}px`);
		style(`BEHIND-OVERLAY-BACKGROUND`, `height`, `${this.resolution.h}px`);

		style("BACKGROUND-VIDEO-FRAME", `width`, `${this.landscape.x}px`);
		style(`BACKGROUND-VIDEO-FRAME`, `height`, `${this.landscape.y}px`);

		style("BACKGROUND-FOREGROUND-LAYER", `width`, `${this.landscape.x}px`);
		style(`BACKGROUND-FOREGROUND-LAYER`, `height`, `${this.landscape.y}px`);

		style(`PARTICLE-PARTICLE-CANVAS`, `width`, `${this.resolution.w}px`);
		style(`PARTICLE-PARTICLE-CANVAS`, `height`, `${this.resolution.h}px`);

		style(`OVERLAY-TIMER`, `width`, `${this.resolution.w}px`);
		style(`OVERLAY-TIMER`, `height`, `${this.resolution.h}px`);

		style(`OVERLAY-TIMER-DIV`, `width`, `${this.cellSize * 6}px`);
		style(`OVERLAY-TIMER-DIV`, `height`, `${this.cellSize * 5}px`);

		style(`OVERLAY-TIMER-TEXT`, `font-size`, `${this.cellSize * 1.2}px`);
		style(`OVERLAY-TIMER-DIV`, `transform`, `language.translate(0, -${this.cellSize * 1.5}px)`);

		style(`OVERLAY-WINS-STATUSBAR`, `width`, `${this.landscape.x}px`);
		style(`OVERLAY-WINS-STATUSBAR`, `height`, `${this.landscape.y}px`);

		style(`WINSBAR-BAR`, `width`, `${this.cellSize * 12* this.playerAreaSizeMult}px`);
		style(`WINSBAR-BAR`, `height`, `${this.cellSize * 3 * this.playerAreaSizeMult}px`);

		style(`WINSBAR-BAR`, `bottom`, `${this.cellSize * 2 * this.playerAreaSizeMult}px`);

		game1v1.winstat.resize(this.cellSize * this.playerAreaSizeMult);
		//style(`WINSBAR-BAR`, `height`, `${this.cellSize * 1.2}px`);


		style(`GTRIS-PARTICLE-SCREEN`, `width`, `${this.resolution.w}px`);
		style(`GTRIS-PARTICLE-SCREEN`, `height`, `${this.resolution.h}px`);

		style(`GTRIS-SPLASH-DIV`, `width`, `${this.resolution.w}px`);
		style(`GTRIS-SPLASH-DIV`, `height`, `${this.resolution.h}px`);


		style(`GTRIS-HTMLEFF-SCREEN`, `width`, `${this.resolution.w}px`);
		style(`GTRIS-HTMLEFF-SCREEN`, `height`, `${this.resolution.h}px`);

		style(`GTRIS-LOAD-SCREEN`, `width`, `${this.resolution.w}px`);
		style(`GTRIS-LOAD-SCREEN`, `height`, `${this.resolution.h}px`);

		styleelem(loadingScreen.canvas, `width`, `${this.landscape.x}px`);
		styleelem(loadingScreen.canvas, `height`, `${this.landscape.y}px`);


		style(`LOAD-DIV`, `width`, `${this.landscape.x}px`);
		style(`LOAD-DIV`, `height`, `${this.landscape.y}px`);


		particle.size(this.resolution.w, this.resolution.h);
		style("GTRIS-AREA", "grid-template-columns", this.orientation === "landscape" ? "auto auto auto" : "auto auto")

		menu.resize(Math.max(this.landscape.x, this.landscape.y) / 50, this.landscape.x, this.landscape.y);
		splash.resize(this.landscape.x, this.landscape.y, Math.max(this.landscape.x, this.landscape.y) / 50)

		if (animatedLayers.checkObject("swap_roulette_object")) {
			let ghe = animatedLayers.getObject("swap_roulette_object");
			ghe.centerPos.x = this.resolution.w / 2;
			ghe.centerPos.y = this.resolution.h / 2;
			ghe.sizeMult = this.cellSize * this.playerAreaSizeMult;
		}

		game1v1.resize(this.landscape.x, this.landscape.y);

		this.forEachPlayer(player => {
			player.resize(~~this.cellSize, this.playerAreaSizeMult);
		});
	}

	forEachPlayer(func) {
		let a = 0;
		while (a in this.players) {
			func(this.players[a], a);
			a++;
		}
	}

	createPlayer(a) {

		if (a !== this.playerCount) {
			this.playerCount = a;
			this.players = {};
			ih("PLAYER-STYLES", "");

			ih("GTRIS-AREA", "");
			for (let i = 0; i < a; i++) {
				this.players[i] = new Player(i);
				let b = this.players[i];
				id("GTRIS-AREA").innerHTML += b.assetHTML;
				id("PLAYER-STYLES").innerHTML += b.assetStyle;
			}

			this.forEachPlayer(player => {
				////console.log(id("GTRIS-AREA"));
				player.storeElementsToMemory();
				player.meterBar.right.initialize(player.getAsset("METERBAR-RIGHT"), [player.getAsset("MB-HAND-RIGHT"), player.getAsset("MB-HAND-RIGHT-BEHIND")]);
				player.meterBar.garbwait.initialize(player.getAsset("METERBAR-GARBWAIT-LEFT"), [player.getAsset("MB-HAND-LEFT-GWLV1"), player.getAsset("MB-HAND-LEFT-GWLV2"), player.getAsset("MB-HAND-LEFT-GWLV3")]);
				player.insaneBg.fetchAsset(player.canvasses.insane, player.canvasCtx.insane);
				player.woiWormhole.fetchAsset(player.canvasses.wormhole, player.canvasCtx.wormhole);
				player.feverStat.fetchAsset(player.canvasses.feverGauge, player.canvasCtx.feverGauge, player.getAsset("FEVER-GAUGE"));

			});

			return true;
		}
		return false;
	}

	updateInput() {
		this.forEachPlayer(player => {
			if (this.activePlayer === player.player || true) {
				player.pressStr = this.pressStr;
			}

		});
		this.pressStr = "";
	}

	typeInput(char) {
		if (this.replay.isOn || menu.isMenu || this.pause.on) return;
		this.pressStr += char;

		this.forEachPlayer(player => {});

	}

	replayDataToString() {
		let string = JSON.stringify({
			title: `[${new Date(Date.now()).toLocaleString(navigator.language)}] Replay of ${menu.storage.getItem("playername")}, version ${appinfo.version}`,
			replays: this.replay.replays
		});
		return string;
	}

	frameLoop() {
		let isInsane = !(this.matchEndHandler.on || !this.isGameLoaded || this.isFinish) ? 5 : 0;

		if (menu.isMenu) {
			menu.run();
		}

		menu.runInBackground();

		if (this.startGameParameters.frame > 0) {
			this.startGameParameters.frame--;
			if (this.startGameParameters.frame == 0) {
				if (this.startGameParameters.type === "actual") this.initialize("actualparameter", false);
				if (this.startGameParameters.type === "restart") this.initialize(void 0, false);
				if (this.startGameParameters.type === "replay") this.initialize(void 0, true);
			}
		}
		loadingScreen.run();
		if (this.pause.on && this.pause.frame > 0) {
			this.pause.frame -= 1;
			if (this.pause.frame == 1) {
				this.synchroLoop.confirmIsAsync = false;
				this.pause.on = false;
			}
		}
		/*window.requestAnimationFrame(() => {
		 this.frameLoop();
		});*/
		if (!this.pause.on && this.isGameLoaded && this.startGameParameters.frame <= 0) {
			if (this.waitCountdown >= 0) {
				this.waitCountdown--;
			} else {


				if (!this.isFreezeHandlers && !this.isRoundNext) this.frames += 1;

				if (this.swapMode.on && this.swapMode.pickDel >= 0) {
					this.swapMode.pickDel -= 1;
					if (this.swapMode.pickDel == 210) {
						animatedLayers.create("swap_roulette_object", 120,
							this.resolution.w / 2,
							this.resolution.h / 2,
							0,
							0,
							200,
							200,
							11,
							11,
							1,
							"swap_roulette",
							10,

							this.cellSize * this.playerAreaSizeMult,


							{
								isOn: true,
								resetFrame: 47,
								targetFrame: 59
							},

							false,
							true,
						);
					}
					if (this.swapMode.pickDel == 100 && animatedLayers.checkObject("swap_roulette_object")) {
						let ghe = animatedLayers.getObject("swap_roulette_object");
						ghe.loop.isOn = false;
						ghe.setFrame([61, 98][this.swapMode.decidedBlockOrBlob]);
						sound.play("swap_pick");
					}
					if (this.swapMode.pickDel <= 172 && this.swapMode.pickDel >= 101 && (this.swapMode.pickDel % 5) == 0) {
						sound.play("move");
					}
					if (this.swapMode.pickDel == 90 && animatedLayers.checkObject("swap_roulette_object")) {
						let ghe = animatedLayers.getObject("swap_roulette_object");
						ghe.isPaused = true;
					}
					if (this.swapMode.pickDel == 10 && animatedLayers.checkObject("swap_roulette_object")) {
						//let ghe = animatedLayers.getObject("swap_roulette_object");
						animatedLayers.setOpacity("swap_roulette_object", 0, 10);
					}
					if (this.swapMode.pickDel == 0) {
						this.forEachPlayer(player => {
							if (this.swapMode.blockOrBlob == 1) player.swapMode.playSwapAnim();
							player.switchAuxToMain(this.swapMode.decidedBlockOrBlob);
							player.playVoice(["swap_gtris", "swap_blob"][this.swapMode.decidedBlockOrBlob]);
							player.convertGarbageBlockToGarbageBlob(this.swapMode.blockOrBlob);
						});
					}
				} else if (this.countdown > 0) {

					this.countdown--;
					if (this.countdown == 209 - 30) {
						this.resetReadyMatchSignal(1);
						this.isRunning = true;
						//this.synchroLoop.confirmIsAsync = false;
						this.isRoundActive = true;

						let mseed = this.seeds.preview.next();

						this.forEachPlayer(player => {
							//player.blob.previewReset(mseed);
						})

						//if (!this.replay.isOn) this.synchroLoop.speed = 0.3;
					}
					if (this.countdown == 0) {
						//this.endGame();
						this.forEachPlayer(player => {
							player.callibrateCenter();
							if (player.activeType == 1 && player.blob.isEnable && player.blob.isControl && !(player.blob.insane.delay.ready > 0 || player.blob.insane.delay.readyHenshin > 0)) player.blob.previewNextBlob();
							if (player.activeType == 0 && player.block.isEnable && player.block.isControl && !(player.block.insane.delay.ready > 0 || player.blob.insane.delay.readyHenshin > 0)) player.block.spawnPiece(player.block.previewNextBag());

							player.blob.isDelayEnabled = true;
							player.block.isDelayEnabled = true;

						})
					}
				} else {
					if (this.targetPointSystem.marginTime >= 0) {
						this.targetPointSystem.marginTime--;
						if (this.targetPointSystem.marginTime == 0 && this.targetPointSystem.targetPoint > 1) {
							this.targetPointSystem.marginTime <= 0;
							let currentTargetPoint = this.targetPointSystem.targetPoint;
							this.targetPointSystem.targetPoint = ~~(this.targetPointSystem.initial * 0.75);
							this.targetPointSystem.previous = currentTargetPoint;

						}
					}

					if (this.targetPointSystem.marginTime <= 0) {
						this.targetPointSystem.iterIncDel--;
						if (this.targetPointSystem.iterIncDel <= 0 && this.targetPointSystem.targetPoint > 1) {
							this.targetPointSystem.iterIncDel = 16 * this.FPS;
							let currentTargetPoint = this.targetPointSystem.targetPoint;
							this.targetPointSystem.targetPoint = ~~(this.targetPointSystem.previous * 0.5);
							this.targetPointSystem.previous = currentTargetPoint;
						}
					}
					////console.log(this.targetPointSystem.targetPoint)
					if (!this.isRoundNext && this.isRoundActive) {

						if (this.swapMode.time == 0) {
							this.swapMode.time = 30 * this.FPS;
							this.swapMode.swapDel = 40;
							this.isFreezeHandlers = true;

							sound.play("swap_swap");

							if (this.swapMode.blockOrBlob == 0) {
								this.swapMode.blockOrBlob = 1;

							}
							else if (this.swapMode.blockOrBlob == 1) {
								this.swapMode.blockOrBlob = 0;

							}
							this.forEachPlayer(player => {
								player.swapMode.playSwapAnim();
								player.block.canRaiseGarbage = false;
								player.blob.canFallTrash = false;
								player.refreshBorderField(this.swapMode.blockOrBlob);
							})
						} else if (this.swapMode.on == this.swapMode.time >= 0) {
							this.swapMode.time--;
							this.timerDisplay.display(this.swapMode.time);
						}
						if (this.swapMode.time == ~~(0.3 * this.FPS)) {
							this.forEachPlayer(player => {
								player.block.isActive = false;

								player.blob.isActive = false;




							});

						}
						if (this.swapMode.time <= this.FPS * 3 && this.swapMode.time > this.FPS * 0.1) {
							if (0 == (this.swapMode.time % this.FPS)) sound.play("timer_basic");

						}
					}
				}
			}
			this.matchSignal.main.run();
			let hasChainOngoing = false,
				hasChain = {};
			let isStillFinishable = false;

			if (this.swapMode.swapDel >= 0) {
				this.swapMode.swapDel--;




				if (this.swapMode.swapDel == 0) {
					this.isFreezeHandlers = false;
					game1v1.overhead.openClose(5);
					this.forEachPlayer(player => {
						player.switchAuxToMain(this.swapMode.blockOrBlob);
						//player.startNext();
						player.canvasClear("back");
						player.canvasClear("backAux");
						player.engageCleartext("b2b", false, "");
						player.engageCleartextCombo(false, 0, "");

						player.swapMode.reset();
						player.swapMode.time = 16 * this.FPS;
						player.convertGarbageBlockToGarbageBlob(this.swapMode.blockOrBlob);
						if (this.isRoundActive) {
							if (this.swapMode.blockOrBlob == 1) {
								player.blob.setDelay(0, 5);
								if (player.blob.isWarning) {
									player.playVoice("swap_danger");
								} else if (player.block.isWarning) {
									player.playVoice("swap_closecall");
								} else {
									player.playVoice("swap_swap");
								}

							}

							if (this.swapMode.blockOrBlob == 0) {
								player.block.setDelay(0, 5);
								if (player.block.isWarning) {
									player.playVoice("swap_danger");
								} else if (player.blob.isWarning) {
									player.playVoice("swap_closecall");
								} else {
									player.playVoice("swap_swap");
								}

							}
						}
					});
				}
			}

			this.forEachPlayer(player => {
				player.runUnfreezableAnims();
			});

			if (!this.isFreezeHandlers) {

				////console.log("running")
				this.updateInput();
				let teamsAlive = {};

				let n = false;
				let insaneDetected = 0;
				//isInsane = 2;
				this.forEachPlayer(player => {
					if (player.blob.insane.isOn) {
						insaneDetected = 2;
					}
					if (player.block.insane.isOn) {
						insaneDetected = 2;
					}
				});
				if (insaneDetected == 0 && this.enableWarning) this.forEachPlayer(player => {
					if (player.isWarning) {
						isInsane = 4;
					}
				});
				//music.volume(n ? 1 : 1)

				this.forEachPlayer(player => {
					player.playerUpdate();

					player.blob.decreaseTargetPoint = Math.max(1, this.targetPointSystem.initial / this.targetPointSystem.targetPoint);
					if (!player.isDead && !player.isDying) {
						teamsAlive[player.team] = 1;
						if (player.blob.forecastedChain > 0 && (player.blob.chain > 0 || player.blob.isChainUp) && player.blob.chain < player.blob.forecastedChain) {
							hasChainOngoing = true;
						}

					}
					if (player.isFinishAble) isStillFinishable = true;
					if (player.blob.isChainUp || player.blob.isChainUp) hasChain[player.team] = 1;
					if (!player.isDead) {
						if (!this.isFinish && (player.block.insane.isOn || player.blob.insane.isOn)) {

							if (player.blob.insane.insaneType == 0) isInsane = 1;
							if (player.blob.insane.insaneType == 2) isInsane = 2;
							if (player.blob.insane.insaneType == 1) isInsane = 2;

						}
					}
				});

				switch (this.inGameParameters.mode) {
					case 3: {
						let isInsaneOff = true;
						let isInsaneOn = false;


						this.forEachPlayer(player => {
							let block = player.block,
								blob = player.blob;
							if ((player.activeType == 0 && (block.insane.isOn || (block.insane.delay.ready > 0) || (block.insane.delay.in > 0) || (block.insane.delay.out > 0))) ||
								(player.activeType == 1 && (blob.insane.isOn || (blob.insane.delay.ready > 0) || (blob.insane.delay.readyHenshin > 0) || (blob.insane.delay.in > 0) || (blob.insane.delay.out > 0)))) {
								isInsaneOff = false;
								isInsane = this.frames > 32 ? 1 : 0;
							}

							////console.log(blob.insane.delay.ready, this.countdown, this.frames, blob.isEnable)

							if ((player.activeType == 0 && (block.insane.isOn)) ||
								(player.activeType == 1 && (blob.insane.isOn))) {
								isInsaneOn = true;

							}
							// player.editIH("STATS-SCORE-TEXT", [JSON.stringify({ blob: blob.insane.delay, block: block.insane.delay }).replace(/,/gm, "\n"), this.woiMode.time]);


							//player.editIH("STATS-SCORE-TEXT", [blob.insane.isOn, blob.insane.delay.ready, blob.insane.delay.in, blob.insane.delay.out, blob.insane.isOn || blob.insane.delay.ready > 0 || blob.insane.delay.in > 0 || blob.insane.delay.out > 0 ])
						});
						////console.log(isInsane)
						if (isInsaneOn) {
							if (this.woiMode.timeDelay >= 0) {
								this.woiMode.timeDelay -= 1;
							}
							this.timer.increment((this.woiMode.timeDelay > 0) ? 0 : -1);

						}

						this.timer.update();

						if (isInsaneOff) {
							if (this.woiMode.time >= 0) {
								this.woiMode.time--;
								isInsane = 3;
							}
						} else if (this.woiMode.time < (4 * this.FPS)) {
							this.woiMode.time = 4 * this.FPS;
						}
						if (this.woiMode.time == (4 * this.FPS) - 2) {
							sound.play("wormhole_ready");
							this.playAnimation("mswhready");
							ihelem(this.matchSignal.html.start, "Get ready...");
							this.forEachPlayer(player => {
								if (!player.isDead) {
									player.woiWormhole.engage(0);
								}
								player.woi.damageSent = ~~((player.activeType == 0 ? (player.block.garbageConversion(player.woi.a * 0.5).a * 0.5) : player.woi.a) / 6);
								////console.log(player.player + ": " + `${player.woi.damageSent} damage pts`);
							});
						}

						if (this.woiMode.time == (0 * this.FPS)) {
							sound.play("wormhole_blast");
							//sound.play("wormhole_loop");
							sound.stop("wormhole_ready");
							this.woiMode.loopRate = 1.017;

							this.playAnimation("mswhstart");
							ihelem(this.matchSignal.html.start, "The Wormhole!");

							this.woiMode.isEvaluation = true;
							this.woiMode.shoot = -50;
							this.forEachPlayer(player => {
								if (player.woi.damageSent <= 0) {
									player.woiWormhole.engage(2);
								} else {
									animatedLayers.create(undefined,
										60,
										player.playerCenterPos.x,
										player.playerCenterPos.y,
										0, 0,
										200, 200,
										15,
										15,
										1,
										"wormhole_explosion",
										10,
										3

									);

									player.playAnimation("fieldShake");
								}
								if (!player.isDead) player.playVoice("wormhole_enter");
							});
						}

						if (this.woiMode.isEvaluation) {
							this.woiMode.shoot += Math.min(2, this.woiMode.loopRate - 0.017);
							this.woiMode.loopRate += 0.0173;
							isInsane = 3;

							if (this.woiMode.shoot >= 10) {
								this.woiMode.shoot -= 10;
								let attacks = {};
								let blocks = {};
								let isCounter = false;
								let isAttack = false;

								this.forEachPlayer(player => {
									if (player.woi.damageSent > 0) {
										attacks[player.player] = [];
										player.woi.damageSentPerHit = Math.max(Math.min(player.woi.damageSent, ~~(10 * (this.targetPointSystem.initial / this.targetPointSystem.targetPoint))), 0);
										blocks[player.player] = player.woi.damageSentPerHit;

										player.woi.damageSent -= player.woi.damageSentPerHit;

										if (player.woi.damageSent < 0 || player.woi.damageSent == 0) {

											player.woi.damageSent = 0;
											player.woiWormhole.engage(2);
											player.stopAnimation("fieldShake");
										} else {

										}
										////console.log(`${player.player} ${player.woi.damageSent}`)
										this.forEachPlayer(opponent => {
											if (opponent.team !== player.team && player.player !== opponent.player && !opponent.isDead) attacks[player.player].push(opponent.player);
										});

									}
								});
								let rx = (this.cellSize * ((Math.random() * 5) - (Math.random() * 5)));
								let ry = (this.cellSize * ((Math.random() * 5) - (Math.random() * 5)));
								this.forEachPlayer(player => {
									let isBlock = false;

									if ((player.player in attacks) && !player.isDead) {
										//isAttack = true;
										for (let nb of attacks[player.player]) {
											////console.log(`PLAYER${nb}`)
											let bez = {
												x1: 0,
												x2: 0.1,
												x3: 1.9,
												x4: 1,
												y1: 0,
												y2: 0,
												y3: 0.9,
												y4: 1,
											};

											let asset = player.assetRect("FIELD-INSANE-CANVAS");
											let sizemult = 1;
											let aw = asset.width;
											let ah = asset.height;
											let ax = asset.x;
											let ay = asset.y;
											let particleSpeed = 40;
											let lx = this.resolution.w / 2;
											let ly = this.resolution.h / 2;

											let dmg = player.woi.damageSentPerHit;

											let cs = player.fieldCellSize;
											let particleColor = player.player;
											sound.play("wormhole_transmit");
											if (nb in blocks) {


												let dmgNeut = blocks[nb];
												let dmgSent = player.woi.damageSentPerHit;
												dmg = Math.max(0, dmgSent - dmgNeut);
												let opp = nb;
												// lx += rx
												ly += ry;
												this.addDelayHandler(particleSpeed, () => {
													sound.play("wormhole_block");
												});

												if (dmg > 0) {
													isCounter = true;
													this.addDelayHandler(particleSpeed, () => {

														this.forEachPlayer(opponent => {
															if (opp === opponent.player) {
																player.woi.damageInflicted += dmg;
																opponent.woi.damageReceived += dmg;

																let target = opponent.assetRect("FIELD-CHARACTER-CANVAS");
																let gw = target.width;
																let gh = target.height;
																let gx = target.x;
																let gy = target.y;

																let mlx = gx + (gw / 2) + (this.cellSize * ((Math.random() * 5) - (Math.random() * 5)));
																let mly = gy + (gh / 2) + (this.cellSize * ((Math.random() * 5) - (Math.random() * 5)));
																this.addDelayHandler(particleSpeed, () => {
																	opponent.rpgAttr.addHP(-dmg);
																	sound.play("wormhole_hit");
																	opponent.simulateWMWShakeIntensityHit();
																	animatedLayers.create(undefined, 30,
																		mlx,
																		mly,
																		0,
																		0,
																		200,
																		200,
																		5,
																		5,
																		0.5,
																		`${player.activeType == 1 ? "blob" : "block"}_hit`,
																		10,
																		player.fieldCellSize,
																	);
																});
																player.addParticle(true, "attack", 0, particleColor + 2,
																	lx,
																	ly,
																	mlx,
																	mly,
																	particleSpeed, 1.3, false, bez, true, {
																		frame: particleSpeed * (0.5),
																		r: 255,
																		g: 255,
																		b: 255,
																	});




															}
														});
													});
												}


											} else {
												this.forEachPlayer(opponent => {
													if (nb === opponent.player) {
														player.woi.damageInflicted += dmg;
														opponent.woi.damageReceived += dmg;
														let target = opponent.assetRect("FIELD-CHARACTER-CANVAS");
														let gw = target.width;
														let gh = target.height;
														let gx = target.x;
														let gy = target.y;

														lx = gx + (gw / 2) + (this.cellSize * ((Math.random() * 5) - (Math.random() * 5)));
														ly = gy + (gh / 2) + (this.cellSize * ((Math.random() * 5) - (Math.random() * 5)));
														this.addDelayHandler(particleSpeed, () => {
															opponent.rpgAttr.addHP(-dmg);
															sound.play("wormhole_hit");
															opponent.simulateWMWShakeIntensityHit();
															animatedLayers.create(undefined, 30,
																lx,
																ly,
																0, 0,

																200,
																200,
																5,
																5,
																0.9,
																`${player.activeType == 1 ? "blob" : "block"}_hit`,
																10,
																1.2
															);
														});

													}
												});

											}


											player.addParticle(true, "attack", 0, particleColor + 2,
												ax + (aw / 2),
												ay + (ah / 2),
												lx,
												ly,
												particleSpeed, 1.3, false, bez, true, {
													frame: particleSpeed * (0.8),
													r: 255,
													g: 255,
													b: 255,
												});
										};


									}

								});

								this.forEachPlayer(player => {
									if (player.woi.damageSent > 0) {
										isAttack = true;
									}

								})
								if (!isAttack) {
									if (this.woiMode.restart <= 100) this.woiMode.restart = 70;
									//sound.stop("wormhole_loop");
									this.woiMode.isEvaluation = false;
									if (isCounter) {
										if (this.woiMode.restart <= 100) this.woiMode.restart = 100;

									}
								} else {
									sound.play("wormhole_transmit");
								}


								if (!isAttack) {

								}
							}

						}

						if (this.woiMode.restart >= 0) {
							this.woiMode.restart--;

							if (this.woiMode.restart == 0) {
								this.woiMode.isEvaluation = false;
								let isStillAlive = [];
								this.forEachPlayer((player) => {
									if (!player.rpgAttr.checkZeroHP() && !player.isDead) {
										isStillAlive.push(player.team);
									}
								});
								if (isStillAlive.length >= 1) {
									this.woiMode.timeDelay = 1.5 * this.FPS;
									this.timer.set(80 * game.FPS);
								}
								this.forEachPlayer((player) => {
									player.woi.a = 0;
									if (!player.rpgAttr.checkZeroHP()) {
										if (isStillAlive.length > 1) {
											if (player.woi.damageReceived > 0) {
												if (player.woi.damageReceived >= (0.5 * player.rpgAttr.maxHP)) { player.playVoice("wormhole_damage2"); }
												else {
													player.playVoice("wormhole_damage1");
												}
											} else if (player.woi.damageInflicted > 0) {
												if (player.woi.damageInflicted >= (0.5 * player.rpgAttr.maxHP)) { player.playVoice("wormhole_inflict2"); }
												else {
													player.playVoice("wormhole_inflict1");
												}
											}
										} else {
											player.playVoice("wormhole_win");
										}

										player.woi.reset();
										if (isStillAlive.length > 1) {
											if (player.activeType == 0) player.block.insane.delay.ready = 50;
											if (player.activeType == 1) player.blob.insane.delay.ready = 50;
										}
									} else if (!player.isDead) {
										player.playVoice("wormhole_lose");
										player.phaseLose("break");
										player.playSound("wormhole_break");
										//TODO rewrite
									}
								});
							}








						}
						break;

					}
				}


				this.runDelayHandler();

				let teamsAliveArr = Object.keys(teamsAlive),
					teamAliveCount = teamsAliveArr.length;
				let playerWin = 0;
				let hasMaxPointsWinner = false;
				this.forEachPlayer(player => {
					if (teamAliveCount == (this.isSolo ? 0 : 1) && !player.isWin && player.team in teamsAlive) {
						player.isWin = true;
						player.block.piece.enable = 0;

						player.blob.piece.enable = 0;

						player.block.isActive = 0;

						player.blob.isActive = 0;
						this.isRoundActive = false;
					}
					if (player.isDying && !player.isFinishAble && !player.isDead && !player.isWin) {
						player.block.piece.enable = 0;

						player.blob.piece.enable = 0;

						player.block.isActive = 0;

						player.blob.isActive = 0;

						player.blob.isEnable = 0;
						player.block.isEnable = 0;
						if (hasChainOngoing && !(player.team in hasChain)) {
							player.isDead = false;
							player.isFinishAble = true;

						} else if (!player.isFinishAble) {
							player.phaseLose();
						}
					}
					if (player.team in teamsAlive && player.isWin && !player.hasWon && !hasChainOngoing && !isStillFinishable && !(player.team in hasChain)) {
						/*player.switchModeType(0);
						player.reset();
						player.block.spawnPiece(0);*/
						player.block.piece.enable = 0;

						player.blob.piece.enable = 0;

						player.block.isActive = 0;

						player.blob.isActive = 0;

						player.hasWon = true;
						if (!player.isDead) {
							player.playEmAnimation("win");
							player.engagePlaycharExt("result");
							player.editIH("PLAYCHAR-TEXT", "Yeah!");
						}
						////console.log("PLAYER WIN: " + player.player);
						//player.phaseLose();



						playerWin++;
						this.inGameParameters.players[player.player].wins++;
						if (this.inGameParameters.players[player.player].wins >= this.inGameParameters.maxWins) {
							hasMaxPointsWinner = true;
						}
					}
					player.runAnimations();

				});

				if (!this.isRoundNext && (this.isSolo ? 0 : 1) >= teamAliveCount && !hasChainOngoing && !isStillFinishable) {
					//document.write("STAPH")
					this.roundNextTime = 120;
					if (this.isSolo || hasMaxPointsWinner) {
						if (!this.replay.isOn && !this.matchEndHandler.isFinishActual) {
							this.matchEndHandler.isFinishActual = true;
						}
						this.isFinish = true;
					}
					let loseNotReady = 0;
					this.forEachPlayer(player => {
						if (!player.isLosePlayed && player.isDead) loseNotReady++;
					});


					if (loseNotReady == 0) {

						this.isRoundNext = loseNotReady == 0;
					}
				}
				if (this.isRoundNext && this.roundNextTime >= -1) {
					let playerDoneLose = true;
					this.forEachPlayer(player => {
						if (player.checkVoicePlaying("lose")) playerDoneLose = false;
					});

					if (playerDoneLose) this.roundNextTime--;

					if (this.roundNextTime == 118) {
						this.forEachPlayer((player) => {
							if (player.hasWon && !player.isDead) player.playVoice("win");
						});

						if (game1v1.on) {
							this.forEachPlayer(player => {
								if (!(player.hasWon && !player.isDead)) return;
								if (player.player == 0) {

									game1v1.winstat.setWins("left", player.wins + 1, true);
								}
								if (player.player == 1) {

									game1v1.winstat.setWins("right", player.wins + 1, true);
								}
							})
						}
						//needs simplification 
						if (this.replay.isOn) {
							if ((this.replay.replaysIndex + 1) >= this.replay.replays.length) {
								this.matchEndHandler.on = true;
							}
						} else if (this.matchEndHandler.isFinishActual) {
							this.matchEndHandler.on = true;

						}
						//this.roundNextTime = -3993;
					}

					if (this.roundNextTime == 6) {
						if (this.replay.isOn) {

						}
						if (this.matchEndHandler.on) {
							this.endGame();
							this.roundNextTime = -9999;
						} else {
							this.playAnimation("fade");
						}

						this.woiMode.loopRate = -1;

					}
					if (this.roundNextTime == 0) {

						if (!this.matchEndHandler.on) {
							this.initializeNext(this.replay.isOn);
							//this.resetCountdown();
							//this.countdown = 230 - 30;
							//this.isRoundNext = false;
						}
						this.isRoundNext = false;
					}
				}

				particle.refresh();
				htmlEffects.run();

			}

			game1v1.run();

			this.synchroLoop.confirmIsAsync = !this.isRunning;

			for (let h = 0, m = this.animationNames.length; h < m; h++)
				this.animations[this.animationNames[h]].run();


			if (this.woiMode.loopRate >= 0) {
				this.woiMode.loopRate -= 0.017;
				sound.rate("wormhole_loop", this.woiMode.loopRate);
			}

			this.numberExecHandlers.wormholeLoop.assign(this.woiMode.loopRate > 0 ? 1 : 0);

		}
		this.numberExecHandlers.insaneMFX.assign(isInsane);
	}
	pauseGame() {
		if (this.pause.on) return;
		this.pause.on = true;
		if (this.replay.isOn) touchButtons.enableControllers(true);
		menu.changeSelectables(this.replay.isOn ? menu.pauseReplaySels : (menu.pauseSels));
		menu.showMenu(true);
		this.synchroLoop.confirmIsAsync = true;
	}

	unpauseGame() {
		if (!this.pause.on) return;
		this.pause.frame = 50;
		if (this.replay.isOn) touchButtons.enableControllers(false);
		//menu.changeSelectables(menu.pauseSels);
		menu.showMenu(false);
		//this.synchroLoop.confirmIsAsync = true;
	}

	playAnimation(h) {
		this.animations[h].play();
	}

	resetAnimations() {
		for (let h = 0, m = this.animationNames.length; h < m; h++)
			this.animations[this.animationNames[h]].reset();
	}


}();
const game = manager;
const keypressManager = new class {
	constructor() {
		/*
		   pause: 27,
		    LEFT: 37,
		    RIGHT: 39,
		    SOFTDROP: 40,
		    HARDDROP: 32,
		    HOLD: 67,
		    CW: 88,
		    CCW: 90,
		    C180W: 16,
		    retry: 82,
		    */
		this.bindsDefault = {
			0: {
				left: "arrowleft",
				right: "arrowright",
				softdrop: "arrowdown",
				harddrop: " ",
				hold: "c",
				cw: "arrowup",
				ccw: "x",
				/*blockcw: 88,
				blockccw: 90,
				/*blockcw: 88,
				blockccw: 90,/**/
				c180w: "shift"
			},
			1: {
				left: "arrowleft",
				right: "arrowright",
				softdrop: "arrowdown",
				harddrop: "arrowup",

				cw: "x",
				ccw: "z",
				/*blockcw: 88,
				blockccw: 90,
				/*blockcw: 88,
				blockccw: 90,/**/
				c180w: "shift"
			},
		};

		this.binds = {

		};

		for (let aa in this.bindsDefault) {
			this.binds[aa] = {};
			for (let ab in this.bindsDefault[aa]) {
				this.binds[aa][ab] = {};
				for (let ac of this.bindsDefault[aa][ab].split('||')) {
					this.binds[aa][ab][ac] = 1;
				}
			}
		}
		this.lastKeys = {};


		////console.log(this.binds)
		this.flags = {
			left: {
				up: "a",
				down: "A"
			},
			right: {
				up: "b",
				down: "B"
			},
			softdrop: {
				up: "c",
				down: "C"
			},
			harddrop: {
				up: "d",
				down: "D"
			},
			hold: {
				up: "e",
				down: "E"
			},
			ccw: {
				up: "f",
				down: "F"
			},
			cw: {
				up: "g",
				down: "G"
			},
			c180w: {
				up: "h",
				down: "H"
			},
		};
	}
	keyFlag(code, type, categ) {
		if (code) {

			for (let r = Object.keys(this.flags)[0], f = 0, g = Object.keys(this.flags).length; f < g; f++, r = Object.keys(this.flags)[f]) {
				if (r in this.binds[categ])
					if (code in this.binds[categ][r]) {

						if (this.binds[categ]?.[r] || true) {
							return this.flags[r][["down", "up"][type]];
						}
					}
			}
		}
		return "";
	}

	listen(evt) {
		let key = evt.key.toLowerCase();
		if ([" ", "arrowleft", "arrowright", "arrowup", "arrowdown"].indexOf(key) !== -1)
			evt.preventDefault();

		if (!(key in this.lastKeys)) {
			this.lastKeys[key] = evt.type;
		} else if (this.lastKeys[key] !== evt.type) {
			this.lastKeys[key] = evt.type;
		} else return;
		/*if (evt.type === "keydown") {
		 switch (evt.keyCode) {
		  case gameStorage.currentSettings.binds.pause: {
		   this.checkTextAreaOut(evt, () => {
		    gameManager.pauseGame(!gameManager.isPaused);
		   });
		   break;
		  }
		  case gameStorage.currentSettings.binds.retry: {
		   this.checkTextAreaOut(evt, () => {
		    gameManager.prepareInitialization(gameManager.mode);
		   });
		   break;
		  }
		 }
		}*/
		if (game.startGameParameters.frame > 0) return;
		if (splash.isActive) {
			splash.nextSlide();
		}
		else if (!menu.isMenu) {
			let player = manager.players[manager.activePlayer];
			var flag = this.keyFlag(key, {
				keydown: 0,
				keyup: 1
			} [evt.type], player.activeType);
			////console.log(evt.key, flag)
			manager.typeInput(flag);
		} else if (menu.characterMenu.isActive) {
			if (evt.type == "keydown") menu.characterMenu.controlsListen((key));
		} else if (menu.isMenu) {
			let ms = (evt.type).replace(/key/gmi, "");
			//if (key === "arrowdown") menu.controlsListen("down");
			switch (`${key}`) {
				case "arrowdown":
					menu.controlsListen("down", ms);
					break;
				case "arrowup":
					menu.controlsListen("up", ms);
					break;
				case "arrowleft":
					menu.controlsListen("left", ms);
					break;
				case "arrowright":
					menu.controlsListen("right", ms);
					break;
				case "enter":
					menu.controlsListen("a", ms);
					break;
				case "backspace":
					menu.controlsListen("b", ms);
					break;
			}
		}
	}

}();

const htmlEffects = new class {
	constructor() {
		this.main = $("GTRIS-HTMLEFF-SCREEN");
		this.a = new ArrayFunctionIterator((at) => {

			for (let ptl = 0; ptl < at.length; ptl++) {
				let pl = at[ptl];
				let element = pl.element,
					parent = element.parentNode;
				pl.frame++;
				if (pl.frame < pl.maxf) styleelem(element, "animation-delay", `${~~((1000 / (60 * (-1))) * Math.min(pl.maxf, pl.frame))}ms`);
				else {
					this.main.removeChild(element);
					at.splice(ptl, 1);
					ptl--;

				}
			}

		});
	}

	add(text, posX, posY, frame, animation, style, id) {
		//let parent = document.createElement("GTRIS-HTMLEFF-PARENT")
		let a = document.createElement("GTRIS-HTMLEFF-ELEM");
		a.innerHTML = text;
		a.style = style;
		a.style.position = "absolute";
		a.style.transform = `translateX(${posX}px) translateY(${posY}px)`;
		a.style["animation-name"] = animation.name;
		styleelem(a, "animation-duration", `${~~((1000 / (60)) * Math.max(0, frame))}ms`);
		styleelem(a, "animation-iteration-count", animation.iter);
		styleelem(a, "animation-timing-function", animation.timefunc);
		styleelem(a, "animation-delay", animation.initdel || 0);
		styleelem(a, "animation-play-state", "paused");

		//parent.appendChild()
		this.main.appendChild(a);
		this.a.addItem({
			element: a,
			frame: 0,
			maxf: frame
		});
	}
	run() {
		this.a.update();
	}
}()


handle.__setHandle = () => {
	//////console.log(game)
	window.addEventListener("resize", () => {
		game.resize();
		window.requestAnimationFrame(() => {
			game.resize();
		})
	}, false);
	game.resize();
	game.initGame();
	////console.log(load);
	////console.log(__private)
	for (let a of ["keydown", "keyup"]) window.addEventListener(a, (evt) => {
		keypressManager.listen(evt)
	});

}