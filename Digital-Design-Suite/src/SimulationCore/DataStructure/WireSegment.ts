import { ProviderExoticComponent } from "react";
import { Wire } from "./Wire";
import * as PIXI from "pixi.js"
import * as Constants from "../../constants"
import { wireState } from "../WireStates";
import { SimulationComponent } from "../SimulationComponent/SimulationComponent";
import { Moveable } from "../Moveable";
export class WireSegment{
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
    onMove : (ev : MouseEvent) => void;

    private graphic : PIXI.Graphics;
    private selected : boolean;
    private isDragging : boolean;
    private bounds : PIXI.Bounds;
    

    constructor(isVertical : boolean, startCoordinate : PIXI.Point, length : number) {
        this.graphic = new PIXI.Graphics();

        this.onClick = this.onClick.bind(this);

        this.isVertical = isVertical;
        this.start = startCoordinate;
        this.length = length;
        
        this.bounds = new PIXI.Bounds();
        this.updateBounds();
        this.state =  wireState.Float;
        
        document.addEventListener("mousedown", this.onClick);
        document.addEventListener("mousemove", this.onMouseMove);
        document.addEventListener("mouseup", this.onMouseUp);
    }

    setOnMove(handler : (ev : MouseEvent) => void) {
        this.onMove = handler;
    }

    onClick(ev : MouseEvent) {
        if (this.bounds.getRectangle().contains(ev.x, ev.y)) {
            this.selected = true;
            this.isDragging = true;
        }
    }

    onMouseMove(ev : MouseEvent) {
       /* if (this.bounds.getRectangle().contains(ev.x, ev.y)) {
            if (this.isDragging) {
                this.bounds.minX += ev.movementX;
                this.bounds.minY += ev.movementY;
                if (this.bottom != null) {

                }
                this.onMove(ev);
                this.updateBounds();
            }
        }*/
    }

    onMouseDown(ev : MouseEvent) {
        this.isDragging = true;
    }
    
    onMouseUp(ev : MouseEvent) {
        if (this.bounds.getRectangle().contains(ev.x, ev.y)) {
            this.selected = false;
            this.isDragging = false;
        }
    }

    updateBounds() {
        this.bounds.minX = this.start.x;
        this.bounds.minY = this.start.y;
        if (this.isVertical) {
            this.bounds.minX -= 3.5;
            this.bounds.maxX = this.bounds.minX + 7;
            this.bounds.maxY = this.bounds.minY + this.length;
        } else {
            this.bounds.minY -= 3.5;
            this.bounds.maxY = this.bounds.minY + 7;
            this.bounds.maxX = this.bounds.minX + this.length;            
        }
    }

    Draw() {
        this.graphic.clear();
        this.graphic.lineStyle(7, this.selected ?  Constants.General.selectedColor : this.state)
            .moveTo(this.start.x, this.start.y)
            .lineTo(this.isVertical ? this.start.x : this.start.x + this.length,
                this.isVertical ? this.start.y + this.length : this.start.y);
    }

    private translateAttached(dX : number, dY : number) {
        if(this.ComponentDockTop != null) {
            this.ComponentDockTop.translate(dX, dY);
        }

        if(this.ComponentDockBottom != null) {
            this.ComponentDockBottom.translate(dX, dY);
        }
    }
}