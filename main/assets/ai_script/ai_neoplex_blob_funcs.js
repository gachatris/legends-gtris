const direction = [[0, 1], [1, 0], [0, -1], [-1, 0]];

let testSpace = function(grid, x, y, width, height) {
  if (x < 0 || x >= width) {
   return true;
  }
  if (y < height) {
   if (typeof grid[(x * height) + y] !== "undefined" && grid[(x * height) + y] !== 0) {
    return true;
   }
   return false;
  }
  return true;
 },
 //holes = [],
 checkDrop = function(grid, x, y, i, width, height) {
  var r = 0;
  for (; r < i; r++) {
   if (testSpace(grid, x, y + r, width, height)) {
    return r - 1
   }
  }
  //////console.log(`DROP: ${r - 1}`)
  return r - 1
 },
 checkHoles = function(grid, width, height) {
  let checked = true;
  for (let t = 0; t < 20 && checked; t++)
   for (var y = height - 1; y >= -1; y--) {
    for (var x = 0; x < width; x++) {
     checked = true;
     if (!testSpace(grid, x, y - 1, width, height)) {
      continue
     }
     if (!testSpace(grid, x, y, width, height)) {
      grid[(x * height) + y] = grid[(x * height) + (y - 1)]
      grid[(x * height) + y] = 0;
      checked = false;
     }
    }
   }
 };



const NUISANCE = 6,
 HARD = 1;


