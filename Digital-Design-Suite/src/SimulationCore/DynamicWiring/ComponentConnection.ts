//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import { SimulationComponent } from "../SimulationComponent/SimulationComponent";

/**
 * Represents an output line on a specific component
 */
export class ComponentConnection {
    private component : SimulationComponent;
    private componentLineNumber : number;
    private lineUpdated : boolean;

    constructor(component : SimulationComponent, componentLineNumber : number) {
        this.component = component;
        this.componentLineNumber = componentLineNumber;
        this.lineUpdated = false;
    }

    getLine() {
        return this.component.getOutputLine(this.componentLineNumber);
    }

    getLineBit(bit : number) {
        const line = this.component.getOutputLine(this.componentLineNumber);
        return line[bit];
    }

    getLineBitWidth() {
        return this.getLine().length;
    }

    hasUpdated() {
        return this.lineUpdated;
    }

    setHadUpdated(updated : boolean) {
        this.lineUpdated = updated;
    }

    getComponentVisited() {
        return this.component.visited;
    }
}
