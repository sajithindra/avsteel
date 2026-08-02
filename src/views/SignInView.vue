<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Profile completion form state
const name = ref('')
const phoneNumber = ref('')
const nameError = ref('')
const phoneError = ref('')
const submitError = ref('')
const isSubmitting = ref(false)

// Initialize input fields when user logs in
watch(
  () => authStore.user,
  (newUser) => {
    if (newUser && !name.value) {
      name.value = newUser.displayName || ''
    }
  },
  { immediate: true }
)

// Redirect if already authenticated and profile completed
const checkRedirect = () => {
  if (authStore.isAuthenticated && authStore.isProfileComplete) {
    router.push('/dashboard')
  }
}

onMounted(() => {
  checkRedirect()
})

watch(
  () => [authStore.isAuthenticated, authStore.isProfileComplete],
  () => {
    checkRedirect()
  }
)

const handleGoogleSignIn = async () => {
  try {
    const user = await authStore.loginWithGoogle()
    if (user && authStore.isProfileComplete) {
      router.push('/dashboard')
    }
  } catch (err: any) {
    // Error is handled in authStore
  }
}

const validateForm = (): boolean => {
  let valid = true;
  nameError.value = ''
  phoneError.value = ''
  submitError.value = ''

  const trimmedName = name.value.trim()
  if (!trimmedName || trimmedName.length < 2) {
    nameError.value = 'Full name is required (at least 2 characters).'
    valid = false
  }

  const trimmedPhone = phoneNumber.value.trim()
  // Validates phone numbers allowing +, digits, spaces, hyphens, parentheses (7 to 20 chars)
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{6,16}$/
  if (!trimmedPhone) {
    phoneError.value = 'Phone number is required.'
    valid = false
  } else if (!phoneRegex.test(trimmedPhone)) {
    phoneError.value = 'Please enter a valid phone number (e.g. +1 555-019-2834).'
    valid = false
  }

  return valid
}

const handleProfileSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    await authStore.saveUserProfile(name.value, phoneNumber.value)
    router.push('/dashboard')
  } catch (err: any) {
    submitError.value = err.message || 'Failed to save profile. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="signin-page-container">
    <div class="signin-card ava-card">
      <!-- Top Branding Header -->
      <div class="signin-brand-header">
        <div class="logo-box">AVA</div>
        <div class="brand-info">
          <h2>AVA Steel Portal</h2>
          <span class="badge">AEC Engineering</span>
        </div>
      </div>

      <!-- State 1: Google Login ONLY -->
      <template v-if="!authStore.isAuthenticated">
        <div class="signin-content">
          <h1 class="signin-title">Sign In</h1>
          <p class="signin-subtitle">
            Access your 3D BIM models, SDS/2 structural drawings, and project tracking with your Google account.
          </p>

          <div v-if="authStore.error" class="alert alert-danger" role="alert">
            {{ authStore.error }}
          </div>

          <!-- Google Login ONLY Button -->
          <div class="google-auth-box">
            <button
              class="btn-google-auth"
              @click="handleGoogleSignIn"
              :disabled="authStore.loading"
            >
              <svg class="google-icon" viewBox="0 0 24 24" width="22" height="22">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.97 0 12s.46 3.83 1.26 5.42l4.02-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.23 0 12 0 7.31 0 3.25 2.7 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>{{ authStore.loading ? 'Signing in...' : 'Sign in with Google' }}</span>
            </button>
          </div>

          <p class="terms-note">
            By signing in, you agree to our <router-link to="/terms">Terms of Service</router-link> and <router-link to="/privacy">Privacy Policy</router-link>.
          </p>
        </div>
      </template>

      <!-- State 2: First-time New User Profile Setup -->
      <template v-else-if="!authStore.isProfileComplete">
        <div class="signin-content">
          <div class="welcome-header">
            <span class="setup-badge">First-Time Setup</span>
            <h1 class="signin-title">Complete Profile</h1>
            <p class="signin-subtitle">
              Welcome, <strong>{{ authStore.user?.email }}</strong>! Please enter your name and contact phone number to set up your account.
            </p>
          </div>

          <form @submit.prevent="handleProfileSubmit" novalidate class="profile-form">
            <div v-if="submitError" class="alert alert-danger">
              {{ submitError }}
            </div>

            <!-- Full Name Input -->
            <div class="form-group">
              <label for="user-name">Full Name *</label>
              <div class="input-wrapper">
                <input
                  id="user-name"
                  v-model="name"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': nameError }"
                  placeholder="e.g. John Doe"
                  autocomplete="name"
                />
              </div>
              <span v-if="nameError" class="error-msg">{{ nameError }}</span>
            </div>

            <!-- Phone Number Input -->
            <div class="form-group">
              <label for="user-phone">Phone Number *</label>
              <div class="input-wrapper">
                <input
                  id="user-phone"
                  v-model="phoneNumber"
                  type="tel"
                  class="form-control"
                  :class="{ 'is-invalid': phoneError }"
                  placeholder="e.g. +1 555-019-2834"
                  autocomplete="tel"
                />
              </div>
              <span v-if="phoneError" class="error-msg">{{ phoneError }}</span>
            </div>

            <button
              type="submit"
              class="btn-submit-profile"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? 'Saving Profile...' : 'Complete & Open Dashboard' }}
            </button>
          </form>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.signin-page-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  background-color: var(--c-bg);
}

