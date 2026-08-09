<template>
    <main class="main-view-container">
        <header class="page-header">
            <h1>Woodhill Ward Home</h1>
            <p class="subtitle">Upcoming Activities & Announcements</p>
        </header>

        <section class="calendar-section">
            <HomeCalendar />
            <div class="create-event-wrapper">
                <button class="create-event-btn" @click="openEventModal">Create Event</button>
            </div>
            <UpcomingEvents />
        </section>

        <section class="info-section">
            <h2>Ward Family</h2>
            <div class="card-grid">
                <a href="https://scrapbook.woodhillward.com" target="_blank" class="info-card link-card">
                    <h3>Ward Scrapbook</h3>
                    <p>View photos from recent activities and ward parties!</p>
                </a>
                <a href="https://youtube.com/c/WoodhillWard" target="_blank" class="info-card link-card">
                    <h3>Ward YouTube</h3>
                    <p>Watch sacrament meeting broadcasts and devotional videos.</p>
                </a>
            </div>
        </section>

        <section class="info-section">
            <h2>Building Info</h2>
            <div class="card-grid">
                <div class="info-card interactive-card" @click="openLightbox('/src/assets/ward-boundaries.png')">
                    <h3>Ward Boundaries</h3>
                    <img src="/src/assets/ward-boundaries.png" alt="Map of Woodhill Ward boundaries"
                        class="thumbnail" />
                    <p class="click-hint">Tap to expand map</p>
                </div>
                <div class="info-card interactive-card" @click="openLightbox('/src/assets/building-map.png')">
                    <h3>Building Layout</h3>
                    <img src="/src/assets/building-map.png" alt="Layout map of the ward building" class="thumbnail" />
                    <p class="click-hint">Tap to expand map</p>
                </div>
            </div>
        </section>

        <section class="info-section">
            <h2>Ward Leaders</h2>
            <div class="contact-list">
                <div class="contact-item">
                    <strong>Bishopric</strong>
                    <p>Bishop Adam Cottle</p>
                    <p>1st Counselor Chris Cozzens</p>
                </div>
                <div class="contact-item">
                    <strong>Relief Society</strong>
                    <p>President Lisa Leavitt</p>
                </div>
                <div class="contact-item">
                    <strong>Elders Quorum</strong>
                    <p>President Adam MacKay</p>
                </div>
            </div>
        </section>

        <div v-if="expandedImage" class="lightbox-overlay" @click="closeLightbox">
            <button class="close-btn" @click.stop="closeLightbox">&times;</button>
            <img :src="expandedImage" alt="Expanded view" class="expanded-img" @click.stop />
        </div>

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

    </main>
</template>

<script setup>
import { ref } from 'vue';
import UpcomingEvents from '@/components/UpcomingEvents.vue';
import HomeCalendar from '../components/HomeCalendar.vue';
import { useFirestore } from 'vuefire';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const db = useFirestore();

// State for the image lightbox
const expandedImage = ref(null);

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
            Title: eventForm.value.title,
            'Event Date': Timestamp.fromDate(dateObj),
            Description: eventForm.value.description
        });
        closeEventModal();
    } catch (e) {
        console.error(e);
    }
};

// Functions to handle opening and closing the maps
const openLightbox = (imageSrc) => {
    expandedImage.value = imageSrc;
};

const closeLightbox = () => {
    expandedImage.value = null;
};
</script>

<style scoped>
/* Mobile-first styling conforming to the Design Document */
.main-view-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
    font-family: sans-serif;
    color: #2c3e50;
}

.page-header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eaeaea;
}

.page-header h1 {
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
}

.subtitle {
    color: #656565;
    font-size: 1.1rem;
    margin: 0;
}

.calendar-section {
    /* Adds a subtle container around the calendar area if desired */
    background: #ffffff;
    border-radius: 8px;
    margin-bottom: 2rem;
}

.info-section {
    margin-bottom: 2.5rem;
}

.info-section h2 {
    font-size: 1.5rem;
    border-bottom: 2px solid #eaeaea;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
}

/* Grid for Cards - Mobile First (1 column), then 2 columns on larger screens */
.card-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

@media (min-width: 600px) {
    .card-grid {
        grid-template-columns: 1fr 1fr;
    }
}

.info-card {
    background: #f9f9f9;
    border: 1px solid #eaeaea;
    border-radius: 8px;
    padding: 1rem;
    text-align: center;
}

.info-card h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
}

/* Link Cards */
.link-card {
    text-decoration: none;
    color: inherit;
    display: block;
    transition: background-color 0.2s ease;
}

.link-card:hover {
    background-color: #f0f0f0;
}

.link-card p {
    color: #666;
    font-size: 0.95rem;
    margin: 0;
}

/* Map Cards */
.interactive-card {
    cursor: pointer;
    transition: background-color 0.2s ease;
}

.interactive-card:hover {
    background-color: #f0f0f0;
}

.thumbnail {
    width: 100%;
    max-height: 150px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    border: 1px solid #ddd;
}

.click-hint {
    font-size: 0.85rem;
    color: #007bff;
    margin: 0;
    font-weight: bold;
}

/* Contact List */
.contact-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.contact-item {
    background: #f9f9f9;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #eaeaea;
}

.contact-item strong {
    display: block;
    font-size: 1.1rem;
    margin-bottom: 0.25rem;
}

.contact-item p {
    margin: 0.25rem 0;
    color: #555;
}

/* Lightbox Overlay Styles */
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
    /* Ensure it floats above everything */
}

.expanded-img {
    max-width: 90%;
    max-height: 90%;
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.close-btn {
    position: absolute;
    top: 20px;
    right: 30px;
    background: none;
    border: none;
    color: white;
    font-size: 3rem;
    cursor: pointer;
    line-height: 1;
}

.close-btn:hover {
    color: #ddd;
}

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