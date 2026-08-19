<template>
  <div class="cyber-panel" style="max-width: 500px; margin: 0 auto;">
    <h2 class="chrome-text">Ward Log In</h2>

    <form @submit.prevent="handleLogin">
      <div style="margin-bottom: 15px;">
        <label for="email" class="digital-label" style="display: block; margin-bottom: 5px;">EMAIL:</label>
        <input type="email" id="email" v-model="email" class="cyber-input" style="width: 100%; box-sizing: border-box;" required />
      </div>

      <div style="margin-bottom: 15px;">
        <label for="password" class="digital-label" style="display: block; margin-bottom: 5px;">PASSWORD:</label>
        <input type="password" id="password" v-model="password" class="cyber-input" style="width: 100%; box-sizing: border-box;" required />
      </div>

      <button type="submit" class="aqua-btn" style="width: 100%;">Log In</button>
    </form>

    <hr style="border-color: #555; margin: 20px 0;" />

    <p style="color: #ccc; text-align: center;">Don't have an account?</p>
    <div style="text-align: center;">
      <button @click="goToSignUp" class="aqua-btn" style="background: var(--titanium-2);">Sign Up Here</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    // This function checks the database to see if the user exists and the password matches
    await signInWithEmailAndPassword(auth, email.value, password.value)

    console.log('Logged in successfully!')
    router.push('/home')
  } catch (error) {
    console.error('Error logging in:', error.message)
    alert('Invalid email or password.')
  }
}

const goToSignUp = () => {
  router.push('/')
}
</script>
