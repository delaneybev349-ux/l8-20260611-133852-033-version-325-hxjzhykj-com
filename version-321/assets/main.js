(function () {
    const header = document.getElementById('siteHeader');
    const menuButton = document.getElementById('menuButton');
    const mobileNav = document.getElementById('mobileNav');

    function updateHeader() {
        if (!header) {
            return;
        }
        header.classList.toggle('is-scrolled', window.scrollY > 18);
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    if (menuButton && mobileNav && header) {
        menuButton.addEventListener('click', function () {
            const opened = mobileNav.classList.toggle('open');
            header.classList.toggle('menu-open', opened);
            menuButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
        });
    }

    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    let activeSlide = 0;
    let slideTimer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        activeSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('is-active', i === activeSlide);
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle('is-active', i === activeSlide);
        });
    }

    function startSlides() {
        if (slides.length < 2) {
            return;
        }
        slideTimer = window.setInterval(function () {
            showSlide(activeSlide + 1);
        }, 5200);
    }

    dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () {
            if (slideTimer) {
                window.clearInterval(slideTimer);
            }
            showSlide(i);
            startSlides();
        });
    });

    showSlide(0);
    startSlides();

    const searchInput = document.querySelector('[data-search-input]');
    const typeFilter = document.querySelector('[data-filter-type]');
    const yearFilter = document.querySelector('[data-filter-year]');
    const categoryFilter = document.querySelector('[data-filter-category]');
    const emptyState = document.getElementById('emptyState');
    const cards = Array.from(document.querySelectorAll('[data-movie-card]'));

    function matchCard(card) {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const typeValue = typeFilter ? typeFilter.value : '';
        const yearValue = yearFilter ? yearFilter.value : '';
        const categoryValue = categoryFilter ? categoryFilter.value : '';
        const text = (card.getAttribute('data-title') || '').toLowerCase();
        const type = card.getAttribute('data-type') || '';
        const year = card.getAttribute('data-year') || '';
        const category = card.getAttribute('data-category') || '';
        return (!query || text.indexOf(query) !== -1) &&
            (!typeValue || type === typeValue) &&
            (!yearValue || year === yearValue) &&
            (!categoryValue || category === categoryValue);
    }

    function applyFilters() {
        if (!cards.length) {
            return;
        }
        let visible = 0;
        cards.forEach(function (card) {
            const matched = matchCard(card);
            card.classList.toggle('hidden-card', !matched);
            if (matched) {
                visible += 1;
            }
        });
        if (emptyState) {
            emptyState.hidden = visible !== 0;
        }
    }

    [searchInput, typeFilter, yearFilter, categoryFilter].forEach(function (control) {
        if (control) {
            control.addEventListener('input', applyFilters);
            control.addEventListener('change', applyFilters);
        }
    });
})();
