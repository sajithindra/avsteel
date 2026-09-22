<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useProjectStore } from '../modules/project/stores/projectStore'
import { useCommunicationStore } from '../modules/communication/stores/communicationStore'
import { useReleasesStore } from '../modules/releases/stores/releasesStore'
import { useAuditStore } from '../core/audit/auditStore'
import type { ProjectProfile } from '../types/portal'

// Module Components
import ProjectList from '../modules/project/components/ProjectList.vue'
import ProjectProfileHeader from '../modules/project/components/ProjectProfileHeader.vue'
import ProjectDrawingRegister from '../modules/project/components/ProjectDrawingRegister.vue'
import ProjectStandardsSignoff from '../modules/project/components/ProjectStandardsSignoff.vue'
import RequestForInformationList from '../modules/communication/components/RequestForInformationList.vue'
import DrawingClarificationList from '../modules/communication/components/DrawingClarificationList.vue'
import BackFromApprovalCommentsRegister from '../modules/communication/components/BackFromApprovalCommentsRegister.vue'
import ApprovalSubmittalList from '../modules/releases/components/ApprovalSubmittalList.vue'
import ShopFabricationReleaseList from '../modules/releases/components/ShopFabricationReleaseList.vue'
import FieldErectionReleaseList from '../modules/releases/components/FieldErectionReleaseList.vue'
import ProjectActivityLogFeed from '../modules/project/components/ProjectActivityLogFeed.vue'
import StaffList from '../modules/staff/components/StaffList.vue'
import CustomerList from '../modules/customer/components/CustomerList.vue'
import CustomerProjectDashboard from '../modules/project/components/CustomerProjectDashboard.vue'
import ProjectTimeline from '../modules/project/components/ProjectTimeline.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const projectStore = useProjectStore()
const communicationStore = useCommunicationStore()
const releasesStore = useReleasesStore()
const auditStore = useAuditStore()

// Sidenav & Navigation State
const activeNav = ref<'projects' | 'staff' | 'customers'>('projects')
const projectSubTab = ref<
  | 'drawings'
  | 'standards'
  | 'rfis'
  | 'clarifications'
  | 'bfa_comments'
  | 'submittals'
  | 'shop_releases'
  | 'field_releases'
  | 'activity'
>('drawings')
const isSidebarOpen = ref(false)
const isTimelineModalOpen = ref(false)

// Active Project State
const activeProject = computed(() => projectStore.activeProject)

const pendingRfisCount = computed(() => {
  return communicationStore.rfis.filter(
    (r) => r.status === 'Awaiting Client Response' || r.status === 'Submitted to Client'
  ).length
})

// Consolidated Error Management
const activeErrorMessage = computed(() => {
  return projectStore.error || communicationStore.error || releasesStore.error || ''
})

const dismissError = () => {
  projectStore.error = ''
  communicationStore.error = ''
  releasesStore.error = ''
}

const navigateTo = (path: string) => {
  isSidebarOpen.value = false
  if (route.path !== path) {
    router.push(path)
  }
}

// Sync activeNav with current route path
watch(
  () => route.path,
  (path) => {
    if (path === '/dashboard/staff') {
      activeNav.value = 'staff'
    } else if (path === '/dashboard/customers') {
      activeNav.value = 'customers'
    } else {
      activeNav.value = 'projects'
    }
  },
  { immediate: true }
)

const handleSelectProject = (project: ProjectProfile, pushRoute: boolean = true) => {
  projectStore.selectActiveProject(project)
  communicationStore.initProjectCommunication(project.id)
  releasesStore.initProjectReleases(project.id)
  auditStore.initProjectAuditListener(project.id)
  projectSubTab.value = 'drawings'

  if (pushRoute && route.params.projectId !== project.id) {
    router.push({ name: 'project-detail', params: { projectId: project.id } })
  }
}

const handleBackToProjects = (pushRoute: boolean = true) => {
  projectStore.selectActiveProject(null)
  communicationStore.stopProjectCommunication()
  releasesStore.stopProjectReleases()
  auditStore.stopProjectAuditListener()

  if (pushRoute && (route.name === 'project-detail' || route.path.startsWith('/dashboard/project'))) {
    router.push({ name: 'dashboard' })
  }
}

// Automatically select active project for customer accounts upon viewing dashboard
watch(
  () => [projectStore.visibleProjects, authStore.isClientStaff] as const,
  ([projects, isClient]) => {
    if (isClient && projects.length > 0 && !projectStore.activeProject) {
      const first = projects[0]
      if (first) {
        handleSelectProject(first, false)
      }
    }
  },
  { immediate: true }
)

