export const options = {
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': ""
    }
}

export const serverWorlds = {
    'CZ': [42, 43, 44, 45, 46, 47, 48, 49],
    'EN': [56, 58, 59, 60, 61, 62, 63, 64, 301, 302, 303, 304, 305, 401, 402],
    'US': [54],
    'PL': [59, 60, 61, 62],
    'GR': [59],
    'FR': [60],
    'HU': [46, 47, 49],
    'AE': [57],
    'TR': [65]
}

export const server = {
    'CZ': 11,
    'EN': 2,
    'US': 42,
    'PL': 31,
    'GR': 16,
    'FR': 15,
    'HU': 18,
    'AE': 41,
    'TR': 40
}

export function getReverseServer(number){
    return Object.keys(server).find(key => server[key] == number);
}

let alliances = [];

let currentFocus = -1;

export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function getWorldName(worldID){
    const worlds = {
        42: "Thanatos",
        43: "Zelos",
        44: "Zephyros",
        45: "Herakles",
        46: "Hydra",
        47: "Orpheus",
        48: "Acheron",
        49: 'Kerberos',
        54: "Kreon",
        55: "Hekabe",
        56: "Kalliope",
        57: "Telemachos",
        58: "Persephone",
        59: "Perseus",
        60: "Plutos",
        61: "Minotaurus",
        62: "Medusa",
        63: "Theseus",
        64: "Kronos",
        301: "Pangaia 1",
        302: "Pangaia 2",
        303: "Pangaia 3",
        304: "Pangaia 4",
        305: "Pangaia 5",
        401: "Ares global 1",
        402: "Ares global 2"
    }
    return worlds[worldID] || "Unknown";
}

export function resetLanguageSelection() {
    const languageSelect = document.getElementById('languageSelect');
    
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    
    languageSelect.value = savedLanguage;

}

export function setLanguage(){
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
        languageSelect.value = savedLanguage;
    }
}

export function setSavedStates(){

    populateServerSelect();

    const savedServer = localStorage.getItem('preferredServer');
    const savedWorld = localStorage.getItem('preferredWorld');
    
    if (savedServer) {
        serverSelect.value = savedServer;
    }

    populateWorldSelect();

    if(savedWorld){
        worldSelect.value = savedWorld;
    }

    getAllianceList(server[savedServer], savedWorld)

}

export function populateServerSelect() {
    const serverSelect = document.getElementById('serverSelect');

    serverSelect.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.setAttribute('data-i18n', 'selectServer');
    defaultOption.textContent = i18next.t('chooseServer');
    serverSelect.appendChild(defaultOption);

    for (const server of Object.keys(serverWorlds)) {
        const option = document.createElement('option');
        option.value = server;
        option.textContent = server;
        serverSelect.appendChild(option);
    }

    const savedServer = localStorage.getItem('preferredServer');

    if(savedServer){
        serverSelect.value = savedServer;
    }

}

export function populateWorldSelect() {

    const worldSelect = document.getElementById('worldSelect');

    worldSelect.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.setAttribute('data-i18n', 'selectWorld')
    defaultOption.textContent = i18next.t('chooseWorld');
    worldSelect.appendChild(defaultOption);

    const selectedServer = document.getElementById('serverSelect').value;
    if (selectedServer && serverWorlds[selectedServer]) {
        serverWorlds[selectedServer].forEach(world => {
            const option = document.createElement('option');
            option.value = world;
            option.textContent = getWorldName(world);
            worldSelect.appendChild(option);
        });
    }

    const savedWorld = localStorage.getItem('preferredWorld');

    if(savedWorld){
        worldSelect.value = savedWorld;
    }

}

export function saveInputValues() {
    const inputs = document.querySelectorAll('input');
    const values = {};

    inputs.forEach(input => {
        values[input.id] = input.value;
    });

    return values;
}

export function restoreInputValues(savedValues) {
    const inputs = document.querySelectorAll('input');

    inputs.forEach(input => {
        input.value = savedValues[input.id] || '';
    });
}

export function formatNumber(number){

    return Intl.NumberFormat('en-US').format(number);

}

export function getWonderImagePath(wonderId) {
    const wonderImages = {
        1: 'images/wonders/forge.png',
        2: 'images/wonders/hades.png',
        3: 'images/wonders/demeter.png',
        4: 'images/wonders/athena.png',
        5: 'images/wonders/hermes.png',
        6: 'images/wonders/ares.png',
        7: 'images/wonders/poseidon.png',
        8: 'images/wonders/kolos.png'
    };
    return wonderImages[wonderId] || 'images/wonders/default.png';
}

export function getWonderName(wonderId) {
    const wonders = {
        1: "Hephaestus' Forge",
        2: "Hades' Holy Grove",
        3: "Demeter's gardens",
        4: "Athena's Parthenon",
        5: "Temple of Hermes",
        6: "Ares' Stronghold",
        7: "Temple of Poseidon",
        8: "Colossus"
    };
    return wonders[wonderId] || "Unknown";
}

