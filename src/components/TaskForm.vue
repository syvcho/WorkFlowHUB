<script setup>
import { ref } from 'vue'
import BaseButton from './BaseButton.vue'

const emit = defineEmits(['add-task'])

const taskTitle = ref('')
const author = ref('')
const priority = ref('Medium')

const submitTask = () => {
  if (!taskTitle.value.trim()) return

  emit('add-task',
  taskTitle.value,
author.value,
priority.value
)

  taskTitle.value = ''
  author.value = ''
  priority.value = 'Medium'
}
</script>

<template>
  <div class="task-form">
    <input
      v-model="taskTitle"
      type="text"
      placeholder="Enter task..."
    />
        <input
      v-model="author"
      type="text"
      placeholder="Author"
    />
    <select v-model="priority">
      <option>Low</option>
      <option>Medium</option>
      <option>High</option>
    </select>

    <BaseButton @click="submitTask">
      Add Task
    </BaseButton>
  </div>
</template>

<style scoped>
.task-form {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

input {
  padding: 10px;
  width: 250px;
}
</style>