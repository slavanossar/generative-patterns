<template>
  <div
    :style="`background-color: ${backgroundColour}`"
    class="w-screen h-screen p-10"
  >
    <div :style="`color: ${foregroundColour}`" class="flex space-x-10">
      <div class="aspect-square flex-grow">
        <svg
          ref="svgElement"
          :width="svgSize"
          :height="svgSize"
          :viewBox="`0 0 ${svgSize} ${svgSize}`"
          class="w-full h-full"
        >
          <rect :width="svgSize" :height="svgSize" :fill="backgroundColour" />
          <rect
            v-for="(shape, index) in activeShapes"
            :key="index"
            :fill="foregroundColour"
            class="dot"
            v-bind="shape"
          />
        </svg>
      </div>
      <div class="w-72 flex-none flex-col space-y-10">
        <div class="space-y-2">
          <div class="flex space-x-4 items-center justify-between">
            <label for="dimension">Dimension</label>
            <input
              id="dimension"
              v-model="dimension"
              min="3"
              max="25"
              type="range"
            />
          </div>
          <div class="flex space-x-4 items-center">
            <label for="rotate">Rotate</label>
            <input id="rotate" v-model="rotate" type="checkbox" />
          </div>
        </div>
        <div class="space-y-2">
          <div class="flex space-x-4 items-center w-full justify-between">
            <label for="pulses">Pulses</label>
            <input
              id="pulses"
              v-model="pulses"
              class="text-black px-1"
              type="number"
            />
          </div>
          <div class="flex space-x-4 items-center w-full justify-between">
            <label for="duration">Duration</label>
            <input
              id="duration"
              v-model="duration"
              class="text-black px-1"
              type="number"
            />
          </div>
          <div class="flex space-x-4 items-center w-full justify-between">
            <label for="delay">Delay</label>
            <input
              id="delay"
              v-model="delay"
              class="text-black px-1"
              type="number"
            />
          </div>
        </div>
        <div class="flex space-x-2">
          <button
            class="flex-1 border-2 font-bold border-current flex justify-center items-center rounded"
            type="button"
            @click="toggleAnimationPlayback"
          >
            {{ isPaused ? 'Play' : 'Pause' }}
          </button>
          <button
            class="flex-1 border-2 font-bold border-current flex justify-center items-center rounded"
            type="button"
            @click="saveImage"
          >
            Save Image
          </button>
        </div>
        <div class="space-y-2">
          <LvColorPicker v-model="backgroundColour" label="Background Colour" />
          <LvColorPicker v-model="foregroundColour" label="Foreground Colour" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import anime from 'animejs'
import { Canvg, presets } from 'canvg'

const SCALE_MIN = 0.5
const SCALE_MAX = 0.97

const svgElement = ref()
const svgSize = ref(2400)
const dimension = ref(15)
const rotate = ref(false)

const backgroundColour = ref('#A797FA')
const foregroundColour = ref('#D9D9D9')

const sideLength = computed(() => {
  return svgSize.value / dimension.value
})

const rotatedSideLength = computed(() => {
  return Math.sqrt(sideLength.value ** 2 / 2)
})

const rotatedDelta = computed(() => {
  return (sideLength.value - rotatedSideLength.value) / 2
})

const shapes = computed(() => {
  const arr = []

  for (let i = 0; i < dimension.value ** 2; i++) {
    const colIndex = i % dimension.value
    const rowIndex = Math.floor(i / dimension.value)

    const x = sideLength.value * colIndex
    const y = sideLength.value * rowIndex

    const halfLength = sideLength.value / 2

    arr.push({
      width: sideLength.value,
      height: sideLength.value,
      rx: halfLength / 10,
      x,
      y,
      transform: `scale(${SCALE_MAX})`,
      'transform-origin': [x + halfLength, y + halfLength].join(' '),
    })
  }

  return arr
})

const rotatedShapes = computed(() => {
  const arr = []

  for (let i = 0; i < dimension.value ** 2; i++) {
    const colIndex = i % dimension.value
    const rowIndex = Math.floor(i / dimension.value)

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
      transform: `rotate(45) scale(${SCALE_MAX})`,
      'transform-origin': [x + halfLength, y + halfLength].join(' '),
    })
  }

  return arr
})

const activeShapes = computed(() => {
  return rotate.value ? rotatedShapes.value : shapes.value
})

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
const pulses = ref(3)
const duration = ref(4500)
const delay = ref(200)
const isPaused = ref(false)

function animate() {
  anime.remove('svg .dot')

  const keyframes = [
    {
      rx: [sideLength.value / 2, sideLength.value / 15],
      scale: [SCALE_MIN, SCALE_MAX],
      rotate: rotate.value ? [45, 45] : [0, 0],
    },
    {
      rx: [sideLength.value / 15, sideLength.value / 2],
      scale: [SCALE_MAX, SCALE_MIN],
      rotate: rotate.value ? 45 : [0, 0],
    },
  ]

  animation.value = anime({
    targets: 'svg .dot',
    keyframes: Array.from(
      { length: keyframes.length * pulses.value },
      (_, i) => keyframes[i % keyframes.length],
    ),
    duration: duration.value,
    delay: anime.stagger(delay.value, {
      grid: [dimension.value, dimension.value],
      from: 'center',
    }),
    easing: 'easeInOutQuad',
    loop: true,
  })
}

function toggleAnimationPlayback() {
  animation.value[isPaused.value ? 'play' : 'pause']()
  isPaused.value = !isPaused.value
}

onMounted(() => {
  animate()

  watch(activeShapes, () => {
    nextTick(animate)
  })

  watchThrottled([duration, delay, pulses], animate, { throttle: 500 })
})
</script>
