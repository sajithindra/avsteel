<script setup lang="ts">
import { PRIVACY_POLICY } from '../data/companyData'
</script>

<template>
  <main class="legal-page">
    <div class="legal-hero">
      <div class="container">
        <span class="badge badge-hero">Privacy &amp; Data Governance</span>
        <h1 class="legal-title">Privacy Policy</h1>
        <p class="legal-subtitle">
          Effective Date: {{ PRIVACY_POLICY.effectiveDate }}
        </p>
      </div>
    </div>

    <div class="container">
      <div class="legal-content">

        <!-- Intro paragraph -->
        <div class="legal-intro-box">
          <p class="intro-text">{{ PRIVACY_POLICY.intro }}</p>
        </div>

        <!-- Numbered sections -->
        <div
          v-for="sec in PRIVACY_POLICY.sections"
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

        <!-- Legal References -->
        <div class="legal-section-box legal-refs-box">
          <h2 class="section-title">{{ PRIVACY_POLICY.legalRefs.title }}</h2>
          <p class="section-text">{{ PRIVACY_POLICY.legalRefs.intro }}</p>
          <div
            v-for="j in PRIVACY_POLICY.legalRefs.jurisdictions"
            :key="j.name"
            class="jurisdiction-block"
          >
            <h3 class="jurisdiction-name">{{ j.name }}</h3>
            <ul class="section-list">
              <li v-for="(law, i) in j.laws" :key="i">{{ law }}</li>
            </ul>
          </div>
          <p class="section-footer">{{ PRIVACY_POLICY.legalRefs.footer }}</p>
        </div>

      </div>

      <p class="copyright-note">
        Last Updated: {{ PRIVACY_POLICY.lastUpdated }} &nbsp;&bull;&nbsp;
        &copy; 2026 AVS Structural Steel Detailing Service. All Rights Reserved.
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

.legal-intro-box {
  background: #eef3fb;
  border: 1px solid var(--c-royal-blue-border, #bfcfef);
  border-left: 4px solid var(--c-royal-blue, #154194);
  border-radius: 10px;
  padding: 1.4rem 1.75rem;
}

.intro-text {
  font-size: 0.97rem;
  color: var(--c-text-dark);
  line-height: 1.7;
  margin: 0;
}

.legal-section-box {
  background: #ffffff;
  border: 1px solid var(--c-border-light);
  border-radius: 12px;
  padding: 1.85rem 2rem;
  box-shadow: var(--shadow-sm);
}

.legal-refs-box {
  background: #f9fafb;
  border-color: var(--c-border-light);
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

.jurisdiction-block {
  margin-top: 1rem;
}

.jurisdiction-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-navy-deep);
  margin-bottom: 0.5rem;
}

.copyright-note {
  max-width: 900px;
  margin: 2.5rem auto 0 auto;
  text-align: center;
  font-size: 0.88rem;
  color: var(--c-text-muted);
}
</style>
