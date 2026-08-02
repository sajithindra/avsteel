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

export type UserRole = 'user' | 'admin' | 'ceo' | 'engineer' | 'tech lead'

export interface UserProfile {
  uid: string
  email: string
  name: string
  phoneNumber: string
  role: UserRole
  profileCompleted: boolean
  createdAt?: any
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const profile = ref<UserProfile | null>(null)
  const loading = ref<boolean>(true)
  const error = ref<string>('')
  const isInitialized = ref<boolean>(false)

  const isAuthenticated = computed(() => !!user.value)
  const isProfileComplete = computed(() => !!(profile.value && profile.value.profileCompleted))
  const currentRole = computed<UserRole>(() => profile.value?.role || 'user')

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
        profile.value = snap.data() as UserProfile
      } else {
        profile.value = null
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
      await fetchUserProfile(result.user.uid)
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

    const newProfile: UserProfile = {
      uid: user.value.uid,
      email: user.value.email || '',
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
      role: 'user', // Default role for all logged-in users
      profileCompleted: true,
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

  async function updateUserRole(newRole: UserRole) {
    if (!user.value || !profile.value) return
    try {
      const userRef = doc(db, 'users', user.value.uid)
      await updateDoc(userRef, { role: newRole })
      profile.value.role = newRole
    } catch (e: any) {
      console.error('Error updating role:', e)
      // Fallback local update if offline or rule restricted
      if (profile.value) profile.value.role = newRole
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
    initAuth,
    loginWithGoogle,
    saveUserProfile,
    updateUserRole,
    logout
  }
})
