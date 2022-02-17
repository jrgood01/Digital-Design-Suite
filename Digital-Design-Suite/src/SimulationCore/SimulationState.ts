//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import * as PIXI from "pixi.js"
import { Wire } from "./Wiring/Wire";
import { SimulationComponent } from "./SimulationComponent/SimulationComponent";
import { WiringArea } from "./SimulationComponent/WiringArea";
import { WiringAreaActiveEvent } from "./SimulationEvents/WiringAreaActiveEvent";
export enum MouseMode {
    PAN,
    ZOOM,
    SELECT
}

export class SimulationState {
    stage : PIXI.Container;
    components : Array<SimulationComponent>;
    SelectedComponent : SimulationComponent;
    tickFrequency : number;
    numComponents : number;
    scale : number;
    mode : MouseMode;
    stateChanged : boolean;
    simulationFocused : boolean;
    isDragging : boolean;
    isPanning : boolean;
    isDraggingComponent : boolean;
    draggingWireHitArea : WiringArea;
    activeWiringArea : WiringArea;
    lockSelectedToCursor : boolean;
    
    private draggingWire : Wire;
    private isDraggingWire : boolean;
    
    constructor(stage : PIXI.Container) {
        this.components = new Array<SimulationComponent>();
        this.numComponents = 0;
        this.scale = 1;
        this.mode = MouseMode.SELECT;
        this.stateChanged = true;
        this.stage = stage;
        this.draggingWire = null;
    }

    addComponent(component : SimulationComponent) {
        component.componentId = this.numComponents.toString();
        
        component.addOnWiringAreaActive((e : WiringAreaActiveEvent) => {
            this.activeWiringArea = e.wiringArea;
        })

        component.addOnWiringAreaLeave(() => {
            this.activeWiringArea = null;
        })

        this.components.push(component);
        this.numComponents ++;
    }

    setDraggingWire(wire : Wire) {
        this.draggingWire = wire;
        wire.beginPlace();
        this.isDragging = true;
    }

    getDraggingWire() {
        return this.draggingWire;
    }

    stopDraggingWire() {
        this.draggingWire.endPlace();
        this.draggingWire = null;
        this.isDragging = false;
    }
    
    getIsDraggingWire() {
        return this.isDragging;
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