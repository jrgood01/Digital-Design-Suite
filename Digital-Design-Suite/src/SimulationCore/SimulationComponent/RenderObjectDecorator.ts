import {GateComponentColor} from "./Gates/GateComponentColor";
import * as PIXI from 'pixi.js'
import {ComponentColor} from "./ComponentColor";

export interface RenderObjectDecorator {
    render : (x : number, y : number, graphic : PIXI.Graphics) => void,
    getGeometry : (x : number, y : number) => Record<string, number>,
    getColors : () => ComponentColor,
    setColors : (newColors : ComponentColor) => void
}