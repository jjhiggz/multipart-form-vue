<script setup lang="ts">
import { RouterView } from 'vue-router'
import TabNavigation from './components/TabNavigation.vue'
</script>

<template>
  <div class="app-container">
    <h1>Multipart Form</h1>
    <TabNavigation />
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 600;
}

main {
  margin-top: 2rem;
}
</style>
