<template>
    <v-row no-gutters>
        <v-col cols="4">
            <v-card>
                <v-card-title>Configurações</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                label="Número de Instruções do bloco básico"
                                hint="Insira o número de instruções"
                                persistent-hint
                                type="number"
                                v-model="numInstructions"
                                clear-icon
                                clearable
                                :suffix="numInstructions > 1 ? 'Instruções' : 'Instrução'"
                                outlined
                                :readonly="ready"
                            />
                        </v-col>
                    </v-row>
                    <v-row v-if="numInstructions">
                        <v-row
                            v-for="(x, i) in Number(numInstructions)"
                            :key="i"
                        >
                            <v-col cols="12">
                                <v-select
                                    :items="instructions"
                                    v-model="pipeline[i].instruction"
                                    outlined
                                    :readonly="ready"
                                    label="Instrução"
                                    @input="updateValueArray(i)"
                                />
                                <v-row v-if="pipeline[i].instruction" justify="center" dense>
                                    <v-col 
                                        v-for="(param, name, index) in pipeline[i].instruction.params"
                                        :key="name"
                                        cols="4"
                                    >
                                        <v-text-field
                                            v-model="pipeline[i].values[index]"
                                            outlined
                                            :readonly="ready"
                                            :rules="[rules[param]]"
                                            :success="pipeline[i].values[index] !== undefined && 
                                                    pipeline[i].values[index] !== '' &&
                                                    rules[param] ? true : false"
                                            :label="param === 'registerFloat' || param === 'registerInt' ? 'Registrador' :
                                                    param === 'number' ? 'Valor' : 'Branch'"
                                        />
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="sendData" :color="ready ? 'primary' : 'success'" :disabled="numInstructions < 1 || !valid">{{ ready ? 'Editar Configuração' : !valid ? 'Configuração Inválida' : 'Enviar Configuração' }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
        <v-col cols="8">
            <v-card
                v-if="ready"
            >
                <v-card-title>Algoritmo de Tomasulo</v-card-title>
                <v-row justify="center" align="start">
                    <v-col>
                        Clock: {{runningClock}}
                    </v-col>
                    <v-col>
                        <v-btn @click="runOneClock">Rodar um ciclo</v-btn>
                    </v-col>
                    <v-col>
                        <v-btn @click="runAllClocks">Rodar todos os ciclos</v-btn>
                    </v-col>
                </v-row>
                <v-row justify="center" align="start">
                    <v-col cols="8">
                        <v-simple-table
                            fixed-header
                        >
                            <thead>
                                <tr>
                                    <th>Instruction</th>
                                    <th></th>
                                    <th>j</th>
                                    <th>k</th>
                                    <th>Issue</th>
                                    <th>Exec Comp</th>
                                    <th>Write Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(item, i) in pipeline"
                                    :key="i"
                                >
                                    <td>{{item.instruction.name}}</td>
                                    <td>{{item.values[0] || ''}}</td>
                                    <td>{{item.values[1] || ''}}</td>
                                    <td>{{item.values[2] || ''}}</td>
                                    <td>{{item.issue || ''}}</td>
                                    <td>{{item.exec || ''}}</td>
                                    <td>{{item.write || ''}}</td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-col>
                    <v-col cols="4">
                        <v-simple-table
                            fixed-header
                        >
                            <thead>
                                <tr>
                                    <th>LoadUnit</th>
                                    <th>Busy</th>
                                    <th>Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(item, i) in functionalUnitsList.load"
                                    :key="i"
                                >
                                    <td>Load{{i}}</td>
                                    <td>{{item.instruction ? 'Yes' : 'No'}}</td>
                                    <td>{{item.address || ''}}</td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-col>
                    <v-col cols="8">
                        <v-simple-table
                            fixed-header
                        >
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Name</th>
                                    <th>Busy</th>
                                    <th>OP</th>
                                    <th>Vj</th>
                                    <th>Vk</th>
                                    <th>Qj</th>
                                    <th>Qk</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(item, j) in functionalUnitsList.integer"
                                    :key="'i'+j"
                                >
                                    <td>{{''}}</td>
                                    <td>Integer{{j}}</td>
                                    <td>{{item.instruction ? 'Yes' : 'No'}}</td>
                                    <td>{{''}}</td>
                                    <td>{{''}}</td>
                                    <td>{{''}}</td>
                                    <td>{{''}}</td>
                                    <td>{{''}}</td>
                                </tr>
                                <tr
                                    v-for="(item, j) in functionalUnitsList.floatAdd"
                                    :key="'fA'+j"
                                >
                                    <td>{{''}}</td>
                                    <td>floatAdd{{j}}</td>
                                    <td>{{item.instruction ? 'Yes' : 'No'}}</td>
                                    <td>{{''}}</td>
                                    <td>{{''}}</td>
                                    <td>{{''}}</td>
                                    <td>{{''}}</td>
                                    <td>{{''}}</td>
                                </tr>
                                <tr
                                    v-for="(item, j) in functionalUnitsList.floatMult"
                                    :key="'fM'+j"
                                >
                                    <td>{{''}}</td>
                                    <td>floatMult{{j}}</td>
                                    <td>{{item.instruction ? 'Yes' : 'No'}}</td>
                                    <td>{{''}}</td>
                                    <td>{{''}}</td>
                                    <td>{{''}}</td>
                                    <td>{{''}}</td>
                                    <td>{{''}}</td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-col>
                    <v-col cols="4">
                        <v-simple-table
                            fixed-header
                        >
                            <thead>
                                <tr>
                                    <th>StoreUnit</th>
                                    <th>Busy</th>
                                    <th>Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(item, i) in functionalUnitsList.store"
                                    :key="i"
                                >
                                    <td>Store{{i}}</td>
                                    <td>{{item.instruction ? 'Yes' : 'No'}}</td>
                                    <td>{{item.address || ''}}</td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-col>
                    <v-col cols="4">
                        <v-simple-table
                            fixed-header
                        >
                            <thead>
                                <tr>
                                    <th>Register</th>
                                    <th>Functional Unit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(item, i) in registers.float"
                                    :key="i"
                                >
                                    <td>{{item.name}}</td>
                                    <td>{{item.fu ? item.fu.type + item.fu.index : ''}}</td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-col>
                    <v-col cols="4">
                        <v-simple-table
                            fixed-header
                        >
                            <thead>
                                <tr>
                                    <th>Register</th>
                                    <th>Functional Unit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(item, i) in registers.integer"
                                    :key="i"
                                >
                                    <td>{{item.name}}</td>
                                    <td>{{item.fu ? item.fu.type + item.fu.index : ''}}</td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    import instructionsList from '@/config/instructionsList'
    import functionalUnits from '@/config/functionalUnits'

    export default {
        name: 'Config',
        data: () => ({
            numInstructions: 0,
            instructions: [],
            pipeline: [],
            rules: {
                registerFloat: reg => ((reg != undefined) && (reg.startsWith('f') || reg.startsWith('F')) && (reg.substring(1) !== '') && (!isNaN(reg.substring(1)) && (parseInt(reg.substring(1)) % 2 === 0))) ? true : 'Registrador Inválido',
                registerInt: reg => ((reg != undefined) && (reg.startsWith('r') || reg.startsWith('R')) && (reg.substring(1) !== '') && (!isNaN(reg.substring(1)))) ? true : 'Registrador Inválido',
                number: reg => !isNaN(reg) ? true : 'Valor Inválido',
                branch: reg => !!reg ? true : 'Branch Inválida'
            },
            ready: false,
            runningClock: undefined,
            errors: 0,
            functionalUnitsList: undefined,
            runningPipeline: undefined,
            nextPipeline: undefined,
            registers: {float: [], integer: []}
        }),
        computed: {
            valid () {
                if (this.errors < 1)
                    return true
                return false
            }
        },
        created () {
            instructionsList.map(element => {
                this.instructions.push({
                    text: element.name,
                    value: element
                })
            })
        },
        watch: {
            numInstructions: function (val, oldVal) {
                if (val > oldVal) {
                    while (this.pipeline.length != val) {
                        this.pipeline.push({
                            instruction: undefined,
                            values: [],
                            issue: undefined,
                            exec: undefined,
                            write: undefined
                        })
                    }
                } else {
                    this.pipeline.splice(val)
                }
            }
        },
        methods: {
            sendData () {
                this.runningClock = 0
                this.runningPipeline = []
                this.removeIndexes = []
                this.registers = {float: [], integer: []}
                this.functionalUnitsList = {
                    integer: [],
                    floatAdd: [],
                    floatMult: [],
                    load: [],
                    store: []
                }
                for(let line in this.pipeline) {
                    line = this.pipeline[line]
                    line.issue = undefined,
                    line.exec = undefined,
                    line.write = undefined
                }
                this.updateRegisters()
                this.updateFUs()
                this.ready = !this.ready
            },
            updateRegisters () {
                for (let item in this.pipeline) {
                    item = this.pipeline[item]
                    let cont = 0
                    for (let param in item.instruction.params) {
                        param = item.instruction.params[param]
                        let newReg = {
                            name: item.values[cont],
                            fu: undefined,
                            line: undefined
                        }
                        if (param === 'registerFloat' && this.findRegister(newReg.name) == undefined) {
                            this.registers.float.push(newReg)
                        } else if (param === 'registerInt'  && this.findRegister(newReg.name) == undefined) {
                            this.registers.integer.push(newReg)
                        }
                        cont++
                    }
                }
            },
            updateFUs () {
                 for(let i = 0; i < functionalUnits.loadUnits; i++) {
                    this.functionalUnitsList.load.push({
                        clock: 0,
                        instruction: undefined,
                        address: undefined
                    })
                }
                for(let i = 0; i < functionalUnits.integerUnits; i++) {
                    this.functionalUnitsList.integer.push({
                        clock: 0,
                        instruction: undefined,
                        time: undefined,
                        vi: undefined,
                        vj: undefined,
                        qi: undefined,
                        qj: undefined
                    })
                }
                for(let i = 0; i < functionalUnits.floatAddUnits; i++) {
                    this.functionalUnitsList.floatAdd.push({
                        clock: 0,
                        instruction: undefined,
                        time: undefined,
                        vi: undefined,
                        vj: undefined,
                        qi: undefined,
                        qj: undefined
                    })
                }
                for(let i = 0; i < functionalUnits.floatMultUnits; i++) {
                    this.functionalUnitsList.floatMult.push({
                        clock: 0,
                        instruction: undefined,
                        time: undefined,
                        vi: undefined,
                        vj: undefined,
                        qi: undefined,
                        qj: undefined
                    })
                }
                for(let i = 0; i < functionalUnits.storeUnits; i++) {
                    this.functionalUnitsList.store.push({
                        clock: 0,
                        instruction: undefined,
                        address: undefined
                    })
                }
            },
            updateValueArray (i) {
                for (let index = 0; index < Object.keys(this.pipeline[i].instruction.params).length; index++ ) {
                    this.pipeline[i].values.push(undefined)
                }
            },
            // Busca uma nova instrução a ser executada
            nextInstruction () {
                console.log('NEXTINSTRUCTION')
                for (let i = 0; i < this.pipeline.length; i++) {
                    if (this.pipeline[i].issue === undefined)
                        return this.pipeline[i]

                }
                console.log('/NEXTINSTRUCTION')
                return null
            },
            // Encontra uma FU livre para uma Instrução
            findFreeFU (instruction) {
                console.log('FINDFREEFU')
                let unit = {
                    type: instruction.functionalUnit,
                    index: undefined
                }
                this.functionalUnitsList[unit.type].map((element, i) => {
                    if (unit.index === undefined && element.instruction === undefined) {
                        unit.index = i
                    }
                })
                console.log('/FINDFREEFU')
                return unit
            },
            // Executa o Pipeline Corrente
            runPrevPipeline () {
                console.log('RUNPREVPIPELINE')
                console.log('RUNNING PIPELINE ', this.runningPipeline)
                let length = this.runningPipeline.length
                for (let i = 0; i < length; i++) {
                    this.run(this.runningPipeline[i])
                }
                console.log('/RUNPREVPIPELINE')
            },
            // Encontra um registrador no banco de registradores
            findRegister (register) {
                if (register.startsWith('f') || register.startsWith('F')) {
                    for (let reg in this.registers.float) {
                        reg = this.registers.float[reg]
                        if (reg.name === register) {
                            return reg
                        }
                    }
                } else if (register.startsWith('r') || register.startsWith('R')) {
                    for (let reg in this.registers.integer) {
                        reg = this.registers.integer[reg]
                        if (reg.name === register) {
                            return reg
                        }
                    }
                }
                return undefined
            },
            // Checa se um Registrador está livre para uso
            isRegisterFree (register, line) {
                if (register.line) {
                    if (register.line === line) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    if (register.fu) {
                        return false
                    }
                    return true
                }
            },
            // Executa uma Linha e seleciona a FU correta
            run ({ line, freeFu }) {
                console.log('RUN')
                // Implica que há uma FU disponível
                if (freeFu.index !== undefined) {
                    let fu = this.functionalUnitsList[freeFu.type][freeFu.index]
                    // Registrador na line.values[0] sempre será o registrador de destino
                    let register = this.findRegister(line.values[0])
                    if (this.isRegisterFree(register, line)) {
                        register.fu = freeFu
                        register.line = line
                        let exec
                        if (freeFu.type === 'load')
                            exec = this.execOnLoad(line, fu)
                        if (exec) {
                            this.nextPipeline.push({ line: line, freeFu: freeFu })
                        }
                    }
                }
                console.log('/RUN')
            },
            removeRegister (register) {
                let index = this.registers.float.indexOf(register)
                if (index !== -1) {
                    this.registers.float[index] = {
                        name: this.registers.float[index].name,
                        fu: undefined,
                        line: undefined
                    }
                } else {
                    index = this.registers.integer.indexOf(register)
                    this.registers.integer[index] = {
                        name: this.registers.integer[index].name,
                        fu: undefined,
                        line: undefined
                    }
                }
            },
            // Executa uma Linha numa FU do tipo Float
            // Retorna true se continua e false se acabou
            execOnLoad (line, fu) {
                console.log('EXECONLOAD')
                console.log('LINE -> ', line)
                console.log('Instruction CLOCK -> ', line.instruction.clock)
                console.log('Exec CLOCK -> ', fu.clock)
                let index = this.pipeline.indexOf(line)
                if (fu.clock === 0) {
                    console.log('FUCLOCK0')
                    fu.instruction = line.instruction
                    fu.address = line.values[1] + '+' + line.values[2]
                    this.pipeline[index].issue = this.runningClock
                } else if (fu.clock === line.instruction.clock) {
                    console.log('FUCLOCK=INSTRUCTIONCLOCK')
                    this.pipeline[index].exec = this.runningClock
                } else if (fu.clock === line.instruction.clock + 1) {
                    console.log('FUCLOCK=INSTRUCTIONCLOCK+1')
                    this.pipeline[index].write = this.runningClock
                    this.removeRegister(this.findRegister(line.values[0]))
                    fu.clock = 0
                    fu.instruction = undefined
                    fu.address = undefined
                    return false
                }
                fu.clock++
                console.log('/EXECONLOAD')
                return true
            },
            execOnStore () {},
            execOnFloatAdd () {},
            execOnFloatMult () {},
            execOnInteger () {},
            // Executa Um Ciclo de Clock
            runOneClock () {
                console.log('RUNONECLOCK')
                this.nextPipeline = []
                this.runningClock++
                this.runPrevPipeline()
                let line = this.nextInstruction()
                // Implica que há uma próxima função a ser executada
                if (line !== null) {
                    let freeFu = this.findFreeFU(line.instruction)
                    this.run({line: line, freeFu: freeFu})
                }
                this.runningPipeline = Object.assign([], this.nextPipeline)
                console.log('/RUNONECLOCK')
            },
            runAllClocks () {

            }
        }
    }
</script>
