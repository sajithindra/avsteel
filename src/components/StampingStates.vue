<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { STAMPING_STATES, type StampingState } from '../data/companyData'

const selectedState = ref<StampingState | null>(null)
const searchQuery = ref('')
const selectedType = ref<'ALL' | 'PE' | 'SE'>('ALL')

const filteredStates = computed(() => {
  return STAMPING_STATES.filter(state => {
    const matchesSearch = state.name.toLowerCase().includes(searchQuery.value.trim().toLowerCase())
    const matchesType = selectedType.value === 'ALL' || state.types.includes(selectedType.value)
    return matchesSearch && matchesType
  })
})

const openStateModal = (state: StampingState) => {
  selectedState.value = state
}

const closeModal = () => {
  selectedState.value = null
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && selectedState.value) {
    closeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <section id="stamping" class="stamping-section">
    <div class="container">
      <div class="section-header reveal-on-scroll">
        <span class="badge">Licensed Network</span>
        <h2>27 US Engineering Stamping States <span class="header-stamp-tag">PE / SE</span></h2>
        <p class="section-lead">
          Delivering AISC &amp; IBC compliant PE/SE sealed structural calculations, connection engineering, and stamped shop drawing packages across 27 US states.
        </p>
      </div>

      <!-- Interactive Filter & Search Bar -->
      <div class="filter-bar reveal-on-scroll stagger-1">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Search state name..."
          />
          <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''" aria-label="Clear search">
            <span class="material-symbols-outlined icon-xs">close</span>
          </button>
        </div>

        <div class="filter-buttons">
          <button
            class="filter-btn"
            :class="{ active: selectedType === 'ALL' }"
            @click="selectedType = 'ALL'"
          >
            All States ({{ STAMPING_STATES.length }})
          </button>
          <button
            class="filter-btn"
            :class="{ active: selectedType === 'SE' }"
            @click="selectedType = 'SE'"
          >
            SE Certified
          </button>
          <button
            class="filter-btn"
            :class="{ active: selectedType === 'PE' }"
            @click="selectedType = 'PE'"
          >
            PE Certified
          </button>
        </div>
      </div>

      <!-- State Pills Flex List -->
      <div class="states-flex reveal-on-scroll stagger-2">
        <button
          v-for="state in filteredStates"
          :key="state.name"
          class="state-pill"
          @click="openStateModal(state)"
          :aria-label="`View ${state.name} engineering stamp details`"
        >
          <span class="state-name">{{ state.name }}</span>
          <span class="state-badge" :class="{ 'se-badge': state.types.includes('SE') }">
            {{ state.types }}
          </span>
        </button>

        <div v-if="filteredStates.length === 0" class="empty-states">
          <p>No matching states found for "{{ searchQuery }}".</p>
          <button class="btn btn-outline btn-sm" @click="searchQuery = ''; selectedType = 'ALL'">Reset Filters</button>
        </div>
      </div>

      <!-- Interactive State Detail Modal -->
      <Transition name="modal">
        <div v-if="selectedState" class="modal-backdrop" @click.self="closeModal">
          <div class="modal-content">
            <div class="modal-header">
              <h3>{{ selectedState.name }} Engineering License</h3>
              <button class="close-btn" @click="closeModal" aria-label="Close modal">
                <span class="material-symbols-outlined icon-sm">close</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="modal-badge-row">
                <span class="badge">State Coverage</span>
                <span class="state-badge lg-badge" :class="{ 'se-badge': selectedState.types.includes('SE') }">
                  {{ selectedState.types }} Certified
                </span>
              </div>
              <p class="modal-desc">
                AVA SSDS provides PE/SE sealed structural calculations and connection drawings compliant with {{ selectedState.name }} building codes & AISC standards.
              </p>
              <div class="modal-details-list">
                <div class="modal-detail-item">
                  <strong>Stamping Authority:</strong> {{ selectedState.types.includes('SE') ? 'Structural Engineer (SE) & Professional Engineer (PE)' : 'Professional Engineer (PE)' }}
                </div>
                <div class="modal-detail-item">
                  <strong>Code Compliance:</strong> AISC 360 / AISC 341 / IBC / State Building Code
                </div>
                <div class="modal-detail-item">
                  <strong>Deliverable:</strong> Stamped Calculation Packages & Sealed Shop Drawings
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <a href="#contact" class="btn btn-accent w-full" @click="closeModal">
                Request {{ selectedState.name }} Sealed Calculation
              </a>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.stamping-section {
  padding: 5.5rem 0;
  background-color: var(--c-bg-white);
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  max-width: 960px;
  margin: 0 auto 2rem auto;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 240px;
}

.search-icon {
  position: absolute;
  left: 0.85rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--c-text-muted);
}

