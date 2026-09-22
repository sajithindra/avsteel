<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCommunicationStore } from '../stores/communicationStore'
import { useProjectStore } from '../../project/stores/projectStore'
import { useAuthStore } from '../../../stores/auth'
import type { BackFromApprovalComment } from '../../../types/portal'

const props = defineProps<{
  projectId: string
}>()

const communicationStore = useCommunicationStore()
const projectStore = useProjectStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const selectedStatusFilter = ref<string>('all')

// Add Comment Modal
const isAddModalOpen = ref(false)
const selectedDrawingId = ref('')
const descriptionOfChange = ref('')
const avaActionTaken = ref('Under Review')
const assignedQc = ref('')
const isSubmitting = ref(false)
const errors = ref({ drawingReference: '', description: '' })

// Clarification on BFA Comment Modal
const isClarificationModalOpen = ref(false)
const clarifyingComment = ref<BackFromApprovalComment | null>(null)
const clrIssue = ref('')
const clrQuestion = ref('')
const clrProposedSolution = ref('')
const clrErrors = ref({ issue: '', question: '', solution: '' })
const isSubmittingClarification = ref(false)

const availableDrawings = computed(() => projectStore.activeProjectDrawings)

const filteredComments = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return communicationStore.bfaComments.filter((c) => {
    const matchesSearch =
      !query ||
      c.commentNumber.toLowerCase().includes(query) ||
      c.drawingReferenceLabel.toLowerCase().includes(query) ||
      c.descriptionOfChange.toLowerCase().includes(query) ||
      c.avaActionTaken.toLowerCase().includes(query)

    const matchesStatus =
      selectedStatusFilter.value === 'all' || c.status === selectedStatusFilter.value

    return matchesSearch && matchesStatus
  })
})

const validateCommentForm = (): boolean => {
  let valid = true
  errors.value = { drawingReference: '', description: '' }

  if (!selectedDrawingId.value) {
    errors.value.drawingReference = 'Please select a drawing reference from the project drawing register.'
    valid = false
  }

  if (!descriptionOfChange.value.trim() || descriptionOfChange.value.trim().length < 5) {
    errors.value.description = 'Description of engineering markup or requested change is required.'
    valid = false
  }

  return valid
}

const handleAddComment = async () => {
  if (!validateCommentForm()) return

  isSubmitting.value = true
  const drawing = availableDrawings.value.find((d) => d.id === selectedDrawingId.value)
  const drawingLabel = drawing
    ? `${drawing.discipline}: ${drawing.sheetNumber} - ${drawing.sheetTitle}`
    : 'System Drawing Reference'

  try {
    await communicationStore.createBfaComment(props.projectId, {
      drawingReferenceId: selectedDrawingId.value,
      drawingReferenceLabel: drawingLabel,
      descriptionOfChange: descriptionOfChange.value.trim(),
      avaActionTaken: avaActionTaken.value.trim(),
      assignedQualityControlName: assignedQc.value.trim()
    })
    closeAddModal()
  } catch (err: any) {
    errors.value.description = err.message || 'Failed to catalog comment.'
  } finally {
    isSubmitting.value = false
  }
}

const handleUpdateStatus = async (comment: BackFromApprovalComment, newStatus: any) => {
  await communicationStore.updateBfaCommentStatus(props.projectId, comment.id, {
    status: newStatus
  })
}

const openClarificationModal = (comment: BackFromApprovalComment) => {
  clarifyingComment.value = comment
  clrIssue.value = comment.descriptionOfChange
  clrQuestion.value = ''
  clrProposedSolution.value = ''
  clrErrors.value = { issue: '', question: '', solution: '' }
  isClarificationModalOpen.value = true
}

const handleClarificationSubmit = async () => {
  if (!clarifyingComment.value) return
  let valid = true
  clrErrors.value = { issue: '', question: '', solution: '' }

  if (!clrQuestion.value.trim()) {
    clrErrors.value.question = 'Engineering question regarding the markup is required.'
    valid = false
  }

  if (!clrProposedSolution.value.trim()) {
    clrErrors.value.solution = 'Proposed detailing solution is required.'
    valid = false
  }

  if (!valid) return

  isSubmittingClarification.value = true
  try {
    await communicationStore.createBfaClarification(props.projectId, {
      drawingReferenceId: clarifyingComment.value.drawingReferenceId,
      drawingReferenceLabel: clarifyingComment.value.drawingReferenceLabel,
      issue: clrIssue.value.trim(),
      question: clrQuestion.value.trim(),
      proposedSolution: clrProposedSolution.value.trim()
    })
    isClarificationModalOpen.value = false
  } catch (err: any) {
    clrErrors.value.question = err.message || 'Failed to submit BFA clarification.'
  } finally {
    isSubmittingClarification.value = false
  }
}

