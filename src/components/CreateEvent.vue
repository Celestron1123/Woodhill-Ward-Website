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
import { ref } from 'vue';
import { useFirestore } from 'vuefire';
import { collection, addDoc, Timestamp, serverTimestamp } from 'firebase/firestore';

const db = useFirestore();

const isEventModalOpen = ref(false);
const eventForm = ref({ title: '', date: '', description: '' });
const formError = ref(false);

const openEventModal = () => {
    isEventModalOpen.value = true;
    formError.value = false;
    eventForm.value = { title: '', date: '', description: '' };
};

const closeEventModal = () => {
    isEventModalOpen.value = false;
};

const submitEvent = async () => {
    if (!eventForm.value.title || !eventForm.value.date || !eventForm.value.description) {
        formError.value = true;
        return;
    }

    try {
        const [year, month, day] = eventForm.value.date.split('-');
        const dateObj = new Date(year, month - 1, day);

        await addDoc(collection(db, 'events'), {
            title: eventForm.value.title,
            date: Timestamp.fromDate(dateObj),
            description: eventForm.value.description,
            created: serverTimestamp()
        });

        closeEventModal();
    } catch (e) {
        console.error(e);
    }
};
</script>

<style scoped>
/* Event Creation Styles */
.create-event-wrapper {
    text-align: center;
    margin: 1rem 0 2rem 0;
}

.create-event-btn {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1.1rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.create-event-btn:hover {
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

.event-modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    min-width: 300px;
    max-width: 90%;
}

.event-modal-content h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    border-bottom: 2px solid #eaeaea;
    padding-bottom: 0.5rem;
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

.event-form-table label {
    font-weight: bold;
    display: inline-block;
    margin-top: 0.5rem;
}

.event-form-table input,
.event-form-table textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
}

.event-form-table textarea {
    resize: vertical;
    min-height: 80px;
}

.error-text {
    color: #dc3545;
    font-weight: bold;
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
    padding: 0.5rem 1.25rem;
    font-size: 1rem;
    border-radius: 4px;
    cursor: pointer;
    border: none;
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