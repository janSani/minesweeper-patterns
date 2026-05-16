const cells = document.querySelectorAll('.corner, .edge');

cells.forEach(cell => {
    cell.addEventListener('click', () => {
    cell.classList.toggle('active');
    updateText()
    });
});

function updateState(){
    let cellArray = [];
    cells.forEach(cell => {
        cellArray.push(cell.classList.contains("active") ? "1" : "0")
    })
    let cellString = cellArray.slice(0,3).join("")+cellArray[4]
    cellString += cellArray.slice(5).reverse().join("")+cellArray[3];

    for (let i=0;i<4;i++){
        if(c0.includes(cellString)) return ["0","Empty"];

        if(c1c.includes(cellString)) return ["1c","Corner"];
        if(c1e.includes(cellString)) return ["1e","Edge"];

        if(c2c.includes(cellString)) return ["2c","Corner obo"];
        if(c2e.includes(cellString)) return ["2e","Duoplet"];
        if(c2k.includes(cellString)) return ["2k","Knight"];
        if(c2a.includes(cellString)) return ["2a","Domino"];
        if(c2i.includes(cellString)) return ["2i","Edge obo"];
        if(c2n.includes(cellString)) return ["2n","Opposites"];
        
        if(c3c.includes(cellString)) return ["3c","Three corners"];
        if(c3e.includes(cellString)) return ["3e","Arrow"];
        if(c3k.includes(cellString)) return ["3k","Bi-knight"];
        if(c3a.includes(cellString)) return ["3a","Pre-block"];
        if(c3i.includes(cellString)) return ["3i","Bar"];
        if(c3n.includes(cellString)) return ["3n","Cis domino-corner"];
        if(c3y.includes(cellString)) return ["3y","Triangle"];
        if(c3q.includes(cellString)) return ["3q","Trans domino-corner"];
        if(c3j.includes(cellString)) return ["3j","Banana"];
        if(c3r.includes(cellString)) return ["3r","Domino and edge"];

        if(c4c.includes(cellString)) return ["4c","Four corners"];
        if(c4e.includes(cellString)) return ["4e","Tub"];
        if(c4k.includes(cellString)) return ["4k","Banana and corner"];
        if(c4a.includes(cellString)) return ["4a","The L"];
        if(c4i.includes(cellString)) return ["4i","Cis dominoes"];
        if(c4n.includes(cellString)) return ["4n","Bar and corner"];
        if(c4y.includes(cellString)) return ["4y","Domino and obo"];
        if(c4q.includes(cellString)) return ["4q","Fish"];
        if(c4j.includes(cellString)) return ["4j","Cane"];
        if(c4r.includes(cellString)) return ["4r","Hook"];
        if(c4t.includes(cellString)) return ["4t","The T"];
        if(c4w.includes(cellString)) return ["4w","Bow"];
        if(c4z.includes(cellString)) return ["4z","Trans dominoes"];
        
        if(c5c.includes(cellString)) return ["5c","Boat"];
        if(c5e.includes(cellString)) return ["5e","Neutral face"];
        if(c5k.includes(cellString)) return ["5k","Pickaxe"];
        if(c5a.includes(cellString)) return ["5a","The V"];
        if(c5i.includes(cellString)) return ["5i","The U"];
        if(c5n.includes(cellString)) return ["5n","Glider"];
        if(c5y.includes(cellString)) return ["5y","Hat"];
        if(c5q.includes(cellString)) return ["5q","Claw"];
        if(c5j.includes(cellString)) return ["5j","Pseudo-glider"];
        if(c5r.includes(cellString)) return ["5r","Bar and domino"];

        if(c6c.includes(cellString)) return ["6c","Bullet"];
        if(c6e.includes(cellString)) return ["6e","Stealth"];
        if(c6k.includes(cellString)) return ["6k","Iron"];
        if(c6a.includes(cellString)) return ["6a","Basket"];
        if(c6i.includes(cellString)) return ["6i","Equal sign"];
        if(c6n.includes(cellString)) return ["6n","Ship"];

        if(c7c.includes(cellString)) return ["7c","Loop"];
        if(c7e.includes(cellString)) return ["7e","Pi"];

        if(c8.includes(cellString)) return ["8","Donut"];
        cellString = cellString.slice(2) + cellString.slice(0,2);
    }
    return ["Not found","Test"]
}

let neighborhood = "";
let sillyname = "";
let typeContainer = document.getElementById("type");
let sillyContainer = document.getElementById("silly");

function updateText(){
    [neighborhood, sillyname] = updateState();
    typeContainer.innerText = neighborhood;
    sillyContainer.innerText = sillyname;
}

updateText();
