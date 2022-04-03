import {VariableInputComponent} from "../../VariableInputComponent";
import * as PIXI from "pixi.js";
import {GateRenderObjectFactory} from "../Render/Factory/GateFactory";
import {SingleBitWidthInputComponent} from "../../interfaces/SingleBitwidthInputComponent";
import * as Constants from "../../../../constants"

export abstract class Gate extends VariableInputComponent implements SingleBitWidthInputComponent {
    inputs : number;
    bitWidth : number;
    protected gateRenderObjectFactory : GateRenderObjectFactory;

    constructor(x : number, y : number, container : PIXI.Container, bitWidth : number, numInputs : number, componentHeight? : number) {
        super(x, y, container, numInputs, 1, Array(numInputs).fill(bitWidth), Array(bitWidth).fill(1),
            componentHeight ? componentHeight : 200);
        this.getOutput = this.getOutput.bind(this);
        this.getColor = this.getColor.bind(this);
        this.gateRenderObjectFactory = new GateRenderObjectFactory();
        this.setBitWidth(bitWidth);
        this.inputs = numInputs;
        this.bitWidth = bitWidth;
    }


    getOutput() {
        return this.output.getLineValue(0);
    }

    getColor() {
        if (this.bitWidth > 1) {
            return Constants.General.componentMultiBit;
        } else {
            return this.getOutput()[0];
        }
    }

    updateGraphic() {
        this.drawInputAreas(false);
    }

    getBitWidth() : number {
        return this.bitWidth;
    }

    setBitWidth(newBitWidth : number) {
        this.gateRenderObjectFactory.linkOutputWireColor(this.getColor);
        this.bitWidth = newBitWidth;
    }
}