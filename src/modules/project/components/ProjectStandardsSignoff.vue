<script setup lang="ts">
import { ref } from 'vue'
import { useProjectStore } from '../stores/projectStore'
import { useAuthStore } from '../../../stores/auth'
import type { ProjectProfile } from '../../../types/portal'

const props = defineProps<{
  project: ProjectProfile
}>()

const projectStore = useProjectStore()
const authStore = useAuthStore()

const standardsUrl = ref(props.project.standardsDocumentUrl || '')
const isPublishing = ref(false)
const isConfirming = ref(false)
const publishSuccess = ref('')
const confirmSuccess = ref('')
const error = ref('')

const handlePublish = async () => {
  if (!standardsUrl.value.trim()) {
    error.value = 'Please provide the project standards document URL or reference link.'
    return
  }
  error.value = ''
  isPublishing.value = true
  try {
    await projectStore.publishProjectStandards(props.project.id, standardsUrl.value.trim())
    publishSuccess.value = 'Project standards published successfully. Awaiting client confirmation.'
    setTimeout(() => {
      publishSuccess.value = ''
    }, 4000)
  } catch (err: any) {
    error.value = err.message || 'Failed to publish project standards.'
  } finally {
    isPublishing.value = false
  }
}

const handleConfirm = async () => {
  error.value = ''
  isConfirming.value = true
  try {
    await projectStore.confirmProjectStandards(props.project.id)
    confirmSuccess.value = 'Project standards confirmed. Both parties are in alignment.'
    setTimeout(() => {
      confirmSuccess.value = ''
    }, 4000)
  } catch (err: any) {
    error.value = err.message || 'Failed to confirm standards.'
  } finally {
    isConfirming.value = false
  }
}
</script>

<template>
  <div class="standards-module-card ava-card">
    <div class="standards-header">
      <div class="icon-title-group">
        <span class="material-symbols-outlined standards-icon text-primary">description</span>
        <div>
          <h3>Project Detailing Standards</h3>
          <p class="section-desc">
            After studying contract drawings, AVA issues project detailing standards for client sign-off to ensure both teams are on the same page.
          </p>
        </div>
      </div>

      <!-- Alignment Badge -->
      <div class="alignment-badge-box">
        <span
          v-if="project.standardsConfirmedByClient"
          class="status-pill status-aligned"
        >
          <span class="material-symbols-outlined icon-xs text-success">check_circle</span>
          <span>Standards Confirmed & Aligned</span>
        </span>
        <span
          v-else-if="project.standardsPublished"
          class="status-pill status-pending"
        >
          <span class="material-symbols-outlined icon-xs text-warning">schedule</span>
          <span>Awaiting Client Confirmation</span>
        </span>
        <span v-else class="status-pill status-draft">
          <span class="material-symbols-outlined icon-xs text-muted">edit_note</span>
          <span>Standards in Preparation</span>
        </span>
      </div>
    </div>

    <!-- Alert Messages -->
    <div v-if="publishSuccess" class="alert alert-success">{{ publishSuccess }}</div>
    <div v-if="confirmSuccess" class="alert alert-success">{{ confirmSuccess }}</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="standards-content-grid">
      <!-- Published Document Info -->
      <div class="standards-info-panel">
        <h4>Applicable Detailing Codes</h4>
        <p class="standards-meta">
          <strong>Governing Standard:</strong> {{ project.applicableStandards || 'AISC 360 & Code of Standard Practice' }}
        </p>
        <p class="standards-meta">
          <strong>Software & Version:</strong> {{ project.softwareVersion || 'SDS/2 / Tekla Structures' }}
        </p>

        <div v-if="project.standardsPublished" class="doc-link-box">
          <span class="doc-label">Official Standards Document:</span>
          <a
            v-if="project.standardsDocumentUrl"
            :href="project.standardsDocumentUrl"
            target="_blank"
            class="doc-url-link"
          >
            <span class="material-symbols-outlined icon-xs">menu_book</span>
            <span>View Published Standards Document</span>
          </a>
          <span v-else class="text-muted">Published via portal repository</span>
        </div>
        <div v-else class="doc-pending-note">
          AVA detailing team is currently studying contract drawings to formulate project standards.
        </div>
      </div>

      <!-- Action Panel -->
      <div class="standards-action-panel">
        <!-- AVA Staff: Publish Standards Form -->
        <div v-if="authStore.isInternalStaff && !project.standardsConfirmedByClient" class="action-box">
          <h5>Publish / Update Project Standards</h5>
          <p class="action-desc">Publish the project standard specifications to client for formal confirmation.</p>
          <div class="form-group">
            <input
              type="url"
              class="form-control"
              placeholder="Enter document link (e.g. cloud storage or SharePoint link)..."
              v-model="standardsUrl"
            />
          </div>
          <button
            type="button"
            class="btn btn-primary btn-sm"
            :disabled="isPublishing"
            @click="handlePublish"
          >
            {{ isPublishing ? 'Publishing...' : 'Publish Standards to Client' }}
          </button>
        </div>

        <!-- Client Lead: Confirm Standards -->
        <div v-if="authStore.isClientStaff && project.standardsPublished && !project.standardsConfirmedByClient" class="action-box client-signoff-box">
          <h5>Client Confirmation Required</h5>
          <p class="action-desc">
            Please review the published project standards above. By confirming, you acknowledge that detailing will proceed strictly adhering to these specifications.
          </p>
          <button
            type="button"
            class="btn btn-accent btn-sm"
            :disabled="isConfirming"
            @click="handleConfirm"
          >
            <span v-if="!isConfirming" class="material-symbols-outlined icon-xs">check</span>
            <span>{{ isConfirming ? 'Confirming...' : 'Confirm & Sign Off Project Standards' }}</span>
          </button>
        </div>

        <!-- Confirmed State -->
        <div v-if="project.standardsConfirmedByClient" class="action-box confirmed-box">
          <h5>Mutual Agreement Established</h5>
          <p class="action-desc">
            Both AVA detailing and Client engineering teams have established mutual alignment on project standards.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.standards-module-card {
  padding: 1.75rem;
}

