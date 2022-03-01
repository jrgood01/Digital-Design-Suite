import { SimulationComponent } from "../SimulationComponent/SimulationComponent";
import {WiringArea} from "../Wiring/WiringArea"
import { ComponentEvent } from "./ComponentEvent";
import {ComponentWiringArea} from "../Wiring/ComponentWiringArea";

export class HitAreaClickEvent extends ComponentEvent{
    hitArea : ComponentWiringArea;
    constructor(component : SimulationComponent, hitArea : ComponentWiringArea) {
        super(component);
        this.hitArea = hitArea;
    }
}