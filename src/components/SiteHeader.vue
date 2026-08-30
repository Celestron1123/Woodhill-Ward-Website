<template>
  <header class="site-header">
    <div class="header-left">
      <router-link to="/home" class="logo-link">
        <img src="../assets/header_icon.svg" alt="Home" class="logo-icon" />
        <span class="ward-title">Wood Hill Ward</span>
      </router-link>
    </div>

    <div class="header-right">
      <nav class="nav-links" :class="{ 'menu-open': isMenuOpen }">
        <router-link to="/young-women" class="nav-link" @click="closeMenu">Young Women</router-link>
        <router-link to="/young-men" class="nav-link" @click="closeMenu">Young Men</router-link>
        <router-link to="/relief-society" class="nav-link" @click="closeMenu"
          >Relief Society</router-link
        >
        <router-link to="/elders-quorum" class="nav-link" @click="closeMenu"
          >Elders Quorum</router-link
        >
        <router-link to="/primary" class="nav-link" @click="closeMenu">Primary</router-link>
        <router-link to="/sunday-school" class="nav-link" @click="closeMenu"
          >Sunday School</router-link
        >
        <router-link to="/feed" class="nav-link" @click="closeMenu">Scrapbook</router-link>
        <router-link
          v-if="canManageUsers"
          to="/users"
          class="nav-link users-link"
          @click="closeMenu"
          >Users</router-link
        >
      </nav>

      <router-link v-if="isLoggedIn" to="/account" class="auth-button"> My Account </router-link>
      <router-link v-else to="/login" class="auth-button"> Login </router-link>

      <div class="hamburger" @click="toggleMenu">
        <svg
          v-if="!isMenuOpen"
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
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
.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.ward-title {
  color: white;
  font-family: 'Merriweather', serif;
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.logo-icon {
  height: 45px;
  width: auto;
  transition: transform 0.2s ease;
  filter: brightness(0) invert(1);
  /* Makes the SVG icon white */
}

.logo-link:hover .logo-icon {
  transform: scale(1.1) rotate(-5deg);
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
  transition: color 0.3s ease, transform 0.2s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: var(--accent-color);
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: white;
  transform: translateY(-1px);
}

.nav-link:hover::after {
  width: 100%;
}

.router-link-active {
  color: var(--accent-color);
  font-weight: 700;
}

.router-link-active::after {
  width: 100%;
}

.users-link {
  color: white !important;
  /* Gold/yellow for special link in dark mode */
}

/* Authentication button */
.auth-button {
  text-decoration: none;
  background: linear-gradient(135deg, var(--accent-color) 0%, #e87b55 100%);
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.5rem 1.2rem;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 6px rgba(209, 107, 71, 0.25);
  transition: all 0.3s ease;
}

.auth-button:hover {
  background: linear-gradient(135deg, var(--accent-hover) 0%, var(--accent-color) 100%);
  color: white;
  box-shadow: 0 6px 12px rgba(209, 107, 71, 0.4);
  transform: translateY(-2px);
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
    display: flex;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    width: 100%;
    height: auto;
    background-color: var(--primary-color);
    flex-direction: column;
    align-items: center;
    padding: 0;
    box-shadow: 0 10px 20px -5px rgba(0,0,0,0.2);
    z-index: 999;
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.3s ease, padding 0.3s ease;
    border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  }

  .nav-links.menu-open {
    max-height: 600px;
    padding: 1rem 0;
    border-top: 1px solid rgba(255,255,255,0.05);
  }

  .nav-link {
    width: 100%;
    padding: 1rem 2rem;
    text-align: center;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    font-size: 1.1rem;
    color: white;
  }

  .nav-link:last-child {
    border-bottom: none;
  }

  .nav-link::after {
    display: none;
  }
}

@media (max-width: 600px) {
  .site-header {
    padding: 0.75rem 1rem;
  }

  .logo-icon {
    height: 32px;
  }

  .ward-title {
    font-size: 1rem;
    letter-spacing: 0;
  }

  .logo-link {
    gap: 0.5rem;
  }

  .auth-button {
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
  }

  .header-right {
    gap: 0.75rem;
  }
}
</style>
