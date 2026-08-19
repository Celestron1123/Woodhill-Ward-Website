<template>
  <SiteHeader />

  <main class="page-content">
    <RouterView />
  </main>
</template>

<script setup>
import { RouterView } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Trebuchet+MS:ital,wght@0,400;0,700;1,400&display=swap');

body {
  margin: 0;
  /* Frutiger Aero typical fonts: Trebuchet MS, Arial, sans-serif */
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  /* Iconic glossy aero background: blue to green with light flares */
  background: 
    radial-gradient(circle at 15% 50%, rgba(255, 255, 255, 0.4), transparent 50%),
    radial-gradient(circle at 85% 30%, rgba(173, 216, 230, 0.6), transparent 50%),
    linear-gradient(135deg, #a4e5ff 0%, #d4f0ff 30%, #e8f9e9 60%, #a4e5bb 100%);
  background-attachment: fixed;
  color: #113344;
  min-height: 100vh;
  overflow-x: hidden;
}

/* Adds a decorative bubble overlay to the background */
body::before {
  content: "";
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 2%, transparent 3%),
    radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 3%, transparent 4%),
    radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 2%, transparent 3%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.2) 1.5%, transparent 2.5%);
  pointer-events: none;
  z-index: -1;
}

.page-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 80px);
}

/* Global button styling to match Frutiger Aero */
button, .button-aero {
  background: linear-gradient(180deg, #e6f9ff 0%, #90d5ec 49%, #5cb0d6 50%, #9be5ff 100%);
  border: 1px solid #4a90e2;
  border-radius: 20px;
  color: #0b3d59;
  font-weight: bold;
  padding: 8px 16px;
  font-size: 14px;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
  box-shadow: 
    inset 0 1px 2px rgba(255, 255, 255, 0.9),
    0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

button:hover, .button-aero:hover {
  background: linear-gradient(180deg, #ffffff 0%, #a2e2f8 49%, #6fc1e5 50%, #b2eeff 100%);
  box-shadow: 
    inset 0 1px 3px rgba(255, 255, 255, 1),
    0 3px 6px rgba(0, 0, 0, 0.3);
}

button:active, .button-aero:active {
  background: linear-gradient(180deg, #9be5ff 0%, #5cb0d6 49%, #90d5ec 50%, #e6f9ff 100%);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Global Card Styling (Glassmorphism / Glossy) */
.card-aero, .card, form {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 15px;
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  padding: 20px;
  margin-bottom: 20px;
}

/* Inputs and textareas */
input, textarea, select {
  background: linear-gradient(180deg, #f0f0f0 0%, #ffffff 100%);
  border: 1px solid #aabcc8;
  border-radius: 8px;
  padding: 8px 12px;
  font-family: inherit;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  color: #333;
}
input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: #6fc1e5;
  box-shadow: 0 0 8px rgba(111, 193, 229, 0.6), inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Links */
a {
  color: #0b5394;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
  color: #3d85c6;
}

/* Scrollbars */
::-webkit-scrollbar {
  width: 12px;
}
::-webkit-scrollbar-track {
  background: #d4f0ff; 
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, #90d5ec, #5cb0d6); 
  border-radius: 10px;
  border: 2px solid #d4f0ff;
}
::-webkit-scrollbar-thumb:hover {
  background: #4a90e2; 
}

/* GLOBAL AERO OVERRIDES FOR ALL VIEWS */
.main-view-container, .feed-container {
  max-width: 900px !important;
  color: #0b3d59 !important;
}

.page-header {
  background: rgba(255, 255, 255, 0.4) !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(255, 255, 255, 0.7) !important;
  border-radius: 20px !important;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.8) !important;
  border-bottom: none !important;
}

.page-header h1 {
  color: #0056b3 !important;
  text-shadow: 1px 1px 3px rgba(255, 255, 255, 1) !important;
}

.subtitle {
  color: #3b7496 !important;
  font-weight: bold !important;
}

.calendar-section, .announcements-section, .newsletter-section {
  background: rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  border-radius: 20px !important;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.9) !important;
  padding: 1.5rem !important;
  margin-bottom: 2rem !important;
}

.info-card, .contact-item, .newsletter-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(220, 240, 255, 0.4) 100%) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  border: 1px solid rgba(255, 255, 255, 0.9) !important;
  border-radius: 15px !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1), inset 0 2px 5px rgba(255, 255, 255, 0.8) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease !important;
}

.info-card:hover, .newsletter-card:hover {
  transform: translateY(-5px) !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), inset 0 2px 5px rgba(255, 255, 255, 1) !important;
}

.info-section h2, .contact-item strong, .info-card h3, .newsletter-content h3 {
  color: #0056b3 !important;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8) !important;
}

.btn-outline, .btn-primary {
  background: linear-gradient(180deg, #e6f9ff 0%, #90d5ec 49%, #5cb0d6 50%, #9be5ff 100%) !important;
  border: 1px solid #4a90e2 !important;
  border-radius: 20px !important;
  color: #0b3d59 !important;
  font-weight: bold !important;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8) !important;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.9), 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}

.btn-outline:hover, .btn-primary:hover {
  background: linear-gradient(180deg, #ffffff 0%, #a2e2f8 49%, #6fc1e5 50%, #b2eeff 100%) !important;
  box-shadow: inset 0 1px 3px rgba(255, 255, 255, 1), 0 3px 6px rgba(0, 0, 0, 0.3) !important;
  color: #0b3d59 !important;
}

</style>
