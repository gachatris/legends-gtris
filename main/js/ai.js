class ArtificialIntelligence {
	//Sapphirus AI
	#core = 0;
	constructor(parent, name, text) {
		this.parent = parent;
		this.delayReset = 10;
		this.moves = [];
		this.active = false;
		this.pressStr = "";
		this.pressLast = "";
		this.pieceDelay = 0;
		this.ai = {
			controlImg: {
				x: 0,
				y: 0,
				rot: 0,
				hold: 0
			},
			rotations: [
      [0],
      [
       1, 1, 1, 1
      ],
      [
       2, 2, 2, 2
      ]
    ],

			enableTspin: true,
			grid: [],
			ppsLimit: 289,
			
			extraMovements: [],
			x: 0,
			y: 0,
			rot: 0,
			matrix: [],
			heuristicsWeight: {
				aggHeight: -0.0000510066,
				bump: -0.184483,
				lines: 0.1760666,
				holes: -41.0000300044,
				blockade: -0.0666,
				failedTspin: -994.0,
				failedWide: -990,
				b2b: 0.75,
				possibleSpin: 0.22202
			},
			failedWide: 0,
			tspinDetector: {
				tslot: [[0, 1], [1, 1], [2, 1], [1, 2]],
				bottom: [[0, 2], [2, 2] /*, [-1, 1], [3, 1]*/ ],
				tuck: [[0, 0, [[1, 0], [2, 0]]], [2, 0, [[0, 0], [1, 0]]]],
			},
			tspinHeight: 5,
			flag: {
				LEFT: 1,
				RIGHT: 2,
				SOFTDROP: 4,
				HARDDROP: 8,
				HOLD: 16,
				CW: 32,
				CCW: 64,
				C180W: 128,
			},

			tspinDetected: {
				tslot: [],
				bottom: [],
				tuck: [],

				tLines: [],
				tBlock: [],
				tSlot: [],
				tAvoidColumn: []


			}
		};

		multithread.engageWorker(name, text, (a) => {
			this.#core = a.worker;
		});
	}
	
	loadFrenzyMovements(file) {
		
	}

	run(a) {
		this.pressStr = "";
		let isTooMuchChain = false;
		game.forEachPlayer(player => {
			if (player.blob.forecastedChain > 5) isTooMuchChain = true;
		});


		if (this.pieceDelay < 0) {

			this.pieceDelay = Math.random() * 15 + 5;

			if (isTooMuchChain) {
				//h = 8;
				//this.moves.push(88);
				this.pieceDelay = 0;
			}
			if (false) {
				this.pressStr = "Dd";
			} else if (this.ai.extraMovements.length > 0 && this.parent.block.frenzy.isOn) {
				
				let isSoftDrop = 0;
				let j = {
					1: "Aa",
					2: "Bb",
					3: "C",
					4: "Dd",
					5: "Ee",
					6: "Gg",
					7: "Ff",
					8: "Hh"
				}
				let h = this.ai.extraMovements[0];

				if (!this.parent.flagPresses.softdrop) this.pressStr += j[h];
				if (h == 4) {
					if (this.parent.block.checkValid(this.parent.block.piece.activeArr, 0, 1)) {
						this.pieceDelay = -999;
						isSoftDrop = 1;

					} else {
						this.pieceDelay = -999;
						this.pressStr += "c";
					}
				}
				if (!isSoftDrop) this.ai.extraMovements.shift();

			}

			else for (let g = 0; g < this.moves.length; g++) {
				let j = {
					1: "Aa",
					2: "Bb",
					4: "C",
					8: "Dd",
					16: "Ee",
					32: "Gg",
					64: "Ff",
					128: "Hh"
				}
				let h = this.moves[g];

				if (!this.parent.flagPresses.softdrop) this.pressStr += j[h];
				if (h == 4) {
					if (this.parent.block.checkValid(this.parent.block.piece.activeArr, 0, 1)) {
						break;
						this.pieceDelay = -999;
					} else {
						this.pieceDelay = -999;
						this.pressStr += "c";
					}
				}
				this.moves.shift();
				g--;
				////console.log(this.parent.pressStr)
				break;
			}
		}
		this.pieceDelay--;
	}

	postToCore(jsobj) {
		try {
			this.#core.postMessage(jsobj);
		} catch (e) {
			////console.log(e);
		}

		return new Promise((res) => {
			this.#core.addEventListener("message", (te) => {
				res(te.data);
			}, { once: true });
		});
	}


	async evaluate(active, hold, isHeld, next, b2b, combo, grid, hx, hy, px, py, prot, temp) {
		if (isHeld) return;
		////console.log(this.parent.player, this.parent)
		let obj = {
			grid: JSON.parse(JSON.stringify(grid)),
			b2b: b2b,
			preset: this.ai,
			pieceSet: temp,
			isWarning: this.parent.isWarning,
			width: 10,
			height: 40,
			hiddenHeight: 20,
			visibleHeight: 20,
			combo: this.parent.block.combo,
			isEnable180: false,
			piecesCount: 1,
			tFulfill: this.ai.tspinDetected.tFulfill || [],
			tPrevent: this.ai.tspinDetected.tPrevent || [],
			tLines: this.ai.tspinDetected.tLines || [],
			tAvoidColumn: this.ai.tspinDetected.tAvoidColumn || [],
		};



		this.moves = [];

		let args = [active, hold, next, obj, px, py, hx, hy, prot];
		let best = await this.postToCore(args);
		this.moves = best.move;
		this.ai.tspinDetected.tLines = best.tl;
		this.ai.tspinDetected.tAvoidColumn = best.ta;
		this.ai.tspinDetected.tPrevent = best.tp;
		this.ai.tspinDetected.tFulfill = best.tf;

		for (let v = 0, len = this.moves.length; v < len; v++) {

		}
	}
}
class NeoplexArtificialIntelligence {
	#core = 0;
	constructor(parent, name, text) {
		this.delRes = 0;
		this.del = 0;
		this.active = false;
		this.pressStr = "";
		this.pressLast = "";
		this.moves = [];
		this.parent = parent;
		multithread.engageWorker(name, text, (a) => {
			this.#core = a.worker;
			this.#core.onerror = (e) => {
				////console.log(e)
				console.warn(e.message, e.colno, e.lineno)
			}
		});
	}

	postToCore(obj) {
		try {
			this.#core.postMessage(obj);
		} catch (e) {
			////console.log(e);
		}

		return new Promise((res) => {
			this.#core.addEventListener("message", (t) => {
				res(t.data);
			}, { once: true });
		});
	}

	run() {
		this.pressStr = "";

		let isTooMuchChain = false;
		game.forEachPlayer(player => {
			if (player.blob.forecastedChain > 6) isTooMuchChain = true;
		});
		if (this.del < 0) {
			this.del = Math.random() * 0 + 0;

			if (isTooMuchChain) {
				//h = 8;
				//this.moves = [6];
				//this.del = 0;
			}



			for (let g = 0; g < this.moves.length; g++) {
				let m = {
					1: "Aa",
					2: "Bb",
					5: "C",
					6: "Dd",
					7: "Ee",
					3: "Gg",
					4: "Ff",
					128: "Hh"
				}
				let h = this.moves[g];
				if (isTooMuchChain) {
					h = 6;
					this.del = -90;
				}
				this.pressStr += m[h];



				if (h == 5) {
					if (this.parent.block.checkValid(this.parent.block.piece.activeArr, 0, 1)) {
						break;
						this.del = -999;
					} else {
						this.pressStr += "c";
						this.del = -999;
					}
				}
				this.moves.shift();
				g--;
				break;
			}
		}
		this.del--;

	}

	async evaluate(active, hold, isHeld, next, b2b, combo, grid, hx, hy, px, py, prot, temp, drawMatrix) {
		if (isHeld) return;
		this.moves.length = 0;
		//let [width, hiddenHeight, visibleHeight, height, stack, active, hold, next] = data;

		let args = [10, 20, 20, 40, grid, active, hold, next, this.parent.block.combo];
		let best = await this.postToCore(args);
		let g = best.a;
		this.moves = g[1];
		//drawMatrix(g[2], g[3], g[4], g[5]);

	}
}

