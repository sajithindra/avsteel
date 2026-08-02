<script setup lang="ts">
import { ref } from 'vue'
import { CHALLENGES_SOLVED } from '../data/companyData'

const activeChallengeId = ref(CHALLENGES_SOLVED[0]!.id)
const activeItem = ref(CHALLENGES_SOLVED[0]!)

const selectChallenge = (id: string) => {
  activeChallengeId.value = id
  const found = CHALLENGES_SOLVED.find(item => item.id === id)
  if (found) {
    activeItem.value = found
  }
}
</script>

<template>
  <section id="challenges" class="challenges-section">
    <div class="container">
      <div class="section-header text-center reveal-on-scroll">
        <span class="badge badge-accent">Problem & Solution Matrix</span>
        <h2>Challenges We Solve</h2>
        <p class="section-subtitle">
          How AVA Structural Steel Detailing eliminates shop delays, field rework, and communication bottlenecks.
        </p>
      </div>

      <!-- Interactive Layout: Left Tabs List, Right Active Solution Showcase -->
      <div class="challenges-layout reveal-on-scroll stagger-1">
        <!-- Interactive Left Challenge Selector List -->
        <div class="challenge-tabs-list">
          <button
            v-for="(item, idx) in CHALLENGES_SOLVED"
            :key="item.id"
            class="challenge-tab-item"
            :class="{ active: activeChallengeId === item.id }"
            @click="selectChallenge(item.id)"
          >
            <span class="tab-index">0{{ idx + 1 }}</span>
            <div class="tab-info">
              <span class="tab-title">{{ item.title }}</span>
              <span class="tab-arrow">→</span>
            </div>
          </button>
        </div>

        <!-- Active Detail Showcase Panel -->
        <div class="challenge-showcase-panel">
          <Transition name="fade-slide" mode="out-in">
            <div :key="activeItem.id" class="showcase-card">
              <div class="showcase-header">
                <span class="showcase-badge">Operational Resolution</span>
                <h3 class="showcase-title">{{ activeItem.title }}</h3>
              </div>

              <div class="showcase-grid">
                <!-- Problem Card -->
                <div class="showcase-box problem-box">
                  <div class="box-header">
                    <span class="box-icon text-amber">⚠️</span>
                    <span class="box-title">Fabrication Bottleneck</span>
                  </div>
                  <p class="box-desc">{{ activeItem.problem }}</p>
                </div>

                <!-- Solution Card -->
                <div class="showcase-box solution-box">
                  <div class="box-header">
                    <span class="box-icon text-emerald">✓</span>
                    <span class="box-title">AVA Engineering Solution</span>
                  </div>
                  <p class="box-desc">{{ activeItem.solution }}</p>
                </div>
              </div>

              <div class="showcase-footer">
                <span class="footer-note">Structured QA/QC & AISC Compliant Workflows</span>
                <a href="#contact" class="btn btn-accent btn-sm">Resolve Your Detailing Bottleneck</a>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.challenges-section {
  padding: 5rem 0;
  background-color: var(--c-bg-alt, #f0f4fa);
}

.text-center {
  text-align: center;
}

.challenges-layout {
  display: grid;
  grid-template-columns: 0.95fr 1.25fr;
  gap: 2rem;
  align-items: stretch;
}

.challenge-tabs-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.challenge-tab-item {
  background: #ffffff;
  border: 1px solid var(--c-border-light, #e2e8f0);
  padding: 1rem 1.15rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.25s ease;
  width: 100%;
}

.challenge-tab-item:hover {
  border-color: var(--c-royal-blue);
  transform: translateX(4px);
  background: #f8fafc;
}

.challenge-tab-item.active {
  background: var(--c-royal-blue);
  color: #ffffff;
  border-color: var(--c-royal-blue);
  box-shadow: 0 8px 20px rgba(21, 65, 148, 0.22);
}

.tab-index {
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: 800;
  color: var(--c-royal-blue);
  background: var(--c-royal-blue-light);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  flex-shrink: 0;
}

.challenge-tab-item.active .tab-index {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.tab-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.tab-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--c-blue-dark);
}

.challenge-tab-item.active .tab-title {
  color: #ffffff;
}

.tab-arrow {
  font-size: 1.1rem;
  color: #94a3b8;
  transition: transform 0.25s ease;
}

.challenge-tab-item.active .tab-arrow {
  color: #93c5fd;
  transform: translateX(4px);
}

/* Showcase Panel */
.challenge-showcase-panel {
  background: #ffffff;
  border: 1px solid var(--c-royal-blue-border);
  border-radius: 14px;
  padding: 2.25rem;
  box-shadow: 0 10px 30px rgba(15, 41, 66, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.showcase-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

.showcase-header {
  border-bottom: 1px solid var(--c-border-light);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.showcase-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--c-royal-blue);
  background: var(--c-royal-blue-light);
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.showcase-title {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--c-blue-dark);
  margin: 0;
}

.showcase-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.showcase-box {
  padding: 1.25rem;
  border-radius: 10px;
}

.problem-box {
  background: #fff8f6;
  border: 1px solid #fed7aa;
}

.solution-box {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.box-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.box-title {
  font-size: 0.85rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--c-blue-dark);
}

.box-desc {
  font-size: 0.95rem;
  font-weight: 600;
  color: #334155;
  line-height: 1.55;
  margin: 0;
}

.text-amber {
  color: #ea580c;
}

.text-emerald {
  color: #16a34a;
}

.showcase-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--c-border-light);
  padding-top: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-note {
  font-size: 0.82rem;
  color: var(--c-text-muted);
  font-weight: 600;
}

.btn-sm {
  padding: 0.55rem 1.15rem;
  font-size: 0.86rem;
}

@media (max-width: 900px) {
  .challenges-layout {
    grid-template-columns: 1fr;
  }
}
</style>

