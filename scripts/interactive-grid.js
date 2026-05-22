const cells = document.querySelectorAll('.corner, .edge');

cells.forEach(cell => {
    cell.addEventListener('click', () => {
    cell.classList.toggle('active');
    updateText()
    });
});

function updateState(){
    let patternArray = [];
    cells.forEach(cell => {
        patternArray.push(cell.classList.contains("active") ? "1" : "0")
    })
    let patternString = patternArray.slice(0,3).join("")+patternArray[4]
    patternString += patternArray.slice(5).reverse().join("")+patternArray[3];

    for (let i=0;i<4;i++){
        for (const [key, value] of Object.entries(Patterns)) {
            if (value[0].includes(patternString)) return [key, value[1]];
        } 

        patternString = patternString.slice(2) + patternString.slice(0,2);
    }
    return ["Not found","Not found"]
}

let gollyName = "";
let sillyName = "";
let gollyContainer = document.getElementById("cellB2");
let sillyContainer = document.getElementById("gridSillyName");

function updateText(){
    [gollyName, sillyName] = updateState();
    gollyContainer.innerText = gollyName;
    sillyContainer.innerText = gollyName +": "+ sillyName;
}

document.getElementById("gridClearBtn").addEventListener('click',()=>{
    cells.forEach(cell=>{
        cell.classList.remove('active');
        updateText();
    })
});

document.getElementById("gridInvertBtn").addEventListener('click',()=>{
    cells.forEach(cell=>{
        cell.classList.toggle('active');
        updateText();
    })
});

document.getElementById("gridRandomBtn").addEventListener('click',()=>{
    cells.forEach(cell=>{
        if(Math.random()>0.5)cell.classList.add('active');
        else cell.classList.remove('active');
        updateText();
    })
});

updateText();