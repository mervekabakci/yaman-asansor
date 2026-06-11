document.querySelectorAll(".customTable").forEach((table) => {
  new DataTable(table, {
    responsive: true,
    ordering: true,
    searching: false,
    lengthChange: false,
    dom: "rtip",
    language: {
      emptyTable: "Tabloda veri bulunmamaktadır",
      info: "_TOTAL_ kayıttan _START_ - _END_ arası gösteriliyor",
      infoEmpty: "0 kayıttan 0 - 0 arası gösteriliyor",
      infoFiltered: "(Toplam _MAX_ kayıttan filtrelendi)",
      lengthMenu: "_MENU_ kayıt göster",
      loadingRecords: "Yükleniyor...",
      processing: "İşleniyor...",
      search: "Arama:",
      searchPlaceholder: "Arama",
      zeroRecords: "Eşleşen kayıt bulunamadı",
      paginate: {
        first: "İlk",
        last: "Son",
        next: "İleri",
        previous: "Geri",
      },
    },

    initComplete: function () {
      const api = this.api();
      const totalRows = api.rows().count();

      if (totalRows <= 10) {
        const wrapper = table.closest(".dt-container");

        wrapper?.querySelector(".dt-info")?.classList.add("d-none");
        wrapper?.querySelector(".dt-paging")?.classList.add("d-none");
      }
    },
  });
});
document.querySelectorAll(".customTable2").forEach((table) => {
  new DataTable(table, {
    paging: false,
    responsive: true,
    ordering: true,
    searching: false,
    lengthChange: false,
    dom: "rt",
    language: {
      emptyTable: "Tabloda veri bulunmamaktadır",
      info: "_TOTAL_ kayıttan _START_ - _END_ arası gösteriliyor",
      infoEmpty: "0 kayıttan 0 - 0 arası gösteriliyor",
      infoFiltered: "(Toplam _MAX_ kayıttan filtrelendi)",
      lengthMenu: "_MENU_ kayıt göster",
      loadingRecords: "Yükleniyor...",
      processing: "İşleniyor...",
      search: "Arama:",
      searchPlaceholder: "Arama",
      zeroRecords: "Eşleşen kayıt bulunamadı",
      paginate: {
        first: "İlk",
        last: "Son",
        next: "İleri",
        previous: "Geri",
      },
    },

    initComplete: function () {
      const api = this.api();
      const totalRows = api.rows().count();

      if (totalRows <= 10) {
        const wrapper = table.closest(".dt-container");

        wrapper?.querySelector(".dt-info")?.classList.add("d-none");
        wrapper?.querySelector(".dt-paging")?.classList.add("d-none");
      }
    },
  });
});
