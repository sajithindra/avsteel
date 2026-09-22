<script setup lang="ts">
import { ref, computed } from 'vue'
import { useReleasesStore } from '../stores/releasesStore'
import { useAuthStore } from '../../../stores/auth'

const props = defineProps<{
  projectId: string
}>()

const releasesStore = useReleasesStore()
const authStore = useAuthStore()

const isModalOpen = ref(false)
const revision = ref('Revision 0')
const transmittalNumber = ref('')
const description = ref('')
const isSubmitting = ref(false)
const errors = ref({ transmittalNumber: '', description: '' })

const fieldReleases = computed(() =>
  releasesStore.releasePackages.filter((r) => r.releaseType === 'Field Erection')
)

const validateForm = (): boolean => {
  let valid = true
  errors.value = { transmittalNumber: '', description: '' }

  if (!transmittalNumber.value.trim()) {
    errors.value.transmittalNumber = 'Transmittal reference number is required.'
    valid = false
  }

  if (!description.value.trim() || description.value.trim().length < 5) {
    errors.value.description = 'Release scope and erection notes are required.'
    valid = false
  }

  return valid
}

const handleIssueRelease = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    await releasesStore.createReleasePackage(props.projectId, {
      releaseType: 'Field Erection',
      revision: revision.value.trim(),
      transmittalNumber: transmittalNumber.value.trim(),
      description: description.value.trim(),
      includesMachineFiles: false,
      fileUrls: [
        { name: 'Overall Erection Framing Plans', url: '#', type: 'PDF' },
        { name: 'Anchor Bolt Layout & Setting Plans', url: '#', type: 'PDF' },
        { name: 'Field Bolt Placement & Torque Summaries', url: '#', type: 'PDF' }
      ],
      releasedByUserName: authStore.profile?.name || authStore.user?.email || 'AVA Project Manager'
    })
    closeModal()
  } catch (err: any) {
    errors.value.description = err.message || 'Failed to issue field release.'
  } finally {
    isSubmitting.value = false
  }
}

