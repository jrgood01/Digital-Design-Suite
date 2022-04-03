//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022


import {WireSegmentJointMode} from "./WireSegmentJointMode";
import {WireSegment} from "./WireSegment";

import * as PIXI from "pixi.js";
import {Heading} from "../../Heading";

export class WireSegmentJointController {
    private stage : PIXI.Container;
    private mode : WireSegmentJointMode;

    private activeSegment : WireSegment;

    private onWireSegmentAdd : (addSegment : WireSegment) => void;
    private onWireSegmentDelete : (deleteSegment : WireSegment) => void;

    constructor(stage : PIXI.Container, addSegmentHandler : (addWireSegmentHandler : WireSegment) => void,
                deleteWireSegmentHandler : (deleteSegment : WireSegment) => void) {
        this.mode = WireSegmentJointMode.NONE;
        this.activeSegment = null;
        this.stage = stage;
        this.onWireSegmentAdd = addSegmentHandler;
        this.onWireSegmentDelete = deleteWireSegmentHandler;
    }

    /**
     * Anchor wire segments to specified point
     * @param anchorPoint
     */
    anchorTo(anchorPoint : PIXI.Point) {

        if (this._isInAddMode()) {
            const activeStart = this.activeSegment.getStart();
            const top = this.activeSegment.getTop();
            const dX = anchorPoint.x - activeStart.x;
            const dY = anchorPoint.y - activeStart.y;
            switch(this.mode) {
                case(WireSegmentJointMode.HVADD):
                    this.activeSegment.setLength(dX);
                    top.setLength(dY);
                    this._alignTopSegmentToActive();
                    break;
                case (WireSegmentJointMode.VHADD):
                    this.activeSegment.setLength(dY);
                    top.setLength(dX);
                    this._alignTopSegmentToActive();
                    break;
                case (WireSegmentJointMode.VADD):
                    this.activeSegment.setLength(dY);
                    break;
                case (WireSegmentJointMode.HADD):
                    this.activeSegment.setLength(dX);
                    break;
            }
            this.setPadding();
            if (this.mode == WireSegmentJointMode.HVADD || this.mode == WireSegmentJointMode.VHADD)
                this._alignTopSegmentToActive();
        } else {
            console.error("WireSegmentJointController: Error: you can only call anchorTo() when the controller is " +
                "already in an add control mode")
        }
    }

    /**
     * Add two new segments to the wire
     * @param start start point of the wires (usually taken from origin wiring area)
     * @param startMode initial joint mode of the wires
     */
    addSegments(start : PIXI.Point, startMode : WireSegmentJointMode) {
        this.activeSegment = new WireSegment(false, start, 0)
        this.onWireSegmentAdd(this.activeSegment);

        if (this.mode == WireSegmentJointMode.VHADD || WireSegmentJointMode.HVADD) {
            const activeSegmentTop = new WireSegment(true, start, 0);
            this.onWireSegmentAdd(activeSegmentTop);
            this.activeSegment.setTop(activeSegmentTop);
        }

        this.mode = startMode;
    }

    modifySegment(segment : WireSegment) {
        this.mode = WireSegmentJointMode.MODIFY;
        this.activeSegment = segment;
    }

    /**
     * End control of the segments
     */
    endControl() {
        this.activeSegment = null;
        this.mode = WireSegmentJointMode.NONE;
    }

    setPadding() {
        if (this.mode == WireSegmentJointMode.VHADD || this.mode == WireSegmentJointMode.VADD) {
            if (this.activeSegment.getHeading() == Heading.North) {
                this.activeSegment.padY(-10)
            }

            if (this.activeSegment.getHeading() == Heading.East) {
                this.activeSegment.padX(-10);
            }
        }
    }

