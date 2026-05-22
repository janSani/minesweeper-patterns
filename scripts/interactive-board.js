let intBoardSel = document.getElementById("intBoardSel");
let intBoardWidth = document.getElementById("intBoardWidth");
let intBoardHeight = document.getElementById("intBoardHeight");
let intBoardMines = document.getElementById("intBoardMines");

intBoardSel.addEventListener('change',()=>{
    let size = [+intBoardWidth.value,+intBoardHeight.value,+intBoardMines.value];
    intBoardWidth.setAttribute("disabled","");
    intBoardHeight.setAttribute("disabled","");
    intBoardMines.setAttribute("disabled","");
    switch(intBoardSel.value){
        case "beginner8x8": size = beginner8x8Size; break;
        case "beginner9x9": size = beginner9x9Size; break;
        case "intermediate": size = intermediateSize; break;
        case "expert": size = expertSize; break;
        case "custom":
            intBoardWidth.removeAttribute("disabled");
            intBoardHeight.removeAttribute("disabled");
            intBoardMines.removeAttribute("disabled");
        break;
    }

    intBoardWidth.value = size[0];
    intBoardHeight.value = size[1];
    intBoardMines.value = size[2];

    document.getElementById("makeIntBoardBtn").classList.add("highlighted");
});

[intBoardWidth,intBoardHeight,intBoardMines].forEach(elem=>{
    elem.addEventListener('change',()=>{
        if (+intBoardWidth.value * +intBoardHeight.value < +intBoardMines.value){
            intBoardMines.value = +intBoardWidth.value * +intBoardHeight.value;
        }
        document.getElementById("makeIntBoardBtn").classList.add("highlighted");
    });
})

let intMode = document.getElementById("intMode");
let currentResults;
let accumulatedResults = new Array(4).fill(new Object()).concat(0);
let intResultsToShow;
let currentSize;
let interactiveBoard;

function makeInteractiveBoard(){
    document.getElementById("hideIntBoardBtn").removeAttribute("hidden");
    if(intMode.value=="generate"){
        interactiveBoard = makeBoard(currentSize);
        currentResults = countPatterns(interactiveBoard);
        accumulatedResults = joinCounts(accumulatedResults,currentResults);

        document.getElementById("intBoardGenSettings").removeAttribute("hidden");
        document.getElementById("intBoardResultSettings").removeAttribute("hidden");
        document.getElementById("showAccumulated").removeAttribute("hidden");
        document.getElementById("showAccumulated").setAttribute("checked","");
        document.getElementById("accumulateLabel").removeAttribute("hidden");
        document.getElementById("intGenPauseWarning").removeAttribute("hidden");
        document.getElementById("intBoardDrawSettings").setAttribute("hidden","");
        
        updateIntBoard();
    } else {
        simulationStarted = false;
        simulationPaused = false;
        document.getElementById("startSimulationBtn").textContent = "Start";
        document.getElementById("intBoardDrawSettings").removeAttribute("hidden");
        document.getElementById("intBoardResultSettings").removeAttribute("hidden");
        document.getElementById("showAccumulated").setAttribute("hidden","");
        document.getElementById("showAccumulated").removeAttribute("checked","");
        document.getElementById("accumulateLabel").setAttribute("hidden","");
        document.getElementById("intBoardGenSettings").setAttribute("hidden","");
        document.getElementById("intGenPauseWarning").setAttribute("hidden","");

        interactiveBoard = Array.from({length: currentSize[1]},()=>Array(currentSize[0]).fill(0));
        currentResults = countPatterns(interactiveBoard);
        updateIntBoard();
    }
}

function updateIntBoard(){
    updateIntResults();
    document.getElementById("boardsGeneratedInd").innerText = "Boards generated so far: "+intResultsToShow[4];
    let table = document.createElement("table");
        interactiveBoard.forEach((boardRow,i) => {
            let tableRow = document.createElement("tr");
            boardRow.forEach((boardCell,j) => {
                let tableCell = document.createElement("td");
                if (boardCell == 1) tableCell.classList.add("active");

                let cellPattern = '';
                cellPattern += interactiveBoard?.[i-1]?.[j-1] ?? "0";
                cellPattern += interactiveBoard?.[i-1]?.[j] ?? "0";
                cellPattern += interactiveBoard?.[i-1]?.[j+1] ?? "0";
                cellPattern += interactiveBoard?.[i]?.[j+1] ?? "0";
                cellPattern += interactiveBoard?.[i+1]?.[j+1] ?? "0";
                cellPattern += interactiveBoard?.[i+1]?.[j] ?? "0";
                cellPattern += interactiveBoard?.[i+1]?.[j-1] ?? "0";
                cellPattern += interactiveBoard?.[i]?.[j-1] ??"0";

                tableCell.textContent = identifyPattern(cellPattern);
                tableCell.addEventListener('click',()=>{
                    tableCell.classList.toggle("active");
                    intToggleCell(i,j);
                });
                tableRow.appendChild(tableCell);
            });
            table.appendChild(tableRow);
        });
        table.id = "intBoard";
        document.getElementById("intBoard").replaceWith(table);
}