class NeoplexBlobArtificialIntelligence {
	#core = 0;
	#functions = 0;
	constructor(parent, name, text, funcText) {
		this.delRes = 0;
		this.del = 0;
		this.active = false;
		this.pressStr = "";
		this.pressLast = "";
		this.moves = [];
		this.previous = {
			x: 2,
			rot: 0
		};
		this.movePos = {
			x: 0,
			y: 0,
			rot: 0
		};
		this.parent = parent;
		multithread.engageWorker(name, text, (a) => {
			this.#core = a.worker;
			this.#core.onerror = (e) => {
				////console.log(text)
				alert("AWWW SNAP " + e.message, e.colno, e.lineno, e);
			}
		});
		multithread.engageWorker(name, funcText, (a) => {
			this.#functions = a.worker;
			this.#functions.onerror = (e) => {
				////console.log(text)
				console.warn("AW SNAP " + e.message, e.colno, e.lineno);
			}
		});
	}

	postToCore(obj) {
		try {
			this.#core.postMessage(obj);
		} catch (e) {
			////console.log(e);
		}

		return new Promise((res) => {
			this.#core.addEventListener("message", (t) => {
				res(t.data);
			}, { once: true });
		});
	}

	postToFunctions(obj) {
		try {
			this.#functions.postMessage(obj);
		} catch (e) {
			////console.log(e);
		}

		return new Promise((res) => {
			this.#functions.addEventListener("message", (t) => {
				res(t.data);
			}, { once: true });
		});
	}

	run() {
		this.pressStr = "";
		if (this.del < 0) {
			this.del = Math.random() * 0 + 0;
			for (let g = 0; g < this.moves.length; g++) {
				let m = {
					1: "Aa",
					2: "Bb",
					5: "C",
					6: "Dd",
					7: "Ee",
					3: "Gg",
					4: "Ff",
					128: "Hh"
				}
				if (!this.parent.flagPresses.softdrop) this.pressStr += m[this.moves[g]];
				let h = this.moves[g];
				if (h == 5) {
					if (this.parent.blob.checkValid(this.parent.blob.piece.activeArr, 0, 1)) {
						this.del = -999;
						break;
					} else {
						this.pressStr += "c";
						this.del = -999;
					}
				}

				this.moves.shift();
				g--;
				break;
			}
		}
		this.del--;

	}

	evalNode(arr) {
		return new Promise((res) => {


		});

	}

	async evaluate(stack, preview, w, h, vh, hh) {
		this.moves.length = 0;

		//stack, preview, w, h, hh, vh
		////console.log(preview)
		let args = [stack, preview, w, h, hh, vh];
		////console.log("ayo wf")
		////console.log(preview)
		let bst = await this.postToCore(args);
		let best = bst.a;
		////console.log(best)
		////console.log(nodes.a + " NODES");
		////console.log(nodes.a)
		/*let args2 = [nodes.a, this.previous.x, this.previous.rot];
		////console.log(args2)
		
		let best = await this.postToFunctions(args2);
		////console.log(best);*/
		//let best = JSON.parse(tbest);
		let px = 1,
			rot = 0;
		this.previous.x = best.x;
		this.previous.rot = best.rot;



		while (rot !== best.rot) {
			if (rot === 3) {
				this.moves.push(4);
				rot = 3;
			} else {
				this.moves.push(3);
				rot++;
			}
		}

		while (px !== best.x) {
			if (px > best.x) {
				px--;
				this.moves.push(1);
			}
			if (px < best.x) {
				px++;
				this.moves.push(2);
			}
			////console.log(px)
		}
		/*
		 */

		/*while(this.parent.blob.fieldSize.w > px) {
		 px++;
		 this.moves.push(2);
		}/**/

		this.moves.push(5);
		this.moves.push(6);

		//for (let g = 0; g < best.le)

		/*let g = best.a;
		this.moves = g[1];*/
		//drawMatrix(g[2], g[3], g[4], g[5]);

	}
}

