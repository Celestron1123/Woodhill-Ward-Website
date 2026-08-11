<template>
    <div class="user-management-container">
        <h2>User Management</h2>
        
        <div v-if="isLoading">
            <p>Loading users...</p>
        </div>
        <div v-else-if="users.length === 0">
            <p>No users to manage.</p>
        </div>
        <div v-else>
            <table class="users-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Current Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{ user.username }}</td>
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
                            >
                                <option v-for="role in getAvailableRoles(user)" :key="role" :value="role">
                                    {{ role }}
                                </option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { useUserRole } from '../composables/useUserRole';

const { userRole, isLoading: authLoading } = useUserRole();

const users = ref([]);
const isLoading = ref(true);

const tooltips = {
    viewer: "The default role. Can view content but cannot post or comment.",
    verified: "Regular ward member. Can create posts and comments.",
    mod: "Ward leader. Can create events/announcements and promote Viewers to Verified.",
    admin: "Bishopric/Stake. Can promote or demote any user to any role (except Dev).",
    dev: "Developer. Exclusive permissions, can only be managed by other Devs."
};

const getTooltip = (role) => {
    return tooltips[role] || '';
};

const fetchUsers = async () => {
    isLoading.value = true;
    try {
        let q;
        if (userRole.value === 'dev' || userRole.value === 'admin') {
            q = collection(db, 'users');
        } else if (userRole.value === 'mod') {
            q = query(collection(db, 'users'), where('role', 'in', ['viewer', 'verified']));
        } else {
            // viewer, verified or unauthenticated - will fail anyway, we can just do a dummy query or empty array
            users.value = [];
            isLoading.value = false;
            return;
        }

        const querySnapshot = await getDocs(q);
        users.value = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                selectedRole: data.role // For the select dropdown
            };
        });
    } catch (error) {
        // Silently catch error and show empty list
        console.error("Fetch users error:", error);
        users.value = [];
    }
    isLoading.value = false;
};

// Re-fetch users if auth role resolves after component mount
watch(authLoading, (newVal) => {
    if (!newVal) {
        fetchUsers();
    }
});

onMounted(() => {
    if (!authLoading.value) {
        fetchUsers();
    }
});

const canModify = (targetUser) => {
    const currentUserRole = userRole.value;
    const targetRole = targetUser.role;

    if (currentUserRole === 'dev') return true;
    
    if (currentUserRole === 'admin') {
        return targetRole !== 'dev';
    }

    if (currentUserRole === 'mod') {
        return targetRole === 'viewer' || targetRole === 'verified';
    }

    return false;
};

const getAvailableRoles = (targetUser) => {
    const currentUserRole = userRole.value;
    
    if (currentUserRole === 'dev') {
        return ['viewer', 'verified', 'mod', 'admin', 'dev'];
    }
    
    if (currentUserRole === 'admin') {
        // Admins cannot make someone a dev, or modify an existing dev. 
        // We handle not modifying an existing dev in canModify.
        return ['viewer', 'verified', 'mod', 'admin'];
    }

    if (currentUserRole === 'mod') {
        return ['viewer', 'verified'];
    }
    
    return [];
};

const updateRole = async (user, newRole) => {
    const originalRole = user.role;
    try {
        const userRef = doc(db, 'users', user.id);
        await updateDoc(userRef, { role: newRole });
        user.role = newRole; // Update local state
    } catch (error) {
        console.error("Error updating role:", error);
        alert("Failed to update user role.");
        user.selectedRole = originalRole; // Revert select
    }
};
</script>

<style scoped>
.user-management-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
    font-family: sans-serif;
}

.users-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}

.users-table th, .users-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
}

.users-table th {
    background-color: #f2f2f2;
}

.role-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-weight: bold;
    text-transform: capitalize;
    cursor: help;
}

/* Pastel rainbow colors (cool for low, hot for high) */
.role-badge.viewer {
    background-color: #b3cde0; /* Light blue */
    color: #011f4b;
}

.role-badge.verified {
    background-color: #c5e1a5; /* Light green */
    color: #33691e;
}

.role-badge.mod {
    background-color: #fff59d; /* Light yellow */
    color: #f57f17;
}

.role-badge.admin {
    background-color: #ffcc80; /* Light orange */
    color: #e65100;
}

.role-badge.dev {
    background-color: #ef9a9a; /* Light red */
    color: #b71c1c;
}

select {
    padding: 6px;
    border-radius: 4px;
    border: 1px solid #ccc;
}
</style>
