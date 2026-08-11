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
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.action-btn:hover {
  background-color: #0056b3;
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
  min-width: 300px;
  max-width: 90%;
  width: 500px;
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
  color: #2c3e50;
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
  font-weight: bold;
  display: inline-block;
  margin-top: 0.5rem;
  color: #4a4a4a;
}

.form-table input,
.form-table textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  font-family: inherit;
}

.form-table input:focus,
.form-table textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-table textarea {
  resize: vertical;
  min-height: 150px;
}

.error-text {
  color: #dc3545;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  background: #f8d7da;
  padding: 0.5rem;
  border-radius: 4px;
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn,
.submit-btn {
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease;
}

.cancel-btn {
  background-color: #e0e0e0;
  color: #333;
}

.cancel-btn:hover {
  background-color: #ccc;
}

.submit-btn {
  background-color: #28a745;
  color: white;
}

.submit-btn:hover {
  background-color: #218838;
}
</style>
