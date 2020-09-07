import Const from '@/config/Const'

class Instruction {
    constructor (name, clock, fu, params) {
        this.name = name
        this.clock = clock
        this.functionalUnitType = Const.functionalUnits[fu]
        this.params = params.map(param => Const.params[param])
    }

    branchInstruction () {
        for (let param in this.params) {
            if (param === Const.params.branch) {
                return true
            }
        }
        return false
    }
}

export default Instruction