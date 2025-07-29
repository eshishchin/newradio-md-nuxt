<script setup lang="ts">
import header_geo_freq from './header_geo_freq.vue';
import Header_now_playing from './header_now_playing.vue';
import header_logo_default from './header_logo_default.vue';
import radio_player_main from './radio_player_main.vue';
import Header_now_onair from './header_now_onair.vue';
import Header_menu_default from './header_menu_default.vue';
import Header_social_default from './header_social_default.vue';
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex fixed top-0 left-0 w-full z-50 flex-row bg-[#2e0863] border-[2px] border-[#6c02e6] shadow-[0_0_10px_#6c02e6] backdrop-blur-[5px] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-50 py-[20px]">
       <div class="flex justify-between w-full gap-4">
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <header_logo_default />
          <header_geo_freq />
        </div>
        <div class="flex flex-row gap-4">
          <radio_player_main />
          <Header_now_playing />
        </div>
        <Header_now_onair />
      </div>
    </div>
  <div class="flex flex-row justify-between w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-50 mt-40">
    <Header_menu_default />
    <Header_social_default />
  </div>
</div>
</template>