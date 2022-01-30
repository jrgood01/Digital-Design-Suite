//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {SimulationComponent} from "./SimulationComponent/SimulationComponent"
import {MouseMode, SimulationState} from "./SimulationState";
import { NOTGate } from "./SimulationComponent/Gates/NOTGate";
import * as PIXI from "pixi.js"
import * as constants from "../constants";
import { Transistor } from "./SimulationComponent/Transistors/Transistor";
import { InteractionManager } from "pixi.js";
import { WiringMap } from "./DataStructure/WiringMap"
import { WiringArea } from "./SimulationComponent/WiringArea";

export class DigitalDesignSimulation extends PIXI.Application{
    private simulationState : SimulationState;
    private simulationUpdateFrequency : number;
    private interactionManager : InteractionManager;
    private grid : PIXI.Graphics;
    private wiringMap : WiringMap;

    constructor(container : HTMLDivElement) {
        super();
        
        //Bind methods to class
        this.resizePixiSimulation = this.resizePixiSimulation.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.addComponent = this.addComponent.bind(this);
        this.simulationLoop = this.simulationLoop.bind(this);
        this.runSimulation = this.runSimulation.bind(this);

        //Simulation state holds data about the simulation
        this.simulationState = new SimulationState(this.stage);
        //We'll use the pixi.js interaction manager to determine if
        //  clicks and other actions are inside a component.
        this.interactionManager = new InteractionManager(this.renderer);

        //Set the pixi.js view to the size of the window
        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;

        //Add the view to the HTML body
        document.body.append(this.view);

        //Add a new ticker to the simulation. The ticker will
        //  run on a set interval and render simulation graphics
        this.ticker = PIXI.Ticker.shared.add(this.simulationLoop, this)
        this.ticker.maxFPS = 10;

        //This method resizes the pixi.js render area to the
        //  size of the window
        this.resizePixiSimulation();
        
        //We want to resize the view every time the window is
        //  resized
        window.addEventListener('resize', this.resizePixiSimulation);  

        this.stage.interactive = true;

        let v = new NOTGate(1, this.stage, this.simulationState)
        let v2 = new Transistor(this.stage, 1000, 500, this.simulationState);

        this.simulationState.addComponent(v2)
        this.simulationState.addComponent(v)

        //Set background color for render
        this.renderer.backgroundColor = constants.General.BgColor_1
        
        //Add listeners for global events
        document.addEventListener("wheel", this.onScroll)
        document.addEventListener("mousedown", this.onMouseDown);
        document.addEventListener("mouseup", this.onMouseUp);
        document.addEventListener("mousemove", this.onMouseMove);  

        this.simulationUpdateFrequency = 100;
        setInterval(this.runSimulation, 1000/this.simulationUpdateFrequency);

        //We will use this to keep track of what component pins 
        //  are connected to what wires
        this.wiringMap = new WiringMap(this.simulationState);
    }

    /**
     * Add a component to the simulation
     * @param component component to add
     */
    addComponent(component : SimulationComponent) {
        this.simulationState.addComponent(component);
    }

    //Renders the simulation graphics on a set interval
    simulationLoop(delta : number){
        
        this.simulationState.components.forEach((c) => {
            c.draw();
        })
        this.wiringMap.draw();
    }

    /**
     * This fires when the window is resized
     */
    resizePixiSimulation() {
        this.renderer.resize(window.innerWidth, 
            window.innerHeight);
    }

    onScroll(scrollEvent : WheelEvent) {
        if (this.isInside(scrollEvent.clientX, scrollEvent.clientY, 
            this.view.getBoundingClientRect())) {
                this.stage.scale.x -= scrollEvent.deltaY / 1000;
                this.stage.scale.y -= scrollEvent.deltaY / 1000;
        }
    }

    onDrag(dragEvent : DragEvent) {
        if (this.isInside(dragEvent.clientX, dragEvent.clientY, 
            this.view.getBoundingClientRect())) {

        }
    }


