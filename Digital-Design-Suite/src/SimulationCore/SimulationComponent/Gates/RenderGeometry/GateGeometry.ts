import * as PIXI from 'pixi.js'
import * as constants from "../../../../constants";
import {ComponentRenderObject} from "../../ComponentRenderObject";
import {GateComponentColor} from "../GateComponentColor";
import {RenderObjectDecorator} from "../../RenderObjectDecorator";

export class GateGeometry {
    static generateNotGateGeometry = (x: number, y: number) => {
        const retMap = {} as Record<string, number>
        retMap['scaler'] = 1;
        retMap['componentLineWidth'] = 10;
        retMap['wireLineWidth'] = 7;
        retMap['componentLength'] = 130;
        retMap['componentHeight'] = 100;

        retMap['cornerX'] = x;
        retMap['cornerY'] = y;
        
        retMap['topWireStartX'] = retMap['cornerX'];
        retMap['topWireStartY'] = retMap['cornerY'] + 3.9 
        retMap['topWireEndX'] = retMap['cornerX'] + retMap['componentLength']
        retMap['topWireEndY'] = retMap['cornerY'] + (retMap['componentHeight'] / 2);

        retMap['bottomWireStartX'] = retMap['cornerX'];
        retMap['bottomWireStartY'] = retMap['cornerY'] + retMap['componentHeight'] - 3.9 ;
        retMap['bottomWireEndX'] = retMap['cornerX'] + retMap['componentLength'];
        retMap['bottomWireEndY'] = retMap['cornerY'] + (retMap['componentHeight'] / 2);

        retMap['outputWireLength'] = 60;
        retMap['outputWireStartX'] = retMap['cornerX'] + retMap['componentLength'];
        retMap['outputWireStartY'] = retMap['cornerY'] + (retMap['componentHeight'] / 2);
        retMap['outputWireEndX'] = retMap['cornerX'] + retMap['componentLength'] + 70 ;
        retMap['outputWireEndY'] = retMap['cornerY'] + (retMap['componentHeight'] / 2)
        return retMap
    }
    static generateAndNandGateGeometry = (x: number, y: number) => {
        const retMap = {} as Record<string, number>

        retMap['startX'] = x;
        retMap['startY'] = y;
        retMap['componentHeight'] = 180;

        retMap['width1'] = 78;

        retMap['arcCenterX'] = x + retMap['width1'];
        retMap['arcCenterY'] = (retMap['startY'] + retMap['componentHeight'] / 2)

        retMap['verticalLineTopX'] = retMap['startX'];
        retMap['verticalLineTopY'] = retMap['startY'] - 5;

        retMap['verticalLineBottomX'] = retMap['startX'];
        retMap['verticalLineBottomY'] = retMap['startY'] + retMap['componentHeight'] + 5;

        retMap['outputWireStartX'] = retMap['startX'] + retMap['componentHeight'] - 7;
        retMap['outputWireStartY'] = (retMap['startY'] + retMap['componentHeight'] / 2);
        retMap['outputWireLength'] = 68;

        retMap['inputSpacingLen'] = retMap['componentHeight'] / 5;

        return retMap;
    }

    static generateOrNorGateGeometry = (x: number, y: number) => {
        const retMap = {} as Record<string, number>
        const componentHeight = 180;
        retMap['startX'] = x;
        retMap['startY'] = y;

        retMap['baseCurveIntensity'] = 50;
        retMap['sideCurveIntensity'] = 5;
        retMap['componentWidth'] = 200;

        retMap['yMidPoint'] = y + componentHeight / 2;
        retMap['xMidPoint'] = x + retMap['componentWidth'] / 2;

        retMap['baseCurveStartX'] = x;
        retMap['baseCurveStartY'] = y;

        retMap['baseCurveControlX'] = x + retMap['baseCurveIntensity'];
        retMap['baseCurveControlY'] = retMap['yMidPoint'];

        retMap['baseCurveEndX'] = x;
        retMap['baseCurveEndY'] = y + componentHeight;

        retMap['bottomCurveStartX'] = retMap['baseCurveEndX'];
        retMap['bottomCurveStartY'] = retMap['baseCurveEndY'];

        retMap['bottomCurveEndX'] = x + retMap['componentWidth'];
        retMap['bottomCurveEndY'] = retMap['yMidPoint'];

        retMap['bottomCurveControlPointX'] = retMap['xMidPoint'] +10;
        retMap['bottomCurveControlPointY'] = y + componentHeight + retMap['sideCurveIntensity'];

        retMap['topCurveStartX'] = retMap['bottomCurveEndX'];
        retMap['topCurveStartY'] = retMap['bottomCurveEndY'];

        retMap['topCurveEndX'] = x - 2.7;
        retMap['topCurveEndY'] = y + 3.5;

        retMap['topCurveControlPointX'] = retMap['xMidPoint'] +10;
        retMap['topCurveControlPointY'] = y - retMap['sideCurveIntensity'];

        retMap['outputWireLength'] = 80;

        retMap['outputWireStartX'] = retMap['startX'] + 200;
        retMap['outputWireStartY'] = retMap['yMidPoint'];

        retMap['outputWireEndX'] = retMap['outputWireStartX'] + retMap['outputWireLength'];
        retMap['outputWireEndY'] = retMap['outputWireStartY'];
        return retMap;
    }
    