// Watch route params for deep-linking & auto hydration
watch(
  () => route.params.projectId,
  async (newId) => {
    if (newId && typeof newId === 'string') {
      if (projectStore.activeProject?.id !== newId) {
        const p = await projectStore.selectActiveProjectById(newId)
        if (p) {
          communicationStore.initProjectCommunication(p.id)
          releasesStore.initProjectReleases(p.id)
          auditStore.initProjectAuditListener(p.id)
        }
      }
    } else if (!newId && projectStore.activeProject && !authStore.isClientStaff) {
      handleBackToProjects(false)
    }
  },
  { immediate: true }
)

// Clean lifecycle listener cleanup to prevent memory leaks
onUnmounted(() => {
  communicationStore.stopProjectCommunication()
  releasesStore.stopProjectReleases()
  auditStore.stopProjectAuditListener()
})

const handleSignOut = async () => {
  await authStore.logout()
  router.push('/signin')
}
</script>

<template>
  <div class="portal-layout">
    <!-- Sidenav Bar (Dedicated Primary Sidebar Navigation) -->
    <aside class="portal-sidenav" :class="{ 'is-open': isSidebarOpen }">
      <div class="sidenav-header">
        <div class="brand-badge-group">
          <span class="logo-box">AVA</span>
          <div class="brand-meta">
            <span class="brand-title">AVA Steel Portal</span>
            <span class="role-tag" :data-role="authStore.currentRole">
              {{ authStore.currentRole.replace(/_/g, ' ').toUpperCase() }}
            </span>
          </div>
        </div>
        <button class="mobile-close-btn" @click="isSidebarOpen = false" aria-label="Close menu">&times;</button>
      </div>

      <nav class="sidenav-nav">
        <!-- 1. Projects -->
        <button
          type="button"
          class="sidenav-link"
          :class="{ active: activeNav === 'projects' }"
          @click="navigateTo('/dashboard')"
        >
          <span class="material-symbols-outlined nav-icon">folder</span>
          <span>Projects</span>
        </button>

        <!-- 2. Staff (Admin / Head / PM Only) -->
        <button
          v-if="authStore.canManageStaff"
          type="button"
          class="sidenav-link"
          :class="{ active: activeNav === 'staff' }"
          @click="navigateTo('/dashboard/staff')"
        >
          <span class="material-symbols-outlined nav-icon">group</span>
          <span>Staff</span>
        </button>

        <!-- 3. Customers (Admin / Head / PM Only) -->
        <button
          v-if="authStore.canManageStaff"
          type="button"
          class="sidenav-link"
          :class="{ active: activeNav === 'customers' }"
          @click="navigateTo('/dashboard/customers')"
        >
          <span class="material-symbols-outlined nav-icon">corporate_fare</span>
          <span>Customers</span>
        </button>
      </nav>

      <div class="sidenav-footer">
        <div class="user-brief">
          <span class="ub-name">{{ authStore.profile?.name || authStore.user?.displayName || 'Active User' }}</span>
          <span class="ub-email">{{ authStore.user?.email }}</span>
        </div>
        <button type="button" class="btn btn-outline btn-sm logout-btn" @click="handleSignOut">
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Main Workspace Content -->
    <main class="portal-main">
      <!-- Mobile Sidebar Toggle (No appbar for logged-in user) -->
      <button class="mobile-sidebar-toggle" @click="isSidebarOpen = true" aria-label="Open navigation menu">
        <span class="material-symbols-outlined icon-sm">menu</span> Navigation
      </button>

      <!-- Global Error Banner -->
      <div v-if="activeErrorMessage" class="alert alert-danger global-alert dismissable-alert">
        <div class="alert-content-group">
          <span class="material-symbols-outlined alert-icon text-danger">warning</span>
          <span class="alert-message">{{ activeErrorMessage }}</span>
        </div>
        <button type="button" class="alert-dismiss-btn" @click="dismissError" aria-label="Dismiss error">&times;</button>
      </div>

      <!-- Main Portal Body Views -->
      <div class="portal-content-body">
        <!-- ============================================== -->
        <!-- VIEW 1: PROJECTS WORKSPACE                     -->
        <!-- ============================================== -->
        <section v-if="activeNav === 'projects'" class="portal-section">
          <!-- State A: Client with no projects assigned yet -->
          <div v-if="authStore.isClientStaff && projectStore.visibleProjects.length === 0" class="customer-empty-welcome ava-card">
            <div class="cew-icon"><span class="material-symbols-outlined icon-xxl text-primary">corporate_fare</span></div>
            <h2>Welcome to AVA Steel Client Portal, {{ authStore.profile?.name || authStore.user?.displayName || 'Client Partner' }}</h2>
            <p class="cew-text">
              Your client portal account is active and verified. Your Project Manager or Project Head will assign your structural steel detailing projects shortly.
            </p>
            <div class="cew-specs">
              <span class="cew-badge">SDS/2 & Tekla 3D Detailing</span>
              <span class="cew-badge">AISC 360-22 Governing Standards</span>
              <span class="cew-badge">Automated CNC & Machine Release Tracking</span>
            </div>
          </div>

          <!-- State B: Staff view with no project selected (Projects Registry) -->
          <div v-else-if="!activeProject && !authStore.isClientStaff">
            <ProjectList @select-project="handleSelectProject" />
          </div>

          <!-- State C: Dedicated Active Project Workspace (Customer or Staff) -->
          <div v-else-if="activeProject" class="active-project-workspace">
            <!-- For Customer: Important Details Shown First -->
            <CustomerProjectDashboard
              v-if="authStore.isClientStaff"
              :project="activeProject"
              :drawings-count="projectStore.activeProjectDrawings.length"
              :rfis-count="communicationStore.rfis.length"
              :pending-rfis-count="pendingRfisCount"
              :clarifications-count="communicationStore.clarifications.length"
              :transmittals-count="releasesStore.transmittals.length"
              :releases-count="releasesStore.releasePackages.length"
              :all-projects="projectStore.visibleProjects"
              @switch-project="handleSelectProject($event)"
              @open-timeline="isTimelineModalOpen = true"
              @jump-tab="projectSubTab = $event as any"
            />

            <!-- For Staff: Project Profile Header & Lifecycle Progress -->
            <template v-else>
              <div class="back-navigation-bar">
                <button type="button" class="back-btn" @click="handleBackToProjects()">
                  &larr; Back to Projects
                </button>
              </div>
              <ProjectProfileHeader :project="activeProject" />
            </template>

            <!-- Project Navigation Tabs -->
            <div class="project-tabs-nav-bar">
              <button
                type="button"
                class="tab-btn"
                :class="{ active: projectSubTab === 'drawings' }"
                @click="projectSubTab = 'drawings'"
              >
                <span class="material-symbols-outlined icon-sm">architecture</span>
                <span>System Drawing Register</span>
              </button>
              <button
                type="button"
                class="tab-btn"
                :class="{ active: projectSubTab === 'standards' }"
                @click="projectSubTab = 'standards'"
              >
                <span class="material-symbols-outlined icon-sm">description</span>
                <span>Detailing Standards</span>
              </button>
              <button
                type="button"
                class="tab-btn"
                :class="{ active: projectSubTab === 'rfis' }"
                @click="projectSubTab = 'rfis'"
              >
                <span class="material-symbols-outlined icon-sm">help_outline</span>
                <span>Requests for Information</span>
              </button>
              <button
                type="button"
                class="tab-btn"
                :class="{ active: projectSubTab === 'clarifications' }"
                @click="projectSubTab = 'clarifications'"
              >
                <span class="material-symbols-outlined icon-sm">balance</span>
                <span>Drawing Clarifications</span>
              </button>
              <button
                type="button"
                class="tab-btn"
                :class="{ active: projectSubTab === 'bfa_comments' }"
                @click="projectSubTab = 'bfa_comments'"
              >
                <span class="material-symbols-outlined icon-sm">rate_review</span>
                <span>Back From Approval Comments</span>
              </button>
              <button
                type="button"
                class="tab-btn"
                :class="{ active: projectSubTab === 'submittals' }"
                @click="projectSubTab = 'submittals'"
              >
                <span class="material-symbols-outlined icon-sm">inventory_2</span>
                <span>Approval Submittals</span>
              </button>
              <button
                type="button"
                class="tab-btn"
                :class="{ active: projectSubTab === 'shop_releases' }"
                @click="projectSubTab = 'shop_releases'"
              >
                <span class="material-symbols-outlined icon-sm">precision_manufacturing</span>
                <span>Shop Releases</span>
              </button>
              <button
                type="button"
                class="tab-btn"
                :class="{ active: projectSubTab === 'field_releases' }"
                @click="projectSubTab = 'field_releases'"
              >
                <span class="material-symbols-outlined icon-sm">construction</span>
                <span>Field Releases</span>
              </button>
              <button
                type="button"
                class="tab-btn"
                :class="{ active: projectSubTab === 'activity' }"
                @click="projectSubTab = 'activity'"
              >
                <span class="material-symbols-outlined icon-sm">history</span>
                <span>Activity Audit Trail</span>
              </button>
            </div>

            <Transition name="tab-fade" mode="out-in">
              <!-- Tab 1: System Drawing Register -->
              <div v-if="projectSubTab === 'drawings'" key="drawings" class="tab-pane">
                <ProjectDrawingRegister :project-id="activeProject.id" />
              </div>

              <!-- Tab 2: Project Standards Sign-off -->
              <div v-else-if="projectSubTab === 'standards'" key="standards" class="tab-pane">
                <ProjectStandardsSignoff :project="activeProject" />
              </div>

              <!-- Tab 3: Requests for Information -->
              <div v-else-if="projectSubTab === 'rfis'" key="rfis" class="tab-pane">
                <RequestForInformationList :project-id="activeProject.id" />
              </div>

              <!-- Tab 4: Drawing Clarifications -->
              <div v-else-if="projectSubTab === 'clarifications'" key="clarifications" class="tab-pane">
                <DrawingClarificationList :project-id="activeProject.id" />
              </div>

              <!-- Tab 5: Back From Approval Comments -->
              <div v-else-if="projectSubTab === 'bfa_comments'" key="bfa_comments" class="tab-pane">
                <BackFromApprovalCommentsRegister :project-id="activeProject.id" />
              </div>

              <!-- Tab 6: Approval Submittals -->
              <div v-else-if="projectSubTab === 'submittals'" key="submittals" class="tab-pane">
                <ApprovalSubmittalList :project-id="activeProject.id" />
              </div>

              <!-- Tab 7: Shop Fabrication Releases -->
              <div v-else-if="projectSubTab === 'shop_releases'" key="shop_releases" class="tab-pane">
                <ShopFabricationReleaseList :project-id="activeProject.id" />
              </div>

              <!-- Tab 8: Field Erection Releases -->
              <div v-else-if="projectSubTab === 'field_releases'" key="field_releases" class="tab-pane">
                <FieldErectionReleaseList :project-id="activeProject.id" />
              </div>

              <!-- Tab 9: Project Activity Audit Trail -->
              <div v-else-if="projectSubTab === 'activity'" key="activity" class="tab-pane">
                <ProjectActivityLogFeed />
              </div>
            </Transition>
          </div>
        </section>

        <!-- ============================================== -->
        <!-- VIEW 2: USER & STAFF MANAGEMENT                -->
        <!-- ============================================== -->
        <section v-else-if="activeNav === 'staff'" class="portal-section">
          <StaffList />
        </section>

        <!-- ============================================== -->
        <!-- VIEW 3: CUSTOMER & FABRICATOR DIRECTORY        -->
        <!-- ============================================== -->
        <section v-else-if="activeNav === 'customers'" class="portal-section">
          <CustomerList />
        </section>
      </div>

      <!-- Dedicated Dashboard Footer -->
      <footer class="portal-footer">
        <div class="portal-footer-inner">
          <div class="portal-footer-left">
            <span class="p-dot"></span>
            <span>&copy; {{ new Date().getFullYear() }} AVA Steel Detailing Portal &bull; Enterprise Secure Cloud</span>
          </div>
          <div class="portal-footer-credits">
            Imagined by <span class="credit-highlight">Sajithindra</span> &bull; Developed by <span class="credit-highlight">Survmonx LLP</span>
          </div>
        </div>
      </footer>
    </main>

    <!-- Project Milestone Timeline Modal -->
    <ProjectTimeline
      v-if="isTimelineModalOpen && activeProject"
      :project="activeProject"
      @close="isTimelineModalOpen = false"
    />
  </div>
