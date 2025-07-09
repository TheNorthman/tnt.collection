// ==UserScript==
// @name         TNT Collection Minimal Plugin
// @namespace    tnt.collection.minimal
// @version      0.1.0
// @description  Minimal TNT plugin for core test
// ==/UserScript==

// Guarded TNT global setup for cross-plugin sharing
if (typeof tntGlobal === 'undefined') {
    var tntGlobal = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
    tntGlobal.tnt = tntGlobal.tnt || {};
    tntGlobal.tnt.plugins = tntGlobal.tnt.plugins || [];
}
// Always sync window.tnt for plugin access
window.tnt = tntGlobal.tnt;

// Register plugin
window.tnt.minimal = {
    name: 'minimal',
    version: '0.1.0',
    css: '',
    init() {
        // Basic test: add a div to the page
        const div = document.createElement('div');
        div.id = 'tnt-minimal-test';
        div.textContent = 'TNT Minimal Plugin Loaded!';
        div.style = 'position:fixed;top:10px;left:10px;background:#ffc;padding:8px;z-index:99999;border:1px solid #333;';
        document.body.appendChild(div);
    }
};
window.tnt.plugins.push('minimal');
