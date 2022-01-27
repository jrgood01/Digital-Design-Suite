//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import { Renderable } from "./Renderable";
import { SimulationComponent } from "./SimulationComponent/SimulationComponent";

export enum MouseMode {
    PAN,
    ZOOM,
    SELECT
}

export class SimulationState {
    renderable : Array<Renderable>;
    components : Array<SimulationComponent>;
    SelectedComponent : SimulationComponent;
    private tickFrequency : number;
    private numComponents : number;
    private scale : number;
    private mode : MouseMode;
    stateChanged : boolean;
    simulationFocused : boolean;
    isDragging : boolean;
    isPanning : boolean;
    isDraggingComponent : boolean;

    constructor() {
        this.components = new Array<SimulationComponent>();
        this.numComponents = 0;
        this.scale = 1;
        this.mode = MouseMode.SELECT;
        this.stateChanged = true;
    }

    addComponent(component : SimulationComponent) {
        component.componentId = this.numComponents.toString();
        this.components.push(component);
        this.numComponents ++;
    }

    removeComponent(componentId : string) {
        let i = 0;
        this.components.forEach((component : SimulationComponent) => {
            if (component.componentId == componentId) {
                component.deleted = true;
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

    getScale () {
        return this.scale;
    }

    setScale(newScale : number) {
        this.scale = newScale;
    }

    setMode(mode : MouseMode) {
        this.mode = mode;
    }

    getMode() {
        return this.mode;
    }
}