import { ref, computed } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

const currentUser = ref(null)
const userRole = ref(null)
const isLoading = ref(true)

let isInitialized = false

export function useUserRole() {
  if (!isInitialized) {
    isInitialized = true
    onAuthStateChanged(auth, async (user) => {
      isLoading.value = true
      if (user) {
        currentUser.value = user
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid))
          if (userDoc.exists()) {
            userRole.value = userDoc.data().role || 'viewer'
          } else {
            userRole.value = 'viewer'
          }
        } catch (error) {
          console.error('Error fetching user role:', error)
          userRole.value = 'viewer'
        }
      } else {
        currentUser.value = null
        userRole.value = null
      }
      isLoading.value = false
    })
  }

  const canCreatePost = computed(() => ['verified', 'mod', 'admin', 'dev'].includes(userRole.value))
  const canCreateEvent = computed(() => ['mod', 'admin', 'dev'].includes(userRole.value))
  const canCreateAnnouncement = computed(() => ['mod', 'admin', 'dev'].includes(userRole.value))
  const canManageUsers = computed(() => ['mod', 'admin', 'dev'].includes(userRole.value))

  return {
    currentUser,
    userRole,
    isLoading,
    canCreatePost,
    canCreateEvent,
    canCreateAnnouncement,
    canManageUsers,
  }
}
