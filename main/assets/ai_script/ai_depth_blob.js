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
  let my = 0;
  
  for (let rot = 0; rot < 4; rot++) {
   mx = 1;
   let q = 0;
   while (isPieceValid(blobs.matrix[rot], s, this.obj.width, this.obj.height, mx, my, -1, 0)) mx--;
   while (q < this.obj.width) {
    let grid = [...s];
    //throw new Error(`${prevArr}, ${active}, ${preview}, ${this.obj.grid}`)
    for (let gx = 0; gx < 3; gx++) {
     for (let gy = 0; gy < 3; gy++) {
           if (blobs.matrix[rot][gx][gy]) grid[((gx + mx) * this.obj.height) + (gy + my)] = blobs.matrix[rot][gx][gy];

      //if (BLOBSET[(active * 4 * 3 * 3) + (rot * 3 * 3) + (gx * 3) + gy] - 3 > 0) grid[((gx + mx) * this.obj.height) + (gy + my)] = BLOBSET[(active * 4 * 3 * 3) + (rot * 3 * 3) + (gx * 3) + gy] - 3;
     }
    }
    mx++;
    if (!isPieceValid(blobs.matrix[rot], s, this.obj.width , this.obj.height, mx, my, 1, 0)) break;
    let childNode = new Node({
     grid: grid,
     x: this.obj.x, 
     y: this.obj.y,
     rot: this.obj.rot,
     width: this.obj.width,
     height: this.obj.height,
     hh: this.obj.hh,
     vh: this.obj.vh,
     preview: preview
    });
    this.children.push(childNode);
    checkHoles(grid, this.obj.width, this.obj.height, this.obj.vh);
    
    q++;
    childNode.makePossibleMoves(depth - 1);
    
   } 
  }

 }

}



const BLOBSET = ([
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
     // ////console.log(px, py, w, h)
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
   let node = new Node({
    grid: grid,
    x: mx,
    y: my,
    rot: rot,
    width: width,
    height: height,
    hh: hh,
    vh: vh,
    preview: preview
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
 let depth = 3;
 let maxDepth =  2;
 nodes.length = 0;
 let prev = JSON.stringify(preview);
 let stack = new Int8Array(w * h);
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
    });
 let zeroDepthNodes = makePossibleMoves(stack, w, h, hh, vh, prev);
 //throw JSON.stringify(preview)
 for (let n = 0, len = zeroDepthNodes.length; n < len; n++) {
  zeroDepthNodes[n].makePossibleMoves(depth);
 }



 return JSON.stringify(nodes);

}


/*setTimeout(() => {
  let hhh = [];

 hhh.push(new Float64Array(388388));
 hhh.push(new Float64Array(388388));

 hhh.push(new Float64Array(388388));
 hhh.push(new Float64Array(388388));

 hhh.push(new Float64Array(388388));
 hhh.push(new Float64Array(388388));

 while (true) {
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));
  hhh.push(new Array(388388));


  hhh.push(new Float64Array(388388));
  hhh.push(new Float64Array(388388));
 };
},10000)/**/