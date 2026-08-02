<script setup lang="ts">
import { reactive, ref } from 'vue'
import { COMPANY_INFO } from '../data/companyData'

const serviceOptions = [
  'Structural Steel Detailing',
  'Miscellaneous Steel Detailing',
  'Connection Design & PE/SE',
  'Metal Deck Detailing',
  'Estimation & Take-Off'
]

const form = reactive({
  name: '',
  email: '',
  phone: '',
  serviceType: 'Structural Steel Detailing',
  message: ''
})

const errors = reactive<Record<string, string>>({
  name: '',
  email: '',
  phone: '',
  message: ''
})

const isSubmitted = ref(false)
const isSubmitting = ref(false)
const copiedField = ref<string | null>(null)

const selectService = (opt: string) => {
  form.serviceType = opt
}

const validateField = (field: 'name' | 'email' | 'phone' | 'message') => {
  if (field === 'name') {
    if (!form.name.trim()) {
      errors.name = 'Full Name is required.'
    } else {
      errors.name = ''
    }
  }

  if (field === 'email') {
    if (!form.email.trim()) {
      errors.email = 'Email address is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address.'
    } else {
      errors.email = ''
    }
  }

  if (field === 'phone') {
    if (!form.phone.trim()) {
      errors.phone = 'Phone number is required.'
    } else if (!/^[0-9+\s\-()]{7,}$/.test(form.phone.trim())) {
      errors.phone = 'Please enter a valid phone number.'
    } else {
      errors.phone = ''
    }
  }

  if (field === 'message') {
    if (!form.message.trim()) {
      errors.message = 'Please describe your project scope.'
    } else if (form.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long.'
    } else {
      errors.message = ''
    }
  }
}

const validateForm = () => {
  validateField('name')
  validateField('email')
  validateField('phone')
  validateField('message')
  return !errors.name && !errors.email && !errors.phone && !errors.message
}

const handleSubmit = () => {
  if (!validateForm()) return
  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    isSubmitted.value = true
  }, 700)
}

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.phone = ''
  form.serviceType = 'Structural Steel Detailing'
  form.message = ''
  errors.name = ''
  errors.email = ''
  errors.phone = ''
  errors.message = ''
  isSubmitted.value = false
}

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text).then(() => {
    copiedField.value = label
    setTimeout(() => {
      copiedField.value = null
    }, 2000)
  }).catch(() => {})
}
</script>

