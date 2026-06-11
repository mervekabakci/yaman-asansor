export function InitFloatingLabels() {
  const wrappers = document.querySelectorAll(".floating-label");

  wrappers.forEach((wrapper) => {
    const field = wrapper.querySelector("input, textarea, select");
    if (!field) return;

    function updateState() {
      if (field.value && field.value.trim() !== "") {
        wrapper.classList.add("filled");
      } else {
        wrapper.classList.remove("filled");
      }
    }

    // İlk yükleme
    updateState();

    // INPUT & TEXTAREA
    if (field.tagName === "INPUT" || field.tagName === "TEXTAREA") {
      field.addEventListener("focus", () => wrapper.classList.add("focused"));
      field.addEventListener("blur", () => wrapper.classList.remove("focused"));
      field.addEventListener("input", updateState);
    }

    // SELECT
    if (field.tagName === "SELECT") {
      // Native select için
      field.addEventListener("change", updateState);

      // 🔥 Nice Select için özel dinleme
      const nice = wrapper.querySelector(".nice-select");

      if (nice) {
        nice.addEventListener("click", function (e) {
          if (e.target.classList.contains("option")) {
            // küçük delay: nice-select value set ettikten sonra okunsun
            setTimeout(updateState, 0);
          }
        });
      }
    }
  });
}
