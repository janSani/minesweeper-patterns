function shuffle(array) {
    let i = array.length,
        j,
        temp;
    while (--i > 0) {
        j = Math.floor(Math.random() * (i + 1));
        [array[i],array[j]] = [array[j],array[i]];
    }
}

const beginner8x8Size = [8,8,10];
const beginner9x9Size = [9,9,10];
const intermediateSize = [16,16,40];
const expertSize = [30,16,99];

function makeBoard(size){
    let flat = new Array(size[2]).fill(1).concat(Array(size[0]*size[1]-size[2]).fill(0));
    shuffle(flat);
    let board = [];
    for (let i = 0; i<size[1];i++){
        board.push(flat.slice(size[1]*i,size[1]*i+size[0]));
    }
    return board;
}

function makePatternStringLists(board){
    let nRows = board.length;
    let nCols = board[0].length;
    let extendedBoard = [Array(nCols+2).fill(0)];
    board.forEach(row => {
        extendedBoard.push([0].concat(row.concat([0])));
    });
    extendedBoard.push(Array(nCols+2).fill(0));
    let fullBoardPatterns = [];
    let emptyCellPatterns = [];
    let nonBoundaryPatterns = [];
    let nonBoundaryEmptyCellPatterns = [];

    for (let i=1; i<=nRows; i++){
        for (let j=1; j<=nCols; j++){
            let cellPattern = '';
            cellPattern += extendedBoard[i-1][j-1];
            cellPattern += extendedBoard[i-1][j];
            cellPattern += extendedBoard[i-1][j+1];
            cellPattern += extendedBoard[i][j+1];
            cellPattern += extendedBoard[i+1][j+1];
            cellPattern += extendedBoard[i+1][j];
            cellPattern += extendedBoard[i+1][j-1];
            cellPattern += extendedBoard[i][j-1];
            fullBoardPatterns.push(cellPattern);
            if (extendedBoard[i][j] == 0) emptyCellPatterns.push(cellPattern);
            if (1<i&&i<nRows&&1<j&&j<nCols) nonBoundaryPatterns.push(cellPattern);
            if (1<i&&i<nRows&&1<j&&j<nCols&&extendedBoard[i][j] == 0) nonBoundaryEmptyCellPatterns.push(cellPattern);
        }
    }
    return [fullBoardPatterns,emptyCellPatterns,nonBoundaryPatterns,nonBoundaryEmptyCellPatterns];
}

function countPatterns(patternList) {
    let patternCount = new Object()
    patternList.forEach(pattern => {
        let patternString = pattern;
        countCode:{
            for (let i=0;i<4;i++){
                for (const [key, value] of Object.entries(Patterns)) {
                    if (value[0].includes(patternString)) {
                        if(Object.hasOwn(patternCount,key)) patternCount[key] += 1;
                        else patternCount[key] = 1;
                        break countCode;
                    }
                } 
                patternString = patternString.slice(2) + patternString.slice(0,2);
            }
        }
    });
    return patternCount;
}

function mergeObjects (a, b) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    const result = {};

    keys.forEach(key => {
        result[key] = (a[key] || 0) + (b[key] || 0);
    });

    return result;
};

function simulateBoards(size, count){
    let patternCounts = new Array(4).fill(new Object());
    patternCounts.forEach(list => {
        list.totalCells = 0;
    });

    for (let i=0;i<count;i++){
        let patternStringLists = makePatternStringLists(makeBoard(size));
        for (let j = 0; j < 4; j++) {
            patternCounts[j] = mergeObjects(patternCounts[j],countPatterns(patternStringLists[j]));
            patternCounts[j].totalCells += patternStringLists[j].length;
        }
    }

    return patternCounts.concat(count);
}

function joinSimulations(a, b){
    return a.slice(0,4).map((num,i) => mergeObjects(num,b.slice(0,4)[i])).concat(a[4]+b[4]);
}
// function repeatTask() {
//   total = joinSimulations(simulateBoards(beginner9x9Size,4000),total)
//   if (total[4]<6500000) {
//     setTimeout(repeatTask(), 1000);
//   } else {
//     console.log("Stopped.");
//   }
// }
