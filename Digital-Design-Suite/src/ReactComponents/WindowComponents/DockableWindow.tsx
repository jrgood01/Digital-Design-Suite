//Software licensed under creative commons Attribution-NonCommercial-NoDerivatives 4.0
//
//  You may not re-dsitrubte this software with modification or use this software 
//  for commercial purposes without written permission from the owner
//
//Copyright Jacob R. Haygood 2022

import * as React from 'react';
import { useState } from 'react';
import Draggable from 'react-draggable'; // The default

const DockableWindowBarTitleStyle = {
    color : "#bbbbbb",
    display : "table-cell",
    verticalAlign : "middle",
    fontSize : "14px",
    fontFamily : "lato"
}

interface DockableWindowProps {
    canMaximize? : boolean,
    draggable? : boolean,
    reizeable? : boolean,
    canUndock? : boolean,
    width? : number,
    height? : number,
    startX? : number,
    startY? : number,
    children? : JSX.Element,
    title : string,
    assignedId : string
}

const DockableWindowDefaultProps = {
    canMaximize : false,
    draggable : true,
    canUndock : true,
    reizeable : false,
    width : 400,
    height : 300,
    startX : -1,
    startY : -1
    
}

export const DockableWindow = (props : DockableWindowProps) => {
    const [lastDragX, setLastDragX] = useState(-1);
    const [lastDragY, setLastDragY] = useState(-1);
    const [positionX, setPositionX] = useState(props.startX);
    const [positionY, setPositionY] = useState(props.startY);
    const onDrag = (e : React.DragEvent<HTMLDivElement>) => {
        let resetMetrics = !((e.clientX > 0) && (e.clientY > 0));
        if (!(lastDragX == -1) && !(lastDragY == -1) && !resetMetrics) {
            let deltaY = e.clientY - lastDragY;
            let deltaX = e.clientX - lastDragX;
            let topDiv = (e.target as HTMLDivElement).parentElement;

            setPositionX((topDiv.getBoundingClientRect().left + deltaX));
            setPositionY((topDiv.getBoundingClientRect().top + deltaY));
        } 
      
        setLastDragX(resetMetrics ? -1 : e.clientX);
        setLastDragY(resetMetrics ? -1 : e.clientY);
    }

    return (
        <Draggable>
            <div id = {props.assignedId} style = {
                {
                    top : positionY,
                    left : positionX,
                    position : "absolute",
    
                }}>
                <div style = {
                    { 
                        width : props.width, 
                        cursor : "grab",
                        height : "25px",
                        display : "table",
                        textAlign : "center",
                        position : "absolute",
                        background : "#111111"
                    }}>
                        <h1 style={DockableWindowBarTitleStyle}>
                            {props.title}
                        </h1>
                    </div>
                <div style = {
                    { 
                        width : props.width, 
                        cursor : "grab",
                        height : "25px",
                        display : "table",
                        textAlign : "center",
                     
                        zIndex : "100",
                        background : "#FF0000",
                        opacity : "0%",
                    }} onDrag={onDrag}>

                    </div>

                <div id="standard" style = {
                    { 
                        width : props.width, 
                        height : props.height - 25,
                        background : "#222222"
                    }}>
                        {props.children}
                </div>
            </div>
        </Draggable>
    )
}

DockableWindow.defaultProps = DockableWindowDefaultProps;