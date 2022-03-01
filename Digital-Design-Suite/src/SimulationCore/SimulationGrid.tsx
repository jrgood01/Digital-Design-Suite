//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import * as PIXI from "pixi.js"

export class SimulationGrid {
    spacingX : number;
    spacingY : number;

    xMax : number;
    yMax : number;

    graphic : PIXI.Graphics;

    updated : boolean;

    zoom : number;

    constructor (spacingX : number, spacingY : number) {
        this.spacingX = spacingX;
        this.spacingY = spacingY;

        this.xMax = window.innerWidth;
        this.yMax = window.innerHeight;

        this.graphic = new PIXI.Graphics();
        this.updated = true;
        this.zoom = 1;
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
        let scale = 1;
        if (this.zoom > 0) {
            scale += Math.floor(this.zoom / (this.spacingX / 10))
        }
        if (this.updated) {
            this.graphic.clear();
            this.graphic.lineStyle(3 * ((1 / zoom) ** .45), 0x333333);
            for (let x = 0; x < this.xMax; x += this.spacingX * scale) {
                this.graphic.moveTo(x, 0)
                    .lineTo(x, this.yMax);
            }

            for (let y = 0; y < this.xMax; y += this.spacingY * scale) {
                this.graphic.moveTo(0, y)
                    .lineTo(this.xMax, y);
            }
            this.updated = false;
        }
    }

    setZoom(newZoom : number) {
        this.zoom = newZoom;
    }

    incrememtZoom() {
        this.zoom += 1;
    }

    decrementZoom() {
        this.zoom -= 1;
    }
}