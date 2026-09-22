<script setup lang="ts">
import { computed } from 'vue'
import type { ProjectProfile, ProjectPhase } from '../../../types/portal'

const props = defineProps<{
  project: ProjectProfile
  isOpen?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'open-workspace', project: ProjectProfile): void
}>()

interface MilestoneStage {
  step: number
  key: ProjectPhase
  title: string
  subtitle: string
  estimatedDuration: string
  deliverables: string[]
}

const milestoneStages: MilestoneStage[] = [
  {
    step: 1,
    key: 'input_standards',
    title: 'Input & Standards Confirmation',
    subtitle: 'Contract drawings receipt & detailing standard sign-off',
    estimatedDuration: 'Week 1',
    deliverables: [
      'Structural & Architectural Contract Drawings Cataloged',
      'AVA Detailing Standards Published & Confirmed by Client',
      'Initial Connection Design & Anchor Bolt Plan Alignment'
    ]
  },
  {
    step: 2,
    key: 'detailing_clarification',
    title: 'SDS/2 & Tekla 3D Detailing',
    subtitle: '3D modeling, RFI follow-up threading & QA/QC checks',
    estimatedDuration: 'Weeks 2 – 4',
    deliverables: [
      '3D Geometry & Framing Detailing in SDS/2 or Tekla',
      'Requests for Information (RFIs) Raised with System Drawing Ref',
      'Architectural vs Structural Clarifications Resolved',
      'Quality Control Model Audit & Checking Pass'
    ]
  },
  {
    step: 3,
    key: 'approval_review',
    title: 'Approval Package Submittal',
    subtitle: 'Official Drawing Transmittals & Client Review Sign-Off',
    estimatedDuration: 'Weeks 5 – 6',
    deliverables: [
      'Approval Submittal Issued via Drawing Transmittal (Rev A)',
      'Client / EOR Review Decision (Approve / Approve as Noted)',
      'Back From Approval (BFA) Comments Actioned & Model Updated'
    ]
  },
  {
    step: 4,
    key: 'shop_release',
    title: 'Shop Fabrication & Field Release',
    subtitle: 'Production drawings & CNC/DXF/KISS machine exports',
    estimatedDuration: 'Weeks 7 – 8',
    deliverables: [
      'Fabrication Shop Drawing Package Issued (Rev 0)',
      'Automated Machine Files (CNC, KISS, DXF, Tekla PowerFab)',
      'Field Erection Plans, Anchor Bolt Layouts & Bolt Summaries'
    ]
  },
  {
    step: 5,
    key: 'completed',
    title: 'Project Completed & As-Built Archive',
    subtitle: 'Final fabrication closeout & certified archive',
    estimatedDuration: 'Closeout',
    deliverables: [
      'Field Modifications & Revisions Incorporated',
      'Final As-Built Drawing Records Archived',
      'Formal Project Delivery Certified'
    ]
  }
]

const currentStepNumber = computed(() => {
  const stage = milestoneStages.find((s) => s.key === props.project.currentPhase)
  return stage ? stage.step : 1
})

const overallProgressPercent = computed(() => {
  switch (props.project.currentPhase) {
    case 'input_standards':
      return 20
    case 'detailing_clarification':
      return 45
    case 'approval_review':
      return 70
    case 'shop_release':
      return 90
    case 'completed':
      return 100
    default:
      return 15
  }
})

const daysRemaining = computed(() => {
  if (!props.project.targetCompletionDate) return null
  const target = new Date(props.project.targetCompletionDate)
  if (isNaN(target.getTime())) return null
  const now = new Date()
  const diffTime = target.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})
</script>

