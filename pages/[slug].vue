<template>
  <div class="align-center px-4 md:px-120 py-20 text-white">
    <div v-if="block">
      <h1 class="text-left text-5xl font-bold mb-4">{{ block.title }}</h1>

      <img
        v-if="block.image"
        :src="getImageUrl(block.image)"
        class="rounded-lg mb-6 max-h-[400px] object-cover w-full"
      />

      <!-- Специальный вывод для страницы /akcii -->
      <Contest_section v-if="block.slug === 'contest'" />

            <!-- Специальный вывод для страницы /shows -->
      <Shows_section v-else-if="block.slug === 'show'" />

  <!-- Специальный вывод для страницы /programs -->
      <Programs_section v-else-if="block.slug === 'programs'" />

        <!-- Специальный вывод для страницы /top20 -->
      <Top20_section v-else-if="block.slug === 'top20'" />

      <!-- Обычный вывод body -->
      <div
        v-else
        v-html="block.body"
        class="text-2xl text-white prose prose-invert max-w-none [&>*]:mx-auto [&>iframe]:mx-auto [&>iframe]:block"
      />

      <div v-if="block.external_url" class="mt-6">
        <a
          :href="block.external_url"
          class="inline-block text-white font-bold text-xl underline hover:text-red-400 transition"
          target="_blank"
        >Подробнее</a>
      </div>
    </div>

    <div v-else-if="notFound">
      <p class="text-red-500 text-lg">Раздел не найден или снят с публикации.</p>
    </div>

    <div v-else>
      <p>Загрузка...</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import Contest_section from '~/components/contest_section.vue'
import Shows_section from '~/components/shows_section.vue'
import Programs_section from '~/components/programs_section.vue'
import Top20_section from '~/components/top20_section.vue'


const route = useRoute()
const block = ref(null)
const notFound = ref(false)

const getImageUrl = (file) => file ? `https://api.newradio.md/assets/${file}` : ''

onMounted(async () => {
  try {
    const res = await fetch(`https://api.newradio.md/items/content_blocks?filter[slug][_eq]=${route.params.slug}`)
    const json = await res.json()

    if (!json.data?.length || json.data[0].status !== 'published') {
      notFound.value = true
    } else {
      block.value = json.data[0]
    }
  } catch (e) {
    notFound.value = true
  }
})
</script>