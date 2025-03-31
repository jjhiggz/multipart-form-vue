<script setup lang="ts">
import { RouterView } from 'vue-router'
import TabNavigation from './components/TabNavigation.vue'
</script>

<template>
  <div class="mx-auto px-8 max-w-7xl">
    <h1 class="mb-8 font-semibold text-[#2c3e50] text-4xl text-center">Multipart Form</h1>
    <TabNavigation />
    <main class="mt-8">
      <RouterView />
    </main>
  </div>
</template>
