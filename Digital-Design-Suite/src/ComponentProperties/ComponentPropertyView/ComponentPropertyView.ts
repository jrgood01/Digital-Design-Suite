import {SimulationComponent} from "../../SimulationComponent/SimulationComponent";
import {ComponentPropertyNumberField} from "../FieldTypes/ComponentPropertyNumberField";
import {ComponentEvent} from "../../SimulationCore/SimulationEvents/ComponentEvent";

export class ComponentPropertyView {
    private linkedComponent : SimulationComponent;

    private xField : ComponentPropertyNumberField;
    private yField : ComponentPropertyNumberField;

    constructor(linkedComponent : SimulationComponent) {
        this.xFieldUpdated = this.xFieldUpdated.bind(this);
        this.yFieldUpdated = this.yFieldUpdated.bind(this);
        this.linkedComponentMove = this.linkedComponentMove.bind(this);

        this.linkedComponent = linkedComponent;

        this.xField = new ComponentPropertyNumberField(-10000, 10000);
        this.yField = new ComponentPropertyNumberField(-10000, 10000);

        this.xField.setTitle("X");
        this.yField.setTitle("Y");

        this.xField.setWidth(50);
        this.yField.setWidth(50)

        this.xField.setOnValueChanged(this.xFieldUpdated);
        this.yField.setOnValueChanged(this.yFieldUpdated);

        this.xField.setValue(this.linkedComponent.getX().toString());
        this.linkedComponent.onMove.push(this.linkedComponentMove);
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