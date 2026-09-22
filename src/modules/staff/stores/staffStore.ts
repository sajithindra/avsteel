import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../../firebase'
import type { UserProfile, UserRole } from '../../../types/portal'
import { isSuperAdminEmail } from '../../../stores/auth'

export const useStaffStore = defineStore('staff', () => {
  const staffMembers = ref<UserProfile[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string>('')
  let unsubscribe: (() => void) | null = null

  function initStaffListener() {
    if (unsubscribe) return
    loading.value = true
    try {
      const usersRef = collection(db, 'users')
      const q = query(usersRef)
      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: UserProfile[] = []
          snapshot.forEach((d) => {
            const data = d.data() as UserProfile
            if (isSuperAdminEmail(data.email)) {
              data.role = 'superadmin'
            }
            list.push({ ...data, uid: d.id })
          })
          staffMembers.value = list
          loading.value = false
        },
        (err) => {
          console.error('Error listening to users collection:', err)
          error.value = err.message || 'Failed to load user roster.'
          loading.value = false
        }
      )
    } catch (err: any) {
      console.error('Failed to initialize staff listener:', err)
      error.value = err.message || 'Failed to initialize staff roster.'
      loading.value = false
    }
  }

  function stopStaffListener() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  }

  async function updateUserRole(uid: string, newRole: UserRole) {
    error.value = ''
    try {
      const target = staffMembers.value.find((m) => m.uid === uid)
      if (target && isSuperAdminEmail(target.email) && newRole !== 'superadmin') {
        throw new Error('The primary superadmin account (info@avassds.com) cannot be demoted.')
      }

      const userRef = doc(db, 'users', uid)
      await updateDoc(userRef, { role: newRole })
      // Local reactive update
      const index = staffMembers.value.findIndex((m) => m.uid === uid)
      if (index !== -1 && staffMembers.value[index]) {
        staffMembers.value[index].role = newRole
      }
    } catch (err: any) {
      console.error('Failed to update user role:', err)
      error.value = err.message || 'Failed to update user role.'
      throw err
    }
  }

  async function assignUserToProjects(uid: string, projectIds: string[]) {
    error.value = ''
    try {
      const userRef = doc(db, 'users', uid)
      await updateDoc(userRef, { assignedProjectIds: projectIds })
      const index = staffMembers.value.findIndex((m) => m.uid === uid)
      if (index !== -1 && staffMembers.value[index]) {
        staffMembers.value[index].assignedProjectIds = projectIds
      }
    } catch (err: any) {
      console.error('Failed to assign user to projects:', err)
      error.value = err.message || 'Failed to update project assignments.'
      throw err
    }
  }

  return {
    staffMembers,
    loading,
    error,
    initStaffListener,
    stopStaffListener,
    updateUserRole,
    assignUserToProjects
  }
})
