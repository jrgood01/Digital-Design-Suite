//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import * as PIXI from "pixi.js"
import * as Constants from "../../constants"
import { wireState } from "../WireStates";
import { SimulationComponent } from "../SimulationComponent/SimulationComponent";
import { Moveable } from "../Moveable";
import { InteractionEvent } from "pixi.js";
import { Heading } from "../../Heading";
import { Util } from "../../Util";
import { Wire } from "./Wire";
export class WireSegment {
    top : WireSegment;
    bottom : WireSegment;
    intermediate : Array<WireSegment>;

    isVertical : boolean;

    start : PIXI.Point;
    length : number;

    deleted : boolean;

    state : wireState
    color : number;

    private ComponentDockBottom : SimulationComponent;
    private ComponentDockTop : SimulationComponent;

    private onCreateNewSegment : (created : WireSegment) => void;

    private graphic : PIXI.Graphics;
    private selected : boolean;
    private lockedToMouseX : boolean;
    private lockedToMouseY : boolean;
    private stage;
    private bounds : PIXI.Bounds;

    private xBoundsReversed : boolean;
    private yBoundsReversed : boolean;

    private componentDockBottomActionIndex : number;
    private componentDockTopActionIndex : number;

    constructor(isVertical : boolean, startCoordinate : PIXI.Point, length : number, 
            stage : PIXI.Container, onSegmentCreate : (created : WireSegment) => void ) {

        this.graphic = new PIXI.Graphics();
        this.graphic.zIndex = 100;

        this._onClick = this._onClick.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);

        this._onComponentBottomMove = this._onComponentBottomMove.bind(this);
        this._onComponentTopMove = this._onComponentTopMove.bind(this);
        this.addComponentDockBottom = this.addComponentDockBottom.bind(this);


        this.isVertical = isVertical;
        this.start = startCoordinate;
        this.length = length;
        
        this.bounds = new PIXI.Bounds();
        this._updateBounds();
        this.state =  wireState.Float;
        this.intermediate = new Array<WireSegment>();

        this.lockedToMouseX = false;
        this.lockedToMouseY = false;

        this.graphic.interactive = true;
        this.graphic.cursor = "grab"
        this.stage = stage;

        this.xBoundsReversed = false;
        this.yBoundsReversed = false;

        this.stage.on("pointermove", this._onMouseMove)
        this.stage.on("pointerdown", this._onClick);
        this.stage.on("pointerup", this._onMouseUp);

        this.onCreateNewSegment = onSegmentCreate;

