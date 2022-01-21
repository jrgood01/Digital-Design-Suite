//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

class NANDGate extends SimulationComponent {
    inputs : number;
    bitWidth : number;

    constructor(bitWidth : number, numInputs : number) {
        super(numInputs, 1, Array(bitWidth).fill(numInputs), Array(bitWidth).fill(1));
        this.inputs = numInputs;
        this.bitWidth = bitWidth;
    }

    simulate() {
        for (let bit = 0; bit < this.bitWidth; bit ++) {
            let outputBit = false;
            for (let line = 0; line < this.inputs; line ++) {
                if (this.input.getLineBit(line, bit) == false) {
                    outputBit = true;
                }
            }
            this.output.setLineBit(0, bit, outputBit);
        }
    }
}