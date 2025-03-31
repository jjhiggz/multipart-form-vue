<template>
  <span
    class="inline-flex items-center gap-2 font-sans"
    :class="{
      'text-sm': size === 'small',
      'text-base': size === 'medium',
      'text-lg': size === 'large',
    }"
    :title="currency"
  >
    {{ currencyToFlag[currency] }}
    <span>{{ currency }}</span>
  </span>
</template>

<script setup lang="ts">
interface Props {
  currency: 'EUR' | 'USD' | 'GBP' | 'JPY' | 'CHF' | 'CAD' | 'AUD' | 'CNY'
  size?: 'small' | 'medium' | 'large'
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
})

const currencyToFlag = {
  EUR: '🇪🇺',
  USD: '🇺🇸',
  GBP: '🇬🇧',
  JPY: '🇯🇵',
  CHF: '🇨🇭',
  CAD: '🇨🇦',
  AUD: '🇦🇺',
  CNY: '🇨🇳',
} as const
</script>
