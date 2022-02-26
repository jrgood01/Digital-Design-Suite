//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner

import * as PIXI from 'pixi.js'
import {Heading} from "../../Heading";
import {DrawableClass} from "../DrawableClass";

export class WiringArea extends DrawableClass{
    constructor(x : number, y : number, container : PIXI.Container) {
        super(x, y, container);


        this.graphic.interactive = true;
        this.graphic.alpha = 0;
        this.graphic.isMask = false;

        this.draw()
        this.updateHitArea();
    }

    draw() {
        this.graphic.clear();
        this.graphic.lineStyle(4, 0x0000FF);
        this.graphic.drawCircle(this.x, this.y, 14);
    }

    setOffset(heading : Heading) {
        let adjustX = 0;
        let adjustY = 0;
        switch(heading) {
            case Heading.East:
            case Heading.West:
                adjustY += 3.5;
                break;
            case Heading.North:
            case Heading.South:
                adjustX += 3.5;
                break;
        }

        this.x += adjustX;
        this.y += adjustY;
        this.updateHitArea();
        this.draw();
    }
    updateHitArea() {
        this.graphic.hitArea = new PIXI.Rectangle(this.x - 20, this.y - 20 , 40, 40);
    }

}