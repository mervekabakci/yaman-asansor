import { initDialog } from "./init/dialog.js";
import { initFormValidation } from "./init/form-validate.js";
import { InitFloatingLabels } from "./init/floating-label.js";
import { initTab } from "./init/tab.js";
import { initPageScroll } from "./init/page-scroll.js";
import { initDropdown } from "./init/dropdown.js";
import { InitFileInput } from "./init/input-file.js";
import { InitGalleryUpload } from "./init/gallery-upload.js";
import { InitAccordion } from "./init/accordion.js";
import { initOffcanvas } from "./init/offcanvas.js";
import { initStickyElements } from "./init/sticky-element.js";

document.addEventListener("DOMContentLoaded", function () {
  let SwalDefault = null;

  if (typeof Swal !== "undefined") {
    SwalDefault = Swal.mixin({
      customClass: {
        confirmButton: "swal-confirm",
        cancelButton: "swal-cancel",
        denyButton: "swal-deny",
      },
      buttonsStyling: false,
    });
  }

  // tooltip
  document.querySelectorAll(".toolTipButton").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      console.log("Tooltip: " + btn.dataset.tooltip);
    });
  });

  const toggleBtn = document.querySelector(".profileMenuWrap .menuToggle");
  const menuList = document.querySelector(".profileMenuWrap .menuList");

  if (toggleBtn && menuList) {
    toggleBtn.addEventListener("click", () => {
      menuList.classList.toggle("active");
      toggleBtn.classList.toggle("active");
    });
  }
  const basketToggle = document.querySelector(".mobileBasketToggle");
  const basketAccordion = document.querySelector(".basketAccordion");

  if (basketToggle && basketAccordion) {
    basketToggle.addEventListener("click", () => {
      basketToggle.classList.toggle("active");
      basketAccordion.classList.toggle("active");
    });
  }

  initDialog();
  //initFormValidation();
  initTab();
  initPageScroll();
  initDropdown();
  InitFileInput();
  InitGalleryUpload();
  InitAccordion();
  initOffcanvas();

  initStickyElements({
    containerSelector: ".js-sticky-container",
    stickySelector: ".js-sticky",
    headerSelector: "header",
    offset: 16,
    headerHideOffset: 100,
  });

  // setInterval(() => {
  //   console.log("[CHECK BODY]", {
  //     position: getComputedStyle(document.body).position,
  //     top: getComputedStyle(document.body).top,
  //     scrollY: window.scrollY,
  //   });
  // }, 1000);

  // preloader kaldır
  window.addEventListener("load", function () {
    const preloader = document.querySelector(".preloader");
    preloader?.remove();
  });

  /* --------------------------------------------------
     SEARCH BUTTON
  -------------------------------------------------- */
  const mobileSearchButton = document.querySelector(".searchButton");

  if (mobileSearchButton) {
    mobileSearchButton.addEventListener("click", function (e) {
      e.preventDefault();

      const header = document.querySelector("header");
      const menu = document.querySelector(".menuWrap");
      const menuButton = document.querySelector(".navbarMenuButton");
      const body = document.body;
      const searchWrap = document.querySelector(".mobileSearchWrap");
      const main = document.querySelector("main");

      // menu açıksa kapat
      if (menu?.classList.contains("show")) {
        menu.classList.remove("show");
        menuButton?.classList.remove("active");
        // body.classList.remove("is-scroll-locked");
        unlockScroll();
        header?.classList.remove("menu-open");
        menuButton?.setAttribute("aria-expanded", "false");
      }

      // search toggle
      searchWrap?.classList.toggle("active");
      header?.classList.toggle("search-open");
      main?.classList.toggle("search-open");
    });
  }

  /* --------------------------------------------------
     MOBILE MENU
  -------------------------------------------------- */
  function handleDropdownLinks() {
    const menuButton = document.querySelector(".navbarMenuButton");
    const header = document.querySelector("header");
    const menu = document.querySelector(".menuWrap");
    const body = document.body;

    if (!menuButton || !menu) return;

    menuButton.setAttribute("aria-expanded", "false");

    menuButton.addEventListener("click", function () {
      const mobileSearch = document.querySelector(".mobileSearchWrap");
      const main = document.querySelector("main");

      const isActive = this.classList.toggle("active");
      menu.classList.toggle("show");
      // body.classList.toggle("is-scroll-locked");
      if (isActive) {
        lockScroll();
      } else {
        unlockScroll();
      }

      header?.classList.toggle("menu-open", isActive);
      this.setAttribute("aria-expanded", isActive ? "true" : "false");

      // menu açılırken search kapat
      if (isActive) {
        mobileSearch?.classList.remove("active");
        header?.classList.remove("search-open");
        main?.classList.remove("search-open");
      }
    });

    // dropdown linkler
    const menuDropDownLinks = document.querySelectorAll(".dropdown-menu-link");

    menuDropDownLinks.forEach((item) => {
      const dropdownContent = item.nextElementSibling;
      item.setAttribute("aria-expanded", "false");

      item.addEventListener("click", function () {
        const isActive = this.classList.toggle("active");
        this.parentElement.classList.toggle("active");
        dropdownContent?.classList.toggle("active");

        this.setAttribute("aria-expanded", isActive ? "true" : "false");
      });
    });
  }

  handleDropdownLinks();

  /* --------------------------------------------------
     SCROLL → SEARCH KAPAT
  -------------------------------------------------- */
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    // console.log("[SCROLL]", window.scrollY);
    const mobileSearch = document.querySelector(".mobileSearchWrap");
    const header = document.querySelector("header");
    const main = document.querySelector("main");

    if (!mobileSearch) return;

    // micro scroll ignore
    if (Math.abs(window.scrollY - lastScrollY) < 5) return;
    lastScrollY = window.scrollY;

    if (mobileSearch.classList.contains("active")) {
      mobileSearch.classList.remove("active");
      header?.classList.remove("search-open");
      main?.classList.remove("search-open");
    }
  });

  document.querySelectorAll(".toolTipButton").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      // İsteğe bağlı ek JS işlemleri
      console.log("Tooltip: " + btn.dataset.tooltip);
    });
  });
});

