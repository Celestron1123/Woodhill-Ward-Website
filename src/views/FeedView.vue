<template>
  <div>
    <h2>Ward Feed</h2>
    <p>Welcome to the ward website!</p>

    <hr />

    <div v-if="canCreatePost">
      <h3>Create a Post</h3>
      <form @submit.prevent="submitPost">
        <textarea
          v-model="newPostContent"
          placeholder="What's going on in the ward?"
          rows="4"
          cols="50"
          required
        ></textarea>
        <br />
        <button type="button" @click="openCloudinaryWidget" style="margin-right: 10px">
          📷 Add Photos
        </button>
        <button type="submit">Post</button>

        <div
          v-if="imageUrls.length > 0"
          style="margin-top: 15px; display: flex; gap: 10px; overflow-x: auto"
        >
          <div v-for="(url, index) in imageUrls" :key="index" style="position: relative">
            <img
              :src="url"
              alt="Preview"
              style="height: 80px; width: 80px; object-fit: cover; border-radius: 8px"
            />
            <button
              type="button"
              @click="removeImage(index)"
              style="
                position: absolute;
                top: -5px;
                right: -5px;
                background: red;
                color: white;
                border: none;
                border-radius: 50%;
                cursor: pointer;
              "
            >
              X
            </button>
          </div>
        </div>
      </form>
    </div>

    <hr />

    <div style="margin-bottom: 20px;">
      <h3>Search Posts by Hashtag</h3>
      <input 
        v-model="searchQuery" 
        @keyup.enter="handleSearch" 
        placeholder="Search tags (e.g. #ReliefSociety)" 
        style="padding: 5px; margin-right: 10px;"
      />
      <button @click="handleSearch" style="margin-right: 5px;">Search</button>
      <button v-if="isSearching" @click="clearSearch">Clear</button>
    </div>

    <div>
      <h3>Recent Posts</h3>
      <div v-if="posts.length === 0">No posts yet. Be the first to share!</div>

      <div
        v-for="post in posts"
        :key="post.id"
        style="border: 1px solid black; margin-bottom: 10px; padding: 10px"
      >
        <p>
          <strong>{{ post.authorName }}</strong>
          <small> - {{ formatDate(post.created) }}</small>
        </p>
        <p style="white-space: pre-wrap; margin: 10px 0;">
          <template v-for="(token, index) in parseTextContent(post.textContent)" :key="index">
            <span 
              v-if="token.type === 'hashtag'" 
              class="hashtag" 
              @click="triggerSearch(token.content)"
            >
              {{ token.content }}
            </span>
            <span v-else>{{ token.content }}</span>
          </template>
        </p>

        <ImageCarousel :images="post.imageUrls" />

        <div
          v-if="post.latestComment"
          style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed gray"
        >
          <p style="margin: 0">
            <small
              ><strong>{{ post.latestComment.authorName }}</strong
              >: {{ post.latestComment.content }}</small
            >
          </p>
        </div>

        <button @click="goToPost(post.id)" style="margin-top: 10px">Comment</button>
      </div>
    </div>

    <hr />

    <button @click="handleSignOut">Log Out</button>
  </div>
</template>

<script setup>
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
  where,
} from 'firebase/firestore'
import ImageCarousel from '../components/ImageCarousel.vue'
import { useUserRole } from '../composables/useUserRole'

// Initialize router and reactive variables
const { canCreatePost } = useUserRole()
const router = useRouter()
const posts = ref([])
const newPostContent = ref('')
const imageUrls = ref([]) // Store image URLs ready to be posted
const searchQuery = ref('')
const isSearching = ref(false)
let cloudinaryWidget // Store the widget instance