const openModal = () => {
  revision.value = fieldReleases.value.length === 0 ? 'Revision 0' : `Revision ${fieldReleases.value.length}`
  transmittalNumber.value = `Drawing Transmittal #${(releasesStore.transmittals.length + 1).toString().padStart(3, '0')}`
  description.value = ''
  errors.value = { transmittalNumber: '', description: '' }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>

<template>
  <div class="releases-module-container">
    <div class="module-header-row">
      <div>
        <h3>Field Erection Releases</h3>
        <p class="section-desc">
          Approved field use drawings, erection plans, anchor bolt layouts, and field bolt summaries for site erection.
        </p>
      </div>

      <button
        v-if="authStore.isInternalStaff"
        type="button"
        class="btn btn-primary btn-sm"
        @click="openModal"
      >
        + Issue Field Erection Release
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="fieldReleases.length === 0" class="empty-state-panel">
      <div class="empty-icon"><span class="material-symbols-outlined icon-xxl text-muted">construction</span></div>
      <h4>No Field Erection Releases Issued</h4>
      <p>
        {{
          authStore.isClientStaff
            ? 'No field erection packages released yet. Once erection drawings are finalized and approved, site erection packages will appear here.'
            : 'No field erection packages issued yet. Following client approval, release erection plans and field bolt summaries here.'
        }}
      </p>
    </div>

    <!-- Releases List -->
    <div v-else class="releases-grid">
      <div
        v-for="rel in fieldReleases"
        :key="rel.id"
        class="release-card ava-card"
      >
        <div class="rel-header-row">
          <div class="rel-title-group">
            <span class="rev-tag-lg">{{ rel.revision }}</span>
            <strong class="rel-trans">{{ rel.transmittalNumber }}</strong>
          </div>
          <span class="rel-type-pill field-pill">Field Erection Release</span>
        </div>

        <p class="rel-desc">{{ rel.description }}</p>

        <!-- Erection Packages List -->
        <div class="erection-packages-box">
          <span class="erection-title"><span class="material-symbols-outlined icon-xs text-primary">fact_check</span> Included Erection Packages:</span>
          <div class="files-chip-grid">
            <div
              v-for="f in rel.fileUrls"
              :key="f.name"
              class="file-chip"
            >
              <span class="material-symbols-outlined file-icon text-muted">description</span>
              <span class="file-name">{{ f.name }}</span>
            </div>
          </div>
        </div>

        <div class="rel-footer">
          <span class="release-author">Released by {{ rel.releasedByUserName }}</span>
        </div>
      </div>
    </div>

    <!-- Issue Field Release Modal -->
    <div v-if="isModalOpen" class="modal-backdrop">
      <div class="modal-dialog ava-card animate-fade-in">
        <div class="modal-header">
          <div>
            <h3>Issue Field Erection Release</h3>
            <p class="modal-subtitle">Package erection framing plans, anchor bolt layouts, and field bolt summaries</p>
          </div>
          <button class="close-btn" @click="closeModal" aria-label="Close modal">&times;</button>
        </div>

        <form @submit.prevent="handleIssueRelease" novalidate>
          <div class="form-row">
            <div class="form-group col">
              <label for="fRelRevInput">Field Release Revision *</label>
              <input
                id="fRelRevInput"
                type="text"
                class="form-control"
                placeholder="Revision 0, Revision 1"
                v-model="revision"
              />
            </div>

            <div class="form-group col">
              <label for="fRelTransInput">Drawing Transmittal Reference *</label>
              <input
                id="fRelTransInput"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.transmittalNumber }"
                placeholder="e.g. Drawing Transmittal #005"
                v-model="transmittalNumber"
              />
              <span v-if="errors.transmittalNumber" class="invalid-feedback">{{ errors.transmittalNumber }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="fRelDescInput">Erection Scope & Field Instructions *</label>
            <textarea
              id="fRelDescInput"
              rows="3"
              class="form-control"
              :class="{ 'is-invalid': errors.description }"
              placeholder="e.g. Anchor bolt setting layout, column erection sequence, and high-strength field bolt torque guidelines..."
              v-model="description"
            ></textarea>
            <span v-if="errors.description" class="invalid-feedback">{{ errors.description }}</span>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-outline btn-sm" @click="closeModal">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary btn-sm" :disabled="isSubmitting">
              {{ isSubmitting ? 'Releasing...' : 'Release for Field Erection' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.releases-module-container {
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

.releases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.25rem;
}

.release-card {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.rel-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.rel-title-group {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.rev-tag-lg {
  font-size: 0.85rem;
  font-weight: 800;
  background: var(--c-royal-blue);
  color: #ffffff;
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
}

.rel-trans {
  font-size: 0.95rem;
  color: var(--c-royal-blue-dark);
}

.rel-type-pill {
  font-size: 0.74rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
}

.field-pill {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.rel-desc {
  font-size: 0.9rem;
  color: var(--c-text-dark);
  line-height: 1.5;
  margin-bottom: 1.25rem;
}

.erection-packages-box {
  background: #f8fafc;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 0.85rem 1rem;
  margin-bottom: 1.25rem;
}

.erection-title {
  display: block;
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--c-blue-dark);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.5rem;
}

.files-chip-grid {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.file-chip {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.84rem;
  color: var(--c-blue-dark);
  font-weight: 600;
}

.rel-footer {
  border-top: 1px solid var(--c-border);
  padding-top: 0.75rem;
  display: flex;
  justify-content: flex-end;
}

.release-author {
  font-size: 0.78rem;
  color: var(--c-text-muted);
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

.invalid-feedback {
  display: block;
  font-size: 0.8rem;
  color: #dc2626;
  margin-top: 0.25rem;
  font-weight: 600;
}
</style>
