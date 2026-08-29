<template>
  <div class="group-social-wrapper">
    <h2 class="section-header">Recent Social Posts</h2>

    <div v-if="posts.length === 0" class="empty-state">
      <p>No recent posts found.</p>
    </div>

    <div v-else class="posts-list">
      <div v-for="post in posts" :key="post.id" class="post-card">
        <div class="post-header">
          <div class="post-header-left">
            <strong>{{ post.authorName }}</strong>
            <span class="post-date">{{ formatDate(post.created) }}</span>
          </div>
          <div class="post-header-right" v-if="canDeletePost(post)">
            <button class="options-btn" @click.stop="toggleMenu(post.id)">...</button>
            <div v-if="openMenuId === post.id" class="options-menu">
              <button @click="handleDeletePost(post.id)" class="delete-menu-item">Delete Post</button>
            </div>
          </div>
        </div>
        <p class="post-content">
          <template v-for="(token, index) in parseTextContent(post.textContent)" :key="index">
            <span v-if="token.type === 'hashtag'" class="hashtag">{{ token.content }}</span>
            <span v-else>{{ token.content }}</span>
          </template>
        </p>
        <ImageCarousel v-if="post.imageUrls && post.imageUrls.length" :images="post.imageUrls" />
      </div>
    </div>

    <div class="action-buttons">
      <router-link to="/feed" class="btn-primary">View Ward Scrapbook</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue'
import { db, auth } from '../firebase'
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore'
import ImageCarousel from './ImageCarousel.vue'
import { useUserRole } from '../composables/useUserRole'

const { userRole } = useUserRole()

const props = defineProps({
  tags: {
    type: Array,
    required: true,
  },
})

const posts = ref([])

const fetchPosts = async () => {
  try {
    const postsRef = collection(db, 'posts')
    const q = query(postsRef, where('tags', 'array-contains-any', props.tags))
    const querySnapshot = await getDocs(q)
    let fetchedPosts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    // Sort by created desc
    fetchedPosts.sort((a, b) => {
      const timeA = a.created ? a.created.toMillis() : 0
      const timeB = b.created ? b.created.toMillis() : 0
      return timeB - timeA
    })

    // Take top 3
    posts.value = fetchedPosts.slice(0, 3)
  } catch (error) {
    console.error('Error fetching group posts:', error)
  }
}

onMounted(() => {
  fetchPosts()
})

const parseTextContent = (text) => {
  if (!text) return []
  const parts = text.split(/(#\w+)/g)
  return parts.map((part) => {
    if (part.match(/^#\w+$/)) {
      return { type: 'hashtag', content: part }
    }
    return { type: 'text', content: part }
  })
}

const formatDate = (timestamp) => {
  if (!timestamp) return 'Just now'
  const dateObj = timestamp.toDate()
  return dateObj.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
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
  if (confirm("Are you sure you want to delete this post? This cannot be undone.")) {
    try {
      const commentsRef = collection(db, 'posts', postId, 'comments')
      const commentsSnap = await getDocs(commentsRef)
      const deletePromises = commentsSnap.docs.map(commentDoc => deleteDoc(commentDoc.ref))
      await Promise.all(deletePromises)

      await deleteDoc(doc(db, 'posts', postId))
      posts.value = posts.value.filter(p => p.id !== postId)
      openMenuId.value = null
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Failed to delete post.")
    }
  }
}
</script>

<style scoped>
.group-social-wrapper {
  max-width: 600px;
  margin: 2.5rem auto;
  padding: 1rem;
}

.section-header {
  font-size: 1.25rem;
  font-weight: bold;
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  margin-top: 0;
}

.empty-state {
  color: #666;
  font-style: italic;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.post-card {
  background: #f9f9f9;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  padding: 1.25rem;
}

.post-header {
  margin: 0 0 0.75rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-date {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.post-content {
  margin: 0 0 1rem 0;
  color: #4a4a4a;
  line-height: 1.5;
  white-space: pre-wrap;
}

.hashtag {
  color: #d35400;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  justify-content: center;
}

.btn-primary {
  display: inline-block;
  background-color: #d35400;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #e67e22;
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
