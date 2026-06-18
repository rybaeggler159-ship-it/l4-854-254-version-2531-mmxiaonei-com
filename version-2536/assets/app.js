(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var button = document.querySelector("[data-menu-button]");
        var nav = document.querySelector("[data-mobile-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function setupFilters() {
        var panels = document.querySelectorAll("[data-filter-panel]");
        panels.forEach(function (panel) {
            var list = panel.parentElement.querySelector("[data-filter-list]");
            if (!list) {
                return;
            }
            var cards = Array.prototype.slice.call(list.querySelectorAll("[data-filter-card]"));
            var search = panel.querySelector("[data-filter-search]");
            var region = panel.querySelector("[data-filter-region]");
            var type = panel.querySelector("[data-filter-type]");
            var category = panel.querySelector("[data-filter-category]");
            var clear = panel.querySelector("[data-filter-clear]");

            function valueOf(element) {
                return element ? element.value.trim().toLowerCase() : "";
            }

            function textOf(card) {
                return [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-type"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-category"),
                    card.textContent
                ].join(" ").toLowerCase();
            }

            function matches(card) {
                var allText = textOf(card);
                var searchText = valueOf(search);
                var regionText = valueOf(region);
                var typeText = valueOf(type);
                var categoryText = valueOf(category);
                return (!searchText || allText.indexOf(searchText) !== -1) &&
                    (!regionText || allText.indexOf(regionText) !== -1) &&
                    (!typeText || allText.indexOf(typeText) !== -1) &&
                    (!categoryText || allText.indexOf(categoryText) !== -1);
            }

            function apply() {
                cards.forEach(function (card) {
                    card.classList.toggle("is-filter-hidden", !matches(card));
                });
            }

            [search, region, type, category].forEach(function (element) {
                if (!element) {
                    return;
                }
                element.addEventListener("input", apply);
                element.addEventListener("change", apply);
            });

            if (clear) {
                clear.addEventListener("click", function () {
                    [search, region, type, category].forEach(function (element) {
                        if (element) {
                            element.value = "";
                        }
                    });
                    apply();
                });
            }
        });
    }

    ready(function () {
        setupMenu();
        setupFilters();
    });
})();
