<template>
  <button class="action-btn" @click="openModal">Make Announcement</button>

  <Teleport to="body">
    <div v-if="isOpen" class="lightbox-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeModal" aria-label="Close modal">&times;</button>
        <h2>Make Announcement</h2>
        <table class="form-table">
          <tbody>
            <tr>
              <td><label for="announcement-title">Title:</label></td>
              <td>
                <input
                  id="announcement-title"
                  type="text"
                  v-model="form.title"
                  placeholder="Announcement Title"
                />
              </td>
            </tr>
            <tr>
              <td><label for="announcement-content">Content:</label></td>
              <td>
                <textarea
                  id="announcement-content"
                  v-model="form.content"
                  placeholder="Details of the announcement..."
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="formError" class="error-text">Required info missing</p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <button class="submit-btn" @click="submit">Submit</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useFirestore } from 'vuefire'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const db = useFirestore()
const isOpen = ref(false)
const form = ref({ title: '', content: '' })
const formError = ref(false)

const openModal = () => {
  isOpen.value = true
  formError.value = false
  form.value = { title: '', content: '' }
}

const closeModal = () => {
  isOpen.value = false
}

const submit = async () => {
  if (!form.value.title || !form.value.content) {
    formError.value = true
    return
  }

  try {
    await addDoc(collection(db, 'announcements'), {
      title: form.value.title,
      content: form.value.content,
      created: serverTimestamp(),
    })
    closeModal()
  } catch (e) {
    console.error('Error creating announcement: ', e)
  }
}
</script>

<style scoped>
.action-btn {
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;
}

.action-btn:hover {
  background-color: var(--accent-hover);
}

.action-btn:active {
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

.modal-content {
  background: var(--surface-color);
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  min-width: 320px;
  max-width: 90%;
  width: 500px;
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
  color: var(--primary-color);
  padding-right: 2rem; /* Make room for X */
}

.form-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.form-table td {
  padding: 0.75rem 0;
  vertical-align: top;
}

.form-table label {
  font-weight: 600;
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--text-primary);
  padding-right: 1rem;
}

.form-table input,
.form-table textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  box-sizing: border-box;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-table input:focus,
.form-table textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.form-table textarea {
  resize: vertical;
  min-height: 150px;
}

.error-text {
  color: #ef4444;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  background: #fee2e2;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  text-align: center;
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
  font-weight: 500;
  border-radius: var(--radius-md);
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease;
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
