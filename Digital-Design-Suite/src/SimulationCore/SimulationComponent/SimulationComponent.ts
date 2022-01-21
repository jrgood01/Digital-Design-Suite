abstract class SimulationComponent {
    x : number;
    y : number;
    componentId : string;
    input : SimulationComponentIO;
    output : SimulationComponentIO;

    constructor(inputLines : number, outputLines : number, inputBitWidths : Array<number>, outputBitWidths : Array<number>) {
        this.input = new SimulationComponentIO(inputLines, inputBitWidths);
        this.output = new SimulationComponentIO(outputLines, outputBitWidths);
    }

    abstract simulate(): void;

    addInputLine(bitWidth : number) {
        this.input.addLine(bitWidth);
    }

    deleteLine(lineNumber : number) {
        this.input.removeLine(lineNumber);
    }

    addOutputLine(bitWidth : number) {
        this.output.addLine(bitWidth);
    }

    deleteOutputLine(lineNumber : number) {
        this.output.removeLine(lineNumber);
    }

    changeInputBitWidth(lineNumber : number, newBitWidth : number) {
        this.input.changeBitSize(lineNumber, newBitWidth);
    }

    changeOutputBitWidth(lineNumber : number, newBitWidth : number) {
        this.output.changeBitSize(lineNumber, newBitWidth);
    }

    getInputLine(lineNumber : number) {
        return this.input.getLineValue(lineNumber);
    }

    getOutputLine(lineNumber : number) {
        return this.output.getLineValue(lineNumber);
    }

    getInputLineBit(lineNumber : number, bitNumber : number) {
        return this.input.getLineBit(lineNumber, bitNumber);
    }

    getOutputLineBit(lineNumber : number, bitNumber : number) {
        return this.output.getLineBit(lineNumber, bitNumber);
    }
}