import { SimulationComponent } from "../SimulationComponent";
import { SimulationState } from "../../SimulationState";
import * as constants from "../../../constants"
import * as PIXI from 'pixi.js'
import { wireState } from "../../../SimulationCore/WireStates";
import { Heading } from "../../../Heading";
import {WireBoxTextFactory} from "./RenderGeometry/WireBoxTextFactory";
export class ConstantComponent extends SimulationComponent {
    value : number;
    private text : PIXI.Text;
    constructor(x : number, y : number, container : PIXI.Container, bitSize : number) {
        super(x, y, container, 0, 1, Array<number>(0).fill(1), Array<number>(1).fill(bitSize));
        this.getColor = this.getColor.bind(this);
        this.value = Math.pow(2, bitSize) - 1; //set value to max
        this.text = new PIXI.Text("0x"+this.value.toString(16));
        this.componentTemplate.addChild(this.text);
        this.geometry = this.calculateGeometry(1);

        const renderTarget = WireBoxTextFactory.generateWireBoxText({bodyColor : this.getColor})
        renderTarget.linkText(this.text);

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
        if (this.value > 0) {
            return constants.General.componentColorHigh;
        } else {
            return constants.General.componentColorLow;
        }
    }

    setValue(newValue : number) {
        this.value = newValue;
        this.text = new PIXI.Text("0x"+this.value.toString(16));
    }
}