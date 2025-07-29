<template>
  <div class="hidden px-10 sm:flex items-center gap-8 lg:gap-12 xl:gap-18">
    <a
      v-for="item in links"
      :key="item.label"
      :href="item.url"
      target="_blank"
      rel="noopener"
      :aria-label="item.label"
      class="text-white text-[1.4rem] transition-colors duration-300 hover:text-[#ff2cc3] hover:[text-shadow:0_0_5px_#ff2cc379,0_0_10px_#ff2cc375]"
    >
      <i :class="item.icon" />
    </a>
  </div>
</template>

<script setup>
const links = [
  {
    label: 'Telegram',
    url: 'https://t.me/newradio_md',
    icon: 'fab fa-telegram-plane'
  },
  {
    label: 'Instagram',
    url: 'https://instagram.com/newradio_md',
    icon: 'fab fa-instagram'
  },
  {
    label: 'Facebook',
    url: 'https://facebook.com/newradiomd',
    icon: 'fab fa-facebook'
  }
]
</script>
