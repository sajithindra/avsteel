import { onMounted, onUnmounted, ref } from 'vue'

export function useIntersectionObserver() {
  const activeSectionId = ref<string>('')
  let revealObserver: IntersectionObserver | null = null
  let sectionObserver: IntersectionObserver | null = null

  onMounted(() => {
    // 1. Reveal Animations Observer
    const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-slide-left, .reveal-slide-right')
    
    if ('IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal-visible')
              revealObserver?.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      )

      revealElements.forEach((el) => revealObserver?.observe(el))
    } else {
      revealElements.forEach((el) => el.classList.add('reveal-visible'))
    }

    // 2. ScrollSpy Active Section Observer
    const sections = document.querySelectorAll('section[id]')
    if ('IntersectionObserver' in window && sections.length > 0) {
      sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              activeSectionId.value = entry.target.id
            }
          })
        },
        { threshold: 0.35 }
      )

      sections.forEach((sec) => sectionObserver?.observe(sec))
    }
  })

  onUnmounted(() => {
    if (revealObserver) revealObserver.disconnect()
    if (sectionObserver) sectionObserver.disconnect()
  })

  return {
    activeSectionId
  }
}
