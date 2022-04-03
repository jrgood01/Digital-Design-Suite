//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner

import * as PIXI from 'pixi.js'
import {Heading} from "../../Heading";
import {DrawableClass} from "../DrawableClass";

export abstract class WiringArea extends DrawableClass{
    private enabled : boolean;

    constructor(x : number, y : number, container : PIXI.Container) {
        super(x, y, container);

        this.graphic.interactive = true;
        this.graphic.alpha = 0;
        this.graphic.isMask = false;
        this.enabled = true;

        this.draw()
        this.updateHitArea();
    }

    abstract getHeading() : Heading;

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
    getIsEnabled() {
        return this.enabled;
    }

    setIsEnabled(enabled : boolean) {
        if (!enabled) {
            this.graphic.alpha = 0;
        }
        this.enabled = enabled;
    }

    setGraphicVisible() {
        if (this.enabled) {
            this.graphic.alpha = 1;
        }
    }

    setGraphicHidden() {
        this.graphic.alpha = 0;
    }

    getAnchorPoint() {
        switch (this.getHeading()) {
            case Heading.North:
                return new PIXI.Point(this.x - 3.5, this.y + 6);
                break;

            case Heading.East:
                return new PIXI.Point(this.x - 7, this.y + 6);
                break;

            case Heading.South:
                return new PIXI.Point(this.x - 10, this.y - 10);
                break;

            case Heading.West:
                return new PIXI.Point(this.x - 7, this.y - 6);
                break;

        }
    }


}