<template>
  <main class="main-view-container">
    <header class="page-header">
      <h1>Young Men</h1>
      <p class="subtitle">Duty to God</p>
    </header>

    <section class="calendar-section">
      <HomeCalendar filterTag="Young Men" />
      <UpcomingEvents filterTag="Young Men" />
    </section>

    <section class="newsletter-section">
      <div class="newsletter-card">
        <div class="newsletter-icon">
          <!-- Document Icon -->
          <svg
            viewBox="0 0 24 24"
            width="48"
            height="48"
            stroke="currentColor"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
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
          <a href="#" class="btn-outline" @click.prevent="alertPlaceholder"
            >View Newsletter (PDF)</a
          >
        </div>
      </div>
    </section>

    <section class="social-section">
      <GroupSocial :tags="['youngmen', 'ym']" />
    </section>

    <section class="info-section">
      <h2>Presidency Contacts</h2>
      <div class="contact-list">
        <div class="contact-item">
          <strong>President</strong>
          <p>Mark Davidson</p>
          <p>Phone: (555) 521-1111</p>
        </div>
        <div class="contact-item">
          <strong>1st Counselor</strong>
          <p>Jason Lee</p>
          <p>Phone: (555) 521-2222</p>
        </div>
        <div class="contact-item">
          <strong>2nd Counselor</strong>
          <p>Tyler Jackson</p>
          <p>Phone: (555) 521-3333</p>
        </div>
        <div class="contact-item">
          <strong>Secretary</strong>
          <p>Ben Stokes</p>
          <p>Phone: (555) 521-4444</p>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import HomeCalendar from '@/components/HomeCalendar.vue'
import UpcomingEvents from '@/components/UpcomingEvents.vue'
import GroupSocial from '@/components/GroupSocial.vue'

const alertPlaceholder = () => {
  alert('Newsletter PDF functionality coming soon!')
}
</script>

<style scoped>
/* Mobile-first styling conforming to the Design Document */
.main-view-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.page-header h1 {
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  color: var(--primary-color);
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.2rem;
  margin: 0;
  font-style: italic;
}

.calendar-section {
  background: var(--surface-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  margin-bottom: 3rem;
  border: 1px solid var(--border-color);
}

/* Newsletter section */
.newsletter-section {
  max-width: 800px;
  margin: 0 auto 3rem auto;
}

.newsletter-card {
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.newsletter-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--accent-color);
}

.newsletter-icon {
  color: var(--accent-color);
  flex-shrink: 0;
}

.newsletter-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.4rem;
  color: var(--primary-color);
}

.newsletter-content p {
  margin: 0 0 1.25rem 0;
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.5;
}

.btn-outline {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  border: 2px solid var(--accent-color);
  color: var(--accent-color);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.btn-outline:hover {
  background-color: var(--accent-color);
  color: white;
}

@media (max-width: 600px) {
  .newsletter-card {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
}

/* Social section */
.social-section {
  margin-bottom: 3rem;
}

/* Contacts section */
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
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
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
</style>