class Neoplex2BlobArtificialIntelligence {
	#core = 0;
	constructor(parent, name, text) {
		this.parent = parent;
		this.delayReset = 10;
		this.moves = [];
		this.active = false;
		this.pressStr = "";
		this.pressLast = "";
		this.del = 0;
		this.ai = {
			x: 0,
			y: 0,
			rot: 0,
			enable: 0,
		};

		multithread.engageWorker(name, text, (a) => {
			this.#core = a.worker;
		});
	}

	run(a) {
		
		this.pressStr = "";
		if (this.parent.activeType !== 1) return;

		let isTooMuchChain = this.parent.blob.insane.isOn || this.parent.blob.isWarning;
		game.forEachPlayer(player => {
			if (player.blob.forecastedChain > 6) isTooMuchChain = true;
		});

		if (this.del < 0) {
			this.del = Math.random() * 0 + (isTooMuchChain ? 0 : 20);
			for (let g = 0; g < this.moves.length; g++) {
				let m = {
					1: "Aa",
					2: "Bb",
					5: "C",
					6: "Dd",
					7: "Ee",
					3: "Gg",
					4: "Ff",
					128: "Hh"
				}
				if (!this.parent.flagPresses.softdrop) this.pressStr += m[this.moves[g]];
				let h = this.moves[g];
				if (h == 5) {
					if (this.parent.blob.checkValid(this.parent.blob.piece.activeArr, 0, 1) && this.active) {
						this.del = -999;
						if (this.parent.blob.y <= 0) this.pressStr += "c";
						break;
					} else {
						this.pressStr += "c";
						this.del = -999;
					}
				}

				this.moves.shift();
				g--;
				break;
			}
		}
		this.del--;
	}

