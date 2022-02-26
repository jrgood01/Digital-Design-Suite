//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import { SimulationComponent } from "./SimulationComponent";
import { WiringArea } from "../Wiring/WiringArea"
import * as PIXI from "pixi.js"
import * as constants from "../../constants"
import { SimulationState } from "../SimulationState";
import { SimulationAddGraphicEvent } from "../SimulationEvents/SimulationAddGraphicEvent";
export abstract class VariableInputComponent extends SimulationComponent {
    numInputs : number;
    componentHeight : number;

    private inputTotalSpacing : number;
    private inputAreaPadding : number;
    private inputAreaStartY : number;

    constructor(x : number, y : number, container : PIXI.Container, inputLines : number, outputLines : number, inputBitWidths : number[],
        outputBitWidths : number[],componentHeight : number) {
        super(x, y, container, inputLines, outputLines, inputBitWidths, outputBitWidths);
        
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
        this.inputTotalSpacing = (this.numInputs - 1) * 30 + 4*7;
        this.inputAreaPadding = (this.componentHeight - this.inputTotalSpacing) / 2;
        this.inputAreaStartY = (this.y + this.inputAreaPadding);

        this.wiringAreas.get(true).forEach((wiringArea : WiringArea, key : number) => {
            this.onGraphicRemove(new SimulationAddGraphicEvent(wiringArea.getGraphic()));
        })

        this.wiringAreas.set(true, new Map<number, WiringArea>());

        for (let i = 0; i < this.numInputs; i ++) {
            let yPoint = this.inputAreaStartY + i * 50 - 3.5;
            if (this.grid)
                yPoint = this.grid.snapToGrid(new PIXI.Point(0, this.inputAreaStartY + i * 50 - 3.5)).y;
            this.addWiringArea(this.x - 61, yPoint, i, true)
        }
    }

    drawInputAreas(inputIsWire : boolean) {
        for (let i = 0; i < this.numInputs; i ++) {
            let yPoint = this.inputAreaStartY + i * 50 - 3.5;
            if (this.grid)
                yPoint = this.grid.snapToGrid(new PIXI.Point(0, this.inputAreaStartY + i * 50 - 3.5)).y;
            this.componentTemplate.lineStyle(7, this.getInputLineBit(i, 0))
            .moveTo(this.x, yPoint)
            .lineTo(this.x - 61, yPoint);
        }
    }

}