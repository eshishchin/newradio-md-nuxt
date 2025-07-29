<template>
  <div class="preloader" :class="{ hidden: hidden }">
    <div class="loader"></div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({ hidden: Boolean })
</script>

<style scoped>
.preloader {
  position: fixed;
  z-index: 9999;
  background: linear-gradient(to bottom, #1a003d, #280757, #4a008a);
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.6s ease;
  pointer-events:none;
}
.preloader .hidden {
  opacity: 0;
}

.loader {
  width: 60px;
  height: 60px;
  border: 8px solid white;
  border-top: 8px solid #04fb27;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0); }
  100% { transform: rotate(360deg); }
}
</style>
