document.querySelectorAll(".tinymce-editor").forEach((el) => {
  const isDisabled = el.dataset.disabled === "true"; // HTML'den kontrol

  tinymce.init({
    target: el,
    plugins: "code preview image media link",
    toolbar: "undo redo | bold italic | alignleft aligncenter alignright | image media link | code preview",
    menubar: true,
    readonly: isDisabled, // readonly content
    resize: !isDisabled,
    setup: (editor) => {
      if (isDisabled) {
        editor.on("init", () => {
          // İçeriği düzenlenemez yap
          editor.getBody().setAttribute("contenteditable", false);

          // Toolbar butonlarının çalışmasını engelle
          const toolbar = editor.theme.panel && editor.theme.panel.find('toolbar')[0];
          if (toolbar) {
            toolbar.items().forEach(btn => {
              btn.disabled(true);
            });
          }
        });
      }
    },
    images_upload_url: "/upload-image",
    automatic_uploads: true,
    images_upload_handler: function (blobInfo, success, failure) {
      if (isDisabled) return; // disable upload
      const formData = new FormData();
      formData.append("file", blobInfo.blob(), blobInfo.filename());
      fetch("/upload-image", { method: "POST", body: formData })
        .then((resp) => resp.json())
        .then((json) => success(json.location))
        .catch(() => failure("Image upload failed."));
    },
  });
});
