import {ComponentProperty} from "../ComponentProperty";
import {ComponentPropertyFieldType} from "./ComponentPropertyFieldType";

export class ComponentPropertyTextField extends ComponentProperty {
    private value : string;
    private onValueChanged : (newVal : string) => void;

    constructor() {
        super(ComponentPropertyFieldType.TEXT);
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