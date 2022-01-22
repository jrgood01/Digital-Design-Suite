//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {SimulationComponent} from "../SimulationComponent"
import { wireState } from "../../WireStates";

class NOTGate extends SimulationComponent {
    inputs : number;
    bitWidth : number;

    constructor(bitWidth : number, numInputs : number) {
        super(1, 1, Array(bitWidth).fill(1), Array(bitWidth).fill(1));
        this.inputs = numInputs;
        this.bitWidth = bitWidth;
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

    draw() {
        
    }
}