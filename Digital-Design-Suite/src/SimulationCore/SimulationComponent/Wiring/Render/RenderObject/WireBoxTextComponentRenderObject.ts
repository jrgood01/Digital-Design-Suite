import * as PIXI from "pixi.js";
import {ComponentColor} from "../../../ComponentColor";
import {ComponentRenderObject} from "../../../ComponentRenderObject";

export class WireBoxTextComponentRenderObject {
    private geometry : (x : number, y : number) => Record<string, number>;
    private draw : (x : number, y : number, graphic : PIXI.Graphics, text : PIXI.Text,
                    color : ComponentColor) => void;
    private colors : ComponentColor;
    constructor(geometry : (x : number, y : number) => Record<string, number>,
                draw : (x : number, y : number, graphic : PIXI.Graphics, text : PIXI.Text, color : ComponentColor) => void,
                colors : ComponentColor) {
        this.geometry = geometry;
        this.draw = draw;
        this.colors = colors;
    }

    render(x : number, y : number, graphic : PIXI.Graphics, text : PIXI.Text) {
        this.draw(x, y, graphic, text, this.colors);
    }

    getGeometry(x : number, y : number) {
        return this.geometry(x, y);
    }

    setColors(colors : ComponentColor) {
        this.colors = colors;
    }

    getColors() {
        return this.colors;
    }
}
