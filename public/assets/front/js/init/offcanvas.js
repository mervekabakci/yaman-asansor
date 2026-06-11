import { lockScroll, unlockScroll } from "../app.js";

export function initOffcanvas() {
    const body = document.body;

    const backdrop = document.createElement("div");
    backdrop.className = "offcanvas-backdrop";
    body.appendChild(backdrop);

    let activePanel = null;

    document.addEventListener("click", (e) => {
        const trigger = e.target.closest("[data-offcanvas]");
        if (!trigger) return;

        e.preventDefault();

        const id = trigger.getAttribute("data-offcanvas");
        const panel = document.getElementById(id);
        if (!panel) return;

        openOffcanvas(panel);
    });

    backdrop.addEventListener("click", () => {
        if (activePanel) closeOffcanvas(activePanel);
    });

    document.addEventListener("click", (e) => {
        const closeBtn = e.target.closest("[data-offcanvas-close]");
        if (!closeBtn) return;
        const id = closeBtn.getAttribute("data-offcanvas-close");
        const panel = id ? document.getElementById(id) : activePanel;
        if (panel) closeOffcanvas(panel);
    });


    document.addEventListener("click", (e) => {
        const closeBtn = e.target.closest(".offcanvas .closeBtn");
        if (!closeBtn) return;

        const panel = closeBtn.closest(".offcanvas");
        if (panel) closeOffcanvas(panel);
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && activePanel) {
            closeOffcanvas(activePanel);
        }
    });

    function openOffcanvas(panel) {
        if (activePanel === panel) return;

        if (activePanel) closeOffcanvas(activePanel);

        panel.classList.add("is-open");
        backdrop.classList.add("is-visible");

        lockScroll();

        activePanel = panel;
    }

    function closeOffcanvas(panel) {
        panel.classList.remove("is-open");
        backdrop.classList.remove("is-visible");

        unlockScroll();

        activePanel = null;
    }
}