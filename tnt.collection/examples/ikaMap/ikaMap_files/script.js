/**
 * Script file for Ikariam map
 */

/**
 * Import global functions
 */

import { options, getReverseServer, updateURL, colorChoices, setSavedStates, filterAlliances, highlightSuggestion, removeActive, showSuggestions, handleKeyDown, getCSSVariable, getAllianceList, serverSelect, worldSelect, saveButton, formatTime, getWonderImagePath, getWonderName, getResource, getTradegoodName, formatNumber, saveInputValues, restoreInputValues, populateWorldSelect, populateServerSelect, getWorldName, getRandomColor, server, serverWorlds, resetLanguageSelection, setLanguage } from './globalFunctions.js'

// Initialize i18next
document.addEventListener('DOMContentLoaded', function () {
    
    i18next
      .use(i18nextXHRBackend)
      .init({
        lng: 'en',
        fallbackLng: 'en',
        backend: {
          loadPath: 'lang/{{lng}}.json?v=1.0.1'
        }
      }, function(err, t) {
        //updateContent();
      });
      
    i18next.changeLanguage(localStorage.getItem('preferredLanguage'), function(err, t) {
        //updateContent();
    });
});

const params = new URLSearchParams(window.location.search);

// Window.onload

window.onload = async function() {
    resetLanguageSelection();
    serverData = await loadServerData();
    setLanguage();
    setSavedStates();
    updateContent();
    
    drawMap();

    const searchType = params.get('searchType');
    
    if(!searchType){
        return;
    }

    const server = params.get('server');
    const world = params.get('world');

    const serverSelect = document.getElementById('serverSelect');
    
    if(server){
        serverSelect.value = getReverseServer(server);
        populateWorldSelect();
    }

    const worldSelect = document.getElementById('worldSelect');
    if(world){
        worldSelect.value = world;
    }

    const searchInput1 = params.get('searchInput1');
    const searchInput2 = params.get('searchInput2');
    const searchInput3 = params.get('searchInput3');
    const searchInput4 = params.get('searchInput4');
    const searchInput5 = params.get('searchInput5');
    const additionalInput = params.get('additionalInput');

    document.querySelector(`input[name="searchType"][value="${searchType}"]`).checked = true;
    document.getElementById('searchInput1').value = decodeURIComponent(searchInput1);
    document.getElementById('searchInput2').value = decodeURIComponent(searchInput2);
    document.getElementById('searchInput3').value = decodeURIComponent(searchInput3);
    document.getElementById('searchInput4').value = decodeURIComponent(searchInput4);
    document.getElementById('searchInput5').value = decodeURIComponent(searchInput5);

    /*
    const x = params.get('x');
    const y = params.get('y');

    document.getElementById('xCoord').value = x;
    document.getElementById('yCoord').value = y;
    */
    //document.getElementById('additionalInput').value = additionalInput; // TODO

    fetchPlayerData();

    updateMapAndTable();//populateMap();

};

/**
 * Constants
 */

const width = 700;
const height = 700;
const gridSize = width / 100;
const margin = 50;
let currentFocus = -1;

let svg, tooltip, playerData, citiesByCoords, islandsData = {};

let currentServerSettings, serverData = "";

let selectedIslands = [];
let selectedIslandsInformation = [];
let alliances = [];
let cities = [];

const colorPalette = [
    "island-cell first",
    "island-cell second",
    "island-cell third",
    "island-cell fourth",
    "island-cell fifth"
]

const baseTransportSpeed = {
    'army' : 600,
    'merchant': 600,
    'carrier': 1800,
    'mortar': 1200
}

const languageSelect = document.getElementById('languageSelect');

const distanceModal = document.getElementById('distanceModal');
const islandCloseup = document.getElementById('islandCloseup');
const closeModalButton = document.getElementById('closeModal');
const closeIslandCloseup = document.getElementById('closeIslandCloseup');


/**
 * Event listeners
 */

window.addEventListener('click', function(event) {
    if(event.target == islandCloseup){
        islandCloseup.style.display = 'none';
        hideIslandCloseup();
    }
    if (event.target === distanceModal) {
        distanceModal.style.display = 'none';
        resetSelectedIslands();
    }
});

document.getElementById('languageSelect').addEventListener('change', function() {
    const selectedLanguage = this.value;
    i18next.changeLanguage(selectedLanguage, function(err, t) {
        updateContent();
    });
});

document.addEventListener('click', function(event) {
    const suggestionsBox = document.getElementById('suggestions');
    const input = document.getElementById('allianceInput');

    if (!suggestionsBox.contains(event.target) && event.target !== input) {
        suggestionsBox.style.display = 'none';
    }
});

document.querySelectorAll('input[name="searchType"]').forEach(radio => {
    radio.addEventListener('change', createSearchFields);
});

document.querySelectorAll('input[name="addParameter"]').forEach(radio =>{
    radio.addEventListener('change', createAdditionalInfo);
})

document.getElementById('searchButton').addEventListener('click', function () {
    fetchPlayerData();
})

