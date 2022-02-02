//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {SimulationComponentIO} from "./SimulationComponentIO"
import { SimulationState } from '../SimulationState';
import { wireState } from "../WireStates";
import * as PIXI from 'pixi.js'
import {WiringArea} from "./WiringArea"
import { GlowFilter } from '@pixi/filter-glow';
import { Moveable } from "../Moveable";

/**
 * Represents a simulated digital component
 * Extend this class to create usable components
 */
export abstract class SimulationComponent implements Moveable{
    componentId : string;
    simulationState : SimulationState;

    input : SimulationComponentIO;
    output : SimulationComponentIO;

    deleted : boolean;

    x : number;
    y : number;

    selected : boolean;

    componentTemplate : PIXI.Graphics;

    wiringAreas : Map<boolean, Map<Number, WiringArea>>;

    geometry : Record <string, number>;

    activeWiringArea : WiringArea;
    glowOn : boolean;
    constructor(inputLines : number, outputLines : number, inputBitWidths : Array<number>, outputBitWidths : Array<number>, stage? : PIXI.Container) {
        this.input = new SimulationComponentIO(inputLines, inputBitWidths);
        this.output = new SimulationComponentIO(outputLines, outputBitWidths);

        this.deleted = false;
        this.componentTemplate = new PIXI.Graphics();
        this.componentTemplate.interactive = true;
        this.componentTemplate.cursor = "pointer"
        this.selected = false;

        this.wiringAreas = new Map<boolean, Map<Number, WiringArea>>();
        this.wiringAreas.set(false, new Map<Number, WiringArea>());
        this.wiringAreas.set(true, new Map<Number, WiringArea>());

        stage.addChild(this.componentTemplate);
        this.geometry = this.calculateGeometry(1);
        this.activeWiringArea = null;
        this.glowOn = false;
        //this.componentTemplate.filters = [new GlowFilter({distance : 20, outerStrength: 2, color : 0x3333FF})]
    }


    abstract simulate(): void;
    abstract draw() : void;
    calculateGeometry(scaler : number) {return {"a" : 1} as Record<string, number>}
    
    /**
     * Simulates the values of the component and passes to outputs
     */
    simulateAndPass() {
        this.simulate();
        this.passOutputs();
    }
    
    setGlow(on : boolean) {
        if (on) {
            this.componentTemplate.filters = [new GlowFilter({distance : 20, outerStrength: 2, color : 0x3333FF})]
        } else {
            this.componentTemplate.filters = [];
        }
    }
    addInputLine(bitWidth : number) {
        this.input.addLine(bitWidth);
    }

    deleteLine(lineNumber : number) {
        this.input.removeLine(lineNumber);
    }

    addOutputLine(bitWidth : number) {
        this.output.addLine(bitWidth);
    }

    deleteOutputLine(lineNumber : number) {
        this.output.removeLine(lineNumber);
    }

    changeInputBitWidth(lineNumber : number, newBitWidth : number) {
        this.input.changeBitSize(lineNumber, newBitWidth);
    }

    changeOutputBitWidth(lineNumber : number, newBitWidth : number) {
        this.output.changeBitSize(lineNumber, newBitWidth);
    }

    getInputLine(lineNumber : number) {
        return this.input.getLineValue(lineNumber);
    }

    getOutputLine(lineNumber : number) {
        return this.output.getLineValue(lineNumber);
    }

    getInputLineBit(lineNumber : number, bitNumber : number) {
        return this.input.getLineBit(lineNumber, bitNumber);
    }

    getOutputLineBit(lineNumber : number, bitNumber : number) {
        return this.output.getLineBit(lineNumber, bitNumber);
    }

    setInputLine(lineNumber : number, value : Array<wireState>) {
        this.input.setLineValue(lineNumber, value);
    }

    translate (x : number, y : number) {
        this.x += x;
        this.y += y;
        this.geometry = this.calculateGeometry(1);
 
        this.wiringAreas.forEach((value : Map<Number, WiringArea>) => {
            value.forEach((wiringArea : WiringArea) => {
                wiringArea.graphic.x += x;
                wiringArea.graphic.y += y;
                wiringArea.x += x;
                wiringArea.y += y;
            });
        });      
    }

    updateHitArea() {
        this.componentTemplate.hitArea = new PIXI.Rectangle(
            this.componentTemplate.getBounds().x, this.componentTemplate.getBounds().y,
            this.componentTemplate.getBounds().width,
            this.componentTemplate.getBounds().height + 50)
    }

    addWiringArea(x : number, y : number, lineNumber : number, isInput : boolean) {
        let wiringAreaGraphic = new PIXI.Graphics();

        wiringAreaGraphic.interactive = true;
        wiringAreaGraphic.alpha = 0;
        wiringAreaGraphic.beginFill(0xFF0000);
        wiringAreaGraphic.drawRect(x, y, 7, 7);
        wiringAreaGraphic.isMask = false;
        //wiringAreaGraphic.zIndex = 100;
        this.simulationState.stage.addChild(wiringAreaGraphic);
        wiringAreaGraphic.hitArea = new PIXI.Rectangle(x - 50, y - 50 , 100, 100);
        
        const addWiringArea = {
            x : x,
            y : y,

            component : this,

            input : isInput,
            lineNumber : lineNumber,

            graphic : wiringAreaGraphic
        }

        wiringAreaGraphic.cursor = "grab"

        wiringAreaGraphic.on("mouseover", () => 
        {
            if (!this.selected) {
                wiringAreaGraphic.alpha = 1;
                this.activeWiringArea=addWiringArea
            }
        });

        wiringAreaGraphic.on("mouseout", () => 
        {
            if (!this.selected) {
                wiringAreaGraphic.alpha = 0;
                this.activeWiringArea = null;
            }
        });

        this.wiringAreas.get(isInput).set(lineNumber, addWiringArea);

    }

    
    passOutputs() {

    }
}