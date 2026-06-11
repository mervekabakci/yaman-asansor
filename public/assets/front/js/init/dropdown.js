export function initDropdown() {
  document.addEventListener("click", (e) => {
    const targetDropdown = e.target.closest(".dropdown-toggle");
    const clickedItem = e.target.closest(".dropdown-item, .dropdown-menu a");
    const allDropdowns = document.querySelectorAll(".dropdown");

    if (clickedItem) {
      const parentDropdown = clickedItem.closest(".dropdown");
      if (parentDropdown) parentDropdown.classList.remove("show");
      return;
    }

    allDropdowns.forEach((dropdown) => {
      if (!dropdown.contains(e.target)) dropdown.classList.remove("show");
    });

    if (targetDropdown) {
      const parent = targetDropdown.closest(".dropdown");
      parent.classList.toggle("show");
    }
  });
}
