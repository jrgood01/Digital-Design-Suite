import { SimulationComponent } from "../SimulationComponent";
import { SimulationState } from "../../SimulationState";
import * as constants from "../../../constants"
import * as PIXI from 'pixi.js'
import { wireState } from "../../../SimulationCore/WireStates";
export class ConstantComponent extends SimulationComponent {
    value : number;
    private text : PIXI.Text;
    constructor(stage : PIXI.Container, x : number, y : number, simulationState : SimulationState, bitSize : number) {
        super(0, 1, Array<number>(0).fill(1), Array<number>(1).fill(bitSize), stage);
        this.simulationState = simulationState;
        this.value = Math.pow(2, bitSize) - 1; //set value to max
        this.x = x;
        this.y = y;
        this.text = new PIXI.Text(this.value.toString());
        this.componentTemplate.addChild(this.text);

        this.addWiringArea(this.x + 300, this.y + 100, 
        0, true);
    } 

    simulate() {
        this.output.setLineBit(0, 0, wireState.High)
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
        console.log(this.x)
        this.componentTemplate.clear();
        this.componentTemplate.lineStyle(10, this.getColor())
            .drawRect(this.x, this.y, 200, 200);
        this.componentTemplate.lineStyle(7, this.getColor())
            .moveTo(this.x + 200, this.y + 100)
            .lineTo(this.x + 300, this.y + 100)
        this.text.style = {fontFamily : 'Ariel', fontSize : 60, fill : this.getColor()}
        this.text.position.x = this.x + 120 - this.text.width;
        this.text.position.y = this.y + 130 - this.text.height;
        this.updateHitArea();
        
    }
}