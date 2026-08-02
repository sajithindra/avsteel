<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { WORK_PROCESS_STEPS } from '../data/companyData'

const activeStep = ref(0)
let trainTimer: ReturnType<typeof setInterval> | null = null

const startTrain = () => {
  if (!trainTimer) {
    trainTimer = setInterval(() => {
      activeStep.value = (activeStep.value + 1) % WORK_PROCESS_STEPS.length
    }, 3500)
  }
}

const stopTrain = () => {
  if (trainTimer) {
    clearInterval(trainTimer)
    trainTimer = null
  }
}

const selectStep = (idx: number) => {
  activeStep.value = idx
}

onMounted(() => {
  startTrain()
})

onUnmounted(() => {
  stopTrain()
})
</script>

<template>
  <section id="process" class="process-section">
    <div class="container">
      <div class="section-header reveal-on-scroll">
        <span class="badge">Sequential Workflow</span>
        <h2>Work Process & Quality Control</h2>
        <p>A structured 11-step quality control workflow ensuring accurate, fabrication-ready deliverables.</p>
      </div>

      <!-- Full Interactive Process Tracker Bar -->
      <div class="process-stepper-bar reveal-on-scroll stagger-1">
        <div class="stepper-track-line">
          <div
            class="stepper-track-progress"
            :style="{ width: `${(activeStep / (WORK_PROCESS_STEPS.length - 1)) * 100}%` }"
          ></div>
        </div>

        <div class="stepper-nodes">
          <button
            v-for="(item, idx) in WORK_PROCESS_STEPS"
            :key="item.step"
            class="stepper-node"
            :class="{ 'is-active': activeStep === idx, 'is-completed': idx < activeStep }"
            @click="selectStep(idx)"
            :title="item.title"
          >
            <span class="node-badge">{{ item.step }}</span>
            <span class="node-label">{{ item.shortTitle || item.title.split(' ')[0] }}</span>
          </button>
        </div>
      </div>

      <!-- Active Step Spotlight Banner -->
      <div
        class="active-spotlight-card ava-card reveal-on-scroll stagger-2"
        @mouseenter="stopTrain"
        @mouseleave="startTrain"
      >
        <div class="spotlight-header">
          <div class="spotlight-badge">
            <span class="pulse-dot"></span>
            <span>ACTIVE STEP {{ activeStep + 1 }} OF {{ WORK_PROCESS_STEPS.length }}</span>
          </div>
          <div class="spotlight-nav">
            <button
              class="spotlight-btn"
              :disabled="activeStep === 0"
              @click="selectStep(Math.max(0, activeStep - 1))"
            >
              ← Prev
            </button>
            <button
              class="spotlight-btn"
              :disabled="activeStep === WORK_PROCESS_STEPS.length - 1"
              @click="selectStep(Math.min(WORK_PROCESS_STEPS.length - 1, activeStep + 1))"
            >
              Next →
            </button>
          </div>
        </div>

        <div class="spotlight-body">
          <div class="spotlight-num">{{ WORK_PROCESS_STEPS[activeStep]?.step }}</div>
          <div class="spotlight-text">
            <h3>{{ WORK_PROCESS_STEPS[activeStep]?.title }}</h3>
            <p>{{ WORK_PROCESS_STEPS[activeStep]?.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Complete 11-Step Process Grid -->
      <div
        class="process-grid reveal-on-scroll stagger-3"
        @mouseenter="stopTrain"
        @mouseleave="startTrain"
      >
        <div
          v-for="(item, idx) in WORK_PROCESS_STEPS"
          :key="item.step"
          class="process-card ava-card"
          :class="{
            'is-active': activeStep === idx,
            'is-milestone': idx === 10
          }"
          @click="selectStep(idx)"
        >
          <div class="card-top-row">
            <span class="card-step-num">{{ item.step }}</span>
            <span v-if="idx === 10" class="milestone-tag">Final Closeout</span>
            <span v-else-if="activeStep === idx" class="active-tag">Active</span>
          </div>

          <h4 class="card-title">{{ item.title }}</h4>
          <p class="card-desc">{{ item.desc }}</p>

          <div class="card-footer-indicator">
            <span class="indicator-line"></span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.process-section {
  padding: 5.5rem 0;
  background-color: var(--c-bg-alt);
}

/* Stepper Progress Bar */
.process-stepper-bar {
  position: relative;
  max-width: 1080px;
  margin: 0 auto 2.5rem auto;
  padding: 1rem 0;
}

.stepper-track-line {
  position: absolute;
  top: 2rem;
  left: 2rem;
  right: 2rem;
  height: 4px;
  background: var(--c-border);
  border-radius: 4px;
  z-index: 1;
}

.stepper-track-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--c-royal-blue) 0%, var(--c-blue-accent) 100%);
  border-radius: 4px;
  transition: width 0.4s ease;
}

.stepper-nodes {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  z-index: 2;
}

.stepper-node {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  padding: 0;
  transition: transform 0.25s ease;
}

.stepper-node:hover {
  transform: translateY(-2px);
}

