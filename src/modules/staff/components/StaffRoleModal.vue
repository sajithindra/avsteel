<script setup lang="ts">
import { ref } from 'vue'
import type { UserProfile, UserRole } from '../../../types/portal'
import { useStaffStore } from '../stores/staffStore'
import { isSuperAdminEmail } from '../../../stores/auth'

const props = defineProps<{
  user: UserProfile
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'updated'): void
}>()

const staffStore = useStaffStore()
const selectedRole = ref<UserRole>(props.user.role)
const isSaving = ref(false)
const errorMessage = ref('')
const isSuperAdminAccount = isSuperAdminEmail(props.user.email)

const rolesList: { key: UserRole; label: string; group: string; desc: string }[] = [
  { key: 'superadmin', label: 'Super Administrator', group: 'AVA Internal', desc: 'Complete system rights and organization governance' },
  { key: 'project_head', label: 'Project Head', group: 'AVA Internal', desc: 'Operations leadership, project staffing, and release approvals' },
  { key: 'project_manager', label: 'Project Manager', group: 'AVA Internal', desc: 'Direct project manager, transmittal creator, and schedule tracking' },
  { key: 'quality_control', label: 'Quality Control Inspector', group: 'AVA Internal', desc: 'Model checker, drawing verification, and Back From Approval comment actions' },
  { key: 'steel_detailer', label: 'Steel Detailer', group: 'AVA Internal', desc: 'SDS/2 and Tekla 3D modeler, detail sheet producer, machine exports' },
  { key: 'client_project_lead', label: 'Client Project Lead', group: 'Client Organization', desc: 'Client PM / Fabricator Admin: uploads contract drawings, package sign-off' },
  { key: 'client_project_reviewer', label: 'Client Project Reviewer', group: 'Client Organization', desc: 'Client engineer / reviewer: answers RFIs, submits BFA comments' }
]

const handleSave = async () => {
  if (isSuperAdminAccount) return
  isSaving.value = true
  errorMessage.value = ''
  try {
    await staffStore.updateUserRole(props.user.uid, selectedRole.value)
    emit('updated')
    emit('close')
  } catch (err: any) {
    errorMessage.value = err.message || 'Failed to update user role.'
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
          <h3>Assign System Role</h3>
          <p class="modal-subtitle">Update permission level for <strong>{{ user.name || user.email }}</strong></p>
        </div>
        <button class="close-btn" @click="emit('close')" aria-label="Close modal">&times;</button>
      </div>

      <div v-if="isSuperAdminAccount" class="alert alert-warning" role="alert">
        This account is the designated Primary Super Administrator ({{ user.email }}). Its administrative status cannot be altered.
      </div>

      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>

      <div class="roles-container">
        <label
          v-for="r in rolesList"
          :key="r.key"
          class="role-option"
          :class="{ selected: selectedRole === r.key }"
        >
          <input
            type="radio"
            :value="r.key"
            v-model="selectedRole"
            name="systemRole"
            class="role-radio"
          />
          <div class="role-details">
            <div class="role-title-row">
              <span class="role-name">{{ r.label }}</span>
              <span class="role-badge" :class="r.group === 'AVA Internal' ? 'ava-badge' : 'client-badge'">
                {{ r.group }}
              </span>
            </div>
            <p class="role-desc">{{ r.desc }}</p>
          </div>
        </label>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn btn-outline btn-sm" @click="emit('close')">
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary btn-sm"
          :disabled="isSaving || selectedRole === user.role"
          @click="handleSave"
        >
          {{ isSaving ? 'Saving Role...' : 'Confirm Role Assignment' }}
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
  max-width: 600px;
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
  font-size: 1.35rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.2rem;
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
  line-height: 1;
}

.roles-container {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  overflow-y: auto;
  padding-right: 0.35rem;
  margin-bottom: 1.5rem;
  max-height: 380px;
}

.role-option {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all var(--transition-fast);
  background: #ffffff;
}

.role-option:hover {
  border-color: var(--c-royal-blue);
  background: var(--c-royal-blue-light);
}

.role-option.selected {
  border-color: var(--c-royal-blue);
  background: rgba(21, 65, 148, 0.05);
  box-shadow: 0 0 0 1px var(--c-royal-blue);
}

.role-radio {
  margin-top: 0.25rem;
  accent-color: var(--c-royal-blue);
}

.role-details {
  flex: 1;
}

.role-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.role-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--c-blue-dark);
}

.role-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.ava-badge {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.client-badge {
  background: #fef3c7;
  color: #b45309;
  border: 1px solid #fde68a;
}

.role-desc {
  font-size: 0.82rem;
  color: var(--c-text-muted);
  line-height: 1.4;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid var(--c-border);
  padding-top: 1rem;
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
