<template>
  <div class="cyber-panel" style="max-width: 500px; margin: 0 auto;">
    <h2 class="chrome-text">Ward Sign Up</h2>

    <form @submit.prevent="handleSignUp">
      <div style="margin-bottom: 15px;">
        <label for="username" class="digital-label" style="display: block; margin-bottom: 5px;">USERNAME:</label>
        <input type="text" id="username" v-model="username" class="cyber-input" style="width: 100%; box-sizing: border-box;" required />
      </div>

      <div style="margin-bottom: 15px;">
        <label for="email" class="digital-label" style="display: block; margin-bottom: 5px;">EMAIL:</label>
        <input type="email" id="email" v-model="email" class="cyber-input" style="width: 100%; box-sizing: border-box;" required />
      </div>

      <div style="margin-bottom: 15px;">
        <label for="password" class="digital-label" style="display: block; margin-bottom: 5px;">PASSWORD:</label>
        <input type="password" id="password" v-model="password" class="cyber-input" style="width: 100%; box-sizing: border-box;" required />
      </div>

      <button type="submit" class="aqua-btn" style="width: 100%;">Create Account</button>
    </form>

    <hr style="border-color: #555; margin: 20px 0;" />
    <p style="color: #ccc; text-align: center;">Already have an account?</p>
    <div style="text-align: center;">
      <button @click="goToLogin" class="aqua-btn" style="background: var(--titanium-2);">Log In Here</button>
    </div>
  </div>
</template>

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
