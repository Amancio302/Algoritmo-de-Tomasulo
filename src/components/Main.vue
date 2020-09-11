<template>
    <div>
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
        temporary
        app
        width="600"
    >
        <v-card>
            <v-card-title>Configurações</v-card-title>
            <v-row no-gutters justify="end">
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
            <v-row no-gutters justify="end">
                <v-spacer />
                <v-card-title>Pipeline</v-card-title>
            </v-row>
            <v-card-text>
                <v-row no-gutters justify="space-around" align="center">
                    <v-col cols="5">
                        <v-text-field
                            label="Número de Instruções do bloco básico"
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
                            block
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
                                @input="pipeline[i].updateInstruction()"
                            />
                            <v-row v-if="pipeline[i].instruction" justify="center" no-gutters>
                                <v-col 
                                    v-for="(value, index) in pipeline[i].instruction.params"
                                    :key="index"
                                    cols="4"
                                >
                                    <v-text-field
                                        v-model="pipeline[i].inputParams[index]"
                                        outlined
                                        :readonly="ready"
                                        :rules="pipeline[i].validateParam(index)"
                                        :success="pipeline[i].validateParam(index)[0] === true"
                                        :label="paramLabel(pipeline[i].instruction.params[index])"
                                    />
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-row>
            </v-card-text>
        </v-card>
    </v-navigation-drawer>
    <v-card>
        <v-row no-gutters>
            <v-col cols="12">
                <v-card>
                    <v-row justify="space-between" align="center">
                        <v-col cols="5">
                            <v-card-title>
                                Clock: {{runningClock}}
                            </v-card-title>
                        </v-col>
                        <v-col cols="3">
                            <v-btn color="primary" @click="runOneClock">Rodar um ciclo</v-btn>
                        </v-col>
                        <v-col cols="3">
                            <v-btn color="primary" @click="runAllClocks">Rodar todos os ciclos</v-btn>
                        </v-col>
                    </v-row>
                    <v-row justify="center" align="start" v-if="ready">
                        <v-col cols="8">
                            <v-simple-table
                                fixed-header
                            >
                                <thead>
                                    <tr>
                                        <th>Instruction</th>
                                        <th>d</th>
                                        <th>j</th>
                                        <th>k</th>
                                        <th>Issue</th>
                                        <th>Exec Comp</th>
                                        <th>Write Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="(item, i) in tomasuloPipeline"
                                        :key="i"
                                    >
                                        <td>{{item.instruction.name}}</td>
                                        <td>{{pipeline[i].inputParams[0] || ''}}</td>
                                        <td>{{pipeline[i].inputParams[1] || ''}}</td>
                                        <td>{{pipeline[i].inputParams[2] || ''}}</td>
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
                                        v-for="(item, i) in filteredUnits.load()"
                                        :key="i"
                                    >
                                        <td>{{item.name}}</td>
                                        <td>{{item.line ? 'Yes' : 'No'}}</td>
                                        <td>{{item.line ? `${item.j().name} + ${item.k().name}` : ''}}</td>
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
                                        v-for="(item, j) in filteredUnits.units()"
                                        :key="j"
                                    >
                                        <td>{{item.line ? item.clock > 0 ? item.line.instruction.clock - item.clock : '' : '' }}</td>
                                        <td>{{item.name}}</td>
                                        <td>{{item.line ? 'Yes' : 'No'}}</td>
                                        <td>{{item.line ? item.line.instruction.name : ''}}</td>
                                        <td>{{item.j() ? item.j() instanceof RenamedRegister ? item.j().name : '' : ''}}</td>
                                        <td>{{item.k() ? item.k() instanceof RenamedRegister ? item.k().name : '' : ''}}</td>
                                        <td>{{item.j() ? item.j().value ? item.j().value.name : '' : ''}}</td>
                                        <td>{{item.k() ? item.k().value ? item.k().value.name : '' : ''}}</td>
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
                                        v-for="(item, i) in filteredUnits.store()"
                                        :key="i"
                                    >
                                        <td>{{item.name}}</td>
                                        <td>{{item.line ? 'Yes' : 'No'}}</td>
                                        <td>{{item.line ? `${item.line.inputParams[1].name} + ${item.line.inputParams[2].name}` : ''}}</td>
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
                                        v-for="(item, i) in registers"
                                        :key="i"
                                    >
                                        <td>{{item.name}}</td>
                                        <td>{{item.value ? item.value.name : ''}}</td>
                                    </tr>
                                </tbody>
                            </v-simple-table>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
  </div>
