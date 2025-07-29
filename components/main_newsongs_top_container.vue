<template>
  <div class="w-full mb-10">
    <div class="flex gap-6 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-50 -mb-4 text-[4rem] font-black">
      <button
        @click="activeTab = 'new'"
        :class="activeTab === 'new' ? activeClass : inactiveClass"
      >
        Новое на Новом
      </button>
      <button
        @click="activeTab = 'top'"
        :class="activeTab === 'top' ? activeClass : inactiveClass"
      >
        TOP20
      </button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 bg-gradient-to-br from-[#ff2cc3] to-[#6a00ff] border-[2px] border-[#ff2cc3] shadow-[0_0_10px_#ff2cc3,0_0_10px_#ff2cc3b4] py-20 px-50">
      <component :is="activeTab === 'new' ? NewSongs : Top20" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NewSongs from '~/components/NewSongs.vue'
import Top20 from '~/components/Top20.vue'

const activeTab = ref('new')

const activeClass = 'text-[#ff2cc3] text-shadow-[0_0_5px_#ff2cc379,0_0_10px_#ff2cc375] transition duration-200'
const inactiveClass = 'text-[#ff2cc3b0] hover:text-[#ff2cc3] hover:text-shadow-[0_0_5px_#ff2cc379,0_0_10px_#ff2cc375] transition duration-200'
</script>