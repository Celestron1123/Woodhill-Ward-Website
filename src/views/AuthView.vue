<template>
    <div>
        <h2>Ward Sign Up</h2>

        <form @submit.prevent="handleSignUp">

            <div>
                <label for="username">Username: </label>
                <input type="text" id="username" v-model="username" required>
            </div>

            <br>

            <div>
                <label for="email">Email: </label>
                <input type="email" id="email" v-model="email" required>
            </div>

            <br>

            <div>
                <label for="password">Password: </label>
                <input type="password" id="password" v-model="password" required>
            </div>

            <br>

            <button type="submit">Create Account</button>

        </form>

        <hr>
        <p>Already have an account?</p>
        <button @click="goToLogin">Log In Here</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Importing both auth and our database
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');

const handleSignUp = async () => {
    try {
        // 1. Create the user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        await updateProfile(user, { displayName: username.value });

        // 2. Create the user document in the Firestore Database
        // We use the Auth UID as the Document ID to link them perfectly
        await setDoc(doc(db, 'users', user.uid), {
            username: username.value,
            email: user.email,
            role: 'viewer', // Everyone starts as a viewer per the design doc
            calling: '', // Placeholder for future use
            created: new Date()
        });
        console.log("Account created and added to database!");

        router.push('/feed'); // Navigate to the feed after successful sign-up
    } catch (error) {
        console.error("Error signing up:", error.message);
        alert(error.message);
    }
};

const goToLogin = () => {
    router.push('/login');
};
</script>