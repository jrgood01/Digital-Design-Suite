//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-distribute this software with modification or use this software
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import React from "react";
import {DockableWindow} from "../DockableWindow";
import {SimulationComponent} from "../../../SimulationCore/SimulationComponent/SimulationComponent";
import {ComponentPropertyViewFactory} from "./ComponentProperties/Factory/ComponentPropertyViewFactory";

interface PropertiesWindowProps {
    selectedComponent : SimulationComponent;
}

export const PropertiesWindow = (props : PropertiesWindowProps) => {
    return (
        <DockableWindow title={"Properties"} assignedId={"4"} width={400} height={1000} startX={1300} startY={35}>
            <ComponentPropertyViewFactory selectedComponent={props.selectedComponent}/>
        </DockableWindow>
    )
}