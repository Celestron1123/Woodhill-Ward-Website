<template>
  <button class="action-btn aqua-btn" @click="openModal">Make Announcement</button>

  <Teleport to="body">
    <div v-if="isOpen" class="lightbox-overlay" @click="closeModal">
      <div class="modal-content cyber-panel" @click.stop>
        <button class="close-btn" @click="closeModal" aria-label="Close modal">[ X ]</button>
        <h2 class="chrome-text">Make Announcement</h2>
        <table class="form-table">
          <tbody>
            <tr>
              <td><label for="announcement-title" class="digital-label">TITLE:</label></td>
              <td>
                <input
                  id="announcement-title"
                  type="text"
                  v-model="form.title"
                  class="cyber-input"
                  placeholder="Announcement Title"
                />
              </td>
            </tr>
            <tr>
              <td><label for="announcement-content" class="digital-label">CONTENT:</label></td>
              <td>
                <textarea
                  id="announcement-content"
                  v-model="form.content"
                  class="cyber-input"
                  placeholder="Details of the announcement..."
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="formError" class="error-text">ERR: Required info missing</p>
        <div class="modal-actions">
          <button class="cancel-btn aqua-btn" @click="closeModal" style="background: #555;">Cancel</button>
          <button class="submit-btn aqua-btn" @click="submit" style="background: var(--bio-green-2); color: #000;">Submit</button>
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

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #555;
  padding-bottom: 0.5rem;
  color: #eee;
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
  font-weight: bold;
  display: inline-block;
  margin-top: 0.5rem;
}

.form-table input,
.form-table textarea {
  width: 100%;
  box-sizing: border-box;
}

.form-table textarea {
  resize: vertical;
  min-height: 150px;
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
