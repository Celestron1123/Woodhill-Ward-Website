<template>
  <div class="post-detail-container">
    <button class="aqua-btn" @click="goBack" style="margin-bottom: 20px">&larr; BACK TO FEED</button>

    <div v-if="loading" class="lcd-screen" style="padding: 20px;">
      <p class="digital-label">SYS_STATUS: LOADING...</p>
    </div>

    <div v-else-if="post">
      <div class="cyber-panel" style="padding: 15px; margin-bottom: 20px">
        <p>
          <strong style="color: var(--crt-orange-1);">USER: {{ post.authorName }}</strong>
          <span class="digital-label" style="margin-left: 10px;">{{ formatDate(post.created) }}</span>
        </p>
        <p style="font-size: 1.2em; color: #eee; margin: 15px 0;">{{ post.textContent }}</p>

        <ImageCarousel :images="post.imageUrls" class="acrylic-glass" />
      </div>

      <div v-if="canCreatePost" class="cyber-panel" style="padding: 15px; margin-bottom: 20px;">
        <h3 class="chrome-text">Add a Comment</h3>
        <form @submit.prevent="submitComment">
          <textarea
            v-model="newCommentContent"
            class="cyber-input"
            placeholder="Write a comment..."
            rows="3"
            style="width: 100%; box-sizing: border-box;"
            required
          ></textarea>
          <br />
          <button type="submit" class="aqua-btn" style="margin-top: 10px;">Post Comment</button>
        </form>
      </div>

      <hr style="border-color: #555; margin: 20px 0;" />

      <div>
        <h3 class="chrome-text">Comments</h3>
        <div v-if="comments.length === 0" class="lcd-screen" style="padding: 15px;">
          <p>[NO_DATA] No comments yet. Be the first!</p>
        </div>

        <div
          v-for="comment in comments"
          :key="comment.id"
          class="lcd-screen"
          style="
            margin-bottom: 10px;
            padding: 10px;
          "
        >
          <p style="margin: 0 0 5px 0;">
            <strong style="color: var(--crt-orange-2);">{{ comment.authorName }}</strong>
            <small class="digital-label" style="margin-left: 10px; font-size: 0.7em;">{{ formatDate(comment.created) }}</small>
          </p>
          <p style="margin: 0; color: #ccc;">{{ comment.content }}</p>
        </div>
      </div>
    </div>

    <div v-else class="lcd-screen" style="padding: 20px;">
      <p class="digital-label" style="color: red; border-color: red;">ERR: POST_NOT_FOUND</p>
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
} from 'firebase/firestore'
import ImageCarousel from '../components/ImageCarousel.vue'
import { useUserRole } from '../composables/useUserRole'

// Router handles navigation, Route gives us access to URL params
const { canCreatePost } = useUserRole()
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

// Fire data fetch on page load
onMounted(() => {
  fetchPostAndComments()
})
</script>

<style scoped>
.post-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