</template>

<style scoped>
.portal-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--c-bg);
  width: 100%;
}

/* Sidenav */
.portal-sidenav {
  width: 280px;
  min-width: 280px;
  background-color: #ffffff;
  border-right: 1px solid var(--c-border);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem 1.2rem;
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 100;
  box-shadow: 2px 0 10px rgba(15, 41, 66, 0.04);
}

.sidenav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--c-border);
  margin-bottom: 1.5rem;
}

.brand-badge-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-box {
  background: var(--c-royal-blue);
  color: #ffffff;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.05rem;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  border: 1px solid var(--c-royal-blue-accent);
}

.brand-meta {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--c-blue-dark);
  line-height: 1.1;
}

.role-tag {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #0369a1;
}

.mobile-close-btn {
  display: none;
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--c-text-muted);
}

.sidenav-nav {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  flex: 1;
  overflow-y: auto;
}

.sidenav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--c-text-dark);
  font-family: var(--font-body);
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: all var(--transition-fast);
}

.nav-icon {
  font-size: 1.15rem;
}

.sidenav-link:hover {
  background-color: var(--c-royal-blue-light);
  color: var(--c-royal-blue);
}

.sidenav-link.active {
  background-color: var(--c-royal-blue);
  color: #ffffff;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(21, 65, 148, 0.2);
}