    onMouseDown(mouseEvent : MouseEvent) {
        let hit = this.interactionManager.hitTest(new PIXI.Point(mouseEvent.x, mouseEvent.y), this.stage)
        this.simulationState.components.forEach((component : SimulationComponent) => {
            component.wiringAreas.forEach((val : Map<Number, WiringArea>) => {
                val.forEach((val : WiringArea) => {
                    if (val.graphic == hit) {
                        this.simulationState.draggingWireHitArea = component.activeWiringArea;
                        this.simulationState.draggingWire = 
                        this.wiringMap.addWire(
                            component, component.activeWiringArea.lineNumber, component.activeWiringArea.x, 
                            component.activeWiringArea.y, this.simulationState.draggingWireHitArea.input)
                        console.log(this.wiringMap);
                        if (this.simulationState.draggingWire) {
                            this.simulationState.draggingWire.addSegment(mouseEvent.x, mouseEvent.y);
                        }
                        console.log(this.simulationState.draggingWire);
                        return
                    }
                })
            })
        
            if (component.componentTemplate == hit) {
                component.selected = true;
                this.simulationState.isDraggingComponent = true;
                this.simulationState.stateChanged = true;
                this.simulationState.SelectedComponent = component;
                this.simulationState.stateChanged = true;
                return;
            } else {
                component.selected = false;
                this.simulationState.stateChanged = true;
            }
        })

        if (!this.simulationState.isDraggingComponent 
            && this.isInside(mouseEvent.clientX, mouseEvent.clientY, this.view.getBoundingClientRect())) {
            this.simulationState.isPanning = true;
        }
        this.simulationState.stateChanged = true;
    }

    onMouseUp(mouseEvent : MouseEvent) {
        if (this.isInside(mouseEvent.clientX, mouseEvent.clientY, this.view.getBoundingClientRect()) && 
            this.simulationState.isPanning) {
                this.simulationState.isPanning = false;
            }

            if (this.simulationState.draggingWire != null) {
                let hit = this.interactionManager.hitTest(new PIXI.Point(mouseEvent.x, mouseEvent.y), this.stage)
                this.simulationState.components.forEach((component : SimulationComponent) => {
                    component.wiringAreas.forEach((subMap : Map<Number, WiringArea>) => {
                        subMap.forEach((wiringArea : WiringArea) => {
                            if (wiringArea.graphic.hitArea.contains(mouseEvent.x, mouseEvent.y)) {
                                const addOutput = {
                                    component : component,
                                    componentLineNumber : wiringArea.lineNumber,
                                    lineUpdated : false
                                }
                                this.simulationState.draggingWire.positionLastSegment(wiringArea.x, wiringArea.y)
                                this.wiringMap.addWireMapping(component, wiringArea.input, wiringArea.lineNumber, this.simulationState.draggingWire);
                                this.simulationState.draggingWire = null;
                                return                                
                            }
                        })
                    })
                });

            }

            this.simulationState.draggingWire = null;
            this.simulationState.isDraggingComponent = false;
    }

    onMouseMove(mouseEvent : MouseEvent) {
        if (this.simulationState.isPanning) {
            //this.stage.pivot.x -= mouseEvent.movementX;
            //this.stage.pivot.y -= mouseEvent.movementY;
        }

        if (this.simulationState.isDraggingComponent) {
            this.simulationState.SelectedComponent.translate(mouseEvent.movementX, mouseEvent.movementY);
            this.wiringMap.moveComponentWires(this.simulationState.SelectedComponent, mouseEvent.movementX, mouseEvent.movementY);
            this.simulationState.stateChanged = true;
        }

        if (this.simulationState.draggingWire != null) {
            this.simulationState.draggingWire.positionLastSegment(mouseEvent.x, mouseEvent.y - 30);
        }
    }

    /**
     * Runs on an interval faster than pixi.js can render. This
     *  simulates the state of the components and wires
     */
    runSimulation() {
        this.simulationState.components.forEach((c : SimulationComponent) => {
            c.passOutputs();
        })

        this.simulationState.components.forEach((c : SimulationComponent) => {
            c.simulate();
        })
    }

    isInside(x : number, y : number, rect : DOMRect) {
        return (x >= rect.x && x <= rect.x + rect.width
            && y >= rect.y && rect.y <= rect.y + rect.height) 
    }
}