<script setup lang="ts">
import { ref, computed } from 'vue'
import { useProjectStore } from '../stores/projectStore'
import { useAuthStore } from '../../../stores/auth'
import type { DrawingDiscipline, ProjectDrawing } from '../../../types/portal'

const props = defineProps<{
  projectId: string
}>()

const projectStore = useProjectStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const selectedDisciplineFilter = ref<string>('all')
const isAddModalOpen = ref(false)
const isSubmitting = ref(false)

// Form fields
const discipline = ref<DrawingDiscipline>('Structural')
const sheetNumber = ref('')
const sheetTitle = ref('')
const currentRevision = ref('Rev 0')
const fileUrl = ref('')

const errors = ref({
  sheetNumber: '',
  sheetTitle: '',
  currentRevision: ''
})

const disciplines: DrawingDiscipline[] = [
  'Structural',
  'Architectural',
  'Mechanical',
  'Electrical',
  'Civil',
  'Connection Design',
  'General'
]

const filteredDrawings = computed<ProjectDrawing[]>(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return projectStore.activeProjectDrawings.filter((d) => {
    const matchesQuery =
      !query ||
      d.sheetNumber.toLowerCase().includes(query) ||
      d.sheetTitle.toLowerCase().includes(query) ||
      d.discipline.toLowerCase().includes(query)

    const matchesDiscipline =
      selectedDisciplineFilter.value === 'all' || d.discipline === selectedDisciplineFilter.value

    return matchesQuery && matchesDiscipline
  })
})

const validateForm = (): boolean => {
  let valid = true
  errors.value = { sheetNumber: '', sheetTitle: '', currentRevision: '' }

  if (!sheetNumber.value.trim() || sheetNumber.value.trim().length < 2) {
    errors.value.sheetNumber = 'Sheet number is required (e.g. S-201, A-101).'
    valid = false
  }

  if (!sheetTitle.value.trim() || sheetTitle.value.trim().length < 3) {
    errors.value.sheetTitle = 'Drawing sheet title is required.'
    valid = false
  }

  if (!currentRevision.value.trim()) {
    errors.value.currentRevision = 'Revision is required (e.g. Rev 0, Rev 1).'
    valid = false
  }

  return valid
}

const handleAddDrawing = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    await projectStore.addDrawingToRegister(props.projectId, {
      discipline: discipline.value,
      sheetNumber: sheetNumber.value.trim().toUpperCase(),
      sheetTitle: sheetTitle.value.trim(),
      currentRevision: currentRevision.value.trim(),
      fileUrl: fileUrl.value.trim(),
      uploadedBy: authStore.profile?.name || authStore.user?.email || 'Authorized User'
    })
    closeModal()
  } catch (err: any) {
    errors.value.sheetNumber = err.message || 'Failed to catalog drawing sheet.'
  } finally {
    isSubmitting.value = false
  }
}

const openModal = () => {
  discipline.value = 'Structural'
  sheetNumber.value = ''
  sheetTitle.value = ''
  currentRevision.value = 'Rev 0'
  fileUrl.value = ''
  errors.value = { sheetNumber: '', sheetTitle: '', currentRevision: '' }
  isAddModalOpen.value = true
}

const closeModal = () => {
  isAddModalOpen.value = false
}
</script>

