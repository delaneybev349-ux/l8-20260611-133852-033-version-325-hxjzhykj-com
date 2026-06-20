(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initMobileNav() {
    var toggle = qs('[data-mobile-toggle]');
    var nav = qs('[data-mobile-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var hero = qs('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = qsa('.hero-slide', hero);
    var dots = qsa('.hero-dot', hero);
    if (slides.length <= 1) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initFilters() {
    qsa('[data-filter-form]').forEach(function (form) {
      var input = qs('[data-search-input]', form);
      var year = qs('[data-filter-year]', form);
      var type = qs('[data-filter-type]', form);
      var region = qs('[data-filter-region]', form);
      var cards = qsa('.movie-card');
      var empty = qs('[data-no-results]');

      function value(el) {
        return el ? String(el.value || '').trim().toLowerCase() : '';
      }

      function apply() {
        var keyword = value(input);
        var selectedYear = value(year);
        var selectedType = value(type);
        var selectedRegion = value(region);
        var shown = 0;

        cards.forEach(function (card) {
          var text = String(card.getAttribute('data-search') || '').toLowerCase();
          var cardYear = String(card.getAttribute('data-year') || '').toLowerCase();
          var cardType = String(card.getAttribute('data-type') || '').toLowerCase();
          var cardRegion = String(card.getAttribute('data-region') || '').toLowerCase();
          var ok = true;

          if (keyword && text.indexOf(keyword) === -1) {
            ok = false;
          }
          if (selectedYear && cardYear !== selectedYear) {
            ok = false;
          }
          if (selectedType && cardType !== selectedType) {
            ok = false;
          }
          if (selectedRegion && cardRegion !== selectedRegion) {
            ok = false;
          }

          card.style.display = ok ? '' : 'none';
          if (ok) {
            shown += 1;
          }
        });

        if (empty) {
          empty.classList.toggle('is-visible', shown === 0);
        }
      }

      [input, year, type, region].forEach(function (el) {
        if (el) {
          el.addEventListener('input', apply);
          el.addEventListener('change', apply);
        }
      });
    });
  }

  function attachStream(video, stream) {
    if (!video || !stream) {
      return;
    }
    if (video.dataset.ready === '1') {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      video.dataset.ready = '1';
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
      video.dataset.ready = '1';
      video._hlsPlayer = hls;
      return;
    }
    video.src = stream;
    video.dataset.ready = '1';
  }

  function initPlayers() {
    qsa('[data-player]').forEach(function (player) {
      var video = qs('video', player);
      var button = qs('[data-play-button]', player);
      var stream = player.getAttribute('data-stream');
      if (!video || !stream) {
        return;
      }

      function playMovie() {
        attachStream(video, stream);
        if (button) {
          button.classList.add('is-hidden');
        }
        var promise = video.play();
        if (promise && promise.catch) {
          promise.catch(function () {
            if (button && video.paused) {
              button.classList.remove('is-hidden');
            }
          });
        }
      }

      if (button) {
        button.addEventListener('click', playMovie);
      }

      video.addEventListener('click', function () {
        if (video.paused) {
          playMovie();
        }
      });

      video.addEventListener('play', function () {
        if (button) {
          button.classList.add('is-hidden');
        }
      });

      video.addEventListener('pause', function () {
        if (button && video.currentTime === 0) {
          button.classList.remove('is-hidden');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initHero();
    initFilters();
    initPlayers();
  });
})();
