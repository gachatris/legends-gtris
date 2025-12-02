const NUISANCE = 6;

function evaluate(p) {
	//let prediction = {};
	let mainobj = {
		grid: p[0],
		width: p[1],
		height: p[2] + p[3],
		hiddenHeight: p[2],
		visibleHeight: p[3],
		matrix: p[4],
		
		blubRequire: 4,
	}
	let isGarbage = p[5] > 3;
	let isBig = p[6];
	let blobColors = p[7];
	let matrixTemp = mainobj.matrix;
	let highScore = -Infinity;
	let isChain = 0;
	prediction = [{
		x: 0,
		mx: ~~(Math.random() * mainobj.width),
		y: 0,
		rot: 0,
		index: 0,
		move: [5],
		score: -Infinity,
	}];
	let aix = 4,
		airot = 0,
		aiy = mainobj.hiddenHeight - 2,
		grid,
		matrix,
		width = mainobj.width,
		height = mainobj.height,
		hiddenHeight = mainobj.hiddenHeight,
		visibleHeight = mainobj.visibleHeight,
		checkValidation = function(cx, cy, cmatrix, px, py, cgrid) {
			cx = cx + (px);
			cy = Math.floor(cy + (py));
			for (let x = 0, len = cmatrix.length; x < len; x++) {
				for (let y = 0, wid = cmatrix[x].length; y < wid; y++) {
					if (
						cmatrix[x][y] && (
							x + cx < 0 ||
							x + cx >= width ||
							y + cy >= height ||
							cgrid[x + cx][y + cy])
					)
						return false;
				};
			};
			return true;
		},
		_checkDrop = function(d, tx, ty, cmatrix, cgrid) {
			let x = tx,
				y = ty;
			let i = 1;
			for (; i <= d; i++) {
				if (!checkValidation(0, i, cmatrix, x, y, cgrid)) return i - 1;
			};
			return i - 1;
		};
	for (let rotations = 0; rotations < (isBig ? blobColors.length : 4); rotations++) {
		aix = 2,
			airot = 0,
			aiy = hiddenHeight - 2,
			grid = JSON.parse(JSON.stringify(mainobj.grid)),
			matrix = matrixTemp[isBig ? 0 : rotations];
		aiy = _checkDrop(1, aix, aiy, matrix, grid);
		for (; checkValidation(1, 0, matrix, aix, aiy, grid); aix++) {}

		let mx = aix,
			my = aiy;
		for (let moves = 0; moves < mainobj.width + 2; moves++) {
			my = aiy;
			if (moves > 0 && checkValidation(-1, 0, matrix, mx, my, grid)) {
				mx--;
			}

			grid = JSON.parse(JSON.stringify(mainobj.grid));

			let chainAchieved = 0,
				blubConnected = 0,
				vertical = 0,
				horizontal = 0,
				diagLeft = 0,
				diagRight = 0,
				onePoints = 0,
				coloredblub = 0,
				nuisanceblub = 0;



			my += _checkDrop(83, mx, my, matrix, grid);
			for (let f = 0, l = matrix.length; f < l; f++) {
				for (let i = 0, w = matrix[f].length; i < w; i++) {
					if (matrix[f][i]) grid[f + mx][i + my] = isBig ? blobColors[rotations] : matrix[f][i];
				}
			}
			{
				let chain = 0;
				let eraseInfo = [];
				let erasedBlocks = [];
				
				let check = () => {
					let isExistForChain = false;
					const eraseColor = {},
						sequencePuyoInfo = [],
						sequenceNuisanceInfo = [];
					eraseInfo.length = 0;
					let checkedBlobs = {};
					erasedBlocks.length = 0;
					const existingPuyoList = [],
						checkPuyoOrigin = (x, y) => {
							const origin = grid[x][y];
							if (!(origin !== 0 && typeof origin !== "undefined" && origin !== null && origin !== NUISANCE) || y < mainobj.hiddenHeight) {
								return;
							};

							sequencePuyoInfo.push({
								x: x,
								y: y,
								cell: grid[x][y]
							});
							
							checkedBlobs[`${x}|${y}`] = grid[x][y];
							
							grid[x][y] = 0;

							const direction = [[0, 1], [1, 0], [0, -1], [-1, 0]];
							for (let iteration = 0; iteration < direction.length; iteration++) {
								const dX = x + direction[iteration][0];
								const dY = y + direction[iteration][1];
								if (
									dX < 0 ||
									dY < hiddenHeight ||
									dX >= width ||
									dY >= height
								) {
									continue;
								};
								if (dY < hiddenHeight) continue;
								const dCell = grid[dX][dY];
								if (!(dCell !== 0 && typeof dCell !== "undefined" && dCell !== null && dCell !== NUISANCE) || dCell !== origin) {
									onePoints++;
									continue;
								};
								if (direction[iteration][0] == 1 || direction[iteration][0] == -1) horizontal++;
								if (direction[iteration][1] == 1 || direction[iteration][1] == -1) vertical++;

								//if (direction[iteration][0] == 1 || (direction[iteration][1] == 1 || direction[iteration][1] == -1)) diagRight++;
								//if (direction[iteration][0] == -1 || (direction[iteration][1] == 1 || direction[iteration][1] == -1)) diagLeft++;
								blubConnected += 29;
								
								checkPuyoOrigin(dX, dY);
							};
						},
						checkNuisanceOrigin = (x, y) => {
							const origin = grid[x][y];

							//grid[x][y] = 0;

							const direction = [[0, 1], [1, 0], [0, -1], [-1, 0]];
							for (let iteration = 0; iteration < direction.length; iteration++) {
								const dX = x + direction[iteration][0];
								const dY = y + direction[iteration][1];

								if (
									dX < 0 ||
									dY < hiddenHeight ||
									dX >= width ||
									dY >= height
								) {
									continue;
								};
								if (dY < hiddenHeight) continue;
								const dCell = grid[dX][dY];
								if (!(dCell !== 0 && typeof dCell !== "undefined" && dCell !== null || dCell !== /*hHARR*/ NUISANCE)) {
									continue;
								};

								if (grid[dX][dY] == NUISANCE) sequenceNuisanceInfo.push({
									x: dX,
									y: dY,
									cell: grid[x][y]
								});
							};
						}
					for (var x = 0; x < width; x++) {
						for (var y = hiddenHeight - 1; y < height; y++) if (!(`${x}|${y}` in checkedBlobs)) {
							sequencePuyoInfo.length = 0; //reset sequence arr
							sequenceNuisanceInfo.length = 0;
							const puyoCol = grid[x][y];
							checkPuyoOrigin(x, y);
							if (sequencePuyoInfo.length == 0 || sequencePuyoInfo.length < mainobj.blubRequire) {
								if (sequencePuyoInfo.length > 0) {
									existingPuyoList.push(...sequencePuyoInfo);
								}
							} else {
								eraseColor[puyoCol] = true;
								eraseInfo.push(...sequencePuyoInfo);
							}
							for (const e of existingPuyoList) {
								grid[e.x][e.y] = e.cell;
							}
							if (eraseInfo.length > 0) {
								isExistForChain = true;
								for (const isNuisance of eraseInfo) {
									checkNuisanceOrigin(isNuisance.x, isNuisance.y);
								}
								for (const e of sequenceNuisanceInfo) {
									grid[e.x][e.y] = 0;
								}
								//console.table(eraseInfo)
								erasedBlocks.push({
									x: x,
									y: y,
									cell: puyoCol
								});
								continue
							}
						}
					}
					for (let o of eraseInfo) erasedBlocks.push(o);
					if (isExistForChain) {
						chain++;
						return true;
					}
					return false;
				};
				let testSpace = function(x, y) {
						if (x < 0 || x >= width) {
							return true;
						}
						if (y < height) {
							if (grid[x][y] !== 0) {
								return true;
							}
							return false;
						}
						return true;
					},
					holes = [],
					checkDrop = function(x, y, i) {
						var r = 0;
						for (; r < i; r++) {
							if (testSpace(x, y + r)) {
								break
								return r - 1
							}
						}
						//////console.log(`DROP: ${r - 1}`)
						return r - 1
					},
					checkHoles = function() {
						for (let t = 0; t < 20; t++)
							for (var y = height - 1; y >= -1; y--) {
								for (var x = 0; x < width; x++) {
									if (!testSpace(x, y - 1)) {
										continue
									}
									if (!testSpace(x, y)) {
										grid[x][y] = grid[x][y - 1];
										grid[x][y - 1] = 0;
									}
								}
							}
					},
					isFinished = false;
				while (true) {
					checkHoles();
					if (!check()) break;
					//blubsConnected = 0;
					nuisanceblub = 0;
					horizontal = 0;
					vertical = 0;
					//if (eraseInfo.length == 0) break;

				};
				chainAchieved = chain;
				if (isChain < chain) isChain = chain;
			}
			let isNohoho = 0;
			let isTopOut = false;
			for (let x = 0, l = mainobj.width; x < l; x++) {
				for (let y = mainobj.hiddenHeight, w = mainobj.height; y < w; y++) {
					if (grid[x][y] > 0) {
						if ((x == 2 || x == 3) && y == mainobj.hiddenHeight) isTopOut = true;
						if (grid[x][y] == NUISANCE) nuisanceblub++;
						else if (grid[x][y] > 0) {
							coloredblub++;
							//if (rotations == 0 && x > mainobj.width / 2 && moves > mainobj.width - 5) isNohoho++;
						}

					}
				}
			}
			//if (rotations == 0 && (/*moves > mainobj.width / 2 ||/*/ mx > (mainobj.width / 2) && moves > mainobj.width / 2)) isNohoho++;
			let isEnoughChain = chainAchieved > 6 || chainAchieved == 0;

			let score = (coloredblub) > 3 ? ((isTopOut ? (-8.10e39) : (51)) + (blubConnected * 83.37373) + (coloredblub * -33) + (nuisanceblub * -3599583) + (~~((vertical + horizontal + diagRight + diagLeft) * 0.39889)) + (onePoints * -39338938393887) + (chainAchieved * 88395658) + (3 * (isEnoughChain ? 831 : -488484848484848738383883838373733884))) : (Math.random() * 2147483647);
			if (!isTopOut) {
				prediction.push({
					x: mx,
					mx: mx,
					y: my,
					rot: rotations,
					//index: matrix,
					move: [],
					score: score,
					chain: chainAchieved
				});
			}

		}
	}

	let best = {};
	for (let y of prediction) {
		if (y.score > highScore && ((isGarbage && isChain) ? (y.chain > 0) : true)) {
			best = JSON.parse(JSON.stringify(y));
			highScore = y.score;
		}
	}
	return best;
}

