class SimulationComponentIO {
    private _lineValues : Array<Array<boolean>>

    constructor(inputLinesNum : number, bitWidths : Array<number>) {
        for (let i = 0; i < inputLinesNum; i ++) {
            this._lineValues.push(new Array<boolean>());
            for (let l = 0; l < inputLinesNum; l ++) {
                this._lineValues[l].push(false);
            }
        }
    }

    getLineValue(lineNumber : number) {
        return this._lineValues[lineNumber];
    }

    getLineBit(lineNumber : number, bitNumber : number) {
        return this._lineValues[lineNumber][bitNumber];
    }

    setLineBit(lineNumber : number, bitNumber : number, value : boolean) {
        this._lineValues[lineNumber][bitNumber] = value;
    }

    setLineValue(lineNumber : number, value : Array<boolean>) {
        this._lineValues[lineNumber] = value;
    }

    addLine(bitWidth : number) {
        const addLine : Array<boolean> = new Array<boolean>();
        //Set line to false initially
        for (let i = 0; i < bitWidth ; i ++) { addLine[i] = false;} 
        this._lineValues.push(addLine);
    }

    removeLine(lineNumber : number) {
        delete this._lineValues[lineNumber];
    }

    changeBitSize(lineNumber : number, newBitSize : number) {
        let lineSize = this._lineValues[lineNumber].length;
        let diff = lineSize - newBitSize
        
        if (diff > 0) {
            for (let i = 0; i < diff; i ++) {
                this._lineValues[lineNumber].push(false);
            }
        } else {
            for (let i = 0; i < -diff; i ++) {
                this._lineValues[lineNumber].pop();
            }
        }
    }
}