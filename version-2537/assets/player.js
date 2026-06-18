(function () {
  window.initMoviePlayer = function (source) {
    const video = document.getElementById("movieVideo");
    const button = document.getElementById("moviePlayButton");
    const cover = document.querySelector(".player-cover");

    if (!video || !source) {
      return;
    }

    let attached = false;

    const attachSource = () => {
      if (attached) {
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        attached = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        attached = true;
        return;
      }

      video.src = source;
      attached = true;
    };

    const start = () => {
      attachSource();
      if (cover) {
        cover.classList.add("is-hidden");
      }
      const playResult = video.play();
      if (playResult && typeof playResult.catch === "function") {
        playResult.catch(() => {});
      }
    };

    if (button) {
      button.addEventListener("click", start);
    }

    if (cover) {
      cover.addEventListener("click", start);
    }

    video.addEventListener("click", () => {
      if (video.paused) {
        start();
      }
    });

    video.addEventListener("play", () => {
      if (cover) {
        cover.classList.add("is-hidden");
      }
    });
  };
}());