/*
document.getElementById('highlightButton').addEventListener('click', function () {

    highlightIsland();

})
*/

document.getElementById('serverSelect').addEventListener('change', function() {
    populateWorldSelect();
    if (this.value && document.getElementById('worldSelect').value) {
        const selectedServer = server[document.getElementById('serverSelect').value];
        const selectedWorld = document.getElementById('worldSelect').value;
        getAllianceList(selectedServer, selectedWorld);
        fetchPlayerData();
    }
});

document.getElementById('worldSelect').addEventListener('change', function() {
    const selectedServer = server[document.getElementById('serverSelect').value];
    const selectedWorld = document.getElementById('worldSelect').value;
    if (this.value) {
        getAllianceList(selectedServer, selectedWorld);
        fetchPlayerData();
    }
});

saveButton.addEventListener('click', () => {

    const selectedLanguage = languageSelect.value;
    const selectedServer = serverSelect.value;
    const selectedWorld = worldSelect.value;

    localStorage.setItem('preferredLanguage', selectedLanguage);
    localStorage.setItem('preferredServer', selectedServer);
    localStorage.setItem('preferredWorld', selectedWorld);

    alert('Settings saved!');
});

closeModalButton.addEventListener('click', function() {
    distanceModal.style.display = 'none';

    resetSelectedIslands();
});

closeIslandCloseup.addEventListener('click', function () {
    hideIslandCloseup();
})

function updateContent() {

    const savedValues = saveInputValues();

    document.querySelectorAll('[data-i18n]').forEach(function(element) {
        const key = element.getAttribute('data-i18n');
        //console.log('Translating:', key, '->', i18next.t(key)); // DEBUG
        element.textContent = i18next.t(key);
    });
    
    const addCoordsParameter = document.getElementById('addCoords');
    const addCitiesParameter = document.getElementById('addCities');
    if(addCoordsParameter.checked){
        document.getElementById('xCoord').placeholder = i18next.t('xCoord');
        document.getElementById('yCoord').placeholder = i18next.t('yCoord');
    }
    if(addCitiesParameter.checked){
        document.getElementById('cityNameInput').placeholder = i18next.t('cityNameInput');
    }

    resetLegend();
    createSearchFields();
    restoreInputValues(savedValues);
}

async function loadServerData(){
    const data = await fetch('serverData.json')
        .then(response => response.json())
        .then(data => {
            return data;
        })
    return data;
}

function translateTooltip(){

    /*
    const coordinatesElement = document.getElementById("tooltipCoordinates");
    const wonderElement = document.getElementById('tooltipWonder');    
    const resourceElement = document.getElementById('tooltipResource');
    const tradegoodElement = document.getElementById('tooltipTradegood');
    */
    const freeSlotsElement = document.getElementById('tooltipFreeSlots');
    /*
    const coordinatesKey = coordinatesElement.getAttribute('data-i18n');
    const wonderKey = wonderElement.getAttribute('data-i18n');
    const resourceKey = resourceElement.getAttribute('data-i18n');
    const tradegoodKey = tradegoodElement.getAttribute('data-i18n');
    */
    const freeSlotsKey = freeSlotsElement.getAttribute('data-i18n');
    //console.log('Translating:', key, '->', i18next.t(key)); // DEBUG
    /*
    coordinatesElement.textContent = i18next.t(coordinatesKey);
    wonderElement.textContent = i18next.t(wonderKey);
    resourceElement.textContent = i18next.t(resourceKey);
    tradegoodElement.textContent = i18next.t(tradegoodKey);
    */
    freeSlotsElement.textContent = i18next.t(freeSlotsKey);

}

function createAdditionalInfo(){

    const selectedParameterContainer = document.getElementById('selectedParameterContainer');

    const addCoordsParameter = document.getElementById('addCoords');
    const addCitiesParameter = document.getElementById('addCities');

    selectedParameterContainer.innerHTML = "";
    
    if(this == addCoordsParameter && addCoordsParameter.checked){

        addCitiesParameter.checked = false;

        const inputXCoord = document.createElement('input');
        inputXCoord.type = 'text';
        inputXCoord.id = `xCoord`;
        const inputXCoordPlaceholder = `${i18next.t('xCoord')}`;
        inputXCoord.placeholder = inputXCoordPlaceholder;
        inputXCoord.style = 'margin: 5px;';
        selectedParameterContainer.appendChild(inputXCoord);

        const inputYCoord = document.createElement('input');
        inputYCoord.type = 'text';
        inputYCoord.id = `yCoord`;
        const inputYCoordPlaceholder = `${i18next.t('yCoord')}`;
        inputYCoord.placeholder = inputYCoordPlaceholder;
        inputYCoord.style = 'margin: 5px;';
        selectedParameterContainer.appendChild(inputYCoord);

        inputXCoord.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                fetchPlayerData(); // Trigger search on Enter key
            }
        });
        
        inputYCoord.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                fetchPlayerData(); // Trigger search on Enter key
            }
        });

    }

    if(this == addCitiesParameter && addCitiesParameter.checked){

        addCoordsParameter.checked = false;

        const inputCityName = document.createElement('input');
        inputCityName.type = 'text';
        inputCityName.id = `cityNameInput`;
        const inputCityNamePlaceholder = `${i18next.t('cityNameInput')}`;
        inputCityName.placeholder = inputCityNamePlaceholder;
        inputCityName.style = 'margin: 5px;';
        selectedParameterContainer.appendChild(inputCityName);

        inputCityName.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                fetchPlayerData(); // Trigger search on Enter key
            }
        })

    }

}

