<template>
  <div class="page-container user-management-container">
    <h2 class="header-title">User Management</h2>

    <div v-if="isLoading" class="empty-state">
      <p>Loading users...</p>
    </div>
    <div v-else-if="users.length === 0" class="empty-state">
      <p>No users to manage.</p>
    </div>
    <div v-else class="table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Current Role</th>
            <th>Change Role</th>
            <th>Manage</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>
              <strong>{{ user.username }}</strong>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <span :class="['role-badge', user.role]" :title="getTooltip(user.role)">
                {{ user.role }}
              </span>
            </td>
            <td>
              <select
                v-model="user.selectedRole"
                @change="updateRole(user, user.selectedRole)"
                :disabled="!canModify(user)"
                class="role-select"
              >
                <option v-for="role in getAvailableRoles(user)" :key="role" :value="role">
                  {{ role }}
                </option>
              </select>
            </td>
            <td>
              <button 
                v-if="canDelete(user)" 
                @click="deleteUserRecord(user)" 
                class="delete-user-button">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { db } from '../firebase'
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore'
import { useUserRole } from '../composables/useUserRole'

const { userRole, isLoading: authLoading } = useUserRole()

const users = ref([])
const isLoading = ref(true)

const tooltips = {
  viewer: 'The default role. Can view content but cannot post or comment.',
  verified: 'Regular ward member. Can create posts and comments.',
  mod: 'Ward leader. Can create events/announcements and promote Viewers to Verified.',
  admin: 'Bishopric/Stake. Can promote or demote any user to any role (except Dev).',
  dev: 'Developer. Exclusive permissions, can only be managed by other Devs.',
}

const getTooltip = (role) => {
  return tooltips[role] || ''
}

const fetchUsers = async () => {
  isLoading.value = true
  try {
    let q
    if (userRole.value === 'dev' || userRole.value === 'admin') {
      q = collection(db, 'users')
    } else if (userRole.value === 'mod') {
      q = query(collection(db, 'users'), where('role', 'in', ['viewer', 'verified']))
    } else {
      // viewer, verified or unauthenticated - will fail anyway, we can just do a dummy query or empty array
      users.value = []
      isLoading.value = false
      return
    }

    const querySnapshot = await getDocs(q)
    users.value = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        selectedRole: data.role, // For the select dropdown
      }
    })
  } catch (error) {
    // Silently catch error and show empty list
    console.error('Fetch users error:', error)
    users.value = []
  }
  isLoading.value = false
}

// Re-fetch users if auth role resolves after component mount
watch(authLoading, (newVal) => {
  if (!newVal) {
    fetchUsers()
  }
})

onMounted(() => {
  if (!authLoading.value) {
    fetchUsers()
  }
})

const canModify = (targetUser) => {
  const currentUserRole = userRole.value
  const targetRole = targetUser.role

  if (currentUserRole === 'dev') return true

  if (currentUserRole === 'admin') {
    return targetRole !== 'dev'
  }

  if (currentUserRole === 'mod') {
    return targetRole === 'viewer' || targetRole === 'verified'
  }

  return false
}

const getAvailableRoles = () => {
  const currentUserRole = userRole.value

  if (currentUserRole === 'dev') {
    return ['viewer', 'verified', 'mod', 'admin', 'dev']
  }

  if (currentUserRole === 'admin') {
    // Admins cannot make someone a dev, or modify an existing dev.
    // We handle not modifying an existing dev in canModify.
    return ['viewer', 'verified', 'mod', 'admin']
  }

  if (currentUserRole === 'mod') {
    return ['viewer', 'verified']
  }

  return []
}

const updateRole = async (user, newRole) => {
  const originalRole = user.role
  try {
    const userRef = doc(db, 'users', user.id)
    await updateDoc(userRef, { role: newRole })
    user.role = newRole // Update local state
  } catch (error) {
    console.error('Error updating role:', error)
    alert('Failed to update user role.')
    user.selectedRole = originalRole // Revert select
  }
}

const canDelete = (targetUser) => {
  const currentUserRole = userRole.value
  const targetRole = targetUser.role

  if (currentUserRole === 'dev') return true
  if (currentUserRole === 'admin') return targetRole !== 'dev'
  return false
}

const deleteUserRecord = async (userToDelete) => {
  if (confirm(`Are you sure you want to completely delete ${userToDelete.username}?`)) {
    try {
      await deleteDoc(doc(db, 'users', userToDelete.id))
      users.value = users.value.filter(u => u.id !== userToDelete.id)
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user.')
    }
  }
}
</script>

<style scoped>
.user-management-container {
  max-width: 900px;
  margin: 0 auto;
}

.header-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--primary-color);
  text-align: center;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background-color: var(--surface-color);
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-color);
  color: var(--text-secondary);
}

.table-container {
  overflow-x: auto;
  background-color: var(--surface-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  border-bottom: 1px solid var(--border-color);
  padding: 1rem;
  text-align: left;
}

.users-table th {
  background-color: var(--background-color);
  font-weight: 600;
  color: var(--text-primary);
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.users-table tr:last-child td {
  border-bottom: none;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 600;
  text-transform: capitalize;
  font-size: 0.85rem;
  cursor: help;
  display: inline-block;
}

/* Pastel rainbow colors (cool for low, hot for high) */
.role-badge.viewer {
  background-color: #e0f2fe;
  color: #0369a1;
}

.role-badge.verified {
  background-color: #dcfce7;
  color: #15803d;
}

.role-badge.mod {
  background-color: #fef9c3;
  color: #a16207;
}

.role-badge.admin {
  background-color: #ffedd5;
  color: #c2410c;
}

.role-badge.dev {
  background-color: #fee2e2;
  color: #b91c1c;
}

.role-select {
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background-color: var(--surface-color);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
}

.role-select:focus {
  outline: none;
  border-color: var(--accent-color);
}

.role-select:disabled {
  background-color: var(--background-color);
  cursor: not-allowed;
  opacity: 0.7;
}

.delete-user-button {
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
}

.delete-user-button:hover {
  background-color: #ef4444;
  color: white;
}
</style>