// /* --------------------------------------------------
//    AOS
// -------------------------------------------------- */
// AOS.init({
//   once: true,
// });

/* --------------------------------------------------
   FANCYBOX
-------------------------------------------------- */
if (typeof Fancybox !== "undefined") {
  Fancybox.bind("[data-fancybox]", {
    compact: false,
    Carousel: {},
    Thumbs: false,
    Toolbar: {
      display: {
        left: [],
        middle: [],
        right: ["close"],
      },
    },
  });

  Fancybox.bind(".galleryItem", {
    compact: false,
    Carousel: {},
    Toolbar: {
      display: {
        left: [],
        middle: [],
        right: ["close"],
      },
    },
  });
}

/* --------------------------------------------------
   NICE SELECT
-------------------------------------------------- */
$(function () {
  if ($(".customSelect").length) {
    $(".customSelect").niceSelect();
  }
  document.querySelectorAll(".nice-select").forEach((select) => {
    const original = select.previousElementSibling;
    if (original && original.value === "") {
      const current = select.querySelector(".current");
      if (current) current.textContent = "";
    }
  });
  InitFloatingLabels();
});

/* --------------------------------------------------
   LIQUID BUTTON
-------------------------------------------------- */
document.querySelectorAll(".button-liquid").forEach((btn) => {
  let leaveTimeout;

  btn.addEventListener("mouseenter", () => {
    clearTimeout(leaveTimeout);
    btn.classList.remove("is-leave");
    btn.classList.add("is-hover");
  });

  btn.addEventListener("mouseleave", () => {
    btn.classList.remove("is-hover");
    btn.classList.add("is-leave");

    leaveTimeout = setTimeout(() => {
      const fill = btn.querySelector(".btn-fill");
      if (!fill) return;

      fill.style.transition = "none";
      btn.classList.remove("is-leave");
      fill.offsetHeight;
      fill.style.transition = "transform 0.65s cubic-bezier(0.19, 1, 0.22, 1)";
    }, 650);
  });
});

const technicalButton = document.querySelector(".technicalButton");

if (technicalButton) {
  technicalButton.addEventListener("click", function (e) {
    e.preventDefault();

    const allDetails = document.querySelectorAll(
      ".productAccordion.accordion details",
    );

    let targetDetails = null;

    allDetails.forEach((detail) => {
      const title = detail.querySelector("summary span")?.textContent.trim();
      if (title === "Teknik Özellikler") {
        targetDetails = detail;
      }
    });

    if (!targetDetails) return;

    targetDetails.open = true;

    const yOffset = -120;
    const y =
      targetDetails.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });
  });
}

