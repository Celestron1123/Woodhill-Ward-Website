<template>
  <main class="main-view-container">
    <header class="page-header">
      <h1>Relief Society</h1>
      <p class="subtitle">Charity Never Faileth</p>
    </header>

    <section class="calendar-section">
      <HomeCalendar filterTag="Relief Society" />
      <UpcomingEvents filterTag="Relief Society" />
    </section>

    <section class="newsletter-section">
      <div class="newsletter-card">
        <div class="newsletter-icon">
          <!-- Document Icon -->
          <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" stroke-width="2" fill="none"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div class="newsletter-content">
          <h3>Monthly Newsletter</h3>
          <p>Read our latest updates, spiritual thoughts, and announcements.</p>
          <a href="/src/assets/August 2026 Newsletter.pdf" target="_blank" class="btn-outline">View Newsletter (PDF)</a>
        </div>
      </div>
    </section>

    <section class="social-section">
      <GroupSocial :tags="['reliefsociety', 'rs']" />
    </section>

    <section class="info-section">
      <h2>Presidency Contacts</h2>
      <div class="contact-list">
        <div class="contact-item">
          <strong>President</strong>
          <p>Sarah Jenkins</p>
          <p>Phone: (555) 321-7654</p>
        </div>
        <div class="contact-item">
          <strong>1st Counselor</strong>
          <p>Emily Carter</p>
          <p>Phone: (555) 321-7655</p>
        </div>
        <div class="contact-item">
          <strong>2nd Counselor</strong>
          <p>Jessica Thompson</p>
          <p>Phone: (555) 321-7656</p>
        </div>
        <div class="contact-item">
          <strong>Secretary</strong>
          <p>Rachel Adams</p>
          <p>Phone: (555) 321-7657</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import HomeCalendar from '@/components/HomeCalendar.vue'
import UpcomingEvents from '@/components/UpcomingEvents.vue'
import GroupSocial from '@/components/GroupSocial.vue'
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
  font-style: italic;
}

.calendar-section {
  background: #ffffff;
  border-radius: 8px;
  margin-bottom: 2rem;
}

/* Newsletter section */
.newsletter-section {
  max-width: 600px;
  margin: 0 auto 2.5rem auto;
  padding: 1rem;
}

.newsletter-card {
  background: #fdfbf7;
  border: 1px solid #e0dcd3;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.newsletter-icon {
  color: #d35400;
  flex-shrink: 0;
}

.newsletter-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #2c3e50;
}

.newsletter-content p {
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.4;
}

.btn-outline {
  display: inline-block;
  padding: 0.5rem 1rem;
  border: 1px solid #d35400;
  color: #d35400;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-outline:hover {
  background-color: #d35400;
  color: white;
}

@media (max-width: 500px) {
  .newsletter-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}

/* Contacts section */
.info-section {
  max-width: 600px;
  margin: 0 auto 2.5rem auto;
  padding: 1rem;
}

.info-section h2 {
  font-size: 1.5rem;
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

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
  color: #2c3e50;
}

.contact-item p {
  margin: 0.25rem 0;
  color: #555;
}
</style>
