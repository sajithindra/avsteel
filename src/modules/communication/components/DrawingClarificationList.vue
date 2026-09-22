<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCommunicationStore } from '../stores/communicationStore'
import { useProjectStore } from '../../project/stores/projectStore'
import { useAuthStore } from '../../../stores/auth'
import type { DrawingClarification } from '../../../types/portal'

const props = defineProps<{
  projectId: string
}>()

const communicationStore = useCommunicationStore()
const projectStore = useProjectStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const isCreateModalOpen = ref(false)
const isSubmitting = ref(false)

// Form fields
const subject = ref('')
const selectedDrawingId = ref('')
const description = ref('')
const errors = ref({ subject: '', drawingReference: '', description: '' })

// Response state
const respondingToClarification = ref<DrawingClarification | null>(null)
const responseText = ref('')
const responseError = ref('')
const isSubmittingResponse = ref(false)

const availableDrawings = computed(() => projectStore.activeProjectDrawings)

const filteredClarifications = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return communicationStore.clarifications.filter((c) => {
    return (
      !query ||
      c.clarificationNumber.toLowerCase().includes(query) ||
      c.subject.toLowerCase().includes(query) ||
      c.drawingReferenceLabel.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query)
    )
  })
})

const validateForm = (): boolean => {
  let valid = true
  errors.value = { subject: '', drawingReference: '', description: '' }

  if (!subject.value.trim() || subject.value.trim().length < 5) {
    errors.value.subject = 'Clarification subject is required (minimum 5 characters).'
    valid = false
  }

  if (!selectedDrawingId.value) {
    errors.value.drawingReference = 'Please select a drawing reference from the project drawing register.'
    valid = false
  }

  if (!description.value.trim() || description.value.trim().length < 15) {
    errors.value.description = 'Please provide detailed description of the Architectural vs Structural mismatch (minimum 15 characters).'
    valid = false
  }

  return valid
}

const handleCreateClarification = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  const drawing = availableDrawings.value.find((d) => d.id === selectedDrawingId.value)
  const drawingLabel = drawing
    ? `${drawing.discipline}: ${drawing.sheetNumber} - ${drawing.sheetTitle}`
    : 'System Drawing Reference'

  try {
    await communicationStore.createDrawingClarification(props.projectId, {
      subject: subject.value.trim(),
      drawingReferenceId: selectedDrawingId.value,
      drawingReferenceLabel: drawingLabel,
      description: description.value.trim(),
      submittedByUserId: authStore.user?.uid || '',
      submittedByUserName: authStore.profile?.name || authStore.user?.email || 'Authorized User'
    })
    closeModal()
  } catch (err: any) {
    errors.value.subject = err.message || 'Failed to submit clarification.'
  } finally {
    isSubmitting.value = false
  }
}

const openResponseModal = (clr: DrawingClarification) => {
  respondingToClarification.value = clr
  responseText.value = clr.clientResponse || ''
  responseError.value = ''
}

const handleResponseSubmit = async () => {
  if (!respondingToClarification.value) return
  if (!responseText.value.trim() || responseText.value.trim().length < 5) {
    responseError.value = 'Please provide a clear resolution response.'
    return
  }

  isSubmittingResponse.value = true
  try {
    await communicationStore.submitClarificationResponse(
      props.projectId,
      respondingToClarification.value.id,
      responseText.value.trim(),
      authStore.profile?.name || authStore.user?.email || 'Client Representative'
    )
    respondingToClarification.value = null
  } catch (err: any) {
    responseError.value = err.message || 'Failed to submit response.'
  } finally {
    isSubmittingResponse.value = false
  }
}

const openModal = () => {
  subject.value = ''
  selectedDrawingId.value = ''
  description.value = ''
  errors.value = { subject: '', drawingReference: '', description: '' }
  isCreateModalOpen.value = true
}

const closeModal = () => {
  isCreateModalOpen.value = false
}
</script>

