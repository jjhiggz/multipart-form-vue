<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  type?: 'text' | 'number' | 'email' | 'password'
  placeholder?: string
  required?: boolean
  min?: number
  max?: number
  step?: number
  prefix?: string
  id?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'input', event: Event): void
}>()

const handleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('input', e)
}
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" :for="id" class="block font-medium text-gray-700">
      {{ label }}
    </label>
    <div class="relative">
      <span v-if="prefix" class="top-1/2 left-3 absolute text-gray-500 -translate-y-1/2">{{
        prefix
      }}</span>
      <input
        :id="id"
        :value="modelValue"
        :type="type"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handleInput"
        :class="[
          'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          prefix ? 'pl-7' : '',
          disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white',
        ]"
      />
    </div>
  </div>
</template>
