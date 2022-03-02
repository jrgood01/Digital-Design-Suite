//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import { wireState } from "../../../WireStates";
import * as PIXI from 'pixi.js'
import { Heading } from "../../../../Heading";
import {Gate} from "./Gate";
export class NOTGate extends Gate {
    constructor(x : number, y : number, container : PIXI.Container, bitWidth : number) {
        super(x, y, container, 1, 1, 130);
        this.followQuadratic(50);
        this.addRenderTarget(this.gateRenderObjectFactory.getGate("NOT"))
        this.addWiringArea(this.geometry['outputWireStartX'] + this.geometry['outputWireLength'], this.geometry['outputWireStartY'], 0, false, Heading.East);
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

            this.output.setLineBit(0, bit, outputBit);
        }
        
    }
}