//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {SimulationComponent} from "../SimulationComponent"
import { wireState } from "../../WireStates";
import { SimulationState } from "../../SimulationState";

class XNORGate extends SimulationComponent {
    inputs : number;
    bitWidth : number;

    constructor(x : number, y : number, bitWidth : number, numInputs : number, simulationState : SimulationState) {
        super(x, y, numInputs, 1, Array(bitWidth).fill(numInputs), Array(bitWidth).fill(1), simulationState);
        this.inputs = numInputs;
        this.bitWidth = bitWidth;
    }

    simulate() {
        for (let bit = 0; bit < this.bitWidth; bit ++) {
            let numOn = 0;
            for (let line = 0; line < this.inputs; line ++) {
                if (this.input.getLineBit(line, bit) == wireState.High) {
                    numOn ++;
                }
            }
            if (numOn == this.inputs || numOn == 0) {
                this.output.setLineBit(0, bit, wireState.Low);
            }
        }
    }

    draw() {
        
    }
}