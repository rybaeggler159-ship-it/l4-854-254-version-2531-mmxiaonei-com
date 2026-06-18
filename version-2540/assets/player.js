import { H as Hls } from './hls.js';

(function () {
    var video = document.querySelector('[data-player]');
    var cover = document.querySelector('[data-player-cover]');
    var trigger = document.querySelector('[data-player-trigger]');
    if (!video) {
        return;
    }
    var hlsUrl = video.getAttribute('data-hls-url');
    var hlsInstance = null;
    var bound = false;

    function bind() {
        if (bound || !hlsUrl) {
            return;
        }
        bound = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = hlsUrl;
        } else if (Hls.isSupported()) {
            hlsInstance = new Hls({
                enableWorker: true,
                lowLatencyMode: false
            });
            hlsInstance.loadSource(hlsUrl);
            hlsInstance.attachMedia(video);
        } else {
            video.src = hlsUrl;
        }
    }

    function start() {
        bind();
        if (cover) {
            cover.classList.add('is-hidden');
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                if (cover) {
                    cover.classList.remove('is-hidden');
                }
            });
        }
    }

    if (trigger) {
        trigger.addEventListener('click', start);
    }
    video.addEventListener('click', function () {
        if (video.paused) {
            start();
        }
    });
    video.addEventListener('play', function () {
        if (cover) {
            cover.classList.add('is-hidden');
        }
    });
    window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
})();
