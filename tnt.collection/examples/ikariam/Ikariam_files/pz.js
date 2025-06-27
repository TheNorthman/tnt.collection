(function pz(win, doc, undefined) {
    var initalized = false;
    var initializing = false;
    var deferedCalls = [];
    var config = getConfig();
    if (win.setPixel) return;

    function derefer(callback) {
        return function() {
            if (initalized) {
                return callback.apply(null, arguments)
            }
            deferedCalls.push([callback, arguments]);
            init()
        }
    }

    function hashString(str) {
        return (str || "").split("").reduce(function(hash, c) {
            return (hash << 5) - hash + c.charCodeAt(0)
        }, 0)
    }

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        return parts.length === 2 ? parts.pop().split(";").shift() : undefined
    }

    function getConfig() {
        var scriptTag = doc.getElementById("pixelzirkus");
        if (!scriptTag || !scriptTag.src) {
            throw new Error('Could not retrieve Pixel Zirkus Client script tag. It requires to have id "pixelzirkus"!')
        }
        var originParts = scriptTag.src.split("/");
        var dataset = scriptTag.dataset;
        if (!dataset.defaultServerId || !dataset.defaultProduct || !dataset.defaultLanguage) {
            throw new Error('Attributes "data-default-project", "data-default-language" and "data-default-server-id" are required to be set on the pixel zirkus client script tag.')
        }
        return {
            appRoot: scriptTag.src.substr(0, scriptTag.src.lastIndexOf("/")),
            baseUri: dataset.baseUri || originParts[0] + "//" + originParts[2],
            defaultServerId: dataset.defaultServerId,
            defaultProduct: dataset.defaultProduct,
            defaultLanguage: dataset.defaultLanguage,
            gfEvents: (dataset.gfEvents || "GFCookieConsentChange,GFChallengePresented").split(",").map(e => e.trim())
        }
    }

    function getCookieConsentConfig() {
        var scriptTag = doc.getElementById("cookiebanner");
        var dataSet = scriptTag ? scriptTag.dataset : {};
        var consentCookieDomain = scriptTag ? dataSet.consentCookieDomain ? "." + dataSet.consentCookieDomain : window.location.hostname : undefined;
        var consentCookieNamne = consentCookieDomain ? "gf-cookie-consent-" + hashString(dataSet.consentCookieDomain || window.location.hostname) : undefined;
        return {
            consentCookieDomain: consentCookieDomain,
            projectId: dataSet.projectId,
            consentCookieNamne: consentCookieNamne
        }
    }

    function init() {
        if (initializing) return;
        initializing = true;
        var fpScript1Loaded = false,
            fpScript2Loaded = false;
        var initialized = function() {
            if (!fpScript1Loaded || !fpScript2Loaded) return;
            initalized = true;
            initializing = false;
            for (var i = 0; i < deferedCalls.length; i++) {
                deferedCalls[i][0].apply(null, deferedCalls[i][1])
            }
            deferedCalls = []
        };
        loadScript(config.appRoot + "/E6gg7P33.js", function() {
            fpScript1Loaded = true;
            initialized()
        });
        loadScript(config.appRoot + "/GT7h68ox.js", function() {
            fpScript2Loaded = true;
            initialized()
        })
    }

    function loadScript(source, resolve) {
        var script = doc.createElement("script");
        var prior = doc.getElementsByTagName("script")[0];
        script.async = true;
        script.defer = true;

        function onloadHandler(_, isAbort) {
            if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                script.onload = null;
                script.onreadystatechange = null;
                resolve()
            }
        }
        script.onload = onloadHandler;
        script.onreadystatechange = onloadHandler;
        script.onerror = function() {
            parent.pz.hasFailed = true
        };
        script.src = source;
        prior.parentNode.insertBefore(script, prior)
    }

    function setPixel(meta) {
        try {
            injectDefaults(meta);
            injectEvaluationId(meta);
            injectCookieConsent(meta);
            injectGfPzToken(meta);
            var fp = injectFingerprint(meta);
            submitPixel(config.baseUri + "/do2/simple", meta, function(response) {
                meta["cs_marketing"] === true && createPixelIframe(response);
                setSecondPixel(meta, fp)
            }, function() {})
        } catch (err) {
            console.error(err)
        }
    }

    function firePixels(pixels) {
        try {
            var fp = "unknown";
            try {
                fp = (new Fingerprint).get()
            } catch (e) {}
            var data = {
                pixels: JSON.stringify(pixels.map(function(pixel) {
                    injectDefaults(pixel);
                    injectCookieConsent(pixel);
                    injectGfPzToken(pixel);
                    return pixel
                })),
                fingerprint: fp
            };
            submitPixel(config.baseUri + "/do2/multi", data, function(response) {
                var constent = getCookieConsent();
                constent.marketing && createPixelIframe(response)
            }, function() {})
        } catch (err) {
            console.error(err)
        }
    }

    function setSecondPixel(meta, baseFingerprint) {
        meta.fingerprint = baseFingerprint;
        meta.location = "fp_eval";
        meta.fp2_config_id = 1;
        try {
            injectFingerprint2(meta, function() {
                submitPixel(config.baseUri + "/do2/simple", meta, function(response) {
                    meta["cs_marketing"] === true && createPixelIframe(response)
                }, function() {})
            })
        } catch (err) {
            console.error(err)
        }
    }

    function injectDefaults(meta) {
        if (!meta.page) {
            meta.page = win.location.href
        }
        if (!meta.referrer) {
            meta.referrer = doc.referrer
        }
        if (!meta.product) {
            meta.product = config.defaultProduct
        }
        if (!meta.language) {
            meta.language = config.defaultLanguage
        }
        if (!meta.server_id && !meta["server-id"]) {
            meta.server_id = config.defaultServerId
        }
    }

    function injectEvaluationId(meta) {
        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == "x" ? r : r & 3 | 8;
            return v.toString(16)
        });
        meta.fp_eval_id = uuid
    }

    function injectCookieConsent(meta) {
        var consentConfig = getCookieConsentConfig();
        var constent = getCookieConsent();
        meta["cs_version"] = "gameforge";
        meta["cs_consent_cookie_domain"] = consentConfig.consentCookieDomain;
        meta["cs_project_id"] = consentConfig.projectId;
        meta["cs_epoch"] = getCookieConsentEpoch(consentConfig.consentCookieNamne);
        meta["cs_necessary"] = !!constent["necessary"];
        meta["cs_preferences"] = !!constent["preferences"];
        meta["cs_statistics"] = !!constent["statistics"];
        meta["cs_marketing"] = !!constent["marketing"];
        meta["cs_failed"] = !!constent["failed"]
    }

    function injectGfPzToken(data) {
        let gf_pz_token = getCookie("gf_pz_token");
        if (gf_pz_token) {
            data["gf_pz_token"] = gf_pz_token
        }
        let gf_pz_token_sandbox = getCookie("gf_pz_token_sandbox");
        if (gf_pz_token_sandbox) {
            data["gf_pz_token_sandbox"] = gf_pz_token_sandbox
        }
    }

    function injectFingerprint(meta) {
        if (typeof Fingerprint === "undefined") return;
        try {
            var startTime = win.performance.now();
            var fp = (new Fingerprint).get();
            var exec_time = win.performance.now() - startTime;
            meta.fingerprint = fp;
            meta.fp_exec_time = exec_time.toFixed(2);
            return fp
        } catch (err) {
            meta.fingerprint = "unknown";
            meta.fp_exec_time = -1;
            console.error(err)
        }
    }

    function injectFingerprint2(meta, resolve) {
        if (typeof Fingerprint2 === "undefined") return;
        try {
            var startTime = win.performance.now();
            (new Fingerprint2).get(function(fingerprint) {
                meta.fp2_value = fingerprint;
                var exec_time = win.performance.now() - startTime;
                meta.fp2_exec_time = exec_time.toFixed(2);
                resolve()
            })
        } catch (err) {
            console.error(err)
        }
    }

    function getCookieConsent() {
        return typeof win.gfCookieConsent !== "undefined" && typeof win.gfCookieConsent.consent !== "undefined" ? win.gfCookieConsent.consent : {
            necessary: true,
            preferences: false,
            statistics: false,
            marketing: false,
            failed: true
        }
    }

    function getCookieConsentEpoch(cookieName) {
        var cookieValue = cookieName ? decodeURIComponent(getCookie(cookieName)) : "";
        var parts = cookieValue.split("|");
        return parts.length === 3 ? parseInt(parts[2]) : 0
    }

    function submitPixel(url, body, success, error) {
        var data = [];
        for (var key in body) {
            data.push(encodeURIComponent(key) + "=" + encodeURIComponent(body[key]))
        }
        var request = new XMLHttpRequest;
        request.withCredentials = true;
        request.addEventListener("load", function() {
            if (this.status >= 200 && this.status < 300) success(this.responseText);
            else if (typeof error === "function") error()
        });
        request.open("POST", url);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.send(data.join("&"))
    }

    function createPixelIframe(body) {
        var rem = doc.createElement("div");
        doc.body.appendChild(rem);
        var iframe = doc.createElement("iframe");
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.display = "block";
        iframe.style.border = "none";
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("sandbox", "allow-forms allow-popups allow-same-origin allow-scripts");
        rem.appendChild(iframe);
        var iframeDoc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow && iframe.contentWindow.document;
        iframeDoc.body.insertAdjacentHTML("beforeend", body);
        runScriptTags(iframeDoc.body)
    }

    function runScriptTags(element) {
        var scriptTags = element.getElementsByTagName("script");
        Object.keys(scriptTags).map(function(key) {
            runScriptTag(scriptTags[key])
        })
    }

    function runScriptTag(element) {
        var clone = cloneScriptTag(element);
        element.parentElement.insertBefore(clone, element.nextElementSibling || null);
        element.parentElement.removeChild(element)
    }

    function cloneScriptTag(element) {
        var clone = doc.createElement("script");
        for (var i = 0; i < element.attributes.length; i++) {
            var name = element.attributes[i].name;
            var value = element.attributes[i].value;
            value !== undefined && value !== "" && clone.setAttribute(name, value)
        }
        clone.text = element.text;
        return clone
    }
    win.pixelzirkus = {
        setDefaultProduct: function(product) {
            config.defaultProduct = product
        },
        setDefaultServerId: function(serverId) {
            config.defaultServerId = serverId
        },
        setDefaultLanguage: function(language) {
            config.defaultLanguage = language
        }
    };
    win.setPixel = derefer(setPixel);
    win.firePixels = derefer(firePixels);
    win.capturePixel = function(meta) {
        injectDefaults(meta);
        return meta
    };
    if (config.gfEvents.includes("GFCookieConsentChange")) {
        win.addEventListener("GFCookieConsentChange", derefer(function() {
            setPixel({
                location: "CONSENT"
            })
        }))
    }
    if (config.gfEvents.includes("GFChallengePresented")) {
        win.addEventListener("GFChallengePresented", derefer(function(e) {
            setPixel({
                location: "challenge",
                challenge_id: e.detail.challengeId
            })
        }))
    }
    if (config.gfEvents.includes("GFUserSignUp")) {
        win.addEventListener("GFUserSignUp", derefer(function(e) {
            setPixel({
                location: "portal_signup",
                product: "portal",
                server_id: 1,
                portal_user_id: e.detail.userId
            })
        }))
    }
    if (config.gfEvents.includes("GFGameAccountCreate")) {
        win.addEventListener("GFGameAccountCreate", derefer(function(e) {
            setPixel({
                location: "signup",
                portal_account_id: e.detail.accountId,
                portal_doi_present: e.detail.validated,
                portal_user_id: e.detail.userId,
                product: e.detail.guls.game,
                language: e.detail.guls.language,
                server_id: e.detail.guls.server,
                user_name: e.detail.displayName,
                user_id: e.detail.guls.user,
                user_email: e.detail.email
            })
        }))
    }
})(window, document);