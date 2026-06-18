(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupPlayers();
  });

  function setupMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-site-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
      button.setAttribute('aria-expanded', nav.classList.contains('is-open') ? 'true' : 'false');
    });
  }

  function setupHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    if (slides.length < 2) {
      return;
    }
    var index = slides.findIndex(function (slide) {
      return slide.classList.contains('is-active');
    });
    if (index < 0) {
      index = 0;
      slides[0].classList.add('is-active');
    }
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    setInterval(function () {
      show(index + 1);
    }, 5600);
  }

  function setupFilters() {
    Array.prototype.slice.call(document.querySelectorAll('[data-filter-box]')).forEach(function (box) {
      var input = box.querySelector('[data-filter-input]');
      var region = box.querySelector('[data-filter-region]');
      var type = box.querySelector('[data-filter-type]');
      var year = box.querySelector('[data-filter-year]');
      var list = document.querySelector(box.getAttribute('data-filter-box'));
      if (!list) {
        return;
      }
      var cards = Array.prototype.slice.call(list.querySelectorAll('[data-movie-card]'));
      function apply() {
        var q = input ? input.value.trim().toLowerCase() : '';
        var r = region ? region.value : '';
        var t = type ? type.value : '';
        var y = year ? year.value : '';
        cards.forEach(function (card) {
          var text = (card.getAttribute('data-title') + ' ' + card.getAttribute('data-text')).toLowerCase();
          var ok = true;
          if (q && text.indexOf(q) === -1) {
            ok = false;
          }
          if (r && card.getAttribute('data-region') !== r) {
            ok = false;
          }
          if (t && card.getAttribute('data-type') !== t) {
            ok = false;
          }
          if (y && card.getAttribute('data-year') !== y) {
            ok = false;
          }
          card.classList.toggle('is-hidden', !ok);
        });
      }
      [input, region, type, year].forEach(function (el) {
        if (el) {
          el.addEventListener('input', apply);
          el.addEventListener('change', apply);
        }
      });
    });
  }

  function setupPlayers() {
    Array.prototype.slice.call(document.querySelectorAll('.player-shell')).forEach(function (shell) {
      var video = shell.querySelector('video');
      var cover = shell.querySelector('.player-cover');
      var button = shell.querySelector('.player-start');
      var stream = shell.getAttribute('data-stream');
      var loaded = false;
      var hls = null;
      if (!video || !stream) {
        return;
      }
      function load() {
        if (loaded) {
          return;
        }
        loaded = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
      }
      function start(event) {
        if (event) {
          event.preventDefault();
        }
        load();
        shell.classList.add('is-playing');
        video.controls = true;
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {
            shell.classList.remove('is-playing');
          });
        }
      }
      if (button) {
        button.addEventListener('click', start);
      }
      if (cover) {
        cover.addEventListener('click', start);
      }
      video.addEventListener('play', function () {
        shell.classList.add('is-playing');
      });
      video.addEventListener('emptied', function () {
        if (hls) {
          hls.destroy();
          hls = null;
        }
        loaded = false;
      });
    });
  }
})();
