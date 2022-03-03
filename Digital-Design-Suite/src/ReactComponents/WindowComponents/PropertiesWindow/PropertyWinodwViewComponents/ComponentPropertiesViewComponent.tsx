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