<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, type UserRole } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const roles: { key: UserRole; label: string; icon: string }[] = [
  { key: 'user', label: 'User (Client)', icon: '👤' },
  { key: 'admin', label: 'Admin', icon: '⚙️' },
  { key: 'ceo', label: 'CEO', icon: '💼' },
  { key: 'engineer', label: 'Engineer', icon: '🏗️' },
  { key: 'tech lead', label: 'Tech Lead', icon: '📐' }
]

const selectedRole = computed(() => authStore.currentRole)

const switchRole = async (role: UserRole) => {
  await authStore.updateUserRole(role)
}

const handleSignOut = async () => {
  await authStore.logout()
  router.push('/signin')
}

// Sample dynamic project data for user view
const clientProjects = ref([
  { id: 'PRJ-2026-001', name: 'Metro Medical Center Tower B', status: 'In Detailing', completion: 75, date: '2026-08-15' },
  { id: 'PRJ-2026-004', name: 'Apex Industrial Logistics Park', status: 'PE Stamping Approved', completion: 100, date: '2026-07-28' },
  { id: 'PRJ-2026-009', name: 'Riverfront Commercial Plaza', status: '3D BIM Review', completion: 45, date: '2026-09-01' }
])

// Sample team users for admin view
const teamUsers = ref([
  { uid: 'usr_001', name: 'Alex Johnson', email: 'alex@avasteel.com', phone: '+1 555-019-8821', role: 'admin' },
  { uid: 'usr_002', name: 'Sarah Miller', email: 'sarah.m@avasteel.com', phone: '+1 555-019-3342', role: 'ceo' },
  { uid: 'usr_003', name: 'David Vance', email: 'david.v@avasteel.com', phone: '+1 555-019-4491', role: 'tech lead' },
  { uid: 'usr_004', name: 'Marcus Steel', email: 'marcus@avasteel.com', phone: '+1 555-019-7710', role: 'engineer' }
])

// Sample engineering tasks
const engineeringTasks = ref([
  { id: 'TSK-101', title: 'Moment Connection Design - Grid C4-C7', priority: 'High', status: 'In Review' },
  { id: 'TSK-104', title: 'Truss Node Weld Calculations (AISC 360-22)', priority: 'Critical', status: 'Approved' },
  { id: 'TSK-108', title: 'Anchor Bolt Layout Plan - Substructure', priority: 'Medium', status: 'Drafting' }
])

// Sample stamping queue for tech lead
const stampingQueue = ref([
  { id: 'STMP-801', project: 'Metro Medical Center', engineer: 'Marcus Steel', type: 'SE Seal (California)', status: 'Pending Review' },
  { id: 'STMP-805', project: 'Apex Industrial Park', engineer: 'David Vance', type: 'PE Seal (Texas)', status: 'Approved & Stamped' }
])
</script>

