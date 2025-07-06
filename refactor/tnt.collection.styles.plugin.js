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
    tnt.core.debug.log(`[TNT] Initializing styles plugin v1.0.3`, 2);

    function addStyle(css) {
        const style = document.createElement('style');
        style.textContent = css;

        // Inject into the real page context
        const target = document.head || document.documentElement;
        target.appendChild(style);
    }

    addStyle(`
        /* Show level styles - using table background color */
        .tntLvl{
            position: absolute !important;
            top: 32px !important;
            left: 44px !important;
            color: #000 !important;
            line-height: 16px !important;
            background-color: #DBBE8C !important;
            font-size: 9px !important;
            font-weight: bold !important;
            text-align: center !important;
            vertical-align: middle !important;
            height: 16px !important;
            width: 16px !important;
            border-radius: 50% !important;
            border: 1px solid #000 !important;
            display: inline-block !important;
            box-shadow: 0 1px 2px rgba(0,0,0,0.3) !important;
            z-index: 1000 !important;
            pointer-events: none !important;
        }
        .tntLvl:hover {
            background-color: #faeac6 !important;
            transform: scale(1.05) !important;
            transition: all 0.2s ease !important;
        }
        /* TNT table styles with higher specificity - override Ikariam's .table01 styles */
        body #tnt_info_resources #tnt_resources_table,
        body #tnt_info_buildings_content #tnt_buildings_table{
            border-collapse: collapse !important;
            font: 12px Arial, Helvetica, sans-serif !important;
            background-color: #fdf7dd !important;
            table-layout: fixed !important;
        }
        
        /* Category header cells - CLEAN and SIMPLE with no internal elements */
        body #tnt_info_resources #tnt_resources_table th.tnt_category_header,
        body #tnt_info_buildings_content #tnt_buildings_table th.tnt_category_header {
            height: 25px !important;
            max-height: 25px !important;
            min-height: 25px !important;
            background-color: #DBBE8C !important;
            border: 1px solid #000 !important;
            padding: 4px !important;
            font-weight: bold !important;
            text-align: center !important;
            box-sizing: border-box !important;
            line-height: 17px !important;
            font-size: 12px !important;
            vertical-align: middle !important;
        }
        
        /* External control buttons container - positioned OUTSIDE table, overlaying */
        .tnt_external_controls {
            position: absolute !important;
            top: 2px !important;
            left: 2px !important;
            width: 116px !important;
            height: 18px !important;
            z-index: 1000 !important;
            pointer-events: none !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 0 !important;
            box-sizing: border-box !important;
        }
        
        /* Left buttons container (Min/Max) */
        .tnt_left_buttons {
            display: flex !important;
            align-items: center !important;
            gap: 0px !important;
            pointer-events: none !important;
            flex-shrink: 0 !important;
        }
        
        /* Right buttons container (Refresh, Toggle) */
        .tnt_right_buttons {
            margin-top: 5px !important;
            display: flex !important;
            align-items: center !important;
            gap: 2px !important;
            pointer-events: none !important;
            flex-shrink: 0 !important;
            height: 18px !important;
        }
        
        /* Individual control buttons - perfectly sized and aligned */
        .tnt_left_buttons span,
        .tnt_right_buttons span {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            height: 18px !important;
            width: 18px !important;
            min-height: 18px !important;
            min-width: 18px !important;
            max-height: 18px !important;
            max-width: 18px !important;
            border: 1px solid #8B4513 !important;
            background: linear-gradient(135deg, #E6D3A3 0%, #D2B48C 50%, #C4A47C 100%) !important;
            border-radius: 3px !important;
            cursor: pointer !important;
            flex-shrink: 0 !important;
            pointer-events: auto !important;
            position: relative !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
            font-size: 0 !important;
            line-height: 1 !important;
            padding: 0 !important;
            margin: 0 !important;
            box-sizing: border-box !important;
        }
        
        .tnt_left_buttons span:hover,
        .tnt_right_buttons span:hover {
            background: linear-gradient(135deg, #F0E4B6 0%, #E6D3A3 50%, #D2B48C 100%) !important;
            transform: translateY(-1px) scale(1.05) !important;
            box-shadow: 0 3px 6px rgba(0,0,0,0.4) !important;
            border-color: #654321 !important;
        }
        
        .tnt_left_buttons span:active,
        .tnt_right_buttons span:active {
            transform: translateY(0px) scale(1.02) !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
        }
        
        /* Minimize button icons - properly centered triangles */
        .tnt_left_buttons .tnt_panel_minimize_btn.tnt_back:after { 
            content: "";
            display: block;
            width: 0;
            height: 0;
            border: 3px solid transparent;
            border-right: 5px solid #333;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        
        .tnt_left_buttons .tnt_panel_minimize_btn.tnt_back:hover:after { 
            border-right-color: #000;
        }
        
        .tnt_left_buttons .tnt_panel_minimize_btn.tnt_foreward:after { 
            content: "";
            display: block;
            width: 0;
            height: 0;
            border: 3px solid transparent;
            border-left: 5px solid #333;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        
        .tnt_left_buttons .tnt_panel_minimize_btn.tnt_foreward:hover:after { 
            border-left-color: #000;
        }
        
        /* Toggle button icon - three centered lines */
        .tnt_right_buttons .tnt_table_toggle_btn:after {
            content: "";
            display: block;
            width: 8px;
            height: 2px;
            background: #333;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 
                0 -3px 0 #333,
                0 3px 0 #333;
            border-radius: 1px;
        }
        
        .tnt_right_buttons .tnt_table_toggle_btn:hover:after {
            background: #000;
            box-shadow: 
                0 -3px 0 #000,
                0 3px 0 #000;
        }
        
        .tnt_right_buttons .tnt_table_toggle_btn.active:after {
            background: #006600;
            box-shadow: 
                0 -3px 0 #006600,
                0 3px 0 #006600;
        }
        
        /* Refresh button icon - perfectly centered */
        .tnt_right_buttons .tnt_refresh_btn:before {
            content: "⟳";
            color: #333;
            font-size: 13px;
            font-weight: bold;
            text-shadow: 0 1px 2px rgba(255,255,255,0.7) !important;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            line-height: 1;
            width: 13px;
            height: 13px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .tnt_right_buttons .tnt_refresh_btn:hover:before {
            color: #000;
            font-weight: 900;
            text-shadow: 0 1px 3px rgba(255,255,255,0.9) !important;
        }
        
        /* Remove old control button styles that are no longer needed */
        .tnt_control_buttons {
            display: none !important;
        }
        
        /* Minimize button icons */
        .tnt_control_buttons .tnt_panel_minimize_btn.tnt_back:after { 
            content: "";
            display: block;
            width: 0;
            height: 0;
            border: 3px solid transparent;
            border-right: 5px solid #333;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        
        .tnt_control_buttons .tnt_panel_minimize_btn.tnt_back:hover:after { 
            border-right-color: #000;
        }
        
        .tnt_control_buttons .tnt_panel_minimize_btn.tnt_foreward:after { 
            content: "";
            display: block;
            width: 0;
            height: 0;
            border: 3px solid transparent;
            border-left: 5px solid #333;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        
        .tnt_control_buttons .tnt_panel_minimize_btn.tnt_foreward:hover:after { 
            border-left-color: #000;
        }
        
        /* Toggle button icon */
        .tnt_control_buttons .tnt_table_toggle_btn:after {
            content: "";
            display: block;
            width: 6px;
            height: 1px;
            background: #333;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 
                0 -2px 0 #333,
                0 2px 0 #333;
        }
        
        .tnt_control_buttons .tnt_table_toggle_btn:hover:after {
            background: #000;
            box-shadow: 
                0 -2px 0 #000,
                0 2px 0 #000;
        }
        
        .tnt_control_buttons .tnt_table_toggle_btn.active:after {
            background: #006600;
            box-shadow: 
                0 -2px 0 #006600,
                0 2px 0 #006600;
        }
        
        /* Refresh button icon */
        .tnt_control_buttons .tnt_refresh_btn:before {
            content: "⟳";
            color: #333;
            font-size: 14px;
            font-weight: bold;
            text-shadow: 0 1px 1px rgba(255,255,255,0.5);
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            line-height: 1;
        }
        
        .tnt_control_buttons .tnt_refresh_btn:hover:before {
            color: #000;
            font-weight: 900;
            text-shadow: 0 1px 2px rgba(255,255,255,0.8);
        }
        
        /* Remove all old button styles that conflict with new structure */
        // .tnt_table_toggle_btn:not(.tnt_control_buttons *), // Should always be visible
        #tnt_info_resources .tnt_back,
        #tnt_info_resources .tnt_foreward,
        #tnt_info_updateCities,
        .tnt_panel_minimize_btn:not(.tnt_control_buttons *) {
            display: none !important;
        }
        
        .tnt_city .tnt_panel_minimize_btn {
            display: none !important;
        }
        
        /* Remove old category spacer styles that are no longer needed */
        .tnt_category_spacer {
            display: none !important;
        }
        /* Construction status styling applies to the first cell in any row across all tables */
        // .tnt_construction{
        //     background-color: #80404050 !important;
        // }
        .tnt_construction {
            background-color: #80404050 !important;
            border-left: 2px solid #804040 !important;
        }    
        /* Phase 4: Visual progress indicators */
        .tnt_progress_visited {
            background-color: #90EE9050 !important;
            border-left: 2px solid #32CD32 !important;
        }
        
        /* Ensure progress indicators work with selected state */
        body #tnt_info_resources .tnt_selected .tnt_progress_visited,
        body #tnt_info_buildings_content .tnt_selected .tnt_progress_visited {
            background-color: #90EE9050 !important;
            border-left: 2px solid #32CD32 !important;
        }
        
        /* Progress indicator takes precedence over construction during active switching */
        // .tnt_progress_visited.tnt_construction {
        //     background-color: #90EE9050 !important;
        //     border-left: 2px solid #32CD32 !important;
        // }
        .tnt_progress_visited.tnt_construction {
            background-color: #d4edda !important;
            color: #155724 !important;
        }    
        /* === RESOURCE STORAGE INDICATORS (FIX FOR ISSUE #002) === */
        
        /* Storage danger - high storage warning (RED text, no borders) */
        .tnt_storage_danger {
            //background-color: #ffaaaa !important;
            color: #ff0000 !important;
        }
        
        /* Storage minimum - low resource warning (YELLOW background, no borders) */
        .tnt_storage_min {
            background-color: #ffaaaa !important;
        }
        
        /* Ensure storage indicators work with TNT table styling */
        body #tnt_info_resources .tnt_storage_danger,
        body #tnt_info_buildings_content .tnt_storage_danger {
            //background-color: #ffaaaa !important;
        }
        
        body #tnt_info_resources .tnt_storage_min,
        body #tnt_info_buildings_content .tnt_storage_min {
            background-color: #ffaaaa !important;
        }
        
        /* Storage indicators with current city selection */
        body #tnt_info_resources .tnt_selected .tnt_storage_danger,
        body #tnt_info_buildings_content .tnt_selected .tnt_storage_danger {
            //background-color: #ffaaaa !important;
        }
        
        body #tnt_info_resources .tnt_selected .tnt_storage_min,
        body #tnt_info_buildings_content .tnt_selected .tnt_storage_min {
            background-color: #ffaaaa !important;
        }
        
        /* Storage indicators take precedence over construction status */
        .tnt_storage_danger.tnt_construction {
            //background-color: #ffaaaa !important;
        }
        
        .tnt_storage_min.tnt_construction {
            background-color: #ffaaaa !important;
        }
        
        /* Remove old category spacer styles that are no longer needed */
        .tnt_category_spacer {
            display: none !important;
        }
        /* Construction status styling applies to the first cell in any row across all tables */
        .tnt_construction{
            background-color: #80404050 !important;
        }
        /* Current city highlighting with 2px black border - no background change */
        body #tnt_info_resources .tnt_selected,
        body #tnt_info_buildings_content .tnt_selected {
            border: 2px solid black !important;
        }
        body #tnt_info_resources .tnt_selected td,
        body #tnt_info_buildings_content .tnt_selected td {
            border-top: 2px solid black !important;
            border-bottom: 2px solid black !important;
            // color: #000 !important;
        }
        body #tnt_info_resources .tnt_selected td:first-child,
        body #tnt_info_buildings_content .tnt_selected td:first-child {
            border-left: 2px solid black !important;
        }
        body #tnt_info_resources .tnt_selected td:last-child,
        body #tnt_info_buildings_content .tnt_selected td:last-child {
            border-right: 2px solid black !important;
        }
        /* Make tradegood production more visible with dark grey text color */
        body #tnt_info_resources .tnt_bold,
        body #tnt_info_buildings_content .tnt_bold {
            color: #333333 !important;
            font-weight: bold !important;
        }
        .tnt_resource_icon{
            vertical-align:middle !important;
            width:18px !important;
            height:16px !important;
            display:inline-block !important;
        }
        .tnt_building_icon {
            width: 36px !important;
            height: 32px !important;
        }
        img[src*='/city/wall.png'].tnt_building_icon {
            transform: scale(0.8) !important;
            transform-origin: 0 0;
            margin-right: -8px;
        }
        body #tnt_info_resources .tnt_population{ text-align:right !important; }
        body #tnt_info_resources .tnt_citizens{ text-align:right !important; }
        body #tnt_info_resources .tnt_wood{ text-align:right !important; }
        body #tnt_info_resources .tnt_marble{ text-align:right !important; }
        body #tnt_info_resources .tnt_wine{ text-align:right !important; }
        body #tnt_info_resources .tnt_crystal{ text-align:right !important; }
        body #tnt_info_resources .tnt_sulfur{ text-align:right !important; }
        body #tnt_info_resources .tnt_city{ text-align:left !important; }
        body #tnt_info_buildings_content .tnt_city{ text-align:left !important; }
        body #tnt_info_buildings_content .tnt_building_level{ text-align:center !important; }
        
        /* Override Ikariam's container table styles specifically for our TNT tables */
        #container body #tnt_info_resources #tnt_resources_table.table01,
        #container body #tnt_info_buildings_content #tnt_buildings_table.table01 {
            border: none !important;
            margin: 0px !important;
            background-color: #fdf7dd !important;
            border-bottom: none !important;
            text-align: center !important;
            width: auto !important;
        }
        #container body #tnt_info_resources #tnt_resources_table.table01 td,
        #container body #tnt_info_buildings_content #tnt_buildings_table.table01 td {
            text-align: center !important;
            vertical-align: middle !important;
            padding: 4px !important;
            border: 1px #000000 solid !important;
        }
        #container body #tnt_info_resources #tnt_resources_table.table01 th,
        #container body #tnt_info_buildings_content #tnt_buildings_table.table01 th {
            background-color: #faeac6 !important;
            text-align: center !important;
            height: auto !important;
            padding: 4px !important;
            font-weight: bold !important;
            border: 1px #000000 solid !important;
        }
        
        #mainview a:hover{ text-decoration:none; }
        #tntOptions {
            position:absolute;
            top:40px;
            left:380px;
            width:620px;
            border:1px #755931 solid;
            border-top:none;
            background-color: #FEE8C3;
            padding:10px 10px 0px   10px;
        }

        #tntOptions legend{ font-weight:bold; }
        .tntHide, #infocontainer .tntLvl, #actioncontainer .tntLvl{ display:none; }
        #tntInfoWidget {
            position:fixed;
            bottom:0px;
            left:0px;
            width:716px;
            background-color: #DBBE8C;
            z-index:100000000;
        }
        #tntInfoWidget .accordionTitle {

            background: url(/cdn/all/both/layout/bg_maincontentbox_header.jpg) no-repeat;
            padding: 6px 0 0;
            width: 728px;
        }
        #tntInfoWidget .accordionContent {
            background: url(/cdn/all/both/layout/bg_maincontentbox_left.png) left center repeat-y #FAF3D7;
            overflow: hidden;
            padding: 0;
            position: relative;
            width: 725px;
        }
        #tntInfoWidget .scroll_disabled {
            background: url(/cdn/all/both/layout/bg_maincontentbox_left.png) repeat-y scroll left center transparent;
            width: 9px;
        }
        #tntInfoWidget .scroll_area {
            background: url(/cdn/all/both/interface/scroll_bg.png) right top repeat-y transparent;
            display: block;
            height: 100%;
            overflow: hidden;
            position: absolute;
            right: -3px;
            width: 24px;
            z-index: 100000;
        }
        .txtCenter{ text-align:center; }
        .tnt_center{ text-align:center!important; white-space:nowrap; }
        .tnt_right{ text-align:right!important; white-space:nowrap; }
        .tnt_left{ text-align:left!important; white-space:nowrap; }
        #tnt_info_resources{
            position:fixed;
            bottom:20px;
            left:0px;
            width:auto;
            height:auto;
            background-color: #DBBE8C;
            z-index:100000000;
        }
        #tnt_info_resources .tnt_back, #tnt_info_resources .tnt_foreward {
            cursor: pointer;
            display: block!important;
            height: 18px;
            width: 18px;
            border: 1px solid #8B4513;
            background: #D2B48C;
            border-radius: 2px;
            text-align: center;
            line-height: 16px;
            font-size: 12px;
            min-width: 18px;
            min-height: 18px;
        }
        #tnt_info_resources .tnt_back {
            left: 2px;
            position: absolute;
            top: 2px;
        }
        #tnt_info_resources .tnt_back:before {
            content: "◀";
            color: #333;
            display: inline-block;
            width: 100%;
            height: 100%;
        }
        #tnt_info_resources .tnt_back:hover {
            background: #DDD;
        }
        #tnt_info_resources .tnt_back:hover:before {
            color: #000;
        }
        #tnt_info_resources .tnt_foreward {
            left: 2px;
            position: absolute;
            top: 3px;
        }
        #tnt_info_resources .tnt_foreward:before {
            content: "▶";
            color: #333;
            display: inline-block;
            width: 100%;
            height: 100%;
        }
        #tnt_info_resources .tnt_foreward:hover {
            background: #DDD;
        }
        #tnt_info_resources .tnt_foreward:hover:before {
            color: #000;
        }
        #tnt_info_updateCities {
            position:fixed;
            bottom:20px;
            right:0px;
            width:auto;
            height:auto;
            background-color: #DBBE8C;
            z-index:100000000;
        }
        .tnt_panel_minimize_btn {
            cursor: pointer;
            display: block!important;
            height: 18px;
            width: 18px;
            position: absolute;
            left: 2px;
            top: 2px;
            z-index: 10;
            border: 1px solid #8B4513;
            background: #D2B48C;
            border-radius: 2px;
            text-align: center;
            line-height: 16px;
            font-size: 12px;
            min-width: 18px;
            min-height: 18px;
            box-sizing: border-box;
            overflow: hidden;
        }
        .tnt_panel_minimize_btn.tnt_back:before { 
            content: "◀";
            color: #333;
            display: inline-block;
            width: 100%;
            height: 100%;
            line-height: 16px;
            text-align: center;
            font-size: 10px;
            vertical-align: middle;
        }
        .tnt_panel_minimize_btn.tnt_back:hover { 
            background: #DDD;
        }
        .tnt_panel_minimize_btn.tnt_back:hover:before { 
            color: #000;
        }
        .tnt_panel_minimize_btn.tnt_foreward { 
            top: 3px; 
        }
        .tnt_panel_minimize_btn.tnt_foreward:before { 
            content: "▶";
            color: #333;
            display: inline-block;
            width: 100%;
            height: 100%;
            line-height: 16px;
            text-align: center;
            font-size: 10px;
            vertical-align: middle;
        }
        .tnt_panel_minimize_btn.tnt_foreward:hover { 
            background: #DDD;
        }
        .tnt_panel_minimize_btn.tnt_foreward:hover:before { 
            color: #000;
        }
        .tnt_table_toggle_btn {
            cursor: pointer;
            display: inline-block;
            height: 18px;
            width: 18px;
            vertical-align: middle;
            float: right;
            margin-left: 6px;
            border: 1px solid #8B4513;
            background: #D2B48C;
            border-radius: 2px;
            text-align: center;
            line-height: 16px;
            font-size: 12px;
            min-width: 18px;
            min-height: 18px;
            box-sizing: border-box;
            overflow: hidden;
        }
        .tnt_table_toggle_btn:before {
            content: "⇄";
            color: #333;
            display: inline-block;
            width: 100%;
            height: 100%;
            line-height: 16px;
            text-align: center;
            font-size: 10px;
            vertical-align: middle;
        }
        .tnt_table_toggle_btn:hover { 
            background: #DDD;
        }
        .tnt_table_toggle_btn:hover:before {
            color: #000;
        }
        .tnt_table_toggle_btn.active:before {
            content: "⇄";
            color: #006600;
            font-weight: bold;
        }
        /* Remove duplicate old button styles - keep only this section */
        .tnt_city .tnt_panel_minimize_btn { 
            display: none !important;
        }
        
        /* Change the minimized state to show the first cell completely for both tables */
        #tnt_info_resources.minimized,
        #tnt_info_buildings.minimized {
            width: auto !important;
            min-width: auto !important;
            max-width: none !important;
            overflow: hidden !important;
        }
        
        /* Simple minimized state - just hide columns */
        #tnt_info_resources.minimized table tr td:not(:first-child),
        #tnt_info_resources.minimized table tr th:not(:first-child),
        #tnt_info_buildings.minimized table tr td:not(:first-child),
        #tnt_info_buildings.minimized table tr th:not(:first-child) {
            display: none !important;
        }
        
        /* Show only the first cell when minimized - keep as table-cell */
        #tnt_info_resources.minimized table tr th:first-child,
        #tnt_info_resources.minimized table tr td:first-child,
        #tnt_info_buildings.minimized table tr th:first-child,
        #tnt_info_buildings.minimized table tr td:first-child {
            display: table-cell !important;
            width: auto !important;
            min-width: 60px !important;
        }
        
        /* Special handling for the header row when minimized */
        #tnt_info_resources.minimized table thead tr,
        #tnt_info_buildings.minimized table thead tr {
            display: table-row !important;
        }
        
        #tnt_info_resources.minimized table thead tr th:first-child,
        #tnt_info_buildings.minimized table thead tr th:first-child {
            display: table-cell !important;
            width: auto !important;
        }
        
        /* Ensure the tables maintain proper structure when minimized */
        #tnt_info_resources.minimized table,
        #tnt_info_buildings.minimized table {
            width: auto !important;
        }
        
        /* FORCE exact same heights in minimized state - now completely independent */
        #tnt_info_resources.minimized table tr.tnt_category_header,
        #tnt_info_buildings.minimized table tr.tnt_category_header {
            height: 25px !important;
            max-height: 25px !important;
            display: table-row !important;
        }
        
        #tnt_info_resources.minimized table tr.tnt_category_header th,
        #tnt_info_buildings.minimized table tr.tnt_category_header th {
            height: 25px !important;
            max-height: 25px !important;
            padding: 4px !important;
            vertical-align: middle !important;
            box-sizing: border-box !important;
            line-height: 17px !important;
            overflow: hidden !important;
        }
        
        /* External controls remain visible and positioned in minimized state */
        #tnt_info_resources.minimized .tnt_external_controls,
        #tnt_info_buildings.minimized .tnt_external_controls {
            position: absolute !important;
            top: 2px !important;
            left: 2px !important;
            width: 116px !important;
            height: 18px !important;
            z-index: 1000 !important;
            pointer-events: none !important;
            padding: 0 !important;
            box-sizing: border-box !important;
        }
        
        /* Remove all conflicting minimized button positioning - buttons are now external */
        /* 
        #tnt_info_resources.minimized .tnt_control_buttons,
        #tnt_info_buildings.minimized .tnt_control_buttons {
            // REMOVED - buttons are external now
        }
        
        #tnt_info_resources.minimized .tnt_control_buttons span,
        #tnt_info_buildings.minimized .tnt_control_buttons span {
            // REMOVED - buttons are external now  
        }
        */
        
        /* FORCE exact same subcategory header height in minimized state */
        #tnt_info_resources.minimized table tr.tnt_subcategory_header,
        #tnt_info_buildings.minimized table tr.tnt_subcategory_header {
            height: 41px !important;
            min-height: 41px !important;
            max-height: 41px !important;
            display: table-row !important;
        }
        
        #tnt_info_resources.minimized table tr.tnt_subcategory_header th:first-child,
        #tnt_info_buildings.minimized table tr.tnt_subcategory_header th:first-child {
            display: table-cell !important;
            height: 41px !important;
            min-height: 41px !important;
            max-height: 41px !important;
            line-height: 1.2 !important;
            vertical-align: middle !important;
            box-sizing: border-box !important;
            padding: 4px !important;
        }
        
        /* Override any conflicting styles for subcategory header cells in minimized state */
        #tnt_info_resources.minimized table tr.tnt_subcategory_header th,
        #tnt_info_buildings.minimized table tr.tnt_subcategory_header th {
            height: 41px !important;
            min-height: 41px !important;
            max-height: 41px !important;
            line-height: 1.2 !important;
            vertical-align: middle !important;
            box-sizing: border-box !important;
            padding: 4px !important;
        }
        #tnt_info_resources .tnt_building_maxed {
            background-color: #d4edda !important;
        }
    `);
});