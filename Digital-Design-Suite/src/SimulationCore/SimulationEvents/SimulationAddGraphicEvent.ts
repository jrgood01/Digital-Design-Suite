import {Graphics} from "pixi.js"

export class SimulationAddGraphicEvent {
    graphic : Graphics;
    constructor(graphic : Graphics) {
        this.graphic = graphic;
    }
}