document.addEventListener("click", function (e) {
  const increaseBtn = e.target.closest(".qty-increase");
  const decreaseBtn = e.target.closest(".qty-decrease");

  if (increaseBtn || decreaseBtn) {
    const wrapper = e.target.closest(".quantityWrapper");
    const input = wrapper.querySelector(".qty-input");

    let currentValue = parseInt(input.value, 10);

    if (isNaN(currentValue) || currentValue < 1) {
      currentValue = 1;
    }

    if (increaseBtn) {
      input.value = currentValue + 1;
    }

    if (decreaseBtn && currentValue > 1) {
      input.value = currentValue - 1;
    }
  }

  const trigger = e.target.closest(".shareButtonsShow");
  if (!trigger) return;

  const wrapper = trigger.closest(".socialMediaShareBoxes");
  if (!wrapper) return;

  const list = wrapper.querySelector(".socialMediaList");

  wrapper.classList.toggle("is-open");
  list?.classList.toggle("is-open");
});

// SADECE RAKAM GİRİLSİN
document.addEventListener("input", function (e) {
  const input = e.target.closest(".qty-input");
  if (!input) return;

  // Rakam dışındaki her şeyi temizle
  input.value = input.value.replace(/\D/g, "");

  // Boş kalırsa 1 yap
  if (input.value === "" || parseInt(input.value, 10) < 1) {
    input.value = "1";
  }
});

/* --------------------------------------------------
   GLOBAL SCROLL LOCK (is-scroll-locked)
-------------------------------------------------- */

let scrollYPosition = 0;
let isLocked = false;

export function lockScroll() {
  // console.trace("[LOCK TRACE]");
  if (isLocked) return;
  isLocked = true;

  requestAnimationFrame(() => {
    scrollYPosition = window.scrollY;

    console.log("[LOCK]", scrollYPosition);

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYPosition}px`;
    document.body.style.width = "100%";

    document.body.classList.add("is-scroll-locked");
  });
}

export function unlockScroll() {
  if (!isLocked) return;
  isLocked = false;

  // console.log("[UNLOCK]", scrollYPosition);

  document.body.classList.remove("is-scroll-locked");

  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";

  window.scrollTo(0, scrollYPosition);
}

//Button Loading
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".loadMoreButton");
  if (!btn) return;

  e.preventDefault();

  btn.classList.add("loading");

  // burada normalde ajax veya fetch olacak
  setTimeout(() => {
    // data yüklendiğinde loader kaldır
    btn.classList.remove("loading");
  }, 1500);
});
function checkTableScroll(wrapper) {
  const table = wrapper.querySelector("table");
  if (!table) return;

  if (table.scrollWidth > wrapper.clientWidth) {
    wrapper.classList.add("scroll");
  } else {
    wrapper.classList.remove("scroll");
  }
}

function checkAllTables() {
  document.querySelectorAll(".table-responsive").forEach((wrapper) => {
    checkTableScroll(wrapper);
  });
}
// sayfa yüklenince
document.addEventListener("DOMContentLoaded", checkAllTables);

// resize olunca tekrar kontrol
window.addEventListener("resize", checkAllTables);

function initTableScroll(table) {
  const wrapper = table.closest(".table-responsive");

  if (!wrapper) return;

  // ilk kontrol
  checkTableScroll(wrapper);

  // resize kontrolü
  window.addEventListener("resize", () => checkTableScroll(wrapper));
}

document.querySelectorAll(".customSlideCards .card").forEach((card) => {
  const images = Array.from(card.querySelectorAll(".imageWrapper img"));

  if (!images.length) return;

  const colorButtonsWrapper = card.querySelector(".colorButtons");

  // colorButtons yoksa sadece ilk görseli aktif yap ve çık
  if (!colorButtonsWrapper) {
    images.forEach((img, i) => {
      img.classList.toggle("active", i === 0);
    });
    return;
  }

  const buttons = Array.from(colorButtonsWrapper.querySelectorAll("div"));

  let currentIndex = 0;

  function syncButtons(index) {
    buttons.forEach((btn, i) => {
      btn.classList.toggle("active", i === index);
    });
  }

  function goToSlide(index) {
    // güvenlik
    if (index >= images.length) return;

    images.forEach((img, i) => {
      img.classList.toggle("active", i === index);
    });

    syncButtons(index);

    currentIndex = index;
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      goToSlide(index);
    });
  });

  // başlangıç aktif itemi bul
  const activeButtonIndex = buttons.findIndex((btn) =>
    btn.classList.contains("active"),
  );

  goToSlide(activeButtonIndex >= 0 ? activeButtonIndex : 0);
});
