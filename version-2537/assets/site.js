const menuButton = document.querySelector(".mobile-menu-button");
const mobileNav = document.querySelector(".mobile-nav");

if (menuButton && mobileNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

const hero = document.querySelector("[data-hero]");

if (hero) {
  const slides = Array.from(hero.querySelectorAll(".hero-slide"));
  const dots = Array.from(hero.querySelectorAll(".hero-dot"));
  let current = 0;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === current);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
  });

  if (slides.length > 1) {
    window.setInterval(() => showSlide(current + 1), 5200);
  }
}

const searchInput = document.getElementById("siteSearch");
const cards = Array.from(document.querySelectorAll("[data-search-card]"));
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
const emptyState = document.querySelector("[data-empty-state]");
let activeFilter = "";

const normalize = (value) => String(value || "").trim().toLowerCase();

const applyFilters = () => {
  if (!cards.length) {
    return;
  }

  const query = normalize(searchInput ? searchInput.value : "");
  const filter = normalize(activeFilter);
  let visible = 0;

  cards.forEach((card) => {
    const text = normalize(card.getAttribute("data-search"));
    const matchedQuery = !query || text.includes(query);
    const matchedFilter = !filter || text.includes(filter);
    const shouldShow = matchedQuery && matchedFilter;
    card.hidden = !shouldShow;
    if (shouldShow) {
      visible += 1;
    }
  });

  if (emptyState) {
    emptyState.hidden = visible !== 0;
  }
};

if (searchInput) {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");
  if (query) {
    searchInput.value = query;
  }
  searchInput.addEventListener("input", applyFilters);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.getAttribute("data-filter") || "";
    filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    applyFilters();
  });
});

applyFilters();
