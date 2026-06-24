/**
 * Vitrine Builder – Frontend JS
 */
(function () {
    'use strict';

    document.addEventListener('click', function (e) {
        var header = e.target.closest('.vitrine-toggle-header');
        if (!header) return;

        var item = header.closest('.vitrine-toggle-item');
        if (!item) return;

        item.classList.toggle('is-open');
    });

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function observeRevealElements(selector, onVisible) {
        var elements = document.querySelectorAll(selector);
        if (!elements.length) return;

        var reduceMotion = prefersReducedMotion();

        elements.forEach(function (el) {
            if (reduceMotion) {
                el.classList.add('is-reveal-ready', 'is-reveal-visible');
                if (typeof onVisible === 'function') onVisible(el, true);
                return;
            }

            el.classList.add('is-reveal-ready');

            if (!('IntersectionObserver' in window)) {
                if (typeof onVisible === 'function') onVisible(el, false);
                return;
            }

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    observer.unobserve(entry.target);
                    if (typeof onVisible === 'function') onVisible(entry.target, false);
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -5% 0px'
            });

            observer.observe(el);
        });
    }

    /* ── Containers: aparecem ao rolar ── */

    function getContainerChildBlocks(container) {
        var inner = container.querySelector('.vitrine-container-inner');
        if (inner) {
            return inner.querySelectorAll(':scope > .vitrine-block');
        }
        return container.querySelectorAll(':scope > .vitrine-block');
    }

    function playContainerReveal(container) {
        if (container.classList.contains('is-reveal-visible')) return;

        container.classList.add('is-reveal-visible');

        var children = getContainerChildBlocks(container);
        var baseDelay = 180;
        var step = 90;

        children.forEach(function (child, index) {
            child.classList.add('vitrine-reveal-child');
            child.style.setProperty('--reveal-delay', (baseDelay + index * step) + 'ms');
        });
    }

    function initContainerReveal() {
        observeRevealElements('.vitrine-container--reveal', playContainerReveal);
    }

    /* ── Aranha Grade: animação de entrada ── */

    function getA3CardZone(card) {
        if (card.closest('.vitrine-a3-band--top')) return 'top';
        if (card.closest('.vitrine-a3-band--bottom')) return 'bottom';
        if (card.closest('.vitrine-a3-side--left')) return 'left';
        if (card.closest('.vitrine-a3-side--right')) return 'right';

        var frame = card.closest('.vitrine-a3-frame--inline');
        if (frame) {
            var cards = frame.querySelectorAll('.vitrine-a3-cell--card');
            if (cards[0] === card) return 'left';
            if (cards[1] === card) return 'right';
        }

        return 'bottom';
    }

    function playAranha3Entry(el) {
        if (el.classList.contains('is-a3-visible')) return;

        el.classList.add('is-a3-visible');

        var image = el.querySelector('.vitrine-a3-cell--image');
        if (image) {
            requestAnimationFrame(function () {
                image.classList.add('is-a3-in');
            });
        }

        var cards = el.querySelectorAll('.vitrine-a3-cell--card');
        var baseDelay = 460;
        var step = 65;

        cards.forEach(function (card, index) {
            card.setAttribute('data-a3-from', getA3CardZone(card));
            card.style.setProperty('--a3-delay', (baseDelay + index * step) + 'ms');
            card.classList.add('is-a3-in');
        });
    }

    function initAranha3Animations() {
        var blocks = document.querySelectorAll('.vitrine-el-aranha3.vitrine-a3--animate');
        if (!blocks.length) return;

        var reduceMotion = prefersReducedMotion();

        blocks.forEach(function (el) {
            if (reduceMotion) {
                el.classList.add('is-a3-ready', 'is-a3-visible');
                return;
            }

            el.classList.add('is-a3-ready');

            if (!('IntersectionObserver' in window)) {
                playAranha3Entry(el);
                return;
            }

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    observer.unobserve(entry.target);
                    playAranha3Entry(entry.target);
                });
            }, {
                threshold: 0.12,
                rootMargin: '0px 0px -4% 0px'
            });

            observer.observe(el);
        });
    }

    function initScrollAnimations() {
        initContainerReveal();
        initAranha3Animations();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollAnimations);
    } else {
        initScrollAnimations();
    }
})();
