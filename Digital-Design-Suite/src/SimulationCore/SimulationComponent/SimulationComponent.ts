//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {ComponentConnection} from "./ComponentConnection"
import {SimulationComponentIO} from "./SimulationComponentIO"
import { SimulationState } from '../SimulationState';
import { wireState } from "../WireStates";
import * as PIXI from 'pixi.js'
import { Renderable } from "../Renderable";

/**
 * Represents a simulated digital component
 * Extend this class to create usable components
 */
export abstract class SimulationComponent implements Renderable{
    componentId : string;
    simulationState : SimulationState;

    input : SimulationComponentIO;
    output : SimulationComponentIO;

    componentOutputMap : Map<Number, ComponentConnection>;
    deleted : boolean;

    x : number;
    y : number;

    selected : boolean;

    componentTemplate : PIXI.Graphics;

    constructor(inputLines : number, outputLines : number, inputBitWidths : Array<number>, outputBitWidths : Array<number>, stage? : PIXI.Container) {
        this.input = new SimulationComponentIO(inputLines, inputBitWidths);
        this.output = new SimulationComponentIO(outputLines, outputBitWidths);
        this.componentOutputMap = new Map<Number, ComponentConnection>();
        this.deleted = false;
        this.componentTemplate = new PIXI.Graphics();
        this.componentTemplate.interactive = true;
        this.componentTemplate.cursor = "pointer"
        this.selected = false;
        stage.addChild(this.componentTemplate);
    }


    abstract simulate(): void;
    abstract draw() : void;

    simulateAndPass() {
        this.simulate();
        this.passOutputs();
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

    wireComponentOutput(component : SimulationComponent, outputLine : number, inputLineNumber : number) {
        this.componentOutputMap.set(outputLine, 
            {inputComponent : component, inputComponentLineNumber : inputLineNumber});
    }


    updateHitArea() {
        this.componentTemplate.hitArea = new PIXI.Rectangle(
            this.componentTemplate.getBounds().x, this.componentTemplate.getBounds().y,
            this.componentTemplate.getBounds().width,
            this.componentTemplate.getBounds().height)
    }
    passOutputs() {
        this.componentOutputMap.forEach((connection : ComponentConnection, key : number) => {
            if (connection.inputComponent.deleted) {
                this.componentOutputMap.delete(key);
            }
            let lineVal = this.getOutputLine(key);
            let inputLine = connection.inputComponentLineNumber;
            connection.inputComponent.setInputLine(inputLine, lineVal);
        });
    }
}