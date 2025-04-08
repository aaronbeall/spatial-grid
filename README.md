# Spatial Grid

A spatial partitioning 2D grid for efficient many-to-many collision detection and spatial queries.

<img width="500" alt="image" src="https://github.com/user-attachments/assets/5777ec69-32da-48a6-908f-431f1f01d262" />

[**Live Demo**](https://aaronbeall.github.io/spatial-grid/)

## Installation

```bash
npm install spatial-grid-2d
```

## Usage

```typescript
import { SpatialGrid, SpatialGridObject } from "spatial-grid-2d";

// Create a spatial grid
const grid = new SpatialGrid({
  width: 800,
  height: 600,
  tileSize: 50 // Should be no smaller than your largest object
});

// Add objects to the grid
const objects: SpatialGridObject[] = [
  { x: 100, y: 100, radius: 10 },
  { x: 200, y: 200, left: 190, right: 210, top: 190, bottom: 210 },
];
grid.add(...objects);

// Update the grid to register objects
grid.update();

// Query objects within a circle
const circleObjects = grid.getObjectsIntersectingCircle(150, 150, 50);
console.log("Objects in circle:", circleObjects);

// Query objects within a rectangle
const rectObjects = grid.getObjectsIntersectingRect(50, 50, 100, 100);
console.log("Objects in rectangle:", rectObjects);

// Query objects along a line
const lineObjects = grid.getObjectsIntersectingLine(0, 0, 300, 300, 10);
console.log("Objects along line:", lineObjects);
```

## API

### `SpatialGrid`

#### Constructor

```typescript
new SpatialGrid({
  width: number,
  height: number,
  tileSize: number,
  debug?: boolean,
});
```

- `width`: The width of the grid in pixels.
- `height`: The height of the grid in pixels.
- `tileSize`: The size of each tile in pixels.
- `debug`: (Optional) Enables debug mode to track checked tiles.

#### Methods

##### `add(...objects: SpatialGridObject[])`

Adds objects to the grid.

##### `remove(...objects: SpatialGridObject[])`

Removes objects from the grid.

##### `update()`

Updates the grid by assigning objects to their respective tiles.

##### `getNeighbors(x: number, y: number, neighborTiles?: number): SpatialGridObject[]`

Returns objects in the tile at `(x, y)` and adjacent tiles based on `neighborTiles`.

Example:
```typescript
grid.getNeighbors(126, 72, 1);
// Returns objects in tiles:
// [11,6][12,6][13,6]
// [11,7][12,7][13,7]
// [11,8][12,8][13,8]
```

##### `getObjectsIntersectingCircle(x: number, y: number, radius: number): SpatialGridObject[]`

Returns objects intersecting a circle with the given center and radius.

Note: Objects must have a `radius` property. If missing, they are treated as points.

##### `getObjectsIntersectingRect(x: number, y: number, width: number, height: number): SpatialGridObject[]`

Returns objects intersecting a rectangle with the given position and dimensions.

Note: Objects must have `left`, `right`, `top`, and `bottom` properties. If missing, they are treated as points using `x` and `y`.

##### `getObjectsIntersectingLine(fromX: number, fromY: number, toX: number, toY: number, width?: number): SpatialGridObject[]`

Returns objects intersecting a line segment with the given start, end, and width.

#### Properties

- `debug`: A boolean indicating whether debug mode is enabled.
- `lastCheckedTiles`: An array of tiles checked during the last query.

### `SpatialGridObject`

An object interface that can be added to the grid. 

#### Properties

- `x`: The x-coordinate of the object's center.
- `y`: The y-coordinate of the object's center.
- `radius?`: The radius of the object. If omitted, the object is treated as a point.
- `left?`: The left boundary of the object. If omitted, `x - radius` is used.
- `right?`: The right boundary of the object. If omitted, `x + radius` is used.
- `top?`: The top boundary of the object. If omitted, `y - radius` is used.
- `bottom?`: The bottom boundary of the object. If omitted, `y + radius` is used.
