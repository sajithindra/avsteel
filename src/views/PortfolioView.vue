<script setup lang="ts">
import PortfolioSection from '../components/PortfolioSection.vue'
import ContactSection from '../components/ContactSection.vue'
</script>

<template>
  <div class="portfolio-page">
    <div class="portfolio-hero">
      <div class="container">
        <span class="badge">AVA SSDS Projects</span>
        <h1>3D Steel BIM Model Portfolio</h1>
        <p>Explore our high-precision SDS/2 & Tekla 3D BIM models, erection plans, and connection detailing projects across North America.</p>
      </div>
    </div>

    <PortfolioSection />
    <ContactSection />
  </div>
</template>

<style scoped>
.portfolio-hero {
  background: linear-gradient(135deg, #0f2b5c 0%, #154194 50%, #0b192e 100%);
  color: #ffffff;
  padding: 4.5rem 0 3rem 0;
  text-align: center;
  border-bottom: 3px solid var(--c-royal-blue-accent);
}

.portfolio-hero h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0.75rem 0 0.5rem 0;
}

.portfolio-hero p {
  font-size: 1.05rem;
  color: #cbd5e1;
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.6;
}
</style>
