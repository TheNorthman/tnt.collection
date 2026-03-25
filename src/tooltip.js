// Tooltip/Bubbletip Testing Module
tnt.tooltip = {
    // Initialize the tooltip system (ensure BubbleTips is ready)
    init() {
        if (typeof BubbleTips === 'undefined' || typeof BubbleTips.bindBubbleTip !== 'function') {
            tnt.core.debug.log('[TNT] BubbleTips system is not available');
            return false;
        }

        if (!BubbleTips.bubbleNode || !BubbleTips.infoNode) {
            BubbleTips.init?.();
        }

        // Ensure hover/info bubbles are non-interactive so they do not steal mouse events and cause flicker
        $(BubbleTips.bubbleNode).css('pointer-events', 'none');
        $(BubbleTips.infoNode).css('pointer-events', 'none');

        // Patch BubbleTips hover tooltip position to auto-flip above cursor when near viewport bottom
        if (!BubbleTips._tntTooltipAutoFlip) {
            const originalBindBubbleTip = BubbleTips.bindBubbleTip.bind(BubbleTips);
            BubbleTips.bindBubbleTip = function (location, type, html, n, target, minSize) {
                const result = originalBindBubbleTip(location, type, html, n, target, minSize);

                if (type === 13 && target) {
                    const $target = $(target);

                    // Remove the original BubbleTips mousemove for this target and use our own logic
                    $target.off('mousemove');
                    $target.off('mousemove.tnt_tooltip_auto_flip');

                    $target.on('mousemove.tnt_tooltip_auto_flip', function (event) {
                        if (!BubbleTips.infotip || !BubbleTips.infoNode) return;

                        const $tip = $(BubbleTips.infotip);
                        const tooltipWidth = $tip.outerWidth();
                        const tooltipHeight = $tip.outerHeight();
                        const scrollLeft = $(document).scrollLeft();
                        const scrollTop = $(window).scrollTop();
                        const winWidth = $(window).width();
                        const winHeight = $(window).height();

                        const pageX = event.pageX || event.clientX + scrollLeft;
                        const pageY = event.pageY || event.clientY + scrollTop;

                        const xOffset = Number(BubbleTips.offsetLeft || 0);
                        const yOffset = Number(BubbleTips.offsetTop || 0) + (window.isIE ? 10 : 0);
                        const aboveGap = 15; // keep a small gap when flipped above cursor

                        let left = pageX + xOffset;
                        let top = pageY + yOffset;

                        if (left + tooltipWidth - 20 > winWidth + scrollLeft) {
                            left = pageX - tooltipWidth + 20;
                        }
                        if (left < scrollLeft + 20) {
                            left = scrollLeft + 20;
                        }

                        if (top + tooltipHeight + 10 > winHeight + scrollTop) {
                            top = pageY - tooltipHeight - aboveGap;
                        }
                        if (top < scrollTop + 10) {
                            top = scrollTop + 10;
                        }

                        $(BubbleTips.infoNode).css({ top: top + 'px', left: left + 'px' });
                    });
                }

                return result;
            };

            BubbleTips._tntTooltipAutoFlip = true;
        }

        tnt.core.debug.log('[TNT] BubbleTips system is available and initialized');
        return true;
    },

    formatTemplateTooltip({ title, body }) {
        const titleHtml = title ? `<div style="font-weight:bold !important;color:#000 !important;font-size:12px;line-height:1.2;">${title}</div><div style="height:0.5px;min-height:0.5px;background:#000;margin:2px 0;line-height:0;overflow:hidden;"></div>` : '';
        const bodyHtml = body ? `<div style="font-size:12px;line-height:1.4;">${body}</div>` : '';
        return `<div>${titleHtml}${bodyHtml}</div>`;
    },

    // Bind a tooltip HTML to an element
    bindToElement($el, html) {
        if (!$el || $el.length === 0 || !html) return;

        $el.off('mouseover.tnt mouseout.tnt');

        const showTooltip = (element) => {
            try {
                BubbleTips.clear?.();
                BubbleTips.init?.();
                $(BubbleTips.infoNode).css({ 'z-index': '100000001', 'display': 'block' });
                BubbleTips.bindBubbleTip(6, 13, html, null, element, false);
            } catch (err) {
                tnt.core.debug.warn('TNT: Tooltip bind failed: ' + err, 2);
            }
        };

        const hideTooltip = () => BubbleTips.clear?.();

        $el.on('mouseover.tnt', function (event) {
            const related = event.relatedTarget;
            if (related && $(related).closest($el).length) return;
            showTooltip(this);
        });

        $el.on('mouseout.tnt', function (event) {
            const related = event.relatedTarget;
            if (related && $(related).closest($el).length) return;
            hideTooltip();
        });
    },

    // Bind a template tooltip to an element, filling in calculated values for resources/buildings
    bindTemplateTooltip($el, section, key, context = 'header') {
        if (!$el || $el.length === 0) return;

        // Helpers
        const replaceAll = (template, replacements) => {
            let out = template;
            Object.entries(replacements).forEach(([k, v]) => {
                out = out.split(`{${k}}`).join(v || '');
            });
            return out;
        };

        // Lookup template
        const template =
            TNT_TOOLTIP_TEMPLATES?.[section]?.[context]?.[key] ||
            TNT_TOOLTIP_TEMPLATES?.[section]?.[context]?.default ||
            TNT_TOOLTIP_TEMPLATES?.[section]?.[key] ||
            TNT_TOOLTIP_TEMPLATES?.[key];

        if (!template) {
            tnt.core.debug.log(`[TNT] No tooltip template found for section="${section}", context="${context}", key="${key}"`, 2);
            return;
        }

        const fillTemplate = (tpl, replacements = {}) => {
            const titleText = tpl.title ? replaceAll(tpl.title, replacements) : '';
            const bodyText = tpl.body ? replaceAll(tpl.body, replacements) : '';
            return { title: titleText, body: bodyText };
        };

        if (section === 'resource') {
            const $row = $el.closest('tr');
            const cityId = $el.data('city-id') || ($row.length ? $row.data('city-id') : null);
            if (!cityId) return;

            const prod1h = tnt.utils.calculateProduction(cityId, 1);
            const prod24h = tnt.utils.calculateProduction(cityId, 24);

            const storeCity = tnt.data.storage.city?.[cityId];
            const storeForeignCity = tnt.data.storage.foreign?.[cityId];
            const allCities = tnt.get.player.list.cities() || {};
            const cityName = storeCity?.name || storeCity?.cityName || storeForeignCity?.name || allCities?.[cityId]?.name || allCities?.[cityId]?.cityName || `City ${cityId}`;
            const cityValue = String(storeCity?.[key] ?? storeForeignCity?.[key] ?? '');

            const replacements = {
                '1hwood': prod1h.wood,
                '24hwood': prod24h.wood,
                '1hwine': prod1h.wine,
                '24hwine': prod24h.wine,
                '1hmarble': prod1h.marble,
                '24hmarble': prod24h.marble,
                '1hcrystal': prod1h.crystal,
                '24hcrystal': prod24h.crystal,
                '1hsulfur': prod1h.sulfur,
                '24hsulfur': prod24h.sulfur,
                'cityName': cityName,
                'value': cityValue
            };

            const display = fillTemplate(template, replacements);
            tnt.tooltip.bindToElement($el, tnt.tooltip.formatTemplateTooltip(display));
            return;
        }

        if (section === 'building') {
            const cityId = $el.data('city-id') || $el.closest('tr').data('city-id');
            const def = TNT_BUILDING_DEFINITIONS.find(d => d.key === key) || { name: key };
            const maxedLvl = tnt.settings.getMaxedLvl(key);
            const defaultMaxedLvl = def.maxedLvl || 0;

            let totalLevel = 0;
            Object.values(tnt.data.storage.city || {}).forEach(city => {
                if (!city.buildings) return;
                if (key === 'palaceOrColony') {
                    const palace = city.buildings.palace || [];
                    const colony = city.buildings.palaceColony || [];
                    totalLevel += palace.reduce((sum, b) => sum + (b.level || 0), 0);
                    totalLevel += colony.reduce((sum, b) => sum + (b.level || 0), 0);
                } else {
                    const arr = city.buildings[key] || [];
                    totalLevel += arr.reduce((sum, b) => sum + (b.level || 0), 0);
                }
            });

            const allCities = tnt.get.player.list.cities() || {};
            const city = tnt.data.storage.city?.[cityId] || tnt.data.storage.foreign?.[cityId] || {};
            const cityName = city.name || city.cityName || allCities?.[cityId]?.name || allCities?.[cityId]?.cityName || `City ${cityId}`;

            let levelSum = 0;
            let statusText = '-';
            if (context === 'cell') {
                let levels = [];
                if (key === 'palaceOrColony') {
                    levels = (city.buildings?.palace || []).concat(city.buildings?.palaceColony || []);
                } else {
                    levels = city.buildings?.[key] || [];
                }
                levelSum = levels.reduce((sum, b) => sum + (b.level || 0), 0);
                statusText = levels.some(b => b.underConstruction) ? '<span class="red">Under construction</span>' : levels.some(b => b.upgradable) ? '<span class="green">Upgradable</span>' : '-';
            }

            const replacements = {
                cityName,
                buildingName: def.name || key,
                levelSum: String(levelSum),
                statusText,
                totalLevel: String(totalLevel),
                maxedLvl: String(maxedLvl),
                defaultMaxedLvl: String(defaultMaxedLvl)
            };

            const display = fillTemplate(template, replacements);
            tnt.tooltip.bindToElement($el, tnt.tooltip.formatTemplateTooltip(display));
            return;
        }

        const display = tnt.tooltip.formatTemplateTooltip(template);
        tnt.tooltip.bindToElement($el, display);
    },

    // Attach tooltips to elements with class 'tnt_tooltip_target'
    attachTooltips() {
        if (!tnt.tooltip.init()) {
            tnt.core.debug.log('TNT: BubbleTips not available', 2);
            return;
        }

        if (BubbleTips.bubbleNode) {
            $(BubbleTips.bubbleNode).css('z-index', '100000001');
        }
        if (BubbleTips.infoNode) {
            $(BubbleTips.infoNode).css('z-index', '100000001');
        }

        const $containers = $('.tnt_tooltip_target');
        tnt.core.debug.log(`[TNT] Adding tooltips to ${$containers.length} elements`, 3);

        $containers.each(function () {
            const $container = $(this);
            const section = $container.data('tooltip-section') || ($container.data('resource') ? 'resource' : ($container.data('building-type') ? 'building' : null));
            const context = $container.data('tooltip-context') || 'header';
            const key = $container.data('resource') || $container.data('building-type');
            if (!section || !key) return;

            // For building header cells, also bind tooltip to inner link/image nodes so hovering them triggers the same tooltip.
            const $bindTargets = $container.add($container.find('a, img'));
            tnt.tooltip.bindTemplateTooltip($bindTargets, section, key, context);
        });
    },

    // NOT USED: Create a simple tooltip on an element - Kept for now
    // Types: 10 = success (green), 11 = info (yellow), 12 = error (red), 13 = hover tooltip
    create(element, text, type = 13) {
        if (!this.init()) {
            tnt.core.debug.warn('TNT: BubbleTips not available, cannot create tooltip', 3);
            return false;
        }

        try {
            // Type 13 = hover tooltip that follows mouse
            // Parameters: location(6=custom element), type(13=tooltip), text, null, element, minSize
            BubbleTips.bindBubbleTip(6, type, text, null, element, false);
            return true;
        } catch (e) {
            tnt.core.debug.error('TNT: Error creating tooltip: ' + e.message, 1);
            return false;
        }
    }
};
