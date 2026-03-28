// ==UserScript==
// @name         TNT Collection
// @version      2.1.0
// @namespace    tnt.collection
// @author       TheNorthman
// @description  TNT Collection Tools for Ikariam
// @license      MIT
// @include      *://s*.ikariam.gameforge.com/*
// @exclude      *://support*.ikariam.gameforge.com/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @downloadURL  https://raw.githubusercontent.com/TheNorthman/tnt.collection/main/dist/tnt-collection.user.js
// @updateURL    https://raw.githubusercontent.com/TheNorthman/tnt.collection/main/dist/tnt-collection.user.js
// ==/UserScript==


// Special testing code that Ronny used to set the main and secondary dialog boxes
// = Ikariam scaling fix =
//ikariam.worldview_scale_city = 1;
//ikariam.worldview_scale_island = 1;
//ikariam.worldview_scale_max = 1;
//ikariam.worldview_scale_min = 0.90;
//ikariam.worldview_scale_worldmap = 1;
// ikariam.worldview_scroll_left_city = 240;
//ikariam.worldview_scroll_left_island = 265;
//ikariam.worldview_scroll_top_city = 120;
//ikariam.worldview_scroll_top_island = 190;
// Object.defineProperty(ikariam, "worldview_scale_min", {
//   set: v => Reflect.set(ikariam, "_worldview_scale_min", Math.max(0.94, v)),
//   get: () => ikariam._worldview_scale_min ?? 0.94,
//   configurable: true
// });

// ikariam.worldview_scale_city = 0.94;
