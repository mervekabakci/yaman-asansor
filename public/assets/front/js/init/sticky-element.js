export function initStickyElements(options = {}) {

  const {
    containerSelector = ".js-sticky-container",
    stickySelector = ".js-sticky",
    headerSelector = "header",
    bodyClass = "sticky-active",
    offset = 20,
    headerHideOffset = 0, // NEW
    breakpoint = 991.98,
  } = options;


  const header = document.querySelector(headerSelector);
  const containers = document.querySelectorAll(containerSelector);

  if (!containers.length) return;


  let stickyItems = [];
  let lastScrollY = window.scrollY;


  function setup() {

    stickyItems = [];

    containers.forEach(container => {

      const sticky = container.querySelector(stickySelector);
      if (!sticky) return;

      stickyItems.push({ container, sticky });

    });

    update();

  }


  function getHeaderHeight() {
    return header ? header.offsetHeight : 0;
  }


  function update() {

    if (window.innerWidth <= breakpoint) {

      document.body.classList.remove(bodyClass);

      stickyItems.forEach(({ sticky }) => {

        sticky.classList.remove("is-fixed", "is-bottom");
        sticky.style.removeProperty("--sticky-width");

      });

      return;

    }


    const scrollY = window.scrollY;

    const scrollingDown = scrollY > lastScrollY;
    const scrollingUp = scrollY < lastScrollY;


    const headerHeight = getHeaderHeight();

    const stickyOffset = headerHeight + offset;


    stickyItems.forEach(item => {

      const { container, sticky } = item;

      const containerRect = container.getBoundingClientRect();

      const containerTop = containerRect.top + window.scrollY;
      const containerHeight = container.offsetHeight;

      const stickyHeight = sticky.offsetHeight;

      const start = containerTop - stickyOffset;
      const end =
        containerTop +
        containerHeight -
        stickyHeight -
        stickyOffset;


      const containerWidth =
        sticky.parentElement.offsetWidth;


      sticky.style.setProperty(
        "--sticky-width",
        containerWidth + "px"
      );

      sticky.style.setProperty(
        "--sticky-offset",
        stickyOffset + "px"
      );


      if (scrollY <= start) {

        sticky.classList.remove(
          "is-fixed",
          "is-bottom"
        );

      }
      else if (scrollY > start && scrollY < end) {

        sticky.classList.add("is-fixed");
        sticky.classList.remove("is-bottom");

      }
      else {

        sticky.classList.remove("is-fixed");
        sticky.classList.add("is-bottom");

      }

    });


    /*
    HEADER CONTROL (EARLIER TRIGGER)
    */

    const firstContainer = stickyItems[0]?.container;

    if (firstContainer) {

      const trigger =
        firstContainer.offsetTop -
        headerHideOffset;

      if (scrollY > trigger && scrollingDown) {

        document.body.classList.add(bodyClass);

      }
      else if (scrollingUp || scrollY <= trigger) {

        document.body.classList.remove(bodyClass);

      }

    }


    lastScrollY = scrollY;

  }



  let ticking = false;


  function onScroll() {

    if (!ticking) {

      requestAnimationFrame(() => {

        update();
        ticking = false;

      });

      ticking = true;

    }

  }


  window.addEventListener("scroll", onScroll);

  window.addEventListener("resize", setup);


  setup();

}