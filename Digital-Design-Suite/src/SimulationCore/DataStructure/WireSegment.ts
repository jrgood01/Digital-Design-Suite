//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import { ProviderExoticComponent } from "react";
import { Wire } from "./Wire";
import * as PIXI from "pixi.js"
import * as Constants from "../../constants"
import { wireState } from "../WireStates";
import { SimulationComponent } from "../SimulationComponent/SimulationComponent";
import { Moveable } from "../Moveable";
import { InteractionEvent } from "pixi.js";
export class WireSegment {
    top : WireSegment;
    bottom : WireSegment;
    intermediate : Array<WireSegment>;

    isVertical : boolean;

    start : PIXI.Point;
    length : number;

    deleted : boolean;

    state : wireState

    ComponentDockBottom : SimulationComponent;
    ComponentDockTop : SimulationComponent;

    private onCreateNewSegment : (created : WireSegment) => void;

    private graphic : PIXI.Graphics;
    private selected : boolean;
    private lockedToMouseX : boolean;
    private lockedToMouseY : boolean;
    private stage;
    private bounds : PIXI.Bounds;

    private xBoundsReversed : boolean;
    private yBoundsReversed : boolean;
    

    constructor(isVertical : boolean, startCoordinate : PIXI.Point, length : number, 
            stage : PIXI.Container, onSegmentCreate : (created : WireSegment) => void ) {

        this.graphic = new PIXI.Graphics();
        this.graphic.zIndex = 100;
        this.onClick = this.onClick.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);


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

        this.stage.on("pointermove", this.onMouseMove)
        this.stage.on("pointerdown", this.onClick);
        this.graphic.on("mousedown", () => {console.log("RR")})

        this.onCreateNewSegment = onSegmentCreate;
        if (this.isVertical) {
            this.start.y += 3.5;
        } else {
            this.start.y -= .1;
        }

        stage.addChild(this.graphic);
    }

    onClick(ev : InteractionEvent) {
        console.log("click")
        let v = this.graphic.getBounds();
        let pos = ev.data.global;
        if (this.contains(this.bounds, pos.x, pos.y)) {
            this.selected = true;
        } else {
            this.selected = false;
        }
    }

    getEndPoint() {
        return new PIXI.Point(this.xBoundsReversed ? this.bounds.minX : this.bounds.maxX, 
            this.yBoundsReversed ? this.bounds.minY : this.bounds.maxY);
    }

    onMouseMove(ev : InteractionEvent) {
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
        
        this.graphic.lineStyle(6.5, this.selected ?  Constants.General.selectedColor : this.state)
            .moveTo(this.start.x, this.start.y)
            .lineTo(this.isVertical ? this.start.x : this.start.x + this.length,
                this.isVertical ? this.start.y + this.length : this.start.y);


    }

    contains(bounds : PIXI.Bounds, x : number, y : number) {
        let xContains = (x < bounds.maxX && x > bounds.minX)
        let yContains = (y < bounds.maxY && y > bounds.minY)

        return xContains && yContains;
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
            this.yBoundsReversed = false;
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
            console.log("trigger nested add wire")
            let addWire = new WireSegment(!this.isVertical, 
                new PIXI.Point(this.start.x, this.start.y), 0, this.stage, this.onCreateNewSegment);
            addWire.ComponentDockBottom = this.ComponentDockBottom;
            addWire.top = this;
            this.ComponentDockBottom = null;
            this.bottom = addWire;
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