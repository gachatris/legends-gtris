class MainPlayerFragment {

	DEFAULT_CHAIN_POWER_PRESET = JSON.parse(JSON.stringify(TSU_CHAIN_POWER));

	DEFAULT_CHAIN_FEVER_POWER_PRESET = [0, 6, 10, 16, 23, 32, 44, 63, 74, 97, 120, 157, 176, 211, 244, 281, 315, 351, 416, 473, 542, 604, 644, 681];

	DEFAULT_DROPSET = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

	DEFAULT_SPELL_SEQUENCE = JSON.stringify(CHAIN_SEQUENCE);

	constructor(player, n) {
		this.player = player;
		let regex = /PNUMBER/gm;
		this.assetHTML = manager.assetHTML.replace(regex, "P" + this.player);
		this.assetStyle = manager.assetStyle.replace(regex, "P" + this.player);
		this.htmlElements = [];
		this.soundActive = true;
		this.particleGarbageDelay = 25;
		this.team = Math.random();

		this.name = "No name";

		this.wins = 0;

		this.playerCenterPos = {
			x: 0,
			y: 0,
		}

		this.isVisible = true;
		this.score = 0;
		this.addScoreText = "";
		this.scoreText = new NumberChangeFuncExec(0, (m) => {
			this.editIH("STATS-SCORE-TEXT", m);
		});

		this.animationLayerElements = [];

		this.fieldSize = {
			w: 10,
			h: 40,
			vh: 20,
			hh: 22
		};

		this.rectanim = new RectangularAnimations(this);
		this.rpgAttr = new RPGAttributes(this);


		this.visibleFieldBufferHeight = 5;
		this.visibleFieldHeight = 0;

		this.character = {
			current: 0,
			canvas: void 0,
			ctx: void 0,
			active: false,
			voices: {},
			voiceActive: "",
			voiceID: -1,
			activeVoiceline: "",
			load: false,
			defaultAttributes: {
				"hp": 300,
				"def": 100,
				"atk": 10,
				"mp": 50,
				"lifesteal": 0.0,
				"atktol": 13,
				"hpregen": 3,
				"hpregentol": 1,
				"hpregentime": 40,
			},
			attributes: {
				"hp": 300,
				"def": 100,
				"atk": 10,
				"mp": 50,
				"lifesteal": 0.0,
				"atktol": 13,
				"hpregen": 3,
				"hpregentol": 1,
				"hpregentime": 40,
			},

			blob: {
				chainPower: JSON.parse(JSON.stringify(this.DEFAULT_CHAIN_POWER_PRESET)),
				feverPower: JSON.parse(JSON.stringify(this.DEFAULT_CHAIN_FEVER_POWER_PRESET)),
				dropset: JSON.parse(JSON.stringify(this.DEFAULT_DROPSET)),
			},
			isCounting: false,

			char: null,
			ver: null,
			jsonString: null,
			loadable: false,
			jsonLoaded: false,
			json: {},

		};
		elem("CANVAS", canvas => {
			canvas.width = (600 * 5);
			canvas.height = 600 * 5;
			this.character.canvas = canvas;
			let ctx = canvas.getContext("2d");
			this.character.ctx = ctx;
		});
		this.meterBar = {
			right: new MeterBar(),
			garbwait: new MultipleMeterBar(3)
		};

		this.color = {
			r: 0,
			g: 0,
			b: 0
		}

		this.seeds = {
			field: new ParkMillerPRNG(),
		};
		this.pressStr = "";
		this.lastPressStr = "";

		this.cellSize = 0;
		this.fieldCellSize = 0;

		this.clearText = {
			tspin: new GIFRenderer(8640, 180, 180, 180, 1, (a, canv, x, y, w, h, frame, that) => {
				let b = a.canvas;
				a.clearRect(0, 0, b.width, b.height);
				a.drawImage(canv, x * w, y * h, w, h, 0, 0, w, h);
				that.frame.x++;
				that.frameCount++;

				if (frame >= 48) that.enabled = false;
				if (frame == 42) this.clearText.tspinLine.assign(0);
			}, (frame) => {
				this.setStyle("CLEARTEXT-CANVTEXT", "animation-delay", `${~~((1000 / -60) * (frame))}ms`);
			}),
			tspinLine: new NumberChangeFuncExec(false, (state) => {
				let e = "CLEARTEXT-TSPIN-LINE";
				let element = this.getAsset(e);
				this.setStyle(e, "animation", "none");
				element.offsetHeight;
				if (state == 1) {
					this.setStyle(e, "opacity", "100%");
					this.setStyle(e, "animation", "fade-in 200ms 1 linear");
				} else if (state == 2) {
					this.setStyle(e, "opacity", "0%");
				} else if (state == 0) {
					this.setStyle(e, "animation", "fade-out 300ms 1 linear");
					this.setStyle(e, "opacity", "0%");
				}
			}),
			b2b: new NumberChangeFuncExec(false, (state) => {
				let e = "CLEARTEXT-TEXT-B2B";
				let element = this.getAsset(e);
				this.setStyle(e, "animation", "none");
				element.offsetHeight;
				if (state == 1) {
					this.setStyle(e, "opacity", "100%");
					this.setStyle(e, "animation-name", "ct-anim-nofadeout");
					this.setStyle(e, "animation-duration", `${~~((1000 / 60) * (60 + 60))}ms`);
					this.setStyle(e, "animation-timing-function", "ease-out");
					this.setStyle(e, "animation-play-state", "paused");
					this.clearTextRenderers.b2b.reset(0);
				} else if (state == 2) {
					this.setStyle(e, "opacity", "100%");
					this.clearTextRenderers.b2b.toggleEnable(false);
				} else if (state == 0) {
					this.clearTextRenderers.b2b.toggleEnable(false);
					this.setStyle(e, "opacity", "0%");
				}
			}),
			combo: new NumberChangeFuncExec(false, (state) => {
				let e = "CLEARTEXT-TEXT-COMBO";
				let element = this.getAsset(e);
				//this.setStyle(e, "animation", "none");
				//element.offsetHeight;
				if (state == 1) {
					this.setStyle(e, "opacity", "100%");
					this.stopAnimation("ctComboClose");
					this.playAnimation("ctComboOpen");
				} else if (state == 2) {
					this.setStyle(e, "opacity", "0%");
					this.stopAnimation("ctComboOpen");
					this.stopAnimation("ctComboClose");
				} else if (state == 0) {

					this.setStyle(e, "opacity", "0%");
					this.stopAnimation("ctComboOpen");
					this.playAnimation("ctComboClose");

				}
			}),

			line: new NumberChangeFuncExec(false, (state) => {
				let e = "CLEARTEXT-TEXT-LINE";
				let element = this.getAsset(e);
				this.setStyle(e, "animation", "none");
				element.offsetHeight;
				if (state == 1) {
					this.setStyle(e, "opacity", "0%");
					this.setStyle(e, "animation-name", "ct-anim");
					this.setStyle(e, "animation-duration", `${~~((1000 / 60) * (60 + 60))}ms`);
					this.setStyle(e, "animation-timing-function", "ease-out");
					this.setStyle(e, "animation-play-state", "paused!important");
					this.clearTextRenderers.line.reset(0);
				} else if (state == 0) {
					this.clearTextRenderers.line.toggleEnable(false);
					this.setStyle(e, "opacity", "0%");
				}
			}),
			spin: new NumberChangeFuncExec(false, (state) => {
				let e = "CLEARTEXT-TEXT-SPIN";
				let element = this.getAsset(e);
				this.setStyle(e, "animation", "none");
				element.offsetHeight;
				if (state == 1) {
					this.setStyle(e, "opacity", "0%");
					this.setStyle(e, "animation-name", "ct-anim");
					this.setStyle(e, "animation-duration", `${~~((1000 / 60) * (60 + 60))}ms`);
					this.setStyle(e, "animation-timing-function", "ease-out");
					this.setStyle(e, "animation-play-state", "paused!important");
					this.clearTextRenderers.spin.reset(0);
				} else if (state == 0) {
					this.clearTextRenderers.spin.toggleEnable(false);
					this.setStyle(e, "opacity", "0%");
				}
			}),
		};

		this.clearTextRenderers = {
			b2b: new FrameRenderer(0, 120, (frame) => {
				this.setStyle("CLEARTEXT-TEXT-B2B", "animation-delay", `${~~((1000 / -60) * (frame))}ms`);
			}),
			line: new FrameRenderer(0, 120, (frame) => {
				this.setStyle("CLEARTEXT-TEXT-LINE", "animation-delay", `${~~((1000 / -60) * (frame))}ms`);
			}),
			spin: new FrameRenderer(0, 120, (frame) => {
				this.setStyle("CLEARTEXT-TEXT-SPIN", "animation-delay", `${~~((1000 / -60) * (frame))}ms`);
			}),
		};

		this.clearTextAFR = {

		};

		this.canvasTemplate = {
			character: "FIELD-CHARACTER",
			insane: "FIELD-INSANE",
			stack: "FIELD-STACK",
			piece: "FIELD-PIECE",
			hold: "HOLD",
			next: "NEXT",
			back: "FIELD-BACK",
			blobNext: "BLOB-NEXT",
			playchar: "PLAYCHAR",
			rectanim: "RECTANIM",
			tspin: "CLEARTEXT-TSPIN",
			nextQueue: "NEXT-QUEUE",
			garbageTray: "GARBAGE-TRAY",
			garbageTrayBehind: "GARBAGE-TRAY-BEHIND",
			hpmeter: "HP-METER",
			feverGauge: "FEVER-GAUGE",

			characterAux: "AUX-FIELD-CHARACTER",
			backAux: "AUX-FIELD-BACK",
			insaneAux: "AUX-FIELD-INSANE",
			stackAux: "AUX-FIELD-STACK",
			pieceAux: "AUX-FIELD-PIECE",
		};
		this.canvasses = {};
		this.canvasCtx = {};

		this.fieldAnimations = {};

		this.playcharExt = {
			active: "insane",
			animname: [],
			anim: {},
			positions: {
				insane: [0, 0],
				transf: [1, 0],
				transfmic: [2, 0],
				transfmac: [3, 0],
				tfmicspell1: [0, 1],
				tfmicspell2: [1, 1],
				tfmicspell3: [2, 1],
				tfmicspell4: [3, 1],
			}
		};

		this.ai = (this.player) % 2 == 0 && false ? new NeoplexArtificialIntelligence(this, `PLAYER${this.player}`, manager.misc.ai_original) : new ArtificialIntelligence(this, `PLAYER${this.player}`, manager.misc.ai);
		//this.aiBlob = new Neoplex2BlobArtificialIntelligence(this, `PLAYERBLOB${this.player}`, manager.misc.ai_blob_original, manager.misc.ai_blob_functions);
		this.aiFrenzy = new NeoplexStaticFrenzyAI(this, `STATICPLAYER${this.player}`, manager.misc.ai_frenzy)
		this.aiBlob = new Neoplex2BlobArtificialIntelligence(this, `PLAYERBLOB${this.player}`, manager.misc.ai_blob_sapphirus, manager.misc.ai_blob_functions);

		this.unfreezableFieldAnimations = {};
		this.namesUFA = [];

		this.isLosePlayed = false;
		// lose, win, nope, nope, nope
		this.delay = [-9];


		this.delayKeynamesCount = this.delay.length;

		this.animationElements = {};
		this.animationExistingElements = [];
		this.animationTriggerEvents = {};
	}

	playSound(str) {
		if (this.soundActive) {
			let id = sound.play(str);
			let m = sound.getSound(str);
			m.stereo(this.player % 2 == 0 ? 1 : -1, id);
		}
	}

	playVoice(a) {
		if (!this.isVisible || !this.soundActive || !(a in this.character.voices)) return;
		/*for (let b in this.character.voices) {
			this.character.voices[b].stopVoice();
		}*/
		/*if (!this.character.voices[a].checkPlay()) /**/
		if (this.character.voiceActive in this.character.voices) {
			let km = this.character.voices[this.character.voiceActive].getVoice();
			km.stop(this.character.voiceID);
		}
		this.character.voiceActive = a;

		let id = this.character.voices[a].playVoice();
		let m = this.character.voices[a].getVoice();
		this.character.voiceID = id;
		m.stereo(0.4 * (this.player % 2 == 0 ? 1 : -1), id);
	}

	removeVoices() {
		//playerVoiceSystem.removePlayerVoices();
		for (let a in this.character.voices) delete this.character.voices[a]
	}

	getVoiceDuration(a) {
		if (!this.isVisible || !this.soundActive || !(a in this.character.voices)) return 0;

		/*if (!this.character.voices[a].checkPlay()) /**/
		return this.character.voices[a].duration();
	}

	checkVoicePlaying(a) {
		if (!this.isVisible || !this.soundActive || !(a in this.character.voices)) return false;

		/*if (!this.character.voices[a].checkPlay()) /**/
		return this.character.voices[a].checkPlay();
	}

	addDelayHandler(requiresVisibility, delay, func) {
		if (!(this.isVisible) && (requiresVisibility)) return;
		game.addDelayHandler(delay, func);
	}

	affixIDName(name) {
		return `P${this.player}-${name}`;
	}

	editIH(name, value) {
		////console.log(this.getAsset(name))
		ihelem(this.getAsset(name), value);
	}

	assetRect(name) {
		return this.getAsset(name).getBoundingClientRect();
		//HTMLElement.prototype.getBoundingClientRect;
	}

	addParticle(requireVisibility, imgRef, spriteRow, spriteCell, startX, startY, endX, endY, duration, size, clr, bez, trail, topt, rotopt) {
		if (requireVisibility && !this.isVisible) return false;
		particle.addParticle(game.cellSize, imgRef, spriteRow, spriteCell, startX, startY, endX, endY, duration, size, clr, bez, trail, topt, rotopt);
	}

	drawActivePlaycharExt(mx) {
		this.canvasClear("playchar");
		let x = mx || this.playcharExt.positions[this.playcharExt.active];
		////console.log(x)
		this.canvasCtx.playchar.drawImage(
			this.character.canvas,
			x[0] * 600,
			600 * (x[1] + 1),
			600,
			600,
			0,
			0,
			600,
			600
		);
	}

	setActivePlaycharExt(m) {
		this.playcharExt.active = m;
		if (this.isVisible) this.drawActivePlaycharExt(this.playcharExt.positions[m]);
	}

	runDelay() {
		for (let a = 0; a < this.delayKeynamesCount; a++) {
			if (this.delay[a] >= 0) this.delay[a]--;
			//if (this.delay[a] == 0) this.delay[a] = -20;
		}

		if (this.delay[0] == 0) { //lose
			this.playVoice("lose");
			this.engagePlaycharExt("result");
			this.editIH("PLAYCHAR-TEXT", "Oh no...");
			this.isLosePlayed = true;
			this.playEmAnimation("lose");
		}
	}

	getAsset(_id) {
		if (_id in this.htmlElements) return this.htmlElements[this.affixIDName(_id)];
		return id(this.affixIDName(_id));
	}

	setStyle(name, prop, val) {
		////console.log(name)
		styleelem(this.getAsset(name), prop, val);
	}
	styleVariable(name, prop, val) {
		////console.log(name)
		stylepropelem(this.getAsset(name), `--${prop}`, val);
	}
	storeElementsToMemory() {
		this.htmlElements = {};
		this.htmlElements[this.affixIDName("AREA")] = id(`P${this.player}-AREA`);
		for (let y of id(`P${this.player}-AREA`).getElementsByTagName("*")) {
			let { id } = y;
			this.htmlElements[id] = y;
		}

		for (let canvas in this.canvasTemplate) {
			this.canvasses[canvas] = this.getAsset(`${this.canvasTemplate[canvas]}-CANVAS`);
			this.canvasCtx[canvas] = this.canvasses[canvas].getContext("2d");
		}

		this.fieldAnimations = {
			ctComboOpen: new AnimationFrameRenderer(this.getAsset("CLEARTEXT-TEXT-COMBO"), 0, 25, 1000 / 60, {
				name: "cleartext-animation-combo-open",
				timing: "cubic-bezier(0, 0, 1,1)",
			}),

			ctComboClose: new AnimationFrameRenderer(this.getAsset("CLEARTEXT-TEXT-COMBO"), 0, 25, 1000 / 60, {
				name: "cleartext-animation-combo-close",
				timing: "cubic-bezier(0, 0, 1,1)",
			}),


			fieldDown: new AnimationFrameRenderer(this.getAsset("WHOLE"), 0, 70, 1000 / 60, {
				name: "board-fall",
				timing: "cubic-bezier(0,0,1,0)",
			}),
			fieldDownAux: new AnimationFrameRenderer(this.getAsset("AUX-WHOLE"), 0, 70, 1000 / 60, {
				name: "board-fall",
				timing: "cubic-bezier(0,0,1,0)",
			}),
			fieldDownDelayed: new AnimationFrameRenderer(this.getAsset("WHOLE"), 0, 70, 1000 / 60, {
				name: "board-fall",
				timing: "cubic-bezier(0,0,1,0)",
				delay: 30,
			}),

			fieldShake: new AnimationFrameRenderer(this.getAsset("WHOLE"), 0, 15, 1000 / 60, {
				name: "field-shake",
				timing: "linear",
				loop: true,
			}),

			fieldFinisherFinalBlow1: new AnimationFrameRenderer(this.getAsset("ROTATING-WHOLE"), 0, 70, 1000 / 60, {
				name: "board-fallrot-finisher-chain",
				timing: "cubic-bezier(0,0,1,1)",
			}),


			fieldFinisherFinalBlow2: new AnimationFrameRenderer(this.getAsset("WHOLE"), 0, 70, 1000 / 60, {
				name: "board-fall-finisher-chain",
				timing: "cubic-bezier(0,-0.3,1,0)",
			}),
			fieldHitFinish: new AnimationFrameRenderer(this.getAsset("WHOLE"), 0, 65, 1000 / 60, {
				name: "board-hit-finish",
				timing: "cubic-bezier(0,1,1,1)",
			}),

			fieldWobbleRotate: new AnimationFrameRenderer(this.getAsset("ROTATING-WHOLE"), 0, 30, 1000 / 60, {
				name: `board-rotate-wobble`,
				timing: "cubic-bezier(0,0,1,1)",
			}),
			fieldVerticalSpin: new AnimationFrameRenderer(this.getAsset("ROTATING-WHOLE"), 0, 40, 1000 / 60, {
				name: "board-vertical-spin",
				timing: "linear",
			}),
			shakeUponHit: new AnimationFrameRenderer(this.getAsset("WHOLE"), 0, 65, 1000 / 60, {
				name: "shake-upon-hit",
				timing: "cubic-bezier(0,1,1,1)",
			}),
			shakeWMWHit: new AnimationFrameRenderer(this.getAsset("WHOLE"), 0, 3, 1000 / 60, {
				name: "wormhole-shake-hit",
				timing: "linear",
			}),

		};

		this.playcharExt.anim = {
			insaneChar: new AnimationFrameRenderer(this.getAsset("PLAYCHAR-CANVAS-DIV"), 0, 50, 1000 / 60, {
				name: "insane-entrance-character",
				timing: "cubic-bezier(0,0,1,1)",
			}),
			insaneText: new AnimationFrameRenderer(this.getAsset("PLAYCHAR-TEXT-DIV"), 0, 50, 1000 / 60, {
				name: "insane-entrance-text",
				timing: "cubic-bezier(0,0,1,1)",
			}),
			transformChar: new AnimationFrameRenderer(this.getAsset("PLAYCHAR-CANVAS-DIV"), 0, 100, 1000 / 60, {
				name: "insane-entrance-character",
				timing: "cubic-bezier(0,0,1,1)",
			}),
			transformCSpell: new AnimationFrameRenderer(this.getAsset("PLAYCHAR-CANVAS-DIV"), 0, 90, 1000 / 60, {
				name: "transformation-spell-character",
				timing: "cubic-bezier(0,0,1,1)",
			}),
			resultText: new AnimationFrameRenderer(this.getAsset("PLAYCHAR-TEXT-DIV"), 0, 20, 1000 / 60, {
				name: "playchar-text-down",
				timing: "cubic-bezier(0,0,1,1)",
			}),

		}

		this.playcharExt.animname = [];
		for (let mmm in this.playcharExt.anim) {
			this.playcharExt.animname.push(mmm);
		}

		this.animFieldNames = [];
		for (let mmm in this.fieldAnimations) {
			this.animFieldNames.push(mmm);
		}

		this.unfreezableFieldAnimations.swapMain = new AnimationFrameRenderer(this.getAsset("FIELD-DYNAMIC"), 0, 40, 1000 / 60, {
			name: "plain-translate-scale",
			timing: "cubic-bezier(1,1,0,1)",
		});
		this.unfreezableFieldAnimations.swapAux = new AnimationFrameRenderer(this.getAsset("AUX-FIELD"), 0, 40, 1000 / 60, {
			name: "plain-translate-scale",
			timing: "cubic-bezier(1,0,0,1)",
		});

		for (let mmm in this.unfreezableFieldAnimations) {
			this.namesUFA.push(mmm);
		}

		this.clearText.tspin.initialize(this.canvasCtx.tspin);
		this.rectanim.fetchCtx(this.canvasCtx.rectanim);
		this.rpgAttr.fetchAsset(this.canvasses.hpmeter, this.canvasCtx.hpmeter, this.getAsset("HP-NUM-TEXT"));

	}

	setCanvasSize(c, w, h) {
		this.canvasses[c].width = w;
		this.canvasses[c].height = h;
	}


	loadCharacter(char, ver) {
		this.character.char = char;
		this.character.ver = ver;
		//return new Promise(async (res) => {
		let num = `/assets/characters/${char}/${ver}`;
		if (this.character.current !== num) {
			this.character.current = num;
			this.character.active = false;
			this.character.load = false;

			this.character.loadable = true;
			this.removeVoices();
			//this.character.isCounting = false;

			this.character.ctx.clearRect(0, 0,
				this.character.canvas.width,
				this.character.canvas.height
			);

			for (let w = 0; w < 16; w++) {
				this.character.blob.dropset[w] = this.DEFAULT_DROPSET[w];
			}

			for (let w = 0; w < 24; w++) {
				this.character.blob.feverPower[w] = this.DEFAULT_CHAIN_FEVER_POWER_PRESET[w];
			}

			for (let w = 0; w < 24; w++) {
				this.character.blob.chainPower[w] = this.DEFAULT_CHAIN_POWER_PRESET[w];
			}

			this.character.isCounting = false;

			this.character.loadedJson = false;

			//this.resetEmAnimation();

			//let mainDir = num;
			load(`${num}/init.json`).then((jsonString) => {
				////console.log(jsonString)
				this.character.jsonString = jsonString;
				this.character.loadedJson = true;
				this.character.json = JSON.parse(jsonString);


			});

			return true;
		}
		return false;
		//res();
		//});
	}

	cleanAssets() {

	}

	loadAssets() {
		return new Promise(async (res, rej) => {
			if (!this.character.load && this.character.loadable) {
				let json = (this.character.json);
				let num = `/assets/characters/${this.character.char}/${this.character.ver}`;
				let mainDir = num;
				let storage = {};
				let rawstore = {};
				this.character.loadable = false;

				let voiceURLs = json.sources.voice;
				let imageURLs = json.sources.image;
				let imageMains = json.init.image;

				for (let file in imageURLs) {
					let ref = `${mainDir}/${imageURLs[file]}`;
					storage[file] = ref;
				}

				for (let file in imageMains) {
					rawstore[`image_${file}`] = await loadImage(storage[imageMains[file].src]);
				}
				for (let file in json.init.spellImage) {
					rawstore[`image_spell_${file}`] = await loadImage(storage[json.init.spellImage[file]]);
				}

				////console.log(num, rawstore)

				let ysh = ["normal", "warning"];

				for (let flf = 0; flf < ysh.length; flf++) {
					let ym = ysh[flf];
					this.character.ctx.drawImage(rawstore[`image_${ym}`], 300 * flf, 0, 300, 600);
				}


				/*let normal = await loadImage(storage.image_normal);
				let warning = await loadImage(storage.image_warning);*/
				/*let insane = await loadImage(storage.image_fever);
				
				let transf = await loadImage(storage.image_transform);
				let transfmic = await loadImage(storage.image_transform_micro);*/
				let hh = Object.keys(this.playcharExt.positions);
				for (let fll = 0; fll < hh.length; fll++) {
					if (hh[fll] in imageMains) {
						let ym = this.playcharExt.positions[hh[fll]];
						//let tr = await loadImage(storage[hh[fll]]);
						////console.log(hh[fll], rawstore[hh[fll]])
						this.character.ctx.drawImage(rawstore[`image_${hh[fll]}`], 600 * ym[0], 600 * (1 + ym[1]), 600, 600);


					}
				}

				if ("main" in json.init) {
					for (let mas in this.character.attributes)
						if (mas in json.init.main.attributes) {
							this.character.attributes[mas] = json.init.main.attributes[mas];
						} else this.character.attributes[mas] = this.character.defaultAttributes[mas];

					if ("chainPower" in json.init.main) {
						for (let w = 0; w < 24; w++) {
							this.character.blob.chainPower[w] = json.init.main.chainPower[w];
							if (json.init.main.chainPower[w] === null) this.character.blob.chainPower[w] = this.DEFAULT_CHAIN_POWER_PRESET[w];
						}
					} else {
						for (let w = 0; w < 24; w++) {
							this.character.blob.chainPower[w] = this.DEFAULT_CHAIN_POWER_PRESET[w];
						}
					}


					if ("feverPower" in json.init.main) {
						for (let w = 0; w < 24; w++) {
							this.character.blob.feverPower[w] = json.init.main.feverPower[w];
							if (json.init.main.feverPower[w] === null) this.character.blob.feverPower[w] = this.DEFAULT_CHAIN_FEVER_POWER_PRESET[w];

						}
					} else {
						for (let w = 0; w < 24; w++) {
							this.character.blob.feverPower[w] = this.DEFAULT_CHAIN_FEVER_POWER_PRESET[w];
						}
					}

					if ("dropset" in json.init.main) {
						for (let w = 0; w < 16; w++) {
							this.character.blob.dropset[w] = json.init.main.dropset[w];
							if (json.init.main.dropset[w] === null) this.character.blob.dropset[w] = this.DEFAULT_DROPSET[w];

						}
					} else {
						for (let w = 0; w < 16; w++) {
							this.character.blob.dropset[w] = this.DEFAULT_DROPSET[w];
						}
					}

					if ("counting" in json.init.main) this.character.isCounting = json.init.main.counting;

					////console.log(this.character.blob)
				}

				this.animationLayerElements.length = 0;
				this.animationTriggerEvents = {};

				if ("animation" in json.init) {
					let anim = json.init.animation;
					for (let asset in anim.sources) {
						let mm = anim.sources[asset];
						let imagus = await loadImage(storage[mm.src]);
						animatedLayers.loadOffline(this.getCanvasAnimationLoadedName(asset), imagus,
							anim.sources[asset].width,
							anim.sources[asset].height
						);

						this.animationElements[asset] = {
							width: mm.width,
							height: mm.height,
							frameWidth: mm.framewidth,
							frameHeight: mm.frameheight,
							aspectWidth: mm.aspectwidth,
							aspectHeight: mm.aspectheight,
							csMult: mm.cellsizemult,
							frameBound: mm.xbound,
							src: mm.src,
							id: asset,
							opacity: "opacity" in mm ? mm.opacity : 1
						};






					}

					for (let name in anim.triggers) {
						let mn = anim.triggers[name];
						this.animationTriggerEvents[name] = {};
						for (let nn in mn) {
							this.animationTriggerEvents[name][nn] = [];
							for (let no of mn[nn]) {
								this.animationTriggerEvents[name][nn].push(no);
								if (no.action == "createAnimLayer") {
									if (no.targetid) {
										////console.log(no.targetid);

										this.animationLayerElements.push((no.targetid));
									}
								}
							}
						}
					}

					////console.log(this.animationTriggerEvents)

				}

				{
					let arr = [];
					let srcArr = [];

					/*for (let u = 1; u <= 5; u++) {
					 arr.push(`init${u}`);
					 arr.push(`spell${u}`);
					}

					arr.push("damage1");
					arr.push("damage2");
					arr.push("counterattack");
					arr.push("gtris");
					arr.push("gtrisplus");
					arr.push("insane");
					arr.push("insane_success");
					arr.push("daihenshin")
					arr.push("zenkeshi");
					arr.push("insane_fail");
					arr.push("win");
					arr.push("lose");

					for (let u = 1; u <= 2; u++) {
					 arr.push(`wormhole_inflict${u}`);
					 arr.push(`wormhole_damage${u}`);
					}
					arr.push(`wormhole_win`);
					arr.push(`wormhole_lose`);
					arr.push(`wormhole_enter`);/**/

					for (let h in json.init.voice) {
						arr.push(json.init.voice[h]);
					}

					for (let qi of arr) {
						if (qi in json.init.voice) srcArr.push(voiceURLs[json.init.voice[qi]]);
					}

					////console.log(voiceURLs)/**/
					if (Object.keys(json.init.voice).length > 0) {
						await playerVoiceSystem.batchLoad(json.base, json.version, srcArr);
					}

					//////console.log(json.init.voice)
					for (let hh in json.init.voice) {
						this.character.voices[hh] = new PlayerVoice(json.base, json.version, voiceURLs[json.init.voice[hh]]);
					}
					////console.log(this.character.voices)

					//this.character.voices.spell5.playVoice();
				}

				if ("spellImage" in json.init) {
					let array = [];
					////console.log(json.init)

					for (let uuu in json.init.spellImage)
						if (`image_spell_${json.init.spellImage[uuu]}` in rawstore) {
							array.push({
								a: rawstore[`image_spell_${json.init.spellImage[uuu]}`],
								s: uuu
							});
						}
					this.rectanim.load(array);
				}

				this.character.active = true;
				this.character.load = true;
				res();
				this.drawCharacterBg(0);
				return;
			} else res()
		});
	}

	changeBodyColorRGB(r, g, b) {
		this.color.r = r,
			this.color.g = g,
			this.color.b = b;
		for (let bi of ["BORDER-BLOCK", "BORDER-BLOB-1", "BORDER-BLOB-2"]) {
			this.setStyle(bi, "fill", `rgba(${r - 20},${g - 20},${b - 20},0.5)`);
			this.setStyle(bi, "stroke", `rgba(${r - 10},${g - 10},${b - 10},0.8)`);
		}

		for (let bi of ["NAMEPLATE-DIV"]) {
			this.setStyle(bi, "background", `rgb(${r - 80},${g - 80},${b - 80})`);
			this.setStyle(bi, "border-color", `rgb(${r - 10},${g - 10},${b - 10})`);
		}

		for (let gt = 1; gt <= 2; gt++) {
			this.setStyle(`BLOB-NEXT-BG-${gt}`, "fill", `rgba(${r - 10},${g - 10},${b - 10},0.5)`);
			this.setStyle(`BLOB-NEXT-BG-${gt}`, "stroke", `rgba(${Math.min(255, r + 100)},${Math.min(255, g + 100)},${Math.min(255, b + 100)},0.8)`);
		}
	}

	changeBodyColorHex(hex) {
		let a = hexToRGB(~~hex);
		this.changeBodyColorRGB(a.r, a.g, a.b);
	}

	getCanvasAnimationLoadedName(obj) {
		return `ANIM||${this.character.char}||${this.character.ver}||${obj}`;
	}



	canvasClear(ctx) {
		let a = this.canvasses[ctx];
		this.canvasCtx[ctx].clearRect(0, 0, a.width, a.height);
	}

	engageCleartextTSpin(visible, type, line) {
		if (type !== null) this.clearText.tspin.exec(type);
		if (line !== void 0) this.editIH("CLEARTEXT-TSPIN-LINE-TEXT", line);
		this.clearText.tspinLine.assign(2);
		this.clearText.tspinLine.assign(1);
		if (visible !== void 0) {
			let e = "CLEARTEXT-CANVTEXT";
			let element = this.getAsset(e);
			this.setStyle(e, "animation-name", "none");
			this.setStyle(e, "animation-duration", `${~~((1000 / 60) * (60 + 36))}ms`);
			this.setStyle(e, "animation-timing-function", "linear");
			//this.setStyle(e, "animation-play-state", "pausef!important");
			element.offsetHeight;
			if (type == 0) {
				this.setStyle(e, "animation-name", "tspin-div-glow-regular");
			}
			if (type == 1) {
				this.setStyle(e, "animation-name", "tspin-div-glow-mini");
			}
		}
	}

	engageCleartext(type, visible, text, color) {
		let e = "",
			obj = "";
		switch (type) {
			case "b2b": {
				e = "CLEARTEXT-TEXT-B2B";
				obj = "b2b";
				break;
			}
			case "line": {
				e = "CLEARTEXT-TEXT-LINE";
				obj = "line";
				break;
			}
			case "spin": {
				e = "CLEARTEXT-TEXT-SPIN";
				obj = "spin";
				break;
			}
		}
		this.editIH(e, text);
		this.clearText[obj].assign(0);
		if (visible) {
			this.clearText[obj].assign(1);
		}
	}

	engageCleartextCombo(visible, toggle, text, color) {
		let e = "CLEARTEXT-TEXT-COMBO",
			obj = "combo";

		if (text) this.editIH(e, text);

		this.clearText[obj].assign(toggle);

	}

	engagePlaycharExt(type, name) {
		for (let h = 0, m = this.playcharExt.animname.length; h < m; h++)
			this.playcharExt.anim[this.playcharExt.animname[h]].reset();
		this.setStyle("PLAYCHAR-CANVAS-DIV", "opacity", "0%");
		this.setStyle("PLAYCHAR-TEXT-DIV", "opacity", "0%");
		switch (type) {
			case "insane": {
				this.playcharExt.anim.insaneChar.play();
				this.playcharExt.anim.insaneText.play();
				this.setActivePlaycharExt(name || "insane");
				break;
			}

			case "result": {

				this.playcharExt.anim.resultText.play();
				this.setStyle("PLAYCHAR-TEXT-DIV", "opacity", "100%");
				break;

			}

			case "insaneTransform": {
				this.playcharExt.anim.transformChar.play();
				this.playcharExt.anim.insaneText.play();
				this.setActivePlaycharExt(name || "transf");
				break;
			}

			case "insaneTransformSpell": {
				this.playcharExt.anim.transformCSpell.play();
				this.setActivePlaycharExt(name || "tfmicspell1");
				break;
			}
		}
	}



}

class InsaneMode {
	constructor(type, parent) {
		this.time = 60;
		this.maxTime = 150 * 60;
		this.isUnlimited = true;
		this.isCommandedEnd = false
		this.preset = {
			blob: game.presets.blobNormal,
			microBlob: game.presets.blobMicro,
			block: game.presets.blockNormal,
			block2: game.presets.blockJavaScriptus
		};
		this.henshinTypes = 2;
		this.status = "n";
		this.initialStart = false;
		this.initialStartHenshin = false;
		this.insaneType = 0;
		this.requireChain = -3;
		this.insaneModeCount = 0;
		this.blocks = {
			phase: 5,
			requireLine: -9,
			seq: 0,
			type: 0
		};
		this.combo = 0;
		this.isExtra = true;
		this.fixedHenshinType = 2;
		////console.log(this.preset);
		this.parent = parent;
		this.type = type;
		//this.maxTime = this.time;
		this.isOn = false;
		this.isTime = false;
		this.isDelay = false;
		this.transEntTime = 0;
		this.memory = {
			preview: [],
			stack: [[]],
			combo: 0,
			b2b: 0,
			hold: void 0

		};
		this.delay = {
			ready: -30,
			in: -33,
			turningOff: -30,
			out: -30,
			del: -50,
			readyHenshin: -48,
		};
		this.delayOrder = ["ready", "readyHenshin", "in", "turningOff", "out", "del"];
		this.defaultDelays = {};
		this.chainScore = 0;
		this.customDelays = {};
		this.timeAdditions = {
			minChain: 2,
			timeAddMult: 0.5,
			allClear: 5,
			fixedTimeAdd: 2,
		};
		this.rng = new ParkMillerPRNG();
		for (let h in this.delay) {
			this.defaultDelays[h] = this.delay[h];
		}
	}

	setMemory(setload, stack, prev, combo, b2b, hold) {
		let a;
		switch (setload) {
			case "load": {
				a = {
					preview: this.memory.preview,
					stack: this.memory.stack,
					combo: this.memory.combo,
					b2b: this.memory.b2b,
					hold: this.memory.hold
				}
				break;
			}

			case "save": {
				this.memory.stack = stack;
				this.memory.preview = prev;
				this.memory.combo = combo;
				this.memory.b2b = b2b;
				this.memory.hold = hold;
				break;
			}

			case "reset": {
				this.memory = {
					preview: [],
					stack: [[]],
					combo: 0,
					b2b: 0,
					hold: void 0
				};
			}
		}
		return a;
	}
	load() {
		this.background.canvas = this.parent.parent.canvasses.character;
		this.background.ctx = this.parent.parent.canvasCtx.character;
	}
	update() {
		if (this.isTime && !this.isUnlimited) this.time--;

		if (this.isOn) {
			this.parent.parent.insaneBg.draw();
			this.parent.parent.editIH("INSANE-TIMER", this.isUnlimited ? "" : Math.max(Math.floor(this.time / 60), 0));
			if (this.time <= 5 * game.FPS && this.time >= 0) {
				if ((this.time % game.FPS) == 0 && this.time > 0) this.parent.parent.playSound("timer2_1");
				if (this.time == 0) {
					this.time = -90;
					this.parent.parent.playSound("timer_zero");
				}
			}
		}
	}

	reset() {
		for (let h in this.defaultDelays) {
			this.delay[h] = -99; //this.defaultDelays[h];
		}
		this.toggle(false);
		this.isTime = false;
		this.insaneModeCount = 0;
		this.time = -1;
		this.setMemory("reset");
		this.transEntTime = -4;
		this.blocks.requireLine = -9;
		this.blocks.phase = 1;
		this.blocks.seq = 0;
		this.parent.parent.editIH("INSANE-TIMER", "");

	}

	updateDelays() {

		let isDelay = false;
		for (let h of this.delayOrder) {
			if (this.delay[h] >= 0) {
				this.delay[h]--;
				isDelay = true;
				break;
			}
		}

		if (this.delay.readyHenshin == 0) {
			this.parent.parent.editIH("PLAYCHAR-TEXT", "Transform!");
			this.delay.in = 40;
			this.parent.delay[0] = 30;
			this.insaneType = 1 + ~~(this.rng.next() * this.henshinTypes);
			if (this.fixedHenshinType > 0) {
				this.insaneType = this.fixedHenshinType;
			}
			this.parent.parent.playAnimation("fieldVerticalSpin");
			this.parent.parent.engagePlaycharExt("insaneTransform");
			if (this.insaneModeCount == 0) this.parent.parent.playVoice("daihenshin");
			this.insaneModeCount++;
			this.transEntTime = 40 + 30;
		}
		if (this.transEntTime >= 0) {
			this.transEntTime--;
			if (this.delay.in < 20) this.delay.in = 3;

			if (this.transEntTime == 35) {

				this.parent.parent.playcharExt.anim.insaneText.play();
				this.parent.parent.setActivePlaycharExt(["transfmac", "transfmic"][this.insaneType - 1]);
				this.parent.parent.editIH("PLAYCHAR-TEXT", `Enhancement: ${["Macro", "Micro"][this.insaneType - 1]}`);
			}
			this.parent.parent.drawActivePlaycharExt();
			let cctx = this.parent.parent.canvasCtx.playchar;
			let hm = 0;

			if (this.transEntTime >= 35 && this.transEntTime <= 55) {
				hm = Math.min((55 - this.transEntTime), 20) / 20;
			}
			if (this.transEntTime < 35 && this.transEntTime >= 15) {
				hm = Math.min(this.transEntTime - 15, 20) / 25;
			}
			cctx.fillStyle = `rgba(255,255,255,${hm}`;

			//cctx.globalAlpha = hm;
			cctx.globalCompositeOperation = "source-atop";
			cctx.fillRect(0, 0, 600, 600);
			cctx.globalCompositeOperation = "source-over";
			cctx.globalAlpha = 1;


			if (this.transEntTime == 0) {

			}
		}

		if (this.delay.ready == 0) {
			this.delay.in = 40;
			this.parent.delay[0] = 30;
			this.insaneType = 0;
			this.parent.parent.playAnimation("fieldVerticalSpin");
			this.parent.parent.engagePlaycharExt("insane");
			if (this.insaneModeCount == 0) this.parent.parent.playVoice("insane");
			this.insaneModeCount++;
			if (this.type == "blob") {
				this.parent.parent.editIH("PLAYCHAR-TEXT", `Enhancement: Fever`);

			}
			if (this.type == "block") {
				this.parent.parent.editIH("PLAYCHAR-TEXT", `Enhancement: Frenzy`);

			}
			this.parent.parent.engageCleartext("b2b", false, "");
			this.parent.parent.engageCleartextCombo(false, 0, "");
		}

		if (this.delay.in == 20) {
			//this.delay.in = 50;
			this.parent.parent.playSound("insane");

			if (this.parent.parent.feverStat.isOn) {
				this.parent.parent.feverStat.playColored(true);
				if (this.parent.parent.feverStat.isUseTimer) this.maxTime = this.parent.parent.feverStat.time;
			}
			//this.parent.delay[0] = 30;
			this.toggle(true);
			this.parent.parent.insaneBg.type = this.insaneType > 0 ? 3 : 0;
			this.parent.parent.insaneBg.changeColorCustom(66, 66, 66);

			if (this.type == "block") this.parent.parent.insaneBg.type = 2;
			if (this.type == "blob") {
				let stack = JSON.parse(JSON.stringify(this.parent.stack)),
					prev = JSON.parse(JSON.stringify(this.parent.preview.queue)),
					combo = 0,
					b2b = 0,
					hold = 0;
				this.setMemory("save", stack, prev, combo, b2b, hold);
				//this.toggle(true);

				if (this.insaneType == 0) {
					this.parent.fieldSize.w = 6;
					this.parent.fieldSize.hh = 30;
					this.parent.fieldSize.vh = 12;
					this.parent.fieldSize.h = this.parent.fieldSize.vh + this.parent.fieldSize.hh;
					this.parent.blobRequire = 4;
					this.parent.stack = grid(this.parent.fieldSize.w, this.parent.fieldSize.h, 0);
					/*this.parent.drawableStack = grid(this.parent.fieldSize.w, this.parent.fieldSize.h, 0);
					this.parent.poppedSstack = grid(this.parent.fieldSize.w, this.parent.fieldSize.h, 0);*/

					this.parent.drawStack(this.parent.stack);
				}
				if (this.insaneType == 1) {
					this.parent.fieldSize.w = 3;
					this.parent.fieldSize.hh = 30;
					this.parent.fieldSize.vh = 6;
					this.parent.fieldSize.h = this.parent.fieldSize.vh + this.parent.fieldSize.hh;
					this.parent.blobRequire = 3;
					this.parent.stack = grid(this.parent.fieldSize.w, this.parent.fieldSize.h, 0);
					/*this.parent.drawableStack = grid(this.parent.fieldSize.w, this.parent.fieldSize.h, 0);
					this.parent.poppedSstack = grid(this.parent.fieldSize.w, this.parent.fieldSize.h, 0);*/

					this.parent.drawStack(this.parent.stack);
				}
				if (this.insaneType == 2) {
					this.parent.fieldSize.w = 10;
					this.parent.fieldSize.hh = 30;
					this.parent.fieldSize.vh = 20;
					this.parent.fieldSize.h = this.parent.fieldSize.vh + this.parent.fieldSize.hh;
					this.parent.blobRequire = 4;
					this.parent.stack = grid(this.parent.fieldSize.w, this.parent.fieldSize.h, 0);
					/*this.parent.drawableStack = grid(this.parent.fieldSize.w, this.parent.fieldSize.h, 0);
					this.parent.poppedSstack = grid(this.parent.fieldSize.w, this.parent.fieldSize.h, 0);*/

					this.parent.drawStack(this.parent.stack);
				}

			}

			this.parent.parent.conclude1v1Overhead(3);


			this.parent.parent.switchGarbageBehind(true);
			this.time = this.maxTime;
			this.time += 1 * 60;



			//this.parent.parent.playAnimation("fieldVerticalSpin");
			if (this.type == "block") {

				let stack = JSON.parse(JSON.stringify(this.parent.stack)),
					prev = JSON.parse(JSON.stringify(this.parent.preview.queue)),
					combo = this.parent.combo,
					b2b = this.parent.b2b,
					hold = this.parent.piece.hold;
				this.setMemory("save", stack, prev, combo, b2b, hold);
				//this.toggle(true);
				if (this.insaneType == 0) {
					this.parent.fieldSize.w = 10;
					this.parent.fieldSize.hh = 20;
					this.parent.fieldSize.vh = 20;
					this.parent.piece.holdable = false;
					this.parent.holdShow(false);
					this.parent.fieldSize.h = this.parent.fieldSize.vh + this.parent.fieldSize.hh;
					//this.parent.blobRequire = 4;
					this.parent.stack = grid(this.parent.fieldSize.w, this.parent.fieldSize.h, 0);
					/*this.parent.drawableStack = grid(this.parent.fieldSize.w, this.parent.fieldSize.h, 0);
					this.parent.poppedSstack = grid(this.parent.fieldSize.w, this.parent.fieldSize.h, 0);*/

					this.parent.drawStack(this.parent.stack);
				}
			}


		}

		if (this.delay.in == 0) {
			this.isTime = true;
			if (this.type == "blob") {
				if (this.insaneType == 0) {
					this.delay.del = 10;
					this.status = "start";

				}
				if (this.insaneType == 2) {
					//phase 22 is a 30-chain (MAX)
					this.microBlobToField(8 - 8, true);
				}
			}
			if (this.type === "block") {
				if (this.insaneType === 0) {
					//this.blockToField(0, 0,0,0);
					this.delay.del = 10;
					this.status = "start";
				}
			}
		}

		if (this.delay.del == 0) {
			if (this.status === "success") {
				if (this.type == "blob") {
					if (this.insaneType === 0) {
						this.blobToField(Math.max(0, Math.min(this.parent.parent.feverStat.presetChain, 15 - 2)), this.isExtra);
					}
					if (this.insaneType === 2) {
						let sum = Math.min(this.chainScore + 2, 30);

						this.microBlobToField(sum - 8, true);
					}
				}
				if (this.type == "block") {
					this.blocks.seq = 0;
					this.parent.parent.insaneBg.moveEye(this.parent.fieldSize.w / 2, this.parent.fieldSize.vh / 2, true);

					if (this.insaneType === 0) {
						////console.log(`FAILED, ${this.requireChain}-chain is required, but a ${this.parent.previousChain}-chain is made.`)
						this.blocks.phase++;

						this.blockToField(Math.min(13, this.blocks.phase), this.rng.next(), this.rng.next(), this.rng.next());
					}
					if (this.insaneType === 1) {

					}
				}
			}
			if (this.status === "fail") {
				if (this.type == "blob") {
					if (this.insaneType === 0) {
						////console.log(`FAILED, ${this.requireChain}-chain is required, but a ${this.parent.previousChain}-chain is made.`)

						this.blobToField(Math.max(0, Math.min(this.parent.parent.feverStat.presetChain, 15 - 2)), this.isExtra);
					}
					if (this.insaneType === 2) {
						////console.log(`FAILED, ${this.requireChain}-chain is required, but a ${this.parent.previousChain}-chain is made.`)
						let difference = Math.max(8, this.requireChain - Math.min(2, this.requireChain - this.chainScore - 2))
						this.microBlobToField(difference - 8, true);
					}
				}
				if (this.type == "block") {
					this.blocks.seq = 0;
					this.parent.parent.insaneBg.moveEye(this.parent.fieldSize.w / 2, this.parent.fieldSize.vh / 2, true);

					if (this.insaneType === 0) {
						////console.log(`FAILED, ${this.requireChain}-chain is required, but a ${this.parent.previousChain}-chain is made.`)
						this.blockToField(Math.min(13, this.blocks.phase), this.rng.next(), this.rng.next(), this.rng.next());
					}
					if (this.insaneType === 1) {

					}
				}

			}
			if (this.status === "start") {
				if (this.type == "blob") {
					this.blobToField(Math.max(0, Math.min(this.parent.parent.feverStat.presetChain, 15 - 2)), this.isExtra);
				}
				if (this.type == "block") {
					this.blocks.seq = 0;

					if (this.insaneType === 0) {
						this.parent.parent.insaneBg.moveEye(this.parent.fieldSize.w / 2, this.parent.fieldSize.vh / 2, true);

						////console.log(`FAILED, ${this.requireChain}-chain is required, but a ${this.parent.previousChain}-chain is made.`)
						this.blocks.phase = 0;
						this.blockToField(Math.min(13, this.blocks.phase), this.rng.next(), this.rng.next(), this.rng.next());
					}
					if (this.insaneType === 1) {

					}
				}
			}

		}

		if (this.delay.turningOff == 0) {
			for (let h of this.delayOrder) {
				if (this.delay[h] >= 0) {
					this.delay[h] = -99;

				}

			}

			this.delay.out = 40;
			this.parent.delay[0] = 30;

			this.isCommandedEnd = false;

			this.parent.parent.playAnimation("fieldVerticalSpin");
			//this.parent.parent.engagePlaycharExt("insane");
		}

		if (this.delay.out == 20) {
			//this.delay.in = 50;
			this.parent.parent.playSound("swap_swap");
			/*if (this.parent.isAllClearTemp) {
				this.parent.isAllClearTemp = false;
				this.parent.playAllClearAnim(2);
			}*/
			//this.parent.delay[0] = 30;
			this.toggle(false);
			if (this.parent.parent.feverStat.isOn) {
				this.parent.parent.feverStat.reset();
			}
			this.parent.parent.canvasClear("insane");
			this.parent.parent.switchGarbageBehind(false);

			//this.parent.parent.playAnimation("fieldVerticalSpin");
			if (this.type == "blob") {
				if (this.insaneType == 1 || this.insaneType == 2) {

					this.parent.fieldSize.w = 6;
					this.parent.fieldSize.hh = 30 * 1;
					this.parent.fieldSize.vh = 12;
					this.parent.fieldSize.h = this.parent.fieldSize.vh + this.parent.fieldSize.hh;
					this.parent.blobRequire = 4;
				}



				let ma = this.setMemory("load");
				this.parent.stack = grid(this.parent.fieldSize.w, this.parent.fieldSize.h, 0);
				for (let x = 0; x < this.parent.fieldSize.w; x++) {
					for (let y = 0; y < this.parent.fieldSize.h; y++) {
						this.parent.stack[x][y] = ma.stack[x][y];
					}
				}
				this.parent.setDelay(1, this.parent.parent.isInsaneModeOnly ? -19 : 5);
				this.parent.setDelay(0, this.parent.parent.isInsaneModeOnly ? -19 : 5);
				this.parent.drawStack(this.parent.stack);
				this.parent.canFallTrash = false;
				
				this.parent.blobCount = this.parent.checkBlobCount(this.parent.stack);

			}
			if (this.type == "block") {
				if (this.insaneType == 1 || this.insaneType == 2) {

					this.parent.fieldSize.w = 6;
					this.parent.fieldSize.hh = 30 * 1;
					this.parent.fieldSize.vh = 12;
					this.parent.fieldSize.h = this.parent.fieldSize.vh + this.parent.fieldSize.hh;
					this.parent.blobRequire = 4;
				}



				let ma = this.setMemory("load");
				this.parent.stack = grid(this.parent.fieldSize.w, this.parent.fieldSize.h, 0);
				for (let x = 0; x < this.parent.fieldSize.w; x++) {
					for (let y = 0; y < this.parent.fieldSize.h; y++) {
						this.parent.stack[x][y] = ma.stack[x][y];
					}
				}
				this.parent.previewModify(ma.preview, 1);
				this.parent.setDelay(1, this.parent.parent.isInsaneModeOnly ? -19 : 5);
				this.parent.setDelay(0, this.parent.parent.isInsaneModeOnly ? -19 : 5);
				this.parent.drawStack(this.parent.stack);
				this.parent.holdShow(this.parent.piece.defaultHoldable);
				this.parent.checkStackAltitude();


			}
			
			this.parent.parent.engageCleartext("b2b", false, "");
			this.parent.parent.engageCleartextCombo(false, 0, "");
		}

		if (this.delay.out == 0) {
			this.isTime = false;
			this.parent.parent.editIH("INSANE-TIMER", "");
			
			
			
			if (this.type == "blob" && this.parent.canFallTrashAfterFever) {
				this.parent.dropGarbage();
			}

			/*if (this.type == "blob") {
			 this.blobToField(2, true);
			}*/
		}


		return isDelay;
	}

	blobToField(phase, isExtra, doesNotRequireChain) {
		let m = ~~(this.rng.next() * 6),
			c = 0;
		let colors = this.parent.colors;
		let colorSet = [];
		for (let i = 0; i < colors; i++) colorSet.push(this.parent.colorSet[i]);

		for (let i = 0; i < colorSet.length - 1; i++)
		{
			var temp = colorSet[i];
			var rand = ~~((colorSet.length - i) * this.rng.next()) + i;
			colorSet[i] = colorSet[rand];
			colorSet[rand] = temp;
		};
		colorSet.unshift(0);

		let a = this.preset.blob[phase][colors - 3][m];
		////console.log(this.preset.blob[phase][colors - 3][m])

		let tempGrid = this.#checkInstantDrop(a.grid, a.grid.length, a.grid[0].length);

		let grid = [];

		for (let x = 0, l = tempGrid.length; x < l; x++) {
			grid[x] = [];
			for (let y = 0, w = tempGrid[x].length; y < w; y++) {
				let lm = tempGrid[x][y];
				if (lm > 15 && isExtra) lm -= 16;
				else if (lm > 15) lm = 0;
				grid[x][y] = colorSet[lm];
			}
		}


		this.parent.replaceField(grid, this.rng.next() > 0.5, !this.isOn);
		if (!doesNotRequireChain) this.requireChain = a.require;
	}
	microBlobToField(phase, isExtra) {
		let m = ~~(this.rng.next() * 4), // 4 is default
			c = 0;
		let colors = this.parent.colors;
		let colorSet = [];
		for (let i = 0; i < colors; i++) colorSet.push(this.parent.colorSet[i]);

		for (let i = 0; i < colorSet.length - 1; i++) {
			var temp = colorSet[i];
			var rand = ~~((colorSet.length - i) * this.rng.next()) + i;
			colorSet[i] = colorSet[rand];
			colorSet[rand] = temp;
		};
		colorSet.unshift(0);

		let a = this.preset.microBlob[phase][colors - 3][m];
		////console.log(this.preset.blob[phase][colors - 3][m])

		let tempGrid = this.#checkInstantDrop(a.grid, a.grid.length, a.grid[0].length);

		let grid = [];

		for (let x = 0, l = tempGrid.length; x < l; x++) {
			grid[x] = [];
			for (let y = 0, w = tempGrid[x].length; y < w; y++) {
				let lm = tempGrid[x][y];
				if (lm > 15 && isExtra) lm -= 16;
				else if (lm > 15) lm = 0;
				if (lm > 0) grid[x][y] = colorSet[lm];
				else grid[x][y] = 0;
			}
		}


		this.parent.replaceField(grid, this.rng.next() > 0.5, true);
		this.requireChain = a.require;
		////console.log(phase, colors - 3, m)
	}

	blockToField(phase, a, b, c) {
		//this.blocks.type = ~~(this.rng.next()*2);
		let base = this.preset.block;
		let aA = Math.floor(a * 7),
			bB = Math.floor(b * 3),
			cC = Math.floor(c * 2);

		if (this.blocks.type == 1) {
			base = this.preset.block2;
			aA = Math.floor(a * 6),
				bB = Math.floor(b * 2),
				cC = Math.floor(c * 2);
		}

		////console.log(this.preset.block)
		let mPhase = 0;
		if (phase >= 4) mPhase++;
		if (phase >= 7) mPhase++;
		if (phase >= 10) mPhase++;
		if (phase >= 13) mPhase++;
		let m = base[mPhase][aA][bB][cC];
		////console.log(m)
		////console.log(this.preset.blob[phase][colors - 3][m])
		let tempGrid = m.grid;

		let grid = [];

		for (let x = 0, l = tempGrid.length; x < l; x++) {
			grid[x] = [];
			for (let y = 0, w = tempGrid[x].length; y < w; y++) {
				let lm = tempGrid[x][y];
				/*if (lm > 15 && isExtra) lm -= 16;
				else if (lm > 15) lm = 0;*/
				if (lm > 0) grid[x][y] = tempGrid[x][y];
				else grid[x][y] = 0;
			}
		}
		////console.log(aA, bB, cC)


		this.parent.modifyGrid(this.parent.fieldSize.hh - (this.blocks.type == 1 ? 2 : 0), grid, this.blocks.type == 60 && cC < 1, false, true);
		this.blocks.requireLine = m.require;
		this.parent.previewModify(m.preview, 30);
		////console.log(phase, colors - 3, m)
	}

	#checkInstantDrop(stack, w, h) {
		let width = w,
			height = h;

		let grid = JSON.parse(JSON.stringify(stack));


		let testSpace = function(x, y) {
				if (x < 0 || x >= width) {
					return true;
				}
				if (y < height) {
					if (typeof grid[x][y] !== "undefined" && grid[x][y] !== 0) {
						return true;
					}
					return false;
				}
				return true;
			},
			checkHoles = function() {
				let checked = true;
				for (let t = 0; t < height && checked; t++)
					for (var y = height - 1; y >= -1; y--) {
						for (var x = 0; x < width; x++) {
							checked = true;
							if (!testSpace(x, y - 1)) {
								continue
							}
							if (!testSpace(x, y)) {
								grid[x][y] = grid[x][y - 1]
								grid[x][y - 1] = 0;
								checked = false;
							}
						}
					}
			};
		while (true) {
			checkHoles();
			break
		}
		return grid;
	}

	toggle(tog) {
		this.isOn = tog;
		if (tog) {

		} else {

		}
	}
}

class InsaneBackground {
	#Ray = class {
		constructor(x1, y1, x2, y2, divisions) {
			this.distanceX = x2 - x1;
			this.distanceY = y2 - y1;
			this.x1 = x1;
			this.x2 = x2;
			this.y1 = y1;
			this.y2 = y2;
			this.midpointVertexCount = divisions - 1;
			this.midpointVertexes = [];
			for (let f = 0; f < this.midpointVertexCount; f++) {
				this.midpointVertexes.push({
					x: 0,
					y: 0,
				});
			}
			this.color = "#fff";
		}
		moveStart(x, y) {
			this.x1 = x;
			this.y1 = y;
			this.distanceX = this.x2 - this.x1;
			this.distanceY = this.y2 - this.y1;
			/*for (let f = 0; f < this.midpointVertexCount; f++) {
			 this.midpointVertexes[f].ox =  this.distanceX / this.midpointVertexCount;
			 this.midpointVertexes[f].oy =  this.distanceY / this.midpointVertexCount;
			}*/
		}

		moveEnd(x, y) {
			this.x2 = x;
			this.y2 = y;
			this.distanceX = this.x2 - this.x1;
			this.distanceY = this.y2 - this.y1;

			/*for (let f = 0; f < this.midpointVertexCount; f++) {
			 this.midpointVertexes[f].ox = this.distanceX / this.midpointVertexCount;
			 this.midpointVertexes[f].oy = this.distanceY / this.midpointVertexCount;
			}*/
		}


		draw(ctx, cellSize) {
			let mx = this.distanceX / this.midpointVertexCount,
				my = this.distanceY / this.midpointVertexCount,
				cx1 = this.x1,
				cy1 = this.y1,
				cx2 = this.x2,
				cy2 = this.y2;
			ctx.beginPath();
			ctx.moveTo((this.x1 * cellSize), (this.y1 * cellSize));
			for (let g = 0, m = this.midpointVertexes.length; g < m; g++) {
				let r = this.midpointVertexes[g];

				ctx.lineTo((((g + 1) * (mx)) + r.x + this.x1) * cellSize, (((g + 1) * (my)) + r.y + this.y1) * cellSize);
				if (g == 4) break;
			}

			ctx.lineTo((this.x2 * cellSize), (this.y2 * cellSize));
			ctx.lineWidth = 0.3 * cellSize;
			ctx.strokeStyle = this.color;
			ctx.stroke();

		}
	};
	constructor(parent) {
		this.parent = parent;
		this.canvas;
		this.ctx;
		this.cellSize = 40;
		this.colors = {
			r: 250,
			g: 60,
			b: 48,
		};
		this.colorMult = 1;
		this.eye = {
			x: 0,
			y: 0,
			w: 5,
			h: 5,
			offset: {

				dx: 0,
				dy: 0,
				frame: 0,
				max: 0,
				state: "set"
			}
		};
		this.origStarts = [];
		this.rays = [];
		this.henshinTemp = new OffscreenCanvas(540, 540);
		this.henshinTempCtx = this.henshinTemp.getContext("2d");
		this.henshinAnim = new GIFRenderer(10 * 540, 10 * 540, 540, 540, 0, (a, canv, x, y, w, h, frame, that) => {
			let b = a.canvas; // a.canvas is the main canvas, this.canvas
			//a.clearRect(0, 0, b.width, b.height);
			let mm = ((game.frames * 0.3) % 360)
			this.henshinTempCtx.clearRect(0, 0, w, h);
			this.henshinTempCtx.save();
			this.henshinTempCtx.translate(w / 2, h / 2);
			this.henshinTempCtx.rotate((Math.PI / 180) * (mm))
			this.henshinTempCtx.drawImage(canv, (x % 5) * w, (~~(x / 5) % 3) * h, w, h, w / -2, h / -2, w, h);
			let centerSize = 5;

			for (let yu = 0; yu < 2; yu++) a.drawImage(this.henshinTemp, 0, 0, w, h, this.parent.cellSize * ((-5) - (centerSize / 2)), this.parent.cellSize * (-centerSize / 2), this.parent.cellSize * (this.parent.fieldSize.vh + centerSize), this.parent.cellSize * (this.parent.fieldSize.vh + centerSize));
			this.henshinTempCtx.restore();

			that.frame.x++;
			that.frameCount++;

			//if (frame >= 30) that.enabled = false;
			if (frame == 15) that.actualFrames = 0;;
		}, (frame) => {

		}, true);
		this.fever = {

		};
		this.fever.temp = new OffscreenCanvas(540, 540),
			this.fever.tempCtx = this.fever.temp.getContext("2d"),
			this.fever.main = new GIFRenderer(540 * 3, 540 * 5, 540, 540, 0, (a, canv, x, y, w, h, frame, that) => {
				let b = a.canvas; // a.canvas is the main canvas, this.canvas
				//a.clearRect(0, 0, b.width, b.height);

				let eyeX = this.eye.x;
				let eyeY = this.eye.y;

				if (this.eye.offset.frame >= 0 && this.eye.offset.state == "reset") {
					let be = 1 - bezier(this.eye.offset.frame / this.eye.offset.max, 1, 0, 0, 0, 0, 1);
					eyeX = this.eye.x + (this.eye.offset.dx * be);
					eyeY = this.eye.y + (this.eye.offset.dy * be);
					this.eye.offset.frame--;
				}
				if (this.spinSpeed > 0.3) this.spinSpeed -= 0.005;
				else this.spinSpeed = 0.3;
				let mm = ((this.spinFrames) % 360);
				this.fever.tempCtx.clearRect(0, 0, w, h);
				this.fever.tempCtx.save();
				this.fever.tempCtx.translate(w / 2, h / 2);
				this.fever.tempCtx.rotate((Math.PI / 180) * (mm))
				this.fever.tempCtx.drawImage(canv, ~~(x % 3) * w, (~~(x / 3) % 5) * h, w, h, w / -2, h / -2, w, h);
				let centerSize = 30;

				a.drawImage(this.fever.temp, 0, 0, w, h, (this.parent.cellSize * ((-10) - (centerSize / 2) + eyeX)), this.parent.cellSize * ((-centerSize / 2) - 10 + eyeY), this.parent.cellSize * (this.parent.fieldSize.vh + centerSize), this.parent.cellSize * (this.parent.fieldSize.vh + centerSize));
				this.fever.tempCtx.restore();

				that.frame.x -= 1;
				that.frameCount += 1;
				this.spinFrames += this.spinSpeed;

				this.spinFrames %= 360;



				if (that.frameCount >= 13 || that.frame.x <= -1) {
					that.frameCount = 0;
					that.frame.x = 13;
				}

				//if (frame >= 30) that.enabled = false;
				if (frame == 30) that.actualFrames = 0;;
			}, (frame) => {
				//this.setStyle("CLEARTEXT-CANVTEXT", "animation-delay", `${~~((1000 / -60) * (frame))}ms`);
			}, true);


		this.frenzy = {

		};
		this.frenzy.temp = new OffscreenCanvas(540, 540),
			this.frenzy.tempCtx = this.frenzy.temp.getContext("2d"),
			this.frenzy.main = new GIFRenderer(540 * 3, 540 * 8, 540, 540, 0, (a, canv, x, y, w, h, frame, that) => {
				let b = a.canvas; // a.canvas is the main canvas, this.canvas
				//a.clearRect(0, 0, b.width, b.height);

				let eyeX = this.eye.x;
				let eyeY = this.eye.y;

				if (this.eye.offset.frame >= 0) {
					let be = 1 - bezier(this.eye.offset.frame / this.eye.offset.max, 1, 0, 0, 0, 0, 1);
					eyeX = this.eye.x + (this.eye.offset.dx * be);
					eyeY = this.eye.y + (this.eye.offset.dy * be);
					this.eye.offset.frame--;
				}

				let mm = ((this.spinFrames) % 360);
				this.frenzy.tempCtx.clearRect(0, 0, w, h);
				this.frenzy.tempCtx.save();
				this.frenzy.tempCtx.translate(w / 2, h / 2);
				this.frenzy.tempCtx.rotate((Math.PI / 180) * (mm));
				this.frenzy.tempCtx.drawImage(canv, ~~(x % 3) * w, (~~(x / 3) % 8) * h, w, h, w / -2, h / -2, w, h);
				let centerSize = 30;

				////console.log(this.cellSize, this.parent.cellSize)
				for (let yu = 0; yu < 1; yu++) a.drawImage(this.frenzy.temp, 0, 0, w, h, (this.parent.cellSize * ((-10) - (centerSize / 2) + eyeX)), this.parent.cellSize * ((-centerSize / 2) - 10 + eyeY), this.parent.cellSize * (this.parent.fieldSize.vh + centerSize), this.parent.cellSize * (this.parent.fieldSize.vh + centerSize));
				this.frenzy.tempCtx.restore();

				that.frame.x += 1;
				that.frameCount += 1;
				this.spinFrames += 0.3;
				this.spinFrames %= 360;
				if (that.frameCount >= 24 || that.frame.x <= -1) {
					that.frameCount = 0;
					that.frame.x = 0;
				}

				//if (frame >= 30) that.enabled = false;
				if (frame == 30) that.actualFrames = 0;;
			}, (frame) => {
				//this.setStyle("CLEARTEXT-CANVTEXT", "animation-delay", `${~~((1000 / -60) * (frame))}ms`);
			}, true);

		this.spinSpeed = 0;
		this.spinFrames = 0;


		for (let f = 0; f < 12; f++) {
			this.rays.push(new this.#Ray(0, 1, 0, 1, 4));
		}
	}

	fetchAsset(canvas, ctx) {
		this.canvas = canvas;
		this.ctx = ctx;

		//refactor by excluding this spaghetti adds code
		this.henshinAnim.initialize(this.ctx);
		this.henshinAnim.loadImages([game.henshinBg]);
		this.henshinAnim.exec(0);
		//this.henshinTempCtx.drawImage(this.henshinAnim.getCanvas(), 0, 0);

		this.fever.main.initialize(this.ctx);
		this.fever.main.loadImages([game.feverBg]);
		this.fever.main.exec(0);
		//this.fever.tempCtx.drawImage(this.fever.main.getCanvas(), 0, 0);

		this.frenzy.main.initialize(this.ctx);
		this.frenzy.main.loadImages([game.frenzyBg]);
		this.frenzy.main.exec(0);
		//this.frenzy.tempCtx.drawImage(this.frenzy.main.getCanvas(), 0, 0);

	}
	reset() {
		this.eye.offset.frame = -9;
		this.spinSpeed = 0.3;
		this.moveEye(this.parent.fieldSize.w / 2, this.parent.fieldSize.vh / 2);
	}
	moveEye(x, y, isReset) {
		this.eye.offset.dx = this.eye.x - x;
		this.eye.offset.dy = this.eye.y - y;
		this.eye.x = x;
		this.eye.y = y;
		this.spinSpeed += 0.4;
		this.eye.offset.state = "set";
		if (isReset) {
			this.eye.offset.state = "reset";
			this.eye.offset.frame = 180;
			this.eye.offset.max = 180;
		} else {
			this.eye.offset.state = "reset";
			this.eye.offset.frame = 5;
			this.eye.offset.max = 5;
		}
		let w = this.parent.fieldSize.w;
		let vh = this.parent.fieldSize.vh;
		this.origStarts = [{
				x: 0 * (w / 3),
				y: 0 * (vh / 3)
  },
			{
				x: 1 * (w / 3),
				y: 0 * (vh / 3)
  },
			{
				x: 2 * (w / 3),
				y: 0 * (vh / 3)
  },
			{
				x: 3 * (w / 3),
				y: 0 * (vh / 3)
  },
			{
				x: 3 * (w / 3),
				y: 1 * (vh / 3)
  },
			{
				x: 3 * (w / 3),
				y: 2 * (vh / 3)
  },
			{
				x: 3 * (w / 3),
				y: 3 * (vh / 3)
  },
			{
				x: 2 * (w / 3),
				y: 3 * (vh / 3)
  },
			{
				x: 1 * (w / 3),
				y: 3 * (vh / 3)
  },
			{
				x: 0 * (w / 3),
				y: 3 * (vh / 3)
  },
			{
				x: 0 * (w / 3),
				y: 2 * (vh / 3)
  },
			{
				x: 0 * (w / 3),
				y: 1 * (vh / 3)
  }];

	}
	changeColor() {
		let ml = ~~(Math.random() * 10);
		this.colors.r = [130, 0, 0, 130, 130, 0, 130, 130, 70, 0][ml] * 2;
		this.colors.g = [0, 130, 0, 0, 130, 130, 0, 70, 130, 70][ml] * 2;
		this.colors.b = [0, 0, 130, 130, 0, 130, 70, 0, 0, 130][ml] * 2;

	}

	changeColorCustom(r, g, b) {
		//let ml = ~~(Math.random() * 10);
		this.colors.r = r;
		this.colors.g = g;
		this.colors.b = b;

	}
	draw() {
		this.parent.canvasClear("insane");
		//this.eye.x = Math.random() * 10;

		let w = this.parent.fieldSize.w;
		let vh = this.parent.fieldSize.vh;
		let qq = 1;

		this.parent.canvasCtx.insane.fillStyle = `rgba(${this.colors.r * qq},${this.colors.g * qq},${this.colors.b * qq}, 0.8)`;

		this.parent.canvasCtx.insane.fillRect(
			0, 0,
			this.parent.cellSize * (w),
			this.parent.cellSize * (vh)
		);

		this.parent.canvasCtx.insane.fillStyle = `rgba(${~~(Math.random() * 255)},${~~(Math.random() * 255)},${~~(Math.random() * 255)}, 0.5)`;

		////console.log(this.parent.cellSize)
		if (this.type == 0) {


			if (false) {
				for (let m = 0; m < this.rays.length; m++) {
					let maxAr = 12,
						arCount = 4;
					let g = game.frames * 0.1 + Math.sin(game.frames + (60)) * 0.25;
					let ar = ((g) + (m * 4)) % (maxAr * arCount);
					let afr = ((g) + (m * 4) + (12)) % (maxAr * arCount);
					/*let arx = (Math.max(0, Math.min(maxAr, ar) - Math.min(maxAr, (maxAr * 3) - ar))) / maxAr;
					let ary = (Math.max(0, Math.min(maxAr, ar + (maxAr * 2)) - Math.min(maxAr, (maxAr * 3 - ar))) / maxAr;/**/

					let p1 = ar,
						pf1 = afr;
					let p = (p1 - Math.max(0, p1 - (maxAr * 1)) - Math.max(0, p1 - (maxAr * 2)) + Math.max(0, p1 - (maxAr * 3))) / maxAr;
					let lp = (pf1 - Math.max(0, pf1 - (maxAr * 1)) - Math.max(0, pf1 - (maxAr * 2)) + Math.max(0, pf1 - (maxAr * 3))) / maxAr;
					let arx = p;
					let ary = lp


					let sx = (Math.min(arx, 1)) * (w),
						sy = (Math.min(ary, 1)) * (vh);

					this.rays[m].moveStart(sx, sy);
					this.rays[m].moveEnd(this.eye.x, this.eye.y);
					let h = this.rays[m];
					for (let o = 0; o < h.midpointVertexes.length; o++) {
						let c = h.midpointVertexes[o];
						c.x = Math.sin(game.frames + ((o + 1) + 60)) * 0.25;
						c.y = Math.sin(game.frames + ((o * 0.25) * 60)) * 0.25;
					}

				}


				for (let h of this.rays) {
					h.draw(this.ctx, this.parent.cellSize);
				}
			}
			this.fever.main.run();

			/*this.parent.canvasCtx.insane.drawImage(
			 game.insaneEye.canvas,
			 this.parent.cellSize * (this.eye.x - (this.eye.w / 2)),
			 this.parent.cellSize * (this.eye.y - (this.eye.h / 2)),
			 this.parent.cellSize * (this.eye.w),
			 this.parent.cellSize * (this.eye.h)
			);*/
		}
		else if (this.type === 2) {
			this.frenzy.main.run();

		}
		else this.henshinAnim.run();
	}
}

class RPGAttributes {
	#ctx;
	#canvas;
	#text;
	constructor(parent) {
		this.parent = parent;
		this.isOn = false;
		this.maxHP = 184472;
		this.hp = 40332;
		this.hpBehind = 0;
		this.isOn = false;
		this.hpDamage = 0;
		this.isWOIHPMode = false;

		this.attributes = {
			attack: 100,
			atkTolerance: 100,
			defense: 50,
			lifesteal: 0.59
		};
		this.healthBar = {
			active: new NumberChangeFuncExec(null, (val, arg) => {
				if (arg) {
					this.healthBar.behind.execute();
					this.healthBar.forecastedDmg.execute();
				}
				this.drawHealthBar(val, "#0e0");
			}),
			behind: new NumberChangeFuncExec(null, (val, arg) => {
				this.drawHealthBar(val, "#a00", true);
				if (arg) {
					this.healthBar.forecastedDmg.execute();
					this.healthBar.active.execute();
				}

			}),
			forecastedDmg: new NumberChangeFuncExec(null, (val, arg) => {
				if (arg) this.healthBar.behind.execute();
				this.drawHealthBar(val, "#fa0");
				if (arg) this.healthBar.active.execute();
			}),
			text: new NumberChangeFuncExec(null, (val) => {
				this.#text.innerHTML = val;
			}),

		};
	}

	drawHealthBar(val, color, isClear) {
		if (isClear) this.#ctx.clearRect(0, 0, 300, 70);
		this.#ctx.fillStyle = color;
		this.#ctx.fillRect(0, 0, 300 * val, 70);
	}
	reset() {
		this.hp = this.maxHP;
	}

	update() {
		if (!this.isOn) return;
		if (this.hpBehind > this.hp) {
			this.hpBehind -= (this.maxHP * 0.003);
			//if (this.hpBehind <)
		}
		if (this.hpBehind < this.hp) {
			this.hpBehind = this.hp;
		}
		if (!this.isWOIHPMode) {}
		this.healthBar.behind.assign(this.hpBehind / this.maxHP, true);
		this.healthBar.forecastedDmg.assign(this.hp / this.maxHP, true);
		this.healthBar.active.assign((this.hp - this.hpDamage) / this.maxHP, true);
		this.healthBar.text.assign(this.hp);
	}

	fetchAsset(canvas, ctx, text) {
		this.#canvas = canvas;
		this.#ctx = ctx;
		this.#text = text;
		this.#canvas.width = 300;
		this.#canvas.height = 70;
	}
	addHP(num) {
		if (!this.isOn) return;
		let isFull = false;
		if (this.hp > this.maxHP) {
			isFull = true;
		}

		this.hp += ~~(num);
		if (this.hp > this.maxHP) {
			this.hp = this.maxHP;
		}
		if (this.hp < 0) {
			this.hp = 0;
		}
		if (!isFull) {

		}
	}
	setMaxHP(max) {
		this.maxHP = max || 1000;
		this.hp = max || 1000;
	}

	checkZeroHP() {
		if (!this.isOn) return false;
		if (this.hp <= 0) {
			return true;
		}
		return false;
	}

	openClose(oc) {
		this.isOn = oc;
		this.parent.setStyle(`GARBAGE-TRAY-DIV`, "top", `${this.parent.fieldCellSize * -1*(2.5 + (this.isOn ? 1.5 : 0))}px`);
		this.parent.setStyle("HP-BAR-DIV", "display", this.isOn ? "flex" : "none");
	}
}

const playerVoiceSystem = {
	voices: {},
	storage: {},
	storagePaths: {},
	batchLoad: function(base, version, array) {
		return new Promise(async (res, rej) => {
			try {
				let storage = this.storage;
				let dir = `assets/characters/${base}/${version || "main"}`;
				let isPath = false;
				let bversion = `${base}/${version || "main"}`;
				if (bversion in this.storagePaths) {
					isPath = true;
				} else {
					this.storagePaths[bversion] = {};
				}

				/*if (player in this.voices) {
					for (let o in this.voices[player]) {
						delete this.voices[player][o];
					}
					delete this.voices[player];
				} else this.voices[player] = {};*/
				let loaded = 0;
				let loadLength = 0;
				let needLoad = [];
				for (let b of array) {
					let kl = `${base}#${version}|${b}`;
					//console.log("load " + kl)
					if (kl in this.voices) {
						continue;
					}

					this.voices[kl] = {};
					needLoad.push([kl, b]);

					loadLength++;
				}

				if (loadLength == 0) {
					//console.log("voice loaded");
					{
						res();
					}
				}
				for (let o of needLoad) {
					let kl = o[0],
						b = o[1];
					//console.log("load " + kl);
					if (!(kl in storage)) storage[kl] = await load(`${dir}/${b}`, "blob");
					////console.log(kl, storage[kl])
					let blob = URL.createObjectURL(storage[kl]);

					//let ml = `${player}#${kl}`;
					this.voices[kl] = {
						main: new MainHowler.Howl({
							src: blob,
							format: "ogg",
							loop: false,
							preload: false
						}),
						length: 0,
						isLoad: false
					};

					if (!isPath) {
						this.storagePaths[bversion][kl] = blob;
					}



					this.voices[kl].main.load();
					for (let nx of ["load", "loaderror"]) this.voices[kl].main.once(nx, () => {
						loaded++;
						this.voices[kl].isLoad = true;
						this.voices[kl].length = ~~(this.voices[kl].main.duration() * 60);
						if (loaded >= loadLength) {
							//console.log("load done")
							res();
						}
					})
				}


			} catch (e) {
				//console.log(e)
				res();
			}
		});
	},

	getVoice: function(base, version, name) {
		//if (!(p in this.voices)) return null;
		let a = `${base}#${version}|${name}`;
		////console.log(this.voices[p], a)
		if (a in this.voices) {
			//this.voices[p][a].main.rate(1);
			return this.voices[a].main;
			/*this.voices[p][a].main.play();
			this.voices[p][a].main.play();
			this.voices[p][a].main.play();
			
			this.voices[p][a].main.play();
			this.voices[p][a].main.play();
			this.voices[p][a].main.play();
			this.voices[p][a].main.play();   */

		}
		return null;
	},

	play: function(base, version, name) {
		//if (!(p in this.voices)) return;
		let a = `${base}#${version}|${name}`;

		if (a in this.voices) {
			//this.voices[p][a].main.rate(1);

			return this.voices[a].main.play();
			/*this.voices[p][a].main.play();
			this.voices[p][a].main.play();
			this.voices[p][a].main.play();
			
			this.voices[p][a].main.play();
			this.voices[p][a].main.play();
			this.voices[p][a].main.play();
			this.voices[p][a].main.play();   */

		}

	},
	check: function(base, version, name) {
		//if (!(p in this.voices)) return false;
		let a = `${base}#${version}|${name}`;
		if (a in this.voices) {

			return this.voices[a].main.playing();

		}
		return false;
	},
	stop: function(base, version, name) {
		//if (!(p in this.voices)) return;
		let a = `${base}#${version}|${name}`;
		if (a in this.voices) {
			this.voices[a].main.stop();
		}

	},
	duration: function(base, version, name) {
		//if (!(p in this.voices)) return 0;
		let a = `${base}#${version}|${name}`;
		if (a in this.voices) {
			return this.voices[a].length;
			/*this.voices[p][a].main.play();
			this.voices[p][a].main.play();
			this.voices[p][a].main.play();
			
			this.voices[p][a].main.play();
			this.voices[p][a].main.play();
			this.voices[p][a].main.play();
			this.voices[p][a].main.play();   */

		}
		return 0;
	},

	unloadAll: function(exemptions) {
		for (let h in this.storagePaths) {
			if (h in exemptions) continue; // exemptions is an object
			for (let b in this.storagePaths[h]) {
				URL.revokeObjectURL(this.storagePaths[h][b]);

			}
			delete this.storagePaths[h];
		}
	},

	removePlayerVoices: function() {
		//if (!(player in this.voices)) return;

		for (let b in this.voices[player]) {
			delete this.voices[player][b];

		}
		delete this.voices[player];

	}

}

class RectangularAnimations {
	#canvas;
	#testCanv
	#ctx;
	#testCtx;
	constructor(parent) {
		this.parent = parent;
		this.#canvas = new OffscreenCanvas(1235 * 3, 700 * 3);
		this.#testCanv = new OffscreenCanvas(247, 70);
		this.dim = {
			w: 247,
			h: 70
		};
		this.#ctx = this.#canvas.getContext("2d");
		this.#testCtx = this.#testCanv.getContext("2d");

		this.spells = {
			spell1: [0, 0],
			spell2: [1, 0],
			spell3: [2, 0],
			spell4: [0, 1],
			spell5: [1, 1],
			counter: [2, 1],
			damage2: [0, 2],
		}
		this.mainCtx;
		this.current = "none";
		this.frame = 0;
		this.maxFrames = 50;
		this.enabled = true;
		this.delay = 2.5;
	}
	load(arr) {
		this.#ctx.clearRect(0, 0, 1235 * 3, 700 * 3);


		for (let uw = 0; uw < arr.length; uw++) {
			let j = arr[uw],
				ms = this.spells[j.s];
			this.#ctx.drawImage(j.a, /*0,0,1235,700,/**/ 1235 * (ms[0]), this.dim.h * 10 * (~~(ms[1])), 1235, this.dim.h * 10);

		}
		/*this.#canvas.convertToBlob().then((res) => {
		 elem("a", uu => {
		  let url = URL.createObjectURL(res);
		  uu.download = "7373jdjd.png";
		  uu.href = url;
		  uu.click();
		 })
		})*/
		this.#testCtx.drawImage(this.#canvas, 0, 0);
	}
	fetchCtx(ctx) {
		this.mainCtx = ctx;
	}
	play(spell) {
		if (this.spell !== void 0) return;
		this.current = spell || "none";
		this.frame = 0;
		this.enabled = true;

	}
	run() {

		if (this.delay > 0) {
			this.delay--;
		}
		if (this.delay <= 0 && this.enabled && this.current !== "none") {

			this.mainCtx.clearRect(0, 0, 247, 70);
			let m = this.spells[this.current];
			let l = 0;
			if (this.frame <= 5) {
				l = (this.frame) / 5;
			} else
			if (this.frame >= 45) {
				l = (50 - this.frame) / 5;
			} else l = 1;
			this.mainCtx.drawImage(this.#canvas,
				247 * ~~((this.frame % 5) + (m[0] * 5)),
				70 * ~~(~~(this.frame / 5) + (m[1] * 10)),
				this.dim.w,
				this.dim.h,
				0, this.dim.h * ((1 - l) / 2),
				this.dim.w,
				this.dim.h * (l)
			)
			this.frame++;
			this.delay += 2.5;
			if (this.frame > this.maxFrames) this.enabled = false;
		}
	}
}


class PlayerVoice {
	constructor(base, version, name) {
		this.base = base;
		this.version = version;
		this.name = name;

		this.a = playerVoiceSystem;
		this.playerTarget = [];
	}

	playVoice() {
		this.a.play(this.base, this.version, this.name);
	}
	stopVoice() {
		this.a.stop(this.base, this.version, this.name);
	}

	checkPlay() {
		return this.a.check(this.base, this.version, this.name)
	}

	getVoice() {
		return this.a.getVoice(this.base, this.version, this.name);
	}

	duration() {
		return this.a.duration(this.base, this.version, this.name);
	}

}

class GarbageTrayObject {
	constructor() {
		this.x = 0;
		this.gx = 0;
	}
}

class GachatrisBlock {

	constructor(parent) {
		this.garbageLimit = 8;
		this.parent = parent;
		this.isActive = false;
		this.isEnable = false;
		this.isControl = false;
		this.isWarning = false;
		this.isWarningTopOut = false;
		this.isSpawnablePiece = false;
		this.isAux = false;
		this.attackType = "scorebased";
		this.piece = {
			x: 0,
			y: 0,
			rot: 0,
			template: PIECE,
			activeArr: [[]],
			active: 0,
			holdable: true,
			defaultHoldable: true,
			hold: 0,
			isAir: false,
			moved: false,
			dirty: false,
			held: false,
			enable: false,
			rotated: false,
			isHardDrop: false,
			spin: {
				spin: 0,
				mini: 0,
				x1y2: 0,
			},
			lastDrop: {
				x: 0,
				y: 0
			},
			kickTable: null,
			kickDistance: {
				x: 0,
				y: 0
			},
			spinTable: null,
			last: {
				x: 0,
				y: 0,

			},
			is180able: false,
		};

		this.delay = {};
		this.delayAdd = {};
		this.delayDefault = {
			0: 10,
			1: 40,
			2: 4
		};
		this.delayParamsLength = 8;
		this.isProfessional = false;
		this.canRaiseGarbage = true;

		this.warningTrig = new NumberChangeFuncExec(0, (t) => {
			this.isWarning = t;
		});

		this.isAllSpin = false;
		this.level = 3;

		this.fixedGravity = [
          0, 1 / 60, 1 / 30, 1 / 25, 1 / 20, 1 / 15, 1 / 12, 1 / 10, 1 / 8, 1 / 6, 1 / 6,
           1 / 4, 1 / 4, 1 / 3, 1 / 3, 1 / 3, 1 / 2, 1, 1.5, 2, 3
          ];

		let lev = [0];

		for (let h = 0; h < 29; h++) {
			lev.push(1 / (((0.8 - ((h) * 0.007)) ** (h)) * 60));
		}
		// Proper Gravity Table

		this.fixedGravity = lev;


		this.nextVoice = {
			name: "",
			duration: -2,
		}
		this.attackSendDelay = -9;

		this.isDelayEnabled = true;

		this.insane = new InsaneMode("block", this);

		this.blockColors = {
			r: [255, 255, 255, 0, 0, 0, 127],
			g: [0, 127, 255, 255, 255, 0, 0],
			b: [0, 0, 0, 0, 255, 255, 255]
		};

		for (let h = 0; h < this.delayParamsLength; h++) {
			this.delay[h] = 0;
			this.delayAdd[h] = 10;
		}
		this.clear = {
			linesReady: [],
			linesDelayed: [],
			blocks: []
		};
		this.b2b = -1;
		this.combo = -1;
		this.messiness = 0.3725;
		this.currentGarbageHole = 0;

		this.pcSpam = {
			frame: 0,
			count: 0
		}

		this.rngPreview = new ParkMillerPRNG();

		this.preview = {
			bag: [0, 1, 2, 3, 4, 5, 6],
			queue: []
		}
		this.settings = {
			das: 6,
			arr: 4,
			gravity: this.fixedGravity[Math.min(28, this.level)],
			lock: 30,
			sft: 0.5 * 60 / 60,
		}
		this.handling = {
			das: 0,
			arr: 0,
			xFirst: 0,
		}
		this.lock = {
			lowest: 0,
			reset: 15,
			delay: 30,
			delayMax: 30
		}
		this.stack = [];
		this.drawableStack = [];
		this.fieldSize = {
			w: 10,
			h: 40,
			vh: 20,
			hh: 20
		};
		//to add cool visual effects

		this.effects = {
			hardDrop: new ArrayFunctionIterator((aray) => {
				for (let wm = 0, lm = aray.length; wm < lm; wm++) {
					let idx = aray[wm];
					idx.frames--;
					// drawRect(ctx
					let sx = this.parent.fieldSize.w / this.fieldSize.w;
					let sy = this.parent.fieldSize.vh / this.fieldSize.vh;

					let x = ~~((idx.x) * this.parent.cellSize * sx),
						y = (idx.y + 1 - (this.fieldSize.hh - this.visibleFieldBufferHeight)) * this.parent.cellSize * sy; //- (2 * this.cellSize);

					let c = this.parent.canvasCtx.piece;
					let depth = this.parent.cellSize * sy * (idx.dep * (idx.frames / idx.maxf));
					c.globalAlpha = Math.max(0, idx.frames) / idx.maxf;

					let grad = c.createLinearGradient(~~(x), ~~(y), ~~(x), ~~(y) - depth);
					let colorBase = `rgba(${this.blockColors.r[idx.blk]},${this.blockColors.g[idx.blk]},${this.blockColors.b[idx.blk]}, 1)`;
					let colorBaseZero = `rgba(${this.blockColors.r[idx.blk]},${this.blockColors.g[idx.blk]},${this.blockColors.b[idx.blk]}, 0)`;

					grad.addColorStop(0, colorBaseZero);
					grad.addColorStop((1 - (idx.dep - 1) / idx.dep), colorBase);
					grad.addColorStop(1, colorBaseZero);
					c.fillStyle = grad;

					if (this.parent.isVisible) c.fillRect(
						/*manager.skin.canvas,
						row * this.parent.cellSize,
						column * this.parent.cellSize,
						this.parent.cellSize,
						this.parent.cellSize,*/
						x,
						y - depth,
						this.parent.cellSize * sx,
						depth,
					);
					c.globalAlpha = 1;

					if (idx.frames <= 0) {
						aray.splice(wm, 1);
						wm--;
						lm--;
					}

				}

			}),
			appearAnim: new ArrayFunctionIterator((aray) => {
				for (let wm = 0, lm = aray.length; wm < lm; wm++) {
					let idx = aray[wm];
					idx.frames += 0.5;
					// drawRect(ctx
					let sx = this.parent.fieldSize.w / this.fieldSize.w;
					let sy = this.parent.fieldSize.vh / this.fieldSize.vh;

					let x = ~~((idx.x) * this.parent.cellSize * sx),
						y = (idx.y - (this.fieldSize.hh - this.visibleFieldBufferHeight)) * this.parent.cellSize * sy; //- (2 * this.cellSize);

					let c = this.parent.canvasCtx.piece;
					//let depth = this.parent.cellSize * sy * ((idx.frames / idx.maxf));
					/*c.globalAlpha = Math.max(0, idx.frames) / idx.maxf;

					let grad = c.createLinearGradient(~~(x), ~~(y), ~~(x), ~~(y) - depth);
					grad.addColorStop(0, "#FFF0");
					grad.addColorStop((1 - (idx.dep - 1) / idx.dep), "#FFF");
					grad.addColorStop(1, "#FFF0");
					c.fillStyle = grad;*/

					if (this.parent.isVisible) {
						if (idx.frames > 10) c.drawImage(
							manager.skin.canvas,
							0 * this.parent.cellSize,
							idx.cell * this.parent.cellSize,
							this.parent.cellSize,
							this.parent.cellSize,
							x,
							y,
							this.parent.cellSize,
							this.parent.cellSize,
						);

						let size = 2;

						c.drawImage(
							manager.skinAppear.canvas,
							~~(idx.frames % 10) * 70,
							~~(idx.frames / 10) * 70,
							70,
							70,
							(x) - (this.parent.cellSize * (size / 4)),
							(y) - (this.parent.cellSize * (size / 4)),
							this.parent.cellSize * size,
							this.parent.cellSize * size,
						);


						if (idx.frames > 30) {
							aray.splice(wm, 1);
							wm--;
							lm--;
						}

					}
				}

			}),
			clearAnim: new ArrayFunctionIterator((aray) => {
				for (let wm = 0, lm = aray.length; wm < lm; wm++) {
					let idx = aray[wm];
					idx.frames += 60 / idx.maxf;
					//this.parent.editIH("HOLD-TEXT", idx.frames)
					// drawRect(ctx
					let sx = this.parent.fieldSize.w / this.fieldSize.w;
					let sy = this.parent.fieldSize.vh / this.fieldSize.vh;

					let x = ~~((idx.x) * this.parent.cellSize * sx),
						y = (idx.y - (this.fieldSize.hh - this.visibleFieldBufferHeight)) * this.parent.cellSize * sy; //- (2 * this.cellSize);

					let c = !this.isAux ? this.parent.canvasCtx.piece : this.parent.canvasCtx.pieceAux;
					//let depth = this.parent.cellSize * sy * ((idx.frames / idx.maxf));
					/*c.globalAlpha = Math.max(0, idx.frames) / idx.maxf;
   
     let grad = c.createLinearGradient(~~(x), ~~(y), ~~(x), ~~(y) - depth);
     grad.addColorStop(0, "#FFF0");
     grad.addColorStop((1 - (idx.dep - 1) / idx.dep), "#FFF");
     grad.addColorStop(1, "#FFF0");
     c.fillStyle = grad;*/

					if (this.parent.isVisible) {
						let size = 4;

						c.drawImage(
							manager.skinClear.canvas,
							~~(idx.frames % 10) * 70,
							~~((idx.frames) / 10) * 70,
							70,
							70,
							(x) - (sx * this.parent.cellSize * (size / 4)) - ((sx * this.parent.cellSize) / 2),
							(y) - (sy * this.parent.cellSize * (size / 4)) - ((sy * this.parent.cellSize) / 2),
							this.parent.cellSize * size,
							this.parent.cellSize * size,
						);


						if (idx.frames > 60) {
							aray.splice(wm, 1);
							wm--;
							lm--;
						}

					}
				}

			}),
		};

		this.visibleFieldBufferHeight = 5;
		this.visibleFieldHeight = 0;

		this.garbageWait = [];
		this.meteredGarbageWaitMode = true;

		//for Blobs

		this.BLOB_REQUIRED_TARGETPOINT = 30;

		this.hitSoundReduce = 0;

		this.dasCancellation = {
			on: true,
			main: new NumberChangeFuncExec(0, (c) => {
				this.handling.das = 0;
			}),
		};

		this.spellTime = -3;
		this.spellAnimName = "";
		this.activeVoiceLine = "";

		this.repeatSpellVoice = 0;

		this.appearBlockFrame = -1;
		this.stackAltitude = this.fieldSize.h;
	}
	checkStackAltitude() {

		let alt = this.fieldSize.h;
		for (let x = 0; x < this.fieldSize.w; x++) {
			for (let y = 0; y < this.fieldSize.h; y++) {
				if (this.stack[x][y] > 0) {
					if (y < alt) alt = y;
					break;
				}
			}
		}
		this.stackAltitude = alt;
	}
	checkWarning() {
		let isWarning = (this.isActive && !this.parent.isWin && !this.insane.isOn && (this.stackAltitude - this.parent.garbageLength) <= (this.fieldSize.hh + 5)) ? 1 : 0;

		this.warningTrig.assign(isWarning);
	}

	modifyGrid(cy, gridArr, isFlipped, isDraw, isAppearAnim) {
		this.simulateSplashOut();
		if (!isFlipped) {
			for (let x = 0; x < gridArr.length; x++) {
				for (let y = 0; y < gridArr[x].length; y++) {
					this.stack[x][y + cy] = gridArr[x][y];
					if (isAppearAnim && gridArr[x][y]) {
						this.effects.appearAnim.addItem({
							frames: -0.5,
							cell: gridArr[x][y],
							x: x,
							y: y + cy,

						});
					}
				}
			}
		} else {
			for (let x = 0; x < gridArr.length; x++) {
				for (let y = 0; y < gridArr[x].length; y++) {
					this.stack[x][y + cy] = gridArr[(gridArr.length - 1) - x][y];
					if (isAppearAnim && gridArr[(gridArr.length - 1) - x][y]) {
						this.effects.appearAnim.addItem({
							frames: -0.5,
							cell: gridArr[(gridArr.length - 1) - x][y],
							x: x,
							y: y + this.fieldSize.hh,

						});
					}
				}
			}
		};
		if (isDraw) {
			this.drawStack(this.stack);
		}
		if (isAppearAnim) {
			this.drawStack("reset");
			this.appearBlockFrame = 60;
		}
		this.checkStackAltitude();
	};
	testGridSpace(x, y) {
		if (x < 0 || x >= this.fieldSize.w) {
			return true;
		}
		if (y < this.fieldSize.h) {
			if (typeof this.stack[x][y] !== "undefined" && this.stack[x][y] !== 0) {
				return true;
			}
			return false;
		}
		return true;
	}

	reset() {
		this.piece.x = 0;
		this.piece.y = -295;
		this.loseDelay = -399;
		this.piece.lastDrop.x = 0;
		this.piece.lastDrop.y = -295;
		this.piece.hold = void 0;
		this.piece.rot = 0;
		this.piece.active = null;
		this.piece.activeArr = [[]];
		this.piece.isAir = false;
		this.piece.moved = true;
		this.piece.dirty = false;
		this.piece.held = false;
		this.piece.rotated = false;
		this.piece.enable = false;
		this.piece.isHardDrop = false;
		this.piece.spin.spin = 0;
		this.piece.spin.mini = 0;
		this.piece.holdable = true;
		this.b2b = -1;
		this.combo = -1;
		this.garbage = [];
		this.garbageWait = [];
		this.isSpawnablePiece = true;
		this.nextVoice.duration = -999;
		this.repeatSpellVoice = 0;

		this.pcSpam.frame = 0;
		this.pcSpam.count = 0;

		this.attackSendDelay = -9;

		this.stackAltitude = this.fieldSize.h;

		this.hitSoundReduce = 0;

		this.delay = {};
		this.delayAdd = {};

		this.spellTime = -3;
		this.spellAnimName = "";

		//this.insane.reset();
		this.currentGarbageHole = ~~(this.parent.seeds.field.next() * this.fieldSize.w);

		for (let h = 0; h < this.delayParamsLength; h++) {
			this.delay[h] = -10;

			this.delayAdd[h] = this.isProfessional ? 0 : this.delayDefault[h];
		}
		this.lock = {
			move: 15,
			rot: 15,
			delay: 30,
		};
		this.clear.linesReady.length = 0;
		this.clear.linesDelayed.length = 0;
		this.clear.blocks.length = 0;
		this.fieldSize.w = 10;
		this.fieldSize.hh = 20;
		this.fieldSize.vh = 20;
		this.fieldSize.h = this.fieldSize.vh + this.fieldSize.hh;
		this.stack = grid(this.fieldSize.w, this.fieldSize.h, 0);
		this.drawableStack = grid(this.fieldSize.w, this.fieldSize.h, 0);

		this.drawStack(this.stack);
		this.drawActivePiece();
		this.previewInitialize();
		this.holdDraw();
		this.handling = {
			das: 0,
			arr: 0,
			xFirst: 0,
		};

	}

	getQPosX(x) {
		let sizemult = this.isAux ? 0.47 : 1;
		return sizemult * x * (this.parent.fieldSize.w / this.fieldSize.w);

	}
	getQPosY(y) {
		let sizemult = this.isAux ? 0.47 : 1;
		return sizemult * y * ((this.parent.fieldSize.vh) / this.fieldSize.vh);

	}

	simulateSplashOut() {
		let asset = this.parent.assetRect(this.isAux ? "AUX-FIELD-CHARACTER-CANVAS" : "FIELD-CHARACTER-CANVAS");
		let sizemult = this.isAux ? 0.47 : 1;
		let aw = asset.width;
		let ah = asset.height;
		let ax = asset.x;
		let ay = asset.y;
		let bez = {

			x1: 0,
			x2: 0,
			x3: 1,
			x4: 1,
			y1: 0,
			y2: 0.3,
			y3: 1 + (Math.random() * 0.2),
			y4: 1,

		};
		for (let x = 0; x < this.fieldSize.w; x++) {
			for (let y = this.fieldSize.hh; y < this.fieldSize.h; y++)
				if (this.stack[x][y] > 0) {
					let mx = ax + (this.getQPosX(x) * this.parent.fieldCellSize) + (this.getQPosX(1) * this.parent.fieldCellSize / 2);
					let my = ay + (this.getQPosY(y - this.fieldSize.hh) * this.parent.fieldCellSize) + (this.getQPosY(1) * this.parent.fieldCellSize / 2);
					let particleSpeed = 71 + (Math.random() * 70);
					bez.y3 = 1 + (Math.random() * 0.2);
					this.parent.addParticle(true, "blobblock", 1, this.stack[x][y],
						mx,
						my,
						mx + this.getQPosX((Math.random() * 50) - (Math.random() * 50)) * this.parent.fieldCellSize,
						my + (this.getQPosY((Math.random() * 4) + 4) * this.parent.fieldCellSize) + game.resolution.h,
						particleSpeed, ((this.getQPosX(1) * this.parent.fieldCellSize) / game.cellSize), false, bez, false);
				}
		}
	}

	updateDelay() {
		if (!this.isDelayEnabled) return;
		let delayPrioritize = 0;

		for (let l = this.delayParamsLength; l >= 0; l--) {
			if (this.delay[l] >= 0) {
				delayPrioritize = l;
				break;
			}
		}

		if (delayPrioritize === 0) {
			//let lm = this.loseDelay < 0 ? !this.insane.updateDelays() : false;
			if (this.loseDelay >= 0) {
				if (this.isActive) this.loseDelay--;
			} else {
				if (!this.insane.updateDelays()) {
					this.delay[delayPrioritize]--;
				} else this.parent.isDelayStoppable = false;

			}
		} else {
			this.delay[delayPrioritize]--;
			this.parent.isDelayStoppable = false;
		}



		if (this.delay[2] == 0) {
			this.clearLine();
			this.spellTime = Math.max(0, this.delay[1] - 4);
			this.attackSendDelay = Math.max(0, this.delay[1] - 4);



		}

		if (this.delay[1] == 0) {
			this.stackCollapse(true);


		}

		if (this.loseDelay == 0) {
			this.loseDelay == -999;
			this.checkRespawnOrDie();
		}
		if (this.delay[0] == 0) {
			this.spawnPiece(this.previewNextBag(), false);
		}

		if (this.delay[delayPrioritize] == 0) {
			this.delay[delayPrioritize] = -333;
		}

		if (this.spellTime >= 0) {
			this.spellTime--;
			if (this.spellTime == 0) {
				this.parent.playVoice(this.activeVoiceLine);
				if (this.insane.isOn && this.insane.blocks.requireLine <= 0) {
					this.nextVoice.duration = this.parent.getVoiceDuration(this.activeVoiceLine);

				}
				for (let j = 1; j <= (this.repeatSpellVoice); j++) {
					this.parent.addDelayHandler(true, j * 9, () => {
						this.parent.playVoice(this.activeVoiceLine);

						this.nextVoice.duration = this.parent.getVoiceDuration(this.activeVoiceLine);



					});
				}
				this.repeatSpellVoice = 0;
				if (this.spellAnimName) this.parent.rectanim.play(this.spellAnimName);

			}

		}

		if (this.nextVoice.duration >= 0) {
			this.nextVoice.duration--;
			if (this.nextVoice.duration === 0) {
				//this.checkDropBlock();
				this.parent.playVoice(this.nextVoice.name);
			}
		}

		if (this.attackSendDelay >= 0) {
			this.attackSendDelay--;
			if (this.attackSendDelay === 0) {
				//this.checkDropBlock();
				//this.parent.playVoice(this.nextVoice.name);
				this.emitAttack([this.parent.delayedGarbage]);
				this.parent.delayedGarbage = 0;
			}
		}
	}
	holdShow(showhide) {
		this.parent.setStyle("HOLD", "display", showhide ? "block" : "none");
		this.parent.setStyle('HOLD', "left", `${(this.parent.fieldCellSize * 0.1)}px`);
		this.parent.setStyle('HOLD', "top", `${(this.parent.fieldCellSize * 0.1)}px`);
		this.piece.holdable = showhide;

	}

	drawStack(stack) {
		if (!this.isEnable) return;
		let aux = this.isAux ? "stackAux" : "stack";
		let widthQuotient = this.parent.fieldSize.w / this.fieldSize.w;
		let heightQuotient = this.parent.fieldSize.vh / this.fieldSize.vh;
		if (stack !== void 0) {
			if (stack === "reset") {
				for (let x = 0, len = this.fieldSize.w; x < len; x++) {
					for (let y = 0, top = this.fieldSize.h; y < top; y++) {
						this.drawableStack[x][y] = 0;
					}
				}
			}
			else this.drawableStack = JSON.parse(JSON.stringify(stack));
		}

		this.parent.canvasClear(aux);
		this.parent.drawArray(aux, this.drawableStack, 0, -1 * (this.fieldSize.hh - this.visibleFieldBufferHeight), void 0, 0, widthQuotient, heightQuotient);
	}

	drawActivePiece() {
		if (!this.isEnable) return;
		let aux = this.isAux ? "pieceAux" : "piece";
		this.parent.canvasClear(aux);
		if (this.piece.y < -10) return;
		let widthQuotient = this.parent.fieldSize.w / this.fieldSize.w;
		let heightQuotient = this.parent.fieldSize.vh / this.fieldSize.vh;
		this.parent.drawArray(aux, this.piece.activeArr, this.piece.x, ~~(this.piece.y) - (this.fieldSize.hh - this.visibleFieldBufferHeight), void 0, 0, widthQuotient, heightQuotient);
		let q = this.parent.canvasCtx[aux];
		let type = 3;
		q.globalAlpha = 1;//- ((game.frames % 50) / 130);
		this.parent.drawArray(aux, this.piece.activeArr, this.piece.x, ~~(this.piece.y) + this.checkDrop(40) - (this.fieldSize.hh - this.visibleFieldBufferHeight), void 0, type, widthQuotient, heightQuotient);
		q.globalAlpha = 1;
		if (this.piece.spin.spin) {
			let b = 0;
			if (this.lock.delay % 8 < 2) {
				b = 1;
			} else if (this.lock.delay % 8 < 6) {
				b = 2;
			}
			this.parent.drawArray(aux, this.piece.activeArr, this.piece.x, ~~(this.piece.y) - (this.fieldSize.hh - this.visibleFieldBufferHeight), void 0, b, widthQuotient, heightQuotient);
		}
		if (this.piece.spin.mini) {
			let b = 0;
			if (this.lock.delay % 8 < 4) {
				b = 1;
			}
			this.parent.drawArray(aux, this.piece.activeArr, this.piece.x, ~~(this.piece.y) - (this.fieldSize.hh - this.visibleFieldBufferHeight), void 0, b, widthQuotient, heightQuotient);
		}
	}

	checkValid(arr, cx, cy) {
		let px = cx + this.piece.x;
		let py = ~~(cy + this.piece.y)
		for (let x = 0; x < arr.length; x++) {
			for (let y = 0; y < arr[x].length; y++) {
				if (arr[x][y] && this.testGridSpace(x + px, y + py)) return false;
			}
		}
		return true;
	}

	checkDrop(dis) {
		let a = 0;
		while (this.checkValid(this.piece.activeArr, 0, a) && dis >= a) {
			a++;
		}

		return a - 1;
	}

	spawnPiece(index, held) {
		if (!this.isSpawnablePiece || (!this.isActive && !held)) return;
		if (this.isSpawnablePiece && this.canSpawnPiece(index, held)) {
			this.piece.spin.spin = 0;
			this.piece.spin.mini = 0;
			this.piece.y += this.checkDrop(1);
			let temp = this.piece.template;
			this.canRaiseGarbage = true;
			this.lock.lowest = 0;
			this.checkManipulatedPiece();
			if (this.parent.ai.active) {
				let h = this.piece.hold || 0;

				let pieceX = temp[h].x + Math.min((this.fieldSize.w - 5), ~~((this.fieldSize.w - 10) / 2)),
					pieceY = temp[h].y + this.fieldSize.hh - 2;
				this.parent.ai.evaluate(this.piece.active, this.piece.hold, this.piece.held, this.preview.queue[0], -1, -1, this.stack, pieceX, pieceY, this.piece.x, this.piece.y, this.piece.rot, this.piece.template, (fp, fx, fy, frot) => { this.parent.drawArray("stack", this.piece.template[fp].matrix[frot], fx, ~~(fy) - (this.fieldSize.hh - this.visibleFieldBufferHeight), void 0, 0) });
			}
		} else this.checkLose();
	}

	checkLose() {
		this.piece.enable = false;
		this.lock.delay = 30;
		this.lock.reset = 15;
		//this.lock.lowest = this.checkLowBlock();
		this.lock.lowest = 0;

		//this.lock.delay = 15;
		this.piece.y = -38;
		this.piece.x = 0;
		this.loseDelay = 30;
		this.piece.isAir = true;
		this.isSpawnablePiece = false;
	}

	immediatelyLose() {
		this.piece.enable = false;
		this.lock.delay = 30;
		this.lock.reset = 15;
		//this.lock.lowest = 0;
		this.lock.delay = 15;
		this.piece.y = -38;
		this.piece.x = 0;
		this.parent.checkLose();
		this.piece.isAir = true;
		this.isSpawnablePiece = false;
		for (let l = this.delayParamsLength; l >= 0; l--) {
			this.delay[l] = -99;
		}
	}

	resetGrid() {
		for (let x = 0; x < this.fieldSize.w; x++) {
			for (let y = 0; y < this.fieldSize.h; y++) {
				this.stack[x][y] = 0;
			}
		}
		this.drawStack(this.stack);
	}

	checkRespawnOrDie() {
		let isLose = false;

		if (!this.parent.rpgAttr.isOn) {
			isLose = true;
		} else {
			if (this.parent.rpgAttr.checkZeroHP()) {
				isLose = true;
			} else {
				if (this.insane.isOn && this.parent.rpgAttr.isWOIHPMode) {
					this.insane.delay.del = 5;
					this.insane.status = "fail";
					this.setDelay(0, -9);
				}
				else this.parent.rpgAttr.addHP(-500);
				if (this.parent.rpgAttr.checkZeroHP()) {
					isLose = true;
				}
			}
		}
		if (isLose) {
			this.parent.checkLose();
			this.delay[0] = -60;

			for (let l = this.delayParamsLength; l >= 0; l--) {
				this.delay[l] = -82;
				this.isSpawnablePiece = false;
			}

		} else {
			this.resetGrid();
			this.isSpawnablePiece = true;
			this.delay[0] = 10;
		}
	}

	canSpawnPiece(index, held) {
		let temp = this.piece.template;
		this.piece.active = index;
		this.piece.rot = 0;
		this.piece.activeArr = temp[index].matrix[0];
		this.piece.x = temp[index].x + Math.min((this.fieldSize.w - 5), ~~((this.fieldSize.w - 10) / 2));
		this.piece.y = this.fieldSize.hh - 2;
		this.lock.delay = 30;
		this.lock.reset = 15;

		this.piece.kickTable = temp[index].kickTable;
		this.piece.spin.spin = false;
		this.piece.spin.mini = false;
		this.piece.rotated = false;
		this.piece.isAir = false;
		this.piece.moved = false;
		this.piece.dirty = true;
		this.piece.enable = true;
		this.piece.spinTable = temp[index].spinDetection;

		if (!held && this.canRaiseGarbage) this.raiseGarbage();

		if (!this.checkValid(this.piece.activeArr, 0, 0)) return false;
		return true;
	}

	previewGenerateBag() {
		let pieceList = [];
		this.preview.bag.forEach(function(a) { pieceList.push(a) });
		for (var i = 0; i < pieceList.length - 1; i++)
		{
			var temp = pieceList[i];
			var rand = ~~((pieceList.length - i) * this.rngPreview.next()) + i;
			pieceList[i] = pieceList[rand];
			pieceList[rand] = temp;
		};
		return pieceList;
	}

	previewInitialize() {
		this.preview.queue = [];
		this.preview.queue.push.apply(this.preview.queue, this.previewGenerateBag());

		this.previewDraw();
	}

	previewModify(arr, count) {
		this.preview.queue.length = 0;
		for (let m = 0; m < count; m++)
			for (let a of arr) {
				this.preview.queue.push(a);
			}
		this.previewDraw();
	}

	previewNextBag(held) {
		if (!this.isSpawnablePiece && !held) return;

		let next = this.preview.queue.shift();
		this.preview.queue.push(...this.previewGenerateBag());
		if (!this.isActive) this.preview.queue.unshift(next);
		this.previewDraw();
		return next;
	}

	hold() {
		if (this.piece.enable && this.piece.holdable) {
			let tmp = this.piece.hold;
			if (!this.piece.held) {
				this.piece.held = true;
				if (this.piece.hold == void 0) {
					this.piece.hold = this.piece.active;
					this.spawnPiece(this.previewNextBag(true), true);
					this.parent.playSound("hold_first");
				} else {
					this.piece.hold = this.piece.active;
					this.parent.playSound("hold");
					this.spawnPiece(tmp, true);
				}
			}
			this.holdDraw();
		}
	}

	holdDraw() {
		if (this.isAux || !this.isEnable) return;
		this.parent.canvasClear('hold');
		if (this.piece.hold === void 0) return;
		let m = this.piece.hold;
		let piece = this.piece.template[m];
		if (m === 2) {
			this.parent.drawArray(
				"hold",
				piece.matrix[0],
				piece.x - 2.5,
				piece.y + 0.5,
				void 0,
				0
			);
		}
		else if (m === 4) {
			this.parent.drawArray(
				"hold",
				piece.matrix[0],
				piece.x - 2.5,
				piece.y,
				void 0,
				0
			);
		}
		else {
			this.parent.drawArray(
				"hold",
				piece.matrix[0],
				piece.x - 2,
				piece.y + 0.5,
				void 0,
				0
			);

		}

	}

	previewDraw() {
		if (this.isAux || !this.isEnable) return;
		this.parent.canvasClear('next');
		this.parent.canvasClear('nextQueue');
		for (let i = 0; i < 5; i++) {
			let m = this.preview.queue[i];
			let piece = this.piece.template[m];
			if (i == 0) {
				if (m === 2) {
					this.parent.drawArray(
						"next",
						piece.matrix[0],
						piece.x - 2.5,
						piece.y + 0.5,
						void 0,
						0
					);
				}
				else if (m === 4) {
					this.parent.drawArray(
						"next",
						piece.matrix[0],
						piece.x - 2.5,
						piece.y,
						void 0,
						0
					);
				}
				else {
					this.parent.drawArray(
						"next",
						piece.matrix[0],
						piece.x - 2,
						piece.y + 0.5,
						void 0,
						0
					);

				}
			} else {
				if (m === 2) {
					this.parent.drawArray(
						"nextQueue",
						piece.matrix[0],
						piece.x - 2.5,
						(piece.y + 0.5) + ((i - 1) * 3),
						void 0,
						0
					);
				}
				else if (m === 4) {
					this.parent.drawArray(
						"nextQueue",
						piece.matrix[0],
						piece.x - 2.5,
						(piece.y) + ((i - 1) * 3),
						void 0,
						0
					);
				}
				else {
					this.parent.drawArray(
						"nextQueue",
						piece.matrix[0],
						piece.x - 2,
						(piece.y + 0.5) + ((i - 1) * 3),
						void 0,
						0
					);
				}
			}
		}
	}

	checkManipulatedPiece() {
		if (!this.piece.enable) return false;
		let air = this.checkValid(this.piece.activeArr, 0, 1);
		let change = false;


		if (~~this.piece.y !== ~~this.piece.last.y) {
			this.piece.last.y = ~~this.piece.y;
			change = true;
		}
		if (this.piece.dirty) {
			this.piece.dirty = false;
			change = true;
		}

		if (change) {
			for (let x = 0; x < this.piece.activeArr.length; x++) {
				for (let y = 0; y < this.piece.activeArr[x].length; y++) {
					if (this.piece.activeArr[x][y]) {
						if ((~~this.piece.y + y) > this.lock.lowest) {
							this.lock.lowest = ~~this.piece.y + y;
							this.lock.reset = 15;
						}
					}
				}
			}
		}
		//ih("STAT-STAT",`resets: ${this.lock.reset}, lowest alt:  ${this.lock.lowest}`)


		if (air) {
			if (!this.piece.isAir) {
				this.piece.isAir = true;
			}
		} else {
			if (this.piece.isAir) {
				this.piece.isAir = false;
				if (!this.piece.isHardDrop) {
					this.parent.playSound("lock");
				}
			}
		}

		if (this.piece.isAir) {
			this.lock.delay = this.settings.lock;
			this.piece.moved = true;
		} else {
			if (this.lock.delay <= 0 || this.lock.reset <= 0) {
				this.piece.y = ~~this.piece.y;
				this.piece.lastDrop.x = this.piece.x;
				this.piece.lastDrop.y = this.piece.y;
				this.piece.held = false;
				let hasDelay = this.setDelay(0, void 0);
				this.piece.dirty = true;
				if (!this.piece.isHardDrop) {
					this.parent.playSound("lock");
				}
				this.piece.isHardDrop = false;
				this.detectSpin(!this.piece.moved);
				this.addPieceStack(this.piece.activeArr);

				for (let h = 0; h < this.delayParamsLength; h++) {
					if (this.delay[h] > 0) hasDelay = true;
				}
				if (hasDelay) {
					this.piece.y = -90;
					this.piece.enable = false;
				}

				if (this.piece.enable && this.isSpawnablePiece) {
					this.spawnPiece(this.previewNextBag(), false);
				}
			}
		}

	}

	updatePiece() {

		if (!this.piece.enable) return;
		let gravity = this.settings.gravity;
		if (this.piece.isAir) {
			if (gravity < 1) {
				this.piece.y += gravity;
			} else if (gravity == 1) {
				this.piece.y += this.checkDrop(1);
			} else if (gravity > 1) {
				this.piece.y += this.checkDrop(gravity);
			}
			this.lock.delay = this.settings.lock;
			this.checkManipulatedPiece();
		}
		// I do not use "else" for a reason that exists in an if statement above.
		if (!this.piece.isAir) {
			this.piece.y = ~~this.piece.y;
			this.lock.delay--;
			this.checkManipulatedPiece();
		}
		//this.moveX(1 * (((manager.frames % 50) < 10) ? 1 : -1));
		//this.rotatePiece(1);/**/


	}

	setDelay(type, value) {
		let delayAdd = value !== void 0 ? value : this.delayAdd[type];
		if (delayAdd <= 0) delayAdd = -10;
		this.delay[type] = delayAdd;
		return (this.delay[type] > 0);
	}

	rotatePiece(direction) {
		if (!this.piece.enable || (!this.piece.is180able && direction == 2)) return;
		let temp = this.piece.template[this.piece.active].matrix;
		let pos = ((this.piece.rot % 4) + 4) % 4;
		let nPos = (((this.piece.rot + direction) % 4) + 4) % 4;
		let rotate = temp[nPos];
		var dirType = "right";
		switch (direction) {
			case 1:
				dirType = "right";
				break;
			case -1:
				dirType = "left";
				break;
			case 2:
				dirType = "double";
				break;
		}

		for (let i = 0, len = this.piece.kickTable[dirType][pos].length; i < len; i++) {
			if (this.checkValid(
					rotate,
					this.piece.kickTable[dirType][pos][i][0],
					this.piece.kickTable[dirType][pos][i][1]
				)) {
				this.parent.playSound("rotate");
				let kickX = this.piece.kickTable[dirType][pos][i][0],
					kickY = this.piece.kickTable[dirType][pos][i][1];
				this.piece.x += kickX;
				this.piece.y += kickY;
				this.piece.kickDistance.x = kickX;
				this.piece.kickDistance.y = kickY;
				this.piece.rot = nPos;
				this.piece.activeArr = rotate;
				this.lock.delay = this.settings.lock;

				this.lock.reset--;

				this.piece.moved = false;
				this.piece.rotated = true;

				this.detectSpin(!this.piece.moved && this.piece.rotated);
				if (this.piece.spin.spin) {
					this.parent.playSound("prespin");
				}
				if (this.piece.spin.mini) {
					this.parent.playSound("prespinmini");
				}

				this.checkManipulatedPiece();


				break;
			}
		}
	}

	detectSpin(isMoveAir) {
		let spin = 0;
		let mini = 0;
		let x1y2 = 0;
		let check = 0;
		let posX = this.piece.x;
		let posY = ~~(this.piece.y);
		let rot = this.piece.rot;
		let a = this.piece.spinTable;
		if (isMoveAir) {
			if ((this.piece.active == 6 || this.isAllSpin) && this.piece.active !== 2) {
				for (let x = 0, len1 = a.highX[rot].length; x < len1; x++) {
					if (this.testGridSpace(posX + a.highX[rot][x], posY + a.highY[rot][x])) {
						spin++;
						check++;
					}
				}
				for (let x = 0, len1 = a.lowX[rot].length; x < len1; x++) {
					if (this.testGridSpace(posX + a.lowX[rot][x], posY + a.lowY[rot][x])) {
						mini++;
						check++;
					}
				}
				if (this.piece.kickDistance.y >= 2 && (this.piece.kickDistance.x >= 1 || this.piece.kickDistance.x <= -1)) {
					x1y2++;
				}
			}
		}

		this.piece.spin.spin = 0;
		this.piece.spin.mini = 0;
		//this.piece.spin.x1y2 = 0;

		if (check >= 3) {
			if (x1y2 > 0) {
				this.piece.spin.spin = 1;
			} else {
				if (spin > 1) {
					this.piece.spin.spin = 1;
				} else if (mini > 1) {
					this.piece.spin.mini = 1;
				}

			}
		}


	}

	moveX(shift) {
		if (!this.piece.enable) return;
		if (this.checkValid(this.piece.activeArr, shift, 0)) {
			this.piece.x += shift;

			this.lock.reset--;
			this.lock.delay = this.settings.lock;
			this.piece.moved = true;
			this.piece.rotated = false;
			this.parent.playSound("move");
			this.checkManipulatedPiece();
			/*try {
				throw new Error("wat")
			} catch(e) {
				console.log(e.stack)
			}*/
		}
	}

	shiftDelay() {
		if (this.parent.flagPresses.right && this.handling.xFirst === 0) {
			this.handling.xFirst = 1;
		}
		if (this.parent.flagPresses.left && this.handling.xFirst === 0) {
			this.handling.xFirst = -1;
		}

		if (this.handling.xFirst !== 0) {
			if (this.parent.flagPresses.right && !this.parent.flagPresses.left) {
				this.handling.xFirst = 1;
			} else if (this.parent.flagPresses.left && !this.parent.flagPresses.right) {
				this.handling.xFirst = -1;
			}
		}



		if (!this.parent.flagPresses.right && !this.parent.flagPresses.left && this.handling.xFirst !== 0) {
			this.handling.xFirst = 0;
		}

		if (this.dasCancellation.on) {
			let x = 0;
			if (this.parent.flagPresses.right) x |= 0b10;
			if (this.parent.flagPresses.left) x |= 0b01;

			this.dasCancellation.main.assign(x);
		}

		if (this.parent.flagPresses.left || this.parent.flagPresses.right) {
			this.handling.das++;
			if (this.handling.das >= this.settings.das) {
				this.handling.arr++;
				for (let i = 0; i < this.fieldSize.w; i++) {
					let dir = 0;
					if (this.handling.xFirst === 1) {
						if (this.parent.flagPresses.left) {
							dir = -1;
						} else {
							dir = 1;
						}
					}
					if (this.handling.xFirst === -1) {
						if (this.parent.flagPresses.right) {
							dir = 1;
						} else {
							dir = -1;
						}
					}
					if (dir !== 0) this.moveX(dir);
					if (this.settings.arr !== 0) break;
				}
			}
		}


	}
	resetDelayAutoshiftRate() {
		this.handling.das = 0;
	}

	hardDrop() {
		if (this.piece.enable) {
			let distance = this.checkDrop(this.fieldSize.h);
			let startingPos = this.piece.y;
			this.piece.y += distance;
			let endingPos = this.piece.y;
			if (distance > 0) {
				this.piece.moved = true;
				this.piece.rotated = false;
			}
			this.lock.delay = -1;
			this.piece.isHardDrop = true;
			this.parent.playSound("harddrop");
			let m = [];

			this.parent.score += distance * 2;
			for (let x = 0, km = this.piece.activeArr.length; x < km; x++) {
				for (let y = 0, mm = this.piece.activeArr[x].length; y < mm; y++) {
					if (this.piece.activeArr[x][y]) {
						m.push(x + this.piece.x);
						m.push(y + this.piece.y);
						break;
					}
				}
			}
			let ln = m.length;
			let ll = Math.max(distance, 10);
			/*for (let depth = 0; depth < ll; depth++) */
			for (let lk = 0; lk < ln; lk += 1) {
				let zx = m[lk * 2],
					zy = (m[(lk * 2) + 1]);
				this.effects.hardDrop.addItem({
					x: zx,
					y: zy,
					frames: 40,
					maxf: 40,
					dep: ll,
					blk: this.piece.active
				});
			}

			this.checkManipulatedPiece();
		}
	}

	softDrop() {
		if (this.piece.enable) {

			if (this.piece.isAir) {
				let gravity = (this.settings.gravity * (20));
				let initial = Math.floor(this.piece.y);
				if (gravity < 1) {
					this.piece.y += gravity;
				} else if (gravity == 1) {
					this.piece.y += this.checkDrop(1);
				} else if (gravity > 1) {
					this.piece.y += this.checkDrop(gravity);
				}
				let final = Math.floor(this.piece.y);
				if (initial !== final) {
					this.piece.moved = true;
					this.parent.score += final - initial;
				}
				this.checkManipulatedPiece();
			}
			//this.lock.delay = -1;
		}
	}

	addPieceStack(arr) {
		let lines = 0;
		let valid = false;
		let hasDelay = false;
		for (let x = 0; x < arr.length; x++) {
			for (let y = 0; y < arr[x].length; y++) {
				if (arr[x][y]) {
					let px = x + this.piece.x;
					let py = ~~(y + this.piece.y);
					this.stack[px][py] = arr[x][y];
					if (py >= this.fieldSize.hh) {

						valid = true;
					}
				}
			}
		}

		let isPuffOut = false;

		if (!valid) {
			this.checkLose();
		}

		for (let y = 0; y < this.fieldSize.h; y++) {
			let count = 0;
			for (let x = 0; x < this.fieldSize.w; x++) {
				if (this.testGridSpace(x, y)) count++;
			}
			if (count >= this.fieldSize.w) {
				this.clear.linesReady.push(y);
				lines++;
			}
		}
		if (lines == 0) {
			this.combo = -1;
			if (this.piece.spin.spin) {
				this.parent.playSound("tspin0");
				this.parent.score += 400 * this.level;
			}
			if (this.piece.spin.mini) {
				this.parent.playSound("tspinmini0");
				this.parent.score += 100 * this.level;
			}

			if (this.combo < 0) {
				this.parent.engageCleartextCombo(true, 0);
			}

			/*for (let p = 0, len = this.garbageWait.length; p < len; p++) {
			 let k = this.gar
			}*/
			if (this.garbageWait.length > 0) {

				this.emitAttack(this.garbageWait, true);
				this.garbageWait.length = 0;
			}

			//if (this.parent.garbageBlocking === "full" && this.isProfessional) this.raiseGarbage();
			if (this.parent.garbageBlocking === "full") {
				this.canRaiseGarbage = true;
			}
			if (this.insane.isOn) {
				this.insane.delay.del = 10;
				this.insane.status = "fail";
				this.nextVoice.name = `insane_fail`;
				this.nextVoice.duration = 20;
				this.setDelay(0, 50);
			}
			if (this.isAux) isPuffOut = true;
		} else {
			hasDelay = this.setDelay(2, void 0);
			if (this.parent.garbageBlocking === "limited") {
				this.canRaiseGarbage = true;
			}
		}

		if (isPuffOut) {
			for (let x = 0; x < arr.length; x++) {
				for (let y = 0; y < arr[x].length; y++) {
					if (arr[x][y]) {
						let px = x + this.piece.x;
						let py = ~~(y + this.piece.y);
						this.stack[px][py] = 0;

						this.effects.clearAnim.addItem({
							x: px,
							y: py,
							frames: 0,
							maxf: 25
						});

					}
				}
			}
		}


		if ((!this.insane.isUnlimited || this.insane.isCommandedEnd) && (this.insane.time <= 0 || this.insane.isCommandedEnd) && this.insane.isOn) {
			this.insane.delay.turningOff = 5;
			this.setDelay(0, 5);
		}
		if (!hasDelay) {
			this.clearLine();
		}

		if (!this.isActive) this.canRaiseGarbage = false;

		this.drawStack(this.stack);
		this.checkStackAltitude();
	}

	stackCollapse() {
		let hasAbove = false;
		for (let j = 0, len = this.clear.linesDelayed.length; j < len; j++) {
			let y = this.clear.linesDelayed.shift();
			for (let full = y; full >= 1; full--) {
				for (let x = 0; x < this.fieldSize.w; x++) {
					if (this.stack[x][full - 1]) hasAbove = true;
					this.stack[x][full] = this.stack[x][full - 1];
				}
			}
		}


		if (sound && hasAbove) this.parent.playSound("collapse");

		if (this.canRaiseGarbage) {

			this.raiseGarbage();
			this.canRaiseGarbage = false;
		}
		this.drawStack(this.stack);
		this.checkStackAltitude();
	}

	emitAttack(marr, isLaunch) {
		let add = [];

		let neutralized = false;

		let remaining = 0;

		let blobGarbage = 0;

		let particleSpeed = this.parent.particleGarbageDelay;

		for (let l = 0, os = marr.length; l < os; l++) {
			let remain = 0;
			let j = {
				a: marr[l],
				surplus: 0
			}
			if (this.parent.activeType === 1) j = this.garbageConversion(marr[l]);
			let count = this.parent.activeType == 0 ? marr[l] : j.a;



			while (this.parent.garbage.length > 0 && this.parent.garbageBlocking !== "none" && count > 0) {
				let reference = this.parent.garbage[0];
				if (reference.count <= 0) {
					this.parent.garbage.shift();
					continue;
				};
				neutralized = true;
				let min = Math.min(reference.count, count);
				reference.count -= min;
				if (reference.count === 0) {
					this.parent.garbage.shift();
				}
				count -= min;
			}

			while (this.parent.garbageBehind.length > 0 && this.parent.garbageBlocking !== "none" && count > 0) {
				let reference = this.parent.garbageBehind[0];
				if (reference.count <= 0) {
					this.parent.garbageBehind.shift();
					continue;
				};
				neutralized = true;
				let min = Math.min(reference.count, count);
				reference.count -= min;
				if (reference.count === 0) {
					this.parent.garbageBehind.shift();
				}
				count -= min;
			}

			if (this.parent.activeType == 1) remaining += count;



			/*while (count > 0) {
			 if (this.parent.garbageBlocking !== "none") {
			  this.parent.garbage[0];
			  neutralized = true;
			 }
			 else remain++;
			 count--;
			}*/
			if (this.parent.activeType == 1) {
				remain += count;
				//remaining = count;
			} else {
				remain += count;
			}
			remaining += marr[l];
			if (remain > 0) add.push(remain);
		}
		this.parent.garbageLength = this.parent.calculateGarbage();
		this.parent.garbageBehindLength = this.parent.calculateGarbageBehind();
		if (neutralized) this.parent.rpgAttr.hpDamage = this.parent.calculateHPDamage();
		if (this.parent.isGarbageCollectionMode) {
			neutralized = true;
			for (let l = 0, os = add.length; l < os; l++) {
				this.parent.woi.add(add[l]);
			}
			add.length = 0;
		}

		let asset = this.parent.assetRect(this.isAux ? "AUX-FIELD-CHARACTER-CANVAS" : "FIELD-CHARACTER-CANVAS");
		let sizemult = this.isAux ? 0.47 : 1;
		let aw = asset.width;
		let ah = asset.height;
		let ax = asset.x;
		let ay = asset.y;

		let selfTarget = this.parent.assetRect("GARBAGE-TRAY-DIV");
		let gw = selfTarget.width;
		let gh = selfTarget.height
		let gx = selfTarget.x;
		let gy = selfTarget.y;
		let cs = this.parent.fieldCellSize;

		let qw = sizemult * (this.parent.fieldSize.w / this.fieldSize.w);
		let qh = sizemult * ((this.parent.fieldSize.vh) / this.fieldSize.vh)

		let ifllSound = true;
		let m = this.hitSoundReduce;

		let bez = {
			x1: 0,
			x2: 0.9,
			x3: 1,
			x4: 1,
			y1: 0,
			y2: 0.9,
			y3: 1,
			y4: 1,
		};

		if (add.length > 0) {
			if (this.meteredGarbageWaitMode && !isLaunch) {
				for (let l = 0, os = add.length; l < os; l++) {
					this.garbageWait.push(add[l]);
				}
			} else {
				let z = this.sendGarbage(add, this.parent.activeType);

				let p = 0;
				for (let b = 0, o = add.length; b < o; b++) {
					p += add[b];
				}
				if (Object.keys(z).length > 0) {
					game.forEachPlayer(e => {
						if (e.player in z) {

							let target = e.assetRect("GARBAGE-TRAY-DIV");
							let tw = target.width;
							let th = target.height
							let tx = target.x;
							let ty = target.y;
							e.addDelayHandler(false, (particleSpeed * (neutralized ? 2 : 1)), () => {
								e.playSound(`hit${Math.max(Math.min(5, remaining - m - 2), 1)}`);
								e.garbageLastForTray.assign(e.garbageLength);
								e.garbageBehindLastForTray.assign(e.garbageBehindLength);
								if (!e.isDying && !e.isFinishAble && !e.isDead) e.engageShakeIntensityHit(Math.max(Math.min(5, remaining - m - 2), 1));
								animatedLayers.create(undefined, 30,
									tx + (tw / 2),
									ty + (th / 2),
									0,
									0,
									200,
									200,
									12,
									12,
									0.5,
									"block_hit",
									10,
									this.cellSize,
								);
							});

							//TODO REM
							e.check1v1Overhead(true, e.garbageLength + e.garbageBehindLength, e.garbageLength + e.garbageBehindLength, false);



							if (!neutralized) {
								e.addParticle(true, "attack", 0, 0,
									(ax) + (this.piece.lastDrop.x * cs),
									(ay) + ((this.piece.lastDrop.y - this.fieldSize.hh) * cs),
									tx + (tw / 2),
									ty + (th / 2),
									particleSpeed, 1, false, bez, true, {
										frame: particleSpeed * (0.3 + (Math.min(9, remaining) * 0.1)),
										r: 255,
										g: 255,
										b: 255,
									});
							} else {
								e.addDelayHandler(true, particleSpeed, () => {
									e.addParticle(true, "attack", 0, 0,
										gx + (gw / 2),
										gy + (gh / 2),
										tx + (tw / 2),
										ty + (th / 2),
										particleSpeed, 1, false, bez, true, {
											frame: particleSpeed * (0.3 + (Math.min(9, remaining) * 0.1)),
											r: 255,
											g: 255,
											b: 255,
										});

								});
							}

						}

					});
				}
				this.hitSoundReduce = 0;
			}
			if (this.meteredGarbageWaitMode && !isLaunch) {
				let garbageWait = 0;
				for (let qq = 0, leng = this.garbageWait.length; qq < leng; qq++) garbageWait += this.garbageWait[qq];
				this.parent.playSound(`charge${garbageWait > 13 ? "_high" : ""}`);
				this.hitSoundReduce = 0;
				ifllSound = false;
			}
		}

		if ((neutralized) && remaining > 0) {

			this.parent.addParticle(true, "attack", 0, 0,
				(ax) + (this.piece.lastDrop.x * cs),
				(ay) + ((this.piece.lastDrop.y - this.fieldSize.hh) * cs),
				gx + (gw / 2),
				gy + (gh / 2),
				particleSpeed, 1, false, bez, true, {
					frame: particleSpeed * (0.3 + (Math.min(9, remaining) * 0.1)),
					r: 255,
					g: 255,
					b: 255,
				});


			this.parent.addDelayHandler(true, this.parent.particleGarbageDelay, () => {
				this.parent.garbageLastForTray.assign(this.parent.garbageLength);
				this.parent.garbageBehindLastForTray.assign(this.parent.garbageBehindLength);
				this.parent.playSound(`hit${Math.max(Math.min(5, remaining - m - 2), 1)}`);
				animatedLayers.create(undefined, 30,
					gx + (gw / 2),
					gy + (gh / 2),
					0,
					0,
					200,
					200,
					12,
					12,
					0.5,
					"block_hit",
					10,
					this.cellSize,
				);
			})
		}

	}

	garbageConversion(mu) {
		let h = 0;
		let g = 0;
		let l = 4;
		let q = 0;
		while (h < mu) {
			h++;
			if (h == 1) g += 4;
			else g += 1 + ~~(q / 2.5);
			q++;
		}
		return {
			a: g,
			surplus: Math.max(0, mu - h)
		};
	}

	sendGarbage(lt, m) {
		this.parent.playerTarget.length = 0;
		let garbageTarget = {};
		let hpDamage = this.parent.rpgAttr.attributes.attack + (this.parent.rpgAttr.attributes.atkTolerance * this.parent.seeds.field.next());
		let blockToBlobDivisor = 1.8;
		manager.forEachPlayer(player => {
			if (player.player !== this.parent.player && player.team !== this.parent.team) this.parent.playerTarget.push(player.player);
		});
		let add = 0;
		for (let b = 0, o = lt.length; b < o; b++) {
			add += lt[b];
		}

		let amtBlob = 0;
		let amtBlock = lt;
		let totalAdd = add;
		let isRandomBlockGarb = !this.isProfessional;

		let isWait = false;
		// block to blob conversion
		let h = 0;
		let g = 0;
		let l = 4;
		let q = 0;
		if (m === 0)
			while (h < totalAdd) {
				h++;
				if (h == 1) g += 4;
				else g += 1 + ~~(q / 2.5);
				q++;
			}
		amtBlob = [g];
		manager.forEachPlayer(player => {
			if (this.parent.playerTarget.indexOf(player.player) !== -1) {

				if (player.activeType === 1) {
					player.addGarbage(this.parent.player, m == 0 ? amtBlob : amtBlock, isWait, false, 70, hpDamage * (1 / (blockToBlobDivisor)));
				}
				if (player.activeType === 0) {
					player.addGarbage(this.parent.player, amtBlock, isWait, isRandomBlockGarb, 10, hpDamage);

				}
				if (add > 0) garbageTarget[player.player] = add;

			}
		});


		return garbageTarget;
	}
	raiseGarbage() {
		let a = this.parent.garbage.filter(m => m.frames <= manager.frames && !m.wait),
			len = a.length,
			count = 0,
			removeHp = 0;
		let mpl = {};


		let j = [];
		if (len > 0)
			for (let s = 0, qw = this.parent.garbage; s < qw.length; s++) {
				j.push(qw[s].id);
			}

		while (len > 0) {
			let r = a[0]; //a.shift();
			let index = j.indexOf(r.id);
			if (r.count > 0) {
				//this.parent.garbage.shift();

				index = j.indexOf(r.id);

				for (var x = 0; x < this.fieldSize.w; x++) {
					for (var y = 0; y < this.fieldSize.h; y++) {
						this.stack[x][y] = this.stack[x][y + 1];
					}
				}
				for (var x = 0; x < this.fieldSize.w; x++) {
					this.stack[x][this.fieldSize.h - 1] = 9 + this.parent.garbageType;
				}
				if (r.allmess) {
					if ((this.parent.seeds.field.next()) < this.messiness) {
						while (true) {
							let la = ~~(this.parent.seeds.field.next() * this.fieldSize.w);
							if (la !== this.currentGarbageHole) {
								this.currentGarbageHole = la;
								break;
							}
						}
					}
					this.stack[(this.currentGarbageHole)][this.fieldSize.h - 1] = 0;
				}
				else this.stack[r.row][this.fieldSize.h - 1] = 0;
				count++;
				r.count--;
			}
			if (this.parent.garbage[index].count <= 0) {

				this.parent.garbage.splice(index, 1);
				j.splice(index, 1);
				a.shift(); /**/
				len--;
			}

			removeHp += r.hpdmg;

			//#83
			if (this.parent.rpgAttr.isOn) game.forEachPlayer(player => {
				if (r.player === player.player) {
					if (player.player in mpl) mpl[player.player] += r.hpdmg;
					else mpl[player.player] = r.hpdmg;
				}
			});



			if (count >= this.garbageLimit && this.garbageLimit > 0) break;

		}
		if (count > 0) {
			this.parent.playSound("garbage");
			if (count > 1 && count < 4) {
				this.parent.playVoice("damage1");
			}
			if (count > 3) {
				this.parent.playVoice("damage2");
				this.parent.rectanim.play("damage2");
			}

			this.parent.rpgAttr.addHP(-removeHp);
			this.canRaiseGarbage = this.parent.garbageBlocking !== "full";
			let isLose = false;
			if (this.parent.rpgAttr.isOn && this.parent.rpgAttr.checkZeroHP()) {
				isLose = true;
			}
			if (isLose) this.immediatelyLose();
			if (this.parent.rpgAttr.isOn) {
				game.forEachPlayer(player => {
					if (player.player in mpl) player.rpgAttr.addHP(mpl[player.player] * player.rpgAttr.attributes.lifesteal);

				});
			}


			this.parent.garbageLength = this.parent.calculateGarbage();
			this.parent.garbageLastForTray.assign(this.parent.garbageLength);

			this.parent.rpgAttr.hpDamage = this.parent.calculateHPDamage();

			this.drawStack(this.stack);
			this.checkStackAltitude();
		}
	}

	clearLine() {
		let lines = 0;
		let isPC = !this.insane.isOn;
		let hasDelay = false;
		let isCounter = false;
		let firstY = 0;
		let lengthLines = this.clear.linesReady.length;
		this.clear.blocks.length = 0;
		for (let m = 0, h = this.clear.linesReady.length; m < h; m++) {
			let y = this.clear.linesReady.shift();
			if (m == 0) firstY = y + (lengthLines / 2);
			lines++;
			if (this.insane.isOn) {
				this.insane.blocks.requireLine--;
			}
			for (let x = 0; x < this.fieldSize.w; x++) {
				this.clear.blocks.push({
					x: x,
					y: y,
					c: this.stack[x][y]
				})
				this.stack[x][y] = 0;
			};
			this.clear.linesDelayed.push(y);

		}

		for (let y = 0; y < this.fieldSize.h; y++) {
			for (let x = 0; x < this.fieldSize.w; x++) {
				if (this.testGridSpace(x, y)) isPC = false;
				else this.stack[x][y] = 0;
			}
		}

		if (lines > 0) {
			hasDelay = this.setDelay(1, void 0);
			if (!this.isProfessional && isPC) hasDelay = this.setDelay(1, 0);

			this.combo++;
			if (this.combo > 0 && !this.isAux) {
				if (!this.insane.isOn) this.parent.engageCleartextCombo(true, 1, `${this.combo} Combo`);
			}
			if (this.piece.spin.spin) {
				if (this.piece.active !== 6) {
					let letter = ["z", "l", "o", "s", "i", "j", "t"][this.piece.active];
					this.parent.engageCleartext("spin", true, language.translate(`${letter}spin`));
				} else this.parent.engageCleartextTSpin(true, 0, lines);
				if (!this.insane.isOn) this.b2b++;
				if (this.piece.active !== 4) this.parent.playSound(`tspin${Math.min(lines, 4)}${this.b2b > 0 ? "_b2b" : ""}`);
			} else if (this.piece.spin.mini) {
				if (this.piece.active !== 6) {
					let letter = ["z", "l", "o", "s", "i", "j", "t"][this.piece.active];
					this.parent.engageCleartext("spin", true, language.translate(`${letter}spin`));
				} else

					this.parent.engageCleartextTSpin(true, 1, lines);
				if (this.insane.isOn) this.b2b = -1;
				else this.b2b++;
				if (this.piece.active !== 4) this.parent.playSound(`tspinmini${Math.min(lines, 4)}${this.b2b > 0 ? "_b2b" : ""}`);
			} else if (lines > 3) {
				if (this.insane.isOn) this.b2b = -1;
				else this.b2b++;
				this.parent.playSound(`line${Math.min(lines, 4)}${this.b2b > 0 ? "_b2b" : ""}`);
			} else {
				this.b2b = -1;
				this.parent.playSound(`line${Math.min(lines, 4)}`);
			}

			if (isPC) {
				let asset = this.isAux ? this.parent.assetRect("AUX-FIELD") : this.parent.assetRect("FIELD");
				let plm = this.isAux ? 0.47 : 1;

				let ax = asset.x;
				let ay = asset.y;
				let px = ax + ((this.piece.lastDrop.x) * this.parent.fieldCellSize * plm);
				let py = ay + ((this.piece.lastDrop.y - this.fieldSize.hh) * this.parent.fieldCellSize * plm);

				let tx = ax + ((this.parent.fieldSize.w / 2) * this.parent.fieldCellSize * plm);
				let ty = ay + ((this.parent.fieldSize.hh * 0.294) * this.parent.fieldCellSize * plm);

				animatedLayers.create(undefined, 60,
					tx,
					ty,
					0,
					0,
					200,
					200,
					12,
					12,
					1,
					"perfect_clear",
					10,
					plm * 1.2,
				);

				let bez = {

					x1: 0,
					x2: 0,
					x3: 1,
					x4: 1,
					y1: 0,
					y2: 0.3,
					y3: 1 + (Math.random() * 0.2),
					y4: 1,

				};

				this.pcSpam.frame = 20 * 60;
				this.pcSpam.count++;
				if (this.pcSpam.count >= 3) {
					htmlEffects.add(language.translate("pc_spam"), px, py, 50, {
						name: "chain-text-anim",
						iter: 1,
						timefunc: "cubic-bezier(0,0,1,0)",
						initdel: 0,
					}, `text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; --__chaintext_size: 1.4em; color: #fff`);
					//this.insane.delay.ready = 15;
				}

				for (let m = 0, h = this.clear.blocks.length; m < h; m++) {
					let n = this.clear.blocks[m];
					let y = n.y;
					let x = n.x;
					let c = n.c;




					let mx = ax + (this.getQPosX(x) * this.parent.fieldCellSize) + (this.getQPosX(1) * this.parent.fieldCellSize / 2);
					let my = ay + (this.getQPosY(y - this.fieldSize.hh) * this.parent.fieldCellSize) + (this.getQPosY(1) * this.parent.fieldCellSize / 2);
					let particleSpeed = 121 + (Math.random() * 70);
					bez.y3 = 1 + (Math.random() * 0.2);
					this.parent.addParticle(true, "blobblock", 1, c,
						mx,
						my,
						mx + this.getQPosX((Math.random() * 50) - (Math.random() * 50)) * this.parent.fieldCellSize,
						my + (this.getQPosY((Math.random() * 4) + 4) * this.parent.fieldCellSize) + game.resolution.h,
						particleSpeed, ((this.getQPosX(1) * this.parent.fieldCellSize) / game.cellSize), false, bez, false, false, {
							speed: (Math.random() * 180) - (Math.random() * 180)
						})


				}

				/*htmlEffects.add("Perfect Clear", px, py, 50, {
					name: "chain-text-anim",
					iter: 1,
					timefunc: "cubic-bezier(0,0,1,0)",
					initdel: 0,
				}, `text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; --__chaintext_size: 1.4em; color: #fff`);*/
			}
			if (this.piece.active !== 6) {
				this.parent.engageCleartext("line", true, language.translate(`line${lines}`));
				if (this.piece.spin.spin || this.piece.spin.mini) {
					let letter = ["z", "l", "o", "s", "i", "j", "t"][this.piece.active];
					this.parent.engageCleartext("spin", true, language.translate(`${letter}spin${this.piece.spin.mini ? "mini" : ""}`));
				}
			} else if (!(this.piece.spin.spin || this.piece.spin.mini)) {
				this.parent.engageCleartext("line", true, language.translate(`line${lines}`));
			}

			if (this.parent.garbageBlocking == "full") {
				this.canRaiseGarbage = false;
			}
			if (!this.insane.isOn && !this.isAux) this.parent.engageCleartext("b2b", this.b2b > 0, language.translate("b2b", [this.b2b]));



			if (this.parent.canAttack) {
				this.hitSoundReduce = 0;
				let garbage = this.getAttack(lines, this.piece.spin.spin, this.b2b, this.combo, isPC);

				if (isPC) this.hitSoundReduce += 4;

				if (this.piece.spin.spin == 1) {
					if (lines == 2) this.hitSoundReduce++;
					if (lines == 3) this.hitSoundReduce += 2;
				}

				isCounter = this.parent.garbageLength > 0 && garbage > this.parent.garbageLength && !this.meteredGarbageWaitMode && !isPC && lines > 2;



				if (!hasDelay) {
					this.emitAttack([garbage]);
				} else {
					this.parent.delayedGarbage = garbage;
					this.attackSendDelay
				}

			}

			let lm = this.executeSpellName(lines, this.piece.spin.spin, this.b2b, this.combo, isPC, isCounter);
			this.activeVoiceLine = this.executeVoice(lines, this.piece.spin.spin, this.b2b, this.combo, isPC, isCounter);

			if (this.insane.isOn) {
				this.setDelay(0, 10);
				this.setDelay(1, 25);
				this.parent.insaneBg.moveEye(this.fieldSize.w / 2, firstY - this.fieldSize.hh);

				this.parent.insaneBg.changeColorCustom(
					this.blockColors.r[this.piece.active],
					this.blockColors.g[this.piece.active],
					this.blockColors.b[this.piece.active],
				);
				if (this.insane.blocks.requireLine <= 0) {
					this.insane.delay.del = 10;
					this.insane.status = "success";
					let ji = 1;
					if (this.insane.blocks.phase >= 4) ji++;
					if (this.insane.blocks.phase >= 7) ji++;
					if (this.insane.blocks.phase >= 10) ji++;
					if (this.insane.blocks.phase >= 13) ji++;
					this.activeVoiceLine = lm = `spell${ji}`;


					this.nextVoice.name = `insane_success`;

					this.repeatSpellVoice = Math.max(Math.min(this.insane.blocks.seq - 4), 0);


					this.setDelay(0, 50);
				} else {
					this.insane.blocks.seq++;
					this.activeVoiceLine = this.insane.blocks.seq >= 5 ? "init5" : `init${this.insane.blocks.seq}`;
					lm = "";

					this.nextVoice.duration = -1;
				}

			}

			if (hasDelay) {
				this.spellAnimName = lm;
			} else {
				this.spellAnimName = lm;
				this.stackCollapse();
				this.parent.playVoice(this.activeVoiceLine);
				if (this.spellAnimName !== "") this.parent.rectanim.play(this.spellAnimName);
			}

			let spinDetected = this.piece.spin.spin,
				miniDetected = this.piece.spin.mini;

			if (hasDelay)
				for (let m = 0, h = this.clear.linesDelayed.length; m < h; m++) {
					let y = this.clear.linesDelayed[m];

					for (let x = 0; x < this.fieldSize.w; x++) {
						this.effects.clearAnim.addItem({
							x: x,
							y: y,
							frames: 0,
							maxf: this.delay[1]
						});
					}
				}


			this.parent.score += this.level * (SCORE_TABLE[isPC ? "pc" : "nopc"][`${this.b2b > 0 ? "" : "no"}b2b`][`${spinDetected ? "spin" : miniDetected ? "mini" : "line"}`][lines] + SCORE_TABLE.combo * Math.max(0, this.combo))
			this.parent.swapMode.add("combo");
			this.drawStack(this.stack);

		}
	}
	getAttack(line, spin, b2b, combo, pc, garbage) {
		let a = 0,
			b = 0;
		if (this.attackType == "multiplier") {
			if (line > 3) {
				b = 4;
			} else if (line == 1) {
				b = spin ? 2 : 0;
			} else if (line == 2) {
				b = spin ? 4 : 1;
			} else if (line == 3) {
				b = spin ? 6 : 2;
			}
			if (b2b > 0) b += 1;
			b *= 1;

			a = b + ((b / 4) * combo);
			//if (b == 0) a += [0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3][Math.min(combo, 20)] * 1;
			if (b == 0) {
				let s = 0;
				let z = 1;
				let lm = 4;
				let kp = 0;
				while (s < combo) {
					if (s >= z) {
						a++;
						kp++;
						z += ((kp - 1) * 2) + (kp * lm);
					}
					s++;
				}
			}
			if (pc && line > 0) {
				a += 10;
			}
			//break;
		} else if (this.attackType == "scorebased") {

			let base = 1;
			let c = 0;
			if (line > 3) c = base * 4;
			if (line == 3) c = base * (spin ? 4 : 2);
			if (line == 2) c = base * (spin ? 3 : 1);
			if (line == 1) c = base * (spin ? 2 : 0);
			if (combo <= 1) { c += base * 0.50; }
			else if (combo > 1 && combo <= 6) { c += base * 1; }
			else if (combo > 6 && combo <= 10) { c += base * 2; }
			else if (combo > 10 && combo <= 14) { c += base * 3; }
			else if (combo > 14 && combo <= 18) { c += base * 4; }
			else if (combo > 18) { c += base * 5; }

			if (b2b > 0) c += base;
			if (pc) c = base * 6;

			let g = this.parent.blob.decreaseTargetPoint;
			let h = this.parent.blob.targetPoint;
			a = ~~(c + ((c / 8) * ((70 - (h - g)) / 2)));

		} else if (this.attackType == "scorebasedSwap") {

			let base = 1;
			let c = 0;
			if (line > 3) c = base * 4;
			if (line == 3) c = base * (spin ? 6 : 2);
			if (line == 2) c = base * (spin ? 4 : 1);
			if (line == 1) c = base * (spin ? 2 : 0);
			if (combo <= 1) { c += base * 0.50; }
			else if (combo > 1 && combo <= 3) { c += base * 1; }
			else if (combo > 3 && combo <= 5) { c += base * 2; }
			else if (combo > 5 && combo <= 7) { c += base * 3; }
			else if (combo > 7 && combo <= 10) { c += base * 4; }
			else if (combo > 10) { c += base * 5; }

			if (b2b > 0) c += base;
			if (pc) c = base * 10;
			c *= (1 + (0.2 * this.parent.swapMode.a));


			a = ~~(c + ((c / 4) * ((this.parent.blob.decreaseTargetPoint - 1) / this.parent.blob.targetPoint)));
		} else if (this.attackType == "normal") {
			if (pc && line > 0) {
				a = 10;
			} else {
				if (line > 3) {
					a = 4
				} else if (line == 1) {
					a = spin ? 2 : 0;
				} else if (line == 2) {
					a = spin ? 4 : 1;
				} else if (line == 3) {
					a = spin ? 6 : 2;
				}

				if (combo > 1 && combo <= 3) { a += 1; }
				else if (combo > 3 && combo <= 5) { a += 2; }
				else if (combo > 5 && combo <= 7) { a += 3; }
				else if (combo > 7 && combo <= 10) { a += 4; }
				else if (combo > 10) { a += 5; };

				if (b2b > 0) a += 1;
			}



		}
		return Math.floor(a);
	}

	executeVoice(line, spin, b2b, combo, pc, counter) {
		let a = 0,
			b = 0;
		let str = "";
		if (this.isAux) return "";
		if (this.attackType === "scorebased") {
			if (pc && line > 0) {
				a = 10;
			} else {
				if (line > 3) {
					a = 4
				} else if (line == 1) {
					a = spin ? 2 : 0;
				} else if (line == 2) {
					a = spin ? 4 : 1;
				} else if (line == 3) {
					a = spin ? 6 : 2;
				}
			}

			if (combo > 1 && combo <= 6) { a += 1; }
			else if (combo > 6 && combo <= 10) { a += 2; }
			else if (combo > 10 && combo <= 14) { a += 3; }
			else if (combo > 14 && combo <= 18) { a += 4; }
			else if (combo > 18) { a += 5; };

			if (b2b > 0) a += 1;
		} else {
			if (pc && line > 0) {
				a = 10;
			} else {
				if (line > 3) {
					a = 4;
				} else if (line == 1) {
					a = spin ? 2 : 0;
				} else if (line == 2) {
					a = spin ? 4 : 1;
				} else if (line == 3) {
					a = spin ? 6 : 2;
				}
			}

			if (combo > 1 && combo <= 3) { a += 1; }
			else if (combo > 3 && combo <= 5) { a += 2; }
			else if (combo > 5 && combo <= 7) { a += 3; }
			else if (combo > 7 && combo <= 10) { a += 4; }
			else if (combo > 10) { a += 5; };

			if (b2b > 0) a += 1;
		}
		if (line > 3) str = `gtris`;
		else if (a === 0) str = `init${Math.min(combo + 1, 5)}`;
		else if (a > 0) str = `spell${Math.min(a, 5)}`;

		if (counter) str = "counterattack";


		return str;
	}
	executeSpellName(line, spin, b2b, combo, pc, counter) {
		let a = 0,
			b = 0;
		let str = "";
		if (this.isAux) return str;
		if (this.attackType === "scorebased") {
			if (pc && line > 0) {
				a = 10;
			} else {
				if (line > 3) {
					a = 4
				} else if (line == 1) {
					a = spin ? 2 : 0;
				} else if (line == 2) {
					a = spin ? 4 : 1;
				} else if (line == 3) {
					a = spin ? 6 : 2;
				}
			}

			if (combo > 1 && combo <= 6) { a += 1; }
			else if (combo > 6 && combo <= 10) { a += 2; }
			else if (combo > 10 && combo <= 14) { a += 3; }
			else if (combo > 14 && combo <= 18) { a += 4; }
			else if (combo > 18) { a += 5; };

			if (b2b > 0) a += 1;
		} else {
			if (pc && line > 0) {
				a = 10;
			} else {
				if (line > 3) {
					a = 4;
				} else if (line == 1) {
					a = spin ? 2 : 0;
				} else if (line == 2) {
					a = spin ? 4 : 1;
				} else if (line == 3) {
					a = spin ? 6 : 2;
				}
			}

			if (combo > 1 && combo <= 3) { a += 1; }
			else if (combo > 3 && combo <= 5) { a += 2; }
			else if (combo > 5 && combo <= 7) { a += 3; }
			else if (combo > 7 && combo <= 10) { a += 4; }
			else if (combo > 10) { a += 5; };

			if (b2b > 0) a += 1;
		}
		//if (line > 3) str = ``;
		//if (a === 0) str = `init${Math.min(combo + 1, 5)}`;
		if (a > 0) str = `spell${Math.min(a, 5)}`;

		if (counter) str = "counter";


		return str;
	}
}

class NeoBlobIndividual {
	constructor(type, blob, xOffset, yOffset, disOffset, rotOffset) {
		this.type = type;
		this.blob = blob;
		this.offset = {
			x: xOffset || 0,
			y: yOffset || 0,
			distance: disOffset || 0,
			rot: rotOffset || 0
		}
	}
}

class NeoBlobGhost {
	constructor(blob, x, y) {
		this.x = x;
		this.y = y;
		this.color = blob;
	}
}

class NeoplexianBlob {

	constructor(parent) {
		this.opponentGarbageBehind = {};
		this.parent = parent;
		this.isActive = false;
		this.isEnable = false;
		this.isControl = false;
		this.isWarning = false;
		this.isWarningTopOut = false;
		this.isAux = false;
		this.isSpawnablePiece = true;
		this.isFever = false;
		this.warningTrig = new NumberChangeFuncExec(0, (t) => {
			this.isWarning = t;
		});

		this.isChainUp = false;

		this.isDelayEnabled = true;
		this.insane = new InsaneMode("blob", this);
		this.colors = 4;
		this.colorSet = [1, 2, 3, 4, 5];
		this.isSpecialDropset = false;
		this.piece = {
			x: 0,
			y: 0,
			rot: 0,
			delay: 0,
			rotAnim: {
				timeAnim: 0,
				maxTime: 5,
				rot: 0,
				curRot: 0,
				diffRot: 0
			},
			activeArr: [[]],
			active: {
				parameters: {
					sx: 0,
					sy: 0,
					matrix: [[]],
					type: 0,
					color1: 0,
					color2: 0
				},
				type: 0,
				color1: 1,
				color2: 1,
				colorRot: 0,
			},
			dropset: [],
			dropsetN: 0,
			isBig: false,
			isAir: false,
			moved: false,
			dirty: false,
			held: false,
			enable: false,
			rotated: false,
			isHardDrop: false,
			kickTable: null,

			kickDistance: {
				x: 0,
				y: 0
			},
		};
		for (let i = 0; i < 16; i++) this.piece.dropset.push(0);

		this.dropForecast = {
			stack: [[]],
			blobs: [],
			poppable: [],
			PERMANENT_MASK: 512
		}

		this.lastPiece = {
			x: 0,
			y: 0,
			rot: 0
		};
		this.delay = {};
		this.delayAdd = {};
		this.delayDefault = {
			0: 10,
			1: 40,
			2: 4
		};
		this.delayParamsLength = 8;
		for (let h = 0; h < this.delayParamsLength; h++) {
			this.delay[h] = -30;
			this.delayAdd[h] = 10;
		}

		this.decreaseTargetPoint = 1;
		this.fixedAtkHandicap = 1;
		this.targetGarbagePlayer = {};

		this.rngPreview = new ParkMillerPRNG();

		this.preview = {
			bag: BLOBS.c2,
			queue: []
		};
		this.settings = {
			das: 8,
			arr: 4,
			gravity: 2 / 60,
			lock: 40,
			sft: 35 / 60,
		};
		this.handling = {
			das: 0,
			arr: 0,
			xFirst: 0,
		};
		this.lock = {
			move: 15,
			rot: 15,
			delay: 30,
			delayMax: 30,
			lockSoftdrop: 2,
		};
		this.lockPrevent = {
			rotate: 0
		};
		this.stack = [];
		this.drawableStack = [];
		this.poppedStack = [];
		this.firstGroupsPop = [];
		this.fieldSize = {
			w: 6,
			h: 32,
			vh: 12,
			hh: 20
		};
		this.defaultFieldSize = {
			w: 6,
			hh: 30,
			vh: 12,
			h: 42
		}

		this.activeBlobDisplay = {
			two: {
				"1|0": new NeoBlobIndividual(0, 0, 1, 1, 1, -1),
				"1|1": new NeoBlobIndividual(0, 0, 1, 1, 0, -1),
			},
			three: {
				"1|0": new NeoBlobIndividual(0, 0, 1, 1, 1, -1),
				"1|1": new NeoBlobIndividual(0, 0, 1, 1, 0, -1),
				"2|1": new NeoBlobIndividual(0, 0, 1, 1, 1, 0),

			},
			four: {

			}
		};

		this.rotateAnimationTimer = 0;
		this.rotateAnimationType = 0;

		this.visibleFieldBufferHeight = 3;
		this.visibleFieldHeight = 0;

		this.chain = 0;
		this.actualChain = 0;
		this.previousChain = 0;
		this.forecastedChain = 0;
		this.requiredChain = 0;
		this.isChainOffsetting = false;
		this.eraseInfo = [];
		this.erasedBlocks = [];
		this.holes = 0;
		this.delayDrop = -73;
		//TODO blob req
		this.blobRequire = 2;
		this.delayedGarbage = 0;
		this.divScoreTrash = 0;
		this.targetPoint = 0.70;

		this.NUISANCE = 6;
		this.HARD = 7;

		this.garbageOrder = {
			on: true,
			order: [0, 3, 2, 5, 1, 4],
			n: 0
		};

		this.dasCancellation = new NumberChangeFuncExec(0, (c) => {
			this.handling.das = 0;
		});

		this.dstModulus = 0;
		this.pop = {
			x: 0,
			y: 0
		};
		this.rotate180Timer = 0;

		this.canFallTrash = true;
		this.canFallTrashAfterFever = true;

		this.activeVoiceLine = "";
		this.repeatSpellVoice = 0;
		this.nextVoice = {
			name: "",
			duration: -2,
		}

		this.effects = {
			drop: new ArrayFunctionIterator((aray) => {
				let frames = 0;
				let isExist = false;
				let c = this.parent.canvasCtx[this.isAux ? "pieceAux" : "piece"];
				for (let wm = 0, lm = aray.length; wm < lm; wm++) {
					let idx = aray[wm];
					let landing = false;

					let bouncebackInt = 0;

					if (!("delay" in idx)) {
						idx.delay = -38;
					}

					if (!("landFrames" in idx)) {
						idx.landFrames = 0;
						//idx.landMax = 0;
					}
					if (!("landMax" in idx)) {

						idx.landMax = idx.landFrames;
					}

					if (!("triggerBoardRot" in idx)) {
						idx.triggerBoardRot = false;
					}

					if (idx.delay > 0) {
						idx.delay--;
					} else if (idx.frames >= 0) {
						idx.frames--;

					} else if (idx.landFrames >= 0) {
						idx.landFrames--;
						
					}
					frames += Math.max(0, idx.frames) + Math.max(0, idx.landFrames);
					
					if (idx.frames === 0 && idx.isLandSound) {
						switch (idx.isLandSound) {
							case 1: {
								this.parent.playSound("blub_drop");
								break;
							}
							case 2: {
								this.parent.playSound("blub_garbage1");
								break;
							}
							case 3: {
								this.parent.playSound("blub_garbage2");
								break;
							}
						}
					}
					if (idx.frames == 0) {
						if (idx.triggerBoardRot && this.triggerBoardRotates.garbageLanding.on) {
							this.parent.executeRotateWobble(this.triggerBoardRotates.garbageLanding.intensity, 40, this.isAux);
						}
					}
					//let bez = Math.min(bezier((idx.maxf - idx.frames) / idx.maxf, idx.y0, idx.y1, 0, 0, 0, 1), idx.y1);
					//NEXT
				}
				for (let wm = 0, lm = aray.length; wm < lm; wm++) {
					let idx = aray[wm];
					
					let landing = idx.delay <= 0 && idx.frames < 0 && idx.landFrames >= 0;
					let kf = Math.max(0, idx.frames);
					
					let sizeBez = 1;
					let yBez = idx.y0 + Math.min(idx.y1, (((idx.maxf - kf) / idx.maxf) * (idx.y1 - idx.y0)));
					let py = yBez;
					if (idx.fallType == 2) {
						py = Math.min(bezier((idx.maxf - idx.frames) / idx.maxf, idx.y0, idx.y1, 0, 0, 0, 1), idx.y1);
						if (landing && idx.frames < 0) {

							let mm = 0;
							if ((idx.landFrames % 5) > 3) {
								mm = 0.5;
							}
							py = idx.y1 + mm;
							sizeBez = 1 - mm;
						}
					} else if (idx.fallType == 1) {
						py = idx.y0 + Math.min(idx.y1, (((idx.maxf - kf) / idx.maxf) * (idx.y1 - idx.y0)));
						if (landing && idx.frames < 0) {

							let mm = 0;
							if ((idx.landFrames % 5) > 3) {
								mm = 0.5;
							}
							py = idx.y1 + mm;
							sizeBez = 1 - mm;
						}
					} else {
						py = idx.y0 + Math.min(idx.y1, (((idx.maxf - kf) / idx.maxf) * (idx.y1 - idx.y0)));
						if (landing && idx.frames < 0) {

							py = Math.max(idx.y1 + bezier((idx.landFrames) / idx.landMax, 0, 0.5, 0, 0, 0, 1), idx.y1);
							sizeBez = -Math.min(bezier((idx.landFrames) / idx.landMax, 0, 0.5, 0, 0, 0, 1), 0.5) + 1;
						}
					}
					//let bez = (idx.y0 + ((idx.y1 - idx.y0) * ((idx.maxf- idx.frames) / idx.maxf)));
					let sx = this.parent.fieldSize.w / this.fieldSize.w;
					let sy = this.parent.fieldSize.vh / this.fieldSize.vh;

					let x = ~~((idx.x) * this.parent.cellSize * sx),
						y = (py - (this.fieldSize.hh)) * this.parent.cellSize * sy; //- (2 * this.cellSize);

					




					if (this.parent.isVisible && frames > 0) {
						c.drawImage(
							manager.skinBlob.canvas,
							((idx.cell == 6 && this.parent.garbageType == 0) ? 1 : 0) * this.parent.cellSize,
							(idx.cell - 1) * this.parent.cellSize,
							this.parent.cellSize,
							this.parent.cellSize,
							x,
							y + (this.parent.cellSize * this.parent.visibleFieldBufferHeight),
							this.parent.cellSize * sx,
							this.parent.cellSize * sy * sizeBez,
						);

						let ta = this.parent.canvasses[this.isAux ? "pieceAux" : "piece"];
						c.clearRect(0, 0, ta.width, this.parent.cellSize * this.parent.visibleFieldBufferHeight);

					}




				}
				if (frames <= (0) && aray.length > 0) {
					aray.length = 0;
					//this.parent.canvasClear(c);
					this.drawStack(this.stack);
				}
			}),
			//next: new ArrayFunctionIterator()
			/*drop: new ArrayFunctionIterator((aray) => {
			 let frames = 0;
			 for (let wm = 0, lm = aray.length; wm < lm; wm++) {
			  let idx = aray[wm];
			  if (!("delay" in idx)) {
			   idx.delay = -38;
			  }
			
			  if (idx.delay > 0) {
			   idx.delay--;
			  } else if (idx.frames > 0) {
			   idx.frames--;
			   if (idx.frames === 0 && idx.isLandSound) {
			    switch (idx.isLandSound) {
			     case 1: {
			      this.parent.playSound("blub_drop");
			      break;
			     }
			     case 2: {
			      this.parent.playSound("blub_garbage1");
			      break;
			     }
			     case 3: {
			      this.parent.playSound("blub_garbage2");
			      break;
			     }
			
			    }
			   }
			  }
			  frames += idx.frames + (idx.frames > 0 ? 1 : 0);
			
			  let bez = Math.min(bezier(idx.frames / idx.maxf, idx.y1, idx.y0, 0, 1, 1, 1), idx.y1);
			  //let bez = (idx.y0 + ((idx.y1 - idx.y0) * ((idx.maxf- idx.frames) / idx.maxf)));
			  let sx = this.parent.fieldSize.w / this.fieldSize.w;
			  let sy = this.parent.fieldSize.vh / this.fieldSize.vh;
			
			  let x = ~~((idx.x) * this.parent.cellSize * sx),
			   y = (bez - (this.fieldSize.hh)) * this.parent.cellSize * sy; //- (2 * this.cellSize);
			
			  let c = this.parent.canvasCtx[this.isAux ? "pieceAux" : "piece"];
			
			
			
			  if (this.parent.isVisible) {
			   c.drawImage(
			    manager.skinBlob.canvas,
			    0 * this.parent.cellSize,
			    idx.cell * this.parent.cellSize,
			    this.parent.cellSize,
			    this.parent.cellSize,
			    x,
			    y + (this.parent.cellSize * this.parent.visibleFieldBufferHeight),
			    this.parent.cellSize * sx,
			    this.parent.cellSize * sy,
			   );
			
			   let ta = this.parent.canvasses[this.isAux ? "pieceAux" : "piece"];
			   c.clearRect(0, 0, ta.width, this.parent.cellSize * this.parent.visibleFieldBufferHeight);
			
			  }
			
			
			
			
			 }
			 if (frames <= 0 && aray.length > 0) {
			  aray.length = 0;
			  this.drawStack(this.stack);
			 }
			})*/
			next: {
				a: new ObjectFunctionIterator((object) => {
					let frame = this.effects.next.frame;
					let max = this.effects.next.max;
					for (let j in object) {
						let ref = object[j];
						let x1 = (ref.px1 + ref.sx1);
						let y1 = (ref.py1 + ref.sy1);
						let x2 = (ref.px2 + ref.sx2);
						let y2 = (ref.py2 + ref.sy2);
						let ox = x1 + ((x2 - x1) * ((frame) / max));
						let oy = y1 + ((y2 - y1) * ((frame) / max));
						let ms = 1.5;

						let isSameColor = ref.color1 == ref.color2;

						if (ref.type == 4) {
							this.drawRect("blobNext",
								ox / 2,
								oy / 2,
								0,
								ref.color1,
								ms * 2,
								ms * 2,
								false);
						} else {
							this.drawArray(
								"blobNext",
								ref.blob,
								ox,
								oy,
								void 0,
								0,
								ms, ms,
								false, false
							);
						}
					}
				}),
				frame: 0,
				max: 6
			}
		}

		for (let hb = 0; hb < 3; hb++) {
			this.effects.next.a.addItem(hb, {
				blob: [[0]],
				type: 0,
				color1: 0,
				color2: 0,
				px1: 0,
				px2: 0,
				py1: [-1.5, 0.5, 2.5][hb],
				py2: [0.5, 2.5, 3.5][hb],
				sx1: 0,
				sy1: 0,
				sx2: 0,
				sy2: 0
			});
		}

		this.blobColors = {
			r: [255, 255, 0, 0, 255, 255, 0, 127],
			g: [255, 0, 255, 0, 255, 0, 0, 0],
			b: [255, 0, 0, 255, 0, 255, 255, 255]
		};
		this.triggerBoardRotates = {
			garbageLanding: {
				on: false,
				intensity: 2
			},
			a: {
				intensity: 0
			}
		};

		this.allClearText = {

			a: new NumberChangeFuncExec(null, (l) => {
				let a = this.allClearText;
				a.frame = a.max;
				a.current = l;
				let o = a.presets[l];
				a.bez = o[4];
				a.on = o[0];
				a.start[0] = o[1][0];
				a.start[1] = o[1][1];
				a.end[0] = o[2][0];
				a.end[1] = o[2][1];

				a.max = o[3];
				a.frame = o[3];

			}),
			on: false,
			current: 0,
			start: [20, 1],
			end: [0, 1],
			frame: 0,
			max: 30,
			bez: {
				y1: 0,
				y2: 0.9,
				y3: 1,
				y4: 1,
				s1: 0,
				s2: 0.9,
				s3: 1,
				s4: 1,
			},
			presets: ALL_CLEAR_ANIMATION_PRESETS
		};
		this.isAllClear = false;
		this.isAllClearTemp = -9;
	}

	runAllClearAnim(aux) {
		let isBool = this.allClearText.on;
		if (this.allClearText.frame > 0) {
			this.allClearText.frame--;
			isBool = true;

		}

		if (isBool) {
			let cs = this.parent.cellSize;
			let ga = this.allClearText;
			let s = 9;
			let ar = 512 / 440;
			let centerY = (cs * s / 2);
			let centerX = cs * (ar * s / 2);
			let bezY = 1;
			let bezS = 1;
			//ga.frame = (game.frames % 35);
			if (ga.frame > 0) {
				ga.frame--;

				bezY = bezier((ga.max - ga.frame) / ga.max, 0, 1,
					ga.bez.y1,
					ga.bez.y2,
					ga.bez.y3,
					ga.bez.y4,
				);
				bezS = bezier((ga.max - ga.frame) / ga.max, 0, 1,
					ga.bez.s1,
					ga.bez.s2,
					ga.bez.s3,
					ga.bez.s4,
				);
			}

			let py = 6 + (this.parent.fieldSize.vh * (ga.start[0] + ((bezY) * (ga.end[0] - ga.start[0])))),
				ps = 1;
			this.parent.canvasCtx[aux].drawImage(
				game.misc.zenkeshi,
				0,
				0,
				512,
				440,
				(cs * (this.parent.fieldSize.w / 2)) - centerX,
				(cs * py) - centerY,
				(cs * ar * s),
				(cs * s)
			);
		}
	}

	playAllClearAnim(toggle) {
		this.allClearText.a.assign(toggle);
	}

	dropsetReset(array) {
		this.piece.dropset.length = 0;
		for (let i = 0; i < 16; i++)
			if (array?.[i]) {
				this.piece.dropset.push(array[i]);
			}
		else this.piece.dropset.push(0);

		this.piece.dropsetN = 0;
	}

	setBlob(type, color1, color2) {
		let c = color1,
			d = color2
		let ma = [
   [
    [
     [0, 0, 0],
     [c, d, 0],
     [0, 0, 0]
    ],
    [
     [0, 0, 0],
     [0, d, 0],
     [0, c, 0]
    ],
    [
     [0, 0, 0],
     [0, d, c],
     [0, 0, 0]
    ],
    [
     [0, c, 0],
     [0, d, 0],
     [0, 0, 0]
    ]], [
       [
        [0, 0, 0],
        [c, d, 0],
        [0, d, 0]
       ],
       [
        [0, 0, 0],
        [0, d, d],
        [0, c, 0]
       ],
       [
        [0, d, 0],
        [0, d, c],
        [0, 0, 0]
       ],
       [
        [0, c, 0],
        [d, d, 0],
        [0, 0, 0]
       ]
      ],
   [
       [
        [0, 0, 0],
        [d, d, 0],
        [0, c, 0]
       ],
       [
        [0, 0, 0],
        [0, d, c],
        [0, d, 0]
       ],
       [
        [0, c, 0],
        [0, d, d],
        [0, 0, 0]
       ],
       [
        [0, d, 0],
        [c, d, 0],
        [0, 0, 0]
       ]
      ],
   [
       [
        [0, 0, 0],
        [c, c, 0],
        [d, d, 0]
       ],
       [
        [0, 0, 0],
        [c, d, 0],
        [c, d, 0]
       ],
       [
        [0, 0, 0],
        [d, d, 0],
        [c, c, 0]
       ],
       [
        [0, 0, 0],
        [d, c, 0],
        [d, c, 0]
       ]
      ],
      [
             [
                           [0, 0, 0],
                           [d, d, 0],
                           [d, d, 0],
                          ],
             [
              [0, 0, 0],
              [d, d, 0],
              [d, d, 0],
             ],
                          [
                           [0, 0, 0],
                           [d, d, 0],
                           [d, d, 0],
                          ],
                                       [
                                         [0, 0, 0],
                                        [d, d, 0],
                                        [d, d, 0],
                                       ]
            ]
      ][type];
		let t = 0;
		if (this.isFever || this.insane.isOn) t = 2;
		if (type == 1 && type == 2) t = 1;
		let centerX = 0;
		let centerY = 0;
		if (type < 3) {
			centerX = 1;
			centerY = 1;
		}

		return ({
			index: "",
			matrix: ma,
			color1: c,
			color2: d,
			rot: c,
			type: type,
			sx: 3,
			sy: 0,
			blobCenterX: centerX,
			blobCenterY: centerY,
			kickTable: {
				2: {
					right: [
  [[0, 0], [0, -1], [-1, 0], [0, -1], [-1, -1], [-1, 0]],
  [[0, 0], [0, -1], [0, -1], [1, 0], [0, -1]],
  [[0, 0], [0, -1], [1, 0], [0, -1], [1, -1], [1, 0]],
  [[0, 0], [0, -1], [0, -1], [-1, 0], [0, -1]],
  ],
					left: [
  [[0, 0], [0, -1], [1, 0], [0, -1], [1, -1], [1, 0]],
  [[0, 0], [0, -1], [0, -1], [-1, 0], [0, -1]],
  [[0, 0], [0, -1], [-1, 0], [0, -1], [-1, -1], [-1, 0]],
  [[0, 0], [0, -1], [0, -1], [1, 0], [0, -1]],
  ],
					double: [
  [[0, 0], [0, 1]],
  [[0, 0], [0, 1]],
  [[0, 0], [0, 2]],
  [[0, 0], [0, 2]]
  ]
				},
				0: {
					right: [
  [[0, 0], [-1, 0], [0, -1], [-1, -1], [-1, 0]],
  [[0, 0], [0, -1], [0, -1], [1, 0], [0, -1]],
  [[0, 0], [1, 0], [0, -1], [1, -1], [1, 0]],
  [[0, 0], [0, -1], [0, -1], [-1, 0], [0, -1]],
  ],
					left: [
  [[0, 0], [1, 0], [0, -1], [1, -1], [1, 0]],
  [[0, 0], [0, -1], [0, -1], [-1, 0], [0, -1]],
  [[0, 0], [-1, 0], [0, -1], [-1, -1], [-1, 0]],
  [[0, 0], [0, -1], [0, -1], [1, 0], [0, -1]],
  ],
					double: [
  [[0, 0], [0, 1]],
  [[0, 0], [0, 1]],
  [[0, 0], [0, 2]],
  [[0, 0], [0, 2]]
  ]
				},
				1: {
					right: [
  [[0, 0], [-1, 0], [0, -1], [-1, -1], [1, -1]],
  [[0, 0], [0, -1], [0, -1], [1, 0], [-1, -1]],
  [[0, 0], [1, 0], [0, -1], [1, -1], [-1, -1]],
  [[0, 0], [0, -1], [0, -1], [-1, 0], [1, -1]],
  ],
					left: [
  [[0, 0], [1, 0], [0, -1], [1, -1], [-1, -1]],
  [[0, 0], [0, -1], [0, -1], [-1, 0], [1, -1]],
  [[0, 0], [-1, 0], [0, -1], [-1, -1], [1, -1]],
  [[0, 0], [0, -1], [0, -1], [1, 0], [-1, -1]],
  ],
					double: [
  [[0, 0], [0, 1]],
  [[0, 0], [0, 1]],
  [[0, 0], [0, 2]],
  [[0, 0], [0, 2]]
  ]
				},
			} [t]
		});



	}

	replaceField(gridArr, isFlipped, isInsane) {
		let cy = this.fieldSize.hh - gridArr[0].length - 1,
			lm = gridArr[0].length

		this.simulateSplashOut();

		this.stack = grid(this.fieldSize.w, this.fieldSize.h, 0);
		let blobs = [];
		//let height = this.fieldSize.h - this.fieldSize.vh - 2;
		let highest = 0;
		let highestCol = 0;
		this.drawStack(this.stack);
		{
			for (let mx = 0, x = isFlipped ? (gridArr.length - 1) : 0; isFlipped ? (x >= 0) : (x < gridArr.length); x += (isFlipped ? -1 : 1), mx++) {
				let de = 0;

				let emptyY = 0,
					occupyY = 0,
					ry = 0;
				for (let y = gridArr[x].length - 1; y > 0; y--) {
					this.stack[mx][y + cy] = gridArr[x][y];
					occupyY = ry;
					//emptyY = 0;

					if (gridArr[x][y]) {
						let hm = this.fieldSize.h + (lm - y);
						if (highest == 0 || true) {
							//highest = lm - y;
							highestCol = mx;
						}




						blobs.push({
							x: mx,
							y0: y + cy,
							y1: this.fieldSize.h - lm + y + emptyY,
							h: (this.fieldSize.h - lm + y + emptyY) - (y + cy),
							del: de,
							cell: gridArr[x][y]
						});
						de += 3;
					} else {
						emptyY++;
						ry = emptyY;
					}
				}
			}
		}
		/* else {
		   for (let x = 0; x < gridArr.length; x++) {
		    
		    let de = gridArr[0].length;

		    
		    for (let y = 0; y < gridArr[x].length; y++) {
		     this.stack[x][y + cy] = gridArr[(gridArr.length - 1) - x][y];
		     
		if (gridArr[(gridArr.length - 1) - x][y]) {
		     let hm = this.fieldSize.h + (lm - y);
		     if (highest == 0) {
		      highest = lm - y;
		      highestCol = x;
		     }
		     
		     
		      blobs.push ({
		     x: (gridArr.length - 1) - x,
		     y0: y + cy,
		     y1: this.fieldSize.h - lm + y,
		     del: de,
		     cell: gridArr[(gridArr.length - 1) - x][y]
		     });
		     de--;
		}
		    }


		   }
		  }*/



		let speed = isInsane ? 2.1 : 1.4;

		for (let blob of blobs) {
			let timeFall = Math.floor(Math.max(0, (blob.h) * speed));
			if (((speed * (blob.h)) + blob.del) > highest) highest = (speed * (blob.h)) + blob.del;
			this.effects.drop.addItem({
				x: blob.x,
				y0: blob.y0,
				y1: blob.y1,
				cell: blob.cell,
				delay: blob.del,
				frames: timeFall,
				maxf: timeFall,
				isLandSound: blob.x == highestCol ? (1) : 0,
				fallType: 0,
				landFrames: 15
			});
		}

		this.setDelay(0, 20 + Math.floor(Math.max(0, highest)));

		this.checkInstantDrop();
		this.blobCount = this.checkBlobCount(this.stack);
	}

	simulateSplashOut() {
		let asset = this.parent.assetRect(this.isAux ? "AUX-FIELD-CHARACTER-CANVAS" : "FIELD-CHARACTER-CANVAS");
		let sizemult = this.isAux ? 0.47 : 1;
		let aw = asset.width;
		let ah = asset.height;
		let ax = asset.x;
		let ay = asset.y;
		let bez = {

			x1: 0,
			x2: 0,
			x3: 1,
			x4: 1,
			y1: 0,
			y2: 0.3,
			y3: 1 + (Math.random() * 0.3),
			y4: 1,

		};
		for (let x = 0; x < this.fieldSize.w; x++) {
			for (let y = this.fieldSize.hh - 2; y < this.fieldSize.h; y++)
				if (this.stack[x][y] > 0) {
					let mx = ax + (this.getQPosX(x) * this.parent.fieldCellSize) + (this.getQPosX(1) * this.parent.fieldCellSize / 2);
					let my = ay + (this.getQPosY(y - this.fieldSize.hh) * this.parent.fieldCellSize) + (this.getQPosY(1) * this.parent.fieldCellSize / 2);
					let particleSpeed = 71 + (Math.random() * 30);
					bez.y3 = 1 + (Math.random() * 0.3);
					this.parent.addParticle(true, "blobblock", 0, this.stack[x][y] - 1,
						mx,
						my,
						mx + this.getQPosX((Math.random() * 30) - (Math.random() * 30)) * this.parent.fieldCellSize,
						my + (this.getQPosY((Math.random() * 4) + 4) * this.parent.fieldCellSize) + game.resolution.h,
						particleSpeed, ((this.getQPosX(1) * this.parent.fieldCellSize) / game.cellSize), false, bez, false);
				}
		}
	}

	testGridSpace(x, y) {
		if (x < 0 || x >= this.fieldSize.w) {
			return true;
		}
		if (y < this.fieldSize.h) {
			if (typeof this.stack[x][y] !== "undefined" && this.stack[x][y] !== 0) {
				return true;
			}
			return false;
		}
		return true;
	}

	reset() {
		this.activeVoiceLine = "";
		this.nextVoice.duration = -1;
		this.repeatSpellVoice = 0;
		this.nextVoice.name = "";
		this.opponentGarbageBehind = {};
		this.piece.x = 0;
		this.voiceDelay = 0;
		this.piece.y = -295;
		this.piece.isBig = false;

		this.garbageOrder.n = 0;


		this.playAllClearAnim(3);
		this.isAllClear = false;
		this.isAllClearTemp = -9;

		this.pop = {
			x: 0,
			y: 0
		};
		this.piece.rot = 0;
		this.piece.active.color1 = 0;
		this.piece.active.color2 = 0;
		this.piece.active.colorRot = 0;
		this.piece.activeArr = [[]];
		this.piece.isAir = false;
		this.piece.moved = true;
		this.piece.dirty = false;
		this.piece.held = false;
		this.piece.rotated = false;
		this.piece.enable = false;

		this.piece.dropsetN = 0;
		this.firstGroupsPop.length = 0;

		this.isChainUp = false;

		this.piece.isHardDrop = false;
		//this.previewInitialize();
		this.isSpawnablePiece = true;
		this.targetGarbagePlayer = {};
		this.effects.drop.reset();
		this.delayDrop = -3;


		this.dstModulus = 0;

		this.rotate180Timer = 0;

		this.canFallTrash = true;
		this.canFallTrashAfterFever = true;

		this.chain = 0;
		this.actualChain = 0;
		this.previousChain = 0;
		this.forecastedChain = 0;
		this.eraseInfo = [];
		this.erasedBlocks = [];
		this.holes = 0;
		this.delayDrop = -73;
		this.delayedGarbage = 0;
		this.divScoreTrash = 0;
		this.divScoreAttackingTrash = 0;

		this.delay = {};
		this.delayAdd = {};

		for (let h = 0; h < this.delayParamsLength; h++) {
			this.delay[h] = -100;

			this.delayAdd[h] = this.isProfessional ? 0 : this.delayDefault[h];
		}
		this.lock = {
			move: 15,
			rot: 15,
			delay: 30,
			lockSoftdrop: 2,
		};
		this.lockPrevent.rotate = 0;

		this.piece.rotAnim.rot = 0;
		this.piece.rotAnim.timeAnim = 0;
		this.piece.rotAnim.curRot = 0;
		this.piece.rotAnim.diffRot = 0;
		//TODO rewrite things

		this.defaultFieldSize.w = 6 * 1;
		this.defaultFieldSize.hh = 3 * 1;
		this.defaultFieldSize.vh = 12 * 1;

		this.fieldSize.w = 6 * 1;
		this.fieldSize.hh = 30 * 1;
		this.fieldSize.vh = 12 * 1;
		this.blobRequire = 4;
		this.fieldSize.h = this.fieldSize.vh + this.fieldSize.hh;
		this.stack = grid(this.fieldSize.w, this.fieldSize.h, 0);
		this.drawableStack = grid(this.fieldSize.w * 3, this.fieldSize.h * 3, 0);
		this.poppedStack = grid(this.fieldSize.w * 3, this.fieldSize.h * 3, 0);
		this.dropForecast.stack = grid(this.fieldSize.w * 3, (this.fieldSize.vh) * 3, 0);

		this.drawStack(this.stack);
		this.drawActivePiece();
		this.previewReset();
		this.handling = {
			das: 0,
			arr: 0,
			xFirst: 0,
		};

		this.blobCount = 0;

		this.warningTrig.assign(0);

	}

	drawRect(ctx, x, y, row, column, sx, sy, isBuffer, isEraseTop) {
		x = ~~(x * this.parent.cellSize * sx);
		y = y * this.parent.cellSize * sy; //- (2 * this.cellSize);

		let c = this.parent.canvasCtx[ctx];
		//c.fillStyle = `rgb(${Math.random()*0}, 255, 0)`;
		let cs = this.parent.cellSize;

		if (this.parent.isVisible) c.drawImage(
			manager.skinBlob.canvas,
			~~(row * cs),
			~~(column * cs),
			(cs),
			~~(cs),
			x,
			y + (isBuffer ? (this.visibleFieldBufferHeight * cs * (this.parent.fieldSize.vh / this.defaultFieldSize.vh)) : 0),
			~~(cs * sx),
			~~(cs * sy),
		);
		if (isEraseTop) {
			let a = this.parent.canvasses[ctx];
			this.parent.canvasCtx[ctx].clearRect(0, 0, a.width, this.parent.cellSize * this.parent.visibleFieldBufferHeight);

		}
	}

	drawArray(ctx, arr, cx, cy, color, rr, sx, sy, isEraseTop, isBuffer) {
		for (var x = 0, len = (arr.length); x < len; x++) {
			for (var y = 0, wid = (arr[x].length); y < wid; y++) {
				if (arr[x][y]) {
					if (arr[x][y] % 256 >= 6) {
						let c = arr[x][y];
						/*let row = 0;
						if (c & FLAG_CONNECTIONS.up) row += 1;
						if (c & FLAG_CONNECTIONS.down) row += 2;
						if (c & FLAG_CONNECTIONS.right) row += 4;
						if (c & FLAG_CONNECTIONS.left) row += 8;*/
						c %= 256;
						let row = rr || 0;

						this.drawRect(ctx, (x + cx), ~~(y) + cy, rr !== void 0 ? rr : (row + ((c == 6 && this.parent.garbageType == 0) ? 1 : 0)), color !== void 0 ? (color - 1) : (c - 1), sx || 1, sy || 1, isBuffer);
					} else {
						let c = arr[x][y];
						let row = 0;
						if (c & FLAG_CONNECTIONS.up) row += 1;
						if (c & FLAG_CONNECTIONS.down) row += 2;
						if (c & FLAG_CONNECTIONS.right) row += 4;
						if (c & FLAG_CONNECTIONS.left) row += 8;
						c %= 256;

						this.drawRect(ctx, (x + cx), ~~(y) + cy, rr !== void 0 ? rr : row, color !== void 0 ? (color - 1) : (c - 1), sx || 1, sy || 1, isBuffer);

					}
				}
			}
		}

		if (isEraseTop) {
			let a = this.parent.canvasses[ctx];
			this.parent.canvasCtx[ctx].clearRect(0, 0, a.width, this.parent.cellSize * this.parent.visibleFieldBufferHeight);

		}
	}

	getQPosX(x) {
		let sizemult = this.isAux ? 0.47 : 1;
		return sizemult * x * (this.parent.fieldSize.w / this.fieldSize.w);

	}
	getQPosY(y) {
		let sizemult = this.isAux ? 0.47 : 1;
		return sizemult * y * ((this.parent.fieldSize.vh) / this.fieldSize.vh);

	}

	emitAttack(marr) {

		let neutralized = false;
		//let lastGarbage = 0;
		let playerNeutGarb = {};

		let particleSpeed = (this.insane.isOn && this.insane.insaneType !== 1) ? 18 : this.parent.particleGarbageDelay;

		this.divScoreAttackingTrash += (marr); // / (this.targetPoint));
		let attack = Math.floor((this.divScoreAttackingTrash / (this.targetPoint)));
		let modulus = marr % (this.targetPoint);
		this.divScoreAttackingTrash %= (this.targetPoint);



		let remain = 0;
		let count = attack;
		let neutralCount = 0;
		let hasAddFev = 0;
		//let isAttacking = false;
		let garbLength = this.parent.calculateGarbage() + this.parent.calculateGarbageBehind();
		//TODO debug this
		if (((this.parent.feverStat.isOn && this.isFever) || this.insane.isOn || this.isChainOffsetting) && garbLength > 0 && count == 0) count += 1;
		attack *= (this.requiredChain > this.chain || game.isSolo ? 0 : 1);
		count *= (this.requiredChain > this.chain || game.isSolo ? 0 : 1);


		let gCount = 0,
			excessCount = 0;
		if (this.parent.activeType === 0) {
			let mc = this.garbageConversion(count, garbLength);
			let min = Math.min(mc.converted, garbLength);
			//this.divScoreAttackingTrash
			////console.log(mc, count, min, garbLength)
			count -= Math.max(0, mc.cost);
			//this.divScoreAttackingTrash
			//excessCount += mc.surplus;
			gCount += min;
		} else {

			gCount = Math.max(count, 0);
			//count -= Math.max(gCount);
		}
		while (this.parent.garbage.length > 0 && this.parent.garbageBlocking !== "none" && gCount > 0) {
			let reference = this.parent.garbage[0];
			if (reference.count <= 0) {
				this.parent.garbage.shift();
				continue;
			};
			neutralized = true;
			let min = Math.min(reference.count, gCount);
			reference.count -= min;
			neutralCount += min;
			if (reference.count <= 0) {
				this.parent.garbage.shift();
			}
			gCount -= min;
			if (this.parent.activeType == 1) count -= min;

			playerNeutGarb[reference.player] = min;

		}
		while (this.parent.garbageBehind.length > 0 && this.parent.garbageBlocking !== "none" && gCount > 0) {
			let reference = this.parent.garbageBehind[0];
			if (reference.count <= 0) {
				this.parent.garbageBehind.shift();
				continue;
			};
			neutralized = true;
			let min = Math.min(reference.count, gCount);
			reference.count -= min;
			neutralCount += min;
			if (reference.count <= 0) {
				this.parent.garbageBehind.shift();
			}
			if (this.parent.activeType == 1) count -= min;
			gCount -= min;
			playerNeutGarb[reference.player] = min;
		}

		remain += count + excessCount;
		////console.log(remain, count, excessCount);
		if (this.parent.isGarbageCollectionMode) {
			this.parent.woi.add(remain);
			remain = 0;
			modulus = 0;
		}

		if (neutralized && garbLength > 0 && !(garbLength <= count)) modulus = 0;
		let total = ((this.targetPoint) * remain);
		//////console.log(neutralCount, garbLength, neutralized)
		if ((garbLength > 0 || neutralized) && neutralCount < garbLength) total = 0;
		this.parent.garbageLength = this.parent.calculateGarbage();
		this.parent.garbageBehindLength = this.parent.calculateGarbageBehind();
		if (neutralized) {
			this.parent.rpgAttr.hpDamage = this.parent.calculateHPDamage();

			for (let h in playerNeutGarb)
				if (h in game.players) {
					let player = game.players[h];
					if ((player.feverStat.isOn && player.blob.isFever) && !player.blob.insane.isOn && !player.block.insane.isOn) {
						player.feverStat.addTime(1);
					}
				}
			if (this.parent.feverStat.isOn && this.isFever) {



				if (!this.insane.isOn) {
					if (this.parent.feverStat.add()) hasAddFev = 1;
				}
				if (!this.insane.isOn && this.parent.feverStat.gaugeValue >= this.parent.feverStat.maxGauge) {
					this.insane.delay.ready = 10;
				}
			}
			if ((this.parent.feverStat.isOn && this.isFever) || this.insane.isOn || this.isChainOffsetting) {
				this.canFallTrash = false;
				this.canFallTrashAfterFever = false;
			}

		}

		game.forEachPlayer(player => {
			if (this.parent.player === player.player || this.parent.team === player.team) return;
			if (!(player.player in this.targetGarbagePlayer)) {
				this.targetGarbagePlayer[player.player] = {
					score: total,
					trash: ~~((total) / (player.blob.targetPoint)),
				};
				return;
			}
			let qm = this.targetGarbagePlayer[player.player];
			qm.score += (total);
			qm.trash = ~~(qm.score / (player.blob.targetPoint));
		});



		let bez = {
			x1: 0,
			x2: 1,
			x3: 1,
			x4: 1,
			y1: 0,
			y2: 1,
			y3: 1,
			y4: 1,
		};

		let asset = this.parent.assetRect(this.isAux ? "AUX-FIELD-CHARACTER-CANVAS" : "FIELD-CHARACTER-CANVAS");
		let sizemult = this.isAux ? 0.47 : 1;
		let aw = asset.width;
		let ah = asset.height;
		let ax = asset.x;
		let ay = asset.y;

		let selfTarget = this.parent.assetRect("GARBAGE-TRAY-DIV");
		let gw = selfTarget.width;
		let gh = selfTarget.height;
		let gx = selfTarget.x;
		let gy = selfTarget.y;
		let cs = this.parent.fieldCellSize;

		//////console.log(this.erasedBlocks[0])

		let bx = (this.erasedBlocks[0] || { x: this.piece.x }).x;
		let by = (this.erasedBlocks[0] || { y: this.piece.y }).y;
		let qw = sizemult * (this.parent.fieldSize.w / this.fieldSize.w);
		let qh = sizemult * ((this.parent.fieldSize.vh) / this.fieldSize.vh)
		let um = (this.erasedBlocks[0] || { cell: 0 }).cell;
		let yu = [0, 2, 5, 7, 4, 8]; //[(this.erasedBlocks[0] || { cell: 0 }).cell];

		let z = this.sendGarbage();
		let isAttack = Object.keys(z).length > 0;

		let y = Math.max(1, this.chain - ((this.insane.isOn || this.isFever) ? 2 : 0));
		let isCounter = attack > garbLength && garbLength > 0;
		let isChain = this.chain < this.forecastedChain;
		let isTargetCount = Object.keys(z).length > 0;
		let hitInt = this.parent.fieldCellSize * (Math.min(this.chain, 7) * 0.1);
		if (isTargetCount) {
			game.forEachPlayer(m => {
				if (m.player in z) {
					let target = m.assetRect("GARBAGE-TRAY-DIV");
					let tw = target.width;
					let th = target.height
					let tx = target.x;
					let ty = target.y;

					if (!m.blob.insane.isOn) m.check1v1Overhead(true, m.garbageLength + m.garbageBehindLength, m.garbageLength + m.garbageBehindLength, false);


					if (m.isVisible) m.addDelayHandler(true, particleSpeed * (neutralized ? 2 : 1), () => {
						m.garbageLastForTray.assign(m.garbageLength);
						m.garbageBehindLastForTray.assign(m.garbageBehindLength);
						m.playSound(`hit${Math.min(5, y)}`);
						animatedLayers.create(undefined, 30,
							tx + (tw / 2),
							ty + (th / 2),
							0,
							0,
							200,
							200,
							12,
							12,
							0.75,
							"blob_hit",
							10,
							this.cellSize,
						);
						if (!m.isDying && !m.isFinishAble && !m.isDead) m.engageShakeIntensityHit(hitInt);
					});

					if (!neutralized) {
						if (m.isVisible) {
							for (let j of this.firstGroupsPop) {
								m.addParticle(true, "attack", 0, yu[j.cell],
									(ax) + (j.x * cs * qw),
									(ay) + ((j.y - this.fieldSize.hh) * cs * qh),
									tx + (tw / 2),
									ty + (th / 2),
									particleSpeed, 1.5, false, bez, true, {
										frame: particleSpeed * (0.3 + (Math.min(9, this.chain) * 0.2)),
										r: this.blobColors.r[j.cell],
										g: this.blobColors.g[j.cell],
										b: this.blobColors.b[j.cell],
									});
							}
						}

					} else {
						m.addDelayHandler(true, particleSpeed, () => {
							if (m.isVisible) {

								m.addParticle(true, "attack", 0, yu[um],
									gx + (gw / 2),
									gy + (gh / 2),
									tx + (tw / 2),
									ty + (th / 2),
									particleSpeed, 1.5, false, bez, true, {
										frame: particleSpeed * (0.3 + (Math.min(9, this.chain) * 0.2)),
										r: this.blobColors.r[um],
										g: this.blobColors.g[um],
										b: this.blobColors.b[um],
									});
							}

						});
					}

				}
			});
		}

		this.parent.addDelayHandler(true, particleSpeed * (isCounter ? 2 : 1), () => {
			game.forEachPlayer((player) => {
				if (isTargetCount && player.isDying && player.isFinishAble) {

					if (player.player in z) {
						if (isChain) {
							player.playSound("blub_garbage2");
							player.executeRotateWobble(15, 65);
						} else {
							player.phaseLose(true);
						}
					}


				} else if (!isChain && player.isDying && player.isFinishAble) {
					player.phaseLose(false);
				}
			})

		});

		if ((neutralized && (garbLength > 0)) || (this.parent.isGarbageCollectionMode)) {
			for (let j of this.firstGroupsPop) {
				this.parent.addParticle(true, "attack", 0, yu[j.cell],
					(ax) + (j.x * cs * qw),
					(ay) + ((j.y - this.fieldSize.hh) * cs * qh),
					gx + (gw / 2),
					gy + (gh / 2),
					particleSpeed, 1.5, false, bez, true, {
						frame: particleSpeed * (0.3 + (Math.min(9, this.chain) * 0.2)),
						r: this.blobColors.r[j.cell],
						g: this.blobColors.g[j.cell],
						b: this.blobColors.b[j.cell],
					});
			}
			this.parent.addDelayHandler(false, particleSpeed, () => {
				this.parent.garbageLastForTray.assign(this.parent.garbageLength);
				this.parent.garbageBehindLastForTray.assign(this.parent.garbageBehindLength);
				this.parent.playSound(`hit${Math.min(5, y)}`);
			});

			this.parent.addDelayHandler(true, particleSpeed, () => {
				if (this.parent.feverStat.isOn && this.isFever && hasAddFev) {
					let fev = this.parent.feverStat;

					let feverTarget = this.parent.assetRect("FEVER-GAUGE");

					let mx = feverTarget.x;
					let my = feverTarget.y;
					let mw = feverTarget.width;
					let mh = feverTarget.height;
					//let scs = game.playerAreaSizeMult * (this.cellSize / game.resQualityMult);

					let fevOrb = fev.orbs[fev.gaugeValue - 1];
					////console.log(fev.gaugeValue, fevOrb);

					let fx = (fevOrb.x * mw); //+ (fevOrb.cs * scs / 2);
					let fy = (fevOrb.y * mh) - (fevOrb.cs * cs / 2);

					if (fev.reversed) {
						fx = ((1 - fevOrb.x) * mw); //+ (fevOrb.cs * scs / 2);
						fy = ((fevOrb.y) * mh) - (fevOrb.cs * cs / 2);
					}

					this.parent.addParticle(true, "attack", 0, 0,
						gx + (gw / 2),
						gy + (gh / 2),
						mx + fx,
						my + fy,
						particleSpeed, 1.5, false, bez, true, {
							frame: particleSpeed * (0.2),
							r: 255,
							g: 255,
							b: 255,
						});
					this.parent.addDelayHandler(true, particleSpeed, () => {
						fev.refresh();
						this.parent.playSound("garbage");
					});

				}
				animatedLayers.create(undefined, 30,
					gx + (gw / 2),
					gy + (gh / 2),
					0,
					0,
					200,
					200,
					12,
					12,
					0.75,
					"blob_hit",
					10,
					this.cellSize,
				);
			});

			if (!this.insane.isOn && !this.isAux && !this.parent.isGarbageCollectionMode) this.parent.check1v1Overhead(false, garbLength, this.parent.garbageLength + this.parent.garbageBehindLength, isAttack);

		}


	}

	garbageConversion(count, limit) {
		let h = 0;
		let g = 0;
		let l = 4;
		let q = 1;
		let last = 0;
		let isLimit = limit !== void 0;
		while (h < count) {


			h++;
			if (h >= l) {
				////console.log("GARB")
				l += ~~(q * 4.5);
				q++;
				g++;
			}
			if (isLimit && (limit <= g)) break;
			last = h;
			/*if (h >= l) {
			 //////console.log("GARB")
			 l += ~~(q * 4.5);
			 q++;
			 g++;
			}*/
		}
		let costShortage = (0, h - count);
		return {
			converted: g,
			cost: h,
			shortage: costShortage,
			surplus: Math.max(count - last, 0),
		};
	}

	sendGarbage() {
		this.parent.playerTarget = [];
		let playerTrashSent = {};

		manager.forEachPlayer(player => {
			if (player.player !== this.parent.player && player.team !== this.parent.team) this.parent.playerTarget.push(player.player);
		});
		let attackHp = this.parent.rpgAttr.attributes.attack + (this.parent.rpgAttr.attributes.atkTolerance * this.parent.seeds.field.next());
		let blobToBlockMultiplier = 1.8;

		manager.forEachPlayer(player => {
			if (this.parent.playerTarget.indexOf(player.player) !== -1) {
				let qm = this.targetGarbagePlayer[player.player];
				if (player.activeType === 1) {
					////console.log(this.targetGarbagePlayer[player.player])
					if (((player.player in this.opponentGarbageBehind) && player.isGarbageBehindActive)) {

						player.addGarbageBehind(this.parent.player, [qm.trash], true, false, 0, attackHp);

					} else player.addGarbage(this.parent.player, [qm.trash], true, false, 0, attackHp);
					if (qm.trash > 0) {
						playerTrashSent[player.player] = qm.trash;
						qm.score %= player.blob.targetPoint;
					}
				}
				if (player.activeType === 0) {
					let h = 0;
					let g = 0;
					let l = 4;
					let q = 1;
					while (h < qm.trash) {
						h++;
						if (h >= l) {
							////console.log("GARB")
							l += ~~(q * 2.75);
							q++;
							g++;
						}
						/*if (h >= l) {
						 //////console.log("GARB")
						 l += ~~(q * 4.5);
						 q++;
						 g++;
						}*/
					}

					//////console.log(player.player, player.dividedBlobScoreGarbage, player.blobGarbage, g)

					if (g > 0) {
						playerTrashSent[player.player] = g;

						if ((player.player in this.opponentGarbageBehind) && player.isGarbageBehindActive) {
							player.addGarbageBehind(this.parent.player, [g], true, true, 0, attackHp * (blobToBlockMultiplier));
						} else player.addGarbage(this.parent.player, [g], true, true, 0, attackHp * (blobToBlockMultiplier));


						qm.score %= (player.blob.targetPoint);
						qm.trazh = 0;
					}
				}


			}
		});
		for (let h of this.parent.playerTarget) {
			//////console.log(game.players[playerTarget].garbage)
		}

		return playerTrashSent;
	}

	updateDelay() {
		if (!this.isDelayEnabled) return;

		let delayPrioritize = 0;
		for (let l = this.delayParamsLength - 1; l >= 0; l--) {
			if (this.delay[l] >= 0) {
				delayPrioritize = l;

				break;
			}
		}


		if (this.voiceDelay === 0) {

			this.voiceDelay--;
			if ("" !== this.parent.activeVoiceline) {

				this.parent.playVoice(this.activeVoiceLine);
				let ll = this.insane.isOn ? this.parent.getVoiceDuration(this.activeVoiceLine) : -4;
				if (this.actualChain >= this.forecastedChain) {
					this.nextVoice.duration = ll;
				}
				if (this.activeVoiceLine.includes("spell")) {
					//music.stopAll();
					for (let j = 1; j <= (this.repeatSpellVoice); j++) {
						this.parent.addDelayHandler(true, j * 9, () => {
							this.parent.playVoice(this.activeVoiceLine);
							if (this.actualChain >= this.forecastedChain) {
								this.nextVoice.duration = ll;

							}
						});
					}
					this.repeatSpellVoice = 0;
				}
			}

		}
		else if (this.voiceDelay >= 0) this.voiceDelay--;


		if (delayPrioritize === 0) {
			if (!this.insane.updateDelays()) {
				this.delay[delayPrioritize]--;
			} else this.parent.isDelayStoppable = false;
		} else {
			this.delay[delayPrioritize]--;
			this.parent.isDelayStoppable = false;
		}

		do {
			if (this.dropDelay >= 0) {
				this.dropDelay--;
				if (this.dropDelay === 0) {
					this.checkDropBlock();
					this.setDelay(1, 24);
				}
			}
			if (this.delay[3] == 0) {
				//alert("detect?")
				let activeSpellline = "";
				this.voiceDelay = 3;
				/*for (let yy = 0; yy < this.eraseInfo.length; yy++)*/
				this.parent.playSound(`chain${Math.min(7, this.chain)}`);
				this.parent.playSound("shoosh_chain");
				//sound.sounds.chain1.rate(1 + (0.08 * (this.chain - 1)));
				let asset = this.parent.assetRect(this.isAux ? "AUX-FIELD-CHARACTER-CANVAS" : "FIELD-CHARACTER-CANVAS");
				let sizemult = (this.isAux ? 0.47 : 1) * this.getQPosX(1);
				let aw = asset.width;
				let ah = asset.height;
				let ax = asset.x;
				let ay = asset.y;

				let px = (ax + (this.parent.fieldCellSize * this.getQPosX(this.eraseInfo[0].x)));
				let py = (ay + (this.parent.fieldCellSize * this.getQPosY(this.eraseInfo[0].y - this.fieldSize.hh)));
				let delayed = this.delayedGarbage,
					lem = this.parent.garbageLength + this.parent.garbageBehindLength;
				if (this.chain > 0) {
					this.emitAttack(delayed, this.dstModulus);
					let blobCenterX = sizemult * this.parent.fieldCellSize / 2;
					let blobCenterY = sizemult * this.parent.fieldCellSize / 2;
					let popSize = 4;
					let len = this.eraseInfo.length;
					for (let i = 0; i < len; i++) {
						let p = this.eraseInfo[i];
						//let sx = this.getQPosX(1) * this.parent.fieldCellSize * (popSize);
						//let sy = this.getQPosY(1) * this.parent.fieldCellSize * (popSize);
						let apx = (ax + (this.parent.fieldCellSize * this.getQPosX(p.x)));
						let apy = (ay + (this.parent.fieldCellSize * this.getQPosY(p.y - this.fieldSize.hh)));


						animatedLayers.create(undefined, 25,
							apx + blobCenterX,
							apy + blobCenterY,
							0,
							0,
							200,
							200,
							popSize,
							popSize,
							0.65 + (Math.random() * 0.8),
							`blob_pop${p.cell}`,
							10,
							this.parent.fieldCellSize * sizemult, false, false, true
						);
					}
				}

				if (this.chain > 1) htmlEffects.add(this.chain + `<gtp style="font-size: 0.8em">-${this.insane.insaneType == 1 ? "combo" : "chain"}</gtp>`, px, py, 50, {
					name: "chain-text-anim",
					iter: 1,
					timefunc: "cubic-bezier(0,0,1,0)",
					initdel: 0,
				}, `font-size: ${~~(this.parent.fieldCellSize * 6.3)}px; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; --__chaintext_size: 1.4em; color: #${["fff", "ff0", "f00", "70f"][Math.min(4, ~~(this.chain / 5))]}`);
				//let lem = this.parent.garbageLength,
				////console.log(lem)
				let isCounter = ~~((delayed / this.targetPoint) - lem) > 0 && lem > 0;
				//if (this.parent.player === 0)//console.log(this.parent.player, ~~(delayed / this.targetPoint), (isCounter), this.parent.garbageLength)

				if (this.parent.character.isCounting) {
					if (this.chain == 7 || this.chain == 8 || this.chain > 9) this.repeatSpellVoice++;
					else this.repeatSpellVoice = 0;

					if (this.forecastedChain > this.chain || this.chain < 3) {
						this.activeVoiceLine = `count${this.chain}`;
					} else {
						if (this.chain == 3) this.activeVoiceLine = "spell1";
						if (this.chain == 4) this.activeVoiceLine = "spell2";
						if (this.chain == 5) this.activeVoiceLine = "spell3";
						if (this.chain >= 6 && this.chain < 9) this.activeVoiceLine = "spell4";
						if (this.chain >= 9) this.activeVoiceLine = "spell5";
					}
				} else
				if (this.insane.isOn || this.isFever) {
					try {
						let o = "init1";
						if (this.forecastedChain > 20) {
							o = CHAIN_SEQUENCE[19][(this.chain - 1) % 20];
							if (this.chain > 20) o = o = CHAIN_SEQUENCE[19][(this.chain) % 20];
							if (this.chain == this.forecastedChain) o = "spell5";
						} else o = CHAIN_SEQUENCE[this.forecastedChain - 1][this.chain - 1];
						if (o === "init5") {
							this.repeatSpellVoice++;
						} else if (!((o.includes("spell")))) this.repeatSpellVoice = 0;

						this.activeVoiceLine = o;
						if (o.includes("spell")) activeSpellline = o;
					} catch (e) {
						this.activeVoiceLine = "damage2";
					} /**/

					if (this.chain > 1 && this.insane.insaneType === 2) {
						let h = 0;
						if (this.chain == 7) {
							h = 1;
						}
						if (this.chain == 12) {
							h = 2;
						}
						if (this.chain == 18) {
							h = 3;
						}
						if (this.chain == 22) {
							h = 4;
						}

						if (this.forecastedChain === this.chain) {
							if (this.chain <= 11) {
								h = 1;
							} else
							if (this.chain <= 17) {
								h = 2;
							} else
							if (this.chain <= 21) {
								h = 3;
							} else
							if (this.chain >= 22) {
								h = 4;
							}
						}
						if (h > 0) {
							this.parent.engagePlaycharExt("insaneTransformSpell", `tfmicspell${h}`);
						}
					}

				} else if (!this.isFever) {
					let spell = TSU_CHAIN_SEQUENCE.normal[Math.min(6, this.chain - 1)];
					this.activeVoiceLine = spell;
					if (spell.indexOf("spell") != -1) activeSpellline = spell;
				} else {
					this.activeVoiceLine = `init${Math.min(5, this.chain)}`;
				}
				if (isCounter && (this.chain > (this.forecastedChain > 3 ? 3 : 2))) {
					this.activeVoiceLine = `counterattack`;
					activeSpellline = "counter";
				}

				if (this.isAux) {
					this.activeVoiceLine = "";
					activeSpellline = "";
				}

				if (activeSpellline !== "") this.parent.rectanim.play(activeSpellline);


			}

			if (this.delay[3] > 0) {
				if ((this.delay[3] % 2) == 0) {

					if (true) {

						let aux = this.isAux ? "stackAux" : "stack";
						let widthQuotient = this.parent.fieldSize.w / this.fieldSize.w;
						let heightQuotient = (this.parent.fieldSize.vh / this.fieldSize.vh);
						this.drawArray(aux, this.poppedStack, 0, -1 * (this.fieldSize.hh), void 0, 0, widthQuotient, heightQuotient, true, true);

					}
				} else this.drawStack();
			}
			if (this.delay[2] == 0) {
				//alert("detect?")
				if (this.insane.isOn || this.isFever) {

					let speed = this.insane.isOn ? 1 : 1.2;

					let blobs = [];
					let isExist = false;
					let highestY = this.fieldSize.h,
						longest = 0;
					let lowestY = this.fieldSize.h;

					for (let x = 0; x < this.fieldSize.w; x++) {
						let firstY = 0;
						let emptyY = 0;
						let isFirst = true;
						let isEmpty = false;
						let delayDrop = 0;
						for (let y = this.fieldSize.h - 1; y >= this.fieldSize.hh - 2; y--) {
							let bl = this.stack[x][y];

							if (!isEmpty && bl === 0) {

								isEmpty = true;
							}

							if (isFirst && isEmpty && bl > 0) {

								//firstY = this.checkDropSpecific(999, x, y + 1) + 1;
								isFirst = false;
								firstY += emptyY;
								emptyY = 0;
								if (y < lowestY) lowestY = y;
							}
							if (isEmpty && bl === 0) {

								emptyY++;
								isFirst = true;
								//delayDrop += 4;
							}

							if (!isFirst && isEmpty && bl > 0) {
								isExist = true;
								////console.log(y, firstY, firstY + y, isFirst)

								blobs.push({
									cell: bl,
									x: x,
									y0: y,
									y1: firstY + y,
									h: firstY + 1,
									del: delayDrop,
								});

								if (bl > 0 && highestY > y) {
									highestY = y;
								}
								if (longest < (delayDrop + firstY * speed) && bl > 0) {
									longest = delayDrop + (firstY * speed);
								}
								delayDrop += this.insane.isOn ? 2 : 1;
							}

						}
					}

					////console.log(longest * speed)

					for (let blob of blobs) {
						let timeFall = Math.floor(Math.max(0, (blob.h) * speed));
						//TODO write down

						this.drawableStack[blob.x][blob.y0] = 0;
						this.effects.drop.addItem({
							x: blob.x,
							y0: blob.y0,
							y1: blob.y1,
							cell: blob.cell,
							delay: blob.del,
							frames: timeFall,
							maxf: Math.floor(Math.max(0, (blob.h) * speed)),
							isLandSound: 1,
							fallType: 0,
							landFrames: 15
						});
					}

					this.setDelay(1, 7 + (isExist ? 15 : 0) + Math.floor(Math.max(0, (longest))));
					//this.setDelay(1, 24);
					this.drawStack();
					this.checkInstantDrop();
				} else {
					//this.checkHoles();
					//this.checkDropBlock();

					{

						let speed = 1.75;

						let blobs = [];
						let isExist = false;
						let highestY = this.fieldSize.h,
							longest = 0;
						let lowestY = this.fieldSize.h;

						for (let x = 0; x < this.fieldSize.w; x++) {
							let firstY = 0;
							let emptyY = 0;
							let isFirst = true;
							let isEmpty = false;
							let delayDrop = 0;
							let isLand = false;
							for (let y = this.fieldSize.h - 1; y >= this.fieldSize.hh - 2; y--) {
								let bl = this.stack[x][y];

								let isNuisance = false;

								if (!isEmpty && bl === 0) {

									isEmpty = true;

								}

								if (isFirst && isEmpty && bl > 0) {

									//firstY = this.checkDropSpecific(999, x, y + 1) + 1;
									isFirst = false;
									firstY += emptyY;
									emptyY = 0;
									isLand = true;
									if (y < lowestY) lowestY = y;
								} else isLand = false;
								if (isEmpty && bl === 0) {

									emptyY++;
									isFirst = true;
									//delayDrop += 4;

								}

								if (!isFirst && isEmpty && bl > 0) {
									if (bl !== this.NUISANCE) isExist = true;
									////console.log(y, firstY, firstY + y, isFirst)
									if (bl === this.NUISANCE) {

									}
									blobs.push({
										cell: bl,
										x: x,
										y0: y,
										y1: firstY + y,
										h: firstY + 1,
										del: delayDrop,
										isLand: isLand,
										landFrames: bl === this.NUISANCE ? 0 : 22
									});

									if (bl > 0 && highestY > y) {
										highestY = y;
									}
									if (longest < (delayDrop + firstY * speed) && bl > 0) {
										longest = delayDrop + (firstY * speed);
									}
									delayDrop += this.insane.isOn ? 0 : 0;
								}

							}
						}

						////console.log(longest * speed)

						for (let blob of blobs) {
							let timeFall = Math.floor(Math.max(0, (blob.h) * speed));
							//TODO write down

							this.drawableStack[blob.x][blob.y0] = 0;
							this.effects.drop.addItem({
								x: blob.x,
								y0: blob.y0,
								y1: blob.y1,
								cell: blob.cell,
								delay: blob.del,
								frames: timeFall,
								maxf: Math.floor(Math.max(0, (blob.h) * speed)),
								isLandSound: (blob.isLand) ? 1 : 0,
								fallType: 1,
								landFrames: blob.landFrames
							});
						}

						this.setDelay(1, 2 + (isExist ? 22 : 0) + Math.floor(Math.max(0, (longest))));
						//this.setDelay(1, 24);
						this.drawStack();
						this.checkInstantDrop();
					}
				}
			}

			if (this.delay[2] == 22) { //TODO 23 is the default delay after a chain
				//////console.log(this.activeVoiceLine)
			}

			if (this.delay[1] == 0) {
				//alert("detect?")
				if (this.isEnable) this.checkChain(this.stack);
				//this.drawStack(this.stack);
				if (this.erasedBlocks.length == 0) {


					if (!this.insane.isOn || this.insane.insaneType !== 1) this.chain = 0;
					manager.forEachPlayer(player => {
						//////console.log(player.player === this.parent.player, player.player, this.parent.player)
						if (player.player === this.parent.player) return;
						//////console.log(player.garbage)
						arrayModifyBatch(player.garbage, dl => {
							//////console.log(dl.player, this.parent.player);
							//////console.log(dl)
							if (dl.player !== this.parent.player) return;
							dl.wait = false;
							dl.frames = -9999;
							//////console.log(dl)
						});
						arrayModifyBatch(player.garbageBehind, dl => {
							//////console.log(dl.player, this.parent.player);
							//////console.log(dl)
							if (dl.player !== this.parent.player) return;
							dl.wait = false;
							dl.frames = -9999;
							//////console.log(dl)
						});
					});
					if (this.canFallTrash) this.dropGarbage();
				}
			}

			/*if (this.delay[1] == 0) {
			 this.stackCollapse(true);

			 this.parent.emitAttack(this.parent.delayedGarbage);
			 this.parent.delayedGarbage = 0;
			}*/

			if (this.delay[0] == 0) {
				this.previewNextBlob();

			}

			if (this.delay[delayPrioritize] === 0) {
				this.delay[delayPrioritize] = -1;
			}
		} while (false);

		if (this.nextVoice.duration >= 0) {
			this.nextVoice.duration--;
			if (this.nextVoice.duration === 0) {
				//this.checkDropBlock();
				this.parent.playVoice(this.nextVoice.name);
			}
		}


		this.rotate180Timer--;
		this.warningTrig.assign(((this.blobCount + this.parent.garbageLength) > 40 && this.isActive && !this.insane.isOn) ? 1 : 0);
		if (this.isAllClearTemp > 0) {
			this.isAllClearTemp--;
			if (this.isAllClearTemp == 0) {
				this.isAllClearTemp = -9;
				this.playAllClearAnim(2);
			}
		}
	}

	dropGarbage() {
		let a = JSON.parse(JSON.stringify(this.parent.garbage.filter(m => m.frames <= manager.frames && m.count > 0 && !m.wait))),
			len = a.length,
			count = 0;

		if (len == 0) return;
		let m = [];
		let blobs = [];
		let b = 0;
		let q = 0;
		let height = 0;
		let removeHp = 0;
		let mpl = {};

		let spawnStartY = this.fieldSize.hh - 3,
			deepest = spawnStartY,
			depth = 0;


		if (this.garbageOrder.on && this.fieldSize.w == 6) {
			let qm = this.garbageOrder.n % 6;
			for (let hm = 0; hm < 6; hm++) {
				m.push(this.garbageOrder.order[(this.garbageOrder.n + hm) % 6])
			}
		} else {
			for (let h = 0; h < this.fieldSize.w; h++) {
				m.push(h);
			}
			m.sort(() => 0.5 - this.parent.seeds.field.next());
		}



		let j = [];
		if (len > 0)
			for (let s = 0, qw = this.parent.garbage; s < qw.length; s++) {
				j.push(qw[s].id);
			}
		//////console.log(this.parent.garbage);

		let fallRows = {};
		for (let kx = 0; kx < this.fieldSize.w; kx++)
			for (let i = this.fieldSize.h - 1; i >= 0; i--) {
				fallRows[kx] = i;
				if (!this.testGridSpace(kx, i)) {
					if (deepest < i) {
						deepest = i;
					}
					break;
				}
			}
		while (len > 0) {
			let r = a[0];
			//this.parent.garbage.shift()
			//let p = r.id
			let rx = m[b];
			let startY = fallRows[rx];


			let index = j.indexOf(r.id);

			if (this.parent.rpgAttr.isOn) game.forEachPlayer(player => {
				if (r.player === player.player) {
					if (player.player in mpl) mpl[player.player] += r.hpdmg;
					else mpl[player.player] = r.hpdmg;
				}
			});

			this.stack[rx][startY - height] = this.NUISANCE;
			b++;

			removeHp += r.hpdmg;


			blobs.push({
				cell: this.NUISANCE,
				x: rx,
				y: startY - height,
				h: height,
				ih: height == 0
			});
			if (b >= this.fieldSize.w) {
				height++;
				b = 0;
				count++;
			}

			r.count--;
			this.parent.garbage[index].count--;
			if (this.parent.garbage[index].count <= 0) {
				this.parent.garbage.splice(index, 1);
				j.splice(index, 1);
				a.shift();
				len--;
			}

			q++;


			this.canFallTrash = false;
			if (count > 4) break;

		}


		if (q > 0) {
			if (q > 5 && q < 18) this.parent.playVoice("damage1");
			if (q > 17) {
				this.parent.playVoice("damage2");
				this.parent.rectanim.play("damage2");
			}
			this.blobCount = this.checkBlobCount(this.stack);

			this.parent.rpgAttr.addHP(-removeHp);
			this.parent.rpgAttr.hpDamage = this.parent.calculateHPDamage();
			let isLose = false;
			if (this.parent.rpgAttr.isOn && this.parent.rpgAttr.checkZeroHP()) {
				isLose = true;
			}
			if (isLose) this.checkLose();
			if (this.parent.rpgAttr.isOn) {
				game.forEachPlayer(player => {
					if (player.player in mpl) player.rpgAttr.addHP(mpl[player.player] * player.rpgAttr.attributes.lifesteal);

				});
			}
			this.parent.conclude1v1Overhead(2);


			//TODO test fever
			//if (q > 29 && !this.insane.isOn) this.insane.delay.readyHenshin = 3;
			this.parent.garbageLastForTray.assign(this.parent.garbageLength);

			depth = deepest - spawnStartY;

			//////console.log("blob fall of " + this.parent.player + ": " + s)

			let speed = this.isFever ? (this.insane.isOn ? 1 : 2.5) : 3;

			//t = √(2h/g)
			if (q > 13) {
				this.triggerBoardRotates.garbageLanding.on = true;
			}

			for (let blob of blobs) {
				let timeFall = Math.floor((Math.max(0, fallRows[blob.x] - spawnStartY)) * speed);

				if (fallRows[blob.x] >= 1) this.effects.drop.addItem({
					x: blob.x,
					y0: spawnStartY - blob.h,
					y1: blob.y,
					cell: blob.cell,
					frames: timeFall,
					maxf: timeFall, //Math.floor(Math.max(((depth) * speed), 0)),
					delay: 15,
					isLandSound: blob.ih ? (q > 5 ? 3 : 2) : 0,
					triggerBoardRot: q > 13,
					fallType: 0,
					landFrames: 15
				});
			}


			if (depth > 0) this.setDelay(1, (this.isFever ? 5 : 7) + 15 + Math.floor(Math.max((depth * speed), 0)));
			this.drawStack();
			this.parent.garbageLength = this.parent.calculateGarbage();
			this.parent.garbageLastForTray.assign(this.parent.garbageLength);

			if (this.garbageOrder.on && this.fieldSize.w == 6) {
				this.garbageOrder.n += q;
				this.garbageOrder.n %= 6
			}
		}
		this.checkHoles();
	}

	#checkConn(s, xd, yd) {
		let sta = JSON.parse(JSON.stringify(s));
		let checkConn = (stack, x, y) => {
			if (x >= this.fieldSize.w || y >= this.fieldSize.h || y < 0 || x < 0) return;
			let origin = stack[x][y];
			for (let d = 0; d < FLAG_DIRECTIONS.length; d++) {
				let dir = FLAG_DIRECTIONS[d];
				let dx = dir[0],
					dy = dir[1];
				////console.log("NO", FLAG_DIRECTIONS[d], d)
				if (y + dy < 0 || x + dx < 0 || x + dx >= this.fieldSize.w || y + dy >= this.fieldSize.h) continue;
				let ev = stack[x + dx][y + dy];
				if ((y + dy < this.fieldSize.hh) || (y < this.fieldSize.hh) || (ev !== origin) || origin !== this.NUISANCE) continue;
				if (dx == 1) stack[x][y] |= FLAG_CONNECTIONS.right;
				if (dx == -1) stack[x][y] |= FLAG_CONNECTIONS.left;
				if (dy == 1) stack[x][y] |= FLAG_CONNECTIONS.down;
				if (dy == -1) stack[x][y] |= FLAG_CONNECTIONS.up;
				//stack[x][y] = 0

			}
		}
		checkConn(sta, xd, yd);
		return sta;
	}

	drawStack(newStack) {
		//if (!this.isEnable) return;
		let aux = this.isAux ? "stackAux" : "stack";
		let widthQuotient = this.parent.fieldSize.w / this.fieldSize.w;
		let heightQuotient = (this.parent.fieldSize.vh / this.fieldSize.vh);

		if (newStack !== void 0) {
			if (newStack === "reset") {
				for (let x = 0, len = newStack.length; x < len; x++) {
					for (let y = 0, top = newStack[x].length; y < top; y++) {
						this.drawableStack[x][y] = 0;
					}
				}
			} else {
				for (let x = 0, len = newStack.length; x < len; x++) {
					for (let y = this.fieldSize.hh - 2, top = newStack[x].length; y < top; y++) {
						this.drawableStack[x][y] = newStack[x][y];
						//this.drawableStack = this.#checkConn(this.drawableStack, x, y);


					}
				}
				for (let x = 0, len = this.fieldSize.w; x < len; x++) {
					for (let y = this.fieldSize.hh - 2, top = this.fieldSize.h; y < top; y++) {

						//this.drawableStack = this.#checkConn(this.drawableStack, x, y);

						if (y > this.fieldSize.hh - 1 && this.drawableStack[x][y] !== this.NUISANCE)
							for (let d = 0; d < FLAG_DIRECTIONS.length; d++) {
								let dir = FLAG_DIRECTIONS[d];
								let dx = dir[0],
									dy = dir[1];
								////console.log("NO", FLAG_DIRECTIONS[d], d)
								if (y + dy < 0 || x + dx < 0 || x + dx >= this.fieldSize.w || y + dy >= this.fieldSize.h) continue
								let ev = this.drawableStack[x + dx][y + dy] % 256,
									origin = this.drawableStack[x][y] % 256;
								if ((y + dy < this.fieldSize.hh) || (y < this.fieldSize.hh) || (ev !== origin) || ev === this.NUISANCE) continue;
								if (dx == 1) this.drawableStack[x][y] |= FLAG_CONNECTIONS.right;
								if (dx == -1) this.drawableStack[x][y] |= FLAG_CONNECTIONS.left;
								if (dy == 1) this.drawableStack[x][y] |= FLAG_CONNECTIONS.down;
								if (dy == -1) this.drawableStack[x][y] |= FLAG_CONNECTIONS.up;
								//stack[x][y] = 0

							}

					}
				}
			}
		}

		this.parent.canvasClear(aux);
		this.drawArray(aux, this.drawableStack, 0, -1 * (this.fieldSize.hh), void 0, void 0, widthQuotient, heightQuotient, true, true);
	}

	drawActive() {
		let aux = this.isAux ? "pieceAux" : "piece";
		let aux2 = this.isAux ? "backAux" : "back";
		this.parent.canvasClear(aux);
		this.parent.canvasClear(aux2);
		this.runAllClearAnim(aux2);
		this.makeGhostPiece();
		this.drawActivePiece();
		this.effects.drop.update();
	}

	drawActivePiece() {
		if (!this.isEnable) return;
		let aux = this.isAux ? "pieceAux" : "piece";
		let widthQuotient = this.parent.fieldSize.w / this.fieldSize.w;
		let heightQuotient = this.parent.fieldSize.vh / this.fieldSize.vh;

		let vertical = ((this.piece.y) - (this.fieldSize.hh));
		if (!this.isFever && !this.insane.isOn) {
			let hh = step(this.piece.y % 1, 3, 0);
			vertical = Math.floor((this.piece.y) - (this.fieldSize.hh));
			vertical += hh;
		}



		this.piece.rotAnim.rot = this.piece.rotAnim.curRot - (this.piece.rotAnim.diffRot * (this.piece.rotAnim.timeAnim / this.piece.rotAnim.maxTime));
		if (this.piece.isBig) {

			this.drawRect(aux, (1 + this.piece.x) / 2, (vertical) / 2, 0, this.colorSet[this.piece.rot] - 1, widthQuotient * 2, heightQuotient * 2, true, true);
		} else {
			let maxDir = 4;
			if (this.piece.active.type === 0) {
				for (let i = 0; i < 2; i++) {
					let reference = this.activeBlobDisplay.two[`1|${i}`];
					let angleNumber = (((this.piece.rotAnim.rot + reference.offset.rot) % maxDir) + maxDir) % maxDir;
					let ax = reference.offset.distance * Math.cos(radians((angleNumber * 90)));
					let ay = reference.offset.distance * Math.sin(radians((angleNumber * 90)));
					////console.log(angleNumber)
					this.drawArray(aux, [[1]], this.piece.x + ax + reference.offset.x, vertical + ay + reference.offset.y, reference.blob, void 0, widthQuotient, heightQuotient, true, true);
				}
			} else if (this.piece.active.type < 3) {
				for (let li = 1; li < 3; li++)
					for (let i = 0; i < 2; i++)
						if (`${li}|${i}` in this.activeBlobDisplay.three) {
							let reference = this.activeBlobDisplay.three[`${li}|${i}`];
							let angleNumber = (((this.piece.rotAnim.rot + reference.offset.rot) % maxDir) + maxDir) % maxDir;
							let ax = reference.offset.distance * Math.cos(radians((angleNumber * 90)));
							let ay = reference.offset.distance * Math.sin(radians((angleNumber * 90)));
							////console.log(angleNumber)
							this.drawArray(aux, [[1]], this.piece.x + ax + reference.offset.x, vertical + ay + reference.offset.y, reference.blob, void 0, widthQuotient, heightQuotient, true, true);
						}
			} else this.drawArray(aux, this.piece.activeArr, this.piece.x, vertical, void 0, void 0, widthQuotient, heightQuotient, true, true);
		}

		if (this.piece.rotAnim.timeAnim > 0) this.piece.rotAnim.timeAnim--

	}

	makeGhostPiece() {
		if (this.piece.y < -10) return;
		let aux = this.isAux ? "pieceAux" : "piece";
		let widthQuotient = this.parent.fieldSize.w / this.fieldSize.w;
		let heightQuotient = this.parent.fieldSize.vh / this.fieldSize.vh;

		for (let gx = 0, win = this.piece.activeArr.length; gx < win; gx++) {
			for (let raiseY = 0, len = this.piece.activeArr[gx].length, gy = len - 1; gy >= 0; gy--) {
				let lc = this.piece.isBig ? this.colorSet[this.piece.rot] : this.piece.activeArr[gx][gy];
				let lx = this.piece.x + gx;
				let ly = ~~(this.piece.y) + gy + this.checkDropSpecific(40, this.piece.x + gx, ~~(this.piece.y) + gy) - raiseY - (this.fieldSize.hh);
				if (this.piece.activeArr[gx][gy]) {
					this.drawArray(aux, [[1]], lx, ly, 7, lc - 1, widthQuotient, heightQuotient, true, true);
					raiseY++;
				}
			}
		}
		let lem = this.dropForecast.poppable.length;
		for (let u = 0; u < lem; u++) {
			let g = this.dropForecast.poppable[u];
			//this.drawArray(aux, [[g[2]]], g[0], g[1], void 0, 0, widthQuotient, heightQuotient, true, true);
			this.parent.canvasCtx[aux].drawImage(
				game.misc.blob_target,
				(this.parent.cellSize * widthQuotient * g[0]),
				(this.parent.cellSize * heightQuotient * (g[1])) + (this.visibleFieldBufferHeight * this.parent.cellSize * (this.parent.fieldSize.vh / this.defaultFieldSize.vh)),
				(this.parent.cellSize * widthQuotient),
				(this.parent.cellSize * heightQuotient)
			)
		}
	}

	updateGhostPiece() {

		let int = 0;

		let blobLen = 0;

		for (let j = 0; j < this.dropForecast.blobs.length; j++) {
			let ref = this.dropForecast.blobs[j];
			if (ref[2] > 0) {
				if (this.dropForecast.stack[ref[0]][ref[1]] < this.dropForecast.PERMANENT_MASK && this.dropForecast.stack[ref[0]][ref[1]] > 0) {
					this.dropForecast.stack[ref[0]][ref[1]] = 0;
				}

			}
		}

		let blobs = [];
		this.dropForecast.blobs.length = 0;

		for (let gx = 0, win = this.piece.activeArr.length; gx < win; gx++) {
			for (let raiseY = 0, len = this.piece.activeArr[gx].length, gy = len - 1; gy >= 0; gy--) {
				let lc = this.piece.isBig ? this.colorSet[this.piece.rot] : this.piece.activeArr[gx][gy];
				let lx = this.piece.x + gx;
				let ly = ~~(Math.floor(this.piece.y) + gy + this.checkDropSpecific(40, this.piece.x + gx, ~~(this.piece.y) + gy) - raiseY - this.fieldSize.hh);
				if (this.piece.activeArr[gx][gy]) {
					//this.drawArray(aux, [[lc]], lx, ly, void 0, 16, widthQuotient, heightQuotient, true, true);
					blobLen++;
					raiseY++;
					if (lx < this.fieldSize.w && lx >= 0) blobs.push([lx, ly, lc]);

				} /**/

				//else blobs.push([0,0,0]);


			}
		}

		for (let j = 0; j < blobs.length; j++) {
			let ref = blobs[j];
			if (ref[2] > 0) {
				let len = this.dropForecast.blobs.length;
				let hx = (j < blobLen) ? (ref[0]) : (0);
				let hy = (j < blobLen) ? (ref[1]) : (0);
				let hc = (j < blobLen) ? (ref[2]) : (0);

				if (j >= len) {
					this.dropForecast.blobs.push([hx, hy, hc]);
				} else {

					this.dropForecast.blobs[int][0] = hx;
					this.dropForecast.blobs[int][1] = hy;
					this.dropForecast.blobs[int][2] = hc;

				}
				int++;
			}
		}

		this.checkForecastedConns();
	}

	checkForecastedConns() {
		//let stack = JSON.parse(JSON.stringify(this.dropForecast.stack));
		for (let j = 0; j < this.dropForecast.blobs.length; j++) {
			let ref = this.dropForecast.blobs[j];
			if (ref[2] > 0) this.dropForecast.stack[ref[0]][ref[1]] = ref[2];

		}

		let detected = {};
		this.dropForecast.poppable.length = 0;

		for (let j = 0; j < this.dropForecast.blobs.length; j++) {
			let ref = this.dropForecast.blobs[j];
			//this.dropForecast.stack[ref[0]][ref[1]] = ref[2];
			if (ref[2] > 0 && !(`${ref[0]}|${ref[1]}` in detected)) {
				let o = {

				};
				/*o[`${ref[0]}|${ref[1]}`] = {
					x: ref[0],
					y: ref[1],
					color: ref[2]
				};*/
				blobChainDetector.bfs(o, this.dropForecast.stack, ref[0], ref[1], this.fieldSize.w, 0, this.fieldSize.vh, this.dropForecast.PERMANENT_MASK);
				let count = Object.keys(o).length;
				for (let h in o) {
					let m = o[h];
					detected[h] = 1;
					if (count >= this.blobRequire) {
						if (this.stack[m.x][m.y + this.fieldSize.hh] > 0) this.dropForecast.poppable.push([m.x, m.y, m.color]);
					}
				}

			}

		}
		////console.log(detected)


	}

	checkValid(arr, cx, cy, ox, oy, isCeil) {
		let px = cx + ((ox !== void 0 ? ox : 0) + this.piece.x);
		let py = ~~(cy + ((oy !== void 0 ? oy : 0) + this.piece.y));
		if (isCeil) py = Math.ceil(cy + ((oy !== void 0 ? oy : 0) + this.piece.y))
		for (let x = 0; x < arr.length; x++) {
			for (let y = 0; y < arr[x].length; y++) {
				if (arr[x][y] && this.testGridSpace(x + px, y + py)) return false;
			}
		}
		return true;
	}

	checkDrop(dis) {
		let a = 0;
		while (this.checkValid(this.piece.activeArr, 0, a) && dis >= a) {
			a++;
		}
		//////console.log(a)
		return a - 1;
	}

	checkDropSpecific(dis, x, y) {
		let a = 0;
		while (!this.testGridSpace(x, y + a) && dis >= a) {
			a++;
		}
		//////console.log(a)
		return a - 1;
	}

	checkLose() {
		let isLose = false;

		this.piece.enabled = false;
		if (!this.parent.rpgAttr.isOn) {
			isLose = true;
		} else {
			if (this.parent.rpgAttr.checkZeroHP()) {
				isLose = true;
			} else {
				if (this.insane.isOn && this.parent.rpgAttr.isWOIHPMode) {

					this.preview.queue.unshift({
						type: this.piece.active.type,
						color1: this.piece.active.color1,
						color2: this.piece.active.color2
					});

					this.insane.delay.del = 5;
					this.insane.chainScore = -1;
					this.insane.requireChain -= 2;
					this.insane.status = "fail";
					this.piece.enable = false;
					this.piece.y = -99;

					this.nextVoice.name = "fail";
					this.nextVoice.duration = 20;

					this.setDelay(0, -9);
				}
				else {
					let mm = this.parent.calculateGarbage() * this.targetPoint / 2;
					this.parent.rpgAttr.addHP(-5 * mm);
					this.emitAttack(mm);
				}
				if (this.parent.rpgAttr.checkZeroHP()) {
					isLose = true;
				}
			}
		}
		if (isLose) {
			this.parent.checkLose();
			//this.delay[0] = -60;
			this.isSpawnablePiece = false;
		} else {
			this.resetGrid();
			this.delay[0] = 10;
		}
	}

	resetGrid() {
		for (let x = 0; x < this.fieldSize.w; x++) {
			for (let y = 0; y < this.fieldSize.h; y++) {
				if (this.stack[x][y]) this.stack[x][y] = 0;
			}
		}


		this.drawStack(this.stack);
		let aux = this.isAux ? "pieceAux" : "piece";
		this.parent.canvasClear(aux);
	}

	checkRespawnOrDie() {

	}

	spawnPiece(type, color1, color2, matrix, sx, sy, kickTable) {
		if (!this.isSpawnablePiece || !this.isActive) return;
		if (this.canSpawnPiece(type, color1, color2, matrix, sx, sy, kickTable)) {
			//this.piece.y += this.checkDrop(1);
			//let temp = this.piece.template;
			this.rotate180Timer = -1;
			this.canFallTrash = true;
			this.canFallTrashAfterFever = true;

			if (type === 4) {
				this.piece.rot = color1;
				this.piece.isBig = true;
			} else {
				this.piece.isBig = false;
				this.piece.rot = 0;
				this.piece.rotAnim.rot = 0;
				this.piece.rotAnim.curRot = 0;
				this.piece.rotAnim.timeAnim = 0;
				if (type < 3) {
					for (let px = 0; px < 3; px++) {
						for (let py = 0; py < 3; py++) {
							if (matrix[0][px][py]) {
								if (type == 0) {
									if (`${px}|${py}` in this.activeBlobDisplay.two) {
										this.activeBlobDisplay.two[`${px}|${py}`].blob = matrix[0][px][py];

									}
								}
								else if (type < 3) {
									if (`${px}|${py}` in this.activeBlobDisplay.three) {
										this.activeBlobDisplay.three[`${px}|${py}`].blob = matrix[0][px][py];

									}
								}
							}
						}
					}
				}

			}

			this.piece.dirty = true;
			//this.piece.isAir = true;
			this.piece.delay = 7;
			this.piece.y += 0.04;

			for (let x = 0; x < this.fieldSize.w; x++) {
				for (let y = 0; y < this.fieldSize.vh; y++) {
					/*if ((y) > -1)/**/
					this.dropForecast.stack[x][y] = this.stack[x][y + this.fieldSize.hh] + this.dropForecast.PERMANENT_MASK;
				}
			}
			this.checkManipulatedPiece();

			this.piece.active.parameters.type = type;
			this.piece.active.parameters.color1 = color1;
			this.piece.active.parameters.color2 = color2;
			this.piece.active.parameters.matrix = matrix;
			this.piece.active.parameters.sx = sx;
			this.piece.active.parameters.sy = sy;

			if (this.parent.ai.active) {
				let h = this.piece.hold || 0;

				let pieceX = sx + Math.min((this.fieldSize.w - 5), ~~((this.fieldSize.w - 10) / 2)),
					pieceY = sy + this.fieldSize.hh - 2;
				//stack, preview, w, h, hh, vh
				this.parent.aiBlob.evaluate(this.stack, this.preview.queue, this.fieldSize.w, this.fieldSize.h, this.fieldSize.hh, this.fieldSize.vh);
			}
		}
	}

	canSpawnPiece(type, color1, color2, matrix, sx, sy, kickTable) {


		this.piece.template = matrix
		let temp = this.piece.template;
		this.piece.active.color1 = color1;
		this.piece.rot = 0;
		this.piece.activeArr = matrix[0];
		this.piece.x = sx + Math.min((this.fieldSize.w - 5), ~~((this.fieldSize.w - 10) / 2));
		this.piece.y = this.fieldSize.hh - 2;
		this.piece.active.color2 = color2;
		//this.piece.active.colorRot = color1;
		this.piece.active.type = type;



		//////console.log(temp[index], this.piece.y, this.piece.x);
		this.lock.delay = 30;
		this.lock.rot = 15;
		this.lock.move = 15;
		this.piece.kickTable = kickTable;
		this.piece.rotated = false;
		this.piece.isAir = false;
		this.piece.moved = false;
		this.piece.dirty = true;
		this.piece.enable = true;
		////console.log([4 + Math.min((this.fieldSize.w - 5), ~~((this.fieldSize.w - 10) / 2)), this.fieldSize.hh + 1])

		return true;
	}

	checkBlockedSpawnPoint() {
		if (this.testGridSpace(4 + Math.min((this.fieldSize.w - 5), ~~((this.fieldSize.w - 10) / 2)), this.fieldSize.hh)) {
			//this.stack = grid(this.fieldSize.w, this.fieldSize.h, 0);
			return true;
		}
		if (((this.insane.insaneType !== 1 && this.insane.isOn) || this.isFever) && this.testGridSpace(5 + Math.min((this.fieldSize.w - 5), ~~((this.fieldSize.w - 10) / 2)), this.fieldSize.hh)) {
			//this.stack = grid(this.fieldSize.w, this.fieldSize.h, 0);
			return true;
		}

		return false
	}

	previewReset(seed) {
		if (seed !== void 0) this.rngPreview.seed = seed;
		this.piece.dropsetN = 0;
		this.previewInitialize();
		//let h = JSON.stringify(this.preview.queue)
		////console.log(h)
	}

	previewNextBlob() {
		if (this.isSpawnablePiece && this.isActive) {
			if (this.checkBlockedSpawnPoint()) this.checkLose();
			else {
				let r = this.previewNextBag();
				let a = this.setBlob(r.type, r.color1, r.color2);

				////console.log(a)

				this.spawnPiece(r.type, a.color1, a.color2, a.matrix, a.sx, a.sy, a.kickTable);
				this.previewDraw();
			}
		}
	}

	previewRefresh(seed) {
		this.rngPreview.seed = seed;
		this.previ
	}

	previewGenerateBag() {
		//let pieceList = [];
		//let len = this.preview.bag.length;
		//this.preview.bag.forEach(function(a) { pieceList.push(a) });
		/*for (var i = 0; i < pieceList.length - 1; i++)
		{
		 var temp = pieceList[i];
		 var rand = ~~((pieceList.length - i) * this.rngPreview.next()) + i;
		 pieceList[i] = pieceList[rand];
		 pieceList[rand] = temp;
		};*/



		let color1 = this.colorSet[~~(this.rngPreview.next() * this.colors)],
			color2 = this.colorSet[~~(this.rngPreview.next() * this.colors)],
			dropset = /*~~(this.rngPreview.next() * 5);/**/ this.piece.dropset[this.piece.dropsetN % 16];
		if (!this.isSpecialDropset) dropset = 0;

		let seed = this.rngPreview.seed;
		//dropset = 4;

		if (dropset === 4) {
			color1 = ~~(this.rngPreview.next() * this.colors);
		}



		while (color1 == color2 && dropset == 3) {
			color2 = this.colorSet[~~(this.rngPreview.next() * this.colors)];
		}

		if (dropset !== 0) {
			this.rngPreview.seed = seed;
		}

		let pieceList = {
			type: dropset,
			color1: color1,
			color2: color2,
			rot: color1
		};

		this.piece.dropsetN++;
		return pieceList;
	}

	previewInitialize() {
		this.piece.dropsetN = 0;
		while (true) {
			this.preview.queue = [];
			//for (let y of [1,2]) this.preview.queue.push(0);
			//this.previewGenerateBag();
			//this.piece.dropsetN = 0;
			for (let g = 0; g < 10; g++) this.preview.queue.push(this.previewGenerateBag());
			if (true || (this.preview.queue[0] == 0 && this.preview.queue[1] == 0)) break;
		}

		this.previewDraw();
	}

	previewNextBag() {
		let next = !this.isActive ? this.preview.queue[0] : this.preview.queue.shift();
		while (this.preview.queue.length < 10) this.preview.queue.push(this.previewGenerateBag());


		return next;

	}

	previewDraw() {
		if (this.isAux || !this.isEnable) return;
		this.parent.canvasClear('blobNext');
		let ms = 1.5;
		let m = this.preview.queue[0];
		////console.log(m);
		if (!this.preview.queue?.[0]) return;

		let active = this.piece.active.parameters;

		let piece = this.setBlob(m.type, m.color1, m.color2);

		let m2 = this.preview.queue[1];
		let piece2 = this.setBlob(m2.type, m2.color1, m2.color2);

		let mx1 = (this.parent.player % 2) == 1 ? 1 : 0,
			mx2 = (this.parent.player % 2) == 0 ? 1 : 0;


		let x = [
			active.sx + mx1 - (active.type == 4 ? 1 : 2) - ms - (active.type !== 0 ? 0.5 : 0),
			piece.sx + mx1 - (piece.type == 4 ? 1 : 2) - ms - (piece.type !== 0 ? 0.5 : 0),
			piece2.sx + mx2 - (piece2.type == 4 ? 1 : 2) - ms - (piece2.type !== 0 ? 0.5 : 0),
			piece2.sx + mx2 - (piece2.type == 4 ? 1 : 2) - ms - (piece2.type !== 0 ? 0.5 : 0),
		];

		let y = [
			-2,
			(piece.sy),
			(piece2.sy),
			(piece2.sy + 2),
		];

		let nexts = [active, piece, piece2];

		for (let h = 0; h < 3; h++) {
			let queue = this.effects.next.a.getItem(h);

			let next = h + 1;

			queue.blob = nexts[h].matrix[0];
			let msx = x[next];
			let msy = y[next];
			if (next < 3) {
				let queue2 = this.effects.next.a.getItem(next);
				msx = queue2.sx1;
				msy = queue2.sy1;
			}
			queue.sx1 = x[h];
			queue.sx2 = msx; //x[next];
			queue.sy1 = y[h];
			queue.sy2 = msy; //y[next];
			queue.type = nexts[h].type;
			queue.color1 = nexts[h].color1;
			queue.color2 = nexts[h].color2;
			////console.log(queue)
		}

		this.effects.next.frame = this.effects.next.max;



		/*if (m.type === 4) {
			this.drawRect("blobNext",
				(piece.sx + mx1 - ms - 1 - (m.type !== 0 ? 0.5 : 0)) / 2,
				(piece.sy + 0.5) / 2,
				0,
				(this.colorSet[piece.rot] - 1),
				ms * 2,
				ms * 2,
				false);

		} else this.drawArray(
			"blobNext",
			piece.matrix[0],
			piece.sx - 2 + mx1 - ms - (piece.type !== 0 ? 0.5 : 0),
			piece.sy + 0.5,
			void 0,
			0,
			ms, ms,
			false, false
		);
		if (m2.type === 4) {
			this.drawRect("blobNext",
				(piece2.sx + mx2 - ms - 1 - (m2.type !== 0 ? 0.5 : 0)) / 2,
				(piece2.sy + 2.5) / 2,
				0,
				(this.colorSet[piece2.rot] - 1),
				ms * 2,
				ms * 2,
				false);

		} else this.drawArray(
			"blobNext",
			piece2.matrix[0],
			piece2.sx - 2 + mx2 - ms - (piece2.type !== 0 ? 0.5 : 0),
			piece2.sy + 2.5,
			void 0,
			0,
			ms, ms,
			false, false
		);/**/
	}

	previewDrawUpdate() {
		this.parent.canvasClear('blobNext');
		if (this.effects.next.frame > 0) this.effects.next.frame--;
		this.effects.next.a.update();
	}
	checkManipulatedPiece() {
		if (!this.piece.enable) return false;
		let air = this.checkValid(this.piece.activeArr, 0, 1);

		if (air) {
			if (!this.piece.isAir) {
				this.piece.isAir = true;
			}
		} else {
			if (this.piece.isAir) {
				this.piece.isAir = false;
				if (!this.piece.isHardDrop) {}
			}
		}

		if (this.piece.isAir) {
			this.lock.delay = this.settings.lock;
			this.piece.moved = true;
			this.lock.lockSoftdrop = 4;
		} else {
			if ((this.lockPrevent.rotate <= 0) && (this.lock.delay <= 0 || this.lock.move <= 0 || this.lock.rot <= 0 || this.lock.lockSoftdrop <= 0)) {
				//this.piece.y = ~~this.piece.y;
				this.piece.held = false;
				let hasDelay = this.setDelay(0, void 0);
				this.piece.dirty = true;
				if (!this.piece.isHardDrop) {
					this.parent.playSound("blub_drop");
				}
				this.piece.y = Math.floor(this.piece.y);
				this.piece.isHardDrop = false;
				this.addPieceStack(this.piece.activeArr);

				for (let h = 0; h < this.delayParamsLength; h++) {
					if (this.delay[h] > 0) hasDelay = true;
				}
				if (hasDelay) {
					this.piece.y = -90;
					this.piece.enable = false;
				}

			}
		}
	}

	updatePiece() {
		if (!this.piece.enable) return;
		let gravity = this.settings.gravity;
		if (this.piece.isAir) {
			if (this.piece.delay <= 0) {
				if (gravity < 1) {
					this.piece.y += gravity;
				} else if (gravity == 1) {
					this.piece.y += this.checkDrop(1);
				} else if (gravity > 1) {
					this.piece.y += this.checkDrop(gravity);
				}
			}
			this.lock.delay = this.settings.lock;
			this.checkManipulatedPiece();
		}
		if (this.piece.delay > 0) {
			this.piece.delay--;
		}
		if (!this.piece.isAir) {
			this.piece.y = ~~this.piece.y;
			this.lock.delay--;
			this.checkManipulatedPiece();
		}
		if (this.lockPrevent.rotate >= 0) this.lockPrevent.rotate--;
		if (
			(this.lastPiece.x !== this.piece.x) ||
			/*(this.lastPiece.y !== this.piece.y) ||*/
			(this.lastPiece.rot !== this.piece.rot) ||
			this.piece.dirty
		) {
			this.lastPiece.x = this.piece.x;
			//this.lastPiece.y = this.piece.y;
			this.lastPiece.rot = this.piece.rot;
			this.piece.dirty = false
			this.updateGhostPiece();
		}

		//this.moveX(1 * (((manager.frames % 50) < 10) ? 1 : -1));
		//this.rotatePiece(1);/**/
	}

	setDelay(type, value) {
		let delayAdd = value !== void 0 ? value : this.delayAdd[type];
		if (delayAdd <= 0) delayAdd = -10;
		this.delay[type] = delayAdd;
		return (this.delay[type] > 0);
	}

	rotatePiece(_direction) {
		if (!this.piece.enable) return;
		let direction = _direction;
		if (this.rotate180Timer > 0) direction = 2;
		let temp = this.piece.template;
		let maxDir = 4;
		if (this.piece.isBig) {
			//direction = 0;
			maxDir = this.colors;
			let pos = ((this.piece.rot % maxDir) + maxDir) % maxDir;
			let nPos = (((this.piece.rot + direction) % maxDir) + maxDir) % maxDir;

			this.piece.rot = nPos;

			return;
		}
		let pos = ((this.piece.rot % maxDir) + maxDir) % maxDir;
		let nPos = (((this.piece.rot + direction) % maxDir) + maxDir) % maxDir;
		let rotate = temp[nPos];
		var dirType = "right";
		// This variable seems unnecessary because of the parameter _direction
		// but I'm going for this one instead of nothing...
		let dirInt = 0;
		switch (direction) {
			case 1:
				dirType = "right";
				dirInt = 1;
				break;
			case -1:
				dirType = "left";
				dirInt = -1;
				break;
			case 2:
				dirType = "double";
				dirInt = 2;
				break;
		}

		let isRotate = false;

		for (let i = 0, len = this.piece.kickTable[dirType][nPos].length; i < len; i++) {
			if (this.checkValid(
					rotate,
					this.piece.kickTable[dirType][pos][i][0],
					this.piece.kickTable[dirType][pos][i][1],
					0, 0, direction !== 2
				)) {
				this.parent.playSound("blub_rotate");
				let kickX = this.piece.kickTable[dirType][pos][i][0],
					kickY = this.piece.kickTable[dirType][pos][i][1];
				this.piece.x += kickX;
				this.piece.y += kickY;
				this.piece.rot = nPos;
				this.piece.activeArr = rotate;
				this.lock.delay = this.settings.lock;
				this.lock.lockSoftdrop = 4;
				this.lockPrevent.rotate = 9;
				this.piece.rotAnim.curRot += dirInt;
				this.piece.rotAnim.diffRot = this.piece.rotAnim.curRot - this.piece.rotAnim.rot;
				this.piece.rotAnim.timeAnim = this.piece.rotAnim.maxTime;

				if (!this.checkValid(this.piece.activeArr, 0, 1)) {
					this.lock.rot--;
				}
				this.piece.moved = false;
				this.piece.rotated = true;

				this.checkManipulatedPiece();

				isRotate = true;

				this.rotate180Timer = -4;

				break;
			}
		}

		if (!isRotate) {
			this.rotate180Timer = 20;
		}
	}

	moveX(shift) {
		if (!this.piece.enable) return;
		if (this.checkValid(this.piece.activeArr, shift, 0, 0, 0, true)) {
			this.piece.x += shift;
			if (!this.checkValid(this.piece.activeArr, 0, 1, 0, 0, true)) {
				this.lock.move--;
			}
			this.lock.delay = this.settings.lock;
			this.piece.moved = true;
			this.piece.rotated = false;
			this.parent.playSound("blub_move");
			this.checkManipulatedPiece();
		}
	}

	shiftDelay() {
		if (this.parent.flagPresses.right && this.handling.xFirst === 0) {
			this.handling.xFirst = 1;
		}
		if (this.parent.flagPresses.left && this.handling.xFirst === 0) {
			this.handling.xFirst = -1;
		}

		if (this.handling.xFirst !== 0) {
			if (this.parent.flagPresses.right && !this.parent.flagPresses.left) {
				this.handling.xFirst = 1;
			} else if (this.parent.flagPresses.left && !this.parent.flagPresses.right) {
				this.handling.xFirst = -1;
			}
		}
		if (!this.parent.flagPresses.right && !this.parent.flagPresses.left && this.handling.xFirst !== 0) {
			this.handling.xFirst = 0;
		}

		{
			let x = 0;
			if (this.parent.flagPresses.right) x |= 0b10;
			if (this.parent.flagPresses.left) x |= 0b01;

			this.dasCancellation.assign(x);
		}

		if (this.parent.flagPresses.left || this.parent.flagPresses.right) {
			this.handling.das++;
			if (this.handling.das >= this.settings.das) {
				this.handling.arr++;
				for (let i = 0; i < this.fieldSize.w; i++) {
					let dir = 0;
					if (this.handling.xFirst === 1) {
						if (this.parent.flagPresses.left) {
							dir = -1;
						} else {
							dir = 1;
						}
					}
					if (this.handling.xFirst === -1) {
						if (this.parent.flagPresses.right) {
							dir = 1;
						} else {
							dir = -1;
						}
					}
					if (dir !== 0) this.moveX(dir);
					if (this.settings.arr !== 0) break;
				}
			}
		}
	}

	hardDrop() {
		if (this.piece.enable) {
			let distance = this.checkDrop(this.fieldSize.h);
			this.piece.y += distance;
			if (distance > 0) {
				this.piece.moved = true;
				this.piece.rotated = false;
			}
			this.lock.delay = -1;
			this.lockPrevent.rotate = -1;
			this.piece.isHardDrop = true;
			this.parent.playSound("blub_drop");
			this.checkManipulatedPiece();
		}
	}

	softDrop() {
		if (this.piece.enable && this.piece.delay <= 0) {

			if (this.piece.isAir) {
				let gravity = this.settings.sft;
				let initial = Math.floor(this.piece.y);
				if (gravity < 1) {
					this.piece.y += gravity;
				} else if (gravity == 1) {
					this.piece.y += this.checkDrop(1);
				} else if (gravity > 1) {
					this.piece.y += this.checkDrop(gravity);
				}
				let final = Math.floor(this.piece.y);
				if (initial !== final) {
					this.piece.moved = true;
					this.divScoreAttackingTrash += 1.25 * (final - initial);
					//this.divScoreAttackingTrash += 1;
					this.parent.score += final - initial;
				}
				this.checkManipulatedPiece();
			}
			//this.lock.delay = -1;
		}
	}

	addPieceStack(arr) {
		let lines = 0;
		let hasDelay = false;
		let blobs = [];

		for (let x = 0; x < arr.length; x++) {
			let diffY = 0;
			for (let y = arr[x].length - 1; y >= 0; y--) {
				if (arr[x][y]) {
					let px = x + this.piece.x;
					let py = ~~(y + this.piece.y);
					this.stack[px][py] = this.piece.isBig ? this.colorSet[this.piece.rot] : arr[x][y];
					//////console.log(py)
					blobs.push({
						cell: this.piece.isBig ? this.colorSet[this.piece.rot] : arr[x][y],
						x: px,
						y: py,
						ih: diffY === 0 ? 1 : 0,

					});
					diffY++;
				}
			}
		}

		hasDelay = this.setDelay(2, -9);

		let speed = 2;

		let holesObj = this.checkHolesByRow();


		this.checkForecast();
		let isPuffOut = false;
		if (this.isAux) {
			if (this.forecastedChain <= 0) {
				isPuffOut = true;
			}
		}

		if (!isPuffOut) {
			let delayed = 0;
			for (let blob of blobs) {

				let initialY = blob.y;
				let finalY = blob.y + holesObj.row[blob.x];
				let difference = finalY - initialY;

				let del = (this.isFever || this.insane.isOn) ? 7 : 10;

				let timeFall = Math.ceil(holesObj.row[blob.x] * speed * 2) + ((difference > 0) ? del : 0);
				/*if (holesObj.row[blob.x] >= 1)/**/
				this.effects.drop.addItem({
					x: blob.x,
					y0: initialY,
					y1: finalY,
					cell: blob.cell,
					frames: timeFall,
					maxf: timeFall + 1,
					isLandSound: blob.ih,
					fallType: 2,
					landFrames: 15
				});

				if (difference > 0) delayed = del;
				//console.log(difference);

			}
			if ((holesObj.most === 0 && !this.isFever && !this.insane.isOn) || false) this.drawStack(this.stack);

			this.checkInstantDrop();
			this.setDelay(1, 14);
			if (holesObj.most > 0) this.setDelay(1, 17 + (Math.ceil(holesObj.most * speed * 2)) + delayed);

		} else {
			for (let blob of blobs) {
				this.stack[blob.x][blob.y] = 0;
			}
			this.drawStack(this.stack);
		}

		this.isChainUp = this.forecastedChain > 0;

		if (this.insane.insaneType == 1 && this.insane.isOn) {
			this.forecastedChain += this.chain;
		}
		/*if (this.forecastedChain == 30) {
		 this.setDelay(1, -9);
		 this.forecastedChain = 0;
		 this.setDelay(0, -99);
		 this.insane.delay.turningOff = 2 + (Math.ceil(holesObj.most * speed * 2)); 
		}*/

		if (this.forecastedChain > 8 && !this.insane.isOn) {
			//this.setDelay(1, -99);

			//this.insane.delay.readyHenshin = 5 + (Math.ceil(holesObj.most * speed * 2)); /**/
			//this.forecastedChain = 0;
			//this.checkLose();
			//this.setDelay(0, 0);
			//this.chain = 9;
			//this.parent.addGarbage("SYSTEM", [300], false, false, 0, 100);
			//for (let x = 0; x < 98; x++) this.emitAttack([99999]);
			//this.chain = 0;


		}

		this.canFallTrash = this.isActive;
		this.canFallTrashAfterFever = this.isActive;

		//if (this.forecastedChain > 0) this.chain = 999;

	}

	checkHolesByRow() {
		let checked = true;
		let out = {
			most: 0,
			row: []
		};
		for (var x = 0; x < this.fieldSize.w; x++) {
			out.row[x] = 0;
			checked = false;
			for (var y = 0; y < this.fieldSize.h; y++) {
				if (checked && !this.testGridSpace(x, y)) {
					out.row[x]++;
					continue;
				}
				if (this.testGridSpace(x, y)) {
					checked = true;
				}
			}
			if (out.row[x] > out.most) {
				out.most = out.row[x];
			}
		}
		return out;
	}

	checkInstantDrop() {
		let checkHoles = () => {
				this.holes = 0;
				for (var x = 0; x < this.fieldSize.w; x++) {
					var block = false;
					for (var y = 0; y < this.fieldSize.h; y++) {
						if (this.stack[x][y]) {
							block = true;
						} else if (this.stack[x][y] == 0 && block) {
							this.holes++;
							//this.delay.drop = Math.floor(200 * (this.frenzy.isOn || this.frenzy.isReady ? 0.9 : 1));
							//this.delay.dropContinuous = Math.floor(15 * (this.frenzy.isOn || this.frenzy.isReady ? 0.9 : 1));;
							//this.dropDelay = 2;
						}
					}
				}

			},
			checkDropBlock = () => {
				if (this.holes > 0) {
					let isLand = false,
						isFront = false;
					let checked = true;

					for (let m = 0; m < this.fieldSize.h && checked; m++) {
						checked = false;
						for (var x = 0; x < this.fieldSize.w; x++) {
							let isPauseDrop = false;
							let isLand = false,
								isFront = false;
							for (var y = this.fieldSize.h; y >= -1; y--) {
								if (!this.testGridSpace(x, y - 1)) {
									isPauseDrop = false;
									continue;
								}
								if (!this.testGridSpace(x, y) && !isPauseDrop) {
									this.stack[x][y] = this.stack[x][y - 1];
									this.stack[x][y - 1] = 0;
									if (this.testGridSpace(x, y + 1) && !isFront) {
										isLand = true;
									}
									checked = true;
									isFront = true;
									//if (this.frenzy.isReady || this.frenzy.isOn)
									//isPauseDrop = true;
								}
							}
							//if (isLand) this.parent.playSound("lock");
						}
						if (!checked) break;
					}
				}
			};

		let isHole = checkHoles();
		checkDropBlock();

		return isHole;
	};

	checkChain(stack) {
		//BlobBlob BFS
		//console.table(stack);
		let isAllClear = true;
		let isExistForChain = false;
		this.eraseInfo.length = 0;
		this.erasedBlocks.length = 0;
		let highestBlobGroup = 0;
		let groupsFirstBlob = [];
		let blobEval = {};

		const eraseColor = {},
			sequenceBlobInfo = [],
			sequenceNuisanceInfo = [],
			erasedGarbage = [],
			existingBlobList = [],
			checkBlobOrigin = (x, y) => {
				const origin = stack[x][y];
				if (!(origin !== 0 && typeof origin !== "undefined" && origin !== null && origin !== this.NUISANCE) || y < this.fieldSize.hh) {
					return;
				};

				sequenceBlobInfo.push({
					x: x,
					y: y,
					cell: stack[x][y]
				});
				stack[x][y] = 0;

				const direction = [[0, 1], [1, 0], [0, -1], [-1, 0]];
				for (let iteration = 0; iteration < direction.length; iteration++) {
					const dX = x + direction[iteration][0];
					const dY = y + direction[iteration][1];

					if (
						dX < 0 ||
						dY < this.fieldSize.hh ||
						dX >= this.fieldSize.w ||
						dY >= this.fieldSize.h
					) {
						continue;
					};
					if (dY < this.fieldSize.hh) continue;
					const dCell = stack[dX][dY];
					if (!(dCell !== 0 && typeof dCell !== "undefined" && dCell !== null && dCell !== this.NUISANCE) || dCell !== origin) {
						continue;
					};
					checkBlobOrigin(dX, dY);
				};
			},
			checkNuisanceOrigin = (x, y) => {
				const origin = stack[x][y];
				//stack[x][y] = 0;

				const direction = [[0, 1], [1, 0], [0, -1], [-1, 0]];
				for (let iteration = 0; iteration < direction.length; iteration++) {
					const dX = x + direction[iteration][0];
					const dY = y + direction[iteration][1];

					if (
						dX < 0 ||
						dY < this.fieldSize.hh ||
						dX >= this.fieldSize.w ||
						dY >= this.fieldSize.h
					) {
						continue;
					};
					if (dY < this.fieldSize.hh) continue;
					const dCell = stack[dX][dY];
					if (!(dCell !== 0 && typeof dCell !== "undefined" && dCell !== null || dCell !== this.HARD)) {
						continue;
					};
					if (stack[dX][dY] == this.NUISANCE) sequenceNuisanceInfo.push({
						x: dX,
						y: dY,
						cell: stack[x][y]
					});
				};
			};

		for (var x = 0; x < this.fieldSize.w; x++) {
			for (var y = 0; y < this.fieldSize.h; y++) {
				if (y >= this.fieldSize.hh - 1 && stack[x][y] > 0) {
					let blobGroup = 0;
					if (stack[x][y] > 0) isAllClear = false;
					sequenceBlobInfo.length = 0; //reset sequence arr
					sequenceNuisanceInfo.length = 0;
					const blobCol = stack[x][y];
					checkBlobOrigin(x, y);




					let seqLen = sequenceBlobInfo.length;
					blobGroup = seqLen;
					if (seqLen == 0 || seqLen < this.blobRequire) {
						if (seqLen > 0) {
							existingBlobList.push(...sequenceBlobInfo);
						}
					} else {
						eraseColor[blobCol] = true;
						this.eraseInfo.push(...sequenceBlobInfo);
						for (let g = 0; g < sequenceBlobInfo.length; g++) {
							let wq = sequenceBlobInfo[g];
							if (!(`${wq.x}|${wq.y}` in blobEval)) {
								blobEval[`${wq.x}|${wq.y}`] = wq.cell;
								if (g == 0) groupsFirstBlob.push({
									x: wq.x,
									y: wq.y,
									cell: wq.cell
								});
							}
						}

					}
					for (const e of existingBlobList) {
						stack[e.x][e.y] = e.cell;
					}


					if (this.eraseInfo.length > 0) {
						this.drawStack(this.stack);
						if (blobGroup > highestBlobGroup) highestBlobGroup = blobGroup;
						isExistForChain = true;
						for (const isNuisance of this.eraseInfo) {
							checkNuisanceOrigin(isNuisance.x, isNuisance.y);
						}
						for (const e of sequenceNuisanceInfo) {
							stack[e.x][e.y] = 0;
							erasedGarbage.push({
								x: e.x,
								y: e.y,
								cell: e.cell
							});
						}
						this.erasedBlocks.push({
							x: x,
							y: y,
							cell: blobCol
						});
						continue;
					}
				} else if (stack[x][y] > 0) {
					stack[x][y] = 0;
				}
			}
		}
		for (let o of this.eraseInfo) this.erasedBlocks.push(o);
		if (isExistForChain) {


			this.chain += 1;
			this.actualChain += 1;

			this.pop.x = this.eraseInfo[0].x;
			this.pop.y = this.eraseInfo[0].y;

			this.canFallTrash = this.canFallTrashAfterFever = this.isActive || ((this.requiredChain > 0) && (this.chain < this.requiredChain)) || (this.parent.garbageBlocking !== "full");
			this.firstGroupsPop.length = 0;
			for (let h of groupsFirstBlob) {
				this.firstGroupsPop.push(h);
			}



			for (let x = 0, len = this.fieldSize.w; x < len; x++) {
				for (let y = 0, top = this.fieldSize.h; y < top; y++) {
					if (this.poppedStack[x][y] !== 0) this.poppedStack[x][y] = 0;
				}
			}

			for (let o of this.eraseInfo) this.poppedStack[o.x][o.y] = o.cell;

			for (let o of erasedGarbage) this.poppedStack[o.x][o.y] = o.cell;

			//this.delay.chainStart = Math.floor(300 * (this.frenzy.isOn ? 0.6 : 1));
			//this.delay.chainEnd = Math.floor(100 * (this.frenzy.isOn ? sz : 1));
			//this.delay.drop = Math.floor(160 * (this.frenzy.isOn || this.frenzy.isReady ? 0.8 : 1));
			this.setDelay(3, (this.insane.isOn) ? [17, 25, 10][this.insane.insaneType] : 25); // chain start  25
			this.setDelay(2, (this.insane.isOn) ? [15, 25, 10][this.insane.insaneType] : (this.isFever ? 20 : 25)); // chain end   25
			this.setDelay(1, 2); // chain delay  2
			this.setDelay(0, 3); // piece delay 3
			////console.log(highestBlobGroup)

			this.parent.swapMode.add("chain");

			let ll = this.isFever ? 1 : 0;

			let attackPreset = this.isFever ? (this.insane.isOn ? this.parent.character.blob.feverPower : this.parent.character.blob.chainPower) : TSU_CHAIN_POWER


			let blobsErased = this.eraseInfo.length + (erasedGarbage.length * 0);
			let colorBonus = COLOR_BONUS[ll][Math.min(Object.keys(eraseColor).length - 1, 5)];
			let groupBonus = GROUP_BONUS[ll][Math.min(highestBlobGroup - 1, 10)];
			let chainPower = Math.min(attackPreset[Math.min(this.chain - 1, 24)], Infinity);
			if (this.insane.isOn && this.insane.insaneType === 2) {
				let h = 0;
				let g = 0;
				let l = 0;
				let q = 0;
				while (h < this.chain) {
					h++;
					g += 1;
					g += Math.floor(q / 3);
					q++;
				}
				chainPower = g;
			}

			if (this.insane.isOn && this.insane.insaneType === 1) {
				let h = 0;
				let g = 0;
				let l = 0;
				let q = 0;
				while (h < this.chain) {
					h++;
					g += 1;
					g += Math.floor(q / 3);
					q++;
				}
				chainPower = g;
			}

			let addScore = (((blobsErased) * 10) * Math.max(chainPower + groupBonus + colorBonus, 1));
			let addGarbage = ((this.insane.isOn) ? [1, 1, 1][this.insane.insaneType] : 1) * addScore * (1 + (0.4 * this.parent.swapMode.a));
			this.parent.addScoreText = `${blobsErased * 10} x ${Math.max(chainPower + groupBonus + colorBonus, 1)}`;
			this.parent.score += addScore;

			this.divScoreTrash += addGarbage * this.decreaseTargetPoint * this.fixedAtkHandicap;
			this.divScoreTrash %= this.targetPoint;
			if (this.requiredChain <= this.chain) {
				this.delayedGarbage = addGarbage * this.decreaseTargetPoint * this.fixedAtkHandicap; //Math.floor((this.divScoreTrash / (this.targetPoint / (this.decreaseTargetPoint))));
				this.dstModulus = this.divScoreTrash;
			}

			this.divScoreTrash = 0;
			this.nextVoice.duration == -1;
			this.nextVoice.name == "";
			this.drawStack(this.stack);

			if (this.isAllClear) {
				this.isAllClear = false;
				this.playAllClearAnim(2);
				this.divScoreAttackingTrash += 70 * 30 * this.fixedAtkHandicap * this.decreaseTargetPoint;
			}

			if (this.insane.isOn) {
				////console.log(this.getQPosY(2));

				if (this.insane.insaneType == 0 && this.forecastedChain == this.actualChain) {
					this.insane.chainScore = this.actualChain;
					if (this.insane.requireChain <= this.insane.chainScore) this.nextVoice.name = "insane_success";
					if (this.insane.requireChain > this.insane.chainScore) this.nextVoice.name = "insane_fail";
					//alert("nope")
				}




				this.parent.insaneBg.moveEye(this.getQPosX(this.pop.x), this.getQPosY(this.pop.y - this.fieldSize.hh), false);
				this.parent.insaneBg.changeColor();
			}
			if (this.chain == 1) {
				//this.opponentGarbageBehind = {};
				game.forEachPlayer(player => {
					delete this.opponentGarbageBehind[player.player];

					if (this.parent.player !== player.player && !player.isGarbageBehindActive) {
						this.opponentGarbageBehind[player.player] = 1;
						////console.log("IS GARVAGE BEHIND ACTIF: " + player.player);
						////console.log(this.opponentGarbageBehind)
					}
				});
			}

		}
		else {
			this.firstGroupsPop.length = 0;
			this.previousChain = this.chain;
			let feverAC = false;

			if (this.insane.isOn) {
				if (this.insane.time <= 0 || this.insane.isCommandedEnd) {
					if (this.chain > 0) {
						if (this.insane.insaneType == 0 || this.insane.insaneType === 2) {
							this.insane.chainScore = this.chain + (isAllClear ? 2 : 0);
							let sum = Math.min(this.insane.chainScore + 1, 15) - 3;
							let difference = Math.max(3, this.insane.requireChain - Math.min(2, this.insane.requireChain - this.insane.chainScore - 1)) - 3;

							if (this.insane.requireChain <= this.insane.chainScore) {
								this.parent.feverStat.presetChain = sum;

							}
							if (this.insane.requireChain > this.insane.chainScore) {
								this.insane.status = "fail";

							}

						}
					}
					this.parent.insaneBg.moveEye(this.parent.fieldSize.w / 2, this.parent.fieldSize.vh / 2, true);

					this.insane.delay.turningOff = 3;
				} else
				if (this.actualChain > 0) {
					this.canFallTrash = false;

					if (this.insane.time > 1 && this.insane.insaneType !== 1) {
						this.insane.time += this.insane.timeAdditions.fixedTimeAdd * 60;
						this.insane.time += this.insane.timeAdditions.timeAddMult * Math.max(0, this.actualChain - this.insane.timeAdditions.minChain) * game.FPS;
						//this.chain = 0;
					}


					if (this.insane.insaneType == 0 || this.insane.insaneType === 2) {
						this.insane.delay.del = 5;
						this.insane.chainScore = this.chain + (isAllClear ? 2 : 0);
						let sum = Math.min(this.insane.chainScore + 1, 15) - 3;
						let difference = Math.max(3, this.insane.requireChain - Math.min(2, this.insane.requireChain - this.insane.chainScore - 1)) - 3;

						if (this.insane.requireChain <= this.insane.chainScore) {
							this.parent.feverStat.presetChain = sum;
							this.insane.status = "success";
						}
						if (this.insane.requireChain > this.insane.chainScore) {
							this.insane.status = "fail";
							this.parent.feverStat.presetChain = difference;
						}
					}

					if (this.insane.status == "success") this.nextVoice.name = "insane_success";
					if (this.insane.status == "fail") this.nextVoice.name = "insane_fail";

					this.parent.insaneBg.moveEye(this.parent.fieldSize.w / 2, this.parent.fieldSize.vh / 2, true);

				}

			} else {
				//this.chain = 0;
			}

			if (isAllClear && this.chain > 0) {

				if (!this.insane.isOn) {
					if (this.isFever) {
						//this.resetGrid();

						//if (this.insane.time > 1) //this.insane.time += this.insane.timeAdditions.allClear * game.FPS;
						this.parent.feverStat.addTime(5);
						//this.playAllClearAnim(1);
						this.setDelay(0, 20);
						if (this.isAllClearTemp < 1) {
							this.isAllClearTemp = 40;
							this.playAllClearAnim(1);
						}
						if (this.parent.feverStat.maxGauge <= this.parent.feverStat.gaugeValue && this.insane.insaneType == 0) {
							this.parent.feverStat.presetChain += 2;
							if (this.parent.feverStat.presetChain > 15 - 3) {
								this.parent.feverStat.presetChain = 15 - 3;
							}
						}
						else this.insane.blobToField(1, true, true);
						feverAC = true;


					} else {

						this.playAllClearAnim(1);
						this.isAllClear = true;
						this.parent.score += 2100;
						//feverAC = true;
					}

					this.parent.playVoice("zenkeshi");

				}
				else {
					if (this.insane.time > 1 && (this.parent.feverStat.isUseTimer)) {
						this.insane.time += this.insane.timeAdditions.allClear * game.FPS;
						if (this.insane.time > (30 * game.FPS)) this.insane.time = 30 * game.FPS;


					}
					if (this.isAllClearTemp < 0) {
						this.isAllClearTemp = 40;
						this.playAllClearAnim(1);
					}
					if (this.insane.isUnlimited && this.insane.insaneType == 1) {
						this.chain += this.actualChain;
					}
				}

				if (this.insane.isOn) {

				}
				this.parent.playSound("allclear");

				let px = (this.parent.assetRect("FIELD").x) + (this.parent.fieldCellSize * this.getQPosX(this.pop.x));
				let py = (this.parent.assetRect("FIELD").y) + (this.parent.fieldCellSize * this.getQPosY(this.pop.y - this.fieldSize.hh));


				/*htmlEffects.add("All Clear", px, py, 50, {
					name: "chain-text-anim",
					iter: 1,
					timefunc: "cubic-bezier(0,0,1,0)",
					initdel: 0,
				}, "text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; --__chaintext_size: 1.2em");*/

			}

			if (!feverAC) this.setDelay(0, 3);

			this.actualChain = 0;

			this.isChainUp = false;

		}


		//return null;
	}

	checkForecast() {
		let width = this.fieldSize.w,
			height = this.fieldSize.h,
			hiddenHeight = this.fieldSize.hh;
		let grid = JSON.parse(JSON.stringify(this.stack));
		let a = blobChainDetector.forecast(grid, width, hiddenHeight, height, this.blobRequire);
		this.forecastedChain = a.chain;
		this.blobCount = a.remaining;
		//console.log(this.parent.player, a.chain);
		if (a.chain > 6) {
			/*
			if (this.parent.isVisible && false) {
				let asset = this.parent.assetRect(this.isAux ? "AUX-FIELD" : "FIELD");
				let plw = this.isAux ? 0.47 : 1;
				let px = (asset.x) + (this.parent.fieldCellSize * this.getQPosX(this.piece.x) * plw);
				let py = (asset.y) + (this.parent.fieldCellSize * this.getQPosY(this.piece.y - this.fieldSize.hh) * plw);
				htmlEffects.add(language.translate("7chain"), px, py, 50, {
					name: "chain-text-anim",
					iter: 1,
					timefunc: "cubic-bezier(0,0,1,0)",
					initdel: 0,
				}, "color: #ff0; text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; --__chaintext_size: 1.5em")


			}
			*/
		}
	}

	checkHoles() {
		this.holes = 0;
		for (var x = 0; x < this.fieldSize.w; x++) {
			var block = false;
			for (var y = 0; y < this.fieldSize.h; y++) {
				if (this.stack[x][y]) {
					block = true;
				} else if (this.stack[x][y] == 0 && block) {
					this.holes++;
					//this.delay.drop = Math.floor(200 * (this.frenzy.isOn || this.frenzy.isReady ? 0.9 : 1));
					//this.delay.dropContinuous = Math.floor(15 * (this.frenzy.isOn || this.frenzy.isReady ? 0.9 : 1));;
					this.dropDelay = 2;
					this.setDelay(1, 10);
					this.setDelay(0, 10);
				}
			}
		}

	}

	checkDropBlock() {
		if (this.holes > 0) {
			let isLand = false,
				isFront = false;

			for (var x = 0; x < this.fieldSize.w; x++) {
				let isPauseDrop = false;
				let isLand = false,
					isFront = false;
				for (var y = this.fieldSize.h; y >= -1; y--) {
					if (!this.testGridSpace(x, y - 1)) {
						isPauseDrop = false;
						continue;
					}
					if (!this.testGridSpace(x, y) && !isPauseDrop) {
						this.stack[x][y] = this.stack[x][y - 1];
						this.stack[x][y - 1] = 0;
						if (this.testGridSpace(x, y + 1) && !isFront) {
							isLand = true;
						}
						isFront = true;
						//if (this.frenzy.isReady || this.frenzy.isOn)
						if (this.insane.isOn) isPauseDrop = true;
					}
				}
				if (isLand) this.parent.playSound("blub_drop");
			}
			this.checkHoles();
			this.drawStack(this.stack);
		}
	}

	checkBlobCount(stack) {
		let count = 0;
		if (!(this.insane.isOn) && this.isActive && this.isEnable) {

			for (let x = 0; x < this.fieldSize.w; x++) {
				for (let y = this.fieldSize.hh - 1; y < this.fieldSize.h; y++) {
					if (stack[x][y] > 0) count++;
				}
			}
		}
		return count;

	}

}

const blobChainDetector = new class {
	#NUISANCE = 6;
	#DIRECTIONS = [[0, 1], [0, -1], [1, 0], [-1, 0]];
	constructor() {}

	fetchConnections(board, width, hiddenHeight, height) {
		let connectionGroups = {};
		let detected = {};
		let colors = {};
		let longestGroup = 0;

		for (let x = 0; x < width; x++) {
			for (let y = hiddenHeight; y < height; y++)
				if (!(`${x}|${y}` in detected) && board[x][y] > 0 && board[x][y] !== this.#NUISANCE) {
					let obj = {};
					let length = 0;
					this.bfs(obj, board, x, y, width, hiddenHeight, height);
					/*connectionGroups[`${x}|${y}`] = {
						
					};*/
					connectionGroups[`${x}|${y}`] = {

					};
					let cm = connectionGroups[`${x}|${y}`];
					/*cm[`${x}|${y}`] = {
						color: board[x][y],
						x: x,
						y: y
					};*/

					detected[`${x}|${y}`] = board[x][y];
					let c = cm;
					//connectionGroups[1][2][prop]
					for (let shot in obj) {
						let mx = obj[shot].x;
						let my = obj[shot].y;
						c[shot] = {
							color: obj[shot].color,
							x: mx,
							y: my
						};
						if (obj[shot].color in colors) {
							colors[obj[shot].color]++;
						} else {
							colors[obj[shot].color] = 1;
						}
						detected[`${mx}|${my}`] = obj[shot].color;
						length++;
					}
					////console.log(obj);
					if (length > longestGroup) longestGroup = length;
				}
		}

		////console.log(connectionGroups);

		return {
			connections: connectionGroups,
			colors: colors,
			longest: longestGroup

		}

	}

	removeAdjacentNuisance(board, x, y, width, hiddenHeight, height) {
		let popped = 0;
		for (let i = 0; i < 4; i++) {
			const dir = this.#DIRECTIONS[i];
			let dx = x + dir[0];
			let dy = y + dir[1];
			if (dx >= width || dx < 0 || dy >= height || dy < hiddenHeight) continue;
			const adjacent = board[dx][dy];

			if (adjacent == this.#NUISANCE && !(dx > width || dx < 0 || dy > height || dy < hiddenHeight)) {
				board[dx][dy] = 0;
				popped++;
			}

		}
		return popped;
	};

	forecast(board, width, hiddenHeight, height, requirePop) {
		let chain = 0;
		let testBoard = JSON.parse(JSON.stringify(board));
		let longestGroup = 0;
		let isAllClear = false;
		//let finished = 0;
		let popped = 0;
		let remaining = 0;
		while (true) {
			this.checkHoles(testBoard, width, hiddenHeight, height);
			let obj = this.fetchConnections(testBoard, width, hiddenHeight, height);
			let isChain = false;
			if (obj.longest === 0) {
				//isAllClear = true;
				break;
			}
			if (obj.longest < (requirePop || 4)) break;

			for (let j in obj.connections) {
				let count = Object.keys(obj.connections[j]).length;
				//remaining += count;
				if (count >= requirePop) {
					isChain = true;
					//testBoard[popRef.x][popRef.y] = 0;
					for (let jh in obj.connections[j]) {
						let popRef = obj.connections[j][jh];
						//let len = Object.keys(popRefArr).length;
						//	for (let p = 0; p < len; p++) {
						//let popRef = popRefArr[p];
						popped += this.removeAdjacentNuisance(testBoard, popRef.x, popRef.y, width, hiddenHeight, height);
						testBoard[popRef.x][popRef.y] = 0;
						popped++;
						//remaining--;
						//}
					}
				}

				/*for (let jl in obj.connections[j]) {
				
				}*/
			}
			if (isChain) {
				chain++;
			} else {
				break;
			}
		}

		for (let x = 0; x < width; x++) {
			for (let y = hiddenHeight - 1; y < height; y++) {
				if (testBoard[x][y] > 0) remaining++;
			}
		}

		if (remaining === 0) isAllClear = true;

		if (isAllClear) {
			//game.pauseGame();
			//alert("HOLY SHOT");
		}

		return {
			chain: chain,
			allClear: isAllClear,
			popped: popped,
			remaining: remaining
		};
	}

	testSpace(board, x, y, width, height) {
		if (x < 0 || x >= width) {
			return true;
		}
		if (y < height) {
			if (typeof board[x][y] !== "undefined" && board[x][y] !== 0) {
				return true;
			}
			return false;
		}
		return true;
	}
	checkHoles(board, width, hiddenHeight, height) {
		let checked = true;
		for (let t = 0; t < height && checked; t++)
			for (var y = height - 1; y >= hiddenHeight - 2; y--) {
				for (var x = 0; x < width; x++) {
					checked = true;
					if (!this.testSpace(board, x, y - 1, width, height)) {
						continue;
					}
					if (!this.testSpace(board, x, y, width, height)) {
						board[x][y] = board[x][y - 1]
						board[x][y - 1] = 0;
						checked = false;
					}
				}
			}
	}

	bfs(referenceObject, board, x, y, width, hiddenHeight, height, modulo) {
		//recursion function: Breadth-First Search Algorithm 
		let a = referenceObject || {};
		let mod = modulo || 0;
		if (!(x > width || y >= height || y < hiddenHeight || (`${x}|${y}` in a))) {
			let origin = board[x][y];
			if (mod) {
				origin %= mod;
			}
			if (origin > 0 && origin !== this.#NUISANCE) {
				a[`${x}|${y}`] = {
					color: origin,
					x: x,
					y: y
				};
				for (let i = 0; i < 4; i++) {
					const dir = this.#DIRECTIONS[i];
					if (((x + dir[0]) < 0 || (x + dir[0]) >= width || (y + dir[1]) >= height || (y + dir[1]) < hiddenHeight)) continue;
					let adjacent = board[x + dir[0]][y + dir[1]];
					if (mod) {
						adjacent %= mod;
					}

					if (adjacent === origin) {

						this.bfs(a, board, x + dir[0], y + dir[1], width, hiddenHeight, height, mod);
					}

				}
			}

		};
		////console.log(a);
	}

}();

class SwapModeParameters {
	constructor(parent) {
		this.parent = parent;

		this.isOn = false
		//this.time = -9;
		this.time = -9;
		this.a = 0;

		this.isOK = {
			chain: 0,
			combo: 0
		}
	}
	reset() {
		//this.isOn = false
		//this.time = -9;

		this.time = -9;
		this.a = 0;

		this.isOK.chain = 0,
			this.isOK.combo = 0;

	}
	run() {
		if (!this.isOn) return;
		if (this.time >= 0) {
			this.time--;
			if (this.time == 0) {

				this.a = 0;
			}
		}

	}
	add(type) {

		if (!this.isOn) return;
		if (this.a <= 0) {
			if (this.time > 0) {
				if (type == "chain") this.isOK.chain = 1;
				if (type == "combo") this.isOK.combo = 1;
				if (this.isOK.chain && this.isOK.combo) {
					this.a++;
					this.parent.playSound(`swapcombo${Math.min(7, this.a)}`)
					this.time = 10 * game.FPS;
				}
			}
		} else {
			if (this.time > 0) {
				this.a++;
				this.parent.playSound(`swapcombo${Math.min(7, this.a)}`)
			}
		}
	}
	playSwapAnim() {

		let ma = this.parent;

		let mainElem = ma.getAsset("FIELD-DYNAMIC"),
			auxElem = ma.getAsset("AUX-FIELD");
		mainElem.offsetHeight;
		auxElem.offsetHeight;
		let height = ma.fieldSize.vh + ma.visibleFieldBufferHeight,
			fieldHeight = ma.fieldSize.vh + ma.visibleFieldHeight,
			width = ma.fieldSize.w,
			px = 0.47;
		let main = ma.assetRect("FIELD-INSANE"),
			aux = ma.assetRect("AUX-FIELD-INSANE"),
			distanceMainX = aux.x - main.x,
			distanceMainY = (aux.y + (ma.fieldCellSize * (ma.visibleFieldBufferHeight * px))) - main.y,
			scaleDifferenceMain = (px * (ma.fieldCellSize * width) * (ma.fieldCellSize * fieldHeight)) / ((ma.fieldCellSize * width) * (ma.fieldCellSize * fieldHeight)),
			distanceAuxX = main.x - aux.x,
			distanceAuxY = main.y - aux.y,
			scaleDifferenceAux = ((ma.fieldCellSize * width) * (ma.fieldCellSize * fieldHeight)) / (px * (ma.fieldCellSize * width) * (ma.fieldCellSize * fieldHeight));


		mainElem.style.setProperty("--transX", `${distanceMainX}px`);
		mainElem.style.setProperty("--transY", `${distanceMainY}px`);
		mainElem.style.setProperty("--transSize", `${scaleDifferenceMain}`);
		mainElem.style.setProperty("--zIndex", `${1}`);

		auxElem.style.setProperty("--transX", `${distanceAuxX}px`);
		auxElem.style.setProperty("--transY", `${distanceAuxY}px`);
		auxElem.style.setProperty("--transSize", `${scaleDifferenceAux}`);
		auxElem.style.setProperty("--zIndex", `${2}`);


		ma.playUnfreezableAnimation("swapMain");
		ma.playUnfreezableAnimation("swapAux");
	}
}

class WarOfInsanityParameters {
	constructor(parent) {
		this.parent = parent;

		this.isOn = false;
		//this.time = -9;

		this.a = 0;
		this.damageSent = 0;
		this.damageSentPerHit = 4;
		this.damageReceived = 0;
		this.damageInflicted = 0;
	}
	reset() {
		//this.isOn = false
		//this.time = -9;
		this.damageInflicted = 0;

		this.a = 0;
		this.damageReceived = 0;
		this.damageSentPerHit = 1;
	}

	add(add) {

		if (!this.isOn) return;
		this.a += add;
	}

}

class WMWWormhole {

	constructor(parent) {
		this.parent = parent;
		this.phase = 0;
		this.canvas;
		this.ctx;
		this.cellSize = 40;
		this.colors = {
			r: 250,
			g: 60,
			b: 48,
		}

		this.enable = false;



		this.wormhole = new FrameRenderer(0, 124, (frame, max, that) => {
			if (animatedLayers.checkObject(this.parent.getCanvasAnimationPlainName("wormhole"))) {

				let a = animatedLayers.getObject(this.parent.getCanvasAnimationPlainName("wormhole"));

				if (this.phase == 0 && that.frame >= 15 * 2) {
					this.phase = 1;
				}

				if (this.phase == 1 && that.frame >= 45 * 2) {
					that.frame = 15 * 2;
					frame = 15 * 2;
				}

				if (this.phase == 2 && that.frame < 45 * 2) {
					that.frame = 45 * 2;
					frame = 45 * 2;
				}

				if (this.phase == 2 && that.frame > 60 * 2) {
					this.enable = false;
					//that.frame.x = 0;
					animatedLayers.remove(this.parent.getCanvasAnimationPlainName("wormhole"));
				}

				if (this.phase == 3 && that.frame > 0 * 2) {
					this.enable = false;
					//that.frame.x = 0;
					animatedLayers.remove(this.parent.getCanvasAnimationPlainName("wormhole"));
				}
				a.centerPos.x = this.parent.playerCenterPos.x;
				a.centerPos.y = this.parent.playerCenterPos.y;
				a.sizeMult = this.parent.fieldCellSize * 6;
				a.frame.elapsed = frame / 2;
				a.frame.int = 60 - (frame / 2);

			}
		});



		/*this.wormhole.temp = new OffscreenCanvas(200, 200),
		 this.wormhole.tempCtx = this.wormhole.temp.getContext("2d"),
		 this.wormhole.main = new GIFRenderer(200 * 10, 200 * 6, 200, 200, 0, (a, canv, x, y, w, h, frame, that) => {
		  let b = a.canvas; // a.canvas is the main canvas, this.canvas
		  a.clearRect(0, 0, b.width, b.height);
		  //let mm = ((0) % 360);
		  this.wormhole.tempCtx.clearRect(0, 0, w, h);


		  if (that.frame.x <= -1) {
		   that.frameCount = 0;
		   that.frame.x = 0;
		  }

		  if (this.phase == 0 && that.frameCount >= 15) {
		   this.phase = 1;
		  }

		  if (this.phase == 1 && that.frameCount >= 45) {
		   that.frameCount = 15;
		   that.frame.x = 15;
		  }

		  if (this.phase == 2 && that.frameCount < 45) {
		   that.frameCount = 45;
		   that.frame.x = 45;
		  }

		  if (this.phase == 2 && that.frameCount > 60) {
		   this.enable = false;
		   //that.frame.x = 0;
		  }

		  this.wormhole.tempCtx.drawImage(canv, ~~(x % 10) * w, (~~(x / 10)) * h, w, h, 0, 0, w, h);
		  let centerSize = 6;
		  ////console.log(this.parent.player + ": " + that.frame.x)

		  a.drawImage(this.wormhole.temp, 0, 0, w, h, (this.parent.cellSize * ((-5) - (centerSize / 2))), this.parent.cellSize * ((-centerSize / 2)), this.parent.cellSize * (this.parent.fieldSize.vh + centerSize), this.parent.cellSize * (this.parent.fieldSize.vh + centerSize));


		  that.frame.x += 0.5;
		  that.frameCount += 0.5;


		  //if (frame >= 30) that.enabled = false
		  //if (frame == 30) that.actualFrames = 0;
		 }, (frame) => {
		  //this.setStyle("CLEARTEXT-CANVTEXT", "animation-delay", `${~~((1000 / -60) * (frame))}ms`);
		 }, true);*/



	}

	fetchAsset(name) {
		/*this.canvas = canvas;
		this.ctx = ctx;

		/*this.wormhole.main.initialize(this.ctx);
		this.wormhole.main.loadImages([]);
		this.wormhole.main.exec(0, 0);
		this.wormhole.tempCtx.drawImage(this.wormhole.main.getCanvas(), 0, 0);
		this.wormhole.tempCtx.clearRect(0, 0, 100, 100);*/




	}

	reset() {
		/*this.wormhole.tempCtx.drawImage(this.wormhole.main.getCanvas(), 0, 0);

		/**/
		this.enable = true;
		this.phase = 3;
	}

	changeColorCustom(r, g, b) {
		//let ml = ~~(Math.random() * 10);
		this.colors.r = r;
		this.colors.g = g;
		this.colors.b = b;

	}

	engage(type) {
		this.enable = true;

		this.phase = type;
		animatedLayers.remove(this.parent.getCanvasAnimationPlainName("wormhole"));
		animatedLayers.create(this.parent.getCanvasAnimationPlainName("wormhole"),
			60,
			this.parent.playerCenterPos.x,
			this.parent.playerCenterPos.y,
			0, 0,
			200, 200,
			5,
			5,
			1,
			"wormhole",
			10,
			this.parent.fieldCellSize * 6,
			{
				on: false
			},
			true,
			true
		);
		this.wormhole.reset(type);
	}
	draw() {
		if (!this.enable) return;
		//this.parent.canvasClear("wormhole");
		//this.eye.x = Math.random() * 10;

		let w = this.parent.fieldSize.w;
		let vh = this.parent.fieldSize.vh;

		//this.parent.canvasCtx.insane.fillStyle = `rgba(${this.colors.r * 0.8},${this.colors.g * 0.8},${this.colors.b * 0.8}, 0.8)`;

		/*this.parent.canvasCtx.insane.fillRect(
		 0, 0,
		 this.parent.cellSize * (w),
		 this.parent.cellSize * (vh)
		);*/

		//this.parent.canvasCtx.insane.fillStyle = `rgba(${~~(Math.random() * 255)},${~~(Math.random() * 255)},${~~(Math.random() * 255)}, 0.5)`;

		////console.log(this.parent.cellSize)
		this.wormhole.run();
	}


}

const feverGaugeStorage = new class {

	constructor() {
		this.image = new Image();
		this.canvas = new Image();
		this.ctx;
		this.Main = class {
			constructor(x, y, size) {
				this.status = 0;
				this.x = x;
				this.y = y;
				this.size = size;
			}
		};
	}

	load(f, l) {
		return new Promise(async res => {
			let n = await loadImage(f);
			let m = await loadImage(l);
			//this.image = n;
			this.canvas = new OffscreenCanvas(2000, (200 + 140));
			this.ctx = this.canvas.getContext("2d");
			this.ctx.drawImage(n, 0, 0);
			this.ctx.drawImage(m, 0, 0, 70 * 10, 70 * 2, 0, 200, 70 * 10, 70 * 2);
			res();
		});
	}
}();

class FeverGaugeStat {
	constructor(parent) {
		this.parent = parent;
		this.isOn = false;
		this.initialGauge = 0;
		this.gaugeValue = 1;
		this.refGaugeValue = {
			a: new NumberChangeFuncExec(0, (n) => {
				this.refGaugeValue.m = n;
			}),
			m: 0,
		};
		this.maxGauge = 7;
		this.addGauge = 1;
		this.time = 15 * 60;
		this.presetChain = 2
		this.canvas;
		this.ctx;
		this.div;
		this.dim = { w: 0, h: 0 };
		this.cellSize = 0;
		this.reversed = false;
		this.frame = {
			int: 10,
			dark: 10
		};

		this.isUseTimer = false;

		this.colored = {
			on: false,
			//main: new FrameRenderer(0, 7 * 10)
			frame: 0,
		};
		/*500x1500

1: (182, 176) 
2: (340, 416)
3: (373, 654)
4: (288, 850l
5: (188, 1018)
6: (129, 1193)
7: (131, 1382)*/

		let orb = [
			{
				x: 0.218,
				y: 0.92,
				cs: 1.3
   },
			{
				x: 0.215,
				y: 0.795,
				cs: 1.3
   },
			{
				x: 0.313,
				y: 0.678,
				cs: 1.5
   },
			{
				x: 0.48,
				y: 0.566,
				cs: 1.7
   },
			{
				x: 0.621,
				y: 0.436,
				cs: 1.9
   },
			{
				x: 0.566,
				y: 0.277,
				cs: 2.1
   },
			{
				x: 0.303,
				y: 0.117,
				cs: 3
  }, ];
		this.orbs = orb;

		this.main = new ObjectFunctionIterator(main => {
			let g = Object.keys(main);
			let l = g.length;
			let ht = 0;
			this.ctx.clearRect(0, 0, this.dim.s, this.dim.h);
			let lt = true;
			for (let h = 0; h < l; h++) {
				let el = main[g[h]];
				let mm = this.refGaugeValue.m > h ? 1 : 0;

				if (this.colored.on) {
					mm = ((h + 8 - ~~(this.colored.frame / 8)) % 8) + 2;
					if (lt && (this.colored.frame % 8 == 0) && ((~~(this.colored.frame / 8) % 8) !== 7)) {
						let mt = this.parent.assetRect("FEVER-GAUGE");
						let tx = mt.x;
						let ty = mt.y;
						let dw = mt.width;
						let dh = mt.height;
						let cs = this.parent.fieldCellSize;
						let ml = main[g[(~~(this.colored.frame / 8) % 8)]];
						lt = false;

						if (this.parent.isVisible) animatedLayers.create(undefined, 34,
							tx + (dw * (this.reversed ? (1 - ml.x) : (ml.x))), ty + (dh * ml.y) - (this.parent.fieldCellSize * 0),

							0,
							0,
							200,
							200,
							5,
							5,
							1,
							"fever_shine",
							10,
							2
						);
					}
				}

				this.ctx.drawImage(feverGaugeStorage.canvas, mm * 200, 0, 200, 200, (this.dim.w * (this.reversed ? (1 - el.x) : (el.x))) - (this.cellSize * el.size / 2), (this.dim.h * el.y) - (this.cellSize * el.size / 2), this.cellSize * el.size, this.cellSize * el.size);


				if (h == this.frame.dark && !this.colored.on) {
					let cctx = this.ctx;

					if (this.frame.int < 6) cctx.fillStyle = "rgba(0,0,0,0.7)";
					else cctx.fillStyle = "rgba(0,0,0,0.5)";
					cctx.globalCompositeOperation = "source-atop";
					cctx.fillRect((this.dim.w * (this.reversed ? (1 - el.x) : (el.x))) - (this.cellSize * el.size / 2), (this.dim.h * el.y) - (this.cellSize * el.size / 2), this.cellSize * el.size, this.cellSize * el.size);
					cctx.globalCompositeOperation = "source-over";
					//cctx.globalAlpha = 1;

				};
			}
		});

		for (let h = 0; h < 7; h++) {
			let ob = orb[h];
			this.main.addItem(`a${h}`, new feverGaugeStorage.Main(ob.x, ob.y, ob.cs));
		}
	}

	add() {
		if (this.gaugeValue < this.maxGauge) {
			this.gaugeValue += this.addGauge;
			if (this.gaugeValue > this.maxGauge) this.gaugeValue = this.maxGauge;

			return true;
		}
		return false;
	}

	reset() {
		this.gaugeValue = this.initialGauge;
		this.time = 15 * 60;

		this.playColored(false);

		this.refresh();
		this.colored.frame = 0;
	}

	resetRound() {
		this.reset();
		this.presetChain = 2;
	}

	resize(w, h, cs, r) {
		this.dim.w = w;
		this.dim.h = h;
		this.cellSize = cs;
		this.reversed = r;
	}

	fetchAsset(canvas, ctx, div) {
		this.canvas = canvas;
		this.ctx = ctx;
		this.div = div;
	}

	playColored(bool) {
		this.colored.on = bool;
		if (this.colored.on) {

		}
	}

	run() {
		if (this.isOn) {
			this.parent.canvasClear("feverGauge");
			this.main.update();
			this.frame.int--;




			if (this.frame.int <= 0) {
				this.frame.int = 10;
				this.frame.dark++;
				if (this.frame.dark > 7) this.frame.dark = -10;
			}

			if (this.colored.on) {
				//this.frame.int = 10;
				this.colored.frame++;
				if (this.colored.frame >= 8 * 8) this.colored.frame = 0;
			}

			{

				let time = Math.max(0, Math.floor((this.colored.on ? this.parent.blob.insane.time : this.time) / game.FPS)),
					ones = time % 10,
					tens = ~~(time / 10);

				let mx = 0.3,
					my = 0.4,
					ms = 2.6;

				let warning = time < 6 && (this.colored.frame % 16) > 8;
				this.ctx.drawImage(feverGaugeStorage.canvas, ones * 70, 200 + (warning ? 70 : 0), 70, 70, (this.dim.w * (this.reversed ? (1 - mx) : (mx))) - (this.cellSize * (ms + (this.reversed ? (-ms) : (0))) / 2), (this.dim.h * my) - (this.cellSize * ms / 2), this.cellSize * ms, this.cellSize * ms);
				this.ctx.drawImage(feverGaugeStorage.canvas, tens * 70, 200 + (warning ? 70 : 0), 70, 70, (this.dim.w * (this.reversed ? (1 - mx) : (mx))) - (this.cellSize * (ms + (!this.reversed ? (ms) : (0))) / 2), (this.dim.h * my) - (this.cellSize * ms / 2), this.cellSize * ms, this.cellSize * ms);

			}
		}
	}

	enable(bool) {
		this.isOn = bool;
		styleelem(this.div, "display", this.isOn ? "flex" : "none");
	}

	refresh() {
		this.refGaugeValue.a.assign(this.gaugeValue);
	}

	addTime(int) {
		if (true) {
			this.time += int * game.FPS;
			if (this.time > 30 * game.FPS) this.time = 30 * game.FPS;

			let m = this.parent.assetRect("FEVER-GAUGE");
			let px = (m.x) + (!this.reversed ? (m.width * (1 - 0.3)) : (m.width * 0.3));
			let py = (m.y) + (m.height * 0.3);


			htmlEffects.add(`+${int}s`, px, py, 50, {
				name: "chain-text-anim",
				iter: 1,
				timefunc: "cubic-bezier(0,0,1,0)",
				initdel: 0,
			}, "text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black; --__chaintext_size: 1.2em");

			return true;
		}
		return false;
	}

}

class Player extends MainPlayerFragment {
	constructor(player, n) {
		super(player, n);

		//TODO make groups of Gachae Linkblobs and Gachaminoes

		this.swapMode = new SwapModeParameters(this);
		this.auxEnabled = false;
		this.isDead = false;
		this.isDying = false;

		this.controlsBitwise = {
			on: true,
			bit: 0,
			//letters: "AaBbCcDdEeFfGgHhIiJjKk",
			maxBits: 0b11111111111,
			bitList: {

			}
		};

		this.isWarning = false;

		this.warningTrig = new NumberChangeFuncExec(0, (t) => {
			this.isWarning = t;
			this.drawCharacterBg(t);
		});

		this.isFinishAble = false;

		this.isLosePlayed = false;

		this.isWin = false;
		this.hasWon = false;

		this.block = new GachatrisBlock(this);
		this.blob = new NeoplexianBlob(this);

		this.insaneBg = new InsaneBackground(this);
		this.woi = new WarOfInsanityParameters(this);
		this.woiWormhole = new WMWWormhole(this);
		this.feverStat = new FeverGaugeStat(this);
		this.isGarbageCollectionMode = false;
		this.isInsaneModeOnly = false;

		this.canAttack = true;
		this.garbage = [];
		this.garbageBehind = [];
		this.isGarbageBehindActive = false;
		this.delayedGarbage = 0;
		this.garbageLength = 0;
		this.garbageBehindLength = 0;

		this.garbageBlocking = "full";

		this.garbageDelay = 30;

		this.garbageType = 0;

		this.stats = {
			line1: 0,
			line2: 0,
			line3: 0,
			line4: 0,
			line5: 0,
			pc: 0,
			tspin0: 0,
			tspin1: 0,
			tspin2: 0,
			tspin3: 0,
			tspinmini0: 0,
			tspinmini1: 0,
			tspinmini2: 0,
			tspinmini3: 0,

			allspin0: 0,
			allspin1: 0,
			allspin2: 0,
			allspin3: 0,
			allspinmini0: 0,
			allspinmini1: 0,
			allspinmini2: 0,
			allspinmini3: 0,

			highestCombo: 0,


		};

		this.dividedBlobScoreGarbage = 0;
		this.blobGarbage = 0;

		this.isGarbageTrayMode = false;
		this.garbageTrayObjects = [];
		this.garbageTrayBehindObjects = [];
		this.garbageLastForTray = new NumberChangeFuncExec(-1, (m) => {
			let q = m;
			let count = 0;
			for (let b = 0; b < 6; b++) {
				let index = 0;
				if (q >= 1440) {
					q -= 1440;
					index = 7;
				} else if (q >= 720) {
					q -= 720;
					index = 6;
				} else if (q >= 360) {
					q -= 360;
					index = 5
				} else if (q >= 180) {
					q -= 180;
					index = 4;
				} else if (q >= 30) {
					q -= 30;
					index = 3;
				} else if (q >= 6) {
					q -= 6;
					index = 2;
				} else if (q >= 1) {
					q -= 1;
					index = 1;
				}

				this.garbageTrayObjects[b].x = index;
			}
			this.garbageTrayAnimDelay = 20;
			this.drawGarbageTray();
		});
		this.garbageBehindLastForTray = new NumberChangeFuncExec(-1, (m) => {
			let q = m;
			let count = 0;
			for (let b = 0; b < 6; b++) {
				let index = 0;
				if (q >= 1440) {
					q -= 1440;
					index = 7;
				} else if (q >= 720) {
					q -= 720;
					index = 6;
				} else if (q >= 360) {
					q -= 360;
					index = 5
				} else if (q >= 180) {
					q -= 180;
					index = 4;
				} else if (q >= 30) {
					q -= 30;
					index = 3;
				} else if (q >= 6) {
					q -= 6;
					index = 2;
				} else if (q >= 1) {
					q -= 1;
					index = 1;
				}

				this.garbageTrayBehindObjects[b].x = index;
			}
			this.garbageTrayBehindAnimDelay = 20;
			this.drawGarbageTrayBehind();
		});
		for (let w = 0; w < 6; w++) this.garbageTrayObjects.push(new GarbageTrayObject());

		for (let w = 0; w < 6; w++) this.garbageTrayBehindObjects.push(new GarbageTrayObject());

		this.garbageTrayAnimDelay = 20;
		this.garbageTrayBehindAnimDelay = 20;

		this.activeType = 0;

		this.fieldAnimations = {};

		this.playerTarget = [];

		this.emAnimationSetting = {
			on: false,
			time: -9,
			name: ""
		};

		this.flagPresses = {};
		this.flagNamesByChar = {
			a: "left",
			b: "right",
			d: "harddrop",
			c: "softdrop",
			g: "cw",
			f: "ccw",
			h: "c180w",
			e: "hold"
		};

		this.flagsLowerToUpper = {};

		// well this is dumb
		for (let q in this.flagNamesByChar) {
			this.flagsLowerToUpper[q.toUpperCase()] = 1;
		}



		this.flagNames = [
			"left",
			"right",
			"softdrop",
			"harddrop",

			"hold",
			"ccw",
			"cw",
			"c180w"
		];

		for (let u = 0; u < this.flagNames.length; u++) {
			let ref = this.flagNames[u];
			this.controlsBitwise.bitList[ref] = 2 ** (u);
			this.flagPresses[ref] = false;
		}
		////console.log(this.controlsBitwise.bitList)
		this.lastFlagPresses = {};
		for (let a in this.flagPresses) {
			this.lastFlagPresses[a] = false;
			//this.flagNames.push(a);
		}
	}

	runAnimations() {
		for (let h = 0, m = this.animFieldNames.length; h < m; h++)
			this.fieldAnimations[this.animFieldNames[h]].run();

		for (let h = 0, m = this.playcharExt.animname.length; h < m; h++)
			this.playcharExt.anim[this.playcharExt.animname[h]].run();

		if (this.garbageTrayAnimDelay > 0) {
			this.garbageTrayAnimDelay--;

			let center = (((200 * 6) / 2) - (200 / 2));

			let l = Math.min(this.garbageTrayAnimDelay, 20);

			for (let g = 0, lm = this.garbageTrayObjects.length; g < lm; g++) {
				let reference = this.garbageTrayObjects[g];
				let distance = (center) - (g * 200);
				reference.gx = distance * bezier((l) / 20, 0, 1, 0, 0, 0, 1);

			}

			this.drawGarbageTray();
		}

		if (this.garbageTrayBehindAnimDelay > 0) {
			this.garbageTrayBehindAnimDelay--;

			let center = (((200 * 6) / 2) - (200 / 2));

			let l = Math.min(this.garbageTrayBehindAnimDelay, 20);

			for (let g = 0, lm = this.garbageTrayBehindObjects.length; g < lm; g++) {
				let reference = this.garbageTrayBehindObjects[g];
				let distance = (center) - (g * 200);
				reference.gx = distance * bezier((l) / 20, 0, 1, 0, 0, 0, 1);

			}

			this.drawGarbageTrayBehind();
		}

		if (this.emAnimationSetting.on && this.emAnimationSetting.name in this.animationTriggerEvents) {
			this.emAnimationSetting.time++;
			let again = false;
			do {
				if (this.emAnimationSetting.time in this.animationTriggerEvents[this.emAnimationSetting.name]) {

					again = false;
					let ind = this.animationTriggerEvents[this.emAnimationSetting.name][this.emAnimationSetting.time];
					//let ref = this.animationElements[this.emAnimationSetting.name];
					let origin = this.assetRect("OVERLAY-LAYER");
					let originX = origin.x + (origin.width / 2);
					let originY = origin.y + (origin.height / 2);

					////console.log(this.emAnimationSetting.time, ind)
					for (let ma of ind) {
						/*this.animationElements[asset] = {
						 width: mm.width,
						 height: mm.height,
						 frameWidth: mm.framewidth,
						 frameHeight: mm.framebeight,
						 aspectWidth: mm.aspectwidth,
						 aspectHeight: mm.aspectheight,
						 csMult: mm.cellsizemult,
						 frameBound: mm.xbound,
						 src: mm.src,
						 
						};/**/
						if (ma.action === "createAnimLayer") {
							/*      {
							 "action": "createAnimLayer",
							 "targetsrc": "win",
							 "framemax": 1,
							 "framepos": 0,
							 "framedel": 6,
							 "loop": true,
							 "paused": true,
							 "targetid": "win"
							},*/

							//console.log(originX, originY);

							let srcRef = this.animationElements[ma.targetsrc];
							////console.log(this.character.current, srcRef)
							/////console.log(srcRef, ma.targetid)

							let mid = this.getCanvasAnimationName(ma.targetid);
							animatedLayers.create(mid, ma.framemax || 0,
								originX,
								originY,
								0,
								0,
								srcRef.frameWidth,
								srcRef.frameHeight,
								srcRef.aspectWidth * srcRef.csMult,
								srcRef.aspectHeight * srcRef.csMult,
								(1 / ma.framedel),
								this.getCanvasAnimationLoadedName(ma.targetsrc),
								srcRef.frameBound,

								this.fieldCellSize,


								{
									isOn: ma.loop || false,
									resetFrame: ma.resetframe || 0,

								},
								ma.paused,
								true,
							);
							animatedLayers.setOpacity(mid, "opacity" in ma ? ma.opacity : 1, -99);

						}
						if (ma.action == "configureAnimLayer") {
							/*
							"action": "configureAnimLayer",
							 "framemax": 5,
							 "framepos": 1,
							 "framedel": 5,
							 "loop": true,
							 "paused": false,
							 "targetid": "win"
							*/
							//let srcRef = this.animationElements[ma.targetid];
							let target = animatedLayers.getObject(this.getCanvasAnimationName(ma.targetid));
							////console.log(animatedLayers.main.obj, target)
							if ("framemax" in ma) {
								target.frame.max = ma.framemax;
								target.loop.targetFrame = ma.framemax;
							}
							if ("framepos" in ma) {
								target.frame.int = target.frame.max - ma.framepos;
								target.frame.elapsed = ma.framepos;

							}

							if ("framedel" in ma) target.frame.rate = 1 / ma.framedel;
							if ("loop" in ma) target.loop.isOn = ma.loop;
							if ("resetframe" in ma) target.loop.resetFrame = ma.resetframe;
							if ("paused" in ma) target.isPaused = ma.paused;
							//if ("framemax" in ma) target.frame.bound = ma.framemax;
							//console.log(ma,target.isPaused, target.frame.elapsed, target.loop.isOn)
						}
						if (ma.action == "time") {
							this.emAnimationSetting.time = ma.time - 1;
							again = false;
						}
						if (ma.action == "move") {
							////console.log(this.character.current + " " + ma.targetid + " MOVE")
							////console.log(this.character.current, this.animationElements, this.animationTriggerEvents)
							// let srcRef = this.animationElements[ma.targetid];

							let target = animatedLayers.getObject(this.getCanvasAnimationName(ma.targetid));
							target.moveOffset(
								(ma.x0),
								(ma.y0),
								(ma.x1),
								(ma.y1),
								ma.duration);
						}
						if (ma.action == "opacity") {
							////console.log(this.character.current + " " + ma.targetid + " MOVE")
							////console.log(this.character.current, this.animationElements, this.animationTriggerEvents)
							//let srcRef = this.animationElements[ma.targetid];
							animatedLayers.setOpacity(this.getCanvasAnimationName(ma.targetid), "opacity" in ma ? ma.opacity : 1, ma.duration);

						}
					}
				}
			} while (again);
		}

	}

	playEmAnimation(name) {

		this.emAnimationSetting.name = name;
		this.emAnimationSetting.time = -1;
		this.emAnimationSetting.on = true;



	}

	resetEmAnimation() {
		this.emAnimationSetting.name = "";
		this.emAnimationSetting.time = -1;
		this.emAnimationSetting.on = false;

		for (let n of this.animationLayerElements) {
			animatedLayers.remove(this.getCanvasAnimationName(n));
		}
	}

	getCanvasAnimationName(obj) {
		return `P${this.player}-${this.character.current}||LAYER||${obj}`;
	}

	getCanvasAnimationPlainName(obj) {
		return `P${this.player}||LAYER||${obj}`;

	}

	setPlayerName(name) {
		this.name = name;

		this.editIH("NAMEPLATE", name);
	}

	playAnimation(name, stop) {
		//this.resetAnimations();
		/**for (let h = 0, m = this.animFieldNames.length; h < m; h++)
		 if (stop.indexOf(this.animFieldNames[h]) !== -1) this.fieldAnimations[this.animFieldNames[h]].reset();*/
		this.fieldAnimations[name].play();
	}
	stopAnimation(name) {
		//this.resetAnimations();
		/**for (let h = 0, m = this.animFieldNames.length; h < m; h++)
		 if (stop.indexOf(this.animFieldNames[h]) !== -1) this.fieldAnimations[this.animFieldNames[h]].reset();*/
		this.fieldAnimations[name].reset();
	}

	playUnfreezableAnimation(name, stop) {
		//this.resetAnimations();
		/**for (let h = 0, m = this.animFieldNames.length; h < m; h++)
		 if (stop.indexOf(this.animFieldNames[h]) !== -1) this.fieldAnimations[this.animFieldNames[h]].reset();*/
		this.unfreezableFieldAnimations[name].play();
	}
	resetAnimations() {
		for (let h = 0, m = this.animFieldNames.length; h < m; h++) {
			//console.log(this.animFieldNames[h])
			this.fieldAnimations[this.animFieldNames[h]].reset();
		}
		this.setStyle("WHOLE", "opacity", "100%");
		this.setStyle("AUX-WHOLE", "opacity", "100%");
	}
	resetUFA() {
		for (let h = 0, m = this.namesUFA.length; h < m; h++)
			this.unfreezableFieldAnimations[this.namesUFA[h]].reset();
	}
	executeRotateWobble(intensity, frames, aux) {
		this.fieldAnimations.fieldWobbleRotate.reset();
		if (intensity === 0) return;
		this.fieldAnimations.fieldWobbleRotate.setFrame(frames);
		this.styleVariable(aux ? "AUX-WHOLE" : "ROTATING-WHOLE", `board-rot-wob-int`, `${intensity || 20}`);
		this.fieldAnimations.fieldWobbleRotate.play();
	}
	runUnfreezableAnims() {
		for (let h = 0, m = this.namesUFA.length; h < m; h++)
			this.unfreezableFieldAnimations[this.namesUFA[h]].run();



	}

	enableAuxField(h) {
		this.auxEnabled = h;
		this.setStyle("AUX-WHOLE", "display", this.auxEnabled ? "block" : "none");

	}


	switchModeType(type) {
		this.activeType = type;
		this.blob.isControl = type == 1;
		this.blob.isEnable = type == 1;
		this.blob.isActive = type == 1;
		this.block.isControl = type == 0;
		this.block.isEnable = type == 0;
		this.block.isActive = type == 0;
		this.changeBorder();
		this.adjustBlobBlockNexts();
		this.block.holdShow(type == 0);

		this.setStyle("AUX-BORDER-1", "display", (this.player % 2) == 0 ? "block" : "none");
		this.setStyle("AUX-BORDER-2", "display", (this.player % 2) == 1 ? "block" : "none");

		if (this.swapMode.isOn) {

			this.drawGarbageTray();
			this.drawGarbageTrayBehind();
		}
	}

	refreshBorderField(type) {
		//let type = this.activeType;


		this.changeBorder(type);
		this.adjustBlobBlockNexts(type);
		this.block.holdShow(type == 0);
		this.block.drawActivePiece();
		this.blob.drawActivePiece();
		this.block.drawStack();
		this.blob.drawStack();
		if (type == 0) {
			let a = this.block;
			/*a.drawActivePiece();
			a.drawStack();*/
			a.previewDraw();
			a.holdDraw();
		}

		if (type == 1) {
			let a = this.blob;
			/*a.drawActivePiece();
			a.drawStack();*/
			a.previewDraw();
		}
	}

	convertGarbageBlockToGarbageBlob(type, isChain) {
		let count = {
			system: {
				count: 0,
				hpdmg: 0,
				wait: false,
				t: "system"
			}

		};

		for (let h = 0; h < this.garbage.length; h++) {
			let ma = this.garbage[h];

			if (!ma.wait) {

				count.system.count += ma.count;
				count.system.hpdmg += ma.hpdmg;

			} else if (!(ma.player in count)) {


				count[ma.player] = {
					count: ma.count,
					hpdmg: ma.hpdmg,
					wait: ma.wait,
					t: ma.player
				};
			} else {
				count[ma.player].count += ma.count;
				count[ma.player].hpdmg += ma.hpdmg;
			}
		}

		for (let h = 0; h < this.garbageBehind.length; h++) {
			let ma = this.garbageBehind[h];

			if (!ma.wait) {

				count.system.count += ma.count;
				count.system.hpdmg += ma.hpdmg;

			} else if (!(ma.player in count)) {


				count[ma.player] = {
					count: ma.count,
					hpdmg: ma.hpdmg,
					wait: ma.wait,
					t: ma.player
				};
			} else {
				count[ma.player].count += ma.count;
				count[ma.player].hpdmg += ma.hpdmg;
			}
		}

		this.garbage.length = 0;
		this.garbageBehind.length = 0;

		//let countBehind = this.calculateGarbageBehind();
		if (type == 0)
			for (let cmo in count) {
				let co = count[cmo];
				let h = 4;
				let total = 0;
				let l = 0;
				let q = 0;
				while (h < co.count && co.count > 0) {
					h += l;
					l += (1);
					if (h >= co.count) break;
					q++;
					total++;
				}
				if (total > 0) this.addGarbage(co.t, [total], co.wait, true, -this.garbageDelay + 2, co.hpdmg, true);
			}
		if (type == 1)
			for (let cmo in count) {
				let co = count[cmo];
				let h = 0;

				let total = 0;
				let l = 4;
				let q = 0;
				while (h < co.count && co.count > 0) {
					h++;
					if (h == 1) total += 4;
					else total += 1 + ~~(q / 1);
					q++;
				}
				if (total > 0) this.addGarbage(co.t, [total], co.wait, true, -this.garbageDelay + 2, co.hpdmg, true);

			}



		this.garbageLength = this.calculateGarbage();
		this.garbageBehindLength = this.calculateGarbageBehind();

		this.garbageLastForTray.assign(this.garbageLength);
		this.garbageBehindLastForTray.assign(this.garbageBehindLength);
		this.rpgAttr.hpDamage = this.calculateHPDamage();

	}

	switchAuxToMain(type) {
		this.activeType = type;
		this.blob.isControl = type == 1;
		this.blob.isAux = type == 0;
		this.blob.isEnable = true;
		this.blob.isActive = type == 1;
		this.block.isControl = type == 0;
		this.block.isAux = type == 1;
		this.block.isEnable = true;
		this.block.isActive = type == 0;
		this.changeBorder();
		this.adjustBlobBlockNexts();
		this.adjustBlobBlockBG(type);
		this.block.holdShow(type == 0);
		this.block.drawActivePiece();
		this.blob.drawActivePiece();
		this.block.drawStack();
		this.blob.drawStack();
		if (type == 0) {
			let a = this.block;
			/*a.drawActivePiece();
			a.drawStack();*/
			a.previewDraw();
			a.holdDraw();
		}

		if (type == 1) {
			let a = this.blob;
			/*a.drawActivePiece();
			a.drawStack();*/
			a.previewDraw();
		}

		if (this.swapMode.isOn) {
			this.garbageType = this.activeType;
			this.drawGarbageTray();
			this.drawGarbageTrayBehind();
		}


	}

	clearLayerAnims() {
		for (let h of this.animationLayerElements) {
			animatedLayers.remove(this.getCanvasAnimationName(h));
		}
	}

	changeBorder(u) {
		let activeType = u !== void 0 ? u : this.activeType;

		this.setStyle("BORDER-BLOCK", "display", activeType == 0 ? "block" : "none");
		this.setStyle("BORDER-BLOB-1", "display", activeType == 1 && (this.player % 2) == 0 ? "block" : "none");
		this.setStyle("BORDER-BLOB-2", "display", activeType == 1 && (this.player % 2) == 1 ? "block" : "none");
	}

	check1v1Overhead(isAttacking, garbLength, newGarb, atk) {
		if (game1v1.on) {
			if (!game1v1.overhead.on) {
				if (!atk && !isAttacking && garbLength > 0 && newGarb > 0) game1v1.overhead.openClose(1, this.player, newGarb, garbLength);
			}
			else {
				if (!atk || isAttacking) {
					game1v1.overhead.checkGarbage(this.player, newGarb);
					if (newGarb == 0) {
						this.conclude1v1Overhead(3);
					}
				} else if (atk) {
					this.conclude1v1Overhead(1);
				}

			}
		} else {

		}
	}

	conclude1v1Overhead(n) {
		if (!game1v1.on) return;
		if (n == 0) { // instant
			game1v1.overhead.openClose(5);
		}

		if (n == 1) { //successful counter
			game1v1.overhead.openClose(2);
		}

		if (n == 2) { //failed counter
			game1v1.overhead.openClose(3);
		}

		if (n == 3) { //neutral, countered full
			game1v1.overhead.openClose(4);
		}
	}

	resize(cellSize, sizeMult) {
		this.cellSize = ~~(cellSize * game.resQualityMult);
		this.fieldCellSize = ~~(cellSize * sizeMult);
		let block = this.block;
		let blob = this.blob;
		//////console.log(this.fieldSize)
		let height = this.fieldSize.vh + this.visibleFieldBufferHeight,
			fieldHeight = this.fieldSize.vh + this.visibleFieldHeight,
			width = this.fieldSize.w;
		/*let bheight = (blob.fieldSize.vh) + this.visibleFieldBufferHeight,
		 bfieldHeight = (blob.fieldSize.vh) + this.fieldSize.h,
		 bwidth = (blob.fieldSize.w);*/
		let handWidth = 5;
		let containerHeight = 4,
			containerCanvasHeight = 3,
			containerCanvasWidth = 5,
			containerWidth = 5,
			placeholderHeight = 1,
			queueWidth = 5,
			queueHeight = 3 * 4;
		let plm = 6;
		this.meterBar.right.resize(this.fieldCellSize, 0.4, fieldHeight);
		this.meterBar.garbwait.resize(this.fieldCellSize, 0.4, fieldHeight);
		this.setStyle("AREA", "fontSize", `${this.fieldCellSize}px`);
		for (let body of ["BORDER", "AREA", "WHOLE", "ROTATING-WHOLE", "PLAYER-CHARACTER-LAYER"]) {
			this.setStyle(body, "width", `${this.fieldCellSize * ((handWidth * 2) + width + 2 + 2 + plm)}px`);
			this.setStyle(body, "height", `${this.fieldCellSize * (fieldHeight+2+2)}px`);
		}

		for (let body of ["BODY", "OVERLAY-LAYER"]) {
			this.setStyle(body, "width", `${this.fieldCellSize * ((handWidth * 2) + width + 2 + plm)}px`);
			this.setStyle(body, "height", `${this.fieldCellSize * (fieldHeight)}px`);
		}
		let clearTextSizeTotal = 0;
		for (let txt of [
				{
					name: "SPIN",
					size: 1.12
  },
				{
					name: "LINE",
					size: 1.9
  },
				{
					name: "B2B",
					size: 1.07
  },
				{
					name: "COMBO",
					size: 1.30
  },
				{
					name: "SPIKE",
					size: 1.0
  },
  ]) {
			this.setStyle(`CLEARTEXT-TEXT-${txt.name}`, "font-size", `${this.fieldCellSize * txt.size}px`);
			this.setStyle(`CLEARTEXT-TEXT-${txt.name}`, "width", `100%`);
			this.setStyle(`CLEARTEXT-TEXT-${txt.name}`, "text-align", `right`);
			this.setStyle(`CLEARTEXT-TEXT-${txt.name}`, "opacity", `0%`);
			clearTextSizeTotal += txt.size;
		}

		this.setStyle('BORDER', "right", `${(this.fieldCellSize * -1)}px`);

		this.setStyle("DIV-CLEARTEXT", "width", `${this.fieldCellSize * 5 * 2}px`);
		this.setStyle("DIV-CLEARTEXT", "height", `${this.fieldCellSize * clearTextSizeTotal}px`);
		this.setStyle("DIV-CLEARTEXT", "margin-left", `${this.fieldCellSize * 5 * -1}px`);

		this.setStyle(`CLEARTEXT-TEXTS`, "width", `${this.fieldCellSize * 5 * 2}px`);
		this.setStyle(`CLEARTEXT-TEXTS`, "height", `${this.fieldCellSize * clearTextSizeTotal}px`);

		this.setStyle(`CLEARTEXT-CANVTEXT`, "width", `${this.fieldCellSize * 5}px`);
		this.setStyle(`CLEARTEXT-CANVTEXT`, "height", `${this.fieldCellSize * 3}px`);

		this.setStyle(`CLEARTEXT-TSPIN-CANVAS`, "width", `${this.fieldCellSize * 3}px`);
		this.setStyle(`CLEARTEXT-TSPIN-CANVAS`, "height", `${this.fieldCellSize * 3}px`);

		this.setStyle(`CLEARTEXT-TSPIN-LINE`, "width", `${this.fieldCellSize * 2}px`);
		this.setStyle(`CLEARTEXT-TSPIN-LINE`, "height", `${this.fieldCellSize * 3}px`);
		this.setCanvasSize("tspin", 180, 180);


		for (let hand of ["LEFT", "RIGHT"]) {
			this.setStyle(`${hand}-HAND`, "width", `${this.fieldCellSize * handWidth}px`);
			this.setStyle(`${hand}-HAND`, "height", `${this.fieldCellSize * height}px`);
		} /**/

		for (let field of ["-CHARACTER-CANVAS", "-PIECE-CANVAS", "-STACK-CANVAS", "-DYNAMIC"]) {
			this.setStyle(`FIELD${field}`, "width", `${(this.fieldCellSize * width)}px`);
			this.setStyle(`FIELD${field}`, "height", `${this.fieldCellSize * height}px`);
		}
		for (let field of ["-INSANE-CANVAS", "-INSANE", "-BACK-CANVAS"]) {
			this.setStyle(`FIELD${field}`, "width", `${(this.fieldCellSize * width)}px`);
			this.setStyle(`FIELD${field}`, "height", `${this.fieldCellSize * fieldHeight}px`);
		}

		this.setCanvasSize("insane", width * this.cellSize, fieldHeight * this.cellSize);
		this.setCanvasSize("back", width * this.cellSize, fieldHeight * this.cellSize);


		this.setStyle(`FIELD`, "width", `${(this.fieldCellSize * width)}px`);
		this.setStyle(`FIELD`, "height", `${this.fieldCellSize * fieldHeight}px`);

		this.setStyle(`FIELD-CHARACTER-CANVAS`, "width", `${(this.fieldCellSize * width)}px`);
		this.setStyle(`FIELD-CHARACTER-CANVAS`, "height", `${this.fieldCellSize * fieldHeight}px`);

		let hwl = 0;
		let sz = 0.7;

		for (let container of ["HOLD", "NEXT"]) {
			//this.setStyle(container, "top", `${(this.fieldCellSize * -0.5)}px`);
			//this.setStyle(container, hwl === 1 ? "left" : "right", `${(this.fieldCellSize * 0.5)}px`);
			this.setStyle(container, "width", `${(this.fieldCellSize * containerWidth)}px`);
			this.setStyle(container, "height", `${this.fieldCellSize * containerHeight}px`);
			//let sz = 0.7;
			//if (hwl === 1) sz = 1;

			this.setStyle(`${container}-PLACE`, "width", `${this.fieldCellSize * containerWidth*sz}px`);
			this.setStyle(`${container}-PLACE`, "height", `${this.fieldCellSize * placeholderHeight*sz}px`);

			this.setStyle(`${container}-CANVAS`, "width", `${this.fieldCellSize * containerWidth*sz}px`);
			this.setStyle(`${container}-CANVAS`, "height", `${this.fieldCellSize * containerCanvasHeight*sz}px`);
			hwl++;
		}


		for (let field of ["character", "stack", "piece"]) {
			this.setCanvasSize(field, width * this.cellSize, height * this.cellSize);
		}

		this.setCanvasSize("character", width * this.cellSize, fieldHeight * this.cellSize);

		for (let canvas of ["next", "hold"]) {
			this.setCanvasSize(canvas, this.cellSize * containerCanvasWidth, this.cellSize * containerCanvasHeight);
		}

		for (let field of ["DIV", "CANVAS", "BEHIND-CANVAS"]) {
			this.setStyle(`GARBAGE-TRAY-${field}`, "width", `${(this.fieldCellSize * 6*2.4)}px`);
			this.setStyle(`GARBAGE-TRAY-${field}`, "height", `${this.fieldCellSize * 2.4}px`);
			if (field === "DIV") this.setStyle(`GARBAGE-TRAY-${field}`, "top", `${this.fieldCellSize * -1*2.5}px`);
		}
		this.setCanvasSize("garbageTray", 6 * 200, 200);
		this.setCanvasSize("garbageTrayBehind", 6 * 200, 200);

		for (let field of ["PLAYCHAR-CANVAS-DIV", "PLAYCHAR-CANVAS"]) {
			this.setStyle(`${field}`, "width", `${(this.fieldCellSize * 26)}px`);
			this.setStyle(`${field}`, "height", `${this.fieldCellSize * 26}px`);
		}

		this.setStyle("PLAYCHAR-TEXT-DIV", "width", `${(this.fieldCellSize * 24)}px`);
		this.setStyle("PLAYCHAR-TEXT-DIV", "height", `${this.fieldCellSize * 4}px`);
		this.setStyle("PLAYCHAR-TEXT", "fontSize", `${this.fieldCellSize * 4}px`);
		for (let hmll of ["DIV", "BG", "CANVAS"]) {
			this.setStyle(`BLOB-NEXT-${hmll}`, "width", `${(this.fieldCellSize * 3 * 1.5)}px`);
			this.setStyle(`BLOB-NEXT-${hmll}`, "height", `${this.fieldCellSize * 5 * 1.5}px`);
		}
		this.setCanvasSize("blobNext", this.cellSize * 3 * 1.5, this.cellSize * 5 * 1.5);

		for (let hmll of ["DIV", "CANVAS"]) {
			this.setStyle(`RECTANIM-${hmll}`, "width", `${(this.fieldCellSize * 247 * 0.06)}px`);
			this.setStyle(`RECTANIM-${hmll}`, "height", `${this.fieldCellSize * 70 * 0.06}px`);
		}

		this.setStyle('NEXT-QUEUE-CANVAS', "width", `${this.fieldCellSize * queueWidth * 0.5}px`);
		this.setStyle('NEXT-QUEUE-CANVAS', "height", `${this.fieldCellSize * queueHeight * 0.5}px`);
		this.setStyle('NEXT-QUEUE', "left", `${(this.fieldCellSize * 0.5)}px`);
		this.setStyle('NEXT', "left", `${(this.fieldCellSize * 0.5)}px`);
		this.setStyle('NEXT', "top", `${(this.fieldCellSize * -0.5)}px`);
		this.setStyle('NEXT-QUEUE', "top", `${(this.fieldCellSize * -0.5)}px`);
		this.setStyle(`NEXT`, "width", `${this.fieldCellSize * containerWidth*sz}px`);
		//this.setStyle(`NEXT`, "height", `${this.fieldCellSize * placeholderHeight*sz}px`);

		this.setStyle('NEXT-QUEUE', "width", `${this.fieldCellSize * queueWidth * 0.5}px`);
		this.setStyle('NEXT-QUEUE', "height", `${this.fieldCellSize * queueHeight * 0.5}px`);

		this.setStyle('HOLD', "left", `${(this.fieldCellSize * 0.35)}px`);
		this.setStyle('HOLD', "top", `${(this.fieldCellSize * 0.225)}px`);

		this.setCanvasSize("nextQueue", this.cellSize * queueWidth, this.cellSize * queueHeight);

		this.setStyle(`STATS-SCORE-TEXT`, "top", `${this.fieldCellSize * (height - this.visibleFieldBufferHeight)}px`);

		this.setStyle(`RECTANIM-DIV`, "top", `${this.fieldCellSize * (height + 1 - this.visibleFieldBufferHeight)}px`);

		this.setStyle('HP-BAR-DIV', "width", `${this.fieldCellSize * 14}px`);
		this.setStyle('HP-BAR-DIV', "height", `${this.fieldCellSize * 1.5}px`);

		this.setStyle('HP-TEXT-DIV', "width", `${this.fieldCellSize * 2}px`);
		this.setStyle('HP-TEXT-DIV', "height", `${this.fieldCellSize * 1.5}px`);

		this.setStyle('HP-METER-CANVAS', "width", `${this.fieldCellSize * 12}px`);
		this.setStyle('HP-METER-CANVAS', "height", `${this.fieldCellSize * 1.5}px`);

		this.setStyle(`HP-BAR-DIV`, "top", `${this.fieldCellSize * (-1.6)}px`);
		this.setStyle(`GARBAGE-TRAY-DIV`, "top", `${this.fieldCellSize * -1*(2.3 + (this.rpgAttr.isOn ? 1.5 : 0))}px`);

		this.setStyle(`FIELD-CHARACTER-CANVAS`, "transform", `rotateY(${((this.player % 2) == 1 ? 180 : 0)}deg)`);
		this.setStyle(`PLAYCHAR-CANVAS`, "transform", `rotateY(${((this.player % 2) == 1 ? 180 : 0)}deg)`);
		this.setStyle(`RECTANIM-CANVAS`, "transform", `rotateY(${((this.player % 2) == 1 ? 180 : 0)}deg)`);


		//AUXILIARY FIELDS FOR SWAP MODE
		//PX is 0.47;
		let px = 0.47;

		this.setStyle(`AUX-FIELD-CHARACTER-CANVAS`, "transform", `rotateY(${((this.player % 2) == 1 ? 180 : 0)}deg)`);

		this.setStyle("AUX-WHOLE", "top", `${this.fieldCellSize*11}px`);
		this.setStyle("FEVER-GAUGE", "top", `${this.fieldCellSize*6}px`);

		this.setStyle("AUX-WHOLE", this.player % 2 == 1 ? "left" : "right", `${this.fieldCellSize*-2.7}px`);

		this.setStyle("FEVER-GAUGE", this.player % 2 == 1 ? "left" : "right", `${this.fieldCellSize*-0.3}px`)


		for (let hmll of ["", "-CANVAS"]) {
			this.setStyle(`FEVER-GAUGE${hmll}`, "width", `${(this.fieldCellSize * 6)}px`);
			this.setStyle(`FEVER-GAUGE${hmll}`, "height", `${this.fieldCellSize * 15}px`);
		}
		this.setCanvasSize("feverGauge", this.cellSize * 6, this.cellSize * 15);
		this.feverStat.resize(this.cellSize * 6, this.cellSize * 15, this.cellSize, this.player % 2 == 1);


		for (let field of ["-CHARACTER-CANVAS", "", "-PIECE-CANVAS", "-STACK-CANVAS", "-DYNAMIC"]) {
			this.setStyle(`AUX-FIELD${field}`, "width", `${(px*this.fieldCellSize * width)}px`);
			this.setStyle(`AUX-FIELD${field}`, "height", `${px*this.fieldCellSize * height}px`);
		}
		for (let field of ["-INSANE-CANVAS", "-INSANE", "-BACK-CANVAS"]) {
			this.setStyle(`AUX-FIELD${field}`, "width", `${(px*this.fieldCellSize * width)}px`);
			this.setStyle(`AUX-FIELD${field}`, "height", `${px*this.fieldCellSize * fieldHeight}px`);
		}


		for (let body of ["BORDER", "WHOLE", "ROTATING-WHOLE"]) {
			this.setStyle(`AUX-${body}`, "width", `${px * this.fieldCellSize * ((handWidth * 2) + width + 2 +2)}px`);
			this.setStyle(`AUX-${body}`, "height", `${px * this.fieldCellSize * (fieldHeight+2+2)}px`);
		}

		for (let field of ["characterAux", "stackAux", "pieceAux", "backAux"]) {
			this.setCanvasSize(field, width * this.cellSize, height * this.cellSize);
		}


		//this.setCanvasSize("insaneAux", width * this.cellSize, fieldHeight * this.cellSize * px);

		this.setStyle(`AUX-FIELD`, "width", `${(this.fieldCellSize * width * px)}px`);
		this.setStyle(`AUX-FIELD`, "height", `${this.fieldCellSize * fieldHeight * px}px`);

		this.setStyle(`AUX-FIELD-CHARACTER-CANVAS`, "width", `${(this.fieldCellSize * width * px)}px`);
		this.setStyle(`AUX-FIELD-CHARACTER-CANVAS`, "height", `${this.fieldCellSize * fieldHeight * px}px`);

		this.setStyle(`NAMEPLATE-DIV`, "top", `${this.fieldCellSize * (height + 3 - this.visibleFieldBufferHeight)}px`);


		this.setStyle(`NAMEPLATE-DIV`, "width", `${(this.fieldCellSize * width * 1.5)}px`);
		this.setStyle(`NAMEPLATE-DIV`, "height", `${this.fieldCellSize * 1.2}px`);

		////console.log(originX, originY);

		this.setCanvasSize("characterAux", width * this.cellSize, fieldHeight * this.cellSize);

		block.drawStack();
		block.drawActivePiece();
		this.drawCharacterBg(0);
		this.drawGarbageTray();

		this.adjustBlobBlockBG();
		this.adjustBlobBlockNexts();
		this.setCanvasSize("playchar", 600, 600);
		this.setCanvasSize("rectanim", 247, 70);


		let origin = this.assetRect("OVERLAY-LAYER");
		let originX = origin.x + (origin.width / 2);
		let originY = origin.y + (origin.height / 2);

		this.playerCenterPos.x = originX;
		this.playerCenterPos.y = originY;

		////console.log(originX, originY);


		if (this.isVisible) {
			this.drawActivePlaycharExt(this.playcharExt.positions[this.playcharExt.active]);
			for (let e = 0; e < this.animationLayerElements.length; e++) {
				let ev = this.animationLayerElements[e];
				//console.log(ev)
				let initid = this.getCanvasAnimationName(ev);
				if (animatedLayers.checkObject(initid)) {
					let object = animatedLayers.getObject(initid);
					object.centerPos.x = this.playerCenterPos.x;
					object.centerPos.y = this.playerCenterPos.y;
					object.sizeMult = this.fieldCellSize;
				}

			}
		}
	}

	adjustBlobBlockBG(u) {
		let activeType = u !== void 0 ? u : this.activeType;

		this.setStyle("BORDER-BLOCK", "display", "none");

		this.setStyle("BORDER-BLOB-1", "display", "none");
		this.setStyle("BORDER-BLOB-2", "display", "none");
		this.setStyle("BLOB-NEXT-BG-1", "display", "none");
		this.setStyle("BLOB-NEXT-BG-2", "display", "none");
		this.getAsset("BLOB-NEXT-DIV").style.setProperty("--bn-position-x", `${((this.player % 2) == 0 ? 1 : -1) * ((this.fieldCellSize * (this.fieldSize.w / 2)) + (this.fieldCellSize * (3) * 1.5))}px`);
		this.getAsset("BLOCK-NEXT").style.setProperty("--bn-position-x", `${((this.player % 2) == 0 ? 1 : 1) * ((this.fieldCellSize * (this.fieldSize.w / 2)) + (this.fieldCellSize * (3) * 1.1))}px`);
		if (!this.isVisible) return;
		if (activeType === 1) {
			this.setStyle("BORDER-BLOB-1", "display", (this.player % 2) === 0 ? "block" : "none");
			this.setStyle("BORDER-BLOB-2", "display", (this.player % 2) === 1 ? "block" : "none");
			this.setStyle("BLOB-NEXT-BG-1", "display", (this.player % 2) === 0 ? "block" : "none");
			this.setStyle("BLOB-NEXT-BG-2", "display", (this.player % 2) === 1 ? "block" : "none");
		} else {
			this.setStyle("BORDER-BLOCK", "display", "block");
		}

	}

	adjustBlobBlockNexts(u) {
		let activeType = u !== void 0 ? u : this.activeType;
		this.setStyle("BLOB-NEXT-DIV", "display", "none");
		this.setStyle("BLOCK-NEXT", "opacity", "0%");
		if (!this.isVisible) return;
		if (activeType == 1) {
			this.setStyle("BLOB-NEXT-DIV", "display", "block");
		} else {
			this.setStyle("BLOCK-NEXT", "opacity", "100%");
		}

	}

	drawGarbageTray() {
		this.canvasClear("garbageTray");
		if (this.isVisible) {
			for (let x = 0; x < 6; x++) {
				this.canvasCtx.garbageTray.drawImage(
					manager.skinGarb.canvas,
					(this.garbageTrayObjects[x].x * 200),
					this.garbageType * 200,
					200,
					200,
					(x * 200) + this.garbageTrayObjects[x].gx,
					0,
					200,
					200,
				);
			}
		}
	}

	drawGarbageTrayBehind() {
		this.canvasClear("garbageTrayBehind");
		if (this.isVisible) {
			for (let x = 0; x < 6; x++) {
				this.canvasCtx.garbageTrayBehind.drawImage(
					manager.skinGarb.canvas,
					(this.garbageTrayBehindObjects[x].x * 200),
					this.garbageType * 200,
					200,
					200,
					(x * 200) + this.garbageTrayBehindObjects[x].gx,
					0,
					200,
					200,
				);
			}
		}
	}

	drawCharacterBg(n) {
		this.canvasClear("character");
		this.canvasCtx.character.drawImage(this.character.canvas, (n || 0) * 300, 0, 300, 600, 0, 0, this.fieldSize.w * this.cellSize, (this.fieldSize.vh + this.visibleFieldHeight) * this.cellSize);

		this.canvasClear("characterAux");
		this.canvasCtx.characterAux.drawImage(this.character.canvas, (n || 0) * 300, 0, 300, 600, 0, 0, this.fieldSize.w * this.cellSize, (this.fieldSize.vh) * this.cellSize);

	}

	drawRect(ctx, x, y, row, column, sx, sy) {
		x = ~~(x * this.cellSize * sx);
		y = y * this.cellSize * sy; //- (2 * this.cellSize);

		let c = this.canvasCtx[ctx];
		//c.fillStyle = `rgb(${Math.random()*0}, 255, 0)`;


		if (this.isVisible) c.drawImage(
			manager.skin.canvas,
			row * this.cellSize,
			column * this.cellSize,
			this.cellSize,
			this.cellSize,
			x,
			y,
			this.cellSize * sx,
			this.cellSize * sy,
		);
	}

	drawArray(ctx, arr, cx, cy, color, row, sx, sy, isEraseTop) {
		for (var x = 0, len = (arr.length); x < len; x++) {
			for (var y = 0, wid = (arr[x].length); y < wid; y++) {
				if (arr[x][y]) {
					this.drawRect(ctx, x + cx, y + cy, row, color !== void 0 ? color : arr[x][y], sx || 1, sy || 1);
					if (isEraseTop) {
						let a = this.canvasses[ctx];
						this.canvasCtx[ctx].clearRect(0, 0, a.width, this.cellSize * this.visibleFieldBufferHeight);

					}
				}
			};
		};
	}

	checkLose() {
		this.isDying = true;
		this.conclude1v1Overhead(2);
	}

	phaseLose(o) {
		this.pressStr = "";
		this.lastPressStr = "";

		this.isDead = true;
		this.isFinishAble = false;


		this.playSound("lose");
		//this.reset();

		this.resetAnimations();
		this.delay[0] = 80;
		if (o) {
			if (o === "break") {
				this.playAnimation("fieldDownDelayed");
				this.delay[0] = 140;
			} else {
				this.executeRotateWobble(0);
				if (this.activeType == 1) {
					this.blob.simulateSplashOut();
					this.blob.resetGrid();
				}

				this.playAnimation("fieldFinisherFinalBlow1");
				this.playAnimation("fieldFinisherFinalBlow2");

				if (this.swapMode.isOn) this.playAnimation("fieldDownAux");
			}
		} else {
			this.playAnimation("fieldDown");
			if (this.swapMode.isOn) this.playAnimation("fieldDownAux");
		}

		this.setStyle("WHOLE", "opacity", "0%");
		this.setStyle("AUX-WHOLE", "opacity", "0%");

	}

	startNext() {
		if (this.activeType == 0) this.block.spawnPiece(this.block.previewNextBag(), false);
		if (this.activeType == 1) this.blob.previewNextBlob();
	}

	engageShakeIntensityHit(x) {
		this.styleVariable("WHOLE", "shakehit-x", x);
		this.playAnimation("shakeUponHit");
	}

	simulateWMWShakeIntensityHit() {
		this.styleVariable("WHOLE", "shakehit-wmw-x", `${this.fieldCellSize * ((Math.random() * 16) - (Math.random() * 16))}px`);
		this.styleVariable("WHOLE", "shakehit-wmw-y", `${this.fieldCellSize * ((Math.random() * 16) - (Math.random() * 16))}px`);

		this.playAnimation("shakeWMWHit");
	}

	reset() {
		this.block.reset();
		this.blob.reset();
		this.rpgAttr.reset();
		this.swapMode.reset();
		this.woi.reset();
		this.woiWormhole.reset();
		this.feverStat.resetRound();

		//if ("fieldWobbleRotate" in this.fieldAnimations) this.executeRotateWobble(0,65);

		this.callibrateCenter();

		this.insaneBg.reset();

		this.resetEmAnimation();

		this.engagePlaycharExt();

		this.isDelayStoppable = true;

		this.isWin = false;
		this.hasWon = false;

		this.isDead = false;
		this.isDying = false;
		this.isFinishAble = false;

		//this.rectanim.play("spell5")
		this.resetAnimations();
		this.resetUFA();

		this.block.insane.reset();
		this.blob.insane.reset();

		this.isLosePlayed = false;

		this.insaneBg.moveEye(this.fieldSize.w / 2, this.fieldSize.vh / 2);

		this.isGarbageBehindActive = false;
		this.rpgAttr.hpDamage = 0;


		this.score = 0;
		this.addScoreText = "";


		// this.flagNames.length = 0;

		for (let a in this.flagPresses) {
			this.flagPresses[a] = false;
			this.lastFlagPresses[a] = false;

			// this.flagNames.push(a);
		}

		for (let a in this.stats) {
			this.stats[a] = 0;
		}

		this.controlsBitwise.bit = 0;

		this.playerTarget.length = 0;

		this.character.activeVoiceline = "";

		this.dividedBlobScoreGarbage = 0;
		this.blobGarbage = 0;

		this.garbage.length = 0;
		this.garbageBehind.length = 0;



		this.pressStr = "";
		this.lastPressStr = "";
		this.delayedGarbage = 0;
		this.garbageLength = this.calculateGarbage();
		this.garbageBehindLength = this.calculateGarbageBehind();

		this.garbageBehindLastForTray.assign(this.garbageBehindLength);

		this.garbageLastForTray.assign(this.garbageLength);

		for (let a = 0; a < this.delayKeynamesCount; a++) {
			this.delay[a] = -9;
			//if (this.delay[a] == 0) this.delay[a] = -20;
		}

		this.emAnimationSetting.on = false;
		this.engageCleartext("b2b", false, "");
		this.engageCleartextCombo(false, 0, "");
	}

	addGarbage(player, arr, wait, allMess, del, hpdmg) {
		let mm = false;

		for (let l = 0, os = arr.length; l < os; l++) {
			let n = ~~(this.seeds.field.next() * this.block.fieldSize.w);
			let i = arr[l];
			let n2 = n;
			mm = true;
			while (true) {
				let rand = this.seeds.field.next();
				let limit = 0;
				if (allMess) {
					while (limit < i) {
						if (rand < this.messiness) {
							while (n == n2) n = ~~(this.seeds.field.next() * this.fieldSize.w);
							n2 = n;
							break;
						}
						/*if (allMess) {
						 n2 = ~~(this.seeds.field.next() * this.fieldSize.w);
						 break;
						}*/
						limit++;
					}
				} else limit = i;
				mm = true;

				this.garbage.push({
					id: btoa(Math.random() * Math.random()),
					wait: wait,
					row: n2,
					frames: this.garbageDelay + manager.frames + (del || 0),
					player: player,
					count: limit,
					allmess: allMess,
					hpdmg: (hpdmg) * (150 / (150 + this.rpgAttr.attributes.defense))
				});
				i -= limit;
				if (i == 0) break;
			}
		}
		if (mm) {
			this.garbageLength = this.calculateGarbage();
			this.rpgAttr.hpDamage = this.calculateHPDamage();
		}

	}

	addGarbageBehind(player, arr, wait, allMess, del, hpdmg, isDirect) {
		let mm = false;

		for (let l = 0, os = arr.length; l < os; l++) {
			let n = ~~(this.seeds.field.next() * this.block.fieldSize.w);
			let i = arr[l];
			let n2 = n;
			mm = true;
			while (true) {
				if (i <= 0) break;
				let rand = this.seeds.field.next();
				let limit = 0;
				if (allMess) {
					while (limit < i) {
						if (rand < this.messiness) {
							while (n == n2) n = ~~(this.seeds.field.next() * this.fieldSize.w);
							n2 = n;
							break;
						}
						/*if (allMess) {
						 n2 = ~~(this.seeds.field.next() * this.fieldSize.w);
						 break;
						}*/
						limit++;
					}
				} else limit = i;
				mm = true;


				this.garbageBehind.push({
					id: btoa(Math.random() * Math.random()),
					wait: wait,
					row: n2,
					frames: this.garbageDelay + manager.frames + (del || 0),
					player: player,
					count: limit,
					allmess: allMess,
					hpdmg: (hpdmg) * (!isDirect ? (150 / (150 + this.rpgAttr.attributes.defense)) : 1)
				});
				i -= limit;
			}
		}
		if (mm) {
			this.garbageBehindLength = this.calculateGarbageBehind();
			this.rpgAttr.hpDamage = this.calculateHPDamage();
		}

	}

	calculateGarbage() {
		let count = 0;
		for (let h = 0; h < this.garbage.length; h++) {
			count += ~~this.garbage[h].count;
		}
		return count;
	}

	calculateGarbageBehind() {
		let count = 0;
		for (let h = 0; h < this.garbageBehind.length; h++) {
			count += ~~this.garbageBehind[h].count;
		}
		return count;
	}

	calculateHPDamage() {
		let count = 0;
		for (let h = 0; h < this.garbage.length; h++) {
			count += ~~(this.garbage[h].hpdmg * this.garbage[h].count);
		}

		for (let h = 0; h < this.garbageBehind.length; h++) {
			count += (~~this.garbageBehind[h].hpdmg * this.garbageBehind[h].count);
		}
		return count;
	}

	switchGarbageBehind(truefalse) {
		this.isGarbageBehindActive = truefalse;
		if (truefalse) {
			this.garbageBehind.push(...this.garbage);
			this.garbage.length = 0;
			this.garbageLength = this.calculateGarbage();
			this.garbageBehindLength = this.calculateGarbageBehind();
			this.garbageLastForTray.assign(this.garbageLength);
			this.garbageBehindLastForTray.assign(this.garbageBehindLength);
			this.rpgAttr.hpDamage = this.calculateHPDamage();
		} else {

			this.garbage.push(...this.garbageBehind);
			this.garbageLength = this.calculateGarbage();
			this.garbageBehind.length = 0;
			this.garbageBehindLength = this.calculateGarbageBehind();
			this.garbageLastForTray.assign(this.garbageLength);
			this.garbageBehindLastForTray.assign(this.garbageBehindLength);

			this.rpgAttr.hpDamage = this.calculateHPDamage();
		}
	}
	callibrateCenter() {
		let origin = this.assetRect("OVERLAY-LAYER");
		let originX = origin.x + (origin.width / 2);
		let originY = origin.y + (origin.height / 2);

		this.playerCenterPos.x = originX;
		this.playerCenterPos.y = originY;
	}

	controlsListen() {
		//let input = this.pressStr[i];
		if (this.controlsBitwise.on) {
			let bitPress = 0b00000000000;
			let bitRelease = 0b00000000000;
			let impulse = 0b00000000000;
			//if (this.pressStr) //console.log(this.player, this.pressStr)
			for (let i = 0; i < this.pressStr.length; i++) {
				//if (!this.piece.enable) continue;
				let input = this.pressStr[i];
				//this.controlsListen(this.pressStr[i]);
				//this.flagPresses[this.flagNamesByChar[input.toLowerCase()]] = 
				let flagName = this.flagNamesByChar[input.toLowerCase()];
				let bit = this.controlsBitwise.bitList[flagName];
				if (input in this.flagsLowerToUpper) {
					bitPress |= bit;
					//impulse |= bit;
				} else {
					bitRelease |= bit;
				}


				//console.log(input, bit, flagName, bitPress, bitRelease);
			}

			if (bitPress & bitRelease) {
				impulse |= bitPress & bitRelease;
				console.log(impulse)
			}

			if (bitPress > 0 && ((this.controlsBitwise.bit & bitPress) == 0)) this.controlsBitwise.bit |= bitPress;
			if (bitRelease > 0 && ((this.controlsBitwise.bit & bitRelease))) this.controlsBitwise.bit ^= bitRelease;

			for (let k = 0; k < this.flagNames.length; k++) {
				let ref = this.flagNames[k];
				this.flagPresses[ref] = ((this.controlsBitwise.bit | impulse) & (2 ** k)) > 0;
			}
			//if (this.controlsBitwise.bit > 0) console.log(this.pressStr, this.controlsBitwise.bit, bitPress, bitRelease);

			if ((this.flagPresses.hold && !this.lastFlagPresses.hold) || (impulse & this.controlsBitwise.bitList.hold)) {
				if (this.block.isControl) this.block.hold();
			}

			if ((this.flagPresses.ccw && !this.lastFlagPresses.ccw) || (impulse & this.controlsBitwise.bitList.ccw)) {
				if (this.block.isControl) this.block.rotatePiece(-1);
				if (this.blob.isControl) this.blob.rotatePiece(-1);
			}

			if ((this.flagPresses.cw && !this.lastFlagPresses.cw) || (impulse & this.controlsBitwise.bitList.cw)) {
				if (this.block.isControl) this.block.rotatePiece(1);
				if (this.blob.isControl) this.blob.rotatePiece(1);
			}

			if ((this.flagPresses.c180w && !this.lastFlagPresses.c180w) || (impulse & this.controlsBitwise.bitList.c180w)) {
				if (this.block.isControl) this.block.rotatePiece(2);
			}


			if ((this.flagPresses.left && !this.lastFlagPresses.left) || (impulse & this.controlsBitwise.bitList.left)) {
				if (this.block.isControl) this.block.moveX(-1);
				if (this.blob.isControl) this.blob.moveX(-1);
			}
			if ((this.flagPresses.right && !this.lastFlagPresses.right) || (impulse & this.controlsBitwise.bitList.right)) {
				if (this.block.isControl) this.block.moveX(1);
				if (this.blob.isControl) this.blob.moveX(1);
			}



			if ((this.flagPresses.softdrop && !this.lastFlagPresses.softdrop) || (impulse & this.controlsBitwise.bitList.softdrop)) {
				if (this.block.isControl) this.block.softDrop();
				if (this.blob.isControl) this.blob.softDrop();
			}


			if ((this.flagPresses.harddrop && !this.lastFlagPresses.harddrop) || (impulse & this.controlsBitwise.bitList.harddrop)) {
				if (this.block.isControl) this.block.hardDrop();
				if (this.blob.isControl) this.blob.hardDrop();
			}


			if (!this.flagPresses.left && !this.flagPresses.right) {
				if (this.block.isControl) {
					this.block.handling.arr = 0;
					this.block.handling.das = 0;
				}
				if (this.blob.isControl) {
					this.blob.handling.arr = 0;
					this.blob.handling.das = 0;
				}
			}


		} else {
			for (let i = 0; i < this.pressStr.length; i++) {
				//if (!this.piece.enable) continue;
				let input = this.pressStr[i];
				//this.controlsListen(this.pressStr[i]);

				switch (input) {
					case "A": {
						this.flagPresses.left = true;
						if (this.block.isControl) this.block.moveX(-1);
						if (this.blob.isControl) this.blob.moveX(-1);
						break;
					}
					case "a": {
						this.flagPresses.left = false;
						break;
					}
					case "B": {
						this.flagPresses.right = true;
						if (this.block.isControl) this.block.moveX(1);
						if (this.blob.isControl) this.blob.moveX(1);
						break;
					}
					case "b": {
						this.flagPresses.right = false;
						break;
					}
					case "C": {
						this.flagPresses.softdrop = true;
						if (this.block.isControl) this.block.softDrop();
						if (this.blob.isControl) this.blob.softDrop();
						break;
					}
					case "c": {
						this.flagPresses.softdrop = false;
						break;
					}
					case "D": {
						this.flagPresses.harddrop = true;
						if (this.block.isControl) this.block.hardDrop();
						if (this.blob.isControl) this.blob.hardDrop();
						break;
					}
					case "d": {
						this.flagPresses.harddrop = false;
						break;
					}

					case "E": {
						this.flagPresses.hold = true;
						if (this.block.isControl) this.block.hold();
						break;
					}
					case "e": {
						this.flagPresses.hold = false;
						break;
					}
					case "F": {
						this.flagPresses.ccw = true;
						if (this.block.isControl) this.block.rotatePiece(-1);
						if (this.blob.isControl) this.blob.rotatePiece(-1);
						break;
					}
					case "f": {
						this.flagPresses.ccw = false;
						break;
					}
					case "G": {
						this.flagPresses.cw = true;
						if (this.block.isControl) this.block.rotatePiece(1);
						if (this.blob.isControl) this.blob.rotatePiece(1);
						break;
					}
					case "g": {
						this.flagPresses.cw = false;
						break;
					}
					case "H": {
						this.flagPresses.c180w = true;
						if (this.block.isControl) this.block.rotatePiece(2);
						break;
					}
					case "h": {
						this.flagPresses.c180w = false;
						break;
					}
				}

				if (!this.flagPresses.left && !this.flagPresses.right) {
					if (this.block.isControl) {
						this.block.handling.arr = 0;
						this.block.handling.das = 0;
					}
					if (this.blob.isControl) {
						this.blob.handling.arr = 0;
						this.blob.handling.das = 0;
					}
				}
			}
		}
	}

	playerUpdate() {

		if (!game.replay.isOn) {

			if (this.ai.active) {
				this.ai.run();
				this.pressStr = this.ai.pressStr;
			}

			if (this.ai.active) {
				this.aiBlob.run();

				this.pressStr += this.aiBlob.pressStr;
			}
		}
		if (game.replay.isOn) {
			if (game.frames in game.replay.data.players[this.player].keyData) {
				this.pressStr += game.replay.data.players[this.player].keyData[game.frames];
			}
		} else {
			if (this.pressStr !== "") game.replay.data.players[this.player].keyData[game.frames] = this.pressStr;
		}


		this.controlsListen();
		//this.editIH("SCORE-STATS", this.pressStr)

		this.isDelayStoppable = true;

		if (this.block.isControl) this.block.shiftDelay();
		if (this.blob.isControl) this.blob.shiftDelay();

		if (this.flagPresses.softdrop && this.lastFlagPresses.softdrop) {
			if (this.block.isControl) this.block.softDrop();
			if (this.blob.isControl) {
				this.blob.softDrop();
				if (!this.blob.piece.isAir) {
					this.blob.lock.lockSoftdrop--;
					this.blob.checkManipulatedPiece();
				}
			}
		} else if (this.blob.isEnable) {
			this.blob.lock.lockSoftdrop = 6;

		}

		if (this.block.isEnable) this.block.updatePiece();
		if (this.blob.isEnable) this.blob.updatePiece();

		if (this.pressStr !== this.lastPressStr) this.lastPressStr = this.pressStr;

		for (let g in this.flagPresses) {
			if (this.flagPresses[g] !== this.lastFlagPresses[g]) this.lastFlagPresses[g] = this.flagPresses[g];
		}

		if (this.block.isEnable) this.block.updateDelay();
		if (this.blob.isEnable) this.blob.updateDelay();

		if (this.block.isEnable) {
			let bl = this.block;
			bl.drawActivePiece();

			bl.effects.hardDrop.update();
			bl.effects.appearAnim.update();
			bl.effects.clearAnim.update();
			bl.checkWarning();

			if (bl.appearBlockFrame > -1) {
				bl.appearBlockFrame--;

				if (bl.appearBlockFrame == 0) {
					bl.drawStack(bl.stack);
				}
			}

			if (bl.pcSpam.frame >= 0) {
				bl.pcSpam.frame--;
				if (bl.pcSpam.frame == 0) {
					bl.pcSpam.count = 0;
				}
			}
		}
		if (this.blob.isEnable) {
			this.blob.drawActive();
			this.blob.previewDrawUpdate();
		}

		this.pressStr = "";
		this.meterBar.right.assign(this.activeType == 1 ? 1 : (((this.block.fieldSize.vh + this.block.visibleFieldHeight) - this.garbageLength) / (this.block.fieldSize.vh + this.block.visibleFieldHeight)));
		{
			let garbageWait = 0;
			for (let qq = 0, leng = this.block.garbageWait.length; qq < leng; qq++) garbageWait += this.block.garbageWait[qq];
			this.meterBar.garbwait.assign([
   ((this.fieldSize.vh + this.visibleFieldHeight) - Math.max(0, Math.min(garbageWait, this.fieldSize.vh))) / (this.fieldSize.vh + this.visibleFieldHeight),
   ((this.fieldSize.vh + this.visibleFieldHeight) - Math.max(0, Math.min((garbageWait - (this.fieldSize.vh)), this.fieldSize.vh))) / (this.fieldSize.vh + this.visibleFieldHeight),
   ((this.fieldSize.vh + this.visibleFieldHeight) - Math.max(0, Math.min((garbageWait - (this.fieldSize.vh * 2)), this.fieldSize.vh))) / (this.fieldSize.vh + this.visibleFieldHeight),

  ]);
		}
		if (this.block.isEnable) {
			this.clearText.tspin.run();
		}
		for (let m of ["b2b"]) {
			this.clearTextRenderers[m].run();
		}
		if (this.blob.delay[2] > 0 && this.blob.actualChain > 0) {
			this.scoreText.assign(this.addScoreText);
		}
		else {
			let scr = "",
				lsc = Math.min(99999999, this.score);
			for (let qu = 0; qu < 8; qu++) {
				if (qu == 7 && lsc === 0) break;
				if (10 ** qu > lsc) scr += "0";
			}
			scr += lsc;
			this.scoreText.assign(scr);
		}
		//this.scoreText.assign(Object.values(this.blob.delay));
		if (this.block.isEnable) this.block.insane.update();
		if (this.blob.isEnable) this.blob.insane.update();
		if (this.woiWormhole.enable) this.woiWormhole.draw();

		this.warningTrig.assign(
			((this.block.isEnable && this.block.isWarning && !this.block.isAux) ||
				(this.blob.isEnable && this.blob.isWarning && !this.blob.isAux)) ? 1 : 0);
		this.rectanim.run();
		this.rpgAttr.update();
		this.swapMode.run();
		this.feverStat.run();

		this.runDelay();

		//if (this.activeType === 1) this.garbageLastForTray.assign(this.garbageLength);
	}

}