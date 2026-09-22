<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { ServiceItem } from '../data/companyData'
import { SERVICES_LIST } from '../data/companyData'

const currentIndex = ref(0)
const currentService = ref<ServiceItem>(SERVICES_LIST[0]!)
let autoPlayTimer: ReturnType<typeof setInterval> | null = null

const setService = (index: number) => {
  currentIndex.value = index
  currentService.value = SERVICES_LIST[index]!
}

const nextService = () => {
  const nextIdx = (currentIndex.value + 1) % SERVICES_LIST.length
  setService(nextIdx)
}

const prevService = () => {
  const prevIdx = (currentIndex.value - 1 + SERVICES_LIST.length) % SERVICES_LIST.length
  setService(prevIdx)
}

const startAutoPlay = () => {
  if (!autoPlayTimer) {
    autoPlayTimer = setInterval(() => {
      nextService()
    }, 4500)
  }
}

const stopAutoPlay = () => {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

const touchStartX = ref(0)
const touchEndX = ref(0)

const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.changedTouches[0]?.clientX || 0
}

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0]?.clientX || 0
  const diff = touchStartX.value - touchEndX.value
  if (Math.abs(diff) > 40) {
    if (diff > 0) {
      nextService()
    } else {
      prevService()
    }
  }
}

onMounted(() => {
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<template>
  <section id="services" class="services-section">
    <div class="container">
      <div class="section-header reveal-on-scroll">
        <span class="badge">Services & Features</span>
        <h2>Structural Steel & Engineering Services</h2>
        <p>Complete 3D BIM modeling, connection design, PE/SE stamping, and material estimation.</p>
      </div>

      <!-- Feature Tabs Bar -->
      <div class="tabs-row reveal-on-scroll stagger-1">
        <button
          v-for="(service, idx) in SERVICES_LIST"
          :key="service.id"
          class="tab-btn"
          :class="{ active: currentIndex === idx }"
          @click="setService(idx)"
        >
          <span class="tab-num">0{{ idx + 1 }}</span>
          <span>{{ service.title }}</span>
        </button>
      </div>

      <!-- One Feature Card at a Time Carousel -->
      <div
        class="carousel-wrapper reveal-on-scroll stagger-2"
        @mouseenter="stopAutoPlay"
        @mouseleave="startAutoPlay"
        @touchstart.passive="handleTouchStart"
        @touchend.passive="handleTouchEnd"
      >
        <button class="nav-arrow prev-arrow" @click="prevService" aria-label="Previous feature">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <Transition name="fade-slide" mode="out-in">
          <div :key="currentService.id" class="service-box ava-card">
            <div class="card-header-badge">
              <span class="feature-counter">Feature {{ currentIndex + 1 }} of {{ SERVICES_LIST.length }}</span>
            </div>

            <div class="service-top">
              <div>
                <h3>{{ currentService.title }}</h3>
                <p class="service-sub">{{ currentService.subtitle }}</p>
              </div>
              <a href="#contact" class="btn btn-accent btn-sm">Inquire Now</a>
            </div>

            <p class="service-desc">{{ currentService.description }}</p>

            <div class="service-details-grid">
              <div class="detail-col">
                <h4>Key Highlights</h4>
                <ul class="clean-list">
                  <li v-for="(item, idx) in currentService.highlights" :key="idx" class="list-item">
                    <span class="bullet-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" width="15" height="15">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>

              <div class="detail-col">
                <h4>Deliverables</h4>
                <ul class="clean-list">
                  <li v-for="(deliv, idx) in currentService.deliverables" :key="idx" class="list-item">
                    <span class="material-symbols-outlined check-icon text-success icon-xs">check</span>
                    <span>{{ deliv }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Transition>

        <button class="nav-arrow next-arrow" @click="nextService" aria-label="Next feature">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      <!-- Carousel Pagination Dots -->
      <div class="dots-row">
        <button
          v-for="(_, idx) in SERVICES_LIST"
          :key="idx"
          class="dot-btn"
          :class="{ active: currentIndex === idx }"
          @click="setService(idx)"
          :aria-label="`Go to feature ${idx + 1}`"
        ></button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.services-section {
  padding: 5.5rem 0;
  background-color: var(--c-bg-alt);
}

.tabs-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  max-width: 960px;
  width: 100%;
  margin: 0 auto 2rem auto;
}

.tab-btn {
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  padding: 0.65rem 0.75rem;
  border-radius: 6px;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.82rem;
  line-height: 1.25;
  color: var(--c-blue-dark);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  text-align: center;
  white-space: normal;
  word-break: normal;
  overflow-wrap: break-word;
  transition: all var(--transition-fast);
  width: 100%;
  min-height: 54px;
}

.tab-num {
  font-size: 0.78rem;
  color: var(--c-royal-blue);
  font-weight: 800;
  white-space: nowrap;
  flex-shrink: 0;
  display: inline-block;
}

.tab-btn.active .tab-num {
  color: #93c5fd;
}

.tab-btn:hover {
  border-color: var(--c-royal-blue);
  color: var(--c-royal-blue);
  transform: translateY(-1px);
}

.tab-btn.active {
  background: var(--c-royal-blue);
  color: var(--c-text-light);
  border-color: var(--c-royal-blue);
  box-shadow: 0 6px 15px rgba(29, 78, 216, 0.25);
}

.carousel-wrapper {
  position: relative;
  max-width: 920px;
  width: 100%;
  margin: 0 auto;
  min-height: 440px;
  box-sizing: border-box;
}

.service-box {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: 2.25rem;
  border-top: 4px solid var(--c-royal-blue);
  min-height: 440px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-header-badge {
  margin-bottom: 0.75rem;
  width: 100%;
}

.feature-counter {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--c-royal-blue);
  background: var(--c-royal-blue-light);
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  border: 1px solid var(--c-royal-blue-border);
}

.service-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--c-border);
  padding-bottom: 1rem;
  width: 100%;
}

