<script setup lang="ts">
import { COMPANY_INFO } from '../data/companyData'
</script>

<template>
  <section class="hero-section">
    <!-- Dynamic Glowing Mesh Background -->
    <div class="hero-bg-overlay"></div>
    <div class="hero-mesh-grid"></div>

    <div class="container relative-z">
      <div class="hero-layout">
        <!-- Main Copy & CTA -->
        <div class="hero-content">
          <div class="hero-badge-row reveal-on-scroll">
            <span class="badge badge-hero">
              <span class="pulse-dot"></span>
              U.S. Steel Fabrication Partner
            </span>
          </div>

          <h1 class="hero-title reveal-on-scroll stagger-1">
            {{ COMPANY_INFO.heroHeadline }}
          </h1>

          <p class="hero-description reveal-on-scroll stagger-2">
            {{ COMPANY_INFO.heroSubheadline }}
          </p>

          <div class="hero-actions reveal-on-scroll stagger-3">
            <a href="#contact" class="btn btn-accent btn-lg glow-effect">
              <span>Request Quote</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
            <a href="#services" class="btn btn-outline-hero btn-lg">
              <span>Explore Services</span>
            </a>
          </div>
        </div>

        <!-- Right Visual: Engineering Live Status Showcase Card -->
        <div class="hero-visual reveal-on-scroll stagger-3">
          <div class="status-card-wrapper">
            <div class="card-glow-backdrop"></div>
            <div class="status-card">
              <div class="card-header-bar">
                <div class="status-indicator">
                  <span class="status-dot-active"></span>
                  <span class="status-text">SDS/2 & Tekla Active Operations</span>
                </div>
                <span class="code-tag">AISC / NISD COMPLIANT</span>
              </div>

              <div class="card-body-specs">
                <div class="spec-row">
                  <span class="spec-label">Primary Detailing Engine</span>
                  <span class="spec-val">SDS/2 & Tekla Structures</span>
                </div>
                <div class="spec-row">
                  <span class="spec-label">Output Formats</span>
                  <span class="spec-val">Shop, Erection & CNC (DSTV/DXF)</span>
                </div>
                <div class="spec-row">
                  <span class="spec-label">Engineering Coverage</span>
                  <span class="spec-val">27 U.S. PE/SE Stamping States</span>
                </div>
                <div class="spec-row">
                  <span class="spec-label">Support Window</span>
                  <span class="spec-val">USA Time Zone Dedicated PM</span>
                </div>
              </div>

              <div class="card-footer-metrics">
                <div class="mini-metric">
                  <span class="mini-val">20+</span>
                  <span class="mini-lbl">Yrs Exp</span>
                </div>
                <div class="mini-divider"></div>
                <div class="mini-metric">
                  <span class="mini-val">98%</span>
                  <span class="mini-lbl">On-Time</span>
                </div>
                <div class="mini-divider"></div>
                <div class="mini-metric">
                  <span class="mini-val">24h</span>
                  <span class="mini-lbl">Quotes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Metrics Row (5 Cards with Accent Borders & Dynamic Hover) -->
      <div class="metrics-row reveal-on-scroll stagger-4">
        <div v-for="(metric, idx) in COMPANY_INFO.metrics" :key="idx" class="metric-card">
          <div class="metric-value">{{ metric.value }}</div>
          <div class="metric-label">{{ metric.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #0b192e 0%, #0f2b5c 50%, #154194 100%);
  color: var(--c-text-light);
  padding: 4.5rem 0 4rem 0;
  border-bottom: 3px solid var(--c-royal-blue-accent);
  overflow: hidden;
}

.hero-bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 80% 20%, rgba(56, 189, 248, 0.22) 0%, transparent 45%),
    radial-gradient(circle at 15% 85%, rgba(30, 80, 181, 0.3) 0%, transparent 50%);
  pointer-events: none;
}

.hero-mesh-grid {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 36px 36px;
  pointer-events: none;
  opacity: 0.6;
}

.relative-z {
  position: relative;
  z-index: 2;
}

