import { WiringArea } from "../SimulationComponent/WiringArea";

export class WiringAreaActiveEvent {
    wiringArea : WiringArea;
    constructor(wiringArea : WiringArea) {
        this.wiringArea = wiringArea;
    }
}