import {SimulationComponent} from "../../../../../SimulationCore/SimulationComponent/SimulationComponent";
import {TranslatablePropertyModel} from "../ComponentPropertyModels/TranslatablePropertyModel";
import React from "react";
import {
    ComponentPropertiesViewComponent
} from "../ComponentPropertyViews/ComponentPropertiesViewComponent";

import {SingleBitWidthPropertiesViewComponent} from "../ComponentPropertyViews/SingleBitWidthPropertiesViewComponent";
import {SingleBitWidthPropertiesModel} from "../ComponentPropertyModels/SingleBitWidthPropertiesModel";
import {jsx} from "@emotion/react";
import JSX = jsx.JSX;
import {
    SingleBitWidthInputComponent
} from "../../../../../SimulationCore/SimulationComponent/interfaces/SingleBitwidthInputComponent";
import {ConstantComponent} from "../../../../../SimulationCore/SimulationComponent/Wiring/Logic/Constant";
import {ConstantComponentPropertyView} from "../ComponentPropertyViews/ConstantComponentPropertyView";
import {ConstantComponentPropertyModel} from "../ComponentPropertyModels/ConstantComponentPropertyModel";
interface ComponentPropertyViewFactoryProps {
    selectedComponent : SimulationComponent;
}

const isSingleBitWidthComponent = (component : SimulationComponent) => {
    const cmp : any = component as any
    return "getBitWidth" in cmp && "setBitWidth" in cmp;
}

export const ComponentPropertyViewFactory = (props : ComponentPropertyViewFactoryProps) => {
    const [dispComponent, setDispComponent] = React.useState(new Array<JSX.Element>());
    console.log("Render")

    return (
        <div>
            {
                props.selectedComponent &&
                <ComponentPropertiesViewComponent target={new TranslatablePropertyModel(props.selectedComponent)}/>
            }


            {props.selectedComponent && isSingleBitWidthComponent(props.selectedComponent) &&
                    <SingleBitWidthPropertiesViewComponent target={
                    new SingleBitWidthPropertiesModel(props.selectedComponent as unknown as SingleBitWidthInputComponent
                    )}/>
            }
            {
                props.selectedComponent && props.selectedComponent instanceof ConstantComponent &&
                <ConstantComponentPropertyView target=
                                                   {new ConstantComponentPropertyModel(
                                                       props.selectedComponent as ConstantComponent)}/>
            }

        </div>
    )
}