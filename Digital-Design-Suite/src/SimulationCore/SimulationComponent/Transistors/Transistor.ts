//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import * as PIXI from 'pixi.js'
import * as constants from "../../../constants"
import { SimulationState } from '../../SimulationState';
import { wireState } from '../../WireStates';
import {SimulationComponent} from "../SimulationComponent"

export enum TransistorType {
    NPN,
    PNP
}

export class Transistor extends SimulationComponent {
    type : TransistorType;

    constructor(stage : PIXI.Container, x : number, y : number, simulationState : SimulationState) {
        super(2, 1, Array<number>(2).fill(1), Array<number>(1).fill(1), stage);
        this.input.setLineBit(0, 0, wireState.Float);
        this.input.setLineBit(0, 1, wireState.Float);
        this.simulationState = simulationState;
        this.x = x;
        this.y = y;
    }

    simulate() {
        let collector = this.input.getLineBit(0, 0);
        let base = this.input.getLineBit(1, 0);
        let emitterHigh = collector == wireState.High && base == wireState.High;
        if (emitterHigh) {
            this.output.setLineBit(0, 0, wireState.High);
        } else if (base == wireState.Error || collector == wireState.Error ||
                    base == wireState.Float || collector == wireState.Float) {
            this.output.setLineBit(0, 0, wireState.Error);
        } else {
            this.output.setLineBit(0, 0, wireState.Low);
        }

    }

    getCollector() {
        return this.input.getLineBit(0, 0);
    }

    getBase() {
        return this.input.getLineBit(1, 0);
    }

    getEmitter() {
        return this.output.getLineBit(0, 0);
    }

    draw() {
        this.componentTemplate.clear();
        let standard = constants.General.componentColorStandard;
        let colors = {
            baseConnector : this.selected ? constants.General.selectedColor : this.getBase(),
            collectorConnector : this.selected ? constants.General.selectedColor : this.getCollector(), //this.getCollector(),
            emitterConnector : this.selected ? constants.General.selectedColor :this.getEmitter(),

            base : this.selected ? constants.General.selectedColor : standard,
            collector : this.selected ? constants.General.selectedColor : this.getCollector(),
            emitter : this.selected ? constants.General.selectedColor : this.getEmitter(),

            circle : this.selected ? constants.General.selectedColor : this.getCollector()
        }


        let centerX = this.x;
        let centerY = this.y;
        let scaler = 1;

        let circleRadius = scaler * 100;
        let circuleWidth = scaler * 10;
        this.componentTemplate.lineStyle(circuleWidth, colors.circle);
        this.componentTemplate.drawCircle(centerX, centerY, circleRadius);

        let connectorLineWidth = scaler * 13;
        let connectorLineLength = scaler * 100;
        let connectorLineToCenterLength = scaler * 50

        let baseWireWidth = scaler * 7;
        let baseWireLength = scaler * 105;
        let baseWireStartX = centerX - connectorLineToCenterLength;
        let baseWireStartY = centerY;
        let baseWireFinalX = baseWireStartX - baseWireLength;
        let baseWireFinalY = centerY;
        this.componentTemplate.lineStyle(baseWireWidth, colors.baseConnector)
            .moveTo(baseWireStartX, baseWireStartY)
            .lineTo(baseWireFinalX, baseWireFinalY);

        let collectorEmitterOffsetTop = scaler * 25;
        let collectorEmitterstartYOffset = scaler * 20;
        let collectorEmitterOffsetFinalX = scaler * 20; 

        let collectorWireWidth = scaler * 7;
        let collectorWireStartX = centerX - connectorLineToCenterLength;
        let collectorWireStartY = centerY - collectorEmitterstartYOffset;
        let collectorWireFinalX = centerX + collectorEmitterOffsetFinalX;
        let collectorWireFinalY = centerY - circleRadius + collectorEmitterOffsetTop;
        this.componentTemplate.lineStyle(collectorWireWidth,colors.collector)
            .moveTo(collectorWireStartX, collectorWireStartY)
            .lineTo(collectorWireFinalX, collectorWireFinalY);

        let emitterWireWidth = scaler * 7;
        let emitterWireStartX = centerX - connectorLineToCenterLength;
        let emitterWireStartY = centerY + collectorEmitterstartYOffset;
        let emitterWireFinalX = centerX + collectorEmitterOffsetFinalX;
        let emitterWireFinalY = centerY + circleRadius - collectorEmitterOffsetTop;
        this.componentTemplate.lineStyle(emitterWireWidth, colors.emitter)
            .moveTo(emitterWireStartX, emitterWireStartY)
            .lineTo(emitterWireFinalX, emitterWireFinalY);

        let connectorWireLengths = scaler * 80;

        let collectorConnectorWireWidth = scaler * 7;
        let collectorConnectorWireStartX = collectorWireFinalX;
        let collectorConnectorWireStartY = collectorWireFinalY;
        let collectorConnectorWireFinalX = collectorWireFinalX;
        let collectorConnectorWireFinalY = collectorWireFinalY - connectorWireLengths;
        this.componentTemplate.lineStyle(collectorConnectorWireWidth, colors.collectorConnector)
            .moveTo(collectorConnectorWireStartX, collectorConnectorWireStartY)
            .lineTo(collectorConnectorWireFinalX, collectorConnectorWireFinalY);

        let emitterConnectorWireWidth = scaler * 7;
        let emitterConnectorWireStartX = emitterWireFinalX;
        let emitterConnectorWireStartY = emitterWireFinalY;
        let emitterConnectorWireFinalX = emitterWireFinalX;
        let emitterConnectorWireFinalY = emitterWireFinalY + connectorWireLengths;

        this.componentTemplate.lineStyle(emitterConnectorWireWidth, colors.emitterConnector)
            .moveTo(emitterConnectorWireStartX, emitterConnectorWireStartY)
            .lineTo(emitterConnectorWireFinalX, emitterConnectorWireFinalY);

        this.componentTemplate.lineStyle(connectorLineWidth, colors.base)
            .moveTo(centerX - connectorLineToCenterLength, centerY - (connectorLineLength / 2))
            .lineTo(centerX - connectorLineToCenterLength, centerY + (connectorLineLength / 2));

        this.updateHitArea();
    }
}