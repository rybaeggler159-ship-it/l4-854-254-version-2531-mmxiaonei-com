(function () {
    function initMenu() {
        var button = document.querySelector('[data-menu-button]');
        var panel = document.querySelector('[data-menu-panel]');
        if (!button || !panel) {
            return;
        }
        button.addEventListener('click', function () {
            panel.classList.toggle('is-open');
        });
    }

    function initHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
        var thumbs = Array.prototype.slice.call(document.querySelectorAll('[data-hero-thumb]'));
        if (!slides.length || !thumbs.length) {
            return;
        }
        var index = 0;
        var timer = null;
        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            thumbs.forEach(function (thumb, i) {
                thumb.classList.toggle('is-active', i === index);
            });
        }
        function start() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }
        thumbs.forEach(function (thumb, i) {
            thumb.addEventListener('click', function () {
                show(i);
                start();
            });
        });
        start();
    }

    function card(movie) {
        var tags = movie.tags.slice(0, 3).map(function (tag) {
            return '<span>' + escapeHtml(tag) + '</span>';
        }).join('');
        return '<article class="movie-card">' +
            '<a class="movie-card__poster" href="video/' + movie.file + '" aria-label="' + escapeHtml(movie.title) + '">' +
            '<img src="' + movie.image + '" alt="' + escapeHtml(movie.title) + '海报" loading="lazy">' +
            '<span class="movie-card__score">' + movie.rating.toFixed(1) + '</span>' +
            '<span class="movie-card__play">播放</span>' +
            '</a>' +
            '<div class="movie-card__body">' +
            '<h3><a href="video/' + movie.file + '">' + escapeHtml(movie.title) + '</a></h3>' +
            '<p>' + escapeHtml(trimText(movie.oneLine, 84)) + '</p>' +
            '<div class="movie-card__meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.type) + '</span></div>' +
            '<div class="tag-row">' + tags + '</div>' +
            '</div>' +
            '</article>';
    }

    function trimText(text, length) {
        if (!text) {
            return '';
        }
        return text.length > length ? text.slice(0, length) + '…' : text;
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>"]/g, function (char) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;'
            }[char];
        });
    }

    function initSearch() {
        var results = document.querySelector('[data-search-results]');
        var input = document.querySelector('[data-search-input]');
        if (!results || !input || !window.SITE_MOVIES) {
            return;
        }
        var year = document.querySelector('[data-year-filter]');
        var region = document.querySelector('[data-region-filter]');
        var type = document.querySelector('[data-type-filter]');
        var category = document.querySelector('[data-category-filter]');
        var summary = document.querySelector('[data-search-summary]');
        var button = document.querySelector('[data-search-button]');
        var reset = document.querySelector('[data-reset-button]');
        var params = new URLSearchParams(window.location.search);
        if (params.get('q')) {
            input.value = params.get('q');
        }
        function match(movie) {
            var query = input.value.trim().toLowerCase();
            var haystack = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.oneLine, movie.tags.join(' ')].join(' ').toLowerCase();
            if (query && haystack.indexOf(query) === -1) {
                return false;
            }
            if (year.value && movie.year !== year.value) {
                return false;
            }
            if (region.value && movie.region !== region.value) {
                return false;
            }
            if (type.value && movie.type !== type.value) {
                return false;
            }
            if (category.value && movie.category !== category.value) {
                return false;
            }
            return true;
        }
        function render() {
            var matched = window.SITE_MOVIES.filter(match).slice(0, 120);
            results.innerHTML = matched.map(card).join('');
            summary.textContent = '以下为当前筛选结果。';
        }
        [input, year, region, type, category].forEach(function (field) {
            field.addEventListener('input', render);
            field.addEventListener('change', render);
        });
        button.addEventListener('click', render);
        reset.addEventListener('click', function () {
            input.value = '';
            year.value = '';
            region.value = '';
            type.value = '';
            category.value = '';
            render();
        });
        render();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMenu();
        initHero();
        initSearch();
    });
})();
