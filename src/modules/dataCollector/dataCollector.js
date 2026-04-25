// dataCollector = Collects and stores resource data
tnt.dataCollector = {
    update() {
        const currentCityId = tnt.get.city.id();

        // Skip data collection if no valid city ID
        if (!currentCityId || currentCityId === 'undefined') {
            return;
        }

        const isOwnCity = tnt.is.ownCity();

        if (isOwnCity) {
            this.collectOwnCityData(currentCityId);
        } else {
            this.collectForeignCityData(currentCityId);
        }

        // Update visual progress AFTER data collection with proper timing
        if (tnt.citySwitcher.isActive) {
            // console.log(`[TNT] Data collected for ${currentCityId} - scheduling visual update`);
            setTimeout(() => {
                tnt.citySwitcher.updateVisualProgress();
            }, 500);
        }
    },

    collectOwnCityData(currentCityId) {
        const prev = $.extend(true, {}, tnt.data.storage.city[currentCityId] || {});

        const militaryUnits = tnt.get.military.units.total();
        const navy = tnt.get.military.navy.total();

        const cityData = {
            ...prev,
            name: tnt.get.city.name(currentCityId),
            buildings: {},
            cityIslandCoords: tnt.get.city.coords(),
            producedTradegood: parseInt(tnt.get.city.tradegood()),
            population: tnt.get.city.resources.population(),
            citizens: tnt.get.city.resources.citizens(),
            max: tnt.get.city.resources.max(),
            wood: tnt.get.city.resources.wood(),
            wine: tnt.get.city.resources.wine(),
            marble: tnt.get.city.resources.marble(),
            crystal: tnt.get.city.resources.crystal(),
            sulfur: tnt.get.city.resources.sulfur(),
            hasConstruction: false,
            cityLvl: tnt.get.city.level(),
            resourceProduction: tnt.get.city.production.resource(),
            tradegoodProduction: tnt.get.city.production.tradegood(),
            militaryUnits: militaryUnits !== null ? militaryUnits : (prev.militaryUnits ?? null),
            navy: navy !== null ? navy : (prev.navy ?? null),
            lastUpdate: Date.now(),
            isOwn: true
        };

        // Only update buildings when in city view
        if ($("body").attr("id") === "city") {
            const buildingData = tnt.utils.scanAllBuildings();
            cityData.buildings = buildingData.buildings;
            cityData.hasConstruction = buildingData.hasConstruction;
        } else {
            cityData.hasConstruction = prev.hasConstruction || false;
        }

        // Store in own city data
        tnt.data.storage.city[currentCityId] = cityData;
        tnt.core.storage.save();
        // tnt.dataCollector.show(); // Moved to tnt.core.init() to avoid double updates. Remove if not needed
    },

    collectForeignCityData(currentCityId) {
        // console.log('[TNT] Collecting foreign city data for:', currentCityId);

        const hasSpyAccess = $('.spy_warning').length > 0 || $('#js_spiesInsideText').length > 0;
        const ownerName = tnt.utils.safeGet(() => ikariam.backgroundView.screen.data.ownerName, 'Unknown');
        const ownerId = tnt.utils.safeGet(() => ikariam.backgroundView.screen.data.ownerId, 0);

        const foreignCityData = {
            cityId: currentCityId,
            name: tnt.utils.safeGet(() => ikariam.backgroundView.screen.data.name, 'Unknown City'),
            ownerName: ownerName,
            ownerId: parseInt(ownerId),
            cityIslandCoords: tnt.get.city.coords(),
            cityLvl: tnt.get.city.level(),
            producedTradegood: parseInt(tnt.get.city.tradegood()),
            hasSpyAccess: hasSpyAccess,
            buildings: {},
            lastUpdate: Date.now(),
            isOwn: false
        };

        // Collect visible building data
        if ($("body").attr("id") === "city") {
            const buildingData = tnt.utils.scanAllBuildings();
            foreignCityData.buildings = buildingData.buildings;
            foreignCityData.hasConstruction = buildingData.hasConstruction;
        }

        // Store in foreign city data
        tnt.data.storage.foreign[currentCityId] = foreignCityData;

        // Also store in spy data if we have spy access
        if (hasSpyAccess) {
            tnt.data.storage.spy[currentCityId] = foreignCityData;
            // console.log('[TNT] Stored spy data for city:', currentCityId);
        }

        tnt.core.storage.save();
        // console.log('[TNT] Foreign city data collected and stored');
    },

    show() {
        // Only show resource tables for own cities
        if (tnt.settings.getResourceDisplaySettings().showResources && $("body").attr("id") == "city" && tnt.is.ownCity()) {

            // Show resource tables
            if ($('#tnt_info_resources').length === 0) {
                $('body').append(tnt.template.resources);
            }

            // $('#tnt_info_resources_content').empty();
            // $('#tnt_info_buildings_content').empty();

            // Build and display the resource table
            const resourceTable = tnt.tableBuilder.buildTable('resources');
            $('#tnt_info_resources_content').html(resourceTable);

            // Build and display the buildings table
            const buildingTable = tnt.tableBuilder.buildTable('buildings');
            $('#tnt_info_buildings_content').html(buildingTable);

            // Create external controls (buttons) and attach event handlers
            this.createExternalControls();
            tnt.tableBuilder.attachEventHandlers(); // Is this needed here?
        }
    },

    createExternalControls() {
        // Only create if they don't exist yet
        if ($('.tnt_external_controls').length === 0) {
            const $externalControls = $('<div class="tnt_external_controls"></div>');

            // Left side buttons (Min/Max)
            const $leftButtons = $('<div class="tnt_left_buttons"></div>');
            $leftButtons.append('<span class="tnt_panel_minimize_btn tnt_back" title="Minimize/Maximize panel"></span>');

            // Right side buttons (Refresh, Toggle)
            const $rightButtons = $('<div class="tnt_right_buttons"></div>');
            $rightButtons.append('<span class="tnt_refresh_btn" title="Refresh all cities"></span>');
            $rightButtons.append('<span class="tnt_table_toggle_btn" title="Show buildings/resources"></span>');

            $externalControls.append($leftButtons);
            $externalControls.append($rightButtons);
            $('#tnt_info_resources').prepend($externalControls);

            // Attach event handlers for the new buttons
            tnt.events.attachButtonEvents();
        }
    },

    // NEW: Calculate totals across all cities
    calculateTotals() {
        let total = {
            population: 0,
            citizens: 0,
            wood: 0,
            wine: 0,
            marble: 0,
            crystal: 0,
            sulfur: 0,
            militaryUnits: null,
            navy: null
        };

        $.each(tnt.data.storage.city, function (cityID, cityData) {
            total.population += parseInt(cityData.population) || 0;
            total.citizens += parseInt(cityData.citizens) || 0;
            total.wood += cityData.wood || 0;
            total.wine += cityData.wine || 0;
            total.marble += cityData.marble || 0;
            total.crystal += cityData.crystal || 0;
            total.sulfur += cityData.sulfur || 0;
            if (cityData.militaryUnits !== null && cityData.militaryUnits !== undefined) {
                if (total.militaryUnits === null) total.militaryUnits = 0;
                total.militaryUnits += cityData.militaryUnits || 0;
            }
            if (cityData.navy !== null && cityData.navy !== undefined) {
                if (total.navy === null) total.navy = 0;
                total.navy += cityData.navy || 0;
            }
        });

        return total;
    },

    getMergedBuildingColumns(buildingColumns) {
        // Determine which building columns are used in any city
        const usedColumns = buildingColumns.filter(function (col) {
            const cities = Object.values(tnt.data.storage.city);
            if (col.key === 'palace' || col.key === 'palaceColony') {
                return cities.some(city =>
                    (city.buildings?.['palace']?.length > 0) ||
                    (city.buildings?.['palaceColony']?.length > 0)
                );
            }
            return cities.some(city => city.buildings?.[col.key]?.length > 0);
        });

        // Merge palace/palaceColony into a single column for display
        const mergedColumns = [];
        let seenPalace = false;
        usedColumns.forEach(function (col) {
            if ((col.key === 'palace' || col.key === 'palaceColony') && !seenPalace) {
                mergedColumns.push({
                    key: 'palaceOrColony',
                    name: 'Palace / Governor\'s Residence',
                    icon: '/cdn/all/both/img/city/palace_l.png',
                    icon2: '/cdn/all/both/img/city/palaceColony_l.png',
                    buildingId: 11,
                    helpId: 1
                });
                seenPalace = true;
            } else if (col.key !== 'palace' && col.key !== 'palaceColony') {
                mergedColumns.push(col);
            }
        });

        return mergedColumns;
    },

    calculateCategorySpans(mergedColumns) {
        // Dynamically generate buildingCategories from TNT_BUILDING_DEFINITIONS
        const buildingCategories = TNT_BUILDING_DEFINITIONS.reduce((acc, b) => {
            if (!acc[b.category]) acc[b.category] = [];
            acc[b.category].push(b.key);
            return acc;
        }, {});

        const categorySpans = {};
        mergedColumns.forEach(col => {
            for (let [category, buildings] of Object.entries(buildingCategories)) {
                if (buildings.includes(col.key) ||
                    (col.key === 'palaceOrColony' && (buildings.includes('palace') || buildings.includes('palaceColony')))) {
                    categorySpans[category] = (categorySpans[category] || 0) + 1;
                }
            }
        });

        return categorySpans;
    },

    // PHASE 1: Add calculateBuildingTotals helper
    calculateBuildingTotals(mergedColumns) {
        const totals = {};

        mergedColumns.forEach(col => {
            let total = 0;

            Object.values(tnt.data.storage.city || {}).forEach(city => {
                if (!city.buildings) return;

                if (col.key === 'palaceOrColony') {
                    const palace = city.buildings.palace || [];
                    const colony = city.buildings.palaceColony || [];
                    total += palace.reduce((sum, b) => sum + (b.level || 0), 0);
                    total += colony.reduce((sum, b) => sum + (b.level || 0), 0);
                } else {
                    const arr = city.buildings[col.key] || [];
                    total += arr.reduce((sum, b) => sum + (b.level || 0), 0);
                }
            });

            totals[col.key] = total;
        });

        return totals;
    },

    sortCities() {
        var list = {};
        var cities = tnt.data.storage.city || {};
        $.each(cities, (cityID, value) => {
            if (value && typeof value.producedTradegood !== 'undefined') {
                list[cityID] = value.producedTradegood;
            }
        });
        var order = { 2: 0, 1: 1, 3: 2, 4: 3 };
        return Object.keys(list).sort((a, b) => order[list[a]] - order[list[b]]);
    },

    checkMinMax(city, resource) {
        if (!tnt.settings.getResourceDisplaySettings().showResources || !city || !city.max) return '';
        var max = city.max, txt = '';
        switch (resource) {
            case 0: if (city.wood > max * .8) txt += ' tnt_storage_danger'; if (city.wood < 100000) txt += ' tnt_storage_min'; break;
            case 1: if (city.wine > max * .8) txt += ' tnt_storage_danger'; if (city.wine < 100000) txt += ' tnt_storage_min'; break;
            case 2: if (city.marble > max * .8) txt += ' tnt_storage_danger'; if (city.marble < 50000) txt += ' tnt_storage_min'; break;
            case 3: if (city.crystal > max * .8) txt += ' tnt_storage_danger'; if (city.crystal < 50000) txt += ' tnt_storage_min'; break;
            case 4: if (city.sulfur > max * .8) txt += ' tnt_storage_danger'; if (city.sulfur < 50000) txt += ' tnt_storage_min'; break;
        }
        return txt;
    },

    getIcon(resource) {
        switch (resource) {
            case 0: return '<img class="tnt_resource_icon" src="/cdn/all/both/resources/icon_wood.png">';
            case 1: return '<img class="tnt_resource_icon" src="/cdn/all/both/resources/icon_wine.png">';
            case 2: return '<img class="tnt_resource_icon" src="/cdn/all/both/resources/icon_marble.png">';
            case 3: return '<img class="tnt_resource_icon" src="/cdn/all/both/resources/icon_crystal.png">';
            case 4: return '<img class="tnt_resource_icon" src="/cdn/all/both/resources/icon_sulfur.png">';
            case 'population': return '<img class="tnt_resource_icon tnt_icon_po" src="//gf3.geo.gfsrv.net/cdn2f/6d077d68d9ae22f9095515f282a112.png" style="width: 10px !important;">';
            case 'citizens': return '<img class="tnt_resource_icon" src="/cdn/all/both/resources/icon_population.png">';
            case 'militaryUnits': return '<img class="tnt_resource_icon" src="/cdn/all/both/layout/advisors/general.png" style="height:15px;width:auto;">';
            case 'navy': return '<img class="tnt_resource_icon" src="/cdn/all/both/img/city/shipyard_l.png" style="height:15px;width:auto;">';
            default: return '';
        }
    }
};
