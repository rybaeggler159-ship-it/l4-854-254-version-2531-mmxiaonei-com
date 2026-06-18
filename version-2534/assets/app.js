import { H as Hls } from './hls-dru42stk.js';

const body = document.body;
const nav = document.querySelector('[data-nav]');
const menuToggle = document.querySelector('[data-menu-toggle]');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('mobile-open');
    body.classList.toggle('menu-open');
  });
}

const headerSearch = document.querySelector('[data-header-search]');
if (headerSearch) {
  headerSearch.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const query = headerSearch.value.trim();
      if (query) {
        window.location.href = `./movies.html?q=${encodeURIComponent(query)}`;
      }
    }
  });
}

const heroSlides = [...document.querySelectorAll('[data-hero-slide]')];
const heroDots = [...document.querySelectorAll('[data-hero-dot]')];
let heroIndex = 0;
let heroTimer = null;

function showHero(index) {
  if (!heroSlides.length) {
    return;
  }
  heroIndex = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, current) => slide.classList.toggle('active', current === heroIndex));
  heroDots.forEach((dot, current) => dot.classList.toggle('active', current === heroIndex));
}

function startHero() {
  if (heroSlides.length < 2) {
    return;
  }
  clearInterval(heroTimer);
  heroTimer = setInterval(() => showHero(heroIndex + 1), 5200);
}

heroDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    showHero(index);
    startHero();
  });
});

showHero(0);
startHero();

const filterRoot = document.querySelector('[data-filter-root]');
if (filterRoot) {
  const input = filterRoot.querySelector('[data-filter-input]');
  const category = filterRoot.querySelector('[data-filter-category]');
  const year = filterRoot.querySelector('[data-filter-year]');
  const type = filterRoot.querySelector('[data-filter-type]');
  const cards = [...document.querySelectorAll('[data-movie-card]')];
  const empty = document.querySelector('[data-empty-state]');
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('q');

  if (input && initialQuery) {
    input.value = initialQuery;
  }

  function applyFilters() {
    const query = input ? input.value.trim().toLowerCase() : '';
    const selectedCategory = category ? category.value : '';
    const selectedYear = year ? year.value : '';
    const selectedType = type ? type.value : '';
    let visibleCount = 0;

    cards.forEach((card) => {
      const haystack = (card.dataset.search || '').toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      const matchesCategory = !selectedCategory || card.dataset.category === selectedCategory;
      const matchesYear = !selectedYear || card.dataset.year === selectedYear;
      const matchesType = !selectedType || card.dataset.type === selectedType;
      const visible = matchesQuery && matchesCategory && matchesYear && matchesType;
      card.style.display = visible ? '' : 'none';
      if (visible) {
        visibleCount += 1;
      }
    });

    if (empty) {
      empty.style.display = visibleCount ? 'none' : 'block';
    }
  }

  [input, category, year, type].filter(Boolean).forEach((control) => {
    control.addEventListener('input', applyFilters);
    control.addEventListener('change', applyFilters);
  });

  applyFilters();
}

const players = [...document.querySelectorAll('[data-player]')];
players.forEach((player) => {
  const video = player.querySelector('video');
  const overlay = player.querySelector('[data-play-overlay]');
  const source = player.dataset.source;

  async function startPlayback() {
    if (!video || !source) {
      return;
    }

    overlay?.classList.add('hidden');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }

    try {
      await video.play();
    } catch (error) {
      video.controls = true;
      overlay?.classList.remove('hidden');
      console.warn('Playback needs user interaction or network access.', error);
    }
  }

  overlay?.addEventListener('click', startPlayback);
});

const backTop = document.querySelector('[data-back-top]');
if (backTop) {
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
