//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {SimulationComponent} from "./SimulationComponent/SimulationComponent"
import {MouseMode, SimulationState} from "./SimulationState";
import { NOTGate } from "./SimulationComponent/Gates/NOTGate";
import { ConstantComponent } from "./SimulationComponent/Wiring/Constant"
import * as PIXI from "pixi.js"
import * as constants from "../constants";
import { Transistor } from "./SimulationComponent/Transistors/Transistor";
import { InteractionEvent, InteractionManager } from "pixi.js";
import { WiringMap } from "./Wiring/WiringMap"
import { SimulationWarden } from "./SimulationWarden"
import { HitAreaClickEvent } from "./SimulationEvents/HitAreaClickEvent"
import { ComponentDragEvent } from "./SimulationEvents/ComponentDragEvent";
import { WireEndDragAtWiringAreaEvent } from "./SimulationEvents/WireEndDragAtWiringAreaEvent";
import { Wire } from "./Wiring/Wire";
import { HexDisplay } from "./SimulationComponent/Peripheral/HexDisplay"
import { NANDGate } from "./SimulationComponent/Gates/NANDGate";
import { ANDGate } from "./SimulationComponent/Gates/ANDGate";

export class DigitalDesignSimulation extends PIXI.Application{
    private simulationState : SimulationState;
    private simulationUpdateFrequency : number;
    private interactionManager : InteractionManager;
    private bg : PIXI.Graphics;
    private wiringMap : WiringMap;
    private bgColor : number;

    private lastMouseX : number;
    private lastMouseY : number;
   simulationWarden : SimulationWarden;
    private lockSelectedToCursor : true;

    constructor(container : HTMLDivElement) {
        super();
       //Bind methods to class
       this.resizePixiSimulation = this.resizePixiSimulation.bind(this);
  

       this.onComponentDrag = this.onComponentDrag.bind(this);
         
       this.onScroll = this.onScroll.bind(this);
       this.addComponent = this.addComponent.bind(this);
       this.simulationLoop = this.simulationLoop.bind(this);
       this.runSimulation = this.runSimulation.bind(this);
       this.onHitAreaClick = this.onHitAreaClick.bind(this);
       this.onWireEndDragAtWiringArea = this.onWireEndDragAtWiringArea.bind(this);
       
       //Simulation state holds data about the simulation
       this.simulationState = new SimulationState(this.stage);
       //We'll use the pixi.js interaction manager to determine if
       //  clicks and other actions are inside a component.
       this.interactionManager = new InteractionManager(this.renderer);
       
       //Set the pixi.js view to the size of the window
       this.view.width = window.innerWidth;
       this.view.height = window.innerHeight;

       this.lastMouseX = 0;
       this.lastMouseY = 0;
       
       //We will use this to keep track of what component pins 
       //  are connected to what wires
       this.wiringMap = new WiringMap(this.simulationState);
       
       this.simulationWarden = new SimulationWarden(this.simulationState, this.renderer);
       this.simulationWarden.addOnHitAreaClick(this.onHitAreaClick);
       this.simulationWarden.addOnComponentDrag(this.onComponentDrag);
       this.simulationWarden.addOnWireEndDragAtWiringAreaEvent(this.onWireEndDragAtWiringArea);
        
       //Add listeners for global events
       document.addEventListener("wheel", this.onScroll)
       //We want to resize the view every time the window is
       //  resized
       window.addEventListener('resize', this.resizePixiSimulation); 
       this.stage.interactive = true;
       this.stage.sortableChildren = true;
       
       //Set background color for render
       this.bgColor = constants.General.BgColor_1
       this.bg = new PIXI.Graphics();
       this.bg.zIndex = -1000
    }

