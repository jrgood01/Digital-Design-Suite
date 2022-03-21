//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import { SimulationComponent } from "../SimulationComponent/SimulationComponent";
import { WiringArea } from "../DynamicWiring/WiringArea";
import { Wire } from "../DynamicWiring/Wire";
import { WireDragEvent } from "./WireDragEvent";
import {ComponentWiringArea} from "../DynamicWiring/ComponentWiringArea";

export class WireEndDragAtWiringAreaEvent extends WireDragEvent {
    wire : Wire;
    component : SimulationComponent;
    wiringArea : WiringArea;

    constructor(wire : Wire, component : SimulationComponent, wiringArea : WiringArea, x : number, y : number) {
        super(wire, x, y, 0, 0);
        this.component = component;
        this.wiringArea = wiringArea;
    }
}