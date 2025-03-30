<script setup lang="ts">
// Component logic will go here later
</script>

<template>
  <main>
    <h1>Welcome</h1>
    <router-link to="/multipart-demo">Go to Multipart Demo</router-link>
  </main>
</template>

<style scoped>
main {
  padding: 2rem;
  text-align: center;
}

.router-link {
  color: #42b883;
  text-decoration: none;
  font-size: 1.2rem;
}

.router-link:hover {
  text-decoration: underline;
}
</style>
