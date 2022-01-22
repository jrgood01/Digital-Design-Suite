//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {SimulationComponent} from "../SimulationComponent"
import { wireState } from "../../WireStates";
import * as constants from "../../../constants"
import * as PIXI from 'pixi.js'

export class NOTGate extends SimulationComponent {
    bitWidth : number;

    constructor(bitWidth : number, stage : PIXI.Container) {
        super(1, 1, Array(bitWidth).fill(1), Array(bitWidth).fill(1), stage);
        this.bitWidth = bitWidth;
        this.x = 500;
        this.y = 500;
    }

    simulate() {
        for (let bit = 0; bit < this.bitWidth; bit ++) {
            let outputBit = wireState.Error;
            if (this.input.getLineBit(0, bit) == wireState.High) {
                outputBit = wireState.Low;
            } else {
                outputBit = wireState.High;
            }
            this.output.setLineBit(0, bit, outputBit);
        }
    }

    getInputVal() {
        return this.getInputLineBit(0, 0);
    }

    getOutputVal() {
        return this.getOutputLineBit(0, 0);
    }

    draw() {
        const colors = {
            componentBody : constants.General.componentColorStandard,
            inputWire : this.getInputVal(),
            outputWire : this.getOutputVal()
        }

        let scaler = .5;
        let componentLineWidth = scaler * 10;
        let componentLength = scaler * 200;
        let componentHeight = scaler * 200; 

        let cornerX = this.x - (componentLength / 2);
        let cornerY = this.y - (componentHeight / 2)

        this.componentTemplate.clear();
        this.componentTemplate.lineStyle(componentLineWidth, colors.componentBody)
            .moveTo(cornerX, cornerY)
            .lineTo(cornerX, cornerY + componentHeight);
        this.componentTemplate.lineStyle(componentLineWidth, colors.inputWire)
            .moveTo(cornerX, cornerY + (componentHeight / 2))
            .lineTo(cornerX - 70 * scaler, cornerY + (componentHeight / 2));
        this.componentTemplate.lineStyle(componentLineWidth, colors.componentBody)
                .moveTo(cornerX, cornerY + 3.9 * scaler)
                .lineTo(cornerX + componentLength, cornerY + (componentHeight / 2));
        this.componentTemplate.lineStyle(componentLineWidth, colors.componentBody)
                .moveTo(cornerX, cornerY + componentHeight - 3.9 * scaler)
                .lineTo(cornerX + componentLength, cornerY + (componentHeight / 2));   
        this.componentTemplate.lineStyle(componentLineWidth, colors.outputWire)
                .moveTo(cornerX + componentLength, cornerY + (componentHeight / 2))
                .lineTo(cornerX + componentLength + 70 * scaler, cornerY + (componentHeight / 2));

    }

    
}