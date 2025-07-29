<template>
  <div class="geo-frequency">
    <span style="font-size: 15px;" v-if="loading">Определяем <br> частоту...</span>
    <span v-else><div class="city">{{ city }}</div>
        <div class="frequency">{{ frequency }}</div></span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const city = ref('КИШИНЁВ')
const frequency = ref('103.7 FM')

const cityData = {
  'КИШИНЁВ': { lat: 47.0105, lon: 28.8638, radius: 20, freq: '103.7 FM' },
  'БЕЛЬЦЫ':   { lat: 47.7536, lon: 27.9189, radius: 20, freq: '106.2 FM' },
  'УНГЕНЫ':   { lat: 47.2103, lon: 27.7986, radius: 15, freq: '92.3 FM' },
  'КАУШАНЫ':  { lat: 46.6434, lon: 29.4106, radius: 15, freq: '103.0 FM' }
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function checkLocation(lat, lon) {
  for (const [name, data] of Object.entries(cityData)) {
    const dist = getDistance(lat, lon, data.lat, data.lon)
    if (dist < data.radius) {
      city.value = name
      frequency.value = data.freq
      return
    }
  }

  // fallback — Кишинёв
  city.value = 'Кишинёв'
  frequency.value = '103.7 FM'
}

onMounted(() => {
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      checkLocation(coords.latitude, coords.longitude)
      loading.value = false
    },
    () => {
      // отказ или ошибка — по умолчанию Кишинёв
      city.value = 'Кишинёв'
      frequency.value = '103.7 FM'
      loading.value = false
    }
  )
})
</script>

<style scoped>
.geo-frequency {
  display: flex;
  flex-direction: column;
  text-align: left;
  justify-content: flex-start;
  position: relative;
  font-size: 1.1rem;
  color: white;
  max-width: 100px;
  overflow: hidden;
  letter-spacing: -1;  
}

.city {
 position: relative;
 margin-bottom: -5px;
}

.frequency {
 position: relative;
 font-weight: 600;
 width: 100px;
}

</style>