<template>
  <section id="contact" class="contact-section">
    <div class="container">
      <div class="section-header text-center reveal-on-scroll">
        <span class="badge badge-accent">⚡ 24-Hour Quotation Turnaround</span>
        <h2>Ready to Increase Your Detailing Capacity?</h2>
        <p>Submit your project requirements today or contact our engineering team directly.</p>
      </div>

      <div class="contact-grid">
        <!-- Direct Contact Details Card -->
        <div class="contact-info ava-card reveal-on-scroll stagger-1">
          <div class="location-header-tag">{{ COMPANY_INFO.locationHeader }}</div>
          <h3>AVA SSDS Headquarters</h3>
          <p class="address">{{ COMPANY_INFO.address }}</p>

          <div class="info-block">
            <!-- Category: Phone Support -->
            <div class="contact-category">
              <span class="cat-label">Phone Support</span>
              <div class="contact-item">
                <span><strong>Mobile:</strong> {{ COMPANY_INFO.phoneNumbers[0] }}</span>
                <button
                  class="copy-btn"
                  @click="copyToClipboard(COMPANY_INFO.phoneNumbers[0] || '', 'phone-0')"
                  title="Copy mobile number"
                >
                  {{ copiedField === 'phone-0' ? 'Copied!' : 'Copy' }}
                </button>
              </div>

              <div class="contact-item">
                <span><strong>Office:</strong> {{ COMPANY_INFO.phoneNumbers[1] }}</span>
                <button
                  class="copy-btn"
                  @click="copyToClipboard(COMPANY_INFO.phoneNumbers[1] || '', 'phone-1')"
                  title="Copy office number"
                >
                  {{ copiedField === 'phone-1' ? 'Copied!' : 'Copy' }}
                </button>
              </div>
            </div>

            <!-- Category: Email Communications -->
            <div class="contact-category">
              <span class="cat-label">Email Communications</span>
              <div class="contact-item">
                <span><strong>Sales:</strong> {{ COMPANY_INFO.salesEmail }}</span>
                <button
                  class="copy-btn"
                  @click="copyToClipboard(COMPANY_INFO.salesEmail, 'sales-email')"
                  title="Copy sales email"
                >
                  {{ copiedField === 'sales-email' ? 'Copied!' : 'Copy' }}
                </button>
              </div>

              <div class="contact-item">
                <span><strong>HR:</strong> {{ COMPANY_INFO.hrEmail }}</span>
                <button
                  class="copy-btn"
                  @click="copyToClipboard(COMPANY_INFO.hrEmail, 'hr-email')"
                  title="Copy HR email"
                >
                  {{ copiedField === 'hr-email' ? 'Copied!' : 'Copy' }}
                </button>
              </div>

              <div class="contact-item">
                <span><strong>General Queries:</strong> {{ COMPANY_INFO.infoEmail }}</span>
                <button
                  class="copy-btn"
                  @click="copyToClipboard(COMPANY_INFO.infoEmail, 'info-email')"
                  title="Copy general queries email"
                >
                  {{ copiedField === 'info-email' ? 'Copied!' : 'Copy' }}
                </button>
              </div>
            </div>

            <!-- Category: Web Portal -->
            <div class="contact-category">
              <span class="cat-label">Web Portal</span>
              <div class="contact-item">
                <span><strong>Web:</strong> {{ COMPANY_INFO.website }}</span>
              </div>
            </div>
          </div>

          <div class="reg-block">
            <p><strong>UDYAM:</strong> {{ COMPANY_INFO.udyam }}</p>
            <p><strong>GST No:</strong> {{ COMPANY_INFO.gst }}</p>
          </div>
        </div>

        <!-- Inquiry Form Card -->
        <div class="contact-form-box ava-card reveal-on-scroll stagger-2">
          <Transition name="fade-slide" mode="out-in">
            <div v-if="isSubmitted" class="success-message" key="success">
              <div class="success-icon">✓</div>
              <h4>Quote Inquiry Sent</h4>
              <p>Thank you, {{ form.name }}. Your quote request has been routed to <strong>sales@avassds.com</strong>. Our engineering team will review your project requirements and get in touch shortly.</p>
              <button class="btn btn-outline btn-sm" @click="resetForm">Send Another Inquiry</button>
            </div>

            <form v-else @submit.prevent="handleSubmit" novalidate key="form">
              <!-- Service Selection Pills -->
              <div class="form-group">
                <label>Select Required Engineering Service *</label>
                <div class="service-pills-row">
                  <button
                    v-for="opt in serviceOptions"
                    :key="opt"
                    type="button"
                    class="service-select-pill"
                    :class="{ active: form.serviceType === opt }"
                    @click="selectService(opt)"
                  >
                    {{ opt }}
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label for="name">Full Name *</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.name }"
                  placeholder="Your Full Name"
                  @blur="validateField('name')"
                  @input="errors.name && validateField('name')"
                />
                <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="email">Work Email *</label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="form-control"
                    :class="{ 'is-invalid': errors.email }"
                    placeholder="name@company.com"
                    @blur="validateField('email')"
                    @input="errors.email && validateField('email')"
                  />
                  <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
                </div>

                <div class="form-group">
                  <label for="phone">Phone Number *</label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    class="form-control"
                    :class="{ 'is-invalid': errors.phone }"
                    placeholder="+1 (555) 000-0000"
                    @blur="validateField('phone')"
                    @input="errors.phone && validateField('phone')"
                  />
                  <div v-if="errors.phone" class="invalid-feedback">{{ errors.phone }}</div>
                </div>
              </div>

              <div class="form-group">
                <label for="message">Project Scope & Details *</label>
                <textarea
                  id="message"
                  v-model="form.message"
                  rows="3"
                  class="form-control"
                  :class="{ 'is-invalid': errors.message }"
                  placeholder="Describe your project scope, steel tonnage, or required deliverables..."
                  @blur="validateField('message')"
                  @input="errors.message && validateField('message')"
                ></textarea>
                <div v-if="errors.message" class="invalid-feedback">{{ errors.message }}</div>
              </div>

              <button type="submit" class="btn btn-accent w-full submit-cta-btn" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner"></span>
                <span>{{ isSubmitting ? 'Submitting Quotation Request...' : 'Submit Quotation Request' }}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </form>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact-section {
  padding: 5.5rem 0;
  background-color: var(--c-bg-alt);
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 1.5rem;
}