function createSearchFields() {
    const searchFieldsDiv = document.getElementById('searchFields');
    const searchType = document.querySelector('input[name="searchType"]:checked').value;

    const additionalInputContainer = document.getElementById('additionalInputContainer');

    searchFieldsDiv.innerHTML = '';

    if(searchType == "player"){
        additionalInputContainer.innerHTML = "";
    }

    if(searchType == "alliance"){
        additionalInputContainer.innerHTML = "";

        const additionalInput = document.createElement('input');
        additionalInput.type = 'text';
        additionalInput.id = `additionalInput`;

        additionalInput.placeholder = i18next.t('additionalPlayer');
        additionalInputContainer.appendChild(additionalInput);
        additionalInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                fetchPlayerData(); // Trigger search on Enter key
            }
        });
    }

    for (let i = 1; i <= 5; i++) {
        const color = colorChoices[i - 1];
        const colorBox = document.createElement('span');
        colorBox.className = 'input-color-box';
        colorBox.style = `width: 15px; height: 10px; display: inline-block; background-color: ${color}; border: 1px solid #ccc;`;
        searchFieldsDiv.appendChild(colorBox);

        const input = document.createElement('input');
        input.type = 'text';
        input.id = `searchInput${i}`;
        const placeholderText = searchType === 'player' 
            ? `${i18next.t('playerName')} ${i}` 
            : `${i18next.t('allianceName')} ${i}`;
        input.placeholder = placeholderText;
        input.style = 'margin: 5px;';
        searchFieldsDiv.appendChild(input);

        if (searchType === 'alliance') {

            input.addEventListener('input', function() {
                showSuggestions(input, input.value);
            });

            input.addEventListener('keydown', function(event) {
                handleKeyDown(event, input);
            });
        }

        const suggestionsBox = document.createElement('div');
        suggestionsBox.classList.add('suggestions-box');
        searchFieldsDiv.appendChild(suggestionsBox);
    }

    const searchInputs = document.querySelectorAll('#searchFields input');
    searchInputs.forEach(input => {
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                fetchPlayerData(); // Trigger search on Enter key
            }
        });
    });
}

function fetchPlayerData() {
    const selectedServer = server[document.getElementById('serverSelect').value];
    const selectedWorld = document.getElementById('worldSelect').value;
    params.set('server', selectedServer);
    params.set('world', selectedWorld);

    if(document.getElementById('cityNameInput')){
        params.set('city', document.getElementById('cityNameInput').value);

        if(params.get('city').toLowerCase() == "polis"){

            alert('City name polis is not allowed')
            return;

        }

        fetchCitiesWithSameName();
    }

    const selectedServerLower = document.getElementById('serverSelect').value.toLowerCase();

    currentServerSettings = fetchServerSettings(selectedServerLower, selectedWorld);

    if (!selectedServer || !selectedWorld) {
        alert('Please select both server and world.');
        return;
    }

    fetchIslandsData();
}

function fetchServerSettings(community, serverNumber){
    for(let i = 0; i < serverData.length; i++){
        const element = serverData[i];

        if(element.number == serverNumber && element.language == community){
            return element;
        }
    }
    console.error("Fetched server was not found");
}

function fetchIslandsData() {
    //fetch(`http://127.0.0.1:25905/coords/?${params.toString()}`)
    fetch(`https://api.ika-map.com/coords/?${params.toString()}/`, options)
        .then(response => response.json())
        .then(data => {
            islandsData = data;
            updateMapAndTable();//populateMap();
        })
        .catch(error => console.error('Error loading islands data:', error));
}

function fetchCitiesWithSameName(){
    fetch(`https://api.ika-map.com/cityName/?${params.toString()}`, options)
        .then(response => response.json())
        .then(data => {
            cities = data;
        })
}

function drawMap() {
    svg = d3.select("#game-map").html("");

    for (let i = 0; i <= 100; i++) {
        svg.append("line")
            .attr("x1", i * gridSize + margin)
            .attr("y1", margin)
            .attr("x2", i * gridSize + margin)
            .attr("y2", height + margin)
            .attr("class", "grid-line");

        svg.append("line")
            .attr("x1", margin)
            .attr("y1", i * gridSize + margin)
            .attr("x2", width + margin)
            .attr("y2", i * gridSize + margin)
            .attr("class", "grid-line");

        if (i % 10 === 0) {
            svg.append("text")
                .attr("x", i * gridSize + margin)
                .attr("y", margin - 10)
                .attr("class", "axis-label")
                .attr("text-anchor", "middle")
                .text(i);

            svg.append("text")
                .attr("x", margin - 10)
                .attr("y", i * gridSize + margin + 5)
                .attr("class", "axis-label")
                .attr("text-anchor", "end")
                .text(i);
        }
    }
}

