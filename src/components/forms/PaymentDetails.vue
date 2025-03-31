<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue'
import type { Recipient } from '@/composables/useRecipients'
import type { Currency } from '@/types'

defineOptions({
  name: 'PaymentDetails',
})

interface Props {
  paymentData: {
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
  onBack?: () => void
}

const props = defineProps<Props>()

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(value)
}
</script>

<template>
  <div>
    <h2 class="mb-2 font-semibold text-gray-900 text-2xl">Payment Details</h2>
    <p class="mb-8 text-gray-600">Review your payment details below.</p>
    <div class="space-y-4 bg-gray-50 p-6 rounded-lg">
      <div class="gap-2 grid grid-cols-2 text-sm">
        <div class="text-gray-500">Recipient:</div>
        <div class="text-gray-900">{{ paymentData.recipient.name }}</div>

        <div class="text-gray-500">Send Amount:</div>
        <div class="text-gray-900">${{ formatNumber(paymentData.sourceAmount) }} USD</div>

        <div class="text-gray-500">Target Amount:</div>
        <div class="text-gray-900">
          {{ formatNumber(paymentData.targetAmount) }}
          {{ paymentData.targetCurrency }}
        </div>

        <div class="text-gray-500">Exchange Rate:</div>
        <div class="text-gray-900">
          1 USD = {{ formatNumber(paymentData.exchangeRate) }}
          {{ paymentData.targetCurrency }}
        </div>

        <template v-if="paymentData.compliance">
          <div class="col-span-2 mt-4">
            <h3 class="mb-2 font-medium text-gray-900">Compliance Information</h3>
            <div class="gap-2 grid grid-cols-2">
              <div class="text-gray-500">Reason:</div>
              <div class="text-gray-900">{{ paymentData.compliance.reason }}</div>

              <div class="text-gray-500">Address:</div>
              <div class="text-gray-900">{{ paymentData.compliance.address }}</div>

              <div class="text-gray-500">Job Title:</div>
              <div class="text-gray-900">{{ paymentData.compliance.jobTitle }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div class="flex justify-end gap-3 mt-6">
      <BaseButton v-if="props.onBack" variant="secondary" @click="props.onBack"> Back </BaseButton>
      <BaseButton type="submit"> Confirm Payment </BaseButton>
    </div>
  </div>
</template>
