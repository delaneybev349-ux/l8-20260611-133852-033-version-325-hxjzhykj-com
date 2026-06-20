(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var index = 0;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, itemIndex) {
        slide.classList.toggle('active', itemIndex === index);
      });

      dots.forEach(function (dot, itemIndex) {
        dot.classList.toggle('active', itemIndex === index);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }
  }

  var filterList = document.querySelector('[data-filter-list]');

  if (filterList) {
    var cards = Array.prototype.slice.call(filterList.querySelectorAll('.movie-card, .rank-row'));
    var search = document.querySelector('[data-filter-search]');
    var region = document.querySelector('[data-filter-region]');
    var type = document.querySelector('[data-filter-type]');
    var year = document.querySelector('[data-filter-year]');
    var empty = document.querySelector('[data-empty-state]');

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function applyFilters() {
      var query = normalize(search && search.value);
      var regionValue = normalize(region && region.value);
      var typeValue = normalize(type && type.value);
      var yearValue = normalize(year && year.value);
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.year,
          card.dataset.tags,
          card.textContent
        ].join(' '));
        var matched = true;

        if (query && haystack.indexOf(query) === -1) {
          matched = false;
        }

        if (regionValue && normalize(card.dataset.region).indexOf(regionValue) === -1) {
          matched = false;
        }

        if (typeValue && normalize(card.dataset.type).indexOf(typeValue) === -1) {
          matched = false;
        }

        if (yearValue && normalize(card.dataset.year).indexOf(yearValue) === -1) {
          matched = false;
        }

        card.hidden = !matched;

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    [search, region, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });
  }

  var player = document.getElementById('moviePlayer');
  var playButton = document.querySelector('[data-play-button]');
  var status = document.querySelector('[data-player-status]');
  var hlsInstance = null;

  function setStatus(text) {
    if (status) {
      status.textContent = text || '';
    }
  }

  function attachStream(video) {
    var stream = video.getAttribute('data-stream');

    if (!stream) {
      setStatus('播放加载失败');
      return Promise.reject(new Error('stream missing'));
    }

    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }

    if (video.canPlayType('application/vnd.apple.mpegURL')) {
      if (video.src !== stream) {
        video.src = stream;
      }
      return Promise.resolve();
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(stream);
      hlsInstance.attachMedia(video);
      return new Promise(function (resolve) {
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          resolve();
        });
      });
    }

    video.src = stream;
    return Promise.resolve();
  }

  function playMovie() {
    if (!player) {
      return;
    }

    setStatus('正在载入');

    attachStream(player).then(function () {
      return player.play();
    }).then(function () {
      setStatus('');
      if (playButton) {
        playButton.classList.add('hidden');
      }
    }).catch(function () {
      setStatus('播放加载失败，请稍后重试');
      if (playButton) {
        playButton.classList.remove('hidden');
      }
    });
  }

  if (playButton && player) {
    playButton.addEventListener('click', playMovie);
    player.addEventListener('click', function () {
      if (player.paused) {
        playMovie();
      }
    });
    player.addEventListener('play', function () {
      playButton.classList.add('hidden');
    });
    player.addEventListener('pause', function () {
      if (!player.ended) {
        playButton.classList.remove('hidden');
      }
    });
  }
})();
