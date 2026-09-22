<script setup lang="ts">
import { TERMS_AND_CONDITIONS, COMPANY_INFO } from '../data/companyData'
</script>

<template>
  <main class="legal-page">
    <div class="legal-hero">
      <div class="container">
        <span class="badge badge-hero">Legal &amp; Operating Framework</span>
        <h1 class="legal-title">Terms &amp; Conditions</h1>
        <p class="legal-subtitle">
          Effective Date: {{ TERMS_AND_CONDITIONS.effectiveDate }} &mdash; Standard governing terms
          for project execution, quality assurance, revisions, and commercial deliverables at
          {{ COMPANY_INFO.name }}.
        </p>
      </div>
    </div>

    <div class="container">
      <div class="legal-content">
        <div
          v-for="sec in TERMS_AND_CONDITIONS.sections"
          :key="sec.num"
          class="legal-section-box"
        >
          <h2 class="section-title">{{ sec.num }}. {{ sec.title }}</h2>
          <p class="section-text">{{ sec.content }}</p>
          <ul v-if="sec.items" class="section-list">
            <li v-for="(item, i) in sec.items" :key="i">{{ item }}</li>
          </ul>
          <p v-if="sec.footer" class="section-footer">{{ sec.footer }}</p>
        </div>
      </div>

      <p class="copyright-note">
        &copy; 2026 AVA Structural Steel Detailing Services LLP. All Rights Reserved.
      </p>
    </div>
  </main>
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
  margin: 0 0 0.5rem 0;
}

.section-list {
  margin: 0.5rem 0 0.5rem 1.25rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.section-list li {
  font-size: 0.97rem;
  color: var(--c-text-dark);
  line-height: 1.6;
}

.section-footer {
  font-size: 0.95rem;
  color: var(--c-text-muted);
  margin: 0.75rem 0 0 0;
  font-style: italic;
}

.copyright-note {
  max-width: 900px;
  margin: 2.5rem auto 0 auto;
  text-align: center;
  font-size: 0.88rem;
  color: var(--c-text-muted);
}
</style>
