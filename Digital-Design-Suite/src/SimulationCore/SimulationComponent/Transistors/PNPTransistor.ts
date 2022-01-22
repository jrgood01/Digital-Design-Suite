//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import { wireState } from "../../WireStates";
import {SimulationComponent} from "../SimulationComponent"

class PNPTransistor extends SimulationComponent {
    constructor() {
        super(2, 1, Array<number>(2).fill(1), Array<number>(1).fill(1));
    }
    simulate() {
        let collector = this.input.getLineBit(0, 0);
        let base = this.input.getLineBit(1, 0);

        if (collector == wireState.High && base == wireState.Low)
        {
            this.output.setLineBit(2, 0, wireState.High)
        } else {
            this.output.setLineBit(0, 0, wireState.Low)
        }
        
    }

    getCollector() {
        return this.input.getLineBit(0, 0);
    }

    getBase() {
        return this.input.getLineBit(1, 0);
    }

    getEmitter() {
        return this.output.getLineBit(1, 0);
    }

    draw() {
        
    }
}