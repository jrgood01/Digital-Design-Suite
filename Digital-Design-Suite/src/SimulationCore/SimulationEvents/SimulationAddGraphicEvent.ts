//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {Graphics} from "pixi.js"

export class SimulationAddGraphicEvent {
    graphic : Graphics;
    constructor(graphic : Graphics) {
        this.graphic = graphic;
    }
}