//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {SimulationComponent} from "./SimulationComponent/SimulationComponent"
import {SimulationGraphicsComponent} from "./SimulationGraphics/Component/SimulationGraphicComponent"
export class SimulationState {
    components : Array<SimulationGraphicsComponent>;
    private tickFrequency : number;
    private numComponents : number;

    constructor() {
        this.components = new Array<SimulationGraphicsComponent>();
        this.numComponents = 0;
    }

    addComponent(graphicsComponent : SimulationGraphicsComponent) {
        graphicsComponent.component.componentId = this.numComponents.toString();
        this.components.push(graphicsComponent);
    }

    removeComponent(componentId : string) {
        let i = 0;
        this.components.forEach((graphicsComponent : SimulationGraphicsComponent) => {
            if (graphicsComponent.component.componentId == componentId) {
                graphicsComponent.component.deleted = true;
                delete this.components[i];
            }
        })
    }

    setTickFrequency(frequency : number) {
        this.tickFrequency = this.tickFrequency;
    }

    getTickFrequency() {
        return this.tickFrequency;
    }
}