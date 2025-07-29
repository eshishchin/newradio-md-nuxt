<template>
  <div class="dropdown" @mouseleave="open = false">
    <button class="dropdown-button" @click="toggleDropdown">
      REPORT
    </button>
    <div class="dropdown-content" v-if="open">
      <a
        v-for="report in reports"
        :key="report.id"
        :href="`${apiBase}/assets/${report.report}`"
        target="_blank"
        download
      >
        {{ report.Report_Name || "Скачать отчёт" }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportsDropdown',
  data() {
    return {
      reports: [],
      open: false,
      apiBase: 'https://api.newradio.md' // замени на свой
    };
  },
  methods: {
    toggleDropdown() {
      this.open = !this.open;
    }
  },
  async mounted() {
    try {
      const res = await fetch(`${this.apiBase}/items/reports?filter[status][_eq]=published`);
      const data = await res.json();
      this.reports = data.data;
    } catch (err) {
      console.error("Ошибка загрузки отчётов:", err);
    }
  }
}
</script>

<style>
.reports-menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.reports-menu a {
  color: white;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.1);
  padding: 10px 15px;
  border-radius: 5px;
  transition: background 0.2s ease;
}
.reports-menu a:hover {
  background: rgba(255, 255, 255, 0.2);
}

.dropdown {
  display: flex;
  position: relative;
  align-items: center;
  opacity: 0.5;
}

.dropdown-button {
  background-color: #420574;
  color: white;
  border: none;
  min-width: 160px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  border-radius: 5px;
}

.dropdown-content {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  min-width: 160px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 2;
  border-radius: 5px;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #ddd;
  border-radius: 5px;
}

.dropdown.active .dropdown-content {
  display: block;
  border-radius: 5px;
}

.dropdown:hover {
  opacity: 1;
  border-radius: 5px;
}
</style>
