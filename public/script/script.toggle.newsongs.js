const toggleBtn = document.getElementById("toggle-new-songs");
let expanded = false;

toggleBtn.addEventListener("click", () => {
  document.querySelectorAll(".new-song.hidden, .new-song.shown").forEach(el => {
    if (expanded) {
      el.classList.add("hidden");
      el.classList.remove("shown");
    } else {
      el.classList.remove("hidden");
      el.classList.add("shown");
    }
  });

  toggleBtn.textContent = expanded ? "ПОКАЗАТЬ ВСЕ" : "СКРЫТЬ";
  expanded = !expanded;
});