function intToggleCell(i,j){
    interactiveBoard[i][j] =  interactiveBoard[i][j] == 0 ? 1 : 0;
    currentResults = countPatterns(interactiveBoard);
    updateIntBoard();
}

function intInvertAllCells(){
    interactiveBoard.forEach((row,rowInd)=>{
        row.forEach((cell,cellInd)=>{
            interactiveBoard[rowInd][cellInd] =  interactiveBoard[rowInd][cellInd] == 0 ? 1 : 0;
        })
    })
    currentResults = countPatterns(interactiveBoard);
    updateIntBoard();
}

function intRandomizeCells(){
    interactiveBoard = makeBoard(currentSize);
    currentResults = countPatterns(interactiveBoard);
    updateIntBoard();
}

document.getElementById("makeIntBoardBtn").addEventListener('click',()=>{
    simulationStarted = false;
    document.getElementById("startSimulationBtn").textContent = "Start";
    accumulatedResults = new Array(4).fill(new Object()).concat(0);
    currentSize = [+intBoardWidth.value,+intBoardHeight.value,+intBoardMines.value];
    document.getElementById("makeIntBoardBtn").classList.remove("highlighted");
    makeInteractiveBoard();
});

document.getElementById("stepSimulationBtn").addEventListener('click',()=>{
    simulationStarted = false;
    document.getElementById("startSimulationBtn").textContent = "Start";
    makeInteractiveBoard();
})

let simulationStarted = false;
let simulationPaused = false;
function simulationLoop(){
    if (simulationStarted) {
        if(!simulationPaused && intMode.value == "generate")makeInteractiveBoard();
        setTimeout(simulationLoop,25);
    }
}

document.getElementById("startSimulationBtn").addEventListener('click',()=>{
    if(simulationStarted){
        simulationStarted = false;
        document.getElementById("startSimulationBtn").textContent = "Start";
    } else {
        simulationStarted = true;
        document.getElementById("startSimulationBtn").textContent = "Stop";
        setTimeout(simulationLoop,25);
    }
});

intMode.addEventListener('change',()=>{
    if (intMode.value == 'generate'){
        document.getElementById("intBoardDrawClearBtn").setAttribute("disabled","");
        document.getElementById("intBoardDrawInvertBtn").setAttribute("disabled","");
        document.getElementById("intBoardDrawRandomBtn").setAttribute("disabled","");
        document.getElementById("startSimulationBtn").removeAttribute("disabled");
        document.getElementById("stepSimulationBtn").removeAttribute("disabled");
    } else {
        document.getElementById("startSimulationBtn").setAttribute("disabled","");
        document.getElementById("stepSimulationBtn").setAttribute("disabled","");
        document.getElementById("intBoardDrawClearBtn").removeAttribute("disabled");
        document.getElementById("intBoardDrawInvertBtn").removeAttribute("disabled");
        document.getElementById("intBoardDrawRandomBtn").removeAttribute("disabled");
    }
    document.getElementById("makeIntBoardBtn").classList.add("highlighted");
})

document.getElementById("intBoardDrawClearBtn").addEventListener('click',makeInteractiveBoard);
document.getElementById("intBoardDrawInvertBtn").addEventListener('click',intInvertAllCells);
document.getElementById("intBoardDrawRandomBtn").addEventListener('click',intRandomizeCells);

function hideIntBoard(){
    simulationStarted = false;
    document.getElementById("startSimulationBtn").textContent = "Start";
    document.getElementById("intBoardGenSettings").setAttribute("hidden","");
    document.getElementById("intBoardResultSettings").setAttribute("hidden","");
    document.getElementById("intBoardDrawSettings").setAttribute("hidden","");
    document.getElementById("hideIntBoardBtn").setAttribute("hidden","");
    document.getElementById("intBoard").replaceChildren();
    document.getElementById("intResultsTable").replaceChildren();
    document.getElementById("intDetailTable").replaceChildren();
    document.getElementById("intDetailTableSettings").setAttribute("hidden","");
    document.getElementById("makeIntBoardBtn").classList.remove("highlighted");
}

document.getElementById("hideIntBoardBtn").addEventListener('click',hideIntBoard);