// ==UserScript==
// @name         TNT Collection (dev)
// @version      2.1.1-dev.51
// @namespace    https://github.com/TheNorthman/tnt.collection
// @author       Ronny
// @description  Ikariam TNT Collection Tools
// @license      MIT
// @include      http*s*.ikariam.*/*
// @exclude      http*support*.ikariam.*/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @downloadURL  https://raw.githubusercontent.com/TheNorthman/tnt.collection/dev/dist/tnt.collection.user.js
// @updateURL    https://raw.githubusercontent.com/TheNorthman/tnt.collection/dev/dist/tnt.collection.user.js
// @homepageURL  https://github.com/TheNorthman/tnt.collection
// @supportURL   https://github.com/TheNorthman/tnt.collection/issues
// ==/UserScript==
// --- core.js ---

// Initialize the tntConsole
const tntConsole = Object.assign({}, window.console);

// Move large data blocks to separate internal modules for better organization
const TNT_BUILDING_DEFINITIONS = Object.freeze([
    // Government
    { key: 'townHall', name: 'Town Hall', viewName: 'townHall', icon: '/cdn/all/both/img/city/townhall_l.png', buildingId: 0, helpId: 1, maxedLvl: 32, category: 'government' },
    { key: 'palace', name: 'Palace', viewName: 'palace', icon: '/cdn/all/both/img/city/palace_l.png', buildingId: 11, helpId: 1, maxedLvl: 12, category: 'government' },
    { key: 'palaceColony', name: 'Governor\'s Residence', viewName: 'palaceColony', icon: '/cdn/all/both/img/city/palaceColony_l.png', buildingId: 17, helpId: 1, maxedLvl: 12, category: 'government' },
    { key: 'embassy', name: 'Embassy', viewName: 'embassy', icon: '/cdn/all/both/img/city/embassy_l.png', buildingId: 12, helpId: 1, category: 'government' },
    { key: 'chronosForge', name: 'Chronos\' Forge', viewName: 'chronosForge', icon: '/cdn/all/both/img/city/chronosForge_l.png', buildingId: 35, helpId: 1, maxedLvl: 4, category: 'government' },

    // Resource storage
    { key: 'warehouse', name: 'Warehouse', viewName: 'warehouse', icon: '/cdn/all/both/img/city/warehouse_l.png', buildingId: 7, helpId: 1, maxedLvl: 24, category: 'trade' },
    { key: 'dump', name: 'Depot', viewName: 'dump', icon: '/cdn/all/both/img/city/dump_l.png', buildingId: 29, helpId: 1, maxedLvl: 24, category: 'trade' },

    // Trade & Diplomacy
    { key: 'port', name: 'Trading Port', viewName: 'port', icon: '/cdn/all/both/img/city/port_l.png', buildingId: 3, helpId: 1, maxedLvl: 24, category: 'trade' },
    { key: 'dockyard', name: 'Dockyard', viewName: 'dockyard', icon: '/cdn/all/both/img/city/dockyard_l.png', buildingId: 33, helpId: 1, maxedLvl: 3, category: 'trade' },
    { key: 'marineChartArchive', name: 'Sea Chart Archive', viewName: 'marineChartArchive', icon: '/cdn/all/both/img/city/marinechartarchive_l.png', buildingId: 32, helpId: 1, maxedLvl: 18, category: 'trade' },
    { key: 'branchOffice', name: 'Trading Post', viewName: 'tradingPost', icon: '/cdn/all/both/img/city/branchoffice_l.png', buildingId: 13, helpId: 1, maxedLvl: 20, category: 'trade' },

    // Culture & Research
    { key: 'academy', name: 'Academy', viewName: 'academy', icon: '/cdn/all/both/img/city/academy_l.png', buildingId: 4, helpId: 1, maxedLvl: 24, category: 'culture' },
    { key: 'museum', name: 'Museum', viewName: 'museum', icon: '/cdn/all/both/img/city/museum_l.png', buildingId: 10, helpId: 1, maxedLvl: 21, category: 'culture' },
    { key: 'tavern', name: 'Tavern', viewName: 'tavern', icon: '/cdn/all/both/img/city/taverne_l.png', buildingId: 9, helpId: 1, maxedLvl: 32, category: 'culture' },
    { key: 'temple', name: 'Temple', viewName: 'temple', icon: '/cdn/all/both/img/city/temple_l.png', buildingId: 28, helpId: 1, maxedLvl: 24, category: 'culture' },
    { key: 'shrineOfOlympus', name: 'Gods\' Shrine', viewName: 'shrineOfOlympus', icon: '/cdn/all/both/img/city/shrineOfOlympus_l.png', buildingId: 34, helpId: 1, maxedLvl: 20, category: 'culture' },

    // Resource reducers
    { key: 'carpentering', name: 'Carpenter', viewName: 'carpentering', icon: '/cdn/all/both/img/city/carpentering_l.png', buildingId: 23, helpId: 1, maxedLvl: 50, category: 'resourceReducer' },
    { key: 'architect', name: 'Architect\'s Office', viewName: 'architect', icon: '/cdn/all/both/img/city/architect_l.png', buildingId: 24, helpId: 1, maxedLvl: 50, category: 'resourceReducer' },
    { key: 'vineyard', name: 'Wine Press', viewName: 'vineyard', icon: '/cdn/all/both/img/city/vineyard_l.png', buildingId: 26, helpId: 1, maxedLvl: 50, category: 'resourceReducer' },
    { key: 'optician', name: 'Optician', viewName: 'optician', icon: '/cdn/all/both/img/city/optician_l.png', buildingId: 25, helpId: 1, maxedLvl: 50, category: 'resourceReducer' },
    { key: 'fireworker', name: 'Firework Test Area', viewName: 'fireworker', icon: '/cdn/all/both/img/city/fireworker_l.png', buildingId: 27, helpId: 1, maxedLvl: 50, category: 'resourceReducer' },

    // Resource enhancers
    { key: 'forester', name: 'Forester\'s House', viewName: 'forester', icon: '/cdn/all/both/img/city/forester_l.png', buildingId: 18, helpId: 1, maxedLvl: 30, category: 'resourceEnhancer' },
    { key: 'stonemason', name: 'Stonemason', viewName: 'stonemason', icon: '/cdn/all/both/img/city/stonemason_l.png', buildingId: 19, helpId: 1, maxedLvl: 30, category: 'resourceEnhancer' },
    { key: 'winegrower', name: 'Winegrower', viewName: 'winegrower', icon: '/cdn/all/both/img/city/winegrower_l.png', buildingId: 21, helpId: 1, maxedLvl: 30, category: 'resourceEnhancer' },
    { key: 'glassblowing', name: 'Glassblower', viewName: 'glassblowing', icon: '/cdn/all/both/img/city/glassblowing_l.png', buildingId: 20, helpId: 1, maxedLvl: 30, category: 'resourceEnhancer' },
    { key: 'alchemist', name: 'Alchemist\'s Tower', viewName: 'alchemist', icon: '/cdn/all/both/img/city/alchemist_l.png', buildingId: 22, helpId: 1, maxedLvl: 30, category: 'resourceEnhancer' },

    // Military
    { key: 'wall', name: 'Wall', viewName: 'wall', icon: '/cdn/all/both/img/city/wall.png', buildingId: 8, helpId: 1, maxedLvl: 32, category: 'military' },
    { key: 'barracks', name: 'Barracks', viewName: 'barracks', icon: '/cdn/all/both/img/city/barracks_l.png', buildingId: 6, helpId: 1, maxedLvl: 32, category: 'military' },
    { key: 'safehouse', name: 'Hideout', viewName: 'safehouse', icon: '/cdn/all/both/img/city/safehouse_l.png', buildingId: 16, helpId: 1, maxedLvl: 42, category: 'military' },
    { key: 'workshop', name: 'Workshop', viewName: 'workshop', icon: '/cdn/all/both/img/city/workshop_l.png', buildingId: 15, helpId: 1, maxedLvl: 32, category: 'military' },
    { key: 'shipyard', name: 'Shipyard', viewName: 'shipyard', icon: '/cdn/all/both/img/city/shipyard_l.png', buildingId: 5, helpId: 1, maxedLvl: 32, category: 'military' },

    // Special buildings
    { key: 'pirateFortress', name: 'Pirate Fortress', viewName: 'pirateFortress', icon: '/cdn/all/both/img/city/pirateFortress_l.png', buildingId: 30, helpId: 1, category: 'special' },
    { key: 'blackMarket', name: 'Black Market', viewName: 'blackMarket', icon: '/cdn/all/both/img/city/blackmarket_l.png', buildingId: 31, helpId: 1, category: 'special' }
]);

// validBuildingTypes is always in sync with TNT_BUILDING_DEFINITIONS
const validBuildingTypes = Object.freeze(TNT_BUILDING_DEFINITIONS.map(b => b.key));

const TNT_TOOLTIP_TEMPLATES = {
    resource: {
        header: {
            wood: {
                title: 'Wood',
                body: 'Production:<br><span class="tnt_tooltip_indent">1h: {1hwood}</span><br><span class="tnt_tooltip_indent">24h: {24hwood}</span><br>'
            },
            wine: {
                title: 'Wine',
                body: 'Production:<br><span class="tnt_tooltip_indent">1h: {1hwine}</span><br><span class="tnt_tooltip_indent">24h: {24hwine}</span><br>Luxury good consumed in Taverns to keep citizens happy.<br>Produced by Winegrowers.'
            },
            marble: {
                title: 'Marble',
                body: 'Production:<br><span class="tnt_tooltip_indent">1h: {1hmarble}</span><br><span class="tnt_tooltip_indent">24h: {24hmarble}</span><br>Used for structural buildings and town upgrades.<br>Supplied by Stonemasons.'
            },
            crystal: {
                title: 'Crystal Glass',
                body: 'Production:<br><span class="tnt_tooltip_indent">1h: {1hcrystal}</span><br><span class="tnt_tooltip_indent">24h: {24hcrystal}</span><br>Essential for research and scientific progress.<br>Refined by Opticians.'
            },
            sulfur: {
                title: 'Sulfur',
                body: 'Production:<br><span class="tnt_tooltip_indent">1h: {1hsulfur}</span><br><span class="tnt_tooltip_indent">24h: {24hsulfur}</span><br>Powerful military resource used to create weapons and explosives.<br>Extracted by Fireworkers.'
            },
            population: {
                title: 'Population',
                body: 'Total inhabitants of your city.<br>Affects growth, tax income, and workforce availability.'
            },
            citizens: {
                title: 'Citizens',
                body: 'Free population available for jobs,<br>research, or military service.'
            }
        },
        cell: {
            wood: {
                title: 'Wood',
                body: '{cityName} wood: {value}'
            },
            wine: {
                title: 'Wine',
                body: '{cityName} wine: {value}'
            },
            marble: {
                title: 'Marble',
                body: '{cityName} marble: {value}'
            },
            crystal: {
                title: 'Crystal',
                body: '{cityName} crystal: {value}'
            },
            sulfur: {
                title: 'Sulfur',
                body: '{cityName} sulfur: {value}'
            },
            population: {
                title: 'Population',
                body: '{cityName} population: {value}'
            },
            citizens: {
                title: 'Citizens',
                body: '{cityName} citizens: {value}'
            }
        }
    },
    building: {
        header: {
            default: {
                title: '{buildingName}',
                body: 'Max Level: {maxedLvl}'
            }
        },
        cell: {
            default: {
                title: '{buildingName} - {cityName}',
                body: 'Status {statusText}'
            }
        }
    }
};

const template = Object.freeze({
    resources: `
        <div id="tnt_info_resources">
            <div id="tnt_info_resources_content"></div>
            <div id="tnt_info_buildings_content" style="display:none;"></div>
        </div>
    `
});

