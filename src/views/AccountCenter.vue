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
        <label>Status:</label>
        <p :class="userData?.emailVerified ? 'status-verified' : 'status-unverified'">
          {{ userData?.emailVerified ? 'Verified' : 'Unverified' }}
        </p>
        <button 
          v-if="!userData?.emailVerified" 
          @click="resendVerification" 
          class="resend-button"
        >
          Resend Verification Email
        </button>
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
      <button @click="handleDeleteAccount" class="delete-account-button">Delete Account</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { onAuthStateChanged, signOut, deleteUser, sendEmailVerification } from 'firebase/auth'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const router = useRouter()
const isLoggedIn = ref(false)
const userData = ref(null)

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      isLoggedIn.value = true
      try {
        // Refresh the user token to get the latest emailVerified status from Firebase servers
        await user.reload()
        
        const userDocRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          userData.value = userDoc.data()
          
          // Sync email verification status
          if (userData.value.emailVerified !== user.emailVerified) {
            await updateDoc(userDocRef, { emailVerified: user.emailVerified })
            userData.value.emailVerified = user.emailVerified
          }
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

const resendVerification = async () => {
  try {
    const user = auth.currentUser
    if (user) {
      await sendEmailVerification(user)
      alert('Verification email sent! Please check your inbox.')
    }
  } catch (error) {
    console.error('Error sending verification email:', error)
    // Common error is sending too many requests
    if (error.code === 'auth/too-many-requests') {
      alert('Too many requests. Please wait a bit before trying again.')
    } else {
      alert('Failed to send verification email.')
    }
  }
}

const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/home')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}

const handleDeleteAccount = async () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    try {
      const user = auth.currentUser
      if (user) {
        // Delete Firestore document first so we don't lose permission to do so
        await deleteDoc(doc(db, 'users', user.uid))
        // Then delete Auth record
        await deleteUser(user)
        router.push('/home')
      }
    } catch (error) {
      // Firebase requires a recent login to delete an account for security
      if (error.code === 'auth/requires-recent-login') {
        alert(
          'Please log out and log back in to verify your identity before deleting your account.',
        )
      } else {
        console.error('Error deleting account:', error)
        alert('Failed to delete account.')
      }
    }
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

.status-verified {
  color: #15803d !important;
  font-weight: bold;
}

.status-unverified {
  color: #b91c1c !important;
  font-weight: bold;
}

.resend-button {
  margin-top: 0.5rem;
  padding: 0.4rem 0.8rem;
  background-color: var(--surface-color);
  color: var(--accent-color);
  border: 1px solid var(--accent-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
  align-self: flex-start;
}

.resend-button:hover {
  background-color: var(--accent-color);
  color: white;
}

.delete-account-button {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s;
  width: 100%;
}

.delete-account-button:hover {
  background-color: #ef4444;
  color: white;
}
</style>
