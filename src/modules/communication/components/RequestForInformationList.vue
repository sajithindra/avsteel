<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCommunicationStore } from '../stores/communicationStore'
import { useAuthStore } from '../../../stores/auth'
import type { RequestForInformation } from '../../../types/portal'
import RequestForInformationFormModal from './RequestForInformationFormModal.vue'

const props = defineProps<{
  projectId: string
}>()

const communicationStore = useCommunicationStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const selectedStatusFilter = ref<string>('all')
const isFormModalOpen = ref(false)
const selectedParentRequest = ref<RequestForInformation | null>(null)

// Client Response modal state
const respondingToRfi = ref<RequestForInformation | null>(null)
const clientResponseText = ref('')
const responseError = ref('')
const isSubmittingResponse = ref(false)

const primaryRequests = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return communicationStore.rfis
    .filter((r) => !r.isFollowUp)
    .filter((r) => {
      const matchesSearch =
        !query ||
        r.requestNumber.toLowerCase().includes(query) ||
        r.questionTitle.toLowerCase().includes(query) ||
        r.drawingReferenceLabel.toLowerCase().includes(query) ||
        (r.detailReference && r.detailReference.toLowerCase().includes(query))

      const matchesStatus =
        selectedStatusFilter.value === 'all' || r.status === selectedStatusFilter.value

      return matchesSearch && matchesStatus
    })
})

const getFollowUpsForRequest = (parentId: string): RequestForInformation[] => {
  return communicationStore.rfis.filter((r) => r.isFollowUp && r.parentRequestId === parentId)
}

const openNewRequestModal = () => {
  selectedParentRequest.value = null
  isFormModalOpen.value = true
}

const openFollowUpModal = (parent: RequestForInformation) => {
  selectedParentRequest.value = parent
  isFormModalOpen.value = true
}

const openResponseModal = (rfi: RequestForInformation) => {
  respondingToRfi.value = rfi
  clientResponseText.value = rfi.clientResponse || ''
  responseError.value = ''
}

const handleResponseSubmit = async () => {
  if (!respondingToRfi.value) return
  if (!clientResponseText.value.trim() || clientResponseText.value.trim().length < 5) {
    responseError.value = 'Please provide a clear and substantive response (minimum 5 characters).'
    return
  }

  isSubmittingResponse.value = true
  try {
    await communicationStore.submitRfiResponse(
      props.projectId,
      respondingToRfi.value.id,
      clientResponseText.value.trim(),
      {
        uid: authStore.user?.uid || '',
        name: authStore.profile?.name || authStore.user?.email || 'Client Representative'
      }
    )
    respondingToRfi.value = null
  } catch (err: any) {
    responseError.value = err.message || 'Failed to submit response.'
  } finally {
    isSubmittingResponse.value = false
  }
}

const handleToggleIncorporation = async (rfi: RequestForInformation) => {
  if (!authStore.isInternalStaff) return
  const userName = authStore.profile?.name || authStore.user?.email || 'Detailer'
  await communicationStore.toggleModelIncorporation(
    props.projectId,
    rfi.id,
    rfi.incorporatedInModel,
    userName
  )
}
</script>

