

<template>
  <div class="w-full mb-10">

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-127 gap-y-7">
      <div
        v-for="(song, index) in songs.slice(0, 6)"
        :key="index"
        class="group flex items-center gap-3 bg-white/30 backdrop-blur-md border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] rounded-[12px] min-w-120 max-w-150 h-30 cursor-pointer transition-colors hover:bg-[#9e0b97a2] py-15 px-5"
        @click="toggleDemo(song.demo)"
        :class="{ 'shadow-[0_0_20px_#d400ff]': currentDemo === `${API_BASE}/assets/${song.demo}` }"
      >
        <div class="relative">
          <div class="absolute -top-2 -left-2 bg-[#ff2cc3] text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
            {{ song.position }}
          </div>
          <img
            :src="`${API_BASE}/assets/${song.cover}`"
            :alt="song.title"
            class="w-20 h-20 rounded-[12px] object-cover shrink-0 mr-3"
          />
          <div
            v-if="song.demo"
            class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#00000071] mr-3 rounded-[12px]"
            :class="{
              'opacity-100': currentDemo === `${API_BASE}/assets/${song.demo}`,
              'opacity-0 group-hover:opacity-100 ': currentDemo !== `${API_BASE}/assets/${song.demo}`
            }"
          >
            <svg
              v-if="currentDemo !== `${API_BASE}/assets/${song.demo}`"
              class="w-10 h-10 fill-white "
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            <svg
              v-else
              class="w-10 h-10 fill-white "
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
      class="absolute right-0 block text-left text-[1.8em] text-[#ffffff96] font-semibold px-4 sm:px-6 md:px-8 lg:px-12 xl:px-50 -mb-4 rounded-md transition-colors duration-200 hover:text-[#ff2cc3] hover:[text-shadow:0_0_5px_#ff2cc379,0_0_10px_#ff2cc375] mt-10">
      Весь чарт
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
    const res = await fetch(`${API_BASE}/items/top_20?sort=position&limit=8`);
    const newSongsData = await res.json();
    const topData = newSongsData.data;

    const songsData = await Promise.all(
      topData.map(async (entry) => {
        const res = await fetch(`${API_BASE}/items/music_base?filter[code][_eq]=${entry.code}`);
        const data = await res.json();
        const song = data.data[0];
        return { ...song, position: entry.position };
      })
    );

    songs.value = songsData;
  } catch (err) {
    console.error('Ошибка загрузки новинок:', err);
  }
};

const toggleDemo = (demoPath) => {
  // Останавливаем HLS-плеер, если он запущен
  const hlsAudio = window.radioPlayer;
  if (hlsAudio && !hlsAudio.paused) {
    hlsAudio.pause();
    window.isRadioPlaying = false;
  }
  // Останавливаем demo, если включён радиоплеер из HLS
  if (window.audio && !window.audio.paused) {
    window.audio.pause();
    window.isPlaying = false;
  }

  if (!demoPath) return;

  const url = `${API_BASE}/assets/${demoPath}`;
  const player = demoPlayer.value;

  // Останавливаем основной онлайн-плеер
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

  // Останавливаем demo, если оно уже играет, иначе запускаем


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


onMounted(() => {
  window.radioPlayer = document.getElementById('audio');
  window.isRadioPlaying = false;
  fetchNewSongs();
});
</script>



