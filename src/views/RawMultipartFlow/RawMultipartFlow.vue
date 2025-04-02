<script setup lang="ts">
import ConfirmDialog from '@/components/forms/Confirm.vue'
import GetRecipientPaymentInfoForm, {
  type PaymentFormData,
} from '@/components/forms/GetRecipientPaymentInfoForm.vue'
import ComplianceForm, { type ComplianceFormData } from '@/components/forms/ComplianceForm.vue'
import PaymentDetails from '@/components/forms/PaymentDetails.vue'
import { computed, ref } from 'vue'
import { getStepNavigations, type PaymentMultipartStep } from './get-step-navigations'

defineOptions({
  name: 'RawMultipartFlow',
})

const currentStep = ref<PaymentMultipartStep>('confirm')
const paymentData = ref<PaymentFormData | null>(null)
const complianceData = ref<ComplianceFormData | null>(null)

const stepNavigation = computed(() =>
  // Since this is a pure function it is extremely testable, we don't
  // even need to test the UI to know how our step interactions are working
  getStepNavigations({
    complianceData: complianceData.value,
    paymentData: paymentData.value,
    currentStep: currentStep.value,
  }),
)

const next = () => {
  if (stepNavigation.value.next) currentStep.value = stepNavigation.value.next
}

const handleBack = () => {
  if (stepNavigation.value.prev) currentStep.value = stepNavigation.value.prev
}

const defaultComplianceData: ComplianceFormData = {
  address: '',
  jobTitle: '',
  reason: '',
}

const handleConfirm = (confirmed: boolean) => {
  if (confirmed) {
    currentStep.value = 'recipient-info'
  } else {
    // Handle rejection (e.g., navigate away or show different content)
    console.log('User declined to continue')
  }
}

const handlePaymentInfoSubmit = (data: PaymentFormData) => {
  paymentData.value = data
  next()
}

const handleComplianceSubmit = (complianceFormData: ComplianceFormData) => {
  complianceData.value = complianceFormData
}
</script>

<template>
  <div class="flex justify-center bg-white shadow-sm p-8 rounded-lg">
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
          :initial-data="complianceData ?? defaultComplianceData"
          @submit="handleComplianceSubmit"
        />
      </div>
    </template>

    <template v-else-if="currentStep === 'payment-details' && paymentData">
      <PaymentDetails :payment-data="paymentData" :on-back="handleBack" />
    </template>
  </div>
</template>
