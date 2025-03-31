<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMultiform } from '@/composables/useMultiform'
import ConfirmDialog from '@/components/forms/Confirm.vue'
import GetRecipientPaymentInfoForm from '@/components/forms/GetRecipientPaymentInfoForm.vue'
import ComplianceForm from '@/components/forms/ComplianceForm.vue'
import PaymentDetails from '@/components/forms/PaymentDetails.vue'
import MultipartForm from '@/components/MultipartForm.vue'
import type { Recipient } from '@/composables/useRecipients'
import type { Currency } from '@/types'

defineOptions({
  name: 'MultiparterFormView',
})

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

const paymentData = ref<PaymentData | null>(null)

const multipartForm = useMultiform({
  steps: [
    {
      component: ConfirmDialog,
      props: {
        question: 'Would you like to start a new multipart form submission?',
        description:
          'This demonstrates the power of the Multiparter library for managing complex form flows.',
        acceptText: 'Start Form',
        rejectText: 'Cancel',
      },
      emits: {
        'clicked-accept': () => multipartForm.navigator.next(),
        'clicked-reject': () => console.log('User declined to continue'),
      },
    },
    {
      component: GetRecipientPaymentInfoForm,
      props: {
        onBack: () => multipartForm.navigator.back(),
        initialData: computed(() =>
          paymentData.value
            ? {
                recipient: paymentData.value.recipient,
                sourceAmount: paymentData.value.sourceAmount,
                targetCurrency: paymentData.value.targetCurrency,
              }
            : undefined,
        ),
      },
      emits: {
        submit: (data: PaymentData) => {
          paymentData.value = data
          if (data.sourceAmount >= 10000) {
            multipartForm.navigator.next() // Will go to compliance if it exists
          } else {
            multipartForm.navigator.to(3) // Skip compliance, go to payment details
          }
        },
      },
    },
    {
      component: ComplianceForm,
      existsAsStep: computed(() => {
        const amount = paymentData.value?.sourceAmount
        return amount !== undefined && amount >= 10000
      }),
      props: {
        onBack: () => multipartForm.navigator.back(),
        initialData: computed(() => paymentData.value?.compliance),
      },
      emits: {
        submit: (complianceData: { reason: string; address: string; jobTitle: string }) => {
          if (paymentData.value) {
            paymentData.value = {
              ...paymentData.value,
              compliance: complianceData,
            }
            multipartForm.navigator.next()
          }
        },
      },
    },
    {
      component: PaymentDetails,
      props: computed(() => ({
        paymentData: paymentData.value,
        onBack: () => multipartForm.navigator.back(),
      })),
      emits: {},
    },
  ],
})
</script>

<template>
  <div class="demo-content">
    <h2 class="mb-4 font-semibold text-2xl">Multiparter Form Demo</h2>
    <p class="description">
      This demo showcases the Multiparter library in action, demonstrating how it simplifies complex
      form flows with conditional steps and state management.
    </p>

    <MultipartForm :form="multipartForm" />
  </div>
</template>

<style scoped>
.demo-content {
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.description {
  color: #666;
  margin-bottom: 2rem;
}
</style>
