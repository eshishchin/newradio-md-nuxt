<template>
  <div class="flex items-center gap-4 text-white">
    <div class="flex items-center gap-4" v-if="track">
      <img
        v-if="track.cover"
        :src="`https://api.newradio.md/assets/${track.cover}`"
        alt="cover"
        class="hidden sm:block w-[80px] h-[80px] object-cover rounded-lg border-[2px] border-[#ff2cc3] shadow-[0_0_1px_#ff2cc379,0_0_10px_#ff2cc375]"
      />
      <div class="leading-snug text-left">
        <div class="text-sm text-gray-300">Сейчас играет:</div>
        <div class="text-lg font-semibold">{{ track.artist }}</div>
        <div class="text-base text-gray-200">{{ track.title }}</div>
      </div>
    </div>
    <div v-else class="text-gray-400">Загрузка...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const track = ref(null)

async function getMetadata() {
  try {
    const nowPlayingRes = await fetch(
      'https://api.newradio.md/items/now_playing?sort=-played_at&limit=1&fields=artist,title,code'
    )
    const nowPlayingJson = await nowPlayingRes.json()
    const data = nowPlayingJson?.data?.[0]
    if (!data) return

    const coverRes = await fetch(
      `https://api.newradio.md/items/music_base?filter[code][_eq]=${data.code}&fields=cover`
    )
    const coverJson = await coverRes.json()
    const cover = coverJson.data?.[0]?.cover || null

    track.value = {
      artist: data.artist,
      title: data.title,
      cover
    }
  } catch (err) {
    console.error('Ошибка:', err)
    track.value = null
  }
}

onMounted(() => {
  getMetadata()
  setInterval(getMetadata, 10000)
})
</script>
