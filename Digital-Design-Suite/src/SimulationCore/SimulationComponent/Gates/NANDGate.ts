//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {SimulationComponent} from "../SimulationComponent"
import { wireState } from "../../WireStates";
import { SimulationState } from "../../SimulationState";
import { VariableInputComponent } from "../VariableInputComponent";
import * as constants from "../../../constants"

export class NANDGate extends VariableInputComponent {
    inputs : number;
    bitWidth : number;

    constructor(bitWidth : number, x : number, y : number, numInputs : number, simulationState : SimulationState) {
        super(x, y, numInputs, 1, Array(numInputs).fill(bitWidth), Array(bitWidth).fill(1), simulationState, 200);
        this.inputs = numInputs;
        this.bitWidth = bitWidth;

        this.geometry = this.calculateGeometry(1);

        this.addWiringArea(this.geometry['outputWireStartX'] + this.geometry['outputWireLength'] - 3.5, this.geometry['outputWireStartY'] - 3.5, 0, false)
    }

    calculateGeometry(scaler: number): Record<string, number> {
        let retMap = {} as Record<string, number>

        retMap['startX'] = this.x;
        retMap['startY'] = this.y;
        retMap['componentHeight'] = 200;

        retMap['width1'] = 90;

        retMap['arcCenterX'] = this.x + retMap['width1'];
        retMap['arcCenterY'] = (retMap['startY'] + retMap['componentHeight'] / 2)

        retMap['verticalLineTopX'] = retMap['startX'];
        retMap['verticalLineTopY'] = retMap['startY'] - 5;

        retMap['verticalLineBottomX'] = retMap['startX'];
        retMap['verticalLineBottomY'] = retMap['startY'] + retMap['componentHeight'] + 5;
        
        retMap['outputWireStartX'] = retMap['startX'] + retMap['componentHeight'] - 7;
        retMap['outputWireStartY'] = (retMap['startY'] + retMap['componentHeight'] / 2);
        retMap['outputWireLength'] = 70;

        retMap['inputSpacingLen'] = retMap['componentHeight'] / 5;
 
        return retMap;
    }

    simulate() {
        this.output.setLineBit(0, 0, wireState.Float);
        for (let bit = 0; bit < this.bitWidth; bit ++) {
            let outputBit = wireState.High;
            for (let line = 0; line < this.inputs; line ++) {
                if (this.input.getLineBit(line, bit) != wireState.High && this.input.getLineBit(line, bit) != wireState.Low) {
                    outputBit = wireState.Error;
                    break;
                }

                if(this.input.getLineBit(line, bit) == wireState.Low) {
                    outputBit = wireState.Low;
                    break;
                }
            }
            if (outputBit == wireState.High) {
                this.output.setLineBit(0, bit, wireState.Low);
            } else if (outputBit == wireState.Low) {
                this.output.setLineBit(0, bit, wireState.High);
            } else {
                this.output.setLineBit(0, bit, outputBit);
            }
        }
    }
    
    getOutput() {
        return this.output.getLineBit(0, 0);
    }

    draw() {
        const colors = {
            componentBody : this.selected ? constants.General.selectedColor : constants.General.componentColorStandard,
            outputWire : this.getOutput()
        }

        this.componentTemplate.clear();
        this.componentTemplate.lineStyle(10, colors.componentBody)
            .moveTo(this.geometry['startX'], this.geometry['startY'])
            .lineTo(this.geometry['startX'] + this.geometry['width1'], 
                this.geometry['startY'])
            .moveTo(this.geometry['startX'], this.geometry['startY'] + this.geometry['componentHeight'])
            .lineTo(this.geometry['startX'] + this.geometry['width1'], 
                this.geometry['startY'] + this.geometry['componentHeight'])
            .moveTo(this.geometry['verticalLineTopX'], this.geometry['verticalLineTopY'])
            .lineTo(this.geometry['verticalLineBottomX'], this.geometry['verticalLineBottomY']);

        this.componentTemplate.moveTo(this.geometry['startX'] + this.geometry['width1'], 
        this.geometry['startY'])
        this.componentTemplate.arc(this.geometry['arcCenterX'], this.geometry['arcCenterY'], this.geometry['componentHeight'] / 2, (3*Math.PI)/2, (Math.PI)/2);
        this.componentTemplate.lineStyle(7, colors.outputWire)

        .moveTo(this.geometry['outputWireStartX'], this.geometry['outputWireStartY'])
        .lineTo(this.geometry['outputWireStartX'] + this.geometry['outputWireLength'], this.geometry['outputWireStartY']);

        this.componentTemplate.lineStyle(6, constants.General.componentColorStandard);
        this.componentTemplate.beginFill(constants.General.BgColor_1)
        .drawCircle(this.geometry['outputWireStartX'] + 13, this.geometry['outputWireStartY'], 13);
        

        this.drawInputAreas(false);
        this.updateHitArea();
        
    }
}