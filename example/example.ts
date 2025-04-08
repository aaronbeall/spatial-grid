import { html, render } from "lit-html";
import { SpatialGrid, SpatialGridObject } from "../src/SpatialGrid";

// Create a visual test harness
const controlsTemplate = html`
  <div id="controls">
    <label>
      Width:
      <input id="widthInput" type="number" placeholder="Width" value="800" />
    </label>
    <label>
      Height:
      <input id="heightInput" type="number" placeholder="Height" value="600" />
    </label>
    <label>
      Tile Size:
      <input id="tileSizeInput" type="number" placeholder="Tile Size" value="50" />
    </label>
    <label>
      Number of Objects:
      <input id="objectCountInput" type="number" placeholder="Number of Objects" value="100" />
    </label>
    <button id="generateButton">Generate</button>
  </div>
  <canvas></canvas>
`;

const container = document.body;
render(controlsTemplate, container);

const canvas = container.querySelector("canvas")!;
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("Canvas context not supported");

const widthInput = container.querySelector<HTMLInputElement>("#widthInput")!;
const heightInput = container.querySelector<HTMLInputElement>("#heightInput")!;
const tileSizeInput = container.querySelector<HTMLInputElement>("#tileSizeInput")!;
const objectCountInput = container.querySelector<HTMLInputElement>("#objectCountInput")!;
const generateButton = container.querySelector<HTMLButtonElement>("#generateButton")!;

// Generate the grid and objects
let spatialGrid: SpatialGrid;
let objects: SpatialGridObject[] = [];

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
    const obj: SpatialGridObject = {
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
  if (!ctx) return;

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