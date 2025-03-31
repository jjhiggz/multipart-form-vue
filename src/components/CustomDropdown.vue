<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

interface Props {
  modelValue: string
  options: Array<{
    id: string
    label: string
    [key: string]: string | number | boolean
  }>
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option...',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const highlightedIndex = ref(-1)

const selectedOption = computed(() =>
  props.options.find((option) => option.id === props.modelValue),
)

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
    highlightedIndex.value = -1
  }
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    highlightedIndex.value = props.options.findIndex((opt) => opt.id === props.modelValue)
  }
}

const selectOption = (option: Props['options'][0]) => {
  emit('update:modelValue', option.id)
  isOpen.value = false
  highlightedIndex.value = -1
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!isOpen.value && e.key === 'Enter') {
    isOpen.value = true
    return
  }

  if (!isOpen.value) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, props.options.length - 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
      break
    case 'Enter':
      e.preventDefault()
      if (highlightedIndex.value >= 0) {
        selectOption(props.options[highlightedIndex.value])
      }
      break
    case 'Escape':
      isOpen.value = false
      highlightedIndex.value = -1
      break
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div
    ref="dropdownRef"
    class="relative bg-white border border-gray-300 focus:border-emerald-500 rounded focus:outline-none focus:ring-2 focus:ring-emerald-200 w-full cursor-pointer select-none"
    :class="{ 'border-emerald-500': isOpen }"
    @click="toggleDropdown"
    role="combobox"
    :aria-expanded="isOpen"
    tabindex="0"
  >
    <div class="flex justify-between items-center p-3 min-h-[24px]">
      <slot name="selected-option" :selected="selectedOption" :placeholder="placeholder">
        {{ selectedOption?.label || placeholder }}
      </slot>
      <svg
        class="fill-gray-600 w-6 h-6 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        viewBox="0 0 24 24"
      >
        <path d="M7 10l5 5 5-5z" />
      </svg>
    </div>

    <div
      v-if="isOpen"
      class="top-full right-0 left-0 z-[1000] absolute bg-white shadow-lg mt-1 border border-gray-300 rounded max-h-[250px] overflow-y-auto"
      role="listbox"
    >
      <div
        v-for="(option, index) in options"
        :key="option.id"
        class="p-3 transition-colors duration-200"
        :class="{
          'bg-gray-100': index === highlightedIndex,
          'bg-emerald-50 text-gray-800': option.id === modelValue,
          'bg-emerald-100': option.id === modelValue && index === highlightedIndex,
        }"
        @click.stop="selectOption(option)"
        role="option"
        :aria-selected="option.id === modelValue"
      >
        <slot
          name="option"
          :option="option"
          :is-selected="option.id === modelValue"
          :is-highlighted="index === highlightedIndex"
        >
          {{ option.label }}
        </slot>
      </div>
    </div>
  </div>
</template>
