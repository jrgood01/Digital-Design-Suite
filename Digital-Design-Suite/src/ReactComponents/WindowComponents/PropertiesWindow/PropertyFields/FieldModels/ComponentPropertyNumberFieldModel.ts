import {ComponentPropertyFieldType} from "./ComponentPropertyFieldType";
import {ComponentPropertyFieldModel} from "./ComponentPropertyFieldModel";
import React, {ChangeEvent, ChangeEventHandler, FocusEventHandler, SyntheticEvent} from "react";

export class ComponentPropertyNumberFieldModel extends ComponentPropertyFieldModel {
    private value : number;

    private max : number;
    private min : number;
    private width : number;

    private onValueChanged : (newVal : number) => void;
    private onInputChange : (event: SyntheticEvent) => void;
    constructor(min : number, max : number) {
        super(ComponentPropertyFieldType.NUMBER);
        this.setOnComponentValueChanged = this.setOnComponentValueChanged.bind(this);
        this.getValue = this.getValue.bind(this);
        this.setValue = this.setValue.bind(this);
        this.setWidth = this.setWidth.bind(this);
        this.getWidth = this.getWidth.bind(this);
        this.setOnComponentValueChanged = this.setOnComponentValueChanged.bind(this);
        this.validate = this.validate.bind(this);
        this.setRange = this.setRange.bind(this);

        this.value = 0;
        this.min = min;
        this.max = max;
    }

    getValue() {
        return this.value.toString();
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

    setValue(newVal : string) {
        this.value = Number.parseInt(newVal);
        if (this.onValueChanged)
            this.onValueChanged((Number.parseInt(newVal)));
    }

    setValueAtomic(newVal : string) {
        this.value = Number.parseInt(newVal);
    }

    setOnComponentValueChanged(handler : (newVal : number) => void) {
        this.onValueChanged = handler;
    }

    validate() {
        if (this.value > this.max) {
            this.value = this.max;
        }

        if (this.value < this.min) {
            this.value = this.min;
        }

        return this.value.toString();
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
}