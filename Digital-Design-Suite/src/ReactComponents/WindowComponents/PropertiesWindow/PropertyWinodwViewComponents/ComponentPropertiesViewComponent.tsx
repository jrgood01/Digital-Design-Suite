//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import React from "react";
import {ComponentPropertyView} from "../../../../ComponentProperties/ComponentPropertyView/ComponentPropertyView";
import {NumberFieldComponent} from "../FieldComponents/NumberFieldComponent";

interface ComponentPropertiesViewComponentProps {
    target : ComponentPropertyView;
}

export const ComponentPropertiesViewComponent = (props : ComponentPropertiesViewComponentProps) => {

    return (
        <div>
            <NumberFieldComponent target={props.target.getXField()}/>
            <NumberFieldComponent target={props.target.getYField()}/>
        </div>
    );
}