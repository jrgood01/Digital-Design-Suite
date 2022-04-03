import React from "react";
import {SingleBitWidthPropertiesModel} from "../ComponentPropertyModels/SingleBitWidthPropertiesModel";
import {ComponentPropertiesViewComponent} from "./ComponentPropertiesViewComponent";
import {NumberFieldComponent} from "../../PropertyFields/FieldViews/NumberFieldComponent";

interface SingleBitWidthPropertiesViewComponentProps {
    target : SingleBitWidthPropertiesModel;
}

export const SingleBitWidthPropertiesViewComponent = (props : SingleBitWidthPropertiesViewComponentProps) => {
    return (
        <React.Fragment>
            <NumberFieldComponent target={props.target.getBitWidthField()}/>
        </React.Fragment>

    )
}