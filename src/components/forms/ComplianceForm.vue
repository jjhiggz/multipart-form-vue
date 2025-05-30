<script setup lang="ts">
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { ref, computed } from 'vue'

defineOptions({
  name: 'ComplianceForm',
})

interface Props {
  onBack?: () => void
  initialData?: ComplianceFormData
}

export interface ComplianceFormData {
  reason: string
  address: string
  jobTitle: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'submit', data: ComplianceFormData): void
}>()

const formData = ref<ComplianceFormData>({
  reason: props.initialData?.reason ?? '',
  address: props.initialData?.address ?? '',
  jobTitle: props.initialData?.jobTitle ?? '',
})

const handleSubmit = (e: Event) => {
  e.preventDefault()
  emit('submit', formData.value)
}

const isValid = computed(() => {
  return (
    formData.value.reason.trim() !== '' &&
    formData.value.address.trim() !== '' &&
    formData.value.jobTitle.trim() !== ''
  )
})
</script>

<template>
  <form @submit="handleSubmit" class="space-y-6 mx-auto max-w-lg">
    <div class="space-y-6">
      <BaseInput
        v-model="formData.reason"
        type="text"
        label="Reason for Payment:"
        required
        placeholder="Enter the reason for this payment"
      />

      <BaseInput
        v-model="formData.address"
        type="text"
        label="Address:"
        required
        placeholder="Enter your full address"
      />

      <BaseInput
        v-model="formData.jobTitle"
        type="text"
        label="Job Title:"
        required
        placeholder="Enter your job title"
      />
    </div>

    <div class="flex justify-end gap-3">
      <BaseButton v-if="props.onBack" variant="secondary" @click="props.onBack"> Back </BaseButton>
      <BaseButton type="submit" :disabled="!isValid"> Continue </BaseButton>
    </div>
  </form>
</template>
