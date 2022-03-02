import { WiringArea } from "../../DynamicWiring/WiringArea";

export class WiringAreaActiveEvent {
    wiringArea : WiringArea;
    constructor(wiringArea : WiringArea) {
        this.wiringArea = wiringArea;
    }
}