.contact-info {
  position: relative;
}

.location-header-tag {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--c-royal-blue);
  background: var(--c-royal-blue-light);
  border: 1px solid var(--c-royal-blue-border);
  padding: 0.15rem 0.55rem;
  border-radius: 4px;
  margin-bottom: 0.65rem;
}

.contact-info h3 {
  font-size: 1.25rem;
  margin-bottom: 0.4rem;
  color: var(--c-blue-dark);
}

.address {
  color: var(--c-text-muted);
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
  line-height: 1.5;
}

.info-block, .reg-block {
  border-top: 1px solid var(--c-border);
  padding-top: 1rem;
  margin-top: 1rem;
  font-size: 0.88rem;
}

.contact-category {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed var(--c-border);
}

.contact-category:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.cat-label {
  display: block;
  font-size: 0.73rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--c-royal-blue);
  margin-bottom: 0.45rem;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
}

.copy-btn {
  background: var(--c-blue-light);
  border: 1px solid #bae6fd;
  color: var(--c-blue-primary);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.copy-btn:hover {
  background: var(--c-blue-accent);
  color: #ffffff;
  border-color: var(--c-blue-accent);
}

.reg-block p {
  margin-bottom: 0.35rem;
  color: var(--c-text-muted);
}

.reg-block p strong {
  color: var(--c-blue-dark);
}

.service-pills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.35rem;
}

.service-select-pill {
  background: var(--c-bg-alt);
  border: 1px solid var(--c-border);
  padding: 0.45rem 0.85rem;
  border-radius: 20px;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--c-blue-dark);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.service-select-pill:hover {
  border-color: var(--c-royal-blue);
  color: var(--c-royal-blue);
}

.service-select-pill.active {
  background: var(--c-royal-blue);
  color: #ffffff;
  border-color: var(--c-royal-blue);
  box-shadow: 0 4px 12px rgba(21, 65, 148, 0.25);
}

.submit-cta-btn {
  gap: 0.6rem;
  padding: 0.85rem 1.5rem;
  font-size: 0.95rem;
  border-radius: 8px;
}

.w-full {
  width: 100%;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: inline-block;
  margin-right: 0.4rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-message {
  text-align: center;
  padding: 2.25rem 1rem;
}

.success-icon {
  width: 48px;
  height: 48px;
  background: #d1fae5;
  color: #059669;
  font-size: 1.5rem;
  font-weight: 800;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
}

.success-message h4 {
  font-size: 1.25rem;
  margin-bottom: 0.4rem;
  color: var(--c-blue-dark);
}

.success-message p {
  color: var(--c-text-muted);
  font-size: 0.9rem;
  margin-bottom: 1.25rem;
  line-height: 1.5;
}

.btn-sm {
  padding: 0.45rem 0.85rem;
  font-size: 0.82rem;
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

