import { GameConfig } from './GameConfig';

export class GridModel {
    private readonly width = GameConfig.GridWidth;
    private readonly height = GameConfig.GridHeight;
    private cells: Int8Array = new Int8Array(this.width * this.height);

    public clear(): void {
        this.cells.fill(0);
    }

    public getCell(x: number, y: number): number {
        return this.cells[y * this.width + x];
    }

    public canPlace(shapeBlocks: ReadonlyArray<{ x: number; y: number }>, gridX: number, gridY: number): boolean {
        for (let i = 0; i < shapeBlocks.length; i++) {
            const tx = gridX + shapeBlocks[i].x;
            const ty = gridY + shapeBlocks[i].y;

            if (tx < 0 || tx >= this.width || ty < 0 || ty >= this.height) return false;
            if (this.getCell(tx, ty) !== 0) return false;
        }
        return true;
    }

    public place(shapeBlocks: ReadonlyArray<{ x: number; y: number }>, gridX: number, gridY: number, shapeId: number): void {
        for (let i = 0; i < shapeBlocks.length; i++) {
            this.cells[(gridY + shapeBlocks[i].y) * this.width + (gridX + shapeBlocks[i].x)] = shapeId;
        }
    }

    public processLines(outClearedIndices: number[]): boolean {
        outClearedIndices.length = 0;
        let rowMask = 0;
        let colMask = 0;

        for (let y = 0; y < this.height; y++) {
            let rowFull = true;
            for (let x = 0; x < this.width; x++) {
                if (this.getCell(x, y) === 0) rowFull = false;
            }
            if (rowFull) rowMask |= 1 << y;
        }

        for (let x = 0; x < this.width; x++) {
            let colFull = true;
            for (let y = 0; y < this.height; y++) {
                if (this.getCell(x, y) === 0) colFull = false;
            }
            if (colFull) colMask |= 1 << x;
        }

        let linesCleared = false;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const clearRow = (rowMask & (1 << y)) !== 0;
                const clearCol = (colMask & (1 << x)) !== 0;

                if (clearRow || clearCol) {
                    linesCleared = true;
                    const idx = y * this.width + x;
                    this.cells[idx] = 0;
                    if (outClearedIndices.indexOf(idx) === -1) outClearedIndices.push(idx);
                }
            }
        }
        return linesCleared;
    }
    public canPlaceAnywhere(shapeBlocks: ReadonlyArray<{ x: number; y: number }>): boolean {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.canPlace(shapeBlocks, x, y)) {
                    return true;
                }
            }
        }
        return false;
    }
}
