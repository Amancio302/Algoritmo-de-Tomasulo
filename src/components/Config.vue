<template>
    <v-card>
        <v-system-bar color="deep-purple darken-3"></v-system-bar>
        <v-app-bar
            color="deep-purple accent-4"
            dark
            prominent
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>Algoritmo de Tomasulo</v-toolbar-title>
            <v-spacer />
            <v-btn text @click.stop="dialog = true">
                Ajuda
            </v-btn>
        </v-app-bar>
        <v-dialog
            v-model="dialog"
            max-width="350"
            >
            <v-card>
                <v-card-title class="headline">Utilização do Sistema</v-card-title>
                <v-card-text>
                    Para configurar as instruções, clique no menu e procure a aba <b>"Instruções"</b>
                    <ul>
                        <li>
                            Nessa aba você poderá alterar o clock das funções
                        </li>
                    </ul>
                    Para configurar a pipeline, clique no menu e procure a aba <b>"Pipeline</b>"<br />
                    <ul>
                        <li>
                            Nessa aba você pode criar uma configuração personalizada ou carregar uma predefinida<br />
                        </li>
                    </ul>
                    <br />Após concluída as configurações, ainda na aba <b>"Pipeline</b>", clique em <b>"Enviar</b>"<br />
                    
                    <br />Se quiser editar sua configuração, deverá abrir o menu e na aba <b>"Pipeline</b>" clicar em <b>"Editar</b>"<br />
                    
                    <br />Clique em <b>"Rodar um Ciclo</b>" para rodar um ciclo<br />
                    <br />Clique em <b>"Rodar todos os Ciclos</b>" para rodar todos os ciclos<br />
                </v-card-text>
            </v-card>
        </v-dialog>
        <v-navigation-drawer
            v-model="drawer"
            absolute
            bottom
            temporary
            app
            width="600"
        >
            <v-card>
                <v-card-title>Configurações</v-card-title>
                <v-row no-gutters justify="right">
                    <v-spacer />
                    <v-card-title>Instruções</v-card-title>
                </v-row>
                <v-card-text>
                    <v-row>
                        <v-col
                            v-for="(item, i) in instructions"
                            :key="i"
                            cols="6"
                        >
                            <v-text-field
                                :label="item.value.name"
                                hint="Insira o número de ciclos gastos na execução da instrução"
                                persistent-hint
                                type="number"
                                v-model="item.value.clock"
                                :suffix=" item.value.clock > 1 ? 'Ciclos' : 'Ciclo'"
                                :error="item.value.clock < 1"
                                outlined
                                :readonly="ready"
                            />
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-row no-gutters justify="right">
                    <v-spacer />
                    <v-card-title>Pipeline</v-card-title>
                </v-row>
                <v-card-text>
                    <v-row no-gutters justify="space-around" align="end">
                        <v-col cols="5">
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
                        <v-col cols="4">
                            <v-select
                                :items="myModels"
                                v-model="selectedModel"
                                outlined
                                :readonly="ready"
                                label="Carregar de JSON"
                                @input="loadFromJSON"
                            />
                        </v-col>
                        <v-col cols="2">
                            <v-btn
                                @click="sendData"
                                :color="ready ? 'primary' : 'success'"
                                :disabled="numInstructions < 1 || !valid"
                            >
                                    {{ ready ? 'Editar' : !valid ? 'Inválido' : 'Enviar' }}
                            </v-btn>
                        </v-col>
                    </v-row>
                    <v-row v-if="numInstructions" no-gutters>
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
                                <v-row v-if="pipeline[i].instruction" justify="center" no-gutters>
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
            </v-card>
        </v-navigation-drawer>
        <v-row no-gutters>
            <v-col cols="12">
                <v-card
                    v-if="ready"
                >
                    <v-row justify="space-between" align="center">
                        <v-col cols="5">
                            <v-card>
                                <v-card-title>
                                    Clock: {{tomasulo.runningClock}}
                                </v-card-title>
                            </v-card>
                        </v-col>
                        <v-col cols="3">
                            <v-btn color="primary" @click="runOneClock">Rodar um ciclo</v-btn>
                        </v-col>
                        <v-col cols="3">
                            <v-btn color="primary" @click="runAllClocks">Rodar todos os ciclos</v-btn>
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
                                        v-for="(item, i) in tomasulo.functionalUnits.loadUnits"
                                        :key="i"
                                    >
                                        <td>Load{{i}}</td>
                                        <td>{{item.line ? 'Yes' : 'No'}}</td>
                                        <td>{{item.line ? `${item.line.values[1]} + ${item.line.values[2]}` : ''}}</td>
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
                                        v-for="(item, j) in tomasulo.functionalUnits.integerUnits"
                                        :key="'i'+j"
                                    >
                                        <td>{{item.line ? item.clock > 0 ? item.line.instruction.clock - item.clock : '' : '' }}</td>
                                        <td>Integer{{j}}</td>
                                        <td>{{item.line ? 'Yes' : 'No'}}</td>
                                        <td>{{item.line ? item.line.instruction.name : ''}}</td>
                                        <td>{{item.j ? item.j.value ? item.j.value.name || item.j.value : '' :''}}</td>
                                        <td>{{item.k ? item.k.value ? item.k.value.name || item.k.value : '' :''}}</td>
                                        <td>{{item.j ? item.j.value ? '' : item.j.fu ? item.j.fu.name : '' : ''}}</td>
                                        <td>{{item.k ? item.k.value ? '' : item.k.fu ? item.k.fu.name : '' : ''}}</td>
                                    </tr>
                                    <tr
                                        v-for="(item, j) in tomasulo.functionalUnits.floatAddUnits"
                                        :key="'fA'+j"
                                    >
                                        <td>{{item.line ? item.clock > 0 ? item.line.instruction.clock - item.clock : '' : '' }}</td>
                                        <td>floatAdd{{j}}</td>
                                        <td>{{item.line ? 'Yes' : 'No'}}</td>
                                        <td>{{item.line ? item.line.instruction.name : ''}}</td>
                                        <td>{{item.j ? item.j.value ? item.j.value.name || item.j.value : '' :''}}</td>
                                        <td>{{item.k ? item.k.value ? item.k.value.name || item.k.value : '' :''}}</td>
                                        <td>{{item.j ? item.j.value ? '' : item.j.fu ? item.j.fu.name : '' : ''}}</td>
                                        <td>{{item.k ? item.k.value ? '' : item.k.fu ? item.k.fu.name : '' : ''}}</td>
                                    </tr>
                                    <tr
                                        v-for="(item, j) in tomasulo.functionalUnits.floatMultUnits"
                                        :key="'fM'+j"
                                    >
                                        <td>{{item.line ? item.clock > 0 ? item.line.instruction.clock - item.clock : '' : '' }}</td>
                                        <td>floatMult{{j}}</td>
                                        <td>{{item.line ? 'Yes' : 'No'}}</td>
                                        <td>{{item.line ? item.line.instruction.name : ''}}</td>
                                        <td>{{item.j ? item.j.value ? item.j.value.name || item.j.value : '' :''}}</td>
                                        <td>{{item.k ? item.k.value ? item.k.value.name || item.k.value : '' :''}}</td>
                                        <td>{{item.j ? item.j.value ? '' : item.j.fu ? item.j.fu.name : '' : ''}}</td>
                                        <td>{{item.k ? item.k.value ? '' : item.k.fu ? item.k.fu.name : '' : ''}}</td>
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
                                        v-for="(item, i) in tomasulo.functionalUnits.storeUnits"
                                        :key="i"
                                    >
                                        <td>Store{{i}}</td>
                                        <td>{{item.line ? 'Yes' : 'No'}}</td>
                                        <td>{{item.line ? `${item.line.values[1]} + ${item.line.values[2]}` : ''}}</td>
                                    </tr>
                                </tbody>
                            </v-simple-table>
                        </v-col>
                        <v-col cols="6">
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
                                        v-for="(item, i) in tomasulo.registers"
                                        :key="i"
                                    >
                                        <td v-if="!item.temp">{{item.name}}</td>
                                        <td v-if="!item.temp">{{item.fu ? item.fu.name : item.value ? item.value.value : ''}}</td>
                                    </tr>
                                </tbody>
                            </v-simple-table>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
    import instructionsList from '@/config/instructionsList'
    import functionalUnitsList from '@/config/functionalUnits'
    import models from '@/config/models'

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
            errors: 0,
            functionalUnitsList: undefined,
            tomasulo: undefined,
            selectedModel: undefined,
            myModels: [{
                text: 'Sem Modelo',
                value: -1
            }],
            drawer: true,
            dialog: false
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
            models.map((element, i) => {
                this.myModels.push({
                    text: 'Modelo ' + i,
                    value: i
                })
            })
        },
        watch: {
            numInstructions: function (val, oldVal) {
                if (val < 0) {
                    this.numInstructions = 0
                } else if (val > oldVal) {
                    while (this.pipeline.length != val) {
                        this.pipeline.push({
                            instruction: undefined,
                            values: [],
                        })
                    }
                } else {
                    this.pipeline.splice(val)
                }
            }
        },
        methods: {
            // Carrega um modelo importado de @/config/models.js
            loadFromJSON () {
                this.pipeline = []
                if (this.selectedModel !== -1) {
                    let model = models[this.selectedModel]
                    this.numInstructions = model.length
                    for (let line in model) {
                        line = model[line]
                        this.pipeline.push(line)
                    }
                } else {
                    this.numInstructions = 0
                }
            },
            updateValueArray (i) {
                this.pipeline[i].values = []
                for (let index = 0; index < Object.keys(this.pipeline[i].instruction.params).length; index++ ) {
                    this.pipeline[i].values.push(undefined)
                }
            },
            // Com base na configuração carregada em functinalUnits.js, essa função instancia
            // Unidades Funcionais e as retorna
            updateFunctionalUnits () {
                console.log('---UPDATE---UNITS---')
                let functionalUnits = {}
                for (let unitType in functionalUnitsList) {
                    functionalUnits[unitType] = []
                    for (let i = 0; i< functionalUnitsList[unitType]; i++) {
                        functionalUnits[unitType].push({
                            name: unitType + functionalUnits[unitType].length,
                            clock: 0,
                            line: undefined,
                            j: undefined,
                            k: undefined,
                            d: undefined
                        })
                    }
                }
                console.log('---UPDATE---UNITS---')
                return functionalUnits
            },
            // Com base nos dados preenchidos pelo usuário, essa função instancia registradores
            // para cada registrador utilizado
            updateRegisters () {
                console.log('---UPDATE---REGISTERS---')
                let registers = []
                for (let line in this.pipeline) {
                    line = this.pipeline[line]
                    for (let value in line.values) {
                        value = line.values[value]
                        if (value) {
                            let index = this.findRegister(registers, value)
                            if (index === -1) {
                                registers.push({
                                    name: value,
                                    fu: undefined,
                                    value: undefined
                                })
                            }
                        }
                    }
                }
                console.log('---UPDATE---REGISTERS---')
                return registers
            },
            updatePipeline () {
                console.log('---UPDATE---PIPELINE---')
                for (let line in this.pipeline) {
                    line = this.pipeline[line]
                    line.issue = undefined
                    line.exec = undefined
                    line.write = undefined
                }
                console.log('---UPDATE---PIPELINE---')
            },
            // Procura pelo nome de um registrador numa lista de registradores e retorna
            // A posição onde o encontrou. Retorna -1 se não encontrar
            findRegister (registerList, regName) {
                console.log('---FIND---REGISTER---')
                if (!regName) {
                    return null
                }
                let type
                if (regName.startsWith('f') || regName.startsWith('F') || regName.startsWith('r') || regName.startsWith('R')) {
                    for (let index in registerList) {
                        let register = registerList[index]
                        if (register.name === regName) {
                            console.log('---FIND---REGISTER---')
                            return index
                        }
                    }
                    return -1
                }
                console.log('---FIND---REGISTER---')
                return null
            },
            sendData () {
                console.log('---SEND---DATA---')
                let functionalUnits = this.updateFunctionalUnits()
                let registers = this.updateRegisters()
                this.updatePipeline()
                this.tomasulo = {
                    functionalUnits: functionalUnits,
                    registers: registers,
                    runningClock: 0,
                    runningPipeline: [],
                    nextPipeline: [],
                    execPipeline: [],
                    removeRunningPipeline: [],
                    endedLines: 0
                }
                this.ready = !this.ready
                console.log('---SEND---DATA---')
            },
            runOneClock () {
                console.log('---RUN---ONE---CLOCK---')
                if (!this.hasEnded()) {
                    this.tomasulo.nextPipeline = []
                    this.tomasulo.runningClock++
                    const line = this.findNextInstruction()
                    if (line) {
                        this.fetch(line)
                    }
                    this.runPipeline()
                    this.execPipeline()
                    console.log('NEXT PIPELINE', Object.assign([], this.tomasulo.nextPipeline))
                    this.tomasulo.runningPipeline = Object.assign([], this.tomasulo.nextPipeline)
                } else {
                    alert('Finalizado')
                }
                console.log('---RUN---ONE---CLOCK---')
                return this.hasEnded()
            },
            hasEnded () {
                if (this.tomasulo.endedLines === this.pipeline.length) {
                    return true
                }
                return false
            },
            // Executa o pipeline de execução
            execPipeline () {
                console.log('---EXEC---PIPELINE---')
                console.log('EXEC PIPELINE', Object.assign([], this.tomasulo.execPipeline))
                let removeIndexes = []
                for (let item in this.tomasulo.execPipeline) {
                    let functionalUnit = this.tomasulo.execPipeline[item]
                    if (this.exec(functionalUnit)) {
                        removeIndexes.push(item)
                    }
                }
                for (let i in removeIndexes) {
                    let index = removeIndexes[i]
                    this.tomasulo.execPipeline.splice(index, 1)
                }
                console.log('---EXEC---PIPELINE---')
            },
            runPipeline () {
                console.log('---RUN---PIPELINE---')
                console.log('RUNNING PIPELINE', Object.assign([], this.tomasulo.runningPipeline))
                for (let item in this.tomasulo.runningPipeline) {
                    this.run(this.tomasulo.runningPipeline[item])
                }
                this.removeRunningPipeline()
                console.log('---RUN---PIPELINE---')
            },
            runBNEZ (functionalUnit) {
                console.log('---RUN---BNEZ---')
                let index = this.pipeline.indexOf(functionalUnit.line)
                let aux = true
                if (!functionalUnit.line.issue) {
                    functionalUnit.line.issue = this.tomasulo.runningClock
                    functionalUnit.j = functionalUnit.line.values[0]
                } else {
                    for (let i = 0; i < index; i++) {
                        if (!this.pipeline[i].write) {
                            aux = false
                        }
                    }
                    if (aux) {
                        functionalUnit.clock++
                        if (functionalUnit.clock === functionalUnit.line.instruction.clock) {
                            functionalUnit.line.exec = this.tomasulo.runningClock
                        } else if (functionalUnit.clock > functionalUnit.line.instruction.clock) {
                            functionalUnit.line.write = this.tomasulo.runningClock
                            functionalUnit.clock = 0
                            functionalUnit.line = undefined
                            functionalUnit.j = undefined
                            functionalUnit.k = undefined
                            functionalUnit.d = undefined
                            this.tomasulo.endedLines++
                            functionalUnit
                            console.log('---RUN---BNEZ---')
                            return 0
                        }
                    }
                }
                this.tomasulo.nextPipeline.push(functionalUnit)
                console.log('---RUN---BNEZ---')
            },
            runBEQ (functionalUnit) {
                console.log('---RUN---BEQ---')
                let index = this.pipeline.indexOf(functionalUnit.line)
                let aux = true
                if (!functionalUnit.line.issue) {
                    functionalUnit.line.issue = this.tomasulo.runningClock
                    functionalUnit.j = functionalUnit.line.values[0]
                    functionalUnit.k = functionalUnit.line.values[1]
                } else {
                    for (let i = 0; i < index; i++) {
                        if (!this.pipeline[i].write) {
                            aux = false
                        }
                    }
                    if (aux) {
                        functionalUnit.clock++
                        if (functionalUnit.clock === functionalUnit.line.instruction.clock) {
                            functionalUnit.line.exec = this.tomasulo.runningClock
                        } else if (functionalUnit.clock > functionalUnit.line.instruction.clock) {
                            functionalUnit.line.write = this.tomasulo.runningClock
                            functionalUnit.clock = 0
                            functionalUnit.line = undefined
                            functionalUnit.j = undefined
                            functionalUnit.k = undefined
                            functionalUnit.d = undefined
                            this.tomasulo.endedLines++
                            functionalUnit
                            console.log('---RUN---BEQ---')
                            return 0
                        }
                    }
                }
                this.tomasulo.nextPipeline.push(functionalUnit)
                console.log('---RUN---BEQ---')
            },
            run (functionalUnit) {
                console.log('---RUN---')
                if (functionalUnit.line.instruction.name === 'BNEZ') {
                    this.runBNEZ(functionalUnit)
                } else if (functionalUnit.line.instruction.name === 'BEQ') {
                    this.runBEQ(functionalUnit)
                } else {
                    // Testa se o registrador de destino já foi setado
                    if (!functionalUnit.d) {
                        let index = this.findRegister(this.tomasulo.registers, functionalUnit.line.values[0])
                        if (index !== -1 && index !== null) {
                            let regD = this.tomasulo.registers[index]
                            console.log('FU do REG D de ', functionalUnit.line.instruction.name, ': ', functionalUnit )
                            if (!regD.fu) {
                                // Define que o registrador está sendo calculado pela FU
                                functionalUnit.d = regD
                                regD.fu = functionalUnit
                            }
                        }
                    }
                    // Checa se já está numa issue
                    if (functionalUnit.line.issue) {
                        // Checa se a execão já começou
                        if (functionalUnit.clock === 0) {
                            // Checa se j e k estão prontos
                            if (functionalUnit.d && (!functionalUnit.j.fu || functionalUnit.j.fu === functionalUnit) && (!functionalUnit.k.fu || functionalUnit.k.fu === functionalUnit)) {
                                this.tomasulo.execPipeline.push(functionalUnit)
                                const index = this.tomasulo.runningPipeline.indexOf(functionalUnit)
                                this.tomasulo.removeRunningPipeline.push(index)
                            } else {
                                this.tomasulo.nextPipeline.push(functionalUnit)
                            }
                        }
                    } else if (functionalUnit.line.issue === undefined) {
                        let index = this.findRegister(this.tomasulo.registers, functionalUnit.line.values[1])
                        if (index !== -1 && index !== null) {
                            let regJ = this.tomasulo.registers[index]
                            if (!regJ.fu && !regJ.value) {
                                functionalUnit.j = this.renamedRegister(regJ)
                            } else {
                                functionalUnit.j = regJ
                            }
                        } else {
                            functionalUnit.j = functionalUnit.line.values[1]
                        }
                        index = this.findRegister(this.tomasulo.registers, functionalUnit.line.values[2])
                        if (index !== -1 && index !== null) {
                            let regK = this.tomasulo.registers[index]
                            if (!regK.fu && !regK.value) {
                                functionalUnit.k = this.renamedRegister(regK)
                            } else {
                                functionalUnit.k = regK
                            }
                        } else {
                            functionalUnit.k = functionalUnit.line.values[2]
                        }
                        functionalUnit.line.issue = this.tomasulo.runningClock
                        this.tomasulo.nextPipeline.push(functionalUnit)
                    }
                    console.log('---RUN---')
                    return 0
                }
                console.log('---RUN---')
            },
            removeRunningPipeline () {
                for (let item in this.tomasulo.removeRunningPipeline) {
                    item = this.tomasulo.removeRunningPipeline[item]
                    this.tomasulo.runningPipeline.splice(item, 1)
                }
            },
            // Adiciona uma função ao pipeline corrente
            fetch (line) {
                const fu = this.findFreeFu(line)
                if (fu !== null) {
                    fu.line = line
                    this.tomasulo.runningPipeline.push(fu)
                }
            },
            // Roda pelo pipeline e descobre qual a próxima função a ser executada
            findNextInstruction () {
                console.log('---FIND---NEXT---INSTRUCTION---')
                for (let line in this.pipeline) {
                    line = this.pipeline[line]
                    if (!line.issue) {
                        console.log('---FIND---NEXT---INSTRUCTION---')
                        return line
                    }
                }
                console.log('---FIND---NEXT---INSTRUCTION---')
                return false
            },
            // Busca por uma unidade funcional livre para execução de uma instrução
            // Retorna uma disponível e se não houver, nulo
            findFreeFu (line) {
                console.log('---FIND---FREE---UNIT---')
                for (let functionalUnit in this.tomasulo.functionalUnits[line.instruction.functionalUnit]) {
                    functionalUnit = this.tomasulo.functionalUnits[line.instruction.functionalUnit][functionalUnit]
                    // Se não estiver ocupada ou se estiver ocupada com a linha passada
                    if (!functionalUnit.line || functionalUnit.line === line) {
                        console.log('---FIND---FREE---UNIT---')
                        return functionalUnit
                    }
                }
                console.log('---FIND---FREE---UNIT---')
                return null
            },
            // Essa função executa a operação salva em uma Unidade Funcional
            exec (functionalUnit) {
                console.log('---EXEC---')
                functionalUnit.clock++
                // Testa se já completou a execução
                if (functionalUnit.clock === functionalUnit.line.instruction.clock) {
                    functionalUnit.line.exec = this.tomasulo.runningClock
                } else if (functionalUnit.clock > functionalUnit.line.instruction.clock) {
                    functionalUnit.line.write = this.tomasulo.runningClock
                    functionalUnit.d.fu = undefined
                    functionalUnit.d.value = this.renamedRegister(functionalUnit.d)
                    functionalUnit.clock = 0
                    functionalUnit.line = undefined
                    functionalUnit.j = undefined
                    functionalUnit.k = undefined
                    functionalUnit.d = undefined
                    this.tomasulo.endedLines++
                    console.log('---EXEC---')
                    return true
                }
                console.log('---EXEC---')
                return false
            },
            renamedRegister (register) {
                console.log('---RENAMED---REGISTER---')
                if (register.value) {
                    console.log('---RENAMED---REGISTER---')
                    return register.value
                } else {
                    let rename = 1
                    let type = register.name.startsWith('F') || register.name.startsWith('f') ? 'F' : register.name.startsWith('r') || register.name.startsWith('R') ? 'R' : ''
                    while (this.findRegister(this.tomasulo.registers, type + this.toLetters(rename)) !== -1) {
                        rename++
                    }
                    rename = type + this.toLetters(rename)
                    let reg = {
                        name: rename,
                        value: rename,
                        temp: true
                    }
                    this.tomasulo.registers.push(reg)
                    console.log('---RENAMED---REGISTER---')
                    return reg
                }
            },
            toLetters(num) {
                "use strict";
                var mod = num % 26,
                    pow = num / 26 | 0,
                    out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
                return pow ? this.toLetters(pow) + out : out;
            },
            runAllClocks () {
                while (!this.runOneClock()) {}
            }
        }
    }
</script>
