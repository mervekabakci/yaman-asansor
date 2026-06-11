export function initPageScroll() {
  //window scroll
  let lastScrollY = window.scrollY;

  let cartDismissed = false;
  
  function handleScroll() {
    const header = document.querySelector("header");
    const homeBanner = document.querySelector("section.homeSection");
    const addToCartWrapper = document.querySelector(".add-to-cart-wrapper");

    if (!header) return;

    const headerH = header.offsetHeight;

    // HEADER FIX
    if (window.scrollY > 40) {
      header.classList.add("fixed");

      if (homeBanner) {
        homeBanner.classList.add("animateBanner");
      }
    } else {
      header.classList.remove("fixed");

      if (homeBanner) {
        homeBanner.classList.remove("animateBanner");
      }
    }


    if (addToCartWrapper) {
      // Scroll kontrolü
      function handleAddToCartVisibility() {
        if (cartDismissed) return; // kullanıcı kapattıysa bir daha açma

        if (window.scrollY > 800) {
          addToCartWrapper.classList.add("visible");
        } else {
          addToCartWrapper.classList.remove("visible");
        }
      }

      // İlk kontrol
      handleAddToCartVisibility();

      // Scroll listener
      window.addEventListener("scroll", handleAddToCartVisibility);

      // Close button
      const closeBtn = document.querySelector(".closeCartButton");

      if (closeBtn) {
        closeBtn.addEventListener("click", function () {
          addToCartWrapper.classList.remove("visible");
          cartDismissed = true; // artık bir daha açılmayacak
        });
      }
    }
  }

  window.addEventListener("scroll", handleScroll);
  //window scroll end

  const anchorLinks = document.querySelectorAll(".anchorLink");

  anchorLinks.forEach((anchorLink) => {
    anchorLink.addEventListener("click", (event) => {
      anchorLinks.forEach((link) => link.classList.remove("active"));
      anchorLink.classList.add("active");

      const href = anchorLink.getAttribute("href");
      const targetElem = document.querySelector(href);

      if (window.innerWidth < 992) {
        body.classList.remove("opened");
        navButton.classList.remove("active");
        navMenu.classList.remove("opened");
      }
      if (targetElem) {
        event.preventDefault();
        targetElem.scrollIntoView({ behavior: "smooth" });
      }
      // console.log(href);
    });
  });

  //sayfayı scroll ettıgımızde gorunen sectıona aıt ılgılı menu actıve olur
  //Observer gözlemci anlamına gelir ve tarayıcıda görünen elementler uzerınde rahatlıkla kontrol edıp ıslemler yapabılırız.
  //modern javascriptte her scroll olayında elle hesap yapmak yerıne observer kullanmak daha performanslı calısır.
  const sections = document.querySelectorAll("section");

  const options = {
    root: null,
    threshold: 0,
    rootMargin: "-150px",
  };

  const observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }
      const entryId = `#${entry.target.getAttribute("id")}`;
      // console.log(entryId);
      anchorLinks.forEach((ancLink) => {
        // console.log(ancLink.getAttribute("href"));
        const linkHref = ancLink.getAttribute("href");
        ancLink.classList.remove("active");
        if (entryId === linkHref) {
          ancLink.classList.add("active");
        }
      });

      entry.target.classList.toggle("inverse");
      // observer.unobserve(entry.target); bu kod eklendıgınde scroll takıp tek sefer calıstıgı ıcın menude etkili dogru calısmıyor. o yuzden burayı gızlıyoruz.
    });
  }, options);

  sections.forEach((section) => {
    observer.observe(section);
  });
}
