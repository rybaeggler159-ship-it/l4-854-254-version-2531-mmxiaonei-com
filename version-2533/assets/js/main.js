(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuButton.textContent = isOpen ? '×' : '☰';
    });
  }

  document.querySelectorAll('.back-top').forEach(function (button) {
    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-target]'));
  var heroIndex = 0;

  function showHeroSlide(index) {
    if (!slides.length) {
      return;
    }

    heroIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, position) {
      slide.classList.toggle('active', position === heroIndex);
    });

    dots.forEach(function (dot, position) {
      dot.classList.toggle('active', position === heroIndex);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var target = Number(dot.getAttribute('data-hero-target')) || 0;
      showHeroSlide(target);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showHeroSlide(heroIndex + 1);
    }, 5200);
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyGlobalFilter() {
    var query = normalize(document.getElementById('searchInput') && document.getElementById('searchInput').value);
    var region = (document.getElementById('regionFilter') && document.getElementById('regionFilter').value) || 'all';
    var type = (document.getElementById('typeFilter') && document.getElementById('typeFilter').value) || 'all';
    var year = (document.getElementById('yearFilter') && document.getElementById('yearFilter').value) || 'all';
    var category = (document.getElementById('categoryFilter') && document.getElementById('categoryFilter').value) || 'all';

    document.querySelectorAll('#movieGrid .movie-card').forEach(function (card) {
      var text = normalize(card.textContent + ' ' + card.getAttribute('data-title'));
      var matched = true;
      matched = matched && (!query || text.indexOf(query) !== -1);
      matched = matched && (region === 'all' || card.getAttribute('data-region') === region);
      matched = matched && (type === 'all' || card.getAttribute('data-type') === type);
      matched = matched && (year === 'all' || card.getAttribute('data-year') === year);
      matched = matched && (category === 'all' || card.getAttribute('data-category') === category);
      card.classList.toggle('hidden-by-filter', !matched);
    });
  }

  ['searchInput', 'regionFilter', 'typeFilter', 'yearFilter', 'categoryFilter'].forEach(function (id) {
    var element = document.getElementById(id);
    if (element) {
      element.addEventListener('input', applyGlobalFilter);
      element.addEventListener('change', applyGlobalFilter);
    }
  });

  var params = new URLSearchParams(window.location.search);
  var presetQuery = params.get('q');
  var searchInput = document.getElementById('searchInput');
  if (presetQuery && searchInput) {
    searchInput.value = presetQuery;
    applyGlobalFilter();
  }

  document.querySelectorAll('.local-filter').forEach(function (bar) {
    var input = bar.querySelector('[data-local-search]');
    var select = bar.querySelector('[data-local-region]');
    var scope = document.querySelector('[data-filter-scope]');

    function applyLocalFilter() {
      var query = normalize(input && input.value);
      var region = (select && select.value) || 'all';

      if (!scope) {
        return;
      }

      scope.querySelectorAll('.movie-card').forEach(function (card) {
        var text = normalize(card.textContent + ' ' + card.getAttribute('data-title'));
        var matched = (!query || text.indexOf(query) !== -1) && (region === 'all' || card.getAttribute('data-region') === region);
        card.classList.toggle('hidden-by-filter', !matched);
      });
    }

    if (input) {
      input.addEventListener('input', applyLocalFilter);
    }

    if (select) {
      select.addEventListener('change', applyLocalFilter);
    }
  });
})();