.sidenav-footer {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--c-border);
}

.user-brief {
  display: flex;
  flex-direction: column;
}

.ub-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--c-blue-dark);
}

.ub-email {
  font-size: 0.78rem;
  color: var(--c-text-muted);
}

.logout-btn {
  width: 100%;
}

/* Main Content Area */
.portal-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100vh;
}

.mobile-sidebar-toggle {
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 90;
  background: #ffffff;
  border: 1px solid var(--c-border);
  box-shadow: 0 2px 8px rgba(15, 41, 66, 0.12);
  padding: 0.45rem 0.85rem;
  border-radius: 6px;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--c-blue-dark);
  cursor: pointer;
}

@media (max-width: 1024px) {
  .mobile-sidebar-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
}

/* Customer Empty State */
.customer-empty-welcome {
  padding: 3.5rem 2rem;
  text-align: center;
  background: #ffffff;
  border-radius: var(--radius-md);
  margin-bottom: 2rem;
  border: 1px dashed var(--c-border);
}

.cew-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.customer-empty-welcome h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--c-blue-dark);
  margin-bottom: 0.75rem;
}

.cew-text {
  font-size: 0.95rem;
  color: var(--c-text-muted);
  max-width: 600px;
  margin: 0 auto 1.5rem auto;
  line-height: 1.6;
}

