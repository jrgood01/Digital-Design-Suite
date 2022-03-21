//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import * as PIXI from "pixi.js"
import {InteractionEvent} from "pixi.js"
import * as Constants from "../../constants"
import {wireState} from "../WireStates";
import {SimulationComponent} from "../SimulationComponent/SimulationComponent";
import {Heading} from "../../Heading";
import {Util} from "../../Util";
import {GlowFilter} from '@pixi/filter-glow';
import {SimulationGrid} from "../SimulationGrid";

export class WireSegment {
    top : WireSegment;
    bottom : WireSegment;
    intermediate : Array<WireSegment>;

    private isVertical : boolean;

    private start : PIXI.Point;
    private length : number;

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

    private grid : SimulationGrid;
    private heading : Heading;

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

        document.addEventListener("mousemove", this._onMouseMove)
        this.stage.on("pointerdown", this._onClick);
        this.stage.on("pointerup", this._onMouseUp);

        this.onCreateNewSegment = onSegmentCreate;

        this.componentDockBottomActionIndex = -1;
        this.componentDockTopActionIndex = -1;
        this.color = wireState.Float;
        stage.addChild(this.graphic);
        this.heading = Heading.South;
    }

    setGrid(grid : SimulationGrid) {
        this.grid = grid;
    }

    setHeading(pad? : boolean) {
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
        if (pad) {
            if (this.heading == Heading.North && startHeading == Heading.South) {
                this.length -= 12;
                this.start.y += 6;
            }

            if (this.heading == Heading.South && startHeading == Heading.North) {
                this.length += 12;
                this.start.y -= 6;
            }
        }
    }

    setIsVertical(isVertical : boolean) {
        this.isVertical = isVertical;
    }

    getIsVertical() {
        return this.isVertical;
    }

    setLength(length : number) {
        this.length = length;
    }

    getLength() {
        return this.length;
    }

    setStartX(startX : number) {
        this.start.x = startX;
    }

    incrementStartX(startdX : number) {
        this.start.x += startdX;
    }

    setStartY(startY : number) {
        this.start.y = startY;
    }

    incrementStartY(startdY : number) {
        this.start.y += startdY;
    }

    getStartPoint() {
        return this.start;
    }

    setStartPoint(point : PIXI.Point) {
        this.start = point;
    }

    addComponentDockBottom(dock : SimulationComponent) {
        this.ComponentDockBottom = dock;
        this.ComponentDockBottom.onMove.push(this._onComponentBottomMove);
        this.componentDockBottomActionIndex = this.ComponentDockBottom.onMove.length - 1;
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
        this.setHeading();
    }

    private _onClick(ev : InteractionEvent) {

        const pos = ev.data.global;
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

    private _onMouseMove(ev : PointerEvent) {
        this.graphic.clear();
        let pos = this.stage.toLocal(new PIXI.Point(ev.x, ev.y));
        let x = pos.x;
        let y = pos.y;

        let dX = x - this.start.x;
        let dY = y - this.start.y;

        if (this.lockedToMouseX) {
            this.length = x - this.start.x;
        }

        if (this.lockedToMouseY) {
            this.length = y - this.start.y -25;
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
        if (this.color === wireState.High) {
            this.graphic.filters = [new GlowFilter({distance : 20, outerStrength: 2, color : this.color})]
        } else {
            this.graphic.filters = [];
        }
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
            if (this.isVertical) {
                if (delta < 0) {
                    addWire.heading = Heading.West;
                } else {
                    addWire.heading = Heading.East;
                }
            }

            //addWire.padSegment();

            let componentDockBottomPtr = this.ComponentDockBottom;
            this.undockComponentBottom();
            addWire.addComponentDockBottom(componentDockBottomPtr);
            addWire.top = this;
            this.bottom = addWire;
            this.onCreateNewSegment(addWire);
            if (this.isVertical) {
                if (this.heading == Heading.South) {
                    addWire.incrementStartY(-3.5);
                }
            }
        }

        if (this.ComponentDockTop != null) {
            let addWire = new WireSegment(!this.isVertical, 
                this.getEndPoint(), 0, this.stage, this.onCreateNewSegment);

            if (this.isVertical) {
                if (delta < 0) {
                    addWire.heading = Heading.West;
                } else {
                    addWire.heading = Heading.East;
                }
            }

            let componentDockBottomPtr = this.ComponentDockTop;
            this.undockComponentTop();
            addWire.addComponentDockTop(componentDockBottomPtr);
            addWire.bottom = this;
            this.top = addWire;
            this.onCreateNewSegment(addWire);
            if (this.isVertical) {
                if (this.heading == Heading.South) {
                    addWire.incrementStartY(-3.5);
                }
            }
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

    padSegment() {
        switch (this.heading) {
            case (Heading.South):
                this.length += 6;
                break;
            case (Heading.North):
                this.length -= 7;
                break;
            case (Heading.West):
                this.length -= 6;
                break;
            case (Heading.East):
                this.length -= 6;
        }
    }

}