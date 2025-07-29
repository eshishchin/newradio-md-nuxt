<template>
  <div class="align-center px-4 md:px-120 py-20 text-white">
    <div v-if="afisha">
      <h1 class="text-5xl font-bold mb-10">{{ afisha.title }}</h1>

      <img
        v-if="afisha.image"
        :src="getImageUrl(afisha.image_big)"
        class="rounded-lg mb-6 max-h-[1500px] object-cover w-full"
      />

      <div v-html="afisha.body" class="text-2xl text-white prose prose-invert max-w-none [&>*]:mx-auto [&>iframe]:mx-auto [&>iframe]:block" />
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
const afisha = ref(null)
const notFound = ref(false)

const getImageUrl = (file) => file ? `https://api.newradio.md/assets/${file}` : ''

onMounted(async () => {
  try {
    const res = await fetch(`https://api.newradio.md/items/afisha/${route.params.id}`)
    const json = await res.json()

    if (!json.data || json.data.status !== 'published') {
      notFound.value = true
    } else {
      afisha.value = json.data
    }
  } catch (e) {
    notFound.value = true
  }
})
</script>
