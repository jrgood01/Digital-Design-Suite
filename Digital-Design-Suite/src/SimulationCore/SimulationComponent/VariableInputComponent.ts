//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import { SimulationComponent } from "./SimulationComponent";
import { WiringArea } from "../DynamicWiring/WiringArea"
import * as PIXI from "pixi.js"
import { SimulationAddGraphicEvent } from "../SimulationEvents/SimulationAddGraphicEvent";
import { Heading } from "../../Heading";

export abstract class VariableInputComponent extends SimulationComponent {
    numInputs : number;
    componentHeight : number;

    private inputTotalSpacing : number;
    private inputAreaPadding : number;
    private inputAreaStartY : number;

    private quadraticIntensity : number;
    private followsQuadratic : boolean;

    constructor(x : number, y : number, container : PIXI.Container,
                inputLines : number, outputLines : number,
                inputBitWidths : number[], outputBitWidths : number[],
                componentHeight : number) {
        super(x, y, container, inputLines, outputLines, inputBitWidths, outputBitWidths);
        
        this.drawInputAreas = this.drawInputAreas.bind(this);

        this.componentHeight = componentHeight;
        this.numInputs = inputLines;

        this.inputTotalSpacing = 0;
        this.inputAreaPadding = 0;
        this.inputAreaStartY = 0;

        this.onMove.push((dx : number, dY : number) => {this.calculateInputAreaCoordinates()})
        this.calculateInputAreaCoordinates();

        this.followsQuadratic = false;
    }

    setNumInputs(numInputs : number) {
        this.numInputs = numInputs;
    }

    calculateInputAreaCoordinates() {
        this.inputTotalSpacing = (this.numInputs - 1) * 30 + 4*7;
        this.inputAreaPadding = (this.componentHeight - this.inputTotalSpacing) / 2;
        this.inputAreaStartY = (this.y + this.inputAreaPadding);

        this.wiringAreas.get(true).forEach((wiringArea : WiringArea, key : number) => {
            this.onGraphicRemove(new SimulationAddGraphicEvent(wiringArea.getGraphic()));
        })

        this.wiringAreas.set(true, new Map<number, WiringArea>());

        for (let i = 0; i < this.numInputs; i ++) {
            let yPoint = this.inputAreaStartY + i * 50 - 3.5;
            if (this.grid)
                yPoint = this.grid.snapToGrid(new PIXI.Point(0, this.inputAreaStartY + i * 50 - 3.5)).y;
            this.addWiringArea(this.x - 61, yPoint, i, true, Heading.West)
        }
    }

    calculateQuadraticPoint(x : number, y : number) {

    }

    followQuadratic(intensity : number) {
        this.quadraticIntensity = intensity;
        this.followsQuadratic = true;
    }

    /**
     * Snaps a point to a 3 point bezier curve
     * @param x x point
     * @param y y poiny
     */
    getPointOnQuadratic(x : number, y : number) {
        const calc = (p_0 : number, p_1 : number, p_2 : number, t : number) =>
            {
                const coeff_0 = (1 - t) ** 2;
                const coeff_1 = 2 * t * (1 - t);
                const coeff_2 = t ** 2;

                return coeff_0 * p_0
                    + coeff_1 * p_1
                    + coeff_2 * p_2;
            };

        const t = (y - this.y) / this.componentHeight;

        const p_0_x = this.x;
        const p_0_y = this.y;

        const p_1_x = this.x + this.quadraticIntensity;
        const p_1_y = this.y + this.componentHeight / 2;

        const p_2_x = this.x;
        const p_2_y = this.y + this.componentHeight;

        const retX = calc(p_0_x, p_1_x, p_2_x, t);
        const retY = calc(p_0_y, p_1_y, p_2_y, t);

        return new PIXI.Point(retX, retY);
    }

    drawInputAreas(inputIsWire : boolean) {
        for (let i = 0; i < this.numInputs; i ++) {
            let yPoint = this.inputAreaStartY + i * 50 - 3.5;
            let xPoint = this.x;
            if (this.grid)
                yPoint = this.grid.snapToGrid(new PIXI.Point(0, this.inputAreaStartY + i * 50 - 3.5)).y;
            if (this.followsQuadratic)
                xPoint = this.getPointOnQuadratic(this.x, yPoint).x;
            this.componentTemplate.lineStyle(7, this.getInputLineBit(i, 0))
            .moveTo(this.x - 61, yPoint)
            .lineTo(xPoint, yPoint);
        }
    }

}