<script setup lang="ts">
import { ref } from 'vue'
import { useReleasesStore } from '../stores/releasesStore'
import { useAuthStore } from '../../../stores/auth'
import type { DrawingTransmittal } from '../../../types/portal'

const props = defineProps<{
  projectId: string
  transmittal: DrawingTransmittal
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'completed'): void
}>()

const releasesStore = useReleasesStore()
const authStore = useAuthStore()

const selectedAction = ref<'Approve' | 'Approve as Noted' | 'Revise and Resubmit' | 'Reject'>('Approve as Noted')
const actionNotes = ref('')
const error = ref('')
const isSubmitting = ref(false)

const actionsList: { key: 'Approve' | 'Approve as Noted' | 'Revise and Resubmit' | 'Reject'; label: string; desc: string; colorClass: string }[] = [
  { key: 'Approve', label: 'Approve (Unconditional)', desc: 'Drawings approved as submitted. Detailing team may proceed to fabrication release.', colorClass: 'act-green' },
  { key: 'Approve as Noted', label: 'Approve as Noted', desc: 'Approved subject to incorporating marked corrections. No resubmittal required.', colorClass: 'act-blue' },
  { key: 'Revise and Resubmit', label: 'Revise and Resubmit', desc: 'Substantial modifications required. Drawings must be revised and resubmitted under next revision.', colorClass: 'act-amber' },
  { key: 'Reject', label: 'Reject', desc: 'Submittal is rejected. Detailing does not conform to contract documents.', colorClass: 'act-red' }
]

const handleConfirm = async () => {
  error.value = ''

  if ((selectedAction.value === 'Revise and Resubmit' || selectedAction.value === 'Reject') && (!actionNotes.value.trim() || actionNotes.value.trim().length < 10)) {
    error.value = 'Detailed explanatory comments are mandatory when requesting revision or rejecting a submittal.'
    return
  }

  isSubmitting.value = true
  try {
    await releasesStore.submitClientReviewAction(
      props.projectId,
      props.transmittal.id,
      selectedAction.value,
      actionNotes.value.trim(),
      authStore.profile?.name || authStore.user?.email || 'Client Reviewer'
    )
    emit('completed')
    emit('close')
  } catch (err: any) {
    error.value = err.message || 'Failed to submit review action.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop">
    <div class="modal-dialog ava-card animate-fade-in">
      <div class="modal-header">
        <div>
          <h3>Client Review Sign-Off Action</h3>
          <p class="modal-subtitle">
            Formal engineering sign-off for <strong>{{ transmittal.transmittalNumber }}</strong> ({{ transmittal.revision }})
          </p>
        </div>
        <button class="close-btn" @click="emit('close')" aria-label="Close modal">&times;</button>
      </div>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <div class="action-options-list">
        <label
          v-for="a in actionsList"
          :key="a.key"
          class="action-option-item"
          :class="{ selected: selectedAction === a.key }"
        >
          <input
            type="radio"
            :value="a.key"
            v-model="selectedAction"
            name="clientDecision"
            class="action-radio"
          />
          <div class="action-meta">
            <span class="action-title" :class="a.colorClass">{{ a.label }}</span>
            <p class="action-desc">{{ a.desc }}</p>
          </div>
        </label>
      </div>

      <div class="form-group">
        <label for="reviewNotes">
          Review Comments & Directive Notes
          <span v-if="selectedAction === 'Revise and Resubmit' || selectedAction === 'Reject'" class="req-star">*</span>
        </label>
        <textarea
          id="reviewNotes"
          rows="4"
          class="form-control"
          placeholder="Provide specific markup notes, EOR requirements, or revision references..."
          v-model="actionNotes"
        ></textarea>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-outline btn-sm" @click="emit('close')">
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary btn-sm"
          :disabled="isSubmitting"
          @click="handleConfirm"
        >
          {{ isSubmitting ? 'Recording...' : 'Confirm Review Action' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  max-width: 620px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
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

.action-options-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin-bottom: 1.25rem;
}

.action-option-item {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  cursor: pointer;
  background: #ffffff;
  transition: all var(--transition-fast);
}

.action-option-item:hover {
  border-color: var(--c-royal-blue);
  background: var(--c-royal-blue-light);
}

.action-option-item.selected {
  border-color: var(--c-royal-blue);
  background: rgba(21, 65, 148, 0.05);
  box-shadow: 0 0 0 1px var(--c-royal-blue);
}

.action-radio {
  margin-top: 0.25rem;
  accent-color: var(--c-royal-blue);
}

.action-meta {
  flex: 1;
}

.action-title {
  font-weight: 700;
  font-size: 0.95rem;
  display: block;
  margin-bottom: 0.2rem;
}

.act-green { color: #059669; }
.act-blue { color: #2563eb; }
.act-amber { color: #d97706; }
.act-red { color: #dc2626; }

.action-desc {
  font-size: 0.82rem;
  color: var(--c-text-muted);
  line-height: 1.35;
}

.req-star {
  color: #dc2626;
  font-weight: 800;
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
