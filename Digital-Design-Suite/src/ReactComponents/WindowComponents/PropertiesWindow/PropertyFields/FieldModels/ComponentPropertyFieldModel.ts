import {ComponentPropertyFieldType} from "./ComponentPropertyFieldType";
import {Heading} from "../../../../../Heading";

export abstract class ComponentPropertyFieldModel<T> {
    private fieldType : ComponentPropertyFieldType
    private canEdit : boolean;
    private title : string;
    private titleDirection : Heading;
    private onSetLinkedValue : (newVal : T) => void;
    protected value : T;

    constructor(fieldType : ComponentPropertyFieldType, onSetLinkedValue : (newVal : T) => void) {
        this.fieldType = fieldType;
        this.canEdit = true;
        this.title = "";
        this.titleDirection = Heading.West;
        this.onSetLinkedValue = onSetLinkedValue;
    }

    getCanEdit() {
        return this.canEdit;
    }

    setCanEdit(canEdit : boolean) {
        this.canEdit = canEdit;
    }


    setTitle(newTitle : string) {
        this.title = newTitle;
    }

    setTitleDirection(newDirection : Heading) {
        this.titleDirection = newDirection;
    }

    getTitle() {
        return this.title;
    }

    getTitleDirection() {
        return this.titleDirection
    }

    setLinkedVal(inputVal : string) {
        this.validate(inputVal);
        this.onSetLinkedValue(this.value);
    }

    abstract setValue(newVal : T) : void;
    abstract validate(inputVal : string) : void;
    abstract getValue() : T;
}