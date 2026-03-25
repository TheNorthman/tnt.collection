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
