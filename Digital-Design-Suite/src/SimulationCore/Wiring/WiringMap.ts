//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import { Component } from "react";
import { SimulationComponent } from "../SimulationComponent/SimulationComponent";
import { SimulationState } from "../SimulationState";
import { Wire } from "./Wire";

export class WiringMap {
    //Contains useful information about the simulation
    private simulationState : SimulationState;

    //We will store the component to wire map in a Map of Maps
    //  the submap of each component contains two entires.
    //  the true entry represents input maps and the false
    //  entry represents output maps. 
    private wireMap : Map<SimulationComponent, Map<boolean, Map<number, Wire>>>

    constructor(simulationState : SimulationState) {
        this.simulationState = simulationState;
        this.wireMap = new Map<SimulationComponent, Map<boolean, Map<number, Wire>>>();
    }

    /**
     * Adds a wire to the wireMap. Creates a wire mapping between the ioComponent and wire
     * @param ioComponent component that is an input to the wire
     * @param lineNumber line number on the input component
     * @param startX start x position
     * @param startY start y position
     * @param isInput is the wiring area an input
     * @returns the created wire
     */
    addWire(ioComponent : SimulationComponent, lineNumber : number, startX : number, startY : number, isInput : boolean) {
        //If the component is not yet in the map, we need to add it
        if(this.wireMap.get(ioComponent) == null) {
            this.wireMap.set(ioComponent, new  Map<boolean, Map<number, Wire>>());
            this.wireMap.get(ioComponent).set(false, new Map<number, Wire>());
            this.wireMap.get(ioComponent).set(true, new Map<number, Wire>());
        }

        //If there is already a wire mapped on this wiring area we return null
        //  indicating that no wire was created
        if (this.wireMap.get(ioComponent).get(isInput).get(lineNumber) != null) {
            console.log("Already Mapped Wire")
            console.log(this.wireMap.get(ioComponent).get(isInput).get(lineNumber))
            return null;
        }

        //Create a new wire with the passed start coordinates
        let addWire = new Wire(startX, startY, ioComponent, this.simulationState.stage);
        const inputConnection = 
        {
            component: ioComponent, 
            componentLineNumber: lineNumber, 
            lineUpdated: false
        }
        addWire.addInput(inputConnection);
        addWire.graphic.on("mousedown", (e : MouseEvent) => {
            //addWire.addDummySegment();
            
            //this.simulationState.draggingWire = addWire;
        })

        //Add the wire to the map
        this.wireMap.get(ioComponent).get(isInput).set(lineNumber, addWire);
        this.simulationState.stage.addChild(addWire.graphic);
        ioComponent.setGlow(true);
        return addWire;
    }

    /**
     * Map an existing wire to a new component
     * @param component component to map
     * @param isInput true if input to wire false if output to wire
     * @param lineNumber line to map on component
     * @param wire existing wire to map
     */
    addWireMapping(ioComponent : SimulationComponent, isInput : boolean, lineNumber : number, wire : Wire) {
        //If the component is not yet in the map, we need to add it
        if(this.wireMap.get(ioComponent) == null) {
            this.wireMap.set(ioComponent, new Map<boolean, Map<number, Wire>>());

            this.wireMap.get(ioComponent).set(false, new Map<number, Wire>());
            this.wireMap.get(ioComponent).set(true, new Map<number, Wire>());
        }

        //Add wire to the map
        ioComponent.setGlow(true);
        this.wireMap.get(ioComponent).get(isInput).set(lineNumber, wire);
    }

    /**
     * Moves all wires on exitsing component
     * @param component component to move wires wire
     * @param dx change in x
     * @param dy change in y
     */
    moveComponentWires(component : SimulationComponent, dx : number, dy : number) {

    }

    getMappedComponentOutputs(component : SimulationComponent) {
        if (this.wireMap.get(component) != null) {
            return this.wireMap.get(component).get(false);
        } else { 
            return null;
        }
        
    }

    getMappedComponentInputs(component : SimulationComponent) {
        if (this.wireMap.get(component) != null) {
            return this.wireMap.get(component).get(true);
        } else {
            return null;
        }
        
    }

    
    /**
     * draw the component
     */
    draw() {
        //Draw each wire in the map
        this.wireMap.forEach((value : Map<boolean, Map<number, Wire>>) => {
            value.forEach((value : Map<number,Wire>) => {
                value.forEach((value : Wire) => {
                    value.simulate();
                    value.draw();
                })
            })
        })
    }
}