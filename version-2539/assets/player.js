(function () {
  function init(streamUrl, posterUrl) {
    var video = document.getElementById("movie-player");
    var trigger = document.getElementById("play-trigger");
    var cover = document.querySelector(".player-cover");
    if (!video || !streamUrl) {
      return;
    }
    if (posterUrl) {
      video.setAttribute("poster", posterUrl);
    }
    var attached = false;
    function attachStream() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        video.hlsInstance = hls;
        return;
      }
      video.src = streamUrl;
    }
    function start() {
      attachStream();
      if (cover) {
        cover.classList.add("is-hidden");
      }
      var playResult = video.play();
      if (playResult && typeof playResult.catch === "function") {
        playResult.catch(function () {});
      }
    }
    if (trigger) {
      trigger.addEventListener("click", start);
    }
    if (cover && cover !== trigger) {
      cover.addEventListener("click", start);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });
  }

  window.MoviePlayer = {
    init: init
  };
})();
