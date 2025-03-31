<script setup lang="ts">
defineOptions({
  name: 'ComparisonView',
})
</script>

<template>
  <div class="demo-content">
    <h2>Implementation Comparison</h2>
    <p class="description">
      This view will compare the basic implementation with the Multiparter implementation.
    </p>

    <div class="placeholder">
      <p>Comparison details will be added here</p>
    </div>
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

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background-color: #f8f8f8;
  border: 2px dashed #ddd;
  border-radius: 8px;
  margin-top: 2rem;
}

.placeholder p {
  color: #666;
  font-style: italic;
}
</style>
