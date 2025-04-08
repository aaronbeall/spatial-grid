import { SpatialGrid } from "../src/SpatialGrid";
// Create a visual test harness
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
if (!ctx)
    throw new Error("Canvas context not supported");
document.body.appendChild(canvas);
// Inputs for the test harness
const widthInput = document.createElement("input");
widthInput.type = "number";
widthInput.placeholder = "Width";
widthInput.value = "800";
document.body.appendChild(widthInput);
const heightInput = document.createElement("input");
heightInput.type = "number";
heightInput.placeholder = "Height";
heightInput.value = "600";
document.body.appendChild(heightInput);
const tileSizeInput = document.createElement("input");
tileSizeInput.type = "number";
tileSizeInput.placeholder = "Tile Size";
tileSizeInput.value = "50";
document.body.appendChild(tileSizeInput);
const objectCountInput = document.createElement("input");
objectCountInput.type = "number";
objectCountInput.placeholder = "Number of Objects";
objectCountInput.value = "100";
document.body.appendChild(objectCountInput);
const generateButton = document.createElement("button");
generateButton.textContent = "Generate";
document.body.appendChild(generateButton);
// Generate the grid and objects
let spatialGrid;
let objects = [];
generateButton.addEventListener("click", () => {
    const width = parseInt(widthInput.value, 10);
    const height = parseInt(heightInput.value, 10);
    const tileSize = parseInt(tileSizeInput.value, 10);
    const objectCount = parseInt(objectCountInput.value, 10);
    canvas.width = width;
    canvas.height = height;
    spatialGrid = new SpatialGrid(width, height, tileSize);
    objects = [];
    for (let i = 0; i < objectCount; i++) {
        const obj = {
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 10 + 5,
        };
        objects.push(obj);
    }
    spatialGrid.add(...objects);
    spatialGrid.update();
    draw();
});
function draw() {
    if (!ctx)
        return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw grid lines
    const tileSize = spatialGrid.tileSize;
    ctx.strokeStyle = "#ddd";
    for (let x = 0; x < canvas.width; x += tileSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += tileSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    // Draw objects
    ctx.fillStyle = "#007bff";
    for (const obj of objects) {
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius || 5, 0, Math.PI * 2);
        ctx.fill();
    }
}
