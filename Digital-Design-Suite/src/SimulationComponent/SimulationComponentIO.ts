//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import { wireState } from "../SimulationCore/WireStates";
import { SimulationComponent } from "./SimulationComponent";
//SimulationComponentIO represnts the inputs or outputs to / from
// a component. It contains one feild : lineValues. This 
// is an array of arrays of wire state. Each subarray represents a wire.
// The length of this array is the bit width of the wire.

/**
 * SimulationComponentIO represnts the inputs or outputs to / from
 * a component.
 */

export class SimulationComponentIO {
    private lineValues : Array<Array<wireState>>

    /**
     * Creates a new SimulationComponentIO
     * @param lineNum Number of wires
     * @param bitWidths An array representing the bit widths of each wire. bitWidths.length must equal lineNum
     */
    constructor(lineNum : number, bitWidths : Array<number>) {

        if (lineNum != bitWidths.length) {
            throw(`Cannot create SimulationComponentIO. ${bitWidths.length} bitwidths declared for ${lineNum} lines Bit width array must contain lineNum elements`)
        }


        this.lineValues = new Array<Array<wireState>>()
        for (let i = 0; i < lineNum; i ++) {
            this.lineValues.push(new Array<wireState>());
            for (let l = 0; l < bitWidths[i]; l ++) {
                this.lineValues[i].push(wireState.Float);
            }
        }
    }

    /**
     * 
     * @param lineNumber line number
     * @returns the bit width of the line
     */
    getLineBitWidth(lineNumber : number) {
        return this.getLineBits(lineNumber).length;
    }

    /**
     * Gets the value of a line
     * @param lineNumber The wire to get the value of
     * @returns An array of wireState representing the state of each wire bit
     */
    getLineValue(lineNumber : number) {
        if (lineNumber >= this.lineValues.length || lineNumber < 0) {
            throw(`No line exists at index ${lineNumber.toString()}`)
        }
        return this.lineValues[lineNumber];
    }

    /**
     * Gets the value of a specified bit of a line
     * @param lineNumber The wire to get the value of
     * @param bitNumber The bit number to return
     * @returns A wireState represnting the current state of the wire at the specified bit number
     */
    getLineBit(lineNumber : number, bitNumber : number) {
        if (lineNumber >= this.lineValues.length || lineNumber < 0) {
            throw(`No line exists at index ${lineNumber.toString()}`)
        }

        if (bitNumber < 0) {
            throw ("bitNumber cannot be negative")
        }
        if (bitNumber > this.lineValues[lineNumber].length) {
            throw(`The specified bitNumber ${bitNumber} is larger than the bitwidth of the wire`)
        }
        return this.lineValues[lineNumber][bitNumber];
    }

    /**
     * 
     * @param lineNumber line number
     * @returns all the bits states of the line
     */
    getLineBits(lineNumber : number) : Array<wireState> {
        return this.lineValues[lineNumber];
    }

    /**
     * Sets a specified bit of a line
     * @param lineNumber The wire to set bit on
     * @param bitNumber Index of the bit to set
     * @param value New value of the bit
     */
    setLineBit(lineNumber : number, bitNumber : number, value : wireState) {
        if (lineNumber >= this.lineValues.length || lineNumber < 0) {
            throw("No line exists at index "+lineNumber.toString())
        }
        this.lineValues[lineNumber][bitNumber] = value;
    }

    /**
     * Sets the value of a line
     * @param lineNumber The wire to set
     * @param value new value of the wire. value.length must equal lineValues[lineNumber].length
     */
    setLineValue(lineNumber : number, value : Array<wireState>) {
        if (lineNumber >= this.lineValues.length || lineNumber < 0) {
            throw("No line exists at index "+lineNumber.toString())
        }
        if (value.length != this.lineValues[lineNumber].length) {
            throw("Error setting line value. The new value doesn't match the bitwidth of the target line. Use changeBitSize to change the bitwidth of a wire")
        }
        this.lineValues[lineNumber] = value;
    }

    /**
     * Add new line with specified bitwidth
     * @param bitWidth bitwidth of line to add
     */
    addLine(bitWidth : number) {
        const addLine : Array<wireState> = new Array<wireState>();
        //Set line to float initially
        for (let i = 0; i < bitWidth ; i ++) { addLine[i] = wireState.Float;} 
        this.lineValues.push(addLine);
    }

    /**
     * Removes a line from IO
     * @param lineNumber line number to remove
     */
    removeLine(lineNumber : number) {       
        if (lineNumber >= this.lineValues.length || lineNumber < 0) {
            throw("No line exists at index "+lineNumber.toString())
        }

        delete this.lineValues[lineNumber];
    }

    /**
     * Change the bitsize of a line
     * @param lineNumber line to change
     * @param newBitSize new bit size
     */
    changeBitSize(lineNumber : number, newBitSize : number) {
        let lineSize = this.lineValues[lineNumber].length;
        let diff = lineSize - newBitSize

        if (lineNumber >= this.lineValues.length || lineNumber < 0) {
            throw("No line exists at index "+lineNumber.toString())
        }

        if (diff > 0) {
            for (let i = 0; i < diff; i ++) {
                this.lineValues[lineNumber].push(wireState.Float);
            }
        } else {
            for (let i = 0; i < -diff; i ++) {
                this.lineValues[lineNumber].pop();
            }
        }
    }
}