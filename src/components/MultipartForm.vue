<script setup lang="ts">
import type { UseMultiformReturn } from '@/composables/useMultiform'

defineOptions({
  name: 'MultipartForm',
})

interface Props {
  form: UseMultiformReturn
}

const props = defineProps<Props>()
</script>

<template>
  <div class="bg-white shadow-sm p-8 rounded-lg">
    <component
      :is="props.form.currentStep.value.component"
      v-bind="props.form.currentStep.value.props"
      v-on="props.form.currentStep.value.emits"
    />
  </div>
</template>
