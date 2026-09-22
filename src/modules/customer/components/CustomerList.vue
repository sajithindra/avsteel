<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCustomerStore } from '../stores/customerStore'
import { useAuthStore } from '../../../stores/auth'

const customerStore = useCustomerStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const isCreateModalOpen = ref(false)
const isSubmitting = ref(false)

// Form fields
const companyName = ref('')
const contactEmail = ref('')
const contactPhone = ref('')
const address = ref('')

// Form errors
const errors = ref({
  companyName: '',
  contactEmail: '',
  contactPhone: '',
  address: ''
})

onMounted(() => {
  customerStore.initCustomerListener()
})

onUnmounted(() => {
  customerStore.stopCustomerListener()
})

const filteredClients = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return customerStore.clients
  return customerStore.clients.filter(
    (c) =>
      c.name.toLowerCase().includes(query) ||
      c.contactEmail.toLowerCase().includes(query) ||
      c.contactPhone.includes(query)
  )
})

const validateForm = (): boolean => {
  let valid = true
  errors.value = { companyName: '', contactEmail: '', contactPhone: '', address: '' }

  if (!companyName.value.trim() || companyName.value.trim().length < 2) {
    errors.value.companyName = 'Company name is required (minimum 2 characters).'
    valid = false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!contactEmail.value.trim() || !emailRegex.test(contactEmail.value.trim())) {
    errors.value.contactEmail = 'A valid corporate contact email is required.'
    valid = false
  }

  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{6,16}$/
  if (!contactPhone.value.trim() || !phoneRegex.test(contactPhone.value.trim())) {
    errors.value.contactPhone = 'Valid primary contact phone is required.'
    valid = false
  }

  if (!address.value.trim() || address.value.trim().length < 5) {
    errors.value.address = 'Official company business address is required.'
    valid = false
  }

  return valid
}

const handleCreateClient = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    await customerStore.createClient({
      name: companyName.value.trim(),
      contactEmail: contactEmail.value.trim(),
      contactPhone: contactPhone.value.trim(),
      address: address.value.trim()
    })
    closeModal()
  } catch (err: any) {
    errors.value.companyName = err.message || 'Failed to create client record.'
  } finally {
    isSubmitting.value = false
  }
}

const openModal = () => {
  companyName.value = ''
  contactEmail.value = ''
  contactPhone.value = ''
  address.value = ''
  errors.value = { companyName: '', contactEmail: '', contactPhone: '', address: '' }
  isCreateModalOpen.value = true
}

const closeModal = () => {
  isCreateModalOpen.value = false
}
</script>

