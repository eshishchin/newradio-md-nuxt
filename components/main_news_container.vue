<template>
  <div class="text-left px-50 text-[4rem] font-black">Горячие Новости</div>
  <div class="flex flex-col md:flex-row gap-8 w-full px-4 md:px-50 py-10">
    <!-- Левая колонка -->
    <div class="flex-1 grid grid-cols-1 gap-6">
      <NuxtLink 
        v-for="item in mainNews"
        :key="item.id"
        :to="`/news/${item.id}`"
        class="w-100 bg-white/4 backdrop-blur p-8 rounded-xl shadow-lg"
      >
        <img
          :src="getImageUrl(item.image)"
          alt=""
          class="w-100 h-60 object-cover rounded-md"
        />
        <h2 class="text-left text-white text-[1.5rem] font-bold mt-4">{{ item.title }}</h2>
        <p class="text-left text-white/70 text-[1rem] mt-2">{{ item.subtitle }}</p>
      </NuxtLink>

    </div>

    <!-- Правая колонка → Афиша -->
    <div class="w-full md:w-1/3 bg-white/5 backdrop-blur p-6 rounded-xl shadow-md">
      <h3 class="text-white text-lg font-semibold mb-4">Афиша</h3>
      <div class="flex flex-col gap-6">
        <NuxtLink
          v-for="item in afisha"
          :key="item.id"
          :to="`/afisha/${item.id}`"
          class="block group"
        >
          <img
            :src="getImageUrl(item.image)"
            alt=""
            class="w-full h-40 object-cover rounded-md mb-2 group-hover:opacity-90 transition"
          />
          <div class="text-white font-bold text-md group-hover:text-red-400 transition">
            {{ formatDate(item.date) }} | {{ item.title }}
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const mainNews = ref([])
const afisha = ref([])

onMounted(async () => {
  const [mainRes, afishaRes] = await Promise.all([
    fetch('https://api.newradio.md/items/news_v2?filter[status][_eq]=published&fields=id,title,subtitle,image&sort=-date_created&limit=5'),
    fetch('https://api.newradio.md/items/afisha?filter[status][_eq]=published&fields=id,title,image,date&sort=date&limit=10')
  ])
  const mainJson = await mainRes.json()
  const afishaJson = await afishaRes.json()

  mainNews.value = mainJson.data
  afisha.value = afishaJson.data
})

const getImageUrl = (file) => file ? `https://api.newradio.md/assets/${file}` : ''

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>
