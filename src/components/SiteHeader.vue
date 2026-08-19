<template>
  <header class="site-header cyber-panel">
    <!-- OS Title Bar Candy Buttons -->
    <div class="window-controls">
      <div class="candy-btn close"></div>
      <div class="candy-btn minimize"></div>
      <div class="candy-btn maximize"></div>
    </div>

    <div class="header-content">
      <div class="header-left">
        <router-link to="/home" class="logo-link">
          <img src="../assets/header_icon.svg" alt="Home" class="logo-icon" />
          <span class="digital-label led-container">
            <span class="led-blinker"></span>
            SYS_ONLINE
          </span>
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

        <router-link v-if="isLoggedIn" to="/account" class="auth-button aqua-btn">
          My Account
        </router-link>
        <router-link v-else to="/login" class="auth-button aqua-btn">
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
/* SiteHeader Layout */
.site-header {
  padding: 2rem 1.5rem 1rem 1.5rem;
  margin-bottom: 2rem;
  background: linear-gradient(180deg, #2463e0 0%, #003bb3 100%);
  border-color: #5b8fb9 #001a4d #001a4d #5b8fb9;
  z-index: 1000;
}

.window-controls {
  position: absolute;
  top: 6px;
  right: 12px;
  display: flex;
  gap: 6px;
}

.candy-btn {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.5);
  box-shadow: inset 2px 2px 4px rgba(255,255,255,0.8), 1px 1px 2px rgba(0,0,0,0.4);
}
.candy-btn.close { background: radial-gradient(circle at 30% 30%, #ff5c5c, #c00000); }
.candy-btn.minimize { background: radial-gradient(circle at 30% 30%, #ffbd4c, #c08000); }
.candy-btn.maximize { background: radial-gradient(circle at 30% 30%, #00ca4e, #00802b); }

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--titanium-2);
  border: 2px solid;
  border-color: #888 #222 #222 #888;
  padding: 0.5rem 1rem;
  box-shadow: var(--bevel-inset);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
}

.logo-icon {
  height: 45px;
  width: auto;
  filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.5));
}

.led-container {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #051a05;
  color: var(--bio-green-1);
  border-color: var(--bio-green-2);
}

.led-blinker {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--bio-green-1);
  box-shadow: 0 0 5px var(--bio-green-1), 0 0 10px var(--bio-green-2);
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
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

/* Metallic Extruded Nav Links */
.nav-link {
  text-decoration: none;
  color: #fff;
  font-family: 'Tahoma', sans-serif;
  font-weight: bold;
  font-size: 0.85rem;
  text-transform: uppercase;
  padding: 0.4rem 0.8rem;
  background: linear-gradient(180deg, #66707a 0%, #454d55 100%);
  border: 1px solid #222;
  border-top-color: #888;
  border-left-color: #888;
  box-shadow: 2px 2px 3px rgba(0,0,0,0.5);
  transition: all 0.1s;
}

.nav-link:active, .nav-link.router-link-active {
  background: linear-gradient(180deg, #333 0%, #454d55 100%);
  border-color: #222 #888 #888 #222;
  box-shadow: inset 2px 2px 4px rgba(0,0,0,0.8);
  transform: translateY(2px);
  color: var(--liquid-cyan);
}

.users-link {
  color: var(--crt-orange-1) !important;
}

.auth-button {
  text-decoration: none;
}

/* Hamburger (hidden by default on large screens) */
.hamburger {
  display: none;
  cursor: pointer;
  z-index: 1001;
  color: #fff;
  background: var(--titanium-1);
  border: 1px solid #888;
  padding: 4px;
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
    background-color: var(--titanium-1);
    border: 2px solid #555;
    flex-direction: column;
    align-items: stretch;
    padding: 1rem;
    box-shadow: -2px 5px 15px rgba(0,0,0,0.8);
    z-index: 999;
  }

  .nav-links.menu-open {
    display: flex;
  }
  
  .nav-link {
    text-align: center;
  }
}
</style>
