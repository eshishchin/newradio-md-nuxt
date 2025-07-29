<template>
  <div class="w-full overflow-hidden pt-5 pl-3 mb-15">
    <div
      class="flex transition-transform duration-600 ease-in-out will-change-transform pb-4"
      :class="{ 'transition-none': noTransition }"
      :style="{ transform: `translateX(-${currentOffset}px)` }"
      ref="trackRef"
    >
      <NuxtLink
        v-for="(slide, index) in visibleSlides"
        :key="index"
        :to="slide.link"
        class="flex-none w-[606px] rounded-[20px] overflow-hidden mr-[20px] border-[2px] border-[#6c02e6] shadow-[0_0_10px_#6c02e6] transition-transform duration-300"
      >
        <img :src="getImageUrl(slide.cover)" :alt="slide.title" class="w-full h-full object-cover block" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const slides = ref([])
const visibleSlides = ref([])
const currentOffset = ref(0)
const noTransition = ref(false)
const slideWidth = 606
const spacing = 20
const step = slideWidth + spacing

const trackRef = ref(null)

// Основной fetch
onMounted(async () => {
  const allSlides = []

  try {
    // старые баннеры
    const res1 = await fetch('https://api.newradio.md/items/carusel?filter[status][_eq]=published&fields=id,title,link,cover')
    const json1 = await res1.json()
    const caruselSlides = json1.data.map(s => ({
      title: s.title,
      link: s.link,
      cover: s.cover
    }))
    allSlides.push(...caruselSlides)
  } catch (err) {
    console.error('Ошибка загрузки carusel:', err)
  }

  try {
    // блоки из content_blocks с show_in_carousel = true
    const res2 = await fetch('https://api.newradio.md/items/content_blocks?filter[show_in_carusel][_eq]=true&filter[status][_eq]=published')
    const json2 = await res2.json()
    const contentSlides = json2.data.map(s => ({
      title: s.title,
      link: `/${s.slug}`,
      cover: s.image
    }))
    allSlides.push(...contentSlides)
  } catch (err) {
    console.error('Ошибка загрузки content_blocks:', err)
  }

  slides.value = allSlides
  visibleSlides.value = [...allSlides, ...allSlides.slice(0, 3)]
})

// авто-пролистывание
onMounted(() => {
  setInterval(() => {
    moveNext()
  }, 5000)
})

function moveNext() {
  currentOffset.value += step

  if (currentOffset.value >= step * slides.value.length) {
    setTimeout(() => {
      noTransition.value = true
      currentOffset.value = 0
      setTimeout(() => {
        noTransition.value = false
      }, 20)
    }, 600)
  }
}

const getImageUrl = (id) => `https://api.newradio.md/assets/${id}`
</script>

