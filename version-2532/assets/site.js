(function () {
    var navButton = document.querySelector('[data-menu-toggle]');
    var navLinks = document.querySelector('[data-nav-links]');

    if (navButton && navLinks) {
        navButton.addEventListener('click', function () {
            navLinks.classList.toggle('open');
        });
    }

    document.querySelectorAll('[data-site-search]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input[name="q"]');
            var query = input ? input.value.trim() : '';
            var target = form.getAttribute('action') || 'search.html';
            if (query) {
                window.location.href = target + '?q=' + encodeURIComponent(query);
            } else {
                window.location.href = target;
            }
        });
    });

    var slider = document.querySelector('[data-hero-slider]');
    if (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        var index = 0;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === index);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var nextIndex = Number(dot.getAttribute('data-hero-dot')) || 0;
                showSlide(nextIndex);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(index + 1);
            }, 5600);
        }
    }

    var list = document.querySelector('[data-card-list]');
    var searchInput = document.querySelector('[data-search-input]');
    var filterSelect = document.querySelector('[data-filter-select]');
    var sortSelect = document.querySelector('[data-sort-select]');

    if (list && (searchInput || filterSelect || sortSelect)) {
        var cards = Array.prototype.slice.call(list.querySelectorAll('[data-movie-card]'));
        var params = new URLSearchParams(window.location.search);
        var queryValue = params.get('q') || '';

        if (searchInput && queryValue) {
            searchInput.value = queryValue;
        }

        function normalized(value) {
            return String(value || '').toLowerCase();
        }

        function applyFilter() {
            var query = normalized(searchInput ? searchInput.value : '');
            var filter = normalized(filterSelect ? filterSelect.value : '');

            cards.forEach(function (card) {
                var haystack = normalized([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-year')
                ].join(' '));
                var typeText = normalized(card.getAttribute('data-type'));
                var regionText = normalized(card.getAttribute('data-region'));
                var matchesQuery = !query || haystack.indexOf(query) !== -1;
                var matchesFilter = !filter || typeText === filter || regionText === filter;
                card.classList.toggle('is-hidden', !(matchesQuery && matchesFilter));
            });
        }

        function applySort() {
            var mode = sortSelect ? sortSelect.value : 'default';
            var sorted = cards.slice();

            if (mode === 'year-desc' || mode === 'year-asc') {
                sorted.sort(function (a, b) {
                    var ya = Number(a.getAttribute('data-year')) || 0;
                    var yb = Number(b.getAttribute('data-year')) || 0;
                    return mode === 'year-desc' ? yb - ya : ya - yb;
                });
            }

            sorted.forEach(function (card) {
                list.appendChild(card);
            });
            applyFilter();
        }

        if (searchInput) {
            searchInput.addEventListener('input', applyFilter);
        }
        if (filterSelect) {
            filterSelect.addEventListener('change', applyFilter);
        }
        if (sortSelect) {
            sortSelect.addEventListener('change', applySort);
        }
        applySort();
    }

    var hlsPromise;

    function loadHls() {
        if (window.Hls) {
            return Promise.resolve(window.Hls);
        }
        if (hlsPromise) {
            return hlsPromise;
        }
        hlsPromise = new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';
            script.onload = function () {
                resolve(window.Hls);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
        return hlsPromise;
    }

    document.querySelectorAll('[data-player]').forEach(function (shell) {
        var video = shell.querySelector('video');
        var button = shell.querySelector('.play-overlay');
        var streamUrl = shell.getAttribute('data-stream');
        var prepared = false;

        function prepareAndPlay() {
            if (!video || !streamUrl) {
                return;
            }

            function playVideo() {
                shell.classList.add('is-playing');
                video.play().catch(function () {});
            }

            if (prepared) {
                playVideo();
                return;
            }

            prepared = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
                video.addEventListener('loadedmetadata', playVideo, { once: true });
                video.load();
            } else {
                loadHls().then(function (Hls) {
                    if (Hls && Hls.isSupported()) {
                        var hls = new Hls({ enableWorker: true });
                        hls.loadSource(streamUrl);
                        hls.attachMedia(video);
                        hls.on(Hls.Events.MANIFEST_PARSED, playVideo);
                    } else {
                        video.src = streamUrl;
                        video.addEventListener('loadedmetadata', playVideo, { once: true });
                        video.load();
                    }
                }).catch(function () {
                    video.src = streamUrl;
                    video.addEventListener('loadedmetadata', playVideo, { once: true });
                    video.load();
                });
            }
        }

        if (button) {
            button.addEventListener('click', prepareAndPlay);
        }
        if (video) {
            video.addEventListener('play', function () {
                shell.classList.add('is-playing');
            });
            video.addEventListener('pause', function () {
                if (video.currentTime === 0) {
                    shell.classList.remove('is-playing');
                }
            });
        }
    });
})();
