<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import BackToTop from './components/BackToTop.vue'

const route = useRoute()
const isDashboard = computed(() => route.path.startsWith('/dashboard'))
const showNavbar = computed(() => !isDashboard.value && route.path !== '/signin')
const showFooter = computed(() => !isDashboard.value)
const showBackToTop = computed(() => !isDashboard.value && route.path !== '/signin')
</script>

<template>
  <div class="app-root" :class="{ 'is-dashboard-layout': isDashboard }">
    <Navbar v-if="showNavbar" />
    <main :class="{ 'dashboard-main': isDashboard }">
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
    </main>
    <Footer v-if="showFooter" />
    <BackToTop v-if="showBackToTop" />
  </div>
</template>

<style scoped>
.app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.is-dashboard-layout {
  min-height: 100vh;
}

main {
  flex: 1;
}

.dashboard-main {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Smooth Page Transitions */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
