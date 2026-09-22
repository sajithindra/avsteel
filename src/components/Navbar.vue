<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { COMPANY_INFO } from '../data/companyData'
import { useIntersectionObserver } from '../composables/useIntersectionObserver'

const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const { activeSectionId } = useIntersectionObserver()

const navLinks = [
  { name: 'Services', href: '/#services', id: 'services' },
  { name: 'Portfolio', href: '/portfolio', id: 'portfolio' },
  { name: 'Challenges', href: '/#challenges', id: 'challenges' },
  { name: 'Why AVA', href: '/#usps', id: 'usps' },
  { name: 'PE/SE Stamping', href: '/#stamping', id: 'stamping' },
  { name: 'Work Process', href: '/#process', id: 'process' },
  { name: 'About Us', href: '/#about', id: 'about' },
  { name: 'Contact', href: '/#contact', id: 'contact' }
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (isMobileMenuOpen.value) isMobileMenuOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': isScrolled }">
    <!-- Main Navigation -->
    <nav class="main-nav">
      <div class="nav-inner">
        <!-- Logo -->
        <a href="#" class="brand-logo">
          <span class="logo-box">AVA</span>
          <div class="brand-text">
            <span class="brand-name">{{ COMPANY_INFO.shortName }}</span>
            <span class="brand-sub">{{ COMPANY_INFO.name }}</span>
          </div>
        </a>

        <!-- Right Side: Menu + Actions -->
        <div class="nav-right">
          <!-- Menu -->
          <ul class="nav-menu">
            <li v-for="link in navLinks" :key="link.name">
              <a
                :href="link.href"
                class="nav-link"
                :class="{ active: activeSectionId === link.id }"
              >
                {{ link.name }}
              </a>
            </li>
          </ul>

          <!-- Action CTA with Sign In Link & Primary CTA (Single State) -->
          <div class="nav-actions">
            <router-link to="/signin" class="signin-text-link desktop-only">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <span>Sign In</span>
            </router-link>

            <a href="/#contact" class="btn btn-accent btn-sm desktop-only">Request Quote</a>
            
            <button
              class="mobile-toggle"
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              :aria-expanded="isMobileMenuOpen"
              aria-label="Toggle navigation"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="22" height="22">
                <path v-if="!isMobileMenuOpen" d="M4 6h16M4 12h16M4 18h16"/>
                <path v-else d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Drawer -->
      <Transition name="fade-slide">
        <div class="mobile-menu" v-if="isMobileMenuOpen">
          <ul class="mobile-nav-list">
            <li v-for="link in navLinks" :key="link.name">
              <a
                :href="link.href"
                class="mobile-link"
                :class="{ active: activeSectionId === link.id }"
                @click="isMobileMenuOpen = false"
              >
                <span>{{ link.name }}</span>
                <span class="link-arrow">›</span>
              </a>
            </li>
          </ul>

          <div class="mobile-actions-box">
            <a href="/#contact" class="btn btn-accent w-full" @click="isMobileMenuOpen = false">
              Request Quote
            </a>
            <router-link to="/signin" class="btn btn-outline w-full" @click="isMobileMenuOpen = false">
              Sign In
            </router-link>
          </div>
        </div>
      </Transition>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: var(--c-surface);
  border-bottom: 1px solid var(--c-border);
  box-shadow: 0 2px 4px rgba(15, 41, 66, 0.04);
  transition: box-shadow var(--transition-normal), background-color var(--transition-normal);
}

.site-header.is-scrolled {
  box-shadow: 0 10px 25px -5px rgba(15, 41, 66, 0.12);
  background-color: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(8px);
}

.main-nav {
  padding: 0.9rem 0;
  background-color: transparent;
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 100%;
  padding-left: 2rem;
  padding-right: 2rem;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: transform var(--transition-fast);
}

.brand-logo:hover {
  transform: translateY(-1px);
}

.logo-box {
  background: var(--c-royal-blue);
  color: #ffffff;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.15rem;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--c-royal-blue-accent);
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--c-blue-dark);
  line-height: 1.1;
}

.brand-sub {
  font-size: 0.75rem;
  color: var(--c-text-muted);
  font-weight: 500;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}