export function getResource(resourceId){
    const resources = {
        0: "images/resources/wood.png",
        1: "images/resources/wine.png",
        2: "images/resources/marble.png",
        3: "images/resources/crystal.png",
        4: "images/resources/sulphur.png",
    }
    return resources[resourceId] || "Unknown";
}

export function getTradegoodName(resourceId){
    const resources = {
        0: "Wood",
        1: "Wine",
        2: "Marble",
        3: "Crystal",
        4: "Sulphur",
    }
    return resources[resourceId] || "Unknown";
}

export function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const timeParts = [];

    if (days > 0) timeParts.push(`${days}d`);
    if (hours > 0) timeParts.push(`${hours}h`);
    if (minutes > 0) timeParts.push(`${minutes}m`);
    if (secs > 0 || timeParts.length === 0) timeParts.push(`${secs}s`);

    return timeParts.join(':');
}

export const languageSelect = document.getElementById('languageSelect');
export const selectedLanguage = languageSelect.value;

export const serverSelect = document.getElementById('serverSelect');
export const selectedServer = server[serverSelect.value];
export const worldSelect = document.getElementById('worldSelect');
export const selectedWorld = worldSelect.value;

export const saveButton = document.getElementById('save-settings');

export function filterAlliances(query) {
    return alliances.filter(alliance => alliance.toLowerCase().includes(query.toLowerCase()));
}

export function highlightSuggestion(suggestions, index) {
    removeActive(suggestions);
    if (index >= 0 && index < suggestions.length) {
        suggestions[index].classList.add('autocomplete-active');
        currentFocus = index;
        suggestions[index].scrollIntoView({ block: "nearest" });
    }
}

export function removeActive(suggestions) {
    suggestions.forEach(suggestion => {
        suggestion.classList.remove('autocomplete-active');
    });
}

export function showSuggestions(inputElement, inputValue) {
    let suggestionsBox = inputElement.nextElementSibling;

    if (!suggestionsBox || !suggestionsBox.classList.contains('suggestions-box')) {
        suggestionsBox = document.createElement('div');
        suggestionsBox.classList.add('suggestions-box');
        inputElement.parentNode.appendChild(suggestionsBox);
    }

    suggestionsBox.innerHTML = '';

    if (inputValue === '') {
        suggestionsBox.style.display = 'none';
        return;
    }

    const filteredAlliances = filterAlliances(inputValue);

    if (filteredAlliances.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
    }

    currentFocus = -1;

    const inputRect = inputElement.getBoundingClientRect();
    suggestionsBox.style.width = `${inputRect.width}px`;
    suggestionsBox.style.position = 'absolute';
    suggestionsBox.style.left = `${inputRect.left + window.scrollX}px`;
    suggestionsBox.style.top = `${inputRect.bottom + window.scrollY}px`;

    filteredAlliances.forEach((alliance) => {
        const suggestion = document.createElement('div');
        suggestion.textContent = alliance;

        suggestion.addEventListener('click', () => {
            inputElement.value = alliance;
            suggestionsBox.style.display = 'none';
        });

        suggestionsBox.appendChild(suggestion);
    });

    suggestionsBox.style.display = 'block';
}

export function handleKeyDown(event, inputElement) {
    const suggestionsBox = inputElement.nextElementSibling;
    
    if (suggestionsBox && suggestionsBox.childNodes.length > 0) {
        const suggestions = Array.from(suggestionsBox.querySelectorAll('div'));

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                currentFocus++;
                if (currentFocus >= suggestions.length) currentFocus = 0;
                highlightSuggestion(suggestions, currentFocus);
                break;

            case 'ArrowUp':
                event.preventDefault();
                currentFocus--;
                if (currentFocus < 0) currentFocus = suggestions.length - 1;
                highlightSuggestion(suggestions, currentFocus);
                break;

            case 'Enter':
                event.preventDefault();
                if (currentFocus > -1 && suggestions[currentFocus]) {
                    inputElement.value = suggestions[currentFocus].textContent;
                    suggestionsBox.style.display = 'none';
                }
                break;

            case 'Escape':
                suggestionsBox.style.display = 'none';
                break;
        }
    }
}

export function getCSSVariable(variableName) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

export function getAllianceList(){

    const selectedServer = server[serverSelect.value];
    const selectedWorld = worldSelect.value;

    if(!selectedServer || !selectedWorld) return;

    fetch(`https://api.ika-map.com/alliancesOnServer/?server=${selectedServer}&world=${selectedWorld}`, options)
        .then(response => response.json())
        .then(data => {
            alliances = data;
        })
        .catch(error => {
            console.error('Error loading JSON:', error);
        });

}

export function formatDate(date){

    return `${date.day}.${date.month}.${date.year} ${date.time}`;

}

export const colorChoices = [
    getCSSVariable('--color-1'),
    getCSSVariable('--color-2'),
    getCSSVariable('--color-3'),
    getCSSVariable('--color-4'),
    getCSSVariable('--color-5'),
    getCSSVariable('--color-6')
]

export function updateURL(searchParams){

    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;

    history.pushState(null, '', newUrl);
    
}