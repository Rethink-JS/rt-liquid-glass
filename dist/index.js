/*! @rethink-js/rt-liquid-glass v1.0.0 | MIT */
(() => {
  // src/index.js
  (function() {
    var RT_NS = "rtLiquidGlass";
    if (window[RT_NS] && window[RT_NS].__initialized) return;
    function getAttrFrom(el, name) {
      if (!el) return null;
      if (!el.hasAttribute(name)) return null;
      return el.getAttribute(name);
    }
    function getAttr(name) {
      var html = document.documentElement;
      var body = document.body;
      var v = getAttrFrom(html, name);
      if (v !== null) return v;
      v = getAttrFrom(body, name);
      if (v !== null) return v;
      return null;
    }
    function hasAttrAnywhere(name) {
      var html = document.documentElement;
      var body = document.body;
      if (html && html.hasAttribute(name)) return true;
      if (body && body.hasAttribute(name)) return true;
      return false;
    }
    function parseBool(v, def) {
      if (v === null || v === void 0) return def;
      var s = String(v).trim().toLowerCase();
      if (s === "") return true;
      if (s === "true" || s === "1" || s === "yes" || s === "y" || s === "on")
        return true;
      if (s === "false" || s === "0" || s === "no" || s === "n" || s === "off")
        return false;
      return def;
    }
    function parseNum(v, def) {
      if (v === null || v === void 0) return def;
      var s = String(v).trim();
      if (!s.length) return def;
      var n = Number(s);
      return Number.isFinite(n) ? n : def;
    }
    function parseStr(v, def) {
      if (v === null || v === void 0) return def;
      var s = String(v);
      return s.length ? s : def;
    }
    function clamp(n, min, max) {
      if (n < min) return min;
      if (n > max) return max;
      return n;
    }
    function safeCSSSupports(prop, value) {
      try {
        if (!window.CSS || typeof CSS.supports !== "function") return false;
        return CSS.supports(prop, value);
      } catch (e) {
        return false;
      }
    }
    function isFirefoxUA() {
      try {
        return String(navigator.userAgent || "").toLowerCase().indexOf("firefox") > -1;
      } catch (e) {
        return false;
      }
    }
    function ensureAutoEnableIfNeeded() {
      var body = document.body;
      if (!body) return;
      var nodes = document.querySelectorAll("[rt-liquid-glass]");
      var hasNodes = nodes && nodes.length > 0;
      if (!hasAttrAnywhere("rt-liquid-glass") && hasNodes) {
        body.setAttribute("rt-liquid-glass", "");
      }
    }
    function isAttrPresent(v) {
      return v !== null && v !== void 0;
    }
    function readOptions(getLocal) {
      var prefix = "rt-liquid-glass-";
      function localOrGlobal(name) {
        var v = getLocal(name);
        if (isAttrPresent(v)) return v;
        return getAttr(name);
      }
      function getRaw(name) {
        return localOrGlobal(prefix + name);
      }
      function hasRaw(name) {
        return isAttrPresent(getRaw(name));
      }
      var opts = {};
      if (hasRaw("blur")) {
        var blur = parseNum(getRaw("blur"), void 0);
        if (blur !== void 0) opts.blur = blur;
      }
      if (hasRaw("scale")) {
        var scale = parseNum(getRaw("scale"), void 0);
        if (scale !== void 0) opts.scale = scale;
      }
      if (hasRaw("map")) {
        var mapQ = parseNum(getRaw("map"), void 0);
        if (mapQ !== void 0) opts.map = mapQ;
      }
      if (hasRaw("reveal")) {
        var revealRaw = getRaw("reveal");
        var s = String(revealRaw || "").trim();
        if (s === "" || s.toLowerCase() === "true") {
          opts.reveal = true;
        } else if (s.toLowerCase() === "false") {
          opts.reveal = false;
        } else {
          opts.reveal = true;
          opts.revealDuration = s;
        }
      }
      if (hasRaw("disable-firefox")) {
        opts.disableFirefox = parseBool(getRaw("disable-firefox"), true);
      }
      if (hasRaw("fallback-blur")) {
        var fb = parseNum(getRaw("fallback-blur"), void 0);
        if (fb !== void 0) opts.fallbackBlur = fb;
      }
      if (hasRaw("base-bg")) {
        opts.baseBg = parseStr(getRaw("base-bg"), "");
      }
      if (hasRaw("transition-ms")) {
        var tms = parseNum(getRaw("transition-ms"), void 0);
        if (tms !== void 0) opts.transitionMs = tms;
      }
      if (hasRaw("observe-threshold")) {
        var thr = parseNum(getRaw("observe-threshold"), void 0);
        if (thr !== void 0) opts.observeThreshold = thr;
      }
      if (hasRaw("observe-root-margin")) {
        var rm = parseStr(getRaw("observe-root-margin"), "");
        if (rm) opts.observeRootMargin = rm;
      }
      var extra = localOrGlobal(prefix + "options-json");
      if (extra) {
        try {
          var parsed = JSON.parse(extra);
          if (parsed && typeof parsed === "object") {
            for (var k in parsed) opts[k] = parsed[k];
          }
        } catch (e) {
        }
      }
      return opts;
    }
    function sanitizeOptionsForLog(opts) {
      var out = {};
      for (var k in opts) {
        if (!Object.prototype.hasOwnProperty.call(opts, k)) continue;
        var v = opts[k];
        if (typeof v === "function") out[k] = "[Function]";
        else out[k] = v;
      }
      return out;
    }
    function init() {
      ensureAutoEnableIfNeeded();
      var enabledRoot = hasAttrAnywhere("rt-liquid-glass");
      var nodes = document.querySelectorAll("[rt-liquid-glass]");
      var hasNodes = nodes && nodes.length > 0;
      var shouldRun = enabledRoot || hasNodes;
      if (!shouldRun) return;
      var debug = parseBool(getAttr("rt-liquid-glass-debug"), true);
      var supportsBackdrop = safeCSSSupports("backdrop-filter", "none") || safeCSSSupports("-webkit-backdrop-filter", "none");
      var disableFirefox = parseBool(
        getAttr("rt-liquid-glass-disable-firefox"),
        true
      );
      var isFirefox = isFirefoxUA();
      var enableLiquidEffect = supportsBackdrop && !(disableFirefox && isFirefox);
      var baseBg = parseStr(getAttr("rt-liquid-glass-base-bg"), "") || "rgba(255, 255, 255, 0.025)";
      var transitionMs = parseNum(getAttr("rt-liquid-glass-transition-ms"), 300);
      var observeThreshold = parseNum(
        getAttr("rt-liquid-glass-observe-threshold"),
        0.15
      );
      observeThreshold = clamp(observeThreshold, 0, 1);
      var observeRootMargin = parseStr(getAttr("rt-liquid-glass-observe-root-margin"), "") || "0px";
      var style = document.createElement("style");
      style.innerHTML = "\n[rt-liquid-glass]{\n  background:" + baseBg + ";\n  display:inline-block;\n  position:relative;\n  overflow:hidden;\n  transition:backdrop-filter " + transitionMs + "ms ease,-webkit-backdrop-filter " + transitionMs + "ms ease,opacity " + transitionMs + 'ms ease;\n}\n[rt-liquid-glass="false"]{\n  backdrop-filter:none;\n  -webkit-backdrop-filter:none;\n  background:transparent;\n}\n[rt-liquid-glass].rt-reveal-hidden{\n  opacity:0;\n  transition:opacity 0s;\n}\n[rt-liquid-glass].rt-reveal-visible{\n  opacity:1;\n  transition:opacity var(--rt-reveal-duration, 1.0s) ease;\n}';
      if (enableLiquidEffect) {
        style.innerHTML += "\n[rt-liquid-glass]{\n  -webkit-backdrop-filter:var(--rt-liquid-final-filter, none);\n  backdrop-filter:var(--rt-liquid-final-filter, none);\n}";
      } else {
        style.innerHTML += "\n[rt-liquid-glass]{\n  -webkit-backdrop-filter:blur(var(--rt-fallback-blur, 10px));\n  backdrop-filter:blur(var(--rt-fallback-blur, 10px));\n}";
      }
      document.head.appendChild(style);
      var svgContainer = null;
      if (enableLiquidEffect) {
        svgContainer = document.createElement("div");
        svgContainer.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;";
        document.body.appendChild(svgContainer);
      }
      var observerOptions = {
        root: null,
        threshold: observeThreshold,
        rootMargin: observeRootMargin
      };
      var revealObserver = null;
      if ("IntersectionObserver" in window) {
        revealObserver = new IntersectionObserver(function(entries, observer) {
          for (var i = 0; i < entries.length; i++) {
            var entry = entries[i];
            if (!entry.isIntersecting) continue;
            var el = entry.target;
            el.classList.remove("rt-reveal-hidden");
            el.classList.add("rt-reveal-visible");
            observer.unobserve(el);
          }
        }, observerOptions);
      }
      function createDisplacementMap(width, height, radius) {
        var strokeWidth = Math.min(width, height) * 0.15;
        var blurStd = strokeWidth * 0.5;
        return '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + " " + height + '"><defs><linearGradient id="gradX" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#000000" /><stop offset="100%" stop-color="#ff0000" /></linearGradient><linearGradient id="gradY" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#000000" /><stop offset="100%" stop-color="#00ff00" /></linearGradient><filter id="blurEdge"><feGaussianBlur in="SourceGraphic" stdDeviation="' + blurStd + '" /></filter></defs><rect width="100%" height="100%" fill="url(#gradX)" /><rect width="100%" height="100%" fill="url(#gradY)" style="mix-blend-mode: screen;" /><rect x="0" y="0" width="' + width + '" height="' + height + '" rx="' + radius + '" ry="' + radius + '" fill="none" stroke="#808080" stroke-width="' + strokeWidth * 2 + '" filter="url(#blurEdge)" /></svg>';
      }
      function getBorderRadiusPx(el) {
        try {
          var cs = getComputedStyle(el);
          var br = cs ? cs.borderTopLeftRadius : "";
          var n = parseFloat(br);
          return Number.isFinite(n) ? n : 0;
        } catch (e) {
          return 0;
        }
      }
      function ensureMeasuredSize(el) {
        var rect = null;
        try {
          rect = el.getBoundingClientRect();
        } catch (e) {
          rect = null;
        }
        var w = rect && rect.width ? rect.width : el.offsetWidth || 0;
        var h = rect && rect.height ? rect.height : el.offsetHeight || 0;
        return { w, h };
      }
      function applyReveal(el, opts) {
        if (!opts || !opts.reveal) return;
        if (opts.revealDuration) {
          el.style.setProperty("--rt-reveal-duration", opts.revealDuration);
        }
        el.classList.add("rt-reveal-hidden");
        if (revealObserver) {
          revealObserver.observe(el);
        } else {
          el.classList.remove("rt-reveal-hidden");
          el.classList.add("rt-reveal-visible");
        }
      }
      function applyFallback(el, opts) {
        var blur = opts && typeof opts.blur === "number" ? opts.blur : 0;
        var fallbackBlur = opts && typeof opts.fallbackBlur === "number" ? opts.fallbackBlur : 10;
        var finalBlur = blur > 0 ? blur : fallbackBlur;
        finalBlur = clamp(finalBlur, 0, 200);
        el.style.setProperty("--rt-fallback-blur", finalBlur + "px");
      }
      function applyLiquid(el, idx, opts) {
        if (!svgContainer) return;
        var blur = opts && typeof opts.blur === "number" ? opts.blur : 0;
        var scale = opts && typeof opts.scale === "number" ? opts.scale : 30;
        var mapQ = opts && typeof opts.map === "number" ? opts.map : null;
        blur = clamp(blur, 0, 200);
        scale = clamp(scale, 0, 300);
        var size = ensureMeasuredSize(el);
        var elWidth = size.w;
        var elHeight = size.h;
        if (!elWidth || !elHeight) {
          applyFallback(el, opts);
          return;
        }
        var elRadius = getBorderRadiusPx(el);
        var mapWidth = elWidth;
        var mapHeight = elHeight;
        var mapRadius = elRadius;
        if (mapQ && mapQ > 0 && mapQ < Math.max(elWidth, elHeight)) {
          var ratio = mapQ / Math.max(elWidth, elHeight);
          mapWidth = Math.max(1, Math.floor(elWidth * ratio));
          mapHeight = Math.max(1, Math.floor(elHeight * ratio));
          mapRadius = elRadius * ratio;
        }
        mapWidth = Math.max(1, Math.floor(mapWidth));
        mapHeight = Math.max(1, Math.floor(mapHeight));
        var uniqueId = "rt-liquid-" + idx;
        var mapSvgString = createDisplacementMap(mapWidth, mapHeight, mapRadius);
        var mapUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(mapSvgString);
        var filterSvg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        filterSvg.setAttribute("id", "svg-" + uniqueId);
        filterSvg.innerHTML = '\n<filter id="filter-' + uniqueId + '" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">\n  <feImage href="' + mapUrl + '" result="dispMap" x="0" y="0" width="' + mapWidth + '" height="' + mapHeight + '" preserveAspectRatio="none" />\n  <feDisplacementMap in="SourceGraphic" in2="dispMap" scale="' + scale + '" xChannelSelector="R" yChannelSelector="G" />\n</filter>';
        svgContainer.appendChild(filterSvg);
        var blurPart = blur > 0 ? " blur(" + blur + "px)" : "";
        var urlPart = "url(#filter-" + uniqueId + ")";
        el.style.setProperty("--rt-liquid-final-filter", urlPart + blurPart);
      }
      function shouldDisableEl(el) {
        var v = getAttrFrom(el, "rt-liquid-glass");
        if (v === "false") return true;
        return false;
      }
      function buildPerElOptions(el) {
        var opts = readOptions(function(name) {
          return getAttrFrom(el, name);
        });
        if (typeof opts.blur !== "number") opts.blur = 0;
        if (typeof opts.scale !== "number") opts.scale = 30;
        if (opts.map === void 0) opts.map = null;
        if (opts.reveal === void 0) {
          var rawReveal = getAttrFrom(el, "rt-liquid-glass-reveal");
          opts.reveal = rawReveal !== null && rawReveal !== "false";
          if (rawReveal && rawReveal !== "true") {
            var s = String(rawReveal).trim();
            if (s && s.toLowerCase() !== "false") opts.revealDuration = s;
          }
        }
        return opts;
      }
      function makeApi() {
        var api2 = {
          __initialized: true,
          isLiquidEnabled: function() {
            return enableLiquidEffect;
          },
          supportsBackdrop: function() {
            return supportsBackdrop;
          },
          refresh: function() {
            var els = document.querySelectorAll("[rt-liquid-glass]");
            for (var i = 0; i < els.length; i++) {
              var el = els[i];
              if (shouldDisableEl(el)) continue;
              var opts = buildPerElOptions(el);
              applyReveal(el, opts);
              if (!enableLiquidEffect) {
                applyFallback(el, opts);
              } else {
                applyLiquid(el, i, opts);
              }
            }
          },
          destroy: function() {
            try {
              if (revealObserver) revealObserver.disconnect();
            } catch (e) {
            }
            try {
              if (svgContainer && svgContainer.parentNode) {
                svgContainer.parentNode.removeChild(svgContainer);
              }
            } catch (e) {
            }
            try {
              if (style && style.parentNode) style.parentNode.removeChild(style);
            } catch (e) {
            }
            try {
              delete window[RT_NS];
            } catch (e) {
              window[RT_NS] = void 0;
            }
          }
        };
        return api2;
      }
      var api = makeApi();
      window[RT_NS] = api;
      api.refresh();
      if (debug) {
        try {
          console.log("[rt-liquid-glass] init:", {
            enableLiquidEffect,
            supportsBackdrop,
            isFirefox,
            disableFirefox,
            global: sanitizeOptionsForLog(
              readOptions(function() {
                return null;
              })
            )
          });
        } catch (e) {
        }
      }
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
    window[RT_NS] = window[RT_NS] || {
      __initialized: true,
      refresh: function() {
      },
      destroy: function() {
      }
    };
  })();
})();
//# sourceMappingURL=index.js.map
