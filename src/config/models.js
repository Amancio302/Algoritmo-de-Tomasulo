import instructionsList from './instructionsList'

export default [
    [
        {
            instruction: instructionsList[4],
            values: ['F6', '34', 'R2'],
        },
        {
            instruction: instructionsList[4],
            values: ['F2', '45', 'R3'],
        },
        {
            instruction: instructionsList[2],
            values: ['F0', 'F2', 'F4'],
        },
        {
            instruction: instructionsList[1],
            values: ['F8', 'F6', 'F2'],
        },
        {
            instruction: instructionsList[3],
            values: ['F10', 'F0', 'F6'],
        },
        {
            instruction: instructionsList[0],
            values: ['F6', 'F8', 'F2']
        },
    ],
    [
        {
            instruction: instructionsList[4],
            values: ['F6', '0', 'R1']
        },
        {
            instruction: instructionsList[0],
            values: ['F10', 'F6', 'F4']
        },
        {
            instruction: instructionsList[0],
            values: ['F2', 'F4', 'F8']
        },
        {
            instruction: instructionsList[3],
            values: ['F10', 'F10', 'F2']
        },
        {
            instruction: instructionsList[10],
            values: ['R1', '-8', 'R4']
        },
        {
            instruction: instructionsList[9],
            values: ['R1', 'LOOP']
        }
    ]
]