<template>
    <div>
        <h2>Ward Feed</h2>
        <p>Welcome to the ward website!</p>

        <hr>

        <div>
            <h3>Create a Post</h3>
            <form @submit.prevent="submitPost">
                <textarea v-model="newPostContent" placeholder="What's going on in the ward?" rows="4" cols="50"
                    required></textarea>
                <br>
                <button type="submit">Post</button>
            </form>
        </div>

        <hr>

        <div>
            <h3>Recent Posts</h3>
            <div v-if="posts.length === 0">No posts yet. Be the first to share!</div>

            <div v-for="post in posts" :key="post.id"
                style="border: 1px solid black; margin-bottom: 10px; padding: 10px;">
                <p>
                    <strong>{{ post.authorName }}</strong>
                    <small> - {{ formatDate(post.created) }}</small>
                </p>
                <p>{{ post.textContent }}</p>
            </div>
        </div>

        <hr>

        <button @click="handleSignOut">Log Out</button>
    </div>
</template>

<script setup>
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, getDoc } from 'firebase/firestore';

// Initialize router and reactive variables
const router = useRouter();
const posts = ref([]);
const newPostContent = ref('');

// Fetch posts from the Firestore 'posts' collection
const fetchPosts = async () => {
    try {
        const postsRef = collection(db, 'posts');
        // Order posts by the 'created' timestamp, newest first
        const q = query(postsRef, orderBy('created', 'desc'));
        const querySnapshot = await getDocs(q);

        posts.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
};

// Handle submitting a new post
const submitPost = async () => {
    if (!newPostContent.value.trim()) return;

    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to post.");
        return;
    }

    /* NOTE ON PERMISSIONS: 
       The design doc dictates only "Verified" members can create posts.
       In the future, we will fetch the current user's profile from the 'users' 
       collection to check if user.role === 'verified' before allowing this block to run.
    */

    try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        let authorName = userDocSnap.data().username;

        // Construct the post object matching the Design Document schema
        const postData = {
            authorId: user.uid,
            authorName: authorName,
            textContent: newPostContent.value,
            imageUrls: [], // Empty for now, ready for Firebase Storage integration later
            tags: [],      // Empty for now, ready for the tagging feature
            created: serverTimestamp() // Let Firebase handle the exact server time
        };

        // Add to Firestore
        await addDoc(collection(db, 'posts'), postData);

        // Clear the form and re-fetch posts to show the new one
        newPostContent.value = '';
        fetchPosts();
    } catch (error) {
        console.error("Error creating post:", error);
        alert("Failed to create post.");
    }
};

// Utility to format Firestore timestamps into readable text
const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    return timestamp.toDate().toLocaleString();
};

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

// Load posts immediately when the user visits the page
onMounted(() => {
    fetchPosts();
});
</script>