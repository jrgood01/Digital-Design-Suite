//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import { wireState } from "../../WireStates";
import {SimulationComponent} from "../SimulationComponent"
import { SimulationState } from "../../SimulationState";
class NORGate extends SimulationComponent {
    inputs : number;
    bitWidth : number;

    constructor(x : number, y : number, bitWidth : number, numInputs : number, simulationState : SimulationState) {
        super(x, y, numInputs, 1, Array(bitWidth).fill(numInputs), Array(bitWidth).fill(1), simulationState);
        this.inputs = numInputs;
        this.bitWidth = bitWidth;
    }

    simulate() {
        for (let bit = 0; bit < this.bitWidth; bit ++) {
            let outputBit = wireState.Low;
            for (let line = 0; line < this.inputs; line ++) {
                if (this.input.getLineBit(line, bit) == wireState.High) {
                    outputBit = wireState.Low;
                }
            }
            this.output.setLineBit(0, bit, outputBit);
        }
    }

    draw() {
        
    }
}