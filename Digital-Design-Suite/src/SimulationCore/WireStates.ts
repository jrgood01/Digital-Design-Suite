//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022
import * as constants from "../constants"

export enum wireState {
    High = constants.General.componentColorHigh,
    Low = constants.General.componentColorLow,
    Float = constants.General.componentColorStandard,
    Error = constants.General.componentColorError,
}