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
.page-content {
  /* Let page-content take up remaining space if needed */
  min-height: calc(100vh - 70px);
}
</style>
