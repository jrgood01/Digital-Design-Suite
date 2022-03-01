import {GateRenderObjectDecorator} from "./GateRenderObjectDecorator";
import * as constants from "../../../../constants";
import {GateGeometry} from "./GateGeometry";
import {ComponentRenderObject} from "../../ComponentRenderObject";

export class GateRenderObjectFactory {
    private outputWireColor : () => number;

    linkOutputWireColor(outputWireColor : () => number) {
        this.outputWireColor = outputWireColor;
    }

    getGate(gateType : string) : GateRenderObjectDecorator {
        const defaultGateColors = {
            outputWireColor : this.outputWireColor ? this.outputWireColor : constants.General.componentColorStandard,
            bodyColor: () => {return constants.General.componentColorStandard;}
        }
        switch(gateType) {
            case "AND":
                return new GateRenderObjectDecorator(new ComponentRenderObject(GateGeometry.generateAndNandGateGeometry,
                    GateGeometry.drawAndGate, defaultGateColors));
            case "NAND":
                return new GateRenderObjectDecorator(new ComponentRenderObject(GateGeometry.generateAndNandGateGeometry,
                    GateGeometry.drawNandGate, defaultGateColors));
            case "OR":
                return new GateRenderObjectDecorator(new ComponentRenderObject(GateGeometry.generateOrNorGateGeometry,
                    GateGeometry.drawOrGate, defaultGateColors));
            case "NOR":
                return new GateRenderObjectDecorator(new ComponentRenderObject(GateGeometry.generateOrNorGateGeometry,
                    GateGeometry.drawNorGate, defaultGateColors));
            case "XOR":
                return new GateRenderObjectDecorator(new ComponentRenderObject(GateGeometry.generateXorXnorGeometry,
                    GateGeometry.drawXorGate, defaultGateColors));
            case "XNOR":
                return new GateRenderObjectDecorator(new ComponentRenderObject(GateGeometry.generateXorXnorGeometry,
                    GateGeometry.drawXnorGate, defaultGateColors));
            case "NOT":
                return new GateRenderObjectDecorator(new ComponentRenderObject(GateGeometry.generateNotGateGeometry,
                    GateGeometry.drawNotGate, defaultGateColors));
        }
    }
}