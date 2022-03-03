import {SimulationComponent} from "../../SimulationComponent/SimulationComponent";
import {Gate} from "../../SimulationComponent/Gates/Logic/Gate";
import {ComponentPropertyView} from "../ComponentPropertyView/ComponentPropertyView";
import React from "react";
import {
    ComponentPropertiesViewComponent
} from "../../ReactComponents/WindowComponents/PropertiesWindow/PropertyWinodwViewComponents/ComponentPropertiesViewComponent";
import {ComponentProperty} from "../ComponentProperty";
interface ComponentPropertyViewFactoryProps {
    selectedComponent : SimulationComponent;
}
export const ComponentPropertyViewFactory = (props : ComponentPropertyViewFactoryProps) => {
    if (props.selectedComponent instanceof Gate) {
        const addTarget = new ComponentPropertyView(props.selectedComponent);
        return (
            <ComponentPropertiesViewComponent target={addTarget}/>
        )
    } else {
        return (
            <div>

            </div>
        )
    }
}