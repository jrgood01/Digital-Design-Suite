import {Translatable} from "./Translatable";

export interface SingleBitWidthInputComponent {
    getBitWidth() : number;
    setBitWidth(newBitWidth : number) : void;
}