<script setup lang="ts">
import { ref, computed } from 'vue'
import { CORE_TEAM } from '../data/companyData'

const teamFilter = ref<'ALL' | 'LEADERSHIP'>('ALL')

const filteredTeam = computed(() => {
  if (teamFilter.value === 'LEADERSHIP') {
    return CORE_TEAM.filter(m => m.isLeadership)
  }
  return CORE_TEAM
})
</script>

<template>
  <section id="team" class="team-section">
    <div class="container">
      <div class="section-header reveal-on-scroll">
        <span class="badge">Team</span>
        <h2>Core Technical Team</h2>
        <p>Decades of combined AISC commercial and industrial project experience.</p>
      </div>

      <!-- Filter Controls -->
      <div class="team-filters reveal-on-scroll stagger-1">
        <button
          class="filter-pill"
          :class="{ active: teamFilter === 'ALL' }"
          @click="teamFilter = 'ALL'"
        >
          All Members ({{ CORE_TEAM.length }})
        </button>
        <button
          class="filter-pill"
          :class="{ active: teamFilter === 'LEADERSHIP' }"
          @click="teamFilter = 'LEADERSHIP'"
        >
          Leadership & Leads
        </button>
      </div>

      <!-- Team Grid with TransitionGroup -->
      <TransitionGroup name="pill-list" tag="div" class="team-grid reveal-on-scroll stagger-2">
        <div v-for="member in filteredTeam" :key="member.name" class="team-card ava-card">
          <div class="member-top">
            <h4>{{ member.name }}</h4>
            <span v-if="member.experience" class="exp-tag">{{ member.experience }}</span>
          </div>
          <p class="role">{{ member.role }}</p>
          <p class="key-role"><strong>Focus:</strong> {{ member.keyRole }}</p>
        </div>
      </TransitionGroup>
    </div>
  </section>
</template>

<style scoped>
.team-section {
  padding: 5.5rem 0;
  background-color: var(--c-bg-white);
}

.team-filters {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2.25rem;
  flex-wrap: wrap;
}

.filter-pill {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  padding: 0.55rem 1.1rem;
  border-radius: 6px;
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--c-text-muted);
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
  will-change: transform;
}

.filter-pill:hover {
  transform: scale(1.08) translateY(-2px);
  border-color: var(--c-royal-blue);
  color: var(--c-royal-blue);
}

.filter-pill.active {
  background: var(--c-royal-blue);
  color: #ffffff;
  border-color: var(--c-royal-blue);
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: start;
  min-height: 240px;
}

.team-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 140px;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s ease, box-shadow 0.3s ease;
  will-change: transform;
}

.team-card:hover {
  transform: scale(1.04) translateY(-6px);
  border-color: var(--c-royal-blue);
  box-shadow: 0 16px 30px rgba(21, 65, 148, 0.2);
}

.member-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.3rem;
}

.member-top h4 {
  font-size: 1.1rem;
  color: var(--c-blue-dark);
}

.exp-tag {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--c-gold);
  background: #fffbe6;
  padding: 0.1rem 0.45rem;
  border-radius: 4px;
  border: 1px solid #fef08a;
}

.role {
  font-size: 0.88rem;
  color: var(--c-royal-blue-accent);
  font-weight: 600;
  margin-bottom: 0.65rem;
}

.key-role {
  font-size: 0.88rem;
  color: var(--c-text-dark);
  border-top: 1px solid var(--c-border);
  padding-top: 0.65rem;
  line-height: 1.45;
}

@media (max-width: 768px) {
  .team-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  .team-card:nth-child(3n+2) {
    margin-top: 0;
  }
}
</style>