<template>
  <div class="customer-module-container">
    <div class="module-header-row">
      <div>
        <h2>Customer & Fabricator Directory</h2>
        <p class="section-desc">
          Authorized steel fabrication companies, general contractors, and client engineering firms.
        </p>
      </div>
      <button
        v-if="authStore.canManageStaff"
        type="button"
        class="btn btn-primary btn-sm"
        @click="openModal"
      >
        + Register Client Organization
      </button>
    </div>

    <!-- Search Bar -->
    <div class="search-filter-box">
      <input
        type="text"
        class="form-control search-input"
        placeholder="Search client organization by company name, email, or phone..."
        v-model="searchQuery"
      />
    </div>

    <!-- Loading State -->
    <div v-if="customerStore.loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading customer organizations...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredClients.length === 0" class="empty-state-panel">
      <div class="empty-icon"><span class="material-symbols-outlined icon-xxl text-muted">corporate_fare</span></div>
      <h3>No Client Organizations Found</h3>
      <p>
        {{
          searchQuery
            ? 'No registered clients match your search.'
            : 'No client organizations registered yet. Click "Register Client Organization" above to add your first client.'
        }}
      </p>
    </div>

    <!-- Clients Table -->
    <div v-else class="table-responsive ava-card">
      <table class="portal-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Primary Contact Email</th>
            <th>Contact Phone</th>
            <th>Business Address</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in filteredClients" :key="client.id">
            <td>
              <span class="company-name">{{ client.name }}</span>
            </td>
            <td>
              <span class="contact-email">{{ client.contactEmail }}</span>
            </td>
            <td>
              <span class="contact-phone">{{ client.contactPhone }}</span>
            </td>
            <td>
              <span class="address-text">{{ client.address }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Register Modal -->
    <div v-if="isCreateModalOpen" class="modal-backdrop">
      <div class="modal-dialog ava-card animate-fade-in">
        <div class="modal-header">
          <div>
            <h3>Register Client Organization</h3>
            <p class="modal-subtitle">Add a fabricator or contractor organization to the platform</p>
          </div>
          <button class="close-btn" @click="closeModal" aria-label="Close modal">&times;</button>
        </div>

        <form @submit.prevent="handleCreateClient" novalidate>
          <div class="form-group">
            <label for="companyName">Company / Fabricator Name *</label>
            <input
              id="companyName"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.companyName }"
              placeholder="e.g. Apex Structural Fabricators LLC"
              v-model="companyName"
            />
            <span v-if="errors.companyName" class="invalid-feedback">{{ errors.companyName }}</span>
          </div>

          <div class="form-row">
            <div class="form-group col">
              <label for="contactEmail">Official Contact Email *</label>
              <input
                id="contactEmail"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors.contactEmail }"
                placeholder="pm@apexfabricators.com"
                v-model="contactEmail"
              />
              <span v-if="errors.contactEmail" class="invalid-feedback">{{ errors.contactEmail }}</span>
            </div>

            <div class="form-group col">
              <label for="contactPhone">Contact Phone Number *</label>
              <input
                id="contactPhone"
                type="tel"
                class="form-control"
                :class="{ 'is-invalid': errors.contactPhone }"
                placeholder="+1 (555) 234-5678"
                v-model="contactPhone"
              />
              <span v-if="errors.contactPhone" class="invalid-feedback">{{ errors.contactPhone }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="address">Registered Business Address *</label>
            <textarea
              id="address"
              rows="2"
              class="form-control"
              :class="{ 'is-invalid': errors.address }"
              placeholder="e.g. 1024 Industrial Pkwy, Houston, TX 77001"
              v-model="address"
            ></textarea>
            <span v-if="errors.address" class="invalid-feedback">{{ errors.address }}</span>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-outline btn-sm" @click="closeModal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary btn-sm" :disabled="isSubmitting">
              {{ isSubmitting ? 'Registering...' : 'Register Organization' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.customer-module-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.module-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.module-header-row h2 {
  font-size: 1.45rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.25rem;
}

.section-desc {
  font-size: 0.92rem;
  color: var(--c-text-muted);
}

.search-filter-box {
  width: 100%;
}

.table-responsive {
  padding: 0;
  overflow-x: auto;
  border: 1px solid var(--c-border);
  border-radius: 8px;
}

.portal-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.portal-table th {
  background: var(--c-royal-blue-light);
  color: var(--c-royal-blue-dark);
  font-weight: 700;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.85rem 1.15rem;
  border-bottom: 1px solid var(--c-border);
}

.portal-table td {
  padding: 0.95rem 1.15rem;
  border-bottom: 1px solid var(--c-border);
  font-size: 0.9rem;
  color: var(--c-text-dark);
}

.company-name {
  font-weight: 700;
  color: var(--c-blue-dark);
}

.contact-email {
  color: var(--c-royal-blue);
  font-weight: 600;
}

.contact-phone {
  font-family: monospace;
  font-size: 0.88rem;
}

.address-text {
  color: var(--c-text-muted);
  font-size: 0.86rem;
}

.empty-state-panel {
  text-align: center;
  padding: 3.5rem 2rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px dashed var(--c-border);
}

.empty-icon {
  font-size: 2.75rem;
  margin-bottom: 0.75rem;
}

.empty-state-panel h3 {
  font-size: 1.15rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.35rem;
}

.empty-state-panel p {
  color: var(--c-text-muted);
  font-size: 0.9rem;
  max-width: 480px;
  margin: 0 auto;
}

.loading-state {
  text-align: center;
  padding: 3rem;
  color: var(--c-text-muted);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(21, 65, 148, 0.1);
  border-top-color: var(--c-royal-blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Modal styles */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(11, 25, 46, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-dialog {
  background: #ffffff;
  max-width: 580px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(15, 41, 66, 0.25);
  padding: 1.75rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--c-border);
  padding-bottom: 1rem;
  margin-bottom: 1.25rem;
}

.modal-header h3 {
  font-size: 1.35rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.2rem;
}

.modal-subtitle {
  font-size: 0.88rem;
  color: var(--c-text-muted);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.75rem;
  color: var(--c-text-muted);
  cursor: pointer;
  line-height: 1;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.col {
  flex: 1;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid var(--c-border);
  padding-top: 1rem;
  margin-top: 1rem;
}

.invalid-feedback {
  display: block;
  font-size: 0.8rem;
  color: #dc2626;
  margin-top: 0.25rem;
  font-weight: 600;
}
</style>
