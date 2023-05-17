import LvColorPicker from 'lightvue/color-picker'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.component('LvColorPicker', LvColorPicker)
})
