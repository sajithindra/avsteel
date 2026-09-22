<script setup lang="ts">
import { ref, computed } from 'vue'
import { PORTFOLIO_MODELS, type PortfolioModelItem } from '../data/portfolioData'

const activeFilter = ref<'ALL' | 'SDS2'>('ALL')
const activeFullscreenModel = ref<PortfolioModelItem | null>(null)

const filteredModels = computed(() => {
  if (activeFilter.value === 'SDS2') {
    return PORTFOLIO_MODELS.filter(m => m.software.includes('SDS/2'))
  }
  return PORTFOLIO_MODELS
})

const openFullscreen = (item: PortfolioModelItem) => {
  activeFullscreenModel.value = item
  document.body.style.overflow = 'hidden'
}

const closeFullscreen = () => {
  activeFullscreenModel.value = null
  document.body.style.overflow = ''
}
</script>

<template>
  <section id="portfolio" class="portfolio-section">
    <div class="container">
      <div class="section-header text-center reveal-on-scroll">
        <span class="badge badge-hero">3D WebGL BIM Engine</span>
        <h2 class="section-title text-light">Interactive 3D Steel Model Portfolio</h2>
        <p class="section-subtitle text-slate-300">
          Rotate, zoom, and inspect real SDS/2 & Tekla 3D BIM engineering models directly in your browser.
        </p>
      </div>

      <!-- Filter Controls Bar -->
      <div class="portfolio-filter-bar reveal-on-scroll stagger-1">
        <button
          class="filter-tab-btn"
          :class="{ active: activeFilter === 'ALL' }"
          @click="activeFilter = 'ALL'"
        >
          All 3D Models ({{ PORTFOLIO_MODELS.length }})
        </button>
        <button
          class="filter-tab-btn"
          :class="{ active: activeFilter === 'SDS2' }"
          @click="activeFilter = 'SDS2'"
        >
          SDS/2 BIM Models
        </button>
      </div>

      <!-- 3D Models Grid -->
      <div class="models-grid reveal-on-scroll stagger-2">
        <div
          v-for="item in filteredModels"
          :key="item.id"
          class="tech-model-card"
        >
          <div class="viewport-box">
            <!-- WebGL 3D Model Viewer Context -->
            <model-viewer
              :src="item.modelUrl"
              :alt="item.title"
              loading="eager"
              camera-controls
              enable-pan
              bounds="tight"
              auto-rotate
              auto-rotate-delay="500"
              rotation-per-second="12deg"
              shadow-intensity="1.2"
              exposure="1.15"
              touch-action="pan-y"
              interaction-prompt="none"
              class="model-viewport"
            ></model-viewer>

            <!-- Floating Top Badges -->
            <div class="top-overlay-row">
              <span class="software-badge-glass">{{ item.software }}</span>
              <button
                class="fullscreen-icon-btn"
                @click="openFullscreen(item)"
                title="Expand to 4K Fullscreen Viewer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" width="16" height="16">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                </svg>
              </button>
            </div>

            <!-- Bottom Information Dock Bar -->
            <div class="model-info-dock">
              <div class="dock-title-block">
                <span class="model-title-text">{{ item.title }}</span>
                <span class="rotate-tag">
                  <span class="active-pulse"></span> 3D Rotatable
                </span>
              </div>
              <button class="btn btn-outline-hero btn-xs" @click="openFullscreen(item)">Inspect 3D</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Fullscreen WebGL HUD Modal -->
      <Transition name="modal">
        <div v-if="activeFullscreenModel" class="fullscreen-backdrop" @click.self="closeFullscreen">
          <div class="fullscreen-container">
            <!-- Top HUD Bar -->
            <div class="hud-header">
              <div class="hud-title-box">
                <span class="hud-tag">{{ activeFullscreenModel.software }}</span>
                <h3 class="hud-title">{{ activeFullscreenModel.title }}</h3>
              </div>
              <button class="hud-close-btn" @click="closeFullscreen" aria-label="Close Fullscreen View">
                <span class="material-symbols-outlined icon-sm">close</span>
              </button>
            </div>

            <!-- Dedicated High-Res 3D Viewport -->
            <div class="fullscreen-viewport-wrapper">
              <model-viewer
                :src="activeFullscreenModel.modelUrl"
                :alt="activeFullscreenModel.title"
                loading="eager"
                camera-controls
                enable-pan
                bounds="tight"
                auto-rotate
                auto-rotate-delay="300"
                rotation-per-second="15deg"
                shadow-intensity="1.4"
                exposure="1.2"
                touch-action="pan-y"
                interaction-prompt="auto"
                class="fullscreen-model-viewer"
              ></model-viewer>
            </div>

            <!-- Bottom Floating HUD Control Bar -->
            <div class="hud-controls-dock">
              <div class="hud-indicator">
                <span>Rotate: Left Click + Drag</span>
              </div>
              <div class="hud-divider"></div>
              <div class="hud-indicator">
                <span>Zoom: Scroll / Pinch</span>
              </div>
              <div class="hud-divider"></div>
              <div class="hud-indicator">
                <span>Pan: Right Click + Drag</span>
              </div>
              <div class="hud-divider"></div>
              <div class="hud-indicator active-status">
                <span class="active-pulse"></span> WebGL 3D Active
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.portfolio-section {
  padding: 5.5rem 0;
  background: linear-gradient(180deg, #0b192e 0%, #0f2b5c 50%, #0b192e 100%);
  color: #ffffff;
}

.text-center {
  text-align: center;
}

.text-light {
  color: #ffffff;
}

.text-slate-300 {
  color: #cbd5e1;
}

.portfolio-filter-bar {
  display: flex;
  justify-content: center;
  gap: 0.65rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.filter-tab-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.85rem;
  color: #cbd5e1;
  cursor: pointer;
  transition: all 0.25s ease;
  backdrop-filter: blur(6px);
}

.filter-tab-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
  border-color: #60a5fa;
}

