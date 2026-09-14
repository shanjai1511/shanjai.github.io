/* ═══════════════════════════════════════════════════════
   Cookie consent banner
   Self-contained, site-wide (same injection pattern as
   chatbot.js). Analytics scripts already default to denied
   via Google Consent Mode v2 (set inline in <head> on every
   page) and Mixpanel's opt_out_tracking_by_default - this
   banner is what actually grants or keeps them denied, and
   is the only place AdSense gets loaded from (index.html only).
   ═══════════════════════════════════════════════════════ */
(function () {
    "use strict";

    if (document.getElementById("ccBanner")) return;

    const STORAGE_KEY = "sr_cookie_consent";
    const ROOT = window.CB_ROOT || "";
    const ADSENSE_SRC = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1169116962313138";

    function grant() {
        if (typeof window.gtag === "function") {
            window.gtag("consent", "update", {
                ad_storage: "granted",
                analytics_storage: "granted",
                ad_user_data: "granted",
                ad_personalization: "granted",
            });
        }
        if (window.mixpanel && typeof window.mixpanel.opt_in_tracking === "function") {
            window.mixpanel.opt_in_tracking();
        }
        // AdSense only runs on the page that declares the account meta tag.
        if (document.querySelector('meta[name="google-adsense-account"]') && !document.getElementById("adsbygoogleScript")) {
            const s = document.createElement("script");
            s.id = "adsbygoogleScript";
            s.async = true;
            s.crossOrigin = "anonymous";
            s.src = ADSENSE_SRC;
            document.head.appendChild(s);
        }
    }

    let stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (err) { /* private mode etc. */ }

    if (stored === "accepted") {
        grant();
        return;
    }
    if (stored === "declined") {
        return; // stays denied - nothing further to do
    }

    // No choice recorded yet - build and show the banner.
    const banner = document.createElement("div");
    banner.className = "cc-banner";
    banner.id = "ccBanner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie preferences");
    banner.innerHTML = `
        <p class="cc-text">This site uses cookies for analytics (and ads on the homepage) to understand how visitors use it. No data is sold. See the <a href="${ROOT}privacy.html">Privacy Policy</a> for details.</p>
        <div class="cc-actions">
            <button type="button" class="cc-btn cc-btn-accept" id="ccAccept">Accept</button>
            <button type="button" class="cc-btn cc-btn-decline" id="ccDecline">Essential only</button>
        </div>
    `;
    document.body.appendChild(banner);

    requestAnimationFrame(() => {
        setTimeout(() => banner.classList.add("is-open"), 900);
    });

    function dismiss(choice) {
        try { localStorage.setItem(STORAGE_KEY, choice); } catch (err) { /* private mode etc. */ }
        banner.classList.remove("is-open");
        setTimeout(() => banner.remove(), 450);
    }

    document.getElementById("ccAccept").addEventListener("click", () => { grant(); dismiss("accepted"); });
    document.getElementById("ccDecline").addEventListener("click", () => { dismiss("declined"); });
})();
