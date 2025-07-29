<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    <NuxtLink
      v-for="item in programs"
      :key="item.id"
      :to="`/${item.slug}`"
      class="bg-[#2e0863] border-[2px] border-[#6c02e6] shadow-[0_0_10px_#6c02e6] rounded-[12px] p-3 hover:bg-[#480b99]"
    >
      <img
        v-if="item.image"
        :src="getImageUrl(item.image)"
        class="w-full h-[180px] object-cover rounded-[8px] mb-4"
      />
      <h3 class="text-xl text-white font-bold">{{ item.title }}</h3>
      <p class="text-white/60 mt-2">{{ item.short_description }}</p>
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Загружаем все блоки типа 'program' из коллекции content_blocks
const programs = ref([])

onMounted(async () => {
  const res = await fetch(`https://api.newradio.md/items/content_blocks?filter[type][_eq]=program&filter[status][_eq]=published`)
  const json = await res.json()
  programs.value = json.data
})

const getImageUrl = (id) => `https://api.newradio.md/assets/${id}`
</script>