<template>
  <div class="drawing-register-container">
    <div class="register-header-row">
      <div>
        <h3>System Drawing Register</h3>
        <p class="section-desc">
          Official catalog of contract and model drawing sheets. All Requests for Information and Clarifications link directly to this register.
        </p>
      </div>
      <button
        type="button"
        class="btn btn-primary btn-sm"
        @click="openModal"
      >
        + Add Drawing Sheet
      </button>
    </div>

    <!-- Filter Controls -->
    <div class="filter-controls-row">
      <div class="search-filter-box">
        <input
          type="text"
          class="form-control search-input"
          placeholder="Search by sheet number (e.g. S-201), title, or discipline..."
          v-model="searchQuery"
        />
      </div>

      <div class="discipline-filter-box">
        <select class="form-control" v-model="selectedDisciplineFilter">
          <option value="all">All Disciplines</option>
          <option v-for="d in disciplines" :key="d" :value="d">{{ d }}</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="projectStore.drawingsLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading project drawings...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredDrawings.length === 0" class="empty-state-panel">
      <div class="empty-icon"><span class="material-symbols-outlined icon-xxl text-muted">architecture</span></div>
      <h4>No Drawing Sheets Cataloged</h4>
      <p>
        {{
          searchQuery
            ? 'No drawings match your search criteria.'
            : 'No drawing sheets registered for this project yet. Add contract drawing sheets (Structural, Architectural, MEP) to enable system-managed references.'
        }}
      </p>
    </div>

    <!-- Drawings Table -->
    <div v-else class="table-responsive ava-card">
      <table class="portal-table">
        <thead>
          <tr>
            <th>Discipline</th>
            <th>Sheet Number</th>
            <th>Drawing Title</th>
            <th>Current Revision</th>
            <th>Uploaded By</th>
            <th class="text-right">File Reference</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="drawing in filteredDrawings" :key="drawing.id">
            <td>
              <span class="discipline-tag" :data-disc="drawing.discipline">
                {{ drawing.discipline }}
              </span>
            </td>
            <td>
              <strong class="sheet-number-badge">{{ drawing.sheetNumber }}</strong>
            </td>
            <td>
              <span class="sheet-title">{{ drawing.sheetTitle }}</span>
            </td>
            <td>
              <span class="rev-pill">{{ drawing.currentRevision }}</span>
            </td>
            <td>
              <span class="uploader-text">{{ drawing.uploadedBy }}</span>
            </td>
            <td class="text-right">
              <a
                v-if="drawing.fileUrl"
                :href="drawing.fileUrl"
                target="_blank"
                class="file-link"
              >
                <span class="material-symbols-outlined icon-xs">visibility</span>
                <span>View Sheet</span>
              </a>
              <span v-else class="text-muted">Registered</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Drawing Sheet Modal -->
    <div v-if="isAddModalOpen" class="modal-backdrop">
      <div class="modal-dialog ava-card animate-fade-in">
        <div class="modal-header">
          <div>
            <h3>Catalog Drawing Sheet</h3>
            <p class="modal-subtitle">Add a drawing sheet to the project's system-managed registry</p>
          </div>
          <button class="close-btn" @click="closeModal" aria-label="Close modal">&times;</button>
        </div>

        <form @submit.prevent="handleAddDrawing" novalidate>
          <div class="form-row">
            <div class="form-group col">
              <label for="disciplineSelect">Discipline *</label>
              <select id="disciplineSelect" class="form-control" v-model="discipline">
                <option v-for="d in disciplines" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>

            <div class="form-group col">
              <label for="sheetNumberInput">Sheet Number *</label>
              <input
                id="sheetNumberInput"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.sheetNumber }"
                placeholder="e.g. S-201 or A-102"
                v-model="sheetNumber"
              />
              <span v-if="errors.sheetNumber" class="invalid-feedback">{{ errors.sheetNumber }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="sheetTitleInput">Drawing Sheet Title *</label>
            <input
              id="sheetTitleInput"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.sheetTitle }"
              placeholder="e.g. First Floor Framing & Beam Column Layout"
              v-model="sheetTitle"
            />
            <span v-if="errors.sheetTitle" class="invalid-feedback">{{ errors.sheetTitle }}</span>
          </div>

          <div class="form-row">
            <div class="form-group col">
              <label for="revisionInput">Revision Tag *</label>
              <input
                id="revisionInput"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.currentRevision }"
                placeholder="e.g. Rev 0, Rev 1, Rev A"
                v-model="currentRevision"
              />
              <span v-if="errors.currentRevision" class="invalid-feedback">{{ errors.currentRevision }}</span>
            </div>

            <div class="form-group col">
              <label for="fileUrlInput">Drawing File URL (Optional)</label>
              <input
                id="fileUrlInput"
                type="url"
                class="form-control"
                placeholder="https://... or cloud storage link"
                v-model="fileUrl"
              />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-outline btn-sm" @click="closeModal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary btn-sm" :disabled="isSubmitting">
              {{ isSubmitting ? 'Cataloging...' : 'Catalog Drawing Sheet' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.drawing-register-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.register-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.register-header-row h3 {
  font-size: 1.25rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.25rem;
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

.discipline-filter-box {
  width: 220px;
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
  font-size: 0.9rem;
  color: var(--c-text-dark);
}

.sheet-number-badge {
  font-family: monospace;
  font-size: 0.95rem;
  color: var(--c-royal-blue-dark);
  background: var(--c-royal-blue-light);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.sheet-title {
  font-weight: 600;
  color: var(--c-blue-dark);
}

.discipline-tag {
  font-size: 0.76rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  background: #f1f5f9;
  color: #334155;
}

.discipline-tag[data-disc="Structural"] {
  background: #eff6ff;
  color: #1d4ed8;
}

.discipline-tag[data-disc="Architectural"] {
  background: #fdf2f8;
  color: #be185d;
}

.discipline-tag[data-disc="Mechanical"],
.discipline-tag[data-disc="Electrical"] {
  background: #fffbeb;
  color: #b45309;
}

.rev-pill {
  font-size: 0.78rem;
  font-weight: 700;
  background: #ecfdf5;
  color: #047857;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
}

.uploader-text {
  font-size: 0.84rem;
  color: var(--c-text-muted);
}

.file-link {
  color: var(--c-royal-blue);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
}

.file-link:hover {
  text-decoration: underline;
}

.text-muted {
  color: var(--c-text-muted);
  font-size: 0.85rem;
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

.loading-state {
  text-align: center;
  padding: 2.5rem;
  color: var(--c-text-muted);
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(21, 65, 148, 0.1);
  border-top-color: var(--c-royal-blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 0.75rem auto;
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
  font-size: 1.3rem;
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
