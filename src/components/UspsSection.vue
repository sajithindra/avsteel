<script setup lang="ts">
import { ref } from 'vue'
import { UNIQUE_SELLING_POINTS } from '../data/companyData'

const activeUspId = ref(UNIQUE_SELLING_POINTS[0]!.id)
const activeUsp = ref(UNIQUE_SELLING_POINTS[0]!)

const selectUsp = (id: number) => {
  activeUspId.value = id
  const found = UNIQUE_SELLING_POINTS.find(item => item.id === id)
  if (found) {
    activeUsp.value = found
  }
}
</script>

<template>
  <section id="usps" class="usps-section">
    <div class="container">
      <div class="section-header text-center reveal-on-scroll">
        <span class="badge badge-hero">Core Advantages</span>
        <h2 class="section-title text-light">More Than Detailing—A Smarter Engineering Partner</h2>
        <p class="section-subtitle text-slate-300">
          Combining experienced detailing professionals, AI-assisted verification, and real-time project management to keep your shop on schedule.
        </p>
      </div>

      <!-- Asymmetrical Matrix: Left Spotlight Showcase, Right Quick Feature Selector -->
      <div class="usps-spotlight-matrix reveal-on-scroll stagger-1">
        <!-- Left Showcase Card -->
        <div class="spotlight-main-card">
          <Transition name="fade-slide" mode="out-in">
            <div :key="activeUsp.id" class="main-card-content">
              <div class="card-top-tag">
                <span class="badge-num">ADVANTAGE 0{{ activeUsp.id }}</span>
                <span class="tech-tag">AISC / AWS Standard</span>
              </div>

              <h3 class="main-title">{{ activeUsp.title }}</h3>
              <p class="main-desc">{{ activeUsp.description }}</p>

              <div class="value-highlight-box">
                <span class="value-head">Direct Business Impact:</span>
                <ul class="value-bullets">
                  <li v-for="(val, idx) in activeUsp.valuePoints" :key="idx" class="bullet-item">
                    <span class="check-icon">✓</span>
                    <span>{{ val }}</span>
                  </li>
                </ul>
              </div>

              <div class="card-action-bar">
                <a href="#contact" class="btn btn-accent btn-sm">Get Partner Access</a>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Right Quick Feature Selector Grid -->
        <div class="usps-selector-list">
          <button
            v-for="usp in UNIQUE_SELLING_POINTS"
            :key="usp.id"
            class="selector-item"
            :class="{ active: activeUspId === usp.id }"
            @click="selectUsp(usp.id)"
          >
            <span class="selector-num">0{{ usp.id }}</span>
            <div class="selector-text">
              <span class="selector-title">{{ usp.title }}</span>
            </div>
            <span class="selector-arrow">›</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.usps-section {
  padding: 5.5rem 0;
  background: linear-gradient(135deg, #0b192e 0%, #0f2b5c 50%, #154194 100%);
  color: #ffffff;
}

.text-center {
  text-align: center;
}

.section-header {
  max-width: 820px;
  margin: 0 auto 3rem auto;
}

.text-light {
  color: #ffffff;
}

.text-slate-300 {
  color: #cbd5e1;
}

.usps-spotlight-matrix {
  display: grid;
  grid-template-columns: 1.2fr 0.95fr;
  gap: 2rem;
  align-items: stretch;
}

.spotlight-main-card {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 16px;
  padding: 2.5rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 40px rgba(11, 25, 46, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-top-tag {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.badge-num {
  font-family: var(--font-heading);
  font-size: 0.78rem;
  font-weight: 800;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.15);
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.tech-tag {
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 700;
  text-transform: uppercase;
}

.main-title {
  font-family: var(--font-heading);
  font-size: 1.85rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.85rem;
  line-height: 1.25;
}

.main-desc {
  font-size: 1.05rem;
  color: #e2e8f0;
  line-height: 1.65;
  margin-bottom: 1.75rem;
}

.value-highlight-box {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 1.25rem;
  border-radius: 10px;
  margin-bottom: 2rem;
}

.value-head {
  display: block;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #93c5fd;
  margin-bottom: 0.65rem;
}

.value-bullets {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bullet-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
}

.check-icon {
  color: #10b981;
  font-weight: 900;
  font-size: 0.9rem;
}

.usps-selector-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.selector-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 1rem 1.25rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s ease;
  color: #ffffff;
}

.selector-item:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: #60a5fa;
  transform: translateX(4px);
}

.selector-item.active {
  background: linear-gradient(135deg, var(--c-royal-blue) 0%, var(--c-royal-blue-accent) 100%);
  border-color: #60a5fa;
  box-shadow: 0 8px 20px rgba(11, 25, 46, 0.4);
}

.selector-num {
  font-family: var(--font-heading);
  font-size: 0.88rem;
  font-weight: 800;
  color: #38bdf8;
  background: rgba(255, 255, 255, 0.12);
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
}

.selector-item.active .selector-num {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.22);
}

.selector-text {
  flex: 1;
}

.selector-title {
  font-size: 0.95rem;
  font-weight: 700;
}

.selector-arrow {
  font-size: 1.2rem;
  color: #94a3b8;
  transition: transform 0.25s ease;
}

.selector-item.active .selector-arrow {
  color: #ffffff;
  transform: translateX(4px);
}

.btn-sm {
  padding: 0.6rem 1.25rem;
  font-size: 0.88rem;
}

@media (max-width: 900px) {
  .usps-spotlight-matrix {
    grid-template-columns: 1fr;
  }
}
</style>

