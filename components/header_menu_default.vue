<template>
  <div class="flex gap-4">
    <NuxtLink
      v-for="item in fullMenu"
      :key="item.label"
      :to="item.to"
      :class="[
        'text-[2rem] font-semibold px-4 py-2 rounded-md transition-colors duration-200 hover:text-[#ff2cc3] hover:[text-shadow:0_0_5px_#ff2cc379,0_0_10px_#ff2cc375]',
        current === item.label
          ? 'text-[#ff2cc3] [text-shadow:0_0_5px_#ff2cc379,0_0_10px_#ff2cc375]'
          : 'text-white'
      ]"
    >
      {{ item.label }}
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Статичные пункты
const staticMenu = [
  { label: 'Главная', to: '/' },
  { label: 'Контакты', to: '/contacts' },
]

// Динамичные пункты из API
const dynamicMenu = ref([])

onMounted(async () => {
  try {
    const res = await fetch('https://api.newradio.md/items/content_blocks?filter[show_in_header][_eq]=true&filter[status][_eq]=published')
    const json = await res.json()
    dynamicMenu.value = json.data.map((item) => ({
      label: item.title,
      to: `/${item.slug}`,
    }))
  } catch (e) {
    console.error('Ошибка загрузки меню:', e)
  }
})

// Финальный массив для v-for
const fullMenu = computed(() => [
  ...staticMenu.slice(0, 1), // Главная
  ...dynamicMenu.value,
  ...staticMenu.slice(1),    // Контакты
])

const current = computed(() => {
  const match = fullMenu.value.find((item) => item.to === route.path)
  return match ? match.label : ''
})
</script>
