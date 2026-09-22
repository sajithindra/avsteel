<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useProjectStore } from '../stores/projectStore'
import { useAuthStore } from '../../../stores/auth'
import type { ProjectProfile, ProjectPhase } from '../../../types/portal'
import ProjectFormModal from './ProjectFormModal.vue'
import ProjectTimeline from './ProjectTimeline.vue'

const emit = defineEmits<{
  (e: 'select-project', project: ProjectProfile): void
}>()

const projectStore = useProjectStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const isCreateModalOpen = ref(false)
const selectedTimelineProject = ref<ProjectProfile | null>(null)
const isTimelineOpen = ref(false)

const handleOpenTimeline = (project: ProjectProfile) => {
  selectedTimelineProject.value = project
  isTimelineOpen.value = true
}

onMounted(() => {
  projectStore.initProjectsListener()
})

onUnmounted(() => {
  projectStore.stopProjectsListener()
})

const phaseLabelMap: Record<ProjectPhase, { label: string; badgeClass: string }> = {
  input_standards: { label: 'Input & Standards', badgeClass: 'badge-input' },
  detailing_clarification: { label: 'In Detailing', badgeClass: 'badge-detailing' },
  approval_review: { label: 'Under Approval', badgeClass: 'badge-approval' },
  shop_release: { label: 'Fabrication Release', badgeClass: 'badge-release' },
  completed: { label: 'Completed & As-Built', badgeClass: 'badge-completed' }
}

const filteredProjects = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return projectStore.visibleProjects.filter((p) => {
    return (
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.projectNumber.toLowerCase().includes(query) ||
      (p.fabricator && p.fabricator.toLowerCase().includes(query)) ||
      (p.clientName && p.clientName.toLowerCase().includes(query)) ||
      (p.poNumber && p.poNumber.toLowerCase().includes(query))
    )
  })
})

const handleSelect = (project: ProjectProfile) => {
  projectStore.selectActiveProject(project)
  emit('select-project', project)
}
</script>

