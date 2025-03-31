<script setup lang="ts">
import RecipientDropdown from '@/components/RecipientDropdown.vue'
import CurrencyDropdown from '@/components/CurrencyDropdown.vue'
import { computed, ref } from 'vue'
import type { Recipient } from '@/composables/useRecipients'
import type { Currency } from '@/types'
import { useCurrencyConversion } from '@/composables/useCurrencyConversion'
import { useDebounceFn } from '@vueuse/core'

defineOptions({
  name: 'GetRecipientPaymentInfoForm',
})

interface FormData {
  recipient: Recipient | null
  targetCurrency: Currency | null
  sendAmount: number | null
}

interface Props {
  onBack?: () => void
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'submit', data: FormData): void
}>()

const formData = ref<FormData>({
  recipient: null,
  targetCurrency: null,
  sendAmount: null,
})

// Separate ref for the input value to handle debouncing
const sendAmountInput = ref('')

// When recipient changes, update the target currency to match their currency
const handleRecipientChange = (recipient: Recipient) => {
  formData.value.recipient = recipient
  formData.value.targetCurrency = recipient.currency as Currency
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  emit('submit', formData.value)
}

// Debounced handler for updating the actual send amount
const updateSendAmount = useDebounceFn((value: string) => {
  const numValue = value ? parseFloat(value) : null
  formData.value.sendAmount = numValue
}, 300)

// Watch the input value and update the form data through debounce
const handleSendAmountInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  sendAmountInput.value = value
  updateSendAmount(value)
}

// Create conversion parameters when we have all required fields
const conversionParams = computed(() => {
  const { sendAmount, targetCurrency } = formData.value
  if (!sendAmount || !targetCurrency) return null

  return {
    from: 'USD' as Currency,
    to: targetCurrency,
    amount: sendAmount,
  }
})

// Use the currency conversion hook
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
        <RecipientDropdown v-model="formData.recipient" @select="handleRecipientChange" />
      </div>

      <div v-if="formData.recipient" class="space-y-6">
        <div class="space-y-2">
          <label class="block font-medium text-gray-700">Target Currency:</label>
          <CurrencyDropdown
            v-model:selectedCurrency="formData.targetCurrency"
            :defaultCurrency="formData.recipient.currency as Currency"
          />
        </div>

        <div class="space-y-2">
          <label for="sendAmount" class="block font-medium text-gray-700">Send Amount (USD):</label>
          <div class="relative">
            <span class="top-1/2 left-3 absolute text-gray-500 -translate-y-1/2">$</span>
            <input
              id="sendAmount"
              :value="sendAmountInput"
              @input="handleSendAmountInput"
              type="number"
              min="0"
              step="0.01"
              required
              class="px-3 py-2 pl-7 border border-gray-300 focus:border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              placeholder="0.00"
            />
          </div>
        </div>

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
            <template v-else> {{ targetAmount }} {{ formData.targetCurrency }} </template>
          </div>
          <div v-if="exchangeRate" class="mt-1 text-gray-500 text-sm">
            Rate: 1 USD = {{ exchangeRate }} {{ formData.targetCurrency }}
          </div>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <button
          v-if="onBack"
          type="button"
          class="bg-white hover:bg-gray-50 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-gray-700"
          @click="onBack"
        >
          Back
        </button>
        <button
          type="submit"
          class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-white"
          :disabled="!formData.recipient || !formData.sendAmount || isConverting || isError"
        >
          Continue
        </button>
      </div>
    </form>
  </div>
</template>
