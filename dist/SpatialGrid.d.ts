/**
 * A spatial grid for efficiently managing and querying objects in a 2D space.
 *
 * The grid divides the space into tiles of a fixed size, allowing objects to be registered
 * to specific tiles. This enables efficient spatial queries, such as finding objects
 * within a circle, rectangle, or along a line segment.
 */
export declare class SpatialGrid {
    #private;
    width: number;
    height: number;
    tileSize: number;
    objects: SpatialGridObject[];
    debug: boolean;
    lastCheckedTiles: {
        x: number;
        y: number;
    }[];
    constructor({ width, height, tileSize, debug }: {
        width: number;
        height: number;
        tileSize: number;
        debug?: boolean;
    });
    /**
     * Adds objects to the grid.
     */
    add(...objects: SpatialGridObject[]): void;
    /**
     * Removes objects from the grid.
     */
    remove(...objects: SpatialGridObject[]): void;
    /**
     * Returns the number of horizontal tiles.
     */
    get xTiles(): number;
    /**
     * Returns the number of vertical tiles.
     */
    get yTiles(): number;
    /**
     * Updates the grid by assigning objects to their respective tiles.
     */
    update(): void;
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
    getNeighbors(x: number, y: number, neighborTiles?: number): SpatialGridObject[];
    /**
     * Returns objects intersecting a circle with the given center and radius.
     *
     * Note: Objects must have a `radius` property. If missing, they are treated as points.
     */
    getObjectsIntersectingCircle(x: number, y: number, radius: number): SpatialGridObject[];
    /**
     * Returns objects intersecting a rectangle with the given position and dimensions.
     *
     * Note: Objects must have `left`, `right`, `top`, and `bottom` properties. If missing, they are treated as points using `x` and `y`.
     */
    getObjectsIntersectingRect(x: number, y: number, width: number, height: number): SpatialGridObject[];
    /**
     * Returns objects intersecting a line segment with the given start, end, and width.
     */
    getObjectsIntersectingLine(fromX: number, fromY: number, toX: number, toY: number, width?: number): SpatialGridObject[];
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
