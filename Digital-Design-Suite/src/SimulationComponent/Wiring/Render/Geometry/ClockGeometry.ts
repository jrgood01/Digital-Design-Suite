import * as PIXI from "pixi.js";
import {ComponentColor} from "../../../ComponentColor";
import {WireComponentGeometry} from "./WireComponentGeometry";
export class ClockGeometry {
    static generateClockGeometry = (x : number, y : number, state : boolean) => {
        const retMap = WireComponentGeometry.generateWiringBoxGeometry(x, y);
        const offsetY = 25;
        const offsetX = 15;
        const lineOneY = state ? y + retMap['sideLength'] - offsetY : y + offsetY;

        retMap['lineOneStartX'] = x + offsetX;
        retMap['lineOneStartY'] = lineOneY;

        retMap['lineOneEndX'] = x + retMap['sideLength'] / 2;
        retMap['lineOneEndY'] = lineOneY;

        retMap['lineTwoStartX'] = retMap['lineOneEndX'] - 3.5;
        retMap['lineTwoStartY'] = retMap['lineOneEndY'];

        retMap['lineTwoEndX'] = retMap['lineOneEndX'] - 3.5;
        retMap['lineTwoEndY'] = retMap['lineOneEndY'] - (state ? retMap['sideLength'] / 2 : -retMap['sideLength'] / 2);

        const lineOneLen = retMap['lineOneEndX'] - retMap['lineOneStartX'];
        retMap['lineThreeStartX'] = retMap['lineTwoEndX'] - 3.5;
        retMap['lineThreeStartY'] = retMap['lineTwoEndY'];

        retMap['lineThreeEndX'] = retMap['lineThreeStartX'] + lineOneLen
        retMap['lineThreeEndY'] = retMap['lineThreeStartY'];

        return retMap;
    }

    static drawClock = (x: number, y: number, graphic: PIXI.Graphics, state : boolean, colors: ComponentColor) => {
        const geometry = this.generateClockGeometry(x, y, state);
        graphic.clear();

        WireComponentGeometry.drawWiringBox(x, y, graphic, colors);

        graphic.lineStyle(7, colors.bodyColor())
            .moveTo(geometry['lineOneStartX'], geometry['lineOneStartY'])
            .lineTo(geometry['lineOneEndX'], geometry['lineOneEndY']);

        graphic.lineStyle(7, colors.bodyColor())
            .moveTo(geometry['lineTwoStartX'], geometry['lineTwoStartY'])
            .lineTo(geometry['lineTwoEndX'], geometry['lineTwoEndY']);

        graphic.lineStyle(7, colors.bodyColor())
            .moveTo(geometry['lineThreeStartX'], geometry['lineThreeStartY'])
            .lineTo(geometry['lineThreeEndX'], geometry['lineThreeEndY']);
    }
}