import { SimulationComponent } from "../../SimulationComponent/SimulationComponent";
import { WiringArea } from "../../DynamicWiring/WiringArea";
import { Wire } from "../../DynamicWiring/Wire";
import { WireDragEvent } from "./WireDragEvent";
import {ComponentWiringArea} from "../../DynamicWiring/ComponentWiringArea";

export class WireEndDragAtWiringAreaEvent extends WireDragEvent {
    wire : Wire;
    component : SimulationComponent;
    wiringArea : WiringArea;

    constructor(wire : Wire, component : SimulationComponent, wiringArea : WiringArea, x : number, y : number) {
        super(wire, x, y, 0, 0);
        this.component = component;
        this.wiringArea = wiringArea;
    }
}