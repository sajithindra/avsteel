<script setup lang="ts">
import { computed } from 'vue'
import type { ProjectProfile, ProjectPhase } from '../../../types/portal'

const props = defineProps<{
  project: ProjectProfile
  drawingsCount: number
  rfisCount: number
  pendingRfisCount: number
  clarificationsCount: number
  transmittalsCount: number
  releasesCount: number
  allProjects?: ProjectProfile[]
}>()

const emit = defineEmits<{
  (e: 'switch-project', project: ProjectProfile): void
  (e: 'open-timeline'): void
  (e: 'jump-tab', tab: string): void
}>()

const phaseMetadata: Record<
  ProjectPhase,
  { label: string; progress: number; badgeColor: string; description: string }
> = {
  input_standards: {
    label: 'Phase 1: Input & Standards Confirmation',
    progress: 20,
    badgeColor: '#0284c7',
    description: 'Contract drawings ingested. Project detailing standards under client review.'
  },
  detailing_clarification: {
    label: 'Phase 2: SDS/2 & Tekla 3D Detailing',
    progress: 45,
    badgeColor: '#2563eb',
    description: 'Active 3D modeling and drawing generation. RFIs & Clarifications tracked.'
  },
  approval_review: {
    label: 'Phase 3: Approval Submittal & Review',
    progress: 70,
    badgeColor: '#d97706',
    description: 'Drawing transmittal package submitted for Client & EOR sign-off.'
  },
  shop_release: {
    label: 'Phase 4: CNC Machine & Shop Fabrication Release',
    progress: 90,
    badgeColor: '#059669',
    description: 'Shop fabrication and field erection drawing packages released to fabricator.'
  },
  completed: {
    label: 'Phase 5: Completed & As-Built Archive',
    progress: 100,
    badgeColor: '#16a34a',
    description: 'All erection releases, as-built models, and closeout archives completed.'
  }
}

const currentPhaseInfo = computed(() => {
  return (
    phaseMetadata[props.project.currentPhase] || {
      label: props.project.currentPhase,
      progress: 50,
      badgeColor: '#2563eb',
      description: 'Project in progress.'
    }
  )
})

const handleProjectSelect = (e: Event) => {
  const targetId = (e.target as HTMLSelectElement).value
  if (!targetId || !props.allProjects) return
  const found = props.allProjects.find((p) => p.id === targetId)
  if (found) {
    emit('switch-project', found)
  }
}
</script>

