<template>
  <div class="flex items-center justify-center gap-4">
    <button
      @click="togglePlay"
      class="cursor-pointernp w-20 h-20 bg-[#ff2cc3] rounded-full flex items-center justify-center shadow-[0_0_10px_#ff2cc3,0_0_10px_#ff2cc3b4] hover:shadow-[0_0_10px_#ff2cc3,0_0_20px_#ff2cc3] transition"
    >
      <svg v-if="!isPlaying" class="w-[70%] h-[70%]" viewBox="0 0 100 100">
        <polygon points="40,30 70,50 40,70" fill="white" />
      </svg>
      <svg v-else class="w-[70%] h-[70%]" viewBox="0 0 100 100">
        <rect x="35" y="30" width="10" height="40" fill="white" />
        <rect x="55" y="30" width="10" height="40" fill="white" />
      </svg>
    </button>

    <div class="hidden sm:flex flex-col items-center">
      <input type="range" min="0" max="1" step="0.01" value="0.5" class="volume-slider" ref="volumeSlider" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Hls from 'hls.js'

const isPlaying = ref(false)
const volumeSlider = ref(null)
let audio = null
let hls = null

const togglePlay = async () => {
  try {
    if (!audio || audio.paused) {
      const currentVolume = parseFloat(volumeSlider.value?.value || 0.5)

      // Создаём и настраиваем <audio>
      audio = document.createElement('audio')
      audio.volume = currentVolume
      audio.controls = false
      audio.preload = 'none'

      if (Hls.isSupported()) {
        hls = new Hls()
        hls.loadSource('https://stream.newradio.md/hls/stream.m3u8')
        hls.attachMedia(audio)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          audio.play()
          isPlaying.value = true
        })
      } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
        audio.src = 'https://stream.newradio.md/hls/stream.m3u8'
        audio.addEventListener('loadedmetadata', () => {
          audio.play()
          isPlaying.value = true
        })
      } else {
        throw new Error('HLS не поддерживается')
      }
    } else {
      audio.pause()
      isPlaying.value = false
    }
  } catch (err) {
    console.error('Ошибка воспроизведения:', err)
  }
}

const updateSliderVisual = value => {
  const percent = value * 100
  volumeSlider.value.style.background = `linear-gradient(to top, #04fb27 0%, #04fb27 ${percent}%, #444 ${percent}%, #444 100%)`
}

onMounted(() => {
  const slider = volumeSlider.value
  updateSliderVisual(parseFloat(slider.value || 0.5))

  slider.addEventListener('input', () => {
    const value = parseFloat(slider.value)
    if (!isNaN(value) && audio) {
      audio.volume = value
      updateSliderVisual(value)
    }
  })
})
</script>

<style scoped>
.volume-slider {
  writing-mode: vertical-lr;
  direction: rtl;
  width: 5px;
  height: 70px;
  border-radius: 5px;
  outline: none;
  cursor: pointer;
  background: linear-gradient(to top, #04fb27 50%, #444 50%);
  -webkit-appearance: none;
  appearance: none;
}

.volume-slider::-webkit-slider-runnable-track {
  border-radius: 5px;
  height: 100%;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 12px;
  width: 12px;
  margin-top: -4px;
  border-radius: 50%;
  background: white;
  border: 2px solid #9100ff;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: white;
  border: 2px solid #9100ff;
  cursor: pointer;
}
</style>