const TNT_STYLES = `
`;

const tnt = {

    version: GM_info.script.version,

    template, // Add template to tnt object

    delay: (time) => new Promise(resolve => setTimeout(resolve, time)),

    // Settings module - manage user settings
    settings: {
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

        // Get persistent per-building max-level (editable by user)
        getMaxedLvl(buildingType) {
            if (!tnt.data.storage.settings) return 0;
            const maxed = tnt.data.storage.settings.maxedLvl || {};
            if (buildingType === 'palaceOrColony') {
                if (maxed && typeof maxed[buildingType] !== 'undefined' && maxed[buildingType] !== null) {
                    const parsed = parseInt(maxed[buildingType], 10);
                    if (!isNaN(parsed) && parsed >= 0) return parsed;
                }
                const p = this.getMaxedLvl('palace');
                const c = this.getMaxedLvl('palaceColony');
                return Math.max(p, c);
            }

            if (maxed && typeof maxed[buildingType] !== 'undefined' && maxed[buildingType] !== null) {
                const parsed = parseInt(maxed[buildingType], 10);
                if (!isNaN(parsed) && parsed >= 0) return parsed;
            }

            const def = TNT_BUILDING_DEFINITIONS.find(b => b.key === buildingType);
            return def && def.maxedLvl ? def.maxedLvl : 0;
        },

        resetMaxedLvl(buildingType) {
            if (!tnt.data.storage.settings || !tnt.data.storage.settings.maxedLvl) return;
            const maxed = tnt.data.storage.settings.maxedLvl;
            if (buildingType === 'palaceOrColony') {
                delete maxed.palace;
                delete maxed.palaceColony;
                delete maxed.palaceOrColony;
            } else {
                delete maxed[buildingType];
            }
            tnt.core.storage.save();
        },

        setMaxedLvl(buildingType, value) {
            if (!tnt.data.storage.settings) {
                tnt.data.storage.settings = {};
            }
            if (!tnt.data.storage.settings.maxedLvl) {
                tnt.data.storage.settings.maxedLvl = {};
            }

            // empty means reset to default
            if (value === '' || value === null || typeof value === 'undefined') {
                this.resetMaxedLvl(buildingType);
                return;
            }

            const parsed = parseInt(value, 10);
            if (isNaN(parsed) || parsed < 0) {
                this.resetMaxedLvl(buildingType);
            } else {
                // remove override if equal final default (reduces stored state)
                const def = this.getMaxedLvl(buildingType);
                if (parsed === def) {
                    this.resetMaxedLvl(buildingType);
                } else {
                    tnt.data.storage.settings.maxedLvl[buildingType] = parsed;
                }
            }
            tnt.core.storage.save();
        },

        // Get layout preferences
        getLayoutPrefs() {
            return this.get("layoutPrefs", {
                maintainLayout: false,
                url: "",
                layout: null
            });
        },

        // Set layout preferences
        setLayoutPrefs(prefs) {
            this.set("layoutPrefs", prefs);
        },

        // Clear layout preferences
        clearLayoutPrefs() {
            this.set("layoutPrefs", {
                maintainLayout: false,
                url: "",
                layout: null
            });
        },

        // Parse Ikariam URL and extract layout parameters
        parseLayoutFromUrl(url) {
            try {
                const urlObj = new URL(url);
                const params = urlObj.searchParams;

                // Extract layout parameters
                const layout = {
                    citymap: {},
                    mainbox: {},
                    sidebar: {}
                };

                // City map (offsets and zoom)
                const cityTop = params.get('cityTop');
                const cityLeft = params.get('cityLeft');
                const cityWorldviewScale = params.get('cityWorldviewScale');
                if (cityTop) layout.citymap.top = parseInt(cityTop.replace('px', ''));
                if (cityLeft) layout.citymap.left = parseInt(cityLeft.replace('px', ''));
                if (cityWorldviewScale) layout.citymap.zoom = parseFloat(cityWorldviewScale);

                // Mainbox parameters
                const mainboxX = params.get('mainbox_x');
                const mainboxY = params.get('mainbox_y');
                const mainboxZ = params.get('mainbox_z');
                if (mainboxX) layout.mainbox.x = parseInt(mainboxX);
                if (mainboxY) layout.mainbox.y = parseInt(mainboxY);
                if (mainboxZ) layout.mainbox.z = parseInt(mainboxZ);

                // Sidebar parameters
                const sidebarX = params.get('sidebar_x');
                const sidebarY = params.get('sidebar_y');
                const sidebarZ = params.get('sidebar_z');
                if (sidebarX) layout.sidebar.x = parseInt(sidebarX);
                if (sidebarY) layout.sidebar.y = parseInt(sidebarY);
                if (sidebarZ) layout.sidebar.z = parseInt(sidebarZ);

                return layout;
            } catch (e) {
                tnt.core.debug.warn('TNT: Failed to parse layout URL: ' + e.message, 3);
                return null;
            }
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

        // Validate if URL is a valid Ikariam URL
        isValidIkariamUrl(url) {
            try {
                const urlObj = new URL(url);
                return urlObj.hostname.includes('ikariam') &&
                    urlObj.hostname.includes('gameforge.com');
            } catch (e) {
                return false;
            }
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
                "debugEnabled": true,
                "layoutPrefs": {
                    maintainLayout: false,
                    url: "",
                    layout: null
                }
            };

            // Initialize defaults for any missing settings
            Object.entries(defaults).forEach(([key, defaultValue]) => {
                if (this.get(key) === undefined) {
                    this.set(key, defaultValue);
                }
            });

            // Ensure maxedLvl mapping exists
            if (!this.get("maxedLvl")) {
                this.set("maxedLvl", {});
            }

            this.set("version", tnt.version);
        }
    },

    // Main data structure to hold all data
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

    // IMPORTANT: Common functionality that runs on all pages
    all() {
        // Common functionality that runs on all pages
        const settings = this.settings.getFeatureSettings();

        // Apply global UI modifications
        if (settings.removePremiumOffers) {
            $('.premiumOfferBox').hide();
        }
    },

    // IMPORTANT: City-specific functionality
    city() {
        // Apply city-specific modifications
        tnt.ui.applyUIModifications();

        // Apply layout after DOM is rendered. This set mainbox to user defined position, if enabled, so it has effect before dialogs are opened
        tnt.utils.applyLayoutDirectly();
    },

    // IMPORTANT: Island-specific functionality
    island() {
        // Island-specific functionality
        tnt.core.debug.log('[TNT] Island view loaded');

        // Show city levels if setting is enabled
        if (tnt.settings.get("islandShowCityLvl", true)) {
            tnt.utils.displayCityLevels();
        }
    },

    // IMPORTANT: World-specific functionality
    world() {
        // World map specific functionality
        tnt.core.debug.log('[TNT] World map loaded');

        // Apply UI modifications for world map - Found in Ikariam Map Enhancer
        $('.cities').each(function () {
            if (this.innerText === "0") {
                $(this).parent().css('opacity', 0.5);
            } else {
                $(this).parent().css('opacity', 1);
            }
        });
        $('.own, .ally').css('filter', 'drop-shadow(0px 10px 4px #000)');
        $('.piracyInRange').css('opacity', 0.75);
    },

    // Initialize the core module
    core: {
        init() {
            // Initialize our debug system first so any debug logs from storage initialization are captured
            if (tnt.debug && typeof tnt.debug.init === 'function') {
                tnt.debug.init();
            }

            // We need to init the storage before anything else, so tnt.core.debug has its settings available
            tnt.core.storage.init();

            // Log the initialization
            tnt.core.debug.log(`TNT Collection v${tnt.version} - Init...`, 1);

            // We run events.init() first to overwrite the default Ikariam events as early as possible
            tnt.core.events.init();

            // Initialize all core components
            tnt.core.notification.init();
            tnt.core.options.init();

            // Collect city data
            tnt.dataCollector.update();
            tnt.dataCollector.show();

            // Apply UI modifications
            tnt.ui.applyUIModifications();

            // Apply global styles
            tnt.all();

            // Check if city switcher is active, and continue if so.
            tnt.citySwitcher.checkAndContinue();

            switch ($("body").attr("id")) {
                case "island": tnt.island(); break;
                case "city": tnt.city(); break;
                case "worldmap_iso": tnt.world(); break;
            }
        },

        // AJAX helper - Not used at the moment, but can be used for future AJAX requests
        ajax: {
            send(data, url = tnt.url.update, callback = null) {
                // Remove noisy debug logging
                tnt.core.debug.log('[TNT] Ajax call data length: ' + JSON.stringify(data).length, 3);
                GM_xmlhttpRequest({
                    url, method: 'POST',
                    data: "data=" + encodeURIComponent(JSON.stringify(data)),
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    onload: resp => {
                        if (callback) callback();
                    },
                    onerror: (error) => {
                        // Keep error logging but make it cleaner
                        tnt.core.debug.error("[TNT] AJAX Error: " + error.message, 1);
                    }
                });
            }
        },

        debug: {
            log(...args) {
                if (tnt.debug && typeof tnt.debug.log === 'function') {
                    return tnt.debug.log(...args);
                }
            },
            info(...args) {
                if (tnt.debug && typeof tnt.debug.info === 'function') {
                    return tnt.debug.info(...args);
                }
            },
            warn(...args) {
                if (tnt.debug && typeof tnt.debug.warn === 'function') {
                    return tnt.debug.warn(...args);
                }
            },
            error(...args) {
                if (tnt.debug && typeof tnt.debug.error === 'function') {
                    return tnt.debug.error(...args);
                }
            },
            dir(...args) {
                if (tnt.debug && typeof tnt.debug.dir === 'function') {
                    return tnt.debug.dir(...args);
                }
            },
            clear() {
                if (tnt.debug && typeof tnt.debug.clear === 'function') {
                    return tnt.debug.clear();
                }
            }
        },

        storage: {
            init() {
                const scriptStartTime = performance.now();

                try {
                    const storedData = localStorage.getItem("tnt_storage");

                    if (storedData) {
                        const parsedData = JSON.parse(storedData);
                        const storedVersion = parsedData.version;

                        // Enhanced version check - detect structure compatibility
                        if (storedVersion === tnt.version) {
                            // Same version - use existing data
                            tnt.data.storage = $.extend(true, {}, tnt.data.storage, parsedData);
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

                                // Log timing information
                                tnt.core.debug.log(`[TNT Timing] Script start: ${scriptStartTime.toFixed(2)}ms`, 2);
                                tnt.core.debug.log(`[TNT Timing] Storage parsed: ${(performance.now() - scriptStartTime).toFixed(2)}ms`, 2);
                            } else {
                                // Reset to clean defaults with current version
                                tnt.data.storage.version = tnt.version;
                                tnt.core.storage.save();

                                // Smart auto-start data collection with 200ms delay
                                setTimeout(() => {
                                    const cityList = tnt.get.player.list.cities();
                                    const cityCount = Object.keys(cityList).length;

                                    if (cityCount > 1) {
                                        // Multiple cities - start city switcher
                                        tnt.citySwitcher.start();
                                    } else if (cityCount === 1) {
                                        // Single city - just collect current city data
                                        tnt.dataCollector.update();
                                    }
                                }, 200);
                            }
                        }
                    } else {
                        // No existing storage - new user
                        tnt.data.storage.version = tnt.version;
                        tnt.core.storage.save();

                        // Smart auto-start for new users with 200ms delay
                        setTimeout(() => {
                            const cityList = tnt.get.player.list.cities();
                            const cityCount = Object.keys(cityList).length;

                            if (cityCount > 1) {
                                // Multiple cities - start city switcher
                                tnt.citySwitcher.start();
                            } else if (cityCount === 1) {
                                // Single city - just collect current city data
                                tnt.dataCollector.update();
                            }
                        }, 200);
                    }

                    // Check when city list becomes available
                    const cityList = tnt.get.player.list.cities();

                } catch (e) {
                    tnt.core.debug.log("Error parsing tnt_storage: " + e.message, 1);

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
                // Disable notifications for now
                return;
            }
        },

        events: {
            init() {
                // Check if ajax and ajax.Responder exist before overriding
                if (typeof ajax !== 'undefined' && ajax.Responder) {
                    tnt.core.debug.log('[TNT] Ajax responder available, applying override', 2);
                    tnt.core.events.ikariam.override();
                } else {
                    tnt.core.debug.log('[TNT] Ajax responder not available, skipping override', 2);
                }
            },
            ikariam: {
                override() {
                    // updateGlobalData = Move this into its own function
                    ajax.Responder.tntUpdateGlobalData = ajax.Responder.updateGlobalData;
                    ajax.Responder.updateGlobalData = function (response) {

                        var view = $('body').attr('id');
                        tnt.core.debug.warn("[TNT] updateGlobalData (View: " + view + ")", 4);

                        // Let Ikariam do its stuff
                        ajax.Responder.tntUpdateGlobalData(response);

                        // Check notifications
                        tnt.core.notification.check();

                        // Collect data
                        tnt.dataCollector.update();
                        tnt.dataCollector.show();

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

                        // Apply removeFlyingShop/sidebar slots removal, during background updates
                        if (view === "city") {
                            tnt.ui.applyUIModifications();
                        }

                        switch (view) {
                            case "worldmap_iso":
                                tnt.core.debug.log($('worldmap_iso: div.islandTile div.cities'), 3);
                                break;
                            case "city":
                                break;
                            case "plunder":
                            case "deploymentFleet":
                            case "deployment":
                            case "plunderFleet":
                                // Select all units when pillaging
                                setTimeout(() => {
                                    // Set all units to max
                                    $('#selectArmy .setMax').trigger("click");
                                    $('#fleetDeploymentForm .setMax').trigger("click");

                                    // Set extra transporters to available count
                                    const freeTransporters = parseInt($("#js_GlobalMenu_freeTransporters").text()) || 0;
                                    $('#extraTransporter').val(freeTransporters);
                                }, 1500);
                                break;
                            case 'tradeAdvisor':
                                tnt.core.debug.log("tradeAdvisor", 3);
                                break;
                        }
                    }

                    // changeView = Move this into its own function
                    ajax.Responder.tntChangeView = ajax.Responder.changeView;
                    ajax.Responder.changeView = function (response) {
                        tnt.core.debug.log("I'm here!");
                        var view = $('body').attr('id');

                        // Set early Ikariam properties before rendering
                        try {
                            if (ikariam.templateView && ikariam.templateView.id === "city") {
                                const layoutPrefs = tnt.data.storage.settings.layoutPrefs;
                                if (layoutPrefs && layoutPrefs.maintainLayout && layoutPrefs.layout) {
                                    const layout = layoutPrefs.layout;
                                    // Defensive null checks
                                    // if (layout.mainbox) {
                                    //     if (typeof layout.mainbox.x === 'number') ikariam.mainbox_x = layout.mainbox.x;
                                    //     if (typeof layout.mainbox.y === 'number') ikariam.mainbox_y = layout.mainbox.y;
                                    //     if (typeof layout.mainbox.z === 'number') ikariam.mainbox_z = layout.mainbox.z;
                                    //     tnt.core.debug.log("Setting mainbox position to: " + ikariam.mainbox_x + ", " + ikariam.mainbox_y + ", " + ikariam.mainbox_z, 3);
                                    // }
                                    // if (layout.sidebar) {
                                    //     if (typeof layout.sidebar.x === 'number') ikariam.sidebar_x = layout.sidebar.x;
                                    //     if (typeof layout.sidebar.y === 'number') ikariam.sidebar_y = layout.sidebar.y;
                                    //     if (typeof layout.sidebar.z === 'number') ikariam.sidebar_z = layout.sidebar.z;
                                    //     tnt.core.debug.log("Setting sidebar position to: " + ikariam.sidebar_x + ", " + ikariam.sidebar_y + ", " + ikariam.sidebar_z, 3);
                                    // }
                                    // if (layout.citymap && typeof layout.citymap.zoom === 'number') {
                                    //     localStorage.setItem('cityWorldviewScale', layout.citymap.zoom.toString());
                                    // }
                                }
                            }
                        } catch (e) {
                            // Defensive: ignore errors
                        }

                        tnt.core.debug.log("changeView (View: " + view + ")", 3);

                        // Let Ikariam do its stuff
                        ajax.Responder.tntChangeView(response);

                        // Apply layout with inline styles after rendering
                        try {
                            if (ikariam.templateView && ikariam.templateView.id === "city") {
                                tnt.utils.applyLayoutDirectly();
                            }
                        } catch (e) { }

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
                                    pulldownAll();
                                    tnt.core.debug.log('btn');
                                }, 5000);
                                break;
                            case "plunder":
                            case "deployment":
                            case "plunderFleet":
                                // Wait for dialog to be ready
                                setTimeout(() => {
                                    // Select all units
                                    $('#selectArmy .assignUnits .setMax').trigger("click");
                                    $('#fleetDeploymentForm .setMax').trigger("click");

                                    // Set initial transporter count
                                    const freeTransporters = tnt.get.military.transporters.free();
                                    $('#extraTransporter').val(freeTransporters);

                                    // Prevent 0 transporters when min is clicked
                                    $('#selectArmy .assignUnits .setMin').on('click', function () {
                                        if (parseInt($('#extraTransporter').val()) === 0) {
                                            $('#extraTransporter').val(freeTransporters);
                                        }
                                    });
                                }, 1200);
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


    // BEGIN: DO NOT MODIFY - Fixed logic
    // Legacy compatibility - Here all the communication with Ikariam is handled
    // Should only be changed by the core team
    // These has to work for the rest of the code to work properly. We keep them here so we only have to change them in one place.
    get: {
        // Player data
        player: {
            id: () => tnt.utils.safeGet(() => parseInt(ikariam.model.avatarId), 0),
            alliance: {
                id: () => tnt.utils.safeGet(() => parseInt(ikariam.model.avatarAllyId), 0),
                hasAlly: () => tnt.utils.safeGet(() => ikariam.model.hasAlly, false)
            },
            economy: {
                gold: () => tnt.utils.safeGet(() => parseInt(ikariam.model.gold), 0),
                ambrosia: () => tnt.utils.safeGet(() => ikariam.model.ambrosia, 0),
                income: () => tnt.utils.safeGet(() => ikariam.model.income, 0),
                upkeep: () => tnt.utils.safeGet(() => ikariam.model.upkeep, 0),
                scientistsUpkeep: () => tnt.utils.safeGet(() => ikariam.model.sciencetistsUpkeep, 0),
                godGoldResult: () => tnt.utils.safeGet(() => ikariam.model.godGoldResult, 0)
            },
            list: {
                cities: () => tnt.utils.safeGet(() => {
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
                }, {})
            }
        },

        // City data
        city: {
            id: () => {
                const urlParams = new URLSearchParams(window.location.search);
                const urlCityId = urlParams.get('cityId') || urlParams.get('currentCityId');
                if (urlCityId && urlCityId !== 'undefined') return urlCityId;

                try {
                    const modelCityId = ikariam.model.relatedCityData.selectedCity.replace(/[^\d-]+/g, "");
                    if (modelCityId && modelCityId !== 'undefined') return modelCityId;
                } catch (e) { }

                const menuCityId = $('#js_GlobalMenu_citySelect').attr('name');
                if (menuCityId && menuCityId !== 'undefined') return menuCityId;

                const cities = tnt.get.player.list.cities();
                const cityIds = Object.keys(cities);
                if (cityIds.length > 0) return cityIds[0];

                tnt.core.debug.warn('TNT: No valid city ID found', 3);
                return null;
            },
            name: (id) => tnt.utils.safeGet(() => {
                if (id) return ikariam.model.relatedCityData["city_" + id].name;
                return $("#citySelect option:selected").text().split("] ")[1];
            }, "Unknown City"),

            coords: () => $("#js_islandBreadCoords").text(),

            tradegood: () => tnt.utils.safeGet(() => ikariam.model.producedTradegood, 0),

            level: () => $("#js_CityPosition0Level").text(),

            resources: {
                wood: () => tnt.utils.safeGet(() => ikariam.model.currentResources.resource, 0),
                wine: () => tnt.utils.safeGet(() => ikariam.model.currentResources[1], 0),
                marble: () => tnt.utils.safeGet(() => ikariam.model.currentResources[2], 0),
                crystal: () => tnt.utils.safeGet(() => ikariam.model.currentResources[3], 0),
                sulfur: () => tnt.utils.safeGet(() => ikariam.model.currentResources[4], 0),
                population: () => tnt.utils.safeGet(() => ikariam.model.currentResources.population, 0),
                citizens: () => tnt.utils.safeGet(() => ikariam.model.currentResources.citizens, 0),
                max: () => tnt.utils.safeGet(() => ikariam.model.maxResources.resource, 0),
                wineSpending: () => tnt.utils.safeGet(() => ikariam.model.wineSpending, 0)
            },

            production: {
                resource: () => tnt.utils.safeGet(() => ikariam.model.resourceProduction, 0),
                tradegood: () => tnt.utils.safeGet(() => ikariam.model.tradegoodProduction, 0)
            }
        },

        // Military data
        military: {
            transporters: {
                free: () => tnt.utils.safeGet(() => ikariam.model.freeTransporters, 0),
                max: () => tnt.utils.safeGet(() => ikariam.model.maxTransporters, 0)
            }
        }
    },

    // is functions - Used to check various states
    is: {
        // Check if the current city is the player's own city
        ownCity: () => tnt.utils.safeGet(() => ikariam.model.isOwnCity, false)
    },

    // has functions - Used to check if certain features are available
    has: {
        construction: () => tnt.utils.hasConstruction()
    }

    // END: DO NOT MODIFY - Fixed logic
};

// Plugin system - Allows for modular extensions to TNT
tnt.plugins = [];
// Register a plugin with TNT
tnt.registerPlugin = function (plugin) {
    if (plugin?.name) {
        tnt.plugins.push(plugin);
        tnt.core.debug.log(`[TNT] Plugin registered: ${plugin.name}`, 2);
    } else {
        tnt.core.debug.warn('[TNT] Attempted to register unnamed plugin', 1);
    }
};

// UI module - handle all DOM manipulation and event binding
tnt.ui = {
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
            tnt.events.attachOptionsEventHandlers();
        }
    },

    buildOptionsHtml() {
        const settings = tnt.settings.getFeatureSettings();
        const resourceSettings = tnt.settings.getResourceDisplaySettings();
        const layoutPrefs = tnt.settings.getLayoutPrefs();

        // Prepare extracted layout data display
        let layoutDataHtml = '';
        if (layoutPrefs.layout) {
            // Helper to flatten and format an object as key1:val1, key2:val2
            function fmt(obj) {
                if (!obj || typeof obj !== 'object') return '';
                return Object.entries(obj)
                    .map(([k, v]) => `${k}:${v}`)
                    .join(', ');
            }
            const citymap = fmt(layoutPrefs.layout.citymap);
            const mainbox = fmt(layoutPrefs.layout.mainbox);
            const sidebar = fmt(layoutPrefs.layout.sidebar);
            layoutDataHtml = `<div id="tntLayoutCurrentData" style="margin-top:5px;font-size:10px;color:#666;word-break:break-all;line-height:1.4;">
                <span><b>citymap</b>: ${citymap || '-'}</span><br/>
                <span><b>mainbox</b>: ${mainbox || '-'}</span><br/>
                <span><b>sidebar</b>: ${sidebar || '-'}</span>
            </div>`;
        }

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
                    <legend>Debug:</legend>
                    ${this.createCheckbox('tntDebugEnable', 'Enable debug logging', tnt.settings.get('debug')?.enable ?? true)}
                    <label for="tntDebugLevel" style="font-size:11px;">Log level:</label>
                    <select id="tntDebugLevel" style="font-size:11px;">
                        <option value="1"${tnt.settings.get('debug')?.level === 1 ? ' selected' : ''}>1 - Errors only</option>
                        <option value="2"${tnt.settings.get('debug')?.level === 2 ? ' selected' : ''}>2 - Important</option>
                        <option value="3"${tnt.settings.get('debug')?.level === 3 ? ' selected' : ''}>3 - Warnings</option>
                        <option value="4"${tnt.settings.get('debug')?.level === 4 ? ' selected' : ''}>4 - Verbose</option>
                    </select>
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
                <div class="tnt_left" style="float:left;width:50%;">
                    <legend>Layout:</legend>
                    ${this.createCheckbox('tntLayoutMaintain', 'Maintain layout from URL', layoutPrefs.maintainLayout)}
                    <div id="tntLayoutUrlSection" style="padding-left:20px;${layoutPrefs.maintainLayout ? '' : 'display:none;'}">
                        <label for="tntLayoutUrl" style="display:block;margin-top:5px;font-size:11px;">Paste Ikariam layout URL:</label>
                        <input id="tntLayoutUrl" type="text" style="width:90%;margin-top:2px;font-size:11px;" placeholder="https://s##-us.ikariam.gameforge.com/?view=city&..." />
                        ${layoutDataHtml}
                    </div>
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

    // Apply UI modifications based on settings
    applyUIModifications() {
        const settings = tnt.settings.getFeatureSettings();

        // Need delay to ensure elements are ready
        setTimeout(() => {
            if (settings.removeFooterNavigation) {
                $('div#footer').hide();
            }

            if (settings.removeFlyingShop && $("body").attr("id") === "city") {
                $('.premiumOfferBox').hide();
                $('#leftMenu .expandable.resourceShop, #leftMenu .expandable.slot1, #leftMenu .expandable.slot2').remove();
                $('#js_viewCityMenu').css({
                    'top': '195px'
                });
            }
        }, 200);
    }
};

// Utilities module
tnt.utils = {
    // Safe getter with error handling
    safeGet(getter, defaultValue = null) {
        try {
            return getter();
        } catch (e) {
            tnt.core.debug.log(`Error in safeGet: ${e.message}`);
            return defaultValue;
        }
    },

    // Returns true if any building in the city is currently under construction.
    hasConstruction() {
        return $('.constructionSite').length > 0;
    },

    // Calculates resource and tradegood production for a city over a given number of hours.
    // Returns an object with formatted string values for each resource.
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

    // Extracts the building level from the element's CSS class (e.g., "level12").
    // Returns the level as a string or '?' if not found.
    extractLevelFromElement($element) {
        const classes = $element.attr('class') || '';
        const levelMatch = classes.match(/level(\d+)/);
        return levelMatch ? levelMatch[1] : '?';
    },

    // Creates a DOM element to visually display the city level.
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

    // Displays level indicators for all player cities on the island view.
    // Skips non-city elements and avoids duplicate indicators.
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

    // Extracts the current level, under construction, and upgradable state for a building element.
    // Handles multiple DOM patterns and fallback cases for robustness.
    extractBuildingLevel($element) {
        let level = 0;
        let position = $element.data('position');

        if (typeof position === 'undefined') {
            position = $element.data('id');
            if (typeof position === 'undefined') {
                const idAttr = $element.attr('id');
                const match = idAttr && idAttr.match(/(\d+)$/);
                if (match) position = match[1];
            }
        }

        const underConstruction = $element.hasClass('constructionSite');

        // Try direct level via #js_CityPositionXLevel
        let usedDirectLevel = false;
        if (typeof position !== 'undefined') {
            const $levelSpan = $("#js_CityPosition" + position + "Level");
            if ($levelSpan.length) {
                const txt = $levelSpan.text().trim();
                if (/^\d+$/.test(txt)) {
                    level = parseInt(txt, 10);
                    usedDirectLevel = true;
                }
            }
        }

        // If not found, try from .level span or class fallback
        if (!usedDirectLevel) {
            const $level = $element.find('.level');
            if ($level.length > 0) {
                const match = $level.text().match(/\d+/);
                if (match) level = parseInt(match[0], 10);
            } else {
                const classes = ($element.attr('class') || '').split(/\s+/);
                const levelClass = classes.find(c => c.startsWith('level'));
                if (levelClass) {
                    const match = levelClass.match(/\d+$/);
                    if (match) level = parseInt(match[0], 10);
                }
            }
        }

        // NEW: fallback if level is still 0 and it's under construction
        if (underConstruction && level <= 0 && typeof position !== 'undefined') {
            const $link = $("#js_CityPosition" + position + "Link");
            if ($link.length) {
                const m = $link.attr("title") && $link.attr("title").match(/\((\d+)\)/);
                if (m) level = parseInt(m[1], 10);
            }
        }

        // Check upgradable (scrollName green)
        let upgradable = false;
        if (typeof position !== 'undefined') {
            const $scrollName = $("#js_CityPosition" + position + "ScrollName");
            if ($scrollName.length && $scrollName.hasClass("green")) {
                upgradable = true;
            }
        }
        if (!upgradable && $element.find('.green').length > 0) {
            upgradable = true;
        }

        return {
            level,
            underConstruction,
            upgradable
        };
    },

    // Create building data object
    createBuildingData(position, buildingType, levelInfo) {
        return {
            position,
            level: levelInfo.level,
            name: buildingType,
            underConstruction: levelInfo.underConstruction,
            upgradable: levelInfo.upgradable // Store upgradable state
        };
    },

    // Adds or updates a building entry in the provided collection by building type and position.
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

    // Scans all building positions in the current city and returns a collection of detected buildings.
    // Ensures under-construction buildings are always included, even if level is 0.
    // Guarantees every building type is present in the result, even if not found.
    scanAllBuildings() {
        const $positions = $('div[id^="position"].building, div[id^="js_CityPosition"].building');
        if (!$positions.length) return { buildings: {}, hasConstruction: false };

        const foundBuildings = {};
        const hasAnyConstruction = this.hasConstruction();

        $positions.each((index, element) => {
            const $pos = $(element);
            const position = this.extractPositionFromElement($pos);
            if (!position) return;

            // Only allow Town Hall at position 0
            if (position == 0) {
                let level = 0;
                let underConstruction = $pos.hasClass('constructionSite');
                let upgradable = false;
                if (underConstruction) {
                    // Under construction: get level from the link's title
                    const $link = $("#js_CityPosition0Link");
                    if ($link.length) {
                        const m = $link.attr("title") && $link.attr("title").match(/\((\d+)\)/);
                        if (m) level = parseInt(m[1], 10);
                    }
                } else {
                    // Not under construction: get level from the visible span
                    const $levelSpan = $("#js_CityPosition0Level");
                    if ($levelSpan.length) {
                        const txt = $levelSpan.text().trim();
                        if (/^\d+$/.test(txt)) level = parseInt(txt, 10);
                    }
                    // Upgradable: check if the scroll name is green
                    const $scrollName = $("#js_CityPosition0ScrollName");
                    if ($scrollName.length && $scrollName.hasClass("green")) upgradable = true;
                }
                // Always save Town Hall if level > 0 or under construction
                if (level > 0 || underConstruction) {
                    const buildingData = {
                        position: 0,
                        level: level,
                        name: 'townHall',
                        underConstruction: underConstruction,
                        upgradable: upgradable
                    };
                    this.addBuildingToCollection(foundBuildings, buildingData);
                }
                // Do not allow any other building at position 0
                return;
            }

            // Default logic for all other buildings (never allow townHall at any other position)
            let buildingType = this.detectBuildingType($pos);
            if (buildingType === 'townHall') return;
            // Enhanced detection for construction sites
            const isUnderConstruction = $pos.hasClass('constructionSite');
            if (!buildingType && isUnderConstruction) {
                const $a = $pos.find('a[href*="view="]');
                if ($a.length > 0) {
                    const href = $a.attr('href');
                    const match = href && href.match(/view=([a-zA-Z]+)/);
                    if (match && match[1]) {
                        const viewName = match[1];
                        const def = (typeof TNT_BUILDING_DEFINITIONS !== 'undefined' ? TNT_BUILDING_DEFINITIONS : (window.TNT_BUILDING_DEFINITIONS || []))
                            .find(b => b.viewName === viewName);
                        buildingType = def ? def.key : null;
                    }
                }
            }
            if (!buildingType) return;

            const levelInfo = this.extractBuildingLevel($pos);

            // BUGFIX: Always include buildings under construction, regardless of level
            if (isUnderConstruction || levelInfo.level > 0) {
                // For buildings under construction with level 0, set level to 0 but mark as under construction
                if (isUnderConstruction && levelInfo.level <= 0) {
                    levelInfo.level = 0;
                }

                const buildingData = this.createBuildingData(position, buildingType, levelInfo);
                buildingData.underConstruction = isUnderConstruction; // Ensure this flag is always correct
                this.addBuildingToCollection(foundBuildings, buildingData);
            }
            // Skip buildings with level 0 that aren't under construction
            else if (levelInfo.level <= 0 && !isUnderConstruction) {
                return;
            }
        });

        // Ensure every building type is present in the collection, even if empty
        const buildingDefs = TNT_BUILDING_DEFINITIONS || [];
        buildingDefs.forEach(def => {
            if (!foundBuildings.hasOwnProperty(def.key)) {
                foundBuildings[def.key] = [];
            }
        });

        return {
            buildings: foundBuildings,
            hasConstruction: hasAnyConstruction
        };
    },

    // Attempts to switch to the specified city using several fallback methods.
    // Tries AJAX, dropdown, and direct URL navigation for maximum compatibility.
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
    },

    // Applies user-defined layout preferences to the city view using inline styles.
    // Only applies if layout maintenance is enabled and layout data is available.
    applyLayoutDirectly() {
        const layoutPrefs = tnt.settings.getLayoutPrefs();
        const layout = layoutPrefs.layout;

        // If the maintainLayout is not enabled or we don't have a layout, we can't apply it
        if (!layoutPrefs || !layoutPrefs.maintainLayout || !layout) return;

        // IMPORTANT: Enforce citymap position if enabled in settings. Do NOT modify or remove this! IT WORKS!
        if (layout.citymap) {
            const citymap = layout.citymap;
            if (citymap) {
                $('#worldmap').css({
                    top: citymap.top + 'px',
                    left: citymap.left + 'px',
                    transform: `scale(${citymap.zoom || 1})` // Apply zoom if available
                });
            }
        }

        // IMPORTANT: Enforce mainbox position if enabled in settings. Do NOT modify or remove this! IT WORKS!
        if (layout.mainbox) {
            const mainbox = layout.mainbox;
            if (ikariam && layout.maintainLayout && mainbox) {
                // Apply specific adjustments for Ikariam
                if (ikariam.mainbox_x !== mainbox.x) {
                    ikariam.mainbox_x = mainbox.x;
                }
                if (ikariam.mainbox_z !== mainbox.z) {
                    ikariam.mainbox_z = mainbox.z;
                }
            }
        }

        // IMPORTANT: Enforce sidebar position if enabled in settings. Do NOT modify or remove this! IT WORKS!
        if (layout.sidebar) {
            const sidebar = layout.sidebar;
            if (layout.maintainLayout && sidebar) {
                // Apply specific adjustments for Ikariam
                if (ikariam.sidebar_x !== sidebar.x) {
                    ikariam.sidebar_x = sidebar.x;
                }
                if (ikariam.sidebar_z !== sidebar.z) {
                    ikariam.sidebar_z = sidebar.z;
                }
            }
        }
    },

    buildingExistsInAnyCity(buildingKey, cities) {
        return Object.values(cities).some(city =>
            city.buildings && Array.isArray(city.buildings[buildingKey]) && city.buildings[buildingKey].length > 0
        );
    }
};

// Event module - handles all event bindings and interactions
tnt.events = {
    attachButtonEvents() {
        // Attach event handlers for minimize/maximize
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

        // Attach event handlers for toggle between resources and buildings
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

        // Attach event handlers for refresh button. citySwitcher.start() will handle the refresh logic
        $('.tnt_refresh_btn').off('click').on('click', function () {
            tnt.citySwitcher.start();
        });
    },

    // Attach event handlers for options dialog
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

        // Layout maintenance checkbox handler
        $("#tntLayoutMaintain").on("change", () => {
            const isChecked = $("#tntLayoutMaintain").is(':checked');
            const layoutPrefs = tnt.settings.getLayoutPrefs();

            if (isChecked) {
                layoutPrefs.maintainLayout = true;
                $("#tntLayoutUrlSection").show();
            } else {
                // Clear layout preferences when unchecked
                tnt.settings.clearLayoutPrefs();
                $("#tntLayoutUrlSection").hide();
            }

            if (isChecked) {
                tnt.settings.setLayoutPrefs(layoutPrefs);
            }
        });

        // Layout URL input handler
        $("#tntLayoutUrl").on("paste blur keypress", function (e) {
            // Handle paste, blur, or Enter key
            if (e.type === 'keypress' && e.which !== 13) return;

            setTimeout(() => {
                const url = $(this).val().trim();

                if (url && tnt.settings.isValidIkariamUrl(url)) {
                    const layout = tnt.settings.parseLayoutFromUrl(url);

                    if (layout) {
                        const layoutPrefs = {
                            maintainLayout: true,
                            url: url,
                            layout: layout
                        };

                        tnt.settings.setLayoutPrefs(layoutPrefs);

                        // Show extracted layout data in compact format
                        function fmt(obj) {
                            if (!obj || typeof obj !== 'object') return '';
                            return Object.entries(obj)
                                .map(([k, v]) => `${k}:${v}`)
                                .join(', ');
                        }
                        const citymap = fmt(layout.citymap);
                        const mainbox = fmt(layout.mainbox);
                        const sidebar = fmt(layout.sidebar);
                        const layoutDataHtml = `<div id="tntLayoutCurrentData" style="margin-top:5px;font-size:10px;color:#666;word-break:break-all;line-height:1.4;">
                            <span><b>citymap</b>: ${citymap || '-'}</span><br/>
                            <span><b>mainbox</b>: ${mainbox || '-'}</span><br/>
                            <span><b>sidebar</b>: ${sidebar || '-'}</span>
                        </div>`;
                        if ($("#tntLayoutCurrentData").length) {
                            $("#tntLayoutCurrentData").replaceWith(layoutDataHtml);
                        } else {
                            $("#tntLayoutUrlSection").append(layoutDataHtml);
                        }

                        // Clear the input after successful processing
                        $(this).val('');

                        tnt.core.debug.log(`[TNT] Layout preferences saved: ${JSON.stringify(layoutPrefs)}`, 2);
                    } else {
                        alert('Failed to parse layout parameters from URL');
                    }
                } else if (url) {
                    alert('Please enter a valid Ikariam URL');
                }
            }, 10);
        });

        // Debug toggle
        $('#tntDebugEnable').on('change', () => {
            const debug = tnt.settings.get('debug', { enable: true, level: 3 });
            debug.enable = $('#tntDebugEnable').is(':checked');
            tnt.settings.set('debug', debug);
            if (tnt.debug) tnt.debug.setEnabled(debug.enable);
        });

        // Debug level change
        $('#tntDebugLevel').on('change', () => {
            const debug = tnt.settings.get('debug', { enable: true, level: 3 });
            debug.level = parseInt($('#tntDebugLevel').val(), 10);
            tnt.settings.set('debug', debug);
            if (tnt.debug) tnt.debug.setLevel(debug.level);
        });
    },
};



