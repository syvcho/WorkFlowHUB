<script setup>
import { ref } from 'vue'
import BaseButton from './BaseButton.vue'

const props = defineProps({
  task: Object
})

const emit = defineEmits([
  'delete-task',
  'toggle-task',
  'edit-task'
])

const isEditing = ref(false)

const editedTitle = ref(props.task.title)

const saveEdit = () => {
  emit(
    'edit-task',
    props.task.id,
    editedTitle.value
  )
  isEditing.value = false
}

const cancelEdit = () =>{
    emit(
        'edit-task',
        props.task.id,
        editedTitle.value = props.task.title
    )
    isEditing.value = false
}
</script>

<template>
  <div class="task-card">

    <!-- LEFT SIDE -->
    <div>

      <!-- NORMAL MODE -->
      <template v-if="!isEditing">

        <h3 :class="{ completed: task.completed }">
          {{ task.title }}
        </h3>
         <p>
          Status:
          {{ task.completed ? 'Completed' : 'Pending' }}
        </p>

        <p>
          Author:
          {{ task.author }}
        </p>

        <p>
          Created:
          {{ task.createdAt }}
        </p>

        <span
          class="priority-badge"
          :class="task.priority.toLowerCase()"
        >
          {{ task.priority }}
        </span>

      </template>

      <!-- EDIT MODE -->
      <template v-else>

        <input v-model="editedTitle" />

        <BaseButton @click="saveEdit">
          Save
        </BaseButton>

        <BaseButton @click="cancelEdit">
          Cancel
        </BaseButton>

      </template>

    </div>

    <!-- RIGHT SIDE -->
    <div v-if="!isEditing" class="actions">

      <BaseButton
        @click="emit('toggle-task', task.id)"
      >
        Toggle
      </BaseButton>

      <BaseButton
        @click="isEditing = true"
      >
        Edit
      </BaseButton>

      <BaseButton
        @click="emit('delete-task', task.id)"
      >
        Delete
      </BaseButton>

    </div>

  </div>
</template>

<style scoped>
.task-card {
  background: white;
  padding: 20px;
  border-radius: 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.actions {
  display: flex;
  gap: 10px;
}

.completed {
  text-decoration: line-through;
  color: gray;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>