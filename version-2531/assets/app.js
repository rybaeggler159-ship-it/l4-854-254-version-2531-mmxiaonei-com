(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function setupMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!button || !menu) {
      return;
    }
    button.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function setupSearchForms() {
    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (!input || !input.value.trim()) {
          event.preventDefault();
        }
      });
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    start();
  }

  function setupFilters() {
    var panels = document.querySelectorAll("[data-filter-panel]");
    panels.forEach(function (panel) {
      var scope = panel.closest("section") || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-search-card]"));
      var input = panel.querySelector("[data-filter-input]");
      var typeSelect = panel.querySelector("[data-filter-type]");
      var yearSelect = panel.querySelector("[data-filter-year]");
      var empty = scope.querySelector("[data-filter-empty]");

      function yearMatched(cardYear, selected) {
        var year = parseInt(cardYear, 10);
        if (!selected) {
          return true;
        }
        if (selected === "classic") {
          return !year || year < 2022;
        }
        return String(cardYear).indexOf(selected) !== -1;
      }

      function apply() {
        var keyword = input ? input.value.trim().toLowerCase() : "";
        var selectedType = typeSelect ? typeSelect.value : "";
        var selectedYear = yearSelect ? yearSelect.value : "";
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-year"),
            card.getAttribute("data-tags")
          ].join(" ").toLowerCase();
          var typeOk = !selectedType || (card.getAttribute("data-type") || "").indexOf(selectedType) !== -1;
          var yearOk = yearMatched(card.getAttribute("data-year") || "", selectedYear);
          var keywordOk = !keyword || haystack.indexOf(keyword) !== -1;
          var show = typeOk && yearOk && keywordOk;
          card.style.display = show ? "" : "none";
          if (show) {
            visible += 1;
          }
        });

        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      [input, typeSelect, yearSelect].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });
    });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderSearch() {
    var results = document.querySelector("[data-search-results]");
    var status = document.querySelector("[data-search-status]");
    var input = document.querySelector("[data-search-input]");
    if (!results || !status || !window.SEARCH_INDEX) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var query = (params.get("q") || "").trim();
    if (input) {
      input.value = query;
    }

    if (!query) {
      return;
    }

    var lower = query.toLowerCase();
    var matches = window.SEARCH_INDEX.filter(function (item) {
      return [item.title, item.region, item.type, item.year, item.genre, item.tags, item.oneLine]
        .join(" ")
        .toLowerCase()
        .indexOf(lower) !== -1;
    });

    status.innerHTML = "<h2>搜索结果: “" + escapeHtml(query) + "”</h2><p>找到 " + matches.length + " 个结果</p>";

    if (!matches.length) {
      results.innerHTML = "<div class=\"empty-state is-visible\">没有匹配内容</div>";
      return;
    }

    results.innerHTML = matches.map(function (item) {
      return "<article class=\"movie-card\">"
        + "<a class=\"movie-link\" href=\"./" + escapeHtml(item.href) + "\">"
        + "<figure class=\"poster-frame\">"
        + "<img src=\"" + escapeHtml(item.cover) + "\" alt=\"" + escapeHtml(item.title) + "\" loading=\"lazy\">"
        + "<span class=\"year-badge\">" + escapeHtml(item.year) + "</span>"
        + "</figure>"
        + "<div class=\"movie-info\">"
        + "<span class=\"pill\">" + escapeHtml(item.region) + "</span>"
        + "<h3>" + escapeHtml(item.title) + "</h3>"
        + "<p>" + escapeHtml(item.oneLine) + "</p>"
        + "<div class=\"meta-line\"><span>" + escapeHtml(item.type) + "</span><span>" + escapeHtml(item.genre) + "</span></div>"
        + "</div>"
        + "</a>"
        + "</article>";
    }).join("");
  }

  ready(function () {
    setupMenu();
    setupSearchForms();
    setupHero();
    setupFilters();
    renderSearch();
  });
})();
