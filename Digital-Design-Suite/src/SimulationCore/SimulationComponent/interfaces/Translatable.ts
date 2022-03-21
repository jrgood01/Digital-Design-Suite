import {Heading} from "../../../Heading";

export interface Translatable {
    getX() : number;
    getY() : number;
    setX(newX : number) : void;
    setY(newY : number) : void;
    getHeading() : Heading;
    setHeading(newHeading : Heading) : void;
    translate(x : number, y : number) : void;
    addOnMove(handler: (dX : number, dY : number) => void) : void;
}