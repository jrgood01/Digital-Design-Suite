//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import * as PIXI from "pixi.js";
import { wireState } from "../WireStates";
import { ComponentConnection } from "./ComponentConnection";
import { Renderable
 } from "../Renderable";
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

    /**
     * Create new wire
     * @param startX wire startX
     * @param startY wire endX
     */
    constructor(startX : number, startY : number, dockComponent : SimulationComponent) {
        this.graphic = new PIXI.Graphics();
        this.graphic.interactive = true;
        
        this.segments = new Array<WireSegment>();

        this.inputs = new Array<ComponentConnection>();
        this.outputs = new Array<ComponentConnection>();

        this.state = new Array<wireState>();
        
        startY += 3.5; 
        startX += 3.5;

        this.segments.push(new WireSegment(false, new PIXI.Point(startX, startY), 0));

        this.error = false;
    }

    /**
     * Add a segment
     * @param x x position of end of segment
     * @param y y position of end of segment
     */
    addSegment(x : number, y : number) {
        //If the last segment isn't a dummy segment 
        
    }

    /**
     * Adds a non-usable segment. This prevents the addition
     *  of additonal segments until the dummy segment is removed
     *  or modified
     */
    addDummySegment() {
        if (this.geometry[this.segments - 1].x != -10000000 && this.geometry[this.segments - 1].y != -10000000) {
            this.geometry.push(new PIXI.Point(-10000000, -10000000));
            this.segments ++;
        }
    }

    /**
     * Sets position of the last segment
     * @param x Segment new X position
     * @param y Segment new Y position
     */
    positionLastSegment(x : number, y : number) {
        this.geometry[this.segments - 1].x = x;
        this.geometry[this.segments - 1].y = y;
    }

    translateFirstSegment(dx : number, dy : number) {
        this.geometry[0].x += dx;
        this.geometry[0].y += dy;
    }

    translateLastSegment(dx : number, dy : number) {
        this.geometry[this.segments - 1].x += dx;
        this.geometry[this.segments - 1].y += dy;
    }

    addInput(input : ComponentConnection) {
        this.bitWidth = input.component.output.getLineBitWidth(input.componentLineNumber);
        this.inputs.push(input);
        console.log(this);
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

    draw() {
        this.graphic.clear();


        let lineColor = this.getComponentColor();

        if (this.segments > 0) {
            this.graphic.hitArea = new Rectangle(
                this.geometry[this.segments - 1].x - 10, this.geometry[this.segments - 1].y - 10, 20, 20);
        }

        let i = 1;
        while (i < this.geometry.length) {
            if (this.geometry[i].x == -100000) {
                i += 1;
                continue;
            }

            let offsetX = 0;
            let offsetY = 0;

            if (this.geometry[i - 1].x > this.geometry[i].x) {
                offsetX = -3.5
            } else if (this.geometry[i - 1].x < this.geometry[i].x) {
                offsetX = 3.5
            }

            if (this.geometry[i - 1].y > this.geometry[i].y) {
                offsetY = -3.5
            } else if (this.geometry[i - 1].y < this.geometry[i].y) {
                offsetY = 3.5
            }
            this.graphic.lineStyle(7, lineColor)
                .moveTo(this.geometry[i - 1].x, this.geometry[i - 1].y - offsetY)
                .lineTo(this.geometry[i - 1].x, this.geometry[i].y);

            this.graphic.lineStyle(7, lineColor)
                .moveTo(this.geometry[i - 1].x - offsetX, this.geometry[i].y)
                .lineTo(this.geometry[i].x, this.geometry[i].y);
            this.graphic.filters =  [new GlowFilter({distance : 20, outerStrength: 2, color : 0x3333FF})]
            i ++;
        }
    }


}