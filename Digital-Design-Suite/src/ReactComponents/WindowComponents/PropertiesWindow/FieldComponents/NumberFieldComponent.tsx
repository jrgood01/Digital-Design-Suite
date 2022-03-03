import React from "react";
import {ComponentPropertyNumberField} from "../../../../ComponentProperties/FieldTypes/ComponentPropertyNumberField";

interface PropertyWindowNumberFieldComponentProps {
    target : ComponentPropertyNumberField;
}

export const NumberFieldComponent = (props : PropertyWindowNumberFieldComponentProps) => {
    const [linkedVal, setLinkedVal] = React.useState(props.target.getValue());
    props.target.setOnValueChanged((newVal : number) => {
        setLinkedVal(newVal.toString());
        console.log(newVal)
    })
    return (
        <div style={{width : "100%"}}>
            <h1>
                {props.target.getTitle()}
            </h1>
            <input type={"text"} value={linkedVal} onChange={props.target.onInputChange}/>
        </div>
    )
}