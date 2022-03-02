import { SimulationComponent } from "../../SimulationComponent";
import { SimulationState } from "../../../SimulationState";
import * as constants from "../../../../constants"
import * as PIXI from 'pixi.js'
import { wireState } from "../../../WireStates";
import { Heading } from "../../../../Heading";
import {WireBoxTextFactory} from "../Render/Factory/WireBoxTextFactory";
export class Clock extends SimulationComponent {
    value : boolean;
    constructor(x : number, y : number, container : PIXI.Container, frequency : number) {
        super(x, y, container, 0, 1, Array<number>(0).fill(1), Array<number>(1).fill(1));
        this.getColor = this.getColor.bind(this);
        this.value = false;

        const renderTarget = WireBoxTextFactory.generateWireBoxText({bodyColor : this.getColor})

        this.addRenderTarget(renderTarget);
        this.addWiringArea(this.geometry['outLineEndX'], this.geometry['outLineEndY'],
            0, false, Heading.East);
    }

    simulate() {
        this.output.setLineBit(0, 0, wireState.High)
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
}