import React from 'react'
import { DockableWindow } from "../DockableWindow"
import { ToolBoxElement } from "./ToolBoxWindowElement"
import OrLogo from '../../../Static/SVG/3-Input_AND_ANSI.svg'
import MuxLogo from "../../../Static/SVG/MUX.svg"
import SevenSegmentDisplayLogo from "../../../Static/SVG/7_seg_display.svg"
import SwitchCircuitLogo from "../../../Static/SVG/Switch_circuit_or.svg"
import MemoryICLogo from "../../../Static/SVG/memory_chip.svg"
import TransistorLogo from "../../../Static/SVG/Transistor.svg"
import ScopeLogo from "../../../Static/SVG/scope.svg"

interface ToolBoxWindowProps {
    topLevel : Array<String>
}


export const ToolBoxWindow = (props : ToolBoxWindowProps) => {
   
    return (
        <DockableWindow title='ToolBox' assignedId='3' width={250} height={1000}>
            <div>
                <ToolBoxElement title={"Gates"} icon={
                    <OrLogo  style={{transform:"scale(.4)", paddingBottom:"10px", stroke:"#22baff"}}/>
                } dropDownElements={['And', 'Not', 'Or', 'Nor', 'XOR', 'Xnor', 'Nand']}/> 

                <ToolBoxElement title={"Plexers"} icon={
                    <MuxLogo  overflow={"visible"} style={{transform:"scale(.14)",paddingBottom:"70px",paddingLeft:"90px", stroke:"#22baff"}}/>                
                } dropDownElements={['Multiplexer', 'De-Multiplexer', 'Priority Encoder', 'Decoder']}/> 

                <ToolBoxElement title={"Peripheral"} icon={
                    <SevenSegmentDisplayLogo  overflow={"visible"} style={{transform:"scale(.11)",paddingBottom:"70px",paddingLeft:"90px", stroke:"#22baff"}}/>                
                } dropDownElements={['7 Segment Display', 'Keyboard', 'Joystick', 'Screen', 'LCD', 'Button Matrix', 'LED', 'RGB LED', 'LED Matrix', 'RGB LED Matrix', 'Speaker', 'Rardar Display', ' Bar Graph LED', 'Speaker', 'Potentiometer']}/> 

                <ToolBoxElement title={"Wiring"} icon={
                    <SwitchCircuitLogo  overflow={"visible"} style={{transform:"scale(.3)",paddingBottom:"10px",paddingLeft:"90px", stroke:"#22baff",fill:"#22baff"}}/>                
                } dropDownElements={['Tunnel', 'Input Pin', 'Output Pin', 'Wire Splitter', 'Clock', 'Constant']}/> 

                <ToolBoxElement title={"memory"} icon={
                    <MemoryICLogo  overflow={"visible"} style={{transform:"scale(.35)",paddingBottom:"10px",paddingLeft:"50px", stroke:"#22baff",fill:"#22baff"}}/>                
                } dropDownElements={['RAM', 'ROM', 'Register', 'Dual-Port RAM', 'SR flip-flop', 'JK flip-flop', 'D flip-flop', 'T flip-flop']}/> 

                <ToolBoxElement title={"Transistors"} icon={
                    <TransistorLogo  overflow={"visible"} style={{transform:"scale(.35)",paddingBottom:"10px",paddingLeft:"50px", stroke:"#22baff",fill:"#22baff"}}/>                
                } dropDownElements={['NPN Transistor', 'PNP Transistor']}/> 

                <ToolBoxElement title={"Measurement"} icon={
                    <ScopeLogo  overflow={"visible"} style={{transform:"scale(.8)",paddingBottom:"5px",paddingLeft:"30px", stroke:"#22baff",fill:"#22baff"}}/>                
                } dropDownElements={['Digital Logic Meter', 'Level Recorder']}/> 
            </div>
        </DockableWindow>
    )
}