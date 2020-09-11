const rules = {
    input: {
        registerFloat: {
            validate: function (val) {
                const res = rules.input.registerInt.validate(val)
                if (res[0] !== true) {
                    const errors = []
                    if (val) {
                        if (val.startsWith('F')) {
                            if (val.substring(1) !== '') {
                                if (!isNaN(val.substring(1))) {
                                    if (val.substring(1) % 2 === 0) {
                                        errors.push(true)
                                    } else {
                                        errors.push('Registradores do tipo F devem conter apenas números pares')
                                    }
                                } else {
                                    errors.push('Registrador deve conter apenas números após o F ou R')
                                }
                            } else {
                                errors.push('Registrador não pode conter apenas o F ou R')
                            }
                        } else {
                            errors.push('Registrador deve começar com a letra F ou R')
                        }
                    } else {
                        errors.push('Registrador indefinido')
                    }
                    return errors
                } else {
                    return res
                }
            }
        },
        registerInt: {
            validate: function (val) {
                const errors = []
                if (val) {
                    if (val.startsWith('R')) {
                        if (val.substring(1) !== '') {
                            if (!isNaN(val.substring(1))) {
                                errors.push(true)
                            } else {
                                errors.push('Registrador deve conter apenas números após o R')
                            }
                        } else {
                            errors.push('Registrador não pode conter apenas o R')
                        }
                    } else {
                        errors.push('Registrador deve começar com a letra R')
                    }
                } else {
                    errors.push('Registrador indefinido')
                }
                return errors
            }
        },
        number: {
            validate: function (val) {
                const errors = []
                if (val) {
                    if (!isNaN(val)) {
                        errors.push(true)
                    } else {
                        errors.push('Deve ser um número')
                    }
                } else {
                    errors.push('Número indefinido')
                }
                return errors
            }
        },
        branch: {
            validate: function (val) {
                const errors = []
                if (val) {
                    errors.push(true)
                } else {
                    errors.push('Branch indefinida')
                }
                return errors
            }
        }
    }
}

export default rules
