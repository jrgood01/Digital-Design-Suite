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
import { HitAreaClickEvent } from "./SimulationEvents/HitAreaClickEvent"
import { ComponentDragEvent } from "./SimulationEvents/ComponentDragEvent";
import { WireEndDragAtWiringAreaEvent } from "./SimulationEvents/WireEndDragAtWiringAreaEvent";
import { Wire } from "./Wiring/Wire";
import { WiringArea } from "./SimulationComponent/WiringArea";
import { ANDGate } from "./SimulationComponent/Gates/ANDGate";
import { NANDGate } from "./SimulationComponent/Gates/NANDGate";
import { HexDisplay } from "./SimulationComponent/Peripheral/HexDisplay";
import { SimulationAddGraphicEvent } from "./SimulationEvents/SimulationAddGraphicEvent";
import {SimulationGrid} from "./SimulationGrid";

const minStageScale = .14;
const maxStageScale = 1.5;
export class DigitalDesignSimulation extends PIXI.Application{

    private simulationState : SimulationState;
    private simulationUpdateFrequency : number;
    private interactionManager : InteractionManager;
    private bg : PIXI.Graphics;
    private wiringMap : WiringMap;
    private bgColor : number;

    private lastMouseX : number;
    private lastMouseY : number;
  
    private grid : SimulationGrid;
    private container : PIXI.Container;
    private updated : boolean;

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
       this.onSimulationGraphicAdd = this.onSimulationGraphicAdd.bind(this);
       this.onSimulationGraphicRemove = this.onSimulationGraphicRemove.bind(this);
       this._onMouseDocumentDown = this._onMouseDocumentDown.bind(this);
       this._onMouseMove = this._onMouseMove.bind(this);
       this._onMouseUp = this._onMouseUp.bind(this);
       
       //Simulation state holds data about the simulation
       this.simulationState = new SimulationState(this.stage);
       this.simulationState.stage.on("pointerdown", this._onMouseDocumentDown);
       this.simulationState.stage.on("pointermove", this._onMouseMove);
       this.simulationState.stage.on("pointerup", this._onMouseUp);

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
       this.bg.zIndex = -1000;
       this.grid = new SimulationGrid(30, 30);

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
        this.container = new PIXI.Container();
        this.stage.addChild(this.container);
        this.container.cacheAsBitmap = false;
        this.stage.cacheAsBitmap = false;
        this.container.addChild(this.bg);
        this.container.addChild(this.grid.graphic);
        this.simulationUpdateFrequency = 1000;
        setInterval(this.runSimulation, 1000/this.simulationUpdateFrequency);
 
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
        this.grid.draw(this.container.scale.x);
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
                let delta = scrollEvent.deltaY;
                if (delta > 0) {
                    if (this.container.scale.x > minStageScale) {
                        this.container.scale.x -= Math.sqrt(delta) / 200;
                        this.container.scale.y -= Math.sqrt(delta) / 200;
                        this.bg.width *= 1 / this.container.scale.x;
                        this.bg.height *= 1 / this.container.scale.x;
                    }
                } else {
                    if (this.container.scale.x < maxStageScale) {
                        delta = Math.abs(delta);
                        this.container.scale.x += Math.sqrt(delta) / 200;
                        this.container.scale.y += Math.sqrt(delta) / 200;
                        this.bg.width /= 1 / Math.abs(this.container.scale.x);
                        this.bg.height /= 1 / Math.abs(this.container.scale.x);
                    }
                }
                this.simulationState.components.forEach((c : SimulationComponent) => {
                    c.updateHitArea();
                })
            this.grid.update();

