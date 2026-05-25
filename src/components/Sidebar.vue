<template>
  <aside class="sidebar">
    <ul>
      <li>Dashboard</li>
      <li>Tasks</li>
      <li>Projects</li>
      <li>Settings</li>
    </ul>
  </aside>
</template>

<script>
export default {}
</script>

<style scoped>
.sidebar {
  width: 220px;
  background-color: #334155;
  color: white;
  min-height: 100vh;
  padding: 20px;
}

.sidebar ul {
  list-style: none;
}

.sidebar li {
  margin-bottom: 20px;
  cursor: pointer;
}

.sidebar li:hover {
  color: #38bdf8;
}
</style>