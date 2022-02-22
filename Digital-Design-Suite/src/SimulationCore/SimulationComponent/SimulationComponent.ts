//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
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
import {SimulationGrid} from "../SimulationGrid";
import {Point} from "pixi.js";

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

    protected grid : SimulationGrid;

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

    setGrid(grid : SimulationGrid) {
        this.grid = grid;
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

    /**
     * Add an input line to the component
     * @param bitWidth bitwidth of input line
     */
    addInputLine(bitWidth : number) {
        this.input.addLine(bitWidth);
    }

    /**
     * Delete an input line from the component
     * @param lineNumber input line number to delete
     */
    deleteInputLine(lineNumber : number) {
        this.input.removeLine(lineNumber);
    }

    /**
     * Add an output line to the component
     * @param bitWidth bitwidth of output line to add
     */
    addOutputLine(bitWidth : number) {
        this.output.addLine(bitWidth);
    }

    /**
     * Delete an output line from the component
     * @param lineNumber number of output line to delete
     */
    deleteOutputLine(lineNumber : number) {
        this.output.removeLine(lineNumber);
    }

    /**
     * Change the bitwidth of an input line
     * @param lineNumber number of line to change bitwidth
     * @param newBitWidth new bitwidth
     */
    changeInputBitWidth(lineNumber : number, newBitWidth : number) {
        this.input.changeBitSize(lineNumber, newBitWidth);
    }

    /**
     * Change the bit width of an output line
     * @param lineNumber line number to change bitwidth on
     * @param newBitWidth new bitwidth
     */
    changeOutputBitWidth(lineNumber : number, newBitWidth : number) {
        this.output.changeBitSize(lineNumber, newBitWidth);
    }

    /**
     * Get the state of an input line
     * @param lineNumber line number of input
     */
    getInputLine(lineNumber : number) {
        return this.input.getLineValue(lineNumber);
    }

    /**
     * Get the state of an output line
     * @param lineNumber line number of output
     */
    getOutputLine(lineNumber : number) {
        return this.output.getLineValue(lineNumber);
    }

    /**
     * Get a specified bit state from an input line
     * @param lineNumber line number to get state from
     * @param bitNumber bit number
     */
    getInputLineBit(lineNumber : number, bitNumber : number) {
        return this.input.getLineBit(lineNumber, bitNumber);
    }

    /**
     * Get a specified bit state from an output line
     * @param lineNumber line number to get state from
     * @param bitNumber bit number
     */
    getOutputLineBit(lineNumber : number, bitNumber : number) {
        return this.output.getLineBit(lineNumber, bitNumber);
    }

    /**
     * Set the value of an input line
     * @param lineNumber line number to set
     * @param value value of line
     */
    setInputLine(lineNumber : number, value : Array<wireState>) {
        this.input.setLineValue(lineNumber, value);
    }

    /**
     * Translate the component
     * @param x dX
     * @param y dY
     */
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
                wiringArea.graphic.hitArea = new PIXI.Rectangle(wiringArea.x - 20, wiringArea.y - 20 , 100, 100);
            });
        });      

        this.onMove.forEach((f : (dX : number, dY : number) => void) => {
            f(x, y);
        })
    }

    /**
     * Set the x location of the component
     * @param x new x location
     */
    setX (x : number) {
        if (this.grid) {
            x = this.grid.snapToGrid(new Point(x, 0)).x;
        }

        let dx = x - this.x;
        this.x = x;
        this.geometry = this.calculateGeometry(1);

        this.wiringAreas.forEach((value : Map<Number, WiringArea>) => {
            value.forEach((wiringArea : WiringArea) => {
                wiringArea.graphic.x += dx;
                wiringArea.x += dx;
                wiringArea.graphic.hitArea = new PIXI.Rectangle(wiringArea.x - 20, wiringArea.y - 20 , 100, 100);
            });
        });

        this.onMove.forEach((f : (dX : number, dY : number) => void) => {
            f(dx, 0);
        })
    }

    /**
     * Set the y location of the component
     * @param y new y location
     */
    setY (y : number) {
        if (this.grid) {
            y = this.grid.snapToGrid(new Point(0, y)).y;
        }

        let dy = y - this.y;
        this.y = y;
        this.geometry = this.calculateGeometry(1);

        this.wiringAreas.forEach((value : Map<Number, WiringArea>) => {
            value.forEach((wiringArea : WiringArea) => {
                wiringArea.graphic.y += dy;
                wiringArea.y += dy;
                wiringArea.graphic.hitArea = new PIXI.Rectangle(wiringArea.x - 20, wiringArea.y - 20 , 100, 100);
            });
        });

        this.onMove.forEach((f : (dX : number, dY : number) => void) => {
            f(0, dy);
        })
    }


    /**
     * Update the bounds of the component's hit area
     */
    updateHitArea() {
        this.componentTemplate.hitArea = new PIXI.Rectangle(
            this.componentTemplate.getBounds().x, this.componentTemplate.getBounds().y,
            this.componentTemplate.getBounds().width,
            this.componentTemplate.getBounds().height + 50)
    }

    /**
     * Add a wiring area to the component
     * @param x x location of wiring area
     * @param y y location of wiring area
     * @param lineNumber line number to map to
     * @param isInput is this mapped to an input line?
     */
    addWiringArea(x : number, y : number, lineNumber : number, isInput : boolean) {
        let wiringAreaGraphic = new PIXI.Graphics();
       
        wiringAreaGraphic.interactive = true;
        wiringAreaGraphic.alpha = 0;
        wiringAreaGraphic.lineStyle(4, 0x0000FF);
        wiringAreaGraphic.drawCircle(x + 3.5, y + 3.5, 14);
        wiringAreaGraphic.isMask = false;
   
        this.onGraphicAdded(new SimulationAddGraphicEvent(wiringAreaGraphic));
        wiringAreaGraphic.hitArea = new PIXI.Rectangle(x - 20, y - 20 , 100, 100);
        
        const addWiringArea = {
            x : x,
            y : y,

            component : this,

            input : isInput,
            lineNumber : lineNumber,

            graphic : wiringAreaGraphic
        }

        //wiringAreaGraphic.cursor = "grab"

       /* wiringAreaGraphic.on("mouseover", () =>
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

        */

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