<template>
  <main class="main-view-container">
    <header class="page-header">
      <h1>Wood Hill Ward Home</h1>
      <p class="subtitle">Upcoming Activities & Announcements</p>
    </header>

    <section class="calendar-section">
      <HomeCalendar />
      <CreateEvent v-if="canCreateEvent" />
      <UpcomingEvents />
    </section>

    <section class="announcements-section">
      <RecentAnnouncements />
    </section>

    <section class="info-section">
      <h2>Ward Family</h2>
      <div class="card-grid">
        <router-link to="/feed" class="info-card link-card">
          <h3>Ward Scrapbook</h3>
          <p>View photos from recent activities and ward parties!</p>
        </router-link>
        <a href="https://youtube.com/@woodhillwardnsl" target="_blank" class="info-card link-card">
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
          <img src="/src/assets/ward-boundaries.png" alt="Map of Wood Hill Ward boundaries" class="thumbnail" />
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
          <p>Bishop Aaron Smith: (555) 123-4567</p>
          <p>1st Counselor David Jones: (555) 987-6543</p>
        </div>
        <div class="contact-item">
          <strong>Relief Society</strong>
          <p>President Sarah Jenkins: (555) 321-7654</p>
        </div>
        <div class="contact-item">
          <strong>Elders Quorum</strong>
          <p>President Michael Chang: (555) 654-3210</p>
        </div>
      </div>
    </section>

    <div v-if="expandedImage" class="lightbox-overlay" @click="closeLightbox">
      <button class="close-btn" @click.stop="closeLightbox">&times;</button>
      <img :src="expandedImage" alt="Expanded view" class="expanded-img" @click.stop />
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import UpcomingEvents from '@/components/UpcomingEvents.vue'
import HomeCalendar from '../components/HomeCalendar.vue'
import CreateEvent from '@/components/CreateEvent.vue'
import RecentAnnouncements from '@/components/RecentAnnouncements.vue'
import { useUserRole } from '../composables/useUserRole'

const { canCreateEvent } = useUserRole()

// State for the image lightbox
const expandedImage = ref(null)

// Functions to handle opening and closing the maps
const openLightbox = (imageSrc) => {
  expandedImage.value = imageSrc
}

const closeLightbox = () => {
  expandedImage.value = null
}
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
</style>