.filter-tab-btn.active {
  background: var(--c-royal-blue);
  color: #ffffff;
  border-color: #60a5fa;
  box-shadow: 0 6px 18px rgba(30, 80, 181, 0.4);
}

.models-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.75rem;
}

.tech-model-card {
  background: rgba(15, 23, 42, 0.75);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 14px 35px rgba(0, 0, 0, 0.4);
  transition: transform 0.35s var(--transition-bounce), border-color 0.3s ease, box-shadow 0.3s ease;
}

.tech-model-card:hover {
  transform: translateY(-6px);
  border-color: #60a5fa;
  box-shadow: 0 22px 50px rgba(0, 0, 0, 0.55);
}

.viewport-box {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 11;
  background: radial-gradient(circle at 50% 50%, #1e293b 0%, #0b1322 100%);
}

.model-viewport {
  width: 100%;
  height: 100%;
  --poster-color: transparent;
}

.top-overlay-row {
  position: absolute;
  top: 0.85rem;
  left: 0.85rem;
  right: 0.85rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 5;
  pointer-events: none;
}

.software-badge-glass {
  pointer-events: auto;
  font-size: 0.73rem;
  font-weight: 800;
  color: #ffffff;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  backdrop-filter: blur(8px);
}

.fullscreen-icon-btn {
  pointer-events: auto;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #ffffff;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
}

.fullscreen-icon-btn:hover {
  background: var(--c-royal-blue);
  border-color: #60a5fa;
  transform: scale(1.08);
}

.model-info-dock {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(11, 25, 46, 0.9);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  z-index: 5;
}

.dock-title-block {
  display: flex;
  flex-direction: column;
}

.model-title-text {
  font-size: 0.9rem;
  font-weight: 800;
  color: #ffffff;
}

.rotate-tag {
  font-size: 0.72rem;
  color: #38bdf8;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.active-pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
  display: inline-block;
}

.btn-xs {
  padding: 0.3rem 0.65rem;
  font-size: 0.76rem;
  border-radius: 6px;
}

/* Fullscreen High-Res Modal */
.fullscreen-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(7, 14, 24, 0.95);
  backdrop-filter: blur(14px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.hud-header {
  position: absolute;
  top: 1.25rem;
  left: 1.5rem;
  right: 1.5rem;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
}

.hud-title-box {
  pointer-events: auto;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.22);
  padding: 0.65rem 1.15rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.hud-tag {
  font-size: 0.74rem;
  font-weight: 800;
  color: #38bdf8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  display: block;
}

.hud-title {
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.hud-close-btn {
  pointer-events: auto;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #ffffff;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.hud-close-btn:hover {
  background: #ef4444;
  border-color: #f87171;
  transform: scale(1.08);
}

.fullscreen-viewport-wrapper {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%, #1e293b 0%, #070e18 100%);
}

.fullscreen-model-viewer {
  width: 100%;
  height: 100%;
}

.hud-controls-dock {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background: rgba(15, 23, 42, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.22);
  padding: 0.65rem 1.35rem;
  border-radius: 30px;
  backdrop-filter: blur(12px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hud-indicator {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: #e2e8f0;
}

.hud-divider {
  width: 1px;
  height: 16px;
  background: rgba(255, 255, 255, 0.22);
}

.active-status {
  color: #38bdf8;
}

@media (max-width: 992px) {
  .models-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .models-grid {
    grid-template-columns: 1fr;
  }
  .hud-controls-dock {
    flex-wrap: wrap;
    justify-content: center;
    width: 90%;
  }
  .hud-divider {
    display: none;
  }
}
</style>