.hero-layout {
  display: grid;
  grid-template-columns: 1.2fr 0.95fr;
  gap: 3rem;
  align-items: center;
  margin-bottom: 3.5rem;
}

.hero-content {
  max-width: 640px;
}

.hero-badge-row {
  margin-bottom: 1.25rem;
}

.badge-hero {
  background: rgba(255, 255, 255, 0.12);
  color: #e0f2fe;
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 0.4rem 0.95rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  backdrop-filter: blur(8px);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #10b981;
  box-shadow: 0 0 10px #10b981;
  animation: pulseGlow 1.8s infinite ease-in-out;
}

.hero-title {
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.15;
  color: #ffffff;
  margin-bottom: 1.1rem;
  letter-spacing: -0.02em;
}

.hero-description {
  font-size: 1.1rem;
  color: #cbd5e1;
  line-height: 1.65;
  margin-bottom: 2rem;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-lg {
  padding: 0.9rem 1.75rem;
  font-size: 0.95rem;
  border-radius: 8px;
}

.glow-effect {
  box-shadow: 0 8px 25px rgba(30, 80, 181, 0.45);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.glow-effect:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 32px rgba(30, 80, 181, 0.6);
}

.btn-outline-hero {
  background-color: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.28);
  color: #ffffff;
  backdrop-filter: blur(4px);
}

.btn-outline-hero:hover {
  background-color: rgba(255, 255, 255, 0.16);
  border-color: #ffffff;
  transform: translateY(-3px);
}

/* Engineering Visual Card */
.hero-visual {
  position: relative;
}

.status-card-wrapper {
  position: relative;
}

.card-glow-backdrop {
  position: absolute;
  inset: -10px;
  background: linear-gradient(135deg, #38bdf8 0%, #1d4ed8 100%);
  border-radius: 20px;
  filter: blur(20px);
  opacity: 0.35;
  transition: opacity 0.3s ease;
}

.status-card-wrapper:hover .card-glow-backdrop {
  opacity: 0.55;
}

.status-card {
  position: relative;
  background: rgba(15, 30, 60, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 40px rgba(11, 25, 46, 0.5);
}

.card-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  padding-bottom: 1rem;
  margin-bottom: 1.2rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot-active {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.status-text {
  font-size: 0.82rem;
  font-weight: 700;
  color: #f8fafc;
}

.code-tag {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.15);
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.card-body-specs {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.35rem;
}

.spec-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.spec-label {
  font-size: 0.78rem;
  color: #94a3b8;
  font-weight: 600;
}

.spec-val {
  font-size: 0.84rem;
  color: #ffffff;
  font-weight: 700;
}

.card-footer-metrics {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(255, 255, 255, 0.07);
  padding: 0.85rem 0.5rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.mini-metric {
  text-align: center;
}

.mini-val {
  display: block;
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 800;
  color: #38bdf8;
  line-height: 1;
}

.mini-lbl {
  font-size: 0.72rem;
  color: #cbd5e1;
  font-weight: 600;
}

.mini-divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.18);
}

/* Metrics Row (5 Cards) */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.15rem;
}

.metric-card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 12px;
  padding: 1.35rem 0.85rem;
  text-align: center;
  transition: transform 0.35s var(--transition-bounce), border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px) scale(1.04);
  border-color: #60a5fa;
  background: rgba(255, 255, 255, 0.14);
  box-shadow: 0 16px 30px rgba(11, 25, 46, 0.45);
}

.metric-value {
  font-family: var(--font-heading);
  font-size: 1.85rem;
  font-weight: 800;
  color: #38bdf8;
  line-height: 1;
  margin-bottom: 0.35rem;
  transition: color 0.3s ease;
}

.metric-card:hover .metric-value {
  color: #60a5fa;
}

.metric-label {
  font-size: 0.82rem;
  color: #e2e8f0;
  font-weight: 600;
}

@media (max-width: 992px) {
  .hero-layout {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
  .hero-title {
    font-size: 2.35rem;
  }
  .metrics-row {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 1.95rem;
  }
  .hero-actions {
    flex-direction: column;
  }
  .metrics-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

