//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import * as PIXI from 'pixi.js'
import { SimulationState } from "./SimulationState";
import { SimulationComponent } from "./SimulationComponent/SimulationComponent"
import { InteractionEvent, InteractionManager } from 'pixi.js';
import { HitAreaClickEvent } from "./SimulationEvents/HitAreaClickEvent"
import { WiringArea } from "./SimulationComponent/WiringArea"
import { ComponentEvent } from './SimulationEvents/ComponentEvent';
import { ComponentDragEvent } from './SimulationEvents/ComponentDragEvent';
import { WireEndDragAtWiringAreaEvent } from './SimulationEvents/WireEndDragAtWiringAreaEvent';

export class SimulationWarden {
    state : SimulationState;
    componentsLocked : boolean;
    private isDraggingWire : boolean;
    private interactionManager : InteractionManager;

    private onHitAreaClick : Array<(e : HitAreaClickEvent) => void>;
    private onComponentSelect : Array<(e : ComponentEvent) => void>;
    private onComponentDiselect : Array<(e : ComponentEvent) => void>;
    private onComponentDrag : Array<(e : ComponentDragEvent) => void>;
    private onWireEndDragAtWiringAreaEvent : Array<(e : WireEndDragAtWiringAreaEvent) => void>;

    private lastMouseX : number;
    private lastMouseY : number;
    private simulationPaused : boolean;

    constructor(state : SimulationState, renderer : PIXI.AbstractRenderer) {
        console.debug("========Simulation Warden Log========")
        this._onMouseDocumentDown = this._onMouseDocumentDown.bind(this);
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onMouseUp = this._onMouseUp.bind(this);

        this.interactionManager = new InteractionManager(renderer);
        this.isDraggingWire = false;
        this.state = state;

        this.state.stage.on("pointerdown", this._onMouseDocumentDown);
        this.state.stage.on("pointermove", this._onMouseMove);
        this.state.stage.on("pointerup", this._onMouseUp);

        this.onHitAreaClick = new Array<(e : HitAreaClickEvent) => void>();
        this.onComponentSelect = new Array<(e : ComponentEvent) => void>();
        this.onComponentDiselect = new Array<(e : ComponentEvent) => void>();
        this.onComponentDrag = new Array<(e : ComponentDragEvent) => void>();
        this.onWireEndDragAtWiringAreaEvent = new Array<(e : WireEndDragAtWiringAreaEvent) => void>();

        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.simulationPaused = false;
    }

    addOnHitAreaClick(handler : (e : HitAreaClickEvent) => void) {
        this.onHitAreaClick.push(handler);
    }

    addOnComponentSelected(handler : (e : ComponentEvent) => void) {
        this.onComponentSelect.push(handler);
    }

    addOnComponentDiselected(handler : (e : ComponentEvent) => void) {
        this.onComponentDiselect.push(handler);
    }

    addOnComponentDrag(handler : (e : ComponentDragEvent) => void) {
        this.onComponentDrag.push(handler);
    }

    addOnWireEndDragAtWiringAreaEvent(handler : (e : WireEndDragAtWiringAreaEvent) => void) {
        this.onWireEndDragAtWiringAreaEvent.push(handler);
    }

    addComponentToStage(component : SimulationComponent) {
        console.debug("Added component: ", component)

    }

    requestPermissionToTranslate(bounds : PIXI.Rectangle, dX : number, dY : number) {
        if (this.componentsLocked) {
            console.debug("Request to translat denied: components are locked");
            return false;
        }
    }

    requestPermissionToRunSimulation() {
        return !this.simulationPaused;
    }

    pauseSimulation() {
        console.debug("Simulation paused")
    }

    runSimulation() {
        console.debug("Simulation started");
    }

    lockComponents() {
        console.debug("Components locked")
    }

    _onMouseDocumentDown(mouseEvent : InteractionEvent) {
        let pos = mouseEvent.data.global;
        let hit = this.interactionManager.hitTest(new PIXI.Point(pos.x, pos.y), this.state.stage)
        
        this.state.components.forEach((component : SimulationComponent) => {
            component.wiringAreas.forEach((val : Map<Number, WiringArea>) => {
                val.forEach((val : WiringArea) => {
                    if (val.graphic == hit) {
                        let event = new HitAreaClickEvent(component, val)
                        this.onHitAreaClick.forEach((handler : (e : HitAreaClickEvent) => void) => {
                            handler(event);
                        });
                    }
                });
            })
        
            if (component.componentTemplate == hit) {
                component.selected = true;
                this.state.isDraggingComponent = true;
                this.state.stateChanged = true;
                this.state.SelectedComponent = component;
                this.state.stateChanged = true;

                this.onComponentSelect.forEach((handler : (e : ComponentEvent) => void) => {
                    handler(new ComponentEvent(component));
                });

                return;
            } else {
                
                if (component.selected) {
                    this.onComponentDiselect.forEach((handler : (e : ComponentEvent) => void) => {
                        handler(new ComponentEvent(component));
                    });

                    component.selected = false;
                }
            }
        })
    }

    _onMouseMove(mouseEvent : InteractionEvent) {
        let pos = mouseEvent.data.global;
        let dX = 0;
        let dY = 0;

        if (this.lastMouseX == 0 || this.lastMouseY == 0) {
            this.lastMouseX = pos.x;
            this.lastMouseY = pos.y;
            return;
        }

        dX = pos.x - this.lastMouseX;
        dY = pos.y - this.lastMouseY;
        if (this.state.isDraggingComponent) {
            this.onComponentDrag.forEach((handler : (e : ComponentDragEvent) => void) => {
                handler(new ComponentDragEvent(this.state.SelectedComponent, pos.x, pos.y, dX, dY));
            });
        }

        if (this.state.getIsDraggingWire) {

        }

        this.lastMouseX = pos.x;
        this.lastMouseY = pos.y;
    }

    _onMouseUp(mouseEvent : InteractionEvent) {
        let pos = mouseEvent.data.global;

        if (this.state.isDragging) {

           if (this.state.activeWiringArea != null) {
                this.onWireEndDragAtWiringAreaEvent.forEach((handler : (e : WireEndDragAtWiringAreaEvent) => void) => {
                    handler(new WireEndDragAtWiringAreaEvent(this.state.getDraggingWire(), this.state.activeWiringArea.component,
                    this.state.activeWiringArea, pos.x, pos.y));
                })               
           }

            this.state.stopDraggingWire();
        }

        this.state.isDraggingComponent = false;        
    }

}