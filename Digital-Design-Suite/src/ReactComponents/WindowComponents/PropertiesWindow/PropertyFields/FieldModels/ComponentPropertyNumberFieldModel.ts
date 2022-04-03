import {ComponentPropertyFieldType} from "./ComponentPropertyFieldType";
import {ComponentPropertyFieldModel} from "./ComponentPropertyFieldModel";
import {SyntheticEvent} from "react";

export class ComponentPropertyNumberFieldModel extends ComponentPropertyFieldModel<number> {
    private max : number;
    private min : number;
    private width : number;

    private onValueChanged : (newVal : number) => void;
    private onInputChange : (event: SyntheticEvent) => void;
    constructor(onSetLinkedVal : (newVal : number) => void, min : number, max : number) {
        super(ComponentPropertyFieldType.NUMBER, onSetLinkedVal);
        this.setOnComponentValueChanged = this.setOnComponentValueChanged.bind(this);
        this.getValue = this.getValue.bind(this);
        this.setValue = this.setValue.bind(this);
        this.setWidth = this.setWidth.bind(this);
        this.getWidth = this.getWidth.bind(this);
        this.validate = this.validate.bind(this);
        this.setRange = this.setRange.bind(this);
        this.value = 0;
        this.min = min;
        this.max = max;
    }

    getValue() {
        return this.value;
    }

    setWidth(newWidth : number) {
        this.width = newWidth;
    }

    getWidth() {
        return this.width;
    }

    getOnInputChanged() {
        return this.onInputChange;
    }

    setValue(newVal : number) {
        this.value = newVal
        if (this.onValueChanged) {
            this.onValueChanged(newVal);
        }

    }

    setValueAtomic(newVal : string) {
        this.value = Number.parseInt(newVal);
    }

    setOnComponentValueChanged(handler : (newVal : number) => void) {
        this.onValueChanged = handler;
    }

    validate(inputVal : string) {
        const parsed = Number.parseInt(inputVal);
        if (Number.isNaN(parsed)) {
            this.setValue(this.value);
            return;
        }
        if (parsed > this.max) {
            this.setValue(this.max);
            return;
        }

        if (parsed < this.min) {
            this.setValue(this.min);
            return;
        }

        this.setValue(parsed);
    }

    setRange(min : number, max : number) {
        this.min = min;
        this.max = max;
    }

    setMax(max : number) {
        this.max = max;
    }

    setMin(min : number) {
        this.min = min;
    }

    getMin() {
        return this.min;
    }

    getMax() {
        return this.max;
    }

    setOnInputValueChange(handler : (event : SyntheticEvent) => void) {
        this.onInputChange = handler;
    }

    valueToString() {
        return this.value.toString();
    }
}