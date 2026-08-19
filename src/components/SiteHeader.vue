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
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem;
  /* Glassmorphism / Aero style background */
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.6) 0%,
    rgba(255, 255, 255, 0.3) 49%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.4) 100%
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 
    0 4px 6px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
  z-index: 1000;
}

/* Adjust icon sizes */
.logo-icon {
  height: 45px;
  width: auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
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
  gap: 1rem;
}

/* Text link styling */
.nav-link {
  text-decoration: none;
  color: #0b3d59;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 6px 12px;
  border-radius: 12px;
  transition: all 0.2s ease;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.5);
  box-shadow: inset 0 1px 3px rgba(255, 255, 255, 1), 0 2px 4px rgba(0, 0, 0, 0.1);
  color: #0056b3;
}

.users-link {
  color: #007bff !important;
  font-weight: bold !important;
}

/* Authentication button (Login / My Account) */
.auth-button {
  text-decoration: none;
  background: linear-gradient(180deg, #e6f9ff 0%, #90d5ec 49%, #5cb0d6 50%, #9be5ff 100%);
  color: #0b3d59;
  font-weight: bold;
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border: 1px solid #4a90e2;
  border-radius: 20px;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
  box-shadow: 
    inset 0 1px 2px rgba(255, 255, 255, 0.9),
    0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.auth-button:hover {
  background: linear-gradient(180deg, #ffffff 0%, #a2e2f8 49%, #6fc1e5 50%, #b2eeff 100%);
  box-shadow: 
    inset 0 1px 3px rgba(255, 255, 255, 1),
    0 3px 6px rgba(0, 0, 0, 0.3);
}

/* Hamburger (hidden by default on large screens) */
.hamburger {
  display: none;
  cursor: pointer;
  z-index: 1001;
  color: #0b3d59;
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
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem;
    box-shadow: -2px 5px 15px rgba(0,0,0,0.2);
    z-index: 999;
    overflow-y: auto;
    border-bottom-left-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.8);
  }

  .nav-links.menu-open {
    display: flex;
  }
}
</style>
