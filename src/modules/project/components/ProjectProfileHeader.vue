<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../../../stores/auth'
import { useProjectStore } from '../stores/projectStore'
import type { ProjectProfile, ProjectPhase } from '../../../types/portal'
import ProjectTeamStaffingModal from './ProjectTeamStaffingModal.vue'
import ProjectTimeline from './ProjectTimeline.vue'

const props = defineProps<{
  project: ProjectProfile
}>()

const authStore = useAuthStore()
const projectStore = useProjectStore()
const isStaffingModalOpen = ref(false)
const isTimelineModalOpen = ref(false)

const phases: { key: ProjectPhase; label: string; step: number }[] = [
  { key: 'input_standards', label: '1. Input & Standards Confirmation', step: 1 },
  { key: 'detailing_clarification', label: '2. Detailing & Clarifications', step: 2 },
  { key: 'approval_review', label: '3. Approval Submittal & Review', step: 3 },
  { key: 'shop_release', label: '4. Shop Fabrication & Field Release', step: 4 },
  { key: 'completed', label: '5. Project Completed & As-Built', step: 5 }
]

const currentStepIndex = computed(() => {
  const p = phases.find((phase) => phase.key === props.project.currentPhase)
  return p ? p.step : 1
})

const remainingHours = computed(() => {
  const est = props.project.estimatedHours || 0
  const act = props.project.actualHours || 0
  return Math.max(est - act, 0)
})

const productivityRatio = computed(() => {
  const est = props.project.estimatedHours || 0
  const act = props.project.actualHours || 0
  if (act === 0) return 100
  const ratio = (est / act) * 100
  return Math.round(ratio)
})

const handlePhaseChange = async (newPhase: ProjectPhase) => {
  if (!authStore.canManageProjects) return
  await projectStore.updateProjectPhase(props.project.id, newPhase)
}
</script>

