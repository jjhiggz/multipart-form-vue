<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRecipients } from '@/composables/useRecipients'
import type { Recipient } from '@/composables/useRecipients'
import CurrencyFlag from './CurrencyFlag.vue'

interface Props {
  modelValue?: Recipient | null
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Select a recipient...',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: Recipient | null): void
  (e: 'select', value: Recipient): void
}>()

const { data, isPending } = useRecipients()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const highlightedIndex = ref(-1)

const recipients = computed(() => data.value?.recipients ?? [])

const selectedRecipient = computed(() => props.modelValue)

const closeDropdown = () => {
  isOpen.value = false
  highlightedIndex.value = -1
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

const selectRecipient = (recipient: Recipient) => {
  emit('update:modelValue', recipient)
  emit('select', recipient)
  closeDropdown()
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!isOpen.value && e.key === 'Enter') {
    isOpen.value = true
    return
  }

  if (!isOpen.value || !recipients.value.length) return

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, recipients.value.length - 1)
      break
    case 'ArrowUp':
      e.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
      break
    case 'Enter':
      e.preventDefault()
      if (highlightedIndex.value >= 0) {
        selectRecipient(recipients.value[highlightedIndex.value])
      }
      break
    case 'Escape':
      closeDropdown()
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
  <div ref="dropdownRef" class="relative w-full">
    <!-- Dropdown trigger -->
    <div
      class="bg-white shadow-sm px-4 py-2.5 border focus:border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full cursor-pointer"
      :class="{
        'cursor-not-allowed opacity-50': disabled || isPending,
        'hover:border-gray-400': !disabled && !isPending,
      }"
      @click="!disabled && !isPending && (isOpen = !isOpen)"
      tabindex="0"
      role="combobox"
      :aria-expanded="isOpen"
      :aria-disabled="disabled || isPending"
    >
      <div v-if="isPending" class="flex items-center gap-2 text-gray-500">
        <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
            fill="none"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Loading recipients...
      </div>
      <div v-else-if="selectedRecipient" class="flex justify-between items-center">
        <div class="flex items-center gap-3">
          <CurrencyFlag :currency="selectedRecipient.currency" size="small" />
          <div class="flex flex-col">
            <span class="font-medium text-gray-900">{{ selectedRecipient.name }}</span>
            <span class="text-gray-500 text-sm">{{ selectedRecipient.email }}</span>
          </div>
        </div>
        <span class="bg-gray-100 px-2 py-1 rounded text-gray-600 text-xs uppercase tracking-wider">
          {{ selectedRecipient.type }}
        </span>
      </div>
      <div v-else class="text-gray-500">
        {{ placeholder }}
      </div>

      <!-- Dropdown arrow -->
      <div
        class="top-1/2 right-4 absolute transition-transform -translate-y-1/2"
        :class="{ 'rotate-180': isOpen }"
      >
        <svg class="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
    </div>

    <!-- Dropdown options -->
    <div
      v-if="isOpen && !isPending"
      class="z-10 absolute bg-white shadow-lg mt-1 border rounded-lg w-full max-h-60 overflow-auto"
    >
      <div v-if="!recipients.length" class="p-4 text-gray-500 text-center">No recipients found</div>
      <div
        v-for="(recipient, index) in recipients"
        :key="recipient.id"
        class="px-4 py-2.5 transition-colors cursor-pointer"
        :class="{
          'bg-blue-50': highlightedIndex === index,
          'bg-gray-50': recipient.id === modelValue?.id,
          'hover:bg-gray-50': highlightedIndex !== index && recipient.id !== modelValue?.id,
        }"
        @click="selectRecipient(recipient)"
        @mouseover="highlightedIndex = index"
        role="option"
        :aria-selected="recipient.id === modelValue?.id"
      >
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <CurrencyFlag :currency="recipient.currency" size="small" />
            <div class="flex flex-col min-w-0">
              <span class="font-medium text-gray-900 truncate">{{ recipient.name }}</span>
              <span class="text-gray-500 text-sm truncate">{{ recipient.email }}</span>
            </div>
          </div>
          <span
            class="bg-gray-100 px-2 py-1 rounded text-gray-600 text-xs uppercase tracking-wider"
          >
            {{ recipient.type }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