.nav-link {
  position: relative;
  text-decoration: none;
  color: var(--c-blue-dark);
  font-weight: 600;
  font-size: 0.9rem;
  transition: color var(--transition-fast);
  padding: 0.25rem 0;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--c-royal-blue);
  transition: width var(--transition-normal);
  border-radius: 2px;
}

.nav-link:hover,
.nav-link.active {
  color: var(--c-royal-blue);
}

.nav-link.active::after,
.nav-link:hover::after {
  width: 100%;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.signin-text-link {
  background: transparent;
  border: none;
  color: var(--c-blue-dark);
  font-weight: 600;
  font-size: 0.88rem;
  font-family: var(--font-body);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  transition: color var(--transition-fast), background-color var(--transition-fast);
}

.signin-text-link:hover {
  color: var(--c-royal-blue);
  background-color: var(--c-royal-blue-light);
}

.mobile-toggle {
  display: none;
}

.mobile-menu {
  display: none;
}

.w-full {
  width: 100%;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.signin-modal-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid var(--c-border);
  box-shadow: 0 25px 50px -12px rgba(15, 41, 66, 0.35);
  max-width: 460px;
  width: 100%;
  padding: 0;
  overflow: hidden;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.signin-modal-header {
  background: linear-gradient(135deg, var(--c-royal-blue-dark) 0%, var(--c-royal-blue) 100%);
  padding: 1.5rem 1.75rem;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-brand-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.header-icon-box {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  color: #ffffff;
}

.portal-tag {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #93c5fd;
  margin-bottom: 0.1rem;
}

.signin-modal-header h3 {
  color: #ffffff;
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
}

.signin-close-btn {
  background: rgba(255, 255, 255, 0.12);
  border: none;
  color: #ffffff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: background 0.2s ease;
}

.signin-close-btn:hover {
  background: rgba(255, 255, 255, 0.28);
}

.signin-modal-body {
  padding: 1.75rem;
}

.signin-sub {
  font-size: 0.88rem;
  color: var(--c-text-muted);
  margin-bottom: 1.25rem;
  line-height: 1.5;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.85rem;
  color: var(--c-text-muted);
  pointer-events: none;
}

.padded-input {
  padding-left: 2.6rem !important;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
}

.forgot-link {
  font-size: 0.78rem;
  color: var(--c-royal-blue);
  font-weight: 600;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.eye-btn {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  padding: 0.2rem;
  opacity: 0.75;
}

.eye-btn:hover {
  opacity: 1;
}

.form-remember-row {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.84rem;
  color: var(--c-text-muted);
  cursor: pointer;
}

.signin-submit-btn {
  gap: 0.6rem;
  font-size: 0.95rem;
  padding: 0.85rem 1.5rem;
}

@media (max-width: 900px) {
  .nav-inner {
    padding-left: 1.15rem;
    padding-right: 1.15rem;
  }

  .nav-menu,
  .desktop-only {
    display: none !important;
  }

  .mobile-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background: var(--c-royal-blue-light);
    color: var(--c-royal-blue);
    border: 1px solid var(--c-royal-blue-border);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .mobile-toggle:hover {
    background: var(--c-royal-blue);
    color: #ffffff;
  }

  .mobile-menu {
    display: block;
    background-color: #ffffff;
    border-top: 1px solid var(--c-border-light);
    padding: 1.25rem 1.15rem 1.5rem 1.15rem;
    box-shadow: 0 20px 30px rgba(15, 41, 66, 0.15);
  }

  .mobile-nav-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1.25rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .mobile-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    text-decoration: none;
    color: var(--c-navy-deep);
    font-weight: 600;
    font-size: 0.95rem;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
  }

  .mobile-link:hover,
  .mobile-link.active {
    background: var(--c-royal-blue-light);
    color: var(--c-royal-blue);
    border-color: var(--c-royal-blue-border);
    font-weight: 700;
  }

  .link-arrow {
    font-size: 1.2rem;
    color: #94a3b8;
  }

  .mobile-link.active .link-arrow {
    color: var(--c-royal-blue);
  }

  .mobile-actions-box {
    border-top: 1px solid var(--c-border-light);
    padding-top: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }
}
</style>
