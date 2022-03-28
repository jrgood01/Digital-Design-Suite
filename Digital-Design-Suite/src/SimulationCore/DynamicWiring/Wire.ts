//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022
import * as PIXI from "pixi.js";
import {wireState} from "../WireStates";
import {ComponentConnection} from "./ComponentConnection";
import {WireSegment} from "./WireSegment"
import {SimulationComponent} from "../SimulationComponent/SimulationComponent";
import {SimulationGrid} from "../SimulationGrid";
import {WireWiringArea} from "./WireWiringArea";
import {WireSegmentJointController} from "./WireSegmentJointController";
import {WireSegmentJointMode} from "./WireSegmentJointMode";
import {Heading} from "../../Heading";

export class Wire {
    graphic : PIXI.Graphics;

    private segments : Array<WireSegment>
    private state : Array<wireState>

    private inputs : Array<ComponentConnection>;
    private outputs : Array<ComponentConnection>;
    private error : boolean;
    private bitWidth : number;
    private isPlacing : boolean;
    private stage : PIXI.Container;
    private grid : SimulationGrid;
    private wiringArea : WireWiringArea;
    private isExtending : boolean;
    private segmentController : WireSegmentJointController;

    /**
     * Create new wire
     */
    constructor(dockComponent : SimulationComponent, stage : PIXI.Container) {
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onCreateSegment = this.onCreateSegment.bind(this);
        this.onDeleteSegment = this.onDeleteSegment.bind(this);

        this.graphic = new PIXI.Graphics();
        this.graphic.interactive = true;
        
        this.segments = new Array<WireSegment>();

        this.inputs = new Array<ComponentConnection>();
        this.outputs = new Array<ComponentConnection>();

        this.state = new Array<wireState>();
        this.stage = stage;

        this.isPlacing = false;

        this.error = false;
        this.grid = null;
        this.isExtending = false;

        this.segmentController = new WireSegmentJointController(this.stage, this.onCreateSegment,
            this.onDeleteSegment);
        document.addEventListener("mousemove", this.onMouseMove);

    }

    /**
     * Create the wiring area to extend wire
     */
    generateWiringArea() {
        this.wiringArea = new WireWiringArea(0, 0, this.stage, this);
        this.stage.addChild(this.wiringArea.getGraphic());
        return this.wiringArea;
    }

    removeWiringArea() {
        if (this.wiringArea)
            this.wiringArea.unRegister();
        this.wiringArea = null;
    }

    /**
     * Determines if all the inputs to the wire have been updated by the simulation
     * Algorithm
     * @constructor
     */
    AllInputsVisited () {
        this.inputs.forEach((c : ComponentConnection) => {
            if (!c.getComponentVisited()) {
                return false;
            }
        });

        return true;
    }

    beginPlace(startPoint : PIXI.Point) {
        this.segmentController.addSegments(startPoint, WireSegmentJointMode.HVADD);
        this.wiringArea.setIsEnabled(false);
        this.isPlacing = true;
    }

    endPlace(endPoint : PIXI.Point = null) {
        if (endPoint) {
            this.segmentController.anchorTo(endPoint);
        }
        this.segmentController.endControl();
        this.isPlacing = false;
        this.setHitArea();
    }

    setHitArea() {
        if (!this.wiringArea)
            return;

        const endPoint = this.getLastSegment().getEnd();

        switch(this.getLastSegment().getHeading()) {
            case Heading.North:
                endPoint.y += 7;
                break;
            case Heading.South:
                endPoint.y -= 7;
                break;
            case Heading.East:
                endPoint.x -= 7;
                break;
            case Heading.West:
                endPoint.x += 7;
                break;

        }
        this.wiringArea.setXY(endPoint.x, endPoint.y)
        this.wiringArea.setOffset(this.getLastSegment().getHeading())
    }



    addInput(input : ComponentConnection) {
        this.bitWidth = input.getLineBitWidth();
        this.inputs.push(input);
    }

    onMouseMove(ev : PointerEvent) {
        if (this.isPlacing) {
            const pos = this.stage.toLocal(new PIXI.Point(ev.x, ev.y));

            const distVector = this.segmentController.getDistToOriginVector(pos);
            console.log(this.segmentController.getDistToOrigin(pos))
            if (this.segmentController.getDistToOrigin(pos) < 300) {
                if (distVector.x > distVector.y) {
                    this.segmentController.setMode(WireSegmentJointMode.HVADD);
                } else {
                    this.segmentController.setMode(WireSegmentJointMode.VHADD);
                }
            }

            if (distVector.y < 20 && this.segmentController.getMode() == WireSegmentJointMode.HVADD)
                this.segmentController.setMode(WireSegmentJointMode.HADD);

            if (distVector.x < 20 && this.segmentController.getMode() == WireSegmentJointMode.VHADD)
                this.segmentController.setMode(WireSegmentJointMode.VADD);

            if (distVector.y > 20 && this.segmentController.getMode() == WireSegmentJointMode.HADD)
                this.segmentController.setMode(WireSegmentJointMode.HVADD);

            if (distVector.x > 20 && this.segmentController.getMode() == WireSegmentJointMode.VADD)
                this.segmentController.setMode(WireSegmentJointMode.VHADD);

            console.log("Control set to: ",this.segmentController.getMode())
            this.segmentController.anchorTo(pos);
        }
    }


    onCreateSegment(created : WireSegment) {
        this.segments.push(created);
        console.log("segment created")
        this.stage.addChild(created.getGraphic())
    }

    onDeleteSegment(deleteSegment : WireSegment) {
        this.stage.removeChild(deleteSegment.getGraphic())
        const delIdx = this.segments.indexOf(deleteSegment);
        this.segments.splice(delIdx, 1);
    }

    setColors(colors : Array<number>) {
        this.segments.forEach((segment : WireSegment) => {
            segment.setColorArr(colors);
        });
    }

    getState() {
        return this.state;
    }

    /**
     * Checks to ensure that there are no short circuits on an input bit
     * If there is a short circuit, wireState.Error is returned
     * @param bit
     */
    validateBit(checkBit : number) {
        let retBit = -1;
        this.inputs.forEach((connection : ComponentConnection) => {
            const bit = connection.getLineBit(checkBit);
            if (retBit != -1) {
                //Checks for short circuit.
                if (bit != retBit) {
                    retBit = wireState.Error;
                }
            } else {
                //If no input checked, set add bit to input bit
                retBit = bit;
            }
        })

        return retBit;
    }

    simulate() {
        const finalWireState = new Array<number>();
        for (let i = 0; i < this.bitWidth; i ++) {
            finalWireState.push(this.validateBit(i));
        }
        this.setColors(finalWireState)
        this.state = finalWireState;
    }

    getHeadingLastSegment() {
        const lastWire = this.segments[this.segments.length - 1];
        return lastWire.getHeading();
    }

    draw() {
        this.graphic.clear();
        this.segments.forEach((segment : WireSegment) => {
            segment.draw();
        })
    }

    getWiringArea() {
        return this.wiringArea;
    }

    getLastSegment() {
        return this.segments[this.segments.length - 1];
    }

    connectComponentToTop(component : SimulationComponent) {
        this.segments[this.segments.length - 1].addComponentDockTop(component);
    }

    anchorTo(point : PIXI.Point) {
        this.segmentController.anchorTo(point);
    }
}