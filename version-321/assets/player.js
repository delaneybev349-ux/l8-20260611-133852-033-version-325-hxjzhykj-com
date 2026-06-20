(function () {
    window.initMoviePlayer = function (streamUrl) {
        function setup() {
            const video = document.getElementById('movieVideo');
            const layer = document.getElementById('playLayer');
            if (!video || !layer || !streamUrl) {
                return;
            }

            let ready = false;

            function attachStream() {
                if (ready) {
                    return;
                }
                ready = true;
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = streamUrl;
                    video.load();
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    const hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true,
                        backBufferLength: 60
                    });
                    hls.loadSource(streamUrl);
                    hls.attachMedia(video);
                    return;
                }
                video.src = streamUrl;
                video.load();
            }

            function play() {
                attachStream();
                layer.classList.add('is-hidden');
                const promise = video.play();
                if (promise && typeof promise.catch === 'function') {
                    promise.catch(function () {
                        layer.classList.remove('is-hidden');
                    });
                }
            }

            layer.addEventListener('click', play);
            video.addEventListener('click', function () {
                if (video.paused) {
                    play();
                }
            });
            video.addEventListener('play', function () {
                layer.classList.add('is-hidden');
            });
            video.addEventListener('ended', function () {
                layer.classList.remove('is-hidden');
            });
            attachStream();
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setup);
        } else {
            setup();
        }
    };
})();
