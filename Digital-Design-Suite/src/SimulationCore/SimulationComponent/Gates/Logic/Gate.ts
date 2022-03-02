import {VariableInputComponent} from "../../VariableInputComponent";
import * as PIXI from "pixi.js";
import {Heading} from "../../../../Heading";
import {GateRenderObjectFactory} from "../Render/Factory/GateFactory";

export abstract class Gate extends VariableInputComponent{
    inputs : number;
    bitWidth : number;
    protected gateRenderObjectFactory : GateRenderObjectFactory;

    constructor(x : number, y : number, container : PIXI.Container, bitWidth : number, numInputs : number, componentHeight? : number) {
        super(x, y, container, numInputs, 1, Array(numInputs).fill(bitWidth), Array(bitWidth).fill(1),
            componentHeight ? componentHeight : 200);
        this.getOutput = this.getOutput.bind(this);

        this.inputs = numInputs;
        this.bitWidth = bitWidth;

        this.gateRenderObjectFactory = new GateRenderObjectFactory();
        this.gateRenderObjectFactory.linkOutputWireColor(this.getOutput);
    }

    getOutput() {
        return this.output.getLineBit(0, 0);
    }

    updateGraphic() {
        this.drawInputAreas(false);
    }
}