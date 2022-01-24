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
import { SimulationComponentIO } from "./SimulationComponent/SimulationComponentIO";

export class DigitalDesignSimulation extends PIXI.Application{
    private simulationState : SimulationState;

    ticker : PIXI.Ticker;
    interactionManager : InteractionManager;
    grid : PIXI.Graphics;
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

        //Simulation state holds data about the simulation
        this.simulationState = new SimulationState();
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
        let v2 = new Transistor(this.stage, 820, 500, this.simulationState);
        this.simulationState.addComponent(v)
        this.simulationState.addComponent(v2)
        this.renderer.backgroundColor = constants.General.BgColor_1
        
        //Add listeners for global events
        document.addEventListener("wheel", this.onScroll)
        document.addEventListener("mousedown", this.onMouseDown);
        document.addEventListener("mouseup", this.onMouseUp);
        document.addEventListener("mousemove", this.onMouseMove);  
    }

    addComponent(component : SimulationComponent) {
        this.simulationState.addComponent(component);
    }

    //Renders the simulation graphics on a set interval
    simulationLoop(delta : number){
        if (this.simulationState.stateChanged) {
            this.simulationState.components.forEach((c) => {
                c.draw();
            })
            this.simulationState.stateChanged = false;
         }
    }

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
        console.log(dragEvent.clientX, dragEvent.clientY)
        if (this.isInside(dragEvent.clientX, dragEvent.clientY, 
            this.view.getBoundingClientRect())) {

        }
    }

    onMouseDown(mouseEvent : MouseEvent) {

        let hit = this.interactionManager.hitTest(new PIXI.Point(mouseEvent.x, mouseEvent.y), this.stage)

        this.simulationState.components.forEach((component : SimulationComponent) => {
            if (component.componentTemplate == hit) {
                component.selected = true;
                this.simulationState.isDraggingComponent = true;
                this.simulationState.stateChanged = true;
                this.simulationState.SelectedComponent = component;
                this.simulationState.stateChanged = true;
            } else {
                component.selected = false;
                this.simulationState.stateChanged = true;
            }
        })

        if (!this.simulationState.isDraggingComponent && this.isInside(mouseEvent.clientX, mouseEvent.clientY, this.view.getBoundingClientRect())) {
            this.simulationState.isPanning = true;
        }
        this.simulationState.stateChanged = true;
    }

    onMouseUp(mouseEvent : MouseEvent) {
        if (this.isInside(mouseEvent.clientX, mouseEvent.clientY, this.view.getBoundingClientRect()) && 
            this.simulationState.isPanning) {
                this.simulationState.isPanning = false;
            }

            this.simulationState.isDraggingComponent = false;
    }

    onMouseMove(mouseEvent : MouseEvent) {
        if (this.simulationState.isPanning) {
            //this.stage.pivot.x -= mouseEvent.movementX;
            //this.stage.pivot.y -= mouseEvent.movementY;
        }

        if (this.simulationState.isDraggingComponent) {
            this.simulationState.SelectedComponent.x += mouseEvent.movementX;
            this.simulationState.SelectedComponent.y += mouseEvent.movementY;
            this.simulationState.stateChanged = true;
        }
    }

    isInside(x : number, y : number, rect : DOMRect) {
        return (x >= rect.x && x <= rect.x + rect.width
            && y >= rect.y && rect.y <= rect.y + rect.height) 
    }
}