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
    <hr />
    <div id="instructions"></div>
  </div>
  <div id="status"></div>
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
const statusContainer = container.querySelector<HTMLDivElement>("#status")!;
const instructionsContainer = container.querySelector<HTMLDivElement>("#instructions")!;

// Generate the grid and objects
let spatialGrid: SpatialGrid;
let objects: SpatialGridObject[] = [];
let selectedMethod = "getNeighbors";
let intersectingObjects: SpatialGridObject[] = [];

let neighborTiles = 1; // Default for getNeighbors
let circleRadius = 50; // Default for getObjectsIntersectingCircle
let rectStart = { x: 50, y: 50 }; // Start point for rectangle
let rectEnd = { x: 150, y: 150 }; // End point for rectangle
let lineStart = { x: 0, y: 0 }; // Start point for line
let lineWidth = 10; // Default line width for getObjectsIntersectingLine
let isDragging = false; // Track dragging state

function updateInstructions() {
  const controls = container.querySelector("#controls");
  if (!controls) return;

  let instructionsTemplate;

  switch (selectedMethod) {
    case "getNeighbors":
      instructionsTemplate = html`
        <div>
          <label>
            Neighbor Tiles:
            <input
              type="number"
              value="${neighborTiles}"
              placeholder="Neighbor Tiles"
              @input="${(e: Event) => {
                neighborTiles = parseInt((e.target as HTMLInputElement).value, 10) ?? 1;
              }}"
            />
          </label>
        </div>
      `;
      break;
    case "getObjectsIntersectingCircle":
      instructionsTemplate = html`
        <div>
          <label>
            Circle Radius:
            <input
              type="number"
              value="${circleRadius}"
              placeholder="Circle Radius"
              @input="${(e: Event) => {
                circleRadius = parseInt((e.target as HTMLInputElement).value, 10) ?? 50;
              }}"
            />
          </label>
          <i>(Click and drag on the canvas to set circle radius)</i>
        </div>
      `;
      break;
    case "getObjectsIntersectingRect":
      const top = Math.min(rectStart.y, rectEnd.y);
      const bottom = Math.max(rectStart.y, rectEnd.y);
      const left = Math.min(rectStart.x, rectEnd.x);
      const right = Math.max(rectStart.x, rectEnd.x);
      instructionsTemplate = html`
        <div>
          <label>Top: ${top}</label>
          <label>Left: ${left}</label>
          <label>Bottom: ${bottom}</label>
          <label>Right: ${right}</label>
          <i>(Click and drag on the canvas to set rectangle bounds)</i>
        </div>
      `;
      break;
    case "getObjectsIntersectingLine":
      instructionsTemplate = html`
        <div>
          <label>Line Start: (${lineStart.x}, ${lineStart.y})</label>
          <label>Line End: (${mouseX}, ${mouseY})</label>
          <label>
            Line Width:
            <input
              type="number"
              value="${lineWidth}"
              placeholder="Line Width"
              @input="${(e: Event) => {
                lineWidth = parseInt((e.target as HTMLInputElement).value, 10) ?? 10;
              }}"
            />
          </label>
          <i>(Click to set line segment origin)</i>
        </div>
      `;
      break;
    default:
      instructionsTemplate = html``;
      break;
  }

  render(instructionsTemplate, instructionsContainer);
}

// Update selectedMethod when a radio button is changed
getMethodInputs.forEach(input => {
  input.addEventListener("change", () => {
    selectedMethod = container.querySelector<HTMLInputElement>('input[name="getMethod"]:checked')!.value;
    updateInstructions();
  });
});

// Trigger initial instructions update
updateInstructions();

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
let mouseDownX = 0; // Track the X position where the mouse was pressed down
let mouseDownY = 0; // Track the Y position where the mouse was pressed down

