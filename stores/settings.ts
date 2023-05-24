import { defineStore } from 'pinia'

const DEFAULT_DIMENSION = 15
const DEFAULT_SCALE_MIN = 50
const DEFAULT_SCALE_MAX = 97
const DEFAULT_ROTATE = false
const DEFAULT_WAVES = 3
const DEFAULT_PERIOD = 1000
const DEFAULT_WAVELENGTH = 5
const DEFAULT_BACKGROUND_COLOUR = '#1C1E1F'
const DEFAULT_FOREGROUND_COLOUR = '#D9D9D9'

export const useSettingsStore = defineStore(
  'ui',
  () => {
    const dimension = ref(DEFAULT_DIMENSION)
    const scaleMin = ref(DEFAULT_SCALE_MIN)
    const scaleMax = ref(DEFAULT_SCALE_MAX)
    const rotate = ref(DEFAULT_ROTATE)

    const waves = ref(DEFAULT_WAVES)
    const period = ref(DEFAULT_PERIOD)
    const wavelength = ref(DEFAULT_WAVELENGTH)

    const backgroundColour = ref(DEFAULT_BACKGROUND_COLOUR)
    const foregroundColour = ref(DEFAULT_FOREGROUND_COLOUR)

    const showModal = ref(false)
    const isSaving = ref(false)
    const settingsString = ref('')

    function save() {
      settingsString.value = JSON.stringify({
        dimension: dimension.value,
        scaleMin: scaleMin.value,
        scaleMax: scaleMax.value,
        rotate: rotate.value,
        waves: waves.value,
        period: period.value,
        wavelength: wavelength.value,
        backgroundColour: backgroundColour.value,
        foregroundColour: foregroundColour.value,
      })

      isSaving.value = true
      showModal.value = true
    }

    function load() {
      settingsString.value = ''
      isSaving.value = false
      showModal.value = true
    }

    function parseSettings() {
      try {
        const parsedSettings = JSON.parse(settingsString.value)

        dimension.value = parsedSettings.dimension || DEFAULT_DIMENSION
        scaleMin.value = parsedSettings.scaleMin || DEFAULT_SCALE_MIN
        scaleMax.value = parsedSettings.scaleMax || DEFAULT_SCALE_MAX
        rotate.value = parsedSettings.rotate || DEFAULT_ROTATE

        waves.value = parsedSettings.waves || DEFAULT_WAVES
        period.value = parsedSettings.period || DEFAULT_PERIOD
        wavelength.value = parsedSettings.wavelength || DEFAULT_WAVELENGTH

        backgroundColour.value =
          parsedSettings.backgroundColour || DEFAULT_BACKGROUND_COLOUR
        foregroundColour.value =
          parsedSettings.foregroundColour || DEFAULT_FOREGROUND_COLOUR
      } catch (e) {
        console.error(e)
      }
    }

    function $reset() {
      dimension.value = DEFAULT_DIMENSION
      scaleMin.value = DEFAULT_SCALE_MIN
      scaleMax.value = DEFAULT_SCALE_MAX
      rotate.value = DEFAULT_ROTATE

      waves.value = DEFAULT_WAVES
      period.value = DEFAULT_PERIOD
      wavelength.value = DEFAULT_WAVELENGTH

      backgroundColour.value = DEFAULT_BACKGROUND_COLOUR
      foregroundColour.value = DEFAULT_FOREGROUND_COLOUR

      settingsString.value = ''
      isSaving.value = false
      showModal.value = false
    }

    return {
      dimension,
      rotate,
      scaleMin,
      scaleMax,
      waves,
      period,
      wavelength,
      backgroundColour,
      foregroundColour,
      settingsString,
      showModal,
      isSaving,
      save,
      load,
      parseSettings,
      $reset,
    }
  },
  {
    persist: {
      paths: [
        'dimension',
        'scaleMin',
        'scaleMax',
        'rotate',
        'waves',
        'period',
        'wavelength',
        'backgroundColour',
        'foregroundColour',
      ],
    },
  },
)
