const buttonStyle = {
    background : "#000080",
    width : "200px",
    height : "100px"
}

interface buttonProps {
    buttonText : String;
}

const CustomButtom = (props : buttonProps) => {
    return (
        <div style={buttonStyle}>
            <h1>
                {props.buttonText}
            </h1>
        </div>
    );
}

export default CustomButtom;