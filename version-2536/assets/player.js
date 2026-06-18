(function () {
    function init(source) {
        var video = document.querySelector(".js-player-video");
        var button = document.querySelector(".js-player-button");
        if (!video || !button || !source) {
            return;
        }

        var loaded = false;
        var instance = null;

        function attach() {
            if (loaded) {
                return;
            }
            loaded = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                instance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                instance.loadSource(source);
                instance.attachMedia(video);
                instance.on(window.Hls.Events.ERROR, function (event, data) {
                    if (!data || !data.fatal || !instance) {
                        return;
                    }
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        instance.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        instance.recoverMediaError();
                    } else {
                        instance.destroy();
                    }
                });
                return;
            }

            video.src = source;
        }

        function play() {
            attach();
            button.classList.add("is-hidden");
            video.setAttribute("controls", "controls");
            var request = video.play();
            if (request && typeof request.catch === "function") {
                request.catch(function () {});
            }
        }

        button.addEventListener("click", play);
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
    }

    window.AsiaVideoPlayer = {
        init: init
    };
})();
