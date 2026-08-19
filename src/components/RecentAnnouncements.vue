<template>
  <div class="recent-announcements-wrapper cyber-panel">
    <h2 class="section-header chrome-text">Recent Announcements</h2>

    <div v-if="recentAnnouncement" class="recent-card lcd-screen">
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 10px;">
        <h3 class="title" style="color: var(--liquid-cyan); margin: 0;">{{ recentAnnouncement.title }}</h3>
        <span class="digital-label">BCAST_01</span>
      </div>
      <span class="date">{{ formatDate(recentAnnouncement.created) }}</span>
      <p class="content">{{ recentAnnouncement.content }}</p>
    </div>
    <div v-else class="empty-state lcd-screen">
      <p>No recent announcements. [SYS_IDLE]</p>
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
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  font-family: 'Lucida Console', monospace;
}

.recent-card {
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.3rem;
}

.date {
  display: block;
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.content {
  margin: 0;
  color: #eee;
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
