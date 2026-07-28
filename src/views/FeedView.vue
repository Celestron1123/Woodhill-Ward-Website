<template>
    <div>
        <h2>Ward Feed</h2>
        <p>Welcome to the ward website!</p>

        <hr>

        <button @click="handleSignOut">Log Out</button>
    </div>
</template>

<script setup>
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'vue-router';

// Initialize the Vue Router so we can navigate between pages
const router = useRouter();

const handleSignOut = async () => {
    try {
        // Tells Firebase to destroy the user's current session
        await signOut(auth);
        alert("Successfully logged out!");

        // Send them back to the Login screen
        router.push('/login');
    } catch (error) {
        console.error("Error logging out:", error.message);
    }
};
</script>