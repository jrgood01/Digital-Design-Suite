//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022
import { wireState } from "../../WireStates";
import * as PIXI from 'pixi.js'
import * as constants from "../../../constants"
import { VariableInputComponent } from "../VariableInputComponent";
import { Heading } from "../../../Heading";
import { GateGeometry } from "./RenderGeometry/GateGeometry";
import {Gate} from "./Gate";


export class ANDGate extends Gate{
    constructor(x : number, y : number, container : PIXI.Container, bitWidth : number, numInputs : number) {
        super(x, y, container, 1, numInputs);
        this.addRenderTarget(this.gateRenderObjectFactory.getGate("AND"));
        this.addWiringArea(this.geometry['outputWireStartX'] + this.geometry['outputWireLength'],
            this.geometry['outputWireStartY'], 0, false, Heading.East)
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
            this.output.setLineBit(0, bit, outputBit);
        }
    }
}