function _eval(datum) {
 //let [width, height, stack, active, hold, next] = datum;
 let ne = performance.now();
 let h = make(datum);
 let ne2 = performance.now();
 return {
  ms: `${ne2 - ne} milliseconds taken`,
  a: h
 };
}

//==========================

class Node {
 constructor(obj) {
  this.children = [];
  this.obj = obj;
  nodes.push(this.obj);
 }
 makePossibleMoves(depth) {
  /*let stack = new Int8Array(width, height);*/
  if (depth <= 0) return;
  let s = this.obj.grid;
  let prevArr = JSON.parse(this.obj.preview);
  let active = prevArr.shift();
  let preview = JSON.stringify(prevArr);
  let blobs = setBlob(active.type, active.color1, active.color2);
  let possibleMoves = [];
  let mx = 1;
  let my = 3;
  
  for (let rot = 0; rot < 4; rot++) {
   mx = 1;
   let q = 0;
   while (isPieceValid(blobs.matrix[rot], s, this.obj.width, this.obj.height, mx, my, -1, 0)) mx--;
   while (q < 6) {
    let grid = {...s};
    //throw new Error(`${prevArr}, ${active}, ${preview}, ${this.obj.grid}`)
    for (let gx = 0; gx < 3; gx++) {
     for (let gy = 0; gy < 3; gy++) {
           if (blobs.matrix[rot][gx][gy]) grid[((gx + mx) * this.obj.height) + (gy + my)] = blobs.matrix[rot][gx][gy];

      //if (BLOBSET[(active * 4 * 3 * 3) + (rot * 3 * 3) + (gx * 3) + gy] - 3 > 0) grid[((gx + mx) * this.obj.height) + (gy + my)] = BLOBSET[(active * 4 * 3 * 3) + (rot * 3 * 3) + (gx * 3) + gy] - 3;
     }
    }
    
    let score = evaluateChainScore([
     grid,
     this.obj.width,
     this.obj.height,
     this.obj.hh,
     this.obj.vh,
    ]);
    
    let childNode = new Node({
     grid: score.grid,
     x: this.obj.x, 
     y: this.obj.y,
     rot: this.obj.rot,
     width: this.obj.width,
     height: this.obj.height,
     hh: this.obj.hh,
     vh: this.obj.vh,
     preview: preview,
     score: score.a
    });
    this.children.push(childNode);
    checkHoles(grid, this.obj.width, this.obj.height, this.obj.vh);
    mx++;
    q++;
    childNode.makePossibleMoves(depth - 1);
    if (!isPieceValid(blobs.matrix[rot], s, this.obj.width , this.obj.height, mx, my, 1, 0)) break;
   } 
  }

 }

}



