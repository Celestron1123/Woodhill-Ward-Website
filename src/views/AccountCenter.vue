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
        console.error("Error fetching user data:", error)
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
    console.error("Error logging out:", error)
  }
}
</script>

<style scoped>
.account-center {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.cta-container {
  text-align: center;
  padding: 2rem 0;
}

.cta-button {
  margin-top: 1rem;
  padding: 0.5rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.cta-button:hover {
  background-color: #0056b3;
}

.account-details {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-group label {
  font-size: 0.85rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-group p {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: #e9ecef;
  border-radius: 4px;
  font-size: 0.9rem !important;
  font-weight: 500;
  text-transform: capitalize;
  align-self: flex-start;
}

.logout-button {
  margin-top: 2rem;
  padding: 0.75rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #c82333;
}
</style>