<template>
  <div class="customer-project-dashboard">
    <!-- Main Executive Overview Card -->
    <div class="executive-card ava-card">
      <div class="executive-top">
        <div class="executive-identity">
          <div class="badge-stack">
            <span class="proj-id-badge">{{ project.projectNumber }}</span>
            <span v-if="project.poNumber" class="po-badge">PO: {{ project.poNumber }}</span>
            <span class="client-badge">{{ project.fabricator || project.clientName }}</span>
          </div>

          <h1 class="project-headline">{{ project.name }}</h1>

          <div class="project-meta-row">
            <span v-if="project.projectLocation" class="meta-pill">
              <span class="material-symbols-outlined icon-xs text-muted">location_on</span>
              <span>{{ project.projectLocation }}</span>
            </span>
            <span class="meta-pill">
              <span class="material-symbols-outlined icon-xs text-muted">corporate_fare</span>
              <span><strong>Fabricator:</strong> {{ project.fabricator }}</span>
            </span>
            <span v-if="project.structuralEngineer" class="meta-pill">
              <span class="material-symbols-outlined icon-xs text-muted">architecture</span>
              <span><strong>EOR:</strong> {{ project.structuralEngineer }}</span>
            </span>
            <span v-if="project.softwareVersion" class="meta-pill">
              <span class="material-symbols-outlined icon-xs text-muted">computer</span>
              <span><strong>3D Engine:</strong> {{ project.softwareVersion }}</span>
            </span>
            <span v-if="project.applicableStandards" class="meta-pill">
              <span class="material-symbols-outlined icon-xs text-muted">description</span>
              <span><strong>Code:</strong> {{ project.applicableStandards }}</span>
            </span>
          </div>
        </div>

        <div class="executive-actions">
          <!-- Project Switcher (if customer has multiple projects) -->
          <div v-if="allProjects && allProjects.length > 1" class="project-switcher-box">
            <label for="activeProjectPicker" class="switcher-label">Switch Active Project:</label>
            <select
              id="activeProjectPicker"
              class="switcher-select form-control"
              :value="project.id"
              @change="handleProjectSelect"
            >
              <option v-for="p in allProjects" :key="p.id" :value="p.id">
                {{ p.projectNumber }} - {{ p.name }}
              </option>
            </select>
          </div>

          <button
            type="button"
            class="btn btn-outline btn-sm timeline-btn"
            @click="emit('open-timeline')"
            title="Inspect project milestone lifecycle"
          >
            <span class="material-symbols-outlined icon-xs">schedule</span>
            <span>Milestone Timeline</span>
          </button>
        </div>
      </div>

      <!-- Lifecycle Progress Banner -->
      <div class="lifecycle-banner">
        <div class="lifecycle-banner-top">
          <div class="phase-indicator">
            <span
              class="phase-dot"
              :style="{ backgroundColor: currentPhaseInfo.badgeColor }"
            ></span>
            <span class="phase-title">{{ currentPhaseInfo.label }}</span>
            <span class="phase-desc">&bull; {{ currentPhaseInfo.description }}</span>
          </div>
          <div class="progress-stats">
            <span class="progress-percent">{{ currentPhaseInfo.progress }}% Complete</span>
          </div>
        </div>

        <div class="progress-track" role="progressbar" :aria-valuenow="currentPhaseInfo.progress" aria-valuemin="0" aria-valuemax="100">
          <div
            class="progress-fill"
            :style="{
              width: `${currentPhaseInfo.progress}%`,
              backgroundColor: currentPhaseInfo.badgeColor
            }"
          ></div>
        </div>

        <div class="schedule-subline">
          <span v-if="project.targetCompletionDate" class="target-date">
            <span class="material-symbols-outlined icon-xs text-muted">calendar_month</span> Scheduled Target Completion: <strong>{{ project.targetCompletionDate }}</strong>
          </span>
          <span v-else class="target-date">
            <span class="material-symbols-outlined icon-xs text-muted">calendar_month</span> Schedule Status: <strong>On Target According to Detailing Schedule</strong>
          </span>
        </div>
      </div>

      <!-- Critical Deliverables & Status Grid -->
      <div class="deliverables-grid">
        <!-- 1. System Drawing Register -->
        <div class="deliverable-tile" @click="emit('jump-tab', 'drawings')">
          <div class="tile-header">
            <span class="material-symbols-outlined tile-icon text-primary">architecture</span>
            <span class="tile-label">Drawing Register</span>
          </div>
          <div class="tile-body">
            <span class="tile-number">{{ drawingsCount }}</span>
            <span class="tile-unit">Sheets Cataloged</span>
          </div>
          <div class="tile-footer">
            <span class="tile-action">View Sheets & 3D &rarr;</span>
          </div>
        </div>

        <!-- 2. Detailing Standards -->
        <div class="deliverable-tile" @click="emit('jump-tab', 'standards')">
          <div class="tile-header">
            <span class="material-symbols-outlined tile-icon text-primary">fact_check</span>
            <span class="tile-label">Standards Sign-off</span>
          </div>
          <div class="tile-body">
            <span
              class="status-tag"
              :class="project.standardsConfirmedByClient ? 'status-confirmed' : 'status-pending'"
            >
              <span class="material-symbols-outlined icon-xs" :class="project.standardsConfirmedByClient ? 'text-success' : 'text-warning'">
                {{ project.standardsConfirmedByClient ? 'check_circle' : 'warning' }}
              </span>
              <span>{{ project.standardsConfirmedByClient ? 'Confirmed' : 'Pending Sign-off' }}</span>
            </span>
          </div>
          <div class="tile-footer">
            <span class="tile-action">
              {{ project.standardsConfirmedByClient ? 'View Standards' : 'Sign Off Standards &rarr;' }}
            </span>
          </div>
        </div>

        <!-- 3. Requests for Information -->
        <div class="deliverable-tile" @click="emit('jump-tab', 'rfis')">
          <div class="tile-header">
            <span class="material-symbols-outlined tile-icon text-primary">help_outline</span>
            <span class="tile-label">RFIs Log</span>
          </div>
          <div class="tile-body">
            <div class="rfi-stat-row">
              <span class="tile-number">{{ rfisCount }}</span>
              <span v-if="pendingRfisCount > 0" class="attention-badge">
                {{ pendingRfisCount }} Awaiting Response
              </span>
            </div>
          </div>
          <div class="tile-footer">
            <span class="tile-action">Inspect RFIs &rarr;</span>
          </div>
        </div>

        <!-- 4. Drawing Clarifications -->
        <div class="deliverable-tile" @click="emit('jump-tab', 'clarifications')">
          <div class="tile-header">
            <span class="material-symbols-outlined tile-icon text-primary">search</span>
            <span class="tile-label">Clarifications</span>
          </div>
          <div class="tile-body">
            <span class="tile-number">{{ clarificationsCount }}</span>
            <span class="tile-unit">Arch vs Str Notices</span>
          </div>
          <div class="tile-footer">
            <span class="tile-action">Review Clarifications &rarr;</span>
          </div>
        </div>

        <!-- 5. Approval Submittals -->
        <div class="deliverable-tile" @click="emit('jump-tab', 'submittals')">
          <div class="tile-header">
            <span class="material-symbols-outlined tile-icon text-primary">upload_file</span>
            <span class="tile-label">Approval Submittals</span>
          </div>
          <div class="tile-body">
            <span class="tile-number">{{ transmittalsCount }}</span>
            <span class="tile-unit">Packages Under Review</span>
          </div>
          <div class="tile-footer">
            <span class="tile-action">Review Submittals &rarr;</span>
          </div>
        </div>

        <!-- 6. Shop Releases -->
        <div class="deliverable-tile" @click="emit('jump-tab', 'shop_releases')">
          <div class="tile-header">
            <span class="material-symbols-outlined tile-icon text-primary">precision_manufacturing</span>
            <span class="tile-label">Fabrication Releases</span>
          </div>
          <div class="tile-body">
            <span class="tile-number">{{ releasesCount }}</span>
            <span class="tile-unit">CNC & Production Packages</span>
          </div>
          <div class="tile-footer">
            <span class="tile-action">Download CNC Releases &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.customer-project-dashboard {
  margin-bottom: 1.5rem;
}

