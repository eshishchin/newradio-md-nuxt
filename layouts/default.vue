<template>
  <div class="relative min-h-screen overflow-hidden">
    <StarBackground />

    <Preloader :hidden="!showPreloader" v-if="showPreloader || fading" />

    <!-- Header -->
    <header class="text-center mb-6 relative z-20">
      <header_default />
    </header>

    <div class="flex flex-col min-h-screen relative z-10">
      <!-- Main -->
      <main class="flex-1 text-white text-center mb-6">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="text-white text-center">
        <Footer_default />
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { onNuxtReady } from '#app'
import Preloader from '~/components/Preloader.vue'
import StarBackground from '~/components/StarBackground.vue'
import footer_default from '~/components/footer_default.vue'

const showPreloader = ref(true)
const fading = ref(true)

onNuxtReady(() => {
  setTimeout(() => {
    showPreloader.value = false
    setTimeout(() => {
      fading.value = false // удаляем совсем через 600мс
    }, 600)
  }, 1000)
})
import header_default from '~/components/header_default.vue';
import Footer_default from '~/components/footer_default.vue'
</script>
