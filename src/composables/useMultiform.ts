import type { Component, ComputedRef } from 'vue'
import { computed, ref } from 'vue'

export interface MultipartStep<TProps = any, TEmits = any> {
  component: Component
  canNavigateToNext?: ComputedRef<boolean>
  canNavigateToPrevious?: ComputedRef<boolean>
  existsAsStep?: ComputedRef<boolean>
  props: TProps
  emits: TEmits
}

export interface MultipartNavigator {
  next: () => void
  back: (steps?: number) => void
  to: (stepIndex: number) => void
  canGoNext: ComputedRef<boolean>
  canGoBack: ComputedRef<boolean>
  currentStepIndex: ComputedRef<number>
}

export interface UseMultiformOptions {
  steps: MultipartStep[]
}

export interface UseMultiformReturn {
  currentStep: ComputedRef<MultipartStep>
  navigator: MultipartNavigator
  isFirstStep: ComputedRef<boolean>
  isLastStep: ComputedRef<boolean>
}

export function useMultiform(options: UseMultiformOptions): UseMultiformReturn {
  const currentStepIndex = ref(0)

  // Filter out steps that don't exist
  const availableSteps = computed(() => {
    return options.steps.filter((step) => {
      return step.existsAsStep === undefined || step.existsAsStep.value
    })
  })

  // Get the current step
  const currentStep = computed(() => {
    return availableSteps.value[currentStepIndex.value]
  })

  // Navigation helpers
  const isFirstStep = computed(() => currentStepIndex.value === 0)
  const isLastStep = computed(() => currentStepIndex.value === availableSteps.value.length - 1)

  // Navigation permissions
  const canGoNext = computed(() => {
    if (isLastStep.value) return false
    const step = currentStep.value
    return step.canNavigateToNext === undefined || step.canNavigateToNext.value
  })

  const canGoBack = computed(() => {
    if (isFirstStep.value) return false
    const step = currentStep.value
    return step.canNavigateToPrevious === undefined || step.canNavigateToPrevious.value
  })

  // Navigation functions
  const navigator: MultipartNavigator = {
    next: () => {
      if (!canGoNext.value) return
      currentStepIndex.value++
    },
    back: (steps = 1) => {
      if (!canGoBack.value) return
      currentStepIndex.value = Math.max(0, currentStepIndex.value - steps)
    },
    to: (stepIndex: number) => {
      if (stepIndex < 0 || stepIndex >= availableSteps.value.length) return
      currentStepIndex.value = stepIndex
    },
    canGoNext,
    canGoBack,
    currentStepIndex: computed(() => currentStepIndex.value),
  }

  return {
    currentStep,
    navigator,
    isFirstStep,
    isLastStep,
  }
}
