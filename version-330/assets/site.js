(function() {
  var navToggle = document.querySelector(".nav-toggle");
  var mobileNav = document.querySelector(".mobile-nav");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", function() {
      mobileNav.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var activeIndex = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;

      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === activeIndex);
      });

      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === activeIndex);
      });
    }

    dots.forEach(function(dot) {
      dot.addEventListener("click", function() {
        showSlide(Number(dot.getAttribute("data-slide")) || 0);
      });
    });

    window.setInterval(function() {
      showSlide(activeIndex + 1);
    }, 5600);
  }

  document.querySelectorAll("[data-row-prev]").forEach(function(button) {
    button.addEventListener("click", function() {
      var section = button.closest("section");
      var row = section ? section.querySelector("[data-scroll-row]") : null;

      if (row) {
        row.scrollBy({ left: -360, behavior: "smooth" });
      }
    });
  });

  document.querySelectorAll("[data-row-next]").forEach(function(button) {
    button.addEventListener("click", function() {
      var section = button.closest("section");
      var row = section ? section.querySelector("[data-scroll-row]") : null;

      if (row) {
        row.scrollBy({ left: 360, behavior: "smooth" });
      }
    });
  });

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function applyFilter(scope) {
    var form = scope.querySelector("[data-filter-form]");
    var cards = Array.prototype.slice.call(scope.querySelectorAll(".searchable-card"));
    var emptyState = form ? form.querySelector(".empty-state") : null;

    if (!form || !cards.length) {
      return;
    }

    var queryInput = form.querySelector("input[name='q']");
    var yearSelect = form.querySelector("select[name='year']");
    var genreSelect = form.querySelector("select[name='genre']");

    function update() {
      var query = normalize(queryInput ? queryInput.value : "");
      var year = normalize(yearSelect ? yearSelect.value : "");
      var genre = normalize(genreSelect ? genreSelect.value : "");
      var visibleCount = 0;

      cards.forEach(function(card) {
        var haystack = normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-category"),
          card.textContent
        ].join(" "));
        var cardYear = normalize(card.getAttribute("data-year"));
        var cardGenre = normalize(card.getAttribute("data-genre"));
        var matched = (!query || haystack.indexOf(query) !== -1) && (!year || cardYear === year) && (!genre || cardGenre.indexOf(genre) !== -1);

        card.classList.toggle("is-filtered-out", !matched);

        if (matched) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
    }

    [queryInput, yearSelect, genreSelect].forEach(function(input) {
      if (input) {
        input.addEventListener("input", update);
        input.addEventListener("change", update);
      }
    });

    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");

    if (q && queryInput) {
      queryInput.value = q;
    }

    update();
  }

  document.querySelectorAll("[data-filter-scope]").forEach(applyFilter);
})();
