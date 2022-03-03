import {ComponentPropertyFieldType} from "./FieldTypes/ComponentPropertyFieldType";
import {Heading} from "../Heading";

export abstract class ComponentProperty {
    private fieldType : ComponentPropertyFieldType
    private canEdit : boolean;
    private title : string;
    private titleDirection : Heading;

    constructor(fieldType : ComponentPropertyFieldType) {
        this.fieldType = fieldType;
        this.canEdit = true;
        this.title = "";
        this.titleDirection = Heading.West;
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

    abstract setValue(newVal : string) : void;
    abstract validate() : string;
    abstract getValue() : string;
}