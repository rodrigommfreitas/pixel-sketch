let currentColor = '#1E1E1E';
let currentMode = 'color';
let currentBackground = '#ffffff';
let gridSize = 16;

const colorPicker = document.getElementById('color-select');
const bgColorPicker = document.getElementById('background-select');
const colorGrabBtn = document.getElementById('color-grab');
const paintBucketBtn = document.getElementById('paint-bucket');
const rainbowBtn = document.getElementById('color-rainbow');
const shadingBtn = document.getElementById('color-shading');
const lightingBtn = document.getElementById('color-lighting');
const eraserBtn = document.getElementById('eraser');
const clearBtn = document.getElementById('clear');
const toggleGridBtn = document.getElementById('toggle-grid');
const gridSlider = document.getElementById('slider');
const gridSizeValue = document.getElementById('grid-size');
const grid = document.getElementById('grid');

function setCurrentColor(newColor) {
    currentColor = newColor;
}

function setCurrentBackground(newColor) {
    currentBackground = newColor;
    grid.style.backgroundColor = currentBackground;
}

function toggleMode(newMode) {

    colorGrabBtn.classList.remove('toggled');
    paintBucketBtn.classList.remove('toggled');
    rainbowBtn.classList.remove('toggled');
    shadingBtn.classList.remove('toggled');
    lightingBtn.classList.remove('toggled');
    eraserBtn.classList.remove('toggled');

    if (newMode === currentMode) {
        return;
    } else if (newMode === 'grab') {
        colorGrabBtn.classList.add('toggled');
    } else if (newMode === 'bucket') {
        paintBucketBtn.classList.add('toggled');
    } else if (newMode === 'rainbow') {
        rainbowBtn.classList.add('toggled');
    } else if (newMode === 'shading') {
        shadingBtn.classList.add('toggled');
    } else if (newMode === 'lighting') {
        lightingBtn.classList.add('toggled');
    } else if (newMode === 'eraser') {
        eraserBtn.classList.add('toggled');
    }
}

function setCurrentMode(newMode) {
    toggleMode(newMode);
    if (currentMode === newMode)
        currentMode = 'color';
    else
        currentMode = newMode;
}

function untoggle(btn) {
    btn.classList.remove('toggled');
}

function clearGrid() {
    grid.textContent = '';
    initGrid(gridSize);
    // Initializes with grid lines or not, depending on the previous setting
    if (!toggleGridBtn.classList.contains('toggled'))
    {
        toggleGridBtn.classList.add('toggled');
        toggleGrid();
    }

}

function toggleGrid() {
    const gridDivs = document.querySelectorAll('.grid-element');
    const gridElements = Array.from(gridDivs);
    if (toggleGridBtn.classList.contains('toggled')) {
        toggleGridBtn.classList.remove('toggled');
        gridElements.forEach(element => {
            element.style.borderColor = 'transparent';
        });
    }
    else {
        toggleGridBtn.classList.add('toggled');
        gridElements.forEach(element => {
            element.style.borderColor = 'black';
        });
    }
}

function updateGridSize(val) {
    gridSizeValue.textContent = 'Grid Size: ' + val + 'x' + val;
    gridSize = val;
    clearGrid();
}

let mouseDown = false;
document.body.onmousedown = () => (mouseDown = true);
document.body.onmouseup = () => (mouseDown = false);

function action(e) {
    if (e.type === 'mouseover' && !mouseDown) return;
    if (currentMode === 'color')
        e.target.style.backgroundColor = currentColor;
    else if (currentMode === 'grab') {
        currentColor = e.target.style.backgroundColor;
        setCurrentMode('color');
    } else if (currentMode === 'bucket') {
        const gridDivs = document.querySelectorAll('.grid-element');
        const gridElements = Array.from(gridDivs);
        const  colorToReplace = e.target.style.backgroundColor;
        setCurrentMode('color');
    }
    else if (currentMode === 'rainbow') {
        const randR = Math.floor(Math.random() * 256);
        const randG = Math.floor(Math.random() * 256);
        const randB = Math.floor(Math.random() * 256);
        e.target.style.backgroundColor = `rgb(${randR}, ${randG}, ${randB})`
    } else if (currentMode === 'shading') {

    } else if (currentMode === 'lighting') {

    } else if (currentMode === 'eraser') {
        e.target.style.backgroundColor = currentBackground;
    }
}

function initGrid(size) {
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    grid.style.backgroundColor = currentBackground;
    for (let i = 0; i < size * size; i++) {
        const newElement = document.createElement('div');
        newElement.classList.add('grid-element');
        newElement.addEventListener('mouseover', action);
        newElement.addEventListener('mousedown', action);
        grid.appendChild(newElement);
    }
}

colorPicker.oninput = (e) => setCurrentColor(e.target.value);
bgColorPicker.oninput = (e) => setCurrentBackground(e.target.value);
colorGrabBtn.onclick = () => setCurrentMode('grab');
paintBucketBtn.onclick = () => setCurrentMode('bucket');
rainbowBtn.onclick = () => setCurrentMode('rainbow');
shadingBtn.onclick = () => setCurrentMode('shading');
lightingBtn.onclick = () => setCurrentMode('lighting');
eraserBtn.onclick = () => setCurrentMode('eraser');
clearBtn.onclick = () => clearGrid();
toggleGridBtn.onclick = () => toggleGrid();


window.onload = () => initGrid(gridSize);