// Fetch posts from the Firestore 'posts' collection
const fetchPosts = async () => {
  try {
    const postsRef = collection(db, 'posts')
    let q;
    
    if (isSearching.value && searchQuery.value.trim()) {
      // Clean query: remove '#', remove spaces, make lowercase
      const cleanedQuery = searchQuery.value.trim().toLowerCase().replace(/#/g, '').replace(/\s+/g, '')
      // Removed orderBy to avoid requiring a Firebase Composite Index for tags + created
      q = query(postsRef, where('tags', 'array-contains', cleanedQuery))
    } else {
      q = query(postsRef, orderBy('created', 'desc'))
    }
    
    const querySnapshot = await getDocs(q)
    let fetchedPosts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // If we are searching, we sort manually on the client side so we don't need a composite index in the DB
    if (isSearching.value && searchQuery.value.trim()) {
      fetchedPosts.sort((a, b) => {
        const timeA = a.created ? a.created.toMillis() : 0
        const timeB = b.created ? b.created.toMillis() : 0
        return timeB - timeA
      })
    }

    posts.value = fetchedPosts
  } catch (error) {
    console.error('Error fetching posts:', error)
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    isSearching.value = true
    fetchPosts()
  } else {
    clearSearch()
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  isSearching.value = false
  fetchPosts()
}

const triggerSearch = (hashtag) => {
  searchQuery.value = hashtag
  handleSearch()
}

// Utility to parse post text into an array of text and hashtag tokens
// This allows us to render hashtags as clickable links safely without v-html
const parseTextContent = (text) => {
  if (!text) return []
  // Split the text around hashtags, keeping the hashtags in the array
  const parts = text.split(/(#\w+)/g)
  return parts.map((part) => {
    if (part.match(/^#\w+$/)) {
      return { type: 'hashtag', content: part }
    }
    return { type: 'text', content: part }
  })
}

// Handle submitting a new post
const submitPost = async () => {
  if (!newPostContent.value.trim()) return // Prevent empty posts

  const user = auth.currentUser
  if (!user) {
    alert('You must be logged in to post.')
    return
  }

  /* NOTE ON PERMISSIONS: 
       The design doc dictates only "Verified" members can create posts.
       In the future, we will fetch the current user's profile from the 'users' 
       collection to check if user.role === 'verified' before allowing this block to run.
    */

  try {
    const userDocRef = doc(db, 'users', user.uid)
    const userDocSnap = await getDoc(userDocRef)
    let authorName = userDocSnap.data().username

    // Extract inline hashtags
    const text = newPostContent.value
    const tags = []
    const tagMatches = text.match(/#\w+/g)
    if (tagMatches) {
      tagMatches.forEach((match) => {
        const tag = match.slice(1).toLowerCase()
        if (!tags.includes(tag)) {
          tags.push(tag)
        }
      })
    }

    // Construct the post object matching the Design Document schema
    const postData = {
      authorId: user.uid,
      authorName: authorName,
      textContent: newPostContent.value,
      imageUrls: imageUrls.value,
      tags: tags,
      created: serverTimestamp(), // Let Firebase handle the exact server time
      latestComment: null, // Initialize with no comment
    }

    // Add to Firestore
    await addDoc(collection(db, 'posts'), postData)

    // Clear the form and re-fetch posts to show the new one
    newPostContent.value = ''
    imageUrls.value = []
    fetchPosts()
  } catch (error) {
    console.error('Error creating post:', error)
    alert('Failed to create post.')
  }
}

// Initialize the Cloudinary Upload Widget
const openCloudinaryWidget = () => {
  if (cloudinaryWidget) {
    cloudinaryWidget.open()
  } else {
    alert('Image upload service is still loading, please try again in a second.')
  }
}

// Setup Cloudinary widget on component mount
const removeImage = (index) => {
  imageUrls.value.splice(index, 1)
}

// Push router to Post Detail view
const goToPost = (postId) => {
  router.push(`/post/${postId}`)
}

// Utility to format Firestore timestamps into readable text
const formatDate = (timestamp) => {
  if (!timestamp) return 'Just now'
  return timestamp.toDate().toLocaleString()
}

const handleSignOut = async () => {
  try {
    // Tells Firebase to destroy the user's current session
    await signOut(auth)
    alert('Successfully logged out!')

    // Send them back to the Login screen
    router.push('/login')
  } catch (error) {
    console.error('Error logging out:', error.message)
  }
}

// Load posts immediately when the user visits the page
onMounted(() => {
  fetchPosts()

  // Initialize the Cloudinary Widget once the component mounts
  if (window.cloudinary) {
    cloudinaryWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'camera', 'url'], // Allows files from phone, camera, or links
        multiple: true,
        maxFiles: 5, // Limit to prevent spam
        clientAllowedFormats: ['image'], // Prevent video/document uploads
        cropping: true,
        showSkipCropButton: true,
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          // When an image successfully uploads, push its secure URL to our array
          imageUrls.value.push(result.info.secure_url)
        }
      },
    )
  }
})
</script>

<style scoped>
.hashtag {
  color: #1da1f2; /* Nice bright blue */
  font-weight: bold;
  cursor: pointer;
  transition: color 0.2s;
}

.hashtag:hover {
  text-decoration: underline;
  color: #0c85d0;
}
</style>
