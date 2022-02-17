import React from "react"
import * as Material from "@material-ui/core"


const topDivStyle = {
    backgroundColor : "#191E2A",
    height : "70px",
    width : "100%"
}

const TextStyle = {
    fontSize : "18px",
    fontFamily : "lato",
    color : "#aaaabb",
    display : "table-cell",
    verticalAlign : "middle",
    paddingLeft: "20px"

}

interface ToolBoxElementProps {
    title : String;
    icon : JSX.Element;
}
export const ToolBoxElement = (props : ToolBoxElementProps) => {
    return (
        <React.Fragment>
            <Material.Paper elevation={3}>
                <div style={topDivStyle}>
                    <div style={{float: "left", width:"30%",display:"flex", alignItems:"center", justifyContent:"center", height:"100%"}}>
                  
                            {props.icon}
                    
                    </div>
                    <div style={{float: "right", width:"70%", display:"flex", alignItems:"center", height:"100%"}}>
                        <h1 style={TextStyle}>
                            {props.title}
                        </h1>
                    </div>
                </div>
            </Material.Paper>
        </React.Fragment>
    )
}