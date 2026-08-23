<template>
  <div class="account-center">
    <h2>Account Center</h2>

    <div v-if="!isLoggedIn" class="cta-container">
      <p>Please log in to view your account details.</p>
      <button @click="goToLogin" class="cta-button">Log In</button>
    </div>

    <div v-else class="account-details">
      <div class="info-group">
        <label>Username:</label>
        <p>{{ userData?.username || 'N/A' }}</p>
      </div>

      <div class="info-group">
        <label>Email:</label>
        <p>{{ userData?.email || 'N/A' }}</p>
      </div>

      <div class="info-group">
        <label>Role:</label>
        <p class="role-badge">{{ userData?.role || 'Viewer' }}</p>
      </div>

      <div class="info-group" v-if="userData?.calling">
        <label>Calling:</label>
        <p>{{ userData.calling }}</p>
      </div>

      <button @click="handleLogout" class="logout-button">Log Out</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const router = useRouter()
const isLoggedIn = ref(false)
const userData = ref(null)

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      isLoggedIn.value = true
      try {
        const userDocRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          userData.value = userDoc.data()
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    } else {
      isLoggedIn.value = false
    }
  })
})

const goToLogin = () => {
  router.push('/login')
}

const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/home')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}
</script>

<style scoped>
.account-center {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2.5rem;
  background-color: var(--surface-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

h2 {
  margin-bottom: 2rem;
  color: var(--primary-color);
  font-size: 2rem;
  text-align: center;
}

.cta-container {
  text-align: center;
  padding: 3rem 0;
}

.cta-container p {
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.cta-button {
  padding: 0.75rem 2rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.cta-button:hover {
  background-color: var(--accent-hover);
}

.account-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.info-group:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.info-group label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.info-group p {
  margin: 0;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: var(--accent-color);
  color: white !important;
  border-radius: 9999px;
  font-size: 0.85rem !important;
  font-weight: 600;
  text-transform: capitalize;
  align-self: flex-start;
}

.logout-button {
  margin-top: 2rem;
  padding: 0.75rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s;
  width: 100%;
}

.logout-button:hover {
  background-color: #dc2626;
}
</style>