<template>
  <div class="clarifications-container">
    <div class="module-header-row">
      <div>
        <h3>Drawing Clarifications</h3>
        <p class="section-desc">
          Formal resolution log for discrepancies and mismatches between Architectural and Structural drawings.
        </p>
      </div>
      <button type="button" class="btn btn-primary btn-sm" @click="openModal">
        + Raise Drawing Clarification
      </button>
    </div>

    <!-- Search Bar -->
    <div class="search-filter-box">
      <input
        type="text"
        class="form-control search-input"
        placeholder="Search clarification by number (e.g. Drawing Clarification #001), drawing sheet, or subject..."
        v-model="searchQuery"
      />
    </div>

    <!-- Empty State -->
    <div v-if="filteredClarifications.length === 0" class="empty-state-panel">
      <div class="empty-icon"><span class="material-symbols-outlined icon-xxl text-muted">balance</span></div>
      <h4>No Drawing Clarifications Logged</h4>
      <p>
        {{
          searchQuery
            ? 'No clarifications match your search criteria.'
            : 'No drawing discrepancies logged for this project. If an Architectural and Structural drawing mismatch is discovered, click "Raise Drawing Clarification" above.'
        }}
      </p>
    </div>

    <!-- Clarifications Cards -->
    <div v-else class="clarifications-grid">
      <div
        v-for="clr in filteredClarifications"
        :key="clr.id"
        class="clarification-card ava-card"
      >
        <div class="clr-header">
          <strong class="clr-num">{{ clr.clarificationNumber }}</strong>
          <span
            class="status-pill"
            :class="clr.status === 'Resolved & Closed' ? 'status-resolved' : 'status-open'"
          >
            {{ clr.status }}
          </span>
        </div>

        <h4 class="clr-subject">{{ clr.subject }}</h4>

        <div class="drawing-callout">
          <span class="ref-label">Drawing Sheet:</span>
          <span class="ref-value">{{ clr.drawingReferenceLabel }}</span>
        </div>

        <p class="clr-desc">{{ clr.description }}</p>

        <!-- Client Response Display -->
        <div v-if="clr.clientResponse" class="clr-response-box">
          <div class="resp-header">
            <strong>Resolution Directives:</strong>
            <span class="resp-meta">{{ clr.respondedByUserName }}</span>
          </div>
          <p>{{ clr.clientResponse }}</p>
        </div>
        <div v-else class="awaiting-bar">
          <span><span class="material-symbols-outlined icon-xs text-warning">schedule</span> Awaiting clarification from client / architect.</span>
          <button
            type="button"
            class="btn btn-outline btn-sm"
            @click="openResponseModal(clr)"
          >
            Respond & Resolve
          </button>
        </div>
      </div>
    </div>

    <!-- Raise Clarification Modal -->
    <div v-if="isCreateModalOpen" class="modal-backdrop">
      <div class="modal-dialog ava-card animate-fade-in">
        <div class="modal-header">
          <div>
            <h3>Raise Drawing Clarification</h3>
            <p class="modal-subtitle">Document Architectural vs Structural discrepancy for formal resolution</p>
          </div>
          <button class="close-btn" @click="closeModal" aria-label="Close modal">&times;</button>
        </div>

        <form @submit.prevent="handleCreateClarification" novalidate>
          <div class="form-group">
            <label for="clrSubjectInput">Subject Title *</label>
            <input
              id="clrSubjectInput"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.subject }"
              placeholder="e.g. Architectural ceiling height conflicts with Structural steel beam clearance"
              v-model="subject"
            />
            <span v-if="errors.subject" class="invalid-feedback">{{ errors.subject }}</span>
          </div>

          <div class="form-group">
            <label for="clrDrawingSelect">System Drawing Reference *</label>
            <div v-if="availableDrawings.length === 0" class="empty-drawing-alert">
              No drawings cataloged in the System Drawing Register. Please add drawings first.
            </div>
            <select
              v-else
              id="clrDrawingSelect"
              class="form-control"
              :class="{ 'is-invalid': errors.drawingReference }"
              v-model="selectedDrawingId"
            >
              <option value="">Select Drawing Sheet from Register...</option>
              <option v-for="d in availableDrawings" :key="d.id" :value="d.id">
                {{ d.discipline }}: {{ d.sheetNumber }} - {{ d.sheetTitle }} [{{ d.currentRevision }}]
              </option>
            </select>
            <span v-if="errors.drawingReference" class="invalid-feedback">{{ errors.drawingReference }}</span>
          </div>

          <div class="form-group">
            <label for="clrDescInput">Discrepancy Description *</label>
            <textarea
              id="clrDescInput"
              rows="4"
              class="form-control"
              :class="{ 'is-invalid': errors.description }"
              placeholder="Describe the conflict between architectural elevations/sections and structural framing details..."
              v-model="description"
            ></textarea>
            <span v-if="errors.description" class="invalid-feedback">{{ errors.description }}</span>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-outline btn-sm" @click="closeModal">
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary btn-sm"
              :disabled="isSubmitting || availableDrawings.length === 0"
            >
              {{ isSubmitting ? 'Logging...' : 'Submit Clarification' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Response Modal -->
    <div v-if="respondingToClarification" class="modal-backdrop">
      <div class="modal-dialog ava-card animate-fade-in">
        <div class="modal-header">
          <div>
            <h3>Resolve Drawing Clarification</h3>
            <p class="modal-subtitle">Provide resolution for <strong>{{ respondingToClarification.clarificationNumber }}</strong></p>
          </div>
          <button class="close-btn" @click="respondingToClarification = null" aria-label="Close modal">&times;</button>
        </div>

        <div v-if="responseError" class="alert alert-danger">{{ responseError }}</div>

        <form @submit.prevent="handleResponseSubmit">
          <div class="form-group">
            <label for="clrResponseInput">Resolution / Governing Directive *</label>
            <textarea
              id="clrResponseInput"
              rows="5"
              class="form-control"
              placeholder="Specify whether architectural or structural dimension governs, or provide revised coordinate..."
              v-model="responseText"
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-outline btn-sm" @click="respondingToClarification = null">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary btn-sm" :disabled="isSubmittingResponse">
              {{ isSubmittingResponse ? 'Resolving...' : 'Confirm Resolution' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.clarifications-container {
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

.search-filter-box {
  width: 100%;
}

.clarifications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.25rem;
}

.clarification-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.clr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.clr-num {
  font-size: 0.92rem;
  color: var(--c-royal-blue-dark);
}

.status-pill {
  font-size: 0.76rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
}

.status-open {
  background: #fffbeb;
  color: #b45309;
}

.status-resolved {
  background: #ecfdf5;
  color: #047857;
}

.clr-subject {
  font-size: 1.05rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.75rem;
  line-height: 1.3;
}

.drawing-callout {
  padding: 0.5rem 0.75rem;
  background: var(--c-royal-blue-light);
  border-radius: 6px;
  font-size: 0.84rem;
  margin-bottom: 0.85rem;
}

.ref-label {
  font-weight: 700;
  color: var(--c-royal-blue-dark);
  margin-right: 0.35rem;
}

.ref-value {
  font-weight: 600;
  color: var(--c-royal-blue);
}

.clr-desc {
  font-size: 0.9rem;
  color: var(--c-text-dark);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.clr-response-box {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  padding: 0.85rem 1rem;
  font-size: 0.88rem;
  color: #14532d;
}

.resp-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
  font-size: 0.8rem;
}

.resp-meta {
  color: var(--c-text-muted);
}

.awaiting-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 0.85rem;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 6px;
  font-size: 0.82rem;
  color: #b45309;
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

.empty-drawing-alert {
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  border-radius: 6px;
  font-size: 0.85rem;
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
  max-width: 600px;
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
  font-size: 1.3rem;
  color: var(--c-blue-dark);
}

.modal-subtitle {
  font-size: 0.86rem;
  color: var(--c-text-muted);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.75rem;
  color: var(--c-text-muted);
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid var(--c-border);
  padding-top: 1rem;
  margin-top: 1.25rem;
}

.alert-danger {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
  padding: 0.65rem 1rem;
  border-radius: 6px;
  font-size: 0.88rem;
  margin-bottom: 1rem;
}

.invalid-feedback {
  display: block;
  font-size: 0.8rem;
  color: #dc2626;
  margin-top: 0.25rem;
  font-weight: 600;
}
</style>
