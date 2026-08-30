<template>
  <main class="main-view-container">
    <header class="page-header hero-header">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>Wood Hill Ward Home</h1>
        <p class="subtitle">Upcoming Activities and Announcements</p>
      </div>
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
          <div class="img-wrapper">
            <img src="/src/assets/ward-boundaries.png" alt="Map of Wood Hill Ward boundaries" class="thumbnail" />
            <div class="img-overlay"><span>🔍 View Map</span></div>
          </div>
          <p class="click-hint">Tap to expand map</p>
        </div>
        <div class="info-card interactive-card" @click="openLightbox('/src/assets/building-map.jpg')">
          <h3>Building Layout</h3>
          <div class="img-wrapper">
            <img src="/src/assets/building-map.jpg" alt="Layout map of the ward building" class="thumbnail" />
            <div class="img-overlay"><span>🔍 View Map</span></div>
          </div>
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header.hero-header {
  position: relative;
  text-align: center;
  margin-bottom: 3rem;
  padding: 5rem 1rem;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-image: url('https://images.unsplash.com/photo-1723596331257-25437c6d658b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
  color: white;
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

@media (max-width: 768px) {
  .page-header.hero-header {
    padding: 2.5rem 1rem;
  }
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(38, 56, 74, 0.85) 0%, rgba(38, 56, 74, 0.4) 100%);
  backdrop-filter: blur(1px);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.page-header h1 {
  font-size: 3rem;
  margin: 0 0 0.5rem 0;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  color: #e2e8f0;
  font-size: 1.3rem;
  margin: 0;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.calendar-section {
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 3rem;
  border: 1px solid rgba(227, 222, 201, 0.5);
}

.announcements-section,
.info-section {
  margin-bottom: 3rem;
}

.info-section h2 {
  font-size: 1.8rem;
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
  color: var(--primary-color);
}

/* Grid for Cards - Mobile First (1 column), then 2 columns on larger screens */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.info-card {
  background: var(--surface-color);
  border: 1px solid rgba(227, 222, 201, 0.5);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    box-shadow 0.3s ease;
}

.info-card h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.3rem;
  color: var(--primary-color);
}

/* Link Cards */
.link-card {
  text-decoration: none;
  color: inherit;
  display: block;
}

.link-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.15);
  border-color: var(--accent-color);
}

.link-card p {
  color: var(--text-secondary);
  font-size: 1rem;
  margin: 0;
}

/* Map Cards */
.interactive-card {
  cursor: pointer;
  overflow: hidden;
}

.interactive-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.15);
  border-color: var(--accent-color);
}

.img-wrapper {
  position: relative;
  width: 100%;
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
}

.thumbnail {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.interactive-card:hover .thumbnail {
  transform: scale(1.05);
}

.img-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(38, 56, 74, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.img-overlay span {
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 9999px;
  backdrop-filter: blur(2px);
  transform: translateY(10px);
  transition: transform 0.3s ease;
}

.interactive-card:hover .img-overlay {
  opacity: 1;
}

.interactive-card:hover .img-overlay span {
  transform: translateY(0);
}

.click-hint {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
}

/* Contact List */
.contact-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .contact-list {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

.contact-item {
  background: var(--surface-color);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(227, 222, 201, 0.5);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
}

.contact-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -8px rgba(0, 0, 0, 0.15);
}

.contact-item strong {
  display: block;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.contact-item p {
  margin: 0.25rem 0;
  color: var(--text-secondary);
}

/* Lightbox Overlay Styles */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.expanded-img {
  max-width: 90%;
  max-height: 90%;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 30px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
