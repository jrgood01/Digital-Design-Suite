import {WireBoxTextComponentRenderDecorator} from "../RenderDecorator/WireBoxTextComponentRenderDecorator";
import {WireComponentGeometry} from "../Geometry/WireComponentGeometry";
import {WireBoxTextComponentRenderObject} from "../RenderObject/WireBoxTextComponentRenderObject";
import {ComponentColor} from "../../../ComponentColor";

export class WireBoxTextFactory {
    static generateWireBoxText(color : ComponentColor) {
        return new WireBoxTextComponentRenderDecorator(new WireBoxTextComponentRenderObject(
            WireComponentGeometry.generateWiringBoxGeometry, WireComponentGeometry.drawWiringBoxWithText, color))
    }
}