.cew-specs {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.cew-badge {
  background: var(--c-royal-blue-light);
  color: var(--c-royal-blue);
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
}

/* Dedicated Dashboard Footer */
.portal-footer {
  margin-top: auto;
  border-top: 1px solid var(--c-border);
  background: #ffffff;
  padding: 1.1rem 2rem;
  font-size: 0.82rem;
  color: var(--c-text-muted);
}

.portal-footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.portal-footer-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.p-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: #10b981;
}

.portal-footer-credits {
  font-weight: 500;
  color: #64748b;
}

.portal-footer-credits .credit-highlight {
  color: var(--c-blue-dark);
  font-weight: 700;
}

.global-alert {
  margin: 1rem 2rem 0 2rem;
}

.alert-success {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.88rem;
}

.alert-danger {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fca5a5;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.88rem;
}

.dismissable-alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.alert-content-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-dismiss-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  line-height: 1;
  color: #b91c1c;
  cursor: pointer;
  padding: 0 0.25rem;
  border-radius: 4px;
}

.alert-dismiss-btn:hover {
  background: rgba(185, 28, 28, 0.1);
}

.portal-content-body {
  padding: 1.75rem 2rem;
  flex: 1;
}

.portal-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Active Project View */
.active-project-workspace {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.back-navigation-bar {
  margin-bottom: 0.25rem;
}

.back-btn {
  background: transparent;
  border: none;
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--c-royal-blue);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.back-btn:hover {
  text-decoration: underline;
}

.project-tabs-nav-bar {
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid var(--c-border);
  padding-bottom: 0.5rem;
  overflow-x: auto;
}

.tab-btn {
  background: transparent;
  border: none;
  font-family: var(--font-body);
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--c-text-muted);
  padding: 0.55rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition-fast);
}

.tab-btn:hover {
  background: var(--c-royal-blue-light);
  color: var(--c-royal-blue);
}

.tab-btn.active {
  background: var(--c-royal-blue);
  color: #ffffff;
}

.tab-pane {
  padding-top: 0.75rem;
}

.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.invalid-feedback {
  display: block;
  font-size: 0.8rem;
  color: #dc2626;
  margin-top: 0.25rem;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 1024px) {
  .portal-sidenav {
    position: fixed;
    left: -300px;
    transition: left var(--transition-normal);
  }

  .portal-sidenav.is-open {
    left: 0;
  }

  .mobile-close-btn {
    display: block;
  }

  .mobile-menu-toggle {
    display: block;
  }
}
</style>
