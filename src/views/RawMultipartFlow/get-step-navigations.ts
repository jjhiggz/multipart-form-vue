import type { ComplianceFormData } from '@/components/forms/ComplianceForm.vue'
import type { PaymentFormData } from '@/components/forms/GetRecipientPaymentInfoForm.vue'

export type PaymentMultipartStep = 'confirm' | 'recipient-info' | 'compliance' | 'payment-details'

export type GetStepsReturn = {
  next: PaymentMultipartStep | null
  prev: PaymentMultipartStep | null
}
// This is now a pure function and is very easily testable
export const getStepNavigations = ({
  complianceData, // unused but could easily be in logic this way
  currentStep,
  paymentData,
}: {
  complianceData: ComplianceFormData | null
  paymentData: PaymentFormData | null
  currentStep: PaymentMultipartStep
}): GetStepsReturn => {
  switch (currentStep) {
    case 'confirm':
      return {
        next: 'recipient-info',
        prev: null,
      }

    case 'compliance':
      return {
        next: 'payment-details',
        prev: 'recipient-info',
      }
    case 'recipient-info':
      return {
        next: paymentData && paymentData.sourceAmount >= 10000 ? 'compliance' : 'payment-details',
        prev: 'confirm',
      }
    case 'payment-details':
      return {
        next: null,
        prev: 'recipient-info',
      }
  }
}
