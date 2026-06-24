<script setup>
import Card from 'primevue/card'
import Message from 'primevue/message'
import Skeleton from 'primevue/skeleton'
import WorkflowCard from './WorkflowCard.vue'
import WorkflowFilters from './WorkflowFilters.vue'

defineProps({
  canUseBackend: {
    type: Boolean,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  workflowsLength: {
    type: Number,
    required: true,
  },
  filteredWorkflows: {
    type: Array,
    required: true,
  },
  filteredEmptyMessage: {
    type: String,
    required: true,
  },
  filterOptions: {
    type: Array,
    required: true,
  },
  workflowFilter: {
    type: String,
    required: true,
  },
  statusOptions: {
    type: Array,
    required: true,
  },
  priorityOptions: {
    type: Array,
    required: true,
  },
  isWorkflowUpdating: {
    type: Function,
    required: true,
  },
})

defineEmits(['change-filter', 'update-workflow-field', 'edit-workflow', 'delete-workflow'])
</script>

<template>
  <Card class="workflow-backlog-panel surface-card">
    <template #content>
      <div class="panel-title-row">
        <div class="section-heading">
          <p class="eyebrow">Portfolio backlog</p>
          <h2>Workflow items</h2>
          <p class="section-copy">Filter, inspect, and update progress without leaving the dashboard.</p>
        </div>
        <i class="pi pi-list-check panel-icon"></i>
      </div>

      <WorkflowFilters
        :can-use-backend="canUseBackend"
        :workflows-length="workflowsLength"
        :filter-options="filterOptions"
        :workflow-filter="workflowFilter"
        @change-filter="$emit('change-filter', $event)"
      />

      <div v-if="loading" class="skeleton-stack">
        <Skeleton height="8rem" border-radius="12px" />
        <Skeleton height="8rem" border-radius="12px" />
      </div>
      <Message v-else-if="!canUseBackend" severity="info" :closable="false" class="empty-state">
        Sign in with Supabase to load protected Laravel data.
      </Message>
      <Message v-else-if="workflowsLength === 0" severity="secondary" :closable="false" class="empty-state">
        No workflow items yet.
      </Message>
      <Message v-else-if="filteredWorkflows.length === 0" severity="secondary" :closable="false" class="empty-state">
        {{ filteredEmptyMessage }}
      </Message>

      <div v-else class="workflow-list">
        <WorkflowCard
          v-for="workflow in filteredWorkflows"
          :key="workflow.id"
          :workflow="workflow"
          :status-options="statusOptions"
          :priority-options="priorityOptions"
          :updating="isWorkflowUpdating(workflow.id)"
          @update-field="$emit('update-workflow-field', $event)"
          @edit="$emit('edit-workflow', $event)"
          @delete="$emit('delete-workflow', $event)"
        />
      </div>
    </template>
  </Card>
</template>