<template>
  <div class="dashboard-page-container">
    <div class="container">
      <!-- User Header Banner -->
      <div class="dashboard-header ava-card">
        <div class="user-profile-summary">
          <div class="avatar-circle">
            {{ authStore.profile?.name?.charAt(0)?.toUpperCase() || authStore.user?.email?.charAt(0)?.toUpperCase() || 'U' }}
          </div>
          <div class="user-details">
            <div class="user-title-row">
              <h1>Welcome, {{ authStore.profile?.name || authStore.user?.displayName || 'User' }}!</h1>
              <span class="role-badge" :data-role="selectedRole">{{ selectedRole.toUpperCase() }}</span>
            </div>
            <div class="meta-chips">
              <span class="meta-chip">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                {{ authStore.profile?.email || authStore.user?.email }}
              </span>
              <span class="meta-chip" v-if="authStore.profile?.phoneNumber">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                {{ authStore.profile?.phoneNumber }}
              </span>
            </div>
          </div>
        </div>

        <div class="header-actions">
          <button class="btn btn-outline btn-sm" @click="handleSignOut">
            Sign Out
          </button>
        </div>
      </div>

      <!-- Role Selector Bar -->
      <div class="role-selector-card ava-card">
        <div class="selector-title">
          <span class="pulse-indicator"></span>
          <span>Switch Dashboard Role View:</span>
        </div>
        <div class="role-tabs">
          <button
            v-for="r in roles"
            :key="r.key"
            class="role-tab-btn"
            :class="{ active: selectedRole === r.key }"
            @click="switchRole(r.key)"
          >
            <span class="role-icon">{{ r.icon }}</span>
            <span>{{ r.label }}</span>
          </button>
        </div>
      </div>

      <!-- Dynamic Role-Based Views -->
      <div class="role-view-content">

        <!-- 1. USER VIEW -->
        <div v-if="selectedRole === 'user'" class="view-panel">
          <div class="panel-header">
            <h2>Client Portal Dashboard</h2>
            <p>Track your structural steel projects, BIM models, and PE/SE stamping progress.</p>
          </div>

          <div class="grid-stats">
            <div class="stat-card ava-card">
              <div class="stat-num">3</div>
              <div class="stat-label">Active Projects</div>
            </div>
            <div class="stat-card ava-card">
              <div class="stat-num">100%</div>
              <div class="stat-label">AISC Code Compliance</div>
            </div>
            <div class="stat-card ava-card">
              <div class="stat-num">2</div>
              <div class="stat-label">Stamping Clearances Ready</div>
            </div>
          </div>

          <div class="section-card ava-card">
            <h3>Project Status Overview</h3>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Project ID</th>
                    <th>Project Name</th>
                    <th>Status</th>
                    <th>Completion</th>
                    <th>Target Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in clientProjects" :key="p.id">
                    <td class="font-mono">{{ p.id }}</td>
                    <td class="font-bold">{{ p.name }}</td>
                    <td><span class="table-badge">{{ p.status }}</span></td>
                    <td>
                      <div class="progress-bar-container">
                        <div class="progress-fill" :style="{ width: p.completion + '%' }"></div>
                        <span class="progress-text">{{ p.completion }}%</span>
                      </div>
                    </td>
                    <td>{{ p.date }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 2. ADMIN VIEW -->
        <div v-else-if="selectedRole === 'admin'" class="view-panel">
          <div class="panel-header">
            <h2>System Administration & Access Control</h2>
            <p>Manage registered user accounts, assign role permissions, and view system health.</p>
          </div>

          <div class="grid-stats">
            <div class="stat-card ava-card">
              <div class="stat-num">99.98%</div>
              <div class="stat-label">System Uptime</div>
            </div>
            <div class="stat-card ava-card">
              <div class="stat-num">14 ms</div>
              <div class="stat-label">API Latency</div>
            </div>
            <div class="stat-card ava-card">
              <div class="stat-num">Active</div>
              <div class="stat-label">Firestore Database (default)</div>
            </div>
          </div>

          <div class="section-card ava-card">
            <h3>User Roles & Permissions Management</h3>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Assigned Role</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="authStore.profile">
                    <td class="font-mono">{{ authStore.profile.uid.substring(0, 10) }}...</td>
                    <td class="font-bold">{{ authStore.profile.name }} (You)</td>
                    <td>{{ authStore.profile.email }}</td>
                    <td>{{ authStore.profile.phoneNumber }}</td>
                    <td><span class="table-badge current">{{ authStore.profile.role }}</span></td>
                  </tr>
                  <tr v-for="u in teamUsers" :key="u.uid">
                    <td class="font-mono">{{ u.uid }}</td>
                    <td class="font-bold">{{ u.name }}</td>
                    <td>{{ u.email }}</td>
                    <td>{{ u.phone }}</td>
                    <td><span class="table-badge">{{ u.role }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 3. CEO VIEW -->
        <div v-else-if="selectedRole === 'ceo'" class="view-panel">
          <div class="panel-header">
            <h2>Executive & Business Analytics</h2>
            <p>High-level revenue metrics, annual tonnage throughput, and project delivery KPIs.</p>
          </div>

          <div class="grid-stats">
            <div class="stat-card ava-card">
              <div class="stat-num">$12.4M</div>
              <div class="stat-label">Q3 Revenue</div>
            </div>
            <div class="stat-card ava-card">
              <div class="stat-num">48,500 Tons</div>
              <div class="stat-label">Annual Fabricated Steel</div>
            </div>
            <div class="stat-card ava-card">
              <div class="stat-num">98.6%</div>
              <div class="stat-label">On-Time Project Delivery</div>
            </div>
            <div class="stat-card ava-card">
              <div class="stat-num">4.9 / 5.0</div>
              <div class="stat-label">Client Satisfaction</div>
            </div>
          </div>

          <div class="section-card ava-card">
            <h3>Strategic Objectives & Milestone Progress</h3>
            <ul class="kpi-list">
              <li>
                <div class="kpi-info">
                  <strong>Expand SDS/2 3D Model Automation</strong>
                  <span>Target: Q4 2026 — Progress: 82% complete</span>
                </div>
                <div class="progress-bar-container width-200">
                  <div class="progress-fill" style="width: 82%;"></div>
                </div>
              </li>
              <li>
                <div class="kpi-info">
                  <strong>50-State PE/SE Engineering License Coverage</strong>
                  <span>Target: Q3 2026 — Progress: 100% complete (Active in all 50 States)</span>
                </div>
                <div class="progress-bar-container width-200">
                  <div class="progress-fill" style="width: 100%;"></div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- 4. ENGINEER VIEW -->
        <div v-else-if="selectedRole === 'engineer'" class="view-panel">
          <div class="panel-header">
            <h2>Structural Engineering & Detailing Workspace</h2>
            <p>Manage active 3D connection modeling, calculation sheets, and AISC design checks.</p>
          </div>

          <div class="grid-stats">
            <div class="stat-card ava-card">
              <div class="stat-num">12</div>
              <div class="stat-label">Active Connection Tasks</div>
            </div>
            <div class="stat-card ava-card">
              <div class="stat-num">AISC 360-22</div>
              <div class="stat-label">Design Standard</div>
            </div>
            <div class="stat-card ava-card">
              <div class="stat-num">0</div>
              <div class="stat-label">Overdue RFIs</div>
            </div>
          </div>

          <div class="section-card ava-card">
            <h3>Active Detailing Tasks</h3>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Task Title</th>
                    <th>Priority</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="t in engineeringTasks" :key="t.id">
                    <td class="font-mono">{{ t.id }}</td>
                    <td class="font-bold">{{ t.title }}</td>
                    <td>
                      <span class="priority-tag" :class="t.priority.toLowerCase()">{{ t.priority }}</span>
                    </td>
                    <td><span class="table-badge">{{ t.status }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 5. TECH LEAD VIEW -->
        <div v-else-if="selectedRole === 'tech lead'" class="view-panel">
          <div class="panel-header">
            <h2>Technical Lead & Engineering Approval Portal</h2>
            <p>Oversee PE/SE professional stamping queue, quality assurance, and code compliance.</p>
          </div>

          <div class="grid-stats">
            <div class="stat-card ava-card">
              <div class="stat-num">2</div>
              <div class="stat-label">Stamping Requests Pending</div>
            </div>
            <div class="stat-card ava-card">
              <div class="stat-num">0.12</div>
              <div class="stat-label">Error Rate per 1K Tons</div>
            </div>
            <div class="stat-card ava-card">
              <div class="stat-num">100%</div>
              <div class="stat-label">Peer Review Pass Rate</div>
            </div>
          </div>

          <div class="section-card ava-card">
            <h3>PE/SE Stamping Approval Queue</h3>
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Approval ID</th>
                    <th>Project Name</th>
                    <th>Lead Engineer</th>
                    <th>Seal Type Required</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="s in stampingQueue" :key="s.id">
                    <td class="font-mono">{{ s.id }}</td>
                    <td class="font-bold">{{ s.project }}</td>
                    <td>{{ s.engineer }}</td>
                    <td>{{ s.type }}</td>
                    <td><span class="table-badge current">{{ s.status }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page-container {
  padding: 2.5rem 0 5rem 0;
  background-color: var(--c-bg);
  min-height: 85vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 1.75rem 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.user-profile-summary {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.avatar-circle {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-royal-blue) 0%, var(--c-royal-blue-accent) 100%);
  color: #ffffff;
  font-size: 1.6rem;
  font-family: var(--font-heading);
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(21, 65, 148, 0.25);
}

.user-title-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin-bottom: 0.35rem;
}

.user-title-row h1 {
  font-size: 1.45rem;
  color: var(--c-blue-dark);
}

.role-badge {
  background: var(--c-royal-blue);
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  letter-spacing: 0.06em;
}

.role-badge[data-role="admin"] { background: #7c3aed; }
.role-badge[data-role="ceo"] { background: #d97706; }
.role-badge[data-role="engineer"] { background: #2563eb; }
.role-badge[data-role="tech lead"] { background: #059669; }

.meta-chips {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.88rem;
  color: var(--c-text-muted);
}

.role-selector-card {
  margin-bottom: 2rem;
  padding: 1.25rem 1.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  background: var(--c-surface);
}

.selector-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 700;
  color: var(--c-blue-dark);
  font-size: 0.95rem;
}

.pulse-indicator {
  width: 8px;
  height: 8px;
  background-color: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
}

.role-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.role-tab-btn {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.9rem;
  border-radius: 8px;
  border: 1px solid var(--c-border);
  background: var(--c-bg);
  color: var(--c-text-dark);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.role-tab-btn:hover {
  background: var(--c-royal-blue-light);
  border-color: var(--c-royal-blue-border);
}

.role-tab-btn.active {
  background: var(--c-royal-blue);
  color: #ffffff;
  border-color: var(--c-royal-blue);
  box-shadow: 0 4px 10px rgba(21, 65, 148, 0.2);
}

.view-panel {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.panel-header h2 {
  font-size: 1.5rem;
  margin-bottom: 0.35rem;
}

.panel-header p {
  color: var(--c-text-muted);
  font-size: 0.95rem;
}

.grid-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1rem));
  gap: 1.25rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem;
}

.stat-num {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 800;
  color: var(--c-royal-blue);
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--c-text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.section-card {
  padding: 1.75rem;
}

.section-card h3 {
  font-size: 1.2rem;
  margin-bottom: 1.25rem;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.92rem;
}

.data-table th {
  background: var(--c-bg);
  padding: 0.85rem 1rem;
  color: var(--c-text-muted);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.78rem;
  letter-spacing: 0.05em;
  border-bottom: 2px solid var(--c-border);
}

.data-table td {
  padding: 0.9rem 1rem;
  border-bottom: 1px solid var(--c-border);
  color: var(--c-text-dark);
}

.font-mono {
  font-family: monospace;
}

.font-bold {
  font-weight: 700;
}

.table-badge {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  background: #e0f2fe;
  color: #0369a1;
}

.table-badge.current {
  background: #dcfce7;
  color: #15803d;
}

.priority-tag {
  font-size: 0.75rem;
  font-weight: 800;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  text-transform: uppercase;
}

.priority-tag.high { background: #ffedd5; color: #c2410c; }
.priority-tag.critical { background: #fee2e2; color: #b91c1c; }
.priority-tag.medium { background: #fef9c3; color: #a16207; }

.progress-bar-container {
  position: relative;
  height: 18px;
  background: #e2e8f0;
  border-radius: 9px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--c-royal-blue) 0%, var(--c-royal-blue-accent) 100%);
  border-radius: 9px;
}

.progress-text {
  position: absolute;
  right: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--c-blue-dark);
}

.width-200 {
  width: 200px;
}

.kpi-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.kpi-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--c-border);
  flex-wrap: wrap;
  gap: 1rem;
}

.kpi-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.kpi-info strong {
  font-size: 1rem;
  color: var(--c-blue-dark);
}

.kpi-info span {
  font-size: 0.85rem;
  color: var(--c-text-muted);
}
</style>
