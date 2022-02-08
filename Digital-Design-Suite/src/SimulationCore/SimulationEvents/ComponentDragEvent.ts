import { ComponentEvent } from "./ComponentEvent";
import { SimulationComponent } from "../SimulationComponent/SimulationComponent";

export class ComponentDragEvent extends ComponentEvent {
    x : number;
    y : number;
    dX : number;
    dY : number;
    constructor(component : SimulationComponent, x : number
        , y : number, dX : number, dY : number) {
        super(component);
        this.x = x;
        this.y = y;
        this.dX = dX;
        this.dY = dY;
    }
}