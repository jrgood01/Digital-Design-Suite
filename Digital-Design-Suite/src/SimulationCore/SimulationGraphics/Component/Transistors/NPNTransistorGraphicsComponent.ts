//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022


import * as PIXI from 'pixi.js'
import { SimulationGraphicsComponent } from "../SimulationGraphicComponent";
import { NPNTransistor } from "../../../SimulationComponent/Transistors/NPNTransistor"
export class NPNTransistorGraphicsComponent extends SimulationGraphicsComponent {

    constructor(stage : PIXI.Container) {
        super(stage, 0, 0);
        this.component = new NPNTransistor();
    }

    draw() {
        let standard = 0xAAAAAA;
        let colors = {
            baseConnector : standard,
            collectorConnector : standard,
            emitterConnector : standard,

            base : standard,
            collector : standard,
            emitter : standard,

            circle : standard
        }

        let centerX = 600;
        let centerY = 400;
        let scaler = .5;

        let circleRadius = scaler * 100;
        let circuleWidth = scaler * 10;
        this.componentTemplate.lineStyle(circuleWidth, colors.circle);
        this.componentTemplate.drawCircle(centerX, centerY, circleRadius);

        let connectorLineWidth = scaler * 13;
        let connectorLineLength = scaler * 100;
        let connectorLineToCenterLength = scaler * 50
        this.componentTemplate.lineStyle(connectorLineWidth, colors.base)
            .moveTo(centerX - connectorLineToCenterLength, centerY - (connectorLineLength / 2))
            .lineTo(centerX - connectorLineToCenterLength, centerY + (connectorLineLength / 2));


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
    }
}