const BLOBSET = new Int8Array([
 0, 0, 0, 
 4, 4, 0, 
 0, 0, 0, 
 
 0, 0, 0,
 0, 4, 0, 
 0, 4, 0, 
 
 0, 0, 0, 
 0, 4, 4, 
 0, 0, 0, 
 
 0, 4, 0, 
 0, 4, 0, 
 0, 0, 0, 
 
 0, 0, 0, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 4, 0, 0, 0, 0, 0, 5, 4, 0, 0, 0, 0, 4, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 4, 6, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 4, 0, 0, 0, 0, 0, 6, 4, 0, 0, 0, 0, 4, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 4, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 4, 0, 0, 0, 0, 0, 7, 4, 0, 0, 0, 0, 4, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 4, 8, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 4, 0, 0, 0, 0, 0, 8, 4, 0, 0, 0, 0, 4, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 5, 0, 0, 0, 0, 0, 4, 5, 0, 0, 0, 0, 5, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 5, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 0, 5, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 5, 0, 0, 0, 0, 0, 6, 5, 0, 0, 0, 0, 5, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 5, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 5, 0, 0, 0, 0, 0, 7, 5, 0, 0, 0, 0, 5, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 5, 8, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 5, 0, 0, 0, 0, 0, 8, 5, 0, 0, 0, 0, 5, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 6, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 6, 0, 0, 0, 0, 0, 4, 6, 0, 0, 0, 0, 6, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 6, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 6, 0, 0, 0, 0, 0, 5, 6, 0, 0, 0, 0, 6, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 6, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 6, 0, 0, 0, 0, 0, 7, 6, 0, 0, 0, 0, 6, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 6, 8, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 6, 0, 0, 0, 0, 0, 8, 6, 0, 0, 0, 0, 6, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 7, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 7, 0, 0, 0, 0, 0, 4, 7, 0, 0, 0, 0, 7, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 7, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 7, 0, 0, 0, 0, 0, 5, 7, 0, 0, 0, 0, 7, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 7, 6, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 7, 0, 0, 0, 0, 0, 6, 7, 0, 0, 0, 0, 7, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 7, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 7, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 7, 8, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 7, 0, 0, 0, 0, 0, 8, 7, 0, 0, 0, 0, 7, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 8, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 8, 0, 0, 0, 0, 0, 4, 8, 0, 0, 0, 0, 8, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 8, 5, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 8, 0, 0, 0, 0, 0, 5, 8, 0, 0, 0, 0, 8, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 8, 6, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 8, 0, 0, 0, 0, 0, 6, 8, 0, 0, 0, 0, 8, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 8, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 8, 0, 0, 0, 0, 0, 7, 8, 0, 0, 0, 0, 8, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 8, 0, 0, 0, 0, 0, 8, 8, 0, 0, 0, 0, 8, 0, 0, 8, 0, 0, 0, 0]);
const BLOBLENGTH = 25;

const nodes = [];
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
    return r - 1;
   }
  }
  //////console.log(`DROP: ${r - 1}`)
  return r - 1;
 },
 checkHoles = function(grid, width, height, vh) {
  let checked = true;
  for (let t = 0; t < 20 && checked; t++)
   for (var y = height - 1; y >= height - vh - 1; y--) {
    for (var x = 0; x < width; x++) {
     checked = true;
     if (!testSpace(grid, x, y - 1, width, height)) {
      continue
     }
     if (!testSpace(grid, x, y, width, height)) {
      
      grid[(x * height) + y] = grid[(x * height) + (y - 1)];
      grid[(x * height) + (y - 1)] = 0;
      checked = false;
     }
    }
   }
 };

function isPieceValid(active, stack_, w, h, px, py, dx, dy) {
 let cx = px + dx;
 let cy = py + dy;
 for (let x = 0; x < 3; x++) {
  for (let y = 0; y < 3; y++) {
   if (active[x][y])//BLOBSET[(active * 4 * 3 * 3) + (matInd * 3 * 3) + (x * 3) + y] - 3 > 0)
    if ((x + cx) > w ||
     (cx + x) < 0 ||
     (y + cy) >= h ||
     stack_[((x + cx) * h) + (y + cy)] > 0) {
     ////////console.log(px, py, w, h)
     //throw stack_//[((x + cx) * h) + (y + cy)] 
     return false;
    }
  }
 }
 return true;
}
 
 