function populateMap(){
    
    svg = d3.select("#game-map").html("")
    
    tooltip = d3.select("#tooltip");

    Object.keys(islandsData).forEach(coord => {
        const [x, y] = coord.split(":").map(Number);
        const island = islandsData[coord];

        const hasPlayers = island.data && island.data.length > 0;

        const islandClass = hasPlayers ? "island-cell occupied" : "island-cell empty";

        svg.append("rect")
            .attr("xCoord", x)
            .attr("yCoord", y)
            .attr("x", x * gridSize + margin)
            .attr("y", y * gridSize + margin)
            .attr("width", gridSize)
            .attr("height", gridSize)
            .attr("class", islandClass)
            .on("mouseover", function (event) {
                
                const groupedCities = island.data.reduce((acc, city) => {
                    const playerKey = `${city.playerName} [${city.alliance || '-'}]`;
                    if (!acc[playerKey]) {
                        acc[playerKey] = [];
                    }
                    acc[playerKey].push(city.cityName + ` (${city.level})`);
                    return acc;
                }, {});

                let islandInfo = `
                    <strong> [${island.coords}] </strong> <img src="${getWonderImagePath(island.wonder)}" class="tooltip-image"><br>
                    <img src = "${getResource(0)}" class="tooltip-image"> (${island.resourceLevel})
                    <img src = "${getResource(island.tradegood)}" class="tooltip-image"> (${island.tradegoodLevel})<br>
                    <hr>
                `;

                /*
                let islandInfo = `
                    <strong id="tooltipCoordinates" data-i18n="coordinates">Coordinates:</strong> ${island.coords}<br>
                    <strong id="tooltipWonder" data-i18n="wonder">Wonder:</strong> ${getWonderName(island.wonder)}<br>
                    <strong id="tooltipResource" data-i18n="resource">Resource Level:</strong> ${island.resourceLevel}<br>
                    <strong id="tooltipTradegood" data-i18n="tradegood">Tradegood:</strong> ${getTradegoodName(island.tradegood)} (${island.tradegoodLevel})<br>
                    <strong id="tooltipFreeSlots" data-i18n="freeSlots">Free Slots:</strong> ${island.free}
                    <hr>
                `;
                */

                if (hasPlayers) {
                    const playerInfo = `${Object.entries(groupedCities).map(([player, cities]) => `
                        <strong>${player}</strong><br>
                        <ul style="margin: 0; padding-left: 15px;">
                            ${cities.map(city => `<li>${city}</li>`).join('')}
                        </ul>
                        `).join('<hr>')}
                    `;
                    /*
                    const playerInfo = island.data.map(city => `
                        <hr>
                        <strong data-i18n="player">Player:</strong> ${city.playerName} [${city.alliance || '-'}]<br>
                        <strong data-i18n="city">City:</strong> ${city.cityName} (${city.level})<br>
                    `).join('');
                    */
                    islandInfo += playerInfo;
                    islandInfo += "<hr>"
                }
                islandInfo += `
                    <br>
                    <strong id="tooltipFreeSlots" data-i18n="freeSlots">Free Slots:</strong> ${island.free} / 17
                `

                tooltip.style("display", "block")
                    .html(islandInfo)
                const tooltipElement = tooltip.node();
                const tooltipHeight = tooltipElement.offsetHeight;
                const windowHeight = window.innerHeight;
                
                let tooltipY = event.pageY + 10;
                if (tooltipY + tooltipHeight > windowHeight) {
                    tooltipY = windowHeight - tooltipHeight - 10;
                }
                
                tooltip.style("left", (event.pageX + 10) + "px")
                    .style("top", `${tooltipY}px`);
                translateTooltip();
            })

            .on("mouseout", function () {
                tooltip.style("display", "none");
            })
            .on("click", function() {
                handleIslandClick(this, island);
            })
            .on("dblclick", function (event) {
                handleDoubleClick(this, island);
            })
    });
}

function handleIslandClick(element, island) {

    selectedIslandsInformation.push(island);

    const islandElement = d3.select(element);
    const x = +islandElement.attr("x");
    const y = +islandElement.attr("y");
    const coordX = Math.round((x - margin) / gridSize);
    const coordY = Math.round((y - margin) / gridSize);
    const coord = `${coordX}:${coordY}`;

    const index = selectedIslands.findIndex(island => island.coord === coord);

    if (index !== -1) {
        selectedIslands.splice(index, 1);
        islandElement.classed("selected-island", false);
    } else {
        if (selectedIslands.length < 2) {
            selectedIslands.push({ coord, coordX, coordY, element: islandElement });
            islandElement.classed("selected-island", true);
            //showIslandDetails(island)
        } else {
            resetSelectedIslands();
            selectedIslands.push({ coord, coordX, coordY, element: islandElement });
            islandElement.classed("selected-island", true);
        }
    }

    if (selectedIslands.length === 2) {
        calculateAndDisplayDistance();
    } else {
        hideDistanceDisplay();
    }
}

