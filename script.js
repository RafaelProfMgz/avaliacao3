const menuToggle = document.getElementById("menuToggle");
const navList = document.querySelector(".nav-list");

menuToggle.addEventListener("click", () => {
  navList.classList.toggle("show");
});
