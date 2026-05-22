let names = [];
let orderKeys = [];

Object.entries(Patterns).forEach(([key,value])=>{
    names.push(key + ": " + value[1]);
    orderKeys.push(key);
});
names = [names[0]].concat(names.slice(2)).concat(names[1]);
orderKeys = [orderKeys[0]].concat(orderKeys.slice(2)).concat(orderKeys[1]);
names.push("Total Cells");
orderKeys.push("totalCells");

function formatResults(resultsToParse, condition){
    //GENERAL TABLE
    let generalResults = new Array();
    generalResults.push(["Pattern","Count","Frequency","Pattern","Count","Frequency"]);
    let totalCells = resultsToParse[condition].totalCells;
    for (let i=0;i<26;i++){
        generalResults.push([names[i],
        resultsToParse?.[condition]?.[orderKeys[i]] ?? 0,
        (100*(resultsToParse?.[condition]?.[orderKeys[i]] ?? 0)/totalCells).toFixed(6)+"%",
        names[26+i],
        resultsToParse?.[condition]?.[orderKeys[26+i]] ?? 0,
        (100*(resultsToParse?.[condition]?.[orderKeys[26+i]] ?? 0)/totalCells).toFixed(6)+"%"]);
    }

    //NUMBER DETAIL TABLE
    let detailResults = new Array(9).fill([]);

    let patternsPerNumber = [1,2,6,10,13,10,6,2,1];
    let cellsPerNumber = [];
    let cpnSum = 0;
    patternsPerNumber.forEach((count,index)=>{
        let sum = 0;
        for(let i=cpnSum;i<cpnSum+count;i++){
            detailResults[index] = detailResults[index].concat([[names[i],
                resultsToParse?.[condition]?.[orderKeys[i]] ?? 0,
                resultsToParse?.[condition]?.[orderKeys[i]] ?? 0]]);
            sum += resultsToParse?.[condition]?.[orderKeys[i]] ?? 0;
        }
        detailResults[index] = detailResults[index].concat([["Total cells",sum,sum]]);
        detailResults[index].forEach((row,rowIndex)=>{
            detailResults[index][rowIndex][2] = (100*detailResults[index][rowIndex][2]/sum).toFixed(6)+"%"
        });
        detailResults[index] = [["Pattern","Count","Frequency"]].concat(detailResults[index]);
        cellsPerNumber.push([sum,(100*sum/totalCells).toFixed(4)+"%"]);
        cpnSum += count;
    });

    return [generalResults, cellsPerNumber, detailResults];
}

let detailSelIndexStored = 0;

function makeResultsTable(boardSel,conditionSel){
    let results;
    switch (boardSel){
        case 'beginner8x8': results = beginner8x8Results; break;
        case 'beginner9x9': results = beginner9x9Results; break;
        case 'intermediate': results = intermediateResults; break;
        case 'expert': results = expertResults; break;
    }
    let condition = 0;
    switch (conditionSel){
        case 'fullBoard': condition = 0; break;
        case 'emptyCells': condition = 1; break;
        case 'nonBoundary': condition = 2; break;
        case 'nonBoundaryEmpty': condition = 3; break;
    }
    let tableData = formatResults(results,condition)[0];

    //GENERAL TABLE
    let table = document.createElement("table");
    let headerRow = document.createElement("tr");
    tableData[0].forEach(element=>{
        let th = document.createElement("th");
        th.textContent = element;
        headerRow.appendChild(th)
    });
    table.appendChild(headerRow);

    tableData.slice(1).forEach(dataRow=>{
        let tr = document.createElement("tr");
        dataRow.forEach(cell=>{
            let td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        })
        table.appendChild(tr);
    });
    
    table.id = "resultsTable";
    document.getElementById("resultsTable").replaceWith(table);
    
    //DETAIL TABLE SELECTOR
    let detailSelData = formatResults(results,condition)[1];
    let detailTableCont = document.getElementById("detailTableContainer");

    let detailSel = document.createElement("select");
    detailSel.id = "detailSel";
    detailSel.name = "detailSel";
    detailSelData.forEach((row,index)=>{
        let option = document.createElement("option");
        option.value = index;
        option.textContent = index + " - Count: "+row[0]+" ("+row[1]+")";
        detailSel.appendChild(option);
    });
    detailSel.selectedIndex = detailSelIndexStored;
    detailSel.addEventListener('change',()=>{
        makeDetailTable(results,condition,detailSel.value);
        detailSelIndexStored = detailSel.value;
    });

    document.getElementById("detailSel").replaceWith(detailSel);
    
    makeDetailTable(results,condition,detailSel.value);
}

function makeDetailTable(results, condition, number){
    let detailData = formatResults(results,condition)[2][number];

    let table = document.createElement("table");
    let headerRow = document.createElement("tr");
    detailData[0].forEach(element=>{
        let th = document.createElement("th");
        th.textContent = element;
        headerRow.appendChild(th)
    });
    table.appendChild(headerRow);

    detailData.slice(1).forEach(dataRow=>{
        let tr = document.createElement("tr");
        dataRow.forEach(cell=>{
            let td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        })
        table.appendChild(tr);
    });
    
    table.id = "detailTable";
    document.getElementById("detailTable").replaceWith(table);
}

let resultsShown = false;