function evaluateChainScore(data) {
 let [stack, w, h, hh, vh, tx, ty, tc] = data;
 let width = w,
  height = h,
  hiddenHeight = hh,
  visibleHeight = vh

 let grid = stack,
  connected = 0,
  vertical = 0,
  horizontal = 0,
  diagLeft = 0,
  diagRight = 0,
  onePoints = 0;
 let chain = 0;
 let isExact = 0;
 let eraseInfo = [];
 let erasedBlocks = [];
 let check = () => {
  let isExistForChain = false;
  const eraseColor = {},
   sqi = [],
   sequenceNuisanceInfo = [];
  eraseInfo.length = 0;
  erasedBlocks.length = 0;
  const existingBlubList = [],
   checkBlubOrigin = (x, y) => {
    const origin = grid[(x * height) + y];
    if (!(origin !== 0 && typeof origin !== "undefined" && origin !== null && origin !== NUISANCE) || y < hiddenHeight) {
     return;
    };

    sqi.push({
     x: x,
     y: y,
     cell: grid[(x * height) + y]
    });
    grid[(x * height) + y] = 0;


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
     const dCell = grid[(dX * height) + dY];
     if (!(dCell !== 0 && typeof dCell !== "undefined" && dCell !== null && dCell !== NUISANCE) || dCell !== origin) {
      continue;
     };
     if (chain == 0 || true) {

     if (direction[iteration][0] == 1 || direction[iteration][0] == -1) horizontal++;
     if (direction[iteration][1] == 1 || direction[iteration][1] == -1) vertical++;

     if (direction[iteration][0] == 1 && (direction[iteration][1] == 1 || direction[iteration][1] == -1)/**/) diagRight++;
     if (direction[iteration][0] == -1 && (direction[iteration][1] == 1 || direction[iteration][1] == -1)/**/) diagLeft++;
     connected += 4839;
     }

     checkBlubOrigin(dX, dY);
    };
   },
   checkNuisanceOrigin = (x, y) => {
    const origin = grid[(x * height) + y];

    //grid[(x * height) + y] = 0;


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
     const dCell = grid[(dX * height) + dY];
     if (!(dCell !== 0 && typeof dCell !== "undefined" && dCell !== null || dCell !== HARD)) {
      continue;
     };
     if (grid[(dX * height) + dY] == NUISANCE) sequenceNuisanceInfo.push({
      x: dX,
      y: dY,
      cell: grid[(x * height) + y]
     });
    };
   }
  for (var x = 0; x < width; x++) {
   for (var y = hiddenHeight - 1; y < height; y++) {
    sqi.length = 0; //reset sequence arr
    sequenceNuisanceInfo.length = 0;

    const BlubCol = grid[(x * height) + y];
    checkBlubOrigin(x, y);
    if (sqi.length == 0 || sqi.length < 4) {
     if (sqi.length > 0) {
      existingBlubList.push(...sqi);
     }
    } else {
     eraseColor[BlubCol] = true;
     eraseInfo.push(...sqi);
    }
    for (const e of existingBlubList) {
     grid[(e.x * height) + e.y]= e.cell
    }

    if (eraseInfo.length > 0) {
     isExistForChain = true;
     for (const isNuisance of eraseInfo) {
      checkNuisanceOrigin(isNuisance.x, isNuisance.y);
     }
     for (const e of sequenceNuisanceInfo) {
      grid[(e.x * height) + e.y]= 0;
     }
     //console.table(eraseInfo)
     erasedBlocks.push({
      x: x,
      y: y,
      cell: BlubCol
     });
     continue;
    }
   }
  }
  for (let o of eraseInfo) erasedBlocks.push(o);
  if (isExistForChain) {
   chain++;
  }
 };
 let testSpace = function(x, y) {
   if (x < 0 || x >= width) {
    return true;
   }
   if (y < height) {
    if (typeof grid[(x * height) + y] !== "undefined" && grid[(x * height) + y] !== 0) {
     return true;
    }
    return false;
   }
   return true;
  },
  //holes = [],
  /*checkDrop = function(x, y, i) {
   var r = 0;
   for (; r < i; r++) {
    if (testSpace(x, y + r)) {
     return r - 1
    }
   }
   //////console.log(`DROP: ${r - 1}`)
   return r - 1
  },/**/
  checkHoles = function() {
   let checked = true;
   for (let t = 0; t < height && checked; t++)
    for (var y = height - 1; y >= hiddenHeight - 2; y--) {
     for (var x = 0; x < width; x++) {
      checked = true;
      if (!testSpace(x, y - 1)) {
       continue
      }
      if (!testSpace(x, y)) {
       grid[(x * height) + y] = grid[(x * height) + y - 1];
       grid[(x * height) + y - 1] = 0;
       checked = false;
      }
     }
    }
  },
  isFinished = false;
  let isTriggerNot = false;
  for (var x = 0; x < width; x++) {
   for (var y = hiddenHeight - 1; y < height; y++) {
    if (chain == 0 && x === tx && y === ty && (grid[y + (x * height)] == tc || grid[y + (x * height)] === 0)) isTriggerNot = true;
   }
  }
  
 isExact = (/*x === data[7] && y === data[8]/**/(grid[(tx*height) + ty] == tc || grid[(tx*height) + ty] == 0)) ? 41 : 0;

 while (true) {
  checkHoles();
  check();
  if (eraseInfo.length == 0) break;

 };
 let colored = 0,
  nuisance = 0;
 for (let x = 0, l = width; x < l; x++) {
  for (let y = hiddenHeight, w = height; y < w; y++) {
   if (grid[(x * height) + y] > 0) {
    if (grid[(x * height) + y] !== NUISANCE && chain == 0) {
     colored++;
     //if (rotations == 0 && x > this.width / 2 && moves > this.width - 5) isNohoho++;
    }
    if (grid[(x * height) + y] == NUISANCE && chain == 0) nuisance++;
   }
  }
 }

 let forecastedChain = chain;
 /*if (chain) {
  vertical = 488333;
  horizontal = 488484;
  diagLeft = 83839383939;
  diagRight = 9448494849;
 }
 if (!isTriggerNot) {
  chain = -3837388393833838833838833;

  vertical -= 488333;
  horizontal -= 488484;
  diagLeft -= 83839383939;
  diagRight -= 9448494849;
 }//**/

 let score = (Math.random() * 48) + (isExact * 300) + (chain * 3838383838370.3) + (nuisance * -3.2) + (colored * -40.3) + (connected * 44769) + ((vertical + horizontal) * 4949994747474439) + ((diagLeft + diagRight) * -0);
 return {
  a: score,
  isValid: isTriggerNot
 };
};

