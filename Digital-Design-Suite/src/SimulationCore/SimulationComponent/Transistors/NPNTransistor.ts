class NPNTransistor extends SimulationComponent {
    constructor() {
        super(2, 1, Array<number>(2).fill(1), Array<number>(1).fill(1));
    }
    simulate() {
        let collector = this.input.getLineBit(0, 0);
        let base = this.input.getLineBit(1, 0);
        let emitter = collector && base;
        
        this.output.setLineBit(0, 0, emitter);
    }
}