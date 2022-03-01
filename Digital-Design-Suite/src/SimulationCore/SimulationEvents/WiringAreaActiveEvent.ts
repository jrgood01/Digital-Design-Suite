import { WiringArea } from "../Wiring/WiringArea";

export class WiringAreaActiveEvent {
    wiringArea : WiringArea;
    constructor(wiringArea : WiringArea) {
        this.wiringArea = wiringArea;
    }
}