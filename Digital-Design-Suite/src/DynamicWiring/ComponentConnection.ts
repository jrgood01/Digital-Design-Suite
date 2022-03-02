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
export interface ComponentConnection {
    component : SimulationComponent;
    componentLineNumber : number;
    lineUpdated : boolean;
}
