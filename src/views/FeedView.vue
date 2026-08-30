<template>
  <div class="page-container feed-container">
    <header class="feed-header">
      <h2>Ward Feed</h2>
      <p class="subtitle">Welcome to the ward website! Share what's happening.</p>
    </header>

    <div v-if="canCreatePost" class="card create-post-card">
      <h3>Create a Post</h3>
      <form @submit.prevent="submitPost" class="post-form">
        <textarea
          v-model="newPostContent"
          placeholder="What's going on in the ward?"
          rows="4"
          required
          class="post-textarea"
        ></textarea>

        <div class="post-actions">
          <button type="button" @click="openCloudinaryWidget" class="btn-secondary">
            📷 Add Photos
          </button>
          <button type="submit" class="btn-primary">Post</button>
        </div>

        <div v-if="imageUrls.length > 0" class="image-preview-container">
          <div v-for="(url, index) in imageUrls" :key="index" class="image-preview">
            <img :src="url" alt="Preview" class="preview-img" />
            <button type="button" @click="removeImage(index)" class="remove-img-btn">
              &times;
            </button>
          </div>
        </div>
      </form>
    </div>

    <div class="search-section">
      <div class="search-bar">
        <input
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          placeholder="Search tags (e.g. #ReliefSociety)"
          class="search-input"
        />
        <button @click="handleSearch" class="btn-primary">Search</button>
        <button v-if="isSearching" @click="clearSearch" class="btn-secondary">Clear</button>
      </div>
    </div>

    <div class="posts-feed">
      <h3>Recent Posts</h3>
      <div v-if="posts.length === 0" class="empty-state">No posts yet. Be the first to share!</div>

      <div v-for="post in posts" :key="post.id" class="card post-card">
        <div class="post-header">
          <div class="post-header-left">
            <div class="avatar-placeholder">
              {{ post.authorName ? post.authorName.charAt(0).toUpperCase() : '?' }}
            </div>
            <div class="author-info">
              <strong>{{ post.authorName }}</strong>
              <small class="post-date">{{ formatDate(post.created) }}</small>
            </div>
          </div>
          <div class="post-header-right" v-if="canDeletePost(post)">
            <button class="options-btn" @click.stop="toggleMenu(post.id)">...</button>
            <div v-if="openMenuId === post.id" class="options-menu">
              <button @click="handleDeletePost(post.id)" class="delete-menu-item">
                Delete Post
              </button>
            </div>
          </div>
        </div>

        <p class="post-content">
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

        <div v-if="post.imageUrls && post.imageUrls.length > 0" class="post-images">
          <ImageCarousel :images="post.imageUrls" />
        </div>

        <div v-if="post.latestComment" class="latest-comment">
          <p>
            <strong>{{ post.latestComment.authorName }}</strong
            >: {{ post.latestComment.content }}
          </p>
        </div>

        <div class="post-footer">
          <button @click="goToPost(post.id)" class="btn-secondary">Comment / View Full Post</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
  deleteDoc,
} from 'firebase/firestore'
import ImageCarousel from '../components/ImageCarousel.vue'
import { useUserRole } from '../composables/useUserRole'

// Initialize router and reactive variables
const { canCreatePost, userRole } = useUserRole()
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
    let q

    if (isSearching.value && searchQuery.value.trim()) {
      // Clean query: remove '#', remove spaces, make lowercase
      const cleanedQuery = searchQuery.value
        .trim()
        .toLowerCase()
        .replace(/#/g, '')
        .replace(/\s+/g, '')
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

const openMenuId = ref(null)

const toggleMenu = (id) => {
  openMenuId.value = openMenuId.value === id ? null : id
}

const canDeletePost = (post) => {
  const role = userRole.value
  if (!role) return false
  if (['admin', 'dev'].includes(role)) return true
  if (auth.currentUser && post.authorId === auth.currentUser.uid) return true
  return false
}

const handleDeletePost = async (postId) => {
  if (confirm('Are you sure you want to delete this post? This cannot be undone.')) {
    try {
      // First delete all comments
      const commentsRef = collection(db, 'posts', postId, 'comments')
      const commentsSnap = await getDocs(commentsRef)
      const deletePromises = commentsSnap.docs.map((commentDoc) => deleteDoc(commentDoc.ref))
      await Promise.all(deletePromises)

      // Then delete the post
      await deleteDoc(doc(db, 'posts', postId))
      posts.value = posts.value.filter((p) => p.id !== postId)
      openMenuId.value = null
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post.')
    }
  }
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
}

.feed-header {
  text-align: center;
  margin-bottom: 2rem;
}

.feed-header h2 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.create-post-card {
  margin-bottom: 2rem;
}

.create-post-card h3 {
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.post-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  resize: vertical;
  font-family: inherit;
  font-size: 1rem;
}

.post-textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.post-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-secondary {
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--background-color);
  border-color: var(--text-secondary);
}

.image-preview-container {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.image-preview {
  position: relative;
  flex-shrink: 0;
}

.preview-img {
  height: 80px;
  width: 80px;
  object-fit: cover;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.remove-img-btn {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  cursor: pointer;
}

.remove-img-btn:hover {
  background-color: #dc2626;
}

.search-section {
  margin-bottom: 2rem;
}

.search-bar {
  display: flex;
  gap: 0.5rem;
}

.search-input {
  flex-grow: 1;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.posts-feed h3 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.post-card {
  margin-bottom: 2rem;
  border-left: 4px solid var(--accent-color);
  padding: 1.5rem 2rem;
  border-radius: var(--radius-lg);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.post-header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar-placeholder {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: var(--secondary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.3rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-info strong {
  font-size: 1.1rem;
  color: var(--primary-color);
}

.post-date {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.post-content {
  white-space: pre-wrap;
  margin-bottom: 1.5rem;
  font-size: 1.05rem;
}

.hashtag {
  color: var(--accent-color);
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.hashtag:hover {
  text-decoration: underline;
  color: var(--accent-hover);
}

.post-images {
  margin-bottom: 1rem;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.latest-comment {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--border-color);
  background-color: var(--background-color);
  padding: 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
}

.latest-comment p {
  margin: 0;
}

.post-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

.empty-state {
  text-align: center;
  color: var(--text-secondary);
  padding: 3rem;
  background: var(--surface-color);
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-color);
}

.post-header-right {
  position: relative;
}
.options-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 0.5rem;
  color: #7f8c8d;
  line-height: 1;
}
.options-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
.delete-menu-item {
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  color: #e74c3c;
  cursor: pointer;
  white-space: nowrap;
  width: 100%;
  text-align: left;
}
.delete-menu-item:hover {
  background: #fdf2f0;
}
</style>
