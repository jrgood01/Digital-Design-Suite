//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import React from "react";
import {ComponentPropertyNumberFieldModel} from "../FieldModels/ComponentPropertyNumberFieldModel";

interface PropertyWindowNumberFieldComponentProps {
    target : ComponentPropertyNumberFieldModel;
}

export const NumberFieldComponent = (props : PropertyWindowNumberFieldComponentProps) => {
    const [linkedVal, setLinkedVal] = React.useState(props.target.getValue());
    props.target.setOnComponentValueChanged((newVal : number) => {
        setLinkedVal(newVal.toString());
    })
    return (
        <div style={{width : "100%"}}>
            <h1>
                {props.target.getTitle()}
            </h1>
            <input type={"text"} value={linkedVal} onBlur={(e : any) => {console.log(e)}}/>
        </div>
    )
}