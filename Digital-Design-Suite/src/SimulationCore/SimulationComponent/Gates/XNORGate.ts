//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {SimulationComponent} from "../SimulationComponent"
import { wireState } from "../../WireStates";
import { SimulationState } from "../../SimulationState";
import * as PIXI from 'pixi.js'
import {VariableInputComponent} from "../VariableInputComponent";
import * as constants from "../../../constants";
import {Heading} from "../../../Heading";
import {Gate} from "./Gate";

export class XNORGate extends Gate {

    constructor(x: number, y: number, container: PIXI.Container, bitWidth: number, numInputs: number) {
        super(x, y, container, 1, numInputs);
        this.followQuadratic(50);
        this.addRenderTarget(this.gateRenderObjectFactory.getGate("XNOR"))
        this.addWiringArea(this.geometry['outputWireStartX'] + this.geometry['outputWireLength'], this.geometry['outputWireStartY'], 0, false, Heading.East);
    }

    simulate() {
        for (let bit = 0; bit < this.bitWidth; bit++) {
            let numOn = 0;
            for (let line = 0; line < this.inputs; line++) {
                if (this.input.getLineBit(line, bit) == wireState.High) {
                    numOn++;
                }
            }
            if (numOn == this.inputs || numOn == 0) {
                this.output.setLineBit(0, bit, wireState.Low);
            }
        }
    }
}
