import {Translatable} from "./Translatable";

export interface SingleBitWidthInputComponent extends Translatable {
    getInputBitWidth() : number;
    setInputBitWidth(newBitWidth : number) : void;
}