<template>
  <div class="project-list-container">
    <div class="list-header-row">
      <div>
        <h2>Projects</h2>
        <p class="section-desc">
          Track active 3D models, contract drawings, approval packages, and released fabrication files.
        </p>
      </div>

      <button
        v-if="authStore.canManageProjects"
        type="button"
        class="btn btn-primary btn-sm"
        @click="isCreateModalOpen = true"
      >
        + New Detailing Project
      </button>
    </div>

    <!-- Search Bar -->
    <div class="search-filter-box">
      <input
        type="text"
        class="form-control search-input"
        placeholder="Search project by name, project number (e.g. AVA-2026), fabricator, or PO..."
        v-model="searchQuery"
      />
    </div>

    <!-- Loading State -->
    <div v-if="projectStore.loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading active projects...</p>
    </div>

    <!-- Empty State: No Projects Assigned (Zero Dummy Data) -->
    <div v-else-if="filteredProjects.length === 0" class="empty-state-panel">
      <div class="empty-icon"><span class="material-symbols-outlined icon-xxl text-muted">folder_open</span></div>
      <h3>{{ authStore.isClientStaff ? 'No Active Projects Assigned' : 'No Projects Found' }}</h3>
      <p>
        {{
          searchQuery
            ? 'No projects match your search criteria.'
            : authStore.isClientStaff
            ? 'Your account is active. Once your Project Head or Project Manager assigns you to a project team, your drawings, submittals, and fabrication files will appear here.'
            : 'No projects registered in the queue yet. Click "New Detailing Project" above to initialize your first project.'
        }}
      </p>
    </div>

    <!-- Projects Grid -->
    <div v-else class="projects-grid">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        class="project-card ava-card"
        @click="handleOpenTimeline(project)"
      >
        <div class="card-top-row">
          <span class="project-num">{{ project.projectNumber }}</span>
          <span
            class="phase-badge"
            :class="phaseLabelMap[project.currentPhase]?.badgeClass || 'badge-input'"
          >
            {{ phaseLabelMap[project.currentPhase]?.label || project.currentPhase }}
          </span>
        </div>

        <h3 class="card-title">{{ project.name }}</h3>

        <div class="card-meta">
          <div class="meta-item">
            <span class="meta-label">Fabricator:</span>
            <span class="meta-value">{{ project.fabricator || project.clientName }}</span>
          </div>
          <div v-if="project.poNumber" class="meta-item">
            <span class="meta-label">PO Number:</span>
            <span class="meta-value">{{ project.poNumber }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Target Completion:</span>
            <span class="meta-value">{{ project.targetCompletionDate || 'TBD' }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Platform:</span>
            <span class="meta-value">{{ project.softwareVersion || 'SDS/2' }}</span>
          </div>
        </div>

        <div class="card-footer-row">
          <button
            type="button"
            class="timeline-pill-trigger"
            @click.stop="handleOpenTimeline(project)"
            title="Inspect project timeline & milestones"
          >
            <span class="material-symbols-outlined icon-xs">schedule</span>
            <span>View Timeline</span>
          </button>
          <button
            type="button"
            class="open-workspace-btn"
            @click.stop="handleSelect(project)"
            title="Jump directly to drawings and packages"
          >
            <span>Workspace &rarr;</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Interactive Project Timeline Modal -->
    <ProjectTimeline
      v-if="isTimelineOpen && selectedTimelineProject"
      :project="selectedTimelineProject"
      @close="isTimelineOpen = false"
      @open-workspace="handleSelect"
    />

    <!-- Create Project Modal -->
    <ProjectFormModal
      v-if="isCreateModalOpen"
      :is-open="isCreateModalOpen"
      @close="isCreateModalOpen = false"
      @created="isCreateModalOpen = false"
    />
  </div>
</template>

<style scoped>
.project-list-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.list-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.list-header-row h2 {
  font-size: 1.45rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.25rem;
}

.section-desc {
  font-size: 0.92rem;
  color: var(--c-text-muted);
}

.search-filter-box {
  width: 100%;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

.project-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem;
  transition: all var(--transition-normal);
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: var(--c-royal-blue);
  box-shadow: 0 10px 25px rgba(21, 65, 148, 0.12);
}

.card-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.project-num {
  font-family: monospace;
  font-weight: 800;
  font-size: 0.82rem;
  background: var(--c-royal-blue-light);
  color: var(--c-royal-blue-dark);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.phase-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
}

.badge-input {
  background: #f1f5f9;
  color: #475569;
}

.badge-detailing {
  background: #eff6ff;
  color: #1d4ed8;
}

.badge-approval {
  background: #fffbeb;
  color: #b45309;
}

.badge-release {
  background: #f5f3ff;
  color: #6d28d9;
}

.badge-completed {
  background: #ecfdf5;
  color: #047857;
}

.card-title {
  font-size: 1.15rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.85rem;
  line-height: 1.3;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--c-border);
}

.meta-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.86rem;
}

.meta-label {
  color: var(--c-text-muted);
}

.meta-value {
  font-weight: 600;
  color: var(--c-blue-dark);
}

.card-footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.timeline-pill-trigger {
  background: var(--c-royal-blue-light);
  border: 1px solid var(--c-royal-blue-border);
  color: var(--c-royal-blue);
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.3rem 0.65rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.timeline-pill-trigger:hover {
  background: var(--c-royal-blue);
  color: #ffffff;
  border-color: var(--c-royal-blue);
}

.open-workspace-btn {
  background: none;
  border: none;
  font-size: 0.86rem;
  font-weight: 700;
  color: var(--c-royal-blue);
  cursor: pointer;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  transition: all var(--transition-fast);
}

.open-workspace-btn:hover {
  background: var(--c-royal-blue-light);
  color: var(--c-royal-blue-dark);
}

.empty-state-panel {
  text-align: center;
  padding: 3.5rem 2rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px dashed var(--c-border);
}

.empty-icon {
  font-size: 2.75rem;
  margin-bottom: 0.75rem;
}

.empty-state-panel h3 {
  font-size: 1.15rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.35rem;
}

.empty-state-panel p {
  color: var(--c-text-muted);
  font-size: 0.9rem;
  max-width: 480px;
  margin: 0 auto;
}

.loading-state {
  text-align: center;
  padding: 3rem;
  color: var(--c-text-muted);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(21, 65, 148, 0.1);
  border-top-color: var(--c-royal-blue);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
