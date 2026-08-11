<template>
    <div>
        <h2>Ward Feed</h2>
        <p>Welcome to the ward website!</p>

        <hr>

        <div v-if="canCreatePost">
            <h3>Create a Post</h3>
            <form @submit.prevent="submitPost">
                <textarea v-model="newPostContent" placeholder="What's going on in the ward?" rows="4" cols="50"
                    required></textarea>
                <br>
                <button type="button" @click="openCloudinaryWidget" style="margin-right: 10px;">
                    📷 Add Photos
                </button>
                <button type="submit">Post</button>

                <div v-if="imageUrls.length > 0" style="margin-top: 15px; display: flex; gap: 10px; overflow-x: auto;">
                    <div v-for="(url, index) in imageUrls" :key="index" style="position: relative;">
                        <img :src="url" alt="Preview"
                            style="height: 80px; width: 80px; object-fit: cover; border-radius: 8px;">
                        <button type="button" @click="removeImage(index)"
                            style="position: absolute; top: -5px; right: -5px; background: red; color: white; border: none; border-radius: 50%; cursor: pointer;">
                            X
                        </button>
                    </div>
                </div>
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

                <ImageCarousel :images="post.imageUrls" />

                <div v-if="post.latestComment"
                    style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed gray;">
                    <p style="margin: 0;">
                        <small><strong>{{ post.latestComment.authorName }}</strong>: {{ post.latestComment.content
                            }}</small>
                    </p>
                </div>

                <button @click="goToPost(post.id)" style="margin-top: 10px;">Comment</button>
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
import ImageCarousel from '../components/ImageCarousel.vue';
import { useUserRole } from '../composables/useUserRole';

// Initialize router and reactive variables
const { canCreatePost } = useUserRole();
const router = useRouter();
const posts = ref([]);
const newPostContent = ref('');
const imageUrls = ref([]); // Store image URLs ready to be posted
let cloudinaryWidget;      // Store the widget instance

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
    if (!newPostContent.value.trim()) return; // Prevent empty posts

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
            imageUrls: imageUrls.value,
            tags: [],      // Empty for now, ready for the tagging feature
            created: serverTimestamp(), // Let Firebase handle the exact server time
            latestComment: null // Initialize with no comment
        };

        // Add to Firestore
        await addDoc(collection(db, 'posts'), postData);

        // Clear the form and re-fetch posts to show the new one
        newPostContent.value = '';
        imageUrls.value = [];
        fetchPosts();
    } catch (error) {
        console.error("Error creating post:", error);
        alert("Failed to create post.");
    }
};

// Initialize the Cloudinary Upload Widget
const openCloudinaryWidget = () => {
    if (cloudinaryWidget) {
        cloudinaryWidget.open();
    } else {
        alert("Image upload service is still loading, please try again in a second.");
    }
};

// Setup Cloudinary widget on component mount
const removeImage = (index) => {
    imageUrls.value.splice(index, 1);
};

// Push router to Post Detail view
const goToPost = (postId) => {
    router.push(`/post/${postId}`);
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

    // Initialize the Cloudinary Widget once the component mounts
    if (window.cloudinary) {
        cloudinaryWidget = window.cloudinary.createUploadWidget({
            cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
            uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
            sources: ['local', 'camera', 'url'], // Allows files from phone, camera, or links
            multiple: true,
            maxFiles: 5, // Limit to prevent spam
            clientAllowedFormats: ['image'], // Prevent video/document uploads
            cropping: true,
            showSkipCropButton: true,
        }, (error, result) => {
            if (!error && result && result.event === "success") {
                // When an image successfully uploads, push its secure URL to our array
                imageUrls.value.push(result.info.secure_url);
            }
        });
    }
});
</script>