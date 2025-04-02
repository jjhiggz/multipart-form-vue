import { describe, it, expect } from 'vitest'
import { getStepNavigations } from '../get-step-navigations'
import type { PaymentFormData } from '@/components/forms/GetRecipientPaymentInfoForm.vue'

describe('getStepNavigations', () => {
  // Helper function to create test data
  const createTestData = (
    currentStep: 'confirm' | 'recipient-info' | 'compliance' | 'payment-details',
    paymentAmount?: number,
  ) => ({
    currentStep,
    complianceData: null,
    paymentData: paymentAmount
      ? ({
          sourceAmount: paymentAmount,
          // Other required fields with dummy data
          recipient: {
            id: '1',
            name: 'Test',
            email: 'test@example.com',
            type: 'individual',
            currency: 'USD',
          },
          sourceCurrency: 'USD',
          targetCurrency: 'EUR',
          targetAmount: 100,
          exchangeRate: 1.1,
          convertedAt: new Date().toISOString(),
        } as PaymentFormData)
      : null,
  })

  describe('from confirm step', () => {
    it('should navigate to recipient-info and have no previous step', () => {
      const result = getStepNavigations(createTestData('confirm'))
      expect(result).toEqual({
        next: 'recipient-info',
        prev: null,
      })
    })
  })

  describe('from recipient-info step', () => {
    it('should navigate to compliance when amount >= 10000', () => {
      const result = getStepNavigations(createTestData('recipient-info', 10000))
      expect(result).toEqual({
        next: 'compliance',
        prev: 'confirm',
      })
    })

    it('should skip compliance and go to payment-details when amount < 10000', () => {
      const result = getStepNavigations(createTestData('recipient-info', 9999))
      expect(result).toEqual({
        next: 'payment-details',
        prev: 'confirm',
      })
    })

    it('should handle null payment data', () => {
      const result = getStepNavigations(createTestData('recipient-info'))
      expect(result).toEqual({
        next: 'payment-details',
        prev: 'confirm',
      })
    })
  })

  describe('from compliance step', () => {
    it('should navigate to payment-details and back to recipient-info', () => {
      const result = getStepNavigations(createTestData('compliance'))
      expect(result).toEqual({
        next: 'payment-details',
        prev: 'recipient-info',
      })
    })
  })

  describe('from payment-details step', () => {
    it('should have no next step and navigate back to recipient-info', () => {
      const result = getStepNavigations(createTestData('payment-details'))
      expect(result).toEqual({
        next: null,
        prev: 'recipient-info',
      })
    })
  })

  describe('edge cases', () => {
    it('should handle undefined amounts as less than 10000', () => {
      const result = getStepNavigations({
        currentStep: 'recipient-info',
        complianceData: null,
        paymentData: {
          sourceAmount: undefined as unknown as number, // Simulating undefined amount
          recipient: {
            id: '1',
            name: 'Test',
            email: 'test@example.com',
            type: 'individual',
            currency: 'USD',
          },
          sourceCurrency: 'USD',
          targetCurrency: 'EUR',
          targetAmount: 100,
          exchangeRate: 1.1,
          convertedAt: new Date().toISOString(),
        } as PaymentFormData,
      })
      expect(result.next).toBe('payment-details')
    })

    it('should handle exactly 10000', () => {
      const result = getStepNavigations(createTestData('recipient-info', 10000))
      expect(result.next).toBe('compliance')
    })
  })
})
