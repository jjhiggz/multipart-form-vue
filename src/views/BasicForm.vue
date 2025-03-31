<script setup lang="ts">
import RecipientDropdown from '@/components/RecipientDropdown.vue'
import { ref } from 'vue'
import type { Recipient } from '@/composables/useRecipients'

defineOptions({
  name: 'BasicFormView',
})

interface FormData {
  name: string
  email: string
  files: File[]
  recipient: Recipient | null
}

const formData = ref<FormData>({
  name: '',
  email: '',
  files: [],
  recipient: null,
})

const handleSubmit = async (e: Event) => {
  e.preventDefault()

  const data = new FormData()
  data.append('name', formData.value.name)
  data.append('email', formData.value.email)
  data.append('recipientId', formData.value.recipient?.id || '')
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
  <div class="bg-white shadow-sm p-8 rounded-lg">
    <h2 class="mb-2 font-semibold text-gray-900 text-2xl">Basic Multipart Form</h2>
    <p class="mb-8 text-gray-600">
      This demo shows a basic multipart form implementation without any external libraries.
    </p>

    <form @submit="handleSubmit" class="space-y-6 mx-auto max-w-lg">
      <div class="space-y-2">
        <label for="name" class="block font-medium text-gray-700">Name:</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          required
          class="px-3 py-2 border border-gray-300 focus:border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
      </div>

      <div class="space-y-2">
        <label class="block font-medium text-gray-700">Recipient:</label>
        <RecipientDropdown v-model="formData.recipient" />
      </div>

      <div class="space-y-2">
        <label for="email" class="block font-medium text-gray-700">Email:</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          required
          class="px-3 py-2 border border-gray-300 focus:border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
      </div>

      <div class="space-y-2">
        <label for="files" class="block font-medium text-gray-700">Files:</label>
        <input
          id="files"
          type="file"
          @change="handleFileChange"
          multiple
          class="hover:file:bg-blue-100 file:bg-blue-50 file:mr-4 file:px-4 file:py-2 file:border-0 file:rounded-md w-full file:font-medium text-gray-600 file:text-blue-700 file:text-sm"
        />
      </div>

      <div v-if="formData.files.length" class="space-y-2 bg-gray-50 mt-4 p-4 rounded-md">
        <h3 class="font-medium text-gray-900">Selected Files:</h3>
        <ul class="space-y-1">
          <li
            v-for="file in formData.files"
            :key="file.name"
            class="px-3 py-2 border-gray-100 last:border-0 border-b text-gray-600 text-sm"
          >
            {{ file.name }} ({{ (file.size / 1024).toFixed(2) }} KB)
          </li>
        </ul>
      </div>

      <button
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 w-full text-white transition-colors"
      >
        Submit
      </button>
    </form>
  </div>
</template>
