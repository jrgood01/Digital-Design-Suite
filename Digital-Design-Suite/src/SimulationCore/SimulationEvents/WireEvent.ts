import { Wire } from "../../DynamicWiring/Wire";

export class WireEvent {
    wire : Wire;
    constructor (wire : Wire) {
        this.wire = wire;
    }
}