import { SimulationComponent } from "../../SimulationComponent/SimulationComponent";
import {WiringArea} from "../../DynamicWiring/WiringArea"
import { ComponentEvent } from "./ComponentEvent";
import {ComponentWiringArea} from "../../DynamicWiring/ComponentWiringArea";

export class HitAreaClickEvent extends ComponentEvent{
    hitArea : ComponentWiringArea;
    constructor(component : SimulationComponent, hitArea : ComponentWiringArea) {
        super(component);
        this.hitArea = hitArea;
    }
}