.search-input {
  width: 100%;
  padding: 0.65rem 2.2rem 0.65rem 2.5rem;
  font-size: 0.88rem;
  font-family: var(--font-body);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  background: var(--c-surface);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--c-blue-accent);
  box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--c-text-muted);
  cursor: pointer;
  font-size: 0.85rem;
}

.filter-buttons {
  display: flex;
  gap: 0.4rem;
}

.filter-btn {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  padding: 0.55rem 0.9rem;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-btn:hover {
  border-color: var(--c-blue-accent);
  color: var(--c-blue-primary);
}

.filter-btn.active {
  background: var(--c-blue-primary);
  color: #ffffff;
  border-color: var(--c-blue-primary);
}

.header-stamp-tag {
  white-space: nowrap;
  display: inline-block;
  font-size: 0.78em;
  background: var(--c-royal-blue-light);
  color: var(--c-royal-blue);
  padding: 0.15rem 0.65rem;
  border-radius: 6px;
  border: 1px solid var(--c-royal-blue-border);
  vertical-align: middle;
  margin-left: 0.4rem;
  font-weight: 700;
}

.section-lead {
  max-width: 720px;
  margin: 0.6rem auto 0 auto;
  line-height: 1.6;
  font-size: 1.02rem;
  color: var(--c-text-muted);
}

.states-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  justify-content: center;
  max-width: 960px;
  margin: 0 auto;
  min-height: 120px;
}

.state-pill {
  position: relative;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  padding: 0.55rem 0.95rem;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.88rem;
  font-family: var(--font-body);
  cursor: pointer;
  transition: transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  will-change: transform;
}

.state-pill:hover {
  transform: scale(1.18) translateY(-4px);
  border-color: var(--c-royal-blue);
  background-color: #ffffff;
  box-shadow: 0 12px 24px -4px rgba(21, 65, 148, 0.22);
  z-index: 10;
}

.state-name {
  font-weight: 600;
  color: var(--c-blue-dark);
  display: inline-block;
  transition: transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s ease;
  will-change: transform;
}

.state-pill:hover .state-name {
  transform: scale(1.08);
  color: var(--c-royal-blue);
  font-weight: 700;
}

.state-badge {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--c-blue-primary);
  background: var(--c-blue-light);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  border: 1px solid #bae6fd;
  transition: transform 0.32s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.state-pill:hover .state-badge {
  transform: scale(1.05);
}

.se-badge {
  color: var(--c-gold);
  background: #fffbe6;
  border-color: #fef08a;
}

.empty-states {
  text-align: center;
  padding: 2.5rem 0;
  color: var(--c-text-muted);
}

.empty-states p {
  margin-bottom: 1rem;
}

/* Modal styles */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--c-border);
  padding-bottom: 0.75rem;
}

.modal-header h3 {
  font-size: 1.25rem;
  color: var(--c-blue-dark);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--c-text-muted);
  padding: 0.2rem 0.5rem;
}

.modal-badge-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.lg-badge {
  font-size: 0.8rem;
  padding: 0.2rem 0.6rem;
}

.modal-desc {
  color: var(--c-text-muted);
  font-size: 0.92rem;
  line-height: 1.5;
  margin-bottom: 1.25rem;
}

.modal-details-list {
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: 1.5rem;
  font-size: 0.85rem;
}

.modal-detail-item {
  color: var(--c-text-dark);
}

.modal-detail-item strong {
  color: var(--c-blue-primary);
}

.btn-sm {
  padding: 0.45rem 0.85rem;
  font-size: 0.82rem;
}

.w-full {
  width: 100%;
}

@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

