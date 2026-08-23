<template>
  <header class="site-header">
    <div class="header-left">
      <router-link to="/home">
        <img src="../assets/header_icon.svg" alt="Home" class="logo-icon" />
      </router-link>
    </div>

    <div class="header-right">
      <nav class="nav-links" :class="{ 'menu-open': isMenuOpen }">
        <router-link to="/young-women" class="nav-link" @click="closeMenu">Young Women</router-link>
        <router-link to="/young-men" class="nav-link" @click="closeMenu">Young Men</router-link>
        <router-link to="/relief-society" class="nav-link" @click="closeMenu">Relief Society</router-link>
        <router-link to="/elders-quorum" class="nav-link" @click="closeMenu">Elders Quorum</router-link>
        <router-link to="/primary" class="nav-link" @click="closeMenu">Primary</router-link>
        <router-link to="/sunday-school" class="nav-link" @click="closeMenu">Sunday School</router-link>
        <router-link to="/feed" class="nav-link" @click="closeMenu">Scrapbook</router-link>
        <router-link v-if="canManageUsers" to="/users" class="nav-link users-link"
          @click="closeMenu">Users</router-link>
      </nav>

      <router-link v-if="isLoggedIn" to="/account" class="auth-button"> My Account </router-link>
      <router-link v-else to="/login" class="auth-button"> Login </router-link>

      <div class="hamburger" @click="toggleMenu">
        <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { useUserRole } from '../composables/useUserRole'

const { canManageUsers } = useUserRole()
const isLoggedIn = ref(false)
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    isLoggedIn.value = !!user
  })
})
</script>

<style scoped>
/* Basic layout styling */
.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--primary-color);
  border-bottom: 4px solid var(--accent-color);
  box-shadow: var(--shadow-md);
  position: relative;
  z-index: 1000;
}

/* Adjust icon sizes */
.logo-icon {
  height: 45px;
  width: auto;
  transition: transform 0.2s ease;
  filter: brightness(0) invert(1);
  /* Makes the SVG icon white */
}

.logo-icon:hover {
  transform: scale(1.05);
}

/* Right navigation flex container */
.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Text link styling */
.nav-link {
  text-decoration: none;
  color: #e2e8f0;
  /* Light gray/white */
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--accent-hover);
}

.router-link-active {
  color: var(--accent-color);
  font-weight: 700;
}

.users-link {
  color: white !important;
  /* Gold/yellow for special link in dark mode */
}

/* Authentication button */
.auth-button {
  text-decoration: none;
  background-color: var(--accent-color);
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.5rem 1.2rem;
  border-radius: var(--radius-md);
  transition:
    background-color 0.2s ease,
    transform 0.1s ease;
}

.auth-button:hover {
  background-color: var(--accent-hover);
  color: white;
}

.auth-button:active {
  transform: translateY(1px);
}

/* Hamburger (hidden by default on large screens) */
.hamburger {
  display: none;
  cursor: pointer;
  z-index: 1001;
  color: white;
}

/* Responsive Styles */
@media (max-width: 1100px) {
  .hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    width: 250px;
    height: auto;
    max-height: calc(100vh - 78px);
    background-color: var(--primary-color);
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem;
    box-shadow: var(--shadow-md);
    z-index: 999;
    overflow-y: auto;
    border-bottom-left-radius: var(--radius-md);
    border-left: 1px solid var(--secondary-color);
    border-bottom: 1px solid var(--secondary-color);
  }

  .nav-links.menu-open {
    display: flex;
  }

  .nav-link {
    width: 100%;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--secondary-color);
  }

  .nav-link:last-child {
    border-bottom: none;
  }
}
</style>
