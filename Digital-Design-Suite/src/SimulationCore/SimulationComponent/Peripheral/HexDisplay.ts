//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

//Will finish later

import * as constants from "../../../constants"
import * as PIXI from 'pixi.js'
import { SimulationComponent } from "../SimulationComponent";

export class HexDisplay extends SimulationComponent {
    private segments = Array<boolean>();
    private width = 450;
    private height = 600;
    constructor(x : number, y : number, stage : PIXI.Container) {
        super(7, 0, Array(7).fill(1), Array(0).fill(0), stage);
        this.segments = new Array(7).fill(false);
        this.segments[0] = true;
        this.segments[3] = true;
        this.segments[2] = true;
        this.segments[4] = true;
        this.segments[5] = true;
        this.x = x;
        this.y = y;
        this.geometry = this.calculateGeometry(1);
    }

    calculateGeometry(scaler : number) {
        let retMap = {} as Record <string, number>
        retMap['componentWidth'] = 450 * scaler;
        retMap['componentHeight'] = 600 * scaler;

        retMap['cornerTopX'] = this.x;
        retMap['cornerTopY'] = this.y;

        retMap['lineWidth'] = 25 * scaler;

        retMap['segmentAreaPaddingL'] = 30 * scaler;
        retMap['segmentAreaPaddingTB'] = 50 * scaler;
        retMap['segmentAreaPaddingR'] = 80 * scaler;    

        retMap['segment1StartX'] = this.x + retMap['segmentAreaPaddingL']
        retMap['segment1StartY'] = this.y + retMap['segmentAreaPaddingTB']
        retMap['segment1EndX'] = this.x + (retMap['componentWidth'] 
            - retMap['segmentAreaPaddingR'])
        retMap['segment1EndY'] = retMap['segment1StartY'];

        retMap['segment2StartX'] = retMap['segment1StartX'] + 15;
        
        
        
        return retMap;
    }

    simulate() {

    }

    draw() {
        this.componentTemplate.clear();
        this.componentTemplate.lineStyle(7, constants.General.componentColorStandard)
            .drawRect(this.geometry['cornerTopX'], this.geometry['cornerTopY'],
                this.geometry['componentWidth'], this.geometry['componentHeight']);
        this.componentTemplate.lineStyle(this.geometry['lineWidth'], this.segments[0] ? 0xff2222 : 0x222222)
            .moveTo(this.geometry['segment1StartX'], this.geometry['segment1StartY'])
            .lineTo(this.geometry['segment1EndX'], this.geometry['segment1EndY'])

        this.componentTemplate.lineStyle(25, this.segments[1] ? 0xff2222 : 0x222222)
            .moveTo(this.geometry['segment2StartX'], this.y + 80)
            .lineTo(this.x + 45, this.y + 250)

        this.componentTemplate.lineStyle(25, this.segments[2] ? 0xff2222 : 0x222222)
            .moveTo(this.x + 70, this.y + 280)
            .lineTo(this.x + 330, this.y + 280)

        this.componentTemplate.lineStyle(25, this.segments[3] ? 0xff2222 : 0x222222)
            .moveTo(this.x + 355, this.y + 80)
            .lineTo(this.x + 355, this.y + 250)

        this.componentTemplate.lineStyle(25, this.segments[4] ? 0xff2222 : 0x222222)
            .moveTo(this.x + 45, this.y + 315)
            .lineTo(this.x + 45, this.y + 515)
        this.componentTemplate.lineStyle(25, this.segments[5] ? 0xff2222 : 0x222222)
            .moveTo(this.x + 30, this.y + 545)
            .lineTo(this.x + 370, this.y + 545)

        this.componentTemplate.lineStyle(25, this.segments[6] ? 0xff2222 : 0x222222)
            .moveTo(this.x + 355, this.y + 315)
            .lineTo(this.x + 355, this.y + 515)

        this.componentTemplate.lineStyle(25, this.segments[7] ? 0xff2222 : 0x222222)
            .drawRect(this.x + 410, this.y + 545, 1, 1)
        
        this.componentTemplate.lineStyle(20, constants.General.componentColorStandard)
            .drawCircle(this.x + 120, this.y + 20, 2);

        this.componentTemplate.lineStyle(20, constants.General.componentColorStandard)
            .drawCircle(this.x + 175, this.y + 20, 2);

        this.componentTemplate.lineStyle(20, constants.General.componentColorStandard)
            .drawCircle(this.x + 230, this.y + 20, 2);

        this.componentTemplate.lineStyle(20, constants.General.componentColorStandard)
            .drawCircle(this.x + 285, this.y + 20, 2);


        this.componentTemplate.lineStyle(20, constants.General.componentColorStandard)
            .drawCircle(this.x + 120, this.y + 575, 2);

        this.componentTemplate.lineStyle(20, constants.General.componentColorStandard)
            .drawCircle(this.x + 175, this.y + 575, 2);

        this.componentTemplate.lineStyle(20, constants.General.componentColorStandard)
            .drawCircle(this.x + 230, this.y + 575, 2);

        this.componentTemplate.lineStyle(20, constants.General.componentColorStandard)
            .drawCircle(this.x + 285, this.y + 575, 2);
        this.updateHitArea();
    }
}