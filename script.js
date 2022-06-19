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

// Reset these values on page reload
colorPicker.value = '#000000';
bgColorPicker.value = '#ffffff';
gridSlider.value = 16;

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

const setColor = newColor => currentColor = newColor;

function setBackground(newColor) {
    clearGrid();
    currentBackground = grid.style.backgroundColor = newColor;
}

function toggleMode(newMode) {

    colorGrabBtn.classList.remove('toggled');
    paintBucketBtn.classList.remove('toggled');
    rainbowBtn.classList.remove('toggled');
    shadingBtn.classList.remove('toggled');
    lightingBtn.classList.remove('toggled');
    eraserBtn.classList.remove('toggled');

    if (newMode === currentMode) return;
    if (newMode === 'grab') {
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

function setMode(newMode) {
    toggleMode(newMode);
    if (currentMode === newMode)
        currentMode = 'color';
    else
        currentMode = newMode;
}

const draw = (e, color) => e.target.style.backgroundColor = color;

function RGBToHex(rgb) {
    const sep = rgb.indexOf(',') > -1 ? ',' : ' ';
    rgb = rgb.substr(4).split(')')[0].split(sep);
    return ("#" + ((1 << 24) + (+rgb[0] << 16) + (+rgb[1] << 8) + +rgb[2]).toString(16).slice(1));
}

function grabColor(e) {
    if (e.target.style.backgroundColor === '') {
        currentColor = currentBackground;
        colorPicker.value = currentColor;
    }
    else {
        currentColor = e.target.style.backgroundColor;
        colorPicker.value = RGBToHex(currentColor);
    }
    setMode('color');
}

function arrToMatrix(arr, width) {
    return arr.reduce(function (rows, key, index) {
        return (index % width == 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows;
    }, []);
}

function bucketPaint(e) {
    let targetColor = e.target.style.backgroundColor;
    if (e.target.style.backgroundColor.length !== 7) // Converts to HEX if needed
        targetColor = RGBToHex(e.target.style.backgroundColor);
    if (targetColor.toUpperCase() !== currentColor.toUpperCase()) {
        const gridArr = Array.from(document.querySelectorAll('.grid-element'));
        const gridMatrix = arrToMatrix(gridArr, gridSize);

        const target = e.target.style.backgroundColor;

        let gridIndex = gridArr.indexOf(e.target); // normal array index
        let xPos = Math.floor(gridIndex / gridSize);
        let yPos = gridIndex % gridSize;

        // https://stackoverflow.com/questions/22053759/multidimensional-array-fill
        function flow(x, y) {
            if (x >= 0 && x < gridMatrix.length && y >= 0 && y < gridMatrix[x].length) {
                if (gridMatrix[x][y].style.backgroundColor === target) {
                    gridMatrix[x][y].style.backgroundColor = currentColor;
                    flow(x - 1, y);    // check up
                    flow(x + 1, y);    // check down
                    flow(x, y - 1);    // check left
                    flow(x, y + 1);    // check right
                }
            }
        }
        flow(xPos, yPos);
    }
    setMode('color');
}

// https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
const replaceColor = (color, intensity) => '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + intensity)).toString(16)).substr(-2));

function adjustColor(e, intensity) {
    if (e.target.style.backgroundColor === '')
        draw(e, currentColor);
    else
        draw(e, replaceColor(RGBToHex(e.target.style.backgroundColor), intensity));
}

function clearGrid() {
    grid.textContent = '';
    initGrid(gridSize);
    if (!toggleGridBtn.classList.contains('toggled')) {
        toggleGridBtn.classList.add('toggled');
        toggleGrid();
    }
}

function toggleGrid() {
    const gridElements = Array.from(document.querySelectorAll('.grid-element'));
    let border;
    if (toggleGridBtn.classList.contains('toggled')) {
        toggleGridBtn.classList.remove('toggled');
        border = 'transparent';
    }
    else {
        toggleGridBtn.classList.add('toggled');
        border = 'black';
    }
    gridElements.forEach(element => {
        element.style.borderColor = border;
    });
}

function updateGridSize(val) {
    gridSlider.value = val;
    gridSizeValue.textContent = 'Grid Size: ' + val + 'x' + val;
    gridSize = val;
    clearGrid();
}

let mouseDown = false;
document.body.onmousedown = () => (mouseDown = true);
document.body.onmouseup = () => (mouseDown = false);

function action(e) {
    if (e.type === 'mouseover' && !mouseDown) return;
    switch (currentMode) {
        case 'color':
            draw(e, currentColor);
            break;
        case 'grab':
            grabColor(e);
            break;
        case 'bucket':
            bucketPaint(e);
            break;
        case 'rainbow':
            draw(e, `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`);
            break;
        case 'shading':
            adjustColor(e, -25);
            break;
        case 'lighting':
            adjustColor(e, 25);
            break;
        case 'eraser':
            draw(e, currentBackground);
            break;
        default:
            throw new Error('Something went wrong!');
    }
}

colorPicker.oninput = (e) => setColor(e.target.value);
bgColorPicker.oninput = (e) => setBackground(e.target.value);
colorGrabBtn.onclick = () => setMode('grab');
paintBucketBtn.onclick = () => setMode('bucket');
rainbowBtn.onclick = () => setMode('rainbow');
shadingBtn.onclick = () => setMode('shading');
lightingBtn.onclick = () => setMode('lighting');
eraserBtn.onclick = () => setMode('eraser');
clearBtn.onclick = () => clearGrid();
toggleGridBtn.onclick = () => toggleGrid();

window.onload = () => initGrid(gridSize);