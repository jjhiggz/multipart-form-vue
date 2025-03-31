<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  disabled: false,
  loading: false,
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    @click="emit('click', $event)"
    :class="[
      'px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative',
      variant === 'primary'
        ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400'
        : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 disabled:bg-gray-100 disabled:text-gray-500',
      loading ? 'text-transparent' : '',
    ]"
  >
    <!-- Loading Spinner -->
    <div v-if="loading" class="absolute inset-0 flex justify-center items-center">
      <svg
        class="w-5 h-5 animate-spin"
        :class="variant === 'primary' ? 'text-white' : 'text-gray-500'"
        xmlns="http://www.w3.org/2000/svg"
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
    </div>
    <slot></slot>
  </button>
</template>
