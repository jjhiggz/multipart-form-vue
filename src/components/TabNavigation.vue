<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
const currentTab = computed(() => route.name)

const tabs = [
  { name: 'basic', label: 'Basic Form', path: '/basic' },
  { name: 'multiparter', label: 'Multiparter Form', path: '/multiparter' },
]
</script>

<template>
  <nav class="tab-navigation">
    <RouterLink
      v-for="tab in tabs"
      :key="tab.name"
      :to="tab.path"
      class="tab"
      :class="{ active: currentTab === tab.name }"
    >
      {{ tab.label }}
    </RouterLink>
  </nav>
</template>

<style scoped>
.tab-navigation {
  display: flex;
  gap: 1px;
  background-color: #f0f0f0;
  padding: 1px;
  border-radius: 8px;
  margin: 2rem 0;
}

.tab {
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  color: #666;
  background-color: white;
  transition: all 0.2s ease;
  flex: 1;
  text-align: center;
}

.tab:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.tab:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.tab:hover {
  background-color: #f8f8f8;
}

.tab.active {
  background-color: #42b883;
  color: white;
}
</style>