    /**
     * Set the mode of the controller
     * @param newMode new mode to set
     */
    setMode(newMode : WireSegmentJointMode) {
        if (this._isInAddMode()) {
            if (this.mode == newMode) {
                return
            }

            if ((this.mode == WireSegmentJointMode.HVADD && newMode == WireSegmentJointMode.VHADD) ||
                (this.mode == WireSegmentJointMode.VHADD && newMode == WireSegmentJointMode.HVADD)) {
                const activeLen = this.activeSegment.getLength();
                const topLen = this.activeSegment.getTop().getLength()

                this.activeSegment.getTop().setStart(this.activeSegment.getEnd());

                this.activeSegment.setLength(topLen);
                this.activeSegment.getTop().setLength(activeLen);

                this.activeSegment.invert();
                this.activeSegment.getTop().invert();
            }

            if ((this.mode == WireSegmentJointMode.HVADD && newMode == WireSegmentJointMode.HADD) ||
                (this.mode == WireSegmentJointMode.VHADD && newMode == WireSegmentJointMode.VADD)) {

                const top = this.activeSegment.getTop();

                this.onWireSegmentDelete(top);
                this.activeSegment.removeTop();
            }

            if ((this.mode == WireSegmentJointMode.HADD && newMode == WireSegmentJointMode.VADD) ||
                (this.mode == WireSegmentJointMode.VADD && newMode == WireSegmentJointMode.HADD)) {
                const top = this.activeSegment.getTop();
                this.activeSegment.setLength(top.getLength());

                this.onWireSegmentDelete(top);

                this.activeSegment.removeTop();
                this.activeSegment.invert();
            }

            if ((this.mode == WireSegmentJointMode.VADD && newMode == WireSegmentJointMode.HVADD) ||
                (this.mode == WireSegmentJointMode.HADD && newMode == WireSegmentJointMode.VHADD)) {
                const addSegment = new WireSegment(this.activeSegment.getIsVertical(), this.activeSegment.getEnd(),
                    0);
                this.activeSegment.invert();
                this.onWireSegmentAdd(addSegment);
                this.activeSegment.setTop(addSegment);
            }

            if ((this.mode == WireSegmentJointMode.VADD && newMode == WireSegmentJointMode.VHADD) ||
                (this.mode == WireSegmentJointMode.HADD && newMode == WireSegmentJointMode.HVADD)) {
                const addSegment = new WireSegment(!this.activeSegment.getIsVertical(), this.activeSegment.getEnd(),
                    0);
                this.onWireSegmentAdd(addSegment);
                this.activeSegment.setTop(addSegment);
            }

            this.mode = newMode;

        } else {
            console.error("WireSegmentJointController: error: You can only call setMode() when the controller is " +
                "already in an add mode")
        }

    }

    getMode() {
        return this.mode;
    }

    getWireEnd() {
        if (this._isInAddMode()) {
            if (this._isInSingleSegmentControlMode()) {
                return this.activeSegment.getEnd();
            } else {
                return this.activeSegment.getTop().getEnd();
            }
        }
    }

    getDistToOrigin(point : PIXI.Point) {
        const dist = this.getDistToOriginVector(point);
        return Math.sqrt(dist.x ** 2 +
            dist.y ** 2)
    }

    getDistToOriginVector(point : PIXI.Point) {
        return new PIXI.Point(Math.abs(point.x - this.activeSegment.getStart().x),
            Math.abs(point.y - this.activeSegment.getStart().y))
    }
    /**
     * Returns a boolean representing if the object is control the addition of new segments
     * @private
     */
    private _isInAddMode() {
        return this.mode != WireSegmentJointMode.NONE &&
            this.mode != WireSegmentJointMode.MODIFY
    }

    /**
     * Returns a boolean representing if the object is controlling the addition of two segments
     * @private
     */
    private _isInSingleSegmentControlMode() {
        return this.mode == WireSegmentJointMode.VADD 
            || this.mode == WireSegmentJointMode.HADD
    }
    /**
     * Align the top segment to the active segment
     * @private
     */
    private _alignTopSegmentToActive() {
        const bottomEnd = this.activeSegment.getEnd();
        const bottomEndCpy = new PIXI.Point(bottomEnd.x, bottomEnd.y)
        const top = this.activeSegment.getTop();
        if (this.activeSegment.getIsVertical()) {
            bottomEndCpy.y += this.activeSegment.getLength() < 0 ? 7 : 0;
        } else {
            if (this.activeSegment.getLength() > 0) {
                bottomEndCpy.y += -10;
            } else {
                if (this.activeSegment.getTop().getLength() > 0) {
                    bottomEndCpy.y += -17;
                } else {
                    bottomEndCpy.y += -10;
                }
            }
        }
        top.setStart(bottomEndCpy);

    }

    /**
     * Align the bottom segment to the active segment
     * @private
     */
    private _alignBottomSegmentToActive() {
        const activeStart = this.activeSegment.getStart();
        const bottom = this.activeSegment.getBottom();
        bottom.setEnd(activeStart);
    }

    /**
     * ALign the top and bottom segment to the active segment
     * @private
     */
    private _alignAllSegments() {
        if (this.mode != WireSegmentJointMode.NONE) {
            if (this.activeSegment.getBottom() != null) {
                this._alignBottomSegmentToActive();
            }

            if (this.activeSegment.getTop() != null) {
                this._alignTopSegmentToActive();
            }
        }
    }
}