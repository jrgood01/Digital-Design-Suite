//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import { Wire } from "../DynamicWiring/Wire";
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