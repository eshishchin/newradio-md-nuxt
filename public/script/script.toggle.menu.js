const dropdown = document.getElementById("dropdown");
const toggle = document.getElementById("dropdown-toggle");

toggle.addEventListener("click", () => {
  dropdown.classList.toggle("active");
});