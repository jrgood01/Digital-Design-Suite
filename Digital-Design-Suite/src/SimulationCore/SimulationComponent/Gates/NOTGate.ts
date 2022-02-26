//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {SimulationComponent} from "../SimulationComponent"
import { wireState } from "../../WireStates";
import * as constants from "../../../constants"
import * as PIXI from 'pixi.js'
import {SimulationState} from "../../SimulationState"
export class NOTGate extends SimulationComponent {
    bitWidth : number;
    simulationState : SimulationState;

    constructor(x: number, y: number, container : PIXI.Container, bitWidth : number) {
        super(x, y, container, 1, 1, Array(bitWidth).fill(1), Array(bitWidth).fill(1));
        this.input.setLineBit(0, 0, wireState.Float);
        this.bitWidth = bitWidth;
        this.x = x;
        this.y = y;
        this.geometry = this.calculateGeometry(1);

        this.addWiringArea(this.geometry['outputWireEndX'] - 6, this.geometry['outputWireEndY'] - 3.5, 
        0, false);

        this.addWiringArea(this.geometry['inputWireEndX'], this.geometry['inputWireEndY'] - 3.5, 
        0, true);

    }

    calculateGeometry(scaler : number) {
        let retMap = {} as Record<string, number>;
        retMap['scaler'] = 1;
        retMap['componentLineWidth'] = scaler * 10;
        retMap['wireLineWidth'] = scaler * 7;
        retMap['componentLength'] = scaler * 200;
        retMap['componentHeight'] = scaler * 200; 
        
        retMap['cornerX'] = this.x - (retMap['componentLength'] / 2);
        retMap['cornerY'] = this.y - (retMap['componentHeight'] / 2)

        retMap['inputWireEndX'] = retMap['cornerX'] - 70 * scaler; 
        retMap['inputWireEndY'] = retMap['cornerY'] + (retMap['componentHeight'] / 2)
        retMap['inputWireStartX'] = retMap['cornerX']
        retMap['inputWireStartY'] = retMap['cornerY'] + (retMap['componentHeight'] / 2)

        retMap['topWireStartX'] = retMap['cornerX'];
        retMap['topWireStartY'] = retMap['cornerY'] + 3.9 * scaler
        retMap['topWireEndX'] = retMap['cornerX'] + retMap['componentLength']
        retMap['topWireEndY'] = retMap['cornerY'] + (retMap['componentHeight'] / 2);

        retMap['bottomWireStartX'] = retMap['cornerX'];
        retMap['bottomWireStartY'] = retMap['cornerY'] + retMap['componentHeight'] - 3.9 * scaler;
        retMap['bottomWireEndX'] = retMap['cornerX'] + retMap['componentLength'];
        retMap['bottomWireEndY'] = retMap['cornerY'] + (retMap['componentHeight'] / 2);

        retMap['outputWireStartX'] = retMap['cornerX'] + retMap['componentLength'];
        retMap['outputWireStartY'] = retMap['cornerY'] + (retMap['componentHeight'] / 2);
        retMap['outputWireEndX'] = retMap['cornerX'] + retMap['componentLength'] + 70 * scaler;
        retMap['outputWireEndY'] = retMap['cornerY'] + (retMap['componentHeight'] / 2)

        return retMap
    }

    simulate() {
        for (let bit = 0; bit < this.bitWidth; bit ++) {
            let outputBit = wireState.Error;
            if (this.input.getLineBit(0, bit) == wireState.High) {
                outputBit = wireState.Low;
            } else if (this.input.getLineBit(0, bit) == wireState.Float ||
                       this.input.getLineBit(0, bit) == wireState.Error) {
                outputBit = wireState.Error;
            } else {
                outputBit = wireState.High;
            }
            //console.log(this.input.getLineBit(0, bit), this.output.getLineBit(0, bit))
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
        this.componentTemplate.clear();

        const colors = {
            componentBody : this.selected ? constants.General.selectedColor : constants.General.componentColorStandard,
            inputWire : this.selected ? constants.General.selectedColor : this.getInputVal(),
            outputWire : this.selected ? constants.General.selectedColor : this.getOutputVal()
        }

        this.componentTemplate.lineStyle(this.geometry['componentLineWidth'], colors.componentBody)
            .moveTo(this.geometry['cornerX'], this.geometry['cornerY'])
            .lineTo(this.geometry['cornerX'], this.geometry['cornerY'] + this.geometry['componentHeight']);

        this.componentTemplate.lineStyle(this.geometry['wireLineWidth'], colors.outputWire)
            .moveTo(this.geometry['outputWireStartX'], this.geometry['outputWireStartY'])
            .lineTo(this.geometry['outputWireEndX'], this.geometry['outputWireEndY']);

        this.componentTemplate.lineStyle(this.geometry['wireLineWidth'], colors.inputWire)
            .moveTo(this.geometry['inputWireStartX'], this.geometry['inputWireStartY'])
            .lineTo(this.geometry['inputWireEndX'], this.geometry['inputWireEndY']);

        this.componentTemplate.lineStyle(this.geometry['componentLineWidth'], colors.componentBody)
                .moveTo(this.geometry['topWireStartX'], this.geometry['topWireStartY'])
                .lineTo(this.geometry['topWireEndX'], this.geometry['topWireEndY']);

        this.componentTemplate.lineStyle(this.geometry['componentLineWidth'], colors.componentBody)
                .moveTo(this.geometry['bottomWireStartX'], this.geometry['bottomWireStartY'])
                .lineTo(this.geometry['bottomWireEndX'], this.geometry['bottomWireEndY']);  

        this.updateHitArea();
    }

    
}