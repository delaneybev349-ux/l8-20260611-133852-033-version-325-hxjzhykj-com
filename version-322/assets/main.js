(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector(".mobile-toggle");
        var nav = document.querySelector(".nav-links");

        if (toggle && nav) {
            toggle.addEventListener("click", function () {
                nav.classList.toggle("open");
            });
        }

        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var prev = document.querySelector(".hero-prev");
        var next = document.querySelector(".hero-next");
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }

        if (slides.length) {
            if (prev) {
                prev.addEventListener("click", function () {
                    showSlide(current - 1);
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    showSlide(current + 1);
                });
            }

            dots.forEach(function (dot, dotIndex) {
                dot.addEventListener("click", function () {
                    showSlide(dotIndex);
                });
            });

            window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }

        var input = document.querySelector(".js-filter-input");
        var status = document.querySelector(".js-filter-status");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
        var chips = Array.prototype.slice.call(document.querySelectorAll(".js-chip"));

        function applyFilter(value) {
            var keyword = (value || "").trim().toLowerCase();
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
                var matched = !keyword || haystack.indexOf(keyword) !== -1;
                card.classList.toggle("is-hidden", !matched);
                if (matched) {
                    visible += 1;
                }
            });

            if (status) {
                status.textContent = keyword && visible === 0 ? "没有匹配内容" : "";
            }
        }

        if (input) {
            input.addEventListener("input", function () {
                applyFilter(input.value);
            });
        }

        chips.forEach(function (chip) {
            chip.addEventListener("click", function () {
                chips.forEach(function (item) {
                    item.classList.remove("active");
                });
                chip.classList.add("active");
                var value = chip.getAttribute("data-filter") || "";
                if (input) {
                    input.value = value;
                }
                applyFilter(value);
            });
        });

        Array.prototype.slice.call(document.querySelectorAll(".movie-player")).forEach(function (player) {
            var video = player.querySelector("video");
            var button = player.querySelector(".play-layer");
            var source = player.getAttribute("data-stream");
            var loaded = false;
            var hlsInstance = null;

            function start() {
                if (!video || !source) {
                    return;
                }

                if (!loaded) {
                    if (video.canPlayType("application/vnd.apple.mpegurl")) {
                        video.src = source;
                    } else if (window.Hls && window.Hls.isSupported()) {
                        hlsInstance = new window.Hls();
                        hlsInstance.loadSource(source);
                        hlsInstance.attachMedia(video);
                    } else {
                        video.src = source;
                    }
                    loaded = true;
                }

                player.classList.add("is-playing");
                video.controls = true;
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === "function") {
                    playPromise.catch(function () {});
                }
            }

            if (button) {
                button.addEventListener("click", function (event) {
                    event.preventDefault();
                    start();
                });
            }

            player.addEventListener("click", function (event) {
                if (event.target === video || event.target === player) {
                    start();
                }
            });

            window.addEventListener("beforeunload", function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            });
        });
    });
})();
