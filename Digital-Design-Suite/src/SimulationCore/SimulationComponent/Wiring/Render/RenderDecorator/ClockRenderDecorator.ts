import * as PIXI from "pixi.js";
import {RenderObjectDecorator} from "../../../RenderObjectDecorator";
import {WireBoxTextComponentRenderObject} from "../RenderObject/WireBoxTextComponentRenderObject";
import {ComponentColor} from "../../../ComponentColor";
import {ClockRenderObject} from "../RenderObject/ClockRenderObject";

export class ClockRenderDecorator implements RenderObjectDecorator {
    private target : ClockRenderObject;
    private state : Boolean;

    constructor(target : ClockRenderObject) {
        this.target = target;
    }

    linkState(state : Boolean) {
        this.state = state;
    }

    render(x : number, y : number, graphic : PIXI.Graphics) {
        this.target.render(x, y, graphic, this.state.valueOf());
    }

    getGeometry(x : number, y : number) {
        return this.target.getGeometry(x, y);
    }

    getColors() {
        return this.target.getColors();
    }

    setColors(colors : ComponentColor) {
        this.target.setColors(colors);
    }
}