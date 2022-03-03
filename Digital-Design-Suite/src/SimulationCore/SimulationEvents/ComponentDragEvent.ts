//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import { ComponentEvent } from "./ComponentEvent";
import { SimulationComponent } from "../../SimulationComponent/SimulationComponent";

export class ComponentDragEvent extends ComponentEvent {
    x : number;
    y : number;
    dX : number;
    dY : number;
    constructor(component : SimulationComponent, x : number
        , y : number, dX : number, dY : number) {
        super(component);
        this.x = x;
        this.y = y;
        this.dX = dX;
        this.dY = dY;
    }
}