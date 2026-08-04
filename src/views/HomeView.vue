<template>
    <main class="main-view-container">
        <header class="page-header">
            <h1>Woodhill Ward Home</h1>
            <p class="subtitle">Upcoming Activities & Announcements</p>
        </header>

        <section class="calendar-section">
            <HomeCalendar />
        </section>

    </main>
</template>

<script setup>
// Import the calendar component we just created
import HomeCalendar from '../components/HomeCalendar.vue'

// You can add other home-page specific imports here later, 
// like an AnnouncementsFeed component or QuickLinks.
</script>

<style scoped>
/* Mobile-first styling conforming to the Design Document */
.main-view-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
    font-family: sans-serif;
}

.page-header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eaeaea;
}

.page-header h1 {
    font-size: 2rem;
    color: #2c3e50;
    margin: 0 0 0.5rem 0;
}

.subtitle {
    color: #666;
    font-size: 1.1rem;
    margin: 0;
}

.calendar-section {
    /* Adds a subtle container around the calendar area if desired */
    background: #ffffff;
    border-radius: 8px;
}
</style>