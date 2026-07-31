<template>
  <SiteHeader />

  <main class="page-content">
    <RouterView />
  </main>
</template>

<script setup>
import { RouterView } from 'vue-router';
import SiteHeader from './components/SiteHeader.vue';
</script>

<style>
/* Optional: We use global styles (no 'scoped' tag) here 
  to reset margins so the header touches the edges of the screen 
*/
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.page-content {
  /* Adds breathing room around the active page */
  padding: 2rem;
}
</style>