function hideIslandCloseup(){

    islandCloseup.style.display = "none";

    const islandCloseupHeader = document.getElementById('islandCloseupHeader').innerHTML = "";
    const islandCloseupInfo = document.getElementById('islandCloseupInfo').innerHTML = "";

}

function handleDoubleClick(element, island){

    const islandCloseup = document.getElementById('islandCloseup');

    const islandCloseupHeader = document.getElementById('islandCloseupHeader');

    islandCloseupHeader.innerHTML = `<div class="modal-header"><p>[${island.coords}]</p>
        <p><img src=${getResource(0)}> ${island.resourceLevel} 
        <img src=${getResource(island.tradegood)}> ${island.tradegoodLevel} 
        <img src=${getWonderImagePath(island.wonder)} class="wonder-image"></p>
        </div>
    `;

    const islandCloseupInfo = document.getElementById('islandCloseupInfo');

    const islandCloseupTable = document.createElement('table');

    islandCloseupTable.setAttribute('class', 'island-info-table');

    islandCloseupInfo.appendChild(populateIslandTable(islandCloseupTable, island));

    islandCloseup.style.display = 'block';
}

function showIslandDetails(islandData) {

    console.log(islandData)

    const infoPanel = document.getElementById('island-info-content');
    infoPanel.innerHTML = `
        <h4>${islandData.name}</h4>
        <p>Coordinates: ${islandData.coords}</p>
        <p>Population: ${islandData.free}</p>
        <p>Resources: ${islandData.tradegood}</p>
        <!-- Add other relevant data here -->
    `;
}

function calculateAndDisplayDistance() {
    const [island1, island2] = selectedIslands;

    const deltaX = Math.abs(island2.coordX - island1.coordX);
    const deltaY = Math.abs(island2.coordY - island1.coordY);

    const distances = {
        army: Math.sqrt(Math.pow(baseTransportSpeed.army * deltaX, 2) + Math.pow(baseTransportSpeed.army * deltaY, 2)),
        merchant: Math.sqrt(Math.pow(baseTransportSpeed.merchant * deltaX, 2) + Math.pow(baseTransportSpeed.merchant * deltaY, 2)),
        carrier: Math.sqrt(Math.pow(baseTransportSpeed.carrier * deltaX, 2) + Math.pow(baseTransportSpeed.carrier * deltaY, 2)),
        mortar: Math.sqrt(Math.pow(baseTransportSpeed.mortar * deltaX, 2) + Math.pow(baseTransportSpeed.mortar * deltaY, 2))
    }

    const distanceWithSetting = addServerSettingToDistance(distances);

    displayDistance(distanceWithSetting, island1, island2);
}

function addServerSettingToDistance(distances){

    const army = Math.ceil(distances.army / currentServerSettings.settings.armySpeedFactor);
    const merchant = Math.ceil(distances.merchant / currentServerSettings.settings.transporterSpeedFactor);
    const carrier = Math.ceil(distances.carrier / currentServerSettings.settings.fleetSpeed);
    const mortar = Math.ceil(distances.mortar / currentServerSettings.settings.fleetSpeed);
    const fleet = Math.ceil(distances.merchant / currentServerSettings.settings.fleetSpeed);

    return {
        army: army,
        merchant: merchant,
        carrier: carrier,
        mortar: mortar,
        fleet: fleet
    }    
}

function displayDistance(distance) {
    const modal = document.getElementById('distanceModal');
    
    // Get references to the columns
    const island1Info = document.getElementById('island1Info');
    const distanceInfo = document.getElementById('distanceInfo');
    const island2Info = document.getElementById('island2Info');
    
    const island1Table = document.createElement('table');
    island1Table.setAttribute('id', 'island1Table');
    island1Table.setAttribute('class', 'island-info-table');

    const island2Table = document.createElement('table');
    island2Table.setAttribute('id', 'island2Table');
    island2Table.setAttribute('class', 'island-info-table');

    const island1Data = selectedIslandsInformation[0];
    const island2Data = selectedIslandsInformation[1];

    /*
    */
    // Populate the first island information
    document.getElementById('island1Header').innerHTML = `<div class="modal-header"><p>[${island1Data.coords}]</p>
        <p><img src=${getResource(0)}> ${island1Data.resourceLevel} 
        <img src=${getResource(island1Data.tradegood)}> ${island1Data.tradegoodLevel} 
        <img src=${getWonderImagePath(island1Data.wonder)} class="wonder-image"></p>
        </div>
    `;

    document.getElementById('island2Header').innerHTML = `<div class="modal-header"><p>[${island2Data.coords}]</p>
        <p><img src=${getResource(0)}> ${island2Data.resourceLevel} 
        <img src=${getResource(island2Data.tradegood)}> ${island2Data.tradegoodLevel} 
        <img src=${getWonderImagePath(island2Data.wonder)} class="wonder-image"></p>
        </div>
    `;

    island1Info.appendChild(populateIslandTable(island1Table, island1Data));
    island2Info.appendChild(populateIslandTable(island2Table, island2Data));

    populateDistanceInfo(distanceInfo, distance);

    // Show the modal
    modal.style.display = 'block';
}