// Handle mouse events for circle, rectangle, and line
canvas.addEventListener("mousedown", (event) => {
  const rect = canvas.getBoundingClientRect();
  const startX = event.clientX - rect.left;
  const startY = event.clientY - rect.top;

  switch (selectedMethod) {
    case "getObjectsIntersectingCircle":
      isDragging = true;
      mouseDownX = startX; // Set the starting point for the circle drag
      mouseDownY = startY;
      circleRadius = 0; // Reset radius
      break;
    case "getObjectsIntersectingRect":
      isDragging = true;
      rectStart = { x: startX, y: startY };
      rectEnd = { x: startX, y: startY };
      break;
    case "getObjectsIntersectingLine":
      lineStart = { x: startX, y: startY };
      break;
    default:
      break;
  }
});

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const currentX = event.clientX - rect.left;
  const currentY = event.clientY - rect.top;

  if (isDragging) {
    switch (selectedMethod) {
      case "getObjectsIntersectingCircle":
        const dx = currentX - mouseDownX; // Use the mouse down point
        const dy = currentY - mouseDownY;
        circleRadius = Math.round(Math.sqrt(dx * dx + dy * dy)); // Update radius
        updateInstructions();
        break;
      case "getObjectsIntersectingRect":
        rectEnd = { x: currentX, y: currentY }; // Update rectangle end point
        updateInstructions();
        break;
      default:
        break;
    }
  }

  mouseX = currentX;
  mouseY = currentY;

  if (selectedMethod === "getObjectsIntersectingLine") {
    updateInstructions();
  }

  requestAnimationFrame(draw);
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
});

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;

  switch (selectedMethod) {
    case "getNeighbors":
      intersectingObjects = spatialGrid.getNeighbors(mouseX, mouseY, neighborTiles);
      break;
    case "getObjectsIntersectingCircle":
      intersectingObjects = spatialGrid.getObjectsIntersectingCircle(mouseX, mouseY, circleRadius);
      break;
    case "getObjectsIntersectingRect":
      const rectWidth = Math.abs(rectEnd.x - rectStart.x);
      const rectHeight = Math.abs(rectEnd.y - rectStart.y);
      const rectX = Math.min(rectStart.x, rectEnd.x);
      const rectY = Math.min(rectStart.y, rectEnd.y);
      intersectingObjects = spatialGrid.getObjectsIntersectingRect(rectX, rectY, rectWidth, rectHeight);
      break;
    case "getObjectsIntersectingLine":
      intersectingObjects = spatialGrid.getObjectsIntersectingLine(lineStart.x, lineStart.y, mouseX, mouseY, lineWidth); // Use lineWidth
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
  ctx.lineWidth = .5;
  for (const tile of spatialGrid.lastCheckedTiles) {
    ctx.strokeRect(tile.x * tileSize, tile.y * tileSize, tileSize, tileSize);
  }

  // Draw detection area in red outline
  ctx.lineWidth = 2;
  switch (selectedMethod) {
    case "getNeighbors":
      break;

    case "getObjectsIntersectingCircle":
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, circleRadius, 0, Math.PI * 2);
      ctx.stroke();
      break;

    case "getObjectsIntersectingRect":
      const rectWidth = Math.abs(rectEnd.x - rectStart.x);
      const rectHeight = Math.abs(rectEnd.y - rectStart.y);
      const rectX = Math.min(rectStart.x, rectEnd.x);
      const rectY = Math.min(rectStart.y, rectEnd.y);
      ctx.strokeRect(rectX, rectY, rectWidth, rectHeight);
      break;

    case "getObjectsIntersectingLine":
      const angle = Math.atan2(mouseY - lineStart.y, mouseX - lineStart.x);
      const offsetX = (lineWidth / 2) * Math.sin(angle);
      const offsetY = (lineWidth / 2) * Math.cos(angle);

      ctx.beginPath();
      ctx.moveTo(lineStart.x - offsetX, lineStart.y + offsetY);
      ctx.lineTo(mouseX - offsetX, mouseY + offsetY);
      ctx.lineTo(mouseX + offsetX, mouseY - offsetY);
      ctx.lineTo(lineStart.x + offsetX, lineStart.y - offsetY);
      ctx.closePath();
      ctx.stroke();

      // Draw round end caps as outlines
      ctx.beginPath();
      ctx.arc(lineStart.x, lineStart.y, lineWidth / 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, lineWidth / 2, 0, Math.PI * 2);
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