<script setup>
import Button from 'primevue/button'
import Card from 'primevue/card'
import DatePicker from 'primevue/datepicker'
import Divider from 'primevue/divider'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'

defineProps({
  editingId: {
    type: [Number, String, null],
    default: null,
  },
  workflowForm: {
    type: Object,
    required: true,
  },
  workflowTouched: {
    type: Object,
    required: true,
  },
  workflowServerErrors: {
    type: Object,
    required: true,
  },
  workflowErrors: {
    type: Object,
    required: true,
  },
  canUseBackend: {
    type: Boolean,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
})

defineEmits(['submit-workflow', 'reset-workflow-form'])

const categoryOptions = [
  { value: 'cv', label: 'CV' },
  { value: 'learning', label: 'Learning' },
  { value: 'backend', label: 'Backend' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'supabase', label: 'Supabase' },
]

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const statusOptions = [
  { value: 'planned', label: 'Planned' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
]
</script>

<template>
  <Card class="workflow-editor-panel surface-card">
    <template #content>
      <div class="panel-title-row">
        <div class="section-heading">
          <p class="eyebrow">Laravel REST API</p>
          <h2>{{ editingId ? 'Edit workflow item' : 'Create workflow item' }}</h2>
          <p class="section-copy">Ship a workflow through Vue state, Laravel validation, and Supabase Postgres.</p>
        </div>
        <i class="pi pi-send panel-icon"></i>
      </div>

      <Divider />

      <form class="workflow-form" novalidate @submit.prevent="$emit('submit-workflow')">
        <label class="field-group">
          <span>Title</span>
          <InputText
            v-model="workflowForm.title"
            type="text"
            placeholder="Create your next workflow item"
            :disabled="!canUseBackend"
            :class="{ invalid: workflowErrors.title }"
            fluid
            @blur="workflowTouched.title = true"
            @input="workflowServerErrors.title = ''"
          />
          <span class="field-hint">{{ workflowForm.title.trim().length }}/160 characters</span>
          <Message v-if="workflowErrors.title" severity="error" size="small" variant="simple">
            {{ workflowErrors.title }}
          </Message>
        </label>

        <label class="field-group">
          <span>Description</span>
          <Textarea
            v-model="workflowForm.description"
            placeholder="Describe the outcome, learning target, or CV value."
            :disabled="!canUseBackend"
            :class="{ invalid: workflowErrors.description }"
            rows="5"
            auto-resize
            fluid
            @blur="workflowTouched.description = true"
            @input="workflowServerErrors.description = ''"
          />
          <span class="field-hint">{{ workflowForm.description.trim().length }}/2000 characters</span>
          <Message v-if="workflowErrors.description" severity="error" size="small" variant="simple">
            {{ workflowErrors.description }}
          </Message>
        </label>

        <div class="form-row">
          <label class="field-group">
            <span>Category</span>
            <Select
              v-model="workflowForm.category"
              :options="categoryOptions"
              option-label="label"
              option-value="value"
              :disabled="!canUseBackend"
              :class="{ invalid: workflowErrors.category }"
              fluid
              @update:model-value="workflowServerErrors.category = ''"
            />
            <Message v-if="workflowErrors.category" severity="error" size="small" variant="simple">
              {{ workflowErrors.category }}
            </Message>
          </label>

          <label class="field-group">
            <span>Priority</span>
            <Select
              v-model="workflowForm.priority"
              :options="priorityOptions"
              option-label="label"
              option-value="value"
              :disabled="!canUseBackend"
              :class="{ invalid: workflowErrors.priority }"
              fluid
              @update:model-value="workflowServerErrors.priority = ''"
            />
            <Message v-if="workflowErrors.priority" severity="error" size="small" variant="simple">
              {{ workflowErrors.priority }}
            </Message>
          </label>
        </div>

        <div class="form-row">
          <label class="field-group">
            <span>Status</span>
            <Select
              v-model="workflowForm.status"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              :disabled="!canUseBackend"
              :class="{ invalid: workflowErrors.status }"
              fluid
              @update:model-value="workflowServerErrors.status = ''"
            />
            <Message v-if="workflowErrors.status" severity="error" size="small" variant="simple">
              {{ workflowErrors.status }}
            </Message>
          </label>

          <label class="field-group">
            <span>Due date</span>
            <DatePicker
              v-model="workflowForm.due_date"
              update-model-type="string"
              date-format="yy-mm-dd"
              show-icon
              fluid
              :disabled="!canUseBackend"
              :class="{ invalid: workflowErrors.due_date }"
              @blur="workflowTouched.due_date = true"
              @update:model-value="workflowServerErrors.due_date = ''"
            />
            <Message v-if="workflowErrors.due_date" severity="error" size="small" variant="simple">
              {{ workflowErrors.due_date }}
            </Message>
          </label>
        </div>

        <div class="button-row">
          <Button
            type="submit"
            :label="editingId ? 'Save changes' : 'Add workflow'"
            icon="pi pi-plus"
            :loading="loading"
            :disabled="!canUseBackend || loading"
          />
          <Button
            v-if="editingId"
            type="button"
            label="Cancel"
            icon="pi pi-times"
            severity="secondary"
            outlined
            @click="$emit('reset-workflow-form')"
          />
        </div>
      </form>
    </template>
  </Card>
</template>
