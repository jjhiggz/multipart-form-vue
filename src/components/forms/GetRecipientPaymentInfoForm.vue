<script setup lang="ts">
import RecipientDropdown from '@/components/RecipientDropdown.vue'
import CurrencyDropdown from '@/components/CurrencyDropdown.vue'
import { computed, ref } from 'vue'
import type { Recipient } from '@/composables/useRecipients'
import type { Currency } from '@/types'

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

// When recipient changes, update the target currency to match their currency
const handleRecipientChange = (recipient: Recipient) => {
  formData.value.recipient = recipient
  formData.value.targetCurrency = recipient.currency as Currency
}

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  emit('submit', formData.value)
}

// Computed property to show the target amount (for now just showing the same amount)
const targetAmount = computed(() => {
  if (!formData.value.sendAmount) return null
  return formData.value.sendAmount
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
              v-model="formData.sendAmount"
              type="number"
              min="0"
              step="0.01"
              required
              class="px-3 py-2 pl-7 border border-gray-300 focus:border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              placeholder="0.00"
            />
          </div>
        </div>

        <div v-if="targetAmount !== null" class="bg-gray-50 p-4 rounded-md">
          <div class="text-gray-600 text-sm">Target Amount:</div>
          <div class="font-medium text-gray-900 text-lg">
            {{ targetAmount }} {{ formData.targetCurrency }}
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
          :disabled="!formData.recipient || !formData.sendAmount"
        >
          Continue
        </button>
      </div>
    </form>
  </div>
</template>
