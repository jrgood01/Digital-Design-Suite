//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import { wireState } from "../WireStates";

export class SimulationComponentIO {
    private _lineValues : Array<Array<wireState>>

    constructor(inputLinesNum : number, bitWidths : Array<number>) {
        this._lineValues = new Array<Array<wireState>>()
        for (let i = 0; i < inputLinesNum; i ++) {
            this._lineValues.push(new Array<wireState>());
            for (let l = 0; l < bitWidths[i]; l ++) {
                this._lineValues[i].push(wireState.Float);
            }
        }
    }

    getLineValue(lineNumber : number) {
        return this._lineValues[lineNumber];
    }

    getLineBit(lineNumber : number, bitNumber : number) {
        return this._lineValues[lineNumber][bitNumber];
    }

    setLineBit(lineNumber : number, bitNumber : number, value : wireState) {
        this._lineValues[lineNumber][bitNumber] = value;
    }

    setLineValue(lineNumber : number, value : Array<wireState>) {
        this._lineValues[lineNumber] = value;
    }

    addLine(bitWidth : number) {
        const addLine : Array<wireState> = new Array<wireState>();
        //Set line to float initially
        for (let i = 0; i < bitWidth ; i ++) { addLine[i] = wireState.Float;} 
        this._lineValues.push(addLine);
    }

    removeLine(lineNumber : number) {
        delete this._lineValues[lineNumber];
    }

    changeBitSize(lineNumber : number, newBitSize : number) {
        let lineSize = this._lineValues[lineNumber].length;
        let diff = lineSize - newBitSize

        if (diff > 0) {
            for (let i = 0; i < diff; i ++) {
                this._lineValues[lineNumber].push(wireState.Float);
            }
        } else {
            for (let i = 0; i < -diff; i ++) {
                this._lineValues[lineNumber].pop();
            }
        }
    }
}