<template>
  <div class="timeline-modal-backdrop" @click.self="emit('close')">
    <div class="timeline-modal-container ava-card" role="dialog" aria-modal="true">
      <!-- Modal Header -->
      <div class="timeline-header">
        <div class="header-left">
          <div class="badge-row">
            <span class="proj-badge">{{ project.projectNumber }}</span>
            <span class="fabricator-badge">{{ project.fabricator || project.clientName }}</span>
          </div>
          <h2 class="project-title">{{ project.name }} — Project Milestone Timeline</h2>
          <p class="project-meta-line">
            <span><strong>Platform:</strong> {{ project.softwareVersion || 'SDS/2' }}</span>
            <span>&bull;</span>
            <span><strong>Governing Code:</strong> {{ project.applicableStandards || 'AISC 360-22' }}</span>
            <span>&bull;</span>
            <span><strong>Start Date:</strong> {{ project.startDate || 'Project Handover' }}</span>
            <span>&bull;</span>
            <span><strong>Target Completion:</strong> {{ project.targetCompletionDate || 'Scheduled Delivery' }}</span>
          </p>
        </div>

        <button type="button" class="close-btn" @click="emit('close')" aria-label="Close timeline">&times;</button>
      </div>

      <!-- Progress Overview Bar -->
      <div class="progress-banner">
        <div class="progress-top">
          <div class="progress-info">
            <span class="progress-label">Overall Detailing Lifecycle Progress</span>
            <span class="progress-value">{{ overallProgressPercent }}% Completed</span>
          </div>
          <div v-if="daysRemaining !== null" class="schedule-pill" :class="daysRemaining < 0 ? 'pill-overdue' : 'pill-ontime'">
            <span class="schedule-dot"></span>
            <span>{{ daysRemaining >= 0 ? `${daysRemaining} Days Remaining to Release` : `${Math.abs(daysRemaining)} Days Past Schedule` }}</span>
          </div>
        </div>

        <div class="progress-track-bg">
          <div class="progress-bar-fill" :style="{ width: `${overallProgressPercent}%` }"></div>
        </div>
      </div>

      <!-- Vertical Stepper Timeline -->
      <div class="timeline-stages-wrapper">
        <div
          v-for="stage in milestoneStages"
          :key="stage.step"
          class="stage-item"
          :class="{
            'is-completed': currentStepNumber > stage.step,
            'is-active': currentStepNumber === stage.step,
            'is-upcoming': currentStepNumber < stage.step
          }"
        >
          <!-- Stage Node -->
          <div class="stage-node">
            <div class="node-icon">
              <span v-if="currentStepNumber > stage.step" class="material-symbols-outlined icon-xs">check</span>
              <span v-else>{{ stage.step }}</span>
            </div>
            <div class="node-line" v-if="stage.step < milestoneStages.length"></div>
          </div>

          <!-- Stage Details -->
          <div class="stage-card">
            <div class="stage-card-header">
              <div class="stage-title-group">
                <span class="stage-num-tag">PHASE 0{{ stage.step }}</span>
                <h4 class="stage-title">{{ stage.title }}</h4>
              </div>
              <div class="stage-status-badge">
                <span v-if="currentStepNumber > stage.step" class="badge-status completed">Completed</span>
                <span v-else-if="currentStepNumber === stage.step" class="badge-status active">Current Phase</span>
                <span v-else class="badge-status upcoming">Scheduled</span>
              </div>
            </div>

            <p class="stage-subtitle">{{ stage.subtitle }}</p>

            <div class="deliverables-box">
              <span class="deliv-heading">Milestone Deliverables:</span>
              <ul class="deliv-list">
                <li v-for="(deliv, dIdx) in stage.deliverables" :key="dIdx" class="deliv-item">
                  <span class="deliv-bullet" :class="{ 'bullet-done': currentStepNumber > stage.step || (currentStepNumber === stage.step && dIdx === 0) }">
                    <span v-if="currentStepNumber > stage.step" class="material-symbols-outlined icon-xs">check</span>
                    <span v-else>&bull;</span>
                  </span>
                  <span>{{ deliv }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer CTA -->
      <div class="timeline-footer">
        <button type="button" class="btn btn-outline" @click="emit('close')">
          Close Timeline
        </button>
        <button
          type="button"
          class="btn btn-primary"
          @click="emit('open-workspace', project); emit('close')"
        >
          Open Project Workspace &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 43, 92, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1.5rem;
  animation: fadeIn 0.2s ease-out;
}

