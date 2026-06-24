<script setup>
import Card from 'primevue/card'
import ProgressBar from 'primevue/progressbar'

defineProps({
  total: {
    type: Number,
    required: true,
  },
  planned: {
    type: Number,
    required: true,
  },
  inProgress: {
    type: Number,
    required: true,
  },
  completed: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <section class="stats-grid">
    <Card class="metric-card">
      <template #content>
        <i class="pi pi-objects-column metric-icon total"></i>
        <span>{{ total }}</span>
        <p>Total workflows</p>
      </template>
    </Card>
    <Card class="metric-card">
      <template #content>
        <i class="pi pi-calendar metric-icon planned"></i>
        <span>{{ planned }}</span>
        <p>Planned</p>
      </template>
    </Card>
    <Card class="metric-card">
      <template #content>
        <i class="pi pi-spin pi-cog metric-icon progress"></i>
        <span>{{ inProgress }}</span>
        <p>In progress</p>
      </template>
    </Card>
    <Card class="metric-card">
      <template #content>
        <i class="pi pi-check-circle metric-icon complete"></i>
        <span>{{ completed }}</span>
        <p>Completed</p>
        <ProgressBar
          :value="total ? Math.round((completed / total) * 100) : 0"
          :show-value="false"
          class="metric-progress"
        />
      </template>
    </Card>
  </section>
</template>
