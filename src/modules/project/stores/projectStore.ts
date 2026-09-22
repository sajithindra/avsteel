import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore'
import { db } from '../../../firebase'
import type { ProjectProfile, ProjectDrawing, ProjectPhase, DrawingDiscipline } from '../../../types/portal'
import { useAuthStore } from '../../../stores/auth'
import { useAuditStore } from '../../../core/audit/auditStore'

export const useProjectStore = defineStore('project', () => {
  const authStore = useAuthStore()
  const auditStore = useAuditStore()
  const allProjects = ref<ProjectProfile[]>([])
  const activeProject = ref<ProjectProfile | null>(null)
  const activeProjectDrawings = ref<ProjectDrawing[]>([])
  const loading = ref<boolean>(false)
  const drawingsLoading = ref<boolean>(false)
  const error = ref<string>('')

  let projectsUnsubscribe: (() => void) | null = null
  let drawingsUnsubscribe: (() => void) | null = null

  // Filter projects by user permissions
  const visibleProjects = computed<ProjectProfile[]>(() => {
    const currentUid = authStore.user?.uid
    const role = authStore.currentRole

    if (!currentUid) return []

    // Superadmin and Project Head see all projects
    if (role === 'superadmin' || role === 'project_head') {
      return allProjects.value
    }

    // Project Manager sees all projects they manage or were assigned to
    if (role === 'project_manager') {
      return allProjects.value.filter(
        (p) =>
          p.projectManagerId === currentUid ||
          p.projectHeadId === currentUid ||
          (p.qualityControlIds && p.qualityControlIds.includes(currentUid))
      )
    }

    // Quality Control Inspector sees assigned checking projects
    if (role === 'quality_control') {
      return allProjects.value.filter(
        (p) => p.qualityControlIds && p.qualityControlIds.includes(currentUid)
      )
    }

    // Steel Detailer sees assigned detailing projects
    if (role === 'steel_detailer') {
      return allProjects.value.filter(
        (p) => p.steelDetailerIds && p.steelDetailerIds.includes(currentUid)
      )
    }

    // Client Project Lead & Reviewer see their client projects
    if (role === 'client_project_lead' || role === 'client_project_reviewer') {
      return allProjects.value.filter(
        (p) =>
          (p.clientProjectLeadIds && p.clientProjectLeadIds.includes(currentUid)) ||
          (p.clientProjectReviewerIds && p.clientProjectReviewerIds.includes(currentUid)) ||
          (authStore.profile?.assignedProjectIds && authStore.profile.assignedProjectIds.includes(p.id))
      )
    }

    return []
  })

  // Initialize live listener for projects
  function initProjectsListener() {
    if (projectsUnsubscribe) return
    loading.value = true
    try {
      const projectsRef = collection(db, 'projects')
      const q = query(projectsRef)
      projectsUnsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: ProjectProfile[] = []
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as ProjectProfile)
          })
          allProjects.value = list
          loading.value = false

          // Update activeProject reference if open
          if (activeProject.value) {
            const updated = list.find((p) => p.id === activeProject.value?.id)
            if (updated) activeProject.value = updated
          }
        },
        (err) => {
          console.error('Error fetching projects:', err)
          error.value = err.message || 'Failed to load projects.'
          loading.value = false
        }
      )
    } catch (err: any) {
      console.error('Failed to init projects listener:', err)
      error.value = err.message || 'Failed to init projects listener.'
      loading.value = false
    }
  }

  function stopProjectsListener() {
    if (projectsUnsubscribe) {
      projectsUnsubscribe()
      projectsUnsubscribe = null
    }
  }

  // Set active project and listen to its Drawing Register
  function selectActiveProject(project: ProjectProfile | null) {
    activeProject.value = project
    if (drawingsUnsubscribe) {
      drawingsUnsubscribe()
      drawingsUnsubscribe = null
    }
    activeProjectDrawings.value = []

    if (!project) return

    drawingsLoading.value = true
    try {
      const drawingsRef = collection(db, 'projects', project.id, 'drawings')
      const q = query(drawingsRef, orderBy('sheetNumber', 'asc'))
      drawingsUnsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: ProjectDrawing[] = []
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as ProjectDrawing)
          })
          activeProjectDrawings.value = list
          drawingsLoading.value = false
        },
        (err) => {
          console.error('Error listening to project drawings:', err)
          drawingsLoading.value = false
        }
      )
    } catch (err: any) {
      console.error('Error setting drawing listener:', err)
      drawingsLoading.value = false
    }
  }

  // Load and activate a project directly by its ID
  async function selectActiveProjectById(projectId: string): Promise<ProjectProfile | null> {
    const existing = allProjects.value.find((p) => p.id === projectId)
    if (existing) {
      selectActiveProject(existing)
      return existing
    }
    try {
      const pRef = doc(db, 'projects', projectId)
      const snap = await getDoc(pRef)
      if (snap.exists()) {
        const project = { id: snap.id, ...snap.data() } as ProjectProfile
        selectActiveProject(project)
        return project
      }
    } catch (err) {
      console.error('Failed to load project by id:', err)
    }
    return null
  }

  // Create Project
  async function createProject(data: Omit<ProjectProfile, 'id' | 'createdAt'>) {
    error.value = ''
    try {
      const newDocRef = doc(collection(db, 'projects'))
      const payload: ProjectProfile = {
        ...data,
        id: newDocRef.id,
        createdAt: serverTimestamp()
      }
      await setDoc(newDocRef, payload)
      return payload
    } catch (err: any) {
      console.error('Failed to create project:', err)
      error.value = err.message || 'Failed to create project.'
      throw err
    }
  }

  // Update Project Phase
  async function updateProjectPhase(projectId: string, newPhase: ProjectPhase) {
    error.value = ''
    try {
      const pRef = doc(db, 'projects', projectId)
      await updateDoc(pRef, { currentPhase: newPhase })
      await auditStore.recordActivity(
        projectId,
        'Project Milestone Phase Updated',
        `Detailing lifecycle advanced to: ${newPhase.replace(/_/g, ' ').toUpperCase()}`,
        authStore.profile?.name || authStore.user?.email || 'Authorized User',
        authStore.currentRole
      )
    } catch (err: any) {
      console.error('Failed to update phase:', err)
      error.value = err.message || 'Failed to update project phase.'
      throw err
    }
  }

  // Update Team Allocation
  async function updateProjectTeam(
    projectId: string,
    team: {
      projectHeadId?: string
      projectManagerId?: string
      qualityControlIds: string[]
      steelDetailerIds: string[]
      clientProjectLeadIds: string[]
      clientProjectReviewerIds: string[]
    }
  ) {
    error.value = ''
    try {
      const pRef = doc(db, 'projects', projectId)
      await updateDoc(pRef, team)
      await auditStore.recordActivity(
        projectId,
        'Project Team Staffing Updated',
        'Updated allocation of Project Manager, Quality Control, Detailers, and Client Representatives.',
        authStore.profile?.name || authStore.user?.email || 'Project Manager',
        authStore.currentRole
      )
    } catch (err: any) {
      console.error('Failed to update team allocation:', err)
      error.value = err.message || 'Failed to update team allocation.'
      throw err
    }
  }

  // Add drawing to System Drawing Register
  async function addDrawingToRegister(
    projectId: string,
    drawing: {
      discipline: DrawingDiscipline
      sheetNumber: string
      sheetTitle: string
      currentRevision: string
      fileUrl?: string
      uploadedBy: string
    }
  ) {
    try {
      const newDocRef = doc(collection(db, 'projects', projectId, 'drawings'))
      const payload: ProjectDrawing = {
        id: newDocRef.id,
        projectId,
        discipline: drawing.discipline,
        sheetNumber: drawing.sheetNumber.trim().toUpperCase(),
        sheetTitle: drawing.sheetTitle.trim(),
        currentRevision: drawing.currentRevision.trim(),
        fileUrl: drawing.fileUrl || '',
        uploadedBy: drawing.uploadedBy,
        uploadedAt: serverTimestamp()
      }
      await setDoc(newDocRef, payload)
      await auditStore.recordActivity(
        projectId,
        'Drawing Sheet Cataloged',
        `Added to register: ${payload.discipline}: ${payload.sheetNumber} - ${payload.sheetTitle} (${payload.currentRevision})`,
        drawing.uploadedBy,
        authStore.currentRole
      )
      return payload
    } catch (err: any) {
      console.error('Failed to add drawing to register:', err)
      throw err
    }
  }

  // Project Standards: Publish by AVA
  async function publishProjectStandards(projectId: string, standardsDocumentUrl: string) {
    try {
      const pRef = doc(db, 'projects', projectId)
      await updateDoc(pRef, {
        standardsPublished: true,
        standardsDocumentUrl,
        standardsConfirmedByClient: false
      })
      await auditStore.recordActivity(
        projectId,
        'Project Standards Published',
        'AVA detailing team issued official project standards for client review and alignment.',
        authStore.profile?.name || authStore.user?.email || 'AVA Project Manager',
        authStore.currentRole
      )
    } catch (err: any) {
      console.error('Failed to publish standards:', err)
      throw err
    }
  }

  // Project Standards: Confirm by Client
  async function confirmProjectStandards(projectId: string) {
    try {
      const pRef = doc(db, 'projects', projectId)
      await updateDoc(pRef, {
        standardsConfirmedByClient: true,
        standardsConfirmedAt: serverTimestamp()
      })
      await auditStore.recordActivity(
        projectId,
        'Project Standards Confirmed by Client',
        'Client Project Lead reviewed and formally signed off on project detailing standards.',
        authStore.profile?.name || authStore.user?.email || 'Client Project Lead',
        authStore.currentRole
      )
    } catch (err: any) {
      console.error('Failed to confirm standards:', err)
      throw err
    }
  }

  return {
    allProjects,
    visibleProjects,
    activeProject,
    activeProjectDrawings,
    loading,
    drawingsLoading,
    error,
    initProjectsListener,
    stopProjectsListener,
    selectActiveProject,
    selectActiveProjectById,
    createProject,
    updateProjectPhase,
    updateProjectTeam,
    addDrawingToRegister,
    publishProjectStandards,
    confirmProjectStandards
  }
})
