//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {WiringArea} from "./WiringArea";
import {SimulationComponent} from "../SimulationComponent/SimulationComponent";
import * as PIXI from 'pixi.js'
import { Heading } from "../../../src/Heading";

export class ComponentWiringArea extends WiringArea {
    private component : SimulationComponent;
    private input : boolean;
    private lineNumber : number;
    private defaultHeading : Heading;

    constructor(x : number, y : number, container : PIXI.Container, defaultHeading : Heading, component : SimulationComponent, lineNumber : number, input : boolean) {
        super(x, y, container);
        this.component = component;
        this.input = input;
        this.lineNumber = lineNumber;
        this.defaultHeading = defaultHeading;
    }

    getLineNumber() {
        return this.lineNumber;
    }

    getIsInput() {
        return this.input;
    }

    getComponent() {
        return this.component;
    }

    getHeading() {
        return (this.defaultHeading + this.component.getHeading()) % 4;
    }
}