<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)
const scrollPercent = ref(0)

const handleScroll = () => {
  const scrollY = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  
  isVisible.value = scrollY > 300
  if (docHeight > 0) {
    scrollPercent.value = Math.min(100, Math.max(0, (scrollY / docHeight) * 100))
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <Transition name="fade-slide">
    <button
      v-if="isVisible"
      class="back-to-top-btn"
      @click="scrollToTop"
      aria-label="Back to top"
      title="Back to top"
    >
      <svg class="progress-ring" width="44" height="44" viewBox="0 0 44 44">
        <circle
          class="progress-ring-circle"
          stroke="var(--c-blue-accent)"
          stroke-width="3"
          fill="transparent"
          r="18"
          cx="22"
          cy="22"
          :style="{ strokeDasharray: 113.1, strokeDashoffset: 113.1 - (113.1 * scrollPercent) / 100 }"
        />
      </svg>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18" class="arrow-icon">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--c-blue-dark);
  color: var(--c-text-light);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 20px rgba(10, 25, 47, 0.25);
  cursor: pointer;
  z-index: 990;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform var(--transition-fast), background-color var(--transition-fast);
}

.back-to-top-btn:hover {
  transform: translateY(-3px) scale(1.05);
  background: var(--c-blue-primary);
}

.progress-ring {
  position: absolute;
  top: 2px;
  left: 2px;
  transform: rotate(-90deg);
  pointer-events: none;
}

.progress-ring-circle {
  transition: stroke-dashoffset 0.1s linear;
}

.arrow-icon {
  position: relative;
  z-index: 2;
}

@media (max-width: 768px) {
  .back-to-top-btn {
    bottom: 1.25rem;
    right: 1.25rem;
  }
}
</style>