	postToCore(jsobj) {
		try {
			this.#core.postMessage(jsobj);
		} catch (e) {
			//console.log(e);
		}

		return new Promise((res) => {
			this.#core.addEventListener("message", (te) => {
				res(te.data);
			}, { once: true });
		});
	}


	async evaluate(stack, preview, w, h, vh, hh) {
		//this.ai.enable = false;
		this.active = false;
		this.pressStr += "c";
		this.moves = [5];
		let colors = [];
		for (let color = 0; color < this.parent.blob.colors; color++) {
			colors.push(this.parent.blob.colorSet[color]);
		}
		let prev = this.parent.blob.piece.active;
		let arrActive = this.#blobTranslate(prev.color1, prev.color2, prev.type);
		let arr = [stack, w, hh, vh, arrActive, this.parent.garbageLength + ((this.parent.blob.insane.isOn || this.parent.blob.isWarning) ? 8 : 0), this.parent.blob.piece.isBig, colors];
		////console.log(arr)

		let best = await this.postToCore(arr);
		best = best.a;
		let limit = 30;
		////console.log(best);
		//this.ai.enable = true;
		this.active = true;
		this.ai.x = best.x;
		this.pressStr = "c";
		this.moves.length = 0;
		//this.ai.y = best.y;
		this.ai.rot = best.rot;
		////console.log(this.ai.rot)
		let rot = this.parent.blob.piece.rot;
		if (this.parent.blob.piece.isBig) {
			while (rot !== best.rot && limit > 0) {
				if (best.rot < rot) {
					this.moves.push(4);
					rot--;
				} else /**/ {
					this.moves.push(3);
					rot++;
				}
				limit--;
			}
		}
		else
			while (rot !== best.rot && limit > 0) {
				if (best.rot === 3) {
					this.moves.push(4);
					rot = 3;
				} else /**/ {
					this.moves.push(3);
					rot++;
				}
				limit--;
			}
		let px = this.parent.blob.piece.x;
		while (px !== best.x && limit > 0) {
			if (px > best.x) {
				px--;
				this.moves.push(1);
			}
			if (px < best.x) {
				px++;
				this.moves.push(2);
			}
			limit--;
			////console.log(px)
		}
		/*
		 */

		/*while(this.parent.blob.fieldSize.w > px) {
		 px++;
		 this.moves.push(2);
		}/**/



		this.moves.push(5);
		this.moves.push(6);

		////console.log(this.parent.player, this.parent)
		/*let obj = {
		 grid: JSON.parse(JSON.stringify(grid)),
		 b2b: b2b,
		 preset: this.ai,
		 pieceSet: temp,
		 isWarning: false,
		 width: 10,
		 height: 40,
		 hiddenHeight: 20,
		 visibleHeight: 20,
		 combo: this.parent.block.combo,
		 isEnable180: true,
		 piecesCount: 1,
		 tFulfill: this.ai.tspinDetected.tFulfill || [],
		 tPrevent: this.ai.tspinDetected.tPrevent || [],
		 tLines: this.ai.tspinDetected.tLines || [],
		 tAvoidColumn: this.ai.tspinDetected.tAvoidColumn || [],
		};



		this.moves = [];

		let args = [active, hold, next, obj, px, py, hx, hy, prot];
		let best = await this.postToCore(args);
		this.moves = best.move;
		this.ai.tspinDetected.tLines = best.tl;
		this.ai.tspinDetected.tAvoidColumn = best.ta;
		this.ai.tspinDetected.tPrevent = best.tp;
		this.ai.tspinDetected.tFulfill = best.tf;

		for (let v = 0, len = this.moves.length; v < len; v++) {

		}/**/
	}

	#blobTranslate(c, d, t) {
		let ma = [[
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
    ]
   ], [
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
      ][t];
		return ma;
	}

}


