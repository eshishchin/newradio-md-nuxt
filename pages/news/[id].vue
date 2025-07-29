<template>
  <div class="align-center px-4 md:px-120 py-20 text-white">
    <div v-if="news">
      <h1 class="text-5xl font-bold mb-4">{{ news.title }}</h1>
      <p class="text-2xl prose prose-invert max-w-none text-white/70 mb-6">{{ news.subtitle }}</p>

      <img
        v-if="news.image"
        :src="getImageUrl(news.image)"
        class="rounded-lg mb-6 max-h-[400px] object-cover w-full"
      />

      <div v-html="news.body" class="text-2xl text-white prose prose-invert max-w-none [&>*]:mx-auto [&>iframe]:mx-auto [&>iframe]:block" />
    </div>

    <div v-else-if="notFound">
      <p class="text-red-500 text-lg">Новость не найдена или снята с публикации.</p>
    </div>

    <div v-else>
      <p>Загрузка...</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const news = ref(null)
const notFound = ref(false)

const getImageUrl = (file) => file ? `https://api.newradio.md/assets/${file}` : ''

onMounted(async () => {
  try {
    const res = await fetch(`https://api.newradio.md/items/news_v2/${route.params.id}`)
    const json = await res.json()

    if (!json.data || json.data.status !== 'published') {
      notFound.value = true
    } else {
      news.value = json.data
    }
  } catch (e) {
    notFound.value = true
  }
})
</script>