</template>

<script>
import instructionsList from '@/config/instructionsList'
import functionalUnitsList from '@/config/functionalUnitsList'
import models from '@/config/models'
import Const from '@/config/Const'
import rules from '@/config/rules'
import Line from '@/model/Line'
import FunctionalUnit from '@/model/FunctionalUnit'
import Register from '@/model/Register'
import RenamedRegister from '@/model/RenamedRegister'

export default {
    name: 'Tomasulo',
    data: () => ({
        drawer: true,
        dialog: true,
        instructions: undefined,
        numInstructions: 0,
        pipeline: [],
        ready: false,
        myModels: [{
                text: 'Sem Modelo',
                value: -1
        }],
        selectedModel: undefined,
        valid: true,
        functionalUnits: undefined,
        tomasuloPipeline: undefined,
        completedLines: undefined,
        runningPipeline: undefined
    }),
    created () {
        this.getInstructions()
        this.getModels()
    },
    watch: {
        numInstructions: function (val, oldVal) {
            if (val < 0) {
                this.numInstructions = 0
            } else if (val > oldVal) {
                while (this.pipeline.length != val) {
                    this.pipeline.push(new Line())
                }
            } else {
                this.pipeline.splice(val)
            }
        }
    },
    computed: {
        runningClock: function () {
            return this.$store.getters.globalClock
        },
        filteredUnits: function () {
            return {
                load: () => {
                    const aux = this.functionalUnits.filter(unit => {
                        return unit.type === Const.functionalUnits.load
                    })
                    return aux
                },
                store: () => {
                    return this.functionalUnits.filter(unit => {
                        return unit.type === Const.functionalUnits.store
                    })
                },
                units: () => {
                    return this.functionalUnits.filter(unit => {
                        return (unit.type !== Const.functionalUnits.load && unit.type !== Const.functionalUnits.store)
                    })
                },
                floatAdd: () => {
                    return this.functionalUnits.filter(unit => {
                        return unit.type === Const.functionalUnits.floatAdd
                    })
                },
                floatMul: () => {
                    return this.functionalUnits.filter(unit => {
                        return unit.type === Const.functionalUnits.floatMul
                    })
                }
            }
        },
        registers: function () {
            return this.$store.getters.registers
        },
        RenamedRegister: function () {
            return RenamedRegister
        },
        Register: function () {
            return Register
        }
    },
    methods: {
        getInstructions () {
            this.instructions = []
            for (let index in instructionsList) {
                const item = instructionsList[index]
                this.instructions.push({
                    text: item.name,
                    value: item
                })
            }
        },
        getModels () {
            this.myModels = []
            let modelCount = 1
            models.map(model => {
                this.myModels.push({
                    text: 'Modelo ' + modelCount++,
                    value: model
                })
            })
        },
        getFunctionalUnits () {
            this.functionalUnits = []
            for (let unitType in functionalUnitsList) {
                for (let i = 0; i < functionalUnitsList[unitType]; i++) {
                    this.functionalUnits.push(new FunctionalUnit(unitType, i))
                }
            }
        },
        getRegisters () {
            this.$store.commit('resetRegisters')
            for (let line in this.pipeline) {
                line = this.pipeline[line]
                for (let index in line.inputParams) {
                    const value = line.inputParams[index]
                    if (value && rules.input.registerFloat.validate(value)[0] === true) {
                        const exists = this.$store.getters.hasRegister(value)
                        if (exists === false) {
                            const reg = new Register(line.instruction.params[index], value)
                            this.$store.commit('addRegister', reg)
                        }
                    }
                }
            }
        },
        setInstructionsAsNumber () {
            for (let index in this.instructions) {
                const instruction = this.instructions[index]
                instruction.value.clock = parseInt(instruction.value.clock, 10)
            }
        },
        setTomasuloPipeline () {
            this.tomasuloPipeline = []
            for (let index in this.pipeline) {
                const line = this.pipeline[index]
                let inputParams = []
                for (let i in line.inputParams) {
                    const param = line.inputParams[i]
                    let reg
                    if (rules.input.registerFloat.validate(param)[0] === true) {
                        const j = this.$store.getters.hasRegister(param)
                        reg = this.$store.getters.register(j)
                    } else {
                        reg = new RenamedRegister(param)
                    }
                    inputParams.push(reg)
                }
                this.tomasuloPipeline.push(new Line(line.instruction, inputParams))
            }
        },
        paramLabel (param) {
            for (let label in Const.params) {
                if (param === Const.params[label]) {
                    return label
                }
            }
            return 'ERROR'
        },
        loadFromJSON () {
            this.pipeline = []
            if (this.selectedModel !== -1) {
                this.numInstructions = this.selectedModel.length
                for (let line in this.selectedModel) {
                    line = this.selectedModel[line]
                    this.pipeline.push(line)
                }
            } else {
                this.numInstructions = 0
            }
        },
        sendData () {
            if (this.ready) {
                this.ready = false
            } else {
                this.$store.commit('resetClock')
                this.getFunctionalUnits()
                this.getRegisters()
                this.setTomasuloPipeline()
                this.setInstructionsAsNumber()
                this.completedLines = 0
                this.runningPipeline = []
                this.ready = true
            }
        },
        runOneClock() {
            if (this.tomasuloPipeline.length !== this.completedLines || this.runningPipeline.length !== 0) {
                this.$store.commit('increaseClock')
                const nextInstruction = this.findNextInstruction()
                if (nextInstruction) {
                    const functionalUnit = this.findFreeFunctionalUnit(nextInstruction.instruction.functionalUnitType)
                    if (functionalUnit) {
                        functionalUnit.line = nextInstruction
                        this.runningPipeline.push(functionalUnit)
                    }
                }
                this.runFunctionalUnits()
                return true
            }
            alert('Execução terminou')
            return false

        },
        runAllClocks () {
            while (this.runOneClock()) {}
        },
        findNextInstruction () {
            for (let index in this.tomasuloPipeline) {
                const line = this.tomasuloPipeline[index]
                if (!line.issue) {
                    if (line.instruction.branchInstruction()) {
                        for (let index in line.inputParams) {
                            const param = line.inputParams[index]
                            if (!param.available()) {
                                return undefined
                            }
                        }
                        return line
                    } else if (line.instruction.name === 'S.D') {
                            return line
                    } else {
                        if (line.inputParams[0].available()) {
                            return line
                        }
                        return undefined   
                    }
                }
            }
            return undefined
        },
        findFreeFunctionalUnit (functionalUnitType) {
            for (let index in this.functionalUnits) {
                const fu = this.functionalUnits[index]
                if (fu.available() && fu.type === functionalUnitType) {
                    return fu
                }
            }
            return undefined
        },
        runFunctionalUnits () {
            let removeList = []
            for (let index in this.runningPipeline) {
                const fu = this.runningPipeline[index]
                if (fu.run()) {
                    this.completedLines++
                    removeList.push(index)
                } else {
                    if (fu.available()) {
                        removeList.push(index)
                    }
                }
            }
            for (let index in removeList) {
                const i = removeList[index]
                this.runningPipeline.splice(i, 1)
            }
        }
    }
}
</script>