class NeoplexStaticFrenzyAI {
	//Sapphirus AI
	#core = 0;
	constructor(parent, name, text) {
		this.parent = parent;
		this.delayReset = 10;
		this.moves = [];
		this.active = false;
		this.pressStr = "";
		this.pressLast = "";
		this.pieceDelay = 0;
		this.ai = {
			controlImg: {
				x: 0,
				y: 0,
				rot: 0,
				hold: 0
			},
			rotations: [
      [0],
      [
       1, 1, 1, 1
      ],
      [
       2, 2, 2, 2
      ]
    ],

			enableTspin: false,
			grid: [],
			ppsLimit: 289,
			
			extraMovements: [],
			x: 0,
			y: 0,
			rot: 0,
			matrix: [],
			heuristicsWeight: {
				aggHeight: -0.0000510066,
				bump: -0.184483,
				lines: 0.1760666,
				holes: -41.0000300044,
				blockade: -0.0666,
				failedTspin: -994.0,
				failedWide: -0,
				b2b: 0.75,
				possibleSpin: 0.202
			},
			failedWide: 0,
			tspinDetector: {
				tslot: [[0, 1], [1, 1], [2, 1], [1, 2]],
				bottom: [[0, 2], [2, 2] /*, [-1, 1], [3, 1]*/ ],
				tuck: [[0, 0, [[1, 0], [2, 0]]], [2, 0, [[0, 0], [1, 0]]]],
			},
			tspinHeight: 5,
			flag: {
				LEFT: 1,
				RIGHT: 2,
				SOFTDROP: 4,
				HARDDROP: 8,
				HOLD: 16,
				CW: 32,
				CCW: 64,
				C180W: 128,
			},

			tspinDetected: {
				tslot: [],
				bottom: [],
				tuck: [],

				tLines: [],
				tBlock: [],
				tSlot: [],
				tAvoidColumn: []


			}
		};

		multithread.engageWorker(name, text, (a) => {
			this.#core = a.worker;
		});
	}
	
