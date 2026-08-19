<template>
  <div class="recent-announcements-wrapper">
    <h2 class="section-header">Recent Announcements</h2>

    <div v-if="recentAnnouncement" class="recent-card">
      <h3 class="title">{{ recentAnnouncement.title }}</h3>
      <span class="date">{{ formatDate(recentAnnouncement.created) }}</span>
      <p class="content">{{ recentAnnouncement.content }}</p>
    </div>
    <div v-else class="empty-state">
      <p>No recent announcements</p>
    </div>

    <div class="action-buttons">
      <PastAnnouncements />
      <CreateAnnouncement v-if="canCreateAnnouncement" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCollection, useFirestore } from 'vuefire'
import { collection, query, orderBy, limit } from 'firebase/firestore'
import PastAnnouncements from './PastAnnouncements.vue'
import CreateAnnouncement from './CreateAnnouncement.vue'
import { useUserRole } from '../composables/useUserRole'

const { canCreateAnnouncement } = useUserRole()

const db = useFirestore()

const announcementsQuery = query(
  collection(db, 'announcements'),
  orderBy('created', 'desc'),
  limit(1),
)

const announcements = useCollection(announcementsQuery)

const recentAnnouncement = computed(() => {
  return announcements.value.length > 0 ? announcements.value[0] : null
})

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const dateObj = timestamp.toDate()
  return dateObj.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
</script>

<style scoped>
.recent-announcements-wrapper {
  max-width: 600px;
  margin: 2.5rem auto 2.5rem auto;
  padding: 1rem;
}

.section-header {
  font-size: 1.5rem;
  font-weight: bold;
  border-bottom: 2px solid rgba(255, 255, 255, 0.6);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  color: #0056b3;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
  margin-top: 0;
}

.empty-state {
  color: #3b7496;
  font-style: italic;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.recent-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(220, 240, 255, 0.4) 100%);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-left: 6px solid #6fc1e5;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1), inset 0 2px 5px rgba(255, 255, 255, 0.8);
}

.title {
  font-size: 1.4rem;
  margin: 0 0 0.5rem 0;
  color: #0b3d59;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
}

.date {
  display: block;
  color: #3b7496;
  font-size: 0.95rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.content {
  margin: 0;
  color: #222;
  line-height: 1.6;
  white-space: pre-wrap;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
}
</style>
