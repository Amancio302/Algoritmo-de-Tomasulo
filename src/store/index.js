import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        globalClock: 0,
        registers: [],
        renamedRegisters: []
    },
    getters: {
        globalClock: state => state.globalClock,
        registers: state => state.registers,
        register: state => i => state.registers[i],
        renamedRegisters: state => state.renamedRegisters,
        hasRegister: state => name => {
            for (let index in state.registers) {
                let register = state.registers[index]
                if (register.name === name) {
                    return index
                }
            }
            return false
        },
        hasName: state => name => {
            for (let renamedRegister in state.renamedRegisters) {
                renamedRegister = state.renamedRegisters[renamedRegister]
                if (renamedRegister.name === name) {
                    return true
                }
            }
            return false
        }
    },
    mutations: {
        increaseClock (state) {
            state.globalClock++
        },
        resetClock (state) {
            state.globalClock = 0
        },
        resetRegisters (state) {
            state.registers = []
            state.renamedRegisters = []
        },
        addRegister (state, register) {
            state.registers.push(register)
        },
        alterRegister (state, { index, value }) {
            state.registers[index].value = value
        },
        addRenamedRegister (state, renamedRegister) {
            state.renamedRegisters.push(renamedRegister)
        },
        removeRenamedRegister (state, renamedRegister) {
            for (let i in state.renamedRegisters) {
                let renamedReg = state.renamedRegisters[i]
                if (renamedReg === renamedRegister) {
                    state.renamedRegisters.splice(i, 1)
                }
            }
        }
    }
})