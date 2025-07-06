// ==UserScript==
// @name         TNT Collection Core
// @version      2.1.5
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

// Initialize the tntConsole
const tntConsole = Object.assign({}, window.console);

// Move large data blocks to separate internal modules for better organization
const TNT_BUILDING_DEFINITIONS = Object.freeze([
    // Government
    { key: 'townHall', name: 'Town Hall', viewName: 'townHall', icon: '/cdn/all/both/img/city/townhall_l.png', buildingId: 0, helpId: 1, maxedLvl: 34, category: 'government' },
    { key: 'palace', name: 'Palace', viewName: 'palace', icon: '/cdn/all/both/img/city/palace_l.png', buildingId: 11, helpId: 1, maxedLvl: 12, category: 'government' },
    { key: 'palaceColony', name: 'Governor\'s Residence', viewName: 'palaceColony', icon: '/cdn/all/both/img/city/palaceColony_l.png', buildingId: 17, helpId: 1, maxedLvl: 12, category: 'government' },
    { key: 'embassy', name: 'Embassy', viewName: 'embassy', icon: '/cdn/all/both/img/city/embassy_l.png', buildingId: 12, helpId: 1, category: 'government' },
    { key: 'chronosForge', name: 'Chronos\' Forge', viewName: 'chronosForge', icon: '/cdn/all/both/img/city/chronosForge_l.png', buildingId: 35, helpId: 1, maxedLvl: 3, category: 'government' },

    // Resource storage
    { key: 'warehouse', name: 'Warehouse', viewName: 'warehouse', icon: '/cdn/all/both/img/city/warehouse_l.png', buildingId: 7, helpId: 1, maxedLvl: 43, category: 'trade' },
    { key: 'dump', name: 'Depot', viewName: 'dump', icon: '/cdn/all/both/img/city/dump_l.png', buildingId: 29, helpId: 1, maxedLvl: 43, category: 'trade' },

    // Trade & Diplomacy
    { key: 'port', name: 'Trading Port', viewName: 'port', icon: '/cdn/all/both/img/city/port_l.png', buildingId: 3, helpId: 1, maxedLvl: 32, category: 'trade' },
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
    { key: 'forester', name: 'Forester\'s House', viewName: 'forester', icon: '/cdn/all/both/img/city/forester_l.png', buildingId: 18, helpId: 1, maxedLvl: 32, category: 'resourceEnhancer' },
    { key: 'stonemason', name: 'Stonemason', viewName: 'stonemason', icon: '/cdn/all/both/img/city/stonemason_l.png', buildingId: 19, helpId: 1, maxedLvl: 32, category: 'resourceEnhancer' },
    { key: 'winegrower', name: 'Winegrower', viewName: 'winegrower', icon: '/cdn/all/both/img/city/winegrower_l.png', buildingId: 21, helpId: 1, maxedLvl: 32, category: 'resourceEnhancer' },
    { key: 'glassblowing', name: 'Glassblower', viewName: 'glassblowing', icon: '/cdn/all/both/img/city/glassblowing_l.png', buildingId: 20, helpId: 1, maxedLvl: 32, category: 'resourceEnhancer' },
    { key: 'alchemist', name: 'Alchemist\'s Tower', viewName: 'alchemist', icon: '/cdn/all/both/img/city/alchemist_l.png', buildingId: 22, helpId: 1, maxedLvl: 32, category: 'resourceEnhancer' },

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
    wood: {
        title: 'Wood Resources',
        body: 'Basic material used in nearly all construction. Gathered from forests by Foresters.'
    },
    wine: {
        title: 'Wine',
        body: 'Luxury good consumed in Taverns to keep citizens happy. Produced by Winegrowers.'
    },
    marble: {
        title: 'Marble',
        body: 'Used for structural buildings and town upgrades. Supplied by Stonemasons.'
    },
    crystal: {
        title: 'Crystal Glass',
        body: 'Essential for research and scientific progress. Refined by Opticians.'
    },
    sulfur: {
        title: 'Sulfur',
        body: 'Powerful military resource used to create weapons and explosives. Extracted by Fireworkers.'
    },
    population: {
        title: 'Population',
        body: 'Total inhabitants of your city. Affects growth, tax income, and workforce availability.'
    },
    citizens: {
        title: 'Citizens',
        body: 'Free population available for jobs, research, or military service.'
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
            // We need to init the storage before anything else, so tnt.core.debug has its settings available
            tnt.core.storage.init();

            // Log the initialization
            tnt.core.debug.log(`TNT Collection v${tnt.version} - Init...`, 1);

            // We run events.init() first to overwrite the default Ikariam events as early as possible
            tnt.core.events.init();

            // Initialize all core components
            tnt.core.storage.init();
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
            // Log messages with level control
            log(val, level = 2) {
                const debug = tnt.settings.get('debug', { enable: true, level: 1 });
                if (debug.enable && level <= debug.level) {
                    tntConsole.log(val);
                }
            },

            // Log objects with level control
            dir(val, level = 2) {
                const debug = tnt.settings.get('debug', { enable: true, level: 1 });
                if (debug.enable && level <= debug.level) {
                    tntConsole.dir(val);
                }
            },

            // Log warnings with level control
            warn(val, level = 3) {
                const debug = tnt.settings.get('debug', { enable: true, level: 1 });
                if (debug.enable && level <= debug.level) {
                    tntConsole.warn(val);
                }
            },

            // Log errors with level control
            error(val, level = 1) {
                const debug = tnt.settings.get('debug', { enable: true, level: 1 });
                if (debug.enable && level <= debug.level) {
                    tntConsole.error(val);
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
                                }, 250);
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
        });

        // Debug level change
        $('#tntDebugLevel').on('change', () => {
            const debug = tnt.settings.get('debug', { enable: true, level: 3 });
            debug.level = parseInt($('#tntDebugLevel').val(), 10);
            tnt.settings.set('debug', debug);
        });
    },
};

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

        tnt.core.debug.log('[TNT] BubbleTips system is available and initialized');
        return true;
    },

    formatTemplateTooltip({ title, body }) {
        return `<div style="padding:8px;"><strong>${title}</strong><br/>${body}</div>`;
    },

    // Bind a tooltip HTML to an element
    bindToElement($el, html) {
        if (!$el || $el.length === 0 || !html) return;

        $el.off('mouseenter.tnt mouseleave.tnt');

        $el.on('mouseenter.tnt', function () {
            try {
                BubbleTips.clear?.();
                BubbleTips.init?.();
                $(BubbleTips.infoNode).css({ 'z-index': '100000001', 'display': 'block' });
                BubbleTips.bindBubbleTip(6, 13, html, null, this, false);
            } catch (err) {
                tnt.core.debug.warn('TNT: Tooltip bind failed: ' + err, 2);
            }
        });

        $el.on('mouseleave.tnt', () => BubbleTips.clear?.());
    },

    // Bind a template tooltip to an element
    bindTemplateTooltip($el, section, key) {
        if (!$el || $el.length === 0) return;

        const template = TNT_TOOLTIP_TEMPLATES?.[section]?.[key] || TNT_TOOLTIP_TEMPLATES?.[key];
        if (!template) {
            tnt.core.debug.log(`[TNT] No tooltip template found for section="${section}", key="${key}"`, 2);
            return;
        }

        const html = tnt.tooltip.formatTemplateTooltip(template);
        tnt.tooltip.bindToElement($el, html);
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
            const resourceType = $container.data('resource');
            tnt.tooltip.bindTemplateTooltip($container, 'resource', resourceType);
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

// Table builder - complete implementation matching working HTML structure
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

            html += `<tr${rowClass}>`;

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
            if (building.key === 'palaceOrColony') {
                html += `<th class="tnt_center tnt_bold" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">`;
                html += `<a href="#" onclick="ajaxHandlerCall('?view=buildingDetail&buildingId=11&helpId=1');return false;">`;
                html += `<img class="tnt_resource_icon tnt_building_icon" title="Palace" src="${building.icon}">`;
                html += `</a>`;
                html += `<a href="#" onclick="ajaxHandlerCall('?view=buildingDetail&buildingId=17&helpId=1');return false;">`;
                html += `<img class="tnt_resource_icon tnt_building_icon" title="Governor's Residence" src="${building.icon2}">`;
                html += `</a></th>`;
            } else {
                html += `<th class="tnt_center tnt_bold" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">`;
                html += `<a href="#" onclick="ajaxHandlerCall('?view=buildingDetail&buildingId=${building.buildingId}&helpId=${building.helpId}');return false;">`;
                html += `<img class="tnt_resource_icon tnt_building_icon" title="${building.name}" src="${building.icon}">`;
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

            html += `<tr${rowClass}>`;

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

    renderBuildingLevelCell(buildingArray, buildingKey, cityId) {
        let tdClass = "tnt_building_level";
        let bgColor = "#fdf7dd";
        let tooltip = "";
        let levelSum = 0;
        let hasConstruction = false;
        let upgradable = false;

        if (!Array.isArray(buildingArray) || buildingArray.length === 0) {
            return `<td class="${tdClass}" style="padding:4px;text-align:center;border:1px solid #000;background-color:${bgColor};"></td>`;
        }

        const buildingDef = TNT_BUILDING_DEFINITIONS.find(def => def.key === buildingKey);

        buildingArray.forEach(b => {
            const lvl = typeof b.level === 'number' ? b.level : 0;
            levelSum += lvl;
            if (b.underConstruction) hasConstruction = true;
            if (b.upgradable) upgradable = true;
            const upgradeNote = b.underConstruction ? ` (Upgrading to ${lvl + 1})` : "";
            tooltip += `Pos ${b.position}: lvl ${lvl}${upgradeNote}\n`;
        });

        if (buildingDef && levelSum >= buildingDef.maxedLvl * buildingArray.length) {
            tdClass += " tnt_building_maxed";
        }
        if (upgradable) tdClass += " green";
        if (hasConstruction) bgColor = "#80404050";

        return `<td class="${tdClass}" style="padding:4px;text-align:center;border:1px solid #000;background-color:${bgColor};" title="${tooltip.trim().replace(/"/g, '&quot;')}">${levelSum > 0 ? levelSum : '0'}</td>`;
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

        // Add tooltips to resource icons
        tnt.tooltip.attachTooltips(); // Not sure where to move this. One run once after tables has been build!
    }
};

// Initialize the TNT core
$(document).ready(() => tnt.core.init());

// Apply styles at the end
GM_addStyle(TNT_STYLES);