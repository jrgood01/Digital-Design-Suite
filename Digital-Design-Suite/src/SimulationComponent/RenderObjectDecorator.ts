//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import * as PIXI from 'pixi.js'
import {ComponentColor} from "./ComponentColor";

export interface RenderObjectDecorator {
    render : (x : number, y : number, graphic : PIXI.Graphics) => void,
    getGeometry : (x : number, y : number) => Record<string, number>,
    getColors : () => ComponentColor,
    setColors : (newColors : ComponentColor) => void
}