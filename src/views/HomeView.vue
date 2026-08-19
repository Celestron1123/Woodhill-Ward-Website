<template>
  <main class="main-view-container">
    <header class="page-header cyber-panel">
      <h1 class="chrome-text">Wood Hill Ward Home</h1>
      <p class="subtitle digital-label">Upcoming Activities & Announcements</p>
    </header>

    <section class="calendar-section">
      <HomeCalendar />
      <CreateEvent v-if="canCreateEvent" />
      <UpcomingEvents />
    </section>

    <section class="announcements-section">
      <RecentAnnouncements />
    </section>

    <section class="info-section cyber-panel">
      <h2 class="chrome-text">Ward Family</h2>
      <div class="card-grid">
        <router-link to="/feed" class="info-card link-card lcd-screen">
          <h3 style="color: var(--liquid-cyan);">Ward Scrapbook</h3>
          <p>View photos from recent activities and ward parties!</p>
        </router-link>
        <a href="https://youtube.com/@woodhillwardnsl" target="_blank" class="info-card link-card lcd-screen">
          <h3 style="color: var(--liquid-cyan);">Ward YouTube</h3>
          <p>Watch sacrament meeting broadcasts and devotional videos.</p>
        </a>
      </div>
    </section>

    <section class="info-section cyber-panel">
      <h2 class="chrome-text">Building Info</h2>
      <div class="card-grid">
        <div class="info-card interactive-card lcd-screen" @click="openLightbox('/src/assets/ward-boundaries.png')">
          <h3 style="color: var(--liquid-cyan);">Ward Boundaries</h3>
          <img src="/src/assets/ward-boundaries.png" alt="Map of Wood Hill Ward boundaries" class="thumbnail acrylic-glass" />
          <p class="click-hint digital-label">TAP TO EXPAND</p>
        </div>
        <div class="info-card interactive-card lcd-screen" @click="openLightbox('/src/assets/building-map.png')">
          <h3 style="color: var(--liquid-cyan);">Building Layout</h3>
          <img src="/src/assets/building-map.png" alt="Layout map of the ward building" class="thumbnail acrylic-glass" />
          <p class="click-hint digital-label">TAP TO EXPAND</p>
        </div>
      </div>
    </section>

    <section class="info-section cyber-panel">
      <h2 class="chrome-text">Ward Leaders</h2>
      <div class="contact-list">
        <div class="contact-item lcd-screen">
          <strong style="color: var(--crt-orange-1);">Bishopric</strong>
          <p>Bishop Aaron Smith: (555) 123-4567</p>
          <p>1st Counselor David Jones: (555) 987-6543</p>
        </div>
        <div class="contact-item lcd-screen">
          <strong style="color: var(--crt-orange-1);">Relief Society</strong>
          <p>President Sarah Jenkins: (555) 321-7654</p>
        </div>
        <div class="contact-item lcd-screen">
          <strong style="color: var(--crt-orange-1);">Elders Quorum</strong>
          <p>President Michael Chang: (555) 654-3210</p>
        </div>
      </div>
    </section>

    <div v-if="expandedImage" class="lightbox-overlay" @click="closeLightbox">
      <button class="close-btn" @click.stop="closeLightbox">[ X ]</button>
      <img :src="expandedImage" alt="Expanded view" class="expanded-img acrylic-glass" @click.stop />
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
/* Y2K Styling */
.main-view-container {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
}

.page-header h1 {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
}

.calendar-section {
  margin-bottom: 2rem;
}

.info-section {
  margin-bottom: 2.5rem;
}

.info-section h2 {
  font-size: 1.5rem;
  border-bottom: 2px solid #555;
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
  display: block;
}

.link-card:hover {
  border-color: var(--liquid-cyan);
  box-shadow: inset 0 0 15px rgba(0, 240, 255, 0.4);
}

.link-card p {
  color: #ccc;
  font-size: 0.95rem;
  margin: 0;
}

/* Map Cards */
.interactive-card {
  cursor: pointer;
}

.interactive-card:hover {
  border-color: var(--liquid-cyan);
  box-shadow: inset 0 0 15px rgba(0, 240, 255, 0.4);
}

.thumbnail {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  margin-bottom: 0.5rem;
}

/* Contact List */
.contact-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  padding: 1rem;
}

.contact-item strong {
  display: block;
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.contact-item p {
  margin: 0.25rem 0;
  color: #ccc;
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
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 30px;
  background: none;
  border: none;
  color: var(--crt-orange-1);
  font-family: 'Lucida Console', monospace;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  line-height: 1;
}

.close-btn:hover {
  color: #fff;
}
</style>
