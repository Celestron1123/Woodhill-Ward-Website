<template>
  <button class="action-btn aqua-btn" @click="openModal">See all past announcements</button>

  <Teleport to="body">
    <div v-if="isOpen" class="lightbox-overlay" @click="closeModal">
      <div class="modal-content cyber-panel" @click.stop>
        <button class="close-btn" @click="closeModal" aria-label="Close modal">[ X ]</button>
        <h2 class="chrome-text">Past Announcements</h2>

        <div class="scrollable-content">
          <div v-if="announcements.length === 0" class="empty-state digital-label">
            <p>No announcements found.</p>
          </div>
          <div v-else v-for="(ann, index) in announcements" :key="ann.id" class="announcement-card lcd-screen">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #333; padding-bottom: 5px; margin-bottom: 10px;">
              <h3 style="color: var(--liquid-cyan); margin: 0;">{{ ann.title }}</h3>
              <span class="digital-label">ARCHIVE_0{{ index + 1 }}</span>
            </div>
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
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8), var(--bevel-inset);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  color: var(--crt-orange-1);
  font-family: 'Lucida Console', monospace;
}

.close-btn:hover {
  color: #fff;
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #555;
  padding-bottom: 0.5rem;
  flex-shrink: 0;
}

.scrollable-content {
  overflow-y: auto;
  flex-grow: 1;
  padding-right: 0.5rem;
}

/* Custom scrollbar */
.scrollable-content::-webkit-scrollbar {
  width: 8px;
}
.scrollable-content::-webkit-scrollbar-track {
  background: #111;
  border: 1px solid #333;
}
.scrollable-content::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 4px;
}
.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: #777;
}

.empty-state {
  text-align: center;
  margin-top: 2rem;
}

.announcement-card {
  margin-bottom: 1.5rem;
}

.date {
  display: block;
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.announcement-card p {
  margin: 0;
  color: #eee;
  line-height: 1.6;
  white-space: pre-wrap;
}
</style>