            this.grid.setXMax(this.bg.width);
            this.grid.setYMax(this.bg.height);
            this.interactionManager.update();
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
                addWire.setGrid(this.grid);
                this.simulationState.setDraggingWire(addWire);
        }
    }

    onComponentDrag(e : ComponentDragEvent) {
        let gridPoint = this.grid.snapToGrid(new PIXI.Point(e.x, e.y));
        e.component.setX(gridPoint.x);
        e.component.setY(gridPoint.y);
        this.wiringMap.moveComponentWires(e.component, gridPoint.x, gridPoint.y);
    }

    onWireEndDragAtWiringArea(e : WireEndDragAtWiringAreaEvent) {
        e.wire.endPlace();
        e.wire.connectComponentToTop(e.component);

        this.wiringMap.addWireMapping(e.component, e.wiringArea.input, 
            e.wiringArea.lineNumber, e.wire);
        e.wire.anchorToPoint(e.wiringArea.x, e.wiringArea.y, true);        
        return    
    }

    updateSimulationComponents() {
        this.simulationState.components.forEach((c : SimulationComponent) => {c.visited = false})
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
    
    detectHitComponent(x : number, y : number) : SimulationComponent{
        console.log("R")

        for (let c of this.simulationState.components) {
            if (c.componentTemplate.hitArea.contains(x, y)) {
                console.log(c)
                console.log("point hit detect component")
                return c;

            }
        }
        console.log("returning null detect component")
        return null;
    }

    detectHitWiringArea(x : number, y: number) : WiringArea{
        let retVal = null;
        this.simulationState.components.forEach((component : SimulationComponent) => {
            component.wiringAreas.forEach((val: Map<Number, WiringArea>) => {
                val.forEach((val: WiringArea) => {
                    console.log(x, y, val.graphic.hitArea)
                    if (val.graphic.hitArea.contains(x, y)) {
                        retVal = val;
                        console.log("WIRE HIT")
                    }
                })
            })
        });

        return retVal;
    }

    _onMouseDocumentDown(mouseEvent : InteractionEvent) {
        console.log("V")
        let pos = mouseEvent.data.global;
        let localPos = this.stage.toLocal(pos);
        //this.simulationState.stage.addChild(new PIXI.Graphics().beginFill(0xff0000).drawRect(localPos.x, localPos.y, 10, 10))
        //let hit = this.interactionManager.hitTest(new PIXI.Point(localPos.x, localPos.y), this.container)
        let wiringAreaHit = this.detectHitWiringArea(localPos.x, localPos.y);
        let componentHit = this.detectHitComponent(localPos.x, localPos.y);
        console.log(componentHit, wiringAreaHit)
        if (this.simulationState.lockSelectedToCursor) {
            this.simulationState.SelectedComponent.setOpacity(1);
            this.simulationState.SelectedComponent = null;
            this.simulationState.lockSelectedToCursor = false;
            return;
        }   
        if (wiringAreaHit) {
            let event = new HitAreaClickEvent(wiringAreaHit.component, wiringAreaHit)
            this.onHitAreaClick(event);
            return;
        }
        if (componentHit) {
            console.log("HIT")
            componentHit.selected = true;
            this.simulationState.isDraggingComponent = true;
            this.simulationState.stateChanged = true;
            this.simulationState.SelectedComponent = componentHit;
            this.simulationState.stateChanged = true;

        }else {
            this.simulationState.components.forEach((c : SimulationComponent) => {
                c.selected = false;
            })
            return;
        }
    }   
    
    _onMouseMove(mouseEvent : InteractionEvent) {
        let pos = this.stage.toLocal(mouseEvent.data.global);
        let dX = 0;
        let dY = 0;
        //console.log("Raw: ",pos);
        //console.log("Local: ",this.stage.toLocal(pos))
       // console.log("Stage Scale: ",this.stage.scale.x, this.stage.scale.y);
        //console.log("RAW / LOCAL: ", this.stage.scale.x / this.stage.toLocal(pos).x)

        if (this.lastMouseX == 0 || this.lastMouseY == 0) {
            this.lastMouseX = pos.x;
            this.lastMouseY = pos.y;
            return;
        }

        dX = pos.x - this.lastMouseX;
        dY = pos.y - this.lastMouseY;
        if (this.simulationState.isDraggingComponent) {
            let event = new ComponentDragEvent(this.simulationState.SelectedComponent, pos.x, pos.y, dX, dY);
            this.onComponentDrag(event);
        }

        if (this.simulationState.lockSelectedToCursor) {
            this.simulationState.SelectedComponent.setX(pos.x);
            this.simulationState.SelectedComponent.setY(pos.y);
        }

        if (this.simulationState.getIsDraggingWire) {

        }

        this.lastMouseX = pos.x;
        this.lastMouseY = pos.y;
    }

    _onMouseUp(mouseEvent : InteractionEvent) {
        let pos = this.stage.toLocal(mouseEvent.data.global);

        if (this.simulationState.isDragging) {

           if (this.simulationState.activeWiringArea != null) {
               let e = new WireEndDragAtWiringAreaEvent(this.simulationState.getDraggingWire(), this.simulationState.activeWiringArea.component,
               this.simulationState.activeWiringArea, pos.x, pos.y);
               this.onWireEndDragAtWiringArea(e);              
           }

            this.simulationState.stopDraggingWire();
        }

        this.simulationState.isDraggingComponent = false;        
    }

    onSimulationGraphicAdd(e : SimulationAddGraphicEvent) {
        this.container.addChild(e.graphic);
    }

    onSimulationGraphicRemove(e : SimulationAddGraphicEvent) {
        this.container.removeChild(e.graphic);
    }

    beginPlace(componentName : String) {
        if (componentName === "") 
            return

        let addComponent : SimulationComponent;
        switch(componentName) {
            case "And":
                addComponent = new ANDGate(1, 0, 0, 2);
                break;
            case "Constant":
                addComponent = new ConstantComponent(0, 0, 1);
                break;
            case "Not":
                addComponent = new NOTGate(1, 0, 0)
                break;
            case "Nand":
                addComponent = new NANDGate(1, 0, 0, 2);
                break;
            case "7 Segment Display":
                addComponent = new HexDisplay(0, 0);
                break;
        }
        addComponent.setGrid(this.grid);
        this.beginPlaceHelper(addComponent)
    }

    beginPlaceHelper(addComponent : SimulationComponent) {
        addComponent.setOnGraphicAdded(this.onSimulationGraphicAdd);
        addComponent.setOnGraphicRemove(this.onSimulationGraphicRemove);
        this.simulationState.addComponent(addComponent);
        this.simulationState.lockSelectedToCursor = true;
        addComponent.setOpacity(.3);
        this.simulationState.SelectedComponent = addComponent;
    }
    /**
     * Runs on an interval faster than pixi.js can render. This
     *  simulates the state of the components and wires
     */
    runSimulation() {
        this.updateSimulationComponents();
    }

    isInside(x : number, y : number, rect : DOMRect) {
        return (x >= rect.x && x <= rect.x + rect.width
            && y >= rect.y && rect.y <= rect.y + rect.height) 
    }
}