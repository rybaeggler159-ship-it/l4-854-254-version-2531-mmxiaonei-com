function initPlayer(src) {
  var box = document.querySelector("[data-player]");

  if (!box) {
    return;
  }

  var video = box.querySelector("video");
  var button = box.querySelector("[data-play-button]");
  var attached = false;
  var hls = null;

  function attach() {
    if (attached || !video) {
      return;
    }

    attached = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.ERROR, function (_event, data) {
        if (!data || !data.fatal) {
          return;
        }
        if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
        } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
        } else {
          hls.destroy();
        }
      });
      return;
    }

    video.src = src;
  }

  function play() {
    attach();
    video.controls = true;
    if (button) {
      button.classList.add("is-hidden");
    }
    var started = video.play();
    if (started && started.catch) {
      started.catch(function () {
        if (button) {
          button.classList.remove("is-hidden");
        }
      });
    }
  }

  if (button) {
    button.addEventListener("click", play);
  }

  if (video) {
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });
  }

  window.addEventListener("pagehide", function () {
    if (hls) {
      hls.destroy();
    }
  });
}
