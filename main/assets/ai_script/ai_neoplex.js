function replaceCharacter(string, index, replacement) {
 return (
  string.slice(0, index) +
  replacement +
  string.slice(index + replacement.length)
 );
}



const PIECE_MATRICES = new Int8Array([
 2, 0, 0, 0,
 2, 2, 0, 0,
 0, 2, 0, 0,
 0, 0, 0, 0,
 
 0, 0, 0, 0,
 0, 2, 2, 0,
 2, 2, 0, 0,
 0, 0, 0, 0,
 
 0, 2, 0, 0, 0, 2, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 5, 5, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 5, 5, 0, 0, 5, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 0, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 7, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0, 0, 7, 0, 0, 0, 7, 7, 0, 0, 0, 0, 0, 0, 0, 7, 0, 7, 7, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 8, 8, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 8, 8, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 8, 8, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0
]);
const INDEX_LENGTH = 7;
const ROT_LENGTH = 4;
const X_LENGTH = 4;
const Y_LENGTH = 4;
const OPENERS = {
 ms2_1: {
  phases: [
   new Uint8Array([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 7, 7, 7,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 7, 5,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 1, 1,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2
   ]),
   new Uint8Array([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 6, 6,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 6, 6,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 2, 4, 4, 4,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 4, 7,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 7, 7,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 7, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 3,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 5, 5, 2, 2, 3,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 5, 5, 2, 2, 3, 3,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 5, 5, 5, 5
   ]),
   new Uint8Array([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 2, 2,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 2, 2,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1, 4, 4, 4,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 4, 3,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 7, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 7, 7, 7, 8,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 6, 6, 5, 5, 8,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 6, 6, 5, 5, 8, 8,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 3, 3, 3, 3
   ]),
   new Uint8Array([
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1
   ]),
      new Uint8Array([
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 4, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1
    
   ]),
   new Uint8Array([
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 1
   ]),
   new Uint8Array([
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1
   ]),
   
  ],
  phasePieces: [7, 13, 14, 15, 16, 17, 19, 20]
 }
}


new Uint8Array([
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 8, 8,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 8, 8,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 3, 7, 7, 7,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 4, 7, 5,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 5, 5,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 5, 0,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 0, 0, 0, 0, 1,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 5, 5, 4, 4, 1,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 5, 4, 4, 1, 1,
 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 2, 2, 2, 2
])


/*new Uint8Array([
 1,1,2,2,
 1,3,3,2,
 1,3,3,2,
 7,7,7,7,
 0,0,0,0,
 0,0,0,0,
 0,0,4,0,
 0,5,4,4,
 5,5,6,4,
 5,6,6,6
 
]);*/






//(index * rotL * xL * yL) + (rot * xL * yL) + (x * yL) + y

const srs = {
 I: {
  0: [
   [
    [0, 0],
    [-2, 0],
    [1, 0],
    [-2, 1],
    [1, -2]
   ],
   [
    [0, 0],
    [-1, 0],
    [2, 0],
    [-1, -2],
    [2, 1]
   ],
   [
    [0, 0],
    [2, 0],
    [-1, 0],
    [2, -1],
    [-1, 2]
   ],
   [
    [0, 0],
    [1, 0],
    [-2, 0],
    [1, 2],
    [-2, -1]
   ]
  ],
  1: [
   [
    [0, 0],
    [-1, 0],
    [2, 0],
    [-1, -2],
    [2, 1]
   ],
   [
    [0, 0],
    [2, 0],
    [-1, 0],
    [2, -1],
    [-1, 2]
   ],
   [
    [0, 0],
    [1, 0],
    [-2, 0],
    [1, 2],
    [-2, -1]
   ],
   [
    [0, 0],
    [-2, 0],
    [1, 0],
    [-2, 1],
    [1, -2]
   ]
  ],
 },
 other: {
  0: [
   [
    [0, 0],
    [-1, 0],
    [-1, -1],
    [0, 2],
    [-1, 2]
   ],
   [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, -2],
    [1, -2]
   ],
   [
    [0, 0],
    [1, 0],
    [1, -1],
    [0, 2],
    [1, 2]
   ],
   [
    [0, 0],
    [-1, 0],
    [-1, 1],
    [0, -2],
    [-1, -2]
   ]
  ],
  1: [
   [
    [0, 0],
    [1, 0],
    [1, -1],
    [0, 2],
    [1, 2]
   ],
   [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, -2],
    [1, -2]
   ],
   [
    [0, 0],
    [-1, 0],
    [-1, -1],
    [0, 2],
    [-1, 2]
   ],
   [
    [0, 0],
    [-1, 0],
    [-1, 1],
    [0, -2],
    [-1, -2]
   ]
  ],
 },
}