    static generateXorXnorGeometry = (x: number, y: number) => {
        const retMap = {} as Record<string, number>
        const componentHeight = 180;
        retMap['startX'] = x;
        retMap['startY'] = y;

        retMap['baseCurveIntensity'] = 50;
        retMap['sideCurveIntensity'] = 5;
        retMap['componentWidth'] = 200;

        retMap['yMidPoint'] = y + componentHeight / 2;
        retMap['xMidPoint'] = x + retMap['componentWidth'] / 2;

        retMap['baseCurveStartX'] = x;
        retMap['baseCurveStartY'] = y;

        retMap['baseCurveControlX'] = x + retMap['baseCurveIntensity'];
        retMap['baseCurveControlY'] = retMap['yMidPoint'];

        retMap['baseCurveEndX'] = x;
        retMap['baseCurveEndY'] = y + componentHeight;

        retMap['baseCurve2StartX'] = x - 30;
        retMap['baseCurve2StartY'] = y;

        retMap['baseCurve2ControlX'] = x + retMap['baseCurveIntensity'] - 30;
        retMap['baseCurve2ControlY'] = retMap['yMidPoint'];

        retMap['baseCurve2EndX'] = x - 30;
        retMap['baseCurve2EndY'] = y + componentHeight;

        retMap['bottomCurveStartX'] = retMap['baseCurveEndX'];
        retMap['bottomCurveStartY'] = retMap['baseCurveEndY'];

        retMap['bottomCurveEndX'] = x + retMap['componentWidth'];
        retMap['bottomCurveEndY'] = retMap['yMidPoint'];

        retMap['bottomCurveControlPointX'] = retMap['xMidPoint'] +10;
        retMap['bottomCurveControlPointY'] = y + componentHeight + retMap['sideCurveIntensity'];

        retMap['topCurveStartX'] = retMap['bottomCurveEndX'];
        retMap['topCurveStartY'] = retMap['bottomCurveEndY'];

        retMap['topCurveEndX'] = x - 2.7;
        retMap['topCurveEndY'] = y + 3.5;

        retMap['topCurveControlPointX'] = retMap['xMidPoint'] +10;
        retMap['topCurveControlPointY'] = y - retMap['sideCurveIntensity'];

        retMap['outputWireLength'] = 80;

        retMap['outputWireStartX'] = retMap['startX'] + 200;
        retMap['outputWireStartY'] = retMap['yMidPoint'];

        retMap['outputWireEndX'] = retMap['outputWireStartX'] + retMap['outputWireLength'];
        retMap['outputWireEndY'] = retMap['outputWireStartY'];
        
        return retMap;
    }
    
    static drawAndGate = (x: number, y: number, graphic : PIXI.Graphics, colors : GateComponentColor) => {
        const geometry = this.generateAndNandGateGeometry(x, y);

        graphic.lineStyle(10, colors.bodyColor)
            .moveTo(geometry['startX'], geometry['startY'])
            .lineTo(geometry['startX'] + geometry['width1'],
                geometry['startY'])
            .moveTo(geometry['startX'], geometry['startY'] + geometry['componentHeight'])
            .lineTo(geometry['startX'] + geometry['width1'],
                geometry['startY'] + geometry['componentHeight'])
            .moveTo(geometry['verticalLineTopX'], geometry['verticalLineTopY'])
            .lineTo(geometry['verticalLineBottomX'], geometry['verticalLineBottomY']);

        graphic.moveTo(geometry['startX'] + geometry['width1'],
            geometry['startY'])
        graphic.arc(geometry['arcCenterX'], geometry['arcCenterY'], geometry['componentHeight'] / 2, (3*Math.PI)/2, (Math.PI)/2);
        graphic.lineStyle(7, colors.outputWireColor())

            .moveTo(geometry['outputWireStartX'], geometry['outputWireStartY'])
            .lineTo(geometry['outputWireStartX'] + geometry['outputWireLength'], geometry['outputWireStartY']);
    }

