//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import * as PIXI from 'pixi.js'
import * as constants from "../../../constants"
import { SimulationState } from '../../SimulationState';
import { wireState } from '../../WireStates';
import {SimulationComponent} from "../SimulationComponent"
import { GlowFilter } from '@pixi/filter-glow';
import { Heading } from '../../../Heading';
export enum TransistorType {
    NPN,
    PNP
}

export class Transistor extends SimulationComponent {
    type : TransistorType;

    constructor(x : number, y : number, container : PIXI.Container) {
        super(x, y, container, 2, 1, Array<number>(2).fill(1), Array<number>(1).fill(1));

        this.x = x;
        this.y = y;
        
        this.geometry = this.calculateGeometry(1);
        this.addWiringArea(this.geometry['emitterConnectorWireFinalX'] - 4, this.geometry['emitterConnectorWireFinalY'] - 7, 
            0, false, Heading.North);

        this.addWiringArea(this.geometry['collectorConnectorWireFinalX'] - 4, this.geometry['collectorConnectorWireFinalY'], 
            0, true, Heading.South);
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

    calculateGeometry(scaler : number) {
        let retMap = {} as Record<string, number>;

        retMap['centerX'] = this.x;
        retMap['centerY'] = this.y;
        retMap['circleRadius'] = scaler * 100;
        retMap['circuleWidth'] = scaler * 10;
        retMap['connectorLineWidth'] = scaler * 13;
        retMap['connectorLineLength'] = scaler * 100;
        retMap['connectorLineToCenterLength'] = scaler * 50

        //=================================================
        retMap['baseWireWidth'] = scaler * 7;
        retMap['baseWireLength'] = scaler * 105;
        retMap['baseWireStartX'] = retMap['centerX'] - retMap['connectorLineToCenterLength'];
        retMap['baseWireStartY'] = retMap['centerY'];
        retMap['baseWireFinalX'] = retMap['baseWireStartX'] - retMap['baseWireLength'];
        retMap['baseWireFinalY'] = retMap['centerY'];
        retMap['collectorEmitterOffsetTop'] = scaler * 25;
        retMap['collectorEmitterstartYOffset'] = scaler * 20;
        retMap['collectorEmitterOffsetFinalX'] = scaler * 20; 

        //=================================================
        retMap['collectorWireWidth'] = scaler * 7;
        retMap['collectorWireStartX'] = retMap['centerX'] 
            - retMap['connectorLineToCenterLength'];

        retMap['collectorWireStartY'] = retMap['centerY'] 
            - retMap['collectorEmitterstartYOffset'];

        retMap['collectorWireFinalX'] = retMap['centerX'] 
            + retMap['collectorEmitterOffsetFinalX'];

        retMap['collectorWireFinalY'] = retMap['centerY'] 
            - retMap['circleRadius'] 
            + retMap['collectorEmitterOffsetTop'];


        //=================================================
        retMap['emitterWireWidth'] = scaler * 7;
        retMap['emitterWireStartX'] = retMap['centerX'] 
            - retMap['connectorLineToCenterLength'];

        retMap['emitterWireStartY'] = retMap['centerY'] 
            + retMap['collectorEmitterstartYOffset'];

        retMap['emitterWireFinalX']= retMap['centerX'] 
            + retMap['collectorEmitterOffsetFinalX'];

        retMap['emitterWireFinalY'] = retMap['centerY'] 
            + retMap['circleRadius'] 
            - retMap['collectorEmitterOffsetTop'];

        retMap['connectorWireLengths'] = scaler * 80;

        //=================================================
        retMap['collectorConnectorWireWidth'] = scaler * 7;
        retMap['collectorConnectorWireStartX'] = retMap['collectorWireFinalX'];
        retMap['collectorConnectorWireStartY'] = retMap['collectorWireFinalY'];
        retMap['collectorConnectorWireFinalX'] = retMap['collectorWireFinalX'];
        retMap['collectorConnectorWireFinalY'] = retMap['collectorWireFinalY'] 
            - retMap['connectorWireLengths'];


        //=================================================
        retMap['emitterConnectorWireWidth'] = scaler * 7;
        retMap['emitterConnectorWireStartX'] = retMap['emitterWireFinalX'];
        retMap['emitterConnectorWireStartY'] = retMap['emitterWireFinalY'];
        retMap['emitterConnectorWireFinalX'] = retMap['emitterWireFinalX'];
        retMap['emitterConnectorWireFinalY'] = retMap['emitterWireFinalY'] 
            + retMap['connectorWireLengths'];
            
        return retMap;
    }


    draw() {
        this.componentTemplate.clear();
        let standard = constants.General.componentColorStandard;
        let colors = {
            baseConnector : this.selected ? constants.General.selectedColor : this.getBase(),
            collectorConnector : this.selected ? constants.General.selectedColor : standard, //this.getCollector(),
            emitterConnector : this.selected ? constants.General.selectedColor :this.getEmitter(),

            base : this.selected ? constants.General.selectedColor : standard,
            collector : this.selected ? constants.General.selectedColor : this.getCollector(),
            emitter : this.selected ? constants.General.selectedColor : standard,

            circle : this.selected ? constants.General.selectedColor : this.getCollector()
        }


        this.componentTemplate.lineStyle(this.geometry['circuleWidth'], colors.circle);
        this.componentTemplate.drawCircle(this.geometry['centerX'], 
            this.geometry['centerY'], this.geometry['circleRadius']);

        this.componentTemplate.lineStyle(this.geometry['baseWireWidth'], colors.baseConnector)
            .moveTo(this.geometry['baseWireStartX'], this.geometry['baseWireStartY'])
            .lineTo(this.geometry['baseWireFinalX'], this.geometry['baseWireFinalY']);

        this.componentTemplate.lineStyle(this.geometry['collectorWireWidth'], colors.collector)
            .moveTo(this.geometry['collectorWireStartX'], this.geometry['collectorWireStartY'])
            .lineTo(this.geometry['collectorWireFinalX'], this.geometry['collectorWireFinalY']);


        this.componentTemplate.lineStyle(this.geometry['emitterWireWidth'], colors.emitter)
            .moveTo(this.geometry['emitterWireStartX'], this.geometry['emitterWireStartY'])
            .lineTo(this.geometry['emitterWireFinalX'], this.geometry['emitterWireFinalY']);


        this.componentTemplate.lineStyle(this.geometry['collectorConnectorWireWidth'], 
            colors.collectorConnector)
            .moveTo(this.geometry['collectorConnectorWireStartX'], this.geometry['collectorConnectorWireStartY'])
            .lineTo(this.geometry['collectorConnectorWireFinalX'], this.geometry['collectorConnectorWireFinalY']);

        this.componentTemplate.lineStyle(this.geometry['emitterConnectorWireWidth'], colors.emitterConnector)
            .moveTo(this.geometry['emitterConnectorWireStartX'], this.geometry['emitterConnectorWireStartY'])
            .lineTo(this.geometry['emitterConnectorWireFinalX'], this.geometry['emitterConnectorWireFinalY']);

        this.componentTemplate.lineStyle(this.geometry['connectorLineWidth'], colors.base)
            .moveTo(this.geometry['centerX'] - this.geometry['connectorLineToCenterLength'], 
                this.geometry['centerY'] - (this.geometry['connectorLineLength'] / 2))
            .lineTo(this.geometry['centerX'] - this.geometry['connectorLineToCenterLength'], 
                this.geometry['centerY'] + (this.geometry['connectorLineLength'] / 2));
        this.updateHitArea();

        if (this.wiringAreas.get(false).size > 0 || this.wiringAreas.get(true).size > 0) {
         //   this.componentTemplate.filters = [new GlowFilter({distance : 20, outerStrength: 2, color : 0x3333FF})]
        } else {
          //  this.componentTemplate.filters = []
        }
    }
}