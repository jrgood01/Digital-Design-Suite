import React from "react";
import {ConstantComponentPropertyModel} from "../ComponentPropertyModels/ConstantComponentPropertyModel";
import {NumberFieldComponent} from "../../PropertyFields/FieldViews/NumberFieldComponent";

interface ConstantComponentPropertyViewProps {
    target : ConstantComponentPropertyModel;
}

export const ConstantComponentPropertyView = (props : ConstantComponentPropertyViewProps) => {
    return (
        <React.Fragment>
            <NumberFieldComponent target={props.target.getConstValueField()}/>
        </React.Fragment>
    )
}