	loadFrenzyMovements(file) {
		
	}

	run(a) {
		this.pressStr = "";
		let isTooMuchChain = false;
		game.forEachPlayer(player => {
			if (player.blob.forecastedChain > 5) isTooMuchChain = true;
		});


		if (this.pieceDelay < 0) {

			this.pieceDelay = Math.random() * 10 + 0;

			if (isTooMuchChain) {
				//h = 8;
				//this.moves.push(88);
				this.pieceDelay = 0;
			}
			if (false) {
				this.pressStr = "Dd";
			} else if (this.ai.extraMovements.length > 0 && this.parent.block.frenzy.isOn) {
				
				let isSoftDrop = 0;
				let j = {
					1: "Aa",
					2: "Bb",
					3: "C",
					4: "Dd",
					5: "Ee",
					6: "Gg",
					7: "Ff",
					8: "Hh"
				}
				let h = this.ai.extraMovements[0];

				if (!this.parent.flagPresses.softdrop) this.pressStr += j[h];
				if (h == 4) {
					if (this.parent.block.checkValid(this.parent.block.piece.activeArr, 0, 1)) {
						this.pieceDelay = -999;
						isSoftDrop = 1;

					} else {
						this.pieceDelay = -999;
						this.pressStr += "c";
					}
				}
				if (!isSoftDrop) this.ai.extraMovements.shift();

			}

			else for (let g = 0; g < this.moves.length; g++) {
				let j = {
					1: "Aa",
					2: "Bb",
					4: "C",
					8: "Dd",
					16: "Ee",
					32: "Gg",
					64: "Ff",
					128: "Hh"
				}
				let h = this.moves[g];

				if (!this.parent.flagPresses.softdrop) this.pressStr += j[h];
				if (h == 4) {
					if (this.parent.block.checkValid(this.parent.block.piece.activeArr, 0, 1)) {
						break;
						this.pieceDelay = -999;
					} else {
						this.pieceDelay = -999;
						this.pressStr += "c";
					}
				}
				this.moves.shift();
				g--;
				break;
			}
		}
		this.pieceDelay--;
	}

	postToCore(jsobj) {
		try {
			this.#core.postMessage(jsobj);
		} catch (e) {
			////console.log(e);
		}

		return new Promise((res) => {
			this.#core.addEventListener("message", (te) => {
				res(te.data);
			}, { once: true });
		});
	}


	async evaluate(active, hold, isHeld, next, b2b, combo, grid, hx, hy, px, py, prot, temp) {
		if (isHeld) return;
		////console.log(this.parent.player, this.parent)
		let obj = {
			grid: JSON.parse(JSON.stringify(grid)),
			b2b: b2b,
			preset: this.ai,
			pieceSet: temp,
			isWarning: false,
			width: 10,
			height: 40,
			hiddenHeight: 20,
			visibleHeight: 20,
			combo: this.parent.block.combo,
			isEnable180: false,
			piecesCount: 1,
			tFulfill: this.ai.tspinDetected.tFulfill || [],
			tPrevent: this.ai.tspinDetected.tPrevent || [],
			tLines: this.ai.tspinDetected.tLines || [],
			tAvoidColumn: this.ai.tspinDetected.tAvoidColumn || [],
		};



		this.moves = [];

		let args = [active, hold, next, obj, px, py, hx, hy, prot];
		let best = await this.postToCore(args);
		this.moves = best.move;
		this.ai.tspinDetected.tLines = best.tl;
		this.ai.tspinDetected.tAvoidColumn = best.ta;
		this.ai.tspinDetected.tPrevent = best.tp;
		this.ai.tspinDetected.tFulfill = best.tf;

		for (let v = 0, len = this.moves.length; v < len; v++) {

		}
	}
}