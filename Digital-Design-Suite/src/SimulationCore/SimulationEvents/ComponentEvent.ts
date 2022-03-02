import { SimulationComponent } from "../../SimulationComponent/SimulationComponent";

export class ComponentEvent {
    component : SimulationComponent;
    constructor(component : SimulationComponent) {
        this.component = component;
    }
}