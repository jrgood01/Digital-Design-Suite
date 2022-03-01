//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import {SimulationComponent} from "./SimulationComponent/SimulationComponent"
import {MouseMode, SimulationState} from "./SimulationState";
import {NOTGate} from "./SimulationComponent/Gates/NOTGate";
import {ConstantComponent} from "./SimulationComponent/Wiring/Constant"
import * as PIXI from "pixi.js"
import {InteractionEvent, InteractionManager} from "pixi.js"
import * as constants from "../constants";
import {WiringMap} from "./Wiring/WiringMap"
import {HitAreaClickEvent} from "./SimulationEvents/HitAreaClickEvent"
import {ComponentDragEvent} from "./SimulationEvents/ComponentDragEvent";
import {WireEndDragAtWiringAreaEvent} from "./SimulationEvents/WireEndDragAtWiringAreaEvent";
import {Wire} from "./Wiring/Wire";
import {ANDGate} from "./SimulationComponent/Gates/ANDGate";
import {NANDGate} from "./SimulationComponent/Gates/NANDGate";
import {HexDisplay} from "./SimulationComponent/Peripheral/HexDisplay";
import {SimulationAddGraphicEvent} from "./SimulationEvents/SimulationAddGraphicEvent";
import {SimulationGrid} from "./SimulationGrid";
import {CustomHitDetector} from "./CustomHitDetector";
import {ComponentWiringArea} from "./Wiring/ComponentWiringArea";
import {WiringArea} from "./Wiring/WiringArea";
import {WireWiringArea} from "./Wiring/WireWiringArea";
import {ORGate} from "./SimulationComponent/Gates/ORGate";
import {XORGate} from "./SimulationComponent/Gates/XORGate";
import {XNORGate} from "./SimulationComponent/Gates/XNORGate";
import {NORGate} from "./SimulationComponent/Gates/NORGate";

