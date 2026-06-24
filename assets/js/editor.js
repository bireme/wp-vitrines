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
    var pageSettings = vitrineData.pageSettings || {
        show_header: '1',
        show_footer: '1',
        page_bg_color: '',
        hero_image: '',
        hero_text: '',
        hero_text_color: '#ffffff',
        hero_overlay_opacity: '50',
        hero_height: '400',
        hero_font_size: '36',
        hero_text_align: 'center',
        hero_description: '',
        hero_desc_size: '18',
        hero_text_bold: '1',
        hero_text_italic: '0',
        custom_css: ''
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

    function buildCanvasIconHtml(icon, size) {
        if (!icon) return '';
        if (icon.indexOf('dashicons-') === 0) {
            return '<span class="dashicons ' + escapeAttr(icon) + '" style="font-size:' + size + 'px;width:' + size + 'px;height:' + size + 'px;color:inherit;flex-shrink:0;"></span>';
        }
        if (/^fa[srlbd]?\s/.test(icon)) {
            return '<i class="' + escapeAttr(icon) + '" style="font-size:' + size + 'px;flex-shrink:0;"></i>';
        }
        return '<img src="' + escapeAttr(icon) + '" style="width:' + size + 'px;height:' + size + 'px;border-radius:3px;object-fit:contain;flex-shrink:0;" alt="" />';
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
                { type: 'aranha' },
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

    /* ──────────────────── Hero Preview ──────────────────── */

    function renderHeroPreview() {
        var $prev = $('#vitrine-hero-preview');
        var img   = pageSettings.hero_image || '';
        var text  = pageSettings.hero_text || '';
        var color = pageSettings.hero_text_color || '#ffffff';
        var opa   = parseInt(pageSettings.hero_overlay_opacity || '50', 10) / 100;
        var h     = parseInt(pageSettings.hero_height || '400', 10);
        var fs    = parseInt(pageSettings.hero_font_size || '36', 10);
        var align = pageSettings.hero_text_align || 'center';
        var desc      = pageSettings.hero_description || '';
        var dfs       = parseInt(pageSettings.hero_desc_size || '18', 10);
        var textBold  = pageSettings.hero_text_bold !== '0' ? '700' : '400';
        var textItal  = pageSettings.hero_text_italic === '1' ? 'italic' : 'normal';
        var descBold  = '400'; // formatação inline no HTML
        var descItal  = 'normal';

        if (!img && !text && !desc) {
            $prev.empty().hide();
            return;
        }

        var justifyMap = { left: 'flex-start', center: 'center', right: 'flex-end' };
        var justifyContent = justifyMap[align] || 'center';

        var bgStyle = img ? 'background:url(' + escapeAttr(img) + ') center/cover no-repeat;' : 'background:#333;';
        var html = '<div style="position:relative;' + bgStyle + 'height:' + h + 'px;border-radius:6px;overflow:hidden;display:flex;flex-direction:column;align-items:' + justifyContent + ';justify-content:center;gap:10px;margin-top:10px;padding:0 20px;">';
        html += '<div style="position:absolute;inset:0;background:rgba(0,0,0,' + opa + ');"></div>';
        if (text) {
            html += '<span style="position:relative;z-index:1;font-size:' + fs + 'px;font-weight:' + textBold + ';font-style:' + textItal + ';color:' + escapeAttr(color) + ';text-align:' + escapeAttr(align) + ';text-shadow:0 2px 8px rgba(0,0,0,.5);">' + escapeHtml(text) + '</span>';
        }
        if (desc) {
            html += '<span style="position:relative;z-index:1;font-size:' + dfs + 'px;color:' + escapeAttr(color) + ';text-align:' + escapeAttr(align) + ';opacity:0.9;text-shadow:0 1px 4px rgba(0,0,0,.5);">' + desc + '</span>';
        }
        html += '</div>';

        $prev.html(html).show();
    }

    /* ──────────────────── Renderização do Canvas ──────────────────── */

    function renderCanvas() {
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
                        '<span class="vitrine-block-label">' + escapeHtml(elDef.label) + '</span>' +
                        widthBadgeHtml +
                        (isContainer ? (function() {
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
                    '<div class="vitrine-block-preview">' +
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

    /**
     * Calcula linhas/colunas da Aranha Grade com imagem sempre no centro.
     */
    function frameGridSize(nItems) {
        if (nItems <= 8) return 3;
        var size = 5;
        while (frameCapacity(size) < nItems) size += 2;
        return Math.min(size, 15);
    }

    function frameCapacity(size) {
        if (size <= 3) return 8;
        return 4 * (size - 2);
    }

    function buildFramePools(rows, cols) {
        var left = [], top = [], right = [], bottom = [];
        if (rows === 3 && cols === 3) {
            for (var c = 0; c < 3; c++) top.push([0, c]);
            left.push([1, 0]);
            right.push([1, 2]);
            for (var c2 = 0; c2 < 3; c2++) bottom.push([2, c2]);
            return { left: left, top: top, right: right, bottom: bottom };
        }
        for (var r = 1; r < rows - 1; r++) {
            left.push([r, 0]);
            right.push([r, cols - 1]);
        }
        for (var c3 = 1; c3 < cols - 1; c3++) {
            top.push([0, c3]);
            bottom.push([rows - 1, c3]);
        }
        return { left: left, top: top, right: right, bottom: bottom };
    }

    function distributeFrameCounts(n, maxL, maxT, maxR, maxB) {
        var left = Math.min(maxL, n);
        n -= left;
        var top = Math.min(maxT, n);
        n -= top;
        var right = Math.min(maxR, n);
        n -= right;
        var bottom = Math.min(maxB, n);
        n -= bottom;
        if (n > 0) {
            var add = Math.min(maxB - bottom, n);
            bottom += add;
            n -= add;
            top = Math.min(maxT, top + n);
        }
        return { left: left, top: top, right: Math.max(0, right), bottom: Math.max(0, bottom) };
    }

    function assignAranha3Groups(items, max) {
        var groups = { left: [], top: [], right: [], bottom: [] };
        var autoItems = [];
        var allowed = ['top', 'bottom', 'left', 'right'];

        items.forEach(function (it) {
            var pos = it.position || 'auto';
            if (allowed.indexOf(pos) !== -1 && groups[pos].length < max[pos]) {
                groups[pos].push(it);
            } else {
                autoItems.push(it);
            }
        });

        if (!autoItems.length) return groups;

        var remainMax = {
            left: Math.max(0, max.left - groups.left.length),
            top: Math.max(0, max.top - groups.top.length),
            right: Math.max(0, max.right - groups.right.length),
            bottom: Math.max(0, max.bottom - groups.bottom.length)
        };
        var counts = distributeFrameCounts(
            autoItems.length, remainMax.left, remainMax.top, remainMax.right, remainMax.bottom
        );
        var order = ['left', 'top', 'right', 'bottom'];
        var offset = 0;
        order.forEach(function (side) {
            var take = counts[side];
            if (take > 0) {
                groups[side] = groups[side].concat(autoItems.slice(offset, offset + take));
                offset += take;
            }
        });
        return groups;
    }

    function computeAranha3Groups(items, preferredCols) {
        var n = items.length;
        var empty = { left: [], top: [], right: [], bottom: [] };
        if (n <= 0) return { groups: empty };
        if (n === 1) return { groups: { left: [items[0]], top: [], right: [], bottom: [] } };
        if (n === 2) return { groups: { left: [items[0]], top: [], right: [items[1]], bottom: [] } };

        var size = frameGridSize(n);
        var pools = buildFramePools(size, size);
        var max = {
            left: pools.left.length,
            top: pools.top.length,
            right: pools.right.length,
            bottom: pools.bottom.length
        };
        return { groups: assignAranha3Groups(items, max) };
    }

    function buildA3BoxShadow(intensity) {
        var i = Math.max(0, Math.min(100, parseInt(intensity, 10) || 0));
        if (i <= 0) return 'none';
        var y = Math.max(1, Math.round(i * 0.08));
        var blur = Math.max(2, Math.round(i * 0.32));
        var alpha = (i * 0.0012).toFixed(3);
        return '0 ' + y + 'px ' + blur + 'px rgba(0,0,0,' + alpha + ')';
    }

    function buildA3HexRgba(hex, opacityPct) {
        hex = String(hex || '#d0d8c4').replace('#', '');
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        var r = parseInt(hex.substr(0, 2), 16) || 208;
        var g = parseInt(hex.substr(2, 2), 16) || 216;
        var b = parseInt(hex.substr(4, 2), 16) || 196;
        var a = Math.max(0, Math.min(100, parseInt(opacityPct, 10) || 0)) / 100;
        return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    }

    function buildA3FlexAlign(align) {
        if (align === 'center') return 'center';
        if (align === 'bottom') return 'flex-end';
        return 'flex-start';
    }

    function buildA3CardBorderCss(settings) {
        var style = settings.card_border_style || 'none';
        var allowed = ['none', 'solid', 'dashed', 'dotted', 'double'];
        if (allowed.indexOf(style) === -1) style = 'none';
        var width = Math.max(0, Math.min(20, parseInt(settings.card_border_width || 0, 10)));
        var color = escapeAttr(settings.card_border_color || '#d0d0d0');
        if (style === 'none' || width <= 0) return 'border:none;';
        return 'border:' + width + 'px ' + style + ' ' + color + ';';
    }

    function buildA3PreviewCard(a3It, a3CrdBg, a3Rad, a3BorderCss, a3TitCl, a3TxtCl, a3IcSz, a3CardH, a3Side, a3Shadow, a3Align) {
        var cardStyle = 'background:' + a3CrdBg + ';border-radius:' + a3Rad + 'px;' + a3BorderCss + 'padding:8px 10px;box-sizing:border-box;box-shadow:' + a3Shadow + ';display:flex;flex-direction:column;justify-content:' + a3Align + ';min-height:' + a3CardH + 'px;height:auto;';
        if (a3Side) {
            cardStyle += 'flex:0 1 auto;width:100%;';
        } else {
            cardStyle += 'flex:1 1 0;min-width:80px;';
        }
        var h = '<div style="' + cardStyle + '">';
        h += '<div style="display:flex;align-items:flex-start;gap:6px;">';
        if (a3It.icon) h += '<div style="flex-shrink:0;">' + buildCanvasIconHtml(a3It.icon, a3IcSz) + '</div>';
        h += '<div style="flex:1;min-width:0;">';
        if (a3It.title) h += '<div style="font-weight:700;font-size:9px;color:' + a3TitCl + ';margin-bottom:2px;line-height:1.3;">' + escapeHtml(a3It.title) + '</div>';
        if (a3It.text)  h += '<div style="font-size:8px;color:' + a3TxtCl + ';line-height:1.4;">' + (a3It.text || '') + '</div>';
        h += '</div></div></div>';
        return h;
    }

    function buildA3PreviewGroup(groupItems, a3CrdBg, a3Rad, a3BorderCss, a3TitCl, a3TxtCl, a3IcSz, a3CardH, a3Side, a3Shadow, a3Align) {
        var h = '';
        groupItems.forEach(function (it) {
            h += buildA3PreviewCard(it, a3CrdBg, a3Rad, a3BorderCss, a3TitCl, a3TxtCl, a3IcSz, a3CardH, a3Side, a3Shadow, a3Align);
        });
        return h;
    }

    /**
     * Preview simplificado de cada tipo de elemento dentro do canvas.
     */
    function buildPreview(type, settings) {
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
                var ilItems   = settings.items || [];
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
                var ilLinkCl  = escapeAttr(settings.link_color || '#333333');
                var ilLinkSz  = parseInt(settings.link_font_size || 14, 10);
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
                ilHtml += '<div style="background:' + ilBoxBg + ';padding:' + ilPad + 'px;">';
                if (ilBoxTit) {
                    ilHtml += '<div style="color:' + ilTitCl + ';font-size:' + ilTitSz + 'px;font-weight:700;margin:0 0 8px;line-height:1.3;">' + escapeHtml(ilBoxTit) + '</div>';
                }
                ilHtml += '<hr style="border:none;border-top:1px solid ' + ilSepCl + ';margin:0 0 8px;" />';
                ilHtml += '<ul style="list-style:none;margin:0;padding:0;">';
                if (ilItems.length) {
                    ilItems.forEach(function (li) {
                        if (!li.label) return;
                        ilHtml += '<li style="margin:0 0 5px;line-height:1.4;">';
                        ilHtml += '<span style="color:' + ilLinkCl + ';font-size:' + ilLinkSz + 'px;text-decoration:underline;">' + escapeHtml(li.label) + '</span>';
                        ilHtml += '</li>';
                    });
                } else {
                    ilHtml += '<li style="color:#999;font-size:10px;">Adicione links no painel</li>';
                }
                ilHtml += '</ul></div></div>';
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
                var dirLabel = (settings.direction === 'row') ? 'Linha (→)' : 'Coluna (↓)';
                var cBg = 'background-color:' + escapeAttr(settings.bg_color || '#f5f5f5') + ';';
                if (settings.bg_image) {
                    cBg += 'background-image:url(' + escapeAttr(settings.bg_image) + ');background-size:' + escapeAttr(settings.bg_size || 'cover') + ';background-position:center;';
                }
                var cFull = settings.full_width_bg === '1' || settings.full_width_bg === 1;
                var cLabel = 'Container – ' + dirLabel + (cFull ? ' · Fundo largura total' : '');
                if (cFull) {
                    return '<div style="' + cBg + 'padding:6px 0;margin:0 -8px;"><div style="max-width:' + parseInt(settings.max_width || 1200, 10) + 'px;margin:0 auto;padding:0 8px;"><div class="vitrine-container-label" style="padding:4px 10px;font-size:11px;color:#666;">' + escapeHtml(cLabel) + '</div></div></div>';
                }
                return '<div class="vitrine-container-label" style="' + cBg + 'padding:4px 10px;font-size:11px;color:#666;border-radius:3px 3px 0 0;">' + escapeHtml(cLabel) + '</div>';
            case 'aranha':
                var leftItems = settings.left_items || [];
                var rightItems = settings.right_items || [];
                var topItems = settings.top_items || [];
                var aLineColor = escapeAttr(settings.line_color || '#2e7d32');
                var aTextColor = escapeAttr(settings.text_color || '#333');
                var aIconSize = Math.min(parseInt(settings.icon_size || 40, 10), 28);

                var aMaxItems = Math.max(leftItems.length, rightItems.length, 1);
                var aCenterSize = Math.min(Math.max(70, aMaxItems * 32), 500);

                var aCenterBg = escapeAttr(settings.center_bg_color || '#e0e0e0');
                var aCenterImg = settings.center_image
                    ? '<img src="' + escapeAttr(settings.center_image) + '" style="width:100%;height:100%;border-radius:50%;object-fit:cover;border:3px solid ' + aLineColor + ';background:' + aCenterBg + ';" alt="" />'
                    : '<div style="width:100%;height:100%;border-radius:50%;background:' + aCenterBg + ';border:3px solid ' + aLineColor + ';"></div>';

                function buildAranhaArm(bend, side, color) {
                    var overlap = side === 'left' ? 'margin-right:-20px;' : 'margin-left:-20px;';
                    var base = 'flex:1;min-width:10px;position:relative;align-self:stretch;overflow:visible;' + overlap + 'z-index:1;';
                    var d;
                    if (side === 'left') {
                        if (bend === 'straight')    d = 'M 0,50 L 100,50';
                        else if (bend === 'down')   d = 'M 0,50 C 50,50 50,100 100,100';
                        else                        d = 'M 0,50 C 50,50 50,0 100,0';
                    } else {
                        if (bend === 'straight')    d = 'M 100,50 L 0,50';
                        else if (bend === 'down')   d = 'M 100,50 C 50,50 50,100 0,100';
                        else                        d = 'M 100,50 C 50,50 50,0 0,0';
                    }
                    return '<div style="' + base + '">' +
                        '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="overflow:visible;">' +
                        '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round" /></svg>' +
                    '</div>';
                }

                function buildAranhaCards(items, side) {
                    if (!items.length) return '<div style="flex:1;"></div>';
                    var n = items.length;
                    var mid = (n - 1) / 2;
                    var h = '<div style="flex:1;display:flex;flex-direction:column;justify-content:center;position:relative;">';
                    items.forEach(function (ai, idx) {
                        var t = ai.text || '';
                        var ic = ai.icon || '';
                        var bend;
                        if (n <= 1 || Math.abs(idx - mid) < 0.1) { bend = 'straight'; }
                        else if (idx < mid) { bend = 'down'; }
                        else { bend = 'up'; }

                        h += '<div style="flex:1;display:flex;align-items:center;padding:4px 0;">';
                        if (side === 'left') {
                            h += '<div style="display:flex;align-items:center;gap:6px;border:2px solid ' + aLineColor + ';border-radius:8px;padding:6px 10px;background:#fff;flex-shrink:0;max-width:180px;position:relative;z-index:2;">';
                            h += '<span style="font-size:11px;color:' + aTextColor + ';text-align:right;line-height:1.3;">' + (t || '') + '</span>';
                            if (ic) h += buildCanvasIconHtml(ic, aIconSize);
                            h += '</div>';
                            h += buildAranhaArm(bend, side, aLineColor);
                        } else {
                            h += buildAranhaArm(bend, side, aLineColor);
                            h += '<div style="display:flex;align-items:center;gap:6px;border:2px solid ' + aLineColor + ';border-radius:8px;padding:6px 10px;background:#fff;flex-shrink:0;max-width:180px;position:relative;z-index:2;">';
                            if (ic) h += buildCanvasIconHtml(ic, aIconSize);
                            h += '<span style="font-size:11px;color:' + aTextColor + ';line-height:1.3;">' + (t || '') + '</span>';
                            h += '</div>';
                        }
                        h += '</div>';
                    });
                    h += '</div>';
                    return h;
                }

                function buildAranhaTopCards(items) {
                    if (!items.length) return '';
                    var n = items.length;
                    var mid = (n - 1) / 2;
                    var h = '<div style="display:flex;justify-content:center;gap:0;">';
                    items.forEach(function (ai, idx) {
                        var t = ai.text || '';
                        var ic = ai.icon || '';
                        var bend;
                        if (n <= 1 || Math.abs(idx - mid) < 0.1) { bend = 'straight'; }
                        else if (idx < mid) { bend = 'left'; }
                        else { bend = 'right'; }

                        h += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;">';
                        h += '<div style="display:flex;align-items:center;gap:6px;border:2px solid ' + aLineColor + ';border-radius:8px;padding:6px 10px;background:#fff;flex-shrink:0;max-width:180px;position:relative;z-index:2;">';
                        if (ic) h += buildCanvasIconHtml(ic, aIconSize);
                        h += '<span style="font-size:11px;color:' + aTextColor + ';line-height:1.3;text-align:center;">' + (t || '') + '</span>';
                        h += '</div>';
                        // Vertical arm — SVG Bézier
                        var ad;
                        if (bend === 'straight')    ad = 'M 50,0 L 50,100';
                        else if (bend === 'left')   ad = 'M 50,0 C 50,50 100,50 100,100';
                        else                        ad = 'M 50,0 C 50,50 0,50 0,100';
                        h += '<div style="flex:1;min-height:20px;width:100%;position:relative;margin-bottom:-20px;z-index:1;overflow:visible;">' +
                            '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="overflow:visible;">' +
                            '<path d="' + ad + '" fill="none" stroke="' + aLineColor + '" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round" /></svg>' +
                        '</div>';
                        h += '</div>';
                    });
                    h += '</div>';
                    return h;
                }

                return (topItems.length ? buildAranhaTopCards(topItems) : '') +
                    '<div style="display:flex;align-items:stretch;gap:0;min-height:120px;">' +
                    buildAranhaCards(leftItems, 'left') +
                    '<div style="display:flex;align-items:center;justify-content:center;position:relative;flex-shrink:0;z-index:3;width:' + aCenterSize + 'px;min-height:' + aCenterSize + 'px;max-width:500px;max-height:500px;aspect-ratio:1;">' +
                        aCenterImg +
                    '</div>' +
                    buildAranhaCards(rightItems, 'right') +
                '</div>';
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
            case 'aranha2':
                var a2Items  = settings.items || [];
                var a2N      = Math.max(1, a2Items.length);
                var a2Radius = Math.min(parseInt(settings.radius || 200, 10), 180);
                var a2CSize  = Math.min(parseInt(settings.center_size || 160, 10), 90);
                var a2Over   = 70;
                var a2Stage  = a2CSize + 2 * a2Radius + 2 * a2Over;
                var a2Cx     = a2Stage / 2;
                var a2Cy     = a2Stage / 2;
                var a2Rp     = a2Radius / a2Stage * 100;
                var a2Cp     = a2CSize  / a2Stage * 100;
                var a2Line   = escapeAttr(settings.line_color   || '#2e7d32');
                var a2CBg    = escapeAttr(settings.center_bg_color || '#e0e0e0');
                var a2CrdBg  = escapeAttr(settings.card_bg      || '#ffffff');
                var a2CrdBdr = escapeAttr(settings.card_border  || '#2e7d32');
                var a2Txt    = escapeAttr(settings.text_color   || '#1d2327');
                var a2IcSz   = Math.min(parseInt(settings.icon_size || 36, 10), 20);
                var a2Bg     = escapeAttr(settings.bg_color     || '#f8f9fa');

                var a2Html = '<div style="background:' + a2Bg + ';padding:12px;border-radius:4px;">';
                a2Html += '<div style="position:relative;width:' + a2Stage + 'px;height:' + a2Stage + 'px;max-width:100%;margin:0 auto;">';

                // SVG lines
                a2Html += '<svg style="position:absolute;top:0;left:0;width:100%;height:100%;overflow:visible;" viewBox="0 0 ' + a2Stage + ' ' + a2Stage + '">';
                a2Items.forEach(function (ai, i) {
                    var ang  = -Math.PI / 2 + i * (2 * Math.PI / a2N);
                    var px   = a2Cx + a2Radius * Math.cos(ang);
                    var py   = a2Cy + a2Radius * Math.sin(ang);
                    var dx   = px - a2Cx, dy = py - a2Cy;
                    var len  = Math.sqrt(dx * dx + dy * dy) || 1;
                    var mx   = (a2Cx + px) / 2, my = (a2Cy + py) / 2;
                    var curv = a2Radius * 0.22;
                    var cx2  = mx + curv * (-dy / len);
                    var cy2  = my + curv * ( dx / len);
                    a2Html += '<path d="M ' + a2Cx.toFixed(1) + ',' + a2Cy.toFixed(1) + ' Q ' + cx2.toFixed(1) + ',' + cy2.toFixed(1) + ' ' + px.toFixed(1) + ',' + py.toFixed(1) + '" fill="none" stroke="' + a2Line + '" stroke-width="1.4" stroke-linecap="round" opacity="0.7"/>';
                    a2Html += '<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="3" fill="' + a2Line + '"/>';
                });
                a2Html += '</svg>';

                // Center
                a2Html += '<div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:' + a2CSize + 'px;height:' + a2CSize + 'px;border-radius:50%;background:' + a2CBg + ';border:3px solid ' + a2Line + ';overflow:hidden;z-index:3;box-shadow:0 2px 10px rgba(0,0,0,.12);">';
                if (settings.center_image) {
                    a2Html += '<img src="' + escapeAttr(settings.center_image) + '" style="width:100%;height:100%;object-fit:cover;" />';
                }
                a2Html += '</div>';

                // Cards
                a2Items.forEach(function (ai, i) {
                    var ang = -Math.PI / 2 + i * (2 * Math.PI / a2N);
                    var px  = a2Cx + a2Radius * Math.cos(ang);
                    var py  = a2Cy + a2Radius * Math.sin(ang);
                    a2Html += '<div style="position:absolute;left:' + px.toFixed(1) + 'px;top:' + py.toFixed(1) + 'px;transform:translate(-50%,-50%);background:' + a2CrdBg + ';border:1.5px solid ' + a2CrdBdr + ';border-radius:10px;padding:6px 9px;font-size:10px;color:' + a2Txt + ';text-align:center;min-width:52px;max-width:85px;z-index:4;display:flex;flex-direction:column;align-items:center;gap:3px;box-shadow:0 2px 8px rgba(0,0,0,.08);">';
                    if (ai.icon) a2Html += buildCanvasIconHtml(ai.icon, a2IcSz);
                    if (ai.text) a2Html += '<span style="font-size:9px;font-weight:600;line-height:1.2;">' + escapeHtml(ai.text) + '</span>';
                    a2Html += '</div>';
                });

                if (!a2Items.length) {
                    a2Html += '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#a7aaad;font-size:11px;text-align:center;padding:20px;z-index:4;">Adicione itens no painel</div>';
                }

                a2Html += '</div></div>';
                return a2Html;

            case 'aranha3': {
                var a3Items   = settings.items || [];
                var a3PrefCol = parseInt(settings.columns || 3, 10);
                var a3Groups  = computeAranha3Groups(a3Items, a3PrefCol).groups;
                var a3Bg      = escapeAttr(settings.bg_color    || '#f4f4f2');
                var a3CrdBg   = escapeAttr(settings.card_bg     || '#ffffff');
                var a3TitCl   = escapeAttr(settings.title_color || '#2c3a1a');
                var a3TxtCl   = escapeAttr(settings.text_color  || '#555555');
                var a3CardRad = Math.min(parseInt(settings.card_border_radius !== undefined ? settings.card_border_radius : (settings.border_radius || 12), 10), 10);
                var a3ImgRad  = Math.min(parseInt(settings.image_border_radius !== undefined ? settings.image_border_radius : (settings.border_radius || 12), 10), 10);
                var a3Gap     = Math.min(parseInt(settings.gap || 16, 10), 8);
                var a3IcSz    = Math.min(parseInt(settings.icon_size || 32, 10), 18);
                var a3CardH   = Math.max(60, Math.min(parseInt(settings.card_height || 140, 10), 72));
                var a3CrdSh   = buildA3BoxShadow(settings.card_shadow !== undefined ? settings.card_shadow : 6);
                var a3ImgSh   = buildA3BoxShadow(settings.image_shadow || 0);
                var a3ImgBg   = buildA3HexRgba(settings.center_bg_color || '#d0d8c4', settings.center_bg_opacity !== undefined ? settings.center_bg_opacity : 100);
                var a3Align   = buildA3FlexAlign(settings.card_text_align || 'top');
                var a3Border  = buildA3CardBorderCss(settings);
                var a3ImgSz   = Math.max(80, Math.min(300, parseInt(settings.center_size || 240, 10)));
                var a3ImgFit  = settings.center_image_fit === 'contain' ? 'contain' : 'cover';

                var a3Img = '<div style="border-radius:' + a3ImgRad + 'px;overflow:hidden;height:' + a3ImgSz + 'px;min-height:' + a3ImgSz + 'px;max-height:' + a3ImgSz + 'px;flex:0 0 auto;width:100%;background:' + a3ImgBg + ';box-shadow:' + a3ImgSh + ';">';
                if (settings.center_image) {
                    a3Img += '<img src="' + escapeAttr(settings.center_image) + '" style="width:100%;height:100%;object-fit:' + a3ImgFit + ';object-position:center;display:block;" />';
                } else {
                    a3Img += '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#8a9e78;font-size:9px;font-weight:700;">IMAGEM</div>';
                }
                a3Img += '</div>';

                var a3Html = '<div style="padding:12px;background:' + a3Bg + ';border-radius:6px;">';

                if (a3Items.length <= 2) {
                    a3Html += '<div style="display:flex;align-items:flex-start;gap:' + a3Gap + 'px;">';
                    a3Html += buildA3PreviewGroup(a3Groups.left, a3CrdBg, a3CardRad, a3Border, a3TitCl, a3TxtCl, a3IcSz, a3CardH, true, a3CrdSh, a3Align);
                    a3Html += a3Img;
                    a3Html += buildA3PreviewGroup(a3Groups.right, a3CrdBg, a3CardRad, a3Border, a3TitCl, a3TxtCl, a3IcSz, a3CardH, true, a3CrdSh, a3Align);
                    a3Html += '</div>';
                } else {
                    a3Html += '<div style="display:grid;grid-template-columns:minmax(90px,1fr) minmax(80px,320px) minmax(90px,1fr);grid-template-rows:auto auto auto;align-items:center;gap:' + a3Gap + 'px;">';
                    a3Html += '<div style="grid-column:1/-1;grid-row:1;display:flex;gap:' + a3Gap + 'px;justify-content:center;">';
                    a3Html += buildA3PreviewGroup(a3Groups.top, a3CrdBg, a3CardRad, a3Border, a3TitCl, a3TxtCl, a3IcSz, a3CardH, false, a3CrdSh, a3Align);
                    a3Html += '</div>';
                    a3Html += '<div style="grid-column:1;grid-row:2;display:flex;flex-direction:column;gap:' + a3Gap + 'px;align-self:center;width:100%;min-width:0;">';
                    a3Html += buildA3PreviewGroup(a3Groups.left, a3CrdBg, a3CardRad, a3Border, a3TitCl, a3TxtCl, a3IcSz, a3CardH, true, a3CrdSh, a3Align);
                    a3Html += '</div>';
                    a3Html += '<div style="grid-column:2;grid-row:2;width:100%;max-width:320px;justify-self:center;margin:0 auto;">' + a3Img + '</div>';
                    a3Html += '<div style="grid-column:3;grid-row:2;display:flex;flex-direction:column;gap:' + a3Gap + 'px;align-self:center;width:100%;min-width:0;">';
                    a3Html += buildA3PreviewGroup(a3Groups.right, a3CrdBg, a3CardRad, a3Border, a3TitCl, a3TxtCl, a3IcSz, a3CardH, true, a3CrdSh, a3Align);
                    a3Html += '</div>';
                    a3Html += '<div style="grid-column:1/-1;grid-row:3;display:flex;gap:' + a3Gap + 'px;justify-content:center;">';
                    a3Html += buildA3PreviewGroup(a3Groups.bottom, a3CrdBg, a3CardRad, a3Border, a3TitCl, a3TxtCl, a3IcSz, a3CardH, false, a3CrdSh, a3Align);
                    a3Html += '</div>';
                    a3Html += '</div>';
                }

                a3Html += '</div>';
                return a3Html;
            }

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
                if (toParentId) distributeWidths(toParentId);
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
                    if (toParentId) distributeWidths(toParentId);
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
        $(this).closest('.vitrine-canvas-block--container').toggleClass('is-collapsed');
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
        $('#vitrine-settings-el-label').text(elDef.label || 'Configurações');
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
            var val = item.settings[field.name] !== undefined ? item.settings[field.name] : (elDef.defaults[field.name] || '');
            var inputHtml = '';

            switch (field.type) {
                case 'textarea':
                    inputHtml = '<textarea id="vitrine-field-mce-' + escapeAttr(field.name) + '" class="vitrine-field-mce" data-field="' + escapeAttr(field.name) + '" rows="4">' + escapeHtml(val) + '</textarea>';
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
                    inputHtml = '<input type="color" class="vitrine-field" data-field="' + escapeAttr(field.name) + '" value="' + escapeAttr(val) + '" />';
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
            $panel.append(
                '<div class="vitrine-field-group' + extraClass + '">' +
                    '<label>' + escapeHtml(field.label) + '</label>' +
                    inputHtml +
                '</div>'
            );
        });

        // ── Aranha: seções de itens dinâmicos ──
        if (item.type === 'aranha') {
            renderAranhaRepeater($panel, item, 'left_items', 'Itens da Esquerda');
            renderAranhaRepeater($panel, item, 'right_items', 'Itens da Direita');
            renderAranhaRepeater($panel, item, 'top_items', 'Itens do Topo');
        }

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

        // ── Imagem + Links: repeater de links ──
        if (item.type === 'imagelinks') {
            renderImagelinksRepeater($panel, item);
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

        // Inicializa TinyMCE nos campos de texto da aranha
        if (item.type === 'aranha') {
            setTimeout(initAranhaMCE, 50);
            setTimeout(initAranhaSort, 80);
        }

        // Aranha2: só sorting (sem MCE — usa inputs simples)
        if (item.type === 'aranha2') {
            setTimeout(initAranhaSort, 80);
        }

        // Aranha3: só sorting (sem MCE)
        if (item.type === 'aranha3') {
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

    /**
     * Renderiza a seção de links do elemento Imagem + Links.
     */
    function renderImagelinksRepeater($panel, item) {
        if (!item.settings.items || !Array.isArray(item.settings.items)) {
            item.settings.items = [];
        }
        var items = item.settings.items;

        var html = '<div class="vitrine-imagelinks-section">';
        html += '<hr style="border:none;border-top:1px solid #dcdcde;margin:14px 0 10px;" />';
        html += '<h4 class="vitrine-repeater-section-title">Links (' + items.length + ')</h4>';
        html += '<p style="margin:0 0 10px;font-size:11px;color:#8c8f94;line-height:1.5;">Lista de sites relacionados exibida abaixo da imagem.</p>';
        html += '<div class="vitrine-imagelinks-items-list">';

        items.forEach(function (li, idx) {
            html += '<div class="vitrine-repeater-item vitrine-imagelinks-editor-item" data-imagelinks-idx="' + idx + '">';
            html += '<div class="vitrine-repeater-item-header">';
            html += '<span class="vitrine-repeater-item-num">' + (idx + 1) + '</span>';
            html += '<span style="font-size:11px;color:#646970;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 8px;">' + escapeHtml(li.label || 'Link ' + (idx + 1)) + '</span>';
            html += '<button type="button" class="button button-small vitrine-imagelinks-remove-item" title="Remover">&times;</button>';
            html += '</div>';
            html += '<div class="vitrine-field-group"><label>Texto do link</label>';
            html += '<input type="text" class="vitrine-imagelinks-field" data-imagelinks-prop="label" value="' + escapeAttr(li.label || '') + '" placeholder="Ex: Ministério da Saúde" /></div>';
            html += '<div class="vitrine-field-group"><label>URL</label>';
            html += '<input type="text" class="vitrine-imagelinks-field" data-imagelinks-prop="url" value="' + escapeAttr(li.url || '') + '" placeholder="https://..." /></div>';
            html += '</div>';
        });

        html += '</div>';
        html += '<button type="button" class="button vitrine-imagelinks-add-item" style="width:100%;margin-top:8px;">+ Adicionar Link</button>';
        html += '</div>';

        $panel.append(html);
    }

    /* ── TinyMCE helpers ── */

    var _skipMCESync = false;

    function destroyAllMCE() {
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
        $('.vitrine-aranha-items-list').each(function () {
            var $list = $(this);
            if ($list.data('sortable-init')) return; // evita dupla init
            $list.data('sortable-init', true);

            Sortable.create(this, {
                handle: '.vitrine-aranha-drag',
                draggable: '.vitrine-aranha-item',
                animation: 150,
                ghostClass: 'vitrine-aranha-ghost',
                onEnd: function (evt) {
                    if (evt.oldIndex === evt.newIndex) return;
                    if (!selectedId) return;
                    var item = findItemById(selectedId);
                    if (!item) return;

                    var key = $list.data('aranha-key');
                    if (!key || !item.settings[key]) return;

                    // Lê a nova ordem pelos índices originais ainda no DOM
                    var arr = item.settings[key];
                    var newOrder = [];
                    $list.children('.vitrine-aranha-item').each(function () {
                        var idx = parseInt($(this).data('aranha-idx'), 10);
                        if (!isNaN(idx) && arr[idx]) newOrder.push(arr[idx]);
                    });
                    item.settings[key] = newOrder;

                    renderSettings();
                    renderCanvas();
                }
            });
        });
    }

    function initAranhaMCE() {
        $('.vitrine-aranha-mce').each(function () {
            var id = $(this).attr('id');
            if (!id) return;
            wp.editor.initialize(id, {
                tinymce: {
                    toolbar1: 'bold,italic,underline,link,bullist',
                    menubar: false,
                    branding: false,
                    resize: false,
                    height: 80,
                    setup: function (editor) {
                        editor.on('change keyup', function () {
                            editor.save();
                            syncAranhaMCE(editor.id);
                        });
                    }
                },
                quicktags: false,
                mediaButtons: false
            });
        });
    }

    function syncAranhaMCE(editorId) {
        if (!selectedId) return;
        var item = findItemById(selectedId);
        if (!item) return;

        var $ta      = $('#' + editorId);
        var $item    = $ta.closest('.vitrine-aranha-item');
        var $section = $ta.closest('.vitrine-aranha-section');
        var key = $section.data('aranha-key');
        var idx = $item.data('aranha-idx');

        if (!item.settings[key]) item.settings[key] = [];
        if (!item.settings[key][idx]) item.settings[key][idx] = { text: '', icon: '', link: '' };

        var content = (typeof wp !== 'undefined' && wp.editor)
            ? wp.editor.getContent(editorId)
            : $ta.val();

        item.settings[key][idx].text = content;

        // Atualiza preview
        var $block = $('[data-id="' + selectedId + '"]').first().find('> .vitrine-block-preview');
        var elDef  = elements[item.type];
        if ($block.length && elDef) {
            var s = $.extend(true, {}, elDef.defaults, item.settings);
            $block.html(buildPreview(item.type, s));
        }
    }

    function initFieldMCE() {
        $('.vitrine-field-mce').each(function () {
            var id = $(this).attr('id');
            if (!id) return;
            wp.editor.initialize(id, {
                tinymce: {
                    toolbar1: 'bold,italic,underline,link,bullist,numlist,alignleft,aligncenter,alignright',
                    menubar: false,
                    branding: false,
                    resize: false,
                    height: 120,
                    setup: function (editor) {
                        editor.on('change keyup', function () {
                            editor.save();
                            syncFieldMCE(editor.id);
                        });
                    }
                },
                quicktags: false,
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
            $block.html(buildPreview(item.type, s));
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
            $block.html(buildPreview(item.type, s));
        }
    }

    /**
     * Renderiza a seção de itens repetíveis da aranha.
     */
    function renderAranhaRepeater($panel, item, key, sectionLabel) {
        if (!item.settings[key] || !Array.isArray(item.settings[key])) {
            item.settings[key] = [];
        }
        var items = item.settings[key];

        var html = '<div class="vitrine-aranha-section" data-aranha-key="' + key + '">';
        html += '<hr style="border:none;border-top:1px solid #dcdcde;margin:14px 0 10px;" />';
        html += '<h4 class="vitrine-aranha-section-title">' + escapeHtml(sectionLabel) + ' (' + items.length + ')</h4>';

        items.forEach(function (ai, idx) {
            html += '<div class="vitrine-aranha-item" data-aranha-idx="' + idx + '">';
            html += '<div class="vitrine-aranha-item-header">';
            html += '<span class="vitrine-aranha-item-num">' + (idx + 1) + '</span>';
            html += '<button type="button" class="button button-small vitrine-aranha-remove-item" title="Remover">&times;</button>';
            html += '</div>';
            html += '<div class="vitrine-field-group"><label>Texto</label>';
            html += '<textarea id="vitrine-aranha-mce-' + key + '-' + idx + '" class="vitrine-aranha-mce" data-aranha-prop="text" rows="3">' + escapeHtml(ai.text || '') + '</textarea>';
            html += '</div>';
            html += '<div class="vitrine-field-group"><label>Link</label>';
            html += '<input type="text" class="vitrine-aranha-field" data-aranha-prop="link" value="' + escapeAttr(ai.link || '') + '" placeholder="https://" /></div>';
            html += '<div class="vitrine-field-group vitrine-field-group--full"><label>Ícone</label>';
            html += '<div class="vitrine-aranha-icon-field">';
            // Preview do ícone atual
            html += '<div class="vitrine-icon-current">' + renderIconPreviewHtml(ai.icon || '') + '</div>';
            html += '<input type="hidden" class="vitrine-aranha-field" data-aranha-prop="icon" value="' + escapeAttr(ai.icon || '') + '" />';
            html += '<div class="vitrine-icon-actions">';
            html += '<button type="button" class="button vitrine-aranha-open-picker">Escolher Ícone ▾</button>';
            if (ai.icon) {
                html += ' <button type="button" class="button vitrine-aranha-remove-icon">Remover</button>';
            }
            html += '</div>';
            // Painel picker (fechado por padrão)
            html += '<div class="vitrine-icon-picker" style="display:none;">';
            html += '<div class="vitrine-icon-picker-tabs">';
            html += '<button type="button" class="vitrine-icon-tab is-active" data-tab="upload">Imagem</button>';
            html += '<button type="button" class="vitrine-icon-tab" data-tab="dashicons">Dashicons</button>';
            html += '<button type="button" class="vitrine-icon-tab" data-tab="fa">Font Awesome</button>';
            html += '</div>';
            // Aba: Imagem
            html += '<div class="vitrine-icon-tab-panel" data-panel="upload">';
            html += '<button type="button" class="button vitrine-aranha-select-icon">Selecionar da Biblioteca</button>';
            html += '</div>';
            // Aba: Dashicons
            html += '<div class="vitrine-icon-tab-panel" data-panel="dashicons" style="display:none;">';
            html += '<input type="text" class="vitrine-icon-search" placeholder="Filtrar dashicons..." />';
            html += '<div class="vitrine-icons-grid">';
            DASHICONS_LIST.forEach(function (d) {
                html += '<button type="button" class="vitrine-icon-pick" data-icon="' + escapeAttr(d) + '" title="' + escapeAttr(d) + '"><span class="dashicons ' + escapeAttr(d) + '"></span></button>';
            });
            html += '</div></div>';
            // Aba: Font Awesome
            html += '<div class="vitrine-icon-tab-panel" data-panel="fa" style="display:none;">';
            html += '<input type="text" class="vitrine-icon-search" placeholder="Filtrar ícones FA..." />';
            html += '<div class="vitrine-icons-grid">';
            FA_ICONS_LIST.forEach(function (f) {
                html += '<button type="button" class="vitrine-icon-pick" data-icon="' + escapeAttr(f) + '" title="' + escapeAttr(f) + '"><i class="' + escapeAttr(f) + '"></i></button>';
            });
            html += '</div></div>';
            html += '</div>'; // picker
            html += '</div></div>'; // icon-field + field-group
            html += '</div>';
        });

        html += '<button type="button" class="button vitrine-aranha-add-item">+ Adicionar Item</button>';
        html += '</div>';

        $panel.append(html);
    }

    /**
     * Gera o HTML do picker de ícones (reutilizável).
     */
    function buildIconPickerHtml() {
        var h = '<div class="vitrine-icon-picker" style="display:none;">';
        h += '<div class="vitrine-icon-picker-tabs">';
        h += '<button type="button" class="vitrine-icon-tab is-active" data-tab="upload">Imagem</button>';
        h += '<button type="button" class="vitrine-icon-tab" data-tab="dashicons">Dashicons</button>';
        h += '<button type="button" class="vitrine-icon-tab" data-tab="fa">Font Awesome</button>';
        h += '</div>';
        h += '<div class="vitrine-icon-tab-panel" data-panel="upload">';
        h += '<button type="button" class="button vitrine-aranha-select-icon">Selecionar da Biblioteca</button>';
        h += '</div>';
        h += '<div class="vitrine-icon-tab-panel" data-panel="dashicons" style="display:none;">';
        h += '<input type="text" class="vitrine-icon-search" placeholder="Filtrar dashicons..." />';
        h += '<div class="vitrine-icons-grid">';
        DASHICONS_LIST.forEach(function (d) {
            h += '<button type="button" class="vitrine-icon-pick" data-icon="' + escapeAttr(d) + '" title="' + escapeAttr(d) + '"><span class="dashicons ' + escapeAttr(d) + '"></span></button>';
        });
        h += '</div></div>';
        h += '<div class="vitrine-icon-tab-panel" data-panel="fa" style="display:none;">';
        h += '<input type="text" class="vitrine-icon-search" placeholder="Filtrar ícones FA..." />';
        h += '<div class="vitrine-icons-grid">';
        FA_ICONS_LIST.forEach(function (f) {
            h += '<button type="button" class="vitrine-icon-pick" data-icon="' + escapeAttr(f) + '" title="' + escapeAttr(f) + '"><i class="' + escapeAttr(f) + '"></i></button>';
        });
        h += '</div></div>';
        h += '</div>'; // picker
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

        // Cabeçalho da seção
        var html = '<div class="vitrine-aranha-section vitrine-a2-section" data-aranha-key="items">';
        html += '<hr style="border:none;border-top:1px solid #dcdcde;margin:14px 0 12px;" />';
        html += '<div class="vitrine-a2-section-head">';
        html += '<div>';
        html += '<h4 class="vitrine-aranha-section-title">Itens Orbitais</h4>';
        html += '<p class="vitrine-a2-section-hint">Distribuídos automaticamente ao redor da imagem central. Arraste para reordenar.</p>';
        html += '</div>';
        html += '<span class="vitrine-a2-count-badge">' + items.length + '</span>';
        html += '</div>';

        // Lista de itens (drag-sortable)
        html += '<div class="vitrine-aranha-items-list vitrine-a2-items-list" data-aranha-key="items">';

        items.forEach(function (ai, idx) {
            var hasIcon = !!ai.icon;
            var hasLink = !!ai.link;

            html += '<div class="vitrine-aranha-item vitrine-a2-item" data-aranha-idx="' + idx + '">';

            // ── Cabeçalho do item: drag + número + preview text + badges + remover ──
            html += '<div class="vitrine-a2-item-header">';
            html += '<span class="vitrine-aranha-drag dashicons dashicons-move" title="Arrastar para reordenar"></span>';
            html += '<span class="vitrine-aranha-item-num">' + (idx + 1) + '</span>';
            html += '<span class="vitrine-a2-item-preview-text">' + escapeHtml(ai.text || 'Item ' + (idx + 1)) + '</span>';
            if (hasIcon) { html += '<span class="vitrine-a2-badge vitrine-a2-badge--icon" title="Tem ícone"><span class="dashicons dashicons-format-image"></span></span>'; }
            if (hasLink) { html += '<span class="vitrine-a2-badge vitrine-a2-badge--link" title="Tem link"><span class="dashicons dashicons-admin-links"></span></span>'; }
            html += '<button type="button" class="button button-small vitrine-aranha-remove-item" title="Remover item">&times;</button>';
            html += '</div>';

            // ── Corpo do item: 2 colunas ──
            html += '<div class="vitrine-a2-item-body">';

            // Coluna esquerda: ícone clicável + botões
            html += '<div class="vitrine-aranha-icon-field vitrine-a2-icon-col">';

            // Display grande clicável
            var iconPreview = hasIcon
                ? renderIconPreviewHtml(ai.icon)
                : '<span class="dashicons dashicons-format-image" style="font-size:28px;width:28px;height:28px;color:#c3c4c7;"></span>';

            html += '<div class="vitrine-a2-icon-display vitrine-aranha-open-picker" title="Clique para escolher ícone ou imagem">';
            html += '<div class="vitrine-icon-current">' + iconPreview + '</div>';
            html += '<span class="vitrine-a2-icon-hint">' + (hasIcon ? 'Trocar' : 'Adicionar') + '</span>';
            html += '</div>';

            html += '<input type="hidden" class="vitrine-aranha-field" data-aranha-prop="icon" value="' + escapeAttr(ai.icon || '') + '" />';

            // Botão remover ícone (visível só quando tem ícone)
            html += '<div class="vitrine-icon-actions vitrine-a2-icon-actions">';
            if (hasIcon) {
                html += '<button type="button" class="button vitrine-aranha-remove-icon">Remover</button>';
            }
            html += '</div>';

            // Picker
            html += buildIconPickerHtml();
            html += '</div>'; // icon-col

            // Coluna direita: rótulo + link
            html += '<div class="vitrine-a2-fields-col">';

            // Campo: rótulo/texto
            html += '<div class="vitrine-field-group">';
            html += '<label>Rótulo</label>';
            html += '<input type="text" class="vitrine-aranha-field vitrine-a2-text-input" data-aranha-prop="text"'
                + ' value="' + escapeAttr(ai.text || '') + '"'
                + ' placeholder="Nome ou texto exibido..." />';
            html += '</div>';

            // Campo: link
            html += '<div class="vitrine-field-group">';
            html += '<label><span class="dashicons dashicons-admin-links" style="font-size:13px;vertical-align:middle;margin-right:3px;color:#0073aa;"></span>Link <span style="font-weight:400;color:#8c8f94;">(opcional)</span></label>';
            html += '<input type="text" class="vitrine-aranha-field" data-aranha-prop="link"'
                + ' value="' + escapeAttr(ai.link || '') + '"'
                + ' placeholder="https://..." />';
            html += '<p class="vitrine-field-hint">Torna o card clicável como botão.</p>';
            html += '</div>';

            html += '</div>'; // fields-col
            html += '</div>'; // item-body
            html += '</div>'; // item
        });

        html += '</div>'; // items-list

        // Botão adicionar
        html += '<button type="button" class="button vitrine-aranha-add-item vitrine-a2-add-btn">'
            + '<span class="dashicons dashicons-plus-alt2"></span> Adicionar Item'
            + '</button>';

        html += '</div>'; // section

        $panel.append(html);
    }

    /* ──────────────────────────────────────────────────────
       Aranha Grade (aranha3) — repeater de cards
    ────────────────────────────────────────────────────── */
    function renderAranha3Repeater($panel, item) {
        if (!item.settings.items || !Array.isArray(item.settings.items)) {
            item.settings.items = [];
        }
        var items = item.settings.items;

        var html = '<div class="vitrine-aranha-section vitrine-a3-section" data-aranha-key="items">';
        html += '<h4 class="vitrine-aranha-section-title" style="margin:0 0 4px;">Cards do Grid</h4>';
        html += '<p style="margin:0 0 10px;font-size:11px;color:#8c8f94;line-height:1.5;">Ordem recomendada: esquerda → topo (3) → direita → base (3). Use <strong>Posição</strong> para fixar cada card.</p>';
        html += '<div class="vitrine-a3-items-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">';
        html += '<span style="font-size:11px;color:#8c8f94;">' + items.length + ' card' + (items.length !== 1 ? 's' : '') + '</span>';
        html += '</div>';

        html += '<div class="vitrine-aranha-items-list vitrine-a3-items-list" data-aranha-key="items">';

        items.forEach(function (ai, idx) {
            var hasIcon = !!ai.icon;
            var hasLink = !!ai.link;

            html += '<div class="vitrine-aranha-item vitrine-a3-item" data-aranha-idx="' + idx + '">';

            html += '<div class="vitrine-a2-item-header">';
            html += '<span class="vitrine-aranha-drag dashicons dashicons-move" title="Arrastar para reordenar"></span>';
            html += '<span class="vitrine-aranha-item-num">' + (idx + 1) + '</span>';
            html += '<span class="vitrine-a2-item-preview-text">' + escapeHtml(ai.title || 'Card ' + (idx + 1)) + '</span>';
            if (hasIcon) { html += '<span class="vitrine-a2-badge vitrine-a2-badge--icon" title="Tem ícone"><span class="dashicons dashicons-format-image"></span></span>'; }
            if (hasLink) { html += '<span class="vitrine-a2-badge vitrine-a2-badge--link" title="Tem link"><span class="dashicons dashicons-admin-links"></span></span>'; }
            html += '<button type="button" class="button button-small vitrine-aranha-remove-item" title="Remover">&times;</button>';
            html += '</div>';

            html += '<div class="vitrine-a2-item-body vitrine-a3-item-body">';

            html += '<div class="vitrine-aranha-icon-field vitrine-a2-icon-col vitrine-a3-icon-col">';
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

            html += '<div class="vitrine-a2-fields-col vitrine-a3-fields-col">';

            html += '<div class="vitrine-field-group">';
            html += '<label>Posição no grid</label>';
            html += '<select class="vitrine-aranha-field" data-aranha-prop="position">';
            var posVal = ai.position || 'auto';
            html += '<option value="auto"' + (posVal === 'auto' ? ' selected' : '') + '>Automático</option>';
            html += '<option value="top"' + (posVal === 'top' ? ' selected' : '') + '>Topo</option>';
            html += '<option value="bottom"' + (posVal === 'bottom' ? ' selected' : '') + '>Base</option>';
            html += '<option value="left"' + (posVal === 'left' ? ' selected' : '') + '>Esquerda</option>';
            html += '<option value="right"' + (posVal === 'right' ? ' selected' : '') + '>Direita</option>';
            html += '</select>';
            html += '<p class="vitrine-field-hint">Fixa o card na lateral ou faixa desejada.</p>';
            html += '</div>';

            html += '<div class="vitrine-field-group">';
            html += '<label>Título</label>';
            html += '<input type="text" class="vitrine-aranha-field vitrine-a3-title-input" data-aranha-prop="title"'
                + ' value="' + escapeAttr(ai.title || '') + '"'
                + ' placeholder="Título do card..." />';
            html += '</div>';

            html += '<div class="vitrine-field-group">';
            html += '<label>Descrição</label>';
            html += '<textarea class="vitrine-aranha-field" data-aranha-prop="text"'
                + ' rows="3" placeholder="Texto do card...">' + escapeHtml(ai.text || '') + '</textarea>';
            html += '</div>';

            html += '<div class="vitrine-field-group">';
            html += '<label><span class="dashicons dashicons-admin-links" style="font-size:13px;vertical-align:middle;margin-right:3px;color:#0073aa;"></span>Link <span style="font-weight:400;color:#8c8f94;">(opcional)</span></label>';
            html += '<input type="text" class="vitrine-aranha-field" data-aranha-prop="link"'
                + ' value="' + escapeAttr(ai.link || '') + '"'
                + ' placeholder="https://..." />';
            html += '<p class="vitrine-field-hint">Torna o card clicável.</p>';
            html += '</div>';

            html += '</div>';
            html += '</div>';
            html += '</div>';
        });

        html += '</div>'; // items-list

        html += '<button type="button" class="button vitrine-aranha-add-item vitrine-a3-add-btn" style="width:100%;margin-top:8px;justify-content:center;">'
            + '<span class="dashicons dashicons-plus-alt2" style="margin-top:3px;"></span> Adicionar Card'
            + '</button>';

        html += '</div>'; // section

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

        // Re-renderiza preview do bloco selecionado
        var $block = $('[data-id="' + selectedId + '"]').first().find('> .vitrine-block-preview');
        var elDef  = elements[item.type];
        if ($block.length && elDef) {
            var settings = $.extend({}, elDef.defaults, item.settings);
            $block.html(buildPreview(item.type, settings));
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

        // Atualiza preview
        var $block = $('[data-id="' + selectedId + '"]').first().find('> .vitrine-block-preview');
        var elDef  = elements[item.type];
        if ($block.length && elDef) {
            var s = $.extend(true, {}, elDef.defaults, item.settings);
            $block.html(buildPreview(item.type, s));
        }
    });

    // Adicionar item à aranha
    $(document).on('click', '.vitrine-aranha-add-item', function (e) {
        e.preventDefault();
        if (!selectedId) return;
        var item = findItemById(selectedId);
        if (!item) return;

        var key = $(this).closest('.vitrine-aranha-section').data('aranha-key');
        if (!item.settings[key]) item.settings[key] = [];
        if (item.type === 'aranha3') {
            item.settings[key].push({ title: '', text: '', icon: '', link: '', position: 'auto' });
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
        $('.vitrine-icon-picker').not($picker).hide(); // fecha outros
        $picker.toggle();
    });

    // Trocar aba do picker
    $(document).on('click', '.vitrine-icon-tab', function () {
        var tab = $(this).data('tab');
        var $picker = $(this).closest('.vitrine-icon-picker');
        $picker.find('.vitrine-icon-tab').removeClass('is-active');
        $(this).addClass('is-active');
        $picker.find('.vitrine-icon-tab-panel').hide();
        $picker.find('[data-panel="' + tab + '"]').show();
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

    // Aranha2: atualizar preview do header ao digitar o rótulo
    $(document).on('input', '.vitrine-a2-text-input', function () {
        var val = $(this).val();
        var $item = $(this).closest('.vitrine-a2-item');
        $item.find('.vitrine-a2-item-preview-text').text(val || 'Item sem rótulo');
    });

    // Aranha3: atualizar preview do título no header do card
    $(document).on('input', '.vitrine-a3-title-input', function () {
        var val = $(this).val();
        $(this).closest('.vitrine-a3-item').find('.vitrine-a2-item-preview-text').text(val || 'Card sem título');
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
            $block.html(buildPreview(item.type, s));
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

    /* ──────────────────── Imagem + Links: Eventos dos itens dinâmicos ──────────────────── */

    function refreshImagelinksPreview() {
        if (!selectedId) return;
        var item = findItemById(selectedId);
        if (!item || item.type !== 'imagelinks') return;
        var $block = $('[data-id="' + selectedId + '"]').first().find('> .vitrine-block-preview');
        var elDef  = elements[item.type];
        if ($block.length && elDef) {
            var s = $.extend(true, {}, elDef.defaults, item.settings);
            $block.html(buildPreview(item.type, s));
        }
    }

    $(document).on('input change', '.vitrine-imagelinks-field', function () {
        if (!selectedId) return;
        var item = findItemById(selectedId);
        if (!item) return;

        var $iItem = $(this).closest('.vitrine-imagelinks-editor-item');
        var idx    = $iItem.data('imagelinks-idx');
        var prop   = $(this).data('imagelinks-prop');

        if (!item.settings.items) item.settings.items = [];
        if (!item.settings.items[idx]) item.settings.items[idx] = { label: '', url: '' };
        item.settings.items[idx][prop] = $(this).val();

        refreshImagelinksPreview();
    });

    $(document).on('click', '.vitrine-imagelinks-add-item', function (e) {
        e.preventDefault();
        if (!selectedId) return;
        var item = findItemById(selectedId);
        if (!item) return;

        if (!item.settings.items) item.settings.items = [];
        item.settings.items.push({ label: '', url: '' });

        renderSettings();
        renderCanvas();
    });

    $(document).on('click', '.vitrine-imagelinks-remove-item', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (!selectedId) return;
        var item = findItemById(selectedId);
        if (!item) return;

        var idx = $(this).closest('.vitrine-imagelinks-editor-item').data('imagelinks-idx');
        if (item.settings.items) {
            item.settings.items.splice(idx, 1);
        }

        renderSettings();
        renderCanvas();
    });

    /* ──────────────────── Salvar Layout ──────────────────── */

    function saveLayout() {
        var $btn = $('#vitrine-save-btn');
        $btn.prop('disabled', true).text('Salvando…');

        $.ajax({
            url: vitrineData.ajaxUrl,
            method: 'POST',
            data: {
                action:        'vitrine_save_layout',
                nonce:         vitrineData.nonce,
                post_id:       vitrineData.postId,
                layout:        JSON.stringify(layout),
                page_settings: JSON.stringify(pageSettings)
            },
            success: function (res) {
                if (res.success) {
                    $btn.text("\u2714 Salvo!");
                } else {
                    $btn.text('Erro ao salvar');
                }
                setTimeout(function () {
                    $btn.prop('disabled', false).text('Salvar Layout');
                }, 1500);
            },
            error: function () {
                $btn.prop('disabled', false).text('Erro – tentar novamente');
            }
        });
    }

    /* ──────────────────── Inicialização ──────────────────── */

    $(function () {
        var showH  = pageSettings.show_header !== '0';
        var showF  = pageSettings.show_footer !== '0';
        var pgBg   = pageSettings.page_bg_color || '';

        $('#vitrine-editor').before(
            '<div id="vitrine-topbar">' +
                '<div id="vitrine-page-settings">' +
                    '<label class="vitrine-topbar-toggle"><input type="checkbox" id="vitrine-opt-header"' + (showH ? ' checked' : '') + ' /> Header</label>' +
                    '<label class="vitrine-topbar-toggle"><input type="checkbox" id="vitrine-opt-footer"' + (showF ? ' checked' : '') + ' /> Footer</label>' +
                    '<label class="vitrine-topbar-color">Fundo: <input type="color" id="vitrine-opt-bg" value="' + escapeAttr(pgBg || '#ffffff') + '" /></label>' +
                    (pgBg ? '<button type="button" id="vitrine-opt-bg-clear" class="button button-small" title="Limpar cor">&#10005;</button>' : '') +
                '</div>' +
                '<button type="button" id="vitrine-save-btn" class="button button-primary button-large">Salvar Layout</button>' +
            '</div>'
        );

        // ── Hero Section UI ──
        var heroImg       = pageSettings.hero_image || '';
        var heroText      = pageSettings.hero_text || '';
        var heroTxtColor  = pageSettings.hero_text_color || '#ffffff';
        var heroOpacity   = pageSettings.hero_overlay_opacity || '50';
        var heroHeight    = pageSettings.hero_height || '400';
        var heroFontSize  = pageSettings.hero_font_size || '36';
        var heroTextAlign = pageSettings.hero_text_align || 'center';
        var heroDesc      = pageSettings.hero_description || '';
        var heroDescSize  = pageSettings.hero_desc_size || '18';
        var heroTextBold  = pageSettings.hero_text_bold !== '0';
        var heroTextItal  = pageSettings.hero_text_italic === '1';
        var heroDescBold  = false; // formatação agora é inline no HTML
        var heroDescItal  = false;

        $('#vitrine-editor-top').before(
            '<div id="vitrine-hero-settings">' +
                '<h4>Hero da Página</h4>' +
                '<div class="vitrine-hero-fields">' +
                    '<div class="vitrine-hero-field">' +
                        '<label>Imagem de fundo</label>' +
                        '<div class="vitrine-image-field vitrine-hero-image-field">' +
                            (heroImg ? '<img src="' + escapeAttr(heroImg) + '" class="vitrine-image-preview" />' : '') +
                            '<input type="hidden" id="vitrine-hero-image" value="' + escapeAttr(heroImg) + '" />' +
                            '<button type="button" class="button" id="vitrine-hero-select-image">Selecionar</button>' +
                            (heroImg ? ' <button type="button" class="button" id="vitrine-hero-remove-image">Remover</button>' : '') +
                        '</div>' +
                    '</div>' +
                    '<div class="vitrine-hero-field">' +
                        '<label>Frase de destaque</label>' +
                        '<input type="text" id="vitrine-hero-text" value="' + escapeAttr(heroText) + '" placeholder="Título do hero" />' +
                        '<div class="vitrine-hero-format">' +
                            '<button type="button" class="vitrine-format-btn' + (heroTextBold ? ' is-active' : '') + '" data-target="text" data-prop="bold" title="Negrito"><b>B</b></button>' +
                            '<button type="button" class="vitrine-format-btn' + (heroTextItal ? ' is-active' : '') + '" data-target="text" data-prop="italic" title="Itálico"><i>I</i></button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="vitrine-hero-field vitrine-hero-field--row">' +
                        '<div>' +
                            '<label>Tamanho do texto (px)</label>' +
                            '<input type="number" id="vitrine-hero-font-size" value="' + escapeAttr(heroFontSize) + '" min="12" max="120" step="2" />' +
                        '</div>' +
                        '<div>' +
                            '<label>Alinhamento</label>' +
                            '<select id="vitrine-hero-text-align">' +
                                '<option value="left"' + (heroTextAlign === 'left' ? ' selected' : '') + '>Esquerda</option>' +
                                '<option value="center"' + (heroTextAlign === 'center' ? ' selected' : '') + '>Centro</option>' +
                                '<option value="right"' + (heroTextAlign === 'right' ? ' selected' : '') + '>Direita</option>' +
                            '</select>' +
                        '</div>' +
                    '</div>' +
                    '<div class="vitrine-hero-field vitrine-hero-field--wide">' +
                        '<label>Descrição</label>' +
                        '<div class="vitrine-wysiwyg-toolbar" id="vitrine-hero-desc-toolbar">' +
                            '<button type="button" class="vitrine-wysiwyg-btn" data-cmd="bold" title="Negrito"><b>B</b></button>' +
                            '<button type="button" class="vitrine-wysiwyg-btn" data-cmd="italic" title="Itálico"><i>I</i></button>' +
                            '<button type="button" class="vitrine-wysiwyg-btn" data-cmd="underline" title="Sublinhado"><u>U</u></button>' +
                            '<button type="button" class="vitrine-wysiwyg-btn" data-cmd="removeFormat" title="Limpar formatação">✕</button>' +
                        '</div>' +
                        '<div id="vitrine-hero-description" class="vitrine-aranha-wysiwyg" contenteditable="true">' + heroDesc + '</div>' +
                    '</div>' +
                    '<div class="vitrine-hero-field">' +
                        '<label>Tamanho da descrição (px)</label>' +
                        '<input type="number" id="vitrine-hero-desc-size" value="' + escapeAttr(heroDescSize) + '" min="10" max="60" step="1" />' +
                    '</div>' +
                    '<div class="vitrine-hero-field">' +
                        '<label>Cor do texto</label>' +
                        '<input type="color" id="vitrine-hero-text-color" value="' + escapeAttr(heroTxtColor) + '" />' +
                    '</div>' +
                    '<div class="vitrine-hero-field">' +
                        '<label>Opacidade do fade <span id="vitrine-hero-opacity-val">' + escapeHtml(heroOpacity) + '%</span></label>' +
                        '<input type="range" id="vitrine-hero-opacity" min="0" max="100" value="' + escapeAttr(heroOpacity) + '" />' +
                    '</div>' +
                    '<div class="vitrine-hero-field">' +
                        '<label>Altura (px)</label>' +
                        '<input type="number" id="vitrine-hero-height" value="' + escapeAttr(heroHeight) + '" min="100" max="1000" step="10" />' +
                    '</div>' +
                '</div>' +
                '<div id="vitrine-hero-preview"></div>' +
            '</div>'
        );

        var pageCustomCss = pageSettings.custom_css || '';

        $('#vitrine-hero-settings').after(
            '<div id="vitrine-page-css-settings">' +
                '<h4>CSS Personalizado da Vitrine</h4>' +
                '<p class="vitrine-page-css-hint">Aplicado a <strong>toda esta vitrine</strong> no frontend. Use seletores como <code>#vitrine-single</code>, <code>.vitrine-front</code> ou <code>.vitrine-block</code>.</p>' +
                '<textarea id="vitrine-page-custom-css" class="vitrine-page-css-textarea" rows="8" spellcheck="false" placeholder="#vitrine-single .vitrine-front {&#10;  max-width: 1400px;&#10;}">' + escapeHtml(pageCustomCss) + '</textarea>' +
            '</div>'
        );

        renderHeroPreview();

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

        // ── Hero event handlers ──
        $(document).on('click', '#vitrine-hero-select-image', function (e) {
            e.preventDefault();
            var frame = wp.media({ title: 'Imagem do Hero', multiple: false, library: { type: 'image' } });
            frame.on('select', function () {
                var url = frame.state().get('selection').first().toJSON().url;
                pageSettings.hero_image = url;
                $('#vitrine-hero-image').val(url);
                var $wrap = $('.vitrine-hero-image-field');
                $wrap.find('.vitrine-image-preview').remove();
                $wrap.prepend('<img src="' + escapeAttr(url) + '" class="vitrine-image-preview" />');
                if (!$('#vitrine-hero-remove-image').length) {
                    $('#vitrine-hero-select-image').after(' <button type="button" class="button" id="vitrine-hero-remove-image">Remover</button>');
                }
                renderHeroPreview();
            });
            frame.open();
        });

        $(document).on('click', '#vitrine-hero-remove-image', function () {
            pageSettings.hero_image = '';
            $('#vitrine-hero-image').val('');
            $('.vitrine-hero-image-field .vitrine-image-preview').remove();
            $(this).remove();
            renderHeroPreview();
        });

        $(document).on('input', '#vitrine-hero-text', function () {
            pageSettings.hero_text = $(this).val();
            renderHeroPreview();
        });

        $(document).on('input change', '#vitrine-hero-text-color', function () {
            pageSettings.hero_text_color = $(this).val();
            renderHeroPreview();
        });

        $(document).on('input', '#vitrine-hero-opacity', function () {
            pageSettings.hero_overlay_opacity = $(this).val();
            $('#vitrine-hero-opacity-val').text($(this).val() + '%');
            renderHeroPreview();
        });

        $(document).on('input change', '#vitrine-hero-height', function () {
            pageSettings.hero_height = $(this).val();
            renderHeroPreview();
        });

        $(document).on('input change', '#vitrine-hero-font-size', function () {
            pageSettings.hero_font_size = $(this).val();
            renderHeroPreview();
        });

        $(document).on('change', '#vitrine-hero-text-align', function () {
            pageSettings.hero_text_align = $(this).val();
            renderHeroPreview();
        });

        $(document).on('input', '#vitrine-hero-description[contenteditable]', function () {
            pageSettings.hero_description = $(this).html();
            renderHeroPreview();
        });

        $(document).on('mousedown', '#vitrine-hero-desc-toolbar .vitrine-wysiwyg-btn', function (e) {
            e.preventDefault();
            var cmd = $(this).data('cmd');
            document.execCommand(cmd, false, null);
            pageSettings.hero_description = $('#vitrine-hero-description').html();
            renderHeroPreview();
        });

        $(document).on('input change', '#vitrine-hero-desc-size', function () {
            pageSettings.hero_desc_size = $(this).val();
            renderHeroPreview();
        });

        $(document).on('click', '.vitrine-format-btn', function () {
            var target = $(this).data('target'); // 'text' ou 'desc'
            var prop   = $(this).data('prop');   // 'bold' ou 'italic'
            var key    = 'hero_' + target + '_' + prop;
            pageSettings[key] = pageSettings[key] === '1' ? '0' : '1';
            $(this).toggleClass('is-active', pageSettings[key] === '1');
            renderHeroPreview();
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

        $(document).on('click', '#vitrine-save-btn', function (e) {
            e.preventDefault();
            saveLayout();
        });
    });

})(jQuery);