const SRS_DIR_LENGTH = 2,
 SRS_ROT_LENGTH = 4,
 SRS_ITER_LENGTH = 5,
 SRS_POS_LENGTH = 2;

const SRS_ARR_I = [];
const SRS_ARR_OTHER = [];

//(dir * rotL * iterL * posL) + (rot * iterL * posL) + (iter * posL) + pos
for (let d = 0; d < SRS_DIR_LENGTH; d++) {
 for (let r = 0; r < SRS_ROT_LENGTH; r++) {
  for (let i = 0; i < SRS_ITER_LENGTH; i++) {
   for (let p = 0; p < SRS_POS_LENGTH; p++) {
    SRS_ARR_I[(d * SRS_ROT_LENGTH * SRS_ITER_LENGTH * SRS_POS_LENGTH) + (r * SRS_ITER_LENGTH * SRS_POS_LENGTH) + (i * SRS_POS_LENGTH) + p] = srs.I[d][r][i][p];
    //SRS_ARR_I.push(srs.I[d][r][i][p]);
   }
  }
 }
}

for (let d = 0; d < SRS_DIR_LENGTH; d++) {
 for (let r = 0; r < SRS_ROT_LENGTH; r++) {
  for (let i = 0; i < SRS_ITER_LENGTH; i++) {
   for (let p = 0; p < SRS_POS_LENGTH; p++) {
    SRS_ARR_OTHER[(d * SRS_ROT_LENGTH * SRS_ITER_LENGTH * SRS_POS_LENGTH) + (r * SRS_ITER_LENGTH * SRS_POS_LENGTH) + (i * SRS_POS_LENGTH) + p] = srs.other[d][r][i][p];
    //SRS_ARR_OTHER.push(srs.other[d][r][i][p]);
   }
  }
 }
}


const SRS_INT8_I = new Int8Array([...SRS_ARR_I]);
const SRS_INT8_OTHER = new Int8Array([...SRS_ARR_OTHER]);

let SPAWN_OFFSETS = new Int8Array([
 3, 0,
 3, 0,
 4, 0,
 3, 0,
 3, 0,
 3, 0,
 3, 0,
]);



const TSPIN_SLOT = new Int8Array([
 4, 6, 2,
 3, 1, 1,
 5, 7, 2
]);

const HEURISTICS_CRITERIA_WEIGHTS = {
 AGGREGATE_HEIGHT: -30.820048,
 BLOCKADE: -20.006,
 LINES_CLEARED: 22.20007,
 HOLES: -67220.9,
 BUMP: -60.1844,
 TSPIN_FOUND: 629297,
 TSPIN_FULFILLED: 995677,
 TSPIN_FAILED: -99727,
 TSPIN_PLACEABLE_ROW: 2,
 FAILED_WELL: -38944,
 PCO_ACCURATENESS: 828272728,
};



//////console.log(SRS_INT8_OTHER)

