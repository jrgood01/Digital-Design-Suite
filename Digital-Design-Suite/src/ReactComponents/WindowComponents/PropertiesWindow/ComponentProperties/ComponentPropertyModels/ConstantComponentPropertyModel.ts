import {ConstantComponent} from "../../../../../SimulationCore/SimulationComponent/Wiring/Logic/Constant";
import {ComponentPropertyNumberFieldModel} from "../../PropertyFields/FieldModels/ComponentPropertyNumberFieldModel";

export class ConstantComponentPropertyModel {
    private linkedComponent : ConstantComponent;
    private constValueField : ComponentPropertyNumberFieldModel;
    constructor(linkedComponent : ConstantComponent) {
        this.getConstVal = this.getConstVal.bind(this);
        this.constValueUpdated = this.constValueUpdated.bind(this);
        this.maxValChanged = this.maxValChanged.bind(this);

        this.linkedComponent = linkedComponent;
        this.constValueField = new ComponentPropertyNumberFieldModel(this.constValueUpdated, 0, linkedComponent.getMaxValue());
        this.constValueField.setTitle("Value");
        this.constValueField.setValue(linkedComponent.getValue());
        this.linkedComponent.setOnMaxValueChanged(this.maxValChanged);
    }

    constValueUpdated(val : number) {
        this.linkedComponent.setValue(val);
    }

    getConstVal() {
        this.linkedComponent.getValue();
    }

    getConstValueField() {
        return this.constValueField;
    }

    maxValChanged(newVal : number) {
        this.constValueField.setMax(newVal);
    }
}