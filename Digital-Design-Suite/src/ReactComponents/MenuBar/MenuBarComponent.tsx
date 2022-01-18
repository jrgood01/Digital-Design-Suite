import React, { useState, useEffect, useRef, LegacyRef} from 'react';
import CSS from 'csstype';
import 'typeface-montserrat-alternates';
import  * as constants from "../../constants";
import { SubMenu, SubMenuProps } from './SubMenuComponent';
//The menu bar accepts one property: elements. 
// The element array is an array of SubMenus
const MenuBarStyle: CSS.Properties = {
    width : "100%",
    cursor : "pointer",
    background : constants.MenuBar.BackgroundColor,
    color : constants.MenuBar.FontColor,
    fontSize : constants.MenuBar.FontSize,
    fontFamily : constants.MenuBar.Font
}

const MenuBarDivTopStyle: CSS.Properties = {
    display : "inline-block",
    width : "auto",
    paddingLeft: constants.MenuBar.PaddingLeft
}


export type MenuBarProps = {
    elements: Array<SubMenuProps>
}



export const MenuBar = ({ props } : {props: MenuBarProps}) => {
    const [activeDropDown, setActiveDropDown] = useState("");
    const [clickDetect, setClickDetect] = useState("");
    const dropDownRef = useRef<HTMLDivElement>(null);
    const menuBarDownRef = useRef(this);
    
    const menuElementMouseEnterHandler  = (event: React.MouseEvent<HTMLElement>) => {
        (event.target as HTMLElement).style.color = constants.MenuBar.FontColor;
    }
    
    
    const menuElementMouseLeaveHandler  = (event: React.MouseEvent<HTMLElement>) => {
        (event.target as HTMLElement).style.color = constants.MenuBar.FontColor;
    }

    return (
        <div style={MenuBarStyle}>
            {props.elements.map((subMenu, i) => (
                <div style={{display : "inline-block"}}>
                <div 
                id = {i.toString()}
                style={MenuBarDivTopStyle} 
                onMouseOver={menuElementMouseEnterHandler}
                onMouseOut={menuElementMouseLeaveHandler}
                onClick={(e) => {
                        setActiveDropDown(i.toString());
                    }}>

                    <h1>
                        {subMenu.title}
                    </h1>

                </div>

                    {activeDropDown == i.toString() && 
                        <SubMenu props={subMenu}/>
                    }

                </div>

                
            ))
            }
        </div>
    );
}