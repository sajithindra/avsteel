<script setup lang="ts">
import { PRIVACY_POLICY, COMPANY_INFO } from '../data/companyData'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
</script>

<template>
  <Navbar />
  <main class="legal-page">
    <div class="legal-hero">
      <div class="container">
        <span class="badge badge-hero">Privacy & Data Governance</span>
        <h1 class="legal-title">Privacy Policy</h1>
        <p class="legal-subtitle">
          Effective Date: {{ PRIVACY_POLICY.effectiveDate }} | {{ COMPANY_INFO.name }}
        </p>
      </div>
    </div>

    <div class="container">
      <div class="legal-content">
        <div v-for="(sec, idx) in PRIVACY_POLICY.sections" :key="idx" class="legal-section-box">
          <h2 class="section-title">{{ sec.title }}</h2>
          <p class="section-text">{{ sec.content }}</p>
        </div>
      </div>
    </div>
  </main>
  <Footer />
</template>

<style scoped>
.legal-page {
  background: #f8fafc;
  min-height: 80vh;
  padding-bottom: 5rem;
}

.legal-hero {
  background: linear-gradient(135deg, #0b192e 0%, #154194 100%);
  color: #ffffff;
  padding: 4rem 0 3.5rem 0;
  margin-bottom: 3.5rem;
}

.legal-title {
  font-size: 2.6rem;
  font-weight: 800;
  margin-top: 0.5rem;
  margin-bottom: 0.75rem;
}

.legal-subtitle {
  font-size: 1.05rem;
  color: #cbd5e1;
  max-width: 750px;
}

.legal-content {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.legal-section-box {
  background: #ffffff;
  border: 1px solid var(--c-border-light);
  border-radius: 12px;
  padding: 1.85rem 2rem;
  box-shadow: var(--shadow-sm);
}

.section-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--c-navy-deep);
  margin-bottom: 0.75rem;
}

.section-text {
  font-size: 0.98rem;
  color: var(--c-text-dark);
  line-height: 1.65;
  margin: 0;
}
</style>
