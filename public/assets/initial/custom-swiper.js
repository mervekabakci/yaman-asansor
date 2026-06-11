document.querySelectorAll(".sliderWrapper").forEach((wrapper) => {
  const slider = wrapper.querySelector(".singleSlide");

  new Swiper(slider, {
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    navigation: {
      nextEl: wrapper.querySelector(".swiper-button-next"),
      prevEl: wrapper.querySelector(".swiper-button-prev"),
    },
  });

  const quintetteSlider = wrapper.querySelector(".quintetteSlider");

  new Swiper(quintetteSlider, {
    slidesPerView: 5,
    spaceBetween: 9,
    navigation: {
      nextEl: wrapper.querySelector(".swiper-button-next"),
      prevEl: wrapper.querySelector(".swiper-button-prev"),
    },
  });
  const sestetSlider = wrapper.querySelector(".sestetSlider");

  new Swiper(sestetSlider, {
    slidesPerView: 6,
    spaceBetween: 30,
    navigation: {
      nextEl: wrapper.querySelector(".swiper-button-next"),
      prevEl: wrapper.querySelector(".swiper-button-prev"),
    },
  });

  const productSlider = wrapper.querySelector(".productSlider");

  const productSliderThumb = wrapper.querySelector(".productSliderThumb");

  new Swiper(productSliderThumb, {
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
  });
  new Swiper(productSlider, {
    spaceBetween: 10,
    navigation: {
      nextEl: wrapper.querySelector(".swiper-button-next"),
      prevEl: wrapper.querySelector(".swiper-button-prev"),
    },
    thumbs: {
      swiper: productSliderThumb,
    },
    // on: {
    //   init(swiper) {
    //     stopAllVideos(swiper);
    //     playActiveVideo(swiper);
    //   },

    //   slideChangeTransitionStart(swiper) {
    //     stopAllVideos(swiper);
    //   },

    //   slideChangeTransitionEnd(swiper) {
    //     playActiveVideo(swiper);
    //   },
    // },
  });

  
});


// function stopAllVideos(swiper) {
//   swiper.slides.forEach((slide) => {
//     const video = slide.querySelector("video");
//     if (video) {
//       video.pause();
//       video.currentTime = 0;
//     }
//   });
// }

// function playActiveVideo(swiper) {
//   const activeSlide = swiper.slides[swiper.activeIndex];
//   const video = activeSlide?.querySelector("video");

//   if (video) {
//     video.play().catch(() => {});
//   }
// }
