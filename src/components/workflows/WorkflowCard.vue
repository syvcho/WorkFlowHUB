<script setup>
import Button from 'primevue/button'
import Card from 'primevue/card'
import ProgressBar from 'primevue/progressbar'
import Select from 'primevue/select'
import Tag from 'primevue/tag'

defineProps({
  workflow: {
    type: Object,
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
  updating: {
    type: Boolean,
    required: true,
  },
})

defineEmits(['update-field', 'edit', 'delete'])

function statusLabel(status) {
  return status.replace('_', ' ')
}

function statusSeverity(status) {
  if (status === 'completed') return 'success'
  if (status === 'in_progress') return 'info'

  return 'secondary'
}

function prioritySeverity(priority) {
  if (priority === 'high') return 'danger'
  if (priority === 'medium') return 'warn'

  return 'secondary'
}

function statusProgress(status) {
  if (status === 'completed') return 100
  if (status === 'in_progress') return 55

  return 15
}
</script>

<template>
  <Card class="workflow-card">
    <template #content>
      <div class="workflow-card-body">
        <div class="card-meta">
          <Tag :value="workflow.category" severity="contrast" rounded />
          <Tag :value="workflow.priority" :severity="prioritySeverity(workflow.priority)" rounded />
          <Tag :value="statusLabel(workflow.status)" :severity="statusSeverity(workflow.status)" rounded />
        </div>
        <h3>{{ workflow.title }}</h3>
        <p>{{ workflow.description || 'No description yet.' }}</p>
        <small v-if="workflow.due_date"><i class="pi pi-calendar"></i> Due {{ workflow.due_date }}</small>
        <ProgressBar
          :value="statusProgress(workflow.status)"
          :show-value="false"
          class="workflow-progress"
        />
      </div>

      <div class="workflow-card-controls">
        <label class="field-group">
          <span>Progress</span>
          <Select
            :model-value="workflow.status"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            :disabled="updating"
            fluid
            @update:model-value="$emit('update-field', { workflow, field: 'status', value: $event })"
          />
        </label>

        <label class="field-group">
          <span>Priority</span>
          <Select
            :model-value="workflow.priority"
            :options="priorityOptions"
            option-label="label"
            option-value="value"
            :disabled="updating"
            fluid
            @update:model-value="$emit('update-field', { workflow, field: 'priority', value: $event })"
          />
        </label>

        <span v-if="updating" class="saving-note"><i class="pi pi-spin pi-spinner"></i> Saving...</span>
        <Button
          type="button"
          label="Edit details"
          icon="pi pi-pencil"
          severity="secondary"
          outlined
          :disabled="updating"
          @click="$emit('edit', workflow)"
        />
        <Button
          type="button"
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          outlined
          @click="$emit('delete', workflow.id)"
        />
      </div>
    </template>
  </Card>
</template>
