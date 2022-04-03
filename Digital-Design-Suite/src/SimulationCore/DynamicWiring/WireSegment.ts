//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import * as PIXI from "pixi.js"
import {Heading} from "../../Heading";
import {wireState} from "../WireStates";
import {SimulationComponent} from "../SimulationComponent/SimulationComponent";

export class WireSegment {
    private componentDockBottom : SimulationComponent;
    private componentDockTop : SimulationComponent;

    private componentDockBottomActionIndex : number;
    private componentDockTopActionIndex : number;


    private intermediate : Array<WireSegment>;
    private isVertical : boolean;

    private start : PIXI.Point;
    private length : number;

    private colorArr : Array<number>;

    private graphic : PIXI.Graphics;
    private bounds : PIXI.Bounds;

    private top : WireSegment;
    private bottom : WireSegment;

    private heading : Heading;

    private padStartX : number;
    private padStartY : number;

    constructor(isVertical : boolean, startCoordinate : PIXI.Point, length : number) {
        this.start = startCoordinate;
        this.length = length;

        this.componentDockTop = null;
        this.componentDockBottom = null;

        this.intermediate = new Array<WireSegment>();

        this.isVertical = isVertical;

        this.graphic = new PIXI.Graphics();
        this.colorArr = new Array<number>();

        this.componentDockBottomActionIndex = -1;
        this.componentDockTopActionIndex = -1;

        this.top = null;
        this.bottom = null;

        this.padStartX = 0;
        this.padStartY = 0;
    }

    setTop(top : WireSegment) {
        this.top = top;
    }

    setBottom(bottom : WireSegment) {
        this.bottom = bottom;
    }

    getTop() {
        return this.top;
    }

    getBottom() {
        return this.bottom;
    }

    addIntermediate(intermediate : WireSegment) {
        this.intermediate.push(intermediate);
    }

    getIntermediate() {
        return this.intermediate;
    }

    removeTop() {
        this.top = null;
    }

    removeBottom() {
        this.bottom = null;
    }

    getLength() {
        return this.length
    }

    setLength(length : number) {
        this.length = length;
        this._setHeading();
    }

    invert() {
        this.isVertical = !this.isVertical;
    }

    getEnd() {
        const retPt = new PIXI.Point();

        if (this.isVertical) {
            retPt.y = this.start.y + this.length;
            retPt.x = this.start.x;
        } else {
            retPt.x = this.start.x + this.length;
            retPt.y = this.start.y;
        }

        return retPt;
    }

    getStart() {
        return this.start;
    }

    setEnd(newEnd : PIXI.Point) {
        this.length = this.isVertical ? newEnd.y - this.start.y :
                                        newEnd.x - this.start.x;
    }

    setStart(newStart : PIXI.Point) {
        this.start = newStart;
    }

    getIsVertical() {
        return this.isVertical

    }

    getHeading() {
        if (this.isVertical) {
            if (length > 0) {
                return Heading.South;
            } else {
                return Heading.North;
            }
        } else {
            if (length > 0) {
                return Heading.East;
            } else {
                return Heading.West
            }
        }
    }

    getGraphic() {
        return this.graphic;
    }


    /**
     * Sets a multibit color
     * @param color
     */
    setColorArr(color : Array<number>) : void {
        this.colorArr = color;
    }

    padX(pad : number) {
        this.padStartX = pad;
    }

    padY(pad : number) {
        this.padStartY = pad;
    }

    clearPadding() {
        this.padStartX = 0;
        this.padStartY = 0;
    }
    addComponentDockBottom(dock : SimulationComponent) {
        this.componentDockBottom = dock;
        this.componentDockBottom.onMove.push(this._onComponentBottomMove);
        this.componentDockBottomActionIndex = this.componentDockBottom.onMove.length - 1;
    }

    addComponentDockTop(dock : SimulationComponent) {
        this.componentDockTop = dock;
        this.componentDockTop.onMove.push(this._onComponentTopMove);

    }

    undockComponentBottom() {
        this.componentDockBottom.onMove.splice(this.componentDockBottomActionIndex);
        this.componentDockBottomActionIndex = -1;
        this.componentDockBottom = null;
    }

    undockComponentTop() {
        this.componentDockTop.onMove.splice(this.componentDockTopActionIndex);
        this.componentDockTopActionIndex = -1;
        this.componentDockTop = null;
    }

    private _updateBounds() {
        if (this.isVertical) {
            const reverseBounds = this.getHeading() == Heading.North;
            this.bounds.minY = reverseBounds ?
                this.getEnd().y : this.start.y;
            this.bounds.minX = this.start.x;
            this.bounds.maxY = reverseBounds ?
                this.start.y  : this.getEnd().y;
            this.bounds.maxX = this.start.x + 7;
        } else {
            const reverseBounds = this.getHeading() == Heading.West;
            this.bounds.minY = this.start.y;
            this.bounds.minX = reverseBounds ?
                this.getEnd().x : this.start.x;
            this.bounds.maxY = this.start.y + 7;
            this.bounds.maxX = reverseBounds ?
                this.start.x : this.getEnd().x;
        }

        if (this.isVertical) {
            this.graphic.hitArea = new PIXI.Rectangle(this.bounds.minX, this.bounds.minY,
                6.5, this.length)
        } else {
            this.graphic.hitArea = new PIXI.Rectangle(this.bounds.minX, this.bounds.minY,
                this.length, 6.5);
        }
    }

    private _onComponentBottomMove(dX : number, dY : number) {
        this.start.y += dY;
        this.start.x += dX;
        if (this.isVertical) {
            this.length -= dY;
            if (this.top != null) {
                this.top.start.x += dX;
                this.top.length -= dX;
            }
        } else {
            this.length -= dX;
            if (this.top != null) {
                this.top.start.y += dY;
                this.top.length -= dY;
            }
        }
    }

    private _setHeading(pad? : boolean) {
        const startHeading = this.heading;

        if (this.isVertical) {
            if (this.length > 0) {
                this.heading = Heading.South;
            } else {
                this.heading = Heading.North;
            }
        } else {
            if (this.length > 0) {
                this.heading = Heading.East;
            } else {
                this.heading = Heading.West;
            }
        }
    }

    private _onComponentTopMove(dX : number, dY : number) {
        if (this.isVertical) {
            this.length += dY;
            if (this.bottom != null) {
                this.bottom.length += dX;
                this.start.x += dX;
            }
        } else {
            this.length += dX;
            if (this.bottom != null) {
                this.bottom.length += dY;
                this.start.y += dY;
            }
        }
        this._setHeading();
    }

    draw() {
        this.graphic.clear();
        if (this.colorArr.length > 0) {
            const step = 7 / this.colorArr.length;
            for (let i = 0; i < this.colorArr.length; i++) {
                this.graphic.beginFill(this.colorArr[i]);
                if (this.isVertical) {
                    this.graphic.drawRect(this.start.x + this.padStartX + step * i, this.start.y + this.padStartY, step, this.length - this.padStartY);
                } else {
                    this.graphic.drawRect(this.start.x + this.padStartX, this.start.y + this.padStartY  + step * i, this.length - this.padStartX, step);
                }
            }
        } else {
            this.graphic.beginFill(wireState.Float);
            this.graphic.drawRect(this.start.x + this.padStartX, this.start.y + this.padStartY,
                this.isVertical ? 7 : this.length, this.isVertical ? this.length : 7);
        }
    }
}

