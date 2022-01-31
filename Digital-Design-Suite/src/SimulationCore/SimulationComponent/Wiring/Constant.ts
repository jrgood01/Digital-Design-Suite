import { SimulationComponent } from "../SimulationComponent";
import { SimulationState } from "../../SimulationState";
import * as PIXI from 'pixi.js'
export class ConstantComponent extends SimulationComponent {
    value : number;

    constructor(stage : PIXI.Container, x : number, y : number, simulationState : SimulationState, bitSize : number) {
        super(0, 1, Array<number>(0).fill(1), Array<number>(1).fill(bitSize), stage);
        this.value = Math.pow(2, bitSize) - 1; //set value to max
    } 

    simulate() {

    }

    draw() {
        this.componentTemplate.clear();
        this.componentTemplate.lineStyle(7, 0xFF0000)
        .moveTo(this.x, this.y)
        .lineTo(this.x + 100, this.y + 100);
        this.updateHitArea();
        
    }
}