import {TranslatablePropertyModel} from "./TranslatablePropertyModel";
import {ComponentPropertyNumberFieldModel} from "../../PropertyFields/FieldModels/ComponentPropertyNumberFieldModel";
import {Translatable} from "../../../../../SimulationCore/SimulationComponent/interfaces/Translatable";
import {
    SingleBitWidthInputComponent
} from "../../../../../SimulationCore/SimulationComponent/interfaces/SingleBitwidthInputComponent";

export class SingleBitWidthPropertiesModel {
    private bitWidthField : ComponentPropertyNumberFieldModel
    private linkedComponent : SingleBitWidthInputComponent;
    constructor(linkedComponent : SingleBitWidthInputComponent) {
        this.bitWidthFieldUpdated = this.bitWidthFieldUpdated.bind(this)

        this.linkedComponent = linkedComponent;
        this.bitWidthField = new ComponentPropertyNumberFieldModel(this.bitWidthFieldUpdated, 1, 16);
        this.bitWidthField.setTitle("Bitwidth");
        this.bitWidthField.setValue(this.linkedComponent.getBitWidth());
    }

    bitWidthFieldUpdated(val : number) {
        this.linkedComponent.setBitWidth(val);
    }

    getBitWidthField() {
        return this.bitWidthField;
    }

}