const minStageScale = .6;
const maxStageScale = 1.6;
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

    private hitDetector : CustomHitDetector;
    private cursorGraphic : PIXI.Graphics;

    constructor() {
        super();
       //Bind methods to class
       this.resizePixiSimulation = this.resizePixiSimulation.bind(this);
  

       this.onComponentDrag = this.onComponentDrag.bind(this);
         
       this._onScroll = this._onScroll.bind(this);
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
       this._onKeyDown = this._onKeyDown.bind(this);

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
       
        
       //Add listeners for global events
       document.addEventListener("wheel", this._onScroll)

        //Keyboard events
        document.addEventListener("keydown", this._onKeyDown)
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
       this.cursorGraphic = new PIXI.Graphics();

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
        this.container.addChild(this.bg );
        this.container.addChild(this.grid.graphic);

        //We will use this to keep track of what component pins
        //  are connected to what wires
        this.wiringMap = new WiringMap(this.container);
        this.hitDetector = new CustomHitDetector();
        this.hitDetector.setSimulationComponentArray(this.simulationState.components);
        this.hitDetector.setWiringMap(this.wiringMap);
        this.simulationUpdateFrequency = 1000;
        this.container.addChild(this.cursorGraphic)
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
     * Runs on an interval faster than pixi.js can render. This
     *  simulates the state of the components and wires
     */

    runSimulation() {
        this.updateSimulationComponents();
    }

    /**
     * This fires when the window is resized
     */

    resizePixiSimulation() {
        this.renderer.resize(window.innerWidth, 
            window.innerHeight);
    }

    /**
     * This algorithm simulates the logic for each component.
     */
    updateSimulationComponents() {
        this.simulationState.components.forEach((c : SimulationComponent) => {c.visited = false})
        let notVisited = new Array<SimulationComponent>();
        do {
            let i = 0;
            notVisited = this.simulationState.components.filter(c => c.visited == false);
  
            while (i < notVisited.length)  {
                const inputWires = this.wiringMap.getMappedComponentInputs(notVisited[i]);
                if (inputWires == null || inputWires.size == 0) {
                    notVisited[i].simulate();
                    notVisited[i].visited = true;
                    i ++;
                    continue;
                }
                const notUpdatedWires = Object.values(inputWires).filter((w) => !(w as Wire).AllInputsVisited());
                        
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

    beginPlace(componentName : string) {
        if (componentName === "")
            return

        let addComponent : SimulationComponent;
        switch(componentName) {
            case "And":
                addComponent = new ANDGate(1, 0, this.container,1, 2);
                break;
            case "Constant":
                addComponent = new ConstantComponent(0, 0, this.container, 1);
                break;
            case "Not":
                addComponent = new NOTGate(1, 0, this.container, 1)
                break;
            case "Nand":
                addComponent = new NANDGate(1, 0, this.container,1, 2);
                break;
            case "Or":
                console.log("OR gate")
                addComponent = new ORGate(1, 0, this.container, 1, 2);
                break;
            case "XOR":
                addComponent = new XORGate(1, 0, this.container, 1, 2);
                break;
            case "Xnor":
                addComponent = new XNORGate(1, 0, this.container, 1, 2);
                break;
            case "Nor":
                addComponent = new NORGate(1, 0, this.container, 1, 2);
                break;
            case "7 Segment Display":
                addComponent = new HexDisplay(0, 0, this.container);
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

    //Event handlers
    //==========================================================================
    /**
     * On mouse click
     * @param mouseEvent
     * Check for:
     *  1) Hit on simulation component
     *  2) Hit on wiring area
     *  3) Hit with no target
     */

    _onMouseDocumentDown(mouseEvent : InteractionEvent) {
        const pos = mouseEvent.data.global;
        const local = this.container.toLocal(pos);
        //this.simulationState.stage.addChild(new PIXI.Graphics().beginFill(0xff0000).drawRect(localPos.x, localPos.y, 10, 10))
        //let hit = this.interactionManager.hitTest(new PIXI.Point(localPos.x, localPos.y), this.container)
        const wiringAreaHit = this.hitDetector.detectHitWiringArea(local.x, local.y);
        const componentHit = this.hitDetector.detectHitComponent(pos.x, pos.y);
        if (this.simulationState.lockSelectedToCursor) {
            this.simulationState.SelectedComponent.setOpacity(1);
            this.simulationState.SelectedComponent = null;
            this.simulationState.lockSelectedToCursor = false;
            return;
        }   
        if (wiringAreaHit) {
            this.onHitAreaClick(wiringAreaHit);
            return;
        }
        if (componentHit) {
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

    /**
     * On mouse move
     * @param mouseEvent
     * Check for:
     *  1) component drag
     *  2) component place
     *  3) wire drag
     */

    _onMouseMove(mouseEvent : InteractionEvent) {
        const pos = this.container.toLocal(mouseEvent.data.global);
        let dX = 0;
        let dY = 0;

        if (this.lastMouseX == 0 || this.lastMouseY == 0) {
            this.lastMouseX = pos.x;
            this.lastMouseY = pos.y;
            return;
        }

        dX = pos.x - this.lastMouseX;
        dY = pos.y - this.lastMouseY;
        document.body.style.cursor = this.simulationState.mode;

        if (this.simulationState.mode == MouseMode.PAN) {
            this.container.pivot.x += dX / 120;
            this.container.pivot.y += dY / 120;
            this.grid.update();
            return;
        }
        const componentHit = this.hitDetector.detectHitComponent(pos.x, pos.y);
        const wireAreaHit = this.hitDetector.detectHitWiringArea(pos.x, pos.y);
        if (componentHit || wireAreaHit) {
            document.body.style.cursor = "grab";
        }
        if (wireAreaHit) {
            if (this.simulationState.activeWiringArea)
                this.simulationState.activeWiringArea.getGraphic().alpha = 0;
            wireAreaHit.getGraphic().alpha = 1;
            this.simulationState.activeWiringArea = wireAreaHit;
        } else {
            if (this.simulationState.activeWiringArea)
                this.simulationState.activeWiringArea.getGraphic().alpha = 0;
            this.simulationState.activeWiringArea = null;
        }

        if (this.simulationState.isDraggingComponent) {
            const event = new ComponentDragEvent(this.simulationState.SelectedComponent, pos.x, pos.y, dX, dY);
            this.onComponentDrag(event);
        }

        if (this.simulationState.lockSelectedToCursor) {
            this.simulationState.SelectedComponent.setX(pos.x);
            this.simulationState.SelectedComponent.setY(pos.y);
        }

        this.lastMouseX = pos.x;
        this.lastMouseY = pos.y;
    }

    /**
     * Mouse up event
     * @param mouseEvent
     * check for:
     *  1) End wire drag
     *  2) End wire drag at WiringArea
     */

    _onMouseUp(mouseEvent : InteractionEvent) {
        if (this.simulationState.isDragging) {

           if (this.simulationState.activeWiringArea != null) {
               this.onWireEndDragAtWiringArea(this.simulationState.getDraggingWire(), this.simulationState.activeWiringArea);
           }

            this.simulationState.stopDraggingWire();
        }

        this.simulationState.isDraggingComponent = false;        
    }

    /**
     * On scroll
     * @param scrollEvent
     * If mouse inside bounds of canvas, scale grid and simulation elements
     */

    _onScroll(scrollEvent : WheelEvent) {
        if (CustomHitDetector.isInside(scrollEvent.clientX, scrollEvent.clientY,
            this.view.getBoundingClientRect())) {
            let delta = scrollEvent.deltaY;
            if (delta > 0) {
                if (this.container.scale.x > minStageScale) {
                    this.grid.incrememtZoom();
                    this.container.scale.x -= Math.sqrt(delta) / 200;
                    this.container.scale.y -= Math.sqrt(delta) / 200;
                    this.bg.width *= 1 / this.container.scale.x;
                    this.bg.height *= 1 / this.container.scale.x;
                }
            } else {
                if (this.container.scale.x < maxStageScale) {
                    this.grid.decrementZoom();
                    delta = Math.abs(delta);
                    this.container.scale.x += Math.sqrt(delta) / 200;
                    this.container.scale.y += Math.sqrt(delta) / 200;
                    this.bg.width /= 1 / Math.abs(this.container.scale.x);
                    this.bg.height /= 1 / Math.abs(this.container.scale.x);
                }
            }

            this.grid.update();

            this.grid.setXMax(this.bg.width);
            this.grid.setYMax(this.bg.height);
            this.interactionManager.update();
        }

    }

    /**
     * Called by simulation components to add component graphics to simulation
     * I don't want to pass SimulationState or stage to simulation components to reduce
     * coupling
     * @param e
     */

    onSimulationGraphicAdd(e : SimulationAddGraphicEvent) {
        this.container.addChild(e.graphic);
    }

    /**
     * Called by simulation components to add component graphics to simulation
     * I don't want to pass SimulationState or stage to simulation components to reduce
     * coupling
     * @param e
     */

    onSimulationGraphicRemove(e : SimulationAddGraphicEvent) {
        this.container.removeChild(e.graphic);
    }

    onDrag(dragEvent : DragEvent) {

    }

    /**
     * Fires when a WiringArea is clicked
     * @param e
     */

    onHitAreaClick(hitArea : WiringArea) {
        this.simulationState.draggingWireHitArea = this.simulationState.activeWiringArea;
        if (hitArea instanceof ComponentWiringArea) {
            const componentWiringArea = hitArea as ComponentWiringArea;

            const addWire = this.wiringMap.addWire(
                componentWiringArea.getComponent(), componentWiringArea.getLineNumber(),
                componentWiringArea.getX(), componentWiringArea.getY(),
                componentWiringArea.getIsInput());

            if (addWire != null) {
                addWire.setGrid(this.grid);
                addWire.beginPlace(false);
                this.simulationState.setDraggingWire(addWire);
            }
        } else {
            const wireHitArea = hitArea as WireWiringArea;
            wireHitArea.getWire().beginPlace(true);
            this.simulationState.setDraggingWire(wireHitArea.getWire());
        }
    }

    /**
     * Fires when component drag detected
     * @param e
     */

    onComponentDrag(e : ComponentDragEvent) {
        const gridPoint = this.grid.snapToGrid(new PIXI.Point(e.x, e.y));
        e.component.setX(gridPoint.x);
        e.component.setY(gridPoint.y);
    }

    /**
     * Calls when a wire drag finished at a WiringArea
     * @param e
     */

    onWireEndDragAtWiringArea(wire : Wire, wiringArea : WiringArea) {
        if (wiringArea instanceof  ComponentWiringArea) {
            const componentWiringArea = wiringArea as ComponentWiringArea;
            wire.endPlace();
            wire.removeWiringArea();
            wire.connectComponentToTop(wiringArea.getComponent());
            wire.removeWiringArea();
            this.wiringMap.addWireMapping(wiringArea.getComponent(), wiringArea.getIsInput(),
                wiringArea.getLineNumber(), wire);
            wire.anchorToPoint(wiringArea.getX(), wiringArea.getY()
                , true);
        }

    }

    _onKeyDown(ev : KeyboardEvent) {
        if (ev.ctrlKey && ev.key == "p") {
            if (this.simulationState.mode != MouseMode.PAN)
                this.simulationState.mode = MouseMode.PAN;
            else
                this.simulationState.mode = MouseMode.STANDARD

        }

    }
}