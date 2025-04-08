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
    <div id="getMethods">
      <label>
        <input type="radio" name="getMethod" value="getNeighbors" checked />
        Get Neighbors
      </label>
      <label>
        <input type="radio" name="getMethod" value="getObjectsIntersectingCircle" />
        Get Objects Intersecting Circle
      </label>
      <label>
        <input type="radio" name="getMethod" value="getObjectsIntersectingRect" />
        Get Objects Intersecting Rectangle
      </label>
      <label>
        <input type="radio" name="getMethod" value="getObjectsIntersectingLine" />
        Get Objects Intersecting Line
      </label>
    </div>
  </div>
  <canvas></canvas>
`;

const container = document.body;
render(controlsTemplate, container);

const canvas = container.querySelector("canvas")!;
const ctx = canvas.getContext("2d");
if (!ctx) throw new Error("Canvas context not supported");

canvas.style.cursor = "crosshair";

const widthInput = container.querySelector<HTMLInputElement>("#widthInput")!;
const heightInput = container.querySelector<HTMLInputElement>("#heightInput")!;
const tileSizeInput = container.querySelector<HTMLInputElement>("#tileSizeInput")!;
const objectCountInput = container.querySelector<HTMLInputElement>("#objectCountInput")!;
const generateButton = container.querySelector<HTMLButtonElement>("#generateButton")!;
const getMethodInputs = container.querySelectorAll<HTMLInputElement>('input[name="getMethod"]');

const statusContainer = document.createElement("div");
container.insertBefore(statusContainer, canvas);

// Generate the grid and objects
let spatialGrid: SpatialGrid;
let objects: SpatialGridObject[] = [];
let selectedMethod = "getNeighbors";
let intersectingObjects: SpatialGridObject[] = [];

generateButton.addEventListener("click", () => {
  const width = parseInt(widthInput.value, 10);
  const height = parseInt(heightInput.value, 10);
  const tileSize = parseInt(tileSizeInput.value, 10);
  const objectCount = parseInt(objectCountInput.value, 10);

  canvas.width = width;
  canvas.height = height;

  spatialGrid = new SpatialGrid({ width, height, tileSize, debug: true });
  objects = [];

  for (let i = 0; i < objectCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 10 + 5;

    const obj: SpatialGridObject = {
      x,
      y,
      radius,
      left: x - radius,
      right: x + radius,
      top: y - radius,
      bottom: y + radius,
    };
    objects.push(obj);
  }

  spatialGrid.add(...objects);
  spatialGrid.update();

  draw();
});

function updateStatus(mouseX: number, mouseY: number, intersectingCount: number) {
  render(
    html`<div id="status">Mouse: ${mouseX},${mouseY} | Intersecting Objects: ${intersectingCount}</div>`,
    statusContainer
  );
}

let mouseX = 0;
let mouseY = 0;

// Update mouse position on mouse move
canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;

  switch (selectedMethod) {
    case "getNeighbors":
      intersectingObjects = spatialGrid.getNeighbors(mouseX, mouseY, 1); // Example neighborTiles = 1
      break;
    case "getObjectsIntersectingCircle":
      intersectingObjects = spatialGrid.getObjectsIntersectingCircle(mouseX, mouseY, 50); // Example radius = 50
      break;
    case "getObjectsIntersectingRect":
      intersectingObjects = spatialGrid.getObjectsIntersectingRect(mouseX - 50, mouseY - 25, 100, 50); // Example width = 100, height = 50
      break;
    case "getObjectsIntersectingLine":
      intersectingObjects = spatialGrid.getObjectsIntersectingLine(mouseX, mouseY, mouseX + 50, mouseY + 50, 10); // Example width = 10
      break;
    default:
      intersectingObjects = [];
  }

  updateStatus(Math.floor(mouseX), Math.floor(mouseY), intersectingObjects.length);
  requestAnimationFrame(draw);
});

// Update selectedMethod when a radio button is changed
getMethodInputs.forEach(input => {
  input.addEventListener("change", () => {
    selectedMethod = container.querySelector<HTMLInputElement>('input[name="getMethod"]:checked')!.value;
  });
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

  // Draw all objects in blue
  ctx.fillStyle = "#007bff";
  for (const obj of objects) {
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.radius || 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw intersecting objects in red
  ctx.fillStyle = "#ff0000";
  for (const obj of intersectingObjects) {
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.radius || 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw checked tiles in red outline
  ctx.strokeStyle = "red";
  ctx.lineWidth = 1;
  for (const tile of spatialGrid.lastCheckedTiles) {
    ctx.strokeRect(tile.x * tileSize, tile.y * tileSize, tileSize, tileSize);
  }

  // Draw detection area in red outline
  ctx.lineWidth = 2;
  switch (selectedMethod) {
    case "getNeighbors":
      break;

    case "getObjectsIntersectingCircle":
      const radius = 50; // Example radius = 50
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
      ctx.stroke();
      break;

    case "getObjectsIntersectingRect":
      const rectWidth = 100; // Example width = 100
      const rectHeight = 50; // Example height = 50
      ctx.strokeRect(mouseX - rectWidth / 2, mouseY - rectHeight / 2, rectWidth, rectHeight);
      break;

    case "getObjectsIntersectingLine":
      const lineWidth = 10; // Example width = 10
      ctx.beginPath();
      ctx.moveTo(mouseX, mouseY);
      ctx.lineTo(mouseX + 50, mouseY + 50); // Example line endpoint
      ctx.stroke();
      break;

    default:
      break;
  }
}

// Trigger canvas generation on load
window.addEventListener("load", () => {
  generateButton.click();
});