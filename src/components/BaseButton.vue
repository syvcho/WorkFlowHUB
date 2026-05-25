<template>
  <button class="base-button">
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.base-button:hover {
  opacity: 0.9;
}
</style>