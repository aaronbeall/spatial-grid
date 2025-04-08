var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SpatialGrid_grid;
export class SpatialGrid {
    constructor(width, height, tileSize) {
        this.objects = [];
        /**
         * A flattened grid of xTiles * yTiles that contains list of the objects registered to each tile
         */
        _SpatialGrid_grid.set(this, []);
        this.width = width;
        this.height = tileSize;
        this.tileSize = tileSize;
    }
    add(...objects) {
        this.objects.push(...objects);
    }
    remove(...objects) {
        this.objects = this.objects.filter(obj => !objects.includes(obj));
    }
    /**
     * How many tiles horizontally
     */
    get xTiles() {
        return Math.floor(this.width / this.tileSize);
    }
    /**
     * How many tiles vertically
     */
    get yTiles() {
        return Math.floor(this.height / this.tileSize);
    }
    /**
     * Updates the grid to register all the objects to their appropriate grid tile
     */
    update() {
        // Clear the grid
        __classPrivateFieldSet(this, _SpatialGrid_grid, Array.from({ length: this.xTiles * this.yTiles }, () => []), "f");
        // Iterate over all objects and place them in the appropriate tiles
        for (const obj of this.objects) {
            const startX = Math.floor(obj.x / this.tileSize);
            const startY = Math.floor(obj.y / this.tileSize);
            // Determine the range of tiles the object occupies
            const endX = obj.radius
                ? Math.floor((obj.x + obj.radius) / this.tileSize)
                : startX;
            const endY = obj.radius
                ? Math.floor((obj.y + obj.radius) / this.tileSize)
                : startY;
            for (let x = startX; x <= endX; x++) {
                for (let y = startY; y <= endY; y++) {
                    if (x >= 0 && x < this.xTiles && y >= 0 && y < this.yTiles) {
                        const tileIndex = y * this.xTiles + x;
                        __classPrivateFieldGet(this, _SpatialGrid_grid, "f")[tileIndex].push(obj);
                    }
                }
            }
        }
    }
    /**
     * Returns all the objects registered to the tile at {x,y}, and adjacent tiles based on the neighborTiles count.
     *
     * For example, `getNeighbors(126, 72, 1)` for a tileSize of `10` would return all the objects registered to the tiles:
     * ```
     * [11,6][12,6][13,6]
     * [11,7][12,7][13,7]
     * [11,8][12,8][13,8]
     * ```
     */
    getNeighbors(x, y, neighborTiles = 1) {
        // Use a Set to ensure unique objects
        const uniqueNeighbors = new Set();
        // Calculate the tile coordinates of the given point
        const tileX = Math.floor(x / this.tileSize);
        const tileY = Math.floor(y / this.tileSize);
        // Iterate over the range of tiles based on neighborTiles
        for (let offsetX = -neighborTiles; offsetX <= neighborTiles; offsetX++) {
            for (let offsetY = -neighborTiles; offsetY <= neighborTiles; offsetY++) {
                const neighborX = tileX + offsetX;
                const neighborY = tileY + offsetY;
                // Ensure the neighbor tile is within bounds
                if (neighborX >= 0 && neighborX < this.xTiles && neighborY >= 0 && neighborY < this.yTiles) {
                    const tileIndex = neighborY * this.xTiles + neighborX;
                    for (const obj of __classPrivateFieldGet(this, _SpatialGrid_grid, "f")[tileIndex]) {
                        uniqueNeighbors.add(obj);
                    }
                }
            }
        }
        return Array.from(uniqueNeighbors);
    }
    /**
     * First use getNeighbors() to find candidates, then narrow down with intersecting circle math
     * Requires that objects have a radius value, otherwise they are treated like a point
     */
    getObjectsIntersectingCircle(x, y, radius) {
        const candidates = this.getNeighbors(x, y, Math.ceil(radius / this.tileSize));
        const intersectingObjects = [];
        for (const obj of candidates) {
            const objRadius = obj.radius || 0; // Treat missing radius as 0
            const dx = obj.x - x;
            const dy = obj.y - y;
            const distanceSquared = dx * dx + dy * dy;
            const radiiSum = objRadius + radius;
            if (distanceSquared <= radiiSum * radiiSum) {
                intersectingObjects.push(obj);
            }
        }
        return intersectingObjects;
    }
    /**
     * First use getNeighbors() to find candidates, then narrow down using intersecting rectangle math
     * Requires that  objects have a {left,right,top,bottom} value, otherwise they are treated like a point using {x,y}
     */
    getObjectsIntersectingRect(x, y, width, height) {
        const candidates = this.getNeighbors(x + width / 2, y + height / 2, Math.ceil(Math.max(width, height) / (2 * this.tileSize)));
        const intersectingObjects = [];
        for (const obj of candidates) {
            const objLeft = obj.left ?? obj.x;
            const objRight = obj.right ?? obj.x;
            const objTop = obj.top ?? obj.y;
            const objBottom = obj.bottom ?? obj.y;
            // Check if the object intersects the rectangle
            if (objRight >= x &&
                objLeft <= x + width &&
                objBottom >= y &&
                objTop <= y + height) {
                intersectingObjects.push(obj);
            }
        }
        return intersectingObjects;
    }
    /**
     * Collects neighbors in all tiles intersecting the line segment, and neighbor tiles based on
     * neighbor tiles based on the width (if not 0)
     */
    getObjectsIntersectingLine(fromX, fromY, toX, toY, width = 0) {
        const neighborTiles = new Set();
        // Bresenham's line algorithm to determine the tiles intersected by the line
        let x0 = Math.floor(fromX / this.tileSize);
        let y0 = Math.floor(fromY / this.tileSize);
        const x1 = Math.floor(toX / this.tileSize);
        const y1 = Math.floor(toY / this.tileSize);
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1;
        const sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;
        while (true) {
            // Add the current tile to the set of neighbor tiles
            if (x0 >= 0 && x0 < this.xTiles && y0 >= 0 && y0 < this.yTiles) {
                neighborTiles.add({ x: x0, y: y0 });
            }
            // Check if we've reached the end of the line
            if (x0 === x1 && y0 === y1)
                break;
            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
        // Expand the neighbor tiles based on the width
        const expandedTiles = new Set();
        const tileExpansion = Math.ceil(width / (2 * this.tileSize));
        for (const tile of neighborTiles) {
            for (let offsetX = -tileExpansion; offsetX <= tileExpansion; offsetX++) {
                for (let offsetY = -tileExpansion; offsetY <= tileExpansion; offsetY++) {
                    const neighborX = tile.x + offsetX;
                    const neighborY = tile.y + offsetY;
                    if (neighborX >= 0 && neighborX < this.xTiles && neighborY >= 0 && neighborY < this.yTiles) {
                        expandedTiles.add({ x: neighborX, y: neighborY });
                    }
                }
            }
        }
        // Collect candidates from the expanded tiles, ensuring no duplicates
        const candidatesSet = new Set();
        for (const tile of expandedTiles) {
            const tileIndex = tile.y * this.xTiles + tile.x;
            for (const obj of __classPrivateFieldGet(this, _SpatialGrid_grid, "f")[tileIndex]) {
                candidatesSet.add(obj);
            }
        }
        const candidates = Array.from(candidatesSet);
        const intersectingObjects = [];
        const lineLengthSquared = (toX - fromX) ** 2 + (toY - fromY) ** 2;
        for (const obj of candidates) {
            const objRadius = obj.radius || 0;
            const objX = obj.x;
            const objY = obj.y;
            // Calculate the closest point on the line segment to the object's center
            const t = Math.max(0, Math.min(1, ((objX - fromX) * (toX - fromX) + (objY - fromY) * (toY - fromY)) / lineLengthSquared));
            const closestX = fromX + t * (toX - fromX);
            const closestY = fromY + t * (toY - fromY);
            // Check if the distance from the closest point to the object's center is within the radius + width
            const dx = objX - closestX;
            const dy = objY - closestY;
            const distanceSquared = dx * dx + dy * dy;
            const effectiveRadius = objRadius + width / 2;
            if (distanceSquared <= effectiveRadius * effectiveRadius) {
                intersectingObjects.push(obj);
            }
        }
        return intersectingObjects;
    }
}
_SpatialGrid_grid = new WeakMap();
