//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {SimulationComponent} from "./SimulationComponent";
import {ANDGate} from "./Gates/Logic/ANDGate";
import {ConstantComponent} from "./Wiring/Logic/Constant";
import {NOTGate} from "./Gates/Logic/NOTGate";
import {NANDGate} from "./Gates/Logic/NANDGate";
import {ORGate} from "./Gates/Logic/ORGate";
import {XORGate} from "./Gates/Logic/XORGate";
import {XNORGate} from "./Gates/Logic/XNORGate";
import {NORGate} from "./Gates/Logic/NORGate";
import {HexDisplay} from "./Peripheral/HexDisplay";
import * as PIXI from 'pixi.js'

export class ComponentFactory {
    static getComponent(componentName : string, container : PIXI.Container) : SimulationComponent {
        switch(componentName) {
            case "And":
                return new ANDGate(1, 0, container,1, 2);
            case "Constant":
                return new ConstantComponent(0, 0, container, 1);
            case "Not":
                return new NOTGate(1, 0, container, 1)
            case "Nand":
                return new NANDGate(1, 0, container,1, 2);
            case "Or":
                console.log("OR gate")
                return new ORGate(1, 0, container, 1, 2);
            case "XOR":
                return new XORGate(1, 0, container, 1, 2);
            case "Xnor":
                return new XNORGate(1, 0, container, 1, 2);
            case "Nor":
                return new NORGate(1, 0, container, 1, 2);
            case "7 Segment Display":
                return new HexDisplay(0, 0, container);
            default:
                return null;
        }
    }
}