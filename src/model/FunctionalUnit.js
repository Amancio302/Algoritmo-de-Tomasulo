import store from '@/store'
import Const from '@/config/Const'
import Register from './Register'
import RenamedRegister from './RenamedRegister'

class FunctionalUnit {
    constructor (type, name) {
        this.clock = 0
        this.line = undefined
        this.type = Const.functionalUnits[type]
        this.name = this.type + name
    }

    d () {
        if (this.line) {
            const d = this.line.inputParams[0]
            if (d) {
                return d
            }
        }
        return undefined
    }   

    j () {
        if (this.line) {
            const j = this.line.inputParams[1]
            if (j) {
                return j
            }
        }
        return undefined
    }

    k () {
        if (this.line) {
            const k = this.line.inputParams[2]
            if (k) {
                return k
            }
        }
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
    }

    run () {
        let res
        if (this.available()) {
            return false
        } else if (this.line.instruction.branchInstruction()) {
            res = this.runBranch()
        } else if (this.line.instruction.name === 'S.D') {
            res = this.runStore()
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
        if (this.line.issue) {
            if (this.line.exec) {
                this.line.write = store.getters.globalClock
                return true
            } else {
                let ready = true
                for (let index in this.line.inputParams) {
                    const param = this.line.inputParams[index]
                    if (!param.available()) {
                        ready = false
                    }
                }
                if (ready) {
                    console.log('Line: ', this.line.instruction.name)
                    console.log('Clock FU ', this.clock)
                    console.log('Clock In ', this.line.instruction.clock)
                    this.clock++
                    if (this.clock === this.line.instruction.clock) {
                        this.line.exec = store.getters.globalClock
                    }
                }
            }
        } else {
            this.line.issue = store.getters.globalClock
        }
        return false
    }

    runStore () {
        if (this.line.issue) {
            if (this.line.exec) {
                this.line.write = store.getters.globalClock
                return true
            } else {
                let readyA = false
                let readyB = true
                if (this.d() instanceof Register) {
                    if (!(this.d().value instanceof FunctionalUnit)) {
                        this.line.inputParams[0] = new RenamedRegister()
                    }
                } else {
                    readyA = true
                }
                if (this.k() instanceof Register) {
                    if (!(this.k().value instanceof FunctionalUnit)) {
                        this.line.inputParams[2] = new RenamedRegister()
                    }
                } else {
                    readyB = true
                }
                if (readyA && readyB) {
                    console.log('Line: ', this.line.instruction.name)
                    console.log('Clock FU ', this.clock)
                    console.log('Clock In ', this.line.instruction.clock)
                    if (this.clock === this.line.instruction.clock) {
                        this.line.exec = store.getters.globalClock
                    }
                    this.clock++
                }
            }
        } else {
            this.line.issue = store.getters.globalClock
            if (this.d().available()) {
                this.line.inputParams[0] = new RenamedRegister()
            }
        }
        return false
    }

    runInstruction () {
        if (this.line.issue) {
            if (this.clock < this.line.instruction.clock) {
                this.exec()
            } else {
                this.write()
                return true
            }
        } else {
            this.issue()
        }
        return false
    }

    issue () {
        if (this.d().available()) {
            this.line.issue = store.getters.globalClock
            let j = this.j()
            let k = this.k()
            if (j instanceof Register) {
                if (j.value === undefined) {
                    const reg = new RenamedRegister()
                    store.commit('addRenamedRegister', reg)
                    this.line.inputParams[1] = reg
                } else if (j.value instanceof RenamedRegister) {
                    const reg = new RenamedRegister(j.value.name)
                    this.line.inputParams[1] = reg
                } else {
                }
            } else {
            }
            if (k instanceof Register) {
                if (k.value === undefined) {
                    let reg
                    if (this.line.instruction.name === 'L.D') {
                        reg = new RenamedRegister(k.name)
                    } else {
                        reg = new RenamedRegister()
                        store.commit('addRenamedRegister', reg)
                    }
                    this.line.inputParams[2] = reg
                } else if (k.value instanceof RenamedRegister) {
                    const reg = new RenamedRegister(k.value.name)
                    this.line.inputParams[2] = reg
                } else {
                }
            } else {
            }
            this.d().value = this
        } else {
        }
    }

    exec () {
        if (this.execStart()) {
            // Se j e k já forem registradores renomeados
            console.log('Line: ', this.line.instruction.name)
            console.log('Clock FU ', this.clock)
            console.log('Clock In ', this.line.instruction.clock)
            this.clock++
            if (this.clock === this.line.instruction.clock) {
                this.line.exec = store.getters.globalClock
            }
        } else {
            if (this.j().value instanceof RenamedRegister) {
                const reg = new RenamedRegister(this.j().value.name)
                this.line.inputParams[1] = reg
            }
            if (this.k().value instanceof RenamedRegister) {
                const reg = new RenamedRegister(this.k().value.name)
                this.line.inputParams[2] = reg
            }
        }
    }

    write () {
        this.line.write = store.getters.globalClock
        this.d().value = new RenamedRegister()
    }

    execStart () {
        if (this.clock > 0) {
            return true
        }
        const j = this.j()
        const k = this.k()
        if (j instanceof RenamedRegister && k instanceof RenamedRegister) {
            return true
        } else {
            return false
        }
    }
}

export default FunctionalUnit