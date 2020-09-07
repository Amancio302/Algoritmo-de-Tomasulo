<template>
  
</template>

<script>
import FunctionalUnit from '@/model/FunctionalUnit'
import Instruction from '@/model/Instruction'
import Line from '@/model/Line'
import Register from '@/model/Register'

export default {
    name: 'Test',
    created () {
        let pedrao = new FunctionalUnit()
        let addd = new Instruction(
            'ADD.D',
            2,
            'floatAdd',
            ['registerFloat', 'registerFloat', 'registerFloat']
        )
        let f0 = new Register('registerFloat', 'F0')
        let f2 = new Register('registerFloat', 'F2')
        let f4 = new Register('registerFloat', 'F4')
        this.$store.commit('addRegister', f0)
        this.$store.commit('addRegister', f2)
        this.$store.commit('addRegister', f4)
        let line = new Line(addd, [f0, f2, f4])
        pedrao.line = line
        console.log(Object.assign({}, pedrao))
        this.$store.commit('increaseClock')
        pedrao.run()
        console.log(Object.assign({}, pedrao))
        this.$store.commit('increaseClock')
        pedrao.run()
        this.$store.commit('increaseClock')
        pedrao.run()
        console.log(Object.assign({}, pedrao))
        this.$store.commit('increaseClock')
        pedrao.run()
        console.log(Object.assign({}, pedrao))
        console.log(this.$store.getters.registers)
        console.log(Object.assign({}, pedrao))
    }
}
</script>

<style>

</style>