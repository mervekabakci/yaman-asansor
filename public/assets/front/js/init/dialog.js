import { lockScroll, unlockScroll } from "../app.js";

export function initDialog() {
    const allDialogs = document.querySelectorAll("dialog");

    allDialogs.forEach((dialog) => {
        if (dialog.dataset.dialogCloseBound) return;
        dialog.dataset.dialogCloseBound = "1";
        // Dışına tıklayınca kapatma
        dialog.addEventListener("click", (e) => {
            const rect = dialog.getBoundingClientRect();
            const isInDialog =
                e.clientX >= rect.left &&
                e.clientX <= rect.right &&
                e.clientY >= rect.top &&
                e.clientY <= rect.bottom;
            if (!isInDialog) {
                closeDialog(dialog);
            }
        });

        // X butonuna tıklama
        const closeBtn = dialog.querySelector(".closeBtn");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => closeDialog(dialog));
        }

        // data-dialog-close desteği
        const dataCloseButtons = dialog.querySelectorAll("[data-dialog-close]");
        if (dataCloseButtons.length) {
            dataCloseButtons.forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    e.preventDefault();
                    closeDialog(dialog);
                });
            });
        }
    });

    // Açma
    document.querySelectorAll("[data-dialog]").forEach((btn) => {
        if (btn.dataset.dialogBound) return; 
        btn.dataset.dialogBound = "1";      
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            const dialogId = btn.getAttribute("data-dialog");
            const dialog = document.getElementById(dialogId);
            if (dialog) {
                closeAllDialogs();
                dialog.showModal();
                // document.body.classList.add("overflow-hidden");
                lockScroll();

                // Sadece animasyon destekli dialog'lara class ekle
                if (dialog.classList.contains("dialog-animation")) {
                    requestAnimationFrame(() => {
                        dialog.classList.add("is-visible");
                    });
                }
            }
        });
    });

    // Kapanış helper (animasyonlu veya anında)
    function closeDialog(dialog) {
        // document.body.classList.remove("overflow-hidden");
        unlockScroll();

        // Eğer dialog animasyon destekliyorsa (has-animation varsa)
        if (dialog.classList.contains("dialog-animation")) {
            dialog.classList.remove("is-visible");
            setTimeout(() => {
                dialog.close();
            }, 300); // animasyon süresi
        } else {
            // Animasyonsuz dialog anında kapanır
            dialog.close();
        }
    }
    window.closeDialog = closeDialog;
    function closeAllDialogs() {
        document.querySelectorAll("dialog[open]").forEach((dialog) => {
            dialog.classList.remove("is-visible");
            dialog.close();
        });

        unlockScroll();
    }
}
window.initDialog = initDialog;
