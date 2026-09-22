import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, query, onSnapshot, doc, setDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore'
import { db } from '../../firebase'
import type { ProjectActivityLog, UserRole } from '../../types/portal'

export const useAuditStore = defineStore('audit', () => {
  const activityLogs = ref<ProjectActivityLog[]>([])
  const loading = ref<boolean>(false)
  let unsubscribe: (() => void) | null = null

  function initProjectAuditListener(projectId: string) {
    stopProjectAuditListener()
    loading.value = true

    try {
      const logsRef = collection(db, 'projects', projectId, 'activity_logs')
      const q = query(logsRef, orderBy('timestamp', 'desc'), limit(50))
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: ProjectActivityLog[] = []
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as ProjectActivityLog)
          })
          activityLogs.value = list
          loading.value = false
        },
        (err) => {
          console.error('Error listening to activity logs:', err)
          loading.value = false
        }
      )
    } catch (err: any) {
      console.error('Failed to init audit listener:', err)
      loading.value = false
    }
  }

  function stopProjectAuditListener() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    activityLogs.value = []
  }

  async function recordActivity(
    projectId: string,
    actionTitle: string,
    actionDetails: string,
    actorName: string,
    actorRole: UserRole
  ) {
    try {
      const logsRef = collection(db, 'projects', projectId, 'activity_logs')
      const newDocRef = doc(logsRef)
      const logEntry: ProjectActivityLog = {
        id: newDocRef.id,
        projectId,
        actionTitle: actionTitle.trim(),
        actionDetails: actionDetails.trim(),
        actorName: actorName || 'System User',
        actorRole: actorRole || 'client_project_reviewer',
        timestamp: serverTimestamp()
      }
      await setDoc(newDocRef, logEntry)
    } catch (err: any) {
      console.error('Failed to record activity log:', err)
      // Non-blocking: audit failure should not break main flow
    }
  }

  return {
    activityLogs,
    loading,
    initProjectAuditListener,
    stopProjectAuditListener,
    recordActivity
  }
})