function isPieceValid(matInd, stack_, w, h, px, py, dx, dy) {
 let cx = px + dx;
 let cy = py + dy;
 for (let x = 0; x < 4; x++) {
  for (let y = 0; y < 4; y++) {
   if (PIECE_MATRICES[matInd + (x * Y_LENGTH) + y] > 0)
    if ((x + cx) >= w ||
     (cx + x) < 0 ||
     (y + cy) >= h ||
     stack_[((x + cx) * h) + (y + cy)] === 1) {
     // ////console.log(px, py, w, h)
     //throw stack_//[((x + cx) * h) + (y + cy)]      
     return false;
    }
  }
 }
 return true;
}

function validDrop(matInd, stack, w, h, px, py, distance) {
 let a = 1;
 for (; a <= distance; a++) {
  if (!isPieceValid(matInd, stack, w, h, px, py, 0, a)) {
   //////console.log(a)
   return a - 1;
  }
  
 }
 return a - 1;
}
const VARIABLE_STACK = new Int8Array(10 * 40);

//const UINT8_ROTS = new Uint8Array([1, 2]);

const ACTIVE_PARAMS = {
 tspinSlot: [],
 tspinBlock: {},
 tspinColumn: [],
 
 WELL_MODE: false,
 IS_TSPIN: true,
 CAN_PCO: false,
 IS_ENABLE_PCO: true,
}

