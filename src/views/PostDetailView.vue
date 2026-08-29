<template>
  <div class="page-container post-detail-container">
    <button @click="goBack" class="btn-secondary back-btn">&larr; Back to Feed</button>

    <div v-if="loading" class="loading-state">Loading post...</div>

    <div v-else-if="post">
      <!-- Original Post -->
      <div class="card post-card">
        <div class="post-header">
          <div class="post-header-left">
            <strong>{{ post.authorName }}</strong>
            <small class="post-date">{{ formatDate(post.created) }}</small>
          </div>
          <div class="post-header-right" v-if="canDeletePost(post)">
            <button class="options-btn" @click.stop="toggleMenu(post.id)">...</button>
            <div v-if="openMenuId === post.id" class="options-menu">
              <button @click="handleDeletePost(post.id)" class="delete-menu-item">Delete Post</button>
            </div>
          </div>
        </div>
        <p class="post-content">{{ post.textContent }}</p>

        <div v-if="post.imageUrls && post.imageUrls.length > 0" class="post-images">
          <ImageCarousel :images="post.imageUrls" />
        </div>
      </div>

      <!-- Add Comment Section -->
      <div v-if="canCreatePost" class="card comment-form-card">
        <h3>Add a Comment</h3>
        <form @submit.prevent="submitComment" class="comment-form">
          <textarea
            v-model="newCommentContent"
            placeholder="Write a comment..."
            rows="3"
            required
            class="comment-textarea"
          ></textarea>
          <div class="comment-actions">
            <button type="submit" class="btn-primary">Post Comment</button>
          </div>
        </form>
      </div>

      <!-- Comments List -->
      <div class="comments-section">
        <h3>Comments</h3>
        <div v-if="comments.length === 0" class="empty-state">No comments yet. Be the first!</div>

        <div v-for="comment in comments" :key="comment.id" class="card comment-card">
          <div class="comment-header">
            <strong>{{ comment.authorName }}</strong>
            <small class="comment-date">{{ formatDate(comment.created) }}</small>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
        </div>
      </div>
    </div>

    <div v-else class="error-state">
      <p>Error: Post could not be found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import {
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import ImageCarousel from '../components/ImageCarousel.vue'
import { useUserRole } from '../composables/useUserRole'

// Router handles navigation, Route gives us access to URL params
const { canCreatePost, userRole } = useUserRole()
const route = useRoute()
const router = useRouter()

// The specific post ID from the URL (e.g. /post/abc123xyz)
const postId = route.params.id

// Reactive state
const post = ref(null)
const comments = ref([])
const newCommentContent = ref('')
const loading = ref(true)

// Fetch Post and its Comments Sub-collection
const fetchPostAndComments = async () => {
  try {
    // 1. Get the original post
    const postRef = doc(db, 'posts', postId)
    const postSnap = await getDoc(postRef)

    if (postSnap.exists()) {
      post.value = { id: postSnap.id, ...postSnap.data() }
    } else {
      console.error('No such post!')
      loading.value = false
      return
    }

    // 2. Get the comments (Reverse Chronological Order)
    const commentsRef = collection(db, 'posts', postId, 'comments')
    const q = query(commentsRef, orderBy('created', 'desc'))
    const querySnapshot = await getDocs(q)

    comments.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    loading.value = false
  } catch (error) {
    console.error('Error fetching data:', error)
    loading.value = false
  }
}

// Handle submitting a new comment
const submitComment = async () => {
  if (!newCommentContent.value.trim()) return

  const user = auth.currentUser
  if (!user) {
    alert('You must be logged in to comment.')
    return
  }

  /* NOTE: Roles and security checks are bypassed for now */

  try {
    // Get author name from the users collection
    const userDocRef = doc(db, 'users', user.uid)
    const userDocSnap = await getDoc(userDocRef)
    let authorName = userDocSnap.data().username

    // Construct the comment object
    const commentData = {
      authorId: user.uid,
      authorName: authorName,
      content: newCommentContent.value,
      created: serverTimestamp(),
    }

    // 1. Save the new comment to the sub-collection
    await addDoc(collection(db, 'posts', postId, 'comments'), commentData)

    // 2. Update the parent post with the latestComment preview for the FeedView
    const postRef = doc(db, 'posts', postId)
    await updateDoc(postRef, {
      latestComment: {
        authorName: authorName,
        content: newCommentContent.value,
      },
    })

    // Clear input and immediately refresh to show the new comment at the top
    newCommentContent.value = ''
    fetchPostAndComments()
  } catch (error) {
    console.error('Error posting comment:', error)
    alert('Failed to post comment.')
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'Just now'
  return timestamp.toDate().toLocaleString()
}

const goBack = () => {
  router.push('/feed')
}

const openMenuId = ref(null)

const toggleMenu = (id) => {
  openMenuId.value = openMenuId.value === id ? null : id
}

const canDeletePost = (postToCheck) => {
  const role = userRole.value
  if (!role) return false
  if (['admin', 'dev'].includes(role)) return true
  if (auth.currentUser && postToCheck.authorId === auth.currentUser.uid) return true
  return false
}

const handleDeletePost = async (id) => {
  if (confirm("Are you sure you want to delete this post? This cannot be undone.")) {
    try {
      const commentsRef = collection(db, 'posts', id, 'comments')
      const commentsSnap = await getDocs(commentsRef)
      const deletePromises = commentsSnap.docs.map(commentDoc => deleteDoc(commentDoc.ref))
      await Promise.all(deletePromises)

      await deleteDoc(doc(db, 'posts', id))
      openMenuId.value = null
      router.push('/feed')
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post.")
    }
  }
}

// Fire data fetch on page load
onMounted(() => {
  fetchPostAndComments()
})
</script>

<style scoped>
.post-detail-container {
  max-width: 800px;
}

.back-btn {
  margin-bottom: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  color: var(--text-secondary);
  padding: 3rem;
  background: var(--surface-color);
  border-radius: var(--radius-md);
  border: 1px dashed var(--border-color);
  margin-bottom: 1.5rem;
}

.post-card,
.comment-form-card,
.comment-card {
  margin-bottom: 1.5rem;
}

.post-header,
.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.post-date,
.comment-date {
  color: var(--text-secondary);
}

.post-content {
  white-space: pre-wrap;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  line-height: 1.5;
}

.comment-content {
  white-space: pre-wrap;
  margin: 0;
}

.post-images {
  margin-bottom: 1rem;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.comment-form-card h3,
.comments-section h3 {
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.comments-section h3 {
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  resize: vertical;
  font-family: inherit;
  font-size: 1rem;
}

.comment-textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-secondary {
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: var(--background-color);
  border-color: var(--text-secondary);
}

.post-header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
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
