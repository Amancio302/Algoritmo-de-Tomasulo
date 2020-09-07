import store from '@/store'

class RenamedRegister {
    constructor (name) {
        if (name) {
            this.name = name
        } else {
            this.name = this.rename()
        }
        store.commit('addRenamedRegister', this)
    }

    rename () {
        let rename = 1
        while (store.getters.hasName(this.toLetters(rename))) {
            rename++
        }
        return this.toLetters(rename)
    }

    toLetters(num) {
        "use strict";
        var mod = num % 26,
            pow = num / 26 | 0,
            out = mod ? String.fromCharCode(64 + mod) : (--pow, 'Z');
        return pow ? this.toLetters(pow) + out : out;
    }
}

export default RenamedRegister