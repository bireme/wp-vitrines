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
})();
