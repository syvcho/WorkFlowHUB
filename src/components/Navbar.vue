<template>
  <nav class="navbar">
    <h2>{{ title }}</h2>
  </nav>
</template>

<script>
export default {
  props: {
    title: String
  }
}
</script>

<style scoped>
.navbar {
  background-color: #1e293b;
  color: white;
  padding: 16px 24px;
}
</style>