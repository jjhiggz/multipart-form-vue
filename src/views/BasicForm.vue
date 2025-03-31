<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'BasicFormView',
})

interface FormData {
  name: string
  email: string
  files: File[]
}

const formData = ref<FormData>({
  name: '',
  email: '',
  files: [],
})

const handleSubmit = async (e: Event) => {
  e.preventDefault()

  const data = new FormData()
  data.append('name', formData.value.name)
  data.append('email', formData.value.email)
  formData.value.files.forEach((file) => {
    data.append('files', file)
  })

  try {
    const response = await fetch('https://httpbin.org/post', {
      method: 'POST',
      body: data,
    })
    const result = await response.json()
    console.log('Upload successful:', result)
  } catch (error) {
    console.error('Upload failed:', error)
  }
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    formData.value.files = Array.from(target.files)
  }
}
</script>

<template>
  <div class="demo-content">
    <h2>Basic Multipart Form</h2>
    <p class="description">
      This demo shows a basic multipart form implementation without any external libraries.
    </p>

    <form @submit="handleSubmit" class="form">
      <div class="form-group">
        <label for="name">Name:</label>
        <input id="name" v-model="formData.name" type="text" required class="input" />
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input id="email" v-model="formData.email" type="email" required class="input" />
      </div>

      <div class="form-group">
        <label for="files">Files:</label>
        <input id="files" type="file" @change="handleFileChange" multiple class="file-input" />
      </div>

      <div class="selected-files" v-if="formData.files.length">
        <h3>Selected Files:</h3>
        <ul>
          <li v-for="file in formData.files" :key="file.name">
            {{ file.name }} ({{ (file.size / 1024).toFixed(2) }} KB)
          </li>
        </ul>
      </div>

      <button type="submit" class="submit-button">Submit</button>
    </form>
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

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 500;
  color: #2c3e50;
}

.input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input:focus {
  border-color: #42b883;
  outline: none;
}

.file-input {
  padding: 0.5rem 0;
}

.selected-files {
  background-color: #f8f8f8;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

.selected-files h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #2c3e50;
}

.selected-files ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.selected-files li {
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
  font-size: 0.9rem;
  color: #666;
}

.selected-files li:last-child {
  border-bottom: none;
}

.submit-button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #3aa876;
}
</style>
