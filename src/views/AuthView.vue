<template>
  <div class="page-container auth-container">
    <div class="card auth-card">
      <h2>Ward Sign Up</h2>
      <p class="subtitle">Create an account to join the ward website</p>

      <form @submit.prevent="handleSignUp" class="auth-form">
        <div class="form-group">
          <label for="username">Full Name</label>
          <input type="text" id="username" v-model="username" class="form-input" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" class="form-input" required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" class="form-input" required />
        </div>

        <button type="submit" class="btn-primary w-full mt-4">Create Account</button>
      </form>

      <div class="auth-divider"></div>

      <div class="auth-switch">
        <p>Already have an account?</p>
        <button @click="goToLogin" class="btn-secondary">Log In Here</button>
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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase' // Importing both auth and our database
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const email = ref('')
const password = ref('')

const handleSignUp = async () => {
  try {
    // 1. Create the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user
    await updateProfile(user, { displayName: username.value })

    // 2. Create the user document in the Firestore Database
    // We use the Auth UID as the Document ID to link them perfectly
    await setDoc(doc(db, 'users', user.uid), {
      username: username.value,
      email: user.email,
      role: 'viewer', // Everyone starts as a viewer per the design doc
      calling: '', // Placeholder for future use
      created: new Date(),
    })
    console.log('Account created and added to database!')

    router.push('/home') // Navigate to the feed after successful sign-up
  } catch (error) {
    console.error('Error signing up:', error.message)
    alert(error.message)
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>
