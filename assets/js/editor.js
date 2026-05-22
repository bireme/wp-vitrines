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
        hero_height: '400'
    };

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

        if (!img && !text) {
            $prev.empty().hide();
            return;
        }

        var bgStyle = img ? 'background:url(' + escapeAttr(img) + ') center/cover no-repeat;' : 'background:#333;';
        var html = '<div style="position:relative;' + bgStyle + 'height:' + h + 'px;border-radius:6px;overflow:hidden;display:flex;align-items:center;justify-content:center;margin-top:10px;">';
        html += '<div style="position:absolute;inset:0;background:rgba(0,0,0,' + opa + ');"></div>';
        if (text) {
            html += '<span style="position:relative;z-index:1;font-size:24px;font-weight:700;color:' + escapeAttr(color) + ';text-align:center;padding:0 20px;text-shadow:0 2px 8px rgba(0,0,0,.5);">' + escapeHtml(text) + '</span>';
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
            var customCss   = (item.settings && item.settings.custom_css) ? item.settings.custom_css : '';

            // Largura em flex para filhos de row container
            var widthStyle = '';
            var widthBadgeHtml = '';
            if (isRowContainer && item.width) {
                widthStyle = 'flex:0 1 ' + escapeAttr(item.width) + ';max-width:' + escapeAttr(item.width) + ';min-width:0;box-sizing:border-box;';
                var pctNum = Math.round(parseFloat(item.width));
                widthBadgeHtml = '<span class="vitrine-width-badge">' + pctNum + '%</span>';
            }

            var html =
                '<div class="vitrine-canvas-block' +
                    (isContainer ? ' vitrine-canvas-block--container' : '') +
                    (isRowContainer ? ' vitrine-canvas-block--in-row' : '') +
                '" data-id="' + item.id + '" data-type="' + item.type + '" style="' + heightStyle + widthStyle + escapeAttr(customCss) + '">' +
                    '<div class="vitrine-block-toolbar">' +
                        '<span class="vitrine-drag-handle dashicons dashicons-move"></span>' +
                        '<span class="vitrine-block-label">' + escapeHtml(elDef.label) + '</span>' +
                        widthBadgeHtml +
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
                        if (settings.bg_image) {
                            dropStyle += 'background-image:url(' + escapeAttr(settings.bg_image) + ');background-size:' + escapeAttr(settings.bg_size || 'cover') + ';background-position:center;background-repeat:no-repeat;';
                        } else {
                            dropStyle += 'background-color:' + escapeAttr(settings.bg_color || '#f5f5f5') + ';';
                        }
                        return '<div class="vitrine-container-drop' + (settings.direction === 'row' ? ' vitrine-container-drop--row' : '') + '" data-parent-id="' + item.id + '" style="' + dropStyle + '"></div>';
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
     * Preview simplificado de cada tipo de elemento dentro do canvas.
     */
    function buildPreview(type, settings) {
        switch (type) {
            case 'title':
                var tag = settings.tag || 'h2';
                return '<' + tag + ' style="color:' + escapeAttr(settings.color || '#333') + ';font-size:' + parseInt(settings.font_size || 28, 10) + 'px;text-align:' + escapeAttr(settings.align || 'left') + '">' + escapeHtml(settings.text || '') + '</' + tag + '>';
            case 'text':
                return '<div style="color:' + escapeAttr(settings.color || '#555') + ';font-size:' + parseInt(settings.font_size || 16, 10) + 'px;text-align:' + escapeAttr(settings.align || 'left') + '">' + (settings.content || '') + '</div>';
            case 'image':
                if (settings.url) {
                    return '<div style="text-align:' + escapeAttr(settings.align || 'center') + '"><img src="' + escapeAttr(settings.url) + '" style="max-width:' + parseInt(settings.width || 100, 10) + '%;height:auto;" alt="" /></div>';
                }
                return '<p style="text-align:center;color:#999;">Nenhuma imagem selecionada</p>';
            case 'button':
                return '<div style="text-align:' + escapeAttr(settings.align || 'center') + '"><span style="display:inline-block;padding:10px 24px;background:' + escapeAttr(settings.bg_color || '#0073aa') + ';color:' + escapeAttr(settings.color || '#fff') + ';border-radius:4px;">' + escapeHtml(settings.text || 'Botão') + '</span></div>';
            case 'container':
                var dirLabel = (settings.direction === 'row') ? 'Linha (→)' : 'Coluna (↓)';
                var cBg = 'background-color:' + escapeAttr(settings.bg_color || '#f5f5f5') + ';';
                if (settings.bg_image) {
                    cBg += 'background-image:url(' + escapeAttr(settings.bg_image) + ');background-size:' + escapeAttr(settings.bg_size || 'cover') + ';background-position:center;';
                }
                return '<div class="vitrine-container-label" style="' + cBg + 'padding:4px 10px;font-size:11px;color:#666;border-radius:3px 3px 0 0;">Container – ' + escapeHtml(dirLabel) + '</div>';
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
                    var base = 'flex:1;min-width:10px;position:relative;align-self:stretch;' + overlap + 'z-index:1;';
                    if (bend === 'straight') {
                        return '<div style="' + base + '">' +
                            '<div style="position:absolute;top:50%;left:0;right:0;height:2px;background:' + color + ';transform:translateY(-50%);"></div>' +
                        '</div>';
                    }
                    var segs = '';
                    if (side === 'left') {
                        segs += '<div style="position:absolute;top:50%;left:0;width:50%;height:2px;background:' + color + ';"></div>';
                        if (bend === 'down') {
                            segs += '<div style="position:absolute;top:50%;left:50%;width:2px;bottom:0;background:' + color + ';transform:translateX(-50%);"></div>';
                            segs += '<div style="position:absolute;bottom:0;left:50%;right:0;height:2px;background:' + color + ';"></div>';
                        } else {
                            segs += '<div style="position:absolute;top:0;left:50%;width:2px;bottom:50%;background:' + color + ';transform:translateX(-50%);"></div>';
                            segs += '<div style="position:absolute;top:0;left:50%;right:0;height:2px;background:' + color + ';"></div>';
                        }
                    } else {
                        segs += '<div style="position:absolute;top:50%;right:0;width:50%;height:2px;background:' + color + ';"></div>';
                        if (bend === 'down') {
                            segs += '<div style="position:absolute;top:50%;right:50%;width:2px;bottom:0;background:' + color + ';transform:translateX(50%);"></div>';
                            segs += '<div style="position:absolute;bottom:0;left:0;right:50%;height:2px;background:' + color + ';"></div>';
                        } else {
                            segs += '<div style="position:absolute;top:0;right:50%;width:2px;bottom:50%;background:' + color + ';transform:translateX(50%);"></div>';
                            segs += '<div style="position:absolute;top:0;left:0;right:50%;height:2px;background:' + color + ';"></div>';
                        }
                    }
                    return '<div style="' + base + '">' + segs + '</div>';
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
                            if (ic) h += '<img src="' + escapeAttr(ic) + '" style="width:' + aIconSize + 'px;height:' + aIconSize + 'px;border-radius:3px;object-fit:contain;flex-shrink:0;" alt="" />';
                            h += '</div>';
                            h += buildAranhaArm(bend, side, aLineColor);
                        } else {
                            h += buildAranhaArm(bend, side, aLineColor);
                            h += '<div style="display:flex;align-items:center;gap:6px;border:2px solid ' + aLineColor + ';border-radius:8px;padding:6px 10px;background:#fff;flex-shrink:0;max-width:180px;position:relative;z-index:2;">';
                            if (ic) h += '<img src="' + escapeAttr(ic) + '" style="width:' + aIconSize + 'px;height:' + aIconSize + 'px;border-radius:3px;object-fit:contain;flex-shrink:0;" alt="" />';
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
                        if (ic) h += '<img src="' + escapeAttr(ic) + '" style="width:' + aIconSize + 'px;height:' + aIconSize + 'px;border-radius:3px;object-fit:contain;flex-shrink:0;" alt="" />';
                        h += '<span style="font-size:11px;color:' + aTextColor + ';line-height:1.3;text-align:center;">' + (t || '') + '</span>';
                        h += '</div>';
                        // Vertical arm
                        h += '<div style="flex:1;min-height:20px;width:100%;position:relative;margin-bottom:-20px;z-index:1;">';
                        if (bend === 'straight') {
                            h += '<div style="position:absolute;left:50%;top:0;bottom:0;width:2px;background:' + aLineColor + ';transform:translateX(-50%);"></div>';
                        } else {
                            h += '<div style="position:absolute;left:50%;top:0;height:50%;width:2px;background:' + aLineColor + ';transform:translateX(-50%);"></div>';
                            if (bend === 'left') {
                                h += '<div style="position:absolute;top:50%;left:50%;right:0;height:2px;background:' + aLineColor + ';"></div>';
                                h += '<div style="position:absolute;top:50%;right:0;bottom:0;width:2px;background:' + aLineColor + ';"></div>';
                            } else {
                                h += '<div style="position:absolute;top:50%;left:0;right:50%;height:2px;background:' + aLineColor + ';"></div>';
                                h += '<div style="position:absolute;top:50%;left:0;bottom:0;width:2px;background:' + aLineColor + ';"></div>';
                            }
                        }
                        h += '</div>';
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
            $panel.html('<p class="vitrine-settings-empty">Selecione um elemento para configurar.</p>');
            return;
        }

        var item = findItemById(selectedId);
        if (!item) return;

        var elDef = elements[item.type];
        if (!elDef) return;

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
                case 'number':
                    inputHtml = '<input type="number" class="vitrine-field" data-field="' + escapeAttr(field.name) + '" value="' + escapeAttr(val) + '" />';
                    break;
                case 'color':
                    inputHtml = '<input type="color" class="vitrine-field" data-field="' + escapeAttr(field.name) + '" value="' + escapeAttr(val) + '" />';
                    break;
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

            $panel.append(
                '<div class="vitrine-field-group">' +
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

        // Inicializa TinyMCE nos campos de texto da aranha
        if (item.type === 'aranha') {
            setTimeout(initAranhaMCE, 50);
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
            html += '<div class="vitrine-field-group"><label>Ícone</label>';
            html += '<div class="vitrine-image-field vitrine-aranha-icon-field">';
            if (ai.icon) {
                html += '<img src="' + escapeAttr(ai.icon) + '" class="vitrine-image-preview" />';
            }
            html += '<input type="hidden" class="vitrine-aranha-field" data-aranha-prop="icon" value="' + escapeAttr(ai.icon || '') + '" />';
            html += '<button type="button" class="button vitrine-aranha-select-icon">Ícone</button>';
            if (ai.icon) {
                html += ' <button type="button" class="button vitrine-aranha-remove-icon">Remover</button>';
            }
            html += '</div></div>';
            html += '</div>';
        });

        html += '<button type="button" class="button vitrine-aranha-add-item">+ Adicionar Item</button>';
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
        item.settings[field] = val;

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
        if (!item.settings[key][idx]) item.settings[key][idx] = { text: '', icon: '', link: '' };
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
        item.settings[key].push({ text: '', icon: '', link: '' });

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

    // Selecionar ícone do item aranha
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
            $container.find('.vitrine-image-preview').remove();
            $container.find('.vitrine-aranha-remove-icon').remove();
            $container.prepend('<img src="' + escapeAttr(attachment.url) + '" class="vitrine-image-preview" />');
            $container.find('.vitrine-aranha-select-icon').after(' <button type="button" class="button vitrine-aranha-remove-icon">Remover</button>');
        });

        frame.open();
    });

    // Remover ícone do item aranha
    $(document).on('click', '.vitrine-aranha-remove-icon', function (e) {
        e.preventDefault();
        var $container = $(this).closest('.vitrine-aranha-icon-field');
        $container.find('.vitrine-aranha-field[data-aranha-prop="icon"]').val('').trigger('change');
        $container.find('.vitrine-image-preview').remove();
        $(this).remove();
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
        var heroImg      = pageSettings.hero_image || '';
        var heroText     = pageSettings.hero_text || '';
        var heroTxtColor = pageSettings.hero_text_color || '#ffffff';
        var heroOpacity  = pageSettings.hero_overlay_opacity || '50';
        var heroHeight   = pageSettings.hero_height || '400';

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

        renderHeroPreview();

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

        $('#vitrine-hero-text').on('input', function () {
            pageSettings.hero_text = $(this).val();
            renderHeroPreview();
        });

        $('#vitrine-hero-text-color').on('input change', function () {
            pageSettings.hero_text_color = $(this).val();
            renderHeroPreview();
        });

        $('#vitrine-hero-opacity').on('input', function () {
            pageSettings.hero_overlay_opacity = $(this).val();
            $('#vitrine-hero-opacity-val').text($(this).val() + '%');
            renderHeroPreview();
        });

        $('#vitrine-hero-height').on('input change', function () {
            pageSettings.hero_height = $(this).val();
            renderHeroPreview();
        });

        renderCanvas();
        renderSettings();

        // Toggle painel inferior
        $(document).on('click', '#vitrine-settings-toggle', function () {
            $('#vitrine-settings-bottom').toggleClass('is-collapsed');
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