.standards-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  border-bottom: 1px solid var(--c-border);
  padding-bottom: 1.25rem;
  margin-bottom: 1.5rem;
}

.icon-title-group {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.standards-icon {
  font-size: 2rem;
  line-height: 1;
}

.standards-header h3 {
  font-size: 1.3rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.25rem;
}

.section-desc {
  font-size: 0.88rem;
  color: var(--c-text-muted);
  max-width: 620px;
}

.status-pill {
  display: inline-block;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
}

.status-aligned {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.status-pending {
  background: #fffbeb;
  color: #b45309;
  border: 1px solid #fde68a;
}

.status-draft {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.standards-content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.75rem;
}

@media (max-width: 768px) {
  .standards-content-grid {
    grid-template-columns: 1fr;
  }
}

.standards-info-panel h4 {
  font-size: 1.05rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.75rem;
}

.standards-meta {
  font-size: 0.9rem;
  color: var(--c-text-dark);
  margin-bottom: 0.4rem;
}

.doc-link-box {
  margin-top: 1rem;
  padding: 0.85rem 1rem;
  background: var(--c-royal-blue-light);
  border: 1px solid var(--c-royal-blue-border);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.doc-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--c-royal-blue-dark);
  text-transform: uppercase;
}

.doc-url-link {
  font-weight: 700;
  color: var(--c-royal-blue);
  text-decoration: none;
  font-size: 0.9rem;
}

.doc-url-link:hover {
  text-decoration: underline;
}

.doc-pending-note {
  margin-top: 1rem;
  font-size: 0.88rem;
  color: var(--c-text-muted);
  font-style: italic;
}

.action-box {
  background: #f8fafc;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 1.25rem;
}

.action-box h5 {
  font-size: 1rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.25rem;
}

.action-desc {
  font-size: 0.84rem;
  color: var(--c-text-muted);
  margin-bottom: 0.85rem;
}

.client-signoff-box {
  background: #fffbeb;
  border-color: #fde68a;
}

.confirmed-box {
  background: #ecfdf5;
  border-color: #a7f3d0;
}

.alert {
  padding: 0.65rem 1rem;
  border-radius: 6px;
  font-size: 0.88rem;
  margin-bottom: 1rem;
}

.alert-success {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.alert-danger {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}
</style>
