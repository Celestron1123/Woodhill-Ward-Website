<template>
  <div>
    <h2>Ward Log In</h2>

    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email: </label>
        <input type="email" id="email" v-model="email" required />
      </div>

      <br />

      <div>
        <label for="password">Password: </label>
        <input type="password" id="password" v-model="password" required />
      </div>

      <br />

      <button type="submit">Log In</button>
    </form>

    <hr />

    <p>Don't have an account?</p>
    <button @click="goToSignUp">Sign Up Here</button>
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
