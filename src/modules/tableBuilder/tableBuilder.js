// Table builder - Complete implementation matching working HTML structure
tnt.tableBuilder = {
    buildTable(type) {
        if (type === 'resources') {
            return this.buildResourceTable();
        } else if (type === 'buildings') {
            return this.buildBuildingTable();
        }
        return '';
    },

    // Build the buildings table
    buildResourceTable() {
        // Ensure we have the necessary data
        const cities = tnt.data.storage.city || {};
        const sortedCityIds = tnt.dataCollector.sortCities();
        const settings = tnt.settings.getResourceDisplaySettings();
        const currentCityId = tnt.get.city.id();

        // If no cities or no resources to display, return empty table
        if (sortedCityIds.length === 0) {
            return '<div>No city data available</div>';
        }

        // Calculate colspan for City and Resources columns, based on enabled settings
        let cityColspan = 1; // We start with 1 for the city name column, which is always shown
        if (settings.showPopulation) cityColspan++;
        if (settings.showCitizens) cityColspan++;

        let resourcesSpan = 0; // We start with 0 for the resources columns, which are all conditionally shown
        if (settings.showWood) resourcesSpan++;
        if (settings.showWine) resourcesSpan++;
        if (settings.showMarble) resourcesSpan++;
        if (settings.showCrystal) resourcesSpan++;
        if (settings.showSulfur) resourcesSpan++;

        let militarySpan = 0;
        if (settings.showMilitaryUnits) militarySpan++;
        if (settings.showNavy) militarySpan++;

        // Build the HTML table structure
        let html = '<table id="tnt_resources_table" border="1" style="border-collapse:collapse;font:12px Arial,Helvetica,sans-serif;background-color:#fdf7dd;"><tbody>';

        // Category header row - NO CONTROLS TEXT
        html += '<tr class="tnt_category_header">';
        html += '<th class="tnt_category_header" style="background-color:#DBBE8C;border: 1px solid #000;padding:4px;font-weight:bold;text-align:center;width:60px;"></th>';
        html += `<th colspan="${cityColspan}" class="tnt_category_header" style="background-color:#DBBE8C;border: 1px solid #000;padding:4px;font-weight:bold;text-align:center;">City Info</th>`;
        if (resourcesSpan > 0) {
            html += `<th colspan="${resourcesSpan}" class="tnt_category_header" style="background-color:#DBBE8C;border: 1px solid #000;padding:4px;font-weight:bold;text-align:center;">Resources</th>`;
        }
        if (militarySpan > 0) {
            html += `<th colspan="${militarySpan}" class="tnt_category_header" style="background-color:#DBBE8C;border: 1px solid #000;padding:4px;font-weight:bold;text-align:center;">Military</th>`;
        }
        html += '</tr>';

        // Subcategory header row - COMPLETELY CLEAN with NO buttons whatsoever
        html += '<tr class="tnt_subcategory_header">';
        html += '<th class="tnt_center tnt_bold" style="position:relative;text-align:center;padding:4px;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
        html += '<div style="position:relative; min-width:120px; text-align:center;">';
        html += '<span style="display:inline-block; text-align:center; min-width:60px;">City</span>';
        html += '</div></th>';

        // Town Hall header
        html += '<th class="tnt_center tnt_bold" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
        html += `<a href="#" onclick="ajaxHandlerCall('?view=buildingDetail&buildingId=0&helpId=1');return false;" title="Learn more about Town Hall...">`;
        html += '<img class="tnt_resource_icon tnt_building_icon" title="Town Hall" src="/cdn/all/both/img/city/townhall_l.png">';
        html += '</a></th>';

        // Optional columns
        if (settings.showPopulation) {
            html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
            html += '<span class="tnt_tooltip_target" data-resource="population">' + tnt.dataCollector.getIcon('population') + '</span></th>';
        }
        if (settings.showCitizens) {
            html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
            html += '<span class="tnt_tooltip_target" data-resource="citizens">' + tnt.dataCollector.getIcon('citizens') + '</span></th>';
        }
        if (settings.showWood) {
            html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
            html += '<span class="tnt_tooltip_target" data-resource="wood">' + tnt.dataCollector.getIcon(0) + '</span></th>';
        }
        if (settings.showWine) {
            html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
            html += '<span class="tnt_tooltip_target" data-resource="wine">' + tnt.dataCollector.getIcon(1) + '</span></th>';
        }
        if (settings.showMarble) {
            html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
            html += '<span class="tnt_tooltip_target" data-resource="marble">' + tnt.dataCollector.getIcon(2) + '</span></th>';
        }
        if (settings.showCrystal) {
            html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
            html += '<span class="tnt_tooltip_target" data-resource="crystal">' + tnt.dataCollector.getIcon(3) + '</span></th>';
        }
        if (settings.showSulfur) {
            html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
            html += '<span class="tnt_tooltip_target" data-resource="sulfur">' + tnt.dataCollector.getIcon(4) + '</span></th>';
        }
        if (settings.showMilitaryUnits) {
            html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
            html += '<span class="tnt_tooltip_target" data-resource="militaryUnits">' + tnt.dataCollector.getIcon('militaryUnits') + '</span></th>';
        }
        if (settings.showNavy) {
            html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
            html += '<span class="tnt_tooltip_target" data-resource="navy">' + tnt.dataCollector.getIcon('navy') + '</span></th>';
        }
        html += '</tr>';

        // Data rows
        sortedCityIds.forEach(cityId => {
            const city = cities[cityId];
            if (!city) return;

            const isCurrentCity = (cityId == currentCityId);
            const hasConstruction = city.hasConstruction;
            const isVisited = tnt.citySwitcher.isActive && tnt.citySwitcher.visitedCities.includes(cityId);
            const progressClass = this.getProgressClass(cityId, isCurrentCity, hasConstruction, isVisited);
            const rowClass = isCurrentCity ? ' class="tnt_selected"' : '';

            // DEBUG: Simple state logging
            if (tnt.citySwitcher.isActive) {
                // console.log(`[TNT] City ${cityId}: Current=${isCurrentCity}, Visited=${isVisited}, Class="${progressClass}"`);
            }

            html += `<tr data-city-id="${cityId}"${rowClass}>`;

            // City name cell with progress styling
            html += `<td class="tnt_city tnt_left${progressClass}" style="padding:4px;text-align:left;border:1px solid #000;background-color:#fdf7dd;">`;
            html += `<a href="#" class="tnt_city_link" data-city-id="${cityId}">`;
            html += tnt.dataCollector.getIcon(city.producedTradegood) + ' ' + tnt.get.city.name(cityId);
            html += '</a></td>';

            // Town Hall level
            let townHallLevel = '-';
            let townHallGreen = false;
            if (city.buildings && Array.isArray(city.buildings['townHall']) && city.buildings['townHall'].length > 0) {
                const arr = city.buildings['townHall'];
                townHallLevel = arr.reduce((acc, b) => acc + (parseInt(b.level) || 0), 0);
                if (arr.some(b => b.upgradable)) townHallGreen = true;
            }
            html += `<td class="tnt_building_level${townHallGreen ? ' green' : ''}" style="padding:4px;text-align:center;border:1px solid #000;background-color:#fdf7dd;">${townHallLevel}</td>`;

            // Optional data columns
            if (settings.showPopulation) {
                const val = parseInt(Math.round(city.population)).toLocaleString();
                html += `<td class="tnt_population" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;">${val}</td>`;
            }
            if (settings.showCitizens) {
                const val = parseInt(Math.round(city.citizens)).toLocaleString();
                html += `<td class="tnt_citizens" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;">${val}</td>`;
            }
            if (settings.showWood) {
                const cssClass = tnt.dataCollector.checkMinMax(city, 0);
                const production = tnt.utils.calculateProduction(cityId, 24).wood;
                html += `<td class="tnt_wood${cssClass}" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;"><span title="${production}">${city.wood.toLocaleString()}</span></td>`;
            }
            if (settings.showWine) {
                const cssClass = tnt.dataCollector.checkMinMax(city, 1);
                const production = tnt.utils.calculateProduction(cityId, 24).wine;
                const fontWeight = city.producedTradegood == 1 ? 'font-weight:bold;color:black;' : '';
                html += `<td class="tnt_wine${cssClass}" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;${fontWeight}"><span title="${production}">${city.wine.toLocaleString()}</span></td>`;
            }
            if (settings.showMarble) {
                const cssClass = tnt.dataCollector.checkMinMax(city, 2);
                const production = tnt.utils.calculateProduction(cityId, 24).marble;
                const fontWeight = city.producedTradegood == 2 ? 'font-weight:bold;color:black;' : '';
                html += `<td class="tnt_marble${cssClass}" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;${fontWeight}"><span title="${production}">${city.marble.toLocaleString()}</span></td>`;
            }
            if (settings.showCrystal) {
                const cssClass = tnt.dataCollector.checkMinMax(city, 3);
                const production = tnt.utils.calculateProduction(cityId, 24).crystal;
                const fontWeight = city.producedTradegood == 3 ? 'font-weight:bold;color:black;' : '';
                html += `<td class="tnt_crystal${cssClass}" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;${fontWeight}"><span title="${production}">${city.crystal.toLocaleString()}</span></td>`;
            }
            if (settings.showSulfur) {
                const cssClass = tnt.dataCollector.checkMinMax(city, 4);
                const production = tnt.utils.calculateProduction(cityId, 24).sulfur;
                const fontWeight = city.producedTradegood == 4 ? 'font-weight:bold;color:black;' : '';
                html += `<td class="tnt_sulfur${cssClass}" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;${fontWeight}"><span title="${production}">${city.sulfur.toLocaleString()}</span></td>`;
            }
            if (settings.showMilitaryUnits) {
                const val = city.militaryUnits !== null && city.militaryUnits !== undefined ? city.militaryUnits.toLocaleString() : '-';
                html += `<td class="tnt_military_units" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;">${val}</td>`;
            }
            if (settings.showNavy) {
                const val = city.navy !== null && city.navy !== undefined ? city.navy.toLocaleString() : '-';
                html += `<td class="tnt_navy" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;">${val}</td>`;
            }

            html += '</tr>';
        });

        // Totals row
        const totals = tnt.dataCollector.calculateTotals();
        html += '<tr>';
        html += '<td class="tnt_total" style="padding:4px;text-align:left;border:1px solid #000;background-color:#faeac6;font-weight:bold;">Total</td>';
        html += '<td style="padding:4px;text-align:center;border:1px solid #000;background-color:#faeac6;"></td>';

        if (settings.showPopulation) {
            html += `<td class="tnt_total" style="padding:4px;text-align:right;border:1px solid #000;background-color:#faeac6;font-weight:bold;">${totals.population.toLocaleString()}</td>`;
        }
        if (settings.showCitizens) {

            html += `<td class="tnt_total" style="padding:4px;text-align:right;border:1px solid #000;background-color:#faeac6;font-weight:bold;">${totals.citizens.toLocaleString()}</td>`;
        }
        if (settings.showWood) {
            html += `<td class="tnt_total" style="padding:4px;text-align:right;border:1px solid #000;background-color:#faeac6;font-weight:bold;">${totals.wood.toLocaleString()}</td>`;
        }
        if (settings.showWine) {
            html += `<td class="tnt_total" style="padding:4px;text-align:right;border:1px solid #000;background-color:#faeac6;font-weight:bold;">${totals.wine.toLocaleString()}</td>`;
        }
        if (settings.showMarble) {
            html += `<td class="tnt_total" style="padding:4px;text-align:right;border:1px solid #000;background-color:#faeac6;font-weight:bold;">${totals.marble.toLocaleString()}</td>`;
        }
        if (settings.showCrystal) {
            html += `<td class="tnt_total" style="padding:4px;text-align:right;border:1px solid #000;background-color:#faeac6;font-weight:bold;">${totals.crystal.toLocaleString()}</td>`;
        }
        if (settings.showSulfur) {
            html += `<td class="tnt_total" style="padding:4px;text-align:right;border:1px solid #000;background-color:#faeac6;font-weight:bold;">${totals.sulfur.toLocaleString()}</td>`;
        }
        if (settings.showMilitaryUnits) {
            const totalMilitary = totals.militaryUnits !== null ? totals.militaryUnits.toLocaleString() : '-';
            html += `<td class="tnt_total" style="padding:4px;text-align:right;border:1px solid #000;background-color:#faeac6;font-weight:bold;">${totalMilitary}</td>`;
        }
        if (settings.showNavy) {
            const totalNavy = totals.navy !== null ? totals.navy.toLocaleString() : '-';
            html += `<td class="tnt_total" style="padding:4px;text-align:right;border:1px solid #000;background-color:#faeac6;font-weight:bold;">${totalNavy}</td>`;
        }
        html += '</tr>';

        html += '</tbody></table>';
        return html;
    },

    buildBuildingTable() {
        const cities = tnt.data.storage.city || {};
        const sortedCityIds = tnt.dataCollector.sortCities();
        const currentCityId = tnt.get.city.id();
        const buildingDefs = TNT_BUILDING_DEFINITIONS;
        const mergedColumns = tnt.dataCollector.getMergedBuildingColumns(buildingDefs);
        const categorySpans = tnt.dataCollector.calculateCategorySpans(mergedColumns);

        if (sortedCityIds.length === 0) {
            return `<div>No city data available</div>`;
        }

        let html = `<table id="tnt_buildings_table" border="1" style="border-collapse:collapse;font:12px Arial,Helvetica,sans-serif;background-color:#fdf7dd;"><tbody>`;

        // Category header row
        html += `<tr class="tnt_category_header">`;
        html += `<th class="tnt_category_header" style="background-color:#DBBE8C;border: 1px solid #000;padding:4px;font-weight:bold;text-align:center;width:60px;"></th>`;
        // html += `<th class="tnt_category_header" style="background-color:#DBBE8C;border: 1px solid #000;padding:4px;font-weight:bold;text-align:center;">City</th>`;
        Object.entries(categorySpans).forEach(([category, span]) => {
            if (span > 0) {
                let displayName = category.replace(/([A-Z])/g, ' $1')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                html += `<th colspan="${span}" class="tnt_category_header" style="background-color:#DBBE8C;border: 1px solid #000;padding:4px;font-weight:bold;text-align:center;">${displayName}</th>`;
            }
        });
        html += `</tr>`;

        // Subcategory header row
        html += `<tr class="tnt_subcategory_header">`;
        html += `<th class="tnt_center tnt_bold" style="position:relative;text-align:center;padding:4px;font-weight:bold;border:1px solid #000;background-color:#faeac6;">`;
        html += `<div style="position:relative; min-width:120px; text-align:center;">`;
        html += `<span style="display:inline-block; text-align:center; min-width:60px;">City</span>`;
        html += `</div></th>`;

        // Building column headers
        mergedColumns.forEach(building => {
            const thAttrs = `class="tnt_center tnt_bold tnt_tooltip_target" data-tooltip-section="building" data-tooltip-context="header" data-building-type="${building.key}"`;
            if (building.key === 'palaceOrColony') {
                html += `<th ${thAttrs} style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">`;
                html += `<a href="#" onclick="ajaxHandlerCall('?view=buildingDetail&buildingId=11&helpId=1');return false;">`;
                html += `<img class="tnt_resource_icon tnt_building_icon tnt_tooltip_target" src="${building.icon}" alt="Palace" data-tooltip-section="building" data-tooltip-context="header" data-building-type="${building.key}">`;
                html += `</a>`;
                html += `<a href="#" onclick="ajaxHandlerCall('?view=buildingDetail&buildingId=17&helpId=1');return false;">`;
                html += `<img class="tnt_resource_icon tnt_building_icon tnt_tooltip_target" src="${building.icon2}" alt="Governor's Residence" data-tooltip-section="building" data-tooltip-context="header" data-building-type="${building.key}">`;
                html += `</a></th>`;
            } else {
                html += `<th ${thAttrs} style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">`;
                html += `<a href="#" onclick="ajaxHandlerCall('?view=buildingDetail&buildingId=${building.buildingId}&helpId=${building.helpId}');return false;">`;
                html += `<img class="tnt_resource_icon tnt_building_icon tnt_tooltip_target" src="${building.icon}" alt="${building.name}" data-tooltip-section="building" data-tooltip-context="header" data-building-type="${building.key}">`;
                html += `</a></th>`;
            }
        });
        html += `</tr>`;

        // Data rows
        sortedCityIds.forEach(cityId => {
            const city = cities[cityId];
            if (!city) return;

            // Determine city state
            const isCurrentCity = (cityId == currentCityId);
            const hasConstruction = city.hasConstruction;
            const isVisited = tnt.citySwitcher.isActive && tnt.citySwitcher.visitedCities.includes(cityId);
            const progressClass = this.getProgressClass(cityId, isCurrentCity, hasConstruction, isVisited);
            const rowClass = isCurrentCity ? ' class="tnt_selected"' : '';

            html += `<tr data-city-id="${cityId}"${rowClass}>`;

            // City name cell with progress styling
            html += `<td class="tnt_city tnt_left${progressClass}" style="padding:4px;text-align:left;border:1px solid #000;background-color:#fdf7dd;">`;
            html += `<a href="#" class="tnt_city_link" data-city-id="${cityId}">`;
            html += tnt.dataCollector.getIcon(city.producedTradegood) + ' ' + tnt.get.city.name(cityId);
            html += '</a></td>';

            // Add building level cells for each merged column
            mergedColumns.forEach(building => {
                const buildingArray = city.buildings?.[building.key] || [];

                // Special merge handling for palace + palaceColony
                if (building.key === 'palaceOrColony') {
                    const palace = city.buildings?.palace || [];
                    const colony = city.buildings?.palaceColony || [];
                    const merged = palace.concat(colony);
                    html += tnt.tableBuilder.renderBuildingLevelCell(merged, building.key, cityId);
                } else {
                    html += tnt.tableBuilder.renderBuildingLevelCell(buildingArray, building.key, cityId);
                }
            });

            html += '</tr>';
        });

        // Total row with building level totals
        html += '<tr>';
        html += '<td class="tnt_total" style="padding:4px;text-align:left;border:1px solid #000;background-color:#faeac6;font-weight:bold;">Total</td>';
        const buildingTotals = tnt.dataCollector.calculateBuildingTotals(mergedColumns);
        mergedColumns.forEach(col => {
            const total = buildingTotals[col.key] || '';
            html += `<td class="tnt_building_level" style="padding:4px;text-align:center;border:1px solid #000;background-color:#faeac6;font-weight:bold;">${total}</td>`;
        });
        html += '</tr>';

        html += '</tbody></table>';
        return html;
    },

    renderBuildingLevelCell(buildingArray, buildingType, cityId) {
        let tdClass = "tnt_building_level";
        let bgColor = "#fdf7dd";
        let tooltip = "";
        let levelSum = 0;
        let hasConstruction = false;
        let upgradable = false;

        if (!Array.isArray(buildingArray) || buildingArray.length === 0) {
            return `<td class="${tdClass} tnt_tooltip_target" data-tooltip-section="building" data-tooltip-context="cell" data-building-type="${buildingType}" data-city-id="${cityId}" style="padding:4px;text-align:center;border:1px solid #000;background-color:${bgColor};"></td>`;
        }

        const buildingDef = TNT_BUILDING_DEFINITIONS.find(def => def.key === buildingType);

        buildingArray.forEach(b => {
            const lvl = typeof b.level === 'number' ? b.level : 0;
            levelSum += lvl;
            if (b.underConstruction) hasConstruction = true;
            if (b.upgradable) upgradable = true;
            const upgradeNote = b.underConstruction ? ` (Upgrading to ${lvl + 1})` : "";
            tooltip += `Pos ${b.position}: lvl ${lvl}${upgradeNote}\n`;
        });

        const maxedLvl = tnt.settings.getMaxedLvl(buildingType);
        if (maxedLvl && levelSum >= maxedLvl * buildingArray.length) {
            tdClass += " tnt_building_maxed";
        }
        if (upgradable) tdClass += " green";
        if (hasConstruction) bgColor = "#80404050";

        return `<td class="${tdClass} tnt_tooltip_target" data-tooltip-section="building" data-tooltip-context="cell" data-building-type="${buildingType}" data-city-id="${cityId}" style="padding:4px;text-align:center;border:1px solid #000;background-color:${bgColor};" title="${tooltip.trim().replace(/"/g, '&quot;')}">${levelSum > 0 ? levelSum : '0'}</td>`;
    },

    // Visual progress class determination
    getProgressClass(cityId, isCurrentCity, hasConstruction, isVisited) {
        if (!tnt.citySwitcher.isActive) {
            return hasConstruction ? ' tnt_construction' : '';
        }

        if (isCurrentCity) {
            return hasConstruction ? ' tnt_construction' : '';
        } else if (isVisited) {
            return ' tnt_progress_visited';
        } else {
            return hasConstruction ? ' tnt_construction' : '';
        }
    },

    attachEventHandlers() {
        // City switching event handlers using proper Ikariam method
        $(document).off('click', '.tnt_city_link').on('click', '.tnt_city_link', function (event) {
            event.preventDefault();
            event.stopPropagation();

            // console.log('[TNT] City link clicked!');

            const cityId = $(this).data('city-id');
            // console.log('[TNT] Switching to city:', cityId);

            // Try multiple methods to switch cities
            let switchSuccess = false;

            // Method 1: Direct ajaxHandlerCall (most reliable)
            try {
                if (typeof ajaxHandlerCall === 'function') {
                    // console.log('[TNT] Using ajaxHandlerCall method');
                    ajaxHandlerCall(`?view=city&cityId=${cityId}`);
                    switchSuccess = true;
                    return false;
                }
            } catch (e) {
                // console.log('[TNT] ajaxHandlerCall failed:', e.message);
            }

            // Method 2: Try to find and trigger the city select dropdown change
            try {
                const $citySelect = $('#js_GlobalMenu_citySelect');
                if ($citySelect.length > 0) {
                    // console.log('[TNT] Using city select dropdown method');
                    $citySelect.val(cityId).trigger('change');
                    switchSuccess = true;
                    return false;
                }
            } catch (e) {
                // console.log('[TNT] City select dropdown failed:', e.message);
            }

            // Method 3: Try the dropdown li click with more specific targeting
            try {
                const $cityOption = $(`#dropDown_js_citySelectContainer li[selectValue="${cityId}"]`);
                if ($cityOption.length > 0) {
                    // console.log('[TNT] Using improved dropdown click method');

                    // Get the select element that the dropdown controls
                    const $select = $('#js_GlobalMenu_citySelect, #citySelect');
                    if ($select.length > 0) {
                        // Update the select value first
                        $select.val(cityId);

                        // Then trigger the change event
                        $select.trigger('change');

                        // Also trigger a click on the option for good measure
                        $cityOption.trigger('click');

                        switchSuccess = true;
                        return false;
                    }
                }
            } catch (e) {
                // console.log('[TNT] Improved dropdown method failed:', e.message);
            }

            // Method 4: Direct URL navigation (fallback)
            if (!switchSuccess) {
                // console.log('[TNT] Using URL navigation fallback');
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.set('cityId', cityId);
                currentUrl.searchParams.set('currentCityId', cityId);
                window.location.href = currentUrl.toString();
            }

            return false;
        });

        // Also add direct click handlers to newly created elements
        $('.tnt_city_link').off('click').on('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            // console.log('[TNT] Direct city link clicked!');

            const cityId = $(this).data('city-id');
            // console.log('[TNT] Direct switching to city:', cityId);

            // Use the same improved switching logic
            let switchSuccess = false;

            // Method 1: Direct ajaxHandlerCall
            try {
                if (typeof ajaxHandlerCall === 'function') {
                    // console.log('[TNT] Direct using ajaxHandlerCall method');
                    ajaxHandlerCall(`?view=city&cityId=${cityId}`);
                    switchSuccess = true;
                    return false;
                }
            } catch (e) {
                // console.log('[TNT] Direct ajaxHandlerCall failed:', e.message);
            }

            // Method 2: City select dropdown
            try {
                const $citySelect = $('#js_GlobalMenu_citySelect');
                if ($citySelect.length > 0) {
                    // console.log('[TNT] Direct using city select dropdown method');
                    $citySelect.val(cityId).trigger('change');
                    switchSuccess = true;
                    return false;
                }
            } catch (e) {
                // console.log('[TNT] Direct city select dropdown failed:', e.message);
            }

            // Method 3: URL navigation fallback
            if (!switchSuccess) {
                // console.log('[TNT] Direct using URL navigation fallback');
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.set('cityId', cityId);
                currentUrl.searchParams.set('currentCityId', cityId);
                window.location.href = currentUrl.toString();
            }

            return false;
        });

        // Double-click to edit global maxed level per building type in the table
        $(document).off('dblclick', '#tnt_buildings_table td.tnt_building_level').on('dblclick', '#tnt_buildings_table td.tnt_building_level', function () {
            const $cell = $(this);
            if ($cell.find('input').length > 0) return;

            const buildingType = $cell.data('building-type');
            if (!buildingType) return;

            const originalValue = $cell.text().trim();
            const initialValue = (buildingType === 'palaceOrColony') ? tnt.settings.getMaxedLvl('palaceOrColony') : originalValue;
            const input = $('<input type="text" class="tnt_maxedlvl_input" />').val(initialValue).css({
                width: '30px',
                boxSizing: 'border-box',
                margin: 0,
                padding: '0 2px',
                border: '1px solid #999',
                lineHeight: '1.2em',
                fontSize: '11px',
                textAlign: 'center'
            });
            $cell.empty().css({overflow: 'hidden', padding: '0 2px'}).append(input);
            input.focus().select();

            let saved = false;

            const finish = () => {
                if (!saved) {
                    $cell.text(originalValue);
                }
            };

            input.on('keydown', (e) => {
                if (e.key === 'Enter') {
                    const entered = input.val().trim();
                    if (entered === '') {
                        if (buildingType === 'palaceOrColony') {
                            tnt.settings.resetMaxedLvl('palace');
                            tnt.settings.resetMaxedLvl('palaceColony');
                            tnt.settings.resetMaxedLvl('palaceOrColony');
                        } else {
                            tnt.settings.resetMaxedLvl(buildingType);
                        }
                        saved = true;
                        tnt.dataCollector.show();
                        return;
                    }

                    const newValue = parseInt(entered, 10);
                    if (isNaN(newValue) || newValue < 0) {
                        alert('Please enter a positive integer for maxed level.');
                        input.focus().select();
                        return;
                    }
                    if (buildingType === 'palaceOrColony') {
                        tnt.settings.setMaxedLvl('palace', newValue);
                        tnt.settings.setMaxedLvl('palaceColony', newValue);
                        tnt.settings.setMaxedLvl('palaceOrColony', newValue);
                    } else {
                        tnt.settings.setMaxedLvl(buildingType, newValue);
                    }
                    saved = true;
                    tnt.dataCollector.show();
                } else if (e.key === 'Escape') {
                    saved = false;
                    finish();
                }
            });

            input.on('blur', finish);
        });

        // Add tooltips to resource icons
        tnt.tooltip.attachTooltips(); // Not sure where to move this. One run once after tables has been build!
    }
};
