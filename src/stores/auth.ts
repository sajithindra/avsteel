import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore'
import { auth, googleProvider, db } from '../firebase'
import type { UserRole, UserProfile } from '../types/portal'

export type { UserRole, UserProfile }

export const PRIMARY_SUPERADMIN_EMAIL = 'info@avassds.com'

export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false
  return email.trim().toLowerCase() === PRIMARY_SUPERADMIN_EMAIL.toLowerCase()
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const profile = ref<UserProfile | null>(null)
  const loading = ref<boolean>(true)
  const error = ref<string>('')
  const isInitialized = ref<boolean>(false)

  const isAuthenticated = computed(() => !!user.value)
  const isProfileComplete = computed(() => !!(profile.value && profile.value.profileCompleted))
  const currentRole = computed<UserRole>(() => {
    if (isSuperAdminEmail(user.value?.email) || isSuperAdminEmail(profile.value?.email)) {
      return 'superadmin'
    }
    return profile.value?.role || 'client_project_reviewer'
  })

  // Permission helpers
  const isSuperAdmin = computed(() => currentRole.value === 'superadmin')
  const isProjectHead = computed(() => currentRole.value === 'project_head')
  const isProjectManager = computed(() => currentRole.value === 'project_manager')
  const isQualityControl = computed(() => currentRole.value === 'quality_control')
  const isSteelDetailer = computed(() => currentRole.value === 'steel_detailer')
  const isClientLead = computed(() => currentRole.value === 'client_project_lead')
  const isClientReviewer = computed(() => currentRole.value === 'client_project_reviewer')

  // Administrative authority (Superadmin, Project Head, PM can manage staff and project assignments)
  const canManageStaff = computed(() => isSuperAdmin.value || isProjectHead.value || isProjectManager.value)
  const canManageProjects = computed(() => isSuperAdmin.value || isProjectHead.value || isProjectManager.value)
  const isInternalStaff = computed(() => ['superadmin', 'project_head', 'project_manager', 'quality_control', 'steel_detailer'].includes(currentRole.value))
  const isClientStaff = computed(() => ['client_project_lead', 'client_project_reviewer'].includes(currentRole.value))

  // Listen to Firebase Auth state
  function initAuth(): Promise<void> {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (currentUser) => {
        user.value = currentUser
        if (currentUser) {
          await fetchUserProfile(currentUser.uid)
        } else {
          profile.value = null
        }
        loading.value = false
        isInitialized.value = true
        resolve()
      })
    })
  }

  async function fetchUserProfile(uid: string) {
    try {
      const userRef = doc(db, 'users', uid)
      const snap = await getDoc(userRef)
      if (snap.exists()) {
        const data = snap.data() as UserProfile
        if (isSuperAdminEmail(user.value?.email) || isSuperAdminEmail(data.email)) {
          if (data.role !== 'superadmin') {
            data.role = 'superadmin'
            try {
              await updateDoc(userRef, { role: 'superadmin' })
            } catch (updateErr) {
              console.warn('Auto-promote superadmin Firestore warning:', updateErr)
            }
          }
        }
        profile.value = data
      } else {
        if (user.value) {
          const isSuper = isSuperAdminEmail(user.value.email)
          const newProfile: UserProfile = {
            uid: user.value.uid,
            email: user.value.email || '',
            name: user.value.displayName || user.value.email?.split('@')[0] || (isSuper ? 'Super Administrator' : 'Client Engineer'),
            phoneNumber: user.value.phoneNumber || '',
            role: isSuper ? 'superadmin' : 'client_project_reviewer',
            profileCompleted: true,
            assignedProjectIds: [],
            createdAt: serverTimestamp()
          }
          try {
            await setDoc(userRef, newProfile)
          } catch (createErr) {
            console.warn('Auto-provision user profile Firestore warning:', createErr)
          }
          profile.value = newProfile
        } else {
          profile.value = null
        }
      }
    } catch (e: any) {
      console.error('Error fetching user profile:', e)
      error.value = e.message || 'Failed to fetch user profile'
    }
  }

  async function loginWithGoogle() {
    error.value = ''
    loading.value = true
    try {
      const result = await signInWithPopup(auth, googleProvider)
      user.value = result.user

      // Check if user profile document exists in Firestore
      const userRef = doc(db, 'users', result.user.uid)
      const snap = await getDoc(userRef)

      if (snap.exists()) {
        const data = snap.data() as UserProfile
        if (isSuperAdminEmail(result.user.email) || isSuperAdminEmail(data.email)) {
          if (data.role !== 'superadmin') {
            data.role = 'superadmin'
            try {
              await updateDoc(userRef, { role: 'superadmin' })
            } catch (e) {
              console.warn('Could not persist superadmin role:', e)
            }
          }
        }
        profile.value = data
      } else {
        const isSuper = isSuperAdminEmail(result.user.email)
        // Automatically provision baseline profile for new Google users
        const newProfile: UserProfile = {
          uid: result.user.uid,
          email: result.user.email || '',
          name: result.user.displayName || result.user.email?.split('@')[0] || (isSuper ? 'Super Administrator' : 'Client Engineer'),
          phoneNumber: result.user.phoneNumber || '',
          role: isSuper ? 'superadmin' : 'client_project_reviewer',
          profileCompleted: true,
          assignedProjectIds: [],
          createdAt: serverTimestamp()
        }
        await setDoc(userRef, newProfile)
        profile.value = newProfile
      }

      return result.user
    } catch (e: any) {
      console.error('Google Sign-In Error:', e)
      error.value = e.message || 'Google sign-in failed. Please try again.'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function saveUserProfile(name: string, phoneNumber: string) {
    if (!user.value) throw new Error('No authenticated user found.')
    error.value = ''
    loading.value = true

    const isSuper = isSuperAdminEmail(user.value.email)
    const newProfile: UserProfile = {
      uid: user.value.uid,
      email: user.value.email || '',
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
      role: isSuper ? 'superadmin' : (profile.value?.role || 'client_project_reviewer'),
      profileCompleted: true,
      assignedProjectIds: profile.value?.assignedProjectIds || [],
      createdAt: serverTimestamp()
    }

    try {
      const userRef = doc(db, 'users', user.value.uid)
      await setDoc(userRef, newProfile, { merge: true })
      profile.value = { ...newProfile }
    } catch (e: any) {
      console.error('Error saving user profile:', e)
      error.value = e.message || 'Failed to save profile details.'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await signOut(auth)
      user.value = null
      profile.value = null
    } catch (e: any) {
      console.error('Logout error:', e)
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    profile,
    loading,
    error,
    isInitialized,
    isAuthenticated,
    isProfileComplete,
    currentRole,
    isSuperAdmin,
    isProjectHead,
    isProjectManager,
    isQualityControl,
    isSteelDetailer,
    isClientLead,
    isClientReviewer,
    canManageStaff,
    canManageProjects,
    isInternalStaff,
    isClientStaff,
    initAuth,
    loginWithGoogle,
    saveUserProfile,
    logout
  }
})
