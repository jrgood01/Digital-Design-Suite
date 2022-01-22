//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import { wireState } from "../../WireStates";
import {SimulationComponent} from "../SimulationComponent"
import * as PIXI from 'pixi.js'

export class ANDGate extends SimulationComponent {
    inputs : number;
    bitWidth : number;

    constructor(bitWidth : number, numInputs : number, stage : PIXI.Container) {
        super(numInputs, 1, Array(bitWidth).fill(numInputs), Array(bitWidth).fill(1), stage);
        this.inputs = numInputs;
        this.bitWidth = bitWidth;
    }

    simulate() {
        for (let bit = 0; bit < this.bitWidth; bit ++) {
            let outputBit = wireState.High;
            for (let line = 0; line < this.inputs; line ++) {
                if (this.input.getLineBit(line, bit) == wireState.Low) {
                    outputBit = wireState.Low;
                }
            }
            this.output.setLineBit(0, bit, outputBit);
        }
    }

    draw() {
        let scaler = 1;
        let componentLineWidth = scaler * 10;
        let height = 200;
        let lengthOne = 100;
        let lengthTwo = 80;

        this.componentTemplate.clear();
        this.componentTemplate.lineStyle(componentLineWidth, 0xff0000)
            .moveTo(160, 160)
            .lineTo(160 + lengthOne, 160);
        
        this.componentTemplate.lineStyle(componentLineWidth, 0xff0000)
            .moveTo(160, 160 + height)
            .lineTo(160 + lengthOne, 160 + height);

        this.componentTemplate.beginFill(componentLineWidth, 0xff0000)    
            .arcTo(160 + lengthOne, 160 + height, 160 + lengthOne + lengthTwo, 160 + (height / 2), 100)

    }
}