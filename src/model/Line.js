import rules from '@/config/rules'

class Line {
    constructor (instruction, inputParams) {
        this.instruction = instruction
        this.inputParams = inputParams
        this.issue = undefined
        this.exec = undefined
        this.write = undefined
    }

    ready () {
        if (this.instruction && this.inputParams) {
            if (this.instruction.params.lenght === this.inputParams.lenght) {
                for (let param in this.inputParams) {
                    if (this.validateParam(param) !== true) {
                        return false
                    }
                }
                return true
            }
        }
        return false
    }

    updateInstruction () {
        if (this.instruction) {
            this.inputParams = new Array(this.instruction.params.lenght)
        }
    }

    validateParam (param) {
        return rules.input[this.instruction.params[param]].validate(this.inputParams[param])
    }
}

export default Line