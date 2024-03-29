//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {GateRenderObjectDecorator} from "../RenderDecorator/GateRenderObjectDecorator";
import * as constants from "../../../../../constants";
import {GateGeometry} from "../Geometry/GateGeometry";
import {ComponentRenderObject} from "../../../ComponentRenderObject";

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