const openAddModal = () => {
  selectedDrawingId.value = ''
  descriptionOfChange.value = ''
  avaActionTaken.value = 'Under Review'
  assignedQc.value = ''
  errors.value = { drawingReference: '', description: '' }
  isAddModalOpen.value = true
}

const closeAddModal = () => {
  isAddModalOpen.value = false
}
</script>

<template>
  <div class="bfa-module-container">
    <div class="module-header-row">
      <div>
        <h3>Back From Approval Comments Register</h3>
        <p class="section-desc">
          Comment tracking register for engineering review markups returned by the client engineer of record.
        </p>
      </div>

      <button type="button" class="btn btn-primary btn-sm" @click="openAddModal">
        + Log Engineering Comment
      </button>
    </div>

    <!-- Filters -->
    <div class="filter-controls-row">
      <div class="search-filter-box">
        <input
          type="text"
          class="form-control search-input"
          placeholder="Search by comment number (e.g. Back From Approval Comment #001), drawing, or keyword..."
          v-model="searchQuery"
        />
      </div>

      <div class="status-filter-box">
        <select class="form-control" v-model="selectedStatusFilter">
          <option value="all">All Statuses</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredComments.length === 0" class="empty-state-panel">
      <div class="empty-icon"><span class="material-symbols-outlined icon-xxl text-muted">rate_review</span></div>
      <h4>No Engineering Comments Logged</h4>
      <p>
        {{
          searchQuery
            ? 'No comments match your search criteria.'
            : 'No Back From Approval engineering comments recorded for this submittal. When client markups arrive, log them here to assign action items.'
        }}
      </p>
    </div>

    <!-- Comments Table -->
    <div v-else class="table-responsive ava-card">
      <table class="portal-table">
        <thead>
          <tr>
            <th>Comment Number</th>
            <th>Drawing Reference</th>
            <th>Description of Markup</th>
            <th>AVA Action Taken</th>
            <th>Status</th>
            <th class="text-right">Clarification Dialogue</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="comment in filteredComments" :key="comment.id">
            <td>
              <strong class="comment-num">{{ comment.commentNumber }}</strong>
            </td>
            <td>
              <span class="sheet-ref">{{ comment.drawingReferenceLabel }}</span>
            </td>
            <td>
              <span class="desc-text">{{ comment.descriptionOfChange }}</span>
            </td>
            <td>
              <span class="action-text">{{ comment.avaActionTaken }}</span>
            </td>
            <td>
              <select
                class="form-control status-select"
                :value="comment.status"
                @change="handleUpdateStatus(comment, ($event.target as HTMLSelectElement).value)"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Closed">Closed</option>
              </select>
            </td>
            <td class="text-right">
              <button
                type="button"
                class="btn btn-outline btn-sm"
                @click="openClarificationModal(comment)"
              >
                Raise Question
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Log Comment Modal -->
    <div v-if="isAddModalOpen" class="modal-backdrop">
      <div class="modal-dialog ava-card animate-fade-in">
        <div class="modal-header">
          <div>
            <h3>Log Back From Approval Comment</h3>
            <p class="modal-subtitle">Record engineering markup or requested revision from approval review</p>
          </div>
          <button class="close-btn" @click="closeAddModal" aria-label="Close modal">&times;</button>
        </div>

        <form @submit.prevent="handleAddComment" novalidate>
          <div class="form-group">
            <label for="bfaDrawingSelect">System Drawing Reference *</label>
            <div v-if="availableDrawings.length === 0" class="empty-drawing-alert">
              No drawings cataloged in the System Drawing Register yet.
            </div>
            <select
              v-else
              id="bfaDrawingSelect"
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
            <label for="markupDescInput">Description of Engineering Markup / Revision *</label>
            <textarea
              id="markupDescInput"
              rows="3"
              class="form-control"
              :class="{ 'is-invalid': errors.description }"
              placeholder="e.g. Revise beam copes and stiffener plate thickness per engineer markup cloud..."
              v-model="descriptionOfChange"
            ></textarea>
            <span v-if="errors.description" class="invalid-feedback">{{ errors.description }}</span>
          </div>

          <div class="form-row">
            <div class="form-group col">
              <label for="avaActionSelect">AVA Action Planned</label>
              <input
                id="avaActionSelect"
                type="text"
                class="form-control"
                placeholder="e.g. Revised dimension or RFI issued"
                v-model="avaActionTaken"
              />
            </div>

            <div class="form-group col">
              <label for="assignedQcInput">Assigned Quality Checker</label>
              <input
                id="assignedQcInput"
                type="text"
                class="form-control"
                placeholder="Checker Name"
                v-model="assignedQc"
              />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-outline btn-sm" @click="closeAddModal">
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary btn-sm"
              :disabled="isSubmitting || availableDrawings.length === 0"
            >
              {{ isSubmitting ? 'Recording...' : 'Record Comment' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Clarification on Comment Modal -->
    <div v-if="isClarificationModalOpen && clarifyingComment" class="modal-backdrop">
      <div class="modal-dialog ava-card animate-fade-in">
        <div class="modal-header">
          <div>
            <h3>Back From Approval Clarification</h3>
            <p class="modal-subtitle">Raise a clarifying question regarding markup on <strong>{{ clarifyingComment.commentNumber }}</strong></p>
          </div>
          <button class="close-btn" @click="isClarificationModalOpen = false" aria-label="Close modal">&times;</button>
        </div>

        <form @submit.prevent="handleClarificationSubmit" novalidate>
          <div class="form-group">
            <label>Comment Issue Reference</label>
            <p class="reference-box">{{ clarifyingComment.descriptionOfChange }}</p>
          </div>

          <div class="form-group">
            <label for="clrQInput">Engineering Question / Issue with Markup *</label>
            <textarea
              id="clrQInput"
              rows="3"
              class="form-control"
              :class="{ 'is-invalid': clrErrors.question }"
              placeholder="Describe the issue with the engineer's markup (e.g. Clearance conflict with connection design)..."
              v-model="clrQuestion"
            ></textarea>
            <span v-if="clrErrors.question" class="invalid-feedback">{{ clrErrors.question }}</span>
          </div>

          <div class="form-group">
            <label for="clrSolInput">Proposed Detailing Solution *</label>
            <textarea
              id="clrSolInput"
              rows="3"
              class="form-control"
              :class="{ 'is-invalid': clrErrors.solution }"
              placeholder="Detail the suggested engineering adjustment or alternative connection design..."
              v-model="clrProposedSolution"
            ></textarea>
            <span v-if="clrErrors.solution" class="invalid-feedback">{{ clrErrors.solution }}</span>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-outline btn-sm" @click="isClarificationModalOpen = false">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary btn-sm" :disabled="isSubmittingClarification">
              {{ isSubmittingClarification ? 'Submitting...' : 'Submit BFA Clarification' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bfa-module-container {
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

.filter-controls-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-filter-box {
  flex: 1;
  min-width: 240px;
}

.status-filter-box {
  width: 200px;
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
  padding: 0.85rem 1.15rem;
  border-bottom: 1px solid var(--c-border);
  font-size: 0.88rem;
  color: var(--c-text-dark);
}

.comment-num {
  font-family: monospace;
  font-size: 0.88rem;
  color: var(--c-royal-blue-dark);
}

.sheet-ref {
  font-weight: 600;
  color: var(--c-royal-blue);
  font-size: 0.85rem;
}

.desc-text {
  font-size: 0.88rem;
  color: var(--c-text-dark);
}

.action-text {
  font-weight: 600;
  color: #047857;
}

.status-select {
  padding: 0.35rem 0.65rem;
  font-size: 0.82rem;
  font-weight: 700;
  border-radius: 4px;
}

.text-right {
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

.reference-box {
  background: #f8fafc;
  border: 1px solid var(--c-border);
  padding: 0.65rem 0.85rem;
  border-radius: 6px;
  font-size: 0.88rem;
  color: var(--c-text-dark);
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
  margin-top: 1.25rem;
}

.empty-drawing-alert {
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  border-radius: 6px;
  font-size: 0.85rem;
}

.invalid-feedback {
  display: block;
  font-size: 0.8rem;
  color: #dc2626;
  margin-top: 0.25rem;
  font-weight: 600;
}
</style>
