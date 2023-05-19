import { defineStore } from 'pinia'

const DEFAULT_DIMENSION = 15
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