// Initialize the TNT core
$(document).ready(() => tnt.core.init());


// --- debug.js ---

// TNT debug system - separate module, no console output by default
(function () {
    const LEVELS = {
        error: 1,
        warn: 2,
        info: 3
    };

    const LEVEL_META = {
        error: { label: 'ERROR', emoji: '❌', color: '#ff8a8a' },
        warn: { label: 'WARN', emoji: '⚠️', color: '#ffe080' },
        info: { label: 'INFO', emoji: 'ℹ️', color: '#8ec5ff' }
    };

    function formatTime(ts = Date.now()) {
        const date = new Date(ts);
        const pad = (n) => `${n}`.padStart(2, '0');
        return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    function normalizeLevel(level) {
        if (typeof level === 'string') {
            const key = level.toLowerCase();
            if (LEVELS[key]) return key;
            const parsed = parseInt(level, 10);
            if (!isNaN(parsed)) {
                if (parsed <= 1) return 'error';
                if (parsed === 2) return 'warn';
                return 'info';
            }
        }

        if (typeof level === 'number') {
            if (level <= 1) return 'error';
            if (level === 2) return 'warn';
            return 'info';
        }

        return 'info';
    }

    function levelToPriority(level) {
        return LEVELS[normalizeLevel(level)] || LEVELS.info;
    }

    function buildCollapsedHtml(state) {
        const lastEntry = state.entries[state.entries.length - 1];
        const lastMessage = lastEntry ? `${lastEntry.emoji} ${lastEntry.message}` : 'No logs yet';
        const truncated = lastMessage.length > 40 ? `${lastMessage.slice(0, 37)}...` : lastMessage;
        return `
            <div id="tntDebugBar" class="tnt_debug_bar" title="Click to expand">
                <span class="tnt_debug_summary">${tnt.debug.escapeHtml(truncated)}</span>
                <span class="tnt_debug_counts">(${state.entries.length}) ❌:${state.counts.error} ⚠️:${state.counts.warn} ℹ️:${state.counts.info}</span>
                <span class="tnt_debug_actions">
                    <button id="tntDebugCopy" class="tnt_debug_icon" title="Copy log">📋</button>
                    <button id="tntDebugExpand" class="tnt_debug_icon" title="Expand log">⬆️</button>
                </span>
            </div>`;
    }

    function buildPanelHtml(state) {
        const total = state.entries.length;
        const items = [...state.entries]
            .filter((entry) => state.filter === 'all' || entry.level === state.filter)
            .map((entry) => {
                const cls = `tnt_debug_entry tnt_debug_entry_${entry.level}`;
                return `
                    <div class="${cls}" title="${tnt.debug.escapeHtml(entry.message)}">
                        <span class="tnt_debug_entry_ts">${entry.ts}</span>
                        <span class="tnt_debug_entry_lvl" style="color:${LEVEL_META[entry.level].color};">${LEVEL_META[entry.level].emoji}</span>
                        <span class="tnt_debug_entry_msg">${tnt.debug.escapeHtml(entry.message)}</span>
                    </div>`;
            })
            .join('');

        const buttons = ['all', 'error', 'warn', 'info'].map((filterKey) => {
            const active = state.filter === filterKey ? ' active' : '';
            const count = filterKey === 'all' ? total : state.counts[filterKey];
            return `<button class="tnt_debug_filter_btn${active}" data-filter="${filterKey}">${filterKey.toUpperCase()} (${count})</button>`;
        }).join('');

        return `
            <div id="tntDebugPanel" class="tnt_debug_panel">
                <div class="tnt_debug_title">TNT Debug Log</div>
                <div id="tntDebugList" class="tnt_debug_list">${items}</div>
                <div class="tnt_debug_footer">
                    <div class="tnt_debug_filters">${buttons}</div>
                    <div class="tnt_debug_panel_actions">
                        <button id="tntDebugClear">Clear</button>
                        <button id="tntDebugCopy">Copy</button>
                    </div>
                </div>
            </div>`;
    }

    const DEFAULT_DEBUG_SETTINGS = { enable: false, level: 3 };

    function ensureContainer() {
        if ($('#tntDebugContainer').length === 0) {
            $('body').append('<div id="tntDebugContainer"></div>');
        }
    }

    tnt.debug = {
        state: {
            entries: [],
            counts: { error: 0, warn: 0, info: 0 },
            enabled: DEFAULT_DEBUG_SETTINGS.enable,
            level: DEFAULT_DEBUG_SETTINGS.level,
            expanded: false,
            filter: 'all',
            maxEntries: 500,
            autoScrollLocked: false
        },

        escapeHtml(str) {
            if (typeof str !== 'string') return str;
            return str.replace(/[&"'<>]/g, (tag) => ({
                '&': '&amp;',
                '"': '&quot;',
                "'": '&#39;',
                '<': '&lt;',
                '>': '&gt;'
            })[tag]);
        },

        init() {
            const raw = tnt.settings.get('debug', DEFAULT_DEBUG_SETTINGS);
            this.state.enabled = !!raw.enable;
            this.state.level = Number(raw.level || DEFAULT_DEBUG_SETTINGS.level);
            this.state.filter = 'all';
            this.state.autoScrollLocked = false;

            ensureContainer();
            this.render();

            this.attachEvents();
            return this;
        },

        isLevelEnabled(level) {
            if (!this.state.enabled) return false;
            return levelToPriority(level) <= this.state.level;
        },

        log(firstArg, secondArg, thirdArg = null) {
            let level;
            let message;

            if ((typeof firstArg === 'string' || typeof firstArg === 'number') && secondArg !== undefined) {
                // Common signature: log(message, level) OR log(level, message)
                if (typeof secondArg === 'string' || typeof secondArg === 'object') {
                    message = firstArg;
                    level = secondArg;
                } else {
                    // secondArg is number-type level
                    message = firstArg;
                    level = secondArg;
                }
            } else if ((typeof firstArg === 'number' || typeof firstArg === 'string') && secondArg === undefined) {
                // log(message) or log(level) rare case
                if (typeof firstArg === 'string' && /^(error|warn|info)$/i.test(firstArg)) {
                    message = '';
                    level = firstArg;
                } else {
                    message = firstArg;
                    level = 'info';
                }
            } else {
                message = firstArg;
                level = secondArg || thirdArg || 'info';
            }

            // If called with mixed ordering like log(1, 'msg')
            if ((typeof firstArg === 'number' || /^(error|warn|info)$/i.test(String(firstArg))) && typeof secondArg === 'string') {
                level = firstArg;
                message = secondArg;
            }

            const norm = normalizeLevel(level);
            if (!this.isLevelEnabled(norm)) return;

            const entry = {
                ts: formatTime(),
                level: norm,
                emoji: LEVEL_META[norm].emoji,
                message: typeof message === 'object' ? JSON.stringify(message) : String(message),
                raw: message
            };

            this.state.entries.push(entry);
            this.state.counts[norm] += 1;

            if (this.state.entries.length > this.state.maxEntries) {
                const overflow = this.state.entries.length - this.state.maxEntries;
                const removed = this.state.entries.splice(0, overflow);
                removed.forEach((item) => {
                    this.state.counts[item.level] = Math.max(0, this.state.counts[item.level] - 1);
                });
            }

            this.render();
        },

        info(msg) { this.log('info', msg); },
        warn(msg) { this.log('warn', msg); },
        error(msg) { this.log('error', msg); },

        dir(obj) { this.log('info', obj); },

        clear() {
            this.state.entries = [];
            this.state.counts = { error: 0, warn: 0, info: 0 };
            this.state.autoScrollLocked = false;
            this.render();
        },

        copy() {
            const text = this.state.entries.map((entry) => `${entry.ts} ${entry.emoji} ${entry.message}`).join('\n');
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).catch(() => {});
            } else {
                const el = $('<textarea style="position:absolute;left:-9999px;top:0;"></textarea>');
                $('body').append(el);
                el.val(text).select();
                document.execCommand('copy');
                el.remove();
            }
        },

        setFilter(filter) {
            if (![ 'all', 'error', 'warn', 'info' ].includes(filter)) return;
            this.state.filter = filter;
            this.render();
        },

        setLevel(level) {
            this.state.level = Number(level);
            tnt.settings.set('debug', { enable: this.state.enabled, level: this.state.level });
            this.render();
        },

        setEnabled(enabled) {
            this.state.enabled = Boolean(enabled);
            tnt.settings.set('debug', { enable: this.state.enabled, level: this.state.level });
            this.render();
        },

        toggleExpand() {
            this.state.expanded = !this.state.expanded;
            this.render();
        },

        renderCollapsed() {
            ensureContainer();
            // Keep panel hidden while collapsed
            $('#tntDebugContainer').html(`
                <div id="tntDebugCollapsed">${buildCollapsedHtml(this.state)}</div>
            `);
        },

        renderExpanded() {
            ensureContainer();
            // Show panel and always keep debug bar visible below it
            $('#tntDebugContainer').html(`
                <div id="tntDebugExpanded">${buildPanelHtml(this.state)}</div>
                <div id="tntDebugCollapsed">${buildCollapsedHtml(this.state)}</div>
            `);

            const $list = $('#tntDebugList');
            if (!this.state.autoScrollLocked) {
                $list.scrollTop($list.prop('scrollHeight'));
            }

            $list.off('scroll').on('scroll', () => {
                const atBottom = $list.prop('scrollHeight') - $list.scrollTop() - $list.outerHeight() < 4;
                this.state.autoScrollLocked = !atBottom;
            });
        },

        render() {
            if (!this.state.enabled) {
                $('#tntDebugContainer').remove();
                return;
            }

            if (this.state.expanded) {
                this.renderExpanded();
            } else {
                this.renderCollapsed();
            }
        },

        attachEvents() {
            ensureContainer();

            $(document).off('click', '#tntDebugBar, #tntDebugExpand').on('click', '#tntDebugBar, #tntDebugExpand', () => {
                this.state.expanded = !this.state.expanded;
                this.render();
            });

            $(document).off('click', '#tntDebugCopy').on('click', '#tntDebugCopy', (e) => {
                e.stopPropagation();
                this.copy();
            });

            $(document).off('click', '#tntDebugClear').on('click', '#tntDebugClear', (e) => {
                e.stopPropagation();
                this.clear();
            });

            $(document).off('click', '.tnt_debug_filter_btn').on('click', '.tnt_debug_filter_btn', (e) => {
                const filter = $(e.currentTarget).data('filter');
                this.setFilter(filter);
            });
        }
    };
})();

