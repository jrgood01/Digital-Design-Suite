import React from 'react'
import { DockableWindow } from "../DockableWindow"
import { ToolBoxElement } from "./ToolBoxWindowElement"

interface ToolBoxWindowProps {
    topLevel : Array<String>
}

export const ToolBoxWindow = (props : ToolBoxWindowProps) => {
   
    return (
        <DockableWindow title='ToolBox' assignedId='3' width={250} height={1000}>
            <div>
                <ToolBoxElement title={"Gates"} icon={
                    <React.Fragment>
                        <path d="M 00 00 V 40 Z h 20 Z" stroke="red" strokeWidth={"7"}/>
                        <path d="M 00 40 h 20" stroke="red" strokeWidth={"4"}/>
                        <path d="M 20 1 A 20 20 20 1 1 20 40 " stroke="red" fill="transparent" strokeWidth={"4"}/>
                       
                    </React.Fragment>
                    
                    
                }/> 

            </div>
        </DockableWindow>
    )
}