    static drawNandGate = (x: number, y: number, graphic : PIXI.Graphics, colors : GateComponentColor) => {
        const geometry = this.generateAndNandGateGeometry(x, y);
        this.drawAndGate(x, y, graphic, colors);
        graphic.lineStyle(5, colors.bodyColor);
        graphic.beginFill(constants.General.BgColor_1)
            .drawCircle(geometry['outputWireStartX'] + 13, geometry['outputWireStartY'], 13);
    }
    
    
    static drawOrGate = (x: number, y: number, graphic : PIXI.Graphics, colors : GateComponentColor) => {
        const geometry = this.generateOrNorGateGeometry(x, y);
        graphic.lineStyle(5, colors.bodyColor);
        graphic.lineStyle(10, colors.bodyColor);
        graphic.moveTo(geometry['baseCurveStartX'], geometry['baseCurveStartY'])
            .quadraticCurveTo(geometry['baseCurveControlX'], geometry['baseCurveControlY'],
                geometry['baseCurveEndX'], geometry['baseCurveEndY'])
            .quadraticCurveTo(geometry['bottomCurveControlPointX'], geometry['bottomCurveControlPointY'],
                geometry['bottomCurveEndX'], geometry['bottomCurveEndY'])
            .quadraticCurveTo(geometry['topCurveControlPointX'], geometry['topCurveControlPointY'],
                geometry['topCurveEndX'], geometry['topCurveEndY'])
        graphic.lineStyle(7, colors.bodyColor);
        graphic.moveTo(geometry['outputWireStartX'], geometry['outputWireStartY'])
            .lineTo(geometry['outputWireEndX'], geometry['outputWireEndY'])
    }

    static drawNorGate = (x: number, y: number, graphic : PIXI.Graphics, colors : GateComponentColor) => {
        const geometry = this.generateOrNorGateGeometry(x, y);
        GateGeometry.drawOrGate(x, y, graphic, colors);
        graphic.beginFill(constants.General.BgColor_1)
            .drawCircle(geometry['outputWireStartX'] + 13, geometry['outputWireStartY'], 13);
    }

    static drawXorGate = (x: number, y: number, graphic : PIXI.Graphics, colors : GateComponentColor) => {
        const geometry = this.generateXorXnorGeometry(x, y);
        graphic.moveTo(geometry['baseCurveStartX'], geometry['baseCurveStartY'])
            .quadraticCurveTo(geometry['baseCurveControlX'], geometry['baseCurveControlY'],
                geometry['baseCurveEndX'], geometry['baseCurveEndY'])
            .quadraticCurveTo(geometry['bottomCurveControlPointX'], geometry['bottomCurveControlPointY'],
                geometry['bottomCurveEndX'], geometry['bottomCurveEndY'])
            .quadraticCurveTo(geometry['topCurveControlPointX'], geometry['topCurveControlPointY'],
                geometry['topCurveEndX'], geometry['topCurveEndY'])
        graphic.lineStyle(7, colors.bodyColor);
        graphic.moveTo(geometry['outputWireStartX'], geometry['outputWireStartY'])
            .lineTo(geometry['outputWireEndX'], geometry['outputWireEndY'])
        graphic.moveTo(geometry['baseCurve2StartX'], geometry['baseCurve2StartY'])
            .quadraticCurveTo(geometry['baseCurve2ControlX'], geometry['baseCurve2ControlY'],
                geometry['baseCurve2EndX'], geometry['baseCurve2EndY'])
    }

    static drawXnorGate = (x: number, y: number, graphic : PIXI.Graphics, colors : GateComponentColor) => {
        const geometry = this.generateXorXnorGeometry(x, y);
        this.drawXorGate(x, y, graphic, colors);
        graphic.beginFill(constants.General.BgColor_1)
            .drawCircle(geometry['outputWireStartX'] + 13, geometry['outputWireStartY'], 13);
    }

    static drawNotGate = (x: number, y: number, graphic : PIXI.Graphics, colors : GateComponentColor) => {
        const geometry = this.generateNotGateGeometry(x, y);
        graphic.lineStyle(geometry['componentLineWidth'], colors.bodyColor)
            .moveTo(geometry['cornerX'], geometry['cornerY'])
            .lineTo(geometry['cornerX'], geometry['cornerY'] + geometry['componentHeight']);

        graphic.lineStyle(geometry['wireLineWidth'], colors.outputWireColor())
            .moveTo(geometry['outputWireStartX'], geometry['outputWireStartY'])
            .lineTo(geometry['outputWireEndX'], geometry['outputWireEndY']);

        graphic.lineStyle(geometry['componentLineWidth'], colors.bodyColor)
            .moveTo(geometry['topWireStartX'], geometry['topWireStartY'])
            .lineTo(geometry['topWireEndX'], geometry['topWireEndY']);

        graphic.lineStyle(geometry['componentLineWidth'], colors.bodyColor)
            .moveTo(geometry['bottomWireStartX'], geometry['bottomWireStartY'])
            .lineTo(geometry['bottomWireEndX'], geometry['bottomWireEndY']);
    }    
}
