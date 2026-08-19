<template>
  <div class="feed-container">
    <header class="feed-header card-aero">
      <h2>Ward Feed</h2>
      <p>Welcome to the ward website! Share and explore memories.</p>
    </header>

    <div v-if="canCreatePost" class="create-post-section card-aero">
      <h3>Create a Post</h3>
      <form @submit.prevent="submitPost" class="post-form">
        <textarea
          v-model="newPostContent"
          placeholder="What's going on in the ward?"
          rows="4"
          required
        ></textarea>
        
        <div class="form-actions">
          <button type="button" class="button-aero" @click="openCloudinaryWidget">
            <span class="icon">🫧</span> Add Photos
          </button>
          <button type="submit" class="button-aero primary">Post to Feed</button>
        </div>

        <div v-if="imageUrls.length > 0" class="image-preview-container">
          <div v-for="(url, index) in imageUrls" :key="index" class="image-preview-wrapper">
            <img :src="url" alt="Preview" class="preview-img" />
            <button type="button" @click="removeImage(index)" class="remove-btn">✖</button>
          </div>
        </div>
      </form>
    </div>

    <div class="search-section card-aero">
      <h3>Search Posts</h3>
      <div class="search-bar">
        <input 
          v-model="searchQuery" 
          @keyup.enter="handleSearch" 
          placeholder="Search tags (e.g. #ReliefSociety)" 
        />
        <button class="button-aero" @click="handleSearch">Search</button>
        <button class="button-aero clear-btn" v-if="isSearching" @click="clearSearch">Clear</button>
      </div>
    </div>

    <div class="posts-list">
      <h3 class="section-title">Recent Posts</h3>
      <div v-if="posts.length === 0" class="empty-state">No posts yet. Be the first to share!</div>

      <div v-for="post in posts" :key="post.id" class="post-card card-aero">
        <div class="post-header">
          <div class="author-avatar"></div>
          <div class="author-info">
            <strong>{{ post.authorName }}</strong>
            <small>{{ formatDate(post.created) }}</small>
          </div>
        </div>
        
        <p class="post-content">
          <template v-for="(token, index) in parseTextContent(post.textContent)" :key="index">
            <span 
              v-if="token.type === 'hashtag'" 
              class="hashtag aero-tag" 
              @click="triggerSearch(token.content)"
            >
              {{ token.content }}
            </span>
            <span v-else>{{ token.content }}</span>
          </template>
        </p>

        <div class="post-media" v-if="post.imageUrls && post.imageUrls.length">
          <ImageCarousel :images="post.imageUrls" />
        </div>

        <div v-if="post.latestComment" class="latest-comment">
          <p>
            <strong>{{ post.latestComment.authorName }}</strong>: 
            {{ post.latestComment.content }}
          </p>
        </div>

        <div class="post-actions">
          <button class="button-aero action-btn" @click="goToPost(post.id)">🗨 Comment</button>
        </div>
      </div>
    </div>

    <div class="logout-section">
      <button class="button-aero logout-btn" @click="handleSignOut">Log Out</button>
    </div>
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
.feed-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.feed-header {
  text-align: center;
  margin-bottom: 2rem;
}

.feed-header h2 {
  font-size: 2.2rem;
  color: #0056b3;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
}

.feed-header p {
  color: #446b85;
  margin: 0;
}

.create-post-section h3, .search-section h3 {
  margin-top: 0;
  color: #0056b3;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
}

.post-form textarea {
  width: 100%;
  box-sizing: border-box;
  resize: vertical;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.icon {
  font-size: 1.2rem;
}

.image-preview-container {
  margin-top: 15px;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.image-preview-wrapper {
  position: relative;
  flex-shrink: 0;
}

.preview-img {
  height: 80px;
  width: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.remove-btn {
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(180deg, #ff9999 0%, #ff4d4d 100%);
  color: white;
  border: 1px solid #cc0000;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.search-bar {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-bar input {
  flex-grow: 1;
}

.clear-btn {
  background: linear-gradient(180deg, #f0f0f0 0%, #dcdcdc 100%) !important;
  color: #333 !important;
  border-color: #aaa !important;
}

.section-title {
  color: #0b3d59;
  border-bottom: 2px solid rgba(255,255,255,0.6);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 1px 1px rgba(255,255,255,0.8);
}

.empty-state {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 2rem;
  background: rgba(255,255,255,0.4);
  border-radius: 12px;
}

.post-card {
  margin-bottom: 1.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15), inset 0 2px 5px rgba(255, 255, 255, 1);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.author-avatar {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #a2e2f8, #6fc1e5);
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  /* A subtle placeholder inner shadow for depth */
  box-shadow: inset 0 2px 4px rgba(255,255,255,0.8), 0 2px 5px rgba(0,0,0,0.1);
}

.author-info strong {
  display: block;
  font-size: 1.1rem;
  color: #0b3d59;
}

.author-info small {
  color: #666;
}

.post-content {
  white-space: pre-wrap;
  margin: 1rem 0;
  line-height: 1.5;
  color: #222;
}

.aero-tag {
  background: rgba(255, 255, 255, 0.6);
  padding: 2px 6px;
  border-radius: 12px;
  border: 1px solid rgba(111, 193, 229, 0.5);
  text-shadow: 0 1px 0px rgba(255,255,255,1);
  color: #007bff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.aero-tag:hover {
  background: #fff;
  border-color: #6fc1e5;
  box-shadow: 0 0 5px rgba(111, 193, 229, 0.6);
}

.post-media {
  margin: 1rem 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.latest-comment {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255,255,255,0.5);
  border-radius: 12px;
  border-left: 4px solid #6fc1e5;
}

.latest-comment p {
  margin: 0;
  font-size: 0.95rem;
}

.post-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

.logout-section {
  text-align: center;
  margin-top: 3rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255,255,255,0.6);
}
</style>
