<template>
  <div class="group-social-wrapper">
    <h2 class="section-header">Recent Social Posts</h2>
    
    <div v-if="posts.length === 0" class="empty-state">
      <p>No recent posts found.</p>
    </div>

    <div v-else class="posts-list">
      <div v-for="post in posts" :key="post.id" class="post-card">
        <p class="post-header">
          <strong>{{ post.authorName }}</strong>
          <span class="post-date">{{ formatDate(post.created) }}</span>
        </p>
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
  color: #1da1f2;
  font-weight: bold;
}

.action-buttons {
  display: flex;
  justify-content: center;
}

.btn-primary {
  display: inline-block;
  background-color: #007bff;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #0056b3;
}
</style>
