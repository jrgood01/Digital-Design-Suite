import React from "react";
import {DockableWindow} from "../DockableWindow";
import {SimulationComponent} from "../../../SimulationComponent/SimulationComponent";
import {ComponentPropertyViewFactory} from "../../../ComponentProperties/Factory/ComponentPropertyViewFactory";

interface PropertiesWindowProps {
    selectedComponent : SimulationComponent;
}

export const PropertiesWindow = (props : PropertiesWindowProps) => {
    return (
        <DockableWindow title={"Properties"} assignedId={"4"} width={400} height={1000} startX={3040} startY={35}>
            <ComponentPropertyViewFactory selectedComponent={props.selectedComponent}/>
        </DockableWindow>
    )
}