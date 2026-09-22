import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const HomeView = () => import('../views/HomeView.vue')
const PortfolioView = () => import('../views/PortfolioView.vue')
const TermsView = () => import('../views/TermsView.vue')
const PrivacyView = () => import('../views/PrivacyView.vue')
const SignInView = () => import('../views/SignInView.vue')
const DashboardView = () => import('../views/DashboardView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: PortfolioView
    },
    {
      path: '/terms',
      name: 'terms',
      component: TermsView
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: PrivacyView
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignInView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/projects',
      name: 'dashboard-projects',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/project/:projectId',
      name: 'project-detail',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/staff',
      name: 'dashboard-staff',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/customers',
      name: 'dashboard-customers',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard/profile',
      redirect: '/dashboard'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    return { top: 0 }
  }
})

// Navigation Guard
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (!authStore.isInitialized) {
    await authStore.initAuth()
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !authStore.isAuthenticated) {
    return { path: '/signin', query: { redirect: to.fullPath } }
  }

  // After login, redirect from signin or landing to dashboard or intended redirect target
  if (authStore.isAuthenticated && authStore.isProfileComplete) {
    if (to.path === '/signin') {
      const redirect = (to.query.redirect as string) || '/dashboard'
      return redirect
    }
    if (to.path === '/') {
      return '/dashboard'
    }
  }

  return true
})

export default router
