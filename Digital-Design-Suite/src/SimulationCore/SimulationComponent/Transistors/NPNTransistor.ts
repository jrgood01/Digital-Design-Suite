//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {SimulationComponent} from "../SimulationComponent"

export class NPNTransistor extends SimulationComponent {
    constructor() {
        super(2, 1, Array<number>(2).fill(1), Array<number>(1).fill(1));
    }
    simulate() {
        let collector = this.input.getLineBit(0, 0);
        let base = this.input.getLineBit(1, 0);
        let emitter = collector && base;

        this.output.setLineBit(0, 0, emitter);
    }
}