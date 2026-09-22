import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  collection,
  query,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore'
import { db } from '../../../firebase'
import type { DrawingTransmittal, ReleasePackage } from '../../../types/portal'
import { useAuditStore } from '../../../core/audit/auditStore'
import { useAuthStore } from '../../../stores/auth'

export const useReleasesStore = defineStore('releases', () => {
  const auditStore = useAuditStore()
  const authStore = useAuthStore()
  const transmittals = ref<DrawingTransmittal[]>([])
  const releasePackages = ref<ReleasePackage[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string>('')

  let transmittalsUnsubscribe: (() => void) | null = null
  let releasesUnsubscribe: (() => void) | null = null

  function initProjectReleases(projectId: string) {
    stopProjectReleases()
    loading.value = true

    try {
      // 1. Drawing Transmittals
      const tRef = collection(db, 'projects', projectId, 'drawing_transmittals')
      const tQuery = query(tRef, orderBy('transmittalNumber', 'asc'))
      transmittalsUnsubscribe = onSnapshot(
        tQuery,
        (snapshot) => {
          const list: DrawingTransmittal[] = []
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as DrawingTransmittal)
          })
          transmittals.value = list
        },
        (err) => {
          console.error('Error listening to drawing transmittals:', err)
          error.value = err.message || 'Failed to sync drawing transmittals.'
        }
      )

      // 2. Release Packages
      const rRef = collection(db, 'projects', projectId, 'release_packages')
      const rQuery = query(rRef, orderBy('transmittalNumber', 'asc'))
      releasesUnsubscribe = onSnapshot(
        rQuery,
        (snapshot) => {
          const list: ReleasePackage[] = []
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as ReleasePackage)
          })
          releasePackages.value = list
          loading.value = false
        },
        (err) => {
          console.error('Error listening to release packages:', err)
          error.value = err.message || 'Failed to sync release packages.'
          loading.value = false
        }
      )
    } catch (err: any) {
      console.error('Error initiating releases listener:', err)
      error.value = err.message || 'Failed to load submittals and releases.'
      loading.value = false
    }
  }

  function stopProjectReleases() {
    if (transmittalsUnsubscribe) {
      transmittalsUnsubscribe()
      transmittalsUnsubscribe = null
    }
    if (releasesUnsubscribe) {
      releasesUnsubscribe()
      releasesUnsubscribe = null
    }
    transmittals.value = []
    releasePackages.value = []
  }

  // Create Drawing Transmittal
  async function createDrawingTransmittal(
    projectId: string,
    payload: {
      purpose: 'Approval' | 'Fabrication' | 'Field Use'
      revision: string
      title: string
      notes?: string
      documentsList: string[]
      submittedByUserName: string
    }
  ) {
    try {
      const colRef = collection(db, 'projects', projectId, 'drawing_transmittals')
      const newDocRef = doc(colRef)
      const count = transmittals.value.length + 1
      const transmittalNumber = `Drawing Transmittal #${count.toString().padStart(3, '0')}`

      const item: DrawingTransmittal = {
        id: newDocRef.id,
        projectId,
        transmittalNumber,
        purpose: payload.purpose,
        revision: payload.revision.trim(),
        title: payload.title.trim(),
        notes: payload.notes || '',
        documentsList: payload.documentsList,
        submittedByUserName: payload.submittedByUserName,
        submittedAt: serverTimestamp()
      }

      await setDoc(newDocRef, item)
      await auditStore.recordActivity(
        projectId,
        'Drawing Transmittal Issued',
        `${item.transmittalNumber} (${item.revision}): "${item.title}" with ${item.documentsList.length} drawing packages.`,
        payload.submittedByUserName,
        authStore.currentRole
      )
      return item
    } catch (err: any) {
      console.error('Failed to create transmittal:', err)
      throw err
    }
  }

  // Submit Client Review Action
  async function submitClientReviewAction(
    projectId: string,
    transmittalId: string,
    action: 'Approve' | 'Approve as Noted' | 'Revise and Resubmit' | 'Reject',
    notes: string,
    userName: string
  ) {
    try {
      const tRef = doc(db, 'projects', projectId, 'drawing_transmittals', transmittalId)
      await updateDoc(tRef, {
        clientAction: action,
        clientActionNotes: notes.trim(),
        clientActionByUserName: userName,
        clientActionAt: serverTimestamp()
      })
      const t = transmittals.value.find((x) => x.id === transmittalId)
      await auditStore.recordActivity(
        projectId,
        'Client Review Action Recorded',
        `${t?.transmittalNumber || 'Transmittal'} review signed off as: ${action.toUpperCase()} by ${userName}`,
        userName,
        authStore.currentRole
      )
    } catch (err: any) {
      console.error('Failed to submit client action:', err)
      throw err
    }
  }

  // Create Shop Fabrication or Field Release Package
  async function createReleasePackage(
    projectId: string,
    payload: {
      releaseType: 'Shop Fabrication' | 'Field Erection'
      revision: string
      transmittalNumber: string
      description: string
      includesMachineFiles: boolean
      fileUrls?: { name: string; url: string; type: string }[]
      releasedByUserName: string
    }
  ) {
    try {
      const colRef = collection(db, 'projects', projectId, 'release_packages')
      const newDocRef = doc(colRef)

      const item: ReleasePackage = {
        id: newDocRef.id,
        projectId,
        releaseType: payload.releaseType,
        revision: payload.revision.trim(),
        transmittalNumber: payload.transmittalNumber.trim(),
        description: payload.description.trim(),
        includesMachineFiles: payload.includesMachineFiles,
        fileUrls: payload.fileUrls || [],
        releasedByUserName: payload.releasedByUserName,
        releasedAt: serverTimestamp()
      }

      await setDoc(newDocRef, item)
      await auditStore.recordActivity(
        projectId,
        `${payload.releaseType} Released`,
        `${payload.releaseType} ${payload.revision} released via ${payload.transmittalNumber}. Machine files included: ${payload.includesMachineFiles ? 'YES' : 'NO'}`,
        payload.releasedByUserName,
        authStore.currentRole
      )
      return item
    } catch (err: any) {
      console.error('Failed to create release package:', err)
      throw err
    }
  }

  return {
    transmittals,
    releasePackages,
    loading,
    error,
    initProjectReleases,
    stopProjectReleases,
    createDrawingTransmittal,
    submitClientReviewAction,
    createReleasePackage
  }
})
