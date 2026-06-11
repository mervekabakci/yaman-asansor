export function initTab() {
  document.querySelectorAll(".tab-nav").forEach((tabNav) => {
    const container = tabNav.querySelector(".full-container");
    const isResponsive = tabNav.classList.contains("js-responsive-tabs");

    if (!container) return;

    /* ===========================
       TAB CLICK (STANDART SİSTEM)
       → HİÇ BOZULMUYOR
    =========================== */
    function openCity(e) {
      const btn = e.currentTarget;
      const tabId = btn.getAttribute("tab-content-id");
      if (!tabId) return;

      document.querySelectorAll(".tabContent").forEach((content) => {
        content.style.display = "none";
      });

      const tabContentEl = document.querySelector(
        `.tabContent[tab-id="${tabId}"]`,
      );

      if (tabContentEl) {
        tabContentEl.style.display = "block";
      }

      tabNav.querySelectorAll(".tabLinks").forEach((b) => {
        b.classList.remove("active");
      });

      btn.classList.add("active");

      // responsive ise dropdown kapat
      const moreWrapper = tabNav.querySelector(".tab-more");
      if (moreWrapper) moreWrapper.classList.remove("open");
    }

    /* ===========================
       STANDART TAB BIND
    =========================== */
    function bindTabEvents(scope = tabNav) {
      scope.querySelectorAll(".tabLinks:not(.more-btn)").forEach((btn) => {
        btn.removeEventListener("click", openCity);
        btn.addEventListener("click", openCity);
      });
    }

    bindTabEvents();

    /* =====================================================
    RESPONSIVE TAB (SADECE js-responsive-tabs İSE)
    ===================================================== */
    if (!isResponsive) return;

    /* ---------- TAB-MORE OLUŞTUR ---------- */
    let moreWrapper = tabNav.querySelector(".tab-more");

    if (!moreWrapper) {
      moreWrapper = document.createElement("div");
      moreWrapper.className = "tab-more";

      const moreBtn = document.createElement("button");
      moreBtn.className = "tabLinks more-btn";
      moreBtn.innerHTML =
        '<img class="filter-grayscale" width="24" src="public/assets/img/statics/icons/dots.svg" alt="">';

      const moreMenu = document.createElement("div");
      moreMenu.className = "more-menu";

      moreWrapper.appendChild(moreBtn);
      moreWrapper.appendChild(moreMenu);
      tabNav.appendChild(moreWrapper);

      moreBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        moreWrapper.classList.toggle("open");
      });
    }

    const moreMenu = moreWrapper.querySelector(".more-menu");

    /* ---------- OVERFLOW HESABI ---------- */
    function updateTabs() {
      const navWidth = tabNav.clientWidth;

      const allTabs = Array.from(
        tabNav.querySelectorAll(".tabLinks:not(.more-btn)"),
      );

      const otherLinks = Array.from(container.querySelectorAll(".otherLinks"));

      // reset
      allTabs.forEach((btn) => container.appendChild(btn));
      moreMenu.innerHTML = "";
      moreWrapper.style.display = "none";

      const gap = parseInt(getComputedStyle(container).gap || 0, 10);

      let usedWidth = 0;

      /* ---------------------------
     SABİT ELEMANLAR (otherLinks)
  --------------------------- */
      otherLinks.forEach((el, index) => {
        usedWidth += el.offsetWidth;
        if (index > 0) usedWidth += gap;
      });

      /* ---------------------------
     TABLAR (taşınabilir)
  --------------------------- */
      allTabs.forEach((btn, index) => {
        const btnWidth = btn.offsetWidth;
        usedWidth += btnWidth;
        if (index > 0 || otherLinks.length > 0) usedWidth += gap;

        const moreWidth = moreWrapper.offsetWidth || 60;

        if (usedWidth + moreWidth > navWidth) {
          moreMenu.appendChild(btn);
          moreWrapper.style.display = "block";
        }
      });

      bindTabEvents(tabNav);
    }

    updateTabs();
    window.addEventListener("resize", updateTabs);

    /* ---------- DIŞARI TIKLAYINCA KAPAT ---------- */
    document.addEventListener("click", (e) => {
      if (!moreWrapper.classList.contains("open")) return;
      if (!e.target.closest(".tab-more")) {
        moreWrapper.classList.remove("open");
      }
    });
  });
}