document.getElementById("resultsBtn").addEventListener('click',()=>{
    if(!resultsShown){
        let boardSel = document.getElementById("boardSel").value;
        let conditionSel = document.getElementById("conditionSel").value;
        makeResultsTable(boardSel, conditionSel);
        document.getElementById("detailTableSettings").removeAttribute("hidden");
        document.getElementById("resultsBtn").textContent = "Hide results";
        resultsShown = true;
    } else {
        document.getElementById("resultsTable").replaceChildren();
        document.getElementById("detailTable").replaceChildren();
        document.getElementById("detailTableSettings").setAttribute("hidden","");
        document.getElementById("resultsBtn").textContent = "Show me some results";
        resultsShown = false;
    }
});

function updateResults() {
    let boardSel = document.getElementById("boardSel").value;
    let conditionSel = document.getElementById("conditionSel").value;
    if(resultsShown) makeResultsTable(boardSel, conditionSel);
}
document.getElementById("boardSel").addEventListener('change',updateResults);
document.getElementById("conditionSel").addEventListener('change',updateResults);

//INTERACTIVE BOARD RESULTS TABLE
let intDetailSelIndexStored = 0;

function makeIntResultsTable(results, conditionSel, tableSel){
    let condition = 0;
    let showGeneralTable = true;
    let showDetailTable = true;
    switch (conditionSel){
        case 'fullBoard': condition = 0; break;
        case 'emptyCells': condition = 1; break;
        case 'nonBoundary': condition = 2; break;
        case 'nonBoundaryEmpty': condition = 3; break;
    }
    switch (tableSel){
        case 'onlyGeneral': showDetailTable = false; break;
        case 'onlyDetail': showGeneralTable = false; break;
    }
    let tableData = formatResults(results,condition)[0];
    
    //GENERAL TABLE
    if(showGeneralTable){
        let table = document.createElement("table");
        let headerRow = document.createElement("tr");
        tableData[0].forEach(element=>{
            let th = document.createElement("th");
            th.textContent = element;
            headerRow.appendChild(th)
        });
        table.appendChild(headerRow);

        tableData.slice(1).forEach(dataRow=>{
            let tr = document.createElement("tr");
            dataRow.forEach(cell=>{
                let td = document.createElement("td");
                td.textContent = cell;
                tr.appendChild(td);
            })
            table.appendChild(tr);
    });
    
    table.id = "intResultsTable";
    document.getElementById("intResultsTable").replaceWith(table);
    } else {
        document.getElementById("intResultsTable").replaceChildren();
    }
    
    //DETAIL TABLE SELECTOR
    if(showDetailTable){
        let detailSelData = formatResults(results,condition)[1];
        let detailTableCont = document.getElementById("intDetailTableContainer");

        let detailSel = document.createElement("select");
        detailSel.id = "intDetailSel";
        detailSel.name = "intDetailSel";
        detailSelData.forEach((row,index)=>{
            let option = document.createElement("option");
            option.value = index;
            option.textContent = index + " - Count: "+row[0]+" ("+row[1]+")";
            detailSel.appendChild(option);
        });
        detailSel.selectedIndex = intDetailSelIndexStored;
        detailSel.addEventListener('change',()=>{
            makeIntDetailTable(results,condition,detailSel.value);
            intDetailSelIndexStored = detailSel.value;
        });
        detailSel.addEventListener('focusin',()=>{
            simulationPaused = true;
        });
        detailSel.addEventListener('focusout',()=>{
            simulationPaused = false;
        })

        document.getElementById("intDetailTableSettings").removeAttribute("hidden");
        document.getElementById("intDetailSel").replaceWith(detailSel);
    
    makeIntDetailTable(results,condition,intDetailSel.value);
    } else {
        document.getElementById("intDetailTable").replaceChildren();
        document.getElementById("intDetailTableSettings").setAttribute("hidden","");
    }
    
}

function makeIntDetailTable(results, condition, number) {
    let detailData = formatResults(results,condition)[2][number];

    let table = document.createElement("table");
    let headerRow = document.createElement("tr");
    detailData[0].forEach(element=>{
        let th = document.createElement("th");
        th.textContent = element;
        headerRow.appendChild(th)
    });
    table.appendChild(headerRow);

    detailData.slice(1).forEach(dataRow=>{
        let tr = document.createElement("tr");
        dataRow.forEach(cell=>{
            let td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        })
        table.appendChild(tr);
    });
    
    table.id = "intDetailTable";
    document.getElementById("intDetailTable").replaceWith(table);
}

let intResultsShown = false;

document.getElementById("intResultsBtn").addEventListener('click',()=>{
    if(!intResultsShown){
        let intConditionSel = document.getElementById("intConditionSel").value;
        let intTableSel = document.getElementById("intTableSel").value;
        document.getElementById("intResultsTableContainer").removeAttribute("hidden");
        document.getElementById("intResultsBtn").textContent = "Hide results";
        makeIntResultsTable(intResultsToShow, intConditionSel, intTableSel);
        intResultsShown = true;
    } else {
        document.getElementById("intResultsTableContainer").setAttribute("hidden","");
        document.getElementById("intResultsBtn").textContent = "Show me some results";
        intResultsShown = false;
    }
});

function updateIntResults(){
    let conditionSel = document.getElementById("intConditionSel").value;
    let tableSel = document.getElementById("intTableSel").value;
    intResultsToShow = document.getElementById("showAccumulated").checked ? accumulatedResults:currentResults;
    if(intResultsShown) makeIntResultsTable(intResultsToShow, conditionSel, tableSel);
}
document.getElementById("intConditionSel").addEventListener('change',updateIntResults);
document.getElementById("intTableSel").addEventListener('change',updateIntResults);
document.getElementById("showAccumulated").addEventListener('change',updateIntResults);