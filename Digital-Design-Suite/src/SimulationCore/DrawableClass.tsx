import * as PIXI from 'pixi.js'

/**
 * Represents drawable PIXI object
 */
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

    /**
     * Get graphic
     */
    getGraphic() {
        return this.graphic
    }

    /**
     * Get x location
     */
    getX() {
        return this.x;
    }

    /**
     * Get y location
     */
    getY() {
        return this.y;
    }

    /**
     * Set the x and y values of the
     * @param x new x val
     * @param y new y val
     */
    setXY(x : number, y : number) {
        this.x = x;
        this.y = y;
        this.graphic.clear();
        this.draw();
        this.updateHitArea();
    }

    /**
     * translate the PIXI object
     * @param dX translate x amount
     * @param dY translate y amount
     */
    translate(dX : number, dY : number) {
        this.x += dX;
        this.y += dY;
        this.draw();
        this.updateHitArea();
    }

    register() {
        this.container.addChild(this.graphic);
    }

    unRegister() {
        this.container.removeChild(this.graphic);
    }
}