<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmEmail = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (
    !firstName.value ||
    !lastName.value ||
    !email.value ||
    !confirmEmail.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorMessage.value = 'Please fill in all fields.'
    return
  }

  if (email.value !== confirmEmail.value) {
    errorMessage.value = 'Emails do not match.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  try {
    const response = await axios.post('http://localhost:3000/auth/register', {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    })

    console.log('register success:', response.data)
    successMessage.value = 'Account created successfully.'

    setTimeout(() => {
      router.push('/login')
    }, 1000)
  } catch (error: any) {
    errorMessage.value =
      error?.response?.data?.message || 'Register failed.'
  }
}


</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
      <h1 class="mb-6 text-center text-3xl font-bold">Create account</h1>

      <form class="space-y-4" @submit.prevent="handleRegister">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">
            First name
          </label>
          <input
            v-model="firstName"
            type="text"
            placeholder="Enter your first name"
            class="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-black"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">
            Last name
          </label>
          <input
            v-model="lastName"
            type="text"
            placeholder="Enter your last name"
            class="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-black"
          />
        </div>

        <!-- Email -->
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

        <!-- Confirm Email（新增） -->
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">
            Confirm email
          </label>
          <input
            v-model="confirmEmail"
            type="email"
            placeholder="Confirm your email"
            class="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-black"
          />
        </div>

        <!-- Password -->
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

        <!-- Confirm Password -->
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">
            Confirm password
          </label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            class="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-black"
          />
        </div>

        <p v-if="errorMessage" class="text-sm text-red-500">
          {{ errorMessage }}
        </p>

        <p v-if="successMessage" class="text-sm text-green-600">
          {{ successMessage }}
        </p>

        <button
          type="submit"
          class="w-full rounded-md bg-black px-4 py-2 text-white hover:opacity-90"
        >
          Register
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-500">
        Already have an account?
        <span
          class="cursor-pointer font-medium text-black"
          @click="router.push('/login')"
        >
          Sign in
        </span>
      </p>
    </div>
  </div>
</template>