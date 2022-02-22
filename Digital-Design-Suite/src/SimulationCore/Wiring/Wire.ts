//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
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
import { Heading } from "../../Heading";
import {SimulationGrid} from "../SimulationGrid";

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
    private grid : SimulationGrid;
    /**
     * Create new wire
     * @param startX wire startX
     * @param startY wire endX
     */
    constructor(startX : number, startY : number, dockComponent : SimulationComponent, stage : PIXI.Container) {
 

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
        addWire.addComponentDockBottom(dockComponent);
        this.segments.push(addWire);

        this.error = false;
        this.grid = null;

        stage.on("pointermove", this.onMouseMove);
    }

    setGrid(grid : SimulationGrid) {
        this.grid = grid;
        this.segments.forEach((s : WireSegment) => {
            s.setGrid(grid);
        })
    }

    AllInputsVisited () {
        this.inputs.forEach((c : ComponentConnection) => {
            if (!c.component.visited) {
                return false;
            }
        });

        return true;
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
        let addSegment = new WireSegment(lastSegment.getIsVertical(), lastSegmentEndPoint, 0,
            this.stage, this.onCreateSegment);
        lastSegment.top = addSegment;
        addSegment.bottom = lastSegment
        addSegment.setGrid(this.grid);
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
        let anchor = segmentOne.getStartPoint();
        if (this.grid) {
            let gridPoint = this.grid.snapToGrid(new Point(x, y));
            x = gridPoint.x;
            y = gridPoint.y;
        }
        let dX = x - anchor.x;
        let dY = y - anchor.y;
        let anchorType = Math.abs(dX) > Math.abs(dY);
        if (anchorType) {
            
            segmentTwo.setLength(dY);
            segmentTwo.setIsVertical(true);

            segmentOne.setLength(dX);
            segmentOne.setIsVertical(false);
            segmentTwo.setStartPoint(segmentOne.getEndPoint());
           
            if (segmentTwo.getLength() > 0) {
                segmentTwo.incrementStartY(-10);
            } else {
                segmentTwo.incrementStartY(-3.5);
            }
            if (lockMouseOnAnchor) {
                segmentTwo.lockToMouseY();
                segmentOne.lockToMouseX();
            }

        } else {
           
            segmentTwo.setLength(dX);
            segmentTwo.setIsVertical(false);

            segmentOne.setLength(dY);
            segmentOne.setIsVertical(true);
            segmentTwo.setStartPoint(segmentOne.getEndPoint());
            if (lockMouseOnAnchor) {
                segmentTwo.lockToMouseX();
                segmentOne.lockToMouseY();
            }

            if (segmentTwo.getLength() > 0) {
                segmentTwo.incrementStartX(-10);
            } else {
                segmentTwo.incrementStartX(-3);
            }
            segmentTwo.padSegment();
        }
        segmentTwo.padSegment();
       // segmentTwo.start = segmentOne.getEndPoint();

    }


    onCreateSegment(created : WireSegment) {
        this.segments.push(created);
    }

    connectComponentToTop(component : SimulationComponent) {
        this.segments[this.segments.length - 1].addComponentDockTop(component);
    }

    setColor(color : number) {
        this.segments.forEach((segment : WireSegment) => {
            segment.color = color;
        });
    }

    getState() {
        return this.state;
    }

    simulate() {
        let s1 = this.inputs[0];
        let line = s1.component.getOutputLine(s1.componentLineNumber);
        let hasError = false;
        this.state = line;
        this.inputs.forEach((componentConnection : ComponentConnection) => {
            let line_cmp = componentConnection.component.getOutputLine(componentConnection.componentLineNumber);
                line.forEach((state : wireState, index : number) => {
                    if (state != line_cmp[index]) {
                        this.state[index] = wireState.Error;
                        hasError = true;
                    }
                });
        });
  
        if (hasError) {
            this.setColor(wireState.Error);
            return;
        }

        if (this.bitWidth > 1) {
            this.setColor(Constants.General.componentMultiBit)
            return;
        }

        if (this.inputs.length == 0) {
            this.setColor(wireState.Float);
            return;
        }


        let state = line[0];
        this.setColor(state);
        

    }

    draw() {
        this.graphic.clear();
        this.segments.forEach((segment : WireSegment) => {
            segment.Draw();
        })
    }


}