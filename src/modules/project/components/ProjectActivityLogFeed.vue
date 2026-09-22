<script setup lang="ts">
import { computed } from 'vue'
import { useAuditStore } from '../../../core/audit/auditStore'

const auditStore = useAuditStore()

const logs = computed(() => auditStore.activityLogs)

const formatTime = (timestamp: any): string => {
  if (!timestamp) return 'Just now'
  if (timestamp.toDate) {
    const d = timestamp.toDate()
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  return 'Recent'
}
</script>

<template>
  <div class="activity-log-container ava-card">
    <div class="log-header">
      <div class="header-text">
        <h3>Project Activity Log & Audit Trail</h3>
        <p class="section-desc">
          Complete, tamper-evident audit history of all drawings, standards confirmations, RFIs, transmittals, and releases.
        </p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="logs.length === 0" class="empty-log-panel">
      <div class="empty-icon"><span class="material-symbols-outlined icon-xxl text-muted">history</span></div>
      <h4>No Activity Recorded Yet</h4>
      <p>Actions performed on drawings, standards, RFIs, transmittals, and releases will automatically be logged here.</p>
    </div>

    <!-- Timeline List -->
    <div v-else class="timeline-wrapper">
      <div
        v-for="item in logs"
        :key="item.id"
        class="timeline-item"
      >
        <div class="timeline-bullet"></div>
        <div class="timeline-content">
          <div class="timeline-top">
            <span class="action-title">{{ item.actionTitle }}</span>
            <span class="action-time">{{ formatTime(item.timestamp) }}</span>
          </div>
          <p class="action-details">{{ item.actionDetails }}</p>
          <div class="actor-row">
            <span class="actor-badge">
              {{ item.actorName }} ({{ item.actorRole.replace(/_/g, ' ') }})
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.activity-log-container {
  padding: 1.75rem;
}

.log-header {
  border-bottom: 1px solid var(--c-border);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.log-header h3 {
  font-size: 1.25rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.25rem;
}

.section-desc {
  font-size: 0.88rem;
  color: var(--c-text-muted);
}

.timeline-wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 1.25rem;
}

.timeline-wrapper::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: var(--c-royal-blue-border);
}

.timeline-item {
  position: relative;
  display: flex;
  gap: 1rem;
  padding-bottom: 1.5rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-bullet {
  position: absolute;
  left: -1.25rem;
  top: 4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--c-royal-blue);
  border: 3px solid #ffffff;
  box-shadow: 0 0 0 2px var(--c-royal-blue-border);
}

.timeline-content {
  background: #f8fafc;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 0.85rem 1.15rem;
  width: 100%;
}

.timeline-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
}

.action-title {
  font-weight: 700;
  font-size: 0.92rem;
  color: var(--c-blue-dark);
}

.action-time {
  font-size: 0.78rem;
  color: var(--c-text-muted);
  font-family: monospace;
}

.action-details {
  font-size: 0.86rem;
  color: var(--c-text-dark);
  line-height: 1.45;
  margin-bottom: 0.5rem;
}

.actor-row {
  display: flex;
}

.actor-badge {
  font-size: 0.74rem;
  font-weight: 600;
  color: var(--c-royal-blue);
  background: var(--c-royal-blue-light);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  text-transform: capitalize;
}

.empty-log-panel {
  text-align: center;
  padding: 3rem 1.5rem;
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.empty-log-panel h4 {
  font-size: 1.1rem;
  color: var(--c-blue-dark);
  margin-bottom: 0.25rem;
}

.empty-log-panel p {
  color: var(--c-text-muted);
  font-size: 0.88rem;
  max-width: 440px;
  margin: 0 auto;
}
</style>
