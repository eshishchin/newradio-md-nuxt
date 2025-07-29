<template>
  <section class="text-center my-16 px-50">
    <h2 class="text-white text-[4rem] font-black text-left mb-10">Команда</h2>
    <div class="flex flex-wrap justify-center gap-8">
      <NuxtLink
        v-for="member in team"
        :key="member.id"
        :to="`/team/${member.id}`"
        class="flex flex-col items-center hover:scale-105 transition-transform"
      >
        <img
          :src="getImageUrl(member.photo)"
          :alt="fullName(member)"
          class="w-36 h-36 rounded-full border-4 border-white shadow-lg object-cover"
        />
        <div class="mt-3 text-white font-bold text-lg leading-tight text-center">
          {{ fullName(member) }}
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const team = ref([])

const getImageUrl = (photo) => {
  return photo
    ? `https://api.newradio.md/assets/${photo}`
    : '/default_avatar.jpg'
}

const fullName = (member) => `${member.first_name} ${member.last_name}`

onMounted(async () => {
  const res = await fetch('https://api.newradio.md/items/team')
  const data = await res.json()
  team.value = data.data
})
</script>
