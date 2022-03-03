import {ComponentPropertyFieldType} from "./ComponentPropertyFieldType";
import {ComponentProperty} from "../ComponentProperty";
import React, {ChangeEvent, ChangeEventHandler} from "react";

export class ComponentPropertyNumberField extends ComponentProperty {
    private value : number;

    private max : number;
    private min : number;
    private width : number;

    private onValueChanged : (newVal : number) => void;
    onInputChange : ChangeEventHandler<HTMLInputElement>;
    constructor(min : number, max : number) {
        super(ComponentPropertyFieldType.NUMBER);
        this.getValue = this.getValue.bind(this);
        this.setValue = this.setValue.bind(this);
        this.setWidth = this.setWidth.bind(this);
        this.getWidth = this.getWidth.bind(this);
        this.setOnValueChanged = this.setOnValueChanged.bind(this);
        this.validate = this.validate.bind(this);
        this.setRange = this.setRange.bind(this);

        this.onInputChange = (event : ChangeEvent<HTMLInputElement>) => {
            this.onValueChanged(Number.parseInt(event.target.value));
        }
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

    setValue(newVal : string) {
        this.value = Number.parseInt(newVal);
        this.onValueChanged((Number.parseInt(newVal)));
    }

    setOnValueChanged(handler : (newVal : number) => void) {
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
}