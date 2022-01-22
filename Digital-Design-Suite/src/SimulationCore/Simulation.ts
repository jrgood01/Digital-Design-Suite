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

    constructor(container : HTMLDivElement) {
        super();
        
        this.resizePixiSimulation = this.resizePixiSimulation.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onScroll = this.onScroll.bind(this)

        this.addComponent = this.addComponent.bind(this);
        this.simulationLoop = this.simulationLoop.bind(this);
        this.simulationState = new SimulationState();
        this.interactionManager = new InteractionManager(this.renderer);
        this.view.width = window.innerWidth;
        this.view.height = window.innerHeight;

        document.body.append(this.view);

        this.ticker = PIXI.Ticker.shared.add(this.simulationLoop, this)
        this.resizePixiSimulation();
        
        window.addEventListener('resize', this.resizePixiSimulation);  

        this.stage.interactive = true;

        let v = new NOTGate(1, this.stage, this.simulationState)
        let v2 = new Transistor(this.stage, 820, 500, this.simulationState);
        this.simulationState.addComponent(v)
        this.simulationState.addComponent(v2)
        this.renderer.backgroundColor = constants.General.BgColor_1
       
        document.addEventListener("wheel", this.onScroll)
        document.addEventListener("mousedown", this.onMouseDown);
        document.addEventListener("mouseup", this.onMouseUp);
        document.addEventListener("mousemove", this.onMouseMove);
    }

    addComponent(component : SimulationComponent) {
        this.simulationState.addComponent(component);
    }


    simulationLoop(delta : number){
        this.simulationState.components.forEach((c) => {
            c.draw();
        })

    }

    resizePixiSimulation() {
        this.renderer.resize(window.innerWidth, 
            window.innerHeight);
    }

    onScroll(scrollEvent : WheelEvent) {
        if (this.isInside(scrollEvent.clientX, scrollEvent.clientY, 
            this.view.getBoundingClientRect()) && this.simulationState.getMode() == MouseMode.ZOOM) {
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
        if (this.isInside(mouseEvent.clientX, mouseEvent.clientY, this.view.getBoundingClientRect())) {
            this.simulationState.isPanning = true;
        }

        let hit = this.interactionManager.hitTest(new PIXI.Point(mouseEvent.x, mouseEvent.y), this.stage)

        this.simulationState.components.forEach((component : SimulationComponent) => {
            if (component.componentTemplate == hit) {
                component.selected = true;
            } else {
                component.selected = false;
            }
        })

    }

    onMouseUp(mouseEvent : MouseEvent) {
        if (this.isInside(mouseEvent.clientX, mouseEvent.clientY, this.view.getBoundingClientRect()) && 
            this.simulationState.isPanning) {
                this.simulationState.isPanning = false;
            }
    }

    onMouseMove(mouseEvent : MouseEvent) {
        if (this.simulationState.isPanning) {
            this.stage.pivot.x -= mouseEvent.movementX;
            this.stage.pivot.y -= mouseEvent.movementY;
        }
    }
    isInside(x : number, y : number, rect : DOMRect) {
        return (x >= rect.x && x <= rect.x + rect.width
            && y >= rect.y && rect.y <= rect.y + rect.height) 
    }
}