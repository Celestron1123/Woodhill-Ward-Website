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
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
  color: #0b3d59;
}

.page-header {
  text-align: center;
  margin-bottom: 2.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.8);
}

.page-header h1 {
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  text-shadow: 1px 1px 3px rgba(255, 255, 255, 1);
}

.subtitle {
  color: #3b7496;
  font-size: 1.2rem;
  margin: 0;
  font-weight: bold;
}

.calendar-section, .announcements-section {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  padding: 1.5rem;
}

.info-section {
  margin-bottom: 2.5rem;
}

.info-section h2 {
  font-size: 1.8rem;
  color: #0056b3;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
  border-bottom: 2px solid rgba(255, 255, 255, 0.6);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

/* Grid for Cards - Mobile First (1 column), then 2 columns on larger screens */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 600px) {
  .card-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.info-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(220, 240, 255, 0.4) 100%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1), inset 0 2px 5px rgba(255, 255, 255, 0.8);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), inset 0 2px 5px rgba(255, 255, 255, 1);
}

.info-card h3 {
  margin-top: 0;
  margin-bottom: 0.8rem;
  font-size: 1.3rem;
  color: #0056b3;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
}

/* Link Cards */
.link-card {
  text-decoration: none;
  color: inherit;
  display: block;
}

.link-card p {
  color: #446b85;
  font-size: 1rem;
  margin: 0;
}

/* Map Cards */
.interactive-card {
  cursor: pointer;
}

.thumbnail {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.8rem;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.click-hint {
  font-size: 0.9rem;
  color: #007bff;
  margin: 0;
  font-weight: bold;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
}

/* Contact List */
.contact-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 600px) {
  .contact-list {
    grid-template-columns: 1fr 1fr;
  }
}

.contact-item {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(220, 240, 255, 0.4) 100%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 1.2rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1), inset 0 2px 5px rgba(255, 255, 255, 0.8);
}

.contact-item strong {
  display: block;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #0056b3;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
}

.contact-item p {
  margin: 0.3rem 0;
  color: #446b85;
}

/* Lightbox Overlay Styles */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(173, 216, 230, 0.6);
  backdrop-filter: blur(15px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.expanded-img {
  max-width: 90%;
  max-height: 90%;
  border-radius: 12px;
  border: 3px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
}

.close-btn {
  position: absolute;
  top: 30px;
  right: 40px;
  background: rgba(255, 255, 255, 0.5);
  border: 2px solid white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: #0b3d59;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: white;
  transform: scale(1.1);
}
</style>