<template>
  <div class="project-header-wrapper">
    <!-- Top Metadata Card -->
    <div class="ava-card profile-summary-card">
      <div class="header-top-row">
        <div>
          <div class="badge-row">
            <span class="project-number-badge">{{ project.projectNumber }}</span>
            <span v-if="project.poNumber" class="po-badge">Purchase Order: {{ project.poNumber }}</span>
            <span class="client-badge">{{ project.clientName || project.fabricator }}</span>
          </div>
          <h1 class="project-title">{{ project.name }}</h1>
          <p class="project-subtext">
            <strong>Location:</strong> {{ project.projectLocation || 'North America' }} &bull;
            <strong>Fabricator:</strong> {{ project.fabricator }} &bull;
            <strong>EOR:</strong> {{ project.structuralEngineer || 'Structural Engineer of Record' }}
          </p>
        </div>

        <div class="header-actions">
          <button
            type="button"
            class="btn btn-outline btn-sm"
            @click="isTimelineModalOpen = true"
            title="Inspect project lifecycle timeline"
          >
            <span class="material-symbols-outlined icon-xs">schedule</span>
            <span>Milestone Timeline</span>
          </button>
          <button
            v-if="authStore.canManageProjects"
            type="button"
            class="btn btn-outline btn-sm"
            @click="isStaffingModalOpen = true"
          >
            <span class="material-symbols-outlined icon-xs">group</span>
            <span>Manage Team Staffing</span>
          </button>
        </div>
      </div>

      <!-- Detailing Specifications Row -->
      <div class="specs-grid">
        <div class="spec-item">
          <span class="spec-label">Modeling Platform</span>
          <span class="spec-value">{{ project.softwareVersion || 'SDS/2 / Tekla Structures' }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Governing Code</span>
          <span class="spec-value">{{ project.applicableStandards || 'AISC 360 & CISC' }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Start Date</span>
          <span class="spec-value">{{ project.startDate || '—' }}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Target Completion</span>
          <span class="spec-value">{{ project.targetCompletionDate || '—' }}</span>
        </div>
      </div>

      <!-- Confidential AVA Internal Metrics (Strictly Hidden for Client Roles) -->
      <div v-if="authStore.isInternalStaff" class="internal-metrics-banner">
        <div class="internal-banner-label">
          <span class="material-symbols-outlined icon-xs">lock</span>
          <span>AVA Confidential Operations Metrics</span>
        </div>
        <div class="metrics-row">
          <div class="metric-cell">
            <span class="m-label">Contract Hours</span>
            <span class="m-val">{{ project.contractHours || 0 }} hrs</span>
          </div>
          <div class="metric-cell">
            <span class="m-label">Estimated Hours</span>
            <span class="m-val">{{ project.estimatedHours || 0 }} hrs</span>
          </div>
          <div class="metric-cell">
            <span class="m-label">Actual Detailing Hours</span>
            <span class="m-val">{{ project.actualHours || 0 }} hrs</span>
          </div>
          <div class="metric-cell">
            <span class="m-label">Remaining Hours</span>
            <span class="m-val">{{ remainingHours }} hrs</span>
          </div>
          <div class="metric-cell">
            <span class="m-label">Productivity Performance</span>
            <span class="m-val" :class="productivityRatio >= 100 ? 'text-green' : 'text-amber'">
              {{ productivityRatio }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 5-Phase Interactive Visual Stepper -->
    <div class="ava-card stepper-card">
      <div class="stepper-header">
        <h4>Project Detailing Lifecycle Progress</h4>
        <span v-if="authStore.canManageProjects" class="stepper-tip">
          Click any milestone phase to update project status
        </span>
      </div>

      <div class="stepper-track">
        <div
          v-for="phase in phases"
          :key="phase.key"
          class="step-item"
          :class="{
            active: project.currentPhase === phase.key,
            completed: currentStepIndex > phase.step,
            clickable: authStore.canManageProjects
          }"
          @click="handlePhaseChange(phase.key)"
        >
          <div class="step-circle">
            <span v-if="currentStepIndex > phase.step" class="material-symbols-outlined icon-xs">check</span>
            <span v-else>{{ phase.step }}</span>
          </div>
          <span class="step-label">{{ phase.label }}</span>
        </div>
      </div>
    </div>

    <!-- Team Staffing Modal -->
    <ProjectTeamStaffingModal
      v-if="isStaffingModalOpen"
      :project="project"
      :is-open="isStaffingModalOpen"
      @close="isStaffingModalOpen = false"
      @updated="isStaffingModalOpen = false"
    />

    <!-- Interactive Project Timeline Modal -->
    <ProjectTimeline
      v-if="isTimelineModalOpen"
      :project="project"
      @close="isTimelineModalOpen = false"
    />
  </div>
</template>

<style scoped>
.project-header-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.profile-summary-card {
  padding: 1.85rem;
}

.header-top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.badge-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.4rem;
}

.project-number-badge {
  font-family: monospace;
  font-weight: 800;
  font-size: 0.82rem;
  background: var(--c-royal-blue-dark);
  color: #ffffff;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
}

.po-badge {
  font-size: 0.78rem;
  font-weight: 700;
  background: #f1f5f9;
  color: #334155;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  border: 1px solid var(--c-border);
}

.client-badge {
  font-size: 0.78rem;
  font-weight: 700;
  background: var(--c-royal-blue-light);
  color: var(--c-royal-blue);
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
}

.project-title {
  font-size: 1.75rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.35rem;
  line-height: 1.2;
}

.project-subtext {
  font-size: 0.88rem;
  color: var(--c-text-muted);
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid var(--c-border);
  border-bottom: 1px solid var(--c-border);
}

.spec-item {
  display: flex;
  flex-direction: column;
}

.spec-label {
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.2rem;
}

.spec-value {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--c-blue-dark);
}

/* Confidential Internal Metrics */
.internal-metrics-banner {
  margin-top: 1.25rem;
  background: #f8fafc;
  border: 1px solid var(--c-royal-blue-border);
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.internal-banner-label {
  font-size: 0.76rem;
  font-weight: 800;
  color: var(--c-royal-blue);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.75rem;
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.metric-cell {
  display: flex;
  flex-direction: column;
}

.m-label {
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--c-text-muted);
  margin-bottom: 0.2rem;
}

.m-val {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--c-blue-dark);
}

.text-green {
  color: #059669;
}

.text-amber {
  color: #d97706;
}

/* Stepper */
.stepper-card {
  padding: 1.25rem 1.75rem;
}

.stepper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stepper-header h4 {
  font-size: 0.95rem;
  color: var(--c-blue-dark);
  font-weight: 700;
}

.stepper-tip {
  font-size: 0.78rem;
  color: var(--c-royal-blue);
  font-style: italic;
}

.stepper-track {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 170px;
  position: relative;
}

.step-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.8rem;
  flex-shrink: 0;
  transition: all var(--transition-fast);
}

.step-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--c-text-muted);
  line-height: 1.3;
}

.step-item.active .step-circle {
  background: var(--c-royal-blue);
  color: #ffffff;
  box-shadow: 0 0 0 4px rgba(21, 65, 148, 0.2);
}

.step-item.active .step-label {
  font-weight: 800;
  color: var(--c-royal-blue-dark);
}

.step-item.completed .step-circle {
  background: #10b981;
  color: #ffffff;
}

.step-item.completed .step-label {
  color: #0f766e;
  font-weight: 700;
}

.step-item.clickable {
  cursor: pointer;
}

.step-item.clickable:hover .step-label {
  color: var(--c-royal-blue);
}
</style>
