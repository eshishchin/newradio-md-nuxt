<template>
  <section class="max-w-3xl mx-auto px-4 py-16 text-center text-white">
    <img
      :src="getImageUrl(member.photo_large || member.photo)"
      alt="Фото"
      class="w-44 h-44 mx-auto mb-6 shadow-xl object-cover"
    />
    <h1 class="text-3xl font-bold mb-4">{{ fullName(member) }}</h1>
    <p class="text-base leading-relaxed whitespace-pre-line">{{ member.bio }}</p>
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

const route = useRoute()
const member = ref({})

const fullName = (m) => `${m.first_name} ${m.last_name}`
const getImageUrl = (photo) =>
  photo ? `https://api.newradio.md/assets/${photo}` : '/default_avatar.jpg'

onMounted(async () => {
  const res = await fetch(`https://api.newradio.md/items/team/${route.params.id}`)
  const data = await res.json()
  member.value = data.data
})
</script>
