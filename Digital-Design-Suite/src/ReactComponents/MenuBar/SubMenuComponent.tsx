import React, { useState, useEffect, useRef, LegacyRef, MutableRefObject} from 'react';
import CSS from 'csstype';
import 'typeface-montserrat-alternates';
import  * as constants from "../../constants";
import {MenuBarElement} from "./MenuBarElement";

const DropDownDivStyle: CSS.Properties = {
    position : "absolute",
    background : constants.MenuBar.DropDown.BackgroundColor,
    paddingRight: constants.MenuBar.DropDown.PaddingRight
}

const DropDownH1Style: CSS.Properties = {
    paddingLeft: constants.MenuBar.DropDown.PaddingLeft,
    fontSize : constants.MenuBar.DropDown.FontSize
}

export interface SubMenuProps {
    title : string;
    values : Array<MenuBarElement>
}

export const SubMenu = ({props} : {props : SubMenuProps}) => {
    const topRef = useRef<HTMLDivElement>(null);
    function alertGlobalMousePress(ref: MutableRefObject<HTMLDivElement>) {
        useEffect(() => {

            function handleClickOutside(event : MouseEvent) {
                let clickIsInParentBar = ref.current.parentElement.contains(event.target as HTMLElement);
                if (!ref.current.contains(event.target as HTMLElement) && !clickIsInParentBar) {
                    ref.current.style.visibility= "hidden";
                } else {
                    ref.current.style.visibility= "visible";
                }

            }
    
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, [ref]);
    }

    alertGlobalMousePress(topRef);

    return (
        <div style={DropDownDivStyle} ref={topRef}>
        {props.values.map((subMenuItem) => (
            <h1 
            style={DropDownH1Style}
            onClick={() => {subMenuItem.action}}>
                {subMenuItem.title}
            </h1>
        ))}
    </div>
    );

}