<template>
  <div class="rfi-module-container">
    <div class="module-header-row">
      <div>
        <h3>Requests for Information</h3>
        <p class="section-desc">
          Official inquiries regarding contract drawing discrepancies, missing connection details, or dimensions.
        </p>
      </div>
      <button
        type="button"
        class="btn btn-primary btn-sm"
        @click="openNewRequestModal"
      >
        + Raise Request for Information
      </button>
    </div>

    <!-- Filter Controls -->
    <div class="filter-controls-row">
      <div class="search-filter-box">
        <input
          type="text"
          class="form-control search-input"
          placeholder="Search by request number (e.g. Request for Information #001), drawing sheet, or keyword..."
          v-model="searchQuery"
        />
      </div>

      <div class="status-filter-box">
        <select class="form-control" v-model="selectedStatusFilter">
          <option value="all">All Statuses</option>
          <option value="Submitted to Client">Submitted to Client</option>
          <option value="Awaiting Client Response">Awaiting Client Response</option>
          <option value="Awaiting AVA Response">Awaiting AVA Response</option>
          <option value="Answered">Answered</option>
          <option value="Closed">Closed</option>
        </select>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="primaryRequests.length === 0" class="empty-state-panel">
      <div class="empty-icon"><span class="material-symbols-outlined icon-xxl text-muted">help_outline</span></div>
      <h4>No Requests for Information Found</h4>
      <p>
        {{
          searchQuery
            ? 'No inquiries match your filter criteria.'
            : 'No Requests for Information logged for this project. If contract drawing information is missing, click "Raise Request for Information" above.'
        }}
      </p>
    </div>

    <!-- List of Requests with Follow-Up Threading -->
    <div v-else class="rfi-cards-list">
      <div
        v-for="rfi in primaryRequests"
        :key="rfi.id"
        class="rfi-thread-container ava-card"
      >
        <!-- Primary Request Header -->
        <div class="rfi-card-header">
          <div class="title-meta-group">
            <div class="rfi-tag-row">
              <strong class="rfi-number">{{ rfi.requestNumber }}</strong>
              <span class="discipline-badge">{{ rfi.discipline }}</span>
              <span class="priority-badge" :data-priority="rfi.priority">
                {{ rfi.priority }} Priority
              </span>
              <span class="status-badge" :data-status="rfi.status">
                {{ rfi.status }}
              </span>
            </div>
            <h4 class="question-title">{{ rfi.questionTitle }}</h4>
          </div>

          <!-- Model Incorporation Button (Internal Staff Only) -->
          <div class="model-incorporation-wrapper">
            <button
              type="button"
              class="incorporation-btn"
              :class="{ incorporated: rfi.incorporatedInModel }"
              :disabled="!authStore.isInternalStaff"
              @click="handleToggleIncorporation(rfi)"
              :title="authStore.isInternalStaff ? 'Click to toggle model incorporation' : 'Only AVA detailing personnel can toggle'"
            >
              <span class="inc-icon">
                <span class="material-symbols-outlined icon-xs">
                  {{ rfi.incorporatedInModel ? 'check' : 'radio_button_unchecked' }}
                </span>
              </span>
              <span class="inc-label">
                Incorporated in 3D Model: {{ rfi.incorporatedInModel ? 'YES' : 'NO' }}
              </span>
            </button>
            <span v-if="rfi.incorporatedInModel && rfi.incorporatedByUserName" class="inc-author">
              Incorporated by {{ rfi.incorporatedByUserName }}
            </span>
          </div>
        </div>

        <!-- Drawing Reference Callout -->
        <div class="drawing-ref-callout">
          <span class="ref-label">System Drawing Reference:</span>
          <span class="ref-value">{{ rfi.drawingReferenceLabel }}</span>
          <span v-if="rfi.detailReference" class="ref-detail">
            &bull; {{ rfi.detailReference }}
          </span>
        </div>

        <!-- Description Body -->
        <div class="rfi-description-box">
          <p>{{ rfi.detailedDescription }}</p>
          <div class="submittal-meta">
            Submitted by <strong>{{ rfi.submittedByUserName }}</strong>
          </div>
        </div>

        <!-- Client Response Section -->
        <div class="response-section">
          <div v-if="rfi.clientResponse" class="response-display-card">
            <div class="response-header">
              <span class="resp-title">Official Client Response:</span>
              <span class="resp-meta">Responded by {{ rfi.respondedByUserName }}</span>
            </div>
            <p class="response-text">{{ rfi.clientResponse }}</p>
          </div>
          <div v-else class="awaiting-response-bar">
            <span><span class="material-symbols-outlined icon-xs text-warning">schedule</span> Awaiting official response from Client engineering team.</span>
            <button
              type="button"
              class="btn btn-outline btn-sm"
              @click="openResponseModal(rfi)"
            >
              <span class="material-symbols-outlined icon-xs">draw</span>
              <span>Submit Response</span>
            </button>
          </div>
        </div>

        <!-- Follow-Up Inquiries Thread (if any) -->
        <div
          v-if="getFollowUpsForRequest(rfi.id).length > 0"
          class="follow-ups-wrapper"
        >
          <div class="follow-up-divider">
            <span>Follow-Up Inquiry Chain</span>
          </div>

          <div
            v-for="fu in getFollowUpsForRequest(rfi.id)"
            :key="fu.id"
            class="follow-up-card"
          >
            <div class="fu-header">
              <strong class="fu-number">{{ fu.requestNumber }}</strong>
              <span class="status-badge" :data-status="fu.status">{{ fu.status }}</span>
            </div>
            <h5 class="fu-title">{{ fu.questionTitle }}</h5>
            <p class="fu-desc">{{ fu.detailedDescription }}</p>

            <div v-if="fu.clientResponse" class="fu-response-box">
              <strong>Client Response:</strong> {{ fu.clientResponse }}
            </div>
            <div v-else class="fu-awaiting">
              <button
                type="button"
                class="btn btn-outline btn-sm"
                @click="openResponseModal(fu)"
              >
                Submit Response to Follow-Up
              </button>
            </div>
          </div>
        </div>

        <!-- Card Footer Actions -->
        <div class="thread-footer-actions">
          <button
            type="button"
            class="btn btn-outline btn-sm"
            @click="openFollowUpModal(rfi)"
          >
            + Add Follow-Up Question
          </button>
        </div>
      </div>
    </div>

    <!-- Request Form Modal -->
    <RequestForInformationFormModal
      v-if="isFormModalOpen"
      :project-id="projectId"
      :parent-request="selectedParentRequest"
      :is-open="isFormModalOpen"
      @close="isFormModalOpen = false"
      @created="isFormModalOpen = false"
    />

    <!-- Client Response Modal -->
    <div v-if="respondingToRfi" class="modal-backdrop">
      <div class="modal-dialog ava-card animate-fade-in">
        <div class="modal-header">
          <div>
            <h3>Submit Client Response</h3>
            <p class="modal-subtitle">Submitting response to <strong>{{ respondingToRfi.requestNumber }}</strong></p>
          </div>
          <button class="close-btn" @click="respondingToRfi = null" aria-label="Close modal">&times;</button>
        </div>

        <div v-if="responseError" class="alert alert-danger">{{ responseError }}</div>

        <form @submit.prevent="handleResponseSubmit">
          <div class="form-group">
            <label for="responseInput">Official Response / Clarification *</label>
            <textarea
              id="responseInput"
              rows="5"
              class="form-control"
              placeholder="Provide engineering directive, approved dimensions, or reference specification..."
              v-model="clientResponseText"
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-outline btn-sm" @click="respondingToRfi = null">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary btn-sm" :disabled="isSubmittingResponse">
              {{ isSubmittingResponse ? 'Submitting...' : 'Confirm Response' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rfi-module-container {
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
  width: 240px;
}

.rfi-cards-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.rfi-thread-container {
  padding: 1.75rem;
  border-left: 4px solid var(--c-royal-blue);
}

.rfi-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.rfi-tag-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.35rem;
}

.rfi-number {
  font-size: 0.95rem;
  color: var(--c-royal-blue-dark);
}

.discipline-badge {
  font-size: 0.74rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  background: var(--c-royal-blue-light);
  color: var(--c-royal-blue);
  border-radius: 4px;
}

.priority-badge {
  font-size: 0.74rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.priority-badge[data-priority="Urgent"] {
  background: #fee2e2;
  color: #b91c1c;
}

.priority-badge[data-priority="High"] {
  background: #ffedd5;
  color: #c2410c;
}

.priority-badge[data-priority="Medium"] {
  background: #fef3c7;
  color: #b45309;
}

.priority-badge[data-priority="Low"] {
  background: #f1f5f9;
  color: #475569;
}

.status-badge {
  font-size: 0.74rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background: #f1f5f9;
  color: #475569;
}

.status-badge[data-status="Answered"] {
  background: #ecfdf5;
  color: #047857;
}

.question-title {
  font-size: 1.15rem;
  color: var(--c-blue-dark);
  line-height: 1.3;
}

/* Model Incorporation Button */
.model-incorporation-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.incorporation-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.85rem;
  font-size: 0.78rem;
  font-weight: 800;
  border-radius: 6px;
  border: 1px solid var(--c-border);
  background: #ffffff;
  color: #64748b;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.incorporation-btn.incorporated {
  background: #ecfdf5;
  color: #047857;
  border-color: #a7f3d0;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.15);
}

.inc-author {
  font-size: 0.72rem;
  color: var(--c-text-muted);
}

.drawing-ref-callout {
  padding: 0.65rem 1rem;
  background: var(--c-royal-blue-light);
  border-radius: 6px;
  font-size: 0.86rem;
  margin-bottom: 0.85rem;
}

.ref-label {
  font-weight: 700;
  color: var(--c-royal-blue-dark);
  margin-right: 0.35rem;
}

.ref-value {
  font-weight: 700;
  color: var(--c-royal-blue);
}

.ref-detail {
  color: var(--c-text-muted);
}

.rfi-description-box {
  margin-bottom: 1.25rem;
  font-size: 0.92rem;
  line-height: 1.6;
}

.submittal-meta {
  margin-top: 0.5rem;
  font-size: 0.82rem;
  color: var(--c-text-muted);
}

/* Response Display */
.response-section {
  margin-bottom: 1rem;
}

.response-display-card {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
}

.resp-title {
  font-size: 0.84rem;
  font-weight: 800;
  color: #15803d;
  text-transform: uppercase;
}

.resp-meta {
  font-size: 0.78rem;
  color: var(--c-text-muted);
}

.response-text {
  font-size: 0.92rem;
  color: #14532d;
  line-height: 1.5;
}

.awaiting-response-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 6px;
  font-size: 0.86rem;
  color: #b45309;
}

/* Follow-ups */
.follow-ups-wrapper {
  margin-top: 1.25rem;
  padding-left: 1.25rem;
  border-left: 2px dashed var(--c-border);
}

.follow-up-divider {
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--c-text-muted);
  letter-spacing: 0.04em;
  margin-bottom: 0.75rem;
}

.follow-up-card {
  background: #f8fafc;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 0.75rem;
}

.fu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.fu-number {
  font-size: 0.88rem;
  color: var(--c-royal-blue);
}

.fu-title {
  font-size: 0.96rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.25rem;
}

.fu-desc {
  font-size: 0.88rem;
  color: var(--c-text-dark);
  line-height: 1.4;
}

.fu-response-box {
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #ecfdf5;
  border-radius: 4px;
  font-size: 0.86rem;
  color: #065f46;
}

.fu-awaiting {
  margin-top: 0.5rem;
}

.thread-footer-actions {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid var(--c-border);
  padding-top: 0.85rem;
  margin-top: 1rem;
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
</style>
