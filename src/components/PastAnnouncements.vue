<template>
  <button class="action-btn" @click="openModal">See all past announcements</button>

  <Teleport to="body">
    <div v-if="isOpen" class="lightbox-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal" aria-label="Close modal">&times;</button>
        <h2>Past Announcements</h2>

        <div class="scrollable-content">
          <div v-if="announcements.length === 0" class="empty-state">
            <p>No announcements found.</p>
          </div>
          <div v-else v-for="ann in announcements" :key="ann.id" class="announcement-card">
            <h3>{{ ann.title }}</h3>
            <span class="date">{{ formatDate(ann.created) }}</span>
            <p>{{ ann.content }}</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useCollection, useFirestore } from 'vuefire'
import { collection, query, orderBy } from 'firebase/firestore'

const db = useFirestore()
const isOpen = ref(false)

const announcementsQuery = query(collection(db, 'announcements'), orderBy('created', 'desc'))
const announcements = useCollection(announcementsQuery)

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const dateObj = timestamp.toDate()
  return dateObj.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
.action-btn {
  background-color: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background-color: var(--background-color);
  border-color: var(--text-secondary);
}

.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--surface-color);
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--text-secondary);
  line-height: 1;
  transition: color 0.2s;
}

.close-btn:hover {
  color: var(--text-primary);
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.75rem;
  flex-shrink: 0;
  color: var(--primary-color);
  padding-right: 2rem; /* Make room for X */
}

.scrollable-content {
  overflow-y: auto;
  flex-grow: 1;
  padding-right: 0.5rem;
}

/* Custom scrollbar for better aesthetics */
.scrollable-content::-webkit-scrollbar {
  width: 8px;
}
.scrollable-content::-webkit-scrollbar-track {
  background: var(--background-color);
  border-radius: 4px;
}
.scrollable-content::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}
.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.empty-state {
  color: var(--text-secondary);
  font-style: italic;
  text-align: center;
  margin-top: 2rem;
}

.announcement-card {
  border: 1px solid var(--border-color);
  border-left: 4px solid var(--primary-color);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: var(--surface-color);
  box-shadow: var(--shadow-sm);
}

.announcement-card h3 {
  margin: 0 0 0.5rem 0;
  color: var(--primary-color);
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.3;
}

.date {
  display: block;
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.announcement-card p {
  margin: 0;
  color: var(--text-primary);
  line-height: 1.6;
  white-space: pre-wrap;
}
</style>
