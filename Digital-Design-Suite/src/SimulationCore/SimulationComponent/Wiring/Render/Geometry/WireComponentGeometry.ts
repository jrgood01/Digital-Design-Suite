import * as PIXI from 'pixi.js'
import {ComponentColor} from "../../../ComponentColor";

export class WireComponentGeometry {
    static generateWiringBoxGeometry = (x : number, y : number) => {
        const retMap = {} as Record<string, number>;
        retMap['sideLength'] = 100;
        retMap['outLineStartX'] = x + retMap['sideLength'];
        retMap['outLineStartY'] = y + retMap['sideLength'] / 2;

        retMap['outLineLength'] = 100;

        retMap['outLineEndX'] = retMap['outLineStartX'] + retMap['outLineLength'];
        retMap['outLineEndY'] = retMap['outLineStartY'];

        return retMap;
    }

    static drawWiringBox = (x : number, y : number, graphic : PIXI.Graphics, colors : ComponentColor) => {
        const geometry = this.generateWiringBoxGeometry(x, y);
        graphic.clear();
        graphic.lineStyle(10, colors.bodyColor())
            .drawRect(x, y, geometry['sideLength'], geometry['sideLength']);
        graphic.lineStyle(7, colors.bodyColor())
            .moveTo(geometry['outLineStartX'], geometry['outLineStartY'])
            .lineTo(geometry['outLineEndX'], geometry['outLineEndY']);
    }

    static drawWiringBoxWithText = (x : number, y : number, graphic : PIXI.Graphics, text : PIXI.Text, colors : ComponentColor) => {
        const geometry = this.generateWiringBoxGeometry(x, y);

        graphic.clear();

        this.drawWiringBox(x, y, graphic, colors);

        text.style = {fontFamily : 'Ariel', fontSize : 25, fill : colors.bodyColor()}
        text.position.x = x + (geometry['sideLength'] / 2 + 28) - text.width;
        text.position.y = y + (geometry['sideLength'] / 2 + 14) - text.height;
    }

    static drawClock = (x : number, y : number, graphic : PIXI.Graphics, text : PIXI.Text, colors : ComponentColor) => {
        const geometry = this.generateWiringBoxGeometry(x, y);

        graphic.clear();

        this.drawWiringBox(x, y, graphic, colors);

        text.style = {fontFamily : 'Ariel', fontSize : 25, fill : colors.bodyColor()}
        text.position.x = x + (geometry['sideLength'] / 2 + 28) - text.width;
        text.position.y = y + (geometry['sideLength'] / 2 + 14) - text.height;
    }
}