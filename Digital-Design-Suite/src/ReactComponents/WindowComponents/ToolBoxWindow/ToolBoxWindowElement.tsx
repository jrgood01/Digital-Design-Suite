import React from "react"
import * as Material from "@material-ui/core"


const topDivStyle = {
    backgroundColor : "#191E2A",
    height : "70px",
    width : "100%",
}

const TextStyle = {
    fontSize : "18px",
    fontFamily : "lato",
    color : "#aaaabb",
    display : "table-cell",
    verticalAlign : "middle",
    paddingLeft: "10px"

}


interface ToolBoxElementProps {
    title : String;
    icon : JSX.Element;
    dropDownElements : Array<String>
    currentSelection : String;
    onSelect : (val : String) => void;
}
export const ToolBoxElement = (props : ToolBoxElementProps) => {

    let divRef = React.createRef<HTMLDivElement>();
    const [isDropped, setIsDropped] = React.useState(false);
    
    return (
        <React.Fragment>
            <Material.Paper elevation={3}>
                <div ref={divRef} style={topDivStyle} 
                    onMouseOver={(event : any) => {if(!isDropped){divRef.current.style.backgroundColor="#292E3A"}}} 
                    onMouseLeave={(event : any) => {divRef.current.style.backgroundColor="#191E2A"}}
                    onClick={()=>{setIsDropped(!isDropped)}}>
                    <div style={{float: "left", width:"30%",display:"flex", alignItems:"center", justifyContent:"center", height:"100%"}}>
                  
                            {props.icon}
                    
                    </div>
                    <div style={{float: "right", width:"70%", display:"flex", alignItems:"center", height:"100%"}}>
                        <h1 style={TextStyle}>
                            {props.title}
                        </h1>
                    </div>
                </div>
                { isDropped ?
                    <Material.Paper elevation={1}>
                        <div style={{backgroundColor:"#1E232F", paddingBottom:"0px"}}>
                            {props.dropDownElements.map((title : String, index : number) => {
                                let pathOne = "M 42 0 V 37 Z";
                                if (index == props.dropDownElements.length - 1) {
                                    pathOne = "M 42 0 V 17 Z";
                                }

                                const DropDownTextStyle = {
                                    fontSize : "18px",
                                    fontFamily : "lato",
                                    color : props.currentSelection == title ? "#FFFFFF" : "#aaaabb",
                                    paddingTop : "7px",
                                    paddingBottom : "7px",
                                    marginTop : "0px",
                                    marginBottom : "0px",
                                    paddingLeft: "90px",
                                    cursor : "Grab",
                                    display : "inline-block"
                                }

                                return (
                                <div style={{display:"grid"}} onClick={() => {props.onSelect(title)}}>
                                    <svg style={{display:"inline-block", position:"absolute"}}>
                                        <path d={pathOne} stroke="#22baff" strokeWidth="2"/>
                                        <path d="M 42 17 H 75 Z" stroke="#22baff" strokeWidth="2"/>
                                        <circle cx = "75" cy="17" r="3.5" fill="#22baff"/>
                                    </svg>
                                    <div>
                                        <h1 style={DropDownTextStyle}>{title}</h1> 
                                    </div>
                                    
                                </div>
                                )
                            })}
                        </div>
                    </Material.Paper> : <div></div>
                }
            </Material.Paper>
        </React.Fragment>
    )
}