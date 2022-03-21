import {ComponentColor} from "../../../ComponentColor";
import {ClockRenderDecorator} from "../RenderDecorator/ClockRenderDecorator";
import {ClockGeometry} from "../Geometry/ClockGeometry";
import {ClockRenderObject} from "../RenderObject/ClockRenderObject";

export class ClockFactory {
    static generateClock(color : ComponentColor) {
        return new ClockRenderDecorator(new ClockRenderObject(ClockGeometry.generateClockGeometry, ClockGeometry.drawClock, color));
    }
}