<script setup lang="ts">
import { PAIN_POINTS_CONTENT, WHY_CHOOSE_FABRICATORS, VALUE_PROPOSITION, COMPANY_INFO } from '../data/companyData'
</script>

<template>
  <section class="fabricator-section">
    <div class="container">
      <!-- Section Title Header -->
      <div class="section-header text-center reveal-on-scroll">
        <span class="badge badge-accent">Fabrication Intelligence</span>
        <h2>Engineering Capacity Designed For U.S. Fabricators</h2>
        <p>Eliminate shop bottlenecks, reduce RFIs, and keep your fabrication team operating at peak efficiency.</p>
      </div>

      <!-- Top Row: Interactive Dual-Panel Comparison Matrix -->
      <div class="comparison-matrix">
        <!-- Panel 1: Common Shop Challenges -->
        <div class="panel-card challenge-panel reveal-on-scroll stagger-1">
          <div class="panel-header">
            <span class="panel-tag warning-tag">Shop Bottlenecks</span>
            <h3 class="panel-title">{{ PAIN_POINTS_CONTENT.headline }}</h3>
          </div>

          <ul class="comparison-list">
            <li v-for="(item, idx) in PAIN_POINTS_CONTENT.checklist" :key="idx" class="comparison-item challenge-item">
              <span class="status-icon warning-icon">⚠️</span>
              <span class="item-text">{{ item }}</span>
            </li>
          </ul>

          <div class="panel-callout warning-callout">
            <span>{{ PAIN_POINTS_CONTENT.callout }}</span>
          </div>
        </div>

        <!-- Central Connecting Graphic Badge -->
        <div class="matrix-connector desktop-only">
          <div class="connector-line"></div>
          <div class="vs-badge">VS</div>
          <div class="connector-line"></div>
        </div>

        <!-- Panel 2: Why Fabricators Choose AVA -->
        <div class="panel-card solution-panel reveal-on-scroll stagger-2">
          <div class="panel-header">
            <span class="panel-tag success-tag">The AVA Advantage</span>
            <h3 class="panel-title">{{ WHY_CHOOSE_FABRICATORS.headline }}</h3>
            <p class="panel-intro">{{ WHY_CHOOSE_FABRICATORS.intro }}</p>
          </div>

          <ul class="comparison-list">
            <li v-for="(item, idx) in WHY_CHOOSE_FABRICATORS.solutions" :key="idx" class="comparison-item solution-item">
              <span class="status-icon success-icon">✓</span>
              <span class="item-text">{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Banner: Value Proposition & Engineering Standards -->
      <div class="value-prop-banner reveal-on-scroll stagger-3">
        <div class="banner-glass-bg"></div>
        <div class="value-content">
          <span class="value-badge">U.S. Detailing Standards</span>
          <h3 class="value-headline">{{ VALUE_PROPOSITION.headline }}</h3>
          <p class="value-body">{{ VALUE_PROPOSITION.body }}</p>
        </div>

        <div class="social-proof-box">
          <span class="proof-label">Design & Detailing Codes</span>
          <div class="proof-badges">
            <span v-for="badge in COMPANY_INFO.socialProof" :key="badge" class="proof-badge">
              {{ badge }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fabricator-section {
  padding: 5rem 0;
  background-color: var(--c-bg-white, #ffffff);
}

.text-center {
  text-align: center;
}

.comparison-matrix {
  display: grid;
  grid-template-columns: 1fr 60px 1fr;
  align-items: stretch;
  gap: 1rem;
  margin-bottom: 3rem;
}

.panel-card {
  border-radius: 14px;
  padding: 2.25rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.challenge-panel {
  background: #fff8f6;
  border: 1px solid #fed7aa;
  box-shadow: 0 4px 15px rgba(234, 88, 12, 0.06);
}

.challenge-panel:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 25px rgba(234, 88, 12, 0.12);
}

.solution-panel {
  background: linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%);
  border: 1.5px solid var(--c-royal-blue-border);
  box-shadow: 0 4px 15px rgba(21, 65, 148, 0.08);
}

.solution-panel:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(21, 65, 148, 0.16);
}

.panel-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  margin-bottom: 0.75rem;
}

