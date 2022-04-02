import {ComponentPropertyModel} from "./ComponentPropertyModel";
import {ComponentPropertyNumberFieldModel} from "../../PropertyFields/FieldModels/ComponentPropertyNumberFieldModel";
import {Translatable} from "../../../../../SimulationCore/SimulationComponent/interfaces/Translatable";

export class SingleBitWidthPropertiesModel extends ComponentPropertyModel {
    private bitWidthField : ComponentPropertyNumberFieldModel

    constructor(linkedComponent : Translatable) {
        super(linkedComponent);
        this.bitWidthFieldUpdated = this.bitWidthFieldUpdated.bind(this)
        this.bitWidthField = new ComponentPropertyNumberFieldModel(this.bitWidthFieldUpdated, 1, 16);
        this.bitWidthField.setTitle("Bitwidth");
        this.bitWidthField.setValue(1);
    }

    bitWidthFieldUpdated(val : number) {

    }
    getBitWidthField() {
        return this.bitWidthField;
    }

}

