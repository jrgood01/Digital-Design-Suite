import {ComponentPropertyFieldModel} from "./ComponentPropertyFieldModel";
import {ComponentPropertyFieldType} from "./ComponentPropertyFieldType";

export class ComponentPropertyTextFieldModel extends ComponentPropertyFieldModel<string> {
    private onValueChanged : (newVal : string) => void;

    constructor(onSetLinkedVal : (newVal : string) => void) {
        super(ComponentPropertyFieldType.TEXT, onSetLinkedVal);
    }

    getValue() {
        return this.value;
    }

    setValue(newVal : string) {
        this.value = newVal;
        this.onValueChanged(newVal);
    }

    validate() {
        return this.value;
    }
}