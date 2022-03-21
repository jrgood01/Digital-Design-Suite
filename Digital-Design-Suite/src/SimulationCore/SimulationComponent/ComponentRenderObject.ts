//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import * as PIXI from 'pixi.js'
import {ComponentColor} from "./ComponentColor";
import {GateComponentColor} from "./Gates/Render/GateComponentColor";

export class ComponentRenderObject {
    private geometry : (x : number, y : number) => Record<string, number>;
    private draw : (x : number, y : number, graphic : PIXI.Graphics, color : ComponentColor) => void;
    private colors : ComponentColor;
    constructor(geometry : (x : number, y : number) => Record<string, number>,
                draw : (x : number, y : number, graphic : PIXI.Graphics, color : ComponentColor) => void,
                colors : ComponentColor) {
        this.geometry = geometry;
        this.draw = draw;
        this.colors = colors;
    }

    render(x : number, y : number, graphic : PIXI.Graphics) {
        this.draw(x, y, graphic, this.colors);
    }

    getGeometry(x : number, y : number) {
        return this.geometry(x, y);
    }

    setColors(colors : GateComponentColor) {
        this.colors = colors;
    }

    getColors() {
        return this.colors;
    }
}
