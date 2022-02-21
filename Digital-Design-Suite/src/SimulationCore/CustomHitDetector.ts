import {SimulationComponent} from "./SimulationComponent/SimulationComponent";
import {WiringArea} from "./SimulationComponent/WiringArea";

/**
 * Custom hit detector. I had to make this because PIXI.js does not handle
 * interactions witth zooming and panning well at the moment.
 */
export class CustomHitDetector {
    private simulationComponents : Array<SimulationComponent>;
    constructor() {

    }

    setSimulationComponentArray(simulationComponents : Array<SimulationComponent>) {
        this.simulationComponents = simulationComponents;
    }

    /**
     * Detects if mouse is over wiring area
     * @param x x location of mouse
     * @param y y location of mouse
     */
    detectHitWiringArea(x : number, y: number) : WiringArea{
        let retVal = null;
        this.simulationComponents.forEach((component : SimulationComponent) => {
            component.wiringAreas.forEach((val: Map<Number, WiringArea>) => {
                val.forEach((val: WiringArea) => {
                    console.log(x, y, val.graphic.hitArea)
                    if (val.graphic.hitArea.contains(x, y)) {
                        retVal = val;
                    }
                })
            })
        });

        return retVal;
    }

    /**
     * Detects if mouse is over simulation component
     * @param x x location of mouse
     * @param y y location of mouse
     */
    detectHitComponent(x : number, y : number) : SimulationComponent {
        console.log("R")

        for (let c of this.simulationComponents) {
            if (c.componentTemplate.hitArea.contains(x, y)) {
                console.log(c)
                console.log("point hit detect component")
                return c;

            }
        }

        return null;
    }

    /**
     * Detects if x and y coordinates are inside bounding rectangle
     * @param x x location
     * @param y y location
     * @param rect bounding rectangle
     */
    static isInside(x : number, y : number, rect : DOMRect) {
        return (x >= rect.x && x <= rect.x + rect.width
            && y >= rect.y && rect.y <= rect.y + rect.height)
    }
}