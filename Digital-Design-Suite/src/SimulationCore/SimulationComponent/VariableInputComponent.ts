import { SimulationComponent } from "./SimulationComponent";
import { WiringArea } from "./WiringArea"
import * as PIXI from "pixi.js"
import * as constants from "../../constants"
import { SimulationState } from "../SimulationState";
export abstract class VariableInputComponent extends SimulationComponent {
    numInputs : number;
    componentHeight : number;

    private inputTotalSpacing : number;
    private inputAreaPadding : number;
    private inputAreaStartY : number;

    constructor(x : number, y : number, inputLines : number, outputLines : number, inputBitWidths : number[], 
        outputBitWidths : number[], simulationState : SimulationState, componentHeight : number) {
        super(x, y, inputLines, outputLines, inputBitWidths, outputBitWidths, simulationState);
        
        this.drawInputAreas = this.drawInputAreas.bind(this);

        this.componentHeight = componentHeight;
        this.numInputs = inputLines;

        this.inputTotalSpacing = 0;
        this.inputAreaPadding = 0;
        this.inputAreaStartY = 0;

        this.onMove.push((dx : number, dY : number) => {this.calculateInputAreaCoordinates()})
        this.calculateInputAreaCoordinates();
    }

    setNumInputs(numInputs : number) {
        this.numInputs = numInputs;
    }

    calculateInputAreaCoordinates() {
        this.inputTotalSpacing = (this.numInputs - 1) * 50;
        this.inputAreaPadding = (this.componentHeight - this.inputTotalSpacing) / 2;
        this.inputAreaStartY = this.y + this.inputAreaPadding;

        this.wiringAreas.get(true).forEach((wiringArea : WiringArea, key : number) => {
            this.simulationState.stage.removeChild(wiringArea.graphic);
        })

        this.wiringAreas.set(true, new Map<Number, WiringArea>());

        for (let i = 0; i < this.numInputs; i ++) {
            this.addWiringArea(this.x - 100, this.inputAreaStartY + i * 50 - 3.5, i, true)
        }
    }

    drawInputAreas(inputIsWire : boolean) {
        console.log(this.y)
        for (let i = 0; i < this.numInputs; i ++) {
            this.componentTemplate.lineStyle(7, this.getInputLineBit(i, 0))
            .moveTo(this.x, this.inputAreaStartY + i * 50)
            .lineTo(this.x - 100, this.inputAreaStartY + i * 50);
        }
    }

}