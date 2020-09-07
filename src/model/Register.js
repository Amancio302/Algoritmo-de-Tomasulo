import Const from '@/config/Const'
import FunctionalUnit from './FunctionalUnit'

class Register {
    constructor (type, name) {
        this.type = Const.params[type]
        this.name = name
        this.value = undefined // RenamedRegister, FunctionalUnit
    }

    available () {
        if (this.value instanceof FunctionalUnit) 
            return false
        return true
    }
}

export default Register