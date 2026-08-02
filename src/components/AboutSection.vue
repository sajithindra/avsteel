<script setup lang="ts">
import { ABOUT_CONTENT } from '../data/companyData'
</script>

<template>
  <section id="about" class="about-section">
    <div class="container">
      <div class="section-header reveal-on-scroll">
        <span class="badge">AEC Structural Engineering Partner</span>
        <h2>Engineering Partner for AEC Professionals</h2>
        <p>{{ ABOUT_CONTENT.corePurpose }}</p>
      </div>

      <!-- Who We Serve -->
      <div class="serve-grid">
        <div
          v-for="(client, idx) in ABOUT_CONTENT.whoWeServe"
          :key="idx"
          class="ava-card serve-card reveal-on-scroll"
          :class="`stagger-${idx + 1}`"
        >
          <div class="card-tag">B2B Partner</div>
          <h4>{{ client.title }}</h4>
          <p>{{ client.desc }}</p>
        </div>
      </div>

      <!-- Core Values -->
      <div class="values-row reveal-on-scroll stagger-4">
        <div v-for="(val, idx) in ABOUT_CONTENT.values" :key="idx" class="value-item">
          <strong>{{ val.title }}</strong>
          <span>{{ val.desc }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  padding: 5.5rem 0;
  background-color: var(--c-bg-white);
}

.serve-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3.5rem;
}

.serve-card {
  border-top: 3px solid var(--c-royal-blue);
  position: relative;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s ease, box-shadow 0.3s ease;
  will-change: transform;
}

.serve-card:hover {
  transform: scale(1.04) translateY(-6px);
  border-top-color: var(--c-gold);
  box-shadow: 0 16px 30px rgba(21, 65, 148, 0.18);
}

.card-tag {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--c-royal-blue-accent);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.45rem;
}

.serve-card h4 {
  font-size: 1.2rem;
  margin-bottom: 0.45rem;
  color: var(--c-blue-dark);
}

.serve-card p {
  color: var(--c-text-muted);
  font-size: 0.92rem;
  line-height: 1.55;
}

.values-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  background: var(--c-surface);
  border: 1px solid var(--c-royal-blue-border);
  padding: 1.75rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(29, 78, 216, 0.04);
}

.value-item {
  position: relative;
  padding-left: 0.85rem;
  border-left: 3px solid var(--c-royal-blue);
  transition: transform 0.3s ease, border-left-color 0.3s ease;
}

.value-item:hover {
  transform: translateX(4px);
  border-left-color: var(--c-gold);
}

.value-item strong {
  display: block;
  color: var(--c-royal-blue);
  font-size: 1.02rem;
  margin-bottom: 0.25rem;
}

.value-item span {
  font-size: 0.88rem;
  color: var(--c-text-muted);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .serve-grid, .values-row {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  .serve-card:nth-child(2) {
    margin-top: 0;
  }
}
</style>
