import {ComponentColor} from "../../ComponentColor";
import {wireState} from "../../../WireStates";

export interface GateComponentColor extends ComponentColor {
    outputWireColor : () => number;
}