.signin-card {
  width: 100%;
  max-width: 480px;
  background: var(--c-surface);
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(15, 43, 92, 0.12);
  padding: 2.5rem 2rem;
  border: 1px solid var(--c-border);
}

.signin-brand-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1.5rem;
  margin-bottom: 1.75rem;
  border-bottom: 1px solid var(--c-border);
}

.logo-box {
  background: var(--c-royal-blue);
  color: #ffffff;
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.2rem;
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  letter-spacing: 0.05em;
}

.brand-info h2 {
  font-size: 1.25rem;
  margin-bottom: 0.2rem;
  color: var(--c-blue-dark);
}

.signin-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--c-blue-dark);
  margin-bottom: 0.5rem;
}

.signin-subtitle {
  color: var(--c-text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.google-auth-box {
  margin-bottom: 1.5rem;
}

.btn-google-auth {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  background: #ffffff;
  color: #374151;
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  padding: 0.85rem 1.25rem;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.btn-google-auth:hover:not(:disabled) {
  background: #f9fafb;
  border-color: var(--c-royal-blue);
  box-shadow: 0 4px 12px rgba(21, 65, 148, 0.15);
  transform: translateY(-1px);
}

.btn-google-auth:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.terms-note {
  font-size: 0.82rem;
  color: var(--c-text-muted);
  text-align: center;
}

.terms-note a {
  color: var(--c-royal-blue);
  text-decoration: none;
  font-weight: 600;
}

.terms-note a:hover {
  text-decoration: underline;
}

.setup-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  background: rgba(21, 65, 148, 0.1);
  color: var(--c-royal-blue);
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  margin-bottom: 0.75rem;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--c-text-dark);
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid var(--c-border);
  font-family: var(--font-body);
  font-size: 0.95rem;
  outline: none;
  transition: border-color var(--transition-fast);
}

.form-control:focus {
  border-color: var(--c-royal-blue);
  box-shadow: 0 0 0 3px rgba(21, 65, 148, 0.15);
}

.form-control.is-invalid {
  border-color: #dc2626;
  background-color: #fef2f2;
}

.error-msg {
  font-size: 0.82rem;
  color: #dc2626;
  font-weight: 500;
}

.alert {
  padding: 0.85rem 1rem;
  border-radius: 8px;
  font-size: 0.88rem;
  margin-bottom: 1rem;
}

.alert-danger {
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.btn-submit-profile {
  background: linear-gradient(135deg, var(--c-royal-blue) 0%, var(--c-royal-blue-accent) 100%);
  color: #ffffff;
  border: none;
  padding: 0.85rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
  box-shadow: 0 4px 12px rgba(21, 65, 148, 0.25);
  margin-top: 0.5rem;
}

.btn-submit-profile:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(21, 65, 148, 0.35);
}

.btn-submit-profile:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}
</style>
