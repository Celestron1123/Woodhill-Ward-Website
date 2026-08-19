<template>
  <div class="create-event-wrapper">
    <button class="create-event-btn aqua-btn" @click="openEventModal">Create Event</button>
  </div>

  <Teleport to="body">
    <div v-if="isEventModalOpen" class="lightbox-overlay" @click="closeEventModal">
      <div class="event-modal-content cyber-panel" @click.stop>
        <button class="close-btn" @click="closeEventModal" aria-label="Close modal">[ X ]</button>
        <h2 class="chrome-text">Create Event</h2>
        <table class="event-form-table">
          <tbody>
            <tr>
              <td><label for="event-title" class="digital-label">TITLE:</label></td>
              <td><input id="event-title" type="text" v-model="eventForm.title" class="cyber-input" /></td>
            </tr>
            <tr>
              <td><label for="event-date" class="digital-label">DATE:</label></td>
              <td><input id="event-date" type="date" v-model="eventForm.date" class="cyber-input" /></td>
            </tr>
            <tr>
              <td><label for="event-time" class="digital-label">TIME:</label></td>
              <td><input id="event-time" type="time" v-model="eventForm.time" class="cyber-input" /></td>
            </tr>
            <tr>
              <td><label class="digital-label">TAGS:</label></td>
              <td class="tags-container">
                <label v-for="tag in AVAILABLE_TAGS" :key="tag" class="tag-checkbox">
                  <input type="checkbox" :value="tag" v-model="eventForm.tags" />
                  <span style="color: #eee;">{{ tag }}</span>
                </label>
              </td>
            </tr>
            <tr>
              <td><label for="event-description" class="digital-label">DETAILS:</label></td>
              <td><textarea id="event-description" v-model="eventForm.description" class="cyber-input"></textarea></td>
            </tr>
          </tbody>
        </table>
        <p v-if="formError" class="error-text">ERR: Required info missing</p>
        <div class="modal-actions">
          <button class="cancel-btn aqua-btn" @click="closeEventModal" style="background: #555;">Cancel</button>
          <button class="submit-btn aqua-btn" @click="submitEvent" style="background: var(--bio-green-2); color: #000;">Submit</button>
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

.event-modal-content {
  padding: 2rem;
  min-width: 300px;
  max-width: 90%;
  width: 500px;
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

.event-modal-content h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  border-bottom: 2px solid #555;
  padding-bottom: 0.5rem;
  color: #eee;
}

.event-form-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.event-form-table td {
  padding: 0.5rem 0;
  vertical-align: top;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  padding-top: 0.5rem;
}

.tag-checkbox {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: normal !important;
  margin-top: 0 !important;
  font-size: 0.95rem;
}

.event-form-table label {
  font-weight: bold;
  display: inline-block;
  margin-top: 0.5rem;
}

.event-form-table input,
.event-form-table textarea {
  width: 100%;
  box-sizing: border-box;
}

.event-form-table textarea {
  resize: vertical;
  min-height: 80px;
}

.error-text {
  color: var(--crt-orange-1);
  font-family: 'Lucida Console', monospace;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  background: #000;
  border: 1px solid var(--crt-orange-1);
  padding: 0.5rem;
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
