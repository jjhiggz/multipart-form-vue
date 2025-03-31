<script setup lang="ts">
import ConfirmDialog from '@/components/forms/Confirm.vue'
import GetRecipientPaymentInfoForm from '@/components/forms/GetRecipientPaymentInfoForm.vue'
import { ref } from 'vue'
import type { Recipient } from '@/composables/useRecipients'

defineOptions({
  name: 'RawMultipartFlow',
})

interface FormData {
  name: string
  email: string
  files: File[]
  recipient: Recipient | null
}

const currentStep = ref<'confirm' | 'form'>('confirm')

const handleConfirm = (confirmed: boolean) => {
  if (confirmed) {
    currentStep.value = 'form'
  } else {
    // Handle rejection (e.g., navigate away or show different content)
    console.log('User declined to continue')
  }
}

const handleSubmit = async (formData: FormData) => {}
</script>

<template>
  <div class="bg-white shadow-sm p-8 rounded-lg">
    <template v-if="currentStep === 'confirm'">
      <ConfirmDialog
        question="Would you like to start a new multipart form submission?"
        description="This will guide you through creating a raw multipart form submission without any external libraries."
        accept-text="Start Form"
        reject-text="Cancel"
        @clicked-accept="handleConfirm(true)"
        @clicked-reject="handleConfirm(false)"
      />
    </template>

    <template v-else>
      <GetRecipientPaymentInfoForm
        :on-back="() => (currentStep = 'confirm')"
        @submit="handleSubmit"
      />
    </template>
  </div>
</template>
