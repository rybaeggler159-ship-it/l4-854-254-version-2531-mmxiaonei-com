(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
      });
    }

    var carousel = document.querySelector("[data-hero-carousel]");

    if (carousel) {
      var slides = Array.prototype.slice.call(
        carousel.querySelectorAll("[data-hero-slide]"),
      );
      var dots = Array.prototype.slice.call(
        carousel.querySelectorAll("[data-hero-dot]"),
      );
      var previous = carousel.querySelector("[data-hero-prev]");
      var next = carousel.querySelector("[data-hero-next]");
      var index = 0;
      var timer = null;

      function show(nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === index);
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          show(index + 1);
        }, 6200);
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot") || 0));
          restart();
        });
      });

      if (previous) {
        previous.addEventListener("click", function () {
          show(index - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          restart();
        });
      }

      restart();
    }

    var searchInput = document.querySelector("[data-search-input]");
    var clearButton = document.querySelector("[data-search-clear]");
    var filterRow = document.querySelector("[data-filter-row]");
    var cards = Array.prototype.slice.call(
      document.querySelectorAll(".movie-card"),
    );
    var activeFilter = "全部";

    function cardText(card) {
      return [
        card.getAttribute("data-title"),
        card.getAttribute("data-tags"),
        card.getAttribute("data-region"),
        card.getAttribute("data-year"),
        card.getAttribute("data-genre"),
      ]
        .join(" ")
        .toLowerCase();
    }

    function applyFilters() {
      var keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
      cards.forEach(function (card) {
        var text = cardText(card);
        var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchesFilter =
          activeFilter === "全部" ||
          text.indexOf(activeFilter.toLowerCase()) !== -1;
        card.classList.toggle("is-hidden", !(matchesKeyword && matchesFilter));
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }

    if (clearButton && searchInput) {
      clearButton.addEventListener("click", function () {
        searchInput.value = "";
        searchInput.focus();
        applyFilters();
      });
    }

    if (filterRow) {
      var filterButtons = Array.prototype.slice.call(
        filterRow.querySelectorAll("button"),
      );
      if (filterButtons.length) {
        filterButtons[0].classList.add("is-active");
      }
      filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
          activeFilter = button.getAttribute("data-filter-value") || "全部";
          filterButtons.forEach(function (item) {
            item.classList.toggle("is-active", item === button);
          });
          applyFilters();
        });
      });
    }
  });
})();
