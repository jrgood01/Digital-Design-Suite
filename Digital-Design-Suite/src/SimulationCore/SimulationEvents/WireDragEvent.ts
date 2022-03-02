import { Wire } from "../../DynamicWiring/Wire";
import { WireEvent } from "./WireEvent";

export class WireDragEvent extends WireEvent {
    x : number;
    y : number;
    dX : number;
    dY : number;
    constructor (wire : Wire, x : number, y : number
        , dX : number, dY : number) {
        super(wire);
        this.x = x;
        this.y = y;
        this.dX = dX;
        this.dY = dY;
    }
}