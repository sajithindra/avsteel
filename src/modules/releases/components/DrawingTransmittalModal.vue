<script setup lang="ts">
import { ref } from 'vue'
import { useReleasesStore } from '../stores/releasesStore'
import { useAuthStore } from '../../../stores/auth'

const props = defineProps<{
  projectId: string
  purpose: 'Approval' | 'Fabrication' | 'Field Use'
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created'): void
}>()

const releasesStore = useReleasesStore()
const authStore = useAuthStore()

const revision = ref(props.purpose === 'Approval' ? 'Revision A' : 'Revision 0')
const title = ref('')
const notes = ref('')
const selectedDocs = ref<string[]>([
  'General Arrangement Drawings',
  'Erection Sheets',
  'Detail Drawings',
  'Shop & Field Bolt Summaries',
  'Material Summary'
])

const availableDocTypes = [
  'General Arrangement Drawings',
  'Erection Sheets',
  'Detail Drawings',
  'Shop & Field Bolt Summaries',
  'Material Summary',
  'Anchor Bolt Placement Plans',
  'Calculation Documents & Design Notes',
  'CNC / KISS / DXF Machine Production Files'
]

const errors = ref({ title: '', revision: '' })
const isSubmitting = ref(false)
const submitError = ref('')

const toggleDoc = (docName: string) => {
  const index = selectedDocs.value.indexOf(docName)
  if (index === -1) {
    selectedDocs.value.push(docName)
  } else {
    selectedDocs.value.splice(index, 1)
  }
}

const validateForm = (): boolean => {
  let valid = true
  errors.value = { title: '', revision: '' }

  if (!title.value.trim() || title.value.trim().length < 5) {
    errors.value.title = 'Transmittal title is required (minimum 5 characters).'
    valid = false
  }

  if (!revision.value.trim()) {
    errors.value.revision = 'Revision tag is required (e.g. Revision A or Revision 0).'
    valid = false
  }

  return valid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  submitError.value = ''

  try {
    await releasesStore.createDrawingTransmittal(props.projectId, {
      purpose: props.purpose,
      revision: revision.value.trim(),
      title: title.value.trim(),
      notes: notes.value.trim(),
      documentsList: selectedDocs.value,
      submittedByUserName: authStore.profile?.name || authStore.user?.email || 'AVA Project Manager'
    })
    emit('created')
    emit('close')
  } catch (err: any) {
    submitError.value = err.message || 'Failed to issue drawing transmittal.'
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
          <h3>Issue Drawing Transmittal</h3>
          <p class="modal-subtitle">
            Formal submittal transmittal for {{ purpose.toLowerCase() }} submittals & drawings
          </p>
        </div>
        <button class="close-btn" @click="emit('close')" aria-label="Close modal">&times;</button>
      </div>

      <div v-if="submitError" class="alert alert-danger">{{ submitError }}</div>

      <form @submit.prevent="handleSubmit" novalidate class="modal-form-scroll">
        <div class="form-row">
          <div class="form-group col">
            <label for="transRevision">Revision Tag *</label>
            <input
              id="transRevision"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.revision }"
              placeholder="e.g. Revision A, Revision B"
              v-model="revision"
            />
            <span v-if="errors.revision" class="invalid-feedback">{{ errors.revision }}</span>
          </div>

          <div class="form-group col">
            <label for="transPurpose">Submittal Purpose</label>
            <input
              id="transPurpose"
              type="text"
              class="form-control"
              :value="purpose"
              disabled
            />
          </div>
        </div>

        <div class="form-group">
          <label for="transTitle">Transmittal Title *</label>
          <input
            id="transTitle"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.title }"
            placeholder="e.g. Level 1 & 2 Steel Framing Erection & Detail Sheets"
            v-model="title"
          />
          <span v-if="errors.title" class="invalid-feedback">{{ errors.title }}</span>
        </div>

        <div class="form-group">
          <label>Included Drawing Packages & Documents</label>
          <div class="checkbox-grid">
            <label
              v-for="d in availableDocTypes"
              :key="d"
              class="doc-checkbox-item"
              :class="{ checked: selectedDocs.includes(d) }"
            >
              <input
                type="checkbox"
                :checked="selectedDocs.includes(d)"
                @change="toggleDoc(d)"
              />
              <span>{{ d }}</span>
            </label>
          </div>
        </div>

        <div class="form-group">
          <label for="transNotes">Transmittal Notes & Instructions (Optional)</label>
          <textarea
            id="transNotes"
            rows="3"
            class="form-control"
            placeholder="Special fabrication notes, sequence milestones, or instructions for client engineering review..."
            v-model="notes"
          ></textarea>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-outline btn-sm" @click="emit('close')">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary btn-sm" :disabled="isSubmitting">
            {{ isSubmitting ? 'Issuing...' : 'Issue Drawing Transmittal' }}
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
  max-width: 650px;
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
  max-height: 520px;
  padding-right: 0.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.col {
  flex: 1;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.35rem;
}

.doc-checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.84rem;
  color: var(--c-text-dark);
  background: #ffffff;
  transition: all var(--transition-fast);
}

.doc-checkbox-item:hover {
  background: var(--c-royal-blue-light);
  border-color: var(--c-royal-blue-border);
}

.doc-checkbox-item.checked {
  background: rgba(21, 65, 148, 0.06);
  border-color: var(--c-royal-blue);
  font-weight: 600;
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
