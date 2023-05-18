import { defineStore } from 'pinia'

const DEFAULT_DIMENSION = 15
const DEFAULT_ROTATE = false
const DEFAULT_PULSES = 3
const DEFAULT_DURATION = 4500
const DEFAULT_DELAY = 200
const DEFAULT_BACKGROUND_COLOUR = '#A797FA'
const DEFAULT_FOREGROUND_COLOUR = '#D9D9D9'

export const useSettingsStore = defineStore(
  'ui',
  () => {
    const dimension = ref(DEFAULT_DIMENSION)
    const rotate = ref(DEFAULT_ROTATE)

    const pulses = ref(DEFAULT_PULSES)
    const duration = ref(DEFAULT_DURATION)
    const delay = ref(DEFAULT_DELAY)

    const backgroundColour = ref(DEFAULT_BACKGROUND_COLOUR)
    const foregroundColour = ref(DEFAULT_FOREGROUND_COLOUR)

    const showModal = ref(false)
    const isSaving = ref(false)
    const settingsString = ref('')

    function save() {
      settingsString.value = JSON.stringify({
        dimension: dimension.value,
        rotate: rotate.value,
        pulses: pulses.value,
        duration: duration.value,
        delay: delay.value,
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

        pulses.value = parsedSettings.pulses || DEFAULT_PULSES
        duration.value = parsedSettings.duration || DEFAULT_DURATION
        delay.value = parsedSettings.delay || DEFAULT_DELAY

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

      pulses.value = DEFAULT_PULSES
      duration.value = DEFAULT_DURATION
      delay.value = DEFAULT_DELAY

      backgroundColour.value = DEFAULT_BACKGROUND_COLOUR
      foregroundColour.value = DEFAULT_FOREGROUND_COLOUR

      settingsString.value = ''
      isSaving.value = false
      showModal.value = false
    }

    return {
      dimension,
      rotate,
      pulses,
      duration,
      delay,
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
        'pulses',
        'duration',
        'delay',
        'backgroundColour',
        'foregroundColour',
      ],
    },
  },
)
