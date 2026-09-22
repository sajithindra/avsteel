<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProjectStore } from '../stores/projectStore'
import { useCustomerStore } from '../../customer/stores/customerStore'
import { useAuthStore } from '../../../stores/auth'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'created'): void
}>()

const projectStore = useProjectStore()
const customerStore = useCustomerStore()
const authStore = useAuthStore()

const name = ref('')
const projectNumber = ref('')
const poNumber = ref('')
const selectedClientId = ref('')
const fabricator = ref('')
const structuralEngineer = ref('')
const architect = ref('')
const generalContractor = ref('')
const projectLocation = ref('')
const projectType = ref('Commercial Structural Steel')
const softwareVersion = ref('SDS/2 v2024')
const applicableStandards = ref('AISC 360-22 & AISC 303 Code of Standard Practice')
const startDate = ref(new Date().toISOString().split('T')[0] || '')
const targetCompletionDate = ref('')
const contractHours = ref<number | ''>('')
const estimatedHours = ref<number | ''>('')

const errors = ref({
  name: '',
  projectNumber: '',
  selectedClientId: '',
  fabricator: '',
  structuralEngineer: '',
  targetCompletionDate: '',
  estimatedHours: ''
})

const isSubmitting = ref(false)
const submitError = ref('')

onMounted(() => {
  customerStore.initCustomerListener()
})

const validateForm = (): boolean => {
  let valid = true
  errors.value = {
    name: '',
    projectNumber: '',
    selectedClientId: '',
    fabricator: '',
    structuralEngineer: '',
    targetCompletionDate: '',
    estimatedHours: ''
  }

  if (!name.value.trim() || name.value.trim().length < 3) {
    errors.value.name = 'Project name is required (minimum 3 characters).'
    valid = false
  }

  if (!projectNumber.value.trim() || projectNumber.value.trim().length < 2) {
    errors.value.projectNumber = 'Project number is required (e.g. AVA-2026-001).'
    valid = false
  }

  if (!selectedClientId.value) {
    errors.value.selectedClientId = 'Please select a registered client organization.'
    valid = false
  }

  if (!fabricator.value.trim()) {
    errors.value.fabricator = 'Fabricator name is required.'
    valid = false
  }

  if (!structuralEngineer.value.trim()) {
    errors.value.structuralEngineer = 'Structural engineer of record is required.'
    valid = false
  }

  if (!targetCompletionDate.value) {
    errors.value.targetCompletionDate = 'Target completion deadline is required.'
    valid = false
  }

  if (estimatedHours.value === '' || Number(estimatedHours.value) <= 0) {
    errors.value.estimatedHours = 'Estimated detailing hours must be a positive number.'
    valid = false
  }

  return valid
}

