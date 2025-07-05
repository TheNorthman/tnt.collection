// ==UserScript==
// @name         TNT Collection Dev
// @version      1.0.2
// @namespace    tnt.collection.dev
// @author       Ronny Jespersen
// @description  TNT Collection Development - Clean slate for new features
// @license      MIT
// @include      http*s*.ikariam.*/*
// @exclude      http*support*.ikariam.*/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// ==/UserScript==

// ===== AI-NOTICE: IMPORTANT FOR AI TOOLS - HUMAN SUPERVISION REQUIRED FOR THIS SECTION =====
// This is an extension of the TNT Collection core script (tnt.collection.core.user.js).
// It provides a simplified architecture for development purposes.
// The script initializes a simplified version of the TNT Collection with a focus on development features.
// It includes a settings object for managing user settings, a get object for retrieving city information,
// and an experimental feature section for testing new functionalities.
// Things to be aware of:
// - The settings object uses GM_getValue and GM_setValue with a 'dev_' prefix to avoid conflicts with the core script.
// - The get object provides methods to retrieve the current city ID and list of cities.
// !!! It is important to keep both tnt.settings and tnt.get in sync with the core script.
// =============================================================

// Clean slate - ready for next development project
const tnt = {
    version: "1.0.0-dev",

    settings: {
        get(key, defaultValue = null) {
            return GM_getValue('dev_' + key, defaultValue);
        },
        set(key, value) {
            GM_setValue('dev_' + key, value);
        }
    },

    // Place any methods here from Core that are needed to retrieve information.
    // Place them in the tnt.get object exactly as they are in the Core script.
    get: {

    },

    init() {
        console.log('[TNT-Dev] Initializing TNT Collection Development Environment');
        console.log('[TNT-Dev] Version:', tnt.version); // ✅ FIXED: Use tnt.version, not tntDev.version
        console.log('[TNT-Dev] Core TNT Version:', typeof window.tnt !== 'undefined' ? window.tnt.version : 'Not loaded');
    },

    // Add modules/functions here as needed for development
    test: {}
};

// Extend the existing tnt object with development features
// Wait for tnt to be available, then add dev features
$(document).ready(() => {
    // Wait a bit for the core script to initialize
    setTimeout(() => {
        if (typeof tnt !== 'undefined') {
            console.log('[TNT-Dev] Extending TNT Collection with development features');
        }
    }, 1000); // Wait 1 second for core to load
});
