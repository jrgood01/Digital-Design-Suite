
import {ComponentPropertyNumberFieldModel} from "../../PropertyFields/FieldModels/ComponentPropertyNumberFieldModel";
import {Translatable} from "../../../../../SimulationCore/SimulationComponent/interfaces/Translatable";
import {ChangeEvent} from "react";

export class ComponentPropertyModel {
    private linkedComponent : Translatable;

    private xField : ComponentPropertyNumberFieldModel;
    private yField : ComponentPropertyNumberFieldModel;

    constructor(linkedComponent : Translatable) {
        this.xFieldUpdated = this.xFieldUpdated.bind(this);
        this.yFieldUpdated = this.yFieldUpdated.bind(this);
        this.linkedComponentMove = this.linkedComponentMove.bind(this);

        this.linkedComponent = linkedComponent;

        this.xField = new ComponentPropertyNumberFieldModel(-10000, 10000);
        this.yField = new ComponentPropertyNumberFieldModel(-10000, 10000);

        this.xField.setTitle("X");
        this.yField.setTitle("Y");

        this.xField.setWidth(50);
        this.yField.setWidth(50)

        this.xField.setValue(this.linkedComponent.getX().toString());
        this.linkedComponent.addOnMove(this.linkedComponentMove);
        this.xField.setOnInputValueChange((event : ChangeEvent<HTMLInputElement>) =>
            {this.xFieldUpdated(Number.parseInt(event.target.value))});
        this.yField.setOnInputValueChange((event : ChangeEvent<HTMLInputElement>) =>
            {this.yFieldUpdated(Number.parseInt(event.target.value))});
    }

    xFieldUpdated(val : number) {
        this.linkedComponent.setX(val);
    }

    yFieldUpdated(val : number) {
        this.linkedComponent.setY(val);
    }

    getXField() {
        return this.xField;
    }

    getYField() {
        return this.yField;
    }

    linkedComponentMove(dX : number, dY : number) {
        this.xField.setValue(this.linkedComponent.getX().toString());
        this.yField.setValue(this.linkedComponent.getY().toString());
    }
}