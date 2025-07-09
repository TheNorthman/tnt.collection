// ==UserScript==
// @name         TNT Test
// @namespace    tnt.collection.core
// @version      0.1.7
// @description  Minimal TNT Collection Core for plugin testing
// @include      http*s*.ikariam.*/*
// @grant        unsafeWindow
// @require      http://localhost/new_structure/test.plugin.user.js
// ==/UserScript==

// Guarded TNT global setup for cross-plugin sharing
if (typeof tntGlobal === 'undefined') {
    var tntGlobal = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
    tntGlobal.tnt = tntGlobal.tnt || {};
    tntGlobal.tnt.plugins = tntGlobal.tnt.plugins || [];
}

// Add main script logic and utilities to tnt namespace
tntGlobal.tnt.core = {
    initPlugins: function() {
        for (const name of tntGlobal.tnt.plugins) {
            if (tntGlobal.tnt[name] && typeof tntGlobal.tnt[name].init === 'function') {
                tntGlobal.tnt[name].init();
            }
        }
    }
};

// Always sync window.tnt for plugin access
window.tnt = tntGlobal.tnt;

// Run loader
tntGlobal.tnt.core.initPlugins();
