import {WireBoxTextComponentRenderDecorator} from "./WireBoxTextComponentRenderDecorator";
import {WireComponentGeometry} from "./WireComponentGeometry";
import {WireBoxTextComponentRenderObject} from "./WireBoxTextComponentRenderObject";
import * as PIXI from 'pixi.js'
import {ComponentColor} from "../../ComponentColor";

export class WireBoxTextFactory {
    static generateWireBoxText(color : ComponentColor) {
        return new WireBoxTextComponentRenderDecorator(new WireBoxTextComponentRenderObject(
            WireComponentGeometry.generateWiringBoxGeometry, WireComponentGeometry.drawWiringBoxWithText, color))
    }
}