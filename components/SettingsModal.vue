<template>
  <div
    v-if="settingsStore.showModal"
    class="fixed inset-0 flex justify-center items-center bg-black/25"
  >
    <div
      ref="target"
      class="w-80 p-10 bg-white rounded-lg text-black space-y-2"
    >
      <textarea
        v-model="settingsStore.settingsString"
        :disabled="settingsStore.isSaving"
        class="w-full resize-none border-2 border-black/10 rounded"
        rows="5"
      />
      <div class="text-black/50 flex">
        <button
          v-if="settingsStore.isSaving"
          class="btn"
          type="button"
          @click="onCopy"
        >
          {{ hasCopied ? 'Copied!' : 'Copy to Clipboard' }}
        </button>
        <button
          v-else
          :disabled="!settingsStore.settingsString"
          class="btn"
          type="btn"
          @click="onLoad"
        >
          Load settings
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import copy from 'copy-to-clipboard'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()

const target = ref(null)

function onDismiss() {
  settingsStore.showModal = false
  settingsStore.settingsString = ''
}

onMounted(() => {
  onKeyStroke('Escape', onDismiss)
  onClickOutside(target, onDismiss)
})

let timeoutId = null
const hasCopied = ref(false)

function onCopy() {
  clearTimeout(timeoutId)

  copy(settingsStore.settingsString)
  hasCopied.value = true

  timeoutId = setTimeout(() => {
    hasCopied.value = false
  }, 2000)
}

function onLoad() {
  settingsStore.parseSettings()
  settingsStore.showModal = false
}
</script>
