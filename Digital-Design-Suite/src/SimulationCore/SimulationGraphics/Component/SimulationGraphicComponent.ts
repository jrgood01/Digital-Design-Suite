//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import * as PIXI from "pixi.js"
import { SimulationComponent } from "../../SimulationComponent/SimulationComponent";

export abstract class SimulationGraphicsComponent {
    componentTemplate : PIXI.Graphics;
    component : SimulationComponent;

    x : number;
    y : number;

    abstract draw() : void;

    constructor (stage : PIXI.Container, x : number, y : number) {
        this.componentTemplate = new PIXI.Graphics();
        stage.addChild(this.componentTemplate);
    }

    renderComponent() {
        this.componentTemplate.clear();
        this.draw();
    }
}