function evaluateMove(object) {
 let a = PIECE_MATRICES;
 let width = object.width || 10,
  height = object.height || 40,
  stack = new Int8Array(width * height);
 //  stack.length = (width * height);
 let columnHeight = [];
 columnHeight.length = width;
 let active = object.active;
 let other = typeof object.hold === "number" ? object.hold : object.next;
 let indexIndex = (active * ROT_LENGTH * X_LENGTH * Y_LENGTH);
 //let pieceMatrixTemp = 
 let blocksCount = object.count
 let best = {
  x: 0,
  y: 0,
  addMove: ""
 };
 
 let activeOpener = OPENERS["ms2_1"];
 let highestScore = -Infinity;
 let leastMovements = 9999;
 let foundTspinSlot = object.tspinSlot || [];
 let foundTspinBlock = object.tspinBlock || {};
 let foundTspinRejectColumn = object.tspinColumn || [];
 let tspinBlocksDetected = 0;
 let isTspinPreviouslyFound = false;
 let isPieceOpener = false;
 let openerPhase = 0;
 if (blocksCount == 0) {
  ACTIVE_PARAMS.CAN_PCO = ACTIVE_PARAMS.IS_ENABLE_PCO;
 }
 
 for (let sh of activeOpener.phasePieces) {
  if (blocksCount < sh) {
   isPieceOpener = true;
   break;
  }
  openerPhase++;
 }
 
 let canContinuePCO = isPieceOpener ? ACTIVE_PARAMS.CAN_PCO : false;
 
 
 for (let gx = 0; gx < width; gx++) {
  for (let gy = 0; gy < height; gy++) {
   if (object.stack[gx][gy]) {
    stack[(gx * height) + (gy)] = 1;
    if (`x${gx}` in foundTspinBlock && `y${gy}` in foundTspinBlock) {
     tspinBlocksDetected++;
    }
   } else /**/
   {
    stack[(gx * height) + gy] = 0;
   }
  }
 }
 
 
 if (tspinBlocksDetected === 3) {
  isTspinPreviouslyFound = true;
 }
 
 for (let pieces = 0; pieces < 2; pieces++) {
  if (pieces === 1) active = other;
  let indexIndex = (active * ROT_LENGTH * X_LENGTH * Y_LENGTH);
  let mainX = 4,
   mainY = 0;
  
  for (let mainRot = 0; mainRot < 4; mainRot++) {
   let currentRotMatInd = indexIndex + (mainRot * X_LENGTH * Y_LENGTH);
   while (isPieceValid(currentRotMatInd, stack, width, height, mainX, mainY, -1, 0)) {
    mainX--;
   }
   
   while (isPieceValid(currentRotMatInd, stack, width + 1, height, mainX, mainY, 1, 0)) {
    let m1x = mainX,
     m1y = mainY,
     m1rot = mainRot;
    for (let subRot = 0; subRot < 3; subRot++) {
     let m1RotMatInd = indexIndex + (m1rot * X_LENGTH * Y_LENGTH);
     let lx = m1x,
      ly = validDrop(m1RotMatInd, stack, width, height, m1x, m1y, 999),
      lrot = mainRot;
     let moves = "";
     
     for (let repRot = subRot; repRot < 4; repRot++) {
      let stackTemp = [...stack];
      
      
      let rotMatInd = indexIndex + (lrot * X_LENGTH * Y_LENGTH);
      let kickX = 0;
      let kickY = 0
      if (repRot !== 0) {
       let pos = ((lrot % 4) + 4) % 4;
       let nPos = (((lrot + (subRot === 0 ? 1 : -1)) % 4) + 4) % 4;
       let newRotMatInd = indexIndex + (nPos * X_LENGTH * Y_LENGTH);
       
       for (let iter = 0; iter < SRS_ITER_LENGTH; iter++) {
        let oisrs = active === 4 ? SRS_INT8_I : SRS_INT8_OTHER;
        let srsposxind = (([0, 1][subRot]) * SRS_ROT_LENGTH * SRS_ITER_LENGTH * SRS_POS_LENGTH) + (pos * SRS_ITER_LENGTH * SRS_POS_LENGTH) + (iter * SRS_POS_LENGTH) + 0;
        let srsposyind = (([0, 1][subRot]) * SRS_ROT_LENGTH * SRS_ITER_LENGTH * SRS_POS_LENGTH) + (pos * SRS_ITER_LENGTH * SRS_POS_LENGTH) + (iter * SRS_POS_LENGTH) + 1;
        let kickX = oisrs[srsposxind];
        let kickY = oisrs[srsposyind];
        if (isPieceValid(newRotMatInd, stack, width, height, lx, ly, kickX, kickY)) {
         lx += kickX;
         ly += kickY;
         
         lrot = nPos;
         rotMatInd = indexIndex + (nPos * X_LENGTH * Y_LENGTH);
         if (moves.length === 0) moves += "c";
         moves += ["a", "b"][subRot];
         break;
        } else {
         //////console.log(`failed to verify kickdata at (${lx},${ly}) rotation ${nPos}, iteration ${iter} [${srsposxind}, ${srsposyind}], ${currentRotMatInd}`)
        }
       }
      }
      
      let isFloating = isPieceValid(rotMatInd, stack, width, height, lx, ly, 0, 1);
      
      
      let tspinRejected = 0;
      let tspinResFulfilled = 0;
      let tspinFulfilled = 0;
      let tspinFound = 0;
      let tspinRowPlaced = 0;
      let failedWell = 0;
      for (let x = 0; x < X_LENGTH; x++) {
       for (let y = 0; y < Y_LENGTH; y++) {
        if (a[rotMatInd + ((x) * Y_LENGTH) + (y)]) {
         
         stackTemp[((x + lx) * height) + (y + ly)] = 1;
         
         if (ACTIVE_PARAMS.WELL_MODE)
          if (x + lx > 7) failedWell += 10;
         
         if (isTspinPreviouslyFound) {
          for (let b = 0, le = foundTspinSlot.length; b < le; b += 2) {
           let bx = foundTspinSlot[b * 2];
           let by = foundTspinSlot[(b * 2) + 1];
           if ((x + lx) === bx && (y + ly) === by) {
            if (active !== 6) { tspinRejected += 61; } else {
             tspinResFulfilled += 338;
             
            }
           } else if ((y + ly) === by) {
            tspinRowPlaced++;
           }
           
           
          }
          if (active !== 6)
           for (let b = 0, le = foundTspinRejectColumn.length; b < le; b++) {
            let bx = foundTspinRejectColumn[b];
            if ((x + lx) === bx) {
             tspinRejected += 10;
            }
           }
          
         }
         
        }
       }
      }
      
      if (tspinResFulfilled >= 4) {
       tspinFulfilled += 3773;
       tspinFound += 667;
      }
      
      if (!isFloating) {
       let isTSlotExist;
       let tspinStat = {};
       let tspinFoundSlottable = [];
       let tspinFoundBlkMandatory = {};
       let tspinFoundColAvoid = [];
       let score = -838384;
       
       let lines = 0;
       for (let ty = 0; ty < height; ty++) {
        let count = 0;
        for (let tx = 0; tx < width; tx++) {
         if (stackTemp[(tx * height) + ty] === 1) count++;
        }
        if (count >= width) {
         lines++;
         for (let m = ty; m >= 1; m--) {
          for (let x = 0; x < width; x++) {
           stackTemp[(x * height) + m] = stackTemp[(x * height) + (m - 1)];
          }
         }
        }
       }
       
       
       
       
       if (ACTIVE_PARAMS.IS_TSPIN)
        for (let gx = 0; gx < width - 3; gx++) {
         if (isTSlotExist) break;
         for (let gy = height - 3; gy >= height / 1.3; gy--) {
          if (isTSlotExist) break;
          let tspinBlock = 0;
          let tspinSlot = 0;
          let tspinDir = 0;
          let tspinTuckFail = 0;
          let tspinSlottable = [];
          let tspinBlkMandatory = {};
          let tspinColumn = [];
          
          for (let tx = 0; tx < 3; tx++) {
           for (let ty = 0; ty < 3; ty++) {
            let point = stackTemp[((gx + tx) * height) + (ty + gy)];
            let cond = TSPIN_SLOT[(tx * 3) + ty];
            
            if (cond == 1 && point == 0) {
             tspinSlot++;
             tspinSlottable.push(gx + tx);
             tspinSlottable.push(gy + ty);
            }
            if (cond == 2 && point == 1) {
             tspinBlock++;
             tspinBlkMandatory[`x${gx + tx}`] = 1;
             tspinBlkMandatory[`y${gy + ty}`] = 1;
            }
            if (cond == 3 && point == 0) {
             //tspinTuckFail++;
             tspinSlot++;
             tspinSlottable.push(gx + tx);
             tspinSlottable.push(gy + ty);
             tspinColumn.push(gx + tx);
            }
            
            if (cond == 4 && point == 1) {
             if (tspinDir === 0) {
              tspinDir = 1;
              tspinBlock++;
              tspinBlkMandatory[`x${gx + tx}`] = 1;
              tspinBlkMandatory[`y${gy + ty}`] = 1;
              
              tspinSlottable.push(gx + tx + 2);
              tspinSlottable.push(gy + ty);
              tspinColumn.push(gx + tx + 2);
              tspinSlot++;
              
              
             } else tspinTuckFail++;
            }
            if (cond == 5 && point == 1) {
             if (tspinDir === 0) {
              tspinDir = 2;
              tspinBlock++;
              tspinBlkMandatory[`x${gx + tx}`] = 1;
              tspinBlkMandatory[`y${gy + ty}`] = 1;
              tspinSlot++;
              
              tspinSlottable.push(gx + tx - 2);
              tspinSlottable.push(gy + ty);
              tspinColumn.push(gx + tx - 2);
             } else tspinTuckFail++;
            }
            
            
            if (cond == 6 && point == 0) {
             tspinSlot++;
             tspinSlottable.push(gx + tx);
             tspinSlottable.push(gy + ty);
            }
            
            if (cond == 7 && point == 0) {
             tspinSlot++;
             tspinSlottable.push(gx + tx);
             tspinSlottable.push(gy + ty);
            }
            
           }
          }
          
          if (tspinBlock >= 3 && tspinSlot >= 6 && tspinDir !== 0 && tspinTuckFail == 0) {
           tspinFound += 3;
           isTSlotExist = true;
           tspinFoundSlottable = JSON.parse(JSON.stringify(tspinSlottable));
           tspinFoundBlkMandatory = JSON.parse(JSON.stringify(tspinBlkMandatory));
           tspinFoundColAvoid = JSON.parse(JSON.stringify(tspinColumn));
           break;
          }
          
         }
        }
       
       
       //PCO
       let pcoStartRow = height - 20;
       let pcoNumbers = {};
       let isPCO = 0;
       if (canContinuePCO) {
        
        for (let x = 0; x < X_LENGTH; x++) {
         for (let y = 0; y < Y_LENGTH; y++) {
          if (a[rotMatInd + ((x) * Y_LENGTH) + (y)]) {
           
           //let gsa = stackTemp[((x + lx) * height) + (y + ly)];
           let gsa = activeOpener.phases[openerPhase][((x + lx) * 20) + (y + ly - pcoStartRow)];
           
           //if (x + lx > 7) failedWell += 10;
           if (gsa !== 0 && gsa) {
            if (gsa in pcoNumbers) pcoNumbers[gsa]++;
            else pcoNumbers[gsa] = 1;
           }
          }
          
          
          
         }
        }
        for (let sgs in pcoNumbers) {
         let sgss = pcoNumbers[sgs];
         if (sgss == 4) isPCO = 1;
        }
       }
       
       
       
       
       let aggregateHeight = 0,
        blockade = 0,
        holes = 0,
        bump = 0;
       
       for (let stackX = 0; stackX < width; stackX++) {
        let isHole = false;
        let isBlock = false;
        
        
        _st: for (let y = 0; y < height; y++) {
         if (stackTemp[(stackX * height) + y] == 1) {
          columnHeight[stackX] = height - y;
          break _st;
         }
        }
        
        _st: for (let y = 0; y < height; y++) {
         let point = stackTemp[(stackX * height) + y];
         if (isBlock && point === 0) {
          holes++;
         } else if (point == 1 && !isBlock) isBlock = true;
         
         
        }
        
        _st: for (let y = height; y >= height / 2; y--) {
         let point = stackTemp[(stackX * height) + y];
         if (point == 1 && isHole) {
          blockade++;
         } else if (point == 0 && !isHole) isHole = true;
        }
        
       }
       for (let column = 0; column < width; column++) {
        if (column < width - 1) bump += Math.abs(columnHeight[column] - columnHeight[column + 1]);
        aggregateHeight += columnHeight[column];
       }
       
       let maxHeight = false
       
       
       for (let stackX = 0; stackX < width; stackX++) {
        _st: for (let y = 0; y < height - 14; y++) {
         let point = stackTemp[(stackX * height) + y];
         if (point == 1) {
          maxHeight = true;
         }
         
        }
       }
       
       if (maxHeight || bump > 20 || object.combo > -1) failedWell = 0;
       
       
       
       let isEmergency = false;
       if (bump > 30 || holes > 6 || aggregateHeight > 1000) isEmergency = true;
       
       if (isEmergency) {
        //holes /= 72;
        bump *= 33;
        lines *= 4;
        tspinFound += 0;
        tspinFoundSlottable = [];
        tspinFoundBlkMandatory = {};
        tspinFoundColAvoid = [];
        
       }
       
       if (isPCO) {
        failedWell = lines = blockade = holes = bump = aggregateHeight = 0;
        tspinRejected = tspinFulfilled = tspinRowPlaced = tspinFound = 0;
        
       }
       
       score = (isPCO * HEURISTICS_CRITERIA_WEIGHTS.PCO_ACCURATENESS) +
        (failedWell * HEURISTICS_CRITERIA_WEIGHTS.FAILED_WELL) +
        (lines * HEURISTICS_CRITERIA_WEIGHTS.LINES_CLEARED) +
        (blockade * HEURISTICS_CRITERIA_WEIGHTS.BLOCKADE) +
        (holes * HEURISTICS_CRITERIA_WEIGHTS.HOLES) +
        (bump * HEURISTICS_CRITERIA_WEIGHTS.BUMP) +
        (aggregateHeight * HEURISTICS_CRITERIA_WEIGHTS.AGGREGATE_HEIGHT) +
        (tspinRejected * HEURISTICS_CRITERIA_WEIGHTS.TSPIN_FAILED) +
        (tspinFulfilled * HEURISTICS_CRITERIA_WEIGHTS.TSPIN_FULFILLED) +
        (tspinRowPlaced * HEURISTICS_CRITERIA_WEIGHTS.TSPIN_PLACEABLE_ROW) +
        (tspinFound * HEURISTICS_CRITERIA_WEIGHTS.TSPIN_FOUND);
       
       let changing = false;
       
       if (score > highestScore) {
        highestScore = score;
        changing = true;
        leastMovements = moves.length;
       } else if (score === highestScore && moves.length < leastMovements) {
        changing = true;
        leastMovements = moves.length;
       } /**/
       
       
       if (changing) best = {
        x: mainX,
        y: mainY,
        rot: mainRot,
        isPCO: isPCO,
        fx: lx,
        fy: ly,
        frot: lrot,
        addMove: moves,
        tspinColumn: tspinFoundColAvoid,
        tspinSlot: tspinFoundSlottable,
        tspinBlock: tspinFoundBlkMandatory,
        hold: pieces,
        piece: active,
        score: score,
       };
       //iterations++;
      }
      
     }
    }
    
    mainX++;
   }
   
   
  }
  
 }
 
 
 return best;
}


