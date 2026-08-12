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
        <router-link to="/feed" class="nav-link" @click="closeMenu">Social</router-link>
        <router-link
          v-if="canManageUsers"
          to="/users"
          class="nav-link users-link"
          @click="closeMenu"
        >Users</router-link>
      </nav>

      <router-link v-if="isLoggedIn" to="/account" class="auth-button">
        My Account
      </router-link>
      <router-link v-else to="/login" class="auth-button">
        Login
      </router-link>

      <div class="hamburger" @click="toggleMenu">
        <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
  /* Pushes left and right sections apart */
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  /* Light border to separate from content */
  border-bottom: 1px solid #eaeaea;
  position: relative;
  z-index: 1000;
}

/* Adjust icon sizes */
.logo-icon {
  height: 45px;
  width: auto;
}

.login-icon {
  height: 35px;
  width: auto;
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
  color: #333333;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.nav-link:hover {
  /* A generic highlight color, adjust as needed */
  color: #5b8fb9;
}

.users-link {
  color: #007bff !important;
  font-weight: bold !important;
}

/* Authentication button (Login / My Account) */
.auth-button {
  text-decoration: none;
  color: #333333;
  font-weight: bold;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border: 1px solid #eaeaea;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.auth-button:hover {
  background-color: #f8f9fa;
  color: #5b8fb9;
}

/* Hamburger (hidden by default on large screens) */
.hamburger {
  display: none;
  cursor: pointer;
  z-index: 1001;
  color: #333333;
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
    background-color: #ffffff;
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem;
    box-shadow: -2px 5px 5px rgba(0,0,0,0.1);
    z-index: 999;
    overflow-y: auto;
  }

  .nav-links.menu-open {
    display: flex;
  }
}
</style>
