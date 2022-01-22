//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {SimulationGraphicsComponent} from "./SimulationGraphics/Component/SimulationGraphicComponent"
import {SimulationState} from "./SimulationState";
import * as PIXI from "pixi.js"
import { NPNTransistorGraphicsComponent } from "./SimulationGraphics/Component/Transistors/NPNTransistorGraphicsComponent";
import * as constants from "../constants";
export class DigitalDesignSimulation extends PIXI.Application{
    private simulationState : SimulationState;
    private container : HTMLDivElement;
    private elapsedTime : number;
    ticker : PIXI.Ticker;
 
    constructor(container : HTMLDivElement) {
        super();

        this.resizePixiSimulation = this.resizePixiSimulation.bind(this);
        this.addComponent = this.addComponent.bind(this);
        this.simulationLoop = this.simulationLoop.bind(this);
        this.simulationState = new SimulationState();

        this.container = container; 
        this.view.width = 400;
        this.view.height = 400;
        this.elapsedTime = 0;

        container.appendChild(this.view);

        this.container.onresize = this.resizePixiSimulation;
        this.ticker = PIXI.Ticker.shared.add(this.simulationLoop, this)
        this.resizePixiSimulation();
        
        window.addEventListener('resize', this.resizePixiSimulation);  

        let v = new NPNTransistorGraphicsComponent(this.stage);
        this.simulationState.addComponent(v)
        this.renderer.backgroundColor = constants.General.BgColor_1

    }

    addComponent(component : SimulationGraphicsComponent) {
        this.simulationState.addComponent(component);
    }


    simulationLoop(delta : number){
        this.elapsedTime += delta;
        this.simulationState.components.forEach((c) => {
            console.log("Drawing Component")
            c.draw();
        })
    }

    resizePixiSimulation() {
        this.renderer.resize(this.container.clientWidth, 
            this.container.clientHeight);
    }
}