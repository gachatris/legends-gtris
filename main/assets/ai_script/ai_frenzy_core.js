var $CLONE = function(arr) {
 var ARR = [];
 var len = arr.length,
  len2;
 for (let a = 0; a < len; a++) {
  if (typeof arr[a] == "object" && arr[a] instanceof Array) {
   ARR.push([]);
   if (typeof arr[a] == "object") len2 = arr[a].length;
   for (let b = 0; b < len2; b++) {
    ARR[a].push(arr[a][b]);
   };
  }
  else {
   ARR.push(arr[a]);
  }
 };
 return ARR;
};
const KEY_FLAGS = {
 LEFT: 1,
 RIGHT: 2,
 SOFTDROP: 3,
 HARDDROP: 4,
 HOLD: 5,
 CW: 6,
 CCW: 7,
 C180W: 8,
};

let proi = {
	tAvoidColumn: [],
	tFulfill: [],
	tPrevent: [],
	tLines: [],
	
}

var frenzyMovements = {};
const frenzyStaticMovements = [];


function makeMove(args) {
 /**
  * Completes the Object properties needed for evaluatePieces()
  * method to think.
  */
 var [_frenzy, active, nextPiece, jsobj, _x, _y, holdX, holdY, _rot] = args;
 let resolve = {};
 let frenzy = _frenzy || {
 	on: 0,
 	change: 0,
 	load: 0,
 	loadFile: "",
 	phase: 0,
 	color: 0,
 	map: 0,
 	flip: 0
 };
 if (frenzy.on) {
 	if (frenzy.load) {
 		frenzyMovements = JSON.parse(frenzy.loadFile);
 		return {};
 	}
 	if (frenzy.change) {
 		let reference = frenzyMovements[frenzy.phase][frenzy.color][frenzy.map][frenzy.flip];
 		let way = Math.random() * (reference.length)
		let move = reference[way];
		return {
			
		};
	}
 }
 let json = (piece) => {
  let le = jsobj || {};
  le.active = piece;
  le.x = _x;
  le.y = _y;
  return le;
 }

 let activePiece = evaluatePieces(json(active));
 let otherPiece;
 let canHold;
 let x = _x;
 let y = _y;
 let rot = _rot;
 let move = [];
 let mainGrid = jsobj.grid;
 let mainMatrix;
 let matrixTemplate;
 let checkSpace = (xu, yu) => {
   if (xu < 0 || xu >= jsobj.width) {
    return true;
   }
   if (yu < jsobj.height) {
    if (typeof mainGrid[xu][yu] !== "undefined" && mainGrid[xu][yu] !== 0) {
     return true;
    }
    return false;
   }
   return true;
  },
  checkValid = (_rx, _ry, matrix) => {
   let rx = ~~(_rx) + x;
   let ry = ~~(_ry + y);
   for (let lx = 0, len = matrix.length; lx < len; lx++) {
    for (let ly = 0, wid = matrix[lx].length; ly < wid; ly++) {
     if (
      matrix[lx][ly] && checkSpace(lx + rx, ly + ry)
     )
      return false;
    };
   };
   return true;
  },
  checkDrop = (distance, matrix) => {
   let dis = 1;
   for (; dis <= distance; dis++) {
    if (!checkValid(0, dis, matrix)) return dis - 1;
   }
   return dis - 1;
  },
  rotate = (direction, _kickTable, matrixTemp) => {
   let currentRot = ((rot % 4) + 4) % 4;
   let newRot = (((rot + direction) % 4) + 4) % 4;
   let newMatrix = matrixTemp[newRot];
   let mainWK = _kickTable.right;
   switch (direction) {
    case -1:
     mainWK = _kickTable.left;
     break;
    case 2:
     mainWK = _kickTable.double;
     break;
   }
   for (let ITERATION = 0, length = mainWK[currentRot].length; ITERATION < length; ITERATION++) {
    if (checkValid(
      mainWK[currentRot][ITERATION][0],
      mainWK[currentRot][ITERATION][1],
      newMatrix
     )) {
     x += mainWK[currentRot][ITERATION][0];
     y += mainWK[currentRot][ITERATION][1];

     mainMatrix = newMatrix;
     rot = newRot;
     return KEY_FLAGS[{
      1: "CW",
      [-1]: "CCW",
      2: "C180W"
     } [direction]];
    }
   }
   return 0;
  },
  movePiece = (cx) => {
   if (checkValid(cx, 0, mainMatrix)) x += cx;
   return KEY_FLAGS[{
    1: "RIGHT",
      [-1]: "LEFT"

   } [cx]];
  };
 
 let best = activePiece.a;
 let bestPieceIndex = active;
 let life = 20;
 let iter = activePiece.iterations;
 
 // bestPieceIndex = otherPiece

 mainMatrix = jsobj.pieceSet[bestPieceIndex].matrix[rot];
 matrixTemplate = jsobj.pieceSet[bestPieceIndex].matrix;
 let kickTable = jsobj.pieceSet[bestPieceIndex].kickTable
 let readjustable = {
  x: best.x,
  y: best.y
 };
 ////////console.log(best)
 let hf = (f) => {
  let hq = 0;
  switch (f) {
   case 1: {
    hq |= KEY_FLAGS.SOFTDROP;
    y += checkDrop(96, mainMatrix);
    break;
   };
   case 2: {
    hq |= KEY_FLAGS.HARDDROP;
    break;
   };
   case 4: {
    hq |= rotate(1, kickTable, matrixTemplate);
    break;
   };
   case 5: {
    hq |= rotate(-1, kickTable, matrixTemplate); //KEY_FLAGS.CCW;
    break;
   };
   case 6: {
    if (jsobj.isEnable180) hq |= rotate(w, kickTable, matrixTemplate);
    else {
     best.move.unshift(4);
     hq |= rotate(1, kickTable, matrixTemplate);
    }
    break;
   }
  }
  return hq;

 }
 let rotTimes = best.rot;

 let isRunning = true;
 let ic = false;
 let run = () => {

  let hq = 0;
  if (readjustable.x > Math.round(x) && checkValid(1, 0, mainMatrix)) {
   hq |= //KEY_FLAGS.RIGHT;
    movePiece(1);

  }
  else if (readjustable.x < Math.round(x) && checkValid(-1, 0, mainMatrix)) {
   hq |= //(KEY_FLAGS.LEFT);
    movePiece(-1);
  }
  else if (rotTimes > 0) {
   euler: switch (rotTimes) {
    case 1: {
     hq |= //(KEY_FLAGS.CW);
      rotate(1, kickTable, matrixTemplate);

     rotTimes = 0;
     break euler;
    }
    case 3: {
     hq |= //(KEY_FLAGS.CCW);
      rotate(-1, kickTable, matrixTemplate);
     rotTimes = 0;
     break euler;
    }
    case 2: {
     if (jsobj.isEnable180) {
      hq |= //(KEY_FLAGS.C180W);
       rotate(2, kickTable, matrixTemplate);
      rotTimes = 0;
     } else {
      hq |= //(KEY_FLAGS.CW);
       rotate(1, kickTable, matrixTemplate);
      rotTimes--;
     }
     break euler;
    }
   }
  }


  // move.push(hq);
  else if (x == readjustable.x && rotTimes == 0) {
   //while (best.move.length > 0) {
   //}
   if (best.move.length == 0) isRunning = false;
   else {


    var f = best.move.shift();
    hq |= hf(f);
    if (readjustable.x !== best.finalX) {
     /*let diffX = (readjustable.x - x);
     if (diffX < 1) {
      hq |= movePiece(-1);
     }
     if (diffX > 1) {
      hq |= movePiece(1);
     }/**/
     //if (f === )

     //readjustable.x = best.finalX;
     //ic = true;
    }


   }
   //break;
  } else if (ic) {
   var fe = best.move.shift();
   hq |= hf(fe);
   //ic = false;
  }
  else isRunning = false
  if (hq) move.push(hq);
  life--;

  if (life <= 0) isRunning = false;

  if (!isRunning) {
   move.push(KEY_FLAGS.HARDDROP);
   y += checkDrop(37, mainMatrix);
   
	proi.tFulfill = best.tfulfill;
	proi.tAvoidColumn = best.tavoidcol
	proi.tPrevent = best.tprev;
	proi.tLines = best.tlines;

   resolve = ({
    move: move,
    x: x,
    y: y,
    iterations: iter,

   });
   return;
  } else run();
 }
 run();

 return resolve;



}


