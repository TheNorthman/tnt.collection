function _typeof(e) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
        return typeof e
    } : function(e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    }, _typeof(e)
}(function(e) {
    function t(t) {
        var o = t || window.event,
            n = [].slice.call(arguments, 1),
            r = 0,
            s = 0,
            l = 0;
        return t = e.event.fix(o), t.type = "mousewheel", o.wheelDelta && (r = o.wheelDelta / 120), o.detail && (r = -o.detail / 3), l = r, void 0 !== o.axis && o.axis === o.HORIZONTAL_AXIS && (l = 0, s = -1 * r), void 0 !== o.wheelDeltaY && (l = o.wheelDeltaY / 120), void 0 !== o.wheelDeltaX && (s = -1 * o.wheelDeltaX / 120), n.unshift(t, r, s, l), (e.event.dispatch || e.event.handle).apply(this, n)
    }
    var o = ["DOMMouseScroll", "mousewheel"];
    if (e.event.fixHooks)
        for (var n = o.length; n;) e.event.fixHooks[o[--n]] = e.event.mouseHooks;
    e.event.special.mousewheel = {
        setup: function() {
            if (this.addEventListener)
                for (var e = o.length; e;) this.addEventListener(o[--e], t, !1);
            else this.onmousewheel = t
        },
        teardown: function() {
            if (this.removeEventListener)
                for (var e = o.length; e;) this.removeEventListener(o[--e], t, !1);
            else this.onmousewheel = null
        }
    }, e.fn.extend({
        mousewheel: function(e) {
            return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
        },
        unmousewheel: function(e) {
            return this.unbind("mousewheel", e)
        }
    })
})(jQuery);
jQuery.effects || function(e) {
        var o = Math.asin,
            n = Math.abs,
            r = Math.sqrt,
            l = Math.pow,
            u = Math.sin,
            p = Math.cos,
            m = Math.PI,
            g = Math.max,
            h = Math.min; // Color Conversion functions from highlightFade
        // By Blair Mitchelmore
        // http://jquery.offput.ca/highlightFade/
        // Parse strings looking for color tuples [255,255,255]
        function b(t) {
            var o; // Check if we're already dealing with an array of colors
            return t && t.constructor == Array && 3 == t.length ? t : (o = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(t)) ? [parseInt(o[1], 10), parseInt(o[2], 10), parseInt(o[3], 10)] : (o = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(t)) ? [2.55 * parseFloat(o[1]), 2.55 * parseFloat(o[2]), 2.55 * parseFloat(o[3])] : (o = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(t)) ? [parseInt(o[1], 16), parseInt(o[2], 16), parseInt(o[3], 16)] : (o = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(t)) ? [parseInt(o[1] + o[1], 16), parseInt(o[2] + o[2], 16), parseInt(o[3] + o[3], 16)] : (o = /rgba\(0, 0, 0, 0\)/.exec(t)) ? T.transparent : T[e.trim(t).toLowerCase()]; // Look for rgb(num,num,num)
            // Look for rgb(num%,num%,num%)
            // Look for #a0b1c2
            // Look for #fff
            // Look for rgba(0, 0, 0, 0) == transparent in Safari 3
            // Otherwise, we're most likely dealing with a named color
        }

        function v(t, o) {
            var n;
            do { // Keep going until we find an element that has color, or we hit the body
                if (n = e.curCSS(t, o), "" != n && "transparent" != n || e.nodeName(t, "body")) break;
                o = "backgroundColor"
            } while (t = t.parentNode);
            return b(n)
        }

        function x() {
            var e = document.defaultView ? document.defaultView.getComputedStyle(this, null) : this.currentStyle,
                t = {},
                o, n; // webkit enumerates style porperties
            if (e && e.length && e[0] && e[e[0]])
                for (var r = e.length; r--;) o = e[r], "string" == typeof e[o] && (n = o.replace(/\-(\w)/g, function(e, t) {
                    return t.toUpperCase()
                }), t[n] = e[o]);
            else
                for (o in e) "string" == typeof e[o] && (t[o] = e[o]);
            return t
        }

        function C(t) {
            var o, n;
            for (o in t) n = t[o], ( // ignore null and undefined values
                null == n || // ignore functions (when does this occur?)
                e.isFunction(n) || // shorthand styles that need to be expanded
                o in P || // ignore scrollbars (break in IE)
                /scrollbar/.test(o) || // only colors or values that can be converted to numbers
                !/color/i.test(o) && isNaN(parseFloat(n))) && delete t[o];
            return t
        }

        function y(e, t) {
            var o = {
                    _: 0
                }, // http://dev.jquery.com/ticket/5459
                n;
            for (n in t) e[n] != t[n] && (o[n] = t[n]);
            return o
        }

        function _(t, o, n, r) {
            return "object" == _typeof(t) && (r = o, n = null, o = t, t = o.effect), e.isFunction(o) && (r = o, n = null, o = {}), ("number" == typeof o || e.fx.speeds[o]) && (r = n, n = o, o = {}), e.isFunction(n) && (r = n, n = null), o = o || {}, n = n || o.duration, n = e.fx.off ? 0 : "number" == typeof n ? n : n in e.fx.speeds ? e.fx.speeds[n] : e.fx.speeds._default, r = r || o.complete, [t, o, n, r]
        }

        function k(t) { // valid standard speeds
            return !(t && "number" != typeof t && !e.fx.speeds[t]) || !("string" != typeof t || e.effects[t]); // invalid strings - treat as "normal" speed
        }
        e.effects = {}, e.each(["backgroundColor", "borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor", "borderColor", "color", "outlineColor"], function(t, o) {
            e.fx.step[o] = function(e) {
                e.colorInit || (e.start = v(e.elem, o), e.end = b(e.end), e.colorInit = !0), e.elem.style[o] = "rgb(" + g(h(parseInt(e.pos * (e.end[0] - e.start[0]) + e.start[0], 10), 255), 0) + "," + g(h(parseInt(e.pos * (e.end[1] - e.start[1]) + e.start[1], 10), 255), 0) + "," + g(h(parseInt(e.pos * (e.end[2] - e.start[2]) + e.start[2], 10), 255), 0) + ")"
            }
        }); // Some named colors to work with
        // From Interface by Stefan Petre
        // http://interface.eyecon.ro/
        var T = {
                aqua: [0, 255, 255],
                azure: [240, 255, 255],
                beige: [245, 245, 220],
                black: [0, 0, 0],
                blue: [0, 0, 255],
                brown: [165, 42, 42],
                cyan: [0, 255, 255],
                darkblue: [0, 0, 139],
                darkcyan: [0, 139, 139],
                darkgrey: [169, 169, 169],
                darkgreen: [0, 100, 0],
                darkkhaki: [189, 183, 107],
                darkmagenta: [139, 0, 139],
                darkolivegreen: [85, 107, 47],
                darkorange: [255, 140, 0],
                darkorchid: [153, 50, 204],
                darkred: [139, 0, 0],
                darksalmon: [233, 150, 122],
                darkviolet: [148, 0, 211],
                fuchsia: [255, 0, 255],
                gold: [255, 215, 0],
                green: [0, 128, 0],
                indigo: [75, 0, 130],
                khaki: [240, 230, 140],
                lightblue: [173, 216, 230],
                lightcyan: [224, 255, 255],
                lightgreen: [144, 238, 144],
                lightgrey: [211, 211, 211],
                lightpink: [255, 182, 193],
                lightyellow: [255, 255, 224],
                lime: [0, 255, 0],
                magenta: [255, 0, 255],
                maroon: [128, 0, 0],
                navy: [0, 0, 128],
                olive: [128, 128, 0],
                orange: [255, 165, 0],
                pink: [255, 192, 203],
                purple: [128, 0, 128],
                violet: [128, 0, 128],
                red: [255, 0, 0],
                silver: [192, 192, 192],
                white: [255, 255, 255],
                yellow: [255, 255, 0],
                transparent: [255, 255, 255]
            },
            S = ["add", "remove", "toggle"],
            P = {
                border: 1,
                borderBottom: 1,
                borderColor: 1,
                borderLeft: 1,
                borderRight: 1,
                borderTop: 1,
                borderWidth: 1,
                margin: 1,
                padding: 1
            }; // t: current time, b: begInnIng value, c: change In value, d: duration
        e.effects.animateClass = function(t, o, n, r) {
            return e.isFunction(n) && (r = n, n = null), this.queue(function() {
                var s = e(this),
                    l = s.attr("style") || " ",
                    d = C(x.call(this)),
                    c = s.attr("class") || "",
                    u;
                e.each(S, function(e, o) {
                    t[o] && s[o + "Class"](t[o])
                }), u = C(x.call(this)), s.attr("class", c), s.animate(y(d, u), {
                    queue: !1,
                    duration: o,
                    easing: n,
                    complete: function() {
                        e.each(S, function(e, o) {
                            t[o] && s[o + "Class"](t[o])
                        }), "object" == _typeof(s.attr("style")) ? (s.attr("style").cssText = "", s.attr("style").cssText = l) : s.attr("style", l), r && r.apply(this, arguments), e.dequeue(this)
                    }
                })
            })
        }, e.fn.extend({
            _addClass: e.fn.addClass,
            addClass: function(t, o, n, r) {
                return o ? e.effects.animateClass.apply(this, [{
                    add: t
                }, o, n, r]) : this._addClass(t)
            },
            _removeClass: e.fn.removeClass,
            removeClass: function(t, o, n, r) {
                return o ? e.effects.animateClass.apply(this, [{
                    remove: t
                }, o, n, r]) : this._removeClass(t)
            },
            _toggleClass: e.fn.toggleClass,
            toggleClass: function(t, o, n, r, s) {
                return "boolean" == typeof o || void 0 === o ? n ? e.effects.animateClass.apply(this, [o ? {
                    add: t
                } : {
                    remove: t
                }, n, r, s]) : this._toggleClass(t, o) : e.effects.animateClass.apply(this, [{
                    toggle: t
                }, o, n, r])
            },
            switchClass: function(t, o, n, r, s) {
                return e.effects.animateClass.apply(this, [{
                    add: o,
                    remove: t
                }, n, r, s])
            }
        }), e.extend(e.effects, {
            version: "1.8.21", // Saves a set of properties in a data storage
            save: function(e, t) {
                for (var o = 0; o < t.length; o++) null !== t[o] && e.data("ec.storage." + t[o], e[0].style[t[o]])
            }, // Restores a set of previously saved properties from a data storage
            restore: function(e, t) {
                for (var o = 0; o < t.length; o++) null !== t[o] && e.css(t[o], e.data("ec.storage." + t[o]))
            },
            setMode: function(e, t) { // Set for toggle
                return "toggle" == t && (t = e.is(":hidden") ? "show" : "hide"), t
            },
            getBaseline: function(e, t) { // Translates a [top,left] array into a baseline value
                // this should be a little more flexible in the future to handle a string & hash
                var o, n;
                switch (e[0]) {
                    case "top":
                        o = 0;
                        break;
                    case "middle":
                        o = .5;
                        break;
                    case "bottom":
                        o = 1;
                        break;
                    default:
                        o = e[0] / t.height
                }
                switch (e[1]) {
                    case "left":
                        n = 0;
                        break;
                    case "center":
                        n = .5;
                        break;
                    case "right":
                        n = 1;
                        break;
                    default:
                        n = e[1] / t.width
                }
                return {
                    x: n,
                    y: o
                }
            }, // Wraps the element around a wrapper that copies position properties
            createWrapper: function(t) { // if the element is already wrapped, return it
                if (t.parent().is(".ui-effects-wrapper")) return t.parent(); // wrap the element
                var o = {
                        width: t.outerWidth(!0),
                        height: t.outerHeight(!0),
                        float: t.css("float")
                    },
                    n = e("<div></div>").addClass("ui-effects-wrapper").css({
                        fontSize: "100%",
                        background: "transparent",
                        border: "none",
                        margin: 0,
                        padding: 0
                    }),
                    r = document.activeElement; // support: Firefox
                // Firefox incorrectly exposes anonymous content
                // https://bugzilla.mozilla.org/show_bug.cgi?id=561664
                try {
                    r.id
                } catch (t) {
                    r = document.body
                }
                return t.wrap(n), (t[0] === r || e.contains(t[0], r)) && e(r).focus(), n = t.parent(), "static" == t.css("position") ? (n.css({
                    position: "relative"
                }), t.css({
                    position: "relative"
                })) : (e.extend(o, {
                    position: t.css("position"),
                    zIndex: t.css("z-index")
                }), e.each(["top", "left", "bottom", "right"], function(e, n) {
                    o[n] = t.css(n), isNaN(parseInt(o[n], 10)) && (o[n] = "auto")
                }), t.css({
                    position: "relative",
                    top: 0,
                    left: 0,
                    right: "auto",
                    bottom: "auto"
                })), n.css(o).show()
            },
            removeWrapper: function(t) {
                var o = document.activeElement,
                    n;
                return t.parent().is(".ui-effects-wrapper") ? (n = t.parent().replaceWith(t), (t[0] === o || e.contains(t[0], o)) && e(o).focus(), n) : t
            },
            setTransition: function(t, o, n, r) {
                return r = r || {}, e.each(o, function(e, o) {
                    var s = t.cssUnit(o);
                    0 < s[0] && (r[o] = s[0] * n + s[1])
                }), r
            }
        }), e.fn.extend({
            effect: function(t) {
                var o = _.apply(this, arguments), // TODO: make effects take actual parameters instead of a hash
                    n = {
                        options: o[1],
                        duration: o[2],
                        callback: o[3]
                    },
                    r = n.options.mode,
                    s = e.effects[t];
                return e.fx.off || !s ? r ? this[r](n.duration, n.callback) : this.each(function() {
                    n.callback && n.callback.call(this)
                }) : s.call(this, n)
            },
            _show: e.fn.show,
            show: function(e) {
                if (k(e)) return this._show.apply(this, arguments);
                var t = _.apply(this, arguments);
                return t[1].mode = "show", this.effect.apply(this, t)
            },
            _hide: e.fn.hide,
            hide: function(e) {
                if (k(e)) return this._hide.apply(this, arguments);
                var t = _.apply(this, arguments);
                return t[1].mode = "hide", this.effect.apply(this, t)
            }, // jQuery core overloads toggle and creates _toggle
            __toggle: e.fn.toggle,
            toggle: function(t) {
                if (k(t) || "boolean" == typeof t || e.isFunction(t)) return this.__toggle.apply(this, arguments);
                var o = _.apply(this, arguments);
                return o[1].mode = "toggle", this.effect.apply(this, o)
            }, // helper functions
            cssUnit: function(t) {
                var o = this.css(t),
                    n = [];
                return e.each(["em", "px", "%", "pt"], function(e, t) {
                    0 < o.indexOf(t) && (n = [parseFloat(o), t])
                }), n
            }
        }), e.easing.jswing = e.easing.swing, e.extend(e.easing, {
            def: "easeOutQuad",
            swing: function(o, n, t, r, s) { //alert($.easing.default);
                return e.easing[e.easing.def](o, n, t, r, s)
            },
            easeInQuad: function(e, o, n, r, s) {
                return r * (o /= s) * o + n
            },
            easeOutQuad: function(e, o, n, r, s) {
                return -r * (o /= s) * (o - 2) + n
            },
            easeInOutQuad: function(e, o, n, r, s) {
                return 1 > (o /= s / 2) ? r / 2 * o * o + n : -r / 2 * (--o * (o - 2) - 1) + n
            },
            easeInCubic: function(e, o, n, r, s) {
                return r * (o /= s) * o * o + n
            },
            easeOutCubic: function(e, o, n, r, s) {
                return r * ((o = o / s - 1) * o * o + 1) + n
            },
            easeInOutCubic: function(e, o, n, r, s) {
                return 1 > (o /= s / 2) ? r / 2 * o * o * o + n : r / 2 * ((o -= 2) * o * o + 2) + n
            },
            easeInQuart: function(e, o, n, r, s) {
                return r * (o /= s) * o * o * o + n
            },
            easeOutQuart: function(e, o, n, r, s) {
                return -r * ((o = o / s - 1) * o * o * o - 1) + n
            },
            easeInOutQuart: function(e, o, n, r, s) {
                return 1 > (o /= s / 2) ? r / 2 * o * o * o * o + n : -r / 2 * ((o -= 2) * o * o * o - 2) + n
            },
            easeInQuint: function(e, o, n, r, s) {
                return r * (o /= s) * o * o * o * o + n
            },
            easeOutQuint: function(e, o, n, r, s) {
                return r * ((o = o / s - 1) * o * o * o * o + 1) + n
            },
            easeInOutQuint: function(e, o, n, r, s) {
                return 1 > (o /= s / 2) ? r / 2 * o * o * o * o * o + n : r / 2 * ((o -= 2) * o * o * o * o + 2) + n
            },
            easeInSine: function(e, o, t, n, r) {
                return -n * p(o / r * (m / 2)) + n + t
            },
            easeOutSine: function(e, o, t, n, r) {
                return n * u(o / r * (m / 2)) + t
            },
            easeInOutSine: function(e, o, t, n, r) {
                return -n / 2 * (p(m * o / r) - 1) + t
            },
            easeInExpo: function(e, o, t, n, r) {
                return 0 == o ? t : n * l(2, 10 * (o / r - 1)) + t
            },
            easeOutExpo: function(e, o, t, n, r) {
                return o == r ? t + n : n * (-l(2, -10 * o / r) + 1) + t
            },
            easeInOutExpo: function(e, o, n, r, s) {
                return 0 == o ? n : o == s ? n + r : 1 > (o /= s / 2) ? r / 2 * l(2, 10 * (o - 1)) + n : r / 2 * (-l(2, -10 * --o) + 2) + n
            },
            easeInCirc: function(e, o, n, s, l) {
                return -s * (r(1 - (o /= l) * o) - 1) + n
            },
            easeOutCirc: function(e, o, n, s, l) {
                return s * r(1 - (o = o / l - 1) * o) + n
            },
            easeInOutCirc: function(e, o, n, s, l) {
                return 1 > (o /= l / 2) ? -s / 2 * (r(1 - o * o) - 1) + n : s / 2 * (r(1 - (o -= 2) * o) + 1) + n
            },
            easeInElastic: function(e, r, g, h, c) {
                var d = 1.70158,
                    b = 0,
                    v = h;
                if (0 == r) return g;
                if (1 == (r /= c)) return g + h;
                if (b || (b = .3 * c), v < n(h)) {
                    v = h;
                    var d = b / 4
                } else var d = b / (2 * m) * o(h / v);
                return -(v * l(2, 10 * (r -= 1)) * u((r * c - d) * (2 * m) / b)) + g
            },
            easeOutElastic: function(e, r, g, h, c) {
                var d = 1.70158,
                    b = 0,
                    v = h;
                if (0 == r) return g;
                if (1 == (r /= c)) return g + h;
                if (b || (b = .3 * c), v < n(h)) {
                    v = h;
                    var d = b / 4
                } else var d = b / (2 * m) * o(h / v);
                return v * l(2, -10 * r) * u((r * c - d) * (2 * m) / b) + h + g
            },
            easeInOutElastic: function(e, r, g, h, c) {
                var d = 1.70158,
                    b = 0,
                    v = h;
                if (0 == r) return g;
                if (2 == (r /= c / 2)) return g + h;
                if (b || (b = c * (.3 * 1.5)), v < n(h)) {
                    v = h;
                    var d = b / 4
                } else var d = b / (2 * m) * o(h / v);
                return 1 > r ? -.5 * (v * l(2, 10 * (r -= 1)) * u((r * c - d) * (2 * m) / b)) + g : .5 * (v * l(2, -10 * (r -= 1)) * u((r * c - d) * (2 * m) / b)) + h + g
            },
            easeInBack: function(e, o, n, r, l, d) {
                return null == d && (d = 1.70158), r * (o /= l) * o * ((d + 1) * o - d) + n
            },
            easeOutBack: function(e, o, n, r, l, d) {
                return null == d && (d = 1.70158), r * ((o = o / l - 1) * o * ((d + 1) * o + d) + 1) + n
            },
            easeInOutBack: function(e, o, n, r, l, d) {
                return null == d && (d = 1.70158), 1 > (o /= l / 2) ? r / 2 * (o * o * (((d *= 1.525) + 1) * o - d)) + n : r / 2 * ((o -= 2) * o * (((d *= 1.525) + 1) * o + d) + 2) + n
            },
            easeInBounce: function(o, n, t, r, s) {
                return r - e.easing.easeOutBounce(o, s - n, 0, r, s) + t
            },
            easeOutBounce: function(e, o, n, r, s) {
                return (o /= s) < 1 / 2.75 ? r * (7.5625 * o * o) + n : o < 2 / 2.75 ? r * (7.5625 * (o -= 1.5 / 2.75) * o + .75) + n : o < 2.5 / 2.75 ? r * (7.5625 * (o -= 2.25 / 2.75) * o + .9375) + n : r * (7.5625 * (o -= 2.625 / 2.75) * o + .984375) + n
            },
            easeInOutBounce: function(o, n, t, r, s) {
                return n < s / 2 ? .5 * e.easing.easeInBounce(o, 2 * n, 0, r, s) + t : .5 * e.easing.easeOutBounce(o, 2 * n - s, 0, r, s) + .5 * r + t
            }
        })
    }(jQuery),
    function($) {
        $.extend({
            tablesorter: new function() {
                function benchmark(e, t) {
                    log(e + "," + (new Date().getTime() - t.getTime()) + "ms")
                }

                function log(e) {
                    "undefined" != typeof console && "undefined" != typeof console.debug ? console.log(e) : alert(e)
                }

                function buildParserCache(e, t) {
                    if (e.config.debug) var o = "";
                    if (0 != e.tBodies.length) { // In the case of empty tables
                        var n = e.tBodies[0].rows;
                        if (n[0])
                            for (var r = [], s = n[0].cells, d = s.length, l = 0, c; l < d; l++) c = !1, $.metadata && $(t[l]).metadata() && $(t[l]).metadata().sorter ? c = getParserById($(t[l]).metadata().sorter) : e.config.headers[l] && e.config.headers[l].sorter && (c = getParserById(e.config.headers[l].sorter)), c || (c = detectParserForColumn(e, n, -1, l)), e.config.debug && (o += "column:" + l + " parser:" + c.id + "\n"), r.push(c);
                        return e.config.debug && log(o), r
                    }
                }

                function detectParserForColumn(e, t, o, n) {
                    for (var r = parsers.length, s = !1, l = !1, d = !0;
                        "" == l && d;) o++, t[o] ? (s = getNodeFromRowAndCellIndex(t, o, n), l = trimAndGetNodeText(e.config, s), e.config.debug && log("Checking if value was empty on row:" + o)) : d = !1;
                    for (var c = 1; c < r; c++)
                        if (parsers[c].is(l, e, s)) return parsers[c]; // 0 is always the generic parser (text)
                    return parsers[0]
                }

                function getNodeFromRowAndCellIndex(e, t, o) {
                    return e[t].cells[o]
                }

                function trimAndGetNodeText(e, t) {
                    return $.trim(getElementText(e, t))
                }

                function getParserById(e) {
                    for (var t = parsers.length, o = 0; o < t; o++)
                        if (parsers[o].id.toLowerCase() == e.toLowerCase()) return parsers[o];
                    return !1
                }

                function buildCache(e) {
                    if (e.config.debug) var t = new Date;
                    for (var o = e.tBodies[0] && e.tBodies[0].rows.length || 0, n = e.tBodies[0].rows[0] && e.tBodies[0].rows[0].cells.length || 0, r = e.config.parsers, s = {
                            row: [],
                            normalized: []
                        }, l = 0; l < o; ++l) {
                        var d = $(e.tBodies[0].rows[l]),
                            u = []; // if this is a child row, add it to the last row's children and
                        // continue to the next row
                        if (d.hasClass(e.config.cssChildRow)) {
                            s.row[s.row.length - 1] = s.row[s.row.length - 1].add(d); // go to the next for loop
                            continue
                        }
                        s.row.push(d);
                        for (var p = 0; p < n; ++p) u.push(r[p].format(getElementText(e.config, d[0].cells[p]), e, d[0].cells[p]));
                        u.push(s.normalized.length), s.normalized.push(u), u = null
                    }
                    return e.config.debug && benchmark("Building cache for " + o + " rows:", t), s
                }

                function getElementText(e, t) {
                    var o = "";
                    return t ? (e.supportsTextContent || (e.supportsTextContent = t.textContent || !1), o = "simple" == e.textExtraction ? e.supportsTextContent ? t.textContent : t.childNodes[0] && t.childNodes[0].hasChildNodes() ? t.childNodes[0].innerHTML : t.innerHTML : "function" == typeof e.textExtraction ? e.textExtraction(t) : $(t).text(), o) : ""
                }

                function appendToTable(e, t) {
                    if (e.config.debug) var o = new Date;
                    for (var s = t, d = s.row, r = s.normalized, n = r.length, c = r[0].length - 1, u = $(e.tBodies[0]), p = [], m = 0, g; m < n; m++)
                        if (g = r[m][c], p.push(d[g]), !e.config.appender) //var o = ;
                            for (var h = d[g].length, b = 0; b < h; b++) u[0].appendChild(d[g][b]); //
                    // apply table widgets
                    // trigger sortend
                    e.config.appender && e.config.appender(e, p), p = null, e.config.debug && benchmark("Rebuilt table:", o), applyWidget(e), setTimeout(function() {
                        $(e).trigger("sortEnd")
                    }, 0)
                }

                function buildHeaders(e) {
                    if (e.config.debug) var t = new Date;
                    var o = !!$.metadata,
                        n = computeTableHeaderCellIndexes(e);
                    return $tableHeaders = $(e.config.selectorHeaders, e).each(function(t) {
                        if (this.column = n[this.parentNode.rowIndex + "-" + this.cellIndex], this.order = formatSortingOrder(e.config.sortInitialOrder), this.count = this.order, (checkHeaderMetadata(this) || checkHeaderOptions(e, t)) && (this.sortDisabled = !0), checkHeaderOptionsSortingLocked(e, t) && (this.order = this.lockedOrder = checkHeaderOptionsSortingLocked(e, t)), !this.sortDisabled) {
                            var o = $(this).addClass(e.config.cssHeader);
                            e.config.onRenderHeader && e.config.onRenderHeader.apply(o)
                        } // add cell to headerList
                        e.config.headerList[t] = this
                    }), e.config.debug && (benchmark("Built headers:", t), log($tableHeaders)), $tableHeaders
                } // from:
                // http://www.javascripttoolbox.com/lib/table/examples.php
                // http://www.javascripttoolbox.com/temp/table_cellindex.html
                function computeTableHeaderCellIndexes(e) {
                    for (var t = [], o = {}, n = e.getElementsByTagName("THEAD")[0], r = n.getElementsByTagName("TR"), s = 0, d; s < r.length; s++) {
                        d = r[s].cells;
                        for (var u = 0; u < d.length; u++) {
                            var p = d[u],
                                m = p.parentNode.rowIndex,
                                g = m + "-" + p.cellIndex,
                                h = p.rowSpan || 1,
                                b = p.colSpan || 1,
                                v;
                            "undefined" == typeof t[m] && (t[m] = []); // Find first available column in the first row
                            for (var x = 0; x < t[m].length + 1; x++)
                                if ("undefined" == typeof t[m][x]) {
                                    v = x;
                                    break
                                } o[g] = v;
                            for (var x = m; x < m + h; x++) {
                                "undefined" == typeof t[x] && (t[x] = []);
                                for (var C = t[x], y = v; y < v + b; y++) C[y] = "x"
                            }
                        }
                    }
                    return o
                }

                function checkCellColSpan(e, t, o) {
                    for (var n = [], s = e.tHead.rows, r = s[o].cells, l = 0, d; l < r.length; l++) d = r[l], 1 < d.colSpan ? n = n.concat(checkCellColSpan(e, headerArr, o++)) : (1 == e.tHead.length || 1 < d.rowSpan || !s[o + 1]) && n.push(d);
                    return n
                }

                function checkHeaderMetadata(e) {
                    if ($.metadata && !1 === $(e).metadata().sorter) return !0;
                    return !1
                }

                function checkHeaderOptions(e, t) {
                    if (e.config.headers[t] && !1 === e.config.headers[t].sorter) return !0;
                    return !1
                }

                function checkHeaderOptionsSortingLocked(e, t) {
                    return !!(e.config.headers[t] && e.config.headers[t].lockedOrder) && e.config.headers[t].lockedOrder
                }

                function applyWidget(e) {
                    for (var t = e.config.widgets, o = t.length, n = 0; n < o; n++) getWidgetById(t[n]).format(e)
                }

                function getWidgetById(e) {
                    for (var t = widgets.length, o = 0; o < t; o++)
                        if (widgets[o].id.toLowerCase() == e.toLowerCase()) return widgets[o]
                }

                function formatSortingOrder(e) {
                    return "Number" == typeof e ? 1 == e ? 1 : 0 : "desc" == e.toLowerCase() ? 1 : 0
                }

                function isValueInArray(e, t) {
                    for (var o = t.length, n = 0; n < o; n++)
                        if (t[n][0] == e) return !0;
                    return !1
                }

                function setHeadersCss(e, t, o, n) {
                    t.removeClass(n[0]).removeClass(n[1]);
                    var r = [];
                    t.each(function() {
                        this.sortDisabled || (r[this.column] = $(this))
                    });
                    for (var s = o.length, l = 0; l < s; l++) r[o[l][0]].addClass(n[o[l][1]])
                }

                function fixColumnWidth(e) {
                    var t = e.config;
                    if (t.widthFixed) {
                        var o = $("<colgroup>");
                        $("tr:first td", e.tBodies[0]).each(function() {
                            o.append($("<col>").css("width", $(this).width()))
                        }), $(e).prepend(o)
                    }
                }

                function updateHeaderSortCount(e, t) {
                    for (var n = e.config, r = t.length, l = 0; l < r; l++) {
                        var d = t[l],
                            c = n.headerList[d[0]];
                        c.count = d[1], c.count++
                    }
                }

                function multisort(table, sortList, cache) {
                    if (table.config.debug) var sortTime = new Date; // TODO: inline functions.
                    for (var dynamicExp = "var sortWrapper = function(a,b) {", l = sortList.length, i = 0; i < l; i++) {
                        var c = sortList[i][0],
                            order = sortList[i][1],
                            s = "text" == table.config.parsers[c].type ? 0 == order ? makeSortFunction("text", "asc", c) : makeSortFunction("text", "desc", c) : 0 == order ? makeSortFunction("numeric", "asc", c) : makeSortFunction("numeric", "desc", c),
                            e = "e" + i; // var s = (getCachedSortType(table.config.parsers,c) == "text") ?
                        // ((order == 0) ? "sortText" : "sortTextDesc") : ((order == 0) ?
                        // "sortNumeric" : "sortNumericDesc");
                        // var s = (table.config.parsers[c].type == "text") ? ((order == 0)
                        // ? makeSortText(c) : makeSortTextDesc(c)) : ((order == 0) ?
                        // makeSortNumeric(c) : makeSortNumericDesc(c));
                        dynamicExp += "var " + e + " = " + s, dynamicExp += "if(" + e + ") { return " + e + "; } ", dynamicExp += "else { "
                    } // if value is the same keep orignal order
                    var orgOrderCol = cache.normalized[0].length - 1;
                    dynamicExp += "return a[" + orgOrderCol + "]-b[" + orgOrderCol + "];";
                    for (var i = 0; i < l; i++) dynamicExp += "}; ";
                    return dynamicExp += "return 0; ", dynamicExp += "}; ", table.config.debug && benchmark("Evaling expression:" + dynamicExp, new Date), eval(dynamicExp), cache.normalized.sort(sortWrapper), table.config.debug && benchmark("Sorting on " + sortList.toString() + " and dir " + order + " time:", sortTime), cache
                }

                function makeSortFunction(e, t, o) {
                    var n = "a[" + o + "]",
                        r = "b[" + o + "]";
                    if ("text" == e && "asc" == t) return "(" + n + " == " + r + " ? 0 : (" + n + " === null ? Number.POSITIVE_INFINITY : (" + r + " === null ? Number.NEGATIVE_INFINITY : (" + n + " < " + r + ") ? -1 : 1 )));";
                    return "text" == e && "desc" == t ? "(" + n + " == " + r + " ? 0 : (" + n + " === null ? Number.POSITIVE_INFINITY : (" + r + " === null ? Number.NEGATIVE_INFINITY : (" + r + " < " + n + ") ? -1 : 1 )));" : "numeric" == e && "asc" == t ? "(" + n + " === null && " + r + " === null) ? 0 :(" + n + " === null ? Number.POSITIVE_INFINITY : (" + r + " === null ? Number.NEGATIVE_INFINITY : " + n + " - " + r + "));" : "numeric" == e && "desc" == t ? "(" + n + " === null && " + r + " === null) ? 0 :(" + n + " === null ? Number.POSITIVE_INFINITY : (" + r + " === null ? Number.NEGATIVE_INFINITY : " + r + " - " + n + "));" : void 0
                }

                function makeSortText(e) {
                    return "((a[" + e + "] < b[" + e + "]) ? -1 : ((a[" + e + "] > b[" + e + "]) ? 1 : 0));"
                }

                function makeSortTextDesc(e) {
                    return "((b[" + e + "] < a[" + e + "]) ? -1 : ((b[" + e + "] > a[" + e + "]) ? 1 : 0));"
                }

                function makeSortNumeric(e) {
                    return "a[" + e + "]-b[" + e + "];"
                }

                function makeSortNumericDesc(e) {
                    return "b[" + e + "]-a[" + e + "];"
                }

                function sortText(e, t) {
                    return table.config.sortLocaleCompare ? e.localeCompare(t) : e < t ? -1 : e > t ? 1 : 0
                }

                function sortTextDesc(e, t) {
                    return table.config.sortLocaleCompare ? t.localeCompare(e) : t < e ? -1 : t > e ? 1 : 0
                }

                function sortNumeric(e, t) {
                    return e - t
                }

                function sortNumericDesc(e, t) {
                    return t - e
                }

                function getCachedSortType(e, t) {
                    return e[t].type
                }
                var parsers = [],
                    widgets = [];
                this.defaults = {
                    cssHeader: "header",
                    cssAsc: "headerSortUp",
                    cssDesc: "headerSortDown",
                    cssChildRow: "expand-child",
                    sortInitialOrder: "asc",
                    sortMultiSortKey: "shiftKey",
                    sortForce: null,
                    sortAppend: null,
                    sortLocaleCompare: !0,
                    textExtraction: "simple",
                    parsers: {},
                    widgets: [],
                    widgetZebra: {
                        css: ["even", "odd"]
                    },
                    headers: {},
                    widthFixed: !1,
                    cancelSelection: !0,
                    sortList: [],
                    headerList: [],
                    dateFormat: "us",
                    decimal: "/.|,/g",
                    onRenderHeader: null,
                    selectorHeaders: "thead th",
                    debug: !1
                }, this.benchmark = benchmark;
                this.construct = function(e) {
                    return this.each(function() { // if no thead or tbody quit.
                        if (this.tHead && this.tBodies) { // declare
                            var t, o, n, r; // new blank config object
                            this.config = {}, r = $.extend(this.config, $.tablesorter.defaults, e), t = $(this), $.data(this, "tablesorter", r), $(this).addClass("sorttable"), o = buildHeaders(this), this.config.parsers = buildParserCache(this, o), n = buildCache(this); // get the css class names, could be done else where.
                            var s = [r.cssDesc, r.cssAsc]; // fixate columns if the users supplies the fixedWidth option
                            fixColumnWidth(this), o.click(function(l) {
                                var e = t[0].tBodies[0] && t[0].tBodies[0].rows.length || 0;
                                if (!this.sortDisabled && 0 < e) {
                                    t.trigger("sortStart"); // store exp, for speed
                                    var d = $(this),
                                        c = this.column; // get current column index
                                    // get current column sort order
                                    // user only whants to sort on one
                                    // column
                                    if (this.order = this.count++ % 2, this.lockedOrder && (this.order = this.lockedOrder), !l[r.sortMultiSortKey]) {
                                        if (r.sortList = [], null != r.sortForce)
                                            for (var u = r.sortForce, p = 0; p < u.length; p++) u[p][0] != c && r.sortList.push(u[p]); // add column to sort list
                                        r.sortList.push([c, this.order])
                                    } else // the user has clicked on an all
                                        // ready sortet column.
                                        if (isValueInArray(c, r.sortList)) // revers the sorting direction
                                            // for all tables.
                                            for (var p = 0; p < r.sortList.length; p++) {
                                                var m = r.sortList[p],
                                                    g = r.headerList[m[0]];
                                                m[0] == c && (g.count = m[1], g.count++, m[1] = g.count % 2)
                                            } else // add column to sort list array
                                                r.sortList.push([c, this.order]); // stop normal event by returning false
                                    return setTimeout(function() {
                                        setHeadersCss(t[0], o, r.sortList, s), appendToTable(t[0], multisort(t[0], r.sortList, n))
                                    }, 1), !1
                                } // cancel selection
                            }).mousedown(function() {
                                if (r.cancelSelection) return this.onselectstart = function() {
                                    return !1
                                }, !1
                            }), t.bind("update", function() {
                                var e = this;
                                setTimeout(function() {
                                    e.config.parsers = buildParserCache(e, o), n = buildCache(e)
                                }, 1)
                            }).bind("updateCell", function(t, e) {
                                var o = this.config,
                                    r = [e.parentNode.rowIndex - 1, e.cellIndex]; // get position from the dom.
                                // update cache
                                n.normalized[r[0]][r[1]] = o.parsers[r[1]].format(getElementText(o, e), e)
                            }).bind("sorton", function(t, e) {
                                $(this).trigger("sortStart"), r.sortList = e; // update and store the sortlist
                                var l = r.sortList; // update header count index
                                updateHeaderSortCount(this, l), setHeadersCss(this, o, l, s), appendToTable(this, multisort(this, l, n))
                            }).bind("appendCache", function() {
                                appendToTable(this, n)
                            }).bind("applyWidgetId", function(t, e) {
                                getWidgetById(e).format(this)
                            }).bind("applyWidgets", function() {
                                applyWidget(this)
                            }), $.metadata && $(this).metadata() && $(this).metadata().sortlist && (r.sortList = $(this).metadata().sortlist), 0 < r.sortList.length && t.trigger("sorton", [r.sortList]), applyWidget(this)
                        }
                    })
                }, this.addParser = function(e) {
                    for (var t = parsers.length, o = !0, n = 0; n < t; n++) parsers[n].id.toLowerCase() == e.id.toLowerCase() && (o = !1);
                    o && parsers.push(e)
                }, this.addWidget = function(e) {
                    widgets.push(e)
                }, this.formatFloat = function(e) {
                    var t = parseFloat(e);
                    return isNaN(t) ? 0 : t
                }, this.formatInt = function(e) {
                    var t = parseInt(e);
                    return isNaN(t) ? 0 : t
                }, this.isDigit = function(e) { // replace all an wanted chars and match.
                    return /^[-+]?\d*$/.test($.trim(e.replace(/[,.']/g, "")))
                }, this.clearTableBody = function(e) {
                    $(e.tBodies[0]).empty()
                }
            }
        }), $.fn.extend({
            tablesorter: $.tablesorter.construct
        }); // make shortcut
        var ts = $.tablesorter; // add default parsers
        // add default widgets
        ts.addParser({
            id: "text",
            is: function() {
                return !0
            },
            format: function(e) {
                return $.trim(e.toLocaleLowerCase())
            },
            type: "text"
        }), ts.addParser({
            id: "digit",
            is: function(e, t) {
                var o = t.config;
                return $.tablesorter.isDigit(e, o)
            },
            format: function(e) {
                return $.tablesorter.formatFloat(e)
            },
            type: "numeric"
        }), ts.addParser({
            id: "currency",
            is: function(e) {
                return /^[£$€?.]/.test(e)
            },
            format: function(e) {
                return $.tablesorter.formatFloat(e.replace(new RegExp(/[£$€]/g), ""))
            },
            type: "numeric"
        }), ts.addParser({
            id: "ipAddress",
            is: function(e) {
                return /^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(e)
            },
            format: function(e) {
                for (var t = e.split("."), o = "", n = t.length, s = 0, l; s < n; s++) l = t[s], o += 2 == l.length ? "0" + l : l;
                return $.tablesorter.formatFloat(o)
            },
            type: "numeric"
        }), ts.addParser({
            id: "url",
            is: function(e) {
                return /^(https?|ftp|file):\/\/$/.test(e)
            },
            format: function(e) {
                return jQuery.trim(e.replace(new RegExp(/(https?|ftp|file):\/\//), ""))
            },
            type: "text"
        }), ts.addParser({
            id: "isoDate",
            is: function(e) {
                return /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(e)
            },
            format: function(e) {
                return $.tablesorter.formatFloat("" == e ? "0" : new Date(e.replace(new RegExp(/-/g), "/")).getTime())
            },
            type: "numeric"
        }), ts.addParser({
            id: "percent",
            is: function(e) {
                return /\%$/.test($.trim(e))
            },
            format: function(e) {
                return $.tablesorter.formatFloat(e.replace(new RegExp(/%/g), ""))
            },
            type: "numeric"
        }), ts.addParser({
            id: "usLongDate",
            is: function(e) {
                return e.match(new RegExp(/^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/))
            },
            format: function(e) {
                return $.tablesorter.formatFloat(new Date(e).getTime())
            },
            type: "numeric"
        }), ts.addParser({
            id: "shortDate",
            is: function(e) {
                return /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(e)
            },
            format: function(e, t) {
                var o = t.config;
                return e = e.replace(/\-/g, "/"), "us" == o.dateFormat ? e = e.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, "$3/$1/$2") : "uk" == o.dateFormat ? e = e.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, "$3/$2/$1") : ("dd/mm/yy" == o.dateFormat || "dd-mm-yy" == o.dateFormat) && (e = e.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/, "$1/$2/$3")), $.tablesorter.formatFloat(new Date(e).getTime())
            },
            type: "numeric"
        }), ts.addParser({
            id: "time",
            is: function(e) {
                return /^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/.test(e)
            },
            format: function(e) {
                return $.tablesorter.formatFloat(new Date("2000/01/01 " + e).getTime())
            },
            type: "numeric"
        }), ts.addParser({
            id: "metadata",
            is: function() {
                return !1
            },
            format: function(e, t, o) {
                var n = t.config,
                    r = n.parserMetadataName ? n.parserMetadataName : "sortValue";
                return $(o).metadata()[r]
            },
            type: "numeric"
        }), ts.addParser({
            id: "unitIcon",
            is: function() {
                return !1
            },
            format: function(e, t, o) {
                var n = 0;
                return $(o).find("span").each(function(e, t) {
                    var o = $(t).attr("class").split(" ");
                    $(o).each(function(e, t) {
                        var o = t.match(/s(\d+)/);
                        if (null != o) {
                            var r = o[1];
                            300 < r && 400 > r ? n = r - 300 : 200 < r && 300 > r && (n = r - 100)
                        }
                    })
                }), n
            },
            type: "numeric"
        }), ts.addParser({
            id: "sortValue",
            is: function() {
                return !1
            },
            format: function(e, t, o) {
                var n = 0,
                    r = $(o).attr("sortValue");
                return null != r && (n = r), n
            },
            type: "numeric"
        }), ts.addWidget({
            id: "zebra",
            format: function(e) {
                if (e.config.debug) var t = new Date;
                var o = -1,
                    n, r; // loop through the visible rows
                $("tr", e.tBodies[0]).each(function() {
                    n = $(this), n.hasClass(e.config.cssChildRow) || o++, r = 0 == o % 2, n.removeClass(e.config.widgetZebra.css[r ? 0 : 1]).addClass(e.config.widgetZebra.css[r ? 1 : 0])
                }), e.config.debug && $.tablesorter.benchmark("Applying Zebra widget", t)
            }
        })
    }(jQuery),
    function(t) {
        var e = Math.ceil; // extend plugin scope
        t.extend({
            tablesorterPager: new function() {
                function n(e) {
                    t(e.cssPagerNr, e.container).html(e.page + 1 + e.seperator + e.totalPages)
                }

                function r(e) {
                    var n = e.config;
                    if (!n.pagerPositionSet && n.positionFixed) {
                        var n = e.config,
                            r = t(e);
                        r.offset && n.container.css({ //							top: o.offset().top + o.height() + 'px',
                            //							position: 'absolute'
                        }), n.pagerPositionSet = !0
                    }
                }

                function s(e) {
                    var t = e.config;
                    t.page = 0, p(e)
                }

                function d(e) {
                    var t = e.config;
                    t.page = t.totalPages - 1, p(e)
                }

                function c(e) {
                    var t = e.config;
                    t.page++, t.page >= t.totalPages - 1 && (t.page = t.totalPages - 1), p(e)
                }

                function u(e) {
                    var t = e.config;
                    t.page--, 0 >= t.page && (t.page = 0), p(e)
                }

                function p(e) {
                    var t = e.config;
                    (0 > t.page || t.page > t.totalPages - 1) && (t.page = 0), m(e, t.rowsCopy)
                }

                function m(u, p) {
                    var m = u.config,
                        c = p.length,
                        g = m.page * m.size,
                        s = g + m.size;
                    s > p.length && (s = p.length);
                    var h = t(u.tBodies[0]); // clear the table body
                    t.tablesorter.clearTableBody(u);
                    for (var b = g; b < s; b++) //tableBody.append(rows[i]);
                        for (var v = p[b], c = v.length, x = 0; x < c; x++) h[0].appendChild(v[x]);
                    r(u, h), t(u).trigger("applyWidgets"), m.page >= m.totalPages && d(u), n(m)
                }
                this.appender = function(t, o) {
                    var n = t.config;
                    n.rowsCopy = o, n.totalRows = o.length, n.totalPages = e(n.totalRows / n.size), m(t, o)
                }, this.defaults = {
                    size: 10,
                    offset: 0,
                    page: 0,
                    totalRows: 0,
                    totalPages: 0,
                    container: null,
                    cssNext: ".next",
                    cssPrev: ".prev",
                    cssFirst: ".first",
                    cssLast: ".last",
                    cssPagerNr: ".pagerdisplay",
                    seperator: " / ",
                    positionFixed: !0,
                    appender: this.appender
                }, this.construct = function(e) {
                    return this.each(function() {
                        config = t.extend(this.config, t.tablesorterPager.defaults, e);
                        var o = this,
                            n = config.container; //config.size = parseInt($(".pageSize",pager).val());
                        t(".pager").html("<div class=\"first\"></div><div class=\"prev\"></div><span class=\"pagerdisplay\"></span><div class=\"next\"></div><div class=\"last\"></div>"), t(this).trigger("appendCache"), config.size = parseInt(t(".pager").attr("pageSize")), t(config.cssFirst, n).click(function() {
                            return s(o), !1
                        }), t(config.cssNext, n).click(function() {
                            return c(o), !1
                        }), t(config.cssPrev, n).click(function() {
                            return u(o), !1
                        }), t(config.cssLast, n).click(function() {
                            return d(o), !1
                        })
                    })
                }
            }
        }), t.fn.extend({
            tablesorterPager: t.tablesorterPager.construct
        })
    }(jQuery),
    function(e) {
        function t(e, t) {
            if (isIE) {
                var o, r, s;
                for (o = 0; o < doc.length; ++o) r = d[o], s = t[r], f.isFunction(s) && s != a[r] && (e[r] = s)
            }
        }
        e.augment = function(t, o) {
            if (!t || !o) throw new Error("Augment failed!");
            var n = [t.prototype, o.prototype],
                r;
            for (r = 2; r < arguments.length; ++r) n.push(arguments[r]);
            return e.augmentObject.apply(this, n), t
        }, e.augmentObject = function(e, n) {
            if (!e || !n) throw new Error("AugmentObject failed!");
            var r = arguments,
                s = r[2],
                d, c;
            if (s && !0 !== s)
                for (d = 2; d < r.length; ++d) e[r[d]] = n[r[d]];
            else {
                for (c in n)(s || !(c in e)) && (e[c] = n[c]);
                t(e, n)
            }
            return e
        }, e.isString = function(e) {
            return "string" == typeof e
        }, e.isValue = function(t) {
            return t && ("object" === _typeof(t) || e.isFunction(t)) || "string" === t || e.isNumeric(t) || "boolean" == typeof t
        }, e.stopEvent = function(t) {
            t.stopPropagation(), t.preventDefault()
        }, e.fn.addListener = function(t, o, n) {
            e(this).on(t, function(t) {
                o.apply(n, [t])
            })
        }
    }(jQuery),
    function(e) {
        var t = Math.round,
            o = Math.max;

        function n(n, c, u) {
            var p = c.offset();
            ikariam.netbarActive && (p.top -= 32);
            var m = u.find("ul"),
                g = u.bg.height(),
                b = p.top + c.height(),
                v = e(window).scrollTop(),
                x = p.top - v - 20,
                C = e(window).height() + v - b - 20;
            u.maxHeight = g, u.opensToTop = !1, g > C && (x > C ? (u.maxHeight = x, u.opensToTop = !0) : u.maxHeight = C), u.ulHeight > u.maxHeight ? (u.css({
                height: u.maxHeight + "px",
                overflow: "hidden"
            }), u.bg.css("margin-top", "0px"), touchVersion ? s(u) : (u.bg.css("width", u.ulWidth - u.scrollArea.width() + "px"), m.css("width", u.ulWidth - u.scrollArea.width() + "px"), u.scrollH = o(n.scrollSliderMinHeight, u.maxHeight * u.maxHeight / u.ulHeight), u.scrollDist = t(u.maxHeight - u.scrollH), u.sliderHeight = o(n.scrollSliderMinHeight, t(u.scrollH - n.scrollbarArrowsHeight)), u.scrollbarArrowsHeight = n.scrollbarArrowsHeight, u.scrollDist = u.maxHeight - u.sliderHeight - n.scrollbarArrowsHeight, u.scroller = u.scrollArea.children(".dropdownScroller"), u.scroller.css({
                height: u.sliderHeight + "px"
            }), _Drag.init(u.scroller[0], null, 1, 1, 0, u.scrollDist), u.scroller[0].onDrag = function() {
                h = !0;
                var e = parseInt(u.scroller.css("top")),
                    t = parseInt(0 - e * (u.ulHeight - u.maxHeight) / u.scrollDist);
                u.bg.css("margin-top", (-2 >= t ? t : 0) + "px")
            }, u.scrollArea.children(".scrollArrowBottom").css({
                top: u.maxHeight - u.sliderHeight - n.scrollbarArrowsHeight + "px"
            }), !u.scrollEvents && r(n, u)), g = u.maxHeight) : (u.bg.css("margin-top", "0px"), touchVersion ? d(u) : (u.bg.css("width", u.ulWidth + "px"), m.css("width", u.ulWidth + "px"), u.scrollEvents && l(u))), u.opensToTop ? b = p.top - g : ikariam.netbarActive && (b -= 32);
            var y, _;
            "rtl" === n.languageDirection ? (y = "right", _ = e("body").outerWidth() - (c.width() + p.left), _ -= 7) : (y = "left", _ = p.left), u.css({
                height: g + "px",
                top: b + "px"
            }).css(y, _)
        }

        function r(e, t) {
            t.scrollArea.on("click", function(o) {
                var e = o.pageY - t.scrollArea.offset().top - t.scroller.height() / 2 - t.scrollArea.children(".scrollArrowTop").height();
                m(t, e), o.stopPropagation(), o.preventDefault()
            }), t.scrollArea.children(".scrollArrowBottom").on("mousedown", function() {
                b = !0, c(t, 2 * e.scrollStep)
            }).on("mouseup", function() {
                b = !1, h = !0
            }).on("click", function(e) {
                e.stopPropagation()
            }), t.scrollArea.children(".scrollArrowTop").on("mousedown", function() {
                b = !0, c(t, 2 * -e.scrollStep)
            }).on("mouseup", function() {
                b = !1, h = !0
            }).on("click", function(e) {
                e.stopPropagation()
            }), t.scroller.on("click", function(e) {
                e.stopPropagation()
            }), t.on("mousewheel", function(o, n) {
                m(t, g(t) - e.scrollStep * n / 2), o.stopPropagation(), o.preventDefault()
            }), t.scrollEvents = !0
        }

        function s(t) {
            t.on("touchstart", function(o) {
                var e = parseInt(t.bg.css("margin-top"));
                isNaN(e) && (e = 0), this.touchStartY = e - o.originalEvent.touches[0].pageY
            }).on("touchmove", function(n) {
                n.preventDefault();
                var e = Math.min(0, n.originalEvent.touches[0].pageY + this.touchStartY),
                    r = -t.ulHeight + t.maxHeight;
                e = o(e, r), t.bg.css("margin-top", e + "px")
            })
        }

        function l(e) {
            e.scrollArea.off("click"), e.scrollArea.children(".scrollArrowBottom").off("mousedown").off("mouseup").off("click"), e.scrollArea.children(".scrollArrowTop").off("mousedown").off("mouseup").off("click"), e.off("mousewheel"), e.scrollEvents = !1
        }

        function d(e) {
            e.bg.off("touchstart touchmove")
        }

        function c(e, t) {
            m(e, g(e) + t), b && w.setTimeout(function() {
                b && c(e, t)
            }, 100)
        }

        function u(e) {
            e.scroller.css("top", "0px"), e.bg.css("margin-top", "0px")
        }

        function p(e) {
            var t = parseInt(0 - (e.ulHeight - e.height()));
            e.scroller.css("top", e.scrollDist + "px"), e.bg.css("margin-top", t + "px")
        }

        function m(e, t) {
            return void 0 === e.scroller[0].onDrag ? void 0 : 1 > t ? void u(e) : t > e.scrollDist ? void p(e) : void(e.scroller.css("top", t + "px"), e.scroller[0].onDrag())
        }

        function g(e) {
            return parseInt(e.scroller.css("top"), 10)
        }
        var h = !1,
            b = !1,
            v = {
                replace: function(t) {
                    var o = e.extend({
                        scrollSliderMinHeight: 10, // minimale Höhe des Scrollsliders in der Scrollbar
                        scrollbarArrowsHeight: 32, // Gesamthöhe der beiden Pfeilbuttons in der Scrollbar
                        scrollStep: 8, // Anzahl Pixel, die pro Tick des Mausrads gescrollt werden soll
                        onChange: null, // onChange-Event für
                        removeSelect: !1,
                        languageDirection: "ltr"
                    }, t);
                    return this.each(function() {
                        var t = e(this);
                        if (!t.hasClass("replaced")) {
                            var r = t.children("select");
                            if (r.hasClass("dropdown") || t.hasClass("city_select")) { // Wenn in den Settings "onChange" gesetzt ist das verwenden, ansonsten mal schaun, ob die select-box eins hat
                                var s = t.attr("id"),
                                    l = null === o.onChange ? r.attr("onchange") : o.onChange,
                                    d = "",
                                    c = "",
                                    u = "",
                                    p = e("<ul></ul>");
                                r.find("option").each(function() {
                                    var o = e(this),
                                        n = o.attr("class");
                                    void 0 === n && (n = "");
                                    var s;
                                    if (s = t.hasClass("iconDiv") ? "<span class=\"" + o.attr("spanClass") + "\"></span><a>" + o.html() + "</a>" : "<a title=\"" + o.html() + "\"> " + o.html() + "</a>", (o.val() === r.val() || "" === c) && (d = o.val(), c = o.html(), u = n, t.hasClass("iconDiv") && (u = o.attr("spanClass"))), "none" !== o.css("display")) {
                                        var l = e("<li selectValue=\"" + o.val() + "\">" + s + "</li>");
                                        "" !== n && l.addClass(n), p.append(l)
                                    }
                                }), p.children("li").first().addClass("first-child"), p.children("li").last().addClass("last-child"), e("#dropDown_" + s).remove();
                                var m = e("<div id=\"dropDown_" + s + "\" class=\"dropdownContainer\"><div class=\"bg\"></div></div>"),
                                    g;
                                m.addClass(t.attr("class")).removeClass("select_container"), t.hasClass("iconDiv") ? g = e("<span class=\"dropDownButton\"><span class=\"" + u + "\"></span><a></a></span>") : (g = e("<span class=\"dropDownButton\"><a></a></span>"), g.addClass(u)), t.append(g), e("#container").append(m), m.bg = m.children(".bg"), m.bg.append(p), m.bg.css("height", p.height()), m.ulWidth = p.width(), "rtl" === o.languageDirection && (m.ulWidth += 7, g.css({
                                    width: g.width() - 7
                                })), m.ulHeight = p.height(), m.css({
                                    height: m.ulHeight,
                                    width: m.ulWidth
                                }), t.hasClass("icon_only") && !(t.hasClass("iconDiv") && null == u) && "allResources" != u ? c = "" : t.hasClass("shorten_text") && (g.children("a").attr("title", c), c = shortenText(c, 155)), g.children("a").html(c), touchVersion || (m.scrollArea = e("<div class=\"scrollArea\"><div class=\"scrollArrowTop\"></div><div class=\"dropdownScroller\"></div><div class=\"scrollArrowBottom\"></div></div>"), m.append(m.scrollArea)), m.scrollEvents = !1, n(o, g, m), m.hide(0), t.children(".dropDownButton").on("click", function(s) {
                                    "none" === m.css("display") && (s.stopPropagation(), n(o, g, m), m.show(1, function() {
                                        e("body").trigger("click.dropDown"), g.addClass("active"), m.find("li").on("click", function() {
                                            if (o.removeSelect || e(this).attr("selectValue") !== r.val()) {
                                                c = e(this).children("a").html();
                                                var n = "";
                                                t.hasClass("icon_only") ? c = "" : t.hasClass("shorten_text") && (c = shortenText(c, 155)), g.children("a").html(c), void 0 !== e(this).attr("class") && (n = e(this).attr("class")), g.removeClass(u).addClass(n), u = n, o.removeSelect ? l(e(this).attr("selectValue")) : (r.val(e(this).attr("selectValue")), r.trigger("change").triggerHandler("valueInput"))
                                            }
                                        }), e("body").on("click.dropDown", function() {
                                            g.removeClass("active"), m.hide(0), e("body").off("click.dropDown"), m.find("li").off("click")
                                        })
                                    }))
                                }), o.removeSelect || r.on("updateValue", function() {
                                    var o = m.find("li[selectValue=" + e(this).val() + "]");
                                    if (!(1 > o.length)) {
                                        var n = o.children("a").html(),
                                            r = "";
                                        t.hasClass("icon_only") ? n = "" : t.hasClass("shorten_text") && (n = shortenText(n, 155)), g.children("a").html(n), void 0 !== o.attr("class") && (r = o.attr("class")), g.removeClass(u).addClass(r), u = r
                                    }
                                }), e(window).on("resize." + s, function() {
                                    "none" === m.css("display") || n(o, g, m)
                                }), o.removeSelect && r.remove(), t.addClass("replaced")
                            }
                        }
                    })
                },
                remove: function() {
                    return this.each(function() {
                        e(this).hasClass("replaced") && (e(this).children(".dropDownButton").remove(), e(window).off("resize." + e(this).attr("id")), e("#container").children("#dropDown_" + e(this).attr("id")).remove(), e(this).removeClass("replaced"))
                    })
                }
            };
        e.fn.dropdown = function(t) {
            if (v[t]) return v[t].apply(this, Array.prototype.slice.call(arguments, 1));
            return "object" !== _typeof(t) && t ? void e.error("Method " + t + " does not exist on jQuery.dropdown") : v.replace.apply(this, arguments)
        }
    }(jQuery);
var EventProvider = {
        prototype: {
            __yui_events: null,
            __yui_subscribers: null,
            subscribe: function(t, o, n, r) {
                this.__yui_events = this.__yui_events || {};
                var e = this.__yui_events[t];
                if (e) e.subscribe(o, n, r);
                else {
                    this.__yui_subscribers = this.__yui_subscribers || {};
                    var s = this.__yui_subscribers;
                    s[t] || (s[t] = []), s[t].push({
                        fn: o,
                        obj: n,
                        overrideContext: r
                    })
                }
            },
            unsubscribe: function(t, o, e) {
                this.__yui_events = this.__yui_events || {};
                var n = this.__yui_events;
                if (t) {
                    var r = n[t];
                    if (r) return r.unsubscribe(o, e)
                }
                return !1
            },
            unsubscribeAll: function(e) {
                return this.unsubscribe(e)
            },
            createEvent: function(t, o) {
                this.__yui_events = this.__yui_events || {};
                var n = o || {},
                    e = this.__yui_events,
                    r;
                if (e[t]);
                else {
                    r = new _Yui_CustomEvent(t, n.scope || this, n.silent, _Yui_CustomEvent.FLAT, n.fireOnce), e[t] = r, n.onSubscribeCallback && r.subscribeEvent.subscribe(n.onSubscribeCallback), this.__yui_subscribers = this.__yui_subscribers || {};
                    var s = this.__yui_subscribers[t];
                    if (s)
                        for (var l = 0; l < s.length; ++l) r.subscribe(s[l].fn, s[l].obj, s[l].overrideContext)
                }
                return e[t]
            },
            fireEvent: function(e) {
                this.__yui_events = this.__yui_events || {};
                var t = this.__yui_events[e];
                if (!t) return null;
                for (var o = [], n = 1; n < arguments.length; ++n) o.push(arguments[n]);
                return t.fire.apply(t, o)
            }
        }
    },
    _Yui_CustomEvent = function(t, o, n, r, s) {
        this.type = t, this.scope = o || window, this.silent = n, this.fireOnce = s, this.fired = !1, this.firedWith = null, this.signature = r || _Yui_CustomEvent.LIST, this.subscribers = [], !this.silent;
        t !== "_YUICEOnSubscribe" && (this.subscribeEvent = new _Yui_CustomEvent("_YUICEOnSubscribe", this, !0)), this.lastError = null
    };
_Yui_CustomEvent.LIST = 0, _Yui_CustomEvent.FLAT = 1, _Yui_CustomEvent.prototype = {
    subscribe: function(e, t, o) {
        if (!e) throw new Error("Invalid callback for subscriber to '" + this.type + "'");
        this.subscribeEvent && this.subscribeEvent.fire(e, t, o);
        var n = new Subscriber(e, t, o);
        this.fireOnce && this.fired ? this.notify(n, this.firedWith) : this.subscribers.push(n)
    },
    unsubscribe: function(t, o) {
        if (!t) return this.unsubscribeAll();
        for (var n = !1, r = 0, s = this.subscribers.length, l; r < s; ++r) l = this.subscribers[r], l && l.contains(t, o) && (this._delete(r), n = !0);
        return n
    },
    fire: function() {
        this.lastError = null;
        var t = this.subscribers.length,
            o = [].slice.call(arguments, 0),
            n = !0,
            r;
        if (this.fireOnce) {
            if (this.fired) return !0;
            this.firedWith = o
        }
        if (this.fired = !0, !t && this.silent) return !0;
        !this.silent;
        var s = this.subscribers.slice();
        for (r = 0; r < t; ++r) {
            var e = s[r];
            if (!e || !e.fn);
            else if (n = this.notify(e, o), !1 === n) {
                !this.silent;
                break
            }
        }
        return !1 !== n
    },
    notify: function(e, t) {
        var o = null,
            n = e.getScope(this.scope),
            r;
        if (!this.silent, this.signature == _Yui_CustomEvent.FLAT) {
            0 < t.length && (o = t[0]);
            try {
                r = e.fn.call(n, o, e.obj)
            } catch (e) {
                this.lastError = e
            }
        } else try {
            r = e.fn.call(n, this.type, t, e.obj)
        } catch (e) {
            this.lastError = e
        }
        return r
    },
    unsubscribeAll: function() {
        var e = this.subscribers.length,
            t;
        for (t = e - 1; - 1 < t; t--) this._delete(t);
        return this.subscribers = [], e
    },
    _delete: function(e) {
        var t = this.subscribers[e];
        t && (delete t.fn, delete t.obj), this.subscribers.splice(e, 1)
    },
    toString: function() {
        return "Yui_CustomEvent: '" + this.type + "', context: " + this.scope
    }
}, Subscriber = function(e, t, o) {
    this.fn = e, this.obj = t === void 0 ? null : t, this.overrideContext = o
}, Subscriber.prototype.getScope = function(e) {
    return this.overrideContext ? !0 === this.overrideContext ? this.obj : this.overrideContext : e
}, Subscriber.prototype.contains = function(e, t) {
    return t ? this.fn == e && this.obj == t : this.fn == e
}, Subscriber.prototype.toString = function() {
    return "Subscriber { obj: " + this.obj + ", overrideContext: " + (this.overrideContext || "no") + " }"
}; // Global object to hold drag information.
var dragObj = {};

function dragStart(e, t) { // If an element id was given, find it. Otherwise use the element being clicked on. 
    if (!t) dragObj.elNode = isIE ? w.event.srcElement : e.target, 3 == dragObj.elNode.nodeType && (dragObj.elNode = dragObj.elNode.parentNode);
    else if (dragObj.elNode = $("#" + t)[0], void 0 === dragObj.elNode) return void dragStop(e); // window was closed while dragging!	
    // Get cursor position with respect to the page. 
    var o = isIE ? w.event.clientX + doc.documentElement.scrollLeft + doc.body.scrollLeft : e.clientX + window.scrollX,
        n = isIE ? w.event.clientY + doc.documentElement.scrollTop + doc.body.scrollTop : e.clientY + window.scrollY; // Save starting positions of cursor and element.
    dragObj.cursorStartX = o, dragObj.cursorStartY = n, dragObj.elStartLeft = "auto" === $(dragObj.elNode).css("left") ? parseInt(dragObj.elNode.offsetLeft, 10) : parseInt($(dragObj.elNode).css("left"), 10), dragObj.elStartTop = "" === $(dragObj.elNode).css("top") ? parseInt(dragObj.elNode.offsetTop, 10) : parseInt($(dragObj.elNode).css("top"), 10), "auto" !== $(dragObj.elNode).css("right") && $(dragObj.elNode).css({
        top: dragObj.elStartTop + "px",
        left: dragObj.elStartLeft + "px",
        right: "auto"
    }), isNaN(dragObj.elStartLeft) && (dragObj.elStartLeft = 0), isNaN(dragObj.elStartTop) && (dragObj.elStartTop = 0), isIE && isIE8 ? (doc.attachEvent("onmousemove", dragGo), doc.attachEvent("onmouseup", dragStop), w.event.cancelBubble = !0, w.event.returnValue = !1) : (doc.addEventListener("mousemove", dragGo, !0), doc.addEventListener("mouseup", dragStop, !0), e.preventDefault())
}

function dragGo(e) {
    var t = Math.max,
        o = isIE ? w.event.clientX + doc.documentElement.scrollLeft + doc.body.scrollLeft : e.clientX + w.scrollX,
        n = isIE ? w.event.clientY + doc.documentElement.scrollTop + doc.body.scrollTop : e.clientY + w.scrollY,
        r = t(doc.body.offsetWidth, ikariam.minResolutionX),
        s = t(doc.body.offsetHeight, ikariam.minResolutionY); // Get cursor position with respect to the page. 
    widthCorrection = dragObj.elNode.scrollWidth, 50 < o && o < r - 50 && 50 < n && n < s - 50 && $(dragObj.elNode).css({
        left: dragObj.elStartLeft + (o - dragObj.cursorStartX) + "px",
        top: dragObj.elStartTop + n - dragObj.cursorStartY + "px"
    }), isIE ? (w.event.cancelBubble = !0, w.event.returnValue = !1) : e.preventDefault()
}

function dragStop() {
    var e = Math.max;
    isIE && isIE8 ? (doc.detachEvent("onmousemove", dragGo), doc.detachEvent("onmouseup", dragStop)) : (doc.removeEventListener("mousemove", dragGo, !0), doc.removeEventListener("mouseup", dragStop, !0));
    var t = parseInt($(dragObj.elNode).css("z-index"));
    $(dragObj.elNode).css("z-index", t - 1), null !== ikariam.templateView && null !== ikariam.templateView.mainbox && (ikariam.templateView.mainboxUserPosition = [ikariam.templateView.mainbox.boxRoot.style.left, ikariam.templateView.mainbox.boxRoot.style.right, ikariam.templateView.mainbox.boxRoot.style.top], "auto" != ikariam.templateView.mainbox.boxRoot.style.left && (ikariam.mainbox_x = parseInt(ikariam.templateView.mainbox.boxRoot.style.left), ikariam.mainbox_y = parseInt(ikariam.templateView.mainbox.boxRoot.style.right), ikariam.mainbox_z = parseInt(ikariam.templateView.mainbox.boxRoot.style.top))), null !== ikariam.templateView && null !== ikariam.templateView.sidebar && (ikariam.templateView.sidebarUserPosition = [ikariam.templateView.sidebar.boxRoot[0].style.left, ikariam.templateView.sidebar.boxRoot[0].style.right, ikariam.templateView.sidebar.boxRoot[0].style.top], "auto" != ikariam.templateView.sidebar.boxRoot[0].style.left && (ikariam.sidebar_x = parseInt(ikariam.templateView.sidebar.boxRoot[0].style.left), ikariam.sidebar_y = parseInt(ikariam.templateView.sidebar.boxRoot[0].style.right), ikariam.sidebar_z = parseInt(ikariam.templateView.sidebar.boxRoot[0].style.top))), console.log("box    " + ikariam.mainbox_x + " " + ikariam.mainbox_y + " " + ikariam.mainbox_z);
    var o = e(doc.body.offsetWidth, ikariam.minResolutionX),
        n = e(doc.body.offsetHeight, ikariam.minResolutionY);
    console.log("screen " + o + " " + n)
}

function simpleTimer(e, t) {
    var o = Math.floor;
    "undefined" == typeof e && (e = 500);
    var n = this;
    this.serverTimeDiff = t, this.currenttime = new Date().getTime() + this.serverTimeDiff, this.tm, this.updatefrequency = 1e3, this.ls = o(this.currenttime / this.updatefrequency), this.onUpdate = function() {
        this.currenttime = new Date().getTime() + this.serverTimeDiff, this.ls != o(this.currenttime / this.updatefrequency) && (this.ls = o(this.currenttime / this.updatefrequency), $(this).trigger("update"))
    }, this.startTimer = function() {
        this.tm = setTimeout(function() {
            n.startTimer.call(n)
        }, e), this.onUpdate()
    }, this.stopTimer = function() {
        this.tm = clearTimeout(this.iv)
    }
}

function Timer(e, t, o) {
    var n = Math.floor;
    if ($.isValue(e) || alert("Timer enddate not a value. Variable is: " + e), $.isValue(t) || (t = 1e3 * new Date().getTime()), "undefined" == typeof o && (o = 500), this.enddate < this.currenttime) return !1;
    var r = this;
    this.enddate = 1e3 * e, this.serverTimeDiff = 1e3 * t - new Date().getTime(), this.currenttime = new Date().getTime() + this.serverTimeDiff, this.tm, this.updatefrequency = 1e3, this.ls = n(this.currenttime / this.updatefrequency), this.onUpdate = function() {
        if (void 0 !== this.el) {
            var e = this.el.data("uuid");
            if (void 0 === e || e != this.uuid) return void clearTimeout(this.tm)
        }
        this.currenttime = new Date().getTime() + this.serverTimeDiff, this.ls != n(this.currenttime / this.updatefrequency) && this.enddate > this.currenttime ? (this.ls = n(this.currenttime / this.updatefrequency), $(this).trigger("update")) : this.enddate < this.currenttime && ($(this).trigger("finished"), clearTimeout(this.tm))
    }, this.startTimer = function() {
        this.tm = setTimeout(function() {
            r.startTimer.call(r)
        }, o), this.onUpdate()
    }, this.stopTimer = function() {
        this.tm = clearTimeout(this.iv)
    }
} //factory for a progress bar. adds progress in percent and sets width of some element
function getProgressBar(e) {
    var t = Math.floor,
        o = new Timer(e.enddate, e.currentdate, e.interval);
    return o.startdate = 1e3 * e.startdate, o.duration = o.enddate - o.startdate, o.progress = 100 * ((o.currenttime - o.startdate) / o.duration), o.uuid = ++jQuery.uuid, o.el = $("#" + e.bar).data("uuid", o.uuid).css("width", o.progress + "%"), $(o).on("update", function() {
        this.progress = t(100 * ((this.currenttime - this.startdate) / this.duration)), this.el.css("width", this.progress + "%")
    }).on("finished", function() {
        this.el.css("width", "100%")
    }), o.startTimer(), o
}

function getCountdown(config) {
    var _Mathfloor4 = Math.floor,
        cnt = new Timer(config.enddate, config.currentdate, config.interval);
    return cnt.formattime = ikariam.model.getTimestring, cnt.startdate = 1e3 * config.startdate, cnt.timeoutAjaxRequest = config.timeoutAjaxRequest, cnt.timeoutLink = config.timeoutLink, cnt.timeoutAction = config.timeoutAction, cnt.uuid = ++jQuery.uuid, cnt.el = config.el instanceof jQuery ? config.el : $("#" + config.el), cnt.el.data("uuid", cnt.uuid), cnt.args = getCountdown.arguments, $(cnt).on("update", function() {
        for (var e = [this.enddate - 1e3 * _Mathfloor4(this.currenttime / 1e3)], t = 1; t < this.args.length; t++) e.push(this.args[t]);
        this.el.html(this.formattime.apply(this, e))
    }).on("finished", function() {
        this.el.html("-"), void 0 !== this.timeoutAction && eval(this.timeoutAction), void 0 === this.timeoutAjaxRequest ? void 0 !== this.timeoutLink && (w.location.href = this.timeoutLink) : ajaxHandlerCall(this.timeoutAjaxRequest)
    }).trigger("update"), cnt.startTimer(), cnt
}

function getTimeout(e) {
    var t = e.element,
        o = 1e3 * e.time,
        n = e.name,
        r = e.className;
    ikariam.timeouts[n] && (clearTimeout(ikariam.timeouts[n]), delete ikariam.timeouts[n]), r && (ikariam.timeouts[n] = setTimeout(function() {
        0 === o && t.addClass(r)
    }, o))
}

function happyHourCountdown(e) {
    var t = Math.floor,
        o = new Timer(e.enddate, e.currentdate, e.interval);
    return o.formattime = ikariam.model.getTimestring, o.startdate = 1e3 * e.startdate, o.uuid = ++jQuery.uuid, o.el = $("#" + e.el).data("uuid", o.uuid), o.offEl = $("#" + e.offsetEl), o.args = happyHourCountdown.arguments, $(o).on("update", function() {
        for (var e = [this.enddate - 1e3 * t(this.currenttime / 1e3)], o = 1; o < this.args.length; o++) e.push(this.args[o]);
        this.el.html(this.formattime.apply(this, e)), this.offEl.val(e)
    }).on("finished", function() {
        this.el.html("-")
    }), o.startTimer(), o
}

function ingameCountdown(e) {
    var t = Math.floor,
        o = new Timer(e.enddate, e.currentdate, e.interval);
    return o.formattime = ikariam.model.getTimestring, o.startdate = 1e3 * e.startdate, o.uuid = ++jQuery.uuid, o.el = $("#" + e.el).data("uuid", o.uuid), o.offEl = $("#" + e.offsetEl), o.args = ingameCountdown.arguments, $(o).on("update", function() {
        for (var e = [this.enddate - 1e3 * t(this.currenttime / 1e3)], o = 1; o < this.args.length; o++) e.push(this.args[o]);
        this.el.html(this.formattime.apply(this, e)), this.offEl.val(e)
    }).on("finished", function() {
        this.el.html("-")
    }), o.startTimer(), o
}

function getFormattedDate(e, t) {
    var o = new Date;
    return o.setTime(e), str = t, str = str.replace("d", dezInt(o.getDate(), 2)), str = str.replace("m", dezInt(o.getMonth() + 1, 2)), str = str.replace("Y", o.getFullYear()), str = str.replace("y", o.getFullYear().toString().substr(2, 4)), str = str.replace("G", o.getHours()), str = str.replace("H", dezInt(o.getHours(), 2)), str = str.replace("i", dezInt(o.getMinutes(), 2)), str = str.replace("s", dezInt(o.getSeconds(), 2)), str
}

function getOfferOptionBox(e, t) {
    function o(e) {
        var o = t.options[e],
            d = $(r[e]);
        r.removeClass("active"), d.addClass("active"), l.html(o.tooltip), t.isCitizensPackage && (touchVersion ? n.find(".infoTip").html(o.tooltip) : n.find(".tooltip .textLabel").html(o.tooltip)), 0 < o.itemCount ? s.removeClass("ambrosia").removeClass("chargeAmbrosia").addClass("inventory").children(".orderButtonIcon").html("<div class=\"" + o.itemCss + " small\"></div>").end().children(".orderPrice").html("1") : o.price <= t.ambrosia ? s.removeClass("inventory").removeClass("chargeAmbrosia").addClass("ambrosia").children(".orderButtonIcon").html("").end().children(".orderPrice").html(ikariam.model.locaNumberFormat(o.price)) : s.removeClass("inventory").addClass("chargeAmbrosia").children(".orderButtonIcon").html("").end().children(".orderPrice").html(ikariam.model.locaNumberFormat(o.price - t.ambrosia))
    }
    var n = $("#" + e),
        r = n.find(".optionButton"),
        s = n.find(".orderButton"),
        l = n.find(".amountBox");
    if (r.off("click").removeClass(), s.off("click"), n.find(".offerName").html(t.name), n.find(".optionsDesc").html(t.optionsDesc), n.find(".offerIcon").attr("class", "offerIcon medium " + t.offerIcon), n.find(".offerDesc").html(t.offerDesc), n.find(".activeBox").children("span").attr("class", t.durationClass).html(t.durationText), touchVersion ? n.find(".infoTip").html(t.tooltip) : n.find(".tooltip .textLabel").html(t.tooltip), !(1 > t.options.length)) {
        for (var d = 0; 3 > d; d++) {
            var c = t.options[d],
                u = "optionButton " + c.css;
            c.price < t.ambrosia && 1 > c.item_count && (u += u + " disabled"), $(r[d]).attr("class", u).attr("tooltip", c.tooltip).data("index", d)
        }
        r.on("click", function() {
            o($(this).data("index")), ikariam.getPopupController().closePopup("confirmPopup")
        }), s.on("click", function() {
            var e = r.filter(".active").data("index"),
                o = t.options[e],
                n = "?action=InventoryAction&function=activateItem&itemId=" + o.itemId,
                s = "" != o.itemSecurityQuestion;
            if (0 < o.cityId && (n = n + "&cityId=" + o.cityId), 0 < o.setView.length && (n = n + "&setView=" + o.setView), 1 > o.itemCount && (o.price > t.ambrosia ? (n = 0 == loginMode ? "?view=premiumPayment" : "?view=" + ikariam.backgroundView.id + "&dialog=itunesPayment&loadMobilizerJS=1", s = !1) : (n = n + "&autoBuyItem=1&autoBuyPrice=" + o.price, s = s || 1 == o.confirmSpendAmbrosia)), !o.canBeActivated) !1 === s ? ajaxHandlerCall(n) : ikariam.createPopup("confirmPopup", "", [o.activationError, ["ikariam.getPopupController().closePopup('confirmPopup');"], LocalizationStrings.abort]);
            else if (s) {
                var l = 1 == o.confirmSpendAmbrosia && 1 > o.itemCount ? o.ambrosiaSecurityQuestion : "";
                "" != o.itemSecurityQuestion && (l = o.itemSecurityQuestion + "<br />" + l), ikariam.createPopup("confirmPopup", "", [l, n, LocalizationStrings.yes, LocalizationStrings.abort], 0)
            } else ajaxHandlerCall(n)
        }), o(t.active)
    }
}
var d = document;

function Scheduler() {
    var e = [],
        t = null,
        o = !1,
        n = !1;
    this.schedule = function(t, r, l) {
        t || (t = this.schedule.caller), r || (r = []), l || (l = this.schedule.caller), e.push([t, r, l]), o && n && (setTimeout("scheduler.loop()", 0), n = !1)
    }, this.run = function() {
        o = !0, this.loop()
    }, this.loop = function() {
        var o = e.shift();
        o ? (o[0].apply(o[2], o[1]), t = setTimeout("scheduler.loop()", 0)) : n = !0
    }, this.stop = function() {
        o = !1, clearTimeout(t)
    }
}
var scheduler = new Scheduler;
scheduler.run(), _Drag = function() {
    var e = Math.abs;
    this.dragstartTime = 0, this.dragstartCoords = [0, 0], this.targetEl = null, this.targetPageXY = [0, 0], this.dragactive = !1, this.coords = [0, 0], this.targetObject = {};
    var t = this; //mousedown, set startdate and startcoords
    //makes detectDrag the onmousemove-handler
    //sets the targetElem
    //mousemove, check if drag has been activated by timeout or if mouse was moved enough
    //if one condition becomes true, make the dragging function the onmousemove-handler
    //onmousemove when successfully grabbed a drag
    //logic goes in here
    //onmouseup, cleans the onmousemove-handler(whatever function it contains)
    $(document).ready(function() {
        $(d).on("mousedown", _Drag.startDetection)
    }), this.startDetection = function(e) {
        for (t.targetEl = e.target, t.targetObject = t.targetEl.dragObject;;) {
            if (null === t.targetEl) return;
            if ("undefined" == typeof t.targetEl.dragObject) t.targetEl = t.targetEl.parentNode;
            else {
                t.targetObject = t.targetEl.dragObject;
                break
            }
        }
        $.stopEvent(e), t.dragstartTime = new Date().getTime(), t.dragstartCoords = [e.pageX, e.pageY];
        var o = $(t.targetEl).offset();
        t.coords = [e.pageX, e.pageY], t.dragStartOffset = [t.dragstartCoords[0] - o.left, t.dragstartCoords[1] - o.top], $(d).on("mousemove", t.detectDrag), $(d).on("mouseup", t.endDrag)
    }, this.stopClicks = function(e) {
        $.stopEvent(e)
    }, this.detectDrag = function(o) {
        if ($.stopEvent(o), new Date().getTime() > t.dragstartTime + 100 ? t.dragactive = !0 : 8 < e(o.pageX - t.dragstartCoords[0]) && 8 < e(o.pageY - t.dragstartCoords[0]) && (t.dragactive = !0), t.dragactive) {
            $(d).off("mousemove", t.detectDrag), $(d).on("mousemove", t.dragging), $(d).on("click", t.stopClicks);
            try {
                t.targetObject.onDrag(t.dragStartOffset)
            } catch (e) {}
        }
    }, this.dragging = function(e) {
        $.stopEvent(e), t.coords = [e.pageX, e.pageY];
        try {
            t.targetObject.whileDrag(t.coords)
        } catch (e) {}
    }, this.endDrag = function(e) {
        if (t.dragactive) {
            $.stopEvent(e), t.dragactive = !1;
            try {
                t.targetObject.onDrop(t.coords)
            } catch (e) {}
        } //since a "click" is fired after this event finished, we need to wait until this eventhandler is finished before we allow clicks
        scheduler.schedule(function() {
            $(d).off("click", t.stopClicks)
        }), $(d).off("mouseup", t.endDrag).off("mousemove")
    }
}, ikDrag = new _Drag, valueInputs = [];

function Slider(e, t) {
    var o = Math.round,
        n = Math.abs,
        r = Math.max,
        s = Math.min,
        l = this,
        d = ikDrag,
        c = $("#" + e)[0];
    if ("undefined" == typeof c) return void console.warn("#" + e + " not present. creating no slider!");
    this.container = c.parentNode, "undefined" == typeof t.from ? (this.value = "undefined" == typeof t.value ? 0 : t.value, this.range = "undefined" == typeof t.range ? [0, 10] : t.range, this.input = "undefined" == typeof t.input ? null : t.input) : (this.value = t.from.value, this.range = t.from.range, this.input = t.from.input), this.input = $(this.input)[0];
    var u = "undefined" == typeof t.valueEl ? $(this.container).children(".valuebg").first()[0] : $("#" + t.valueEl)[0];
    if ("undefined" != typeof t.hiddenValues) var m = t.hiddenValues,
        g = [this.range[0], this.range[1] - m],
        h = "undefined" == typeof t.hiddenValueEl ? $(this.container).children(".hiddenbg").first()[0] : $("#" + t.hiddenValueEl)[0],
        b = !!(this.value >= g[1]); //set to opposite so that it gets redrawn the first time
    this.createEvent("change"), this.createEvent("setRange"), this.createEvent("valueChange"), this.createEvent("slideStart"), this.createEvent("drag"), this.createEvent("slideEnd"), this.createEvent("drop");
    var x = [0, 0, 0, 0],
        C = 0,
        y = this.container.currentStyle ? this.container.currentStyle : w.getComputedStyle ? w.getComputedStyle(this.container, null) : this.container.style;
    this.setConstraints = function(e) {
        x = "undefined" == typeof e ? [convertStylePx(y.paddingTop), convertStylePx(y.paddingLeft) + convertStylePx(y.width) - (c.offsetWidth ? c.offsetWidth : 16), convertStylePx(y.paddingTop) + convertStylePx(y.height) - (c.offsetHeight ? c.offsetHeight : 30), convertStylePx(y.paddingLeft)] : e, C = convertStylePx(y.width) - (c.offsetWidth ? c.offsetWidth : 16)
    }, this.setConstraints(), c.dragObject = this, this.dragStartOffset = [0, 0];
    var _ = [c.offsetLeft, c.offsetTop],
        k = [0, 0],
        T = [0, 0];
    if (this.onDrag = function(e) {
            this.dragStartOffset = e, _ = [c.offsetLeft, c.offsetTop], this.fireEvent("slideStart"), this.fireEvent("drag")
        }, this.whileDrag = function() {
            T = [d.coords[0] - d.dragstartCoords[0], d.coords[1] - d.dragstartCoords[1]], k = [_[0] + T[0], _[1] + T[1]], this.dragPosition(k)
        }, this.onDrop = function() {
            this.fireEvent("slideEnd"), this.fireEvent("drop"), this.setPosition(k)
        }, this.clickContainer = function(e) {
            if (e.target != c) {
                var t = $(l.container).offset(),
                    o = [e.pageX, e.pageY];
                l.setPosition([o[0] - t.left - c.offsetWidth / 2, o[1] - t.top - c.offsetWidth / 2])
            }
        }, this.removeEvents = function() {
            $(this.container).off("click", this.clickContainer)
        }, $(this.container).on("click", this.clickContainer).on("mousedown", d.startDetection), touchVersion) {
        $(this.container).on("touchstart", function(t) {
            t.preventDefault(), $(this).trigger($.extend(t, {
                type: "mousedown",
                pageX: t.originalEvent.touches[0].pageX,
                pageY: t.originalEvent.touches[0].pageY
            }))
        }).on("touchmove", function(t) {
            t.preventDefault(), $(this).trigger($.extend(t, {
                type: "mousemove",
                pageX: t.originalEvent.touches[0].pageX,
                pageY: t.originalEvent.touches[0].pageY
            }))
        }).on("touchend", function(t) {
            t.preventDefault(), $(this).trigger($.extend(t, {
                type: "mouseup"
            }))
        })
    }
    var S = null;
    this.setRange = function(e) {
        (null === S || e !== this.range) && (this.range = e, S = n(e[0] - e[1]), this.value > e[1] || this.value < e[0] ? this.setValue(this.value) : (k = this.positionByValue(this.value), this.draw()), "undefined" == typeof m && this.fireEvent("setRange", e)), c.dragObject = 0 >= S ? void 0 : this
    }, this.checkHidden = function() {
        this.value >= g[1] && b ? (b = !1, this.setRange([g[0], g[1] + m]), h.style.visibility = "visible", h.style.clip = "ltr" === ikariam.model.languageDirection ? "rect(0px auto auto " + o((1 - m / S) * C + x[3] + c.offsetWidth / 2) + "px)" : "rect(0px " + o(m / S * C + x[3] + c.offsetWidth / 2) + "px auto 0px)") : this.value < g[1] && !b && (b = !0, this.setRange(g), h.style.visibility = "hidden")
    }, "ltr" === ikariam.model.languageDirection ? (this.valueByPosition = function(e) {
        return 0 < S ? o((e[0] - x[3]) / (C / S)) + s(this.range[0], this.range[1]) : this.range[0]
    }, this.positionByValue = function(e) {
        var t = [];
        return 0 < S ? (t[0] = o((e - s(this.range[0], this.range[1])) * (C / S) + x[3]), t[1] = x[0]) : (t[0] = x[3], t[1] = x[0]), t
    }) : (this.valueByPosition = function(e) {
        return 0 < S ? -1 * o((e[0] - x[3]) / (C / S)) + r(this.range[0], this.range[1]) : this.range[1]
    }, this.positionByValue = function(e) {
        var t = [];
        return 0 < S ? (t[0] = o(-1 * (e - s(this.range[0], this.range[1]) - S) * (C / S) + x[3]), t[1] = x[0]) : (t[0] = x[3], t[1] = x[0]), t
    }), this.keepPositionBounds = function(e) {
        return e[0] = e[0] < x[3] ? x[3] : e[0] > x[1] ? x[1] : e[0], e[1] = e[1] < x[0] ? x[0] : e[1] > x[2] ? x[2] : e[1], e
    }, this.keepValueBounds = function(e) {
        return e > this.range[1] ? this.range[1] : e < this.range[0] ? this.range[0] : e
    }, this.keepHiddenValueBounds = function(e) {
        return e > g[1] + m ? g[1] + m : e < g[0] ? g[0] : e
    }, this.dragValue = function(e) {
        e = this.keepValueBounds(e), e != this.value && (this.value = e, k = this.positionByValue(e), this.draw(), this.fireEvent("change", this.value), this.fireEvent("valueChange"))
    }, this.setValue = function(e) {
        e = "undefined" == typeof m ? this.keepValueBounds(e) : this.keepHiddenValueBounds(e), e !== this.value && (this.value = e, "undefined" != typeof m && this.checkHidden(), k = this.positionByValue(e), this.draw(), this.fireEvent("change", this.value), this.fireEvent("valueChange"), this.fireEvent("slideEnd"))
    }, this.dragPosition = function(e) {
        k = this.keepPositionBounds(e), k[0] = o(o((k[0] - x[3]) / (C / S)) * (C / S) + x[3]);
        var t = this.valueByPosition(e);
        this.value != t && (this.value = t, this.fireEvent("change", this.value), this.fireEvent("valueChange")), this.draw()
    }, this.setPosition = function(e) {
        k = this.keepPositionBounds(e), k[0] = o(o((k[0] - x[3]) / (C / S)) * (C / S) + x[3]);
        var t = this.valueByPosition(e);
        this.value != t && (this.value = t, this.fireEvent("change", this.value), this.fireEvent("valueChange"), this.fireEvent("slideEnd")), "undefined" != typeof m && this.checkHidden(), this.draw()
    }, this.draw = "ltr" === ikariam.model.languageDirection ? function() {
        c.style.left = k[0] + "px", c.style.top = k[1] + "px", u.style.clip = "rect(0px " + (k[0] + c.offsetWidth / 2) + "px auto 0px)", this.container.title = +this.value
    } : function() {
        c.style.left = k[0] + "px", c.style.top = k[1] + "px", u.style.clip = "rect(0px " + (c.offsetWidth / 2 + x[1]) + "px auto " + (c.offsetWidth / 2 + k[0]) + "px)", this.container.title = +this.value
    }, "undefined" == typeof m ? this.setRange(this.range) : this.checkHidden(), this.inputs = {
        number: this.setValue,
        range: this.setRange
    }
}
Slider = $.extend(Slider, EventProvider);

function valueInput(e, t, o) {
    var n = Number.isInteger,
        r = this;
    return this.input = $("#" + e)[0], n(t[0]) || console.warn("valueInput min range is not a number"), n(t[1]) || console.warn("valueInput max range is not a number"), this.range = t, void 0 === this.input ? void console.log("ERROR: could not create slider! the requested element " + e + " was not found in DOM! what have you done? :(") : void("undefined" == typeof o ? this.value = parseFloat(this.input.value, 10) : (this.value = o, this.input.value = o, $(this.input).triggerHandler("updateValue")), this.createEvent("change"), this.createEvent("setRange"), this.createEvent("maxLimit"), this.createEvent("minLimit"), this.createEvent("invalid"), this.onInput = function() {
        r.checkValue(r.input.value)
    }, $(this.input).on("keyup click blur valueInput", this.onInput), this.setValue = function(e) {
        this.checkValue(e)
    }, this.setRange = function(e) {
        e !== this.range && (this.range = e, this.keepRange(this.value, e), this.fireEvent("setRange", e))
    }, this.removeEvents = function() {
        $(this.input).off("keyup", this.onInput).off("click", this.onInput).off("blur", this.onInput)
    }, this.keepRange = function(e, t) {
        return e > t[1] ? (e = t[1], this.input.value = e, this.fireEvent("maxLimit")) : e < t[0] && (e = t[0], this.input.value = e, this.fireEvent("minLimit")), e
    }, this.checkValue = function(e) {
        if (e = parseFloat(e, 10), $.isNumeric(e)) {
            try {
                e = this.keepRange(e, this.range)
            } catch (e) {}
            e != this.value && (this.input.value = e, this.value = e, this.fireEvent("change", this.value))
        } else this.fireEvent("invalid");
        $(this.input).triggerHandler("updateValue")
    }, this.inputs = {
        number: this.setValue,
        range: this.setRange
    })
}
valueInput = $.extend(valueInput, EventProvider); //UIManager is supposed to connect Interface modules that yield variables with compatible types
function UIManager() { //currently only works with inputs and events of type 'number'.
    this.connect = function(e, t) {
        e.subscribe("change", t.inputs.number, t, !0), t.subscribe("change", e.inputs.number, e, !0), e.subscribe("setRange", t.inputs.range, t, !0), t.subscribe("setRange", e.inputs.range, e, !0)
    }
}
var uiManager = new UIManager;

function delete_slider(e) {
    var t = ikariam.controller.sliders[e];
    if (t !== void 0)
        for (var o = ikariam.controller.sliders.length, n = 0; n < o; n++) {
            ikariam.controller.sliders[n] === t && ikariam.controller.sliders.splice(n, 1), valueInputs[e].removeEvents(), valueInputs[e] = null;
            break
        }
}

function create_slider(e) {
    var t = Math.min;
    void 0 === ikariam.controller.sliders[e.id] || void 0 !== e.reset && e.reset || (e.iniValue = t(ikariam.controller.sliders[e.id].value, e.maxValue));
    var o = [0, e.maxValue + e.overcharge],
        n = {};
    e.textfield && (valueInputs[e.id] = new valueInput(e.textfield, o, e.iniValue), n.from = valueInputs[e.id]), e.overcharge && (n.hiddenValues = e.overcharge, n.hiddenValueEl = e.bg_overcharge), n.valueEl = e.bg_value, n.dir = e.dir;
    var r = new Slider(e.thumb, n);
    return r.adjustSliderRange = function(e) {
        this.setRange([0, e])
    }, r.sliderName = e.id, r.setActualValue = r.setValue, r.actualValue = r.value, r.maxValue = r.range[1], r.subscribe("change", function() {
        this.actualValue = this.value
    }, r, !0), ikariam.controller.sliders[e.id] = r, uiManager.connect(ikariam.controller.sliders[e.id], valueInputs[e.id]), void 0 !== e.callbackData && r.subscribe("valueChange", function() {
        ikariam.controller.actionMonitor[e.callbackData.func](e.callbackData)
    }), void 0 !== e.callbackDataEnd && r.subscribe("slideEnd", function() {
        ikariam.controller.actionMonitor[e.callbackDataEnd.func](e.callbackDataEnd)
    }), r
}

function create_ranged_slider(e) {
    $(document).ready(function() {
        var t = [e.minValue, e.maxValue + e.overcharge],
            o = {};
        if (e.textfield) {
            var n = new valueInput(e.textfield, t, e.iniValue);
            o.from = n
        }
        e.overcharge && (o.hiddenValues = e.overcharge, o.hiddenValueEl = e.bg_overcharge), o.valueEl = e.bg_value, o.dir = e.dir;
        var r = new Slider(e.thumb, o);
        r.adjustSliderRange = function(e) {
            this.setRange([0, e])
        }, r.setActualValue = r.setValue, r.actualValue = r.value, r.minValue = r.range[0], r.maxValue = r.range[1], r.subscribe("change", function() {
            this.actualValue = this.value
        }, r, !0), uiManager.connect(r, n), ikariam.controller.sliders[e.id] = r
    })
}

function resourceStack(e) {
    var t = Math.floor,
        o = Math.round,
        n = Math.ceil,
        r = $("#" + e.container),
        s = $("#" + e.resourceicon);
    if (1 > r.length) return !1;
    1 > s.length && (s = $("<img>", {
        id: e.resourceicon,
        height: e.icon_height,
        width: e.icon_width,
        src: e.icon_src
    }).appendTo(r)), s.detach(), r.children().remove(), "undefined" == typeof e.value && (e.value = 0), "undefined" == typeof e.width && (e.width = r.css("width"));
    var l = e.width,
        d = [],
        c = function t() {
            var o = s.clone();
            return o.removeAttr("id").css("display", "none").appendTo(r), d.push(o), o
        },
        u = function t() {
            var o = d[d.length - 1];
            return o.detach(), d.pop(), o
        };
    return this.setIcons = function(e) {
        if (e === d.length) return !0; // no change required
        // dont try to draw too many icons
        for (e > (l - s.width() - 1) / 2 && (e = (l - s.width() - 1) / 2); d.length > e;) u(); //If too many, cut till fit 
        for (var r = 0; r < e; r++) {
            d.length - 1 < r && c();
            var p = 0,
                m = s.width() * e - l;
            if (0 >= m) p = 0;
            else if (p = m / (e - 1), 0 != p % 1) {
                var g = (e - 1) / o(p % 1 * (e - 1));
                p = 0 === t((r - 1) % g) ? n(p) : t(p)
            }
            0 < r && d[r].css("margin-" + ikariam.model.sideAttr, -p + "px"), d[r].css("display", "inline")
        }
    }, !0
}

function disableEnterKey(t) {
    var e = isIE ? w.event.keyCode : t.which;
    return 13 != e
}

function removeListener(e, t, o) {
    e.removeEventListener ? e.removeEventListener(t, o, !1) : e.detachEvent && (e.detachEvent("on" + t, e[t + o]), e[t + o] = null, e["e" + t + o] = null)
}

function dezInt(e, t, o) {
    var n = Math.abs;
    o = o ? o : "0";
    var r = 0 > e ? "-" : "",
        s = "0" == o ? r : "";
    e = n(parseInt(e, 10)), t -= ("" + e).length;
    for (var l = 1; l <= t; l++) s += "" + o;
    return s += ("0" == o ? "" : r) + e, s
}

function convertStylePx(e) {
    if (e) return e = e.replace("px", ""), isNaN(e) ? 0 : parseInt(e)
}

function getWidth(e) {
    var t;
    return t = e.currentStyle ? e.currentStyle : w.getComputedStyle ? doc.defaultView.getComputedStyle(e, null) : e.style, e.offsetWidth - convertStylePx(t.marginLeft) - convertStylePx(t.marginRight) - convertStylePx(t.borderLeftWidth) - convertStylePx(t.borderRightWidth)
}

function getHeight(e) {
    var t;
    return t = e.currentStyle ? e.currentStyle : w.getComputedStyle ? doc.defaultView.getComputedStyle(e, null) : e.style, e.offsetHeight - convertStylePx(t.marginTop) - convertStylePx(t.marginBottom) - convertStylePx(t.borderTopWidth) - convertStylePx(t.borderBottomWidth)
}

function shortenText(e, t) {
    if ("undefined" == t) return e;
    for (var o = e, n = getWidthFromText("..."), r = t - 30, s = r - getWidthFromText(o) - n, l = !1; 0 > s;) o = o.substr(0, o.length - 1), s = r - getWidthFromText(o) - n, l = !0;
    return l ? o + "..." : e
}

function getWidthFromText(e) {
    var t = doc.createElement("div");
    t.innerHTML = e, t.style.whiteSpace = "nowrap", t.style.position = "absolute", t.style.top = "-100px", doc.body.appendChild(t);
    var o = t.scrollWidth;
    return doc.body.removeChild(t), o
}
Array.prototype.contains = function(e) {
    for (var t = this.length; t--;)
        if (this[t] === e) return !0;
    return !1
}, Array.prototype.forEach || (Array.prototype.forEach = function(e, t) {
    var o, n;
    if (null == this) throw new TypeError(" this is null or not defined");
    var r = Object(this),
        s = r.length >>> 0;
    if ("[object Function]" != {}.toString.call(e)) throw new TypeError(e + " is not a function");
    for (t && (o = t), n = 0; n < s;) {
        var l;
        n in r && (l = r[n], e.call(o, l, n, r)), n++
    }
});

function exec(e, t) {
    return "function" == typeof ikariam.controller.actionMonitor[e] ? ikariam.controller.actionMonitor[e](t) : void console.log("ERROR: execute " + e + " failed: function was not found!")
}

function strLen(e) {
    var t = e.replace(/(\r\n)|(\n\r)|\r|\n/g, "\n");
    return t.length
}

function getRandomNumberBetween(e, t) {
    return Math.floor(Math.random() * (t - e + 1)) + e
}

function setCookie(e, t, o, n, r, s) {
    var l = new Date;
    l.setTime(l.getTime()), o && (o = 24 * (60 * (60 * (1e3 * o))));
    var d = new Date(l.getTime() + o);
    doc.cookie = e + "=" + escape(t) + (o ? ";expires=" + d.toGMTString() : "") + (n ? ";path=" + n : "") + (r ? ";domain=" + r : "") + (s ? ";secure" : "")
}

function getCookie(e, t) {
    for (var o = doc.cookie.split(";"), n = "", r = "", s = "", l = !1, d = 0; d < o.length; d++) {
        if (n = o[d].split("="), r = n[0].replace(/^\s+|\s+$/g, ""), r == e) {
            return l = !0, 1 < n.length && (s = unescape(n[1].replace(/^\s+|\s+$/g, ""))), s;
            break
        }
        n = null, r = ""
    }
    if (!l) return t
}

function ajaxSendUrl(e) {
    $.ajax({
        type: "POST",
        url: e,
        error: function o(e, t) {}
    })
}

function ajaxHandlerCall(e, t, o, n) {
    if (e === window.document.location.href && !(e.indexOf("view=city") || e.indexOf("view=island") || e.indexOf("view=worldmap_iso")) || e === "http://" + window.document.location.hostname + "/" || e === "https://" + window.document.location.hostname + "/" || "" == e || "javascript:void(0);" == e) return console.log("do nothing"), !1;
    if ("dragHandle" === ikariam.controller.action) return !1;
    if (null !== ikariam.controller.clickTarget && ($(ikariam.controller.clickTarget).hasClass("button_disabled") || $(ikariam.controller.clickTarget).hasClass("disabled"))) return !1;
    $("#loadingPreview").css("display", "block"), -1 === e.indexOf("action=") && (ikariam.controller.backLink = e);
    var r = splitUrlQueryString(e);
    return e = ikariam.model.formatViewParameters(r), ikariam.model.checkReload(r) ? window.document.location.href = e : ikariam.controller.executeAjaxRequest(e + "&ajax=1", t, o, n), !1
}

function updateActionRequest(e) {
    return e.href = e.href + "&actionRequest=" + ikariam.getModel().actionRequest, !0
}

function splitUrlQueryString(e) {
    var t = {};
    return e.split("?").pop().split("&").forEach(function(e) {
        var o = e.split("=");
        t[o.shift()] = o.shift()
    }), t
}

function createUrlQueryString(e) {
    for (var t in result = "", e) result += "" == result ? "?" : "&", result += t + "=" + e[t];
    return result
}

function ajaxRequest(e, t, o, n) {
    return ikariam.getController().executeAjaxRequest(e, t, o, n), !1
}

function ajaxHandlerCallFromForm(e) {
    function t(e, t) {
        o += (0 < o.length ? "&" : "") + escape(e).replace(/\+/g, "%2B") + "=" + encodeURIComponent(t ? t : "")
    }
    for (var o = "", n = "", r = e.elements, s = 0; s < r.length; s++) {
        var l = r[s],
            d = l.type.toUpperCase(),
            c = l.name;
        if (c)
            if ("TEXT" == d || "NUMBER" == d || "TEXTAREA" == d || "PASSWORD" == d || "BUTTON" == d || "RESET" == d || "SUBMIT" == d || "FILE" == d || "IMAGE" == d || "HIDDEN" == d) t(c, l.value);
            else if ("CHECKBOX" == d && l.checked) t(c, l.value ? l.value : "On");
        else if ("RADIO" == d && l.checked) t(c, l.value);
        else if (-1 != d.indexOf("SELECT"))
            for (var u = 0, p; u < l.options.length; u++) p = l.options[u], p.selected && t(c, p.value ? p.value : p.text)
    }
    var m = ikariam.model.formatViewParameters(splitUrlQueryString("index.php?" + o));
    return m = m.substr(1), ikariam.getController().executeAjaxRequest("index.php", null, m + "&ajax=1", !0), !1
}

function forceNewViewParameters(e) { // append current action request
    var t = doc.createElement("input");
    t.setAttribute("type", "hidden"), t.setAttribute("name", "actionRequest"), t.setAttribute("value", ikariam.getModel().actionRequest), e.appendChild(t)
}

function switchTab(e) {
    ikariam.controller.switchTab(e)
}

function switchPage(e, t, o) {
    var n = [];
    n[0] = "" + (e * o + 0), n[1] = "" + (e * o + 1), n[2] = "" + (e * o + 2), n[3] = "" + (e * o + 3);
    var r = 0;
    $(t).parent().find("li.tab").each(function() {
        var t = $(this);
        r++, t.hasClass("tabNextPage") ? t.attr("onclick", "switchPage(" + (e + 1) + ", this, " + o + ")") : t.hasClass("tabPrevPage") ? t.attr("onclick", "switchPage(" + (e - 1) + ", this, " + o + ")") : -1 == $.inArray(t.attr("index"), n) ? t.addClass("invisible") : t.removeClass("invisible")
    });
    var s = Math.floor((r - 1) / o);
    $(t).parent().find("li.tab").each(function() {
        var t = $(this);
        t.hasClass("tabNextPage") ? e != s && 0 != s ? t.removeClass("invisible") : t.addClass("invisible") : t.hasClass("tabPrevPage") && (0 != e && 0 != s ? t.removeClass("invisible") : t.addClass("invisible"))
    })
}

function toggleButton(e, t) {
    t ? $("#" + e).attr("disabled", !1).removeClass("button_disabled") : $("#" + e).attr("disabled", !0).addClass("button_disabled")
}

function toggleClass(e, t, o) {
    var n = $("#" + e).toggleClass(t); // box height might have changed...
    return void 0 !== o && o || ikariam.controller.adjustSizes(), !0
}

function toggleElement(e, t) {
    return toggleClass(e, "invisible", t)
}

function toggleArrow(e) {
    e.className = "open" == e.className ? "close" : "close" == e.className ? "open" : "gopen" == e.className ? "gclose" : "gopen"
}

function toggleSpoilerText(e) {
    $(e).children(".spoilertext").hasClass("invisible") ? ($(e).children(".spoilerwarning").addClass("invisible"), $(e).children(".spoilertext").removeClass("invisible")) : ($(e).children(".spoilerwarning").removeClass("invisible"), $(e).children(".spoilertext").addClass("invisible")), ikariam.getController().adjustSizes()
}

function markAsRead(e, t, o) {
    var n = "entry ";
    t || (t = "markReportAsRead", n = "entry");
    var r = "?action=" + o + "&function=" + t + "&id=" + e;
    ajaxSendUrl(r), "markGlobalMessageAsRead" == t ? $("#gmessage" + e)[0].className = n : $("#message" + e)[0].className = n, "markMessageAsRead" == t && $("input[name=\"deleteId\\[" + e + "\\]\"]").val("read")
}

function markAll(e, t) {
    for (var o = $("#" + t).find("input"), n = 0; n < o.length; n++) "checkbox" == o[n].getAttribute("type") && ("checked" === e ? o[n].checked = !0 : "all" === e ? o[n].checked = !0 : "reverse" === e ? o[n].checked = !o[n].checked : "unread" === e ? o[n].checked = "unread" == o[n].value : "read" === e ? o[n].checked = "read" == o[n].value : "none" === e ? o[n].checked = !1 : void 0)
}

function createEl(e, t, o, n, r, s, l) {
    var d = doc.createElement(e);
    if (void 0 !== t && null !== t && (d.id = t), void 0 !== o && null !== o && "" !== o && $(d).addClass(o), void 0 === r || null === r || "script" == e && isIE && isIE8 || (d.innerHTML = r), void 0 !== n && null !== n && "" !== n && d.setAttribute("style", n), void 0 !== l && null !== l && l.appendChild(d), void 0 !== s && null !== s)
        for (var c in s) void 0 !== c && ("ajaxrequest" === c ? addAjaxRequest(d, s[c]) : $(d).on(c, s[c]));
    return d
}

function addAjaxRequest(t, o) {
    t.href = o, $(t).on("click", function(o) {
        return ajaxHandlerCall(t.href), o.preventDefault(), !1
    })
}

function appendHiddenField(e, t, o) {
    var n = createEl("input");
    n.type = "hidden", n.name = e, n.value = t, o.appendChild(n)
}

function createURLParameters(e, t) {
    var o = "";
    for (var n in e)
        if (t[n] === void 0) {
            var r = e[n];
            o += "&" + n + "=" + r
        } return o
}

function countAttributes(e) {
    var t = 0;
    for (var o in e) e.hasOwnProperty(o) && ++t;
    return t
}

function stripslashes(e, t) {
    return "string" == typeof e ? (e = e.replace(/\\'/g, "'"), e = e.replace(/\\"/g, "\""), t || (e = e.replace(/\\0/g, "\0")), e = e.replace(/\\\\/g, "\\"), e = e.replace(/\\n/g, "\n"), e) : e
}

function getIEVersion() {
    var e = -1; // assume failure ... 
    if (isIE) {
        var t = /MSIE ([0-9]{1,}[.0-9]{0,})/;
        null != t.exec(navigator.userAgent) && (e = parseFloat(RegExp.$1))
    }
    return e
}

function valid_num(t, o) {
    var e;
    if (w.event) e = w.event.keyCode;
    else if (o) e = o.which;
    else return !0;
    return 47 < e && 58 > e || 44 == e || 46 == e || 8 == e
}

function getOffsetHeightOfChildren(e) {
    var t = "";
    t += e, e.id && (t = t + "#" + e.id), e.className && (t = t + "&" + e.className), t = t + "|oh|" + e.offsetHeight + "|h|" + e.height + "";
    var o = e.children;
    o.length && (t += "|**|\n");
    for (var n = 0; n < o.length; n++) t = t + "|*" + n + "|" + getOffsetHeightOfChildren(o[n]) + "\n";
    return t
} // Inspired by base2 and Prototype
(function() {
    var e = !1,
        t = /xyz/.test(function() {
            xyz
        }) ? /\b_super\b/ : /.*/; // The base Class implementation (does nothing)
    // Create a new Class that inherits from this class
    this.Class = function() {}, Class.extend = function(o) { // The dummy class constructor
        function n() {
            !e && this.init && this.init.apply(this, arguments)
        } // Populate our constructed prototype object
        var r = this.prototype; // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        e = !0;
        var s = new this; // Copy the properties over onto the new prototype
        for (var l in e = !1, o) // Check if we're overwriting an existing function
            s[l] = "function" == typeof o[l] && "function" == typeof r[l] && t.test(o[l]) ? function(e, t) {
                return function() {
                    var o = this._super; // Add a new ._super() method that is the same method
                    // but on the super-class
                    this._super = r[e]; // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var n = t.apply(this, arguments);
                    return this._super = o, n
                }
            }(l, o[l]) : o[l];
        return n.prototype = s, n.constructor = n, n.extend = arguments.callee, n
    }
})();

function fixCostsDisplay() {
    var e = $("#buildingUpgrade .resources");
    e.prop("scrollWidth") != e.width() && e.prop("scrollWidth") > e.width() - 10 && ($("#buildingUpgrade .resources li").css({
        float: "none",
        margin: "unset",
        "white-space": "nowrap"
    }), e.prop("scrollWidth") > e.width() && $("#buildingUpgrade .resources li").each(function() {
        if (!$(this).hasClass("time")) {
            var e = $(this).children(),
                t = parseInt($(this).text().replace(/[^0-9]/gi, "")).toExponential();
            $(this).text(t), $(this).prepend(e)
        }
    }));
    var t = $("#sidebar #buildingUpgrade .actions li.showLevel"),
        o = parseInt(t.text().replace(/[^0-9]/gi, ""));
    1e3 > o ? t.css("fontSize", "36px") : 1e4 > o ? t.css("fontSize", "27px") : t.css("fontSize", "22px")
}
var ajax = {
    Responder: {
        responseArray: [],
        styles: [],
        init: function t(e) {
            return this.parseResponse(e), this
        },
        parseResponse: function o(t) {
            try {
                this.responseArray = t instanceof Array ? t : JSON.parse(t);
                for (var n = this.responseArray.length, r = 0, e; r < n; r++) {
                    e = this.responseArray[r][0];
                    try {
                        if ("custom" == e) var s = this[this.responseArray[r][1][0]](this.responseArray[r][1][1]);
                        else {
                            console.log("executing function " + e + " ...");
                            var s = this[e](this.responseArray[r][1])
                        }
                    } catch (t) {
                        console.log("AjaxResponder: unable to call function: " + this.responseArray[r][0] + "\n with parameters: " + this.responseArray[r][1]), console.log(t)
                    }
                }
            } catch (o) {
                console.log("Unable to parse ajax response: \n" + t)
            }
        },
        reload: function t(e) {
            var o = ikariam.model.formatViewParameters(splitUrlQueryString(e.link));
            1 === e.doNotModifyLink && (o = e.link), 1 === e.isDevHost ? (console.log("### reload required ###"), console.log("press R or 'space' to trigger it... "), $(".footerleft").html("RELOAD REQUIRED! PRESS R.").css({
                "text-align": "center",
                color: "red",
                "font-size": "16px",
                "font-weight": "bold",
                "padding-top": "9px"
            }), $("body").keydown(function(e) {
                (82 === e.which || 32 === e.which) && (window.location.href = o)
            })) : window.location.href = o
        },
        provideFeedback: function t(e) {
            console.log("ajax: provideFeedback");
            var o = e[0].location,
                n = e[0].text,
                r = e[0].type;
            $(document).ready(function() {
                BubbleTips.bindBubbleTip(o, r, n)
            })
        },
        questData: function t(e) {
            e && ikariam.getTutorial() && (console.log(e), ikariam.getTutorial().updateQuestData(e), ikariam.getTutorial().updateDisplay())
        },
        popupData: function t(e) {
            e && (e.action == null && (e.action = ""), ikariam.getPopupController().createPopup("backendPopupRequest", e.header, [e.body, e.action, e.buttontext], e.type, e.cssClass))
        },
        ingameCounterData: function t(e) {
            e && ikariam.IngameCounter.init(e)
        },
        removeIngameCounterData: function t(e) {
            e && $(e.counter).remove()
        },
        achievementPopupData: function t(e) { // alert(params.toString());
        },
        updateGlobalData: function t(e) {
            console.log("ajax: UPDATE GLOBAL DATA with params:"); // console.log(params);
            var o = ikariam.getModel(),
                n = ikariam.getScreen(),
                r = ikariam.getController();
            for (var s in e)
                if ("actionRequest" == s) o.actionRequest = e[s];
                else if ("time" == s) o.requestTime = e[s];
            else if ("ingameAd" == s) o.ingameAd = e[s];
            else if ("animationsActive" == s) o.animationsActive != e[s] && (o.animationsActive = e[s], n.updateAnimations());
            else if ("buildingNamesActive" == s) o.buildingNamesActive != e[s] && (o.buildingNamesActive = e[s], "city" == ikariam.backgroundView.id && n.updateBuildingNames());
            else if ("friends" === s) ikariam.backgroundView.updateFriendsList(e[s]);
            else if ("newState" == s) {
                var l = e[s] ? 1 : 0;
                "city" === ikariam.backgroundView.id && l !== n.constructionListState && n.toggleConstructionList()
            } else if ("viewparameters" == s) o.viewParams = JSON.parse(e[s]);
            else if ("storeSliders" == s) o.resetSliders = 0 === e[s], o.resetSliders && r.resetSliders();
            else if ("headerData" == s) o.updateGlobalData(e[s]);
            else if ("backgroundData" == s) n.update(e[s]), ikariam.backgroundView.updateCurrentCityLeftMenu(e[s].cityLeftMenu, e[s]);
            else if ("updateGlobalDataOnly" == s) ikariam.controller.update();
            else if ("load_css" == s) this.loadTemplateCSS(e[s].files);
            else if ("chatNewMessage" == s) e[s] && $("#js_viewChat").children().first().addClass("activated");
            else if ("abyssalAmbushMonsterHitPoints" == s) {
                var d = e[s].hitPoints,
                    c = e[s].stageHitPoints,
                    u = e[s].stageHitPointsLabel,
                    p = Math.round(100 * (d / c));
                $(".hitpoints_progress").css("width", p + "%"), $(".hitpoints_text").html("".concat(d, " / ").concat(u))
            } else if ("nextETA" == s) // Countdown auf dem Browsertab updaten
            {
                var m = e[s];
                o.nextETA != m && o.updateTitleCounter(m)
            } else "emailReminderPopup" == s ? ($("#emailValidationReminderButton")[0].onclick = null, e[s].display ? ($("#emailValidationReminderButton").show(), ikariam.controller.actionMonitor.addAction($("#emailValidationReminderButton")[0], "click", "createPopup", ["emailValidationPopup", e[s].parameters[0], e[s].parameters[1], "/index.php?view=optionsAccount&activeTab=tab_optionsAccount", e[s].parameters[2], e[s].parameters[3]])) : ($("#emailValidationReminderButton").hide(), $("#emailValidationReminderButton")[0].onclick = "", ikariam.controller.actionMonitor.removeAction($("#emailValidationReminderButton")[0]))) : "itemAdded" == s && (e[s] ? ikariam.controller.messageMonitor.onItemBought() : $(this).removeClass("itemAdded").off("click.itemAdded"));
            e.activeTab !== void 0 && e.scrollPos !== void 0 && e.wasMinimized !== void 0 && o.updateTemplateData({
                activeTab: e.activeTab,
                scrollPos: e.scrollPos,
                wasMinimized: e.wasMinimized
            })
        },
        updateTemplateData: function o(t) {
            for (var n in null === ikariam.templateView || null === ikariam.templateView.id ? (ikariam.controller.update(), console.log("ajax: UPDATE TEMPLATE DATA for template null with dataset:")) : console.log("ajax: UPDATE TEMPLATE DATA for template " + ikariam.templateView.id + " with dataset:"), console.log(t), t)
                if (t.hasOwnProperty(n))
                    if ("load_js" === n) {
                        if (t[n] instanceof Array)
                            for (var r = 0, e; r < t[n].length; r++) {
                                if (e = null, void 0 !== t[n][r].params && null !== t[n][r].params) try {
                                    e = JSON.parse(t[n][r].params)
                                } catch (o) {
                                    console.log("params for script " + t[n][r].filepath + " cannot be parsed to valid json. script will be loaded without any params!")
                                }
                                ikariam.templateView.loadTemplateScript(t[n][r].filepath, e)
                            } else {
                                var e = null;
                                if (void 0 !== t[n].params && null !== t[n].params) try {
                                    e = JSON.parse(t[n].params)
                                } catch (o) {
                                    console.log("params for script " + t[n].filepath + " cannot be parsed to valid json. script will be loaded without any params!")
                                }
                                ikariam.templateView.loadTemplateScript(t[n].filepath, e)
                            }
                    } else if ("new_js_params" == n) {
                try {
                    e = JSON.parse(t[n])
                } catch (t) {
                    console.log("params for lazy loaded script cannot be parsed to valid json.")
                }
                ikariam.templateView.script.params = e, void 0 !== ikariam.templateView.mainbox.onDataReplacement && ikariam.templateView.mainbox.onDataReplacement()
            } else if ("load_css" == n) {
                if (void 0 !== t[n].files && null !== t[n].files)
                    for (r = 0; r < t[n].files.length; r++) ikariam.templateView.loadTemplateCSS(t[n].files[r]);
            } else if ("initConstructionList" == n) ikariam.getScreen().initConstructionList();
            else if ("updateFriendsList" == n) {
                var s = t[n];
                ikariam.getBackgroundView().updateFriendsList(s)
            } else if ("stopConstructionListTimer" == n) ikariam.getScreen().stopConstructionListTimer();
            else if ("destroySidebars" == n) ikariam.getScreen().constructionListState = 0, ikariam.templateView.destroySidebars();
            else if ("function" == n) {
                var l = t[n];
                if (l instanceof Object) // value is not a primitive data type - we have a look at its sub keys.
                    for (var d in l) var c = this[d](l[d])
            } else {
                if ("location" == n) return void(window.location = t[n]);
                var u = $("#" + n);
                if (1 > u.length) continue;
                var p = t[n];
                if (p instanceof Object) {
                    for (var m in p)
                        if (p.hasOwnProperty(m)) {
                            var g = p[m];
                            switch (m) {
                                case "text":
                                    u.html(stripslashes(g, !0));
                                    break;
                                case "plainInnerHTML":
                                    u.html(g);
                                    break;
                                case "value":
                                    u.val(stripslashes(g, !0));
                                    break;
                                case "append":
                                    u.append(stripslashes(g, !0));
                                    break;
                                case "class":
                                    u.attr("class", g);
                                    break;
                                case "removeClass":
                                    u.removeClass(g);
                                    break;
                                case "remove":
                                    u.fadeOut(2e3);
                                    break;
                                case "addClass":
                                    u.addClass(g);
                                    break;
                                case "toggleClass":
                                    u.toggleClass(g);
                                    break;
                                case "title":
                                    u.attr("title", g);
                                    break;
                                case "tooltip":
                                    u.append("<div class=\"tooltip\">" + g + "</div>");
                                    break;
                                case "alt":
                                    u.attr("alt", g);
                                    break;
                                case "href":
                                    u.attr("href", g);
                                    break;
                                case "src":
                                    u.attr("src", g);
                                    break;
                                case "width":
                                    u.attr("width", g);
                                    break;
                                case "height":
                                    u.attr("height", g);
                                    break;
                                case "attribute":
                                    for (var h in g) u.attr(h, g[h]);
                                    break;
                                case "clearAttribute":
                                    u.removeAttr(g);
                                    break;
                                case "style":
                                    u.css(g);
                                    break;
                                case "appendElement":
                                    if (void 0 !== g.tag) createEl(g.tag, null, // do not set id via php (too dangerous. @TODO: if required, check if id already exists in DOM
                                        g["class"], g.style, g.text, null, u[0]);
                                    else // contains more than one elements to append
                                        for (var b = g.length, v = 0; v < b; v++) createEl(g[v].tag, null, g[v]["class"], g[v].style, g[v].text, null, u[0]);
                                    break;
                                case "ajaxrequest":
                                    u.attr("href", g), "" == g ? ikariam.controller.actionMonitor.removeAction(u[0], "click", "ajaxHandlerCall") : ikariam.controller.actionMonitor.addAction(u[0], "click", "ajaxHandlerCall", g);
                                    break;
                                case "action":
                                    "" == g ? ikariam.controller.actionMonitor.removeAction(u[0]) : ikariam.controller.actionMonitor.addAction(u[0], g.event, g.func, g.params);
                                    break;
                                case "slider":
                                    if (console.log(ikariam.controller.sliders), g["delete"]) delete_slider(g.id);
                                    else if (void 0 !== ikariam.controller.sliders[g.id]) ikariam.controller.sliders[g.id].setActualValue(g.ini_value), ikariam.controller.sliders[g.id].maxValue = g.max_value, void 0 !== g.ranged && g.ranged && (ikariam.controller.sliders[g.id].minValue = g.minValue);
                                    else {
                                        var x = {
                                            id: g.id,
                                            dir: ikariam.model.languageDirection,
                                            maxValue: g.max_value,
                                            overcharge: g.overcharge,
                                            iniValue: g.ini_value,
                                            bg: g.bg,
                                            thumb: g.thumb,
                                            topConstraint: g.top_constraint,
                                            bottomConstraint: g.bottom_constraint,
                                            bg_value: g.bg_value,
                                            bg_overcharge: g.bg_overcharge,
                                            textfield: g.textfield,
                                            callbackData: g.callback_data,
                                            callbackDataEnd: g.callback_data_end
                                        };
                                        if (void 0 !== g.ranged && g.ranged) var C = create_ranged_slider($.extend(x, {
                                            minValue: g.min_value
                                        }));
                                        else var C = create_slider(x);
                                        void 0 !== g.control_data && null !== g.control_data && (C.controlData = JSON.parse(g.control_data))
                                    }
                                    break;
                                case "countdown":
                                    var y = 2;
                                    void 0 !== g.digits && (y = g.digits);
                                    var _ = !1;
                                    void 0 !== g.minaccuracy && (_ = g.minaccuracy);
                                    var k = getCountdown({
                                        enddate: g.enddate,
                                        currentdate: g.currentdate,
                                        el: u.attr("id"),
                                        timeoutLink: g.timeout_link,
                                        timeoutAjaxRequest: g.timeout_ajaxrequest,
                                        timeoutAction: g.timeout_action
                                    }, y, " ", "", !0, !0, _);
                                    break;
                                case "offerOptionBox":
                                    var T = getOfferOptionBox(u.attr("id"), g);
                                    break;
                                case "progressbar":
                                    var S = void 0 === g.counter_id ? u.attr("id") : g.counter_id,
                                        P = void 0 === g.depth ? 2 : g.depth,
                                        R = void 0 === g.zerofill || g.zerofill;
                                    getCountdown({
                                        enddate: g.enddate,
                                        currentdate: g.currentdate,
                                        timeoutLink: g.timeout_link,
                                        timeoutAjaxRequest: g.timeout_ajaxrequest,
                                        timeoutAction: g.timeout_action,
                                        el: S
                                    }, P, " ", "", !0, R);
                                    var M = getProgressBar({
                                        startdate: g.startdate,
                                        enddate: g.enddate,
                                        currentdate: g.currentdate,
                                        bar: u.attr("id")
                                    });
                                    $(M).on("update", function() {
                                        this.el.attr("title", this.progress + "%")
                                    }).on("finished", function() {
                                        this.el.title = "100%"
                                    });
                                    break;
                                case "buttonState":
                                    "enabled" === g ? (u.css("display", ""), u.removeClass("button_disabled"), u.attr("disabled", !1)) : "disabled" === g ? (u.css("display", ""), u.addClass("button_disabled"), u[0].onclick = "", u.attr("disabled", !0)) : "hidden" === g ? (u.css("display", "none"), u.addClass("button_disabled"), u.attr("disabled", !0)) : void 0;
                                    break;
                                case "notices":
                                    for (var E in g)
                                        if (g.hasOwnProperty(E)) var V = createEl("h5", null, "bold", null, E, null, u[0]),
                                            D = createEl("p", null, null, null, g[E], null, u[0]); // box size can have changed!
                                    null !== ikariam.templateView && null !== ikariam.templateView.mainbox && ikariam.templateView.mainbox.adjustSize();
                                    break;
                                case "timeout":
                                    getTimeout({
                                        element: u,
                                        name: g.name,
                                        time: g.time,
                                        className: g.className
                                    });
                                    break;
                                case "data":
                                    u.attr("data-" + g.name, g.value)
                            }
                        }
                } else u.html(stripslashes(p, !0))
            } // when ready: force a controller update (style dropdown menus, create tooltip objects, recalculate scrollbars etc.)
            ikariam.controller.update()
        },
        updateViewScriptData: function t(e) {
            console.log("ajax: CALL VIEW SCRIPT UPDATE with dataset:"), null != ikariam.templateView && ikariam.templateView.triggerViewScriptUpdate(e)
        },
        updateBacklink: function t(e) {
            console.log("UPDATE backlink with: "), null === e ? $("#js_backlinkButton").off("click").addClass("invisible").attr("title", "") : $("#js_backlinkButton").off("click").on("click", function() {
                ajaxHandlerCall(e.link)
            }).removeClass("invisible").attr("title", e.title)
        },
        updateBackgroundData: function t(e) {
            var o = ikariam.getScreen();
            null !== o && o.update(e)
        },
        closeView: function t(e) {
            console.log("ajax: closeView id=" + e), $("#popupMessage").html("");
            null === ikariam.templateView || ikariam.destroyCurrentView()
        },
        changeView: function t(e) {
            console.log("ajax: changeView with id=" + e[0]), ikariam.getController().tooltipController.cleanupInfoTips(), this.changeHTML(e, !0)
        },
        addWindow: function t(e) {
            this.changeHTML(e, !1)
        },
        changeHTML: function o(e, t) {
            var n = e[0];
            switch (n) {
                case "debugOutput":
                    var r = $("#" + n)[0];
                    return void(r.innerHTML = e[1]);
                case "avatarNotes":
                    return void ikariam.getPopupController().updateNoteLayer(e[1]);
                case "chatWindow":
                    return void ikariam.getPopupController().updateChatLayer(e[1])
            }
            var s = createEl("div", null, null, null, e[1]);
            if (!t) var l = this.createView(n, s.children[0], null, t, e[2]);
            else {
                if (s.hasChildNodes()) {
                    for (var d = s.childNodes, c = d.length, u = -1, p = 0; p < c; p++)
                        if ("mainview" === d[p].id) {
                            u = p;
                            break
                        } var m = $(s).find("div.dynamic"),
                        l = this.createView(n, 0 <= u ? d[p] : null, m, t, "", e[2])
                }
                this.evalScript(e[1])
            }
        },
        createView: function l(e, t, o, n, r, s) { // get box header from buildingDescription element
            var d = $(t).find("div.buildingDescription");
            d = 0 < d.length ? d.first().find("h1").html() : "";
            var c = null,
                u = !1,
                p = !1,
                m = !1; // case missions: do not replace sidebars!
            if (null !== t) { //der kram hier funktioniert nicht und hat auch nie richtig funktioniert!
                //Da er auch Dinge kaputt macht (backbutton) raus damit
                //var isMission = (mainContentElem === null || mainContentElem.children.length > 0 && (mainContentElem.children[0].id === 'mission' && ikariam.backgroundView.id === 'island'));
                var g = !1;
                c = t.innerHTML, $(t).hasClass("size820") && (u = !0), $(t).hasClass("size420") && (p = !0), $(t).hasClass("sizeZShop") && (m = !0)
            }
            var h = {
                boxId: e,
                headerElem: d,
                contentElem: c,
                sidebarEls: o,
                oversized: u,
                replaceBox: n,
                keepSidebars: g,
                type: r,
                minisized: p,
                zShopSized: m,
                viewScriptUrl: "",
                viewScriptParams: ""
            };
            return null != s && (h.viewScriptUrl = s.viewScriptUrl || "", h.viewScriptParams = s.viewScriptParams || "", h.scrollToElement = s.scrollToElement || ""), ikariam.createTemplateView(h)
        },
        evalScript: function t(e) {
            try {
                if ("" != e) {
                    var o = "";
                    e = e.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function() {
                        return null !== e && (o += arguments[1] + "\n"), ""
                    }), o && (w.execScript ? w.execScript(o) : w.setTimeout(o, 0))
                }
                return !1
            } catch (t) {}
        },
        custom: function o(e, t) {
            w[e](t)
        }
    }
};

function MessageMonitor() {
    this.init = function() {
        var t = this;
        $(window).off("message.premium onmessage.premium").on("message.premium onmessage.premium", function(o) {
            if ("string" == typeof o.originalEvent.data) {
                var e = o.originalEvent.data.split(":");
                t.handleMessage(e)
            }
        })
    }, this.handleMessage = function(e) {
        var t = e.shift();
        this.hasOwnProperty(t) && this[t](e)
    }, this.inventory = function() {
        ikariam.destroyCurrentView(), ajaxHandlerCall("index.php?view=inventory")
    }, this.onItemBought = function() {
        $("#header").find(".inventory a").addClass("itemAdded").on("click.itemAdded", function() {
            $(this).removeClass("itemAdded").off("click.itemAdded")
        })
    }, this.openPayment = function(e) {
        0 == loginMode ? ajaxHandlerCall("view=premiumPayment&token=" + e[0]) : ajaxHandlerCall("?view=" + ikariam.backgroundView.id + "&dialog=itunesPayment&loadMobilizerJS=1&token=" + e[0])
    }, this.updateBalances = function() {
        ikariam.controller.messageMonitor.onItemBought(), ajaxHandlerCall("?view=updateGlobalData")
    }, this.currency1 = function(e) {
        var t = parseInt(e[0]),
            o = $("#js_GlobalMenu_ambrosia");
        console.log("zShopUpdate Ambrosia " + $("#headlineAmbrosia").html() + " > " + t), $("#headlineAmbrosia").html(ikariam.model.locaNumberFormat(t)), o.attr("title", ikariam.model.locaNumberFormat(t) + LocalizationStrings.ambrosia), touchVersion && o.html("Shop (" + ikariam.model.locaNumberFormat(t) + ")")
    }, this.currency2 = function(e) {
        var t = parseInt(e[0]);
        console.log("zShopUpdate Gold " + $("#headlineAmbrosia").html() + " > " + t), $("#js_GlobalMenu_gold").html(ikariam.model.shortenValue(t, 6))
    }, this.currency3 = function(e) {}
}
var ScrollFix = function t(e) { // Variables to track inputs
    var o = startTopScroll = deltaY = void 0,
        e = e || e.querySelector(e); // If there is no element, then do nothing
    e && // Handle the start of interactions
        e.addEventListener("touchstart", function(t) {
            o = t.touches[0].pageY, startTopScroll = e.scrollTop, 0 >= startTopScroll && (e.scrollTop = 1), startTopScroll + e.offsetHeight >= e.scrollHeight && (e.scrollTop = e.scrollHeight - e.offsetHeight - 1)
        }, !1)
};
if (w = window, doc = w.document, userAgent = navigator.userAgent, isIE = !!(window.ActiveXObject || "ActiveXObject" in window), isIE8 = isIE9p = isIE10 = !1, isIE) {
    var rv = getIEVersion();
    isIE9p = -1 != rv && 9 <= rv && 10 > rv, isIE10 = -1 != rv && 10 <= rv, isIE8 = -1 != rv && 8 <= rv && 9 > rv
}
isIPhone = !1, touchVersion = !1, loginMode = !1, lightVersion = !1, mapNativeScrolling = !1, hasGesture = "ongesturechange" in window; // for dev:
// lightVersion = true; touchVersion = true;
var ikariam = {
    model: null,
    controller: null,
    backgroundView: null,
    templateView: null,
    tutorial: null,
    events: {},
    scrollbarArrowsHeight: 32,
    scrollbarArrowsWidth: 16,
    borderWidth: 5,
    boxMarginBottom: 70,
    zIndexInactive: 100,
    maxTiles: 22,
    tileWidth: 240,
    tileHeight: 120,
    maxResolutionX: lightVersion ? 1920 : 4692,
    maxResolutionY: lightVersion ? 1200 : 1800,
    minResolutionX: 1024, // not 1024, because iPad requires 1000
    minResolutionY: 600,
    boxOffsetLeft: 70,
    boxOffsetTop: 197,
    boxOffsetRight: 80,
    mainbox_x: 0,
    mainbox_y: 0,
    mainbox_z: 0,
    sidebar_x: 0,
    sidebar_y: 0,
    sidebar_z: 0,
    cityParametersAlreadySet: 0,
    islandParametersAlreadySet: 0,
    worldview_scale_city: 1,
    worldview_scale_island: 1,
    worldview_scale_worldmap: 1,
    worldview_scale_min: .55,
    worldview_scale_max: 1,
    netbarActive: 0,
    worldview_scroll_left_city: 0,
    worldview_scroll_top_city: 0,
    worldview_scroll_left_island: 0,
    worldview_scroll_top_island: 0,
    timeouts: {}, //audioEl: null,
    globalResourceGoldId: 5,
    init: function t(e) {
        var o = Math.max;
        console.log("INIT IKARIAM.JS with dataSet:"); // console.log(dataSet);
        var n = this;
        isIPhone = e.isIPhone, touchVersion = e.touchVersion, lightVersion = e.lightVersion, loginMode = e.loginMode, e.netbarActive && !touchVersion && (this.netbarActive = e.netbarActive), mapNativeScrolling = e.mapNativeScrolling, this.maxResolutionX = lightVersion ? 1920 : 5240, this.maxResolutionY = lightVersion ? 1200 : 1800, this.worldview_scale_city = e.worldview_scale_city, this.worldview_scale_island = e.worldview_scale_island, this.worldview_scroll_left_city = e.worldview_scroll_left_city, this.worldview_scroll_top_city = e.worldview_scroll_top_city, this.worldview_scroll_left_island = e.worldview_scroll_left_island, this.worldview_scroll_top_island = e.worldview_scroll_top_island, 1 == e.cityParametersAlreadySet && (this.cityParametersAlreadySet = 1), 1 == e.islandParametersAlreadySet && (this.islandParametersAlreadySet = 1), this.model = n.getClass(n.Model, e), this.model.setupResourceCounters(), this.backgroundView = n.getClass(n.BackgroundView, e), this.templateView = null, this.controller = n.getClass(n.Controller, {
            id: e.backgroundView,
            feedbackMsg: e.feedbackMsg
        }), e.tutorialData && (this.tutorial = n.getClass(n.Tutorial, e.tutorialData)), e.popupData && n.getPopupController().createPopup("backendPopupRequest", e.popupData.header, [e.popupData.body, "", e.popupData.buttontext]);
        var r = new Cookie("ik_global", 7);
        if ("1" == r.get("notes") && this.getPopupController().show("avatarNotes"), this.model.hasAlly && "1" == r.get("chat") && this.getPopupController().show("chatWindow"), [] !== e.ingameCounterConfig) {
            var s = [];
            for (counterPos in e.ingameCounterConfig) s.push([counterPos, e.ingameCounterConfig[counterPos]]);
            for (counterPos in s.sort(function(e, t) {
                    return e[0] - t[0]
                }), s) "contains" !== counterPos && "forEach" !== counterPos && (this.events[counterPos] = n.getClass(n.IngameCounter, s[counterPos][1]))
        }
        this.setupHelperFunctions();
        var l = o(doc.body.offsetWidth, n.minResolutionX),
            d = o(doc.body.offsetHeight, n.minResolutionY);
        return this.mainbox_x = e.mainbox_x, this.mainbox_y = e.mainbox_y, -150 < e.mainbox_z && e.mainbox_z < d - 350 && (this.mainbox_z = e.mainbox_z), (e.sidebar_x < l - 200 && 0 < e.sidebar_x || isNaN(e.sidebar_x)) && (this.sidebar_x = e.sidebar_x), this.sidebar_y = e.sidebar_y, -150 < e.sidebar_z && e.sidebar_z < d - 350 && (this.sidebar_z = e.sidebar_z), this.addHoverEvents(), $(document).ready(function() {
            if (touchVersion) {
                $("#header").bind("touchmove", function(t) {
                    t.preventDefault(), t.stopImmediatePropagation()
                }); // use scrollfix for ios
                var e = $("#scrollcover").get(0);
                header = $("#container").get(0), new ScrollFix(e)
            }
        }), this
    },
    getClass: function o(e, t) {
        var n = Class.extend(e);
        return new n(t)
    },
    setupHelperFunctions: function e() {
        this.shortenValue = this.model.shortenValue, this.locaNumberFormat = this.model.locaNumberFormat, this.numberFormat = this.model.numberFormat, this.getServerTimeDiff = this.model.getServerTimeDiff, this.getViewparametersForm = this.model.getViewparamtersForm, this.getViewparametersURL = this.model.getViewparamtersURL, this.createPopup = this.getPopupController().createPopup, this.createMultiPopup = this.getMultiPopupController().addTab, this.show = this.getPopupController().show, this.saveCookies = this.getPopupController().saveCookies, this.closePopup = this.getPopupController().closePopup, this.getTimestring = this.model.getTimestring
    },
    getModel: function e() {
        return this.model
    },
    getController: function e() {
        return this.controller
    },
    getBackgroundView: function e() {
        return this.backgroundView
    },
    getPopupController: function e() {
        return this.controller.popupController
    },
    getMultiPopupController: function e() {
        return this.controller.popupMultiController
    },
    getMapNavigation: function e() {
        return null === this.backgroundView ? null : this.backgroundView.navigation
    },
    getScreen: function e() {
        return this.backgroundView.screen
    },
    getTutorial: function e() {
        return this.tutorial
    },
    getTemplateData: function e() {
        return null === ikariam.templateView || null === ikariam.templateView.id || null === ikariam.templateView.script ? null : ikariam.templateView.script.params
    },
    createTemplateView: function t(e) {
        return console.log("CREATE TEMPLATE VIEW with dataSet:"), void 0 !== e && (e.replaceBox ? (ikariam.closePopup(), ikariam.model.resetSliders && ikariam.controller.resetSliders(), null === this.templateView ? this.templateView = ikariam.getClass(ikariam.TemplateView, e) : this.templateView.init(e)) : ikariam.getPopupController().createPopup(e.boxId, e.headerElem, e.contentElem, e.type)), this.templateView
    },
    addHoverEvents: function e() {
        var t = this;
        touchVersion || $("#worldmap").on("mouseover", " .hoverable", function() {
            t.getScreen().toggleHover(this)
        }).on("mouseout", " .hoverable", function() {
            t.getScreen().toggleHover(this)
        })
    },
    destroyCurrentView: function e() {
        this.getController().tooltipController.cleanupInfoTips();
        var t = !(null !== this.templateView) || null !== this.templateView.sidebar && !this.templateView.keepSidebars;
        null !== this.templateView && this.templateView.destroyTemplateView(t)
    },
    destroyCurrentViewWithEscape: function e() {
        this.getController().tooltipController.cleanupInfoTips();
        var t = $(".focus");
        if (t.hasClass("templateView")) {
            var o = !(null !== this.templateView) || null !== this.templateView.sidebar && !this.templateView.keepSidebars;
            null !== this.templateView && this.templateView.destroyTemplateView(o)
        } else "avatarNotes" === t[0].id || "chatWindow" === t[0].id ? this.show(t[0].id) : "multiPopup" === t[0].id ? this.getMultiPopupController().closePopup() : this.getPopupController().closePopup(t[0].id)
    }
};
ikariam.Model = {
        gameName: "",
        serverName: "",
        avatarId: 0,
        avatarAllyId: 0,
        serverTime: 0,
        realHour: 0,
        dateTimeFormat: "",
        initialBrowserTime: 0,
        initialServerTime: 0,
        requestTime: 0,
        languageDirection: "ltr",
        hasAlly: !1,
        chatPollFrequency: 0,
        chatLineMaxlength: 0,
        notesLineMaxlength: 0,
        actionRequest: "",
        ambrosia: 0,
        gold: 0,
        freeTransporters: 0,
        maxTransporters: 0,
        freeFreighters: 0,
        maxFreighters: 0,
        ingameAd: "",
        animationsActive: !1,
        buildingNamesActive: !1,
        viewParams: null,
        sideAttr: "left",
        resetSliders: !0,
        isOwnCity: !1,
        producedTradegood: null,
        wineSpendings: 0,
        cityProducesWine: !1,
        wineTickInterval: 0,
        currentResources: [],
        maxResources: [],
        branchOfficeResources: [],
        maxActionPoints: 0,
        shortcuts: [],
        maincontentboxes: [],
        sidebars: [],
        woodCounter: null,
        tradegoodCounter: null,
        wineCounter: null,
        relatedCityData: null,
        advisorData: null,
        specialEvent: 0,
        titleCounter: null,
        init: function t(e) {
            this.gameName = e.gameName, this.serverName = e.serverName, this.avatarId = e.avatarId, this.avatarAllyId = e.avatarAllyId, this.woodCounter = null, this.tradegoodCounter = null, this.wineCounter = null, this.actionRequest = e.actionRequest, this.serverTime = parseInt(e.serverTime), this.requestTime = this.serverTime, this.dateTimeFormat = e.dateTimeFormat;
            var o = new Date;
            return this.initialBrowserTime = o.getTime(), this.initialServerTime = 1e3 * (parseInt(e.serverTime) + parseInt(e.serverTimezoneOffset) + 60 * o.getTimezoneOffset()), this.realHour = e.realHour, this.languageDirection = e.languageDirection, this.sideAttr = "rtl" === this.languageDirection ? "right" : "left", this.hasAlly = e.hasAlly, this.animationsActive = e.animationsActive, this.buildingNamesActive = e.buildingNamesActive, this.chatPollFrequency = e.chatPollFrequency, this.chatLineMaxlength = e.chatLineMaxlength, this.sessionDeprecated = e.sessionDeprecated, this.notesLineMaxlength = e.notesLineMaxlength, this.currentResources = e.currentResources, this.maxResources = e.maxResources, this.maxResourcesWithModifier = e.maxResourcesWithModifier, this.branchOfficeResources = e.branchOfficeResources, this.isOwnCity = e.isOwnCity, this.producedTradegood = e.producedTradegood, this.resourceProduction = e.resourceProduction, this.tradegoodProduction = e.tradegoodProduction, this.wineTickInterval = e.wineTickInterval, this.wineSpendings = e.wineSpendings, this.shortcuts = e.shortcuts, this.viewParams = e.viewParams, this.resetSliders = e.resetSliders, this.relatedCityData = e.relatedCityData, this.advisorData = e.advisorData, this.upkeep = e.upkeep, this.scientistsUpkeep = e.scientistsUpkeep, this.income = e.income, this.badTaxAccountant = e.badTaxAccountant, this.godGoldResult = e.godGoldResult, this.cityProducesWine = "1" == this.producedTradegood, setInterval(function() {
                ikariam.model.updateServerTime()
            }, 800), this.nextETA = e.nextETA, this.breadcrumbsWorldlinkText = e.breadcrumbsWorldlinkText, 0 < this.nextETA && (this.titleCounter = this.titleTag(this.nextETA, this.gameName, e.breadcrumbsWorldlinkText, this.serverName, this.serverTime)), this.specialEvent = e.specialEvent, this
        },
        updateTitleCounter: function t(e) {
            null == this.titleCounter && 0 != e || 0 == this.nextETA && 0 != e ? this.titleCounter = this.titleTag(e, this.gameName, this.breadcrumbsWorldlinkText, this.serverName, this.serverTime) : this.titleCounter.enddate = 1e3 * e, this.nextETA = e
        },
        setupResourceCounters: function e() {
            this.isOwnCity && (!this.woodCounter && (this.woodCounter = ikariam.getClass(ikariam.ResourceCounter, {
                startdate: this.serverTime,
                production: this.resourceProduction,
                watchedResource: "resource", // wood
                serverTimeDiff: this.getServerTimeDiff()
            })), !this.tradegoodCounter && (this.tradegoodCounter = ikariam.getClass(ikariam.ResourceCounter, {
                startdate: this.serverTime,
                production: this.tradegoodProduction,
                watchedResource: this.producedTradegood,
                serverTimeDiff: this.getServerTimeDiff()
            })))
        },
        updateGlobalData: function t(e) {
            console.log("ikariam.model: updateGlobalData with dataSet:"); // console.log(dataSet);
            var o = !1,
                n = [],
                r = ["cityLeftMenu", "activeResourceBonuses", "adVideoHappeningActive", "activeTradegoodBonuses", "producedTradegood"];
            for (var s in e)
                if (e.hasOwnProperty(s))
                    if ("cityDropdownMenu" == s) this.relatedCityData = e[s]; // update global city select
                    else if ("advisors" === s) this.advisorData = e[s]; // advisor status & link
            else if ("relatedCity" === s) o = ikariam.model.updateHeaderCityInfos(e[s]);
            else if (r.includes(s));
            else if ("badTaxAccountantActive" === s) $("#js_GlobalMenu_gold").parent().addClass("goldBonus").removeClass("gold");
            else if ("production_gold_premiumBonus_value" === s) $("#js_GlobalMenu_production_gold_premiumBonus_value").html(e[s]); // data key is not stored in model data:
            // it's an id in dom, try to update it with new value.
            else if (void 0 === this[s]); // nope. that method used here before does not exist. but this check still prevents us from running into a
            // different case below
            else if ("maxActionPoints" === s) ikariam.model.maxActionPoints = e[s], n.push("maxActionPoints"); // update data objects & dom contents in a generic way (current city menu data, appearing in the navigation left-top)
            else if (void 0 !== this[s] && this[s] != e[s]) {
                var l = e[s];
                if (l instanceof Object) { // value is not a primitive data type - we have a look at its sub keys.
                    for (var d in l)
                        if (l.hasOwnProperty(d)) {
                            var c = l[d];
                            void 0 !== this[s][d] && this[s][d] != c && (this[s][d] = c, n.push([s, d]))
                        }
                } else this[s] = l, n.push(s)
            } // update all changed values in city menu (dom)
            ikariam.backgroundView.updateCurrentCityMenu(n), ikariam.model.updateProductionResourceBonusTooltip(e), ikariam.model.updateProductionTradegoodBonusTooltip(e), this.isOwnCity && (ikariam.model.updateProductionTooltip(e), this.cityProducesWine = "1" == this.producedTradegood, o && this.setupResourceCounters(), ikariam.model.serverTime = ikariam.model.requestTime, ikariam.model.serverTimeDiff = 1e3 * ikariam.model.serverTime - new Date().getTime(), this.woodCounter.updateTimerConfig(this.resourceProduction), this.tradegoodCounter.timer.watchedResource = this.producedTradegood, this.tradegoodCounter.timer.valueElem = $("#js_GlobalMenu_" + ikariam.model.getResourceName(this.producedTradegood))[0], this.tradegoodCounter.updateTimerConfig(this.tradegoodProduction)), ikariam.model.updateProductionLinks(e)
        },
        updateProductionLinks: function t(e) {
            if (console.log("ikariam.model: updateProductionLinks with dataSet:"), !0 != ikariam.touchVersion)
                if (this.isOwnCity) {
                    $("#resources_wood").attr("onclick", "ajaxHandlerCall(\"?view=island&dialog=resource\");return false;").css({
                        cursor: "pointer"
                    }), "undefined" == typeof e.activeResourceBonuses ? $("#resources_wood").removeClass("bonusActive") : $("#resources_wood").addClass("bonusActive");
                    for (var o = 1; 5 > o; o++) o == e.producedTradegood ? ($("#resources_" + ikariam.model.getResourceName2("" + o)).hasClass("disabled") || $("#resources_" + ikariam.model.getResourceName2("" + o)).attr("onclick", "ajaxHandlerCall(\"?view=island&dialog=tradegood&type=" + o + "\");return false;").css({
                        cursor: "pointer"
                    }), "undefined" == typeof e.activeTradegoodBonuses ? $("#resources_" + ikariam.model.getResourceName2("" + o)).removeClass("bonusActive") : $("#resources_" + ikariam.model.getResourceName2("" + o)).addClass("bonusActive")) : ($("#resources_" + ikariam.model.getResourceName2("" + o)).removeAttr("onclick").css({
                        cursor: "default"
                    }), $("#resources_" + ikariam.model.getResourceName2("" + o)).removeClass("bonusActive"))
                } else
                    for (var o = 0; 5 > o; o++) $("#resources_" + ikariam.model.getResourceName2("" + o)).removeAttr("onclick").css({
                        cursor: "default"
                    })
        },
        updateProductionResourceBonusTooltip: function t(e) {
            $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("resource") + "_active_bonuses").removeClass("invisible"), e.adVideoHappeningActive ? $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("resource") + "_adVideoBonus").removeClass("invisible") : $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("resource") + "_adVideoBonus").addClass("invisible"), "undefined" == typeof e.activeResourceBonuses ? ($("#js_GlobalMenu_production_" + ikariam.model.getResourceName("resource") + "_premiumBonus_value").html("0 %"), $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("resource") + "_adVideoBonus_value").html("0 %"), $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("resource") + "_heliosTowerBonus_value").html("0 %"), $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("resource") + "_godBonus_value").html("0 %")) : ("undefined" == typeof e.activeResourceBonuses.activePremiumResourceBonus ? $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("resource") + "_premiumBonus_value").html("0 %") : $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("resource") + "_premiumBonus_value").html(e.activeResourceBonuses.activePremiumResourceBonus + " %"), "undefined" == typeof e.activeResourceBonuses.activeAdVideoResourceBonus ? $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("resource") + "_adVideoBonus_value").html("0 %") : $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("resource") + "_adVideoBonus_value").html(e.activeResourceBonuses.activeAdVideoResourceBonus + " %"), "undefined" == typeof e.activeResourceBonuses.activeHeliosTowerBonus ? $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("resource") + "_heliosTowerBonus_value").html("0 %") : $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("resource") + "_heliosTowerBonus_value").html(e.activeResourceBonuses.activeHeliosTowerBonus + " %"), "undefined" == typeof e.activeResourceBonuses.activeGodBonus ? $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("resource") + "_godBonus_value").html("0 %") : $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("resource") + "_godBonus_value").html(e.activeResourceBonuses.activeGodBonus + " %"))
        },
        updateProductionTradegoodBonusTooltip: function t(e) {
            for (var o = 1; 5 > o; o++) e.producedTradegood == o ? ($("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_active_bonuses").removeClass("invisible"), $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_active_bonuses").removeClass("invisible"), $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_premiumBonus").removeClass("invisible"), $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_heliosTowerBonus").removeClass("invisible"), $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_godBonus").removeClass("invisible"), e.adVideoHappeningActive ? $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_adVideoBonus").removeClass("invisible") : $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_adVideoBonus").addClass("invisible"), "undefined" == typeof e.activeTradegoodBonuses ? ($("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_premiumBonus_value").html("0 %"), $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_adVideoBonus_value").html("0 %"), $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_heliosTowerBonus_value").html("0 %"), $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_godBonus_value").html("0 %")) : ("undefined" == typeof e.activeTradegoodBonuses.activePremiumTradegoodBonus ? $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_premiumBonus_value").html("0 %") : $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_premiumBonus_value").html(e.activeTradegoodBonuses.activePremiumTradegoodBonus + " %"), "undefined" == typeof e.activeTradegoodBonuses.activeAdVideoTradegoodBonus ? $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_adVideoBonus_value").html("0 %") : $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_adVideoBonus_value").html(e.activeTradegoodBonuses.activeAdVideoTradegoodBonus + " %"), "undefined" == typeof e.activeTradegoodBonuses.activeHeliosTowerBonus ? $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_heliosTowerBonus_value").html("0 %") : $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_heliosTowerBonus_value").html(e.activeTradegoodBonuses.activeHeliosTowerBonus + " %"), "undefined" == typeof e.activeTradegoodBonuses.activeGodBonus ? $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_godBonus_value").html("0 %") : $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_godBonus_value").html(e.activeTradegoodBonuses.activeGodBonus + " %"))) : ($("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_active_bonuses").addClass("invisible"), $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_premiumBonus").addClass("invisible"), $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_adVideoBonus").addClass("invisible"), $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_heliosTowerBonus").addClass("invisible"), $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + o) + "_godBonus").addClass("invisible"))
        },
        updateProductionTooltip: function t(e) {
            var o = Math.floor; // console.log(dataSet);
            if (console.log("updateProductionTooltip called with dataset:"), e.tradegoodsVisible) {
                $(".tradegoodsInvisible").remove();
                for (var n = 1; 5 > n; n++) $("#resources_" + ikariam.model.getResourceName("" + n)).removeClass("disabled")
            }
            if (this.producedTradegood != e.producedTradegood) {
                this.producedTradegood = e.producedTradegood;
                for (var n = 1; 5 > n; n++) elem = $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + n)), e.producedTradegood == n ? (elem.html(ikariam.model.shortenValue(this.tradegoodProduction * ikariam.model.realHour, 15)), $("#js_GlobalMenu_production_container_" + ikariam.model.getResourceName("" + n)).removeClass("invisible")) : (elem.html("-"), $("#js_GlobalMenu_production_container_" + ikariam.model.getResourceName("" + n)).addClass("invisible"))
            } else $("#js_GlobalMenu_production_" + ikariam.model.getResourceName("" + this.producedTradegood)).html(this.shortenValue(o(this.tradegoodProduction * ikariam.model.realHour), 15));
            e.wineSpendings ? $("#js_GlobalMenu_WineConsumption").html(ikariam.model.shortenValue(e.wineSpendings, 15)) : $("#js_GlobalMenu_WineConsumption").html(0)
        },
        updateHeaderCityInfos: function t(e) {
            console.log("ikariam.model: updateHeaderCityInfos with dataSet:"); // console.log(dataSet);
            // console.log(this.isOwnCity);
            var o = !1,
                n = !1;
            if (this.isOwnCity != e.owncity && (this.isOwnCity = e.owncity, 0 == e.owncity ? ($("#resources_foreign").removeClass("invisible"), n = !0) : (o = !0, $("#resources_foreign").addClass("invisible"), $("#resources_population").removeClass("invisible"), $("#resources_wood").removeClass("invisible"), $("#resources_marble").removeClass("invisible"), $("#resources_wine").removeClass("invisible"), $("#resources_sulfur").removeClass("invisible"), $("#resources_glass").removeClass("invisible"))), 0 == e.owncity) {
                var r = $("#resources_foreign")[0];
                r.className = e.cssClass + " bold " + ("deployedCities" === e.cssClass ? "green" : "red"), r.innerHTML = e.text, n = !0
            }
            return n && ($("#resources_population").addClass("invisible"), $("#resources_wood").addClass("invisible"), $("#resources_marble").addClass("invisible"), $("#resources_wine").addClass("invisible"), $("#resources_sulfur").addClass("invisible"), $("#resources_glass").addClass("invisible")), o
        },
        updateServerTime: function e() {
            var t = getFormattedDate(this.initialServerTime + ikariam.model.getBrowserTimeDiff(), this.dateTimeFormat);
            $("#servertime").html(t)
        },
        getBrowserTimeDiff: function e() {
            return new Date().getTime() - this.initialBrowserTime
        },
        updateTemplateData: function t(e) {
            var o = ikariam.getController(); // @deprecated  deactivated in 0-5-0
            // winControl.wasMinimized = params.wasMinimized;
            o.scrollPosition = e.scrollPos, o.activeTab = e.activeTab
        },
        customizeForUA: function e() {},
        checkViewParameters: function t(e) {
            $(e).hasClass("noViewParameters") && "island" === ikariam.backgroundView.id && ikariam.getScreen().unselectCity();
            null == e.href || null === e.href || -1 !== e.href.indexOf("#") || -1 === e.href.indexOf("view=") && -1 === e.href.indexOf("action=") || $(e).hasClass("noViewParameters") || e.viewParamsAttached === void 0 && (e.href = this.formatViewParameters(splitUrlQueryString(e.href)), e.viewParamsAttached = !0)
        },
        getViewParameters: function e() {
            return this.viewParams
        },
        addViewParameter: function o(e, t) {
            this.viewParams[e] = t
        },
        formatViewParameters: function o(e, t) {
            var n = !1,
                r = !1,
                s = !1,
                l = !1,
                d = !1;
            if (void 0 === t || null === t) {
                if (this.checkReload(e)) return e.oldBackgroundView = ikariam.backgroundView.id, (0 != ikariam.mainbox_x || 0 != ikariam.mainbox_y || 0 != ikariam.mainbox_z) && (e.mainbox_x = ikariam.mainbox_x, e.mainbox_y = ikariam.mainbox_y, e.mainbox_z = ikariam.mainbox_z), (0 != ikariam.sidebar_x || 0 != ikariam.sidebar_y || 0 != ikariam.sidebar_z) && (e.sidebar_x = ikariam.sidebar_x, e.sidebar_y = ikariam.sidebar_y, e.sidebar_z = ikariam.sidebar_z), e.containerWidth = $("#container")[0].style.width, e.containerHeight = $("#container")[0].style.height, e.worldviewWidth = $("#worldview")[0].style.width, e.worldviewHeight = $("#worldview")[0].style.height, e[ikariam.backgroundView.id + "Top"] = $("#worldmap")[0].style.top, e[ikariam.backgroundView.id + "Left"] = $("#worldmap")[0].style.left, e[ikariam.backgroundView.id + "Right"] = $("#worldmap")[0].style.right, "city" === ikariam.backgroundView.id ? (e.cityWorldviewScale = ikariam.worldview_scale_city, mapNativeScrolling && (e.cityScrollLeft = ikariam.worldview_scroll_left_city, e.cityScrollTop = ikariam.worldview_scroll_top_city)) : "island" === ikariam.backgroundView.id && (e.islandWorldviewScale = ikariam.worldview_scale_island, mapNativeScrolling && (e.islandScrollLeft = ikariam.worldview_scroll_left_island, e.islandScrollTop = ikariam.worldview_scroll_top_island)), createUrlQueryString(e);
                if (null !== this.viewParams)
                    for (var c in this.viewParams)
                        if (this.viewParams.hasOwnProperty(c) && "" !== this.viewParams[c] && "view" !== c) {
                            "backgroundView" === c ? n = !0 : "templateView" === c ? r = !0 : c === ikariam.getScreen().screenIdName ? s = !0 : "actionRequest" === c ? l = !0 : "activeTab" == c && (d = !0);
                            var u = !0;
                            for (var p in e)
                                if (p === c) {
                                    u = !1;
                                    break
                                } if (u) {
                                var m = this.viewParams[c];
                                e[c] = m
                            }
                        } //alert(result);
                return n || (e.backgroundView = ikariam.backgroundView.id), s || "worldmap_iso" === ikariam.backgroundView.id || (e[ikariam.getScreen().screenIdName] = ikariam.getScreen().screenId), r || null === ikariam.templateView || null === ikariam.templateView.id || (e.templateView = ikariam.templateView.id), d || "" === ikariam.controller.activeTab || (e.currentTab = ikariam.controller.activeTab), l || (e.actionRequest = ikariam.model.actionRequest), void 0 === e.isMission && "island" === ikariam.backgroundView.id && ikariam.getScreen().unselectCity(), createUrlQueryString(e)
            }
            var g = $(t)[0];
            return void 0 === g ? void console.log("WARNING: could not append POST view parameters. the form (" + t + ") was not found in DOM.") : void appendHiddenField("actionRequest", ikariam.model.actionRequest, g)
        },
        formatViewUrl: function e() {
            var t = "index.php?view=" + ikariam.templateView.id + "",
                o = !1,
                n = !1,
                r = !1,
                s = !1;
            if (null !== this.viewParams)
                for (var l in this.viewParams)
                    if (this.viewParams.hasOwnProperty(l) && "" !== this.viewParams[l] && "view" !== l) {
                        "backgroundView" === l ? o = !0 : l === ikariam.getScreen().screenIdName ? r = !0 : "activeTab" === l && (s = !0);
                        var d = this.viewParams[l];
                        t += "&" + l + "=" + d
                    } return o || (t += "&backgroundView=" + ikariam.backgroundView.id), r || (t += "worldmap_iso" === ikariam.backgroundView.id ? "" : "&" + ikariam.getScreen().screenIdName + "=" + ikariam.getScreen().screenId), s || (t += "" === ikariam.controller.activeTab ? "" : "&currentTab=" + ikariam.controller.activeTab), t
        },
        checkReload: function t(e) {
            for (var o in e)
                if ("view" == o) return "city" === e[o] || "island" === e[o] || "worldmap_iso" === e[o] || "premiumPaymentTablet" === e[o]
        },
        getServerTimeDiff: function e() {
            return 1e3 * this.serverTime - new Date().getTime()
        },
        getResourceName: function t(e) {
            return 0 === e || "resource" === e ? "wood" : 1 === e || "1" === e ? "wine" : 2 === e || "2" === e ? "marble" : 3 === e || "3" === e ? "crystal" : 4 === e || "4" === e ? "sulfur" : ""
        },
        getResourceName2: function t(e) {
            switch (e) {
                case 1:
                case "1":
                    return "wine";
                case 2:
                case "2":
                    return "marble";
                case 3:
                case "3":
                    return "glass";
                case 4:
                case "4":
                    return "sulfur";
                case 0:
                case "resource":
                default:
                    return "wood"
            }
        },
        shortenValue: function t(e) {
            var o = Math.round,
                n = Math.pow,
                r = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : null,
                s = {
                    K: 3,
                    M: 6,
                    B: 9,
                    T: 12
                },
                l = "",
                d = o(e),
                c = d.toString().length;
            if (c > r || null === r)
                for (var u in s) {
                    if (c <= s[u]) break;
                    d = o(100 * (e / n(10, s[u]))) / 100, l = u
                }
            if (l) {
                var p = LocalizationStrings["largeNumber" + l];
                return p.replace("placeholder", this.locaNumberFormat(d, 2))
            }
            return this.locaNumberFormat(d, 0)
        },
        locaNumberFormat: function o(e, t) {
            return "undefined" == typeof t && (t = 0), this.numberFormat(e, t, LocalizationStrings.decimalPoint, LocalizationStrings.thousandSeperator)
        },
        numberFormat: function r(e, t, o, n) {
            var s = Math.floor,
                l = Math.round,
                d = Math.ceil,
                c = Math.abs,
                u = Math.pow,
                p = "",
                m = e.toString(),
                g = m.indexOf("e");
            if (-1 < g && (p = m.substring(g), e = parseFloat(m.substring(0, g))), null != t) {
                var h = u(10, t);
                e = l(e * h) / h
            }
            var b = 0 > e ? "-" : "",
                v = (0 < e ? s(e) : c(d(e))).toString(),
                x = e.toString().substring(v.length + b.length);
            if (o = null == o ? "." : o, x = null != t && 0 < t || 1 < x.length ? o + x.substring(1) : "", null != t && 0 < t)
                for (var C = x.length - 1, y = t; C < y; ++C) x += "0";
            if (n = n != o || 0 == x.length ? n : null, null != n && "" != n)
                for (var C = v.length - 3; 0 < C; C -= 3) v = v.substring(0, C) + n + v.substring(C);
            return b + v + x + p
        },
        titleTag: function s(e, t, o, n, r) {
            var l = Math.floor,
                d = new Timer(e, r, 1);
            return $(d).on("update", function() {
                var e = this.enddate - 1e3 * l(this.currenttime / 1e3),
                    r = t + " - ";
                "" != e && (r += ikariam.model.getTimestring(e, 3, void 0, void 0, void 0, !0) + " - "), r += o + " " + n, doc.title = r
            }).on("finished", function() {
                doc.title = t + " - " + o + " " + n
            }), d.startTimer(), d
        },
        getTimestring: function d(e, t, o, n, r, s, l) {
            var c = Math.floor,
                u = Math.ceil;
            "undefined" == typeof e && (e = 0), "undefined" == typeof t && (t = 2), "undefined" == typeof o && (o = " "), "undefined" == typeof n && (n = ""), "undefined" == typeof r && (r = !0), "undefined" == typeof s && (s = !1), "undefined" == typeof l && (l = !1);
            var p = {
                    year: 31536000,
                    month: 2592000,
                    day: 86400,
                    hour: 3600,
                    minute: 60,
                    second: 1
                },
                m = {
                    year: r ? LocalizationStrings.timeunits.short.year : "",
                    month: r ? LocalizationStrings.timeunits.short.month : "",
                    day: r ? LocalizationStrings.timeunits.short.day : "",
                    hour: r ? LocalizationStrings.timeunits.short.hour : "",
                    minute: r ? LocalizationStrings.timeunits.short.minute : "",
                    second: r ? LocalizationStrings.timeunits.short.second : ""
                },
                g = u(+e / 1e3),
                h = ""; // Convert timestamp to seconds and ensure it's a number
            for (var b in p) {
                if (!1 !== l && b !== l) continue;
                else l = !1;
                var v = c(g / p[b]);
                0 < t && (0 < v || s && "" !== h) && (g %= p[b], "" !== h && (h += o), h += s ? 0 < v && 10 > v ? "0" + v + m[b] : 0 === v ? "00" + m[b] : v + m[b] : v + m[b], t--)
            }
            return 0 < g && (h = n + h), "" === h && (h = "-"), h
        },
        mmoDetectDeviceOS: function e() {
            return function(e) {
                return /iPhone/i.test(e) || /iPad/.test(e) || /iPod/.test(e) ? "ios" : /Android/.test(e) ? "android" : /Windows Phone OS 7\.0/.test(e) ? "winphone7" : /BlackBerry/.test(e) ? "rim" : "desktop"
            }(navigator.userAgent)
        },
        mmoSetBannerDeviceOS: function e() {
            if ("" == this.ingameAd || 1 == touchVersion) return "";
            var t = this.mmoDetectDeviceOS(),
                o = new RegExp(/(iframe[^>]*src=)["']([^"']*)["']/),
                n = t && o.test(this.ingameAd) ? this.ingameAd.replace(o, RegExp.$1 + "\"" + RegExp.$2 + "&os=" + t + "\"") : this.ingameAd; // original class removed because it was used by 3rd party tools
            return "<div class=\"center\" style=\"height: 60px; padding-bottom: 8px;\">" + n + "</div>"
        }
    }, ikariam.Controller = {
        ajaxResponder: null,
        scrollDiv: null,
        action: "",
        popupController: null,
        dropdownMenus: [],
        backLink: "",
        activeTab: "",
        wasMinimized: !1,
        scrollPosition: 0,
        clickPosition: [0, 0],
        clickTarget: null,
        tooltipController: null,
        sliders: [],
        actionMonitor: null,
        messageMonitor: null,
        premiumActive: null,
        zoom: !1,
        init: function t(e) {
            console.log("INIT ikariam.Controller with dataSet:"); // console.log(params);
            var o = this;
            this.ikariam = ikariam, this.tooltipController = BubbleTips.init(), ikariam.model.customizeForUA(), this.actionMonitor = new ActionMonitor, this.messageMonitor = new MessageMonitor, this.messageMonitor.init(), $(d).on("mousedown", function(t) {
                o.captureMousePosition(t)
            }).on("mouseup", function(t) {
                BubbleTips.bubbleNode.innerHTML = "", BubbleTips.infoNode.innerHTML = ""
            }), this.scrollDiv = "worldmap_iso" === ikariam.backgroundView.id ? $("#map1")[0] : $("#worldmap")[0], this.scaleViewport(), mapNativeScrolling && ("city" === ikariam.backgroundView.id ? ($("#scrollcover").scrollLeft(ikariam.worldview_scroll_left_city), $("#scrollcover").scrollTop(ikariam.worldview_scroll_top_city)) : "island" === ikariam.backgroundView.id && ($("#scrollcover").scrollLeft(ikariam.worldview_scroll_left_island), $("#scrollcover").scrollTop(ikariam.worldview_scroll_top_island))), $(w).on("resize", function(t) {
                o.scaleViewport(), o.adjustSizes(), o.scaleViewport()
            });
            var n = $("#scrollcover"); // drag and drop on background view
            return touchVersion ? (n.on("touchstart", o.onTouchStart), mapNativeScrolling && "worldmap_iso" !== ikariam.backgroundView.id ? n.scroll(function() {
                "city" === ikariam.backgroundView.id ? (ikariam.worldview_scroll_left_city = $(this).scrollLeft(), ikariam.worldview_scroll_top_city = $(this).scrollTop()) : (ikariam.worldview_scroll_left_island = $(this).scrollLeft(), ikariam.worldview_scroll_top_island = $(this).scrollTop()), ikariam.getController().clearOverlayContainers()
            }) : n.on("touchmove", o.onTouchMove).on("touchend", o.onTouchEnd), hasGesture && n.on("gesturestart", o.onGestureStart).on("gesturechange", o.onGestureChange).on("gestureend", o.onGestureEnd)) : (n.on("mousedown", o.dragHandle).on("mouseup", o.dragStop), (!isIE || isIE9p) && $(this.scrollDiv).on("mousewheel", o.mouseScrollHandle), $("#GF_toolbar").on("mouseup", o.dragStop), $("#header").on("mouseup", o.dragStop), $("#footer").on("mouseup", o.dragStop), $("#leftMenu").on("mouseup", o.dragStop), $("#rightMenu").on("mouseup", o.dragStop), $(d).on("keyup", function(t) {
                27 === t.which && (ikariam.destroyCurrentViewWithEscape(), ikariam.controller.resetSliders(), "island" === ikariam.backgroundView.id && ikariam.getScreen().unselectCity())
            })), null != e.feedbackMsg && this.tooltipController.bindBubbleTip(e.feedbackMsg.location, e.feedbackMsg.type, e.feedbackMsg.text), this.popupController = ikariam.getClass(ikariam.PopupController), this.popupMultiController = ikariam.getClass(ikariam.MultiPopupController), this.setupFocusEvents(), this
        },
        update: function e() {
            return console.log("ikariam.Controller: UPDATE"), this.replaceElements(), this.adjustSizes(), this
        },
        replaceElements: function e() {
            console.log("ikariam.Controller: REPLACE ELEMENTS"), ikariam.backgroundView.updateCityDropdownMenu(), ikariam.backgroundView.updateGlobalAdvisors(), this.replaceButtons(), touchVersion ? this.replaceCheckboxes() : (this.replaceCheckboxes(), this.replaceDropdownMenus(), this.replaceToolTips())
        },
        setupFocusEvents: function e() {
            $(document).on("focusElement", "#container > .focusable", function(e) {
                $("#container > .focusable").removeClass("focus"), $(this).addClass("focus");
                var t = $(this).data("focusAlsoSelector");
                t !== void 0 && $(t).addClass("focus")
            }).on("click.focusElement", "#container > .focusable", function(e) {
                $(this).trigger("focusElement")
            })
        },
        resetSliders: function e() {
            console.log("###################### RESET SLIDERS"), this.sliders = []
        },
        captureMousePosition: function e(t) {
            t.pageX || t.pageY ? (this.clickPosition[0] = t.pageX, this.clickPosition[1] = t.pageY) : (t.clientX || t.clientY) && (this.clickPosition[0] = t.clientX + doc.body.scrollLeft + doc.documentElement.scrollLeft, this.clickPosition[1] = t.clientY + doc.body.scrollTop + doc.documentElement.scrollTop);
            var o = t.target;
            this.clickTarget = null === o.offsetParent ? null : o, null !== this.tooltipController && null !== this.tooltipController.tooltip && 12 !== this.tooltipController.tooltip.type && this.tooltipController.cleanupBubbleTips()
        },
        executeAjaxRequest: function r(e, t, o, n) {
            console.log("ikariam.Controller: executeAjaxRequest"), console.log("---------------- executeAjaxRequest -----------------------");
            var s = this;
            "undefined" == typeof n && (n = !0), "undefined" == typeof o && (o = null);
            var l = $("#loadingPreview");
            $.ajax({
                async: n,
                type: "POST",
                url: e,
                data: o,
                beforeSend: function e() {
                    l.css("display", "block")
                },
                error: function o(e, t) {
                    l.css("display", "none"), touchVersion && alert("Connection Error")
                },
                success: function r(e, o, n) {
                    if (console.log("==========================> ikariam.Controller: callback ajax success"), l.css("display", "none"), "undefined" == typeof t || null === t) null === s.ajaxResponder ? s.ajaxResponder = ikariam.getClass(ajax.Responder, e) : s.ajaxResponder.parseResponse(e);
                    else {
                        -1 !== e.indexOf("dataForJSCallback") && (e = JSON.parse(e), ikariam.getModel().actionRequest = e.actionRequest, e = e.dataForJSCallback);
                        var d = new t(e)
                    }
                    window.setTimeout("ikariam.controller.adjustSizes()", 5e3), console.log("==========================> ikariam.Controller: callback ajax success end")
                }
            })
        },
        switchTab: function t(e) {
            console.log("ikariam.Controller: switchTab"), console.log(e);
            var o = $("#js_" + e);
            if (1 > o.length) return !1; // tab does not exist
            // tab is already selected. jump back if there was no action
            if (o.hasClass("selected")) return null !== ikariam.templateView && ajaxHandlerCall("index.php?view=" + ikariam.templateView.id + "&activeTab=" + e);
            this.activeTab = e;
            var n = o.parent().find("li.tab"),
                r = n.length; // clear all active feedback messages and tooltips
            return this.clearOverlayContainers(), o.parent().find("li.tab").each(function() { //var tabContent = Dom.get(myTabs[i].firstChild.className);
                var e = $("#" + $(this).children().attr("class"));
                o[0] === this ? ($(this).addClass("selected"), 0 < e.length && e.css("display", "")) : ($(this).removeClass("selected"), 0 < e.length && e.css("display", "none"))
            }), this.adjustSizes(), ikariam.model.addViewParameter("activeTab", e), !0
        },
        replaceToolTips: function e() {
            var t = $("div.tooltip"),
                o = 0;
            t.each(function() {
                !0 === $(this).attr("updated") || ($(this).parent().on("mouseover", function(t) {
                    var e = $(this).find("div.tooltip");
                    return 1 > e.length ? void $(this).off("mouseover") : void(e.hasClass("tooltip_disabled") || ikariam.controller.tooltipController.bindBubbleTip(6, 13, e.html(), t, this, $(this).hasClass("min_size")))
                }), o++, $(this).attr("updated", !0))
            }), console.log("ikariam.Controller: replaceToolTips - found " + t.length + " tooltips, updated " + o + ".")
        },
        replaceCheckboxes: function e() {
            var t = 0,
                o = $("input.checkbox");
            o.each(function() {
                if (!0 !== this.replaced) {
                    var e = $(this).parent(),
                        o = "checkbox " + ($(this).prop("checked") ? "checked" : "") + ($(this).prop("disabled") ? " disabled" : "") + ("radio" == $(this).attr("type") ? " radio" : ""),
                        n = $("<div>", {
                            id: ($(this).attr("id") ? $(this).attr("id") : "") + "Img",
                            class: o + " image"
                        }).appendTo(e);
                    $(this).attr("title") !== void 0 && "" !== $(this).attr("title") && (n.addClass("floatleft"), $("<span>", {
                        class: "smallFont floatleft checkbox_label"
                    }).html($(this).attr("title")).appendTo(e), e.addClass("clearfix")), n[0].checkboxEl = $(this), n[0].elName = $(this).attr("name"), $(this).hasClass("wide") || ($(this).on("change", function() {
                        $(this).prop("checked") || "checkbox" != $(this).attr("type") ? ("radio" == $(this).attr("type") && $("div.radio").each(function() {
                            this.elName === n[0].elName && $(this).removeClass("checked")
                        }), n.addClass("checked")) : n.removeClass("checked")
                    }), n.on("click", function() {
                        if (!(this.checkboxEl.attr("disabled") || $(this).attr("disabled"))) {
                            var e = this.checkboxEl.prop("checked");
                            "radio" == this.checkboxEl.attr("type") && !0 == e && (e = !1), this.checkboxEl.prop("checked", !e).trigger("change"), void 0 !== this.checkboxEl.attr("onclick") && this.checkboxEl.triggerHandler("click")
                        }
                    })), n.on("mouseover", function() {
                        $(this).addClass("hover")
                    }).on("mouseout", function() {
                        $(this).removeClass("hover")
                    }), $(this).addClass("invisible"), t++, this.replaced = !0
                }
            }), console.log("ikariam.Controller: replaceCheckboxes - found " + o.length + " checkboxes/radio buttons, replaced " + t + ".")
        },
        toTitleCase: function t(e) {
            return e.replace(/(?:^|\s)\w/g, function(e) {
                return e.toUpperCase()
            })
        },
        replaceCheckboxesTablet: function e() {
            var t = 0,
                o = $("input.checkbox");
            o.each(function() {
                if (!0 !== this.replaced) {
                    var e = $(this).parent();
                    $(e).addClass("checkBoxWrapper"), id = $(this).attr("id"), ("opAutomaticCheckBox" == id || "opSpecialRank" == id) && $(this).click(function() {
                        name = $(this).attr("name"), $("input[name=\"" + name + "\"]").removeClass("checked"), $(this).addClass("checked")
                    }), $(this).attr("title") !== void 0 && "" !== $(this).attr("title") && (label = $("<label>", {
                        class: "smallFont checkbox_label"
                    }), $(this).wrap(label), $(this).after($(this).attr("title")));
                    t++, this.replaced = !0
                }
            }), console.log("ikariam.Controller: replaceCheckboxes - found " + o.length + " checkboxes/radio buttons, replaced " + t + ".")
        },
        replaceDropdownMenus: function e() {
            $(".select_container").dropdown({
                languageDirection: ikariam.model.languageDirection
            })
        },
        replaceButtons: function e() {
            var t = $("a"),
                o = 0;
            t.each(function() {
                this.updated !== void 0 && this.updated || ($(this).on("mousedown", function() {
                    ikariam.model.checkViewParameters(this), $(this).addClass("down")
                }).on("mouseup mouseout", function() {
                    $(this).removeClass("down")
                }), this.updated = !0, o++)
            }), console.log("ikariam.Controller: replaceButtons - found " + t.length + " <a> tags, updated " + o + ".")
        },
        clearOverlayContainers: function e() { //   console.log("ikariam.Controller: clearOverlayContainers");
            this.tooltipController.cleanupInnerBubbleTips(), $("body").trigger("click.dropDown"), $(document).trigger("closeExclusiveInfo")
        },
        scaleViewport: function e() {
            var t = Math.floor,
                o = Math.round,
                n = Math.ceil,
                r = Math.max,
                s = Math.min;
            ikariam.boxOffsetLeft = 1100 > doc.body.offsetWidth ? 45 : 70, ikariam.boxOffsetTop = 197, ikariam.boxOffsetRight = 1100 > doc.body.offsetWidth ? 45 : 80;
            var l = r(doc.body.offsetWidth, ikariam.minResolutionX),
                d = r(doc.body.offsetHeight, ikariam.minResolutionY);
            ikariam.netbarActive && (d -= 32);
            var c = touchVersion ? 0 : 46,
                u = d - c; // background image height in #header
            // Minimale Skalierung neu Bestimmen (z.b. wichtig, wenn das iPad gedreht wird) und aktuelle Werte ueberpruefen
            ikariam.worldview_scale_min = r(l / ikariam.maxResolutionX, u / ikariam.maxResolutionY, ikariam.worldview_scale_min), ikariam.worldview_scale_city = r(s(ikariam.worldview_scale_city, ikariam.worldview_scale_max), ikariam.worldview_scale_min), ikariam.worldview_scale_island = r(s(ikariam.worldview_scale_island, ikariam.worldview_scale_max), ikariam.worldview_scale_min), $("#container").css({
                width: l + "px",
                height: d + "px"
            }), $("#worldview").css({
                width: (mapNativeScrolling ? l + 7 : l) + "px",
                height: u + "px"
            });
            var p = ikariam.maxResolutionX / 2,
                m = ikariam.maxResolutionY / 2;
            if ("worldmap_iso" === ikariam.backgroundView.id) p = 120, m = ikariam.tileHeight * ikariam.maxTiles / 2 + 30, $("#worldmap").css({
                left: l / 2 - p + "px",
                top: s(0, u / 2 - m) + "px"
            });
            else {
                var g = "Android" == touchVersion ? (doc.body.offsetWidth - ikariam.minResolutionX) / 2 : 0,
                    b = parseInt($("#worldmap").css(ikariam.model.sideAttr)),
                    v = parseInt($("#worldmap").css("top")),
                    x = 1;
                if ((0 == ikariam.cityParametersAlreadySet && "city" === ikariam.backgroundView.id || 0 == ikariam.islandParametersAlreadySet && "island" === ikariam.backgroundView.id) && (b = o(l / 2 - p - g) + 40), "city" === ikariam.backgroundView.id ? (0 == ikariam.cityParametersAlreadySet && (v = -130), x = ikariam.worldview_scale_city) : (0 == ikariam.islandParametersAlreadySet && (v = o(d / 2 - m)), x = ikariam.worldview_scale_island), mapNativeScrolling) {
                    var C = "city" === ikariam.backgroundView.id ? $("#locations").height() : $("#island_ocean").height();
                    $(this.scrollDiv).css("height", C * (2 * x - 1) + "px")
                } else // Position des worldmap Containers mit "neuer" Skalierung ueberpruefen
                    b = s(n((x - 1) * p), b), v = s(n((x - 1) * m), v), b = r(b, t(l - (1 + x) * p)), v = r(v, t(u - (1 + x) * m)), $(this.scrollDiv).css("top", v + "px").css(ikariam.model.sideAttr, b + "px");
                $(this.scrollDiv).css("transform", "scale(" + x + ")")
            }
            console.log("scaleViewport: width: " + l + ", height: " + u + ", " + ikariam.model.sideAttr + ": " + (l / 2 - p) + ", top: " + s(0, u / 2 - m))
        },
        adjustSizes: function e() {
            "worldmap_iso" === ikariam.backgroundView.id && ikariam.getScreen().scaleMaxSize();
            for (var t = ikariam.model.maincontentboxes, o = ikariam.model.sidebars, n = t.length, r = o.length, s = 0; s < n; s++) t[s].adjustSize();
            for (var l = 0; l < r; l++) o[l].adjustSize()
        },
        scaleWorldMap: function n(e, t, o) {
            var r = Math.floor,
                s = Math.ceil,
                l = Math.max,
                d = Math.min;
            if ("worldmap_iso" !== ikariam.backgroundView.id) {
                var c = 1,
                    u = 1,
                    p = ikariam.getController(),
                    m = ikariam.getMapNavigation(); // Neuen Skalierungs-Faktor berechnen und ueberpruefen, ob diese Skalierung erlaubt ist
                // Da nicht immer vom Skalierungs-Faktor 1 aus skaliert wird, muss ein Faktor, der die Aenderung angibt, zur Berechnung verwendet werden
                "city" === ikariam.backgroundView.id ? (u = ikariam.worldview_scale_city, ikariam.worldview_scale_city += .05 * e, ikariam.worldview_scale_city > ikariam.worldview_scale_max && (ikariam.worldview_scale_city = ikariam.worldview_scale_max), ikariam.worldview_scale_city < ikariam.worldview_scale_min && (ikariam.worldview_scale_city = ikariam.worldview_scale_min), c = ikariam.worldview_scale_city) : "island" === ikariam.backgroundView.id && (u = ikariam.worldview_scale_island, ikariam.worldview_scale_island += .05 * e, ikariam.worldview_scale_island > ikariam.worldview_scale_max && (ikariam.worldview_scale_island = ikariam.worldview_scale_max), ikariam.worldview_scale_island < ikariam.worldview_scale_min && (ikariam.worldview_scale_island = ikariam.worldview_scale_min), c = ikariam.worldview_scale_island);
                var g = $("#worldview").offset(),
                    h = $("#worldview")[0],
                    b = "right" === ikariam.model.sideAttr ? h.offsetWidth - t - g.left : t - g.left,
                    v = o - g.top,
                    x = $("#worldmap")[0],
                    C = x.offsetWidth / 2,
                    y = x.offsetHeight / 2,
                    _ = c / u;
                if (mapNativeScrolling) {
                    var k = "city" === ikariam.backgroundView.id ? $("#locations") : $("#island_ocean"),
                        T = $("#scrollcover"),
                        S = r(T.scrollLeft() * _ - b * (1 - _)),
                        P = r(T.scrollTop() * _ - v * (1 - _));
                    "city" === ikariam.backgroundView.id ? (ikariam.worldview_scroll_left_city = S, ikariam.worldview_scroll_top_city = P) : "island" === ikariam.backgroundView.id && (ikariam.worldview_scroll_left_island = S, ikariam.worldview_scroll_top_island = P), $(p.scrollDiv).css({
                        transform: "scale(" + c + ")",
                        height: k.height() * (2 * c - 1) + "px"
                    }), T.scrollLeft(S), T.scrollTop(P)
                } else { // Zur Bestimmung der neuen Top- & Left-Werte des worldmap Containers muss die Position zunÃ¤chst in Bezug auf den
                    // Mittelpunkt des Containers bestimmt und anschliessend wieder zurueck gerechnet werden
                    var h = $("#worldview")[0],
                        R = parseInt($(p.scrollDiv).css(ikariam.model.sideAttr)) + C,
                        M = parseInt($(p.scrollDiv).css("top")) + y,
                        E = R * _ - C + b * (1 - _),
                        V = M * _ - y + v * (1 - _); // Scrollgrenzen fuer Insel-&Citymap
                    "worldmap_iso" !== ikariam.backgroundView.id && (E = d(s((c - 1) * C), E), V = d(s((c - 1) * y), V), E = l(E, r(h.offsetWidth - (1 + c) * C)), V = l(V, r(h.offsetHeight - (1 + c) * y))), $(p.scrollDiv).css({
                        top: V + "px",
                        transform: "scale(" + c + ")"
                    }).css(ikariam.model.sideAttr, E + "px")
                }
            }
        },
        scrollToTop: function e() { //console.log("ikariam.Controller: scrollToTop");
            if (null !== ikariam.templateView && null !== ikariam.templateView.mainbox)
                if (touchVersion) $(ikariam.templateView.mainbox.boxScrollContainer).scrollTop(0), this.clearOverlayContainers();
                else {
                    if (null === ikariam.templateView.mainbox.scrollbar) return;
                    var t = ikariam.templateView.mainbox.scrollbar;
                    t.scrollToTop()
                }
        },
        mouseScrollHandle: function o(e, t) { //console.log("ikariam.Controller: mouseScrollHandle");
            ikariam.getController().scaleWorldMap(t, isIE ? e.clientX : e.pageX, isIE ? e.clientY : e.pageY), e.preventDefault()
        },
        dragHandle: function t(e) {
            var o = Math.floor,
                n = Math.ceil,
                r = Math.abs,
                s = Math.max,
                l = Math.min;
            e.preventDefault();
            var d = ikariam.getController(),
                c = ikariam.getMapNavigation(); // store drag starting position x/y
            // attach mouse move handler...
            d.relTarget = e.target || e.relatedTarget || e.toElement, d.startDragHandlePosX = isIE ? w.event.clientX : e.pageX, d.startDragHandlePosY = isIE ? w.event.clientY : e.pageY, $("#scrollcover").on("mousemove.dragMap", function(t) { // on first movement in the drag procedure,
                // update map navigation control with the current background position.
                if (isIE && (t = w.event), e.preventDefault(), "" === d.action) {
                    var u = parseInt($(d.scrollDiv).css(ikariam.model.sideAttr)),
                        p = parseInt($(d.scrollDiv).css("top"));
                    c.startDragY = p ? p : 0, c.startDragX = u ? u : 0, "worldmap_iso" === ikariam.backgroundView.id && (c.startMapX = ikariam.getScreen().currMapX, c.startMapY = ikariam.getScreen().currMapY)
                } // get delta x and y...
                var m = isIE ? t.clientX : t.pageX,
                    g = isIE ? t.clientY : t.pageY,
                    h = m - d.startDragHandlePosX,
                    b = g - d.startDragHandlePosY; // switch to right side scrolling (rtl)...
                // begrenze scrollweite...
                if ("rtl" === ikariam.model.languageDirection && (h *= -1), "undefined" != typeof t && (10 < r(h) || 10 < r(b)) && (d.action = "dragHandle"), h += c.startDragX, b += c.startDragY, "worldmap_iso" !== ikariam.backgroundView.id) {
                    var v = ikariam.maxResolutionX / 2,
                        x = ikariam.maxResolutionY / 2,
                        C = 1;
                    "city" === ikariam.backgroundView.id ? C = ikariam.worldview_scale_city : "island" === ikariam.backgroundView.id && (C = ikariam.worldview_scale_island), h = l(n((C - 1) * v), h), b = l(n((C - 1) * x), b);
                    var y = $("#worldview")[0];
                    h = s(h, o(y.offsetWidth - (1 + C) * v)), b = s(b, o(y.offsetHeight - (1 + C) * x))
                } // SET NEW BACKGROUND POSITION HERE:
                // special case world map: we have to draw the border island tiles in 4 directions,
                // dependent on movement direction and position on map.
                if ($(d.scrollDiv).css(ikariam.model.sideAttr, h + "px").css("top", b + "px"), "worldmap_iso" === ikariam.backgroundView.id) {
                    var _ = 0;
                    "rtl" === ikariam.model.languageDirection && (_ = s(doc.body.offsetWidth, ikariam.minResolutionX));
                    var k = m - d.startDragHandlePosX + c.startDragX - _,
                        T = g - d.startDragHandlePosY + c.startDragY; // delta movement x/y since last draw
                    k / 2 + T > c.lastDiffX + 2 * ikariam.tileHeight ? ikariam.getScreen().drawBorder(2, 0) : k / 2 + T < c.lastDiffX - 2 * ikariam.tileHeight ? ikariam.getScreen().drawBorder(-2, 0) : k / 2 - T > c.lastDiffY + 2 * ikariam.tileHeight ? ikariam.getScreen().drawBorder(0, 2) : k / 2 - T < c.lastDiffY - 2 * ikariam.tileHeight && ikariam.getScreen().drawBorder(0, -2)
                }
            })
        },
        dragStop: function e(t) {
            $("#scrollcover").off("mousemove.dragMap");
            var o = ikariam.getController();
            if ("dragHandle" === o.action) {
                setTimeout(function() {
                    o.action = ""
                }, 200); // update position in navigation controls
                var n = ikariam.getMapNavigation();
                n.posX = parseInt($(o.scrollDiv).css("rtl" === ikariam.model.languageDirection ? "right" : "left"), 10), n.posY = parseInt($(o.scrollDiv).css("top"), 10)
            }
        },
        onTouchStart: function o(t) {
            var n = Math.pow,
                r = t.originalEvent,
                e = ikariam.getController(); //console.log("Touchstart: "+e.touches.length);
            1 < r.touches.length && !mapNativeScrolling ? (e.zoom = !0, !hasGesture && (e.touchOldDistance = Math.sqrt(n(r.touches[0].pageX - r.touches[1].pageX, 2) + n(r.touches[0].pageY - r.touches[1].pageY, 2))), e.touchStartX = (r.touches[0].pageX + r.touches[1].pageX) / 2, e.touchStartY = (r.touches[0].pageY + r.touches[1].pageY) / 2, t.preventDefault()) : !e.zoom && (e.touchStartX = r.touches[0].pageX, e.touchStartY = r.touches[0].pageY)
        },
        onTouchMove: function o(t) {
            var n = Math.floor,
                r = Math.pow,
                s = Math.max,
                l = Math.min,
                d = t.originalEvent,
                e = ikariam.getController(); //console.log("Touchmove: "+e.touches.length);
            if (!hasGesture && 1 < d.touches.length && !0 === e.zoom) {
                var c = Math.sqrt(r(d.touches[0].pageX - d.touches[1].pageX, 2) + r(d.touches[0].pageY - d.touches[1].pageY, 2)),
                    u = 0 < c - e.touchOldDistance ? 1 : -1;
                e.scaleWorldMap(u, e.touchStartX, e.touchStartY), e.touchOldDistance = c
            } else if (!1 === e.zoom) {
                var p = "worldmap_iso" === ikariam.backgroundView.id ? $("#worldmap")[0] : $("#worldview")[0],
                    m = ikariam.getMapNavigation(); // on first movement in the touchMove procedure,
                // update map navigation control with the current background position.
                if ("" === e.action) {
                    var g = parseInt($(e.scrollDiv).css(ikariam.model.sideAttr)),
                        h = parseInt($(e.scrollDiv).css("top"));
                    m.startDragY = h ? h : 0, m.startDragX = g ? g : 0, "worldmap_iso" === ikariam.backgroundView.id && (m.startMapX = ikariam.getScreen().currMapX, m.startMapY = ikariam.getScreen().currMapY), e.action = "dragHandle"
                }
                var b = d.touches[0].pageY - e.touchStartY,
                    v = d.touches[0].pageX - e.touchStartX; // switch to right side scrolling (rtl)...
                if ("rtl" === ikariam.model.languageDirection && (v *= -1), b += m.startDragY, v += m.startDragX, "worldmap_iso" !== ikariam.backgroundView.id) {
                    var x = ikariam.maxResolutionX / 2,
                        C = ikariam.maxResolutionY / 2,
                        y = 1;
                    "city" === ikariam.backgroundView.id ? y = ikariam.worldview_scale_city : "island" === ikariam.backgroundView.id && (y = ikariam.worldview_scale_island), b = l((y - 1) * C, b), v = l((y - 1) * x, v), v = s(v, p.offsetWidth - (1 + y) * x), b = s(b, p.offsetHeight - (1 + y) * C)
                } // special case world map: we have to draw the border island tiles in 4 directions,
                // dependent on movement direction and position on map.
                if ("rtl" === ikariam.model.languageDirection ? $(e.scrollDiv).css({
                        top: b + "px",
                        right: v + "px"
                    }) : $(e.scrollDiv).css({
                        top: b + "px",
                        left: v + "px"
                    }), "worldmap_iso" === ikariam.backgroundView.id) {
                    var _ = 0;
                    "rtl" === ikariam.model.languageDirection && (_ = s(doc.body.offsetWidth, ikariam.minResolutionX));
                    var k = d.touches[0].pageX - e.touchStartX + m.startDragX - _,
                        T = d.touches[0].pageY - e.touchStartY + m.startDragY; // delta movement x/y since last draw
                    (k / 2 + T > m.lastDiffX + 2 * ikariam.tileHeight || k / 2 + T < m.lastDiffX - 2 * ikariam.tileHeight) && ikariam.getScreen().drawBorder(n((k / 2 + T - m.lastDiffX) / ikariam.tileHeight), 0), (k / 2 - T > m.lastDiffY + 2 * ikariam.tileHeight || k / 2 - T < m.lastDiffY - 2 * ikariam.tileHeight) && ikariam.getScreen().drawBorder(0, n((k / 2 - T - m.lastDiffY) / ikariam.tileHeight))
                }
            }
            t.preventDefault()
        },
        onTouchEnd: function o(t) {
            var n = t.originalEvent,
                e = ikariam.getController(); //console.log("Touchend: "+e.touches.length);
            if (!0 === e.zoom && 0 == n.touches.length && (e.zoom = !1), "dragHandle" === e.action) {
                setTimeout(function() {
                    e.action = ""
                }, 200); // update position in navigation controls
                var r = ikariam.getMapNavigation();
                r.posX = parseInt($(e.scrollDiv).css("rtl" === ikariam.model.languageDirection ? "right" : "left"), 10), r.posY = parseInt($(e.scrollDiv).css("top"), 10)
            }
        },
        onGestureStart: function o(t) {
            var n = t.originalEvent,
                e = ikariam.getController();
            e.gestureLastScale = n.scale, t.preventDefault()
        },
        onGestureChange: function o(t) {
            var n = t.originalEvent,
                e = ikariam.getController(),
                r = n.scale - e.gestureLastScale;
            if (.01 < Math.abs(r)) {
                var s = 0 < r ? 1 : -1;
                e.scaleWorldMap(s, e.touchStartX, e.touchStartY), e.gestureLastScale = n.scale
            }
            t.preventDefault()
        },
        onGestureEnd: function o(t) {
            var n = t.originalEvent,
                e = ikariam.getController();
            e.zoom = !1, t.preventDefault()
        }
    }, ikariam.BackgroundView = {
        id: "",
        screen: null,
        friendsMenu: null,
        chatMenu: null,
        cityMenu: null,
        navigation: null, //minimizedBoxes: [],
        init: function t(e) { // init the central screen object: either worldmap, island or city. pass screen specific bgViewData to the new object.
            switch (this.id = e.backgroundView, this.navigation = ikariam.getClass(ikariam.MapNavigation, {
                    id: this.id,
                    expanded: e.mapNavigationExpanded
                }), this.id) {
                case "worldmap_iso":
                    this.screen = ikariam.getClass(worldmap.Screen, e.bgViewData);
                    break;
                case "island":
                    this.screen = ikariam.getClass(island.Screen, e.bgViewData);
                    break;
                case "city":
                    this.screen = ikariam.getClass(city.Screen, e.bgViewData)
            } // init friends menu on the right side (in any case)
            if (this.friendsMenu = ikariam.getClass(backgroundmenu.SideMenu, {
                    type: "friends",
                    id: "js_viewFriends",
                    owncity: !1
                }), ikariam.model.hasAlly && (this.chatMenu = ikariam.getClass(backgroundmenu.SideMenu, {
                    type: "chat",
                    id: "js_viewChat",
                    owncity: !1
                })), "city" === this.id && (this.cityMenu = ikariam.getClass(backgroundmenu.SideMenu, {
                    type: "city",
                    id: "js_viewCityMenu",
                    owncity: ikariam.getModel().isOwnCity
                }), this.updateCurrentCityLeftMenu(e.bgViewData.cityLeftMenu)), touchVersion) {
                var o = function t(e) {
                    var o = $(e),
                        n = $(e + " ul");
                    $("#bottomBarWrapper").hasClass("opend") ? n.hasClass("hidden") ? ($("#GF_toolbar>ul").addClass("hidden"), $("#leftMenu ul").addClass("hidden"), $("#rightMenu ul").addClass("hidden"), $("#GF_toolbar").removeClass("active"), $("#leftMenu").removeClass("active"), $("#rightMenu").removeClass("active"), n.removeClass("hidden"), o.addClass("active")) : ($("#bottomBarWrapper").removeClass("opend"), n.addClass("hidden"), o.removeClass("active"), $("#footer").removeClass("opend")) : ($("#bottomBarWrapper").addClass("opend"), n.removeClass("hidden"), o.addClass("active"), $("#footer").addClass("opend"))
                };
                link = $("#rightMenu .friends .slot a"), title = $(link).attr("title"), link.text(title), $("#toggleBuildingInfos").on("click", function() {
                    ajaxHandlerCall("?view=noViewChange&action=Options&function=toggleCityBuildingNameOption")
                }), $("#GF_toolbar>ul").addClass("hidden"), $("#leftMenu ul").addClass("hidden"), $("#rightMenu").hasClass("active") || $("#rightMenu ul").addClass("hidden"), $("#GF_toolbar").on("click", function() {
                    o("#GF_toolbar")
                }), $("#leftMenu").on("click", function() {
                    o("#leftMenu")
                }), $("#rightMenu").on("click", function() {
                    o("#rightMenu")
                })
            }
            return this
        },
        updateCurrentCityLeftMenu: function o(e, t) {
            "city" != this.id || (this.cityMenu.update(e, t), closeSidebarRow($("#leftMenu"), !0))
        },
        updateFriendsList: function t(e) {
            var e = JSON.parse(e),
                o = this.friendsMenu,
                n = o.paginator,
                r = n.getItems(),
                s = {
                    1: "online",
                    2: "idle",
                    3: "inactive",
                    4: "idle" //Actually vacation but no icon for that
                };
            for (var l in r) {
                var d = r[l],
                    c = +l + 1,
                    u = $(d);
                if ("function" != typeof d)
                    if (c in e) {
                        var p = u.find(".name a").text();
                        if (e[c].name != p) {
                            if ("" == p || "undefined" == typeof p) {
                                var m = 5 < l ? l - 6 : l;
                                u.find(".image").remove(), u.attr("class", "expandable slot" + m), u.append("<div class=\"image\"></div><div class=\"name\"><a></a></div><div class=\"activity\"></div>"), o.slots.push(o.createSingleSlot(u))
                            }
                            var g = "",
                                h = "image";
                            1 == e[c].gender && (g = "female"), 1 == e[c].newPlayer && (h = "imageNew"), u.find(".image").attr("class", g + " " + h), u.find(".imageNew").attr("class", g + " " + h), u.find(".name a").html(e[c].name), u.find(".name a").attr("href", "?view=island&playerId=" + e[c].friendId), u.find(".clan, .sendmsg, .delmsg").remove(), 0 < e[c].ally_id && u.append("<div class=\"clan\"><a onclick=\"ajaxHandlerCall(this.href);return false;\" href=\"?view=allyPage&allyId=" + e[c].ally_id + "\">" + e[c].ally_tag + "</a></div>"), u.append("<a onclick=\"ajaxHandlerCall(this.href);return false;\" title=\"" + LocalizationStrings.friends.send_msg + "\" href=\"?view=sendIKMessage&receiverId=" + e[c].friendId + "&closeView=1\" class=\"sendmsg\"><span class=\"accesshint\">" + LocalizationStrings.friends.send_msg + "</span></a>"), u.append("<a onclick=\"ajaxHandlerCall(this.href);return false;\" title=\"" + LocalizationStrings.friends.kick_msg + "\" href=\"?view=sendIKMessage&msgType=104&receiverId=" + e[c].friendId + "&closeView=1\" class=\"delmsg\"><span class=\"accesshint\">" + LocalizationStrings.friends.kick_msg + "</span></a>")
                        }
                        u.find(".activity").attr("class", "activity " + s[e[c].activity_state]), 4 != e[c].activity_state && u.find(".vacation-state").remove(), n.setItem(l, u[0]), (!0 === o.state.expanded || "true" === o.state.expanded) && o.expand(u, 1)
                    } else if ("slot" != $(d).attr("class").split(/\s+/)[0]) {
                    var m = 5 < l ? l - 6 : l;
                    u.attr("class", "slot slot" + m), u.find(".name, .clan, .activity, .sendmsg, .delmsg, .image").remove(), u.append("<a onclick=\"ajaxHandlerCall(this.href);return false;\" title=\"" + LocalizationStrings.friends.edit_title + "\" href=\"?view=friendListEdit\" class=\"image\"></a>"), u.off("mouseenter"), u.off("mouseleave"), n.setItem(l, u[0]), o.contract(u, 1), o.makeSlots()
                }
            }
        },
        updateCurrentCityMenu: function t(e) {
            console.log("ikariam.BackgroundView: updateCurrentCityMenu. the following values have changed and will be updated:"); // console.dir(changed);
            for (var o = e.length, n = 0; n < o; n++) { // get new value from data model
                var r = "",
                    s = "",
                    l;
                if (e[n] instanceof Object) {
                    var d = e[n][1];
                    switch (e[n][0]) {
                        case "currentResources":
                            r = "res", s = "";
                            break;
                        case "maxResources":
                            r = "maxRes", s = "max_";
                            break;
                        case "branchOfficeResources":
                            r = "branchRes", s = "branchOffice_";
                            break;
                        case "maxResourcesWithModifier": // this is only in this list as the ikariam model data needs to get updated, will be used by
                            // maxResources below. we need to stop it here to not overwrite the wrong data.
                            continue
                    }
                    l = ikariam.model[e[n][0]][d]
                } else {
                    var d = e[n],
                        c = "";
                    l = ikariam.model[d]
                } // get target element in dom
                var u = $("#js_GlobalMenu_" + d);
                if (1 > u.length) {
                    if (u = $("#js_GlobalMenu_" + s + ikariam.model.getResourceName(d)), 1 > u.length) continue; // random curses: this always selects the resource type, regardless of changed[i][0]!
                    var p = d;
                    d = r
                } // update target element with new values (+ roundings, localization adjustments)
                switch (d) {
                    case "ambrosia":
                        touchVersion && u.html("Shop (" + ikariam.model.locaNumberFormat(l) + ")"), u.attr("title", ikariam.model.shortenValue(l, 15) + " " + LocalizationStrings.ambrosia), $("#headlineAmbrosia").html(ikariam.model.locaNumberFormat(l));
                        break;
                    case "gold":
                        u.html(ikariam.model.shortenValue(l, 6)), $("#" + u[0].id + "_Total").html(ikariam.model.shortenValue(l, 15));
                        break;
                    case "citizens":
                        u.html(ikariam.model.shortenValue(l, 4));
                        break;
                    case "population":
                        u.html(ikariam.model.shortenValue(l, 4));
                        break;
                    case "tradegoodProduction":
                        u.html(ikariam.model.shortenValue(l * ikariam.model.realHour, 15));
                        break;
                    case "resourceProduction":
                        u.html(ikariam.model.shortenValue(l * ikariam.model.realHour, 15));
                        break;
                    case "maxRes":
                        var m = ikariam.model.currentResources[p] / ikariam.model.maxResourcesWithModifier[p],
                            g = $("#js_GlobalMenu_" + ikariam.model.getResourceName(p));
                        1 <= m ? g.addClass("storage_full") : (g.removeClass("storage_full"), .75 <= m ? g.addClass("storage_danger") : g.removeClass("storage_danger")), u.html(ikariam.model.shortenValue(l, 15));
                        break;
                    case "branchRes":
                        u.html(ikariam.model.shortenValue(l, 15));
                        break;
                    case "res":
                        var h = l / ikariam.model.maxResources[p]; // if storage is full or "almost" full: add warning classes. value will appear red or red-bold.
                        1 <= h ? u.addClass("storage_full") : (u.removeClass("storage_full"), .75 <= h ? u.addClass("storage_danger") : u.removeClass("storage_danger")), u.html(ikariam.model.shortenValue(l, 6)), $("#" + u[0].id + "_Total").html(ikariam.model.shortenValue(l, 15));
                        break;
                    case "upkeep":
                    case "income":
                    case "scientistsUpkeep":
                    case "badTaxAccountant":
                    case "godGoldResult":
                        var b = Math.floor(ikariam.model.income + ikariam.model.badTaxAccountant + ikariam.model.upkeep + ikariam.model.scientistsUpkeep + ikariam.model.godGoldResult),
                            v = "bold green rightText",
                            x = "bold green rightText";
                        0 > b && (v = "bold red rightText"), 0 > l && (x = "bold red rightText"), $("#js_GlobalMenu_gold_Calculation").html(ikariam.model.shortenValue(b, 15)).attr("class", v), l = ikariam.model.shortenValue(Math.ceil(l), 15), "badTaxAccountant" === d && (l = "+" + l), $(u).html(l).attr("class", x);
                        break;
                    default:
                        u.html(l)
                }
            } // check and update action request
            var C = $("#js_ChangeCityActionRequest").val();
            C !== ikariam.model.actionRequest && $("#js_ChangeCityActionRequest").val(ikariam.model.actionRequest)
        },
        updateGlobalAdvisors: function e() {
            console.log("ikariam.backgroundView: updateGlobalAdvisors with data:"); // console.log(ikariam.model.advisorData);
            var t = ikariam.model.advisorData;
            for (var o in this.premiumActive = t.hasPremiumAccount, t)
                if (t.hasOwnProperty(o) && "hasPremiumAccount" !== o) {
                    var n = t[o];
                    $("#js_GlobalMenu_" + o).attr({
                        class: n.cssclass,
                        href: n.link
                    }).next().attr({
                        class: "plus_button " + (this.premiumActive ? "pluslink" : "plusteaser"),
                        href: n.premiumlink
                    })
                }
        },
        updateCityDropdownMenu: function e() {
            console.log("ikariam.backgroundView: updateCityDropdownMenu with data:"); // console.log(ikariam.model.relatedCityData);
            var t = ikariam.model.relatedCityData,
                o = t.length,
                n = $("<select></select>");
            for (var r in t)
                if (t.hasOwnProperty(r) && "additionalInfo" !== r && "selectedCity" !== r) {
                    var s = $("<option></option>");
                    void 0 !== t[r].relationship && s.addClass(t[r].relationship), "cityCoords" === t.additionalInfo ? (s.addClass("coords"), void 0 !== t[r].tradegood && s.attr("title", LocalizationStrings.tradegood + ": " + LocalizationStrings[ikariam.model.getResourceName(t[r].tradegood)])) : "tg" === t.additionalInfo && (void 0 !== t[r].tradegood && s.addClass("tradegood " + ikariam.model.getResourceName(t[r].tradegood)), s.attr("title", t[r].koords)), s.html("cityCoords" === t.additionalInfo ? t[r].coords + " " + t[r].name : t[r].name), s.val(t[r].id), t.selectedCity === r && s.attr("selected", "selected"), n.append(s)
                } var l = function t(e) {
                $("#js_cityIdOnChange").val(e), ikariam.closePopup(), ajaxHandlerCallFromForm($("#changeCityForm")[0])
            };
            if ($("#dropDown_js_citySelectContainer").css("display") === void 0 || "none" === $("#dropDown_js_citySelectContainer").css("display")) var d = !0;
            else var d = !1;
            $("#js_citySelectContainer").dropdown("remove").append(n).dropdown({
                onChange: l,
                removeSelect: !0,
                languageDirection: ikariam.model.languageDirection
            }), !1 === d
        }
    }, ikariam.TemplateView = {
        mainbox: null,
        sidebar: null,
        id: null,
        mainboxPositionReset: !0,
        sidebarPositionReset: !0,
        mainboxUserPosition: [0, 0, 0],
        sidebarUserPosition: null,
        keepSidebars: !1,
        script: null,
        styles: [],
        viewScripts: {},
        init: function t(e) {
            console.log("INIT ikariam.TemplateView with dataSet:"); // console.log(dataSet);
            // is it the same template view as before?
            var o = null === this.mainbox || this.id !== e.boxId || null === e.contentElem || "diplomacyAlly" === this.id || "militaryAdvisor" === this.id,
                n = void 0 === e.keepSidebars || !e.keepSidebars; // keep or destroy sidebar elements from previous view?
            return void 0 === e.boxId ? null !== this.mainbox && this.destroyTemplateView(n) : (this.id = e.boxId, this.keepSidebars = e.keepSidebars, this.createMainBox(e, o ? e.boxId : null)), n && this.createSidebar(e.sidebarEls, this.id), null !== this.mainbox && this.mainboxPositionReset && (this.mainbox.adjustPosition(), this.mainboxPositionReset = !1), null !== this.sidebar && this.sidebarPositionReset && (this.sidebar.adjustPosition(), this.sidebarPositionReset = !1), null === this.mainbox || null === this.sidebar || this.mainbox.oversized || this.mainbox.minisized ? (null !== this.mainbox && $(this.mainbox.boxRoot).removeData("focusAlsoSelector"), null !== this.sidebar && $(this.sidebar.boxRoot).removeData("focusAlsoSelector")) : ($(this.mainbox.boxRoot).data("focusAlsoSelector", "#sidebar"), $(this.sidebar.boxRoot).data("#" + this.mainbox.id)), null === this.mainbox ? null !== this.sidebar.boxRoot && $(this.sidebar.boxRoot).trigger("focusElement") : $(this.mainbox.boxRoot).trigger("focusElement"), "" != e.viewScriptUrl && this.loadViewScript(e.boxId, e.viewScriptUrl, e.viewScriptParams), ikariam.controller.adjustSizes(), "" !== e.scrollToElement && null !== this.mainbox && this.mainbox.scrollToElement("#" + e.scrollToElement), this
        },
        createMainBox: function o(e, t) {
            console.log("ikariam.TemplateView: createMainBox");
            var n = ikariam.model.maincontentboxes;
            if (null !== t) {
                if (null !== this.mainbox)
                    if (!this.mainbox.replaceBox) {
                        for (var r = n.length, s = 0; s < r; s++) // stored template view has the same id as new one: just replace it.
                            if (n[s].id === this.id) {
                                this.mainbox.replaceBox = !0;
                                break
                            } // destroy old template view
                    } else this.mainbox.replaceBox && (this.destroyTemplateView(e.destroySidebars), this.id = t); // do not create box without any content
                if (null === e.contentElem) return; // ..and create new mainbox object
                // set custom box position
                if (this.mainbox = ikariam.getClass(ikariam.MainBox, e), touchVersion || (this.mainbox.scrollbar = ikariam.getClass(ikariam.Scrollbar, this)), n.push(this.mainbox), 0 != ikariam.mainbox_x || 0 != ikariam.mainbox_y || 0 != ikariam.mainbox_z) {
                    var l = ikariam.mainbox_x + "px",
                        d = "auto";
                    this.setPositionByCoords(l, d, ikariam.mainbox_z + "px"), this.mainboxPositionReset = !1
                } else this.setPositionByCoords(this.mainboxUserPosition[0], this.mainboxUserPosition[1], this.mainboxUserPosition[2])
            } else this.mainbox && // island-view: sidebars without mainboxes possible
                // no view id was given: do not create a new box, but update the content of the existing one.
                this.mainbox.updateContent(e.contentElem); // mobile version only: add event listeners for scrolling up and down with touch events.
            touchVersion && this.mainbox && this.mainbox.addGestureEvents()
        },
        createSidebar: function o(e, t) {
            console.log("ikariam.TemplateView: createSidebar");
            var n = ikariam.model.sidebars,
                r = n.length,
                s = $("#sidebar");
            if (0 < s.length && (s.css("opacity", "1"), null === e || 0 === e.length)) // if sidebar was minimized before
            {
                if (null !== n && 0 < r) {
                    s.children().remove();
                    for (var l = 0; l < r; l++) n.splice(l, 1)
                }
                return
            }
            if (0 !== e.length)
                if (this.sidebar = ikariam.getClass(ikariam.Sidebar, {
                        content: e,
                        boxId: t
                    }), n.push(this.sidebar), 0 != ikariam.sidebar_x || 0 != ikariam.sidebar_y || 0 != ikariam.sidebar_z) {
                    if (isNaN(ikariam.sidebar_x)) var d = "auto";
                    else var d = ikariam.sidebar_x + "px";
                    if (isNaN(ikariam.sidebar_y)) var c = "auto";
                    else var c = ikariam.sidebar_y + "px";
                    this.setSidebarPositionByCoords(d, c, ikariam.sidebar_z + "px"), this.sidebarPositionReset = !1
                } else null !== this.sidebarUserPosition && this.setSidebarPositionByCoords(this.sidebarUserPosition[0], this.sidebarUserPosition[1], this.sidebarUserPosition[2])
        },
        destroyTemplateView: function t(e) {
            console.log("ikariam.TemplateView: destroyTemplateView"), ikariam.controller.clearOverlayContainers(), null !== this.mainbox && (ikariam.closePopup(), this.mainboxUserPosition = [this.mainbox.boxRoot.style.left, this.mainbox.boxRoot.style.right, this.mainbox.boxRoot.style.top], touchVersion && this.mainbox.removeGestureEvents());
            var o = ikariam.model.maincontentboxes,
                n = o.length;
            null !== this.sidebar && void 0 !== this.sidebar && (this.sidebarUserPosition = [this.sidebar.boxRoot[0].style.left, this.sidebar.boxRoot[0].style.right, this.sidebar.boxRoot[0].style.top]);
            for (var r = 0; r < n; r++) $(o[r].boxRoot).find(".select_container").dropdown("remove").end().remove(), o.splice(r, 1);
            if (e && this.destroySidebars(), null !== this.mainbox && (this.mainbox = null), this.id = null, null != this.script) {
                var s = doc.getElementsByTagName("script"),
                    l = s[0].parentNode,
                    d = this.script.filepath;
                for (r = 0; r < s.length; r++)
                    if (-1 != s[r].src.indexOf(d)) var c = l.removeChild(s[r]);
                this.script = null
            }
        },
        destroySidebars: function e() {
            var t = $("#sidebar");
            if (0 < t.length) {
                var o = ikariam.model.sidebars,
                    n = o.length;
                t.children().remove();
                for (var r = 0; r < n; r++) o.splice(r, 1); // city background: create construction list sidebar, if activated
                "city" === ikariam.backgroundView.id && 0 < ikariam.getScreen().constructionListState && ajaxHandlerCall("?view=buildingConstructionList&cityId=" + ikariam.getScreen().screenId)
            }
        },
        setPosition: function t(e) {
            console.log("ikariam.TemplateView: setPosition"), $(this.mainbox.boxRoot).css({
                left: e.boxRoot.style.left,
                right: e.boxRoot.style.right,
                top: e.boxRoot.style.top
            })
        },
        setPositionByCoords: function n(e, t, o) {
            console.log("ikariam.TemplateView: setPositionByCoords"), $(this.mainbox.boxRoot).css({
                left: e,
                top: o,
                right: t
            })
        },
        setSidebarPositionByCoords: function n(e, t, o) {
            console.log("ikariam.TemplateView: setSidebarPositionByCoords"), this.sidebar.boxRoot.css({
                left: e,
                top: o
            })
        },
        loadTemplateScript: function o(e, t) {
            console.log("---------------- loadTemplateScript -----------------------"), this.script = {
                filepath: e,
                params: t
            }, $.ajax({
                url: e,
                dataType: "script",
                cache: !0,
                success: function n(e, t, o) {
                    console.log("==========================> loadTemplateScript callback ajax success")
                },
                error: function n(e, t, o) {
                    console.log("==========================> loadTemplateScript callback ajax fail")
                }
            })
        },
        loadViewScript: function n(e, t, o) {
            if (console.log("---------------- loadViewScript " + t + "-----------------------"), this.viewScripts.hasOwnProperty(e)) this.viewScripts[e].create(o), this.viewScripts[e].update(o);
            else {
                var r = this;
                $.ajax({
                    url: t,
                    dataType: "script",
                    cache: !0,
                    success: function l(t, n, s) {
                        console.log("==========================> loadViewScript callback ajax success"), r.viewScripts[e].create(o), r.viewScripts[e].update(o)
                    },
                    error: function n(e, t, o) {
                        console.log("==========================> loadViewScript callback ajax fail")
                    }
                })
            }
        },
        triggerViewScriptUpdate: function t(e) {
            this.id && this.viewScripts.hasOwnProperty(this.id) && this.viewScripts[this.id].update(e)
        },
        loadTemplateCSS: function t(e) {
            for (console.log("---------------- loadTemplateCSS " + e + "-----------------------"), i = 0; i < this.styles.length; i++)
                if (this.styles[i] == e) return void console.log("schon vorhanden, nix machen!");
            var o = $("head"),
                n = document.createElement("link");
            n.type = "text/css", n.rel = "stylesheet", n.href = e, n.media = "screen", o.append(n), this.styles.push(e)
        }
    }, ikariam.MainBox = {
        id: null,
        headline: "",
        contentEls: null,
        replaceBox: !0,
        oversized: !1,
        zShopSized: !1,
        minisized: !1,
        scrollbar: null,
        boxRoot: null,
        boxScrollContainer: null,
        boxMainContent: null,
        init: function t(e) {
            console.log("INIT ikariam.MainBox with dataSet:"); // console.log(dataSet);
            var o = this;
            this.id = e.boxId, this.headline = e.headerElem, this.contentEls = e.contentElem, (this.oversized !== e.oversized || this.zShopSized != e.zShopSized) && null !== ikariam.templateView && (ikariam.templateView.mainboxPositionReset = !0), this.oversized = e.oversized, this.minisized = e.minisized, this.zShopSized = e.zShopSized, this.replaceBox = e.replaceBox;
            var n = 1200 < $(window).width() ? "mainContentBoxZShopBig" : "mainContentBoxZShopSmall"; // create root container (oversized or default with)
            this.boxRoot = createEl("div", this.id, "mainContentBox contentBox01h toggleMenu" + (this.oversized ? " mainContentBox900" : "") + (this.minisized ? " mainContentBox500" : "") + (this.zShopSized ? " " + n : "")); // create header container with attached drag events and headline.
            var r = createEl("div", null, "hd header mainHeader draggable", null, null, null, this.boxRoot);
            $(r).on("mousedown", function(t) {
                $(this).addClass("mousedown"), touchVersion || o.drag(t, o.boxRoot.id)
            }).on("mouseup", function(t) {
                $(this).removeClass("mousedown")
            }), createEl("h3", "js_mainBoxHeaderTitle", null, null, this.headline, null, r), this.boxScrollContainer = createEl("div", null, "bd mainContentScroll", null, null, null, this.boxRoot), createEl("div", null, "ft footer", null, null, null, this.boxRoot), touchVersion || createEl("div", "js_backlinkButton", "back invisible", null, null, null, r), createEl("div", null, "close", null, null, {
                click: function e() {
                    ikariam.destroyCurrentView(), ikariam.controller.resetSliders()
                }
            }, r), this.boxMainContent = createEl("div", null, "mainContent minimizableContent", null, ikariam.model.mmoSetBannerDeviceOS() + this.contentEls, null, this.boxScrollContainer), $("#container")[0].appendChild(this.boxRoot);
            var s = createEl("div", o.boxRoot.id + "_c", "", null, null, null, null),
                l = this.boxRoot.parentNode; // als wrap funktion auslagern
            // fix issue where the whole page scrolls, when the mainbox scroller reaches it's end
            if (l.insertBefore(s, this.boxRoot), s.appendChild(this.boxRoot), this.boxRoot = s, touchVersion && ($(this.boxRoot), createEl("div", "js_backlinkButton", "back invisible", null, null, null, r)), touchVersion ? ($(r).removeClass("draggable"), $(s).addClass("touchPanel"), $(this.boxScrollContainer).scroll(function(t) {
                    ikariam.getController().clearOverlayContainers()
                })) : $(this.boxRoot).on("mouseup", ikariam.controller.dragStop), $(this.boxRoot).addClass("templateView focusable"), touchVersion) {
                $(".mainContentBox").bind("touchmove", function(t) {
                    t.stopPropagation()
                }); // remember initial event pos, to calc the direction later on
                //                  var scrollDiv = this.boxScrollContainer;
                //                  scrollDiv.addEventListener('touchstart', function(event){
                //
                //                      var pageY = event.touches[0].pageY;
                //                      $(scrollDiv).data('touchstartY', pageY);
                //
                //                  }, false);
                // use scrollfix for ios
                var d = $(this.boxScrollContainer).get(0);
                new ScrollFix(d)
            }
            return this
        },
        updateContent: function t(e) {
            console.log("ikariam.MainBox: updateContent"), this.contentEls = e, $(this.boxMainContent).children().remove().end() // Es muss an dieser Stelle innerHTML verwendet werden, da .html()/.append() enthaltene Script-Tags ausfÃ¼hrt
            [0].innerHTML = ikariam.getModel().mmoSetBannerDeviceOS(ikariam.getModel().ingameAd, ikariam.getModel().mmoDetectDeviceOS()) + this.contentEls
        },
        drag: function o(t, e) {
            console.log("ikariam.MainBox: drag"), t.preventDefault(), $(this.boxRoot).css("z-index", parseInt($(this.boxRoot).css("z-index")) + 1);
            for (var n = ikariam.model.maincontentboxes, r = n.length, s = 0; s < r; s++) n[s].id !== this.id && $(n[s].boxRoot).css("z-index", 100);
            ikariam.getController().clearOverlayContainers(), dragStart(t, e)
        },
        adjustPosition: function e() {
            if (console.log("ikariam.MainBox: adjustPosition"), this.replaceBox && 0 !== this.boxMainContent.offsetHeight) {
                var t = "rtl" === ikariam.getModel().languageDirection ? "left" : "right";
                $(this.boxRoot).css(ikariam.model.sideAttr, "auto").css(t, ikariam.boxOffsetRight + this.boxMainContent.offsetWidth + "px").css("top", "5px")
            }
        },
        adjustSize: function e() {
            var t = Math.max,
                o = Math.min,
                n = this.boxMainContent.offsetHeight;
            if (0 !== n) {
                var r = o($(window).height() - ikariam.boxMarginBottom - $(this.boxScrollContainer).offset().top, n);
                r = t(350, r), $(this.boxScrollContainer).css("height", r + "px"), this.scrollbar && (this.scrollbar.adjustSize(), this.scrollbar.addEvents()), console.log("ikariam.MainBox: adjustSize ...height=" + r)
            }
        },
        getBottomOffset: function t(e) {
            var o = this.boxScrollContainer.offsetHeight - this.getTopOffset(e);
            return o
        },
        getTopOffset: function t(e) {
            for (var o = e.offsetTop, n = e.offsetParent; n !== void 0 && n !== this.boxMainContent;) {
                if (null === n) return 0; // element is outside the main box
                o += n.offsetTop, n = n.offsetParent
            }
            if (null !== this.scrollbar && 0 < this.scrollbar.getScrollPos()) {
                var r = this.scrollbar.getScrollPos(),
                    s = this.boxScrollContainer.offsetHeight - this.boxMainContent.offsetHeight,
                    l = parseInt(0 - r * s / this.scrollbar.scrollDist);
                o -= l
            }
            return o
        },
        addGestureEvents: function e() {},
        removeGestureEvents: function e() {},
        scrollToElement: function t(e) {
            var o = $(e);
            if (0 < o.length) {
                var n = o.position();
                if (touchVersion) {
                    var r = -this.boxMainContent.offsetHeight + this.boxScrollContainer.offsetHeight,
                        s = Math.max(-n.top, r) + $(this.boxScrollContainer).scrollTop();
                    this.boxMainContent.style.top = s + "px"
                } else this.scrollbar.scrollToY(n.top)
            }
        }
    }, ikariam.Sidebar = {
        sidebarEls: null,
        sidebarWidget: null,
        boxRoot: null,
        init: function t(e) {
            console.log("INIT ikariam.Sidebar with data:"), console.log(e);
            var o = this;
            this.sidebarEls = e.content;
            var n = e.boxId,
                r = "";
            n && (r = " sidebar_" + n), this.sidebarWidget = $("<ul id=\"sidebarWidget\"></ul>"); // for each tab, get headline and content html
            for (var s = this.sidebarEls.length, l = 0; l < s; l++)
                if (!$(this.sidebarEls[l]).hasClass("hover")) { // happens while creating sidebars from cityinfos/-actions in the island view
                    // since they are stored as invisible dom tables and attached to the city images,
                    // which is utterly devastating ^^ @todo refactoring!
                    var d = $(this.sidebarEls[l]).find("h3"),
                        c = $(this.sidebarEls[l]).find("div.content");
                    if (1 > d.length || 1 > c.length) return void console.log("ikariam.Sidebar.init ERROR: could not create sidebar - html structure in tpl is invalid."); // create dom containers and fill with data
                    var u = $("<li>").addClass("accordionItem").appendTo(this.sidebarWidget),
                        p = $("<a>").addClass("accordionTitle active").html(d.html()).appendTo(u);
                    $(this.sidebarEls[l]).hasClass("firstOpen") && p.addClass("firstOpen");
                    var m = $("<div>").addClass("accordionContent" + r).appendTo(u);
                    $("<span>").addClass("indicator").on("click", function(t) {
                        touchVersion && !$(this).parent().hasClass("active") && ($(".accordionContent").slideUp(500), $(".accordionTitle").removeClass("active")), $(this).parent().toggleClass("active"), $(this).parent().next().slideToggle(500, function() {
                            touchVersion && o.adjustSize(!1)
                        })
                    }).on("mousedown", function(t) {
                        t.stopPropagation()
                    }).appendTo(p);
                    var g = "" === this.sidebarEls[l].id ? null : this.sidebarEls[l].id,
                        h = $(this.sidebarEls[l]).hasClass("invisible") ? null : this.sidebarEls[l].className;
                    $("<div>").attr("id", g).addClass(h).html(c.html()).appendTo(m)
                } // get sidebar container in DOM (create, if not existing, clear else.)
            // append widget container to sidebar root element in dom
            this.boxRoot = $("#sidebar"), 1 > this.boxRoot.length ? this.boxRoot = $("<div id=\"sidebar\" class=\"focusable\">").appendTo("#container") : this.boxRoot.html(""), this.boxRoot.append(this.sidebarWidget), this.adjustSize(!0), touchVersion || ($(".accordionTitle").on("mousedown", function(t) {
                $(this).addClass("mousedown"), o.drag(t, o.sidebarWidget.parent()[0].id)
            }).on("mouseup", function() {
                $(this).removeClass("mousedown")
            }), this.boxRoot.on("mouseup", ikariam.controller.dragStop)), "undefined" != typeof this.sidebarEls[0].id && "buildingUpgrade" === this.sidebarEls[0].id && fixCostsDisplay()
        },
        adjustSize: function t(e) {
            console.log("ikariam.Sidebar: adjustSize");
            var o = this.boxRoot.find(".accordionItem").slideDown(0),
                n = o.length,
                r = $(window).height() - this.boxRoot.offset().top;
            if (e && (this.overflowPanelIndex = n - 1, this.boxRoot.css({
                    display: "",
                    "z-index": 65111
                })), !touchVersion) // we calculate how many tabs can be expanded, dependant on screen resolution, and open them.
                // set new index on first overflow
                for (var s = 0, l = !1, d = 0; d < n; d++) s += o[d].offsetHeight, l = !!$(o[d]).has("ul.cityactions").length, s > r && 0 < d && !1 == l && ($(o[d]).children(".accordionTitle").removeClass("active"), $(o[d]).children(".accordionContent").slideUp(0));
            else if (e) {
                var c = o.length * $(".accordionTitle").outerHeight();
                o.each(function() {
                    var e = $(this).children(".accordionContent"),
                        t = c + e.outerHeight() - r;
                    0 < t && e.css("height", e.height() - t + "px")
                });
                var u = $(".accordionTitle.firstOpen").parent();
                1 > u.length && (u = o.first()), o.not(u).not(":has(ul.cityactions)").children(".accordionTitle").removeClass("active").end().children(".accordionContent").slideUp(0)
            }
        },
        adjustPosition: function e() {
            console.log("ikariam.Sidebar: adjustPosition");
            var t = Math.max(doc.body.offsetWidth, ikariam.minResolutionX) - this.boxRoot.width(),
                o = "rtl" === ikariam.getModel().languageDirection ? "left" : "right";
            this.boxRoot.css(o, "auto"), this.boxRoot.css(ikariam.model.sideAttr, ikariam.boxOffsetLeft + "px"), this.boxRoot.css("top", ikariam.boxOffsetTop + "px")
        },
        drag: function o(t, e) {
            console.log("ikariam.Sidebar: drag"), this.boxRoot.css("z-index", "+=1");
            for (var n = ikariam.model.sidebars, r = n.length, s = 0; s < r; s++) n[s].id !== this.id && $(n[s].boxRoot).css("z-index", 100);
            dragStart(t, e)
        }
    }, ikariam.MapNavigation = {
        backgroundViewId: "",
        expanded: !0,
        animating: !1,
        startDragX: 0,
        startDragY: 0,
        moveStepX: 0,
        moveStepY: 0,
        posX: 0,
        posY: 0,
        scrollStartTime: 0,
        lastDiffX: 0,
        lastDiffY: 0,
        dx: 0,
        dy: 0,
        init: function t(e) {
            return console.log("INIT ikariam.MapNavigation with dataSet:"), this.backgroundViewId = e.id, this.expanded = e.expanded, this.resetCoords(), this.setupAnimations(), this
        },
        resetCoords: function e() {
            console.log("ikariam.MapNavigation: resetCoords"), this.startDragY = 0, this.startDragX = 0, this.posX = 0, this.posY = 0, this.lastDiffX = 0, this.lastDiffY = 0;
            var t = ikariam.getController();
            null !== t && (t.action = "", this.posX = parseInt($(t.scrollDiv).css(ikariam.model.sideAttr), 10), this.posY = parseInt($(t.scrollDiv).css("top"), 10)), this.moveStepX = "worldmap_iso" === this.backgroundViewId ? ikariam.tileWidth : 120, this.moveStepY = "worldmap_iso" === this.backgroundViewId ? ikariam.tileHeight : 120
        },
        setupAnimations: function e() {
            this.expanded || ($("#mapControls").css("top", "2px"), $("#mapCoordInput").css("top", "6px"), $("#mapShortcutInput").css("top", "9px")), this.animateControls()
        },
        moveMap: function o(e, t) {
            if (console.log("ikariam.MapNavigation: moveMap(" + e + "," + t + ")"), !!mapIsClicked) {
                var n = ikariam.getController();
                "rtl" === ikariam.model.languageDirection && (e *= -1), this.posX = parseInt($(n.scrollDiv).css(ikariam.model.sideAttr), 10), this.posY = parseInt($(n.scrollDiv).css("top"), 10);
                var r = e,
                    s = t;
                "" === n.action && (e && t && (e /= 2, t /= 2), e ? (this.startMovePosX = this.posX, this.targetMovePosX = this.posX - this.moveStepX * e) : (this.startMovePosX = this.posX, this.targetMovePosX = this.posX), t ? (this.startMovePosY = this.posY, this.targetMovePosY = this.posY - this.moveStepY * t) : (this.startMovePosY = this.posY, this.targetMovePosY = this.posY), ikariam.getController().action = "move", this.moveInterval()), setTimeout("ikariam.getMapNavigation().moveMap(" + r + ", " + s + ")", 100)
            }
        },
        moveInterval: function e() {
            var t = Math.round,
                o = Math.abs;
            console.log("ikariam.MapNavigation: moveInterval");
            var n = ikariam.getMapNavigation(),
                r = 0; // time difference since dragstart
            // re-drag
            if (n.scrollStartTime ? r = new Date().getTime() - n.scrollStartTime : n.scrollStartTime = new Date().getTime(), n.posX = n.startMovePosX + (n.targetMovePosX - n.startMovePosX) * (r / 200), n.posY = n.startMovePosY + (n.targetMovePosY - n.startMovePosY) * (r / 200), n.setPosition(), 200 > r) setTimeout(n.moveInterval, 100); // init dragging
            else // worldmap only:
                if (n.scrollStartTime = 0, ikariam.getController().action = "", n.posX = n.startMovePosX + (n.targetMovePosX - n.startMovePosX), n.posY = n.startMovePosY + (n.targetMovePosY - n.startMovePosY), n.setPosition(), "worldmap_iso" === n.backgroundViewId) {
                    var s = ikariam.getScreen(),
                        l = t((n.targetMovePosX - n.startMovePosX) / 2 - (n.targetMovePosY - n.startMovePosY)) / 120,
                        d = t(n.targetMovePosY - n.startMovePosY + (n.targetMovePosX - n.startMovePosX) / 2) / 120; // draw border in x and y direction (one or two times) if required
                    s.drawBorder(0, l), 1 < o(l) && s.drawBorder(0, l), s.drawBorder(d, 0), 1 < o(d) && s.drawBorder(d, 0)
                }
        },
        setPosition: function e() {
            var t = Math.max,
                o = Math.min;
            console.log("ikariam.MapNavigation: setPosition");
            var n = this.posX,
                r = this.posY; // set scroll limits (island and city only)
            if ("worldmap_iso" !== this.backgroundViewId) {
                n = o(0, this.posX), r = o(0, this.posY);
                var s = $("#worldview")[0];
                n = t(n, s.offsetWidth - ikariam.maxResolutionX), r = t(r, s.offsetHeight - ikariam.maxResolutionY)
            }
            var l = ikariam.getController().scrollDiv;
            $(l).css(ikariam.model.sideAttr, n + "px"), $(l).css("top", r + "px")
        },
        resetPosition: function e() {
            console.log("ikariam.MapNavigation: resetPosition");
            var t = Math.max(doc.body.offsetWidth, ikariam.minResolutionX);
            this.posX = "rtl" === ikariam.model.languageDirection ? t : 0, this.posY = 0, this.setPosition()
        },
        jumpToCoord: function e() {
            console.log("ikariam.MapNavigation: jumpToCoord"); // get values from form input
            var t = doc.navInputForm.xcoord.value,
                o = doc.navInputForm.ycoord.value; // delegate to screen (jumping on island has other effects than jumping on worldmap...
            ikariam.getScreen().jumpToXY(t, o)
        },
        jumpToShortcut: function e() {
            console.log("ikariam.MapNavigation: jumpToShortcut");
            var t = doc.navShortcutForm.js_homeCitySelect.value,
                o = t.indexOf(":");
            if (-1 < o) { // parse coord (x,y) values from input
                var n = parseInt(t.substring(0, o), 10),
                    r = parseInt(t.substring(o + 1, t.length), 10),
                    s = ikariam.getScreen(); // delegate to screen (jumping on worldmap: via coordinates)
                s.jumpToXY(n, r), s.updateIslandInfo(s.islands[n][r], n, r)
            } // delegate to screen (jumping on island: via city id)
            else ikariam.getScreen().jumpToXY(t)
        },
        toggleControls: function e() {
            console.log("ikariam.MapNavigation: toggleControls");
            var t = ikariam.getMapNavigation(); // We can return if the controls still animating
            t.animating || (t.switchState(), t.animateControls())
        },
        switchState: function e() {
            console.log("ikariam.MapNavigation: switchState");
            var t = ikariam.getMapNavigation(),
                o = t.expanded ? 0 : 1;
            ajaxHandlerCall("?action=header&function=setNavigation&screen=" + t.backgroundViewId + "&state=" + o + "&storeSliders=1"), t.expanded = !t.expanded
        },
        animateControls: function e() {
            console.log("ikariam.MapNavigation: animateControls");
            var t = this;
            this.animating = !0, this.expanded ? ($("#mapControls").animate({
                top: "-90px"
            }, 1e3, "easeOutQuad", function() {
                $("#mapShortcutInput").css("z-index", "auto"), $("#js_toggleControlsOn").css("cursor", "default"), $(this).css("z-index", 1), $("#js_toggleControlsOn").off("click", this.toggleControls), t.animating = !1
            }), $("#mapCoordInput").animate({
                top: "-30px"
            }, 1e3, "easeOutQuad"), $("#mapShortcutInput").animate({
                top: "-30px"
            }, 1e3, "easeOutQuad")) : ($("#mapControls").animate({
                top: "2px"
            }, 1e3, "easeOutQuad", function() {
                t.animating = !1
            }).css("z-index", "auto"), $("#mapCoordInput").animate({
                top: "6px"
            }, 1e3, "easeOutQuad"), $("#mapShortcutInput").animate({
                top: "9px"
            }, 1e3, "easeOutQuad").css("z-index", 0), $("#js_toggleControlsOn").css("cursor", "pointer"), $("#js_toggleControlsOn").on("click", this.toggleControls))
        }
    }, ikariam.PopupController = {
        TYPE_BUBBLE: 1,
        TYPE_HEAVY: 2,
        allyChat: null,
        avatarNotes: null,
        boxRoot: null,
        init: function e() {},
        createPopup: function s(e, t, o, n, r) {
            console.log("ikariam.PopupController: createPopup '" + e + "', class '" + r + "'"), $("#popupMessage").html("");
            var l = ikariam.getPopupController();
            if (l.boxMainContent = createEl("div"), o instanceof Array && 0 < o.length) {
                var d = createEl("div", null, null, null, stripslashes(o[0], !0)),
                    c = createEl("div", null, "centerButton");
                if (2 < o.length) { // we have at least one button...
                    var u = createEl("a", "js_popupBtn1", "button", null, o[2]);
                    o[1] instanceof Array ? u.setAttribute("onmousedown", o[1][0]) : 0 < o[1].length ? (u.href = o[1], u.setAttribute("onmousedown", "ajaxHandlerCall(this.href);ikariam.getPopupController().closePopup(\"" + e + "\"); return false;")) : u.setAttribute("onmousedown", "ikariam.getPopupController().closePopup(\"" + e + "\"); return false;"), c.appendChild(u)
                }
                if (3 < o.length) { // we have 2 buttons...
                    var p = createEl("a", "js_popupBtn2", "button", null, o[3]);
                    o[1] instanceof Array && o[1][1] ? p.setAttribute("onmousedown", o[1][1]) : p.href = "javascript:ikariam.getPopupController().closePopup('" + e + "');", c.appendChild(p)
                }
                l.boxMainContent.appendChild(d), l.boxMainContent.appendChild(c)
            } else l.boxMainContent.innerHTML = o; // type 1: create feedback bubble tip (confirm message)
            if (n === ikariam.PopupController.TYPE_BUBBLE) return void ikariam.controller.tooltipController.bindBubbleTip(5, 12, l.boxMainContent.innerHTML, null, null); // default: YUI popup message. create dom elements..
            if (null != r) {
                var m = "popupMessage " + r;
                l.boxRoot = createEl("div", e, m)
            } else l.boxRoot = createEl("div", e, "popupMessage");
            var g = "";
            n === ikariam.PopupController.TYPE_HEAVY && (g = "modalBackground"), l.boxBackground = createEl("div", "popupBackground", g);
            var h = createEl("div", null, "hd header draggable", null, null, {
                    mousedown: function e(t) {
                        $(l).addClass("mousedown"), l.drag(t, l.boxRoot.id)
                    },
                    mouseup: function e() {
                        $(l).removeClass("mousedown")
                    } // add drag events on header
                }),
                b = createEl("div", null, "header headerLeft"),
                v = createEl("div", null, "header headerMiddle"),
                x = createEl("h3", null, null, null, t),
                C = createEl("div", null, "header headerRight"),
                y = createEl("div", null, "ft footer");
            $(l.boxMainContent).addClass("bd popupContent"), l.boxRoot.appendChild(h), l.boxRoot.appendChild(l.boxMainContent), l.boxRoot.appendChild(y), h.appendChild(b), h.appendChild(v), h.appendChild(C), v.appendChild(x); // append new popup root element to popup container in dom and adjust its position
            var _ = $("#popupMessage");
            return _.append(l.boxBackground).append(l.boxRoot), l.adjustPosition("popupMessage"), ikariam.controller.replaceElements(), setTimeout(function() {
                _.trigger("focusElement")
            }, 0), l.boxRoot
        },
        drag: function o(t, e) {
            console.log("ikariam.PopupController: drag"), $(this.boxRoot).css("z-index", "+=1");
            for (var n = ikariam.model.maincontentboxes, r = n.length, s = 0; s < r; s++) n[s].id !== this.id && $(n[s].boxRoot).css("z-index", 100);
            ikariam.getController().clearOverlayContainers(), dragStart(t, e)
        },
        closePopup: function t(e) { // if no id is given or id was not found: clear all popup messages
            console.log("ikariam.PopupController: closePopup " + e), e !== void 0 && null !== e && "popupMessage" !== e ? $("#" + e).remove() : $("#popupMessage").children().remove(), ikariam.getController().clearOverlayContainers()
        },
        show: function o(e, t) {
            console.log("ikariam.PopupController: show");
            var n = ikariam.getPopupController(),
                r = $("#" + e);
            if (!(1 > r.length)) {
                switch (e) {
                    case "popupMessage":
                        return null === t || "" === t ? void this.closePopup() : void ajaxHandlerCall("?view=" + e + "&popupType=" + t);
                    case "avatarNotes":
                        var s = "notes";
                        break;
                    case "chatWindow":
                        var s = "chat";
                        break;
                    default:
                        return
                }
                var l = new Cookie("ik_global", 7);
                "block" == r.css("display") ? (null !== n.avatarNotes && "avatarNotes" == e ? n.avatarNotes.save() : null !== n.allyChat && "chatWindow" == e && n.allyChat.close(), r.css("display", "none"), l.set(s, "0")) : ($("#js_viewChat").children().first().removeClass("activated"), "" == r.html() ? ajaxHandlerCall("?view=" + e) : "chatWindow" == e && n.allyChat.poll(), r.css("display", "block"), n.allyChat && "chatWindow" == e && n.allyChat.scrolldown(), l.set(s, "1")), setTimeout(function() {
                    r.trigger("focusElement")
                }, 0)
            }
        },
        updateChatLayer: function t(e) {
            console.log("ikariam.PopupController: updateChatLayer"), $("#chatWindow")[0].innerHTML = e;
            var o = ikariam.getPopupController();
            o.adjustPosition("chatWindow");
            var n = $("#chatHeader")[0]; // opera < 11.50 : scrolling hack needed.
            // @TODO: delete lines as soon as versions are irrelevant.
            if (o.makePopupDraggable(n, "resizablepanel_chat"), this.allyChat = new Chat, this.allyChat.init($("#js_chatMessages")[0], $("#js_chatpartners")[0], $("#js_chatInput")[0], $("#js_btnChatInput")[0], ikariam.model.chatPollFrequency, ikariam.model.chatLineMaxlength, ikariam.model.sessionDeprecated), /Opera[\/\s](9\.\d+)/.test(navigator.userAgent)) {
                var r = new Number(RegExp.$1);
                switch (r) {
                    case 11.5:
                        break;
                    default:
                        $("#js_ResizeMessages").css("overflow-y", "hidden"), $("#js_chatMessages").css("overflow-y", "scroll")
                }
            }
            var s = new Cookie("ik_global", 7);
            "1" == s.get("chatInfo") && o.toggleChatInfo(), o.allyChat.scrolldown()
        },
        updateNoteLayer: function t(e) {
            console.log("ikariam.PopupController: updateNoteLayer");
            var o = ikariam.getPopupController();
            $("#avatarNotes")[0].innerHTML = e, o.adjustPosition("avatarNotes");
            var n = $("#notesHeader")[0]; // Add Dragability...
            o.makePopupDraggable(n, "resizablepanel_notes"), o.avatarNotes = new Notes, o.avatarNotes.setMaxChars(ikariam.model.notesLineMaxlength), o.avatarNotes.init($("#js_notesMessages")[0], $("#chars_notes")[0])
        },
        toggleChatInfo: function e() {
            console.log("ikariam.PopupController: toggleChatInfo"), $("#chatWindow div.chat_info").toggle(0)
        },
        makePopupDraggable: function o(e, t) {
            var n = ikariam.getPopupController();
            console.log("ikariam.PopupController: makePopupDraggable"), $(e).on("mousedown", function(o) {
                $(this).addClass("mousedown"), n.drag(o, t)
            }).on("mouseup", function(t) {
                $(this).remove("mousedown")
            })
        },
        adjustPosition: function t(e) {
            var o = Math.max;
            console.log("ikariam.PopupController: adjustPosition"), $("#" + e).find("div.popupMessage").each(function() {
                var t = o(($(window).height() - $(this).height()) / 2, 20);
                if ($(this).offset({
                        top: t,
                        left: $("#worldview").offset().left + ($("#worldview").width() - $(this).width()) / 2
                    }), "chatWindow" == e) {
                    var n = new Cookie("ik_global", 7),
                        r = n.get("chat_x"),
                        s = n.get("chat_y"),
                        l = n.get("chat_width"),
                        d = n.get("chat_height");
                    s && $("#resizablepanel_chat").css("top", s), r && $("#resizablepanel_chat").css("left", r), l && $("#resizablepanel_chat").css("width", l), d && $("#resizablepanel_chat").css("height", d)
                } else if ("avatarNotes" == e) {
                    var n = new Cookie("ik_global", 7),
                        r = n.get("notes_x"),
                        s = n.get("notes_y"),
                        l = n.get("notes_width"),
                        d = n.get("notes_height");
                    s && $("#resizablepanel_notes").css("top", s), r && $("#resizablepanel_notes").css("left", r), l && $("#resizablepanel_notes").css("width", l), d && $("#resizablepanel_notes").css("height", d)
                }
            })
        },
        saveCookies: function e() {
            console.log("ikariam.PopupController: saveCookies");
            var t = new Cookie("ik_global", 7);
            this.avatarNotes != null && this.avatarNotes instanceof Notes && (t.set("notes_x", $("#resizablepanel_notes").css("left")), t.set("notes_y", $("#resizablepanel_notes").css("top")), t.set("notes_width", $("#resizablepanel_notes").css("width")), t.set("notes_height", $("#resizablepanel_notes").css("height")), ikariam.model.addViewParameter("notes_x", $("#resizablepanel_notes").css("left")), ikariam.model.addViewParameter("notes_y", $("#resizablepanel_notes").css("top")), this.avatarNotes.save()), ikariam.model.hasAlly && this.allyChat && this.allyChat instanceof Chat && (t.set("chat_x", $("#resizablepanel_chat").css("left")), t.set("chat_y", $("#resizablepanel_chat").css("top")), t.set("chat_width", $("#resizablepanel_chat").css("width")), t.set("chat_height", $("#resizablepanel_chat").css("height")), ikariam.model.addViewParameter("chat_x", $("#resizablepanel_chat").css("left")), ikariam.model.addViewParameter("chat_y", $("#resizablepanel_chat").css("top")), this.allyChat.close())
        }
    }, ikariam.MultiPopupController = {
        maxTabs: 3,
        popups: [],
        additionalCloseFunc: [],
        boxRoot: null,
        boxMainContent: null,
        closeButtonText: "Close",
        jsEvalResult: "",
        init: function e() {
            console.log("INIT ikariam.MultiPopupController")
        },
        addTab: function r(e, t, o, n) {
            var s = this._countElements() + 1;
            n = parseInt(n), (n == null || "NaN" == n) && (n = 100), 1 > n && (n = 1), 100 < n && (n = 100), o == null && (o = ""), e == null && (e = ""), t == null && (t = ""), "" != e && "" != t && (ikariam.MultiPopupController.popups[s] = {
                prio: n,
                title: e,
                content: t,
                onclose: o
            })
        },
        showPopup: function e() {
            var t = ikariam.getMultiPopupController();
            t.boxRoot = createEl("div", "multiPopup", "popupMessage");
            var o = this._countElements();
            if (0 < o) {
                console.log("ikariam.MultiPopupController: showPopup"), ikariam.MultiPopupController.popups.sort(function(e, t) {
                    return e.prio == t.prio ? 0 : e.prio < t.prio ? -1 : 1
                }), t.boxMainContent = createEl("div");
                var n = createEl("div", null, "hd header draggable", null, null, {
                        mousedown: function e(o) {
                            $(t).addClass("mousedown"), t.drag(o, t.boxRoot.id)
                        },
                        mouseup: function e() {
                            $(t).removeClass("mousedown")
                        } // add drag events on header
                    }),
                    r = createEl("div", null, "header headerLeft"),
                    s = createEl("div", null, "header headerMiddle"),
                    l = createEl("h3", null, null, null, ""),
                    d = createEl("div", null, "header headerRight"),
                    c = createEl("div", null, "ft footer"),
                    u = 0; // Anzeigeelemente darstellen
                if (1 < o) var p = createEl("ul", null, "tabmenu");
                var m = "",
                    g = {};
                ikariam.MultiPopupController.popups.forEach(function(e) {
                    if ("contains" != e && "forEach" != e && (++u, !(u > ikariam.MultiPopupController.maxTabs))) {
                        var n = e;
                        title = n.title, content = n.content, content = content.replace(/<end_script>/g, "</script>"), content = t._parseContentForJs(content), "" != n.onclose && (t.additionalCloseFunc = t.additionalCloseFunc + n.onclose + " ");
                        var r = "multiTab" + u;
                        if (1 < o) {
                            "" == m && (m = r);
                            var s = "<b class=\"" + r + "\">" + title + "</b>",
                                l = createEl("li", "js_" + r, "tab short_text65", null, s);
                            l.setAttribute("onclick", "switchTab('" + r + "');"), p.appendChild(l)
                        } // Popup-Tab-Content
                        var d = createEl("div", r),
                            c = "";
                        1 == o && (c = "margin-top: 19px");
                        var h = createEl("div", null, "contentBox01h", c),
                            b = createEl("h3", null, "header", null, title),
                            v = createEl("div", null, "content"),
                            x = createEl("div", null, "tabContent", null, stripslashes(content, !0));
                        v.appendChild(x), h.appendChild(b), h.appendChild(v), d.appendChild(h), g[r] = d
                    }
                }), 1 < o && t.boxMainContent.appendChild(p);
                var h = "";
                1 < o && (h = "$(document).ready(function() { switchTab(\"" + m + "\"); });"); // Tab-JS / erster Tab auswählen
                var b = createEl("script", null, null, null, null);
                b.setAttribute("type", "text/javascript"), b.id = "mulitpopupJs" + u;
                try {
                    b.innerHTML = h + t.jsEvalResult
                } catch (e) {
                    var v = h + t.jsEvalResult;
                    b.text = v
                } // Tab-Contents
                for (key in t.boxMainContent.appendChild(b), g) t.boxMainContent.appendChild(g[key]); // Schließen Button
                var x = createEl("div", null, "centerButton"),
                    C = createEl("a", null, "button", null, this.closeButtonText);
                C.setAttribute("onmousedown", t.additionalCloseFunc + "ikariam.getMultiPopupController().closePopup(); return false;"), x.appendChild(C), t.boxMainContent.appendChild(x), $(t.boxMainContent).addClass("bd popupContent"), t.boxRoot.appendChild(n), t.boxRoot.appendChild(t.boxMainContent), t.boxRoot.appendChild(c), n.appendChild(r), n.appendChild(s), n.appendChild(d), s.appendChild(l); // append new popup root element to popup container in dom and adjust its position
                var y = $("#popupMultiMessage");
                y.append(t.boxRoot), t.adjustPosition("popupMultiMessage"), ikariam.controller.replaceElements(), setTimeout(function() {
                    y.trigger("focusElement")
                }, 0)
            }
            $("#container")[0].appendChild(t.boxRoot), 0 < o && isIE && isIE8 && switchTab(m), 0 < u && t.adjustPositionNew(u)
        },
        _countElements: function e() {
            var t = 0;
            for (pop in ikariam.MultiPopupController.popups) "contains" != pop && "forEach" != pop && ++t;
            return t
        },
        _parseContentForJs: function t(e) {
            var o = /<script[^>]+>(.+)<\/script>/gi,
                n = e.match(o);
            if (null != n)
                for (i = 0; i < n.length; i++) n[i] = n[i].replace(/<script[^>]+>/g, ""), n[i] = n[i].replace(/<\/script>/g, ""), this.jsEvalResult += n[i];
            return e
        },
        drag: function o(t, e) {
            $(this.boxRoot).css("z-index", "+=1");
            for (var n = ikariam.model.maincontentboxes, r = n.length, s = 0; s < r; s++) n[s].id !== this.id && $(n[s].boxRoot).css("z-index", 100);
            ikariam.getController().clearOverlayContainers(), dragStart(t, e)
        },
        adjustPosition: function t(e) {
            $("#" + e).find("div.popupMessage").each(function() {
                var e = Math.max(($(window).height() - $(this).height()) / 2, 20);
                alert($(window).height() + " | " + $(this).height()), $(this).offset({
                    top: e,
                    left: $("#worldview").offset().left + ($("#worldview").width() - $(this).width()) / 2
                })
            })
        },
        adjustPositionNew: function t(e) {
            for (var o = 0, n = 1, r; n <= e; n++) r = $("#multiTab" + n).height(), r > o && (o = r);
            var s = Math.max(($(window).height() - (o + 110)) / 2, 20);
            $("#multiPopup").offset({
                top: s,
                left: $("#worldview").offset().left + ($("#worldview").width() - $("#multiPopup").width()) / 2
            })
        },
        closePopup: function e() {
            $("#multiPopup").remove()
        }
    }, ikariam.Scrollbar = {
        box: null,
        scrollElem: null,
        scrollArrowUp: null,
        scrollArrowDown: null,
        scrollSlider: null,
        contH: 0,
        docH: 0,
        scrollH: 0,
        scrollDist: 0,
        scrollSliderMinHeight: 15,
        scrollStep: 8,
        isStepScrolling: !1,
        eventsAttached: !1,
        init: function t(e) {
            if (this.box = e.mainbox, null !== this.box) {
                this.scrollElem = createEl("div", null, "scroll_area"), this.scrollArrowUp = createEl("div", null, "scroll_arrow_top", null, null, null, this.scrollElem), this.scrollSlider = createEl("div", null, "scroller", null, null, null, this.scrollElem), this.scrollArrowDown = createEl("div", null, "scroll_arrow_bottom", null, null, null, this.scrollElem);
                var o = this.box.boxScrollContainer;
                o.insertBefore(this.scrollElem, o.firstChild)
            }
        },
        adjustSize: function e() {
            var t = Math.round,
                o = Math.max;
            if (this.contH = this.box.boxScrollContainer.offsetHeight, this.docH = this.box.boxMainContent.offsetHeight, this.scrollH = o(this.scrollSliderMinHeight, this.contH * this.contH / this.docH), this.scrollDist = t(this.contH - this.scrollH) - ikariam.scrollbarArrowsHeight, this.scrollH >= this.docH) $(this.scrollElem).hasClass("scroll_disabled") || ($(this.scrollSlider).css("width", ikariam.borderWidth + "px"), $(this.scrollElem).addClass("scroll_disabled"), this.scrollToTop());
            else {
                var n = o(this.scrollSliderMinHeight, t(this.scrollH - ikariam.scrollbarArrowsHeight));
                this.scrollH = n, this.scrollDist = t(this.contH - this.scrollH) - ikariam.scrollbarArrowsHeight, $(this.scrollSlider).css({
                    width: ikariam.scrollbarArrowsWidth + "px",
                    height: n + "px"
                }), $(this.scrollElem).removeClass("scroll_disabled"), $(this.scrollArrowDown).css("top", t(this.contH - n - ikariam.scrollbarArrowsHeight) + "px");
                var r = this.scrollSlider.style.top - this.scrollH;
                isNaN(r) || this.scrollToY(r)
            }
        },
        addEvents: function e() {
            var t = this;
            _Drag.init(t.scrollSlider, null, 0, 0, -1, t.scrollDist), t.scrollSlider.onDrag = function() {
                t.alreadyScrolled = !0;
                var e = parseInt(t.scrollSlider.style.top),
                    o = parseInt(0 - e * (t.docH - t.contH) / t.scrollDist);
                return o < 0 - (t.docH - t.contH) ? void t.scrollToBottom() : void $(t.box.boxMainContent).css("top", (-2 >= o ? o : 0) + "px")
            }, this.eventsAttached || ($(t.box.boxMainContent).on("mousewheel", t.mouseWheelHandler), $(t.box.boxMainContent).parent().on("scroll", function() {
                t.scrollToY(t.getScrollPos() + this.scrollTop), this.scrollTop = 0
            }), $(t.scrollElem).on("mousedown", function() {
                ikariam.controller.clearOverlayContainers(), t.alreadyScrolled = !1
            }).on("mouseup", function(o) {
                t.alreadyScrolled || t.scrollToMousePos(o)
            }), $(t.scrollArrowUp).on("mousedown", function(o) {
                touchVersion ? t.scrollToMousePos(o) : (t.isStepScrolling = !0, t.startStepScrolling(2 * -t.scrollStep))
            }).on("mouseup", function() {
                t.isStepScrolling = !1, t.alreadyScrolled = !0
            }), $(t.scrollArrowDown).on("mousedown", function(o) {
                touchVersion ? t.scrollToMousePos(o) : (t.isStepScrolling = !0, t.startStepScrolling(2 * t.scrollStep))
            }).on("mouseup", function() {
                t.isStepScrolling = !1, t.alreadyScrolled = !0
            }), this.eventsAttached = !0)
        },
        startStepScrolling: function t(e) {
            var o = this;
            this.scrollToY(this.getScrollPos() + e), this.isStepScrolling && w.setTimeout(function() {
                o.isStepScrolling && o.startStepScrolling(e)
            }, 100)
        },
        scrollToTop: function e() {
            ikariam.getController().clearOverlayContainers(), this.alreadyScrolled = !0, $(this.scrollSlider).css("top", "0px"), $(this.box.boxMainContent).css("top", "0px")
        },
        scrollToBottom: function e() {
            ikariam.getController().clearOverlayContainers(), this.alreadyScrolled = !0;
            var t = this.scrollElem.offsetHeight - ikariam.scrollbarArrowsHeight - this.scrollSlider.offsetHeight;
            $(this.scrollSlider).css("top", t + "px");
            var o = parseInt(0 - (this.docH - this.contH));
            $(this.box.boxMainContent).css("top", o + "px")
        },
        scrollToMousePos: function e(t) {
            if (this.alreadyScrolled) return void(this.alreadyScrolled = !1);
            var o = parseInt(this.docH - this.contH),
                n = this.getMouseYinBox(t);
            if (n >= o) return void this.scrollToBottom();
            var r = this.getScrollPos(),
                s = this.scrollSlider.offsetHeight + this.scrollArrowUp.offsetHeight + this.scrollArrowDown.offsetHeight;
            n < r + this.scrollStep ? this.scrollToY(r - 5 * (s / this.scrollStep)) : n > r && this.scrollToY(r + 5 * (s / this.scrollStep))
        },
        scrollToY: function t(e) {
            var o = Math.round;
            if (void 0 !== this.scrollSlider.onDrag) {
                var n = this.scrollElem.offsetHeight,
                    r = this.scrollSlider.offsetHeight;
                return (e = o(e), 1 > e) ? void this.scrollToTop() : e >= n - r - ikariam.scrollbarArrowsHeight ? void this.scrollToBottom() : void($(this.scrollSlider).css("top", e + "px"), this.scrollSlider.onDrag())
            }
        },
        getMouseYinBox: function e(t) {
            var o = isIE ? event.clientY + doc.body.scrollTop : t.pageY;
            0 > o && (o = 0);
            var n = parseInt($("#header").css("height")) + this.box.boxScrollContainer.offsetTop + this.scrollArrowUp.offsetHeight;
            return o - n - this.scrollSlider.offsetHeight
        },
        mouseWheelHandler: function o(e, t) {
            if ((ikariam.getController().clearOverlayContainers(), null !== ikariam.templateView && null !== ikariam.templateView.mainbox) && 0 !== t && "textarea" !== e.target.tagName.toLowerCase()) {
                var n = ikariam.templateView.mainbox.scrollbar;
                if (void 0 !== n) {
                    var r = n.scrollSlider.offsetHeight + n.scrollArrowUp.offsetHeight + n.scrollArrowDown.offsetHeight,
                        s = n.getScrollPos();
                    n.scrollToY(s - t * (r / n.scrollStep)), e.preventDefault()
                }
            }
        },
        getScrollPos: function e() {
            return parseInt($(this.scrollSlider).css("top"), 10)
        }
    }, ikariam.ResourceCounter = {
        timer: null,
        init: function t(e) {
            var o = Math.floor,
                n = Math.round,
                r = Math.max,
                s = Math.min,
                l = new simpleTimer(2e3, ikariam.model.getServerTimeDiff()),
                d = ikariam.model,
                c = e.watchedResource,
                u = "js_GlobalMenu_" + d.getResourceName(c);
            return l.startDate = 1e3 * d.serverTime, l.watchedResource = c, l.production = e.production, l.startRes = d.currentResources[c], l.updateImmediately = !1, l.valueElem = $("#" + u)[0], l.checkBounds = function(e) {
                var t = d.maxResourcesWithModifier[c];
                return r(0, s(e, t))
            }, l.tick = function() {
                var e = o((this.currenttime - this.startDate) / 1e3),
                    t = this.checkBounds(n(this.startRes + this.production * e)),
                    r = this.startRes; // TODO compare it to the currently visible value for even less updates
                if (this.updateImmediately || r !== t) {
                    var s = t / d.maxResourcesWithModifier[this.watchedResource],
                        l = $(this.valueElem);
                    l.removeClass("storage_danger storage_full"), 1 <= s ? l.addClass("storage_full") : .75 <= s && l.addClass("storage_danger"), l.html(d.shortenValue(t, 6)), $("#" + this.valueElem.id + "_Total").html(d.shortenValue(t, 15)), d.currentResources[this.watchedResource] = t, this.updateImmediately = !1
                }
            }, $(l).on("update", l.tick), l.startTimer(), this.timer = l, l
        },
        updateTimerConfig: function t(e) { // ajax is FASTER, so this needs to get updated
            // local + diff => server time
            this.timer.startDate = 1e3 * ikariam.model.serverTime, this.timer.serverTimeDiff = ikariam.model.getServerTimeDiff(), this.timer.currenttime = new Date().getTime() + this.timer.serverTimeDiff, this.timer.startRes = ikariam.model.currentResources[this.timer.watchedResource], this.timer.production = e, this.timer.updateImmediately = !0, this.timer.tick()
        }
    }, ikariam.Tutorial = {
        questText: "",
        questHint: "",
        questSteps: [],
        questReward: {},
        questImg: "",
        successText: "",
        successReward: {},
        questConstants: {},
        curQuest: 0,
        checkboxText: "",
        questPopupEl: null,
        rewardPopupEl: null,
        checkboxEl: null,
        advisorEl: null,
        advisorImgEl: null,
        advisorLinkEl: null,
        displayTutorialAdvisor: !1,
        highlightTutorialAdvisor: !1,
        questShowImmediately: !1,
        arrow: null,
        arrowPosition: null,
        handSwitchData: null,
        hideTutorialAdvisor: !1,
        defaultArrowPos: "js_islandLink",
        lastRegisteredNameRequest: null,
        lastRegisteredNameRequestSuccessful: !0,
        lastRegisteredNameBubbleEventEndTime: 0,
        init: function t(e) {
            return (console.log("INIT ikariam.Tutorial with dataSet:"), console.log(e), null === e) ? null : (this.questConstants = e.questConstants, this.checkboxText = e.checkboxText, this.btnText = e.btnText, this.checkboxEl = e.checkboxEl, this.updateQuestData(e.questData), this.displayTutorialAdvisor = e.displayTutorialAdvisor && !this.questShowImmediately, this.displayQuestPopup = e.displayQuestPopup && e.highlightTutorialAdvisor || this.questShowImmediately, this.hideTutorialAdvisor = e.hideTutorialAdvisor, this.updateDisplay(), $("#popupMessage").on("change keyup blur", ".registeredNameInputField", this.updateRegisteredNameValidIcon), this)
        },
        updateQuestData: function t(e) {
            console.log("ikariam.Tutorial: updateQuestData"), this.curQuest = e.questId, this.questText = e.questText, this.questSteps = e.questSteps, this.questReward = e.questReward, this.questImg = e.advisorImage, this.advisorClass = e.advisorImage, this.questShowImmediately = e.questShowImmediately, e.rewardText === void 0 ? (delete this.successText, delete this.successReward, delete this.questHint) : (this.successText = e.rewardText, this.successReward = e.reward, this.questHint = e.hint), this.arrowPosition = e.hand, this.highlightTutorialAdvisor = e.highlightTutorialAdvisor, this.displayRewardPopup = e.showReward, this.handSwitchData = e.handSwitchData, this.prepareArrowMove(), this.hideTutorialAdvisor = e.hideTutorialAdvisor
        },
        updateDisplay: function e() {
            console.log("ikariam.Tutorial: updateDisplay");
            var t = this;
            null === this.advisorEl && this.initTutorialAdvisor(), null === this.arrow && this.initArrow();
            var o = $("#popupMessage")[0],
                n = $("#js_tutorialMessage"),
                r = $("#js_tutorialRewardMessage"); // display no popup message, but arrow and tutorial advisor icon
            if (0 < n.length && o.removeChild(n[0]), 0 < r.length && o.removeChild(r[0]), this.displayQuestPopup && !this.successText && (this.questPopupEl = this.createPopup("quest", this.questText, this.questSteps, this.questReward, this.questImg), $("#js_tutorialOkButton_quest").on("click", function() {
                    if (!ikariam.tutorial.lastRegisteredNameRequestSuccessful) // do not proceed if the popup contains an invalid player name
                        return !1;
                    t.displayTutorialAdvisor = !0, t.displayQuestPopup = !1;
                    var e = "",
                        o = $(".registeredNameInputField");
                    0 < o.length && (e = "&avatarName=" + o.val()), ajaxHandlerCall("?action=TutorialOperations&function=updateTutorialData&disableTutorial=" + $("#disableTutorial")[0].checked + e)
                })), "" !== this.successText && (this.rewardPopupEl = this.createPopup("reward", this.successText, this.questHint, this.successReward, this.questImg), $("#js_tutorialOkButton_reward").on("click", function() {
                    t.displayTutorialAdvisor = !0, t.displayRewardPopup = !1, ajaxHandlerCall("?action=TutorialOperations&function=rewardShown")
                })), null !== this.questPopupEl && (this.displayQuestPopup ? (this.arrow.style.display = "none", this.questPopupEl.style.display = "block") : this.questPopupEl.style.display = "none"), null !== this.rewardPopupEl && (this.displayRewardPopup ? (this.advisorImgEl.css("display", "none"), this.arrow.style.display = "none", this.rewardPopupEl.style.display = "block") : this.rewardPopupEl.style.display = "none"), !this.displayQuestPopup) {
                this.highlightTutorialAdvisor ? this.advisorImgEl.attr("class", this.advisorClass + " lighten") : this.advisorImgEl.attr("class", this.advisorClass), this.hideTutorialAdvisor ? this.advisorImgEl.css("display", "none") : this.advisorImgEl.css("display", "block");
                var s = !1 === this.arrowPosition;
                s && (this.arrow.style.display = "none");
                var l = $("#" + this.arrowPosition)[0];
                if ("js_closeTemplateView" === this.arrowPosition && null !== ikariam.templateView && null !== ikariam.templateView.mainbox) l = ikariam.templateView.mainbox.boxRoot.children[0], $(this.arrow).addClass("on_close_button"), $(ikariam.templateView.mainbox.boxRoot).find("div.close").on("mouseup", function() {
                    ajaxHandlerCall("?action=TutorialOperations&function=updateTutorialData&viewIsClosing=1&quest=" + t.curQuest)
                });
                else if ($(this.arrow).removeClass("on_close_button"), 1 > $("#" + this.arrowPosition).length) return void(s || console.log("WARNING: arrow pos '" + this.arrowPosition + "' NOT FOUND!"));
                s || l.appendChild(this.arrow);
                var d = l,
                    c, u, p, m, g, h;
                this.animateArrow()
            }
        },
        initTutorialAdvisor: function e() {
            console.log("ikariam.Tutorial: initTutorialAdvisor");
            var t = this;
            this.advisorEl = $("<div>", {
                id: "tutorialAdvisor"
            }), $(this.advisorEl).on("mouseup", function() {
                t.displayTutorialAdvisor = !0, t.displayQuestPopup = !0;
                var e = null === ikariam.templateView ? "" : "&templateView=" + ikariam.templateView.id;
                ajaxHandlerCall("?action=TutorialOperations&function=messageWasDisplayed&quest=" + t.curQuest + "&backgroundView=" + ikariam.backgroundView.id + e)
            }), this.advisorImgEl = $("<div>", {
                id: "advisorImage",
                class: this.advisorClass
            }), this.highlightTutorialAdvisor && this.advisorImgEl.attr("class", this.advisorClass + " lighten"), this.displayTutorialAdvisor || this.advisorImgEl.css("display", "none"), this.advisorLinkEl = $("<a>", {
                id: "tutorialAdvisorLink",
                title: this.questConstants.headline.quest
            }), this.advisorEl.append(this.advisorImgEl).append(this.advisorLinkEl).appendTo("#container")
        },
        initArrow: function e() {
            this.arrow = createEl("div", "js_tutorialArrow", "aniArrow");
            1 > $("#" + this.arrowPosition).length || $("#" + this.arrowPosition)[0].appendChild(this.arrow)
        },
        animateArrow: function e() {
            console.log("ikariam.Tutorial: animateArrow");
            var t = this,
                o = 40;
            clearInterval(this.interval), this.arrow.style.top = o + "px", this.arrow.style.display = "block", this.arrowCounter = 0, this.interval = setInterval(function() {
                t.arrowCounter++, t.arrow.style.top = o + 10 * Math.sin(t.arrowCounter / 15) + "px"
            }, 10)
        },
        createPopup: function s(e, t, o, n, r) {
            console.log("ikariam.Tutorial: createPopup");
            var l = createEl("div", null, "centerButton");
            if ("quest" === e) {
                var d = createEl("div", null, "inlineblocked", null, null, null, l);
                try {
                    this.checkboxEl = createEl("<input type=\"checkbox\">", "disableTutorial", "checkbox", null, null, null, d)
                } catch (t) {
                    this.checkboxEl = createEl("input", "disableTutorial", "checkbox", null, null, null, d), this.checkboxEl.type = "checkbox"
                }
                this.checkboxEl.name = "TutorialCheckbox", this.checkboxEl.title = this.checkboxText
            }
            createEl("div", "js_tutorialOkButton_" + e, "tutorial_ok button", null, this.btnText, null, l);
            var c = createEl("div"),
                u = this.updatePopupContent(e);
            u.id = "js_popupContent_" + e, c.appendChild(u), c.appendChild(l);
            var p = "reward" === e ? "js_tutorialRewardMessage" : "js_tutorialMessage";
            return ikariam.getPopupController().createPopup(p, this.questConstants.headline[e], c.innerHTML)
        },
        updatePopupContent: function t(e) {
            console.log("ikariam.Tutorial: updatePopupContent");
            var o = createEl("div"),
                n = createEl("p", null, "questText quest_" + this.curQuest);
            if ("quest" == e) var r = createEl("div", null, "allAdvisors");
            var s = createEl("div", null, "clearboth"),
                l = createEl("div", null, "clearboth"),
                d = createEl("ul", null, "questReward clearfix");
            switch (e) {
                case "quest":
                    n.innerHTML = stripslashes(this.questText, !0);
                    for (var c = createEl("ul", null, "questSteps"), u = this.questSteps.length, p = 0; p < u; p++) createEl("li", null, null, null, stripslashes(this.questSteps[p], !0), null, c);
                    break;
                case "reward":
                    n.innerHTML = stripslashes(this.successText, !0);
                    var c = createEl("div", null, "questHint", null, "<b>" + stripslashes(this.questConstants.header.hint, !0) + "</b><br>" + stripslashes(this.questHint, !0))
            }
            if ("quest" == e) o.appendChild(r), o.appendChild(n), o.appendChild(c), 10 != this.curQuest && createEl("div", null, "rewardHeader", null, this.questConstants.header[e], null, o), o.appendChild(this.getRewardDisplay(e));
            else {
                var m = createEl("div", null, "rewardBox");
                m.appendChild(n), m.appendChild(this.getRewardDisplay(e)), o.appendChild(m)
            }
            return o.appendChild(l), "reward" == e && o.appendChild(c), o
        },
        updateRegisteredNameValidIcon: function t(e) {
            var o = $(e.target).val();
            this.lastRegisteredNameRequest !== o && (this.lastRegisteredNameRequest = o, ajaxHandlerCall("?action=TutorialOperations&function=isNameValid&name=" + o, ikariam.Tutorial.updateRegisteredNameValidIconCallback))
        },
        updateRegisteredNameValidIconCallback: function t(e) {
            var o = JSON.parse(e);
            o.successful ? ikariam.tutorial.showRegisteredNameIsValid() : ikariam.tutorial.showRegisteredNameIsInvalid(o.errorMessage, !0)
        },
        showRegisteredNameIsValid: function e() {
            var t = $(".registeredName"),
                o = $("#js_tutorialOkButton_quest");
            t.addClass("valid").removeClass("invalid unchanged"), t.prop("title", ""), ikariam.tutorial.lastRegisteredNameRequestSuccessful = !0, o.removeClass("button_disabled")
        },
        showRegisteredNameIsInvalid: function o(e, t) {
            var n = Math.max,
                r = $(".registeredName"),
                s = $("#js_tutorialOkButton_quest");
            if (r.addClass("invalid").removeClass("valid unchanged"), r.prop("title", e), t) {
                var l = new Date().getTime();
                !ikariam.tutorial.lastRegisteredNameBubbleEventEndTime || ikariam.tutorial.lastRegisteredNameBubbleEventEndTime < l ? ikariam.tutorial.lastRegisteredNameBubbleEventEndTime = l + 7500 : ikariam.tutorial.lastRegisteredNameBubbleEventEndTime += 7500;
                var d = n(0, ikariam.tutorial.lastRegisteredNameBubbleEventEndTime - l - 7500);
                window.setTimeout(function() {
                    BubbleTips.bindBubbleTip(6, 11, e, null, ".allAdvisors")
                }, d)
            }
            ikariam.tutorial.lastRegisteredNameRequestSuccessful = !1, s.addClass("button_disabled")
        },
        getRewardDisplay: function t(e) {
            switch (console.log("ikariam.Tutorial: getRewardDisplay"), e) {
                case "quest":
                    var o = this.questReward;
                    break;
                case "reward":
                    var o = this.successReward
            }
            if (void 0 !== o && [] !== o) {
                var n = createEl("ul", null, "questReward clearfix");
                if (void 0 !== o.resources)
                    for (var r = 0; 5 > r; r++) // von wood bis sulfur... 0 bis 4
                        void 0 !== o.resources[r] && createEl("li", null, this.questConstants.resources[r][0], null, "+ " + o.resources[r] + " " + this.questConstants.resources[r][1], null, n);
                if (void 0 !== o.upgrade) {
                    var s = this.questConstants.upgrade[o.upgrade];
                    createEl("li", null, s[0], null, s[1], null, n)
                }
                return void 0 !== o.military && createEl("li", null, this.questConstants.military[315][0], null, "+ " + o.military[315] + " " + this.questConstants.military[315][1], null, n), void 0 !== o.transporter && createEl("li", null, "transporter", null, "+ " + o.transporter + " " + this.questConstants.transporter, null, n), void 0 !== o.researchPoints && createEl("li", null, "researchPoints", null, "+ " + o.researchPoints + " " + this.questConstants.researchPoints, null, n), void 0 !== o.gold && createEl("li", null, "gold", null, "+ " + o.gold + " " + this.questConstants.gold, null, n), void 0 !== o.premiumCurrency && createEl("li", null, "premiumCurrency", null, "+ " + o.premiumCurrency + " " + this.questConstants.premiumCurrency, null, n), n
            }
        },
        prepareArrowMove: function e() {
            if (this.handSwitchData) {
                var t = $("#" + this.handSwitchData.source),
                    o = $("#" + this.handSwitchData.target);
                if (1 > t.length || 1 > o.length) return;
                var n = this;
                t.on("click", function() {
                    n.executeArrowMove()
                })
            }
        },
        executeArrowMove: function e() {
            var t = this;
            if (this.arrowPosition = this.handSwitchData.target, 1 > $("#" + this.arrowPosition).length) return console.error("ERROR: Neue Hand-Position '" + this.arrowPosition + "' nicht gefunden!"), void(this.arrowPosition = this.handSwitchData.source);
            $("#" + this.arrowPosition)[0].appendChild(this.arrow), $("#" + this.handSwitchData.source).off("click");
            for (var o = this.handSwitchData.reset.length, n = 0, r; n < o; ++n)(r = $("#" + this.handSwitchData.reset[n])[0], null != r) && $(r).on("click", function() {
                t.resetArrowMove()
            })
        },
        resetArrowMove: function e() {
            this.arrowPosition = this.handSwitchData.source, $("#" + this.arrowPosition)[0].appendChild(this.arrow);
            for (var t = this.handSwitchData.reset.length, o = 0, n; o < t; ++o)(n = $("#" + this.handSwitchData.reset[o])[0], null != n) && $("#" + this.handSwitchData.reset[o]).off("click");
            this.prepareArrowMove()
        },
        forceArrowMove: function t(e) {
            null === this.arrow && this.initArrow();
            var o = {
                buyTransporterAction: 100
            };
            void 0 === o[e] || this.curQuest != o[e] || ($("#js_" + e).append(this.arrow), this.animateArrow())
        }
    }, this.JSON || (JSON = {}),
    function() {
        function f(e) {
            return 10 > e ? "0" + e : e
        }

        function quote(e) {
            return escapeable.lastIndex = 0, escapeable.test(e) ? "\"" + e.replace(escapeable, function(e) {
                var t = meta[e];
                return "string" == typeof t ? t : "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
            }) + "\"" : "\"" + e + "\""
        }

        function str(e, t) {
            var o = gap,
                n = t[e],
                r, // The loop counter.
                s, // The member key.
                l, // The member value.
                d, c;
            switch (n && "object" === _typeof(n) && "function" == typeof n.toJSON && (n = n.toJSON(e)), "function" == typeof rep && (n = rep.call(t, e, n)), _typeof(n)) {
                case "string":
                    return quote(n);
                case "number":
                    return isFinite(n) ? n + "" : "null";
                case "boolean":
                case "null":
                    return n + "";
                case "object":
                    if (!n) return "null";
                    if (gap += indent, c = [], "number" == typeof n.length && !n.propertyIsEnumerable("length")) {
                        for (d = n.length, r = 0; r < d; r += 1) c[r] = str(r, n) || "null";
                        return l = 0 === c.length ? "[]" : gap ? "[\n" + gap + c.join(",\n" + gap) + "\n" + o + "]" : "[" + c.join(",") + "]", gap = o, l
                    }
                    if (rep && "object" === _typeof(rep))
                        for (d = rep.length, r = 0; r < d; r += 1) s = rep[r], "string" == typeof s && (l = str(s, n), l && c.push(quote(s) + (gap ? ": " : ":") + l));
                    else
                        for (s in n) Object.hasOwnProperty.call(n, s) && (l = str(s, n), l && c.push(quote(s) + (gap ? ": " : ":") + l));
                    return l = 0 === c.length ? "{}" : gap ? "{\n" + gap + c.join(",\n" + gap) + "\n" + o + "}" : "{" + c.join(",") + "}", gap = o, l
            }
        }
        "function" != typeof Date.prototype.toJSON && (Date.prototype.toJSON = function(e) {
            return this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z"
        }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(e) {
            return this.valueOf()
        });
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            escapeable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            meta = { // table of character substitutions
                "": "\\b",
                "	": "\\t",
                "\n": "\\n",
                "": "\\f",
                "\r": "\\r",
                '"': "\\\"",
                "\\": "\\\\"
            },
            gap, indent, rep;
        "function" != typeof JSON.stringify && (JSON.stringify = function(e, t, o) {
            var n;
            if (gap = "", indent = "", "number" == typeof o)
                for (n = 0; n < o; n += 1) indent += " ";
            else "string" == typeof o && (indent = o);
            if (rep = t, t && "function" != typeof t && ("object" !== _typeof(t) || "number" != typeof t.length)) throw new Error("JSON.stringify");
            return str("", {
                "": e
            })
        }), "function" != typeof JSON.parse && (JSON.parse = function(text, reviver) {
            function walk(e, t) {
                var o = e[t],
                    n, r;
                if (o && "object" === _typeof(o))
                    for (n in o) Object.hasOwnProperty.call(o, n) && (r = walk(o, n), void 0 === r ? delete o[n] : o[n] = r);
                return reviver.call(e, t, o)
            }
            var j;
            if (cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(e) {
                    return "\\u" + ("0000" + e.charCodeAt(0).toString(16)).slice(-4)
                })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
                "": j
            }, "") : j;
            throw new SyntaxError("JSON.parse")
        })
    }();

function Notes() {
    var e = null,
        t = null,
        o = "",
        n = this,
        r = 0,
        s = null;
    this.init = function(n, l) {
        e = n, t = l, e.onkeyup = this.updateNotes, o = e.value, s = o, t.innerHTML = r - o.length
    }, this.setMaxChars = function(e) {
        r = e
    }, this.updateNotes = function() {
        var n = e.value.length;
        if (n > r) {
            e.value = e.value.substring(0, r), alert(LocalizationStrings.warnings.tolargeText);
            var s = 0
        } else s = r - n;
        t.value = s, o = e.value, t.innerHTML = r - o.length
    }, this.save = function() {
        if (s != o) {
            n.updateNotes();
            var e = "notes=" + encodeURIComponent(o);
            ajaxRequest("?action=Diplomacy&function=saveAvatarNotes", n.saveResponse, e, !0)
        }
    }, this.saveResponse = function(e) {
        n && n.updateMessageLayer && n.updateMessageLayer()
    }
}

function Chat() {
    var e = null,
        t = null,
        o = null,
        n = null,
        r = 5e3,
        s = 200,
        l = "Session expired. Please log in from the start page.",
        d = null,
        c = 0,
        u = this; // defaultvalue 5000 = 5 sec
    // defaultvalue 200 characters/line
    this.init = function(d, c, p, m, g, h, b) {
        e = d, t = c, o = p, n = m, s = h, l = b, n.onclick = this.sendLine, o.onkeydown = this.sendLineOnEnter, o.onkeyup = this.truncate, r = g, u.poll()
    }, this.close = function() {
        clearTimeout(d)
    }, this.truncate = function() {
        o.value.length > s && (o.value = o.value.substr(0, s))
    }, this.poll = function() {
        var e = "id=" + c;
        ajaxRequest("?action=ChatWindow&function=poll", u.handleResponse, e), clearTimeout(d), d = setTimeout(u.poll, r)
    }, this.sendLine = function() {
        if ("" != o.value) {
            var e = "chatline=" + encodeURIComponent(o.value) + "&id=" + c;
            ajaxRequest("?action=ChatWindow&function=sendLine", u.handleResponse, e), o.value = "", clearTimeout(d), d = setTimeout(u.poll, r)
        }
    }, this.sendLineOnEnter = function(t) {
        if (t || (t = w.event), t.which) var o = t.which;
        else var o = t.keyCode;
        13 == o && u.sendLine()
    }, this.time = function(e) {
        e *= 1e3;
        var o = new Date(e),
            n = o.getHours();
        10 > n && (n = "0" + n);
        var r = o.getMinutes();
        10 > r && (r = "0" + r);
        var l = o.getSeconds();
        return 10 > l && (l = "0" + l), n + ":" + r + ":" + l
    }, this.insert = function(t) {
        if (e) {
            var o = e.parentNode,
                n = o.scrollTop;
            if (o.scrollTop >= o.scrollHeight - o.clientHeight) var r = !0;
            for (var s = 0; s < t.length; s++) {
                c = t[s][0];
                var l = createEl("li", "chatMessage" + c),
                    d = "[" + u.time(t[s][1]) + "] " + t[s][2] + ": " + t[s][3];
                l.appendChild(doc.createTextNode(d, 300)), e.appendChild(l)
            }
            o.scrollTop = r ? o.scrollHeight : n
        }
    }, this.scrolldown = function() {
        if (e) {
            var t = e.parentNode;
            t.scrollTop = t.scrollHeight
        }
    }, this.userlist = function(e) {
        if (t) {
            t.innerHTML = "";
            for (var o = 0, n; o < e.length; o++) //var opt = new Option(msg[i][0],msg[i][0]);
                //if (msg[i][1]) opt.disabled = 'disabled';
                // usersLayer.options[usersLayer.length] = opt;
                n = createEl("li", "user_" + e[o][0], "chat_user", null, e[o][0], null, t), e[o][1] && $(n).addClass("invisible")
        } //  usersLayer.options.length = 0;
    }, this.handleResponse = function(e) {
        if ("" != e) { // quickfix (TODO: how does that happen?)
            try {
                e = JSON.parse(e)
            } catch (t) {
                return clearTimeout(d), void alert(l)
            }
            for (var t = 1; t < e.length; t++) switch (e[t][0]) {
                case "insert":
                    u.insert(e[t][1]);
                    break;
                case "userlist":
                    u.userlist(e[t][1]);
                    break;
                default:
            }
        }
    }
}
var backgroundmenu = {
    SideMenu: {
        cookie: !1,
        state: {},
        type: "",
        el: null,
        owncity: !1,
        slots: null,
        locked: !1, // used to lock slots in place (disable mouseout) when the showfriends-button is used.
        zIndexExpanded: 12e4,
        zIndexCollapsed: 65,
        init: function t(e) {
            var o = this;
            this.type = e.type, this.el = $("#" + e.id), this.owncity = e.owncity, this.makeSlots(), lightVersion && this.el.css("z-index", this.zIndexExpanded), "friends" === this.type && (this.cookie = new Cookie("ik_friendslist_" + dataSetForView.avatarId), this.state.expanded = this.cookie.get("expanded"), this.state.page = this.cookie.get("page"), this.el.find(".showfriends").first().on("click", function(t) {
                return $.stopEvent(t), $(this).hasClass("showfriends") ? (o.expandAll(this), !lightVersion && $(this).parent().css("z-index", o.zIndexExpanded), o.cookie.set("expanded", !0), o.state.expanded = !0) : (o.contractAll(this), !lightVersion && $(this).parent().css("z-index", o.zIndexCollapsed), o.cookie.set("expanded", !1), o.state.expanded = !1), !1
            }).on("dblclick", function(t) {
                $.stopEvent(t)
            }).on("mouseup", function(t) {
                $.stopEvent(t)
            }).on("mousedown", function(t) {
                $.stopEvent(t)
            }), "true" === this.state.expanded && this.expandAll(this.el.find(".showfriends").first()), !touchVersion && (this.makePageable(6), !1 != this.state.page && this.paginator.gotoPage(this.state.page)))
        },
        update: function o(e, t) {
            for (var n in this.makeSlots(), e.visibility)
                for (var r = 0, s = this.slots.length; r < s; r++) this.slots[r].hasClass(n) && (e.visibility[n] ? this.slots[r].css("display", "inline-block") : this.slots[r].css("display", "none")); // bgViewData ist beim Wechsel zwischen Staedten z.T. noch nicht aktualisiert an der Stelle
            for (var d = void 0 === t ? bgViewData.currentCityId : t.id, r = 0, s = this.slots.length, c; r < s; r++) // Links der Slots auf die neue Stadt anpassen
                c = this.slots[r].attr("onclick"), c = c.replace(/cityId=\d+/g, "cityId=" + d), c = c.replace(/targetCityId=\d+/g, "targetCityId=" + d), c = ikariam.model.isOwnCity ? c.replace(/relatedCities/g, "cityMilitary") : c.replace(/cityMilitary/g, "relatedCities"), this.slots[r].attr("onclick", c)
        },
        makeSlots: function e() {
            var t = this;
            this.slots = [], this.el.find("li.expandable").each(function() {
                t.slots.push(t.createSingleSlot($(this)))
            })
        },
        createSingleSlot: function e(t) {
            var o = this;
            return t.on("mouseenter", function(n) {
                o.locked || (o.expand(t), !lightVersion && $(this).parent().parent().css("z-index", o.zIndexExpanded))
            }).on("mouseleave", function(n) {
                o.locked || (o.contract(t), !lightVersion && $(this).parent().parent().css("z-index", o.zIndexCollapsed))
            }), t
        },
        expandAll: function o(e, t) {
            for (var n = 0, r = this.slots.length; n < r; n++) this.expand(this.slots[n], t), this.locked = !0;
            $(e).hasClass("showfriends") && $(e).removeClass("showfriends").addClass("hidefriends")
        },
        contractAll: function o(e, t) {
            for (var n = 0, r = this.slots.length; n < r; n++) this.contract(this.slots[n], t), this.locked = !1;
            $(e).hasClass("hidefriends") && $(e).removeClass("hidefriends").addClass("showfriends")
        },
        contract: function o(e, t) {
            t ? e.css("width", "53px") : e.animate({
                width: "53px"
            }, 300, "easeOutQuad")
        },
        expand: function o(e, t) {
            t ? e.css("width", "199px") : e.animate({
                width: "199px"
            }, 300, "easeOutQuad")
        },
        makePageable: function t(e) {
            var o = this.el.find("ul"),
                n = doc.createDocumentFragment();
            this.paginator = new pagedSwapper;
            for (var r = 0, s = e; r < s; r++) this.paginator.addContainer(r);
            for (var d = this.el.find("li"), r = 0, s = d.length; r < s; r++) this.paginator.addItem(d[r]);
            var c = this.el.find(".pagedown"),
                u = this.el.find(".pageup");
            $(this.paginator).on("prechange", function() {
                for (var e = this.getItems(), t = 0, o = e.length; t < o; t++) n.appendChild(e[t]); //move li element into storage
            }).on("unload", function(t, e) {
                e.item && ($(e.item).removeClass("slot" + e.container), n.appendChild(e.item))
            }).on("change", function(t, e) {
                e.item && $(e.item).addClass("slot" + e.container).appendTo(o)
            }).on("postchange", function(t, e) {
                this.getCurrentPage() + 1 >= this.getPageCount() ? $(c).addClass("pagedown_deactivated").attr("title", "") : $(c).removeClass("pagedown_deactivated").attr("title", $(u).data("title")), 1 >= this.getCurrentPage() + 1 ? $(u).addClass("pageup_deactivated").attr("title", "") : $(u).removeClass("pageup_deactivated").attr("title", $(u).data("title"))
            });
            var p = this;
            c.on("click", function(t) {
                return $.stopEvent(t), !(p.paginator.getCurrentPage() + 1 >= p.paginator.getPageCount()) && void(p.paginator.pageForward(), p.cookie.set("page", p.paginator.getCurrentPage()), p.state.page = p.paginator.getCurrentPage())
            }), this.el.find(".pageup").on("click", function(t) {
                return $.stopEvent(t), !(1 >= p.paginator.getCurrentPage() + 1) && void(p.paginator.pageBack(), p.cookie.set("page", p.paginator.getCurrentPage()), p.state.page = p.paginator.getCurrentPage())
            }), this.paginator.gotoItem(0)
        }
    }
};

function pagedSwapper() {
    function e(e) {
        $(r).triggerHandler("prechange", e);
        for (var s = 0, l = o.length; s < l; s++) {
            var d = t + s,
                c = e + s,
                u = !!(n.length > d && 0 <= d) && n[d];
            $(r).triggerHandler("unload", {
                container: o[s],
                item: u,
                itemIndex: d
            });
            var p = !!(n.length > c && 0 <= c) && n[c];
            $(r).triggerHandler("change", {
                container: o[s],
                item: p,
                itemIndex: c
            })
        }
        t = e, $(r).triggerHandler("postchange", e)
    }
    var t = 0,
        o = [],
        n = [],
        r = this;
    this.getItems = function() {
        return n
    }, this.setItems = function(e) {
        n = e
    }, this.addItem = function(e, t) {
        for (var t = "undefined" == typeof t ? 1 : t, o = 0, r = t; o < r; o++) n[n.length] = e
    }, this.setItem = function(e, t) {
        n[e] = t
    }, this.addContainer = function(e) {
        o.push(e)
    }, this.getContainers = function() {
        return o
    }, this.getCurrentPage = function() {
        return Math.floor(t / o.length)
    }, this.getCurrentItem = function() {
        return t
    }, this.getPageCount = function() {
        return Math.ceil(n.length / o.length)
    }, this.gotoPage = function(e) {
        this.gotoItem(e * o.length)
    }, this.pageForward = function() {
        this.stepForward(o.length)
    }, this.pageBack = function() {
        this.stepBack(o.length)
    }, this.getItemCount = function() {
        return n.length
    }, this.gotoItem = function(t) {
        e(t)
    }, this.refresh = function() {
        this.gotoItem(t)
    }, this.stepForward = function(e) {
        var e = "undefined" == typeof e ? 1 : e;
        this.gotoItem(t + e)
    }, this.stepBack = function(e) {
        var e = "undefined" == typeof e ? 1 : e;
        this.gotoItem(t - e)
    }
}
var time = 500; // Time for fading out
//
//function makeSidebar(btn_name, panel_name, toggle_mode) {
//   var button = $(btn_name);
////    window.setTimeout(function() {
////        var width = button.width();
////        var zindex =  button.css('z-index');
////
////        button.css({
////            left: "-"+width+"px",
////            visibility: "visible"
////        });
////        if (toggle_mode) {
////            button.addClass("tabletSidebarToggleBtn");
////        } else {
////            button.addClass("tabletSidebarBtn");
////        }
////        button.on('click', function() {
////            if (button.hasClass('openSidebarRow') && button.hasClass('tabletSidebarToggleBtn')) {
////                closeSidebarRow(button);
////            } else if (button.hasClass('topLayer') && button.hasClass('tabletSidebarBtn')) {
////                closeSidebarRow(button);
////            }
////            else {
////                openSidebarRow(button);
////            }
////        });
////    },0);
//}
//
//
//function slideSidebarsIn(button) {
////    if (button.hasClass('openSidebarRow')) {
////        if (button.hasClass('tabletSidebarToggleBtn')) {
////            closeSidebarRow(button);
////        }
////    }
////
////    if (button.hasClass('tabletSidebarBtn')) {
////        $('.tabletSidebarBtn').each(function() {
////            $(this).removeClass('topLayer');
////        })
////    }
//    return;
//}
//
//
function openSidebarRow(e) {
    e.animate({
        left: "0px"
    }, time, function() {
        $("body").on("click.slideSidebarsIn", function() {
            slideSidebarsIn(e), $(this).off("click.slideSidebarsIn")
        })
    }), e.addClass("openSidebarRow"), e.hasClass("tabletSidebarBtn") && e.addClass("topLayer")
}

function closeSidebarRow(e, t) {
    t === void 0 && (t = !1), e.hasClass("tabletSidebarBtn") && e.hasClass("openSlidebarRow") && !e.hasClass("topLayer") ? e.addClass("topLayer") : e.removeClass("openSidebarRow")
}

function Cookie(e, t) {
    function o(e) {
        var t = document.cookie; //isolate requested cookie
        if (!t) return !1;
        var o, n;
        if (o = t.indexOf(e), -1 == o) return !1;
        o += e.length + 1, n = t.indexOf(";", o), -1 == n && (n = t.length), t = unescape(t.substring(o, n)); // loop through the list of name:values and load up the associate array
        for (var l = t.split(";"), d = 0, c; d < l.length; d++) c = l[d].split("="), "" != c[0] && c[1] && (s[c[0]] = c[1]);
        return r = n, t
    }
    var n = e,
        r = 0,
        s = [],
        l = !1;
    if ("undefined" != typeof t && 0 < t) {
        var d = new Date;
        d.setTime(d.getTime() + 1e3 * (60 * (60 * (24 * t)))), l = d.toGMTString()
    }
    var c = o.call(this, n);
    this.exists = function() {
        return !!c
    }, this.get = function(e) {
        return !!s[e] && s[e]
    }, this.set = function(e, t) {
        s[e] = t;
        var o = "";
        for (var r in s) o += r + "=" + s[r] + ";";
        document.cookie = n + "=" + escape(o) + "path=/;expires=" + l + ";"
    }, this.bget = function(e) {
        return !("1" != this.get(e))
    }, this.bset = function(e) {
        this.set(e, "1")
    }
}
var _Drag = {
        obj: null,
        init: function p(e, t, o, n, r, s, l, d, c, u) {
            e.onmousedown = _Drag.start, e.hmode = !l, e.vmode = !d, e.root = t && null != t ? t : e, e.hmode && isNaN(parseInt(e.root.style.left)) && (e.root.style.left = "0px"), e.vmode && isNaN(parseInt(e.root.style.top)) && (e.root.style.top = "0px"), !e.hmode && isNaN(parseInt(e.root.style.right)) && (e.root.style.right = "0px"), !e.vmode && isNaN(parseInt(e.root.style.bottom)) && (e.root.style.bottom = "0px"), e.minX = "undefined" == typeof o ? null : o, e.minY = "undefined" == typeof r ? null : r, e.maxX = "undefined" == typeof n ? null : n, e.maxY = "undefined" == typeof s ? null : s, e.xMapper = c ? c : null, e.yMapper = u ? u : null, e.root.onDragStart = new Function, e.root.onDragEnd = new Function, e.root.onDrag = new Function
        },
        start: function n(t) {
            var r = _Drag.obj = this;
            t = _Drag.fixE(t);
            var o = parseInt(r.vmode ? r.root.style.top : r.root.style.bottom),
                s = parseInt(r.hmode ? r.root.style.left : r.root.style.right);
            return r.root.onDragStart(s, o), r.lastMouseX = t.clientX, r.lastMouseY = t.clientY, r.hmode ? (null != r.minX && (r.minMouseX = t.clientX - s + r.minX), null != r.maxX && (r.maxMouseX = r.minMouseX + r.maxX - r.minX)) : (null != r.minX && (r.maxMouseX = -r.minX + t.clientX + s), null != r.maxX && (r.minMouseX = -r.maxX + t.clientX + s)), r.vmode ? (null != r.minY && (r.minMouseY = t.clientY - o + r.minY), null != r.maxY && (r.maxMouseY = r.minMouseY + r.maxY - r.minY)) : (null != r.minY && (r.maxMouseY = -r.minY + t.clientY + o), null != r.maxY && (r.minMouseY = -r.maxY + t.clientY + o)), document.onmousemove = _Drag.drag, document.onmouseup = _Drag.end, !1
        },
        drag: function n(t) {
            var r = Math.max,
                s = Math.min;
            t = _Drag.fixE(t);
            var l = _Drag.obj,
                o = t.clientY,
                d = t.clientX,
                c = parseInt(l.vmode ? l.root.style.top : l.root.style.bottom),
                u = parseInt(l.hmode ? l.root.style.left : l.root.style.right),
                p, m;
            return null != l.minX && (d = l.hmode ? r(d, l.minMouseX) : s(d, l.maxMouseX)), null != l.maxX && (d = l.hmode ? s(d, l.maxMouseX) : r(d, l.minMouseX)), null != l.minY && (o = l.vmode ? r(o, l.minMouseY) : s(o, l.maxMouseY)), null != l.maxY && (o = l.vmode ? s(o, l.maxMouseY) : r(o, l.minMouseY)), p = u + (d - l.lastMouseX) * (l.hmode ? 1 : -1), m = c + (o - l.lastMouseY) * (l.vmode ? 1 : -1), l.xMapper ? p = l.xMapper(c) : l.yMapper && (m = l.yMapper(u)), _Drag.obj.root.style[l.hmode ? "left" : "right"] = p + "px", _Drag.obj.root.style[l.vmode ? "top" : "bottom"] = m + "px", _Drag.obj.lastMouseX = d, _Drag.obj.lastMouseY = o, _Drag.obj.root.onDrag(p, m), !1
        },
        end: function e() {
            document.onmousemove = null, document.onmouseup = null, _Drag.obj.root.onDragEnd(parseInt(_Drag.obj.root.style[_Drag.obj.hmode ? "left" : "right"]), parseInt(_Drag.obj.root.style[_Drag.obj.vmode ? "top" : "bottom"])), _Drag.obj = null
        },
        fixE: function o(t) {
            return "undefined" == typeof t && (t = window.event), "undefined" == typeof t.layerX && (t.layerX = t.offsetX), "undefined" == typeof t.layerY && (t.layerY = t.offsetY), t
        }
    },
    animations = {
        fade: function r(e, t, o, n) {
            $(n).css("opacity", e).fadeTo(1e3 * o, t, "easeOutQuad")
        },
        BirdSwarm: {
            swarm: null,
            duration: 12,
            paths: {
                n: null,
                s: null,
                o: null,
                w: null,
                nw: null,
                sw: null,
                no: null,
                so: null
            },
            init: function t(e) {
                this.setupPaths(), this.createRandomSwarm()
            },
            createRandomSwarm: function e() {
                if (ikariam.model.animationsActive) {
                    var t = getRandomNumberBetween(1, 10),
                        o = this.getRandomDirection();
                    this.swarm = this.createSwarm(t, o)
                }
            },
            createBird: function t(e) {
                var o = $("<div>", {
                    class: "animated_bird animation_8steps not_selectable bird_" + e
                }); //            if (ikariam.model.specialEvent == 2 && !(isIE && !isIE9p) && !touchVersion) {
                //                newBird.on('click', function(){
                //                    ikariam.audioEl.play();
                //                    window.setTimeout(function(){newBird.addClass('invisible');},300);
                //                });
                //            }
                return "rtl" === ikariam.getModel().languageDirection ? o.css("right", getRandomNumberBetween(0, 150) + "px") : o.css("left", getRandomNumberBetween(0, 150) + "px"), o.css({
                    top: getRandomNumberBetween(0, 150) + "px",
                    "-webkit-animation-delay": getRandomNumberBetween(0, 500) + "ms",
                    "-moz-animation-delay": getRandomNumberBetween(0, 500) + "ms",
                    "-ms-animation-delay": getRandomNumberBetween(0, 500) + "ms"
                }), o
            },
            createSwarm: function o(e, t) {
                for (var n = $("<div></div>", {
                        class: "not_selectable bird_swarm animation_" + t
                    }), r = 0; r < e; r++) n.append(this.createBird(t));
                return $("#container").append(n), this.moveOnPath(n, t), n[0]
            },
            setupPaths: function e() {
                var t = -200,
                    o = -200,
                    n = doc.body.offsetHeight,
                    r = doc.body.offsetWidth;
                this.paths.n = {
                    from: [r / 2, n],
                    to: [r / 2, -200],
                    control: [
                        [r / 2 + 75, 3 * n / 4],
                        [r / 2, n / 2],
                        [r / 2 - 75, 1 * n / 4]
                    ]
                }, this.paths.s = {
                    from: [r / 2, -200],
                    to: [r / 2, n],
                    control: [
                        [r / 2 + 75, 1 * n / 4],
                        [r / 2, n / 2],
                        [r / 2 - 75, 3 * n / 4]
                    ]
                }, this.paths.w = {
                    from: [r, n / 2],
                    to: [o, n / 2],
                    control: [
                        [2 * r / 3, n / 2 + 75],
                        [1 * r / 3, n / 2 - 75]
                    ]
                }, this.paths.o = {
                    from: [o, n / 2],
                    to: [r, n / 2],
                    control: [
                        [1 * r / 3, n / 2 + 75],
                        [2 * r / 3, n / 2 - 75]
                    ]
                }, this.paths.so = {
                    from: [o, -200],
                    to: [r, n],
                    control: [
                        [1 * r / 3 - 70, 1 * n / 3 + 70],
                        [2 * r / 3 + 70, 2 * n / 3 + 70]
                    ]
                }, this.paths.no = {
                    from: [o, n],
                    to: [r, -200],
                    control: [
                        [1 * r / 3 + 80, 2 * n / 3],
                        [2 * r / 3 - 80, 1 * n / 3]
                    ]
                }, this.paths.sw = {
                    from: [r, -200],
                    to: [o, n],
                    control: [
                        [2 * r / 3, 1 * n / 3 - 80],
                        [1 * r / 3 + 80, 2 * n / 3]
                    ]
                }, this.paths.nw = {
                    from: [r, n],
                    to: [o, -200],
                    control: [
                        [2 * r / 3 + 70, 2 * n / 3 + 70],
                        [1 * r / 3 - 70, 1 * n / 3 + 70]
                    ]
                }
            },
            moveOnPath: function o(e, t) {
                var n = null;
                "n" === t ? n = this.paths.n : "s" === t ? n = this.paths.s : "o" === t ? n = this.paths.o : "w" === t ? n = this.paths.w : "nw" === t ? n = this.paths.nw : "no" === t ? n = this.paths.no : "sw" === t ? n = this.paths.sw : "so" === t ? n = this.paths.so : void 0;
                e.css({
                    top: n.from[1] + "px",
                    left: n.from[0] + "px"
                }), this.animate(e, n, 0)
            },
            animate: function n(e, t, o) {
                var r = this,
                    s = 0,
                    l = 0,
                    d = !1;
                o < t.control.length ? (s = t.control[o][1], l = t.control[o][0]) : (s = t.to[1], l = t.to[0], d = !0), e.animate({
                    top: s + "px",
                    left: l + "px"
                }, 1e3 * this.duration, "linear", function() {
                    ++o, d ? (r.clearAnimation(), setTimeout(function() {
                        r.createRandomSwarm()
                    }, 15e3)) : r.animate(e, t, o)
                })
            },
            clearAnimation: function e() {
                null !== this.swarm && $("#container")[0].removeChild(this.swarm), this.swarm = null
            },
            getRandomDirection: function e() {
                var t = getRandomNumberBetween(1, 8);
                return 1 === t ? "n" : 2 === t ? "s" : 3 === t ? "w" : 4 === t ? "o" : 5 === t ? "nw" : 6 === t ? "no" : 7 === t ? "sw" : 8 === t ? "so" : void 0
            }
        },
        Dolphin: {
            types: ["animation_5steps one_dolphin", "animation_12steps two_dolphins"],
            targetTiles: [],
            activeDolphin: null,
            init: function t(e) {
                this.targetTiles = e, this.targetCount = e.length, this.dolphinJump()
            },
            dolphinJump: function e() {
                if (ikariam.model.animationsActive) {
                    var t = getRandomNumberBetween(0, this.targetCount - 1),
                        o = getRandomNumberBetween(0, 1);
                    this.activeDolphin = this.targetTiles[t], $("#" + this.activeDolphin).addClass(this.types[o]).css("display", "block");
                    var n = this;
                    setTimeout(function() {
                        n.clearAnimation(), setTimeout(function() {
                            n.dolphinJump()
                        }, 5e3)
                    }, 0 === o ? 800 : 1200)
                }
            },
            clearAnimation: function e() {
                null === this.activeDolphin || $("#" + this.activeDolphin).attr("class", "dolphin").css("display", "none")
            },
            isInViewport: function t(e) {
                var o = $("#worldview")[0],
                    n = $("#worldmap")[0],
                    r = $("#map1")[0],
                    s = o.offsetWidth,
                    l = o.offsetHeight,
                    d = -(parseInt(n.style.left) - parseInt(r.style.left)),
                    c = parseInt(n.style.top) + parseInt(r.style.top),
                    u = parseInt(e.style.left),
                    p = parseInt(e.style.top);
                return !(u < d || p < c) && !(u > d + s || p > c + l)
            }
        },
        Walker: {
            elementId: 0,
            path: null,
            walkerType: null,
            serverTimeDiff: 0,
            containerId: null,
            globalTime: 0,
            isAnimationDone: !1,
            tooltipText: "",
            animationDelay: 0,
            loopAllowed: !0,
            init: function t(e) { //console.dir(params);
                var o = this,
                    n = new Date().getTime();
                this.elementId = e[0], this.containerId = e[1], this.path = e[2], this.serverTimeDiff = 1e3 * e[3] - n, e[4] !== void 0 && (this.tooltipText = e[4]), e[5] !== void 0 && (this.globalTime = 1e3 * e[5] - this.serverTimeDiff), this.walkerType = this.path[0][5], e[6] !== void 0 && (this.animationDelay = 1e3 * e[6]), e[7] !== void 0 && (this.loopAllowed = e[7]), n < this.globalTime && (1e3 * this.path[0][4] - this.serverTimeDiff > n ? setTimeout(function() {
                    o.createWalker()
                }, 1e3 * this.path[0][4] - this.serverTimeDiff - n) : this.createWalker())
            },
            createWalker: function e() {
                if (!this.isAnimationDone) {
                    var t = $("#" + this.containerId),
                        o = $("<div>", {
                            class: "animation_" + this.walkerType + "_12steps not_selectable " + this.walkerType,
                            id: this.elementId,
                            style: "-webkit-animation-delay: " + this.animationDelay + "ms; -moz-animation-delay: " + this.animationDelay + "ms; -ms-animation-delay: " + this.animationDelay + "ms; animation-delay: " + this.animationDelay + "ms;"
                        });
                    if ("" != this.tooltipText) {
                        var n = $("<div>", {
                            class: "tooltip",
                            html: this.tooltipText
                        });
                        o.append(n), this.replaceTooltip(o)
                    }
                    t.append(o), this.animate(o, 0)
                }
            },
            replaceTooltip: function o(t) {
                !0 === t.attr("updated") || (t.parent().on("mouseover", function(o) {
                    var e = t.find("div.tooltip");
                    return 1 > e.length ? void t.off("mouseover") : void(e.hasClass("tooltip_disabled") || ikariam.controller.tooltipController.bindBubbleTip(6, 13, e.html(), o, this, t.hasClass("min_size")))
                }), t.attr("updated", !0))
            },
            animate: function o(e, t) {
                var n = this,
                    r = this.path[t][1],
                    s = this.path[t][0],
                    l = this.path[t][2],
                    d = this.path[t][3],
                    c = 1e3 * this.path[t][4],
                    u = new Date().getTime() + this.serverTimeDiff,
                    p = c - u,
                    m = this.path[t][5]; //Die Richtungsklasse muss bei jedem Wegpunkt neu gesetzt werden damit es immer maximal eine gibt
                //z-index gemäß Wegpunktangabe setzen
                0 < t && ("none" === this.path[t - 1][2] ? e.removeClass("invisible") : e.removeClass(m + this.path[t - 1][2])), "none" === l ? e.addClass("invisible") : e.addClass(m + l), e.css({
                    "z-index": d
                }), "rtl" === ikariam.model.languageDirection ? e.animate({
                    top: r + "px",
                    right: s + "px"
                }, p, "linear", function() {
                    ++t, t < n.path.length ? n.animate(e, t) : n.clearAnimation(n.loopAllowed)
                }) : e.animate({
                    top: r + "px",
                    left: s + "px"
                }, p, "linear", function() {
                    ++t, t < n.path.length ? n.animate(e, t) : n.clearAnimation(n.loopAllowed)
                })
            },
            clearAnimation: function t(e) {
                var o = Math.ceil;
                $("#" + this.elementId).remove();
                var n = new Date().getTime() + this.serverTimeDiff;
                if (n = o(n / 1e3), n *= 1e3, e && !this.isAnimationDone && 0 < this.globalTime && this.globalTime > n) {
                    var r = this;
                    setTimeout(function() {
                        r.loopWalk()
                    }, 0)
                } else this.isAnimationDone = !0
            },
            loopWalk: function e() {
                for (var t = this.path[this.path.length - 1][4] - this.path[0][4], o = 0; o < this.path.length; o++) this.path[o][4] += t;
                this.createWalker()
            },
            isDone: function e() {
                return this.isAnimationDone
            }
        }
    };

function ActionMonitor() {
    var e = Math.floor;
    this.actionMonitor = [], this.execute = function(e, t) {
        return console.log("Action Monitor: executing function " + e + " with params: " + t), this[e](t)
    }, this.addAction = function(t, o, n, r) { // remove old listeners:
        $(t).off(o), "click" === o && (t.onclick = ""), t.callbackEvent = o, t.callbackFunc = n, t.callbackParams = r, $(t).on(o + ".actionHandler", function(o) {
            return t.callbackParams.callbackTarget = $(this), (null == $(this).prop("disabled") || !1 == $(this).prop("disabled")) && ikariam.controller.actionMonitor.execute(t.callbackFunc, t.callbackParams), o.preventDefault(), !1
        }), this.actionMonitor.push(t), console.log("Action Monitor: add action " + n + "(" + r + ") to element " + t.id + " on event " + o)
    }, this.removeAction = function(e) {
        for (var t = this.actionMonitor.length, o = 0; o < t; o++)
            if (this.actionMonitor[o] === e) return console.log("Action Monitor: remove action " + e.callbackFunc + "from element " + e.id + " on event " + e.callbackEvent), $(e).off(e.callbackEvent + ".actionHandler"), e.callbackFunc = null, e.callbackParams = null, e.callbackEvent = null, void this.actionMonitor.splice(o, 1)
    }, this.reset = function() {
        for (var e = this.actionMonitor.length, t = 0; t < e; t++) $(this.actionMonitor[t]).off();
        this.actionMonitor = [], console.log("Action Monitor: clear event listeners!")
    }, this.ajaxHandlerCall = function(e) {
        return ajaxHandlerCall(e), !1
    }, this.buyCitizens = function(e) {
        e[0] ? ikariam.createPopup("citizensPopup", e[1], [e[2], "?action=Premium&function=buyCitizens&cityId=" + e[3], e[5], e[6]], 1) : ajaxHandlerCall("?action=Premium&function=buyCitizens&cityId=" + e[3])
    }, this.confirmBubble = function(e) {
        var t = e[2] !== void 0 && e[2] ? 0 : 1;
        ikariam.createPopup("confirmPopup", "", [e[0], e[1], LocalizationStrings.yes, LocalizationStrings.abort], t)
    }, this.abortBubble = function(e) {
        ikariam.createPopup("confirmPopup", "", [e[0],
            ["ikariam.getPopupController().closePopup('confirmPopup');"], LocalizationStrings.abort
        ])
    }, this.createPopup = function(e) {
        ikariam.getPopupController().closePopup(), ikariam.getPopupController().createPopup(e[0], e[1], [e[2], e[3], e[4], e[5]])
    }, this.formSubmit = function(e) {
        $(e[0]).submit()
    }, this.templeSliderChanged = function(t) {
        var o = ikariam.controller.sliders.slider_temple;
        $("#valuePriests").html(locaNumberFormat(o.actualValue)), $("#valueCitizens").html(locaNumberFormat(t.ini_citizens + t.ini_priests - o.actualValue)), $("#ownConversion").html(numberFormat(100 * (o.actualValue * t.citizens_per_priest / t.max_inhabitants), 2)), $("#conversionIsland").html(numberFormat(100 * (o.actualValue * t.citizens_per_priest / t.max_citizens_on_island), 2)), $("#valueWorkCosts").html(shortenValue(e(t.income - t.ini_costs * (o.actualValue - t.ini_priests)), 6))
    }, this.academySliderChange = function(t) {
        var o = ikariam.controller.sliders.slider_academy;
        o.actualValue === t.startScientists ? $("#inputWorkersSubmit").removeClass("buttonChanged") : $("#inputWorkersSubmit").addClass("buttonChanged"), o.res.setIcons(e(o.actualValue * t.researchProductionFactor)), $("#valueWorkers").html(locaNumberFormat(o.actualValue)), $("#valueCitizens").html(locaNumberFormat(t.startCitizens + t.startScientists - o.actualValue));
        var n = t.researchProductionFactor * o.actualValue;
        $("#valueResearch").html("+" + shortenValue(e(n), 6)), $("#valueWorkCosts").html(shortenValue(e(t.startIncomePerTimeUnit - t.costPerScientist * (o.actualValue - t.startScientists)), 6))
    }, this.piracySliderChange = function(e) {
        var t = ikariam.controller.sliders.slider_piracy;
        0 === t.actualValue ? $("#inputCapturePointsSubmit").removeClass("buttonChanged") : $("#inputCapturePointsSubmit").addClass("buttonChanged");
        var o = t.actualValue * e.crewPointsForCaptureFactor,
            n = e.startCapturePoints - o,
            r = -1;
        for (i = 0; i < e.piracyBonusCrewPoints.length; i++) n > e.piracyBonusCrewPoints[i].capturePoints && (r = i); - 1 < r ? $("#bonusLevel").html(e.piracyBonusCrewPoints[r].capturePoints + " | " + e.piracyBonusCrewPoints[r].bonusCrewPoints) : $("#bonusLevel").html("0 | 0"), 0 < o ? ($("#valueCapturePoints").html("(-" + locaNumberFormat(o) + ")"), $("#valueCrewPoints").html("(+" + locaNumberFormat(t.actualValue) + ")")) : ($("#valueCapturePoints").html(""), $("#valueCrewPoints").html("")), $("#convertDuration").html(ikariam.model.getTimestring(1e3 * (t.actualValue * e.durationFactor + e.durationBase)))
    }, this.resourceSliderChanged = function(t) {
        var o = ikariam.controller.sliders[t.slider_id];
        o.actualValue === t.ini_workers ? $("#inputWorkersSubmit").removeClass("buttonChanged") : $("#inputWorkersSubmit").addClass("buttonChanged"), o.res.setIcons(e(o.actualValue / (1 + .05 * o.actualValue))), $("#valueWorkers").html(locaNumberFormat(o.actualValue)), $("#valueCitizens").html(locaNumberFormat(t.ini_citizens + t.ini_workers - o.actualValue)), $("#valueResource").html("+" + locaNumberFormat(e(t.production_ratio * t.speed_factor * (Math.min(t.max_value, o.actualValue) + Math.max(0, t.overload_factor * (o.actualValue - t.max_value))))));
        var n = o.actualValue - t.ini_workers,
            r = t.ini_income - t.income_per_citizen * n;
        $("#valueWorkCosts").html(locaNumberFormat(e(r)))
    }, this.assignDiSliderChanged = function(e) {
        var t = ikariam.controller.sliders.slider_assignDi;
        t.actualValue === e.ini_value ? $("#inputWorkersSubmit").removeClass("buttonChanged") : $("#inputWorkersSubmit").addClass("buttonChanged"), $("#js_freePoints").html(locaNumberFormat(t.maxValue - t.actualValue)), $("#js_freeAllyPoints").html(locaNumberFormat(t.actualValue - e.min_points))
    }, this.toggleExclusiveInfo = function(e) {
        var t = $("#" + e),
            o = 1 == t.data("visible");
        if ($(document).trigger("closeExclusiveInfo"), !o) {
            var n = t.clone(!0).appendTo("#container"),
                r = $(ikariam.controller.clickTarget).offset(),
                s = r.top,
                l = r.left + ("rtl" === ikariam.model.languageDirection ? -parseInt($(ikariam.controller.clickTarget).css("padding-left")) : $(ikariam.controller.clickTarget).outerWidth()),
                d = $(window).height() + $(window).scrollTop() - s - 20,
                c = "rtl" === ikariam.model.languageDirection ? l - $(window).scrollLeft() : $(window).width() + $(window).scrollLeft() - l;
            n.attr("id", "exclusiveTooltip").css("visibility", "hidden").removeClass("invisible"), n.height() > d && (s -= n.height() - d), n.outerWidth() > c ? "rtl" === ikariam.model.languageDirection ? l = r.left + $(ikariam.controller.clickTarget).outerWidth() : l = r.left - n.outerWidth() : "rtl" === ikariam.model.languageDirection && (l -= n.outerWidth()), n.css({
                top: s + "px",
                left: l + "px",
                visibility: "visible"
            }), t.data("visible", 1), setTimeout(function() {
                $(document).on("closeExclusiveInfo", function() {
                    n.remove(), t.data("visible", 0), $(document).off("closeExclusiveInfo"), $("#container").off("touchend.closeExclusiveInfo")
                }), $("#container").on("touchend.closeExclusiveInfo", function(e) {
                    for (var t = e.target, o = !1; null != t;) {
                        if ("A" == t.tagName) return;
                        t = t.parentNode
                    }
                    e.preventDefault(), $(document).trigger("closeExclusiveInfo")
                })
            }, 0)
        }
    }, this.filterValues = function(e) {
        var t = $(e[0]);
        t.find(e[1]).hide(), t.find(e[2]).show(), ikariam.controller.adjustSizes()
    }, this.ajaxTestAction = function(e) {
        $("#" + e.params[0]).html(ikariam.controller.sliders.slider_ajaxTest.actualValue)
    }
}

function hideExclusiveTooltip() {
    $("#exclusiveTooltip").hasClass("invisible") || $("#exclusiveTooltip").addClass("invisible")
}
var BubbleTips = {
        opacity: .9,
        tooltipWidth: 200,
        bubbleNode: null,
        infoNode: null,
        offsetLeft: -25,
        offsetTop: 10,
        tooltip: null,
        init: function e() {
            var t = $(".bubble_tip"),
                o = $(".info_tip");
            if (0 === t.length) var n = $("<span>", {
                class: "bubble_tip"
            }).css({
                position: "absolute",
                "z-index": 652e4
            });
            else var n = t;
            if (0 === o.length) var r = $("<span>", {
                class: "info_tip"
            }).css({
                position: "absolute",
                "z-index": 6519999
            });
            else var r = o;
            return this.infoNode = r, this.bubbleNode = n, $("body").append(n).append(r), this
        },
        bindBubbleTip: function l(e, t, o, n, r, s) {
            var d = Math.max;
            if (13 === t) {
                if (this.infoNode.data("target") === r) return;
                this.cleanupInfoTips()
            } else this.cleanupBubbleTips();
            var c = null;
            switch (e) {
                case 1:
                    c = $("#advCities");
                    break;
                case 2:
                    c = $("#advMilitary");
                    break;
                case 3:
                    c = $("#advResearch");
                    break;
                case 4:
                    c = $("#advDiplomacy");
                    break;
                case 5:
                    c = 12 !== t && ikariam.controller && ikariam.controller.clickTarget ? ikariam.controller.clickTarget : null, c = $(c);
                    break;
                case 6:
                    c = $(r), this.infoNode.data("target", r);
                    break;
                default:
                    return
            }
            switch (t) {
                case 10:
                    this.tooltip = this.createBubble(o, !0, !1);
                    break;
                case 11:
                    this.tooltip = this.createBubble(o, !1, !1);
                    break;
                case 12:
                    this.tooltip = this.createBubble(o, !1, !0);
                    break;
                case 13: // info, see also animations.js!
                    var u = c.find(".tooltip").data("forwardCss");
                    this.infotip = this.createTooltip(o, s, u);
                    break;
                default:
                    return
            } // tooltips, following the mouse position
            if (13 === t) {
                this.infoNode.append(this.infotip);
                var p = this,
                    m = 20; //Let it go just 20px out of bounds so it doesn't look too weird
                return c.on("mousemove", function(t) { // if(e == null) e = w.event;
                    var e = p.offsetLeft,
                        o = p.offsetTop;
                    t.pageX || t.pageY ? (e += t.pageX, o += t.pageY + (isIE ? 10 : 0)) : (t.clientX || t.clientY) && (e += t.clientX + p.posRef().scrollLeft, o += t.clientY + p.posRef().scrollTop), "ltr" == ikariam.model.languageDirection ? e + $(p.infotip).outerWidth() - 20 > $(window).width() + $(document).scrollLeft() && (e = e - $(p.infotip).outerWidth() + 20) : e < $(p.infotip).outerWidth() - 20 && (e = e + $(p.infotip).outerWidth() + 20), p.infoNode.css({
                        top: o + "px",
                        left: e + "px"
                    })
                }), void c.on("mouseout", function(t) {
                    p.cleanupInfoTips()
                })
            } // feedback tips: stay in place until cleared (after 5000ms or by click, scroll, switchtab, close view etc.)
            this.tooltip.location = e, this.tooltip.type = t, this.bubbleNode.append(this.tooltip); // Ist ein SpecialEvent aktiv?
            var g = "";
            if ($("#btnSpecialEvent a").hasClass("halloweenDeactivationButton") && (g = "halloween"), 0 < c.length && 5 !== e) this.setBubbleTipPosition(c, g);
            else { // try to append feedback tip to last clicked element
                // last clicked element not found: use mouse click position
                var h = this.getOffset(c[0]),
                    b = h[0],
                    v = h[1];
                if (12 == t) {
                    var x = $(window).scrollTop(),
                        C = $(window).scrollLeft(),
                        y = v - x - 5,
                        _ = $(window).height() + x - v - 5,
                        k = b - C - 5,
                        T = $(window).width() + C - b - 5,
                        S = !1,
                        P = !1;
                    this.tooltip.height() > _ && y > _ && (P = !0), this.tooltip.width() > k && k < T && (S = !0), S || (b -= this.tooltip.width()), S && P ? ($(this.tooltip).addClass("flip_both"), v -= this.tooltip.height()) : S ? $(this.tooltip).addClass("flip_x") : P && ($(this.tooltip).addClass("flip_y"), v -= this.tooltip.height())
                }
                10 == t && "" === o && (b = d(0, c.offset().left + c.width() + 5), v = c.offset().top + c.height() - 15), this.bubbleNode.css({
                    left: b + "px",
                    top: v + "px"
                })
            } // animate feedback tips (fade in & out for error/success, confirm tips will appear only)
            12 === t ? this.tooltip.css("opacity", this.opacity) : this.createFadeAnim(this.tooltip, 1, !0)
        },
        createBubble: function n(e, t, o) {
            if (t || null != e && 0 != e.length) {
                if (!t || o || "" !== e) {
                    var r = "yellowTip",
                        s = null; // confirm/default
                    t ? (s = $("<span>", {
                        class: "confirmCheckmark"
                    }), r = "greenTip") : !o && (s = $("<span>", {
                        class: "errorCross"
                    }), r = "redTip");
                    var l = $("<div>", {
                        class: "feedbackTip bubbleTooltip " + r
                    });
                    $("<div>", {
                        class: "top"
                    }).appendTo(l), $("<div>", {
                        class: "repeat"
                    }).html(e).appendTo(l), $("<div>", {
                        class: "bottom"
                    }).appendTo(l), null !== s && l.append(s)
                } else if (t) var l = $("<div>", {
                    class: "feedbackTip confirmCheckmark"
                });
                return l.css("opacity", 0), l
            }
        },
        createTooltip: function n(e, t, o) {
            var r = {
                width: t ? "auto" : "200px",
                display: "block",
                opacity: this.opacity
            };
            if (o)
                for (var s = o.split(";"), l = 0, d; l < s.length; ++l) d = s[l].split(":"), 2 === d.length && (r[d[0]] = d[1]);
            return $("<div>", {
                class: "infoTip"
            }).html(e).css(r)[0]
        },
        createFadeAnim: function n(e, t, o) {
            var r = this,
                s;
            return 0 < t ? e.css("opacity", 0).fadeTo(1e3, this.opacity, "easeOutQuad", function() {
                o && w.setTimeout(function() {
                    r.createFadeAnim(e, 0, !1)
                }, 5e3)
            }) : e.css("opacity", this.opacity).fadeTo(1e3, 0, "easeOutQuad", r.cleanupBubbleTips()), s
        },
        cleanupBubbleTips: function e() {
            null === this.tooltip || (this.tooltip.remove(), this.tooltip = null)
        },
        cleanupInnerBubbleTips: function e() {
            null !== this.tooltip && 5 === this.tooltip.location && (this.tooltip.remove(), this.tooltip = null)
        },
        cleanupInfoTips: function e() {
            this.infoNode.data("target", null), this.infoNode.html("")
        },
        posRef: function e() {
            return doc.documentElement.scrollTop ? doc.documentElement : doc.body
        },
        setBubbleTipPosition: function o(e, t) {
            var n = 0;
            "halloween" == t && (n = 11), this.bubbleNode.css({
                left: Math.max(0, e.offset().left - 150) + "px",
                top: e.offset().top + 61 + "px"
            })
        },
        getOffset: function t(e) {
            var o = Math.max;
            if (e === void 0 || null === e || null === e.offsetParent) return ikariam.controller && ikariam.controller.clickPosition ? ikariam.controller.clickPosition : 0;
            var n = $(e).offset();
            return [o(5, n.left), o(5, n.top + $(e).outerHeight())]
        }
    },
    counterMarker = 0;
ikariam.IngameCounter = {
    popupTitle: "",
    popupContent: [],
    popupButton: [],
    popupCloseButtonText: "",
    timeLeft: 0,
    timeout: 0,
    currentTime: 0,
    counterScroll: {},
    scrollText: "",
    scrollCssClass: "",
    scrollType: "",
    init: function t(e) {
        console.log("INIT ikariam.IngameCounter with dataSet:"), ++counterMarker;
        var o = this;
        this.counterType = e.counterType, this.counterType = "directLink" == this.counterType ? "directLink" : "popup", this.timeLeft = e.timeLeft, this.timeout = e.timeout, this.currentTime = e.currentTime, this.scrollText = e.scrollText, this.scrollCssClass = e.scrollCssClass, this.scrollType = e.scrollType;
        var n = "btnIngameCountdown" + counterMarker,
            r = "ingameCountdown" + counterMarker,
            s = "hhTimerOffset" + counterMarker;
        if ("popup" == this.counterType) { // Counter mit Popup
            var l = e.popupTitle,
                d = e.popupContent,
                c = e.popupButton,
                u = e.popupCloseButtonText; // the main container
            this.counterScroll[counterMarker] = createEl("div", n, "btnIngameCountdown " + this.scrollType + " " + this.scrollCssClass, null, null, {
                mouseup: function e() {
                    2 == c.length ? (ikariam.getPopupController().closePopup(), ikariam.getPopupController().createPopup("genericPopupCounter" + counterMarker, l, [d, c[0], c[1], u])) : (ikariam.getPopupController().closePopup(), ikariam.getPopupController().createPopup("genericPopupCounter" + counterMarker, l, [d, ["ikariam.getPopupController().closePopup('genericPopupCounter" + counterMarker + "');"], u]))
                }
            })
        } else { // Counter mit Direktlink
            var p = e.targetUrl,
                m = e.targetLinkType; // the main container
            this.counterScroll[counterMarker] = createEl("div", "btnIngameCountdown" + counterMarker, "btnIngameCountdown " + this.scrollType + " " + this.scrollCssClass, null, null, {
                mouseup: function e() {
                    ikariam.getPopupController().closePopup(), "" == m ? ajaxHandlerCall(p) : window.open(p)
                }
            })
        } // the text label on the scroll
        var g = createEl("p", null, "bold ingameCountdownText", null, this.scrollText, null, this.counterScroll[counterMarker]),
            h = createEl("p", r, "ingameCountdown bold green", null, "-", null, this.counterScroll[counterMarker]),
            b = doc.createElement("input"); // the countdown label on the scroll
        // hidden field... do not use createEl here, because IE7/8 requires the "type" attribute to be set before anything else.
        b.type = "hidden", b.id = s, b.value = this.timeLeft, this.counterScroll[counterMarker].appendChild(b), $("#container #eventDiv")[0].appendChild(this.counterScroll[counterMarker]); // create countdown object
        var v = ingameCountdown({
            enddate: this.timeout,
            currentdate: this.currentTime,
            el: r,
            offsetEl: s
        });
        $(v).on("update", function() {
                var e = o.timeLeft,
                    t = Math.floor($("#" + s)[0].value / 1e3),
                    l = e - t; // only display the countdown if the time difference between now and the end timestamp is less than 60 minutes.
                0 < e ? ($("#" + n).css("display", "block"), 300 >= t + l && $("#" + r).css("color", "#f00")) : $("#" + n).css("display", "none")
            }) // countdown finished: disappear!
            .on("finished", function() {
                $("#" + n).css("display", "none")
            })
    }
};