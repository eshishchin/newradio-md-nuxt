const reportsMenu = document.getElementById("reports-menu");

async function loadReports() {
  try {
    const res = await fetch(`${API_BASE}/items/reports?filter[status][_eq]=published`);
    const data = await res.json();

    data.data.forEach(report => {
      const link = document.createElement("a");
      link.href = `${API_BASE}/assets/${report.report}`;
      link.download = "";
      link.target = "_blank";
      link.textContent = report.Report_Name || "Скачать отчёт";
      reportsMenu.appendChild(link);
    });

  } catch (err) {
    console.error("Ошибка загрузки отчётов:", err);
  }
}

loadReports();
