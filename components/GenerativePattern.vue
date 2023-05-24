<template>
  <div
    :style="`background-color: ${settingsStore.backgroundColour}`"
    class="w-screen h-screen"
  >
    <div
      :style="`color: ${settingsStore.foregroundColour}`"
      class="flex h-full"
    >
      <div class="flex justify-center items-center flex-grow p-10">
        <svg
          ref="svgElement"
          :width="svgSize"
          :height="svgSize"
          :viewBox="`0 0 ${svgSize} ${svgSize}`"
          class="w-full h-full object-contain overflow-visible"
        >
          <rect
            :width="svgSize"
            :height="svgSize"
            :fill="settingsStore.backgroundColour"
          />
          <defs v-if="base64Image">
            <mask id="mask">
              <rect
                v-for="(shape, index) in activeShapes"
                :key="index"
                :fill="settingsStore.foregroundColour"
                class="dot"
                v-bind="shape"
              />
            </mask>
          </defs>
          <g v-else>
            <rect
              v-for="(shape, index) in activeShapes"
              :key="index"
              :fill="settingsStore.foregroundColour"
              class="dot"
              v-bind="shape"
            />
          </g>
          <image
            v-if="base64Image"
            :xlink:href="base64Image"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="100%"
            height="100%"
            mask="url(#mask)"
          />
        </svg>
      </div>
      <div
        class="w-96 flex-none flex-col space-y-10 h-full overflow-y-auto p-10 pl-0"
      >
        <div class="space-y-2">
          <div class="flex space-x-4 items-center justify-between">
            <label for="dimension">Dimension</label>
            <input
              id="dimension"
              v-model="settingsStore.dimension"
              min="3"
              max="25"
              type="range"
            />
          </div>
          <div class="flex space-x-4 items-center w-full justify-between">
            <label for="scaleMin">Min. Scale (%)</label>
            <input
              id="scaleMin"
              v-model="settingsStore.scaleMin"
              class="text-black px-1"
              min="0"
              step="1"
              type="number"
            />
          </div>
          <div class="flex space-x-4 items-center w-full justify-between">
            <label for="scaleMax">Max. Scale (%)</label>
            <input
              id="scaleMax"
              v-model="settingsStore.scaleMax"
              class="text-black px-1"
              :min="settingsStore.scaleMin"
              step="1"
              type="number"
            />
          </div>
          <div class="flex space-x-4 items-center">
            <label for="rotate">Rotate</label>
            <input id="rotate" v-model="settingsStore.rotate" type="checkbox" />
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex space-x-4 items-center w-full justify-between">
            <label for="waves">Waves</label>
            <input
              id="waves"
              v-model="settingsStore.waves"
              class="text-black px-1"
              type="number"
            />
          </div>
          <div class="flex space-x-4 items-center w-full justify-between">
            <label for="period">Period (ms)</label>
            <input
              id="period"
              v-model="settingsStore.period"
              class="text-black px-1"
              type="number"
            />
          </div>
          <div class="flex space-x-4 items-center w-full justify-between">
            <label for="wavelength">Wavelength (squares)</label>
            <input
              id="wavelength"
              v-model="settingsStore.wavelength"
              class="text-black px-1"
              type="number"
            />
          </div>
        </div>
        <div class="space-y-2">
          <h2>Playback</h2>
          <div class="flex space-x-2">
            <button
              class="h-8 w-8 flex justify-center items-center flex-none text-xl"
              type="button"
              @click="toggleAnimationPlayback"
            >
              <svg
                class="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 16 16"
              >
                <path
                  :d="
                    isPaused
                      ? 'M14 7.999a.999.999 0 0 0-.427-.819l-10-7A1 1 0 0 0 2 .999V15a.999.999 0 0 0 1.573.819l10-7A.995.995 0 0 0 14 8.001v-.002c0 .001 0 .001 0 0z'
                      : 'M5 1H2c-.6 0-1 .4-1 1v12c0 .6.4 1 1 1h3c.6 0 1-.4 1-1V2c0-.6-.4-1-1-1zM14 1h-3c-.6 0-1 .4-1 1v12c0 .6.4 1 1 1h3c.6 0 1-.4 1-1V2c0-.6-.4-1-1-1z'
                  "
                />
              </svg>
            </button>
            <input
              ref="progressInput"
              class="flex-grow"
              type="range"
              min="0"
              max="100"
              step=".001"
              value="0"
              @mousedown="onPause"
              @input="onSeek()"
            />
          </div>
        </div>
        <div class="space-y-4">
          <LvColorPicker
            v-model="settingsStore.backgroundColour"
            class="w-full"
            hide-palette
            label="Background Colour"
          />
          <LvColorPicker
            v-model="settingsStore.foregroundColour"
            class="w-full"
            hide-palette
            label="Foreground Colour"
          />
          <button class="btn w-full" type="button" @click="randomiseColours">
            🎲 Randomise
          </button>
        </div>
        <div class="space-y-2">
          <h2>Image</h2>
          <div class="space-y-4">
            <div class="flex space-x-4 items-center w-full justify-between">
              <label for="image">Upload</label>
              <button
                v-if="file"
                class="btn"
                type="button"
                @click="onClearInput"
              >
                Remove
              </button>
              <input
                id="image"
                ref="fileInput"
                :class="file ? 'hidden' : ''"
                class="text-black px-1"
                type="file"
                accept=".jpg,.jpeg,.png,.gif"
                @change="onChangeFile"
              />
            </div>
            <button class="btn w-full" type="button" @click="saveImage">
              📸 Capture
            </button>
          </div>
        </div>
        <div class="space-y-2">
          <h2>Settings</h2>
          <div class="flex space-x-2">
            <button
              class="btn flex-1"
              type="button"
              @click="settingsStore.save"
            >
              📤 Save
            </button>
            <button
              class="btn flex-1"
              type="button"
              @click="settingsStore.load"
            >
              📥 Load
            </button>
            <button
              class="btn flex-1"
              type="button"
              @click="settingsStore.$reset"
            >
              💣 Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import anime from 'animejs'
