<script setup>
import TaskCard from '@/components/TaskCard.vue'
import TaskForm from '@/components/TaskForm.vue'
import { ref } from 'vue'

const emptyMessage = 'Tasks are empty'

const tasks = ref([])

const addTask = (taskTitle, author, priority) => {
  tasks.value.push({
    id: Date.now(),
    taskTitle,
    author,
    priority,
    createdAt: new Date().toLocaleDateString(),
    completed: false
  })
}

const deleteTask = (taskId) => {
  tasks.value = tasks.value.filter(
    task => task.id !== taskId
  )
}

const toggleTask = (taskId) => {
  const task = tasks.value.find(
    task => task.id === taskId
  )

  if (task) {
    task.completed = !task.completed
  }
}

const editTask = (taskId, newTitle) => {
  const task = tasks.value.find(
    task => task.id === taskId
  )

  if (task && newTitle.trim()) {
    task.title = newTitle
  }
}
</script>

<template>
  <section>
    <h1>Task Dashboard</h1>

    <TaskForm @add-task="addTask" />

    <div class="task-list">

      <!-- EMPTY STATE -->
      <template v-if="tasks.length === 0">
        <p class="empty-message">
          {{ emptyMessage }}
        </p>
      </template>

      <!-- TASK LIST -->
      <template v-else>
        <TaskCard
          v-for="task in tasks"
          :key="task.id"
          :task="task"
          @delete-task="deleteTask"
          @toggle-task="toggleTask"
          @edit-task="editTask"
        />
      </template>

    </div>
  </section>
</template>

<style scoped>
.task-list {
  margin-top: 20px;

  display: flex;
  flex-direction: column;
  gap: 15px;
}

.empty-message {
  background: white;
  padding: 20px;
  border-radius: 10px;

  text-align: center;
  color: gray;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>