.node-badge {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--c-surface);
  border: 2px solid var(--c-border);
  color: var(--c-text-muted);
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.stepper-node.is-completed .node-badge {
  background: var(--c-royal-blue-light);
  border-color: var(--c-royal-blue);
  color: var(--c-royal-blue);
}

.stepper-node.is-active .node-badge {
  background: var(--c-royal-blue);
  border-color: var(--c-royal-blue);
  color: #ffffff;
  box-shadow: 0 0 0 4px rgba(21, 65, 148, 0.2);
  transform: scale(1.15);
}

.node-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--c-text-muted);
  white-space: nowrap;
  transition: color 0.3s ease;
}

.stepper-node.is-active .node-label {
  color: var(--c-royal-blue);
}

/* Spotlight Card */
.active-spotlight-card {
  max-width: 1080px;
  margin: 0 auto 2.5rem auto;
  padding: 1.75rem 2rem;
  background: #ffffff;
  border-left: 5px solid var(--c-royal-blue);
  box-shadow: 0 12px 30px rgba(15, 41, 66, 0.08);
}

.spotlight-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--c-border);
}

.spotlight-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: var(--c-royal-blue);
  background: var(--c-royal-blue-light);
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-royal-blue);
  animation: pulse 1.6s infinite ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(0.9); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.5; }
  100% { transform: scale(0.9); opacity: 1; }
}

.spotlight-nav {
  display: flex;
  gap: 0.5rem;
}

.spotlight-btn {
  background: var(--c-bg-alt);
  border: 1px solid var(--c-border);
  color: var(--c-blue-dark);
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.3rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.spotlight-btn:hover:not(:disabled) {
  background: var(--c-royal-blue);
  color: #ffffff;
  border-color: var(--c-royal-blue);
}

.spotlight-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.spotlight-body {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.spotlight-num {
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 900;
  color: var(--c-royal-blue);
  line-height: 1;
  opacity: 0.9;
}

.spotlight-text h3 {
  font-size: 1.35rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.35rem;
}

.spotlight-text p {
  font-size: 0.95rem;
  color: var(--c-text-dark);
  line-height: 1.6;
}

/* 11-Step Process Grid */
.process-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1080px;
  margin: 0 auto;
}

.process-card {
  position: relative;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s ease, box-shadow 0.3s ease;
}

.process-card:hover {
  transform: translateY(-4px);
  border-color: var(--c-royal-blue);
  box-shadow: 0 10px 25px rgba(21, 65, 148, 0.12);
}

.process-card.is-active {
  border-color: var(--c-royal-blue);
  border-top: 4px solid var(--c-royal-blue);
  box-shadow: 0 12px 30px rgba(21, 65, 148, 0.18);
  background: #ffffff;
}

.card-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.card-step-num {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--c-royal-blue);
}

.active-tag {
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #ffffff;
  background: var(--c-royal-blue);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.card-title {
  font-size: 1.08rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.5rem;
}

.card-desc {
  font-size: 0.88rem;
  color: var(--c-text-muted);
  line-height: 1.55;
  margin-bottom: 1rem;
}

.card-footer-indicator {
  margin-top: auto;
  width: 100%;
}

.indicator-line {
  display: block;
  height: 2px;
  width: 24px;
  background: var(--c-border);
  transition: width 0.3s ease, background 0.3s ease;
}

.process-card:hover .indicator-line,
.process-card.is-active .indicator-line {
  width: 100%;
  background: var(--c-royal-blue);
}

/* Step 11 Milestone Card (Spans 2 columns in Row 4) */
.process-card.is-milestone {
  grid-column: span 2;
  background: linear-gradient(135deg, #0f2b5c 0%, #154194 100%);
  color: #ffffff;
  border: 1px solid var(--c-royal-blue-accent);
}

.process-card.is-milestone .card-step-num {
  color: #38bdf8;
}

.process-card.is-milestone .card-title {
  color: #ffffff;
}

.process-card.is-milestone .card-desc {
  color: #e2e8f0;
}

.milestone-tag {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #fef08a;
  background: rgba(217, 119, 6, 0.25);
  border: 1px solid rgba(254, 240, 138, 0.4);
  padding: 0.15rem 0.55rem;
  border-radius: 4px;
}

.process-card.is-milestone .indicator-line {
  background: #38bdf8;
}

/* Responsive Breakpoints */
@media (max-width: 1024px) {
  .stepper-node .node-label {
    display: none;
  }
  .stepper-track-line {
    top: 1.1rem;
    left: 1rem;
    right: 1rem;
  }
}

@media (max-width: 860px) {
  .process-grid {
    grid-template-columns: 1fr 1fr;
  }
  .process-card.is-milestone {
    grid-column: span 2;
  }
}

@media (max-width: 640px) {
  .process-grid {
    grid-template-columns: 1fr;
  }
  .process-card.is-milestone {
    grid-column: span 1;
  }
  .spotlight-body {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  .spotlight-num {
    font-size: 2.2rem;
  }
}
</style>
