import instructionsList from './instructionsList'
import Line from '@/model/Line'

export default [
    [
        new Line(instructionsList.LD, ['F6', '34', 'R2']),
        new Line(instructionsList.LD, ['F2', '45', 'R3']),
        new Line(instructionsList.MULTD, ['F0', 'F2', 'F4']),
        new Line(instructionsList.SUBD, ['F8', 'F6', 'F2']),
        new Line(instructionsList.DIVD, ['F10', 'F0', 'F6']),
        new Line(instructionsList.ADDD, ['F6', 'F8', 'F2'])
    ],
    [
        new Line(instructionsList.LD, ['F0', '0', 'R1']),
        new Line(instructionsList.MULTD, ['F4', 'F0', 'F2']),
        new Line(instructionsList.SD, ['F4', '0', 'R1']),
        new Line(instructionsList.ADDI, ['R1', 'R1', '8']),
        new Line(instructionsList.BNEZ, ['R1', 'loop']),
    ],
    [
        new Line(instructionsList.LD, ['F0', '0', 'R1']),
        new Line(instructionsList.LD, ['F2', '0', 'R2']),
        new Line(instructionsList.MULTD, ['F4', 'F2', 'F0']),
        new Line(instructionsList.ADDD, ['F2', 'F0', 'F2']),
        new Line(instructionsList.ADDI, ['R1', 'R1', '-8']),
        new Line(instructionsList.SUBD, ['F4', 'F4', 'R2']),
        new Line(instructionsList.SD, ['F4', '0', 'R1']),
        new Line(instructionsList.DIVD, ['F4', 'F4', 'F2']),
        new Line(instructionsList.DADDUI, ['F2', 'F2', '8']),
        new Line(instructionsList.MULTD, ['F0', 'F2', 'F2']),
        new Line(instructionsList.ADD, ['R1', 'R1', 'R2']),
        new Line(instructionsList.ADDD, ['R2', 'R2', 'R1']),
        new Line(instructionsList.BEQ, ['R2', 'R1', 'loop']),
        new Line(instructionsList.BNEZ, ['R1', 'loop1'])
    ]
]