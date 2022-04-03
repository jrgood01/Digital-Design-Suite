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
    React.useEffect(() => {
        const newComponent = new Array<JSX.Element>();
        if (props.selectedComponent) {
            const addTarget = new TranslatablePropertyModel(props.selectedComponent);
            newComponent.push(
                <ComponentPropertiesViewComponent target={addTarget}/>
            )

            if (isSingleBitWidthComponent(props.selectedComponent)) {
                const addTarget = new SingleBitWidthPropertiesModel(props.selectedComponent as unknown as SingleBitWidthInputComponent);
                newComponent.push(
                    <SingleBitWidthPropertiesViewComponent target={addTarget}/>
                )

            }

            if(props.selectedComponent instanceof ConstantComponent) {
                const addTarget = new ConstantComponentPropertyModel(props.selectedComponent as ConstantComponent);
                newComponent.push(
                    <ConstantComponentPropertyView target={addTarget}/>
                )
            }
            setDispComponent(newComponent)
        }
    }, [props.selectedComponent])

    return (
        <div>
            {dispComponent.map((element : JSX.Element) => <div>{element}</div>)}
        </div>
    )
}