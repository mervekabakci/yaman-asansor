export function InitFileInput() {
  const wrappers = document.querySelectorAll(".custom-file-wrapper");

  /* ---------------- CONFIG ---------------- */

  const allowedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.rar",
    "application/x-rar-compressed",
  ];

  const fileIcons = {
    pdf: "pdf.svg",
    doc: "word.svg",
    docx: "word.svg",
    xls: "excel.svg",
    xlsx: "excel.svg",
    rar: "rar.svg",
    default: "files.svg",
  };

  function getFileExtension(fileName) {
    return fileName.split(".").pop().toLowerCase();
  }

  /* ---------------- INIT ---------------- */

  wrappers.forEach((wrapper) => {
    const input = wrapper.querySelector(".custom-file-input");
    const preview = wrapper.querySelector("img");
    const placeholder = wrapper.querySelector(".placeholder");
    const fileNameEl = wrapper.querySelector(".file-name");
    const removeBtn = wrapper.querySelector(".remove-btn");
    const fileListEl = wrapper.parentElement.querySelector(".file-list");

    const isPDF = wrapper.classList.contains("pdf");
    const isFiles = wrapper.classList.contains("files");
    const isMultiple = wrapper.classList.contains("multiple");

    const maxWidth = wrapper.dataset.width
      ? parseInt(wrapper.dataset.width)
      : null;
    const maxHeight = wrapper.dataset.height
      ? parseInt(wrapper.dataset.height)
      : null;

    /* ---------------- FILE CHANGE ---------------- */

    input.addEventListener("change", function () {
      const files = Array.from(this.files);
      if (!files.length) return;

      /* -------- FILES MULTIPLE -------- */
      if (isFiles && isMultiple) {
        files.forEach((file) => {
          if (!allowedFileTypes.includes(file.type)) {
            showAlert(`${file.name} desteklenmiyor.`);
            return;
          }
          appendFileItem(file);
        });

        input.value = ""; // tekrar seçim için şart
        return;
      }

      const file = files[0];

      /* -------- PDF -------- */
      if (isPDF) {
        if (file.type !== "application/pdf") {
          showAlert("Lütfen PDF formatında dosya yükleyin.");
          resetSingle();
          return;
        }
        renderSingleFile(file);
        return;
      }

      /* -------- FILES SINGLE -------- */
      if (isFiles) {
        if (!allowedFileTypes.includes(file.type)) {
          showAlert("Bu dosya formatı desteklenmiyor.");
          resetSingle();
          return;
        }
        renderSingleFile(file);
        return;
      }

      /* -------- IMAGE -------- */
      if (!file.type.startsWith("image/")) {
        showAlert("Lütfen bir görsel yükleyin.");
        resetSingle();
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = function () {
        if (maxWidth && maxHeight) {
          if (img.width !== maxWidth || img.height !== maxHeight) {
            showAlert(`Lütfen ${maxWidth}x${maxHeight} piksel ölçüsünde görsel yükleyin.`);
            resetSingle();
            return;
          }
        }

        preview.src = img.src;
        preview.style.display = "flex";
        placeholder.style.display = "none";

        fileNameEl.textContent = file.name;
        fileNameEl.style.display = "flex";
        removeBtn.style.display = "inline-flex";
      };
    });

    /* ---------------- WRAPPER CLICK ---------------- */

    wrapper.addEventListener("click", function () {
      if (!input.value) input.click();
    });

    /* ---------------- REMOVE (SINGLE) ---------------- */

    if (removeBtn) {
      removeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        resetSingle();
      });
    }

    /* ---------------- HELPERS ---------------- */

    function resetSingle() {
      input.value = "";

      if (preview) preview.style.display = "none";
      if (fileNameEl) {
        fileNameEl.innerHTML = "";
        fileNameEl.style.display = "none";
      }

      placeholder.style.display = "flex";
      if (removeBtn) removeBtn.style.display = "none";
    }

    function renderSingleFile(file) {
      if (preview) preview.style.display = "none";
      placeholder.style.display = "none";

      fileNameEl.innerHTML = "";

      const ext = getFileExtension(file.name);
      const iconFile = fileIcons[ext] || fileIcons.default;

      const icon = document.createElement("span");
      icon.className = "file-icon";
      icon.innerHTML = `<img src="public/assets/img/statics/icons/${iconFile}" alt="${ext}">`;

      const nameSpan = document.createElement("span");
      nameSpan.className = "file-filename line-clamp-2";
      nameSpan.textContent = file.name;

      fileNameEl.appendChild(icon);
      fileNameEl.appendChild(nameSpan);

      fileNameEl.style.display = "flex";
      if (removeBtn) removeBtn.style.display = "inline-flex";
    }

    /* -------- MULTIPLE LIST ITEM -------- */

    function appendFileItem(file) {
      const ext = getFileExtension(file.name);
      const iconFile = fileIcons[ext] || fileIcons.default;

      const li = document.createElement("li");
      li.className = "file-item";

      li.innerHTML = `
        <span class="file-icon">
          <img src="public/assets/img/statics/icons/${iconFile}" alt="${ext}">
        </span>
        <span class="file-name line-clamp-2">${file.name}</span>
        <button type="button" class="file-remove">✕</button>
      `;

      li.querySelector(".file-remove").addEventListener("click", () => {
        li.remove();
      });

      fileListEl.appendChild(li);
    }
  });

  /* ---------------- ALERT ---------------- */

  function showAlert(msg) {
    if (typeof Swal !== "undefined") {
      Swal.fire({
        icon: "warning",
        title: "Uyarı",
        text: msg,
        confirmButtonText: "Tamam",
      });
    } else {
      alert(msg);
    }
  }
}