.service-top h3 {
  font-size: 1.45rem;
  margin-bottom: 0.2rem;
  color: var(--c-blue-dark);
}

.service-sub {
  color: var(--c-text-muted);
  font-size: 0.92rem;
  font-weight: 500;
}

.service-desc {
  color: var(--c-text-dark);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  width: 100%;
}

.service-details-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.75rem;
  width: 100%;
}

.detail-col {
  min-width: 0;
  width: 100%;
}

.detail-col h4 {
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  color: var(--c-royal-blue);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.clean-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.list-item {
  font-size: 0.88rem;
  color: var(--c-text-dark);
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
}

.bullet-icon {
  color: var(--c-royal-blue);
  background: var(--c-royal-blue-light);
  border: 1px solid var(--c-royal-blue-border);
  border-radius: 4px;
  padding: 0.15rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.check-icon {
  color: #10b981;
  font-weight: 700;
}

.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  color: var(--c-blue-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(15, 41, 66, 0.1);
  transition: all var(--transition-fast);
}

.prev-arrow {
  left: -22px;
}

.next-arrow {
  right: -22px;
}

.nav-arrow:hover {
  background: var(--c-royal-blue);
  color: #ffffff;
  border-color: var(--c-royal-blue);
  transform: translateY(-50%) scale(1.08);
}

.dots-row {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.dot-btn {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--c-border);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.dot-btn.active {
  background: var(--c-royal-blue);
  width: 28px;
  border-radius: 6px;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

@media (max-width: 900px) {
  .tabs-row {
    display: flex;
    overflow-x: auto;
    flex-wrap: nowrap;
    justify-content: flex-start;
    padding-bottom: 0.4rem;
  }
  .tab-btn {
    flex: 0 0 auto;
    width: auto;
  }
  .nav-arrow {
    display: none;
  }
}

@media (max-width: 768px) {
  .carousel-wrapper, .service-box {
    min-height: auto;
  }
  .service-top {
    flex-direction: column;
  }
  .service-details-grid {
    grid-template-columns: 1fr;
  }
}
</style>