.warning-tag {
  background: #ffedd5;
  color: #c2410c;
  border: 1px solid #fdba74;
}

.success-tag {
  background: var(--c-royal-blue-light);
  color: var(--c-royal-blue);
  border: 1px solid var(--c-royal-blue-border);
}

.panel-title {
  font-family: var(--font-heading);
  font-size: 1.45rem;
  font-weight: 800;
  color: var(--c-blue-dark);
  margin-bottom: 0.5rem;
}

.panel-intro {
  font-size: 0.9rem;
  color: var(--c-text-muted);
  margin-bottom: 1.25rem;
}

.comparison-list {
  list-style: none;
  padding: 0;
  margin: 1.25rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.comparison-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #ffffff;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #fee2e2;
  font-size: 0.92rem;
  font-weight: 700;
  color: #334155;
}

.challenge-item {
  align-items: center;
}

.solution-item {
  border: 1px solid var(--c-royal-blue-border, #bfdbfe);
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(15, 41, 66, 0.03);
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.solution-item:hover {
  transform: translateY(-2px);
  border-color: var(--c-royal-blue, #1d4ed8);
  box-shadow: 0 6px 15px rgba(21, 65, 148, 0.12);
}

.item-text {
  flex: 1;
  font-size: 0.88rem;
  font-weight: 600;
  line-height: 1.45;
  color: #1e293b;
}

.warning-icon {
  font-size: 0.9rem;
  flex-shrink: 0;
}

.panel-callout {
  margin-top: auto;
  padding: 0.85rem 1.1rem;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 800;
  text-align: center;
}

.warning-callout {
  background: #ffedd5;
  color: #9a3412;
  border: 1px solid #fed7aa;
}

/* Connector VS Badge */
.matrix-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.connector-line {
  flex: 1;
  width: 2px;
  background: #cbd5e1;
}

.vs-badge {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--c-royal-blue);
  color: #ffffff;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(21, 65, 148, 0.3);
  margin: 1rem 0;
}

.success-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #dcfce7;
  color: #15803d;
  font-weight: 800;
  font-size: 0.78rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Value Proposition Banner */
.value-prop-banner {
  position: relative;
  background: linear-gradient(135deg, #0b192e 0%, #154194 100%);
  border-radius: 16px;
  padding: 2.5rem;
  color: #ffffff;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  align-items: center;
  overflow: hidden;
  box-shadow: 0 16px 35px rgba(11, 25, 46, 0.18);
}

.banner-glass-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 90% 10%, rgba(56, 189, 248, 0.2) 0%, transparent 40%);
  pointer-events: none;
}

.value-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: rgba(255, 255, 255, 0.15);
  color: #93c5fd;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.value-headline {
  font-family: var(--font-heading);
  font-size: 1.55rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.75rem;
  line-height: 1.25;
}

.value-body {
  font-size: 0.95rem;
  color: #cbd5e1;
  line-height: 1.6;
}

.social-proof-box {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 1.35rem;
  border-radius: 12px;
  text-align: center;
  backdrop-filter: blur(8px);
}

.proof-label {
  display: block;
  font-size: 0.76rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.85rem;
}

.proof-badges {
  display: flex;
  justify-content: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.proof-badge {
  font-family: var(--font-heading);
  font-size: 0.88rem;
  font-weight: 800;
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #ffffff;
  transition: all 0.25s ease;
}

.proof-badge:hover {
  background: var(--c-royal-blue-accent);
  transform: translateY(-2px);
}

@media (max-width: 992px) {
  .comparison-matrix {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .desktop-only {
    display: none;
  }
  .solution-grid {
    grid-template-columns: 1fr;
  }
  .value-prop-banner {
    grid-template-columns: 1fr;
    padding: 1.75rem;
  }
}
</style>

