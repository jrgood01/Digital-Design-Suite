import {WiringArea} from "./WiringArea";
import {Wire} from "./Wire";
import * as PIXI from 'pixi.js'
export class WireWiringArea extends WiringArea {
    private wire : Wire;
    constructor(x : number, y : number, container : PIXI.Container, wire : Wire) {
        super(x, y, container);
        this.wire = wire;
    }

    getWire() {
        return this.wire;
    }
}