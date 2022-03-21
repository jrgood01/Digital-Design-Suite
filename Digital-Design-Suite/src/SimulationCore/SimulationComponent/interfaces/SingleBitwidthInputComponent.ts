import {Translatable} from "./Translatable";

export interface SingleBitWidthInputComponent extends Translatable {
    getBitWidth() : number;
    setBitWidth(newBitWidth : number) : void;
}