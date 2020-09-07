import Instruction from '../model/Instruction'
import Const from './Const'

const instructionsList = {
    ADDD: new Instruction(
        'ADD.D',
        2,
        'floatAdd',
        ['registerFloat', 'registerFloat', 'registerFloat']
    ),
    SUBD: new Instruction(
        'SUB.D',
        2,
        'floatAdd',
        ['registerFloat', 'registerFloat', 'registerFloat']
    )
}

export default [
    // 00
    {
        name: 'ADD.D',
        clock: 2,
        functionalUnit: 'floatAddUnits',
        params: {
            one: 'registerFloat',
            two: 'registerFloat',
            three: 'registerFloat'
        }
    },
    // 01
    {
        name: 'SUBD',
        clock: 2,
        functionalUnit: 'floatAddUnits',
        params: {
            one: 'registerFloat',
            two: 'registerFloat',
            three: 'registerFloat'
        }
    },
    // 02
    {
        name: 'MULTD',
        clock: 10,
        functionalUnit: 'floatMultUnits',
        params: {
            one: 'registerFloat',
            two: 'registerFloat',
            three: 'registerFloat'
        }
    },
    // 03
    {
        name: 'DIV.D',
        clock: 40,
        functionalUnit: 'floatMultUnits',
        params: {
            one: 'registerFloat',
            two: 'registerFloat',
            three: 'registerFloat'
        }
    },
    // 04
    {
        name: 'L.D',
        clock: 2,
        functionalUnit: 'loadUnits',
        params: {
            one: 'registerFloat',
            two: 'number',
            three: 'registerInt'
        }
    },
    // 05
    {
        name: 'S.D',
        clock: 1,
        functionalUnit: 'storeUnits',
        params: {
            one: 'registerFloat',
            two: 'number',
            three: 'registerInt'
        }
    },
    // 06
    {
        name: 'ADD',
        clock: 1,
        functionalUnit: 'integerUnits',
        params: {
            one: 'registerInt',
            two: 'registerInt',
            three: 'registerInt'
        }
    },
    // 07
    {
        name: 'DADDUI',
        clock: 1,
        functionalUnit: 'floatAddUnits',
        params: {
            one: 'registerFloat',
            two: 'number',
            three: 'registerFloat'
        }
    },
    // 08
    {
        name: 'BEQ',
        clock: 1,
        functionalUnit: 'integerUnits',
        params: {
            one: 'registerFloat',
            two: 'registerFloat',
            three: 'branch'
        }
    },
    // 09
    {
        name: 'BNEZ',
        clock: 1,
        functionalUnit: 'integerUnits',
        params: {
            one: 'registerInt',
            two: 'branch'
        }
    },
    // 10
    {
        name: 'ADDI',
        clock: 1,
        functionalUnit: 'integerUnits',
        params: {
            one: 'registerInt',
            two: 'number',
            three: 'registerInt'
        }
    }
]