function populateDistanceInfo(distanceInfo, distance){
    
    const distanceInfoDiv = document.createElement('div');
    
    const distanceInfoHeader = document.createElement('p');

    distanceInfoHeader.setAttribute('class', 'distance-info-header');

    distanceInfoHeader.textContent = `Distance from [${selectedIslandsInformation[0].coords}] to [${selectedIslandsInformation[1].coords}] is:`;

    const distanceInfoTextDiv = document.createElement('div');

    const distanceInfoTextMerchant = document.createElement('p');
    const distanceInfoTextArmy = document.createElement('p');
    const distanceInfoTextCarrier = document.createElement('p');
    const distanceInfoTextMortar = document.createElement('p');

    distanceInfoTextMerchant.innerHTML = `<img src="images/merchant.png" class="icon"/>: ${formatTime(distance.merchant)}`;
    distanceInfoTextArmy.innerHTML = `<img src="images/army.png" class="icon"/>: ${formatTime(distance.army)}`;
    distanceInfoTextCarrier.innerHTML = `<img src="images/carrier.png" class="icon"/>${formatTime(distance.carrier)}`;
    distanceInfoTextMortar.innerHTML = `<img src="images/mortar.png" class="icon"/>${formatTime(distance.mortar)}`;

    distanceInfoTextDiv.setAttribute('class', 'distanceInfoText');

    distanceInfoTextDiv.appendChild(distanceInfoTextMerchant);
    distanceInfoTextDiv.appendChild(distanceInfoTextArmy);
    distanceInfoTextDiv.appendChild(distanceInfoTextCarrier);
    distanceInfoTextDiv.appendChild(distanceInfoTextMortar);

    distanceInfoDiv.appendChild(distanceInfoHeader);

    distanceInfoDiv.appendChild(distanceInfoTextDiv);

    distanceInfo.appendChild(distanceInfoDiv);
    
}

/**
 * 
 * @param {*} table 
 * @param { ElementCoordsDatabase } islandData 
 */
function populateIslandTable(table, islandData){

    table.innerHTML = ``;

    for(const city of islandData.data){

        const tr = document.createElement('tr');

        applyCityStateColor(tr, city.state);

        const tdOwner = document.createElement('td');

        tdOwner.textContent = `${city.playerName} [${city.alliance ? city.alliance : "-"}]`;

        tr.appendChild(tdOwner);

        const tdCity = document.createElement('td');

        tdCity.textContent = `${city.cityName} (${city.level})`;

        tr.appendChild(tdCity);

        table.appendChild(tr);
    }

    return table;

}

function hideDistanceDisplay() {
    const distanceDisplay = document.getElementById('distanceDisplay');
    if (distanceDisplay) {
        distanceDisplay.innerHTML = '';
    }

    const distanceInfo = document.getElementById('distanceInfo');

    if(distanceInfo){
        distanceInfo.innerHTML = "";
    }

    const island1Header = document.getElementById('island1Header');
    const island2Header = document.getElementById('island2Header');

    if(island1Header){
        island1Header.innerHTML = "";
    }

    if(island2Header){
        island2Header.innerHTML = "";
    }

    const island1Info = document.getElementById('island1Info');
    const island2Info = document.getElementById('island2Info');

    if(island1Info){
        island1Info.innerHTML = '<p id="island1Header"></p>';
    }
    if(island2Info){
        island2Info.innerHTML = '<p id="island2Header"></p>';
    }

    svg.selectAll(".distance-line, .distance-label").remove();
}

function resetSelectedIslands() {
    selectedIslands.forEach(island => {
        island.element.classed("selected-island", false);
    });
    selectedIslands = [];
    selectedIslandsInformation = [];
    const island1Info = document.getElementById('island1Info');
    island1Info.removeChild(document.getElementById('island1Table'));
}

