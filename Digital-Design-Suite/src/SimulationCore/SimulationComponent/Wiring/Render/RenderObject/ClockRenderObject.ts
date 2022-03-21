import * as PIXI from "pixi.js";
import {ComponentColor} from "../../../ComponentColor";

export class ClockRenderObject {
    private geometry : (x : number, y : number, state : boolean) => Record<string, number>;
    private draw : (x : number, y : number, graphic : PIXI.Graphics, state : boolean,
                    color : ComponentColor) => void;
    private colors : ComponentColor;
    constructor(geometry : (x : number, y : number, state : boolean) => Record<string, number>,
                draw : (x : number, y : number, graphic : PIXI.Graphics, state : boolean, color : ComponentColor) => void,
                colors : ComponentColor) {
        this.geometry = geometry;
        this.draw = draw;
        this.colors = colors;
    }

    render(x : number, y : number, graphic : PIXI.Graphics, state : boolean) {
        this.draw(x, y, graphic, state, this.colors);
    }

    getGeometry(x : number, y : number, state : boolean) {
        return this.geometry(x, y, state);
    }

    setColors(colors : ComponentColor) {
        this.colors = colors;
    }

    getColors() {
        return this.colors;
    }
}
