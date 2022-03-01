import {ComponentRenderObject} from "../../ComponentRenderObject";
import {GateComponentColor} from "../GateComponentColor";
import * as PIXI from "pixi.js";

export class GateRenderObjectDecorator {
    private target : ComponentRenderObject;
    constructor(target : ComponentRenderObject) {
        this.target = target;
    }

    render(x : number, y : number, graphic : PIXI.Graphics) {
        this.target.render(x, y, graphic);
    }

    getGeometry(x : number, y : number) {
        return this.target.getGeometry(x, y);
    }

    getColors() : GateComponentColor {
        return this.target.getColors() as GateComponentColor;
    }

    setColors(colors : GateComponentColor) {
        this.target.setColors(colors);
    }
}