<script setup lang="ts">
import RecipientDropdown from '@/components/RecipientDropdown.vue'
import CurrencyDropdown from '@/components/CurrencyDropdown.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { computed, ref } from 'vue'
import type { Recipient } from '@/composables/useRecipients'
import type { Currency } from '@/types'
import { useCurrencyConversion } from '@/composables/useCurrencyConversion'
import { useDebounceFn } from '@vueuse/core'

defineOptions({
  name: 'GetRecipientPaymentInfoForm',
})

interface Props {
  onBack?: () => void
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'submit', data: { recipient: Recipient; targetCurrency: Currency; sendAmount: number }): void
}>()

// Atomic state
const selectedRecipient = ref<Recipient | null>(null)
const selectedCurrency = ref<Currency | null>(null)
const sendAmount = ref<number | null>(null)
const sendAmountInput = ref('')

// Handle amount changes with debounce
const handleAmountChange = useDebounceFn((value: string) => {
  sendAmountInput.value = value
  const numericValue = value ? parseFloat(value) : null
  if (!isNaN(numericValue as number)) {
    sendAmount.value = numericValue
  }
}, 300)

// When recipient changes, update the target currency to match their currency
const handleRecipientChange = (recipient: Recipient) => {
  selectedRecipient.value = recipient
  selectedCurrency.value = recipient.currency as Currency
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  if (!selectedRecipient.value || !selectedCurrency.value || !sendAmount.value) return

  emit('submit', {
    recipient: selectedRecipient.value,
    targetCurrency: selectedCurrency.value,
    sendAmount: sendAmount.value,
  })
}

// Computed params for currency conversion
const conversionParams = computed(() => {
  const amount = sendAmountInput.value ? parseFloat(sendAmountInput.value) : null
  if (!amount || !selectedCurrency.value || isNaN(amount)) return null

  return {
    from: 'USD' as Currency,
    to: selectedCurrency.value,
    amount,
  }
})

// Use the currency conversion hook with computed params
const {
  data: conversionData,
  isPending: isConverting,
  isError,
  error,
} = useCurrencyConversion(conversionParams)

// Format currency with 2 decimal places
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Show converted amount when available
const targetAmount = computed(() => {
  if (isConverting.value) return 'Converting...'
  if (isError.value) return 'Error converting amount'
  if (!conversionData.value) return null
  return formatCurrency(conversionData.value.convertedAmount)
})

// Format exchange rate
const exchangeRate = computed(() => {
  if (!conversionData.value) return null
  return formatCurrency(conversionData.value.rate)
})
</script>

<template>
  <div>
    <h2 class="mb-2 font-semibold text-gray-900 text-2xl">Payment Information</h2>
    <p class="mb-8 text-gray-600">Select a recipient and enter the amount you'd like to send.</p>

    <form @submit="handleSubmit" class="space-y-6 mx-auto max-w-lg">
      <div class="space-y-2">
        <label class="block font-medium text-gray-700">Recipient:</label>
        <RecipientDropdown v-model="selectedRecipient" @select="handleRecipientChange" />
      </div>

      <div v-if="selectedRecipient" class="space-y-6">
        <div class="space-y-2">
          <label class="block font-medium text-gray-700">Target Currency:</label>
          <CurrencyDropdown
            v-model:selectedCurrency="selectedCurrency"
            :defaultCurrency="selectedRecipient.currency as Currency"
          />
        </div>

        <BaseInput
          :model-value="sendAmountInput"
          @update:model-value="handleAmountChange"
          type="number"
          label="Send Amount (USD):"
          prefix="$"
          :min="0"
          :step="0.01"
          required
          placeholder="0.00"
        />

        <div
          v-if="targetAmount !== null"
          class="bg-gray-50 p-4 rounded-md"
          :class="{
            'bg-red-50': isError,
          }"
        >
          <div class="text-gray-600 text-sm">Target Amount:</div>
          <div
            class="font-medium text-lg"
            :class="{
              'text-gray-900': !isError,
              'text-gray-500': isConverting,
              'text-red-600': isError,
            }"
          >
            <template v-if="isConverting">
              <span class="inline-flex items-center gap-2">
                <svg
                  class="w-4 h-4 text-gray-500 animate-spin"
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
                Converting...
              </span>
            </template>
            <template v-else-if="isError">
              <span class="inline-flex items-center gap-2">
                <svg
                  class="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                {{ error?.message || 'Error converting amount' }}
              </span>
            </template>
            <template v-else> {{ targetAmount }} {{ selectedCurrency }} </template>
          </div>
          <div v-if="exchangeRate" class="mt-1 text-gray-500 text-sm">
            Rate: 1 USD = {{ exchangeRate }} {{ selectedCurrency }}
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <BaseButton v-if="onBack" variant="secondary" @click="onBack"> Back </BaseButton>
        <BaseButton
          type="submit"
          :disabled="!selectedRecipient || !sendAmount || isConverting || isError"
          :loading="isConverting"
        >
          Continue
        </BaseButton>
      </div>
    </form>
  </div>
</template>
