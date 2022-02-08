import { SimulationComponent } from "../SimulationComponent/SimulationComponent";
import {WiringArea} from "../SimulationComponent/WiringArea"
import { ComponentEvent } from "./ComponentEvent";

export class HitAreaClickEvent extends ComponentEvent{
    hitArea : WiringArea;
    constructor(component : SimulationComponent, hitArea : WiringArea) {
        super(component);
        this.hitArea = hitArea;
    }
}