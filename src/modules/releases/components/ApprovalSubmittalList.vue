<script setup lang="ts">
import { ref, computed } from 'vue'
import { useReleasesStore } from '../stores/releasesStore'
import { useAuthStore } from '../../../stores/auth'
import type { DrawingTransmittal } from '../../../types/portal'
import DrawingTransmittalModal from './DrawingTransmittalModal.vue'
import ClientReviewActionModal from './ClientReviewActionModal.vue'

const props = defineProps<{
  projectId: string
}>()

const releasesStore = useReleasesStore()
const authStore = useAuthStore()

const isCreateTransmittalOpen = ref(false)
const reviewingTransmittal = ref<DrawingTransmittal | null>(null)

const approvalTransmittals = computed(() =>
  releasesStore.transmittals.filter((t) => t.purpose === 'Approval')
)

const openReviewModal = (t: DrawingTransmittal) => {
  reviewingTransmittal.value = t
}
</script>

<template>
  <div class="submittals-module-container">
    <div class="module-header-row">
      <div>
        <h3>Approval Package Submittals</h3>
        <p class="section-desc">
          Formal drawing transmittals submitted for client engineering review, EOR markup, and approval sign-off.
        </p>
      </div>

      <button
        v-if="authStore.isInternalStaff"
        type="button"
        class="btn btn-primary btn-sm"
        @click="isCreateTransmittalOpen = true"
      >
        + Issue Approval Transmittal
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="approvalTransmittals.length === 0" class="empty-state-panel">
      <div class="empty-icon"><span class="material-symbols-outlined icon-xxl text-muted">inventory_2</span></div>
      <h4>No Approval Packages Submitted</h4>
      <p>
        {{
          authStore.isClientStaff
            ? 'No approval packages have been submitted for your review yet. When AVA issues a drawing transmittal, it will appear here.'
            : 'No approval packages submitted yet. Complete model checking, then click "Issue Approval Transmittal" above.'
        }}
      </p>
    </div>

    <!-- Transmittals List -->
    <div v-else class="transmittals-grid">
      <div
        v-for="t in approvalTransmittals"
        :key="t.id"
        class="transmittal-card ava-card"
      >
        <div class="t-top-row">
          <div class="t-number-group">
            <strong class="t-num">{{ t.transmittalNumber }}</strong>
            <span class="rev-tag">{{ t.revision }}</span>
          </div>

          <div class="action-badge-box">
            <span v-if="t.clientAction" class="status-badge" :data-action="t.clientAction">
              {{ t.clientAction }}
            </span>
            <span v-else class="status-badge status-awaiting">
              <span class="material-symbols-outlined icon-xs text-warning">schedule</span>
              <span>Awaiting Client Review</span>
            </span>
          </div>
        </div>

        <h4 class="t-title">{{ t.title }}</h4>

        <div v-if="t.notes" class="t-notes">
          {{ t.notes }}
        </div>

        <div class="documents-section">
          <span class="doc-header">Transmitted Drawing Packages:</span>
          <ul class="doc-list">
            <li v-for="d in t.documentsList" :key="d">
              <span class="material-symbols-outlined icon-xs text-primary">check</span>
              <span>{{ d }}</span>
            </li>
          </ul>
        </div>

        <!-- Client Action Display / Button -->
        <div class="t-footer-row">
          <div v-if="t.clientAction" class="client-decision-summary">
            <span class="decision-author">Signed off by {{ t.clientActionByUserName }}</span>
            <p v-if="t.clientActionNotes" class="decision-notes">"{{ t.clientActionNotes }}"</p>
          </div>

          <div v-else-if="authStore.isClientStaff" class="action-btn-box">
            <button
              type="button"
              class="btn btn-accent btn-sm"
              @click="openReviewModal(t)"
            >
              <span class="material-symbols-outlined icon-xs">draw</span>
              <span>Review & Sign Off</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Issue Transmittal Modal -->
    <DrawingTransmittalModal
      v-if="isCreateTransmittalOpen"
      :project-id="projectId"
      purpose="Approval"
      :is-open="isCreateTransmittalOpen"
      @close="isCreateTransmittalOpen = false"
      @created="isCreateTransmittalOpen = false"
    />

    <!-- Client Review Action Modal -->
    <ClientReviewActionModal
      v-if="reviewingTransmittal"
      :project-id="projectId"
      :transmittal="reviewingTransmittal"
      :is-open="!!reviewingTransmittal"
      @close="reviewingTransmittal = null"
      @completed="reviewingTransmittal = null"
    />
  </div>
</template>

<style scoped>
.submittals-module-container {
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

.module-header-row h3 {
  font-size: 1.3rem;
  color: var(--c-blue-dark);
}

.section-desc {
  font-size: 0.88rem;
  color: var(--c-text-muted);
}

.transmittals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.25rem;
}

.transmittal-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.t-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.t-number-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.t-num {
  font-family: monospace;
  font-size: 0.95rem;
  color: var(--c-royal-blue-dark);
}

.rev-tag {
  font-size: 0.76rem;
  font-weight: 800;
  padding: 0.15rem 0.55rem;
  background: var(--c-royal-blue-light);
  color: var(--c-royal-blue);
  border-radius: 4px;
}

.status-badge {
  font-size: 0.76rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
}

.status-awaiting {
  background: #fffbeb;
  color: #b45309;
}

.status-badge[data-action="Approve"] {
  background: #ecfdf5;
  color: #047857;
}

.status-badge[data-action="Approve as Noted"] {
  background: #eff6ff;
  color: #1d4ed8;
}

.status-badge[data-action="Revise and Resubmit"] {
  background: #fff7ed;
  color: #c2410c;
}

.status-badge[data-action="Reject"] {
  background: #fef2f2;
  color: #dc2626;
}

.t-title {
  font-size: 1.1rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.t-notes {
  font-size: 0.86rem;
  color: var(--c-text-muted);
  background: #f8fafc;
  padding: 0.65rem 0.85rem;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.documents-section {
  margin-bottom: 1.25rem;
}

.doc-header {
  display: block;
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--c-text-muted);
  text-transform: uppercase;
  margin-bottom: 0.35rem;
}

.doc-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.84rem;
  color: var(--c-text-dark);
}

.t-footer-row {
  border-top: 1px solid var(--c-border);
  padding-top: 0.85rem;
  display: flex;
  justify-content: flex-end;
}

.client-decision-summary {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
  width: 100%;
}

.decision-author {
  font-size: 0.78rem;
  color: var(--c-text-muted);
}

.decision-notes {
  font-size: 0.84rem;
  color: var(--c-text-dark);
  font-style: italic;
  text-align: right;
}

.empty-state-panel {
  text-align: center;
  padding: 3rem 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px dashed var(--c-border);
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.empty-state-panel h4 {
  font-size: 1.1rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.25rem;
}

.empty-state-panel p {
  color: var(--c-text-muted);
  font-size: 0.88rem;
  max-width: 480px;
  margin: 0 auto;
}
</style>
