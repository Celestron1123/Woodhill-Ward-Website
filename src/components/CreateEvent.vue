<template>
  <div class="create-event-wrapper">
    <button class="create-event-btn" @click="openEventModal">Create Event</button>
  </div>

  <Teleport to="body">
    <div v-if="isEventModalOpen" class="lightbox-overlay" @click="closeEventModal">
      <div class="event-modal-content" @click.stop>
        <h2>Create Event</h2>
        <table class="event-form-table">
          <tbody>
            <tr>
              <td><label for="event-title">Title:</label></td>
              <td><input id="event-title" type="text" v-model="eventForm.title" /></td>
            </tr>
            <tr>
              <td><label for="event-date">Date:</label></td>
              <td><input id="event-date" type="date" v-model="eventForm.date" /></td>
            </tr>
            <tr>
              <td><label for="event-time">Time:</label></td>
              <td><input id="event-time" type="time" v-model="eventForm.time" /></td>
            </tr>
            <tr>
              <td><label>Tags:</label></td>
              <td class="tags-container">
                <label v-for="tag in AVAILABLE_TAGS" :key="tag" class="tag-checkbox">
                  <input type="checkbox" :value="tag" v-model="eventForm.tags" />
                  {{ tag }}
                </label>
              </td>
            </tr>
            <tr>
              <td><label for="event-description">Description:</label></td>
              <td><textarea id="event-description" v-model="eventForm.description"></textarea></td>
            </tr>
          </tbody>
        </table>
        <p v-if="formError" class="error-text">Required info missing</p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="closeEventModal">Cancel</button>
          <button class="submit-btn" @click="submitEvent">Submit</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useFirestore } from 'vuefire'
import { collection, addDoc, Timestamp, serverTimestamp } from 'firebase/firestore'

const db = useFirestore()

const AVAILABLE_TAGS = [
  'Young Women',
  'Young Men',
  'Relief Society',
  'Elders Quorum',
  'Primary',
  'Sunday School',
]

const isEventModalOpen = ref(false)
const eventForm = ref({ title: '', date: '', time: '', description: '', tags: [] })
const formError = ref(false)

const openEventModal = () => {
  isEventModalOpen.value = true
  formError.value = false
  eventForm.value = { title: '', date: '', time: '', description: '', tags: [] }
}

const closeEventModal = () => {
  isEventModalOpen.value = false
}

const submitEvent = async () => {
  if (
    !eventForm.value.title ||
    !eventForm.value.date ||
    !eventForm.value.time ||
    !eventForm.value.description
  ) {
    formError.value = true
    return
  }

  try {
    const [year, month, day] = eventForm.value.date.split('-')
    const [hours, minutes] = eventForm.value.time.split(':')
    const dateObj = new Date(year, month - 1, day, hours, minutes)

    let finalTags = eventForm.value.tags
    if (finalTags.length === 0 || finalTags.length === AVAILABLE_TAGS.length) {
      finalTags = ['all']
    }

    await addDoc(collection(db, 'events'), {
      title: eventForm.value.title,
      date: Timestamp.fromDate(dateObj),
      description: eventForm.value.description,
      tags: finalTags,
      created: serverTimestamp(),
    })

    closeEventModal()
  } catch (e) {
    console.error(e)
  }
}
</script>

<style scoped>
/* Event Creation Styles */
.create-event-wrapper {
  text-align: center;
  margin: 1rem 0 2rem 0;
}

.create-event-btn {
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1.1rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;
  font-weight: 500;
}

.create-event-btn:hover {
  background-color: var(--accent-hover);
}

.create-event-btn:active {
  transform: translateY(1px);
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

.event-modal-content {
  background: var(--surface-color);
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  min-width: 320px;
  max-width: 90%;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
}

.event-modal-content h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.75rem;
  color: var(--primary-color);
}

.event-form-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.event-form-table td {
  padding: 0.5rem 0;
  vertical-align: top;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  padding-top: 0.5rem;
}

.tag-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal !important;
  margin-top: 0 !important;
  font-size: 0.95rem;
  cursor: pointer;
}

.event-form-table label {
  font-weight: 600;
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--text-primary);
  padding-right: 1rem;
}

.event-form-table input[type='text'],
.event-form-table input[type='date'],
.event-form-table input[type='time'],
.event-form-table textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color 0.2s;
}

.event-form-table input:focus,
.event-form-table textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.event-form-table textarea {
  resize: vertical;
  min-height: 100px;
}

.error-text {
  color: #ef4444;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn,
.submit-btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: var(--radius-md);
  cursor: pointer;
  border: none;
  font-weight: 500;
  transition: background-color 0.2s;
}

.cancel-btn {
  background-color: var(--background-color);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.cancel-btn:hover {
  background-color: var(--border-color);
}

.submit-btn {
  background-color: var(--accent-color);
  color: white;
}

.submit-btn:hover {
  background-color: var(--accent-hover);
}
</style>
