<template>
  <div class="hidden px-6 lg:flex flex-row gap-[15px] items-top" v-if="dj">
    <img
      :src="dj.photo"
      alt="DJ Photo"
      class="w-[80px] h-[80px] rounded-lg border-[2px] border-[#16d951] shadow-[0_0_2px_rgba(27,233,89,0.815),0_0_10px_rgb(13,173,61)]"
    />
    <div class="text-left text-white w-[120px]">
      <div>
        <span class="text-[#16d951]" style="text-shadow: 0 0 2px rgba(27, 233, 89, 0.815), 0 0 10px rgb(13, 173, 61);">
          В эфире:
        </span>
      </div>
      {{ dj.name }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const dj = ref(null)

async function fetchNowOnAir() {
  const now = new Date()
  const weekday = now.getDay()
  const currentTime = now.toTimeString().slice(0, 5)

  const url = new URL('https://api.newradio.md/items/air_grid')
  const filter = {
    day: { _eq: weekday },
    start: { _lte: currentTime },
    end: { _gte: currentTime }
  }

  url.searchParams.append('filter', JSON.stringify(filter))
  url.searchParams.append('fields', 'title,cover.id')

  try {
    const res = await fetch(url.toString())
    const data = await res.json()

    if (data.data?.length > 0) {
      const entry = data.data[0]
      dj.value = {
        name: entry.title,
        photo: entry.cover?.id
          ? `https://api.newradio.md/assets/${entry.cover.id}`
          : null
      }
    }
  } catch (err) {
    console.error('Ошибка при получении ведущего:', err)
  }
}

onMounted(() => {
  fetchNowOnAir()

  // обновление раз в 10 минут
  setInterval(fetchNowOnAir, 10 * 60 * 1000)
})
</script>