// --- styles.js ---

// Apply styles at the end
GM_addStyle(`
    /* Show level styles - using table background color */
    .tntLvl{
        position: absolute !important;
        top: 32px !important;
        left: 44px !important;
        color: #000 !important;
        line-height: 16px !important;
        background-color: #DBBE8C !important;
        font-size: 9px !important;
        font-weight: bold !important;
        text-align: center !important;
        vertical-align: middle !important;
        height: 16px !important;
        width: 16px !important;
        border-radius: 50% !important;
        border: 1px solid #000 !important;
        display: inline-block !important;
        box-shadow: 0 1px 2px rgba(0,0,0,0.3) !important;
        z-index: 1000 !important;
        pointer-events: none !important;
    }
    .tntLvl:hover {
        background-color: #faeac6 !important;
        transform: scale(1.05) !important;
        transition: all 0.2s ease !important;
    }
    /* TNT table styles with higher specificity - override Ikariam's .table01 styles */
    #tnt_info_resources #tnt_resources_table,
    #tnt_info_buildings_content #tnt_buildings_table{
        border-collapse: collapse !important;
        font: 12px Arial, Helvetica, sans-serif !important;
        background-color: #fdf7dd !important;
        table-layout: fixed !important;
    }
    
    /* Category header cells - CLEAN and SIMPLE with no internal elements */
    #tnt_info_resources #tnt_resources_table th.tnt_category_header,
    #tnt_info_buildings_content #tnt_buildings_table th.tnt_category_header {
        height: 25px !important;
        max-height: 25px !important;
        min-height: 25px !important;
        background-color: #DBBE8C !important;
        border: 1px solid #8B4513 !important;
        padding: 4px !important;
        font-weight: bold !important;
        text-align: center !important;
        box-sizing: border-box !important;
        line-height: 17px !important;
        font-size: 12px !important;
        vertical-align: middle !important;
    }
    
    /* External control buttons container - positioned OUTSIDE table, overlaying */
    .tnt_external_controls {
        position: absolute !important;
        top: 2px !important;
        left: 2px !important;
        width: 116px !important;
        height: 18px !important;
        z-index: 1000 !important;
        pointer-events: none !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        padding: 0 !important;
        box-sizing: border-box !important;
    }
    
    /* Left buttons container (Min/Max) */
    .tnt_left_buttons {
        display: flex !important;
        align-items: center !important;
        gap: 0px !important;
        pointer-events: none !important;
        flex-shrink: 0 !important;
    }
    
    /* Right buttons container (Refresh, Toggle) */
    .tnt_right_buttons {
        margin-top: 5px !important;
        display: flex !important;
        align-items: center !important;
        gap: 2px !important;
        pointer-events: none !important;
        flex-shrink: 0 !important;
        height: 18px !important;
    }
    
    /* Individual control buttons - perfectly sized and aligned */
    .tnt_left_buttons span,
    .tnt_right_buttons span {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        height: 18px !important;
        width: 18px !important;
        min-height: 18px !important;
        min-width: 18px !important;
        max-height: 18px !important;
        max-width: 18px !important;
        border: 1px solid #8B4513 !important;
        background: linear-gradient(135deg, #E6D3A3 0%, #D2B48C 50%, #C4A47C 100%) !important;
        border-radius: 3px !important;
        cursor: pointer !important;
        flex-shrink: 0 !important;
        pointer-events: auto !important;
        position: relative !important;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        font-size: 0 !important;
        line-height: 1 !important;
        padding: 0 !important;
        margin: 0 !important;
        box-sizing: border-box !important;
    }
    
    .tnt_left_buttons span:hover,
    .tnt_right_buttons span:hover {
        background: linear-gradient(135deg, #F0E4B6 0%, #E6D3A3 50%, #D2B48C 100%) !important;
        transform: translateY(-1px) scale(1.05) !important;
        box-shadow: 0 3px 6px rgba(0,0,0,0.4) !important;
        border-color: #654321 !important;
    }
    
    .tnt_left_buttons span:active,
    .tnt_right_buttons span:active {
        transform: translateY(0px) scale(1.02) !important;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
    }
    
    /* Minimize button icons - properly centered triangles */
    .tnt_left_buttons .tnt_panel_minimize_btn.tnt_back:after { 
        content: "";
        display: block;
        width: 0;
        height: 0;
        border: 3px solid transparent;
        border-right: 5px solid #333;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    .tnt_left_buttons .tnt_panel_minimize_btn.tnt_back:hover:after { 
        border-right-color: #000;
    }
    
    .tnt_left_buttons .tnt_panel_minimize_btn.tnt_foreward:after { 
        content: "";
        display: block;
        width: 0;
        height: 0;
        border: 3px solid transparent;
        border-left: 5px solid #333;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    .tnt_left_buttons .tnt_panel_minimize_btn.tnt_foreward:hover:after { 
        border-left-color: #000;
    }
    
    /* Toggle button icon - three centered lines */
    .tnt_right_buttons .tnt_table_toggle_btn:after {
        content: "";
        display: block;
        width: 8px;
        height: 2px;
        background: #333;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 
            0 -3px 0 #333,
            0 3px 0 #333;
        border-radius: 1px;
    }
    
    .tnt_right_buttons .tnt_table_toggle_btn:hover:after {
        background: #000;
        box-shadow: 
            0 -3px 0 #000,
            0 3px 0 #000;
    }
    
    .tnt_right_buttons .tnt_table_toggle_btn.active:after {
        background: #006600;
        box-shadow: 
            0 -3px 0 #006600,
            0 3px 0 #006600;
    }
    
    /* Refresh button icon - perfectly centered */
    .tnt_right_buttons .tnt_refresh_btn:before {
        content: "⟳";
        color: #333;
        font-size: 13px;
        font-weight: bold;
        text-shadow: 0 1px 2px rgba(255,255,255,0.7) !important;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        line-height: 1;
        width: 13px;
        height: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .tnt_right_buttons .tnt_refresh_btn:hover:before {
        color: #000;
        font-weight: 900;
    }

    /* TNT debug panel (bottom-right) */
    #tntDebugContainer {
        position: fixed !important;
        bottom: 8px !important;
        right: 8px !important;
        z-index: 1100 !important;
        font-size: 11px !important;
        pointer-events: none !important; /* allow underlying city clicks outside active debug elements */
        color: #fff !important;
        font-family: Arial, Helvetica, sans-serif !important;
        width: min(50vw, 100%) !important;
        max-width: 50vw !important;
        max-height: 50vh !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
        justify-content: flex-end !important;
        background: transparent !important;
    }

    .tnt_debug_panel {
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        background: rgba(0,0,0,0.85) !important;
        border: 1px solid rgba(255,255,255,0.25) !important;
        border-radius: 8px !important;
        padding: 8px !important;
        box-shadow: 0 0 12px rgba(0,0,0,0.7) !important;
        box-sizing: border-box !important;
        overflow: hidden !important;
        flex: 1 1 auto !important;
        pointer-events: auto !important; /* enable clicking inside debug UI */
    }

    .tnt_debug_bar {
        display: inline-flex !important;
        align-items: center !important;
        gap: 6px !important;
        background: rgba(0,0,0,0.55) !important;
        border: 1px solid rgba(255,255,255,0.3) !important;
        border-radius: 6px !important;
        padding: 4px 8px !important;
        width: 100% !important;
        max-width: 100% !important;
        cursor: pointer !important;
        box-shadow: 0 0 8px rgba(0,0,0,0.5) !important;
        box-sizing: border-box !important;
        pointer-events: auto !important;
    }

    .tnt_debug_bar:hover {
        background: rgba(0,0,0,0.75) !important;
    }

    .tnt_debug_summary {
        font-weight: bold !important;
        max-width: 220px !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        white-space: nowrap !important;
    }

    .tnt_debug_counts {
        opacity: 0.9 !important;
        margin-left: 8px !important;
    }

    .tnt_debug_actions .tnt_debug_icon {
        border: none !important;
        background: transparent !important;
        color: #fff !important;
        cursor: pointer !important;
        padding: 0 4px !important;
        font-size: 11px !important;
    }

    /* Ensure list floats inside panel while footer stays visible */
    .tnt_debug_list {
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
        flex: 1 1 auto !important;
        min-height: 120px !important;
        max-height: calc(100% - 118px) !important;
        overflow-y: auto !important;
        background: rgba(15,15,15,0.9) !important;
        border: 1px solid rgba(255,255,255,0.15) !important;
        border-radius: 4px !important;
        padding: 4px !important;
        box-sizing: border-box !important;
    }

    .tnt_debug_title {
        margin-bottom: 6px !important;
        font-weight: bold !important;
    }


    .tnt_debug_footer {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        flex-wrap: wrap !important;
        gap: 8px !important;
        margin-top: 6px !important;
        width: 100% !important;
        min-height: 28px !important;
        box-sizing: border-box !important;
        padding: 4px 6px !important;
    }

    .tnt_debug_filters,
    .tnt_debug_panel_actions {
        display: flex !important;
        align-items: center !important;
        gap: 4px !important;
        margin: 0 !important;
        padding: 0 !important;
        min-width: 0 !important;
    }

    .tnt_debug_filters {
        flex: 1 1 0 !important;
        overflow: hidden !important;
        min-width: 0 !important;
    }

    .tnt_debug_panel_actions {
        flex: 0 0 auto !important;
        margin-left: auto !important;
        min-width: 0 !important;
    }

    .tnt_debug_filter_btn,
    .tnt_debug_panel_actions button {
        margin: 0 !important;
        padding: 2px 6px !important;
        min-height: 24px !important;
        line-height: 1.2 !important;
        border: 1px solid #888 !important;
        background: #333 !important;
        color: #fff !important;
        border-radius: 3px !important;
        font-size: 10px !important;
        cursor: pointer !important;
        white-space: nowrap !important;
    }

    .tnt_debug_filter_btn.active {
        background: #007acc !important;
        border-color: #3ea5ff !important;
    }

    .tnt_debug_entry {
        display: flex !important;
        gap: 4px !important;
        padding: 1px 2px !important;
        font-size: 10px !important;
        color: #eee !important;
        white-space: pre-wrap !important;
        word-break: break-word !important;
        text-shadow: 0 1px 3px rgba(255,255,255,0.9) !important;
    }

    .tnt_debug_entry_ts {
        min-width: 48px !important;
        opacity: 0.8 !important;
        font-family: monospace !important;
    }

    .tnt_debug_entry_lvl {
        width: 20px !important;
    }

    .tnt_debug_entry_msg {
        flex: 1 !important;
    }
    
    /* Remove old control button styles that are no longer needed */
    .tnt_control_buttons {
        display: none !important;
    }
    
    /* Minimize button icons */
    .tnt_control_buttons .tnt_panel_minimize_btn.tnt_back:after { 
        content: "";
        display: block;
        width: 0;
        height: 0;
        border: 3px solid transparent;
        border-right: 5px solid #333;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    .tnt_control_buttons .tnt_panel_minimize_btn.tnt_back:hover:after { 
        border-right-color: #000;
    }
    
    .tnt_control_buttons .tnt_panel_minimize_btn.tnt_foreward:after { 
        content: "";
        display: block;
        width: 0;
        height: 0;
        border: 3px solid transparent;
        border-left: 5px solid #333;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    
    .tnt_control_buttons .tnt_panel_minimize_btn.tnt_foreward:hover:after { 
        border-left-color: #000;
    }
    
    /* Toggle button icon */
    .tnt_control_buttons .tnt_table_toggle_btn:after {
        content: "";
        display: block;
        width: 6px;
        height: 1px;
        background: #333;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 
            0 -2px 0 #333,
            0 2px 0 #333;
    }
    
    .tnt_control_buttons .tnt_table_toggle_btn:hover:after {
        background: #000;
        box-shadow: 
            0 -2px 0 #000,
            0 2px 0 #000;
    }
    
    .tnt_control_buttons .tnt_table_toggle_btn.active:after {
        background: #006600;
        box-shadow: 
            0 -2px 0 #006600,
            0 2px 0 #006600;
    }
    
    /* Refresh button icon */
    .tnt_control_buttons .tnt_refresh_btn:before {
        content: "⟳";
        color: #333;
        font-size: 14px;
        font-weight: bold;
        text-shadow: 0 1px 1px rgba(255,255,255,0.5);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        line-height: 1;
    }
    
    .tnt_control_buttons .tnt_refresh_btn:hover:before {
        color: #000;
        font-weight: 900;
        text-shadow: 0 1px 2px rgba(255,255,255,0.8);
    }
    
    /* Remove all old button styles that conflict with new structure */
    // .tnt_table_toggle_btn:not(.tnt_control_buttons *), // Should always be visible
    #tnt_info_resources .tnt_back,
    #tnt_info_resources .tnt_foreward,
    #tnt_info_updateCities,
    .tnt_panel_minimize_btn:not(.tnt_control_buttons *) {
        display: none !important;
    }
    
    .tnt_city .tnt_panel_minimize_btn {
        display: none !important;
    }
    
    /* Remove old category spacer styles that are no longer needed */
    .tnt_category_spacer {
        display: none !important;
    }
    /* Construction status styling applies to the first cell in any row across all tables */
    // .tnt_construction{
    //     background-color: #80404050 !important;
    // }
    .tnt_construction {
        background-color: #80404050 !important;
        border-left: 2px solid #804040 !important;
    }    
    /* Phase 4: Visual progress indicators */
    .tnt_progress_visited {
        background-color: #90EE9050 !important;
        border-left: 2px solid #32CD32 !important;
    }
    
    /* Ensure progress indicators work with selected state */
    body #tnt_info_resources .tnt_selected .tnt_progress_visited,
    body #tnt_info_buildings_content .tnt_selected .tnt_progress_visited {
        background-color: #90EE9050 !important;
        border-left: 2px solid #32CD32 !important;
    }
    
    /* Progress indicator takes precedence over construction during active switching */
    // .tnt_progress_visited.tnt_construction {
    //     background-color: #90EE9050 !important;
    //     border-left: 2px solid #32CD32 !important;
    // }
    .tnt_progress_visited.tnt_construction {
        background-color: #d4edda !important;
        color: #155724 !important;
    }    
    /* === RESOURCE STORAGE INDICATORS (FIX FOR ISSUE #002) === */
    
    /* Storage danger - high storage warning (RED text, no borders) */
    .tnt_storage_danger {
        //background-color: #ffaaaa !important;
        color: #ff0000 !important;
    }
    
    /* Storage minimum - low resource warning (YELLOW background, no borders) */
    .tnt_storage_min {
        background-color: #ffaaaa !important;
    }
    
    /* Ensure storage indicators work with TNT table styling */
    body #tnt_info_resources .tnt_storage_danger,
    body #tnt_info_buildings_content .tnt_storage_danger {
        //background-color: #ffaaaa !important;
    }
    
    body #tnt_info_resources .tnt_storage_min,
    body #tnt_info_buildings_content .tnt_storage_min {
        background-color: #ffaaaa !important;
    }
    
    /* Storage indicators with current city selection */
    body #tnt_info_resources .tnt_selected .tnt_storage_danger,
    body #tnt_info_buildings_content .tnt_selected .tnt_storage_danger {
        //background-color: #ffaaaa !important;
    }
    
    body #tnt_info_resources .tnt_selected .tnt_storage_min,
    body #tnt_info_buildings_content .tnt_selected .tnt_storage_min {
        background-color: #ffaaaa !important;
    }
    
    /* Storage indicators take precedence over construction status */
    .tnt_storage_danger.tnt_construction {
        //background-color: #ffaaaa !important;
    }
    
    .tnt_storage_min.tnt_construction {
        background-color: #ffaaaa !important;
    }
    
    /* Remove old category spacer styles that are no longer needed */
    .tnt_category_spacer {
        display: none !important;
    }
    /* Construction status styling applies to the first cell in any row across all tables */
    .tnt_construction{
        background-color: #80404050 !important;
    }
    /* Current city highlighting with 2px selection border matching theme */
    body #tnt_info_resources .tnt_selected,
    body #tnt_info_buildings_content .tnt_selected {
        border: 2px solid #000000 !important;
    }
    body #tnt_info_resources .tnt_selected td,
    body #tnt_info_buildings_content .tnt_selected td {
        border-top: 2px solid #000000 !important;
        border-bottom: 2px solid #000000 !important;
        // color: #000 !important;
    }
    body #tnt_info_resources .tnt_selected td:first-child,
    body #tnt_info_buildings_content .tnt_selected td:first-child {
        border-left: 2px solid #000000 !important;
    }
    body #tnt_info_resources .tnt_selected td:last-child,
    body #tnt_info_buildings_content .tnt_selected td:last-child {
        border-right: 2px solid #000000 !important;
    }
    /* Make tradegood production more visible with dark grey text color */
    body #tnt_info_resources .tnt_bold,
    body #tnt_info_buildings_content .tnt_bold {
        color: #333333 !important;
        font-weight: bold !important;
    }
    .tnt_resource_icon{
        vertical-align:middle !important;
        width:18px !important;
        height:16px !important;
        display:inline-block !important;
    }
    .tnt_building_icon {
        width: 36px !important;
        height: 32px !important;
    }
    img[src*='/city/wall.png'].tnt_building_icon {
        transform: scale(0.8) !important;
        transform-origin: 0 0;
        margin-right: -8px;
    }
    body #tnt_info_resources .tnt_population{ text-align:right !important; }
    body #tnt_info_resources .tnt_citizens{ text-align:right !important; }
    body #tnt_info_resources .tnt_wood{ text-align:right !important; }
    body #tnt_info_resources .tnt_marble{ text-align:right !important; }
    body #tnt_info_resources .tnt_wine{ text-align:right !important; }
    body #tnt_info_resources .tnt_crystal{ text-align:right !important; }
    body #tnt_info_resources .tnt_sulfur{ text-align:right !important; }
    body #tnt_info_resources .tnt_city{ text-align:left !important; }
    body #tnt_info_buildings_content .tnt_city{ text-align:left !important; }
    body #tnt_info_buildings_content .tnt_building_level{ text-align:center !important; }
    
    /* Override Ikariam's container table styles specifically for our TNT tables */
    #container body #tnt_info_resources #tnt_resources_table,
    #container body #tnt_info_buildings_content #tnt_buildings_table {
        border: none !important;
        margin: 0px !important;
        background-color: #fdf7dd !important;
        border-bottom: none !important;
        text-align: center !important;
        width: auto !important;
    }
    #container body #tnt_info_resources #tnt_resources_table td,
    #container body #tnt_info_buildings_content #tnt_buildings_table td {
        text-align: center !important;
        vertical-align: middle !important;
        padding: 4px !important;
        border: 1px #8B4513 solid !important;
    }
    #container body #tnt_info_resources #tnt_resources_table th,
    #container body #tnt_info_buildings_content #tnt_buildings_table th {
        background-color: #faeac6 !important;
        text-align: center !important;
        height: auto !important;
        padding: 4px !important;
        font-weight: bold !important;
        border: 1px #8B4513 solid !important;
    }
    
    #mainview a:hover{ text-decoration:none; }
    #tntOptions {
        position:absolute;
        top:40px;
        left:380px;
        width:620px;
        border:1px #755931 solid;
        border-top:none;
        background-color: #FEE8C3;
        padding:10px 10px 0px   10px;
    }

    #tntOptions legend{ font-weight:bold; }
    .tntHide, #infocontainer .tntLvl, #actioncontainer .tntLvl{ display:none; }
    #tntInfoWidget {
        position:fixed;
        bottom:0px;
        left:0px;
        width:716px;
        background-color: #DBBE8C;
        z-index:100000000;
    }
    #tntInfoWidget .accordionTitle {

        background: url(/cdn/all/both/layout/bg_maincontentbox_header.jpg) no-repeat;
        padding: 6px 0 0;
        width: 728px;
    }
    #tntInfoWidget .accordionContent {
        background: url(/cdn/all/both/layout/bg_maincontentbox_left.png) left center repeat-y #FAF3D7;
        overflow: hidden;
        padding: 0;
        position: relative;
        width: 725px;
    }
    #tntInfoWidget .scroll_disabled {
        background: url(/cdn/all/both/layout/bg_maincontentbox_left.png) repeat-y scroll left center transparent;
        width: 9px;
    }
    #tntInfoWidget .scroll_area {
        background: url(/cdn/all/both/interface/scroll_bg.png) right top repeat-y transparent;
        display: block;
        height: 100%;
        overflow: hidden;
        position: absolute;
        right: -3px;
        width: 24px;
        z-index: 100000;
    }
    .txtCenter{ text-align:center; }
    .tnt_center{ text-align:center!important; white-space:nowrap; }
    .tnt_right{ text-align:right!important; white-space:nowrap; }
    .tnt_left{ text-align:left!important; white-space:nowrap; }
    #tnt_info_resources{
        position:fixed;
        bottom:20px;
        left:0px;
        width:auto;
        height:auto;
        background-color: #DBBE8C;
        z-index:100000000;
    }
    #tnt_info_resources .tnt_back, #tnt_info_resources .tnt_foreward {
        cursor: pointer;
        display: block!important;
        height: 18px;
        width: 18px;
        border: 1px solid #8B4513;
        background: #D2B48C;
        border-radius: 2px;
        text-align: center;
        line-height: 16px;
        font-size: 12px;
        min-width: 18px;
        min-height: 18px;
    }
    #tnt_info_resources .tnt_back {
        left: 2px;
        position: absolute;
        top: 2px;
    }
    #tnt_info_resources .tnt_back:before {
        content: "◀";
        color: #333;
        display: inline-block;
        width: 100%;
        height: 100%;
    }
    #tnt_info_resources .tnt_back:hover {
        background: #DDD;
    }
    #tnt_info_resources .tnt_back:hover:before {
        color: #000;
    }
    #tnt_info_resources .tnt_foreward {
        left: 2px;
        position: absolute;
        top: 3px;
    }
    #tnt_info_resources .tnt_foreward:before {
        content: "▶";
        color: #333;
        display: inline-block;
        width: 100%;
        height: 100%;
    }
    #tnt_info_resources .tnt_foreward:hover {
        background: #DDD;
    }
    #tnt_info_resources .tnt_foreward:hover:before {
        color: #000;
    }
    #tnt_info_updateCities {
        position:fixed;
        bottom:20px;
        right:0px;
        width:auto;
        height:auto;
        background-color: #DBBE8C;
        z-index:100000000;
    }
    .tnt_panel_minimize_btn {
        cursor: pointer;
        display: block!important;
        height: 18px;
        width: 18px;
        position: absolute;
        left: 2px;
        top: 2px;
        z-index: 10;
        border: 1px solid #8B4513;
        background: #D2B48C;
        border-radius: 2px;
        text-align: center;
        line-height: 16px;
        font-size: 12px;
        min-width: 18px;
        min-height: 18px;
        box-sizing: border-box;
        overflow: hidden;
    }
    .tnt_panel_minimize_btn.tnt_back:before { 
        content: "◀";
        color: #333;
        display: inline-block;
        width: 100%;
        height: 100%;
        line-height: 16px;
        text-align: center;
        font-size: 10px;
        vertical-align: middle;
    }
    .tnt_panel_minimize_btn.tnt_back:hover { 
        background: #DDD;
    }
    .tnt_panel_minimize_btn.tnt_back:hover:before { 
        color: #000;
    }
    .tnt_panel_minimize_btn.tnt_foreward { 
        top: 3px; 
    }
    .tnt_panel_minimize_btn.tnt_foreward:before { 
        content: "▶";
        color: #333;
        display: inline-block;
        width: 100%;
        height: 100%;
        line-height: 16px;
        text-align: center;
        font-size: 10px;
        vertical-align: middle;
    }
    .tnt_panel_minimize_btn.tnt_foreward:hover { 
        background: #DDD;
    }
    .tnt_panel_minimize_btn.tnt_foreward:hover:before { 
        color: #000;
    }
    .tnt_table_toggle_btn {
        cursor: pointer;
        display: inline-block;
        height: 18px;
        width: 18px;
        vertical-align: middle;
        float: right;
        margin-left: 6px;
        border: 1px solid #8B4513;
        background: #D2B48C;
        border-radius: 2px;
        text-align: center;
        line-height: 16px;
        font-size: 12px;
        min-width: 18px;
        min-height: 18px;
        box-sizing: border-box;
        overflow: hidden;
    }
    .tnt_table_toggle_btn:before {
        content: "⇄";
        color: #333;
        display: inline-block;
        width: 100%;
        height: 100%;
        line-height: 16px;
        text-align: center;
        font-size: 10px;
        vertical-align: middle;
    }
    .tnt_table_toggle_btn:hover { 
        background: #DDD;
    }
    .tnt_table_toggle_btn:hover:before {
        color: #000;
    }
    .tnt_table_toggle_btn.active:before {
        content: "⇄";
        color: #006600;
        font-weight: bold;
    }
    /* Remove duplicate old button styles - keep only this section */
    .tnt_city .tnt_panel_minimize_btn { 
        display: none !important;
    }
    
    /* Change the minimized state to show the first cell completely for both tables */
    #tnt_info_resources.minimized,
    #tnt_info_buildings.minimized {
        width: auto !important;
        min-width: auto !important;
        max-width: none !important;
        overflow: hidden !important;
    }
    
    /* Simple minimized state - just hide columns */
    #tnt_info_resources.minimized table tr td:not(:first-child),
    #tnt_info_resources.minimized table tr th:not(:first-child),
    #tnt_info_buildings.minimized table tr td:not(:first-child),
    #tnt_info_buildings.minimized table tr th:not(:first-child) {
        display: none !important;
    }
    
    /* Show only the first cell when minimized - keep as table-cell */
    #tnt_info_resources.minimized table tr th:first-child,
    #tnt_info_resources.minimized table tr td:first-child,
    #tnt_info_buildings.minimized table tr th:first-child,
    #tnt_info_buildings.minimized table tr td:first-child {
        display: table-cell !important;
        width: auto !important;
        min-width: 60px !important;
    }
    
    /* Special handling for the header row when minimized */
    #tnt_info_resources.minimized table thead tr,
    #tnt_info_buildings.minimized table thead tr {
        display: table-row !important;
    }
    
    #tnt_info_resources.minimized table thead tr th:first-child,
    #tnt_info_buildings.minimized table thead tr th:first-child {
        display: table-cell !important;
        width: auto !important;
    }
    
    /* Ensure the tables maintain proper structure when minimized */
    #tnt_info_resources.minimized table,
    #tnt_info_buildings.minimized table {
        width: auto !important;
    }
    
    /* FORCE exact same heights in minimized state - now completely independent */
    #tnt_info_resources.minimized table tr.tnt_category_header,
    #tnt_info_buildings.minimized table tr.tnt_category_header {
        height: 25px !important;
        max-height: 25px !important;
        display: table-row !important;
    }
    
    #tnt_info_resources.minimized table tr.tnt_category_header th,
    #tnt_info_buildings.minimized table tr.tnt_category_header th {
        height: 25px !important;
        max-height: 25px !important;
        padding: 4px !important;
        vertical-align: middle !important;
        box-sizing: border-box !important;
        line-height: 17px !important;
        overflow: hidden !important;
    }
    
    /* External controls remain visible and positioned in minimized state */
    #tnt_info_resources.minimized .tnt_external_controls,
    #tnt_info_buildings.minimized .tnt_external_controls {
        position: absolute !important;
        top: 2px !important;
        left: 2px !important;
        width: 116px !important;
        height: 18px !important;
        z-index: 1000 !important;
        pointer-events: none !important;
        padding: 0 !important;
        box-sizing: border-box !important;
    }
    
    /* Remove all conflicting minimized button positioning - buttons are now external */
    /* 
    #tnt_info_resources.minimized .tnt_control_buttons,
    #tnt_info_buildings.minimized .tnt_control_buttons {
        // REMOVED - buttons are external now
    }
    
    #tnt_info_resources.minimized .tnt_control_buttons span,
    #tnt_info_buildings.minimized .tnt_control_buttons span {
        // REMOVED - buttons are external now  
    }
    */
    
    /* FORCE exact same subcategory header height in minimized state */
    #tnt_info_resources.minimized table tr.tnt_subcategory_header,
    #tnt_info_buildings.minimized table tr.tnt_subcategory_header {
        height: 41px !important;
        min-height: 41px !important;
        max-height: 41px !important;
        display: table-row !important;
    }
    
    #tnt_info_resources.minimized table tr.tnt_subcategory_header th:first-child,
    #tnt_info_buildings.minimized table tr.tnt_subcategory_header th:first-child {
        display: table-cell !important;
        height: 41px !important;
        min-height: 41px !important;
        max-height: 41px !important;
        line-height: 1.2 !important;
        vertical-align: middle !important;
        box-sizing: border-box !important;
        padding: 4px !important;
    }
    
    /* Override any conflicting styles for subcategory header cells in minimized state */
    #tnt_info_resources.minimized table tr.tnt_subcategory_header th,
    #tnt_info_buildings.minimized table tr.tnt_subcategory_header th {
        height: 41px !important;
        min-height: 41px !important;
        max-height: 41px !important;
        line-height: 1.2 !important;
        vertical-align: middle !important;
        box-sizing: border-box !important;
        padding: 4px !important;
    }
    #tnt_info_resources .tnt_building_maxed {
        background-color: #d4edda !important;
    }
`);
// Ensure the styles are applied immediately


