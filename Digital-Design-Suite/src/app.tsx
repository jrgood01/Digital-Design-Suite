//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './default.css';
import {SubMenuProps} from "./ReactComponents/MenuBar/SubMenuComponent";
import {MenuBar} from "./ReactComponents/MenuBar/MenuBarComponent";
import {DigitalDesignSimulation} from "./SimulationCore/Simulation"
import {SimulationWarden} from "./SimulationCore/SimulationWarden"
import { ToolBoxWindow } from "./ReactComponents/WindowComponents/ToolBoxWindow/ToolBoxWindow"
function render() {
  
  const containerRef = React.createRef<HTMLDivElement>();

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



  ReactDOM.render(
      <React.Fragment>
        <MenuBar props={{elements:subMenuArr}}/>
        <ToolBoxWindow currentSelection={""}/>
      </React.Fragment>
      

  , document.body
  );


  let simulation = new DigitalDesignSimulation(containerRef.current);
}

render();