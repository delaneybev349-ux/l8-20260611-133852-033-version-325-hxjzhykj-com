(function () {
  const menuButton = document.querySelector("[data-mobile-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
    const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
    const dots = Array.from(carousel.querySelectorAll("[data-slide-to]"));
    let current = 0;
    let timer = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function startTimer() {
      if (timer || slides.length < 2) {
        return;
      }
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-slide-to")) || 0);
      });
    });

    showSlide(0);
    startTimer();
  });

  document.querySelectorAll("[data-filter-form]").forEach(function (form) {
    const scope = form.closest(".filter-scope") || document;
    const cards = Array.from(scope.querySelectorAll(".movie-card"));
    const input = form.querySelector(".js-search-input");
    const year = form.querySelector(".js-year-filter");
    const type = form.querySelector(".js-type-filter");
    const genre = form.querySelector(".js-genre-filter");

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function updateCards() {
      const keyword = normalize(input ? input.value : "");
      const yearValue = normalize(year ? year.value : "");
      const typeValue = normalize(type ? type.value : "");
      const genreValue = normalize(genre ? genre.value : "");

      cards.forEach(function (card) {
        const haystack = normalize(card.getAttribute("data-search"));
        const cardYear = normalize(card.getAttribute("data-year"));
        const cardType = normalize(card.getAttribute("data-type"));
        const cardGenre = normalize(card.getAttribute("data-genre"));
        const matchedKeyword = !keyword || haystack.indexOf(keyword) > -1;
        const matchedYear = !yearValue || cardYear === yearValue;
        const matchedType = !typeValue || cardType === typeValue;
        const matchedGenre = !genreValue || cardGenre.indexOf(genreValue) > -1;
        card.hidden = !(matchedKeyword && matchedYear && matchedType && matchedGenre);
      });
    }

    [input, year, type, genre].forEach(function (control) {
      if (control) {
        control.addEventListener("input", updateCards);
        control.addEventListener("change", updateCards);
      }
    });
  });
}());
