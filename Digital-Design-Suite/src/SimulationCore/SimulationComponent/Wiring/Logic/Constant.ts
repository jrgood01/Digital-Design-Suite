import {SimulationComponent} from "../../SimulationComponent";
import * as constants from "../../../../constants"
import * as PIXI from 'pixi.js'
import {wireState} from "../../../WireStates";
import {Heading} from "../../../../Heading";
import {WireBoxTextFactory} from "../Render/Factory/WireBoxTextFactory";
import {SingleBitWidthInputComponent} from "../../interfaces/SingleBitwidthInputComponent";

export class ConstantComponent extends SimulationComponent implements SingleBitWidthInputComponent{
    value : number;
    private text : PIXI.Text;
    private bitWidth : number;
    private onMaxValChanged : (newMax : number) => void;
    constructor(x : number, y : number, container : PIXI.Container, bitSize : number) {
        super(x, y, container, 0, 1, Array<number>(0).fill(1), Array<number>(1).fill(bitSize));
        this.getColor = this.getColor.bind(this);
        this.getMaxValue = this.getMaxValue.bind(this);
        this.setOnMaxValueChanged = this.setOnMaxValueChanged.bind(this);

        this.value = Math.pow(2, bitSize) - 1; //set value to max
        this.text = new PIXI.Text("0x"+this.value.toString(16));
        this.componentTemplate.addChild(this.text);

        const renderTarget = WireBoxTextFactory.generateWireBoxText({bodyColor : this.getColor})
        renderTarget.linkText(this.text);
        this.bitWidth = bitSize;
        this.addRenderTarget(renderTarget);
        this.addWiringArea(this.geometry['outLineEndX'], this.geometry['outLineEndY'],
        0, false, Heading.East);
    } 

    simulate() {
        const binStr = this.value.toString(2);
        for (let i = 0; i < this.bitWidth; i ++) {
            if (i < binStr.length && binStr[binStr.length - i - 1] == "1") {
                this.output.setLineBit(0, i, wireState.High);
            } else {
                this.output.setLineBit(0, i, wireState.Low);
            }
        }
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
        this.text.text = `0x${this.value.toString(16)}`;
    }

    getValue() {
        return this.value;
    }

    getMaxValue() {
        return Math.pow(2, this.getBitWidth()) - 1;
    }

    getBitWidth() : number {
        return this.bitWidth;
    }

    setBitWidth(newBitWidth: number)  {
        this.bitWidth = newBitWidth;
        if (this.onMaxValChanged)
            this.onMaxValChanged(this.getMaxValue());
    }

    setOnMaxValueChanged(handler : (newMax : number) => void) {
        this.onMaxValChanged = handler;
    }
}