    beginRender() {  
        //Add the view to the HTML body
        document.body.append(this.view);
        
        //Add a new ticker to the simulation. The ticker will
        //  run on a set interval and render simulation graphics
        this.ticker = PIXI.Ticker.shared.add(this.simulationLoop, this)
        this.ticker.maxFPS = 30;
        
        //This method resizes the pixi.js render area to the
        //  size of the window
        this.resizePixiSimulation();
            
        this.stage.addChild(this.bg)

        this.simulationUpdateFrequency = 1000;
        setInterval(this.runSimulation, 1000/this.simulationUpdateFrequency);
        
        let v4 = new ConstantComponent(this.stage, 900, 900, this.simulationState, 1);
        let v5 = new HexDisplay(900, 900, this.simulationState);
                
        //let r = new HexDisplay(200, 200, this.simulationState.stage);
                
        // let v4 = new ConstantComponent(this.stage, 400, 700, this.simulationState, 1);
        
        // this.simulationState.addComponent(v4);
        
        this.simulationState.addComponent(v4);
        this.simulationState.addComponent(v5);
        //this.simulationState.addComponent(r);
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
        this.bg.clear();
        this.bg.beginFill(this.bgColor) 
            .drawRect(0, 0, window.innerWidth, window.innerWidth);
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

    onHitAreaClick(e : HitAreaClickEvent) {
            this.simulationState.draggingWireHitArea =this.simulationState.activeWiringArea;
            let addWire = this.wiringMap.addWire(
                e.component, this.simulationState.activeWiringArea.lineNumber, this.simulationState.activeWiringArea.x, 
                this.simulationState.activeWiringArea.y, e.hitArea.input);
            if (addWire != null) {
                this.simulationState.setDraggingWire(addWire);
        }
    }

    onComponentDrag(e : ComponentDragEvent) {
        e.component.translate(e.dX, e.dY);
        this.wiringMap.moveComponentWires(e.component, e.x, e.y);
    }

    onWireEndDragAtWiringArea(e : WireEndDragAtWiringAreaEvent) {
        console.log("wireHitArea")
        const addOutput = {
            component : e.component,
            componentLineNumber : e.wiringArea.lineNumber,
            lineUpdated : false
        }

        e.wire.endPlace();
        e.wire.connectComponentToTop(e.component);

        this.wiringMap.addWireMapping(e.component, e.wiringArea.input, 
            e.wiringArea.lineNumber, e.wire);
        e.wire.anchorToPoint(e.wiringArea.x, e.wiringArea.y, true);        
        return    
    }

    updateSimulationComponents() {
        this.simulationState.components.forEach((c : SimulationComponent) => {c.visited = false})
        if (this.simulationWarden.requestPermissionToRunSimulation()) {
            let notVisited = new Array<SimulationComponent>();
            do {
                let i = 0;
                notVisited = this.simulationState.components.filter(c => c.visited == false);
  
                while (i < notVisited.length)  {
                    let inputWires = this.wiringMap.getMappedComponentInputs(notVisited[i]);
                    if (inputWires == null || inputWires.size == 0) {
                        notVisited[i].simulate();
                        notVisited[i].visited = true;
                        i ++;
                        continue;
                    }
                    let notUpdatedWires = Object.values(inputWires).filter((w) => !(w as Wire).AllInputsVisited());
                        
                    if (notUpdatedWires.length == 0) {
                        inputWires.forEach((wire : Wire, line : number) => {
                            wire.simulate();
                            notVisited[i].setInputLine(line, wire.getState());
                        });

                        notVisited[i].simulate();
                        notVisited[i].visited = true;
                    }
                    i++;

                } 
                
            } while (notVisited.length > 0)
        }
    }
    /**
     * Runs on an interval faster than pixi.js can render. This
     *  simulates the state of the components and wires
     */
    runSimulation() {
        this.updateSimulationComponents();
        this.simulationState.components.forEach((c : SimulationComponent) => {
            c.passOutputs();
        })
    }

    isInside(x : number, y : number, rect : DOMRect) {
        return (x >= rect.x && x <= rect.x + rect.width
            && y >= rect.y && rect.y <= rect.y + rect.height) 
    }
}