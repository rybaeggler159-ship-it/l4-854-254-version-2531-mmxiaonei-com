(function () {
  window.initMoviePlayer = function (source) {
    var player = document.querySelector("[data-player]");
    if (!player) {
      return;
    }

    var video = player.querySelector("video");
    var overlay = player.querySelector("[data-player-overlay]");
    var button = player.querySelector("[data-player-button]");
    var label = player.querySelector("[data-player-text]");
    var hls = null;
    var loaded = false;
    var loading = null;

    function setLabel(text) {
      if (label) {
        label.textContent = text;
      }
    }

    function bindNative(resolve, reject) {
      video.src = source;
      video.addEventListener("loadedmetadata", resolve, { once: true });
      video.addEventListener("error", reject, { once: true });
      video.load();
    }

    function bindHls(resolve, reject) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, resolve);
      hls.on(Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          return;
        }
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          return;
        }
        reject();
      });
    }

    function loadSource() {
      if (loaded) {
        return Promise.resolve();
      }
      if (loading) {
        return loading;
      }
      loading = new Promise(function (resolve, reject) {
        var done = function () {
          loaded = true;
          resolve();
        };
        var failed = function () {
          reject();
        };
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          bindNative(done, failed);
          return;
        }
        if (window.Hls && Hls.isSupported()) {
          bindHls(done, failed);
          return;
        }
        bindNative(done, failed);
      });
      return loading;
    }

    function play() {
      player.classList.add("is-loading");
      loadSource()
        .then(function () {
          return video.play();
        })
        .then(function () {
          player.classList.remove("is-loading");
          player.classList.add("is-playing");
        })
        .catch(function () {
          player.classList.remove("is-loading");
          player.classList.remove("is-playing");
          setLabel("暂时无法播放");
        });
    }

    if (overlay) {
      overlay.addEventListener("click", play);
    }
    if (button) {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        play();
      });
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });
    video.addEventListener("play", function () {
      player.classList.add("is-playing");
    });
    video.addEventListener("pause", function () {
      if (!video.ended) {
        player.classList.remove("is-playing");
      }
    });
    video.addEventListener("ended", function () {
      player.classList.remove("is-playing");
    });
    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