function checkChain() {
				let chain = 0;
				let eraseInfo = [];
				let erasedBlocks = [];
				let check = () => {
					let isExistForChain = false;
					const eraseColor = {},
						sequencePuyoInfo = [],
						sequenceNuisanceInfo = [];
					eraseInfo.length = 0;
					erasedBlocks.length = 0;
					const existingPuyoList = [],
						checkPuyoOrigin = (x, y) => {
							const origin = grid[x][y];
							if (!(origin !== 0 && typeof origin !== "undefined" && origin !== null && origin !== NUISANCE) || y < mainobj.hiddenHeight) {
								return;
							};

							sequencePuyoInfo.push({
								x: x,
								y: y,
								cell: grid[x][y]
							});
							grid[x][y] = 0;

							const direction = [[0, 1], [1, 0], [0, -1], [-1, 0]];
							for (let iteration = 0; iteration < direction.length; iteration++) {
								const dX = x + direction[iteration][0];
								const dY = y + direction[iteration][1];
								if (
									dX < 0 ||
									dY < hiddenHeight ||
									dX >= width ||
									dY >= height
								) {
									continue;
								};
								if (dY < hiddenHeight) continue;
								const dCell = grid[dX][dY];
								if (!(dCell !== 0 && typeof dCell !== "undefined" && dCell !== null && dCell !== NUISANCE) || dCell !== origin) {
									onePoints++;
									continue;
								};
								if (direction[iteration][0] == 1 || direction[iteration][0] == -1) horizontal++;
								if (direction[iteration][1] == 1 || direction[iteration][1] == -1) vertical++;

								//if (direction[iteration][0] == 1 || (direction[iteration][1] == 1 || direction[iteration][1] == -1)) diagRight++;
								//if (direction[iteration][0] == -1 || (direction[iteration][1] == 1 || direction[iteration][1] == -1)) diagLeft++;
								blubConnected += 29;
								checkPuyoOrigin(dX, dY);
							};
						},
						checkNuisanceOrigin = (x, y) => {
							const origin = grid[x][y];

							//grid[x][y] = 0;

							const direction = [[0, 1], [1, 0], [0, -1], [-1, 0]];
							for (let iteration = 0; iteration < direction.length; iteration++) {
								const dX = x + direction[iteration][0];
								const dY = y + direction[iteration][1];

								if (
									dX < 0 ||
									dY < hiddenHeight ||
									dX >= width ||
									dY >= height
								) {
									continue;
								};
								if (dY < hiddenHeight) continue;
								const dCell = grid[dX][dY];
								if (!(dCell !== 0 && typeof dCell !== "undefined" && dCell !== null || dCell !== /*hHARR*/ NUISANCE)) {
									continue;
								};

								if (grid[dX][dY] == NUISANCE) sequenceNuisanceInfo.push({
									x: dX,
									y: dY,
									cell: grid[x][y]
								});
							};
						}
					for (var x = 0; x < width; x++) {
						for (var y = hiddenHeight - 1; y < height; y++) {
							sequencePuyoInfo.length = 0; //reset sequence arr
							sequenceNuisanceInfo.length = 0;
							const puyoCol = grid[x][y];
							checkPuyoOrigin(x, y);
							if (sequencePuyoInfo.length == 0 || sequencePuyoInfo.length < mainobj.blubRequire) {
								if (sequencePuyoInfo.length > 0) {
									existingPuyoList.push(...sequencePuyoInfo);
								}
							} else {
								eraseColor[puyoCol] = true;
								eraseInfo.push(...sequencePuyoInfo);
							}
							for (const e of existingPuyoList) {
								grid[e.x][e.y] = e.cell;
							}
							if (eraseInfo.length > 0) {
								isExistForChain = true;
								for (const isNuisance of eraseInfo) {
									checkNuisanceOrigin(isNuisance.x, isNuisance.y);
								}
								for (const e of sequenceNuisanceInfo) {
									grid[e.x][e.y] = 0;
								}
								//console.table(eraseInfo)
								erasedBlocks.push({
									x: x,
									y: y,
									cell: puyoCol
								});
								continue
							}
						}
					}
					for (let o of eraseInfo) erasedBlocks.push(o);
					if (isExistForChain) {
						chain++;
						return true;
					}
					return false;
				};
				let testSpace = function(x, y) {
						if (x < 0 || x >= width) {
							return true;
						}
						if (y < height) {
							if (grid[x][y] !== 0) {
								return true;
							}
							return false;
						}
						return true;
					},
					holes = [],
					checkDrop = function(x, y, i) {
						var r = 0;
						for (; r < i; r++) {
							if (testSpace(x, y + r)) {
								break
								return r - 1
							}
						}
						//////console.log(`DROP: ${r - 1}`)
						return r - 1
					},
					checkHoles = function() {
						for (let t = 0; t < 20; t++)
							for (var y = height - 1; y >= -1; y--) {
								for (var x = 0; x < width; x++) {
									if (!testSpace(x, y - 1)) {
										continue
									}
									if (!testSpace(x, y)) {
										grid[x][y] = grid[x][y - 1];
										grid[x][y - 1] = 0;
									}
								}
							}
					},
					isFinished = false;
				while (true) {
					checkHoles();
					if (!check()) break;
					//blubsConnected = 0;
					nuisanceblub = 0;
					horizontal = 0;
					vertical = 0;
					//if (eraseInfo.length == 0) break;

				};
				chainAchieved = chain;
				if (isChain < chain) isChain = chain;
			}

function _eval(datum) {
	//let [width, height, stack, active, hold, next] = datum;
	let ne = performance.now();
	let h = evaluate(datum);
	let ne2 = performance.now();
	return {
		ms: `${ne2 - ne} milliseconds taken`,
		a: h
	};
}