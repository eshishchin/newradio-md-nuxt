<template>
  <div>
    <div class="absolute top-0 left-0 w-full h-full z-10">
      <div
        v-for="(star, index) in stars"
        :key="'star-' + index"
        class="absolute w-[2px] h-[2px] rounded-full bg-white animate-[twinkle_2s_infinite_alternate_ease-in-out]"
        :style="{
          top: star.top,
          left: star.left,
          animationDuration: star.duration
        }"
      ></div>
    </div>

    <div class="absolute top-0 left-0 w-full h-full z-10">
      <div
        v-for="(planet, index) in planets"
        :key="'planet-' + index"
        class="absolute rounded-full opacity-90 animate-[float_8s_infinite_alternate_ease-in-out]"
        :style="{
          top: planet.top,
          left: planet.left,
          width: planet.size,
          height: planet.size,
          animationDuration: planet.duration,
          background: 'radial-gradient(circle at 30% 30%, #8906bd, #100026)'
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stars = ref([])
const planets = ref([])

onMounted(() => {
  stars.value = Array.from({ length: 150 }, () => ({
    top: `${Math.random() * 100}vh`,
    left: `${Math.random() * 100}vw`,
    duration: `${Math.random() * 2 + 1}s`
  }))

  planets.value = Array.from({ length: 5 }, () => {
    const size = `${Math.random() * 50 + 40}px`

    // избегаем центра: центр от 40% до 60% экрана
    let top, left
    do {
      top = Math.random() * 100
      left = Math.random() * 100
    } while (top > 40 && top < 60 && left > 40 && left < 60)

    return {
      top: `${top}vh`,
      left: `${left}vw`,
      size,
      duration: `${Math.random() * 6 + 6}s`
    }
  })
})
</script>

<style scoped>
@keyframes twinkle {
  0% {
    opacity: 0.3;
    transform: scale(1);
  }
  100% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes float {
  0% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(10px);
  }
}
</style>
