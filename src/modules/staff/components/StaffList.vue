<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useStaffStore } from '../stores/staffStore'
import { useAuthStore, isSuperAdminEmail } from '../../../stores/auth'
import type { UserProfile, UserRole } from '../../../types/portal'
import StaffRoleModal from './StaffRoleModal.vue'

const staffStore = useStaffStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const selectedRoleFilter = ref<string>('all')
const editingUser = ref<UserProfile | null>(null)
const isModalOpen = ref(false)

onMounted(() => {
  staffStore.initStaffListener()
})

onUnmounted(() => {
  staffStore.stopStaffListener()
})

const roleDisplayMap: Record<UserRole, { label: string; badgeClass: string }> = {
  superadmin: { label: 'Super Administrator', badgeClass: 'badge-superadmin' },
  project_head: { label: 'Project Head', badgeClass: 'badge-project-head' },
  project_manager: { label: 'Project Manager', badgeClass: 'badge-pm' },
  quality_control: { label: 'Quality Control Inspector', badgeClass: 'badge-qc' },
  steel_detailer: { label: 'Steel Detailer', badgeClass: 'badge-detailer' },
  client_project_lead: { label: 'Client Project Lead', badgeClass: 'badge-client-lead' },
  client_project_reviewer: { label: 'Client Project Reviewer', badgeClass: 'badge-client-reviewer' }
}

const filteredStaff = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return staffStore.staffMembers.filter((m) => {
    const matchesSearch =
      !query ||
      (m.name && m.name.toLowerCase().includes(query)) ||
      (m.email && m.email.toLowerCase().includes(query)) ||
      (m.phoneNumber && m.phoneNumber.includes(query))

    const matchesRole =
      selectedRoleFilter.value === 'all' || m.role === selectedRoleFilter.value

    return matchesSearch && matchesRole
  })
})

const openRoleModal = (user: UserProfile) => {
  editingUser.value = user
  isModalOpen.value = true
}

const closeRoleModal = () => {
  isModalOpen.value = false
  editingUser.value = null
}
</script>

<template>
  <div class="staff-module-container">
    <div class="module-header-row">
      <div>
        <h2>User Management & Staffing Console</h2>
        <p class="section-desc">
          Manage system roles and project permissions for AVA internal staff and client representatives.
        </p>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="filter-controls-row">
      <div class="search-filter-box">
        <input
          type="text"
          class="form-control search-input"
          placeholder="Search by full name, email, or phone number..."
          v-model="searchQuery"
        />
      </div>

      <div class="role-filter-box">
        <select class="form-control" v-model="selectedRoleFilter">
          <option value="all">All Roles & Personnel</option>
          <option value="superadmin">Super Administrator</option>
          <option value="project_head">Project Head</option>
          <option value="project_manager">Project Manager</option>
          <option value="quality_control">Quality Control Inspector</option>
          <option value="steel_detailer">Steel Detailer</option>
          <option value="client_project_lead">Client Project Lead</option>
          <option value="client_project_reviewer">Client Project Reviewer</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="staffStore.loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading user roster...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredStaff.length === 0" class="empty-state-panel">
      <div class="empty-icon"><span class="material-symbols-outlined icon-xxl text-muted">group</span></div>
      <h3>No Users Found</h3>
      <p>
        {{
          searchQuery
            ? 'No registered users match your search criteria.'
            : 'No registered users in the system yet. When users sign in, they will appear here.'
        }}
      </p>
    </div>

    <!-- Table of Users -->
    <div v-else class="table-responsive ava-card">
      <table class="portal-table">
        <thead>
          <tr>
            <th>Full Name & Email</th>
            <th>Phone Number</th>
            <th>Assigned Role</th>
            <th>Projects Assigned</th>
            <th v-if="authStore.canManageStaff" class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredStaff" :key="user.uid">
            <td>
              <div class="user-meta-cell">
                <span class="user-name">{{ user.name || 'Unnamed User' }}</span>
                <span class="user-email">{{ user.email }}</span>
              </div>
            </td>
            <td>
              <span class="phone-text">{{ user.phoneNumber || '—' }}</span>
            </td>
            <td>
              <span
                class="role-pill"
                :class="roleDisplayMap[user.role]?.badgeClass || 'badge-client-reviewer'"
              >
                {{ roleDisplayMap[user.role]?.label || user.role }}
              </span>
            </td>
            <td>
              <span class="count-badge">
                {{ user.assignedProjectIds ? user.assignedProjectIds.length : 0 }} Assigned
              </span>
            </td>
            <td v-if="authStore.canManageStaff" class="text-right">
              <span v-if="isSuperAdminEmail(user.email)" class="protected-superadmin-tag">
                <span class="material-symbols-outlined icon-xs">lock</span> Protected Superadmin
              </span>
              <button
                v-else
                type="button"
                class="btn btn-outline btn-sm"
                @click="openRoleModal(user)"
              >
                Change Role
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Role Assignment Modal -->
    <StaffRoleModal
      v-if="editingUser && isModalOpen"
      :user="editingUser"
      :is-open="isModalOpen"
      @close="closeRoleModal"
      @updated="closeRoleModal"
    />
  </div>
</template>

<style scoped>
.staff-module-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.module-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.module-header-row h2 {
  font-size: 1.45rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.25rem;
}

.section-desc {
  font-size: 0.92rem;
  color: var(--c-text-muted);
}

.filter-controls-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-filter-box {
  flex: 1;
  min-width: 260px;
}

.role-filter-box {
  width: 240px;
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
  padding: 0.95rem 1.15rem;
  border-bottom: 1px solid var(--c-border);
  font-size: 0.9rem;
  color: var(--c-text-dark);
}

.portal-table tbody tr:hover {
  background: rgba(240, 244, 250, 0.5);
}

.user-meta-cell {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 700;
  color: var(--c-blue-dark);
}

.user-email {
  font-size: 0.82rem;
  color: var(--c-text-muted);
}

.phone-text {
  font-family: monospace;
  font-size: 0.88rem;
}

.role-pill {
  display: inline-block;
  font-size: 0.76rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
  text-transform: capitalize;
}

.badge-superadmin {
  background: #fdf2f8;
  color: #9d174d;
  border: 1px solid #fbcfe8;
}

.badge-project-head {
  background: #f5f3ff;
  color: #6d28d9;
  border: 1px solid #ddd6fe;
}

.badge-pm {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.badge-qc {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.badge-detailer {
  background: #f0fdfa;
  color: #0f766e;
  border: 1px solid #99f6e4;
}

.badge-client-lead {
  background: #fffbeb;
  color: #b45309;
  border: 1px solid #fde68a;
}

.badge-client-reviewer {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.count-badge {
  font-size: 0.78rem;
  font-weight: 700;
  background: var(--c-royal-blue-light);
  color: var(--c-royal-blue);
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
}

.text-right {
  text-align: right;
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

.protected-superadmin-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--c-royal-blue);
  background-color: var(--c-royal-blue-light);
  border: 1px solid rgba(21, 65, 148, 0.2);
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  letter-spacing: 0.2px;
}

.icon-xs {
  font-size: 13px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
