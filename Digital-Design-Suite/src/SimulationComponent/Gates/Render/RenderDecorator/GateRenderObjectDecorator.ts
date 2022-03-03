//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {ComponentRenderObject} from "../../../ComponentRenderObject";
import {GateComponentColor} from "../GateComponentColor";
import * as PIXI from "pixi.js";
import {RenderObjectDecorator} from "../../../RenderObjectDecorator";

export class GateRenderObjectDecorator implements RenderObjectDecorator{
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