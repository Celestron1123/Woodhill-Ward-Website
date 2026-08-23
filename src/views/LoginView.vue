<template>
  <div class="page-container auth-container">
    <div class="card auth-card">
      <h2>Ward Log In</h2>
      <p class="subtitle">Welcome back to the Wood Hill Ward website</p>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" class="form-input" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" class="form-input" required />
        </div>

        <button type="submit" class="btn-primary w-full mt-4">Log In</button>
      </form>

      <div class="auth-divider"></div>

      <div class="auth-switch">
        <p>Don't have an account?</p>
        <button @click="goToSignUp" class="btn-secondary">Sign Up Here</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 150px);
}

.auth-card {
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
}

h2 {
  text-align: center;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.w-full {
  width: 100%;
}

.mt-4 {
  margin-top: 1rem;
}

.auth-divider {
  height: 1px;
  background-color: var(--border-color);
  margin: 2rem 0;
}

.auth-switch {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.auth-switch p {
  color: var(--text-secondary);
  margin: 0;
}
</style>

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
