<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCommunicationStore } from '../stores/communicationStore'
import { useProjectStore } from '../../project/stores/projectStore'
import { useAuthStore } from '../../../stores/auth'
import type { DrawingDiscipline, PriorityLevel, RequestForInformation } from '../../../types/portal'

const props = defineProps<{
  projectId: string
  parentRequest?: RequestForInformation | null
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created'): void
}>()

const communicationStore = useCommunicationStore()
const projectStore = useProjectStore()
const authStore = useAuthStore()

const discipline = ref<DrawingDiscipline>('Structural')
const selectedDrawingId = ref('')
const detailReference = ref('')
const questionTitle = ref(props.parentRequest ? `Re: ${props.parentRequest.questionTitle}` : '')
const detailedDescription = ref('')
const priority = ref<PriorityLevel>('Medium')

const errors = ref({
  drawingReference: '',
  questionTitle: '',
  detailedDescription: ''
})

const isSubmitting = ref(false)
const submitError = ref('')

const disciplines: DrawingDiscipline[] = [
  'Structural',
  'Architectural',
  'Mechanical',
  'Electrical',
  'Civil',
  'Connection Design'
]

const priorities: PriorityLevel[] = ['Low', 'Medium', 'High', 'Urgent']

// Available drawings in Project Drawing Register
const availableDrawings = computed(() => projectStore.activeProjectDrawings)

const validateForm = (): boolean => {
  let valid = true
  errors.value = { drawingReference: '', questionTitle: '', detailedDescription: '' }

  if (!selectedDrawingId.value) {
    errors.value.drawingReference = 'Please select a drawing reference from the project drawing register.'
    valid = false
  }

  if (!questionTitle.value.trim() || questionTitle.value.trim().length < 5) {
    errors.value.questionTitle = 'Question title is required (minimum 5 characters).'
    valid = false
  }

  if (!detailedDescription.value.trim() || detailedDescription.value.trim().length < 15) {
    errors.value.detailedDescription = 'Detailed description is required (minimum 15 characters explaining missing information).'
    valid = false
  }

  return valid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  submitError.value = ''

  const drawing = availableDrawings.value.find((d) => d.id === selectedDrawingId.value)
  const drawingLabel = drawing
    ? `${drawing.discipline}: ${drawing.sheetNumber} - ${drawing.sheetTitle}`
    : 'System Drawing Reference'

  try {
    await communicationStore.createRequestForInformation(props.projectId, {
      discipline: discipline.value,
      drawingReferenceId: selectedDrawingId.value,
      drawingReferenceLabel: drawingLabel,
      detailReference: detailReference.value.trim(),
      questionTitle: questionTitle.value.trim(),
      detailedDescription: detailedDescription.value.trim(),
      priority: priority.value,
      submittedByUserId: authStore.user?.uid || '',
      submittedByUserName: authStore.profile?.name || authStore.user?.email || 'Authorized User',
      parentRequestId: props.parentRequest ? props.parentRequest.id : undefined,
      isFollowUp: !!props.parentRequest
    })
    emit('created')
    emit('close')
  } catch (err: any) {
    submitError.value = err.message || 'Failed to submit Request for Information.'
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
          <h3>{{ parentRequest ? 'Create Request for Information Follow-Up' : 'Raise Request for Information' }}</h3>
          <p class="modal-subtitle">
            {{
              parentRequest
                ? `Threading follow-up inquiry to: ${parentRequest.requestNumber}`
                : 'Submit a formal inquiry regarding missing contract drawing dimensions, sections, or details'
            }}
          </p>
        </div>
        <button class="close-btn" @click="emit('close')" aria-label="Close modal">&times;</button>
      </div>

      <div v-if="submitError" class="alert alert-danger">{{ submitError }}</div>

      <form @submit.prevent="handleSubmit" novalidate class="modal-form-scroll">
        <div class="form-row">
          <div class="form-group col">
            <label for="rfiDiscipline">Discipline *</label>
            <select id="rfiDiscipline" class="form-control" v-model="discipline">
              <option v-for="d in disciplines" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>

          <div class="form-group col">
            <label for="rfiPriority">Priority Level *</label>
            <select id="rfiPriority" class="form-control" v-model="priority">
              <option v-for="p in priorities" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
        </div>

        <!-- System-Managed Drawing Reference Selector -->
        <div class="form-group">
          <label for="rfiDrawingRef">System Drawing Reference *</label>
          <div v-if="availableDrawings.length === 0" class="empty-drawing-alert">
            No drawing sheets have been cataloged in the System Drawing Register yet. Please add drawing sheets to the project register first.
          </div>
          <select
            v-else
            id="rfiDrawingRef"
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
          <label for="rfiDetailRef">Detail Reference / Grid Line Reference (Optional)</label>
          <input
            id="rfiDetailRef"
            type="text"
            class="form-control"
            placeholder="e.g. Detail 3 on Sheet S-502 or Grid Intersection B-4"
            v-model="detailReference"
          />
        </div>

        <div class="form-group">
          <label for="rfiTitle">Question Title *</label>
          <input
            id="rfiTitle"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.questionTitle }"
            placeholder="e.g. Missing beam embed plates and connection bolt dimensions"
            v-model="questionTitle"
          />
          <span v-if="errors.questionTitle" class="invalid-feedback">{{ errors.questionTitle }}</span>
        </div>

        <div class="form-group">
          <label for="rfiDesc">Detailed Question Description *</label>
          <textarea
            id="rfiDesc"
            rows="4"
            class="form-control"
            :class="{ 'is-invalid': errors.detailedDescription }"
            placeholder="Describe the discrepancy or missing information in detail, citing contract drawing callouts..."
            v-model="detailedDescription"
          ></textarea>
          <span v-if="errors.detailedDescription" class="invalid-feedback">{{ errors.detailedDescription }}</span>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-outline btn-sm" @click="emit('close')">
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-primary btn-sm"
            :disabled="isSubmitting || availableDrawings.length === 0"
          >
            {{ isSubmitting ? 'Submitting Request...' : 'Submit Request for Information' }}
          </button>
        </div>
      </form>
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
  max-width: 680px;
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

.modal-form-scroll {
  overflow-y: auto;
  max-height: 500px;
  padding-right: 0.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.col {
  flex: 1;
}

.empty-drawing-alert {
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  border-radius: 6px;
  font-size: 0.85rem;
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
