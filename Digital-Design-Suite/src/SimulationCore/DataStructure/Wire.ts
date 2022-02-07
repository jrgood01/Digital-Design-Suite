//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import * as PIXI from "pixi.js";
import { wireState } from "../WireStates";
import { ComponentConnection } from "./ComponentConnection";
import { Point, Rectangle } from "pixi.js";
import * as Constants from "../../constants"
import e from "express";
import { GlowFilter } from '@pixi/filter-glow';
import {WireSegment} from "./WireSegment"
import { SimulationComponent } from "../SimulationComponent/SimulationComponent";

export class Wire {
    graphic : PIXI.Graphics;

    private visited : boolean;
    private lastState : boolean;

    private segments : Array<WireSegment>
    private state : Array<wireState>

    private inputs : Array<ComponentConnection>;
    private outputs : Array<ComponentConnection>;
    private error : boolean;
    private bitWidth : number;
    private isPlacing : boolean;
    private stage : PIXI.Container;

    /**
     * Create new wire
     * @param startX wire startX
     * @param startY wire endX
     */
    constructor(startX : number, startY : number, dockComponent : SimulationComponent, stage : PIXI.Container) {
        console.log(stage);
        
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onCreateSegment = this.onCreateSegment.bind(this);

        this.graphic = new PIXI.Graphics();
        this.graphic.interactive = true;
        
        this.segments = new Array<WireSegment>();

        this.inputs = new Array<ComponentConnection>();
        this.outputs = new Array<ComponentConnection>();

        this.state = new Array<wireState>();
        this.stage = stage;

        this.isPlacing = false;
        
        startY += 3.5; 
        startX += 3.5;
        let addWire = new WireSegment(false, new PIXI.Point(startX, startY), 0, stage, this.onCreateSegment);
        addWire.ComponentDockBottom = dockComponent;
        this.segments.push(addWire);

        this.error = false;

        stage.on("pointermove", this.onMouseMove);
    }

    beginPlace() {   
        if (this.segments.length == 1) {
            this.addSegmentTop(0);
        } else {
            this.addSegmentTop(0);
            this.addSegmentTop(0);
        }
        this.isPlacing = true;
    }

    endPlace() {
        let segmentOne = this.segments[this.segments.length - 2];
        let segmentTwo = this.segments[this.segments.length - 1];

        segmentOne.unlockMouse();
        segmentTwo.unlockMouse();

        this.isPlacing = false;
    }

    addSegmentTop(length : number) {
        let lastSegment = this.segments[this.segments.length - 1];
        let lastSegmentEndPoint = lastSegment.getEndPoint();
        let addSegment = new WireSegment(lastSegment.isVertical, lastSegmentEndPoint, 0, 
            this.stage, this.onCreateSegment);
        lastSegment.top = addSegment;
        addSegment.bottom = lastSegment
        this.segments.push(addSegment);
    }


    addInput(input : ComponentConnection) {
        this.bitWidth = input.component.output.getLineBitWidth(input.componentLineNumber);
        this.inputs.push(input);
    }

    getComponentColor() {
        if (this.error) {
            return wireState.Error;
        }

        if (this.bitWidth > 1) {
            return Constants.General.componentMultiBit;
        }

        if (this.inputs.length > 0) {
            return this.inputs[0].component.output.getLineBit(this.inputs[0].componentLineNumber,0)
        } else {
            return wireState.Float;
        }
    } 

    onMouseMove(ev : any) : any {
        let pos = ev.data.global;
        if (this.isPlacing) {
            this.anchorToPoint(pos.x, pos.y, true);
        }
    }

    anchorToPoint(x : number, y : number, lockMouseOnAnchor : boolean = false, smartAnchor : boolean = false) {
        let segmentOne = this.segments[this.segments.length - 2]
        let segmentTwo = this.segments[this.segments.length - 1]
        let anchor = segmentOne.start;

        let dX = x - anchor.x;
        let dY = y - anchor.y;
        let anchorType = Math.abs(dY) > Math.abs(dX);

        let newEnd = new PIXI.Point(segmentOne.getEndPoint().x,segmentOne.getEndPoint().y) ;
        if (dY > 0 && anchorType) {
            newEnd.y -= 7;
        } 

        if (dX > 0 && !anchorType) {
            newEnd.x -= 7;
        } 

        if (smartAnchor) {
            if (dX > 0) {
                dX += 8;
            }
        }

        if (anchorType) {
            segmentTwo.length = dY;
            segmentTwo.isVertical = true;

            segmentOne.length = dX;
            segmentOne.isVertical = false;

            if (lockMouseOnAnchor) {
                segmentTwo.lockToMouseY();
                segmentOne.lockToMouseX();
            }

        } else {
            segmentTwo.length = dX;
            segmentTwo.isVertical = false;

            segmentOne.length = dY ;
            segmentOne.isVertical = true;

            if (lockMouseOnAnchor) {
                segmentTwo.lockToMouseX();
                segmentOne.lockToMouseY();
            }
        }

        segmentTwo.start = newEnd;
    }

    onCreateSegment(created : WireSegment) {
        this.segments.push(created);
    }
    draw() {
        this.graphic.clear();
        this.segments.forEach((segment : WireSegment) => {
            segment.Draw();
        })
    }


}