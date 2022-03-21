import {ComponentPropertyModel} from "./ComponentPropertyModel";
import {ComponentPropertyNumberFieldModel} from "../../PropertyFields/FieldModels/ComponentPropertyNumberFieldModel";
import {Translatable} from "../../../../../SimulationCore/SimulationComponent/interfaces/Translatable";

export class SingleBitWidthPropertiesModel extends ComponentPropertyModel {
    private bitWidthField : ComponentPropertyNumberFieldModel

    constructor(linkedComponent : Translatable) {
        super(linkedComponent);
        this.bitWidthField = new ComponentPropertyNumberFieldModel(1, 16);
        this.bitWidthField.setTitle("Bitwidth");
        this.bitWidthField.setValue("1");
    }

    public getBitWidthField() {
        return this.bitWidthField;
    }
}

