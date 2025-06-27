var city = {
    Screen: {
        data: null,
        screenId: 0,
        screenIdName: "currentCityId",
        animations: [],
        startUpgradeTime: -1,
        endUpgradeTime: -1,
        constructionListStart: -1,
        constructionListEnd: -1,
        constructionListState: 0,
        buildingCountdown: null,
        unitCountdown: null,
        maximumMinimizedBoxes: 7,
        cityPositions: 24,
        walkers: {},
        arrowIntervall: null,
        init: function(a) {
            this.screenId = a.currentCityId, this.updateAnimations(), ikariam.model.isOwnCity && (this.constructionListStart = a.constructionListStart, this.constructionListEnd = a.constructionListEnd, this.endUpgradeTime = a.endUpgradeTime, this.startUpgradeTime = a.startUpgradeTime, this.constructionListState = a.constructionListState)
        },
        update: function(a) {
            var b = Math.max;
            console.log("city.js: UPDATE SCREEN with dataset:"); // console.log(dataSet);
            var c = !1;
            null === this.data && (this.data = a, c = !0);
            var d = "animated" + (ikariam.model.animationsActive ? "" : "_off"),
                e = !0;
            if (ikariam.model.avatarId !== a.ownerId && (e = !1, ikariam.model.isOwnCity = !1), this.portLoadingTime = a.portLoadingTime, e) {
                var f = this.endUpgradeTime;
                this.constructionListStart = parseInt(a.constructionListStart), this.constructionListEnd = parseInt(a.constructionListEnd), this.endUpgradeTime = parseInt(a.endUpgradeTime), this.startUpgradeTime = parseInt(a.startUpgradeTime)
            } // city id changed
            if (this.screenId != a.id && null !== ikariam.templateView && "buildingConstructionList" === ikariam.templateView.id && this.displayConstructionList(!0), this.screenId = a.id, c || this.data.id !== a.id) {
                $("#js_cityBread").html(a.name), this.data.islandId !== a.islandId && ($("#js_islandBreadName").html(a.islandName), $("#js_islandBreadCoords").html("[" + a.islandXCoord + ":" + a.islandYCoord + "]"), $("#js_islandBread").attr("href", "?view=island&islandId=" + a.islandId), $("#js_worldBread").attr("href", "?view=worldmap_iso&islandX=" + a.islandXCoord + "&islandY=" + a.islandYCoord)); //walkers entfernen
                for (var g in this.walkers) this.walkers[g].clearAnimation(!1);
                this.walkers = {}
            } // Static plague animals if animations are disabled
            // city warnings
            if (a.displayStaticPlague ? $(".plagueAnimal").show() : $(".plagueAnimal").hide(), c || this.data.id !== a.id || this.data.cityOccupied !== a.cityOccupied || this.data.harbourOccupied !== a.harbourOccupied || this.data.spiesInside !== a.spiesInside) {
                $("#js_cityWarningBox").attr("class", a.harbourOccupied || a.spiesInside || a.cityOccupied ? "occupation_warning red_box" : "invisible"), $("#portOccupierShip1").attr("class", a.harbourOccupied && ikariam.model.isOwnCity ? "portOccupier" : "invisible"), $("#portOccupierShip2").attr("class", a.harbourOccupied && ikariam.model.isOwnCity ? "portOccupier" : "invisible"), $("#portOccupierShip1").attr("title", a.harbourOccupied && ikariam.model.isOwnCity ? a.harbourOccupied : null), $("#portOccupierShip2").attr("title", a.harbourOccupied && ikariam.model.isOwnCity ? a.harbourOccupied : null);
                var h = ikariam.model.avatarId == a.occupierId ? null : "?view=sendIKMessage&msgType=50&receiverId=" + a.occupierId,
                    j = ikariam.model.avatarId == a.occupierId ? null : LocalizationStrings.send_message,
                    k = ikariam.model.avatarId == a.portControllerId ? null : "?view=sendIKMessage&msgType=50&receiverId=" + a.portControllerId,
                    l = ikariam.model.avatarId == a.portControllerId ? null : LocalizationStrings.send_message;
                this.displayWarning("js_cityOccupiedText", a.cityOccupied, h, j), this.displayWarning("js_harbourOccupiedText", a.harbourOccupied, k, l), this.displayWarning("js_spiesInsideText", a.spiesInside, "?view=spyMissions&targetCityId=" + a.id, a.spiesInside)
            } // city features
            $("#worldmap").attr("class", "phase" + a.phase + " " + d + (ikariam.model.isOwnCity ? " own" : " foreign") + (a.ambrosiaFountain ? " isCapital" : "")); //var occupiers = Dom.getElementsByClassName('occupier');
            var m = $(".beachboys"),
                n = $("#js_city_feature_protester"),
                o = $("#js_city_feature_garrison"),
                p = $("#js_city_feature_garrisonGate");
            1 == a.showPirateFortressBackground ? $("#pirateFortressBackground").removeClass("invisible") : $("#pirateFortressBackground").addClass("invisible"), 1 == a.showPirateFortressShip ? $("#pirateFortressShip").removeClass("invisible") : $("#pirateFortressShip").addClass("invisible"), void 0 !== a.beachboys && ikariam.model.isOwnCity ? m.removeClass("invisible") : m.addClass("invisible"), void 0 !== a.protesters && ikariam.model.isOwnCity ? n.removeClass("invisible").addClass("protester") : n.addClass("invisible").removeClass("protester"), void 0 !== a.garrison && ikariam.model.isOwnCity ? o.removeClass("invisible").addClass("garnison") : o.addClass("invisible").removeClass("garnison"), !ikariam.model.animationsActive && void 0 !== a.garrisonGate && ikariam.model.isOwnCity ? p.removeClass("invisible").addClass("garnisonGate") : !ikariam.model.animationsActive && p.addClass("invisible").removeClass("garnisonGate"), ikariam.model.animationsActive ? void 0 !== a.garrisonGate && ikariam.model.isOwnCity ? ($("#js_cityFight1").addClass("animation_soldierFight1_12steps"), $("#js_cityFight2").addClass("animation_soldierFight2_12steps"), $("#js_cityFight3").addClass("animation_soldierFight3_12steps")) : ($("#js_cityFight1").removeClass("animation_soldierFight1_12steps"), $("#js_cityFight2").removeClass("animation_soldierFight2_12steps"), $("#js_cityFight3").removeClass("animation_soldierFight3_12steps")) : void 0 !== a.garrisonGate && ikariam.model.isOwnCity ? p.removeClass("invisible").addClass("garnisonGate") : p.addClass("invisible").removeClass("garnisonGate");
            void 0 === a.lockedPosition ? -1 : a.lockedPosition[0];
            void 0 !== a.registrationGifts && ikariam.model.isOwnCity ? $("#cityRegistrationGifts").removeClass("invisible") : $("#cityRegistrationGifts").addClass("invisible");
            for (var q = 0; q <= this.cityPositions; q++) {
                if (null != $("#js_CityPosition" + q + "PortCountdown")[0] && null != $("#js_CityPosition" + q + "PortSpeedupButton")[0] && ($("#js_CityPosition" + q + "PortCountdown")[0].className = "", $("#js_CityPosition" + q + "PortSpeedupButton")[0].className = "", $("#js_CityPosition" + q + "PortCountdownText").html(""), this.stopPortLoadingCountdown("js_CityPosition" + q + "PortCountdownText", q)), void 0 !== a.lockedPosition && void 0 !== a.lockedPosition[q]) {
                    $("#position" + q).attr({
                        class: "lockedPosition position" + q,
                        title: a.lockedPosition[q]
                    }), $("#js_CityPosition" + q + "Img").html("").attr("class", "lockedPosition buildingimg img_pos"), $("#js_CityPosition" + q + "Link").attr({
                        title: a.lockedPosition[q],
                        href: "javascript:void(0);"
                    }), $("#js_CityPosition" + q + "Countdown").attr("class", "invisible");
                    continue
                }
                var r = a.position[q],
                    s = r.building.split(" "),
                    t = void 0 === r.level,
                    u = t ? null : parseInt(r.level),
                    v = "building " + r.building + (r.isBusy ? " busy" : ""),
                    w = t ? LocalizationStrings.free_building_space : r.name;
                if (t || (v += " level" + u, w += 0 < u ? " (" + r.level + ")" : " (" + LocalizationStrings.building_under_construction + ")"), $("#position" + q)[0].className = "position" + q + " " + v, $("#js_CityPosition" + q + "Link")[0].title = w, $("#js_CityPosition" + q + "Link")[0].href = e ? "?view=" + s[0] + "&cityId=" + a.id + "&position=" + q : "javascript:void(0);", $("#js_CityPosition" + q + "Img")[0].className = "buildingimg img_pos " + d, $("#js_CityPosition" + q + "SpeedupButton")[0].className = "invisible", void 0 !== r.inConstructionList) $("#js_CityPosition" + q + "Countdown")[0].className = "position" + q + " timetofinish", $("#js_CityPosition" + q + "CountdownText")[0].innerHTML = r.inConstructionList, this.stopCountdown(this.buildingCountdown, "js_CityPosition" + q + "CountdownText");
                else if (void 0 !== r.completed) {
                    if (1 === ikariam.model.buildingNamesActive && $("#js_CityPosition" + q + "Scroll").addClass("invisible"), $("#position" + q)[0].className = "position" + q + " building constructionSite " + d, $("#js_CityPosition" + q + "Img")[0].className = "constructionSite img_pos " + d, 1 == a.buildingSpeedupActive && ikariam.model.isOwnCity) {
                        $("#js_CityPosition" + q + "Countdown")[0].className = "position" + q + " timetofinish buildingSpeedup";
                        var x = "?view=buildingSpeedup&cityId=" + this.screenId + "&position=" + q;
                        $("#js_CityPosition" + q + "Countdown").off("click").on("click", function() {
                            return ikariam.closePopup(), ajaxHandlerCall(x), !1
                        }), $("#js_CityPosition" + q + "SpeedupButton")[0].className = 38 == a.speedupState ? "buildingSpeedupButton" : "buildingSpeedupButton finish"
                    } else ikariam.model.isOwnCity && ($("#js_CityPosition" + q + "Countdown")[0].className = "position" + q + " timetofinish");
                    var y = parseInt(r.completed);
                    (y !== f || null === this.buildingCountdown) && ikariam.model.isOwnCity && (this.endUpgradeTime = y, this.initBuildingCountdown(y, "?view=city", this.startUpgradeTime));
                    var z = b(0, y - (ikariam.model.serverTime + 300)); //Es gibt leider keine PHP - Konstanten in JS: PREMIUM_BUILDING_SPEEDUP_FREE
                    getTimeout({
                        element: $("#js_CityPosition" + q + "SpeedupButton"),
                        name: "js_CityPosition" + q + "SpeedupButton",
                        time: z,
                        className: "free"
                    }), this.showBuildingCountdown("js_CityPosition" + q + "CountdownText")
                } else 1 === ikariam.model.buildingNamesActive ? ($("#js_CityPosition" + q + "Countdown")[0].className = "position" + q + " invisible", "undefined" == typeof r.name ? $("#js_CityPosition" + q + "Scroll").addClass("invisible") : ($("#js_CityPosition" + q + "Scroll").removeClass("invisible"), $("#js_CityPosition" + q + "ScrollName")[0].innerHTML = r.name + " (<span id=\"js_CityPosition" + q + "Level\">" + r.level + "</span>)")) : $("#js_CityPosition" + q + "Countdown")[0].className = "position" + q + " invisible";
                if ("port" == s[0] && ikariam.model.isOwnCity && this.portLoadingTime) {
                    $("#js_CityPosition" + q + "PortCountdown")[0].className = "timetofinish portSpeedup";
                    var A = "?view=accelerateLoading&cityId=" + this.screenId + "&eventId=" + a.portLoadingEventId;
                    $("#js_CityPosition" + q + "PortCountdown").off("click").on("click", function() {
                        return ikariam.closePopup(), ajaxHandlerCall(A), !1
                    }), 0 == a.portLoadingNotOwner && ($("#js_CityPosition" + q + "PortSpeedupButton")[0].className = "buildingSpeedupButton finish"), this.showPortLoadingCountdown("js_CityPosition" + q + "PortCountdownText", this.portLoadingTime, q)
                }
                var B = $("#js_CityPosition" + q + "Img")[0];
                B.innerHTML = "";
                var C = function(a) {
                    return "-webkit-animation-delay: " + (.1 * q + a) + "s; -moz-animation-delay: " + (.1 * q + a) + "s; -ms-animation-delay: " + (.1 * q + a) + "s;"
                };
                if (24 == q && (u && "undefined" == typeof r.completed ? $(".dockyard_water").removeClass("hide") : $(".dockyard_water").addClass("hide")), !t && void 0 !== r.completed) createEl("div", null, "animated_worker_construction_1", C(0), null, null, B), createEl("div", null, "animated_worker_construction_2", C(0), null, null, B);
                else switch (s[0]) {
                    case "barracks":
                        r.isBusy && createEl("div", null, "animation soldiers", null, null, null, B), createEl("div", null, "animation animation_flag_barracks_16steps", null, null, null, B);
                        break;
                    case "port":
                        r.isBusy && (r.shipIsAtDockyard ? $(".port.busy").removeClass("busy") : createEl("div", null, "animation ship", null, null, null, B));
                        break;
                    case "dockyard": // there is no loading animation with cranes yet for this building
                        break;
                    case "townHall":
                        createEl("div", null, "animation flag_position flagRedBig animation_16steps", C(0), null, null, B);
                        break;
                    case "embassy":
                        createEl("div", null, "animation flag_position flagRedBig animation_16steps", C(0), null, null, B), createEl("div", null, "animation flag_position2 flagGreenBig animation_16steps", C(.1), null, null, B), createEl("div", null, "animation flag_position3 flagGreenBig animation_16steps", C(.2), null, null, B);
                        break;
                    case "pirateFortress":
                        createEl("div", null, "animation animation_flag_pirateFortress_8steps", null, null, null, B);
                        break;
                    case "buildingGround":
                        var D = "flagRedBig";
                        "wall" === s[1] && (D = "flagYellowBig"), "shore" === s[1] && (D = "flagBlueBig"), "sea" === s[1] && (D = "flagBlackBig"), "dockyard" === s[1] && (D = "flagBlueBig"), createEl("div", null, "animation flag_position animation_16steps " + D, C(0), null, null, B);
                        break;
                    case "marineChartArchive":
                        createEl("div", null, "animation animation_marineChartArchive_1", null, null, null, B), createEl("div", null, "animation animation_marineChartArchive_2", null, null, null, B)
                }
            }
            if (!(isIE8 || isIE9p) && void 0 !== a.walkers) { //Walkers entfernen
                if (void 0 !== a.walkers.remove)
                    for (q = 0; q < a.walkers.remove.length; q++)
                        if (void 0 === this.walkers[a.walkers.remove[q][0]]) console.log("not found City Walker: " + a.walkers.remove[q][0]);
                        else { // console.log('remove City Walker: ' + dataSet['walkers']['remove'][i][0]);
                            var E = this.walkers[a.walkers.remove[q][0]];
                            E.clearAnimation(!1), delete this.walkers[a.walkers.remove[q][0]]
                        } //Walkers hinzufügen, schon bestehende werden nicht ersetzt!
                if (void 0 !== a.walkers.add)
                    for (q = 0; q < a.walkers.add.length; q++)
                        if (void 0 === this.walkers[a.walkers.add[q][0]] || this.walkers[a.walkers.add[q][0]].isDone()) // console.log('create City Walker: ' + dataSet['walkers']['add'][i][0]);
                            this.walkers[a.walkers.add[q][0]] = ikariam.getClass(animations.Walker, a.walkers.add[q]);
                        else; // console.log('found City Walker: ' + dataSet['walkers']['add'][i][0]);
            }
            if (void 0 === a.ambrosiaFountain ? $("#cityAmbrosiaFountain").attr("class", "invisible") : ikariam.model.animationsActive ? $("#cityAmbrosiaFountain").attr("class", a.ambrosiaFountain + " animated") : $("#cityAmbrosiaFountain").attr("class", a.ambrosiaFountain), 0 == a.dailyTasks) $("#cityDailyTasks").attr("class", "invisible"), $("#cityDailyTasksArrow").attr("class", "invisible"), clearInterval(this.arrowInterval);
            else if (ikariam.model.animationsActive ? ($("#cityDailyTasks").attr("class", "animated level" + a.phase), $("#cityDailyTasksAnimation").attr("class", "animation animation_dailyTasks_52steps")) : ($("#cityDailyTasks").attr("class", "level" + a.phase), $("#cityDailyTasksAnimation").attr("class", "invisible")), 1 == a.dailyTasks && $("#cityDailyTasksArrow").hasClass("invisible")) {
                clearInterval(this.arrowInterval);
                $("#cityDailyTasksArrow").attr("class", "aniArrow").css("display", "block").css("top", "40px");
                var F = 0;
                this.arrowInterval = setInterval(function() {
                    var a = Math.sin;
                    F++, $("#cityDailyTasksArrow").css("top", 40 + 10 * a(F / 15) + "px")
                }, 10)
            } else 2 == a.dailyTasks && ($("#cityDailyTasksArrow").attr("class", "invisible"), clearInterval(this.arrowInterval));
            a.cityCinema && ($("#cityCinema").attr("class", a.cityCinema), e ? $("#cityCinemaLink").attr("href", "?view=cinema&visit=1") : $("#cityCinemaLink").attr("href", "javascript:void(0);")), a.flyingTrader && ($("#cityFlyingShop").attr("href", a.flyingTrader.link.href).attr("onclick", a.flyingTrader.link.onclick), $("#cityFlyingShop .tooltip").html(a.flyingTrader.link.tooltip), $("#cityFlyingShopContainer").attr("class", a.flyingTrader.banner)), this.data = a, this.updateBuildingNames()
        },
        updateAnimations: function() {
            var a = "animated",
                b = "animated";
            if ((!isIE || isIE10) && ikariam.model.animationsActive) //this.animations.push(ikariam.getClass(animations.BirdSwarm));
                this.animations.push(ikariam.getClass(animations.Dolphin, ["dolphinPos1", "dolphinPos2", "dolphinPos3", "dolphinPos4"])), a += "_off";
            else {
                for (var c = 0; c < this.animations.length; c++) this.animations[c].clearAnimation();
                this.animations = [], b += "_off"; //walkers entfernen
                for (var d in this.walkers) this.walkers[d].clearAnimation(!1);
                this.walkers = {}
            }(!isIE || isIE10) && $("." + a).removeClass(a).addClass(b)
        },
        updateBuildingNames: function() {
            for (var a, b = 0; b <= this.cityPositions; b++) a = this.data.position[b], 1 == ikariam.model.buildingNamesActive && "undefined" == typeof a.completed ? ($("#js_CityPosition" + b + "Countdown")[0].className = "position" + b + " invisible", "undefined" == typeof a.name ? $("#js_CityPosition" + b + "Scroll").addClass("invisible") : ($("#js_CityPosition" + b + "Scroll").removeClass("invisible"), $("#js_CityPosition" + b + "ScrollName")[0].innerHTML = a.name + " (<span id=\"js_CityPosition" + b + "Level\">" + a.level + "</span>)"), "undefined" != typeof a.canUpgrade && (a.canUpgrade ? $("#js_CityPosition" + b + "ScrollName").addClass("green") : $("#js_CityPosition" + b + "ScrollName").removeClass("green")), "undefined" != typeof a.isMaxLevel && (a.isMaxLevel || a.canUpgrade ? $("#js_CityPosition" + b + "ScrollName").removeClass("levelup") : $("#js_CityPosition" + b + "ScrollName").addClass("levelup"))) : ($("#js_CityPosition" + b + "Scroll").addClass("invisible"), $("#js_CityPosition" + b + "ScrollName")[0].innerHTML = "");
            touchVersion || (1 == ikariam.model.buildingNamesActive ? $("#toggleBuildingInfos")[0].innerHTML = LocalizationStrings.buildingNames.hide : $("#toggleBuildingInfos")[0].innerHTML = LocalizationStrings.buildingNames.show)
        },
        toggleConstructionList: function() {
            this.constructionListState = Math.abs(this.constructionListState - 1), this.displayConstructionList(!1)
        },
        displayConstructionList: function(a) {
            var b = $("#constructionList");
            0 < this.constructionListState ? 1 < b.length && !a ? b.parent().parent().parent().css("display", "") : a && ajaxHandlerCall("?view=buildingConstructionList&cityId=" + this.screenId) : null !== ikariam.templateView && null !== ikariam.templateView.sidebar && 1 === ikariam.templateView.sidebar.sidebarEls.length ? ikariam.templateView.destroySidebars() : 1 < b.length && b.parent().parent().parent().css("display", "none")
        },
        updateConstructionList: function(a, b) {
            this.constructionListStart = a, this.constructionListEnd = b
        },
        jumpToXY: function() {},
        displayWarning: function(a, b, c, d) {
            var e = $("#" + a)[0];
            if (e.innerHTML = "", void 0 !== b && null !== b) {
                createEl("span", null, "text vertical_middle floatleft smallFont", null, b, null, e);
                if (null !== c) {
                    var f = createEl("a", null, "icon floatleft", null, null, {
                        ajaxrequest: c
                    }, e);
                    f.title = d
                }
            }
        },
        createCountdown: function(a, b, c) {
            var d = Math.floor,
                e = ikariam.getModel().requestTime,
                f = new Timer(a, e);
            if (f.formattime = ikariam.model.getTimestring, f.startdate = 1e3 * c, f.duration = f.enddate - f.startdate, f.progress = 100 * ((f.currenttime - f.startdate) / f.duration), f.els = [], f.barEls = [], $(f).on("update", function() {
                    this.progress = d(100 * ((this.currenttime - this.startdate) / this.duration))
                }), null !== b) {
                $(f).on("finished", function() {
                    setTimeout(function() {
                        var a = [];
                        a.view = 1, a.id = 1, a.dialog = 1;
                        var c = null !== ikariam.templateView && null !== ikariam.templateView.id ? "&dialog=" + ikariam.templateView.id + createURLParameters(ikariam.getModel().viewParams, a) : "";
                        console.log("reloadURL " + b + c), null !== ikariam.templateView && null !== ikariam.templateView.id && "buildingConstructionList" != ikariam.templateView.id || ajaxHandlerCall(b + c)
                    }, 500)
                });
                var g = [];
                g.view = 1, g.id = 1, g.dialog = 1;
                var h = null !== ikariam.templateView && null !== ikariam.templateView.id ? "&dialog=" + ikariam.templateView.id + createURLParameters(ikariam.getModel().viewParams, g) : "";
                console.log("reloadURL " + b + h)
            }
            return f.startTimer(), f
        },
        showProgressBar: function(a, b) {
            if (null != a && !a.barEls.contains($("#" + b)[0])) {
                a.barEls.push($("#" + b)[0]);
                for (var c = a.barEls.length, d = 0; d < c; d++) $(a.barEls[d]).css("width", a.progress + "%");
                $(a).on("update", function() {
                    for (var a = this.barEls.length, b = 0; b < a; b++) $(this.barEls[b]).css("width", this.progress + "%"), this.barEls[b].title = this.progress + "%"
                })
            } // countdown is already placed
        },
        showCountdown: function(a, b) {
            null == a || a.els.contains($("#" + b)[0]) || ( // countdown is already placed
                a.els.push($("#" + b)[0]), $(a).on("update", function() {
                    for (var a = [this.enddate - 1e3 * Math.floor(this.currenttime / 1e3)], b = this.els.length, c = 0; c < b; c++) this.els[c] && (this.els[c].innerHTML = this.formattime.apply(this, a))
                }).on("finished", function() {
                    for (var a = this.els.length, b = 0; b < a; b++) this.els[b] && (this.els[b].innerHTML = "");
                    this.els = [], this.barEls = [], ajaxHandlerCall("?view=buildingConstructionList&cityId=" + ikariam.getScreen().screenId)
                }))
        },
        stopCountdown: function(a, b) {
            var c = $("#" + b)[0];
            if (null != a)
                for (var d = a.els.length, e = 0; e < d; e++) a.els[e] === c && (a.els[e] = !1)
        },
        initBuildingCountdown: function(a, b, c) {
            null === this.buildingCountdown ? this.buildingCountdown = this.createCountdown(a, b, c) : (this.buildingCountdown.enddate = 1e3 * a, this.buildingCountdown.startdate = 1e3 * c, this.buildingCountdown.duration = this.buildingCountdown.enddate - this.buildingCountdown.startdate, this.buildingCountdown.currenttime > this.buildingCountdown.enddate ? this.buildingCountdown.stopTimer() : this.buildingCountdown.startTimer())
        },
        stopConstructionListTimer: function() {
            null !== this.buildingCountdown && (this.buildingCountdown.enddate = this.buildingCountdown.startdate, this.buildingCountdown.stopTimer())
        },
        toggleHover: function(a) {
            if (ikariam.model.isOwnCity) { // occupied city: buildings cannot be entered => no hover effect
                var b = a.previousSibling.previousSibling; // IE7/8 ignores whitespaces
                $(b).hasClass("hover") || (b = a.previousSibling), $(b).toggleClass("invisible")
            }
        },
        showBuildingProgressBar: function(a) {
            this.showProgressBar(this.buildingCountdown, a), console.log(this.buildingCountdown)
        },
        showBuildingCountdown: function(a) {
            this.showCountdown(this.buildingCountdown, a)
        },
        showUnitCountdown: function(a, b, c, d) {
            this.unitCountdown = this.createCountdown(c, null, d);
            this.showCountdown(this.unitCountdown, a), this.showProgressBar(this.unitCountdown, b)
        },
        showPortLoadingCountdown: function(a, b, c) {
            var d = this.createCountdown(b, null, this.currenttime),
                e = ["sendIKMessage", "takeOffer", "branchOffice", "branchOfficeSoldier", "branchOfficeTradePartners", "branchOfficeOwnOffers", "cinema"];
            $(d).on("finished", function() {
                null !== ikariam.templateView && null !== ikariam.templateView.id && -1 !== $.inArray(ikariam.templateView.id, e) || null !== ikariam.templateView && ikariam.model.viewParams.position === c && ajaxHandlerCall("?view=" + ikariam.templateView.id + "&cityId=" + ikariam.getScreen().screenId + "&position=" + ikariam.model.viewParams.position)
            }), $(window).on("cityChange", function() {
                $(d).off("finished")
            }), this.showCountdown(d, a), 1 === c ? this.portLoadingCountdown1 = d : this.portLoadingCountdown2 = d
        },
        stopPortLoadingCountdown: function(a, b) {
            if (1 == b) var c = this.portLoadingCountdown1;
            else var c = this.portLoadingCountdown2;
            c !== void 0 && (c.stopTimer(), c.enddate = c.startdate, c = void 0)
        },
        initConstructionList: function() {
            null !== this.buildingCountdown && (this.showBuildingCountdown("buildCountDown"), this.showBuildingProgressBar("buildProgress")), null !== this.constructionListStart && null !== this.constructionListEnd && this.displayConstructionList()
        }
    }
};