const handleCreateProject = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  submitError.value = ''

  const client = customerStore.clients.find((c) => c.id === selectedClientId.value)

  try {
    await projectStore.createProject({
      name: name.value.trim(),
      projectNumber: projectNumber.value.trim().toUpperCase(),
      poNumber: poNumber.value.trim(),
      clientId: selectedClientId.value,
      clientName: client ? client.name : fabricator.value.trim(),
      structuralEngineer: structuralEngineer.value.trim(),
      architect: architect.value.trim(),
      generalContractor: generalContractor.value.trim(),
      fabricator: fabricator.value.trim(),
      projectLocation: projectLocation.value.trim(),
      projectType: projectType.value.trim(),
      softwareVersion: softwareVersion.value.trim(),
      applicableStandards: applicableStandards.value.trim(),
      startDate: startDate.value,
      targetCompletionDate: targetCompletionDate.value,
      currentPhase: 'input_standards',
      projectHeadId: authStore.user?.uid || '',
      qualityControlIds: [],
      steelDetailerIds: [],
      clientProjectLeadIds: [],
      clientProjectReviewerIds: [],
      contractHours: Number(contractHours.value) || 0,
      estimatedHours: Number(estimatedHours.value) || 0,
      actualHours: 0,
      standardsPublished: false,
      standardsConfirmedByClient: false
    })
    emit('created')
    emit('close')
  } catch (err: any) {
    submitError.value = err.message || 'Failed to create project.'
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
          <h3>Create Steel Detailing Project</h3>
          <p class="modal-subtitle">Initialize project workspace, drawing registry, and detailing schedule</p>
        </div>
        <button class="close-btn" @click="emit('close')" aria-label="Close modal">&times;</button>
      </div>

      <div v-if="submitError" class="alert alert-danger">{{ submitError }}</div>

      <form @submit.prevent="handleCreateProject" novalidate class="modal-form-scroll">
        <!-- Section 1: General Info -->
        <div class="form-section-title">General Project Information</div>
        <div class="form-row">
          <div class="form-group col-2">
            <label for="projectNameInput">Project Name *</label>
            <input
              id="projectNameInput"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.name }"
              placeholder="e.g. Bayview Medical Tower Framing"
              v-model="name"
            />
            <span v-if="errors.name" class="invalid-feedback">{{ errors.name }}</span>
          </div>

          <div class="form-group col">
            <label for="projectNumberInput">Project Number *</label>
            <input
              id="projectNumberInput"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.projectNumber }"
              placeholder="e.g. AVA-2026-081"
              v-model="projectNumber"
            />
            <span v-if="errors.projectNumber" class="invalid-feedback">{{ errors.projectNumber }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col">
            <label for="poNumberInput">Purchase Order Number</label>
            <input
              id="poNumberInput"
              type="text"
              class="form-control"
              placeholder="PO-98421"
              v-model="poNumber"
            />
          </div>

          <div class="form-group col">
            <label for="clientSelect">Client Organization *</label>
            <select
              id="clientSelect"
              class="form-control"
              :class="{ 'is-invalid': errors.selectedClientId }"
              v-model="selectedClientId"
              @change="
                () => {
                  const c = customerStore.clients.find((x) => x.id === selectedClientId)
                  if (c && !fabricator) fabricator = c.name
                }
              "
            >
              <option value="">Select Client Organization...</option>
              <option v-for="c in customerStore.clients" :key="c.id" :value="c.id">
                {{ c.name }}
              </option>
            </select>
            <span v-if="errors.selectedClientId" class="invalid-feedback">{{ errors.selectedClientId }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col">
            <label for="fabricatorInput">Fabricator Name *</label>
            <input
              id="fabricatorInput"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.fabricator }"
              placeholder="e.g. Apex Steel Fabrication"
              v-model="fabricator"
            />
            <span v-if="errors.fabricator" class="invalid-feedback">{{ errors.fabricator }}</span>
          </div>

          <div class="form-group col">
            <label for="structuralEngineerInput">Structural Engineer of Record *</label>
            <input
              id="structuralEngineerInput"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.structuralEngineer }"
              placeholder="e.g. Thornton Tomasetti"
              v-model="structuralEngineer"
            />
            <span v-if="errors.structuralEngineer" class="invalid-feedback">{{ errors.structuralEngineer }}</span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col">
            <label for="architectInput">Architect</label>
            <input
              id="architectInput"
              type="text"
              class="form-control"
              placeholder="e.g. Gensler"
              v-model="architect"
            />
          </div>

          <div class="form-group col">
            <label for="locationInput">Project Location</label>
            <input
              id="locationInput"
              type="text"
              class="form-control"
              placeholder="e.g. Seattle, WA"
              v-model="projectLocation"
            />
          </div>
        </div>

        <!-- Section 2: Technical Specifications -->
        <div class="form-section-title">Technical Specifications</div>
        <div class="form-row">
          <div class="form-group col">
            <label for="softwareVersionInput">Detailing Platform & Version *</label>
            <select id="softwareVersionInput" class="form-control" v-model="softwareVersion">
              <option value="SDS/2 v2024">SDS/2 v2024</option>
              <option value="SDS/2 v2023">SDS/2 v2023</option>
              <option value="Tekla Structures 2024">Tekla Structures 2024</option>
              <option value="Tekla Structures 2023">Tekla Structures 2023</option>
            </select>
          </div>

          <div class="form-group col">
            <label for="standardsInput">Applicable Design Standards *</label>
            <input
              id="standardsInput"
              type="text"
              class="form-control"
              v-model="applicableStandards"
            />
          </div>
        </div>

        <!-- Section 3: Schedule & Hours -->
        <div class="form-section-title">Schedule & Internal Hours</div>
        <div class="form-row">
          <div class="form-group col">
            <label for="startDateInput">Start Date</label>
            <input
              id="startDateInput"
              type="date"
              class="form-control"
              v-model="startDate"
            />
          </div>

          <div class="form-group col">
            <label for="targetDateInput">Target Completion Date *</label>
            <input
              id="targetDateInput"
              type="date"
              class="form-control"
              :class="{ 'is-invalid': errors.targetCompletionDate }"
              v-model="targetCompletionDate"
            />
            <span v-if="errors.targetCompletionDate" class="invalid-feedback">{{ errors.targetCompletionDate }}</span>
          </div>

          <div class="form-group col">
            <label for="estimatedHoursInput">Estimated Hours *</label>
            <input
              id="estimatedHoursInput"
              type="number"
              class="form-control"
              :class="{ 'is-invalid': errors.estimatedHours }"
              placeholder="e.g. 240"
              v-model="estimatedHours"
            />
            <span v-if="errors.estimatedHours" class="invalid-feedback">{{ errors.estimatedHours }}</span>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-outline btn-sm" @click="emit('close')">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary btn-sm" :disabled="isSubmitting">
            {{ isSubmitting ? 'Creating Project...' : 'Create Project' }}
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
  max-width: 720px;
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
  margin-bottom: 1rem;
}

.modal-header h3 {
  font-size: 1.35rem;
  color: var(--c-blue-dark);
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
}

.modal-form-scroll {
  overflow-y: auto;
  max-height: 520px;
  padding-right: 0.5rem;
}

.form-section-title {
  font-size: 0.82rem;
  font-weight: 800;
  color: var(--c-royal-blue);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 1.25rem 0 0.65rem 0;
  border-bottom: 1px solid var(--c-royal-blue-light);
  padding-bottom: 0.25rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.col {
  flex: 1;
}

.col-2 {
  flex: 2;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid var(--c-border);
  padding-top: 1rem;
  margin-top: 1.5rem;
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
