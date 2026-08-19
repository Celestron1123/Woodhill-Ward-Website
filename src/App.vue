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
/* Global Y2K & Hardware Skeuomorphic Variables */
:root {
  /* Color Palette */
  --titanium-1: #2c3238;
  --titanium-2: #454d55;
  --titanium-3: #1a1d20;
  
  --cyber-chrome: linear-gradient(180deg, #f0f4f8 0%, #b8c6db 45%, #6a7b8c 50%, #dbe5ef 55%, #ffffff 100%);
  --xp-blue-1: #0055ea;
  --xp-blue-2: #2463e0;
  --xp-blue-3: #003bb3;
  
  --bio-green-1: #39ff14;
  --bio-green-2: #00e676;
  --liquid-cyan: #00f0ff;
  
  --crt-orange-1: #ffb703;
  --crt-orange-2: #ff7700;

  /* Textures */
  --scanline-bg: repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, transparent 1px, transparent 2px);
  
  /* Shared Components */
  --bevel-inset: inset 2px 2px 4px rgba(0, 0, 0, 0.8), inset -1px -1px 2px rgba(255, 255, 255, 0.2);
  --gel-btn: linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.2) 51%, rgba(0,0,0,0.4) 100%);
}

body {
  margin: 0;
  font-family: 'Tahoma', 'Trebuchet MS', 'Verdana', 'Lucida Console', monospace;
  background-color: var(--titanium-3);
  background-image: var(--scanline-bg);
  color: #e0e0e0;
}

.page-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Global utility classes for hardware aesthetics */
.cyber-panel {
  background-color: var(--titanium-1);
  background-image: var(--scanline-bg);
  border: 2px solid;
  border-color: #ffffff #555 #333 #ffffff;
  position: relative;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.cyber-panel::before,
.cyber-panel::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle, #ccc, #666);
  box-shadow: inset 1px 1px 2px rgba(255,255,255,0.5), inset -1px -1px 2px rgba(0,0,0,0.8);
}
.cyber-panel::before {
  top: 6px; left: 6px;
}
.cyber-panel::after {
  bottom: 6px; right: 6px;
}

/* Speaker Grille */
.speaker-grille {
  background: radial-gradient(circle, #111 1.5px, transparent 1.5px) 0 0 / 4px 4px;
}

/* Sunken LCD Display */
.lcd-screen {
  background: #0a0a0a;
  border: 2px solid;
  border-color: #333 #ffffff #ffffff #333;
  box-shadow: inset 0 0 15px rgba(0, 240, 255, 0.15);
  color: var(--liquid-cyan);
  padding: 1rem;
}

/* Chrome Text Effect */
.chrome-text {
  background: var(--cyber-chrome);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(1px 1px 0px #000);
}

/* Gel Button */
.aqua-btn {
  background: var(--xp-blue-1);
  background-image: var(--gel-btn);
  border: 1px solid #002266;
  border-radius: 20px;
  color: #fff;
  font-weight: bold;
  padding: 0.5rem 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.8);
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s;
}
.aqua-btn:active {
  transform: translateY(2px);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.8);
}

/* Input Fields */
.cyber-input {
  background: #111;
  color: var(--liquid-cyan);
  border: 2px solid;
  border-color: #333 #aaa #aaa #333;
  box-shadow: var(--bevel-inset);
  padding: 0.5rem;
  font-family: 'Lucida Console', monospace;
  outline: none;
}
.cyber-input:focus {
  box-shadow: var(--bevel-inset), 0 0 5px var(--liquid-cyan);
  border-color: var(--liquid-cyan);
}

/* Digital Labels */
.digital-label {
  font-family: 'Lucida Console', monospace;
  color: var(--crt-orange-1);
  background: #000;
  padding: 2px 6px;
  font-size: 0.8rem;
  border: 1px solid var(--crt-orange-2);
  display: inline-block;
}

.acrylic-glass {
  border: 4px solid;
  border-color: #ffffff #aaa #888 #ffffff;
  box-shadow: inset 2px 2px 5px rgba(0,0,0,0.5), 2px 2px 10px rgba(0,240,255,0.2);
  border-radius: 4px;
}

.jumper-pill {
  padding: 2px 8px;
  background-color: #222;
  color: #fff;
  font-family: 'Lucida Console', monospace;
  font-size: 0.8rem;
  font-weight: bold;
  border: 2px solid #111;
  border-bottom-color: #555;
  border-right-color: #555;
  box-shadow: 2px 2px 3px rgba(0,0,0,0.8);
  text-transform: uppercase;
}
</style>
