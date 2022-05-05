//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import React, {ChangeEvent, useEffect} from "react";
import {ComponentPropertyNumberFieldModel} from "../FieldModels/ComponentPropertyNumberFieldModel";

interface PropertyWindowNumberFieldComponentProps {
    target : ComponentPropertyNumberFieldModel;
}

const h1Style = {
    fontFamily : "lato",
    color : "#aaaabb",
    fontSize : "12px"
}

export const NumberFieldComponent = (props : PropertyWindowNumberFieldComponentProps) => {
    const [linkedVal, setLinkedVal] = React.useState(props.target.valueToString());
    props.target.setOnComponentValueChanged((newVal : number) => {
        setLinkedVal(newVal.toString());
    })
    useEffect(() => {setLinkedVal(props.target.valueToString())}, [props])
    return (
        <div style={{width : "100%"}}>
            <h1 style={h1Style}>
                {props.target.getTitle()}
            </h1>
            <input style={
                {
                    backgroundColor : "#333333"
                }
            } type={"text"} value={linkedVal}
                   onChange={(e : ChangeEvent<HTMLInputElement>) => {
                       setLinkedVal(e.target.value)
                   }}
                   onBlur={(e : any) => {
                       props.target.setLinkedVal(e.target.value);
                   }}/>
        </div>
    )
}