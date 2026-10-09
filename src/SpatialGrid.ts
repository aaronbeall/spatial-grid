import { SpatialGridObject } from "./SpatialGrid";

export type SpatialGridObject = { 
  x: number;
  y: number;
  width: number;
  height: number;
}

export class SpatialGrid<T extends SpatialGridObject> {
  
  public readonly width: number;
  public readonly height: number;
  public readonly cellSize: number;
  public readonly objects: T[] = [];
  private grid: T[][] = [];

  constructor(width: number, height: number, cellSize: number) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
  }

  get rowsCount() {
    return Math.ceil(this.width / this.cellSize);
  }

  get columnsCount() {
    return Math.ceil(this.height / this.cellSize);
  }

  add(obj: T) {
    if (this.objects.indexOf(obj) == -1)
      this.objects.push(obj);
  }

  remove(obj: T) {
    const index = this.objects.indexOf(obj);
    if (index != -1)
      this.objects.splice(index, 1);
  }

  update() {
    const length = this.rowsCount * this.columnsCount;
    this.grid = Array.from(new Array(length))
    this.objects.forEach(obj => {
      const { x, y, width, height } = obj;
      const xMin = Math.floor(x);
      const yMin = Math.floor(y);
      const xMax = Math.floor(x + width);
      const yMax = Math.floor(y + height);
      this.addToCell(obj, yMin, xMin);
      this.addToCell(obj, yMax, xMin);
      this.addToCell(obj, yMax, xMax);
      this.addToCell(obj, yMin, xMax);
    });
  }

  private addToCell(obj: T, row: number, col: number) {
    const cellIndex = row * this.columnsCount + col;
    this.grid[cellIndex]
      ? this.grid[cellIndex].push(obj)
      : this.grid[cellIndex] = [obj];
  }

  getObjectsAtCell(row: number, col: number): T[] {

  }

  getObjectsAtCells(startRow: number, startCol: number, endRow: number, endCol: number): T[] {
    
  }

  getNeighborsNearCell(row: number, col: number, cellDistance = 1): T[] {

  }

  getNeighborsNearPoint(x: number, y: number, radius: number): T[] {

  }

  getObjectsInCircle(x: number, y: number, radius: number): T[] {

  }

  getObjectsInRectangle(rect: { left: number, top: number, right: number, bottom: number }): T[] {

  }

  getObjectsInLine(from: { x: number; y: number; }, to: { x: number; y: number; }, lineRadius: number): T[] {

  }
  
  getAllCollidingObjects(): T[] {

  }

  static isColliding(a: SpatialGridObject, b: SpatialGridObject): boolean {
    
  }

  static isRectangle(obj: SpatialGridObject): obj is Rectangle {
    return "width" in obj && "height" in obj;
  }

  static isCircle(obj: SpatialGridObject): obj is Circle {
    return "radius" in obj;
  }
}