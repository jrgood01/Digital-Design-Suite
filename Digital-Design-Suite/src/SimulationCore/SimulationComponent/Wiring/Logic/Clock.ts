import {SimulationComponent} from "../../SimulationComponent";
import * as constants from "../../../../constants"
import * as PIXI from 'pixi.js'
import {wireState} from "../../../WireStates";
import {Heading} from "../../../../Heading";
import {ClockFactory} from "../Render/Factory/ClockFactory";

export class Clock extends SimulationComponent {
    private value : boolean;
    private tickTimer : NodeJS.Timeout;
    constructor(x : number, y : number, container : PIXI.Container, frequency : number) {
        super(x, y, container, 0, 1, Array<number>(0).fill(1), Array<number>(1).fill(1));
        this.getColor = this.getColor.bind(this);
        this.value = false;
        this.tick = this.tick.bind(this);

        const renderTarget = ClockFactory.generateClock({bodyColor : this.getColor})
        renderTarget.linkState(() => {return this.value;});
        this.addRenderTarget(renderTarget);
        this.addWiringArea(this.geometry['outLineEndX'], this.geometry['outLineEndY'],
            0, false, Heading.East);
        this.tickTimer = setInterval(this.tick, 1000 / frequency);
    }

    simulate() {
        this.output.setLineBit(0, 0, this.value ? wireState.High : wireState.Low);
    }

    getColor() {
        if (this.selected) {
            return constants.General.selectedColor;
        }
        if (this.value) {
            return constants.General.componentColorHigh;
        } else {
            return constants.General.componentColorLow;
        }
    }

    tick() {
        this.value = !this.value;
    }
}