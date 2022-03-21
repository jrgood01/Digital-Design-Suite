//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import React from "react";
import {ComponentPropertyModel} from "../ComponentPropertyModels/ComponentPropertyModel";
import {NumberFieldComponent} from "../../PropertyFields/FieldViews/NumberFieldComponent";

interface ComponentPropertiesViewComponentProps {
    target : ComponentPropertyModel;
}

export const ComponentPropertiesViewComponent = (props : ComponentPropertiesViewComponentProps) => {

    return (
        <React.Fragment>
            <NumberFieldComponent target={props.target.getXField()}/>
            <NumberFieldComponent target={props.target.getYField()}/>
        </React.Fragment>
    );
}