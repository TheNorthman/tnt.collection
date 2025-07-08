// ==UserScript==
// @name         TNT Styles Plugin
// @namespace    tnt.collection.plugins
// @description  Adds TNT Collection styles
// @author       Ronny Jespersen
// @grant        GM_addStyle
// ==/UserScript==

window.tnt = window.tnt || {};
window.tnt.plugins = window.tnt.plugins || [];

window.tnt.plugins.push(function initStylesPlugin(tnt) {
    tnt.core.debug.log(`[TNT] Initializing styles plugin v1.0.9`, 2);

    function addStyle(css) {
        const style = document.createElement('style');
        style.textContent = css;
        const target = document.head || document.documentElement;
        target.appendChild(style);
    }

addStyle(`
/* 01. CORE TABLE STRUCTURE */
.tnt-table {
    border-collapse: collapse;
    font: 12px Arial, Helvetica, sans-serif;
    background-color: #fdf7dd;
    table-layout: fixed;
    width: auto;
}
.tnt-table th,
.tnt-table td {
    padding: 4px;
    border: 1px solid #000;
    vertical-align: middle;
}

/* 02. HEADER STYLES */
.tnt-table-header-empty {
    margin: 0 !important;
    padding: 0 !important;
    background-color: #DBBE8C;
}
.tnt-table-header-category {
    background-color: #DBBE8C;
    font-weight: bold;
    text-align: center;
}
.tnt-table-header-subcategory {
    background-color: #faeac6;
    font-weight: bold;
    text-align: center;
}
.tnt-table-header-city-text {
    font-weight: bold;
}
.tnt_subcategory_header {
    height: 32px;
}
.tnt_subcategory_header th {
    height: 32px;
    min-height: 32px;
    max-height: 32px;
    vertical-align: middle;
    overflow: hidden;
}

/* 03. CELL ALIGNMENT */
.tnt-table-cell-city {
    text-align: left !important;
    white-space: nowrap;
}
.tnt-table-cell-population,
.tnt-table-cell-citizens,
.tnt-table-cell-resource,
.tnt-table-cell-building {
    text-align: right;
    white-space: nowrap;
}
.tnt-table-cell-total {
    font-weight: bold;
    background-color: #faeac6;
}
.tnt-table-cell-total-empty,
.tnt-table-cell-building-empty {
    background-color: #fdf7dd;
}
`);

addStyle(`
/* 04. ICON STYLING */
.tnt_resource_icon {
    width: 18px !important;
    height: 16px !important;
    vertical-align: middle !important;
    display: inline-block !important;
    margin-right: 2px;
}
.tnt_building_icon {
    width: 36px !important;
    height: 32px !important;
    max-height: 32px;
    vertical-align: middle !important;
    margin-right: 2px;
}
img[src*='/city/wall.png'].tnt_building_icon {
    transform: scale(0.8) !important;
    transform-origin: 0 0;
    margin-right: -8px;
}
.tnt_population_icon {
    width: 10px !important;
    height: 17px !important;
    vertical-align: middle !important;
    display: inline-block !important;
    margin-right: 2px;
}

/* 05. PANEL LAYOUT */
#tnt_info_resources {
    position: fixed;
    bottom: 20px !important;
    left: 0 !important;
    z-index: 1000000 !important;
    background-color: #DBBE8C;
    font: 12px Arial, Helvetica, sans-serif;
    box-shadow: 0 -2px 6px rgba(0,0,0,0.3);
    padding: 0 !important;
    margin: 0 !important;
}
#tnt_info_resources_content,
#tnt_info_buildings_content {
    overflow-x: auto;
    max-height: 400px;
    padding: 0 !important;
}
#tnt_resources_table,
#tnt_buildings_table {
    margin: 0 !important;
    padding: 0 !important;
    border-collapse: collapse !important;
    border: 1px solid #000 !important;
}
#tnt_info_resources_content > :last-child,
#tnt_info_buildings_content > :last-child {
    margin-bottom: 0 !important;
}
#tnt_info_buildings_content {
    /* display: none !important; */
}
`);

addStyle(`
/* 06. BUILDING STATES */
.tnt_building_level {
    text-align: center;
}
.tnt_building_maxed {
    background-color: #d0ffd0;
}
.tnt_construction {
    background-color: #80404050 !important;
    border-left: 2px solid #804040 !important;
}
.tnt_progress_visited {
    background-color: #90EE9050 !important;
    border-left: 2px solid #32CD32 !important;
}
.tnt_progress_visited.tnt_construction {
    background-color: #d4edda !important;
    color: #155724 !important;
}

/* 07. INLINE CONTROLS BAR */
.tnt-inline-controls-bar {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 4px 6px;
    background: #dbc49c;
    border-bottom: 1px solid #b49b6c;
    box-sizing: border-box;
    height: 24px;
    line-height: 0;
}
.tnt-inline-controls {
    display: flex;
    gap: 6px;
    align-items: center;
    height: 24px;
    overflow: hidden;
}
.tnt-inline-controls span {
    line-height: normal;
}
.tnt_left_buttons {
    justify-content: flex-start;
}
.tnt_right_buttons {
    justify-content: flex-end;
    margin-left: auto;
}
`);

addStyle(`
/* 08. CONTROL BUTTONS */
.tnt_panel_minimize_btn,
.tnt_refresh_btn,
.tnt_table_toggle_btn {
    width: 18px;
    height: 18px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    cursor: pointer;
    margin: 0 2px;
    padding: 0;
    vertical-align: middle;
    align-self: center;
    border: 1px solid #8B4513;
    background: linear-gradient(135deg, #E6D3A3 0%, #D2B48C 50%, #C4A47C 100%);
    border-radius: 3px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
    transition: all 0.2s ease;
}
.tnt_panel_minimize_btn:hover,
.tnt_refresh_btn:hover,
.tnt_table_toggle_btn:hover {
    background: linear-gradient(135deg, #F0E4B6 0%, #E6D3A3 50%, #D2B48C 100%);
    transform: scale(1.05);
    box-shadow: 0 3px 6px rgba(0,0,0,0.4);
    border-color: #654321;
}
.tnt_panel_minimize_btn:active,
.tnt_refresh_btn:active,
.tnt_table_toggle_btn:active {
    transform: scale(1.02);
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

/* 08a. MINIMIZE TRIANGLE (embedded) */
.tnt_panel_minimize_btn {
    position: relative;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
}
.tnt_panel_minimize_btn::before {
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 8px solid #333;
}
.tnt_panel_minimize_btn:hover::before {
    border-right-color: #000;
}

/* 08b. ICON BUTTONS */
.tnt_refresh_btn::after,
.tnt_table_toggle_btn::after {
    display: inline-block;
    line-height: 1;
    vertical-align: middle;
    font-weight: bold;
    color: #333;
}
.tnt_refresh_btn::after {
    content: '⟳';
    font-size: 15px;
    transform: translateY(-1px); /* was 1px, now nudged up */
    line-height: 1;
    vertical-align: middle;
    font-weight: bold;
    color: #333;
}
.tnt_table_toggle_btn::after {
    content: '≡';
    font-size: 16px;
    transform: translateY(0px);
}
.tnt_refresh_btn:hover::after,
.tnt_table_toggle_btn:hover::after {
    color: #000;
    transform: scale(1.1);
}

/* 09. STATE CLASSES */
#tnt_info_resources.minimized td:not(:first-child),
#tnt_info_resources.minimized th:not(:first-child) {
    display: none !important;
}

/* 10. TOOLTIP, HIGHLIGHTS & UTILITIES  */
.tnt-tooltip-content {
    font-size: 11px;
    line-height: 1.4;
    color: #333;
}
.tnt-tradegood-bold {
    font-weight: bold;
    color: #111 !important; /* or #222 for slightly softer contrast */
}
.tnt-hide {
    display: none !important;
}

.tnt_selected {
    border: 2px solid #000 !important;
    box-sizing: border-box;
}

.tnt_storage_min,
.tnt_storage_max {
    background-color: #ffaaaa !important;
}

.tnt-construction-background {
    background-color: #dbc49c !important; /* Matches TNT panel tone */
    color: #222 !important;
}

`);


});