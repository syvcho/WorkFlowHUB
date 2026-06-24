<script setup>
import Button from 'primevue/button'

defineProps({
  canUseBackend: {
    type: Boolean,
    required: true,
  },
  workflowsLength: {
    type: Number,
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
})

defineEmits(['change-filter'])
</script>

<template>
  <div v-if="canUseBackend && workflowsLength > 0" class="filter-tabs" aria-label="Workflow status filters">
    <Button
      v-for="option in filterOptions"
      :key="option.value"
      type="button"
      :label="option.label"
      :badge="String(option.count)"
      :outlined="workflowFilter !== option.value"
      :severity="workflowFilter === option.value ? 'primary' : 'secondary'"
      @click="$emit('change-filter', option.value)"
    />
  </div>
</template>
