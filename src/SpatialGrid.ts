export class SpatialGrid {
    width: number;
    height: number;
    tileSize: number;
    objects: SpatialGridObject[] = [];

    /**
     * A flattened grid of xTiles * yTiles that contains list of the objects registered to each tile
     */
    #grid: SpatialGridObject[][] = [];

    constructor(width: number, height: number, tileSize: number) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
    }

    add(...objects: SpatialGridObject[]) {
        
    }

    remove(...objects: SpatialGridObject[]) {
        
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
    getNeighbors(x: number, y: number, neighborTiles: number = 1) {
        
    }

    /**
     * First use getNeighbors() to find candidates, then narrow down with intersecting circle math
     * Requires that objects have a radius value, otherwise they are treated like a point
     */
    getObjectsIntersectingCircle(x: number, y: number, radius: number) {
        
    }

    /**
     * First use getNeighbors() to find candidates, then narrow down using intersecting rectangle math
     * Requires that  objects have a {left,right,top,bottom} value, otherwise they are treated like a point using {x,y}
     */
    getObjectsIntersectingRect(x: number, y: number, width: number, height: number) {
        
    }

    /**
     * Collections neighbors all tiles intersecting the line segment, and neighbor tiles based on 
     * neighbor tiles based on the width (if not 0)
     */
    getObjectsIntersectingLine(fromX: number, fromY: number, toX: number, toY: number, width: number = 0) {
        
    }
}

export interface SpatialGridObject {
    x: number;
    y: number;
    radius?: number;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
}