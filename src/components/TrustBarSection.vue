<script setup lang="ts">
import { COMPANY_INFO } from '../data/companyData'
</script>

<template>
  <section class="trust-bar-section">
    <div class="container">
      <div class="trust-bar-card reveal-on-scroll">
        <div class="trust-bar-header">
          <span class="trust-tag">Core Strengths & Standards</span>
          <h2 class="trust-heading">Why Fabricators Rely On AVA</h2>
        </div>
        <div class="trust-grid">
          <div
            v-for="(item, idx) in COMPANY_INFO.trustBar"
            :key="idx"
            class="trust-card-item"
          >
            <span class="material-symbols-outlined check-badge text-success icon-sm">check</span>
            <span class="trust-item-text">{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.trust-bar-section {
  background-color: var(--c-surface-alt, #f8fafc);
  padding: 2.25rem 0;
  border-bottom: 1px solid var(--c-border-light, #e2e8f0);
}

.trust-bar-card {
  background: linear-gradient(135deg, #0f2b5c 0%, #154194 100%);
  border-radius: 14px;
  padding: 2rem 2.25rem;
  box-shadow: 0 14px 35px rgba(15, 41, 92, 0.18);
  border: 1px solid rgba(96, 165, 250, 0.25);
  color: #ffffff;
}

.trust-bar-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.trust-tag {
  display: inline-block;
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  border: 1px solid rgba(56, 189, 248, 0.3);
  margin-bottom: 0.4rem;
}

.trust-heading {
  font-family: var(--font-heading);
  font-size: 1.45rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
}

.trust-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem 1.25rem;
}

.trust-card-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 0.85rem 1.1rem;
  border-radius: 10px;
  backdrop-filter: blur(6px);
  transition: all 0.25s ease;
}

.trust-card-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.16);
  border-color: #60a5fa;
  box-shadow: 0 8px 20px rgba(11, 25, 46, 0.3);
}

.check-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  font-weight: 900;
  font-size: 0.85rem;
  border: 1px solid rgba(16, 185, 129, 0.4);
  flex-shrink: 0;
}

.trust-item-text {
  font-size: 0.92rem;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: -0.01em;
}

@media (max-width: 992px) {
  .trust-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .trust-bar-card {
    padding: 1.5rem 1.15rem;
  }
  .trust-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  .trust-heading {
    font-size: 1.25rem;
  }
}
</style>
