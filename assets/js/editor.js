/**
 * Vitrine Builder – Editor JS
 *
 * - Containers obrigatórios na raiz do canvas
 * - Drag & drop com SortableJS (nesting)
 * - Redimensionamento de largura via divisor entre elementos (porcentagem)
 * - Larguras em % totalizando 100% dentro de containers row
 * - Redimensionamento de altura (borda inferior)
 * - Salvamento via AJAX
 */
(function ($) {
    'use strict';

    /* ──────────────────────────── Estado ──────────────────────────── */

    var layout     = vitrineData.layout || [];
    var elements   = vitrineData.elements || {};
    var selectedId = null;
    var collapsedContainerIds = {};
    var rawPage = vitrineData.pageSettings || {};
    var pageSettings = {
        show_header:   rawPage.show_header !== undefined ? rawPage.show_header : '1',
        show_footer:   rawPage.show_footer !== undefined ? rawPage.show_footer : '1',
        page_bg_color: rawPage.page_bg_color || '',
        custom_css:    rawPage.custom_css || ''
    };

    /* ──────────── Listas de ícones para o picker ──────────── */

    var DASHICONS_LIST = [
        'dashicons-admin-appearance','dashicons-admin-comments','dashicons-admin-home',
        'dashicons-admin-media','dashicons-admin-network','dashicons-admin-page',
        'dashicons-admin-plugins','dashicons-admin-settings','dashicons-admin-site',
        'dashicons-admin-users','dashicons-awards','dashicons-building',
        'dashicons-businessman','dashicons-calendar','dashicons-camera',
        'dashicons-cart','dashicons-chart-area','dashicons-chart-bar',
        'dashicons-chart-line','dashicons-chart-pie','dashicons-clipboard',
        'dashicons-clock','dashicons-controls-play','dashicons-desktop',
        'dashicons-download','dashicons-edit','dashicons-email',
        'dashicons-email-alt2','dashicons-feedback','dashicons-filter',
        'dashicons-flag','dashicons-format-image','dashicons-format-video',
        'dashicons-groups','dashicons-hammer','dashicons-heart',
        'dashicons-id','dashicons-images-alt','dashicons-info',
        'dashicons-instagram','dashicons-laptop','dashicons-layout',
        'dashicons-lightbulb','dashicons-list-view','dashicons-location',
        'dashicons-location-alt','dashicons-lock','dashicons-marker',
        'dashicons-menu','dashicons-microphone','dashicons-money',
        'dashicons-networking','dashicons-palmtree','dashicons-performance',
        'dashicons-phone','dashicons-plus','dashicons-portfolio',
        'dashicons-products','dashicons-rss','dashicons-saved',
        'dashicons-schedule','dashicons-search','dashicons-share',
        'dashicons-shield','dashicons-smartphone','dashicons-smiley',
        'dashicons-star-empty','dashicons-star-filled','dashicons-sticky',
        'dashicons-store','dashicons-tag','dashicons-tablet',
        'dashicons-thumbs-up','dashicons-tickets-alt','dashicons-twitter',
        'dashicons-upload','dashicons-vault','dashicons-video-alt3',
        'dashicons-visibility','dashicons-warning','dashicons-yes',
        'dashicons-youtube'
    ];

    var FA_ICONS_LIST = [
        'fas fa-address-book','fas fa-anchor','fas fa-award',
        'fas fa-ban','fas fa-bars','fas fa-bell',
        'fas fa-bolt','fas fa-book','fas fa-bookmark',
        'fas fa-briefcase','fas fa-building','fas fa-bullhorn',
        'fas fa-bullseye','fas fa-calendar','fas fa-camera',
        'fas fa-certificate','fas fa-chart-bar','fas fa-chart-line',
        'fas fa-chart-pie','fas fa-check','fas fa-check-circle',
        'fas fa-clock','fas fa-cloud','fas fa-code',
        'fas fa-cog','fas fa-comment','fas fa-comments',
        'fas fa-compass','fas fa-crown','fas fa-cube',
        'fas fa-database','fas fa-desktop','fas fa-download',
        'fas fa-envelope','fas fa-exclamation-circle','fas fa-eye',
        'fas fa-fire','fas fa-flag','fas fa-flask',
        'fas fa-folder','fas fa-gem','fas fa-gift',
        'fas fa-globe','fas fa-graduation-cap','fas fa-handshake',
        'fas fa-hashtag','fas fa-headphones','fas fa-heart',
        'fas fa-home','fas fa-image','fas fa-info-circle',
        'fas fa-key','fas fa-laptop','fas fa-layer-group',
        'fas fa-leaf','fas fa-lightbulb','fas fa-link',
        'fas fa-list','fas fa-location-dot','fas fa-lock',
        'fas fa-medal','fas fa-mobile','fas fa-money-bill',
        'fas fa-music','fas fa-network-wired','fas fa-palette',
        'fas fa-paper-plane','fas fa-pen','fas fa-percent',
        'fas fa-phone','fas fa-plane','fas fa-play',
        'fas fa-plug','fas fa-plus','fas fa-puzzle-piece',
        'fas fa-circle-question','fas fa-recycle','fas fa-rocket',
        'fas fa-rss','fas fa-magnifying-glass','fas fa-share',
        'fas fa-shield','fas fa-signal','fas fa-sliders',
        'fas fa-smile','fas fa-star','fas fa-store',
        'fas fa-tag','fas fa-tags','fas fa-thumbs-up',
        'fas fa-ticket','fas fa-toolbox','fas fa-trophy',
        'fas fa-truck','fas fa-tv','fas fa-umbrella',
        'fas fa-upload','fas fa-user','fas fa-users',
        'fas fa-video','fas fa-wallet','fas fa-wifi',
        'fas fa-wrench',
        'fab fa-facebook','fab fa-instagram','fab fa-linkedin',
        'fab fa-x-twitter','fab fa-whatsapp','fab fa-youtube',
        'fab fa-tiktok','fab fa-pinterest','fab fa-github'
    ];

    function getDashiconsList() {
        if (vitrineData.iconPicker && vitrineData.iconPicker.dashicons && vitrineData.iconPicker.dashicons.length) {
            return vitrineData.iconPicker.dashicons;
        }
        return DASHICONS_LIST;
    }

    function getFaIconsList() {
        if (vitrineData.iconPicker && vitrineData.iconPicker.fontawesome && vitrineData.iconPicker.fontawesome.length) {
            return vitrineData.iconPicker.fontawesome;
        }
        return FA_ICONS_LIST;
    }

    function populateIconGrid($grid, tab) {
        if (!$grid || !$grid.length) return;
        var html = '';
        if (tab === 'dashicons') {
            getDashiconsList().forEach(function (d) {
                html += '<button type="button" class="vitrine-icon-pick" data-icon="' + escapeAttr(d) + '" title="' + escapeAttr(d) + '"><span class="dashicons ' + escapeAttr(d) + '"></span></button>';
            });
        } else if (tab === 'fa') {
            getFaIconsList().forEach(function (f) {
                html += '<button type="button" class="vitrine-icon-pick" data-icon="' + escapeAttr(f) + '" title="' + escapeAttr(f) + '"><i class="' + escapeAttr(f) + '"></i></button>';
            });
        }
        $grid.html(html);
    }

    function ensureIconGrid($picker, tab) {
        if (!$picker || !$picker.length || tab === 'upload') return;
        var $panel = $picker.find('.vitrine-icon-tab-panel[data-panel="' + tab + '"]');
        if (!$panel.length || $panel.data('grid-loaded')) return;
        $panel.data('grid-loaded', true);
        populateIconGrid($panel.find('.vitrine-icons-grid'), tab);
    }

    function isIconClass(icon) {
        return icon && (icon.indexOf('dashicons-') === 0 || /^fa[srlbd]?\s/.test(icon));
    }

    function renderIconPreviewHtml(icon) {
        if (!icon) return '';
        if (icon.indexOf('dashicons-') === 0) {
            return '<span class="dashicons ' + escapeAttr(icon) + '" style="font-size:30px;width:30px;height:30px;color:#0073aa;display:inline-block;"></span>';
        }
        if (/^fa[srlbd]?\s/.test(icon)) {
            return '<i class="' + escapeAttr(icon) + '" style="font-size:26px;color:#0073aa;"></i>';
        }
        return '<img src="' + escapeAttr(icon) + '" style="max-width:48px;max-height:48px;border-radius:3px;object-fit:contain;display:block;" />';
    }

    /* ──────────────────── Helpers ──────────────────── */

    function uid() {
        return 'el_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    function findItemById(id, items) {
        items = items || layout;
        for (var i = 0; i < items.length; i++) {
            if (items[i].id === id) return items[i];
            if (items[i].children && items[i].children.length) {
                var found = findItemById(id, items[i].children);
                if (found) return found;
            }
        }
        return null;
    }

    function removeItemById(id, items) {
        items = items || layout;
        for (var i = 0; i < items.length; i++) {
            if (items[i].id === id) {
                items.splice(i, 1);
                return true;
            }
            if (items[i].children && removeItemById(id, items[i].children)) {
                return true;
            }
        }
        return false;
    }

    function insertAfterById(afterId, newItem, items) {
        items = items || layout;
        for (var i = 0; i < items.length; i++) {
            if (items[i].id === afterId) {
                items.splice(i + 1, 0, newItem);
                return true;
            }
            if (items[i].children && insertAfterById(afterId, newItem, items[i].children)) {
                return true;
            }
        }
        return false;
    }

    function findParentArray(id, items) {
        items = items || layout;
        for (var i = 0; i < items.length; i++) {
            if (items[i].id === id) return items;
            if (items[i].children) {
                var found = findParentArray(id, items[i].children);
                if (found) return found;
            }
        }
        return null;
    }

    function findParentContainer(id, items) {
        items = items || layout;
        for (var i = 0; i < items.length; i++) {
            if (items[i].children) {
                for (var j = 0; j < items[i].children.length; j++) {
                    if (items[i].children[j].id === id) return items[i];
                }
                var found = findParentContainer(id, items[i].children);
                if (found) return found;
            }
        }
        return null;
    }

    function createItem(type) {
        var elDef = elements[type];
        var item = {
            id: uid(),
            type: type,
            settings: JSON.parse(JSON.stringify(elDef ? elDef.defaults : {})),
            height: 0,
            width: ''
        };
        if (type === 'container') {
            item.children = [];
        }
        return item;
    }

    function getContainerDisplayName(settings) {
        var name = settings && settings.name ? String(settings.name).trim() : '';
        return name || 'Container';
    }

    function getContainerPreviewLabel(settings) {
        var dirLabel = (settings.direction === 'row') ? 'Linha (→)' : 'Coluna (↓)';
        var cFull = settings.full_width_bg === '1' || settings.full_width_bg === 1;
        return getContainerDisplayName(settings) + ' – ' + dirLabel + (cFull ? ' · Fundo largura total' : '');
    }

    function getBlockToolbarLabel(item, elDef) {
        if (item.type === 'container') {
            return getContainerDisplayName($.extend({}, elDef.defaults, item.settings));
        }
        return elDef.label;
    }

    function isAranhaType(type) {
        return type === 'aranha2' || type === 'aranha3';
    }

    function containerContainsAranha(container) {
        if (!container || !container.children || !container.children.length) {
            return false;
        }
        for (var i = 0; i < container.children.length; i++) {
            var child = container.children[i];
            if (isAranhaType(child.type)) {
                return true;
            }
            if (child.type === 'container' && containerContainsAranha(child)) {
                return true;
            }
        }
        return false;
    }

    function enforceContainerColumnForAranha(container) {
        if (!container || container.type !== 'container' || !containerContainsAranha(container)) {
            return;
        }
        if (container.settings.direction === 'row') {
            container.settings.direction = 'column';
            clearWidths(container.id);
        }
    }

    function enforceAllContainerAranhaLayouts(items) {
        items = items || layout;
        items.forEach(function (item) {
            if (item.type === 'container') {
                enforceContainerColumnForAranha(item);
                if (item.children && item.children.length) {
                    enforceAllContainerAranhaLayouts(item.children);
                }
            }
        });
    }

    /**
     * Distribui larguras igualmente entre filhos de um container row.
     */
    function distributeWidths(containerId) {
        var container = findItemById(containerId);
        if (!container || !container.children || !container.children.length) return;
        if (!container.settings || container.settings.direction !== 'row') return;

        var n   = container.children.length;
        var pct = Math.floor(10000 / n) / 100;
        var sum = 0;
        for (var i = 0; i < n - 1; i++) {
            container.children[i].width = pct + '%';
            sum += pct;
        }
        container.children[n - 1].width = (Math.round((100 - sum) * 100) / 100) + '%';
    }

    /**
     * Redistribui proporcionalmente (preserva proporções relativas após remoção).
     */
    function redistributeProportional(containerId) {
        var container = findItemById(containerId);
        if (!container || !container.children || !container.children.length) return;
        if (!container.settings || container.settings.direction !== 'row') return;

        var children = container.children;
        var total = 0;
        children.forEach(function (c) { total += parseFloat(c.width) || 0; });

        if (total <= 0) { distributeWidths(containerId); return; }

        var sum = 0;
        for (var i = 0; i < children.length - 1; i++) {
            var p = Math.round(((parseFloat(children[i].width) || 0) / total * 100) * 100) / 100;
            children[i].width = p + '%';
            sum += p;
        }
        children[children.length - 1].width = (Math.round((100 - sum) * 100) / 100) + '%';
    }

    /**
     * Limpa larguras (quando container muda para column).
     */
    function clearWidths(containerId) {
        var container = findItemById(containerId);
        if (!container || !container.children) return;
        container.children.forEach(function (c) { c.width = ''; });
    }

    /* ──────────────────── Templates ──────────────────── */

    var vitrineTemplates = [
        {
            name: 'Vitrine Completa',
            desc: 'Aranha + Texto + Toggle + Texto + Banner',
            items: [
                { type: 'aranha3' },
                { type: 'text', overrides: { content: '<p>Escreva um texto descritivo aqui...</p>' } },
                { type: 'toggle' },
                { type: 'text', overrides: { content: '<p>Mais informações sobre o assunto...</p>' } },
                { type: 'image' }
            ]
        },
        {
            name: 'Texto + Imagem',
            desc: 'Título + Texto + Imagem',
            items: [
                { type: 'title' },
                { type: 'text' },
                { type: 'image' }
            ]
        },
        {
            name: 'FAQ',
            desc: 'Título + Toggle (accordion)',
            items: [
                { type: 'title', overrides: { text: 'Perguntas Frequentes' } },
                { type: 'toggle' }
            ]
        }
    ];

    function applyTemplate(tplIndex) {
        var tpl = vitrineTemplates[tplIndex];
        if (!tpl) return;

        layout.length = 0;

        tpl.items.forEach(function (tplItem) {
            var container = createItem('container');
            var child = createItem(tplItem.type);
            if (tplItem.overrides) {
                $.extend(child.settings, tplItem.overrides);
            }
            container.children.push(child);
            layout.push(container);
        });

        renderCanvas();
        renderSettings();
    }

    /* ──────────────────── Renderização do Canvas ──────────────────── */

    function syncCollapsedContainerIdsFromDOM() {
        var next = {};
        $('#vitrine-canvas .vitrine-canvas-block--container.is-collapsed').each(function () {
            var id = $(this).data('id');
            if (id) {
                next[id] = true;
            }
        });
        collapsedContainerIds = next;
    }

    function applyCollapsedContainers($canvas) {
        $.each(collapsedContainerIds, function (id) {
            $canvas.find('.vitrine-canvas-block--container[data-id="' + id + '"]').addClass('is-collapsed');
        });
    }

    function purgeCollapsedContainerIdsForItem(item) {
        if (!item) return;
        if (item.type === 'container') {
            delete collapsedContainerIds[item.id];
            if (item.children && item.children.length) {
                item.children.forEach(purgeCollapsedContainerIdsForItem);
            }
        }
    }

    function renderCanvas() {
        enforceAllContainerAranhaLayouts();
        syncCollapsedContainerIdsFromDOM();
        var $canvas = $('#vitrine-canvas');
        $canvas.empty();

        if (!layout.length) {
            var tplHtml = '<div class="vitrine-template-picker">';
            tplHtml += '<p class="vitrine-template-picker__title">Escolha um template para começar</p>';
            tplHtml += '<div class="vitrine-template-picker__grid">';
            vitrineTemplates.forEach(function (tpl, idx) {
                tplHtml += '<button type="button" class="vitrine-template-picker__item" data-tpl-idx="' + idx + '">';
                tplHtml += '<strong>' + escapeHtml(tpl.name) + '</strong>';
                tplHtml += '<span>' + escapeHtml(tpl.desc) + '</span>';
                tplHtml += '</button>';
            });
            tplHtml += '</div>';
            tplHtml += '<p class="vitrine-template-picker__hint">Ou arraste containers da sidebar para começar do zero</p>';
            tplHtml += '</div>';
            $canvas.append(tplHtml);
        } else {
            renderItems(layout, $canvas);
            applyCollapsedContainers($canvas);
        }

        if (selectedId) {
            $canvas.find('[data-id="' + selectedId + '"]').first().addClass('is-selected');
        }

        initAllSortables();
    }

    /**
     * Renderiza itens recursivamente.
     */
    function renderItems(items, $parent, parentItem) {
        var isRowContainer = parentItem && parentItem.type === 'container' &&
            parentItem.settings && parentItem.settings.direction === 'row';

        items.forEach(function (item, index) {
            var elDef = elements[item.type];
            if (!elDef) return;

            var settings    = $.extend({}, elDef.defaults, item.settings);
            var heightStyle = item.height ? 'min-height:' + item.height + 'px;' : '';
            var isContainer = item.type === 'container';
            var isFullBg    = isContainer && (settings.full_width_bg === '1' || settings.full_width_bg === 1);
            var customCss   = (item.settings && item.settings.custom_css) ? item.settings.custom_css : '';

            // Largura em flex para filhos de row container
            var widthStyle = '';
            var widthBadgeHtml = '';
            if (isRowContainer && item.width) {
                widthStyle = 'flex:0 1 ' + escapeAttr(item.width) + ';max-width:' + escapeAttr(item.width) + ';min-width:0;box-sizing:border-box;';
                var pctNum = Math.round(parseFloat(item.width));
                widthBadgeHtml = '<span class="vitrine-width-badge">' + pctNum + '%</span>';
            }

            var blockBgStyle = '';
            if (isFullBg) {
                if (settings.bg_image) {
                    blockBgStyle = 'background-image:url(' + escapeAttr(settings.bg_image) + ');background-size:' + escapeAttr(settings.bg_size || 'cover') + ';background-position:center;background-repeat:no-repeat;';
                } else {
                    blockBgStyle = 'background-color:' + escapeAttr(settings.bg_color || '#f5f5f5') + ';';
                }
            }

            var html =
                '<div class="vitrine-canvas-block' +
                    (isContainer ? ' vitrine-canvas-block--container' + (isFullBg ? ' vitrine-canvas-block--full-bg' : '') : '') +
                    (isRowContainer ? ' vitrine-canvas-block--in-row' : '') +
                '" data-id="' + item.id + '" data-type="' + item.type + '" style="' + heightStyle + widthStyle + blockBgStyle + escapeAttr(customCss) + '">' +
                    '<div class="vitrine-block-toolbar">' +
                        '<span class="vitrine-drag-handle dashicons dashicons-move"></span>' +
                        '<span class="vitrine-block-label">' + escapeHtml(getBlockToolbarLabel(item, elDef)) + '</span>' +
                        widthBadgeHtml +
                        (isContainer && !containerContainsAranha(item) ? (function() {
                            var dir = settings.direction || 'column';
                            var isRow = dir === 'row';
                            return '<button type="button" class="vitrine-dir-toggle" title="Alternar layout do container" data-id="' + escapeAttr(item.id) + '">' +
                                '<span class="dashicons ' + (isRow ? 'dashicons-grid-view' : 'dashicons-menu') + '"></span>' +
                                '<span class="vitrine-dir-label">' + (isRow ? 'Linhas' : 'Colunas') + '</span>' +
                            '</button>';
                        })() : '') +
                        (isContainer ? '<button type="button" class="vitrine-block-collapse" title="Colapsar/Expandir"><span class="dashicons dashicons-arrow-down-alt2"></span></button>' : '') +
                        '<button type="button" class="vitrine-block-duplicate" title="Duplicar">' +
                            '<span class="dashicons dashicons-admin-page"></span>' +
                        '</button>' +
                        '<button type="button" class="vitrine-block-remove" title="Remover">' +
                            '<span class="dashicons dashicons-trash"></span>' +
                        '</button>' +
                    '</div>' +
                    '<div class="vitrine-block-preview"' + (function () {
                        var previewBg = getTextBlockPreviewBgStyle(item.type, settings);
                        return previewBg ? ' style="' + previewBg + '"' : '';
                    })() + '>' +
                        buildPreview(item.type, settings) +
                    '</div>' +
                    (isContainer ? (function() {
                        var dropStyle = 'gap:' + parseInt(settings.gap || 0, 10) + 'px;align-items:' + escapeAttr(settings.align_items || 'stretch') + ';';
                        if (!isFullBg) {
                            if (settings.bg_image) {
                                dropStyle += 'background-image:url(' + escapeAttr(settings.bg_image) + ');background-size:' + escapeAttr(settings.bg_size || 'cover') + ';background-position:center;background-repeat:no-repeat;';
                            } else {
                                dropStyle += 'background-color:' + escapeAttr(settings.bg_color || '#f5f5f5') + ';';
                            }
                        }
                        return '<div class="vitrine-container-drop' + (settings.direction === 'row' ? ' vitrine-container-drop--row' : '') + (isFullBg ? ' vitrine-container-drop--boxed' : '') + '" data-parent-id="' + item.id + '" style="' + dropStyle + '"></div>';
                    })() : '') +
                    '<div class="vitrine-resize-handle"></div>' +
                '</div>';

            var $block = $(html);
            $parent.append($block);

            if (isContainer && item.children && item.children.length) {
                var $drop = $block.find('> .vitrine-container-drop');
                renderItems(item.children, $drop, item);
            }

            // Divisor como IRMÃO entre blocos (fora do bloco, no flex container)
            if (isRowContainer && index < items.length - 1) {
                var nextItem = items[index + 1];
                $parent.append('<div class="vitrine-col-divider" data-left-id="' + item.id + '" data-right-id="' + nextItem.id + '"></div>');
            }
        });
    }

    function buildAranhaEditorPlaceholder(type) {
        var icons = { aranha2: 'dashicons-chart-pie', aranha3: 'dashicons-grid-view' };
        var labels = { aranha2: 'Aranha Circular', aranha3: 'Aranha Grade' };
        return '<div class="vitrine-block-preview-placeholder vitrine-block-preview-placeholder--aranha">' +
            '<span class="dashicons ' + (icons[type] || 'dashicons-layout') + '"></span>' +
            '<span class="vitrine-block-preview-placeholder__label">' + escapeHtml(labels[type] || type) + '</span>' +
            '<small>Configure no painel lateral · visualização no frontend</small>' +
        '</div>';
    }

    function isWhiteTextColor(color) {
        var c = String(color || '').trim().toLowerCase();
        if (c === 'white') return true;
        if (/^#fff(f{3})?$/i.test(c)) return true;
        return /^rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)$/i.test(c);
    }

    function getTextBlockPreviewBgStyle(type, settings) {
        if (type !== 'text') return '';
        var bg = String(settings.bg_color || '').trim();
        if (bg) {
            return 'background:' + escapeAttr(bg) + ';';
        }
        return isWhiteTextColor(settings.color) ? 'background:#000;' : '';
    }

    function refreshBlockPreview($block, type, settings) {
        $block.html(buildPreview(type, settings));
        var bgStyle = getTextBlockPreviewBgStyle(type, settings);
        if (bgStyle) {
            $block.attr('style', bgStyle);
        } else if (type === 'text') {
            $block.removeAttr('style');
        }
    }

    /**
     * Preview simplificado de cada tipo de elemento dentro do canvas.
     */
    function buildPreview(type, settings) {
        if (type === 'aranha2' || type === 'aranha3') {
            return buildAranhaEditorPlaceholder(type);
        }

        switch (type) {
            case 'title':
                var tag = settings.tag || 'h2';
                return '<' + tag + ' style="color:' + escapeAttr(settings.color || '#333') + ';font-size:' + parseInt(settings.font_size || 28, 10) + 'px;text-align:' + escapeAttr(settings.align || 'left') + '">' + escapeHtml(settings.text || '') + '</' + tag + '>';
            case 'text':
                return '<div class="vitrine-el-text" style="color:' + escapeAttr(settings.color || '#555') + ';font-size:' + parseInt(settings.font_size || 16, 10) + 'px;text-align:' + escapeAttr(settings.align || 'left') + ';--vitrine-text-color:' + escapeAttr(settings.color || '#555') + ';--vitrine-text-size:' + parseInt(settings.font_size || 16, 10) + 'px;">' + (settings.content || '') + '</div>';
            case 'textimage': {
                var tiTag   = settings.title_tag || 'h2';
                var tiTitle = settings.title || '';
                var tiCont  = settings.content || '';
                var tiBg    = escapeAttr(settings.bg_color || '#f8f8f6');
                var tiPad   = parseInt(settings.padding || 32, 10);
                var tiRad   = parseInt(settings.border_radius || 8, 10);
                var tiGap   = parseInt(settings.gap || 24, 10);
                var tiTitCl = escapeAttr(settings.title_color || '#1a1a1a');
                var tiTitSz = parseInt(settings.title_font_size || 28, 10);
                var tiTxtCl = escapeAttr(settings.content_color || '#555555');
                var tiTxtSz = parseInt(settings.content_font_size || 16, 10);
                var tiImgW  = Math.max(20, Math.min(60, parseInt(settings.image_width || 42, 10)));
                var tiTxtW  = 100 - tiImgW;
                var tiImgPos = settings.image_position === 'left' ? 'row-reverse' : 'row';
                var tiHtml  = '<div style="background:' + tiBg + ';padding:' + tiPad + 'px;border-radius:' + tiRad + 'px;">';
                tiHtml += '<div style="display:flex;flex-direction:' + tiImgPos + ';align-items:center;gap:' + tiGap + 'px;">';
                tiHtml += '<div style="flex:1 1 ' + tiTxtW + '%;min-width:0;">';
                if (tiTitle) {
                    tiHtml += '<' + tiTag + ' style="margin:0 0 8px;color:' + tiTitCl + ';font-size:' + tiTitSz + 'px;line-height:1.25;">' + escapeHtml(tiTitle) + '</' + tiTag + '>';
                }
                if (tiCont) {
                    tiHtml += '<div style="color:' + tiTxtCl + ';font-size:' + tiTxtSz + 'px;line-height:1.6;">' + tiCont + '</div>';
                }
                tiHtml += '</div>';
                tiHtml += '<div style="flex:0 0 ' + tiImgW + '%;min-width:0;">';
                if (settings.image) {
                    tiHtml += '<img src="' + escapeAttr(settings.image) + '" style="width:100%;height:auto;border-radius:6px;display:block;" alt="" />';
                } else {
                    tiHtml += '<div style="background:#e8e8e4;border-radius:6px;min-height:80px;display:flex;align-items:center;justify-content:center;color:#aaa;font-size:10px;">Imagem</div>';
                }
                tiHtml += '</div></div></div>';
                return tiHtml;
            }
            case 'imagelinks': {
                var ilImgH    = Math.max(60, Math.min(280, parseInt(settings.image_height || 220, 10)));
                var ilImgFit  = settings.image_fit === 'contain' ? 'contain' : 'cover';
                var ilCapBg   = escapeAttr(settings.caption_bg || '#000000');
                var ilCapCl   = escapeAttr(settings.caption_color || '#ffffff');
                var ilCapSz   = parseInt(settings.caption_font_size || 16, 10);
                var ilCap     = settings.caption || '';
                var ilBoxBg   = escapeAttr(settings.box_bg || '#e8e8e8');
                var ilBoxTit  = settings.box_title || '';
                var ilTitCl   = escapeAttr(settings.box_title_color || '#333333');
                var ilTitSz   = parseInt(settings.box_title_font_size || 16, 10);
                var ilContent = getImagelinksContent(settings);
                var ilTextCl  = escapeAttr(settings.content_color || settings.link_color || '#333333');
                var ilTextSz  = parseInt(settings.content_font_size || settings.link_font_size || 14, 10);
                var ilSepCl   = escapeAttr(settings.separator_color || '#333333');
                var ilPad     = parseInt(settings.box_padding || 16, 10);

                var ilHtml = '<div style="max-width:100%;overflow:hidden;font-family:inherit;">';
                ilHtml += '<div style="height:' + ilImgH + 'px;background:#ddd;overflow:hidden;">';
                if (settings.image) {
                    ilHtml += '<img src="' + escapeAttr(settings.image) + '" style="width:100%;height:100%;object-fit:' + ilImgFit + ';object-position:center;display:block;" alt="" />';
                } else {
                    ilHtml += '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#999;font-size:10px;">Imagem</div>';
                }
                ilHtml += '</div>';
                if (ilCap) {
                    ilHtml += '<div style="background:' + ilCapBg + ';color:' + ilCapCl + ';font-size:' + ilCapSz + 'px;font-weight:700;text-align:center;padding:8px 10px;line-height:1.3;">' + escapeHtml(ilCap) + '</div>';
                }
                if (ilBoxTit || ilContent) {
                    ilHtml += '<div style="background:' + ilBoxBg + ';padding:' + ilPad + 'px;">';
                    if (ilBoxTit) {
                        ilHtml += '<div style="color:' + ilTitCl + ';font-size:' + ilTitSz + 'px;font-weight:700;margin:0 0 8px;line-height:1.3;">' + escapeHtml(ilBoxTit) + '</div>';
                    }
                    if (ilBoxTit && ilContent) {
                        ilHtml += '<hr style="border:none;border-top:1px solid ' + ilSepCl + ';margin:0 0 8px;" />';
                    }
                    if (ilContent) {
                        ilHtml += '<div style="color:' + ilTextCl + ';font-size:' + ilTextSz + 'px;line-height:1.5;">' + ilContent + '</div>';
                    }
                    ilHtml += '</div>';
                }
                ilHtml += '</div>';
                return ilHtml;
            }
            case 'image':
                if (settings.url) {
                    return '<div style="text-align:' + escapeAttr(settings.align || 'center') + '"><img src="' + escapeAttr(settings.url) + '" style="max-width:' + parseInt(settings.width || 100, 10) + '%;height:auto;" alt="" /></div>';
                }
                return '<p style="text-align:center;color:#999;">Nenhuma imagem selecionada</p>';
            case 'button':
                return '<div style="text-align:' + escapeAttr(settings.align || 'center') + '"><span style="display:inline-block;padding:10px 24px;background:' + escapeAttr(settings.bg_color || '#0073aa') + ';color:' + escapeAttr(settings.color || '#fff') + ';border-radius:4px;">' + escapeHtml(settings.text || 'Botão') + '</span></div>';
            case 'shortcode': {
                var scContent = (settings.content || '').trim();
                var scAlign   = escapeAttr(settings.align || 'left');
                if (!scContent) {
                    return '<div style="text-align:center;color:#999;font-size:12px;padding:12px;border:1px dashed #c3c4c7;border-radius:4px;">Cole um shortcode no painel</div>';
                }
                return '<div style="text-align:' + scAlign + ';padding:10px 12px;border:1px dashed #8c8f94;border-radius:4px;background:#f6f7f7;">'
                    + '<div style="font-size:10px;color:#646970;margin-bottom:4px;">Shortcode (executado no frontend)</div>'
                    + '<code style="display:block;font-size:11px;color:#1d2327;word-break:break-all;white-space:pre-wrap;">' + escapeHtml(scContent) + '</code>'
                    + '</div>';
            }
            case 'container':
                var cBg = 'background-color:' + escapeAttr(settings.bg_color || '#f5f5f5') + ';';
                if (settings.bg_image) {
                    cBg += 'background-image:url(' + escapeAttr(settings.bg_image) + ');background-size:' + escapeAttr(settings.bg_size || 'cover') + ';background-position:center;';
                }
                var cFull = settings.full_width_bg === '1' || settings.full_width_bg === 1;
                var cLabel = getContainerPreviewLabel(settings);
                if (cFull) {
                    return '<div style="' + cBg + 'padding:6px 0;margin:0 -8px;"><div style="max-width:' + parseInt(settings.max_width || 1200, 10) + 'px;margin:0 auto;padding:0 8px;"><div class="vitrine-container-label" style="padding:4px 10px;font-size:11px;color:#666;">' + escapeHtml(cLabel) + '</div></div></div>';
                }
                return '<div class="vitrine-container-label" style="' + cBg + 'padding:4px 10px;font-size:11px;color:#666;border-radius:3px 3px 0 0;">' + escapeHtml(cLabel) + '</div>';
            case 'toggle':
                var tItems = settings.items || [];
                if (!tItems.length) {
                    return '<div style="color:#999;font-size:12px;text-align:center;padding:8px;">Nenhum toggle adicionado</div>';
                }
                var tHtml = '';
                tItems.forEach(function (ti, ti_idx) {
                    var tTitle = ti.title || '(sem título)';
                    tHtml += '<div style="display:flex;align-items:center;gap:6px;padding:4px 8px;background:' + escapeAttr(settings.header_bg || '#f5f5f5') + ';border-bottom:1px solid ' + escapeAttr(settings.border_color || '#dcdcde') + ';font-size:12px;color:' + escapeAttr(settings.header_color || '#333') + ';">';
                    tHtml += '<span style="color:' + escapeAttr(settings.icon_color || '#0073aa') + ';font-weight:700;">+</span> ';
                    tHtml += '<span>' + escapeHtml(tTitle) + '</span>';
                    tHtml += '</div>';
                });
                return '<div style="border:1px solid ' + escapeAttr(settings.border_color || '#dcdcde') + ';border-radius:4px;overflow:hidden;">' + tHtml + '</div>';
            case 'video':
                var vSrc = settings.source || 'youtube';
                var vUrl = (vSrc === 'youtube') ? (settings.youtube_url || '') : (settings.local_url || '');
                if (!vUrl) {
                    return '<div style="text-align:center;padding:16px;color:#999;font-size:12px;"><span class="dashicons dashicons-video-alt3" style="font-size:28px;display:block;margin:0 auto 4px;"></span>Nenhum v\u00eddeo selecionado</div>';
                }
                if (vSrc === 'youtube') {
                    var ytId = '';
                    var ytMatch = vUrl.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
                    if (ytMatch) ytId = ytMatch[1];
                    else if (/^[a-zA-Z0-9_-]{11}$/.test(vUrl)) ytId = vUrl;
                    if (ytId) {
                        return '<div style="text-align:center;"><img src="https://img.youtube.com/vi/' + escapeAttr(ytId) + '/hqdefault.jpg" style="max-width:100%;height:auto;border-radius:4px;" alt="" /><div style="font-size:11px;color:#666;margin-top:4px;">YouTube: ' + escapeHtml(ytId) + '</div></div>';
                    }
                    return '<div style="text-align:center;color:#d63638;font-size:12px;">URL do YouTube inv\u00e1lida</div>';
                }
                return '<div style="text-align:center;padding:8px;"><video src="' + escapeAttr(vUrl) + '" style="max-width:100%;max-height:120px;border-radius:4px;" muted></video><div style="font-size:11px;color:#666;margin-top:4px;">V\u00eddeo local</div></div>';

            default:
                return '<p>' + escapeHtml(type) + '</p>';
        }
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    function escapeAttr(str) {
        return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function safeTextareaHtml(str) {
        return String(str || '').replace(/<\/textarea/gi, '&lt;/textarea');
    }

    function getImagelinksContent(settings) {
        if (settings.content) {
            return settings.content;
        }
        var items = settings.items || [];
        if (!items.length) {
            return '';
        }
        var html = '';
        items.forEach(function (li) {
            if (!li.label) return;
            if (li.url) {
                html += '<p style="margin:0 0 6px;line-height:1.45;"><a href="' + escapeAttr(li.url) + '">' + escapeHtml(li.label) + '</a></p>';
            } else {
                html += '<p style="margin:0 0 6px;line-height:1.45;">' + escapeHtml(li.label) + '</p>';
            }
        });
        return html;
    }

    /* ──────────────────── Sortable (drag & drop) ──────────────────── */

    var sortableInstances = [];

    function destroyAllSortables() {
        sortableInstances.forEach(function (s) {
            if (s && s.destroy) s.destroy();
        });
        sortableInstances = [];
    }

    function initAllSortables() {
        destroyAllSortables();

        var elList = document.getElementById('vitrine-element-list');
        if (elList) {
            sortableInstances.push(Sortable.create(elList, {
                group: { name: 'vitrine', pull: 'clone', put: false },
                sort: false,
                animation: 200
            }));
        }

        var canvas = document.getElementById('vitrine-canvas');
        if (canvas) {
            sortableInstances.push(createDropZone(canvas, null));
        }

        $('.vitrine-container-drop').each(function () {
            var parentId = $(this).data('parent-id');
            sortableInstances.push(createDropZone(this, parentId));
        });
    }

    function createDropZone(el, parentId) {
        return Sortable.create(el, {
            group: { name: 'vitrine', put: true },
            handle: '.vitrine-drag-handle',
            draggable: '.vitrine-canvas-block, .vitrine-element-item',
            animation: 200,
            ghostClass: 'vitrine-ghost',
            fallbackOnBody: true,
            swapThreshold: 0.65,
            onAdd: function (evt) { handleDrop(evt, false); },
            onUpdate: function (evt) { handleDrop(evt, true); }
        });
    }

    /**
     * Processa o drop.
     * - Não-containers na raiz → auto-encapsulados em container row.
     * - Ao adicionar/mover em row container → redistribui larguras.
     */
    function handleDrop(evt, isSameList) {
        var $item      = $(evt.item);
        var $to        = $(evt.to);
        var isNew      = $item.hasClass('vitrine-element-item');
        var toIsCanvas = evt.to.id === 'vitrine-canvas';
        var toParentId = $to.data('parent-id') || null;
        var targetArray = toIsCanvas ? layout : getChildrenArray(toParentId);

        if (!targetArray) { renderCanvas(); return; }

        // Calcula o índice correto ignorando divisores (conta apenas blocos antes do item)
        var realIndex = $item.prevAll('.vitrine-canvas-block').length;

        if (isNew) {
            var type    = $item.data('type');
            var newItem = createItem(type);

            if (toIsCanvas && type !== 'container') {
                // Auto-wrap em container row
                var wrapper = createItem('container');
                wrapper.settings.direction = 'row';
                wrapper.children.push(newItem);
                newItem.width = '100%';
                targetArray.splice(realIndex, 0, wrapper);
                selectedId = newItem.id;
            } else {
                targetArray.splice(realIndex, 0, newItem);
                selectedId = newItem.id;
                if (toParentId) {
                    var parentAfterAdd = findItemById(toParentId);
                    if (parentAfterAdd) enforceContainerColumnForAranha(parentAfterAdd);
                    if (parentAfterAdd && parentAfterAdd.settings.direction === 'row') {
                        distributeWidths(toParentId);
                    }
                }
            }
        } else {
            var draggedId   = $item.data('id');
            var draggedItem = findItemById(draggedId);
            if (!draggedItem) { renderCanvas(); return; }

            if (isSameList) {
                // Reordenação no mesmo container: preserva larguras
                removeItemById(draggedId);
                targetArray = toIsCanvas ? layout : getChildrenArray(toParentId);
                if (!targetArray) { renderCanvas(); return; }
                targetArray.splice(realIndex, 0, draggedItem);
            } else {
                // Movendo entre listas diferentes
                var oldParent = findParentContainer(draggedId);
                var oldParentId = oldParent ? oldParent.id : null;

                removeItemById(draggedId);
                if (oldParentId) redistributeProportional(oldParentId);

                targetArray = toIsCanvas ? layout : getChildrenArray(toParentId);
                if (!targetArray) { renderCanvas(); return; }

                if (toIsCanvas && draggedItem.type !== 'container') {
                    var wrapper2 = createItem('container');
                    wrapper2.settings.direction = 'row';
                    wrapper2.children.push(draggedItem);
                    draggedItem.width = '100%';
                    targetArray.splice(realIndex, 0, wrapper2);
                } else {
                    targetArray.splice(realIndex, 0, draggedItem);
                    if (toParentId) {
                        var parentAfterMove = findItemById(toParentId);
                        if (parentAfterMove) enforceContainerColumnForAranha(parentAfterMove);
                        if (parentAfterMove && parentAfterMove.settings.direction === 'row') {
                            distributeWidths(toParentId);
                        }
                    }
                }
            }
        }

        renderCanvas();
        renderSettings();
    }

    function getChildrenArray(parentId) {
        if (!parentId) return layout;
        var parent = findItemById(parentId);
        if (!parent) return null;
        if (!parent.children) parent.children = [];
        return parent.children;
    }

    /* ──────────────────── Seleção & Remoção ──────────────────── */

    $(document).on('click', '.vitrine-canvas-block', function (e) {
        e.stopPropagation();
        selectedId = $(this).data('id');
        $('.vitrine-canvas-block').removeClass('is-selected');
        $(this).addClass('is-selected');
        renderSettings();
    });

    $(document).on('click', '#vitrine-canvas', function (e) {
        if ($(e.target).closest('.vitrine-canvas-block').length === 0) {
            selectedId = null;
            $('.vitrine-canvas-block').removeClass('is-selected');
            renderSettings();
        }
    });

    $(document).on('click', '.vitrine-block-remove', function (e) {
        e.stopPropagation();
        var id = $(this).closest('.vitrine-canvas-block').data('id');

        var parentContainer = findParentContainer(id);
        var parentContainerId = parentContainer ? parentContainer.id : null;
        var removedItem = findItemById(id);

        purgeCollapsedContainerIdsForItem(removedItem);
        removeItemById(id);
        if (parentContainerId) redistributeProportional(parentContainerId);

        if (selectedId === id) selectedId = null;
        renderCanvas();
        renderSettings();
    });

    $(document).on('click', '.vitrine-dir-toggle', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var id   = $(this).data('id');
        var item = findItemById(id);
        if (!item) return;
        var newDir = (item.settings.direction === 'row') ? 'column' : 'row';
        item.settings.direction = newDir;
        if (newDir === 'row') {
            distributeWidths(id);
        } else {
            clearWidths(id);
        }
        renderCanvas();
        if (selectedId === id) renderSettings();
    });

    $(document).on('click', '.vitrine-block-collapse', function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        var $block = $(this).closest('.vitrine-canvas-block--container');
        var id = $block.data('id');
        $block.toggleClass('is-collapsed');
        if ($block.hasClass('is-collapsed')) {
            collapsedContainerIds[id] = true;
        } else {
            delete collapsedContainerIds[id];
        }
    });

    $(document).on('click', '.vitrine-block-duplicate', function (e) {
        e.stopPropagation();
        var id       = $(this).closest('.vitrine-canvas-block').data('id');
        var original = findItemById(id);
        if (!original) return;

        var parentContainer = findParentContainer(id);
        var parentContainerId = parentContainer ? parentContainer.id : null;

        var clone = deepCloneItem(original);
        insertAfterById(id, clone);

        if (parentContainerId) distributeWidths(parentContainerId);

        selectedId = clone.id;
        renderCanvas();
        renderSettings();
    });

    function deepCloneItem(item) {
        var clone = {
            id: uid(),
            type: item.type,
            settings: JSON.parse(JSON.stringify(item.settings)),
            height: item.height,
            width: item.width || ''
        };
        if (item.children && item.children.length) {
            clone.children = item.children.map(function (child) {
                return deepCloneItem(child);
            });
        } else if (item.type === 'container') {
            clone.children = [];
        }
        return clone;
    }

    /* ──────────────────── Redimensionamento de altura ──────────────────── */

    (function () {
        var resizing = false, startY = 0, startH = 0, $block = null, itemRef = null;

        $(document).on('mousedown', '.vitrine-resize-handle', function (e) {
            e.preventDefault();
            e.stopPropagation();
            resizing = true;
            $block   = $(this).closest('.vitrine-canvas-block');
            startY   = e.pageY;
            startH   = $block.outerHeight();
            itemRef  = findItemById($block.data('id'));
            $('body').addClass('vitrine-resizing');
        });

        $(document).on('mousemove', function (e) {
            if (!resizing) return;
            var newH = Math.max(40, startH + (e.pageY - startY));
            $block.css('min-height', newH + 'px');
        });

        $(document).on('mouseup', function () {
            if (!resizing) return;
            resizing = false;
            $('body').removeClass('vitrine-resizing');
            if (itemRef && $block) itemRef.height = Math.round($block.outerHeight());
        });
    })();

    /* ──────────────────── Redimensionamento de largura (divisor) ──────────────────── */

    (function () {
        var resizing      = false;
        var startX        = 0;
        var leftItem      = null;
        var rightItem     = null;
        var leftStartPct  = 0;
        var rightStartPct = 0;
        var currentLeftPct  = 0;
        var currentRightPct = 0;
        var $leftBlock    = null;
        var $rightBlock   = null;
        var containerW    = 0;

        $(document).on('mousedown', '.vitrine-col-divider', function (e) {
            e.preventDefault();
            e.stopPropagation();
            resizing = true;
            startX   = e.pageX;

            var leftId  = $(this).data('left-id');
            var rightId = $(this).data('right-id');
            leftItem    = findItemById(leftId);
            rightItem   = findItemById(rightId);

            $leftBlock  = $('[data-id="' + leftId + '"]').first();
            $rightBlock = $('[data-id="' + rightId + '"]').first();
            containerW  = $leftBlock.parent().innerWidth();

            leftStartPct   = parseFloat(leftItem.width) || 50;
            rightStartPct  = parseFloat(rightItem.width) || 50;
            currentLeftPct  = leftStartPct;
            currentRightPct = rightStartPct;

            $('body').addClass('vitrine-resizing-width');
        });

        $(document).on('mousemove', function (e) {
            if (!resizing) return;

            var deltaPct = ((e.pageX - startX) / containerW) * 100;
            var totalPct = leftStartPct + rightStartPct;
            var newLeft  = leftStartPct + deltaPct;
            var newRight = rightStartPct - deltaPct;

            // Mínimo 5% por elemento
            if (newLeft < 5)  { newLeft = 5; newRight = totalPct - 5; }
            if (newRight < 5) { newRight = 5; newLeft = totalPct - 5; }

            currentLeftPct  = Math.round(newLeft * 100) / 100;
            currentRightPct = Math.round(newRight * 100) / 100;

            // Aplica visualmente
            $leftBlock.css({ flex: '0 1 ' + currentLeftPct + '%', maxWidth: currentLeftPct + '%' });
            $rightBlock.css({ flex: '0 1 ' + currentRightPct + '%', maxWidth: currentRightPct + '%' });

            // Atualiza badges
            $leftBlock.find('.vitrine-width-badge').text(Math.round(currentLeftPct) + '%');
            $rightBlock.find('.vitrine-width-badge').text(Math.round(currentRightPct) + '%');
        });

        $(document).on('mouseup', function () {
            if (!resizing) return;
            resizing = false;
            $('body').removeClass('vitrine-resizing-width');

            if (leftItem && rightItem) {
                leftItem.width  = currentLeftPct + '%';
                rightItem.width = currentRightPct + '%';
            }

            renderCanvas();
            if (selectedId) renderSettings();

            leftItem    = null;
            rightItem   = null;
            $leftBlock  = null;
            $rightBlock = null;
        });
    })();

    /* ──────────────────── Sidebar de Configurações ──────────────────── */

    function renderSettings() {
        syncAllAranhaMCE();
        syncAllFieldMCE();
        destroyAllMCE();
        var $panel = $('#vitrine-settings-panel');
        $panel.empty();

        if (!selectedId) {
            $('#vitrine-settings-el-icon').attr('class', 'dashicons dashicons-admin-settings');
            $('#vitrine-settings-el-label').text('Configurações');
            $('#vitrine-settings-sidebar').removeClass('has-selection');
            $panel.html(
                '<div class="vitrine-settings-empty-state">' +
                    '<span class="dashicons dashicons-edit-large"></span>' +
                    '<p>Clique em um elemento no canvas para editar as suas configurações.</p>' +
                '</div>'
            );
            return;
        }

        var item = findItemById(selectedId);
        if (!item) return;

        var elDef = elements[item.type];
        if (!elDef) return;

        // Atualiza cabeçalho da sidebar com ícone e nome do elemento
        $('#vitrine-settings-el-icon').attr('class', 'dashicons ' + (elDef.icon || 'dashicons-admin-settings'));
        var settingsHeaderLabel = item.type === 'container'
            ? getContainerDisplayName($.extend({}, elDef.defaults, item.settings))
            : (elDef.label || 'Configurações');
        $('#vitrine-settings-el-label').text(settingsHeaderLabel);
        $('#vitrine-settings-sidebar').addClass('has-selection');

        var fields = elDef.fields;

        // Verifica se está dentro de um container row
        var parentContainer = findParentContainer(selectedId);
        var isInsideRowContainer = parentContainer &&
            parentContainer.settings && parentContainer.settings.direction === 'row';

        // Campo de largura para itens em row container
        if (isInsideRowContainer) {
            var widthVal = item.width || '';
            $panel.append(
                '<div class="vitrine-field-group vitrine-field-group--width">' +
                    '<label>Largura</label>' +
                    '<div class="vitrine-width-input-row">' +
                        '<input type="text" class="vitrine-field-width" value="' + escapeAttr(widthVal) + '" placeholder="auto" />' +
                        '<button type="button" class="button button-small vitrine-btn-distribute" title="Distribuir igualmente">&#8862;</button>' +
                    '</div>' +
                    '<p class="vitrine-field-hint">Arraste o divisor entre elementos para ajustar visualmente.</p>' +
                '</div>' +
                '<hr style="border:none;border-top:1px solid #dcdcde;margin:12px 0;" />'
            );
        }

        fields.forEach(function (field) {
            if (item.type === 'container' && field.name === 'direction' && containerContainsAranha(item)) {
                return;
            }

            if (item.type === 'aranha2' || item.type === 'aranha3') {
                var cardStyle = item.settings.card_style || 'default';
                var isPresetCard = cardStyle !== 'default';
                if (field.name === 'card_min_height' && !isPresetCard) {
                    return;
                }
                if (item.type === 'aranha3' && field.name === 'card_height' && isPresetCard) {
                    return;
                }
            }

            var val = item.settings[field.name] !== undefined ? item.settings[field.name] : (elDef.defaults[field.name] || '');
            var inputHtml = '';

            switch (field.type) {
                case 'textarea':
                    inputHtml = '<textarea id="vitrine-field-mce-' + escapeAttr(field.name) + '" class="vitrine-field-mce" data-field="' + escapeAttr(field.name) + '" rows="4">' + safeTextareaHtml(val) + '</textarea>';
                    if (item.type === 'imagelinks' && field.name === 'content') {
                        inputHtml += '<p class="vitrine-field-hint">Editor livre abaixo da imagem — negrito, itálico, links, listas etc.</p>';
                    }
                    break;
                case 'plaintextarea':
                    inputHtml = '<textarea class="vitrine-field vitrine-field-plaintextarea" data-field="' + escapeAttr(field.name) + '" rows="5" spellcheck="false" placeholder="[meu_shortcode attr=&quot;valor&quot;]">' + escapeHtml(val) + '</textarea>';
                    if (field.name === 'content' && item.type === 'shortcode') {
                        inputHtml += '<p class="vitrine-field-hint">Cole o shortcode do WordPress ou de outro plugin. Será executado na página publicada.</p>';
                    }
                    break;
                case 'number':
                    inputHtml = '<input type="number" class="vitrine-field" data-field="' + escapeAttr(field.name) + '" value="' + escapeAttr(val) + '" />';
                    break;
                case 'color':
                    if (item.type === 'text' && field.name === 'bg_color') {
                        var bgColorVal = val || '#ffffff';
                        inputHtml = '<div class="vitrine-color-row">' +
                            '<input type="color" class="vitrine-field vitrine-field-bg-color" data-field="bg_color" value="' + escapeAttr(bgColorVal) + '" />' +
                            (val ? '<button type="button" class="button button-small vitrine-field-bg-color-clear" title="Sem fundo">&#10005;</button>' : '') +
                        '</div>';
                    } else {
                        inputHtml = '<input type="color" class="vitrine-field" data-field="' + escapeAttr(field.name) + '" value="' + escapeAttr(val) + '" />';
                    }
                    break;
                case 'range': {
                    var rMin = field.min !== undefined ? field.min : 0;
                    var rMax = field.max !== undefined ? field.max : 100;
                    var rVal = val !== '' && val !== undefined ? val : rMin;
                    inputHtml = '<div class="vitrine-range-row">' +
                        '<input type="range" class="vitrine-field vitrine-field-range" data-field="' + escapeAttr(field.name) + '" min="' + rMin + '" max="' + rMax + '" value="' + escapeAttr(rVal) + '" />' +
                        '<span class="vitrine-range-val">' + escapeHtml(String(rVal)) + '</span>' +
                    '</div>';
                    break;
                }
                case 'select':
                    var opts = field.options || {};
                    inputHtml = '<select class="vitrine-field" data-field="' + escapeAttr(field.name) + '">';
                    for (var optKey in opts) {
                        if (opts.hasOwnProperty(optKey)) {
                            inputHtml += '<option value="' + escapeAttr(optKey) + '"' + (val === optKey ? ' selected' : '') + '>' + escapeHtml(opts[optKey]) + '</option>';
                        }
                    }
                    inputHtml += '</select>';
                    break;
                case 'image':
                    inputHtml =
                        '<div class="vitrine-image-field">' +
                            (val ? '<img src="' + escapeAttr(val) + '" class="vitrine-image-preview" />' : '') +
                            '<input type="hidden" class="vitrine-field" data-field="' + escapeAttr(field.name) + '" value="' + escapeAttr(val) + '" />' +
                            '<button type="button" class="button vitrine-select-image">Selecionar Imagem</button>' +
                            (val ? ' <button type="button" class="button vitrine-remove-image">Remover</button>' : '') +
                            '<input type="text" class="vitrine-image-url-input" placeholder="ou cole a URL da imagem" value="' + escapeAttr(val) + '" />' +
                        '</div>';
                    break;
                default:
                    inputHtml = '<input type="text" class="vitrine-field" data-field="' + escapeAttr(field.name) + '" value="' + escapeAttr(val) + '" />';
            }

            var extraClass = (field.type === 'textarea' || field.type === 'image') ? ' vitrine-field-group--full' : '';
            var fieldHint = '';
            if (item.type === 'container' && field.name === 'name') {
                fieldHint = '<p class="vitrine-field-hint">Aparece na barra do bloco no canvas para identificar cada container.</p>';
            }
            if ((item.type === 'aranha2' || item.type === 'aranha3') && field.name === 'card_min_height') {
                fieldHint = '<p class="vitrine-field-hint">Aplica-se aos modelos Escuro, Branco e Borda esquerda.</p>';
            }
            $panel.append(
                '<div class="vitrine-field-group' + extraClass + '">' +
                    '<label>' + escapeHtml(field.label) + '</label>' +
                    inputHtml +
                    fieldHint +
                '</div>'
            );
        });

        // ── Aranha Circular: itens radiais ──
        if (item.type === 'aranha2') {
            renderAranha2Repeater($panel, item);
        }

        // ── Aranha Grade: itens do grid ──
        if (item.type === 'aranha3') {
            renderAranha3Repeater($panel, item);
        }

        // ── Toggle: seção de itens repetíveis ──
        if (item.type === 'toggle') {
            renderToggleRepeater($panel, item);
        }

        // ── CSS Personalizado (todos os elementos) ──
        var customCss = item.settings.custom_css || '';
        $panel.append(
            '<hr style="border:none;border-top:1px solid #dcdcde;margin:4px 0;" />' +
            '<div class="vitrine-field-group vitrine-field-group--custom-css">' +
                '<label>CSS Personalizado</label>' +
                '<textarea class="vitrine-field" data-field="custom_css" rows="3" placeholder="ex: background: #f00; border-radius: 8px;">' + escapeHtml(customCss) + '</textarea>' +
                '<p class="vitrine-field-hint">Estilos aplicados diretamente neste elemento.</p>' +
            '</div>'
        );

        // Inicializa TinyMCE e drag-sort nos itens das aranhas
        if (item.type === 'aranha2' || item.type === 'aranha3') {
            setTimeout(initAranhaMCE, 50);
            setTimeout(initAranhaSort, 80);
        }

        // Inicializa TinyMCE nos campos textarea genéricos
        setTimeout(initFieldMCE, 50);

        // Inicializa TinyMCE nos campos do toggle
        if (item.type === 'toggle') {
            setTimeout(initToggleMCE, 50);
        }
    }

    /**
     * Renderiza a seção de itens repetíveis do toggle.
     */
    function renderToggleRepeater($panel, item) {
        if (!item.settings.items || !Array.isArray(item.settings.items)) {
            item.settings.items = [];
        }
        var items = item.settings.items;

        var html = '<div class="vitrine-toggle-section">';
        html += '<hr style="border:none;border-top:1px solid #dcdcde;margin:14px 0 10px;" />';
        html += '<h4 class="vitrine-repeater-section-title">Itens do Toggle (' + items.length + ')</h4>';

        items.forEach(function (ti, idx) {
            html += '<div class="vitrine-repeater-item vitrine-toggle-editor-item" data-toggle-idx="' + idx + '">';
            html += '<div class="vitrine-repeater-item-header">';
            html += '<span class="vitrine-repeater-item-num">' + (idx + 1) + '</span>';
            html += '<button type="button" class="button button-small vitrine-toggle-remove-item" title="Remover">&times;</button>';
            html += '</div>';
            html += '<div class="vitrine-field-group"><label>Título</label>';
            html += '<input type="text" class="vitrine-toggle-field" data-toggle-prop="title" value="' + escapeAttr(ti.title || '') + '" /></div>';
            html += '<div class="vitrine-field-group"><label>Conteúdo</label>';
            html += '<textarea id="vitrine-toggle-mce-' + idx + '" class="vitrine-toggle-mce" data-toggle-prop="content" rows="5">' + escapeHtml(ti.content || '') + '</textarea>';
            html += '</div>';
            html += '</div>';
        });

        html += '<button type="button" class="button vitrine-toggle-add-item">+ Adicionar Toggle</button>';
        html += '</div>';

        $panel.append(html);
    }

    /* ── TinyMCE helpers ── */

    var _skipMCESync = false;
    var aranhaSortInstances = [];

    function destroyAranhaSort() {
        aranhaSortInstances.forEach(function (s) {
            try {
                if (s && s.destroy) s.destroy();
            } catch (e) { /* ignore */ }
        });
        aranhaSortInstances = [];
    }

    function syncAranha3ItemsFromDOM(item) {
        var zones = ['left', 'top', 'right', 'bottom', 'auto'];
        var oldItems = item.settings.items || [];
        var newItems = [];

        zones.forEach(function (zone) {
            $('#vitrine-settings-panel .vitrine-aranha-items-list[data-aranha-zone="' + zone + '"]').each(function () {
                $(this).children('.vitrine-aranha-item').each(function () {
                    var idx = parseInt($(this).data('aranha-idx'), 10);
                    if (isNaN(idx) || !oldItems[idx]) return;
                    var it = $.extend(true, {}, oldItems[idx]);
                    it.position = zone === 'auto' ? 'auto' : zone;
                    newItems.push(it);
                });
            });
        });

        item.settings.items = newItems;
    }

    function handleAranhaSortEnd(evt, item) {
        var fromKey = $(evt.from).data('aranha-key');
        var toKey = $(evt.to).data('aranha-key');
        var oldIndex = evt.oldIndex;
        var newIndex = evt.newIndex;

        if (item.type === 'aranha3') {
            syncAranha3ItemsFromDOM(item);
            renderSettings();
            renderCanvas();
            return;
        }

        if (!fromKey || !toKey) return;

        if (item.type === 'aranha2') {
            var arr = item.settings[fromKey];
            if (!arr) return;
            var movedA2 = arr.splice(oldIndex, 1)[0];
            if (!movedA2) return;
            arr.splice(newIndex, 0, movedA2);
        }

        renderSettings();
        renderCanvas();
    }

    function destroyAllMCE() {
        destroyAranhaSort();
        _skipMCESync = true;
        $('.vitrine-aranha-mce, .vitrine-field-mce, .vitrine-toggle-mce').each(function () {
            var id = $(this).attr('id');
            if (id && typeof wp !== 'undefined' && wp.editor) {
                try { wp.editor.remove(id); } catch (e) {}
            }
        });
        _skipMCESync = false;
    }

    function initAranhaSort() {
        destroyAranhaSort();
        if (!selectedId) return;
        var item = findItemById(selectedId);
        if (!item || !isAranhaType(item.type)) return;

        var groupName = 'aranha-items-' + selectedId;

        $('#vitrine-settings-panel .vitrine-aranha-items-list').each(function () {
            var instance = Sortable.create(this, {
                group: { name: groupName, pull: true, put: true },
                handle: '.vitrine-aranha-drag',
                draggable: '.vitrine-aranha-item',
                animation: 150,
                ghostClass: 'vitrine-aranha-ghost',
                emptyInsertThreshold: 12,
                onEnd: function (evt) {
                    if (evt.oldIndex === evt.newIndex && evt.from === evt.to) return;
                    var current = findItemById(selectedId);
                    if (!current) return;
                    handleAranhaSortEnd(evt, current);
                }
            });
            aranhaSortInstances.push(instance);
        });
    }

    function aranhaMceId(key, idx, prop) {
        return 'vitrine-aranha-mce-' + String(key).replace(/_/g, '-') + '-' + idx + '-' + prop;
    }

    function stripHtmlPreview(html) {
        var div = document.createElement('div');
        div.innerHTML = html || '';
        return (div.textContent || div.innerText || '').trim();
    }

    function defaultAranhaItem(type) {
        if (type === 'aranha3') {
            return { title: '', text: '', icon: '', link: '', position: 'auto' };
        }
        if (type === 'aranha2') {
            return { title: '', text: '', icon: '', link: '' };
        }
        return { text: '', icon: '', link: '' };
    }

    function syncAllAranhaMCE() {
        if (_skipMCESync) return;
        $('.vitrine-aranha-mce').each(function () {
            var id = $(this).attr('id');
            if (id) {
                syncAranhaMCE(id, true);
            }
        });
    }

    function syncAllFieldMCE() {
        if (_skipMCESync) return;
        $('.vitrine-field-mce').each(function () {
            var id = $(this).attr('id');
            if (id) {
                syncFieldMCE(id);
            }
        });
    }

    function initAranhaMCE() {
        if (typeof wp === 'undefined' || !wp.editor) return;
        $('.vitrine-aranha-mce').each(function () {
            var id = $(this).attr('id');
            if (!id) return;
            if (typeof tinymce !== 'undefined' && tinymce.get(id)) return;

            wp.editor.initialize(id, {
                tinymce: {
                    toolbar1: 'bold,italic,underline,link,bullist,numlist,alignleft,aligncenter,alignright',
                    menubar: false,
                    branding: false,
                    resize: true,
                    height: 100,
                    setup: function (editor) {
                        editor.on('change keyup', function () {
                            editor.save();
                            syncAranhaMCE(editor.id);
                        });
                    }
                },
                quicktags: true,
                mediaButtons: false
            });
        });
    }

    function syncAranhaMCE(editorId, silent) {
        if (_skipMCESync) return;
        if (!selectedId) return;
        var item = findItemById(selectedId);
        if (!item) return;

        var $ta      = $('#' + editorId);
        if (!$ta.length) return;

        var $itemEl  = $ta.closest('.vitrine-aranha-item');
        var $section = $ta.closest('.vitrine-aranha-section');
        var key      = $section.data('aranha-key');
        var idx      = $itemEl.data('aranha-idx');
        var prop     = $ta.data('aranha-prop') || 'text';

        if (key === undefined || idx === undefined) return;

        if (!item.settings[key]) item.settings[key] = [];
        if (!item.settings[key][idx]) {
            item.settings[key][idx] = defaultAranhaItem(item.type);
        }

        var content = (typeof wp !== 'undefined' && wp.editor && wp.editor.getContent)
            ? wp.editor.getContent(editorId)
            : $ta.val();

        item.settings[key][idx][prop] = content;

        if (!silent && (prop === 'text' || prop === 'title')) {
            var preview = stripHtmlPreview(content);
            var fallback = prop === 'title' ? 'Card sem título' : 'Item sem rótulo';
            $itemEl.find('.vitrine-a2-item-preview-text').text(preview || fallback);
        }
    }

    function initFieldMCE() {
        if (typeof wp === 'undefined' || !wp.editor) return;
        $('.vitrine-field-mce').each(function () {
            var id = $(this).attr('id');
            if (!id) return;
            if (typeof tinymce !== 'undefined' && tinymce.get(id)) return;

            wp.editor.initialize(id, {
                tinymce: {
                    toolbar1: 'bold,italic,underline,link,bullist,numlist,alignleft,aligncenter,alignright',
                    menubar: false,
                    branding: false,
                    resize: true,
                    height: 160,
                    setup: function (editor) {
                        editor.on('change keyup', function () {
                            editor.save();
                            syncFieldMCE(editor.id);
                        });
                    }
                },
                quicktags: true,
                mediaButtons: false
            });
        });
    }

    function syncFieldMCE(editorId) {
        if (!selectedId) return;
        var item = findItemById(selectedId);
        if (!item) return;

        var $ta   = $('#' + editorId);
        var field = $ta.data('field');
        if (!field) return;

        var content = (typeof wp !== 'undefined' && wp.editor)
            ? wp.editor.getContent(editorId)
            : $ta.val();

        item.settings[field] = content;

        // Atualiza preview
        var $block = $('[data-id="' + selectedId + '"]').first().find('> .vitrine-block-preview');
        var elDef  = elements[item.type];
        if ($block.length && elDef) {
            var s = $.extend({}, elDef.defaults, item.settings);
            refreshBlockPreview($block, item.type, s);
        }
    }

    function initToggleMCE() {
        $('.vitrine-toggle-mce').each(function () {
            var id = $(this).attr('id');
            if (!id) return;
            wp.editor.initialize(id, {
                tinymce: {
                    toolbar1: 'bold,italic,underline,link,bullist,numlist',
                    menubar: false,
                    branding: false,
                    resize: false,
                    height: 120,
                    setup: function (editor) {
                        editor.on('change keyup', function () {
                            editor.save();
                            syncToggleMCE(editor.id);
                        });
                    }
                },
                quicktags: false,
                mediaButtons: false
            });
        });
    }

    function syncToggleMCE(editorId) {
        if (!selectedId) return;
        var item = findItemById(selectedId);
        if (!item) return;

        var $ta   = $('#' + editorId);
        var $tItem = $ta.closest('.vitrine-toggle-editor-item');
        var idx   = $tItem.data('toggle-idx');

        if (!item.settings.items) item.settings.items = [];
        if (!item.settings.items[idx]) item.settings.items[idx] = { title: '', content: '' };

        var content = (typeof wp !== 'undefined' && wp.editor)
            ? wp.editor.getContent(editorId)
            : $ta.val();

        item.settings.items[idx].content = content;

        // Atualiza preview
        var $block = $('[data-id="' + selectedId + '"]').first().find('> .vitrine-block-preview');
        var elDef  = elements[item.type];
        if ($block.length && elDef) {
            var s = $.extend(true, {}, elDef.defaults, item.settings);
            refreshBlockPreview($block, item.type, s);
        }
    }

    /**
     * Gera o HTML do picker de ícones (reutilizável).
     */
    function buildIconPickerHtml() {
        var h = '<div class="vitrine-icon-picker" style="display:none;">';
        h += '<div class="vitrine-icon-picker-tabs">';
        h += '<button type="button" class="vitrine-icon-tab is-active" data-tab="dashicons">Dashicons</button>';
        h += '<button type="button" class="vitrine-icon-tab" data-tab="fa">Font Awesome</button>';
        h += '<button type="button" class="vitrine-icon-tab" data-tab="upload">Imagem</button>';
        h += '</div>';
        h += '<div class="vitrine-icon-tab-panel" data-panel="dashicons">';
        h += '<input type="text" class="vitrine-icon-search" placeholder="Filtrar dashicons..." />';
        h += '<div class="vitrine-icons-grid"></div>';
        h += '</div>';
        h += '<div class="vitrine-icon-tab-panel" data-panel="fa" style="display:none;">';
        h += '<input type="text" class="vitrine-icon-search" placeholder="Filtrar ícones FA..." />';
        h += '<div class="vitrine-icons-grid"></div>';
        h += '</div>';
        h += '<div class="vitrine-icon-tab-panel" data-panel="upload" style="display:none;">';
        h += '<p class="vitrine-field-hint" style="margin:0 0 8px;">Use imagem apenas se não houver ícone adequado.</p>';
        h += '<button type="button" class="button vitrine-aranha-select-icon">Selecionar da Biblioteca</button>';
        h += '</div>';
        h += '</div>';
        return h;
    }

    /**
     * Painel de itens da Aranha Circular (aranha2) — UX redesenhado.
     * Layout dois colunas: ícone clicável à esquerda, rótulo + link à direita.
     */
    function renderAranha2Repeater($panel, item) {
        if (!item.settings.items || !Array.isArray(item.settings.items)) {
            item.settings.items = [];
        }
        var items = item.settings.items;

        items.forEach(function (ai) {
            if (!stripHtmlPreview(ai.title) && stripHtmlPreview(ai.text)) {
                ai.title = ai.text;
                ai.text = '';
            }
        });

        // Cabeçalho da seção
        var html = '<div class="vitrine-aranha-section vitrine-a2-section" data-aranha-key="items">';
        html += '<hr style="border:none;border-top:1px solid #dcdcde;margin:14px 0 12px;" />';
        html += '<div class="vitrine-a2-section-head">';
        html += '<div>';
        html += '<h4 class="vitrine-aranha-section-title">Itens Orbitais</h4>';
        html += '<p class="vitrine-a2-section-hint">Arraste para reordenar a posição de cada card no círculo.</p>';
        html += '</div>';
        html += '<span class="vitrine-a2-count-badge">' + items.length + '</span>';
        html += '</div>';

        // Lista de itens (drag-sortable)
        html += '<div class="vitrine-aranha-items-list vitrine-a2-items-list" data-aranha-key="items">';

        items.forEach(function (ai, idx) {
            html += buildAranhaCardItemHtml(ai, idx, 'aranha2');
        });

        html += '</div>'; // items-list

        // Botão adicionar
        html += '<button type="button" class="button vitrine-aranha-add-item vitrine-a2-add-btn">'
            + '<span class="dashicons dashicons-plus-alt2"></span> Adicionar Item'
            + '</button>';

        html += '</div>'; // section

        $panel.append(html);
    }

    function buildAranhaCardItemHtml(ai, idx, itemType) {
        var isGrade = itemType === 'aranha3';
        var itemClass = isGrade ? 'vitrine-a3-item' : 'vitrine-a2-item';
        var hasIcon = !!ai.icon;
        var hasLink = !!ai.link;
        var previewLabel = stripHtmlPreview(ai.title) || (isGrade ? ('Card ' + (idx + 1)) : ('Item ' + (idx + 1)));
        var html = '<div class="vitrine-aranha-item ' + itemClass + '" data-aranha-idx="' + idx + '">';

        html += '<div class="vitrine-a2-item-header">';
        html += '<span class="vitrine-aranha-drag dashicons dashicons-move" title="Arrastar para reordenar"></span>';
        html += '<span class="vitrine-aranha-item-num">' + (idx + 1) + '</span>';
        html += '<span class="vitrine-a2-item-preview-text">' + escapeHtml(previewLabel) + '</span>';
        if (hasIcon) { html += '<span class="vitrine-a2-badge vitrine-a2-badge--icon" title="Tem ícone"><span class="dashicons dashicons-format-image"></span></span>'; }
        if (hasLink) { html += '<span class="vitrine-a2-badge vitrine-a2-badge--link" title="Tem link"><span class="dashicons dashicons-admin-links"></span></span>'; }
        html += '<button type="button" class="button button-small vitrine-aranha-remove-item" title="Remover">&times;</button>';
        html += '</div>';

        html += '<div class="vitrine-a2-item-body vitrine-a3-item-body">';

        html += '<div class="vitrine-aranha-icon-field vitrine-a3-icon-row">';
        html += '<label class="vitrine-a3-icon-row-label">Ícone / Imagem do card</label>';
        html += '<div class="vitrine-a3-icon-row-inner">';
        var iconPreview = hasIcon
            ? renderIconPreviewHtml(ai.icon)
            : '<span class="dashicons dashicons-format-image" style="font-size:28px;width:28px;height:28px;color:#c3c4c7;"></span>';

        html += '<div class="vitrine-a2-icon-display vitrine-aranha-open-picker" title="Clique para escolher ícone ou imagem">';
        html += '<div class="vitrine-icon-current">' + iconPreview + '</div>';
        html += '<span class="vitrine-a2-icon-hint">' + (hasIcon ? 'Trocar' : 'Adicionar') + '</span>';
        html += '</div>';

        html += '<input type="hidden" class="vitrine-aranha-field" data-aranha-prop="icon" value="' + escapeAttr(ai.icon || '') + '" />';

        html += '<div class="vitrine-icon-actions vitrine-a2-icon-actions">';
        if (hasIcon) {
            html += '<button type="button" class="button vitrine-aranha-remove-icon">Remover</button>';
        }
        html += '</div>';

        html += buildIconPickerHtml();
        html += '</div>';
        html += '</div>';

        html += '<div class="vitrine-a3-fields-stack">';

        if (isGrade) {
            html += '<div class="vitrine-field-group vitrine-field-group--full">';
            html += '<label>Posição no grid</label>';
            html += '<select class="vitrine-aranha-field" data-aranha-prop="position">';
            var posVal = ai.position || 'auto';
            html += '<option value="auto"' + (posVal === 'auto' ? ' selected' : '') + '>Automático</option>';
            html += '<option value="top"' + (posVal === 'top' ? ' selected' : '') + '>Topo</option>';
            html += '<option value="bottom"' + (posVal === 'bottom' ? ' selected' : '') + '>Base</option>';
            html += '<option value="left"' + (posVal === 'left' ? ' selected' : '') + '>Esquerda</option>';
            html += '<option value="right"' + (posVal === 'right' ? ' selected' : '') + '>Direita</option>';
            html += '</select>';
            html += '<p class="vitrine-field-hint">Ou arraste o card para outra zona abaixo.</p>';
            html += '</div>';
        }

        html += '<div class="vitrine-field-group vitrine-field-group--full">';
        html += '<label>Título</label>';
        html += '<textarea id="' + aranhaMceId('items', idx, 'title') + '" class="vitrine-aranha-mce" data-aranha-prop="title" rows="3">' + (ai.title || '') + '</textarea>';
        html += '</div>';

        html += '<div class="vitrine-field-group vitrine-field-group--full">';
        html += '<label>Descrição</label>';
        html += '<textarea id="' + aranhaMceId('items', idx, 'text') + '" class="vitrine-aranha-mce" data-aranha-prop="text" rows="5">' + (ai.text || '') + '</textarea>';
        html += '</div>';

        html += '<div class="vitrine-field-group vitrine-field-group--full">';
        html += '<label><span class="dashicons dashicons-admin-links" style="font-size:13px;vertical-align:middle;margin-right:3px;color:#0073aa;"></span>Link <span style="font-weight:400;color:#8c8f94;">(opcional)</span></label>';
        html += '<input type="text" class="vitrine-aranha-field" data-aranha-prop="link"'
            + ' value="' + escapeAttr(ai.link || '') + '"'
            + ' placeholder="https://..." />';
        html += '<p class="vitrine-field-hint">Torna o card clicável.</p>';
        html += '</div>';

        html += '</div>';
        html += '</div>';
        html += '</div>';

        return html;
    }

    function buildAranha3ItemHtml(ai, idx) {
        return buildAranhaCardItemHtml(ai, idx, 'aranha3');
    }

    /* ──────────────────────────────────────────────────────
       Aranha Grade (aranha3) — repeater por zona do grid
    ────────────────────────────────────────────────────── */
    function renderAranha3Repeater($panel, item) {
        if (!item.settings.items || !Array.isArray(item.settings.items)) {
            item.settings.items = [];
        }
        var items = item.settings.items;
        var zones = [
            { id: 'left',   label: 'Esquerda' },
            { id: 'top',    label: 'Topo' },
            { id: 'right',  label: 'Direita' },
            { id: 'bottom', label: 'Base' },
            { id: 'auto',   label: 'Automático' }
        ];

        var html = '<div class="vitrine-aranha-section vitrine-a3-section" data-aranha-key="items">';
        html += '<hr style="border:none;border-top:1px solid #dcdcde;margin:14px 0 10px;" />';
        html += '<h4 class="vitrine-aranha-section-title" style="margin:0 0 4px;">Cards do Grid</h4>';
        html += '<p class="vitrine-field-hint" style="margin:0 0 12px;">Arraste os cards entre as zonas para definir onde aparecem no layout. Total: ' + items.length + '.</p>';

        zones.forEach(function (zone) {
            var zoneItems = [];
            items.forEach(function (ai, idx) {
                var pos = ai.position || 'auto';
                if (pos === zone.id) {
                    zoneItems.push({ ai: ai, idx: idx });
                }
            });

            html += '<div class="vitrine-aranha-zone-section vitrine-a3-zone" data-aranha-key="items" data-aranha-zone="' + zone.id + '">';
            html += '<h5 class="vitrine-aranha-zone-title">' + escapeHtml(zone.label) + ' <span class="vitrine-aranha-zone-count">(' + zoneItems.length + ')</span></h5>';
            html += '<div class="vitrine-aranha-items-list vitrine-a3-items-list" data-aranha-key="items" data-aranha-zone="' + zone.id + '">';

            zoneItems.forEach(function (entry) {
                html += buildAranha3ItemHtml(entry.ai, entry.idx);
            });

            html += '</div>';
            html += '<button type="button" class="button button-small vitrine-aranha-add-item vitrine-a3-add-btn">+ Adicionar em ' + escapeHtml(zone.label) + '</button>';
            html += '</div>';
        });

        html += '</div>';

        $panel.append(html);
    }

    /* ──────────────────── Event Handlers ──────────────────── */

    // Atualiza settings ao modificar campo
    $(document).on('input change', '.vitrine-field', function () {
        if (!selectedId) return;
        var item = findItemById(selectedId);
        if (!item) return;

        var field = $(this).data('field');
        var val   = $(this).val();
        var elDef = elements[item.type];
        item.settings[field] = val;

        if ($(this).hasClass('vitrine-field-range')) {
            $(this).closest('.vitrine-range-row').find('.vitrine-range-val').text(val);
        }

        // Mudou a direção do container
        if (item.type === 'container' && field === 'direction') {
            if (val === 'row') {
                distributeWidths(item.id);
            } else {
                clearWidths(item.id);
            }
            renderCanvas();
            renderSettings();
            return;
        }

        if ((item.type === 'aranha2' || item.type === 'aranha3') && field === 'card_style') {
            renderSettings();
            return;
        }

        if (item.type === 'container' && field === 'name') {
            var mergedSettings = $.extend({}, elDef.defaults, item.settings);
            var displayName = getContainerDisplayName(mergedSettings);
            var $rootBlock = $('[data-id="' + selectedId + '"]').first();
            $rootBlock.find('> .vitrine-block-toolbar .vitrine-block-label').text(displayName);
            $('#vitrine-settings-el-label').text(displayName);
        }

        // Re-renderiza preview do bloco selecionado
        var $block = $('[data-id="' + selectedId + '"]').first().find('> .vitrine-block-preview');
        if ($block.length && elDef) {
            var settings = $.extend({}, elDef.defaults, item.settings);
            refreshBlockPreview($block, item.type, settings);
        }

        if (item.type === 'text' && field === 'bg_color' && val) {
            var $colorInput = $(this);
            if (!$colorInput.siblings('.vitrine-field-bg-color-clear').length) {
                $colorInput.after('<button type="button" class="button button-small vitrine-field-bg-color-clear" title="Sem fundo">&#10005;</button>');
            }
        }
    });

    $(document).on('click', '.vitrine-field-bg-color-clear', function (e) {
        e.preventDefault();
        if (!selectedId) return;
        var item = findItemById(selectedId);
        if (!item || item.type !== 'text') return;

        item.settings.bg_color = '';
        $(this).siblings('.vitrine-field-bg-color').val('#ffffff');
        $(this).remove();

        var $block = $('[data-id="' + selectedId + '"]').first().find('> .vitrine-block-preview');
        var elDef  = elements[item.type];
        if ($block.length && elDef) {
            var settings = $.extend({}, elDef.defaults, item.settings);
            refreshBlockPreview($block, item.type, settings);
        }
    });

    // Atualiza largura manual
    $(document).on('input change', '.vitrine-field-width', function () {
        if (!selectedId) return;
        var item = findItemById(selectedId);
        if (!item) return;
        item.width = $(this).val().trim();

        var $block = $('[data-id="' + selectedId + '"]').first();
        if (item.width) {
            $block.css({ flex: '0 1 ' + item.width, maxWidth: item.width, minWidth: '0', boxSizing: 'border-box' });
        } else {
            $block.css({ flex: '', maxWidth: '', minWidth: '', boxSizing: '' });
        }
        $block.find('.vitrine-width-badge').text(Math.round(parseFloat(item.width) || 0) + '%');
    });

    // Botão distribuir igualmente
    $(document).on('click', '.vitrine-btn-distribute', function (e) {
        e.preventDefault();
        if (!selectedId) return;
        var parentContainer = findParentContainer(selectedId);
        if (parentContainer) {
            distributeWidths(parentContainer.id);
            renderCanvas();
            renderSettings();
        }
    });

    // Seletor de imagem/vídeo (WordPress Media Library)
    $(document).on('click', '.vitrine-select-image', function (e) {
        e.preventDefault();
        var $container = $(this).closest('.vitrine-image-field');
        var $input     = $container.find('.vitrine-field');
        var fieldName  = $input.data('field') || '';
        var isVideo    = fieldName === 'local_url';
        var mediaType  = isVideo ? 'video' : 'image';

        var frame = wp.media({
            title: isVideo ? 'Selecionar Vídeo' : 'Selecionar Imagem',
            multiple: false,
            library: { type: mediaType }
        });

        frame.on('select', function () {
            var attachment = frame.state().get('selection').first().toJSON();
            $input.val(attachment.url).trigger('change');
            $container.find('.vitrine-image-url-input').val(attachment.url);

            $container.find('.vitrine-image-preview').remove();
            $container.find('.vitrine-remove-image').remove();
            if (isVideo) {
                $container.prepend('<video src="' + escapeAttr(attachment.url) + '" class="vitrine-image-preview" style="max-height:120px;" muted></video>');
            } else {
                $container.prepend('<img src="' + escapeAttr(attachment.url) + '" class="vitrine-image-preview" />');
            }
            $(e.target).after(' <button type="button" class="button vitrine-remove-image">Remover</button>');
        });

        frame.open();
    });

    $(document).on('click', '.vitrine-remove-image', function (e) {
        e.preventDefault();
        var $container = $(this).closest('.vitrine-image-field');
        $container.find('.vitrine-field').val('').trigger('change');
        $container.find('.vitrine-image-preview').remove();
        $container.find('.vitrine-image-url-input').val('');
        $(this).remove();
    });

    // URL manual para campo de imagem
    $(document).on('change', '.vitrine-image-url-input', function () {
        var url = $.trim($(this).val());
        var $container = $(this).closest('.vitrine-image-field');
        var $input = $container.find('.vitrine-field');

        $input.val(url).trigger('change');
        $container.find('.vitrine-image-preview').remove();
        $container.find('.vitrine-remove-image').remove();

        if (url) {
            $container.prepend('<img src="' + escapeAttr(url) + '" class="vitrine-image-preview" />');
            $container.find('.vitrine-select-image').after(' <button type="button" class="button vitrine-remove-image">Remover</button>');
        }
    });

    /* ──────────────────── Aranha: Eventos dos itens dinâmicos ──────────────────── */

    // Campo de link/ícone da aranha alterado
    $(document).on('input change', '.vitrine-aranha-field', function () {
        if (!selectedId) return;
        var item = findItemById(selectedId);
        if (!item) return;

        var $item    = $(this).closest('.vitrine-aranha-item');
        var $section = $(this).closest('.vitrine-aranha-section');
        var key  = $section.data('aranha-key');
        var idx  = $item.data('aranha-idx');
        var prop = $(this).data('aranha-prop');

        if (!item.settings[key]) item.settings[key] = [];
        if (!item.settings[key][idx]) {
            item.settings[key][idx] = item.type === 'aranha3'
                ? { title: '', text: '', icon: '', link: '', position: 'auto' }
                : { text: '', icon: '', link: '' };
        }
        item.settings[key][idx][prop] = $(this).val();

        if (item.type === 'aranha3' && prop === 'position') {
            renderSettings();
            renderCanvas();
            return;
        }

        // Atualiza preview
        var $block = $('[data-id="' + selectedId + '"]').first().find('> .vitrine-block-preview');
        var elDef  = elements[item.type];
        if ($block.length && elDef) {
            var s = $.extend(true, {}, elDef.defaults, item.settings);
            refreshBlockPreview($block, item.type, s);
        }
    });

    // Adicionar item à aranha
    $(document).on('click', '.vitrine-aranha-add-item', function (e) {
        e.preventDefault();
        if (!selectedId) return;
        var item = findItemById(selectedId);
        if (!item) return;

        var key = $(this).closest('.vitrine-aranha-section').data('aranha-key');
        var zone = $(this).closest('.vitrine-aranha-section').data('aranha-zone');
        if (!item.settings[key]) item.settings[key] = [];
        if (item.type === 'aranha3') {
            item.settings[key].push({
                title: '',
                text: '',
                icon: '',
                link: '',
                position: zone && zone !== 'auto' ? zone : 'auto'
            });
        } else {
            item.settings[key].push({ text: '', icon: '', link: '' });
        }

        renderSettings();
        renderCanvas();
    });

    // Remover item da aranha
    $(document).on('click', '.vitrine-aranha-remove-item', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (!selectedId) return;
        var item = findItemById(selectedId);
        if (!item) return;

        var $section = $(this).closest('.vitrine-aranha-section');
        var key = $section.data('aranha-key');
        var idx = $(this).closest('.vitrine-aranha-item').data('aranha-idx');

        if (item.settings[key]) {
            item.settings[key].splice(idx, 1);
        }

        renderSettings();
        renderCanvas();
    });

    // Abrir/fechar picker de ícone
    $(document).on('click', '.vitrine-aranha-open-picker', function (e) {
        e.stopPropagation();
        var $picker = $(this).closest('.vitrine-aranha-icon-field').find('.vitrine-icon-picker');
        $('.vitrine-icon-picker').not($picker).hide();
        var willShow = !$picker.is(':visible');
        $picker.toggle();
        if (willShow) {
            ensureIconGrid($picker, 'dashicons');
        }
    });

    // Trocar aba do picker
    $(document).on('click', '.vitrine-icon-tab', function () {
        var tab = $(this).data('tab');
        var $picker = $(this).closest('.vitrine-icon-picker');
        $picker.find('.vitrine-icon-tab').removeClass('is-active');
        $(this).addClass('is-active');
        $picker.find('.vitrine-icon-tab-panel').hide();
        $picker.find('[data-panel="' + tab + '"]').show();
        ensureIconGrid($picker, tab);
    });

    // Filtrar ícones no grid
    $(document).on('input', '.vitrine-icon-search', function () {
        var q = $(this).val().toLowerCase().replace(/^fa[srlbd]?\s+/, '');
        $(this).next('.vitrine-icons-grid').find('.vitrine-icon-pick').each(function () {
            var name = ($(this).data('icon') || '').toLowerCase().replace(/^fa[srlbd]?\s+/, '');
            $(this).toggle(q === '' || name.indexOf(q) !== -1);
        });
    });

    // Selecionar ícone (dashicons ou FA)
    $(document).on('click', '.vitrine-icon-pick', function (e) {
        e.preventDefault();
        var icon = $(this).data('icon');
        var $field = $(this).closest('.vitrine-aranha-icon-field');
        $field.find('.vitrine-aranha-field[data-aranha-prop="icon"]').val(icon).trigger('change');
        $field.find('.vitrine-icon-current').html(renderIconPreviewHtml(icon));
        $field.find('.vitrine-icon-picker').hide();
        if (!$field.find('.vitrine-aranha-remove-icon').length) {
            $field.find('.vitrine-icon-actions').append(' <button type="button" class="button vitrine-aranha-remove-icon">Remover</button>');
        }
    });

    // Selecionar imagem da biblioteca WP
    $(document).on('click', '.vitrine-aranha-select-icon', function (e) {
        e.preventDefault();
        var $container = $(this).closest('.vitrine-aranha-icon-field');
        var $input     = $container.find('.vitrine-aranha-field[data-aranha-prop="icon"]');

        var frame = wp.media({
            title: 'Selecionar Ícone',
            multiple: false,
            library: { type: 'image' }
        });

        frame.on('select', function () {
            var attachment = frame.state().get('selection').first().toJSON();
            $input.val(attachment.url).trigger('change');
            $container.find('.vitrine-icon-current').html(renderIconPreviewHtml(attachment.url));
            $container.find('.vitrine-icon-picker').hide();
            if (!$container.find('.vitrine-aranha-remove-icon').length) {
                $container.find('.vitrine-icon-actions').append(' <button type="button" class="button vitrine-aranha-remove-icon">Remover</button>');
            }
        });

        frame.open();
    });

    // Remover ícone
    $(document).on('click', '.vitrine-aranha-remove-icon', function (e) {
        e.preventDefault();
        var $container = $(this).closest('.vitrine-aranha-icon-field');
        $container.find('.vitrine-aranha-field[data-aranha-prop="icon"]').val('').trigger('change');
        $container.find('.vitrine-icon-current').empty();
        $(this).remove();
    });

    // Fechar picker ao clicar fora
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.vitrine-aranha-icon-field').length) {
            $('.vitrine-icon-picker').hide();
        }
    });

    // Aranha2/3: atualizar badge de link ao alterar campo link
    $(document).on('input', '.vitrine-a2-item .vitrine-aranha-field[data-aranha-prop="link"], .vitrine-a3-item .vitrine-aranha-field[data-aranha-prop="link"]', function () {
        var hasLink = !!$(this).val().trim();
        var $header = $(this).closest('.vitrine-a2-item, .vitrine-a3-item').find('.vitrine-a2-item-header');
        $header.find('.vitrine-a2-badge--link').remove();
        if (hasLink) {
            $header.find('.vitrine-aranha-remove-item').before(
                '<span class="vitrine-a2-badge vitrine-a2-badge--link" title="Tem link"><span class="dashicons dashicons-admin-links"></span></span>'
            );
        }
    });

    // Aranha2/3: atualizar badge e hint do ícone ao selecionar/remover
    $(document).on('change', '.vitrine-a2-item .vitrine-aranha-field[data-aranha-prop="icon"], .vitrine-a3-item .vitrine-aranha-field[data-aranha-prop="icon"]', function () {
        var hasIcon = !!$(this).val();
        var $item   = $(this).closest('.vitrine-a2-item, .vitrine-a3-item');
        var $header = $item.find('.vitrine-a2-item-header');
        $header.find('.vitrine-a2-badge--icon').remove();
        if (hasIcon) {
            $header.find('.vitrine-aranha-item-num').after(
                '<span class="vitrine-a2-badge vitrine-a2-badge--icon" title="Tem ícone"><span class="dashicons dashicons-format-image"></span></span>'
            );
        }
        $item.find('.vitrine-a2-icon-hint').text(hasIcon ? 'Trocar' : 'Adicionar');
        var $actions = $item.find('.vitrine-icon-actions');
        if (hasIcon && !$actions.find('.vitrine-aranha-remove-icon').length) {
            $actions.append('<button type="button" class="button vitrine-aranha-remove-icon">Remover</button>');
        }
    });

    /* ──────────────────── Toggle: Eventos dos itens dinâmicos ──────────────────── */

    // Campo de título/conteúdo do toggle alterado
    $(document).on('input change', '.vitrine-toggle-field', function () {
        if (!selectedId) return;
        var item = findItemById(selectedId);
        if (!item) return;

        var $tItem = $(this).closest('.vitrine-toggle-editor-item');
        var idx    = $tItem.data('toggle-idx');
        var prop   = $(this).data('toggle-prop');

        if (!item.settings.items) item.settings.items = [];
        if (!item.settings.items[idx]) item.settings.items[idx] = { title: '', content: '' };
        item.settings.items[idx][prop] = $(this).val();

        // Atualiza preview
        var $block = $('[data-id="' + selectedId + '"]').first().find('> .vitrine-block-preview');
        var elDef  = elements[item.type];
        if ($block.length && elDef) {
            var s = $.extend(true, {}, elDef.defaults, item.settings);
            refreshBlockPreview($block, item.type, s);
        }
    });

    // Adicionar item ao toggle
    $(document).on('click', '.vitrine-toggle-add-item', function (e) {
        e.preventDefault();
        if (!selectedId) return;
        var item = findItemById(selectedId);
        if (!item) return;

        if (!item.settings.items) item.settings.items = [];
        item.settings.items.push({ title: '', content: '' });

        renderSettings();
        renderCanvas();
    });

    // Remover item do toggle
    $(document).on('click', '.vitrine-toggle-remove-item', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (!selectedId) return;
        var item = findItemById(selectedId);
        if (!item) return;

        var idx = $(this).closest('.vitrine-toggle-editor-item').data('toggle-idx');
        if (item.settings.items) {
            item.settings.items.splice(idx, 1);
        }

        renderSettings();
        renderCanvas();
    });

    /* ──────────────────── Salvar Layout ──────────────────── */

    function getBuilderPageSettings() {
        return {
            show_header:   pageSettings.show_header,
            show_footer:   pageSettings.show_footer,
            page_bg_color: pageSettings.page_bg_color,
            custom_css:    pageSettings.custom_css || ''
        };
    }

    function saveLayout(onDone) {
        syncAllAranhaMCE();
        syncAllFieldMCE();

        return $.ajax({
            url: vitrineData.ajaxUrl,
            method: 'POST',
            data: {
                action:        'vitrine_save_layout',
                nonce:         vitrineData.nonce,
                post_id:       vitrineData.postId,
                layout:        JSON.stringify(layout),
                page_settings: JSON.stringify(getBuilderPageSettings())
            }
        }).done(function (res) {
            if (typeof onDone === 'function') {
                onDone(!!(res && res.success), res);
            }
        }).fail(function () {
            if (typeof onDone === 'function') {
                onDone(false);
            }
        });
    }

    function getVitrinePreviewUrl() {
        return vitrineData.viewUrl || vitrineData.previewUrl || '';
    }

    function openVitrinePreview() {
        var url = getVitrinePreviewUrl();
        if (!url) {
            window.alert('Salve a vitrine como rascunho antes de visualizar.');
            return;
        }

        var $previewBtn = $('#vitrine-preview-btn');
        $previewBtn.prop('disabled', true);

        saveLayout(function (success) {
            $previewBtn.prop('disabled', false);
            if (success) {
                window.open(url, '_blank', 'noopener,noreferrer');
            } else {
                window.alert('Não foi possível salvar o layout antes de visualizar.');
            }
        });
    }

    function syncHeroFieldsBeforeSave() {
        if (!$('#vitrine-hero-description').length) {
            return;
        }
        $('#vitrine-hero-description-input').val($('#vitrine-hero-description').html());
    }

    function mountWordPressPublishActions() {
        var $submit = $('#submitdiv');

        if (!$submit.length) {
            return !!$('#vitrine-topbar-actions #publish, #vitrine-topbar-actions #save-post').length;
        }

        $submit.find('input[type="hidden"]').each(function () {
            var name = this.name;
            if (!name) {
                return;
            }
            if (!$('#post input[type="hidden"][name="' + name + '"]').length) {
                $(this).appendTo('#post');
            }
        });

        $submit.find('#post-status-select').appendTo('#post');

        if (!$('#vitrine-topbar-actions #publish, #vitrine-topbar-actions #save-post').length) {
            var $actions = $('#vitrine-topbar-actions');
            var $inside  = $submit.find('.inside').first();
            if ($actions.length) {
                if ($inside.length) {
                    $inside.children().appendTo($actions);
                } else {
                    $submit.children().appendTo($actions);
                }
            }
        }

        $submit.remove();
        return true;
    }

    function ensurePublishActionsMounted(retry) {
        retry = retry || 0;
        if (mountWordPressPublishActions()) {
            return;
        }
        if (retry < 15) {
            setTimeout(function () {
                ensurePublishActionsMounted(retry + 1);
            }, 100);
        }
    }

    function bindLayoutSaveOnPostSubmit() {
        var bypassLayoutSave = false;
        var submitIntent     = null;

        $(document).on('click', '#publish', function () {
            submitIntent = {
                name:  this.name || 'publish',
                value: this.value || '1'
            };
            $('#hidden_post_status').val('publish');
            if ($('#post_status').length) {
                $('#post_status').val('publish');
            }
        });

        $(document).on('click', '#save-post', function () {
            submitIntent = {
                name:  this.name || 'save',
                value: this.value || '1'
            };
            if (this.name === 'save' || this.id === 'save-post') {
                $('#hidden_post_status').val('draft');
                if ($('#post_status').length) {
                    $('#post_status').val('draft');
                }
            }
        });

        $('#post').on('submit', function (e) {
            if (bypassLayoutSave) {
                return true;
            }

            e.preventDefault();

            var $form     = $(this);
            var $publish  = $('#publish');
            var $savePost = $('#save-post');
            var $spinner  = $('#vitrine-topbar-actions .spinner').first();

            syncHeroFieldsBeforeSave();

            $publish.prop('disabled', true);
            if ($savePost.length) {
                $savePost.prop('disabled', true);
            }
            if ($spinner.length) {
                $spinner.addClass('is-active');
            }

            saveLayout(function (success) {
                if (!success) {
                    $publish.prop('disabled', false);
                    if ($savePost.length) {
                        $savePost.prop('disabled', false);
                    }
                    if ($spinner.length) {
                        $spinner.removeClass('is-active');
                    }
                    window.alert('Erro ao salvar o layout. Tente novamente.');
                    return;
                }

                $('#vitrine-submit-intent').remove();
                if (submitIntent && submitIntent.name) {
                    $('<input>', {
                        type:  'hidden',
                        id:    'vitrine-submit-intent',
                        name:  submitIntent.name,
                        value: submitIntent.value
                    }).appendTo($form);
                }

                bypassLayoutSave = true;
                $form[0].submit();
            });

            return false;
        });
    }

    /* ──────────────────── Inicialização ──────────────────── */

    $(function () {
        ensurePublishActionsMounted();
        bindLayoutSaveOnPostSubmit();

        $(document).on('input change', '#vitrine-page-custom-css', function () {
            pageSettings.custom_css = $(this).val();
        });

        $('#vitrine-opt-header').on('change', function () {
            pageSettings.show_header = this.checked ? '1' : '0';
        });
        $('#vitrine-opt-footer').on('change', function () {
            pageSettings.show_footer = this.checked ? '1' : '0';
        });
        $('#vitrine-opt-bg').on('input change', function () {
            pageSettings.page_bg_color = $(this).val();
            if (!$('#vitrine-opt-bg-clear').length) {
                $(this).after('<button type="button" id="vitrine-opt-bg-clear" class="button button-small" title="Limpar cor">&#10005;</button>');
            }
        });
        $(document).on('click', '#vitrine-opt-bg-clear', function () {
            pageSettings.page_bg_color = '';
            $('#vitrine-opt-bg').val('#ffffff');
            $(this).remove();
        });

        renderCanvas();
        renderSettings();

        // Fechar sidebar de configurações (deseleciona elemento)
        $(document).on('click', '#vitrine-settings-sidebar-close', function () {
            selectedId = null;
            renderSettings();
            renderCanvas();
        });

        // Template picker
        $(document).on('click', '.vitrine-template-picker__item', function (e) {
            e.preventDefault();
            var idx = $(this).data('tpl-idx');
            applyTemplate(idx);
        });

        $(document).on('click', '#vitrine-preview-btn', function (e) {
            e.preventDefault();
            openVitrinePreview();
        });
    });

})(jQuery);
