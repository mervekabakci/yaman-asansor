export function InitAccordion() {
  const header = document.querySelector("header");

  document.querySelectorAll(".accordion-scroll details").forEach((detail) => {
    detail.addEventListener("toggle", function () {
      if (!this.open) return;

      setTimeout(() => {
        this.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 160);
    });
  });
}
