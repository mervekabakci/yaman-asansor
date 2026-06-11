export function initFormValidation() {
  const forms = document.querySelectorAll(".form");

  forms.forEach((form) => {
    const submitButtons = form.querySelectorAll(".formButton");

    submitButtons.forEach((submitButton) => {
      submitButton.addEventListener("click", function (e) {
        //e.preventDefault();

        const isFormValid = validateForm(form);

        if (isFormValid) {
          console.log("Form doğrulandı", form);
        } else {
          console.log("Eksik veya hatalı alanlar var.");
        }
      });
    });

    /* -----------------------------
       ANLIK VALIDATION
    ----------------------------- */

    form.querySelectorAll("input, textarea").forEach((input) => {
      input.addEventListener("input", () => validateInput(input));
      input.addEventListener("blur", () => validateInput(input));
    });

    form.querySelectorAll("select").forEach((select) => {
      select.addEventListener("change", () => validateInput(select));
    });

    /* -----------------------------
       MASK INPUTLAR
    ----------------------------- */

    form.querySelectorAll(".vknTcknMask").forEach((input) => {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "").substring(0, 11);
      });
    });

    form.querySelectorAll(".phoneMask").forEach((input) => {
      input.addEventListener("input", handlePhoneMask);
    });

    form.querySelectorAll(".numberMask").forEach((input) => {
      input.addEventListener("input", handleNumberMask);
    });

    form.querySelectorAll(".numberMaskTwo").forEach((input) => {
      input.addEventListener("input", (e) => {
        const el = e.target;
        el.value = el.value.replace(/\D/g, "").substring(0, 2);
      });
    });

    form.querySelectorAll(".numberMaskThree").forEach((input) => {
      input.addEventListener("input", (e) => {
        const el = e.target;
        el.value = el.value.replace(/\D/g, "").substring(0, 3);
      });
    });

    form.querySelectorAll(".priceMask").forEach((input) => {
      input.addEventListener("input", handlePriceMask);
    });

    form.querySelectorAll(".decimalMask").forEach((input) => {
      input.addEventListener("input", handleDecimalMask);

      input.addEventListener("blur", () => {
        if (input.value.endsWith(".")) {
          input.value = input.value.slice(0, -1);
        }
      });
    });
  });

  /* -----------------------------
     MASK HANDLERS
  ----------------------------- */

  function handlePhoneMask(e) {
    const input = e.target;

    let digits = input.value.replace(/\D/g, "");

    // 0 ile başlat
    if (digits.length && !digits.startsWith("0")) {
      digits = "0" + digits;
    }

    // max 11 hane
    digits = digits.substring(0, 11);

    if (!digits) {
      input.value = "";
      return;
    }

    let formatted = "";

    if (digits.length <= 1) {
      formatted = digits;
    } else if (digits.length <= 4) {
      formatted = `${digits[0]} (${digits.slice(1)}`;
    } else if (digits.length <= 7) {
      formatted = `${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    } else if (digits.length <= 9) {
      formatted = `${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)} ${digits.slice(7)}`;
    } else {
      formatted = `${digits[0]} (${digits.slice(1, 4)}) ${digits.slice(4, 7)} ${digits.slice(7, 9)} ${digits.slice(9, 11)}`;
    }

    if (input.value !== formatted) {
      input.value = formatted;
    }
  }
  function handleNumberMask(e) {
    const input = e.target;

    input.value = input.value.replace(/\D/g, "");
  }

  function handleDecimalMask(e) {
    const input = e.target;

    let value = input.value.replace(",", ".").replace(/[^0-9.]/g, "");

    const parts = value.split(".");

    if (parts.length > 2) {
      value = parts[0] + "." + parts[1];
    }

    if (parts[1]) {
      parts[1] = parts[1].substring(0, 2);

      value = parts.join(".");
    }

    if (value.startsWith(".")) value = value.substring(1);

    input.value = value;
  }

  function handlePriceMask(e) {
    const input = e.target;

    let digits = input.value.replace(/\D/g, "");

    if (digits.startsWith("0")) {
      digits = digits.replace(/^0+/, "");
    }

    if (!digits) {
      input.value = "";

      return;
    }

    let integerPart = digits.slice(0, -2) || "0";

    let decimalPart = digits.slice(-2);

    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    input.value = `${integerPart},${decimalPart}`;
  }

  /* -----------------------------
     VALIDATION
  ----------------------------- */

  function validateInput(input) {
    const value = input.value.trim();

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    let isValidInput = true;

    if (input.classList.contains("phoneMask")) {
      const digits = value.replace(/\D/g, "");
      if (!digits) {
        input.classList.remove("is-valid", "is-invalid");
        return true;
      }
      if (document.activeElement === input) {
        isValidInput = true;
      } else {
        isValidInput = digits.length === 11;
      }
    } else if (input.classList.contains("numberMask")) {
      isValidInput = /^\d+$/.test(value);
    } else if (input.classList.contains("numberMaskTwo")) {
      isValidInput = /^\d{1,2}$/.test(value);
    } else if (input.classList.contains("numberMaskThree")) {
      isValidInput = /^\d{1,3}$/.test(value);
    } else if (input.classList.contains("decimalMask")) {
      isValidInput = /^\d+(\.\d{1,2})?$/.test(value);
    } else if (input.classList.contains("priceMask")) {
      isValidInput = /^\d{1,3}(\.\d{3})*(,\d{2})$/.test(value);
    } else if (input.type === "email") {
      isValidInput = value && emailPattern.test(value);
    } else if (input.type === "checkbox") {
      const groupName = input.getAttribute("name");

      const group = input
        .closest("form")
        ?.querySelectorAll(`input[name="${groupName}"]`);

      const isAnyChecked = group
        ? Array.from(group).some((el) => el.checked)
        : input.checked;

      (group || [input]).forEach((el) => {
        el.classList.toggle("is-valid", isAnyChecked);

        el.classList.toggle("is-invalid", !isAnyChecked);
      });

      return isAnyChecked;
    } else if (input.tagName === "SELECT") {
      isValidInput = input.required ? value && value !== "0" : true;
    } else if (input.required) {
      isValidInput = !!value;
    }

    input.classList.toggle("is-valid", isValidInput);

    input.classList.toggle("is-invalid", !isValidInput);

    return isValidInput;
  }

  function validateForm(form) {
    // debugger;

    let isValid = true;

    form.querySelectorAll("input, textarea, select").forEach((input) => {
      if (!validateInput(input)) isValid = false;
    });

    return isValid;
  }
}
