<script setup lang="ts">
import Main_containter_default from '~/components/main_containter_default.vue';
import Main_newsongs_top_container from '~/components/main_newsongs_top_container.vue';
import main_news_container from '~/components/main_news_container.vue';
import Main_team_grid from '~/components/main_team_grid.vue';

</script>

<template>
    <div class="flex flex-col">
        <Main_containter_default />
        <Main_newsongs_top_container />
        <main_news_container />
        <Main_team_grid />
    </div>
</template>