.executive-card {
  padding: 1.75rem 2rem;
  background: #ffffff;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 18px rgba(15, 41, 66, 0.05);
  border: 1px solid var(--c-border);
}

.executive-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.executive-identity {
  flex: 1;
  min-width: 320px;
}

.badge-stack {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.6rem;
}

.proj-id-badge {
  background: var(--c-royal-blue);
  color: #ffffff;
  font-family: var(--font-heading);
  font-size: 0.82rem;
  font-weight: 800;
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
  letter-spacing: 0.02em;
}

.po-badge {
  background: #f1f5f9;
  color: var(--c-blue-dark);
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
}

.client-badge {
  background: var(--c-royal-blue-light);
  color: var(--c-royal-blue);
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
}

.project-headline {
  font-size: 1.65rem;
  font-weight: 800;
  color: var(--c-blue-dark);
  line-height: 1.2;
  margin-bottom: 0.75rem;
}

.project-meta-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.meta-pill {
  font-size: 0.84rem;
  color: var(--c-text-muted);
  background: #f8fafc;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.meta-pill strong {
  color: var(--c-blue-dark);
}

.executive-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}

.project-switcher-box {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.switcher-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--c-text-muted);
}

.switcher-select {
  font-size: 0.86rem;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--c-border);
  min-width: 240px;
}

.timeline-btn {
  font-weight: 700;
  padding: 0.45rem 1rem;
}

/* Lifecycle Banner */
.lifecycle-banner {
  background: #f8fafc;
  border-radius: var(--radius-sm);
  padding: 1.25rem 1.5rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.lifecycle-banner-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.phase-indicator {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.95rem;
}

.phase-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.phase-title {
  font-weight: 800;
  color: var(--c-blue-dark);
}

.phase-desc {
  font-size: 0.85rem;
  color: var(--c-text-muted);
}

.progress-percent {
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--c-royal-blue);
}

.progress-track {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress-fill {
  height: 100%;
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 4px;
}

.schedule-subline {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
  color: var(--c-text-muted);
}

.schedule-subline strong {
  color: var(--c-blue-dark);
}

/* Deliverables Grid */
.deliverables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.deliverable-tile {
  background: #ffffff;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-sm);
  padding: 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.deliverable-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(21, 65, 148, 0.08);
  border-color: var(--c-royal-blue);
}

.tile-header {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.5rem;
}

.tile-icon {
  font-size: 1.1rem;
}

.tile-label {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--c-text-muted);
}

.tile-body {
  margin-bottom: 0.6rem;
}

.tile-number {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--c-blue-dark);
  margin-right: 0.35rem;
}

.tile-unit {
  font-size: 0.78rem;
  color: var(--c-text-muted);
  display: block;
  line-height: 1.2;
}

.status-tag {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.status-confirmed {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #a7f3d0;
}

.status-pending {
  background: #fffbeb;
  color: #b45309;
  border: 1px solid #fde68a;
}

.attention-badge {
  display: inline-block;
  background: #fef2f2;
  color: #dc2626;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  border: 1px solid #fecaca;
  margin-top: 0.25rem;
}

.tile-footer {
  border-top: 1px dashed #e2e8f0;
  padding-top: 0.45rem;
}

.tile-action {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--c-royal-blue);
  transition: color var(--transition-fast);
}

.deliverable-tile:hover .tile-action {
  text-decoration: underline;
}

@media (max-width: 1024px) {
  .executive-actions {
    align-items: flex-start;
    width: 100%;
  }

  .switcher-select {
    width: 100%;
  }
}
</style>
