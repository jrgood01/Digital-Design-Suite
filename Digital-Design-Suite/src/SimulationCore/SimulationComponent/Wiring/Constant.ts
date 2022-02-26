import { SimulationComponent } from "../SimulationComponent";
import { SimulationState } from "../../SimulationState";
import * as constants from "../../../constants"
import * as PIXI from 'pixi.js'
import { wireState } from "../../../SimulationCore/WireStates";
export class ConstantComponent extends SimulationComponent {
    value : number;
    private text : PIXI.Text;
    constructor(x : number, y : number, container : PIXI.Container, bitSize : number) {
        super(x, y, container, 0, 1, Array<number>(0).fill(1), Array<number>(1).fill(bitSize));
        this.value = Math.pow(2, bitSize) - 1; //set value to max
        this.x = x;
        this.y = y;
        this.text = new PIXI.Text(this.value.toString());
        this.componentTemplate.addChild(this.text);
        this.geometry = this.calculateGeometry(1);
        this.addWiringArea(this.geometry['outLineEndX'] - 3.5, this.geometry['outLineEndY'] - 3.5, 
        0, false);
    } 

    simulate() {
        this.output.setLineBit(0, 0, wireState.High)
    }

    calculateGeometry(scaler : number) {
        let retMap = {} as Record<string, number>;
        retMap['sideLength'] = 200 * scaler;
        retMap['outLineStartX'] = this.x + retMap['sideLength'];
        retMap['outLineStartY'] = this.y + retMap['sideLength'] / 2;

        retMap['outLineLength'] = 100 * scaler;

        retMap['outLineEndX'] = retMap['outLineStartX'] + retMap['outLineLength'];
        retMap['outLineEndY'] = retMap['outLineStartY'];

         return retMap;
    }

    getColor() {
        if (this.selected) {
            return constants.General.selectedColor;
        }
        if (this.value > 0) {
            return constants.General.componentColorHigh;
        } else {
            return constants.General.componentColorLow;
        }
    }

    draw() {

        this.setGlowColor(this.getColor())
        this.componentTemplate.clear();
        this.componentTemplate.lineStyle(10, this.getColor())
            .drawRect(this.x, this.y, this.geometry['sideLength'], this.geometry['sideLength']);
        this.componentTemplate.lineStyle(7, this.getColor())
            .moveTo(this.geometry['outLineStartX'], this.geometry['outLineStartY'])
            .lineTo(this.geometry['outLineEndX'], this.geometry['outLineEndY'])
        this.text.style = {fontFamily : 'Ariel', fontSize : 60, fill : this.getColor()}
        this.text.position.x = this.x + 120 - this.text.width;
        this.text.position.y = this.y + 130 - this.text.height;
        this.updateHitArea();
        
    }
}