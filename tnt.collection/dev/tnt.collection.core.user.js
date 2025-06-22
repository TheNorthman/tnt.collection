// ==UserScript==
// @name         TNT Collection Core
// @version      2.0.0
// @namespace    tnt.collection.core
// @author       Ronny Jespersen
// @description  TNT Collection Core - Stable functionality for Ikariam enhancements
// @license      MIT
// @include      http*s*.ikariam.*/*
// @exclude      http*support*.ikariam.*/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// ==/UserScript==

// const VERSION_URL = "http://ikariam.rjj-net.dk/scripts/tnt.Collection/version.php";
// const UPDATE_URL = "http://ikariam.rjj-net.dk/scripts/tnt.Collection/update.php";
// const UPDATE_HQ_URL = "http://lazy.rjj-net.dk/tnt/ikariam/hq/update";

// Initialize the tnt.console
const tntConsole = Object.assign({}, window.console);

const validBuildingTypes = [
    'townHall', 'palace', 'palaceColony', 'warehouse', 'wall', 'barracks',
    'shipyard', 'port', 'academy', 'museum', 'temple', 'embassy', 'branchOffice',
    'workshop', 'safehouse', 'carpentering', 'architect', 'vineyard', 'optician',
    'fireworker', 'forester', 'stonemason', 'winegrower', 'glassblowing', 'alchemist',
    'dump', 'tavern', 'blackMarket', 'pirateFortress', 'marineChartArchive',
    'dockyard', 'shrineOfOlympus', 'chronosForge'
];

const template = {
    resources: `
        <div id="tnt_info_resources">
            <div id="tnt_info_resources_content"></div>
            <div id="tnt_info_buildings_content" style="display:none;"></div>
        </div>
    `
};

// Move large data blocks to separate internal modules for better organization
const TNT_BUILDING_DEFINITIONS = [
    // Government
    { key: 'townHall', name: 'Town Hall', icon: '/cdn/all/both/img/city/townhall_l.png', buildingId: 0, helpId: 1 },
    { key: 'palace', name: 'Palace', icon: '/cdn/all/both/img/city/palace_l.png', buildingId: 11, helpId: 1 },
    { key: 'palaceColony', name: 'Governor\'s Residence', icon: '/cdn/all/both/img/city/palaceColony_l.png', buildingId: 17, helpId: 1 },
    { key: 'embassy', name: 'Embassy', icon: '/cdn/all/both/img/city/embassy_l.png', buildingId: 12, helpId: 1 },
    { key: 'chronosForge', name: 'Chronos\' Forge', icon: '/cdn/all/both/img/city/chronosForge_l.png', buildingId: 35, helpId: 1 },

    // Resource storage
    { key: 'warehouse', name: 'Warehouse', icon: '/cdn/all/both/img/city/warehouse_l.png', buildingId: 7, helpId: 1 },
    { key: 'dump', name: 'Depot', icon: '/cdn/all/both/img/city/dump_l.png', buildingId: 29, helpId: 1 },

    // Trade & Diplomacy
    { key: 'port', name: 'Trading Port', icon: '/cdn/all/both/img/city/port_l.png', buildingId: 3, helpId: 1 },
    { key: 'dockyard', name: 'Dockyard', icon: '/cdn/all/both/img/city/dockyard_l.png', buildingId: 33, helpId: 1 },
    { key: 'marineChartArchive', name: 'Sea Chart Archive', icon: '/cdn/all/both/img/city/marinechartarchive_l.png', buildingId: 32, helpId: 1 },
    { key: 'branchOffice', name: 'Trading Post', icon: '/cdn/all/both/img/city/branchoffice_l.png', buildingId: 13, helpId: 1 },

    // Culture & Research
    { key: 'academy', name: 'Academy', icon: '/cdn/all/both/img/city/academy_l.png', buildingId: 4, helpId: 1 },
    { key: 'museum', name: 'Museum', icon: '/cdn/all/both/img/city/museum_l.png', buildingId: 10, helpId: 1 },
    { key: 'tavern', name: 'Tavern', icon: '/cdn/all/both/img/city/taverne_l.png', buildingId: 9, helpId: 1 },
    { key: 'temple', name: 'Temple', icon: '/cdn/all/both/img/city/temple_l.png', buildingId: 28, helpId: 1 },
    { key: 'shrineOfOlympus', name: 'Gods\' Shrine', icon: '/cdn/all/both/img/city/shrineOfOlympus_l.png', buildingId: 34, helpId: 1 },

    // Resource reducers
    { key: 'carpentering', name: 'Carpenter', icon: '/cdn/all/both/img/city/carpentering_l.png', buildingId: 23, helpId: 1 },
    { key: 'architect', name: 'Architect\'s Office', icon: '/cdn/all/both/img/city/architect_l.png', buildingId: 24, helpId: 1 },
    { key: 'vineyard', name: 'Wine Press', icon: '/cdn/all/both/img/city/vineyard_l.png', buildingId: 26, helpId: 1 },
    { key: 'optician', name: 'Optician', icon: '/cdn/all/both/img/city/optician_l.png', buildingId: 25, helpId: 1 },
    { key: 'fireworker', name: 'Firework Test Area', icon: '/cdn/all/both/img/city/fireworker_l.png', buildingId: 27, helpId: 1 },

    // Resource enhancers
    { key: 'forester', name: 'Forester\'s House', icon: '/cdn/all/both/img/city/forester_l.png', buildingId: 18, helpId: 1 },
    { key: 'stonemason', name: 'Stonemason', icon: '/cdn/all/both/img/city/stonemason_l.png', buildingId: 19, helpId: 1 },
    { key: 'winegrower', name: 'Winegrower', icon: '/cdn/all/both/img/city/winegrower_l.png', buildingId: 21, helpId: 1 },
    { key: 'glassblowing', name: 'Glassblower', icon: '/cdn/all/both/img/city/glassblowing_l.png', buildingId: 20, helpId: 1 },
    { key: 'alchemist', name: 'Alchemist\'s Tower', icon: '/cdn/all/both/img/city/alchemist_l.png', buildingId: 22, helpId: 1 },

    // Military
    { key: 'wall', name: 'Wall', icon: '/cdn/all/both/img/city/wall.png', buildingId: 8, helpId: 1 },
    { key: 'barracks', name: 'Barracks', icon: '/cdn/all/both/img/city/barracks_l.png', buildingId: 6, helpId: 1 },
    { key: 'safehouse', name: 'Hideout', icon: '/cdn/all/both/img/city/safehouse_l.png', buildingId: 16, helpId: 1 },
    { key: 'workshop', name: 'Workshop', icon: '/cdn/all/both/img/city/workshop_l.png', buildingId: 15, helpId: 1 },
    { key: 'shipyard', name: 'Shipyard', icon: '/cdn/all/both/img/city/shipyard_l.png', buildingId: 5, helpId: 1 },

    // Special buildings
    { key: 'pirateFortress', name: 'Pirate Fortress', icon: '/cdn/all/both/img/city/pirateFortress_l.png', buildingId: 30, helpId: 1 },
    { key: 'blackMarket', name: 'Black Market', icon: '/cdn/all/both/img/city/blackmarket_l.png', buildingId: 31, helpId: 1 }
];

const TNT_STYLES = `
    /* Show level styles */
    .tntLvl{
        position:relative;
        top:10px;
        left:10px;
        background-color: rgba(255, 255, 255, 0.8);
        border: 1px solid #000;
        padding: 2px 4px;
        border-radius: 3px;
        font-size: 10px;
        z-index: 10;
    }
    
    /* Construction status highlighting */
    .tnt_construction {
        background-color: #80404050 !important;
        border-left: 2px solid #804040 !important;
    }

    /* Visual progress styles */
    .tnt_progress_visited {
        background-color: #d4edda !important;
        color: #155724 !important;
    }
`;

