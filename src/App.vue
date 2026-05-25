<script setup>
import { ref } from 'vue'

import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import TaskSection from '@/components/TaskSection.vue'
const appTitle = 'WorkFlow Hub'
</script>

<template>
  <div class="app-container">
    <Navbar :title="appTitle" />

    <div class="main-layout">
      <Sidebar />

      <main class="content">
        <TaskSection />
      </main>
    </div>
  </div>
</template>

<style scoped>

.app-container {
  font-family: Arial, sans-serif;
}

.main-layout {
  display: flex;
}

.content {
  flex: 1;
  padding: 20px;
  background: #f4f6f8;
  min-height: 100vh;
}
</style>