function makePossibleMoves(s, width, height, hh, vh, prev) {
 /*let stack = new Int8Array(width, height);*/
 let prevArr = JSON.parse(prev);
 let active = prevArr.shift();
 let preview = JSON.stringify(prevArr);
 let blobs = setBlob(active.type, active.color1, active.color2);
 let possibleMoves = [];
 let mx = 3;
 let my = hh - 2;
 //throw height
 for (let rot = 0; rot < 4; rot++) {
  mx = 1;
  let q = 0;
  while (isPieceValid(blobs.matrix[rot], s, width, height, mx, my, -1, 0)) mx--;
  while (q < 16) {
   let grid = [...s];
   for (let gx = 0; gx < 3; gx++) {
    for (let gty = 0; gty < 3; gty++) {
     if (blobs.matrix[rot][gx][gty]) grid[((gx + mx) * height) + (gty + my)] = blobs.matrix[rot][gx][gty];
     //if (BLOBSET[(active * 4 * 3 * 3) + (rot * 3 * 3) + (gx * 3) + gty] - 3 > 0) grid[((gx + mx) * height) + (gty + my)] = BLOBSET[(active * 4 * 3 * 3) + (rot * 3 * 3) + (gx * 3) + gty] - 3;
    }
   }
   
   let score = evaluateChainScore([
     grid,
     width,
     height,
     hh,
     vh,
    ]);
   let node = new Node({
    grid: score.grid,
    x: mx,
    y: my,
    rot: rot,
    width: width,
    height: height,
    hh: hh,
    vh: vh,
    preview: preview,
    score: score.a
   });
   possibleMoves.push(node);
   checkHoles(grid, width, height, vh);
   mx++;
   q++
   if (!isPieceValid(blobs.matrix[rot], s, width, height, mx, my, 1, 0)) break;
  }
 }
 return possibleMoves;
}

function setBlob(type, color1, color2) {
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


  return ({
   index: "",
   matrix: ma,
   color1: c,
   color2: d,
   rot: c,
   type: type,
   sx: 3,
   sy: 0,
   kickTable: {
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
  });



 }

function make(data) {
 let [sm, preview, w, h, hh, vh] = data;
 let mn = [];
 let depth = 1;
 let maxDepth = 0;
 nodes.length = 0;
 
 let prev = JSON.stringify(preview);
 
 let stack = []; stack.length = (w * h);
 for (let x = 0; x < w; x++) {
  for (let y = 0; y < h; y++) {
   stack[(x * h) + y] = sm[x][y];
  }
 }
 nodes.push({
     grid: stack,
     x: 0, 
     y: 0,
     rot: 0,
    width: w,
     height: h,
     hh: hh,
     vh: vh,     
     score: Math.random() * -282882
    });
 let zeroDepthNodes = makePossibleMoves(stack, w, h, hh, vh, prev);
 //throw JSON.stringify(preview)
 for (let n = 0, len = zeroDepthNodes.length; n < len; n++) {
  zeroDepthNodes[n].makePossibleMoves(depth);
 }
 
 let best = {x: 0, y: 0, rot: 0}
 let highScore = -Infinity;
 for (let g of nodes) {
  if (g.score > highScore) {highScore = g.score; best = g}
 }

 return best;

}




const direction = [[0, 1], [1, 0], [0, -1], [-1, 0]];




const NUISANCE = 6,
 HARD = 87;
let evaluateChainScore;
{

function evaluateChain(data) {
 let [stack, w, h, hh, vh] = data;
 let width = w,
  height = h,
  hiddenHeight = hh,
  visibleHeight = vh

 let grid = JSON.parse(JSON.stringify(stack)),
  connected = 0,
  vertical = 0,
  horizontal = 0,
  diagLeft = 0,
  diagRight = 0,
  onePoints = 0;
  //throw grid
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
     if (chain == 0) {

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
  /*for (var x = 0; x < width; x++) {
   for (var y = hiddenHeight - 1; y < height; y++) {
    //if (chain == 0 && x === tx && y === ty && (grid[y + (x * height)] == tc || grid[y + (x * height)] === 0)) isTriggerNot = true;
   }
  }*/
  
 //isExact = (/*x === data[7] && y === data[8]/**/(grid[(tx*height) + ty] == tc || grid[(tx*height) + ty] == 0)) ? 41 : 0;

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

 let score = (chain * 3838383838370.3) + (nuisance * -30.2) + (colored * -.3) + (connected * 44769) + ((vertical + horizontal) * 0) + ((diagLeft + diagRight) * -0);
 return {
  a: score,
  grid: grid
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


evaluateChainScore = evaluateChain;

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



/*function _eval(datum) {
 //let [width, height, stack, active, hold, next] = datum;
//////console.log(datum)
 let u = datum[0];
 let h = evaluateNodes(u, datum[1], datum[2]);
 return h;
}*/
}
