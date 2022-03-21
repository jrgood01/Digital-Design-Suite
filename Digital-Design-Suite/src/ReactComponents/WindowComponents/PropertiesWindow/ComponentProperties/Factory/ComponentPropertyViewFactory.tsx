import {SimulationComponent} from "../../../../../SimulationCore/SimulationComponent/SimulationComponent";
import {ComponentPropertyModel} from "../ComponentPropertyModels/ComponentPropertyModel";
import React from "react";
import {
    ComponentPropertiesViewComponent
} from "../ComponentPropertyViews/ComponentPropertiesViewComponent";

import {SingleBitWidthPropertiesViewComponent} from "../ComponentPropertyViews/SingleBitWidthPropertiesViewComponent";
import {SingleBitWidthPropertiesModel} from "../ComponentPropertyModels/SingleBitWidthPropertiesModel";
interface ComponentPropertyViewFactoryProps {
    selectedComponent : SimulationComponent;
}

const isSingleBitWidthComponent = (component : SimulationComponent) => {
    let cmp : any = component as any
    return "getBitWidth" in cmp && "setBitWidth" in cmp;
}

export const ComponentPropertyViewFactory = (props : ComponentPropertyViewFactoryProps) => {
    if (props.selectedComponent == undefined) {
        return(
            <div>

            </div>
        )
    }
    if (isSingleBitWidthComponent(props.selectedComponent)) {
        const addTarget = new SingleBitWidthPropertiesModel(props.selectedComponent);
        return (
            <SingleBitWidthPropertiesViewComponent target={addTarget}/>
        )
    } else {
        const addTarget = new ComponentPropertyModel(props.selectedComponent);
        return (
            <ComponentPropertiesViewComponent target={addTarget}/>
        )
    }
}