function updateMapAndTable() {

    populateMap();

    const searchType = document.querySelector('input[name="searchType"]:checked').value;

    let xCoord, yCoord, cityName;
    
    if(document.querySelector('input[name="addParameter"]:checked')){
        if(document.querySelector('input[name="addParameter"]:checked').value == "coords"){
            xCoord = document.getElementById('xCoord').value;
            yCoord = document.getElementById('yCoord').value;
            
            params.set('x', xCoord);
            params.set('y', yCoord);
        }
        if(document.querySelector('input[name="addParameter"]:checked').value == "cities"){
            
            cityName = document.getElementById('cityNameInput').value;

            if(cityName.toLowerCase() == "polis"){
                alert('City name polis is not allowed');
            }
            else{
                params.set('city', cityName)

            }
    
        }
    }

    params.set('searchType', searchType);

    const searchTerms = [];
    
    for (let i = 1; i <= 5; i++) {
        const input = document.getElementById(`searchInput${i}`).value.trim().toLowerCase();
        searchTerms.push(input);

        params.set(`searchInput${i}`, input);
    }

    if (searchTerms.length === 0) {
        resetMapToDefaultState();
        return;
    }

    resetLegend();

    const islandsMatchingSearch = new Map();
    const foundCities = [];
    const allianceOnIsland = {};
    if(!!document.getElementById('additionalInput')){
        const additionalInput = document.getElementById('additionalInput').value.trim().toLowerCase();
        searchTerms.push(additionalInput);
        
        params.set(`additionalInput`, additionalInput);

    }

    updateURL(params);

    Object.keys(islandsData).forEach(coord => {

        const island = islandsData[coord];
        const islandPlayers = island.data || [];
        
        let matchingPlayers = [];
        let alliancesOnIsland = new Set();
        
        islandPlayers.forEach(city => {
            const playerNameLower = city.playerName.toLowerCase();
            const allianceNameLower = city.alliance ? city.alliance.toLowerCase() : '';

            if (searchType === 'player' && (searchTerms.includes(playerNameLower) || searchTerms.includes(city.playerID.toString()))) {
                matchingPlayers.push(city);
            } else if (searchType === 'alliance' && searchTerms.includes(allianceNameLower) && allianceNameLower.length > 0 || searchTerms.includes(playerNameLower)) {
                matchingPlayers.push(city);
            }

            if (city.alliance) {
                alliancesOnIsland.add(city.alliance);
            }
        });

        if (matchingPlayers.length > 0) {
            islandsMatchingSearch.set(coord, {
                island: island,
                matchingPlayers: matchingPlayers
            });

            allianceOnIsland[coord] = alliancesOnIsland;

            matchingPlayers.forEach(city => {
                foundCities.push({
                    ...city,
                    coords: coord,
                    wonder: island.wonder,
                    tradegood: island.tradegood,
                    tradegoodLevel: island.tradegoodLevel,
                    resourceLevel: island.resourceLevel
                });
            });
        }
    });

    svg.selectAll(".island-cell").each(function() {
        const element = d3.select(this);
        const x = +element.attr("x");
        const y = +element.attr("y");
        const coord = `${Math.round((x - margin) / gridSize)}:${Math.round((y - margin) / gridSize)}`;
        const island = islandsData[coord];
        const hasPlayers = island.data && island.data.length > 0;

        if (!hasPlayers) {
            element.attr("class", "island-cell empty");
            return;
        }

        if (islandsMatchingSearch.has(coord)) {
            const alliancesOnIsland = allianceOnIsland[coord];
            if (searchType === 'player') {
                const playersOnIsland = new Set(islandsMatchingSearch.get(coord).matchingPlayers.map(city => city.playerName.toLowerCase()));
                if (playersOnIsland.size >= 2) {
                    element.attr("class", "island-cell red");
                } else {

                    const playerIndex = searchTerms.indexOf(playersOnIsland.values().next().value);

                    element.attr("class", colorPalette[playerIndex]);
                }
            } else if (searchType === 'alliance') {
                const alliancesInSearch = new Set(
                    islandsMatchingSearch.get(coord).matchingPlayers.map(city => {
                        return city.alliance ? city.alliance.toLowerCase() : '';
                    })
                );
                if (alliancesInSearch.size >= 2) {
                    element.attr("class", "island-cell red");
                } else {
                    if (hasTwoOrMoreElements(alliancesInSearch, searchTerms)){

                        element.attr("class", "island-cell red");
                    } 
                    else {

                        const commonElement = findCommonElements(alliancesOnIsland, searchTerms)[0];

                        if(commonElement){
                            element.attr("class", colorPalette[searchTerms.indexOf(commonElement.toLowerCase())]);
                        }

                    }
                }
            }
        } else {
            element.attr("class", hasPlayers ? "island-cell yellow" : "island-cell empty");
        }
    });

    if(xCoord && yCoord){

        const selectedIsland = svg.select(`rect[xCoord="${xCoord}"][yCoord="${yCoord}"]`);
        
        selectedIsland.classed('searched', true);

    }

    if(cities.length){

        for(const city of cities){

            const selectedIsland = svg.select(`rect[xCoord="${city.xCoord}"][yCoord="${city.yCoord}"]`);

            selectedIsland.classed('searched', true);
            
            //selectedIsland.attr("class", "island-cell searced")
            
        }

    }

    const tbody = d3.select("#citiesTable tbody");
    tbody.html("");

    foundCities.sort((a, b) => a.playerName.localeCompare(b.playerName));

    generateTable(foundCities, searchType)
}

function groupPlayersByAlliance(playersData) {
    const alliances = {};

    for(const playerName in playersData){

        const allianceName = playersData[playerName][0].alliance;

        if(allianceName){
            if (!alliances[allianceName]) {
                alliances[allianceName] = [];
            }

            alliances[allianceName][playerName] = playersData[playerName];
        }

    }

    Object.keys(alliances).forEach(allianceName => {
        alliances[allianceName].sort();
    });

    return alliances;
}

