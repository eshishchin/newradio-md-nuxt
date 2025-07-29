<template>
  <section class="px-[13vw] py-10">
    <div class="flex flex-col items-start gap-3 mb-8">
      <div class="text-[30px] font-bold text-white tracking-wide">
        ПЛЕЙЛИСТ ЗА {{ selectedDate.toLocaleDateString('ru-RU') }} {{ selectedHour.toString().padStart(2, '0') }}:00
      </div>
      <div class="flex gap-3 items-center">
        <VueDatePicker
          v-model="selectedDate"
          :format="dateFormat"
          :enable-time-picker="false"
          :teleport="true"
          input-class-name="!bg-transparent !text-white !border-pink-500 !rounded px-3 py-2 text-base focus:!ring-pink-500"
        />

        <button @click="prevHour"
                class="bg-[#ff2cc3] text-white rounded px-4 py-2 text-base hover:bg-[#ff80db]">
          ‹
        </button>
        <span class="text-base w-[50px] text-center leading-[32px] text-white">{{ selectedHour.toString().padStart(2, '0') }}:00</span>
        <button @click="nextHour"
                class="bg-[#ff2cc3] text-white rounded px-4 py-2 text-base hover:bg-[#ff80db]">
          ›
        </button>
      </div>
    </div>

    <div class="flex flex-col flex-wrap gap-5">
      <div
        class="flex items-center gap-3 bg-[#250650] border-[2px] border-[#6c02e6] rounded-[12px] px-6 py-6 w-full max-w-[900px] h-[100px] shadow-sm hover:bg-[#480b9e] transition-all cursor-pointer"
        v-for="track in tracks" :key="track.code"
        @click="selectTrack(track)"
      >
        <img :src="getImageUrl(track.cover)" class="w-[56px] h-[56px] rounded-xl object-cover flex-shrink-0" />
        <div class="flex flex-col justify-center flex-grow overflow-hidden text-left">
          <div class="font-bold text-white text-[0.95em] truncate">{{ track.artist }}</div>
          <div class="text-[#cccccc] text-[0.85em] truncate">{{ track.title }}</div>
          <div class="text-sm opacity-90 text-white">{{ formatTime(track.played_at) }}</div>
        </div>
      </div>
    </div>

    <!-- Всплывающее окно для YouTube embed -->
    <div v-if="selectedYt" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div class="relative h-120 w-200 aspect-video">
        <iframe
          :src="`https://www.youtube.com/embed/${extractYtId(selectedYt)}`"
          class="w-full h-full rounded-xl border-4 border-pink-500"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        <button @click="selectedYt = null"
                class="absolute top-[-40px] right-0 text-white text-2xl px-3 py-1 hover:text-pink-400 cursor-pointer">
          ✕ Закрыть
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const tracks = ref([]);
const selectedHour = ref(new Date().getHours());
const selectedDate = ref(new Date());
const selectedYt = ref(null);

const dateFormat = (date) => {
  return date.toLocaleDateString('ru-RU');
};

watch(selectedHour, fetchPlaylist);
watch(selectedDate, fetchPlaylist);

function prevHour() {
  if (selectedHour.value === 0) {
    selectedHour.value = 23;
    selectedDate.value = new Date(selectedDate.value.getTime() - 24 * 60 * 60 * 1000);
  } else {
    selectedHour.value -= 1;
  }
  fetchPlaylist();
}

function nextHour() {
  if (selectedHour.value === 23) {
    selectedHour.value = 0;
    selectedDate.value = new Date(selectedDate.value.getTime() + 24 * 60 * 60 * 1000);
  } else {
    selectedHour.value += 1;
  }
  fetchPlaylist();
}

function getImageUrl(id) {
  return `https://api.newradio.md/assets/${id}`;
}

function formatTime(datetimeStr) {
  const date = new Date(datetimeStr);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getUtcISOStringFromLocal(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString();
}

function extractYtId(link) {
  const match = link?.match(/[?&]v=([^&#]+)/) || link?.match(/youtu\.be\/([^?]+)/);
  return match ? match[1] : null;
}

function selectTrack(track) {
  if (track.yt_link) selectedYt.value = track.yt_link;
}

async function fetchPlaylist() {
  const since = new Date(selectedDate.value);
  since.setHours(selectedHour.value, 0, 0, 0);
  const until = new Date(since);
  until.setHours(since.getHours() + 1);

  const sinceISO = getUtcISOStringFromLocal(since);
  const untilISO = getUtcISOStringFromLocal(until);

  const res = await fetch(
    `https://api.newradio.md/items/now_playing?sort=played_at&limit=100&fields=code,played_at&filter[played_at][_gte]=${sinceISO}&filter[played_at][_lt]=${untilISO}&filter[code][_neq]=placeholder&filter[status][_eq]=published`
  );
  const json = await res.json();
  const entries = json.data || [];
  const codes = entries.map(e => e.code);

  if (!codes.length) {
    tracks.value = [];
    return;
  }

  const filterString = codes.map(code => `filter[code][_in][]=${encodeURIComponent(code)}`).join('&');
  const musicRes = await fetch(`https://api.newradio.md/items/music_base?${filterString}&fields=code,artist,title,cover,yt_link`);
  const musicJson = await musicRes.json();

  tracks.value = entries.map(entry => {
    const match = musicJson.data.find(m => m.code === entry.code);
    if (!match) return null;
    return {
      ...match,
      played_at: entry.played_at
    };
  }).filter(Boolean);
}

onMounted(fetchPlaylist);
</script>

<style scoped>
@import '@vuepic/vue-datepicker/dist/main.css';
</style>