function checkTrigger(stack, w, hh, vh) {
 let width = w,
  height = hh+ vh,
  hiddenHeight = hh,
  visibleHeight = vh;
  
  let el = [];
  for (let x = 0; x < width; x++) {
   el[x] = [];
   for (let y = 0; y < height; y++) {
    el[x][y] = stack[(x* height) + y];
   }
  }

 let origGrid = JSON.parse(JSON.stringify(el));

 let grid = JSON.parse(JSON.stringify(el));

 /*for (let x = 0; x < 6; x++) {
  for (let y = 0; y < 13; y++) {
   if (origGrid[x][y] > 15)
    origGrid[x][y] += 0;
  }
 }*/

 let chain = 0;

 let eraseInfo = [];
 let erasedBlocks = [];
 let check = () => {
  let isExistForChain = false;
  const eraseColor = {},
   sqi = [],
   sequenceNuisanceInfo = [];
  eraseInfo.length = 0;
  erasedBlocks.length = 0;
  const existingBlubList = [],
   checkBlubOrigin = (x, y) => {
    const origin = grid[x][y];
    if (!(origin !== 0 && typeof origin !== "undefined" && origin !== null && origin !== NUISANCE) || y < hiddenHeight) {
     return;
    };

    sqi.push({
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
      continue;
     };
     checkBlubOrigin(dX, dY);
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
     if (!(dCell !== 0 && typeof dCell !== "undefined" && dCell !== null || dCell !== NUISANCE)) {
      continue;
     };
     if (grid[dX][dY] == NUISANCE) sequenceNuisanceInfo.push({
      x: dX,
      y: dY,
      cell: grid[x][y]
     });
    };
   }
  let ac = true;
  for (var x = 0; x < width; x++) {
   for (var y = hiddenHeight - 1; y < height; y++) {
    if (grid[x][y]) ac = false;
    sqi.length = 0; //reset sequence arr
    sequenceNuisanceInfo.length = 0;
    const BlubCol = grid[x][y];
    checkBlubOrigin(x, y);
    if (sqi.length == 0 || sqi.length < (chain > 0 ? 4 : 1)) {
     if (sqi.length > 0) {
      existingBlubList.push(...sqi);
     }
    } else {
     eraseColor[BlubCol] = true;
     eraseInfo.push(...sqi);
    }
    for (const e of existingBlubList) {
     grid[e.x][e.y] = e.cell
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
      cell: BlubCol
     });
     continue
    }
   }
  }
  for (let o of eraseInfo) erasedBlocks.push(o);
  if (isExistForChain) {
   chain++;
  } else {
   return ac;
  };
  return false;
 };
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
  //holes = [],
  /*checkDrop = function(x, y, i) {
   var r = 0;
   for (; r < i; r++) {
    if (testSpace(x, y + r)) {
     return r - 1
    }
   }
   ////////console.log(`DROP: ${r - 1}`)
   return r - 1
  },/**/
  checkHoles = function() {
   let checked = true;
   for (let t = 0; t < height && checked; t++)
    for (let y = height - 1; y >= -1; y--) {
     for (let x = 0; x < width; x++) {
      checked = true;
      if (!testSpace(x, y - 1)) {
       continue
      }
      if (!testSpace(x, y)) {
       grid[x][y] = grid[x][y - 1];
       grid[x][y - 1] = 0;
       checked = false;
      }
     }
    }
  },
   checkDropSpecific = function(dis, x, y) {
  let a = 0;
  while (!testSpace(x, y + a) && dis >= a) {
   a++;
  }
  ////////console.log(a)
  return a - 1;
 }

  isFinished = false,
  highChain = 0,
  isScore = 0;
 let colorHigh = 0;
 let isAC = false;
 let cell = {x: 0, y: 0, c: 0};
 for (let mx = 0; mx < width; mx++) {
  for (let colTest = 1; colTest <= 5; colTest++) {
   chain = 0;
   let ms = 0;
   let my = checkDropSpecific(93939, mx, 0);
   grid = JSON.parse(JSON.stringify(origGrid));
   grid[mx][0] = colTest;
   let allClear = false;
   while (true) {
    checkHoles();
    if (check()) allClear = true;

    if (eraseInfo.length == 0) break;
    else ms++;

   };
   if (allClear) ms += 0.5;
   if (ms > isScore) {
    isScore = ms;
    highChain = chain;
    colorHigh = colTest;
    isAC = allClear;
    cell.x = mx;
    cell.y = my;
    cell.c = colTest;
   }

  }
 }
 return cell;

}




function evaluateNodes(arr, x, rot) {
    let best = {},
    highScore = -Infinity;
    let trigger = checkTrigger(arr[0].grid, arr[0].width, arr[0].hh, arr[0].vh);
   let lengthNode = arr.length,
    evaledNodes = 0;
   for (let g = 0, d = arr.length; g < d; g++) {
    let test = arr[g];
   
  let score = evaluateChainScore([test.grid, test.width, test.height, test.hh, test.vh, x, rot, test.x, test.rot, trigger.x, trigger.y, trigger.c]);
   if (score.isValid) continue;
    if (score.a > highScore) {
     best = test;
     highScore = score.a;
    }
    evaledNodes++;
    //if (score.chain) return test;

    if (evaledNodes == lengthNode) {
     return best;
    };
   }
}

function _eval(datum) {
 //let [width, height, stack, active, hold, next] = datum;
 let u = JSON.parse(datum[0]);
 let h = evaluateNodes(u, datum[1], datum[2]);
 return h;
}