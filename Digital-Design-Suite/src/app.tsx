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
import { ToolBoxWindow } from "./ReactComponents/WindowComponents/ToolBoxWindow/ToolBoxWindow"
import {PropertiesWindow} from "./ReactComponents/WindowComponents/PropertiesWindow/PropertiesWindow";
import {ComponentEvent} from "./SimulationCore/SimulationEvents/ComponentEvent";
import {SimulationComponent} from "./SimulationComponent/SimulationComponent";
import {DigitalDesignSimulationApp} from "../appComponent";
function render() {



  const simulation = new DigitalDesignSimulation();

  ReactDOM.render(
      <DigitalDesignSimulationApp simulation={simulation} />
  , document.body);

  simulation.beginRender();
}

render();