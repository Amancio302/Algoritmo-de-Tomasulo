import Instruction from '../model/Instruction'

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
    ),
    MULTD: new Instruction(
        'MULT.D',
        10,
        'floatMul',
        ['registerFloat', 'registerFloat', 'registerFloat']
    ),
    DIVD: new Instruction(
        'DIV.D',
        40,
        'floatMul',
        ['registerFloat', 'registerFloat', 'registerFloat']
    ),
    LD: new Instruction(
        'L.D',
        2,
        'load',
        ['registerFloat', 'number', 'registerInt']
    ),
    SD: new Instruction(
        'S.D',
        1,
        'store',
        ['registerFloat', 'number', 'registerInt']
    ),
    ADD: new Instruction(
        'ADD',
        1,
        'integer',
        ['registerInt', 'registerInt', 'registerInt']
    ),
    DADDUI: new Instruction(
        'DADDUI',
        1,
        'floatAdd',
        ['registerFloat', 'registerFloat', 'number']
    ),
    ADDI: new Instruction(
        'ADDI',
        1,
        'integer',
        ['registerInt', 'registerInt', 'number']
    ),
    BEQ: new Instruction(
        'BEQ',
        1,
        'integer',
        ['registerInt', 'registerInt', 'branch']
    ),
    BNEZ: new Instruction(
        'BNEZ',
        1,
        'integer',
        ['registerInt', 'branch']
    )
}

export default instructionsList