.timeline-modal-container {
  width: 100%;
  max-width: 860px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 20px 50px rgba(15, 43, 92, 0.25);
  animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--c-border);
  gap: 1rem;
}

.badge-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.proj-badge {
  font-family: monospace;
  font-weight: 800;
  font-size: 0.8rem;
  background: var(--c-royal-blue-light);
  color: var(--c-royal-blue-dark);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.fabricator-badge {
  font-size: 0.78rem;
  font-weight: 700;
  background: #f1f5f9;
  color: #334155;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.project-title {
  font-size: 1.35rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.35rem;
  font-weight: 800;
}

.project-meta-line {
  font-size: 0.82rem;
  color: var(--c-text-muted);
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.75rem;
  line-height: 1;
  color: var(--c-text-muted);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background: #f1f5f9;
  color: var(--c-blue-dark);
}

/* Progress Banner */
.progress-banner {
  background: #f8fafc;
  border: 1px solid var(--c-royal-blue-border);
  border-radius: 10px;
  padding: 1.15rem 1.25rem;
  margin: 1.25rem 0 1.5rem 0;
}

.progress-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.65rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.progress-info {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
}

.progress-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--c-blue-dark);
}

.progress-value {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--c-royal-blue);
}

.schedule-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
}

.pill-ontime {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.pill-overdue {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.schedule-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
}

.progress-track-bg {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-royal-blue) 0%, #2563eb 100%);
  border-radius: 4px;
  transition: width 0.4s ease-out;
}

/* Timeline Track */
.timeline-stages-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.stage-item {
  display: flex;
  gap: 1.25rem;
  position: relative;
}

.stage-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 36px;
  flex-shrink: 0;
}

.node-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.85rem;
  background: #f1f5f9;
  color: #64748b;
  border: 2px solid #cbd5e1;
  z-index: 2;
  transition: all var(--transition-normal);
}

.node-line {
  position: absolute;
  top: 32px;
  bottom: -1.25rem;
  width: 2px;
  background: #e2e8f0;
}

.stage-item.is-completed .node-icon {
  background: #10b981;
  color: #ffffff;
  border-color: #059669;
}

.stage-item.is-completed .node-line {
  background: #10b981;
}

.stage-item.is-active .node-icon {
  background: var(--c-royal-blue);
  color: #ffffff;
  border-color: var(--c-royal-blue-dark);
  box-shadow: 0 0 0 4px rgba(21, 65, 148, 0.2);
}

.stage-card {
  flex: 1;
  background: #f8fafc;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  padding: 1.15rem 1.25rem;
  transition: all var(--transition-normal);
}

.stage-item.is-active .stage-card {
  background: #ffffff;
  border-color: var(--c-royal-blue);
  box-shadow: 0 4px 16px rgba(21, 65, 148, 0.08);
}

.stage-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.stage-title-group {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.stage-num-tag {
  font-family: monospace;
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--c-royal-blue);
  background: var(--c-royal-blue-light);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.stage-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--c-blue-dark);
}

.stage-subtitle {
  font-size: 0.85rem;
  color: var(--c-text-muted);
  margin-bottom: 0.85rem;
}

.badge-status {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.2rem 0.55rem;
  border-radius: 12px;
}

.badge-status.completed {
  background: #ecfdf5;
  color: #047857;
}

.badge-status.active {
  background: var(--c-royal-blue-light);
  color: var(--c-royal-blue);
  border: 1px solid var(--c-royal-blue-border);
}

.badge-status.upcoming {
  background: #f1f5f9;
  color: #64748b;
}

.deliverables-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
}

.stage-item.is-active .deliverables-box {
  border-color: var(--c-royal-blue-border);
}

.deliv-heading {
  display: block;
  font-size: 0.74rem;
  font-weight: 800;
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.45rem;
}

.deliv-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.deliv-item {
  font-size: 0.82rem;
  color: var(--c-text-dark);
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.deliv-bullet {
  font-weight: 800;
  color: #94a3b8;
  font-size: 0.9rem;
}

.deliv-bullet.bullet-done {
  color: #10b981;
}

.timeline-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--c-border);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
