//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {SimulationComponent} from "./SimulationComponent/SimulationComponent"

export class SimulationState {
    private components : Array<SimulationComponent>;
    private tickFrequency : number;
    private numComponents : number;

    constructor() {
        this.components = new Array<SimulationComponent>();
        this.numComponents = 0;
    }

    addComponent(component : SimulationComponent) {
        component.componentId = this.numComponents.toString();
        this.components.push(component);
    }

    removeComponent(componentId : string) {
        delete this.components[Number.parseInt(componentId)];
    }

    setTickFrequency(frequency : number) {
        this.tickFrequency = this.tickFrequency;
    }

    getTickFrequency() {
        return this.tickFrequency;
    }
}