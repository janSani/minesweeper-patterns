let names = [];
let orderKeys = [];
    Object.entries(Patterns).forEach(([key,value])=>{
        names.push(key + " - " + value[1]);
        orderKeys.push(key);
    });
    names = [names[0]].concat(names.slice(2)).concat(names[1]);
    orderKeys = [orderKeys[0]].concat(orderKeys.slice(2)).concat(orderKeys[1]);
    names.push("Total Cells");
    orderKeys.push("totalCells");

function makeResultsTable(){
    let tableContainer = document.getElementById("resultsTableContainer") 
    let boardSel = document.getElementById("boardSel").value;
    let conditionSel = document.getElementById("conditionSel").value;

    let results = [];
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
    
    let table = document.createElement("table");
    let headerRow = document.createElement("tr");
    ["Pattern","Count","Frequency","Pattern","Count","Frequency"].forEach((element)=>{
        let th = document.createElement("th");
        th.textContent = element;
        headerRow.appendChild(th)
    });
    table.appendChild(headerRow);

    let totalCells = results[condition].totalCells;
    for (let i=0;i<26;i++){
        let tableRow = document.createElement("tr");

        let td1 = document.createElement("td");
        td1.textContent =  names[i];
        tableRow.appendChild(td1);

        let td2 = document.createElement("td");
        td2.textContent = results[condition][orderKeys[i]];
        tableRow.appendChild(td2);

        let td3 = document.createElement("td");
        td3.textContent = (100*results[condition][orderKeys[i]]/totalCells).toFixed(6)+"%";
        tableRow.appendChild(td3);

        let td4 = document.createElement("td");
        td4.textContent =  names[26+i];
        tableRow.appendChild(td4);

        let td5 = document.createElement("td");
        td5.textContent = results[condition][orderKeys[26+i]];
        tableRow.appendChild(td5);

        let td6 = document.createElement("td");
        td6.textContent = (100*results[condition][orderKeys[26+i]]/totalCells).toFixed(6)+"%";
        tableRow.appendChild(td6);

        table.appendChild(tableRow);
    }

    table.id = "resultsTable";
    document.getElementById("resultsTable").replaceWith(table);

    let numTableTitle = document.getElementById("numTableTitle");
    numTableTitle.textContent = "Count and frequency of each number";
    
    let numTable = document.createElement("table");
    let headerRow2 = document.createElement("tr");
    ["Number","Count","Frequency","Number","Count","Frequency"].forEach((element)=>{
        let th = document.createElement("th");
        th.textContent = element;
        headerRow2.appendChild(th)
    });
    numTable.appendChild(headerRow2);

    let patternsPerNumber = [1,2,6,10,13,10,6,2,1];
    let cellsPerNumber = [];
    let cpnSum = 0;
    patternsPerNumber.forEach(count=>{
        let sum = 0;
        for(let i=cpnSum;i<cpnSum+count;i++){
            sum += results[condition][orderKeys[i]]
        }
        cellsPerNumber.push(sum);
        cpnSum += count;
    });
    cellsPerNumber.push(totalCells);

    for (let i=0;i<5;i++){
        let tableRow = document.createElement("tr");

        let td1 = document.createElement("td");
        td1.textContent =  i;
        tableRow.appendChild(td1);

        let td2 = document.createElement("td");
        td2.textContent = cellsPerNumber[i];
        tableRow.appendChild(td2);

        let td3 = document.createElement("td");
        td3.textContent = (100*cellsPerNumber[i]/totalCells).toFixed(6)+"%";
        tableRow.appendChild(td3);

        let td4 = document.createElement("td");
        td4.textContent =  (5+i == 9) ? "Total Cells" : 5+i;
        tableRow.appendChild(td4);

        let td5 = document.createElement("td");
        td5.textContent = cellsPerNumber[5+i];
        tableRow.appendChild(td5);

        let td6 = document.createElement("td");
        td6.textContent = (100*cellsPerNumber[5+i]/totalCells).toFixed(6)+"%";
        tableRow.appendChild(td6);

        numTable.appendChild(tableRow);
    }

    numTable.id = "numTable";
    document.getElementById("numTable").replaceWith(numTable);

    if(!document.querySelector("button.deletable")){
        deleteBtn = document.createElement("button");
        deleteBtn.classList.add("deletable");
        deleteBtn.textContent = "Delete table"
        deleteBtn.addEventListener("click",()=>{
            document.getElementById("resultsTable").replaceChildren();
            numTableTitle.textContent = "";
            document.getElementById("numTable").replaceChildren();
            deleteBtn.remove();
        });
        tableContainer.after(deleteBtn);
    }
}

document.getElementById("resultsBtn").addEventListener('click',()=>{makeResultsTable()});
