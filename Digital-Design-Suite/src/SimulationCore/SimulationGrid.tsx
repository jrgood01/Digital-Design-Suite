import * as PIXI from "pixi.js"

export class SimulationGrid {
    spacingX : number;
    spacingY : number;
    xMax : number;
    yMax : number;

    graphic : PIXI.Graphics;

    updated : boolean;

    constructor (spacingX : number, spacingY : number) {
        this.spacingX = spacingX;
        this.spacingY = spacingY;

        this.xMax = window.innerWidth;
        this.yMax = window.innerHeight;

        this.graphic = new PIXI.Graphics();
        this.updated = true;
    }

    setXMax(xMax : number) {
        this.xMax = xMax;
    }

    setYMax(yMax : number) {
        this.yMax = yMax;
    }

    update() {
        this.updated = true;
    }

    snapToGrid(point : PIXI.Point) {
        let distX = (point.x % this.spacingX);
        let x = point.x - distX;
        if (distX > this.spacingX / 2) {
            x += this.spacingX;
        }

        let distY = (point.y % this.spacingY);
        let y = point.y - distY;
        if (distY > this.spacingY / 2) {
            y += this.spacingY;
        }
        return new PIXI.Point(x, y);
    }

    draw(zoom : number) {
        if (this.updated) {
            this.graphic.clear();
            this.graphic.lineStyle(3 * ((1 / zoom) ** .45), 0x333333);
            for (let x = 0; x < this.xMax; x += this.spacingX) {
                this.graphic.moveTo(x, 0)
                    .lineTo(x, this.yMax);
            }

            for (let y = 0; y < this.xMax; y += this.spacingY) {
                this.graphic.moveTo(0, y)
                    .lineTo(this.xMax, y);
            }
            this.updated = false;
        }
    }
}