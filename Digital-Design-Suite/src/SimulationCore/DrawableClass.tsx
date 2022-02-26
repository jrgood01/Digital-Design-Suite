import * as PIXI from 'pixi.js'
export abstract class DrawableClass {
    protected x : number;
    protected  y : number;
    protected graphic : PIXI.Graphics;
    protected container : PIXI.Container;
    constructor(x : number, y : number, container : PIXI.Container) {
        this.x = x;
        this.y = y;
        this.container = container;
        this.graphic = new PIXI.Graphics();
    }

    abstract draw() : void;
    abstract updateHitArea() : void;

    getGraphic() {
        return this.graphic
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    setXY(x : number, y : number) {
        this.x = x;
        this.y = y;
        this.graphic.clear();
        this.draw();
        this.updateHitArea();
    }

    translate(dX : number, dY : number) {
        this.x += dX;
        this.y += dY;
        this.draw();
        this.updateHitArea();
    }
}