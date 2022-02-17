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
import { WiringAreaActiveEvent } from "../SimulationEvents/WiringAreaActiveEvent";
import { SimulationAddGraphicEvent } from "../SimulationEvents/SimulationAddGraphicEvent";

/**
 * Represents a simulated digital component
 * Extend this class to create usable components
 */
export abstract class SimulationComponent{
    componentId : string;
    simulationState : SimulationState;

    input : SimulationComponentIO;
    output : SimulationComponentIO;

    deleted : boolean;

    protected x : number;
    protected y : number;

    selected : boolean;

    componentTemplate : PIXI.Graphics;

    wiringAreas : Map<boolean, Map<Number, WiringArea>>;

    geometry : Record <string, number>;

    glowColor : number;
    glowOn : boolean;

    onMove : Array<(dX : number, dY : number) => void>;

    onGraphicAdded : (e : SimulationAddGraphicEvent) => void;
    onGraphicRemove : (e : SimulationAddGraphicEvent) => void;

    visited : boolean;
    private opacity : number;

    private onWiringAreaActive :  Array<(e : WiringAreaActiveEvent) => void>;
    private onWiringAreaLeave : Array<() => void>;

    constructor(x : number, y : number, inputLines : number, outputLines : number, inputBitWidths : Array<number>, outputBitWidths : Array<number>) {
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

        this.geometry = this.calculateGeometry(1);
        this.glowOn = false;
        this.onMove = new Array<(dX : number, dY : number) => void>();
        this.visited = false;
        this.glowColor = 0x0000ff;
        this.onWiringAreaActive = new Array<(e : WiringAreaActiveEvent) => void>();
        this.onWiringAreaLeave = new Array<() => void>();

        this.x = x;
        this.y = y;

        this.onGraphicAdded = (e : SimulationAddGraphicEvent) => {};
        this.onGraphicRemove = (e : SimulationAddGraphicEvent) => {};
    }


    abstract simulate(): void;
    abstract draw() : void;
    calculateGeometry(scaler : number) {return {"a" : 1} as Record<string, number>}
    
    /**
     * Simulates the values of the component and passes to outputs
     */
    simulateAndPass() {
        this.simulate();
    }

    setOpacity(newOpacity : number) {
        this.componentTemplate.alpha = newOpacity;4
    }
    
    setGlow(on : boolean) {
        if (on) {
            this.componentTemplate.filters = [new GlowFilter({distance : 20, outerStrength: 2, color : this.glowColor})]
        } else {
            this.componentTemplate.filters = [];
        }

        this.glowOn = on;
    }

    setGlowColor(color : number) {
        if (this.glowOn) {
            this.componentTemplate.filters = [new GlowFilter({distance : 20, outerStrength: 2, color : color})]
        } 
        this.glowColor = color;
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

        this.onMove.forEach((f : (dX : number, dY : number) => void) => {
            f(x, y);
        })
    }

    setX (x : number) {
        let dx = x - this.x;
        this.x = x;

        this.geometry = this.calculateGeometry(1);
 
        this.wiringAreas.forEach((value : Map<Number, WiringArea>) => {
            value.forEach((wiringArea : WiringArea) => {
                wiringArea.graphic.x += dx;
                wiringArea.x += dx;
            });
        });      

        this.onMove.forEach((f : (dX : number, dY : number) => void) => {
            f(dx, 0);
        })
    }

    setY (y : number) {
        let dy = y - this.y;
        this.y = y;
        this.geometry = this.calculateGeometry(1);
 
        this.wiringAreas.forEach((value : Map<Number, WiringArea>) => {
            value.forEach((wiringArea : WiringArea) => {
                wiringArea.graphic.y += dy;
                wiringArea.y += dy;
            });
        });      

        this.onMove.forEach((f : (dX : number, dY : number) => void) => {
            f(0, dy);
        })
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
        wiringAreaGraphic.lineStyle(4, 0x0000FF);
        wiringAreaGraphic.drawCircle(x + 3.5, y + 3.5, 14);
        wiringAreaGraphic.isMask = false;
   
        this.onGraphicAdded(new SimulationAddGraphicEvent(wiringAreaGraphic));
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
                this.onWiringAreaActive.forEach((handler : (e : WiringAreaActiveEvent) => void) => {
                    handler(new WiringAreaActiveEvent(addWiringArea));
                })
            }
        });

        wiringAreaGraphic.on("mouseout", () => 
        {
            if (!this.selected) {
                wiringAreaGraphic.alpha = 0;
                this.onWiringAreaLeave.forEach((handler : () => void) => {
                    handler()
                });
            }
        });

        this.wiringAreas.get(isInput).set(lineNumber, addWiringArea);
    }



    addOnWiringAreaActive(handler : (e : WiringAreaActiveEvent) => void) {
        this.onWiringAreaActive.push(handler);
    }
    
    addOnWiringAreaLeave(handler : () => void) {
        this.onWiringAreaLeave.push(handler);
    }

    setOnGraphicAdded(handler : (e : SimulationAddGraphicEvent) => void) {
        this.onGraphicAdded = handler;
        handler(new SimulationAddGraphicEvent(this.componentTemplate));
        this.wiringAreas.forEach((value : Map<Number, WiringArea>) => {
            value.forEach((wiringArea : WiringArea) => {
                handler(new SimulationAddGraphicEvent(wiringArea.graphic));
            });
        });      

    }

    setOnGraphicRemove(handler : (e : SimulationAddGraphicEvent) => void) {
        this.onGraphicRemove = handler;
    }
}