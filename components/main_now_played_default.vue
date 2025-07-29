<template>
<div class="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-50">

  
  <div class="flex bg-[#3e0c83] border-[2px] border-[#6c02e6] shadow-[0_0_10px_#6c02e6] rounded-[12px] items-center justify-center relative w-full mb-10 gap-[2vh] overflow-hidden px-10 py-5">
      <NuxtLink
    to="/playlist"
    class="block w-60 text-left text-[1.3rem] font-light text-white text-shadow-[0_0_2px_#6c02e6] rounded-md transition-colors duration-200 hover:text-[#ff2cc3] hover:[text-shadow:0_0_5px_#ff2cc379,0_0_10px_#ff2cc375]">
    Ранее в эфире
  </NuxtLink>
    <button class="bg-transparent border-none text-white text-[2rem] relative z-[1] transition hover:text-[#ff2cc3] hover:[text-shadow:0_0_5px_#ff2cc379,0_0_10px_#ff2cc375]" @click="scrollLeft">‹</button>

    <div class="flex gap-5 overflow-x-hidden scroll-smooth" ref="scrollContainer">
      <template v-if="tracks.length">
        <div
          v-for="track in tracks"
          :key="track.code"
          class="flex items-center gap-3 bg-[#250650] border-[2px] border-[#6c02e6] shadow-[0_0_10px_#6c02e6] rounded-[12px] px-4 py-2 min-w-70 max-w-90 h-[90px] cursor-pointer transition-colors hover:bg-[#480b9e] mb-2 mt-2 ml-2"
        >
          <img :src="getImageUrl(track.cover)" class="w-[56px] h-[56px] rounded-[12px] object-cover shrink-0" />
          <div class="flex flex-col justify-center grow overflow-hidden text-left">
            <div class="font-bold text-white text-[0.95em] truncate">{{ track.artist }}</div>
            <div class="text-[#cccccc] text-[0.85em] truncate">{{ track.title }}</div>
            <div v-if="track.played_at" class="text-[#888888] text-[0.8em] opacity-90">
              {{ formatTime(track.played_at) }}
            </div>
          </div>
        </div>
      </template>
    </div>

    <button class="bg-transparent border-none text-white text-[2rem] relative z-[1] transition hover:text-[#ff2cc3] hover:[text-shadow:0_0_5px_#ff2cc379,0_0_10px_#ff2cc375]" @click="scrollRight">›</button>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const scrollContainer = ref(null);
const tracks = ref([]);

const scrollIndex = ref(0);
const visibleCount = 4;
const cardWidth = 425 + 12; // ширина + gap

function getImageUrl(id) {
  return `https://api.newradio.md/assets/${id}`;
}

function formatTime(datetimeStr) {
  if (!datetimeStr) return '';
  const date = new Date(datetimeStr);
  if (isNaN(date)) return '';
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Chisinau',
  });
}

function updateScroll() {
  if (!scrollContainer.value) {
    console.warn('⛔ scrollContainer is null');
    return;
  }

  const offset = scrollIndex.value * cardWidth;
  scrollContainer.value.scrollTo({
    left: offset,
    behavior: 'smooth'
  });
}

function scrollRight() {
  if (scrollIndex.value < tracks.value.length - visibleCount) {
    scrollIndex.value += 1;
    updateScroll();
  }
}

function scrollLeft() {
  if (scrollIndex.value > 0) {
    scrollIndex.value -= 1;
    updateScroll();
  }
}

async function fetchTracks() {
  const nowRes = await fetch('https://api.newradio.md/items/now_playing?sort=-played_at&limit=10&fields=code,played_at&filter[code][_neq]=placeholder&filter[status][_eq]=published');
  const nowJson = await nowRes.json();
  const entries = nowJson.data?.filter(e => e.code !== 'placeholder') || [];
  const codes = entries.map(e => e.code);

  if (!codes.length) return;

  const filterString = codes.map(code => `filter[code][_in][]=${encodeURIComponent(code)}`).join('&');
  const musicRes = await fetch(`https://api.newradio.md/items/music_base?${filterString}&fields=code,artist,title,cover`);
  const musicJson = await musicRes.json();

  const newTracks = entries.map(entry => {
    const match = musicJson.data.find(t => t.code === entry.code);
    if (!match) return null;
    return {
      ...match,
      played_at: entry.played_at
    };
  }).filter(Boolean);

  tracks.value = newTracks;
  scrollIndex.value = 0;
  await nextTick();
  setTimeout(() => updateScroll(), 50);
}

async function watchUpdates() {
  const nowRes = await fetch('https://api.newradio.md/items/now_playing?sort=-played_at&limit=1&fields=code,played_at&filter[code][_neq]=placeholder&filter[status][_eq]=published');
  const nowJson = await nowRes.json();
  const entry = nowJson.data?.[0];
  if (!entry || entry.code === 'placeholder' || tracks.value.find(t => t.code === entry.code)) return;

  const musicRes = await fetch(`https://api.newradio.md/items/music_base?filter[code][_eq]=${encodeURIComponent(entry.code)}&fields=code,artist,title,cover`);
  const musicJson = await musicRes.json();
  const track = musicJson.data?.[0];

  if (track) {
    tracks.value.unshift({
      ...track,
      played_at: entry.played_at
    });

    if (tracks.value.length > 10) {
      tracks.value.pop();
    }

    scrollIndex.value = 0;
    await nextTick();
    updateScroll();
  }
}

onMounted(() => {
  fetchTracks();
  setInterval(watchUpdates, 60000); // обновление каждую минуту
});
</script>