// --- tableBuilder.js ---

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


// --- tooltip.js ---

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


// --- dataCollector.js ---

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
            default: return '';
        }
    }
};


// --- citySwitcher.js ---

// City switcher module - CLEANER debug version
tnt.citySwitcher = {
    isActive: false,
    startCityId: null,
    visitedCities: [],

    start() {
        this.startCityId = tnt.get.city.id();

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
        const allCities = Object.keys(tnt.get.player.list.cities());
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

    // Switch back to the starting city and update the states. Before resuming normal visual state
    end() {
        this.switchToCity(this.startCityId);
        this.isActive = false;
        tnt.settings.set("citySwitcherActive", false);

        // Restore normal state after final switch
        // setTimeout(() => {
        // console.log('[TNT] Restoring normal visual state');
        this.restoreNormalVisualState();
        // }, 2000);
    },

    updateVisualProgress() {
        // 
        if ($('#tnt_info_resources').is(':visible') && $("body").attr("id") === "city") {
            const resourceTable = tnt.tableBuilder.buildTable('resources');
            $('#tnt_info_resources_content').html(resourceTable);

            const buildingTable = tnt.tableBuilder.buildTable('buildings');
            $('#tnt_info_buildings_content').html(buildingTable);

            // Shouldn't need to reattach handlers here. We are going to move to a new city anyway.
            // tnt.tableBuilder.attachEventHandlers();
        }
    },

    restoreNormalVisualState() {
        // Restore normal visual state of the resources/buildings tables
        this.visitedCities = [];

        if ($('#tnt_info_resources').is(':visible') && $("body").attr("id") === "city") {
            const resourceTable = tnt.tableBuilder.buildTable('resources');
            $('#tnt_info_resources_content').html(resourceTable);

            const buildingTable = tnt.tableBuilder.buildTable('buildings');
            $('#tnt_info_buildings_content').html(buildingTable);

            tnt.tableBuilder.attachEventHandlers();
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
                // Direct navigation detected - stopping citySwitcher
                this.isActive = false;
                tnt.settings.set("citySwitcherActive", false);
                this.restoreNormalVisualState();
            }
        }
    }
};
