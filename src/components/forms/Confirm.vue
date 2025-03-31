<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'ConfirmDialog',
})

interface Props {
  question: string
  description?: string
  acceptText?: string
  rejectText?: string
  loading?: boolean
  variant?: 'danger' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  question: 'Are you sure?',
  description: undefined,
  acceptText: 'Yes',
  rejectText: 'No',
  loading: false,
  variant: 'info',
})

const emit = defineEmits<{
  (e: 'clickedAccept'): void
  (e: 'clickedReject'): void
}>()

const variantStyles = {
  danger: {
    icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    acceptBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  },
  warning: {
    icon: 'M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    acceptBg: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
  },
  info: {
    icon: 'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    acceptBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
  },
}

const currentVariant = computed(() => variantStyles[props.variant])
</script>

<template>
  <div class="bg-white shadow-sm p-6 rounded-lg w-full max-w-md">
    <div class="text-center">
      <!-- Icon -->
      <div
        class="flex justify-center items-center mx-auto mb-4 rounded-full w-12 h-12"
        :class="currentVariant.iconBg"
      >
        <svg
          class="w-6 h-6"
          :class="currentVariant.iconColor"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" :d="currentVariant.icon" />
        </svg>
      </div>

      <h3 class="mb-2 font-medium text-gray-900 text-lg">
        {{ question }}
      </h3>
      <p v-if="description" class="mb-6 text-gray-500 text-sm">
        {{ description }}
      </p>
    </div>

    <div class="flex justify-end gap-3 mt-6">
      <button
        type="button"
        class="inline-flex justify-center bg-white hover:bg-gray-50 shadow-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium text-gray-700 text-sm"
        :disabled="loading"
        @click="emit('clickedReject')"
      >
        {{ rejectText }}
      </button>
      <button
        type="button"
        class="inline-flex justify-center items-center shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium text-white text-sm"
        :class="currentVariant.acceptBg"
        :disabled="loading"
        @click="emit('clickedAccept')"
      >
        <svg
          v-if="loading"
          class="mr-2 -ml-1 w-4 h-4 text-white animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {{ acceptText }}
      </button>
    </div>
  </div>
</template>
