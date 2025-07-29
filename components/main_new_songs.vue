<template>
  <div class="w-full">

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="(song, index) in songs.slice(0, 6)"
        :key="index"
        class="flex items-center gap-3 bg-[#2e0863] border-[2px] border-[#6c02e6] shadow-[0_0_10px_#6c02e6] rounded-[12px] p-3 hover:bg-[#480b9e] cursor-pointer relative group"
        @click="toggleDemo(song.demo)"
        :class="{ 'shadow-[0_0_20px_#d400ff]': currentDemo === `${API_BASE}/assets/${song.demo}` }"
      >
        <div class="relative">
          <img
            :src="`${API_BASE}/assets/${song.cover}`"
            :alt="song.title"
            class="w-[100px] h-[100px] rounded-[12px] object-cover shrink-0 mr-3"
          />
          <div
            v-if="song.demo"
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            :class="{
              'opacity-100': currentDemo === `${API_BASE}/assets/${song.demo}`,
              'opacity-0 group-hover:opacity-100': currentDemo !== `${API_BASE}/assets/${song.demo}`
            }"
          >
            <svg
              v-if="currentDemo !== `${API_BASE}/assets/${song.demo}`"
              class="w-10 h-10 fill-white"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg
              v-else
              class="w-10 h-10 fill-white"
              viewBox="0 0 24 24"
            >
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </div>
        </div>
        <div class="flex flex-col text-left overflow-hidden">
          <div class="font-bold text-white text-md truncate">{{ song.artist }}</div>
          <div class="text-white text-sm truncate">{{ song.title }}</div>
        </div>
      </div>
    </div>

    <audio ref="demoPlayer" id="demo-player" @ended="onDemoEnded" />
      <NuxtLink
      to="/newsongs"
      class="text-left">
      Посмотреть все
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const scrollWrapper = ref(null)

function scrollLeft() {
  scrollWrapper.value?.scrollBy({ left: -480, behavior: 'smooth' })
}

function scrollRight() {
  scrollWrapper.value?.scrollBy({ left: 480, behavior: 'smooth' })
}

const API_BASE = 'https://api.newradio.md';
const songs = ref([]);
const currentDemo = ref(null);

const demoPlayer = ref(null);

const fetchNewSongs = async () => {
  try {
    const res = await fetch(`${API_BASE}/items/new_songs?sort=-date_created&limit=8`);
    const newSongsData = await res.json();
    const codes = newSongsData.data.map(song => song.code);

    const songsData = await Promise.all(
      codes.map(async code => {
        const res = await fetch(`${API_BASE}/items/music_base?filter[code][_eq]=${code}`);
        const data = await res.json();
        return data.data[0];
      })
    );

    songs.value = songsData;
  } catch (err) {
    console.error('Ошибка загрузки новинок:', err);
  }
};

const toggleDemo = (demoPath) => {
  if (!demoPath) return;

  const url = `${API_BASE}/assets/${demoPath}`;
  const player = demoPlayer.value;

  const main = document.getElementById('audio');
  if (main && !main.paused) {
    main.pause();
    main.src = '';
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    if (playIcon && pauseIcon) {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
    }
  }

  if (!player) return;

  if (player.src !== url) {
    player.src = url;
    player.volume = 0.5;
    player.play();
    currentDemo.value = url;
  } else if (player.paused) {
    player.volume = 0.5;
    player.play();
    currentDemo.value = url;
  } else {
    player.pause();
    player.currentTime = 0;
    currentDemo.value = null;
  }
};

const onDemoEnded = () => {
  currentDemo.value = null;
};


onMounted(fetchNewSongs);
</script>
