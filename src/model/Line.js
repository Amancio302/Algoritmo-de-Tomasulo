class Line {
    constructor (instruction, inputParams) {
        this.instruction = instruction
        this.inputParams = inputParams
        this.issue = undefined
        this.exec = undefined
        this.write = undefined
    }
}

export default Line