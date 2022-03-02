import {ComponentColor} from "../../ComponentColor";
import {wireState} from "../../../SimulationCore/WireStates";

export interface GateComponentColor extends ComponentColor {
    outputWireColor : () => number;
}