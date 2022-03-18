import {ComponentPropertyView} from "./ComponentPropertyView";
import {ComponentPropertyNumberField} from "../FieldTypes/ComponentPropertyNumberField";
import {Translatable} from "../../SimulationComponent/interfaces/Translatable";

export class SingleBitWidthPropertyView extends ComponentPropertyView {
    private bitWidthField : ComponentPropertyNumberField

    constructor(linkedComponent : Translatable) {
        super(linkedComponent);
        this.bitWidthField = new ComponentPropertyNumberField(1, 16);
        this.bitWidthField.setTitle("Bitwidth");
        this.bitWidthField.setValue("1");
    }
}

