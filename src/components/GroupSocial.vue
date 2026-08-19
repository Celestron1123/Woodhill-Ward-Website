<template>
  <div class="group-social-wrapper cyber-panel">
    <h2 class="section-header chrome-text">Recent Social Posts</h2>
    
    <div v-if="posts.length === 0" class="empty-state lcd-screen">
      <p>[NO_DATA] No recent posts found.</p>
    </div>

    <div v-else class="posts-list">
      <div v-for="(post, index) in posts" :key="post.id" class="post-card lcd-screen">
        <p class="post-header">
          <strong style="color: var(--crt-orange-1);">USER: {{ post.authorName }}</strong>
          <span class="post-date digital-label">{{ formatDate(post.created) }}</span>
        </p>
        <p class="post-content">
          <template v-for="(token, index) in parseTextContent(post.textContent)" :key="index">
            <span v-if="token.type === 'hashtag'" class="hashtag">{{ token.content }}</span>
            <span v-else>{{ token.content }}</span>
          </template>
        </p>
        <ImageCarousel v-if="post.imageUrls && post.imageUrls.length" :images="post.imageUrls" class="acrylic-glass" />
      </div>
    </div>

    <div class="action-buttons">
      <router-link to="/feed" class="btn-primary aqua-btn" style="text-decoration:none;">View Ward Scrapbook</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue'
import { db } from '../firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import ImageCarousel from './ImageCarousel.vue'

const props = defineProps({
  tags: {
    type: Array,
    required: true
  }
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
</script>

<style scoped>
.group-social-wrapper {
  max-width: 600px;
  margin: 2.5rem auto;
}

.section-header {
  font-size: 1.25rem;
  border-bottom: 2px solid #555;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  margin-top: 0;
}

.empty-state {
  color: var(--crt-orange-1);
  font-family: 'Lucida Console', monospace;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  padding: 10px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.post-card {
  padding: 1.25rem;
  margin-bottom: 10px;
}

.post-header {
  margin: 0 0 0.75rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
  padding-bottom: 5px;
}

.post-date {
  font-size: 0.9rem;
}

.post-content {
  margin: 0 0 1rem 0;
  color: #eee;
  line-height: 1.5;
  white-space: pre-wrap;
}

.hashtag {
  color: #1da1f2;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(29, 161, 242, 0.5);
}

.action-buttons {
  display: flex;
  justify-content: center;
}
</style>
