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
  margin: 2.5rem auto 2.5rem auto;
}

.section-header {
  font-size: 1.5rem;
  font-weight: 700;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
  margin-top: 0;
}

.empty-state {
  color: var(--text-secondary);
  font-style: italic;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.recent-card {
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-left: 4px solid var(--primary-color);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.title {
  font-size: 1.4rem;
  margin: 0 0 0.5rem 0;
  color: var(--primary-color);
  font-weight: 700;
  line-height: 1.3;
}

.date {
  display: block;
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.content {
  margin: 0;
  color: var(--text-primary);
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
