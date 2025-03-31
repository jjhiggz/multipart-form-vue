<script setup lang="ts">
import { useRecipients } from '@/composables/useRecipients'

defineOptions({
  name: 'ComparisonView',
})

const { data, isPending, isError, error } = useRecipients()
</script>

<template>
  <div class="demo-content">
    <h2>Implementation Comparison</h2>
    <p class="description">
      This view compares the basic implementation with the Multiparter implementation.
    </p>

    <div class="recipients-list" v-if="!isPending && !isError">
      <h3>Recipients ({{ data?.count }})</h3>
      <ul>
        <li v-for="recipient in data?.recipients" :key="recipient.id">
          <strong>{{ recipient.name }}</strong>
          <br />
          <small>{{ recipient.email }} ({{ recipient.type }})</small>
        </li>
      </ul>
    </div>

    <div v-else-if="isPending" class="loading">Loading recipients...</div>

    <div v-else-if="isError" class="error">Error: {{ error?.message }}</div>
  </div>
</template>

<style scoped>
.demo-content {
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.description {
  color: #666;
  margin-bottom: 2rem;
}

.recipients-list {
  background-color: #f8f8f8;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.recipients-list h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.recipients-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recipients-list li {
  padding: 1rem;
  background: white;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.recipients-list li:last-child {
  margin-bottom: 0;
}

.recipients-list strong {
  color: #2c3e50;
  font-size: 1.1rem;
}

.recipients-list small {
  color: #666;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #dc3545;
}
</style>
