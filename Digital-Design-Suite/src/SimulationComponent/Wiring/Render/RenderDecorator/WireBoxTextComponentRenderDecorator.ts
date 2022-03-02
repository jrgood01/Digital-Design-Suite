import * as PIXI from "pixi.js";
import {RenderObjectDecorator} from "../../../RenderObjectDecorator";
import {WireBoxTextComponentRenderObject} from "../RenderObject/WireBoxTextComponentRenderObject";
import {ComponentColor} from "../../../ComponentColor";

export class WireBoxTextComponentRenderDecorator implements RenderObjectDecorator {
    private target : WireBoxTextComponentRenderObject;
    private textObject : PIXI.Text;
    constructor(target : WireBoxTextComponentRenderObject) {
        this.target = target;
    }

    linkText(text : PIXI.Text) {
        this.textObject = text;
    }

    render(x : number, y : number, graphic : PIXI.Graphics) {
        this.target.render(x, y, graphic, this.textObject);
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