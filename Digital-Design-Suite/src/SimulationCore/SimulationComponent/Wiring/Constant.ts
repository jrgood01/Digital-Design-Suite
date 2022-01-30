import { SimulationComponent } from "../SimulationComponent";
import { SimulationState } from "../../SimulationState";
import * as PIXI from 'pixi.js'
export class ConstantComponent extends SimulationComponent {
    constructor(stage : PIXI.Container, x : number, y : number, simulationState : SimulationState, bitSize : number) {
        super(0, 1, Array<number>(0).fill(1), Array<number>(1).fill(bitSize), stage);
    } 

    simulate() {

    }

    draw() {

    }
}