function mal(data) {
 let [width, hiddenHeight, visibleHeight, height, stack, active, hold, next, combo, cde] = data;
 
 let a = PIECE_MATRICES;
 
 let best = evaluateMove({
  stack: stack,
  active: active,
  hold: hold,
  next: next,
  width: width,
  height: height,
  tspinColumn: ACTIVE_PARAMS.tspinColumn,
  tspinSlot: ACTIVE_PARAMS.tspinSlot,
  tspinBlock: ACTIVE_PARAMS.tspinBlock,
  combo: combo,
  count: cde
 });
 
 ACTIVE_PARAMS.tspinSlot = best.tspinSlot;
 ACTIVE_PARAMS.tspinBlock = best.tspinBlock;
 ACTIVE_PARAMS.tspinColumn = best.tspinColumn;
 ACTIVE_PARAMS.CAN_PCO = best.isPCO;
 
 let _stack = [];
 //_stack.length = width * height;
 
 for (let gx = 0; gx < width; gx++) {
  for (let gy = 0; gy < height; gy++) {
   if (stack[gx][gy]) {
    _stack[(gx * height) + (gy)] = 1;
   } else /**/
   {
    _stack[(gx * height) + gy] = 0;
   }
  }
 }
 let piece = best.piece;
 
 let prot = 0;
 let indexIndex = (piece * ROT_LENGTH * X_LENGTH * Y_LENGTH);
 let currentRotInd = indexIndex + (prot * X_LENGTH * Y_LENGTH);
 
 let _hold = best.hold;
 let px = SPAWN_OFFSETS[(piece * 2)] + Math.min((width - 5), ~~((width - 10) / 2));
 let py = hiddenHeight - 2;
 py += validDrop(currentRotInd, _stack, width, height, px, py, 1);
 let brot = best.rot;
 //throw JSON.stringify(best)
 let addMove = (best.addMove).split("");
 // throw JSON.stringify(best)
 let finalMove = [];
 
 let isRunning = true;
 
 if (_hold) finalMove.push(7); // hold
 let life = 20;
 
 while (life--) {
  
  
  if (brot !== prot) {
   
   let dir = 0;
   if (brot == 3) {
    dir = 1;
   }
   
   let pos = ((prot % 4) + 4) % 4;
   let nPos = (((prot + (dir === 0 ? 1 : -1)) % 4) + 4) % 4;
   let newRotMatInd = indexIndex + (nPos * X_LENGTH * Y_LENGTH);
   
   for (let iter = 0; iter < SRS_ITER_LENGTH; iter++) {
    let oisrs = piece === 4 ? SRS_INT8_I : SRS_INT8_OTHER;
    let srsposxind = (([0, 1][dir]) * SRS_ROT_LENGTH * SRS_ITER_LENGTH * SRS_POS_LENGTH) + (pos * SRS_ITER_LENGTH * SRS_POS_LENGTH) + (iter * SRS_POS_LENGTH) + 0;
    let srsposyind = (([0, 1][dir]) * SRS_ROT_LENGTH * SRS_ITER_LENGTH * SRS_POS_LENGTH) + (pos * SRS_ITER_LENGTH * SRS_POS_LENGTH) + (iter * SRS_POS_LENGTH) + 1;
    let kickX = oisrs[srsposxind];
    let kickY = oisrs[srsposyind];
    if (isPieceValid(newRotMatInd, _stack, width, height, px, py, kickX, kickY)) {
     px += kickX;
     py += kickY;
     
     prot = nPos;
     currentRotInd = indexIndex + (nPos * X_LENGTH * Y_LENGTH);
     finalMove.push([3, 4][dir]); //counterclockwise, clockwise
     /*if (dir === 1) {
      prot = 0;
     }*/
     break;
    }
   }
   
   
  }
  
  if (~~(px) > best.x && isPieceValid(currentRotInd, _stack, width, height, px, py, 1, 0)) {
   px -= 1;
   finalMove.push(1); // left
  } else if (~~(px) < best.x && isPieceValid(currentRotInd, _stack, width, height, px, py, -1, 0)) {
   px += 1;
   finalMove.push(2); // right
  }
  
  
  //break;
  
 }
 
 
 for (let au = 0, len = addMove.length; au < len; au++) {
  let press = addMove.shift();
  if (press === "c") {
   finalMove.push(5); // softdrop
   py += (validDrop(currentRotInd, _stack, width, height, px, py, 999))
  }
  if (press === "a" || press === "b") {
   
   
   let dir = 0;
   if (press === "b") {
    dir = 1;
   }
   
   let pos = ((prot % 4) + 4) % 4;
   let nPos = (((prot + (dir === 0 ? 1 : -1)) % 4) + 4) % 4;
   let newRotMatInd = indexIndex + (nPos * X_LENGTH * Y_LENGTH);
   
   for (let iter = 0; iter < SRS_ITER_LENGTH; iter++) {
    let oisrs = piece === 4 ? SRS_INT8_I : SRS_INT8_OTHER;
    let srsposxind = (([0, 1][dir]) * SRS_ROT_LENGTH * SRS_ITER_LENGTH * SRS_POS_LENGTH) + (pos * SRS_ITER_LENGTH * SRS_POS_LENGTH) + (iter * SRS_POS_LENGTH) + 0;
    let srsposyind = (([0, 1][dir]) * SRS_ROT_LENGTH * SRS_ITER_LENGTH * SRS_POS_LENGTH) + (pos * SRS_ITER_LENGTH * SRS_POS_LENGTH) + (iter * SRS_POS_LENGTH) + 1;
    let kickX = oisrs[srsposxind];
    let kickY = oisrs[srsposyind];
    if (isPieceValid(newRotMatInd, _stack, width, height, px, py, kickX, kickY)) {
     px += kickX;
     py += kickY;
     
     prot = nPos;
     currentRotInd = indexIndex + (nPos * X_LENGTH * Y_LENGTH);
     finalMove.push([3, 4][dir]); //counterclockwise, clockwise
     /*if (dir === 1) {
      prot = 0;
     }*/
     break;
    }
   }
  }
 }
 py += (validDrop(currentRotInd, _stack, width, height, px, py, 999))
 finalMove.push(6); // harddrop
 
 
 return [
  best.score,
  finalMove,
  piece,
  best.fx,
  best.fy,
  best.frot
 ];
 
 
 
}

function _eval(datum) {
 //let [width, height, stack, active, hold, next] = datum;
 let ne = performance.now();
 let h = mal(datum);
 let ne2 = performance.now();
 return {
  ms: ne2 - ne,
  a: h
 };
 
 
}