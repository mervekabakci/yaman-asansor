export function InitGalleryUpload() {
  const dataTables = {};

  function showDuplicateAlert(fileNames) {
    const listHtml = `
      <ul style="text-align:left; margin:0; padding-left:18px;">
        ${fileNames.map((name) => `<li>${name}</li>`).join("")}
      </ul>
    `;

    Swal.fire({
      icon: "warning",
      title: "Aynı isimli dosyalar bulundu",
      html: `
        <p>Aşağıdaki dosyalar zaten eklenmiş:</p>
        ${listHtml}
      `,
      confirmButtonText: "Tamam",
    });
  }

  function isDuplicateFile(container, fileName) {
    if (container.querySelector(`.item[data-file-name="${fileName}"]`)) {
      return true;
    }

    if (container.classList.contains("columnList")) {
      const tableId = container.dataset.list;
      const table = document.getElementById(tableId);
      if (table && table.querySelector(`tr[data-file-name="${fileName}"]`)) {
        return true;
      }
    }

    return false;
  }

  const galleryInputs = document.querySelectorAll(".galleryInput");
  galleryInputs.forEach((input) => {
    input.addEventListener("change", handleChangeInput);
  });

  function getGalleryName(el) {
    const container = el.closest(".galleryUploadContainer");
    return container?.dataset.gallery || "uploadGallery";
  }

  function createdGaleryItem(file, caption, galleryName) {
    const objectUrl = URL.createObjectURL(file);

    return `
      <div class="item" data-file-name="${file.name}">
        <span class="deleteItem">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M5 21V6H4V4h5V3h6v1h5v2h-1v15zm2-2h10V6H7zm2-2h2V8H9zm4 0h2V8h-2zM7 6v13z" />
          </svg>
        </span>

        <a class="imgLightBox"
           href="${objectUrl}"
           data-fancybox="${galleryName}"
           data-caption="${caption || file.name}">
          <div class="imageWrapper">
            <img class="thumbPreview" src="${objectUrl}" alt="${file.name}">
          </div>
        </a>

        <div class="imgCaptionWrapper">
          <div class="imgCaptionText">${caption || file.name}</div>
        </div>
      </div>
    `;
  }

  function createdUploadGallery(element) {
    const div = document.createElement("div");
    div.classList.add("uploadGallery");
    element.appendChild(div);

    div.addEventListener("click", handleCaptionClickDelegation);
    div.addEventListener("click", handleDeleteDelegation);
  }

  function handleDeleteGaleryItem(item) {
    const uploadGallery = item.closest(".uploadGallery");
    const fileInputBox = item.closest(".fileInputBox");
    const fileName = item.dataset.fileName;
    const container = item.closest(".galleryUploadContainer");

    if (container.classList.contains("columnList")) {
      const tableId = container.dataset.list;
      const table = document.getElementById(tableId);
      const row = table?.querySelector(`tr[data-file-name="${fileName}"]`);
      if (row) row.remove();
    }

    item.remove();

    const remainingCount = uploadGallery.querySelectorAll(".item").length;

    if (remainingCount === 0) {
      uploadGallery.remove();
      fileInputBox.querySelector(".uploadText .count").innerText =
        "0 dosya eklendi";
      fileInputBox.querySelector(".uploadText .text").innerText =
        "Dosya eklemek için tıklayınız";
    } else {
      fileInputBox.querySelector(
        ".uploadText .count"
      ).innerText = `${remainingCount} dosya eklendi`;
    }
  }

  function handleCaptionClickDelegation(e) {
    const target = e.target;
    if (!target.classList.contains("imgCaptionText")) return;

    const wrapper = target.parentElement;
    const item = wrapper.closest(".item");
    const fileName = item.dataset.fileName;
    const currentText = target.innerText;

    wrapper.innerHTML = `
      <input type="text" class="imgCaptionInput" value="${currentText}">
      <button type="button" class="imgCaptionSave fixBtn button-success sm mt-3">Kaydet</button>
    `;

    const input = wrapper.querySelector(".imgCaptionInput");
    const saveBtn = wrapper.querySelector(".imgCaptionSave");

    input.focus();

    saveBtn.addEventListener("click", () => {
      const newCaption = input.value.trim() || "Unnamed";
      wrapper.innerHTML = `<div class="imgCaptionText">${newCaption}</div>`;

      item.querySelector(".imgLightBox").dataset.caption = newCaption;

      const container = item.closest(".galleryUploadContainer");
      if (container.classList.contains("columnList")) {
        const tableId = container.dataset.list;
        const row = document
          .getElementById(tableId)
          ?.querySelector(`tr[data-file-name="${fileName}"]`);
        if (row) row.querySelector(".caption").innerText = newCaption;
      }
    });
  }

  function handleDeleteDelegation(e) {
    const btn = e.target.closest(".deleteItem");
    if (!btn) return;
    handleDeleteGaleryItem(btn.closest(".item"));
  }
  // DataTable satır güncelleme işlemi
  // DataTable edit işlemleri (event delegation ile)
  function initRowEdit(tableId) {
    const dt = dataTables[tableId];
    const table = dt.table.table().node();

    table.addEventListener("click", (e) => {
      const editBtn = e.target.closest(".editButton");
      const saveBtn = e.target.closest(".saveButton");
      const cancelBtn = e.target.closest(".cancelButton");
      const removeBtn = e.target.closest(".removeButton");

      if (!editBtn && !saveBtn && !cancelBtn && !removeBtn) return;

      e.preventDefault();
      const rowNode = (editBtn || saveBtn || cancelBtn || removeBtn).closest(
        "tr"
      );
      const captionCell = rowNode.querySelector(".caption");
      const btnWrapper = rowNode.querySelector(".buttons");

      // Edit Button tıklandığında
      if (editBtn) {
        const currentText = captionCell.textContent;
        captionCell.innerHTML = `<input type="text" class="rowCaptionInput" value="${currentText}">`;

        btnWrapper.innerHTML = `
        <div class="toolTipButton" data-tooltip="Kaydet">
          <a href="#" class="fixBtn saveButton button-success sm">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" stroke-width="1.3">
                <path d="M3 19V5a2 2 0 0 1 2-2h11.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 21 7.828V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
                <path d="M8.6 9h6.8a.6.6 0 0 0 .6-.6V3.6a.6.6 0 0 0-.6-.6H8.6a.6.6 0 0 0-.6.6v4.8a.6.6 0 0 0 .6.6ZM6 13.6V21h12v-7.4a.6.6 0 0 0-.6-.6H6.6a.6.6 0 0 0-.6.6Z" />
              </g>
            </svg>
          </a>
        </div>
        <div class="toolTipButton" data-tooltip="Vazgeç">
          <a href="#" class="fixBtn cancelButton button-warning sm">
            <svg width="20" height="20" viewBox="0 0 16 16">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.3" d="m11.25 4.75-6.5 6.5m0-6.5 6.5 6.5" />
            </svg>
          </a>
        </div>
      `;
      }

      // Save Button tıklandığında
      if (saveBtn) {
        const input = captionCell.querySelector(".rowCaptionInput");
        const newCaption = input.value.trim() || "Unnamed";
        captionCell.textContent = newCaption;

        btnWrapper.innerHTML = `
          <div class="toolTipButton" data-tooltip="Düzenle">
            <a href="#" class="fixBtn editButton button-warning sm">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M21 12a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1m-15 .76V17a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .71-.29l6.92-6.93L21.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83l-6.94 6.93a1 1 0 0 0-.29.71m10.76-8.35l2.83 2.83l-1.42 1.42l-2.83-2.83ZM8 13.17l5.93-5.93l2.83 2.83L10.83 16H8Z" />
              </svg>
            </a>
          </div>
          <div class="toolTipButton" data-tooltip="Sil">
            <a href="#" class="fixBtn removeButton button-error sm">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M9 17h2V8H9zm4 0h2V8h-2zm-8 4V6H4V4h5V3h6v1h5v2h-1v15z" />
              </svg>
            </a>
          </div>
      `;

        // fancybox data-caption güncelle
        const galleryName =
          rowNode.closest(".galleryUploadContainer")?.dataset.gallery ||
          "uploadGallery";
        const objectUrl = rowNode.querySelector("img")?.src;
        if (objectUrl) {
          const link = rowNode.querySelector(
            `a[data-fancybox="${galleryName}"]`
          );
          if (link) link.dataset.caption = newCaption;
        }
      }

      // Cancel Button tıklandığında
      if (cancelBtn) {
        const originalCaption =
          captionCell.querySelector(".rowCaptionInput")?.value ||
          captionCell.textContent;
        captionCell.textContent = originalCaption;

        btnWrapper.innerHTML = `
          <div class="toolTipButton" data-tooltip="Düzenle">
            <a href="#" class="fixBtn editButton button-warning sm">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M21 12a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1m-15 .76V17a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .71-.29l6.92-6.93L21.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83l-6.94 6.93a1 1 0 0 0-.29.71m10.76-8.35l2.83 2.83l-1.42 1.42l-2.83-2.83ZM8 13.17l5.93-5.93l2.83 2.83L10.83 16H8Z" />
              </svg>
            </a>
          </div>
          <div class="toolTipButton" data-tooltip="Sil">
            <a href="#" class="fixBtn removeButton button-error sm">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M9 17h2V8H9zm4 0h2V8h-2zm-8 4V6H4V4h5V3h6v1h5v2h-1v15z" />
              </svg>
            </a>
          </div>
      `;
      }

      // Remove Button tıklandığında
      if (removeBtn) {
        dt.table.row(rowNode).remove().draw();
      }
    });
  }

  function handleChangeInput(event) {
    const input = event.target;
    const caption = input.dataset.caption || "";
    const galleryInputParent = input.closest(".fileInputBox");
    const container = input.closest(".galleryUploadContainer");
    const galleryName = getGalleryName(input);

    galleryInputParent.classList.add("change");

    const files = [...input.files];

    /* COLUMN LIST İÇİN DATA TABLE OLUŞTURMA */
    if (container.classList.contains("columnList")) {
      const tableId = container.dataset.list;
      const tableWrapper = document.getElementById(tableId);

      if (!tableWrapper) return;

      // Eğer table yoksa oluştur
      let table = tableWrapper.querySelector("table.customTable");
      // Table oluşturulunca
      if (!table) {
        table = document.createElement("table");
        table.classList.add("customTable");
        table.innerHTML = `
    <thead>
      <tr>
        <th>Id</th>
        <th class="imgThumbnailTitle">Görsel</th>
        <th>Başlık</th>
        <th class="mdCol">İşlemler</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
        tableWrapper.appendChild(table);

        // DataTable başlat
        dataTables[tableId] = {
          table: new DataTable(table, {
            responsive: true,
            ordering: false,
            language: {
              emptyTable: "Tabloda veri bulunmamaktadır",
              info: "_TOTAL_ kayıttan _START_ - _END_ arası gösteriliyor",
              infoEmpty: "0 kayıttan 0 - 0 arası gösteriliyor",
              lengthMenu: "_MENU_",
            },
          }),
          currentIndex: 0, // başlangıç indexi 0
        };

        // **Sadece bir kere initRowEdit çağır**
        initRowEdit(tableId);
      }

      const tbody = table.querySelector("tbody");
      const duplicateFiles = [];
      const validFiles = [];

      files.forEach((file) => {
        if (isDuplicateFile(container, file.name)) {
          duplicateFiles.push(file.name);
        } else {
          validFiles.push(file);
        }
      });

      if (duplicateFiles.length) {
        showDuplicateAlert(duplicateFiles);
      }

      validFiles.forEach((file) => {
        const objectUrl = URL.createObjectURL(file);

        const dt = dataTables[tableId];
        const rowNode = dt.table.row
          .add([
            ++dt.currentIndex, // indexi 1’den başlatıyoruz
            `<a href="${objectUrl}" data-fancybox="${galleryName}" data-caption="${
              caption || file.name
            }">
                <div class="imgThumbnail-gallery">
                    <div class="imageWrapper">
                        <img src="${objectUrl}" alt="${file.name}">
                    </div>
                </div>
             </a>`,
            `<span class="caption">${caption || file.name}</span>`,
            `<div class="buttons d-flex gap-4">
                <div class="toolTipButton" data-tooltip="Düzenle">
                  <a href="#" class="fixBtn editButton button-warning sm">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M21 12a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h6a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a1 1 0 0 0-1-1m-15 .76V17a1 1 0 0 0 1 1h4.24a1 1 0 0 0 .71-.29l6.92-6.93L21.71 8a1 1 0 0 0 0-1.42l-4.24-4.29a1 1 0 0 0-1.42 0l-2.82 2.83l-6.94 6.93a1 1 0 0 0-.29.71m10.76-8.35l2.83 2.83l-1.42 1.42l-2.83-2.83ZM8 13.17l5.93-5.93l2.83 2.83L10.83 16H8Z" />
                    </svg>
                  </a>
                </div>
                <div class="toolTipButton" data-tooltip="Sil">
                  <a href="#" class="fixBtn removeButton button-error sm">
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M9 17h2V8H9zm4 0h2V8h-2zm-8 4V6H4V4h5V3h6v1h5v2h-1v15z" />
                    </svg>
                  </a>
                </div>
             </div>`,
          ])
          .draw()
          .node();

        rowNode.dataset.fileName = file.name;
      });

      input.value = "";
      return;
    }

    /* NORMAL GALERİ */
    if (!galleryInputParent.querySelector(".uploadGallery")) {
      createdUploadGallery(galleryInputParent);
    }

    const uploadGallery = galleryInputParent.querySelector(".uploadGallery");
    const existingCount = uploadGallery.querySelectorAll(".item").length;
    const remainingSlots = 10 - existingCount;

    if (remainingSlots <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Limit dolu",
        text: "Maksimum 10 dosya yükleyebilirsiniz.",
      });
      return;
    }

    
    if (files.length > remainingSlots) {
      Swal.fire({
        icon: "warning",
        title: "Limit aşıldı",
        text: `En fazla 10 dosya yükleyebilirsiniz. İlk ${remainingSlots} adet dosyanız eklendi.`,
      });
    }
    
    
    const duplicateFiles = [];
    const validFiles = [];

    files.slice(0, remainingSlots).forEach((file) => {
      if (isDuplicateFile(container, file.name)) {
        duplicateFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (duplicateFiles.length) {
      showDuplicateAlert(duplicateFiles);
    }

    validFiles.forEach((file) => {
      uploadGallery.insertAdjacentHTML(
        "beforeend",
        createdGaleryItem(file, caption, galleryName)
      );
    });

    input.parentElement.querySelector(".uploadText .text").innerText =
      "Daha fazla dosya eklemek için tıklayınız";

    input.parentElement.querySelector(".uploadText .count").innerText = `${
      uploadGallery.querySelectorAll(".item").length
    } dosya eklendi`;

    input.value = "";
  }
}
