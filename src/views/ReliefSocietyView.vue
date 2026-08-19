<template>
  <main class="main-view-container">
    <header class="page-header cyber-panel">
      <h1 class="chrome-text">Relief Society</h1>
      <p class="subtitle digital-label">Charity Never Faileth</p>
    </header>

    <section class="calendar-section">
      <HomeCalendar filterTag="Relief Society" />
      <UpcomingEvents filterTag="Relief Society" />
    </section>

    <section class="newsletter-section">
      <div class="newsletter-card cyber-panel">
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
          <h3 style="color: var(--liquid-cyan);">Monthly Newsletter</h3>
          <p>Read our latest updates, spiritual thoughts, and announcements.</p>
          <a href="/src/assets/August 2026 Newsletter.pdf" class="aqua-btn" style="text-decoration:none;">View Newsletter (PDF)</a>
        </div>
      </div>
    </section>

    <section class="social-section">
      <GroupSocial :tags="['reliefsociety', 'rs']" />
    </section>

    <section class="info-section cyber-panel">
      <h2 class="chrome-text">Presidency Contacts</h2>
      <div class="contact-list">
        <div class="contact-item lcd-screen">
          <strong style="color: var(--crt-orange-1);">President</strong>
          <p>Sarah Jenkins</p>
          <p>Phone: (555) 321-7654</p>
        </div>
        <div class="contact-item lcd-screen">
          <strong style="color: var(--crt-orange-1);">1st Counselor</strong>
          <p>Emily Carter</p>
          <p>Phone: (555) 321-7655</p>
        </div>
        <div class="contact-item lcd-screen">
          <strong style="color: var(--crt-orange-1);">2nd Counselor</strong>
          <p>Jessica Thompson</p>
          <p>Phone: (555) 321-7656</p>
        </div>
        <div class="contact-item lcd-screen">
          <strong style="color: var(--crt-orange-1);">Secretary</strong>
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
.main-view-container { max-width: 800px; margin: 0 auto; }
.page-header { text-align: center; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 1px solid #555; }
.page-header h1 { font-size: 2rem; margin: 0 0 0.5rem 0; }
.subtitle { margin: 0; }
.calendar-section { margin-bottom: 2rem; }
.newsletter-section { max-width: 600px; margin: 0 auto 2.5rem auto; }
.newsletter-card { display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; }
.newsletter-icon { color: var(--crt-orange-1); flex-shrink: 0; }
.newsletter-content h3 { margin: 0 0 0.5rem 0; font-size: 1.25rem; }
.newsletter-content p { margin: 0 0 1rem 0; color: #ccc; font-size: 0.95rem; line-height: 1.4; }
@media (max-width: 500px) { .newsletter-card { flex-direction: column; text-align: center; gap: 1rem; } }
.info-section { max-width: 600px; margin: 0 auto 2.5rem auto; }
.info-section h2 { font-size: 1.5rem; border-bottom: 2px solid #555; padding-bottom: 0.5rem; margin-bottom: 1rem; }
.contact-list { display: flex; flex-direction: column; gap: 1rem; }
.contact-item { padding: 1rem; }
.contact-item strong { display: block; font-size: 1.1rem; margin-bottom: 0.25rem; }
.contact-item p { margin: 0.25rem 0; color: #ccc; }
</style>