const tnt = {

    version: GM_info.script.version,

    template, // Add template to tnt object
    //url: { versionUrl: VERSION_URL, updateUrl: UPDATE_URL, update: UPDATE_HQ_URL },

    delay: (time) => new Promise(resolve => setTimeout(resolve, time)),

    // Settings module - manage user settings
    settings: {
        debug: { enable: true },

        // Get setting with default value from new storage structure
        get(key, defaultValue = null) {
            return tnt.data.storage.settings?.[key] ?? defaultValue;
        },

        // Set setting value in new storage structure
        set(key, value) {
            if (!tnt.data.storage.settings) {
                tnt.data.storage.settings = {};
            }
            tnt.data.storage.settings[key] = value;
            tnt.core.storage.save();
        },

        // Toggle boolean setting
        toggle(key) {
            const current = this.get(key, false);
            this.set(key, !current);
            return !current;
        },

        // Get all resource display settings
        getResourceDisplaySettings() {
            return {
                showResources: this.get("cityShowResources", true),
                showPopulation: this.get("cityShowResourcesPorpulation", true),
                showCitizens: this.get("cityShowResourcesCitizens", true),
                showWood: this.get("cityShowResourcesWoods", true),
                showWine: this.get("cityShowResourcesWine", true),
                showMarble: this.get("cityShowResourcesMarble", true),
                showCrystal: this.get("cityShowResourcesCrystal", true),
                showSulfur: this.get("cityShowResourcesSulfur", true)
            };
        },

        // Get all feature settings
        getFeatureSettings() {
            return {
                removePremiumOffers: this.get("allRemovePremiumOffers", true),
                removeFooterNavigation: this.get("allRemoveFooterNavigation", true),
                changeNavigationCoord: this.get("allChangeNavigationCoord", true),
                showCityLvl: this.get("islandShowCityLvl", true),
                removeFlyingShop: this.get("cityRemoveFlyingShop", true),
                notificationAdvisors: this.get("notificationAdvisors", true),
                notificationSound: this.get("notificationSound", true)
            };
        },

        // Initialize default settings - simplified without migration
        initDefaults() {
            const defaults = {
                "allRemovePremiumOffers": true,
                "allRemoveFooterNavigation": true,
                "allChangeNavigationCoord": true,
                "islandShowCityLvl": true,
                "cityRemoveFlyingShop": true,
                "cityShowResources": true,
                "cityShowResourcesPorpulation": true,
                "cityShowResourcesCitizens": true,
                "cityShowResourcesWoods": true,
                "cityShowResourcesWine": true,
                "cityShowResourcesMarble": true,
                "cityShowResourcesCrystal": true,
                "cityShowResourcesSulfur": true,
                "notificationAdvisors": true,
                "notificationSound": true,
                "citySwitcherActive": false,
                "citySwitcherStartCity": null,
                "citySwitcherVisited": [],
                "debugEnabled": true
            };

            // Initialize defaults for any missing settings
            Object.entries(defaults).forEach(([key, defaultValue]) => {
                if (this.get(key) === undefined) {
                    this.set(key, defaultValue);
                }
            });

            this.set("version", tnt.version);
        }
    },

    // UI module - handle all DOM manipulation and event binding
    ui: {
        // Create and show the options dialog
        showOptionsDialog() {
            const optionsHtml = this.buildOptionsHtml();

            if ($('#tntOptions').length === 0) {
                $('li.serverTime').before(`
                    <li>
                        <a id="tntOptionsLink" href="javascript:void(0);">TNT Options v${tnt.version}</a>
                        <div id="tntOptions" class="tntBox" style="display:none;">
                            ${optionsHtml}
                        </div>
                    </li>
                `);
                this.attachOptionsEventHandlers();
            }
        },

        buildOptionsHtml() {
            const settings = tnt.settings.getFeatureSettings();
            const resourceSettings = tnt.settings.getResourceDisplaySettings();

            return `
                <div id="tntUpdateLine" align="center" style="padding-bottom:5px;">
                    <a id="tntColUpgradeLink" href="" style="display:none;color:blue;font-size:12px;">
                        Version <span id="tntColVersion"></span> is available. Click here to update now!
                    </a>
                </div>
                <div>
                    <div class="tnt_left" style="float:left;width:50%;">
                        <legend>All:</legend>
                        ${this.createCheckbox('tntAllRemovePremiumOffers', 'Remove Premium Offers', settings.removePremiumOffers)}
                        ${this.createCheckbox('tntAllRemoveFooterNavigation', 'Remove footer navigation', settings.removeFooterNavigation)}
                        ${this.createCheckbox('tntAllChangeNavigationCoord', 'Make footer navigation coord input a number', settings.changeNavigationCoord)}
                    </div>
                    <div class="tnt_left" style="float:left;width:50%;">
                        <legend>Notifications:</legend>
                        ${this.createCheckbox('tntNotificationAdvisors', 'Show notifications from Advisors', settings.notificationAdvisors)}
                        ${this.createCheckbox('tntNotificationSound', 'Play sound with notifications from Advisors', settings.notificationSound)}
                    </div>
                    <div class="tnt_left" style="float:left;width:50%;">
                        <legend>Islands:</legend>
                        ${this.createCheckbox('tntIslandShowCityLvl', 'Show Town Levels on Islands', settings.showCityLvl)}
                    </div>
                    <div class="tnt_left" style="float:left;width:50%;">
                        <legend>City:</legend>
                        ${this.createCheckbox('tntCityRemoveFlyingShop', 'Remove flying shop', settings.removeFlyingShop)}
                        ${this.createCheckbox('tntCityShowResources', 'Show resources', resourceSettings.showResources)}
                        <div class="tnt_left" style="padding-left:20px;">
                            ${this.createCheckbox('tntCityShowResourcesPorpulation', 'Show population', resourceSettings.showPopulation)}
                            ${this.createCheckbox('tntCityShowResourcesCitizens', 'Show citizens', resourceSettings.showCitizens)}
                            ${this.createCheckbox('tntCityShowResourcesWoods', 'Show wood', resourceSettings.showWood)}
                            ${this.createCheckbox('tntCityShowResourcesWine', 'Show Wine', resourceSettings.showWine)}
                            ${this.createCheckbox('tntCityShowResourcesMarble', 'Show Marble', resourceSettings.showMarble)}
                            ${this.createCheckbox('tntCityShowResourcesCrystal', 'Show Crystal', resourceSettings.showCrystal)}
                            ${this.createCheckbox('tntCityShowResourcesSulfur', 'Show Sulfur', resourceSettings.showSulfur)}
                        </div>
                    </div>
                    <div class="tnt_left" style="float:left;width:50%;">
                        <legend>World Map:</legend>
                    </div>
                </div>
                <div align="center" style="clear:both;">
                    <input id="tntOptionsClose" type="button" class="button" value="Close and refresh" />
                </div>
            `;
        },

        createCheckbox(id, label, checked) {
            return `<input id="${id}" type="checkbox"${checked ? ' checked="checked"' : ''} /> ${label}<br/>`;
        },

        attachOptionsEventHandlers() {
            // Open/close dialog
            $("#tntOptionsLink").on("click", () => $("#tntOptions").slideToggle());
            $("#tntOptionsClose").on("click", () => {
                $("#tntOptions").slideToggle();
                location.reload();
            });

            // Setting change handlers
            const settingHandlers = {
                'tntAllRemovePremiumOffers': 'allRemovePremiumOffers',
                'tntAllRemoveFooterNavigation': 'allRemoveFooterNavigation',
                'tntAllChangeNavigationCoord': 'allChangeNavigationCoord',
                'tntIslandShowCityLvl': 'islandShowCityLvl',
                'tntCityRemoveFlyingShop': 'cityRemoveFlyingShop',
                'tntCityShowResources': 'cityShowResources',
                'tntCityShowResourcesPorpulation': 'cityShowResourcesPorpulation',
                'tntCityShowResourcesCitizens': 'cityShowResourcesCitizens',
                'tntCityShowResourcesWoods': 'cityShowResourcesWoods',
                'tntCityShowResourcesWine': 'cityShowResourcesWine',
                'tntCityShowResourcesMarble': 'cityShowResourcesMarble',
                'tntCityShowResourcesCrystal': 'cityShowResourcesCrystal',
                'tntCityShowResourcesSulfur': 'cityShowResourcesSulfur',
                'tntNotificationAdvisors': 'notificationAdvisors'
            };

            Object.entries(settingHandlers).forEach(([elementId, settingKey]) => {
                $(`#${elementId}`).on("change", () => tnt.settings.toggle(settingKey));
            });

            // Special handler for notification sound (different toggle logic)
            $("#tntNotificationSound").on("change", () => {
                tnt.settings.set("notificationSound", !tnt.settings.get("notificationSound"));
            });
        },

        // Apply UI modifications based on settings
        applyUIModifications() {
            const settings = tnt.settings.getFeatureSettings();

            if (settings.removeFooterNavigation) {
                $('div#breadcrumbs, div#footer').hide();
            }

            if (settings.removeFlyingShop && $("body").attr("id") === "city") {
                $('.premiumOfferBox').hide();
            }
        },

        // Dedicated function to remove flying shop elements
        removeFlyingShop() {
            const settings = tnt.settings.getFeatureSettings();
            if (settings.removeFlyingShop) {
                $('.premiumOfferBox').hide();
                $('.expandable.resourceShop, .expandable.slot1').hide();
            }
        }
    },

    // Game data getters with better organization and error handling
    game: {
        player: {
            getId() {
                return tnt.utils.safeGet(() => parseInt(ikariam.model.avatarId), 0);
            },

            getAlliance() {
                return {
                    id: tnt.utils.safeGet(() => parseInt(ikariam.model.avatarAllyId), 0),
                    hasAlly: tnt.utils.safeGet(() => ikariam.model.hasAlly, false)
                };
            }
        },

        city: {
            getId() {
                return tnt.utils.safeGet(() =>
                    ikariam.model.relatedCityData.selectedCity.replace(/[^\d-]+/g, ""), ""
                );
            },

            getName(id) {
                return tnt.utils.safeGet(() => {
                    if (id) {
                        return ikariam.model.relatedCityData["city_" + id].name;
                    }
                    return $("#citySelect option:selected").text().split("] ")[1];
                }, "Unknown City");
            },

            getLevel() {
                return $("#js_CityPosition0Level").text();
            },

            getCoordinates() {
                return $("#js_islandBreadCoords").text();
            },

            getProducedTradegood() {
                return tnt.utils.safeGet(() => ikariam.model.producedTradegood, 0);
            },

            isOwn() {
                return tnt.utils.safeGet(() => ikariam.model.isOwnCity, false);
            },

            getList() {
                return tnt.utils.safeGet(() => {
                    const cityList = {};
                    for (const key in ikariam.model.relatedCityData) {
                        if (key.startsWith("city_")) {
                            const cityId = key.replace("city_", "");
                            cityList[cityId] = {
                                name: ikariam.model.relatedCityData[key].name,
                                coordinates: ikariam.model.relatedCityData[key].coords
                            };
                        }
                    }
                    return cityList;
                }, {});
            }
        },

        resources: {
            getCurrent() {
                return {
                    wood: tnt.utils.safeGet(() => ikariam.model.currentResources.resource, 0),
                    wine: tnt.utils.safeGet(() => ikariam.model.currentResources[1], 0),
                    marble: tnt.utils.safeGet(() => ikariam.model.currentResources[2], 0),
                    crystal: tnt.utils.safeGet(() => ikariam.model.currentResources[3], 0),
                    sulfur: tnt.utils.safeGet(() => ikariam.model.currentResources[4], 0),
                    population: tnt.utils.safeGet(() => ikariam.model.currentResources.population, 0),
                    citizens: tnt.utils.safeGet(() => ikariam.model.currentResources.citizens, 0)
                };
            },

            getProduction() {
                return {
                    resource: tnt.utils.safeGet(() => ikariam.model.resourceProduction, 0),
                    tradegood: tnt.utils.safeGet(() => ikariam.model.tradegoodProduction, 0)
                };
            },

            getCapacity() {
                return {
                    max: tnt.utils.safeGet(() => ikariam.model.maxResources.resource, 0),
                    wineSpending: tnt.utils.safeGet(() => ikariam.model.wineSpending, 0)
                };
            }
        },

        economy: {
            getGold() {
                return tnt.utils.safeGet(() => parseInt(ikariam.model.gold), 0);
            },

            getAmbrosia() {
                return tnt.utils.safeGet(() => ikariam.model.ambrosia, 0);
            },

            getFinances() {
                return {
                    income: tnt.utils.safeGet(() => ikariam.model.income, 0),
                    upkeep: tnt.utils.safeGet(() => ikariam.model.upkeep, 0),
                    scientistsUpkeep: tnt.utils.safeGet(() => ikariam.model.sciencetistsUpkeep, 0),
                    godGoldResult: tnt.utils.safeGet(() => ikariam.model.godGoldResult, 0)
                };
            }
        },

        military: {
            getTransporters() {
                return {
                    free: tnt.utils.safeGet(() => ikariam.model.freeTransporters, 0),
                    max: tnt.utils.safeGet(() => ikariam.model.maxTransporters, 0)
                };
            }
        }
    },

    // Utilities module
    utils: {
        // Safe getter with error handling
        safeGet(getter, defaultValue = null) {
            try {
                return getter();
            } catch (e) {
                tnt.core.debug.log(`Error in safeGet: ${e.message}`);
                return defaultValue;
            }
        },

        // Check if city has construction - simplified
        hasConstruction() {
            return $('.constructionSite').length > 0;
        },

        // Calculate production for a city over time - update to use new storage structure
        calculateProduction(cityID, hours) {
            const city = tnt.data.storage.city[cityID]; // Use new storage structure
            if (city && city.hasOwnProperty('resourceProduction') && city.hasOwnProperty('tradegoodProduction')) {
                return {
                    wood: parseInt((city.resourceProduction * hours * 3600)).toLocaleString(),
                    wine: city.producedTradegood == 1 ? (parseInt(city.tradegoodProduction * hours * 3600)).toLocaleString() : "0",
                    marble: city.producedTradegood == 2 ? (parseInt(city.tradegoodProduction * hours * 3600)).toLocaleString() : "0",
                    crystal: city.producedTradegood == 3 ? (parseInt(city.tradegoodProduction * hours * 3600)).toLocaleString() : "0",
                    sulfur: city.producedTradegood == 4 ? (parseInt(city.tradegoodProduction * hours * 3600)).toLocaleString() : "0"
                };
            }

            if (!city) {
                tnt.core.debug.log(`City ID ${cityID} not found in storage`);
            } else {
                tnt.core.debug.log(`City ID ${cityID} missing production data (resourceProduction: ${city.resourceProduction}, tradegoodProduction: ${city.tradegoodProduction})`);
            }
            return { wood: "0", wine: "0", marble: "0", crystal: "0", sulfur: "0" };
        },

        // Extract level from CSS classes pattern
        extractLevelFromElement($element) {
            const classes = $element.attr('class') || '';
            const levelMatch = classes.match(/level(\d+)/);
            return levelMatch ? levelMatch[1] : '?';
        },

        // Create level indicator element
        createLevelIndicator(level) {
            return $('<div class="tntLvl">' + level + '</div>');
        },

        // Check if current page is island view
        isIslandView() {
            return $("body").attr("id") === "island";
        },

        // Validate city element for level display
        validateCityElement($element) {
            // Check if element exists
            if ($element.length === 0) return false;

            // Check if already has level indicator
            if ($element.find('.tntLvl').length > 0) return false;

            // Check if it's actually a player city
            if (!$element.hasClass('city')) return false;

            return true;
        },

        // Iterate through city positions with callback
        iterateCityPositions(callback) {
            for (let i = 0; i <= 16; i++) {
                const $cityLocation = $(`#cityLocation${i}`);
                callback($cityLocation, i);
            }
        },

        // Complete city level display logic
        displayCityLevels() {
            // Only run on island view
            if (!this.isIslandView()) return;

            // Iterate through all city positions
            this.iterateCityPositions(($cityLocation, position) => {
                // Validate the city element
                if (!this.validateCityElement($cityLocation)) return;

                // Extract level from element
                const level = this.extractLevelFromElement($cityLocation);

                // Create and append level indicator
                const $levelIndicator = this.createLevelIndicator(level);
                $cityLocation.append($levelIndicator);
            });
        },

        // Building Detection Utilities

        // Extract position number from element ID
        extractPositionFromElement($element) {
            const posId = $element.attr('id');
            if (!posId) return null;
            const match = posId.match(/\d+$/);
            return match ? match[0] : null;
        },

        // Detect building type from CSS classes
        detectBuildingType($element) {
            const classes = ($element.attr('class') || '').split(/\s+/);
            return classes.find(c => validBuildingTypes.includes(c)) || null;
        },

        // Check if building is under construction
        isUnderConstruction($element) {
            return $element.hasClass('constructionSite');
        },

        // Extract building level information
        extractBuildingLevel($element) {
            const underConstruction = this.isUnderConstruction($element);
            const classes = ($element.attr('class') || '').split(/\s+/);
            let level = 0;
            let targetLevel = 0;

            if (underConstruction) {
                // For buildings under construction, try to get current and target levels
                const $level = $element.find('.level');
                const currentLevelText = $level.text();
                level = parseInt(currentLevelText.match(/\d+/)?.[0] || '0');

                // Try to get target level from title or construction info
                const title = $element.find('a').attr('title') || '';
                const titleMatch = title.match(/\((\d+)\)/);
                targetLevel = titleMatch ? parseInt(titleMatch[1]) : level + 1;
            } else {
                const levelClass = classes.find(c => c.startsWith('level'));
                const $level = $element.find('.level');
                level = parseInt(levelClass?.match(/\d+$/)?.[0] || $level.text().match(/\d+/)?.[0] || '0');
                targetLevel = level;
            }

            return { level, targetLevel, underConstruction };
        },

        // Create building data object
        createBuildingData(position, buildingType, levelInfo) {
            return {
                position,
                level: levelInfo.targetLevel || levelInfo.level,
                currentLevel: levelInfo.level,
                targetLevel: levelInfo.targetLevel,
                name: buildingType,
                underConstruction: levelInfo.underConstruction
            };
        },

        // Add building to collection
        addBuildingToCollection(collection, buildingData) {
            const buildingType = buildingData.name;
            collection[buildingType] = collection[buildingType] || [];

            const existingIndex = collection[buildingType].findIndex(b => b.position === buildingData.position);
            if (existingIndex >= 0) {
                collection[buildingType][existingIndex] = buildingData;
            } else {
                collection[buildingType].push(buildingData);
            }
        },

        // Complete building detection for current city
        scanAllBuildings() {
            const $positions = $('div[id^="position"].building, div[id^="js_CityPosition"].building');
            if (!$positions.length) return { buildings: {}, hasConstruction: false };

            const foundBuildings = {};
            const hasAnyConstruction = this.hasConstruction();

            $positions.each((index, element) => {
                const $pos = $(element);

                // Extract basic building information
                const position = this.extractPositionFromElement($pos);
                if (!position) return;

                const buildingType = this.detectBuildingType($pos);
                if (!buildingType) return;

                const levelInfo = this.extractBuildingLevel($pos);
                if (levelInfo.level <= 0 && levelInfo.targetLevel <= 0) return;

                // Create and add building data
                const buildingData = this.createBuildingData(position, buildingType, levelInfo);
                this.addBuildingToCollection(foundBuildings, buildingData);
            });

            return {
                buildings: foundBuildings,
                hasConstruction: hasAnyConstruction
            };
        },

        // City switching utility function - extracted from tableBuilder.attachEventHandlers
        switchToCity(cityId) {
            // tntConsole.log('[TNT] Utils switching to city:', cityId);

            // Try multiple methods to switch cities
            let switchSuccess = false;

            // Method 1: Direct ajaxHandlerCall (most reliable)
            try {
                if (typeof ajaxHandlerCall === 'function') {
                    // console.log('[TNT] Utils using ajaxHandlerCall method');
                    ajaxHandlerCall(`?view=city&cityId=${cityId}`);
                    switchSuccess = true;
                    return true;
                }
            } catch (e) {
                // console.log('[TNT] Utils ajaxHandlerCall failed:', e.message);
            }

            // Method 2: Try to find and trigger the city select dropdown change
            try {
                const $citySelect = $('#js_GlobalMenu_citySelect');
                if ($citySelect.length > 0) {
                    // console.log('[TNT] Utils using city select dropdown method');
                    $citySelect.val(cityId).trigger('change');
                    switchSuccess = true;
                    return true;
                }
            } catch (e) {
                // console.log('[TNT] Utils city select dropdown failed:', e.message);
            }

            // Method 3: Try the dropdown li click with more specific targeting
            try {
                const $cityOption = $(`#dropDown_js_citySelectContainer li[selectValue="${cityId}"]`);
                if ($cityOption.length > 0) {
                    // console.log('[TNT] Utils using improved dropdown click method');

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
                        return true;
                    }
                }
            } catch (e) {
                // console.log('[TNT] Utils improved dropdown method failed:', e.message);
            }

            // Method 4: Direct URL navigation (fallback)
            if (!switchSuccess) {
                // console.log('[TNT] Utils using URL navigation fallback');
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.set('cityId', cityId);
                currentUrl.searchParams.set('currentCityId', cityId);
                window.location.href = currentUrl.toString();
                return true;
            }

            return false;
        }
    },

    // Add missing functions that are called but not defined
    all() {
        // Common functionality that runs on all pages
        const settings = this.settings.getFeatureSettings();

        // Apply global UI modifications
        if (settings.removePremiumOffers) {
            $('.premiumOfferBox').hide();
        }
    },

    island() {
        // Island-specific functionality
        tnt.core.debug.log('Island view loaded');

        // Show city levels if setting is enabled
        if (tnt.settings.get("islandShowCityLvl", true)) {
            tnt.utils.displayCityLevels();
        }
    },

    city() {
        // City-specific functionality
        tnt.core.debug.log('City view loaded');

        // Apply city-specific modifications
        tnt.ui.removeFlyingShop();
    },

    world() {
        // World map specific functionality
        tnt.core.debug.log('World map loaded');
    },

    showCityLevels() {
        // Delegate to the utility function
        tnt.utils.displayCityLevels();
    },

    // Main data structure to hold all data - NEW STRUCTURE
    data: {
        ikariam: {
            subDomain: location.hostname.split('.')[0],
            url: {
                notification: (() => {
                    const sub = location.hostname.split('.')[0];
                    const base = `https://${sub}.ikariam.gameforge.com/cdn/all/both/layout/advisors/`;
                    return {
                        defaultPicture: base + "mayor_premium.png",
                        mayor: base + "mayor.png",
                        mayor_premium: base + "mayor_premium.png",
                        general: base + "general.png",
                        general_premium: base + "general_premium.png",
                        general_alert: base + "general_premium_alert.png",
                        scientist: base + "scientist.png",
                        scientist_premium: base + "scientist_premium.png",
                        diplomat: base + "diplomat.png",
                        diplomat_premium: base + "diplomat_premium.png"
                    };
                })()
            }
        },
        storage: {
            // NEW STRUCTURE: Own cities (existing data)
            city: {},

            // NEW STRUCTURE: Foreign cities
            foreign: {},

            // NEW STRUCTURE: Cities with spies (subset of foreign)
            spy: {},

            // NEW STRUCTURE: Avatar/player data
            avatar: {
                ambrosia: 0,
                gold: 0
            },

            // NEW STRUCTURE: TNT settings (includes notification settings)
            settings: {
                notification: {
                    city: false,
                    military: false,
                    militaryAlert: false,
                    scientist: false,
                    diplomat: false
                }
            }
        }
    },

    // Initialize the core module
    core: {
        init() {
            tnt.core.debug.log(`TNT Collection v${tnt.version} - Init...`);

            tnt.core.storage.init();
            tnt.dataCollector.update();
            tnt.core.notification.init();
            tnt.core.events.init();
            tnt.core.options.init();

            // Apply UI modifications
            tnt.ui.applyUIModifications();

            tnt.all();

            // 🚨 PROBLEM: This runs on EVERY page load, even direct navigation!
            tnt.citySwitcher.checkAndContinue();

            switch ($("body").attr("id")) {
                case "island": tnt.island(); break;
                case "city": tnt.city(); break;
                case "worldmap_iso": tnt.world(); break;
            }
        },

        ajax: {
            send(data, url = tnt.url.update, callback = null) {
                // Remove noisy debug logging
                // tnt.core.debug.log('Data length: ' + JSON.stringify(data).length, 3);
                GM_xmlhttpRequest({
                    url, method: 'POST',
                    data: "data=" + encodeURIComponent(JSON.stringify(data)),
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    onload: resp => {
                        // Remove noisy debug logging
                        // tnt.core.debug.dir(resp.responseText, 5);
                        if (callback) callback();
                    },
                    onerror: (error) => {
                        // Keep error logging but make it cleaner
                        console.error("TNT AJAX Error:", error.message);
                    }
                });
            }
        },

        debug: {
            log(val) {
                // Reduce debug noise - only log important messages
                if (tnt.settings.debug.enable) {
                    // Filter out excessive debug messages
                    if (typeof val === 'string' && (
                        val.includes('Error in safeGet') ||
                        val.includes('Using fallback city ID') ||
                        val.includes('updateGlobalData') ||
                        val.includes('updateBackgroundData') ||
                        val.includes('changeView')
                    )) {
                        return; // Skip these noisy debug messages
                    }
                    tntConsole.log(val);
                }
            },
            dir(obj, level = 0) {
                // Only show directory output for level 0 (most important)
                if (tnt.settings.debug.enable && level === 0) {
                    tntConsole.dir(obj);
                }
            }
        },

        storage: {
            init() {
                const scriptStartTime = performance.now();
                console.log(`[TNT Timing] Script start: ${scriptStartTime.toFixed(2)}ms`);

                try {
                    const storedData = localStorage.getItem("tnt_storage");

                    if (storedData) {
                        const parsedData = JSON.parse(storedData);
                        const storedVersion = parsedData.version;

                        console.log(`[TNT Timing] Storage parsed: ${(performance.now() - scriptStartTime).toFixed(2)}ms`);

                        // Enhanced version check - detect structure compatibility
                        if (storedVersion === tnt.version) {
                            // Same version - use existing data
                            tnt.data.storage = $.extend(true, {}, tnt.data.storage, parsedData);
                            // console.log('[TNT] Using existing storage data (version match)');
                        } else {
                            // Check if stored data has new structure (city, foreign, spy, settings)
                            const hasNewStructure = parsedData.city &&
                                parsedData.settings &&
                                typeof parsedData.settings === 'object';

                            if (hasNewStructure) {
                                // New structure exists - just update version, no reset needed
                                tnt.data.storage = $.extend(true, {}, tnt.data.storage, parsedData);
                                tnt.data.storage.version = tnt.version;
                                tnt.core.storage.save();
                                // console.log(`[TNT] Updated version from ${storedVersion} to ${tnt.version} (structure compatible)`);
                            } else {
                                // Old structure or incompatible - reset and auto-start
                                // console.log(`[TNT] Incompatible storage structure - resetting and starting data collection`);
                                // console.log(`[TNT] Stored: ${storedVersion}, Current: ${tnt.version}`);

                                // Reset to clean defaults with current version
                                tnt.data.storage.version = tnt.version;
                                tnt.core.storage.save();

                                // Smart auto-start data collection with 200ms delay
                                setTimeout(() => {
                                    const cityList = tnt.get.cityList();
                                    const cityCount = Object.keys(cityList).length;

                                    // console.log(`[TNT] Auto-starting data collection for ${cityCount} cities`);

                                    if (cityCount > 1) {
                                        // Multiple cities - start city switcher
                                        // console.log('[TNT] Starting city switcher for multi-city data collection');
                                        tnt.citySwitcher.start();
                                    } else if (cityCount === 1) {
                                        // Single city - just collect current city data
                                        // console.log('[TNT] Single city detected - collecting current city data');
                                        tnt.dataCollector.update();
                                    } else {
                                        // console.log('[TNT] No cities detected - skipping auto-collection');
                                    }
                                }, 200);
                            }
                        }
                    } else {
                        // No existing storage - new user
                        // console.log('[TNT] No existing storage found - new user detected');
                        tnt.data.storage.version = tnt.version;
                        tnt.core.storage.save();

                        // Smart auto-start for new users with 200ms delay  
                        setTimeout(() => {
                            const cityList = tnt.get.cityList();
                            const cityCount = Object.keys(cityList).length;

                            // console.log(`[TNT] New user auto-starting data collection for ${cityCount} cities`);

                            if (cityCount > 1) {
                                // Multiple cities - start city switcher
                                // console.log('[TNT] Starting city switcher for new user');
                                tnt.citySwitcher.start();
                            } else if (cityCount === 1) {
                                // Single city - just collect current city data
                                // console.log('[TNT] Single city new user - collecting current city data');
                                tnt.dataCollector.update();
                            } else {
                                // console.log('[TNT] New user with no cities - skipping auto-collection');
                            }
                        }, 200);
                    }

                    // Check when city list becomes available
                    const cityList = tnt.get.cityList();
                    // console.log(`[TNT Timing] City list ready: ${(performance.now() - scriptStartTime).toFixed(2)}ms (${Object.keys(cityList).length} cities)`);

                } catch (e) {
                    tnt.core.debug.log("Error parsing tnt_storage: " + e.message);
                    // console.log('[TNT] Using default storage structure due to parse error');

                    // On parse error, treat as new user
                    tnt.data.storage.version = tnt.version;
                    tnt.core.storage.save();
                }
            },

            // Get setting value from storage
            get(group, name) {
                if (!tnt.data.storage || !tnt.data.storage[group]) return undefined;
                return tnt.data.storage[group][name];
            },

            // Set setting value in storage
            set(group, name, value) {
                if (!tnt.data.storage) tnt.data.storage = {};
                if (!tnt.data.storage[group]) tnt.data.storage[group] = {};
                tnt.data.storage[group][name] = value;
                tnt.core.storage.save();
            },
            // Save data to storage
            save() {
                try {
                    localStorage.setItem("tnt_storage", JSON.stringify(tnt.data.storage));
                } catch (e) {
                    tnt.core.debug.log("Error saving to localStorage: " + e.message, 1);
                }
            }
        },

        notification: {
            init() { if (Notification && Notification.permission !== "granted") Notification.requestPermission(); },
            notifyMe(title, message, picture) {
                // Disabled for now
                return;
            },
            check() {
                return; // Disable notifications for now
                // ...existing notification check code...
            }
        },

        events: {
            init() {
                // Check if ajax and ajax.Responder exist before overriding

                if (typeof ajax !== 'undefined' && ajax.Responder) {
                    tnt.core.debug.log('Ajax responder available, applying override');
                    tnt.core.events.ikariam.override();
                } else {
                    tnt.core.debug.log('Ajax responder not available, skipping override');
                }
            },
            ikariam: {
                override() {
                    // updateGlobalData = Move this into its own function
                    ajax.Responder.tntUpdateGlobalData = ajax.Responder.updateGlobalData;
                    ajax.Responder.updateGlobalData = function (response) {

                        var view = $('body').attr('id');
                        tnt.core.debug.log("updateGlobalData (View: " + view + ")", 3);

                        // Let Ikariam do its stuff
                        ajax.Responder.tntUpdateGlobalData(response);

                        // Check notifications
                        tnt.core.notification.check();

                        // Collect data  
                        tnt.dataCollector.update();

                        // Run tnt.all() to handle all common tasks
                        tnt.all();
                    }

                    // updateBackgroundData = Move this into its own function
                    ajax.Responder.tntUpdateBackgroundData = ajax.Responder.updateBackgroundData;
                    ajax.Responder.updateBackgroundData = function (response) {
                        var view = $('body').attr('id');
                        tnt.core.debug.log("updateBackgroundData (View: " + view + ")", 3);

                        // Let Ikariam do its stuff
                        ajax.Responder.tntUpdateBackgroundData(response);

                        // Check notifications
                        tnt.core.notification.check();

                        // Apply removeFlyingShop during background updates
                        if (view === "city") {
                            tnt.ui.removeFlyingShop();
                        }

                        switch (view) {
                            case "worldmap_iso":
                                tnt.core.debug.log($('worldmap_iso: div.islandTile div.cities'), 3);
                                break;
                            case "city":
                                break;
                            case "plunder":
                                // Select all units when pillaging
                                setTimeout(() => {
                                    // Set all units to max
                                    $('#selectArmy .assignUnits .setMax').trigger("click");

                                    // Set extra transporters to available count
                                    const freeTransporters = parseInt($("#js_GlobalMenu_freeTransporters").text()) || 0;
                                    $('#extraTransporter').val(freeTransporters);
                                }, 1000);
                                break;
                            case 'tradeAdvisor':
                                tnt.core.debug.log("tradeAdvisor", 3);
                                break;
                        }
                    }

                    // changeView = Move this into its own function
                    ajax.Responder.tntChangeView = ajax.Responder.changeView;
                    ajax.Responder.changeView = function (response) {
                        var view = $('body').attr('id');
                        tnt.core.debug.log("changeView (View: " + view + ")", 3);

                        // Let Ikariam do its stuff
                        ajax.Responder.tntChangeView(response);

                        // Check notifications
                        tnt.core.notification.check();

                        tnt.core.debug.log("ikariam.templateView.id: '" + ikariam.templateView.id + "'", 3);
                        switch (ikariam.templateView.id) {
                            case "townHall":
                                if (!ikariam.backgroundView.screen.data.isCapital && $('#sidebarWidget .indicator').length > 1) {
                                    $('#sidebarWidget .indicator').last().trigger("click");
                                }
                                break;
                            case "tradeAdvisor":
                                $("#tradeAdvisor").children('div.contentBox01h').eq(1).hide();
                                break;
                            case "militaryAdvisor":
                                $("#militaryAdvisor").find('div.contentBox01h').eq(0).hide();
                                break;
                            case "researchAdvisor":
                                $("#researchAdvisor").find('div.contentBox01h').eq(1).hide();
                                break;
                            case "diplomacyAdvisor":
                                $("#tab_diplomacyAdvisor").find('div.contentBox01h').eq(2).hide();
                                break;
                            case "transport":
                                $('#setPremiumJetPropulsion').hide().prev().hide();
                                break;
                            case "resource":
                                $('#sidebarWidget .indicator').eq(1).trigger("click");
                                break;
                            case "merchantNavy":
                                setTimeout(() => {
                                    $('.pulldown .btn').trigger('click');
                                }, 250);
                                break;
                            case "deployment":
                            case "plunder":
                                // Wait for dialog to be ready
                                setTimeout(() => {
                                    // Select all units
                                    $('#selectArmy .assignUnits .setMax').trigger("click");

                                    // Set initial transporter count
                                    const freeTransporters = tnt.get.transporters.free();
                                    $('#extraTransporter').val(freeTransporters);

                                    // Prevent 0 transporters when min is clicked 
                                    $('#selectArmy .assignUnits .setMin').on('click', function () {
                                        if (parseInt($('#extraTransporter').val()) === 0) {
                                            $('#extraTransporter').val(tnt.get.transporters.free());
                                        }
                                    });
                                }, 200);
                                break;
                        }

                        // Run tnt.all() to handle all common tasks
                        tnt.all();
                    }
                }
            }
        },

        options: {
            init() {
                if (tnt.settings.get("version") !== tnt.version) {
                    tnt.settings.initDefaults();
                }
                tnt.ui.showOptionsDialog();
            }
        }
    },

    // dataCollector = Collects and stores resource data
    dataCollector: {
        update() {
            const currentCityId = tnt.get.cityId();

            // Skip data collection if no valid city ID
            if (!currentCityId || currentCityId === 'undefined') {
                return;
            }

            const isOwnCity = tnt.game.city.isOwn();

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

            const cityData = {
                ...prev,
                buildings: {},
                cityIslandCoords: tnt.get.cityIslandCoords(),
                producedTradegood: parseInt(tnt.get.producedTradegood()),
                population: tnt.get.population(),
                citizens: tnt.get.citizens(),
                max: tnt.utils.safeGet(() => ikariam.model.maxResources.resource, 0),
                wood: tnt.get.resources.wood(),
                wine: tnt.get.resources.wine(),
                marble: tnt.get.resources.marble(),
                crystal: tnt.get.resources.crystal(),
                sulfur: tnt.get.resources.sulfur(),
                hasConstruction: false,
                cityLvl: tnt.get.cityLvl(),
                resourceProduction: tnt.get.resourceProduction(),
                tradegoodProduction: tnt.get.tradegoodProduction(),
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
            tnt.dataCollector.show();
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
                cityIslandCoords: tnt.get.cityIslandCoords(),
                cityLvl: tnt.get.cityLvl(),
                producedTradegood: parseInt(tnt.get.producedTradegood()),
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
            if (tnt.settings.getResourceDisplaySettings().showResources &&
                $("body").attr("id") == "city" &&
                tnt.game.city.isOwn()) {

                // console.log('[TNT] Showing resource tables');

                if ($('#tnt_info_resources').length === 0) {
                    $('body').append(tnt.template.resources);
                    // console.log('[TNT] Created tnt_info_resources container');
                }

                $('#tnt_info_resources_content').empty();
                $('#tnt_info_buildings_content').empty();

                const resourceTable = tnt.tableBuilder.buildTable('resources');
                $('#tnt_info_resources_content').html(resourceTable);
                // console.log('[TNT] Inserted resource table HTML');

                const buildingTable = tnt.tableBuilder.buildTable('buildings');
                $('#tnt_info_buildings_content').html(buildingTable);
                // console.log('[TNT] Inserted building table HTML');

                this.createExternalControls();
                tnt.tableBuilder.attachEventHandlers();

                const $cityLinks = $('.tnt_city_link');
                // console.log('[TNT] Created city links:', $cityLinks.length);
            } else {
                // console.log('[TNT] Not showing resource tables - conditions not met');
                if (!tnt.game.city.isOwn()) {
                    // console.log('[TNT] Foreign city detected - not showing own city tables');
                }
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
                sulfur: 0
            };

            $.each(tnt.data.storage.city, function (cityID, cityData) {
                total.population += parseInt(cityData.population) || 0;
                total.citizens += parseInt(cityData.citizens) || 0;
                total.wood += cityData.wood || 0;
                total.wine += cityData.wine || 0;
                total.marble += cityData.marble || 0;
                total.crystal += cityData.crystal || 0;
                total.sulfur += cityData.sulfur || 0;
            });

            return total;
        },

        getBuildingDefinitions() {
            return TNT_BUILDING_DEFINITIONS;
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
            const buildingCategories = {
                government: ['townHall', 'palace', 'palaceColony', 'embassy', 'chronosForge'],
                storage: ['warehouse', 'dump'],
                trade: ['port', 'dockyard', 'marineChartArchive', 'branchOffice'],
                resourceReducers: ['carpentering', 'architect', 'vineyard', 'optician', 'fireworker'],
                resourceEnhancers: ['forester', 'stonemason', 'winegrower', 'glassblowing', 'alchemist'],
                military: ['wall', 'barracks', 'safehouse', 'workshop', 'shipyard'],
                culture: ['tavern', 'museum', 'academy', 'temple', 'shrineOfOlympus'],
                special: ['pirateFortress', 'blackMarket']
            };

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
                case 0: return '<img class="tnt_resource_icon" title="Wood" src="/cdn/all/both/resources/icon_wood.png">';
                case 1: return '<img class="tnt_resource_icon" title="Wine" src="/cdn/all/both/resources/icon_wine.png">';
                case 2: return '<img class="tnt_resource_icon" title="Marble" src="/cdn/all/both/resources/icon_marble.png">';
                case 3: return '<img class="tnt_resource_icon" title="Crystal" src="/cdn/all/both/resources/icon_crystal.png">';
                case 4: return '<img class="tnt_resource_icon" title="Sulfur" src="/cdn/all/both/resources/icon_sulfur.png">';
                case 'population': return '<img class="tnt_resource_icon tnt_icon_po" title="Population" src="//gf3.geo.gfsrv.net/cdn2f/6d077d68d9ae22f9095515f282a112.png" style="width: 10px !important;">';
                case 'citizens': return '<img class="tnt_resource_icon" title="Citizens" src="/cdn/all/both/resources/icon_population.png">';
                default: return '';
            }
        }
    },

    // Table builder - complete implementation matching working HTML structure
    tableBuilder: {
        buildTable(type) {
            if (type === 'resources') {
                return this.buildResourceTable();
            } else if (type === 'buildings') {
                return this.buildBuildingTable();
            }
            return '';
        },

        buildResourceTable() {
            const cities = tnt.data.storage.city || {};
            const sortedCityIds = tnt.dataCollector.sortCities();
            const settings = tnt.settings.getResourceDisplaySettings();
            const currentCityId = tnt.get.cityId();

            // console.log('[TNT] Building resource table with cities:', Object.keys(cities).length);
            // console.log('[TNT] Current city ID:', currentCityId);

            if (sortedCityIds.length === 0) {
                // console.log('[TNT] No sorted cities available');
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

            // Build the HTML table structure
            let html = '<table id="tnt_resources_table" border="1" style="border-collapse:collapse;font:12px Arial,Helvetica,sans-serif;background-color:#fdf7dd;"><tbody>';

            // Category header row - NO CONTROLS TEXT
            html += '<tr class="tnt_category_header">';
            html += '<th class="tnt_category_header" style="background-color:#DBBE8C;border: 1px solid #000;padding:4px;font-weight:bold;text-align:center;width:60px;"></th>';
            html += `<th colspan="${cityColspan}" class="tnt_category_header" style="background-color:#DBBE8C;border: 1px solid #000;padding:4px;font-weight:bold;text-align:center;">City Info</th>`;
            if (resourcesSpan > 0) {
                html += `<th colspan="${resourcesSpan}" class="tnt_category_header" style="background-color:#DBBE8C;border: 1px solid #000;padding:4px;font-weight:bold;text-align:center;">Resources</th>`;
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
                html += tnt.dataCollector.getIcon('population') + '</th>';
            }
            if (settings.showCitizens) {
                html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
                html += tnt.dataCollector.getIcon('citizens') + '</th>';
            }
            if (settings.showWood) {
                html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
                html += tnt.dataCollector.getIcon(0) + '</th>';
            }
            if (settings.showWine) {
                html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
                html += tnt.dataCollector.getIcon(1) + '</th>';
            }
            if (settings.showMarble) {
                html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
                html += tnt.dataCollector.getIcon(2) + '</th>';
            }
            if (settings.showCrystal) {
                html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
                html += tnt.dataCollector.getIcon(3) + '</th>';
            }
            if (settings.showSulfur) {
                html += '<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
                html += tnt.dataCollector.getIcon(4) + '</th>';
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

                html += `<tr${rowClass}>`;

                // City name cell with progress styling
                html += `<td class="tnt_city tnt_left${progressClass}" style="padding:4px;text-align:left;border:1px solid #000;background-color:#fdf7dd;">`;
                html += `<a href="#" class="tnt_city_link" data-city-id="${cityId}">`;
                html += tnt.dataCollector.getIcon(city.producedTradegood) + ' ' + tnt.get.cityName(cityId);
                html += '</a></td>';

                // Town Hall level
                let townHallLevel = '-';
                if (city.buildings && Array.isArray(city.buildings['townHall']) && city.buildings['townHall'].length > 0) {
                    townHallLevel = city.buildings['townHall'].reduce((acc, b) => acc + (parseInt(b.level) || 0), 0);
                }
                html += `<td class="tnt_building_level" style="padding:4px;text-align:center;border:1px solid #000;background-color:#fdf7dd;">${townHallLevel}</td>`;

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
                    const production = tnt.calc.production(cityId, 24).wine;
                    const fontWeight = city.producedTradegood == 1 ? 'font-weight:bold;' : '';
                    html += `<td class="tnt_wine${cssClass}" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;${fontWeight}"><span title="${production}">${city.wine.toLocaleString()}</span></td>`;
                }
                if (settings.showMarble) {
                    const cssClass = tnt.dataCollector.checkMinMax(city, 2);
                    const production = tnt.calc.production(cityId, 24).marble;
                    const fontWeight = city.producedTradegood == 2 ? 'font-weight:bold;' : '';
                    html += `<td class="tnt_marble${cssClass}" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;${fontWeight}"><span title="${production}">${city.marble.toLocaleString()}</span></td>`;
                }
                if (settings.showCrystal) {
                    const cssClass = tnt.dataCollector.checkMinMax(city, 3);
                    const production = tnt.calc.production(cityId, 24).crystal;
                    const fontWeight = city.producedTradegood == 3 ? 'font-weight:bold;' : '';
                    html += `<td class="tnt_crystal${cssClass}" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;${fontWeight}"><span title="${production}">${city.crystal.toLocaleString()}</span></td>`;
                }
                if (settings.showSulfur) {
                    const cssClass = tnt.dataCollector.checkMinMax(city, 4);
                    const production = tnt.calc.production(cityId, 24).sulfur;
                    const fontWeight = city.producedTradegood == 4 ? 'font-weight:bold;' : '';
                    html += `<td class="tnt_sulfur${cssClass}" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;${fontWeight}"><span title="${production}">${city.sulfur.toLocaleString()}</span></td>`;
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
            html += '</tr>';

            html += '</tbody></table>';
            return html;
        },

        buildBuildingTable() {
            const cities = tnt.data.storage.city || {};
            const sortedCityIds = tnt.dataCollector.sortCities();
            const currentCityId = tnt.get.cityId();
            const buildingDefs = tnt.dataCollector.getBuildingDefinitions();
            const mergedColumns = tnt.dataCollector.getMergedBuildingColumns(buildingDefs);
            const categorySpans = tnt.dataCollector.calculateCategorySpans(mergedColumns);

            if (sortedCityIds.length === 0) {
                return '<div>No city data available</div>';
            }

            let html = '<table id="tnt_buildings_table" border="1" style="border-collapse:collapse;font:12px Arial,Helvetica,sans-serif;background-color:#fdf7dd;"><tbody>';

            // Category header row
            html += '<tr class="tnt_category_header">';
            html += '<th class="tnt_category_header" style="background-color:#DBBE8C;border: 1px solid #000;padding:4px;font-weight:bold;text-align:center;width:60px;"></th>';
            html += '<th class="tnt_category_header" style="background-color:#DBBE8C;border: 1px solid #000;padding:4px;font-weight:bold;text-align:center;">City</th>';
            Object.entries(categorySpans).forEach(([category, span]) => {
                if (span > 0) {
                    let displayName = category.replace(/([A-Z])/g, ' $1')
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                    html += `<th colspan="${span}" class="tnt_category_header" style="background-color:#DBBE8C;border: 1px solid #000;padding:4px;font-weight:bold;text-align:center;">${displayName}</th>`;
                }
            });
            html += '</tr>';

            // Subcategory header row
            html += '<tr class="tnt_subcategory_header">';
            html += '<th class="tnt_center tnt_bold" style="position:relative;text-align:center;padding:4px;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
            html += '<div style="position:relative; min-width:120px; text-align:center;">';
            html += '<span style="display:inline-block; text-align:center; min-width:60px;">City</span>';
            html += '</div></th>';

            // Building column headers
            mergedColumns.forEach(building => {
                if (building.key === 'palaceOrColony') {
                    html += '<th class="tnt_center tnt_bold" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
                    html += `<a href="#" onclick="ajaxHandlerCall('?view=buildingDetail&buildingId=11&helpId=1');return false;" title="Learn more about Palace...">`;
                    html += `<img class="tnt_resource_icon tnt_building_icon" title="Palace" src="${building.icon}">`;
                    html += '</a>';
                    html += `<a href="#" onclick="ajaxHandlerCall('?view=buildingDetail&buildingId=17&helpId=1');return false;" title="Learn more about Governor's Residence...">`;
                    html += `<img class="tnt_resource_icon tnt_building_icon" title="Governor's Residence" src="${building.icon2}">`;
                    html += '</a></th>';
                } else {
                    html += '<th class="tnt_center tnt_bold" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">';
                    html += `<a href="#" onclick="ajaxHandlerCall('?view=buildingDetail&buildingId=${building.buildingId}&helpId=${building.helpId}');return false;" title="Learn more about ${building.name}...">`;
                    html += `<img class="tnt_resource_icon tnt_building_icon" title="${building.name}" src="${building.icon}">`;
                    html += '</a></th>';
                }
            });
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

                // DEBUG: Enhanced logging for visual state tracking (buildings table)
                // console.log(`[TNT DEBUG Buildings] City ${cityId}:`);
                // console.log(`  - Current: ${isCurrentCity}`);
                // console.log(`  - Construction: ${hasConstruction}`);
                // console.log(`  - Visited: ${isVisited}`);
                // console.log(`  - Progress Class: "${progressClass}"`);
                // console.log(`  - Row Class: "${rowClass}"`);

                html += `<tr${rowClass}>`;

                // City name cell with progress styling
                html += `<td class="tnt_city tnt_left${progressClass}" style="padding:4px;text-align:left;border:1px solid #000;background-color:#fdf7dd;">`;
                html += `<a href="#" class="tnt_city_link" data-city-id="${cityId}">`;
                html += tnt.dataCollector.getIcon(city.producedTradegood) + ' ' + tnt.get.cityName(cityId);
                html += '</a></td>';

                // Building level cells
                mergedColumns.forEach(building => {
                    const cityBuildings = city.buildings || {};
                    if (building.key === 'palaceOrColony') {
                        const palaceArr = Array.isArray(cityBuildings['palace']) ? cityBuildings['palace'] : [];
                        const colonyArr = Array.isArray(cityBuildings['palaceColony']) ? cityBuildings['palaceColony'] : [];
                        const buildingData = palaceArr.concat(colonyArr);

                        if (buildingData.length > 0) {
                            const sumLevel = buildingData.reduce((acc, building) => acc + (parseInt(building.level) || 0), 0);
                            const tooltip = buildingData.map(building =>
                                (building.name === 'palace' ? 'Palace' : "Governor's Residence") +
                                ' (Pos ' + building.position + '): lvl ' + building.level
                            ).join('\\n');
                            html += `<td class="tnt_building_level" style="padding:4px;text-align:center;border:1px solid #000;background-color:#fdf7dd;" title="${tooltip.replace(/"/g, '&quot;')}">${sumLevel}</td>`;
                        } else {
                            html += '<td class="tnt_building_level" style="padding:4px;text-align:center;border:1px solid #000;background-color:#fdf7dd;">-</td>';
                        }
                    } else {
                        const arr = cityBuildings[building.key];
                        if (Array.isArray(arr) && arr.length > 0) {
                            const sumLevel = arr.reduce((acc, building) => acc + (building.level || 0), 0);
                            const tooltip = arr.map(building => {
                                let text = 'Pos ' + building.position + ': lvl ' + building.level;
                                if (building.underConstruction) {
                                    text += ' (Upgrading from ' + building.currentLevel + ' to ' + building.targetLevel + ')';
                                }
                                return text;
                            }).join('\\n');
                            const bgColor = arr.some(building => building.underConstruction) ? '#80404050' : '#fdf7dd';
                            html += `<td class="tnt_building_level" style="padding:4px;text-align:center;border:1px solid #000;background-color:${bgColor};" title="${tooltip.replace(/"/g, '&quot;')}">${sumLevel}</td>`;
                        } else {
                            html += '<td class="tnt_building_level" style="padding:4px;text-align:center;border:1px solid #000;background-color:#fdf7dd;"></td>';
                        }
                    }
                });

                html += '</tr>';
            });

            // Total row
            html += '<tr>';
            html += '<td class="tnt_total" style="padding:4px;text-align:left;border:1px solid #000;background-color:#faeac6;font-weight:bold;">Total</td>';
            mergedColumns.forEach(() => {
                html += '<td class="tnt_building_level" style="padding:4px;text-align:center;border:1px solid #000;background-color:#faeac6;"></td>';
            });
            html += '</tr>';

            html += '</tbody></table>';
            return html;
        },

        // Phase 4: Visual progress class determination
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

            // Panel minimize/maximize - target the spans inside the table
            $('.tnt_panel_minimize_btn').off('click').on('click', function () {
                const $panel = $('#tnt_info_resources');
                const $btn = $(this);

                if ($panel.hasClass('minimized')) {
                    $panel.removeClass('minimized');
                    $btn.removeClass('tnt_foreward').addClass('tnt_back');
                } else {
                    $panel.addClass('minimized');
                    $btn.removeClass('tnt_back').addClass('tnt_foreward');
                }
            });

            // Toggle between resources/buildings tables - target the spans inside the table
            $('.tnt_table_toggle_btn').off('click').on('click', function () {
                const $resourceContent = $('#tnt_info_resources_content');
                const $buildingContent = $('#tnt_info_buildings_content');

                if ($resourceContent.is(':visible')) {
                    $resourceContent.hide();
                    $buildingContent.show();
                    $(this).addClass('active');
                } else {
                    $buildingContent.hide();
                    $resourceContent.show();
                    $(this).removeClass('active');
                }
            });

            // Refresh all cities button - target the spans inside the table
            $('.tnt_refresh_btn').off('click').on('click', function () {
                tnt.citySwitcher.start();
            });
        }
    },

    // City switcher module - CLEANER debug version
    citySwitcher: {
        isActive: false,
        startCityId: null,
        visitedCities: [],

        start() {
            this.startCityId = tnt.get.cityId();

            if (!this.startCityId) {
                // console.log('[TNT] Cannot start - no valid city ID detected');
                return;
            }

            this.isActive = true;
            this.visitedCities = [this.startCityId];

            tnt.settings.set("citySwitcherActive", true);
            tnt.settings.set("citySwitcherStartCity", this.startCityId);
            tnt.settings.set("citySwitcherVisited", this.visitedCities);

            // console.log(`[TNT] CitySwitcher STARTED from city: ${this.startCityId}`);

            // Update visual immediately for starting city
            this.updateVisualProgress();

            // Start with 1.5 second delay
            setTimeout(() => {
                this.nextCity();
            }, 1500);
        },

        nextCity() {
            const allCities = Object.keys(tnt.get.cityList());
            // console.log(`[TNT] Looking for next city. Visited: [${this.visitedCities.join(', ')}]`);

            for (const cityId of allCities) {
                if (!this.visitedCities.includes(cityId)) {
                    // console.log(`[TNT] Next city: ${cityId}`);
                    this.switchToCity(cityId);
                    return;
                }
            }

            // console.log('[TNT] All cities visited - ending cycle');
            this.end();
        },

        switchToCity(cityId) {
            // console.log(`[TNT] === SWITCHING TO CITY ${cityId} ===`);

            // Add to visited list BEFORE switching
            if (!this.visitedCities.includes(cityId)) {
                this.visitedCities.push(cityId);
                tnt.settings.set("citySwitcherVisited", this.visitedCities);
                // console.log(`[TNT] Visited list updated: [${this.visitedCities.join(', ')}]`);
            }

            return tnt.utils.switchToCity(cityId);
        },

        end() {
            // console.log(`[TNT] === ENDING - Returning to start city: ${this.startCityId} ===`);

            this.switchToCity(this.startCityId);
            this.isActive = false;
            tnt.settings.set("citySwitcherActive", false);

            // Restore normal state after final switch
            setTimeout(() => {
                // console.log('[TNT] Restoring normal visual state');
                this.restoreNormalVisualState();
            }, 2000);
        },

        updateVisualProgress() {
            // console.log(`[TNT] Visual update - Active: ${this.isActive}, Current: ${tnt.get.cityId()}`);

            if ($('#tnt_info_resources').is(':visible') && $("body").attr("id") === "city") {
                setTimeout(() => {
                    const resourceTable = tnt.tableBuilder.buildTable('resources');
                    $('#tnt_info_resources_content').html(resourceTable);

                    const buildingTable = tnt.tableBuilder.buildTable('buildings');
                    $('#tnt_info_buildings_content').html(buildingTable);

                    tnt.tableBuilder.attachEventHandlers();
                    // console.log('[TNT] Tables updated');
                }, 300);
            }
        },

        restoreNormalVisualState() {
            // console.log('[TNT] === RESTORING NORMAL STATE ===');

            this.visitedCities = [];

            if ($('#tnt_info_resources').is(':visible') && $("body").attr("id") === "city") {
                setTimeout(() => {
                    const resourceTable = tnt.tableBuilder.buildTable('resources');
                    $('#tnt_info_resources_content').html(resourceTable);

                    const buildingTable = tnt.tableBuilder.buildTable('buildings');
                    $('#tnt_info_buildings_content').html(buildingTable);

                    tnt.tableBuilder.attachEventHandlers();
                    // console.log('[TNT] Normal state restored');
                }, 300);
            }
        },

        checkAndContinue() {
            const isActive = tnt.settings.get("citySwitcherActive", false);

            if (isActive) {
                const visitedCities = tnt.settings.get("citySwitcherVisited", []);

                if (visitedCities.length > 1) {
                    // console.log('[TNT] Continuing citySwitcher cycle');
                    this.isActive = true;
                    this.startCityId = tnt.settings.get("citySwitcherStartCity");
                    this.visitedCities = visitedCities;

                    this.updateVisualProgress();

                    // 2 second delay between city switches
                    setTimeout(() => {
                        this.nextCity();
                    }, 100);
                } else {
                    // console.log('[TNT] Direct navigation detected - stopping citySwitcher');
                    this.isActive = false;
                    tnt.settings.set("citySwitcherActive", false);
                    this.restoreNormalVisualState();
                }
            }
        }
    },

    // BEGIN: DO NOT MODIFY - Fixed logic
    // Legacy compatibility - Here all the communication with Ikariam is handled
    // Should only be changed by the core team
    // These has to work for the rest of the code to work properly. We keep them here so we only have to change them in one place.

    get: {
        playerId: () => tnt.game.player.getId(),
        cityId() {
            // Method 1: From URL parameters (most reliable during city switches)
            const urlParams = new URLSearchParams(window.location.search);
            const urlCityId = urlParams.get('cityId') || urlParams.get('currentCityId');

            if (urlCityId && urlCityId !== 'undefined' && urlCityId !== '') {
                return urlCityId;
            }

            // Method 2: From Ikariam model
            let modelCityId;
            try {
                modelCityId = ikariam.model.relatedCityData.selectedCity.replace(/[^\d-]+/g, "");
                if (modelCityId && modelCityId !== 'undefined' && modelCityId !== '') {
                    return modelCityId;
                }
            } catch (e) {
                // Continue to next method
            }

            // Method 3: From global menu (fallback)
            const menuCityId = $('#js_GlobalMenu_citySelect').attr('name');
            if (menuCityId && menuCityId !== 'undefined' && menuCityId !== '') {
                return menuCityId;
            }

            // Method 4: Fallback to first city from city list
            const cities = this.cityList();
            const cityIds = Object.keys(cities);
            if (cityIds.length > 0) {
                // Clean up debug logging
                // tnt.core.debug.log('Using fallback city ID: ' + cityIds[0]);
                return cityIds[0];
            }

            // Clean up debug logging - only log real errors
            console.warn('TNT: No valid city ID found');
            return null;
        },

        cityLvl: () => tnt.game.city.getLevel(),
        cityIslandCoords: () => tnt.game.city.getCoordinates(),
        cityName: (id) => tnt.game.city.getName(id),
        producedTradegood: () => tnt.game.city.getProducedTradegood(),
        cityList: () => tnt.game.city.getList(),

        alliance: {
            Id: () => tnt.game.player.getAlliance().id
        },

        transporters: {
            free: () => tnt.game.military.getTransporters().free,
            max: () => tnt.game.military.getTransporters().max
        },

        resources: {
            wood: () => tnt.game.resources.getCurrent().wood,
            wine: () => tnt.game.resources.getCurrent().wine,
            marble: () => tnt.game.resources.getCurrent().marble,
            crystal: () => tnt.game.resources.getCurrent().crystal,
            sulfur: () => tnt.game.resources.getCurrent().sulfur
        },

        population: () => tnt.game.resources.getCurrent().population,
        citizens: () => tnt.game.resources.getCurrent().citizens,
        income: () => tnt.game.economy.getFinances().income,
        upkeep: () => tnt.game.economy.getFinances().upkeep,
        scientistsUpkeep: () => tnt.game.economy.getFinances().scientistsUpkeep,
        godGoldResult: () => tnt.game.economy.getFinances().godGoldResult,
        resourceProduction: () => tnt.game.resources.getProduction().resource,
        tradegoodProduction: () => tnt.game.resources.getProduction().tradegood,
        hasAlly: () => tnt.game.player.getAlliance().hasAlly,
        maxCapacity: () => tnt.game.resources.getCapacity().max,
        wineSpending: () => tnt.game.resources.getCapacity().wineSpending,
        construction: () => tnt.utils.hasConstruction()
    },

    // Add missing calc object that tableBuilder expects
    calc: {
        production: (cityID, hours) => tnt.utils.calculateProduction(cityID, hours)
    },

    // Add missing has object 
    has: {
        construction: () => tnt.utils.hasConstruction()
    }
};

// END: DO NOT MODIFY - Fixed logic

// Initialize the TNT core
$(document).ready(() => tnt.core.init());

// Apply styles at the end
GM_addStyle(TNT_STYLES);