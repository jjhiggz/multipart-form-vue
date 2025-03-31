<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue'
import type { Currency } from '@/types'
import { CURRENCY_OPTIONS } from '../../shared/types'

interface Props {
  selectedCurrency: Currency | null
  defaultCurrency: Currency | null
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:selectedCurrency', currency: Currency | null): void
  (e: 'currencySelected', currency: Currency): void
}>()

const isOpen = ref(false)
const currencies = CURRENCY_OPTIONS

const displayValue = computed(() => {
  if (props.disabled) return ''
  return props.selectedCurrency || props.defaultCurrency || ''
})

// Watch for changes in defaultCurrency when component is enabled
watch(
  () => props.defaultCurrency,
  (newDefault) => {
    if (!props.disabled && !props.selectedCurrency && newDefault) {
      emit('update:selectedCurrency', newDefault)
      emit('currencySelected', newDefault)
    }
  },
  { immediate: true },
)

const handleSelect = (currency: Currency) => {
  emit('update:selectedCurrency', currency)
  emit('currencySelected', currency)
  isOpen.value = false
}

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

// Close dropdown when clicking outside
const dropdownRef = ref<HTMLDivElement | null>(null)
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <button
      type="button"
      :class="[
        'w-full px-3 py-2 text-left border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
        disabled
          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
          : 'bg-white hover:bg-gray-50 cursor-pointer',
      ]"
      :disabled="disabled"
      @click="toggleDropdown"
    >
      <span v-if="displayValue" class="flex items-center gap-2">
        <span class="font-medium">{{ displayValue }}</span>
      </span>
      <span v-else class="text-gray-400">Select currency</span>
    </button>

    <div
      v-if="isOpen"
      class="z-10 absolute bg-white shadow-lg mt-1 border rounded-md w-full max-h-60 overflow-auto"
    >
      <ul class="py-1">
        <li
          v-for="currency in currencies"
          :key="currency"
          class="hover:bg-gray-100 px-3 py-2 cursor-pointer"
          :class="{ 'bg-gray-50': currency === selectedCurrency }"
          @click="handleSelect(currency)"
        >
          {{ currency }}
        </li>
      </ul>
    </div>
  </div>
</template>
