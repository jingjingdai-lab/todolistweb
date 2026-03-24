<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'


// ---------- Router ----------
const router = useRouter()

// ---------- Reactive state (form) ----------
const email = ref('')
const password = ref('')
const errorMessage = ref('')


// ---------- Auth actions ----------

// Handle user login
const handleLogin = async () => {
  errorMessage.value = ''
  
  // Basic validation: ensure fields are not empty
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter your email and password.'
    return
  }

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      email: email.value,
      password: password.value,
    })

    console.log('login response:', response.data)

     // Store authentication token in localStorage
    localStorage.setItem('token', response.data.access_token)

    // Store user information (used for UI display)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    
    // Redirect to main page after successful login
    router.push('/')
  } catch (error: any) {
    errorMessage.value =
      error?.response?.data?.message || 'Invalid email or password.'
  }
}

</script>


<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
      <h1 class="mb-6 text-center text-3xl font-bold">Sign in</h1>

      <form class="space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            class="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-black"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-black"
          />
        </div>

        <p v-if="errorMessage" class="text-sm text-red-500">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          class="w-full rounded-md bg-black px-4 py-2 text-white hover:opacity-90"
        >
          Login
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-500">
        Don't have an account?
        <span
          class="cursor-pointer font-medium text-black"
          @click="router.push('/register')"
        >
          Sign up
        </span>
      </p>
    </div>
  </div>
</template>