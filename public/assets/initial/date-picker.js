$(function () {

    const $input   = $("#startEndDateInput");
    const $wrapper = $("#startEndDateWrapper");

    if (!$input.length) return;

    $input.dateRangePicker({
        autoClose: true,
        format: "DD.MM.YYYY",
        separator: " - ",
        language: "tr-short",
        showShortcuts: false,
        showTopbar: false,

        getValue: function () {
            return $(this).val();
        },
        setValue: function (value) {
            $(this).val(value);
        }
    });

    // Tarih seçildiğinde
    $input.on("datepicker-change", function (event, obj) {
        if (obj && obj.value) {
            $wrapper.addClass("active");
        }
    });

    // Kapatıldığında (iptal / temizleme)
    $input.on("datepicker-closed", function () {
        if (!$input.val()) {
            $wrapper.removeClass("active");
        }
    });

});
