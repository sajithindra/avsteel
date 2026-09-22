<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { COMPANY_INFO } from '../data/companyData'
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <h3 class="footer-logo">{{ COMPANY_INFO.shortName }}</h3>
          <p class="footer-desc">{{ COMPANY_INFO.name }}</p>
          <p class="tagline-text">{{ COMPANY_INFO.tagline }}</p>
        </div>

        <div>
          <h4>Navigation</h4>
          <ul class="footer-links">
            <li><a href="/#about">About Us</a></li>
            <li><a href="/#services">Services</a></li>
            <li><RouterLink to="/portfolio">Portfolio</RouterLink></li>
            <li><a href="/#challenges">Challenges We Solve</a></li>
            <li><a href="/#usps">Why Choose AVA</a></li>
            <li><a href="/#stamping">PE/SE Stamping</a></li>
            <li><a href="/#process">Work Process</a></li>
            <li><a href="/#contact">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4>Legal & Head Office ({{ COMPANY_INFO.locationHeader }})</h4>
          <p class="footer-text">{{ COMPANY_INFO.address }}</p>
          <p class="footer-text">Email: {{ COMPANY_INFO.email }}</p>
          <p class="footer-text">Phone: {{ COMPANY_INFO.phoneNumbers[0] }}, {{ COMPANY_INFO.phoneNumbers[1] }}</p>
          <div class="legal-links-row">
            <RouterLink to="/terms">Terms & Conditions</RouterLink> | 
            <RouterLink to="/privacy">Privacy Policy</RouterLink>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} {{ COMPANY_INFO.name }}. All Rights Reserved.</p>
        <p class="footer-credits">
          Imagined by <span class="credit-highlight">Sajithindra</span> &bull; Developed by <span class="credit-highlight">Survmonx LLP</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background-color: var(--c-blue-dark);
  color: #e2e8f0;
  padding: 3.5rem 0 1.5rem 0;
  font-size: 0.9rem;
  border-top: 3px solid var(--c-royal-blue);
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1.6fr;
  gap: 2rem;
  margin-bottom: 2.25rem;
}

.footer-logo {
  color: #ffffff;
  font-size: 1.35rem;
  font-weight: 800;
  margin-bottom: 0.3rem;
  letter-spacing: -0.01em;
}

.footer-desc {
  color: #f1f5f9;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

.tagline-text {
  font-size: 0.84rem;
  color: #93c5fd;
  font-style: italic;
}

.footer-grid h4 {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.footer-links a {
  color: #cbd5e1;
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: #60a5fa;
}

.footer-text {
  color: #e2e8f0;
  line-height: 1.55;
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
}

.legal-links-row {
  margin-top: 0.85rem;
  font-size: 0.86rem;
  color: #94a3b8;
}

.legal-links-row a {
  color: #60a5fa;
  text-decoration: none;
  font-weight: 600;
}

.legal-links-row a:hover {
  text-decoration: underline;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding-top: 1.25rem;
  text-align: center;
  font-size: 0.82rem;
  color: #94a3b8;
}

.footer-credits {
  margin-top: 0.35rem;
  font-size: 0.82rem;
  color: #cbd5e1;
}

.credit-highlight {
  color: #ffffff;
  font-weight: 600;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