        this.componentDockBottomActionIndex = -1;
        this.componentDockTopActionIndex = -1;
        this.color = wireState.Float;
        stage.addChild(this.graphic);
    }

    addComponentDockBottom(dock : SimulationComponent) {
        this.ComponentDockBottom = dock;
        this.ComponentDockBottom.onMove.push(this._onComponentBottomMove);
        this.componentDockBottomActionIndex = this.ComponentDockBottom.onMove.length - 1;
        console.log(this.ComponentDockBottom.onMove)
    }

    addComponentDockTop(dock : SimulationComponent) {
        this.ComponentDockTop = dock;
        this.ComponentDockTop.onMove.push(this._onComponentTopMove);

    }

    undockComponentBottom() {
        this.ComponentDockBottom.onMove.splice(this.componentDockBottomActionIndex);
        this.componentDockBottomActionIndex = -1;
        this.ComponentDockBottom = null;
    }

    undockComponentTop() {
        this.ComponentDockTop.onMove.splice(this.componentDockTopActionIndex);
        this.componentDockTopActionIndex = -1;
        this.ComponentDockTop = null;       
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

    private _onComponentTopMove(dX : number, dY : number) {
        console.log("OnComponentTopMove")
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
    }

    private _onClick(ev : InteractionEvent) {
        console.log("click")
        let v = this.graphic.getBounds();
        let pos = ev.data.global;
        if (Util.contains(this.bounds, pos.x, pos.y)) {
            this.selected = true;
        } else {
            this.selected = false;
        }
    }

    getEndPoint() {
        return new PIXI.Point(this.xBoundsReversed ? this.bounds.minX : this.bounds.maxX, 
            this.yBoundsReversed ? this.bounds.minY : this.bounds.maxY);
    }

    private _onMouseMove(ev : InteractionEvent) {
        this.graphic.clear();
        let pos = ev.data.global;
        let dX = pos.x - this.start.x;
        let dY = pos.y - this.start.y;

        if (this.lockedToMouseX) {
            this.length = pos.x - this.start.x;
        }

        if (this.lockedToMouseY) {
            this.length = pos.y - this.start.y;
        }

        if (this.selected) {
            this._updateLength(this.isVertical ? dX : dY);
            this.intermediate.forEach((segment : WireSegment) => {
                segment.length = this.isVertical ? dX : dY;
            });
        }
        this._updateBounds();
    }

    private _onMouseUp() {
        this.selected = false;
    }

    lockToMouseX() {
        this.lockedToMouseX = true;
        this.lockedToMouseY = false;
    }

    lockToMouseY() {
        this.lockedToMouseY = true;
        this.lockedToMouseX = false;
    }

    unlockMouse() {
        this.lockedToMouseX = false;
        this.lockedToMouseY = false;
    }

    Draw() {
        this.graphic.clear();
        
        this.graphic.lineStyle(6.5, this.selected ?  Constants.General.selectedColor : this.color)
            .moveTo(this.start.x, this.start.y)
            .lineTo(this.isVertical ? this.start.x : this.start.x + this.length,
                this.isVertical ? this.start.y + this.length : this.start.y);


    }

    getHeading() {
        if (this.isVertical) {
            if (this.length > 0) {
                return Heading.South;
            } else {
                return Heading.North;
            }
        } else {
            if (this.length > 0) {
                return Heading.East;
            } else {
                return Heading.West;
            }
        }
    }

    private _updateBounds() {
        this.bounds.minX = this.start.x;
        this.bounds.minY = this.start.y;
        
        this.bounds.maxX = this.bounds.minX + (this.isVertical ? 6.5 : this.length);
        this.bounds.maxY = this.bounds.minY + (this.isVertical ? this.length : 6.5);

        if (this.bounds.minX > this.bounds.maxX) {
            let tmp = this.bounds.minX;
            this.bounds.minX = this.bounds.maxX;
            this.bounds.maxX = tmp;
            this.xBoundsReversed = true;
        } else {
            this.xBoundsReversed = false;
        }

        if (this.bounds.minY > this.bounds.maxY) {
            let tmp = this.bounds.minY;
            this.bounds.minY = this.bounds.maxY;
            this.bounds.maxY = tmp;
            this.yBoundsReversed = true;
        } else {
            this.yBoundsReversed = false;
        }

        if (this.isVertical) {
            this.graphic.hitArea = new PIXI.Rectangle(this.bounds.minX, this.bounds.minY,
                6.5, this.length)
        } else {
            this.graphic.hitArea = new PIXI.Rectangle(this.bounds.minX, this.bounds.minY, 
                this.length, 6.5);
        }
    }

    private _updateLength(delta : number) {
        if (this.ComponentDockBottom != null) {
            let addWire = new WireSegment(!this.isVertical, 
                new PIXI.Point(this.start.x, this.start.y), 0, this.stage, this.onCreateNewSegment);
            let componentDockBottomPtr = this.ComponentDockBottom;
            this.undockComponentBottom();
            addWire.addComponentDockBottom(componentDockBottomPtr);
            addWire.top = this;
            this.bottom = addWire;
            this.onCreateNewSegment(addWire);
        }

        if (this.ComponentDockTop != null) {
            let addWire = new WireSegment(!this.isVertical, 
                this.getEndPoint(), 0, this.stage, this.onCreateNewSegment);
            let componentDockBottomPtr = this.ComponentDockTop;
            this.undockComponentTop();
            addWire.addComponentDockTop(componentDockBottomPtr);
            addWire.bottom = this;
            this.top = addWire;
            this.onCreateNewSegment(addWire);
        }

        if (this.bottom != null) {
            this.bottom.length += delta;
        }
        if (this.isVertical) {
            this.start.x += delta; 
    
            if (this.top != null) {
                this.top.start.x += delta;
                this.top.length -= delta;
            }
        } else {
            this.start.y += delta;
    
            if (this.top != null) {
                this.top.start.y += delta;
                this.top.length -= delta;
            }
        }
    }

}