import { Wire } from "../Wiring/Wire";

export class WireEvent {
    wire : Wire;
    constructor (wire : Wire) {
        this.wire = wire;
    }
}