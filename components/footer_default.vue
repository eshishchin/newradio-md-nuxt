<template>
  <footer class="bg-[#6601a1] flex flex-col px-12 py-8 gap-10 relative text-white">
    <!-- 🔼 Верхняя часть — колонки -->
    <div class="flex flex-wrap px-50 justify-between gap-5 text-[1.1rem] font-regular opacity-70">
      <div
        v-for="(links, key) in footerLinks"
        :key="key"
        class="flex flex-col gap-2 min-w-[140px]"
      >
        <div class="text-2xl font-bold text-white mb-1">{{ sectionLabels[key] || key }}</div>
        <NuxtLink
          v-for="item in links"
          :key="item.id"
          :to="`/${item.slug}`"
          class="hover:text-[#ff2cc3] transition"
        >
          {{ item.title }}
        </NuxtLink>
      </div>
    </div>

    <!-- 🔽 Нижняя часть — логотипы, подпись, кнопка -->
    <div class="mt-8 pt-6 border-t border-[#ffffff33] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-sm opacity-50">
      <div class="flex flex-row gap-[15px] items-center">
        <img src="/logo_new.svg" alt="Логотип" class="w-[80px] h-auto" />
        <img src="/logo_pd.svg" alt="Логотип" class="w-[80px] h-auto" />
      </div>

      <div class="font-sans max-w-[250px]">
        “Radio Poli Disc - Новое Радио"<br />
        &copy; 2025 "Radio Pol Disc"
      </div>

      <div class="relative flex items-center" @mouseleave="open = false">
        <button class="bg-[#420574] text-white border-none px-[20px] py-[10px] text-[14px] font-medium rounded" @click="toggleDropdown">
          REPORT
        </button>
        <div v-if="open" class="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white min-w-[160px] shadow-lg z-20 rounded">
          <a
            v-for="report in reports"
            :key="report.id"
            :href="`${apiBase}/assets/${report.report}`"
            target="_blank"
            download
            class="block text-black px-[16px] py-[12px] no-underline hover:bg-[#ddd] rounded"
          >
            {{ report.Report_Name || "Скачать отчёт" }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterReports',
  data() {
    return {
      reports: [],
      footerLinks: {},
      open: false,
      apiBase: 'https://api.newradio.md',
      sectionLabels: {
        radio: 'Радио',
        news: 'Новости',
        chart: 'Чарты',
        artists: 'Артисты',
        contacts: 'Контакты'
      }
    };
  },
  methods: {
    toggleDropdown() {
      this.open = !this.open;
    }
  },
  async mounted() {
    // Загрузка отчётов
    try {
      const res = await fetch(`${this.apiBase}/items/reports?filter[status][_eq]=published`);
      const data = await res.json();
      this.reports = data.data;
    } catch (err) {
      console.error("Ошибка загрузки отчётов:", err);
    }

    // Загрузка ссылок футера
    try {
      const res = await fetch(
        `${this.apiBase}/items/content_blocks?filter[show_in_footer][_eq]=true&filter[footer_section][_in]=radio,news,chart,artists,contacts&filter[status][_eq]=published`
      );
      const data = await res.json();
      const grouped = {};

      for (const item of data.data) {
        const section = item.footer_section;
        if (!grouped[section]) grouped[section] = [];
        grouped[section].push(item);
      }

      this.footerLinks = grouped;
    } catch (err) {
      console.error("Ошибка загрузки футер-меню:", err);
    }
  }
}
</script>

<style scoped>
/* Можно добавить медиа-адаптив под маленькие экраны при желании */
</style>