function generateTable(data, searchType) {
    let groupedData = data.reduce((acc, item) => {
        if (!acc[item.playerName]) {
            acc[item.playerName] = [];
        }
        acc[item.playerName].push(item);
        return acc;
    }, {});

    const tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = '';

    if(searchType == "alliance"){
        groupedData = groupPlayersByAlliance(groupedData);
        for(const [allianceName, player] of Object.entries(groupedData)){
            
            const allianceRow = document.createElement('div');
            allianceRow.className = 'alliance-name';
            allianceRow.textContent = allianceName;
            allianceRow.addEventListener('click', () => {
                const detailsDiv = document.getElementById(`details-${allianceName}`);
                detailsDiv.classList.toggle('active');
                const allianceDetails = document.querySelectorAll(`#${allianceName}`);

                allianceDetails.forEach(element => {
                    element.classList.toggle('active');
                });
            })
            tableContainer.appendChild(allianceRow);

            const detailsDiv = document.createElement('div');
            detailsDiv.className = 'alliance-details';
            detailsDiv.id = `details-${allianceName}`;
            tableContainer.appendChild(detailsDiv);

            createRowTable(detailsDiv, player, searchType);
        }
    }
    else{
        createRowTable(tableContainer, groupedData, searchType);
    }


}

function createRowTable(tableContainer, groupedData, searchType){
    for (const [playerName, cities] of Object.entries(groupedData)) {
        const playerRow = document.createElement('div');
        if(searchType == "alliance"){
            playerRow.className = `alliance-details`;
            playerRow.id = `${cities[0].alliance}`;
        }
        else{
            playerRow.className = 'player-name';
        }
        playerRow.textContent = `${playerName} [ ${cities[0].alliance ? cities[0].alliance : "-"} ]`;
        playerRow.addEventListener('click', () => {
            const detailsDiv = document.getElementById(`details-${playerName}`);
            detailsDiv.classList.toggle('active');
        });
        tableContainer.appendChild(playerRow);

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        thead.innerHTML = `
            <tr>
                <th data-i18n="cityName">City Name</th>
                <th data-i18n="coordinates">Coordinates</th>
                <th data-i18n="wonder">Wonder</th>
                <th><img src="images/resources/wood.png" alt="Wood"></th>
                <th data-i18n="tradegood">Tradegood</th>
            </tr>
        `;
        table.appendChild(thead);

        cities.forEach((city) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${city.cityName} (${city.level})</td>
                <td>${city.coords}</td>
                <td>
                    <img src="${getWonderImagePath(city.wonder)}" alt="${getWonderName(city.wonder)}" class="wonder-image">
                </td>
                <td>${city.resourceLevel}</td>
                <td><img src="${getResource(city.tradegood)}"> (${city.tradegoodLevel})</td>
                `;
            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'city-details';
        detailsDiv.id = `details-${playerName}`;
        detailsDiv.appendChild(table);
        tableContainer.appendChild(detailsDiv);
    }
    updateContent();
}

function findCommonElements(set, array) {
    const arraySet = new Set(array);

    return [...set].filter(element => arraySet.has(element.toLowerCase()));
}

function hasTwoOrMoreElements(set, array) {
    const lowerCaseSet = new Set([...set].map(element => element.toLowerCase()));
    const count = array.map(element => element.toLowerCase()).filter(element => lowerCaseSet.has(element)).length;
    return count >= 2;
 }

function resetLegend(){

    const legendList = document.getElementById("legendList");

    legendList.innerHTML = `
        <li><span class="legend-box empty"></span> ${i18next.t('emptyIsland')}</li>
        <li><span class="legend-box yellow"></span> ${i18next.t('occupiedIsland')}</li>
        <li><span class="legend-box blue"></span> ${i18next.t('onePlayerIsland')}</li>
        <li><span class="legend-box red"></span> ${i18next.t('twoPlayersIsland')}</li>
    `;
}

function resetMapToDefaultState() {
    svg.selectAll(".island-cell")
        .attr("class", function() {
            const element = d3.select(this);
            const x = +element.attr("x");
            const y = +element.attr("y");
            const coord = `${Math.round((x - margin) / gridSize)}:${Math.round((y - margin) / gridSize)}`;
            const island = islandsData[coord];
            const hasPlayers = island.data && island.data.length > 0;
            return hasPlayers ? "island-cell occupied" : "island-cell empty";
        });

    d3.select("#citiesTable tbody").html("");
}

function applyCityStateColor(row, cityState) {
    const cityStateColors = {
        "vacation": "green",
        "inactive": "gray",
        "ban": "red",
    };
    
    const color = cityStateColors[cityState] || "black"; // Default to black
    row.style.color = color;
}

function updatePlaceholders() {
    const inputs = document.querySelectorAll('input');

    inputs.forEach(input => {
        const i18nKey = input.getAttribute('data-i18n-placeholder');
        if (i18nKey) {
            input.setAttribute('placeholder', i18next.t(i18nKey));
        }
    });
}