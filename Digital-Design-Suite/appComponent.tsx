import * as React from "react";
import {MenuBar} from "./src/ReactComponents/MenuBar/MenuBarComponent";
import {ToolBoxWindow} from "./src/ReactComponents/WindowComponents/ToolBoxWindow/ToolBoxWindow";
import {PropertiesWindow} from "./src/ReactComponents/WindowComponents/PropertiesWindow/PropertiesWindow";
import {SubMenuProps} from "./src/ReactComponents/MenuBar/SubMenuComponent";
import {DigitalDesignSimulation} from "./src/SimulationCore/Simulation";
import {SimulationComponent} from "./src/SimulationComponent/SimulationComponent";
import {ComponentEvent} from "./src/SimulationCore/SimulationEvents/ComponentEvent";

interface appProps {
    simulation : DigitalDesignSimulation;
}

export const DigitalDesignSimulationApp = (props : appProps) => {
    const [selectedComponent, setSelectedComponent] = React.useState<SimulationComponent>();
    const subMenuArr: SubMenuProps[] = [
        { title: "File", values: [
                {title: "New", action:() => {}},
                {title: "Save", action:() => {}},
                {title: "Open", action:() => {}}
            ]
        },

        { title: "View", values: [
                {title: "Toolbox", action:() => {}}
            ]
        },

        { title: "Window", values: [
                {title: "Minimize", action:() => {}},
                {title: "Maximize", action:() => {}},
                {title: "Full Screen", action:() => {}}
            ]
        }
    ];

    props.simulation.addOnSelect((e : ComponentEvent) => {
        setSelectedComponent(e.component);
    })

    return (
        <React.Fragment>
            <MenuBar props={{elements:subMenuArr}}/>
            <ToolBoxWindow currentSelection={""} onBeginComponentPlace={(val : string) => {props.simulation.beginPlace(val)}}/>
            <PropertiesWindow selectedComponent={selectedComponent}/>
        </React.Fragment>
    )
}