import { getGlobalClock } from '@/store'
import store from '@/store'
import RenamedRegister from './RenamedRegister'

class FunctionalUnit {
    constructor () {
        this.clock = 0
        this.line = undefined
    }

    d () {
        if (this.line.inputParams[0])
            return this.line.inputParams[0]
        return undefined
    }   

    j () {
        const j = this.line.inputParams[1]
        if (j) {
            return j
        }
        return undefined
    }

    k () {
        if (this.line.inputParams[2])
            return this.line.inputParams[2]
        return undefined
    }

    available () {
        if (this.line) {
            return false
        }
        return true
    }

    clearUnit () {
        this.clock = 0;
        this.line = undefined
        this.j = undefined
        this.k = undefined
        this.d = undefined
    }

    run () {
        let res
        if (this.available()) {
            return false
        } else if (this.line.instruction.branchInstruction()) {
            res = this.runBranch()
        } else {
            res = this.runInstruction()
        }
        if (res) {
            this.clearUnit()
            return true
        }
        return false
    }

    runBranch () {

    }

    runInstruction () {
        console.log(this.line.issue)
        if (this.line.issue) {
            if (this.clock < this.line.instruction.clock) {
                this.exec()
            } else {
                this.write()
            }
        } else {
            this.issue()
        }
    }

    issue () {
        if (this.d().available()) {
            this.line.issue = store.getters.globalClock
            this.d().value = this
            let j = this.j()
            if (!(j.value instanceof FunctionalUnit)) {
                if (j.value instanceof RenamedRegister) {
                    j.value = new RenamedRegister(j.value.name)
                } else {
                    j.value = new RenamedRegister()
                }
            }
            return this.line.inputParams[1]
        }
    }

    exec () {
        this.clock++
        if (this.clock === this.line.instruction.clock) {
            this.line.exec = store.getters.globalClock
        }
    }

    write () {
        this.line.write = store.getters.globalClock
        store.commit('removeRenamedRegister', this.j())
        store.commit('removeRenamedRegister', this.k())
    }
}

export default FunctionalUnit