function evaluatePieces(jsobj) {
 let PIECE = jsobj.active;
 let matrixTemp = jsobj.pieceSet[PIECE].matrix;
 let mainMatrix = matrixTemp[1];
 let mainWK = jsobj.pieceSet[PIECE].kickTable,
  mainWKCW = mainWK.left,
  mainWKCCW = mainWK.right;
 let mainRot = 0;
 let iterations = 0;
 let mainGrid, mainX = 0,
  mainY = 0,
  mainRotations = jsobj.preset.rotations,
  pieceSpin = jsobj.pieceSet[PIECE].spinDetection,
  mainGridTest = (x, y) => {
   if (x < 0 || x >= jsobj.width) {
    return true;
   }
   if (y < jsobj.height) {
    if (typeof mainGrid[x][y] !== "undefined" && mainGrid[x][y] !== 0) {
     return true;
    }
    return false;
   }
   return true;

  },

  mainCheckAIValidation = (cx, cy, matrix, px, py) => {
   cx = cx + (px !== void 0 ? px : mainX);
   cy = Math.floor(cy + (py !== void 0 ? py : mainY));
   for (let x = 0, len = matrix.length; x < len; x++) {
    for (let y = 0, wid = matrix[x].length; y < wid; y++) {
     if (
      matrix[x][y] &&
      /*(
             x + cx < 0 ||
             x + cx >= jsobj.width ||
             y + cy >= jsobj.height ||
             mainGrid[x + cx][y + cy]*/
      mainGridTest(x + cx, y + cy)
     )
      return false;
    };
   };
   return true;
  },
  mainCheckDrop = (d, tx, ty, matrix) => {
   let x = tx !== void 0 ? tx : mainX,
    y = ty !== void 0 ? ty : mainY;
   let i = 1;
   for (; i <= d; i++) {
    if (!mainCheckAIValidation(0, i, matrix, x, y)) return i - 1;
   };
   return i - 1;
  };

 let prediction = [];
 
     prediction.push({
      x: 0,
      mx: 0,
      y: 0,

      finalX: 0,
      finalY: 0,
      finalRot: 0,

      rot: 0,
      index: 0,
      grid: [],
      move: [],
      lines: 0,
      score: -Infinity,
      tlines: [],
      tprev: [],
      tavoidcol: [],
      tfulfill: []
     });

 let rotationTrials;
 if (PIECE === 2) { rotationTrials = 1; }
 else rotationTrials = 4;

 for (let rotations = 0; rotations < rotationTrials; rotations++) {
  mainY = jsobj.y;
  mainX = jsobj.x; //jsobj.pieceSet[PIECE].x + Math.min((jsobj.width - 5), ~~((jsobj.width - 10) / 2));
  mainMatrix = matrixTemp[rotations];
  mainGrid = JSON.parse(JSON.stringify(jsobj.grid));
  if (rotations !== -1) {
   let currentRot = ((mainRot % 4) + 4) % 4;
   let newRot = (((mainRot + 1) % 4) + 4) % 4;
   let rotateTemp = matrixTemp[newRot];
   for (let ITERATION = 0, length = mainWKCW[currentRot].length; ITERATION < length; ITERATION++) {
    if (mainCheckAIValidation(
      mainWKCW[currentRot][ITERATION][0],
      mainWKCW[currentRot][ITERATION][1],
      rotateTemp
     )) {
     mainX += mainWKCW[currentRot][ITERATION][0];
     mainY += mainWKCW[currentRot][ITERATION][1];

     mainMatrix = rotateTemp;
     mainRot = newRot;
     break;
    };
   };
  }; /**/
  for (; mainCheckAIValidation(-1, 0, mainMatrix); mainX--) {};
  for (let movements = 0; movements < jsobj.width; movements++) {
   //mainX = lastX;
   //mainGrid = JSON.parse(JSON.stringify(jsobj.grid));
   if (movements !== 0 && mainCheckAIValidation(1, 0, mainMatrix, void 0, void 0)) {
    mainX++;
   }
   let rotSetGroup = mainRotations.length;
   // //////console.log("ROTATING", rotSetGroup, mainRotations)
   for (let rs = 0; rs < rotSetGroup; rs++) {
    mainGrid = JSON.parse(JSON.stringify(jsobj.grid));
    let rotSet = mainRotations[rs];
    let moves = [];
    

    //mainGrid = JSON.parse(JSON.stringify(jsobj.grid));
    let is2To180 = 0;
    var mrot = mainRot;
    let mx = mainX;
    let my = mainY;
    var lastX = mainX,
     lastY = mainCheckDrop(50, mainX, mainY, mainMatrix);

    /*proi.tPrevent = [],
     proi.tFulfill = [],
     proi.tLines = [],
     proi.tAvoidColumn = [],*/
    let tYes = 0,
     tSlot = 0,
     tZero = 0,
     tBlock = 0;
    let mt = mainMatrix;
    mrot = mainRot;
    //mx = mainX;
    my += mainCheckDrop(jsobj.height, mx, my, mt);
    let rmy = my;

    let rotLength = rotSet.length;
    for (let dr = 0; dr < rotLength; dr++) {
     let dropRotation = rotSet[dr];
     is2To180 = 0;
     if (mainRot == 0 && dr !== 0) break;
     /*if (dr === 0) /**/
     if (dropRotation !== 0 && /*&& (PIECE == 0 || PIECE == 6 || PIECE == 3)*/ dr == 0) moves.push(1);
     let failedTspin = 0;
     //mainGrid = JSON.parse(JSON.stringify(jsobj.grid));
     for (let GX = 0; GX < jsobj.width; GX++) {
      for (let GY = 5; GY < (jsobj.height); GY++) {
       if (typeof mainGrid[GX][GY] === "undefined") mainGrid[GX][GY] = 0;
      }
     }
     if (true) {
      if (dropRotation === 1) {
       let currentRot = ((mrot % 4) + 4) % 4;
       let newRot = (((mrot + 1) % 4) + 4) % 4;
       let rotateTemp = matrixTemp[newRot];
       let length = mainWKCW[currentRot].length;
       for (let ITERATION = 0; ITERATION < length; ITERATION++) {
        if (mainCheckAIValidation(
          mainWKCW[currentRot][ITERATION][0],
          mainWKCW[currentRot][ITERATION][1],
          rotateTemp, mx, my
         )) {
         mx += mainWKCW[currentRot][ITERATION][0];
         my += mainWKCW[currentRot][ITERATION][1];

         mt = rotateTemp;
         mrot = newRot;
         //if (moves.indexOf(4) !== -1 || moves.indexOf(5) !== -1) moves.pop();
         moves.push(4);
         break;
        };
       };
      }
      if (dropRotation === 2) {
       let currentRot = ((mrot % 4) + 4) % 4;
       let newRot = (((mrot - 1) % 4) + 4) % 4;
       let rotateTemp = matrixTemp[newRot];
       let length = mainWKCCW[currentRot].length;
       for (var ITERATION = 0; ITERATION < length; ITERATION++) {
        if (mainCheckAIValidation(
          mainWKCCW[currentRot][ITERATION][0],
          mainWKCCW[currentRot][ITERATION][1],
          rotateTemp, mx, my
         )) {
         mx += mainWKCCW[currentRot][ITERATION][0];
         my += mainWKCCW[currentRot][ITERATION][1];
         mt = rotateTemp;
         mrot = newRot;
         //if (moves.indexOf(4) !== -1 || moves.indexOf(5) !== -1) moves.pop();
         moves.push(5);
         break;
        };
       };
      }
     }
     /* if (is2To180 === 2 || is2To180 === 2) {
       moves.push(6);
      } else if (is2To180 === 1 || is2To180 === 3) {
       moves.push(4);
       if (is2To180 === 3) {
        moves.push(4);
        moves.push(4);
       }
      } else if (is2To180 === -1 || is2To180 === -3) {
       moves.push(5);
       if (is2To180 == -3) {
        moves.push(5);
        moves.push(5);
       }
      };
     if (is2To180 === 2 || is2To180 === -2) {
      if (moves.indexOf(4) !== -1 || moves.indexOf(5) !== -1) moves.pop();
      moves.push(6);
     }
     if (is2To180 === 1 || is2To180 === 3) {
      moves.push(4);
     }
     if (is2To180 === -1 || is2To180 === -3) {
      moves.push(5);
     }/**/

     let glitchCount = 0;
     let linesComplete = 0,
      holes = 0,
      blockade = 0,
      bump = 0,
      foundTspin = 0,
      b2bNew = jsobj.b2b + 1;

     let isB2B = false,
      isSpin = 0,
      isMini = 0,
      checkPoints = 0;

     if (moves.length == 1) {
      moves = [];
     };
     let spinXLength = 4;

     if (mainCheckDrop(1, mx, my, mt) == 0 && is2To180 !== 0 && PIECE === 6 && jsobj.preset.enableTspin) {

      for (let i = 0; i < 2; i++) {
       if ((mainGridTest(mx + pieceSpin.highX[mrot][i], my + pieceSpin.highY[mrot][i]))) {
        isSpin++;
        checkPoints++;
       }
      }
      for (let i = 0; i < 2; i++) {
       if ((mainGridTest(mx + pieceSpin.lowX[mrot][i], my + pieceSpin.lowY[mrot][i]))) {
        isMini++;
        checkPoints++;
       }
      }
      /*if (_kickDistance.y == 2 && (_kickDistance.x == 1 || _kickDistance.x == -1)) {
       isSpin++;
      }/**/
     }


     if (checkPoints > 2) {
      isB2B = true;
     }

     //my += mainCheckDrop(48, mx, my, mt);

     if (!mainCheckAIValidation(0, 0, mt, mx, my) || mainCheckAIValidation(0, 1, mt, mx, my)) glitchCount += 1;


     let isFourTspin = 0,
      foundTLines = 0;
     if (jsobj.preset.enableTspin) {
      let len1 = mt.length,
       len2 = mt[0].length,
       len3 = proi.tPrevent.length,
       len4 = proi.tFulfill.length;
      for (let TX = 0; TX < len1; TX++) {
       for (let TY = 0; TY < len2; TY++) {
        for (var TE = 0; TE < len3 && PIECE !== 6; TE++) {
         if (PIECE !== 6 && mt[TX][TY] > 0 && mt[TX][TY] !== 8 && TX + mx == proi.tPrevent[TE][0] && TY + my == proi.tPrevent[TE][1]) {
          failedTspin++;
         }
        }
        for (var TE = 0; TE < len4 && PIECE == 6; TE++) {
         if (mt[TX][TY] == 8 && TX + mx == proi.tFulfill[TE][0] && TY + my == proi.tFulfill[TE][1]) {
          isFourTspin++;
         }
        }
       }
      }
     }
     if (isFourTspin > 3) failedTspin -= isFourTspin * 2;
     for (var x = 0, len = mt.length; x < len; x++) {
      for (var y = 0, hght = mt[x].length; y < hght; y++) {
       if (mt[x][y]) {


        for (let _q = 0, len = proi.tLines.length; _q < len; _q++) {
         let q = proi.tLines[_q];
         if (q == y + my) foundTLines = 1;
        }
        for (let _q = 0, len = proi.tFulfill.length; _q < len; _q++) {
         let q = proi.tFulfill[_q];
         if (q[0] == x && q[1] == y) foundTLines--;
        }
        mainGrid[x + mx][y + my] = mt[x][y];
       }
      }
     }
     if (mainCheckAIValidation(0, 1, mt, mx, my)) break;


     for (let lineTest = jsobj.hiddenHeight - 1; lineTest < jsobj.height; lineTest++) {
      let count = 0;
      for (let ex = 0; ex < jsobj.width; ex++) {
       if (mainGrid[ex][lineTest] !== 0) count++;
      }
      if (count == jsobj.width) {
       for (let full = lineTest; full >= 18; full--) {
        for (let x = 0; x < jsobj.width; x++) {
         mainGrid[x][full] = mainGrid[x][full - 1];
        };
       };
       linesComplete++;
      }
     };
     if (linesComplete > 0 && isB2B) {
      b2bNew++;
     } else if (linesComplete > 3) {
      b2bNew++;
     } else if (linesComplete > 0) {
      b2bNew = 0;
     }

     //b2bNew = 0;




     let columnHeight = [];
     let aggHeight = 0;
     for (let gx = 0; gx < jsobj.width; gx++) {
      for (let gy = jsobj.hiddenHeight; gy < jsobj.height; gy++) {}
      let r = 0;
      for (; r < jsobj.height && (mainGrid[gx][r] == 0 || typeof mainGrid[gx][r] == "undefined"); r++);
      columnHeight[gx] = jsobj.visibleHeight - r;
     }
     for (let _q = 0, len = columnHeight.length; _q < len; _q++) {
      let value = columnHeight[_q];
      aggHeight += value;
     }

     for (let c = 0, T = columnHeight.length - 1; c < T; c++) {
      bump += Math.abs(columnHeight[c] - columnHeight[c + 1]);
     }

     let bCount = 0,
      availColummForTspin = 1;
     for (let x = 0; x < jsobj.width; x++) {
      let block = false;
      for (let y = jsobj.hiddenHeight; y < (jsobj.height); y++) {
       for (let k of proi.tAvoidColumn)
        if (mainGrid[x][y] && x == k) {
         availColummForTspin = 0;
        }
       if (mainGrid[x][y]) {
        block = true;
       } else if (mainGrid[x][y] == 0 && block) {
        holes++;
       }
      }
      let isHole = false;
      for (let y = (jsobj.height); y >= jsobj.visibleHeight - 1; y--) {
       if (mainGrid[x][y] == 0 || typeof mainGrid[x][y] == "undefined") {
        isHole = true;
       } else if ((mainGrid[x][y] != 0 && isHole || typeof mainGrid[x][y] !== "undefined" && isHole)) {
        bCount++;
       }
      }
     };


     blockade = bCount;
     let failedWide = 0;
     for (let x = 0; x < mt.length; x++) {
      for (let y = 0; y < mt[x].length; y++) {
       if (mx + x > 8) failedWide += jsobj.preset.failedWide;
      }
     };
     let maxHeightReached = true;
     for (let x = 0; x < jsobj.width; x++) {
      for (let y = 0; y < jsobj.height - 14; y++) {
       if (jsobj.grid[x][y]) maxHeightReached = true;
      }
     };
     if (holes > 2) failedWide = 0;
     if (maxHeightReached || jsobj.combo > -1) failedWide = 0;
     let possibleSpin = 0;

     let jtAvoidColumn = [],
      jtFulfill = [],
      jtPrevent = [],
      jtLines = [];
     if (jsobj.preset.enableTspin) {
      /*
          for (let x = 0; x < jsobj.width - 3; x++) {
           for (let y = jsobj.height - 3; y >= jsobj.height - 3 - jsobj.preset.tspinHeight; y--) {
            let tuckToZero = true;
            tSlot = 0,
             tZero = 0,
             tBlock = 0;
             possibleSpin = 0;
            for (let i1 of jsobj.preset.tspinDetector.bottom) {
             if (mainGrid[x + i1[0]][y + i1[1]] !== 0) {
              tBlock++;
              possibleSpin++;
             }
            }
            for (let i1 of jsobj.preset.tspinDetector.tslot) {
             if (mainGrid[x + i1[0]][y + i1[1]] === 0) {
              tSlot++;
             } else {
              if (possibleSpin > 0) possibleSpin--;
             }
            }
            for (let i1 of jsobj.preset.tspinDetector.tuck) {
             if (!tuckToZero) break;
             if (mainGrid[x + i1[0]][y + i1[1]] !== 0 && tuckToZero) {
              tBlock++;
              tuckToZero = false;
              for (let i2 of i1[2]) {
               if (mainGrid[x + i2[0]][y + i2[1]] === 0) {
                tZero++;
               }
              }
             }
            }
            if (tSlot == 4 && tBlock == 3 && tZero == 2) {
             if (moves.length == 0 || PIECE == 6) foundTspin++;
            }

           }
          }/**/


      let isTSlot = false;
      for (let x = 0; x < jsobj.width - 2; x++) {
       for (let y = jsobj.height - 3; y >= jsobj.height - 3 - jsobj.preset.tspinHeight; y--) {
        let v = [],
         f = [],
         w = [],
         g = [],
         tuckToZero = true;
        tSlot = 0,
         tZero = 0,
         tBlock = 0;
        let tPossible = 0;
        if (isTSlot) break;
        for (let i1 of jsobj.preset.tspinDetector.tslot) {
         if (!mainGridTest(x + i1[0], y + i1[1])) {
          tSlot++;
          v.push([x + i1[0], y + i1[1]]);
          f.push([x + i1[0], y + i1[1]]);
          if (w.indexOf(y + i1[1]) === -1) w.push(y + i1[1]);
         }
        }
        for (let i1 of jsobj.preset.tspinDetector.bottom) {
         if (mainGridTest(x + i1[0], y + i1[1])) {
          tBlock++;
          tPossible++;
         }
        }
        for (let i1 of jsobj.preset.tspinDetector.tuck) {
         if (!tuckToZero) break;
         if (mainGridTest(x + i1[0], y + i1[1]) && tuckToZero) {
          tBlock++;
          tuckToZero = false;
          for (let i2 of i1[2]) {
           if (mainGrid[x + i2[0]][y + i2[1]] === 0) {
            tZero++;
            v.push([x + i2[0], y + i2[1]]);
            g.push(x + i2[0]);
           }
          }
         }
        }
        if (tSlot == 4 && tBlock == 3 && tZero == 2) {
         jtPrevent = JSON.parse(JSON.stringify(v));
         jtAvoidColumn = JSON.parse(JSON.stringify(g));
         f.push([x + 1, y]);
         jtFulfill = JSON.parse(JSON.stringify(f));
         jtLines = JSON.parse(JSON.stringify(w));
         isTSlot = true;
         foundTspin++;
        } else {
         possibleSpin = tPossible;
        }

       }
      }

     }

     if (possibleSpin == 1 && foundTspin !== 0) possibleSpin = 0;


     let score = (glitchCount * -837373993939393939) + (possibleSpin * jsobj.preset.heuristicsWeight.possibleSpin) + (b2bNew * jsobj.preset.heuristicsWeight.b2b) + (failedWide * -999) + (aggHeight * (jsobj.preset.heuristicsWeight.aggHeight)) + (linesComplete * (jsobj.preset.heuristicsWeight.lines * (maxHeightReached || jsobj.combo > -1 ? 1 : -1839383883838))) + (bump * (jsobj.preset.heuristicsWeight.bump)) + (holes * (jsobj.preset.heuristicsWeight.holes)) + (blockade * (jsobj.preset.heuristicsWeight.blockade)) + (failedTspin * (jsobj.preset.heuristicsWeight.failedTspin) * 38) + (availColummForTspin * foundTspin * 43835) + (foundTLines * 79);


     /*if (linesComplete == 0 || linesComplete > 0 || (jsobj.piecesCount > 150 && jsobj.combo > -1))*/
     iterations++;
     prediction.push({
      x: mainX,
      mx: mx,
      y: my,

      finalX: mx,
      finalY: my,
      finalRot: mrot,

      rot: mainRot,
      index: prediction.length,
      move: $CLONE(moves),
      score: score,
      
      tlines: jtLines,
      tprev: jtPrevent,
      tavoidcol: jtAvoidColumn,
      tfulfill: jtFulfill
     });

     mainGrid = JSON.parse(JSON.stringify(jsobj.grid));
    };
   }

  }

 };
 let bestIndex = 0,
  bestIndexes = [],
  leastMovements = 99990,
  highestScore = -999999999999;

 for (let evaluate of prediction) {
  if (evaluate.score > highestScore) {
   bestIndexes = [evaluate.index];
   highestScore = evaluate.score;
  } else if (evaluate.score === highestScore) {
   bestIndexes.push(evaluate.index);
  }
 };
 if (bestIndexes.length > 1) {
  for (let e = bestIndexes.length - 1; e >= 0; e--) {
   if (prediction[bestIndexes[e]].move.length < leastMovements) {
    leastMovements = prediction[bestIndexes[e]].move.length;
    bestIndex = bestIndexes[e];
   }
  }
 } else {
  bestIndex = bestIndexes[0];
  
 }
 
 
 
 
 return {
  a: prediction[bedtIndex],
  iterations: iterations
 }
};


function _eval(args) {
 return makeMove(args);
}
