//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner

import * as PIXI from 'pixi.js'
import { SimulationComponent } from './SimulationComponent';

export interface WiringArea {
    x : number;
    y : number;
    
    component : SimulationComponent;

    input : boolean;
    lineNumber : number;

    graphic : PIXI.Graphics;
}