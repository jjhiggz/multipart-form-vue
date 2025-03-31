<script setup lang="ts">
import ConfirmDialog from '@/components/forms/Confirm.vue'
import GetRecipientPaymentInfoForm from '@/components/forms/GetRecipientPaymentInfoForm.vue'
import ComplianceForm from '@/components/forms/ComplianceForm.vue'
import PaymentDetails from '@/components/forms/PaymentDetails.vue'
import { ref } from 'vue'
import type { Recipient } from '@/composables/useRecipients'
import type { Currency } from '@/types'

defineOptions({
  name: 'RawMultipartFlow',
})

type FlowStep = 'confirm' | 'recipient-info' | 'compliance' | 'payment-details'

interface PaymentData {
  recipient: Recipient
  sourceAmount: number
  sourceCurrency: Currency
  targetCurrency: Currency
  targetAmount: number
  exchangeRate: number
  convertedAt: string
  compliance?: {
    reason: string
    address: string
    jobTitle: string
  }
}

const currentStep = ref<FlowStep>('confirm')
const paymentData = ref<PaymentData | null>(null)

const handleConfirm = (confirmed: boolean) => {
  if (confirmed) {
    currentStep.value = 'recipient-info'
  } else {
    // Handle rejection (e.g., navigate away or show different content)
    console.log('User declined to continue')
  }
}

const handlePaymentInfoSubmit = (data: PaymentData) => {
  paymentData.value = data

  // Route based on amount
  if (data.sourceAmount >= 10000) {
    currentStep.value = 'compliance'
  } else {
    currentStep.value = 'payment-details'
  }
}

const handleComplianceSubmit = (complianceData: {
  reason: string
  address: string
  jobTitle: string
}) => {
  if (paymentData.value) {
    paymentData.value = {
      ...paymentData.value,
      compliance: complianceData,
    }
    currentStep.value = 'payment-details'
  }
}

const handleBack = () => {
  switch (currentStep.value) {
    case 'recipient-info':
      currentStep.value = 'confirm'
      break
    case 'compliance':
    case 'payment-details':
      currentStep.value = 'recipient-info'
      break
  }
}
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

    <template v-else-if="currentStep === 'recipient-info'">
      <GetRecipientPaymentInfoForm
        :on-back="handleBack"
        :initial-data="
          paymentData
            ? {
                recipient: paymentData.recipient,
                sourceAmount: paymentData.sourceAmount,
                targetCurrency: paymentData.targetCurrency,
              }
            : undefined
        "
        @submit="handlePaymentInfoSubmit"
      />
    </template>

    <template v-else-if="currentStep === 'compliance'">
      <div>
        <h2 class="mb-2 font-semibold text-gray-900 text-2xl">Compliance Information</h2>
        <p class="mb-8 text-gray-600">
          For payments over $10,000, we need additional information to comply with regulations.
        </p>
        <ComplianceForm
          :on-back="handleBack"
          :initial-data="paymentData?.compliance"
          @submit="handleComplianceSubmit"
        />
      </div>
    </template>

    <template v-else-if="currentStep === 'payment-details' && paymentData">
      <PaymentDetails :payment-data="paymentData" :on-back="handleBack" />
    </template>
  </div>
</template>
