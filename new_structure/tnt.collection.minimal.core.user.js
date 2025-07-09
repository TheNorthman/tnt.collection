// ==UserScript==
// @name         TNT Collection Minimal Core
// @namespace    tnt.collection.core
// @version      0.1.0
// @description  Minimal TNT Collection Core for plugin testing
// @include      http*s*.ikariam.*/*
// @grant        unsafeWindow
// @require      http://localhost/refactor/tnt.collection.minimal.plugin.js
// ==/UserScript==

// Guarded TNT global setup for cross-plugin sharing
if (typeof tntGlobal === 'undefined') {
    var tntGlobal = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
    tntGlobal.tnt = tntGlobal.tnt || {};
    tntGlobal.tnt.plugins = tntGlobal.tnt.plugins || [];
}
// Always sync window.tnt for plugin access
window.tnt = tntGlobal.tnt;

// Loader: call init() on all registered plugins
(function initTNTPlugins() {
    for (const name of tntGlobal.tnt.plugins) {
        if (tntGlobal.tnt[name] && typeof tntGlobal.tnt[name].init === 'function') {
            tntGlobal.tnt[name].init();
        }
    }
})();