import { Canvg, presets } from 'canvg'
import randomHexColor from 'random-hex-color'

import { useSettingsStore } from '@/stores/settings'

const svgElement = ref()
const svgSize = ref(2400)

const settingsStore = useSettingsStore()

const sideLength = computed(() => {
  return svgSize.value / settingsStore.dimension
})

const rotatedSideLength = computed(() => {
  return Math.sqrt(sideLength.value ** 2 / 2)
})

const rotatedDelta = computed(() => {
  return (sideLength.value - rotatedSideLength.value) / 2
})

const shapes = computed(() => {
  const arr = []

  for (let i = 0; i < settingsStore.dimension ** 2; i++) {
    const colIndex = i % settingsStore.dimension
    const rowIndex = Math.floor(i / settingsStore.dimension)

    const x = sideLength.value * colIndex
    const y = sideLength.value * rowIndex

    const halfLength = sideLength.value / 2

    arr.push({
      width: sideLength.value,
      height: sideLength.value,
      rx: halfLength / 10,
      x,
      y,
      transform: `scale(${settingsStore.scaleMax / 100})`,
      'transform-origin': [x + halfLength, y + halfLength].join(' '),
    })
  }

  return arr
})

const rotatedShapes = computed(() => {
  const arr = []

  for (let i = 0; i < settingsStore.dimension ** 2; i++) {
    const colIndex = i % settingsStore.dimension
    const rowIndex = Math.floor(i / settingsStore.dimension)

    const x =
      (2 * colIndex + 1) * rotatedDelta.value +
      rotatedSideLength.value * colIndex
    const y =
      (2 * rowIndex + 1) * rotatedDelta.value +
      rotatedSideLength.value * rowIndex

    const halfLength = rotatedSideLength.value / 2

    arr.push({
      width: rotatedSideLength.value,
      height: rotatedSideLength.value,
      rx: halfLength / 10,
      x,
      y,
      transform: `rotate(45) scale(${settingsStore.scaleMax / 100})`,
      'transform-origin': [x + halfLength, y + halfLength].join(' '),
    })
  }

  return arr
})

const activeShapes = computed(() => {
  return settingsStore.rotate ? rotatedShapes.value : shapes.value
})

function randomiseColours() {
  settingsStore.backgroundColour = randomHexColor()
  settingsStore.foregroundColour = randomHexColor()
}

const preset = presets.offscreen()

async function saveImage() {
  const canvas = new OffscreenCanvas(svgSize.value, svgSize.value)
  const ctx = canvas.getContext('2d')
  const v = Canvg.fromString(ctx, svgElement.value.outerHTML, preset)

  await v.render()

  const blob = await canvas.convertToBlob()
  const pngUrl = URL.createObjectURL(blob)

  window.open(pngUrl)
}

const animation = ref(null)
const progressInput = ref(null)
const isPaused = ref(false)

function animate() {
  if (animation.value) {
    animation.value.pause()
    anime.remove('svg .dot')
  }

  const keyframes = [
    {
      rx: [sideLength.value / 2, sideLength.value / 15],
      scale: [settingsStore.scaleMin / 100, settingsStore.scaleMax / 100],
      rotate: settingsStore.rotate ? [45, 45] : [0, 0],
    },
    {
      rx: [sideLength.value / 15, sideLength.value / 2],
      scale: [settingsStore.scaleMax / 100, settingsStore.scaleMin / 100],
      rotate: settingsStore.rotate ? 45 : [0, 0],
    },
  ]

  animation.value = anime({
    targets: 'svg .dot',
    keyframes: Array.from(
      { length: keyframes.length * settingsStore.waves },
      (_, i) => keyframes[i % keyframes.length],
    ),
    duration: settingsStore.period * settingsStore.waves,
    delay: anime.stagger(settingsStore.period / settingsStore.wavelength, {
      grid: [settingsStore.dimension, settingsStore.dimension],
      from: 'center',
    }),
    easing: 'easeInOutQuad',
    loop: true,
    update({ progress }) {
      progressInput.value.value = Math.round(progress * 1000) / 1000
    },
  })
}

function onPause() {
  animation.value.pause()
  isPaused.value = true
}

function onSeek() {
  if (isPaused.value) {
    animation.value.seek(
      animation.value.duration * (progressInput.value.value / 100),
    )
  }
}

function toggleAnimationPlayback() {
  animation.value[isPaused.value ? 'play' : 'pause']()
  isPaused.value = !isPaused.value
}

const fileInput = ref(null)
const file = ref(null)
const base64Image = ref('')

function onChangeFile(event) {
  file.value = event.target.files[0]

  if (file.value) {
    const reader = new FileReader()

    reader.addEventListener('load', (e) => {
      base64Image.value = e.target.result
    })

    reader.readAsDataURL(file.value)
  }
}

function onClearInput() {
  fileInput.value.value = null
  file.value = null
  base64Image.value = ''
}

const { period, scaleMin, scaleMax, wavelength, waves } = toRefs(settingsStore)

onMounted(() => {
  animate()

  watch([activeShapes, base64Image], () => {
    nextTick(animate)
  })

  watchThrottled([period, scaleMin, scaleMax, wavelength, waves], animate, {
    throttle: 500,
  })
})
</script>

<style lang="postcss" scoped>
h2,
label,
:deep(label) {
  @apply text-sm font-bold;
}
</style>
