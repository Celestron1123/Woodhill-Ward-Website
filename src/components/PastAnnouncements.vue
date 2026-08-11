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
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ccc;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action-btn:hover {
  background-color: #e2e6ea;
}

.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  line-height: 1;
}

.close-btn:hover {
  color: #000;
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 0.5rem;
  flex-shrink: 0;
  color: #2c3e50;
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
  background: #f1f1f1;
  border-radius: 4px;
}
.scrollable-content::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}
.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.empty-state {
  color: #666;
  font-style: italic;
  text-align: center;
  margin-top: 2rem;
}

.announcement-card {
  border: 1px solid #eaeaea;
  border-left: 4px solid #007bff;
  border-radius: 6px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  background: #fafafa;
}

.announcement-card h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.date {
  display: block;
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.announcement-card p {
  margin: 0;
  color: #4a4a4a;
  line-height: 1.6;
  white-space: pre-wrap;
}
</style>
