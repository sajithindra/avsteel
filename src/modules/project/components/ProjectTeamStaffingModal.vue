<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjectStore } from '../stores/projectStore'
import { useStaffStore } from '../../staff/stores/staffStore'
import type { ProjectProfile } from '../../../types/portal'

const props = defineProps<{
  project: ProjectProfile
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated'): void
}>()

const projectStore = useProjectStore()
const staffStore = useStaffStore()

const pmId = ref(props.project.projectManagerId || '')
const selectedQcIds = ref<string[]>([...props.project.qualityControlIds])
const selectedDetailerIds = ref<string[]>([...props.project.steelDetailerIds])
const selectedClientLeadIds = ref<string[]>([...props.project.clientProjectLeadIds])
const selectedClientReviewerIds = ref<string[]>([...props.project.clientProjectReviewerIds])

const isSaving = ref(false)
const errorMessage = ref('')

onMounted(() => {
  staffStore.initStaffListener()
})

const pmCandidates = computed(() =>
  staffStore.staffMembers.filter((m) => m.role === 'project_manager' || m.role === 'project_head')
)

const qcCandidates = computed(() =>
  staffStore.staffMembers.filter((m) => m.role === 'quality_control')
)

const detailerCandidates = computed(() =>
  staffStore.staffMembers.filter((m) => m.role === 'steel_detailer')
)

const clientLeadCandidates = computed(() =>
  staffStore.staffMembers.filter((m) => m.role === 'client_project_lead')
)

const clientReviewerCandidates = computed(() =>
  staffStore.staffMembers.filter((m) => m.role === 'client_project_reviewer')
)

const toggleSelection = (listRef: { value: string[] }, id: string) => {
  const index = listRef.value.indexOf(id)
  if (index === -1) {
    listRef.value.push(id)
  } else {
    listRef.value.splice(index, 1)
  }
}

const handleSave = async () => {
  isSaving.value = true
  errorMessage.value = ''
  try {
    await projectStore.updateProjectTeam(props.project.id, {
      projectManagerId: pmId.value,
      qualityControlIds: selectedQcIds.value,
      steelDetailerIds: selectedDetailerIds.value,
      clientProjectLeadIds: selectedClientLeadIds.value,
      clientProjectReviewerIds: selectedClientReviewerIds.value
    })
    emit('updated')
    emit('close')
  } catch (err: any) {
    errorMessage.value = err.message || 'Failed to update project team allocation.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop">
    <div class="modal-dialog ava-card animate-fade-in">
      <div class="modal-header">
        <div>
          <h3>Project Team Staffing & Allocation</h3>
          <p class="modal-subtitle">Assign internal detailing personnel and client representatives to <strong>{{ project.name }}</strong></p>
        </div>
        <button class="close-btn" @click="emit('close')" aria-label="Close modal">&times;</button>
      </div>

      <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

      <div class="staffing-scroll-body">
        <!-- 1. Project Manager -->
        <div class="staffing-section">
          <h4>AVA Project Manager</h4>
          <select class="form-control" v-model="pmId">
            <option value="">Select Assigned Project Manager...</option>
            <option v-for="pm in pmCandidates" :key="pm.uid" :value="pm.uid">
              {{ pm.name }} ({{ pm.email }})
            </option>
          </select>
        </div>

        <!-- 2. Quality Control Inspectors -->
        <div class="staffing-section">
          <h4>Quality Control Inspectors</h4>
          <div v-if="qcCandidates.length === 0" class="empty-candidate-note">
            No Quality Control personnel found. Promote staff members in the Staff Console first.
          </div>
          <div v-else class="checkbox-grid">
            <label
              v-for="qc in qcCandidates"
              :key="qc.uid"
              class="candidate-checkbox-item"
              :class="{ checked: selectedQcIds.includes(qc.uid) }"
            >
              <input
                type="checkbox"
                :checked="selectedQcIds.includes(qc.uid)"
                @change="toggleSelection({ value: selectedQcIds }, qc.uid)"
              />
              <span>{{ qc.name || qc.email }}</span>
            </label>
          </div>
        </div>

        <!-- 3. Steel Detailers -->
        <div class="staffing-section">
          <h4>Steel Detailers</h4>
          <div v-if="detailerCandidates.length === 0" class="empty-candidate-note">
            No Steel Detailers found. Assign users the Steel Detailer role first.
          </div>
          <div v-else class="checkbox-grid">
            <label
              v-for="det in detailerCandidates"
              :key="det.uid"
              class="candidate-checkbox-item"
              :class="{ checked: selectedDetailerIds.includes(det.uid) }"
            >
              <input
                type="checkbox"
                :checked="selectedDetailerIds.includes(det.uid)"
                @change="toggleSelection({ value: selectedDetailerIds }, det.uid)"
              />
              <span>{{ det.name || det.email }}</span>
            </label>
          </div>
        </div>

        <!-- 4. Client Project Leads -->
        <div class="staffing-section">
          <h4>Client Project Leads</h4>
          <div v-if="clientLeadCandidates.length === 0" class="empty-candidate-note">
            No Client Project Leads registered yet.
          </div>
          <div v-else class="checkbox-grid">
            <label
              v-for="lead in clientLeadCandidates"
              :key="lead.uid"
              class="candidate-checkbox-item"
              :class="{ checked: selectedClientLeadIds.includes(lead.uid) }"
            >
              <input
                type="checkbox"
                :checked="selectedClientLeadIds.includes(lead.uid)"
                @change="toggleSelection({ value: selectedClientLeadIds }, lead.uid)"
              />
              <span>{{ lead.name || lead.email }}</span>
            </label>
          </div>
        </div>

        <!-- 5. Client Project Reviewers -->
        <div class="staffing-section">
          <h4>Client Project Reviewers & Engineers</h4>
          <div v-if="clientReviewerCandidates.length === 0" class="empty-candidate-note">
            No Client Reviewers registered yet.
          </div>
          <div v-else class="checkbox-grid">
            <label
              v-for="rev in clientReviewerCandidates"
              :key="rev.uid"
              class="candidate-checkbox-item"
              :class="{ checked: selectedClientReviewerIds.includes(rev.uid) }"
            >
              <input
                type="checkbox"
                :checked="selectedClientReviewerIds.includes(rev.uid)"
                @change="toggleSelection({ value: selectedClientReviewerIds }, rev.uid)"
              />
              <span>{{ rev.name || rev.email }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-outline btn-sm" @click="emit('close')">
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary btn-sm"
          :disabled="isSaving"
          @click="handleSave"
        >
          {{ isSaving ? 'Saving Team Allocation...' : 'Save Team Allocation' }}
        </button>
      </div>
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

.staffing-scroll-body {
  overflow-y: auto;
  max-height: 440px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-right: 0.5rem;
}

.staffing-section h4 {
  font-size: 0.95rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.4rem;
  font-weight: 700;
}

.empty-candidate-note {
  font-size: 0.84rem;
  color: var(--c-text-muted);
  font-style: italic;
  padding: 0.4rem 0;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.candidate-checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.75rem;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.86rem;
  color: var(--c-text-dark);
  background: #ffffff;
  transition: all var(--transition-fast);
}

.candidate-checkbox-item:hover {
  background: var(--c-royal-blue-light);
  border-color: var(--c-royal-blue-border);
}

.candidate-checkbox-item.checked {
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
</style>
