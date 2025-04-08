/**
 * A spatial grid for efficiently managing and querying objects in a 2D space.
 * 
 * The grid divides the space into tiles of a fixed size, allowing objects to be registered
 * to specific tiles. This enables efficient spatial queries, such as finding objects
 * within a circle, rectangle, or along a line segment.
 */
export class SpatialGrid {
    width: number;
    height: number;
    tileSize: number;
    objects: SpatialGridObject[] = [];

    debug: boolean = false;
    lastCheckedTiles: { x: number; y: number }[] = [];

    /**
     * A flattened grid of xTiles * yTiles that contains list of the objects registered to each tile
     */
    #grid: SpatialGridObject[][] = [];

    constructor({ width, height, tileSize, debug = false }: { width: number; height: number; tileSize: number; debug?: boolean }) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.debug = debug;
    }

    /**
     * Adds objects to the grid.
     */
    add(...objects: SpatialGridObject[]) {
        this.objects.push(...objects);
    }

    /**
     * Removes objects from the grid.
     */
    remove(...objects: SpatialGridObject[]) {
        this.objects = this.objects.filter(obj => !objects.includes(obj));
    }

    /**
     * Returns the number of horizontal tiles.
     */
    get xTiles() {
        return Math.floor(this.width / this.tileSize);
    }

    /**
     * Returns the number of vertical tiles.
     */
    get yTiles() {
        return Math.floor(this.height / this.tileSize);
    }

    /**
     * Updates the grid by assigning objects to their respective tiles.
     */
    update() {
        // Clear the grid
        this.#grid = Array.from({ length: this.xTiles * this.yTiles }, () => []);

        // Iterate over all objects and place them in the appropriate tiles
        for (const obj of this.objects) {
            const startX = Math.floor((obj.left ?? (obj.x - (obj.radius ?? 0))) / this.tileSize);
            const startY = Math.floor((obj.top ?? (obj.y - (obj.radius ?? 0))) / this.tileSize);
            const endX = Math.floor((obj.right ?? (obj.x + (obj.radius ?? 0))) / this.tileSize);
            const endY = Math.floor((obj.bottom ?? (obj.y + (obj.radius ?? 0))) / this.tileSize);

            for (let x = startX; x <= endX; x++) {
                for (let y = startY; y <= endY; y++) {
                    if (x >= 0 && x < this.xTiles && y >= 0 && y < this.yTiles) {
                        const tileIndex = y * this.xTiles + x;
                        this.#grid[tileIndex].push(obj);
                    }
                }
            }
        }
    }

    /**
     * Returns objects in the tile at (x, y) and adjacent tiles based on neighborTiles.
     * 
     * Example:
     * `getNeighbors(126, 72, 1)` for a tileSize of `10` returns objects in tiles:
     * ```
     * [11,6][12,6][13,6]
     * [11,7][12,7][13,7]
     * [11,8][12,8][13,8]
     * ```
     */
    getNeighbors(x: number, y: number, neighborTiles: number = 1) {
        // Use a Set to ensure unique objects
        const uniqueNeighbors = new Set<SpatialGridObject>();
        if (this.debug) this.lastCheckedTiles = [];

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
                    if (this.debug) this.lastCheckedTiles.push({ x: neighborX, y: neighborY });
                    const tileIndex = neighborY * this.xTiles + neighborX;
                    for (const obj of this.#grid[tileIndex]) {
                        uniqueNeighbors.add(obj);
                    }
                }
            }
        }

        return Array.from(uniqueNeighbors);
    }

    /**
     * Returns objects intersecting a circle with the given center and radius.
     * 
     * Note: Objects must have a `radius` property. If missing, they are treated as points.
     */
    getObjectsIntersectingCircle(x: number, y: number, radius: number) {
        if (this.debug) this.lastCheckedTiles = [];
        const candidates = this.getNeighbors(x, y, Math.ceil(radius / this.tileSize));
        const intersectingObjects: SpatialGridObject[] = [];

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
     * Returns objects intersecting a rectangle with the given position and dimensions.
     * 
     * Note: Objects must have `left`, `right`, `top`, and `bottom` properties. If missing, they are treated as points using `x` and `y`.
     */
    getObjectsIntersectingRect(x: number, y: number, width: number, height: number) {
        if (this.debug) this.lastCheckedTiles = [];
        const intersectingObjects: SpatialGridObject[] = [];

        // Calculate the tile range for the rectangle
        const startX = Math.floor(x / this.tileSize);
        const startY = Math.floor(y / this.tileSize);
        const endX = Math.floor((x + width) / this.tileSize);
        const endY = Math.floor((y + height) / this.tileSize);

        // Iterate over the tiles within the rectangle's bounds
        for (let tileX = startX; tileX <= endX; tileX++) {
            for (let tileY = startY; tileY <= endY; tileY++) {
                if (tileX >= 0 && tileX < this.xTiles && tileY >= 0 && tileY < this.yTiles) {
                    if (this.debug) this.lastCheckedTiles.push({ x: tileX, y: tileY });
                    const tileIndex = tileY * this.xTiles + tileX;
                    for (const obj of this.#grid[tileIndex]) {
                        const objLeft = obj.left ?? obj.x;
                        const objRight = obj.right ?? obj.x;
                        const objTop = obj.top ?? obj.y;
                        const objBottom = obj.bottom ?? obj.y;

                        // Check if the object intersects the rectangle
                        if (
                            objRight >= x &&
                            objLeft <= x + width &&
                            objBottom >= y &&
                            objTop <= y + height
                        ) {
                            intersectingObjects.push(obj);
                        }
                    }
                }
            }
        }

        return intersectingObjects;
    }

    /**
     * Returns objects intersecting a line segment with the given start, end, and width.
     */
    getObjectsIntersectingLine(fromX: number, fromY: number, toX: number, toY: number, width: number = 0) {
        if (this.debug) this.lastCheckedTiles = [];
        const neighborTiles = new Set<{ x: number; y: number }>();

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
                if (this.debug) this.lastCheckedTiles.push({ x: x0, y: y0 });
            }

            // Check if we've reached the end of the line
            if (x0 === x1 && y0 === y1) break;

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
        const expandedTiles = new Set<{ x: number; y: number }>();
        const tileExpansion = Math.ceil(width / (2 * this.tileSize));
        for (const tile of neighborTiles) {
            for (let offsetX = -tileExpansion; offsetX <= tileExpansion; offsetX++) {
                for (let offsetY = -tileExpansion; offsetY <= tileExpansion; offsetY++) {
                    const neighborX = tile.x + offsetX;
                    const neighborY = tile.y + offsetY;
                    if (neighborX >= 0 && neighborX < this.xTiles && neighborY >= 0 && neighborY < this.yTiles) {
                        expandedTiles.add({ x: neighborX, y: neighborY });
                        if (this.debug) this.lastCheckedTiles.push({ x: neighborX, y: neighborY });
                    }
                }
            }
        }

        // Collect candidates from the expanded tiles, ensuring no duplicates
        const candidatesSet = new Set<SpatialGridObject>();
        for (const tile of expandedTiles) {
            const tileIndex = tile.y * this.xTiles + tile.x;
            for (const obj of this.#grid[tileIndex]) {
                candidatesSet.add(obj);
            }
        }

        const candidates = Array.from(candidatesSet);

        const intersectingObjects: SpatialGridObject[] = [];
        const lineLengthSquared = (toX - fromX) ** 2 + (toY - fromY) ** 2;

        for (const obj of candidates) {
            const objRadius = obj.radius || 0;
            const objX = obj.x;
            const objY = obj.y;

            // Calculate the closest point on the line segment to the object's center
            const t = Math.max(
                0,
                Math.min(
                    1,
                    ((objX - fromX) * (toX - fromX) + (objY - fromY) * (toY - fromY)) / lineLengthSquared
                )
            );

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

export interface SpatialGridObject {
    /**
     * The x-coordinate of the object's center.
     */
    x: number;

    /**
     * The y-coordinate of the object's center.
     */
    y: number;

    /**
     * The radius of the object. If omitted, the object is treated as a point.
     */
    radius?: number;

    /**
     * The left boundary of the object. If omitted, `x - radius` is used.
     */
    left?: number;

    /**
     * The right boundary of the object. If omitted, `x + radius` is used.
     */
    right?: number;

    /**
     * The top boundary of the object. If omitted, `y - radius` is used.
     */
    top?: number;

    /**
     * The bottom boundary of the object. If omitted, `y + radius` is used.
     */
    bottom?: number;
}